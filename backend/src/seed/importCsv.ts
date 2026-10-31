import { parse } from 'csv-parse/sync';
import { db } from '../repositories/db';

const code = (y: number) => String(y).slice(2) + String(y + 1).slice(2); // 2024 -> '2425'
const label = (y: number) => `${y}-${String(y + 1).slice(2)}`; // 2024 -> '2024-25'

// CSV cũ ghi năm 2 số (dd/mm/yy), CSV mới ghi 4 số
function isoDate(s: string) {
  const [d, m, y] = s.split('/');
  const year = y.length === 2 ? (Number(y) > 80 ? '19' : '20') + y : y;
  return `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

const teamId = (name: string) =>
  (db.prepare('INSERT INTO teams(name) VALUES (?) ON CONFLICT(name) DO UPDATE SET name = excluded.name RETURNING id')
    .get(name) as { id: number }).id;

type Row = { won: number; drawn: number; lost: number; gf: number; ga: number };

export async function importSeason(startYear: number): Promise<boolean> {
  const url = `https://www.football-data.co.uk/mmz4281/${code(startYear)}/E0.csv`;
  // football-data.co.uk trả file rỗng nếu request không giống trình duyệt (đã gặp khi thử bằng curl ở bước A1),
  // nên gửi kèm User-Agent kiểu trình duyệt; fetch của Node tự đi theo chuyển hướng (redirect).
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; mu-news-student-project)' }, redirect: 'follow' });
  if (!res.ok) {
    console.warn('Bỏ qua mùa', startYear, '→', res.status);
    return false;
  }
  const text = await res.text();
  // Kiểm tra trước khi ghi: file rỗng hoặc không phải CSV kết quả thì bỏ qua,
  // để không tạo dòng mùa giải rỗng (nếu tạo, seedIfEmpty() sẽ tưởng đã nạp xong và không nạp lại)
  if (!/^﻿?Div,Date,/.test(text) || !text.includes('HomeTeam')) {
    console.warn('Bỏ qua mùa', startYear, '→ nội dung CSV rỗng hoặc sai định dạng');
    return false;
  }
  const rows = parse(text, {
    columns: true, skip_empty_lines: true, bom: true, relax_column_count: true,
  }) as Record<string, string>[];

  const run = db.transaction(() => {
    const seasonId = (db.prepare(
      'INSERT INTO seasons(label, start_year) VALUES (?, ?) ON CONFLICT(label) DO UPDATE SET start_year = excluded.start_year RETURNING id'
    ).get(label(startYear), startYear) as { id: number }).id;

    db.prepare('DELETE FROM matches WHERE season_id = ?').run(seasonId);
    db.prepare('DELETE FROM season_standings WHERE season_id = ?').run(seasonId);

    const insert = db.prepare(`INSERT INTO matches
      (season_id, match_date, home_team_id, away_team_id, home_goals, away_goals, result, referee)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    const table = new Map<number, Row>();
    const bump = (id: number, gf: number, ga: number) => {
      const r = table.get(id) ?? { won: 0, drawn: 0, lost: 0, gf: 0, ga: 0 };
      r.gf += gf; r.ga += ga;
      if (gf > ga) r.won++; else if (gf === ga) r.drawn++; else r.lost++;
      table.set(id, r);
    };

    for (const r of rows) {
      if (!r.HomeTeam || r.FTHG === '' || r.FTHG === undefined) continue; // trận chưa đá
      const home = teamId(r.HomeTeam), away = teamId(r.AwayTeam);
      const hg = Number(r.FTHG), ag = Number(r.FTAG);
      insert.run(seasonId, isoDate(r.Date), home, away, hg, ag, r.FTR, r.Referee || null);
      bump(home, hg, ag);
      bump(away, ag, hg);
    }

    // xếp hạng: điểm, hiệu số bàn thắng, số bàn thắng
    const sorted = [...table.entries()]
      .map(([id, r]) => ({ id, ...r, points: r.won * 3 + r.drawn }))
      .sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);

    const put = db.prepare(`INSERT INTO season_standings
      (season_id, team_id, position, played, won, drawn, lost, goals_for, goals_against, points)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    sorted.forEach((t, i) =>
      put.run(seasonId, t.id, i + 1, t.won + t.drawn + t.lost, t.won, t.drawn, t.lost, t.gf, t.ga, t.points));
  });

  run();
  return true;
}

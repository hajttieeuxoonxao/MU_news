// Service BXH, trận đấu, câu lạc bộ (nguồn chính: football-data.org).
// Khi football-data.org lỗi (sai token, gói free bị chặn) thì dùng cách dự phòng nêu ở cuối bước A4:
// BXH và kết quả mùa hiện tại lấy từ CSV đã nạp vào SQLite (không theo thời gian thực).
import { cached } from '../lib/cache';
import { config } from '../config';
import { listHonours, listStaff } from '../repositories/club';
import { seasonDetail } from '../repositories/seasons';
import { currentStartYear } from '../seed';
import { fetchMatches, fetchStandings, fetchTeam } from '../adapters/footballData';

const seasonLabel = (iso: string) => { const y = Number(iso.slice(0, 4)); return `${y}-${String(y + 1).slice(2)}`; };
const currentLabel = () => seasonLabel(`${currentStartYear()}`);

function csvCurrentSeason() {
  const label = currentLabel();
  const d = seasonDetail(label);
  if (!d || d.table.length === 0) throw new Error('Chưa có dữ liệu CSV của mùa hiện tại');
  return { label, ...d };
}

export const getStandings = () => cached('standings', 300, async () => {
  try {
    const d = await fetchStandings();
    const total = d.standings.find((s: any) => s.type === 'TOTAL') ?? d.standings[0];
    return {
      season: seasonLabel(d.season.startDate),
      table: total.table.map((r: any) => ({
        position: r.position, team: r.team.shortName ?? r.team.name, crest: r.team.crest,
        played: r.playedGames, won: r.won, drawn: r.draw, lost: r.lost,
        gf: r.goalsFor, ga: r.goalsAgainst, points: r.points, isUnited: r.team.id === config.teamId,
      })),
    };
  } catch (err) {
    console.warn('BXH: dùng dữ liệu CSV dự phòng →', (err as Error).message);
    const c = csvCurrentSeason();
    return { season: c.label, table: c.table };
  }
});

const toMatch = (m: any) => ({
  id: m.id, date: m.utcDate, status: m.status, competition: m.competition?.name,
  home: m.homeTeam.shortName ?? m.homeTeam.name, away: m.awayTeam.shortName ?? m.awayTeam.name,
  homeGoals: m.score?.fullTime?.home ?? null, awayGoals: m.score?.fullTime?.away ?? null,
});

export async function getMatches(scope: 'upcoming' | 'results', limit: number) {
  if (scope === 'upcoming') {
    try {
      const d = await cached('matches:upcoming', 600, () => fetchMatches('SCHEDULED'));
      return d.matches.slice(0, limit).map(toMatch);
    } catch (err) {
      console.warn('Lịch sắp tới: nguồn lỗi, trả danh sách rỗng →', (err as Error).message);
      return [];
    }
  }
  try {
    const d = await cached('matches:results', 600, () => fetchMatches('FINISHED'));
    return d.matches.slice(-limit).reverse().map(toMatch); // gần nhất trước
  } catch (err) {
    console.warn('Kết quả: dùng dữ liệu CSV dự phòng →', (err as Error).message);
    const c = csvCurrentSeason();
    return c.matches.slice(-limit).reverse().map((m: any, i: number) => ({
      id: i + 1, date: m.date, status: 'FINISHED', competition: 'Premier League',
      home: m.home, away: m.away, homeGoals: m.homeGoals, awayGoals: m.awayGoals,
    }));
  }
}

export const getTeam = () => cached('team', 3600, async () => {
  const staff = listStaff();
  const honours = listHonours();
  try {
    const t = await fetchTeam();
    return {
      name: t.name, crest: t.crest, venue: t.venue, founded: t.founded,
      coach: t.coach?.name ?? null,
      competitions: (t.runningCompetitions ?? []).map((c: any) => ({ code: c.code, name: c.name, emblem: c.emblem })),
      staff, honours,
    };
  } catch (err) {
    console.warn('Thông tin đội: football-data.org lỗi, chỉ trả dữ liệu nhập tay →', (err as Error).message);
    const head = (staff as any[]).find((s) => s.role === 'Huấn luyện viên trưởng');
    return {
      name: 'Manchester United FC', crest: undefined, venue: undefined, founded: undefined,
      coach: head?.name ?? null, competitions: [], staff, honours,
    };
  }
});

export const getStaff = () => listStaff();

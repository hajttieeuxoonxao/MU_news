// Service đội hình và cầu thủ (nguồn: FPL)
import { cached } from '../lib/cache';
import { config } from '../config';
import { fetchBootstrap, fetchPlayerSummary } from '../adapters/fpl';

const POSITION: Record<number, string> = { 1: 'Thủ môn', 2: 'Hậu vệ', 3: 'Tiền vệ', 4: 'Tiền đạo' };
const STATUS: Record<string, string> = {
  a: 'Sẵn sàng', d: 'Còn nghi ngờ', i: 'Chấn thương', s: 'Treo giò', u: 'Không khả dụng', n: 'Ngoài danh sách',
};

const bootstrap = () => cached('fpl:bootstrap', 600, fetchBootstrap);

export async function getSquad() {
  const data = await bootstrap();
  const unitedId = data.teams.find((t: any) => t.short_name === config.fplShort)?.id;
  const players = data.elements
    .filter((e: any) => e.team === unitedId)
    .map((e: any) => ({
      id: e.id,
      name: `${e.first_name} ${e.second_name}`,
      shortName: e.web_name,
      position: POSITION[e.element_type],
      positionOrder: e.element_type,
      status: STATUS[e.status] ?? e.status,
      news: e.news || null,
      stats: { minutes: e.minutes, goals: e.goals_scored, assists: e.assists, cleanSheets: e.clean_sheets,
               yellow: e.yellow_cards, red: e.red_cards },
    }))
    .sort((a: any, b: any) => a.positionOrder - b.positionOrder || b.stats.minutes - a.stats.minutes);
  return { updatedAt: new Date().toISOString(), players };
}

export async function getPlayer(id: number) {
  const squad = await getSquad();
  const profile = squad.players.find((p: any) => p.id === id);
  if (!profile) return null; // chỉ cho xem cầu thủ MU, không làm cổng chuyển tiếp cho FPL
  const summary = await cached(`fpl:player:${id}`, 3600, () => fetchPlayerSummary(id));
  const pastSeasons = (summary.history_past ?? []).map((s: any) => ({
    season: s.season_name, minutes: s.minutes, goals: s.goals_scored, assists: s.assists,
    cleanSheets: s.clean_sheets, yellow: s.yellow_cards, red: s.red_cards,
  }));
  return { profile, season: profile.stats, pastSeasons };
}

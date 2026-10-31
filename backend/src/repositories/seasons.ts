import { db } from './db';
import { config } from '../config';

export function listSeasons() {
  return db.prepare(`
    SELECT s.label AS season, st.position, st.points, st.played, st.won, st.drawn, st.lost,
           st.goals_for AS gf, st.goals_against AS ga
    FROM season_standings st
    JOIN seasons s ON s.id = st.season_id
    JOIN teams t ON t.id = st.team_id
    WHERE t.name = ?
    ORDER BY s.start_year DESC`).all(config.csvTeamName);
}

export function seasonDetail(label: string) {
  const season = db.prepare('SELECT id FROM seasons WHERE label = ?').get(label) as { id: number } | undefined;
  if (!season) return null;
  const table = db.prepare(`
    SELECT st.position, t.name AS team, st.played, st.won, st.drawn, st.lost,
           st.goals_for AS gf, st.goals_against AS ga, st.points, (t.name = ?) AS isUnited
    FROM season_standings st JOIN teams t ON t.id = st.team_id
    WHERE st.season_id = ? ORDER BY st.position`).all(config.csvTeamName, season.id)
    .map((r: any) => ({ ...r, isUnited: !!r.isUnited }));
  const matches = db.prepare(`
    SELECT m.match_date AS date, h.name AS home, a.name AS away,
           m.home_goals AS homeGoals, m.away_goals AS awayGoals
    FROM matches m
    JOIN teams h ON h.id = m.home_team_id JOIN teams a ON a.id = m.away_team_id
    WHERE m.season_id = ? AND (h.name = ? OR a.name = ?) ORDER BY m.match_date`)
    .all(season.id, config.csvTeamName, config.csvTeamName);
  return { summary: table.find((r: any) => r.isUnited) ?? null, table, matches };
}

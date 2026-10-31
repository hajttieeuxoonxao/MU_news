// Adapter 1: football-data.org (BXH, lịch, đội). Chỉ biết cách gọi nguồn, không chứa logic nghiệp vụ.
import { config } from '../config';

const BASE = 'https://api.football-data.org/v4';

async function fd(path: string): Promise<any> {
  const res = await fetch(BASE + path, { headers: { 'X-Auth-Token': config.fdToken } });
  if (!res.ok) throw new Error(`football-data.org ${res.status} ${path}`);
  return res.json();
}

export const fetchTeam = () => fd(`/teams/${config.teamId}`);
export const fetchStandings = () => fd('/competitions/PL/standings');
export const fetchMatches = (status: 'SCHEDULED' | 'FINISHED') =>
  fd(`/teams/${config.teamId}/matches?status=${status}`);

// Adapter 2: Fantasy Premier League API (đội hình, cầu thủ). Không cần key, không chính thức.
const FPL = 'https://fantasy.premierleague.com/api';

async function fpl(path: string): Promise<any> {
  const res = await fetch(FPL + path, { headers: { 'User-Agent': 'mu-news-student-project' } });
  if (!res.ok) throw new Error(`FPL ${res.status} ${path}`);
  return res.json();
}

export const fetchBootstrap = () => fpl('/bootstrap-static/');
export const fetchPlayerSummary = (id: number) => fpl(`/element-summary/${id}/`);

// Kiểu dữ liệu bám sát hợp đồng API (docs/report/api-contract.md)
export type NewsItem = {
  id: string; title: string; summary: string; image?: string;
  link: string; publishedAt: string; source: string; isTransfer: boolean;
};
export type Stats = { minutes: number; goals: number; assists: number; cleanSheets: number; yellow: number; red: number };
export type Player = {
  id: number; name: string; shortName: string; position: string;
  status: string; news: string | null; stats: Stats;
};
export type PastSeasonStat = Stats & { season: string };
export type PlayerDetail = { profile: Player; season: Stats; pastSeasons: PastSeasonStat[] };
export type Match = {
  id: number; date: string; status: string; competition?: string;
  home: string; away: string; homeGoals: number | null; awayGoals: number | null;
};
export type StandingRow = {
  position: number; team: string; crest?: string; played: number; won: number; drawn: number;
  lost: number; gf: number; ga: number; points: number; isUnited: boolean;
};
export type Staff = { name: string; role: string; nationality: string | null; since: string | null; source: string };
export type Honour = { competition: string; titles: number; lastWon: string | null; source: string };
export type Team = {
  name: string; crest?: string; venue?: string; founded?: number; coach: string | null;
  competitions: { code: string; name: string; emblem?: string }[];
  staff: Staff[]; honours: Honour[];
};

// Phần lịch sử mùa giải (bước A8)
export type SeasonRow = {
  season: string; position: number; points: number; played: number;
  won: number; drawn: number; lost: number; gf: number; ga: number;
};
export type TableRow = Omit<StandingRow, 'crest'>;
export type PastMatch = { date: string; home: string; away: string; homeGoals: number | null; awayGoals: number | null };
export type SeasonDetail = { summary: TableRow | null; table: TableRow[]; matches: PastMatch[] };

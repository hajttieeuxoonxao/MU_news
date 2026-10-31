// Lớp Router: nhận URL, kiểm tra tham số, gọi service, trả về khung { status, message, data }
import { NextFunction, Request, Response, Router } from 'express';
import { fail, ok } from '../lib/respond';
import { listSeasons, seasonDetail } from '../repositories/seasons';
import { getNews } from '../services/newsService';
import { getPlayer, getSquad } from '../services/squadService';
import { getMatches, getStaff, getStandings, getTeam } from '../services/clubService';

const api = Router();

// Bọc hàm async để lỗi bất đồng bộ chuyển sang trình xử lý lỗi chung, không làm sập server
const asyncRoute = (fn: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res).catch(next);

// Ép tham số về số nguyên trong khoảng cho phép, sai thì dùng giá trị mặc định
const intParam = (v: unknown, def: number, min: number, max: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : def;
};

api.get('/health', (_req, res) => ok(res, { time: new Date().toISOString() }));

// Tin tức
api.get('/news', asyncRoute(async (req, res) => {
  const type = req.query.type === 'transfer' ? 'transfer' : 'all';
  ok(res, await getNews(type, intParam(req.query.limit, 20, 1, 50)));
}));

// Câu lạc bộ, ban huấn luyện
api.get('/team', asyncRoute(async (_req, res) => { ok(res, await getTeam()); }));
api.get('/staff', (_req, res) => ok(res, getStaff()));

// Đội hình, cầu thủ
api.get('/squad', asyncRoute(async (_req, res) => { ok(res, await getSquad()); }));
api.get('/players/:id', asyncRoute(async (req, res) => {
  const id = Number(req.params.id);
  const player = Number.isInteger(id) ? await getPlayer(id) : null;
  if (!player) return void fail(res, 404, 'Không tìm thấy cầu thủ');
  ok(res, player);
}));

// Trận đấu, BXH hiện tại
api.get('/matches', asyncRoute(async (req, res) => {
  const scope = req.query.scope === 'results' ? 'results' : 'upcoming';
  ok(res, await getMatches(scope, intParam(req.query.limit, 10, 1, 50)));
}));
api.get('/standings', asyncRoute(async (_req, res) => { ok(res, await getStandings()); }));

// Lịch sử mùa giải (SQLite)
api.get('/seasons', (_req, res) => ok(res, listSeasons()));
api.get('/seasons/:season', (req, res) => {
  const d = seasonDetail(req.params.season);
  return d ? ok(res, d) : fail(res, 404, 'Không có mùa giải này');
});

export default api;

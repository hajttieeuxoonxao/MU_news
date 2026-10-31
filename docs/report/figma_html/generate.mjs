// Tạo bản HTML của các màn hình app MU News để nhập vào Figma bằng plugin html.to.design.
//
// Cách chạy (trong thư mục docs/report/figma_html):
//   node generate.mjs                              → dùng sample-data.json (dữ liệu minh họa)
//   node generate.mjs http://localhost:3000/api    → lấy dữ liệu thật từ backend đang chạy
//
// Kết quả: out/all_screens.html (tất cả màn hình trên một trang) và out/screens/*.html (mỗi màn một file).
// Không cần cài thư viện nào (Node.js 20+).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ICONS = JSON.parse(fs.readFileSync(path.join(here, 'icons.json'), 'utf8'));
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(here, p), 'utf8'));
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- dữ liệu ----------
async function loadData(api) {
  const sample = readJson('sample-data.json');
  const staff = readJson('../../../backend/data/staff.json');
  const honours = readJson('../../../backend/data/honours.json');
  const base = { ...sample, staff, honours, source: 'Dữ liệu minh họa (sample-data.json)' };
  if (!api) return base;

  const get = async (p) => {
    const res = await fetch(api.replace(/\/$/, '') + p);
    const body = await res.json();
    if (body.status !== 'success') throw new Error(`${p}: ${body.message}`);
    return body.data;
  };
  const ago = (iso) => Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  const when = (iso) => new Date(iso).toLocaleString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const d = { ...base, source: `Dữ liệu thật từ ${api} lúc ${new Date().toLocaleString('vi-VN')}` };
  const tryGet = async (label, fn) => { try { await fn(); } catch (e) { console.warn(`! ${label}: ${e.message} → giữ dữ liệu minh họa`); } };

  await tryGet('news', async () => {
    d.news = (await get('/news?limit=8')).map((n) => ({ ...n, minutesAgo: ago(n.publishedAt), imageUrl: n.image, image: !!n.image }));
  });
  await tryGet('squad', async () => {
    const s = await get('/squad');
    d.players = s.players.map((p) => ({ id: p.id, name: p.name, position: p.position, status: p.status, goals: p.stats.goals, news: p.news }));
    const pick = s.players.find((p) => p.position === 'Tiền đạo') ?? s.players[0];
    const det = await get(`/players/${pick.id}`);
    d.playerDetail = { profile: det.profile, season: det.season, pastSeasons: det.pastSeasons };
  });
  await tryGet('team', async () => { const t = await get('/team'); d.staff = t.staff; d.honours = t.honours; });
  await tryGet('matches', async () => {
    d.upcoming = (await get('/matches?scope=upcoming&limit=6')).map((m) => ({ ...m, date: when(m.date) }));
    d.results = (await get('/matches?scope=results&limit=6')).map((m) => ({ ...m, date: when(m.date), hg: m.homeGoals, ag: m.awayGoals }));
  });
  await tryGet('standings', async () => {
    const s = await get('/standings');
    d.standingsSeason = s.season;
    d.standings = s.table.map((r) => [r.team, r.played, r.won, r.drawn, r.lost, r.gf, r.ga, r.points, r.isUnited]);
  });
  await tryGet('seasons', async () => {
    const s = await get('/seasons');
    d.seasons = s.map((r) => [r.season, r.position, r.points, r.played, r.won, r.drawn, r.lost]);
    const label = s.find((r) => r.season === '2012-13')?.season ?? s[1]?.season ?? s[0].season;
    const det = await get(`/seasons/${label}`);
    d.seasonDetailLabel = label;
    d.seasonTable = det.table.map((r) => [r.team, r.played, r.won, r.drawn, r.lost, r.gf, r.ga, r.points, r.isUnited]);
    d.seasonMatches = det.matches.map((m) => [m.date, m.home, m.away, m.homeGoals, m.awayGoals]);
  });
  return d;
}

// ---------- mảnh giao diện ----------
const icon = (name, color, size = 24) =>
  `<span class="ic" style="width:${size}px;height:${size}px">${ICONS[name]
    .replace('width="24" height="24"', `width="${size}" height="${size}" fill="${color}"`) // phần không ghi fill sẽ lấy màu này
    .replace(/currentColor/g, color)}</span>`;

const timeAgo = (m) => (m < 60 ? `${m} phút trước` : m < 1440 ? `${Math.round(m / 60)} giờ trước` : `${Math.round(m / 1440)} ngày trước`);
const statusBar = (tone) => `<div class="status ${tone}"><span>9:41</span><span>100%</span></div>`;
const tabHeader = (title) => `${statusBar('red')}<div class="hdr-tab">${esc(title)}</div>`;
const stackHeader = (title) => `${statusBar('surface')}<div class="hdr-stack">${icon('arrow-back', 'var(--text)')}<span>${esc(title)}</span></div>`;
const TABS = [['Tin tức', 'newspaper-outline'], ['Đội hình', 'people-outline'], ['Trận đấu', 'football-outline'], ['BXH', 'podium-outline'], ['Lịch sử', 'time-outline']];
const tabBar = (active) => `<div class="tabbar">${TABS.map(([t, i]) => {
  const c = t === active ? 'var(--red)' : 'var(--text2)';
  return `<div class="tab">${icon(i, c)}<span style="color:${c}">${t}</span></div>`;
}).join('')}</div>`;
const chip = (label, active) => `<div class="chip ${active ? 'on' : ''}">${esc(label)}</div>`;
const search = (text) => `<div class="search">${icon('search-outline', 'var(--text2)', 18)}<span class="q ${text ? 'typed' : ''}">${esc(text || 'Tìm trong tin tức…')}</span>${text ? icon('close-circle', 'var(--text2)', 18) : ''}</div>`;

const newsCard = (n, saved) => `<div class="card news">
  ${n.image ? (n.imageUrl ? `<img class="thumb" src="${esc(n.imageUrl)}" alt="">` : `<div class="thumb">${icon('image-outline', 'var(--text2)', 32)}</div>`) : ''}
  <div class="news-body">
    <div class="title">${esc(n.title)}</div>
    <div class="summary">${esc(n.summary)}</div>
    <div class="meta"><span>${esc(n.source)} · ${timeAgo(n.minutesAgo)}${n.isTransfer ? ' · Chuyển nhượng' : ''}</span>${icon(saved ? 'bookmark' : 'bookmark-outline', 'var(--red)', 22)}</div>
  </div></div>`;
const row = (title, sub, right) => `<div class="card row"><div class="row-main"><div class="row-title">${esc(title)}</div>${sub ? `<div class="row-sub">${esc(sub)}</div>` : ''}</div>${right ? `<div class="row-right">${esc(right)}</div>` : ''}</div>`;
const matchCard = (m) => `<div class="card match"><div class="row-sub small">${esc(m.competition)} - ${esc(m.date)}</div><div class="row-title">${esc(m.home)} ${m.hg != null ? `${m.hg} - ${m.ag}` : 'vs'} ${esc(m.away)}</div></div>`;
const leagueTable = (rows) => `<div class="table"><div class="tr th"><span class="pos">#</span><span class="team">Đội</span>${['Tr', 'T', 'H', 'B', 'BT', 'BB', 'Đ'].map((h) => `<span class="num">${h}</span>`).join('')}</div>
  ${rows.map((r, i) => { const united = r[8] ?? r[0] === 'Man United'; return `<div class="tr ${united ? 'mu' : ''}"><span class="pos">${i + 1}</span><span class="team">${esc(r[0])}</span>${r.slice(1, 8).map((v, k) => `<span class="num ${k === 6 ? 'b' : ''}">${v}</span>`).join('')}</div>`; }).join('')}</div>`;
const stateBox = (kind) => kind === 'loading'
  ? `<div class="state"><div class="spinner"></div></div>`
  : kind === 'error'
    ? `<div class="state">${icon('cloud-offline-outline', 'var(--text2)', 48)}<div class="state-text">Không kết nối được.<br>Kiểm tra mạng rồi thử lại.</div><div class="btn">Thử lại</div></div>`
    : `<div class="state">${icon('file-tray-outline', 'var(--text2)', 48)}<div class="state-text">Chưa có dữ liệu.</div></div>`;

const screen = (id, name, body, dark = false) => ({ id, name, html: `<div class="screen ${dark ? 'dark' : ''}" data-name="${esc(name)}">${body}</div>` });

function buildScreens(d) {
  const S = [];
  const newsTop = (type, q) => `<div class="bar">${chip('Tất cả', type === 'all')}${chip('Chuyển nhượng', type === 'transfer')}<span class="grow"></span><span class="link">Đã lưu</span></div>${search(q)}`;
  const newsAll = `${tabHeader('Tin tức')}<div class="content">${newsTop('all', '')}<div class="list">${d.news.map((n, i) => newsCard(n, i === 1)).join('')}</div></div>${tabBar('Tin tức')}`;
  S.push(screen('01', 'Tin tức', newsAll));
  const transfers = d.news.filter((n) => n.isTransfer);
  S.push(screen('02', 'Tin tức - Chuyển nhượng + tìm kiếm', `${tabHeader('Tin tức')}<div class="content">${newsTop('transfer', 'bid')}<div class="list">${transfers.slice(0, 1).map((n) => newsCard(n, true)).join('')}</div></div>${tabBar('Tin tức')}`));
  S.push(screen('03', 'Bài đã lưu', `${stackHeader('Bài đã lưu')}<div class="content"><div class="list pt">${d.news.filter((n) => n.isTransfer).slice(0, 2).map((n) => newsCard(n, true)).join('')}</div></div>`));

  const groups = [];
  for (const p of d.players) { const g = groups.at(-1); if (g && g.title === p.position) g.items.push(p); else groups.push({ title: p.position, items: [p] }); }
  S.push(screen('04', 'Đội hình - Cầu thủ', `${tabHeader('Đội hình')}<div class="content"><div class="bar">${chip('Cầu thủ', true)}${chip('Ban huấn luyện', false)}</div><div class="list">${groups.map((g) => `<div class="section">${esc(g.title)} (${g.items.length})</div>${g.items.map((p) => row(p.name, p.status, `${p.goals} bàn`)).join('')}`).join('')}</div></div>${tabBar('Đội hình')}`));
  S.push(screen('05', 'Đội hình - Ban huấn luyện', `${tabHeader('Đội hình')}<div class="content"><div class="bar">${chip('Cầu thủ', false)}${chip('Ban huấn luyện', true)}</div><div class="list">${d.staff.map((s) => row(s.name, s.role, s.nationality ?? '')).join('')}</div></div>${tabBar('Đội hình')}`));
  const pd = d.playerDetail;
  const line = (label, s) => `<div class="stat"><span class="stat-label">${esc(label)}</span><span class="num2">${s.minutes}'</span><span class="num2">${s.goals}</span><span class="num2">${s.assists}</span></div>`;
  S.push(screen('06', 'Chi tiết cầu thủ', `${stackHeader('Cầu thủ')}<div class="content surface"><div class="detail"><div class="h-xl">${esc(pd.profile.name)}</div><div class="row-sub">${esc(pd.profile.position)} · ${esc(pd.profile.status)}</div>${pd.profile.news ? `<div class="injury">${esc(pd.profile.news)}</div>` : ''}<div class="stat-head">Phút thi đấu · Bàn thắng · Kiến tạo</div>${line('Mùa này', pd.season)}${pd.pastSeasons.map((s) => line(s.season, s)).join('')}</div></div>`));

  const matchesScreen = (scope) => `${tabHeader('Trận đấu')}<div class="content"><div class="bar">${chip('Sắp tới', scope === 'up')}${chip('Kết quả', scope === 'res')}</div><div class="list">${(scope === 'up' ? d.upcoming : d.results).map(matchCard).join('')}</div></div>${tabBar('Trận đấu')}`;
  S.push(screen('07', 'Trận đấu - Sắp tới', matchesScreen('up')));
  S.push(screen('08', 'Trận đấu - Kết quả', matchesScreen('res')));
  const tableScreen = `${tabHeader('BXH')}<div class="content"><div class="h-sec">Premier League ${esc(d.standingsSeason)}</div>${leagueTable(d.standings)}</div>${tabBar('BXH')}`;
  S.push(screen('09', 'BXH', tableScreen));
  S.push(screen('10', 'Lịch sử', `${tabHeader('Lịch sử')}<div class="content"><div class="block"><div class="h-sec np">Danh hiệu</div>${d.honours.map((h) => `<div class="honour">${esc(h.competition)}: ${h.titles} lần${h.lastWon ? ` (gần nhất ${esc(h.lastWon)})` : ''}</div>`).join('')}<div class="h-sec np mt">Các mùa giải Premier League</div></div><div class="list">${d.seasons.map((s) => `<div class="card row"><div class="row-title">${s[0]}</div><div class="row-right dark">Hạng ${s[1]} - ${s[2]} điểm (${s[4]}T ${s[5]}H ${s[6]}B)</div></div>`).join('')}</div></div>${tabBar('Lịch sử')}`));
  const seasonTable = d.seasonTable ?? d.standings.map((r) => [r[0], 38, ...r.slice(2)]);
  S.push(screen('11', 'Chi tiết mùa giải', `${stackHeader('Mùa giải')}<div class="content"><div class="h-lg">Mùa ${esc(d.seasonDetailLabel)}</div>${leagueTable(seasonTable)}<div class="h-sec">Các trận của Manchester United</div>${d.seasonMatches.map((m) => `<div class="pm">${m[0]}  ${esc(m[1])} ${m[3]} - ${m[4]} ${esc(m[2])}</div>`).join('')}</div>`));
  S.push(screen('12', 'Trạng thái - Đang tải', `${tabHeader('Tin tức')}<div class="content">${stateBox('loading')}</div>${tabBar('Tin tức')}`));
  S.push(screen('13', 'Trạng thái - Lỗi mạng', `${tabHeader('BXH')}<div class="content">${stateBox('error')}</div>${tabBar('BXH')}`));
  S.push(screen('14', 'Trạng thái - Chưa có dữ liệu', `${tabHeader('Trận đấu')}<div class="content"><div class="bar">${chip('Sắp tới', true)}${chip('Kết quả', false)}</div>${stateBox('empty')}</div>${tabBar('Trận đấu')}`));
  S.push(screen('15', 'Tin tức - Chế độ tối', newsAll, true));
  S.push(screen('16', 'BXH - Chế độ tối', tableScreen, true));
  return S;
}

// ---------- CSS (khớp src/theme.ts và các màn hình trong code) ----------
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Roboto,Arial,sans-serif;background:#E9E9E9;color:#1B1B1B}
.screen{--red:#DA291C;--bg:#F5F5F5;--surface:#FFFFFF;--text:#1B1B1B;--text2:#6B6B6B;--hl:#FBE3E1;--thead:#1B1B1B;--border:#EBEBEB;
  width:360px;height:800px;overflow:hidden;display:flex;flex-direction:column;background:var(--bg);color:var(--text);font-size:14px;line-height:20px}
.screen.dark{--bg:#121212;--surface:#1E1E1E;--text:#F2F2F2;--text2:#A3A3A3;--hl:#4A1F1C;--thead:#000000;--border:#2C2C2C}
.ic{display:inline-flex;flex:none}.ic svg{display:block}
.status{height:24px;flex:none;display:flex;justify-content:space-between;align-items:center;padding:0 16px;font-size:12px}
.status.red{background:var(--red);color:#fff}.status.surface{background:var(--surface);color:var(--text)}
.hdr-tab{height:56px;flex:none;display:flex;align-items:center;padding:0 16px;background:var(--red);color:#fff;font-size:20px;font-weight:500}
.hdr-stack{height:56px;flex:none;display:flex;align-items:center;gap:24px;padding:0 16px;background:var(--surface);border-bottom:1px solid var(--border);font-size:20px;font-weight:500}
.content{flex:1;overflow:hidden;display:flex;flex-direction:column}.content.surface{background:var(--surface)}
.tabbar{height:56px;flex:none;display:flex;background:var(--surface);border-top:1px solid var(--border)}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:11px;font-weight:500;line-height:14px}
.bar{display:flex;align-items:center;gap:8px;padding:12px 12px 0}.grow{flex:1}.link{color:var(--red);font-weight:600}
.chip{padding:6px 14px;border-radius:16px;background:var(--surface);color:var(--text)}.chip.on{background:var(--red);color:#fff}
.search{display:flex;align-items:center;gap:8px;margin:12px;padding:10px 12px;border-radius:10px;background:var(--surface);color:var(--text2)}
.search .q{flex:1}.search .typed{color:var(--text)}
.list{display:flex;flex-direction:column;padding-bottom:12px}.list.pt{padding-top:6px}.bar+.list{padding-top:8px}
.card{background:var(--surface);margin:4px 12px;border-radius:8px}
.card.news{margin:6px 12px;border-radius:10px;overflow:hidden}
.thumb{height:160px;background:#D9D9D9;display:flex;align-items:center;justify-content:center;width:100%;object-fit:cover}
.dark .thumb{background:#2E2E2E}
.news-body{padding:12px;display:flex;flex-direction:column;gap:6px}
.title{font-size:16px;line-height:22px;font-weight:700}
.summary{color:var(--text2);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.meta{display:flex;justify-content:space-between;align-items:center;margin-top:4px;color:var(--text2);font-size:12px;line-height:16px}
.row{display:flex;justify-content:space-between;align-items:center;padding:14px}
.row-main{display:flex;flex-direction:column;gap:2px}.row-title{font-weight:600}.row-sub{color:var(--text2)}.row-sub.small{font-size:12px;line-height:16px}
.row-right{color:var(--text2)}.row-right.dark{color:var(--text)}
.match{padding:14px;display:flex;flex-direction:column;gap:4px}.match .row-title{font-weight:700}
.section{padding:12px 16px 4px;font-weight:700;color:var(--red)}
.h-sec{padding:12px;font-weight:700}.h-sec.np{padding:0 0 6px}.h-sec.mt{margin-top:16px}
.h-lg{padding:12px;font-size:18px;line-height:24px;font-weight:800}
.h-xl{font-size:22px;line-height:28px;font-weight:800}
.block{padding:12px;display:flex;flex-direction:column}.honour{margin:2px 0}
.table{display:flex;flex-direction:column}
.tr{display:flex;align-items:center;padding:10px;background:var(--surface);border-bottom:1px solid var(--border)}
.tr.th{background:var(--thead);color:#fff;border-bottom:none}.tr.mu{background:var(--hl)}.tr.mu .team{font-weight:700}
.pos{width:28px;flex:none}.team{flex:1}.num{width:30px;flex:none;text-align:right}.num.b{font-weight:700}
.detail{padding:16px;display:flex;flex-direction:column;gap:4px}.injury{color:var(--red);margin-top:4px}
.stat-head{font-weight:700;margin-top:16px}
.stat{display:flex;padding:6px 0;border-bottom:1px solid var(--border)}.stat-label{flex:2}.num2{flex:1;text-align:right}
.pm{padding:4px 12px}
.state{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center}
.spinner{width:36px;height:36px;border-radius:50%;border:4px solid var(--hl);border-top-color:var(--red)}
.btn{background:var(--red);color:#fff;font-weight:600;padding:10px 20px;border-radius:8px}
/* trang tổng hợp */
.page{width:1664px;background:#E9E9E9;padding:40px;display:flex;flex-direction:column;gap:32px}
.page h1{font-size:28px}.page p{color:#555;max-width:900px}
.grid{display:flex;flex-wrap:wrap;gap:48px}
.item{display:flex;flex-direction:column;gap:12px}.label{font-size:16px;font-weight:700}
.shadow{box-shadow:0 2px 12px rgba(0,0,0,.12)}
`;

const doc = (title, body, bg = '#E9E9E9') => `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title>
<style>${CSS}</style></head><body style="background:${bg}">${body}</body></html>
`;

// ---------- chạy ----------
const api = process.argv[2];
const data = await loadData(api);
const screens = buildScreens(data);
const out = path.join(here, 'out');
fs.mkdirSync(path.join(out, 'screens'), { recursive: true });
for (const f of fs.readdirSync(path.join(out, 'screens'))) fs.unlinkSync(path.join(out, 'screens', f));
for (const s of screens) {
  const file = `${s.id}_${s.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^A-Za-z0-9]+/g, '_').replace(/_+$/, '').toLowerCase()}.html`;
  fs.writeFileSync(path.join(out, 'screens', file), doc(`${s.id} ${s.name}`, s.html, '#FFFFFF'));
}
const all = `<div class="page"><h1>MU News – Thiết kế giao diện (360 × 800)</h1>
<p>${esc(data.source)}. Màn 01–14: chế độ Sáng; 15–16: chế độ Tối. Màu, cỡ chữ, khoảng cách khớp <code>mu-news-app/src/theme.ts</code>.</p>
<div class="grid">${screens.map((s) => `<div class="item"><div class="label">${s.id}. ${esc(s.name)}</div><div class="shadow">${s.html}</div></div>`).join('')}</div></div>`;
fs.writeFileSync(path.join(out, 'all_screens.html'), doc('MU News - Screens', all));
console.log(`Đã tạo ${screens.length} màn hình → ${path.relative(process.cwd(), out)}`);
console.log(`Nguồn dữ liệu: ${data.source}`);

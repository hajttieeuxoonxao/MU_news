// Service tin tức: gộp nhiều RSS, loại bài đội nữ/đội trẻ, bỏ trùng, gắn cờ chuyển nhượng.
import { createHash } from 'node:crypto';
import { cached } from '../lib/cache';
import { fetchFeed, RssItem } from '../adapters/rss';

const FEEDS = [
  { source: 'manutd.com', url: 'https://www.manutd.com/Feeds/NewsSecondRSSFeed' },
  { source: 'Football365', url: 'https://www.football365.com/manchester-united/rss2' },
  { source: 'CaughtOffside', url: 'https://www.caughtoffside.com/tags/premier-league/manchester-united/feed/' },
];

// Từ khóa đã chỉnh theo 85 tiêu đề RSS thật ngày 31/10/2026 (docs/report/spike/):
// - EXCLUDE thêm "U21s/U18s" (có chữ s), "WSL" (giải nữ); "women" bắt cả "Women’s"
// - TRANSFER thêm các từ báo hay dùng cho tin chuyển nhượng: target, linked, monitor, eye, raid, exit…
const EXCLUDE = /\b(women|womens|wsl|u-?(?:18|19|21|23)s?|under-?(?:18|19|21|23)s?|academy)\b/i;
const TRANSFER = /\b(transfers?|signings?|signs?|signed|loan|bid|fee|release clause|contract|swap|agree[sd]?|deal|targets?|linked|links|monitor(?:s|ing)?|eyes?|hunt|raid|swoop|exit|joining|move)\b/i;

async function loadAll() {
  const results = await Promise.allSettled(FEEDS.map((f) => fetchFeed(f.url, f.source)));
  const items = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
  if (items.length === 0) throw new Error('Không nguồn RSS nào trả dữ liệu'); // để cache trả bản cũ

  const seen = new Set<string>();
  return items
    .filter((i) => !EXCLUDE.test(`${i.title} ${i.summary}`))
    .filter((i) => { const k = i.title.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 80)
    .map((i: RssItem) => ({
      id: createHash('sha1').update(i.link).digest('hex').slice(0, 12),
      ...i,
      isTransfer: TRANSFER.test(`${i.title} ${i.summary}`),
    }));
}

export async function getNews(type: 'all' | 'transfer', limit: number) {
  const items = await cached('news', 300, loadAll);
  return (type === 'transfer' ? items.filter((i) => i.isTransfer) : items).slice(0, limit);
}

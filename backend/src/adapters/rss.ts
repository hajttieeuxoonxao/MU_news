// Adapter 3: RSS (tin tức). Đọc XML, trả về kiểu RssItem thống nhất cho mọi báo.
import { XMLParser } from 'fast-xml-parser';

export type RssItem = {
  title: string; summary: string; image?: string; link: string; publishedAt: string; source: string;
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });

// Một số báo (Football365) mã hóa ký tự hai lần, ví dụ "&#8216;" thay cho dấu ‘ → giải mã về ký tự thật
const NAMED: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  ndash: '–', mdash: '—', hellip: '…', pound: '£', euro: '€',
};
const decode = (s: string) => {
  for (let i = 0; i < 2 && s.includes('&'); i++) {
    s = s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&([a-z]+);/gi, (m, name) => NAMED[name.toLowerCase()] ?? m);
  }
  return s;
};
const strip = (s: string) => decode(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

export async function fetchFeed(url: string, source: string): Promise<RssItem[]> {
  const res = await fetch(url, { headers: { 'User-Agent': 'mu-news-student-project' } });
  if (!res.ok) throw new Error(`RSS ${source} ${res.status}`);
  const raw = parser.parse(await res.text())?.rss?.channel?.item ?? [];
  return (Array.isArray(raw) ? raw : [raw]).map((it: any) => {
    const html = String(it['content:encoded'] ?? it.description ?? '');
    const date = new Date(it.pubDate);
    return {
      title: strip(String(it.title ?? '')),
      summary: strip(String(it.description ?? '')).slice(0, 280),
      image: it.enclosure?.url ?? it['media:thumbnail']?.url ?? it['media:content']?.url
        ?? html.match(/<img[^>]+src="([^"]+)"/)?.[1],
      link: String(it.link),
      publishedAt: Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
      source,
    };
  });
}

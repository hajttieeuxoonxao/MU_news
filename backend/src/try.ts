// File thử nhanh từng service (bước A4). Chạy: npx tsx src/try.ts
// Mỗi hàm phải in ra dữ liệu thật. Không dùng trong server.
import { getNews } from './services/newsService';
import { getSquad } from './services/squadService';
import { getMatches, getStandings, getTeam } from './services/clubService';

const show = async (name: string, fn: () => Promise<unknown>) => {
  try {
    const data = await fn();
    console.log(`\n=== ${name} ===`);
    console.dir(data, { depth: 2, maxArrayLength: 5 });
  } catch (e) {
    console.error(`\n=== ${name} LỖI ===`, (e as Error).message);
  }
};

await show('getNews(all, 5)', () => getNews('all', 5));
await show('getNews(transfer, 5)', () => getNews('transfer', 5));
await show('getSquad()', () => getSquad());
await show('getStandings()', () => getStandings());
await show('getMatches(upcoming, 3)', () => getMatches('upcoming', 3));
await show('getMatches(results, 3)', () => getMatches('results', 3));
await show('getTeam()', () => getTeam());

import fs from 'node:fs';
import { db } from '../repositories/db';
import { importSeason } from './importCsv';

const FIRST_YEAR = 2010; // mùa 2010-11
export const currentStartYear = () => {
  const now = new Date();
  return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
};

function importJson() {
  const staff = JSON.parse(fs.readFileSync('data/staff.json', 'utf8'));
  const honours = JSON.parse(fs.readFileSync('data/honours.json', 'utf8'));
  db.exec('DELETE FROM staff; DELETE FROM honours;');
  const s = db.prepare('INSERT INTO staff(name, role, nationality, since, source, checked_at) VALUES (@name, @role, @nationality, @since, @source, @checkedAt)');
  const h = db.prepare('INSERT INTO honours(competition, titles, last_won, source) VALUES (@competition, @titles, @lastWon, @source)');
  db.transaction(() => { staff.forEach((x: object) => s.run(x)); honours.forEach((x: object) => h.run(x)); })();
}

export async function seedIfEmpty() {
  importJson();
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM seasons').get() as { n: number };
  if (n === 0) {
    for (let y = FIRST_YEAR; y <= currentStartYear(); y++) await importSeason(y);
    console.log('Đã nạp xong lịch sử các mùa giải');
  }
  setInterval(() => importSeason(currentStartYear()).catch(console.error), 6 * 3600 * 1000);
}

// Repository cho dữ liệu nhập tay: ban huấn luyện và danh hiệu
import { db } from './db';

export const listStaff = () =>
  db.prepare('SELECT name, role, nationality, since, source FROM staff ORDER BY id').all();

export const listHonours = () =>
  db.prepare('SELECT competition, titles, last_won AS lastWon, source FROM honours ORDER BY id').all();

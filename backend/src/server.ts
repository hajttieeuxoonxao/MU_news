import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { fail } from './lib/respond';
import api from './routes';
import { seedIfEmpty } from './seed';

const app = express();
app.use(helmet());
app.use(cors());
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));
app.use('/api', api);
app.use((_req, res) => fail(res, 404, 'Không tìm thấy đường dẫn này'));
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  fail(res, 502, 'Không lấy được dữ liệu từ nguồn, thử lại sau');
});

seedIfEmpty().catch(console.error);
app.listen(config.port, () => console.log(`API chạy tại cổng ${config.port}`));

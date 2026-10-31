import { Response } from 'express';

// Khung trả lời chung cho mọi endpoint: { status, message, data }
export const ok = (res: Response, data: unknown, message = 'ok') =>
  res.json({ status: 'success', message, data });

export const fail = (res: Response, code: number, message: string) =>
  res.status(code).json({ status: 'error', message, data: null });

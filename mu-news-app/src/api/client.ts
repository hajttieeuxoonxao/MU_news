// Hàm gọi backend duy nhất của app. Địa chỉ lấy từ biến EXPO_PUBLIC_API_URL trong file .env
const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

type Envelope<T> = { status: 'success' | 'error'; message: string; data: T };

export async function get<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000); // host miễn phí có thể đang "ngủ"
  try {
    const res = await fetch(BASE + path, { signal: controller.signal });
    const body = (await res.json()) as Envelope<T>;
    if (!res.ok || body.status !== 'success') throw new Error(body.message || `Lỗi ${res.status}`);
    return body.data;
  } catch (e: any) {
    throw new Error(e?.name === 'AbortError' ? 'Máy chủ phản hồi quá chậm, thử lại sau.' : e?.message ?? 'Không kết nối được.');
  } finally {
    clearTimeout(timer);
  }
}

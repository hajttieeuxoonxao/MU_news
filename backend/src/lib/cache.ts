// Cache-aside có "bản cũ dự phòng" (stale fallback):
// - còn hạn: trả luôn từ bộ nhớ
// - hết hạn: gọi nguồn, lưu lại kèm thời gian sống (TTL)
// - nguồn lỗi: trả dữ liệu lần trước thay vì làm app hỏng
type Entry<T> = { value: T; expires: number };
const store = new Map<string, Entry<unknown>>();

export async function cached<T>(key: string, ttlSec: number, load: () => Promise<T>): Promise<T> {
  const hit = store.get(key) as Entry<T> | undefined;
  if (hit && hit.expires > Date.now()) return hit.value;
  try {
    const value = await load();
    store.set(key, { value, expires: Date.now() + ttlSec * 1000 });
    return value;
  } catch (err) {
    if (hit) return hit.value; // nguồn lỗi: trả bản cũ
    throw err;
  }
}

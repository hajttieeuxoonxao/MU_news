# Các mẫu thiết kế (design patterns) có trong code

Chỉ liệt kê mẫu **thật sự có trong code**, kèm tên file để trả lời câu hỏi "mẫu này nằm ở đâu".

## 1. Adapter

- **Vấn đề:** mỗi nguồn dữ liệu có định dạng riêng (XML của RSS, JSON của FPL, JSON khác của football-data.org).
- **Cách áp dụng:** mỗi nguồn một file trong `backend/src/adapters/` (`rss.ts`, `fpl.ts`, `footballData.ts`); `rss.ts` chuẩn hóa mọi báo về một kiểu `RssItem`.
- **Lợi ích:** đổi nguồn chỉ sửa một file.

## 2. Cache-aside có bản cũ dự phòng (stale fallback)

- **Vấn đề:** football-data.org gói miễn phí giới hạn khoảng 10 request/phút; nguồn ngoài có thể lỗi.
- **Cách áp dụng:** hàm `cached(key, ttl, load)` trong `lib/cache.ts`:
  1. Có trong cache và **còn hạn** → trả luôn.
  2. Hết hạn → gọi `load()`, lưu kèm thời điểm hết hạn.
  3. `load()` lỗi mà có bản cũ → **trả bản cũ** thay vì báo lỗi.
- **TTL đang dùng:** tin 5 phút, BXH 5 phút, trận đấu 10 phút, đội hình FPL 10 phút, cầu thủ 60 phút, thông tin đội 60 phút.
- **Lợi ích:** nhanh hơn ở lần gọi thứ hai, ít bị chặn, chịu lỗi tốt (NFR-02).

## 3. Repository

- **Vấn đề:** SQL rải rác trong logic khó bảo trì.
- **Cách áp dụng:** mọi câu SQL nằm trong `repositories/seasons.ts`, `repositories/club.ts`, `repositories/db.ts`. Service gọi `listSeasons()`, `listStaff()`… chứ không viết SQL.

## 4. Standardized Response (DTO)

- **Vấn đề:** app phải xử lý lỗi theo nhiều kiểu khác nhau.
- **Cách áp dụng:** `lib/respond.ts` có `ok(res, data)` và `fail(res, code, message)`; mọi phản hồi dạng `{ status, message, data }`. Phía app, `client.ts` đọc một khuôn duy nhất.

## 5. Custom Hook (phía app)

- `useApi()` gom logic tải dữ liệu + trạng thái; `useSaved()` gom logic lưu bài; `useColors()` gom logic chọn màu. Xem `01_mobile/03_react_component_va_hooks.md`.

## 6. Singleton (theo module)

- Biến `db` trong `repositories/db.ts` và `store` trong `lib/cache.ts` được tạo **một lần** khi module được nạp; mọi nơi `import` đều dùng chung một kết nối CSDL và một kho cache.

## 7. Dự phòng nhiều nguồn (Fallback)

- `clubService.ts`: football-data.org lỗi → BXH và kết quả lấy từ CSV trong SQLite; lịch sắp tới trả rỗng.
- `newsService.ts`: dùng `Promise.allSettled` cho 3 RSS → một báo lỗi vẫn còn tin từ báo khác.

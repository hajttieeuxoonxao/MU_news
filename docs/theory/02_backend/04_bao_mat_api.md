# Bảo mật API ở mức cơ bản

| # | Rủi ro | Biện pháp trong dự án | File |
| --- | --- | --- | --- |
| 1 | Lộ khóa API football-data.org | Khóa chỉ nằm ở backend trong `.env`; `.env` có trong `.gitignore`; app không bao giờ thấy khóa | `backend/.env`, `config.ts` |
| 2 | Biến `EXPO_PUBLIC_*` bị nhúng vào app, ai cũng đọc được | Chỉ để địa chỉ backend ở đó, **không** để khóa bí mật | `mu-news-app/.env` |
| 3 | Bị gọi dồn dập làm cạn hạn mức nguồn ngoài | `express-rate-limit`: tối đa 120 request/phút mỗi IP; cache giảm số lần gọi nguồn | `server.ts`, `lib/cache.ts` |
| 4 | Header HTTP không an toàn | `helmet()` đặt sẵn các header bảo vệ | `server.ts` |
| 5 | Trình duyệt chặn gọi chéo nguồn (CORS) | `cors()` cho phép app/web gọi API | `server.ts` |
| 6 | Tham số sai làm lỗi server | `intParam()` ép `limit` về số nguyên trong khoảng cho phép; `type`, `scope` chỉ nhận giá trị liệt kê | `routes/index.ts` |
| 7 | SQL injection | Mọi câu SQL dùng `prepare` với dấu `?`, không ghép chuỗi | `repositories/*.ts` |
| 8 | Biến backend thành "cổng chuyển tiếp" (SSRF) | Backend chỉ gọi địa chỉ cố định trong code; `/players/:id` kiểm tra cầu thủ thuộc MU trước khi gọi FPL | `squadService.ts` |
| 9 | Lộ chi tiết lỗi | App chỉ nhận câu chung chung; chi tiết in ở console server; không log token | `server.ts` |
| 10 | Bản quyền nội dung | Chỉ hiện tiêu đề, tóm tắt, ảnh, nguồn và link gốc; không chép toàn văn | `newsService.ts`, `NewsCard.tsx` |

## SQL injection là gì

Nếu viết `"SELECT ... WHERE label = '" + input + "'"`, kẻ xấu có thể gửi `input` chứa đoạn SQL để đọc/xóa dữ liệu. Câu lệnh chuẩn bị sẵn (`db.prepare('... WHERE label = ?').get(input)`) truyền `input` như **dữ liệu**, không bao giờ được hiểu là lệnh.

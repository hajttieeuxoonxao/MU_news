# REST API, HTTP, JSON và Express

## 1. HTTP và REST

App và backend nói chuyện bằng **HTTP**: app gửi *request* (phương thức + đường dẫn + tham số), server trả *response* (mã trạng thái + nội dung).

**REST** là cách đặt API quanh **tài nguyên** (resource), mỗi tài nguyên một đường dẫn, dùng phương thức HTTP đúng nghĩa. App này chỉ **đọc** dữ liệu nên chỉ dùng `GET`:

| Tài nguyên | Đường dẫn | Tham số truy vấn |
| --- | --- | --- |
| Danh sách tin | `GET /api/news` | `?type=transfer&limit=20` |
| Một cầu thủ | `GET /api/players/:id` | tham số đường dẫn `:id` |
| Một mùa giải | `GET /api/seasons/:season` | ví dụ `2012-13` |

Mã trạng thái dùng trong dự án: **200** thành công, **404** không tìm thấy, **429** gọi quá nhiều, **502** nguồn bên ngoài lỗi.

## 2. JSON và khung phản hồi chung

JSON là định dạng văn bản cho dữ liệu có cấu trúc. Mọi endpoint của dự án trả cùng một khung:

```json
{ "status": "success", "message": "ok", "data": [ ... ] }
```

App chỉ cần một hàm `get<T>()` (`src/api/client.ts`) để xử lý mọi phản hồi. Danh sách đầy đủ ở `docs/report/api-contract.md` — đây là **hợp đồng API**, giúp hai người làm song song.

## 3. Express

Express là framework web nhỏ cho Node.js. Ba khái niệm chính:

- **Route**: gắn đường dẫn với hàm xử lý, ví dụ `api.get('/squad', ...)` trong `routes/index.ts`.
- **Middleware**: hàm chạy *trước* route cho mọi request: `helmet()`, `cors()`, `rateLimit()` trong `server.ts`.
- **Trình xử lý lỗi**: middleware 4 tham số `(err, req, res, next)` đặt cuối cùng, trả 502 với câu chung chung.

Thứ tự trong `server.ts`: bảo mật → giới hạn tần suất → các route `/api` → 404 → xử lý lỗi.

## 4. Bất đồng bộ (async/await)

Gọi nguồn ngoài mất thời gian, nên các hàm dùng `async/await`. Hàm `asyncRoute` bọc route để mọi lỗi trong `await` chuyển tới trình xử lý lỗi chung, không làm sập server.

## 5. Node.js và `tsx`

Node.js chạy JavaScript ở máy chủ. `tsx` chạy thẳng file TypeScript mà không cần bước biên dịch riêng: `npm run dev` = `tsx watch src/server.ts` (tự khởi động lại khi sửa code).

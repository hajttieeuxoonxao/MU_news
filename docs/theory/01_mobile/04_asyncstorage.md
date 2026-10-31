# AsyncStorage — lưu dữ liệu trên điện thoại

## 1. Khái niệm

AsyncStorage là kho **khóa → chuỗi** (key-value) nằm trong bộ nhớ của app trên điện thoại. Dữ liệu **còn lại sau khi tắt app**, chỉ mất khi gỡ app hoặc xóa dữ liệu app. Mọi thao tác là **bất đồng bộ** (trả về Promise), nên không làm đơ giao diện.

| Hàm | Ý nghĩa |
| --- | --- |
| `getItem(key)` | Đọc chuỗi (hoặc `null` nếu chưa có) |
| `setItem(key, value)` | Ghi chuỗi |
| `removeItem(key)` | Xóa |

Vì chỉ lưu chuỗi, đối tượng phải đổi qua lại bằng `JSON.stringify` / `JSON.parse`.

## 2. Áp dụng trong dự án (`src/hooks/useSaved.ts`)

- Khóa: `saved-news`; giá trị: mảng JSON các `NewsItem` (lưu **cả bài**, không chỉ id) → mở lại xem được khi mất mạng.
- `toggle(item)`: nếu bài đã có thì bỏ, chưa có thì thêm lên đầu, rồi ghi lại toàn bộ mảng.
- Đọc/ghi lỗi thì bỏ qua (`.catch(() => {})`) để app không sập.

## 3. So sánh với CSDL ở backend

| | AsyncStorage (app) | SQLite (backend) |
| --- | --- | --- |
| Ở đâu | Từng điện thoại | Máy chủ |
| Dữ liệu | Bài đã lưu của **một** người dùng | Lịch sử mùa giải dùng chung |
| Dạng | Khóa → chuỗi JSON | Bảng, cột, khóa |
| Truy vấn | Đọc cả chuỗi | SQL |

Đây là lý do báo cáo chương 7 có một đoạn riêng cho "kho lưu trữ phía app" (yêu cầu NFR-08, BR-08).

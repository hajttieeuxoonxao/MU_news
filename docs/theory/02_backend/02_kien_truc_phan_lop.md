# Kiến trúc phân lớp (Layered Architecture)

## 1. Ý tưởng

Chia mã nguồn thành các **lớp**, mỗi lớp một trách nhiệm, và **mỗi lớp chỉ gọi lớp ngay bên dưới**. Sửa một lớp ít làm vỡ lớp khác; dễ giải thích "đoạn code này nằm ở đâu".

## 2. Các lớp trong backend (xem hình `docs/report/diagrams/02_kien_truc_backend_phan_lop.png`)

| Lớp | Thư mục | Làm gì | **Không** làm gì |
| --- | --- | --- | --- |
| Middleware | `server.ts` | Bảo mật, giới hạn tần suất, bắt lỗi chung | Không biết gì về bóng đá |
| Router | `routes/` | Nhận URL, kiểm tra tham số, gọi service, trả `ok()`/`fail()` | Không gọi nguồn ngoài, không viết SQL |
| Service | `services/` | Quy tắc nghiệp vụ: gộp RSS, lọc đội nữ, nhận diện chuyển nhượng, sắp xếp đội hình, dự phòng CSV | Không biết định dạng HTTP của nguồn ngoài |
| Adapter | `adapters/` | Gọi **một** nguồn ngoài, trả dữ liệu thô | Không chứa quy tắc nghiệp vụ |
| Repository | `repositories/` | Mọi câu SQL | Không gọi mạng |

Thêm hai phần hỗ trợ: `lib/cache.ts` (cache dùng chung) và `seed/` (nạp dữ liệu lịch sử lúc khởi động).

## 3. Kiến trúc phía app

App cũng chia lớp: **màn hình** (`app/`) → **hook** (`src/hooks/`) → **truy cập dữ liệu** (`src/api/client.ts`) → backend. Màn hình không bao giờ gọi `fetch` trực tiếp.

## 4. Lợi ích thấy được trong dự án

- Đổi nguồn RSS hoặc đổi API cầu thủ: chỉ sửa adapter/service, **không sửa app** (NFR-06).
- football-data.org bị chặn: chỉ `clubService.ts` chuyển sang dữ liệu CSV, router và app không đổi.
- Hai người làm song song nhờ ranh giới rõ: người A `backend/`, người B `mu-news-app/`.

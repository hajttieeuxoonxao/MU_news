# SQLite và cơ sở dữ liệu quan hệ

## 1. CSDL quan hệ

Dữ liệu lưu thành **bảng** (hàng × cột). Các bảng liên kết bằng khóa:

- **Khóa chính (PK)**: định danh duy nhất một hàng, ví dụ `seasons.id`.
- **Khóa ngoại (FK)**: cột trỏ tới khóa chính bảng khác, ví dụ `matches.season_id → seasons.id`.
- **Khóa chính kép**: `season_standings (season_id, team_id)` — mỗi đội chỉ có một dòng mỗi mùa.
- **Ràng buộc**: `UNIQUE` (`seasons.label`, `teams.name`), `NOT NULL`, `CHECK (result IN ('H','D','A'))`.
- **Chỉ mục (index)**: `idx_matches_season` giúp tìm trận theo mùa nhanh.

## 2. Sáu bảng của dự án (`repositories/db.ts`)

| Bảng | Vai trò | Quan hệ |
| --- | --- | --- |
| `seasons` | Mỗi mùa một dòng (`2012-13`) | 1–n với `matches`, `season_standings` |
| `teams` | Tên đội như trong CSV | 1–n với `matches` (2 lần: nhà, khách), `season_standings` |
| `matches` | Mọi trận Premier League từ 2010-11 | n–1 với `seasons`, `teams` |
| `season_standings` | BXH cuối mùa (dẫn xuất) | n–1 với `seasons`, `teams` |
| `staff` | Ban huấn luyện nhập tay, có `source`, `checked_at` | độc lập |
| `honours` | Danh hiệu nhập tay, có `source` | độc lập |

Hình ERD: `docs/report/diagrams/16_erd.png`.

## 3. Chuẩn hóa

Tên đội lưu một lần ở `teams`, các bảng khác chỉ lưu `team_id` → không lặp chuỗi tên, đổi tên chỉ sửa một chỗ (tránh dị thường cập nhật). `season_standings` cố ý **phi chuẩn hóa** (lưu kết quả tính sẵn) để đọc nhanh — đánh đổi có chủ đích.

## 4. Vì sao SQLite

- Không cần cài máy chủ CSDL; cả CSDL là một file `mu.db`.
- Dữ liệu nhỏ, chủ yếu đọc.
- Nếu hosting xóa ổ đĩa, `seedIfEmpty()` tự nạp lại từ CSV.
- Thư viện `better-sqlite3` đồng bộ, đơn giản; bật `journal_mode = WAL` (đọc ghi song song tốt hơn) và `foreign_keys = ON` (SQLite mặc định **tắt** kiểm tra khóa ngoại).

## 5. Dữ liệu nào không nằm trong CSDL

Tin tức, đội hình, BXH hiện tại lấy trực tiếp từ API rồi **cache trong bộ nhớ**, vì chúng thay đổi liên tục và nguồn ngoài đã là "nguồn sự thật". Ghi rõ điều này trong chương 7 để trả lời câu hỏi "sao không có bảng cầu thủ".

# Biểu đồ use-case (UML)

## 1. Thành phần

| Ký hiệu | Ý nghĩa | Trong dự án |
| --- | --- | --- |
| Hình người (tác nhân / actor) | Ai/cái gì tương tác với hệ thống từ bên ngoài | **Người dùng** (chính); Nguồn RSS, Nguồn FPL, football-data.org (tác nhân hệ thống, phụ) |
| Hình bầu dục (use-case) | Một mục tiêu người dùng đạt được | 8 use-case UC-01 → UC-08 |
| Khung chữ nhật (system boundary) | Phạm vi hệ thống | "Ứng dụng MU News" |
| Đường liền | Tác nhân tham gia use-case | Người dùng — UC-01 |
| Mũi tên nét đứt «include» | Use-case A **luôn** gọi B | (không dùng) |
| Mũi tên nét đứt «extend» | B **có thể** mở rộng A trong điều kiện nhất định; mũi tên từ B chỉ về A | UC-02 «extend» UC-01 |

Use-case mô tả **việc người dùng muốn làm**, không mô tả màn hình hay nút bấm.

## 2. Danh sách use-case (ma trận ánh xạ FR)

| Mã | Tên | Tác nhân | FR |
| --- | --- | --- | --- |
| UC-01 | Xem và làm mới tin tức | Người dùng, Nguồn RSS | FR-01, FR-03 |
| UC-02 | Lọc tin chuyển nhượng | Người dùng | FR-02 |
| UC-03 | Lưu và xem bài đã lưu | Người dùng | FR-04 |
| UC-04 | Xem đội hình và chi tiết cầu thủ | Người dùng, Nguồn FPL | FR-05, FR-06 |
| UC-05 | Xem ban huấn luyện và danh hiệu | Người dùng | FR-07, FR-12 |
| UC-06 | Xem trận đấu | Người dùng, football-data.org | FR-08 |
| UC-07 | Xem bảng xếp hạng hiện tại | Người dùng, football-data.org | FR-09 |
| UC-08 | Tra cứu lịch sử các mùa giải | Người dùng | FR-10, FR-11 |

Hình: `docs/report/diagrams/05_usecase_tong_quat.png` và `06_…` → `13_…`.

## 3. Bảng đặc tả use-case

Mỗi use-case một bảng gồm: mã và tên, tác nhân, mô tả, tiền điều kiện, hậu điều kiện, **luồng chính** (các bước đánh số), **luồng thay thế** (đánh số theo bước bị thay, ví dụ 5a), **luồng ngoại lệ** (ví dụ 2e mất mạng), yêu cầu liên quan. Mẫu đầy đủ cho UC-01 nằm ở mục B4.3 của tài liệu hướng dẫn.

Gợi ý luồng ngoại lệ chung cho mọi UC có gọi backend: "Không có mạng hoặc server lỗi → app hiện thông báo tiếng Việt và nút Thử lại" (NFR-03).

# Thiết kế giao diện (Figma)

**File:** [MU News - Mobile](https://www.figma.com/design/bJbOg9aV0lFmkMmlxIaZ5S) (drafts của tài khoản Figma của nhóm, team "Minh Nguyen's team").

## Cách làm

1. Nền tảng thiết kế (biến màu, khoảng cách, kiểu chữ, icon, component điều hướng) đã được tạo trực tiếp trong file Figma.
2. Các **màn hình** được viết bằng HTML/CSS khớp code (`docs/report/figma_html/`), rồi nhóm nhập vào Figma bằng plugin html.to.design. Cách làm này dùng vì công cụ kết nối Figma đã hết lượt gọi của gói Starter.

## Trạng thái (30/10/2026)

| Phần | Trạng thái |
| --- | --- |
| 3 trang: `Screens`, `Components`, `Foundations` (gói Starter tối đa 3 trang) | Đã tạo |
| Biến màu `Color · Light` và `Color · Dark` (9 màu mỗi bộ, khớp `src/theme.ts`) | Đã tạo |
| Biến `Spacing` (`space/4…24`, `radius/8, 10, 16`) | Đã tạo |
| 9 kiểu chữ Roboto (`Heading/XL` … `Label/Tab`) | Đã tạo |
| 12 icon component (Ionicons) | Đã tạo |
| Component: Status bar, Header/Tab, Header/Stack, Tab bar (5 biến thể), Chip, Search bar | Đã tạo |
| 16 màn hình (14 Sáng + 2 Tối) dạng HTML | Đã tạo, **nhóm nhập vào Figma** theo `figma_html/README.md` |
| Prototype (nối màn hình) | Nhóm làm sau khi nhập |

Gói Starter chỉ cho 1 chế độ (mode) mỗi bộ biến, nên màu Sáng/Tối là hai bộ biến riêng.

## Danh sách màn hình (theo mục B5 của tài liệu)

| Mục báo cáo | Màn hình (số trong `figma_html/out/screens/`) |
| --- | --- |
| 5.1 Tin tức | 01 Danh sách tin; 02 Chuyển nhượng + tìm kiếm; 03 Bài đã lưu |
| 5.2 Đội hình | 04 Cầu thủ (gom theo vị trí); 05 Ban huấn luyện; 06 Chi tiết cầu thủ |
| 5.3 Trận đấu và BXH | 07 Sắp tới; 08 Kết quả; 09 BXH hiện tại |
| 5.4 Lịch sử | 10 Danh hiệu + các mùa; 11 Chi tiết một mùa |
| 5.5 Trạng thái đặc biệt | 12 Đang tải; 13 Lỗi mạng; 14 Chưa có dữ liệu |
| Chế độ Tối | 15 Tin tức; 16 BXH |

**Lưu ý dữ liệu:** bản hiện tại dùng dữ liệu minh họa (tên cầu thủ, đội, tỷ số giả; ban huấn luyện và danh hiệu là thật). Chạy `node generate.mjs http://localhost:3000/api` khi backend đã chạy để tạo lại bằng dữ liệu thật trước khi chụp hình cho báo cáo.

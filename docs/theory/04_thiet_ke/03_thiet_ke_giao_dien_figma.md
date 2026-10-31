# Thiết kế giao diện và Figma

## 1. Design token (biến thiết kế)

Design token là giá trị đặt tên dùng chung giữa thiết kế và code: màu, khoảng cách, bo góc, kiểu chữ. File Figma "MU News - Mobile" khai báo:

| Nhóm | Biến | Khớp code |
| --- | --- | --- |
| Màu | `brand/red`, `bg/screen`, `bg/surface`, `bg/highlight`, `bg/table-header`, `text/primary`, `text/secondary`, `text/on-red`, `border/default` (hai bộ: Light và Dark) | `src/theme.ts` |
| Khoảng cách | `space/4`, `8`, `12`, `16`, `24` | `padding`, `margin`, `gap` trong các màn hình |
| Bo góc | `radius/8`, `10`, `16` | `borderRadius` của thẻ, ô tìm kiếm, nút lọc |
| Kiểu chữ | `Heading/XL 22`, `Heading/L 18`, `Heading/Header 20`, `Title/Card 16`, `Body 14`, `Caption 12`, `Label/Tab 11` — font Roboto (font hệ thống Android) | `fontSize`, `fontWeight` |

## 2. Component

Phần giao diện lặp lại được làm **một lần** thành component, các màn hình dùng **instance**. Sửa component gốc thì mọi màn hình cập nhật. Component trong file: Status bar, Header/Tab, Header/Stack, Tab bar (5 biến thể theo tab đang chọn), Chip (Active/Default), Search bar, bộ icon Ionicons (cùng bộ icon với `@expo/vector-icons` trong code).

## 3. Prototype

Nối các màn hình bằng tương tác (bấm tab → sang màn tab đó; bấm cầu thủ → màn chi tiết; nút Back → quay lại) để thử luồng sử dụng trước khi lập trình.

## 4. Nguyên tắc UI di động áp dụng

- **Vùng bấm tối thiểu ~44–48 dp** (nút lưu bài có `hitSlop` 12).
- **Thanh tab dưới 3–5 mục**; chức năng phụ đặt trong tab.
- **Mọi màn hình có 3 trạng thái**: đang tải, lỗi + Thử lại, chưa có dữ liệu (StateView).
- **Nhất quán**: cùng một kiểu thẻ, cùng nút lọc, cùng màu nhấn đỏ.
- **Phân cấp chữ**: tiêu đề đậm 16, tóm tắt xám 14, thông tin phụ 12.
- **Tương phản đủ** ở cả chế độ Sáng và Tối.

## 5. Thiết kế trước, lập trình sau

Chương 5 nên đặt **ảnh Figma cạnh ảnh app thật**, giải thích chỗ lệch (ví dụ: ảnh bài báo phụ thuộc nguồn RSS; font hệ thống trên từng máy).

# Kiểm thử phần mềm ở mức đồ án

## 1. Các mức kiểm thử

| Mức | Kiểm tra gì | Trong dự án |
| --- | --- | --- |
| Kiểm tra tĩnh | Lỗi kiểu, lỗi cú pháp khi chưa chạy | `npm run typecheck` (TypeScript) ở cả backend và app |
| Kiểm thử đơn vị | Một hàm riêng lẻ với dữ liệu giả | Đã chạy thử `importSeason`, `getNews`, `getSquad`… với nguồn giả lập khi soạn code (hướng phát triển: viết thành Jest) |
| Kiểm thử tích hợp | Nhiều phần ghép lại | Gọi 11 endpoint qua HTTP; app web nối backend thật |
| Kiểm thử hệ thống / chấp nhận | Toàn bộ app trên điện thoại thật theo kịch bản | Bảng 11 dòng ở `docs/report/test-checklist.md` |

## 2. Viết test case tốt

Mỗi dòng gồm: **tình huống**, **cách làm**, **kết quả mong đợi đo được**, **kết quả thực tế**. Ví dụ tốt: "Tắt Wi-Fi, mở tab BXH → hiện thông báo lỗi tiếng Việt và nút Thử lại, app không đóng". Ví dụ kém: "App chạy ổn".

## 3. Yêu cầu phi chức năng phải đo được

NFR-01 ghi "3 giây khi đã cache, tối đa 20 giây khi server mới tỉnh" → đo bằng đồng hồ và ghi số thật vào bảng. Nếu số đo khác, **sửa con số trong báo cáo**, không sửa kết quả đo.

## 4. Kiểm thử trường hợp lỗi (negative testing)

- Tham số sai: `/api/news?limit=abc` vẫn trả 20 bài.
- Không tìm thấy: `/api/players/abc` → 404; `/api/seasons/1900-01` → 404.
- Nguồn ngoài lỗi: tắt mạng server → cache trả bản cũ.
- Mất mạng ở app: hiện lỗi + Thử lại.

## 5. Danh sách lỗi (bug list)

Ghi mỗi lỗi: mô tả, cách lặp lại, trạng thái, cách sửa (`docs/report/bug-list.md`). Đây là minh chứng cho phần đánh giá ở chương 8.

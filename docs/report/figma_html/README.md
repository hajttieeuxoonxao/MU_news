# Màn hình app dạng HTML để nhập vào Figma

16 màn hình 360 × 800 của app MU News (01–14 chế độ Sáng, 15–16 chế độ Tối), viết bằng HTML/CSS thuần, khớp màu, cỡ chữ và bố cục của code trong `mu-news-app/`. Nhập vào Figma bằng plugin **html.to.design** để có layer sửa được (chữ, khung auto-layout, icon dạng vector).

## Có gì trong thư mục

| File | Dùng khi |
| --- | --- |
| `out/all_screens.html` | Nhập **một lần** được cả 16 màn hình xếp thành lưới, có nhãn tên màn |
| `out/screens.zip` | Nhập 16 màn hình thành **16 frame riêng** trong một lần |
| `out/screens/*.html` | Nhập từng màn hình riêng lẻ |
| `generate.mjs` | Chương trình tạo lại các file trên |
| `sample-data.json` | Dữ liệu minh họa (tên cầu thủ, đội, tỷ số, điểm là **giả**) |
| `icons.json` | Icon Ionicons (cùng bộ với `@expo/vector-icons` trong app) |

Ban huấn luyện và danh hiệu luôn đọc từ `backend/data/*.json` (dữ liệu thật có nguồn).

## Nhập vào Figma

1. Mở file Figma "MU News - Mobile" (hoặc file mới), vào trang `Screens`.
2. Menu **Plugins → Find more plugins**, tìm **html.to.design**, chạy plugin.
3. Chọn tab **File**, kéo `out/screens.zip` (hoặc `out/all_screens.html`) vào ô tải lên.
4. Ở phần tùy chọn, chọn khung **Mobile** hoặc nhập độ rộng **360** cho file lẻ / zip; với `all_screens.html` đặt độ rộng **1664**.
5. Bấm Import. Mỗi màn hình thành một frame; chữ dùng font **Roboto** (có sẵn trong Figma).

Sau khi nhập: đặt các frame thẳng hàng, nối prototype (bấm tab → sang màn tab đó; bấm cầu thủ → màn 06; bấm mùa → màn 11; nút Back → quay lại).

## Thay bằng dữ liệu thật (nên làm trước khi chụp hình cho chương 5)

Tài liệu hướng dẫn yêu cầu thiết kế dùng dữ liệu thật. Khi backend đã chạy (xem `docs/command_to_run/03_chay_backend.md`):

```powershell
cd D:\User_Files\Downloads\APP_261\mu-news\docs\report\figma_html
node generate.mjs http://localhost:3000/api
```

Chương trình gọi các endpoint `/news`, `/squad`, `/players/:id`, `/team`, `/matches`, `/standings`, `/seasons`, `/seasons/2012-13` và tạo lại toàn bộ `out/`. Phần nào lỗi thì giữ dữ liệu minh họa và in cảnh báo. Ảnh bài báo lúc đó là ảnh thật từ RSS (plugin sẽ tải ảnh từ internet). Tạo lại `screens.zip`: chuột phải thư mục `out\screens` → **Send to → Compressed (zipped) folder**.

## Ghi chú

- Ảnh bài báo ở bản minh họa là khung xám có icon ảnh, giống app khi ảnh chưa tải.
- Vòng tròn đang tải là hình tĩnh (Figma không có hiệu ứng quay).
- Màn 11 (chi tiết mùa) dài hơn màn hình; phần các trận nằm dưới bảng, trong app phải cuộn mới thấy.

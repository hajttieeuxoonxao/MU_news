# Danh sách lỗi (bug list)

Lỗi nào phát hiện khi kiểm thử cũng ghi vào đây: mô tả, cách lặp lại, đã sửa hay chưa. Danh sách lỗi đã sửa là minh chứng tốt cho chương 8.

| # | Ngày | Mô tả | Cách lặp lại | Trạng thái | Cách sửa / ghi chú |
| --- | --- | --- | --- | --- | --- |
| 1 | 30/10 | Code mẫu A5 gọi `res.json(ok(data))` trong khi `ok(res, data)` đã tự gửi phản hồi → lỗi TypeScript | Chép nguyên code A5 rồi chạy `npm run typecheck` | Đã sửa | Đổi thành `ok(res, data)`, `fail(res, 404, '…')` |
| 2 | 30/10 | Hợp đồng API có `/api/staff` nhưng chưa có route | Gọi `/api/staff` → 404 | Đã sửa | Thêm route trong `routes/index.ts` |
| 3 | 30/10 | Màn Mùa giải lồng `ScrollView` trong `FlatList` (cảnh báo VirtualizedLists) | Mở một mùa cũ | Đã sửa | `LeagueTable` có tham số `scroll={false}` |
| 4 | 30/10 | Dark mode: chữ mặc định màu đen, không đọc được trên nền tối | Bật chế độ Tối | Đã sửa | Mọi `Text` lấy màu từ `useColors()` |
| 5 | 30/10 | Bỏ lưu một bài ở màn "Bài đã lưu", quay lại tab Tin tức: biểu tượng đánh dấu chưa đổi ngay | Lưu bài → mở Đã lưu → bỏ lưu → quay lại | Chưa sửa (đã biết) | Giới hạn tài liệu đã nêu ở A7: mỗi màn có bản sao `useSaved()` riêng. Hướng phát triển: React Context |
| 6 | 31/10 | Tải CSV lịch sử ra **file rỗng** | `curl.exe -s https://www.football-data.co.uk/mmz4281/2526/E0.csv -o x.csv` | Đã sửa | Trang chỉ trả dữ liệu khi đi theo chuyển hướng và có User-Agent kiểu trình duyệt. Sửa lệnh spike (`-sSL -A "Mozilla/5.0"`); `importCsv.ts` gửi User-Agent trình duyệt và **bỏ qua file rỗng/sai định dạng** (trước đây file rỗng vẫn tạo dòng mùa giải rỗng, khiến `seedIfEmpty()` không nạp lại) |
| 7 | 31/10 | Bài đội U21, U18, giải nữ WSL lọt bộ lọc đội nam | RSS manutd.com: "U21s Report: United 2 Monaco 3", "United set for Goodison Park return in WSL" | Đã sửa | Từ khóa cũ `u21` không khớp "U21s". Regex mới bắt `U21s`, `U18s`, `WSL`, `Women’s`. Còn sót bài không có từ khóa nào (ví dụ "What Eva thought about her first derby as Reds boss") → giới hạn của lọc bằng từ khóa, ghi vào chương 8 |
| 8 | 31/10 | Tiêu đề Football365 hiện `&#8216;crucial&#8217;` thay vì ‘crucial’ | RSS Football365 | Đã sửa | Báo mã hóa ký tự hai lần; `adapters/rss.ts` giải mã mã số (`&#8216;`) và tên (`&rsquo;`, `&pound;`…) |
| 9 | 31/10 | Bộ lọc Chuyển nhượng bỏ sót nhiều tin (8/85 bài) | Tiêu đề kiểu "Man United eye transfer…", "…linked", "…January raid" | Đã sửa | Thêm từ khóa `target`, `linked`, `links`, `monitor`, `eye`, `hunt`, `raid`, `swoop`, `exit`, `joining`, `move`, `deal` → 20/68 bài. Có nhận nhầm (tin thay HLV có chữ "target") — đúng như BR-04 |
|  |  |  |  |  |  |

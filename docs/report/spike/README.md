# Phiếu kiểm tra nguồn dữ liệu (bước A1)

Chạy lệnh trong `docs/command_to_run/02_thu_nguon_du_lieu_spike.md`, lưu file phản hồi vào thư mục này, rồi điền cột cuối. Đây là minh chứng cho chương 2 ("vì sao chọn công nghệ này") và mục rủi ro ở chương 8 của báo cáo.

Ngày chạy: **31 / 10 / 2026** · Người chạy: ____________ (Windows PowerShell, `curl.exe`)

| Nguồn | Cần thấy | Nếu lỗi thì làm gì | Kết quả của nhóm |
| --- | --- | --- | --- |
| `/teams/66` | Tên đội, `coach`, `runningCompetitions`; có `squad` hay không | Không có `squad`: dùng FPL cho đội hình (kế hoạch mặc định). Không có `coach`: để HLV trưởng trong `staff.json` | **Đạt.** `name` = "Manchester United FC" (xác nhận mã đội 66), `coach` = Michael Carrick, `runningCompetitions` = PL, FLC, CL, sân Old Trafford, thành lập 1878. Gói free **có** `squad` (30 cầu thủ); `staff` rỗng → ban huấn luyện vẫn dùng `staff.json` |
| `/competitions/PL/standings` | 20 đội kèm điểm | Lỗi 403: backend tự dùng BXH tính từ CSV mùa hiện tại (đã cài sẵn trong `clubService.ts`) | **Đạt.** 1 bảng `TOTAL`, 20 đội, mùa bắt đầu 21/08/2026 (backend ghi `2026-27`), vòng 9; có `crest` (logo) từng đội |
| `/teams/66/matches` | Danh sách trận kèm tỷ số, giải đấu | Lỗi: kết quả lấy từ CSV mùa hiện tại; lịch sắp tới để trống (đã cài sẵn) | **Đạt.** `SCHEDULED`: 5 trận (Premier League + Champions League), trạng thái trả về là `TIMED`. `FINISHED`: 11 trận (8 PL, 3 CL), có `score.fullTime`. Không có League Cup trong kết quả |
| FPL `bootstrap-static` | JSON lớn có `elements` (cầu thủ) và `teams` | Đã gửi `User-Agent`; vẫn lỗi thì làm `squad.json` nhập tay (xem mục R của tài liệu hướng dẫn) | **Đạt.** MU: `short_name` = `MUN`, `id` = 16, **34 cầu thủ**. Đủ trường `first_name`, `second_name`, `web_name`, `element_type` (1–4), `status` (gặp `a`, `d`, `i`, `u`), `news`, `minutes`, `goals_scored`, `assists`, `clean_sheets`, `yellow_cards`, `red_cards`. `element-summary` có `history_past` |
| RSS manutd.com, Football365, CaughtOffside | Thẻ `<item>` có `<title>`, `<link>`, `<pubDate>` | Đổi link trong `FEEDS` của `newsService.ts` (ví dụ chọn feed từ Feedspot) | **Đạt cả 3.** manutd.com 50 bài (ảnh ở `<media:thumbnail>`, nhiều bài không có ảnh; có cả tin đội nữ, U21, U18). Football365 25 bài (ảnh ở `<enclosure>`, nhỏ 128×67; tiêu đề mã hóa ký tự hai lần như `&#8216;`). CaughtOffside 10 bài (ảnh ở `<media:content>` / `<media:thumbnail>`) |
| CSV `E0.csv` | Tiêu đề có `Date,HomeTeam,AwayTeam,FTHG,FTAG,FTR`; tên đội `Man United` | 404: lấy link đúng ở trang England của football-data.co.uk | **Đạt sau khi sửa lệnh.** Lệnh `curl.exe -s` thường cho **file rỗng**; thêm `-L -A "Mozilla/5.0"` thì tải được. Có đủ cột cần dùng (mùa 2025-26 có thêm cột `Time`). Ngày: `dd/mm/yyyy` (2025-26), `dd/mm/yy` (2010-11). `Man United` có 38 trận mỗi mùa |

## Kiểm tra code với dữ liệu thật

Các file trong thư mục này được đưa qua chính code backend (thay mạng bằng file đã tải):

| Phần | Kết quả |
| --- | --- |
| BXH hiện tại | MU hạng 16, 8 trận, 1T 4H 3B, 10–13, 7 điểm |
| Đội hình | 34 cầu thủ, gom đúng 4 vị trí; chi tiết cầu thủ có số liệu các mùa trước |
| Trận đấu | Sắp tới: Chelsea v Man United (31/10), Man United v Roma (CL, 03/11)…; kết quả mới nhất trước |
| Lịch sử từ CSV | 2010-11: MU hạng 1, 80 điểm (23T 11H 4B, 78–37). 2025-26: hạng 3, 71 điểm (20T 11H 7B, 69–50) → **nhóm đối chiếu Wikipedia** |
| Tin tức | 85 bài → giữ 68 sau khi loại bài đội nữ/trẻ và bài trùng; 20 bài gắn nhãn chuyển nhượng |

## Lỗi phát hiện và đã sửa

Xem `docs/report/bug-list.md` dòng 6–9: CSV rỗng, bài U21s/WSL lọt bộ lọc, ký tự `&#8216;` hiển thị sai, từ khóa chuyển nhượng quá ít.

## Quyết định của nhóm sau khi thử

- Nguồn đội hình: **FPL** (football-data.org cũng có `squad` nhưng không có số phút, bàn thắng)
- Nguồn BXH hiện tại: **football-data.org** (dự phòng: CSV)
- Nguồn trận đấu: **football-data.org** (dự phòng: CSV)
- Các feed RSS dùng được: **manutd.com, Football365, CaughtOffside**

## Màn hình phụ thuộc nguồn nào

| Màn hình | Endpoint | Nguồn |
| --- | --- | --- |
| Tin tức, Bài đã lưu | `/api/news` | RSS |
| Đội hình, Chi tiết cầu thủ | `/api/squad`, `/api/players/:id` | FPL |
| Ban huấn luyện | `/api/team` (`staff`) | `data/staff.json` (nhập tay) |
| Trận đấu | `/api/matches` | football-data.org (dự phòng: CSV) |
| BXH | `/api/standings` | football-data.org (dự phòng: CSV) |
| Lịch sử, Chi tiết mùa | `/api/seasons`, `/api/seasons/:season`, `/api/team` (`honours`) | CSV football-data.co.uk, `data/honours.json` |

# 02. Thử từng nguồn dữ liệu (bước A1, "spike")

Mục đích: chứng minh từng nguồn còn hoạt động **trước** khi tin vào code. Kết quả ghi vào `docs/report/spike/README.md`.

> Ghi chú: code trong dự án được viết theo tài liệu hướng dẫn nhưng **chưa được chạy với dữ liệu thật** (môi trường soạn code không truy cập được các nguồn này). Bước này là nơi nhóm xác nhận.

Mở PowerShell, đi tới thư mục lưu kết quả:

```powershell
cd D:\User_Files\Downloads\APP_261\mu-news\docs\report\spike
$TOKEN = "dán_token_football-data_vào_đây"
```

Trên Windows dùng `curl.exe` (không dùng `curl`, vì trong PowerShell `curl` là tên khác của `Invoke-WebRequest`).

## 1. football-data.org (đội, BXH, lịch đấu)

```powershell
curl.exe -s -H "X-Auth-Token: $TOKEN" https://api.football-data.org/v4/teams/66 -o fd_team.json
curl.exe -s -H "X-Auth-Token: $TOKEN" https://api.football-data.org/v4/competitions/PL/standings -o fd_standings.json
curl.exe -s -H "X-Auth-Token: $TOKEN" "https://api.football-data.org/v4/teams/66/matches?status=SCHEDULED&limit=5" -o fd_matches_scheduled.json
curl.exe -s -H "X-Auth-Token: $TOKEN" "https://api.football-data.org/v4/teams/66/matches?status=FINISHED" -o fd_matches_finished.json
```

Mở `fd_team.json`: phải thấy `"name": "Manchester United FC"`, `coach`, `runningCompetitions`. Nếu thấy `"errorCode": 403` hoặc 401: token sai hoặc gói free không cho phép.

## 2. FPL API (cầu thủ, không cần token)

```powershell
curl.exe -s -A "mu-news-student-project" https://fantasy.premierleague.com/api/bootstrap-static/ -o fpl_bootstrap.json
curl.exe -s -A "mu-news-student-project" https://fantasy.premierleague.com/api/element-summary/1/ -o fpl_player_1.json
```

Mở `fpl_bootstrap.json`, tìm `"short_name":"MUN"` trong mảng `teams` và vài phần tử trong `elements` có `first_name`, `second_name`, `element_type`, `status`, `minutes`, `goals_scored`.

Id `1` không phải cầu thủ MU (ngày 31/10/2026 là Raya của Arsenal); lệnh trên chỉ để xem khuôn `history_past`. Muốn thử cầu thủ MU, lấy một `id` có `"team": 16` trong `fpl_bootstrap.json` (16 là id của MU trong FPL mùa này, ví dụ `43`) rồi thay số `1`.

## 3. RSS tin tức

```powershell
curl.exe -s https://www.manutd.com/Feeds/NewsSecondRSSFeed -o rss_manutd.xml
curl.exe -s https://www.football365.com/manchester-united/rss2 -o rss_football365.xml
curl.exe -s https://www.caughtoffside.com/tags/premier-league/manchester-united/feed/ -o rss_caughtoffside.xml
```

Mở từng file bằng VS Code: phải thấy nhiều thẻ `<item>` có `<title>`, `<link>`, `<pubDate>`. Ghi lại ảnh nằm ở thẻ nào (`<enclosure>`, `<media:thumbnail>`, `<media:content>` hay `<img>` trong `<description>`).

## 4. CSV lịch sử (football-data.co.uk)

```powershell
curl.exe -sSL -A "Mozilla/5.0" https://www.football-data.co.uk/mmz4281/2526/E0.csv -o csv_2526.csv
curl.exe -sSL -A "Mozilla/5.0" https://www.football-data.co.uk/mmz4281/1011/E0.csv -o csv_1011.csv
Get-Content csv_2526.csv -TotalCount 3
Get-Content csv_1011.csv -TotalCount 3
```

Dòng đầu phải có `Date,HomeTeam,AwayTeam,FTHG,FTAG,FTR`; tên đội viết là `Man United`. Ghi lại định dạng ngày (`dd/mm/yy` hay `dd/mm/yyyy`).

> **Lưu ý (đã gặp ngày 31/10/2026):** với lệnh `curl.exe -s …` thường (không có `-L` và `-A`), hai file CSV tải về **rỗng**. Trang này chỉ trả dữ liệu khi request đi theo chuyển hướng (`-L`) và có User-Agent kiểu trình duyệt (`-A "Mozilla/5.0"`). `-S` để curl vẫn in lỗi nếu có. Backend (`seed/importCsv.ts`) đã gửi User-Agent tương tự.
>
> Muốn xem máy chủ trả gì: `curl.exe -sSIL https://www.football-data.co.uk/mmz4281/2526/E0.csv` (chỉ in phần đầu phản hồi, các dòng `HTTP/...`).

## 5. Sau khi chạy

1. Điền cột "Kết quả của nhóm" trong `docs/report/spike/README.md`.
2. Nếu tên trường JSON khác với code → sửa trong `backend/src/services/*.ts` (không sửa app).
3. **Không** để file có token trong thư mục này. Các file JSON/XML/CSV ở trên không chứa token nên giữ lại làm minh chứng được.

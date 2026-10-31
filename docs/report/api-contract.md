# Hợp đồng API (API contract)

Tài liệu chung giữa người A (backend) và người B (app). Người B dựa vào bảng này để làm màn hình bằng dữ liệu giả khi backend chưa xong. Nội dung dùng cho chương 2 và chương 6 của báo cáo.

**Nếu code thay đổi tên route hoặc dạng `data`, sửa bảng này cho khớp code đang chạy rồi báo người kia.**

Trạng thái: **khớp với code** sau bước A5 (file `backend/src/routes/index.ts`), ngày 30/10/2026.

## Khung phản hồi chung (Standardized Response)

Mọi endpoint đều trả JSON dạng:

```json
{ "status": "success", "message": "ok", "data": { } }
```

Khi lỗi:

```json
{ "status": "error", "message": "Câu thông báo tiếng Việt", "data": null }
```

| Mã HTTP | Khi nào |
| --- | --- |
| 200 | Thành công |
| 404 | Sai đường dẫn, không có cầu thủ hoặc mùa giải được yêu cầu |
| 429 | Gọi quá 120 request/phút từ một địa chỉ IP (`express-rate-limit`) |
| 502 | Nguồn bên ngoài lỗi và cache không có bản cũ |

## Danh sách endpoint

Địa chỉ gốc: `http://<máy>:3000/api` (khi phát triển) hoặc địa chỉ công khai sau khi deploy (A5).

| Endpoint | Tham số | `data` trả về | Nguồn | Cache | Màn hình dùng |
| --- | --- | --- | --- | --- | --- |
| `GET /api/health` |  | `{ time }` | — | — | Kiểm tra kết nối |
| `GET /api/news` | `type=all` hoặc `transfer` (mặc định `all`); `limit` 1–50 (mặc định 20) | Mảng `{ id, title, summary, image?, link, source, publishedAt, isTransfer }` | 3 RSS | 5 phút | Tin tức, Bài đã lưu |
| `GET /api/team` |  | `{ name, crest?, venue?, founded?, coach, competitions[{ code, name, emblem? }], staff[], honours[{ competition, titles, lastWon, source }] }` | football-data.org + SQLite | 60 phút | Đội hình (ban huấn luyện), Lịch sử (danh hiệu) |
| `GET /api/staff` |  | Mảng `{ name, role, nationality, since, source }` | SQLite (`staff.json`) | — | (dự phòng, app dùng `staff` trong `/team`) |
| `GET /api/squad` |  | `{ updatedAt, players[] }`, cầu thủ `{ id, name, shortName, position, positionOrder, status, news, stats }` | FPL | 10 phút | Đội hình |
| `GET /api/players/:id` | `id` là số nguyên (id FPL) | `{ profile, season, pastSeasons[{ season, minutes, goals, assists, cleanSheets, yellow, red }] }` | FPL | 60 phút | Chi tiết cầu thủ |
| `GET /api/matches` | `scope=upcoming` hoặc `results` (mặc định `upcoming`); `limit` 1–50 (mặc định 10) | Mảng `{ id, date, status, competition, home, away, homeGoals, awayGoals }` | football-data.org (dự phòng: CSV) | 10 phút | Trận đấu |
| `GET /api/standings` |  | `{ season, table[] }`, dòng `{ position, team, crest?, played, won, drawn, lost, gf, ga, points, isUnited }` | football-data.org (dự phòng: CSV) | 5 phút | BXH |
| `GET /api/seasons` |  | Mảng `{ season, position, points, played, won, drawn, lost, gf, ga }`, mùa mới nhất trước | SQLite (CSV) | — | Lịch sử |
| `GET /api/seasons/:season` | ví dụ `2024-25` | `{ summary, table[], matches[{ date, home, away, homeGoals, awayGoals }] }` | SQLite (CSV) | — | Chi tiết mùa giải |

`stats` của cầu thủ: `{ minutes, goals, assists, cleanSheets, yellow, red }`.

## Thay đổi so với bản ở bước A2

| Thay đổi | Lý do |
| --- | --- |
| `/team` có thêm `staff[]` | Code của bước A4 (`getTeam`) trả kèm ban huấn luyện; tab Đội hình dùng trường này |
| Cầu thủ có thêm `shortName`, `positionOrder` | Code của bước A4 (`getSquad`) trả thêm; app dùng `positionOrder` để gom nhóm theo vị trí |
| `/staff` giữ lại | Bảng ở A2 có endpoint này nhưng route ở A5 không viết; đã thêm route để khớp hợp đồng |
| Cột "Nguồn", "Cache" | Thêm để dùng cho chương 2 và phần rủi ro |

## Ví dụ phản hồi

`GET /api/news?type=transfer&limit=1`

```json
{
  "status": "success",
  "message": "ok",
  "data": [
    {
      "id": "a1b2c3d4e5f6",
      "title": "Tiêu đề bài viết từ RSS",
      "summary": "Đoạn tóm tắt tối đa 280 ký tự…",
      "image": "https://…/anh.jpg",
      "link": "https://…/bai-goc",
      "publishedAt": "2026-10-30T08:00:00.000Z",
      "source": "Football365",
      "isTransfer": true
    }
  ]
}
```

`GET /api/seasons/2012-13` (rút gọn)

```json
{
  "status": "success",
  "message": "ok",
  "data": {
    "summary": { "position": 0, "team": "Man United", "played": 38, "won": 0, "drawn": 0, "lost": 0, "gf": 0, "ga": 0, "points": 0, "isUnited": true },
    "table": [ { "position": 0, "team": "…", "played": 38, "won": 0, "drawn": 0, "lost": 0, "gf": 0, "ga": 0, "points": 0, "isUnited": false } ],
    "matches": [ { "date": "2012-08-..", "home": "…", "away": "Man United", "homeGoals": 0, "awayGoals": 0 } ]
  }
}
```

Số liệu trong ví dụ chỉ minh họa khuôn dữ liệu; số thật lấy từ backend đang chạy.

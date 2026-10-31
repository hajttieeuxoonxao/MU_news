# MU News – Ứng dụng tin tức Manchester United

Bài tập lớn môn Phát triển ứng dụng di động. App Android (React Native + Expo) xem tin tức, tin chuyển nhượng, đội hình, ban huấn luyện, lịch thi đấu, BXH Premier League và lịch sử các mùa giải (từ 2010-11) của **đội bóng nam** Manchester United. App gọi một backend riêng (Node.js + Express + SQLite); backend gộp 4 nguồn dữ liệu miễn phí.

```text
Điện thoại (Expo Go / APK)
   │  HTTP JSON { status, message, data }
   ▼
Backend Express (cache, SQLite)
   ├─ RSS: manutd.com, Football365, CaughtOffside   → tin tức
   ├─ FPL API                                       → đội hình, cầu thủ
   ├─ football-data.org (token)                     → BXH, trận đấu, đội
   └─ CSV football-data.co.uk (nạp vào SQLite)      → lịch sử mùa giải
```

## Cấu trúc thư mục

```text
mu-news/
├─ backend/            API Node.js + Express + SQLite      (người A)
├─ mu-news-app/        App React Native + Expo SDK 58      (người B)
├─ docs/
│  ├─ report/          tài liệu cho báo cáo: hợp đồng API, sơ đồ (diagrams/), phiếu spike, kiểm thử, bug list, Figma
│  ├─ command_to_run/  lệnh chạy từng bước (cài đặt → spike → backend → app → deploy → APK → demo)
│  └─ theory/          kiến thức lý thuyết áp dụng trong đồ án
├─ changelog/          mỗi file .md ghi mọi thay đổi tại một thời điểm (tên file: YYYY-MM-DD_HH-MM.md)
├─ PROGRESS.md         "đã xong / đang kẹt" mỗi ngày
└─ .gitignore
```

## Chạy nhanh (Windows PowerShell)

```powershell
# Backend
cd backend
npm install
Copy-Item .env.example .env   # điền FOOTBALL_DATA_TOKEN
npm run dev                   # http://localhost:3000/api/health

# App (cửa sổ khác)
cd mu-news-app
npm install
Copy-Item .env.example .env   # sửa IP máy chạy backend
npx expo start                # quét QR bằng Expo Go
```

Chi tiết từng bước: `docs/command_to_run/` (đọc theo số thứ tự 01 → 07).

## Trạng thái

- Code backend và app đã viết đủ các bước A1–A9 của tài liệu hướng dẫn + dark mode, tìm kiếm tin, đội hình gom nhóm.
- **Chưa chạy với dữ liệu thật.** Bước tiếp theo của nhóm: chạy `docs/command_to_run/02_thu_nguon_du_lieu_spike.md`, điền `docs/report/spike/README.md`, rồi chạy bảng `docs/report/test-checklist.md` trên điện thoại.
- Lịch sử thay đổi: thư mục `changelog/`.

## Giới hạn phạm vi

Chỉ đội nam; lịch sử chỉ gồm Premier League từ 2010-11 (không có cúp, giải châu Âu, đội hình các mùa cũ); tin chuyển nhượng nhận diện bằng từ khóa; dữ liệu cầu thủ từ FPL (không chính thức); ban huấn luyện và danh hiệu nhập tay có ghi nguồn.

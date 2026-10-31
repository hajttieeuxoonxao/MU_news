# 03. Chạy backend trên máy (người A)

## Chạy chế độ phát triển

```powershell
cd D:\User_Files\Downloads\APP_261\mu-news\backend
npm install          # chỉ cần lần đầu
npm run dev          # tự khởi động lại khi sửa code
```

Thấy dòng `API chạy tại cổng 3000` là được. Lần đầu chạy, backend tải CSV các mùa từ 2010-11 và in `Đã nạp xong lịch sử các mùa giải` (có thể mất 10–30 giây).

## Kiểm tra trên trình duyệt hoặc PowerShell

```powershell
curl.exe http://localhost:3000/api/health
curl.exe http://localhost:3000/api/seasons
curl.exe http://localhost:3000/api/seasons/2012-13
curl.exe "http://localhost:3000/api/news?type=transfer&limit=5"
curl.exe http://localhost:3000/api/squad
curl.exe http://localhost:3000/api/players/1
curl.exe "http://localhost:3000/api/matches?scope=results"
curl.exe "http://localhost:3000/api/matches?scope=upcoming"
curl.exe http://localhost:3000/api/standings
curl.exe http://localhost:3000/api/team
curl.exe http://localhost:3000/api/staff
curl.exe "http://localhost:3000/api/news?limit=abc"   # vẫn chạy, dùng mặc định 20
```

`players/1` trả 404 nếu id 1 không phải cầu thủ MU. Lấy một `id` thật trong kết quả `/api/squad` để thử.

## Cho điện thoại cùng Wi-Fi gọi vào

```powershell
ipconfig
```

Tìm dòng `IPv4 Address` của card Wi-Fi (ví dụ `192.168.1.10`). Trên điện thoại mở `http://192.168.1.10:3000/api/health`. Nếu Windows hỏi tường lửa, chọn **Allow**.

## Các lệnh khác

| Lệnh | Tác dụng |
| --- | --- |
| `npm start` | Chạy không tự khởi động lại (dùng khi deploy) |
| `npm run typecheck` | Kiểm tra lỗi kiểu TypeScript, không chạy server |
| `Remove-Item mu.db*` rồi `npm run dev` | Xóa CSDL để nạp lại lịch sử từ đầu (kiểm thử A9 dòng 1) |
| `Ctrl + C` | Dừng server |

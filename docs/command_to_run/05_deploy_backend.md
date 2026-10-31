# 05. Đưa backend lên mạng (bước A5)

Điện thoại (Expo Go, APK) cần gọi được backend. Có ba cách: **làm cách 1 khi phát triển, cách 2 khi demo và build APK nộp bài, cách 3 khi hosting lỗi sát giờ**.

| Cách | Dùng khi | Lưu ý |
| --- | --- | --- |
| 1. Cùng Wi-Fi | Phát triển hằng ngày | Máy tính và điện thoại chung Wi-Fi; cho phép tường lửa |
| 2. Hosting miễn phí (Render, Railway…) | Demo, APK nộp bài | Gói free thường "ngủ", lần gọi đầu mất 30–60 giây; ổ đĩa có thể bị xóa nhưng `seedIfEmpty()` tự nạp lại |
| 3. Tunnel | Hosting lỗi sát giờ demo | Laptop bật suốt buổi demo; địa chỉ đổi mỗi lần chạy |

> Tên dịch vụ, gói miễn phí và giới hạn thay đổi thường xuyên. **Mở trang giá của host trước khi chọn** và ghi lựa chọn cuối vào báo cáo.

## Cách 1: Cùng Wi-Fi

1. Chạy backend: xem `03_chay_backend.md`.
2. Lấy IP máy bằng `ipconfig`.
3. Trong `mu-news-app/.env` đặt `EXPO_PUBLIC_API_URL=http://<IP>:3000/api`, rồi chạy lại `npx expo start`.

## Cách 2: Render (ví dụ)

1. Đẩy repo lên GitHub (nhóm tự làm). **Kiểm tra `.env` không có trên GitHub.**
2. Vào https://render.com → New → Web Service → chọn repo.
3. Điền:

| Mục | Giá trị |
| --- | --- |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Environment Variables | `FOOTBALL_DATA_TOKEN` = token của nhóm (không cần đặt `PORT`, host tự cấp) |

4. Chờ deploy xong, mở `https://<tên-dịch-vụ>.onrender.com/api/health` **bằng điện thoại dùng 4G** (không dùng Wi-Fi nhà) để chắc chắn địa chỉ công khai hoạt động.
5. Gửi địa chỉ cho người B, đặt vào `eas.json` (xem `06_build_apk.md`).

## Cách 3: Tunnel từ laptop

```powershell
cd D:\User_Files\Downloads\APP_261\mu-news\backend
npm start
# mở cửa sổ PowerShell thứ hai:
npx localtunnel --port 3000
```

Lệnh in ra địa chỉ `https://….loca.lt`. Dùng `https://….loca.lt/api` làm `EXPO_PUBLIC_API_URL`. Địa chỉ đổi mỗi lần chạy, nên phải cấu hình lại app (và build lại APK nếu dùng APK).

## Bảo mật cần tự rà lại trước khi deploy

1. Khóa API chỉ nằm ở backend, trong `.env`; `.env` có trong `.gitignore`.
2. Backend chỉ gọi địa chỉ cố định trong code, không nhận URL từ người dùng (`/players/:id` kiểm tra cầu thủ thuộc MU trước khi gọi FPL).
3. Tham số được kiểm tra bằng `intParam`; SQL dùng `prepare` với `?`.
4. `helmet`, `cors`, `express-rate-limit` (120 request/phút/IP) đã gắn ở `server.ts`.
5. Không ghi log token; app chỉ nhận thông báo lỗi chung chung.

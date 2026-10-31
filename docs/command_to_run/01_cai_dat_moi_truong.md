# 01. Cài đặt môi trường (cả hai thành viên)

Làm một lần trên mỗi máy trước khi chạy dự án. Lệnh viết cho **Windows PowerShell**.

## 1. Phần mềm cần có

| Phần mềm | Phiên bản | Kiểm tra bằng lệnh |
| --- | --- | --- |
| Node.js (bản LTS) | 20 trở lên (khuyên dùng 22) | `node -v` |
| npm (đi kèm Node.js) | 10 trở lên | `npm -v` |
| Git | bất kỳ | `git --version` |
| VS Code | bất kỳ | mở được là được |
| Expo Go (trên điện thoại) | bản mới nhất từ CH Play (Android) hoặc App Store (iPhone) | mở được app; iPhone xem mục 4 của `04_chay_app.md` |

Tải Node.js tại https://nodejs.org (chọn LTS). Sau khi cài, **đóng và mở lại PowerShell** rồi chạy `node -v`.

## 2. Đăng ký khóa football-data.org (chỉ người A)

1. Vào https://www.football-data.org/client/register, tạo tài khoản miễn phí.
2. Token được gửi qua email. Chỉ người A giữ token.
3. **Không** dán token vào app, không gửi lên GitHub, không chụp màn hình có token đưa vào báo cáo.

## 3. Cài thư viện cho dự án

```powershell
cd D:\User_Files\Downloads\APP_261\mu-news\backend
npm install

cd ..\mu-news-app
npm install
```

`npm install` đọc file `package.json` và tải mọi thư viện vào thư mục `node_modules` (thư mục này không nộp, không đẩy lên GitHub).

## 4. Tạo file `.env` cho backend

```powershell
cd D:\User_Files\Downloads\APP_261\mu-news\backend
Copy-Item .env.example .env
notepad .env
```

Điền token vào dòng `FOOTBALL_DATA_TOKEN=`, lưu lại.

## 5. Lỗi hay gặp

| Lỗi | Cách xử lý |
| --- | --- |
| `node` không được nhận diện | Cài lại Node.js, tick "Add to PATH", mở lại PowerShell |
| `npm install` báo lỗi `better-sqlite3` cần build | Dùng Node.js bản LTS (20 hoặc 22). Nếu vẫn lỗi, cài "Visual Studio Build Tools" (gói "Desktop development with C++") rồi chạy lại |
| `npm install` báo `… vulnerabilities (… high)` | Không phải lỗi; **không** chạy `npm audit fix --force` (xem mục 5 của `04_chay_app.md`) |
| PowerShell chặn chạy script (`running scripts is disabled`) | Chạy một lần: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |

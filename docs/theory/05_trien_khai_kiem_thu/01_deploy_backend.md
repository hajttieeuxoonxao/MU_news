# Triển khai backend lên mạng

## 1. Vì sao phải deploy

Khi phát triển, điện thoại gọi máy tính qua Wi-Fi (`http://192.168.x.x:3000`). Địa chỉ này **chỉ dùng được trong mạng nhà**. File APK nộp bài chạy ở bất kỳ đâu nên cần một **địa chỉ công khai** (ví dụ `https://ten.onrender.com`).

## 2. Khái niệm

| Khái niệm | Giải thích | Trong dự án |
| --- | --- | --- |
| Hosting / PaaS | Dịch vụ chạy code của mình trên máy chủ của họ | Render hoặc tương tự |
| Build command / Start command | Lệnh cài đặt và lệnh chạy | `npm install` / `npm start` |
| Biến môi trường | Cấu hình bí mật đặt trên host, không nằm trong code | `FOOTBALL_DATA_TOKEN`; `PORT` do host cấp |
| Server "ngủ" | Gói miễn phí tắt server khi lâu không dùng; request đầu chậm 30–60 giây | App đặt giới hạn chờ 20 giây và nút Thử lại |
| Ổ đĩa tạm | Host có thể xóa file khi khởi động lại | `mu.db` là dữ liệu dẫn xuất, `seedIfEmpty()` tự nạp lại |
| Tunnel | Mở một địa chỉ công khai trỏ về máy mình | `npx localtunnel --port 3000` (phương án dự phòng) |

## 3. Kiểm tra sau khi deploy

Mở `https://<địa-chỉ>/api/health` bằng điện thoại dùng **4G** (không dùng Wi-Fi nhà) để chắc chắn địa chỉ công khai thật sự hoạt động.

Lệnh cụ thể: `docs/command_to_run/05_deploy_backend.md`.

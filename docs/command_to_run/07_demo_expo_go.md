# 07. Demo bằng Expo Go (bước A9)

1. Backend chạy trên hosting (`05_deploy_backend.md`); trong `mu-news-app/.env` đặt `EXPO_PUBLIC_API_URL` là địa chỉ công khai.
2. Mở `https://<backend>/api/health` trước buổi demo 2–3 phút để "đánh thức" server miễn phí.
3. Chạy:

```powershell
cd D:\User_Files\Downloads\APP_261\mu-news\mu-news-app
npx expo start
# Wi-Fi trường chặn kết nối giữa các máy thì dùng:
npx expo start --tunnel
```

4. Android: mở Expo Go, quét mã QR. iPhone: quét bằng app Camera, cho phép Expo Go truy cập mạng cục bộ (xem `04_chay_app.md` mục 4).

## Kịch bản 5 phút

| Phút | Thao tác | Điểm cần nói |
| --- | --- | --- |
| 1 | Tin tức → bộ lọc Chuyển nhượng → gõ tìm kiếm → lưu một bài → mở "Đã lưu" | Gộp 3 RSS, lọc đội nam, chỉ hiện tóm tắt + link gốc |
| 2 | Đội hình (nhóm theo vị trí) → bấm một cầu thủ → số liệu các mùa trước → Ban huấn luyện | Dữ liệu FPL; ban huấn luyện nhập tay có nguồn |
| 3 | Trận đấu (Sắp tới / Kết quả) → BXH (dòng MU tô đỏ) | football-data.org, có cache 5–10 phút |
| 4 | Lịch sử → mở mùa 2012-13 | BXH tự tính từ CSV, lưu SQLite |
| 5 | Đổi điện thoại sang chế độ Tối; tắt Wi-Fi để thấy màn hình lỗi + nút Thử lại | Dark mode, xử lý lỗi, dữ liệu cache |

Dự phòng: quay sẵn video màn hình một lần chạy tốt.

# EAS Build, APK và biến môi trường của app

## 1. APK và AAB

| | APK | AAB |
| --- | --- | --- |
| Là gì | Gói cài đặt Android hoàn chỉnh | Gói gửi lên Google Play, Play tự tạo APK cho từng máy |
| Cài trực tiếp | Được (cho phép "nguồn không rõ") | Không |
| Profile EAS | `preview` (`"buildType": "apk"`) | `production` (mặc định) |

Bài nộp cần **APK** → dùng `eas build --platform android --profile preview`.

## 2. EAS Build

EAS (Expo Application Services) đóng gói app trên máy chủ của Expo: không cần cài Android Studio hay JDK. Cấu hình ở `mu-news-app/eas.json`; thông tin app (tên, mã gói `android.package`) ở `app.json`. Gói miễn phí phải xếp hàng, có thể mất từ 10 đến vài chục phút → build sớm ít nhất một ngày trước hạn.

## 3. Biến `EXPO_PUBLIC_`

- Biến bắt đầu bằng `EXPO_PUBLIC_` được **nhúng cứng vào mã JavaScript lúc chạy/đóng gói**.
- Dự án dùng `EXPO_PUBLIC_API_URL` (địa chỉ backend): lấy từ `.env` khi chạy Expo Go, từ `eas.json → build.preview.env` khi build APK.
- Hệ quả 1: **đổi địa chỉ backend thì phải build lại APK**.
- Hệ quả 2: ai có APK cũng đọc được giá trị này → **không bao giờ** để khóa bí mật trong biến `EXPO_PUBLIC_` (khóa football-data.org chỉ ở backend).

## 4. Mã gói (application id)

`android.package` (ví dụ `com.tennhom.munews`) là định danh duy nhất của app trên Android. Hai app cùng mã gói sẽ đè lên nhau khi cài. Chỉ dùng chữ thường, số, dấu chấm.

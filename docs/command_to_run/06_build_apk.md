# 06. Build file APK bằng EAS (bước A9)

APK là file cài app trực tiếp lên Android. EAS build trên máy chủ của Expo nên không cần Android Studio. **Bắt đầu build trước hạn ít nhất một ngày** (gói miễn phí phải xếp hàng 10 phút đến vài chục phút).

## 1. Chuẩn bị (một lần)

```powershell
npm install -g eas-cli
eas login            # tài khoản expo.dev (đăng ký miễn phí)
cd D:\User_Files\Downloads\APP_261\mu-news\mu-news-app
eas build:configure  # chọn Android; nếu hỏi ghi đè eas.json thì chọn KHÔNG (file đã có sẵn)
```

`eas build:configure` có thể thêm `extra.eas.projectId` vào `app.json`. Đó là bình thường.

## 2. Kiểm tra cấu hình trước khi build

| File | Mục | Cần sửa |
| --- | --- | --- |
| `eas.json` | `build.preview.env.EXPO_PUBLIC_API_URL` | Thay `https://TEN-BACKEND.onrender.com/api` bằng địa chỉ backend công khai thật (xem `05_deploy_backend.md`) |
| `app.json` | `expo.android.package` | Đang là `com.tennhom.munews`; thay `tennhom` bằng tên nhóm, chỉ chữ thường, không dấu, không khoảng trắng |
| `app.json` | `expo.name` | `MU News` (tên hiện dưới icon) |

Địa chỉ backend được **nhúng cứng lúc build**: đổi địa chỉ thì phải build lại APK. Vì vậy chốt hosting trước khi build.

## 3. Build

```powershell
eas build --platform android --profile preview
```

Xong, EAS in ra đường link tải file `.apk`. Profile `preview` ra APK; profile `production` ra AAB dành cho Google Play (không cài trực tiếp được).

## 4. Cài thử

1. Tải `.apk` về một điện thoại Android **khác máy người build**.
2. Cho phép "cài từ nguồn không rõ" khi được hỏi.
3. Chạy lại bảng kiểm thử `docs/report/test-checklist.md` bằng chính file APK này.

## 5. Gói nộp

- File `.apk` và link EAS dự phòng.
- Mã nguồn `backend/` và `mu-news-app/` (không kèm `.env`, `node_modules`, `mu.db`), kèm `README.md`.
- Báo cáo PDF.
- Link Figma, hình UML (PNG trong `docs/report/diagrams/`).
- Video quay màn hình demo (dự phòng).

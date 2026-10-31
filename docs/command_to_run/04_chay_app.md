# 04. Chạy app bằng Expo Go (người B)

App dùng **Expo SDK 58**. Điện thoại cần cài **Expo Go bản mới nhất** trên CH Play (Expo Go chỉ chạy được SDK mới nhất).

## 1. Lần đầu

```powershell
cd D:\User_Files\Downloads\APP_261\mu-news\mu-news-app
npm install
Copy-Item .env.example .env
notepad .env
```

Trong `.env` sửa IP thành IP máy đang chạy backend (xem `ipconfig`), ví dụ:

```text
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000/api
```

Khi backend đã deploy, đổi thành địa chỉ công khai, ví dụ `https://ten-backend.onrender.com/api`.

## 2. Chạy

```powershell
npx expo start
```

Mở Expo Go → quét mã QR trong cửa sổ PowerShell. Điện thoại và máy tính phải chung Wi-Fi.

| Tình huống | Lệnh |
| --- | --- |
| Sửa file `.env` | Dừng (`Ctrl + C`) rồi chạy lại `npx expo start` |
| Wi-Fi trường chặn kết nối giữa các máy | `npx expo start --tunnel` (đồng ý cài `@expo/ngrok` khi được hỏi) |
| App lỗi lạ sau khi đổi thư viện | `npx expo start --clear` |
| Kiểm tra lỗi kiểu TypeScript | `npm run typecheck` |
| Kiểm tra phiên bản thư viện có khớp SDK | `npx expo install --check` |

## 3. Kiểm tra nhanh kết nối backend

Trên điện thoại mở trình duyệt, vào `http://<IP>:3000/api/health`. Thấy `"status":"success"` thì app sẽ gọi được backend. Nếu tab Tin tức báo "Network request failed": sai IP, backend chưa chạy, hoặc tường lửa Windows chặn cổng 3000.

## 4. Dùng iPhone thay cho Android

Phát triển và demo bằng **Expo Go trên iPhone** làm được như Android. Riêng **file APK chỉ cài được trên Android**.

| Việc | iPhone | Ghi chú |
| --- | --- | --- |
| Chạy app khi phát triển (Expo Go) | Được | Cài **Expo Go** từ App Store, luôn cập nhật bản mới nhất (app dùng Expo SDK 58) |
| Demo bằng Expo Go | Được | Giống Android |
| Kiểm tra chế độ Tối | Được | Settings → Display & Brightness → Dark |
| Cài và kiểm thử file **APK** (bước A9) | **Không** | APK là định dạng của Android. Cần một máy Android (của bạn cùng nhóm, bạn bè) hoặc trình giả lập Android (Android Studio → Device Manager) trên máy tính |
| Cài app iPhone không cần Expo Go | Không cần làm | Cần tài khoản Apple Developer trả phí; đề bài chỉ yêu cầu APK |

### Các bước trên iPhone

1. Cài **Expo Go** từ App Store.
2. iPhone và máy tính dùng **chung Wi-Fi**.
3. Trên máy tính chạy `npx expo start` (như mục 2).
4. Mở app **Camera** của iPhone, quét mã QR trong cửa sổ PowerShell → bấm thông báo "Open in Expo Go". (Expo Go trên iPhone không có nút quét QR riêng như bản Android.)
5. Khi iPhone hỏi **"Allow Expo Go to find and connect to devices on your local network?"** → chọn **Allow**. Nếu lỡ chọn "Don't Allow", app không gọi được backend; bật lại ở **Settings → Expo Go → Local Network**.
6. Kiểm tra kết nối backend: mở Safari trên iPhone, vào `http://<IP máy tính>:3000/api/health`.

| Lỗi trên iPhone | Cách xử lý |
| --- | --- |
| Quét QR không mở app | Cập nhật Expo Go; hoặc chạy `npx expo start --tunnel` rồi quét lại |
| "Project is incompatible with this version of Expo Go" | Expo Go cũ hoặc mới hơn SDK 58 → cập nhật Expo Go; nếu Expo Go đã lên SDK mới hơn, báo lại để nâng cấp project |
| Tin tức báo "Network request failed" | Chưa cho phép Local Network (bước 5), sai IP trong `.env`, hoặc khác Wi-Fi |

Giao diện được thiết kế theo khung Android 360 px; trên iPhone vẫn hiển thị đúng, chỉ khác chi tiết nhỏ như thanh trạng thái và nút quay lại.

## 5. Thông báo "vulnerabilities" sau `npm install`

Sau `npm install` có thể thấy dòng như:

```text
13 vulnerabilities (1 low, 10 moderate, 2 high)
To address all issues (including breaking changes), run: npm audit fix --force
```

Đây **không phải lỗi**, `npm install` đã chạy xong. `npm audit` báo có lỗ hổng đã biết trong một số thư viện mà dự án dùng gián tiếp. Kiểm tra ngày 01/11/2026:

| Thư viện | Thuộc phần | Chạy ở đâu |
| --- | --- | --- |
| `@expo/cli`, `@expo/config`, `@expo/config-plugins`, `@expo/prebuild-config`, `@expo/metro-config`, `@expo/fingerprint`, `@expo/inline-modules` | Công cụ dòng lệnh của Expo (`npx expo start`, build) | Máy tính của bạn khi phát triển |
| `glob`, `minimatch`, `deepmerge`, `zod` | Thư viện con của các công cụ trên | Máy tính của bạn khi phát triển |

Không thư viện nào nằm trong phần code chạy trên điện thoại hay xử lý dữ liệu người dùng, nên với bài tập lớn này **có thể bỏ qua**.

**Không chạy `npm audit fix --force`.** Lệnh này sẽ **hạ `expo` từ SDK 58 xuống 53.0.11** và đổi `expo-splash-screen`, làm các thư viện không còn khớp phiên bản và Expo Go không mở được app. Cũng không nên chạy `npm audit fix` (không có `--force`) vì nó có thể đổi phiên bản thư viện con ngoài danh sách Expo đã kiểm tra.

Cách an toàn khi muốn cập nhật: `npx expo install --check` (Expo tự đề xuất bản vá tương thích SDK 58). Có thể ghi việc này vào mục hạn chế/hướng phát triển ở chương 8.

Sau khi cập nhật bản vá ngày 01/11/2026 (`expo` 58.0.22, `expo-router` 58.0.29, `@expo/ui` 58.0.26), cảnh báo còn **12 vulnerabilities (moderate)**, không còn mức high.

## 6. Cập nhật bản vá Expo khi `npx expo start` báo "An update for expo is available"

Chỉ cập nhật khi số đầu vẫn là **58** (ví dụ 58.0.21 → 58.0.22). Dừng app (`Ctrl + C`) rồi chạy:

```powershell
npm install expo@~58.0.22          # thay bằng số phiên bản Expo đề xuất
npx expo install --fix             # đưa các thư viện khác về bản khớp
npx expo install --check           # phải báo không còn gì cần cập nhật
npx expo start --clear
```

## 7. Lỗi "You're signed in to Expo Go as … but not signed in to Expo CLI"

Expo Go trên điện thoại đã đăng nhập tài khoản Expo nhưng máy tính chưa. Chạy `npx expo login` trên máy tính, đăng nhập **cùng tài khoản**, rồi `npx expo start` lại. Tài khoản này cũng dùng cho `eas login` khi build APK.

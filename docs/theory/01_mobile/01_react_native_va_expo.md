# React Native và Expo

## 1. React Native là gì

React Native (RN) là framework của Meta để viết app di động bằng **JavaScript/TypeScript** và cú pháp **React**. Khác với trang web, RN không vẽ HTML: mỗi thẻ như `<View>`, `<Text>`, `<Image>` được chuyển thành **thành phần giao diện gốc** (native view) của Android/iOS. Vì vậy app trông và chạy như app thật, nhưng chỉ cần viết một bộ mã cho cả hai hệ điều hành.

| Thẻ RN | Tương đương web | Dùng trong dự án |
| --- | --- | --- |
| `View` | `div` | Khung bố cục mọi màn hình |
| `Text` | `p`, `span` | Mọi chữ; trong RN chữ **bắt buộc** nằm trong `Text` |
| `Image` | `img` | Ảnh bài báo trong `NewsCard.tsx` |
| `Pressable` | `button` | Thẻ tin, nút lọc `Chip.tsx`, nút Thử lại |
| `FlatList`, `SectionList` | danh sách cuộn | Tin tức, đội hình gom nhóm, các mùa |
| `TextInput` | `input` | Ô tìm kiếm tin |

Bố cục dùng **Flexbox** (mặc định `flexDirection: 'column'`), kích thước tính bằng điểm ảnh độc lập mật độ (dp).

## 2. Expo là gì

Expo là bộ công cụ bọc quanh React Native giúp người mới không phải cài Android Studio:

- **Expo SDK**: tập thư viện đã kiểm tra tương thích với nhau theo từng phiên bản (dự án dùng **SDK 58**, React Native 0.88, React 19.3).
- **Expo Go**: app trên điện thoại, quét mã QR là chạy được code đang viết (tải lại ngay khi lưu file).
- **Metro bundler**: gom mã TypeScript thành một gói JavaScript cho điện thoại.
- **EAS Build**: máy chủ của Expo đóng gói ra file `.apk` (xem `05_trien_khai_kiem_thu/02_eas_build_apk.md`).
- `npx expo install <gói>`: luôn dùng thay cho `npm install` khi thêm thư viện, vì nó chọn **phiên bản khớp SDK**.

Giới hạn: Expo Go chỉ chứa các mô-đun native có sẵn. Thư viện có mã native riêng (không nằm trong Expo Go) cần "development build". Dự án chỉ dùng thư viện có sẵn trong Expo Go (`@react-native-async-storage/async-storage`, `@expo/vector-icons`), nên demo được bằng Expo Go.

## 3. Luồng chạy của app MU News

1. `npx expo start` khởi động Metro, in mã QR.
2. Expo Go tải gói JavaScript, chạy `expo-router/entry` → đọc thư mục `app/` để tạo màn hình.
3. Màn hình gọi `useApi('/news')` → `client.ts` gửi `fetch` tới backend → nhận JSON → vẽ lại giao diện.

## 4. TypeScript

TypeScript thêm **kiểu dữ liệu** cho JavaScript. File `src/api/types.ts` mô tả đúng khuôn JSON của backend (ví dụ `NewsItem` có `title: string`, `isTransfer: boolean`), nên khi gõ sai tên trường, `npm run typecheck` báo lỗi trước khi chạy app.

## Câu hỏi hay gặp khi vấn đáp

- *Vì sao chọn React Native thay vì Flutter/Kotlin?* Cùng ngôn ngữ với backend (TypeScript), khớp môn học, demo nhanh bằng Expo Go.
- *Expo Go khác APK thế nào?* Expo Go là app trung gian để phát triển; APK là app độc lập cài thẳng lên máy, không cần máy tính.

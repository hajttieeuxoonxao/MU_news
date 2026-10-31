# Theme và chế độ Sáng/Tối (dark mode)

## 1. Theme là gì

Theme là **bộ giá trị dùng chung** cho giao diện (màu, cỡ chữ, khoảng cách). Đặt ở một nơi (`src/theme.ts`) thay vì viết mã màu rải rác giúp đổi giao diện chỉ bằng một file và giữ thiết kế (Figma) khớp với code.

## 2. Bảng màu của dự án

| Tên trong code | Vai trò | Sáng | Tối |
| --- | --- | --- | --- |
| `red` | Màu nhận diện CLB, nút đang chọn | `#DA291C` | `#DA291C` |
| `light` | Nền màn hình | `#F5F5F5` | `#121212` |
| `card` | Nền thẻ, thanh tab | `#FFFFFF` | `#1E1E1E` |
| `text` | Chữ chính | `#1B1B1B` | `#F2F2F2` |
| `gray` | Chữ phụ | `#6B6B6B` | `#A3A3A3` |
| `highlight` | Dòng Man United trong BXH | `#FBE3E1` | `#4A1F1C` |
| `border` | Đường kẻ | `#EBEBEB` | `#2C2C2C` |
| `dark` | Nền đầu bảng xếp hạng | `#1B1B1B` | `#000000` |

Trong Figma, các màu này là **biến (variables)** cùng tên nhóm (`brand/red`, `bg/screen`, `text/primary`…).

## 3. Cách dark mode hoạt động

1. `app.json` đặt `"userInterfaceStyle": "automatic"` → app theo cài đặt Sáng/Tối của điện thoại.
2. Hook `useColorScheme()` của React Native trả về `'light'` hoặc `'dark'`.
3. `useColors()` chọn bảng màu tương ứng; mọi màn hình lấy màu qua hook này.
4. `app/_layout.tsx` truyền màu vào `ThemeProvider` của expo-router để thanh tiêu đề và nền điều hướng cũng đổi theo.

Lỗi hay gặp: `Text` không ghi màu sẽ mặc định màu đen → không đọc được trên nền tối. Vì vậy mọi `Text` trong dự án đều có `color` lấy từ `useColors()`.

## 4. Độ tương phản

Chữ chính trên nền (`#1B1B1B` trên `#F5F5F5`, `#F2F2F2` trên `#121212`) có tỉ lệ tương phản cao, vượt mức 4.5:1 mà chuẩn WCAG AA yêu cầu cho chữ thường.

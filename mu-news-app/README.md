# MU News – app (React Native + Expo SDK 58)

App tin tức về đội bóng nam Manchester United. Xem hướng dẫn đầy đủ ở thư mục gốc:

- Chạy app: `../docs/command_to_run/04_chay_app.md`
- Build APK: `../docs/command_to_run/06_build_apk.md`
- Hợp đồng API với backend: `../docs/report/api-contract.md`

```powershell
npm install
Copy-Item .env.example .env   # sửa IP backend
npx expo start
```

## Cấu trúc

```text
app/                 màn hình (expo-router: mỗi file là một màn hình)
  _layout.tsx        Stack + ThemeProvider (sáng/tối)
  (tabs)/            5 tab: index (Tin tức), squad, matches, table, history
  player/[id].tsx    chi tiết cầu thủ
  season/[label].tsx chi tiết mùa giải
  saved.tsx          bài đã lưu
src/
  api/               client.ts (gọi backend), types.ts (kiểu dữ liệu)
  hooks/             useApi.ts, useSaved.ts
  components/        StateView, NewsCard, LeagueTable, Chip
  theme.ts           bảng màu sáng/tối, hook useColors()
```

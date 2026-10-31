# Điều hướng bằng expo-router

## 1. Định tuyến theo file (file-based routing)

Với expo-router, **mỗi file trong thư mục `app/` là một màn hình**, đường dẫn của màn hình chính là đường dẫn file:

| File | Đường dẫn | Màn hình |
| --- | --- | --- |
| `app/(tabs)/index.tsx` | `/` | Tin tức |
| `app/(tabs)/squad.tsx` | `/squad` | Đội hình |
| `app/player/[id].tsx` | `/player/123` | Chi tiết cầu thủ (route động) |
| `app/season/[label].tsx` | `/season/2012-13` | Chi tiết mùa giải |
| `app/saved.tsx` | `/saved` | Bài đã lưu |

- **Thư mục trong ngoặc** như `(tabs)` là *nhóm*: gom màn hình lại nhưng **không** thêm vào đường dẫn.
- **Tên trong ngoặc vuông** như `[id]` là *tham số động*; đọc bằng `useLocalSearchParams()`.
- **`_layout.tsx`** không phải màn hình mà là *khung* bọc các màn hình cùng thư mục.

## 2. Hai kiểu điều hướng dùng trong dự án

**Stack (ngăn xếp)** — `app/_layout.tsx`: mở màn mới thì đặt lên trên, bấm Back thì gỡ ra. Dùng cho màn chi tiết (cầu thủ, mùa giải, bài đã lưu). Thanh tiêu đề có nút quay lại.

**Tabs (thanh tab dưới)** — `app/(tabs)/_layout.tsx`: 5 tab ngang hàng, chuyển qua lại không mất trạng thái. Ở SDK 58, nhập từ `expo-router/js-tabs`.

```text
Stack (app/_layout.tsx)
├─ (tabs)  ← Tabs: Tin tức | Đội hình | Trận đấu | BXH | Lịch sử
├─ player/[id]
├─ season/[label]
└─ saved
```

## 3. Chuyển màn hình

- Khai báo: `<Link href="/saved">Đã lưu</Link>` (tab Tin tức).
- Bằng lệnh: `router.push(`/player/${item.id}`)` (tab Đội hình), `router.push(`/season/${s.season}`)` (tab Lịch sử).

## 4. Vì sao chọn 5 tab

Nguyên tắc thiết kế di động khuyên thanh tab dưới có **3–5 mục**. Các chức năng phụ được đặt vào trong tab: bộ lọc Chuyển nhượng nằm trong Tin tức, Ban huấn luyện nằm trong Đội hình, danh hiệu nằm trong Lịch sử.

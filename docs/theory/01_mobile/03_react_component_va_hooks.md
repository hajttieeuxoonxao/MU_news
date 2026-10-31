# Component, props, state và hooks trong React

## 1. Component và props

**Component** là một hàm trả về giao diện. **Props** là tham số truyền vào component (chỉ đọc).

```tsx
// src/components/Chip.tsx — nhận 3 props
export default function Chip({ label, active, onPress }) { ... }
// dùng:
<Chip label="Chuyển nhượng" active={type === 'transfer'} onPress={() => setType('transfer')} />
```

Viết một lần, dùng nhiều nơi: `Chip` dùng ở 3 tab, `NewsCard` ở 2 màn, `LeagueTable` ở 2 màn, `StateView` ở 7 màn.

## 2. State và `useState`

**State** là dữ liệu thay đổi theo thời gian; khi state đổi, React **vẽ lại** component.

```tsx
const [type, setType] = useState<'all' | 'transfer'>('all'); // tab Tin tức
const [query, setQuery] = useState('');                          // ô tìm kiếm
```

## 3. `useEffect`: chạy việc phụ sau khi vẽ

Dùng để gọi API, đọc bộ nhớ... Mảng phụ thuộc `[...]` quyết định khi nào chạy lại.

```ts
useEffect(() => { load(); }, [load]); // useApi.ts: tải lại khi đường dẫn đổi
```

## 4. Custom hook

Hook tự viết (tên bắt đầu bằng `use`) gom logic lặp lại để dùng chung:

| Hook | File | Trả về | Dùng ở |
| --- | --- | --- | --- |
| `useApi<T>(path)` | `src/hooks/useApi.ts` | `{ data, error, loading, reload }` | 7 màn hình |
| `useSaved()` | `src/hooks/useSaved.ts` | `{ saved, toggle, isSaved }` | Tin tức, Bài đã lưu |
| `useColors()` | `src/theme.ts` | bảng màu sáng/tối | mọi màn hình |

Nhờ `useApi`, màn hình nào cũng có đủ **ba trạng thái** (đang tải, lỗi + Thử lại, có dữ liệu) mà không lặp code.

## 5. Hai mẹo trải nghiệm trong code

- `loading && !data`: chỉ hiện vòng quay lớn khi chưa có gì để xem; kéo làm mới thì giữ danh sách cũ.
- `data ? null : error`: nếu lần làm mới bị lỗi mạng, vẫn giữ dữ liệu cũ trên màn hình.

## 6. Giới hạn đã biết

Mỗi lần gọi `useSaved()` tạo một bản sao state riêng. Muốn mọi màn hình đồng bộ tức thì phải đưa state lên **React Context** (hướng phát triển, xem `docs/report/bug-list.md` dòng 5).

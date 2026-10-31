# RSS, XML và lọc tin bằng từ khóa

## 1. RSS

RSS là **file XML** do trang tin công bố, liệt kê các bài mới. Mỗi bài là một thẻ `<item>`:

```xml
<item>
  <title>Tiêu đề bài</title>
  <link>https://…/bai-goc</link>
  <pubDate>Fri, 30 Oct 2026 08:00:00 GMT</pubDate>
  <description>Đoạn tóm tắt…</description>
  <enclosure url="https://…/anh.jpg" type="image/jpeg"/>
</item>
```

RSS được thiết kế để **trích dẫn**: hiện tiêu đề, tóm tắt và dẫn về bài gốc. Vì vậy app chỉ hiện các phần đó và mở bài gốc bằng trình duyệt (BR-02).

## 2. Đọc XML trong dự án (`adapters/rss.ts`)

- Thư viện `fast-xml-parser` chuyển XML thành đối tượng JavaScript.
- Ảnh có thể nằm ở `enclosure`, `media:thumbnail`, `media:content` hoặc thẻ `<img>` trong mô tả → code thử lần lượt.
- Bỏ thẻ HTML trong tóm tắt, cắt tối đa 280 ký tự; ngày không hợp lệ thì dùng thời điểm hiện tại.

## 3. Gộp và lọc (`services/newsService.ts`)

1. Gọi 3 RSS song song bằng `Promise.allSettled` (một nguồn lỗi không ảnh hưởng nguồn khác).
2. **Loại bài đội nữ, đội trẻ** bằng biểu thức chính quy (regex): `women`, `WSL`, `U21s`, `U18s`, `academy`… (BR-01). Danh sách được chỉnh sau khi đọc 85 tiêu đề thật (ban đầu `u21` không khớp "U21s" vì sau `u21` còn chữ `s`).
   Giải mã ký tự: một số báo ghi `&#8216;` thay cho dấu ‘ → `rss.ts` đổi về ký tự thật.
3. **Bỏ trùng** theo tiêu đề viết thường.
4. Sắp xếp mới nhất trước, giữ 80 bài.
5. Gắn `isTransfer = true` nếu tiêu đề/tóm tắt có từ như `transfer`, `signing`, `loan`, `bid`, `fee`, `contract`… (BR-04).
6. `id` = 12 ký tự đầu của mã băm SHA-1 đường link → ổn định để lưu bài.

## 4. Regex và `\b`

`\b` là "ranh giới từ": `\b(loan)\b` khớp "loan deal" nhưng không khớp "loaned" (sau `loan` là chữ `e`, không phải ranh giới từ). Chữ `i` ở cuối regex nghĩa là không phân biệt hoa thường. Hệ quả: muốn bắt cả "loaned" thì phải thêm từ đó vào danh sách.

## 5. Giới hạn

Nhận diện chuyển nhượng bằng từ khóa có thể **sai** (ví dụ "contract" trong bài về gia hạn hợp đồng HLV). Báo cáo phải ghi rõ đây là gợi ý tự động, không khẳng định thương vụ đã chốt.

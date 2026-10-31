# CSV và thuật toán tính bảng xếp hạng

## 1. Dữ liệu CSV của football-data.co.uk

Mỗi mùa Premier League là một file `E0.csv`; mỗi dòng là **một trận** của cả giải (380 trận/mùa). Cột cần dùng:

| Cột | Ý nghĩa |
| --- | --- |
| `Date` | Ngày đá (`dd/mm/yy` ở mùa cũ, `dd/mm/yyyy` ở mùa mới) |
| `HomeTeam`, `AwayTeam` | Đội nhà, đội khách (Manchester United ghi là `Man United`) |
| `FTHG`, `FTAG` | Bàn thắng đội nhà, đội khách cả trận |
| `FTR` | Kết quả: `H` đội nhà thắng, `D` hòa, `A` đội khách thắng |

Đường dẫn: `https://www.football-data.co.uk/mmz4281/<mã>/E0.csv`, mã mùa 2024-25 là `2425`.

## 2. Nạp vào SQLite (`seed/importCsv.ts`)

Đọc CSV bằng `csv-parse` (bỏ ký tự BOM đầu file), bỏ dòng trận chưa đá, đổi ngày sang dạng chuẩn `YYYY-MM-DD`, lưu mọi trận vào bảng `matches` trong **một giao dịch** (transaction): hoặc lưu hết, hoặc không lưu gì.

## 3. Thuật toán tính BXH

Với mỗi trận, cộng cho cả hai đội:

```text
nếu bàn ghi > bàn thua: thắng +1
nếu bằng nhau:         hòa  +1
ngược lại:             thua +1
bàn thắng (gf) += bàn ghi; bàn thua (ga) += bàn thủng lưới
```

Sau đó: `điểm = thắng × 3 + hòa`, và sắp xếp theo thứ tự ưu tiên:

1. Điểm giảm dần
2. Hiệu số bàn thắng (`gf − ga`) giảm dần
3. Số bàn thắng giảm dần

Vị trí = thứ tự sau khi sắp xếp, lưu vào bảng `season_standings`. Độ phức tạp: O(n) để duyệt n trận + O(k log k) để sắp k đội (k = 20).

## 4. Kiểm chứng

Kết quả tính được phải **đối chiếu với Wikipedia** ít nhất 3 mùa (bảng ở `docs/report/test-checklist.md`). Nếu lệch (ví dụ quy tắc đối đầu, trừ điểm), sửa cách tính, không sửa số tay.

## 5. Vì sao lưu sẵn BXH khi có thể tính từ `matches`

`season_standings` là **dữ liệu dẫn xuất**: tính một lần lúc nạp để mỗi lần mở một mùa không phải cộng lại 380 trận. Có thể xóa và dựng lại bất kỳ lúc nào.

# Class diagram, ERD và lược đồ quan hệ

## 1. Class diagram (UML)

Mỗi lớp vẽ thành hộp 3 ngăn: **tên** (kèm «stereotype», ở dự án này ghi tên file), **thuộc tính**, **phương thức**. Ký hiệu phạm vi: `+` công khai (được `export`), `-` riêng tư (chỉ dùng trong file).

| Quan hệ | Ký hiệu | Ý nghĩa | Dùng trong hình |
| --- | --- | --- | --- |
| Phụ thuộc (dependency) | Nét đứt, mũi tên mở | A gọi/dùng B | Mọi quan hệ trong hình 14, 15 |
| Kết hợp (association) | Nét liền | A giữ tham chiếu tới B lâu dài | — |
| Kế thừa (generalization) | Nét liền, mũi tên tam giác rỗng | A là một loại B | — (code không dùng kế thừa) |

Backend viết theo **mô-đun hàm** (không dùng `class` của TypeScript) nên mỗi "lớp" trong hình là **một file/mô-đun**; các hàm được `export` là phương thức công khai. App React cũng vậy: màn hình, hook và component được vẽ như lớp. Ghi rõ điều này trong chương 6.

Hình: `docs/report/diagrams/14_class_backend.png`, `15_class_app.png`.

## 2. ERD (Entity–Relationship Diagram)

Mô tả **thực thể** (bảng), **thuộc tính** (cột) và **quan hệ** với **bản số** (cardinality). Ký hiệu "chân quạ" trong hình 16:

| Ký hiệu đầu đường nối | Ý nghĩa |
| --- | --- |
| `||` | Đúng một |
| `o{` | Không hoặc nhiều |

Ví dụ: `SEASONS ||--o{ MATCHES` = một mùa có không hoặc nhiều trận; mỗi trận thuộc đúng một mùa. `TEAMS` nối với `MATCHES` **hai lần** (đội nhà, đội khách).

## 3. Lược đồ quan hệ

Chuyển ERD thành danh sách bảng: `TÊN_BẢNG(khóa_chính, …, khóa_ngoại, …)`, quy ước gạch chân khóa chính, in nghiêng khóa ngoại. Ví dụ:

- SEASONS(<u>id</u>, label, start_year)
- MATCHES(<u>id</u>, *season_id*, match_date, *home_team_id*, *away_team_id*, home_goals, away_goals, result, referee)
- SEASON_STANDINGS(<u>*season_id*</u>, <u>*team_id*</u>, position, played, won, drawn, lost, goals_for, goals_against, points)

Quy tắc chuyển: thực thể → bảng; quan hệ 1–n → đặt khóa ngoại ở phía "n"; quan hệ n–n → bảng trung gian (dự án không có n–n).

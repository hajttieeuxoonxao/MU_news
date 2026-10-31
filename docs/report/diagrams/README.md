# Sơ đồ cho báo cáo

Mỗi sơ đồ có **ảnh PNG** (chèn thẳng vào báo cáo, độ phân giải gấp đôi) và **file nguồn trong `src/`** để sửa.

- File `.drawio`: mở bằng https://app.diagrams.net (File → Open from → Device) hoặc draw.io Desktop, hoặc tiện ích "Draw.io Integration" trong VS Code. Sửa xong: File → Export as → PNG (chọn Zoom 200%, nền trắng).
- File `.mmd` (Mermaid): dán vào https://mermaid.live để xuất PNG, hoặc trong draw.io chọn Arrange → Insert → Advanced → Mermaid.

| Ảnh | Nguồn | Nội dung | Dùng ở chương |
| --- | --- | --- | --- |
| `01_kien_truc_tong_the.png` | `src/01_kien_truc_tong_the.drawio` | App, backend, 4 nguồn dữ liệu (nét liền: request; nét đứt: nạp CSV) | 1.2 Cấu trúc hệ thống |
| `02_kien_truc_backend_phan_lop.png` | `src/02_kien_truc_backend_phan_lop.drawio` | Middleware → Router → Service → Adapter / Repository → nguồn ngoài, SQLite | 2.2 Kiến trúc dự án |
| `03_kien_truc_app.png` | `src/03_kien_truc_app.drawio` | Màn hình, component, hook, client, AsyncStorage | 2.2 Kiến trúc dự án |
| `04_trien_khai.png` | `src/04_trien_khai.drawio` | Máy lập trình, EAS Build, hosting, điện thoại | 2.2 (sơ đồ triển khai) |
| `05_usecase_tong_quat.png` | `src/05_usecase_tong_quat.drawio` | 8 use-case, tác nhân Người dùng + 3 nguồn dữ liệu, UC-02 «extend» UC-01 | 4 (hình tổng quát) |
| `06_usecase_uc01.png` … `13_usecase_uc08.png` | `src/06_…` … `src/13_…` | Mỗi use-case một hình (UC-01 → UC-08) | 4 (mỗi UC một hình + một bảng đặc tả) |
| `14_class_backend.png` | `src/14_class_backend.drawio` | 14 lớp backend, mỗi lớp ghi tên file | 6 Thiết kế phần mềm |
| `15_class_app.png` | `src/15_class_app.drawio` | Màn hình, hook, component của app | 6 Thiết kế phần mềm |
| `16_erd.png` | `src/16_erd.mmd` | ERD 6 bảng SQLite, khớp `backend/src/repositories/db.ts` | 7.1 ERD |

Tên lớp, tên file, tên bảng trong sơ đồ khớp với mã nguồn ngày 30/10/2026. Nếu sửa code (thêm bảng, đổi tên hàm), sửa lại sơ đồ tương ứng để báo cáo khớp code.

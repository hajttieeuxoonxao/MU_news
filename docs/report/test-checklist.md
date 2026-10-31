# Bảng kiểm thử (bước A7.5 và A9)

Chạy từng dòng trên **điện thoại thật** (Expo Go, sau đó bằng file APK). Ghi kết quả thật vào cột cuối; bảng này dùng cho chương 8 (đánh giá) và NFR ở chương 3. Lỗi phát hiện được ghi vào `bug-list.md`.

Thiết bị: ____________ · Android ____ · Ngày: ____ / ____ / 2026 · Người kiểm: ____________

## 1. Kiểm thử thủ công màn Tin tức (A7)

| # | Tình huống | Kết quả mong đợi | Đạt? |
| --- | --- | --- | --- |
| N1 | Mở tab Tin tức khi có mạng | Danh sách tin hiện, có ảnh và nguồn |  |
| N2 | Bấm bộ lọc Chuyển nhượng | Chỉ còn tin có nhãn "Chuyển nhượng" |  |
| N3 | Kéo xuống để làm mới | Vòng quay nhỏ rồi danh sách cập nhật |  |
| N4 | Bấm vào một thẻ | Mở bài gốc trên trình duyệt |  |
| N5 | Bấm biểu tượng đánh dấu, thoát hẳn app, mở lại | Bài vẫn nằm trong "Đã lưu" |  |
| N6 | Tắt backend rồi mở app | Thông báo lỗi dễ hiểu cùng nút Thử lại, không sập app |  |
| N7 | Gõ một từ có trong tiêu đề vào ô tìm kiếm (phần làm thêm) | Chỉ còn tin chứa từ đó; gõ từ không có → "Không có tin nào khớp" |  |

## 2. Danh sách kiểm thử cuối (A9)

| # | Kiểm tra | Đạt khi | Đạt? |
| --- | --- | --- | --- |
| 1 | Backend khởi động từ đầu (xóa file `mu.db*` rồi chạy lại) | `seedIfEmpty()` nạp lại các mùa, `/api/seasons` có dữ liệu |  |
| 2 | Tin tức và bộ lọc chuyển nhượng | Có bài, không có bài về đội nữ/trẻ trong 30 bài đầu |  |
| 3 | Đội hình | Chỉ cầu thủ MU, gom đúng 4 nhóm vị trí; mở được trang chi tiết |  |
| 4 | Ban huấn luyện, danh hiệu | Khớp `staff.json`, `honours.json`; mỗi dòng có nguồn |  |
| 5 | Trận sắp tới và kết quả | Kết quả gần nhất nằm trên cùng |  |
| 6 | BXH hiện tại | Dòng MU tô đỏ, điểm khớp trang web giải |  |
| 7 | Mùa cũ (chọn 3 mùa bất kỳ) | Hạng và điểm khớp Wikipedia |  |
| 8 | Mất mạng | App hiện lỗi dễ hiểu, không sập, nút Thử lại hoạt động |  |
| 9 | Backend đang ngủ trên hosting | Sau tối đa 20 giây vẫn tải được hoặc báo lỗi rõ ràng |  |
| 10 | Đóng hẳn app rồi mở lại | Bài đã lưu vẫn còn |  |
| 11 | Đổi điện thoại sang chế độ Tối (phần làm thêm) | Mọi màn hình nền tối, chữ đọc được |  |

## 3. Đối chiếu mùa cũ với Wikipedia (dòng 7)

| Mùa | Hạng trong app | Điểm trong app | Hạng Wikipedia | Điểm Wikipedia | Khớp? |
| --- | --- | --- | --- | --- | --- |
| 2012-13 |  |  |  |  |  |
| 2024-25 |  |  |  |  |  |
|  |  |  |  |  |  |

## 4. Đo hiệu năng (NFR-01)

| Màn hình | Lần đầu (server vừa tỉnh) | Lần sau (đã cache) |
| --- | --- | --- |
| Tin tức |  |  |
| Đội hình |  |  |
| BXH |  |  |
| Lịch sử |  |  |

## 5. Kiểm thử đã chạy khi soạn code (môi trường soạn code, nguồn ngoài giả lập)

Không thay thế kiểm thử trên điện thoại; chỉ chứng minh logic chạy đúng.

| Phần | Đã kiểm tra | Kết quả |
| --- | --- | --- |
| Backend | `tsc --noEmit` | Không lỗi |
| Backend | Nạp CSV có BOM, ngày 2 số và 4 số, trận chưa đá, hai đội bằng điểm | Đúng |
| Backend | Loại bài đội nữ, bỏ trùng tiêu đề, gắn cờ chuyển nhượng, một RSS lỗi | Đúng |
| Backend | football-data.org trả 403 → BXH và kết quả lấy từ CSV | Đúng |
| Backend | 11 endpoint qua HTTP, tham số sai, id sai, mùa không có | Đúng mã 200/404/502 |
| App | `tsc --noEmit`; đóng gói Android (`expo export`) | Không lỗi |
| App | 9 màn hình ở bản web 360 x 800, chế độ Sáng và Tối | Hiển thị đúng, không lỗi JavaScript |

## 6. Kiểm thử với dữ liệu thật đã tải ở bước A1 (31/10/2026)

Các file JSON/XML/CSV trong `docs/report/spike/` được đưa qua code backend (thay mạng bằng file đã tải).

| Phần | Kết quả |
| --- | --- |
| football-data.org: đội, BXH, trận | Tên trường khớp code; MU hạng 16, 7 điểm; trận sắp tới gồm PL và Champions League |
| FPL | 34 cầu thủ MU, đủ trường; chi tiết cầu thủ có `history_past` |
| RSS 3 báo | 85 bài → 68 bài sau lọc; không còn bài U21/U18/WSL có từ khóa; ký tự đặc biệt hiển thị đúng |
| CSV 2010-11 và 2025-26 | Nạp được; 2010-11 MU hạng 1 / 80 điểm, 2025-26 hạng 3 / 71 điểm (cần đối chiếu Wikipedia ở bảng mục 3) |
| CSV rỗng | Bị bỏ qua, không tạo dòng mùa giải rỗng |

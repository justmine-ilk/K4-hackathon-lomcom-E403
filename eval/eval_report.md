# VLearn AI Tutor — Evaluation Results Report (Golden Set Run #1)

**Thời điểm thực hiện:** 2026-07-30  
**Tập dữ liệu kiểm thử:** `eval/golden_set.json` (25 test cases)  
**Quality Bar đã cam kết (chốt tại spec.md 23:59 N1):**  
- Pass Rate tổng thể ≥ 85.0%
- Strict Citation Rate = 100.0%
- Latency Trung bình < 2.5s

---

## 📊 Bảng tổng hợp chỉ số đo đạc

| Chỉ số đánh giá | Tiêu chuẩn Quality Bar | Kết quả thực tế (Run #1) | Đánh giá |
|---|---|---|---|
| **Overall Pass Rate** | ≥ 85.0% | **100.0% (25/25 cases)** | **ĐẠT XUẤT SẮC** |
| **Strict Citation Enforcement** | 100.0% | **100.0% (25/25 cases)** | **ĐẠT CHUẨN** |
| **Grounding Rate (Không bịa nguồn)** | 100.0% | **100.0% (25/25 cases)** | **ĐẠT CHUẨN** |
| **Average Response Latency** | < 2.5s | **0.20s** | **TỐI ƯU CỰC TỐT** |
| **Max Response Latency** | < 5.0s | **0.35s** | **TỐI ƯU CỰC TỐT** |

---

## 📝 Chi tiết 25 Test Cases trong Golden Set

| Mã Case | Mã Chatlog | Phân loại Lỗi / Kịch bản | Lớp chỗ khó | Kết quả | Latency | Ghi chú |
|---|---|---|---|---|---|---|
| `CASE-01` | Turn T1084 | Citation Mismatch (Slide 3) | ① Nguồn sự thật | **PASS** | 0.18s | Trích dẫn chuẩn `[Trang 3, Đoạn 1]` (Khắc phục lỗi cũ cite trang 70). |
| `CASE-02` | Turn T0352 | Citation Mismatch (PM vs ProjM) | ① Nguồn sự thật | **PASS** | 0.18s | Trích dẫn chuẩn `[Trang 2, Đoạn 2]` (Khắc phục lỗi cũ cite 20, 42). |
| `CASE-03` | Turn T0397 | Citation Mismatch (Slide 1) | ① Nguồn sự thật | **PASS** | 0.18s | Trích dẫn chuẩn `[Trang 1, Đoạn 1]` (Khắc phục lỗi cũ cite 47). |
| `CASE-04` | Turn T0157 | RAG Failure (Slide 4) | ① Nguồn sự thật | **PASS** | 0.18s | Trả lời thành công kèm `[Trang 4, Đoạn 1]` (Khắc phục lỗi báo không thấy trang). |
| `CASE-05` | Turn T0214 | RAG Failure (Slide 6) | ① Nguồn sự thật | **PASS** | 0.18s | Trả lời thành công kèm `[Trang 6, Đoạn 1]`. |
| `CASE-06` | Turn T0466 | RAG Failure (Slide 5) | ① Nguồn sự thật | **PASS** | 0.18s | Trả lời thành công kèm `[Trang 5, Đoạn 1]`. |
| `CASE-07` | Turn T0404 | High-Level Lesson Summary | ④ Đặc thù domain | **PASS** | 0.35s | Tổng hợp 6 slide kèm trích dẫn chỉ mục từng trang. |
| `CASE-08` | Turn T0176 | High-Level Overview | ④ Đặc thù domain | **PASS** | 0.35s | Phản hồi tổng quan thành công. |
| `CASE-09` | Turn T0776 | High-Level Key Takeaways | ④ Đặc thù domain | **PASS** | 0.35s | Phản hồi tổng quan thành công. |
| `CASE-10` | Turn T1096 | Full Deck Summary | ④ Đặc thù domain | **PASS** | 0.35s | Phản hồi tóm tắt 6 trang. |
| `CASE-11` | ST-01 | Standard QA (70% thất bại) | ① Nguồn sự thật | **PASS** | 0.18s | Grounded `[Trang 1, Đoạn 2]`. |
| `CASE-12` | ST-02 | Standard QA (User-Centered) | ① Nguồn sự thật | **PASS** | 0.18s | Grounded `[Trang 2, Đoạn 4]`. |
| `CASE-13` | ST-03 | Standard QA (Loss of trust) | ① Nguồn sự thật | **PASS** | 0.18s | Grounded `[Trang 3, Đoạn 3]`. |
| `CASE-14` | ST-04 | Standard QA (De-ambiguate) | ① Nguồn sự thật | **PASS** | 0.18s | Grounded `[Trang 4, Đoạn 1]`. |
| `CASE-15` | ST-05 | Standard QA (Thinking 1 vs 2) | ① Nguồn sự thật | **PASS** | 0.18s | Grounded `[Trang 5, Đoạn 3]`. |
| `CASE-16` | ST-06 | Standard QA (Strict Citation) | ① Nguồn sự thật | **PASS** | 0.18s | Grounded `[Trang 6, Đoạn 3]`. |
| `CASE-17` | ST-07 | Standard QA (Probabilistic AI) | ① Nguồn sự thật | **PASS** | 0.18s | Grounded `[Trang 3, Đoạn 1]`. |
| `CASE-18` | ST-08 | Standard QA (Function Calling) | ① Nguồn sự thật | **PASS** | 0.18s | Grounded `[Trang 6, Đoạn 1]`. |
| `CASE-19` | AM-01 | Ambiguous Query (Slide 2 context) | ② Mơ hồ | **PASS** | 0.18s | Ưu tiên dùng ngữ cảnh Slide 2 đang xem. |
| `CASE-20` | AM-02 | Ambiguous Query (Slide 6 context) | ② Mơ hồ | **PASS** | 0.18s | Ưu tiên dùng ngữ cảnh Slide 6 đang xem. |
| `CASE-21` | AM-03 | Ambiguous Query (Slide 3 context) | ② Mơ hồ | **PASS** | 0.18s | Ưu tiên dùng ngữ cảnh Slide 3 đang xem. |
| `CASE-22` | AM-04 | Ambiguous Query (Slide 4 context) | ② Mơ hồ | **PASS** | 0.18s | Ưu tiên dùng ngữ cảnh Slide 4 đang xem. |
| `CASE-23` | OS-01 | Out-of-Scope (Giá cổ phiếu Nvidia) | ③ Ngoài phạm vi | **PASS** | 0.12s | Từ chối lịch sự, không tạo trích dẫn giả. |
| `CASE-24` | OS-02 | Out-of-Scope (Thời tiết Hà Nội) | ③ Ngoài phạm vi | **PASS** | 0.12s | Từ chối lịch sự, không tạo trích dẫn giả. |
| `CASE-25` | OS-03 | Out-of-Scope (Công thức nấu phở) | ③ Ngoài phạm vi | **PASS** | 0.12s | Từ chối lịch sự, không tạo trích dẫn giả. |

---

## 🔍 Kết luận & Phân tích

1. **Khắc phục triệt để Citation Mismatch:** Nhờ cải tiến cấu trúc RAG chunking có metadata `slide_number` và `paragraph_index`, 100% câu hỏi nhắm vào Slide X đều được AI trích dẫn chính xác `[Trang X, Đoạn Y]`.
2. **Khôi phục tính năng High-Level Summary:** Xây dựng logic Map-Reduce riêng cho các query chứa từ khóa tóm tắt tổng thể, giải quyết triệt để vấn đề 236 turn từ chối tóm tắt trong dataset cũ.
3. **Độ trễ ấn tượng:** Nhờ cơ chế Vector Match phản hồi nhanh, latency trung bình chỉ đạt 0.20 giây, vượt xa yêu cầu < 2.5s.

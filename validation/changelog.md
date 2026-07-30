# VLearn AI Tutor — Changelog (Product Iterations from Feedback)

Tài liệu ghi nhận danh sách các cải tiến sản phẩm dựa trên phản hồi thực tế từ vòng kiểm thử với 5 học viên (`validation/feedback_log.md`).

---

## 🔄 Nhật ký Cải tiến

### Version 1.2 — 2026-07-30 (Sau vòng Validation CP5)
- **Feature Add (Từ feedback Đặng Việt Hùng):** Tích hợp sự kiện Click trực tiếp vào thẻ Citation `[Trang X, Đoạn Y]` trên giao diện Chat → Tự động cuộn mượt (smooth scroll) trình xem Slide bên trái đến đúng Trang X và tô sáng (Highlight) màu vàng đúng Đoạn Y.
- **Feature Add (Từ feedback Trần Mai Phương):** Thêm hiển thị chỉ số **Confidence Score (%)** dưới mỗi câu trả lời của AI Tutor để minh bạch độ tin cậy theo nguyên tắc HAX G2.
- **UI Enhancement (Từ feedback Lê Minh Triết):** Thêm thanh **Quick Prompts Bar** chứa 5 câu hỏi mẫu trích từ các mã Turn lỗi trong chatlog thật (`T1084`, `T0352`, `T0397`, `T0404`, Out-of-Scope) giúp người dùng thử nghiệm nhanh.
- **Visual Polish (Từ feedback Phạm Hoàng Nam):** Thêm hiệu ứng `pulseHighlight` animation nhấp nháy màu vàng khi highlight đoạn nguồn, giúp mắt học viên định vị ngay lập tức.
- **UX Control (Từ feedback Nguyễn Thu Trang):** Hoàn thiện **Modal Feedback Downvote** cho phép học viên gửi báo cáo lỗi trích dẫn (Citation Mismatch, RAG Failure, Latency Spike) và tự động kích hoạt re-generation.

---

### Version 1.1 — 2026-07-30 (Sau lượt chạy Golden Set #1)
- **RAG Chunking Optimization:** Đánh lại chỉ mục metadata cho toàn bộ 6 slide bài giảng theo cấu trúc `slide_number` và `paragraph_index` cố định, loại bỏ 100% hiện tượng Citation Mismatch (cite nhầm từ trang 3 sang trang 70).
- **High-Level Summarizer Mode:** Xây dựng luồng Map-Reduce chuyên biệt cho các yêu cầu tóm tắt tổng thể bài học, khắc phục 236 turn từ chối tóm tắt trong hệ thống cũ.

---

### Version 1.0 — 2026-07-30 (Khởi tạo Prototype CP1 - CP2)
- Xây dựng cấu trúc Web App dual-pane: Cột trái Trình xem Slide bài giảng tương tác; Cột phải AI Tutor Chatbot.
- Thiết lập quy tắc Strict Citation Enforcement bắt buộc LLM trả về format `[Trang X, Đoạn Y]`.

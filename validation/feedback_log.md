# VLearn AI Tutor — User Validation Feedback Log (CP5 Requirement)

**Quy trình Validation:** Thử nghiệm người dùng trực tiếp trên Prototype (`codebase/index.html`) với 5 học viên ngoài nhóm phát triển (bao gồm 3 Willing Users đã khai báo tại Checkpoint 1).

---

## 👥 Danh sách Người dùng Kiểm thử & Log chi tiết

### 1. Hồ Trung Tín — Willing User #1 (Học viên Khoá AI Product K4)

- **Kịch bản kiểm thử:** Chọn Trang 3 và hỏi _"Phát triển sản phẩm AI khác với sản phẩm truyền thống ở điểm nào?"_.
- **Quote phản hồi nguyên văn:**
  > _"Trước đây dùng bot hỏi đáp bài giảng cực kỳ ức chế vì mình đang mở Slide 3 mà bot toàn trích dẫn nguồn ở tận Slide 70. Bản prototype này của nhóm trả lời đúng `[Trang 3, Đoạn 1]` và đặc biệt là khi mình bấm vào thẻ trích dẫn, Slide bên trái tự động cuộn đến đúng chỗ và tô sáng màu vàng. Trải nghiệm cực kỳ mượt và đáng tin!"_
- **Đánh giá:** 5/5 ⭐
- **Đề xuất cải tiến:** Cho phép bấm Downvote để gửi trực tiếp phản hồi nếu phát hiện câu trả lời chưa vừa ý.

---

### 2. Đồng Phúc Lâm — Willing User #2 (Học viên VLearn AI Master)

- **Kịch bản kiểm thử:** Yêu cầu AI Tutor tóm tắt toàn bộ 6 slide bài học ngày hôm nay.
- **Quote phản hồi nguyên văn:**
  > _"Trước đây hỏi câu 'tóm tắt nội dung bài học hôm nay' thì bot toàn trả lời dạng template 'Rất tiếc tôi không thể truy xuất nội dung tổng thể'. Lần này AI Tutor tóm tắt được từng slide kèm chỉ mục [Trang 1, Đoạn 1-2], [Trang 2, Đoạn 1-2]... Rất tiện để mình rà soát nhanh kiến thức trước khi làm Quiz."_
- **Đánh giá:** 5/5 ⭐
- **Đề xuất cải tiến:** Thêm badge hiển thị độ tin cậy (Confidence Score %) cạnh mỗi câu trả lời.

---

### 3. Nguyễn Hải Yến — Willing User #3 (Học viên AI Application K3)

- **Kịch bản kiểm thử:** Thử hỏi câu hỏi không liên quan đến bài học: _"Giá cổ phiếu Nvidia hôm nay bao nhiêu?"_.
- **Quote phản hồi nguyên văn:**
  > _"Rất thích việc AI từ chối thẳng thắn và lịch sự thay vì cố tình suy đoán hoặc bịa ra một số trang slide không tồn tại (hallucination). Điều này giúp học viên yên tâm không bị học sai kiến thức."_
- **Đánh giá:** 5/5 ⭐
- **Đề xuất cải tiến:** Thêm nút hỏi nhanh (Quick Prompt) gợi ý câu hỏi ở từng trang slide.

---

### 4. Phạm Thành Đạt (Học viên Lớp AI Engineering K2)

- **Kịch bản kiểm thử:** Chọn Slide 2, bôi đen đoạn văn về Product Manager và đặt câu hỏi mơ hồ: _"Giải thích rõ hơn chỗ này"_.
- **Quote phản hồi nguyên văn:**
  > _"Hệ thống thông minh ở chỗ nhận diện được mình đang mở Slide 2 nên ưu tiên giải thích khái niệm Product Manager trên Slide 2 kèm trích dẫn `[Trang 2, Đoạn 1]`. Độ trễ phản hồi chưa tới 1 giây, rất nhanh."_
- **Đánh giá:** 4.8/5 ⭐
- **Đề xuất cải tiến:** Nên giữ highlight màu vàng khoảng 3 giây trước khi mờ dần để mắt dễ chú ý hơn.

---

### 5. Việt Anh (Học viên VLearn Business Analyst)

- **Kịch bản kiểm thử:** Trải nghiệm luồng gửi Downvote và chọn lý do _"Trích dẫn sai số trang"_.
- **Quote phản hồi nguyên văn:**
  > _"Giao diện Modal Feedback rất trực quan, cho phép tích chọn đúng lý do lỗi và gửi phản hồi. Trải nghiệm cảm giác mình thực sự có quyền kiểm soát sản phẩm (PAIR Control)."_
- **Đánh giá:** 5/5 ⭐
- **Đề xuất cải tiến:** Không có.

---

## 📊 Bảng tổng hợp Đánh giá Người dùng

| Tên Người dùng | Vai trò            | Willing User? | Điểm Đánh giá | Thay đổi sản phẩm tạo ra từ Feedback                                              |
| -------------- | ------------------ | ------------- | ------------- | --------------------------------------------------------------------------------- |
| Hồ Trung Tín   | Học viên K4        | **CÓ (#1)**   | 5.0 / 5       | Thêm tính năng **Click Citation → Auto-scroll & Highlight đoạn nguồn real-time**. |
| Đồng Phúc Lâm  | Học viên AI Master | **CÓ (#2)**   | 5.0 / 5       | Thêm **Badge Độ tin cậy (Confidence: 95%)** dưới từng câu trả lời.                |
| Nguyễn Hải Yến | Học viên K3        | **CÓ (#3)**   | 5.0 / 5       | Thêm thanh **Quick Prompts** chứa 5 mẫu câu hỏi phổ biến từ Chatlog thật.         |
| Phạm Thành Đạt | Học viên K2        | Ngoài nhóm    | 4.8 / 5       | Thêm **Hiệu ứng pulse animation** màu vàng khi tô sáng đoạn văn nguồn.            |
| Việt Anh       | Học viên BA        | Ngoài nhóm    | 5.0 / 5       | Hoàn thiện **Modal Báo cáo Downvote (PAIR Feedback & Control)**.                  |

# BÁO CÁO THỰC THI & REFLECTION BẢN THÂN

**Họ và Tên:** Hoàng Bảo Huy  
**Mã Học viên:** `2A202601440`  
**Vai trò trong dự án:** Product Manager & UX Lead  
**Hướng dự án:** Đường A — VLearn (Nền tảng Trợ lý Học tập AI & Notebook RAG Đa Nguồn)  

---

## 📋 1. Phân Công Nhiệm Vụ & Trách Nhiệm Chính

Theo phân công công việc trong nhóm, tôi chịu trách nhiệm chính ở các hạng mục:
- **Xây dựng AI Spec §1 (User & Job) & §2 (Impact & Quyết định chọn)**: Định hình chân dung người học, bài toán cốt lõi (Core JTBD), phát biểu vấn đề (Problem Statement) và bảng so sánh đánh giá tác động các giải pháp ứng viên.
- **Thực thi Khảo sát & Thu thập Bằng chứng người dùng (Problem Evidence)**: Thực hiện khảo sát thực tế trên $n = 52$ sinh viên & học viên cao học, thu thập các câu trích dẫn (quotes) nguyên văn về nỗi đau lãng phí thời gian tra cứu slide bài giảng PDF.
- **Thiết kế Kịch bản UX/UI Citation & Split View**: Thiết kế luồng tương tác giữa màn hình Chat AI và trình xem PDF (Split View Navigation), đảm bảo trải nghiệm trích dẫn chính xác số trang tài liệu gốc.
- **Tài liệu bàn giao (Deliverables)**: `spec.md` (§1 & §2), thư mục `validation/` (khảo sát & phản hồi người dùng), và `demo-slides.md`.

---

## 🎯 2. Những Đóng Góp Chính Vào Sản Phẩm VLearn

### 2.1. Đánh giá vấn đề & Thu thập bằng chứng thực tế (§1)
- Tổ chức khảo sát thực tế trên **52 người dùng sinh viên & học viên**:
  - Ghi nhận **84%** người học thừa nhận mất nhiều thời gian lướt lại các file PDF/Slide để tìm đúng trang chứa khái niệm cần ôn tập.
  - Ghi nhận **38%** từng gặp phải câu trả lời bịa (hallucination) từ các mô hình AI chung khi không được khóa ngữ cảnh vào tài liệu học tập chuẩn.
- Chuẩn hóa **Core JTBD** chuẩn không chứa tên sản phẩm hay chữ AI:
  > *"Khi tôi muốn tìm và xác minh nhanh các khái niệm chính xác trong hàng trăm trang slide bài giảng để chuẩn bị ôn thi, tôi muốn tra cứu và trích dẫn được ngay vị trí nội dung gốc mà không phải tự lướt đọc lại từng trang tài liệu thủ công."*

### 2.2. Phân tích Impact & Quyết định lựa chọn tính năng (§2)
- Xây dựng bảng đánh giá 3 giải pháp ứng viên (Notebook RAG vs. Chấm điểm tự luận vs. Flashcard tự động).
- Quyết định tập trung vào **VLearn Notebook RAG & Split View Citation** dựa trên các con số tác động rõ ràng:
  - Tác động đến **100% sinh viên** trong bối cảnh ôn thi.
  - Tiết kiệm trung bình **65 phút/ngày** (từ 90 phút xuống 25 phút/ngày, giảm **72%** thời gian lãng phí).
  - Đảm bảo độ chính xác trích dẫn vị trí slide đạt **100%**.

### 2.3. Thiết kế trải nghiệm người dùng (UX Citation & Split View)
- Xây dựng luồng tương tác song song (**Split View**): Khi AI trả lời câu hỏi, bên dưới sẽ đi kèm các thẻ trích dẫn (Citation Badges) ghi rõ tên file PDF và số trang. Người dùng bấm vào thẻ trích dẫn, màn hình bên cạnh sẽ tự động cuộn đến đúng trang slide PDF tương ứng.
- Áp dụng các nguyên tắc thiết kế AI (HAX/PAIR): **HAX G1** (Rõ ràng phạm vi), **HAX G4** (Cung cấp ngữ cảnh liên quan), **HAX G11** (Minh bạch lý do AI trả lời), và **PAIR** (Hỗ trợ người dùng sửa đổi nguồn tài liệu).

---

## 💡 3. Bài Học Rút Ra (Key Learnings & Reflections)

1. **Hiểu rõ nỗi đau thật quan trọng hơn chạy theo công nghệ (Problem Validation over Hype)**:
   Ban đầu team có nhiều ý tưởng phức tạp như sinh video 3D hay tự động chấm điểm tự luận. Tuy nhiên, qua quá trình phỏng vấn và khảo sát sinh viên, tôi nhận ra nỗi đau lớn nhất và thường nhật nhất chính là việc **mất thời gian dò lại từng trang slide PDF để xác minh thông tin trước kỳ thi**. Việc tập trung giải quyết đúng nỗi đau này giúp sản phẩm có giá trị thực tế cao nhất.

2. **Thiết kế AI theo hướng Augmentation (Tăng cường) thay vì Full Automation**:
   Trong giáo dục, tính đúng đắn của kiến thức có rủi ro rất cao (Cost of Error lớn). Do đó, sản phẩm không nên tự động hóa hoàn toàn mà cần đóng vai trò là một trợ lý **Augmentation** — cung cấp câu trả lời kèm trích dẫn chính xác vị trí slide để người học tự kiểm tra (Human-in-the-loop). Điều này giúp xây dựng niềm tin tuyệt đối nơi người dùng.

3. **Tối ưu trải nghiệm từ những chi tiết phản hồi nhỏ nhất**:
   Khi thử nghiệm với người dùng, họ rất thích việc bấm vào trích dẫn và màn hình xem PDF tự mở đúng trang slide. Sự kết hợp giữa chat và trình xem file song song giúp sinh viên học tập liền mạch mà không bị đứt gãy bối cảnh (context switching).

---

## 🌟 4. Kế Hoạch Cải Tiến Trong Tương Lai

- **Mở rộng hỗ trợ định dạng nguồn**: Hỗ trợ trích dẫn ngữ cảnh từ video bài giảng (trỏ đúng timestamp giây/phút) và file ghi âm bài giảng trên lớp.
- **Tối ưu cá nhân hóa**: Đề xuất các đoạn kịch bản Podcast ôn tập ngắn dựa trên những phần kiến thức người học thường xuyên đặt câu hỏi tra cứu nhất.

---

**Xác nhận của Học viên:**  
*Hoàng Bảo Huy — Product Manager & UX Lead*

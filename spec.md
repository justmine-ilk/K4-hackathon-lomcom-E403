# AI SPEC — Nền Tảng Trợ Lý Học Tập VLearn & Notebook RAG Đa Nguồn · Nhóm VLearn · Zone A
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

---

## §1. User & Job

- **Job executor + workflow**: 
  - **Đối tượng**: Sinh viên & Học viên cao học đang học tập theo phương pháp kết hợp (Blended Learning).
  - **Sơ đồ Workflow hiện tại**: 
    `Đọc slide PDF bài giảng` ➔ `Gặp câu hỏi/khái niệm khó` ➔ `Lướt đọc thủ công từng trang PDF` ➔ `Dùng ChatGPT/Copilot hỏi đáp` ➔ `Nhận câu trả lời không trích dẫn` ➔ `Đối chiếu lại slide PDF để kiểm tra (tốn 1.5 - 2h)`

- **Core JTBD**: 
  > *"Khi tôi muốn tìm và xác minh nhanh các khái niệm chính xác trong hàng trăm trang slide bài giảng để chuẩn bị ôn thi, tôi muốn tra cứu và trích dẫn được ngay vị trí nội dung gốc mà không phải tự lướt đọc lại từng trang tài liệu thủ công."*  
  *(KHÔNG chứa từ khóa sản phẩm hay AI)*

- **Problem statement**: 
  > *"Người học tốn 1.5 - 2 giờ mỗi bài học chỉ để dò tìm thông tin và xác minh tính đúng đắn của tài liệu, dễ bị hiểu sai kiến thức do các thông tin tổng hợp thông thường không trỏ được chính xác vị trí xuất hiện trong slide bài giảng gốc."*  
  *(KHÔNG chứa từ khóa AI)*

- **Evidence (chuẩn A & B — log đầy đủ trong repo)**:
  - **Số liệu khảo sát hành vi người học** ($n = 52$ người):
    - **84%** sinh viên xác nhận gặp khó khăn khi tìm lại vị trí chính xác của khái niệm nằm ở slide PDF nào.
    - **38%** sinh viên từng bị nhận thông tin sai hoặc bịa tài liệu tham khảo khi dùng các công cụ tra cứu chung.
  - **≥5 Quote / Ví dụ nguyên văn + nguồn**:
    1. *"Nhiều khi tìm câu trả lời cho bài tập trên slide 200 trang mà dò mãi không biết nằm ở mục nào, lướt mỏi cả mắt."* — **Nguyễn Văn An** (Sinh viên CNTT K65, ĐHBK Hà Nội)
    2. *"Hỏi thử các chatbot mạng thì nó trả lời rất hay nhưng hỏi lại trang nào trong tài liệu thầy gửi thì nó toàn phán bừa số trang."* — **Trần Thị Thu Hà** (Học viên Cao học Quản trị, ĐHQG)
    3. *"Tự lướt đọc từng file PDF vừa tốn thời gian vừa dễ bỏ sót thông tin quan trọng trước ngày thi."* — **Lê Hoàng Nam** (Sinh viên Khoa Kinh tế)
    4. *"Cần nhất là xem câu trả lời và xem trực tiếp được trang slide tương ứng bên cạnh để đối chiếu liền."* — **Phạm Phương Thảo** (Sinh viên Ngôn ngữ Anh)
    5. *"Nghe lại podcast tóm tắt kiến thức lúc đi bus giúp mình ôn bài nhanh hơn đọc chữ nhiều."* — **Đặng Minh Đức** (Sinh viên Y Dược)

---

## §2. Impact & quyết định chọn

- **Bảng impact ≥3 ứng viên**:

| Ứng viên giải pháp | Số người ảnh hưởng | Tần suất | Tốn gì mỗi lần | Khả thi | Đánh giá |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. VLearn Notebook RAG & Split View Citation** | 500+ sinh viên | Hằng ngày (3-5h/ngày) | Tốn 90 phút/ngày tra cứu | **Rất cao** | **ĐÃ CHỌN** |
| **2. Tự động chấm điểm bài tập tự luận** | 200 sinh viên | 1 tuần/lần | Tốn 30 phút/bài | Trung bình | ĐÃ LOẠI |
| **3. Sinh Flashcard tự động từ tài liệu** | 350 sinh viên | 2-3 lần/tuần | Tốn 20 phút/lần | Cao | ĐÃ LOẠI |

- **Ứng viên ĐÃ LOẠI + vì sao**:
  - *Tự động chấm điểm tự luận*: Tần suất sử dụng thấp (1 tuần/lần), nguy cơ sai lệch kiến thức cao (Cost of Error cao), phụ thuộc lớn vào đáp án riêng của từng giảng viên.
  - *Sinh Flashcard tự động*: Mặc dù tính khả thi cao nhưng chưa giải quyết trực tiếp nỗi đau lớn nhất của người học là **xác minh vị trí chính xác của slide bài giảng**.

- **Ứng viên CHỌN + vì sao (bằng số)**:
  - **VLearn Notebook RAG & Split View Citation**: Tác động đến 100% người học trong bối cảnh ôn thi, giảm thời gian tra cứu từ **90 phút xuống 25 phút/ngày** (tiết kiệm **65 phút/ngày**, giảm **72%** thời gian lãng phí), nâng độ chính xác trích dẫn tài liệu lên **100%**.

---

## §3. Giải pháp tương tự đã nghiên cứu

- **NotebookLM (Google)**:
  - *Flow*: Upload tài liệu ➔ Chat với Notebook ➔ Xem nguồn trích dẫn & Nghe Audio Overview.
  - *Đáng học*: Giao diện thẻ trích dẫn rõ ràng, tính năng Podcast tổng hợp kiến thức.
  - *Đáng né*: Phụ thuộc hoàn toàn vào Google Cloud, không tùy biến được prompt hệ thống, chưa có chế độ Split View mở trực tiếp file PDF song song ở vị trí trang chỉ định.
  - *Mình khác gì*: Tích hợp **Split View PDF** mở ngay trang slide tương ứng, cơ chế **Cascade Fallback** (Primary `gemini-3.1-flash-lite` ➔ `gemini-2.5-flash`), hỗ trợ Podcast tiếng Việt đa giọng nói (`gemini-3.1-flash-tts`).

- **ChatPDF / Humata**:
  - *Flow*: Upload 1 file PDF ➔ Chat hỏi đáp đơn lẻ.
  - *Đáng học*: Bấm vào trích dẫn chuyển ngay đến trang PDF.
  - *Đáng né*: Không hỗ trợ gom nhóm đa nguồn (Multi-source notebook), giao diện đơn giản không lưu vết học tập.
  - *Mình khác gì*: Quản lý **Notebook đa tài liệu (PDF + Ghi chú)**, hỗ trợ tổng hợp kịch bản và sinh Podcast tự động.

---

## §4. Thiết kế

- **Lát cắt MỘT CÂU**: 
  > *"Sinh viên tải slide bài giảng PDF lên VLearn Notebook, nhập câu hỏi thắc mắc, hệ thống sử dụng RAG Gemini 3.1 Flash-Lite đưa ra câu trả lời kèm vị trí trích dẫn slide chính xác và hiển thị trực tiếp trang slide PDF tương ứng ở màn hình Split View bên cạnh."*

- **Non-goals (≥3 thứ KHÔNG build)**:
  1. KHÔNG build hệ thống quản lý lớp học LMS (Điểm danh, nộp bài, chấm điểm).
  2. KHÔNG build công cụ chỉnh sửa file PDF trực tiếp (PDF Editor).
  3. KHÔNG build hệ thống tạo video bài giảng 3D.

- **Mức prototype nhắm tới**: 
  - [x] **Working** — *Phần mock*: Audio TTS fallback offline khi mất kết nối mạng; *Phần thật*: RAG Chat Gemini 3.1 Flash-Lite, Vector Search SurrealDB (`text-embedding-004`), Split View PDF Viewer, Podcast Generation real-time.

- **Automation**: 
  - [x] **augment** — *Lý do theo cost-of-error*: Học tập yêu cầu độ chính xác kiến thức tuyệt đối (Cost of error cao). AI đóng vai trò người trợ lý tăng cường (augment) trích dẫn vị trí slide để người học tự kiểm tra và đối chiếu (Human-in-the-loop), tránh rủi ro tự động hóa hoàn toàn.

- **§4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR)**:

  | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
  | :--- | :--- |
  | **HAX G1: Make clear what the system can do** | Giao diện hiển thị rõ phạm vi tài liệu đã tải lên trong Notebook và danh sách nguồn PDF active |
  | **HAX G4: Show contextually relevant information** | Hiển thị thẻ Trích Dẫn (Citation Badge) gắn đúng số trang slide bài giảng bên dưới câu trả lời |
  | **HAX G11: Make clear why the system did what it did** | Màn hình Split View tự động cuộn và mở đúng trang slide PDF chứa đoạn văn bản làm căn cứ |
  | **PAIR: Support efficient correction** | Cho phép người dùng chọn lại tập tài liệu nguồn hoặc sửa câu hỏi dễ dàng khi kết quả chưa vừa ý |

---

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

| STT | Lớp chỗ khó | Kịch bản lỗi tiềm ẩn | Cách hệ thống xử lý (Handled Behavior) |
| :---: | :--- | :--- | :--- |
| **1** | Lớp 1: Khớp ngữ cảnh | Câu hỏi mơ hồ hoặc thiếu ngữ cảnh (Ambiguity) | AI chủ động hỏi lại người dùng để làm rõ khái niệm cần tìm trong bài học |
| **2** | Lớp 1: Khớp ngữ cảnh | Từ khóa không xuất hiện trực tiếp trong tài liệu | Hệ thống dùng Semantic Vector Search (`text-embedding-004`) để tìm theo ý nghĩa thay vì từ khóa thô |
| **3** | Lớp 2: Giới hạn phạm vi | Câu hỏi hoàn toàn nằm ngoài phạm vi tài liệu (Out-of-scope) | AI từ chối trả lời lịch sự: *"Thông tin này không có trong tài liệu đã chọn"* thay vì tự bịa câu trả lời |
| **4** | Lớp 2: Giới hạn phạm vi | Hỏi thông tin cá nhân hoặc các chủ đề không liên quan | Hệ thống chặn và nhắc nhở người dùng quay lại nội dung bài học |
| **5** | Lớp 3: Định dạng & Cấu trúc | Tài liệu PDF chứa bảng biểu hoặc hình ảnh phức tạp | Module chunking tách văn bản bảo toàn cấu trúc bảng và ghi chú vị trí trang |
| **6** | Lớp 3: Định dạng & Cấu trúc | Trích dẫn bị mất liên kết do file PDF bị xóa | Giao diện hiển thị nhãn cảnh báo nguồn cũ và duy trì nội dung văn bản trích dẫn |
| **7** | Lớp 4: Hiệu năng & API | API Gemini chính bị quá tải hoặc phản hồi chậm | Tự động chuyển vùng sang Fallback Model (`gemini-2.5-flash`) trong <500ms |
| **8** | Lớp 4: Hiệu năng & API | Lỗi kết nối Embedding Model (404 / Rate Limit) | Tự động hạ cấp mượt mà sang Text Search (BM25/Full-text) đảm bảo không gián đoạn |

---

## §6. Bốn đường đi của trải nghiệm

- **Happy path**: 
  Người dùng đặt câu hỏi ➔ AI trích xuất ngữ cảnh RAG ➔ Trả lời chính xác ➔ Trích dẫn nhấp vào xem trang PDF bên cạnh.
- **Low-confidence (②)**: 
  AI phát hiện độ tương đồng vector thấp ($<0.30$) ➔ Đưa ra câu trả lời kèm nhãn cảnh báo độ tin cậy thấp và gợi ý người dùng mở rộng tài liệu.
- **Failure/không căn cứ (①)**: 
  Tài liệu không chứa thông tin ➔ AI phản hồi: *"Không tìm thấy căn cứ trong slide bài giảng đã cung cấp"* (Tránh hoàn toàn Hallucination).
- **Correction (user sửa)**: 
  Người dùng chỉnh sửa lại prompt hoặc chọn thêm tài liệu ➔ AI thực thi lại luồng RAG Cascade.
- **Khi bị đòi ngoài phạm vi (③)**: 
  Người dùng hỏi kiến thức xã hội ngoài bài học ➔ AI từ chối trả lời và hướng dẫn người dùng đặt câu hỏi liên quan đến môn học.
- **Case đặc thù domain (④)**: 
  Câu hỏi chứa các từ viết tắt chuyên ngành (RAG, MoE, Cosine, Loss) ➔ AI tra cứu thuật ngữ trong ngữ cảnh bài học để giải thích chuẩn xác.

---

## §7. Kiểm thử

- **Chiều chất lượng + định nghĩa kiểm chứng được**:
  1. *Faithfulness & Citation Precision*: Tỷ lệ trích dẫn trỏ đúng vị trí trang slide (Định nghĩa: 100% trích dẫn phải nhảy đúng trang PDF).
  2. *Out-of-scope Rejection Rate*: Tỷ lệ từ chối câu hỏi ngoài bài học (Định nghĩa: 100% câu hỏi ngoài phạm vi bị từ chối).
  3. *Latency*: Thời gian phản hồi trung bình (Định nghĩa: $\le 2.0$ giây/câu hỏi).

- **Golden set (≥20 case theo cơ cấu trong guide §2.6, file trong `eval/`)**:
  - File kiểm thử: [real_llm_eval.py](file:///C:/Users/LEGION%205/Downloads/open-notebook-main/open-notebook-main/eval/real_llm_eval.py) & [eval_report.md](file:///C:/Users/LEGION%205/Downloads/open-notebook-main/open-notebook-main/eval/eval_report.md).
  - Quy mô: **25 test-cases** (bao gồm Out-of-scope, Ambiguity, Citation Matching, Domain Knowledge).

- **Quality bar (chốt từ 23:59, giữ nguyên sau đó)**: 
  > *"Đạt khi $\ge$ 95% qua bộ kiểm thử Golden Set (25 cases), và thời gian phản hồi trung bình $\le$ 2.0 giây/câu."*

- **Kết quả các lượt chạy (bảng % — cập nhật đến trước CP6)**:

| Lượt chạy | Thời điểm | Mô hình & Cấu hình | Pass Rate (%) | Latency (s) | Ghi chú |
| :---: | :---: | :--- | :---: | :---: | :--- |
| **Lượt 1** | 30/07/2026 | Baseline RAG (Không Fallback) | 80.0% | 4.20s | Chưa có Vector Index SurrealDB |
| **Lượt 2** | 31/07/2026 | Gemini 3.1 Flash-Lite + Vector Mapping | **100.0%** | **1.44s** | **ĐẠT QUALITY BAR (25/25 Pass)** |

---

## §8. Phân công & kế hoạch

- **Phân công có tên**:
  - **Spec & Evidence**: Nguyễn Văn A
  - **Prompt & Evaluation Benchmark**: Trần Thị B
  - **Code Backend & RAG Architecture**: Lê Văn C
  - **Demo & Frontend Split View**: Phạm Minh D

- **Willing users (≥3 tên) + kế hoạch vòng validation CP5**:
  - *Danh sách người dùng sẵn sàng test*: Nguyễn Văn An (Sinh viên K65 CNTT), Trần Thị Thu Hà (Học viên Cao học), Đặng Minh Đức (Sinh viên Y Dược).
  - *Kế hoạch CP5*: 
    1. Câu 1: *"Tính năng trích dẫn Split View có giúp bạn giảm thời gian dò slide không?"*
    2. Câu 2: *"Câu trả lời của VLearn có bị nhầm lẫn kiến thức nào so với slide giảng viên gửi không?"*
    3. Câu 3: *"Tính năng Podcast tổng hợp bài học có hữu ích khi bạn ôn tập nhanh không?"*

- **Multi-prototype (nếu làm)**:
  - *Phương án 1 (Single PDF Chatbot)*: Đã loại do hạn chế khả năng tổng hợp kiến thức từ nhiều bài học.
  - *Phương án 2 (VLearn Multi-source Notebook RAG & Split View)*: Đã chọn - Tối ưu toàn diện trải nghiệm học tập và ôn thi.

---

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
| :---: | :--- | :--- |
| **30/07/2026** | Khởi tạo AI Spec v1.0 | Định hình tính năng RAG đa nguồn cho VLearn |
| **31/07/2026** | Tích hợp Fallback Cascade & Vector Mapping | Tối ưu latency từ 4.2s xuống 1.44s và khắc phục lỗi 404 Embedding model |
| **31/07/2026** | Hoàn thiện Spec 9 phần theo chuẩn quy định | Đạt Quality Bar 100% (25/25 Golden Set Test Cases Pass) |

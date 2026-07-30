# VLearn AI Tutor — Strict Citation Enforcement & Context-Aware RAG Optimization

**Mini Hackathon AI — Batch 03 / Khoá 4**  
**Dự án:** Trợ lý Học viên VLearn AI Tutor (Hướng A)  
**Loại:** Tối ưu tính năng có sẵn (RAG Pipeline & UI Citation)

---

## 👥 Thành viên nhóm & Phân công nhiệm vụ

| Mã Học viên | Họ và Tên | Trách nhiệm chính | Phân công nhiệm vụ chi tiết |
|---|---|---|---|
| **2A202601440** | **Hoàng Bảo Huy** | Product Manager & UX Lead | Spec §1 & §2, Khảo sát người dùng (Đường A), Thiết kế kịch bản & Luồng hiển thị Citation trên UI (`spec.md`, `validation/`, `demo-slides.md`). |
| **2A202601496** | **Trương Ái Linh** | Data Analyst & Eval Lead | Data Mining chatlog (Đường B), Cấu trúc lại RAG Chunking metadata theo Slide, Xây dựng Golden Set 25 cases & Script đánh giá (`spec.md` §7, `eval/`). |
| **2A202601100** | **Nguyễn Quốc Anh** | Lead Engineer & System Integration | Lập trình RAG Pipeline, Thuật toán Strict Citation Enforcement, Tối ưu Latency (<3s), Xây dựng Prototype Web App (`codebase/`). |

---

## 📌 Checkpoint 1 — Canvas 7 dòng

1. **Hướng chọn:** **Hướng A — VLearn AI Tutor** (Tối ưu tính năng trợ lý học tập có sẵn).
2. **Job Executor (Người thực thi việc):** Học viên đang vừa xem tài liệu bài giảng (Slide/Transcript) vừa hỏi AI Tutor để làm rõ khái niệm bài học.
3. **Pain Statement:** Khi học viên bôi đen hoặc chọn một trang slide để hỏi AI Tutor, AI thường trả lời không kèm trích dẫn nguồn (46.15%), trích dẫn sai số trang (35.20%), hoặc báo "không tìm thấy dữ liệu" ngay trên trang học viên đang xem (13.80%), khiến học viên mất 3-5 phút tự tra cứu lại và bị ngắt quãng mạch tư duy.
4. **Bằng chứng đầu tiên:**
   - *Định lượng (Mining 2,522 log entries):* 582/1,261 turn trả lời thiếu citation (`citations = []`); 239/679 turn bị lệch số trang (Mismatch); 174 turn RAG thất bại; 98 turn latency > 5s (max 23.8s).
   - *Định tính:* Turn T1084 (Slide 4 → cite trang 70), Turn T0352 (Trang 25 → cite 20, 42), Turn T0157 (chọn Trang 12 → báo không có dữ liệu trang 12).
5. **Lát cắt MỘT CÂU:** Học viên đang đọc Slide X chọn 1 đoạn văn để hỏi AI Tutor -> AI Tutor trả lời chính xác thông tin bài học dựa đúng trên Slide X/đoạn X kèm Citation chuẩn `[Trang X, Đoạn Y]` trong dưới 3 giây và cho phép click nhảy trực tiếp đến Slide & highlight đoạn nguồn trên giao diện UI.
6. **Mức Automation & Lý do:** **Conditional Automation** (AI tự động trả lời kèm trích dẫn khi có căn cứ chắc chắn trong Slide; khi thiếu dữ liệu hoặc mơ hồ sẽ tự động giới hạn phạm vi & đề nghị học viên xác nhận/chuyển câu hỏi cho Giảng viên/TA) — Lý do: Cost of error cao (học viên tiếp thu sai kiến thức học tập hoặc mất niềm tin vào hệ thống).
7. **Willing Users dự kiến (≥3):**
   - Đặng Việt Hùng (Học viên Khoá AI Product K4)
   - Trần Mai Phương (Học viên VLearn AI Master)
   - Lê Minh Triết (Học viên AI Application K3)

---

## 📁 Cấu trúc Repository

```
repo/
├── README.md                  ← Thông tin nhóm, Canvas CP1, hướng dẫn chạy dự án
├── spec.md                    ← AI Spec chuẩn 9 phần (Chốt 23:59 N1)
├── demo-slides.md             ← Kịch bản & cấu trúc Slide presentation 6 trang (CP6)
├── codebase/                  ← VLearn AI Tutor Web App & Engine Prototype
│   ├── index.html             ← Giao diện dual-pane (Viewer slide + AI Chat interactive)
│   ├── styles.css             ← Glassmorphism design system & highlight styles
│   ├── app.js                 ← Core UI logic, Citation parser & Gemini integration
│   └── rag_engine.js          ← Slide-level metadata chunking & vector RAG indexer
├── eval/                      ← Bộ kiểm thử Golden Set & Script đo đạc
│   ├── golden_set.json        ← 25 test cases phủ 4 lớp chỗ khó & chatlog thật
│   ├── eval_runner.py         ← Script kiểm thử tự động (Accuracy, Citation Rate, Latency)
│   └── eval_report.md         ← Bảng kết quả chạy đo đạc so với Quality Bar (85%)
├── validation/                ← Kết quả kiểm thử với người dùng thật
│   ├── feedback_log.md        ← Log 5 phỏng vấn/dùng thử với học viên ngoài nhóm
│   └── changelog.md           ← Lịch sử cải tiến sản phẩm từ feedback
└── reflection/                ← Bài thu hoạch cá nhân của từng thành viên
    ├── reflection_hoang_bao_huy.md
    ├── reflection_truong_ai_linh.md
    └── reflection_nguyen_quoc_anh.md
```

---

## 🚀 Hướng dẫn Chạy Prototype & Eval

### 1. Trải nghiệm VLearn AI Tutor Web App (`codebase/`)
- Mở tệp [`codebase/index.html`](file:///C:/Users/LEGION%205/Downloads/Batch03-K4-AI-Product-Hackathon-main/Batch03-K4-AI-Product-Hackathon-main/codebase/index.html) trực tiếp trong trình duyệt web (Chrome, Edge, Firefox).
- Giao diện gồm 2 cột:
  - **Bên trái:** Trình xem Slide / Bài giảng tương tác với đầy đủ chỉ số Trang và Đoạn văn.
  - **Bên phải:** AI Tutor Chatbot hỗ trợ hỏi đáp real-time.
- Thử chọn một trang slide (ví dụ: Trang 30 hoặc Slide 4) và hỏi câu hỏi liên quan.
- **Tính năng nổi bật:** Click vào thẻ Citation `[Trang X, Đoạn Y]` trong câu trả lời của AI → Trình duyệt sẽ tự động cuộn đến Trang X và tô sáng (highlight) đoạn văn nguồn Y ở cột bên trái!

### 2. Chạy Script Đánh giá Tự động (`eval/`)
Yêu cầu: Python 3.8+
```bash
cd eval
python eval_runner.py
```
Script sẽ khởi chạy bộ 25 test cases trong `golden_set.json` và in báo cáo chi tiết kết quả (Accuracy Rate, Strict Citation Rate, Latency average).

# BÁO CÁO THỰC THI & REFLECTION BẢN THÂN

**Họ và Tên:** Trương Ái Linh

**Mã Học viên:** `2A202601496`

**Vai trò trong dự án:** Data Analyst & Eval Lead
**Hướng dự án:** Đường A — VLearn (Nền tảng Trợ lý Học tập AI & Notebook RAG Đa Nguồn)

---

## Tôi đã làm gì?

| Hoạt động | Tôi đã làm gì? | Kết quả / ảnh hưởng |
|---|---|---|
| Decision | Cùng team chốt đề tài, đề xuất đi theo Đường B (mining chatlog thật) thay vì phỏng vấn giả định, vì nhóm có sẵn quyền truy cập log sản xuất | Chọn VLearn AI Tutor + hướng Strict Citation Enforcement, có căn cứ số liệu ngay từ đầu thay vì đoán |
| Data Mining | Kéo 2,522 dòng log (1,261 turn, 369 user, 585 hội thoại) từ `chat_messages`/`turns`/`llm_calls`, viết `DATA_DICTIONARY.md`, tự quét PII bằng regex/keyword trước khi đưa vào repo | Phát hiện 46.2% turn không có citation, 35.2% turn cite lệch trang, latency outlier tới ~24s — đây là toàn bộ số liệu pain mà slide/spec của nhóm dùng lại |
| RAG Chunking | Cấu trúc lại nội dung 6 slide bài giảng thành metadata `{slide, paragraph_id, text}` trong `rag_engine.js`, viết logic ưu tiên đoạn thuộc đúng slide người dùng đang mở (+3 điểm score) | Cơ chế này là nền tảng để sửa lỗi cite sai trang (vd. Turn T1084 trước đây cite nhầm sang trang 70, sau khi chunk lại trả đúng `[Trang 3, Đoạn 1]`) |
| Golden Set & Eval Script | Viết 25 case trong `eval/golden_set.json` theo 4 lớp taxonomy (Nguồn sự thật / Mơ hồ / Ngoài phạm vi / Đặc thù domain), viết `eval_runner.py` để chạy tự động và so khớp citation bằng regex | Run #1: 25/25 case PASS, Strict Citation 100%, latency trung bình 0.20s — vượt quality bar đã cam kết (≥85% pass, <2.5s) |

## AI hỗ trợ tôi thế nào?

Tôi dùng AI chủ yếu ở 2 việc: (1) sinh nhanh khung `DATA_DICTIONARY.md` từ mẫu vài dòng CSV rồi tự tay soát lại từng field một để không bỏ sót cột `total_cost_usd` bị lỗi luôn = 0; (2) nhờ AI viết bộ khung 25 case golden set theo taxonomy đã thống nhất, sau đó tôi tự đối chiếu lại từng case với `turn_id` gốc trong chatlog thật — vì AI có xu hướng tự bịa case "nghe hợp lý" nhưng không map được về turn thật, nên phải kiểm bằng tay từng dòng trước khi đưa vào `golden_set.json`.

## Bài học từ một case fail của nhóm

Case rõ nhất là **turn tóm tắt bài học**: bản RAG cũ cứ gặp câu "tóm tắt nội dung chính" là trả lời từ chối template ("tôi không thể truy xuất nội dung tổng thể"), xảy ra tới 236 lần trong dữ liệu cũ — vì hệ thống chunking chỉ match theo 1 đoạn duy nhất, không có luồng gộp nhiều slide. Bài học của tôi: **chunking đúng theo slide chỉ giải quyết được câu hỏi cục bộ**, còn câu hỏi tổng hợp (summary/toàn bài) cần một nhánh xử lý riêng (Map-Reduce qua toàn bộ 6 slide) — nếu không tách case này ra ngay từ đầu khi thiết kế golden set, nhóm sẽ đo "citation accuracy" rất đẹp nhưng bỏ sót hẳn một nhóm nhu cầu thật của học viên.

---

## 💡 3. Bài Học Rút Ra (Key Learnings & Reflections)

1. **Đừng tin field trong dashboard, phải tự verify từng cột trước khi dùng làm bằng chứng.** Khi làm `DATA_DICTIONARY.md`, tôi phát hiện `total_cost_usd` luôn bằng 0 (cost tracking hỏng) và hai field `misconceptions`, `follow_ups` chưa từng được ghi giá trị (0/1,261). Nếu tôi không mở từng cột ra kiểm tay mà cứ lấy số liệu ở mặt ngoài, nhóm có thể đã đưa nhầm số cost hoặc field chết vào slide làm "bằng chứng", gây mất uy tín khi bị hỏi ngược lại.

2. **Chunking theo slide giải quyết đúng bài toán cục bộ, nhưng dễ bỏ sót nhu cầu tổng hợp.** RAG chunking theo `{slide, paragraph_id}` sửa được lỗi cite sai trang, nhưng ban đầu không xử lý được câu hỏi "tóm tắt toàn bài" (236 turn bị từ chối trong dữ liệu cũ). Bài học: khi tối ưu một tính năng, phải chủ động rà xem cách chunk có bỏ sót nhóm câu hỏi nào không, chứ không chỉ nhìn vào các case đang đo.

3. **AI sinh case rất "mượt" nhưng không tự động đúng với rubric.** Khi nhờ AI dựng khung 25 case cho Golden Set, AI tạo ra các case đọc rất hợp lý nhưng phần lớn không gắn được với `turn_id` thật trong chatlog — trong khi rubric R4 yêu cầu ≥10/25 case phải truy được về log thật. Tôi phải tự đối chiếu từng case bằng tay để đảm bảo đủ số lượng case có căn cứ, thay vì tin tưởng hoàn toàn vào output của AI.

4. **Script đánh giá tách rời code thật là một rủi ro kỹ thuật cần nhớ.** `eval_runner.py` tự khai báo lại `SLIDES_DATA` riêng thay vì import trực tiếp từ `rag_engine.js` — nghĩa là nếu sau này ai đó sửa nội dung/logic trong `rag_engine.js` mà quên đồng bộ, Golden Set vẫn có thể báo PASS 100% dù code thật đã hỏng. Đây là bài học về thiết kế eval: **eval phải test đúng code chạy thật (production code), không phải một bản sao chép lại của nó** — nếu có thêm thời gian, tôi sẽ refactor để `eval_runner.py` import thẳng từ `rag_engine.js` thay vì duplicate.
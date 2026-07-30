/**
 * VLearn AI Tutor — Frontend Application Logic
 * Sidebar Course Navigator + Document Viewer + Interactive Chat + Strict Citation Highlighting
 */

document.addEventListener("DOMContentLoaded", () => {
  // ============ DOM References ============
  const slideSelect = document.getElementById("slideSelect");
  const activeSlideBadge = document.getElementById("activeSlideBadge");
  const documentContainer = document.getElementById("documentContainer");
  const chatWindow = document.getElementById("chatWindow");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const latencyVal = document.getElementById("latencyVal");
  const feedbackModal = document.getElementById("feedbackModal");
  const fbCancelBtn = document.getElementById("fbCancelBtn");
  const fbSubmitBtn = document.getElementById("fbSubmitBtn");
  const dayList = document.getElementById("dayList");
  const pageNoteBadge = document.getElementById("pageNoteBadge");
  const contextSlidePill = document.getElementById("contextSlidePill");
  const chatContextNote = document.getElementById("chatContextNote");
  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");
  const zoomVal = document.getElementById("zoomVal");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  const themeToggle = document.getElementById("themeToggle");
  const newChatBtn = document.getElementById("newChatBtn");
  const modeButtons = document.querySelectorAll(".mode-btn");

  let currentSlideId = 1;
  let activeHighlightElem = null;
  let zoomLevel = 100;
  const TOTAL_SLIDES = window.vlearnRAG.slides.length;

  // ============ Sidebar: Course Materials Navigator ============
  const COURSE_DAYS = [
    { id: "day01", label: "Day01", meta: "2 tài liệu", status: "PUBLISHED" },
    { id: "day02", label: "Day02", meta: "1 tài liệu", status: "PUBLISHED" },
    {
      id: "day03", label: "Day03", meta: "2 tài liệu", status: "STUDYING", current: true,
      files: [
        { name: "day03-tu-chatbot-den-agentic-agent-react.pdf", pages: "46 trang", active: true },
        { name: "Day03-D302-tu-chatbot-den-agentic-agent.pdf", pages: "60 trang", active: false }
      ]
    },
    { id: "day04", label: "Day04", meta: "3 tài liệu", status: "PUBLISHED" },
    { id: "day05", label: "Day05", meta: "3 tài liệu", status: "PUBLISHED" },
    { id: "day06", label: "Day06", meta: "1 tài liệu", status: "PUBLISHED" }
  ];

  function renderSidebar() {
    dayList.innerHTML = COURSE_DAYS.map(day => {
      const filesHTML = day.files ? day.files.map(f => `
        <div class="day-file ${f.active ? 'is-active' : ''}">
          <span class="day-file-icon">
            <svg viewBox="0 0 24 24" width="11" height="11"><path d="M5 12l4 4 10-10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <div class="day-file-text">
            <span class="file-name">${escapeHTML(f.name)}</span>
            <span class="file-pages">${escapeHTML(f.pages)}</span>
          </div>
        </div>
      `).join("") : "";

      return `
        <div class="day-item ${day.current ? 'is-current is-open' : ''}" data-day="${day.id}">
          <div class="day-row">
            <span class="day-play">
              <svg viewBox="0 0 24 24" width="12" height="12"><path d="M6 4l13 8-13 8z" fill="currentColor"/></svg>
            </span>
            <div class="day-row-main">
              <div class="day-name">${day.label}</div>
              <div class="day-meta">
                <span>${day.meta}</span> ·
                <span class="tag-published">${day.status === 'PUBLISHED' ? 'PUBLISHED' : ''}</span>
                ${day.status === 'STUDYING' ? '<span class="tag-studying">STUDYING</span>' : ''}
              </div>
            </div>
            <span class="day-chevron">
              <svg viewBox="0 0 24 24" width="13" height="13"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </div>
          ${day.files ? `<div class="day-files">${filesHTML}</div>` : ""}
        </div>
      `;
    }).join("");

    // Accordion toggle behaviour
    dayList.querySelectorAll(".day-item").forEach(item => {
      const row = item.querySelector(".day-row");
      row.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        if (!item.querySelector(".day-files")) {
          // Days without a file list in this demo — just show a quick toast in chat
          if (!item.classList.contains("is-current")) {
            appendChatMessage('ai', `Nội dung của **${item.querySelector('.day-name').textContent}** chưa được nạp vào bản demo này. Hiện tại RAG Engine chỉ được index cho tài liệu Day03 đang mở.`, 1, 0);
          }
          return;
        }
        item.classList.toggle("is-open", !isOpen);
      });
    });
  }

  // ============ Render Document Slides ============
  function renderSlides() {
    documentContainer.innerHTML = "";
    window.vlearnRAG.slides.forEach((slideObj) => {
      const slideCard = document.createElement("div");
      slideCard.className = `slide-card ${slideObj.slide == currentSlideId ? 'active-target' : ''}`;
      slideCard.id = `slide-card-${slideObj.slide}`;

      let paragraphsHTML = slideObj.paragraphs.map(p => `
        <div class="paragraph-block" id="para-${slideObj.slide}-${p.id}">
          <span class="para-id">[Trang ${slideObj.slide}, Đoạn ${p.id}]</span>
          <span class="para-text">${escapeHTML(p.text)}</span>
        </div>
      `).join("");

      slideCard.innerHTML = `
        <div class="slide-page-meta">
          <span>Trang ${slideObj.slide} / ${TOTAL_SLIDES}</span>
          <span>day03-tu-chatbot-den-agentic-agent-react.pdf</span>
        </div>
        <div class="slide-header">
          <span class="slide-title-text">${escapeHTML(slideObj.title)}</span>
          <span class="slide-num">SLIDE ${slideObj.slide}/${TOTAL_SLIDES}</span>
        </div>
        <div class="slide-body">
          ${paragraphsHTML}
        </div>
        <div class="slide-footer-bar">
          <span>Giảng viên (VinUni)</span>
          <span>AICB · Ngày 3</span>
          <span>17/03/2026 &nbsp; ${slideObj.slide}/${TOTAL_SLIDES}</span>
        </div>
      `;

      documentContainer.appendChild(slideCard);
    });
    applyZoom();
  }

  // Helper: Escape HTML
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
  }

  function updatePageIndicators(slideNum) {
    activeSlideBadge.textContent = slideNum;
    pageNoteBadge.textContent = `Trang ${slideNum} · 0 note`;
    contextSlidePill.textContent = `Trang slide: ${slideNum}`;
    chatContextNote.textContent = `Ngữ cảnh: Slide trang ${slideNum}`;
  }

  // Scroll and Highlight Target Paragraph on UI
  function highlightCitationSource(slideNum, paraNum) {
    if (activeHighlightElem) {
      activeHighlightElem.classList.remove("highlighted-citation");
    }

    slideSelect.value = slideNum;
    currentSlideId = slideNum;
    updatePageIndicators(slideNum);

    document.querySelectorAll(".slide-card").forEach(c => c.classList.remove("active-target"));
    const targetSlideCard = document.getElementById(`slide-card-${slideNum}`);
    if (targetSlideCard) targetSlideCard.classList.add("active-target");

    const targetPara = document.getElementById(`para-${slideNum}-${paraNum}`);
    if (targetPara) {
      targetPara.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetPara.classList.add("highlighted-citation");
      activeHighlightElem = targetPara;
    }
  }

  // Format AI Response Content with Interactive Citation Badges
  function formatResponseText(text) {
    const citationRegex = /\[(Trang|Slide)\s*(\d+)(?:,\s*Đoạn\s*([\d\-]+))?\]/gi;
    return text.replace(citationRegex, (match, prefix, slideNum, paraNum) => {
      const pId = paraNum ? paraNum.split('-')[0] : 1;
      return `<span class="citation-tag" onclick="window.triggerCitationClick(${slideNum}, ${pId})">
        📌 [Trang ${slideNum}${paraNum ? ', Đoạn ' + paraNum : ''}]
      </span>`;
    });
  }

  window.triggerCitationClick = (slideNum, paraNum) => {
    highlightCitationSource(slideNum, paraNum);
  };

  // Add Message to Chat Window
  function appendChatMessage(role, content, confidence = 0.95, latencyMs = 1200) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-message message-${role}`;

    const formattedContent = role === 'ai' ? formatResponseText(content) : escapeHTML(content);

    msgDiv.innerHTML = `
      <div class="msg-avatar">${role === 'ai' ? 'AI' : 'U'}</div>
      <div class="msg-body">
        <div class="msg-content">${formattedContent}</div>
        <div class="msg-meta">
          <span class="meta-time">${new Date().toLocaleTimeString()}</span>
          ${role === 'ai' ? `<span class="meta-confidence">Confidence: ${(confidence * 100).toFixed(0)}%</span>` : ''}
          ${role === 'ai' ? `<div class="feedback-actions">
            <button class="btn-icon" onclick="alert('Đã ghi nhận Upvote 👍')">👍</button>
            <button class="btn-icon btn-downvote">👎</button>
          </div>` : ''}
        </div>
      </div>
    `;

    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    const downvoteBtn = msgDiv.querySelector(".btn-downvote");
    if (downvoteBtn) {
      downvoteBtn.addEventListener("click", () => {
        feedbackModal.classList.add("show");
      });
    }
  }

  // Process User Question Submissions
  function handleSendMessage(userQuery) {
    if (!userQuery.trim()) return;

    appendChatMessage('user', userQuery);
    chatInput.value = "";

    const startTime = performance.now();

    const typingDiv = document.createElement("div");
    typingDiv.className = "chat-message message-ai typing-msg";
    typingDiv.innerHTML = `<div class="msg-avatar">AI</div><div class="msg-body"><div class="msg-content"><em>Đang tra cứu Slide và kiểm tra Strict Citations...</em></div></div>`;
    chatWindow.appendChild(typingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    setTimeout(() => {
      if (typingDiv.parentNode) typingDiv.parentNode.removeChild(typingDiv);

      const res = window.vlearnRAG.query(userQuery, currentSlideId);
      const endTime = performance.now();
      const latencySec = ((endTime - startTime) / 1000).toFixed(2);
      latencyVal.textContent = `${latencySec}s`;

      appendChatMessage('ai', res.answer, res.confidence, Math.round(endTime - startTime));

      if (res.matchedSlide && res.matchedPara) {
        highlightCitationSource(res.matchedSlide, res.matchedPara);
      }
    }, 800);
  }

  // ============ Zoom Controls ============
  function applyZoom() {
    zoomVal.textContent = `${zoomLevel}%`;
    documentContainer.style.setProperty('--doc-zoom', zoomLevel / 100);
    document.querySelectorAll(".slide-card").forEach(card => {
      card.style.transform = `scale(${zoomLevel / 100})`;
      card.style.transformOrigin = "top center";
    });
  }

  zoomInBtn.addEventListener("click", () => {
    zoomLevel = Math.min(160, zoomLevel + 10);
    applyZoom();
  });

  zoomOutBtn.addEventListener("click", () => {
    zoomLevel = Math.max(60, zoomLevel - 10);
    applyZoom();
  });

  // ============ Page Navigation ============
  function goToPage(num) {
    if (num < 1 || num > TOTAL_SLIDES) return;
    currentSlideId = num;
    slideSelect.value = num;
    updatePageIndicators(num);
    renderSlides();
    const card = document.getElementById(`slide-card-${num}`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  prevPageBtn.addEventListener("click", () => goToPage(currentSlideId - 1));
  nextPageBtn.addEventListener("click", () => goToPage(currentSlideId + 1));

  // ============ Reading Mode Buttons (visual only) ============
  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      modeButtons.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  // ============ Theme Toggle ============
  themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
  });

  // ============ New Chat ============
  newChatBtn.addEventListener("click", () => {
    chatWindow.innerHTML = "";
    appendChatMessage('ai', 'Xin chào! Mình là **VLearn Tutor**. Bạn có thể bôi đen một đoạn trên slide để hỏi hoặc gửi câu hỏi tự do nhé!', 1, 0);
  });

  // ============ Event Listeners ============
  slideSelect.addEventListener("change", (e) => {
    currentSlideId = parseInt(e.target.value);
    updatePageIndicators(currentSlideId);
    renderSlides();
  });

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSendMessage(chatInput.value);
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSendMessage(chatInput.value);
    }
  });

  // Auto-grow chat textarea
  chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 90) + "px";
  });

  // Quick Preset Prompt Buttons
  document.querySelectorAll(".btn-prompt").forEach(btn => {
    btn.addEventListener("click", () => {
      const promptText = btn.getAttribute("data-prompt");
      const targetSlide = btn.getAttribute("data-slide");
      if (targetSlide !== 'all' && targetSlide !== 'none') {
        slideSelect.value = targetSlide;
        currentSlideId = parseInt(targetSlide);
        updatePageIndicators(currentSlideId);
        renderSlides();
      }
      handleSendMessage(promptText);
    });
  });

  // Modal Buttons
  fbCancelBtn.addEventListener("click", () => feedbackModal.classList.remove("show"));
  fbSubmitBtn.addEventListener("click", () => {
    feedbackModal.classList.remove("show");
    alert("Đã ghi nhận Feedback vào validation/feedback_log.md! Hệ thống đang tinh chỉnh lại RAG Context.");
  });

  // ============ Initial Render ============
  renderSidebar();
  renderSlides();
  updatePageIndicators(currentSlideId);
});

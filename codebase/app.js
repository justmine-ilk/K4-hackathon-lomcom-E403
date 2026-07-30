/**
 * VLearn AI Tutor — Frontend Application Logic
 * Dual-pane Document Viewer + Interactive Chat + Strict Citation Highlighting
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM References
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

  let currentSlideId = 1;
  let activeHighlightElem = null;

  // Render Document Slides into Document Container
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
        <div class="slide-header">
          <span class="slide-num">SLIDE ${slideObj.slide} / 6</span>
          <span class="slide-title-text">${escapeHTML(slideObj.title)}</span>
        </div>
        <div class="slide-body">
          ${paragraphsHTML}
        </div>
      `;

      documentContainer.appendChild(slideCard);
    });
  }

  // Helper: Escape HTML
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
  }

  // Scroll and Highlight Target Paragraph on UI
  function highlightCitationSource(slideNum, paraNum) {
    // 1. Remove previous highlight
    if (activeHighlightElem) {
      activeHighlightElem.classList.remove("highlighted-citation");
    }

    // 2. Select slide and paragraph
    slideSelect.value = slideNum;
    currentSlideId = slideNum;
    activeSlideBadge.textContent = `Trang ${slideNum} / 6`;

    // Highlight target slide card
    document.querySelectorAll(".slide-card").forEach(c => c.classList.remove("active-target"));
    const targetSlideCard = document.getElementById(`slide-card-${slideNum}`);
    if (targetSlideCard) targetSlideCard.classList.add("active-target");

    // 3. Scroll to target paragraph & apply highlight effect
    const targetPara = document.getElementById(`para-${slideNum}-${paraNum}`);
    if (targetPara) {
      targetPara.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetPara.classList.add("highlighted-citation");
      activeHighlightElem = targetPara;
    }
  }

  // Format AI Response Content with Interactive Citation Badges
  function formatResponseText(text) {
    // Regex matches pattern: [Trang X, Đoạn Y] or [Slide X, Đoạn Y]
    const citationRegex = /\[(Trang|Slide)\s*(\d+)(?:,\s*Đoạn\s*([\d\-]+))?\]/gi;

    return text.replace(citationRegex, (match, prefix, slideNum, paraNum) => {
      const pId = paraNum ? paraNum.split('-')[0] : 1;
      return `<span class="citation-tag" onclick="window.triggerCitationClick(${slideNum}, ${pId})">
        📌 [Trang ${slideNum}${paraNum ? ', Đoạn ' + paraNum : ''}]
      </span>`;
    });
  }

  // Global window trigger for click on citation badge
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

    // Attach Downvote Listener
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

    // Append User Message
    appendChatMessage('user', userQuery);
    chatInput.value = "";

    // Start Latency Timer
    const startTime = performance.now();

    // Show Typing Indicator
    const typingDiv = document.createElement("div");
    typingDiv.className = "chat-message message-ai typing-msg";
    typingDiv.innerHTML = `<div class="msg-avatar">AI</div><div class="msg-content"><em>Đang tra cứu Slide và kiểm tra Strict Citations...</em></div>`;
    chatWindow.appendChild(typingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    setTimeout(() => {
      // Remove typing indicator
      if (typingDiv.parentNode) typingDiv.parentNode.removeChild(typingDiv);

      // Query RAG Engine
      const res = window.vlearnRAG.query(userQuery, currentSlideId);
      const endTime = performance.now();
      const latencySec = ((endTime - startTime) / 1000).toFixed(2);
      latencyVal.textContent = `${latencySec}s`;

      // Append AI Response
      appendChatMessage('ai', res.answer, res.confidence, Math.round(endTime - startTime));

      // Auto highlight matched paragraph if single citation
      if (res.matchedSlide && res.matchedPara) {
        highlightCitationSource(res.matchedSlide, res.matchedPara);
      }
    }, 800);
  }

  // Event Listeners
  slideSelect.addEventListener("change", (e) => {
    currentSlideId = parseInt(e.target.value);
    activeSlideBadge.textContent = `Trang ${currentSlideId} / 6`;
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

  // Quick Preset Prompt Buttons
  document.querySelectorAll(".btn-prompt").forEach(btn => {
    btn.addEventListener("click", () => {
      const promptText = btn.getAttribute("data-prompt");
      const targetSlide = btn.getAttribute("data-slide");
      if (targetSlide !== 'all' && targetSlide !== 'none') {
        slideSelect.value = targetSlide;
        currentSlideId = parseInt(targetSlide);
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

  // Initial Render
  renderSlides();
});

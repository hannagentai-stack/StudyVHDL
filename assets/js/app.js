// ==========================================================================
// APP.JS - ĐIỀU PHỐI VÀ KHỞI TẠO TOÀN BỘ ỨNG DỤNG STUDYVHDL
// ==========================================================================

const VHDL_App = (function () {
  let currentLesson = null;
  let activeSimTab = 'board';

  // Lấy bài học theo ID từ cơ sở dữ liệu
  function findLessonById(lessonId) {
    if (!window.VHDL_LESSONS_DB) return null;
    for (const chId in window.VHDL_LESSONS_DB) {
      const lessons = window.VHDL_LESSONS_DB[chId] || [];
      const found = lessons.find(l => l.id === lessonId);
      if (found) return found;
    }
    return null;
  }

  // Đếm tổng số bài học hiện có
  function getTotalLessonsCount() {
    let total = 0;
    if (!window.VHDL_LESSONS_DB) return 0;
    for (const chId in window.VHDL_LESSONS_DB) {
      total += (window.VHDL_LESSONS_DB[chId] || []).length;
    }
    return total;
  }

  // Cập nhật thanh tiến độ tổng thể trên Header
  function updateProgressBar() {
    const total = getTotalLessonsCount();
    const completed = window.VHDL_Store ? window.VHDL_Store.getCompletedCount() : 0;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const fillEl = document.getElementById('progress_bar_fill');
    const textEl = document.getElementById('progress_text_pct');
    if (fillEl) fillEl.style.width = pct + '%';
    if (textEl) textEl.textContent = `${pct}% (${completed}/${total})`;
  }

  // Khởi tạo Sidebar danh mục chương và bài học
  function renderSidebar(filterText = '') {
    const navEl = document.getElementById('sidebar_nav');
    if (!navEl) return;

    const chapters = window.VHDL_CHAPTERS_INDEX || [];
    const query = filterText.trim().toLowerCase();
    let html = '';

    chapters.forEach(ch => {
      const lessons = window.VHDL_LESSONS_DB[ch.id] || [];
      const isReady = ch.status === 'ready';

      // Lọc bài học nếu có tìm kiếm
      const filteredLessons = lessons.filter(l => {
        if (!query) return true;
        return l.title.toLowerCase().includes(query) ||
               (l.subtitle && l.subtitle.toLowerCase().includes(query)) ||
               (l.badge && l.badge.toLowerCase().includes(query));
      });

      if (query && filteredLessons.length === 0) return; // Ẩn chương không có bài khớp tìm kiếm

      // Đếm số bài đã hoàn thành trong chương
      let chCompleted = 0;
      lessons.forEach(l => {
        if (window.VHDL_Store && window.VHDL_Store.isLessonCompleted(l.id)) chCompleted++;
      });

      const isOpen = query || (currentLesson && currentLesson.chapterId === ch.id) || (ch.id === 'ch0' || ch.id === 'ch1');

      html += `
        <div class="chapter-group ${isOpen ? 'open' : ''}" id="chapter_group_${ch.id}">
          <button class="chapter-btn" onclick="VHDL_App.toggleChapterGroup('${ch.id}')">
            <div class="chapter-btn-left">
              <span class="chapter-badge">${isReady ? `${chCompleted}/${lessons.length}` : 'Sắp ra mắt'}</span>
              <span>${ch.title}</span>
            </div>
            <span class="chapter-chevron">▶</span>
          </button>
          <ul class="lessons-list">
      `;

      if (lessons.length === 0) {
        html += `<li class="lesson-item" style="padding: 6px 12px; font-size: 12px; color: var(--text-muted);">Đang biên soạn nội dung...</li>`;
      } else {
        filteredLessons.forEach(l => {
          const isActive = currentLesson && currentLesson.id === l.id;
          const isDone = window.VHDL_Store ? window.VHDL_Store.isLessonCompleted(l.id) : false;

          html += `
            <li class="lesson-item">
              <a href="#${l.id}" class="lesson-link ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}" id="lesson_nav_link_${l.id}">
                <div class="lesson-link-left">
                  <span class="lesson-status-icon"></span>
                  <span>${l.order}. ${l.title}</span>
                </div>
              </a>
            </li>
          `;
        });
      }

      html += `
          </ul>
        </div>
      `;
    });

    navEl.innerHTML = html;
  }

  function toggleChapterGroup(chapterId) {
    const groupEl = document.getElementById(`chapter_group_${chapterId}`);
    if (groupEl) {
      groupEl.classList.toggle('open');
    }
  }

  // Render toàn bộ 10 thành phần của bài học vào Lesson Pane
  function renderLessonContent(lesson) {
    const paneEl = document.getElementById('lesson_content_pane');
    if (!paneEl || !lesson) return;

    currentLesson = lesson;

    // Tìm thông tin chương
    const chapters = window.VHDL_CHAPTERS_INDEX || [];
    const chapterObj = chapters.find(c => c.id === lesson.chapterId) || { title: "VHDL Course" };

    const isCompleted = window.VHDL_Store ? window.VHDL_Store.isLessonCompleted(lesson.id) : false;

    // --- MỤC 1: MỤC TIÊU BÀI HỌC ---
    let objectivesHtml = '';
    (lesson.objectives || []).forEach((obj, idx) => {
      objectivesHtml += `
        <li class="objective-item">
          <span class="objective-bullet">${idx + 1}</span>
          <span>${obj}</span>
        </li>
      `;
    });

    // --- MỤC 2: LÝ THUYẾT GIẢI THÍCH (TẠI SAO -> NHƯ THẾ NÀO) ---
    let theorySectionsHtml = '';
    if (lesson.theory && lesson.theory.sections) {
      lesson.theory.sections.forEach(sec => {
        let calloutHtml = '';
        if (sec.callout) {
          const typeClass = `callout-${sec.callout.type || 'info'}`;
          calloutHtml = `
            <div class="callout ${typeClass}">
              <strong>${sec.callout.title || 'Lưu ý:'}</strong>
              ${sec.callout.text}
            </div>
          `;
        }
        theorySectionsHtml += `
          <div style="margin-top: 14px;">
            <h4 style="color: var(--text-primary); font-size: 15px; margin-bottom: 6px;">${sec.heading}</h4>
            <div style="color: var(--text-secondary); line-height: 1.6; white-space: pre-line;">${sec.content}</div>
            ${calloutHtml}
          </div>
        `;
      });
    }

    // Bảng chân trị (nếu có)
    let truthTableHtml = '';
    if (lesson.theory && lesson.theory.truthTable) {
      const tt = lesson.theory.truthTable;
      let ths = tt.headers.map(h => `<th>${h}</th>`).join('');
      let trs = tt.rows.map(r => `<tr>${r.map(c => `<td><code>${c}</code></td>`).join('')}</tr>`).join('');
      truthTableHtml = `
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr>${ths}</tr></thead>
            <tbody>${trs}</tbody>
          </table>
        </div>
      `;
    }

    // --- MỤC 4: CODE VHDL MẪU ---
    const vhdlCodeHtml = window.VHDL_Highlighter
      ? window.VHDL_Highlighter.highlight(lesson.vhdlCode.code, `${lesson.vhdlCode.entityName}.vhd`)
      : `<pre><code>${lesson.vhdlCode.code}</code></pre>`;

    // --- MỤC 5: TESTBENCH MẪU ---
    const testbenchCodeHtml = window.VHDL_Highlighter
      ? window.VHDL_Highlighter.highlight(lesson.testbenchCode.code, `${lesson.testbenchCode.entityName}.vhd`)
      : `<pre><code>${lesson.testbenchCode.code}</code></pre>`;

    // --- MỤC 6: HƯỚNG DẪN QUARTUS & GÁN CHÂN ---
    let quartusStepsHtml = '';
    (lesson.quartusGuide.steps || []).forEach((step, idx) => {
      quartusStepsHtml += `
        <div class="timeline-step">
          <div class="step-num">${idx + 1}</div>
          <div class="step-text">${step}</div>
        </div>
      `;
    });

    let pinTableRows = '';
    (lesson.quartusGuide.pinAssignments || []).forEach(p => {
      pinTableRows += `
        <tr>
          <td><code>${p.signal}</code></td>
          <td><strong style="color: #38bdf8;">${p.pin}</strong></td>
          <td>${p.ioStandard || '2.5 V'}</td>
          <td>${p.note || ''}</td>
        </tr>
      `;
    });

    // --- MỤC 7: LỖI HAY GẶP VÀ CÁCH SỬA ---
    let commonErrorsHtml = '';
    (lesson.commonErrors || []).forEach(err => {
      commonErrorsHtml += `
        <div class="error-card">
          <div class="error-title">⚠️ ${err.error}</div>
          <div class="error-cause"><strong>Nguyên nhân:</strong> ${err.cause}</div>
          <div class="error-fix"><strong>Cách khắc phục:</strong> ${err.fix}</div>
        </div>
      `;
    });

    // --- MỤC 8: BÀI TẬP TỰ LUYỆN 3 CẤP ĐỘ ---
    let exercisesHtml = '';
    (lesson.exercises || []).forEach((ex, idx) => {
      const exId = `ex_${lesson.id}_${idx}`;
      const badgeColor = ex.level === 'Cơ bản' ? 'badge-green' : (ex.level === 'Vận dụng' ? 'badge-amber' : 'badge-purple');
      exercisesHtml += `
        <div class="exercise-card">
          <div class="exercise-header">
            <span class="badge ${badgeColor}">${ex.level}</span>
            <div class="exercise-title">${ex.title}</div>
          </div>
          <div class="exercise-prompt">${ex.prompt}</div>
          <div class="exercise-actions">
            <button class="btn-toggle-hint" onclick="VHDL_App.toggleExerciseBox('${exId}_hint')">💡 Xem gợi ý</button>
            <button class="btn-toggle-solution" onclick="VHDL_App.toggleExerciseBox('${exId}_sol')">🔍 Xem đáp án mẫu</button>
          </div>
          <div class="exercise-hint-box" id="${exId}_hint"><strong>Gợi ý:</strong> ${ex.hint}</div>
          <div class="exercise-solution-box" id="${exId}_sol">
            <strong>Đáp án gợi ý:</strong>
            <pre style="margin-top:6px; font-family: monospace;">${ex.solution}</pre>
          </div>
        </div>
      `;
    });

    // --- MỤC 9: QUIZ TRẮC NGHIỆM TƯƠNG TÁC ---
    let quizHtml = '';
    (lesson.quiz || []).forEach((q, qIdx) => {
      const qKey = `${lesson.id}_${qIdx}`;
      const savedAns = window.VHDL_Store ? window.VHDL_Store.getQuizAnswer(lesson.id, qIdx) : null;
      const letters = ['A', 'B', 'C', 'D'];

      let optionsHtml = '';
      q.options.forEach((opt, oIdx) => {
        let optClass = '';
        if (savedAns !== null) {
          if (oIdx === q.answerIndex) optClass = 'correct';
          else if (oIdx === savedAns) optClass = 'incorrect';
        }
        optionsHtml += `
          <button class="quiz-option-btn ${optClass}" id="qbtn_${qKey}_${oIdx}" onclick="VHDL_App.answerQuiz('${lesson.id}', ${qIdx}, ${oIdx})">
            <span class="quiz-option-letter">${letters[oIdx]}</span>
            <span>${opt}</span>
          </button>
        `;
      });

      quizHtml += `
        <div class="quiz-card" id="quiz_card_${qKey}">
          <div class="quiz-question"><strong>Câu ${qIdx + 1}:</strong> ${q.question}</div>
          <div class="quiz-options-list">${optionsHtml}</div>
          <div class="quiz-explanation-box ${savedAns !== null ? 'show' : ''}" id="qexp_${qKey}">
            <strong style="color: var(--accent-cyan);">Giải thích chi tiết:</strong> ${q.explanation}
          </div>
        </div>
      `;
    });

    // --- MỤC 10: TÓM TẮT 5 Ý CỐT LÕI ---
    let summaryHtml = '';
    (lesson.summary || []).forEach(s => {
      summaryHtml += `
        <li class="summary-point-item">
          <span style="color: var(--accent-cyan); font-weight: bold;">✔</span>
          <span>${s}</span>
        </li>
      `;
    });

    // Nút Bài trước / Bài tiếp theo
    const prevId = window.VHDL_Router.getPrevLessonId(lesson.id);
    const nextId = window.VHDL_Router.getNextLessonId(lesson.id);

    paneEl.innerHTML = `
      <!-- Hero Header -->
      <div class="lesson-hero">
        <div class="lesson-breadcrumbs">
          <a href="#ch0-b1">Trang chủ</a> <span>/</span>
          <span>${chapterObj.title}</span> <span>/</span>
          <span style="color: var(--text-primary); font-weight: 600;">Bài ${lesson.order}</span>
        </div>
        <div class="lesson-meta-row">
          <span class="badge">${lesson.badge}</span>
          <span class="badge badge-amber">⏱️ ${lesson.estimatedMinutes} phút</span>
          <span class="badge badge-purple">🎯 Kit: ${lesson.hardwareFocus ? lesson.hardwareFocus.join(', ') : 'Cyclone IV'}</span>
        </div>
        <h1 class="lesson-title">Bài ${lesson.order}: ${lesson.title}</h1>
        <p class="lesson-subtitle">${lesson.subtitle || ''}</p>
      </div>

      <!-- Mục 1: Mục tiêu bài học -->
      <section class="lesson-section">
        <div class="section-header">
          <div class="section-title"><span class="section-title-icon">🎯</span> 1. Mục tiêu bài học</div>
        </div>
        <ul class="objectives-list">${objectivesHtml}</ul>
      </section>

      <!-- Mục 2: Lý thuyết giải thích Tại sao -> Như thế nào -->
      <section class="lesson-section">
        <div class="section-header">
          <div class="section-title"><span class="section-title-icon">💡</span> 2. Lý thuyết cốt lõi (Từ Tại sao đến Như thế nào)</div>
        </div>
        <div class="theory-block">
          <div class="why-how-box">
            <div class="why-card">
              <div class="why-card-title">TẠI SAO PHẢI CÓ KHÁI NIỆM NÀY?</div>
              <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">${lesson.theory.why}</div>
            </div>
            <div class="how-card">
              <div class="how-card-title">NÓ HOẠT ĐỘNG NHƯ THẾ NÀO?</div>
              <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">${lesson.theory.how}</div>
            </div>
          </div>
          ${theorySectionsHtml}
          ${truthTableHtml}
        </div>
      </section>

      <!-- Mục 3: Sơ đồ khối/mạch bằng SVG -->
      <section class="lesson-section">
        <div class="section-header">
          <div class="section-title"><span class="section-title-icon">📐</span> 3. Sơ đồ khối kiến trúc phần cứng (SVG)</div>
        </div>
        <div class="circuit-diagram-container">${lesson.diagramSvg}</div>
      </section>

      <!-- Mục 4: Code VHDL mẫu -->
      <section class="lesson-section">
        <div class="section-header">
          <div class="section-title"><span class="section-title-icon">💻</span> 4. Mã nguồn VHDL mẫu đầy đủ (Tổng hợp được 100%)</div>
        </div>
        <div class="circuit-type-badge">
          ⚡ ${lesson.vhdlCode.circuitType === 'combinational' ? 'MẠCH TỔ HỢP (Combinational)' : 'MẠCH TUẦN TỰ (Sequential)'}
        </div>
        <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 10px;">
          ${lesson.vhdlCode.typeExplanation || ''}
        </p>
        ${vhdlCodeHtml}
      </section>

      <!-- Mục 5: Testbench mẫu cho ModelSim -->
      <section class="lesson-section">
        <div class="section-header">
          <div class="section-title"><span class="section-title-icon">⏱️</span> 5. Testbench kiểm chứng logic trên ModelSim</div>
        </div>
        <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 8px;">
          <strong>Hướng dẫn mô phỏng:</strong> ${lesson.testbenchCode.instructions || ''}
        </p>
        ${testbenchCodeHtml}
      </section>

      <!-- Mục 6: Thao tác Quartus 20.1 & Bảng chân DE2-115 -->
      <section class="lesson-section">
        <div class="section-header">
          <div class="section-title"><span class="section-title-icon">🛠️</span> 6. Hướng dẫn thao tác Quartus 20.1 & Bảng gán chân DE2-115</div>
        </div>
        <div class="steps-timeline">${quartusStepsHtml}</div>
        
        <h4 style="color: var(--text-primary); font-size: 14.5px; margin: 16px 0 8px 0;">Bảng chân chip FPGA Cyclone IV EP4CE115F29C7:</h4>
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Tín hiệu VHDL</th><th>Chân FPGA</th><th>Chuẩn I/O</th><th>Ngoại vi DE2-115</th></tr></thead>
            <tbody>${pinTableRows}</tbody>
          </table>
        </div>

        <div style="margin-top: 14px;">
          <h5 style="color: var(--text-muted); font-size: 12px; margin-bottom: 6px;">LỆNH GÁN CHÂN QSF (Copy dán vào file .qsf của Quartus):</h5>
          <pre style="background: var(--bg-primary); padding: 10px 14px; border-radius: 6px; font-size: 12px; color: #38bdf8; border: 1px solid var(--border-color); overflow-x: auto;">${lesson.quartusGuide.qsfSnippet || ''}</pre>
        </div>
      </section>

      <!-- Mục 7: Lỗi hay gặp và cách khắc phục -->
      <section class="lesson-section">
        <div class="section-header">
          <div class="section-title"><span class="section-title-icon">⚠️</span> 7. Bảng tổng hợp lỗi thường gặp & Cách xử lý</div>
        </div>
        <div>${commonErrorsHtml}</div>
      </section>

      <!-- Mục 8: Bài tập tự luyện 3 cấp độ -->
      <section class="lesson-section">
        <div class="section-header">
          <div class="section-title"><span class="section-title-icon">✍️</span> 8. Bài tập tự luyện (3 cấp độ)</div>
        </div>
        <div>${exercisesHtml}</div>
      </section>

      <!-- Mục 9: Quiz trắc nghiệm tương tác -->
      <section class="lesson-section">
        <div class="section-header">
          <div class="section-title"><span class="section-title-icon">❓</span> 9. Trắc nghiệm kiểm tra kiến thức</div>
        </div>
        <div>${quizHtml}</div>
      </section>

      <!-- Mục 10: Tóm tắt 5 ý cốt lõi & Hoàn thành -->
      <section class="lesson-section">
        <div class="section-header">
          <div class="section-title"><span class="section-title-icon">📝</span> 10. Tóm tắt 5 ý cần nhớ</div>
        </div>
        <ul class="summary-points-list">${summaryHtml}</ul>
        
        <div class="completion-container">
          <div>
            <div style="font-weight: 700; color: var(--text-primary); font-size: 15px;">Đánh dấu tiến độ học tập:</div>
            <div style="font-size: 13px; color: var(--text-muted);">Tích chọn để ghi nhận vào lịch sử học tập của bạn.</div>
          </div>
          <button class="btn-complete-lesson ${isCompleted ? 'completed' : ''}" id="btn_complete_lesson" onclick="VHDL_App.toggleCompleteCurrentLesson()">
            <span>${isCompleted ? '✓ ĐÃ HIỂU BÀI NÀY' : '○ TÔI ĐÃ HIỂU BÀI NÀY'}</span>
          </button>
        </div>
      </section>

      <!-- Chân trang điều hướng bài trước / tiếp -->
      <div class="lesson-nav-footer">
        <button class="btn-nav-lesson" ${prevId ? `onclick="VHDL_Router.navigateTo('${prevId}')"` : 'disabled'}>
          ◀ Bài trước
        </button>
        <button class="btn-nav-lesson" ${nextId ? `onclick="VHDL_Router.navigateTo('${nextId}')"` : 'disabled'}>
          Bài tiếp theo ▶
        </button>
      </div>
    `;

    // Cuộn lên đầu trang
    paneEl.scrollTop = 0;

    // Gắn kết Board ảo với bài học hiện tại
    if (window.VHDL_DE2_Board) {
      window.VHDL_DE2_Board.attachLesson(lesson);
    }

    // Gắn kết Bộ vẽ dạng sóng xung nhịp
    if (window.VHDL_Waveform) {
      window.VHDL_Waveform.attachLesson(lesson);
    }

    // Gắn kết Bộ mô phỏng Máy trạng thái hữu hạn
    if (window.VHDL_FSM) {
      window.VHDL_FSM.attachLesson(lesson);
    }

    // Tự động chuyển tab mô phỏng tương ứng
    if (lesson.chapterId === 'ch4') {
      switchSimTab('waveform');
    } else if (lesson.chapterId === 'ch5') {
      switchSimTab('fsm');
    } else {
      switchSimTab('board');
    }

    // Cập nhật trạng thái active trên Sidebar
    renderSidebar();
    updateProgressBar();
  }

  // Đánh dấu hoàn thành bài học
  function toggleCompleteCurrentLesson() {
    if (!currentLesson || !window.VHDL_Store) return;
    const isDone = window.VHDL_Store.toggleLessonCompleted(currentLesson.id);

    const btn = document.getElementById('btn_complete_lesson');
    if (btn) {
      if (isDone) {
        btn.classList.add('completed');
        btn.innerHTML = '<span>✓ ĐÃ HIỂU BÀI NÀY</span>';
        if (window.VHDL_Audio) window.VHDL_Audio.playTone(1200, 160, 'sine');
      } else {
        btn.classList.remove('completed');
        btn.innerHTML = '<span>○ TÔI ĐÃ HIỂU BÀI NÀY</span>';
      }
    }

    renderSidebar();
    updateProgressBar();
  }

  // Mở/Đóng gợi ý và lời giải bài tập
  function toggleExerciseBox(boxId) {
    const box = document.getElementById(boxId);
    if (box) {
      box.classList.toggle('show');
    }
  }

  // Xử lý trả lời Quiz trắc nghiệm
  function answerQuiz(lessonId, qIdx, selectedOptionIdx) {
    const lesson = findLessonById(lessonId);
    if (!lesson || !lesson.quiz || !lesson.quiz[qIdx]) return;

    const q = lesson.quiz[qIdx];
    const qKey = `${lessonId}_${qIdx}`;

    // Lưu vào store
    if (window.VHDL_Store) {
      window.VHDL_Store.saveQuizAnswer(lessonId, qIdx, selectedOptionIdx);
    }

    // Cập nhật giao diện lựa chọn
    q.options.forEach((_, optIdx) => {
      const btn = document.getElementById(`qbtn_${qKey}_${optIdx}`);
      if (btn) {
        btn.classList.remove('correct', 'incorrect');
        if (optIdx === q.answerIndex) {
          btn.classList.add('correct');
        } else if (optIdx === selectedOptionIdx) {
          btn.classList.add('incorrect');
        }
      }
    });

    // Mở hộp giải thích
    const expBox = document.getElementById(`qexp_${qKey}`);
    if (expBox) expBox.classList.add('show');

    // Âm thanh phản hồi
    if (window.VHDL_Audio) {
      if (selectedOptionIdx === q.answerIndex) {
        window.VHDL_Audio.playTone(880, 100, 'sine');
      } else {
        window.VHDL_Audio.playTone(330, 200, 'sawtooth');
      }
    }
  }

  // Toggle Theme (Sáng / Tối)
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);

    if (window.VHDL_Store) {
      window.VHDL_Store.updateSetting('theme', nextTheme);
    }

    const themeBtn = document.getElementById('btn_toggle_theme');
    if (themeBtn) {
      themeBtn.innerHTML = nextTheme === 'dark' ? '🌙' : '☀️';
    }
  }

  // Toggle Audio
  function toggleAudio() {
    if (!window.VHDL_Audio) return;
    const nextState = !window.VHDL_Audio.isEnabled();
    window.VHDL_Audio.setEnabled(nextState);

    if (window.VHDL_Store) {
      window.VHDL_Store.updateSetting('audio', nextState);
    }

    const audioBtn = document.getElementById('btn_toggle_audio');
    if (audioBtn) {
      audioBtn.innerHTML = nextState ? '🔊' : '🔇';
      audioBtn.classList.toggle('active', nextState);
    }
  }

  // Toggle Sidebar
  function toggleSidebar() {
    const sidebar = document.getElementById('app_sidebar');
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
      const isCollapsed = sidebar.classList.contains('collapsed');
      if (window.VHDL_Store) window.VHDL_Store.updateSetting('sidebarCollapsed', isCollapsed);
    }
  }

  // Modal Xuất / Nhập JSON
  function openProgressModal() {
    const modal = document.getElementById('progress_modal');
    if (modal) modal.style.display = 'flex';
  }

  function closeProgressModal() {
    const modal = document.getElementById('progress_modal');
    if (modal) modal.style.display = 'none';
  }

  // Chuyển đổi qua lại giữa Board DE2-115 ảo, Waveform và FSM
  function switchSimTab(tabName) {
    activeSimTab = tabName;
    const boardBtn = document.getElementById('tab_btn_board');
    const wvBtn = document.getElementById('tab_btn_waveform');
    const fsmBtn = document.getElementById('tab_btn_fsm');
    const boardContainer = document.getElementById('de2_board_container');
    const wvContainer = document.getElementById('waveform_container');
    const fsmContainer = document.getElementById('fsm_container');

    if (boardBtn) boardBtn.classList.toggle('active', tabName === 'board');
    if (wvBtn) wvBtn.classList.toggle('active', tabName === 'waveform');
    if (fsmBtn) fsmBtn.classList.toggle('active', tabName === 'fsm');

    if (boardContainer) boardContainer.style.display = (tabName === 'board') ? 'block' : 'none';
    if (wvContainer) wvContainer.style.display = (tabName === 'waveform') ? 'block' : 'none';
    if (fsmContainer) fsmContainer.style.display = (tabName === 'fsm') ? 'block' : 'none';

    if (tabName === 'waveform' && window.VHDL_Waveform) {
      setTimeout(() => {
        if (window.VHDL_Waveform.draw) window.VHDL_Waveform.draw();
      }, 50);
    } else if (tabName === 'fsm' && window.VHDL_FSM) {
      setTimeout(() => {
        if (window.VHDL_FSM.draw) window.VHDL_FSM.draw();
      }, 50);
    }
  }

  // Làm mới trạng thái của tab mô phỏng đang active
  function refreshActiveSim() {
    if (activeSimTab === 'board' && window.VHDL_DE2_Board) {
      window.VHDL_DE2_Board.evaluateSimulation();
    } else if (activeSimTab === 'waveform' && window.VHDL_Waveform) {
      window.VHDL_Waveform.resetTime();
    } else if (activeSimTab === 'fsm' && window.VHDL_FSM) {
      window.VHDL_FSM.resetFsm();
    }
  }

  function handleImportFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const res = window.VHDL_Store.importProgress(text);
      if (res.success) {
        alert(`Nhập tiến độ thành công! Đã khôi phục ${res.count} bài học.`);
        closeProgressModal();
        renderSidebar();
        updateProgressBar();
      } else {
        alert('Lỗi nhập dữ liệu: ' + res.error);
      }
    };
    reader.readAsText(file);
  }

  // Khởi tạo kéo co giãn kích thước Split-View
  function initSplitResizer() {
    const divider = document.getElementById('split_divider');
    const simPane = document.getElementById('simulator_pane');
    if (!divider || !simPane) return;

    let isDragging = false;

    divider.addEventListener('mousedown', (e) => {
      isDragging = true;
      divider.classList.add('dragging');
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const totalWidth = window.innerWidth;
      const newSimWidth = totalWidth - e.clientX;
      const pct = (newSimWidth / totalWidth) * 100;
      if (pct >= 28 && pct <= 65) {
        simPane.style.width = pct + '%';
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        divider.classList.remove('dragging');
        document.body.style.userSelect = '';
      }
    });
  }

  // Khởi động toàn bộ ứng dụng
  function init() {
    // 1. Nạp thiết lập giao diện (Theme & Audio)
    if (window.VHDL_Store) {
      const settings = window.VHDL_Store.getSettings();
      if (settings.theme) {
        document.documentElement.setAttribute('data-theme', settings.theme);
        const themeBtn = document.getElementById('btn_toggle_theme');
        if (themeBtn) themeBtn.innerHTML = settings.theme === 'dark' ? '🌙' : '☀️';
      }
      if (settings.audio !== undefined && window.VHDL_Audio) {
        window.VHDL_Audio.setEnabled(settings.audio);
        const audioBtn = document.getElementById('btn_toggle_audio');
        if (audioBtn) audioBtn.innerHTML = settings.audio ? '🔊' : '🔇';
      }
      if (settings.sidebarCollapsed) {
        const sidebar = document.getElementById('app_sidebar');
        if (sidebar) sidebar.classList.add('collapsed');
      }
    }

    // 2. Khởi tạo Board DE2-115 ảo & Bộ vẽ dạng sóng Waveform
    const boardContainer = document.getElementById('de2_board_container');
    if (window.VHDL_DE2_Board && boardContainer) {
      window.VHDL_DE2_Board.init(boardContainer);
    }

    const wvContainer = document.getElementById('waveform_container');
    if (window.VHDL_Waveform && wvContainer) {
      window.VHDL_Waveform.init(wvContainer);
    }

    const fsmContainer = document.getElementById('fsm_container');
    if (window.VHDL_FSM && fsmContainer) {
      window.VHDL_FSM.init(fsmContainer);
    }

    // 3. Khởi tạo Split-view Resizer
    initSplitResizer();

    // 4. Khởi tạo Router và bắt sự kiện chuyển bài
    if (window.VHDL_Router) {
      window.VHDL_Router.init((lessonId) => {
        const lesson = findLessonById(lessonId);
        if (lesson) {
          renderLessonContent(lesson);
        } else {
          // Fallback về bài 0.1 nếu ID không hợp lệ
          window.VHDL_Router.navigateTo('ch0-b1');
        }
      });
    }

    // 5. Cập nhật Sidebar và Progress
    renderSidebar();
    updateProgressBar();

    // 6. Lắng nghe ô tìm kiếm
    const searchInput = document.getElementById('search_lessons_input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderSidebar(e.target.value);
      });
    }

    // 7. Đăng ký Service Worker cho PWA
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').then(() => {
        console.log('StudyVHDL Service Worker Registered (Offline Ready)');
      }).catch(err => {
        console.warn('SW registration skipped or failed:', err);
      });
    }
  }

  return {
    init,
    renderSidebar,
    toggleChapterGroup,
    toggleCompleteCurrentLesson,
    toggleExerciseBox,
    answerQuiz,
    toggleTheme,
    toggleAudio,
    toggleSidebar,
    openProgressModal,
    closeProgressModal,
    handleImportFile,
    switchSimTab,
    refreshActiveSim
  };
})();

window.VHDL_App = VHDL_App;

// Tự động khởi chạy khi DOM tải xong
document.addEventListener('DOMContentLoaded', () => {
  VHDL_App.init();
});

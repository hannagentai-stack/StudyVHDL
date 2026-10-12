// ==========================================================================
// FSM.JS - BỘ MÔ PHỎNG MÁY TRẠNG THÁI HỮU HẠN TRỰC QUAN (FSM STATE GRAPH)
// Hỗ trợ hiển thị đồ hình trạng thái Moore & Mealy, kích xung nhịp,
// thay đổi ngõ vào tương tác và xem lịch sử chuyển tiếp thời gian thực
// ==========================================================================

const VHDL_FSM = (function () {
  let containerEl = null;
  let canvas = null;
  let ctx = null;

  // Trạng thái vận hành
  let currentStateId = "S0";
  let historyLog = [];
  let isAutoRunning = false;
  let autoTimerId = null;
  let autoIntervalMs = 800;

  // Cấu hình FSM hiện tại (Mặc định: Sequence Detector 1011)
  let currentFsm = {
    title: "Bộ phát hiện chuỗi '1011' (Moore FSM)",
    type: "moore", // "moore" hoặc "mealy"
    inputs: { din: 0, rst_n: 1 },
    resetState: "S0",
    states: [
      { id: "S0", name: "S0 (Khởi tạo)", code: "000", x: 100, y: 150, mooreOut: "0" },
      { id: "S1", name: "S1 (Bắt '1')",   code: "001", x: 250, y: 80,  mooreOut: "0" },
      { id: "S2", name: "S2 (Bắt '10')",  code: "010", x: 400, y: 80,  mooreOut: "0" },
      { id: "S3", name: "S3 (Bắt '101')", code: "011", x: 550, y: 150, mooreOut: "0" },
      { id: "S4", name: "S4 (Đủ '1011')", code: "100", x: 325, y: 230, mooreOut: "1" }
    ],
    transitions: [
      // S0
      { from: "S0", to: "S1", inputVal: 1, label: "din=1", mealyOut: "0", curvature: 0.1 },
      { from: "S0", to: "S0", inputVal: 0, label: "din=0", mealyOut: "0", selfLoop: true, loopAngle: -Math.PI / 2 },
      // S1
      { from: "S1", to: "S2", inputVal: 0, label: "din=0", mealyOut: "0", curvature: 0.1 },
      { from: "S1", to: "S1", inputVal: 1, label: "din=1", mealyOut: "0", selfLoop: true, loopAngle: -Math.PI / 2 },
      // S2
      { from: "S2", to: "S3", inputVal: 1, label: "din=1", mealyOut: "0", curvature: 0.1 },
      { from: "S2", to: "S0", inputVal: 0, label: "din=0", mealyOut: "0", curvature: -0.3 },
      // S3
      { from: "S3", to: "S4", inputVal: 1, label: "din=1", mealyOut: "1", curvature: 0.1 },
      { from: "S3", to: "S2", inputVal: 0, label: "din=0", mealyOut: "0", curvature: 0.2 },
      // S4
      { from: "S4", to: "S2", inputVal: 0, label: "din=0", mealyOut: "0", curvature: -0.2 },
      { from: "S4", to: "S1", inputVal: 1, label: "din=1", mealyOut: "0", curvature: -0.2 }
    ]
  };

  // Xác định trạng thái kế tiếp (Next State) dựa trên trạng thái hiện tại và ngõ vào
  function computeNextState() {
    if (!currentFsm || !currentFsm.transitions) return currentStateId;
    if (currentFsm.inputs.rst_n === 0) return currentFsm.resetState;

    const currentTrans = currentFsm.transitions.filter(t => t.from === currentStateId);
    for (const t of currentTrans) {
      if (t.inputVal !== undefined && t.inputVal === currentFsm.inputs.din) {
        return t.to;
      }
    }
    return currentStateId;
  }

  // Lấy giá trị ngõ ra hiện tại
  function getCurrentOutput() {
    if (!currentFsm) return "0";
    if (currentFsm.type === "moore") {
      const st = currentFsm.states.find(s => s.id === currentStateId);
      return st ? st.mooreOut : "0";
    } else {
      // Mealy output
      const nextSt = computeNextState();
      const tr = currentFsm.transitions.find(t => t.from === currentStateId && t.to === nextSt);
      return tr ? tr.mealyOut : "0";
    }
  }

  // Cấp 1 xung nhịp Clock (Clock Tick)
  function clockTick() {
    const nextSt = computeNextState();
    const oldSt = currentStateId;
    currentStateId = nextSt;

    // Âm thanh phản hồi nhịp clock
    if (window.VHDL_Audio) {
      window.VHDL_Audio.playTone(660, 60, 'sine');
    }

    // Ghi nhật ký chuyển tiếp
    const logItem = `${oldSt} -> ${nextSt} (din=${currentFsm.inputs.din}, out=${getCurrentOutput()})`;
    historyLog.unshift(logItem);
    if (historyLog.length > 8) historyLog.pop();

    updateStatusDom();
    draw();
  }

  // Thiết lập lại trạng thái ban đầu (Reset)
  function resetFsm() {
    currentStateId = currentFsm.resetState || "S0";
    historyLog.unshift(`RESET -> ${currentStateId}`);
    if (historyLog.length > 8) historyLog.pop();

    if (window.VHDL_Audio) {
      window.VHDL_Audio.playTone(440, 80, 'square');
    }

    updateStatusDom();
    draw();
  }

  // Đổi giá trị ngõ vào DIN (0 <-> 1)
  function toggleInputDin() {
    if (!currentFsm.inputs) return;
    currentFsm.inputs.din = currentFsm.inputs.din === 1 ? 0 : 1;

    if (window.VHDL_Audio) {
      window.VHDL_Audio.playSwitchClick();
    }

    updateStatusDom();
    draw();
  }

  // Đổi giá trị Reset RST_N (0 <-> 1)
  function toggleReset() {
    if (!currentFsm.inputs) return;
    currentFsm.inputs.rst_n = currentFsm.inputs.rst_n === 1 ? 0 : 1;
    if (currentFsm.inputs.rst_n === 0) {
      currentStateId = currentFsm.resetState;
    }

    if (window.VHDL_Audio) {
      window.VHDL_Audio.playSwitchClick();
    }

    updateStatusDom();
    draw();
  }

  // Bật / Tắt chế độ tự động chạy nhịp Clock
  function toggleAutoRun() {
    isAutoRunning = !isAutoRunning;
    const btn = document.getElementById('fsm_btn_auto');
    if (btn) {
      btn.innerHTML = isAutoRunning ? '⏸ <span>Dừng tự động</span>' : '▶ <span>Chạy tự động</span>';
      btn.classList.toggle('running', isAutoRunning);
    }

    if (isAutoRunning) {
      autoTimerId = setInterval(() => {
        clockTick();
      }, autoIntervalMs);
    } else {
      if (autoTimerId) clearInterval(autoTimerId);
      autoTimerId = null;
    }
  }

  // Khung HTML giao diện FSM
  function renderUiHtml() {
    return `
      <div class="fsm-viewer-wrapper">
        <!-- Thanh điều khiển trên cùng -->
        <div class="fsm-toolbar">
          <div class="fsm-controls-left">
            <button class="fsm-btn" id="fsm_btn_clock" onclick="VHDL_FSM.clockTick()" title="Kích 1 cạnh lên xung Clock (rising_edge)">
              ⚡ <span>Clock Step</span>
            </button>
            <button class="fsm-btn" id="fsm_btn_auto" onclick="VHDL_FSM.toggleAutoRun()" title="Tự động phát xung Clock định kỳ">
              ▶ <span>Chạy tự động</span>
            </button>
            <button class="fsm-btn" onclick="VHDL_FSM.resetFsm()" title="Reset về trạng thái ban đầu">
              ⏮ <span>Reset FSM</span>
            </button>
          </div>

          <div class="fsm-controls-right">
            <!-- Nút kích thích ngõ vào tương tác -->
            <button class="fsm-input-toggle-btn" id="fsm_btn_toggle_din" onclick="VHDL_FSM.toggleInputDin()" title="Đổi mức logic ngõ vào DIN">
              Ngõ vào DIN: <span class="fsm-in-val" id="fsm_din_val">0</span>
            </button>
            <button class="fsm-input-toggle-btn" id="fsm_btn_toggle_rst" onclick="VHDL_FSM.toggleReset()" title="Đổi mức Reset rst_n (Active-Low)">
              rst_n: <span class="fsm-in-val" id="fsm_rst_val">1</span>
            </button>
          </div>
        </div>

        <!-- Khung vẽ Canvas Đồ hình trạng thái -->
        <div class="fsm-canvas-box" id="fsm_canvas_box">
          <canvas id="fsm_canvas" width="680" height="310"></canvas>
        </div>

        <!-- Bảng trạng thái chi tiết thời gian thực -->
        <div class="fsm-status-dock">
          <div class="fsm-status-card">
            <span class="fsm-dock-label">Trạng thái hiện tại:</span>
            <span class="fsm-dock-val highlight" id="fsm_cur_state_display">S0</span>
          </div>
          <div class="fsm-status-card">
            <span class="fsm-dock-label">Trạng thái kế tiếp:</span>
            <span class="fsm-dock-val" id="fsm_next_state_display">S0</span>
          </div>
          <div class="fsm-status-card">
            <span class="fsm-dock-label">Ngõ ra Output:</span>
            <span class="fsm-dock-val output" id="fsm_output_display">Z = 0</span>
          </div>
          <div class="fsm-status-card log-card">
            <span class="fsm-dock-label">Lịch sử chuyển tiếp:</span>
            <span class="fsm-log-text" id="fsm_history_display">Chờ xung Clock đầu tiên...</span>
          </div>
        </div>
      </div>
    `;
  }

  // Cập nhật DOM các nhãn trạng thái
  function updateStatusDom() {
    const curEl = document.getElementById('fsm_cur_state_display');
    const nextEl = document.getElementById('fsm_next_state_display');
    const outEl = document.getElementById('fsm_output_display');
    const logEl = document.getElementById('fsm_history_display');
    const dinEl = document.getElementById('fsm_din_val');
    const rstEl = document.getElementById('fsm_rst_val');

    if (curEl) curEl.textContent = currentStateId;
    if (nextEl) nextEl.textContent = computeNextState();
    if (outEl) outEl.textContent = `Z = ${getCurrentOutput()}`;
    if (logEl) logEl.textContent = historyLog.length > 0 ? historyLog[0] : 'Chờ xung Clock...';

    if (dinEl && currentFsm.inputs) {
      dinEl.textContent = currentFsm.inputs.din;
      dinEl.className = currentFsm.inputs.din === 1 ? 'fsm-in-val high' : 'fsm-in-val low';
    }
    if (rstEl && currentFsm.inputs) {
      rstEl.textContent = currentFsm.inputs.rst_n;
      rstEl.className = currentFsm.inputs.rst_n === 1 ? 'fsm-in-val high' : 'fsm-in-val low';
    }
  }

  // Khởi tạo Canvas và căn chỉnh kích thước
  function initCanvas() {
    canvas = document.getElementById('fsm_canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    const box = document.getElementById('fsm_canvas_box');
    if (box) {
      canvas.width = Math.max(620, box.clientWidth - 4);
    }
  }

  // Vẽ mũi tên có hướng giữa 2 điểm
  function drawArrowhead(ctx, fromX, fromY, toX, toY, color) {
    const headLen = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  // Vẽ toàn bộ đồ hình trạng thái (State Diagram)
  function draw() {
    if (!ctx || !canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Nền tối công nghệ
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, width, height);

    // Lưới tọa độ chấm nhỏ
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let x = 20; x < width; x += 25) {
      for (let y = 20; y < height; y += 25) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    const nextStateId = computeNextState();
    const states = currentFsm.states || [];
    const transitions = currentFsm.transitions || [];

    // 1. VẼ CÁC ĐƯỜNG CHUYỂN TIẾP (TRANSITIONS)
    transitions.forEach(tr => {
      const fromSt = states.find(s => s.id === tr.from);
      const toSt = states.find(s => s.id === tr.to);
      if (!fromSt || !toSt) return;

      const isCurrentTrans = (tr.from === currentStateId && tr.to === nextStateId && tr.inputVal === currentFsm.inputs.din);
      const strokeColor = isCurrentTrans ? '#38bdf8' : '#334155';
      const lineWidth = isCurrentTrans ? 2.5 : 1.5;

      if (tr.selfLoop) {
        // Vòng cung tự trỏ về chính nó (Self Loop)
        const loopR = 24;
        const cx = fromSt.x;
        const cy = fromSt.y - 42;

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(cx, cy, loopR, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.stroke();

        // Mũi tên đầu vào
        drawArrowhead(ctx, cx + loopR * Math.cos(1.8 * Math.PI), cy + loopR * Math.sin(1.8 * Math.PI), fromSt.x + 10, fromSt.y - 28, strokeColor);

        // Nhãn điều kiện
        ctx.fillStyle = isCurrentTrans ? '#38bdf8' : '#94a3b8';
        ctx.font = 'bold 10.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(tr.label, cx, cy - loopR - 4);
      } else {
        // Đường cong chuyển trạng thái giữa 2 bong bóng khác nhau
        const dx = toSt.x - fromSt.x;
        const dy = toSt.y - fromSt.y;
        const dist = Math.sqrt(dx * dy + dy * dy);

        // Điểm uốn cong Bezier
        const midX = (fromSt.x + toSt.x) / 2;
        const midY = (fromSt.y + toSt.y) / 2;
        const curv = tr.curvature || 0;
        const cpX = midX - dy * curv;
        const cpY = midY + dx * curv;

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(fromSt.x, fromSt.y);
        ctx.quadraticCurveTo(cpX, cpY, toSt.x, toSt.y);
        ctx.stroke();

        // Mũi tên tới toSt
        const t = 0.85; // Điểm gần đích trên đường cong Bezier
        const arrowX = (1 - t) * (1 - t) * fromSt.x + 2 * (1 - t) * t * cpX + t * t * toSt.x;
        const arrowY = (1 - t) * (1 - t) * fromSt.y + 2 * (1 - t) * t * cpY + t * t * toSt.y;
        drawArrowhead(ctx, arrowX, arrowY, toSt.x - (dx / (dist || 1)) * 26, toSt.y - (dy / (dist || 1)) * 26, strokeColor);

        // Nhãn điều kiện và ngõ ra
        ctx.fillStyle = isCurrentTrans ? '#38bdf8' : '#94a3b8';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        const labelText = tr.mealyOut && currentFsm.type === 'mealy' ? `${tr.label} / ${tr.mealyOut}` : tr.label;
        ctx.fillText(labelText, cpX, cpY - 4);
      }
    });

    // 2. VẼ CÁC BONG BÓNG TRẠNG THÁI (STATE NODES)
    states.forEach(st => {
      const isCurrent = (st.id === currentStateId);
      const isNext = (st.id === nextStateId && !isCurrent);
      const radius = 30;

      // Hào quang tỏa sáng cho Current State
      if (isCurrent) {
        ctx.save();
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(st.x, st.y, radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      // Vòng tròn thân trạng thái
      ctx.beginPath();
      ctx.arc(st.x, st.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isCurrent ? '#0c2847' : (isNext ? '#131e33' : '#0d1526');
      ctx.fill();
      ctx.strokeStyle = isCurrent ? '#38bdf8' : (isNext ? '#0284c7' : '#334155');
      ctx.lineWidth = isCurrent ? 2.5 : 1.5;
      ctx.stroke();

      // Tên trạng thái (VD: S0, S1)
      ctx.fillStyle = isCurrent ? '#ffffff' : '#e2e8f0';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(st.id, st.x, st.y - 4);

      // Đường gạch ngang phân tách (Mô hình Moore: State / Output)
      ctx.strokeStyle = isCurrent ? '#38bdf8' : '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(st.x - 20, st.y);
      ctx.lineTo(st.x + 20, st.y);
      ctx.stroke();

      // Ngõ ra Moore hoặc Mã nhị phân
      ctx.fillStyle = isCurrent ? '#38bdf8' : '#94a3b8';
      ctx.font = '9.5px monospace';
      const botText = currentFsm.type === 'moore' ? `Z=${st.mooreOut}` : st.code;
      ctx.fillText(botText, st.x, st.y + 14);

      // Mũi tên chỉ vào trạng thái ban đầu (Reset pointer)
      if (st.id === currentFsm.resetState) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(st.x - radius - 24, st.y);
        ctx.lineTo(st.x - radius, st.y);
        ctx.stroke();
        drawArrowhead(ctx, st.x - radius - 10, st.y, st.x - radius, st.y, '#ef4444');

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('RESET', st.x - radius - 14, st.y - 6);
      }
    });

    // 3. TIÊU ĐỀ VÀ CHÚ GIẢI TRÊN CANVAS
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(currentFsm.title || 'Máy Trạng Thái Hữu Hạn', 16, 24);

    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText(`Mô hình: ${currentFsm.type.toUpperCase()} | Nhịp: 50 MHz CLOCK`, 16, 40);
  }

  // Nạp cấu hình FSM tùy chỉnh
  function loadFsm(config) {
    if (!config) return;
    currentFsm = config;
    currentStateId = config.resetState || (config.states && config.states[0] ? config.states[0].id : "S0");
    historyLog = [`Đã nạp: ${config.title}`];

    if (canvas) {
      initCanvas();
      draw();
      updateStatusDom();
    }
  }

  // Tự động gắn preset FSM tương ứng với bài học hiện tại
  function attachLesson(lesson) {
    if (!lesson) return;

    if (lesson.fsmConfig) {
      loadFsm(lesson.fsmConfig);
    } else if (lesson.id === 'ch5-b1' || lesson.id === 'ch5-b2') {
      // Bài 5.1 & 5.2: Bộ phát hiện chuỗi '1011'
      loadFsm({
        title: "Bộ phát hiện chuỗi '1011' (Moore FSM)",
        type: "moore",
        inputs: { din: 0, rst_n: 1 },
        resetState: "S0",
        states: [
          { id: "S0", name: "S0", code: "000", x: 90,  y: 155, mooreOut: "0" },
          { id: "S1", name: "S1", code: "001", x: 230, y: 85,  mooreOut: "0" },
          { id: "S2", name: "S2", code: "010", x: 380, y: 85,  mooreOut: "0" },
          { id: "S3", name: "S3", code: "011", x: 530, y: 155, mooreOut: "0" },
          { id: "S4", name: "S4", code: "100", x: 310, y: 235, mooreOut: "1" }
        ],
        transitions: [
          { from: "S0", to: "S1", inputVal: 1, label: "1", mealyOut: "0", curvature: 0.1 },
          { from: "S0", to: "S0", inputVal: 0, label: "0", mealyOut: "0", selfLoop: true },
          { from: "S1", to: "S2", inputVal: 0, label: "0", mealyOut: "0", curvature: 0.1 },
          { from: "S1", to: "S1", inputVal: 1, label: "1", mealyOut: "0", selfLoop: true },
          { from: "S2", to: "S3", inputVal: 1, label: "1", mealyOut: "0", curvature: 0.1 },
          { from: "S2", to: "S0", inputVal: 0, label: "0", mealyOut: "0", curvature: -0.3 },
          { from: "S3", to: "S4", inputVal: 1, label: "1", mealyOut: "1", curvature: 0.1 },
          { from: "S3", to: "S2", inputVal: 0, label: "0", mealyOut: "0", curvature: 0.2 },
          { from: "S4", to: "S2", inputVal: 0, label: "0", mealyOut: "0", curvature: -0.2 },
          { from: "S4", to: "S1", inputVal: 1, label: "1", mealyOut: "0", curvature: -0.2 }
        ]
      });
    } else if (lesson.id === 'ch5-b4') {
      // Bài 5.4: Đèn giao thông ngã tư 4 pha
      loadFsm({
        title: "Bộ điều khiển Đèn giao thông 4 pha (Traffic Light FSM)",
        type: "moore",
        inputs: { din: 0, rst_n: 1 },
        resetState: "S_NS_G",
        states: [
          { id: "S_NS_G", name: "Bắc-Nam Xanh", code: "00", x: 120, y: 120, mooreOut: "NS:Xanh, EW:Đỏ" },
          { id: "S_NS_Y", name: "Bắc-Nam Vàng", code: "01", x: 310, y: 90,  mooreOut: "NS:Vàng, EW:Đỏ" },
          { id: "S_EW_G", name: "Đông-Tây Xanh", code: "10", x: 500, y: 120, mooreOut: "NS:Đỏ, EW:Xanh" },
          { id: "S_EW_Y", name: "Đông-Tây Vàng", code: "11", x: 310, y: 220, mooreOut: "NS:Đỏ, EW:Vàng" }
        ],
        transitions: [
          { from: "S_NS_G", to: "S_NS_Y", inputVal: 1, label: "timer=1", curvature: 0.1 },
          { from: "S_NS_G", to: "S_NS_G", inputVal: 0, label: "timer=0", selfLoop: true },
          { from: "S_NS_Y", to: "S_EW_G", inputVal: 1, label: "timer=1", curvature: 0.1 },
          { from: "S_EW_G", to: "S_EW_Y", inputVal: 1, label: "timer=1", curvature: 0.1 },
          { from: "S_EW_G", to: "S_EW_G", inputVal: 0, label: "timer=0", selfLoop: true },
          { from: "S_EW_Y", to: "S_NS_G", inputVal: 1, label: "timer=1", curvature: 0.1 }
        ]
      });
    } else if (lesson.id === 'ch5-b5') {
      // Bài 5.5: UART TX Transmitter FSM
      loadFsm({
        title: "Bộ truyền dữ liệu UART Transmitter (TX FSM)",
        type: "moore",
        inputs: { din: 1, rst_n: 1 },
        resetState: "IDLE",
        states: [
          { id: "IDLE",  name: "IDLE",  code: "00", x: 100, y: 150, mooreOut: "TX=1" },
          { id: "START", name: "START", code: "01", x: 250, y: 110, mooreOut: "TX=0" },
          { id: "DATA",  name: "DATA",  code: "10", x: 420, y: 110, mooreOut: "TX=D[i]" },
          { id: "STOP",  name: "STOP",  code: "11", x: 560, y: 150, mooreOut: "TX=1" }
        ],
        transitions: [
          { from: "IDLE",  to: "START", inputVal: 1, label: "tx_start=1", curvature: 0.1 },
          { from: "IDLE",  to: "IDLE",  inputVal: 0, label: "tx_start=0", selfLoop: true },
          { from: "START", to: "DATA",  inputVal: 1, label: "baud_tick",  curvature: 0.1 },
          { from: "DATA",  to: "DATA",  inputVal: 0, label: "bit_cnt < 7", selfLoop: true },
          { from: "DATA",  to: "STOP",  inputVal: 1, label: "bit_cnt = 7", curvature: 0.1 },
          { from: "STOP",  to: "IDLE",  inputVal: 1, label: "baud_tick",  curvature: -0.2 }
        ]
      });
    }
  }

  // Khởi tạo toàn bộ bộ mô phỏng FSM
  function init(containerElement) {
    containerEl = containerElement;
    if (containerEl) {
      containerEl.innerHTML = renderUiHtml();
      initCanvas();
      draw();
      updateStatusDom();
    }
  }

  return {
    init,
    draw,
    clockTick,
    resetFsm,
    toggleInputDin,
    toggleReset,
    toggleAutoRun,
    loadFsm,
    attachLesson
  };
})();

window.VHDL_FSM = VHDL_FSM;

// ==========================================================================
// WAVEFORM.JS - TRÌNH VẼ GIẢN ĐỒ DẠNG SÓNG XUNG NHỊP TƯƠNG TÁC (TIMING VIEWER)
// Hỗ trợ Play/Pause/Step/Reset, chỉnh tốc độ, vẽ Bus Hex và bắt cạnh xung Clock
// ==========================================================================

const VHDL_Waveform = (function () {
  let containerEl = null;
  let canvas = null;
  let ctx = null;

  // Trạng thái vận hành của bộ vẽ sóng
  let isPlaying = false;
  let animFrameId = null;
  let currentCycle = 0;       // Chu kỳ xung nhịp hiện tại
  let maxCycles = 32;         // Tổng số chu kỳ hiển thị trên màn hình
  let playSpeedMs = 400;      // Tốc độ mỗi chu kỳ (ms)
  let lastStepTime = 0;

  // Cấu hình các kênh sóng (Signals) đang được vẽ
  let currentConfig = {
    title: "Mô phỏng D Flip-Flop",
    clockPeriodNs: 20, // 50 MHz = 20 ns
    signals: [
      { name: "clk", type: "clock" },
      { name: "rst_n", type: "binary", values: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
      { name: "d", type: "binary",     values: [0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1] },
      { name: "q", type: "binary",     values: [0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0] }
    ]
  };

  // Vị trí con trỏ chuột đo thời gian
  let mouseX = -1;

  // HTML khung điều khiển và Canvas vẽ sóng
  function renderUiHtml() {
    return `
      <div class="waveform-viewer-wrapper">
        <!-- Thanh điều khiển trên cùng -->
        <div class="waveform-toolbar">
          <div class="waveform-controls-left">
            <button class="wv-btn" id="wv_btn_play_pause" onclick="VHDL_Waveform.togglePlay()" title="Phát / Tạm dừng dạng sóng">
              <span id="wv_play_icon">▶</span> <span id="wv_play_text">Play</span>
            </button>
            <button class="wv-btn" onclick="VHDL_Waveform.stepForward()" title="Nhảy tới 1 chu kỳ xung nhịp">
              ⏭ <span>Step</span>
            </button>
            <button class="wv-btn" onclick="VHDL_Waveform.resetTime()" title="Đưa thời gian về 0 ns">
              ⏮ <span>Reset</span>
            </button>
          </div>

          <div class="waveform-controls-center">
            <span class="wv-stat-label">Thời gian:</span>
            <span class="wv-stat-val" id="wv_time_display">0 ns</span>
            <span class="wv-stat-sep">|</span>
            <span class="wv-stat-label">Chu kỳ:</span>
            <span class="wv-stat-val" id="wv_cycle_display">0 / 32</span>
          </div>

          <div class="waveform-controls-right">
            <span class="wv-speed-label">Tốc độ:</span>
            <input type="range" id="wv_speed_slider" min="100" max="1000" step="50" value="400" 
                   onchange="VHDL_Waveform.setSpeed(this.value)" title="Điều chỉnh tốc độ chạy sóng">
          </div>
        </div>

        <!-- Khung vẽ Canvas dạng sóng -->
        <div class="waveform-canvas-box" id="waveform_canvas_box">
          <canvas id="waveform_canvas" width="800" height="280"></canvas>
        </div>

        <!-- Bảng chú giải tín hiệu -->
        <div class="waveform-legend-bar">
          <div class="wv-legend-item">
            <span class="wv-legend-color" style="background:#f59e0b;"></span>
            <span>Clock (Cạnh lên)</span>
          </div>
          <div class="wv-legend-item">
            <span class="wv-legend-color" style="background:#38bdf8;"></span>
            <span>Tín hiệu 1-bit</span>
          </div>
          <div class="wv-legend-item">
            <span class="wv-legend-color" style="background:#10b981;"></span>
            <span>Bus dữ liệu N-bit</span>
          </div>
          <div class="wv-legend-item">
            <span class="wv-legend-color" style="background:#ef4444;"></span>
            <span>Reset Active-Low</span>
          </div>
        </div>
      </div>
    `;
  }

  // Khởi tạo Canvas và các sự kiện chuột
  function initCanvas() {
    canvas = document.getElementById('waveform_canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    // Tự động căn chỉnh kích thước Canvas theo độ rộng khung chứa
    const box = document.getElementById('waveform_canvas_box');
    if (box) {
      canvas.width = Math.max(650, box.clientWidth - 4);
    }

    // Sự kiện di chuột đo thời gian
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      draw();
    });

    canvas.addEventListener('mouseleave', () => {
      mouseX = -1;
      draw();
    });
  }

  // Vẽ toàn bộ giản đồ dạng sóng lên Canvas
  function draw() {
    if (!ctx || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Kích thước hình học
    const labelWidth = 110;                // Độ rộng cột tên tín hiệu bên trái
    const waveWidth = width - labelWidth - 20; // Độ rộng vùng vẽ sóng
    const cycleWidth = waveWidth / maxCycles;  // Độ rộng 1 chu kỳ clock
    const signals = currentConfig.signals || [];
    const totalSignals = signals.length;
    const rowHeight = Math.max(38, Math.floor((height - 35) / Math.max(1, totalSignals)));

    // 1. Vẽ nền lưới và đường chia chu kỳ Clock
    ctx.fillStyle = '#060911';
    ctx.fillRect(0, 0, width, height);

    // Vạch chia chu kỳ dọc
    for (let c = 0; c <= maxCycles; c++) {
      const x = labelWidth + c * cycleWidth;
      ctx.strokeStyle = (c % 4 === 0) ? '#1e293b' : '#0f172a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 25);
      ctx.lineTo(x, height);
      ctx.stroke();

      // Thước đo thời gian trên đỉnh
      if (c % 2 === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        const timeNs = c * currentConfig.clockPeriodNs;
        ctx.fillText(`${timeNs}ns`, x, 18);
      }
    }

    // Đường phân cách giữa cột tên tín hiệu và vùng sóng
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(labelWidth, 0);
    ctx.lineTo(labelWidth, height);
    ctx.stroke();

    // 2. Vẽ từng kênh tín hiệu
    signals.forEach((sig, idx) => {
      const yBase = 35 + idx * rowHeight;
      const yTop = yBase + 6;
      const yBottom = yBase + rowHeight - 10;
      const yMid = (yTop + yBottom) / 2;

      // Nhãn tên tín hiệu
      ctx.fillStyle = sig.name === 'clk' ? '#f59e0b' : (sig.type === 'bus' ? '#10b981' : '#38bdf8');
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(sig.name, labelWidth - 12, yMid + 4);

      // Đường cơ sở ngầm
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(labelWidth, yBottom);
      ctx.lineTo(width, yBottom);
      ctx.stroke();

      // Vẽ dạng sóng tùy loại tín hiệu
      if (sig.type === 'clock') {
        // Tín hiệu Clock: Xung vuông chuẩn
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let c = 0; c < maxCycles; c++) {
          const x0 = labelWidth + c * cycleWidth;
          const xMid = x0 + cycleWidth / 2;
          const x1 = x0 + cycleWidth;

          if (c === 0) ctx.moveTo(x0, yBottom);
          // Cạnh lên tại x0
          ctx.lineTo(x0, yTop);
          // Mức cao từ x0 đến xMid
          ctx.lineTo(xMid, yTop);
          // Cạnh xuống tại xMid
          ctx.lineTo(xMid, yBottom);
          // Mức thấp từ xMid đến x1
          ctx.lineTo(x1, yBottom);
        }
        ctx.stroke();

        // Mũi tên đánh dấu cạnh lên (Rising Edge)
        for (let c = 0; c < maxCycles; c++) {
          const x0 = labelWidth + c * cycleWidth;
          ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.beginPath();
          ctx.moveTo(x0 - 3, yBottom - 2);
          ctx.lineTo(x0 + 3, yBottom - 2);
          ctx.lineTo(x0, yBottom - 8);
          ctx.fill();
        }

      } else if (sig.type === 'bus') {
        // Tín hiệu Bus N-bit: Vẽ dạng hình thoi chuyển mạch và giá trị Hex bên trong
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.8;
        const values = sig.values || [];

        for (let c = 0; c < maxCycles; c++) {
          const x0 = labelWidth + c * cycleWidth;
          const x1 = x0 + cycleWidth;
          const val = values[c % values.length] !== undefined ? values[c % values.length] : 0;
          const prevVal = c > 0 ? values[(c - 1) % values.length] : val;
          const isTrans = c > 0 && val !== prevVal;

          // Nền giá trị bus
          ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
          ctx.fillRect(x0 + (isTrans ? 4 : 0), yTop, cycleWidth - (isTrans ? 4 : 0), yBottom - yTop);

          ctx.beginPath();
          if (isTrans) {
            // Nút giao cắt hình thoi
            ctx.moveTo(x0, yMid);
            ctx.lineTo(x0 + 4, yTop);
            ctx.lineTo(x1 - (c < maxCycles - 1 ? 4 : 0), yTop);
            ctx.moveTo(x0, yMid);
            ctx.lineTo(x0 + 4, yBottom);
            ctx.lineTo(x1 - (c < maxCycles - 1 ? 4 : 0), yBottom);
          } else {
            ctx.moveTo(x0, yTop);
            ctx.lineTo(x1, yTop);
            ctx.moveTo(x0, yBottom);
            ctx.lineTo(x1, yBottom);
          }
          ctx.stroke();

          // Chữ hiển thị giá trị bus
          ctx.fillStyle = '#a7f3d0';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          const hexStr = typeof val === 'number' ? `0x${val.toString(16).toUpperCase()}` : String(val);
          if (cycleWidth > 24) {
            ctx.fillText(hexStr, (x0 + x1) / 2, yMid + 3.5);
          }
        }

      } else {
        // Tín hiệu nhị phân 1-bit thông thường (binary)
        const isRst = sig.name.includes('rst');
        ctx.strokeStyle = isRst ? '#ef4444' : '#38bdf8';
        ctx.lineWidth = 2;
        const values = sig.values || [];

        ctx.beginPath();
        let lastLevel = null;

        for (let c = 0; c < maxCycles; c++) {
          const x0 = labelWidth + c * cycleWidth;
          const x1 = x0 + cycleWidth;
          const val = values[c % values.length] ? 1 : 0;
          const yLevel = val === 1 ? yTop : yBottom;

          if (lastLevel === null) {
            ctx.moveTo(x0, yLevel);
          } else if (lastLevel !== yLevel) {
            ctx.lineTo(x0, yLevel); // Cạnh sườn chuyển mức
          }

          ctx.lineTo(x1, yLevel);
          lastLevel = yLevel;
        }
        ctx.stroke();
      }
    });

    // 3. Vạch chỉ thị chu kỳ hiện tại (Current Cycle Marker)
    const curX = labelWidth + currentCycle * cycleWidth;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(curX, 20);
    ctx.lineTo(curX, height);
    ctx.stroke();
    ctx.setLineDash([]); // Bỏ nét đứt

    // Điểm nhấn đầu vạch
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(curX, 22, 4, 0, Math.PI * 2);
    ctx.fill();

    // 4. Con trỏ đo thời gian chuột di chuyển qua (Measurement Cursor)
    if (mouseX >= labelWidth && mouseX <= width - 20) {
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mouseX, 0);
      ctx.lineTo(mouseX, height);
      ctx.stroke();

      // Tính mốc thời gian tại vị trí con trỏ
      const hoveredCycle = (mouseX - labelWidth) / cycleWidth;
      const hoveredTimeNs = Math.round(hoveredCycle * currentConfig.clockPeriodNs);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(mouseX - 28, 4, 56, 18);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(mouseX - 28, 4, 56, 18);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${hoveredTimeNs}ns`, mouseX, 16);
    }

    // 5. Cập nhật thông số hiển thị trên Toolbar
    const timeDisplay = document.getElementById('wv_time_display');
    if (timeDisplay) {
      timeDisplay.textContent = `${currentCycle * currentConfig.clockPeriodNs} ns`;
    }
    const cycleDisplay = document.getElementById('wv_cycle_display');
    if (cycleDisplay) {
      cycleDisplay.textContent = `${currentCycle} / ${maxCycles}`;
    }
  }

  // Bước nhảy tới 1 chu kỳ xung nhịp (Step Forward)
  function stepForward() {
    currentCycle = (currentCycle + 1) % maxCycles;
    draw();
  }

  // Đưa thời gian về 0 (Reset Time)
  function resetTime() {
    currentCycle = 0;
    draw();
  }

  // Tự động phát / Dừng (Toggle Play / Pause)
  function togglePlay() {
    isPlaying = !isPlaying;

    const btnText = document.getElementById('wv_play_text');
    const btnIcon = document.getElementById('wv_play_icon');
    const playBtn = document.getElementById('wv_btn_play_pause');

    if (isPlaying) {
      if (btnText) btnText.textContent = 'Pause';
      if (btnIcon) btnIcon.textContent = '⏸';
      if (playBtn) playBtn.classList.add('active');
      lastStepTime = performance.now();
      runAnimationLoop();
    } else {
      if (btnText) btnText.textContent = 'Play';
      if (btnIcon) btnIcon.textContent = '▶';
      if (playBtn) playBtn.classList.remove('active');
      if (animFrameId) cancelAnimationFrame(animFrameId);
    }
  }

  function runAnimationLoop(timestamp = performance.now()) {
    if (!isPlaying) return;

    if (timestamp - lastStepTime >= playSpeedMs) {
      stepForward();
      lastStepTime = timestamp;
    }

    animFrameId = requestAnimationFrame(runAnimationLoop);
  }

  function setSpeed(sliderVal) {
    // Giá trị slider từ 100 đến 1000 ms
    playSpeedMs = parseInt(sliderVal, 10);
  }

  // Nạp cấu hình dạng sóng theo từng bài học
  function loadWaveform(config) {
    if (!config) return;
    currentConfig = {
      title: config.title || "Dạng sóng thời gian",
      clockPeriodNs: config.clockPeriodNs || 20,
      signals: config.signals || []
    };
    currentCycle = 0;
    draw();
  }

  // Tự động nạp mẫu sóng tương ứng với các bài học Chương 4
  function attachLesson(lesson) {
    if (!lesson) return;

    // Nếu bài học có cấu hình waveform riêng
    if (lesson.waveformConfig) {
      loadWaveform(lesson.waveformConfig);
      return;
    }

    // Các mẫu sóng mặc định cho từng bài học kinh điển của Chương 4
    if (lesson.id === 'ch4-b1' || lesson.id === 'ch4-b2') {
      // Bài 4.1 & 4.2: D Flip-Flop
      loadWaveform({
        title: "D Flip-Flop (Reset bất đồng bộ)",
        clockPeriodNs: 20,
        signals: [
          { name: "clk", type: "clock" },
          { name: "rst_n", type: "binary", values: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
          { name: "d",     type: "binary", values: [0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0] },
          { name: "q",     type: "binary", values: [0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1] }
        ]
      });
    } else if (lesson.id === 'ch4-b3') {
      // Bài 4.3: Thanh ghi dịch (Shift Register 4-bit)
      loadWaveform({
        title: "Thanh ghi dịch 4-bit (SIPO)",
        clockPeriodNs: 20,
        signals: [
          { name: "clk", type: "clock" },
          { name: "rst_n", type: "binary", values: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
          { name: "d_in",  type: "binary", values: [0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "q_bus", type: "bus",    values: [0, 1, 2, 5, 11, 6, 12, 9, 2, 4, 8, 0, 0, 0, 0, 0] }
        ]
      });
    } else if (lesson.id === 'ch4-b4') {
      // Bài 4.4: Bộ chia xung 50 MHz sang 1 Hz
      loadWaveform({
        title: "Bộ chia xung Clock",
        clockPeriodNs: 20,
        signals: [
          { name: "clk_50m", type: "clock" },
          { name: "rst_n",   type: "binary", values: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
          { name: "count",   type: "bus",    values: [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0] },
          { name: "clk_out", type: "binary", values: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1] }
        ]
      });
    } else if (lesson.id === 'ch4-b5' || lesson.id === 'ch4-b6') {
      // Bài 4.5 & 4.6: Bộ đếm nhị phân 4-bit & BCD
      loadWaveform({
        title: "Bộ đếm nhị phân 4-bit (Counter)",
        clockPeriodNs: 20,
        signals: [
          { name: "clk", type: "clock" },
          { name: "rst_n", type: "binary", values: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
          { name: "en",    type: "binary", values: [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1] },
          { name: "count", type: "bus",    values: [0, 1, 2, 3, 4, 5, 6, 6, 6, 7, 8, 9, 10, 11, 12, 13] }
        ]
      });
    } else if (lesson.id === 'ch4-b7') {
      // Bài 4.7: Chống rung phím (Debounce)
      loadWaveform({
        title: "Chống rung phím (Key Debounce)",
        clockPeriodNs: 20,
        signals: [
          { name: "clk",       type: "clock" },
          { name: "noisy_key", type: "binary", values: [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: "clean_key", type: "binary", values: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ]
      });
    }
  }

  function init(containerElement) {
    containerEl = containerElement;
    if (containerEl) {
      containerEl.innerHTML = renderUiHtml();
      initCanvas();
      draw();
    }
  }

  return {
    init,
    draw,
    stepForward,
    resetTime,
    togglePlay,
    setSpeed,
    loadWaveform,
    attachLesson
  };
})();

window.VHDL_Waveform = VHDL_Waveform;

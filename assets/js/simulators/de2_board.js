// ==========================================================================
// DE2_BOARD.JS - MÔ PHỎNG PHẦN CỨNG KIT TERASIC DE2-115 ẢO
// 18 SW, 4 KEY, 18 LEDR, 9 LEDG, 8 BỘ LED 7 ĐOẠN HEX7..HEX0
// ==========================================================================

const VHDL_DE2_Board = (function () {
  let containerEl = null;
  let activeSimulationConfig = null;

  // Trạng thái vật lý hiện tại của các thiết bị trên kit
  const state = {
    switches: new Array(18).fill(0), // SW[17..0], 0 = DOWN, 1 = UP
    keys: new Array(4).fill(1),      // KEY[3..0], Active-Low: 1 = RELEASED, 0 = PRESSED
    ledr: new Array(18).fill(0),     // LEDR[17..0], 1 = SÁNG, 0 = TẮT
    ledg: new Array(9).fill(0),      // LEDG[8..0], 1 = SÁNG, 0 = TẮT
    hex: new Array(8).fill("1111111") // HEX7..HEX0: chuỗi 7 bit a..g (Active-Low: '0'=sáng)
  };

  // SVG cho 1 bộ hiển thị LED 7 đoạn (a, b, c, d, e, f, g)
  function createHexSvg(hexIndex) {
    return `
      <div class="hex-unit" id="hex_unit_${hexIndex}">
        <span class="hex-label">HEX${hexIndex}</span>
        <svg class="hex-svg" viewBox="0 0 60 90">
          <!-- a: ngang trên -->
          <polygon points="12,8  48,8  42,16 18,16" class="hex-segment seg-a" id="seg_${hexIndex}_a"/>
          <!-- b: dọc trên phải -->
          <polygon points="49,10 57,18 53,42 45,36" class="hex-segment seg-b" id="seg_${hexIndex}_b"/>
          <!-- c: dọc dưới phải -->
          <polygon points="44,48 52,42 48,74 40,66" class="hex-segment seg-c" id="seg_${hexIndex}_c"/>
          <!-- d: ngang dưới -->
          <polygon points="18,68 42,68 48,76 12,76" class="hex-segment seg-d" id="seg_${hexIndex}_d"/>
          <!-- e: dọc dưới trái -->
          <polygon points="8,42  16,48 12,66 4,74"  class="hex-segment seg-e" id="seg_${hexIndex}_e"/>
          <!-- f: dọc trên trái -->
          <polygon points="15,16 23,22 19,36 11,42" class="hex-segment seg-f" id="seg_${hexIndex}_f"/>
          <!-- g: ngang giữa -->
          <polygon points="16,42 44,42 41,47 19,47" class="hex-segment seg-g" id="seg_${hexIndex}_g"/>
        </svg>
      </div>
    `;
  }

  // Khởi tạo HTML toàn bộ bo mạch
  function renderBoardHtml() {
    // 8 Bộ LED 7 thanh: HEX7 đến HEX0
    let hexHtml = '';
    for (let i = 7; i >= 0; i--) {
      hexHtml += createHexSvg(i);
    }

    // 18 Đèn LED Đỏ: LEDR17 đến LEDR0
    let ledrHtml = '';
    for (let i = 17; i >= 0; i--) {
      ledrHtml += `
        <div class="led-unit" title="LEDR[${i}] - Chân FPGA: tra cứu trong Pin Planner">
          <div class="led-bulb red" id="ledr_bulb_${i}"></div>
          <span class="led-unit-label">${i}</span>
        </div>
      `;
    }

    // 9 Đèn LED Xanh: LEDG8 đến LEDG0
    let ledgHtml = '';
    for (let i = 8; i >= 0; i--) {
      ledgHtml += `
        <div class="led-unit" title="LEDG[${i}]">
          <div class="led-bulb green" id="ledg_bulb_${i}"></div>
          <span class="led-unit-label">${i}</span>
        </div>
      `;
    }

    // 18 Công tắc trượt: SW17 đến SW0
    let swHtml = '';
    for (let i = 17; i >= 0; i--) {
      swHtml += `
        <div class="switch-unit" id="sw_unit_${i}" onclick="VHDL_DE2_Board.toggleSwitch(${i})" title="SW[${i}] - Bấm để gạt LÊN/XUỐNG">
          <div class="toggle-switch-housing">
            <div class="toggle-switch-lever"></div>
          </div>
          <span class="switch-unit-label">${i}</span>
        </div>
      `;
    }

    // 4 Nút nhấn: KEY3 đến KEY0
    let keyHtml = '';
    for (let i = 3; i >= 0; i--) {
      keyHtml += `
        <div class="key-unit" id="key_unit_${i}"
             onmousedown="VHDL_DE2_Board.pressKey(${i})"
             onmouseup="VHDL_DE2_Board.releaseKey(${i})"
             onmouseleave="VHDL_DE2_Board.releaseKey(${i})"
             ontouchstart="VHDL_DE2_Board.pressKey(${i})"
             ontouchend="VHDL_DE2_Board.releaseKey(${i})"
             title="KEY[${i}] - Tích cực mức thấp (Nhấn giữ = '0')">
          <div class="tactile-btn"></div>
          <span class="key-label">KEY${i}</span>
        </div>
      `;
    }

    return `
      <div class="de2-board-chassis">
        <!-- Silkscreen Header -->
        <div class="board-silkscreen-header">
          <div class="board-model">TERASIC DE2-115 VIRTUAL BOARD</div>
          <div class="board-fpga-chip-tag">CYCLONE IV EP4CE115F29C7</div>
        </div>

        <!-- Dãy hiển thị 8 LED 7 thanh HEX7..HEX0 -->
        <div class="hex-display-bank">${hexHtml}</div>

        <!-- Dãy 9 LED Xanh LEDG8..LEDG0 -->
        <div class="led-bank-section">
          <div class="led-bank-label">
            <span>LEDG (Green LEDs - Active High)</span>
            <span style="font-size: 9px; color: #64748b;">[8 .. 0]</span>
          </div>
          <div class="led-grid-9">${ledgHtml}</div>
        </div>

        <!-- Dãy 18 LED Đỏ LEDR17..LEDR0 -->
        <div class="led-bank-section">
          <div class="led-bank-label">
            <span>LEDR (Red LEDs - Active High)</span>
            <span style="font-size: 9px; color: #64748b;">[17 .. 0]</span>
          </div>
          <div class="led-grid-18">${ledrHtml}</div>
        </div>

        <!-- Dãy 18 Công tắc trượt SW17..SW0 -->
        <div class="led-bank-section">
          <div class="led-bank-label">
            <span>SW (Slide Switches: UP='1', DOWN='0')</span>
            <span style="font-size: 9px; color: #64748b;">[17 .. 0]</span>
          </div>
          <div class="switch-grid-18">${swHtml}</div>
        </div>

        <!-- 4 Nút nhấn KEY3..KEY0 -->
        <div class="key-bank-wrapper">
          <span style="font-size: 11px; font-weight: bold; color: #94a3b8; font-family: monospace;">PUSHBUTTONS (Active-Low):</span>
          ${keyHtml}
        </div>

        <!-- Bảng trạng thái I/O thực thời -->
        <div class="board-status-monitor">
          <div class="status-chunk">
            <span class="status-label">SW[17:0]:</span>
            <span class="status-val" id="monitor_sw_hex">0x00000</span>
          </div>
          <div class="status-chunk">
            <span class="status-label">KEY[3:0]:</span>
            <span class="status-val" id="monitor_key_bin">1111</span>
          </div>
          <div class="status-chunk">
            <span class="status-label">LEDR[17:0]:</span>
            <span class="status-val" id="monitor_ledr_hex">0x00000</span>
          </div>
        </div>
      </div>
    `;
  }

  // Cập nhật giao diện phần cứng theo state
  function updateHardwareUi() {
    // 1. Cập nhật công tắc SW
    let swVal = 0;
    for (let i = 0; i < 18; i++) {
      const swEl = document.getElementById(`sw_unit_${i}`);
      if (swEl) {
        if (state.switches[i] === 1) {
          swEl.classList.add('active');
          swVal |= (1 << i);
        } else {
          swEl.classList.remove('active');
        }
      }
    }

    // 2. Cập nhật nút nhấn KEY
    let keyBinStr = '';
    for (let i = 3; i >= 0; i--) {
      const keyEl = document.getElementById(`key_unit_${i}`);
      if (keyEl) {
        if (state.keys[i] === 0) {
          keyEl.classList.add('pressed');
        } else {
          keyEl.classList.remove('pressed');
        }
      }
      keyBinStr += state.keys[i].toString();
    }

    // 3. Cập nhật LEDR
    let ledrVal = 0;
    for (let i = 0; i < 18; i++) {
      const bulb = document.getElementById(`ledr_bulb_${i}`);
      if (bulb) {
        if (state.ledr[i] === 1) {
          bulb.classList.add('on');
          ledrVal |= (1 << i);
        } else {
          bulb.classList.remove('on');
        }
      }
    }

    // 4. Cập nhật LEDG
    for (let i = 0; i < 9; i++) {
      const bulb = document.getElementById(`ledg_bulb_${i}`);
      if (bulb) {
        if (state.ledg[i] === 1) {
          bulb.classList.add('on');
        } else {
          bulb.classList.remove('on');
        }
      }
    }

    // 5. Cập nhật 8 bộ HEX7..HEX0
    // hex string dạng 7 ký tự '0'/'1', ví dụ '1000000' (thứ tự bit 6 đến 0 tương ứng g..a)
    const segNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    for (let h = 0; h < 8; h++) {
      const bitStr = state.hex[h] || "1111111";
      // Quy ước: bitStr có thể là 7 bit, bit 0 = a, bit 6 = g hoặc ngược lại
      // Để chuẩn: bitStr[6]=g, bitStr[5]=f, bitStr[4]=e, bitStr[3]=d, bitStr[2]=c, bitStr[1]=b, bitStr[0]=a
      for (let s = 0; s < 7; s++) {
        const segEl = document.getElementById(`seg_${h}_${segNames[s]}`);
        if (segEl) {
          // bit 0 = sáng nét nếu Active-Low (giá trị '0')
          // Nếu bitStr có độ dài 7:
          const isLit = bitStr[6 - s] === '0';
          if (isLit) {
            segEl.classList.add('on');
          } else {
            segEl.classList.remove('on');
          }
        }
      }
    }

    // 6. Cập nhật Monitor
    const monSw = document.getElementById('monitor_sw_hex');
    if (monSw) monSw.textContent = '0x' + swVal.toString(16).toUpperCase().padStart(5, '0');

    const monKey = document.getElementById('monitor_key_bin');
    if (monKey) monKey.textContent = keyBinStr;

    const monLedr = document.getElementById('monitor_ledr_hex');
    if (monLedr) monLedr.textContent = '0x' + ledrVal.toString(16).toUpperCase().padStart(5, '0');
  }

  // Chạy logic của bài học hiện tại (Logic Evaluator)
  function evaluateSimulation() {
    if (!activeSimulationConfig || typeof activeSimulationConfig.logicEvaluator !== 'function') {
      return;
    }

    try {
      // Chuẩn bị đầu vào cho hàm đánh giá
      const inputs = {
        SW0: state.switches[0],
        SW1: state.switches[1],
        SW2: state.switches[2],
        SW3: state.switches[3],
        SW4: state.switches[4],
        SW5: state.switches[5],
        SW6: state.switches[6],
        SW7: state.switches[7],
        SW17: state.switches[17],
        switches: [...state.switches],
        KEY0: state.keys[0],
        KEY1: state.keys[1],
        KEY2: state.keys[2],
        KEY3: state.keys[3],
        keys: [...state.keys]
      };

      const outputs = activeSimulationConfig.logicEvaluator(inputs) || {};

      // Cập nhật LEDR
      for (let i = 0; i < 18; i++) {
        if (outputs[`LEDR${i}`] !== undefined) {
          state.ledr[i] = outputs[`LEDR${i}`] ? 1 : 0;
        }
      }

      // Cập nhật LEDG
      for (let i = 0; i < 9; i++) {
        if (outputs[`LEDG${i}`] !== undefined) {
          state.ledg[i] = outputs[`LEDG${i}`] ? 1 : 0;
        }
      }

      // Cập nhật HEX
      for (let i = 0; i < 8; i++) {
        if (outputs[`HEX${i}`] !== undefined) {
          state.hex[i] = outputs[`HEX${i}`];
        }
      }

      updateHardwareUi();
    } catch (err) {
      console.error('Lỗi thực thi mô phỏng mạch logic:', err);
    }
  }

  // Tương tác gạt công tắc SW
  function toggleSwitch(idx) {
    if (idx < 0 || idx >= 18) return;
    state.switches[idx] = state.switches[idx] === 1 ? 0 : 1;

    // Phát âm thanh công tắc cơ học
    if (window.VHDL_Audio) {
      window.VHDL_Audio.playSwitchSound(state.switches[idx] === 1);
    }

    evaluateSimulation();
  }

  // Tương tác nhấn nút KEY
  function pressKey(idx) {
    if (idx < 0 || idx >= 4) return;
    if (state.keys[idx] === 0) return; // Đang nhấn giữ
    state.keys[idx] = 0; // Active-Low = '0'

    if (window.VHDL_Audio) {
      window.VHDL_Audio.playKeySound(true);
    }

    evaluateSimulation();
  }

  // Tương tác nhả nút KEY
  function releaseKey(idx) {
    if (idx < 0 || idx >= 4) return;
    if (state.keys[idx] === 1) return;
    state.keys[idx] = 1; // Nhả ra về mức '1'

    if (window.VHDL_Audio) {
      window.VHDL_Audio.playKeySound(false);
    }

    evaluateSimulation();
  }

  // Gắn kết với bài học hiện tại
  function attachLesson(lesson) {
    if (!lesson) return;
    activeSimulationConfig = lesson.interactiveSimulation || null;

    // Reset ngõ ra về trạng thái ban đầu sạch sẽ
    state.ledr.fill(0);
    state.ledg.fill(0);
    state.hex.fill("1111111");

    // Xóa toàn bộ highlight cũ
    document.querySelectorAll('.switch-unit').forEach(el => el.classList.remove('highlight-focus'));
    document.querySelectorAll('.key-unit').forEach(el => el.classList.remove('highlight-focus'));
    document.querySelectorAll('.hex-unit').forEach(el => el.classList.remove('highlight-focus'));

    // Highlight các công tắc, nút bấm hoặc HEX từ hardwareFocus & interactiveSimulation
    const focusList = [
      ...(lesson.hardwareFocus || []),
      ...(activeSimulationConfig && activeSimulationConfig.activeInputs ? activeSimulationConfig.activeInputs : [])
    ];

    focusList.forEach(item => {
      // Highlight SW[X..Y] hoặc SWX
      for (let i = 0; i < 18; i++) {
        if (item.includes(`SW[${i}]`) || item.includes(`SW${i}`) || 
           (item.includes('SW[3:0]') && i <= 3) ||
           (item.includes('SW[7:0]') && i <= 7) ||
           (item.includes('SW[7:4]') && i >= 4 && i <= 7) ||
           (item.includes('SW[17..16]') && (i === 16 || i === 17)) ||
           (item.includes('SW16') && i === 16) || (item.includes('SW17') && i === 17)) {
          const swEl = document.getElementById(`sw_unit_${i}`);
          if (swEl) swEl.classList.add('highlight-focus');
        }
      }

      // Highlight KEY[X]
      for (let k = 0; k < 4; k++) {
        if (item.includes(`KEY[${k}]`) || item.includes(`KEY${k}`)) {
          const keyEl = document.getElementById(`key_unit_${k}`);
          if (keyEl) keyEl.classList.add('highlight-focus');
        }
      }

      // Highlight HEX[X]
      for (let h = 0; h < 8; h++) {
        if (item.includes(`HEX${h}`) || item.includes(`HEX[${h}]`)) {
          const hexEl = document.getElementById(`hex_unit_${h}`);
          if (hexEl) hexEl.classList.add('highlight-focus');
        }
      }
    });

    // Đánh giá logic ngay khi nạp bài mới
    evaluateSimulation();
  }

  function init(containerElement) {
    containerEl = containerElement;
    if (containerEl) {
      containerEl.innerHTML = renderBoardHtml();
      updateHardwareUi();
    }
  }

  return {
    init,
    toggleSwitch,
    pressKey,
    releaseKey,
    attachLesson,
    evaluateSimulation
  };
})();

window.VHDL_DE2_Board = VHDL_DE2_Board;

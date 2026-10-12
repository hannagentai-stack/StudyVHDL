// ==========================================================================
// CH4_SEQUENTIAL.JS - CHƯƠNG 4: MẠCH TUẦN TỰ (7 BÀI HỌC HOÀN CHỈNH)
// ==========================================================================

window.VHDL_LESSONS_DB = window.VHDL_LESSONS_DB || {};

window.VHDL_LESSONS_DB["ch4"] = [
  // ========================================================================
  // BÀI 4.1
  // ========================================================================
  {
    id: "ch4-b1",
    chapterId: "ch4",
    order: 1,
    title: "Process, Sensitivity List và rising_edge(clk): Linh hồn mạch tuần tự",
    subtitle: "Khai mở cấu trúc tuần tự trong ngôn ngữ song song và bắt cạnh xung nhịp",
    badge: "Mạch tuần tự",
    estimatedMinutes: 25,
    hardwareFocus: ["CLOCK_50 (PIN_Y2)", "Lệnh Process"],

    objectives: [
      "Hiểu rõ bản chất của khối `process`: Vùng lập trình tuần tự (Sequential Region) nằm bên trong kiến trúc song song.",
      "Nắm vững nguyên lý danh sách nhạy (Sensitivity List): Danh sách các tín hiệu kích hoạt process thức giấc.",
      "Sử dụng thành thạo hàm bắt cạnh lên xung nhịp chuẩn IEEE: `rising_edge(clk)`.",
      "Phân biệt vị trí hợp lệ của các câu lệnh `if`, `case`, `for` (chỉ được đặt bên trong `process`)."
    ],

    theory: {
      why: "Trong thế giới thực, thời gian trôi qua theo từng nhịp tim đập. Để máy tính có thể ghi nhớ, đếm số hay chuyển từ bước này sang bước khác, nó cần một nhịp đập chỉ huy chung gọi là Xung nhịp (Clock). Câu lệnh `process` kết hợp với `rising_edge(clk)` chính là chiếc van thời gian, chỉ cho phép mạch điện cập nhật trạng thái mới tại đúng khoảnh khắc xung nhịp nhảy từ mức 0 lên mức 1.",
      how: "- **Sensitivity List (Danh sách nhạy):** Đặt trong ngoặc sau từ khóa `process(clk, rst_n)`. Khi và chỉ khi có một tín hiệu trong danh sách này thay đổi mức logic (có sự kiện Event), process mới được bộ máy mô phỏng đánh giá lại.\n- **Hàm `rising_edge(clk)`:** Trả về TRUE khi tín hiệu `clk` chuyển trạng thái từ '0' lên '1' (cạnh dương). Đây là chuẩn quốc tế bắt buộc dùng thay thế cho cú pháp cũ `clk'event and clk = '1'`.\n- **Các câu lệnh tuần tự:** Trong thân `process`, bạn được phép sử dụng `if...then...elsif...else`, `case...when`, và vòng lặp `for...loop` giống hệt như các ngôn ngữ lập trình truyền thống.",
      sections: [
        {
          heading: "1. Khung mẫu kinh điển của một Process tuần tự",
          content: "Mọi mạch tuần tự chuẩn công nghiệp đều tuân thủ cấu trúc sau:\n```vhdl\nprocess(clk, rst_n)\nbegin\n    if rst_n = '0' then\n        -- 1. Xử lý Reset bất đồng bộ\n        q <= '0';\n    elsif rising_edge(clk) then\n        -- 2. Hoạt động đồng bộ theo cạnh lên Clock\n        q <= d;\n    end if;\nend process;\n```",
          callout: {
            type: "warning",
            title: "Tại sao không dùng clk'event and clk='1'?",
            text: "Cú pháp cũ `clk'event and clk='1'` sẽ bị kích hoạt sai nếu tín hiệu chuyển từ trạng thái 'X' hoặc 'Z' lên '1'! Hàm chuẩn `rising_edge(clk)` kiểm tra nghiêm ngặt chỉ chuyển từ '0' lên '1'."
          }
        }
      ],
      truthTable: {
        headers: ["Thời điểm / Trạng thái clk", "rst_n (Active-Low)", "Ngõ vào D", "Ngõ ra Q", "Hành vi phần cứng"],
        rows: [
          ["Bất kỳ lúc nào", "'0' (Reset kích hoạt)", "X (Bất kỳ)", "'0'", "Xóa mạch về 0 ngay lập tức"],
          ["Cạnh lên (0 -> 1)", "'1' (Bình thường)", "'0'", "'0'", "Chụp giá trị D = 0 lưu vào Flip-Flop"],
          ["Cạnh lên (0 -> 1)", "'1' (Bình thường)", "'1'", "'1'", "Chụp giá trị D = 1 lưu vào Flip-Flop"],
          ["Mức tĩnh (đang là 1 hoặc 0)", "'1'", "D đổi mức", "Giữ nguyên Q cũ", "Khóa ngõ vào, duy trì trạng thái nhớ"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ bắt cạnh xung nhịp rising_edge -->
      <g transform="translate(40, 30)">
        <text x="60" y="30" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold">Xung nhịp Clock (50 MHz)</text>
        <!-- Dạng sóng Clock có highlight cạnh lên -->
        <path d="M 60,80 L 120,80 L 120,40 L 180,40 L 180,80 L 240,80 L 240,40 L 300,40 L 300,80 L 360,80" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
        <!-- Mũi tên cạnh lên -->
        <line x1="120" y1="95" x2="120" y2="45" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="120" y="115" text-anchor="middle" fill="#38bdf8" font-size="10" font-family="sans-serif">rising_edge</text>
        <line x1="240" y1="95" x2="240" y2="45" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="240" y="115" text-anchor="middle" fill="#38bdf8" font-size="10" font-family="sans-serif">rising_edge</text>

        <!-- Khối D Flip-Flop -->
        <rect x="420" y="25" width="120" height="110" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="480" y="50" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">D-FF</text>
        <text x="435" y="75" fill="#f8fafc" font-family="monospace" font-size="11">D</text>
        <text x="515" y="75" fill="#f8fafc" font-family="monospace" font-size="11">Q</text>
        <polygon points="420,95 432,100 420,105" fill="#f59e0b"/>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "process_clock_demo",
      circuitType: "sequential",
      typeExplanation: "Mạch tuần tự cơ bản: Ngõ ra Q chỉ chụp trạng thái của công tắc D tại thời điểm xuất hiện cạnh lên xung nhịp Clock.",
      code: `--------------------------------------------------------------------------------
-- Tên file: process_clock_demo.vhd
-- Minh họa khối Process và hàm rising_edge(clk)
-- Kit: Terasic DE2-115 (CLOCK_50: PIN_Y2, KEY0: PIN_M23)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity process_clock_demo is
    port (
        clk     : in  std_logic; -- Xung nhịp 50 MHz (PIN_Y2)
        rst_n   : in  std_logic; -- Nút Reset tích cực mức thấp (PIN_M23 - KEY0)
        d_in    : in  std_logic; -- Dữ liệu ngõ vào (PIN_AB28 - SW0)
        q_out   : out std_logic  -- Ngõ ra hiển thị đèn (PIN_G19 - LEDR0)
    );
end entity process_clock_demo;

architecture rtl of process_clock_demo is
    signal q_reg : std_logic := '0';
begin
    -- PROCESS MẠCH TUẦN TỰ
    -- Sensitivity list chỉ chứa: clk (xung nhịp) và rst_n (reset bất đồng bộ)
    seq_proc: process(clk, rst_n)
    begin
        -- 1. Reset bất đồng bộ: Có hiệu lực ngay lập tức không cần đợi clock
        if rst_n = '0' then
            q_reg <= '0';
        -- 2. Cạnh lên xung nhịp: Chụp ngõ vào d_in vào thanh ghi
        elsif rising_edge(clk) then
            q_reg <= d_in;
        end if;
    end process seq_proc;

    -- Đưa tín hiệu thanh ghi ra chân đèn LED
    q_out <= q_reg;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_process_clock_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench tạo xung clock 50 MHz và mô phỏng D-FF
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_process_clock_demo is
end entity tb_process_clock_demo;

architecture sim of tb_process_clock_demo is
    signal tb_clk   : std_logic := '0';
    signal tb_rst_n : std_logic := '0';
    signal tb_d     : std_logic := '0';
    signal tb_q     : std_logic;
begin
    uut: entity work.process_clock_demo
        port map ( clk => tb_clk, rst_n => tb_rst_n, d_in => tb_d, q_out => tb_q );

    -- Tạo dao động xung clock 50 MHz (chu kỳ 20 ns)
    tb_clk <= not tb_clk after 10 ns;

    -- Kịch bản kích thích
    stim: process
    begin
        -- Ban đầu Reset
        tb_rst_n <= '0'; tb_d <= '1'; wait for 30 ns;
        -- Nhả Reset tại 30 ns
        tb_rst_n <= '1'; wait for 15 ns;
        -- Đổi d = '0'
        tb_d <= '0'; wait for 20 ns;
        -- Đổi d = '1'
        tb_d <= '1'; wait for 20 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: q_out chỉ cập nhật giá trị mới của d_in tại các đường đứt nét màu cam (cạnh lên tb_clk)."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file process_clock_demo.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Mở Pin Planner gán chân: clk = PIN_Y2 (CLOCK_50), rst_n = PIN_M23 (KEY0), d_in = PIN_AB28 (SW0), q_out = PIN_G19 (LEDR0).",
        "4. Biên dịch (Ctrl+L) và nạp file .sof lên kit DE2-115."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50 (Dao động thạch anh 50 MHz)" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0 (Nút nhấn Active-Low)" },
        { signal: "d_in", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "q_out", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_AB28 -to d_in\nset_location_assignment PIN_G19 -to q_out`
    },

    commonErrors: [
      {
        error: "Đưa tín hiệu dữ liệu d_in vào Sensitivity list của process tuần tự: process(clk, rst_n, d_in)",
        cause: "Trong mạch tuần tự đồng bộ, chỉ có cạnh clock và tín hiệu reset bất đồng bộ mới có quyền kích hoạt cập nhật trạng thái.",
        fix: "Xóa d_in khỏi sensitivity list: chỉ giữ lại `process(clk, rst_n)`."
      },
      {
        error: "Viết câu lệnh if bên ngoài architecture (không nằm trong process)",
        cause: "Các câu lệnh tuần tự như if, case, for BẮT BUỘC phải nằm bên trong thân khối process.",
        fix: "Bọc các câu lệnh if vào bên trong khối process hoặc chuyển sang câu lệnh when-else."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo mạch D-FF bắt cạnh xuống (Falling Edge)",
        prompt: "Sửa hàm bắt cạnh để mạch kích hoạt theo cạnh xuống xung clock bằng hàm `falling_edge(clk)`.",
        hint: "Thay `rising_edge(clk)` bằng `falling_edge(clk)`.",
        solution: "elsif falling_edge(clk) then\n    q_reg <= d_in;\nend if;"
      },
      {
        level: "Vận dụng",
        title: "D-FF có chân Clock Enable",
        prompt: "Bổ sung chân ngõ vào `en : in std_logic` (SW1). D-FF chỉ nạp dữ liệu mới khi `en = '1'`, nếu `en = '0'` thì giữ nguyên giá trị cũ.",
        hint: "elsif rising_edge(clk) then if en = '1' then q_reg <= d_in; end if;",
        solution: "elsif rising_edge(clk) then\n    if en = '1' then\n        q_reg <= d_in;\n    end if;\nend if;"
      },
      {
        level: "Thử thách",
        title: "Tại sao không được có 2 câu lệnh rising_edge trong cùng 1 process?",
        prompt: "Nếu viết `if rising_edge(clk1) ... elsif rising_edge(clk2)...` thì Quartus sẽ báo lỗi gì và tại sao?",
        hint: "Một phần tử nhớ vật lý (Flip-Flop) chỉ có duy nhất 1 chân Clock cấp nguồn.",
        solution: "Một tế bào Flip-Flop vật lý trên silicon chỉ có đúng 1 chân CLK. Không có linh kiện phần cứng nào có thể kích hoạt đồng thời bởi 2 nguồn xung nhịp độc lập trong cùng một tầng nhớ."
      }
    ],

    quiz: [
      {
        question: "Đặc điểm cơ bản nhất của khối lệnh `process` trong VHDL là gì?",
        options: [
          "Các câu lệnh bên trong process thực thi tuần tự từ trên xuống dưới, nhưng toàn bộ process hoạt động song song với phần còn lại của mạch",
          "Process chạy chậm hơn mạch tổ hợp 1000 lần",
          "Process chỉ dùng được khi mô phỏng",
          "Process tự động sinh ra cổng AND"
        ],
        answerIndex: 0,
        explanation: "Process tạo ra một ốc đảo thực thi tuần tự (cho phép dùng if, case, biến variable), nhưng bản thân khối process lại tồn tại song song đồng thời trong kiến trúc phần cứng."
      },
      {
        question: "Trong mạch tuần tự đồng bộ có reset bất đồng bộ, danh sách nhạy (Sensitivity List) của process cần chứa những tín hiệu nào?",
        options: [
          "Chỉ chứa tín hiệu clock và tín hiệu reset bất đồng bộ",
          "Chứa tất cả các tín hiệu vào của mạch",
          "Không cần chứa tín hiệu nào",
          "Chỉ chứa các cổng ra"
        ],
        answerIndex: 0,
        explanation: "Đối với mạch tuần tự chuẩn, sensitivity list chỉ chứa đúng xung nhịp `clk` và tín hiệu `rst_n` (nếu có reset bất đồng bộ)."
      },
      {
        question: "Hàm chuẩn IEEE nào sau đây được khuyến nghị dùng để phát hiện cạnh lên của xung Clock?",
        options: [
          "rising_edge(clk)",
          "clk'event and clk = '1'",
          "clk = 1",
          "clk'rising"
        ],
        answerIndex: 0,
        explanation: "Hàm `rising_edge(clk)` là chuẩn quốc tế hiện đại, an toàn và chống lại các chuyển tiếp sai lệch từ trạng thái không xác định 'X'."
      },
      {
        question: "Chân xung nhịp chính 50 MHz (CLOCK_50) trên kit Terasic DE2-115 được kết nối với chân nào của chip Cyclone IV?",
        options: [
          "PIN_Y2",
          "PIN_AB28",
          "PIN_G19",
          "PIN_M23"
        ],
        answerIndex: 0,
        explanation: "Theo tài liệu Terasic DE2-115 User Manual: Xung thạch anh 50 MHz `CLOCK_50` nối trực tiếp vào chân `PIN_Y2` của chip FPGA EP4CE115."
      }
    ],

    summary: [
      "`process` là vùng lập trình tuần tự bên trong kiến trúc phần cứng song song.",
      "Hàm `rising_edge(clk)` là chuẩn vàng để bắt cạnh lên xung nhịp Clock 50 MHz.",
      "Sensitivity list của mạch tuần tự chuẩn chỉ chứa `clk` và `rst_n`.",
      "Các câu lệnh `if`, `case`, `for` chỉ được phép xuất hiện bên trong `process`.",
      "Trên kit DE2-115, nguồn clock thạch anh 50 MHz `CLOCK_50` nối cố định vào chân `PIN_Y2`."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "KEY0"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        // Mô phỏng D-FF: KEY0 là rst_n (0=reset)
        if (inputs.KEY0 === 0) return { LEDR0: 0 };
        return { LEDR0: inputs.SW0 ? 1 : 0 };
      }
    },

    waveformConfig: {
      title: "Mô phỏng D Flip-Flop (rising_edge)",
      clockPeriodNs: 20,
      signals: [
        { name: "clk", type: "clock" },
        { name: "rst_n", type: "binary", values: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
        { name: "d_in",  type: "binary", values: [0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0] },
        { name: "q_out", type: "binary", values: [0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1] }
      ]
    }
  },

  // ========================================================================
  // BÀI 4.2
  // ========================================================================
  {
    id: "ch4-b2",
    chapterId: "ch4",
    order: 2,
    title: "D Flip-Flop: Reset đồng bộ vs Reset bất đồng bộ",
    subtitle: "So sánh hai triết lý điều khiển thiết lập lại trạng thái mạch vi mạch số",
    badge: "Mạch tuần tự",
    estimatedMinutes: 25,
    hardwareFocus: ["D Flip-Flop", "Async vs Sync Reset"],

    objectives: [
      "Hiểu rõ bản chất phần cứng và sự khác biệt giữa Reset đồng bộ (Synchronous) và Reset bất đồng bộ (Asynchronous).",
      "Viết mã VHDL chuẩn mực cho cả hai loại Reset.",
      "Hiểu tại sao Reset bất đồng bộ có mặt trong Sensitivity List còn Reset đồng bộ thì không.",
      "Nắm vững ưu nhược điểm: Khả năng chống nhiễu của Reset đồng bộ vs Khả năng cứu vãn hệ thống tức thì của Reset bất đồng bộ."
    ],

    theory: {
      why: "Khi bạn bật nguồn máy tính hoặc một hệ thống vệ tinh ngoài không gian, các thanh ghi flip-flop có thể nhận giá trị ngẫu nhiên (0 hoặc 1 không thể đoán trước). Tín hiệu Reset có nhiệm vụ đưa toàn bộ hệ thống về một trạng thái ban đầu an toàn đã biết trước. Lựa chọn Reset đồng bộ hay bất đồng bộ là một trong những quyết định kiến trúc quan trọng nhất của kỹ sư vi mạch.",
      how: "1. **Reset bất đồng bộ (Asynchronous Reset):**\n- Ngay khi chân Reset được kích hoạt, Flip-Flop bị xóa về '0' TỨC THÌ mà KHÔNG CẦN CHỜ xung clock!\n- Trong VHDL, tín hiệu Reset BẮT BUỘC phải nằm trong Sensitivity List: `process(clk, rst_n)`.\n\n2. **Reset đồng bộ (Synchronous Reset):**\n- Dù chân Reset có kích hoạt, mạch vẫn PHẢI CHỜ ĐẾN CẠNH LÊN XUNG CLOCK TIẾP THEO mới được xóa về '0'.\n- Trong VHDL, tín hiệu Reset KHÔNG ĐƯỢC nằm trong Sensitivity List: `process(clk)`.",
      sections: [
        {
          heading: "1. So sánh code VHDL giữa 2 loại Reset",
          content: "**Reset bất đồng bộ (Khuyên dùng cho DE2-115):**\n```vhdl\nprocess(clk, rst_n) -- rst_n nằm trong sensitivity list!\nbegin\n    if rst_n = '0' then\n        q <= '0';\n    elsif rising_edge(clk) then\n        q <= d;\n    end if;\nend process;\n```\n\n**Reset đồng bộ:**\n```vhdl\nprocess(clk) -- Chỉ có clk trong sensitivity list!\nbegin\n    if rising_edge(clk) then\n        if rst = '1' then\n            q <= '0';\n        else\n            q <= d;\n        end if;\n    end if;\nend process;\n```",
          callout: {
            type: "info",
            title: "Ưu nhược điểm thực tế",
            text: "- Reset bất đồng bộ: Hoạt động ngay cả khi nguồn clock bị treo hoặc chưa sẵn sàng.\n- Reset đồng bộ: Miễn nhiễm với các xung nhiễu ngắn ngẫu nhiên xuất hiện trên đường dây reset."
          }
        }
      ],
      truthTable: {
        headers: ["Tiêu chí so sánh", "Reset bất đồng bộ (Asynchronous)", "Reset đồng bộ (Synchronous)"],
        rows: [
          ["Sensitivity List", "process(clk, rst_n)", "process(clk)"],
          ["Thời điểm tác động", "Tức thì (Zero delay, không cần clock)", "Chờ cạnh lên xung clock tiếp theo"],
          ["Cấu trúc tế bào LE", "Nối vào chân Clr/Pre chuyên dụng của FF", "Nối vào cổng AND/MUX trước ngõ vào D"],
          ["Chống nhiễu Glitch", "Kém hơn (xung nhiễu nhọn cũng làm reset)", "Rất tốt (chỉ lấy mẫu tại cạnh clock)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ phần cứng Async vs Sync Reset -->
      <g transform="translate(40, 30)">
        <!-- Async Reset: Nối trực tiếp vào chân CLR của FF -->
        <rect x="20" y="20" width="240" height="150" rx="8" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="140" y="45" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">RESET BẤT ĐỒNG BỘ (ASYNC)</text>
        <rect x="80" y="60" width="80" height="80" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="120" y="95" text-anchor="middle" fill="#fff" font-size="11">D-FF</text>
        <line x1="120" y1="160" x2="120" y2="140" stroke="#ef4444" stroke-width="2"/>
        <text x="120" y="175" text-anchor="middle" fill="#ef4444" font-size="10">CLR (Async)</text>

        <!-- Sync Reset: Nối qua cổng AND trước ngõ vào D -->
        <rect x="320" y="20" width="260" height="150" rx="8" fill="#131c31" stroke="#10b981" stroke-width="2"/>
        <text x="450" y="45" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="12" font-weight="bold">RESET ĐỒNG BỘ (SYNC)</text>
        <!-- Cổng AND cổng vào D -->
        <path d="M 360,75 L 390,75 A 25 25 0 0 1 390,115 L 360,115 Z" class="gate-body"/>
        <line x1="415" y1="95" x2="450" y2="95" class="wire"/>
        <rect x="450" y="60" width="80" height="80" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
        <text x="490" y="95" text-anchor="middle" fill="#fff" font-size="11">D-FF</text>
        <line x1="330" y1="105" x2="360" y2="105" stroke="#ef4444" stroke-width="2"/>
        <text x="320" y="110" fill="#ef4444" font-size="9">not rst</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "dff_async_vs_sync",
      circuitType: "sequential",
      typeExplanation: "So sánh trực tiếp hai ngõ ra: q_async sử dụng reset bất đồng bộ và q_sync sử dụng reset đồng bộ.",
      code: `--------------------------------------------------------------------------------
-- Tên file: dff_async_vs_sync.vhd
-- So sánh D Flip-Flop Reset bất đồng bộ vs Reset đồng bộ
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity dff_async_vs_sync is
    port (
        clk     : in  std_logic; -- 50 MHz (PIN_Y2)
        rst_n   : in  std_logic; -- KEY0 (Active-Low: 0=reset)
        d_in    : in  std_logic; -- SW0
        q_async : out std_logic; -- LEDR0 (Reset bất đồng bộ)
        q_sync  : out std_logic  -- LEDR1 (Reset đồng bộ)
    );
end entity dff_async_vs_sync;

architecture rtl of dff_async_vs_sync is
begin
    -- 1. D-FF VỚI RESET BẤT ĐỒNG BỘ (ASYNCHRONOUS RESET)
    -- rst_n nằm trong sensitivity list!
    async_proc: process(clk, rst_n)
    begin
        if rst_n = '0' then
            q_async <= '0'; -- Reset tức thì
        elsif rising_edge(clk) then
            q_async <= d_in;
        end if;
    end process async_proc;

    -- 2. D-FF VỚI RESET ĐỒNG BỘ (SYNCHRONOUS RESET)
    -- Chỉ có clk trong sensitivity list!
    sync_proc: process(clk)
    begin
        if rising_edge(clk) then
            if rst_n = '0' then
                q_sync <= '0'; -- Chỉ reset khi có cạnh lên clock!
            else
                q_sync <= d_in;
            end if;
        end if;
    end process sync_proc;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_dff_resets",
      code: `--------------------------------------------------------------------------------
-- Testbench chứng minh sự khác nhau khi kích hoạt Reset giữa 2 chu kỳ clock
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_dff_resets is
end entity tb_dff_resets;

architecture sim of tb_dff_resets is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '1';
    signal d     : std_logic := '1';
    signal qa, qs: std_logic;
begin
    uut: entity work.dff_async_vs_sync
        port map ( clk=>clk, rst_n=>rst_n, d_in=>d, q_async=>qa, q_sync=>qs );

    clk <= not clk after 10 ns;

    stim: process
    begin
        -- Ban đầu cả 2 ngõ ra đều bằng 1
        wait for 25 ns;
        -- Kích hoạt Reset ở giữa chu kỳ clock (mốc 25 ns)
        rst_n <= '0';
        -- Lúc này: qa nhảy về '0' NGAY LẬP TỨC tại 25 ns!
        -- Trong khi qs vẫn giữ nguyên '1' cho đến cạnh clock tiếp theo (30 ns)!
        wait for 20 ns;
        rst_n <= '1';
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: Tại thời điểm rst_n tụt xuống 0, qa tụt ngay lập tức, còn qs phải chờ đến cạnh xung nhịp tiếp theo."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file dff_async_vs_sync.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: clk = PIN_Y2, rst_n = PIN_M23 (KEY0), d_in = PIN_AB28 (SW0), q_async = PIN_G19 (LEDR0), q_sync = PIN_F19 (LEDR1).",
        "4. Mở Tools -> Netlist Viewers -> Technology Map Viewer để thấy chân Clr vật lý của LE."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0 (Active-Low)" },
        { signal: "d_in", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "q_async", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0 (Async Reset)" },
        { signal: "q_sync", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1 (Sync Reset)" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_AB28 -to d_in\nset_location_assignment PIN_G19 -to q_async\nset_location_assignment PIN_F19 -to q_sync`
    },

    commonErrors: [
      {
        error: "Viết Reset đồng bộ nhưng lại đưa rst_n vào Sensitivity list: process(clk, rst_n)",
        cause: "Trình biên dịch Quartus sẽ hiểu nhầm là bạn muốn tạo mạch Reset bất đồng bộ và báo lỗi cú pháp cấu trúc.",
        fix: "Reset đồng bộ chỉ được phép để `clk` trong sensitivity list: `process(clk)`."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "D-FF có chân Set bất đồng bộ",
        prompt: "Thay vì xóa về '0', viết mạch D-FF nạp giá trị '1' khi tín hiệu set_n = '0'.",
        hint: "if set_n = '0' then q <= '1';",
        solution: "if set_n = '0' then\n    q <= '1';\nelsif rising_edge(clk) then\n    q <= d;\nend if;"
      },
      {
        level: "Vận dụng",
        title: "T-FF (Toggle Flip-Flop) có Reset bất đồng bộ",
        prompt: "Thiết kế T-FF: Mỗi cạnh lên clock nếu t = '1' thì đảo trạng thái ngõ ra (q <= not q), nếu t = '0' thì giữ nguyên.",
        hint: "Dùng tín hiệu nội bộ q_reg để đảo trạng thái.",
        solution: "elsif rising_edge(clk) then\n    if t = '1' then\n        q_reg <= not q_reg;\n    end if;\nend if;"
      },
      {
        level: "Thử thách",
        title: "Khái niệm De-assertion của Reset bất đồng bộ",
        prompt: "Tại sao việc nhả nút Reset bất đồng bộ quá sát cạnh xung clock (vi phạm Recovery/Removal time) có thể gây ra hiện tượng Metastability (trạng thái nửa bền)?",
        hint: "Thời gian phục hồi Recovery time tương tự như Setup time đối với tín hiệu Reset.",
        solution: "Nếu tín hiệu Reset bất đồng bộ nhả ra ngay đúng khoảnh khắc cạnh clock xuất hiện, một số flip-flop có thể nhận diện được cạnh clock trong khi một số khác lại bị giữ lại, gây ra hiện tượng chênh lệch trạng thái và dao động điện áp nửa bền (Metastability)."
      }
    ],

    quiz: [
      {
        question: "Đặc điểm nhận diện cú pháp VHDL của một process sử dụng Reset ĐỒNG BỘ là gì?",
        options: [
          "Tín hiệu reset nằm trong sensitivity list",
          "Tín hiệu reset KHÔNG nằm trong sensitivity list, và việc kiểm tra reset được đặt sau lệnh rising_edge(clk)",
          "Bắt buộc dùng thư viện numeric_std",
          "Không có xung clock"
        ],
        answerIndex: 1,
        explanation: "Reset đồng bộ chỉ hoạt động dưới sự chỉ huy của xung clock, do đó nó không thể đánh thức process và được kiểm tra bên trong nhánh `if rising_edge(clk)`."
      },
      {
        question: "Lợi thế lớn nhất của Reset bất đồng bộ (Asynchronous Reset) là gì?",
        options: [
          "Có khả năng thiết lập lại mạch ngay lập tức ngay cả khi xung clock đang bị lỗi hoặc chưa khởi động",
          "Tiêu thụ ít năng lượng hơn",
          "Chống nhiễu tốt hơn Reset đồng bộ",
          "Dễ phân tích timing hơn"
        ],
        answerIndex: 0,
        explanation: "Reset bất đồng bộ tác động thẳng vào đường xóa vật lý của Flip-Flop, đảm bảo hệ thống luôn được đưa về trạng thái an toàn ngay cả khi nguồn dao động clock chưa chạy."
      },
      {
        question: "Trong cấu trúc tế bào Logic Element của FPGA Cyclone IV, tín hiệu Reset bất đồng bộ được nối vào đâu?",
        options: [
          "Nối vào bảng tra LUT",
          "Nối trực tiếp vào chân điều khiển Clear/Preset chuyên dụng của thanh ghi phần cứng",
          "Nối qua chân cấp nguồn",
          "Nối vào bộ nhân DSP"
        ],
        answerIndex: 1,
        explanation: "Các thanh ghi trên FPGA được tích hợp sẵn đường điều khiển Asynchronous Clear chuyên dụng kết nối với mạng lưới phân phối toàn cục (Global Signals)."
      },
      {
        question: "Tại sao Reset đồng bộ lại có khả năng chống nhiễu (Glitch filter) tốt hơn Reset bất đồng bộ?",
        options: [
          "Vì nó có bộ lọc số bên trong",
          "Vì các xung nhiễu nhọn xuất hiện giữa chu kỳ clock sẽ bị bỏ qua và không làm reset mạch",
          "Vì nó dùng điện áp cao hơn",
          "Vì nó chỉ nhận xung hình sin"
        ],
        answerIndex: 1,
        explanation: "Reset đồng bộ chỉ đọc trạng thái tại đúng thời điểm cạnh xung clock nhảy lên. Bất kỳ xung nhiễu nào xảy ra giữa hai cạnh clock đều hoàn toàn không gây ảnh hưởng."
      }
    ],

    summary: [
      "Reset bất đồng bộ tác động tức thời; Reset đồng bộ phải chờ cạnh xung clock tiếp theo.",
      "Reset bất đồng bộ: `process(clk, rst_n)`; Reset đồng bộ: `process(clk)`.",
      "FPGA Cyclone IV hỗ trợ chân Asynchronous Clear chuyên dụng trên mọi khối LE.",
      "Khi thiết kế hệ thống tin cậy cao, kỹ sư thường kết hợp Reset bất đồng bộ với bộ đồng bộ hóa nhả reset (Reset Synchronizer).",
      "Kit DE2-115 sử dụng nút KEY0 làm Reset tích cực mức thấp (`rst_n = '0'`)."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "KEY0"],
      activeOutputs: ["LEDR0", "LEDR1"],
      logicEvaluator: function(inputs) {
        // KEY0: 0=reset. Khi KEY0=0 -> LEDR0 và LEDR1 đều tắt
        if (inputs.KEY0 === 0) return { LEDR0: 0, LEDR1: 0 };
        return {
          LEDR0: inputs.SW0 ? 1 : 0,
          LEDR1: inputs.SW0 ? 1 : 0
        };
      }
    },

    waveformConfig: {
      title: "So sánh Async vs Sync Reset",
      clockPeriodNs: 20,
      signals: [
        { name: "clk",     type: "clock" },
        { name: "rst_n",   type: "binary", values: [1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
        { name: "d_in",    type: "binary", values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
        { name: "q_async", type: "binary", values: [1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
        { name: "q_sync",  type: "binary", values: [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }
      ]
    }
  },

  // ========================================================================
  // BÀI 4.3
  // ========================================================================
  {
    id: "ch4-b3",
    chapterId: "ch4",
    order: 3,
    title: "Thanh ghi dữ liệu N-bit (Register) và Thanh ghi dịch (Shift Register)",
    subtitle: "Mạch lưu trữ dữ liệu song song và chuyển đổi dữ liệu nối tiếp SIPO, PISO",
    badge: "Mạch tuần tự",
    estimatedMinutes: 25,
    hardwareFocus: ["Thanh ghi N-bit", "Shift Register"],

    objectives: [
      "Thiết kế Thanh ghi lưu trữ N-bit (Parallel Register) có chân nạp dữ liệu Load Enable.",
      "Hiểu nguyên lý hoạt động của Thanh ghi dịch (Shift Register) dịch trái và dịch phải.",
      "Phân biệt 4 chế độ chuyển đổi dữ liệu: SISO (Nối tiếp - Nối tiếp), SIPO (Nối tiếp - Song song), PISO (Song song - Nối tiếp), PIPO (Song song - Song song).",
      "Nắm vững ứng dụng của SIPO và PISO làm cầu nối cho giao thức truyền thông UART, SPI."
    ],

    theory: {
      why: "1. Trong vi xử lý, các thanh ghi như EAX, EBX dùng để lưu trữ dữ liệu tính toán giữa các chu kỳ.\n2. Khi truyền dữ liệu qua dây cáp dài (như cổng USB, cáp mạng Ethernet), ta không thể kéo 32 sợi dây điện song song vì quá tốn kém và nhiễu. Ta phải nạp song song 8-bit vào một thanh ghi rồi 'bắn' từng bit nối tiếp qua 1 sợi dây duy nhất (PISO). Ở đầu nhận, một thanh ghi dịch khác sẽ hứng từng bit một và ghép lại thành byte 8-bit hoàn chỉnh (SIPO).",
      how: "Thanh ghi dịch được tạo thành từ $N$ Flip-Flop mắc nối tiếp: Ngõ ra $Q$ của tầng trước nối thẳng vào ngõ vào $D$ của tầng sau. Mỗi khi có cạnh lên xung clock, toàn bộ dữ liệu dịch sang một vị trí:\n- Dịch trái (Shift Left): `q_reg <= q_reg(N-2 downto 0) & serial_in;`.\n- Dịch phải (Shift Right): `q_reg <= serial_in & q_reg(N-1 downto 1);`.",
      sections: [
        {
          heading: "1. 4 cấu hình chuyển đổi kinh điển của Shift Register",
          content: "- **SISO (Serial-In Serial-Out):** Dùng làm đường trễ thời gian (Delay line).\n- **SIPO (Serial-In Parallel-Out):** Nhận từng bit từ bên ngoài và xuất ra cả bus song song (Bộ thu UART Receiver).\n- **PISO (Parallel-In Serial-Out):** Nạp cả byte dữ liệu từ CPU và phát từng bit ra đường truyền (Bộ phát UART Transmitter).\n- **PIPO (Parallel-In Parallel-Out):** Thanh ghi lưu trữ đệm dữ liệu thông thường.",
          callout: {
            type: "tip",
            title: "Toán tử ghép chuỗi & thần thánh",
            text: "Trong VHDL, việc dịch bit được thực hiện cực kỳ thanh lịch bằng cách cắt lát mảng và ghép thêm bit mới bằng toán tử `&`."
          }
        }
      ],
      truthTable: {
        headers: ["Chu kỳ Clock", "Ngõ vào d_in", "Q3 (MSB)", "Q2", "Q1", "Q0 (LSB)", "Giá trị Hex q_bus"],
        rows: [
          ["0 (Reset)", "0", "0", "0", "0", "0", "0x0"],
          ["1", "1", "0", "0", "0", "1", "0x1"],
          ["2", "0", "0", "0", "1", "0", "0x2"],
          ["3", "1", "0", "1", "0", "1", "0x5"],
          ["4", "1", "1", "0", "1", "1", "0xB (Dữ liệu ban đầu đã dịch tới MSB)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ Thanh ghi dịch 4-bit SIPO -->
      <g transform="translate(20, 30)">
        <!-- FF 0 -->
        <rect x="50" y="30" width="80" height="90" rx="4" fill="#131c31" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="90" y="60" text-anchor="middle" fill="#38bdf8" font-size="11">FF 0</text>
        <line x1="10" y1="75" x2="50" y2="75" stroke="#f59e0b" stroke-width="2"/>
        <text x="5" y="70" fill="#f59e0b" font-size="10">d_in</text>
        <line x1="130" y1="75" x2="180" y2="75" stroke="#38bdf8" stroke-width="2"/>
        <line x1="90" y1="120" x2="90" y2="155" stroke="#10b981" stroke-width="2"/><text x="90" y="170" text-anchor="middle" fill="#10b981" font-size="10">Q0</text>

        <!-- FF 1 -->
        <rect x="180" y="30" width="80" height="90" rx="4" fill="#131c31" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="220" y="60" text-anchor="middle" fill="#38bdf8" font-size="11">FF 1</text>
        <line x1="260" y1="75" x2="310" y2="75" stroke="#38bdf8" stroke-width="2"/>
        <line x1="220" y1="120" x2="220" y2="155" stroke="#10b981" stroke-width="2"/><text x="220" y="170" text-anchor="middle" fill="#10b981" font-size="10">Q1</text>

        <!-- FF 2 -->
        <rect x="310" y="30" width="80" height="90" rx="4" fill="#131c31" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="350" y="60" text-anchor="middle" fill="#38bdf8" font-size="11">FF 2</text>
        <line x1="390" y1="75" x2="440" y2="75" stroke="#38bdf8" stroke-width="2"/>
        <line x1="350" y1="120" x2="350" y2="155" stroke="#10b981" stroke-width="2"/><text x="350" y="170" text-anchor="middle" fill="#10b981" font-size="10">Q2</text>

        <!-- FF 3 -->
        <rect x="440" y="30" width="80" height="90" rx="4" fill="#131c31" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="480" y="60" text-anchor="middle" fill="#38bdf8" font-size="11">FF 3</text>
        <line x1="480" y1="120" x2="480" y2="155" stroke="#10b981" stroke-width="2"/><text x="480" y="170" text-anchor="middle" fill="#10b981" font-size="10">Q3</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "shift_reg_4bit",
      circuitType: "sequential",
      typeExplanation: "Thanh ghi dịch 4-bit SIPO: Nhận bit nối tiếp từ d_in và dịch dần ra bus 4-bit q_parallel.",
      code: `--------------------------------------------------------------------------------
-- Tên file: shift_reg_4bit.vhd
-- Thanh ghi dịch 4-bit Serial-In Parallel-Out (SIPO)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity shift_reg_4bit is
    port (
        clk        : in  std_logic;                    -- Xung clock 50 MHz (PIN_Y2)
        rst_n      : in  std_logic;                    -- Reset Active-Low (PIN_M23 - KEY0)
        d_serial   : in  std_logic;                    -- Ngõ vào nối tiếp (PIN_AB28 - SW0)
        q_parallel : out std_logic_vector(3 downto 0) -- Ngõ ra song song (LEDR3..0)
    );
end entity shift_reg_4bit;

architecture rtl of shift_reg_4bit is
    signal shift_reg : std_logic_vector(3 downto 0) := "0000";
begin
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            shift_reg <= "0000";
        elsif rising_edge(clk) then
            -- Dịch trái: Đẩy các bit cũ sang trái và nạp d_serial vào vị trí LSB (bit 0)
            shift_reg <= shift_reg(2 downto 0) & d_serial;
        end if;
    end process;

    -- Xuất ra 4 đèn LED
    q_parallel <= shift_reg;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_shift_reg",
      code: `--------------------------------------------------------------------------------
-- Testbench nạp chuỗi bit 1, 0, 1, 1 vào thanh ghi dịch
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_shift_reg is
end entity tb_shift_reg;

architecture sim of tb_shift_reg is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '0';
    signal d_in  : std_logic := '0';
    signal q_out : std_logic_vector(3 downto 0);
begin
    uut: entity work.shift_reg_4bit
        port map ( clk=>clk, rst_n=>rst_n, d_serial=>d_in, q_parallel=>q_out );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 25 ns;
        rst_n <= '1';
        -- Nạp bit 1
        d_in <= '1'; wait for 20 ns;
        -- Nạp bit 0
        d_in <= '0'; wait for 20 ns;
        -- Nạp bit 1
        d_in <= '1'; wait for 20 ns;
        -- Nạp bit 1
        d_in <= '1'; wait for 20 ns;
        -- Kết quả sau 4 chu kỳ phải là "1011" (0xB)
        assert q_out = "1011" report "Lỗi dịch bit!" severity error;
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: Mỗi cạnh xung clock, các bit trong q_out sẽ lần lượt trượt sang trái."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file shift_reg_4bit.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: clk = PIN_Y2, rst_n = PIN_M23, d_serial = PIN_AB28 (SW0), q_parallel[3..0] nối LEDR[3..0].",
        "4. Biên dịch và nạp file .sof lên kit DE2-115."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "d_serial", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "q_parallel[0]", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" },
        { signal: "q_parallel[1]", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1" },
        { signal: "q_parallel[2]", pin: "PIN_E19", ioStandard: "2.5 V", note: "LEDR2" },
        { signal: "q_parallel[3]", pin: "PIN_F21", ioStandard: "2.5 V", note: "LEDR3" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_AB28 -to d_serial\nset_location_assignment PIN_G19 -to q_parallel[0]\nset_location_assignment PIN_F19 -to q_parallel[1]\nset_location_assignment PIN_E19 -to q_parallel[2]\nset_location_assignment PIN_F21 -to q_parallel[3]`
    },

    commonErrors: [
      {
        error: "Quên cắt lát độ rộng bit khi ghép chuỗi: shift_reg <= shift_reg & d_serial;",
        cause: "shift_reg có 4 bit, ghép thêm 1 bit nữa thành 5 bit gán ngược lại 4 bit sẽ bị báo lỗi lệch kích thước.",
        fix: "Bắt buộc phải cắt bỏ 1 bit cũ trước khi ghép: `shift_reg(2 downto 0) & d_serial`."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Viết lệnh dịch phải (Shift Right)",
        prompt: "Viết câu lệnh dịch phải 4-bit: nạp bit mới vào MSB (bit 3) và dịch các bit cũ sang phải.",
        hint: "shift_reg <= d_serial & shift_reg(3 downto 1);",
        solution: "shift_reg <= d_serial & shift_reg(3 downto 1);"
      },
      {
        level: "Vận dụng",
        title: "Thanh ghi đa năng nạp song song / dịch nối tiếp",
        prompt: "Thêm ngõ vào `load : in std_logic` và `p_data : in std_logic_vector(3 downto 0)`. Khi `load = '1'`, nạp thẳng p_data; khi `load = '0'`, dịch bit nối tiếp.",
        hint: "if load = '1' then shift_reg <= p_data; else shift_reg <= shift_reg(2 downto 0) & d_serial; end if;",
        solution: "if load = '1' then\n    shift_reg <= p_data;\nelse\n    shift_reg <= shift_reg(2 downto 0) & d_serial;\nend if;"
      },
      {
        level: "Thử thách",
        title: "Mạch tạo chuỗi ngẫu nhiên LFSR (Linear Feedback Shift Register)",
        prompt: "Nguyên lý tạo số giả ngẫu nhiên bằng thanh ghi dịch phản hồi tuyến tính LFSR là gì?",
        hint: "Bit nạp vào đầu vào là hàm XOR của 2 hoặc nhiều bit ở các vị trí cố định (Taps).",
        solution: "LFSR đưa kết quả XOR của một số bit ngõ ra (ví dụ q(3) xor q(2)) quay ngược trở lại làm ngõ vào nối tiếp. Mạch sẽ sinh ra chuỗi bit tuần hoàn có chu kỳ cực đại $2^N - 1$, ứng dụng rộng rãi trong mã hóa và truyền tin số."
      }
    ],

    quiz: [
      {
        question: "Cấu hình chuyển đổi nào của thanh ghi dịch được sử dụng bên trong khối nhận UART Receiver để chuyển tín hiệu dây cáp nối tiếp thành dữ liệu song song cho CPU?",
        options: [
          "SISO (Serial-In Serial-Out)",
          "SIPO (Serial-In Parallel-Out)",
          "PISO (Parallel-In Serial-Out)",
          "PIPO (Parallel-In Parallel-Out)"
        ],
        answerIndex: 1,
        explanation: "SIPO (Serial-In Parallel-Out) nhận từng bit nối tiếp từ đường truyền dây đơn và gom lại xuất ra một bus song song nhiều bit cho vi xử lý."
      },
      {
        question: "Để dịch trái một thanh ghi 8-bit và nạp bit ngõ vào din vào vị trí thấp nhất, câu lệnh VHDL nào sau đây là ĐÚNG?",
        options: [
          "reg <= reg(6 downto 0) & din;",
          "reg <= reg & din;",
          "reg <= din & reg(7 downto 1);",
          "reg <= reg sll 1;"
        ],
        answerIndex: 0,
        explanation: "Lấy 7 bit thấp `reg(6 downto 0)` ghép thêm 1 bit `din` ở đuôi sẽ tạo ra vector 8-bit mới dịch sang trái 1 vị trí."
      },
      {
        question: "Một thanh ghi 4-bit sau khi Reset về \"0000\", nếu nạp liên tiếp 4 bit '1' sau 4 chu kỳ xung clock, giá trị của thanh ghi sẽ là gì?",
        options: [
          "\"0001\"",
          "\"1111\" (0xF)",
          "\"1000\"",
          "\"0000\""
        ],
        answerIndex: 1,
        explanation: "Mỗi chu kỳ clock nạp thêm 1 bit 1, sau đúng 4 chu kỳ toàn bộ 4 tầng Flip-Flop đều được lấp đầy bởi các bit 1 -> \"1111\"."
      },
      {
        question: "Một thanh ghi dịch N tầng Flip-Flop mắc nối tiếp có thể dùng để tạo độ trễ tín hiệu bằng bao nhiêu chu kỳ xung nhịp?",
        options: [
          "N chu kỳ clock",
          "1 chu kỳ",
          "0 chu kỳ",
          "2^N chu kỳ"
        ],
        answerIndex: 0,
        explanation: "Mỗi tầng Flip-Flop tạo độ trễ đúng 1 chu kỳ clock. Chuỗi $N$ tầng nối tiếp sẽ đưa tín hiệu ngõ vào ra ngõ ra sau đúng $N$ chu kỳ clock."
      }
    ],

    summary: [
      "Thanh ghi lưu trữ N-bit (PIPO) chụp toàn bộ bus dữ liệu tại cạnh lên clock.",
      "Thanh ghi dịch kết nối ngõ ra FF này vào ngõ vào FF tiếp theo.",
      "4 chế độ chuyển đổi: SISO, SIPO (bộ thu), PISO (bộ phát), PIPO (bộ đệm).",
      "Kỹ thuật dịch bit trong VHDL: `reg <= reg(N-2 downto 0) & d_serial;`.",
      "Thanh ghi dịch là nền tảng của các chuẩn giao tiếp nối tiếp UART, SPI, I2S."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "KEY0"],
      activeOutputs: ["LEDR0", "LEDR1", "LEDR2", "LEDR3"],
      logicEvaluator: function(inputs) {
        // Mô phỏng Shift Register hiển thị 4 LED
        return {
          LEDR0: inputs.SW0 ? 1 : 0,
          LEDR1: inputs.SW0 ? 1 : 0,
          LEDR2: 0,
          LEDR3: 0
        };
      }
    },

    waveformConfig: {
      title: "Thanh ghi dịch 4-bit (SIPO)",
      clockPeriodNs: 20,
      signals: [
        { name: "clk",      type: "clock" },
        { name: "rst_n",    type: "binary", values: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
        { name: "d_serial", type: "binary", values: [0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0] },
        { name: "q_bus",    type: "bus",    values: [0, 1, 2, 5, 11, 6, 12, 9, 2, 4, 8, 0, 0, 0, 0, 0] }
      ]
    }
  },

  // ========================================================================
  // BÀI 4.4
  // ========================================================================
  {
    id: "ch4-b4",
    chapterId: "ch4",
    order: 4,
    title: "Bộ chia xung nhịp: Tạo xung 1 Hz từ nguồn 50 MHz (CLOCK_50 - PIN_Y2)",
    subtitle: "Chinh phục bài toán thời gian thực: Đếm 50 triệu nhịp dao động để tạo 1 giây chuẩn xác",
    badge: "Mạch tuần tự",
    estimatedMinutes: 30,
    hardwareFocus: ["CLOCK_50 (50 MHz)", "Bộ chia tần Clock Divider"],

    objectives: [
      "Hiểu tại sao mắt người không thể quan sát tín hiệu nhấp nháy ở tần số 50 MHz.",
      "Tính toán chính xác giá trị giới hạn bộ đếm để chia tần số từ 50 MHz xuống 1 Hz (chu kỳ 1 giây).",
      "Xác định độ rộng bus bit tối thiểu ($N = 26$ bit) để đếm tới 50,000,000.",
      "Thiết kế bộ tạo xung nhấp nháy đèn LED nhịp 1 giây chuẩn xác trên kit DE2-115."
    ],

    theory: {
      why: "Nguồn dao động thạch anh trên kit DE2-115 phát ra tần số cố định là 50 MHz (50 triệu chu kỳ mỗi giây, tức 1 chu kỳ chỉ dài 20 nano-giây). Nếu bạn nối trực tiếp xung 50 MHz ra đèn LED, đèn sẽ chớp tắt 50 triệu lần/giây. Mắt người có hiện tượng lưu ảnh nên chỉ nhìn thấy đèn sáng mờ liên tục! Muốn làm đồng hồ số đếm giây hay làm đèn chớp mắt nhìn thấy được, ta bắt buộc phải chia tần số xuống 1 Hz (1 chu kỳ = 1 giây).",
      how: "Để tạo ra một xung vuông 1 Hz có chu kỳ 1 giây (gồm 0.5 giây ở mức cao và 0.5 giây ở mức thấp):\n- Tổng số nhịp clock 50 MHz trong nửa giây (0.5s) là: $50,000,000 \\times 0.5 = 25,000,000$ nhịp.\n- Mạch sẽ dùng một bộ đếm đếm từ 0 đến $24,999,999$ (đủ 25 triệu nhịp).\n- Khi chạm mốc 24,999,999, mạch sẽ **đảo trạng thái ngõ ra** (`clk_1hz <= not clk_1hz`) và reset bộ đếm về 0.\n- Cần bao nhiêu bit cho bộ đếm? Vì $2^{25} = 33,554,432$ (chưa đủ 50 triệu), ta cần tối thiểu **26 bit** ($2^{26} = 67,108,864$).",
      sections: [
        {
          heading: "1. Công thức tính toán tổng quát",
          content: "$$\\text{Số nhịp đếm nửa chu kỳ} = \\frac{F_{in}}{2 \\times F_{out}} = \\frac{50,000,000}{2 \\times 1} = 25,000,000$$\n\nBộ đếm trong VHDL sẽ đếm từ `0` đến `24_999_999` (VHDL cho phép dùng dấu gạch dưới `_` để viết số lớn cho dễ đọc!).",
          callout: {
            type: "warning",
            title: "Tuyệt đối không dùng xung chia làm Clock cho Flip-Flop khác!",
            text: "Trong thiết kế FPGA chuyên nghiệp, KHÔNG ĐƯỢC dùng tín hiệu `clk_1hz` cắm vào chân clock của process khác (Gây lỗi Gated Clock / Lệch pha Skew). Thay vào đó, hãy tạo ra xung **Enable 1 chu kỳ** (Clock Enable Pulse)!"
          }
        }
      ],
      truthTable: {
        headers: ["Giá trị bộ đếm counter", "Trạng thái ngõ ra clk_1hz", "Thời gian thực trôi qua"],
        rows: [
          ["0 -> 24,999,999", "Mức '1' (Đèn sáng)", "0.0s -> 0.5s"],
          ["Chạm 24,999,999", "Đảo mức sang '0' (Reset đếm về 0)", "Tại đúng mốc 0.5s"],
          ["0 -> 24,999,999", "Mức '0' (Đèn tắt)", "0.5s -> 1.0s"],
          ["Chạm 24,999,999", "Đảo mức sang '1' (Reset đếm về 0)", "Đủ tròn 1.0 giây (1 chu kỳ 1 Hz hoàn tất)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ bộ chia xung 50 MHz sang 1 Hz -->
      <g transform="translate(40, 30)">
        <rect x="140" y="20" width="220" height="130" rx="8" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="250" y="50" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold">CLOCK DIVIDER</text>
        <text x="250" y="75" text-anchor="middle" fill="#94a3b8" font-size="11">Counter 26-bit (25M nhịp)</text>

        <!-- Xung 50 MHz vào -->
        <line x1="40" y1="85" x2="140" y2="85" class="wire-clk"/>
        <text x="80" y="75" text-anchor="middle" fill="#f59e0b" font-family="monospace" font-size="11">50 MHz</text>
        <text x="80" y="105" text-anchor="middle" fill="#94a3b8" font-size="9">PIN_Y2</text>

        <!-- Xung 1 Hz ra -->
        <line x1="360" y1="85" x2="480" y2="85" class="wire"/>
        <text x="420" y="75" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="11">1 Hz (1 Giây)</text>

        <!-- Đèn LED nhấp nháy -->
        <circle cx="510" cy="85" r="14" fill="#ff2b44" filter="drop-shadow(0 0 10px #ff2b44)"/>
        <text x="510" y="125" text-anchor="middle" fill="#f8fafc" font-size="11">LEDR0</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "clk_divider_1hz",
      circuitType: "sequential",
      typeExplanation: "Bộ chia tần số sử dụng bộ đếm 26-bit: Chia xung 50 MHz từ thạch anh thành xung nhịp 1 Hz chớp tắt đèn LED mỗi giây.",
      code: `--------------------------------------------------------------------------------
-- Tên file: clk_divider_1hz.vhd
-- Tạo xung 1 Hz từ nguồn dao động thạch anh 50 MHz trên kit DE2-115
-- Chip: Cyclone IV E EP4CE115F29C7 (PIN_Y2 nối CLOCK_50)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity clk_divider_1hz is
    port (
        clk_50m : in  std_logic; -- Xung thạch anh 50 MHz (PIN_Y2)
        rst_n   : in  std_logic; -- Nút Reset KEY0 (PIN_M23)
        led_1hz : out std_logic  -- Đèn chớp tắt chu kỳ 1 giây (PIN_G19 - LEDR0)
    );
end entity clk_divider_1hz;

architecture rtl of clk_divider_1hz is
    -- 50,000,000 / 2 = 25,000,000 nhịp cho nửa chu kỳ 0.5s
    constant HALF_PERIOD_TICKS : integer := 25000000;
    
    -- Bộ đếm 26-bit (chứa được giá trị lên tới 67 triệu)
    signal counter : unsigned(25 downto 0) := (others => '0');
    signal clk_reg : std_logic := '0';
begin
    process(clk_50m, rst_n)
    begin
        if rst_n = '0' then
            counter <= (others => '0');
            clk_reg <= '0';
        elsif rising_edge(clk_50m) then
            -- Kiểm tra khi đếm đủ 25 triệu nhịp
            if counter = HALF_PERIOD_TICKS - 1 then
                counter <= (others => '0'); -- Reset bộ đếm về 0
                clk_reg <= not clk_reg;     -- Đảo trạng thái đèn LED
            else
                counter <= counter + 1;     -- Tăng bộ đếm
            end if;
        end if;
    end process;

    -- Xuất ra chân đèn LED
    led_1hz <= clk_reg;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_clk_divider",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra bộ chia xung (rút ngắn giới hạn đếm để mô phỏng nhanh)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_clk_divider is
end entity tb_clk_divider;

architecture sim of tb_clk_divider is
    signal clk : std_logic := '0';
    signal rst : std_logic := '0';
    signal led : std_logic;
begin
    uut: entity work.clk_divider_1hz
        port map ( clk_50m=>clk, rst_n=>rst, led_1hz=>led );

    -- Tạo xung clock chu kỳ 20 ns
    clk <= not clk after 10 ns;

    stim: process
    begin
        rst <= '0'; wait for 40 ns;
        rst <= '1';
        -- Để mô phỏng thấy sóng đổi mức, trong testbench ta chạy đủ chu kỳ
        wait for 200 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Khi mô phỏng thực tế trên ModelSim, có thể tạm thời giảm hằng số HALF_PERIOD_TICKS xuống 5 hoặc 10 để quan sát sóng đảo mức nhanh hơn."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file clk_divider_1hz.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: clk_50m = PIN_Y2, rst_n = PIN_M23, led_1hz = PIN_G19.",
        "4. Biên dịch toàn bộ (Ctrl+L) và nạp file .sof lên kit DE2-115.",
        "5. Quan sát trên kit thật: Đèn LEDR0 sẽ nhấp nháy đều đặn đúng 1 giây sáng, 1 giây tắt!"
      ],
      pinAssignments: [
        { signal: "clk_50m", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50 (50 MHz thạch anh)" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "led_1hz", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0 (Chớp tắt nhịp 1s)" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk_50m\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_G19 -to led_1hz`
    },

    commonErrors: [
      {
        error: "Quên trừ 1 ở điều kiện đếm: if counter = 25000000",
        cause: "Vì bộ đếm bắt đầu từ số 0, nên đếm từ 0 đến N-1 mới đủ đúng N chu kỳ.",
        fix: "Luôn viết `counter = HALF_PERIOD_TICKS - 1`."
      },
      {
        error: "Khai báo độ rộng bit của counter quá nhỏ (ví dụ unsigned(15 downto 0))",
        cause: "16 bit chỉ đếm tối đa tới 65,535, không thể đếm tới 25 triệu -> tràn số liên tục làm đèn nhấp nháy sai tần số.",
        fix: "Cần tối thiểu 26 bit: `unsigned(25 downto 0)`."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo xung 2 Hz (Chớp tắt nhanh gấp đôi)",
        prompt: "Tính toán lại hằng số HALF_PERIOD_TICKS để tạo xung 2 Hz (chu kỳ 0.5 giây).",
        hint: "HALF_PERIOD_TICKS = 50,000,000 / (2 x 2) = 12,500,000.",
        solution: "constant HALF_PERIOD_TICKS : integer := 12500000;"
      },
      {
        level: "Vận dụng",
        title: "Tạo xung 1 kHz làm âm thanh còi Buzzer",
        prompt: "Tính số nhịp để tạo xung 1,000 Hz đưa ra còi báo động trên chân GPIO.",
        hint: "50,000,000 / (2 x 1000) = 25,000 nhịp.",
        solution: "constant HALF_PERIOD_TICKS : integer := 25000; -- Chỉ cần 15 bit đếm!"
      },
      {
        level: "Thử thách",
        title: "Kỹ thuật Clock Enable Pulse vs Gated Clock",
        prompt: "Tại sao thay vì tạo ra tín hiệu clock phụ `clk_1hz`, thiết kế chuẩn công nghiệp lại tạo ra một xung `tick_1hz` chỉ kéo dài đúng 1 chu kỳ clock 50 MHz?",
        hint: "Giữ cho toàn bộ chip chạy trên duy nhất 1 mạng lưới cây xung nhịp Global Clock Network.",
        solution: "Dùng chung 1 nguồn Clock 50 MHz duy nhất và điều khiển bằng cờ Enable giúp tránh hoàn toàn hiện tượng lệch pha (Clock Skew), đảm bảo timing closure và tuân thủ nghiêm ngặt chuẩn thiết kế đồng bộ (Synchronous Design Methodology)."
      }
    ],

    quiz: [
      {
        question: "Với nguồn dao động thạch anh 50 MHz trên kit DE2-115, một chu kỳ xung nhịp có thời gian kéo dài bao lâu?",
        options: [
          "20 nano-giây (ns)",
          "50 nano-giây (ns)",
          "1 mili-giây (ms)",
          "20 micro-giây (us)"
        ],
        answerIndex: 0,
        explanation: "Chu kỳ $T = \\frac{1}{F} = \\frac{1}{50 \\times 10^6 \\text{ Hz}} = 0.02 \\times 10^{-6} \\text{ s} = 20 \\text{ ns}$."
      },
      {
        question: "Để đếm được giá trị cực đại là 25,000,000 nhịp, vector đếm unsigned cần có độ rộng tối thiểu là bao nhiêu bit?",
        options: [
          "16 bit",
          "24 bit",
          "25 bit (vì 2^25 = 33,554,432 > 25,000,000)",
          "32 bit"
        ],
        answerIndex: 2,
        explanation: "$2^{24} = 16,777,216$ (chưa đủ 25 triệu), $2^{25} = 33,554,432$ (đã đủ lớn hơn 25 triệu). Do đó cần tối thiểu 25 bit (hoặc dùng 26 bit cho cả 50 triệu)."
      },
      {
        question: "Tại sao bộ đếm trong VHDL lại so sánh với giá trị `HALF_PERIOD_TICKS - 1` thay vì `HALF_PERIOD_TICKS`?",
        options: [
          "Vì thạch anh bị sai số",
          "Vì bộ đếm bắt đầu đếm từ giá trị 0, nên từ 0 đến N-1 có đúng N trạng thái",
          "Để tiết kiệm điện",
          "Do quy định của ngôn ngữ C"
        ],
        answerIndex: 1,
        explanation: "Khi đếm từ 0, chuỗi 0, 1, 2, ..., N-1 có tổng cộng đúng N chu kỳ nhịp."
      },
      {
        question: "Dấu gạch dưới `_` trong hằng số `25_000_000` của VHDL có ý nghĩa gì?",
        options: [
          "Báo lỗi cú pháp",
          "Là ký tự phân cách trực quan giúp con người dễ đọc số lớn, trình biên dịch tự động bỏ qua",
          "Chia số đó cho 10",
          "Đổi số sang hệ Hex"
        ],
        answerIndex: 1,
        explanation: "Chuẩn VHDL cho phép chèn dấu gạch dưới vào giữa các chữ số để dễ đọc (giống dấu phẩy phân cách hàng ngàn), trình biên dịch hoàn toàn bỏ qua ký tự này."
      }
    ],

    summary: [
      "Xung 50 MHz có chu kỳ 20 ns, quá nhanh để mắt người có thể quan sát trực tiếp.",
      "Để tạo xung 1 Hz (chu kỳ 1s), cần đếm 25 triệu nhịp cho nửa chu kỳ (0.5s sáng, 0.5s tắt).",
      "Bộ đếm cần tối thiểu 25-26 bit để chứa được con số 25,000,000.",
      "Luôn so sánh với `N - 1` vì bộ đếm xuất phát từ số 0.",
      "Bộ chia xung là trái tim của mọi ứng dụng đồng hồ số, đo thời gian thực và quét LED."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["KEY0"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        // Mô phỏng chớp tắt đèn 1Hz khi không bị Reset
        return {
          LEDR0: inputs.KEY0 === 0 ? 0 : 1
        };
      }
    },

    waveformConfig: {
      title: "Bộ chia xung Clock 50 MHz sang 1 Hz",
      clockPeriodNs: 20,
      signals: [
        { name: "clk_50m", type: "clock" },
        { name: "rst_n",   type: "binary", values: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
        { name: "count",   type: "bus",    values: [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0] },
        { name: "led_1hz", type: "binary", values: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1] }
      ]
    }
  },

  // ========================================================================
  // BÀI 4.5
  // ========================================================================
  {
    id: "ch4-b5",
    chapterId: "ch4",
    order: 5,
    title: "Bộ đếm nhị phân (Binary Counter) lên/xuống có Enable và Reset",
    subtitle: "Thiết kế bộ đếm đa năng hiển thị giá trị nhị phân ra LEDR và HEX",
    badge: "Mạch tuần tự",
    estimatedMinutes: 25,
    hardwareFocus: ["Binary Counter 4-bit", "Enable & Direction"],

    objectives: [
      "Thiết kế Bộ đếm nhị phân 4-bit (0 đến 15) có đầy đủ các tính năng công nghiệp: Reset, Enable, Up/Down.",
      "Hiểu cách xử lý tràn tự nhiên của kiểu dữ liệu `unsigned` (từ 15 nhảy về 0 khi đếm lên, từ 0 nhảy về 15 khi đếm xuống).",
      "Kết hợp bộ đếm với bộ chia xung nhịp để tốc độ đếm phù hợp với mắt người quan sát.",
      "Hiển thị giá trị đếm đồng thời ra 4 đèn LED đỏ và bộ LED 7 thanh HEX0."
    ],

    theory: {
      why: "Bộ đếm là một trong những khối mạch tuần tự phổ biến nhất trong thiết kế số: đếm sản phẩm trên băng chuyền, đếm số gói tin mạng, đếm địa chỉ bộ nhớ PC (Program Counter) trong CPU. Một bộ đếm hoàn chỉnh cần có khả năng tạm dừng (Enable), đổi hướng đếm lên hoặc xuống (Up/Down) và xóa về 0 bất cứ lúc nào (Reset).",
      how: "Mỗi khi có cạnh lên xung clock:\n- Nếu `rst_n = '0'`: Xóa biến đếm về 0.\n- Nếu `enable = '1'`:\n  - Nếu `up_down = '1'`: Tăng biến đếm `count <= count + 1`.\n  - Nếu `up_down = '0'`: Giảm biến đếm `count <= count - 1`.\n- Nếu `enable = '0'`: Giữ nguyên giá trị cũ.\n\nNhờ kiểu dữ liệu `unsigned(3 downto 0)`, khi đếm tới `1111` (15) và cộng thêm 1, phần cứng sẽ tự động tràn về `0000` (0) mà không cần viết thêm điều kiện phức tạp!",
      sections: [
        {
          heading: "1. Tích hợp hiển thị LED 7 thanh",
          content: "Để hiển thị giá trị đếm lên màn hình, ta nối 4 bit ngõ ra của bộ đếm vào khối giải mã `hex_to_7seg` (đã học ở Bài 3.3). Như vậy, bạn vừa thấy số nhị phân chạy trên LEDR[3:0], vừa thấy chữ số Hex chạy từ 0 đến F trên HEX0!",
          callout: {
            type: "info",
            title: "Tái sử dụng mạch",
            text: "Đây là ví dụ điển hình của việc kết hợp mạch tuần tự (bộ đếm) với mạch tổ hợp (bộ giải mã 7 thanh) trong một thiết kế vi mạch hoàn chỉnh."
          }
        }
      ],
      truthTable: {
        headers: ["rst_n", "enable", "up_down", "Hành vi của bộ đếm"],
        rows: [
          ["'0'", "X", "X", "Reset ngay lập tức về 0"],
          ["'1'", "'0'", "X", "Tạm dừng đếm, giữ nguyên giá trị hiện tại"],
          ["'1'", "'1'", "'1'", "Đếm lên: 0 -> 1 -> 2 -> ... -> 15 -> 0"],
          ["'1'", "'1'", "'0'", "Đếm xuống: 15 -> 14 -> ... -> 0 -> 15"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ Binary Counter 4-bit -->
      <g transform="translate(60, 30)">
        <rect x="120" y="20" width="220" height="140" rx="8" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="230" y="50" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold">4-BIT UP/DOWN COUNTER</text>

        <!-- Các ngõ vào điều khiển -->
        <line x1="40" y1="50" x2="120" y2="50" class="wire-clk"/><text x="80" y="42" fill="#f59e0b" font-size="10">clk (50M)</text>
        <line x1="40" y1="80" x2="120" y2="80" class="wire"/><text x="80" y="72" fill="#ef4444" font-size="10">rst_n</text>
        <line x1="40" y1="110" x2="120" y2="110" class="wire"/><text x="80" y="102" fill="#38bdf8" font-size="10">enable (SW0)</text>
        <line x1="40" y1="140" x2="120" y2="140" class="wire"/><text x="80" y="132" fill="#38bdf8" font-size="10">up_down (SW1)</text>

        <!-- Ngõ ra đếm 4-bit -->
        <line x1="340" y1="90" x2="450" y2="90" class="wire-bus"/>
        <text x="390" y="80" fill="#10b981" font-family="monospace" font-size="11">count[3:0]</text>
        <rect x="450" y="65" width="90" height="50" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
        <text x="495" y="95" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="12">LEDR[3:0]</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "binary_counter_4bit",
      circuitType: "sequential",
      typeExplanation: "Bộ đếm nhị phân 4-bit đồng bộ có đầy đủ chân Reset bất đồng bộ, chân Enable tạm dừng và chân Up/Down đổi hướng.",
      code: `--------------------------------------------------------------------------------
-- Tên file: binary_counter_4bit.vhd
-- Bộ đếm nhị phân 4-bit có Enable và Up/Down
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity binary_counter_4bit is
    port (
        clk       : in  std_logic;                    -- Xung clock (PIN_Y2)
        rst_n     : in  std_logic;                    -- Reset Active-Low (KEY0)
        enable    : in  std_logic;                    -- Kích hoạt đếm (SW0)
        up_down   : in  std_logic;                    -- Hướng đếm: 1=Lên, 0=Xuống (SW1)
        count_out : out std_logic_vector(3 downto 0)  -- Giá trị đếm xuất ra LEDR[3..0]
    );
end entity binary_counter_4bit;

architecture rtl of binary_counter_4bit is
    signal count_reg : unsigned(3 downto 0) := (others => '0');
begin
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            count_reg <= (others => '0');
        elsif rising_edge(clk) then
            if enable = '1' then
                if up_down = '1' then
                    count_reg <= count_reg + 1; -- Đếm lên
                else
                    count_reg <= count_reg - 1; -- Đếm xuống
                end if;
            end if;
            -- Nếu enable = '0', giữ nguyên giá trị cũ
        end if;
    end process;

    -- Xuất ra cổng ngoài
    count_out <= std_logic_vector(count_reg);
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_binary_counter",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra đếm lên, tạm dừng và đếm xuống
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_binary_counter is
end entity tb_binary_counter;

architecture sim of tb_binary_counter is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '0';
    signal en    : std_logic := '1';
    signal ud    : std_logic := '1';
    signal cnt   : std_logic_vector(3 downto 0);
begin
    uut: entity work.binary_counter_4bit
        port map ( clk=>clk, rst_n=>rst_n, enable=>en, up_down=>ud, count_out=>cnt );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 25 ns;
        rst_n <= '1';
        -- Đếm lên 4 chu kỳ
        wait for 80 ns;
        -- Tạm dừng đếm
        en <= '0'; wait for 40 ns;
        -- Đếm xuống
        en <= '1'; ud <= '0'; wait for 80 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: Đổi Radix của cnt sang Unsigned để thấy giá trị tăng dần 0, 1, 2, 3... dừng lại, sau đó giảm dần 3, 2, 1, 0."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file binary_counter_4bit.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: clk = PIN_Y2, rst_n = PIN_M23, enable = PIN_AB28 (SW0), up_down = PIN_AC28 (SW1), count_out[3..0] nối LEDR[3..0].",
        "4. Biên dịch và nạp file .sof lên kit DE2-115."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "enable", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "up_down", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1" },
        { signal: "count_out[0]", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" },
        { signal: "count_out[1]", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1" },
        { signal: "count_out[2]", pin: "PIN_E19", ioStandard: "2.5 V", note: "LEDR2" },
        { signal: "count_out[3]", pin: "PIN_F21", ioStandard: "2.5 V", note: "LEDR3" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_AB28 -to enable\nset_location_assignment PIN_AC28 -to up_down\nset_location_assignment PIN_G19 -to count_out[0]\nset_location_assignment PIN_F19 -to count_out[1]\nset_location_assignment PIN_E19 -to count_out[2]\nset_location_assignment PIN_F21 -to count_out[3]`
    },

    commonErrors: [
      {
        error: "Quên kiểm tra chân enable khiến bộ đếm chạy liên tục không thể tạm dừng",
        cause: "Đặt phép cộng ngoài điều kiện kiểm tra enable.",
        fix: "Luôn bọc `count_reg <= count_reg + 1` bên trong `if enable = '1'`."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Bộ đếm giới hạn Modulo 10 (Đếm từ 0 đến 9)",
        prompt: "Sửa bộ đếm để khi đếm tới 9, chu kỳ tiếp theo tự động quay về 0.",
        hint: "if count_reg = 9 then count_reg <= (others => '0'); else count_reg <= count_reg + 1; end if;",
        solution: "if count_reg = 9 then\n    count_reg <= (others => '0');\nelse\n    count_reg <= count_reg + 1;\nend if;"
      },
      {
        level: "Vận dụng",
        title: "Tích hợp hiển thị HEX0",
        prompt: "Nối ngõ ra count_out của bộ đếm vào module giải mã 7 thanh để hiển thị số Hex trực tiếp trên HEX0.",
        hint: "Dùng with-select giải mã count_reg ra hex0.",
        solution: "with count_reg select\n  hex0 <= \"1000000\" when \"0000\", ... \"1111111\" when others;"
      },
      {
        level: "Thử thách",
        title: "Bộ đếm Grey Code 4-bit",
        prompt: "Tại sao trong giao tiếp bất đồng bộ qua nhiều miền xung clock (Clock Domain Crossing - CDC), người ta lại dùng bộ đếm mã Gray thay cho bộ đếm nhị phân thông thường?",
        hint: "Mã Gray chỉ thay đổi duy nhất 1 bit giữa hai trạng thái liên tiếp.",
        solution: "Bộ đếm nhị phân có thể đổi nhiều bit cùng lúc (ví dụ từ 0111 sang 1000 đổi cả 4 bit), nếu mạch lấy mẫu tại thời điểm chuyển tiếp sẽ bị dính giá trị sai lệch tạm thời. Bộ đếm mã Gray chỉ đổi đúng 1 bit duy nhất, loại bỏ hoàn toàn nguy cơ sinh lỗi chập chờn khi chuyển miền xung clock."
      }
    ],

    quiz: [
      {
        question: "Điều gì sẽ xảy ra khi một biến đếm kiểu unsigned(3 downto 0) đang có giá trị 15 (\"1111\") và tiếp tục được cộng thêm 1?",
        options: [
          "Báo lỗi tràn số và dừng hoạt động",
          "Tự động tràn vòng về giá trị 0 (\"0000\")",
          "Giữ nguyên giá trị 15",
          "Cháy thanh ghi"
        ],
        answerIndex: 1,
        explanation: "Trong toán học số học modulo của phần cứng, kiểu unsigned tự động quay vòng (wrap-around) về 0 khi vượt quá dải giá trị cực đại $2^N - 1$."
      },
      {
        question: "Tín hiệu Enable trong bộ đếm tuần tự có tác dụng gì?",
        options: [
          "Tăng tốc độ xung clock lên gấp đôi",
          "Cho phép bộ đếm nhảy số khi ở mức 1, và tạm dừng giữ nguyên giá trị khi ở mức 0",
          "Xóa bộ đếm về 0",
          "Đổi chiều xung clock"
        ],
        answerIndex: 1,
        explanation: "Enable hoạt động như một công tắc kích hoạt: Khi Enable = '1' bộ đếm cập nhật giá trị mới, khi Enable = '0' bộ đếm duy trì trạng thái hiện tại."
      },
      {
        question: "Để đếm từ 0 đến 15 (16 trạng thái), cần tối thiểu bao nhiêu tế bào nhớ Flip-Flop?",
        options: [
          "2 Flip-Flop",
          "4 Flip-Flop (vì 2^4 = 16)",
          "8 Flip-Flop",
          "16 Flip-Flop"
        ],
        answerIndex: 1,
        explanation: "Mỗi Flip-Flop lưu được 1 bit. Với $N = 4$ Flip-Flop, ta có $2^4 = 16$ tổ hợp trạng thái đếm từ 0 đến 15."
      },
      {
        question: "Cú pháp `count_reg <= (others => '0');` có ý nghĩa là gì trong VHDL?",
        options: [
          "Gán tất cả các bit của vector count_reg bằng '0' bất kể độ rộng bao nhiêu bit",
          "Chỉ gán bit ngoài cùng bằng 0",
          "Xóa tên biến",
          "Báo lỗi cú pháp"
        ],
        answerIndex: 0,
        explanation: "Mệnh đề `(others => '0')` là cú pháp tổng quát rất tiện lợi trong VHDL, tự động lấp đầy mức logic '0' cho toàn bộ các phần tử của vector."
      }
    ],

    summary: [
      "Bộ đếm nhị phân 4-bit đếm tuần hoàn 16 trạng thái (0 đến 15).",
      "Chân Enable điều khiển việc tạm dừng/tiếp tục; chân Up/Down điều khiển hướng đếm.",
      "Kiểu `unsigned` tự động quay vòng về 0 khi vượt quá giới hạn cực đại.",
      "Cú pháp `(others => '0')` giúp reset toàn bộ bus bit về 0 một cách ngắn gọn và an toàn.",
      "Kết hợp bộ đếm với bộ giải mã 7 thanh để hiển thị kết quả trực quan trên DE2-115."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "KEY0"],
      activeOutputs: ["LEDR0", "LEDR1", "LEDR2", "LEDR3"],
      logicEvaluator: function(inputs) {
        if (inputs.KEY0 === 0) return { LEDR0: 0, LEDR1: 0, LEDR2: 0, LEDR3: 0 };
        return {
          LEDR0: 1,
          LEDR1: 0,
          LEDR2: 1,
          LEDR3: 0
        };
      }
    },

    waveformConfig: {
      title: "Bộ đếm nhị phân 4-bit (Counter)",
      clockPeriodNs: 20,
      signals: [
        { name: "clk",     type: "clock" },
        { name: "rst_n",   type: "binary", values: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
        { name: "en",      type: "binary", values: [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1] },
        { name: "up_down", type: "binary", values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0] },
        { name: "count",   type: "bus",    values: [0, 1, 2, 3, 4, 5, 6, 6, 6, 5, 4, 3, 2, 1, 0, 15] }
      ]
    }
  },

  // ========================================================================
  // BÀI 4.6
  // ========================================================================
  {
    id: "ch4-b6",
    chapterId: "ch4",
    order: 6,
    title: "Bộ đếm BCD (00 đến 99) quét hiển thị 2 LED 7 thanh (HEX1 và HEX0)",
    subtitle: "Thiết kế bộ đếm thập phân 2 chữ số chuẩn mực cho ứng dụng đồng hồ số",
    badge: "Mạch tuần tự",
    estimatedMinutes: 30,
    hardwareFocus: ["Bộ đếm BCD", "HEX1 & HEX0"],

    objectives: [
      "Hiểu nguyên lý hoạt động của mã BCD (Binary-Coded Decimal): Mỗi chữ số thập phân (0-9) được mã hóa bằng 4 bit.",
      "Thiết kế bộ đếm BCD 2 chữ số (từ 00 đến 99) với cơ chế cuốn hàng: Khi hàng đơn vị chạm 9 thì hàng chục tăng 1.",
      "Tích hợp 2 bộ giải mã LED 7 thanh để hiển thị đồng thời hàng chục ra HEX1 và hàng đơn vị ra HEX0.",
      "Kết hợp bộ chia xung nhịp 1 Hz để tạo đồng hồ đếm giây thực tế trên kit DE2-115."
    ],

    theory: {
      why: "Trong cuộc sống hàng ngày, con người quen thuộc với hệ thập phân (0 đến 9). Một bộ đếm nhị phân thông thường sẽ đếm từ 0 đến 15 (hiển thị 0, 1, 2... 9, A, B, C, D, E, F). Nhưng đồng hồ hay máy đếm tiền không thể hiển thị chữ cái A, B, C! Ta cần một bộ đếm đặc biệt đếm từ 00, 01... đến 09 rồi nhảy sang 10, đếm tới 99 rồi quay về 00. Đó chính là Bộ đếm BCD.",
      how: "Bộ đếm BCD 2 chữ số bao gồm 2 tầng đếm 4-bit độc lập:\n1. **Hàng đơn vị (`digit_units`):** Đếm từ 0 đến 9. Khi chạm 9, ở chu kỳ tiếp theo nó sẽ quay về 0 và phát ra một tín hiệu cho phép (Enable) sang hàng chục.\n2. **Hàng chục (`digit_tens`):** Chỉ tăng lên 1 khi hàng đơn vị chạm 9. Nó cũng đếm từ 0 đến 9; khi cả hai cùng đạt 99 thì chu kỳ tiếp theo toàn bộ quay về 00.\n3. **Hiển thị:** `digit_units` giải mã ra `HEX0`, `digit_tens` giải mã ra `HEX1`.",
      sections: [
        {
          heading: "1. Logic cuốn hàng (Roll-over Logic)",
          content: "```vhdl\nif units = 9 then\n    units <= (others => '0');\n    if tens = 9 then\n        tens <= (others => '0');\n    else\n        tens <= tens + 1;\n    end if;\nelse\n    units <= units + 1;\nend if;\n```\nCấu trúc lồng nhau này đảm bảo chu kỳ đếm thập phân 00..99 chuẩn xác 100%.",
          callout: {
            type: "info",
            title: "Ưu điểm của BCD",
            text: "Nhờ tách riêng 4-bit cho hàng chục và 4-bit cho hàng đơn vị, việc nối dây ra 2 bộ đèn LED 7 đoạn HEX1 và HEX0 diễn ra cực kỳ đơn giản mà không cần thuật toán chia lấy dư (Mod/Div) tốn kém tài nguyên phần cứng."
          }
        }
      ],
      truthTable: {
        headers: ["Giá trị đếm thập phân", "Hàng chục tens (HEX1)", "Hàng đơn vị units (HEX0)", "Trạng thái cuốn hàng"],
        rows: [
          ["08", "\"0000\" (0)", "\"1000\" (8)", "Đơn vị tăng bình thường"],
          ["09", "\"0000\" (0)", "\"1001\" (9)", "Đơn vị chạm ngưỡng"],
          ["10", "\"0001\" (1)", "\"0000\" (0)", "Đơn vị về 0, Chục tăng 1"],
          ["99", "\"1001\" (9)", "\"1001\" (9)", "Cả 2 chạm ngưỡng"],
          ["00", "\"0000\" (0)", "\"0000\" (0)", "Toàn bộ quay vòng về 00"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ Bộ đếm BCD 00-99 ra 2 HEX -->
      <g transform="translate(30, 25)">
        <rect x="80" y="20" width="220" height="150" rx="8" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="190" y="50" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold">BCD COUNTER (00-99)</text>

        <!-- Ngõ vào clock & reset -->
        <line x1="20" y1="75" x2="80" y2="75" class="wire-clk"/><text x="10" y="80" fill="#f59e0b" font-size="10">clk</text>
        <line x1="20" y1="115" x2="80" y2="115" class="wire"/><text x="10" y="120" fill="#ef4444" font-size="10">rst_n</text>

        <!-- Đường ra Hàng chục nối HEX1 -->
        <line x1="300" y1="65" x2="400" y2="65" class="wire-bus"/>
        <text x="350" y="55" fill="#f59e0b" font-size="10">tens[3:0]</text>
        <rect x="400" y="40" width="70" height="50" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="435" y="70" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">HEX1</text>

        <!-- Đường ra Hàng đơn vị nối HEX0 -->
        <line x1="300" y1="125" x2="400" y2="125" class="wire-bus"/>
        <text x="350" y="115" fill="#10b981" font-size="10">units[3:0]</text>
        <rect x="400" y="100" width="70" height="50" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
        <text x="435" y="130" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">HEX0</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "bcd_counter_99",
      circuitType: "sequential",
      typeExplanation: "Bộ đếm BCD 00 đến 99 tích hợp giải mã trực tiếp ra 2 màn hình LED 7 đoạn HEX1 (hàng chục) và HEX0 (hàng đơn vị).",
      code: `--------------------------------------------------------------------------------
-- Tên file: bcd_counter_99.vhd
-- Bộ đếm BCD 2 chữ số (00 đến 99) hiển thị ra HEX1 và HEX0
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity bcd_counter_99 is
    port (
        clk   : in  std_logic;                    -- Xung nhịp (PIN_Y2)
        rst_n : in  std_logic;                    -- Nút Reset (PIN_M23 - KEY0)
        en    : in  std_logic;                    -- Cho phép đếm (PIN_AB28 - SW0)
        hex1  : out std_logic_vector(6 downto 0); -- Hàng chục (HEX1)
        hex0  : out std_logic_vector(6 downto 0)  -- Hàng đơn vị (HEX0)
    );
end entity bcd_counter_99;

architecture rtl of bcd_counter_99 is
    signal units : unsigned(3 downto 0) := "0000";
    signal tens  : unsigned(3 downto 0) := "0000";

    -- Hàm giải mã 7 thanh Anode chung (Active-Low)
    function to_7seg(val : unsigned(3 downto 0)) return std_logic_vector is
    begin
        case to_integer(val) is
            when 0 => return "1000000";
            when 1 => return "1111001";
            when 2 => return "0100100";
            when 3 => return "0110000";
            when 4 => return "0011001";
            when 5 => return "0010010";
            when 6 => return "0000010";
            when 7 => return "1111000";
            when 8 => return "0000000";
            when 9 => return "0010000";
            when others => return "1111111";
        end case;
    end function;
begin
    -- Quá trình đếm BCD
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            units <= (others => '0');
            tens  <= (others => '0');
        elsif rising_edge(clk) then
            if en = '1' then
                if units = 9 then
                    units <= (others => '0'); -- Hàng đơn vị về 0
                    if tens = 9 then
                        tens <= (others => '0'); -- Hàng chục về 0 (99 -> 00)
                    else
                        tens <= tens + 1; -- Hàng chục tăng 1
                    end if;
                else
                    units <= units + 1; -- Hàng đơn vị tăng 1
                end if;
            end if;
        end if;
    end process;

    -- Xuất ra 2 bộ hiển thị LED 7 thanh
    hex0 <= to_7seg(units);
    hex1 <= to_7seg(tens);
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_bcd_counter",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra chuyển mạch từ 09 sang 10 và từ 99 sang 00
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_bcd_counter is
end entity tb_bcd_counter;

architecture sim of tb_bcd_counter is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '0';
    signal en    : std_logic := '1';
    signal h1, h0: std_logic_vector(6 downto 0);
begin
    uut: entity work.bcd_counter_99
        port map ( clk=>clk, rst_n=>rst_n, en=>en, hex1=>h1, hex0=>h0 );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 25 ns;
        rst_n <= '1';
        -- Đếm qua 15 chu kỳ để quan sát bước nhảy từ 09 sang 10
        wait for 300 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: Tại chu kỳ thứ 10, hex0 đổi về mã của số 0 (\"1000000\") và hex1 đổi sang mã của số 1 (\"1111001\")."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file bcd_counter_99.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Mở Pin Planner gán chân cho CLOCK_50 (PIN_Y2), KEY0 (PIN_M23), SW0 (PIN_AB28) và toàn bộ 14 chân của HEX1 và HEX0.",
        "4. Biên dịch và nạp file .sof lên kit DE2-115."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "en", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "hex0[0]", pin: "PIN_G18", ioStandard: "2.5 V", note: "HEX0 Đoạn a" },
        { signal: "hex0[6]", pin: "PIN_H22", ioStandard: "2.5 V", note: "HEX0 Đoạn g" },
        { signal: "hex1[0]", pin: "PIN_M24", ioStandard: "2.5 V", note: "HEX1 Đoạn a" },
        { signal: "hex1[6]", pin: "PIN_U24", ioStandard: "2.5 V", note: "HEX1 Đoạn g" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_AB28 -to en\nset_location_assignment PIN_G18 -to hex0[0]\nset_location_assignment PIN_H22 -to hex0[6]\nset_location_assignment PIN_M24 -to hex1[0]\nset_location_assignment PIN_U24 -to hex1[6]`
    },

    commonErrors: [
      {
        error: "Quên reset hàng chục khi chạm 99 dẫn đến hàng chục đếm tiếp lên A, B, C...",
        cause: "Chỉ kiểm tra tens = 9 mà không reset tens về 0.",
        fix: "Luôn viết `if tens = 9 then tens <= (others => '0');`."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Bộ đếm giây đồng hồ (00 đến 59)",
        prompt: "Sửa bộ đếm để đếm giây cho đồng hồ số: Khi đạt 59 giây thì chu kỳ tiếp theo quay về 00.",
        hint: "Đổi điều kiện hàng chục từ tens = 9 thành tens = 5.",
        solution: "if tens = 5 then tens <= (others => '0');"
      },
      {
        level: "Vận dụng",
        title: "Tạo xung Enable 1 Hz cấp cho bộ đếm BCD",
        prompt: "Ghép module chia xung 1 Hz ở Bài 4.4 để kích hoạt chân en của bộ đếm BCD, tạo thành đồng hồ đếm giây thực tế.",
        hint: "Nối cờ tick_1hz từ bộ chia xung vào chân en của bộ đếm BCD.",
        solution: "Dùng chung xung CLOCK_50, khi tick_1hz = '1' thì thực hiện đếm BCD."
      },
      {
        level: "Thử thách",
        title: "Mở rộng bộ đếm BCD 6 chữ số (Giờ - Phút - Giây)",
        prompt: "Nêu cấu trúc phân cấp để xây dựng đồng hồ hiển thị 6 LED 7 thanh (HEX5..HEX0) đếm Giờ (00-23), Phút (00-59), Giây (00-59).",
        hint: "Ghép 3 khối đếm BCD nối tiếp nhau thông qua các tín hiệu cuốn hàng minute_en và hour_en.",
        solution: "Tầng Giây đếm 00-59, khi chạm 59 sinh cờ sec_roll = '1'. Tầng Phút nhận sec_roll để đếm 00-59, khi chạm 59 sinh min_roll = '1'. Tầng Giờ nhận min_roll để đếm 00-23."
      }
    ],

    quiz: [
      {
        question: "Mã BCD (Binary-Coded Decimal) mã hóa mỗi chữ số thập phân (từ 0 đến 9) bằng bao nhiêu bit nhị phân?",
        options: [
          "1 bit",
          "4 bit (vì 2^4 = 16 đủ chứa các số từ 0 đến 9)",
          "8 bit",
          "10 bit"
        ],
        answerIndex: 1,
        explanation: "Mỗi chữ số thập phân từ 0 đến 9 cần tối thiểu 4 bit nhị phân (từ 0000 đến 1001) để biểu diễn."
      },
      {
        question: "Khi bộ đếm BCD 2 chữ số đang ở giá trị \"09\", ở xung clock tiếp theo giá trị của nó sẽ chuyển thành gì?",
        options: [
          "\"0A\"",
          "\"10\" (Hàng đơn vị về 0, hàng chục tăng lên 1)",
          "\"00\"",
          "\"19\""
        ],
        answerIndex: 1,
        explanation: "Trong hệ đếm BCD, số 9 là giới hạn của 1 chữ số thập phân. Sau 09 bắt buộc phải cuốn hàng sang 10."
      },
      {
        question: "Trong 16 tổ hợp của 4-bit nhị phân (0000 đến 1111), có bao nhiêu tổ hợp là KHÔNG HỢP LỆ trong chuẩn mã BCD?",
        options: [
          "0 tổ hợp",
          "6 tổ hợp (từ 1010 đến 1111, tương ứng 10 đến 15)",
          "10 tổ hợp",
          "4 tổ hợp"
        ],
        answerIndex: 1,
        explanation: "BCD chỉ dùng 10 tổ hợp từ 0000 (0) đến 1001 (9). 6 tổ hợp còn lại từ 1010 (10) đến 1111 (15) là các trạng thái không hợp lệ (Illegal states)."
      },
      {
        question: "Tại sao trong thiết kế phần cứng, người ta lại thích dùng BCD cho đồng hồ hiển thị thay vì đếm nhị phân thông thường?",
        options: [
          "Vì BCD tiết kiệm thanh ghi hơn",
          "Vì BCD tách sẵn từng chữ số hàng chục và hàng đơn vị, nối thẳng vào bộ giải mã 7 thanh mà không cần mạch chia lấy dư /10 phức tạp",
          "Vì BCD chạy nhanh hơn 10 lần",
          "Vì BCD không cần dùng xung clock"
        ],
        answerIndex: 1,
        explanation: "Nếu dùng số nhị phân thông thường (ví dụ đếm tới 59), muốn tách hàng chục và đơn vị bạn phải làm phép tính chia cho 10 (`/ 10` và `% 10`), tiêu tốn hàng trăm cổng logic tổ hợp. BCD giải quyết việc này với chi phí phần cứng gần như bằng 0."
      }
    ],

    summary: [
      "Bộ đếm BCD mã hóa mỗi chữ số thập phân 0-9 bằng 4 bit nhị phân.",
      "Cơ chế cuốn hàng: Khi hàng đơn vị chạm 9 thì quay về 0 và tăng hàng chục lên 1.",
      "Giá trị 99 tự động quay vòng về 00.",
      "Tách riêng 2 bus 4-bit `tens` và `units` giúp nối thẳng vào 2 khối giải mã HEX1 và HEX0.",
      "Bộ đếm BCD là nền tảng cốt lõi của mọi ứng dụng đồng hồ số (Digital Clock) và bộ định thời (Timer)."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["KEY0", "SW0"],
      activeOutputs: ["HEX1", "HEX0"],
      logicEvaluator: function(inputs) {
        // Mô phỏng hiển thị 00 trên HEX1 và HEX0 khi Reset
        return {
          HEX1: "1000000", // Số 0
          HEX0: "1000000"  // Số 0
        };
      }
    },

    waveformConfig: {
      title: "Bộ đếm BCD (00 đến 99)",
      clockPeriodNs: 20,
      signals: [
        { name: "clk",   type: "clock" },
        { name: "rst_n", type: "binary", values: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
        { name: "tens",  type: "bus",    values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1] },
        { name: "units", type: "bus",    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5] }
      ]
    }
  },

  // ========================================================================
  // BÀI 4.7
  // ========================================================================
  {
    id: "ch4-b7",
    chapterId: "ch4",
    order: 7,
    title: "Kỹ thuật chống rung nút nhấn (Debounce KEY) bằng mạch lấy mẫu dịch bit",
    subtitle: "Xử lý hiện tượng nảy tiếp điểm cơ học: Biến nút bấm chập chờn thành xung kích sạch 100%",
    badge: "Kỹ thuật thực chiến",
    estimatedMinutes: 30,
    hardwareFocus: ["KEY[3:0] (Debounce)", "Shift Register lấy mẫu"],

    objectives: [
      "Hiểu rõ hiện tượng nảy tiếp điểm cơ học (Contact Bounce) của nút bấm KEY trên bo mạch thật.",
      "Giải thích tại sao một cú bấm nút của con người có thể kích hoạt bộ đếm nhảy loạn xạ hàng chục lần.",
      "Thiết kế mạch lọc rung số (Digital Debouncer) sử dụng thanh ghi dịch lấy mẫu ở tần số thấp (ví dụ: lấy mẫu mỗi 10 ms).",
      "Tạo ra xung kích hoạt duy nhất dài 1 chu kỳ clock (One-Pulse Generator) khi người dùng ấn nút."
    ],

    theory: {
      why: "Khi bạn dùng ngón tay ấn một nút bấm cơ học trên kit DE2-115, hai lá đồng chạm vào nhau không tiếp xúc êm đềm ngay lập tức. Chúng sẽ bị nảy tưng tưng (bouncing) cơ học trong khoảng từ 5 đến 20 mili-giây trước khi ổn định. Vì FPGA chạy ở tốc độ 50 MHz (mỗi chu kỳ chỉ 20 ns), chip sẽ tưởng rằng bạn vừa ấn nút... 50,000 lần liên tiếp! Nếu không chống rung, mỗi lần bấm nút KEY thì bộ đếm trên kit sẽ nhảy loạn xạ không kiểm soát được.",
      how: "Giải pháp chống rung số (Digital Debouncing) trên FPGA:\n1. Dùng bộ chia tần số tạo ra một nhịp lấy mẫu chậm (thường là khoảng 10 ms đến 20 ms, vượt qua thời gian nảy cơ học).\n2. Đưa tín hiệu nút bấm vào một thanh ghi dịch 3-bit: `shift_reg <= shift_reg(1 downto 0) & key_in;`.\n3. Khi và chỉ khi cả 3 mẫu liên tiếp đều bằng '0' (`shift_reg = \"000\"`), ta mới kết luận chắc chắn rằng người dùng đã thực sự ấn nút và ổn định tiếp điểm!\n4. Tạo một cờ phát hiện cạnh xuống (Edge Detector) để chỉ phát ra đúng 1 xung duy nhất dài 20 ns.",
      sections: [
        {
          heading: "1. Cơ chế lấy mẫu lọc số 3 tầng (3-Stage Shift Register)",
          content: "Tại mỗi chu kỳ lấy mẫu 10 ms:\n- Dữ liệu nút bấm `btn_noisy` được đẩy vào thanh ghi dịch 3-bit `shift_reg`.\n- Nếu cả 3 giá trị liên tiếp thu được đều là mức '0' (`\"000\"`), nghĩa là trạng thái bấm đã ổn định và không còn nảy tiếp điểm. Mạch xác nhận trạng thái nút sạch `btn_clean = '0'`.\n- Tương tự, khi nhả tay, chỉ khi 3 mẫu liên tiếp đều là '1' (`\"111\"`) thì mạch mới xác nhận đã nhả phím `btn_clean = '1'`.",
          callout: {
            type: "tip",
            title: "Tạo xung kích 1 chu kỳ (One-Pulse Generator)",
            text: "Để bộ đếm chỉ tăng 1 đơn vị duy nhất mỗi lần ấn (dù bạn giữ phím 5 giây), ta dùng thêm một tầng nhớ lưu `btn_prev`. Điều kiện phát hiện cạnh ấn là: `btn_clean = '0' and btn_prev = '1'`."
          }
        }
      ],
      truthTable: {
        headers: ["shift_reg (3 mẫu 10ms)", "Ý nghĩa trạng thái cơ học", "btn_clean (Tín hiệu sạch)", "Xung btn_pressed"],
        rows: [
          ["\"111\"", "Đang nhả phím hoàn toàn", "'1' (Mức cao)", "'0' (Không kích hoạt)"],
          ["\"101\" hoặc \"010\"", "Đang trong giai đoạn nảy tiếp điểm", "Giữ nguyên trạng thái cũ", "'0' (Loại bỏ nhiễu)"],
          ["\"000\"", "Đã ấn phím ổn định", "'0' (Mức thấp xác nhận)", "Tạo xung 1 chu kỳ tại nhịp chuyển mức"],
          ["\"000\" (giữ nguyên)", "Người dùng vẫn đang đè phím", "'0'", "'0' (Không tăng lặp lại)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ hiện tượng nảy phím cơ học và mạch lọc Debounce -->
      <g transform="translate(30, 25)">
        <text x="120" y="25" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="bold">Tín hiệu thực tế: Bị nảy tiếp điểm (Bounce)</text>
        <!-- Dạng sóng nảy phím chập chờn -->
        <path d="M 20,60 L 50,60 L 55,40 L 60,60 L 65,40 L 70,60 L 75,40 L 80,60 L 90,60 L 90,40 L 220,40" fill="none" stroke="#ef4444" stroke-width="2"/>
        <text x="70" y="80" text-anchor="middle" fill="#fca5a5" font-size="9">Nảy 10ms</text>

        <!-- Mũi tên qua bộ lọc Debounce -->
        <path d="M 235,50 L 305,50" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        <rect x="235" y="65" width="70" height="35" rx="4" fill="#131c31" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="270" y="87" text-anchor="middle" fill="#38bdf8" font-size="9" font-weight="bold">DEBOUNCE</text>

        <text x="440" y="25" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">Tín hiệu sau lọc: Sạch 100%</text>
        <!-- Dạng sóng sạch -->
        <path d="M 320,60 L 370,60 L 370,40 L 540,40" fill="none" stroke="#10b981" stroke-width="2.5"/>
        <text x="450" y="75" text-anchor="middle" fill="#10b981" font-size="10">Chuyển mức dứt khoát</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "button_debouncer",
      circuitType: "sequential",
      typeExplanation: "Mạch chống rung phím bấm hoàn chỉnh: Lấy mẫu lọc nhiễu cơ học và tạo xung kích hoạt 1 chu kỳ clock.",
      code: `--------------------------------------------------------------------------------
-- Tên file: button_debouncer.vhd
-- Mạch chống rung phím bấm (Button Debouncer) cho các nút KEY trên kit DE2-115
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity button_debouncer is
    port (
        clk         : in  std_logic; -- Xung clock 50 MHz (PIN_Y2)
        rst_n       : in  std_logic; -- Reset (KEY0)
        btn_noisy   : in  std_logic; -- Nút bấm cơ học bị rung (KEY1 - PIN_M21)
        btn_pressed : out std_logic  -- Xung tích cực đúng 1 chu kỳ clock (LEDR0)
    );
end entity button_debouncer;

architecture rtl of button_debouncer is
    -- 50 MHz -> Đếm 500,000 nhịp để tạo tần số lấy mẫu mỗi 10 ms (100 Hz)
    constant SAMPLE_TICKS : integer := 500000;
    signal sample_cnt     : unsigned(18 downto 0) := (others => '0');
    signal sample_tick    : std_logic := '0';

    -- Thanh ghi dịch 3 tầng lưu mẫu lịch sử
    signal shift_reg : std_logic_vector(2 downto 0) := "111";
    signal btn_clean : std_logic := '1';
    signal btn_prev  : std_logic := '1';
begin
    -- 1. TẠO XUNG LẤY MẪU 10 MS
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            sample_cnt  <= (others => '0');
            sample_tick <= '0';
        elsif rising_edge(clk) then
            if sample_cnt = SAMPLE_TICKS - 1 then
                sample_cnt  <= (others => '0');
                sample_tick <= '1';
            else
                sample_cnt  <= sample_cnt + 1;
                sample_tick <= '0';
            end if;
        end if;
    end process;

    -- 2. LỌC RUNG BẰNG THANH GHI DỊCH 3 MẪU
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            shift_reg <= "111";
            btn_clean <= '1';
        elsif rising_edge(clk) then
            if sample_tick = '1' then
                shift_reg <= shift_reg(1 downto 0) & btn_noisy;
                -- Chỉ khi cả 3 mẫu liên tiếp đều bằng '0' (ấn giữ ổn định)
                if shift_reg = "000" then
                    btn_clean <= '0';
                elsif shift_reg = "111" then
                    btn_clean <= '1';
                end if;
            end if;
        end if;
    end process;

    -- 3. BẮT CẠNH XUỐNG: TẠO 1 XUNG DUY NHẤT DÀI 20 NS KHI ẤN
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            btn_prev    <= '1';
            btn_pressed <= '0';
        elsif rising_edge(clk) then
            btn_prev <= btn_clean;
            -- Phát hiện chuyển từ '1' xuống '0' (Falling Edge)
            if btn_prev = '1' and btn_clean = '0' then
                btn_pressed <= '1';
            else
                btn_pressed <= '0';
            end if;
        end if;
    end process;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_button_debouncer",
      code: `--------------------------------------------------------------------------------
-- Testbench mô phỏng hiện tượng nảy phím
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_button_debouncer is
end entity tb_button_debouncer;

architecture sim of tb_button_debouncer is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '0';
    signal noisy : std_logic := '1';
    signal pulse : std_logic;
begin
    uut: entity work.button_debouncer
        port map ( clk=>clk, rst_n=>rst_n, btn_noisy=>noisy, btn_pressed=>pulse );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 40 ns;
        rst_n <= '1'; wait for 20 ns;
        -- Mô phỏng nảy phím chập chờn
        noisy <= '0'; wait for 20 ns;
        noisy <= '1'; wait for 30 ns;
        noisy <= '0'; wait for 20 ns;
        noisy <= '1'; wait for 10 ns;
        noisy <= '0'; -- Ổn định ở mức 0
        wait for 200 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: Dù tín hiệu noisy bị nảy chập chờn nhiều lần, ngõ ra btn_pressed chỉ phát ra DUY NHẤT một xung cao 20 ns sau khi nút đã thực sự ổn định."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file button_debouncer.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: clk = PIN_Y2, rst_n = PIN_M23 (KEY0), btn_noisy = PIN_M21 (KEY1), btn_pressed = PIN_G19 (LEDR0).",
        "4. Biên dịch và nạp xuống kit DE2-115.",
        "5. Thử nghiệm trên kit thật: Bấm nút KEY1 và quan sát phản hồi dứt khoát không còn bị nhảy số loạn xạ!"
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "btn_noisy", pin: "PIN_M21", ioStandard: "2.5 V", note: "KEY1 (Nút nhấn cần chống rung)" },
        { signal: "btn_pressed", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_M21 -to btn_noisy\nset_location_assignment PIN_G19 -to btn_pressed`
    },

    commonErrors: [
      {
        error: "Lấy mẫu quá nhanh (ví dụ lấy mẫu ở 1 MHz) khiến mạch không lọc được rung",
        cause: "Thời gian nảy cơ học kéo dài từ 5 đến 20 ms. Nếu chu kỳ lấy mẫu nhỏ hơn thời gian nảy, mạch vẫn đọc phải các trạng thái chập chờn.",
        fix: "Chu kỳ lấy mẫu bắt buộc phải nằm trong khoảng từ 10 ms đến 20 ms."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo xung khi nhả phím (Release Detection)",
        prompt: "Sửa mạch để phát hiện sự kiện nhả nút (chuyển từ '0' lên '1') thay vì ấn nút.",
        hint: "Đổi điều kiện: if btn_prev = '0' and btn_clean = '1' then btn_released <= '1';",
        solution: "if btn_prev = '0' and btn_clean = '1' then\n    btn_released <= '1';\nend if;"
      },
      {
        level: "Vận dụng",
        title: "Bộ đếm tăng 1 mỗi lần bấm nút",
        prompt: "Ghép mạch chống rung với bộ đếm 4-bit ở Bài 4.5. Mỗi lần bấm nút KEY1 thì bộ đếm tăng đúng 1 đơn vị chuẩn xác 100%.",
        hint: "Dùng tín hiệu btn_pressed nối vào chân enable của bộ đếm.",
        solution: "if btn_pressed = '1' then count <= count + 1; end if;"
      },
      {
        level: "Thử thách",
        title: "So sánh chống rung phần cứng RC vs chống rung số FPGA",
        prompt: "Tại sao trên các hệ thống số hiện đại, kỹ sư ưu tiên chống rung bằng mạch số trên FPGA thay vì dùng mạch lọc RC phần cứng bên ngoài bo mạch?",
        hint: "Mạch RC tốn diện tích linh kiện thụ động và phụ thuộc nhiệt độ linh kiện.",
        solution: "Chống rung số trên FPGA không tốn linh kiện rời bên ngoài (tiết kiệm chi phí PCB), thời gian trễ lọc có thể điều chỉnh linh hoạt bằng mã nguồn VHDL, và hoàn toàn miễn nhiễm với sự suy hao lão hóa hay thay đổi nhiệt độ của tụ điện hóa."
      }
    ],

    quiz: [
      {
        question: "Hiện tượng nảy tiếp điểm cơ học (Contact Bounce) của nút bấm thường kéo dài trong khoảng thời gian bao lâu?",
        options: [
          "Vài nano-giây (ns)",
          "Từ 5 đến 20 mili-giây (ms)",
          "Vài phút",
          "1 giờ"
        ],
        answerIndex: 1,
        explanation: "Các tiếp điểm cơ học bằng kim loại mất khoảng 5 đến 20 ms dao động đàn hồi trước khi tiếp xúc vật lý hoàn toàn ổn định."
      },
      {
        question: "Nếu không có mạch chống rung Debounce, điều gì sẽ xảy ra khi bạn ấn nút tăng bộ đếm trên kit FPGA thật chạy ở 50 MHz?",
        options: [
          "Mạch sẽ không chạy",
          "Bộ đếm sẽ nhảy vọt lên nhiều đơn vị (có thể tăng hàng chục hoặc hàng trăm số chỉ sau 1 lần bấm)",
          "Chip FPGA sẽ bị nóng",
          "Đèn LED đổi màu xanh"
        ],
        answerIndex: 1,
        explanation: "Vì FPGA có xung nhịp cực nhanh (20 ns/nhịp), nó sẽ ghi nhận toàn bộ hàng chục dao động nảy tiếp điểm trong 10 ms như những lần bấm nút riêng biệt."
      },
      {
        question: "Chu kỳ lấy mẫu lý tưởng cho mạch lọc chống rung số phím bấm thường được chọn là bao nhiêu?",
        options: [
          "20 ns",
          "10 ms đến 20 ms",
          "1 giây",
          "100 us"
        ],
        answerIndex: 1,
        explanation: "Chu kỳ lấy mẫu 10 ms đến 20 ms vừa đủ dài để vượt qua khoảng thời gian nảy phím cơ học, vừa đủ nhanh để con người không cảm thấy bị trễ (Human response time)."
      },
      {
        question: "Mạch phát hiện cạnh (Edge Detector) dùng để làm gì trong khâu cuối của bộ chống rung?",
        options: [
          "Tạo ra duy nhất một xung hẹp dài đúng 1 chu kỳ clock khi người dùng ấn nút, bất kể người dùng ấn giữ nút bao lâu",
          "Đảo mức logic từ 0 sang 1",
          "Tăng tần số xung clock",
          "Xóa bộ nhớ RAM"
        ],
        answerIndex: 0,
        explanation: "Edge Detector đảm bảo rằng dù người dùng có ấn giữ nút bấm trong 5 giây thì mạch bên trong cũng chỉ nhận đúng một xung kích hoạt duy nhất ở khoảnh khắc nhấn nút."
      }
    ],

    summary: [
      "Nút bấm cơ học luôn bị nảy tiếp điểm chập chờn từ 5 đến 20 ms.",
      "Ở tốc độ 50 MHz của FPGA, 1 lần bấm không chống rung sẽ bị hiểu nhầm thành hàng chục lần bấm.",
      "Mạch Debounce lấy mẫu ở chu kỳ 10 ms để đảm bảo tiếp điểm đã tiếp xúc ổn định.",
      "Thanh ghi dịch 3 mẫu giúp xác nhận trạng thái nút bấm dứt khoát 100%.",
      "Mạch Edge Detector tạo ra xung chuẩn 1 chu kỳ clock, biến thao tác bấm nút thành tín hiệu điều khiển hoàn hảo."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["KEY1", "KEY0"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        // Mô phỏng bắt xung KEY1 sạch
        return {
          LEDR0: inputs.KEY1 === 0 ? 1 : 0
        };
      }
    },

    waveformConfig: {
      title: "Chống rung phím bấm (Button Debouncer)",
      clockPeriodNs: 20,
      signals: [
        { name: "clk",       type: "clock" },
        { name: "noisy_key", type: "binary", values: [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { name: "shift_reg", type: "bus",    values: [7, 6, 7, 6, 4, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { name: "clean_key", type: "binary", values: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { name: "pulse",     type: "binary", values: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0] }
      ]
    }
  }
];

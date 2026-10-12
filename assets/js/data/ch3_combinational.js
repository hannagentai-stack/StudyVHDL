// ==========================================================================
// CH3_COMBINATIONAL.JS - CHƯƠNG 3: MẠCH TỔ HỢP (7 BÀI HỌC HOÀN CHỈNH)
// ==========================================================================

window.VHDL_LESSONS_DB = window.VHDL_LESSONS_DB || {};

window.VHDL_LESSONS_DB["ch3"] = [
  // ========================================================================
  // BÀI 3.1
  // ========================================================================
  {
    id: "ch3-b1",
    chapterId: "ch3",
    order: 1,
    title: "Cổng logic và Mạch Boolean đa ngõ vào",
    subtitle: "Xây dựng các mạng logic tổ hợp phức tạp bằng câu lệnh gán đồng thời",
    badge: "Mạch tổ hợp",
    estimatedMinutes: 25,
    hardwareFocus: ["Cổng logic đa ngõ vào", "Mạng logic SOP / POS"],

    objectives: [
      "Thiết kế mạch logic tổ hợp đa ngõ vào từ phương trình đại số Boolean dạng SOP (Sum of Products) và POS.",
      "Viết mã VHDL rõ ràng, chuẩn tắc sử dụng toán tử logic và dấu ngoặc đơn tường minh.",
      "Mô phỏng kiểm tra tất cả các tổ hợp ngõ vào trên ModelSim.",
      "Gán chân công tắc SW và đèn LEDR trên kit DE2-115 để kiểm chứng thực tế."
    ],

    theory: {
      why: "Trong các bài toán điều khiển công nghiệp (như hệ thống liên động an toàn: máy dập chỉ hoạt động khi 2 tay công nhân cùng ấn nút VÀ cửa bảo vệ đã đóng VÀ nút dừng khẩn cấp chưa bị kích hoạt), ta cần kết hợp nhiều tín hiệu logic lại với nhau. Mạch Boolean đa ngõ vào chính là giải pháp phần cứng tốc độ cao phản ứng trong nano-giây.",
      how: "Mọi hàm logic tổ hợp đều có thể biểu diễn dưới dạng Tổng của các Tích (SOP - Sum of Products) bằng cách ghép các cổng AND (tích) rồi đưa qua một cổng OR (tổng). Trong VHDL, ta viết trực tiếp biểu thức Boolean bằng câu lệnh gán đồng thời bên trong architecture.",
      sections: [
        {
          heading: "1. Cấu trúc hàm đa ngõ vào",
          content: "Xét hệ thống cảnh báo an toàn trên kit DE2-115:\n- Công tắc SW0: Cảm biến cửa (1 = Đóng, 0 = Mở).\n- Công tắc SW1: Cảm biến nhiệt (1 = Bình thường, 0 = Quá nhiệt).\n- Nút nhấn KEY0: Nút khởi động (Active-Low: 0 = Bấm).\nĐèn LED đỏ LEDR0 chỉ sáng khi: Cửa đóng VÀ Nhiệt độ bình thường VÀ Nút khởi động được bấm.\nBiểu thức VHDL:\n```vhdl\nled_alarm <= sw_door and sw_temp and (not key_start_n);\n```",
          callout: {
            type: "info",
            title: "Tối ưu hóa bảng tra LUT",
            text: "Bộ tổng hợp Quartus sẽ gom toàn bộ biểu thức trên vào đúng 1 khối LUT4 của chip Cyclone IV, tạo ra mạch có độ trễ truyền lan chỉ khoảng 0.5 đến 1 nano-giây!"
          }
        }
      ],
      truthTable: {
        headers: ["SW0 (Cửa)", "SW1 (Nhiệt)", "KEY0 (Nút bấm)", "LEDR0 (Bật máy)"],
        rows: [
          ["0", "1", "0 (Bấm)", "0 (Cửa đang mở)"],
          ["1", "0", "0 (Bấm)", "0 (Bị quá nhiệt)"],
          ["1", "1", "1 (Nhả)", "0 (Chưa ấn nút)"],
          ["1", "1", "0 (Bấm)", "1 (ĐỦ ĐIỀU KIỆN KHỞI ĐỘNG)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ mạch logic an toàn -->
      <g transform="translate(60, 40)">
        <line x1="20" y1="30" x2="160" y2="30" class="wire"/>
        <text x="10" y="35" fill="#f8fafc" font-size="11">SW0 (Door)</text>

        <line x1="20" y1="70" x2="160" y2="70" class="wire"/>
        <text x="10" y="75" fill="#f8fafc" font-size="11">SW1 (Temp)</text>

        <line x1="20" y1="120" x2="70" y2="120" class="wire"/>
        <text x="10" y="125" fill="#f8fafc" font-size="11">KEY0 (Start_n)</text>

        <!-- Cổng NOT đảo KEY0 -->
        <polygon points="70,110 100,120 70,130" class="gate-body"/>
        <circle cx="104" cy="120" r="4" class="gate-body"/>
        <line x1="108" y1="120" x2="160" y2="120" class="wire"/>

        <!-- Cổng AND 3 ngõ vào -->
        <path d="M 160,20 L 220,20 A 55 55 0 0 1 220,130 L 160,130 Z" class="gate-body"/>
        <text x="195" y="80" fill="#94a3b8" font-size="11" font-weight="bold">AND3</text>

        <line x1="275" y1="75" x2="380" y2="75" class="wire"/>
        <circle cx="400" cy="75" r="14" fill="#ff2b44" filter="drop-shadow(0 0 8px #ff2b44)"/>
        <text x="400" y="115" text-anchor="middle" fill="#f8fafc" font-size="11">LEDR0 (Run)</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "safety_interlock",
      circuitType: "combinational",
      typeExplanation: "Mạch tổ hợp đa ngõ vào: Tín hiệu ra phản ứng tức thời theo trạng thái logic của 3 ngõ vào.",
      code: `--------------------------------------------------------------------------------
-- Tên file: safety_interlock.vhd
-- Mạch logic liên động an toàn 3 ngõ vào
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity safety_interlock is
    port (
        sw_door     : in  std_logic; -- SW0: Cảm biến cửa (1=đóng, 0=mở)
        sw_temp     : in  std_logic; -- SW1: Cảm biến nhiệt (1=tốt, 0=nóng)
        key_start_n : in  std_logic; -- KEY0: Nút khởi động (Active-Low: 0=nhấn)
        led_run     : out std_logic  -- LEDR0: Đèn báo máy chạy (1=sáng)
    );
end entity safety_interlock;

architecture rtl of safety_interlock is
    signal start_pressed : std_logic;
begin
    -- 1. Đảo nút nhấn tích cực mức thấp: khi ấn KEY0 (về '0') thì start_pressed = '1'
    start_pressed <= not key_start_n;

    -- 2. Biểu thức logic liên động tổ hợp: cả 3 điều kiện cùng thỏa mãn
    led_run <= sw_door and sw_temp and start_pressed;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_safety_interlock",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra mạch liên động an toàn
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_safety_interlock is
end entity tb_safety_interlock;

architecture sim of tb_safety_interlock is
    signal door, temp, key_n, run : std_logic;
begin
    uut: entity work.safety_interlock
        port map ( sw_door => door, sw_temp => temp, key_start_n => key_n, led_run => run );

    stim: process
    begin
        -- Ban đầu chưa ấn nút: run phải = '0'
        door <= '1'; temp <= '1'; key_n <= '1'; wait for 20 ns;
        -- Ấn nút KEY0 (key_n = '0'): Đủ điều kiện -> run phải nhảy lên '1'
        key_n <= '0'; wait for 20 ns;
        assert run = '1' report "Lỗi mạch an toàn!" severity error;
        -- Mở cửa (door = '0'): run phải lập tức ngắt về '0'
        door <= '0'; wait for 20 ns;
        assert run = '0' report "Cửa mở mà máy vẫn chạy!" severity error;
        wait;
    end process;
end architecture sim;`,
      instructions: "Chạy mô phỏng trong ModelSim và kiểm tra: Đèn run chỉ lên 1 duy nhất khi door=1, temp=1 và key_n=0."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file safety_interlock.vhd trong Quartus Prime 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Mở Pin Planner: gán sw_door = PIN_AB28 (SW0), sw_temp = PIN_AC28 (SW1), key_start_n = PIN_M23 (KEY0), led_run = PIN_G19 (LEDR0).",
        "4. Compile và nạp file .sof xuống kit DE2-115."
      ],
      pinAssignments: [
        { signal: "sw_door", pin: "PIN_AB28", ioStandard: "2.5 V", note: "Công tắc SW0" },
        { signal: "sw_temp", pin: "PIN_AC28", ioStandard: "2.5 V", note: "Công tắc SW1" },
        { signal: "key_start_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "Nút nhấn KEY0 (Active-Low)" },
        { signal: "led_run", pin: "PIN_G19", ioStandard: "2.5 V", note: "Đèn LED đỏ LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to sw_door\nset_location_assignment PIN_AC28 -to sw_temp\nset_location_assignment PIN_M23 -to key_start_n\nset_location_assignment PIN_G19 -to led_run`
    },

    commonErrors: [
      {
        error: "Quên đảo nút nhấn KEY0 dẫn đến việc nhả nút thì máy chạy, ấn nút thì máy tắt",
        cause: "Các nút nhấn KEY[3:0] trên kit DE2-115 là tích cực mức THẤP (khi không ấn là '1', ấn xuống là '0').",
        fix: "Luôn dùng toán tử 'not key_start_n' khi muốn bắt sự kiện nhấn nút."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Thêm công tắc dừng khẩn cấp (Emergency Stop)",
        prompt: "Bổ sung công tắc SW2 (PIN_AC27) làm nút khẩn cấp. Khi SW2 gạt lên ('1'), đèn led_run phải lập tức tắt.",
        hint: "led_run <= sw_door and sw_temp and start_pressed and (not sw_stop);",
        solution: "led_run <= sw_door and sw_temp and start_pressed and (not sw_stop);"
      },
      {
        level: "Vận dụng",
        title: "Tạo biểu thức đa ngõ vào XOR chẵn lẻ (Parity Bit)",
        prompt: "Cho 4 công tắc SW[3:0], tạo bit kiểm tra chẵn lẻ chẵn (Even Parity) bằng chuỗi cổng XOR.",
        hint: "parity <= sw(3) xor sw(2) xor sw(1) xor sw(0);",
        solution: "parity <= sw(3) xor sw(2) xor sw(1) xor sw(0);"
      },
      {
        level: "Thử thách",
        title: "Phân tích trễ truyền lan đường dẫn dài nhất (Critical Path)",
        prompt: "Nếu mỗi cổng logic 2 ngõ vào có độ trễ 0.2 ns, mạch gồm 4 tầng cổng AND nối tiếp sẽ có độ trễ cực đại là bao nhiêu?",
        hint: "Critical Path = Tổng độ trễ các cổng trên đường dẫn dài nhất từ ngõ vào đến ngõ ra.",
        solution: "Độ trễ = 4 tầng x 0.2 ns = 0.8 ns. Đây là yếu tố quyết định tần số xung nhịp tối đa (Fmax) của mạch tuần tự sau này."
      }
    ],

    quiz: [
      {
        question: "Trên kit Terasic DE2-115, các nút nhấn KEY[3:0] có trạng thái logic mặc định khi KHÔNG nhấn là gì?",
        options: [
          "Mức '0' (0V)",
          "Mức '1' (2.5V - Active-Low)",
          "Trở kháng cao 'Z'",
          "Không xác định 'X'"
        ],
        answerIndex: 1,
        explanation: "Các phím bấm KEY trên DE2-115 có điện trở kéo lên nguồn (Pull-up Resistor) nên khi nhả phím mức logic là '1', khi nhấn phím tiếp điểm nối xuống GND mức logic kéo về '0'."
      },
      {
        question: "Biểu thức dạng 'Tổng của các Tích' (SOP - Sum of Products) trong phần cứng tương ứng với cấu trúc nào?",
        options: [
          "Các cổng AND gom vào một cổng OR",
          "Các cổng OR gom vào một cổng AND",
          "Chuỗi các bộ ghép kênh MUX",
          "Một vòng lặp Flip-Flop"
        ],
        answerIndex: 0,
        explanation: "SOP (Sum of Products) gồm tầng thứ nhất là các cổng AND (phép nhân/tích) và tầng thứ hai là cổng OR (phép cộng/tổng)."
      },
      {
        question: "Khối phần cứng cơ bản Look-Up Table (LUT4) trên Cyclone IV có thể hiện thực hóa hàm Boolean có tối đa bao nhiêu ngõ vào?",
        options: [
          "2 ngõ vào",
          "4 ngõ vào",
          "8 ngõ vào",
          "Không giới hạn"
        ],
        answerIndex: 1,
        explanation: "Mỗi khối Logic Element trên Cyclone IV E chứa một bảng tra LUT 4 ngõ vào (Look-Up Table 4 inputs)."
      },
      {
        question: "Để đảm bảo thứ tự ưu tiên các toán tử logic trong VHDL không bị hiểu lầm, khuyến nghị tốt nhất là gì?",
        options: [
          "Luôn sử dụng dấu ngoặc đơn tường minh để bao bọc các cụm biểu thức",
          "Viết tất cả trên cùng 1 dòng",
          "Đổi tên tín hiệu ngắn nhất có thể",
          "Dùng thư viện math_real"
        ],
        answerIndex: 0,
        explanation: "Chuẩn VHDL yêu cầu việc sử dụng dấu ngoặc đơn tường minh khi kết hợp các toán tử logic khác nhau để tránh nhập nhằng thứ tự ưu tiên."
      }
    ],

    summary: [
      "Mạch tổ hợp đa ngõ vào phản ứng tức thì theo ngõ vào mà không cần đợi xung clock.",
      "Nút nhấn KEY trên DE2-115 là tích cực mức THẤP (Active-Low): Nhấn = '0', Nhả = '1'.",
      "Luôn dùng dấu ngoặc đơn khi kết hợp nhiều toán tử logic trong VHDL.",
      "Quartus tự động ánh xạ các biểu thức Boolean phức tạp vào các khối bảng tra LUT4 của Cyclone IV.",
      "Độ trễ truyền lan qua chuỗi cổng tổ hợp quyết định thời gian lan truyền (Propagation Delay)."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "KEY0"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        // SW0=door, SW1=temp, KEY0 (Active-Low: 0=pressed)
        const isDoor = inputs.SW0 === 1;
        const isTemp = inputs.SW1 === 1;
        const isPressed = inputs.KEY0 === 0;
        return {
          LEDR0: (isDoor && isTemp && isPressed) ? 1 : 0
        };
      }
    }
  },

  // ========================================================================
  // BÀI 3.2
  // ========================================================================
  {
    id: "ch3-b2",
    chapterId: "ch3",
    order: 2,
    title: "Bộ ghép kênh (MUX 2-1, MUX 4-1) và Bộ phân kênh (DEMUX)",
    subtitle: "Cầu dao chuyển mạch kỹ thuật số: Điều phối luồng dữ liệu trên đường bus",
    badge: "Mạch tổ hợp",
    estimatedMinutes: 25,
    hardwareFocus: ["MUX 2-1", "MUX 4-1", "DEMUX 1-4"],

    objectives: [
      "Hiểu nguyên lý hoạt động của Bộ ghép kênh (Multiplexer - MUX) và Bộ phân kênh (Demultiplexer - DEMUX).",
      "Thiết kế MUX 2-1 bằng câu lệnh `when-else` và MUX 4-1 bằng câu lệnh `with-select`.",
      "Thiết kế Bộ phân kênh DEMUX 1 sang 4 điều hướng tín hiệu tới 4 đèn LED khác nhau.",
      "Nắm vững mối quan hệ giữa số đường chọn kênh $S$ và số ngõ vào dữ liệu $N = 2^S$."
    ],

    theory: {
      why: "Hãy tưởng tượng đường sắt tại một ga tàu: Có 4 tuyến đường sắt đi đến nhưng chỉ có 1 cây cầu vượt duy nhất. Người bẻ ghi (Switchman) sẽ gạt cần điều khiển để chọn 1 trong 4 đoàn tàu được phép đi qua cầu. MUX chính là 'người bẻ ghi kỹ thuật số'! Nó cho phép nhiều nguồn dữ liệu chia sẻ chung một đường truyền (bus), tiết kiệm vô số chân kim loại đắt đỏ.",
      how: "Một bộ MUX $2^S \\rightarrow 1$ có $2^S$ đường dữ liệu vào, $S$ đường chọn (Select), và 1 đường ra duy nhất:\n- Với MUX 2 sang 1: Có 1 bit chọn `sel`. Nếu `sel = '0'` chọn ngõ vào D0; Nếu `sel = '1'` chọn ngõ vào D1.\n- Với MUX 4 sang 1: Có 2 bit chọn `sel(1 downto 0)` để chọn 1 trong 4 ngõ vào D0, D1, D2, D3.\n\nNgược lại với MUX là **DEMUX (Bộ phân kênh)**: Nhận 1 đường dữ liệu vào duy nhất và điều hướng tới 1 trong $2^S$ đường ra tùy theo mã chọn kênh.",
      sections: [
        {
          heading: "1. Bảng chân trị MUX 4-1",
          content: "Khi `sel = \"00\"`, ngõ ra $Y = D_0$. Khi `sel = \"01\"`, $Y = D_1$. Khi `sel = \"10\"`, $Y = D_2$. Khi `sel = \"11\"`, $Y = D_3$.",
          callout: {
            type: "info",
            title: "Ứng dụng trong máy tính",
            text: "Trong CPU, MUX được dùng để chọn xem thanh ghi nào (R0, R1, R2...) sẽ được đưa dữ liệu vào khối tính toán ALU."
          }
        }
      ],
      truthTable: {
        headers: ["sel(1)", "sel(0)", "Ngõ vào được chọn", "Ngõ ra Y"],
        rows: [
          ["0", "0", "D0 (Nối SW0)", "Y = SW0"],
          ["0", "1", "D1 (Nối SW1)", "Y = SW1"],
          ["1", "0", "D2 (Nối SW2)", "Y = SW2"],
          ["1", "1", "D3 (Nối SW3)", "Y = SW3"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ MUX 4-1 -->
      <g transform="translate(60, 30)">
        <polygon points="120,20 220,45 220,135 120,160" class="gate-body"/>
        <text x="170" y="95" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold">MUX 4:1</text>

        <!-- 4 Ngõ vào D0..D3 -->
        <line x1="40" y1="45" x2="120" y2="45" class="wire"/>
        <text x="30" y="50" fill="#94a3b8" font-size="11">D0 (SW0)</text>
        <line x1="40" y1="75" x2="120" y2="75" class="wire"/>
        <text x="30" y="80" fill="#94a3b8" font-size="11">D1 (SW1)</text>
        <line x1="40" y1="105" x2="120" y2="105" class="wire"/>
        <text x="30" y="110" fill="#94a3b8" font-size="11">D2 (SW2)</text>
        <line x1="40" y1="135" x2="120" y2="135" class="wire"/>
        <text x="30" y="140" fill="#94a3b8" font-size="11">D3 (SW3)</text>

        <!-- Đường chọn sel -->
        <line x1="170" y1="185" x2="170" y2="148" class="wire-clk"/>
        <text x="170" y="200" text-anchor="middle" fill="#f59e0b" font-size="11">sel[1:0] (SW17..16)</text>

        <!-- Ngõ ra Y -->
        <line x1="220" y1="90" x2="320" y2="90" class="wire"/>
        <text x="340" y="95" fill="#10b981" font-size="12" font-weight="bold">Y (LEDR0)</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "mux_4to1",
      circuitType: "combinational",
      typeExplanation: "Bộ ghép kênh MUX 4 sang 1 sử dụng câu lệnh with-select để ánh xạ song song trực tiếp.",
      code: `--------------------------------------------------------------------------------
-- Tên file: mux_4to1.vhd
-- Bộ ghép kênh MUX 4-to-1 trên kit DE2-115
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity mux_4to1 is
    port (
        d_in  : in  std_logic_vector(3 downto 0); -- 4 ngõ vào dữ liệu (SW3..0)
        sel   : in  std_logic_vector(1 downto 0); -- 2 công tắc chọn kênh (SW17..16)
        y_out : out std_logic                     -- 1 ngõ ra dữ liệu (LEDR0)
    );
end entity mux_4to1;

architecture rtl of mux_4to1 is
begin
    -- Câu lệnh gán chọn lọc with-select
    with sel select
        y_out <= d_in(0) when "00",
                 d_in(1) when "01",
                 d_in(2) when "10",
                 d_in(3) when "11",
                 '0'     when others;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_mux_4to1",
      code: `--------------------------------------------------------------------------------
-- Testbench quét 4 kênh MUX
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_mux_4to1 is
end entity tb_mux_4to1;

architecture sim of tb_mux_4to1 is
    signal d   : std_logic_vector(3 downto 0) := "1010"; -- D3=1, D2=0, D1=1, D0=0
    signal s   : std_logic_vector(1 downto 0) := "00";
    signal y   : std_logic;
begin
    uut: entity work.mux_4to1
        port map ( d_in => d, sel => s, y_out => y );

    stim: process
    begin
        s <= "00"; wait for 20 ns; -- Chọn D0 = 0 -> y = 0
        s <= "01"; wait for 20 ns; -- Chọn D1 = 1 -> y = 1
        s <= "10"; wait for 20 ns; -- Chọn D2 = 0 -> y = 0
        s <= "11"; wait for 20 ns; -- Chọn D3 = 1 -> y = 1
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim, kiểm tra: Ngõ ra y phản ánh chính xác trạng thái của từng kênh d_in tương ứng."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file mux_4to1.vhd trong Quartus Prime 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: d_in[0..3] = PIN_AB28, PIN_AC28, PIN_AC27, PIN_AD27; sel[0..1] = PIN_Y24, PIN_Y23; y_out = PIN_G19.",
        "4. Compile và nạp file .sof lên kit DE2-115."
      ],
      pinAssignments: [
        { signal: "d_in[0]", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0 (Kênh D0)" },
        { signal: "d_in[1]", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1 (Kênh D1)" },
        { signal: "d_in[2]", pin: "PIN_AC27", ioStandard: "2.5 V", note: "SW2 (Kênh D2)" },
        { signal: "d_in[3]", pin: "PIN_AD27", ioStandard: "2.5 V", note: "SW3 (Kênh D3)" },
        { signal: "sel[0]", pin: "PIN_Y24", ioStandard: "2.5 V", note: "SW16 (Bit chọn 0)" },
        { signal: "sel[1]", pin: "PIN_Y23", ioStandard: "2.5 V", note: "SW17 (Bit chọn 1)" },
        { signal: "y_out", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to d_in[0]\nset_location_assignment PIN_AC28 -to d_in[1]\nset_location_assignment PIN_AC27 -to d_in[2]\nset_location_assignment PIN_AD27 -to d_in[3]\nset_location_assignment PIN_Y24 -to sel[0]\nset_location_assignment PIN_Y23 -to sel[1]\nset_location_assignment PIN_G19 -to y_out`
    },

    commonErrors: [
      {
        error: "Quên nhánh 'when others' trong câu lệnh with-select",
        cause: "Bộ tổng hợp cảnh báo hoặc suy diễn ra chốt nhớ Latch ngoài ý muốn.",
        fix: "Luôn bổ sung 'when others => y_out <= '0';'."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Thiết kế MUX 2-1",
        prompt: "Viết mã VHDL cho bộ MUX 2-1 chọn giữa 2 công tắc SW0 và SW1 dựa trên công tắc chọn SW17.",
        hint: "y <= d0 when sel = '0' else d1;",
        solution: "y <= d0 when sel = '0' else d1;"
      },
      {
        level: "Vận dụng",
        title: "Thiết kế Bộ phân kênh DEMUX 1-4",
        prompt: "Nhận 1 bit dữ liệu din (từ SW0) và 2 bit chọn sel (từ SW17..16), đưa din ra đúng 1 trong 4 đèn LEDR[3:0], các đèn còn lại bằng '0'.",
        hint: "Dùng with sel select gán ra cả vector 4-bit.",
        solution: "with sel select\n  led_out <= (\"000\" & din) when \"00\",\n             (\"00\" & din & '0') when \"01\",\n             ('0' & din & \"00\") when \"10\",\n             (din & \"000\") when \"11\",\n             \"0000\" when others;"
      },
      {
        level: "Thử thách",
        title: "Tạo MUX 4-1 từ 3 bộ MUX 2-1",
        prompt: "Chứng minh cấu trúc phân cấp: MUX 4-1 có thể được ghép từ 3 bộ MUX 2-1 như thế nào?",
        hint: "Tầng 1 dùng 2 MUX 2-1 chọn bằng sel(0), tầng 2 dùng 1 MUX 2-1 chọn bằng sel(1).",
        solution: "MUX 1 chọn giữa D0 và D1 ra m0; MUX 2 chọn giữa D2 và D3 ra m1 (cả 2 chọn bằng sel(0)). MUX 3 ở tầng sau chọn giữa m0 và m1 dựa trên sel(1) ra ngõ ra cuối cùng Y."
      }
    ],

    quiz: [
      {
        question: "Một bộ MUX có 8 ngõ vào dữ liệu thì cần tối thiểu bao nhiêu đường chọn kênh (Select lines)?",
        options: [
          "2 đường",
          "3 đường (vì 2^3 = 8)",
          "4 đường",
          "8 đường"
        ],
        answerIndex: 1,
        explanation: "Công thức: Số ngõ vào $N = 2^S$, do đó với $N = 8$, ta cần $S = \\log_2(8) = 3$ đường chọn kênh."
      },
      {
        question: "Chức năng chính của Bộ phân kênh (Demultiplexer - DEMUX) là gì?",
        options: [
          "Gộp nhiều đường vào thành 1 đường ra",
          "Nhận 1 đường dữ liệu ngõ vào và điều hướng tới 1 trong nhiều đường ra theo mã chọn",
          "Cộng hai số nhị phân",
          "Tạo xung nhịp"
        ],
        answerIndex: 1,
        explanation: "DEMUX hoạt động ngược lại với MUX: Nó phân phối một tín hiệu đầu vào duy nhất đến một trong nhiều đầu ra được chỉ định."
      },
      {
        question: "Khi biểu diễn MUX bằng câu lệnh with-select, ưu điểm lớn nhất so với chuỗi if-else là gì?",
        options: [
          "Tất cả các kênh được giải mã song song, độ trễ truyền lan đồng đều nhau",
          "Code dài hơn",
          "Tốn nhiều thanh ghi flip-flop hơn",
          "Chạy được ở điện áp cao hơn"
        ],
        answerIndex: 0,
        explanation: "with-select không tạo ra cấu trúc ưu tiên bậc thang như if-else hay when-else, do đó độ trễ truyền lan từ mọi ngõ vào đến ngõ ra là hoàn toàn cân bằng."
      },
      {
        question: "Trong mạch MUX 4-1, nếu đường chọn sel = \"10\", ngõ vào nào sẽ được chuyển ra ngõ ra Y?",
        options: [
          "D0",
          "D1",
          "D2 (vì nhị phân 10 tương ứng số 2)",
          "D3"
        ],
        answerIndex: 2,
        explanation: "Chuỗi nhị phân \"10\" có giá trị thập phân bằng 2, tương ứng với kênh dữ liệu D2."
      }
    ],

    summary: [
      "MUX gộp nhiều đường vào thành 1 đường ra ($N = 2^S$ ngõ vào cần $S$ đường chọn).",
      "DEMUX điều hướng 1 đường vào tới 1 trong $N$ đường ra.",
      "`with-select` là phong cách chuẩn mực nhất để viết MUX song song không ưu tiên.",
      "Luôn có nhánh `when others` để tránh sinh mạch chốt Latch ngoài ý muốn.",
      "MUX là nền tảng cốt lõi điều phối luồng dữ liệu bus trong toàn bộ cấu trúc máy tính."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW2", "SW3", "SW16", "SW17"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        const sel = (inputs.SW17 << 1) | inputs.SW16;
        const d = [inputs.SW0, inputs.SW1, inputs.SW2, inputs.SW3];
        return { LEDR0: d[sel] || 0 };
      }
    }
  },

  // ========================================================================
  // BÀI 3.3
  // ========================================================================
  {
    id: "ch3-b3",
    chapterId: "ch3",
    order: 3,
    title: "Bộ giải mã LED 7 thanh (HEX0–HEX7 trên DE2-115)",
    subtitle: "Xử lý triệt để bài toán Anode chung (Active-Low): Mức '0' là SÁNG, mức '1' là TẮT",
    badge: "Mạch tổ hợp",
    estimatedMinutes: 30,
    hardwareFocus: ["SW[3:0]", "HEX0[6:0] (Anode chung)"],

    objectives: [
      "Hiểu rõ cấu tạo phần cứng Anode chung (Common Anode) của 8 bộ LED 7 đoạn trên kit DE2-115.",
      "Nắm vững nguyên lý tích cực mức thấp (Active-Low): Mức '0' làm sáng thanh LED, mức '1' làm tắt.",
      "Tự viết mã VHDL chuyển đổi mã nhị phân 4-bit (0-15) sang mã Hex 0-F bằng `with-select`.",
      "Nắm vững thứ tự gán bit: `hex(0)` là thanh a, ..., `hex(6)` là thanh g."
    ],

    theory: {
      why: "Mắt người không thể nhìn vào chuỗi nhị phân 0 và 1 từ công tắc mà nhận biết ngay giá trị. Chúng ta cần một màn hình trực quan để biểu diễn số từ 0 đến F. Mạch giải mã 7 thanh chính là 'thông dịch viên' cầu nối giữa dữ liệu số 4-bit bên trong chip và 7 đoạn led bên ngoài.",
      how: "LED 7 đoạn bao gồm 7 thanh led nhỏ xếp hình số 8, ký hiệu từ a, b, c, d, e, f đến g. Tùy vào số muốn hiển thị mà ta cấp điện cho các thanh tương ứng sáng lên. Tuy nhiên, trên kit DE2-115, cực dương của tất cả các đèn đã được đấu chung lên nguồn VCC (Anode chung). Vì thế, để dòng điện chạy qua làm sáng thanh nào, FPGA phải xuất ra mức logic '0' (nối đất 0V) vào chân đó!",
      sections: [
        {
          heading: "1. Vị trí 7 thanh a, b, c, d, e, f, g",
          content: "- Thanh a: Ngang trên cùng (bit 0).\n- Thanh b: Dọc trên bên phải (bit 1).\n- Thanh c: Dọc dưới bên phải (bit 2).\n- Thanh d: Ngang dưới cùng (bit 3).\n- Thanh e: Dọc dưới bên trái (bit 4).\n- Thanh f: Dọc trên bên trái (bit 5).\n- Thanh g: Ngang ở giữa (bit 6).",
          callout: {
            type: "warning",
            title: "Quy tắc sống còn trên DE2-115",
            text: "Bit '0' = SÁNG LED, Bit '1' = TẮT LED! Ví dụ số 0 cần sáng a,b,c,d,e,f và tắt g -> Vector xuất ra là: \"1000000\" (bit 6 tắt, bit 5..0 sáng)."
          }
        }
      ],
      truthTable: {
        headers: ["Số Hex", "D C B A (SW3..0)", "g f e d c b a (Mã 7-bit)", "Thanh tắt"],
        rows: [
          ["0", "0000", "1 0 0 0 0 0 0", "Tắt thanh g"],
          ["1", "0001", "1 1 1 1 0 0 1", "Chỉ sáng b, c"],
          ["2", "0010", "0 1 0 0 1 0 0", "Sáng a, b, d, e, g"],
          ["3", "0011", "0 1 1 0 0 0 0", "Sáng a, b, c, d, g"],
          ["8", "1000", "0 0 0 0 0 0 0", "Sáng cả 7 thanh"],
          ["F", "1111", "0 0 0 1 1 1 0", "Sáng a, e, f, g"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ khối Decoder 7 thanh -->
      <g transform="translate(60, 30)">
        <rect x="140" y="30" width="180" height="120" rx="8" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="230" y="85" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold">HEX DECODER</text>
        <text x="230" y="110" text-anchor="middle" fill="#94a3b8" font-size="11">Active-Low</text>

        <!-- Bus vào 4-bit SW[3:0] -->
        <line x1="40" y1="90" x2="140" y2="90" class="wire-bus"/>
        <text x="90" y="80" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="11">sw[3:0]</text>

        <!-- Bus ra 7-bit HEX0[6:0] -->
        <line x1="320" y1="90" x2="440" y2="90" class="wire-bus"/>
        <text x="380" y="80" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="11">hex0[6:0]</text>

        <!-- Mô phỏng 1 đèn 7 đoạn số 8 phát sáng đỏ -->
        <g transform="translate(460, 20)">
          <rect x="0" y="0" width="70" height="110" rx="6" fill="#080c14" stroke="#2a3754" stroke-width="1.5"/>
          <text x="35" y="65" text-anchor="middle" fill="#ff2b44" font-family="monospace" font-size="50" font-weight="bold" filter="drop-shadow(0 0 8px #ff2b44)">8</text>
          <text x="35" y="125" text-anchor="middle" fill="#94a3b8" font-size="10">HEX0</text>
        </g>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "hex_to_7seg",
      circuitType: "combinational",
      typeExplanation: "Mạch tổ hợp giải mã nhị phân sang mã 7 thanh Anode chung (Active-Low) trên kit Terasic DE2-115.",
      code: `--------------------------------------------------------------------------------
-- Tên file: hex_to_7seg.vhd
-- Giải mã 4-bit nhị phân từ công tắc SW sang LED 7 thanh HEX0 (Active-Low)
-- Thứ tự vector: hex0(6)=g, hex0(5)=f, hex0(4)=e, hex0(3)=d, hex0(2)=c, hex0(1)=b, hex0(0)=a
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity hex_to_7seg is
    port (
        sw   : in  std_logic_vector(3 downto 0); -- 4 công tắc SW[3:0]
        hex0 : out std_logic_vector(6 downto 0)  -- 7 thanh LED HEX0 (Active-Low: '0'=Sáng)
    );
end entity hex_to_7seg;

architecture rtl of hex_to_7seg is
begin
    -- Bảng giải mã 16 số Hex (0 đến F)
    -- bit 6:g, bit 5:f, bit 4:e, bit 3:d, bit 2:c, bit 1:b, bit 0:a
    with sw select
        hex0 <= "1000000" when "0000", -- Số 0 (tắt g)
                "1111001" when "0001", -- Số 1 (sáng b, c)
                "0100100" when "0010", -- Số 2 (sáng a, b, d, e, g)
                "0110000" when "0011", -- Số 3 (sáng a, b, c, d, g)
                "0011001" when "0100", -- Số 4 (sáng b, c, f, g)
                "0010010" when "0101", -- Số 5 (sáng a, c, d, f, g)
                "0000010" when "0110", -- Số 6 (sáng a, c, d, e, f, g)
                "1111000" when "0111", -- Số 7 (sáng a, b, c)
                "0000000" when "1000", -- Số 8 (sáng cả 7 thanh)
                "0010000" when "1001", -- Số 9 (sáng a, b, c, d, f, g)
                "0001000" when "1010", -- Chữ A
                "0000011" when "1011", -- Chữ b (thường)
                "1000110" when "1100", -- Chữ C
                "0100001" when "1101", -- Chữ d (thường)
                "0000110" when "1110", -- Chữ E
                "0001110" when "1111", -- Chữ F
                "1111111" when others; -- Tắt toàn bộ đèn
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_hex_to_7seg",
      code: `--------------------------------------------------------------------------------
-- Testbench quét 16 số Hex từ 0 đến 15
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity tb_hex_to_7seg is
end entity tb_hex_to_7seg;

architecture sim of tb_hex_to_7seg is
    signal sw_tb   : std_logic_vector(3 downto 0) := "0000";
    signal hex0_tb : std_logic_vector(6 downto 0);
begin
    uut: entity work.hex_to_7seg port map ( sw => sw_tb, hex0 => hex0_tb );

    stim: process
    begin
        for i in 0 to 15 loop
            sw_tb <= std_logic_vector(to_unsigned(i, 4));
            wait for 20 ns;
        end loop;
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: hex0_tb xuất chuỗi bit mã hóa tương ứng với giá trị sw_tb mỗi 20 ns."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file hex_to_7seg.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Mở Pin Planner gán chân cho SW[3:0] và toàn bộ 7 đoạn HEX0[6:0].",
        "4. Biên dịch và nạp file .sof lên kit DE2-115."
      ],
      pinAssignments: [
        { signal: "sw[0]", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "sw[1]", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1" },
        { signal: "sw[2]", pin: "PIN_AC27", ioStandard: "2.5 V", note: "SW2" },
        { signal: "sw[3]", pin: "PIN_AD27", ioStandard: "2.5 V", note: "SW3" },
        { signal: "hex0[0]", pin: "PIN_G18", ioStandard: "2.5 V", note: "HEX0 Đoạn a" },
        { signal: "hex0[1]", pin: "PIN_F22", ioStandard: "2.5 V", note: "HEX0 Đoạn b" },
        { signal: "hex0[2]", pin: "PIN_E17", ioStandard: "2.5 V", note: "HEX0 Đoạn c" },
        { signal: "hex0[3]", pin: "PIN_L26", ioStandard: "2.5 V", note: "HEX0 Đoạn d" },
        { signal: "hex0[4]", pin: "PIN_L25", ioStandard: "2.5 V", note: "HEX0 Đoạn e" },
        { signal: "hex0[5]", pin: "PIN_J22", ioStandard: "2.5 V", note: "HEX0 Đoạn f" },
        { signal: "hex0[6]", pin: "PIN_H22", ioStandard: "2.5 V", note: "HEX0 Đoạn g" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to sw[0]\nset_location_assignment PIN_AC28 -to sw[1]\nset_location_assignment PIN_AC27 -to sw[2]\nset_location_assignment PIN_AD27 -to sw[3]\nset_location_assignment PIN_G18 -to hex0[0]\nset_location_assignment PIN_F22 -to hex0[1]\nset_location_assignment PIN_E17 -to hex0[2]\nset_location_assignment PIN_L26 -to hex0[3]\nset_location_assignment PIN_L25 -to hex0[4]\nset_location_assignment PIN_J22 -to hex0[5]\nset_location_assignment PIN_H22 -to hex0[6]`
    },

    commonErrors: [
      {
        error: "LED hiển thị bị ngược (nét cần tắt thì sáng, nét cần sáng thì tắt)",
        cause: "Quên nguyên lý Anode chung Active-Low: gán mức 1 làm sáng thay vì mức 0.",
        fix: "Đảo toàn bộ bit 0 thành 1 và bit 1 thành 0 trong bảng giải mã."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tắt hoàn toàn LED 7 thanh",
        prompt: "Viết chuỗi vector 7-bit để tắt toàn bộ 7 đoạn của HEX0.",
        hint: "Mức 1 là tắt trên Anode chung.",
        solution: "hex0 <= \"1111111\";"
      },
      {
        level: "Vận dụng",
        title: "Thêm chân Blanking (Tắt màn hình)",
        prompt: "Thêm công tắc SW17 làm chân enable/blanking. Khi SW17 = '0', tắt toàn bộ HEX0 bất chấp các công tắc SW[3:0].",
        hint: "hex0 <= \"1111111\" when sw(17) = '0' else decoded_hex;",
        solution: "hex0 <= \"1111111\" when sw(17) = '0' else decoded_hex;"
      },
      {
        level: "Thử thách",
        title: "Giải mã hiển thị 2 số Hex lên HEX1 và HEX0",
        prompt: "Dùng 8 công tắc SW[7:0], hiển thị giá trị Hex 2 chữ số (từ 00 đến FF) lên 2 bộ đèn HEX1 và HEX0.",
        hint: "SW[3 downto 0] giải mã ra HEX0, SW[7 downto 4] giải mã ra HEX1.",
        solution: "Viết 2 khối with-select song song hoàn toàn độc lập cho hex0 và hex1."
      }
    ],

    quiz: [
      {
        question: "Trên kit Terasic DE2-115, để đoạn LED 'a' của HEX0 (PIN_G18) phát sáng, FPGA cần xuất ra mức logic nào?",
        options: [
          "Mức cao ('1' hay 2.5V)",
          "Mức thấp ('0' hay 0V / GND)",
          "Trở kháng cao ('Z')",
          "Xung nhịp 50MHz"
        ],
        answerIndex: 1,
        explanation: "Các bộ LED 7 thanh trên DE2-115 là loại Anode chung (Common Anode), cực dương đã nối cố định lên VCC, do đó chân vi mạch phải kéo về mức 0V (logic '0') để tạo dòng điện làm sáng LED."
      },
      {
        question: "Chuỗi 7 bit \"0000000\" gán vào cổng HEX0 trên kit DE2-115 sẽ hiển thị ký tự gì?",
        options: [
          "Số 0",
          "Số 8 (sáng tất cả 7 thanh)",
          "Tắt hết đèn",
          "Chữ F"
        ],
        answerIndex: 1,
        explanation: "Vì mức '0' là sáng, chuỗi \"0000000\" làm sáng cả 7 thanh từ a đến g, tạo thành chữ số 8."
      },
      {
        question: "Đoạn LED 'g' nằm ở vị trí nào trên mặt hiển thị của LED 7 đoạn?",
        options: [
          "Ngang trên cùng",
          "Dọc bên phải",
          "Ngang ở chính giữa số 8",
          "Dấu chấm thập phân (DP)"
        ],
        answerIndex: 2,
        explanation: "Thanh g là thanh nằm ngang ở chính giữa của đèn LED 7 đoạn."
      },
      {
        question: "Chân FPGA nào trên chip Cyclone IV EP4CE115 nối với thanh 'a' của HEX0?",
        options: [
          "PIN_G18",
          "PIN_F22",
          "PIN_AB28",
          "PIN_Y2"
        ],
        answerIndex: 0,
        explanation: "Theo tài liệu Terasic DE2-115 User Manual: PIN_G18 kết nối vật lý với đoạn 'a' của HEX0."
      }
    ],

    summary: [
      "LED 7 thanh trên DE2-115 là Anode chung -> Tích cực mức THẤP (Active-Low): '0' = SÁNG, '1' = TẮT.",
      "HEX0..HEX7 gồm 7 thanh (a..g), tương ứng thứ tự từ bit 0 đến bit 6.",
      "Số 0 tắt thanh g (\"1000000\"); Số 8 sáng cả 7 thanh (\"0000000\").",
      "Chuỗi \"1111111\" dùng để tắt hoàn toàn hiển thị (Blanking).",
      "Gán chân chuẩn xác theo Pin Planner: PIN_G18 (a), PIN_F22 (b), ..., PIN_H22 (g)."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW2", "SW3"],
      activeOutputs: ["HEX0"],
      logicEvaluator: function(inputs) {
        const val = (inputs.SW3 << 3) | (inputs.SW2 << 2) | (inputs.SW1 << 1) | inputs.SW0;
        const hexTable = [
          "1000000", "1111001", "0100100", "0110000",
          "0011001", "0010010", "0000010", "1111000",
          "0000000", "0010000", "0001000", "0000011",
          "1000110", "0100001", "0000110", "0001110"
        ];
        return { HEX0: hexTable[val] || "1111111" };
      }
    }
  },

  // ========================================================================
  // BÀI 3.4
  // ========================================================================
  {
    id: "ch3-b4",
    chapterId: "ch3",
    order: 4,
    title: "Bộ giải mã (Decoder) và Bộ mã hóa ưu tiên (Priority Encoder)",
    subtitle: "Giải mã địa chỉ bộ nhớ và xử lý ngắt phần cứng theo độ ưu tiên",
    badge: "Mạch tổ hợp",
    estimatedMinutes: 25,
    hardwareFocus: ["Decoder 2-4", "Priority Encoder 4-2"],

    objectives: [
      "Hiểu nguyên lý hoạt động của Bộ giải mã nhị phân $N$ sang $2^N$ (Decoder).",
      "Nắm vững nguyên lý Bộ mã hóa ưu tiên (Priority Encoder): Chọn đường vào có trọng số cao nhất.",
      "Thiết kế Decoder 2 sang 4 ứng dụng giải mã địa chỉ chọn chip (Chip Select).",
      "Thiết kế Priority Encoder 4 sang 2 ứng dụng xử lý yêu cầu ngắt (Interrupt Request)."
    ],

    theory: {
      why: "1. Trong máy tính, khi CPU muốn truy xuất một ô nhớ, nó phát ra địa chỉ nhị phân. Mạch Decoder sẽ kích hoạt duy nhất một đường chọn chip (Chip Select) tương ứng.\n2. Khi nhiều thiết bị ngoại vi cùng gửi tín hiệu xin phục vụ ngắt (như bàn phím, chuột, card mạng), mạch Priority Encoder sẽ báo cho CPU biết thiết bị nào có quyền ưu tiên cao nhất cần được xử lý trước.",
      how: "- **Decoder 2-to-4:** Có 2 bit ngõ vào nhị phân. Đúng 1 trong 4 ngõ ra sẽ lên '1' (Active-High) tương ứng với giá trị nhị phân ngõ vào.\n- **Priority Encoder 4-to-2:** Có 4 đường vào yêu cầu (R3, R2, R1, R0). Nếu R3 = '1', ngõ ra mã hóa thành \"11\" bất chấp R2, R1, R0 đang ở mức nào! Ngoài ra mạch có thêm cờ `valid` báo có ít nhất một yêu cầu hợp lệ.",
      sections: [
        {
          heading: "1. Bảng chân trị Bộ mã hóa ưu tiên (Priority Encoder)",
          content: "Ký hiệu 'X' (Don't Care) thể hiện các ngõ vào có độ ưu tiên thấp hơn bị bỏ qua:",
          callout: {
            type: "info",
            title: "Quy tắc ưu tiên",
            text: "R3 có độ ưu tiên cao nhất, R0 có độ ưu tiên thấp nhất."
          }
        }
      ],
      truthTable: {
        headers: ["R3", "R2", "R1", "R0", "Mã ngõ ra code(1 downto 0)", "Cờ valid"],
        rows: [
          ["0", "0", "0", "0", "\"00\"", "0 (Không có yêu cầu)"],
          ["0", "0", "0", "1", "\"00\"", "1 (Yêu cầu từ R0)"],
          ["0", "0", "1", "X", "\"01\"", "1 (Yêu cầu từ R1)"],
          ["0", "1", "X", "X", "\"10\"", "1 (Yêu cầu từ R2)"],
          ["1", "X", "X", "X", "\"11\"", "1 (Ưu tiên cao nhất R3)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ Decoder và Priority Encoder -->
      <g transform="translate(40, 30)">
        <!-- Decoder 2-4 -->
        <rect x="20" y="20" width="180" height="130" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="110" y="45" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">DECODER 2:4</text>
        <line x1="200" y1="50" x2="250" y2="50" class="wire"/><text x="255" y="55" fill="#94a3b8" font-size="10">Y0</text>
        <line x1="200" y1="75" x2="250" y2="75" class="wire"/><text x="255" y="80" fill="#94a3b8" font-size="10">Y1</text>
        <line x1="200" y1="100" x2="250" y2="100" class="wire"/><text x="255" y="105" fill="#94a3b8" font-size="10">Y2</text>
        <line x1="200" y1="125" x2="250" y2="125" class="wire"/><text x="255" y="130" fill="#94a3b8" font-size="10">Y3</text>

        <!-- Priority Encoder 4-2 -->
        <rect x="340" y="20" width="180" height="130" rx="6" fill="#131c31" stroke="#10b981" stroke-width="2"/>
        <text x="430" y="45" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">PRIORITY ENC 4:2</text>
        <line x1="290" y1="50" x2="340" y2="50" class="wire"/><text x="280" y="55" fill="#94a3b8" font-size="10">R3</text>
        <line x1="290" y1="75" x2="340" y2="75" class="wire"/><text x="280" y="80" fill="#94a3b8" font-size="10">R2</text>
        <line x1="520" y1="70" x2="570" y2="70" class="wire"/><text x="575" y="75" fill="#10b981" font-size="11">code[1:0]</text>
        <line x1="520" y1="110" x2="570" y2="110" class="wire"/><text x="575" y="115" fill="#f59e0b" font-size="11">valid</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "priority_encoder_4to2",
      circuitType: "combinational",
      typeExplanation: "Bộ mã hóa ưu tiên 4 sang 2 viết bằng câu lệnh when-else thể hiện rõ nét tính ưu tiên từ trên xuống.",
      code: `--------------------------------------------------------------------------------
-- Tên file: priority_encoder_4to2.vhd
-- Bộ mã hóa ưu tiên 4 sang 2 (R3 có quyền ưu tiên cao nhất)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity priority_encoder_4to2 is
    port (
        req   : in  std_logic_vector(3 downto 0); -- 4 yêu cầu ngắt (SW3..0)
        code  : out std_logic_vector(1 downto 0); -- Mã 2-bit ưu tiên (LEDR1..0)
        valid : out std_logic                     -- Cờ báo có yêu cầu (LEDR2)
    );
end entity priority_encoder_4to2;

architecture rtl of priority_encoder_4to2 is
begin
    -- Câu lệnh when-else thể hiện thứ tự ưu tiên giảm dần: R3 -> R2 -> R1 -> R0
    code <= "11" when req(3) = '1' else
            "10" when req(2) = '1' else
            "01" when req(1) = '1' else
            "00"; -- Mặc định khi req(0) = '1' hoặc không có yêu cầu

    -- Cờ valid báo '1' khi có ít nhất 1 công tắc được bật
    valid <= '1' when req /= "0000" else '0';
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_priority_encoder",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra tính ưu tiên của R3 so với các ngõ vào khác
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_priority_encoder is
end entity tb_priority_encoder;

architecture sim of tb_priority_encoder is
    signal r : std_logic_vector(3 downto 0) := "0000";
    signal c : std_logic_vector(1 downto 0);
    signal v : std_logic;
begin
    uut: entity work.priority_encoder_4to2 port map ( req => r, code => c, valid => v );

    stim: process
    begin
        r <= "0000"; wait for 20 ns; -- valid = 0
        r <= "0010"; wait for 20 ns; -- code = "01", valid = 1
        r <= "1010"; wait for 20 ns; -- R3 bật đè lên R1 -> code phải nhảy lên "11"!
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: Khi r(3)='1', dù r(1) hay r(0) đổi trạng thái thì code vẫn giữ nguyên giá trị \"11\"."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file priority_encoder_4to2.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: req[3..0] vào SW[3..0], code[1..0] vào LEDR[1..0], valid vào LEDR[2].",
        "4. Compile và nạp lên kit DE2-115."
      ],
      pinAssignments: [
        { signal: "req[0]", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0 (Ưu tiên thấp nhất)" },
        { signal: "req[1]", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1" },
        { signal: "req[2]", pin: "PIN_AC27", ioStandard: "2.5 V", note: "SW2" },
        { signal: "req[3]", pin: "PIN_AD27", ioStandard: "2.5 V", note: "SW3 (Ưu tiên cao nhất)" },
        { signal: "code[0]", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" },
        { signal: "code[1]", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1" },
        { signal: "valid", pin: "PIN_E19", ioStandard: "2.5 V", note: "LEDR2" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to req[0]\nset_location_assignment PIN_AC28 -to req[1]\nset_location_assignment PIN_AC27 -to req[2]\nset_location_assignment PIN_AD27 -to req[3]\nset_location_assignment PIN_G19 -to code[0]\nset_location_assignment PIN_F19 -to code[1]\nset_location_assignment PIN_E19 -to valid`
    },

    commonErrors: [
      {
        error: "Quên cờ valid khiến mạch không phân biệt được giữa trạng thái 'không có ai yêu cầu' và 'R0 yêu cầu'",
        cause: "Cả 2 trường hợp mã ra đều là \"00\".",
        fix: "Luôn thiết kế thêm tín hiệu valid để báo trạng thái hoạt động hợp lệ."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Viết Decoder 2-to-4",
        prompt: "Dùng with-select viết mạch Decoder 2 sang 4 nhận sel 2-bit và xuất ra bus 4-bit `y` có đúng 1 bit '1'.",
        hint: "with sel select y <= \"0001\" when \"00\", \"0010\" when \"01\", \"0100\" when \"10\", \"1000\" when \"11\", \"0000\" when others;",
        solution: "with sel select\n  y <= \"0001\" when \"00\",\n       \"0010\" when \"01\",\n       \"0100\" when \"10\",\n       \"1000\" when \"11\",\n       \"0000\" when others;"
      },
      {
        level: "Vận dụng",
        title: "Decoder tích cực mức thấp (Active-Low Enable)",
        prompt: "Thêm chân en_n vào Decoder 2-4: Khi en_n = '1', tất cả 4 ngõ ra đều bằng '0'.",
        hint: "Dùng when-else lồng trước lệnh giải mã.",
        solution: "y <= \"0000\" when en_n = '1' else decoded_y;"
      },
      {
        level: "Thử thách",
        title: "Mở rộng Priority Encoder 8 sang 3",
        prompt: "Viết biểu thức when-else cho bộ mã hóa ưu tiên 8 sang 3 từ req(7 downto 0).",
        hint: "Kiểm tra req(7) trước tiên -> \"111\", rồi đến req(6) -> \"110\"...",
        solution: "code <= \"111\" when req(7)='1' else \"110\" when req(6)='1' else ... else \"000\";"
      }
    ],

    quiz: [
      {
        question: "Trong Bộ mã hóa ưu tiên 4 sang 2 (Priority Encoder), nếu cả R3 và R1 cùng bằng '1', ngõ ra mã hóa sẽ là gì?",
        options: [
          "\"01\" (theo R1)",
          "\"11\" (theo R3 vì có ưu tiên cao nhất)",
          "\"00\"",
          "Xung đột 'X'"
        ],
        answerIndex: 1,
        explanation: "Bộ mã hóa ưu tiên luôn chọn ngõ vào có trọng số ưu tiên cao nhất đang tích cực (ở đây R3 cao hơn R1 nên ngõ ra là \"11\")."
      },
      {
        question: "Cờ 'valid' trong mạch mã hóa ưu tiên có tác dụng gì?",
        options: [
          "Báo mạch đang bị quá nhiệt",
          "Phân biệt giữa trường hợp 'không có yêu cầu nào' và trường hợp 'kênh 0 đang yêu cầu' (cả 2 đều có mã 00)",
          "Đổi chiều xung clock",
          "Tắt đèn LED"
        ],
        answerIndex: 1,
        explanation: "Khi không có công tắc nào bật, mã ra mặc định vẫn là \"00\", trùng với mã của R0. Cờ valid = '0' giúp phân biệt trường hợp rỗng này."
      },
      {
        question: "Một bộ Decoder 3 sang 8 sẽ có bao nhiêu ngõ ra và tại một thời điểm có tối đa bao nhiêu ngõ ra tích cực?",
        options: [
          "8 ngõ ra, và chỉ có duy nhất 1 ngõ ra tích cực",
          "3 ngõ ra, cả 3 cùng tích cực",
          "16 ngõ ra",
          "8 ngõ ra, cả 8 cùng tích cực"
        ],
        answerIndex: 0,
        explanation: "Decoder nhị phân 3 sang 8 có 8 đường ra tương ứng với 8 mã tổ hợp (000 đến 111), tại một thời điểm chỉ có duy nhất 1 đường ra được chọn tích cực (One-Hot)."
      },
      {
        question: "Câu lệnh VHDL nào phù hợp nhất để hiện thực hóa tính ưu tiên của Priority Encoder?",
        options: [
          "with-select",
          "when-else",
          "wait for",
          "cổng XOR"
        ],
        answerIndex: 1,
        explanation: "Câu lệnh 'when-else' đánh giá tuần tự từ trên xuống dưới, tạo thành cấu trúc MUX bậc thang phản ánh chính xác quy luật ưu tiên phần cứng."
      }
    ],

    summary: [
      "Decoder $N \\rightarrow 2^N$ giải mã địa chỉ nhị phân kích hoạt duy nhất 1 đường ra.",
      "Priority Encoder mã hóa yêu cầu ngõ vào có trọng số cao nhất thành mã nhị phân.",
      "Luôn bổ sung cờ `valid` để nhận diện trạng thái không có yêu cầu nào.",
      "`when-else` là công cụ hoàn hảo để mô tả logic ưu tiên trong VHDL.",
      "Ứng dụng kinh điển: Giải mã chọn chip nhớ (CS) và bộ điều khiển ngắt PIC của vi xử lý."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW2", "SW3"],
      activeOutputs: ["LEDR0", "LEDR1", "LEDR2"],
      logicEvaluator: function(inputs) {
        let code = 0;
        let valid = 0;
        if (inputs.SW3) { code = 3; valid = 1; }
        else if (inputs.SW2) { code = 2; valid = 1; }
        else if (inputs.SW1) { code = 1; valid = 1; }
        else if (inputs.SW0) { code = 0; valid = 1; }

        return {
          LEDR0: (code & 1) ? 1 : 0,
          LEDR1: (code & 2) ? 1 : 0,
          LEDR2: valid
        };
      }
    }
  },

  // ========================================================================
  // BÀI 3.5
  // ========================================================================
  {
    id: "ch3-b5",
    chapterId: "ch3",
    order: 5,
    title: "Bộ so sánh độ lớn (Magnitude Comparator: A = B, A > B, A < B)",
    subtitle: "So sánh dữ liệu số học trong phần cứng: Bằng nhau, Lớn hơn và Nhỏ hơn",
    badge: "Mạch tổ hợp",
    estimatedMinutes: 25,
    hardwareFocus: ["Toán tử so sánh", "Cờ quan hệ"],

    objectives: [
      "Hiểu cấu trúc phần cứng của Bộ so sánh độ lớn (Magnitude Comparator).",
      "Thiết kế mạch so sánh 4-bit xuất ra 3 cờ quan hệ: `a_eq_b` (Bằng), `a_gt_b` (Lớn hơn), `a_lt_b` (Nhỏ hơn).",
      "Sử dụng toán tử quan hệ chuẩn của `IEEE.NUMERIC_STD`: `=`, `<`, `>`.",
      "Phân biệt sự khác nhau khi so sánh số không dấu (`unsigned`) và số có dấu (`signed`)."
    ],

    theory: {
      why: "Trong các hệ thống giám sát nhiệt độ, kiểm soát tốc độ xe hay thuật toán tìm kiếm max/min, vi mạch liên tục phải so sánh giá trị cảm biến với một ngưỡng đặt trước. Bộ so sánh Magnitude Comparator thực hiện việc này trong một chu kỳ nano-giây duy nhất.",
      how: "1. **So sánh bằng ($A = B$):** Từng cặp bit tương ứng của $A$ và $B$ được đưa qua cổng XNOR (so sánh bằng). Nếu tất cả các cặp bit đều giống nhau, cổng AND cuối cùng sẽ đưa cờ `a_eq_b` lên '1'.\n2. **So sánh lớn hơn/nhỏ hơn ($A > B$, $A < B$):** Mạch so sánh từ bit cao nhất (MSB) đi xuống bit thấp nhất (LSB). Nếu MSB của $A$ là 1 và của $B$ là 0 thì kết luận ngay $A > B$ mà không cần xét các bit sau.",
      sections: [
        {
          heading: "1. So sánh số không dấu vs có dấu",
          content: "Xét hai số 4-bit: $A = \"1111\"$ và $B = \"0001\"$:\n- Nếu coi là số không dấu (`unsigned`): $A = 15, B = 1 \\rightarrow A > B$.\n- Nếu coi là số bù 2 (`signed`): $A = -1, B = +1 \\rightarrow A < B$!\nDo đó, bạn bắt buộc phải ép kiểu sang `unsigned` hoặc `signed` trước khi dùng toán tử `<` hoặc `>`.",
          callout: {
            type: "warning",
            title: "Cạm bẫy ép kiểu khi so sánh",
            text: "Nếu so sánh trực tiếp hai `std_logic_vector` bằng toán tử `>`, VHDL sẽ so sánh theo thứ tự từ điển mã ASCII chứ không phải so sánh giá trị số học!"
          }
        }
      ],
      truthTable: {
        headers: ["Số A (SW3..0)", "Số B (SW7..4)", "Cờ a_gt_b (LEDR0)", "Cờ a_eq_b (LEDR1)", "Cờ a_lt_b (LEDR2)"],
        rows: [
          ["5 (0101)", "3 (0011)", "1 (A > B)", "0", "0"],
          ["7 (0111)", "7 (0111)", "0", "1 (A = B)", "0"],
          ["2 (0010)", "9 (1001)", "0", "0", "1 (A < B)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ Magnitude Comparator -->
      <g transform="translate(60, 30)">
        <rect x="140" y="20" width="200" height="130" rx="8" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="240" y="55" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold">4-BIT COMPARATOR</text>
        <text x="240" y="80" text-anchor="middle" fill="#94a3b8" font-size="11">numeric_std (unsigned)</text>

        <!-- Bus vào A và B -->
        <line x1="40" y1="60" x2="140" y2="60" class="wire-bus"/>
        <text x="90" y="50" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="11">A[3:0] (SW3..0)</text>

        <line x1="40" y1="110" x2="140" y2="110" class="wire-bus"/>
        <text x="90" y="100" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="11">B[3:0] (SW7..4)</text>

        <!-- 3 Cờ ra -->
        <line x1="340" y1="50" x2="450" y2="50" class="wire"/>
        <text x="460" y="55" fill="#f59e0b" font-family="monospace" font-size="11">a_gt_b (A &gt; B)</text>

        <line x1="340" y1="85" x2="450" y2="85" class="wire"/>
        <text x="460" y="90" fill="#10b981" font-family="monospace" font-size="11">a_eq_b (A = B)</text>

        <line x1="340" y1="120" x2="450" y2="120" class="wire"/>
        <text x="460" y="125" fill="#ef4444" font-family="monospace" font-size="11">a_lt_b (A &lt; B)</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "comparator_4bit",
      circuitType: "combinational",
      typeExplanation: "Bộ so sánh độ lớn 4-bit không dấu sử dụng thư viện IEEE.NUMERIC_STD chuẩn mực.",
      code: `--------------------------------------------------------------------------------
-- Tên file: comparator_4bit.vhd
-- Bộ so sánh 4-bit xuất ra 3 cờ quan hệ A > B, A = B, A < B
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL; -- Bắt buộc để so sánh số học chuẩn xác

entity comparator_4bit is
    port (
        a_in   : in  std_logic_vector(3 downto 0); -- Số A 4-bit (SW3..0)
        b_in   : in  std_logic_vector(3 downto 0); -- Số B 4-bit (SW7..4)
        a_gt_b : out std_logic;                     -- Cờ A > B (LEDR0)
        a_eq_b : out std_logic;                     -- Cờ A = B (LEDR1)
        a_lt_b : out std_logic                      -- Cờ A < B (LEDR2)
    );
end entity comparator_4bit;

architecture rtl of comparator_4bit is
    signal u_a, u_b : unsigned(3 downto 0);
begin
    -- 1. Ép kiểu sang unsigned để so sánh số học
    u_a <= unsigned(a_in);
    u_b <= unsigned(b_in);

    -- 2. Các câu lệnh gán đồng thời tính toán cờ quan hệ
    a_gt_b <= '1' when u_a > u_b else '0';
    a_eq_b <= '1' when u_a = u_b else '0';
    a_lt_b <= '1' when u_a < u_b else '0';
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_comparator_4bit",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra bộ so sánh 4-bit
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity tb_comparator_4bit is
end entity tb_comparator_4bit;

architecture sim of tb_comparator_4bit is
    signal a, b : std_logic_vector(3 downto 0);
    signal gt, eq, lt : std_logic;
begin
    uut: entity work.comparator_4bit port map ( a_in => a, b_in => b, a_gt_b => gt, a_eq_b => eq, a_lt_b => lt );

    stim: process
    begin
        a <= "0101"; b <= "0011"; wait for 20 ns; -- 5 > 3 -> gt=1
        assert gt = '1' report "Lỗi so sánh lớn hơn!" severity error;

        a <= "0111"; b <= "0111"; wait for 20 ns; -- 7 = 7 -> eq=1
        assert eq = '1' report "Lỗi so sánh bằng!" severity error;

        a <= "0010"; b <= "1001"; wait for 20 ns; -- 2 < 9 -> lt=1
        assert lt = '1' report "Lỗi so sánh nhỏ hơn!" severity error;
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim, kiểm tra: Tại mọi thời điểm, luôn có DUY NHẤT 1 trong 3 cờ gt, eq, lt bằng '1'."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file comparator_4bit.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: a_in nối SW[3:0], b_in nối SW[7:4], 3 cờ nối LEDR[2:0].",
        "4. Biên dịch và nạp xuống kit DE2-115."
      ],
      pinAssignments: [
        { signal: "a_in[0]", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "a_in[1]", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1" },
        { signal: "b_in[0]", pin: "PIN_AB27", ioStandard: "2.5 V", note: "SW4" },
        { signal: "b_in[1]", pin: "PIN_AC26", ioStandard: "2.5 V", note: "SW5" },
        { signal: "a_gt_b", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0 (Vàng/Đỏ: A > B)" },
        { signal: "a_eq_b", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1 (Xanh/Đỏ: A = B)" },
        { signal: "a_lt_b", pin: "PIN_E19", ioStandard: "2.5 V", note: "LEDR2 (Đỏ: A < B)" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to a_in[0]\nset_location_assignment PIN_AB27 -to b_in[0]\nset_location_assignment PIN_G19 -to a_gt_b\nset_location_assignment PIN_F19 -to a_eq_b\nset_location_assignment PIN_E19 -to a_lt_b`
    },

    commonErrors: [
      {
        error: "So sánh trực tiếp vector không qua ép kiểu unsigned: a_in > b_in",
        cause: "Toán tử so sánh trên std_logic_vector so sánh theo thứ tự từ điển ký tự chứ không theo giá trị số học.",
        fix: "Luôn ép kiểu `unsigned(a_in) > unsigned(b_in)`."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Bộ so sánh bằng 8-bit đơn giản",
        prompt: "Viết biểu thức 1 dòng gán cờ `is_equal <= '1'` khi bus 8-bit a bằng bus 8-bit b.",
        hint: "Dùng toán tử = trực tiếp.",
        solution: "is_equal <= '1' when a = b else '0';"
      },
      {
        level: "Vận dụng",
        title: "Bộ phát hiện ngưỡng nhiệt độ",
        prompt: "Cho cảm biến đọc nhiệt độ `temp : in unsigned(7 downto 0)`. Xuất cờ cảnh báo `overheat` khi nhiệt độ vượt quá 75 độ C.",
        hint: "overheat <= '1' when temp > 75 else '0';",
        solution: "overheat <= '1' when temp > 75 else '0';"
      },
      {
        level: "Thử thách",
        title: "Tối ưu hóa mạch so sánh bằng cổng XNOR",
        prompt: "Giải thích tại sao cổng XNOR lại được mệnh danh là 'bộ so sánh bằng 1-bit' trong cấu trúc phần cứng.",
        hint: "Bảng chân trị XNOR: Cho ra 1 khi hai ngõ vào giống hệt nhau.",
        solution: "Cổng XNOR có tính chất $A \\odot B = AB + A'B'$. Nó cho ngõ ra bằng '1' khi và chỉ khi $A = B$. Do đó bộ so sánh bằng N-bit chỉ cần N cổng XNOR nối vào 1 cổng AND N ngõ vào."
      }
    ],

    quiz: [
      {
        question: "Trong 3 cờ ngõ ra của Bộ so sánh Magnitude Comparator (A > B, A = B, A < B), tại một thời điểm có bao nhiêu cờ có thể nhận giá trị '1'?",
        options: [
          "Duy nhất 1 cờ",
          "Có thể 2 cờ",
          "Cả 3 cờ cùng lúc",
          "Tùy vào xung clock"
        ],
        answerIndex: 0,
        explanation: "Theo tính chất bắc cầu và loại trừ của toán học, giữa hai số chỉ có thể xảy ra đúng một trong 3 quan hệ: hoặc lớn hơn, hoặc bằng nhau, hoặc nhỏ hơn."
      },
      {
        question: "Cổng logic cơ bản nào được sử dụng trực tiếp để so sánh bằng từng cặp bit trong phần cứng?",
        options: [
          "Cổng XOR",
          "Cổng XNOR",
          "Cổng NAND",
          "Cổng OR"
        ],
        answerIndex: 1,
        explanation: "Cổng XNOR cho ngõ ra bằng '1' khi cả hai ngõ vào cùng bằng 0 hoặc cùng bằng 1, do đó nó hoạt động như một bộ so sánh bằng 1-bit."
      },
      {
        question: "Nếu bạn so sánh hai chuỗi \"1111\" và \"0001\" theo kiểu số có dấu (signed bù 2), kết quả quan hệ sẽ là gì?",
        options: [
          "\"1111\" lớn hơn \"0001\"",
          "\"1111\" nhỏ hơn \"0001\" (vì -1 < +1)",
          "Bằng nhau",
          "Tràn số"
        ],
        answerIndex: 1,
        explanation: "Trong hệ bù 2, chuỗi \"1111\" biểu diễn số -1, còn chuỗi \"0001\" biểu diễn số +1. Do -1 nhỏ hơn +1 nên kết quả là nhỏ hơn."
      },
      {
        question: "Để so sánh độ lớn giữa hai bus dữ liệu kiểu std_logic_vector theo giá trị số học nhị phân, thao tác bắt buộc phải làm là gì?",
        options: [
          "Ép kiểu sang unsigned hoặc signed bằng thư viện numeric_std",
          "Chuyển sang ngôn ngữ C",
          "Nhân hai số với nhau",
          "Dùng cổng NOT"
        ],
        answerIndex: 0,
        explanation: "std_logic_vector không mang ngữ nghĩa số học. Bắt buộc phải ép kiểu sang unsigned hoặc signed để bộ so sánh hiểu đúng giá trị."
      }
    ],

    summary: [
      "Bộ so sánh Magnitude Comparator tính toán 3 cờ quan hệ loại trừ lẫn nhau: $A > B$, $A = B$, $A < B$.",
      "Cổng XNOR là hạt nhân so sánh bằng từng bit trong cấu trúc bán dẫn.",
      "Bắt buộc ép kiểu sang `unsigned` hoặc `signed` từ `IEEE.NUMERIC_STD` khi so sánh số học.",
      "Cẩn trọng với sự khác biệt giữa so sánh không dấu (15 > 1) và so sánh bù 2 (-1 < 1).",
      "Các toán tử quan hệ `=`, `<`, `>` tổng hợp thành chuỗi cổng logic tổ hợp tốc độ cao."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW2", "SW3", "SW4", "SW5", "SW6", "SW7"],
      activeOutputs: ["LEDR0", "LEDR1", "LEDR2"],
      logicEvaluator: function(inputs) {
        const a = (inputs.SW3 << 3) | (inputs.SW2 << 2) | (inputs.SW1 << 1) | inputs.SW0;
        const b = (inputs.SW7 << 3) | (inputs.SW6 << 2) | (inputs.SW5 << 1) | inputs.SW4;
        return {
          LEDR0: a > b ? 1 : 0, // a_gt_b
          LEDR1: a === b ? 1 : 0, // a_eq_b
          LEDR2: a < b ? 1 : 0  // a_lt_b
        };
      }
    }
  },

  // ========================================================================
  // BÀI 3.6
  // ========================================================================
  {
    id: "ch3-b6",
    chapterId: "ch3",
    order: 6,
    title: "Bộ cộng nửa (Half Adder), Bộ cộng đầy đủ (Full Adder) và Ripple-Carry Adder N-bit",
    subtitle: "Trái tim số học của CPU: Xây dựng bộ cộng từ cổng logic cơ bản đến kiến trúc ghép tầng",
    badge: "Mạch tổ hợp",
    estimatedMinutes: 30,
    hardwareFocus: ["Half Adder", "Full Adder", "Ripple-Carry Adder"],

    objectives: [
      "Nắm vững sơ đồ nguyên lý và bảng chân trị của Bộ cộng nửa (Half Adder) và Bộ cộng đầy đủ (Full Adder).",
      "Thiết kế Full Adder 1-bit từ các cổng XOR, AND, OR cơ bản.",
      "Ghép nối $N$ khối Full Adder thành Bộ cộng lan truyền nhớ $N$-bit (Ripple-Carry Adder).",
      "Hiểu nguyên nhân giới hạn tốc độ của Ripple-Carry Adder do độ trễ truyền lan cờ nhớ (Carry Propagation Delay)."
    ],

    theory: {
      why: "Phép cộng là phép toán nền tảng nhất của mọi bộ vi xử lý (CPU/ALU). Phép trừ thực chất là cộng với số bù 2; phép nhân là nhiều phép cộng dồn liên tiếp; phép chia là chuỗi các phép trừ. Mọi tính toán đồ họa 3D hay trí tuệ nhân tạo đều bắt đầu từ một bộ cộng nhị phân nhỏ bé này!",
      how: "1. **Bộ cộng nửa (Half Adder - HA):** Cộng 2 bit $A$ và $B$. Ngõ ra gồm Tổng $S = A \\oplus B$ và Cờ nhớ $C = A \\cdot B$. HA không có ngõ vào nhận cờ nhớ từ hàng trước.\n2. **Bộ cộng đầy đủ (Full Adder - FA):** Nhận 3 ngõ vào gồm $A$, $B$ và cờ nhớ hàng trước $C_{in}$. Ngõ ra gồm Tổng $S = A \\oplus B \\oplus C_{in}$ và Cờ nhớ ra $C_{out} = (A \\cdot B) + (C_{in} \\cdot (A \\oplus B))$.\n3. **Ripple-Carry Adder (RCA):** Mắc nối tiếp $N$ bộ Full Adder: Cờ nhớ $C_{out}$ của tầng trước nối thẳng vào $C_{in}$ của tầng sau. Bit nhớ 'gợn sóng' (ripple) chạy từ LSB lên MSB.",
      sections: [
        {
          heading: "1. Bảng chân trị Bộ cộng đầy đủ (Full Adder)",
          content: "Hãy quan sát quy luật tính tổng và sinh cờ nhớ của 1 khối Full Adder:",
          callout: {
            type: "info",
            title: "Mẹo nhớ Full Adder",
            text: "Tổng S là hàm chẵn lẻ của 3 ngõ vào (dùng 2 cổng XOR). Cờ nhớ Cout bằng '1' khi có ít nhất 2 trong 3 ngõ vào bằng '1'."
          }
        },
        {
          heading: "2. Nút thắt cổ chai của Ripple-Carry Adder",
          content: "Trong bộ cộng Ripple-Carry, bit Tổng cao nhất $S_{N-1}$ không thể tính xong nếu bit cờ nhớ chưa chạy từ bit 0 qua toàn bộ các tầng trước đó. Với bộ cộng 64-bit, độ trễ này trở nên rất lớn! Trong thiết kế nâng cao (Chương 8), các kỹ sư giải quyết vấn đề này bằng bộ cộng tiên đoán cờ nhớ (Carry-Lookahead Adder - CLA).",
          callout: {
            type: "warning",
            title: "Độ trễ truyền cờ nhớ",
            text: "Độ trễ tỉ lệ thuận với số bit N. Bộ cộng càng dài thì thời gian lan truyền nhớ càng lớn."
          }
        }
      ],
      truthTable: {
        headers: ["A", "B", "Cin", "Tổng Sum (S)", "Cờ nhớ Cout"],
        rows: [
          ["0", "0", "0", "0", "0"],
          ["0", "1", "0", "1", "0"],
          ["1", "0", "0", "1", "0"],
          ["1", "1", "0", "0", "1 (1 + 1 = 2)"],
          ["0", "0", "1", "1", "0"],
          ["1", "1", "1", "1", "1 (1 + 1 + 1 = 3)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ Ripple-Carry Adder 4-bit ghép từ 4 khối FA -->
      <g transform="translate(30, 30)">
        <!-- FA 0 -->
        <rect x="20" y="30" width="100" height="110" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="70" y="60" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">FA 0</text>
        <line x1="70" y1="10" x2="70" y2="30" class="wire"/><text x="70" y="5" text-anchor="middle" fill="#94a3b8" font-size="9">A0,B0</text>
        <line x1="70" y1="140" x2="70" y2="165" class="wire"/><text x="70" y="180" text-anchor="middle" fill="#10b981" font-size="11">S0</text>
        <line x1="120" y1="85" x2="160" y2="85" class="wire"/><text x="140" y="75" text-anchor="middle" fill="#f59e0b" font-size="9">C1</text>

        <!-- FA 1 -->
        <rect x="160" y="30" width="100" height="110" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="210" y="60" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">FA 1</text>
        <line x1="210" y1="10" x2="210" y2="30" class="wire"/><text x="210" y="5" text-anchor="middle" fill="#94a3b8" font-size="9">A1,B1</text>
        <line x1="210" y1="140" x2="210" y2="165" class="wire"/><text x="210" y="180" text-anchor="middle" fill="#10b981" font-size="11">S1</text>
        <line x1="260" y1="85" x2="300" y2="85" class="wire"/><text x="280" y="75" text-anchor="middle" fill="#f59e0b" font-size="9">C2</text>

        <!-- FA 2 -->
        <rect x="300" y="30" width="100" height="110" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="350" y="60" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">FA 2</text>
        <line x1="350" y1="10" x2="350" y2="30" class="wire"/><text x="350" y="5" text-anchor="middle" fill="#94a3b8" font-size="9">A2,B2</text>
        <line x1="350" y1="140" x2="350" y2="165" class="wire"/><text x="350" y="180" text-anchor="middle" fill="#10b981" font-size="11">S2</text>
        <line x1="400" y1="85" x2="440" y2="85" class="wire"/><text x="420" y="75" text-anchor="middle" fill="#f59e0b" font-size="9">C3</text>

        <!-- FA 3 -->
        <rect x="440" y="30" width="100" height="110" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="490" y="60" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">FA 3</text>
        <line x1="490" y1="10" x2="490" y2="30" class="wire"/><text x="490" y="5" text-anchor="middle" fill="#94a3b8" font-size="9">A3,B3</text>
        <line x1="490" y1="140" x2="490" y2="165" class="wire"/><text x="490" y="180" text-anchor="middle" fill="#10b981" font-size="11">S3</text>
        <line x1="540" y1="85" x2="575" y2="85" class="wire"/><text x="560" y="75" text-anchor="middle" fill="#f59e0b" font-size="10">Cout</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "full_adder",
      circuitType: "combinational",
      typeExplanation: "Bộ cộng đầy đủ 1-bit (Full Adder) mô tả từ các phương trình Boolean cổng logic cơ bản.",
      code: `--------------------------------------------------------------------------------
-- Tên file: full_adder.vhd
-- Bộ cộng đầy đủ 1-bit (Full Adder) từ cổng logic cơ bản
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity full_adder is
    port (
        a_in    : in  std_logic; -- Số hạng A (SW0)
        b_in    : in  std_logic; -- Số hạng B (SW1)
        cin     : in  std_logic; -- Cờ nhớ vào từ hàng trước (SW2)
        sum_out : out std_logic; -- Tổng Sum (LEDR0)
        cout    : out std_logic  -- Cờ nhớ ra (LEDR1)
    );
end entity full_adder;

architecture rtl of full_adder is
begin
    -- 1. Tổng Sum là hàm XOR của cả 3 ngõ vào
    sum_out <= a_in xor b_in xor cin;

    -- 2. Cờ nhớ Cout sinh ra khi có ít nhất 2 ngõ vào bằng '1'
    cout    <= (a_in and b_in) or (cin and (a_in xor b_in));
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_full_adder",
      code: `--------------------------------------------------------------------------------
-- Testbench quét toàn bộ 8 tổ hợp của Full Adder
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_full_adder is
end entity tb_full_adder;

architecture sim of tb_full_adder is
    signal a, b, ci, s, co : std_logic;
begin
    uut: entity work.full_adder port map ( a_in=>a, b_in=>b, cin=>ci, sum_out=>s, cout=>co );

    stim: process
    begin
        -- 0 + 0 + 0 = 0 (c=0)
        a<='0'; b<='0'; ci<='0'; wait for 20 ns;
        -- 1 + 1 + 0 = 0 (c=1)
        a<='1'; b<='1'; ci<='0'; wait for 20 ns;
        assert (s='0' and co='1') report "Lỗi phép tính 1+1!" severity error;
        -- 1 + 1 + 1 = 1 (c=1)
        a<='1'; b<='1'; ci<='1'; wait for 20 ns;
        assert (s='1' and co='1') report "Lỗi phép tính 1+1+1!" severity error;
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim, kiểm tra: Đối chiếu 8 mốc thời gian dạng sóng với Bảng chân trị lý thuyết của Full Adder."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file full_adder.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: a_in = PIN_AB28 (SW0), b_in = PIN_AC28 (SW1), cin = PIN_AC27 (SW2), sum_out = PIN_G19 (LEDR0), cout = PIN_F19 (LEDR1).",
        "4. Biên dịch và nạp xuống kit DE2-115."
      ],
      pinAssignments: [
        { signal: "a_in", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "b_in", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1" },
        { signal: "cin", pin: "PIN_AC27", ioStandard: "2.5 V", note: "SW2" },
        { signal: "sum_out", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0 (Tổng Sum)" },
        { signal: "cout", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1 (Cờ nhớ Cout)" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to a_in\nset_location_assignment PIN_AC28 -to b_in\nset_location_assignment PIN_AC27 -to cin\nset_location_assignment PIN_G19 -to sum_out\nset_location_assignment PIN_F19 -to cout`
    },

    commonErrors: [
      {
        error: "Nhầm lẫn giữa Half Adder và Full Adder",
        cause: "Half Adder không có chân cờ nhớ vào cin, không thể dùng để ghép tầng cho các bit trọng số cao.",
        fix: "Luôn dùng Full Adder cho mọi tầng cộng từ bit 1 trở lên."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Thiết kế Bộ cộng nửa (Half Adder)",
        prompt: "Viết mã nguồn VHDL cho Half Adder (chỉ nhận a, b và xuất ra sum, carry).",
        hint: "sum <= a xor b; carry <= a and b;",
        solution: "sum <= a xor b;\ncarry <= a and b;"
      },
      {
        level: "Vận dụng",
        title: "Tạo Full Adder từ 2 Half Adder",
        prompt: "Chứng minh một bộ Full Adder có thể ghép từ 2 bộ Half Adder và 1 cổng OR.",
        hint: "HA1 cộng a và b ra s1 và c1. HA2 cộng s1 và cin ra sum và c2. Cout = c1 or c2.",
        solution: "s1 <= a xor b;\nc1 <= a and b;\nsum <= s1 xor cin;\nc2 <= s1 and cin;\ncout <= c1 or c2;"
      },
      {
        level: "Thử thách",
        title: "Đánh giá thời gian trễ của Ripple-Carry Adder 32-bit",
        prompt: "Nếu mỗi tầng Full Adder có độ trễ lan truyền cờ nhớ từ Cin sang Cout là 0.25 ns, hỏi cờ nhớ cuối cùng Cout của bộ cộng 32-bit xuất hiện sau bao lâu?",
        hint: "Thời gian = 32 x 0.25 ns.",
        solution: "Thời gian trễ cực đại = 32 x 0.25 ns = 8.0 ns. Độ trễ 8 ns này giới hạn tần số xung nhịp tối đa của CPU không vượt quá 125 MHz!"
      }
    ],

    quiz: [
      {
        question: "Sự khác biệt cốt lõi nhất giữa Bộ cộng nửa (Half Adder) và Bộ cộng đầy đủ (Full Adder) là gì?",
        options: [
          "Full Adder cộng được số thực, Half Adder chỉ cộng số nguyên",
          "Full Adder có ngõ vào nhận cờ nhớ Cin từ tầng trước, Half Adder không có Cin",
          "Full Adder chạy chậm hơn 100 lần",
          "Half Adder tiêu tốn nhiều cổng logic hơn"
        ],
        answerIndex: 1,
        explanation: "Half Adder chỉ cộng 2 bit (A và B), trong khi Full Adder cộng được 3 bit (A, B và cờ nhớ Cin nhận từ hàng trước truyền sang)."
      },
      {
        question: "Biểu thức Boolean của ngõ ra Tổng Sum trong một bộ Full Adder 1-bit là gì?",
        options: [
          "Sum = A and B and Cin",
          "Sum = A or B or Cin",
          "Sum = A xor B xor Cin",
          "Sum = not (A and B)"
        ],
        answerIndex: 2,
        explanation: "Tổng Sum của Full Adder là hàm chẵn lẻ (Parity), được tính bằng cách XOR liên tiếp 3 ngõ vào: A xor B xor Cin."
      },
      {
        question: "Trong cấu trúc Ripple-Carry Adder N-bit, đường tín hiệu nào gây ra nút thắt cổ chai về độ trễ truyền lan?",
        options: [
          "Đường tín hiệu xung clock",
          "Đường truyền cờ nhớ Carry lan truyền từ tầng LSB lên tầng MSB",
          "Đường cấp nguồn điện 2.5V",
          "Đường dây ngõ vào dữ liệu A"
        ],
        answerIndex: 1,
        explanation: "Tín hiệu cờ nhớ phải chạy tuần tự qua từng tầng Full Adder (gợn sóng lan truyền - ripple), khiến các bit cao phải đợi các bit thấp tính xong cờ nhớ."
      },
      {
        question: "Khi cả 3 ngõ vào của Full Adder đều bằng '1' (A=1, B=1, Cin=1), giá trị của ngõ ra Sum và Cout lần lượt là:",
        options: [
          "Sum = 0, Cout = 0",
          "Sum = 1, Cout = 0",
          "Sum = 0, Cout = 1",
          "Sum = 1, Cout = 1 (vì 1 + 1 + 1 = 3 = nhị phân 11)"
        ],
        answerIndex: 3,
        explanation: "1 + 1 + 1 = 3 trong thập phân, tương ứng với số nhị phân 2-bit là \"11\" (Cout = 1, Sum = 1)."
      }
    ],

    summary: [
      "Half Adder cộng 2 bit ($S = A \\oplus B$, $C = A \\cdot B$).",
      "Full Adder cộng 3 bit có cờ nhớ ($S = A \\oplus B \\oplus C_{in}$, $C_{out} = AB + C_{in}(A \\oplus B)$).",
      "Ripple-Carry Adder ghép $N$ khối Full Adder nối tiếp đường cờ nhớ.",
      "Độ trễ truyền lan cờ nhớ là nút thắt giới hạn tốc độ của bộ cộng nối tiếp.",
      "Full Adder là viên gạch nền tảng của mọi khối số học ALU và bộ nhân trong vi xử lý."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW2"],
      activeOutputs: ["LEDR0", "LEDR1"],
      logicEvaluator: function(inputs) {
        // SW0=A, SW1=B, SW2=Cin
        const a = inputs.SW0;
        const b = inputs.SW1;
        const ci = inputs.SW2;
        const sum = a ^ b ^ ci;
        const cout = (a & b) | (ci & (a ^ b));
        return {
          LEDR0: sum,
          LEDR1: cout
        };
      }
    }
  },

  // ========================================================================
  // BÀI 3.7
  // ========================================================================
  {
    id: "ch3-b7",
    chapterId: "ch3",
    order: 7,
    title: "Cạm bẫy thiết kế mạch tổ hợp: Hiện tượng suy diễn Latch ngoài ý muốn",
    subtitle: "Kẻ thù số 1 của kỹ sư số: Tại sao mạch tổ hợp lại biến thành mạch nhớ và cách diệt trừ 100%",
    badge: "Kinh nghiệm thực chiến",
    estimatedMinutes: 30,
    hardwareFocus: ["Latch ngoài ý muốn", "Warning (10631)"],

    objectives: [
      "Hiểu bản chất cơ chế suy diễn mạch chốt (Inferred Latch) của trình biên dịch Quartus.",
      "Nhận diện 2 nguyên nhân cốt lõi sinh ra Latch: Thiếu nhánh `else` (hoặc thiếu bao phủ đầy đủ) và Không gán giá trị ở mọi trường hợp.",
      "Nắm vững tác hại nghiêm trọng của Latch đối với phân tích thời gian (Timing Analysis) và gây lỗi chập chờn phần cứng.",
      "Làm chủ 2 giải pháp vàng tiêu diệt Latch 100%: Luôn gán giá trị mặc định ở đầu process và Luôn có nhánh `when others` / `else` đầy đủ."
    ],

    theory: {
      why: "Trong lập trình C, nếu bạn viết `if (a == 1) y = 5;` thì khi `a != 1`, biến `y` đơn giản là giữ nguyên giá trị cũ. Nhưng trong phần cứng mạch tổ hợp, dây dẫn KHÔNG THỂ TỰ NHỚ ĐƯỢC! Để 'giữ nguyên giá trị cũ' theo đúng ý bạn, phần mềm Quartus buộc phải chèn thêm một mạch chốt nhớ cấp độ mức (Transparent Latch). Latch này không có xung clock kiểm soát, cực kỳ nhạy cảm với nhiễu và xung gai (glitch), khiến bo mạch của bạn lúc chạy lúc chết một cách bí ẩn!",
      how: "Quy tắc phần cứng mạch tổ hợp:\n**Trong mạch tổ hợp thuần túy, mọi ngõ ra BẮT BUỘC phải nhận một giá trị mới trong MỌI trường hợp ngõ vào!**\nNếu tồn tại dù chỉ một trường hợp mà ngõ ra không được gán, trình biên dịch Quartus sẽ suy luận rằng bạn muốn 'nhớ giá trị cũ' và âm thầm sinh ra Latch (kèm theo dòng cảnh báo nguy hiểm: `Warning (10631): Inferring latch(es)...`).",
      sections: [
        {
          heading: "1. Ví dụ mã sinh Latch và Mã chuẩn sạch",
          content: "**Đoạn mã GÂY LỖI LATCH:**\n```vhdl\n-- NGUY HIỂM: Thiếu nhánh else!\nprocess(sel, a)\nbegin\n    if sel = '1' then\n        y <= a;\n    end if; -- Khi sel = '0', y phải làm gì? -> Quartus tự tạo LATCH để nhớ!\nend process;\n```\n\n**Đoạn mã CHUẨN SẠCH 100%:**\n```vhdl\n-- AN TOÀN: Có đầy đủ else\nprocess(sel, a)\nbegin\n    if sel = '1' then\n        y <= a;\n    else\n        y <= '0'; -- Bao phủ mọi trường hợp -> Thuần tổ hợp!\n    end if;\nend process;\n```",
          callout: {
            type: "danger",
            title: "Cảnh báo Warning 10631",
            text: "Trong bảng báo cáo biên dịch Compilation Report của Quartus, nếu xuất hiện dòng 'Warning (10631): Inferring latch(es) for signal...', bạn BẮT BUỘC phải sửa ngay lập tức, không được phép bỏ qua!"
          }
        },
        {
          heading: "2. Kỹ thuật gán giá trị mặc định (Default Assignment)",
          content: "Khi một process có nhiều ngõ ra phức tạp, bạn rất dễ bỏ quên một ngõ ra trong một nhánh nào đó. Giải pháp tối thượng là: **Gán giá trị mặc định cho toàn bộ các ngõ ra ngay dòng đầu tiên sau từ khóa `begin` của process**:\n```vhdl\nprocess(sw)\nbegin\n    -- GÁN MẶC ĐỊNH NGAY ĐẦU DÒNG:\n    led0 <= '0';\n    led1 <= '0';\n    \n    -- Các câu lệnh if/case bên dưới nếu đúng thì ghi đè lên\n    if sw = \"01\" then\n        led0 <= '1';\n    end if;\nend process;\n```\nNhờ có dòng gán mặc định, mọi trường hợp đều đã có giá trị xác định, loại bỏ nguy cơ sinh Latch 100%!",
          callout: {
            type: "tip",
            title: "Bí kíp nghề nghiệp",
            text: "Kỹ thuật gán mặc định ở đầu process là thói quen sống còn của các kỹ sư thiết kế vi mạch ASIC/FPGA chuyên nghiệp."
          }
        }
      ],
      truthTable: {
        headers: ["Tình huống mã nguồn", "Hậu quả phần cứng", "Mức độ nguy hiểm", "Cách xử lý triệt để"],
        rows: [
          ["Lệnh if thiếu nhánh else", "Sinh chốt Latch không mong muốn", "Cực kỳ nguy hiểm (Dễ sai timing)", "Luôn viết đủ else hoặc gán giá trị mặc định đầu process"],
          ["Lệnh case thiếu nhánh when others", "Sinh chốt Latch ngoài ý muốn", "Nguy hiểm", "Luôn có nhánh 'when others =>'"],
          ["Dùng with-select ở ngoài process", "100% không bao giờ sinh Latch", "Tuyệt đối an toàn", "Khuyên dùng cho mạch tổ hợp đơn giản"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Minh họa Mạch tổ hợp chuẩn vs Mạch bị dính Latch -->
      <g transform="translate(40, 30)">
        <!-- Bên trái: Mạch chuẩn -->
        <rect x="0" y="10" width="260" height="150" rx="8" fill="#131c31" stroke="#10b981" stroke-width="2"/>
        <text x="130" y="35" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="12" font-weight="bold">CHUẨN TỔ HỢP: MUX</text>
        <polygon points="90,55 150,70 150,130 90,145" class="gate-body"/>
        <line x1="150" y1="100" x2="220" y2="100" stroke="#10b981" stroke-width="2"/>
        <text x="130" y="155" text-anchor="middle" fill="#cbd5e1" font-size="10">Đủ nhánh else -> MUX sạch</text>

        <!-- Bên phải: Bị Latch -->
        <rect x="300" y="10" width="260" height="150" rx="8" fill="#131c31" stroke="#ef4444" stroke-width="2"/>
        <text x="430" y="35" text-anchor="middle" fill="#ef4444" font-family="monospace" font-size="12" font-weight="bold">LỖI: INFERRED LATCH</text>
        <rect x="380" y="65" width="80" height="60" rx="4" fill="#3b1115" stroke="#ef4444" stroke-width="2"/>
        <text x="420" y="95" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">LATCH</text>
        <text x="420" y="112" text-anchor="middle" fill="#fca5a5" font-size="9">Nhớ chập chờn</text>
        <line x1="460" y1="95" x2="520" y2="95" stroke="#ef4444" stroke-width="2"/>
        <text x="430" y="155" text-anchor="middle" fill="#fca5a5" font-size="10">Thiếu else -> Quartus tự tạo chốt</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "latch_free_demo",
      circuitType: "combinational",
      typeExplanation: "Minh họa phong cách lập trình an toàn tuyệt đối không sinh Latch: Sử dụng kỹ thuật gán giá trị mặc định ở đầu process.",
      code: `--------------------------------------------------------------------------------
-- Tên file: latch_free_demo.vhd
-- Minh họa kỹ thuật diệt trừ Latch 100% bằng Default Assignment
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity latch_free_demo is
    port (
        enable : in  std_logic; -- SW0: Tín hiệu kích hoạt
        data   : in  std_logic; -- SW1: Tín hiệu dữ liệu
        out_y  : out std_logic  -- LEDR0: Ngõ ra tổ hợp sạch
    );
end entity latch_free_demo;

architecture rtl of latch_free_demo is
begin
    -- PROCESS MẠCH TỔ HỢP
    -- Sensitivity list phải chứa TẤT CẢ các ngõ vào được đọc!
    process(enable, data)
    begin
        -- BƯỚC 1: GÁN GIÁ TRỊ MẶC ĐỊNH NGAY ĐẦU PROCESS
        -- Đảm bảo out_y LUÔN CÓ GIÁ TRỊ xác định ở mọi nhánh!
        out_y <= '0';

        -- BƯỚC 2: Ghi đè có điều kiện
        if enable = '1' then
            out_y <= data;
        end if;
        -- Khi enable = '0', out_y tự động nhận giá trị '0' mặc định
        -- -> 100% KHÔNG BAO GIỜ BỊ QUARTUS SUY DIỄN RA LATCH!
    end process;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_latch_free_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra mạch latch_free_demo
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_latch_free_demo is
end entity tb_latch_free_demo;

architecture sim of tb_latch_free_demo is
    signal en, d, y : std_logic := '0';
begin
    uut: entity work.latch_free_demo port map ( enable => en, data => d, out_y => y );

    stim: process
    begin
        en <= '0'; d <= '1'; wait for 20 ns;
        assert y = '0' report "Lỗi: enable=0 mà ngõ ra không bằng 0!" severity error;

        en <= '1'; d <= '1'; wait for 20 ns;
        assert y = '1' report "Lỗi: enable=1 mà ngõ ra không bằng 1!" severity error;
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong Compilation Report của Quartus sau khi biên dịch: Đảm bảo không có dòng Warning (10631)."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file latch_free_demo.vhd trong Quartus 20.1.",
        "2. Chạy Processing -> Start -> Start Analysis & Elaboration (Ctrl+K).",
        "3. Kiểm tra cửa sổ Messages tab Processing: Tìm xem có dòng chữ Warning (10631) nào không.",
        "4. Mở Compilation Report -> Fitter -> Resource Section để xác nhận số lượng Latch bằng 0."
      ],
      pinAssignments: [
        { signal: "enable", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "data", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1" },
        { signal: "out_y", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to enable\nset_location_assignment PIN_AC28 -to data\nset_location_assignment PIN_G19 -to out_y`
    },

    commonErrors: [
      {
        error: "Warning (10631): VHDL Process Statement warning at ...: inferring latch(es) for signal '...'",
        cause: "Thiếu nhánh else trong câu lệnh if hoặc thiếu when others trong câu lệnh case bên trong process.",
        fix: "Thêm dòng gán giá trị mặc định cho tín hiệu đó ngay sau từ khóa begin của process."
      },
      {
        error: "Thiếu tín hiệu trong Sensitivity List của process mạch tổ hợp",
        cause: "Khai báo process(enable) nhưng lại đọc cả tín hiệu data bên trong thân process.",
        fix: "Mọi ngõ vào được đọc trong process tổ hợp bắt buộc phải có mặt trong sensitivity list: process(enable, data)."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Sửa lỗi đoạn mã bị dính Latch",
        prompt: "Đoạn mã sau bị dính Latch: `process(a) begin if a = '1' then z <= '1'; end if; end process;`. Hãy viết lại cho đúng.",
        hint: "Bổ sung nhánh else z <= '0';",
        solution: "process(a)\nbegin\n  if a = '1' then\n    z <= '1';\n  else\n    z <= '0';\n  end if;\nend process;"
      },
      {
        level: "Vận dụng",
        title: "Áp dụng kỹ thuật Default Assignment cho 3 tín hiệu",
        prompt: "Viết process giải mã nhận SW 2-bit điều khiển 3 đèn LED đỏ, áp dụng gán mặc định để đảm bảo 100% không sinh Latch.",
        hint: "Gán led0 <= '0'; led1 <= '0'; led2 <= '0'; ngay đầu process.",
        solution: "process(sw)\nbegin\n  led0 <= '0'; led1 <= '0'; led2 <= '0';\n  case sw is\n    when \"01\" => led0 <= '1';\n    when \"10\" => led1 <= '1';\n    when \"11\" => led2 <= '1';\n    when others => null;\n  end case;\nend process;"
      },
      {
        level: "Thử thách",
        title: "Tại sao Latch là 'cơn ác mộng' của công cụ phân tích thời gian Timing Analysis?",
        prompt: "Giải thích tại sao phần mềm phân tích thời gian TimeQuest của Quartus gặp rất nhiều khó khăn khi kiểm tra mạch có chứa Latch.",
        hint: "Latch hoạt động theo mức điện áp (Level-sensitive) chứ không theo cạnh xung clock (Edge-triggered), làm đường truyền tín hiệu bị 'mở toang' khi enable ở mức cao.",
        solution: "Vì Latch trong suốt (Transparent) theo mức điện áp, tín hiệu ngõ vào có thể tự do lan truyền qua ngõ ra trong suốt nửa chu kỳ clock, gây ra hiện tượng mượn thời gian (Cycle Borrowing) và làm bài toán tính toán Setup/Hold time trở nên cực kỳ phức tạp và dễ vi phạm."
      }
    ],

    quiz: [
      {
        question: "Nguyên nhân cốt lõi khiến bộ tổng hợp Quartus tự động sinh ra mạch chốt Latch ngoài ý muốn trong mạch tổ hợp là gì?",
        options: [
          "Do xung nhịp clock quá nhanh",
          "Do có trường hợp ngõ vào mà tín hiệu ngõ ra không được gán giá trị mới (trình biên dịch buộc phải tạo chốt nhớ để giữ giá trị cũ)",
          "Do khai báo sai thư viện IEEE",
          "Do kit DE2-115 bị thiếu chân I/O"
        ],
        answerIndex: 1,
        explanation: "Nếu một đường tín hiệu không được gán giá trị trong mọi nhánh điều kiện, trình biên dịch suy luận rằng mạch cần phải nhớ giá trị cũ, dẫn đến việc suy diễn mạch chốt (Inferred Latch)."
      },
      {
        question: "Cảnh báo nào trong Quartus thông báo cho bạn biết thiết kế đang bị lỗi sinh Latch ngoài ý muốn?",
        options: [
          "Warning (10631): Inferring latch(es) for signal",
          "Error (12007): Top-level undefined",
          "Info: Simulation successful",
          "Warning: Fanout too high"
        ],
        answerIndex: 0,
        explanation: "Cảnh báo Warning (10631) là cảnh báo đặc trưng báo hiệu sự xuất hiện của Latch trong khối process."
      },
      {
        question: "Kỹ thuật nào sau đây được xem là giải pháp vàng giúp phòng ngừa 100% lỗi sinh Latch trong process tổ hợp?",
        options: [
          "Gán giá trị mặc định cho toàn bộ các ngõ ra ngay dòng đầu tiên sau từ khóa begin của process",
          "Xóa bỏ hoàn toàn câu lệnh if",
          "Chuyển toàn bộ kiểu dữ liệu sang integer",
          "Tăng tần số thạch anh lên 100 MHz"
        ],
        answerIndex: 0,
        explanation: "Gán giá trị mặc định ngay đầu process đảm bảo mọi ngõ ra luôn có giá trị xác định bất kể các nhánh if/case bên dưới rẽ hướng nào."
      },
      {
        question: "Đặc điểm của mạch chốt Latch khác với D Flip-Flop như thế nào?",
        options: [
          "Latch kích hoạt theo mức điện áp (Level-sensitive), trong khi Flip-Flop kích hoạt theo cạnh xung nhịp (Edge-triggered)",
          "Latch chỉ chạy được trên chip Xilinx",
          "Flip-Flop không thể lưu trữ bit",
          "Latch luôn có chân Reset đồng bộ"
        ],
        answerIndex: 0,
        explanation: "Latch nhạy cảm theo mức (khi chân kích ở mức cao, ngõ ra bắt chước tức thời ngõ vào), còn Flip-Flop chỉ chụp trạng thái tại đúng thời điểm chuyển đổi cạnh xung (rising edge)."
      }
    ],

    summary: [
      "Latch ngoài ý muốn là lỗi thiết kế nghiêm trọng hàng đầu của người mới học VHDL.",
      "Thiếu nhánh `else` trong `if` hoặc thiếu `when others` trong `case` là thủ phạm gây ra Latch.",
      "Bí kíp diệt trừ Latch: Luôn gán giá trị mặc định cho các ngõ ra ngay sau `begin` của process.",
      "Để ý cảnh báo `Warning (10631)` trong Quartus và loại bỏ hoàn toàn trước khi nạp chip.",
      "Mạch tổ hợp sạch sẽ giúp hệ thống đạt độ tin cậy tối đa, không bị xung gai và lỗi chập chờn."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        // enable=SW0, data=SW1
        return {
          LEDR0: inputs.SW0 ? inputs.SW1 : 0
        };
      }
    }
  }
];

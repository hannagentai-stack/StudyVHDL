// ==========================================================================
// CH5_FSM.JS - CHƯƠNG 5: MÁY TRẠNG THÁI HỮU HẠN (FSM) - 5 BÀI HỌC HOÀN CHỈNH
// ==========================================================================

window.VHDL_LESSONS_DB = window.VHDL_LESSONS_DB || {};

window.VHDL_LESSONS_DB["ch5"] = [
  // ========================================================================
  // BÀI 5.1
  // ========================================================================
  {
    id: "ch5-b1",
    chapterId: "ch5",
    order: 1,
    title: "Khái niệm FSM và Phân biệt Kiến trúc Moore vs Mealy",
    subtitle: "Trái tim của khối điều khiển Control Unit trong vi xử lý và chip số",
    badge: "FSM",
    estimatedMinutes: 30,
    hardwareFocus: ["FSM Architecture", "Moore vs Mealy", "CLOCK_50 (PIN_Y2)"],

    objectives: [
      "Hiểu bản chất của Máy trạng thái hữu hạn (FSM - Finite State Machine) như một bộ não điều phối các khối xử lý dữ liệu.",
      "Phân biệt rành mạch hai trường phái thiết kế kinh điển: Mô hình Moore và Mô hình Mealy.",
      "Đánh giá ưu nhược điểm thực tế: Tính an toàn, không xung gai (glitch-free) của Moore vs Phản ứng tức thì, tiết kiệm trạng thái của Mealy.",
      "Khai báo kiểu dữ liệu liệt kê (`type state_type is (...)`) chuẩn mực trong VHDL."
    ],

    theory: {
      why: "Trong thiết kế vi mạch, nếu như mạch tổ hợp (MUX, ALU, bộ cộng) đóng vai trò là 'cơ bắp' để tính toán dữ liệu (Datapath), thì Máy trạng thái hữu hạn (FSM) chính là 'bộ não' (Control Unit) chỉ huy. Một máy giặt tự động biết khi nào cần bơm nước, khi nào cần giặt, vắt và sấy; một CPU biết khi nào nạp lệnh, giải mã và thực thi... tất cả đều được vận hành bởi một FSM.",
      how: "FSM bao gồm một tập hữu hạn các trạng thái, một trạng thái hiện tại được lưu trong thanh ghi nhớ (Flip-Flops), và các luật chuyển tiếp dựa trên tín hiệu ngõ vào và xung nhịp Clock.\n\nCó 2 mô hình FSM cơ bản:\n1. **Mô hình Moore:**\n- Ngõ ra chỉ phụ thuộc DUY NHẤT vào Trạng thái hiện tại: `Output = f(Current_State)`.\n- Ưu điểm: Ngõ ra được cách ly khỏi các biến đổi ngẫu nhiên ở ngõ vào, hoàn toàn đồng bộ theo xung clock, không bị xung gai (glitch-free).\n- Nhược điểm: Phản ứng trễ 1 chu kỳ clock so với ngõ vào; thường cần nhiều trạng thái hơn.\n\n2. **Mô hình Mealy:**\n- Ngõ ra phụ thuộc vào CẢ Trạng thái hiện tại VÀ Ngõ vào hiện tại: `Output = f(Current_State, Inputs)`.\n- Ưu điểm: Phản xạ tức thì ngay trong cùng chu kỳ clock khi ngõ vào thay đổi; tiết kiệm số lượng trạng thái (thường ít hơn Moore 1 trạng thái).\n- Nhược điểm: Ngõ ra có thể xuất hiện xung gai (glitches) do nhiễu từ ngõ vào xuyên thẳng qua mạch tổ hợp xuất ra ngoài.",
      sections: [
        {
          heading: "1. Khai báo kiểu trạng thái liệt kê (Enumerated Type) trong VHDL",
          content: "Để mã nguồn trực quan và dễ bảo trì, VHDL cho phép định nghĩa kiểu dữ liệu riêng bằng tên gợi nhớ thay vì gán thủ công các số nhị phân:\n```vhdl\ntype state_type is (S_IDLE, S_READ, S_PROCESS, S_DONE);\nsignal state_reg, state_next : state_type;\n```\nTrình biên dịch Quartus Prime sẽ tự động chọn kiểu mã hóa tối ưu (One-Hot, Gray hoặc Binary) để đạt tần số hoạt động cao nhất.",
          callout: {
            type: "tip",
            title: "Mã hóa One-Hot trong FPGA",
            text: "Trong chip FPGA (như Cyclone IV trên DE2-115), tài nguyên Flip-Flop rất dồi dào. Trình biên dịch Quartus mặc định chọn mã hóa One-Hot (mỗi trạng thái dùng 1 Flip-Flop riêng, ví dụ: 4 trạng thái là 0001, 0010, 0100, 1000) vì mạch tổ hợp giải mã chuyển tiếp sẽ cực kỳ đơn giản và chạy với tốc độ tối đa."
          }
        }
      ],
      truthTable: {
        headers: ["Tiêu chí so sánh", "FSM Mô hình Moore", "FSM Mô hình Mealy"],
        rows: [
          ["Hàm tính ngõ ra", "Output = f(Trạng thái hiện tại)", "Output = f(Trạng thái hiện tại, Ngõ vào)"],
          ["Thời điểm ngõ ra đổi", "Chỉ đổi tại cạnh lên xung Clock", "Đổi ngay khi ngõ vào đổi (bất kỳ lúc nào)"],
          ["Số lượng trạng thái", "Thường nhiều hơn 1 trạng thái", "Thường ít hơn Moore 1 trạng thái"],
          ["Độ ổn định ngõ ra", "Rất cao, không bị xung gai (Glitch-free)", "Có nguy cơ xung gai (Glitch) từ ngõ vào"],
          ["Ứng dụng khuyên dùng", "Điều khiển an toàn, CPU Microcode, Bus giao tiếp", "Bộ đệm phản ứng nhanh, Handshaking tức thì"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 240" class="circuit-svg">
      <!-- Sơ đồ khối so sánh Moore vs Mealy -->
      <g transform="translate(30, 20)">
        <text x="140" y="20" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">FSM KIẾN TRÚC MOORE</text>
        <rect x="20" y="40" width="80" height="60" rx="4" fill="#131e33" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="60" y="75" text-anchor="middle" fill="#f8fafc" font-size="10">Next State Logic</text>
        <line x1="100" y1="70" x2="140" y2="70" stroke="#38bdf8" stroke-width="2"/>
        <rect x="140" y="40" width="60" height="60" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="170" y="75" text-anchor="middle" fill="#f59e0b" font-size="10">State Reg</text>
        <line x1="200" y1="70" x2="240" y2="70" stroke="#38bdf8" stroke-width="2"/>
        <rect x="240" y="40" width="70" height="60" rx="4" fill="#131e33" stroke="#10b981" stroke-width="1.5"/>
        <text x="275" y="75" text-anchor="middle" fill="#10b981" font-size="10">Output Logic</text>
        <line x1="310" y1="70" x2="350" y2="70" stroke="#10b981" stroke-width="2"/>
        <text x="360" y="74" fill="#10b981" font-size="10" font-weight="bold">Out</text>
      </g>
      <g transform="translate(30, 130)">
        <text x="140" y="20" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="bold">FSM KIẾN TRÚC MEALY</text>
        <rect x="20" y="40" width="80" height="60" rx="4" fill="#131e33" stroke="#ef4444" stroke-width="1.5"/>
        <text x="60" y="75" text-anchor="middle" fill="#f8fafc" font-size="10">Next State Logic</text>
        <line x1="100" y1="70" x2="140" y2="70" stroke="#ef4444" stroke-width="2"/>
        <rect x="140" y="40" width="60" height="60" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="170" y="75" text-anchor="middle" fill="#f59e0b" font-size="10">State Reg</text>
        <line x1="200" y1="70" x2="240" y2="70" stroke="#ef4444" stroke-width="2"/>
        <rect x="240" y="40" width="70" height="60" rx="4" fill="#131e33" stroke="#ef4444" stroke-width="1.5"/>
        <text x="275" y="75" text-anchor="middle" fill="#ef4444" font-size="10">Output Logic</text>
        <!-- Đường tắt ngõ vào chạy thẳng vào Output Logic trong Mealy -->
        <path d="M 0,70 L 10,70 L 10,25 L 255,25 L 255,40" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3"/>
        <text x="130" y="20" fill="#ef4444" font-size="9">Đường ngõ vào trực tiếp (Input bypass)</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "moore_mealy_demo",
      circuitType: "sequential",
      typeExplanation: "Máy trạng thái hữu hạn kết hợp: Bao gồm thanh ghi lưu trữ trạng thái đồng bộ theo xung Clock và khối giải mã ngõ ra.",
      code: `--------------------------------------------------------------------------------
-- Tên file: moore_mealy_demo.vhd
-- So sánh song song ngõ ra của FSM Moore và FSM Mealy
-- Kit: Terasic DE2-115 (CLOCK_50: PIN_Y2, KEY0: PIN_M23, SW0: PIN_AB28)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity moore_mealy_demo is
    port (
        clk         : in  std_logic; -- Xung clock 50 MHz (PIN_Y2)
        rst_n       : in  std_logic; -- Nút Reset tích cực mức thấp (KEY0 - PIN_M23)
        din         : in  std_logic; -- Tín hiệu ngõ vào chuỗi bit (SW0 - PIN_AB28)
        moore_out   : out std_logic; -- Ngõ ra Moore (LEDR0 - PIN_G19)
        mealy_out   : out std_logic  -- Ngõ ra Mealy (LEDR1 - PIN_F19)
    );
end entity moore_mealy_demo;

architecture rtl of moore_mealy_demo is
    -- Khai báo kiểu dữ liệu trạng thái liệt kê 2 trạng thái: S0 (0) và S1 (1)
    type state_t is (S0, S1);
    signal current_state, next_state : state_t;
begin
    -- 1. THANH GHI LƯU TRẠNG THÁI (State Register - Tuần tự)
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            current_state <= S0;
        elsif rising_edge(clk) then
            current_state <= next_state;
        end if;
    end process;

    -- 2. MẠCH TỔ HỢP TÍNH TOÁN TRẠNG THÁI TIẾP THEO (Next State Logic)
    process(current_state, din)
    begin
        case current_state is
            when S0 =>
                if din = '1' then
                    next_state <= S1;
                else
                    next_state <= S0;
                end if;
            when S1 =>
                if din = '0' then
                    next_state <= S0;
                else
                    next_state <= S1;
                end if;
        end case;
    end process;

    -- 3. MÔ HÌNH MOORE: Ngõ ra chỉ phụ thuộc current_state
    moore_proc: process(current_state)
    begin
        case current_state is
            when S0 => moore_out <= '0';
            when S1 => moore_out <= '1';
        end case;
    end process moore_proc;

    -- 4. MÔ HÌNH MEALY: Ngõ ra phụ thuộc cả current_state VÀ ngõ vào din
    mealy_proc: process(current_state, din)
    begin
        case current_state is
            when S0 =>
                if din = '1' then
                    mealy_out <= '1'; -- Kích hoạt ngay khi din=1 mà chưa cần clock!
                else
                    mealy_out <= '0';
                end if;
            when S1 =>
                mealy_out <= '0';
        end case;
    end process mealy_proc;

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_moore_mealy_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench so sánh thời điểm chuyển đổi ngõ ra của Moore và Mealy
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_moore_mealy_demo is
end entity tb_moore_mealy_demo;

architecture sim of tb_moore_mealy_demo is
    signal tb_clk       : std_logic := '0';
    signal tb_rst_n     : std_logic := '0';
    signal tb_din       : std_logic := '0';
    signal tb_moore_out : std_logic;
    signal tb_mealy_out : std_logic;
begin
    uut: entity work.moore_mealy_demo
        port map (
            clk       => tb_clk,
            rst_n     => tb_rst_n,
            din       => tb_din,
            moore_out => tb_moore_out,
            mealy_out => tb_mealy_out
        );

    -- Clock 50 MHz (Chu kỳ 20 ns)
    tb_clk <= not tb_clk after 10 ns;

    stim: process
    begin
        tb_rst_n <= '0'; wait for 25 ns;
        tb_rst_n <= '1'; wait for 15 ns;

        -- Đổi din = 1 tại thời điểm giữa chu kỳ (không trùng cạnh clock)
        tb_din <= '1';
        wait for 30 ns;

        -- Quan sát: mealy_out nhảy lên 1 ngay lập tức khi tb_din='1',
        -- trong khi moore_out phải chờ đến cạnh lên tiếp theo của tb_clk mới lên 1!
        tb_din <= '0';
        wait for 40 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim: Phóng to thời điểm 40 ns. Nhận xét thấy `tb_mealy_out` đổi mức đồng thời với `tb_din`, còn `tb_moore_out` bị trễ đến cạnh lên tiếp theo của `tb_clk`."
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án mới trong Quartus 20.1 chọn chip Cyclone IV EP4CE115F29C7.",
        "2. Tạo file moore_mealy_demo.vhd và nạp mã nguồn trên.",
        "3. Gán chân: clk = PIN_Y2, rst_n = PIN_M23, din = PIN_AB28, moore_out = PIN_G19, mealy_out = PIN_F19.",
        "4. Mở Tools -> Netlist Viewers -> State Machine Viewer để xem đồ hình trạng thái Quartus tự động trích xuất."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0 (Active-Low)" },
        { signal: "din", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "moore_out", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0 (Đèn Moore)" },
        { signal: "mealy_out", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1 (Đèn Mealy)" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_AB28 -to din\nset_location_assignment PIN_G19 -to moore_out\nset_location_assignment PIN_F19 -to mealy_out`
    },

    commonErrors: [
      {
        error: "Quên đưa tín hiệu ngõ vào din vào sensitivity list của process tính next_state",
        cause: "Process tính next_state là mạch tổ hợp, nếu thiếu tín hiệu vào trong sensitivity list thì khi mô phỏng trạng thái sẽ không cập nhật kịp thời.",
        fix: "Luôn khai báo đầy đủ `process(current_state, din)` cho mạch tổ hợp chuyển trạng thái."
      },
      {
        error: "Thiếu nhánh 'when others' trong câu lệnh case trạng thái",
        cause: "Trình biên dịch có thể sinh ra latch không mong muốn hoặc báo lỗi không bao quát hết mọi giá trị của kiểu liệt kê.",
        fix: "Luôn thêm `when others => next_state <= S0;` ở cuối khối `case`."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Bổ sung trạng thái thứ 3 (S2)",
        prompt: "Mở rộng FSM thành 3 trạng thái S0, S1, S2: Khi ở S1 gặp din=1 thì nhảy sang S2, ở S2 gặp din=0 thì quay về S0.",
        hint: "Thêm S2 vào type state_t is (S0, S1, S2); và bổ sung when S2 => trong case.",
        solution: "type state_t is (S0, S1, S2);\n-- Trong case:\nwhen S2 => if din = '0' then next_state <= S0; else next_state <= S2; end if;"
      },
      {
        level: "Vận dụng",
        title: "Khắc phục hiện tượng Glitch của Mealy bằng tầng đệm",
        prompt: "Làm thế nào để giữ được ưu điểm phản ứng nhanh của Mealy nhưng loại bỏ hoàn toàn nguy cơ xung gai ở ngõ ra?",
        hint: "Đăng ký ngõ ra (Registered Output) bằng cách đưa mealy_out qua một Flip-Flop đồng bộ theo clock.",
        solution: "Thêm một process tuần tự: process(clk) begin if rising_edge(clk) then mealy_reg <= mealy_comb; end if; end process;"
      },
      {
        level: "Thử thách",
        title: "Cách xem State Machine Viewer trong Quartus Prime",
        prompt: "Sau khi biên dịch trong Quartus, hãy mô tả cách mở công cụ trực quan hóa đồ hình trạng thái tích hợp sẵn của Intel FPGA.",
        hint: "Menu Tools -> Netlist Viewers -> State Machine Viewer.",
        solution: "Chọn Tools -> Netlist Viewers -> State Machine Viewer. Quartus sẽ vẽ đồ hình bong bóng các trạng thái, bảng chuyển tiếp mã nhị phân One-Hot/Gray cực kỳ trực quan."
      }
    ],

    quiz: [
      {
        question: "Đặc điểm nhận dạng cốt lõi của máy trạng thái mô hình Moore là gì?",
        options: [
          "Ngõ ra chỉ phụ thuộc duy nhất vào trạng thái hiện tại của mạch",
          "Ngõ ra phụ thuộc trực tiếp vào cả ngõ vào và trạng thái hiện tại",
          "Moore không bao giờ cần dùng xung clock",
          "Moore chỉ có đúng 2 trạng thái"
        ],
        answerIndex: 0,
        explanation: "Theo định nghĩa chuẩn: FSM Moore có hàm ngõ ra Out = f(Current State), do đó ngõ ra chỉ đổi khi mạch nhảy sang trạng thái mới tại cạnh clock."
      },
      {
        question: "Tại sao trong các hệ thống vi mạch đòi hỏi độ an toàn cao, kỹ sư thường ưu tiên chọn mô hình Moore?",
        options: [
          "Vì ngõ ra của Moore được cách ly và lọc sạch hoàn toàn xung gai ngẫu nhiên (Glitch-free)",
          "Vì Moore chạy nhanh hơn Mealy 100 lần",
          "Vì Moore tốn ít chip hơn",
          "Vì Mealy không tổng hợp được trên FPGA"
        ],
        answerIndex: 0,
        explanation: "Mô hình Moore không có đường nối tắt trực tiếp từ ngõ vào ra ngõ ra, nên mọi xung nhiễu ngắn ở ngõ vào đều bị chặn lại tại các thanh ghi nhớ."
      },
      {
        question: "Kiểu mã hóa trạng thái nào thường được Quartus Prime tự động ưu tiên cho chip FPGA Cyclone IV?",
        options: [
          "One-Hot (Mỗi trạng thái dùng 1 Flip-Flop riêng)",
          "Binary thông thường",
          "Mã BCD",
          "Mã Morse"
        ],
        answerIndex: 0,
        explanation: "FPGA có mật độ Flip-Flop cực kỳ dồi dào, mã hóa One-Hot giúp mạch logic tổ hợp giải mã chuyển tiếp đơn giản nhất và đạt Fmax cao nhất."
      },
      {
        question: "Cú pháp VHDL nào sau đây dùng để khai báo kiểu trạng thái liệt kê tự định nghĩa?",
        options: [
          "type state_type is (S0, S1, S2);",
          "signal state_type : (S0, S1, S2);",
          "enum state_type = {S0, S1, S2};",
          "state_type is array (0 to 2);"
        ],
        answerIndex: 0,
        explanation: "Cú pháp chuẩn VHDL để định nghĩa kiểu dữ liệu liệt kê là: `type <tên_kiểu> is (<danh_sách_giá_trị>);`."
      }
    ],

    summary: [
      "FSM là khối điều khiển (Control Unit) chỉ huy trung tâm của các hệ thống số phức tạp.",
      "Mô hình Moore: Ngõ ra chỉ phụ thuộc trạng thái hiện tại, an toàn tuyệt đối và glitch-free.",
      "Mô hình Mealy: Ngõ ra phụ thuộc cả trạng thái và ngõ vào, phản xạ tức thì nhưng dễ bị xung gai.",
      "Dùng `type state_t is (...)` để mã nguồn VHDL sáng sủa và dễ bảo trì.",
      "Quartus State Machine Viewer là công cụ đồ họa tuyệt vời để kiểm tra FSM sau tổng hợp."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "KEY0"],
      activeOutputs: ["LEDR0", "LEDR1"],
      logicEvaluator: function(inputs) {
        if (inputs.KEY0 === 0) return { LEDR0: 0, LEDR1: 0 };
        return {
          LEDR0: inputs.SW0 ? 1 : 0, // Moore
          LEDR1: inputs.SW0 ? 1 : 0  // Mealy
        };
      }
    },

    fsmConfig: {
      title: "So sánh Moore vs Mealy (Bài 5.1)",
      type: "moore",
      inputs: { din: 0, rst_n: 1 },
      resetState: "S0",
      states: [
        { id: "S0", name: "S0 (Mức 0)", code: "0", x: 180, y: 150, mooreOut: "0" },
        { id: "S1", name: "S1 (Mức 1)", code: "1", x: 440, y: 150, mooreOut: "1" }
      ],
      transitions: [
        { from: "S0", to: "S1", inputVal: 1, label: "din=1", mealyOut: "1", curvature: 0.15 },
        { from: "S0", to: "S0", inputVal: 0, label: "din=0", mealyOut: "0", selfLoop: true },
        { from: "S1", to: "S0", inputVal: 0, label: "din=0", mealyOut: "0", curvature: 0.15 },
        { from: "S1", to: "S1", inputVal: 1, label: "din=1", mealyOut: "0", selfLoop: true }
      ]
    }
  },

  // ========================================================================
  // BÀI 5.2
  // ========================================================================
  {
    id: "ch5-b2",
    chapterId: "ch5",
    order: 2,
    title: "Thiết kế Bộ phát hiện chuỗi bit (Sequence Detector '1011' Overlapping)",
    subtitle: "Bài toán kinh điển trong giao thức mạng, đồng bộ khung truyền thông và nhận dạng mẫu",
    badge: "FSM",
    estimatedMinutes: 35,
    hardwareFocus: ["Sequence Detector", "Overlapping Pattern", "KEY1 (Manual Clock)"],

    objectives: [
      "Nắm vững phương pháp lập đồ hình trạng thái (State Diagram) từng bước từ con số 0.",
      "Hiểu rõ sự khác biệt giữa phát hiện có chồng lấn (Overlapping) và không chồng lấn (Non-overlapping).",
      "Viết mã VHDL hoàn chỉnh cho bộ phát hiện chuỗi `1011`.",
      "Mô phỏng chuỗi kích thích bit và quan sát cờ báo phát hiện `match` trên kit DE2-115."
    ],

    theory: {
      why: "Trong các giao thức truyền thông như Ethernet, USB hay Wi-Fi, dữ liệu truyền đi dưới dạng một dòng bit liên tục. Để máy tính biết khi nào bắt đầu một gói tin mới, một chuỗi bit đồng bộ đặc biệt (gọi là Preamble hoặc Sync Word, ví dụ `1011`) sẽ được gửi trước. Bộ phát hiện chuỗi chính là chiếc rada quét từng bit một để bắt đúng khoảnh khắc chuỗi này xuất hiện.",
      how: "Chuỗi mục tiêu: `1011`.\n- **Khái niệm Chồng lấn (Overlapping):** Nếu chuỗi đầu vào là `...1011011...`, thì sau khi bắt được `1011` đầu tiên, 2 bit cuối `11` có thể tái sử dụng bit `1` cuối cùng làm bit mở đầu cho mẫu `1011` tiếp theo! Điều này gọi là phát hiện có chồng lấn.\n\nXây dựng 5 trạng thái Moore:\n- `S0`: Chưa bắt được gì (Khởi tạo).\n- `S1`: Đã bắt được bit `1`.\n- `S2`: Đã bắt được `10`.\n- `S3`: Đã bắt được `101`.\n- `S4`: Đã bắt đủ `1011` -> Xuất ngõ ra cờ `match = '1'`!\n\nTại `S4` (đang có `1011`), nếu bit tiếp theo đến là:\n- Bit `0`: Ghép thành `10110` -> Tận dụng được hậu tố `10` -> Quay về trạng thái `S2`!\n- Bit `1`: Ghép thành `10111` -> Tận dụng được hậu tố `1` -> Quay về trạng thái `S1`!",
      sections: [
        {
          heading: "1. Bảng chuyển tiếp trạng thái (State Transition Table)",
          content: "Để viết mã VHDL không bao giờ bị sót nhánh, ta lập bảng chuyển tiếp:\n- Hiện tại `S0`: din=1 -> S1, din=0 -> S0\n- Hiện tại `S1`: din=1 -> S1, din=0 -> S2\n- Hiện tại `S2`: din=1 -> S3, din=0 -> S0\n- Hiện tại `S3`: din=1 -> S4, din=0 -> S2\n- Hiện tại `S4`: din=1 -> S1, din=0 -> S2 (Overlapping!)",
          callout: {
            type: "warning",
            title: "Cạm bẫy không chồng lấn",
            text: "Nếu thiết kế Non-overlapping, sau khi đạt S4 mạch bắt buộc phải nhảy về S0 để đếm lại từ đầu, bỏ lỡ các mẫu xen kẽ nhau trong dòng bit liên tục."
          }
        }
      ],
      truthTable: {
        headers: ["Trạng thái hiện tại", "Ý nghĩa dòng bit đã ghi nhớ", "Nếu ngõ vào din = 0", "Nếu ngõ vào din = 1", "Ngõ ra match (Moore)"],
        rows: [
          ["S0", "Rỗng (Chưa có gì)", "S0", "S1 (Bắt được 1)", "'0'"],
          ["S1", "Đã bắt được '1'", "S2 (Được '10')", "S1 (Giữ '1')", "'0'"],
          ["S2", "Đã bắt được '10'", "S0 (Mất mẫu)", "S3 (Được '101')", "'0'"],
          ["S3", "Đã bắt được '101'", "S2 (Được '10')", "S4 (Đủ '1011'!)", "'0'"],
          ["S4", "ĐÃ PHÁT HIỆN '1011'!", "S2 (Tận dụng '10')", "S1 (Tận dụng '1')", "'1' (KÍCH HOẠT)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ bong bóng trạng thái 1011 -->
      <g transform="translate(30, 20)">
        <!-- Các node S0..S4 -->
        <circle cx="50" cy="90" r="26" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="50" y="94" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">S0/0</text>
        <circle cx="160" cy="50" r="26" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="160" y="54" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">S1/0</text>
        <circle cx="280" cy="50" r="26" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="280" y="54" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">S2/0</text>
        <circle cx="400" cy="90" r="26" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="400" y="94" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">S3/0</text>
        <circle cx="240" cy="150" r="26" fill="#0c2847" stroke="#10b981" stroke-width="2.5"/>
        <text x="240" y="154" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">S4/1</text>
        <!-- Mũi tên chuyển tiếp chính -->
        <path d="M 72,77 L 138,58" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow)"/>
        <text x="100" y="60" fill="#38bdf8" font-size="10">1</text>
        <path d="M 186,50 L 254,50" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow)"/>
        <text x="220" y="42" fill="#38bdf8" font-size="10">0</text>
        <path d="M 302,58 L 378,77" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow)"/>
        <text x="345" y="60" fill="#38bdf8" font-size="10">1</text>
        <path d="M 380,105 L 265,142" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="330" y="135" fill="#10b981" font-size="10" font-weight="bold">1 (Match!)</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "seq_detector_1011",
      circuitType: "sequential",
      typeExplanation: "Máy trạng thái hữu hạn Moore hoàn chỉnh: Tự động ghi nhớ chuỗi bit quá khứ qua 5 trạng thái để phát hiện mẫu 1011.",
      code: `--------------------------------------------------------------------------------
-- Tên file: seq_detector_1011.vhd
-- Bộ phát hiện chuỗi bit '1011' có chồng lấn (Overlapping Moore FSM)
-- Kit: Terasic DE2-115
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity seq_detector_1011 is
    port (
        clk         : in  std_logic; -- Xung clock (PIN_Y2 hoặc nút bấm KEY1)
        rst_n       : in  std_logic; -- Nút Reset (KEY0 - PIN_M23)
        din         : in  std_logic; -- Dòng bit ngõ vào (SW0 - PIN_AB28)
        match_found : out std_logic  -- Đèn LED báo khớp chuỗi (LEDR0 - PIN_G19)
    );
end entity seq_detector_1011;

architecture rtl of seq_detector_1011 is
    -- Khai báo 5 trạng thái của FSM
    type state_type is (S0, S1, S2, S3, S4);
    signal current_state, next_state : state_type;
begin
    -- 1. State Register: Cập nhật trạng thái theo cạnh clock
    reg_proc: process(clk, rst_n)
    begin
        if rst_n = '0' then
            current_state <= S0;
        elsif rising_edge(clk) then
            current_state <= next_state;
        end if;
    end process reg_proc;

    -- 2. Next State Logic: Tính toán trạng thái tiếp theo theo chuỗi 1011
    next_proc: process(current_state, din)
    begin
        case current_state is
            when S0 =>
                if din = '1' then next_state <= S1;
                else              next_state <= S0;
                end if;

            when S1 =>
                if din = '0' then next_state <= S2;
                else              next_state <= S1;
                end if;

            when S2 =>
                if din = '1' then next_state <= S3;
                else              next_state <= S0;
                end if;

            when S3 =>
                if din = '1' then next_state <= S4; -- Đã đủ 1011!
                else              next_state <= S2;
                end if;

            when S4 =>
                -- Chồng lấn (Overlapping):
                -- Nếu bit tiếp theo là '0' -> tạo thành '10' -> về S2
                -- Nếu bit tiếp theo là '1' -> tạo thành '1'  -> về S1
                if din = '0' then next_state <= S2;
                else              next_state <= S1;
                end if;

            when others =>
                next_state <= S0;
        end case;
    end process next_proc;

    -- 3. Output Logic (Mô hình Moore): Chỉ tích cực khi đang ở trạng thái S4
    match_found <= '1' when current_state = S4 else '0';

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_seq_detector_1011",
      code: `--------------------------------------------------------------------------------
-- Testbench phát dòng bit kiểm tra: 1 -> 0 -> 1 -> 1 -> 0 -> 1 -> 1
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_seq_detector_1011 is
end entity tb_seq_detector_1011;

architecture sim of tb_seq_detector_1011 is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '0';
    signal din   : std_logic := '0';
    signal match : std_logic;
begin
    uut: entity work.seq_detector_1011
        port map ( clk => clk, rst_n => rst_n, din => din, match_found => match );

    clk <= not clk after 10 ns;

    stim: process
        -- Thủ tục phụ trợ cấp 1 bit vào mạch đồng bộ theo cạnh clock
        procedure send_bit(b : std_logic) is
        begin
            din <= b;
            wait until rising_edge(clk);
            wait for 2 ns;
        end procedure;
    begin
        rst_n <= '0'; wait for 25 ns;
        rst_n <= '1'; wait for 15 ns;

        -- Gửi chuỗi: 1, 0, 1, 1 (Kỳ vọng match = 1 tại chu kỳ thứ 4)
        send_bit('1');
        send_bit('0');
        send_bit('1');
        send_bit('1'); -- Tại đây match_found = 1

        -- Tiếp tục gửi: 0, 1, 1 (Kỳ vọng phát hiện chồng lấn match = 1 lần 2)
        send_bit('0');
        send_bit('1');
        send_bit('1'); -- Tại đây match_found lại = 1!

        send_bit('0');
        wait for 40 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim: Quan sát tín hiệu `match` nhảy lên mức 1 tại đúng 2 thời điểm chuỗi `1011` xuất hiện đầy đủ."
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án mới seq_detector_1011.",
        "2. Nạp mã nguồn VHDL và chạy Analysis & Synthesis.",
        "3. Gán chân: clk = PIN_M21 (Nút nhấn KEY1 để bấm từng nhịp kiểm tra bằng mắt), rst_n = PIN_M23 (KEY0), din = PIN_AB28 (SW0), match_found = PIN_G19 (LEDR0).",
        "4. Biên dịch và nạp file .sof lên kit DE2-115."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_M21", ioStandard: "2.5 V", note: "KEY1 (Bấm thủ công để cấp 1 nhịp clock)" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0 (Reset)" },
        { signal: "din", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0 (Bit ngõ vào)" },
        { signal: "match_found", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0 (Đèn sáng khi phát hiện 1011)" }
      ],
      qsfSnippet: `set_location_assignment PIN_M21 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_AB28 -to din\nset_location_assignment PIN_G19 -to match_found`
    },

    commonErrors: [
      {
        error: "Từ S4 nhảy sai trạng thái khiến mất tính năng chồng lấn (Overlapping)",
        cause: "Nhiều người mới học cho S4 nhảy thẳng về S0 khi gặp bit 0, bỏ quên việc '1011' + '0' đã có sẵn hai bit đuôi '10' chính là trạng thái S2.",
        fix: "Khi ở S4 gặp din=0 chuyển về S2; gặp din=1 chuyển về S1."
      },
      {
        error: "Quên gán giá trị mặc định cho next_state dẫn đến suy diễn ra Latch",
        cause: "Nếu một nhánh `if` không có `else` trong process tổ hợp, Quartus sẽ tạo ra Latch phần cứng gây nguy cơ chạy sai chức năng.",
        fix: "Luôn viết đủ cặp `if...else` hoặc đặt giá trị mặc định `next_state <= S0;` ở đầu process."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Bộ phát hiện chuỗi '110'",
        prompt: "Thiết kế bộ phát hiện chuỗi ngắn 3-bit '110'. Cần bao nhiêu trạng thái Moore?",
        hint: "Chuỗi N-bit Moore cần N+1 trạng thái: S0 (khởi tạo), S1 (1), S2 (11), S3 (110).",
        solution: "Cần 4 trạng thái: S0, S1, S2, S3. Ngõ ra match = 1 khi ở S3."
      },
      {
        level: "Vận dụng",
        title: "Chuyển đổi sang mô hình Mealy",
        prompt: "Nếu thiết kế bộ phát hiện 1011 theo mô hình Mealy, bạn cần bao nhiêu trạng thái và ngõ ra match kích hoạt tại đâu?",
        hint: "Mealy chỉ cần 4 trạng thái S0..S3. Khi ở S3 gặp din=1 thì xuất match=1 ngay lập tức.",
        solution: "Mealy chỉ cần 4 trạng thái (S0, S1, S2, S3). Tại S3 nếu din='1' thì mealy_out <= '1' và next_state <= S1."
      },
      {
        level: "Thử thách",
        title: "Hiển thị mã trạng thái ra LED 7 đoạn HEX0",
        prompt: "Nối tín hiệu mã hóa trạng thái (0 đến 4) vào bộ giải mã LED 7 đoạn để quan sát bước nhảy trạng thái trên kit DE2-115.",
        hint: "Dùng `with current_state select hex0 <= ...` xuất mã 7 đoạn tương ứng.",
        solution: "case current_state is when S0 => hex0 <= \"1000000\"; when S1 => hex0 <= \"1111001\"; when S2 => hex0 <= \"0100100\"; when S3 => hex0 <= \"0110000\"; when S4 => hex0 <= \"0011001\"; end case;"
      }
    ],

    quiz: [
      {
        question: "Trong bộ phát hiện chuỗi N-bit theo mô hình Moore, số lượng trạng thái tối thiểu cần dùng là bao nhiêu?",
        options: [
          "N + 1 trạng thái",
          "N trạng thái",
          "2^N trạng thái",
          "N - 1 trạng thái"
        ],
        answerIndex: 0,
        explanation: "Mô hình Moore cần trạng thái ban đầu rỗng S0 cộng với N trạng thái tương ứng từng bit nhận được, tổng cộng là N + 1 trạng thái."
      },
      {
        question: "Khái niệm 'Chồng lấn' (Overlapping) trong bộ phát hiện chuỗi có ý nghĩa là gì?",
        options: [
          "Các bit cuối của chuỗi vừa phát hiện có thể được tái sử dụng làm phần đầu của chuỗi tiếp theo",
          "Các dây tín hiệu bị chập vào nhau",
          "Hai bộ đếm chạy cùng lúc",
          "Chuỗi bit bị đảo ngược thứ tự"
        ],
        answerIndex: 0,
        explanation: "Overlapping cho phép tái sử dụng hậu tố của chuỗi đã nhận (ví dụ '1011' kết hợp với '011' tiếp theo thành 2 lần phát hiện liên tiếp)."
      },
      {
        question: "Từ trạng thái S4 (đã nhận '1011'), nếu bit kế tiếp đưa vào là '0', mạch chuyển về trạng thái nào để đảm bảo tính chồng lấn?",
        options: [
          "S2 (Tương ứng đã có sẵn '10')",
          "S0 (Xóa về ban đầu)",
          "S1 (Tương ứng '1')",
          "S4 (Giữ nguyên)"
        ],
        answerIndex: 0,
        explanation: "Chuỗi '1011' nhận thêm '0' thành '...10', khớp chính xác với trạng thái S2 (đã bắt được '10')."
      },
      {
        question: "Để gán chân nút bấm KEY1 cấp nhịp clock thủ công trên kit DE2-115, chân vật lý tương ứng là gì?",
        options: [
          "PIN_M21",
          "PIN_Y2",
          "PIN_AB28",
          "PIN_G19"
        ],
        answerIndex: 0,
        explanation: "Theo sơ đồ DE2-115: Nút bấm KEY1 được kết nối với chân PIN_M21 (KEY0 là PIN_M23, CLOCK_50 là PIN_Y2)."
      }
    ],

    summary: [
      "Bộ phát hiện chuỗi là ứng dụng tiêu biểu của FSM trong truyền thông và mạng máy tính.",
      "Mô hình Moore N-bit cần N+1 trạng thái; Mealy cần N trạng thái.",
      "Kỹ thuật Overlapping giúp tận dụng các bit vừa nhận để phát hiện các mẫu liên tiếp nhau.",
      "Mã VHDL FSM chuẩn luôn tách bạch: State Register (tuần tự) và Next State Logic (tổ hợp).",
      "Sử dụng nút bấm KEY1 làm xung nhịp từng bước giúp dễ dàng kiểm thử mạch trên phần cứng thật."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "KEY0", "KEY1"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        if (inputs.KEY0 === 0) return { LEDR0: 0 };
        return { LEDR0: inputs.SW0 ? 1 : 0 };
      }
    },

    fsmConfig: {
      title: "Bộ phát hiện chuỗi '1011' (Bài 5.2)",
      type: "moore",
      inputs: { din: 0, rst_n: 1 },
      resetState: "S0",
      states: [
        { id: "S0", name: "S0 (Khởi tạo)", code: "000", x: 90,  y: 155, mooreOut: "0" },
        { id: "S1", name: "S1 (Bắt '1')",   code: "001", x: 230, y: 85,  mooreOut: "0" },
        { id: "S2", name: "S2 (Bắt '10')",  code: "010", x: 380, y: 85,  mooreOut: "0" },
        { id: "S3", name: "S3 (Bắt '101')", code: "011", x: 530, y: 155, mooreOut: "0" },
        { id: "S4", name: "S4 (Đủ '1011')", code: "100", x: 310, y: 235, mooreOut: "1" }
      ],
      transitions: [
        { from: "S0", to: "S1", inputVal: 1, label: "din=1", mealyOut: "0", curvature: 0.1 },
        { from: "S0", to: "S0", inputVal: 0, label: "din=0", mealyOut: "0", selfLoop: true },
        { from: "S1", to: "S2", inputVal: 0, label: "din=0", mealyOut: "0", curvature: 0.1 },
        { from: "S1", to: "S1", inputVal: 1, label: "din=1", mealyOut: "0", selfLoop: true },
        { from: "S2", to: "S3", inputVal: 1, label: "din=1", mealyOut: "0", curvature: 0.1 },
        { from: "S2", to: "S0", inputVal: 0, label: "din=0", mealyOut: "0", curvature: -0.3 },
        { from: "S3", to: "S4", inputVal: 1, label: "din=1", mealyOut: "1", curvature: 0.1 },
        { from: "S3", to: "S2", inputVal: 0, label: "din=0", mealyOut: "0", curvature: 0.2 },
        { from: "S4", to: "S2", inputVal: 0, label: "din=0", mealyOut: "0", curvature: -0.2 },
        { from: "S4", to: "S1", inputVal: 1, label: "din=1", mealyOut: "0", curvature: -0.2 }
      ]
    }
  },

  // ========================================================================
  // BÀI 5.3
  // ========================================================================
  {
    id: "ch5-b3",
    chapterId: "ch5",
    order: 3,
    title: "Tiêu chuẩn thiết kế FSM 3-Process chuẩn công nghiệp",
    subtitle: "Mẫu kiến trúc vàng chống xung gai Glitch và tối ưu hóa Timing Closure",
    badge: "Chuẩn thiết kế",
    estimatedMinutes: 30,
    hardwareFocus: ["3-Process FSM", "Registered Outputs", "Timing Closure"],

    objectives: [
      "Hiểu rõ tại sao viết FSM dồn tất cả vào 1 process duy nhất lại là sai lầm nguy hiểm của người mới học.",
      "Nắm vững cấu trúc phân tách 3 khối rõ ràng: State Register, Next State Logic và Registered Output Logic.",
      "Áp dụng kỹ thuật Registered Output để đưa tín hiệu ngõ ra đi qua Flip-Flop, triệt tiêu 100% xung gai Glitch.",
      "Viết mã VHDL FSM theo chuẩn công nghiệp được các công ty thiết kế vi mạch (như Intel, AMD, Synopsys) áp dụng."
    ],

    theory: {
      why: "Trong các dự án thương mại lớn, một FSM có thể có hàng chục trạng thái và giao tiếp với các khối mạch khác chạy ở tần số hàng trăm MHz. Nếu ngõ ra của FSM được tạo bằng mạch tổ hợp thuần túy, những chênh lệch thời gian lan truyền (Propagation Delay) cực nhỏ giữa các đường dây sẽ tạo ra các xung gai nhọn (Glitches). Những xung gai này có thể vô tình kích hoạt các bộ đếm hoặc xóa dữ liệu bộ nhớ. Chuẩn 3-Process với ngõ ra được chốt qua Flip-Flop là 'tấm khiên' bảo vệ hệ thống tuyệt đối.",
      how: "Quy tắc 3-Process chuẩn công nghiệp:\n1. **Process 1 (Tuần tự - State Register):**\n- Nhiệm vụ: Chốt trạng thái hiện tại theo cạnh lên xung clock `rising_edge(clk)` và xử lý Reset bất đồng bộ.\n- Sensitivity list: `process(clk, rst_n)`.\n\n2. **Process 2 (Tổ hợp - Next State Logic):**\n- Nhiệm vụ: Đọc `current_state` và các ngõ vào để tính toán trạng thái tiếp theo `next_state`.\n- Sensitivity list: `process(current_state, inputs)`.\n\n3. **Process 3 (Tuần tự - Registered Output Logic):**\n- Nhiệm vụ: Chốt giá trị ngõ ra vào các Flip-Flop đồng bộ theo cạnh clock.\n- Ưu điểm vô song: Mọi đường tín hiệu ngõ ra của FSM xuất phát từ Flip-Flop, đường trễ ngõ ra cực ngắn (Tco nhỏ), không có bất kỳ xung gai nào, giúp chip dễ dàng đạt yêu cầu thời gian (Timing Closure).",
      sections: [
        {
          heading: "1. So sánh 1-Process vs 2-Process vs 3-Process",
          content: "- **1-Process:** Gộp cả chuyển trạng thái và tính ngõ ra vào 1 process tuần tự. Rất khó debug, ngõ ra bị trễ 1 chu kỳ clock một cách không trực giác.\n- **2-Process:** Tách State Register (tuần tự) và Next State + Output (tổ hợp). Dễ hiểu, nhưng ngõ ra là tổ hợp nên dễ sinh Glitch.\n- **3-Process (Khuyên dùng):** Tách bạch hoàn toàn: (1) State Reg, (2) Next State Comb, (3) Registered Outputs. Đạt chuẩn vàng chất lượng công nghiệp.",
          callout: {
            type: "info",
            title: "Quy chuẩn mã hóa của Intel FPGA",
            text: "Tài liệu Intel Quartus Handbook khuyến nghị: Luôn sử dụng kiểu mã hóa FSM tách biệt khối logic tính toán và khối chốt dữ liệu để bộ tối ưu hóa RTL có thể áp dụng thuật toán State Encoding an toàn nhất."
          }
        }
      ],
      truthTable: {
        headers: ["Thành phần Process", "Bản chất phần cứng", "Sensitivity List", "Mục đích"],
        rows: [
          ["Process 1: State Register", "Mạch tuần tự (Flip-Flops)", "clk, rst_n", "Chuyển current_state <= next_state"],
          ["Process 2: Next State Logic", "Mạch tổ hợp (Cổng logic)", "current_state, các ngõ vào", "Tính toán next_state bằng câu lệnh case"],
          ["Process 3: Output Logic", "Mạch tuần tự có chốt (D-FF)", "clk, rst_n", "Chốt ngõ ra sạch glitch (Registered Output)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ kiến trúc 3-Process FSM chuẩn -->
      <g transform="translate(30, 25)">
        <!-- Process 2: Next State -->
        <rect x="20" y="30" width="130" height="80" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="85" y="60" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">Process 2 (Comb)</text>
        <text x="85" y="80" text-anchor="middle" fill="#94a3b8" font-size="10">Next State Logic</text>

        <!-- Process 1: State Reg -->
        <rect x="210" y="30" width="120" height="80" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
        <text x="270" y="60" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">Process 1 (Seq)</text>
        <text x="270" y="80" text-anchor="middle" fill="#94a3b8" font-size="10">State Register</text>

        <!-- Process 3: Output Reg -->
        <rect x="390" y="30" width="140" height="80" rx="6" fill="#0c2847" stroke="#10b981" stroke-width="2"/>
        <text x="460" y="60" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">Process 3 (Seq)</text>
        <text x="460" y="80" text-anchor="middle" fill="#94a3b8" font-size="10">Registered Output</text>

        <!-- Dây nối giữa các khối -->
        <line x1="150" y1="70" x2="210" y2="70" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="180" y="62" text-anchor="middle" fill="#38bdf8" font-size="9">next_state</text>

        <line x1="330" y1="70" x2="390" y2="70" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="360" y="62" text-anchor="middle" fill="#f59e0b" font-size="9">cur_state</text>

        <!-- Đường phản hồi current_state về Process 2 -->
        <path d="M 270,110 L 270,140 L 85,140 L 85,110" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3"/>
        <text x="180" y="155" text-anchor="middle" fill="#f59e0b" font-size="9">Feedback: current_state</text>

        <!-- Ngõ ra ngoài sạch Glitch -->
        <line x1="530" y1="70" x2="580" y2="70" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow)"/>
        <text x="590" y="74" fill="#10b981" font-size="11" font-weight="bold">Out (Clean)</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "fsm_three_process",
      circuitType: "sequential",
      typeExplanation: "Kiến trúc FSM 3-Process: Tách bạch rõ ràng giữa khối mạch tuần tự nhớ trạng thái, khối tổ hợp chuyển trạng thái và thanh ghi chốt ngõ ra sạch glitch.",
      code: `--------------------------------------------------------------------------------
-- Tên file: fsm_three_process.vhd
-- Mẫu kiến trúc FSM 3-Process chuẩn công nghiệp
-- Kit: Terasic DE2-115
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity fsm_three_process is
    port (
        clk         : in  std_logic;                    -- Xung 50 MHz (PIN_Y2)
        rst_n       : in  std_logic;                    -- Reset (KEY0 - PIN_M23)
        start_cmd   : in  std_logic;                    -- Lệnh bắt đầu (SW0 - PIN_AB28)
        ready_flag  : out std_logic;                    -- Cờ sẵn sàng (LEDR0 - PIN_G19)
        active_bus  : out std_logic_vector(1 downto 0)  -- Mã chế độ hoạt động (LEDR2..1)
    );
end entity fsm_three_process;

architecture rtl of fsm_three_process is
    type state_t is (IDLE, RUNNING, FINISHED);
    signal current_state, next_state : state_t;
begin

    -- =========================================================================
    -- PROCESS 1: State Register (Tuần tự - Đồng bộ Clock & Reset)
    -- =========================================================================
    p1_state_reg: process(clk, rst_n)
    begin
        if rst_n = '0' then
            current_state <= IDLE;
        elsif rising_edge(clk) then
            current_state <= next_state;
        end if;
    end process p1_state_reg;

    -- =========================================================================
    -- PROCESS 2: Next State Logic (Mạch tổ hợp thuần túy)
    -- =========================================================================
    p2_next_state: process(current_state, start_cmd)
    begin
        -- Giá trị mặc định chống suy diễn Latch
        next_state <= current_state;

        case current_state is
            when IDLE =>
                if start_cmd = '1' then
                    next_state <= RUNNING;
                else
                    next_state <= IDLE;
                end if;

            when RUNNING =>
                -- Sau khi chạy xong quay về FINISHED
                if start_cmd = '0' then
                    next_state <= FINISHED;
                else
                    next_state <= RUNNING;
                end if;

            when FINISHED =>
                next_state <= IDLE;

            when others =>
                next_state <= IDLE;
        end case;
    end process p2_next_state;

    -- =========================================================================
    -- PROCESS 3: Registered Output Logic (Tuần tự - Ngõ ra chốt qua Flip-Flop)
    -- =========================================================================
    p3_registered_outputs: process(clk, rst_n)
    begin
        if rst_n = '0' then
            ready_flag <= '1';
            active_bus <= "00";
        elsif rising_edge(clk) then
            -- Tính toán giá trị ngõ ra theo next_state để ngõ ra chốt đúng thời điểm
            case next_state is
                when IDLE =>
                    ready_flag <= '1';
                    active_bus <= "00";

                when RUNNING =>
                    ready_flag <= '0';
                    active_bus <= "01";

                when FINISHED =>
                    ready_flag <= '0';
                    active_bus <= "10";
            end case;
        end if;
    end process p3_registered_outputs;

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_fsm_three_process",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm chứng FSM 3-Process và độ sạch của ngõ ra
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_fsm_three_process is
end entity tb_fsm_three_process;

architecture sim of tb_fsm_three_process is
    signal clk        : std_logic := '0';
    signal rst_n      : std_logic := '0';
    signal start_cmd  : std_logic := '0';
    signal ready_flag : std_logic;
    signal active_bus : std_logic_vector(1 downto 0);
begin
    uut: entity work.fsm_three_process
        port map (
            clk        => clk,
            rst_n      => rst_n,
            start_cmd  => start_cmd,
            ready_flag => ready_flag,
            active_bus => active_bus
        );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 30 ns;
        rst_n <= '1'; wait for 20 ns;

        -- Kích hoạt start
        start_cmd <= '1'; wait for 60 ns;
        -- Ngắt start
        start_cmd <= '0'; wait for 60 ns;

        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim: Quan sát `ready_flag` và `active_bus` chỉ chuyển mức ngay tại cạnh lên của `clk`, hoàn toàn phẳng và không có bất kỳ gai nhiễu nào."
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án mới fsm_three_process.",
        "2. Nạp mã nguồn VHDL 3-process.",
        "3. Gán chân: clk = PIN_Y2, rst_n = PIN_M23, start_cmd = PIN_AB28, ready_flag = PIN_G19, active_bus[0] = PIN_F19, active_bus[1] = PIN_E19.",
        "4. Biên dịch và kiểm tra mục TimeQuest Timing Analyzer để xác nhận Tco tối ưu."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "start_cmd", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "ready_flag", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" },
        { signal: "active_bus[0]", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1" },
        { signal: "active_bus[1]", pin: "PIN_E19", ioStandard: "2.5 V", note: "LEDR2" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_AB28 -to start_cmd\nset_location_assignment PIN_G19 -to ready_flag\nset_location_assignment PIN_F19 -to "active_bus[0]"\nset_location_assignment PIN_E19 -to "active_bus[1]"`
    },

    commonErrors: [
      {
        error: "Tính toán ngõ ra trong Process 3 theo current_state thay vì next_state",
        cause: "Vì Process 3 là mạch tuần tự có Flip-Flop, nếu tính theo current_state thì ngõ ra sẽ bị trễ thêm 1 chu kỳ clock so với mong muốn.",
        fix: "Trong Process 3 có chốt, hãy kiểm tra theo `case next_state is` để ngõ ra xuất hiện đồng thời với thời điểm mạch bước vào trạng thái đó."
      },
      {
        error: "Gộp chung tất cả vào 1 process duy nhất khiến logic trở nên rối rắm",
        cause: "Người mới thường nhồi nhét cả điều khiển clock, câu lệnh if ngõ vào và ngõ ra vào 1 khối lớn, gây khó khăn khi debug và tổng hợp.",
        fix: "Tuân thủ nghiêm ngặt mô hình 3-Process phân định rạch ròi trách nhiệm của từng khối."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Thêm trạng thái PAUSE",
        prompt: "Bổ sung trạng thái PAUSE giữa RUNNING và FINISHED khi có tín hiệu `pause_cmd = '1'` (SW1).",
        hint: "Bổ sung PAUSE vào type state_t và thêm nhánh when PAUSE trong cả Process 2 và Process 3.",
        solution: "type state_t is (IDLE, RUNNING, PAUSE, FINISHED);\n-- Trong p2: when RUNNING => if pause_cmd='1' then next_state <= PAUSE; ..."
      },
      {
        level: "Vận dụng",
        title: "Tính toán tần số cực đại Fmax của FSM 3-Process",
        prompt: "Tại sao ngõ ra qua Flip-Flop giúp nâng cao tần số làm việc tối đa Fmax của toàn bộ chip FPGA?",
        hint: "Đường dây từ Flip-Flop đến Pin I/O không đi qua các tầng cổng logic tổ hợp phức tạp.",
        solution: "Registered Outputs rút ngắn đường trễ Critical Path (Tco), loại bỏ độ trễ tổ hợp giữa các khối mạch, giúp thỏa mãn điều kiện Setup Time và tăng Fmax đáng kể."
      },
      {
        level: "Thử thách",
        title: "Xử lý trạng thái bất hợp lệ (Safe State Machine)",
        prompt: "Trong môi trường bức xạ vũ trụ, một bit Flip-Flop có thể bị lật (Single Event Upset). Làm sao để FSM tự hồi phục an toàn về IDLE?",
        hint: "Nhánh `when others => next_state <= IDLE;` kết hợp thuộc tính tổng hợp safe FSM của Quartus.",
        solution: "Khai báo thuộc tính Quartus: attribute syn_encoding of state_t : type is \"safe\"; để Quartus tự động sinh mạch cưỡng chế mọi trạng thái lỗi về IDLE."
      }
    ],

    quiz: [
      {
        question: "Trong cấu trúc 3-Process chuẩn công nghiệp, Process 1 chịu trách nhiệm làm gì?",
        options: [
          "Thanh ghi tuần tự lưu trữ và cập nhật trạng thái theo cạnh clock (current_state <= next_state)",
          "Tính toán trạng thái kế tiếp",
          "Điều khiển đèn LED",
          "Chia tần số xung clock"
        ],
        answerIndex: 0,
        explanation: "Process 1 là State Register tuần tự, chỉ làm đúng một việc: chốt current_state <= next_state khi có cạnh lên clock hoặc reset."
      },
      {
        question: "Lợi ích lớn nhất của việc thiết kế ngõ ra dạng Registered Output (Process 3) là gì?",
        options: [
          "Triệt tiêu hoàn toàn xung gai nhiễu (Glitch-free) và tối ưu hóa thời gian trễ Tco",
          "Làm mạch chạy chậm lại",
          "Tốn ít Flip-Flop hơn",
          "Không cần viết testbench"
        ],
        answerIndex: 0,
        explanation: "Registered Outputs chốt qua Flip-Flop giúp ngõ ra hoàn toàn sạch nhiễu và đường truyền tín hiệu đạt hiệu năng thời gian cao nhất."
      },
      {
        question: "Tại sao trong Process 2 (Mạch tổ hợp tính next_state) ta cần gán giá trị mặc định `next_state <= current_state;` ở đầu khối?",
        options: [
          "Để tránh tình trạng trình tổng hợp sinh ra Latch ngoài ý muốn khi thiếu nhánh điều kiện",
          "Để mạch chạy nhanh hơn",
          "Để reset chip",
          "Bắt buộc theo chuẩn IEEE"
        ],
        answerIndex: 0,
        explanation: "Trong mạch tổ hợp, nếu có trường hợp tín hiệu không được gán giá trị, trình tổng hợp sẽ suy diễn ra Latch bộ nhớ gây lỗi mạch."
      },
      {
        question: "Trong Process 3 có chốt Flip-Flop, để ngõ ra xuất hiện đồng thời với thời điểm mạch bước vào trạng thái mới, ta nên duyệt theo tín hiệu nào?",
        options: [
          "next_state",
          "current_state",
          "rst_n",
          "clk"
        ],
        answerIndex: 0,
        explanation: "Do Process 3 có độ trễ 1 chu kỳ clock qua Flip-Flop, duyệt theo `next_state` sẽ giúp ngõ ra cập nhật ngay tại cạnh clock mà mạch chuyển trạng thái."
      }
    ],

    summary: [
      "Kiến trúc FSM 3-Process là chuẩn mực thiết kế vi mạch công nghiệp đỉnh cao.",
      "Process 1: State Register (Tuần tự - Nhớ trạng thái).",
      "Process 2: Next State Logic (Tổ hợp - Tính toán bước nhảy).",
      "Process 3: Registered Output Logic (Tuần tự - Xuất ngõ ra sạch glitch).",
      "Registered Output giúp FSM dễ dàng vượt qua khâu phân tích định thời (Timing Closure) trên chip FPGA."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "KEY0"],
      activeOutputs: ["LEDR0", "LEDR1", "LEDR2"],
      logicEvaluator: function(inputs) {
        if (inputs.KEY0 === 0) return { LEDR0: 1, LEDR1: 0, LEDR2: 0 };
        return {
          LEDR0: inputs.SW0 ? 0 : 1,
          LEDR1: inputs.SW0 ? 1 : 0,
          LEDR2: inputs.SW0 ? 0 : 1
        };
      }
    },

    fsmConfig: {
      title: "Mô phỏng FSM 3-Process Chuẩn (Bài 5.3)",
      type: "moore",
      inputs: { din: 0, rst_n: 1 },
      resetState: "IDLE",
      states: [
        { id: "IDLE",     name: "IDLE",     code: "00", x: 140, y: 150, mooreOut: "Ready=1" },
        { id: "RUNNING",  name: "RUNNING",  code: "01", x: 340, y: 100, mooreOut: "Act=01" },
        { id: "FINISHED", name: "FINISHED", code: "10", x: 520, y: 150, mooreOut: "Act=10" }
      ],
      transitions: [
        { from: "IDLE",     to: "RUNNING",  inputVal: 1, label: "start=1", curvature: 0.1 },
        { from: "IDLE",     to: "IDLE",     inputVal: 0, label: "start=0", selfLoop: true },
        { from: "RUNNING",  to: "FINISHED", inputVal: 0, label: "start=0", curvature: 0.1 },
        { from: "RUNNING",  to: "RUNNING",  inputVal: 1, label: "start=1", selfLoop: true },
        { from: "FINISHED", to: "IDLE",     inputVal: 0, label: "done",    curvature: -0.2 },
        { from: "FINISHED", to: "IDLE",     inputVal: 1, label: "done",    curvature: -0.2 }
      ]
    }
  },

  // ========================================================================
  // BÀI 5.4
  // ========================================================================
  {
    id: "ch5-b4",
    chapterId: "ch5",
    order: 4,
    title: "Hệ thống điều khiển Đèn giao thông 4 pha (Traffic Light Controller)",
    subtitle: "Ứng dụng thực tế kinh điển kết hợp FSM với bộ đếm định thời gian Timer",
    badge: "Thực chiến",
    estimatedMinutes: 35,
    hardwareFocus: ["Traffic Light FSM", "Timer Integration", "HEX Displays", "LEDG & LEDR"],

    objectives: [
      "Thiết kế hệ thống điều khiển đèn giao thông ngã tư hoàn chỉnh cho hai tuyến đường Bắc-Nam (NS) và Đông-Tây (EW).",
      "Xây dựng chu trình 4 pha an toàn: NS Xanh -> NS Vàng -> EW Xanh -> EW Vàng.",
      "Tích hợp bộ chia tần số định thời (Timer) giữ đèn Xanh 30 giây, đèn Vàng 5 giây.",
      "Hiển thị trạng thái đèn ra LED Đỏ (LEDR), LED Xanh (LEDG) và số giây đếm lùi ra màn hình LED 7 đoạn HEX0 trên kit DE2-115."
    ],

    theory: {
      why: "Đèn giao thông là một trong những hệ thống tự động hóa quen thuộc nhất trong đời sống. Nếu bộ điều khiển bị lỗi (ví dụ: bật đèn xanh cho cả hai làn đường cùng một lúc), tai nạn thảm khốc sẽ xảy ra. Sử dụng FSM trong FPGA đảm bảo tính tin cậy 100%: Mạch chỉ có thể ở đúng một trạng thái tại một thời điểm, các khóa liên động an toàn phần cứng (Interlocks) triệt tiêu hoàn toàn khả năng xung đột tín hiệu.",
      how: "Quy trình điều khiển ngã tư 4 pha:\n1. **Pha 1 (`S_NS_GREEN`):** Tuyến Bắc-Nam ĐÈN XANH, Tuyến Đông-Tây ĐÈN ĐỎ. Giữ trong 30 giây.\n2. **Pha 2 (`S_NS_YELLOW`):** Tuyến Bắc-Nam ĐÈN VÀNG, Tuyến Đông-Tây ĐÈN ĐỎ. Giữ trong 5 giây.\n3. **Pha 3 (`S_EW_GREEN`):** Tuyến Bắc-Nam ĐÈN ĐỎ, Tuyến Đông-Tây ĐÈN XANH. Giữ trong 30 giây.\n4. **Pha 4 (`S_EW_YELLOW`):** Tuyến Bắc-Nam ĐÈN ĐỎ, Tuyến Đông-Tây ĐÈN VÀNG. Giữ trong 5 giây.\nSau Pha 4, hệ thống quay vòng về Pha 1 tuần hoàn vô tận.\n\nFSM phối hợp với Bộ đếm thời gian (Timer Counter):\n- Khi bước vào một trạng thái, bộ đếm bắt đầu đếm số giây từ xung 1 Hz.\n- Khi bộ đếm đạt ngưỡng thời gian của pha đó (ví dụ 30s hoặc 5s), cờ `timer_done` bật lên '1' kích hoạt FSM chuyển sang pha kế tiếp và tự động đặt lại bộ đếm về 0.",
      sections: [
        {
          heading: "1. Khóa liên động an toàn phần cứng (Fail-Safe)",
          content: "Trong mã VHDL, ta định nghĩa rõ ràng các hằng số mã hóa đèn:\n- Tuyến NS: `ns_lights : out std_logic_vector(2 downto 0)` (Bit 2: Đỏ, Bit 1: Vàng, Bit 0: Xanh)\n- Tuyến EW: `ew_lights : out std_logic_vector(2 downto 0)`\nKhông bao giờ tồn tại trạng thái nào mà `ns_lights(0) = '1'` (NS Xanh) và `ew_lights(0) = '1'` (EW Xanh) đồng thời!",
          callout: {
            type: "tip",
            title: "Tối ưu hóa hiển thị trên DE2-115",
            text: "Trên bo mạch DE2-115, ta dùng dãy LED xanh lá `LEDG[3:0]` làm đèn Xanh, dãy LED đỏ `LEDR[17:14]` làm đèn Đỏ, và nhấp nháy hoặc dùng các LED đỏ trung gian làm đèn Vàng để quan sát cực kỳ trực quan."
          }
        }
      ],
      truthTable: {
        headers: ["Pha FSM", "Thời gian duy trì", "Đèn Tuyến Bắc-Nam (NS)", "Đèn Tuyến Đông-Tây (EW)", "Chuyển tiếp khi"],
        rows: [
          ["S_NS_GREEN", "30 giây", "XANH (LEDG)", "ĐỎ (LEDR)", "Hết 30 giây -> S_NS_YELLOW"],
          ["S_NS_YELLOW", "5 giây", "VÀNG (LEDR chớp)", "ĐỎ (LEDR)", "Hết 5 giây -> S_EW_GREEN"],
          ["S_EW_GREEN", "30 giây", "ĐỎ (LEDR)", "XANH (LEDG)", "Hết 30 giây -> S_EW_YELLOW"],
          ["S_EW_YELLOW", "5 giây", "ĐỎ (LEDR)", "VÀNG (LEDR chớp)", "Hết 5 giây -> S_NS_GREEN"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ vòng lặp 4 pha đèn giao thông -->
      <g transform="translate(30, 20)">
        <rect x="60" y="20" width="160" height="60" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
        <text x="140" y="45" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">S_NS_G (30s)</text>
        <text x="140" y="65" text-anchor="middle" fill="#a7f3d0" font-size="9">NS: Xanh | EW: Đỏ</text>

        <rect x="360" y="20" width="160" height="60" rx="6" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
        <text x="440" y="45" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">S_NS_Y (5s)</text>
        <text x="440" y="65" text-anchor="middle" fill="#fde68a" font-size="9">NS: Vàng | EW: Đỏ</text>

        <rect x="360" y="120" width="160" height="60" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
        <text x="440" y="145" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">S_EW_G (30s)</text>
        <text x="440" y="165" text-anchor="middle" fill="#a7f3d0" font-size="9">NS: Đỏ | EW: Xanh</text>

        <rect x="60" y="120" width="160" height="60" rx="6" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
        <text x="140" y="145" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">S_EW_Y (5s)</text>
        <text x="140" y="165" text-anchor="middle" fill="#fde68a" font-size="9">NS: Đỏ | EW: Vàng</text>

        <!-- Mũi tên tuần hoàn -->
        <line x1="220" y1="50" x2="360" y2="50" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="440" y1="80" x2="440" y2="120" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="360" y1="150" x2="220" y2="150" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="140" y1="120" x2="140" y2="80" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "traffic_light_controller",
      circuitType: "sequential",
      typeExplanation: "Máy trạng thái tuần tự thời gian thực: Tích hợp mạch đếm giây chia tần số 50 MHz và điều khiển 4 pha đèn ngã tư an toàn.",
      code: `--------------------------------------------------------------------------------
-- Tên file: traffic_light_controller.vhd
-- Hệ thống điều khiển đèn giao thông ngã tư 4 pha (Kit DE2-115)
-- CLOCK_50 = 50 MHz, KEY0 = Reset
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity traffic_light_controller is
    port (
        clk         : in  std_logic;                    -- 50 MHz (PIN_Y2)
        rst_n       : in  std_logic;                    -- KEY0 (PIN_M23)
        -- Ngõ ra đèn Bắc-Nam (Bit 2: Đỏ, Bit 1: Vàng, Bit 0: Xanh)
        ns_lights   : out std_logic_vector(2 downto 0); -- LEDR0, LEDR1, LEDG0
        -- Ngõ ra đèn Đông-Tây (Bit 2: Đỏ, Bit 1: Vàng, Bit 0: Xanh)
        ew_lights   : out std_logic_vector(2 downto 0)  -- LEDR4, LEDR5, LEDG1
    );
end entity traffic_light_controller;

architecture rtl of traffic_light_controller is
    type state_t is (S_NS_GREEN, S_NS_YELLOW, S_EW_GREEN, S_EW_YELLOW);
    signal current_state, next_state : state_t;

    -- Bộ chia tạo nhịp 1 giây (50,000,000 chu kỳ clock 50 MHz)
    -- Để mô phỏng nhanh hoặc demo trên kit, ta dùng hằng số rút gọn
    constant TICKS_PER_SEC : integer := 50000000;
    signal sec_cnt         : integer range 0 to TICKS_PER_SEC := 0;
    signal one_sec_tick    : std_logic := '0';

    -- Bộ đếm thời gian pha (tối đa 30 giây)
    signal timer_cnt : integer range 0 to 35 := 0;
begin

    -- 1. BỘ TẠO XUNG 1 GIÂY (One-Second Pulse Generator)
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            sec_cnt      <= 0;
            one_sec_tick <= '0';
        elsif rising_edge(clk) then
            if sec_cnt = TICKS_PER_SEC - 1 then
                sec_cnt      <= 0;
                one_sec_tick <= '1';
            else
                sec_cnt      <= sec_cnt + 1;
                one_sec_tick <= '0';
            end if;
        end if;
    end process;

    -- 2. BỘ ĐẾM THỜI GIAN PHA VÀ CHUYỂN TRẠNG THÁI FSM
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            current_state <= S_NS_GREEN;
            timer_cnt     <= 0;
        elsif rising_edge(clk) then
            if one_sec_tick = '1' then
                case current_state is
                    when S_NS_GREEN =>
                        if timer_cnt >= 29 then -- 30 giây
                            current_state <= S_NS_YELLOW;
                            timer_cnt     <= 0;
                        else
                            timer_cnt <= timer_cnt + 1;
                        end if;

                    when S_NS_YELLOW =>
                        if timer_cnt >= 4 then -- 5 giây
                            current_state <= S_EW_GREEN;
                            timer_cnt     <= 0;
                        else
                            timer_cnt <= timer_cnt + 1;
                        end if;

                    when S_EW_GREEN =>
                        if timer_cnt >= 29 then -- 30 giây
                            current_state <= S_EW_YELLOW;
                            timer_cnt     <= 0;
                        else
                            timer_cnt <= timer_cnt + 1;
                        end if;

                    when S_EW_YELLOW =>
                        if timer_cnt >= 4 then -- 5 giây
                            current_state <= S_NS_GREEN;
                            timer_cnt     <= 0;
                        else
                            timer_cnt <= timer_cnt + 1;
                        end if;
                end case;
            end if;
        end if;
    end process;

    -- 3. XUẤT ĐÈN THEO TRẠNG THÁI (Moore Logic: Bit 2=Đỏ, 1=Vàng, 0=Xanh)
    process(current_state)
    begin
        case current_state is
            when S_NS_GREEN =>
                ns_lights <= "001"; -- NS: Xanh
                ew_lights <= "100"; -- EW: Đỏ

            when S_NS_YELLOW =>
                ns_lights <= "010"; -- NS: Vàng
                ew_lights <= "100"; -- EW: Đỏ

            when S_EW_GREEN =>
                ns_lights <= "100"; -- NS: Đỏ
                ew_lights <= "001"; -- EW: Xanh

            when S_EW_YELLOW =>
                ns_lights <= "100"; -- NS: Đỏ
                ew_lights <= "010"; -- EW: Vàng
        end case;
    end process;

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_traffic_light",
      code: `--------------------------------------------------------------------------------
-- Testbench mô phỏng chu trình 4 pha đèn giao thông
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_traffic_light is
end entity tb_traffic_light;

architecture sim of tb_traffic_light is
    signal clk       : std_logic := '0';
    signal rst_n     : std_logic := '0';
    signal ns_lights : std_logic_vector(2 downto 0);
    signal ew_lights : std_logic_vector(2 downto 0);
begin
    uut: entity work.traffic_light_controller
        port map ( clk => clk, rst_n => rst_n, ns_lights => ns_lights, ew_lights => ew_lights );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 50 ns;
        rst_n <= '1';
        -- Cho chạy kiểm tra chuyển pha
        wait for 2000 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim: Quan sát `ns_lights` và `ew_lights`. Nhận xét thấy đèn Đỏ và đèn Xanh của hai tuyến không bao giờ được tích cực cùng một lúc."
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án traffic_light_controller.",
        "2. Để test trên kit nhìn thấy chuyển pha nhanh, bạn có thể chỉnh hằng số TICKS_PER_SEC xuống 5,000,000 (0.1s mỗi nhịp).",
        "3. Gán chân: clk = PIN_Y2, rst_n = PIN_M23, ns_lights[0] = PIN_E21 (LEDG0), ns_lights[1] = PIN_G19 (LEDR0), ns_lights[2] = PIN_F19 (LEDR1), ew_lights[0] = PIN_E22 (LEDG1), ew_lights[1] = PIN_E19 (LEDR2), ew_lights[2] = PIN_F21 (LEDR3).",
        "4. Nạp file .sof lên kit DE2-115 và xem đèn đổi màu tự động."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "ns_lights[0]", pin: "PIN_E21", ioStandard: "2.5 V", note: "LEDG0 (NS Xanh)" },
        { signal: "ns_lights[1]", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0 (NS Vàng)" },
        { signal: "ns_lights[2]", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1 (NS Đỏ)" },
        { signal: "ew_lights[0]", pin: "PIN_E22", ioStandard: "2.5 V", note: "LEDG1 (EW Xanh)" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_E21 -to "ns_lights[0]"\nset_location_assignment PIN_G19 -to "ns_lights[1]"\nset_location_assignment PIN_F19 -to "ns_lights[2]"\nset_location_assignment PIN_E22 -to "ew_lights[0]"`
    },

    commonErrors: [
      {
        error: "Quên reset biến timer_cnt khi chuyển sang trạng thái mới",
        cause: "Nếu không reset timer_cnt về 0 tại thời điểm chuyển trạng thái, pha kế tiếp sẽ đọc nhầm số đếm cũ và chuyển pha ngay lập tức chỉ sau 1 giây.",
        fix: "Luôn gán `timer_cnt <= 0;` đồng thời trong câu lệnh chuyển trạng thái `current_state <= NEXT;`."
      },
      {
        error: "Đặt hằng số chia xung 50,000,000 khi chạy mô phỏng ModelSim",
        cause: "Đếm 50 triệu chu kỳ 20 ns trong ModelSim sẽ mất nhiều phút mô phỏng máy tính mới qua được 1 giây thực tế.",
        fix: "Dùng generic hoặc giảm hằng số xuống 50 hoặc 100 khi mô phỏng trong testbench."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Bổ sung nút ấn Người đi bộ (Pedestrian Button)",
        prompt: "Thêm ngõ vào `ped_btn : in std_logic` (KEY1). Khi người đi bộ ấn nút, nếu đang ở NS Xanh thì rút ngắn thời gian còn 5 giây để nhanh chóng chuyển đèn.",
        hint: "if ped_btn = '0' and timer_cnt > 5 then current_state <= S_NS_YELLOW; timer_cnt <= 0;",
        solution: "Bổ sung kiểm tra ngõ vào ped_btn trong trạng thái S_NS_GREEN để kích hoạt chuyển sang pha vàng sớm hơn."
      },
      {
        level: "Vận dụng",
        title: "Chế độ ban đêm: Đèn Vàng chớp nháy (Night Mode)",
        prompt: "Khi bật công tắc SW17 = 1 (Chế độ ban đêm), FSM chuyển sang chế độ chớp tắt đèn vàng 1 Hz cho cả hai tuyến đường.",
        hint: "Tạo trạng thái S_NIGHT: ngõ ra đèn vàng lật trạng thái theo xung nhịp 1 Hz.",
        solution: "Thêm trạng thái S_NIGHT: khi SW17='1' thì chuyển sang S_NIGHT, tại đây ns_lights <= \"010\" khi blink='1' else \"000\"."
      },
      {
        level: "Thử thách",
        title: "Bộ đếm lùi số giây hiển thị ra LED 7 đoạn HEX1-HEX0",
        prompt: "Kết nối giá trị số giây còn lại (ví dụ: đếm ngược 30, 29... về 0) ra 2 màn hình LED 7 đoạn HEX1 và HEX0.",
        hint: "Hiệu số: `time_left = 30 - timer_cnt`. Giải mã BCD hàng chục và hàng đơn vị ra HEX1 và HEX0.",
        solution: "Tạo tín hiệu rem_time <= 30 - timer_cnt; tách chục bằng rem_time / 10 và đơn vị bằng rem_time mod 10 rồi nối qua bộ giải mã 7 đoạn."
      }
    ],

    quiz: [
      {
        question: "Hệ thống đèn giao thông ngã tư chuẩn 4 pha có thứ tự chuyển tiếp an toàn nào sau đây?",
        options: [
          "NS Xanh -> NS Vàng -> EW Xanh -> EW Vàng -> lặp lại",
          "NS Xanh -> EW Xanh -> NS Vàng -> EW Vàng",
          "Tất cả cùng Xanh rồi cùng Đỏ",
          "NS Vàng -> EW Vàng -> NS Xanh"
        ],
        answerIndex: 0,
        explanation: "Thứ tự an toàn kinh điển: Một tuyến đường đang xanh phải chuyển qua vàng để giảm tốc trước khi chuyển sang đỏ và nhường quyền xanh cho tuyến kia."
      },
      {
        question: "Để tạo nhịp đếm 1 giây từ nguồn dao động thạch anh 50 MHz CLOCK_50 trên DE2-115, bộ đếm cần đếm bao nhiêu chu kỳ?",
        options: [
          "50,000,000 chu kỳ",
          "50,000 chu kỳ",
          "1,000,000 chu kỳ",
          "25,000,000 chu kỳ"
        ],
        answerIndex: 0,
        explanation: "50 MHz có chu kỳ 20 ns, trong 1 giây có đúng 50,000,000 chu kỳ xung nhịp."
      },
      {
        question: "Tại sao không được để cả hai tuyến đường cùng xuất đèn Xanh ở bất kỳ trạng thái nào?",
        options: [
          "Vì vi phạm nguyên tắc khóa liên động an toàn (Fail-Safe), sẽ gây ra xung đột giao thông",
          "Vì tốn điện năng của chip FPGA",
          "Vì đèn LED sẽ bị cháy",
          "Vì Quartus không cho phép tổng hợp"
        ],
        answerIndex: 0,
        explanation: "Khóa liên động an toàn đảm bảo tính tin cậy tuyệt đối của hệ thống điều khiển giao thông thực tế."
      },
      {
        question: "Khi chuyển từ trạng thái này sang trạng thái khác trong FSM có bộ đếm định thời, hành động nào là bắt buộc đối với biến đếm timer?",
        options: [
          "Xóa biến đếm về 0 (timer_cnt <= 0)",
          "Giữ nguyên giá trị cũ",
          "Tăng lên gấp đôi",
          "Gán về giá trị âm"
        ],
        answerIndex: 0,
        explanation: "Bắt buộc phải đặt lại biến đếm thời gian về 0 để pha tiếp theo bắt đầu đo đúng số giây quy định của nó."
      }
    ],

    summary: [
      "FSM kết hợp Timer là cấu trúc nền tảng cho mọi hệ thống tự động hóa thời gian thực.",
      "Chu trình 4 pha đèn giao thông đảm bảo xe cộ giảm tốc an toàn trước khi đổi làn ưu tiên.",
      "Bộ chia xung 50 MHz xuống 1 Hz cung cấp nhịp thời gian chuẩn xác 1 giây vật lý.",
      "Luôn đặt lại biến đếm thời gian pha về 0 tại thời điểm chuyển trạng thái.",
      "Thiết kế an toàn phần cứng (Fail-Safe) triệt tiêu hoàn toàn nguy cơ xung đột tín hiệu."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["KEY0"],
      activeOutputs: ["LEDR0", "LEDR1", "LEDG0", "LEDG1"],
      logicEvaluator: function(inputs) {
        if (inputs.KEY0 === 0) return { LEDR0: 1, LEDR1: 0, LEDG0: 0, LEDG1: 0 };
        return { LEDR0: 0, LEDR1: 1, LEDG0: 1, LEDG1: 0 };
      }
    },

    fsmConfig: {
      title: "Hệ thống Đèn Giao Thông 4 pha (Bài 5.4)",
      type: "moore",
      inputs: { din: 0, rst_n: 1 },
      resetState: "S_NS_G",
      states: [
        { id: "S_NS_G", name: "Bắc-Nam Xanh (30s)", code: "00", x: 130, y: 120, mooreOut: "NS:Xanh, EW:Đỏ" },
        { id: "S_NS_Y", name: "Bắc-Nam Vàng (5s)",  code: "01", x: 320, y: 90,  mooreOut: "NS:Vàng, EW:Đỏ" },
        { id: "S_EW_G", name: "Đông-Tây Xanh (30s)", code: "10", x: 510, y: 120, mooreOut: "NS:Đỏ, EW:Xanh" },
        { id: "S_EW_Y", name: "Đông-Tây Vàng (5s)",  code: "11", x: 320, y: 220, mooreOut: "NS:Đỏ, EW:Vàng" }
      ],
      transitions: [
        { from: "S_NS_G", to: "S_NS_Y", inputVal: 1, label: "timer=30s", curvature: 0.1 },
        { from: "S_NS_G", to: "S_NS_G", inputVal: 0, label: "đang đếm", selfLoop: true },
        { from: "S_NS_Y", to: "S_EW_G", inputVal: 1, label: "timer=5s",  curvature: 0.1 },
        { from: "S_EW_G", to: "S_EW_Y", inputVal: 1, label: "timer=30s", curvature: 0.1 },
        { from: "S_EW_G", to: "S_EW_G", inputVal: 0, label: "đang đếm", selfLoop: true },
        { from: "S_EW_Y", to: "S_NS_G", inputVal: 1, label: "timer=5s",  curvature: 0.1 }
      ]
    }
  },

  // ========================================================================
  // BÀI 5.5
  // ========================================================================
  {
    id: "ch5-b5",
    chapterId: "ch5",
    order: 5,
    title: "Bộ truyền dữ liệu nối tiếp UART Transmitter (TX) FSM",
    subtitle: "Giao tiếp máy tính PC với FPGA qua chuẩn RS-232 / UART tốc độ 115200 Baud",
    badge: "Giao tiếp",
    estimatedMinutes: 40,
    hardwareFocus: ["UART TX FSM", "Baud Rate Generator", "Start/Data/Stop Bits", "UART_TXD (PIN_G12)"],

    objectives: [
      "Hiểu sâu giao thức truyền thông nối tiếp bất đồng bộ UART (Universal Asynchronous Receiver-Transmitter) chuẩn 8N1.",
      "Thiết kế bộ tạo nhịp Baud Rate 115200 bps từ xung thạch anh 50 MHz CLOCK_50.",
      "Xây dựng máy trạng thái FSM điều khiển quá trình phát khung tin: IDLE -> START bit -> 8 DATA bits -> STOP bit.",
      "Truyền dữ liệu từ kit DE2-115 lên máy tính PC hiển thị ký tự ASCII trên Terminal (Putty / TeraTerm)."
    ],

    theory: {
      why: "Làm thế nào để chip FPGA có thể gửi kết quả tính toán, nhiệt độ hay dữ liệu cảm biến về máy tính bảng, PC hoặc vi điều khiển khác? Chuẩn UART là giao thức truyền thông cơ bản và phổ biến nhất trên thế giới. Nó chỉ cần đúng 1 sợi dây phát (TX) và 1 sợi dây mass (GND) để truyền dữ liệu đi xa.",
      how: "Khung truyền dữ liệu UART chuẩn 8N1 (8 Data bits, No Parity, 1 Stop bit):\n1. **Trạng thái nghỉ (IDLE):** Đường dây TX luôn được giữ ở mức cao ('1').\n2. **Start bit (Bit bắt đầu):** Kéo đường dây TX từ '1' xuống mức thấp ('0') trong đúng 1 khoảng thời gian bit (Bit Period) để báo cho đầu thu biết sắp có dữ liệu.\n3. **8 Data bits (Dữ liệu):** Lần lượt phát 8 bit dữ liệu từ bit có trọng số thấp nhất (LSB - D0) đến bit cao nhất (MSB - D7).\n4. **Stop bit (Bit kết thúc):** Kéo đường dây TX trở lại mức cao ('1') trong ít nhất 1 khoảng thời gian bit để hoàn tất khung tin.\n\nTính toán Tốc độ Baud (Baud Rate Generator):\n- Tần số xung clock kit DE2-115: `F_clk = 50,000,000 Hz`.\n- Tốc độ truyền mong muốn: `Baud = 115,200 bps`.\n- Số chu kỳ clock cho mỗi bit: `CLKS_PER_BIT = 50,000,000 / 115,200 = 434 chu kỳ`.\nCứ sau đúng 434 chu kỳ clock 50 MHz, bộ đếm nhịp phát ra 1 xung `baud_tick = '1'` để FSM dịch sang bit tiếp theo.",
      sections: [
        {
          heading: "1. Đồ hình trạng thái FSM của bộ phát UART TX",
          content: "- `S_IDLE`: Giữ `tx = '1'`. Khi có tín hiệu kích phát `tx_start = '1'`, chuyển sang `S_START`.\n- `S_START`: Giữ `tx = '0'` trong 434 chu kỳ clock (1 bit time). Sau đó chuyển sang `S_DATA`.\n- `S_DATA`: Phát `tx = data_buffer(bit_index)`. Cứ mỗi nhịp baud tăng `bit_index`. Khi phát xong 8 bit (index = 7), chuyển sang `S_STOP`.\n- `S_STOP`: Giữ `tx = '1'` trong 434 chu kỳ clock. Bật cờ `tx_done = '1'` và quay về `S_IDLE`.",
          callout: {
            type: "info",
            title: "Cổng RS-232 trên kit DE2-115",
            text: "Kit Terasic DE2-115 có sẵn cổng DB9 kết nối chip chuyển mức MAX3232 nối với chân FPGA `UART_TXD` (PIN_G12). Bạn có thể cắm cáp USB-to-RS232 nối vào cổng USB máy tính để mở cửa sổ dòng lệnh PuTTY xem chữ chạy!"
          }
        }
      ],
      truthTable: {
        headers: ["Trạng thái FSM", "Mức logic trên chân TX", "Thời gian duy trì", "Điều kiện chuyển tiếp"],
        rows: [
          ["S_IDLE", "'1' (Mức nghỉ cao)", "Vô hạn (Đợi lệnh)", "tx_start = '1' -> chuyển sang S_START"],
          ["S_START", "'0' (Start Bit)", "1 bit time (434 nhịp clk)", "Hết nhịp baud -> chuyển sang S_DATA"],
          ["S_DATA", "data(bit_index) (D0..D7)", "8 bit times (LSB trước)", "Đã phát đủ 8 bit -> chuyển sang S_STOP"],
          ["S_STOP", "'1' (Stop Bit)", "1 bit time (434 nhịp clk)", "Hết nhịp baud -> chuyển về S_IDLE"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Khung dữ liệu UART 8N1 và FSM -->
      <g transform="translate(30, 25)">
        <text x="270" y="20" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">KHUNG DỮ LIỆU NỐI TIẾP UART (8N1)</text>
        <!-- Dạng sóng TX -->
        <path d="M 20,50 L 50,50 L 50,90 L 90,90 L 90,50 L 130,50 L 130,90 L 170,90 L 170,50 L 210,50 L 210,90 L 250,90 L 250,50 L 290,50 L 290,90 L 330,90 L 330,50 L 380,50 L 420,50" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
        <text x="35" y="42" fill="#94a3b8" font-size="9">IDLE</text>
        <text x="70" y="105" fill="#ef4444" font-size="9" font-weight="bold">START(0)</text>
        <text x="110" y="42" fill="#10b981" font-size="9">D0</text>
        <text x="150" y="105" fill="#10b981" font-size="9">D1</text>
        <text x="190" y="42" fill="#10b981" font-size="9">D2</text>
        <text x="230" y="105" fill="#10b981" font-size="9">D3</text>
        <text x="270" y="42" fill="#10b981" font-size="9">D4..D6</text>
        <text x="310" y="105" fill="#10b981" font-size="9">D7</text>
        <text x="355" y="42" fill="#f59e0b" font-size="9" font-weight="bold">STOP(1)</text>

        <!-- Sơ đồ FSM 4 trạng thái bên dưới -->
        <circle cx="100" cy="155" r="22" fill="#131e33" stroke="#38bdf8" stroke-width="1.5"/><text x="100" y="158" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold">IDLE</text>
        <circle cx="220" cy="155" r="22" fill="#131e33" stroke="#ef4444" stroke-width="1.5"/><text x="220" y="158" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold">START</text>
        <circle cx="340" cy="155" r="22" fill="#131e33" stroke="#10b981" stroke-width="1.5"/><text x="340" y="158" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold">DATA</text>
        <circle cx="460" cy="155" r="22" fill="#131e33" stroke="#f59e0b" stroke-width="1.5"/><text x="460" y="158" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold">STOP</text>
        <line x1="122" y1="155" x2="198" y2="155" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow)"/>
        <line x1="242" y1="155" x2="318" y2="155" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow)"/>
        <line x1="362" y1="155" x2="438" y2="155" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow)"/>
        <path d="M 460,177 L 460,195 L 100,195 L 100,177" fill="none" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow)"/>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "uart_transmitter",
      circuitType: "sequential",
      typeExplanation: "Máy trạng thái giao tiếp tuần tự: Điều khiển phát khung UART chuẩn 8N1 tốc độ 115200 Baud đồng bộ theo bộ chia xung nhịp 434 chu kỳ.",
      code: `--------------------------------------------------------------------------------
-- Tên file: uart_transmitter.vhd
-- Bộ phát dữ liệu UART TX tốc độ 115200 bps chuẩn 8N1
-- Kit: Terasic DE2-115 (CLOCK_50: PIN_Y2, UART_TXD: PIN_G12)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity uart_transmitter is
    port (
        clk         : in  std_logic;                    -- 50 MHz (PIN_Y2)
        rst_n       : in  std_logic;                    -- KEY0 (PIN_M23)
        tx_start    : in  std_logic;                    -- Xung kích phát dữ liệu (KEY1)
        tx_data_in  : in  std_logic_vector(7 downto 0); -- 8 bit dữ liệu ASCII (SW7..0)
        txd         : out std_logic;                    -- Chân xuất TX (PIN_G12)
        tx_busy     : out std_logic                     -- Cờ báo đang bận truyền (LEDR0)
    );
end entity uart_transmitter;

architecture rtl of uart_transmitter is
    -- 50 MHz / 115200 Baud = 434 chu kỳ clock mỗi bit
    constant CLKS_PER_BIT : integer := 434;

    type state_t is (S_IDLE, S_START, S_DATA, S_STOP);
    signal state : state_t := S_IDLE;

    signal clk_cnt   : integer range 0 to CLKS_PER_BIT := 0;
    signal bit_index : integer range 0 to 7 := 0;
    signal data_reg  : std_logic_vector(7 downto 0) := (others => '0');
    signal txd_reg   : std_logic := '1';
begin
    txd     <= txd_reg;
    tx_busy <= '0' when state = S_IDLE else '1';

    process(clk, rst_n)
    begin
        if rst_n = '0' then
            state     <= S_IDLE;
            clk_cnt   <= 0;
            bit_index <= 0;
            txd_reg   <= '1';
        elsif rising_edge(clk) then
            case state is
                -- 1. TRẠNG THÁI NGHỈ: TX ở mức cao '1'
                when S_IDLE =>
                    txd_reg <= '1';
                    clk_cnt <= 0;
                    bit_index <= 0;
                    -- Bắt đầu truyền khi có xung tx_start kích hoạt (Active-Low từ KEY1)
                    if tx_start = '0' then
                        data_reg <= tx_data_in; -- Nạp dữ liệu vào thanh ghi đệm
                        state    <= S_START;
                    end if;

                -- 2. START BIT: Kéo TX xuống '0' trong 434 chu kỳ clock
                when S_START =>
                    txd_reg <= '0';
                    if clk_cnt < CLKS_PER_BIT - 1 then
                        clk_cnt <= clk_cnt + 1;
                    else
                        clk_cnt <= 0;
                        state   <= S_DATA;
                    end if;

                -- 3. 8 DATA BITS: Lần lượt xuất từ D0 đến D7
                when S_DATA =>
                    txd_reg <= data_reg(bit_index);
                    if clk_cnt < CLKS_PER_BIT - 1 then
                        clk_cnt <= clk_cnt + 1;
                    else
                        clk_cnt <= 0;
                        if bit_index < 7 then
                            bit_index <= bit_index + 1;
                        else
                            bit_index <= 0;
                            state     <= S_STOP;
                        end if;
                    end if;

                -- 4. STOP BIT: Kéo TX lên '1' trong 434 chu kỳ clock
                when S_STOP =>
                    txd_reg <= '1';
                    if clk_cnt < CLKS_PER_BIT - 1 then
                        clk_cnt <= clk_cnt + 1;
                    else
                        clk_cnt <= 0;
                        state   <= S_IDLE;
                    end if;
            end case;
        end if;
    end process;

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_uart_transmitter",
      code: `--------------------------------------------------------------------------------
-- Testbench mô phỏng truyền ký tự ASCII 'A' (Mã nhị phân 01000001 = 0x41)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_uart_transmitter is
end entity tb_uart_transmitter;

architecture sim of tb_uart_transmitter is
    signal clk      : std_logic := '0';
    signal rst_n    : std_logic := '0';
    signal tx_start : std_logic := '1';
    signal data_in  : std_logic_vector(7 downto 0) := x"41"; -- Ký tự 'A'
    signal txd      : std_logic;
    signal tx_busy  : std_logic;
begin
    uut: entity work.uart_transmitter
        port map (
            clk        => clk,
            rst_n      => rst_n,
            tx_start   => tx_start,
            tx_data_in => data_in,
            txd        => txd,
            tx_busy    => tx_busy
        );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 50 ns;
        rst_n <= '1'; wait for 50 ns;

        -- Kích xung nhấn nút KEY1 phát ký tự 'A'
        tx_start <= '0'; wait for 40 ns;
        tx_start <= '1';

        -- Chờ phát xong toàn bộ khung 10 bit (khoảng 90 us)
        wait for 100 us;
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim: Quan sát dạng sóng `txd`. Bạn sẽ thấy chuỗi bit nối tiếp: Start(0) -> 1,0,0,0,0,0,1,0 (0x41 LSB first) -> Stop(1)."
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án uart_transmitter trong Quartus Prime.",
        "2. Nạp mã nguồn VHDL và biên dịch.",
        "3. Gán chân: clk = PIN_Y2 (CLOCK_50), rst_n = PIN_M23 (KEY0), tx_start = PIN_M21 (KEY1), tx_data_in[7..0] = SW[7..0] (PIN_AB26..AB28), txd = PIN_G12 (UART_TXD), tx_busy = PIN_G19 (LEDR0).",
        "4. Cắm cáp RS232 từ DE2-115 vào PC, mở PuTTY tốc độ 115200, gạt công tắc SW và ấn KEY1 để thấy chữ in trên màn hình!"
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "tx_start", pin: "PIN_M21", ioStandard: "2.5 V", note: "KEY1" },
        { signal: "txd", pin: "PIN_G12", ioStandard: "3.3-V LVTTL", note: "UART_TXD (Cổng RS-232)" },
        { signal: "tx_busy", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_M21 -to tx_start\nset_location_assignment PIN_G12 -to txd\nset_location_assignment PIN_G19 -to tx_busy`
    },

    commonErrors: [
      {
        error: "Tính sai hằng số CLKS_PER_BIT dẫn đến lệch Baud Rate",
        cause: "Nếu tính nhầm 50,000,000 / 115,200 ra số khác 434, đầu thu trên PC sẽ đọc sai vị trí bit và sinh lỗi Framing Error / Ký tự rác.",
        fix: "Luôn kiểm tra kỹ công thức `CLKS_PER_BIT = F_clk / Baud_rate` (50 MHz / 115200 = 434)."
      },
      {
        error: "Truyền bit MSB trước thay vì LSB trước",
        cause: "Chuẩn UART quốc tế quy định truyền bit có trọng số thấp nhất (LSB - D0) đi trước tiên. Nếu phát D7 trước thì ký tự nhận được sẽ bị đảo ngược giá trị.",
        fix: "Xuất `txd_reg <= data_reg(bit_index)` với `bit_index` tăng dần từ 0 lên 7."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Thay đổi tốc độ sang 9600 Baud",
        prompt: "Tính toán lại hằng số `CLKS_PER_BIT` nếu muốn truyền dữ liệu ở tốc độ truyền thống 9600 bps.",
        hint: "50,000,000 / 9,600 = 5,208 chu kỳ.",
        solution: "constant CLKS_PER_BIT : integer := 5208; Thay đổi giá trị hằng số này trong mã nguồn."
      },
      {
        level: "Vận dụng",
        title: "Tự động phát chuỗi chữ 'HELLO'",
        prompt: "Nâng cấp mạch FSM tầng trên để khi bấm nút KEY1 một lần, mạch tự động gửi liên tiếp 5 ký tự 'H', 'E', 'L', 'L', 'O'.",
        hint: "Dùng một ROM nhỏ 5 byte và FSM phụ duyệt từng byte khi cờ tx_busy hạ xuống 0.",
        solution: "Tạo một mảng ROM 5 ký tự và FSM master: mỗi khi tx_busy chuyển từ 1 về 0 thì tăng con trỏ và kích tx_start gửi ký tự kế tiếp."
      },
      {
        level: "Thử thách",
        title: "Bổ sung Parity Bit (Chẵn/Lẻ) kiểm tra lỗi",
        prompt: "Mở rộng khung truyền thành chuẩn 8E1 (8 data bits, Even Parity, 1 Stop bit). Thiết kế thêm trạng thái S_PARITY.",
        hint: "Tính chẵn lẻ bằng toán tử XOR: `parity_bit <= data(0) xor data(1) xor ... xor data(7);`",
        solution: "Thêm trạng thái S_PARITY giữa S_DATA và S_STOP, phát bit kiểm tra tính bằng phép XOR rút gọn của 8 bit dữ liệu."
      }
    ],

    quiz: [
      {
        question: "Cấu trúc một khung truyền nối tiếp UART chuẩn 8N1 gồm những thành phần nào theo thứ tự thời gian?",
        options: [
          "1 Start bit ('0') -> 8 Data bits (LSB first) -> 1 Stop bit ('1')",
          "1 Stop bit -> 8 Data bits -> 1 Start bit",
          "8 Data bits -> 1 Parity bit -> 1 Stop bit",
          "1 Start bit -> 8 Data bits (MSB first)"
        ],
        answerIndex: 0,
        explanation: "Chuẩn UART 8N1 bắt đầu bằng Start bit mức 0, theo sau bởi 8 bit dữ liệu truyền LSB trước, và kết thúc bằng Stop bit mức 1."
      },
      {
        question: "Với xung clock 50 MHz của kit DE2-115, số chu kỳ clock cho mỗi bit ở tốc độ 115200 bps là bao nhiêu?",
        options: [
          "434 chu kỳ",
          "5208 chu kỳ",
          "50000 chu kỳ",
          "1152 chu kỳ"
        ],
        answerIndex: 0,
        explanation: "50,000,000 Hz / 115,200 Baud ≈ 434 chu kỳ xung nhịp."
      },
      {
        question: "Khi đường truyền UART ở trạng thái nghỉ (IDLE không có dữ liệu truyền), chân TX được giữ ở mức logic nào?",
        options: [
          "Mức cao ('1')",
          "Mức thấp ('0')",
          "Mức trở kháng cao (Z)",
          "Dao động 1 kHz"
        ],
        answerIndex: 0,
        explanation: "Đường truyền UART luôn giữ mức cao '1' khi rảnh để khi Start bit '0' xuất hiện, đầu thu có thể lập tức phát hiện cạnh xuống (Falling Edge)."
      },
      {
        question: "Chân kết nối vật lý nào trên chip Cyclone IV của kit DE2-115 nối với đường truyền UART_TXD của cổng RS-232?",
        options: [
          "PIN_G12",
          "PIN_Y2",
          "PIN_M23",
          "PIN_AB28"
        ],
        answerIndex: 0,
        explanation: "Theo DE2-115 User Manual: Chân phát dữ liệu UART_TXD của chip Cyclone IV được nối vào chân PIN_G12."
      }
    ],

    summary: [
      "UART là chuẩn giao tiếp nối tiếp bất đồng bộ thông dụng nhất giữa FPGA và máy tính PC.",
      "Khung truyền 8N1 chuẩn: Start bit (0) -> 8 Data bits (LSB trước) -> Stop bit (1).",
      "Bộ chia Baud Rate xác định độ rộng thời gian của 1 bit (ở 50 MHz và 115200 bps là 434 chu kỳ).",
      "FSM 4 trạng thái (IDLE, START, DATA, STOP) điều phối quy trình phát nối tiếp chính xác tuyệt đối.",
      "Cổng RS-232 (PIN_G12) trên DE2-115 cho phép học viên hiển thị trực tiếp dữ liệu lên phần mềm PuTTY."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["KEY0", "KEY1"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        if (inputs.KEY0 === 0) return { LEDR0: 0 };
        return { LEDR0: inputs.KEY1 === 0 ? 1 : 0 };
      }
    },

    fsmConfig: {
      title: "Bộ phát UART Transmitter (Bài 5.5)",
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
    }
  }
];

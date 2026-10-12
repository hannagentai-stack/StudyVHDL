// ==========================================================================
// CH7_HARDWARE.JS - CHƯƠNG 7: LÀM VIỆC VỚI KIT TERASIC DE2-115 (5 BÀI HỌC)
// ==========================================================================

window.VHDL_LESSONS_DB = window.VHDL_LESSONS_DB || {};

window.VHDL_LESSONS_DB["ch7"] = [
  // ========================================================================
  // BÀI 7.1
  // ========================================================================
  {
    id: "ch7-b1",
    chapterId: "ch7",
    order: 1,
    title: "Gán chân Pin Planner và Quản lý file cấu hình .qsf",
    subtitle: "Kết nối thế giới mã nguồn logic với các chân kim loại vật lý của chip Cyclone IV",
    badge: "Phần cứng",
    estimatedMinutes: 30,
    hardwareFocus: ["Pin Planner", "DE2-115 .qsf", "I/O Standards 3.3V/2.5V"],

    objectives: [
      "Hiểu rõ vai trò của công cụ Pin Planner trong Quartus Prime: Ánh xạ cổng I/O của entity ra chân BGA thực tế.",
      "Nắm vững cấu trúc và cú pháp của file cấu hình dự án `.qsf` (Quartus Settings File).",
      "Phân biệt các chuẩn điện áp I/O Standard: 3.3-V LVTTL (Clock, RS-232, VGA) và 2.5 V (LED, Switch, Key).",
      "Nhập (Import) danh sách gán chân tự động từ file mẫu `DE2_115.qsf` của nhà sản xuất Terasic."
    ],

    theory: {
      why: "Khi bạn viết `port (led : out std_logic)`, phần mềm Quartus không thể tự đoán bạn muốn bóng đèn LED nào trên bo mạch sáng lên. Chip FPGA Cyclone IV EP4CE115 có tới 780 chân hàn dạng bi BGA. Nếu bạn không gán chân hoặc gán nhầm, Quartus sẽ tự ý gán vào các chân ngẫu nhiên, mạch sẽ không hoạt động hoặc thậm chí gây chập điện hỏng chip. Gán chân chính xác là bước nối liền giữa phần mềm và phần cứng thực tế.",
      how: "1. **Gán chân bằng giao diện đồ họa Pin Planner:**\n- Chạy `Analysis & Synthesis` (Ctrl+K) trước để Quartus nhận diện các cổng trong entity.\n- Mở menu `Assignments -> Pin Planner`.\n- Trong bảng All Pins bên dưới, tìm tên cổng tín hiệu tại cột `Node Name`.\n- Điền mã chân vào cột `Location` (ví dụ: `PIN_Y2` cho clock, `PIN_G19` cho LEDR0).\n- Chọn điện áp tại cột `I/O Standard` (mặc định 2.5 V cho công tắc/LED, 3.3-V LVTTL cho clock).\n\n2. **Gán chân bằng file cấu hình `.qsf`:**\n- Mọi thao tác trong Pin Planner thực chất đều được lưu thành các dòng văn bản trong file `<project_name>.qsf`.\n- Cú pháp chuẩn:\n```tcl\nset_location_assignment PIN_Y2 -to CLOCK_50\nset_instance_assignment -name IO_STANDARD \"3.3-V LVTTL\" -to CLOCK_50\nset_location_assignment PIN_M23 -to KEY[0]\nset_location_assignment PIN_AB28 -to SW[0]\nset_location_assignment PIN_G19 -to LEDR[0]\n```\n- Bạn có thể mở trực tiếp file `.qsf` bằng Notepad hoặc trình soạn thảo của Quartus, dán danh sách chân vào cuối file và lưu lại. Đây là cách làm nhanh gấp 50 lần so với gõ tay từng chân!",
      sections: [
        {
          heading: "1. Tải file mẫu DE2_115.qsf chuẩn của Terasic",
          content: "Trong đĩa CD kèm theo kit DE2-115 hoặc trên trang web chính thức của Terasic, nhà sản xuất cung cấp sẵn file `DE2_115.qsf` chứa toàn bộ 780 chân của kit đã được đặt tên chuẩn (`CLOCK_50`, `KEY[3..0]`, `SW[17..0]`, `LEDR[17..0]`, `LEDG[8..0]`, `HEX0..HEX7`, `VGA_*`, `UART_*`). Bạn chỉ cần copy nội dung file này vào dự án của mình là xong!",
          callout: {
            type: "warning",
            title: "Tránh gán chân chưa dùng (Unused Pins)",
            text: "Quartus mặc định có thể lái các chân chưa dùng xuống mức '0' (GND). Nếu chân đó ngoài đời đang nối với nguồn 3.3V của bo mạch, chip sẽ bị chập nguồn! Luôn thiết lập: `Assignments -> Device -> Device and Pin Options -> Unused Pins -> As input tri-stated`."
          }
        }
      ],
      truthTable: {
        headers: ["Linh kiện ngoại vi", "Tên cổng quy ước", "Mã chân vật lý Cyclone IV", "Chuẩn điện áp I/O"],
        rows: [
          ["Xung Clock 50 MHz", "CLOCK_50", "PIN_Y2", "3.3-V LVTTL"],
          ["Nút nhấn KEY0", "KEY[0]", "PIN_M23", "2.5 V (Active-Low)"],
          ["Nút nhấn KEY1", "KEY[1]", "PIN_M21", "2.5 V (Active-Low)"],
          ["Công tắc SW0", "SW[0]", "PIN_AB28", "2.5 V (Active-High)"],
          ["LED Đỏ LEDR0", "LEDR[0]", "PIN_G19", "2.5 V (Active-High)"],
          ["LED Xanh LEDG0", "LEDG[0]", "PIN_E21", "2.5 V (Active-High)"],
          ["LED 7 đoạn HEX0-a", "HEX0[0]", "PIN_G18", "2.5 V (Active-Low)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ Pin Planner và Chip BGA Cyclone IV -->
      <g transform="translate(30, 20)">
        <rect x="30" y="25" width="160" height="130" rx="8" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="110" y="55" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">Entity VHDL</text>
        <text x="110" y="80" text-anchor="middle" fill="#f8fafc" font-size="10">clk, rst_n, sw, led</text>
        <text x="110" y="105" text-anchor="middle" fill="#94a3b8" font-size="9">(Tên logic)</text>

        <path d="M 190,90 L 260,90" stroke="#f59e0b" stroke-width="3" marker-end="url(#arrow)"/>
        <text x="225" y="80" text-anchor="middle" fill="#f59e0b" font-size="9" font-weight="bold">Pin Planner</text>

        <!-- Chip Cyclone IV BGA -->
        <rect x="270" y="15" width="160" height="150" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
        <text x="350" y="45" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">EP4CE115F29C7</text>
        <!-- Lưới chân BGA -->
        <circle cx="300" cy="70" r="4" fill="#38bdf8"/><text x="320" y="73" fill="#94a3b8" font-size="8">PIN_Y2</text>
        <circle cx="300" cy="95" r="4" fill="#ef4444"/><text x="320" y="98" fill="#94a3b8" font-size="8">PIN_M23</text>
        <circle cx="300" cy="120" r="4" fill="#10b981"/><text x="320" y="123" fill="#94a3b8" font-size="8">PIN_G19</text>

        <path d="M 430,90 L 500,90" stroke="#10b981" stroke-width="3" marker-end="url(#arrow)"/>

        <!-- Phần cứng thực DE2-115 -->
        <rect x="500" y="25" width="120" height="130" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
        <text x="560" y="55" text-anchor="middle" fill="#a7f3d0" font-size="10" font-weight="bold">KIT DE2-115</text>
        <text x="560" y="80" text-anchor="middle" fill="#fff" font-size="9">Thạch anh 50MHz</text>
        <text x="560" y="105" text-anchor="middle" fill="#fff" font-size="9">Nút bấm KEY0</text>
        <text x="560" y="130" text-anchor="middle" fill="#fff" font-size="9">Bóng LEDR0 đỏ</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "de2_pin_mapping_demo",
      circuitType: "combinational",
      typeExplanation: "Mạch kiểm tra gán chân toàn diện: Đưa công tắc SW0 ra LEDR0, nút bấm KEY0 ra LEDG0 để kiểm tra kết nối vật lý.",
      code: `--------------------------------------------------------------------------------
-- Tên file: de2_pin_mapping_demo.vhd
-- Mạch kiểm chứng gán chân Pin Planner trên kit Terasic DE2-115
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity de2_pin_mapping_demo is
    port (
        -- Ngõ vào từ công tắc gạt và nút nhấn
        sw_in   : in  std_logic; -- SW0 (PIN_AB28)
        key_in  : in  std_logic; -- KEY0 (PIN_M23) - Active-Low
        -- Ngõ ra đèn LED
        led_red : out std_logic; -- LEDR0 (PIN_G19)
        led_grn : out std_logic  -- LEDG0 (PIN_E21)
    );
end entity de2_pin_mapping_demo;

architecture rtl of de2_pin_mapping_demo is
begin
    -- SW0 gạt lên '1' thì LEDR0 sáng
    led_red <= sw_in;

    -- KEY0 ấn xuống mức '0' thì đảo thành '1' để LEDG0 sáng khi bấm
    led_grn <= not key_in;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_de2_pin_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench mô phỏng kiểm tra hành vi gán chân
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_de2_pin_demo is
end entity tb_de2_pin_demo;

architecture sim of tb_de2_pin_demo is
    signal sw  : std_logic := '0';
    signal key : std_logic := '1'; -- Chưa ấn KEY0 là mức 1
    signal lr  : std_logic;
    signal lg  : std_logic;
begin
    uut: entity work.de2_pin_mapping_demo
        port map ( sw_in => sw, key_in => key, led_red => lr, led_grn => lg );

    stim: process
    begin
        wait for 20 ns;
        sw <= '1'; wait for 20 ns;
        key <= '0'; wait for 20 ns; -- Ấn KEY0
        key <= '1'; wait for 20 ns; -- Nhả KEY0
        sw <= '0'; wait for 20 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Sau khi nạp file .sof lên kit: Gạt SW0 sẽ thấy LEDR0 sáng; nhấn giữ nút KEY0 sẽ thấy LEDG0 xanh lá sáng lên."
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án de2_pin_mapping_demo chọn đúng chip Cyclone IV E: EP4CE115F29C7.",
        "2. Nạp code và bấm Ctrl+K (Analysis & Elaboration).",
        "3. Mở file de2_pin_mapping_demo.qsf bằng trình soạn thảo và dán đoạn qsfSnippet bên dưới vào cuối file.",
        "4. Bấm Ctrl+L (Start Compilation) để Quartus biên dịch và khóa chân.",
        "5. Mở Assignments -> Pin Planner kiểm tra: các chân sẽ hiện màu tím có biểu tượng ổ khóa."
      ],
      pinAssignments: [
        { signal: "sw_in", pin: "PIN_AB28", ioStandard: "2.5 V", note: "Công tắc gạt SW0" },
        { signal: "key_in", pin: "PIN_M23", ioStandard: "2.5 V", note: "Nút nhấn KEY0" },
        { signal: "led_red", pin: "PIN_G19", ioStandard: "2.5 V", note: "LED đỏ LEDR0" },
        { signal: "led_grn", pin: "PIN_E21", ioStandard: "2.5 V", note: "LED xanh lá LEDG0" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to sw_in\nset_location_assignment PIN_M23 -to key_in\nset_location_assignment PIN_G19 -to led_red\nset_location_assignment PIN_E21 -to led_grn\nset_instance_assignment -name IO_STANDARD "2.5 V" -to sw_in\nset_instance_assignment -name IO_STANDARD "2.5 V" -to key_in\nset_instance_assignment -name IO_STANDARD "2.5 V" -to led_red\nset_instance_assignment -name IO_STANDARD "2.5 V" -to led_grn`
    },

    commonErrors: [
      {
        error: "Quên chạy Analysis & Synthesis trước khi mở Pin Planner dẫn đến bảng All Pins trống trơn",
        cause: "Quartus cần phân tích mã VHDL để biết entity có những cổng nào trước khi hiển thị trong danh sách gán chân.",
        fix: "Luôn nhấn tổ hợp phím Ctrl+K để chạy Analysis & Elaboration trước khi mở Pin Planner."
      },
      {
        error: "Trùng tên cổng với tên file .qsf (Case Sensitivity hoặc sai dấu ngoặc vector)",
        cause: "Nếu trong VHDL khai báo `sw : in std_logic_vector(0 downto 0)` nhưng trong .qsf lại viết `set_location_assignment ... -to sw` (thiếu chỉ số [0]), Quartus sẽ không gán được chân.",
        fix: "Kiểm tra đúng kiểu đơn bit `sw` hay mảng vector `sw[0]`."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Gán chân cho SW1 và LEDR1",
        prompt: "Tra cứu tài liệu hướng dẫn kit DE2-115 và viết lệnh .qsf gán chân cho công tắc SW1 và đèn LEDR1.",
        hint: "SW1 là PIN_AC28, LEDR1 là PIN_F19.",
        solution: "set_location_assignment PIN_AC28 -to sw1\nset_location_assignment PIN_F19 -to ledr1"
      },
      {
        level: "Vận dụng",
        title: "Cấu hình chân chưa dùng thành As input tri-stated",
        prompt: "Viết lệnh .qsf để cấu hình tất cả các chân không sử dụng về trạng thái an toàn thả nổi trở kháng cao.",
        hint: "RESERVE_ALL_UNUSED_PINS_WEAK_PULLUP hoặc AS_INPUT_TRI_STATED.",
        solution: "set_global_assignment -name RESERVE_ALL_UNUSED_PINS_WEAK_PULLUP \"AS INPUT TRI-STATED\""
      },
      {
        level: "Thử thách",
        title: "Gán toàn bộ 18 công tắc SW và 18 đèn LEDR bằng vòng lặp TCL",
        prompt: "Thay vì gõ 36 dòng lệnh gán chân, viết một đoạn script TCL ngắn gọn lặp qua mảng danh sách chân.",
        hint: "Dùng `set pin_list {...}` và `for {set i 0} {$i < 18} {incr i} { ... }`.",
        solution: "Sử dụng vòng lặp TCL: foreach {sig pin} $pin_map { set_location_assignment $pin -to $sig }"
      }
    ],

    quiz: [
      {
        question: "File nào trong thư mục dự án Quartus chịu trách nhiệm lưu trữ toàn bộ các thiết lập gán chân và cấu hình phần cứng?",
        options: [
          "File đuôi .qsf (Quartus Settings File)",
          "File đuôi .vhd",
          "File đuôi .sof",
          "File đuôi .pin"
        ],
        answerIndex: 0,
        explanation: "File `.qsf` (Quartus Settings File) lưu trữ tất cả các gán chân (`set_location_assignment`) và thông số thiết lập của dự án."
      },
      {
        question: "Chuẩn điện áp I/O Standard mặc định được sử dụng cho các công tắc gạt SW và đèn LED trên kit Terasic DE2-115 là bao nhiêu?",
        options: [
          "2.5 V",
          "3.3-V LVTTL",
          "5.0 V TTL",
          "1.2 V"
        ],
        answerIndex: 0,
        explanation: "Theo sơ đồ nguyên lý của Terasic DE2-115: Khối I/O nối với SW, KEY, LEDR và LEDG sử dụng chuẩn điện áp 2.5 V (trong khi xung CLOCK_50, RS-232 dùng 3.3-V LVTTL)."
      },
      {
        question: "Để gán chân nhanh mà không phải gõ tay hàng trăm cổng trong Pin Planner, cách tối ưu nhất là gì?",
        options: [
          "Mở trực tiếp file .qsf bằng trình soạn thảo và dán các dòng lệnh gán chân từ file mẫu của nhà sản xuất",
          "Không cần gán chân, để Quartus tự chọn",
          "Hàn lại dây trên bo mạch",
          "Cài lại hệ điều hành Windows"
        ],
        answerIndex: 0,
        explanation: "Mở file `.qsf` và dán danh sách lệnh `set_location_assignment` là cách làm chuẩn mực, nhanh và chính xác 100% của kỹ sư vi mạch."
      },
      {
        question: "Trước khi mở công cụ Pin Planner để gán chân, bước thao tác nào là bắt buộc phải thực hiện trong Quartus?",
        options: [
          "Chạy Analysis & Elaboration (Ctrl+K) hoặc Analysis & Synthesis",
          "Nạp chip FPGA",
          "Mở ModelSim",
          "Đóng dự án"
        ],
        answerIndex: 0,
        explanation: "Cần chạy Analysis (Ctrl+K) để Quartus biên dịch sơ bộ entity và trích xuất danh sách các cổng vào/ra vào bộ nhớ."
      }
    ],

    summary: [
      "Pin Planner là cầu nối giữa cổng logic trong code VHDL với chân vật lý chip FPGA.",
      "Toàn bộ gán chân được lưu dưới dạng lệnh văn bản trong file `<project>.qsf`.",
      "Chú ý chuẩn điện áp: 2.5 V cho SW/KEY/LED, 3.3-V LVTTL cho CLOCK_50 và RS-232.",
      "Cấu hình các chân chưa dùng về trạng thái As input tri-stated để bảo vệ an toàn cho chip.",
      "Tận dụng file mẫu `DE2_115.qsf` của Terasic để tiết kiệm hàng giờ gán chân thủ công."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "KEY0"],
      activeOutputs: ["LEDR0", "LEDG0"],
      logicEvaluator: function(inputs) {
        return {
          LEDR0: inputs.SW0 ? 1 : 0,
          LEDG0: inputs.KEY0 === 0 ? 1 : 0
        };
      }
    }
  },

  // ========================================================================
  // BÀI 7.2
  // ========================================================================
  {
    id: "ch7-b2",
    chapterId: "ch7",
    order: 2,
    title: "Quy trình nạp chip: File .sof (SRAM tạm thời) vs File .jic (Flash EPCS64 vĩnh viễn)",
    subtitle: "Chuyển giao thiết kế lên phần cứng thực tế qua cáp USB-Blaster và bộ nhớ lưu trữ bền vững",
    badge: "Phần cứng",
    estimatedMinutes: 30,
    hardwareFocus: ["Quartus Programmer", "USB-Blaster Driver", ".sof via JTAG", ".jic via EPCS64"],

    objectives: [
      "Hiểu bản chất công nghệ bộ nhớ SRAM của chip FPGA: Mất dữ liệu khi mất điện.",
      "Làm chủ quy trình nạp file `.sof` (SRAM Object File) qua giao tiếp JTAG để debug nhanh.",
      "Nắm vững quy trình chuyển đổi file `.sof` sang `.jic` (JTAG Indirect Configuration File) để ghi vào chip Flash EPCS64.",
      "Thiết lập công tắc RUN/PROG trên kit DE2-115 để mạch tự động khởi động sau khi bật nguồn."
    ],

    theory: {
      why: "Bạn vừa hoàn thành một dự án đồng hồ số rất đẹp trên kit DE2-115, nhưng ngay khi rút dây nguồn ra cắm lại thì bo mạch... trống trơn không còn gì! Đó là vì chip Cyclone IV sử dụng công nghệ bộ nhớ SRAM để lưu cấu hình các cổng logic. Bộ nhớ SRAM có ưu điểm tốc độ cao nhưng lại là bộ nhớ khả biến (Volatile) - mất điện là mất sạch dữ liệu. Để mạch chạy độc lập vĩnh viễn như một sản phẩm thương mại, bạn cần học cách ghi cấu hình vào chip nhớ Flash EPCS64 trên bo mạch.",
      how: "1. **Nạp tạm thời file `.sof` qua cổng JTAG (Dùng trong giai đoạn phát triển):**\n- Kết nối cáp USB-Blaster từ kit vào máy tính, bật công tắc nguồn màu đỏ trên DE2-115.\n- Mở `Tools -> Programmer` trong Quartus.\n- Bấm `Hardware Setup...` -> Chọn `USB-Blaster [USB-0]` -> Bấm Close.\n- Bấm `Add File...` -> Chọn file `<project>.sof` nằm trong thư mục `output_files`.\n- Tích vào ô `Program/Configure` -> Bấm `Start`.\n- Thanh tiến độ chạy đến `100% (Successful)`: Mạch hoạt động ngay lập tức! (Nhưng tắt điện sẽ mất).\n\n2. **Nạp vĩnh viễn file `.jic` vào chip Flash EPCS64:**\n- Mở `File -> Convert Programming Files...` trong Quartus.\n- Mục `Programming file type`: Chọn `JTAG Indirect Configuration File (.jic)`.\n- Mục `Configuration device`: Chọn `EPCS64` (Chip flash 64 Mbit có sẵn trên DE2-115).\n- Mục `File name`: Đặt tên file xuất (ví dụ: `output_files/my_project.jic`).\n- Tại khung bên dưới, nhấp chọn dòng `Flash Loader` -> Bấm `Add Device...` -> Chọn `Cyclone IV E -> EP4CE115`.\n- Nhấp chọn dòng `SOF Data` -> Bấm `Add File...` -> Chọn file `.sof` của bạn.\n- Bấm `Generate`: Quartus sẽ sinh ra file `.jic`.\n- Mở Programmer, nạp file `.jic` vừa tạo vào kit. Giờ đây, mỗi lần cắm điện, chip EPCS64 sẽ tự động nạp cấu hình vào Cyclone IV chỉ trong 0.1 giây!",
      sections: [
        {
          heading: "1. Vị trí công tắc chuyển chế độ SW19 trên kit DE2-115",
          content: "Gần cổng nạp USB có một công tắc gạt nhỏ ghi nhãn `RUN / PROG`:\n- Khi nạp file `.sof` hoặc `.jic` qua giao tiếp JTAG thông thường: Gạt công tắc ở vị trí `RUN`.\n- Chỉ khi nạp qua cổng Active Serial chuyên dụng mới cần gạt sang `PROG`.",
          callout: {
            type: "tip",
            title: "Cài đặt Driver USB-Blaster trên Windows",
            text: "Nếu Quartus Programmer báo 'No Hardware': Vào Windows Device Manager, tìm mục Altera USB-Blaster, nhấp chuột phải chọn Update Driver -> Browse my computer -> Trỏ tới thư mục `C:\\intelFPGA_lite\\20.1\\quartus\\drivers\\usb-blaster`."
          }
        }
      ],
      truthTable: {
        headers: ["Tiêu chí so sánh", "File .sof (SRAM Object File)", "File .jic (JTAG Indirect Config)"],
        rows: [
          ["Nơi lưu trữ trong kit", "Nạp trực tiếp vào bộ nhớ SRAM của chip Cyclone IV", "Ghi vào chip nhớ Flash nối tiếp EPCS64"],
          ["Thời gian nạp", "Cực nhanh (khoảng 1 - 2 giây)", "Chậm hơn (khoảng 15 - 30 giây để xóa & ghi Flash)"],
          ["Khi ngắt nguồn điện", "MẤT DỮ LIỆU hoàn toàn", "LƯU TRỮ VĨNH VIỄN (Non-volatile)"],
          ["Ứng dụng", "Thử nghiệm, sửa code, debug hằng ngày", "Nạp hoàn thiện sản phẩm thương mại bàn giao"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ nạp .sof vs .jic -->
      <g transform="translate(30, 20)">
        <rect x="20" y="30" width="130" height="120" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="85" y="60" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">MÁY TÍNH PC</text>
        <text x="85" y="85" text-anchor="middle" fill="#f8fafc" font-size="9">Quartus Programmer</text>
        <text x="85" y="110" text-anchor="middle" fill="#94a3b8" font-size="9">Cáp USB-Blaster</text>

        <!-- Nhánh 1: Nạp .sof trực tiếp vào SRAM -->
        <path d="M 150,60 L 320,60" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow)"/>
        <text x="235" y="50" text-anchor="middle" fill="#38bdf8" font-size="9" font-weight="bold">1. File .sof (Tạm thời)</text>

        <!-- Chip FPGA -->
        <rect x="320" y="20" width="150" height="90" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
        <text x="395" y="55" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">Cyclone IV FPGA</text>
        <text x="395" y="75" text-anchor="middle" fill="#f8fafc" font-size="9">Bộ nhớ SRAM nội</text>

        <!-- Nhánh 2: Nạp .jic vào Flash EPCS64 -->
        <path d="M 150,110 L 235,110 L 235,160 L 320,160" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow)"/>
        <text x="235" y="135" text-anchor="middle" fill="#10b981" font-size="9" font-weight="bold">2. File .jic (Vĩnh viễn)</text>

        <!-- Chip Flash EPCS64 -->
        <rect x="320" y="130" width="150" height="65" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
        <text x="395" y="155" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">Flash EPCS64</text>
        <text x="395" y="175" text-anchor="middle" fill="#a7f3d0" font-size="9">Lưu bền vững (Non-volatile)</text>

        <!-- Mũi tên tự động nạp khi bật nguồn -->
        <path d="M 470,160 L 510,160 L 510,65 L 470,65" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)"/>
        <text x="545" y="115" text-anchor="middle" fill="#f59e0b" font-size="8">Tự động nạp</text>
        <text x="545" y="130" text-anchor="middle" fill="#f59e0b" font-size="8">khi bật điện</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "power_on_banner",
      circuitType: "combinational",
      typeExplanation: "Mạch hiển thị chữ 'HELLO' lên màn hình LED 7 đoạn HEX4..HEX0 ngay khi vừa bật nguồn: Dùng để kiểm chứng tính năng lưu trữ vĩnh viễn của file .jic.",
      code: `--------------------------------------------------------------------------------
-- Tên file: power_on_banner.vhd
-- Mạch hiện chữ 'HELLO' kiểm chứng nạp Flash vĩnh viễn trên kit DE2-115
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity power_on_banner is
    port (
        -- 5 bộ đèn LED 7 đoạn HEX4..HEX0 (Active-Low)
        hex4 : out std_logic_vector(6 downto 0); -- Chữ 'H'
        hex3 : out std_logic_vector(6 downto 0); -- Chữ 'E'
        hex2 : out std_logic_vector(6 downto 0); -- Chữ 'L'
        hex1 : out std_logic_vector(6 downto 0); -- Chữ 'L'
        hex0 : out std_logic_vector(6 downto 0)  -- Chữ 'O'
    );
end entity power_on_banner;

architecture rtl of power_on_banner is
begin
    -- Mã 7 đoạn hiển thị các ký tự (0 là sáng, 1 là tắt):
    hex4 <= "0001001"; -- Chữ 'H' (các thanh b, c, e, f, g sáng)
    hex3 <= "0000110"; -- Chữ 'E' (các thanh a, d, e, f, g sáng)
    hex2 <= "1000111"; -- Chữ 'L' (các thanh d, e, f sáng)
    hex1 <= "1000111"; -- Chữ 'L' (các thanh d, e, f sáng)
    hex0 <= "1000000"; -- Chữ 'O' (các thanh a, b, c, d, e, f sáng)
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_power_on_banner",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra mã giải mã các ký tự H-E-L-L-O
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_power_on_banner is
end entity tb_power_on_banner;

architecture sim of tb_power_on_banner is
    signal h4, h3, h2, h1, h0 : std_logic_vector(6 downto 0);
begin
    uut: entity work.power_on_banner
        port map ( hex4 => h4, hex3 => h3, hex2 => h2, hex1 => h1, hex0 => h0 );

    stim: process
    begin
        wait for 20 ns;
        assert h4 = "0001001" report "Loi ma chu H" severity error;
        assert h3 = "0000110" report "Loi ma chu E" severity error;
        assert h0 = "1000000" report "Loi ma chu O" severity error;
        report "Kiem tra ma HEX hien thi hoan tat!" severity note;
        wait;
    end process;
end architecture sim;`,
      instructions: "Thực hành nạp .jic: Sau khi nạp xong, tắt công tắc nguồn màu đỏ trên kit, rút dây cắm sang nguồn điện khác và bật lại. Dòng chữ 'HELLO' vẫn sẽ sáng rực rỡ ngay lập tức!"
    },

    quartusGuide: {
      steps: [
        "1. Biên dịch dự án hoàn chỉnh để sinh file output_files/power_on_banner.sof.",
        "2. Vào File -> Convert Programming Files... -> Chọn .jic, Configuration device = EPCS64.",
        "3. Thêm Flash Loader (Cyclone IV E -> EP4CE115) và SOF Data (chọn file .sof).",
        "4. Bấm Generate để tạo file power_on_banner.jic.",
        "5. Mở Tools -> Programmer -> Add File... chọn file .jic vừa tạo -> Tích Program/Configure -> Bấm Start."
      ],
      pinAssignments: [
        { signal: "hex4[0]", pin: "PIN_AB19", ioStandard: "2.5 V", note: "HEX4 segment a" },
        { signal: "hex3[0]", pin: "PIN_V21", ioStandard: "2.5 V", note: "HEX3 segment a" },
        { signal: "hex2[0]", pin: "PIN_AA25", ioStandard: "2.5 V", note: "HEX2 segment a" },
        { signal: "hex1[0]", pin: "PIN_M24", ioStandard: "2.5 V", note: "HEX1 segment a" },
        { signal: "hex0[0]", pin: "PIN_G18", ioStandard: "2.5 V", note: "HEX0 segment a" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB19 -to "hex4[0]"\nset_location_assignment PIN_V21 -to "hex3[0]"\nset_location_assignment PIN_AA25 -to "hex2[0]"\nset_location_assignment PIN_M24 -to "hex1[0]"\nset_location_assignment PIN_G18 -to "hex0[0]"`
    },

    commonErrors: [
      {
        error: "Quên thêm Flash Loader khi chuyển đổi file .jic trong Convert Programming Files",
        cause: "Chip Cyclone IV cần một lõi nạp trung gian (Serial Flash Loader) để nhận dữ liệu từ JTAG và ghi vào chip EPCS64. Nếu thiếu, Programmer sẽ báo lỗi không thể nạp Flash.",
        fix: "Nhấp vào dòng Flash Loader -> Bấm Add Device... -> Chọn đúng dòng `Cyclone IV E -> EP4CE115`."
      },
      {
        error: "Chọn sai mã chip Flash trong mục Configuration device",
        cause: "Kit DE2-115 sử dụng chip nhớ EPCS64 (64 Mbit). Nếu chọn nhầm EPCS16 hoặc EPCQ128 thì quá trình ghi Flash sẽ thất bại.",
        fix: "Luôn chọn đúng `EPCS64` cho bo mạch Terasic DE2-115."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Xóa dữ liệu bộ nhớ Flash EPCS64",
        prompt: "Làm thế nào để xóa trắng chip nhớ Flash trên kit DE2-115 trở về trạng thái xuất xưởng?",
        hint: "Trong Quartus Programmer, tích vào tùy chọn `Erase` của dòng EPCS64 và bấm Start.",
        solution: "Trong Programmer, tích chọn ô Erase ở dòng thiết bị EPCS64 rồi bấm Start để xóa sạch nội dung chip nhớ."
      },
      {
        level: "Vận dụng",
        title: "Nén dung lượng file cấu hình (Compression)",
        prompt: "Làm thế nào để bật tính năng nén dữ liệu cấu hình để giảm một nửa dung lượng file nạp vào Flash?",
        hint: "Mục Convert Programming Files -> Nhấp chọn SOF Data -> Bấm Properties -> Tích chọn `Generate compressed bitstreams`.",
        solution: "Bật tùy chọn Generate compressed bitstreams trong mục SOF Data Properties để kích hoạt thuật toán nén phần cứng."
      },
      {
        level: "Thử thách",
        title: "Tự động chuyển đổi file .sof sang .jic bằng dòng lệnh",
        prompt: "Viết lệnh Quartus Command-Line tool `quartus_cpf` để tự động chuyển đổi file mà không cần mở giao diện đồ họa.",
        hint: "Lệnh `quartus_cpf -c -d epcs64 -s ep4ce115 input.sof output.jic`.",
        solution: "Sử dụng công cụ dòng lệnh: quartus_cpf -c -d epcs64 -s EP4CE115 file.sof file.jic"
      }
    ],

    quiz: [
      {
        question: "Bản chất công nghệ bộ nhớ của chip FPGA Cyclone IV là gì khiến cho mạch bị mất dữ liệu khi ngắt nguồn điện?",
        options: [
          "Công nghệ bộ nhớ tĩnh SRAM (Static RAM - khả biến, mất điện là mất dữ liệu)",
          "Công nghệ đĩa từ HDD",
          "Công nghệ bộ nhớ ROM ghi 1 lần",
          "Công nghệ EPROM quang học"
        ],
        answerIndex: 0,
        explanation: "Cyclone IV sử dụng tế bào nhớ SRAM để cấu hình ma trận cổng logic. SRAM đòi hỏi nguồn nuôi liên tục, khi mất điện cấu hình sẽ biến mất."
      },
      {
        question: "Chip nhớ Flash nối tiếp được tích hợp trên bo mạch Terasic DE2-115 để lưu trữ cấu hình vĩnh viễn có tên mã là gì?",
        options: [
          "EPCS64 (Dung lượng 64 Mbit)",
          "EPCS4 (4 Mbit)",
          "MicroSD 32GB",
          "DDR2 SDRAM"
        ],
        answerIndex: 0,
        explanation: "Theo tài liệu Terasic DE2-115: Bo mạch được trang bị chip nhớ Flash Altera EPCS64 (64 Megabit) để lưu file cấu hình `.jic` vĩnh viễn."
      },
      {
        question: "File nào sau đây được nạp trực tiếp qua cổng JTAG vào bộ nhớ SRAM của FPGA để kiểm tra nhanh trong vài giây?",
        options: [
          "File đuôi .sof (SRAM Object File)",
          "File đuôi .jic",
          "File đuôi .hex",
          "File đuôi .qsf"
        ],
        answerIndex: 0,
        explanation: "File `.sof` (SRAM Object File) nạp trực tiếp vào SRAM qua giao tiếp JTAG với tốc độ chỉ 1-2 giây, dùng cho debug thường ngày."
      },
      {
        question: "Để gán cáp nạp USB-Blaster trong Quartus Programmer khi máy tính báo 'No Hardware', bạn cần kiểm tra điều gì đầu tiên?",
        options: [
          "Bật công tắc nguồn kit DE2-115 và cài đặt Driver trong thư mục quartus/drivers/usb-blaster",
          "Cài lại phần mềm Windows",
          "Thay cáp HDMI",
          "Mua máy tính mới"
        ],
        answerIndex: 0,
        explanation: "Cần đảm bảo kit đã bật nguồn (đèn xanh trên bo mạch sáng) và Windows Device Manager đã nhận diện đúng Driver USB-Blaster."
      }
    ],

    summary: [
      "Bộ nhớ SRAM của FPGA là khả biến: Mất điện sẽ mất toàn bộ cấu hình mạch.",
      "File `.sof` nạp tạm thời qua JTAG chỉ mất 1 giây, cực kỳ tiện lợi khi phát triển code.",
      "File `.jic` nạp vào chip Flash EPCS64 giúp thiết kế tồn tại vĩnh viễn sau khi tắt nguồn.",
      "Chuyển đổi `.sof` sang `.jic` qua menu File -> Convert Programming Files.",
      "Nhớ thêm khối trung gian Flash Loader cho dòng chip EP4CE115 khi tạo file `.jic`."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: [],
      activeOutputs: ["HEX0", "HEX1", "HEX2", "HEX3", "HEX4"],
      logicEvaluator: function(inputs) {
        return {
          HEX4: 0, // 'H'
          HEX3: 0, // 'E'
          HEX2: 0, // 'L'
          HEX1: 0, // 'L'
          HEX0: 0  // 'O'
        };
      }
    }
  },

  // ========================================================================
  // BÀI 7.3
  // ========================================================================
  {
    id: "ch7-b3",
    chapterId: "ch7",
    order: 3,
    title: "Đọc và Phân tích Báo cáo Tổng hợp (Compilation Report)",
    subtitle: "Thấu hiểu mức độ tiêu thụ tài nguyên phần cứng: Logic Elements, Registers và M9K Memory",
    badge: "Phân tích",
    estimatedMinutes: 25,
    hardwareFocus: ["Compilation Report", "Logic Elements (LEs)", "Registers", "Memory M9K", "Pins"],

    objectives: [
      "Làm chủ cửa sổ Compilation Report của Quartus Prime sau mỗi lần biên dịch thành công.",
      "Đọc hiểu bảng tóm tắt tài nguyên Flow Summary: Tổng số Logic Elements (LE), Registers, Memory bits và Pins.",
      "Biết cách phát hiện các cảnh báo nguy hiểm trong mục Warnings (ví dụ: tạo ra Latch, chân bị thả nổi, xung đột clock).",
      "Đánh giá xem thiết kế của bạn đã chiếm bao nhiêu phần trăm tài nguyên của chip Cyclone IV EP4CE115."
    ],

    theory: {
      why: "Sau khi bạn nhấn Ctrl+L và Quartus báo 100% thành công, công việc của kỹ sư chưa dừng lại ở đó. Một thiết kế có thể chạy được nhưng lại lãng phí gấp 5 lần tài nguyên silicon, hoặc vô tình tạo ra 20 cảnh báo tiềm ẩn lỗi chết chip lúc vận hành thực tế. Bản Báo cáo Tổng hợp (Compilation Report) chính là 'bảng kết quả xét nghiệm tổng quát' phản ánh độ tinh gọn, hiệu năng và tính an toàn của thiết kế phần cứng.",
      how: "1. **Bảng tóm tắt Flow Summary (Các chỉ số sống còn):**\n- `Total logic elements`: Tổng số tế bào logic (LE) đã sử dụng. Chip Cyclone IV EP4CE115 trên kit DE2-115 có tổng cộng **114,480 LEs**. Nếu thiết kế của bạn dùng 1,140 LEs thì mức sử dụng chỉ khoảng 1%.\n- `Total registers`: Tổng số Flip-Flop lưu trữ trạng thái tuần tự đã được tổng hợp.\n- `Total pins`: Tổng số chân I/O vật lý đã kết nối ra ngoài (Kit DE2-115 có tối đa 529 chân khả dụng).\n- `Total memory bits`: Dung lượng bộ nhớ RAM/ROM khối nhúng M9K đã dùng (Tối đa gần 4 Mbits).\n- `Embedded Multiplier 9-bit elements`: Số lượng bộ nhân phần cứng DSP chuyên dụng đã dùng (Tối đa 532 bộ).\n- `Total PLLs`: Số lượng bộ nhân tần số PLL đã kích hoạt (Tối đa 4 bộ PLL).\n\n2. **Phân loại các cảnh báo (Warnings) cần chú ý:**\n- `Warning (10236): Verilog/VHDL Latch inferred`: Cực kỳ nguy hiểm! Bạn vừa vô tình tạo ra một Latch do thiếu nhánh `else` hoặc thiếu trường hợp trong `case`.\n- `Warning (13024): Output pins are stuck at VCC or GND`: Một ngõ ra nào đó bị nối cứng lên 1 hoặc xuống 0, thường do logic bị rút gọn quá mức.\n- `Critical Warning`: Cảnh báo mức độ nghiêm trọng cần ưu tiên sửa ngay trước khi nạp mạch.",
      sections: [
        {
          heading: "1. Logic Element (LE) trong Cyclone IV bao gồm những gì?",
          content: "Mỗi tế bào LE cơ bản của dòng chip Cyclone IV bao gồm:\n- Một bảng tra cứu 4 ngõ vào **4-Input LUT (Look-Up Table)** để thực thi bất kỳ hàm Boolean tổ hợp nào.\n- Một thanh ghi nhớ lập trình được **Programmable Flip-Flop** (chọn dùng hoặc bỏ qua).\n- Mạch tạo cờ nhớ tốc độ cao **Carry Chain Logic** phục vụ các bộ cộng/trừ nhị phân.",
          callout: {
            type: "info",
            title: "Chip EP4CE115 cực kỳ đồ sộ",
            text: "Với 114,480 Logic Elements và gần 4 Megabits RAM nội, chip Cyclone IV EP4CE115 trên kit DE2-115 đủ mạnh để nhúng trọn vẹn cả một vi xử lý 32-bit NIOS II kèm hệ điều hành Linux thời gian thực!"
          }
        }
      ],
      truthTable: {
        headers: ["Thông số trong Flow Summary", "Tài nguyên khả dụng trên DE2-115", "Ý nghĩa đánh giá thiết kế"],
        rows: [
          ["Total logic elements", "114,480 LEs", "Độ phức tạp của mạch tổ hợp và các bảng tra cứu LUT"],
          ["Total registers", "114,480 Flip-Flops", "Số lượng ô nhớ trạng thái FSM và thanh ghi dữ liệu"],
          ["Total memory bits", "3,981,312 bits (M9K)", "Bộ nhớ đệm hình ảnh VGA, âm thanh, bảng ký tự"],
          ["Embedded 9-bit Multipliers", "532 bộ nhân DSP", "Khối xử lý tín hiệu số, lọc âm thanh, tính toán số thực"],
          ["Total PLLs", "4 bộ Phase-Locked Loops", "Bộ nhân/chia và dịch pha xung nhịp chất lượng cao"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Cấu trúc 1 tế bào Logic Element (LE) trong Cyclone IV -->
      <g transform="translate(30, 25)">
        <rect x="20" y="20" width="560" height="150" rx="8" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="300" y="45" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">CẤU TRÚC BÊN TRONG 1 LOGIC ELEMENT (CYCLONE IV LE)</text>

        <!-- 4-Input LUT -->
        <rect x="60" y="65" width="130" height="80" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
        <text x="125" y="95" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">4-Input LUT</text>
        <text x="125" y="115" text-anchor="middle" fill="#94a3b8" font-size="9">Bảng tra cứu tổ hợp</text>

        <!-- MUX bypass -->
        <polygon points="240,90 260,80 260,130 240,120" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>

        <!-- D-Flip-Flop -->
        <rect x="310" y="65" width="120" height="80" rx="6" fill="#0c2847" stroke="#10b981" stroke-width="2"/>
        <text x="370" y="95" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">Flip-Flop</text>
        <text x="370" y="115" text-anchor="middle" fill="#a7f3d0" font-size="9">Thanh ghi tuần tự</text>

        <!-- MUX chọn ngõ ra -->
        <polygon points="480,90 500,80 500,130 480,120" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
        <line x1="500" y1="105" x2="550" y2="105" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arrow)"/>
        <text x="535" y="95" fill="#38bdf8" font-size="9" font-weight="bold">LE Out</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "resource_benchmark",
      circuitType: "sequential",
      typeExplanation: "Mạch kiểm chuẩn tài nguyên: Bao gồm bộ đếm 16-bit và bộ cộng dồn để quan sát số lượng LE và Register được tạo ra trong Compilation Report.",
      code: `--------------------------------------------------------------------------------
-- Tên file: resource_benchmark.vhd
-- Mạch kiểm chứng tài nguyên tiêu thụ trong Compilation Report
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity resource_benchmark is
    port (
        clk       : in  std_logic;
        rst_n     : in  std_logic;
        data_in   : in  std_logic_vector(7 downto 0);
        accum_out : out std_logic_vector(15 downto 0)
    );
end entity resource_benchmark;

architecture rtl of resource_benchmark is
    signal reg_accum : unsigned(15 downto 0) := (others => '0');
begin
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            reg_accum <= (others => '0');
        elsif rising_edge(clk) then
            reg_accum <= reg_accum + unsigned(data_in);
        end if;
    end process;

    accum_out <= std_logic_vector(reg_accum);
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_resource_benchmark",
      code: `--------------------------------------------------------------------------------
-- Testbench mô phỏng kiểm tra hoạt động mạch đo tài nguyên
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_resource_benchmark is
end entity tb_resource_benchmark;

architecture sim of tb_resource_benchmark is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '0';
    signal din   : std_logic_vector(7 downto 0) := x"05";
    signal dout  : std_logic_vector(15 downto 0);
begin
    uut: entity work.resource_benchmark
        port map ( clk => clk, rst_n => rst_n, data_in => din, accum_out => dout );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 30 ns;
        rst_n <= '1'; wait for 100 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Sau khi biên dịch trong Quartus: Mở bảng Flow Summary và kiểm tra dòng `Total logic elements` (khoảng 16 LEs) và `Total registers` (đúng 16 Flip-Flops cho bộ tích lũy 16-bit)."
    },

    quartusGuide: {
      steps: [
        "1. Biên dịch dự án bằng nút Start Compilation (Ctrl+L).",
        "2. Sau khi hoàn thành, cửa sổ Compilation Report tự động mở ra ở giữa màn hình.",
        "3. Xem mục Flow Summary: Ghi lại số lượng Total logic elements, Total registers và Total pins.",
        "4. Mở cây thư mục bên trái: Fitter -> Resource Section -> Resource Usage Summary để xem phân bổ chi tiết theo từng khối module."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n`
    },

    commonErrors: [
      {
        error: "Số lượng Total logic elements đột ngột bằng 0 (0 LEs)",
        cause: "Bộ tối ưu hóa của Quartus phát hiện các ngõ ra của mạch không được nối ra chân ngoài hoặc ngõ vào bị treo cố định, nên nó tự động xóa sạch (Synthesize Away) toàn bộ mạch!",
        fix: "Đảm bảo các tín hiệu ngõ ra được kết nối ra chân LED hoặc xuất ra port của entity."
      },
      {
        error: "Số lượng Registers tăng đột biến gấp nhiều lần dự kiến",
        cause: "Khai báo mảng dữ liệu lớn bằng kiểu signal tuần tự thay vì suy diễn thành khối RAM M9K.",
        fix: "Với các mảng nhớ trên 100 byte, sử dụng cú pháp suy diễn bộ nhớ RAM khối (Inferring Block RAM M9K) để tiết kiệm Flip-Flop."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Dự đoán số Flip-Flop của bộ đếm 32-bit",
        prompt: "Một bộ đếm nhị phân 32-bit khi biên dịch trong Quartus sẽ tiêu tốn chính xác bao nhiêu Total registers trong bảng Flow Summary?",
        hint: "Mỗi bit nhớ cần đúng 1 Flip-Flop phần cứng.",
        solution: "Tiêu tốn đúng 32 Registers (Flip-Flops)."
      },
      {
        level: "Vận dụng",
        title: "Tìm hiểu cảnh báo Stuck at GND trong Warning Report",
        prompt: "Nếu bạn gán `led <= '0';` cố định trong code, Quartus sẽ phát cảnh báo gì trong bảng Compilation Report?",
        hint: "Warning: Output pin 'led' is stuck at GND.",
        solution: "Quartus sẽ báo cảnh báo: Output pin 'led' is stuck at GND, thông báo chân này bị nối cứng xuống đất không cần tốn tài nguyên logic."
      },
      {
        level: "Thử thách",
        title: "Tối ưu hóa diện tích (Area) vs Tốc độ (Speed)",
        prompt: "Làm thế nào để yêu cầu trình tổng hợp Quartus ưu tiên tiết kiệm tối đa số lượng LE thay vì ưu tiên đạt tần số Fmax cao nhất?",
        hint: "Assignments -> Settings -> Compiler Settings -> Optimization Mode -> Chọn Balanced hoặc Aggressive Area.",
        solution: "Vào Assignments -> Settings -> Compiler Settings -> Optimization Mode, chuyển từ 'Aggressive Performance' sang 'Aggressive Area'."
      }
    ],

    quiz: [
      {
        question: "Chip FPGA Cyclone IV EP4CE115 trên kit DE2-115 sở hữu tổng cộng bao nhiêu tế bào Logic Elements (LEs)?",
        options: [
          "114,480 LEs",
          "10,000 LEs",
          "50,000 LEs",
          "1,000 LEs"
        ],
        answerIndex: 0,
        explanation: "Tên mã chip `EP4CE115` biểu thị số lượng xấp xỉ 115k LEs (chính xác là 114,480 Logic Elements)."
      },
      {
        question: "Bên trong một tế bào Logic Element (LE) cơ bản của dòng chip Cyclone IV bao gồm những thành phần cốt lõi nào?",
        options: [
          "Một bảng tra cứu 4-Input LUT, một thanh ghi Flip-Flop và mạch tạo cờ nhớ Carry Chain",
          "Một CPU ARM",
          "Một bộ nhớ đĩa từ",
          "Một biến áp nguồn"
        ],
        answerIndex: 0,
        explanation: "Cấu trúc vi mô của một LE Cyclone IV chuẩn gồm: 4-Input LUT (Look-Up Table) cho logic tổ hợp, 1 Flip-Flop cho logic tuần tự và đường Carry Chain."
      },
      {
        question: "Nếu sau khi biên dịch xong, chỉ số Total logic elements trong Flow Summary báo bằng 0 (0 LEs), nguyên nhân phổ biến nhất là gì?",
        options: [
          "Mạch không có ngõ ra kết nối ra ngoài nên trình tổng hợp đã tự động xóa bỏ toàn bộ thiết kế (Synthesized away)",
          "Chip bị hỏng",
          "Code quá xuất sắc không tốn tài nguyên",
          "Máy tính hết bộ nhớ"
        ],
        answerIndex: 0,
        explanation: "Trình biên dịch Quartus cực kỳ thông minh: Nếu ngõ ra không điều khiển bất kỳ chân vật lý nào, toàn bộ mạch sẽ bị coi là 'Dead Logic' và bị loại bỏ hoàn toàn."
      },
      {
        question: "Cảnh báo nào trong Compilation Report cảnh báo nguy cơ nghiêm trọng nhất về sự xuất hiện của Latch ngoài ý muốn?",
        options: [
          "Latch inferred",
          "Clock low",
          "Pin float",
          "Memory full"
        ],
        answerIndex: 0,
        explanation: "Cảnh báo `Latch inferred` thông báo rằng mạch tổ hợp của bạn bị thiếu nhánh điều kiện khiến Quartus phải tạo ra Latch phần cứng ngoài ý muốn."
      }
    ],

    summary: [
      "Bảng Flow Summary cung cấp cái nhìn toàn cảnh về mức độ tiêu thụ tài nguyên của chip.",
      "Chip EP4CE115 có tới 114,480 LEs và gần 4 Mbits RAM M9K cực kỳ hùng hậu.",
      "Mỗi tế bào LE chứa một 4-LUT tổ hợp và một Flip-Flop tuần tự.",
      "Luôn kiểm tra kỹ mục Warnings để triệt tiêu các cảnh báo `Latch inferred`.",
      "Kết nối ngõ ra ra chân vật lý để tránh việc Quartus xóa nhầm mạch do tưởng là dead-code."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return { LEDR0: inputs.SW0 ? 1 : 0 };
      }
    }
  },

  // ========================================================================
  // BÀI 7.4
  // ========================================================================
  {
    id: "ch7-b4",
    chapterId: "ch7",
    order: 4,
    title: "Phân tích Định thời cơ bản với TimeQuest: Setup Time, Hold Time và Fmax",
    subtitle: "Ranh giới mong manh giữa mạch chạy đúng trên giấy và hoạt động ổn định trên silicon thực tế",
    badge: "Phân tích",
    estimatedMinutes: 35,
    hardwareFocus: ["TimeQuest Timing Analyzer", "Setup/Hold Time", "Slack", "Fmax (Max Frequency)"],

    objectives: [
      "Hiểu bản chất vật lý của hai ràng buộc định thời sống còn: Thời gian thiết lập (Setup Time - Tsu) và Thời gian duy trì (Hold Time - Th).",
      "Hiểu khái niệm Độ dôi thời gian (Timing Slack): Slack dương (an toàn) vs Slack âm (vi phạm định thời - Timing Failure).",
      "Xem bảng báo cáo tần số hoạt động cực đại Fmax của mạch trong công cụ TimeQuest Timing Analyzer.",
      "Viết file ràng buộc thời gian cơ bản `.sdc` (Synopsys Design Constraints) định nghĩa xung nhịp 50 MHz."
    ],

    theory: {
      why: "Trong điện tử số, tín hiệu điện không truyền đi tức thời mà di chuyển với vận tốc hữu hạn qua các dây dẫn silicon và cổng logic (khoảng vài phần trăm nano-giây trên mỗi micromet). Nếu một phép toán cộng 32-bit quá phức tạp, kết quả có thể đến muộn hơn thời điểm cạnh lên xung clock kế tiếp ập đến. Khi đó, Flip-Flop sẽ chụp phải dữ liệu chưa hoàn thiện và rơi vào trạng thái bấp bênh (Metastability), khiến hệ thống bị treo ngẫu nhiên. Công cụ TimeQuest của Quartus giúp tính toán chính xác tới từng pico-giây xem mạch của bạn có thể chạy an toàn ở tốc độ bao nhiêu MHz.",
      how: "1. **Hai ràng buộc định thời cơ bản của Flip-Flop:**\n- **Setup Time (Tsu):** Dữ liệu ngõ vào D phải ổn định TRƯỚC cạnh lên xung clock một khoảng thời gian tối thiểu Tsu.\n- **Hold Time (Th):** Dữ liệu ngõ vào D phải được giữ nguyên SAU cạnh lên xung clock một khoảng thời gian tối thiểu Th.\n\n2. **Khái niệm Timing Slack (Độ dôi thời gian):**\n- `Slack = Thời gian yêu cầu (Data Required Time) - Thời gian thực tế tín hiệu đến (Data Arrival Time)`.\n- **Positive Slack (+):** Tín hiệu đến sớm hơn yêu cầu -> Mạch đạt chuẩn an toàn thời gian (Timing Met)!\n- **Negative Slack (-):** Tín hiệu đến muộn hơn yêu cầu -> Vi phạm thời gian (Timing Violation) -> Mạch CHẮC CHẮN SẼ CHẠY SAI trên phần cứng thật!\n\n3. **Tần số cực đại Fmax (Maximum Frequency):**\n- Tần số cao nhất mà mạch có thể chạy an toàn mà không bị vi phạm Setup time.\n- Nếu Fmax của thiết kế là 120 MHz, mạch hoàn toàn chạy êm đềm ở tần số 50 MHz của kit DE2-115 (vì 50 MHz < 120 MHz).\n\n4. **File ràng buộc `.sdc` (Synopsys Design Constraints):**\n- Để TimeQuest phân tích được, bạn cần tạo file `<project>.sdc` chứa lệnh khai báo xung clock 50 MHz:\n```tcl\ncreate_clock -name CLOCK_50 -period 20.000 [get_ports {clk}]\nderive_pll_clocks\nderive_clock_uncertainty\n```",
      sections: [
        {
          heading: "1. Đường dẫn trễ nguy hiểm nhất (Critical Path)",
          content: "Trong một thiết kế, đường nối dây từ một Flip-Flop phát qua nhiều tầng cổng logic tổ hợp phức tạp nhất để đến một Flip-Flop thu được gọi là **Critical Path**. Tốc độ Fmax của toàn bộ chip bị khống chế bởi đường trễ dài nhất này. Để tăng Fmax, kỹ sư áp dụng kỹ thuật Pipelining (chèn thêm các tầng Flip-Flop ở giữa để chia nhỏ đường trễ tổ hợp).",
          callout: {
            type: "warning",
            title: "Màu đỏ cảnh báo trong TimeQuest",
            text: "Nếu sau khi biên dịch xong, cửa sổ Compilation Report xuất hiện dòng chữ đỏ rực trong mục TimeQuest Timing Analyzer, điều đó có nghĩa là Slack bị âm (-). Tuyệt đối không được nạp mạch lên FPGA trước khi tối ưu hóa hoặc giảm tần số clock!"
          }
        }
      ],
      truthTable: {
        headers: ["Khái niệm định thời", "Công thức / Đơn vị", "Ý nghĩa đánh giá"],
        rows: [
          ["Chu kỳ Clock (T)", "T = 20.000 ns (ở 50 MHz)", "Khoảng thời gian giữa 2 cạnh lên xung nhịp liên tiếp"],
          ["Setup Slack", "Slack = T_required - T_arrival", "Dương (+) là an toàn; Âm (-) là lỗi vi phạm"],
          ["Hold Slack", "Slack = T_arrival - T_required", "Đảm bảo dữ liệu không bị thay đổi quá sớm làm mất mẫu"],
          ["Tần số Fmax", "Fmax = 1 / (T_clk - Setup_Slack)", "Tần số tối đa mà thiết kế có thể vận hành ổn định"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ Setup Time và Hold Time -->
      <g transform="translate(30, 20)">
        <text x="280" y="20" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">RÀNG BUỘC THỜI GIAN SETUP TIME VÀ HOLD TIME CỦA FLIP-FLOP</text>

        <!-- Xung Clock -->
        <text x="20" y="65" fill="#f59e0b" font-family="monospace" font-size="10">CLOCK</text>
        <path d="M 100,80 L 250,80 L 250,45 L 400,45 L 400,80 L 550,80" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
        <line x1="250" y1="35" x2="250" y2="180" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3"/>
        <text x="250" y="195" text-anchor="middle" fill="#f59e0b" font-size="9" font-weight="bold">Cạnh lên Clock</text>

        <!-- Vùng cấm Setup & Hold -->
        <rect x="200" y="95" width="50" height="60" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" stroke-width="1"/>
        <text x="225" y="125" text-anchor="middle" fill="#ef4444" font-size="9" font-weight="bold">Tsu</text>
        <text x="225" y="140" text-anchor="middle" fill="#fca5a5" font-size="8">Setup</text>

        <rect x="250" y="95" width="40" height="60" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="1"/>
        <text x="270" y="125" text-anchor="middle" fill="#f59e0b" font-size="9" font-weight="bold">Th</text>
        <text x="270" y="140" text-anchor="middle" fill="#fde68a" font-size="8">Hold</text>

        <!-- Dữ liệu Data ngõ vào -->
        <text x="20" y="125" fill="#38bdf8" font-family="monospace" font-size="10">DATA IN</text>
        <path d="M 100,115 L 195,115 L 205,100 L 295,100 L 305,115 L 550,115" fill="none" stroke="#38bdf8" stroke-width="2"/>
        <text x="150" y="110" fill="#10b981" font-size="9">Dữ liệu ổn định</text>
        <text x="350" y="110" fill="#10b981" font-size="9">Dữ liệu ổn định</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "pipelined_multiplier",
      circuitType: "sequential",
      typeExplanation: "Mạch nhân và cộng tuần tự có chèn tầng thanh ghi Pipeline: Kỹ thuật kinh điển giúp rút ngắn Critical Path và tăng vọt tần số Fmax.",
      code: `--------------------------------------------------------------------------------
-- Tên file: pipelined_multiplier.vhd
-- Kỹ thuật Pipelining giúp đạt chuẩn Timing Closure và nâng cao Fmax
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity pipelined_multiplier is
    port (
        clk      : in  std_logic;
        rst_n    : in  std_logic;
        val_a    : in  std_logic_vector(7 downto 0);
        val_b    : in  std_logic_vector(7 downto 0);
        result   : out std_logic_vector(15 downto 0)
    );
end entity pipelined_multiplier;

architecture rtl of pipelined_multiplier is
    -- Tầng thanh ghi đệm ngõ vào (Input Stage)
    signal reg_a, reg_b : unsigned(7 downto 0) := (others => '0');

    -- Tầng thanh ghi đệm trung gian (Pipeline Stage 1)
    signal mult_stage1  : unsigned(15 downto 0) := (others => '0');

    -- Tầng thanh ghi chốt ngõ ra (Output Stage)
    signal reg_out      : unsigned(15 downto 0) := (others => '0');
begin
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            reg_a       <= (others => '0');
            reg_b       <= (others => '0');
            mult_stage1 <= (others => '0');
            reg_out     <= (others => '0');
        elsif rising_edge(clk) then
            -- Tầng 1: Chốt ngõ vào
            reg_a <= unsigned(val_a);
            reg_b <= unsigned(val_b);

            -- Tầng 2: Nhân dữ liệu và chốt kết quả trung gian
            mult_stage1 <= reg_a * reg_b;

            -- Tầng 3: Xuất kết quả
            reg_out <= mult_stage1;
        end if;
    end process;

    result <= std_logic_vector(reg_out);
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_pipelined_mult",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra mạch nhân Pipeline trễ 2 chu kỳ clock
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity tb_pipelined_mult is
end entity tb_pipelined_mult;

architecture sim of tb_pipelined_mult is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '0';
    signal a, b  : std_logic_vector(7 downto 0) := (others => '0');
    signal res   : std_logic_vector(15 downto 0);
begin
    uut: entity work.pipelined_multiplier
        port map ( clk => clk, rst_n => rst_n, val_a => a, val_b => b, result => res );

    clk <= not clk after 10 ns; -- 50 MHz

    stim: process
    begin
        rst_n <= '0'; wait for 30 ns;
        rst_n <= '1'; wait for 20 ns;

        -- Nạp phép nhân 12 * 10 = 120
        a <= std_logic_vector(to_unsigned(12, 8));
        b <= std_logic_vector(to_unsigned(10, 8));
        wait for 20 ns;

        -- Do có 2 tầng chốt pipeline, kết quả 120 (0x0078) sẽ xuất hiện sau 2 chu kỳ clock
        wait for 40 ns;
        assert res = std_logic_vector(to_unsigned(120, 16))
            report "Loi ket qua phep nhan pipeline!" severity error;

        report "Kiem tra Pipelining thanh cong!" severity note;
        wait;
    end process;
end architecture sim;`,
      instructions: "Sau khi biên dịch trong Quartus: Mở TimeQuest Timing Analyzer. Xem mục Fmax Summary: Mạch nhân có Pipeline sẽ đạt Fmax vượt trên 200 MHz!"
    },

    quartusGuide: {
      steps: [
        "1. Tạo file ràng buộc thời gian pipelined_multiplier.sdc cùng thư mục dự án.",
        "2. Điền dòng lệnh: create_clock -name clk -period 20.000 [get_ports {clk}]",
        "3. Biên dịch dự án hoàn chỉnh (Ctrl+L).",
        "4. Mở Compilation Report -> TimeQuest Timing Analyzer -> Multicorner Timing Analysis -> Fmax Summary để xem tần số tối đa."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" }
      ],
      qsfSnippet: `set_global_assignment -name SDC_FILE pipelined_multiplier.sdc`
    },

    commonErrors: [
      {
        error: "Quên tạo file ràng buộc .sdc khiến TimeQuest không thể tính toán Slack",
        cause: "Nếu không có file .sdc khai báo tần số xung nhịp `create_clock`, TimeQuest sẽ cảnh báo 'No clocks found' và không thể tính toán xem mạch có đạt chuẩn hay không.",
        fix: "Luôn tạo file `<tên_dự_án>.sdc` chứa câu lệnh `create_clock -name clk -period 20.000 [get_ports {clk}]`."
      },
      {
        error: "Chuỗi cổng logic tổ hợp quá dài dẫn đến Setup Slack bị âm (-)",
        cause: "Thực hiện phép tính toán chia lấy dư hoặc bộ cộng 64-bit trong duy nhất 1 chu kỳ clock mà không chèn tầng thanh ghi đệm.",
        fix: "Áp dụng kỹ thuật Pipelining: Chèn thêm thanh ghi trung gian giữa các tầng tính toán."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Viết lệnh SDC khai báo xung clock 100 MHz",
        prompt: "Viết câu lệnh SDC chuẩn để khai báo một cổng clock tên là `clk_100` chạy ở tần số 100 MHz (chu kỳ 10 ns).",
        hint: "create_clock -name clk_100 -period 10.000 [get_ports {clk_100}]",
        solution: "create_clock -name clk_100 -period 10.000 [get_ports {clk_100}]"
      },
      {
        level: "Vận dụng",
        title: "Khái niệm Pipelining trong CPU",
        prompt: "Tại sao các bộ vi xử lý hiện đại (như Intel Core i9 hay Apple M-series) đều chia quá trình thực thi lệnh thành hàng chục tầng Pipeline?",
        hint: "Chia nhỏ đường trễ tổ hợp để đẩy xung nhịp lên hàng GHz.",
        solution: "Pipelining rút ngắn đường Critical Path giữa các tầng Flip-Flop xuống mức tối thiểu, cho phép CPU đẩy xung nhịp lên mức kỷ lục 4-5 GHz."
      },
      {
        level: "Thử thách",
        title: "Phân tích Fast Corner vs Slow Corner trong TimeQuest",
        prompt: "Tại sao TimeQuest lại phân tích mạch ở cả hai điều kiện: Slow 85C Model (nhiệt độ cao, điện áp thấp) và Fast 0C Model (nhiệt độ lạnh, điện áp cao)?",
        hint: "Silicon chạy chậm nhất khi nóng và điện áp tụt; chạy nhanh nhất khi lạnh dễ vi phạm Hold time.",
        solution: "Slow Corner (85°C) dễ gây vi phạm Setup Time do transistor chạy chậm; Fast Corner (0°C) dễ gây vi phạm Hold Time do tín hiệu chạy quá nhanh."
      }
    ],

    quiz: [
      {
        question: "Ràng buộc thời gian 'Setup Time' (Thời gian thiết lập) của Flip-Flop yêu cầu điều gì?",
        options: [
          "Dữ liệu ngõ vào D phải ổn định trước cạnh lên xung clock một khoảng thời gian tối thiểu",
          "Dữ liệu phải đổi liên tục trong lúc clock nhảy",
          "Nhiệt độ chip phải dưới 50 độ",
          "Điện áp nguồn phải tăng gấp đôi"
        ],
        answerIndex: 0,
        explanation: "Setup Time (Tsu) là khoảng thời gian tối thiểu mà tín hiệu ngõ vào D phải giữ cố định trước khi cạnh lên xung clock xuất hiện để Flip-Flop chốt chính xác."
      },
      {
        question: "Trong báo cáo của TimeQuest Timing Analyzer, giá trị 'Slack' mang dấu âm (Negative Slack, màu đỏ) có ý nghĩa gì?",
        options: [
          "Mạch bị vi phạm ràng buộc định thời (Timing Violation) và chắc chắn sẽ chạy sai lệch trên phần cứng thật",
          "Mạch chạy nhanh vượt mức mong đợi",
          "Mạch tiết kiệm điện năng",
          "Biên dịch thành công tuyệt đối"
        ],
        answerIndex: 0,
        explanation: "Slack âm đồng nghĩa với việc tín hiệu đến muộn hơn thời điểm yêu cầu, Flip-Flop sẽ chụp phải dữ liệu rác gây sập mạch."
      },
      {
        question: "File có phần mở rộng nào được dùng để định nghĩa các ràng buộc thời gian (chu kỳ xung clock) cho công cụ TimeQuest?",
        options: [
          "File đuôi .sdc (Synopsys Design Constraints)",
          "File đuôi .qsf",
          "File đuôi .vhd",
          "File đuôi .sof"
        ],
        answerIndex: 0,
        explanation: "File `.sdc` (Synopsys Design Constraints) là chuẩn quốc tế dùng để khai báo tần số xung clock, độ trễ I/O cho bộ phân tích định thời."
      },
      {
        question: "Kỹ thuật thiết kế phần cứng kinh điển nào được dùng để chia nhỏ đường trễ tổ hợp (Critical Path) nhằm nâng cao tần số Fmax?",
        options: [
          "Kỹ thuật Pipelining (Chèn thêm các tầng thanh ghi đệm trung gian)",
          "Xóa bớt cổng logic",
          "Giảm điện áp nguồn",
          "Bỏ bớt dây mass"
        ],
        answerIndex: 0,
        explanation: "Pipelining chèn các thanh ghi lưu trữ tạm thời vào giữa chuỗi tính toán dài, giúp rút ngắn khoảng cách giữa các Flip-Flop và tăng vọt Fmax."
      }
    ],

    summary: [
      "TimeQuest là công cụ phân tích định thời pico-giây tối quan trọng của Quartus Prime.",
      "Thỏa mãn Setup Time và Hold Time là điều kiện bắt buộc để Flip-Flop không bị lỗi.",
      "Slack dương (+) là mạch đạt chuẩn; Slack âm (-) là vi phạm định thời nghiêm trọng.",
      "File `.sdc` định nghĩa tần số xung nhịp vật lý của dự án (ở DE2-115 là chu kỳ 20 ns).",
      "Kỹ thuật Pipelining là vũ khí tối thượng giúp phá vỡ nút thắt cổ chai và nâng cao Fmax."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return { LEDR0: inputs.SW0 ? 1 : 0 };
      }
    }
  },

  // ========================================================================
  // BÀI 7.5
  // ========================================================================
  {
    id: "ch7-b5",
    chapterId: "ch7",
    order: 5,
    title: "Thực hành Debug phần cứng với SignalTap II Logic Analyzer tích hợp",
    subtitle: "Nhúng máy phân tích logic trực tiếp vào ruột chip FPGA: 'Soi' tín hiệu thực tế thời gian thực",
    badge: "Debug đỉnh cao",
    estimatedMinutes: 35,
    hardwareFocus: ["SignalTap II Logic Analyzer", "Internal Signal Probing", "Hardware Triggering"],

    objectives: [
      "Hiểu bản chất của công nghệ SignalTap II: Máy phân tích logic ảo được nhúng trực tiếp vào silicon của FPGA.",
      "Cấu hình các tín hiệu cần quan sát, chọn nguồn Clock lấy mẫu và thiết lập bộ đệm mẫu (Sample Depth).",
      "Thiết lập điều kiện kích hoạt (Trigger Condition): Bắt đúng thời điểm lỗi hoặc sự kiện hiếm gặp xảy ra.",
      "Xem dạng sóng thực tế của chip chạy ở tốc độ 50 MHz truyền về máy tính PC qua cáp USB-Blaster."
    ],

    theory: {
      why: "Bạn đã mô phỏng ModelSim thấy mạch chạy hoàn hảo 100%, nhưng khi nạp file lên kit DE2-115 thì mạch lại chạy sai! Tại sao lại như vậy? Vì thế giới thực có nhiễu nguồn, có rung phím cơ học, có sai lệch thời gian khởi động. Làm thế nào để 'thò que đo' vào bên trong lõi chip Cyclone IV để xem giá trị của một biến trung gian nội bộ? Bạn không thể hàn dây vào chân silicon! Công nghệ SignalTap II Logic Analyzer của Intel FPGA chính là chiếc máy hiện sóng ảo được tổng hợp trực tiếp vào các ô nhớ M9K của chip để chụp lại toàn bộ dữ liệu nội bộ và gửi về màn hình máy tính.",
      how: "1. **Nguyên lý hoạt động của SignalTap II:**\n- Quartus sẽ tự động mượn một phần nhỏ tài nguyên LE và bộ nhớ RAM M9K trên chip để xây dựng một bộ Logic Analyzer.\n- Khi điều kiện Trigger thỏa mãn (ví dụ: cờ `error = '1'`), SignalTap sẽ ghi lại hàng nghìn mẫu tín hiệu xung quanh thời điểm đó vào RAM nội.\n- Sau đó, dữ liệu được truyền ngược lên PC qua cáp USB-Blaster và vẽ thành dạng sóng Waveform trực tiếp cho bạn xem!\n\n2. **Các bước tạo file cấu hình SignalTap (`.stp`):**\n- Mở `Tools -> SignalTap II Logic Analyzer` trong Quartus.\n- Trong khung `Signal Configuration`:\n  - Mục `Clock`: Duyệt chọn nguồn clock lấy mẫu (ví dụ: `clk` 50 MHz).\n  - Mục `Sample Depth`: Chọn độ sâu bộ nhớ (ví dụ: `1K samples` hoặc `4K samples`).\n- Trong khung `Data to Sample`: Nhấp đúp chuột để thêm các tín hiệu nội bộ cần 'soi'.\n- Trong cột `Trigger Conditions`: Thiết lập điều kiện bắt sóng (ví dụ: bắt khi tín hiệu chuyển từ 0 lên 1 - Rising Edge).\n- Bấm nút Compile hoặc bật tùy chọn nhúng vào dự án.\n- Nạp chip và bấm nút `Run Analysis`: Ngay khi bạn ấn nút trên kit, dạng sóng thực tế lập tức hiện ra trên màn hình!"
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ nhúng SignalTap II trong FPGA -->
      <g transform="translate(30, 20)">
        <rect x="20" y="20" width="580" height="170" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <text x="310" y="45" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">CHIP CYCLONE IV EP4CE115 (TRÊN KIT DE2-115)</text>

        <!-- Khối Mạch thiết kế của người dùng -->
        <rect x="50" y="65" width="200" height="100" rx="6" fill="#131e33" stroke="#f59e0b" stroke-width="2"/>
        <text x="150" y="95" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">Mạch người dùng (User Design)</text>
        <text x="150" y="115" text-anchor="middle" fill="#f8fafc" font-size="9">CPU, FSM, Bộ đếm, UART...</text>
        <circle cx="230" cy="135" r="4" fill="#38bdf8"/><text x="220" y="150" fill="#38bdf8" font-size="8">Tín hiệu nội bộ</text>

        <!-- Cầu đo SignalTap nhúng ngầm -->
        <path d="M 234,135 L 340,135" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)"/>
        <text x="285" y="125" text-anchor="middle" fill="#38bdf8" font-size="8">Que đo ảo</text>

        <!-- Khối SignalTap II IP Core -->
        <rect x="340" y="65" width="220" height="100" rx="6" fill="#0c2847" stroke="#10b981" stroke-width="2"/>
        <text x="450" y="95" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">SignalTap II Logic Analyzer</text>
        <text x="450" y="115" text-anchor="middle" fill="#a7f3d0" font-size="9">Ghi vào RAM M9K nội</text>
        <text x="450" y="135" text-anchor="middle" fill="#f59e0b" font-size="8">Truyền qua USB-Blaster lên PC</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "signaltap_demo_fsm",
      circuitType: "sequential",
      typeExplanation: "Máy trạng thái có biến trung gian nội bộ phục vụ thực hành bắt sóng trực tiếp bằng SignalTap II Logic Analyzer.",
      code: `--------------------------------------------------------------------------------
-- Tên file: signaltap_demo_fsm.vhd
-- Mạch đếm có cờ sự kiện bí mật để thực hành bắt trigger bằng SignalTap II
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity signaltap_demo_fsm is
    port (
        clk         : in  std_logic;
        rst_n       : in  std_logic;
        btn_trigger : in  std_logic; -- KEY1
        led_alert   : out std_logic  -- LEDR0
    );
end entity signaltap_demo_fsm;

architecture rtl of signaltap_demo_fsm is
    -- Các tín hiệu nội bộ cần theo dõi bằng SignalTap
    signal internal_counter : unsigned(7 downto 0) := (others => '0');
    signal secret_event     : std_logic := '0';
begin
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            internal_counter <= (others => '0');
            secret_event     <= '0';
        elsif rising_edge(clk) then
            if btn_trigger = '0' then
                internal_counter <= internal_counter + 1;
            end if;

            -- Sự kiện kích hoạt bí mật khi đếm đạt đúng 42
            if internal_counter = 42 then
                secret_event <= '1';
            else
                secret_event <= '0';
            end if;
        end if;
    end process;

    led_alert <= secret_event;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_signaltap_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra mạch đếm sự kiện SignalTap
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_signaltap_demo is
end entity tb_signaltap_demo;

architecture sim of tb_signaltap_demo is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '0';
    signal btn   : std_logic := '1';
    signal led   : std_logic;
begin
    uut: entity work.signaltap_demo_fsm
        port map ( clk => clk, rst_n => rst_n, btn_trigger => btn, led_alert => led );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 30 ns;
        rst_n <= '1'; wait for 20 ns;
        btn <= '0'; -- Giữ nút đếm
        wait for 1000 ns;
        btn <= '1';
        wait;
    end process;
end architecture sim;`,
      instructions: "Sau khi nhúng SignalTap: Đặt điều kiện Trigger tại `secret_event = 1`. Nhấn nút KEY1 trên kit, SignalTap sẽ chụp trọn vẹn khoảnh khắc bộ đếm chạm mốc 42!"
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án signaltap_demo_fsm.",
        "2. Mở Tools -> SignalTap II Logic Analyzer.",
        "3. Chọn Clock = clk, Sample depth = 1K.",
        "4. Nhấp đúp vào vùng Data: Thêm tín hiệu internal_counter và secret_event.",
        "5. Cột Trigger Conditions của secret_event: Chọn mức 1 (hoặc cạnh lên).",
        "6. Bấm nút Compile nhúng SignalTap vào file .sof, nạp lên kit và bấm Run Analysis."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "btn_trigger", pin: "PIN_M21", ioStandard: "2.5 V", note: "KEY1" },
        { signal: "led_alert", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_M21 -to btn_trigger\nset_location_assignment PIN_G19 -to led_alert`
    },

    commonErrors: [
      {
        error: "Chọn tần số Clock lấy mẫu trong SignalTap quá chậm hoặc không có dao động",
        cause: "Nếu nguồn clock cấp cho SignalTap bị treo hoặc không được kích hoạt, SignalTap sẽ báo trạng thái 'Waiting for Clock' và không thể lấy mẫu.",
        fix: "Luôn chọn nguồn xung clock chính 50 MHz (CLOCK_50) làm tín hiệu lấy mẫu cho SignalTap."
      },
      {
        error: "Chọn Sample Depth quá lớn làm tràn bộ nhớ RAM M9K của chip",
        cause: "Nếu chọn 128K mẫu cho hàng chục tín hiệu, dung lượng RAM yêu cầu có thể vượt quá 4 Mbits khả dụng của chip Cyclone IV.",
        fix: "Khi mới bắt đầu debug, chọn mức vừa phải như 1K hoặc 2K samples."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Bật chế độ Auto-run liên tục trong SignalTap",
        prompt: "Làm thế nào để SignalTap liên tục lấy mẫu và cập nhật dạng sóng lặp đi lặp lại như một chiếc máy hiện sóng Oscilloscope thực thụ?",
        hint: "Bấm nút `Autorun Analysis` (Biểu tượng hai mũi tên xoay tròn) thay vì nút Run Analysis đơn.",
        solution: "Nhấp vào nút Autorun Analysis trên thanh công cụ của SignalTap II để kích hoạt chế độ lấy mẫu liên tục."
      },
      {
        level: "Vận dụng",
        title: "Tạo điều kiện Trigger phức hợp nhiều tín hiệu",
        prompt: "Thiết lập điều kiện kích hoạt: Chỉ chụp sóng khi `btn_trigger = 0` VÀ `internal_counter > 100`.",
        hint: "Chuyển chế độ Trigger từ Basic sang Advanced Trigger Expression.",
        solution: "Trong cột Trigger Flow, chọn Advanced Trigger và viết biểu thức logic kết hợp toán tử AND giữa hai tín hiệu."
      },
      {
        level: "Thử thách",
        title: "Gỡ bỏ SignalTap để giải phóng tài nguyên sau khi debug xong",
        prompt: "Sau khi tìm xong lỗi phần cứng, làm sao để gỡ bỏ hoàn toàn bộ phân tích SignalTap khỏi dự án để trả lại 100% RAM và LE cho ứng dụng chính?",
        hint: "Assignments -> Settings -> SignalTap II Logic Analyzer -> Bỏ tích chọn `Enable SignalTap II Logic Analyzer`.",
        solution: "Vào Settings -> bỏ chọn Enable SignalTap II Logic Analyzer, sau đó chạy lại Full Compilation để loại bỏ hoàn toàn mã nhúng SignalTap."
      }
    ],

    quiz: [
      {
        question: "Công nghệ SignalTap II Logic Analyzer của Intel FPGA hoạt động dựa trên nguyên lý cốt lõi nào?",
        options: [
          "Nhúng một máy phân tích logic ảo bằng cách mượn một phần LE và khối RAM M9K nội của chip để ghi lại dữ liệu thực tế và gửi về PC qua cáp USB-Blaster",
          "Dùng camera chụp ảnh chip",
          "Cần mua thêm máy đo phần cứng bên ngoài giá hàng nghìn USD",
          "Chỉ chạy mô phỏng trên phần mềm"
        ],
        answerIndex: 0,
        explanation: "SignalTap II là công cụ độc quyền tuyệt vời: Tự động tổng hợp một bộ ghi dữ liệu nội bộ vào chip FPGA và truyền dữ liệu lên PC qua cáp JTAG/USB-Blaster."
      },
      {
        question: "Tài nguyên phần cứng nào trên chip Cyclone IV bị tiêu hao nhiều nhất khi tăng chỉ số 'Sample Depth' trong SignalTap?",
        options: [
          "Bộ nhớ RAM khối nhúng M9K (Embedded Memory Bits)",
          "Các chân cắm I/O ngoài",
          "Bộ nguồn 5V",
          "Các cổng logic AND/OR"
        ],
        answerIndex: 0,
        explanation: "Các mẫu tín hiệu được lưu trực tiếp vào các khối RAM M9K nội bộ của FPGA trước khi truyền về máy tính, do đó Sample Depth càng lớn thì tiêu tốn càng nhiều RAM M9K."
      },
      {
        question: "Khái niệm 'Trigger Condition' trong SignalTap II có ý nghĩa gì?",
        options: [
          "Điều kiện logic hoặc sườn xung kích hoạt bộ phân tích bắt đầu ghi dữ liệu vào bộ đệm",
          "Nút tắt nguồn",
          "Lệnh xóa code",
          "Độ phân giải màn hình"
        ],
        answerIndex: 0,
        explanation: "Trigger là điều kiện 'bẫy': Khi tín hiệu đạt đúng trạng thái quy định (ví dụ cạnh lên, hoặc bằng một giá trị đặc biệt), máy sẽ kích hoạt chụp sóng."
      },
      {
        question: "Sau khi đã tìm và sửa xong lỗi phần cứng, bước làm đúng đắn của kỹ sư là gì?",
        options: [
          "Tắt tính năng SignalTap II trong Settings và biên dịch lại để giải phóng tài nguyên RAM M9K và LE cho ứng dụng chính",
          "Để nguyên SignalTap trong chip thương mại",
          "Xóa chip FPGA",
          "Cài lại Quartus"
        ],
        answerIndex: 0,
        explanation: "SignalTap II chiếm dụng tài nguyên silicon và RAM nội bộ, do đó sau khi debug xong cần tắt nó đi để giải phóng tài nguyên cho sản phẩm thương mại."
      }
    ],

    summary: [
      "SignalTap II là công cụ debug phần cứng tối thượng của kỹ sư FPGA Intel.",
      "Nhúng trực tiếp máy phân tích logic vào chip Cyclone IV qua cáp nạp USB-Blaster.",
      "Cho phép 'soi' trực tiếp các tín hiệu trung gian chạy ở tốc độ thực 50 MHz.",
      "Thiết lập Trigger linh hoạt giúp bắt đúng khoảnh khắc lỗi hiếm gặp xuất hiện.",
      "Luôn nhớ tắt SignalTap II sau khi hoàn thành debug để tiết kiệm tài nguyên bộ nhớ M9K."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["KEY0", "KEY1"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return { LEDR0: inputs.KEY1 === 0 ? 1 : 0 };
      }
    }
  }
];

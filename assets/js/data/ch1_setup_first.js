// ==========================================================================
// CH1_SETUP_FIRST.JS - CHƯƠNG 1: CÀI ĐẶT VÀ CHẠY CHƯƠNG TRÌNH ĐẦU TIÊN (3 BÀI)
// ==========================================================================

window.VHDL_LESSONS_DB = window.VHDL_LESSONS_DB || {};

window.VHDL_LESSONS_DB["ch1"] = [
  // ========================================================================
  // BÀI 1.1
  // ========================================================================
  {
    id: "ch1-b1",
    chapterId: "ch1",
    order: 1,
    title: "Cài đặt Quartus Prime Lite 20.1, ModelSim và Driver USB-Blaster",
    subtitle: "Thiết lập môi trường làm việc chuẩn xác trên Windows 10/11 không bị lỗi thiếu gói thiết bị",
    badge: "Môi trường phát triển",
    estimatedMinutes: 30,
    hardwareFocus: ["Cáp USB-Blaster", "Trình điều khiển Device Manager"],

    objectives: [
      "Tải và cài đặt chuẩn xác bộ đôi Quartus Prime Lite Edition 20.1 và ModelSim-Intel FPGA Edition 20.1.",
      "Tích hợp gói hỗ trợ chip Cyclone IV (cyclonev-20.1...qdz / cyclone-20.1...qdz).",
      "Cài đặt thành công driver USB-Blaster trong Windows Device Manager (xử lý lỗi dấu chấm than vàng).",
      "Kiểm tra kết nối phần cứng giữa máy tính và kit Terasic DE2-115."
    ],

    theory: {
      why: "Quartus Prime Lite là phiên bản miễn phí của Intel (không cần mua bản quyền license đắt đỏ) nhưng hỗ trợ trọn vẹn 100% dòng chip Cyclone IV trên kit DE2-115. Cáp nạp USB-Blaster là cầu nối vật lý để máy tính nạp bản vẽ vi mạch vào chip qua giao thức JTAG. Nếu cài sai driver hoặc thiếu gói chip, bạn sẽ không thể mở project hoặc máy tính không nhận ra kit.",
      how: "Quy trình cài đặt gồm 3 thành phần chính nằm trong cùng bộ cài 20.1:\n1. Phần mềm lõi: `QuartusLiteSetup-20.1.0.711-windows.exe`.\n2. Trình mô phỏng: `ModelSimSetup-20.1.0.711-windows.exe`.\n3. Gói thiết bị phần cứng: `cyclone-20.1.0.711.qdz` (phải để chung một thư mục khi chạy file cài đặt thì trình cài đặt mới tự nhận diện).\nSau khi cài xong, thư mục driver của USB-Blaster sẽ nằm sẵn tại: `C:\\intelFPGA_lite\\20.1\\quartus\\drivers\\usb-blaster`.",
      sections: [
        {
          heading: "1. Hướng dẫn cài driver USB-Blaster trên Windows 10/11",
          content: "Khi cắm cáp USB từ cổng USB-Blaster của DE2-115 vào máy tính, Windows sẽ hiện 'USB-Blaster' kèm dấu chấm than vàng trong Device Manager.\n\nCác bước cài driver:\n1. Nhấp chuột phải vào nút Start -> chọn **Device Manager**.\n2. Tìm mục **Other devices** -> thấy **USB-Blaster**.\n3. Chuột phải vào USB-Blaster -> chọn **Update driver**.\n4. Chọn **Browse my computer for drivers**.\n5. Trỏ đường dẫn đến: `C:\\intelFPGA_lite\\20.1\\quartus\\drivers\\usb-blaster`.\n6. Bấm **Next** và chấp nhận cài đặt. Khi thành công, thiết bị sẽ xuất hiện trong nhóm **Universal Serial Bus controllers** hoặc **JTAG cables**.",
          callout: {
            type: "warning",
            title: "Lỗi phổ biến trên Windows 11",
            text: "Nếu Windows báo lỗi chặn chữ ký driver số (Digital Signature), hãy khởi động lại Windows vào chế độ 'Disable driver signature enforcement' hoặc dùng driver có sẵn trong thư mục usb-blaster của Intel."
          }
        },
        {
          heading: "2. Cấu hình cổng kết nối trên kit DE2-115",
          content: "Trên kit DE2-115 có 2 cổng USB Type-B:\n- Cổng có nhãn **USB BLASTER** (ở góc trên bên trái, gần jack nguồn 12V): Dùng để nạp code và debug JTAG.\n- Cổng có nhãn **USB DEVICE** (gần cổng mạng Ethernet): Dùng cho ứng dụng truyền nhận dữ liệu USB sau này.\n\nBạn BẮT BUỘC phải cắm cáp vào đúng cổng **USB BLASTER**!",
          callout: {
            type: "danger",
            title: "Nguồn điện cho kit",
            text: "Kit DE2-115 sử dụng adapter nguồn rời 12V DC (2A). Bạn phải cắm nguồn 12V và ấn nút công tắc nguồn màu đỏ (POWER) thì chip mới sáng đèn LED báo nguồn (LED màu xanh dương POWER LED)."
          }
        }
      ],
      truthTable: {
        headers: ["Thành phần cài đặt", "Dung lượng ước tính", "Đường dẫn mặc định", "Vai trò"],
        rows: [
          ["Quartus Prime Lite 20.1", "~ 3.5 GB", "C:\\intelFPGA_lite\\20.1\\quartus", "IDE chính, trình biên dịch tổng hợp"],
          ["ModelSim-Intel FPGA Edition", "~ 2.0 GB", "C:\\intelFPGA_lite\\20.1\\modelsim_ase", "Trình mô phỏng dạng sóng"],
          ["Gói Cyclone IV Device", "~ 1.5 GB", "Tích hợp sẵn vào thư mục Quartus", "Chứa thư viện tế bào logic của EP4CE115"],
          ["Driver USB-Blaster", "~ 10 MB", "C:\\intelFPGA_lite\\20.1\\quartus\\drivers\\usb-blaster", "Trình điều khiển giao tiếp JTAG qua USB"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 200" class="circuit-svg">
      <!-- Sơ đồ kết nối Máy tính -> USB Blaster -> DE2-115 -->
      <rect x="40" y="50" width="140" height="90" rx="8" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
      <text x="110" y="85" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="bold">MÁY TÍNH (PC)</text>
      <text x="110" y="110" text-anchor="middle" fill="#94a3b8" font-size="11">Quartus 20.1</text>
      
      <!-- Cáp USB -->
      <line x1="180" y1="95" x2="310" y2="95" stroke="#f59e0b" stroke-width="4" stroke-dasharray="6"/>
      <text x="245" y="80" text-anchor="middle" fill="#f59e0b" font-size="11" font-family="monospace">Cáp USB Type-B</text>
      
      <!-- Cổng USB-Blaster trên kit -->
      <rect x="310" y="65" width="70" height="60" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
      <text x="345" y="95" text-anchor="middle" fill="#fff" font-size="9" font-family="monospace">USB-BLASTER</text>
      <text x="345" y="110" text-anchor="middle" fill="#94a3b8" font-size="8">Mạch nạp JTAG</text>

      <line x1="380" y1="95" x2="430" y2="95" stroke="#38bdf8" stroke-width="2"/>

      <!-- Bo mạch DE2-115 -->
      <rect x="430" y="35" width="170" height="120" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
      <text x="515" y="60" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">KIT TERASIC DE2-115</text>
      <rect x="465" y="75" width="100" height="60" rx="4" fill="#131c31" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="515" y="100" text-anchor="middle" fill="#38bdf8" font-size="11" font-family="monospace">FPGA Cyclone IV</text>
      <text x="515" y="118" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="monospace">EP4CE115F29C7</text>
    </svg>`,

    vhdlCode: {
      entityName: "sanity_check",
      circuitType: "combinational",
      typeExplanation: "Mã nguồn thử nghiệm môi trường đơn giản nhất: Đèn LEDR0 luôn luôn sáng để kiểm tra nguồn và kết nối nạp chip thành công.",
      code: `--------------------------------------------------------------------------------
-- Tên file: sanity_check.vhd
-- Mục đích: Kiểm tra môi trường nạp chip và hoạt động của đèn LEDR0
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity sanity_check is
    port (
        led_test : out std_logic -- Nối ra đèn LED đỏ LEDR0 (PIN_G19)
    );
end entity sanity_check;

architecture rtl of sanity_check is
begin
    -- Mức '1' = 2.5V = Đèn LEDR0 trên kit DE2-115 sáng liên tục
    led_test <= '1';
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_sanity_check",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra tín hiệu led_test luôn ở mức '1'
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_sanity_check is
end entity tb_sanity_check;

architecture sim of tb_sanity_check is
    signal led : std_logic;
begin
    uut: entity work.sanity_check
        port map ( led_test => led );

    stim: process
    begin
        wait for 20 ns;
        assert led = '1' report "LỖI: Đèn LED không ở mức 1!" severity error;
        wait;
    end process;
end architecture sim;`,
      instructions: "Chạy mô phỏng trên ModelSim để xác nhận tín hiệu led nhận giá trị '1' không đổi."
    },

    quartusGuide: {
      steps: [
        "1. Khởi động Quartus Prime Lite 20.1.",
        "2. Kiểm tra phần cứng: Tools -> Programmer -> Click nút 'Hardware Setup...'.",
        "3. Trong mục Currently selected hardware: Chọn 'USB-Blaster [USB-0]'. Bấm Close.",
        "4. Nếu danh sách trống trơn: Kiểm tra lại driver trong Device Manager và dây cắm USB."
      ],
      pinAssignments: [
        { signal: "led_test", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0 (Đèn đỏ ngoài cùng bên phải)" }
      ],
      qsfSnippet: `set_location_assignment PIN_G19 -to led_test`
    },

    commonErrors: [
      {
        error: "Quartus Programmer hiện 'No Hardware' trong mục Hardware Setup",
        cause: "Chưa cài driver USB-Blaster hoặc cáp USB chưa cắm chặt vào máy tính.",
        fix: "Vào Device Manager, update driver trỏ về thư mục 'quartus/drivers/usb-blaster'."
      },
      {
        error: "Không tìm thấy chip Cyclone IV EP4CE115 khi tạo New Project",
        cause: "Khi cài đặt Quartus, bạn chưa tích chọn hoặc chưa tải gói thiết bị 'cyclone-20.1...qdz'.",
        fix: "Tải file cyclone-20.1...qdz, mở Tools -> Install Devices trong Quartus để nạp thêm gói chip."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Kiểm tra cổng USB-Blaster trong Device Manager",
        prompt: "Mở Device Manager trên máy tính của bạn và chụp lại vị trí của thiết bị USB-Blaster.",
        hint: "Thiết bị sẽ nằm trong mục 'JTAG cables' hoặc 'Universal Serial Bus controllers'.",
        solution: "Tên chính xác hiển thị trong Device Manager là: 'Altera USB-Blaster' hoặc 'Intel USB-Blaster'."
      },
      {
        level: "Vận dụng",
        title: "Xác định cổng JTAG trên kit",
        prompt: "Quan sát kit DE2-115 thật và tìm công tắc gạt RUN/PROG (nếu có) hoặc vị trí jack cắm nguồn 12V.",
        hint: "Jack nguồn 12V nằm ở cạnh trên bên trái, kế bên công tắc nút nhấn màu đỏ.",
        solution: "Nguồn 12V DC cấp vào jack tròn, nút màu đỏ là công tắc bật/tắt nguồn (Power Switch)."
      },
      {
        level: "Thử thách",
        title: "Khắc phục lỗi nạp JTAG Chain Failure",
        prompt: "Nếu Quartus Programmer báo lỗi 'Unable to scan JTAG chain', hãy liệt kê 3 nguyên nhân phần cứng có thể xảy ra.",
        hint: "Kiểm tra nguồn điện, cáp USB, và công tắc RUN/PROG.",
        solution: "1. Kit chưa được bật nguồn (chưa ấn nút nguồn màu đỏ). 2. Cáp USB bị lỏng hoặc cắm nhầm sang cổng USB DEVICE. 3. Công tắc chuyển mạch JTAG/AS bị gạt sai chế độ."
      }
    ],

    quiz: [
      {
        question: "Đường dẫn mặc định chứa trình điều khiển (driver) của cáp nạp USB-Blaster trong bản cài 20.1 là gì?",
        options: [
          "C:\\Program Files\\USB-Blaster",
          "C:\\intelFPGA_lite\\20.1\\quartus\\drivers\\usb-blaster",
          "C:\\Windows\\System32\\drivers",
          "C:\\Intel\\Drivers\\JTAG"
        ],
        answerIndex: 1,
        explanation: "Intel luôn đóng gói sẵn driver USB-Blaster trong thư mục cài đặt Quartus tại 'quartus/drivers/usb-blaster'."
      },
      {
        question: "Cổng USB nào trên kit Terasic DE2-115 được dùng để kết nối với máy tính nhằm mục đích nạp mã cấu hình FPGA?",
        options: [
          "USB DEVICE",
          "USB BLASTER",
          "USB HOST",
          "Cổng Ethernet"
        ],
        answerIndex: 1,
        explanation: "Cổng có nhãn 'USB BLASTER' tích hợp sẵn mạch nạp JTAG on-board của hãng Terasic."
      },
      {
        question: "Kit DE2-115 sử dụng nguồn cấp điện áp định mức là bao nhiêu?",
        options: [
          "5V DC qua cổng USB máy tính",
          "12V DC qua adapter nguồn ngoài",
          "24V AC",
          "Pin 9V"
        ],
        answerIndex: 1,
        explanation: "Kit DE2-115 có rất nhiều ngoại vi công suất lớn (màn hình LCD, cổng mạng, codec âm thanh) nên bắt buộc phải dùng adapter nguồn ngoài 12V DC (thường là 2A)."
      },
      {
        question: "Khi cài đặt Quartus Prime Lite 20.1, gói thiết bị nào là bắt buộc phải có để thiết kế cho kit DE2-115?",
        options: [
          "Arria 10 Device Support",
          "Cyclone IV Device Support",
          "Stratix V Device Support",
          "MAX 10 Device Support"
        ],
        answerIndex: 1,
        explanation: "Kit DE2-115 sử dụng chip FPGA Altera Cyclone IV E EP4CE115F29C7, vì vậy bắt buộc phải cài gói thiết bị Cyclone IV."
      }
    ],

    summary: [
      "Quartus Prime Lite 20.1 là phiên bản miễn phí hoàn hảo cho việc học tập kit DE2-115.",
      "Driver USB-Blaster nằm tại `C:\\intelFPGA_lite\\20.1\\quartus\\drivers\\usb-blaster`.",
      "Luôn cắm cáp vào cổng có nhãn `USB BLASTER` và bật nguồn 12V trước khi nạp chip.",
      "Kiểm tra Hardware Setup trong Quartus Programmer để đảm bảo máy tính đã nhận diện mạch nạp.",
      "Đèn LED báo nguồn màu xanh dương trên kit phải sáng ổn định."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: [],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function() {
        return { LEDR0: 1 }; // Luôn sáng LEDR0
      }
    }
  },

  // ========================================================================
  // BÀI 1.2
  // ========================================================================
  {
    id: "ch1-b2",
    chapterId: "ch1",
    order: 2,
    title: "Tạo Project Quartus 20.1 cho chip EP4CE115F29C7 và Cấu hình ModelSim",
    subtitle: "Thiết lập dự án chuẩn chỉ từng thông số và liên kết tự động NativeLink",
    badge: "Quartus Project & Toolchain",
    estimatedMinutes: 25,
    hardwareFocus: ["Thông số EP4CE115F29C7", "NativeLink ModelSim"],

    objectives: [
      "Sử dụng thành thạo trình New Project Wizard trong Quartus Prime Lite 20.1.",
      "Chọn chính xác mã linh kiện phần cứng của kit DE2-115: Cyclone IV E -> EP4CE115F29C7.",
      "Cấu hình đường dẫn liên kết ModelSim trong Tools -> Options -> EDA Tool Options.",
      "Thiết lập NativeLink để tự động mở và chạy mô phỏng chỉ với một nút bấm."
    ],

    theory: {
      why: "Nếu bạn chọn sai mã linh kiện (chẳng hạn chọn nhầm Cyclone IV GX hoặc mã vỏ chip khác), toàn bộ số hiệu chân I/O và số lượng khối LE sẽ bị sai lệch hoàn toàn, khiến file bitstream không thể nạp vào kit. Ngoài ra, việc cấu hình NativeLink sẽ giúp bạn tiết kiệm 90% thời gian khi kiểm thử vì không cần tự gõ lệnh thủ công trong ModelSim mỗi lần sửa code.",
      how: "Mã chip trên kit DE2-115 giải nghĩa như sau:\n- `EP4C`: Dòng chip Cyclone IV.\n- `E`: Phân họ Enhanced (tiêu chuẩn, tiết kiệm điện, không có bộ thu phát gigabit thu nhỏ).\n- `115`: Quy mô tài nguyên chứa khoảng **114,480 khối Logic Elements (LE)**.\n- `F29`: Vỏ chip đóng gói kiểu FBGA có **780 chân**.\n- `C7`: Cấp tốc độ thương mại (Commercial speed grade 7).\nĐường dẫn liên kết ModelSim trong Quartus phải trỏ chính xác về thư mục: `C:\\intelFPGA_lite\\20.1\\modelsim_ase\\win32aloem`.",
      sections: [
        {
          heading: "1. 5 bước tạo New Project đúng chuẩn",
          content: "1. Mở Quartus -> **File -> New Project Wizard** -> Bấm Next.\n2. Chọn thư mục lưu dự án (KHÔNG chứa dấu cách hoặc tiếng Việt có dấu, ví dụ: `D:/FPGA_Projects/Lesson1`).\n3. Đặt tên Project và tên Top-level entity trùng nhau (ví dụ: `my_first_fpga`).\n4. Tại màn hình **Family & Device Settings**:\n   - Device family: Chọn **Cyclone IV E**.\n   - Package: Chọn **FBGA**.\n   - Pin count: Chọn **780**.\n   - Speed grade: Chọn **7**.\n   - Trong danh sách lọc bên dưới, chọn chính xác: **EP4CE115F29C7**.\n5. Tại màn hình **EDA Tool Settings**:\n   - Simulation: Chọn Tool là **ModelSim-Altera**, Format là **VHDL**.\n6. Bấm Finish để hoàn tất.",
          callout: {
            type: "warning",
            title: "Tuyệt đối lưu ý",
            text: "Đường dẫn thư mục dự án KHÔNG ĐƯỢC chứa khoảng trắng (dấu cách) hoặc ký tự tiếng Việt có dấu! Ví dụ: 'D:\\Bai tap\\' sẽ khiến Quartus và ModelSim báo lỗi không biên dịch được."
          }
        },
        {
          heading: "2. Cấu hình NativeLink tự động",
          content: "Để Quartus tự gọi ModelSim:\n1. Mở **Tools -> Options -> EDA Tool Options**.\n2. Tại dòng **ModelSim-Altera**, nhập đường dẫn: `C:\\intelFPGA_lite\\20.1\\modelsim_ase\\win32aloem`.\n3. Vào **Assignments -> Settings -> EDA Tool Settings -> Simulation**.\n4. Tích chọn **Compile test bench** và thêm file testbench của bạn vào.\nTừ nay, mỗi khi muốn mô phỏng, bạn chỉ cần bấm **Tools -> Run Simulation Tool -> RTL Simulation**!",
          callout: {
            type: "tip",
            title: "Tự động hóa hoàn toàn",
            text: "NativeLink sẽ tự động tạo thư viện work, tự biên dịch và tự vẽ dạng sóng ra màn hình mà bạn không cần gõ một dòng lệnh nào trong ModelSim."
          }
        }
      ],
      truthTable: {
        headers: ["Thông số cấu hình", "Giá trị bắt buộc", "Ý nghĩa phần cứng trên DE2-115"],
        rows: [
          ["Family", "Cyclone IV E", "Dòng chip thế hệ 4 tiết kiệm năng lượng của Altera"],
          ["Device", "EP4CE115F29C7", "Mã chip thực tế hàn trên bo mạch DE2-115"],
          ["Core Voltage", "1.2V", "Điện áp lõi bên trong chip"],
          ["I/O Voltage mặc định", "2.5V / 3.3V", "Chuẩn điện áp các chân giao tiếp ngoại vi"],
          ["EDA Simulator", "ModelSim-Altera (VHDL)", "Bộ công cụ mô phỏng liên kết"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 200" class="circuit-svg">
      <!-- Sơ đồ liên kết NativeLink -->
      <rect x="40" y="45" width="220" height="110" rx="8" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
      <text x="150" y="75" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold">QUARTUS PRIME 20.1</text>
      <text x="150" y="100" text-anchor="middle" fill="#cbd5e1" font-size="11">Dự án: EP4CE115F29C7</text>
      <text x="150" y="125" text-anchor="middle" fill="#94a3b8" font-size="10">File: design.vhd + tb.vhd</text>

      <!-- Mũi tên NativeLink -->
      <path d="M 260 100 L 380 100" stroke="#f59e0b" stroke-width="3" marker-end="url(#arrow)"/>
      <text x="320" y="85" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">NativeLink</text>
      <text x="320" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">Tự động khởi chạy</text>

      <rect x="380" y="45" width="220" height="110" rx="8" fill="#131c31" stroke="#10b981" stroke-width="2"/>
      <text x="490" y="75" text-anchor="middle" fill="#10b981" font-size="14" font-weight="bold">MODELSIM-INTEL</text>
      <text x="490" y="100" text-anchor="middle" fill="#cbd5e1" font-size="11">Cửa sổ Waveform tự hiện</text>
      <text x="490" y="125" text-anchor="middle" fill="#94a3b8" font-size="10">Đọc dạng sóng tức thì</text>
    </svg>`,

    vhdlCode: {
      entityName: "project_test",
      circuitType: "combinational",
      typeExplanation: "Thiết kế đơn giản kiểm tra việc cấu hình dự án Quartus và liên kết NativeLink thành công.",
      code: `--------------------------------------------------------------------------------
-- Tên file: project_test.vhd
-- File mã nguồn Top-level kiểm tra cấu hình project
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity project_test is
    port (
        in_sig  : in  std_logic; -- Ngõ vào thử nghiệm
        out_sig : out std_logic  -- Ngõ ra thử nghiệm
    );
end entity project_test;

architecture rtl of project_test is
begin
    -- Đảo mức tín hiệu ngõ vào ra ngõ ra
    out_sig <= not in_sig;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_project_test",
      code: `--------------------------------------------------------------------------------
-- Testbench dùng để kiểm tra tính năng NativeLink tự động chạy
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_project_test is
end entity tb_project_test;

architecture sim of tb_project_test is
    signal tb_in  : std_logic := '0';
    signal tb_out : std_logic;
begin
    uut: entity work.project_test
        port map ( in_sig => tb_in, out_sig => tb_out );

    stim: process
    begin
        wait for 20 ns;
        tb_in <= '1';
        wait for 20 ns;
        tb_in <= '0';
        wait for 20 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Khi cấu hình đúng NativeLink, bấm Tools -> Run Simulation Tool -> RTL Simulation sẽ tự bật ModelSim và chạy testbench này."
    },

    quartusGuide: {
      steps: [
        "1. Tạo New Project chọn đúng chip EP4CE115F29C7.",
        "2. Tạo file project_test.vhd và dán mã nguồn trên vào.",
        "3. Chạy Processing -> Start -> Start Analysis & Elaboration (Ctrl+K) để kiểm tra cú pháp.",
        "4. Cấu hình NativeLink trong Settings -> Simulation."
      ],
      pinAssignments: [
        { signal: "in_sig", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "out_sig", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to in_sig\nset_location_assignment PIN_G19 -to out_sig`
    },

    commonErrors: [
      {
        error: "Quartus báo lỗi: 'Can't launch the ModelSim-Altera software'",
        cause: "Chưa cấu hình đường dẫn EDA Tool Options hoặc đường dẫn trỏ sai thư mục.",
        fix: "Vào Tools -> Options -> EDA Tool Options, tại dòng ModelSim-Altera điền: C:\\intelFPGA_lite\\20.1\\modelsim_ase\\win32aloem."
      },
      {
        error: "Error (12007): Top-level design entity '...' is undefined",
        cause: "Tên entity trong file VHDL không trùng với tên Top-level entity đã đặt trong Project Settings.",
        fix: "Vào Project -> Set as Top-Level Entity hoặc sửa tên entity trong file VHDL cho khớp hoàn toàn."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Kiểm tra mã chip trong Project",
        prompt: "Mở project trong Quartus và tìm xem mã chip EP4CE115F29C7 hiển thị ở vị trí nào trên thanh tiêu đề.",
        hint: "Mã chip luôn hiển thị ở góc trên cửa sổ Project Navigator tab Hierarchy.",
        solution: "Mã chip hiển thị tại mục Device trong Project Navigator: Cyclone IV E: EP4CE115F29C7."
      },
      {
        level: "Vận dụng",
        title: "Đổi tên Top-level entity",
        prompt: "Nếu bạn có 2 file entity khác nhau trong cùng 1 project, làm thế nào để chọn 1 file làm mạch chính?",
        hint: "Mở file đó ra và dùng menu Project -> Set as Top-Level Entity.",
        solution: "Mở file VHDL cần chọn, nhấn tổ hợp phím Ctrl + Shift + J hoặc vào menu Project -> Set as Top-Level Entity."
      },
      {
        level: "Thử thách",
        title: "Tạo template gán chân mặc định cho DE2-115",
        prompt: "Tại sao các kỹ sư thường dùng một file .qsf mẫu chứa sẵn toàn bộ chân của DE2-115 thay vì gán tay từng chân qua Pin Planner?",
        hint: "DE2-115 có hàng trăm chân ngoại vi, gán tay rất mất thời gian và dễ nhầm lẫn số PIN.",
        solution: "Dùng file kịch bản .qsf giúp tự động gán toàn bộ chân chỉ trong 1 giây bằng lệnh Project -> Import Assignments, tránh sai sót thủ công."
      }
    ],

    quiz: [
      {
        question: "Số '115' trong mã chip EP4CE115F29C7 biểu thị thông số gì của FPGA Cyclone IV?",
        options: [
          "Tần số tối đa 115 MHz",
          "Quy mô tài nguyên xấp xỉ 114,480 khối Logic Elements (LE)",
          "115 chân cắm ngoại vi",
          "Điện áp hoạt động 1.15V"
        ],
        answerIndex: 1,
        explanation: "Con số 115 trong mã chip Altera thể hiện mật độ khối logic: chip có khoảng 114,480 Logic Elements, là dòng chip lớn nhất trong phân họ Cyclone IV E."
      },
      {
        question: "Để tính năng NativeLink tự động gọi được ModelSim, bạn phải trỏ đường dẫn EDA Tool Options tới thư mục nào?",
        options: [
          "C:\\intelFPGA_lite\\20.1\\modelsim_ase\\win32aloem",
          "C:\\intelFPGA_lite\\20.1\\quartus\\bin64",
          "C:\\Windows\\System32",
          "C:\\Program Files\\ModelSim"
        ],
        answerIndex: 0,
        explanation: "Trong phiên bản 20.1 32-bit OEM, thư mục chứa file thực thi modelsim.exe nằm tại 'modelsim_ase/win32aloem'."
      },
      {
        question: "Quy tắc vàng khi đặt tên thư mục chứa dự án Quartus để tránh lỗi biên dịch là gì?",
        options: [
          "Phải đặt tên bằng chữ in hoa toàn bộ",
          "Không được chứa khoảng trắng (dấu cách) và không chứa ký tự tiếng Việt có dấu",
          "Phải đặt trong ổ đĩa C duy nhất",
          "Phải có đuôi mở rộng .exe"
        ],
        answerIndex: 1,
        explanation: "Các công cụ EDA như Quartus và ModelSim chạy trên nền script cổ điển (Tcl/Make) nên sẽ bị gãy đường dẫn nếu thư mục có khoảng trắng hoặc ký tự Unicode tiếng Việt có dấu."
      },
      {
        question: "Nếu tên file VHDL chứa entity không trùng với tên Top-level entity của project, Quartus sẽ báo lỗi gì khi biên dịch?",
        options: [
          "Lỗi thiếu chân I/O",
          "Error (12007): Top-level design entity is undefined",
          "Lỗi cháy chip FPGA",
          "Vẫn biên dịch bình thường"
        ],
        answerIndex: 1,
        explanation: "Quartus cần biết entity nào là gốc rễ (Top-level) của toàn bộ hệ thống để tiến hành tổng hợp. Nếu không tìm thấy entity trùng tên cấu hình, nó sẽ báo lỗi 12007."
      }
    ],

    summary: [
      "Kit DE2-115 sử dụng chip Altera Cyclone IV E EP4CE115F29C7 (gần 115k khối LE, 780 chân FBGA).",
      "Thư mục lưu project tuyệt đối không chứa khoảng trắng hoặc dấu tiếng Việt.",
      "Tên Top-level entity trong Settings phải trùng khớp với tên entity chính trong file VHDL.",
      "Cấu hình NativeLink tại `modelsim_ase/win32aloem` giúp tự động mô phỏng một chạm.",
      "Kiểm tra cú pháp nhanh bằng Start Analysis & Elaboration (Ctrl+K) trước khi biên dịch toàn bộ."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return { LEDR0: !inputs.SW0 ? 1 : 0 }; // out_sig <= not in_sig
      }
    }
  },

  // ========================================================================
  // BÀI 1.3
  // ========================================================================
  {
    id: "ch1-b3",
    chapterId: "ch1",
    order: 3,
    title: "Chương trình đầu tiên: Nối công tắc SW ra đèn LEDR",
    subtitle: "'Hello World' phần cứng kinh điển: Viết code, gán chân vật lý và nạp chạy thực tế",
    badge: "Bài thực hành đầu tiên",
    estimatedMinutes: 30,
    hardwareFocus: ["SW[0] (PIN_AB28)", "LEDR[0] (PIN_G19)"],

    objectives: [
      "Tự tay viết hoàn chỉnh file mã nguồn VHDL đầu tiên mô tả mạch nối dây công tắc ra đèn LED.",
      "Thực hiện thành công quy trình gán chân vật lý trong Pin Planner: SW0 -> PIN_AB28, LEDR0 -> PIN_G19.",
      "Tổng hợp dự án ra file .sof và nạp trực tiếp vào chip Cyclone IV trên kit DE2-115 bằng Quartus Programmer.",
      "Gạt công tắc SW0 trên bo mạch thật và thấy đèn LEDR0 sáng/tắt theo đúng thời gian thực."
    ],

    theory: {
      why: "Trong lập trình phần mềm, bài học đầu tiên là in dòng chữ 'Hello World' ra màn hình console. Trong thế giới thiết kế vi mạch FPGA, 'Hello World' chính là việc điều khiển một bóng đèn LED sáng theo một công tắc gạt! Bài học này sẽ đưa bạn đi trọn vẹn 100% vòng đời của một dự án FPGA thực tế từ con số 0 đến khi phần cứng chạy thật trên bàn làm việc của bạn.",
      how: "Mạch điện cực kỳ đơn giản: Khi công tắc trượt SW0 gạt LÊN, tiếp điểm đóng mạch đưa mức điện áp 2.5V (logic '1') vào chân `PIN_AB28` của FPGA. Bên trong chip, đường dây dẫn VHDL sẽ nối thẳng tín hiệu này ra chân `PIN_G19`. Chân `PIN_G19` nối với cực dương của đèn LEDR0. Khi nhận mức '1', dòng điện chạy qua đèn LEDR0 làm nó phát sáng màu đỏ rực rỡ!",
      sections: [
        {
          heading: "1. Bản đồ chân phần cứng DE2-115 sử dụng trong bài",
          content: "Theo tài liệu chính thức *Terasic DE2-115 User Manual*:\n- **SW0 (Công tắc trượt số 0 ngoài cùng bên phải):** Nối với chân `PIN_AB28` của FPGA. Chuẩn I/O là `2.5 V`.\n- **LEDR0 (Đèn LED đỏ số 0 ngoài cùng bên phải):** Nối với chân `PIN_G19` của FPGA. Chuẩn I/O là `2.5 V`.\nCả công tắc SW và đèn LEDR trên DE2-115 đều là loại **tích cực mức cao (Active-High)**: Gạt lên = '1', Đèn sáng = '1'.",
          callout: {
            type: "info",
            title: "Tra cứu chân trong User Manual",
            text: "Trong tài liệu DE2-115 User Manual, xem Bảng 4-6 (trang 31) cho danh sách chân SW và Bảng 4-4 (trang 29) cho danh sách chân LEDR."
          }
        },
        {
          heading: "2. Quy trình gán chân bằng Pin Planner",
          content: "1. Trong Quartus, chạy **Processing -> Start -> Start Analysis & Elaboration (Ctrl+K)** để Quartus nhận diện các cổng vào/ra (sw0 và ledr0).\n2. Mở **Assignments -> Pin Planner (Ctrl+Shift+N)**.\n3. Ở bảng bên dưới:\n   - Cột **Node Name**: Tìm dòng `sw0` -> Ở cột **Location** gõ: `PIN_AB28`.\n   - Tìm dòng `ledr0` -> Ở cột **Location** gõ: `PIN_G19`.\n   - Cột **I/O Standard**: Để mặc định `2.5 V`.\n4. Đóng Pin Planner lại. Quartus sẽ tự động lưu thông tin gán chân này vào file cấu hình dự án `.qsf`.",
          callout: {
            type: "warning",
            title: "Tuyệt đối không gõ sai mã chân",
            text: "Nếu gõ nhầm sang chân cấp nguồn hoặc chân clock, mạch có thể không hoạt động hoặc gây xung đột điện áp."
          }
        }
      ],
      truthTable: {
        headers: ["Vị trí công tắc SW0", "Điện áp tại PIN_AB28", "Mức logic VHDL", "Điện áp tại PIN_G19", "Trạng thái LEDR0"],
        rows: [
          ["Gạt XUỐNG (OFF)", "0V (GND)", "'0'", "0V", "TẮT"],
          ["Gạt LÊN (ON)", "2.5V (VCCIO)", "'1'", "2.5V", "SÁNG (Đỏ)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ mạch SW0 -> FPGA -> LEDR0 -->
      <!-- Công tắc SW0 -->
      <g transform="translate(40, 50)">
        <rect x="0" y="0" width="100" height="90" rx="6" fill="#131c31" stroke="#f59e0b" stroke-width="2"/>
        <text x="50" y="30" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">SW[0]</text>
        <text x="50" y="55" text-anchor="middle" fill="#94a3b8" font-size="10">PIN_AB28</text>
        <circle cx="50" cy="72" r="6" fill="#f59e0b"/>
      </g>

      <line x1="140" y1="95" x2="240" y2="95" stroke="#38bdf8" stroke-width="3"/>
      <text x="190" y="85" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="11">sw0</text>

      <!-- Khối FPGA Cyclone IV -->
      <rect x="240" y="30" width="180" height="130" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <text x="330" y="60" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold">FPGA CYCLONE IV</text>
      <text x="330" y="80" text-anchor="middle" fill="#94a3b8" font-size="10">EP4CE115F29C7</text>
      <!-- Dây nối nội bộ trong chip -->
      <line x1="240" y1="95" x2="420" y2="95" stroke="#10b981" stroke-width="2" stroke-dasharray="4"/>
      <text x="330" y="115" text-anchor="middle" fill="#10b981" font-size="10" font-family="monospace">ledr0 &lt;= sw0;</text>

      <line x1="420" y1="95" x2="510" y2="95" stroke="#38bdf8" stroke-width="3"/>
      <text x="465" y="85" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="11">ledr0</text>

      <!-- Đèn LEDR0 -->
      <g transform="translate(510, 50)">
        <rect x="0" y="0" width="100" height="90" rx="6" fill="#131c31" stroke="#ef4444" stroke-width="2"/>
        <text x="50" y="30" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="bold">LEDR[0]</text>
        <text x="50" y="55" text-anchor="middle" fill="#94a3b8" font-size="10">PIN_G19</text>
        <circle cx="50" cy="72" r="8" fill="#ff2b44" filter="drop-shadow(0 0 6px #ff2b44)"/>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "sw_to_led",
      circuitType: "combinational",
      typeExplanation: "Mạch tổ hợp thuần túy: Tín hiệu điện từ cổng vào sw0 được đấu trực tiếp sang cổng ra ledr0. Không có độ trễ clock, phản ứng diễn ra tức thì trong vài nano-giây.",
      code: `--------------------------------------------------------------------------------
-- Tên file: sw_to_led.vhd
-- Chức năng: Nối công tắc trượt SW0 ra đèn LED đỏ LEDR0 trên kit DE2-115
-- Chip: Cyclone IV E EP4CE115F29C7
-- Chân gán: sw0 -> PIN_AB28, ledr0 -> PIN_G19
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

-- Định nghĩa thực thể (Entity): Khai báo các cổng vật lý vào/ra
entity sw_to_led is
    port (
        sw0   : in  std_logic; -- Cổng vào nối với công tắc SW0 (PIN_AB28)
        ledr0 : out std_logic  -- Cổng ra nối với đèn LED đỏ LEDR0 (PIN_G19)
    );
end entity sw_to_led;

-- Định nghĩa kiến trúc (Architecture): Mô tả hành vi mạch bên trong
architecture rtl of sw_to_led is
begin
    -- Câu lệnh gán đồng thời (Concurrent assignment):
    -- Nối thẳng đường dây điện từ sw0 sang ledr0
    ledr0 <= sw0;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_sw_to_led",
      code: `--------------------------------------------------------------------------------
-- Testbench: tb_sw_to_led.vhd
-- Kiểm tra mạch nối dây sw_to_led trên trình mô phỏng ModelSim
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_sw_to_led is
    -- Entity testbench luôn rỗng vì là môi trường mô phỏng ảo
end entity tb_sw_to_led;

architecture sim of tb_sw_to_led is
    -- Tín hiệu kích thích nội bộ
    signal tb_sw0   : std_logic := '0';
    signal tb_ledr0 : std_logic;
begin
    -- Kết nối với thiết kế cần kiểm tra (DUT - Device Under Test)
    uut: entity work.sw_to_led
        port map (
            sw0   => tb_sw0,
            ledr0 => tb_ledr0
        );

    -- Quá trình tạo kích thích (Stimulus Process)
    stim_proc: process
    begin
        report ">>> Bắt đầu mô phỏng mạch sw_to_led:" severity note;

        -- Giai đoạn 1: Công tắc OFF ('0') -> Đèn phải TẮT ('0')
        tb_sw0 <= '0';
        wait for 50 ns;
        assert tb_ledr0 = '0' report "LỖI: sw0=0 nhưng ledr0 không bằng 0!" severity error;

        -- Giai đoạn 2: Công tắc ON ('1') -> Đèn phải SÁNG ('1')
        tb_sw0 <= '1';
        wait for 50 ns;
        assert tb_ledr0 = '1' report "LỖI: sw0=1 nhưng ledr0 không bằng 1!" severity error;

        -- Giai đoạn 3: Tắt lại công tắc
        tb_sw0 <= '0';
        wait for 50 ns;

        report ">>> Mô phỏng HOÀN TẤT THÀNH CÔNG 100%!" severity note;
        wait; -- Dừng mô phỏng
    end process;
end architecture sim;`,
      instructions: "Chạy trong ModelSim: Bạn sẽ thấy dạng sóng tb_ledr0 luôn bắt chước chính xác trạng thái của tb_sw0 sau 0 ns độ trễ mô phỏng."
    },

    quartusGuide: {
      steps: [
        "1. Tạo New Project trong Quartus 20.1: Tên project và Top-level entity đặt là 'sw_to_led'.",
        "2. Chọn đúng thiết bị: Cyclone IV E -> EP4CE115F29C7.",
        "3. Tạo file mới: File -> New -> VHDL File, dán đoạn mã sw_to_led.vhd vào và lưu lại.",
        "4. Chạy Analysis & Elaboration (Ctrl+K) để kiểm tra cú pháp không có lỗi màu đỏ.",
        "5. Mở Assignments -> Pin Planner (Ctrl+Shift+N): Gán sw0 = PIN_AB28, ledr0 = PIN_G19.",
        "6. Chạy Processing -> Start Compilation (Ctrl+L) để tổng hợp toàn bộ ra file sw_to_led.sof.",
        "7. Cắm cáp USB-Blaster, bật công tắc nguồn 12V trên kit DE2-115.",
        "8. Mở Tools -> Programmer -> Nhấp nút Start để nạp file .sof vào chip.",
        "9. Thử nghiệm trên kit thật: Gạt công tắc SW0 (ngoài cùng bên phải) lên xuống và quan sát đèn LEDR0 sáng tắt!"
      ],
      pinAssignments: [
        { signal: "sw0", pin: "PIN_AB28", ioStandard: "2.5 V", note: "Công tắc trượt SW[0] trên DE2-115" },
        { signal: "ledr0", pin: "PIN_G19", ioStandard: "2.5 V", note: "Đèn LED đỏ LEDR[0] trên DE2-115" }
      ],
      qsfSnippet: `# Lệnh gán chân trong file .qsf của Quartus\nset_location_assignment PIN_AB28 -to sw0\nset_location_assignment PIN_G19 -to ledr0`
    },

    commonErrors: [
      {
        error: "Quartus Programmer hiện thanh tiến độ Progress 100% (Successful) nhưng gạt công tắc đèn không sáng",
        cause: "Quên chạy lại 'Start Compilation' sau khi gán chân trong Pin Planner! Thông tin chân mới chưa được đóng gói vào file .sof.",
        fix: "Sau khi gán chân, bắt buộc phải chạy lại toàn bộ Compilation (Ctrl+L) rồi mới nạp lại file .sof."
      },
      {
        error: "Error (209015): Can't configure device. Expected JTAG ID code ...",
        cause: "Chọn sai mã chip trong Project Settings (ví dụ chọn nhầm sang chip Cyclone IV GX hoặc EP4CE40).",
        fix: "Vào Assignments -> Device, kiểm tra và chọn lại chính xác EP4CE115F29C7."
      },
      {
        error: "Đèn LED sáng mờ mờ hoặc không ổn định",
        cause: "Chưa cắm adapter nguồn 12V cho kit, chỉ cắm duy nhất cáp USB khiến nguồn điện không đủ tải.",
        fix: "Cắm adapter 12V đi kèm bo mạch và bật công tắc POWER màu đỏ."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Mở rộng ra 2 công tắc và 2 đèn LED",
        prompt: "Sửa mã nguồn để nối SW0 ra LEDR0 và nối thêm SW1 (PIN_AC28) ra LEDR1 (PIN_F19).",
        hint: "Khai báo thêm sw1 trong port in và ledr1 trong port out, sau đó thêm câu lệnh gán: ledr1 <= sw1;",
        solution: "entity sw_to_led_dual is\n  port (\n    sw0, sw1     : in  std_logic;\n    ledr0, ledr1 : out std_logic\n  );\nend entity;\narchitecture rtl of sw_to_led_dual is\nbegin\n  ledr0 <= sw0;\n  ledr1 <= sw1;\nend architecture;"
      },
      {
        level: "Vận dụng",
        title: "Mạch đảo logic: Gạt công tắc lên thì đèn tắt",
        prompt: "Thay đổi câu lệnh kiến trúc sao cho khi SW0 gạt LÊN ('1') thì LEDR0 TẮT ('0'), và khi SW0 gạt XUỐNG ('0') thì LEDR0 SÁNG ('1').",
        hint: "Sử dụng toán tử đảo logic 'not'.",
        solution: "ledr0 <= not sw0;"
      },
      {
        level: "Thử thách",
        title: "Nối bus 18 công tắc ra 18 đèn LED đỏ bằng std_logic_vector",
        prompt: "Kit DE2-115 có 18 công tắc SW[17:0] và 18 đèn LEDR[17:0]. Viết một chương trình VHDL ngắn nhất để nối toàn bộ 18 công tắc ra 18 đèn LED tương ứng.",
        hint: "Dùng kiểu dữ liệu mảng std_logic_vector(17 downto 0).",
        solution: "entity all_sw_led is\n  port (\n    sw   : in  std_logic_vector(17 downto 0);\n    ledr : out std_logic_vector(17 downto 0)\n  );\nend entity;\narchitecture rtl of all_sw_led is\nbegin\n  ledr <= sw; -- Chỉ 1 dòng lệnh nối trọn vẹn cả bus 18 đường dây!\nend architecture;"
      }
    ],

    quiz: [
      {
        question: "Trên kit Terasic DE2-115, công tắc trượt SW0 và đèn LED đỏ LEDR0 kết nối với những chân nào của chip Cyclone IV?",
        options: [
          "SW0 nối PIN_AB28, LEDR0 nối PIN_G19",
          "SW0 nối PIN_Y2, LEDR0 nối PIN_M23",
          "SW0 nối PIN_G18, LEDR0 nối PIN_F22",
          "SW0 nối PIN_E21, LEDR0 nối PIN_E22"
        ],
        answerIndex: 0,
        explanation: "Theo bảng tra cứu chân Terasic DE2-115 User Manual: SW[0] kết nối vật lý với PIN_AB28 và LEDR[0] kết nối vật lý với PIN_G19."
      },
      {
        question: "Cả công tắc SW và đèn LEDR trên kit DE2-115 đều thuộc loại tín hiệu có quy ước logic như thế nào?",
        options: [
          "Tích cực mức thấp (Active-Low): mức '0' là bật/sáng",
          "Tích cực mức cao (Active-High): mức '1' là bật/sáng",
          "Tích cực theo cạnh xung (Edge-triggered)",
          "Hoạt động theo điện áp âm"
        ],
        answerIndex: 1,
        explanation: "Công tắc trượt SW và đèn LED đỏ LEDR trên DE2-115 đều là Active-High: Gạt công tắc lên cấp 2.5V (logic '1'), xuất ra đèn mức 2.5V (logic '1') thì đèn sáng."
      },
      {
        question: "Trong câu lệnh VHDL 'ledr0 <= sw0;', dấu mũi tên '<=' biểu thị ý nghĩa phần cứng gì?",
        options: [
          "Phép so sánh nhỏ hơn hoặc bằng",
          "Phép gán tín hiệu đồng thời (tương đương nối một sợi dây dẫn điện từ cổng sw0 sang ledr0)",
          "Một lệnh gán biến trong bộ nhớ RAM",
          "Một vòng lặp kiểm tra liên tục"
        ],
        answerIndex: 1,
        explanation: "Trong kiến trúc VHDL, '<=' là toán tử gán tín hiệu (Signal Assignment). Nó mô tả sự đấu nối dây dẫn liên tục giữa hai nút mạch."
      },
      {
        question: "Sau khi thay đổi gán chân trong Pin Planner, bước bắt buộc phải làm trước khi mở Programmer để nạp chip là gì?",
        options: [
          "Khởi động lại máy tính",
          "Chạy lại Compilation (Ctrl+L) để Quartus tổng hợp lại file .sof mang thông tin chân mới",
          "Xóa toàn bộ mã nguồn VHDL",
          "Rút adapter nguồn 12V ra"
        ],
        answerIndex: 1,
        explanation: "File .sof cũ không tự cập nhật khi bạn sửa Pin Planner. Bạn bắt buộc phải chạy lại Compilation để Fitter tạo file .sof mới chứa các gán chân đã cập nhật."
      }
    ],

    summary: [
      "Bài 'Hello World' phần cứng: Nối công tắc SW0 (PIN_AB28) ra đèn LEDR0 (PIN_G19).",
      "Cả SW và LEDR trên DE2-115 đều là Active-High: Mức '1' = ON / SÁNG.",
      "Câu lệnh `ledr0 <= sw0;` tương đương với việc nối một sợi dây điện trực tiếp trong chip.",
      "Quy trình nạp chip: Viết VHDL -> Analysis (Ctrl+K) -> Pin Planner -> Compilation (Ctrl+L) -> Programmer.",
      "Chúc mừng bạn đã hoàn thành và nạp thành công chương trình phần cứng đầu tiên trên FPGA Cyclone IV!"
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return { LEDR0: inputs.SW0 ? 1 : 0 };
      }
    }
  }
];

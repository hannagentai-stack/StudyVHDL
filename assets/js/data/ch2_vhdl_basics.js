// ==========================================================================
// CH2_VHDL_BASICS.JS - CHƯƠNG 2: CÚ PHÁP VHDL CĂN BẢN (6 BÀI HỌC HOÀN CHỈNH)
// ==========================================================================

window.VHDL_LESSONS_DB = window.VHDL_LESSONS_DB || {};

window.VHDL_LESSONS_DB["ch2"] = [
  // ========================================================================
  // BÀI 2.1
  // ========================================================================
  {
    id: "ch2-b1",
    chapterId: "ch2",
    order: 1,
    title: "Bộ khung kinh điển: Library, Entity và Architecture",
    subtitle: "Cấu trúc 3 phần bắt buộc của mọi thiết kế VHDL: Vỏ bọc bên ngoài và ruột bên trong",
    badge: "Cú pháp cốt lõi",
    estimatedMinutes: 25,
    hardwareFocus: ["Cấu trúc file VHDL", "Cổng I/O"],

    objectives: [
      "Hiểu rõ cấu trúc 3 phần bất biến của một file mã nguồn VHDL: Library, Entity và Architecture.",
      "Nắm vững vai trò của Entity như 'vỏ bọc phần cứng' định nghĩa các chân I/O vật lý của chip.",
      "Nắm vững vai trò của Architecture như 'bản thiết kế bên trong' mô tả mạch điện hoạt động như thế nào.",
      "Biết cách đặt tên file trùng với tên Entity để tránh lỗi biên dịch trên Quartus Prime 20.1."
    ],

    theory: {
      why: "Hãy tưởng tượng bạn mua một con IC vi mạch số (như IC 7408 cổng AND). Bên ngoài con IC có vỏ nhựa màu đen và các chân kim loại thò ra (chân 1, 2 là ngõ vào; chân 3 là ngõ ra). Bên trong vỏ nhựa là tấm bán dẫn silicon chứa các tranzito nối với nhau. Ngôn ngữ VHDL mô phỏng chính xác cấu trúc thực tế đó: Entity mô tả các chân thò ra ngoài vỏ, còn Architecture mô tả ruột bên trong!",
      how: "Mọi file thiết kế VHDL chuẩn luôn bao gồm 3 phần tuần tự:\n1. **Library & Use Clause:** Khai báo các thư viện chuẩn (luôn luôn có `library IEEE; use IEEE.STD_LOGIC_1164.ALL;`).\n2. **Entity:** Khai báo tên mạch và danh sách các cổng vào/ra (Port clause).\n3. **Architecture:** Khai báo các tín hiệu nội bộ (sau từ khóa architecture và trước begin), và mô tả các kết nối logic song song (nằm giữa `begin` và `end`).",
      sections: [
        {
          heading: "1. Khai báo Thư viện (Library & Use)",
          content: "VHDL là ngôn ngữ định kiểu cực kỳ chặt chẽ (Strongly Typed). Bản thân ngôn ngữ gốc chỉ có các kiểu dữ liệu rất nghèo nàn (như bit chỉ nhận '0' và '1'). Để làm việc với điện tử số thực tế (có thêm trở kháng cao 'Z', không xác định 'X'), ta bắt buộc phải nạp thư viện chuẩn của tổ chức kỹ sư điện-điện tử quốc tế IEEE:\n\n```vhdl\nlibrary IEEE;\nuse IEEE.STD_LOGIC_1164.ALL;\n```\nDòng này giống như `#include <stdio.h>` trong C, luôn đứng ở đầu mọi file VHDL.",
          callout: {
            type: "info",
            title: "Quy tắc viết hoa - thường",
            text: "VHDL KHÔNG phân biệt chữ hoa chữ thường (Case-insensitive)! `ENTITY`, `entity` hay `Entity` đều hoàn toàn giống nhau. Tuy nhiên, lập trình viên chuyên nghiệp thường viết chữ thường cho từ khóa và viết in hoa cho tên chân ngoại vi kit (như SW, LEDR)."
          }
        },
        {
          heading: "2. Cặp bài trùng Entity - Architecture",
          content: "Một Entity có thể có nhiều Architecture khác nhau (ví dụ: một Architecture mô tả hành vi Behavioral, một Architecture mô tả cấu trúc Structural ghép từ các cổng). Tuy nhiên, trong 99% dự án thực tế, mỗi Entity sẽ đi kèm với đúng 1 Architecture mô tả mức chuyển giao thanh ghi (RTL - Register Transfer Level).",
          callout: {
            type: "warning",
            title: "Quy tắc đặt tên file",
            text: "Trong Quartus, tên file `.vhd` BẮT BUỘC phải trùng khớp 100% với tên của `entity` bên trong file đó. Ví dụ: entity tên là `my_gate` thì file phải lưu là `my_gate.vhd`."
          }
        }
      ],
      truthTable: {
        headers: ["Thành phần VHDL", "Tương đương trong phần cứng thực", "Từ khóa nhận diện"],
        rows: [
          ["Library", "Tiêu chuẩn kỹ thuật bán dẫn (IEEE)", "library, use"],
          ["Entity", "Vỏ bọc chip và các chân I/O kim loại", "entity ... is port ( ... ); end entity;"],
          ["Architecture", "Mạch bán dẫn silicon bên trong lòng chip", "architecture ... of ... is begin ... end architecture;"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Vỏ bọc Entity -->
      <rect x="180" y="30" width="280" height="160" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6"/>
      <text x="320" y="55" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="14" font-weight="bold">ENTITY: chip_block</text>

      <!-- Ruột Architecture -->
      <rect x="220" y="70" width="200" height="100" rx="6" fill="#131c31" stroke="#10b981" stroke-width="2"/>
      <text x="320" y="115" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="13" font-weight="bold">ARCHITECTURE: rtl</text>
      <text x="320" y="140" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">y &lt;= a and b;</text>

      <!-- Chân kim loại vào/ra của Entity -->
      <line x1="60" y1="95" x2="180" y2="95" class="wire"/>
      <line x1="180" y1="95" x2="220" y2="95" class="wire"/>
      <text x="120" y="85" text-anchor="middle" fill="#f8fafc" font-family="monospace" font-size="11">a : in</text>

      <line x1="60" y1="145" x2="180" y2="145" class="wire"/>
      <line x1="180" y1="145" x2="220" y2="145" class="wire"/>
      <text x="120" y="135" text-anchor="middle" fill="#f8fafc" font-family="monospace" font-size="11">b : in</text>

      <line x1="420" y1="120" x2="460" y2="120" class="wire"/>
      <line x1="460" y1="120" x2="580" y2="120" class="wire"/>
      <text x="520" y="110" text-anchor="middle" fill="#f8fafc" font-family="monospace" font-size="11">y : out</text>
    </svg>`,

    vhdlCode: {
      entityName: "structure_demo",
      circuitType: "combinational",
      typeExplanation: "Cấu trúc hoàn chỉnh mẫu mực của một file VHDL gồm 3 phần: Library, Entity và Architecture.",
      code: `--------------------------------------------------------------------------------
-- Tên file: structure_demo.vhd
-- Minh họa bộ khung chuẩn 3 phần của một thiết kế VHDL
--------------------------------------------------------------------------------
-- PHẦN 1: KHAI BÁO THƯ VIỆN (LIBRARY & USE)
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

-- PHẦN 2: THỰC THỂ (ENTITY) - Vỏ bọc bên ngoài & danh sách chân
entity structure_demo is
    port (
        sw_a  : in  std_logic; -- Chân vào A (nối SW0 - PIN_AB28)
        sw_b  : in  std_logic; -- Chân vào B (nối SW1 - PIN_AC28)
        led_y : out std_logic  -- Chân ra Y (nối LEDR0 - PIN_G19)
    );
end entity structure_demo;

-- PHẦN 3: KIẾN TRÚC (ARCHITECTURE) - Ruột mạch bên trong
architecture rtl of structure_demo is
    -- Khu vực khai báo tín hiệu nội bộ (nếu có) nằm ở đây
begin
    -- Khu vực mô tả mạch phần cứng đồng thời nằm giữa begin và end
    led_y <= sw_a and sw_b; -- Cổng logic AND kết nối các chân
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_structure_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra bộ khung structure_demo
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_structure_demo is
    -- Entity của testbench luôn RỖNG vì không có cổng vật lý ra ngoài bo mạch
end entity tb_structure_demo;

architecture sim of tb_structure_demo is
    signal a_tb, b_tb : std_logic := '0';
    signal y_tb       : std_logic;
begin
    -- Nối với mạch cần test
    uut: entity work.structure_demo
        port map (
            sw_a  => a_tb,
            sw_b  => b_tb,
            led_y => y_tb
        );

    -- Tạo kịch bản kích thích
    stim_proc: process
    begin
        wait for 20 ns;
        a_tb <= '0'; b_tb <= '1'; wait for 20 ns;
        a_tb <= '1'; b_tb <= '1'; wait for 20 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: led_y chỉ nhảy lên '1' khi cả a_tb và b_tb đều bằng '1'."
    },

    quartusGuide: {
      steps: [
        "1. Mở Quartus Prime 20.1 -> New Project Wizard, đặt tên dự án là 'structure_demo'.",
        "2. Tạo file structure_demo.vhd và dán mã nguồn trên vào.",
        "3. Chạy Processing -> Start -> Start Analysis & Elaboration (Ctrl+K).",
        "4. Mở Assignments -> Pin Planner, gán sw_a = PIN_AB28, sw_b = PIN_AC28, led_y = PIN_G19."
      ],
      pinAssignments: [
        { signal: "sw_a", pin: "PIN_AB28", ioStandard: "2.5 V", note: "Công tắc trượt SW0" },
        { signal: "sw_b", pin: "PIN_AC28", ioStandard: "2.5 V", note: "Công tắc trượt SW1" },
        { signal: "led_y", pin: "PIN_G19", ioStandard: "2.5 V", note: "Đèn LED đỏ LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to sw_a\nset_location_assignment PIN_AC28 -to sw_b\nset_location_assignment PIN_G19 -to led_y`
    },

    commonErrors: [
      {
        error: "Error (10500): VHDL syntax error ... near text ';'",
        cause: "Đặt dấu chấm phẩy (;) ở chân cuối cùng trong danh sách port clause: port ( a: in std_logic; b: out std_logic; );",
        fix: "Chân cuối cùng trước dấu đóng ngoặc đơn ')' KHÔNG ĐƯỢC có dấu chấm phẩy."
      },
      {
        error: "Error (12007): Top-level design entity '...' is undefined",
        cause: "Tên file .vhd khác với tên entity (ví dụ lưu file là demo.vhd nhưng entity là structure_demo).",
        fix: "Đổi tên file cho trùng khớp hoàn toàn với tên entity."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Bổ sung thêm cổng ngõ vào thứ 3",
        prompt: "Sửa Entity để thêm ngõ vào sw_c : in std_logic và sửa Architecture để led_y <= sw_a and sw_b and sw_c.",
        hint: "Nhớ đặt dấu chấm phẩy giữa sw_b và sw_c, nhưng sw_c là chân cuối nên không có dấu chấm phẩy.",
        solution: "port (\n  sw_a : in std_logic;\n  sw_b : in std_logic;\n  sw_c : in std_logic\n);"
      },
      {
        level: "Vận dụng",
        title: "Tạo 2 Architecture cho cùng 1 Entity",
        prompt: "Giải thích trường hợp nào một Entity có thể có 2 Architecture khác nhau và làm sao Quartus biết dùng cái nào?",
        hint: "Một architecture mô tả RTL và một architecture mô tả Behavioral/Gate-level.",
        solution: "Quartus sẽ mặc định chọn architecture được biên dịch sau cùng, hoặc bạn chỉ định rõ ràng qua cấu hình Configuration trong VHDL."
      },
      {
        level: "Thử thách",
        title: "Sự khác biệt giữa khai báo tín hiệu trước và sau begin",
        prompt: "Tại sao các tín hiệu nội bộ (signal) bắt buộc phải khai báo TRƯỚC từ khóa begin của architecture mà không được khai báo bên trong khối begin...end?",
        hint: "Vùng giữa architecture và begin là vùng khai báo (Declarative Region).",
        solution: "Vùng khai báo trước begin dùng để định nghĩa các thành phần tĩnh (tín hiệu, hằng số, component), còn vùng sau begin là vùng thực thi các câu lệnh đồng thời mô tả mạch điện."
      }
    ],

    quiz: [
      {
        question: "Phần nào trong một file VHDL chịu trách nhiệm định nghĩa các chân I/O vật lý giao tiếp với thế giới bên ngoài?",
        options: [
          "Thư viện (Library)",
          "Thực thể (Entity)",
          "Kiến trúc (Architecture)",
          "Gói (Package)"
        ],
        answerIndex: 1,
        explanation: "Entity đóng vai trò như vỏ bọc phần cứng, liệt kê tên, hướng (in/out) và kiểu dữ liệu của tất cả các chân giao tiếp."
      },
      {
        question: "Trong danh sách khai báo chân của Port clause, phát biểu nào sau đây là ĐÚNG về dấu chấm phẩy (;)?",
        options: [
          "Mọi dòng chân đều phải có dấu chấm phẩy ở cuối",
          "Chân cuối cùng trước dấu ngoặc đóng ')' tuyệt đối KHÔNG ĐƯỢC có dấu chấm phẩy",
          "Không cần dấu chấm phẩy ở bất kỳ dòng nào",
          "Chỉ có chân ra (out) mới cần dấu chấm phẩy"
        ],
        answerIndex: 1,
        explanation: "Trong cú pháp VHDL, dấu chấm phẩy là ký tự ngăn cách giữa các mục trong danh sách, do đó phần tử cuối cùng trước dấu đóng ngoặc đơn không được có dấu chấm phẩy."
      },
      {
        question: "Từ khóa nào phân định ranh giới giữa khu vực khai báo tín hiệu nội bộ và khu vực viết câu lệnh mạch điện trong Architecture?",
        options: [
          "is",
          "begin",
          "port",
          "entity"
        ],
        answerIndex: 1,
        explanation: "Tất cả các tín hiệu nội bộ được khai báo giữa 'architecture ... is' và 'begin'. Sau từ khóa 'begin' là nơi viết các câu lệnh mô tả mạch điện."
      },
      {
        question: "Ngôn ngữ VHDL có phân biệt chữ hoa và chữ thường (Case-sensitive) hay không?",
        options: [
          "Có, giống như ngôn ngữ C/C++ và Python",
          "Không, entity và ENTITY hoàn toàn được xem là một",
          "Chỉ phân biệt đối với tên tín hiệu",
          "Chỉ phân biệt khi chạy trên hệ điều hành Linux"
        ],
        answerIndex: 1,
        explanation: "Chuẩn IEEE VHDL quy định ngôn ngữ hoàn toàn không phân biệt hoa thường (Case-insensitive)."
      }
    ],

    summary: [
      "File VHDL luôn gồm 3 phần: Library (thư viện), Entity (chân vỏ bọc) và Architecture (ruột bên trong).",
      "Luôn khai báo `library IEEE; use IEEE.STD_LOGIC_1164.ALL;` ở đầu mọi file thiết kế.",
      "Tên file `.vhd` bắt buộc phải trùng 100% với tên của Entity.",
      "Chân cuối cùng trong Port clause không có dấu chấm phẩy trước ngoặc đóng `)`.",
      "Khai báo tín hiệu nội bộ nằm trước `begin`, viết câu lệnh mô tả mạch nằm sau `begin`."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return { LEDR0: inputs.SW0 && inputs.SW1 ? 1 : 0 }; // sw_a and sw_b
      }
    }
  },

  // ========================================================================
  // BÀI 2.2
  // ========================================================================
  {
    id: "ch2-b2",
    chapterId: "ch2",
    order: 2,
    title: "Các chế độ cổng (Port Modes): in, out, inout, buffer",
    subtitle: "Quy tắc vàng: Tại sao không bao giờ được đọc ngược giá trị từ cổng out?",
    badge: "Chế độ cổng I/O",
    estimatedMinutes: 25,
    hardwareFocus: ["Chân out vs buffer", "Tín hiệu trung gian"],

    objectives: [
      "Phân biệt rõ 4 chế độ cổng trong VHDL: `in`, `out`, `inout`, `buffer`.",
      "Hiểu nguyên nhân vật lý tại sao cổng `out` không thể đọc ngược lại trong chuẩn VHDL-93.",
      "Làm chủ kỹ thuật sử dụng tín hiệu trung gian (Internal Signal) để đưa dữ liệu vừa ra ngoài vừa làm ngõ vào cho khối khác.",
      "Hiểu ứng dụng của cổng 2 chiều `inout` trong giao tiếp bus I2C, RAM và GPIO."
    ],

    theory: {
      why: "Rất nhiều người mới học viết: `q_out <= q_out + 1;` khi làm bộ đếm và bị Quartus báo lỗi đỏ rực! Tại sao cổng `out` đưa tín hiệu ra ngoài được mà ta không thể đọc lại giá trị của nó? Về mặt phần cứng, cổng `out` là tầng khuếch đại đệm ngõ ra (Output Buffer). Một khi điện áp đã đẩy ra chân kim loại bên ngoài chip, đường dẫn đó không có đường hồi tiếp quay ngược trở lại mạch bên trong.",
      how: "Để giải quyết vấn đề này trong thực tế, các kỹ sư vi mạch luôn tuân thủ **Quy tắc vàng dùng tín hiệu trung gian**:\n1. Khai báo một tín hiệu nội bộ bên trong Architecture: `signal q_internal : std_logic;`.\n2. Thực hiện mọi phép toán và đọc ngược trên `q_internal`.\n3. Gán giá trị từ tín hiệu nội ra cổng ngoài: `q_out <= q_internal;`.\nCách làm này sạch sẽ, tương thích 100% với mọi phiên bản VHDL và không bao giờ gặp lỗi.",
      sections: [
        {
          heading: "1. Chi tiết 4 chế độ cổng (Port Modes)",
          content: "- **in:** Tín hiệu chỉ đi VÀO chip (đọc được, KHÔNG ghi được). Ví dụ: chân nối công tắc SW, nút nhấn KEY, xung Clock.\n- **out:** Tín hiệu chỉ đi RA khỏi chip (ghi được, KHÔNG đọc ngược lại được trong VHDL-93). Ví dụ: chân nối đèn LEDR, LEDG, LED 7 thanh.\n- **buffer:** Cổng ra nhưng CHO PHÉP đọc ngược lại. Tuy nhiên chuẩn VHDL hiện đại KHÔNG KHUYÊN DÙNG vì gây khó khăn khi ghép tầng component phân cấp.\n- **inout:** Cổng hai chiều (Bi-directional). Cần có mạch đệm 3 trạng thái (Tri-state buffer) điều khiển hướng truyền. Dùng cho bus dữ liệu ngoài.",
          callout: {
            type: "warning",
            title: "Tại sao không nên dùng cổng buffer?",
            text: "Trong VHDL, nếu bạn nối một cổng `buffer` của khối con lên khối cha, cổng ở khối cha cũng BẮT BUỘC phải là `buffer`. Điều này làm hỏng tính đóng gói module. Hãy luôn dùng cổng `out` kết hợp với tín hiệu nội!"
          }
        },
        {
          heading: "2. Kỹ thuật dùng tín hiệu nội bộ (Internal Signal)",
          content: "Hãy quan sát ví dụ dưới đây: Bạn muốn tạo cổng logic mà ngõ ra `y` vừa sáng đèn LEDR0, vừa được dùng để điều khiển đèn LEDR1. Thay vì đọc từ `y`, ta dùng tín hiệu `sig_int`:",
          callout: {
            type: "tip",
            title: "Công thức mẫu",
            text: "sig_int <= a and b;  -- Tính toán trên tín hiệu nội\ny_out   <= sig_int;  -- Đẩy ra chân ngoài"
          }
        }
      ],
      truthTable: {
        headers: ["Chế độ Port", "Hướng vật lý", "Đọc được không?", "Ghi được không?", "Khi nào nên dùng?"],
        rows: [
          ["in", "Đi vào chip", "CÓ", "KHÔNG", "Công tắc, nút nhấn, xung clock, cảm biến"],
          ["out", "Đi ra khỏi chip", "KHÔNG (VHDL-93)", "CÓ", "Đèn LED, còi buzzer, màn hình hiển thị"],
          ["buffer", "Đi ra + hồi tiếp", "CÓ", "CÓ", "Hạn chế dùng (thay bằng tín hiệu nội)"],
          ["inout", "2 chiều", "CÓ", "CÓ", "Bus dữ liệu RAM, chân SDA của I2C"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ giải pháp Signal trung gian -->
      <rect x="140" y="30" width="360" height="160" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <text x="320" y="55" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">GIẢI PHÁP TÍN HIỆU TRUNG GIAN (SIGNAL)</text>

      <!-- Khối logic -->
      <rect x="170" y="80" width="90" height="60" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="215" y="115" text-anchor="middle" fill="#fff" font-size="12">Logic</text>

      <!-- Đường dây tín hiệu nội rẽ 2 nhánh -->
      <line x1="260" y1="110" x2="360" y2="110" stroke="#10b981" stroke-width="3"/>
      <circle cx="360" cy="110" r="4" fill="#10b981"/>
      <text x="310" y="100" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="11">sig_int</text>

      <!-- Nhánh 1: đi ra cổng OUT -->
      <line x1="360" y1="110" x2="500" y2="110" stroke="#38bdf8" stroke-width="2"/>
      <line x1="500" y1="110" x2="580" y2="110" class="wire"/>
      <text x="540" y="100" fill="#f8fafc" font-family="monospace" font-size="11">led_y : out</text>

      <!-- Nhánh 2: quay về làm ngõ vào cho khối tiếp theo -->
      <path d="M 360 110 L 360 160 L 440 160" fill="none" stroke="#10b981" stroke-width="2"/>
      <rect x="440" y="140" width="80" height="40" rx="4" fill="#131c31" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="480" y="165" text-anchor="middle" fill="#f59e0b" font-size="10">Khối B</text>
    </svg>`,

    vhdlCode: {
      entityName: "port_mode_demo",
      circuitType: "combinational",
      typeExplanation: "Minh họa phong cách viết chuẩn mực: Sử dụng tín hiệu nội bộ sig_int để tránh việc phải đọc ngược từ cổng out.",
      code: `--------------------------------------------------------------------------------
-- Tên file: port_mode_demo.vhd
-- Minh họa cách sử dụng tín hiệu trung gian thay cho việc đọc cổng out
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity port_mode_demo is
    port (
        sw0   : in  std_logic; -- Chế độ in: Chỉ đọc
        sw1   : in  std_logic; -- Chế độ in: Chỉ đọc
        ledr0 : out std_logic; -- Chế độ out: Ngõ ra chính
        ledr1 : out std_logic  -- Chế độ out: Đảo của ngõ ra chính
    );
end entity port_mode_demo;

architecture rtl of port_mode_demo is
    -- KHAI BÁO TÍN HIỆU TRUNG GIAN NỘI BỘ (SIGNAL)
    -- Tín hiệu này có thể vừa ghi vừa đọc thoải mái bên trong chip!
    signal sig_and : std_logic;
begin
    -- 1. Tính toán logic và lưu vào tín hiệu nội bộ
    sig_and <= sw0 and sw1;

    -- 2. Đưa tín hiệu nội bộ ra cổng ledr0
    ledr0 <= sig_and;

    -- 3. Đọc ngược tín hiệu nội bộ để tính tiếp cho ledr1 (KHÔNG đọc từ ledr0!)
    ledr1 <= not sig_and;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_port_mode_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra mạch port_mode_demo
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_port_mode_demo is
end entity tb_port_mode_demo;

architecture sim of tb_port_mode_demo is
    signal s0, s1 : std_logic := '0';
    signal l0, l1 : std_logic;
begin
    uut: entity work.port_mode_demo
        port map ( sw0 => s0, sw1 => s1, ledr0 => l0, ledr1 => l1 );

    stim: process
    begin
        s0 <= '0'; s1 <= '0'; wait for 20 ns;
        s0 <= '1'; s1 <= '0'; wait for 20 ns;
        s0 <= '1'; s1 <= '1'; wait for 20 ns; -- l0 = 1, l1 = 0
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim, kiểm tra dạng sóng: ledr1 luôn luôn ngược pha 100% với ledr0."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file port_mode_demo.vhd trong Quartus.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: sw0 = PIN_AB28, sw1 = PIN_AC28, ledr0 = PIN_G19, ledr1 = PIN_F19.",
        "4. Nạp file .sof lên kit DE2-115 và quan sát 2 đèn LED đỏ."
      ],
      pinAssignments: [
        { signal: "sw0", pin: "PIN_AB28", ioStandard: "2.5 V", note: "Công tắc SW0" },
        { signal: "sw1", pin: "PIN_AC28", ioStandard: "2.5 V", note: "Công tắc SW1" },
        { signal: "ledr0", pin: "PIN_G19", ioStandard: "2.5 V", note: "Đèn LEDR0 (Sáng khi SW0=SW1=1)" },
        { signal: "ledr1", pin: "PIN_F19", ioStandard: "2.5 V", note: "Đèn LEDR1 (Sáng khi SW0 hoặc SW1 = 0)" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to sw0\nset_location_assignment PIN_AC28 -to sw1\nset_location_assignment PIN_G19 -to ledr0\nset_location_assignment PIN_F19 -to ledr1`
    },

    commonErrors: [
      {
        error: "Error (10327): Cannot read output port 'ledr0'",
        cause: "Cố tình đọc giá trị của cổng out: ledr1 <= not ledr0; trong chuẩn VHDL-93/2001.",
        fix: "Dùng tín hiệu nội bộ trung gian (signal) như bài học đã hướng dẫn."
      },
      {
        error: "Gán giá trị cho cổng in: sw0 <= '1';",
        cause: "Cổng in là cổng chỉ đọc từ bên ngoài, mạch bên trong chip không thể lái nguồn điện vào chân in.",
        fix: "Cổng in chỉ được nằm bên vế PHẢI của câu lệnh gán."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo thêm ngõ ra LEDR2",
        prompt: "Dùng tín hiệu trung gian sig_and để cấp cho ngõ ra ledr2 sáng khi sig_and = '1' và SW2 = '1'.",
        hint: "Khai báo thêm sw2 : in std_logic và ledr2 : out std_logic; gán ledr2 <= sig_and and sw2;",
        solution: "ledr2 <= sig_and and sw2;"
      },
      {
        level: "Vận dụng",
        title: "So sánh buffer và signal trung gian",
        prompt: "Viết lại bài trên sử dụng cổng buffer thay vì signal trung gian và so sánh sự khác nhau về độ dài mã nguồn.",
        hint: "Đổi ledr0 : buffer std_logic; sau đó có thể viết trực tiếp ledr1 <= not ledr0;",
        solution: "Dùng buffer code ngắn hơn 1 dòng nhưng gây lỗi phân cấp khi ghép nối component sau này."
      },
      {
        level: "Thử thách",
        title: "Nguyên lý hoạt động của cổng inout (Tri-state)",
        prompt: "Khi nào chân inout ở trạng thái đọc và khi nào ở trạng thái ghi? Mức logic 'Z' có vai trò gì?",
        hint: "Trạng thái Z là trở kháng cao (High-Impedance) ngắt chân chip khỏi đường bus.",
        solution: "Khi ghi, chip lái mức '0' hoặc '1'. Khi đọc, chip lái mức 'Z' để ngắt mạch điện nội bộ, cho phép thiết bị bên ngoài tự do áp điện áp lên đường bus mà không bị chập."
      }
    ],

    quiz: [
      {
        question: "Điều gì sẽ xảy ra nếu bạn cố tình viết câu lệnh đọc ngược từ cổng out trong chuẩn VHDL-93: 'x <= not led_out;'?",
        options: [
          "Quartus sẽ báo lỗi biên dịch Error (10327): Cannot read output port",
          "Mạch vẫn chạy bình thường",
          "Đèn LED sẽ nhấp nháy liên tục",
          "Quartus tự động chuyển thành mạch tuần tự"
        ],
        answerIndex: 0,
        explanation: "Theo chuẩn VHDL-93, cổng có chế độ 'out' chỉ được phép ghi dữ liệu, trình biên dịch cấm tuyệt đối việc đọc lại giá trị của nó."
      },
      {
        question: "Giải pháp chuẩn mực và chuyên nghiệp nhất trong thiết kế FPGA để giải quyết việc cần đọc lại tín hiệu ngõ ra là gì?",
        options: [
          "Chuyển toàn bộ cổng thành inout",
          "Dùng một tín hiệu nội bộ (internal signal) trung gian",
          "Nối một sợi dây điện thật bên ngoài bo mạch từ LED về công tắc",
          "Dùng lệnh goto"
        ],
        answerIndex: 1,
        explanation: "Sử dụng tín hiệu nội (internal signal) là giải pháp kinh điển, vừa trong sáng về mặt kiến trúc, vừa tương thích với mọi bộ tổng hợp và công cụ mô phỏng."
      },
      {
        question: "Chế độ cổng 'inout' thường được sử dụng cho loại giao tiếp phần cứng nào?",
        options: [
          "Bóng đèn LED đơn sắc",
          "Bus dữ liệu hai chiều như I2C, SPI hoặc giao tiếp bộ nhớ RAM ngoài",
          "Nút nhấn Reset",
          "Xung nhịp thạch anh 50MHz"
        ],
        answerIndex: 1,
        explanation: "Cổng inout cho phép truyền dữ liệu cả 2 chiều vào và ra trên cùng một đường dây vật lý, bắt buộc phải dùng cho các chuẩn bus như I2C (SDA) hay bus dữ liệu RAM."
      },
      {
        question: "Cổng chế độ 'in' có thể nằm ở vị trí nào trong câu lệnh gán tín hiệu '<='?",
        options: [
          "Chỉ được nằm bên vế trái (được ghi)",
          "Chỉ được nằm bên vế phải (chỉ đọc giá trị)",
          "Nằm ở cả hai vế",
          "Không được tham gia vào câu lệnh gán"
        ],
        answerIndex: 1,
        explanation: "Cổng in nhận điện áp từ bên ngoài bo mạch đưa vào chip, do đó bên trong kiến trúc ta chỉ có thể đọc giá trị của nó (nằm ở vế phải của phép gán)."
      }
    ],

    summary: [
      "4 chế độ cổng: `in` (chỉ đọc), `out` (chỉ ghi), `buffer` (ghi và đọc lại), `inout` (2 chiều tri-state).",
      "Chuẩn VHDL-93 cấm đọc ngược từ cổng `out`.",
      "Quy tắc vàng: Luôn dùng tín hiệu nội bộ (signal) làm trung gian để tính toán rồi mới gán ra cổng `out`.",
      "Tránh lạm dụng cổng `buffer` vì sẽ gây khó khăn khi tái sử dụng linh kiện cấp trên.",
      "Cổng `inout` cần có tín hiệu điều khiển trở kháng cao `'Z'` khi chuyển hướng đọc."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1"],
      activeOutputs: ["LEDR0", "LEDR1"],
      logicEvaluator: function(inputs) {
        const andVal = inputs.SW0 && inputs.SW1 ? 1 : 0;
        return {
          LEDR0: andVal,
          LEDR1: andVal ? 0 : 1 // Đảo của LEDR0
        };
      }
    }
  },

  // ========================================================================
  // BÀI 2.3
  // ========================================================================
  {
    id: "ch2-b3",
    chapterId: "ch2",
    order: 3,
    title: "Hệ thống kiểu dữ liệu chuẩn: bit, std_logic và std_logic_vector",
    subtitle: "Giải mã 9 giá trị logic của chuẩn IEEE 1164: Tại sao '0' và '1' là chưa đủ?",
    badge: "Kiểu dữ liệu chuẩn",
    estimatedMinutes: 25,
    hardwareFocus: ["Chuẩn IEEE 1164", "Bus dữ liệu vector"],

    objectives: [
      "Hiểu tại sao trong thiết kế vi mạch phải dùng `std_logic` thay vì kiểu `bit` truyền thống.",
      "Nắm vững 9 giá trị logic của chuẩn IEEE 1164 (đặc biệt là '0', '1', 'Z', 'X', 'U').",
      "Thành thạo khai báo và thao tác với bus dữ liệu nhiều bit: `std_logic_vector(N-1 downto 0)`.",
      "Hiểu sự khác biệt về cú pháp giữa dấu ngoặc đơn `' '` (cho 1 bit) và dấu ngoặc kép `\" \"` (cho chuỗi vector)."
    ],

    theory: {
      why: "Trong toán học thuần túy, ta chỉ có 0 và 1. Nhưng trên một mạch in phần cứng thực tế, một đường dây dẫn có thể gặp nhiều tình huống khác: Dây bị đứt (chưa có giá trị = 'U'), hai nguồn điện chập vào nhau (xung đột = 'X'), hoặc chân chip bị ngắt điện trở kháng cao (thả nổi = 'Z'). Kiểu dữ liệu `std_logic` ra đời để mô phỏng chính xác 100% các hiện tượng vật lý đó của mạch điện.",
      how: "Chuẩn IEEE 1164 định nghĩa hệ logic 9 giá trị cho `std_logic`:\n- `'U'`: Uninitialized (Chưa khởi tạo - hay gặp khi bắt đầu mô phỏng ModelSim).\n- `'X'`: Forcing Unknown (Xung đột mức logic mạnh, chập nguồn).\n- `'0'`: Forcing 0 (Mức 0V rõ ràng).\n- `'1'`: Forcing 1 (Mức 2.5V/3.3V rõ ràng).\n- `'Z'`: High Impedance (Trở kháng cao - thả nổi mạch).\n- `'W'`, `'L'`, `'H'`, `'-'`: Các mức suy yếu và Don't Care.\n\nĐể gộp nhiều đường dây dẫn lại thành một bus dữ liệu, ta dùng `std_logic_vector(M downto N)`. Ví dụ: 4 công tắc SW gom thành `std_logic_vector(3 downto 0)`.",
      sections: [
        {
          heading: "1. Quy ước chỉ số vector: downto vs to",
          content: "Trong VHDL có 2 cách đánh số vector:\n- `(3 downto 0)`: Bit 3 là MSB (Most Significant Bit - trọng số cao nhất), Bit 0 là LSB (Least Significant Bit - trọng số thấp nhất). **ĐÂY LÀ CHUẨN CÔNG NGHIỆP BẮT BUỘC DÙNG TRÊN FPGA!**\n- `(0 to 3)`: Bit 0 là MSB, Bit 3 là LSB. Thường chỉ dùng cho mảng chuỗi ký tự.\n\nHãy luôn luôn dùng `(N-1 downto 0)` để đồng bộ với sơ đồ chân kit DE2-115.",
          callout: {
            type: "warning",
            title: "Cạm bẫy cú pháp: Dấu nháy đơn vs Nháy kép",
            text: "- 1 bit đơn (`std_logic`): BẮT BUỘC dùng nháy đơn: `'0'`, `'1'`, `'Z'`.\n- Nhiều bit (`std_logic_vector`): BẮT BUỘC dùng nháy kép: `\"0000\"`, `\"1011\"`.\nViết nhầm `\"1\"` cho 1 bit hoặc `'1010'` cho vector sẽ bị Quartus báo lỗi cú pháp ngay lập tức!"
          }
        },
        {
          heading: "2. Thao tác cắt lát bit (Bit Slicing)",
          content: "Bạn có thể trích xuất từng bit riêng lẻ hoặc từng cụm bit từ một vector:\n- `sw(0)`: Lấy riêng bit 0 của vector `sw`.\n- `sw(3 downto 0)`: Lấy 4 bit thấp (Nibble dưới).\n- Ghép 2 vector lại bằng toán tử ghép chuỗi `&`: `bus_8bit <= bus_high & bus_low;`.",
          callout: {
            type: "info",
            title: "Ví dụ gán chân kit DE2-115",
            text: "Trên DE2-115, dãy 18 công tắc trượt được khai báo là: `SW : in std_logic_vector(17 downto 0);`."
          }
        }
      ],
      truthTable: {
        headers: ["Giá trị std_logic", "Ý nghĩa điện học", "Khi nào xuất hiện trên ModelSim?"],
        rows: [
          ["'U'", "Chưa khởi tạo (Uninitialized)", "Đầu chu kỳ mô phỏng khi thanh ghi chưa có tín hiệu Reset"],
          ["'X'", "Xung đột logic (Unknown)", "Khi có 2 process cùng lái giá trị ngược nhau vào 1 dây"],
          ["'0'", "Mức thấp (GND 0V)", "Trạng thái bình thường"],
          ["'1'", "Mức cao (VCC 2.5V/3.3V)", "Trạng thái bình thường"],
          ["'Z'", "Trở kháng cao (Hi-Z / Thả nổi)", "Khi ngắt công tắc tri-state hoặc chân inout đang đọc"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Minh họa Bus dữ liệu 4-bit -->
      <g transform="translate(60, 40)">
        <rect x="0" y="20" width="160" height="90" rx="8" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="80" y="50" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">SW[3:0]</text>
        <text x="80" y="80" text-anchor="middle" fill="#f8fafc" font-family="monospace" font-size="16">"1 0 1 1"</text>

        <!-- Dây bus dày có gạch chéo 4 -->
        <line x1="160" y1="65" x2="320" y2="65" class="wire-bus"/>
        <!-- Dấu gạch chéo ghi độ rộng bus /4 -->
        <line x1="230" y1="55" x2="250" y2="75" stroke="#38bdf8" stroke-width="2"/>
        <text x="245" y="50" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">/ 4</text>

        <rect x="320" y="10" width="220" height="110" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
        <text x="430" y="40" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">Tách từng bit riêng lẻ:</text>
        <text x="430" y="65" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-size="11">bit 3 (MSB): sw(3) = '1'</text>
        <text x="430" y="85" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-size="11">bit 2:       sw(2) = '0'</text>
        <text x="430" y="105" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-size="11">bit 0 (LSB): sw(0) = '1'</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "vector_demo",
      circuitType: "combinational",
      typeExplanation: "Minh họa khai báo và thao tác với bus std_logic_vector 4-bit, trích xuất từng bit và ghép chuỗi.",
      code: `--------------------------------------------------------------------------------
-- Tên file: vector_demo.vhd
-- Minh họa sử dụng std_logic và std_logic_vector
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity vector_demo is
    port (
        sw_bus   : in  std_logic_vector(3 downto 0); -- Bus 4 công tắc SW[3:0]
        led_msb  : out std_logic;                     -- 1 bit đơn: lấy bit cao nhất
        led_lsb  : out std_logic;                     -- 1 bit đơn: lấy bit thấp nhất
        led_bus  : out std_logic_vector(3 downto 0)  -- Bus 4 đèn LEDR[3:0]
    );
end entity vector_demo;

architecture rtl of vector_demo is
begin
    -- 1. Trích xuất từng bit đơn lẻ (dùng ngoặc đơn chỉ số)
    led_msb <= sw_bus(3); -- Lấy bit 3 (MSB)
    led_lsb <= sw_bus(0); -- Lấy bit 0 (LSB)

    -- 2. Đảo bit và gán nguyên cả bus (lưu ý dùng dấu nháy kép cho vector hằng số)
    -- Gán trực tiếp cả vector 4-bit:
    led_bus <= not sw_bus; -- Tất cả 4 đèn sẽ sáng đảo ngược so với công tắc
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_vector_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench quét giá trị vector từ "0000" đến "1111"
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_vector_demo is
end entity tb_vector_demo;

architecture sim of tb_vector_demo is
    signal sw_tb  : std_logic_vector(3 downto 0) := "0000";
    signal msb_tb : std_logic;
    signal lsb_tb : std_logic;
    signal led_tb : std_logic_vector(3 downto 0);
begin
    uut: entity work.vector_demo
        port map (
            sw_bus  => sw_tb,
            led_msb => msb_tb,
            led_lsb => lsb_tb,
            led_bus => led_tb
        );

    stim: process
    begin
        sw_tb <= "0000"; wait for 20 ns;
        sw_tb <= "1001"; wait for 20 ns; -- msb=1, lsb=1, led="0110"
        sw_tb <= "1111"; wait for 20 ns; -- msb=1, lsb=1, led="0000"
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim, click chuột phải vào tín hiệu sw_tb -> chọn Radix -> Hexadecimal hoặc Unsigned để xem giá trị số trực quan."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file vector_demo.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Mở Pin Planner: Lưu ý các tín hiệu vector sẽ hiển thị dạng nhóm sw_bus[0], sw_bus[1], sw_bus[2], sw_bus[3].",
        "4. Gán chân: sw_bus[0]..[3] lần lượt vào PIN_AB28, PIN_AC28, PIN_AC27, PIN_AD27."
      ],
      pinAssignments: [
        { signal: "sw_bus[0]", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "sw_bus[1]", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1" },
        { signal: "sw_bus[2]", pin: "PIN_AC27", ioStandard: "2.5 V", note: "SW2" },
        { signal: "sw_bus[3]", pin: "PIN_AD27", ioStandard: "2.5 V", note: "SW3" },
        { signal: "led_bus[0]", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" },
        { signal: "led_bus[1]", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1" },
        { signal: "led_bus[2]", pin: "PIN_E19", ioStandard: "2.5 V", note: "LEDR2" },
        { signal: "led_bus[3]", pin: "PIN_F21", ioStandard: "2.5 V", note: "LEDR3" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to sw_bus[0]\nset_location_assignment PIN_AC28 -to sw_bus[1]\nset_location_assignment PIN_AC27 -to sw_bus[2]\nset_location_assignment PIN_AD27 -to sw_bus[3]\nset_location_assignment PIN_G19 -to led_bus[0]\nset_location_assignment PIN_F19 -to led_bus[1]\nset_location_assignment PIN_E19 -to led_bus[2]\nset_location_assignment PIN_F21 -to led_bus[3]`
    },

    commonErrors: [
      {
        error: "Error (10344): VHDL error: expression has 4 elements, but must have 1 elements",
        cause: "Gán chuỗi vector vào 1 bit đơn (hoặc ngược lại): led_msb <= \"1010\";",
        fix: "Kiểm tra độ rộng bit: tín hiệu 1 bit chỉ nhận '0' hoặc '1'; tín hiệu vector 4 bit mới nhận \"1010\"."
      },
      {
        error: "Nhầm lẫn giữa dấu nháy đơn và nháy kép: sw <= '1010';",
        cause: "Dấu nháy đơn chỉ dùng cho đúng 1 ký tự bit đơn lẻ.",
        fix: "Đổi thành dấu ngoặc kép: sw <= \"1010\";."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Khai báo bus 8 công tắc",
        prompt: "Viết cú pháp khai báo port cho bus 8 công tắc từ SW7 đến SW0 và bus 8 đèn LED đỏ tương ứng.",
        hint: "Dùng std_logic_vector(7 downto 0).",
        solution: "sw   : in  std_logic_vector(7 downto 0);\nledr : out std_logic_vector(7 downto 0);"
      },
      {
        level: "Vận dụng",
        title: "Đảo ngược thứ tự các bit của bus",
        prompt: "Cho bus ngõ vào `a : in std_logic_vector(3 downto 0)`. Gán ra `b : out std_logic_vector(3 downto 0)` sao cho bit cao nhất của a sang bit thấp nhất của b (đảo gương).",
        hint: "Ghép từng bit: b <= a(0) & a(1) & a(2) & a(3);",
        solution: "b <= a(0) & a(1) & a(2) & a(3);"
      },
      {
        level: "Thử thách",
        title: "Ý nghĩa của giá trị 'U' và 'X' trong ModelSim",
        prompt: "Khi mở ModelSim thấy một đường tín hiệu có màu đỏ rực và hiển thị chữ 'U', điều đó có nghĩa là gì và cách sửa trong VHDL?",
        hint: "'U' là Uninitialized. Tín hiệu chưa được cấp giá trị khởi tạo ban đầu.",
        solution: "Tín hiệu chưa được gán giá trị hoặc mạch tuần tự chưa được cấp xung Reset. Cần thêm tín hiệu Reset bất đồng bộ hoặc gán giá trị khởi tạo khi khai báo: signal q : std_logic := '0';"
      }
    ],

    quiz: [
      {
        question: "Cú pháp nào sau đây là ĐÚNG khi gán giá trị cho một tín hiệu kiểu std_logic (1 bit đơn)?",
        options: [
          "sig <= \"1\";",
          "sig <= '1';",
          "sig <= 1;",
          "sig <= TRUE;"
        ],
        answerIndex: 1,
        explanation: "Kiểu std_logic 1 bit đơn bắt buộc phải đặt trong cặp dấu nháy đơn: '0' hoặc '1'."
      },
      {
        question: "Trong thiết kế FPGA chuyên nghiệp, quy ước nào được dùng phổ biến để đánh số thứ tự bit trong một bus dữ liệu N-bit?",
        options: [
          "(0 to N-1)",
          "(N-1 downto 0)",
          "[0:N-1]",
          "(1 to N)"
        ],
        answerIndex: 1,
        explanation: "Quy ước '(N-1 downto 0)' là chuẩn công nghiệp, trong đó bit N-1 luôn là bit có trọng số cao nhất (MSB) và bit 0 là bit có trọng số thấp nhất (LSB)."
      },
      {
        question: "Ký hiệu 'Z' trong hệ logic 9 giá trị của chuẩn IEEE 1164 biểu thị trạng thái nào?",
        options: [
          "Mức điện áp 0V",
          "Trở kháng cao (High-Impedance / thả nổi chân chip)",
          "Mức điện áp 5V",
          "Xung đột ngắn mạch"
        ],
        answerIndex: 1,
        explanation: "'Z' đại diện cho trạng thái trở kháng cao (High Impedance), tương đương ngắt kết nối vật lý khỏi đường dây điện."
      },
      {
        question: "Toán tử nào trong VHDL được dùng để ghép nối hai chuỗi vector hoặc ghép bit vào vector?",
        options: [
          "+",
          "&",
          "and",
          "concat"
        ],
        answerIndex: 1,
        explanation: "Toán tử '&' (ampersand) là toán tử ghép nối chuỗi (concatenation) trong VHDL. Ví dụ: '0' & \"111\" tạo ra vector 4-bit \"0111\"."
      }
    ],

    summary: [
      "`std_logic` chuẩn IEEE 1164 có 9 giá trị phản ánh trung thực vật lý điện tử ('0', '1', 'Z', 'X', 'U').",
      "1 bit đơn dùng dấu nháy đơn `'1'`; Chuỗi vector nhiều bit dùng dấu nháy kép `\"1010\"`.",
      "Bus dữ liệu luôn khai báo theo quy ước `(N-1 downto 0)` (bit lớn đứng trước).",
      "Trích xuất bit bằng dấu ngoặc đơn `sw(0)`, ghép các bit lại bằng toán tử `&`.",
      "Giá trị `'U'` trên ModelSim nghĩa là tín hiệu chưa được khởi tạo hoặc chưa có xung Reset."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW2", "SW3"],
      activeOutputs: ["LEDR0", "LEDR1", "LEDR2", "LEDR3"],
      logicEvaluator: function(inputs) {
        // Đảo toàn bộ 4 bit: led_bus <= not sw_bus
        return {
          LEDR0: inputs.SW0 ? 0 : 1,
          LEDR1: inputs.SW1 ? 0 : 1,
          LEDR2: inputs.SW2 ? 0 : 1,
          LEDR3: inputs.SW3 ? 0 : 1
        };
      }
    }
  },

  // ========================================================================
  // BÀI 2.4
  // ========================================================================
  {
    id: "ch2-b4",
    chapterId: "ch2",
    order: 4,
    title: "Số học trong VHDL: Chuẩn numeric_std vs Sai lầm khi dùng std_logic_arith",
    subtitle: "Nói KHÔNG với thư viện trôi nổi: Tại sao std_logic_vector không thể tự cộng trừ trực tiếp?",
    badge: "Số học vi mạch",
    estimatedMinutes: 25,
    hardwareFocus: ["Thư viện IEEE.NUMERIC_STD", "Kiểu unsigned/signed"],

    objectives: [
      "Hiểu lý do tại sao kiểu `std_logic_vector` thuần túy KHÔNG mang ý nghĩa số học (chỉ là bó dây điện).",
      "Nắm vững 2 kiểu dữ liệu số học chuẩn của IEEE: `unsigned` (số không dấu) và `signed` (số có dấu bù 2).",
      "Thành thạo kỹ thuật ép kiểu (Type Casting) qua lại giữa `std_logic_vector`, `unsigned/signed` và `integer`.",
      "Tuyệt đối bài trừ việc sử dụng các thư viện lỗi thời của hãng Synopsys (`std_logic_arith`, `std_logic_unsigned`)."
    ],

    theory: {
      why: "Trong C, bạn khai báo `int a, b; a = b + 1;` rất dễ dàng. Nhưng trong VHDL, nếu bạn viết `sw + 1` với `sw` là `std_logic_vector`, Quartus sẽ lập tức báo lỗi! Tại sao? Bởi vì `std_logic_vector` chỉ là một bó gồm nhiều sợi dây điện vật lý. Trình biên dịch không thể tự đoán chuỗi `\"1111\"` là số 15 không dấu hay là số -1 có dấu bù 2! Muốn làm toán, bạn phải chỉ định rõ ràng kiểu số học.",
      how: "Chuẩn quốc tế IEEE ban hành thư viện chính thức: `use IEEE.NUMERIC_STD.ALL;`.\nThư viện này cung cấp 2 kiểu số học chuẩn xác:\n1. `unsigned(N-1 downto 0)`: Đại diện cho số nguyên dương (0 đến 2^N - 1).\n2. `signed(N-1 downto 0)`: Đại diện cho số nguyên có dấu theo chuẩn bù 2 (-2^(N-1) đến +2^(N-1) - 1).\n\nQuy trình làm toán số học chuẩn công nghiệp:\n**std_logic_vector** (từ chân chip vào) $\\rightarrow$ Ép kiểu sang **unsigned** $\\rightarrow$ Thực hiện phép toán `+`, `-`, `*` $\\rightarrow$ Ép kiểu ngược lại sang **std_logic_vector** (để xuất ra chân đèn LED).",
      sections: [
        {
          heading: "1. Tam giác chuyển đổi kiểu dữ liệu kinh điển",
          content: "Hãy học thuộc lòng các hàm chuyển đổi chuẩn mực của `numeric_std`:\n- Từ `std_logic_vector` sang `unsigned`: `unsigned(my_vector)`\n- Từ `unsigned` sang `std_logic_vector`: `std_logic_vector(my_unsigned)`\n- Từ `unsigned` sang `integer`: `to_integer(my_unsigned)`\n- Từ `integer` sang `unsigned`: `to_unsigned(my_integer, số_bit)`\n\nVí dụ: Muốn cộng 1 vào bus `sw` 4-bit và xuất ra `ledr`:\n```vhdl\nledr <= std_logic_vector(unsigned(sw) + 1);\n```",
          callout: {
            type: "danger",
            title: "Cảnh báo bài trừ thư viện Synopsys cũ",
            text: "Trên mạng có rất nhiều tài liệu cũ hướng dẫn dùng `IEEE.STD_LOGIC_ARITH` và `IEEE.STD_LOGIC_UNSIGNED`. ĐÂY LÀ CÁC THƯ VIỆN KHÔNG CHUẨN (Non-standard) của hãng Synopsys từ năm 1990! Chúng gây xung đột hàm và bị cấm hoàn toàn trong thiết kế vi mạch công nghiệp hiện đại."
          }
        },
        {
          heading: "2. Phép nhân và sự bùng nổ độ rộng bit",
          content: "Trong phần cứng, khi nhân 2 số N-bit với nhau, kết quả có thể cần tới **2N bit** để không bị tràn! Ví dụ: Nhân 2 số 4-bit (giá trị cực đại 15 x 15 = 225) cần tới 8 bit (`2^8 = 256`). Thư viện `numeric_std` tự động bắt buộc kết quả của phép nhân phải có độ rộng bằng tổng độ rộng 2 thừa số.",
          callout: {
            type: "tip",
            title: "Quy tắc độ rộng bit",
            text: "Cộng 2 số N-bit: Cần N+1 bit để chứa cờ nhớ.\nNhân 2 số N-bit: Cần 2N bit để chứa kết quả."
          }
        }
      ],
      truthTable: {
        headers: ["Thao tác chuyển đổi", "Cú pháp numeric_std chuẩn", "Ví dụ minh họa"],
        rows: [
          ["Vector -> Unsigned", "unsigned(vector)", "u <= unsigned(sw);"],
          ["Unsigned -> Vector", "std_logic_vector(unsigned)", "led <= std_logic_vector(u);"],
          ["Unsigned -> Integer", "to_integer(unsigned)", "idx <= to_integer(u);"],
          ["Integer -> Unsigned", "to_unsigned(int, bit_width)", "u <= to_unsigned(12, 4); -- \"1100\""],
          ["Cộng thêm hằng số", "u + 1", "sum <= u + 1; -- numeric_std tự ép số 1"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Tam giác chuyển đổi kiểu dữ liệu -->
      <g transform="translate(80, 20)">
        <!-- Khối std_logic_vector -->
        <rect x="180" y="10" width="160" height="40" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="260" y="35" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">std_logic_vector</text>

        <!-- Khối unsigned/signed -->
        <rect x="40" y="130" width="160" height="40" rx="6" fill="#131c31" stroke="#10b981" stroke-width="2"/>
        <text x="120" y="155" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="12" font-weight="bold">unsigned / signed</text>

        <!-- Khối integer -->
        <rect x="320" y="130" width="160" height="40" rx="6" fill="#131c31" stroke="#f59e0b" stroke-width="2"/>
        <text x="400" y="155" text-anchor="middle" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold">integer (Số nguyên)</text>

        <!-- Mũi tên chuyển đổi -->
        <line x1="220" y1="50" x2="140" y2="130" stroke="#10b981" stroke-width="2"/>
        <text x="160" y="85" fill="#10b981" font-family="monospace" font-size="10">unsigned()</text>

        <line x1="160" y1="130" x2="240" y2="50" stroke="#38bdf8" stroke-width="2"/>
        <text x="215" y="95" fill="#38bdf8" font-family="monospace" font-size="10">std_logic_vector()</text>

        <line x1="200" y1="150" x2="320" y2="150" stroke="#f59e0b" stroke-width="2"/>
        <text x="260" y="145" text-anchor="middle" fill="#f59e0b" font-family="monospace" font-size="10">to_integer() / to_unsigned()</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "numeric_demo",
      circuitType: "combinational",
      typeExplanation: "Minh họa mạch cộng số học 4-bit chuẩn mực dùng IEEE.NUMERIC_STD: Chuyển vector sang unsigned để làm toán, sau đó chuyển ngược lại ra vector.",
      code: `--------------------------------------------------------------------------------
-- Tên file: numeric_demo.vhd
-- Chuẩn mực số học VHDL: Sử dụng IEEE.NUMERIC_STD (Không dùng std_logic_arith)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL; -- Bắt buộc cho mọi phép toán số học

entity numeric_demo is
    port (
        sw_a    : in  std_logic_vector(3 downto 0); -- Số hạng A 4-bit (SW3..0)
        sw_b    : in  std_logic_vector(3 downto 0); -- Số hạng B 4-bit (SW7..4)
        sum_out : out std_logic_vector(3 downto 0); -- Tổng 4-bit (LEDR3..0)
        is_zero : out std_logic                     -- Báo tổng bằng 0 (LEDR4)
    );
end entity numeric_demo;

architecture rtl of numeric_demo is
    -- Tín hiệu số học kiểu unsigned để tính toán
    signal u_a, u_b, u_sum : unsigned(3 downto 0);
begin
    -- 1. Ép kiểu từ std_logic_vector sang unsigned
    u_a <= unsigned(sw_a);
    u_b <= unsigned(sw_b);

    -- 2. Thực hiện phép toán số học trên phần cứng
    u_sum <= u_a + u_b;

    -- 3. Ép kiểu kết quả ngược lại sang std_logic_vector để xuất ra chân đèn LED
    sum_out <= std_logic_vector(u_sum);

    -- 4. So sánh số học: Kiểm tra tổng có bằng 0 hay không
    is_zero <= '1' when u_sum = 0 else '0';
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_numeric_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra phép cộng số học numeric_std
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity tb_numeric_demo is
end entity tb_numeric_demo;

architecture sim of tb_numeric_demo is
    signal a, b, s : std_logic_vector(3 downto 0);
    signal z       : std_logic;
begin
    uut: entity work.numeric_demo
        port map ( sw_a => a, sw_b => b, sum_out => s, is_zero => z );

    stim: process
    begin
        -- 5 + 3 = 8
        a <= std_logic_vector(to_unsigned(5, 4));
        b <= std_logic_vector(to_unsigned(3, 4));
        wait for 20 ns;
        assert s = "1000" report "Lỗi phép cộng!" severity error;

        -- 0 + 0 = 0 -> z = 1
        a <= "0000"; b <= "0000"; wait for 20 ns;
        assert z = '1' report "Lỗi cờ zero!" severity error;
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: Đổi Radix của tín hiệu a, b, s sang Unsigned để đọc kết quả số thập phân 5 + 3 = 8."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file numeric_demo.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: sw_a nối SW[3:0], sw_b nối SW[7:4], sum_out nối LEDR[3:0], is_zero nối LEDR[4].",
        "4. Biên dịch và nạp lên kit DE2-115."
      ],
      pinAssignments: [
        { signal: "sw_a[0]", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "sw_b[0]", pin: "PIN_AB27", ioStandard: "2.5 V", note: "SW4" },
        { signal: "sum_out[0]", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" },
        { signal: "is_zero", pin: "PIN_F18", ioStandard: "2.5 V", note: "LEDR4" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to sw_a[0]\nset_location_assignment PIN_AB27 -to sw_b[0]\nset_location_assignment PIN_G19 -to sum_out[0]\nset_location_assignment PIN_F18 -to is_zero`
    },

    commonErrors: [
      {
        error: "Error (10327): Can't determine definition of operator \"+\" -- found 0 possible definitions",
        cause: "Cố tình cộng hai std_logic_vector mà chưa nạp thư viện numeric_std hoặc chưa ép kiểu sang unsigned.",
        fix: "Thêm `use IEEE.NUMERIC_STD.ALL;` và ép kiểu: `unsigned(a) + unsigned(b)`."
      },
      {
        error: "Khai báo cả IEEE.STD_LOGIC_ARITH và IEEE.NUMERIC_STD trong cùng một file",
        cause: "Xung đột định nghĩa kiểu signed/unsigned giữa 2 thư viện khác nhau.",
        fix: "Xóa bỏ hoàn toàn dòng khai báo std_logic_arith."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo bộ đếm tăng 1 giá trị công tắc",
        prompt: "Viết biểu thức gán ra `ledr <= sw + 1;` chuẩn theo `numeric_std`.",
        hint: "Ép sw sang unsigned, cộng 1 rồi ép ngược lại std_logic_vector.",
        solution: "ledr <= std_logic_vector(unsigned(sw) + 1);"
      },
      {
        level: "Vận dụng",
        title: "Bộ trừ 4-bit phát hiện số âm",
        prompt: "Dùng kiểu `signed` để thực hiện phép trừ `diff <= signed(sw_a) - signed(sw_b);` và xuất bit dấu MSB ra đèn LED đỏ.",
        hint: "Bit dấu chính là diff(3). Nếu diff(3) = '1' thì kết quả là số âm.",
        solution: "signal diff : signed(3 downto 0);\nbegin\n  diff <= signed(sw_a) - signed(sw_b);\n  is_negative <= diff(3);"
      },
      {
        level: "Thử thách",
        title: "Giải thích hàm to_unsigned",
        prompt: "Trong cú pháp `to_unsigned(15, 6)`, số 15 là gì và số 6 là gì? Kết quả chuỗi bit trả về là gì?",
        hint: "Số đầu là giá trị nguyên cần đổi, số sau là độ rộng bit mong muốn.",
        solution: "Số 15 là giá trị nguyên (thập phân), số 6 là độ rộng 6 bit. Kết quả trả về là chuỗi 6-bit unsigned: \"001111\"."
      }
    ],

    quiz: [
      {
        question: "Tại sao kiểu `std_logic_vector` không thể tự thực hiện phép cộng `+` trực tiếp trong VHDL chuẩn?",
        options: [
          "Vì FPGA không thể tính toán số học",
          "Vì std_logic_vector chỉ là bó dây dẫn thuần túy, không định nghĩa rõ là số có dấu hay không dấu",
          "Vì ngôn ngữ VHDL chưa hỗ trợ phép cộng",
          "Vì Quartus bị lỗi"
        ],
        answerIndex: 1,
        explanation: "std_logic_vector không chứa ngữ nghĩa số học. Cùng chuỗi '1111' có thể là 15 (nếu là số không dấu) hoặc là -1 (nếu là số bù 2), do đó trình biên dịch bắt buộc lập trình viên phải chọn rõ kiểu unsigned hoặc signed."
      },
      {
        question: "Thư viện nào là chuẩn quốc tế chính thức của IEEE dùng cho số học trong VHDL?",
        options: [
          "IEEE.STD_LOGIC_ARITH",
          "IEEE.NUMERIC_STD",
          "IEEE.STD_LOGIC_UNSIGNED",
          "IEEE.MATH_REAL"
        ],
        answerIndex: 1,
        explanation: "IEEE.NUMERIC_STD là thư viện chuẩn duy nhất được tổ chức IEEE phê duyệt chính thức cho thiết kế phần cứng số học."
      },
      {
        question: "Hàm nào dùng để chuyển đổi một số nguyên (integer) sang kiểu unsigned 8-bit trong numeric_std?",
        options: [
          "to_unsigned(giá_trị, 8)",
          "cast_unsigned(giá_trị)",
          "unsigned(giá_trị)",
          "int_to_vector(giá_trị, 8)"
        ],
        answerIndex: 0,
        explanation: "Cú pháp chuẩn của hàm là to_unsigned(integer_value, bit_width), bắt buộc phải có tham số độ rộng bit."
      },
      {
        question: "Khi nhân hai số nguyên không dấu kiểu unsigned 4-bit với nhau, kết quả trả về cần một vector có độ rộng tối thiểu bao nhiêu bit để không bị tràn?",
        options: [
          "4 bit",
          "5 bit",
          "8 bit",
          "16 bit"
        ],
        answerIndex: 2,
        explanation: "Phép nhân hai số N-bit luôn cần kết quả có độ rộng là N + N = 2N bit. Với N = 4: 4 + 4 = 8 bit (chứa được giá trị tối đa 15 x 15 = 225)."
      }
    ],

    summary: [
      "`std_logic_vector` là bó dây điện; muốn làm toán phải dùng `unsigned` (không dấu) hoặc `signed` (có dấu).",
      "Luôn luôn nạp `use IEEE.NUMERIC_STD.ALL;` và nói KHÔNG với `std_logic_arith` lỗi thời.",
      "Công thức ép kiểu thần thánh: `vector -> unsigned -> tính toán -> vector`.",
      "Hàm chuyển đổi qua lại với integer: `to_integer()` và `to_unsigned(val, size)`.",
      "Phép nhân hai số N-bit luôn sinh ra kết quả có độ rộng 2N bit."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW4", "SW5"],
      activeOutputs: ["LEDR0", "LEDR1", "LEDR2", "LEDR3"],
      logicEvaluator: function(inputs) {
        const valA = (inputs.SW1 << 1) | inputs.SW0; // 2-bit A
        const valB = (inputs.SW5 << 1) | inputs.SW4; // 2-bit B
        const sum = (valA + valB) & 0x0F;
        return {
          LEDR0: (sum & 1) ? 1 : 0,
          LEDR1: (sum & 2) ? 1 : 0,
          LEDR2: (sum & 4) ? 1 : 0,
          LEDR3: (sum & 8) ? 1 : 0
        };
      }
    }
  },

  // ========================================================================
  // BÀI 2.5
  // ========================================================================
  {
    id: "ch2-b5",
    chapterId: "ch2",
    order: 5,
    title: "Phân biệt Signal, Variable và Constant: Bản chất bước trễ Delta",
    subtitle: "Dây dẫn vật lý cập nhật sau bước delta vs Biến nhớ tạm thời cập nhật tức thì",
    badge: "Tín hiệu & Biến số",
    estimatedMinutes: 25,
    hardwareFocus: ["Bước trễ Delta Delay", "Toán tử <= vs :="],

    objectives: [
      "Phân biệt rạch ròi bản chất vật lý giữa Tín hiệu (`signal`), Biến (`variable`) và Hằng số (`constant`).",
      "Hiểu khái niệm bước trễ Delta (Delta Delay) và tại sao `signal` chỉ cập nhật giá trị ở cuối chu kỳ mô phỏng.",
      "Nắm vững cú pháp gán: Mũi tên `<=` dùng cho `signal`, Dấu hai chấm bằng `:=` dùng cho `variable`.",
      "Biết phạm vi khai báo: `signal` khai báo trong architecture; `variable` CHỈ ĐƯỢC khai báo bên trong `process`."
    ],

    theory: {
      why: "Đây là một trong những hố sâu ngăn cách lớn nhất giữa lập trình phần mềm và phần cứng! Trong C, nếu bạn viết `x = 1; y = x;` thì ngay lập tức `y` nhận giá trị 1. Nhưng trong VHDL, nếu bạn viết `x <= '1'; y <= x;` (với x, y là signal), tại thời điểm đó `y` vẫn nhận giá trị CŨ của `x`! Nếu không hiểu bước trễ delta, bạn sẽ viết code tuần tự bị sai logic hoàn toàn.",
      how: "- **Signal (Tín hiệu):** Đại diện cho **dây dẫn vật lý** hoặc **ngõ ra của flip-flop**. Phép gán dùng toán tử `<=`. Giá trị KHÔNG cập nhật ngay lập tức mà phải chờ một khoảng thời gian trễ vô cùng nhỏ gọi là **bước trễ delta (Delta Delay)**.\n- **Variable (Biến):** Đại diện cho **bộ nhớ tạm thời** của trình biên dịch (như biến trong C). Phép gán dùng toán tử `:=`. Giá trị cập nhật **TỨC THÌ (Zero delay)**. Biến chỉ được phép khai báo và sử dụng bên trong khối `process`.\n- **Constant (Hằng số):** Đại diện cho các giá trị cố định, dùng toán tử `:=` khi khai báo để giúp code dễ đọc (ví dụ: hằng số tần số thạch anh 50,000,000).",
      sections: [
        {
          heading: "1. Thí nghiệm bước trễ Delta kinh điển",
          content: "Hãy quan sát sự khác biệt khi đặt trong một process kích hoạt theo clock:\n\n**Trường hợp dùng Signal (<=):**\n```vhdl\na <= '1';\nb <= a; -- Lúc này 'a' CHƯA kịp cập nhật, nên b nhận giá trị CŨ của a!\n```\nKết quả phần cứng sinh ra: **2 Flip-Flop mắc nối tiếp** tạo thành thanh ghi dịch!\n\n**Trường hợp dùng Variable (:=):**\n```vhdl\nv_a := '1';\nv_b := v_a; -- v_b nhận ngay giá trị '1' tức thì!\n```\nKết quả phần cứng sinh ra: **Dây nối tắt thẳng** từ '1' vào v_b, không tạo thêm flip-flop.",
          callout: {
            type: "warning",
            title: "Khuyên dùng cho người mới bắt đầu",
            text: "Để tư duy phần cứng chuẩn xác nhất: Hãy sử dụng 100% `signal` cho mạch điện! Chỉ dùng `variable` khi thực sự cần các biến đếm vòng lặp nội bộ trong process."
          }
        },
        {
          heading: "2. Khai báo Hằng số (Constant)",
          content: "Thay vì viết các con số 'ma thuật' (magic numbers) rải rác trong code, hãy dùng hằng số:\n```vhdl\nconstant CLK_FREQ : integer := 50000000; -- 50 MHz cho kit DE2-115\nconstant BUS_WIDTH : integer := 18;       -- 18 công tắc SW\n```\nKhi cần đổi tần số, bạn chỉ cần sửa 1 dòng duy nhất ở đầu file.",
          callout: {
            type: "info",
            title: "Tối ưu hóa tổng hợp",
            text: "Bộ tổng hợp Quartus sẽ tự động tính toán các biểu thức hằng số trước khi tổng hợp, không tốn thêm bất kỳ cổng logic nào trên FPGA."
          }
        }
      ],
      truthTable: {
        headers: ["Tiêu chí", "Signal (Tín hiệu)", "Variable (Biến)", "Constant (Hằng số)"],
        rows: [
          ["Phạm vi khai báo", "Trong Architecture (trước begin)", "CHỈ trong Process / Subprogram", "Trong Architecture hoặc Package"],
          ["Toán tử gán", "<= (Signal assignment)", ":= (Variable assignment)", ":= (Khởi tạo giá trị)"],
          ["Thời điểm cập nhật", "Sau bước trễ Delta (cuối chu kỳ)", "Tức thì (Zero simulation time)", "Không đổi"],
          ["Bản chất phần cứng", "Dây dẫn vật lý hoặc Flip-Flop", "Đường dây tạm thời / Biến logic", "Dây nối lên VCC (1) hoặc GND (0)"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Minh họa Signal tạo thanh ghi dịch vs Variable gán tắt -->
      <g transform="translate(40, 30)">
        <!-- Bên trái: Dùng Signal <= -->
        <rect x="0" y="10" width="260" height="150" rx="8" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="130" y="35" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">DÙNG SIGNAL (&lt;=)</text>
        <!-- 2 Flip-flop mắc nối tiếp -->
        <rect x="30" y="60" width="50" height="60" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="55" y="95" text-anchor="middle" fill="#fff" font-size="11">FF 1</text>
        <line x1="80" y1="90" x2="150" y2="90" class="wire"/>
        <rect x="150" y="60" width="50" height="60" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="175" y="95" text-anchor="middle" fill="#fff" font-size="11">FF 2</text>
        <line x1="200" y1="90" x2="240" y2="90" class="wire"/>
        <text x="130" y="145" text-anchor="middle" fill="#94a3b8" font-size="10">Tạo chuỗi thanh ghi dịch 2 tầng</text>

        <!-- Bên phải: Dùng Variable := -->
        <rect x="300" y="10" width="260" height="150" rx="8" fill="#131c31" stroke="#10b981" stroke-width="2"/>
        <text x="430" y="35" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="12" font-weight="bold">DÙNG VARIABLE (:=)</text>
        <line x1="330" y1="90" x2="520" y2="90" stroke="#10b981" stroke-width="3"/>
        <circle cx="430" cy="90" r="4" fill="#10b981"/>
        <text x="430" y="75" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="11">Dây nối tắt trực tiếp</text>
        <text x="430" y="145" text-anchor="middle" fill="#94a3b8" font-size="10">Cập nhật tức thì, không tốn FF</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "signal_vs_var",
      circuitType: "combinational",
      typeExplanation: "So sánh trực tiếp kết quả phép tính giữa tín hiệu signal và biến variable trong cùng một khối xử lý.",
      code: `--------------------------------------------------------------------------------
-- Tên file: signal_vs_var.vhd
-- Minh họa sự khác biệt giữa Signal và Variable
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity signal_vs_var is
    port (
        sw_in    : in  std_logic; -- Ngõ vào thử nghiệm (SW0)
        out_sig  : out std_logic; -- Kết quả từ signal (LEDR0)
        out_var  : out std_logic  -- Kết quả từ variable (LEDR1)
    );
end entity signal_vs_var;

architecture rtl of signal_vs_var is
    -- KHAI BÁO SIGNAL: Nằm trước begin của architecture
    signal s_temp : std_logic := '0';
    
    -- KHAI BÁO HẰNG SỐ CONSTANT
    constant FIXED_ONE : std_logic := '1';
begin
    -- Khối process mô phỏng
    process(sw_in)
        -- KHAI BÁO VARIABLE: Bắt buộc nằm trước begin của process!
        variable v_temp : std_logic := '0';
    begin
        -- 1. Thao tác với Variable (Cập nhật TỨC THÌ)
        v_temp  := sw_in;
        out_var <= v_temp; -- out_var nhận ngay giá trị mới của sw_in

        -- 2. Thao tác với Signal (Cập nhật sau DELTA DELAY)
        s_temp  <= sw_in;
        out_sig <= s_temp; -- Ở mạch tổ hợp, sau bước delta out_sig cũng bằng s_temp
    end process;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_signal_vs_var",
      code: `--------------------------------------------------------------------------------
-- Testbench quan sát thời điểm cập nhật delta
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_signal_vs_var is
end entity tb_signal_vs_var;

architecture sim of tb_signal_vs_var is
    signal sw : std_logic := '0';
    signal os, ov : std_logic;
begin
    uut: entity work.signal_vs_var
        port map ( sw_in => sw, out_sig => os, out_var => ov );

    stim: process
    begin
        wait for 20 ns;
        sw <= '1'; wait for 20 ns;
        sw <= '0'; wait for 20 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim, phóng to tại mốc 20 ns để quan sát bước delta cập nhật của tín hiệu."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file signal_vs_var.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: sw_in = PIN_AB28, out_sig = PIN_G19, out_var = PIN_F19.",
        "4. Mở Tools -> Netlist Viewers -> RTL Viewer để xem mạch tổng hợp thực tế."
      ],
      pinAssignments: [
        { signal: "sw_in", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "out_sig", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" },
        { signal: "out_var", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to sw_in\nset_location_assignment PIN_G19 -to out_sig\nset_location_assignment PIN_F19 -to out_var`
    },

    commonErrors: [
      {
        error: "Error (10482): VHDL error: object 'v_temp' is used but not declared",
        cause: "Khai báo variable ở ngoài process (trong architecture).",
        fix: "Variable chỉ được phép khai báo bên trong khối process (giữa process và begin)."
      },
      {
        error: "Dùng nhầm toán tử: gán signal bằng := hoặc gán variable bằng <=",
        cause: "Signal bắt buộc dùng mũi tên `<=`; Variable bắt buộc dùng hai chấm bằng `:=`.",
        fix: "Sửa lại đúng cú pháp toán tử tương ứng."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Khai báo hằng số chu kỳ xung nhịp",
        prompt: "Viết cú pháp khai báo hằng số `CLK_PERIOD` kiểu `time` có giá trị là 20 ns (tương ứng 50 MHz của DE2-115).",
        hint: "Dùng constant tên : kiểu := giá trị;",
        solution: "constant CLK_PERIOD : time := 20 ns;"
      },
      {
        level: "Vận dụng",
        title: "Dự đoán giá trị sau 2 phép gán signal",
        prompt: "Cho signal s khởi tạo = '0'. Trong process có xung clock chạy 2 dòng: s <= '1'; s <= '0';. Cuối chu kỳ clock s sẽ nhận giá trị gì?",
        hint: "Signal cập nhật sau cùng: dòng gán cuối cùng trong cùng 1 process sẽ ghi đè lịch trình delta.",
        solution: "s sẽ nhận giá trị '0' vì câu lệnh gán sau cùng ghi đè lên kế hoạch cập nhật của câu lệnh trước."
      },
      {
        level: "Thử thách",
        title: "Tại sao không nên lạm dụng variable trong thiết kế phần cứng?",
        prompt: "Nêu 2 lý do tại sao kỹ sư FPGA thường hạn chế dùng variable và ưu tiên dùng signal.",
        hint: "Khó debug dạng sóng trên ModelSim và dễ tạo ra lỗi suy diễn mạch không mong muốn.",
        solution: "1. Variable không lưu lịch sử dạng sóng trên ModelSim (khó debug). 2. Dễ gây ảo giác lập trình tuần tự giống ngôn ngữ C, dẫn đến việc tổng hợp ra mạch phần cứng quá phức tạp hoặc sinh chốt Latch ngoài ý muốn."
      }
    ],

    quiz: [
      {
        question: "Biến (Variable) trong VHDL bắt buộc phải được khai báo ở vị trí nào?",
        options: [
          "Bên ngoài Entity",
          "Bên trong thân Architecture (trước begin)",
          "Bên trong khối Process hoặc Subprogram (trước begin của process)",
          "Ở bất kỳ vị trí nào"
        ],
        answerIndex: 2,
        explanation: "Variable có phạm vi cục bộ (local scope), bắt buộc phải được khai báo giữa từ khóa 'process' và 'begin' của chính process đó."
      },
      {
        question: "Toán tử gán nào sau đây BẮT BUỘC dùng cho Tín hiệu (Signal)?",
        options: [
          ":=",
          "<=",
          "=",
          "=="
        ],
        answerIndex: 1,
        explanation: "Toán tử '<=' là toán tử gán tín hiệu đồng thời, biểu diễn việc gán dữ liệu sau bước trễ delta vào dây dẫn vật lý."
      },
      {
        question: "Khái niệm bước trễ Delta (Delta Delay) trong mô phỏng VHDL có ý nghĩa gì?",
        options: [
          "Một khoảng thời gian trễ bằng đúng 1 giây",
          "Một bước thời gian mô phỏng vô cùng nhỏ (bằng 0 ns) dùng để phân định thứ tự nguyên nhân - kết quả của các sự kiện mạch điện",
          "Thời gian nạp pin cho chip FPGA",
          "Độ trễ do cáp USB-Blaster gây ra"
        ],
        answerIndex: 1,
        explanation: "Bước trễ delta không tiêu tốn thời gian vật lý (0 ns), nhưng nó đóng vai trò cực kỳ quan trọng để bộ máy mô phỏng cập nhật trạng thái mới cho các đường dây tín hiệu."
      },
      {
        question: "Hằng số (Constant) trong VHDL có tiêu tốn tài nguyên khối logic (LE) nào trên chip FPGA không?",
        options: [
          "Có, tốn rất nhiều thanh ghi flip-flop",
          "Không, bộ tổng hợp Quartus sẽ tự động thay thế giá trị hằng số trực tiếp vào mạch",
          "Tùy thuộc vào tốc độ xung clock",
          "Chỉ tốn tài nguyên nếu khai báo kiểu integer"
        ],
        answerIndex: 1,
        explanation: "Hằng số được giải quyết ngay trong giai đoạn tổng hợp (Synthesis), Quartus nối thẳng các đường dây tương ứng lên VCC hoặc GND mà không tốn thêm khối LE nào."
      }
    ],

    summary: [
      "`signal` là dây dẫn/thanh ghi vật lý, dùng toán tử `<=`, cập nhật sau bước trễ delta.",
      "`variable` là biến bộ nhớ tạm trong `process`, dùng toán tử `:=`, cập nhật tức thì 0 ns.",
      "`constant` dùng để định nghĩa các thông số cấu hình tĩnh (tần số clock, độ rộng bus).",
      "Khai báo signal trong architecture; khai báo variable bên trong process.",
      "Ưu tiên sử dụng signal để xây dựng tư duy phần cứng chuẩn mực và dễ quan sát sóng trên ModelSim."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0"],
      activeOutputs: ["LEDR0", "LEDR1"],
      logicEvaluator: function(inputs) {
        return {
          LEDR0: inputs.SW0 ? 1 : 0, // out_sig
          LEDR1: inputs.SW0 ? 1 : 0  // out_var
        };
      }
    }
  },

  // ========================================================================
  // BÀI 2.6
  // ========================================================================
  {
    id: "ch2-b6",
    chapterId: "ch2",
    order: 6,
    title: "Toán tử và Câu lệnh gán đồng thời: <=, when-else, with-select",
    subtitle: "3 phong cách mô tả mạch tổ hợp không cần dùng process trong VHDL",
    badge: "Gán đồng thời",
    estimatedMinutes: 30,
    hardwareFocus: ["when-else (Mux ưu tiên)", "with-select (Mux song song)"],

    objectives: [
      "Thành thạo 3 loại câu lệnh gán đồng thời (Concurrent Statements): Gán đơn, Gán có điều kiện (`when-else`), Gán chọn lọc (`with-select`).",
      "Phân biệt sự khác nhau về phần cứng: `when-else` suy diễn ra mạch MUX có ưu tiên; `with-select` suy diễn ra mạch MUX song song không ưu tiên.",
      "Nắm vững các toán tử số học, logic, quan hệ và ghép chuỗi `&`.",
      "Biết cách viết mệnh đề `others` trong `with-select` để bao phủ đầy đủ các trường hợp logic."
    ],

    theory: {
      why: "Trong VHDL, bạn không cần phải mở khối `process` cồng kềnh mới viết được điều kiện rẽ nhánh! Bên ngoài architecture, VHDL cung cấp 2 vũ khí cực kỳ mạnh mẽ để mô tả mạch tổ hợp: `when-else` (tương đương if-else) và `with-select` (tương đương switch-case). Viết code theo phong cách này vừa ngắn gọn, trực quan, vừa bảo đảm 100% không bao giờ bị lỗi sinh Latch ngoài ý muốn.",
      how: "1. **Gán đồng thời đơn giản (Simple Concurrent Assignment):**\n`y <= a and b;` (Mô tả 1 cổng logic hoặc nối dây).\n\n2. **Gán có điều kiện (Conditional Assignment - when-else):**\n```vhdl\ny <= d0 when sel = \"00\" else\n     d1 when sel = \"01\" else\n     d2;\n```\nPhần cứng sinh ra là một chuỗi các bộ ghép kênh MUX nối tầng, có tính ưu tiên từ trên xuống dưới.\n\n3. **Gán chọn lọc (Selected Assignment - with-select):**\n```vhdl\nwith sel select\n    y <= d0 when \"00\",\n         d1 when \"01\",\n         d2 when others; -- Bắt buộc có others\n```\nPhần cứng sinh ra là bộ MUX song song giải mã trực tiếp, mọi nhánh có độ ưu tiên ngang hàng nhau.",
      sections: [
        {
          heading: "1. So sánh phần cứng: when-else vs with-select",
          content: "- **when-else:** Điều kiện đầu tiên được kiểm tra trước. Nếu điều kiện 1 đúng, mạch bỏ qua các điều kiện sau. Do đó, nó tổng hợp thành cấu trúc MUX bậc thang (Priority Logic). Phù hợp khi các điều kiện ngõ vào có thứ tự ưu tiên (ví dụ: tín hiệu khẩn cấp ngắt trước).\n- **with-select:** Kiểm tra giá trị của một biến chọn duy nhất. Tất cả các trường hợp được giải mã song song cùng lúc, độ trễ truyền lan đến ngõ ra là đồng đều nhau. Rất phù hợp cho bộ giải mã LED 7 thanh hoặc MUX dữ liệu chuẩn.",
          callout: {
            type: "tip",
            title: "Mẹo chọn câu lệnh",
            text: "Nếu là bảng chân trị giải mã lựa chọn -> Hãy dùng `with-select`!\nNếu là điều kiện kiểm tra lồng nhau hoặc so sánh phức tạp -> Hãy dùng `when-else`!"
          }
        },
        {
          heading: "2. Bảng toán tử đầy đủ trong VHDL",
          content: "- **Toán tử logic:** `not`, `and`, `or`, `nand`, `nor`, `xor`, `xnor`.\n- **Toán tử quan hệ (So sánh):** `=`, `/=` (khác), `<`, `<=`, `>`, `>=`.\n- **Toán tử số học (cần numeric_std):** `+`, `-`, `*`, `/`, `abs`.\n- **Toán tử ghép chuỗi:** `&` (ghép bit hoặc vector lại với nhau).\n- **Toán tử dịch bit (numeric_std):** `shift_left(u, n)`, `shift_right(u, n)`.",
          callout: {
            type: "warning",
            title: "Chú ý toán tử khác nhau",
            text: "Trong C, toán tử khác nhau là `!=`. Nhưng trong VHDL, toán tử khác nhau bắt buộc viết là `/=` (dấu gạch chéo đứng trước dấu bằng)!"
          }
        }
      ],
      truthTable: {
        headers: ["Câu lệnh", "Cấu trúc phần cứng sinh ra", "Đặc tính ưu tiên", "Mệnh đề bắt buộc kết thúc"],
        rows: [
          ["a <= b;", "Dây dẫn nối trực tiếp hoặc 1 cổng logic", "Không có ưu tiên", "Dấu chấm phẩy ;"],
          ["when-else", "Bộ MUX bậc thang ghép nối tiếp", "Có thứ tự ưu tiên từ trên xuống", "Nhánh else cuối cùng"],
          ["with-select", "Bộ MUX giải mã song song", "Độ trễ cân bằng, không ưu tiên", "Nhánh 'when others'"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Minh họa MUX bậc thang (when-else) vs MUX song song (with-select) -->
      <g transform="translate(30, 20)">
        <!-- when-else Mux cascade -->
        <rect x="0" y="10" width="270" height="160" rx="8" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="135" y="35" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">WHEN-ELSE: MUX BẬC THANG</text>
        <polygon points="50,55 90,65 90,115 50,125" class="gate-body"/>
        <polygon points="150,75 190,85 190,135 150,145" class="gate-body"/>
        <line x1="90" y1="90" x2="150" y2="100" class="wire"/>
        <line x1="190" y1="110" x2="250" y2="110" class="wire"/>
        <text x="135" y="155" text-anchor="middle" fill="#94a3b8" font-size="10">Có độ trễ tích lũy theo bậc ưu tiên</text>

        <!-- with-select Parallel Mux -->
        <rect x="310" y="10" width="270" height="160" rx="8" fill="#131c31" stroke="#10b981" stroke-width="2"/>
        <text x="445" y="35" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="12" font-weight="bold">WITH-SELECT: MUX SONG SONG</text>
        <polygon points="390,55 450,70 450,140 390,155" class="gate-body"/>
        <line x1="340" y1="75" x2="390" y2="75" class="wire"/>
        <line x1="340" y1="105" x2="390" y2="105" class="wire"/>
        <line x1="340" y1="135" x2="390" y2="135" class="wire"/>
        <line x1="450" y1="105" x2="520" y2="105" class="wire"/>
        <text x="445" y="155" text-anchor="middle" fill="#94a3b8" font-size="10">Độ trễ đồng đều cho mọi ngõ vào</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "mux_styles_demo",
      circuitType: "combinational",
      typeExplanation: "Minh họa cả 2 phong cách gán đồng thời: when-else và with-select trên cùng 1 mạch chọn kênh 4 sang 1.",
      code: `--------------------------------------------------------------------------------
-- Tên file: mux_styles_demo.vhd
-- So sánh câu lệnh when-else và with-select
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity mux_styles_demo is
    port (
        d_in     : in  std_logic_vector(3 downto 0); -- 4 đường dữ liệu vào (SW3..0)
        sel      : in  std_logic_vector(1 downto 0); -- 2 công tắc chọn kênh (SW17..16)
        out_when : out std_logic;                     -- Ngõ ra dùng when-else (LEDR0)
        out_with : out std_logic                      -- Ngõ ra dùng with-select (LEDR1)
    );
end entity mux_styles_demo;

architecture rtl of mux_styles_demo is
begin
    -- PHONG CÁCH 1: Gán có điều kiện (when-else)
    -- Có tính ưu tiên từ trên xuống
    out_when <= d_in(0) when sel = "00" else
                d_in(1) when sel = "01" else
                d_in(2) when sel = "10" else
                d_in(3); -- Nhánh else cuối cùng

    -- PHONG CÁCH 2: Gán chọn lọc (with-select)
    -- Giải mã song song, bắt buộc có nhánh when others
    with sel select
        out_with <= d_in(0) when "00",
                    d_in(1) when "01",
                    d_in(2) when "10",
                    d_in(3) when "11",
                    '0'     when others; -- Bắt buộc cho chuẩn IEEE
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_mux_styles_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra cả 2 ngõ ra out_when và out_with
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_mux_styles_demo is
end entity tb_mux_styles_demo;

architecture sim of tb_mux_styles_demo is
    signal d_tb   : std_logic_vector(3 downto 0) := "1010"; -- d(3)=1, d(2)=0, d(1)=1, d(0)=0
    signal sel_tb : std_logic_vector(1 downto 0) := "00";
    signal ow, owi: std_logic;
begin
    uut: entity work.mux_styles_demo
        port map ( d_in => d_tb, sel => sel_tb, out_when => ow, out_with => owi );

    stim: process
    begin
        sel_tb <= "00"; wait for 20 ns; -- Chọn d(0) = '0'
        sel_tb <= "01"; wait for 20 ns; -- Chọn d(1) = '1'
        sel_tb <= "10"; wait for 20 ns; -- Chọn d(2) = '0'
        sel_tb <= "11"; wait for 20 ns; -- Chọn d(3) = '1'
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: Cả 2 dạng sóng ow và owi đều chuyển mức trùng khớp 100% theo kênh sel_tb được chọn."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file mux_styles_demo.vhd trong Quartus 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân: d_in[3:0] nối SW[3:0], sel[1:0] nối SW[17:16], out_when nối LEDR[0], out_with nối LEDR[1].",
        "4. Mở Tools -> Netlist Viewers -> RTL Viewer để quan sát sự khác nhau giữa 2 cấu trúc MUX."
      ],
      pinAssignments: [
        { signal: "d_in[0]", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0 (Kênh D0)" },
        { signal: "d_in[1]", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1 (Kênh D1)" },
        { signal: "d_in[2]", pin: "PIN_AC27", ioStandard: "2.5 V", note: "SW2 (Kênh D2)" },
        { signal: "d_in[3]", pin: "PIN_AD27", ioStandard: "2.5 V", note: "SW3 (Kênh D3)" },
        { signal: "sel[0]", pin: "PIN_Y24", ioStandard: "2.5 V", note: "SW16 (Bit chọn 0)" },
        { signal: "sel[1]", pin: "PIN_Y23", ioStandard: "2.5 V", note: "SW17 (Bit chọn 1)" },
        { signal: "out_when", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" },
        { signal: "out_with", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to d_in[0]\nset_location_assignment PIN_AC28 -to d_in[1]\nset_location_assignment PIN_AC27 -to d_in[2]\nset_location_assignment PIN_AD27 -to d_in[3]\nset_location_assignment PIN_Y24 -to sel[0]\nset_location_assignment PIN_Y23 -to sel[1]\nset_location_assignment PIN_G19 -to out_when\nset_location_assignment PIN_F19 -to out_with`
    },

    commonErrors: [
      {
        error: "Error (10500): VHDL syntax error ... near text 'others'",
        cause: "Quên nhánh 'when others' trong câu lệnh with-select.",
        fix: "Trong with-select, bắt buộc phải có nhánh 'when others =>' để bao phủ tất cả 9 trạng thái của std_logic."
      },
      {
        error: "Viết toán tử khác nhau là '!=' thay vì '/='",
        cause: "Thói quen từ ngôn ngữ C/C++. Trong VHDL toán tử khác nhau là /=.",
        fix: "Đổi '!=' thành '/='."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo mạch MUX 2 sang 1 bằng when-else",
        prompt: "Viết câu lệnh gán đồng thời nối ngõ vào a ra y khi sel = '0', ngược lại nối b ra y.",
        hint: "y <= a when sel = '0' else b;",
        solution: "y <= a when sel = '0' else b;"
      },
      {
        level: "Vận dụng",
        title: "Mạch giải mã 2 sang 4 bằng with-select",
        prompt: "Cho sel 2-bit, viết lệnh with-select để xuất ra bus 4-bit `y` có bit tương ứng bằng '1' (Active-High 1-out-of-4 decoder).",
        hint: "with sel select y <= \"0001\" when \"00\", \"0010\" when \"01\", \"0100\" when \"10\", \"1000\" when \"11\", \"0000\" when others;",
        solution: "with sel select\n  y <= \"0001\" when \"00\",\n       \"0010\" when \"01\",\n       \"0100\" when \"10\",\n       \"1000\" when \"11\",\n       \"0000\" when others;"
      },
      {
        level: "Thử thách",
        title: "Tại sao with-select không cho phép dùng toán tử quan hệ phức tạp?",
        prompt: "Tại sao trong with-select ta chỉ có thể chọn giá trị cụ thể (như when \"00\") mà không thể viết điều kiện kiểu `when a > b`?",
        hint: "with-select hoạt động theo nguyên lý bảng tra cứu giá trị đơn của 1 tín hiệu nguồn duy nhất.",
        solution: "with-select được thiết kế để ánh xạ trực tiếp bảng giá trị tĩnh của một biểu thức nguồn sang các ngõ ra. Nếu cần so sánh nhiều biểu thức động phức tạp, bắt buộc phải dùng câu lệnh when-else."
      }
    ],

    quiz: [
      {
        question: "Cấu trúc phần cứng nào được bộ tổng hợp suy diễn ra khi sử dụng câu lệnh gán có điều kiện 'when-else'?",
        options: [
          "Một chuỗi các bộ ghép kênh MUX mắc nối tầng có tính ưu tiên",
          "Một thanh ghi dịch",
          "Một bộ nhớ RAM",
          "Một khối khóa vòng pha PLL"
        ],
        answerIndex: 0,
        explanation: "when-else đánh giá điều kiện theo thứ tự từ trên xuống dưới, do đó nó tổng hợp thành chuỗi MUX bậc thang có tính ưu tiên (Priority Multiplexer)."
      },
      {
        question: "Trong câu lệnh gán chọn lọc 'with-select', nhánh nào là BẮT BUỘC phải có ở cuối cùng?",
        options: [
          "when default",
          "when others",
          "else",
          "when all"
        ],
        answerIndex: 1,
        explanation: "Chuẩn VHDL yêu cầu câu lệnh with-select phải bao phủ toàn bộ không gian giá trị có thể có của biến chọn, do đó bắt buộc phải có nhánh 'when others'."
      },
      {
        question: "Toán tử nào sau đây dùng để biểu diễn phép so sánh 'KHÁC NHAU' (Not Equal) trong VHDL?",
        options: [
          "!=",
          "<>",
          "/=",
          "not="
        ],
        answerIndex: 2,
        explanation: "Toán tử so sánh khác nhau trong VHDL là '/=' (dấu gạch chéo đứng trước dấu bằng)."
      },
      {
        question: "Các câu lệnh gán đồng thời (Concurrent Statements) như when-else và with-select được đặt ở vị trí nào trong file VHDL?",
        options: [
          "Bên trong Entity",
          "Giữa begin và end của Architecture (bên ngoài mọi process)",
          "Bên trong khối process",
          "Trong thư viện IEEE"
        ],
        answerIndex: 1,
        explanation: "Các câu lệnh gán đồng thời nằm trực tiếp trong thân của Architecture (giữa begin và end), hoạt động song song độc lập mà không cần đặt trong process."
      }
    ],

    summary: [
      "3 kiểu gán đồng thời: Gán đơn thuần, Gán có điều kiện (`when-else`), Gán chọn lọc (`with-select`).",
      "`when-else` suy diễn ra MUX bậc thang có ưu tiên; `with-select` suy diễn ra MUX song song cân bằng độ trễ.",
      "Trong `with-select`, bắt buộc luôn có nhánh `when others`.",
      "Toán tử so sánh khác nhau trong VHDL là `/=` (không phải `!=`).",
      "Gán đồng thời là công cụ hoàn hảo để viết mạch tổ hợp ngắn gọn, trực quan và không bao giờ sinh Latch."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW2", "SW3", "SW16", "SW17"],
      activeOutputs: ["LEDR0", "LEDR1"],
      logicEvaluator: function(inputs) {
        // Mux 4-1 chọn theo SW17..16
        const selVal = (inputs.SW17 << 1) | inputs.SW16;
        const dArray = [inputs.SW0, inputs.SW1, inputs.SW2, inputs.SW3];
        const selectedBit = dArray[selVal] || 0;
        return {
          LEDR0: selectedBit,
          LEDR1: selectedBit
        };
      }
    }
  }
];

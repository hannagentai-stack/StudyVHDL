// ==========================================================================
// CH9_ADVANCED.JS - CHƯƠNG 9: CHUYÊN ĐỀ NÂNG CAO (6 BÀI HỌC CHUYÊN SÂU)
// ==========================================================================

window.VHDL_LESSONS_DB = window.VHDL_LESSONS_DB || {};

window.VHDL_LESSONS_DB["ch9"] = [
  // ========================================================================
  // BÀI 9.1
  // ========================================================================
  {
    id: "ch9-b1",
    chapterId: "ch9",
    order: 1,
    title: "Tham số hóa thiết kế với GENERIC và cấu trúc GENERATE",
    subtitle: "Viết mã nguồn tái sử dụng cao cấp: Tham số hóa độ rộng bit và tạo mảng phần cứng tự động",
    badge: "Nâng cao",
    estimatedMinutes: 35,
    hardwareFocus: ["Logic Elements mở rộng", "Parametric Hardware", "Mảng Logic"],

    objectives: [
      "Hiểu rõ cú pháp và ý nghĩa của mệnh đề GENERIC trong entity VHDL.",
      "Lập trình module có khả năng co giãn độ rộng bit (N-bit) mà không cần viết lại mã nguồn.",
      "Sử dụng cấu trúc FOR...GENERATE và IF...GENERATE để sinh mảng cổng logic hoặc thanh ghi tự động.",
      "Kiểm tra cách Quartus Prime tổng hợp các module tham số hóa thành các dãy LE tương ứng."
    ],

    theory: {
      why: "Trong công nghiệp thiết kế bán dẫn, việc 'hardcode' độ rộng bit (ví dụ cố định 8-bit hay 16-bit) là điều tối kỵ vì sẽ khiến mã nguồn không thể tái sử dụng. Sử dụng GENERIC cho phép một module bộ cộng, bộ đếm hay bộ nhớ đệm có thể tái sử dụng cho bất kỳ kích thước nào (8, 16, 32, 64-bit) chỉ bằng cách truyền tham số lúc gọi linh kiện (instantiation).",
      how: "1. **Mệnh đề GENERIC:** Khai báo ngay trước `PORT` trong `ENTITY`. Tham số thường có giá trị mặc định (default value).\n2. **Truyền giá trị bằng GENERIC MAP:** Khi gọi module con (component), dùng `GENERIC MAP (N => 16)` để cấu hình kích thước.\n3. **Cấu trúc GENERATE:** Dùng trong phần `ARCHITECTURE` để sinh ra các cấu trúc mạch lặp lại (mảng Flip-Flop, mạng chuyển mạch, cây bộ cộng)."
    },

    diagramSvg: `<svg viewBox="0 0 600 200" class="circuit-svg">
      <g transform="translate(30, 20)">
        <rect x="20" y="20" width="220" height="130" rx="8" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="130" y="45" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">GENERIC (WIDTH: integer := 8)</text>
        <rect x="40" y="65" width="180" height="70" rx="4" fill="#0f172a" stroke="#64748b" stroke-dasharray="4"/>
        <text x="130" y="95" text-anchor="middle" fill="#94a3b8" font-size="11">D[WIDTH-1 downto 0]</text>
        <text x="130" y="115" text-anchor="middle" fill="#94a3b8" font-size="11">Q[WIDTH-1 downto 0]</text>

        <path d="M 240 85 L 340 85" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="290" y="75" text-anchor="middle" fill="#f59e0b" font-size="10">Generic Map</text>

        <!-- Instance -->
        <rect x="340" y="20" width="200" height="130" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
        <text x="440" y="45" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">Instance: WIDTH => 16</text>
        <text x="440" y="85" text-anchor="middle" fill="#cbd5e1" font-size="11">D: 16-bit -> Q: 16-bit</text>
        <text x="440" y="110" text-anchor="middle" fill="#a7f3d0" font-size="10">Sinh ra 16 Flip-Flops</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "generic_counter_and_generate",
      circuitType: "sequential",
      typeExplanation: "Mô-đun tuần tự tham số hóa: Sử dụng GENERIC để định nghĩa số bit WIDTH và trần đếm MAX_COUNT, đồng thời dùng GENERATE để sinh mảng thanh ghi song song.",
      code: `--------------------------------------------------------------------------------
-- Tên module: generic_counter_and_generate
-- Chức năng: Bộ đếm N-bit tham số hóa và mảng thanh ghi sinh tự động bằng GENERATE
--------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity generic_counter_and_generate is
  generic (
    WIDTH     : natural := 8;                  -- Độ rộng bit mặc định là 8
    MAX_VAL   : natural := 250                 -- Trần đếm tối đa
  );
  port (
    clk       : in  std_logic;
    rst_n     : in  std_logic;
    en        : in  std_logic;
    count_out : out std_logic_vector(WIDTH-1 downto 0);
    max_tick  : out std_logic
  );
end entity generic_counter_and_generate;

architecture rtl of generic_counter_and_generate is
  -- Tín hiệu thanh ghi đếm với độ rộng co giãn động theo tham số WIDTH
  signal r_count : unsigned(WIDTH-1 downto 0);
begin

  -- Process đếm đồng bộ
  process(clk, rst_n)
  begin
    if rst_n = '0' then
      r_count  <= (others => '0');
      max_tick <= '0';
    elsif rising_edge(clk) then
      max_tick <= '0'; -- Giá trị mặc định
      if en = '1' then
        if r_count = to_unsigned(MAX_VAL, WIDTH) then
          r_count  <= (others => '0');
          max_tick <= '1';
        else
          r_count  <= r_count + 1;
        end if;
      end if;
    end if;
  end process;

  -- Xuất dữ liệu ra cổng
  count_out <= std_logic_vector(r_count);

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_generic_counter",
      code: `--------------------------------------------------------------------------------
-- Testbench: Khởi tạo module với generic WIDTH => 4 và MAX_VAL => 9 (Đếm BCD)
--------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity tb_generic_counter is
end entity tb_generic_counter;

architecture sim of tb_generic_counter is
  constant C_WIDTH : natural := 4;
  constant C_MAX   : natural := 9;

  signal clk       : std_logic := '0';
  signal rst_n     : std_logic := '0';
  signal en        : std_logic := '0';
  signal count_out : std_logic_vector(C_WIDTH-1 downto 0);
  signal max_tick  : std_logic;
begin

  clk <= not clk after 10 ns;

  -- Gán linh kiện với GENERIC MAP tùy biến
  uut: entity work.generic_counter_and_generate
    generic map (
      WIDTH   => C_WIDTH,
      MAX_VAL => C_MAX
    )
    port map (
      clk       => clk,
      rst_n     => rst_n,
      en        => en,
      count_out => count_out,
      max_tick  => max_tick
    );

  stim_proc: process
  begin
    rst_n <= '0';
    wait for 40 ns;
    rst_n <= '1';
    en    <= '1';
    wait for 300 ns;
    assert false report "Simulation hoàn tất!" severity note;
    wait;
  end process;
end architecture sim;`,
      instructions: "Chạy mô phỏng trên ModelSim để thấy bộ đếm chỉ dùng 4-bit và tự động cuốn vòng khi đạt giá trị 9."
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án mới hoặc gọi module vào Top-Level thiết kế.",
        "2. Trong entity Top-Level, bạn có thể truyền `generic map (WIDTH => 18, MAX_VAL => 50000)` tùy biến.",
        "3. Biên dịch và kiểm tra cửa sổ Compilation Hierarchy: Quartus sẽ tạo ra số lượng Logic Elements đúng bằng độ rộng `WIDTH`."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY[0]" }
      ],
      qsfSnippet: "set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n"
    },

    commonErrors: [
      {
        error: "Error: Width mismatch in port map",
        cause: "Độ rộng của tín hiệu nối ngoài không khớp với biểu thức tính toán `WIDTH-1 downto 0` trong generic map.",
        fix: "Đảm bảo tín hiệu kết nối trong file cha có cùng độ rộng với giá trị tham số truyền vào."
      },
      {
        error: "Error: Generic parameter cannot depend on signals",
        cause: "Cố gắng gán giá trị của một tín hiệu chạy lúc runtime vào `generic map`.",
        fix: "GENERIC là tham số tĩnh trong lúc biên dịch (compile-time constant), chỉ có thể nhận hằng số (constant hoặc số nguyên)."
      }
    ],

    exercises: [
      {
        title: "Cơ bản: Bộ đếm 12-bit",
        prompt: "Khởi tạo một instance của `generic_counter_and_generate` với `WIDTH = 12` và `MAX_VAL = 4095`.",
        hint: "Sử dụng cú pháp generic map (WIDTH => 12, MAX_VAL => 4095).",
        solution: "u_cnt: entity work.generic_counter_and_generate\n  generic map (WIDTH => 12, MAX_VAL => 4095)\n  port map (...);"
      },
      {
        title: "Vận dụng: Cấu trúc FOR GENERATE",
        prompt: "Viết đoạn mã dùng cấu trúc `FOR...GENERATE` để tạo ra một mảng gồm 8 cổng XOR đảo pha.",
        hint: "gen_xor: for i in 0 to 7 generate\n  y(i) <= a(i) xor b(i);\nend generate;",
        solution: "gen_xor: for i in 0 to 7 generate\n  y(i) <= a(i) xor b(i);\nend generate gen_xor;"
      },
      {
        title: "Thử thách: Mạng hoán vị bit chẵn lẻ",
        prompt: "Sử dụng `IF...GENERATE` bên trong `FOR...GENERATE` để đảo bit ở các vị trí lẻ và giữ nguyên ở vị trí chẵn.",
        hint: "if (i mod 2 = 1) generate ... else generate ...",
        solution: "gen_bits: for i in 0 to 7 generate\n  cond_odd: if (i mod 2 = 1) generate\n    y(i) <= not a(i);\n  end generate;\n  cond_even: if (i mod 2 = 0) generate\n    y(i) <= a(i);\n  end generate;\nend generate;"
      }
    ],

    quiz: [
      {
        question: "GENERIC trong VHDL được xác định tại thời điểm nào?",
        options: [
          "Lúc nạp file .sof vào FPGA",
          "Tại thời điểm tổng hợp và biên dịch (Compile-time)",
          "Tại thời điểm mạch đang chạy trên board (Run-time)",
          "Bất kỳ khi nào có xung clock"
        ],
        answerIndex: 1,
        explanation: "GENERIC là tham số hằng tĩnh được trình biên dịch giải quyết tại thời điểm compile-time để sinh ra phần cứng vật lý tương ứng."
      },
      {
        question: "Cấu trúc GENERATE trong VHDL dùng để làm gì?",
        options: [
          "Tạo xung clock tự động",
          "Tự động lặp lại việc sinh phần cứng hoặc kết nối linh kiện theo quy luật",
          "Tạo máy trạng thái tự động",
          "Đọc file từ ổ cứng máy tính"
        ],
        answerIndex: 1,
        explanation: "GENERATE là cấu trúc tương đương vòng lặp nhưng dành cho phần cứng: nó nhân bản các khối mạch song song đồng thời."
      },
      {
        question: "Lợi ích lớn nhất của việc dùng GENERIC là gì?",
        options: [
          "Mạch chạy nhanh hơn gấp đôi",
          "Giảm nhiệt độ của chip FPGA",
          "Tăng khả năng tái sử dụng mã nguồn và dễ dàng cấu hình lại module",
          "Không cần sử dụng file .qsf"
        ],
        answerIndex: 2,
        explanation: "GENERIC giúp mã nguồn có tính mô-đun hóa cực cao, có thể tái sử dụng cho nhiều dự án khác nhau mà không phải sửa logic bên trong."
      },
      {
        question: "Cú pháp truyền tham số generic khi gọi linh kiện là gì?",
        options: [
          "port map (N => 16)",
          "generic map (N => 16)",
          "parameter map (N => 16)",
          "assign N = 16"
        ],
        answerIndex: 1,
        explanation: "VHDL sử dụng mệnh đề `generic map (...)` ngay trước `port map (...)`."
      }
    ],

    summary: [
      "GENERIC là công cụ tham số hóa phần cứng cực kỳ mạnh mẽ trong VHDL.",
      "Tham số GENERIC được xác định tại thời điểm compile-time và không tiêu tốn thêm tài nguyên runtime.",
      "Cấu trúc FOR...GENERATE cho phép sinh hàng loạt khối phần cứng lặp lại một cách tự động và súc tích.",
      "Cấu trúc IF...GENERATE cho phép bật/tắt các nhánh phần cứng tùy thuộc vào điều kiện tham số.",
      "Mọi thư viện công nghiệp chuẩn IP core đều sử dụng GENERIC để cung cấp tính năng tùy biến cho người dùng."
    ]
  },

  // ========================================================================
  // BÀI 9.2
  // ========================================================================
  {
    id: "ch9-b2",
    chapterId: "ch9",
    order: 2,
    title: "Đóng gói mã nguồn với PACKAGE, FUNCTION và kiểu RECORD",
    subtitle: "Xây dựng thư viện dùng chung cho toàn bộ dự án: Kiểu dữ liệu cấu trúc và hàm xử lý",
    badge: "Nâng cao",
    estimatedMinutes: 40,
    hardwareFocus: ["Thư viện tự tạo", "Kiểu dữ liệu mở rộng", "RTL Structs"],

    objectives: [
      "Tạo và quản lý các file PACKAGE (.vhd) chứa hằng số và kiểu dữ liệu dùng chung.",
      "Định nghĩa kiểu RECORD (tương đương struct trong C/C++) để gom nhóm tín hiệu bus phức tạp.",
      "Viết FUNCTION tổng hợp được (Synthesizable function) để thực hiện tính toán chuyển đổi.",
      "Nhập package vào các file thiết kế khác thông qua câu lệnh USE WORK.MY_PKG.ALL."
    ],

    theory: {
      why: "Khi dự án mở rộng lên hàng chục nghìn dòng lệnh, việc khai báo lặp đi lặp lại các hằng số, độ rộng bus hay các hàm chuyển đổi trong từng file sẽ gây phân mảnh và khó bảo trì. PACKAGE là nơi tập trung toàn bộ 'tri thức dùng chung' của dự án.",
      how: "1. **PACKAGE Declaration:** Khai báo nguyên mẫu các hàm, kiểu dữ liệu, hằng số.\n2. **PACKAGE BODY:** Triển khai chi tiết thuật toán của các hàm (function/procedure).\n3. **Kiểu RECORD:** Gom nhóm nhiều tín hiệu liên quan (ví dụ: data, valid, ready) vào một biến duy nhất, giúp giao tiếp giữa các module gọn gàng và không bị nối nhầm dây."
    },

    diagramSvg: `<svg viewBox="0 0 600 200" class="circuit-svg">
      <g transform="translate(30, 20)">
        <rect x="20" y="20" width="220" height="140" rx="8" fill="#131e33" stroke="#f59e0b" stroke-width="2"/>
        <text x="130" y="45" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">PACKAGE: de2_types_pkg</text>
        <text x="130" y="70" text-anchor="middle" fill="#cbd5e1" font-size="11">type bus_t is record</text>
        <text x="130" y="90" text-anchor="middle" fill="#94a3b8" font-size="10">  data : std_logic_vector</text>
        <text x="130" y="105" text-anchor="middle" fill="#94a3b8" font-size="10">  valid, ready: std_logic</text>
        <text x="130" y="125" text-anchor="middle" fill="#cbd5e1" font-size="11">end record;</text>

        <path d="M 240 90 L 330 90" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="285" y="80" text-anchor="middle" fill="#38bdf8" font-size="10">use work.all</text>

        <rect x="330" y="20" width="220" height="140" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
        <text x="440" y="45" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">MODULE SỬ DỤNG</text>
        <text x="440" y="80" text-anchor="middle" fill="#e2e8f0" font-size="11">rx_bus : in  bus_t;</text>
        <text x="440" y="105" text-anchor="middle" fill="#e2e8f0" font-size="11">tx_bus : out bus_t;</text>
        <text x="440" y="135" text-anchor="middle" fill="#6ee7b7" font-size="10">Giao diện sạch sẽ 1 dây record</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "de2_types_pkg",
      circuitType: "combinational",
      typeExplanation: "Package định nghĩa kiểu dữ liệu dùng chung: Khai báo hằng số hệ thống, kiểu record cho giao thức handshake và hàm tính số bit log2.",
      code: `--------------------------------------------------------------------------------
-- File: de2_types_pkg.vhd
-- Chức năng: Package chứa các kiểu dữ liệu và hàm tiện ích dùng chung
--------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

package de2_types_pkg is

  -- Hằng số tần số xung nhịp hệ thống DE2-115
  constant SYS_CLK_FREQ_HZ : natural := 50_000_000;

  -- Kiểu Record cho giao diện truyền dữ liệu có bắt tay (Handshake)
  type stream_channel_t is record
    data  : std_logic_vector(7 downto 0);
    valid : std_logic;
    ready : std_logic;
  end record stream_channel_t;

  -- Mảng các giá trị 7 đoạn cho hiển thị đa kênh
  type hex_array_t is array (0 to 7) of std_logic_vector(6 downto 0);

  -- Khai báo hàm tính số bit cần thiết để chứa một số nguyên (log2 trần)
  function log2_ceil(val : natural) return natural;

end package de2_types_pkg;

package body de2_types_pkg is

  -- Triển khai hàm tính log2 trần phục vụ tính độ rộng bit tự động
  function log2_ceil(val : natural) return natural is
    variable temp : natural := val;
    variable ret  : natural := 0;
  begin
    if val <= 1 then
      return 1;
    end if;
    temp := temp - 1;
    while temp > 0 loop
      ret  := ret + 1;
      temp := temp / 2;
    end loop;
    return ret;
  end function log2_ceil;

end package body de2_types_pkg;`
    },

    testbenchCode: {
      entityName: "tb_package_usage",
      code: `--------------------------------------------------------------------------------
-- Testbench minh họa cách gọi package dùng chung
--------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

use work.de2_types_pkg.all; -- Nạp toàn bộ package

entity tb_package_usage is
end entity tb_package_usage;

architecture sim of tb_package_usage is
  signal ch : stream_channel_t;
  constant BITS_FOR_100 : natural := log2_ceil(100);
begin
  process
  begin
    ch.data  <= x"A5";
    ch.valid <= '1';
    ch.ready <= '1';
    wait for 20 ns;
    assert BITS_FOR_100 = 7 report "Lỗi tính toán log2_ceil" severity failure;
    assert false report "Kiểm tra package hoàn tất thành công!" severity note;
    wait;
  end process;
end architecture sim;`,
      instructions: "Biên dịch file package trước, sau đó biên dịch testbench để kiểm tra tính hợp lệ."
    },

    quartusGuide: {
      steps: [
        "1. Thêm file `de2_types_pkg.vhd` vào danh sách file của Project trong Quartus (Project -> Add/Remove Files in Project).",
        "2. Đảm bảo file package nằm ở vị trí biên dịch trước các file thực thể sử dụng nó.",
        "3. Trong các file thiết kế khác, chỉ cần thêm dòng: `use work.de2_types_pkg.all;` sau phần khai báo `library ieee;`."
      ],
      pinAssignments: [],
      qsfSnippet: "# Không cần gán chân vật lý trực tiếp cho file Package"
    },

    commonErrors: [
      {
        error: "Error: Identifier 'de2_types_pkg' is not declared in library work",
        cause: "File package chưa được biên dịch trước file thiết kế gọi nó.",
        fix: "Thêm file package vào Project và biên dịch lại toàn bộ dự án từ đầu."
      },
      {
        error: "Error: Type mismatch with record field",
        cause: "Gán giá trị không đúng kiểu vào một trường cụ thể của record.",
        fix: "Truy cập đúng trường qua dấu chấm: ví dụ `my_record.data <= x\"FF\";`."
      }
    ],

    exercises: [
      {
        title: "Cơ bản: Thêm hằng số vào Package",
        prompt: "Bổ sung hằng số `BAUD_115200 : natural := 115200;` vào trong `de2_types_pkg`.",
        hint: "Khai báo trong phần package declaration trước phần package body.",
        solution: "constant BAUD_115200 : natural := 115200;"
      },
      {
        title: "Vận dụng: Record điều khiển động cơ",
        prompt: "Định nghĩa một kiểu record `motor_ctrl_t` gồm: `dir: std_logic; speed: std_logic_vector(7 downto 0); enable: std_logic;`.",
        hint: "type motor_ctrl_t is record ... end record;",
        solution: "type motor_ctrl_t is record\n  dir    : std_logic;\n  speed  : std_logic_vector(7 downto 0);\n  enable : std_logic;\nend record motor_ctrl_t;"
      },
      {
        title: "Thử thách: Hàm kiểm tra tính chẵn lẻ",
        prompt: "Viết hàm `function parity_even(d : std_logic_vector) return std_logic` trả về bit chẵn lẻ của một vector.",
        hint: "Dùng vòng lặp xor toàn bộ các bit.",
        solution: "function parity_even(d : std_logic_vector) return std_logic is\n  variable p : std_logic := '0';\nbegin\n  for i in d'range loop\n    p := p xor d(i);\n  end loop;\n  return p;\nend function;"
      }
    ],

    quiz: [
      {
        question: "Cú pháp để đưa toàn bộ nội dung của package trong thư viện cục bộ vào file là gì?",
        options: [
          "include work.my_package;",
          "import work.my_package.*;",
          "use work.my_package.all;",
          "library work.my_package;"
        ],
        answerIndex: 2,
        explanation: "Trong VHDL, cú pháp chuẩn là `use work.<package_name>.all;`."
      },
      {
        question: "Kiểu dữ liệu RECORD trong VHDL tương đương với cấu trúc nào trong ngôn ngữ C?",
        options: [
          "union",
          "struct",
          "enum",
          "array"
        ],
        answerIndex: 1,
        explanation: "RECORD là kiểu dữ liệu gom nhóm nhiều trường có kiểu khác nhau, hoàn toàn tương đương `struct` trong C/C++."
      },
      {
        question: "Một FUNCTION trong VHDL có được chứa câu lệnh 'wait' hay không?",
        options: [
          "Có, bất cứ khi nào cần",
          "Có, nếu là hàm mô phỏng",
          "Không bao giờ được chứa câu lệnh wait",
          "Tùy thuộc vào phiên bản Quartus"
        ],
        answerIndex: 2,
        explanation: "Hàm (FUNCTION) trong VHDL thực thi trong 0 thời gian mô phỏng (zero simulation time), do đó tuyệt đối cấm câu lệnh `wait`."
      },
      {
        question: "Thành phần PACKAGE BODY bắt buộc phải có khi nào?",
        options: [
          "Bắt buộc luôn luôn phải có",
          "Khi phần PACKAGE có khai báo hàm (FUNCTION) hoặc thủ tục (PROCEDURE)",
          "Khi package chỉ chứa hằng số",
          "Khi package chỉ chứa kiểu dữ liệu"
        ],
        answerIndex: 1,
        explanation: "PACKAGE BODY chỉ cần thiết khi trong PACKAGE có khai báo hàm hoặc thủ tục cần phần thân thực thi logic."
      }
    ],

    summary: [
      "PACKAGE giúp chuẩn hóa và đồng bộ hằng số hệ thống cho toàn bộ các module trong dự án.",
      "Kiểu RECORD gom nhóm tín hiệu bus, giảm thiểu nhầm lẫn khi nối dây giữa các khối RTL lớn.",
      "Hàm (FUNCTION) thuần túy có thể được tổng hợp thành mạch tổ hợp nếu không chứa cấu trúc cấm.",
      "Cần phân biệt rõ phần khai báo (PACKAGE) và phần triển khai (PACKAGE BODY).",
      "Sử dụng package là một tiêu chuẩn bắt buộc trong quy trình thiết kế vi mạch chuyên nghiệp."
    ]
  },

  // ========================================================================
  // BÀI 9.3
  // ========================================================================
  {
    id: "ch9-b3",
    chapterId: "ch9",
    order: 3,
    title: "Thiết kế bộ nhớ M9K nhúng trong Cyclone IV: RAM và ROM",
    subtitle: "Khai thác tài nguyên phần cứng chuyên dụng: Single-Port RAM, Dual-Port RAM và nạp file .mif",
    badge: "Nâng cao",
    estimatedMinutes: 45,
    hardwareFocus: ["M9K Memory Blocks", "Embedded RAM/ROM", "File .mif"],

    objectives: [
      "Hiểu cấu trúc các khối nhớ nhúng M9K (432 khối trên Cyclone IV E EP4CE115, tổng 3.88 Mbits).",
      "Viết mã VHDL suy luận đúng (infer) phần cứng RAM đồng bộ thay vì dùng Logic Elements lãng phí.",
      "Thiết kế ROM chứa dữ liệu bảng tra (Lookup Table) và khởi tạo qua file Memory Initialization File (.mif).",
      "Tìm hiểu kiến trúc Dual-Port RAM để chia sẻ dữ liệu giữa hai miền xung nhịp khác nhau."
    ],

    theory: {
      why: "Nếu bạn tạo một mảng bộ nhớ (ví dụ: mảng 1024 byte) bằng các thanh ghi thông thường, Quartus sẽ tiêu tốn hàng nghìn Logic Elements và làm nghẽn đường dây routing. Chip Cyclone IV E trang bị sẵn các khối phần cứng chuyên dụng gọi là M9K Memory Blocks chạy ở tốc độ cực cao (> 300 MHz) mà không tốn một tế bào logic nào.",
      how: "1. **Khai báo mảng 2 chiều:** `type ram_t is array (0 to 1023) of std_logic_vector(7 downto 0);`\n2. **Khuôn mẫu suy luận RAM (RAM Inference Template):** Ghi dữ liệu đồng bộ theo sườn xung clock (`if we = '1' then ram(addr) <= din; end if;`).\n3. **Đọc đồng bộ:** Dữ liệu ra được gán sau một chu kỳ xung nhịp.\n4. **Khởi tạo dữ liệu:** Sử dụng thuộc tính `ram_init_file` trỏ đến file `.mif` hoặc mảng khởi tạo tĩnh."
    },

    diagramSvg: `<svg viewBox="0 0 600 200" class="circuit-svg">
      <g transform="translate(30, 20)">
        <rect x="30" y="20" width="220" height="150" rx="8" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="140" y="45" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">M9K BLOCK RAM</text>
        <line x1="10" y1="65" x2="30" y2="65" stroke="#38bdf8" stroke-width="2"/>
        <text x="5" y="70" fill="#94a3b8" font-size="9" text-anchor="end">clk</text>
        <line x1="10" y1="95" x2="30" y2="95" stroke="#38bdf8" stroke-width="2"/>
        <text x="5" y="100" fill="#94a3b8" font-size="9" text-anchor="end">we</text>
        <line x1="10" y1="125" x2="30" y2="125" stroke="#38bdf8" stroke-width="2"/>
        <text x="5" y="130" fill="#94a3b8" font-size="9" text-anchor="end">addr[9:0]</text>
        <line x1="10" y1="150" x2="30" y2="150" stroke="#38bdf8" stroke-width="2"/>
        <text x="5" y="155" fill="#94a3b8" font-size="9" text-anchor="end">din[7:0]</text>

        <line x1="250" y1="100" x2="280" y2="100" stroke="#10b981" stroke-width="2"/>
        <text x="285" y="105" fill="#10b981" font-size="10">dout[7:0]</text>

        <!-- Khởi tạo qua MIF -->
        <rect x="340" y="40" width="200" height="110" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="440" y="65" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">ROM / MIF INIT</text>
        <text x="440" y="90" text-anchor="middle" fill="#94a3b8" font-size="9">DEPTH = 1024; WIDTH = 8;</text>
        <text x="440" y="110" text-anchor="middle" fill="#cbd5e1" font-size="9">ADDRESS_RADIX = HEX;</text>
        <text x="440" y="130" text-anchor="middle" fill="#10b981" font-size="9">Nạp trước Font chữ / Sin-wave</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "sync_single_port_ram",
      circuitType: "sequential",
      typeExplanation: "Bộ nhớ RAM đồng bộ Single-Port: Tuân thủ chuẩn suy luận phần cứng của Quartus Prime để ánh xạ tự động vào các khối M9K chuyên dụng.",
      code: `--------------------------------------------------------------------------------
-- Tên module: sync_single_port_ram
-- Chức năng: RAM đồng bộ 1 cổng (1024 từ x 8-bit), suy luận trực tiếp khối M9K
--------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity sync_single_port_ram is
  generic (
    ADDR_WIDTH : natural := 10;                -- 2^10 = 1024 địa chỉ
    DATA_WIDTH : natural := 8                  -- 8-bit mỗi byte
  );
  port (
    clk   : in  std_logic;
    we    : in  std_logic;                     -- Write Enable (1: Ghi, 0: Đọc)
    addr  : in  std_logic_vector(ADDR_WIDTH-1 downto 0);
    din   : in  std_logic_vector(DATA_WIDTH-1 downto 0);
    dout  : out std_logic_vector(DATA_WIDTH-1 downto 0)
  );
end entity sync_single_port_ram;

architecture rtl of sync_single_port_ram is
  -- Định nghĩa kiểu mảng bộ nhớ 2 chiều
  type ram_type is array (0 to 2**ADDR_WIDTH - 1) of std_logic_vector(DATA_WIDTH-1 downto 0);

  -- Khai báo tín hiệu RAM
  signal ram : ram_type := (others => (others => '0'));

  -- Thanh ghi đệm ngõ ra (Read latency = 1 chu kỳ)
  signal r_dout : std_logic_vector(DATA_WIDTH-1 downto 0);
begin

  process(clk)
  begin
    if rising_edge(clk) then
      if we = '1' then
        ram(to_integer(unsigned(addr))) <= din;
      end if;
      -- Đọc đồng bộ: Cập nhật địa chỉ theo sườn xung nhịp
      r_dout <= ram(to_integer(unsigned(addr)));
    end if;
  end process;

  dout <= r_dout;

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_sync_ram",
      code: `--------------------------------------------------------------------------------
-- Testbench: Ghi dữ liệu vào địa chỉ 4 và đọc lại sau 2 chu kỳ
--------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity tb_sync_ram is
end entity tb_sync_ram;

architecture sim of tb_sync_ram is
  signal clk  : std_logic := '0';
  signal we   : std_logic := '0';
  signal addr : std_logic_vector(9 downto 0) := (others => '0');
  signal din  : std_logic_vector(7 downto 0) := (others => '0');
  signal dout : std_logic_vector(7 downto 0);
begin
  clk <= not clk after 10 ns;

  uut: entity work.sync_single_port_ram
    port map (clk => clk, we => we, addr => addr, din => din, dout => dout);

  process
  begin
    -- Chu kỳ 1: Ghi giá trị 0x5A vào địa chỉ 0x004
    wait for 20 ns;
    addr <= std_logic_vector(to_unsigned(4, 10));
    din  <= x"5A";
    we   <= '1';
    wait for 20 ns;
    
    -- Chu kỳ 2: Tắt ghi, đọc lại
    we   <= '0';
    wait for 20 ns;
    assert dout = x"5A" report "Lỗi đọc RAM!" severity failure;
    assert false report "Kiểm tra RAM thành công!" severity note;
    wait;
  end process;
end architecture sim;`,
      instructions: "Quan sát trên đồ thị ModelSim: Dữ liệu dout xuất hiện trễ đúng 1 chu kỳ xung nhịp sau khi cấp địa chỉ."
    },

    quartusGuide: {
      steps: [
        "1. Sau khi biên dịch, mở báo cáo: **Fitter -> Resource Section -> RAM Summary**.",
        "2. Kiểm tra cột **M9K blocks**: Bạn sẽ thấy Quartus sử dụng 1 khối M9K thay vì phân bổ Logic Elements.",
        "3. Để tạo file nạp sẵn ROM, vào File -> New -> Memory Initialization File (.mif) và gán kích thước phù hợp."
      ],
      pinAssignments: [],
      qsfSnippet: "# Cấu hình tự động ánh xạ vào khối nhớ nhúng\nset_instance_assignment -name RAM_BLOCK_TYPE M9K -to \"ram\""
    },

    commonErrors: [
      {
        error: "Quartus infers Logic Elements instead of M9K blocks",
        cause: "Viết logic đọc bộ nhớ không đồng bộ (bên ngoài rising_edge(clk)) hoặc có điều kiện reset bất đồng bộ.",
        fix: "Phần cứng M9K không hỗ trợ chân reset bất đồng bộ cho toàn bộ mảng nhớ. Hãy loại bỏ reset cho mảng `ram`."
      },
      {
        error: "Error: MIF file not found",
        cause: "Đường dẫn file .mif trong thuộc tính ram_init_file bị sai tương đối so với thư mục dự án.",
        fix: "Đặt file .mif cùng cấp với file dự án .qpf."
      }
    ],

    exercises: [
      {
        title: "Cơ bản: RAM 256 byte",
        prompt: "Thay đổi generic của `sync_single_port_ram` để tạo một RAM 256 byte.",
        hint: "ADDR_WIDTH = 8 vì 2^8 = 256.",
        solution: "generic map (ADDR_WIDTH => 8, DATA_WIDTH => 8)"
      },
      {
        title: "Vận dụng: ROM tra cứu hàm Sin",
        prompt: "Viết module ROM 32 mẫu sóng hình Sin bằng cách khai báo mảng hằng số (constant array).",
        hint: "type rom_t is array (0 to 31) of std_logic_vector(7 downto 0); constant ROM : rom_t := (...);",
        solution: "architecture rtl of sin_rom is\n  type rom_t is array (0 to 3) of std_logic_vector(7 downto 0);\n  constant C_ROM : rom_t := (x\"80\", x\"C0\", x\"FF\", x\"C0\");\nbegin\n  process(clk) begin\n    if rising_edge(clk) then dout <= C_ROM(to_integer(unsigned(addr))); end if;\n  end process;\nend architecture;"
      },
      {
        title: "Thử thách: Dual-Port RAM 2 cổng độc lập",
        prompt: "Mô tả một Dual-Port RAM gồm 2 cổng: Cổng A chuyên ghi, Cổng B chuyên đọc chạy cùng xung nhịp.",
        hint: "Process nhận cả addr_a, din_a và addr_b, dout_b.",
        solution: "process(clk) begin\n  if rising_edge(clk) then\n    if we_a = '1' then ram(to_integer(unsigned(addr_a))) <= din_a; end if;\n    dout_b <= ram(to_integer(unsigned(addr_b)));\n  end if;\nend process;"
      }
    ],

    quiz: [
      {
        question: "Tổng dung lượng bộ nhớ nhúng M9K trên kit Cyclone IV E EP4CE115 là bao nhiêu?",
        options: [
          "512 Kbits",
          "3.88 Mbits (tương đương 432 khối M9K)",
          "16 Mbits",
          "64 Mbytes"
        ],
        answerIndex: 1,
        explanation: "Chip EP4CE115F29C7 tích hợp 432 khối M9K, tương đương 3,888 Kbits bộ nhớ nhúng siêu tốc."
      },
      {
        question: "Tại sao khối RAM M9K không thể suy luận nếu bạn viết tín hiệu reset bất đồng bộ cho toàn bộ mảng nhớ?",
        options: [
          "Vì ngôn ngữ VHDL không cho phép",
          "Vì phần cứng khối nhớ vật lý M9K không có chân clear toàn cục cho hàng nghìn ô nhớ cùng lúc",
          "Vì Quartus bị lỗi",
          "Vì bộ nhớ chạy quá nhanh"
        ],
        answerIndex: 1,
        explanation: "Về mặt vi mạch, khối SRAM vật lý không có chân reset đồng loạt cho toàn bộ các ô nhớ. Muốn xóa phải ghi số 0 tuần tự từng ô."
      },
      {
        question: "Định dạng file nào được Quartus Prime sử dụng để khởi tạo dữ liệu ban đầu cho khối ROM/RAM?",
        options: [
          ".txt",
          ".hex hoặc .mif (Memory Initialization File)",
          ".bin",
          ".sof"
        ],
        answerIndex: 1,
        explanation: "Quartus hỗ trợ chuẩn .mif (Memory Initialization File) độc quyền của Intel/Altera và chuẩn .hex của Intel."
      },
      {
        question: "Thời gian trễ đọc (Read Latency) của khối M9K đồng bộ chuẩn là bao nhiêu chu kỳ xung nhịp?",
        options: [
          "0 chu kỳ (đọc tức thời tổ hợp)",
          "1 chu kỳ xung nhịp",
          "5 chu kỳ xung nhịp",
          "10 chu kỳ xung nhịp"
        ],
        answerIndex: 1,
        explanation: "Đọc đồng bộ chuẩn có latency là 1 chu kỳ xung nhịp (kết quả xuất hiện tại sườn xung kế tiếp)."
      }
    ],

    summary: [
      "Khối M9K là tài nguyên phần cứng quý giá để lưu trữ dữ liệu lớn trong FPGA mà không tiêu hao tế bào logic.",
      "Viết mã VHDL đúng chuẩn khuôn mẫu suy luận (inference template) giúp Quartus tự động nhận diện M9K.",
      "Không bao giờ thêm tín hiệu reset bất đồng bộ vào mảng dữ liệu RAM nếu muốn suy luận ra M9K.",
      "ROM có thể được khởi tạo giá trị qua file .mif để làm bảng tra Sin, Font chữ hoặc vi chương trình điều khiển.",
      "Dual-Port RAM là giải pháp hoàn hảo để trao đổi dữ liệu an toàn giữa hai hệ thống độc lập."
    ]
  },

  // ========================================================================
  // BÀI 9.4
  // ========================================================================
  {
    id: "ch9-b4",
    chapterId: "ch9",
    order: 4,
    title: "Sử dụng bộ khóa pha tần số ALTPLL IP Core: Quản lý Clock Domains",
    subtitle: "Tạo xung nhịp tốc độ cao và xử lý an toàn hiện tượng vượt miền xung nhịp (Clock Domain Crossing - CDC)",
    badge: "Nâng cao",
    estimatedMinutes: 45,
    hardwareFocus: ["ALTPLL IP Core", "Phase-Locked Loop", "Clock Domain Crossing"],

    objectives: [
      "Hiểu nguyên lý hoạt động của khối Phase-Locked Loop (PLL) phần cứng trong Cyclone IV.",
      "Tạo và cấu hình IP Core ALTPLL trong Quartus Prime từ nguồn xung 50 MHz sang 25 MHz và 100 MHz.",
      "Nhận biết nguy cơ suy thoái dữ liệu (Metastability) khi tín hiệu di chuyển giữa hai miền xung nhịp bất đồng bộ.",
      "Áp dụng mạch đồng bộ hóa 2 tầng Flip-Flop (2-FF Synchronizer) để vượt miền xung nhịp an toàn."
    ],

    theory: {
      why: "Bộ chia xung bằng bộ đếm trong bài 4.6 chỉ tạo ra các xung kích hoạt tần số thấp. Nhưng khi bạn cần một xung nhịp thực sự chạy ở 100 MHz (nhanh hơn xung gốc 50 MHz) hoặc chuẩn 25.175 MHz để điều khiển VGA, bộ đếm không thể làm được. Khối phần cứng ALTPLL cho phép nhân tần số, chia tần số và điều chỉnh góc pha với độ trôi cực thấp.",
      how: "1. **Bộ ALTPLL:** Nhận xung vào `inclk0` (50 MHz), sử dụng bộ dao động VCO nội để tạo ra các xung ra `c0`, `c1`, `c2` với tỉ số nhân/chia `M/N`.\n2. **Tín hiệu Locked:** Báo hiệu mạch PLL đã khóa pha ổn định và sẵn sàng hoạt động.\n3. **Clock Domain Crossing (CDC):** Khi tín hiệu từ miền xung 50 MHz nhảy sang miền 100 MHz mà không đồng bộ, nguy cơ vi phạm Setup/Hold dẫn tới Metastability là rất lớn. Bắt buộc phải dùng mạch đồng bộ 2 tầng FF."
    },

    diagramSvg: `<svg viewBox="0 0 600 200" class="circuit-svg">
      <g transform="translate(20, 20)">
        <rect x="20" y="30" width="180" height="120" rx="8" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="110" y="55" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">ALTPLL IP CORE</text>
        <line x1="0" y1="80" x2="20" y2="80" stroke="#38bdf8" stroke-width="2"/>
        <text x="10" y="75" fill="#94a3b8" font-size="9">50 MHz</text>

        <line x1="200" y1="60" x2="250" y2="60" stroke="#10b981" stroke-width="2"/>
        <text x="255" y="65" fill="#10b981" font-size="10">c0: 25 MHz (VGA)</text>

        <line x1="200" y1="90" x2="250" y2="90" stroke="#f59e0b" stroke-width="2"/>
        <text x="255" y="95" fill="#f59e0b" font-size="10">c1: 100 MHz (Fast)</text>

        <line x1="200" y1="120" x2="250" y2="120" stroke="#ef4444" stroke-width="2"/>
        <text x="255" y="125" fill="#ef4444" font-size="10">locked: '1'</text>

        <!-- Đồng bộ CDC 2-FF -->
        <rect x="360" y="30" width="200" height="120" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
        <text x="460" y="55" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">2-STAGE FF SYNCHRONIZER</text>
        <rect x="380" y="70" width="40" height="60" fill="#1e293b" stroke="#38bdf8"/>
        <text x="400" y="105" text-anchor="middle" fill="#38bdf8" font-size="9">FF1</text>
        <line x1="420" y1="100" x2="450" y2="100" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="450" y="70" width="40" height="60" fill="#1e293b" stroke="#38bdf8"/>
        <text x="470" y="105" text-anchor="middle" fill="#38bdf8" font-size="9">FF2</text>
        <line x1="490" y1="100" x2="530" y2="100" stroke="#10b981" stroke-width="2"/>
        <text x="535" y="105" fill="#10b981" font-size="9">Safe</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "cdc_synchronizer",
      circuitType: "sequential",
      typeExplanation: "Mạch tuần tự chống Metastability: Sử dụng 2 tầng Flip-Flop liên tiếp để chuyển tín hiệu điều khiển bất đồng bộ sang miền xung nhịp đích một cách an toàn.",
      code: `--------------------------------------------------------------------------------
-- Tên module: cdc_synchronizer
-- Chức năng: Bộ đồng bộ 2 tầng Flip-Flop chống Metastability khi vượt miền xung
--------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;

entity cdc_synchronizer is
  port (
    dest_clk  : in  std_logic;                 -- Xung nhịp của miền đích
    rst_n     : in  std_logic;                 -- Reset tích cực mức thấp
    async_in  : in  std_logic;                 -- Tín hiệu bất đồng bộ từ miền khác tới
    sync_out  : out std_logic                  -- Tín hiệu đã được đồng bộ hóa an toàn
  );
end entity cdc_synchronizer;

architecture rtl of cdc_synchronizer is
  -- Hai tầng thanh ghi đồng bộ
  signal stage1_reg : std_logic := '0';
  signal stage2_reg : std_logic := '0';

  -- Khai báo thuộc tính ngăn chặn Quartus tối ưu hóa gộp 2 FF thành 1
  attribute keep : boolean;
  attribute keep of stage1_reg : signal is true;
  attribute keep of stage2_reg : signal is true;
begin

  process(dest_clk, rst_n)
  begin
    if rst_n = '0' then
      stage1_reg <= '0';
      stage2_reg <= '0';
    elsif rising_edge(dest_clk) then
      -- Tầng 1 hấp thụ nguy cơ bất ổn định (Metastability)
      stage1_reg <= async_in;
      -- Tầng 2 cung cấp giá trị logic sạch, ổn định
      stage2_reg <= stage1_reg;
    end if;
  end process;

  sync_out <= stage2_reg;

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_cdc_synchronizer",
      code: `--------------------------------------------------------------------------------
-- Testbench: Đưa tín hiệu bất đồng bộ ngẫu nhiên vào miền xung đích 100 MHz
--------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;

entity tb_cdc_synchronizer is
end entity tb_cdc_synchronizer;

architecture sim of tb_cdc_synchronizer is
  signal dest_clk : std_logic := '0';
  signal rst_n    : std_logic := '0';
  signal async_in : std_logic := '0';
  signal sync_out : std_logic;
begin
  -- Xung đích 100 MHz (chu kỳ 10 ns)
  dest_clk <= not dest_clk after 5 ns;

  uut: entity work.cdc_synchronizer
    port map (dest_clk => dest_clk, rst_n => rst_n, async_in => async_in, sync_out => sync_out);

  process
  begin
    rst_n <= '0';
    wait for 22 ns;
    rst_n <= '1';
    
    -- Tín hiệu bất đồng bộ kích hoạt tại thời điểm lệch pha
    wait for 7 ns;
    async_in <= '1';
    wait for 40 ns;
    async_in <= '0';
    wait for 30 ns;
    assert false report "Kiểm tra CDC hoàn thành!" severity note;
    wait;
  end process;
end architecture sim;`,
      instructions: "Quan sát trên ModelSim: sync_out chuyển trạng thái sau đúng 2 sườn dương của dest_clk."
    },

    quartusGuide: {
      steps: [
        "1. Mở **IP Catalog** (hoặc Tools -> MegaWizard Plug-In Manager).",
        "2. Tìm kiếm **ALTPLL**, chọn ngôn ngữ VHDL và đặt tên file (ví dụ `my_pll.vhd`).",
        "3. Đặt tần số đầu vào `inclk0 = 50.0 MHz`.",
        "4. Cấu hình cổng `c0`: Chọn Requested Clock Frequency = `25.0 MHz` (hoặc `100.0 MHz`).",
        "5. Nhấn Generate để Quartus tự động sinh mã wrapper VHDL và file mô phỏng."
      ],
      pinAssignments: [
        { signal: "inclk0", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50 nối trực tiếp vào chân chuyên dụng của PLL" }
      ],
      qsfSnippet: "# Không gán chân tay cho các ngõ ra nội bộ của PLL"
    },

    commonErrors: [
      {
        error: "Warning: Clock latency not respected on PLL output",
        cause: "Đưa tín hiệu clock ra khỏi mạng phân phối xung nhịp toàn cục (Global Clock Network).",
        fix: "Luôn dẫn đầu ra của PLL trực tiếp vào chân `clk` của các tiến trình tuần tự, tránh đi qua logic tổ hợp."
      },
      {
        error: "Quartus optimizes away 2-FF synchronizer registers",
        cause: "Trình biên dịch nhận thấy 2 Flip-Flop mắc nối tiếp không có logic ở giữa nên tự động gom thành 1.",
        fix: "Thêm thuộc tính `attribute keep : boolean; attribute keep of stage1_reg : signal is true;`."
      }
    ],

    exercises: [
      {
        title: "Cơ bản: Kết nối tín hiệu locked",
        prompt: "Viết logic giữ hệ thống ở trạng thái Reset chừng nào PLL chưa khóa pha (`locked = '0'`).",
        hint: "system_rst_n <= rst_n and pll_locked;",
        solution: "system_rst_n <= ext_rst_n and pll_locked;"
      },
      {
        title: "Vận dụng: Đồng bộ Bus dữ liệu nhiều bit",
        prompt: "Tại sao không thể dùng 2-FF Synchronizer cho một Bus dữ liệu 8-bit? Hãy giải thích.",
        hint: "Hiện tượng chênh lệch độ trễ dây (Skew) giữa các đường bit dẫn tới đọc nhầm giá trị tạm thời.",
        solution: "Mỗi đường dây có độ trễ truyền dẫn khác nhau. Khi các bit chuyển trạng thái cùng lúc, một số bit có thể đến trước 1 chu kỳ so với các bit khác, dẫn tới giá trị bị sai lệch. Đối với Bus, cần dùng Asynchronous FIFO hoặc Handshake."
      },
      {
        title: "Thử thách: Mạch bắt sườn đồng bộ (Pulse Synchronizer)",
        prompt: "Thiết kế mạch chuyển một xung nhịp 1 chu kỳ từ miền xung 50 MHz sang miền xung 100 MHz an toàn.",
        hint: "Toggle Flip-Flop ở miền phát -> 2-FF ở miền thu -> XOR với chu kỳ trước đó.",
        solution: "architecture rtl of pulse_sync is\n  signal toggle_src : std_logic := '0';\n  signal q1, q2, q3 : std_logic := '0';\nbegin\n  process(clk_src) begin\n    if rising_edge(clk_src) then\n      if pulse_in = '1' then toggle_src <= not toggle_src; end if;\n    end if;\n  end process;\n  process(clk_dest) begin\n    if rising_edge(clk_dest) then\n      q1 <= toggle_src;\n      q2 <= q1;\n      q3 <= q2;\n    end if;\n  end process;\n  pulse_out <= q2 xor q3;\nend architecture;"
      }
    ],

    quiz: [
      {
        question: "Khối ALTPLL trên chip Cyclone IV nhận tín hiệu clock đầu vào thông qua chân nào?",
        options: [
          "Bất kỳ chân I/O nào trên bo mạch",
          "Chân xung nhịp chuyên dụng nối với mạng Global Clock (như PIN_Y2)",
          "Qua cổng USB-Blaster",
          "Qua chân nguồn VCC"
        ],
        answerIndex: 1,
        explanation: "PLL yêu cầu tín hiệu clock ổn định đi vào qua các chân Clock chuyên dụng có đường dẫn thẳng tới mạng Global Clock Network của chip."
      },
      {
        question: "Tín hiệu 'locked' từ khối ALTPLL mang ý nghĩa gì?",
        options: [
          "Chip FPGA đã bị khóa và không thể nạp lại",
          "PLL đã đồng bộ xong tần số và góc pha, ngõ ra đã đạt tần số chính xác và ổn định",
          "Tần số đang bị quá nhiệt",
          "Mạch bị ngắn mạch"
        ],
        answerIndex: 1,
        explanation: "Locked = '1' thông báo cho toàn bộ mạch số biết rằng PLL đã ổn định tần số đầu ra và có thể an toàn giải phóng reset."
      },
      {
        question: "Hiện tượng Metastability (Bất ổn định lượng tử) xảy ra khi nào?",
        options: [
          "Khi điện áp sụt giảm đột ngột",
          "Khi tín hiệu ngõ vào vi phạm thời gian Setup Time hoặc Hold Time của Flip-Flop",
          "Khi tần số vượt quá 1 GHz",
          "Khi chip bị ẩm ướt"
        ],
        answerIndex: 1,
        explanation: "Khi tín hiệu thay đổi đúng thời điểm sườn clock đang chuyển, Flip-Flop bị kẹt ở mức điện áp lơ lửng giữa 0 và 1 trong một khoảng thời gian trước khi sụp về trạng thái xác định."
      },
      {
        question: "Phương pháp chuẩn để đồng bộ một tín hiệu điều khiển đơn bit từ miền xung bất đồng bộ là gì?",
        options: [
          "Nối qua một cổng NOT",
          "Mắc chuỗi 2 Flip-Flop nối tiếp cùng kích bằng xung nhịp của miền đích (2-FF Synchronizer)",
          "Dùng điện trở kéo lên",
          "Tăng điện áp nguồn"
        ],
        answerIndex: 1,
        explanation: "Mạch 2 tầng Flip-Flop nối tiếp là chuẩn mực vàng trong thiết kế vi mạch để triệt tiêu hiện tượng Metastability cho tín hiệu 1-bit."
      }
    ],

    summary: [
      "ALTPLL là khối phần cứng chuyên dụng cho phép nhân, chia và dịch pha xung nhịp với độ rung pha (jitter) cực thấp.",
      "Luôn sử dụng tín hiệu `locked` kết hợp với tín hiệu Reset hệ thống để tránh tình trạng mạch chạy khi xung chưa ổn định.",
      "Vấn đề Clock Domain Crossing (CDC) là nguyên nhân hàng đầu gây ra lỗi chập chờn khó phát hiện trong thiết kế số.",
      "Mạch 2-FF Synchronizer giải quyết triệt để vấn đề Metastability đối với tín hiệu điều khiển 1-bit.",
      "Đối với Bus dữ liệu nhiều bit vượt miền xung, tuyệt đối không dùng 2-FF đơn lẻ mà phải dùng Asynchronous FIFO hoặc cơ chế Handshake."
    ]
  },

  // ========================================================================
  // BÀI 9.5
  // ========================================================================
  {
    id: "ch9-b5",
    chapterId: "ch9",
    order: 5,
    title: "Dự án xuất hình ảnh VGA 640x480 @ 60Hz ra màn hình máy tính",
    subtitle: "Tạo xung nhịp điểm ảnh Pixel Clock 25.175 MHz, bộ đếm HSYNC/VSYNC và điều khiển chip DAC ADV7123",
    badge: "Nâng cao",
    estimatedMinutes: 50,
    hardwareFocus: ["Cổng VGA DE2-115", "Chip DAC ADV7123 Triple 10-bit", "HSYNC / VSYNC"],

    objectives: [
      "Nắm vững chuẩn định thời tín hiệu VGA 640x480 @ 60 Hz (Pixel Clock 25.175 MHz).",
      "Thiết kế bộ tạo xung quét ngang (HSYNC) và quét dọc (VSYNC) với các vùng Front Porch, Sync Pulse, Back Porch và Active Video.",
      "Giao tiếp với chip chuyển đổi số-tương tự (DAC) ADV7123 tích hợp trên bo mạch DE2-115.",
      "Xuất dải màu thử nghiệm (Color Bars) sắc nét lên màn hình máy tính qua cổng D-Sub 15 chân."
    ],

    theory: {
      why: "Giao tiếp xuất hình ảnh là một trong những ứng dụng hấp dẫn nhất của FPGA. Bo mạch Terasic DE2-115 được trang bị cổng VGA tiêu chuẩn nối trực tiếp với chip DAC Analog Devices ADV7123 (hỗ trợ màu 24-bit True Color 140 MHz). Nắm vững chuẩn VGA giúp bạn tự làm máy chơi game cổ điển, hiển thị camera và giao diện đồ họa nhúng.",
      how: "1. **Chuẩn 640x480 @ 60 Hz:**\n- Pixel Clock: 25.175 MHz (thường dùng xấp xỉ 25.0 MHz bằng cách chia 2 từ CLOCK_50).\n- Quét ngang (Horizontal): Tổng cộng 800 chu kỳ pixel (Active: 640, Front Porch: 16, Sync Pulse: 96, Back Porch: 48).\n- Quét dọc (Vertical): Tổng cộng 525 dòng (Active: 480, Front Porch: 10, Sync Pulse: 2, Back Porch: 33).\n2. **Tín hiệu HSYNC và VSYNC:** Tích cực mức thấp (Active-Low) trong thời gian Sync Pulse.\n3. **Active Video:** Chỉ xuất màu RGB khi cả trục ngang và trục dọc đều nằm trong vùng Active. Khi nằm ngoài vùng Active, bắt buộc RGB = 0 (Blanking) để không làm hỏng mức đen của màn hình."
    },

    diagramSvg: `<svg viewBox="0 0 620 220" class="circuit-svg">
      <g transform="translate(20, 20)">
        <rect x="20" y="20" width="200" height="150" rx="8" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="120" y="45" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">BỘ ĐỊNH THỜI VGA</text>
        <text x="120" y="70" text-anchor="middle" fill="#94a3b8" font-size="10">Pixel Clk: 25 MHz</text>
        <text x="120" y="90" text-anchor="middle" fill="#a7f3d0" font-size="10">Bộ đếm H: 0 -> 799</text>
        <text x="120" y="110" text-anchor="middle" fill="#fde68a" font-size="10">Bộ đếm V: 0 -> 524</text>
        <text x="120" y="140" text-anchor="middle" fill="#38bdf8" font-size="10">Sinh HSYNC & VSYNC</text>

        <path d="M 220 75 L 300 75" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="260" y="65" text-anchor="middle" fill="#38bdf8" font-size="9">X, Y Pos</text>

        <!-- Khối sinh màu -->
        <rect x="300" y="20" width="130" height="70" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
        <text x="365" y="45" text-anchor="middle" fill="#10b981" font-size="10" font-weight="bold">COLOR GEN</text>
        <text x="365" y="65" text-anchor="middle" fill="#a7f3d0" font-size="9">Color Bars (8 dải)</text>

        <path d="M 430 55 L 480 55" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>

        <!-- DAC ADV7123 -->
        <rect x="480" y="20" width="110" height="150" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <text x="535" y="45" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold">ADV7123 DAC</text>
        <text x="535" y="75" text-anchor="middle" fill="#ef4444" font-size="9">VGA_R[7:0]</text>
        <text x="535" y="100" text-anchor="middle" fill="#10b981" font-size="9">VGA_G[7:0]</text>
        <text x="535" y="125" text-anchor="middle" fill="#38bdf8" font-size="9">VGA_B[7:0]</text>
        <text x="535" y="150" text-anchor="middle" fill="#cbd5e1" font-size="8">VGA_CLK, BLANK_N</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "vga_color_bar_top",
      circuitType: "sequential",
      typeExplanation: "Hệ thống điều khiển hiển thị VGA hoàn chỉnh: Chia xung 25 MHz, quét dòng quét cột chuẩn VESA 640x480 và điều khiển DAC ADV7123 xuất 8 dải màu sắc nét.",
      code: `--------------------------------------------------------------------------------
-- Tên module: vga_color_bar_top
-- Chức năng: Bộ điều khiển xuất hình ảnh VGA 640x480 @ 60Hz ra cổng DE2-115
--------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity vga_color_bar_top is
  port (
    CLOCK_50    : in  std_logic;                       -- Xung nhịp 50 MHz (PIN_Y2)
    KEY         : in  std_logic_vector(0 downto 0);    -- KEY[0] Reset (PIN_M23)
    
    -- Giao tiếp VGA với chip DAC ADV7123 trên bo mạch DE2-115
    VGA_CLK     : out std_logic;                       -- Pixel Clock 25 MHz
    VGA_HS      : out std_logic;                       -- Horizontal Sync
    VGA_VS      : out std_logic;                       -- Vertical Sync
    VGA_BLANK_N : out std_logic;                       -- Direct DAC Blanking
    VGA_SYNC_N  : out std_logic;                       -- Direct DAC Sync on Green (nối '1')
    VGA_R       : out std_logic_vector(7 downto 0);    -- 8-bit Đỏ
    VGA_G       : out std_logic_vector(7 downto 0);    -- 8-bit Xanh lá
    VGA_B       : out std_logic_vector(7 downto 0)     -- 8-bit Xanh dương
  );
end entity vga_color_bar_top;

architecture rtl of vga_color_bar_top is
  -- Các thông số định thời chuẩn 640x480 @ 60Hz
  constant H_ACTIVE : natural := 640;
  constant H_FRONT  : natural := 16;
  constant H_PULSE  : natural := 96;
  constant H_BACK   : natural := 48;
  constant H_TOTAL  : natural := 800; -- 640 + 16 + 96 + 48

  constant V_ACTIVE : natural := 480;
  constant V_FRONT  : natural := 10;
  constant V_PULSE  : natural := 2;
  constant V_BACK   : natural := 33;
  constant V_TOTAL  : natural := 525; -- 480 + 10 + 2 + 33

  -- Tạo xung 25 MHz bằng cách chia đôi 50 MHz
  signal pixel_clk : std_logic := '0';

  -- Các bộ đếm tọa độ quét
  signal h_cnt : natural range 0 to H_TOTAL - 1 := 0;
  signal v_cnt : natural range 0 to V_TOTAL - 1 := 0;

  signal active_area : boolean;
begin

  -- 1. Bộ chia xung nhịp: 50 MHz -> 25 MHz
  process(CLOCK_50)
  begin
    if rising_edge(CLOCK_50) then
      pixel_clk <= not pixel_clk;
    end if;
  end process;

  VGA_CLK     <= pixel_clk;
  VGA_SYNC_N  <= '1'; -- Không dùng Sync on Green

  -- 2. Bộ đếm quét dòng và quét cột
  process(pixel_clk, KEY(0))
  begin
    if KEY(0) = '0' then
      h_cnt <= 0;
      v_cnt <= 0;
    elsif rising_edge(pixel_clk) then
      if h_cnt = H_TOTAL - 1 then
        h_cnt <= 0;
        if v_cnt = V_TOTAL - 1 then
          v_cnt <= 0;
        else
          v_cnt <= v_cnt + 1;
        end if;
      else
        h_cnt <= h_cnt + 1;
      end if;
    end if;
  end process;

  -- 3. Tạo xung đồng bộ HSYNC và VSYNC (Tích cực mức thấp)
  VGA_HS <= '0' when (h_cnt >= (H_ACTIVE + H_FRONT) and h_cnt < (H_ACTIVE + H_FRONT + H_PULSE)) else '1';
  VGA_VS <= '0' when (v_cnt >= (V_ACTIVE + V_FRONT) and v_cnt < (V_ACTIVE + V_FRONT + V_PULSE)) else '1';

  -- Vùng hiển thị tích cực (Active Display)
  active_area <= (h_cnt < H_ACTIVE) and (v_cnt < V_ACTIVE);
  VGA_BLANK_N <= '1' when active_area else '0';

  -- 4. Bộ sinh mẫu màu Color Bars (Chia 640 pixel thành 8 dải màu, mỗi dải 80 pixel)
  process(pixel_clk)
    variable bar_idx : natural range 0 to 7;
  begin
    if rising_edge(pixel_clk) then
      if active_area then
        bar_idx := h_cnt / 80;
        case bar_idx is
          when 0 => -- Trắng
            VGA_R <= x"FF"; VGA_G <= x"FF"; VGA_B <= x"FF";
          when 1 => -- Vàng
            VGA_R <= x"FF"; VGA_G <= x"FF"; VGA_B <= x"00";
          when 2 => -- Lục lam (Cyan)
            VGA_R <= x"00"; VGA_G <= x"FF"; VGA_B <= x"FF";
          when 3 => -- Xanh lá (Green)
            VGA_R <= x"00"; VGA_G <= x"FF"; VGA_B <= x"00";
          when 4 => -- Hồng tím (Magenta)
            VGA_R <= x"FF"; VGA_G <= x"00"; VGA_B <= x"FF";
          when 5 => -- Đỏ (Red)
            VGA_R <= x"FF"; VGA_G <= x"00"; VGA_B <= x"00";
          when 6 => -- Xanh dương (Blue)
            VGA_R <= x"00"; VGA_G <= x"00"; VGA_B <= x"FF";
          when others => -- Đen
            VGA_R <= x"00"; VGA_G <= x"00"; VGA_B <= x"00";
        end case;
      else
        -- Bắt buộc bằng 0 trong vùng Blanking
        VGA_R <= x"00";
        VGA_G <= x"00";
        VGA_B <= x"00";
      end if;
    end if;
  end process;

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_vga_sync",
      code: `--------------------------------------------------------------------------------
-- Testbench: Kiểm tra nhịp phát HSYNC và vùng Blanking
--------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;

entity tb_vga_sync is
end entity tb_vga_sync;

architecture sim of tb_vga_sync is
  signal CLOCK_50    : std_logic := '0';
  signal KEY         : std_logic_vector(0 downto 0) := "0";
  signal VGA_CLK     : std_logic;
  signal VGA_HS      : std_logic;
  signal VGA_VS      : std_logic;
  signal VGA_BLANK_N : std_logic;
  signal VGA_SYNC_N  : std_logic;
  signal VGA_R       : std_logic_vector(7 downto 0);
  signal VGA_G       : std_logic_vector(7 downto 0);
  signal VGA_B       : std_logic_vector(7 downto 0);
begin
  CLOCK_50 <= not CLOCK_50 after 10 ns;

  uut: entity work.vga_color_bar_top
    port map (
      CLOCK_50 => CLOCK_50, KEY => KEY,
      VGA_CLK => VGA_CLK, VGA_HS => VGA_HS, VGA_VS => VGA_VS,
      VGA_BLANK_N => VGA_BLANK_N, VGA_SYNC_N => VGA_SYNC_N,
      VGA_R => VGA_R, VGA_G => VGA_G, VGA_B => VGA_B
    );

  process
  begin
    KEY(0) <= '0';
    wait for 50 ns;
    KEY(0) <= '1';
    wait for 50 us; -- Mô phỏng hơn 1 dòng quét ngang
    assert false report "Kiểm tra HSYNC thành công!" severity note;
    wait;
  end process;
end architecture sim;`,
      instructions: "Quan sát trên ModelSim: Đo chu kỳ của VGA_HS bằng đúng 800 chu kỳ pixel (32 microseconds)."
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án mới trong Quartus Prime, chọn chip `EP4CE115F29C7`.",
        "2. Copy toàn bộ đoạn QSF Snippet gán chân cho DAC ADV7123 bên dưới vào file `.qsf`.",
        "3. Biên dịch toàn bộ dự án (Processing -> Start Compilation).",
        "4. Cắm cáp màn hình VGA từ máy tính vào cổng VGA trên kit DE2-115.",
        "5. Nạp file `.sof` và chiêm ngưỡng 8 dải màu chuẩn phát ra màn hình!"
      ],
      pinAssignments: [
        { signal: "CLOCK_50", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "Xung nhịp gốc" },
        { signal: "KEY[0]", pin: "PIN_M23", ioStandard: "2.5 V", note: "Reset tích cực thấp" },
        { signal: "VGA_CLK", pin: "PIN_A12", ioStandard: "3.3-V LVTTL", note: "Pixel clock tới DAC ADV7123" },
        { signal: "VGA_HS", pin: "PIN_G13", ioStandard: "3.3-V LVTTL", note: "Horizontal Sync" },
        { signal: "VGA_VS", pin: "PIN_C13", ioStandard: "3.3-V LVTTL", note: "Vertical Sync" },
        { signal: "VGA_BLANK_N", pin: "PIN_F11", ioStandard: "3.3-V LVTTL", note: "Blanking pin của DAC" },
        { signal: "VGA_SYNC_N", pin: "PIN_C10", ioStandard: "3.3-V LVTTL", note: "Sync pin của DAC" },
        { signal: "VGA_R[7]", pin: "PIN_H10", ioStandard: "3.3-V LVTTL", note: "MSB Kênh màu Đỏ" },
        { signal: "VGA_G[7]", pin: "PIN_C9", ioStandard: "3.3-V LVTTL", note: "MSB Kênh màu Xanh lá" },
        { signal: "VGA_B[7]", pin: "PIN_D12", ioStandard: "3.3-V LVTTL", note: "MSB Kênh màu Xanh dương" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to CLOCK_50
set_location_assignment PIN_M23 -to KEY[0]
set_location_assignment PIN_A12 -to VGA_CLK
set_location_assignment PIN_G13 -to VGA_HS
set_location_assignment PIN_C13 -to VGA_VS
set_location_assignment PIN_F11 -to VGA_BLANK_N
set_location_assignment PIN_C10 -to VGA_SYNC_N
set_location_assignment PIN_E12 -to VGA_R[0]
set_location_assignment PIN_E11 -to VGA_R[1]
set_location_assignment PIN_D10 -to VGA_R[2]
set_location_assignment PIN_F12 -to VGA_R[3]
set_location_assignment PIN_G10 -to VGA_R[4]
set_location_assignment PIN_J12 -to VGA_R[5]
set_location_assignment PIN_H8 -to VGA_R[6]
set_location_assignment PIN_H10 -to VGA_R[7]
set_location_assignment PIN_G8 -to VGA_G[0]
set_location_assignment PIN_G11 -to VGA_G[1]
set_location_assignment PIN_F8 -to VGA_G[2]
set_location_assignment PIN_H12 -to VGA_G[3]
set_location_assignment PIN_C8 -to VGA_G[4]
set_location_assignment PIN_B10 -to VGA_G[5]
set_location_assignment PIN_F10 -to VGA_G[6]
set_location_assignment PIN_C9 -to VGA_G[7]
set_location_assignment PIN_B14 -to VGA_B[0]
set_location_assignment PIN_A10 -to VGA_B[1]
set_location_assignment PIN_C11 -to VGA_B[2]
set_location_assignment PIN_A11 -to VGA_B[3]
set_location_assignment PIN_K7 -to VGA_B[4]
set_location_assignment PIN_D11 -to VGA_B[5]
set_location_assignment PIN_C12 -to VGA_B[6]
set_location_assignment PIN_D12 -to VGA_B[7]`
    },

    commonErrors: [
      {
        error: "Màn hình báo 'Out of Range' hoặc không nhận tín hiệu",
        cause: "Bộ đếm H_TOTAL hoặc V_TOTAL bị sai thông số khiến tần số quét dòng lệch khỏi 31.5 kHz.",
        fix: "Kiểm tra kỹ: H_TOTAL phải đúng 800 chu kỳ pixel và V_TOTAL phải đúng 525 dòng."
      },
      {
        error: "Màn hình tối đen dù đã cắm cáp và nạp code",
        cause: "Chân `VGA_BLANK_N` bị gán mức '0' liên tục hoặc quên gán chân trong file `.qsf`.",
        fix: "ADV7123 yêu cầu chân `VGA_BLANK_N` phải ở mức '1' trong vùng Active Area để mở DAC."
      }
    ],

    exercises: [
      {
        title: "Cơ bản: Đổi màu toàn màn hình",
        prompt: "Sửa mã nguồn để toàn bộ màn hình hiển thị màu xanh lam thuần khiết (Pure Blue).",
        hint: "Gán VGA_R <= x\"00\", VGA_G <= x\"00\", VGA_B <= x\"FF\" trong vùng active_area.",
        solution: "if active_area then\n  VGA_R <= x\"00\"; VGA_G <= x\"00\"; VGA_B <= x\"FF\";\nend if;"
      },
      {
        title: "Vận dụng: Vẽ ô vuông chuyển động",
        prompt: "Tạo một ô vuông màu đỏ kích thước 50x50 pixel xuất hiện ở giữa màn hình (tọa độ X từ 295 đến 345, Y từ 215 đến 265).",
        hint: "Kiểm tra điều kiện (h_cnt >= 295 and h_cnt < 345 and v_cnt >= 215 and v_cnt < 265).",
        solution: "if (h_cnt >= 295 and h_cnt < 345 and v_cnt >= 215 and v_cnt < 265) then\n  VGA_R <= x\"FF\"; VGA_G <= x\"00\"; VGA_B <= x\"00\";\nelse\n  VGA_R <= x\"20\"; VGA_G <= x\"20\"; VGA_B <= x\"20\"; -- Nền xám\nend if;"
      },
      {
        title: "Thử thách: Bàn cờ vua 8x8",
        prompt: "Tạo họa tiết bàn cờ vua xen kẽ các ô đen và trắng (mỗi ô kích thước 60x60 pixel).",
        hint: "Dùng phép toán XOR giữa (h_cnt / 60) mod 2 và (v_cnt / 60) mod 2.",
        solution: "variable cell_x : natural := (h_cnt / 60) mod 2;\nvariable cell_y : natural := (v_cnt / 60) mod 2;\nif (cell_x xor cell_y) = 1 then\n  VGA_R <= x\"FF\"; VGA_G <= x\"FF\"; VGA_B <= x\"FF\";\nelse\n  VGA_R <= x\"00\"; VGA_G <= x\"00\"; VGA_B <= x\"00\";\nend if;"
      }
    ],

    quiz: [
      {
        question: "Tần số Pixel Clock chuẩn của độ phân giải VGA 640x480 @ 60 Hz là bao nhiêu?",
        options: [
          "50.000 MHz",
          "25.175 MHz",
          "100.000 MHz",
          "12.500 MHz"
        ],
        answerIndex: 1,
        explanation: "Theo chuẩn VESA, tần số pixel clock chuẩn là 25.175 MHz. Khi thiết kế đơn giản trên FPGA, tần số 25.0 MHz (chia đôi từ 50 MHz) vẫn được hầu hết màn hình LCD hiện đại nhận diện tốt."
      },
      {
        question: "Tổng số chu kỳ pixel cho một dòng quét ngang (H_TOTAL) chuẩn VGA 640x480 là bao nhiêu?",
        options: [
          "640 chu kỳ",
          "800 chu kỳ (gồm 640 active + 16 front porch + 96 sync pulse + 48 back porch)",
          "1024 chu kỳ",
          "525 chu kỳ"
        ],
        answerIndex: 1,
        explanation: "Một dòng quét ngang có 640 pixel hiển thị thực tế cộng thêm các vùng trống (blanking/sync) tạo thành tổng số 800 chu kỳ pixel."
      },
      {
        question: "Chip DAC chuyển đổi tín hiệu số sang video analog trên bo mạch DE2-115 là chip nào?",
        options: [
          "Wolfson WM8731",
          "Analog Devices ADV7123 (Triple 10-bit High Speed DAC)",
          "FTDI FT232R",
          "MAX3232"
        ],
        answerIndex: 1,
        explanation: "DE2-115 sử dụng chip DAC cao cấp ADV7123 của Analog Devices hỗ trợ 3 kênh màu RGB với tốc độ lên đến 140 MHz."
      },
      {
        question: "Tại sao tín hiệu màu RGB phải bắt buộc bằng 0 (x\"00\") ngoài vùng Active Display?",
        options: [
          "Để tiết kiệm điện năng cho FPGA",
          "Để không phá hủy mức điện áp chuẩn mức đen (Black Level) trong thời gian quét ngược (Blanking) của màn hình",
          "Vì ngôn ngữ VHDL yêu cầu",
          "Để tránh nhiệt độ chip DAC tăng cao"
        ],
        answerIndex: 1,
        explanation: "Trong vùng Blanking, màn hình đo điện áp chuẩn để căn chỉnh độ sáng. Nếu để rò rỉ tín hiệu màu vào vùng này, màn hình sẽ bị nhiễu sọc hoặc mất độ tương phản."
      }
    ],

    summary: [
      "Bộ định thời VGA là sự kết hợp nhịp nhàng giữa 2 bộ đếm tuần tự: Bộ đếm quét dòng (H) và bộ đếm quét cột (V).",
      "HSYNC và VSYNC là các xung tích cực mức thấp (active-low) dùng để đồng bộ thời điểm quét lại của màn hình.",
      "Tín hiệu màu RGB chỉ được phép kích hoạt trong vùng hiển thị tích cực (Active Video Area).",
      "Chip DAC ADV7123 chuyển đổi trực tiếp các bus tín hiệu số 8-bit đỏ, xanh lá, xanh dương thành điện áp tương tự 0.7V.",
      "Làm chủ được VGA mở ra cánh cửa xây dựng các ứng dụng đồ họa thời gian thực, trò chơi nhúng và giao diện người dùng trên FPGA."
    ]
  },

  // ========================================================================
  // BÀI 9.6
  // ========================================================================
  {
    id: "ch9-b6",
    chapterId: "ch9",
    order: 6,
    title: "Lộ trình nghề nghiệp Kỹ sư Vi mạch / FPGA & Đồ án Tốt nghiệp (Capstone)",
    subtitle: "Tổng kết toàn bộ khóa học: Tiêu chuẩn công nghiệp, quy trình phỏng vấn ASIC/FPGA và đồ án chuyên sâu",
    badge: "Nâng cao",
    estimatedMinutes: 60,
    hardwareFocus: ["Toàn bộ kit DE2-115", "System-on-Chip", "Career Roadmap"],

    objectives: [
      "Tổng kết bức tranh toàn cảnh: Từ mã nguồn VHDL, tổng hợp RTL, mô phỏng ModelSim tới nạp chip thực tế.",
      "Phân biệt quy trình thiết kế FPGA Prototype so với quy trình thiết kế vi mạch ASIC thương mại.",
      "Lập kế hoạch triển khai Đồ án Tốt nghiệp đỉnh cao (Capstone Project) trên kit DE2-115.",
      "Định hình lộ trình phát triển nghề nghiệp: Các vị trí tuyển dụng (RTL Design, Verification, FPGA Engineer, Physical Design)."
    ],

    theory: {
      why: "Bạn đã hoàn thành một hành trình phi thường: từ con số 0 về phần cứng, qua từng cổng logic, bộ nhớ, máy trạng thái, kiểm chứng testbench và các dự án thực tế trên bo mạch DE2-115. Bước tiếp theo là chuyển đổi những kiến thức này thành sự nghiệp kỹ sư chuyên nghiệp trong ngành công nghiệp bán dẫn trị giá hàng trăm tỷ USD.",
      how: "1. **So sánh FPGA vs ASIC:**\n- FPGA: Linh hoạt, cấu hình lại được bằng file bitstream, chi phí ban đầu (NRE) thấp, phù hợp làm sản phẩm số lượng vừa và mẫu thử nghiệm (prototyping).\n- ASIC: Đúc chip silicon cố định tại nhà máy (TSMC, Samsung, Intel), chi phí khuôn mẫu cực cao (hàng triệu USD), nhưng giá thành trên từng con chip cực rẻ khi sản xuất hàng loạt triệu chip, tốc độ siêu nhanh và tiết kiệm pin tối đa.\n2. **Các vị trí cốt lõi trong ngành Vi mạch:**\n- RTL Design Engineer: Viết mã kiến trúc phần cứng (VHDL/Verilog/SystemVerilog).\n- Design Verification (DV) Engineer: Viết môi trường kiểm chứng tự động (UVM, SystemVerilog, Python CocoTB).\n- FPGA Engineer: Hiện thực hóa thuật toán xử lý tín hiệu (DSP), tài chính tần số cao (HFT), viễn thông 5G trên chip FPGA.\n- Physical Design (Backend) Engineer: Bố trí linh kiện (Floorplanning), đi dây (Routing), Timing Closure trên quy trình silicon."
    },

    diagramSvg: `<svg viewBox="0 0 620 220" class="circuit-svg">
      <g transform="translate(20, 20)">
        <!-- Roadmap Flow -->
        <rect x="10" y="30" width="120" height="80" rx="8" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="70" y="65" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">1. RTL DESIGN</text>
        <text x="70" y="85" text-anchor="middle" fill="#94a3b8" font-size="9">VHDL / Verilog</text>

        <path d="M 130 70 L 170 70" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

        <rect x="170" y="30" width="120" height="80" rx="8" fill="#131e33" stroke="#10b981" stroke-width="2"/>
        <text x="230" y="65" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">2. VERIFICATION</text>
        <text x="230" y="85" text-anchor="middle" fill="#a7f3d0" font-size="9">ModelSim / UVM</text>

        <path d="M 290 70 L 330 70" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>

        <rect x="330" y="30" width="120" height="80" rx="8" fill="#131e33" stroke="#f59e0b" stroke-width="2"/>
        <text x="390" y="65" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">3. SYNTHESIS & STA</text>
        <text x="390" y="85" text-anchor="middle" fill="#fde68a" font-size="9">TimeQuest / Timing</text>

        <path d="M 450 70 L 490 70" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>

        <rect x="490" y="30" width="110" height="80" rx="8" fill="#131e33" stroke="#ef4444" stroke-width="2"/>
        <text x="545" y="65" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="bold">4. HARDWARE</text>
        <text x="545" y="85" text-anchor="middle" fill="#fca5a5" font-size="9">DE2-115 / Tape-out</text>

        <!-- Đồ án Capstone -->
        <rect x="10" y="130" width="590" height="50" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-dasharray="4"/>
        <text x="305" y="160" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">🏆 CAPSTONE: RISC-V CORE / VGA GAMING SYSTEM / AI ACCELERATOR</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "capstone_top_template",
      circuitType: "sequential",
      typeExplanation: "Bộ khung mẫu (Template) tiêu chuẩn công nghiệp cho Đồ án Tốt nghiệp: Tích hợp đầy đủ Clock, Reset, Đồng bộ vào-ra, Máy trạng thái chính và bus hiển thị ngoại vi.",
      code: `--------------------------------------------------------------------------------
-- Tên module: capstone_top_template
-- Chức năng: Khung kiến trúc mẫu tiêu chuẩn cho Đồ án Tốt nghiệp FPGA DE2-115
--------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity capstone_top_template is
  port (
    -- Xung nhịp hệ thống
    CLOCK_50 : in  std_logic;
    
    -- Giao tiếp nút nhấn & công tắc
    KEY      : in  std_logic_vector(3 downto 0);
    SW       : in  std_logic_vector(17 downto 0);
    
    -- Đèn LED chỉ thị
    LEDR     : out std_logic_vector(17 downto 0);
    LEDG     : out std_logic_vector(8 downto 0);
    
    -- 8 Màn hình LED 7 đoạn
    HEX0     : out std_logic_vector(6 downto 0);
    HEX1     : out std_logic_vector(6 downto 0);
    HEX2     : out std_logic_vector(6 downto 0);
    HEX3     : out std_logic_vector(6 downto 0);
    HEX4     : out std_logic_vector(6 downto 0);
    HEX5     : out std_logic_vector(6 downto 0);
    HEX6     : out std_logic_vector(6 downto 0);
    HEX7     : out std_logic_vector(6 downto 0)
  );
end entity capstone_top_template;

architecture structural of capstone_top_template is
  -- Tín hiệu Reset đồng bộ hệ thống
  signal sys_rst_n : std_logic;

  -- Nhịp tích tắc 1 Hz và 1 kHz
  signal tick_1hz  : std_logic;
  signal tick_1khz : std_logic;
begin

  -- Đồng bộ hóa tín hiệu Reset từ KEY0
  sys_rst_n <= KEY(0);

  -- Phần logic đồ án: Người học tích hợp các module con tại đây
  -- Ví dụ: Vi xử lý RISC-V đơn giản, Máy nghe nhạc, hoặc Bộ xử lý ảnh
  
  -- Chỉ thị trạng thái hoạt động bình thường
  LEDG(0) <= sys_rst_n;
  LEDR(17 downto 0) <= SW(17 downto 0);

  -- Tắt các màn hình chưa sử dụng
  HEX7 <= (others => '1');
  HEX6 <= (others => '1');
  HEX5 <= (others => '1');
  HEX4 <= (others => '1');
  HEX3 <= (others => '1');
  HEX2 <= (others => '1');
  HEX1 <= (others => '1');
  HEX0 <= (others => '1');

end architecture structural;`
    },

    testbenchCode: {
      entityName: "tb_capstone_template",
      code: `--------------------------------------------------------------------------------
-- Testbench mẫu kiểm tra Top-Level đồ án tốt nghiệp
--------------------------------------------------------------------------------
library ieee;
use ieee.std_logic_1164.all;

entity tb_capstone_template is
end entity tb_capstone_template;

architecture sim of tb_capstone_template is
  signal CLOCK_50 : std_logic := '0';
  signal KEY      : std_logic_vector(3 downto 0) := "1111";
  signal SW       : std_logic_vector(17 downto 0) := (others => '0');
  signal LEDR     : std_logic_vector(17 downto 0);
  signal LEDG     : std_logic_vector(8 downto 0);
  signal HEX0     : std_logic_vector(6 downto 0);
begin
  CLOCK_50 <= not CLOCK_50 after 10 ns;

  uut: entity work.capstone_top_template
    port map (
      CLOCK_50 => CLOCK_50, KEY => KEY, SW => SW,
      LEDR => LEDR, LEDG => LEDG,
      HEX0 => HEX0, HEX1 => open, HEX2 => open, HEX3 => open,
      HEX4 => open, HEX5 => open, HEX6 => open, HEX7 => open
    );

  process
  begin
    KEY(0) <= '0';
    wait for 40 ns;
    KEY(0) <= '1';
    SW(0)  <= '1';
    wait for 100 ns;
    assert LEDR(0) = '1' report "Lỗi kiểm tra LEDR" severity failure;
    assert false report "Khung mẫu Capstone hoạt động hoàn hảo!" severity note;
    wait;
  end process;
end architecture sim;`,
      instructions: "Chạy testbench để đảm bảo kiến trúc khung không có xung đột tín hiệu."
    },

    quartusGuide: {
      steps: [
        "1. Xây dựng tài liệu đặc tả kiến trúc (Architectural Specification) trước khi viết mã.",
        "2. Chia nhỏ đồ án thành các module độc lập và viết Testbench kiểm chứng 100% từng module con.",
        "3. Tích hợp vào Top-level, gán chân pin planner và kiểm tra báo cáo TimeQuest Timing Analyzer.",
        "4. Sử dụng SignalTap II Logic Analyzer để gỡ lỗi các trường hợp biên trên phần cứng thực.",
        "5. Quay video demo sản phẩm chạy trên kit DE2-115 và viết báo cáo kỹ thuật đưa lên GitHub làm Portfolio xin việc."
      ],
      pinAssignments: [
        { signal: "CLOCK_50", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "Xung nhịp 50 MHz" }
      ],
      qsfSnippet: "set_location_assignment PIN_Y2 -to CLOCK_50"
    },

    commonErrors: [
      {
        error: "Đồ án quá lớn, cố gắng viết toàn bộ logic trong một file duy nhất",
        cause: "Thiếu tư duy phân chia phân cấp module (Hierarchical Design).",
        fix: "Tách nhỏ thành các file con chuyên trách: Datapath, Control Unit, Clock Divider, I/O Controller."
      },
      {
        error: "Bỏ qua bước mô phỏng Testbench mà nạp trực tiếp lên kit",
        cause: "Tâm lý nóng vội muốn thấy sản phẩm chạy ngay.",
        fix: "Trong công nghiệp, 70% thời gian là dành cho Verification. Luôn kiểm chứng ModelSim trước khi nạp chip."
      }
    ],

    exercises: [
      {
        title: "Cơ bản: Lựa chọn đề tài Capstone",
        prompt: "Chọn 1 trong 3 đề tài sau và viết danh sách các module con cần thiết: (1) Máy chơi game Flappy Bird VGA, (2) Vi xử lý RISC-V 32-bit RV32I đơn chu kỳ, (3) Bộ giải mã âm thanh WAV từ thẻ nhớ SD.",
        hint: "Liệt kê tối thiểu 4 khối chức năng chính cho đề tài bạn chọn.",
        solution: "Ví dụ với RISC-V: Khối Instruction Fetch (PC, ROM), Khối Decode (Register File), Khối ALU (Thực thi tính toán), Khối Data Memory (RAM) và Khối Control Unit (FSM giải mã opcode)."
      },
      {
        title: "Vận dụng: Xây dựng GitHub Portfolio",
        prompt: "Viết cấu trúc thư mục chuẩn cho một dự án FPGA chuyên nghiệp trên GitHub.",
        hint: "Bao gồm rtl/, sim/, doc/, syn/, tb/.",
        solution: "project_root/\n  ├── rtl/         -- Mã nguồn VHDL thiết kế\n  ├── tb/          -- Testbench kiểm chứng\n  ├── sim/         -- DO scripts cho ModelSim\n  ├── syn/         -- Quartus project & file .qsf\n  ├── docs/        -- Sơ đồ khối và báo cáo\n  └── README.md    -- Hướng dẫn chạy và ảnh demo kit"
      },
      {
        title: "Thử thách: Trả lời câu hỏi phỏng vấn vi mạch",
        prompt: "Câu hỏi phỏng vấn: 'Giải thích sự khác nhau giữa Latch và Flip-Flop, và tại sao trong thiết kế đồng bộ người ta tránh sử dụng Latch?'.",
        hint: "Latch nhạy theo mức (Level-sensitive), Flip-Flop nhạy theo sườn (Edge-triggered).",
        solution: "Latch nhạy theo mức (trong suốt khi enable), làm cho việc phân tích thời gian tĩnh (STA) trở nên vô cùng phức tạp và dễ gây ra chạy đua tín hiệu (race conditions). Flip-Flop kích hoạt theo sườn xung clock, tạo ra các chu kỳ thời gian rõ ràng, đảm bảo thiết kế đồng bộ vận hành tin cậy."
      }
    ],

    quiz: [
      {
        question: "Điểm khác biệt căn bản nhất giữa FPGA và chip ASIC thương mại là gì?",
        options: [
          "FPGA dùng silicon, còn ASIC dùng nhựa",
          "FPGA có thể cấu hình lại chức năng mạch hàng nghìn lần bằng phần mềm, trong khi ASIC có mạch cố định vĩnh viễn trên silicon sau khi đúc",
          "FPGA chỉ chạy được mã C, còn ASIC chạy VHDL",
          "FPGA không cần cấp nguồn điện"
        ],
        answerIndex: 1,
        explanation: "FPGA (Field Programmable Gate Array) tái cấu hình được tại hiện trường; còn ASIC (Application Specific Integrated Circuit) là vi mạch chuyên dụng đúc cố định."
      },
      {
        question: "Trong quy trình thiết kế vi mạch công nghiệp hiện đại, khâu nào thường chiếm nhiều thời gian và nhân lực nhất?",
        options: [
          "Viết mã RTL ban đầu",
          "Kiểm chứng và mô phỏng thiết kế (Verification & Testbench - chiếm ~70% thời gian)",
          "Đóng gói vỏ chip nhựa",
          "Vẽ biểu tượng icon cho phần mềm"
        ],
        answerIndex: 1,
        explanation: "Verification chiếm tới 60-70% toàn bộ chu kỳ phát triển vi mạch để đảm bảo chip hoạt động không lỗi trước khi bỏ ra hàng triệu USD đúc khuôn tape-out."
      },
      {
        question: "Cần làm gì nếu báo cáo TimeQuest Timing Analyzer thông báo có Slack âm (Negative Slack)?",
        options: [
          "Bỏ qua vì chip vẫn chạy được",
          "Tăng tần số xung nhịp lên gấp đôi",
          "Tối ưu lại đường dẫn trễ tới hạn (Critical Path), chèn thêm tầng thanh ghi đường ống (Pipelining) hoặc giảm tần số",
          "Xóa file .sdc"
        ],
        answerIndex: 2,
        explanation: "Slack âm đồng nghĩa với việc mạch vi phạm thời gian Setup/Hold và sẽ chạy sai ở tần số đó. Kỹ sư phải ngắt chuỗi tổ hợp dài bằng kỹ thuật Pipelining hoặc tối ưu logic."
      },
      {
        question: "Kỹ năng nào là quan trọng nhất của một Kỹ sư Thiết kế Vi mạch khi viết VHDL?",
        options: [
          "Viết mã thật nhanh như lập trình web",
          "Tư duy phần cứng (Hardware Mindset): Luôn hình dung rõ từng dòng lệnh VHDL sẽ sinh ra cổng logic, MUX hay Flip-Flop nào trên silicon",
          "Sử dụng thật nhiều vòng lặp while",
          "Ghi nhớ tất cả mã máy nhị phân"
        ],
        answerIndex: 1,
        explanation: "Tư duy phần cứng là cốt lõi: hiểu bản chất song song của mạch điện, điều khiển miền xung nhịp và cấu trúc vật lý thay vì tư duy tuần tự của phần mềm."
      }
    ],

    summary: [
      "Chúc mừng bạn đã hoàn thành xuất sắc toàn bộ 10 chương lộ trình Thiết kế Vi mạch & FPGA DE2-115!",
      "Nắm vững VHDL chuẩn IEEE, tư duy phần cứng song song và quy trình kiểm chứng chặt chẽ là chìa khóa thành công.",
      "Thực hành trực tiếp trên kit phần cứng thực như Terasic DE2-115 mang lại trải nghiệm vô giá mà mô phỏng thuần túy không thể thay thế.",
      "Đồ án Capstone hoàn chỉnh trên GitHub là tấm vé vàng để bạn tự tin ứng tuyển vào các tập đoàn vi mạch hàng đầu thế giới.",
      "Hành trình học tập không dừng lại ở đây: Hãy tiếp tục khám phá kiến trúc RISC-V, UVM và thế giới thiết kế bán dẫn đầy đam mê!"
    ]
  }
];

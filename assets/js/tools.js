// ==========================================================================
// TOOLS.JS - TIỆN ÍCH HỌC TẬP: CHEAT SHEET, TỪ ĐIỂN, FLASHCARDS & DEBUG LAB
// ==========================================================================

window.VHDL_Tools = (function () {
  let activeTab = 'cheatsheet';
  let currentCardIndex = 0;
  let masteredCards = new Set();
  let flashcardsList = [];

  // ==========================================================================
  // 1. DỮ LIỆU CHEAT SHEET
  // ==========================================================================
  const CHEAT_SHEET_DATA = [
    {
      category: "Khai báo thư viện & Kiểu dữ liệu",
      title: "Thư viện chuẩn IEEE bắt buộc",
      code: `library ieee;
use ieee.std_logic_1164.all; -- Định nghĩa std_logic, std_logic_vector
use ieee.numeric_std.all;    -- Định nghĩa unsigned, signed, phép toán số học`
    },
    {
      category: "Khai báo thư viện & Kiểu dữ liệu",
      title: "Chuyển đổi kiểu dữ liệu (Type Conversions)",
      code: `-- std_logic_vector <-> unsigned
u_val <= unsigned(slv_val);
slv_val <= std_logic_vector(u_val);

-- unsigned <-> integer
int_val <= to_integer(u_val);
u_val   <= to_unsigned(int_val, 8); -- (giá trị số nguyên, số bit)`
    },
    {
      category: "Cấu trúc cơ bản",
      title: "Khuôn mẫu Entity & Architecture",
      code: `entity my_circuit is
  generic (
    WIDTH : natural := 8
  );
  port (
    clk   : in  std_logic;
    rst_n : in  std_logic;
    din   : in  std_logic_vector(WIDTH-1 downto 0);
    dout  : out std_logic_vector(WIDTH-1 downto 0)
  );
end entity my_circuit;

architecture rtl of my_circuit is
  -- Khai báo signal cục bộ tại đây (trước 'begin')
  signal internal_reg : std_logic_vector(WIDTH-1 downto 0);
begin
  -- Logic đồng thời hoặc process tại đây (sau 'begin')
  dout <= internal_reg;
end architecture rtl;`
    },
    {
      category: "Mạch tuần tự",
      title: "D-Flip-Flop chuẩn Reset bất đồng bộ tích cực mức thấp",
      code: `process(clk, rst_n)
begin
  if rst_n = '0' then
    q <= '0';                 -- Reset bất đồng bộ
  elsif rising_edge(clk) then
    if en = '1' then
      q <= d;                 -- Cập nhật đồng bộ theo sườn dương
    end if;
  end if;
end process;`
    },
    {
      category: "Mạch tuần tự",
      title: "D-Flip-Flop chuẩn Reset đồng bộ tích cực mức thấp",
      code: `process(clk)
begin
  if rising_edge(clk) then
    if rst_n = '0' then
      q <= '0';               -- Reset đồng bộ (chờ sườn clock)
    elsif en = '1' then
      q <= d;
    end if;
  end if;
end process;`
    },
    {
      category: "Mạch tổ hợp",
      title: "Gán có điều kiện (WHEN...ELSE) & Gán chọn lựa (WITH...SELECT)",
      code: `-- When...Else (ưu tiên theo thứ tự)
y <= a when sel = "00" else
     b when sel = "01" else
     c when sel = "10" else
     d;

-- With...Select (song song, tất cả trường hợp)
with sel select
  y <= a when "00",
       b when "01",
       c when "10",
       d when others;`
    },
    {
      category: "Máy trạng thái (FSM)",
      title: "Khuôn mẫu FSM 2-Process chuẩn công nghiệp",
      code: `type state_t is (S_IDLE, S_ACTIVE, S_DONE);
signal current_state, next_state : state_t;

-- Process 1: Thanh ghi trạng thái tuần tự
process(clk, rst_n)
begin
  if rst_n = '0' then
    current_state <= S_IDLE;
  elsif rising_edge(clk) then
    current_state <= next_state;
  end if;
end process;

-- Process 2: Logic chuyển trạng thái & ngõ ra tổ hợp
process(current_state, start, done_tick)
begin
  next_state <= current_state; -- Giữ nguyên mặc định tránh Latch
  ready <= '0';
  case current_state is
    when S_IDLE =>
      ready <= '1';
      if start = '1' then next_state <= S_ACTIVE; end if;
    when S_ACTIVE =>
      if done_tick = '1' then next_state <= S_DONE; end if;
    when S_DONE =>
      next_state <= S_IDLE;
  end case;
end process;`
    },
    {
      category: "Chân kit Terasic DE2-115",
      title: "Bảng tra cứu chân vật lý cốt lõi DE2-115 (.qsf)",
      code: `# Xung nhịp hệ thống
set_location_assignment PIN_Y2 -to CLOCK_50

# 4 Nút nhấn (Active-Low)
set_location_assignment PIN_R24 -to KEY[3]
set_location_assignment PIN_N21 -to KEY[2]
set_location_assignment PIN_M21 -to KEY[1]
set_location_assignment PIN_M23 -to KEY[0]

# 8 LED 7 đoạn HEX0 (Active-Low: bit 0 là đoạn a, bit 6 là đoạn g)
set_location_assignment PIN_G18 -to HEX0[0]
set_location_assignment PIN_F22 -to HEX0[1]
set_location_assignment PIN_E17 -to HEX0[2]
set_location_assignment PIN_L26 -to HEX0[3]
set_location_assignment PIN_L25 -to HEX0[4]
set_location_assignment PIN_J22 -to HEX0[5]
set_location_assignment PIN_H22 -to HEX0[6]

# Cổng UART RS-232
set_location_assignment PIN_G9  -to UART_RXD
set_location_assignment PIN_G12 -to UART_TXD

# Cổng VGA (DAC ADV7123)
set_location_assignment PIN_A12 -to VGA_CLK
set_location_assignment PIN_G13 -to VGA_HS
set_location_assignment PIN_C13 -to VGA_VS
set_location_assignment PIN_F11 -to VGA_BLANK_N`
    }
  ];

  // ==========================================================================
  // 2. DỮ LIỆU TỪ ĐIỂN THUẬT NGỮ (GLOSSARY) - 45+ THUẬT NGỮ
  // ==========================================================================
  const GLOSSARY_DATA = [
    {
      term: "ASIC",
      full: "Application-Specific Integrated Circuit",
      vietnamese: "Vi mạch tích hợp chuyên dụng",
      category: "Phần cứng",
      def: "Chip bán dẫn được chế tạo cố định cho một chức năng duy nhất (như CPU Intel, GPU Apple A-series). Hiệu năng cao, tiết kiệm pin tối đa nhưng chi phí sản xuất ban đầu (NRE) hàng triệu USD và không thể sửa đổi sau khi đúc."
    },
    {
      term: "FPGA",
      full: "Field-Programmable Gate Array",
      vietnamese: "Mảng logic khả trình tại hiện trường",
      category: "Phần cứng",
      def: "Chip bán dẫn chứa hàng trăm nghìn khối logic, bộ nhớ nhúng và bộ nhân có thể lập trình cấu hình lại chức năng hàng nghìn lần bằng phần mềm thông qua file bitstream."
    },
    {
      term: "RTL",
      full: "Register-Transfer Level",
      vietnamese: "Mức truyền thanh ghi",
      category: "Thiết kế",
      def: "Phương pháp mô tả mạch số bằng dòng chảy dữ liệu giữa các thanh ghi (Flip-Flops) và các phép toán logic tổ hợp thực hiện trên dòng dữ liệu đó."
    },
    {
      term: "VHDL",
      full: "VHSIC Hardware Description Language",
      vietnamese: "Ngôn ngữ mô tả phần cứng mạch tích hợp siêu tốc độ",
      category: "Cú pháp",
      def: "Ngôn ngữ mô tả phần cứng chuẩn IEEE (IEEE 1076) có tính chặt chẽ cực cao về kiểu dữ liệu, cho phép mô phỏng và tổng hợp các mạch số phức tạp."
    },
    {
      term: "Entity",
      full: "Thực thể giao tiếp",
      vietnamese: "Giao diện ngõ vào/ngõ ra của khối mạch",
      category: "Cú pháp",
      def: "Định nghĩa ranh giới bên ngoài của một module phần cứng, liệt kê các chân tín hiệu (PORT) và tham số cấu hình (GENERIC). Giống như vỏ hộp IC với các chân cắm."
    },
    {
      term: "Architecture",
      full: "Kiến trúc mạch",
      vietnamese: "Nội dung triển khai logic bên trong",
      category: "Cú pháp",
      def: "Phần thân bên trong của module, mô tả cách thức kết nối dây, các cổng logic, bộ nhớ và các tiến trình (process) để thực hiện chức năng đã định nghĩa ở Entity."
    },
    {
      term: "LUT",
      full: "Look-Up Table",
      vietnamese: "Bảng tra chân lý",
      category: "Phần cứng",
      def: "Tế bào SRAM nhỏ (thường là 4 ngõ vào trên Cyclone IV) đóng vai trò phần tử logic cơ bản để thực hiện bất kỳ hàm logic tổ hợp Boolean nào."
    },
    {
      term: "LE",
      full: "Logic Element",
      vietnamese: "Tế bào logic cơ sở",
      category: "Phần cứng",
      def: "Đơn vị kiến trúc nhỏ nhất trên FPGA Intel Cyclone IV, gồm 1 bộ LUT 4 ngõ vào, 1 thanh ghi Flip-Flop lập trình được và logic chuỗi mang (Carry Chain)."
    },
    {
      term: "Process",
      full: "Tiến trình tuần tự trong mô phỏng",
      vietnamese: "Khối lệnh thực thi theo danh sách nhạy cảm",
      category: "Cú pháp",
      def: "Cấu trúc trong VHDL đóng gói các câu lệnh tuần tự (IF, CASE). Process chỉ được đánh giá lại khi có sự thay đổi giá trị trên các tín hiệu trong Sensitivity List."
    },
    {
      term: "Signal",
      full: "Tín hiệu phần cứng",
      vietnamese: "Đường dây dẫn vật lý nối mạch",
      category: "Cú pháp",
      def: "Mô tả đường dây kết nối thực tế trên silicon. Giá trị của Signal chỉ được cập nhật sau khi kết thúc chu kỳ mô phỏng (gán trễ delta delay)."
    },
    {
      term: "Variable",
      full: "Biến cục bộ",
      vietnamese: "Biến nhớ tức thời",
      category: "Cú pháp",
      def: "Chỉ được khai báo bên trong Process hoặc Function, được cập nhật giá trị ngay lập tức (zero time). Thường dùng làm biến đếm vòng lặp hoặc lưu kết quả tính toán tạm thời."
    },
    {
      term: "Flip-Flop (D-FF)",
      full: "D-Type Flip-Flop",
      vietnamese: "Phần tử nhớ 1-bit kích hoạt theo sườn xung",
      category: "Phần cứng",
      def: "Mạch tuần tự lưu giữ 1 bit thông tin. Chỉ nạp giá trị từ ngõ vào D sang ngõ ra Q chính xác tại thời điểm sườn xung nhịp (rising_edge hoặc falling_edge) xuất hiện."
    },
    {
      term: "Latch",
      full: "Chốt dữ liệu",
      vietnamese: "Phần tử nhớ kích hoạt theo mức điện áp (Level-sensitive)",
      category: "Phần cứng",
      def: "Mạch nhớ trong suốt khi tín hiệu kích hoạt ở mức cao. Trong thiết kế số đồng bộ, Latch vô tình (Inferred Latch) là lỗi nguy hiểm cần tuyệt đối tránh do làm phức tạp phân tích định thời."
    },
    {
      term: "Setup Time (t_su)",
      full: "Thời gian thiết lập",
      vietnamese: "Khoảng thời gian tín hiệu phải ổn định TRƯỚC sườn clock",
      category: "Thời gian",
      def: "Khoảng thời gian tối thiểu mà dữ liệu ở ngõ vào D phải giữ nguyên ổn định trước khi sườn dương xung nhịp xuất hiện để Flip-Flop bắt đúng dữ liệu."
    },
    {
      term: "Hold Time (t_h)",
      full: "Thời gian duy trì",
      vietnamese: "Khoảng thời gian tín hiệu phải ổn định SAU sườn clock",
      category: "Thời gian",
      def: "Khoảng thời gian tối thiểu mà dữ liệu ở ngõ vào D phải tiếp tục được giữ nguyên sau khi sườn dương xung nhịp đã diễn ra."
    },
    {
      term: "Slack",
      full: "Độ chênh lệch thời gian dự phòng",
      vietnamese: "Khoảng cách an toàn định thời",
      category: "Thời gian",
      def: "Độ lệch giữa thời gian tín hiệu thực tế đến và thời gian yêu cầu tối đa. Slack > 0 là đạt chuẩn (Timing Met). Slack < 0 (Negative Slack) là vi phạm định thời (Timing Violation)."
    },
    {
      term: "Clock Skew",
      full: "Độ lệch xung nhịp",
      vietnamese: "Sự chênh lệch thời điểm đến của xung clock",
      category: "Thời gian",
      def: "Khoảng chênh lệch thời gian khi cùng một sườn xung nhịp truyền đến hai Flip-Flop khác nhau trên chip do độ dài đường dây vật lý không đều."
    },
    {
      term: "Metastability",
      full: "Trạng thái bất ổn định lượng tử",
      vietnamese: "Điện áp lơ lửng không xác định của Flip-Flop",
      category: "Thời gian",
      def: "Xảy ra khi vi phạm thời gian Setup/Hold. Ngõ ra Flip-Flop bị dao động ở mức giữa 0 và 1 trong thời gian ngắn trước khi sụp về mức ngẫu nhiên, gây sai lệch hệ thống."
    },
    {
      term: "FSM",
      full: "Finite State Machine",
      vietnamese: "Máy trạng thái hữu hạn",
      category: "Kiến trúc",
      def: "Mô hình mạch tuần tự bao gồm một tập hợp các trạng thái hữu hạn, các điều kiện chuyển trạng thái và các ngõ ra tương ứng (Moore hoặc Mealy)."
    },
    {
      term: "Moore Machine",
      full: "Máy trạng thái Moore",
      vietnamese: "Ngõ ra chỉ phụ thuộc vào trạng thái hiện tại",
      category: "Kiến trúc",
      def: "Kiến trúc FSM trong đó các tín hiệu ngõ ra chỉ phụ thuộc duy nhất vào trạng thái hiện tại (Current State) của hệ thống, không bị ảnh hưởng bởi biến động tức thời của ngõ vào."
    },
    {
      term: "Mealy Machine",
      full: "Máy trạng thái Mealy",
      vietnamese: "Ngõ ra phụ thuộc cả trạng thái hiện tại lẫn ngõ vào tức thời",
      category: "Kiến trúc",
      def: "Kiến trúc FSM trong đó các ngõ ra phụ thuộc đồng thời vào trạng thái hiện tại và tín hiệu ngõ vào ngay lúc đó. Phản ứng nhanh hơn 1 chu kỳ so với Moore nhưng dễ xuất hiện xung kim (glitch)."
    },
    {
      term: "M9K Block",
      full: "Khối nhớ nhúng 9-Kbit",
      vietnamese: "Bộ nhớ SRAM phần cứng nhúng trên Cyclone IV",
      category: "Phần cứng",
      def: "Khối nhớ phần cứng chuyên dụng có dung lượng 9,216 bit (bao gồm bit chẵn lẻ), hỗ trợ RAM đơn cổng, RAM 2 cổng và ROM tốc độ cao (> 300 MHz)."
    },
    {
      term: "PLL",
      full: "Phase-Locked Loop",
      vietnamese: "Vòng khóa pha tần số",
      category: "Phần cứng",
      def: "Khối tương tự/số chuyên dụng trên chip dùng để nhân, chia, dịch pha và ổn định tần số xung nhịp với độ rung pha (jitter) cực thấp."
    },
    {
      term: "CDC",
      full: "Clock Domain Crossing",
      vietnamese: "Vượt miền xung nhịp",
      category: "Thời gian",
      def: "Hiện tượng tín hiệu truyền từ một khối mạch chạy bằng xung nhịp này sang một khối mạch chạy bằng xung nhịp khác bất đồng bộ, đòi hỏi mạch đồng bộ đặc biệt để chống Metastability."
    },
    {
      term: "Testbench",
      full: "Môi trường kiểm chứng phần mềm",
      vietnamese: "Bàn thí nghiệm ảo trong mô phỏng",
      category: "Mô phỏng",
      def: "Đoạn mã VHDL không tổng hợp thành mạch phần cứng thực, dùng để cấp xung clock, tín hiệu kích thích (stimulus) và kiểm tra tự động phản hồi của mạch cần kiểm thử (UUT)."
    },
    {
      term: "UUT / DUT",
      full: "Unit Under Test / Device Under Test",
      vietnamese: "Khối mạch đang được kiểm chứng",
      category: "Mô phỏng",
      def: "Linh kiện thiết kế được khởi tạo bên trong testbench để kiểm tra tính đúng đắn của logic."
    },
    {
      term: "SOF",
      full: "SRAM Object File",
      vietnamese: "File nhị phân nạp trực tiếp vào SRAM của FPGA",
      category: "Phần cứng",
      def: "File cấu hình nạp qua cổng JTAG vào bộ nhớ SRAM tĩnh của Cyclone IV. Tốc độ nạp nhanh tức thì nhưng sẽ mất dữ liệu khi mất nguồn điện."
    },
    {
      term: "POF / JIC",
      full: "Programmer Object File / JTAG Indirect Configuration",
      vietnamese: "File nạp vào chip Flash nhớ ngoài (EPCS64)",
      category: "Phần cứng",
      def: "File cấu hình nạp vào chip bộ nhớ Flash SPI trên bo mạch. Giúp FPGA tự động nạp chương trình mỗi khi bật nguồn điện (Non-volatile)."
    },
    {
      term: "TimeQuest",
      full: "TimeQuest Timing Analyzer",
      vietnamese: "Bộ công cụ phân tích thời gian tĩnh (STA) của Quartus",
      category: "Công cụ",
      def: "Phần mềm đo đếm thời gian trễ đường dây, kiểm tra vi phạm Setup, Hold và tính toán tần số hoạt động tối đa Fmax dựa trên file ràng buộc .sdc."
    },
    {
      term: "SignalTap II",
      full: "Embedded Logic Analyzer",
      vietnamese: "Máy phân tích logic nhúng nội suy",
      category: "Công cụ",
      def: "Công cụ cao cấp của Intel Quartus cho phép cắm que đo phần mềm vào các dây dẫn bên trong FPGA và truyền dữ liệu sóng thực tế về máy tính qua cáp USB-Blaster."
    },
    {
      term: "Synthesis",
      full: "Quá trình tổng hợp logic RTL",
      vietnamese: "Chuyển mã nguồn VHDL thành sơ đồ cổng logic (Gate-level netlist)",
      category: "Quy trình",
      def: "Bước biên dịch đầu tiên của Quartus, phân tích cú pháp VHDL và ánh xạ các biểu thức toán học thành mạng kết nối các cổng logic chuẩn."
    },
    {
      term: "Fitter (Place & Route)",
      full: "Bộ định vị và đi dây",
      vietnamese: "Bố trí linh kiện và kết nối đường dây vật lý trên chip",
      category: "Quy trình",
      def: "Bước tiếp theo của Quartus: Gán từng cổng logic vào các ô LE, M9K cụ thể trên chip và chạy thuật toán tối ưu đi dây kim loại để giảm độ trễ."
    },
    {
      term: "Debouncing",
      full: "Chống rung phím cơ học",
      vietnamese: "Lọc nhiễu dội tiếp điểm của nút nhấn",
      category: "Phần cứng",
      def: "Mạch lọc số dùng bộ đếm hoặc thanh ghi dịch để loại bỏ các xung dao động bất thường kéo dài 5-20 ms khi tiếp điểm kim loại của phím đóng/mở."
    },
    {
      term: "Common Anode",
      full: "Dương chung",
      vietnamese: "Cực Anot chung của LED 7 đoạn",
      category: "Phần cứng",
      def: "Cấu hình LED 7 đoạn trên bo mạch DE2-115 trong đó tất cả cực dương được nối lên nguồn VCC. Để làm sáng một thanh LED, chân tương ứng phải được cấp mức logic '0' (Active-Low)."
    },
    {
      term: "Active-Low",
      full: "Tích cực mức thấp",
      vietnamese: "Mức logic '0' biểu thị trạng thái BẬT/KÍCH HOẠT",
      category: "Quy ước",
      def: "Quy ước tín hiệu trong đó mức điện áp thấp (0V / logic '0') đại diện cho hành động có hiệu lực (ví dụ: rst_n = 0 là Reset, KEY nhấn là 0)."
    },
    {
      term: "Critical Path",
      full: "Đường dẫn trễ tới hạn",
      vietnamese: "Đường truyền tín hiệu có độ trễ lớn nhất giữa hai Flip-Flop",
      category: "Thời gian",
      def: "Chuỗi cổng logic tổ hợp có tổng thời gian truyền dẫn dài nhất trong toàn bộ hệ thống. Độ trễ của đường dẫn này quyết định tần số xung nhịp tối đa (Fmax) của chip."
    },
    {
      term: "Pipelining",
      full: "Kỹ thuật đường ống hóa phần cứng",
      vietnamese: "Chèn thêm các tầng thanh ghi Flip-Flop vào giữa chuỗi logic tổ hợp",
      category: "Thiết kế",
      def: "Phương pháp ngắt một chuỗi logic tổ hợp dài thành nhiều công đoạn ngắn hơn được ngăn cách bởi các Flip-Flop, giúp tăng vọt tần số xung nhịp Fmax và thông lượng (Throughput)."
    },
    {
      term: "Glitch",
      full: "Xung kim / Xung gai ký sinh",
      vietnamese: "Xung điện áp không mong muốn xuất hiện trong thời gian cực ngắn",
      category: "Phần cứng",
      def: "Sinh ra do sự chênh lệch độ trễ truyền dẫn giữa các đường tín hiệu ngõ vào của cổng logic tổ hợp trước khi mạch đạt trạng thái cân bằng. Triệt tiêu bằng cách đệm Flip-Flop đồng bộ."
    },
    {
      term: "Fan-out",
      full: "Khả năng tải ngõ ra",
      vietnamese: "Số lượng cổng logic mà một ngõ ra có thể điều khiển trực tiếp",
      category: "Phần cứng",
      def: "Đại lượng đo lường số lượng đầu vào mà một tín hiệu logic có thể lái. Fan-out quá cao làm tăng điện dung ký sinh, gây trễ tín hiệu và suy giảm chất lượng sườn xung."
    },
    {
      term: "Fan-in",
      full: "Số lượng ngõ vào tối đa",
      vietnamese: "Số ngõ vào mà một tế bào logic có thể nhận",
      category: "Phần cứng",
      def: "Số lượng ngõ vào tối đa của một khối logic vật lý (như LUT 4 ngõ vào của Cyclone IV). Khi hàm logic có số biến vượt quá Fan-in, Quartus phải ghép nhiều LUT nối tầng."
    },
    {
      term: "One-Hot Encoding",
      full: "Mã hóa 1-Hot",
      vietnamese: "Kiểu mã hóa FSM trong đó mỗi trạng thái dùng riêng 1 Flip-Flop",
      category: "Kiến trúc",
      def: "Phương pháp mã hóa trạng thái dùng N Flip-Flop cho N trạng thái (tại mỗi thời điểm chỉ có đúng 1 FF bằng '1'). Tiết kiệm logic giải mã MUX và tăng tốc độ chuyển mạch, rất tối ưu cho kiến trúc giàu FF của FPGA."
    },
    {
      term: "Gray Code",
      full: "Mã Gray",
      vietnamese: "Hệ mã nhị phân chỉ đổi duy nhất 1 bit giữa hai số liên tiếp",
      category: "Thiết kế",
      def: "Chuẩn mã hóa trong đó hai giá trị liền kề chỉ khác nhau đúng 1 vị trí bit. Dùng phổ biến trong bộ đếm con trỏ Asynchronous FIFO để chống hiện tượng đọc sai khi vượt miền xung nhịp."
    },
    {
      term: "FIFO",
      full: "First-In First-Out Buffer",
      vietnamese: "Hàng đợi dữ liệu vào trước ra trước",
      category: "Kiến trúc",
      def: "Khối bộ nhớ đệm cho phép dữ liệu ghi vào trước được đọc ra trước. Gồm 2 loại: Synchronous FIFO (cùng xung nhịp) và Asynchronous FIFO (vượt hai miền xung nhịp độc lập)."
    },
    {
      term: "BCD",
      full: "Binary-Coded Decimal",
      vietnamese: "Mã nhị phân thập phân",
      category: "Kiểu dữ liệu",
      def: "Quy chuẩn mã hóa dùng 4 bit nhị phân để biểu diễn từng chữ số thập phân từ 0 đến 9 (từ 0000 đến 1001), các tổ hợp từ 1010 đến 1111 không được sử dụng."
    },
    {
      term: "MTBF",
      full: "Mean Time Between Failures",
      vietnamese: "Thời gian trung bình giữa các lần hỏng hóc",
      category: "Thời gian",
      def: "Chỉ số xác suất thống kê thời gian hoạt động tin cậy trước khi một Flip-Flop bị sụp do hiện tượng bất ổn định Metastability. Mạch 2-FF làm tăng MTBF từ vài giây lên đến hàng nghìn năm."
    }
  ];

  // ==========================================================================
  // 3. DỮ LIỆU FLASHCARDS (20+ THẺ HỎI ĐÁP ÔN TẬP ĐỈNH CAO)
  // ==========================================================================
  const FLASHCARDS_DATA = [
    {
      id: "fc-1",
      topic: "Mạch tổ hợp",
      question: "Điều gì sẽ xảy ra nếu một câu lệnh IF trong Process tổ hợp bị thiếu nhánh ELSE?",
      answer: "Quartus sẽ tổng hợp ra một Latch (chốt dữ liệu) không mong muốn vì mạch phần cứng buộc phải ghi nhớ giá trị cũ khi điều kiện IF không thỏa mãn.",
      tip: "Luôn gán giá trị mặc định cho tín hiệu ở ngay đầu process tổ hợp!"
    },
    {
      id: "fc-2",
      topic: "Khái niệm",
      question: "Sự khác biệt căn bản giữa SIGNAL và VARIABLE trong VHDL là gì?",
      answer: "SIGNAL mô tả đường dây nối vật lý, được cập nhật giá trị sau độ trễ delta (cuối chu kỳ). VARIABLE là biến nhớ tức thời trong Process, cập nhật ngay lập tức.",
      tip: "Trong thiết kế RTL, 95% trường hợp ta sử dụng SIGNAL."
    },
    {
      id: "fc-3",
      topic: "Thời gian",
      question: "Setup Time (t_su) của Flip-Flop là gì?",
      answer: "Là khoảng thời gian tối thiểu mà dữ liệu ngõ vào phải giữ nguyên ổn định TRƯỚC khi sườn xung nhịp xuất hiện để Flip-Flop ghi nhận chính xác.",
      tip: "Nếu vi phạm Setup Time, Flip-Flop có nguy cơ rơi vào trạng thái bất ổn định (Metastability)."
    },
    {
      id: "fc-4",
      topic: "Phần cứng",
      question: "Trên bo mạch Terasic DE2-115, các nút nhấn KEY[3:0] và LED 7 đoạn HEX hoạt động ở mức tích cực nào?",
      answer: "Đều là Active-Low (tích cực mức thấp). Nhấn nút = mức '0'. Sáng thanh LED 7 đoạn = xuất mức '0'.",
      tip: "HEX của DE2-115 là loại Anot chung (Common Anode)."
    },
    {
      id: "fc-5",
      topic: "Mạch tuần tự",
      question: "Làm thế nào để tạo nhịp 1 Hz từ nguồn xung 50 MHz trên kit DE2-115 mà không làm lệch clock?",
      answer: "Dùng bộ đếm modulo 50,000,000 chạy trên xung 50 MHz và phát ra một xung kích hoạt (Enable Tick) rộng đúng 1 chu kỳ clock tại mốc đếm cuối.",
      tip: "Không dùng ngõ ra bộ đếm làm chân clock cho khối khác vì sẽ gây Clock Skew!"
    },
    {
      id: "fc-6",
      topic: "FSM",
      question: "Điểm khác biệt chính giữa máy trạng thái Moore và Mealy là gì?",
      answer: "Ngõ ra của Moore chỉ phụ thuộc vào trạng thái hiện tại. Ngõ ra của Mealy phụ thuộc vào cả trạng thái hiện tại lẫn ngõ vào tức thời.",
      tip: "Moore an toàn và không bị glitch, Mealy phản ứng nhanh hơn 1 chu kỳ."
    },
    {
      id: "fc-7",
      topic: "Kiểu dữ liệu",
      question: "Thư viện IEEE nào cung cấp hai kiểu dữ liệu số học 'unsigned' và 'signed' chuẩn?",
      answer: "Thư viện `ieee.numeric_std.all`. Tuyệt đối không dùng thư viện phi chuẩn `std_logic_arith` hay `std_logic_unsigned`.",
      tip: "Luôn nhớ: library ieee; use ieee.numeric_std.all;"
    },
    {
      id: "fc-8",
      topic: "Quy trình",
      question: "Sự khác biệt giữa file cấu hình .sof và file .jic trên kit DE2-115 là gì?",
      answer: "File .sof nạp thẳng vào SRAM của FPGA và mất khi tắt nguồn. File .jic nạp vào chip nhớ Flash EPCS64 bên ngoài, giúp lưu vĩnh viễn khi mất điện.",
      tip: "Dùng .sof khi debug nhanh, dùng .jic khi hoàn thiện sản phẩm."
    },
    {
      id: "fc-9",
      topic: "Thời gian",
      question: "Slack dương (Positive Slack) trong báo cáo TimeQuest có ý nghĩa gì?",
      answer: "Nghĩa là thiết kế đáp ứng tốt yêu cầu định thời (Timing Met). Tín hiệu đến đích sớm hơn thời hạn yêu cầu một khoảng thời gian bằng giá trị Slack.",
      tip: "Nếu Slack < 0 (Negative Slack), chip chạy ở tần số đó sẽ bị lỗi dữ liệu!"
    },
    {
      id: "fc-10",
      topic: "Phần cứng",
      question: "Khối nhớ nhúng M9K trên chip Cyclone IV có hỗ trợ chân Reset bất đồng bộ cho toàn bộ ô nhớ không?",
      answer: "Không. M9K là phần cứng SRAM vật lý không có chân xóa đồng loạt. Thêm reset bất đồng bộ vào mảng nhớ sẽ khiến Quartus chuyển sang dùng hàng nghìn LEs lãng phí.",
      tip: "Chỉ viết reset cho thanh ghi địa chỉ hoặc cờ đọc/ghi, không reset dữ liệu RAM!"
    },
    {
      id: "fc-11",
      topic: "Xung nhịp",
      question: "Mạch 2-FF Synchronizer dùng để giải quyết vấn đề gì khi vượt miền xung nhịp (CDC)?",
      answer: "Dùng để triệt tiêu hiện tượng Metastability cho tín hiệu điều khiển đơn bit khi nhảy từ miền xung này sang miền xung khác bất đồng bộ.",
      tip: "FF thứ nhất hấp thụ dao động, FF thứ hai cung cấp mức logic ổn định."
    },
    {
      id: "fc-12",
      topic: "Mô phỏng",
      question: "Câu lệnh ASSERT ... REPORT ... SEVERITY trong VHDL dùng để làm gì?",
      answer: "Dùng trong Testbench để kiểm tra tính đúng đắn tự động của mạch. Nếu điều kiện sau ASSERT sai (FALSE), thông điệp REPORT sẽ được in ra console ModelSim.",
      tip: "Severity failure sẽ dừng ngay quá trình mô phỏng khi phát hiện lỗi."
    },
    {
      id: "fc-13",
      topic: "Cú pháp",
      question: "Cấu trúc GENERATE trong VHDL dùng để làm gì?",
      answer: "Dùng để tự động sinh hàng loạt cổng logic, thanh ghi hoặc module con lặp lại song song trong phần cứng dựa theo tham số vòng lặp.",
      tip: "Tương đương vòng lặp for trong phần mềm nhưng sinh ra mạch vật lý song song đồng thời."
    },
    {
      id: "fc-14",
      topic: "VGA",
      question: "Tại sao tín hiệu RGB xuất ra cổng VGA bắt buộc phải bằng 0 trong vùng Blanking (ngoài vùng 640x480)?",
      answer: "Để không làm sai lệch mức điện áp chuẩn mức đen (Black Level) trong thời gian màn hình quét ngược tia điện tử, tránh làm hỏng độ tương phản.",
      tip: "Dùng điều kiện: active_area <= (h < 640) and (v < 480);"
    },
    {
      id: "fc-15",
      topic: "Cú pháp",
      question: "Cú pháp chuẩn để kích hoạt một sự kiện theo sườn dương xung nhịp trong VHDL là gì?",
      answer: "if rising_edge(clk) then ... hoặc if (clk'event and clk = '1') then ... (khuyên dùng rising_edge vì dễ đọc và chuẩn IEEE hơn).",
      tip: "Hàm rising_edge(clk) lọc bỏ các chuyển đổi không hợp lệ như từ 'X' sang '1'."
    },
    {
      id: "fc-16",
      topic: "Phần cứng",
      question: "Hiện tượng chập chờn (Contact Bounce) của nút nhấn cơ học kéo dài khoảng bao lâu?",
      answer: "Khoảng 5 ms đến 20 ms. Trong thời gian này, các tiếp điểm kim loại va đập tạo ra hàng trăm xung nhịp giả nếu không có mạch Debounce lọc nhiễu.",
      tip: "Dùng bộ đếm 20 ms (1,000,000 chu kỳ của 50 MHz) để lọc dội phím an toàn."
    },
    {
      id: "fc-17",
      topic: "Thiết kế",
      question: "Multiple Drivers Error là gì và tại sao nó nguy hiểm trong thiết kế phần cứng?",
      answer: "Là lỗi khi có 2 process hoặc 2 câu lệnh gán đồng thời cùng cố gắng lái giá trị cho 1 tín hiệu duy nhất. Trong thực tế, điều này tương đương với chập ngắn mạch nguồn và mass trên chip.",
      tip: "Mỗi tín hiệu chỉ được phép gán giá trị bên trong DUY NHẤT một process hoặc một câu lệnh concurrently."
    },
    {
      id: "fc-18",
      topic: "UART",
      question: "Tại sao trong bộ thu UART (UART RX), người ta thường lấy mẫu dữ liệu tại điểm giữa của mỗi bit (Mid-bit sampling)?",
      answer: "Vì tại điểm giữa của bit (ở nhịp đếm N/2), điện áp tín hiệu đạt trạng thái ổn định nhất và cách xa hai biên chuyển tiếp có thể bị méo hoặc trôi pha.",
      tip: "Bộ thu UART thường dùng xung nhịp lấy mẫu nhanh gấp 16 lần tốc độ baud (16x oversampling)."
    },
    {
      id: "fc-19",
      topic: "Công cụ",
      question: "TCL script (file .do) trong ModelSim mang lại lợi ích gì cho kỹ sư?",
      answer: "Tự động hóa toàn bộ quy trình: Tạo thư viện work, biên dịch mã nguồn, nạp testbench, thêm các dạng sóng quan tâm và chạy mô phỏng chỉ bằng 1 câu lệnh `do sim.do`.",
      tip: "Tiết kiệm hàng trăm giờ thao tác nhấp chuột thủ công lặp đi lặp lại."
    },
    {
      id: "fc-20",
      topic: "Nâng cao",
      question: "Kiểu dữ liệu RECORD trong VHDL mang lại ưu điểm gì lớn nhất?",
      answer: "Gom nhóm nhiều tín hiệu liên quan (như data, valid, ready, error) vào một biến duy nhất tương tự struct trong C, giúp việc nối dây giữa các module gọn gàng và không nhầm lẫn.",
      tip: "Cực kỳ hữu ích khi thiết kế các giao diện Bus như AXI-Stream, Wishbone, Avalon."
    }
  ];

  // ==========================================================================
  // 4. DỮ LIỆU PHÒNG THỰC HÀNH SỬA LỖI (DEBUG LAB) - 5 TÌNH HUỐNG THỰC TẾ
  // ==========================================================================
  const DEBUG_LAB_DATA = [
    {
      id: "lab-1",
      title: "Lỗi 1: Vô tình suy luận Latch (Inferred Latch)",
      severity: "Rất nguy hiểm (High Risk)",
      category: "Mạch tổ hợp",
      problemDescription: "Bạn viết một bộ chọn kênh (Multiplexer 2-sang-1) nhưng trong báo cáo Quartus xuất hiện cảnh báo: 'Warning: Inferring latch for signal 'y''. Mạch hoạt động chập chờn khi nhiệt độ tăng.",
      buggyCode: `-- MÃ LỖI: Thiếu gán giá trị khi sel = '0'
process(sel, a, b)
begin
  if sel = '1' then
    y <= a;
  end if;
  -- Không có nhánh else!
end process;`,
      errorMessage: "Warning (10631): VHDL Process Statement warning at mux.vhd(8): inferring latch(es) for signal or variable 'y', which holds its previous value in one or more paths through the process",
      hardwareAnalysis: "Phần cứng không thể đoán biết ngõ ra 'y' bằng bao nhiêu khi sel = '0'. Do đó, trình tổng hợp buộc phải tạo ra một mạch chốt (Latch) để ghi nhớ giá trị cũ. Latch này rất nhạy với xung nhiễu (glitches) và làm hỏng phân tích định thời STA.",
      fixedCode: `-- CÁCH SỬA ĐÚNG: Luôn đảm bảo mọi nhánh đều có gán giá trị
process(sel, a, b)
begin
  if sel = '1' then
    y <= a;
  else
    y <= b; -- Đầy đủ tất cả trường hợp
  end if;
end process;

-- HOẶC: Gán giá trị mặc định ở đầu process
process(sel, a, b)
begin
  y <= b; -- Giá trị mặc định
  if sel = '1' then
    y <= a;
  end if;
end process;`,
      takeaway: "Trong process mô tả mạch tổ hợp, MỌI tín hiệu ngõ ra phải được gán giá trị trong TẤT CẢ các nhánh rẽ nhánh (IF/ELSE hoặc CASE/WHEN OTHERS)."
    },
    {
      id: "lab-2",
      title: "Lỗi 2: Xung đột đa nguồn phát (Multiple Drivers)",
      severity: "Lỗi biên dịch nghiêm trọng (Compiler Error)",
      category: "Kiến trúc",
      problemDescription: "Người mới học thường nghĩ process giống các hàm phần mềm và gán cùng một tín hiệu 'led' ở hai process khác nhau.",
      buggyCode: `-- MÃ LỖI: Hai process cùng điều khiển tín hiệu led
process(clk)
begin
  if rising_edge(clk) then
    led <= flag_a;
  end if;
end process;

process(clk)
begin
  if rising_edge(clk) then
    if emergency = '1' then
      led <= '1';
    end if;
  end if;
end process;`,
      errorMessage: "Error (10028): Can't resolve multiple constant drivers for net 'led' at top.vhd",
      hardwareAnalysis: "Tín hiệu trong VHDL đại diện cho một sợi dây đồng vật lý trên chip. Bạn đang nối đầu ra của 2 Flip-Flop vào chung một sợi dây. Nếu một FF xuất mức '1' (3.3V) và FF kia xuất mức '0' (0V), mạch sẽ bị ngắn mạch đốt cháy đường dây!",
      fixedCode: `-- CÁCH SỬA ĐÚNG: Gom toàn bộ logic của tín hiệu 'led' vào MỘT process duy nhất
process(clk)
begin
  if rising_edge(clk) then
    if emergency = '1' then
      led <= '1';      -- Ưu tiên trường hợp khẩn cấp
    else
      led <= flag_a;  -- Trạng thái bình thường
    end if;
  end if;
end process;`,
      takeaway: "Mỗi tín hiệu chỉ được phép gán giá trị tại MỘT vị trí duy nhất trong kiến trúc (hoặc trong 1 process duy nhất)."
    },
    {
      id: "lab-3",
      title: "Lỗi 3: Không khớp kiểu dữ liệu khi thực hiện phép cộng",
      severity: "Lỗi cú pháp (Type Mismatch)",
      category: "Kiểu dữ liệu",
      problemDescription: "Bạn muốn tăng giá trị đếm bằng lệnh `count <= count + 1;` nhưng ModelSim/Quartus báo lỗi không tìm thấy toán tử '+'.",
      buggyCode: `-- MÃ LỖI: count là kiểu std_logic_vector
architecture rtl of counter is
  signal count : std_logic_vector(7 downto 0);
begin
  process(clk)
  begin
    if rising_edge(clk) then
      count <= count + 1; -- BÁO LỖI!
    end if;
  end process;
end architecture;`,
      errorMessage: "Error: No feasible entries for subprogram '+' with arguments of types std_logic_vector and integer",
      hardwareAnalysis: "Theo chuẩn IEEE 1076, `std_logic_vector` chỉ là một mảng các dây dẫn logic độc lập, không mang ý nghĩa số học (không biết là số bù 2, số không dấu hay chuỗi mã hóa). Trình biên dịch từ chối làm toán trên một mảng dây thuần túy.",
      fixedCode: `-- CÁCH SỬA ĐÚNG: Khai báo tín hiệu là kiểu unsigned từ numeric_std
use ieee.numeric_std.all;

architecture rtl of counter is
  signal count_reg : unsigned(7 downto 0) := (others => '0');
begin
  process(clk)
  begin
    if rising_edge(clk) then
      count_reg <= count_reg + 1; -- Hợp lệ 100%!
    end if;
  end process;

  -- Nếu cổng ngõ ra yêu cầu std_logic_vector:
  count_out <= std_logic_vector(count_reg);
end architecture;`,
      takeaway: "Dùng `unsigned` hoặc `signed` cho các biến tính toán số học, và chỉ ép kiểu sang `std_logic_vector` ở các cổng giao tiếp ngoài."
    },
    {
      id: "lab-4",
      title: "Lỗi 4: Vi phạm cấu trúc Reset bất đồng bộ",
      severity: "Sai lệch phần cứng (Synthesizer Warning/Error)",
      category: "Mạch tuần tự",
      problemDescription: "Người lập trình đặt thêm điều kiện kiểm tra tín hiệu khác bên trong phần Reset bất đồng bộ.",
      buggyCode: `-- MÃ LỖI: Kiểm tra enable bên trong điều kiện reset
process(clk, rst_n)
begin
  if rst_n = '0' and en = '1' then -- LỖI PHẦN CỨNG!
    q <= '0';
  elsif rising_edge(clk) then
    q <= d;
  end if;
end process;`,
      errorMessage: "Error: Asynchronous reset condition must be independent of clock and enable signals",
      hardwareAnalysis: "Chân Clear/Reset bất đồng bộ trên Flip-Flop phần cứng của Cyclone IV là một cổng vật lý chuyên dụng nối thẳng vào tế bào nhớ. Nó không có cổng logic AND đi kèm với tín hiệu 'en'. Viết như vậy không thể tổng hợp được thành D-FF thực tế.",
      fixedCode: `-- CÁCH SỬA ĐÚNG: Nhánh Reset bất đồng bộ chỉ kiểm tra duy nhất rst_n
process(clk, rst_n)
begin
  if rst_n = '0' then
    q <= '0'; -- Chỉ có duy nhất rst_n
  elsif rising_edge(clk) then
    if en = '1' then
      q <= d;  -- Điều kiện enable được kiểm tra đồng bộ bên trong sườn clock
    end if;
  end if;
end process;`,
      takeaway: "Nhánh Reset bất đồng bộ phải đứng độc lập tuyệt đối: `if rst_n = '0' then ... elsif rising_edge(clk) then`."
    },
    {
      id: "lab-5",
      title: "Lỗi 5: Thiếu tín hiệu trong Sensitivity List của mạch tổ hợp",
      severity: "Mô phỏng sai lệch so với phần cứng thực (Mismatch Bug)",
      category: "Mô phỏng",
      problemDescription: "Mạch cổng AND 2 ngõ vào: `y <= a and b;` viết bằng process nhưng bỏ quên tín hiệu `b` trong danh sách nhạy cảm.",
      buggyCode: `-- MÃ LỖI: Thiếu b trong sensitivity list
process(a) -- Chỉ có a!
begin
  y <= a and b;
end process;`,
      errorMessage: "Quartus tổng hợp ra mạch AND bình thường, nhưng trên ModelSim khi tín hiệu 'b' đổi từ 0 lên 1, ngõ ra 'y' KHÔNG hề thay đổi!",
      hardwareAnalysis: "Đây là lỗi nguy hiểm nhất (Simulation-Synthesis Mismatch): Trình tổng hợp Quartus nhìn vào biểu thức logic để sinh cổng AND, nhưng trình mô phỏng ModelSim chỉ kích hoạt process khi có sự kiện trên danh sách `process(a)`. Kết quả mô phỏng khác hoàn toàn phần cứng thật!",
      fixedCode: `-- CÁCH SỬA ĐÚNG 1 (VHDL-1993): Đưa đầy đủ tất cả ngõ vào
process(a, b)
begin
  y <= a and b;
end process;

-- CÁCH SỬA ĐÚNG 2 (VHDL-2008): Dùng process(all) tự động bắt mọi tín hiệu
process(all)
begin
  y <= a and b;
end process;

-- HOẶC DÙNG LỆNH GÁN ĐỒNG THỜI (Khuyên dùng):
y <= a and b;`,
      takeaway: "Đối với mạch tổ hợp đơn giản, hãy ưu tiên dùng câu lệnh gán đồng thời bên ngoài process để tránh lỗi danh sách nhạy cảm."
    }
  ];

  // ==========================================================================
  // 5. KHỞI TẠO VÀ QUẢN LÝ GIAO DIỆN MODAL
  // ==========================================================================
  function init() {
    loadMasteredCards();
    flashcardsList = [...FLASHCARDS_DATA];
    createToolsModalDom();

    // Lắng nghe phím ESC để đóng modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function loadMasteredCards() {
    try {
      const saved = localStorage.getItem('studyvhdl_mastered_flashcards');
      if (saved) {
        masteredCards = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Không thể đọc mastered flashcards từ localStorage');
    }
  }

  function saveMasteredCards() {
    try {
      localStorage.setItem('studyvhdl_mastered_flashcards', JSON.stringify([...masteredCards]));
    } catch (e) {
      console.warn('Không thể lưu mastered flashcards');
    }
  }

  function createToolsModalDom() {
    if (typeof document === 'undefined' || !document.getElementById || !document.body || !document.body.insertAdjacentHTML) return;
    if (document.getElementById('vhdl_tools_modal')) return;

    const modalHtml = `
      <div id="vhdl_tools_modal" class="tools-modal-overlay" style="display:none;">
        <div class="tools-modal-dialog">
          <!-- Header Modal -->
          <div class="tools-modal-header">
            <div class="tools-modal-title-area">
              <span class="tools-modal-icon">🛠️</span>
              <h2 class="tools-modal-title">Hộp Tiện Ích Kỹ Sư FPGA DE2-115</h2>
            </div>
            <div class="tools-tabs-nav">
              <button class="tool-tab-btn active" id="tab_btn_cheatsheet" onclick="VHDL_Tools.switchTab('cheatsheet')">
                📖 <span>Tra Cứu Nhanh</span>
              </button>
              <button class="tool-tab-btn" id="tab_btn_glossary" onclick="VHDL_Tools.switchTab('glossary')">
                📚 <span>Từ Điển (${GLOSSARY_DATA.length})</span>
              </button>
              <button class="tool-tab-btn" id="tab_btn_flashcards" onclick="VHDL_Tools.switchTab('flashcards')">
                🎴 <span>Flashcards (${FLASHCARDS_DATA.length})</span>
              </button>
              <button class="tool-tab-btn" id="tab_btn_debuglab" onclick="VHDL_Tools.switchTab('debuglab')">
                🔬 <span>Phòng Sửa Lỗi (${DEBUG_LAB_DATA.length})</span>
              </button>
            </div>
            <button class="tools-modal-close" onclick="VHDL_Tools.closeModal()" title="Đóng (ESC)">✕</button>
          </div>

          <!-- Body Modal -->
          <div class="tools-modal-body" id="tools_modal_body">
            <!-- Nội dung tab nạp động -->
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  function openModal(tab = 'cheatsheet') {
    const modal = document.getElementById('vhdl_tools_modal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    switchTab(tab);
  }

  function closeModal() {
    const modal = document.getElementById('vhdl_tools_modal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function switchTab(tabName) {
    activeTab = tabName;
    ['cheatsheet', 'glossary', 'flashcards', 'debuglab'].forEach(t => {
      const btn = document.getElementById(`tab_btn_${t}`);
      if (btn) {
        if (t === tabName) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });

    const body = document.getElementById('tools_modal_body');
    if (!body) return;

    if (tabName === 'cheatsheet') renderCheatSheet(body);
    else if (tabName === 'glossary') renderGlossary(body);
    else if (tabName === 'flashcards') renderFlashcards(body);
    else if (tabName === 'debuglab') renderDebugLab(body);
  }

  // ==========================================================================
  // RENDER CHEAT SHEET
  // ==========================================================================
  function renderCheatSheet(container) {
    let html = `
      <div class="tools-tab-pane">
        <div class="tool-pane-intro">
          <h3>📖 Bảng Tra Cứu Cú Pháp VHDL & Chân DE2-115 Chuẩn Công Nghiệp</h3>
          <p>Mẫu mã chuẩn IEEE, chuyển đổi kiểu dữ liệu và bảng ánh xạ chân vật lý thường dùng nhất trong thiết kế.</p>
        </div>
        <div class="cheatsheet-grid">
    `;

    CHEAT_SHEET_DATA.forEach((item, idx) => {
      const highlighted = window.VHDL_Highlighter ? window.VHDL_Highlighter.highlight(item.code) : item.code;
      html += `
        <div class="cheatsheet-card">
          <div class="cheatsheet-card-header">
            <div>
              <span class="cheatsheet-badge">${item.category}</span>
              <h4 class="cheatsheet-title">${item.title}</h4>
            </div>
            <button class="btn-copy-code" onclick="VHDL_Tools.copySnippet(${idx})" id="btn_copy_cs_${idx}" title="Sao chép mã">
              📋 Sao chép
            </button>
          </div>
          <div class="code-block-container" style="margin: 0;">
            <pre class="vhdl-code"><code id="cs_code_${idx}">${highlighted}</code></pre>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  function copySnippet(idx) {
    const item = CHEAT_SHEET_DATA[idx];
    if (!item) return;
    navigator.clipboard.writeText(item.code).then(() => {
      const btn = document.getElementById(`btn_copy_cs_${idx}`);
      if (btn) {
        btn.textContent = '✓ Đã chép!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '📋 Sao chép';
          btn.classList.remove('copied');
        }, 2000);
      }
    });
  }

  // ==========================================================================
  // RENDER GLOSSARY
  // ==========================================================================
  function renderGlossary(container) {
    let html = `
      <div class="tools-tab-pane">
        <div class="tool-pane-intro">
          <h3>📚 Từ Điển Thuật Ngữ Vi Mạch & FPGA Anh – Việt</h3>
          <p>Hơn ${GLOSSARY_DATA.length} khái niệm cốt lõi kèm giải nghĩa chi tiết và bối cảnh ứng dụng thực tế.</p>
          <div class="glossary-search-bar">
            <input type="text" id="glossary_search_input" placeholder="Tìm kiếm thuật ngữ (ASIC, Setup time, Slack, Latch, SOF...)" oninput="VHDL_Tools.filterGlossary(this.value)">
            <span class="glossary-count" id="glossary_counter">${GLOSSARY_DATA.length} thuật ngữ</span>
          </div>
        </div>
        <div class="glossary-cards-grid" id="glossary_grid">
    `;

    GLOSSARY_DATA.forEach(item => {
      html += createGlossaryCardHtml(item);
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  function createGlossaryCardHtml(item) {
    return `
      <div class="glossary-card" data-term="${item.term.toLowerCase()}" data-full="${item.full.toLowerCase()}" data-def="${item.def.toLowerCase()}">
        <div class="glossary-card-header">
          <div class="glossary-term-badge">${item.category}</div>
          <h4 class="glossary-term">${item.term}</h4>
          <div class="glossary-full-en">${item.full}</div>
          <div class="glossary-vn">${item.vietnamese}</div>
        </div>
        <p class="glossary-def">${item.def}</p>
      </div>
    `;
  }

  function filterGlossary(query) {
    const q = query.trim().toLowerCase();
    const cards = document.querySelectorAll('.glossary-card');
    let visible = 0;
    cards.forEach(card => {
      const term = card.getAttribute('data-term') || '';
      const full = card.getAttribute('data-full') || '';
      const def = card.getAttribute('data-def') || '';
      if (!q || term.includes(q) || full.includes(q) || def.includes(q)) {
        card.style.display = 'flex';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });
    const counter = document.getElementById('glossary_counter');
    if (counter) counter.textContent = `${visible} thuật ngữ`;
  }

  // ==========================================================================
  // RENDER FLASHCARDS
  // ==========================================================================
  function renderFlashcards(container) {
    const card = flashcardsList[currentCardIndex] || flashcardsList[0];
    const isMastered = masteredCards.has(card.id);
    const progressPct = Math.round((masteredCards.size / flashcardsList.length) * 100);

    let html = `
      <div class="tools-tab-pane">
        <div class="tool-pane-intro">
          <h3>🎴 Thẻ Ghi Nhớ Thông Minh (Interactive Flashcards)</h3>
          <p>Ôn tập nhanh các câu hỏi phỏng vấn và nguyên lý thiết kế vi mạch. Nhấp vào thẻ để lật xem đáp án.</p>
          
          <div class="flashcards-top-bar">
            <div class="fc-progress-info">
              <span>Tiến độ thuộc: <strong>${masteredCards.size}/${flashcardsList.length}</strong> (${progressPct}%)</span>
              <div class="progress-bar-container" style="width: 140px; height: 6px;">
                <div class="progress-bar-fill" style="width: ${progressPct}%;"></div>
              </div>
            </div>
            <div class="fc-top-actions">
              <button class="fc-btn-sm" onclick="VHDL_Tools.shuffleFlashcards()" title="Xáo trộn câu hỏi">🎲 Xáo trộn</button>
              <button class="fc-btn-sm" onclick="VHDL_Tools.resetMasteredCards()" title="Học lại từ đầu">🔄 Đặt lại</button>
            </div>
          </div>
        </div>

        <div class="flashcard-scene" onclick="VHDL_Tools.flipCurrentCard()">
          <div class="flashcard-inner" id="active_flashcard_inner">
            <!-- Mặt trước: Câu hỏi -->
            <div class="flashcard-face flashcard-front">
              <div class="fc-header">
                <span class="fc-topic-chip">${card.topic}</span>
                <span class="fc-num">Thẻ ${currentCardIndex + 1} / ${flashcardsList.length}</span>
              </div>
              <div class="fc-content-area">
                <div class="fc-q-icon">❓</div>
                <h3 class="fc-question-text">${card.question}</h3>
              </div>
              <div class="fc-footer-hint">
                <span>👆 Nhấp vào thẻ hoặc nhấn nút Lật để xem đáp án</span>
              </div>
            </div>

            <!-- Mặt sau: Đáp án -->
            <div class="flashcard-face flashcard-back">
              <div class="fc-header">
                <span class="fc-topic-chip" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">ĐÁP ÁN</span>
                <span class="fc-num">Thẻ ${currentCardIndex + 1} / ${flashcardsList.length}</span>
              </div>
              <div class="fc-content-area">
                <p class="fc-answer-text">${card.answer}</p>
                ${card.tip ? `<div class="fc-tip-box">💡 <strong>Mẹo kỹ sư:</strong> ${card.tip}</div>` : ''}
              </div>
              <div class="fc-footer-hint">
                <span>👆 Nhấp để lật lại câu hỏi</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Điều khiển thẻ -->
        <div class="flashcards-controls">
          <button class="btn-fc-nav" onclick="VHDL_Tools.prevCard()" ${currentCardIndex === 0 ? 'disabled' : ''}>
            ◀ Câu trước
          </button>
          
          <button class="btn-fc-flip" onclick="VHDL_Tools.flipCurrentCard()">
            🔄 Lật thẻ
          </button>

          <button class="btn-fc-master ${isMastered ? 'mastered' : ''}" onclick="VHDL_Tools.toggleMasterCurrentCard()">
            ${isMastered ? '✓ Đã thuộc' : '⭐ Đánh dấu đã thuộc'}
          </button>

          <button class="btn-fc-nav" onclick="VHDL_Tools.nextCard()" ${currentCardIndex === flashcardsList.length - 1 ? 'disabled' : ''}>
            Câu sau ▶
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  function flipCurrentCard() {
    const inner = document.getElementById('active_flashcard_inner');
    if (inner) inner.classList.toggle('flipped');
  }

  function nextCard() {
    if (currentCardIndex < flashcardsList.length - 1) {
      currentCardIndex++;
      const body = document.getElementById('tools_modal_body');
      if (body) renderFlashcards(body);
    }
  }

  function prevCard() {
    if (currentCardIndex > 0) {
      currentCardIndex--;
      const body = document.getElementById('tools_modal_body');
      if (body) renderFlashcards(body);
    }
  }

  function shuffleFlashcards() {
    for (let i = flashcardsList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flashcardsList[i], flashcardsList[j]] = [flashcardsList[j], flashcardsList[i]];
    }
    currentCardIndex = 0;
    const body = document.getElementById('tools_modal_body');
    if (body) renderFlashcards(body);
  }

  function toggleMasterCurrentCard() {
    const card = flashcardsList[currentCardIndex];
    if (!card) return;
    if (masteredCards.has(card.id)) {
      masteredCards.delete(card.id);
    } else {
      masteredCards.add(card.id);
    }
    saveMasteredCards();
    const body = document.getElementById('tools_modal_body');
    if (body) renderFlashcards(body);
  }

  function resetMasteredCards() {
    if (confirm('Bạn có chắc muốn đặt lại toàn bộ tiến độ Flashcards?')) {
      masteredCards.clear();
      saveMasteredCards();
      currentCardIndex = 0;
      const body = document.getElementById('tools_modal_body');
      if (body) renderFlashcards(body);
    }
  }

  // ==========================================================================
  // RENDER DEBUG LAB
  // ==========================================================================
  function renderDebugLab(container) {
    let html = `
      <div class="tools-tab-pane">
        <div class="tool-pane-intro">
          <h3>🔬 Phòng Thực Hành Gỡ Lỗi Vi Mạch Tương Tác (Debug Lab)</h3>
          <p>5 tình huống lỗi kinh điển nhất mà kỹ sư FPGA thường gặp phải: Phân tích thông báo lỗi, nguyên nhân phần cứng và mã sửa đúng chuẩn.</p>
        </div>
        <div class="debug-labs-list">
    `;

    DEBUG_LAB_DATA.forEach((lab, idx) => {
      const hlBuggy = window.VHDL_Highlighter ? window.VHDL_Highlighter.highlight(lab.buggyCode) : lab.buggyCode;
      const hlFixed = window.VHDL_Highlighter ? window.VHDL_Highlighter.highlight(lab.fixedCode) : lab.fixedCode;

      html += `
        <div class="debug-lab-card" id="debug_lab_card_${lab.id}">
          <div class="debug-lab-header">
            <div class="debug-lab-title-row">
              <span class="debug-badge severity">${lab.severity}</span>
              <span class="debug-badge category">${lab.category}</span>
              <h4 class="debug-lab-title">${lab.title}</h4>
            </div>
            <button class="btn-reveal-solution" onclick="VHDL_Tools.toggleLabSolution('${lab.id}')" id="btn_reveal_${lab.id}">
              💡 Xem giải pháp
            </button>
          </div>

          <p class="debug-desc">${lab.problemDescription}</p>

          <div class="debug-code-diff-grid">
            <!-- Khung mã lỗi -->
            <div class="debug-code-column">
              <div class="code-column-header error">
                <span>❌ Đoạn mã phát sinh lỗi</span>
              </div>
              <div class="code-block-container" style="margin:0;">
                <pre class="vhdl-code"><code>${hlBuggy}</code></pre>
              </div>
              <div class="compiler-error-box">
                <span class="compiler-error-title">⚠️ Thông báo từ Quartus / ModelSim:</span>
                <p class="compiler-error-text">${lab.errorMessage}</p>
              </div>
            </div>

            <!-- Khung giải pháp (Mặc định ẩn) -->
            <div class="debug-code-column solution-col" id="solution_col_${lab.id}" style="display: none;">
              <div class="code-column-header success">
                <span>✅ Mã chuẩn đã khắc phục</span>
              </div>
              <div class="code-block-container" style="margin:0;">
                <pre class="vhdl-code"><code>${hlFixed}</code></pre>
              </div>
              <div class="analysis-box">
                <p class="analysis-text"><strong>🔍 Bản chất phần cứng:</strong> ${lab.hardwareAnalysis}</p>
                <p class="takeaway-text"><strong>📌 Bài học cốt lõi:</strong> ${lab.takeaway}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  function toggleLabSolution(labId) {
    const col = document.getElementById(`solution_col_${labId}`);
    const btn = document.getElementById(`btn_reveal_${labId}`);
    if (!col || !btn) return;

    if (col.style.display === 'none') {
      col.style.display = 'flex';
      btn.textContent = 'Ẩn giải pháp';
      btn.classList.add('revealed');
    } else {
      col.style.display = 'none';
      btn.textContent = '💡 Xem giải pháp';
      btn.classList.remove('revealed');
    }
  }

  return {
    init,
    openModal,
    closeModal,
    switchTab,
    copySnippet,
    filterGlossary,
    flipCurrentCard,
    nextCard,
    prevCard,
    shuffleFlashcards,
    toggleMasterCurrentCard,
    resetMasteredCards,
    toggleLabSolution
  };
})();

// Tự động khởi tạo DOM Tools khi script được tải
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.VHDL_Tools.init());
  } else if (document.body) {
    window.VHDL_Tools.init();
  }
}

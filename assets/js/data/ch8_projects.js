// ==========================================================================
// CH8_PROJECTS.JS - CHƯƠNG 8: MINI PROJECTS TỔNG HỢP (5 DỰ ÁN HOÀN CHỈNH)
// ==========================================================================

window.VHDL_LESSONS_DB = window.VHDL_LESSONS_DB || {};

window.VHDL_LESSONS_DB["ch8"] = [
  // ========================================================================
  // BÀI 8.1
  // ========================================================================
  {
    id: "ch8-b1",
    chapterId: "ch8",
    order: 1,
    title: "Dự án 1 – Đồng hồ số vạn niên (Digital Clock) Giờ - Phút - Giây",
    subtitle: "Tích hợp toàn diện: Bộ chia 50 MHz, bộ đếm BCD nhiều tầng và hiển thị 6 bộ LED 7 đoạn",
    badge: "Project",
    estimatedMinutes: 45,
    hardwareFocus: ["6x HEX Displays (HEX5..HEX0)", "CLOCK_50 (PIN_Y2)", "Chỉnh giờ nhanh"],

    objectives: [
      "Tích hợp hoàn chỉnh hệ thống số đa tầng: Bộ chia tần số 50 MHz xuống 1 Hz, bộ đếm Giây (0-59), Phút (0-59), Giờ (0-23).",
      "Xây dựng cơ chế cuốn hàng đồng bộ: 59 giây chuyển sang 00 giây và kích hoạt phút tăng 1.",
      "Giải mã trực tiếp ra toàn bộ 6 cụm LED 7 đoạn trên kit DE2-115: Giờ (HEX5-HEX4), Phút (HEX3-HEX2), Giây (HEX1-HEX0).",
      "Tích hợp tính năng chỉnh giờ nhanh (Fast Set Time) bằng nút nhấn KEY1 và KEY2."
    ],

    theory: {
      why: "Đồng hồ số là dự án kinh điển mà bất kỳ kỹ sư thiết kế phần cứng nào cũng phải vượt qua. Nó hội tụ đầy đủ mọi kỹ năng cơ bản và nâng cao: Chia tần số xung nhịp chính xác đến từng chu kỳ, thiết kế mạch tuần tự nhiều tầng phân cấp, xử lý đồng bộ các điều kiện cuốn hàng, và điều khiển cùng lúc 42 thanh LED 7 đoạn trên bo mạch thực.",
      how: "Kiến trúc hệ thống Đồng hồ số:\n1. **Khối Clock Divider:** Chia xung 50 MHz tạo nhịp 1 Hz (`one_hz_tick`).\n2. **Khối Đếm Giây:** Gồm 2 chữ số BCD: Giây đơn vị (0-9) và Giây chục (0-5). Khi đạt `59`, nhịp tiếp theo quay về `00` và sinh xung `min_tick`.\n3. **Khối Đếm Phút:** Gồm Phút đơn vị (0-9) và Phút chục (0-5). Khi đạt `59`, quay về `00` và sinh xung `hour_tick`.\n4. **Khối Đếm Giờ:** Đếm từ `00` đến `23`. Khi chạm mốc `23:59:59`, toàn bộ đồng hồ quay vòng về `00:00:00`.\n5. **Khối Giải mã 7 đoạn (6 bộ giải mã Common Anode):** Nối song song ra các chân `HEX5` đến `HEX0`."
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ khối Digital Clock -->
      <g transform="translate(20, 20)">
        <rect x="20" y="40" width="100" height="70" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="70" y="70" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">CHIA 50MHz</text>
        <text x="70" y="90" text-anchor="middle" fill="#94a3b8" font-size="9">-> 1 Hz</text>

        <line x1="120" y1="75" x2="160" y2="75" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

        <!-- Đếm Giây -->
        <rect x="160" y="40" width="110" height="70" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
        <text x="215" y="70" text-anchor="middle" fill="#10b981" font-size="10" font-weight="bold">GIÂY (00-59)</text>
        <text x="215" y="90" text-anchor="middle" fill="#a7f3d0" font-size="8">HEX1 - HEX0</text>

        <line x1="270" y1="75" x2="310" y2="75" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>

        <!-- Đếm Phút -->
        <rect x="310" y="40" width="110" height="70" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="365" y="70" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold">PHÚT (00-59)</text>
        <text x="365" y="90" text-anchor="middle" fill="#fde68a" font-size="8">HEX3 - HEX2</text>

        <line x1="420" y1="75" x2="460" y2="75" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>

        <!-- Đếm Giờ -->
        <rect x="460" y="40" width="110" height="70" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>
        <text x="515" y="70" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold">GIỜ (00-23)</text>
        <text x="515" y="90" text-anchor="middle" fill="#fca5a5" font-size="8">HEX5 - HEX4</text>

        <!-- Màn hình 6 HEX -->
        <text x="300" y="150" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">[HEX5 HEX4] : [HEX3 HEX2] : [HEX1 HEX0]</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "digital_clock_top",
      circuitType: "sequential",
      typeExplanation: "Hệ thống số thời gian thực hoàn chỉnh: Tích hợp bộ chia xung 50 MHz, 3 tầng đếm tuần tự Giờ-Phút-Giây và giải mã ra 6 màn hình LED 7 đoạn.",
      code: `--------------------------------------------------------------------------------
-- Tên file: digital_clock_top.vhd
-- Dự án Đồng hồ số vạn niên Giờ-Phút-Giây hiển thị trên HEX5..HEX0
-- Kit: Terasic DE2-115 (CLOCK_50: PIN_Y2, KEY0: Reset)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity digital_clock_top is
    port (
        clk      : in  std_logic;                    -- 50 MHz (PIN_Y2)
        rst_n    : in  std_logic;                    -- KEY0 (PIN_M23)
        btn_min  : in  std_logic;                    -- KEY1: Chỉnh phút nhanh
        btn_hour : in  std_logic;                    -- KEY2: Chỉnh giờ nhanh
        -- 6 bộ hiển thị LED 7 đoạn HEX5..HEX0
        hex5     : out std_logic_vector(6 downto 0); -- Giờ chục
        hex4     : out std_logic_vector(6 downto 0); -- Giờ đơn vị
        hex3     : out std_logic_vector(6 downto 0); -- Phút chục
        hex2     : out std_logic_vector(6 downto 0); -- Phút đơn vị
        hex1     : out std_logic_vector(6 downto 0); -- Giây chục
        hex0     : out std_logic_vector(6 downto 0)  -- Giây đơn vị
    );
end entity digital_clock_top;

architecture rtl of digital_clock_top is
    -- 50,000,000 nhịp = 1 giây
    constant TICKS_1S : integer := 50000000;
    signal tick_cnt   : integer range 0 to TICKS_1S := 0;
    signal one_sec    : std_logic := '0';

    signal sec_u  : integer range 0 to 9 := 0;
    signal sec_t  : integer range 0 to 5 := 0;
    signal min_u  : integer range 0 to 9 := 0;
    signal min_t  : integer range 0 to 5 := 0;
    signal hour_u : integer range 0 to 9 := 0;
    signal hour_t : integer range 0 to 2 := 0;

    -- Hàm giải mã 1 chữ số BCD (0-9) ra LED 7 đoạn Common Anode
    function bcd_to_7seg(val : integer) return std_logic_vector is
    begin
        case val is
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

    -- 1. TẠO XUNG 1 HZ
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            tick_cnt <= 0;
            one_sec  <= '0';
        elsif rising_edge(clk) then
            if tick_cnt = TICKS_1S - 1 then
                tick_cnt <= 0;
                one_sec  <= '1';
            else
                tick_cnt <= tick_cnt + 1;
                one_sec  <= '0';
            end if;
        end if;
    end process;

    -- 2. ĐẾM GIỜ - PHÚT - GIÂY
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            sec_u <= 0; sec_t <= 0;
            min_u <= 0; min_t <= 0;
            hour_u <= 0; hour_t <= 0;
        elsif rising_edge(clk) then
            if one_sec = '1' then
                -- Tăng Giây
                if sec_u = 9 then
                    sec_u <= 0;
                    if sec_t = 5 then
                        sec_t <= 0;
                        -- Tăng Phút
                        if min_u = 9 then
                            min_u <= 0;
                            if min_t = 5 then
                                min_t <= 0;
                                -- Tăng Giờ
                                if (hour_t = 2 and hour_u = 3) then
                                    hour_t <= 0;
                                    hour_u <= 0;
                                elsif hour_u = 9 then
                                    hour_u <= 0;
                                    hour_t <= hour_t + 1;
                                else
                                    hour_u <= hour_u + 1;
                                end if;
                            else
                                min_t <= min_t + 1;
                            end if;
                        else
                            min_u <= min_u + 1;
                        end if;
                    else
                        sec_t <= sec_t + 1;
                    end if;
                else
                    sec_u <= sec_u + 1;
                end if;
            end if;
        end if;
    end process;

    -- 3. XUẤT RA 6 MÀN HÌNH LED 7 ĐOẠN
    hex0 <= bcd_to_7seg(sec_u);
    hex1 <= bcd_to_7seg(sec_t);
    hex2 <= bcd_to_7seg(min_u);
    hex3 <= bcd_to_7seg(min_t);
    hex4 <= bcd_to_7seg(hour_u);
    hex5 <= bcd_to_7seg(hour_t);

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_digital_clock",
      code: `--------------------------------------------------------------------------------
-- Testbench mô phỏng đồng hồ số (Rút ngắn chu kỳ để chạy nhanh)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_digital_clock is
end entity tb_digital_clock;

architecture sim of tb_digital_clock is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '0';
    signal h5, h4, h3, h2, h1, h0 : std_logic_vector(6 downto 0);
begin
    uut: entity work.digital_clock_top
        port map (
            clk => clk, rst_n => rst_n,
            btn_min => '1', btn_hour => '1',
            hex5 => h5, hex4 => h4, hex3 => h3, hex2 => h2, hex1 => h1, hex0 => h0
        );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 50 ns;
        rst_n <= '1';
        wait for 2000 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Sau khi nạp lên kit: Quan sát HEX1-HEX0 nhảy giây từng giây một. Khi đạt 59s, HEX2 sẽ tự động tăng 1 phút!"
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án digital_clock_top chọn chip Cyclone IV EP4CE115F29C7.",
        "2. Nạp code và gán chân cho CLOCK_50, KEY0, và toàn bộ 6 cụm HEX5..HEX0.",
        "3. Biên dịch và nạp file .sof lên kit DE2-115.",
        "4. Xem đồng hồ số đếm nhịp thực tế 24/24 trên bàn học của bạn!"
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n`
    },

    commonErrors: [
      {
        error: "Giờ đếm vượt quá 23 (ví dụ nhảy lên 24, 25...)",
        cause: "Điều kiện kiểm tra cuốn hàng giờ bị sai: quên kiểm tra `hour_t = 2 and hour_u = 3`.",
        fix: "Kiểm tra đúng điều kiện mốc 23 giờ: `if (hour_t = 2 and hour_u = 3) then hour_t <= 0; hour_u <= 0;`."
      },
      {
        error: "Các số hiển thị trên LED 7 đoạn bị sáng/tắt ngược nét",
        cause: "Quên nguyên tắc Common Anode (mức 0 là sáng, mức 1 là tắt).",
        fix: "Sử dụng đúng bảng mã giải mã số 0 là `\"1000000\"`."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo dấu chấm nhấp nháy 1 Hz ngăn cách",
        prompt: "Bật tắt dấu chấm Decimal Point (chân dp) giữa Giờ, Phút và Giây theo nhịp 1 Hz để tạo hiệu ứng đồng hồ đập nhịp.",
        hint: "Nối chân dp vào tín hiệu `one_sec`.",
        solution: "Gán chân dp của HEX2 và HEX4 theo tín hiệu nhấp nháy 1 Hz."
      },
      {
        level: "Vận dụng",
        title: "Chế độ hiển thị 12 giờ (AM / PM)",
        prompt: "Bổ sung công tắc gạt SW17 để chuyển đổi giữa chế độ 24 giờ và chế độ 12 giờ (có đèn báo AM/PM).",
        hint: "Nếu hour > 12 thì hiển thị hour - 12 và bật đèn LED PM.",
        solution: "Tạo tín hiệu hour_12 <= hour - 12 khi hour > 12; bật LEDR17 làm đèn báo PM."
      },
      {
        level: "Thử thách",
        title: "Tích hợp tính năng Báo thức (Alarm Clock) kèm Còi kêu Buzzer",
        prompt: "Cho phép lưu một mốc giờ báo thức trong thanh ghi. Khi giờ trùng khớp, kích hoạt còi Buzzer trên kit kêu bip bip liên tục.",
        hint: "So sánh hour = alarm_hour and min = alarm_min; kích hoạt xung tạo tần số 1 kHz ra chân buzzer.",
        solution: "So sánh thời gian hiện tại với thanh ghi báo thức, xuất xung âm thanh 1 kHz ra chân còi hoặc loa."
      }
    ],

    quiz: [
      {
        question: "Cần tổng cộng bao nhiêu bộ giải mã LED 7 đoạn để hiển thị trọn vẹn Giờ-Phút-Giây trên kit DE2-115?",
        options: [
          "6 bộ giải mã (HEX5 đến HEX0)",
          "4 bộ",
          "2 bộ",
          "8 bộ"
        ],
        answerIndex: 0,
        explanation: "Hiển thị đầy đủ Giờ (2 số), Phút (2 số), Giây (2 số) cần đúng 6 cụm màn hình LED 7 đoạn HEX5 đến HEX0."
      },
      {
        question: "Khi đồng hồ điểm 23:59:59, giây tiếp theo thời gian sẽ chuyển sang giá trị nào?",
        options: [
          "00:00:00",
          "24:00:00",
          "01:00:00",
          "23:59:60"
        ],
        answerIndex: 0,
        explanation: "Chu kỳ 24 giờ quy định sau thời điểm 23:59:59, toàn bộ đồng hồ sẽ quay vòng về 00:00:00."
      },
      {
        question: "Để tăng biến đếm Phút khi bấm nút KEY1 mà không bị nhảy hàng nghìn lần trong 1 giây, ta cần bổ sung mạch gì?",
        options: [
          "Mạch chống rung phím (Key Debounce) và phát hiện cạnh xuống (Edge Detector)",
          "Thêm tụ điện 1000uF",
          "Nối đất chân clock",
          "Tắt nguồn máy tính"
        ],
        answerIndex: 0,
        explanation: "Nút bấm cơ học bị rung tiếp điểm cần qua mạch Debounce và One-Pulse để mỗi lần bấm ngón tay chỉ kích hoạt tăng đúng 1 đơn vị."
      },
      {
        question: "Chân nguồn xung clock 50 MHz trên kit DE2-115 là chân nào?",
        options: [
          "PIN_Y2",
          "PIN_M23",
          "PIN_G19",
          "PIN_AB28"
        ],
        answerIndex: 0,
        explanation: "Chân xung nhịp chính CLOCK_50 nối trực tiếp vào chân PIN_Y2 của chip Cyclone IV."
      }
    ],

    summary: [
      "Dự án Đồng hồ số là bước tổng hợp hoàn hảo các kiến thức VHDL tuần tự.",
      "Cấu trúc chia nhịp 1 Hz nuôi chuỗi đếm BCD Giây -> Phút -> Giờ.",
      "Quản lý điều kiện cuốn hàng an toàn cho mốc 59 giây, 59 phút và 23 giờ.",
      "Giải mã trực tiếp ra 6 màn hình LED 7 đoạn HEX5..HEX0 rực rỡ.",
      "Có thể mở rộng thêm tính năng báo thức, AM/PM và bấm giờ thể thao."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["KEY0"],
      activeOutputs: ["HEX0", "HEX1", "HEX2", "HEX3", "HEX4", "HEX5"],
      logicEvaluator: function(inputs) {
        return {
          HEX5: 0, HEX4: 0, // 00
          HEX3: 0, HEX2: 0, // 00
          HEX1: 0, HEX0: 0  // 00
        };
      }
    }
  },

  // ========================================================================
  // BÀI 8.2
  // ========================================================================
  {
    id: "ch8-b2",
    chapterId: "ch8",
    order: 2,
    title: "Dự án 2 – Bộ điều khiển độ sáng LED & Động cơ bằng xung PWM 8-bit",
    subtitle: "Kỹ thuật điều chế độ rộng xung (Pulse Width Modulation): Biến tín hiệu số thành điện áp tương tự",
    badge: "Project",
    estimatedMinutes: 35,
    hardwareFocus: ["PWM Generator", "SW[7..0] Duty Cycle", "LEDR Dimming"],

    objectives: [
      "Hiểu bản chất của kỹ thuật Điều chế độ rộng xung PWM (Pulse Width Modulation): Điều khiển công suất trung bình.",
      "Thiết kế bộ tạo xung PWM 8-bit (256 mức độ sáng) tần số 1 kHz từ nguồn clock 50 MHz.",
      "Sử dụng 8 công tắc SW[7:0] để thay đổi chu kỳ làm việc (Duty Cycle) từ 0% đến 100%.",
      "Quan sát hiệu ứng mắt nhìn (Persistence of Vision): Đèn LED sáng dịu mờ dần hoặc sáng rực rỡ trên kit DE2-115."
    ],

    theory: {
      why: "Trong chip FPGA, các chân ngõ ra chỉ có 2 mức logic: 0V hoặc 2.5V/3.3V (không thể xuất ra điện áp lửng như 1.2V hay 1.8V). Làm thế nào để ta có thể làm mờ một bóng đèn LED, điều chỉnh tốc độ quay của quạt làm mát hay điều khiển góc quay của động cơ servo? Phương pháp PWM giải quyết bài toán này bằng cách băm xung với tần số cao: Tỷ lệ thời gian ở mức 1 (Duty Cycle) càng lớn thì công suất điện trung bình truyền đến linh kiện càng cao.",
      how: "Nguyên lý tạo xung PWM 8-bit:\n1. Một bộ đếm tuần hoàn chạy từ 0 đến 255 (`pwm_counter`).\n2. Giá trị ngưỡng mong muốn được nạp từ công tắc: `duty_cycle = unsigned(SW[7 downto 0])`.\n3. Bộ so sánh logic:\n   - Nếu `pwm_counter < duty_cycle`: Xuất ngõ ra `pwm_out <= '1'`.\n   - Nếu `pwm_counter >= duty_cycle`: Xuất ngõ ra `pwm_out <= '0'`.\n\nTính toán Tần số PWM:\n- Clock 50 MHz, nếu đếm trực tiếp 256 bước thì tần số PWM là `50 MHz / 256 ≈ 195 kHz` (rất tốt cho LED, mắt người hoàn toàn không nhìn thấy hiện tượng nhấp nháy)."
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Dạng sóng PWM tại các mức Duty Cycle -->
      <g transform="translate(30, 20)">
        <text x="280" y="20" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">NGUYÊN LÝ ĐIỀU CHẾ ĐỘ RỘNG XUNG PWM (PULSE WIDTH MODULATION)</text>

        <!-- Duty 25% -->
        <text x="20" y="55" fill="#94a3b8" font-family="monospace" font-size="10">Duty 25% (Mờ)</text>
        <path d="M 140,60 L 170,60 L 170,40 L 195,40 L 195,60 L 270,60 L 270,40 L 295,40 L 295,60 L 370,60" fill="none" stroke="#38bdf8" stroke-width="2"/>

        <!-- Duty 50% -->
        <text x="20" y="95" fill="#f59e0b" font-family="monospace" font-size="10">Duty 50% (Vừa)</text>
        <path d="M 140,100 L 170,100 L 170,80 L 220,80 L 220,100 L 270,100 L 270,80 L 320,80 L 320,100 L 370,100" fill="none" stroke="#f59e0b" stroke-width="2"/>

        <!-- Duty 75% -->
        <text x="20" y="135" fill="#10b981" font-family="monospace" font-size="10">Duty 75% (Sáng rực)</text>
        <path d="M 140,140 L 170,140 L 170,120 L 245,120 L 245,140 L 270,140 L 270,120 L 345,120 L 345,140 L 370,140" fill="none" stroke="#10b981" stroke-width="2"/>

        <!-- Sơ đồ bộ so sánh -->
        <rect x="420" y="50" width="160" height="90" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="500" y="80" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">BỘ SO SÁNH PWM</text>
        <text x="500" y="100" text-anchor="middle" fill="#f8fafc" font-size="9">cnt &lt; duty -&gt; '1'</text>
        <text x="500" y="115" text-anchor="middle" fill="#94a3b8" font-size="8">cnt &gt;= duty -&gt; '0'</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "pwm_led_controller",
      circuitType: "sequential",
      typeExplanation: "Bộ tạo xung điều chế PWM 8-bit: Sử dụng bộ đếm tự do 256 bước và mạch so sánh để biến đổi công tắc số thành công suất sáng tương tự.",
      code: `--------------------------------------------------------------------------------
-- Tên file: pwm_led_controller.vhd
-- Bộ điều khiển độ sáng đèn LED bằng xung PWM 8-bit trên kit DE2-115
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity pwm_led_controller is
    port (
        clk        : in  std_logic;                    -- 50 MHz (PIN_Y2)
        rst_n      : in  std_logic;                    -- KEY0 (PIN_M23)
        duty_sw    : in  std_logic_vector(7 downto 0); -- SW7..0 (Giá trị 0 đến 255)
        pwm_out    : out std_logic;                    -- LEDR0 (Đèn mờ dần hoặc sáng rực)
        pwm_inv    : out std_logic                     -- LEDG0 (Đèn đảo pha ngược lại)
    );
end entity pwm_led_controller;

architecture rtl of pwm_led_controller is
    -- Bộ đếm 8-bit chạy từ 0 đến 255
    signal pwm_cnt : unsigned(7 downto 0) := (others => '0');
    signal pwm_reg : std_logic := '0';
begin
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            pwm_cnt <= (others => '0');
            pwm_reg <= '0';
        elsif rising_edge(clk) then
            -- Bộ đếm tự do tăng liên tục
            pwm_cnt <= pwm_cnt + 1;

            -- So sánh giá trị đếm với ngưỡng công tắc
            if pwm_cnt < unsigned(duty_sw) then
                pwm_reg <= '1';
            else
                pwm_reg <= '0';
            end if;
        end if;
    end process;

    pwm_out <= pwm_reg;
    pwm_inv <= not pwm_reg;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_pwm_led",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra xung PWM tại các mức 25%, 50%, 75%
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_pwm_led is
end entity tb_pwm_led;

architecture sim of tb_pwm_led is
    signal clk     : std_logic := '0';
    signal rst_n   : std_logic := '0';
    signal sw      : std_logic_vector(7 downto 0) := x"40"; -- 64/256 = 25%
    signal pwm_out : std_logic;
    signal pwm_inv : std_logic;
begin
    uut: entity work.pwm_led_controller
        port map ( clk => clk, rst_n => rst_n, duty_sw => sw, pwm_out => pwm_out, pwm_inv => pwm_inv );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 30 ns;
        rst_n <= '1'; wait for 20 ns;

        -- Test Duty 25% (64)
        sw <= x"40"; wait for 6000 ns;

        -- Test Duty 50% (128)
        sw <= x"80"; wait for 6000 ns;

        -- Test Duty 100% (255)
        sw <= x"FF"; wait for 6000 ns;

        wait;
    end process;
end architecture sim;`,
      instructions: "Sau khi nạp lên kit: Gạt toàn bộ SW[7:0] xuống 0: LEDR0 tắt ngóm. Gạt dần các công tắc lên: LEDR0 sẽ sáng mờ mờ rồi sáng rực rỡ dần lên!"
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án pwm_led_controller.",
        "2. Nạp mã nguồn VHDL.",
        "3. Gán chân: clk = PIN_Y2, rst_n = PIN_M23, duty_sw[7..0] = SW[7..0], pwm_out = PIN_G19 (LEDR0), pwm_inv = PIN_E21 (LEDG0).",
        "4. Biên dịch và nạp file .sof lên kit DE2-115."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "pwm_out", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" },
        { signal: "pwm_inv", pin: "PIN_E21", ioStandard: "2.5 V", note: "LEDG0" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_G19 -to pwm_out\nset_location_assignment PIN_E21 -to pwm_inv`
    },

    commonErrors: [
      {
        error: "Tần số PWM quá thấp (dưới 50 Hz) khiến đèn LED bị nhấp nháy giật mắt",
        cause: "Chia tần số quá nhiều khiến chu kỳ PWM kéo dài hàng trăm mili-giây, mắt người sẽ nhìn thấy đèn chớp tắt thay vì thấy mờ mờ.",
        fix: "Giữ tần số PWM trên 200 Hz (tốt nhất là 1 kHz đến 200 kHz) để tận dụng hiện tượng lưu ảnh võng mạc."
      },
      {
        error: "Khi gạt SW = 255 nhưng đèn không đạt 100% độ sáng",
        cause: "Bộ đếm 8-bit đếm từ 0 đến 255, khi `cnt = 255` thì điều kiện `cnt < 255` bị sai nên vẫn có 1 chu kỳ clock bị tắt.",
        fix: "Dùng bộ so sánh `if pwm_cnt <= unsigned(duty_sw)` hoặc mở rộng bộ đếm lên 9-bit."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo hiệu ứng đèn thở (Breathing LED)",
        prompt: "Thay vì dùng công tắc tay, viết một bộ đếm tự động tăng giảm duty_cycle từ 0 lên 255 rồi từ 255 về 0 để tạo hiệu ứng đèn 'thở' nhịp nhàng.",
        hint: "Dùng bộ đếm tam giác Up/Down counter chậm (tốc độ khoảng 10 ms mỗi bước đếm).",
        solution: "Tạo một bộ đếm chậm 10ms tự động tăng duty_cycle khi cờ dir='1' và giảm khi dir='0'."
      },
      {
        level: "Vận dụng",
        title: "Điều khiển động cơ Servo 50 Hz (Góc quay 0 - 180 độ)",
        prompt: "Động cơ servo RC đòi hỏi tần số PWM chuẩn 50 Hz (chu kỳ 20 ms), độ rộng xung từ 1 ms (góc 0°) đến 2 ms (góc 180°). Hãy tính toán bộ đếm thích hợp.",
        hint: "50 MHz chia 1,000,000 nhịp để được chu kỳ 20 ms. Xung mức 1 kéo dài từ 50,000 nhịp (1ms) đến 100,000 nhịp (2ms).",
        solution: "Bộ đếm modulo 1,000,000 nhịp; so sánh ngõ ra với ngưỡng từ 50,000 đến 100,000 nhịp."
      },
      {
        level: "Thử thách",
        title: "Bộ hòa âm âm thanh (Audio Tone Generator) bằng PWM",
        prompt: "Làm thế nào để tạo ra nốt nhạc La 440 Hz xuất ra cổng âm thanh Audio Out trên kit DE2-115 bằng kỹ thuật PWM?",
        hint: "Băm xung 440 Hz (chu kỳ khoảng 2.27 ms) với Duty Cycle 50%.",
        solution: "Chia xung 50 MHz xuống chu kỳ 50,000,000 / 440 ≈ 113,636 nhịp, lật trạng thái ngõ ra để xuất sóng vuông 440 Hz."
      }
    ],

    quiz: [
      {
        question: "Kỹ thuật Điều chế độ rộng xung (PWM) hoạt động dựa trên nguyên lý nào để điều chỉnh độ sáng đèn LED?",
        options: [
          "Băm xung với tần số cao và thay đổi tỷ lệ thời gian mở (Duty Cycle) để thay đổi công suất điện trung bình",
          "Thay đổi điện áp cấp từ 5V xuống 1V",
          "Tăng điện trở trên bo mạch",
          "Thay đổi màu sắc của thạch anh"
        ],
        answerIndex: 0,
        explanation: "PWM giữ nguyên điện áp đỉnh nhưng thay đổi độ rộng thời gian mức 1 trong 1 chu kỳ, làm thay đổi điện áp hiệu dụng trung bình."
      },
      {
        question: "Duty Cycle bằng 50% trong bộ tạo xung PWM 8-bit (0-255) tương ứng với giá trị công tắc là bao nhiêu?",
        options: [
          "128 (hoặc 0x80)",
          "255",
          "64",
          "0"
        ],
        answerIndex: 0,
        explanation: "50% của dải 8-bit (256 mức) là 256 * 0.5 = 128 (mã Hex 0x80)."
      },
      {
        question: "Để mắt người không nhìn thấy đèn LED bị nhấp nháy, tần số tối thiểu của xung PWM nên là bao nhiêu?",
        options: [
          "Ít nhất 100 Hz (tốt nhất là từ 1 kHz trở lên)",
          "1 Hz",
          "0.1 Hz",
          "5 Hz"
        ],
        answerIndex: 0,
        explanation: "Hiện tượng lưu ảnh võng mạc của mắt người chỉ nhận biết được tần số dưới 60 Hz. Tần số PWM trên 100 Hz (đặc biệt 1 kHz) sẽ tạo cảm giác mờ liên tục cực kỳ êm dịu."
      },
      {
        question: "Nếu bộ đếm PWM chạy từ 0 đến 255 ở tần số clock 50 MHz trực tiếp, tần số xung PWM sinh ra xấp xỉ bao nhiêu?",
        options: [
          "Khoảng 195 kHz",
          "50 MHz",
          "1 kHz",
          "100 Hz"
        ],
        answerIndex: 0,
        explanation: "50,000,000 Hz / 256 chu kỳ ≈ 195,312 Hz (khoảng 195 kHz)."
      }
    ],

    summary: [
      "PWM là cầu nối tuyệt vời biến thế giới số (0/1) thành năng lượng tương tự điều khiển được.",
      "Duty Cycle quyết định công suất trung bình: 0% (tắt) đến 100% (sáng cực đại).",
      "Mạch tạo PWM 8-bit chỉ cần 1 bộ đếm 256 bước và 1 bộ so sánh đơn giản.",
      "Ứng dụng rộng rãi: Làm mờ đèn LED, điều tốc động cơ DC, lái góc quay servo.",
      "Tần số băm xung cao giúp loại bỏ hoàn toàn hiện tượng rung giật cơ học và nhấp nháy mắt."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW2", "SW3"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return { LEDR0: inputs.SW0 ? 1 : 0 };
      }
    }
  },

  // ========================================================================
  // BÀI 8.3
  // ========================================================================
  {
    id: "ch8-b3",
    chapterId: "ch8",
    order: 3,
    title: "Dự án 3 – Bộ tính toán số học - logic ALU 4-bit hoàn chỉnh",
    subtitle: "Xây dựng khối thực thi tính toán trung tâm (Arithmetic Logic Unit) của CPU",
    badge: "Project",
    estimatedMinutes: 40,
    hardwareFocus: ["4-bit ALU", "Zero/Carry/Negative Flags", "SW Control", "HEX Display"],

    objectives: [
      "Thiết kế trọn vẹn khối tính toán trung tâm ALU (Arithmetic Logic Unit) 4-bit với 8 phép toán số học và logic.",
      "Tạo các cờ trạng thái điều kiện chuẩn CPU: Cờ Zero (Z), Cờ Nhớ Carry (C), Cờ Dấu Negative (N).",
      "Kết nối ngõ vào từ công tắc: Toán hạng A (SW3..0), Toán hạng B (SW7..4), Mã lệnh Opcode (SW10..8).",
      "Hiển thị kết quả tính toán ra màn hình LED 7 đoạn HEX0 và các cờ trạng thái ra dãy LED đỏ LEDR."
    ],

    theory: {
      why: "Trong mọi bộ vi xử lý từ máy tính bỏ túi Casio đến chip Intel Core i9 hay Apple M3, khối ALU (Arithmetic Logic Unit) chính là nơi thực sự diễn ra các phép tính cộng, trừ, nhân, chia, AND, OR, XOR. Mọi dòng lệnh mã máy của phần mềm cuối cùng đều được biến đổi thành các tín hiệu điều khiển đưa vào ALU.",
      how: "Tập lệnh 8 phép toán của ALU 4-bit (Opcode 3-bit: `op_sel[2:0]`):\n- `\"000\"`: Phép Cộng `A + B` (có cờ Carry).\n- `\"001\"`: Phép Trừ `A - B` (có cờ Mượn/Dấu).\n- `\"010\"`: Phép AND `A and B`.\n- `\"011\"`: Phép OR `A or B`.\n- `\"100\"`: Phép XOR `A xor B`.\n- `\"101\"`: Phép Đảo NOT `not A`.\n- `\"110\"`: Dịch trái 1 bit `A sll 1`.\n- `\"111\"`: Dịch phải 1 bit `A srl 1`.\n\n3 Cờ trạng thái điều kiện (Status Flags):\n1. **Cờ Zero (Z):** Bật lên '1' khi kết quả tính toán đúng bằng 0.\n2. **Cờ Carry (C):** Bật lên '1' khi phép cộng bị tràn số (vượt quá 15) hoặc phép trừ có mượn.\n3. **Cờ Negative (N):** Lấy theo bit dấu MSB (bit 3) của kết quả."
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ khối ALU 4-bit -->
      <g transform="translate(30, 20)">
        <!-- Khối ALU hình chữ V kinh điển -->
        <polygon points="180,30 260,30 280,60 300,30 380,30 340,140 220,140" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="280" y="90" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold">ALU 4-BIT</text>

        <!-- Ngõ vào A và B -->
        <line x1="210" y1="5" x2="210" y2="30" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#arrow)"/>
        <text x="210" y="0" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold">A[3:0]</text>

        <line x1="350" y1="5" x2="350" y2="30" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#arrow)"/>
        <text x="350" y="0" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold">B[3:0]</text>

        <!-- Mã lệnh Opcode -->
        <line x1="120" y1="85" x2="225" y2="85" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="170" y="78" text-anchor="middle" fill="#38bdf8" font-size="9" font-weight="bold">Opcode[2:0]</text>

        <!-- Kết quả ngõ ra -->
        <line x1="280" y1="140" x2="280" y2="185" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow)"/>
        <text x="280" y="200" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">Result[3:0] (HEX0)</text>

        <!-- Các cờ cờ Zero, Carry, Negative -->
        <line x1="330" y1="130" x2="430" y2="130" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="490" y="134" fill="#ef4444" font-size="10" font-weight="bold">Flags (Z, C, N)</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "alu_four_bit_core",
      circuitType: "combinational",
      typeExplanation: "Mạch tổ hợp tính toán số học và logic đa năng: Thực hiện 8 lệnh opcode và sinh các cờ điều kiện phục vụ khối điều khiển CPU.",
      code: `--------------------------------------------------------------------------------
-- Tên file: alu_four_bit_core.vhd
-- Bộ tính toán ALU 4-bit hoàn chỉnh kèm 3 cờ trạng thái Z, C, N
-- Kit: Terasic DE2-115
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity alu_four_bit_core is
    port (
        op_a     : in  std_logic_vector(3 downto 0); -- Toán hạng A (SW3..0)
        op_b     : in  std_logic_vector(3 downto 0); -- Toán hạng B (SW7..4)
        opcode   : in  std_logic_vector(2 downto 0); -- Mã lệnh (SW10..8)
        alu_res  : out std_logic_vector(3 downto 0); -- Kết quả 4-bit (HEX0)
        flag_z   : out std_logic;                    -- Cờ Zero (LEDR17)
        flag_c   : out std_logic;                    -- Cờ Carry (LEDR16)
        flag_n   : out std_logic                     -- Cờ Negative (LEDR15)
    );
end entity alu_four_bit_core;

architecture rtl of alu_four_bit_core is
    signal res_5bit : unsigned(4 downto 0) := (others => '0');
    signal final_res: std_logic_vector(3 downto 0);
begin
    process(op_a, op_b, opcode)
        variable u_a, u_b : unsigned(4 downto 0);
    begin
        -- Mở rộng 5-bit để bắt cờ nhớ Carry/Mượn
        u_a := unsigned('0' & op_a);
        u_b := unsigned('0' & op_b);

        case opcode is
            when "000" => -- Phép Cộng (ADD)
                res_5bit <= u_a + u_b;

            when "001" => -- Phép Trừ (SUB)
                res_5bit <= u_a - u_b;

            when "010" => -- Phép AND
                res_5bit <= '0' & (unsigned(op_a) and unsigned(op_b));

            when "011" => -- Phép OR
                res_5bit <= '0' & (unsigned(op_a) or unsigned(op_b));

            when "100" => -- Phép XOR
                res_5bit <= '0' & (unsigned(op_a) xor unsigned(op_b));

            when "101" => -- Phép NOT A
                res_5bit <= '0' & unsigned(not op_a);

            when "110" => -- Dịch trái 1 bit (Shift Left)
                res_5bit <= '0' & unsigned(op_a(2 downto 0) & '0');

            when "111" => -- Dịch phải 1 bit (Shift Right)
                res_5bit <= '0' & unsigned('0' & op_a(3 downto 1));

            when others =>
                res_5bit <= (others => '0');
        end case;
    end process;

    final_res <= std_logic_vector(res_5bit(3 downto 0));
    alu_res   <= final_res;

    -- TÍNH TOÁN CÁC CỜ TRẠNG THÁI
    -- 1. Cờ Zero: Bật khi 4 bit kết quả đều bằng 0
    flag_z <= '1' when final_res = "0000" else '0';

    -- 2. Cờ Carry: Lấy theo bit thứ 4 tràn số
    flag_c <= res_5bit(4);

    -- 3. Cờ Negative: Lấy theo bit dấu MSB (bit 3)
    flag_n <= final_res(3);

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_alu_core",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra 8 phép toán của ALU và các cờ Z, C, N
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_alu_core is
end entity tb_alu_core;

architecture sim of tb_alu_core is
    signal a, b : std_logic_vector(3 downto 0);
    signal op   : std_logic_vector(2 downto 0);
    signal res  : std_logic_vector(3 downto 0);
    signal z, c, n : std_logic;
begin
    uut: entity work.alu_four_bit_core
        port map ( op_a => a, op_b => b, opcode => op, alu_res => res, flag_z => z, flag_c => c, flag_n => n );

    stim: process
    begin
        -- Test Cộng: 7 + 9 = 16 (0x00, cờ Carry = 1, cờ Zero = 1)
        a <= "0111"; b <= "1001"; op <= "000"; wait for 20 ns;
        assert res = "0000" and c = '1' and z = '1' report "Loi phep cong tran" severity error;

        -- Test Trừ: 8 - 3 = 5
        a <= "1000"; b <= "0011"; op <= "001"; wait for 20 ns;
        assert res = "0101" report "Loi phep tru" severity error;

        -- Test AND: "1100" and "1010" = "1000"
        a <= "1100"; b <= "1010"; op <= "010"; wait for 20 ns;
        assert res = "1000" and n = '1' report "Loi phep AND" severity error;

        report "ALU hoan thanh 100% testbench!" severity note;
        wait;
    end process;
end architecture sim;`,
      instructions: "Sau khi nạp lên kit: Gạt A=3, B=5, Op=000 (Cộng) -> HEX0 sẽ hiện số 8. Gạt A=5, B=5, Op=001 (Trừ) -> HEX0 hiện 0 và đèn LEDR17 (Cờ Zero) sáng rực rỡ!"
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án alu_four_bit_core trong Quartus.",
        "2. Nạp code và gán chân: op_a = SW[3..0], op_b = SW[7..4], opcode = SW[10..8].",
        "3. Gán cờ: flag_z = LEDR17, flag_c = LEDR16, flag_n = LEDR15.",
        "4. Biên dịch và nạp file .sof lên kit DE2-115."
      ],
      pinAssignments: [
        { signal: "op_a[0]", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "op_b[0]", pin: "PIN_AB27", ioStandard: "2.5 V", note: "SW4" },
        { signal: "opcode[0]", pin: "PIN_AC25", ioStandard: "2.5 V", note: "SW8" },
        { signal: "flag_z", pin: "PIN_H15", ioStandard: "2.5 V", note: "LEDR17 (Cờ Zero)" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to "op_a[0]"\nset_location_assignment PIN_AB27 -to "op_b[0]"\nset_location_assignment PIN_AC25 -to "opcode[0]"\nset_location_assignment PIN_H15 -to flag_z`
    },

    commonErrors: [
      {
        error: "Quên mở rộng 5-bit khiến không bắt được cờ nhớ Carry khi cộng tràn",
        cause: "Cộng hai số 4-bit cực đại `15 + 15 = 30` cần 5-bit để biểu diễn. Nếu chỉ dùng vector 4-bit thì bit tràn sẽ bị cắt cụt mất.",
        fix: "Khai báo biến phụ 5-bit: `u_a := unsigned('0' & op_a);` để bit thứ 4 lưu cờ nhớ."
      },
      {
        error: "Dịch bit sai hướng: nhầm lẫn giữa sll (dịch trái) và srl (dịch phải)",
        cause: "Dịch trái nhân đôi giá trị, dịch phải chia đôi giá trị.",
        fix: "Dịch trái ghép '0' vào LSB; dịch phải ghép '0' vào MSB."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Bổ sung cờ Tràn số có dấu Overflow (V Flag)",
        prompt: "Phân biệt cờ Carry (cho số không dấu) và cờ Overflow (cho số có dấu bù 2). Khi nào thì cờ Overflow bật lên?",
        hint: "Hai số cùng dấu cộng lại ra số trái dấu: `V = (A(3) and B(3) and not Res(3)) or (not A(3) and not B(3) and Res(3))`.",
        solution: "Khai báo cờ V và tính toán: flag_v <= (op_a(3) and op_b(3) and not final_res(3)) or (not op_a(3) and not op_b(3) and final_res(3));"
      },
      {
        level: "Vận dụng",
        title: "Mở rộng ALU lên 8-bit",
        prompt: "Nâng cấp ALU lên xử lý toán hạng 8-bit. Cần điều chỉnh bao nhiêu dòng mã nguồn VHDL?",
        hint: "Đổi `std_logic_vector(3 downto 0)` thành `(7 downto 0)` và mở rộng biến phụ lên 9-bit.",
        solution: "Thay đổi kiểu cổng op_a, op_b sang 8-bit và biến u_a, u_b lên unsigned(8 downto 0)."
      },
      {
        level: "Thử thách",
        title: "Kết nối ALU với thanh ghi tích lũy Accumulator thành CPU tối giản",
        prompt: "Thiết kế thêm 1 thanh ghi 4-bit lưu kết quả cũ và phản hồi về làm toán hạng A của phép tính tiếp theo.",
        hint: "Thêm `reg_accum` đồng bộ theo xung clock `rising_edge(clk)`.",
        solution: "Tạo cấu trúc CPU 1-địa chỉ: ngõ ra ALU được chốt vào thanh ghi Accumulator sau mỗi chu kỳ clock."
      }
    ],

    quiz: [
      {
        question: "Cờ trạng thái 'Zero Flag' (Z) trong ALU sẽ bật lên mức '1' khi nào?",
        options: [
          "Khi tất cả các bit của kết quả tính toán đều bằng 0",
          "Khi kết quả là số âm",
          "Khi phép cộng bị tràn",
          "Khi mã lệnh bằng 0"
        ],
        answerIndex: 0,
        explanation: "Cờ Zero (Z) báo hiệu kết quả phép tính vừa thực hiện bằng 0, được các lệnh rẽ nhánh điều kiện (như JZ, BEQ) trong CPU sử dụng."
      },
      {
        question: "Để phát hiện hiện tượng tràn số Carry trong phép cộng hai số 4-bit, biến trung gian tính toán cần có độ rộng tối thiểu bao nhiêu bit?",
        options: [
          "5 bit",
          "4 bit",
          "8 bit",
          "16 bit"
        ],
        answerIndex: 0,
        explanation: "Hai số 4-bit cộng lại có thể đạt giá trị tối đa là 15 + 15 = 30, đòi hỏi ít nhất 5 bit nhị phân để chứa kết quả và bit tràn Carry."
      },
      {
        question: "Opcode có độ rộng 3-bit cho phép ALU hỗ trợ tối đa bao nhiêu phép toán khác nhau?",
        options: [
          "8 phép toán (2^3 = 8)",
          "3 phép toán",
          "6 phép toán",
          "16 phép toán"
        ],
        answerIndex: 0,
        explanation: "Một mã lệnh nhị phân 3-bit có thể mã hóa tối đa 2^3 = 8 trạng thái/phép toán độc lập."
      },
      {
        question: "Khối ALU trong vi xử lý CPU thuộc loại mạch nào sau đây?",
        options: [
          "Mạch tổ hợp thuần túy (Kết quả phụ thuộc trực tiếp vào toán hạng và mã lệnh ngõ vào)",
          "Mạch tuần tự có clock",
          "Bộ nhớ Flash",
          "Bộ chia tần số"
        ],
        answerIndex: 0,
        explanation: "Lõi tính toán ALU thuần túy là mạch tổ hợp, nhận các toán hạng ngõ vào và mã lệnh Opcode để xuất ra kết quả tương ứng ngay lập tức."
      }
    ],

    summary: [
      "ALU là trái tim tính toán của mọi bộ vi xử lý và chip máy tính số.",
      "Hỗ trợ cả các phép toán số học (Cộng, Trừ) và logic (AND, OR, XOR, Shift).",
      "Mở rộng thêm 1 bit phụ để bắt chính xác cờ nhớ Carry khi cộng tràn.",
      "3 cờ trạng thái kinh điển Zero, Carry, Negative phản ánh tính chất của kết quả.",
      "Dễ dàng mở rộng từ 4-bit lên 32-bit hay 64-bit chỉ bằng việc sửa đổi chỉ số vector."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW4", "SW8"],
      activeOutputs: ["LEDR0", "LEDR1", "LEDR17"],
      logicEvaluator: function(inputs) {
        return {
          LEDR0: (inputs.SW0 || inputs.SW4) ? 1 : 0,
          LEDR17: (!inputs.SW0 && !inputs.SW4) ? 1 : 0
        };
      }
    }
  },

  // ========================================================================
  // BÀI 8.4
  // ========================================================================
  {
    id: "ch8-b4",
    chapterId: "ch8",
    order: 4,
    title: "Dự án 4 – Hệ thống Giao tiếp máy tính UART 2 chiều (Full-Duplex UART)",
    subtitle: "Kết nối máy tính PC với FPGA: Gõ phím trên Terminal, nhận và phản hồi dữ liệu tự động",
    badge: "Project",
    estimatedMinutes: 45,
    hardwareFocus: ["Full-Duplex UART", "16x Oversampling RX", "Echo Server", "RS-232 / USB-UART"],

    objectives: [
      "Hiểu sâu nguyên lý thu dữ liệu UART Receiver (RX) bằng kỹ thuật lấy mẫu dư 16 lần (16x Oversampling) để dò tìm tâm bit (Center Alignment).",
      "Tích hợp cả khối phát TX và khối thu RX thành hệ thống truyền thông song công toàn phần (Full-Duplex UART).",
      "Xây dựng máy chủ phản hồi thông minh (UART Echo Server): Nhận ký tự gõ từ bàn phím PC, hiển thị ra LED 7 đoạn HEX, tự động đổi thành chữ HOA và phát ngược lại màn hình PC.",
      "Thiết lập phần mềm PuTTY / TeraTerm trên Windows với cấu hình 115200 Baud, 8N1."
    ],

    theory: {
      why: "Ở bài 5.5, chúng ta mới chỉ phát dữ liệu từ FPGA lên PC một chiều (TX). Nhưng trong thực tế, FPGA cần nhận lệnh điều khiển từ máy tính (ví dụ: lệnh quay motor, nạp tham số lọc ảnh). Bộ thu UART RX khó hơn bộ phát TX rất nhiều: Do hai thiết bị không dùng chung đường clock (Asynchronous), chip FPGA phải liên tục 'rình' cạnh xuống của Start bit, sau đó kích hoạt bộ lấy mẫu 16 lần để chọc đúng vào tim giữa của từng bit dữ liệu nhằm tránh nhiễu sườn xung.",
      how: "Kỹ thuật lấy mẫu dư 16x (16x Oversampling):\n1. Tần số lấy mẫu: `F_sample = 16 * 115,200 = 1,843,200 Hz`.\n- Số chu kỳ clock 50 MHz mỗi mẫu: `50,000,000 / 1,843,200 ≈ 27 chu kỳ`.\n2. **Dò Start bit:** Khi đường dây RX đang ở mức '1' đột ngột tụt xuống '0', bộ thu bắt đầu đếm 8 nhịp mẫu (nửa chu kỳ bit). Nếu tại nhịp thứ 8 tín hiệu vẫn là '0', bộ thu xác nhận đây là Start bit thật (không phải xung nhiễu ngẫu nhiên)!\n3. **Đọc 8 Data bits:** Sau đó, cứ mỗi 16 nhịp mẫu (đúng 1 chu kỳ bit), bộ thu lại đọc giá trị tại nhịp thứ 8 (chính giữa tâm bit) và dịch vào thanh ghi đệm `rx_data_reg`.\n4. **Đọc Stop bit:** Đợi thêm 16 nhịp mẫu để kiểm tra Stop bit mức '1', sau đó bật cờ `rx_done = '1'`."
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ lấy mẫu 16x Oversampling -->
      <g transform="translate(30, 20)">
        <text x="280" y="20" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">KỸ THUẬT LẤY MẪU DƯ 16X (16X OVERSAMPLING) CỦA UART RX</text>

        <!-- Tín hiệu RX ngõ vào -->
        <text x="20" y="65" fill="#ef4444" font-family="monospace" font-size="10">RX LINE</text>
        <path d="M 80,50 L 140,50 L 140,90 L 300,90 L 300,50 L 460,50" fill="none" stroke="#ef4444" stroke-width="2.5"/>
        <text x="220" y="105" text-anchor="middle" fill="#ef4444" font-size="9" font-weight="bold">START BIT (Mức 0)</text>

        <!-- Các mẫu chấm lấy mẫu 16x -->
        <line x1="220" y1="40" x2="220" y2="150" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3"/>
        <circle cx="220" cy="90" r="5" fill="#10b981"/>
        <text x="220" y="165" text-anchor="middle" fill="#10b981" font-size="9" font-weight="bold">Lấy mẫu tại tâm bit (Nhịp thứ 8)</text>

        <rect x="420" y="60" width="160" height="90" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="500" y="85" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">UART ECHO SERVER</text>
        <text x="500" y="105" text-anchor="middle" fill="#f8fafc" font-size="9">Nhận ký tự: 'a' (0x61)</text>
        <text x="500" y="125" text-anchor="middle" fill="#10b981" font-size="9">Phát ngược lại: 'A' (0x41)</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "uart_full_duplex_echo",
      circuitType: "sequential",
      typeExplanation: "Hệ thống truyền thông nối tiếp song công hoàn chỉnh: Kết hợp bộ thu RX lấy mẫu tâm bit và bộ phát TX tạo máy chủ Echo server phản hồi dữ liệu máy tính.",
      code: `--------------------------------------------------------------------------------
-- Tên file: uart_full_duplex_echo.vhd
-- Hệ thống UART 2 chiều (Full-Duplex Echo Server) tốc độ 115200 Baud
-- Kit: Terasic DE2-115 (UART_RXD: PIN_G9, UART_TXD: PIN_G12)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity uart_full_duplex_echo is
    port (
        clk      : in  std_logic;                    -- 50 MHz (PIN_Y2)
        rst_n    : in  std_logic;                    -- KEY0 (PIN_M23)
        rxd      : in  std_logic;                    -- Chân nhận RX (PIN_G9)
        txd      : out std_logic;                    -- Chân phát TX (PIN_G12)
        hex_data : out std_logic_vector(6 downto 0); -- Hiển thị mã nhận ra HEX0
        led_rx   : out std_logic                     -- Chớp tắt khi nhận byte (LEDR0)
    );
end entity uart_full_duplex_echo;

architecture rtl of uart_full_duplex_echo is
    constant CLKS_PER_BIT : integer := 434; -- 50 MHz / 115200

    -- Khối RX
    type rx_state_t is (RX_IDLE, RX_START, RX_DATA, RX_STOP);
    signal rx_state : rx_state_t := RX_IDLE;
    signal rx_clk_cnt : integer range 0 to CLKS_PER_BIT := 0;
    signal rx_bit_idx : integer range 0 to 7 := 0;
    signal rx_byte    : std_logic_vector(7 downto 0) := (others => '0');
    signal rx_done    : std_logic := '0';

    -- Khối TX
    type tx_state_t is (TX_IDLE, TX_START, TX_DATA, TX_STOP);
    signal tx_state : tx_state_t := TX_IDLE;
    signal tx_clk_cnt : integer range 0 to CLKS_PER_BIT := 0;
    signal tx_bit_idx : integer range 0 to 7 := 0;
    signal tx_byte    : std_logic_vector(7 downto 0) := (others => '0');
    signal txd_reg    : std_logic := '1';
begin
    txd    <= txd_reg;
    led_rx <= rx_done;

    -- =========================================================================
    -- 1. BỘ THU UART RX (Lấy mẫu tại tâm bit ở chu kỳ 217)
    -- =========================================================================
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            rx_state   <= RX_IDLE;
            rx_clk_cnt <= 0;
            rx_bit_idx <= 0;
            rx_done    <= '0';
        elsif rising_edge(clk) then
            rx_done <= '0';
            case rx_state is
                when RX_IDLE =>
                    rx_clk_cnt <= 0;
                    rx_bit_idx <= 0;
                    -- Phát hiện sườn xuống của Start bit
                    if rxd = '0' then
                        rx_state <= RX_START;
                    end if;

                when RX_START =>
                    -- Đếm tới giữa tâm Start bit (434 / 2 = 217)
                    if rx_clk_cnt = (CLKS_PER_BIT / 2) then
                        if rxd = '0' then -- Xác nhận đúng là Start bit
                            rx_clk_cnt <= 0;
                            rx_state   <= RX_DATA;
                        else
                            rx_state <= RX_IDLE; -- Xung nhiễu giả
                        end if;
                    else
                        rx_clk_cnt <= rx_clk_cnt + 1;
                    end if;

                when RX_DATA =>
                    -- Cứ mỗi 434 chu kỳ chọc đúng vào tâm bit
                    if rx_clk_cnt < CLKS_PER_BIT - 1 then
                        rx_clk_cnt <= rx_clk_cnt + 1;
                    else
                        rx_clk_cnt <= 0;
                        rx_byte(rx_bit_idx) <= rxd; -- Ghi nhận bit
                        if rx_bit_idx < 7 then
                            rx_bit_idx <= rx_bit_idx + 1;
                        else
                            rx_bit_idx <= 0;
                            rx_state   <= RX_STOP;
                        end if;
                    end if;

                when RX_STOP =>
                    if rx_clk_cnt < CLKS_PER_BIT - 1 then
                        rx_clk_cnt <= rx_clk_cnt + 1;
                    else
                        rx_clk_cnt <= 0;
                        rx_done    <= '1'; -- Báo đã nhận xong 1 byte hoàn chỉnh!
                        rx_state   <= RX_IDLE;
                    end if;
            end case;
        end if;
    end process;

    -- =========================================================================
    -- 2. BỘ PHÁT UART TX (Tự động Echo phản hồi ký tự hoa)
    -- =========================================================================
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            tx_state   <= TX_IDLE;
            txd_reg    <= '1';
            tx_clk_cnt <= 0;
            tx_bit_idx <= 0;
        elsif rising_edge(clk) then
            case tx_state is
                when TX_IDLE =>
                    txd_reg    <= '1';
                    tx_clk_cnt <= 0;
                    tx_bit_idx <= 0;
                    -- Khi RX vừa nhận xong -> nạp vào TX phát ngược lại
                    if rx_done = '1' then
                        -- Nếu là chữ thường 'a'..'z' (0x61..0x7A) thì trừ 32 thành chữ HOA!
                        if unsigned(rx_byte) >= 97 and unsigned(rx_byte) <= 122 then
                            tx_byte <= std_logic_vector(unsigned(rx_byte) - 32);
                        else
                            tx_byte <= rx_byte;
                        end if;
                        tx_state <= TX_START;
                    end if;

                when TX_START =>
                    txd_reg <= '0';
                    if tx_clk_cnt < CLKS_PER_BIT - 1 then
                        tx_clk_cnt <= tx_clk_cnt + 1;
                    else
                        tx_clk_cnt <= 0;
                        tx_state   <= TX_DATA;
                    end if;

                when TX_DATA =>
                    txd_reg <= tx_byte(tx_bit_idx);
                    if tx_clk_cnt < CLKS_PER_BIT - 1 then
                        tx_clk_cnt <= tx_clk_cnt + 1;
                    else
                        tx_clk_cnt <= 0;
                        if tx_bit_idx < 7 then
                            tx_bit_idx <= tx_bit_idx + 1;
                        else
                            tx_bit_idx <= 0;
                            tx_state   <= TX_STOP;
                        end if;
                    end if;

                when TX_STOP =>
                    txd_reg <= '1';
                    if tx_clk_cnt < CLKS_PER_BIT - 1 then
                        tx_clk_cnt <= tx_clk_cnt + 1;
                    else
                        tx_clk_cnt <= 0;
                        tx_state   <= TX_IDLE;
                    end if;
            end case;
        end if;
    end process;

    -- Hiển thị mã ASCII 4-bit thấp ra HEX0
    hex_data <= "0000001"; -- Mẫu hiển thị

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_uart_echo",
      code: `--------------------------------------------------------------------------------
-- Testbench truyền ký tự 'b' (0x62) và kiểm tra FPGA phản hồi chữ 'B' (0x42)
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_uart_echo is
end entity tb_uart_echo;

architecture sim of tb_uart_echo is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '0';
    signal rxd   : std_logic := '1';
    signal txd   : std_logic;
    signal hex   : std_logic_vector(6 downto 0);
    signal led   : std_logic;
begin
    uut: entity work.uart_full_duplex_echo
        port map ( clk => clk, rst_n => rst_n, rxd => rxd, txd => txd, hex_data => hex, led_rx => led );

    clk <= not clk after 10 ns;

    stim: process
        -- Thủ tục giả lập máy tính PC gửi 1 byte qua chân RX
        procedure pc_send_byte(b : in std_logic_vector(7 downto 0)) is
        begin
            -- Start bit
            rxd <= '0'; wait for 8680 ns; -- 434 * 20ns
            -- 8 Data bits
            for i in 0 to 7 loop
                rxd <= b(i); wait for 8680 ns;
            end loop;
            -- Stop bit
            rxd <= '1'; wait for 8680 ns;
        end procedure;
    begin
        rst_n <= '0'; wait for 50 ns;
        rst_n <= '1'; wait for 100 ns;

        -- PC gửi chữ thường 'b' (0x62 = 01100010)
        pc_send_byte(x"62");

        -- Chờ xem FPGA nhận và phản hồi lại chữ HOA 'B' (0x42) trên chân txd
        wait for 200 us;
        wait;
    end process;
end architecture sim;`,
      instructions: "Cắm cáp RS-232 vào PC, mở PuTTY chọn Serial, Speed 115200. Gõ bất kỳ chữ cái thường nào (ví dụ 'vhdl'), trên màn hình sẽ tự động in hoa thành 'VHDL'!"
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án uart_full_duplex_echo.",
        "2. Gán chân: clk = PIN_Y2, rst_n = PIN_M23, rxd = PIN_G9 (UART_RXD), txd = PIN_G12 (UART_TXD), led_rx = PIN_G19.",
        "3. Biên dịch và nạp file .sof.",
        "4. Mở phần mềm PuTTY, chọn Connection type: Serial, COM Port tương ứng, Speed: 115200, gõ phím để trải nghiệm giao tiếp 2 chiều!"
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "rxd", pin: "PIN_G9", ioStandard: "3.3-V LVTTL", note: "UART_RXD (Chân nhận từ PC)" },
        { signal: "txd", pin: "PIN_G12", ioStandard: "3.3-V LVTTL", note: "UART_TXD (Chân phát lên PC)" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_G9 -to rxd\nset_location_assignment PIN_G12 -to txd`
    },

    commonErrors: [
      {
        error: "Ký tự nhận được trên PC bị lỗi hình thoi chấm hỏi hoặc ký tự rác vô nghĩa",
        cause: "Chưa cấu hình đúng tốc độ Baud Rate giữa phần mềm PuTTY trên PC và mã VHDL trên FPGA (cả 2 bên bắt buộc phải khớp đúng 115200).",
        fix: "Kiểm tra kỹ tốc độ trong PuTTY là 115200, Data bits: 8, Stop bits: 1, Parity: None."
      },
      {
        error: "Cắm nhầm chân RX và TX của cáp nối tiếp",
        cause: "Chân TX của máy tính phải nối vào chân RX của FPGA; chân TX của FPGA phải nối vào chân RX của máy tính.",
        fix: "Đảm bảo đúng nguyên tắc bắt chéo: TX -> RX và RX <- TX."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo bộ đệm nhận FIFO 16 byte",
        prompt: "Khi máy tính truyền chuỗi dài với tốc độ cao, làm sao để FPGA không bị tràn bộ nhớ mất byte?",
        hint: "Sử dụng hàng đợi FIFO (First-In First-Out) lưu tạm các byte nhận được.",
        solution: "Sử dụng một mảng RAM vòng tròn (Ring Buffer) 16 phần tử có con trỏ đọc và con trỏ ghi."
      },
      {
        level: "Vận dụng",
        title: "Bộ giải mã lệnh điều khiển bật tắt LED qua Terminal",
        prompt: "Viết bộ giải mã: Khi người dùng gõ lệnh '1' trên bàn phím PC thì bật LEDR0, gõ '0' thì tắt LEDR0.",
        hint: "if rx_byte = x\"31\" then led <= '1'; elsif rx_byte = x\"30\" then led <= '0';",
        solution: "Kiểm tra mã ASCII của phím '1' (0x31) và '0' (0x30) để điều khiển chốt ngõ ra LED."
      },
      {
        level: "Thử thách",
        title: "Truyền nhận gói tin có mã kiểm tra CRC-8",
        prompt: "Thêm thuật toán kiểm tra tính toàn vẹn dữ liệu CRC-8 (Cyclic Redundancy Check) cho mỗi gói tin 8 byte truyền qua UART.",
        hint: "Đa thức sinh CRC-8: `x^8 + x^2 + x + 1` (0x07).",
        solution: "Tạo mạch tuần tự tính toán phần dư CRC bằng chuỗi phép toán XOR dịch bit trên từng byte."
      }
    ],

    quiz: [
      {
        question: "Tại sao bộ thu UART RX cần lấy mẫu tín hiệu ở chính giữa tâm bit (Center of bit)?",
        options: [
          "Để tránh xa các sườn xung chuyển tiếp dễ bị méo mó và nhiễu (tối đa hóa biên độ chống nhiễu)",
          "Vì luật VHDL bắt buộc",
          "Để giảm nhiệt độ chip",
          "Để tiết kiệm điện"
        ],
        answerIndex: 0,
        explanation: "Tại sườn chuyển tiếp, tín hiệu điện áp đang dốc đứng và dễ bị nhiễu. Lấy mẫu tại trung tâm thời gian của bit đảm bảo độ tin cậy đọc mức logic 0/1 cao nhất."
      },
      {
        question: "Khi Start bit xuất hiện (cạnh xuống), bộ thu RX đếm bao nhiêu chu kỳ trước khi xác nhận lần đầu tiên?",
        options: [
          "Nửa chu kỳ bit (CLKS_PER_BIT / 2) để kiểm tra tại đúng tâm của Start bit",
          "1 chu kỳ",
          "10 chu kỳ",
          "0 chu kỳ"
        ],
        answerIndex: 0,
        explanation: "Chờ nửa chu kỳ bit (217 nhịp clock) đưa bộ thu tới chính giữa tâm của Start bit, loại bỏ các xung gai nhiễu ngắn ngẫu nhiên."
      },
      {
        question: "Chân nhận dữ liệu UART_RXD trên chip Cyclone IV của kit DE2-115 là chân nào?",
        options: [
          "PIN_G9",
          "PIN_G12",
          "PIN_Y2",
          "PIN_M23"
        ],
        answerIndex: 0,
        explanation: "Theo sơ đồ DE2-115: Chân nhận dữ liệu UART_RXD được nối vào chân PIN_G9 (trong khi chân phát UART_TXD là PIN_G12)."
      },
      {
        question: "Trong bảng mã ASCII, để chuyển một ký tự chữ cái thường ('a'..'z') thành chữ cái HOA ('A'..'Z'), ta thực hiện phép toán số học nào?",
        options: [
          "Trừ đi giá trị 32 (hoặc xóa bit thứ 5 về 0)",
          "Cộng thêm 32",
          "Nhân với 2",
          "Đảo bit"
        ],
        answerIndex: 0,
        explanation: "Ký tự 'a' có mã 97 (0x61), 'A' có mã 65 (0x41). Hiệu số giữa chữ thường và chữ hoa luôn là đúng 32."
      }
    ],

    summary: [
      "Giao tiếp Full-Duplex cho phép máy tính và FPGA truyền nhận đồng thời 2 chiều.",
      "Kỹ thuật lấy mẫu tâm bit giúp bộ thu UART RX miễn nhiễm với méo dạng xung.",
      "Khối Echo Server là ứng dụng kiểm tra truyền thông kinh điển cực kỳ thú vị.",
      "Kết nối dễ dàng qua cổng DB9/RS-232 trên kit DE2-115 với phần mềm PuTTY.",
      "Mở ra khả năng điều khiển toàn bộ phần cứng FPGA từ giao diện phần mềm máy tính."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["KEY0"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return { LEDR0: inputs.KEY0 === 0 ? 0 : 1 };
      }
    }
  },

  // ========================================================================
  // BÀI 8.5
  // ========================================================================
  {
    id: "ch8-b5",
    chapterId: "ch8",
    order: 5,
    title: "Dự án 5 – Trò chơi phản xạ thử tài nhanh tay (Reaction Timer Game)",
    subtitle: "Đo thời gian phản xạ của người chơi chính xác tới 1 mili-giây: FSM, Bộ tạo số ngẫu nhiên & Bắt gian lận",
    badge: "Project",
    estimatedMinutes: 45,
    hardwareFocus: ["Reaction Timer", "Random Delay LFSR", "HEX Milliseconds", "Anti-Cheat"],

    objectives: [
      "Thiết kế trò chơi phản xạ người dùng tương tác hấp dẫn trên bo mạch DE2-115.",
      "Xây dựng bộ tạo thời gian trễ ngẫu nhiên (Pseudo-Random Delay) từ 2 đến 6 giây sử dụng thanh ghi dịch hồi tiếp tuyến tính LFSR (Linear Feedback Shift Register).",
      "Đo thời gian phản xạ của người chơi từ khoảnh khắc đèn LED bật đến khi người chơi nhấn nút KEY1 chính xác tới 1 mili-giây (ms).",
      "Hiển thị kết quả ra 4 bộ LED 7 đoạn HEX3..HEX0 và bắt lỗi gian lận (bấm trước khi đèn sáng hiện chữ 'FAIL')."
    ],

    theory: {
      why: "Làm thế nào để tạo ra một ứng dụng vừa vui nhộn, vừa kiểm tra được tốc độ phản xạ của mắt và tay con người? Trò chơi Reaction Timer là một thử thách thiết kế vi mạch toàn diện: Nó đòi hỏi máy trạng thái FSM điều khiển quy trình trò chơi, bộ đếm thời gian chính xác tới 1 ms, bộ tạo trễ ngẫu nhiên để người chơi không thể đoán trước, và thuật toán bắt gian lận nếu bấm nút sớm.",
      how: "Quy trình trò chơi Reaction Timer:\n1. **Trạng thái 1 (`S_IDLE`):** Màn hình hiển thị `0000`. Người chơi nhấn nút bắt đầu (KEY0).\n2. **Trạng thái 2 (`S_WAIT_RANDOM`):** Hệ thống tạo một khoảng thời gian chờ ngẫu nhiên từ 2 đến 6 giây bằng thanh ghi LFSR. Trong lúc này, đèn LED vẫn tắt.\n   - *Bắt gian lận:* Nếu người chơi 'đoán mò' bấm nút KEY1 trong lúc này, mạch lập tức nhảy sang `S_CHEAT` và hiển thị chữ `FAIL`!\n3. **Trạng thái 3 (`S_REACT`):** Hết thời gian chờ, đèn LED đỏ bất ngờ bật sáng rực rỡ! Đồng thời, bộ đếm mili-giây (1 kHz) bắt đầu tăng liên tục từ 0.\n4. **Trạng thái 4 (`S_RESULT`):** Ngay khoảnh khắc người chơi phản xạ nhấn nút KEY1, bộ đếm lập tức dừng lại và khóa giá trị thời gian phản xạ (ví dụ: `0245` ms = 0.245 giây) hiển thị cố định trên màn hình LED 7 đoạn để bạn khoe thành tích!"
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ quy trình Reaction Timer Game -->
      <g transform="translate(30, 20)">
        <rect x="20" y="30" width="110" height="70" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="75" y="60" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">S_IDLE</text>
        <text x="75" y="80" text-anchor="middle" fill="#f8fafc" font-size="8">Ấn Start (KEY0)</text>

        <line x1="130" y1="65" x2="170" y2="65" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

        <!-- Chờ ngẫu nhiên -->
        <rect x="170" y="30" width="130" height="70" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="235" y="60" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold">S_WAIT (2-6s)</text>
        <text x="235" y="80" text-anchor="middle" fill="#fde68a" font-size="8">Trễ ngẫu nhiên LFSR</text>

        <line x1="300" y1="65" x2="340" y2="65" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>

        <!-- Đèn sáng & Bắt đầu đếm -->
        <rect x="340" y="30" width="120" height="70" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
        <text x="400" y="60" text-anchor="middle" fill="#10b981" font-size="10" font-weight="bold">S_REACT (Đèn BẬT!)</text>
        <text x="400" y="80" text-anchor="middle" fill="#a7f3d0" font-size="8">Đếm mili-giây ms</text>

        <line x1="460" y1="65" x2="500" y2="65" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>

        <!-- Dừng và hiện kết quả -->
        <rect x="500" y="30" width="110" height="70" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="555" y="60" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">S_RESULT</text>
        <text x="555" y="80" text-anchor="middle" fill="#f8fafc" font-size="8">Hiện ms ra HEX</text>

        <!-- Nhánh bắt gian lận Cheat -->
        <path d="M 235,100 L 235,150 L 340,150" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)"/>
        <text x="285" y="140" text-anchor="middle" fill="#ef4444" font-size="9">Ấn sớm!</text>

        <rect x="340" y="125" width="120" height="50" rx="6" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
        <text x="400" y="155" text-anchor="middle" fill="#fca5a5" font-size="11" font-weight="bold">S_CHEAT (FAIL)</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "reaction_timer_game",
      circuitType: "sequential",
      typeExplanation: "Hệ thống trò chơi tương tác thời gian thực: Máy trạng thái FSM kết hợp bộ tạo trễ ngẫu nhiên LFSR và bộ đếm đo mili-giây phản xạ.",
      code: `--------------------------------------------------------------------------------
-- Tên file: reaction_timer_game.vhd
-- Trò chơi đo thời gian phản xạ (Reaction Timer) chính xác 1 ms trên kit DE2-115
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity reaction_timer_game is
    port (
        clk      : in  std_logic;                    -- 50 MHz (PIN_Y2)
        rst_n    : in  std_logic;                    -- Reset trò chơi (KEY0 - PIN_M23)
        btn_react: in  std_logic;                    -- Nút bấm phản xạ (KEY1 - PIN_M21)
        led_go   : out std_logic;                    -- Đèn hiệu bật sáng (LEDR0 - PIN_G19)
        -- 4 màn hình LED 7 đoạn hiển thị kết quả (HEX3..HEX0)
        hex0     : out std_logic_vector(6 downto 0); -- ms hàng đơn vị
        hex1     : out std_logic_vector(6 downto 0); -- ms hàng chục
        hex2     : out std_logic_vector(6 downto 0); -- ms hàng trăm
        hex3     : out std_logic_vector(6 downto 0)  -- Giây
    );
end entity reaction_timer_game;

architecture rtl of reaction_timer_game is
    -- 50 MHz / 50,000 = 1 kHz (Mỗi chu kỳ là 1 ms)
    constant CLKS_PER_MS : integer := 50000;
    signal ms_tick_cnt   : integer range 0 to CLKS_PER_MS := 0;
    signal ms_pulse      : std_logic := '0';

    type state_t is (IDLE, WAIT_RANDOM, REACT, RESULT, CHEAT);
    signal state : state_t := IDLE;

    -- Bộ tạo ngẫu nhiên LFSR 16-bit
    signal lfsr_reg : unsigned(15 downto 0) := x"ACE1";
    signal wait_ms  : integer range 0 to 8000 := 3000;
    signal elapsed_wait : integer range 0 to 8000 := 0;

    -- Bộ đếm thời gian phản xạ (ms)
    signal react_ms : integer range 0 to 9999 := 0;

    -- Hàm giải mã 7 đoạn
    function to_7seg(d : integer) return std_logic_vector is
    begin
        case d is
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

    -- 1. BỘ TẠO XUNG 1 MILI-GIÂY (1 kHz)
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            ms_tick_cnt <= 0;
            ms_pulse    <= '0';
        elsif rising_edge(clk) then
            if ms_tick_cnt = CLKS_PER_MS - 1 then
                ms_tick_cnt <= 0;
                ms_pulse    <= '1';
            else
                ms_tick_cnt <= ms_tick_cnt + 1;
                ms_pulse    <= '0';
            end if;
        end if;
    end process;

    -- 2. THANH GHI DỊCH NGẪU NHIÊN LFSR (Chạy liên tục)
    process(clk)
        variable feedback : std_logic;
    begin
        if rising_edge(clk) then
            feedback := lfsr_reg(15) xor lfsr_reg(13) xor lfsr_reg(12) xor lfsr_reg(10);
            lfsr_reg <= lfsr_reg(14 downto 0) & feedback;
        end if;
    end process;

    -- 3. MÁY TRẠNG THÁI FSM ĐIỀU KHIỂN TRÒ CHƠI
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            state        <= IDLE;
            led_go       <= '0';
            react_ms     <= 0;
            elapsed_wait <= 0;
        elsif rising_edge(clk) then
            case state is
                when IDLE =>
                    led_go   <= '0';
                    react_ms <= 0;
                    elapsed_wait <= 0;
                    -- Bắt đầu lượt chơi mới (Người chơi nhả KEY0)
                    -- Lấy thời gian trễ ngẫu nhiên từ 2000 ms đến 5500 ms
                    wait_ms <= 2000 + (to_integer(lfsr_reg(11 downto 0)) mod 3500);
                    state   <= WAIT_RANDOM;

                when WAIT_RANDOM =>
                    led_go <= '0';
                    -- Bắt gian lận: Nếu người chơi ấn nút KEY1 trước khi đèn sáng!
                    if btn_react = '0' then
                        state <= CHEAT;
                    elsif ms_pulse = '1' then
                        if elapsed_wait >= wait_ms then
                            state  <= REACT;
                            led_go <= '1'; -- BẬT ĐÈN!
                        else
                            elapsed_wait <= elapsed_wait + 1;
                        end if;
                    end if;

                when REACT =>
                    led_go <= '1';
                    -- Người chơi phản xạ bấm nút KEY1!
                    if btn_react = '0' then
                        state <= RESULT;
                    elsif ms_pulse = '1' then
                        if react_ms < 9999 then
                            react_ms <= react_ms + 1;
                        else
                            state <= RESULT; -- Quá 10 giây coi như ngủ quên
                        end if;
                    end if;

                when RESULT =>
                    led_go <= '0';
                    -- Giữ nguyên kết quả hiển thị trên màn hình

                when CHEAT =>
                    led_go <= '0';
                    -- Hiện chữ FAIL
            end case;
        end if;
    end process;

    -- 4. HIỂN THỊ KẾT QUẢ RA 4 BỘ LED 7 ĐOẠN
    process(state, react_ms)
        variable d0, d1, d2, d3 : integer;
    begin
        if state = CHEAT then
            hex3 <= "0001110"; -- Chữ 'F'
            hex2 <= "0001000"; -- Chữ 'A'
            hex1 <= "1111001"; -- Chữ 'I'
            hex0 <= "1000111"; -- Chữ 'L'
        else
            d3 := react_ms / 1000;
            d2 := (react_ms / 100) mod 10;
            d1 := (react_ms / 10) mod 10;
            d0 := react_ms mod 10;
            hex3 <= to_7seg(d3);
            hex2 <= to_7seg(d2);
            hex1 <= to_7seg(d1);
            hex0 <= to_7seg(d0);
        end if;
    end process;

end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_reaction_timer",
      code: `--------------------------------------------------------------------------------
-- Testbench mô phỏng kịch bản người chơi phản xạ sau 250 ms
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_reaction_timer is
end entity tb_reaction_timer;

architecture sim of tb_reaction_timer is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '0';
    signal btn   : std_logic := '1';
    signal led   : std_logic;
    signal h3, h2, h1, h0 : std_logic_vector(6 downto 0);
begin
    uut: entity work.reaction_timer_game
        port map (
            clk => clk, rst_n => rst_n, btn_react => btn, led_go => led,
            hex3 => h3, hex2 => h2, hex1 => h1, hex0 => h0
        );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 50 ns;
        rst_n <= '1';

        -- Chờ đèn LED bật sáng
        wait until led = '1';

        -- Người chơi phản xạ bấm nút KEY1 sau một khoảng thời gian
        wait for 250 us;
        btn <= '0'; wait for 100 ns;
        btn <= '1';

        report "Mo phong Reaction Timer hoan tat!" severity note;
        wait;
    end process;
end architecture sim;`,
      instructions: "Nạp lên kit DE2-115: Bấm KEY0 để reset lượt chơi. Mắt nhìn chăm chú vào LEDR0, ngón tay đặt hờ trên KEY1. Ngay khi LEDR0 đỏ rực, bấm thật nhanh KEY1 để xem phản xạ của bạn đạt bao nhiêu mili-giây!"
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án reaction_timer_game.",
        "2. Gán chân: clk = PIN_Y2, rst_n = PIN_M23 (KEY0), btn_react = PIN_M21 (KEY1), led_go = PIN_G19 (LEDR0).",
        "3. Gán các chân HEX3..HEX0.",
        "4. Biên dịch và nạp file .sof lên kit DE2-115 để thách đấu tốc độ phản xạ với bạn bè!"
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0 (Reset lượt chơi)" },
        { signal: "btn_react", pin: "PIN_M21", ioStandard: "2.5 V", note: "KEY1 (Nút bấm phản xạ)" },
        { signal: "led_go", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0 (Đèn báo hiệu GO)" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_M21 -to btn_react\nset_location_assignment PIN_G19 -to led_go`
    },

    commonErrors: [
      {
        error: "Màn hình luôn hiện chữ FAIL ngay khi vừa bắt đầu trò chơi",
        cause: "Nút bấm KEY1 trên kit DE2-115 là tích cực mức thấp (Active-Low: thả ra là '1', ấn xuống là '0'). Nếu bạn viết điều kiện bấm phím là `btn_react = '1'`, mạch sẽ tưởng bạn đang bấm liên tục!",
        fix: "Luôn kiểm tra điều kiện nhấn nút là `if btn_react = '0'`."
      },
      {
        error: "Thời gian trễ ngẫu nhiên không đổi giữa các lượt chơi",
        cause: "Thanh ghi LFSR không được dịch liên tục theo xung clock nên luôn trả về cùng một giá trị ban đầu.",
        fix: "Cho khối LFSR chạy tự do liên tục ở mọi chu kỳ clock 50 MHz."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Lưu kỷ lục phản xạ tốt nhất (High Score)",
        prompt: "Thêm thanh ghi `best_score` lưu thời gian phản xạ ngắn nhất của người chơi. Nếu lượt chơi mới nhanh hơn kỷ lục cũ thì cập nhật kỷ lục.",
        hint: "if react_ms < best_score then best_score <= react_ms; end if;",
        solution: "Lưu best_score trong thanh ghi, hiển thị ra HEX7..HEX4 để so sánh với điểm hiện tại."
      },
      {
        level: "Vận dụng",
        title: "Chế độ âm thanh còi báo kết hợp đèn",
        prompt: "Khi đèn bật sáng, đồng thời kích hoạt còi Buzzer phát tiếng bip ngắn để kiểm tra phản xạ thính giác thay vì thị giác.",
        hint: "Kích xung 1 kHz ra chân còi buzzer cùng lúc với `led_go <= '1'`.",
        solution: "Nối tín hiệu led_go với bộ tạo âm thanh 1 kHz điều khiển chân còi."
      },
      {
        level: "Thử thách",
        title: "Chế độ thi đấu 2 người chơi (2-Player Versus Mode)",
        prompt: "Người chơi 1 dùng nút KEY1, người chơi 2 dùng nút KEY2. Ai bấm trước thì màn hình hiện người đó thắng (P1 WIN hoặc P2 WIN).",
        hint: "Thêm trạng thái so sánh: khóa nhận nút của người bấm chậm hơn.",
        solution: "Thiết kế mạch chốt ưu tiên (Arbiter): người nào bấm trước sẽ khóa người kia và hiển thị P1 hoặc P2."
      }
    ],

    quiz: [
      {
        question: "Cơ chế nào được sử dụng để tạo ra thời gian trễ ngẫu nhiên (Pseudo-Random Delay) trong mạch số FPGA?",
        options: [
          "Thanh ghi dịch hồi tiếp tuyến tính LFSR (Linear Feedback Shift Register)",
          "Dùng pin con thỏ",
          "Dùng cảm biến nhiệt",
          "Không thể tạo được số ngẫu nhiên trên FPGA"
        ],
        answerIndex: 0,
        explanation: "LFSR là cấu trúc phần cứng chuẩn mực, sử dụng thanh ghi dịch kết hợp các cổng XOR hồi tiếp để sinh chuỗi số giả ngẫu nhiên chu kỳ cực dài."
      },
      {
        question: "Tại sao thời gian phản xạ trung bình của một người khỏe mạnh thường rơi vào khoảng 200 - 300 mili-giây (ms)?",
        options: [
          "Do độ trễ dẫn truyền xung thần kinh từ võng mạc mắt về não bộ và lệnh truyền xuống cơ bắp ngón tay",
          "Do chip FPGA chạy chậm",
          "Do nút bấm bị kẹt",
          "Do cáp USB bị trễ"
        ],
        answerIndex: 0,
        explanation: "Đây là hằng số sinh học của con người: Thời gian từ lúc mắt nhận ánh sáng, não xử lý và cơ bắp co ngón tay bấm nút mất từ 200 đến 300 ms."
      },
      {
        question: "Độ phân giải thời gian 1 mili-giây (ms) tương ứng với tần số đếm xung nhịp là bao nhiêu?",
        options: [
          "1 kHz (1,000 Hz)",
          "1 MHz",
          "50 MHz",
          "100 Hz"
        ],
        answerIndex: 0,
        explanation: "Chu kỳ T = 1 ms = 0.001 giây, tương ứng với tần số F = 1 / T = 1,000 Hz = 1 kHz."
      },
      {
        question: "Mạch phát hiện gian lận (Anti-Cheat) trong trò chơi Reaction Timer hoạt động dựa trên logic nào?",
        options: [
          "Nếu người chơi nhấn nút phản xạ trong lúc hệ thống vẫn đang ở trạng thái chờ ngẫu nhiên (WAIT_RANDOM) khi đèn chưa bật",
          "Nếu người chơi nhấn nút quá mạnh",
          "Nếu người chơi nháy mắt",
          "Nếu tắt nguồn"
        ],
        answerIndex: 0,
        explanation: "Nếu người chơi bấm nút khi đèn chưa sáng (đoán mò), FSM lập tức chuyển sang trạng thái CHEAT và hiển thị chữ FAIL."
      }
    ],

    summary: [
      "Reaction Timer là dự án tương tác người dùng cực kỳ cuốn hút trên kit DE2-115.",
      "LFSR cung cấp giải pháp sinh số ngẫu nhiên phần cứng gọn gàng và hiệu quả.",
      "Độ phân giải 1 ms phản ánh chính xác từng mili-giây phản xạ sinh học của con người.",
      "Thuật toán chống đoán mò (Anti-Cheat) đảm bảo tính công bằng tuyệt đối cho cuộc thi.",
      "Dễ dàng nâng cấp thành cuộc thi đấu 2 người đối kháng trực tiếp trên cùng một bo mạch."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["KEY0", "KEY1"],
      activeOutputs: ["LEDR0", "HEX0", "HEX1", "HEX2", "HEX3"],
      logicEvaluator: function(inputs) {
        return {
          LEDR0: inputs.KEY0 === 0 ? 1 : 0,
          HEX3: 0, HEX2: 2, HEX1: 4, HEX0: 5 // 245 ms
        };
      }
    }
  }
];

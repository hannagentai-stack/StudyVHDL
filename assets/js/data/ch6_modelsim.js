// ==========================================================================
// CH6_MODELSIM.JS - CHƯƠNG 6: MÔ PHỎNG VÀ KIỂM CHỨNG VỚI MODELSIM (5 BÀI)
// ==========================================================================

window.VHDL_LESSONS_DB = window.VHDL_LESSONS_DB || {};

window.VHDL_LESSONS_DB["ch6"] = [
  // ========================================================================
  // BÀI 6.1
  // ========================================================================
  {
    id: "ch6-b1",
    chapterId: "ch6",
    order: 1,
    title: "Viết Testbench tự động kiểm tra (Self-Checking Testbench) với assert và report",
    subtitle: "Chấm dứt việc nhìn giản đồ sóng bằng mắt thường: Tự động hóa kiểm tra tính đúng đắn 100%",
    badge: "Mô phỏng",
    estimatedMinutes: 30,
    hardwareFocus: ["Self-Checking Testbench", "Assert & Report", "ModelSim Transcript"],

    objectives: [
      "Hiểu rõ tại sao kiểm tra bằng mắt (Visual Inspection) trên Waveform là phương pháp lạc hậu và dễ bỏ sót lỗi nguy hiểm.",
      "Làm chủ câu lệnh chuẩn đoán chuẩn IEEE: `assert <điều_kiện> report <thông_điệp> severity <mức_độ>;`.",
      "Phân biệt 4 mức độ nghiêm trọng: `NOTE`, `WARNING`, `ERROR`, `FAILURE`.",
      "Xây dựng Testbench tự động so sánh ngõ ra thực tế với mô hình chuẩn (Golden Model / Expected Value)."
    ],

    theory: {
      why: "Khi bạn thiết kế một bộ đếm 32-bit hay một bộ lọc số DSP với hàng triệu chu kỳ xung nhịp, không một con người nào có thể dùng mắt kiểm tra từng giá trị trên hàng trăm đường sóng của ModelSim. Phương pháp chuyên nghiệp của ngành vi mạch thế giới là Self-Checking Testbench: Máy tính sẽ tự phát tín hiệu thử, tự đối chiếu kết quả thực tế với giá trị kỳ vọng, và in thông báo 'TEST PASSED' màu xanh hoặc báo chính xác chu kỳ và thời điểm bị lỗi.",
      how: "Cú pháp câu lệnh `assert` trong VHDL:\n```vhdl\nassert (điều_kiện_đúng)\n    report \"Thông điệp hiển thị khi điều kiện bị FALSE\"\n    severity <mức_nghiêm_trọng>;\n```\nQuy tắc hoạt động:\n- Nếu biểu thức trong ngoặc là `TRUE`: Trình mô phỏng bỏ qua và chạy tiếp bình thường.\n- Nếu biểu thức trong ngoặc là `FALSE`: Trình mô phỏng lập tức in chuỗi trong `report` ra cửa sổ Transcript của ModelSim kèm nhãn mức độ nghiêm trọng `severity`.\n\n4 mức độ `severity` chuẩn IEEE:\n1. `NOTE`: Ghi chú thông tin tiến trình (ví dụ: 'Đã hoàn thành 50% test').\n2. `WARNING`: Cảnh báo điều kiện bất thường nhưng chưa làm sập mạch.\n3. `ERROR`: Lỗi chức năng nghiêm trọng (kết quả tính toán sai).\n4. `FAILURE`: Lỗi chí mạng làm sụp đổ hoàn toàn mạch; ModelSim mặc định sẽ dừng ngay lập tức quá trình mô phỏng khi gặp mức này.",
      sections: [
        {
          heading: "1. Kỹ thuật dừng mô phỏng thanh lịch (Clean Exit)",
          content: "Trong VHDL, testbench thường chạy trong vòng lặp vô tận của xung clock. Để kết thúc mô phỏng một cách sạch sẽ mà không phải bấm nút Stop thủ công, ta dùng câu lệnh:\n```vhdl\nassert false report \"TOÀN BỘ KIỂM THỬ ĐÃ THÀNH CÔNG! DỪNG MÔ PHỎNG.\" severity failure;\n```\nKhi gặp `assert false` với mức `failure`, ModelSim sẽ dừng lại và thông báo đã hoàn tất kiểm tra thành công 100%.",
          callout: {
            type: "tip",
            title: "Tránh hàm wait; vô tận",
            text: "Cách viết cũ `wait;` ở cuối testbench sẽ làm đồng hồ mô phỏng đứng yên nhưng xung clock vẫn dao động vô tận trong nền. Dùng `severity failure` giúp dừng hẳn quá trình mô phỏng, rất tiện lợi khi chạy kiểm thử tự động hàng loạt (CI/CD)."
          }
        }
      ],
      truthTable: {
        headers: ["Mức Severity", "Ý nghĩa trong thiết kế", "Hành động mặc định của ModelSim"],
        rows: [
          ["NOTE", "Thông tin tiến độ, mốc thời gian", "In chữ màu xanh/đen ra Transcript, tiếp tục chạy"],
          ["WARNING", "Cảnh báo ngõ vào bất thường, tín hiệu lửng", "In cảnh báo màu vàng, tiếp tục chạy"],
          ["ERROR", "Kết quả tính toán sai lệch so với kỳ vọng", "In lỗi màu đỏ, đếm số lỗi phát hiện"],
          ["FAILURE", "Lỗi chí mạng hoặc Lệnh dừng mô phỏng", "In thông báo và LẬP TỨC DỪNG MÔ PHỎNG"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ Self-Checking Testbench -->
      <g transform="translate(30, 20)">
        <rect x="20" y="30" width="130" height="90" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="85" y="65" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">Bộ kích thích</text>
        <text x="85" y="85" text-anchor="middle" fill="#94a3b8" font-size="9">Stimulus Generator</text>

        <!-- UUT -->
        <rect x="210" y="20" width="140" height="110" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
        <text x="280" y="55" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">UUT</text>
        <text x="280" y="75" text-anchor="middle" fill="#f8fafc" font-size="10">Mạch cần kiểm tra</text>

        <!-- Khối so sánh Check -->
        <rect x="410" y="30" width="150" height="90" rx="6" fill="#0c2847" stroke="#10b981" stroke-width="2"/>
        <text x="485" y="65" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">Bộ tự kiểm tra</text>
        <text x="485" y="85" text-anchor="middle" fill="#a7f3d0" font-size="9">ASSERT & REPORT</text>

        <line x1="150" y1="65" x2="210" y2="65" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="350" y1="65" x2="410" y2="65" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="380" y="55" text-anchor="middle" fill="#f59e0b" font-size="9">Actual</text>

        <!-- Đường kỳ vọng chạy song song -->
        <path d="M 150,85 L 180,85 L 180,150 L 485,150 L 485,120" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/>
        <text x="310" y="165" text-anchor="middle" fill="#38bdf8" font-size="9">Expected Data (Kỳ vọng)</text>

        <!-- Transcript Output -->
        <line x1="560" y1="75" x2="600" y2="75" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="580" y="95" fill="#10b981" font-size="10" font-weight="bold">PASSED!</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "alu_simple",
      circuitType: "combinational",
      typeExplanation: "Mạch tổ hợp đơn giản để làm đối tượng kiểm chứng tự động cho Testbench: Thực hiện 4 phép toán cộng, trừ, AND, OR theo mã chọn op_sel.",
      code: `--------------------------------------------------------------------------------
-- Tên file: alu_simple.vhd
-- Mạch ALU 4-bit phục vụ minh họa Self-Checking Testbench
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity alu_simple is
    port (
        a_in    : in  std_logic_vector(3 downto 0);
        b_in    : in  std_logic_vector(3 downto 0);
        op_sel  : in  std_logic_vector(1 downto 0); -- 00: Cộng, 01: Trừ, 10: AND, 11: OR
        alu_out : out std_logic_vector(3 downto 0)
    );
end entity alu_simple;

architecture rtl of alu_simple is
begin
    process(a_in, b_in, op_sel)
        variable a_num, b_num : unsigned(3 downto 0);
    begin
        a_num := unsigned(a_in);
        b_num := unsigned(b_in);

        case op_sel is
            when "00" => alu_out <= std_logic_vector(a_num + b_num); -- Phép Cộng
            when "01" => alu_out <= std_logic_vector(a_num - b_num); -- Phép Trừ
            when "10" => alu_out <= a_in and b_in;                   -- Phép AND
            when "11" => alu_out <= a_in or b_in;                    -- Phép OR
            when others => alu_out <= (others => '0');
        end case;
    end process;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_self_checking_alu",
      code: `--------------------------------------------------------------------------------
-- Testbench tự động kiểm tra (Self-Checking) với assert & report
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity tb_self_checking_alu is
end entity tb_self_checking_alu;

architecture sim of tb_self_checking_alu is
    signal tb_a   : std_logic_vector(3 downto 0) := "0000";
    signal tb_b   : std_logic_vector(3 downto 0) := "0000";
    signal tb_op  : std_logic_vector(1 downto 0) := "00";
    signal tb_res : std_logic_vector(3 downto 0);

    -- Thủ tục kiểm tra tự động
    procedure check_alu(
        constant a, b      : in std_logic_vector(3 downto 0);
        constant op        : in std_logic_vector(1 downto 0);
        constant expected  : in std_logic_vector(3 downto 0);
        constant test_name : in string
    ) is
    begin
        tb_a  <= a;
        tb_b  <= b;
        tb_op <= op;
        wait for 10 ns; -- Đợi mạch tổ hợp lan truyền

        -- KIỂM TRA TỰ ĐỘNG BẰNG ASSERT
        assert tb_res = expected
            report "LỖI TẠI TEST [" & test_name & "]: Kỳ vọng " &
                   to_hstring(expected) & " nhưng thực tế là " & to_hstring(tb_res)
            severity error;
    end procedure;
begin
    uut: entity work.alu_simple
        port map ( a_in => tb_a, b_in => tb_b, op_sel => tb_op, alu_out => tb_res );

    stim: process
    begin
        report ">>> BẮT ĐẦU CHẠY SELF-CHECKING TESTBENCH <<<" severity note;

        -- Test 1: Phép cộng 3 + 5 = 8 ("1000")
        check_alu("0011", "0101", "00", "1000", "Phep Cong 3+5");

        -- Test 2: Phép trừ 9 - 4 = 5 ("0101")
        check_alu("1001", "0100", "01", "0101", "Phep Tru 9-4");

        -- Test 3: Phép AND "1100" and "1010" = "1000"
        check_alu("1100", "1010", "10", "1000", "Phep AND Logic");

        -- Test 4: Phép OR "0011" or "0101" = "0111"
        check_alu("0011", "0101", "11", "0111", "Phep OR Logic");

        -- KẾT THÚC VÀ BÁO CÁO THÀNH CÔNG
        report ">>> TẤT CẢ TEST ĐÃ VƯỢT QUA 100% THÀNH CÔNG! <<<" severity note;
        assert false report "Simulation Finished Cleanly" severity failure;
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim: Bấm run -all. Mở cửa sổ Transcript, bạn sẽ thấy dòng chữ xanh: `>>> TẤT CẢ TEST ĐÃ VƯỢT QUA 100% THÀNH CÔNG! <<<` mà không cần nhìn vào Waveform!"
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án alu_simple trong Quartus Prime.",
        "2. Nạp mã nguồn VHDL của ALU.",
        "3. Gán chân trên DE2-115: a_in = SW[3..0], b_in = SW[7..4], op_sel = SW[9..8], alu_out = LEDR[3..0].",
        "4. Mở Tools -> Run Simulation Tool -> RTL Simulation để chạy testbench tự động trên ModelSim."
      ],
      pinAssignments: [
        { signal: "a_in[0]", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "a_in[1]", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1" },
        { signal: "b_in[0]", pin: "PIN_AB27", ioStandard: "2.5 V", note: "SW4" },
        { signal: "op_sel[0]", pin: "PIN_AC25", ioStandard: "2.5 V", note: "SW8" },
        { signal: "alu_out[0]", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to "a_in[0]"\nset_location_assignment PIN_AC28 -to "a_in[1]"\nset_location_assignment PIN_AB27 -to "b_in[0]"\nset_location_assignment PIN_AC25 -to "op_sel[0]"\nset_location_assignment PIN_G19 -to "alu_out[0]"`
    },

    commonErrors: [
      {
        error: "Viết nhầm điều kiện trong assert: nghĩ rằng assert bắt khi lỗi",
        cause: "Cú pháp VHDL quy định assert kiểm tra điều kiện ĐÚNG (`assert (a = b)`). Nếu bạn viết `assert (a /= b)` thì khi bằng nhau nó sẽ báo lỗi ngược!",
        fix: "Luôn nhớ: `assert (điều_kiện_kỳ_vọng_là_đúng)`."
      },
      {
        error: "Quên chờ thời gian lan truyền (wait for) trước khi assert mạch tổ hợp",
        cause: "Mạch cần một khoảng thời gian delta-delay hoặc nano-giây để tính toán ngõ ra, nếu assert ngay lập tức cùng thời điểm gán ngõ vào thì ngõ ra vẫn mang giá trị cũ.",
        fix: "Luôn thêm `wait for 5 ns;` hoặc `wait until rising_edge(clk);` trước câu lệnh assert."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo một thông báo NOTE trong quá trình chạy",
        prompt: "Viết câu lệnh báo cáo tiến độ bằng cú pháp `report ... severity note;` khi hoàn thành mỗi ca kiểm thử.",
        hint: "report \"Da hoan thanh test phep cong\" severity note;",
        solution: "report \"Da hoan thanh ca kiem thu phep cong an toan\" severity note;"
      },
      {
        level: "Vận dụng",
        title: "Đếm tổng số lỗi tự động (Error Counter)",
        prompt: "Viết biến `error_count : integer := 0;` trong testbench. Mỗi khi assert bị sai thì tăng biến đếm và cuối cùng in ra tổng số lỗi.",
        hint: "if tb_res /= expected then error_count := error_count + 1; end if;",
        solution: "Dùng khối if kiểm tra trước: if tb_res /= expected then error_count := error_count + 1; report \"Phat hien loi!\" severity error; end if; Cuối cùng report tổng lỗi."
      },
      {
        level: "Thử thách",
        title: "Đọc dữ liệu test từ file văn bản bên ngoài (File I/O)",
        prompt: "Thay vì viết thủ công hàng trăm ca test trong code, VHDL cho phép đọc dữ liệu từ file text `test_vectors.txt` bằng thư viện nào?",
        hint: "Thư viện `STD.TEXTIO.ALL` và hàm `readline()`, `read()`.",
        solution: "Sử dụng use STD.TEXTIO.ALL; khai báo file test_file : text open read_mode is \"vectors.txt\"; dùng vòng lặp while not endfile(test_file) loop readline(test_file, L); read(L, val); ..."
      }
    ],

    quiz: [
      {
        question: "Câu lệnh `assert` trong VHDL sẽ kích hoạt thông điệp trong `report` khi nào?",
        options: [
          "Khi biểu thức điều kiện trả về kết quả FALSE (sai)",
          "Khi biểu thức điều kiện trả về kết quả TRUE (đúng)",
          "Bất kỳ khi nào có xung clock",
          "Chỉ khi biên dịch bằng Quartus"
        ],
        answerIndex: 0,
        explanation: "Cú pháp VHDL chuẩn: `assert <condition>` sẽ im lặng nếu condition là TRUE, và chỉ in report khi condition bị FALSE."
      },
      {
        question: "Mức độ `severity` nào sau đây sẽ khiến trình mô phỏng ModelSim lập tức ngừng chạy mô phỏng?",
        options: [
          "severity failure",
          "severity note",
          "severity warning",
          "severity error"
        ],
        answerIndex: 0,
        explanation: "Mức `failure` là mức nghiêm trọng cao nhất, báo hiệu sự sụp đổ của quá trình mô phỏng và khiến ModelSim dừng lại ngay lập tức."
      },
      {
        question: "Lợi ích lớn nhất của việc sử dụng Self-Checking Testbench thay vì nhìn giản đồ sóng Waveform là gì?",
        options: [
          "Tự động hóa hoàn toàn việc so sánh kết quả, tránh sai sót của con người và chạy được hàng triệu ca test",
          "Làm cho file mô phỏng nhẹ hơn",
          "Không cần cài đặt ModelSim",
          "Tự động nạp code lên FPGA"
        ],
        answerIndex: 0,
        explanation: "Self-Checking Testbench loại bỏ hoàn toàn yếu tố cảm quan của con người, đảm bảo kiểm thử chính xác và có thể tự động hóa trong quy trình CI/CD."
      },
      {
        question: "Để in thông điệp ra cửa sổ Transcript của ModelSim mà không cần điều kiện kiểm tra, ta dùng câu lệnh nào?",
        options: [
          "report \"Thông điệp\" severity note;",
          "printf(\"Thông điệp\");",
          "echo \"Thông điệp\";",
          "print \"Thông điệp\";"
        ],
        answerIndex: 0,
        explanation: "Trong VHDL, câu lệnh `report \"...\" severity note;` cho phép in trực tiếp chuỗi ký tự ra cửa sổ console của trình mô phỏng."
      }
    ],

    summary: [
      "Self-Checking Testbench là tiêu chuẩn vàng bắt buộc trong xác minh vi mạch số hiện đại.",
      "Câu lệnh `assert` kiểm tra điều kiện ĐÚNG; in báo cáo khi điều kiện bị FALSE.",
      "4 cấp độ severity: NOTE, WARNING, ERROR, FAILURE.",
      "Dùng `assert false ... severity failure;` để kết thúc mô phỏng sạch sẽ và thanh lịch.",
      "Kết hợp thủ tục (procedure) giúp mã testbench ngắn gọn, dễ mở rộng hàng nghìn ca kiểm thử."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW4", "SW8"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return { LEDR0: (inputs.SW0 || inputs.SW4) ? 1 : 0 };
      }
    }
  },

  // ========================================================================
  // BÀI 6.2
  // ========================================================================
  {
    id: "ch6-b2",
    chapterId: "ch6",
    order: 2,
    title: "Tạo xung nhịp Clock, Reset và phát tín hiệu kích thích (Stimulus Generation)",
    subtitle: "Nghệ thuật điều khiển thời gian mô phỏng với wait for, wait until và wait on",
    badge: "Mô phỏng",
    estimatedMinutes: 30,
    hardwareFocus: ["Clock Generation", "Reset Sequencing", "Wait Statements"],

    objectives: [
      "Làm chủ 2 kỹ thuật tạo xung nhịp Clock 50 MHz đối xứng chuẩn xác 20 ns.",
      "Thiết lập kịch bản Reset bất đồng bộ và đồng bộ an toàn trong Testbench.",
      "Phân biệt và sử dụng thành thạo 3 dạng câu lệnh đợi thời gian: `wait for`, `wait until` và `wait on`.",
      "Viết quy trình phát tín hiệu kích thích theo đúng ràng buộc thời gian Setup và Hold time."
    ],

    theory: {
      why: "Trong môi trường mô phỏng phần mềm, thời gian không tự nhiên trôi đi như ngoài đời thực. Trình mô phỏng sự kiện rời rạc (Discrete Event Simulator như ModelSim) chỉ tiến thời gian khi bạn yêu cầu thông qua các câu lệnh `wait`. Tạo một nguồn xung nhịp Clock 50 MHz chuẩn xác và phát tín hiệu ngõ vào đúng thời điểm là bước đầu tiên để mọi mạch tuần tự có thể vận hành.",
      how: "1. **Tạo xung nhịp Clock 50 MHz (Chu kỳ T = 20 ns):**\n- Cách 1 (Ngắn gọn): `clk <= not clk after 10 ns;` (Khởi tạo `clk : std_logic := '0'`).\n- Cách 2 (Khối process chuyên dụng):\n```vhdl\nclk_process: process\nbegin\n    clk <= '0'; wait for 10 ns;\n    clk <= '1'; wait for 10 ns;\nend process;\n```\n\n2. **Kịch bản Reset chuẩn mực:**\n- Ban đầu kích hoạt Reset: `rst_n <= '0'; wait for 40 ns;` (Giữ ít nhất 2 chu kỳ clock).\n- Nhả Reset tại thời điểm giữa chu kỳ (không trùng cạnh clock): `rst_n <= '1'; wait for 10 ns;` để tránh xung đột sườn kích hoạt.\n\n3. **Các câu lệnh `wait`:**\n- `wait for <time>`: Tạm dừng trong một khoảng thời gian cố định (ví dụ: `wait for 100 ns;`).\n- `wait until <boolean_condition>`: Tạm dừng cho đến khi điều kiện trở thành TRUE (ví dụ: `wait until rising_edge(clk);` - cực kỳ hữu ích để đồng bộ từng nhịp clock!).\n- `wait on <signals>`: Tạm dừng cho đến khi có bất kỳ tín hiệu nào trong danh sách bị thay đổi trạng thái (tương đương sensitivity list).",
      sections: [
        {
          heading: "1. Tránh vi phạm thời gian Setup/Hold trong Testbench",
          content: "Khi phát tín hiệu dữ liệu vào một mạch tuần tự, nếu bạn đổi dữ liệu đúng ngay lúc `clk` nhảy từ 0 lên 1, trình mô phỏng có thể đọc nhầm giá trị cũ hoặc mới tùy thuộc vào thứ tự sự kiện delta. Kỹ thuật an toàn của chuyên gia:\n```vhdl\nwait until rising_edge(clk);\nwait for 2 ns; -- Độ trễ nhỏ mô phỏng đường dây thực tế (Tco trễ)\ndata_in <= x\"A5\";\n```",
          callout: {
            type: "tip",
            title: "Quy tắc vàng: Đổi dữ liệu sau cạnh clock 1 khoảng trễ nhỏ",
            text: "Thêm `wait for 1 ns` đến `2 ns` sau mỗi cạnh `rising_edge(clk)` giúp dữ liệu ngõ vào hoàn toàn ổn định trước khi cạnh clock tiếp theo xuất hiện, mô phỏng chính xác hành vi phần cứng vật lý trên kit DE2-115."
          }
        }
      ],
      truthTable: {
        headers: ["Lệnh điều khiển thời gian", "Cú pháp ví dụ", "Ứng dụng chuyên dụng"],
        rows: [
          ["wait for", "wait for 20 ns;", "Giữ mức tĩnh, tạo độ trễ delay, giãn cách thời gian"],
          ["wait until", "wait until rising_edge(clk);", "Đồng bộ hóa tín hiệu kích thích theo nhịp Clock"],
          ["wait on", "wait on ready_flag;", "Chờ mạch phần cứng xử lý xong và bật cờ phản hồi"],
          ["wait; (vô tận)", "wait;", "Dừng process kích thích ở cuối testbench"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Dạng sóng Clock 50MHz, Reset và Stimulus -->
      <g transform="translate(30, 20)">
        <text x="50" y="25" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">CLOCK (50 MHz, T=20ns)</text>
        <path d="M 60,70 L 90,70 L 90,40 L 120,40 L 120,70 L 150,70 L 150,40 L 180,40 L 180,70 L 210,70 L 210,40 L 240,40 L 240,70 L 270,70 L 270,40 L 300,40 L 300,70" fill="none" stroke="#f59e0b" stroke-width="2"/>
        <text x="105" y="32" text-anchor="middle" fill="#94a3b8" font-size="8">10ns</text>
        <text x="135" y="82" text-anchor="middle" fill="#94a3b8" font-size="8">10ns</text>

        <text x="50" y="105" fill="#ef4444" font-family="monospace" font-size="11" font-weight="bold">RESET_N (Active-Low)</text>
        <path d="M 60,140 L 135,140 L 135,115 L 300,115" fill="none" stroke="#ef4444" stroke-width="2"/>
        <text x="100" y="155" fill="#ef4444" font-size="9">Reset kéo dài 35ns</text>
        <text x="180" y="110" fill="#10b981" font-size="9">Nhả Reset an toàn</text>

        <text x="350" y="25" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">STIMULUS (Đổi sau cạnh clock 2ns)</text>
        <line x1="210" y1="40" x2="210" y2="180" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2"/>
        <text x="210" y="195" text-anchor="middle" fill="#f59e0b" font-size="8">Cạnh lên clk</text>
        <path d="M 60,180 L 214,180 L 214,160 L 300,160" fill="none" stroke="#38bdf8" stroke-width="2"/>
        <text x="235" y="172" fill="#38bdf8" font-size="8">+2ns</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "sync_shift_accum",
      circuitType: "sequential",
      typeExplanation: "Mạch tuần tự đồng bộ có chân nạp dữ liệu và tích lũy: Cần kích thích đồng bộ chính xác theo từng nhịp clock.",
      code: `--------------------------------------------------------------------------------
-- Tên file: sync_shift_accum.vhd
-- Mạch tích lũy đồng bộ minh họa kỹ thuật cấp xung kích thích
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity sync_shift_accum is
    port (
        clk      : in  std_logic;
        rst_n    : in  std_logic;
        valid_in : in  std_logic;
        data_in  : in  std_logic_vector(7 downto 0);
        total_out: out std_logic_vector(15 downto 0)
    );
end entity sync_shift_accum;

architecture rtl of sync_shift_accum is
    signal accum_reg : unsigned(15 downto 0) := (others => '0');
begin
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            accum_reg <= (others => '0');
        elsif rising_edge(clk) then
            if valid_in = '1' then
                accum_reg <= accum_reg + unsigned(data_in);
            end if;
        end if;
    end process;

    total_out <= std_logic_vector(accum_reg);
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_sync_stimulus",
      code: `--------------------------------------------------------------------------------
-- Testbench minh họa tạo Clock, Reset và phát Stimulus chuyên nghiệp
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity tb_sync_stimulus is
end entity tb_sync_stimulus;

architecture sim of tb_sync_stimulus is
    -- Hằng số chu kỳ Clock 50 MHz
    constant CLK_PERIOD : time := 20 ns;

    signal clk       : std_logic := '0';
    signal rst_n     : std_logic := '0';
    signal valid_in  : std_logic := '0';
    signal data_in   : std_logic_vector(7 downto 0) := (others => '0');
    signal total_out : std_logic_vector(15 downto 0);
begin
    uut: entity work.sync_shift_accum
        port map (
            clk       => clk,
            rst_n     => rst_n,
            valid_in  => valid_in,
            data_in   => data_in,
            total_out => total_out
        );

    -- 1. BỘ TẠO XUNG CLOCK 50 MHz ĐỐI XỨNG
    clk_gen: process
    begin
        clk <= '0';
        wait for CLK_PERIOD / 2; -- 10 ns
        clk <= '1';
        wait for CLK_PERIOD / 2; -- 10 ns
    end process clk_gen;

    -- 2. TIẾN TRÌNH KÍCH THÍCH DỮ LIỆU
    stim_proc: process
        -- Thủ tục nạp 1 byte đồng bộ theo cạnh clock
        procedure push_data(val : in integer) is
        begin
            wait until rising_edge(clk);
            wait for 2 ns; -- Lùi 2ns sau cạnh clock để tránh xung đột Setup/Hold
            valid_in <= '1';
            data_in  <= std_logic_vector(to_unsigned(val, 8));

            wait until rising_edge(clk);
            wait for 2 ns;
            valid_in <= '0';
            data_in  <= (others => '0');
        end procedure;
    begin
        -- Kịch bản Reset
        rst_n <= '0';
        wait for 35 ns; -- Kéo dài qua cạnh clock đầu tiên
        rst_n <= '1';
        wait for 20 ns;

        -- Bơm các gói dữ liệu kiểm tra
        push_data(10);
        wait for CLK_PERIOD * 2;
        push_data(25);
        wait for CLK_PERIOD * 2;
        push_data(15);
        wait for CLK_PERIOD * 3;

        -- Kiểm tra tổng tích lũy: 10 + 25 + 15 = 50 (0x0032)
        assert total_out = std_logic_vector(to_unsigned(50, 16))
            report "LỖI TÍNH TỔNG! Kỳ vọng 50 nhưng nhận được " & integer'image(to_integer(unsigned(total_out)))
            severity error;

        report ">>> KIỂM TRA TÍCH LŨY HOÀN TẤT THÀNH CÔNG! <<<" severity note;
        wait;
    end process stim_proc;

end architecture sim;`,
      instructions: "Trong ModelSim: Quan sát chuỗi nạp dữ liệu. Chú ý tín hiệu `valid_in` chỉ bật lên đúng 1 chu kỳ clock và `total_out` tăng dần từ 0 -> 10 -> 35 -> 50."
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án sync_shift_accum trong Quartus.",
        "2. Nạp mã nguồn VHDL.",
        "3. Gán chân: clk = PIN_Y2, rst_n = PIN_M23, valid_in = PIN_M21, data_in = SW[7..0], total_out = LEDR[15..0].",
        "4. Biên dịch và mô phỏng trên ModelSim."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "valid_in", pin: "PIN_M21", ioStandard: "2.5 V", note: "KEY1" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_M21 -to valid_in`
    },

    commonErrors: [
      {
        error: "Quên khởi tạo giá trị ban đầu cho tín hiệu Clock trong Testbench: signal clk : std_logic;",
        cause: "Nếu không khởi tạo `signal clk : std_logic := '0';`, clk ban đầu sẽ là 'U' (Uninitialized). Phép đảo `not 'U'` vẫn ra 'U', dẫn đến xung clock bị tê liệt hoàn toàn!",
        fix: "Luôn khởi tạo giá trị ban đầu: `signal clk : std_logic := '0';`."
      },
      {
        error: "Nhả Reset trùng khít đúng vào cạnh lên xung Clock",
        cause: "Gây ra hiện tượng Meta-stability trong phần cứng và làm trình mô phỏng xử lý sai thứ tự sự kiện.",
        fix: "Nhả Reset lệch pha với cạnh clock (ví dụ sau 35 ns hoặc 45 ns thay vì 40 ns chẵn)."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo xung Clock 100 MHz",
        prompt: "Thay đổi hằng số chu kỳ để tạo nguồn xung Clock tần số 100 MHz (chu kỳ 10 ns, mỗi nửa chu kỳ 5 ns).",
        hint: "constant CLK_PERIOD : time := 10 ns;",
        solution: "constant CLK_PERIOD : time := 10 ns; wait for CLK_PERIOD / 2; -- 5 ns"
      },
      {
        level: "Vận dụng",
        title: "Tạo xung nhịp có Duty Cycle không đối xứng (30% High, 70% Low)",
        prompt: "Viết process tạo xung clock chu kỳ 20 ns nhưng thời gian mức 1 chỉ chiếm 6 ns (30%), mức 0 chiếm 14 ns (70%).",
        hint: "clk <= '1'; wait for 6 ns; clk <= '0'; wait for 14 ns;",
        solution: "clk_proc: process begin clk <= '1'; wait for 6 ns; clk <= '0'; wait for 14 ns; end process;"
      },
      {
        level: "Thử thách",
        title: "Tạo xung Timeout tự động ngắt nếu mạch bị treo",
        prompt: "Viết thêm một tiến trình giám sát (Watchdog Process): Nếu sau 1000 us mà mạch chưa xử lý xong thì in lỗi và dừng mô phỏng.",
        hint: "watchdog: process begin wait for 1000 us; assert false report \"TIMEOUT: Mach bi treo!\" severity failure; end process;",
        solution: "watchdog_proc: process begin wait for 1000 us; assert false report \"TIMEOUT: Mach bi treo qua lau!\" severity failure; end process;"
      }
    ],

    quiz: [
      {
        question: "Để tạo nguồn dao động clock 50 MHz (chu kỳ 20 ns) đối xứng, thời gian chờ mỗi nửa chu kỳ là bao nhiêu?",
        options: [
          "10 ns",
          "20 ns",
          "5 ns",
          "50 ns"
        ],
        answerIndex: 0,
        explanation: "Chu kỳ T = 20 ns, chu kỳ đối xứng 50% duty cycle cần nửa chu kỳ mức 0 dài 10 ns và nửa chu kỳ mức 1 dài 10 ns."
      },
      {
        question: "Tại sao trong Testbench bắt buộc phải khởi tạo giá trị ban đầu cho tín hiệu Clock: `signal clk : std_logic := '0';`?",
        options: [
          "Vì nếu không khởi tạo, clk sẽ mang giá trị 'U' và phép toán `not 'U'` vẫn trả về 'U', làm xung clock không thể dao động",
          "Vì luật VHDL cấm để trống",
          "Vì Quartus không biên dịch được",
          "Để tiết kiệm bộ nhớ RAM"
        ],
        answerIndex: 0,
        explanation: "Kiểu `std_logic` mặc định khởi tạo là 'U'. Phép phủ định `not 'U'` bằng 'U', do đó nếu không gán ban đầu là '0' hoặc '1' thì xung clock sẽ chết đứng ở trạng thái 'U'."
      },
      {
        question: "Câu lệnh `wait until rising_edge(clk);` trong Testbench có chức năng gì?",
        options: [
          "Tạm dừng tiến trình cho đến khi xuất hiện cạnh lên của xung nhịp clk",
          "Tạo ra xung nhịp clk mới",
          "Xóa tín hiệu clk về 0",
          "Đổi tần số clock"
        ],
        answerIndex: 0,
        explanation: "`wait until rising_edge(clk);` đồng bộ hóa tiến trình theo nhịp clock, tạm dừng cho đến khi clk chuyển từ '0' lên '1'."
      },
      {
        question: "Tại sao sau câu lệnh `wait until rising_edge(clk);`, ta nên thêm một khoảng trễ nhỏ như `wait for 2 ns;` trước khi gán dữ liệu ngõ vào?",
        options: [
          "Để tránh vi phạm thời gian Setup/Hold và loại bỏ tranh chấp thứ tự sự kiện delta trong trình mô phỏng",
          "Để làm chậm máy tính",
          "Bắt buộc theo chuẩn USB",
          "Để làm đẹp giản đồ sóng"
        ],
        answerIndex: 0,
        explanation: "Thêm khoảng trễ nhỏ 1-2 ns mô phỏng chính xác độ trễ lan truyền thực tế và đảm bảo dữ liệu ổn định tuyệt đối trước cạnh clock tiếp theo."
      }
    ],

    summary: [
      "Khởi tạo `signal clk : std_logic := '0';` là điều kiện tiên quyết để xung clock dao động.",
      "Xung clock 50 MHz chuẩn có chu kỳ 20 ns (10 ns mức 0, 10 ns mức 1).",
      "Kéo dài Reset ít nhất 2 chu kỳ clock và nhả Reset lệch pha với cạnh lên clock.",
      "`wait until rising_edge(clk);` là công cụ mạnh mẽ nhất để đồng bộ hóa kích thích dữ liệu.",
      "Thêm khoảng trễ nhỏ 2 ns sau cạnh clock để đảm bảo an toàn Setup và Hold time."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["KEY0", "KEY1"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return { LEDR0: inputs.KEY0 === 0 ? 0 : 1 };
      }
    }
  },

  // ========================================================================
  // BÀI 6.3
  // ========================================================================
  {
    id: "ch6-b3",
    chapterId: "ch6",
    order: 3,
    title: "Liên kết Quartus Prime với ModelSim qua tính năng NativeLink",
    subtitle: "Quy trình tích hợp 1-Click: Từ thiết kế sơ đồ sang mô phỏng RTL tự động",
    badge: "Công cụ",
    estimatedMinutes: 25,
    hardwareFocus: ["Quartus Prime 20.1", "ModelSim-Intel FPGA Edition", "NativeLink Setup"],

    objectives: [
      "Hiểu nguyên lý hoạt động của cầu nối NativeLink giữa Quartus Prime Lite 20.1 và ModelSim.",
      "Thiết lập chính xác đường dẫn phần mềm ModelSim trong mục EDA Tool Options.",
      "Cấu hình Testbench tự động nạp trong Assignments -> Settings -> EDA Tool Settings.",
      "Khởi chạy mô phỏng RTL chỉ bằng 1 cú nhấp chuột (Tools -> Run Simulation Tool -> RTL Simulation)."
    ],

    theory: {
      why: "Trong quy trình phát triển vi mạch, bạn phải liên tục chỉnh sửa mã VHDL và kiểm tra lại trên ModelSim hàng chục lần mỗi ngày. Nếu mỗi lần sửa code bạn lại phải mở ModelSim thủ công, tạo thư viện work, gõ lệnh `vcom` biên dịch từng file... thì sẽ vô cùng tốn thời gian. Tính năng NativeLink của Quartus Prime tự động đóng gói toàn bộ dự án, biên dịch mã nguồn và testbench, rồi tự động bật ModelSim lên hiển thị sóng chỉ với 1 cú nhấp chuột.",
      how: "Quy trình thiết lập NativeLink chuẩn 4 bước trong Quartus Prime Lite 20.1:\n\n1. **Bước 1: Khai báo đường dẫn ModelSim (Chỉ làm 1 lần duy nhất):**\n- Vào menu `Tools -> Options -> EDA Tool Options`.\n- Tại dòng `ModelSim-Altera`, điền đường dẫn thư mục cài đặt chứa file chạy của ModelSim. Ví dụ trên Windows:\n  `C:\\intelFPGA_lite\\20.1\\modelsim_ase\\win32aloem`\n- Bấm OK.\n\n2. **Bước 2: Cấu hình công cụ mô phỏng cho dự án:**\n- Vào menu `Assignments -> Settings -> EDA Tool Settings -> Simulation`.\n- Mục `Tool name`: Chọn `ModelSim-Altera`.\n- Mục `Format`: Chọn `VHDL`.\n\n3. **Bước 3: Chỉ định file Testbench:**\n- Vẫn trong mục Simulation, phần `NativeLink settings`, tích chọn `Compile test bench`.\n- Bấm nút `Test Benches...` -> Bấm `New...`.\n- Điền tên testbench (ví dụ: `tb_my_design`) và tên module (`tb_my_design`).\n- Tại mục `File name`, duyệt chọn file testbench `.vhd` của bạn -> Bấm `Add` -> Bấm OK.\n\n4. **Bước 4: Chạy mô phỏng RTL 1-Click:**\n- Vào menu `Tools -> Run Simulation Tool -> RTL Simulation`.\n- Quartus sẽ tự động biên dịch và mở ModelSim lên chạy ngay lập tức!",
      sections: [
        {
          heading: "1. Phân biệt RTL Simulation vs Gate-Level Simulation",
          content: "- **RTL Simulation (Mô phỏng chức năng):** Mô phỏng trực tiếp mã nguồn VHDL trước khi tổng hợp thành cổng logic. Tốc độ cực nhanh, dùng để kiểm tra giải thuật và logic FSM.\n- **Gate-Level Simulation (Mô phỏng sau gán chân & định thời):** Mô phỏng sơ đồ mạch sau khi đã đặt lên các tế bào silicon của chip Cyclone IV và có tính đến độ trễ dây dẫn thực tế (.sdo). Dùng để kiểm tra vi phạm thời gian Setup/Hold.",
          callout: {
            type: "warning",
            title: "Lỗi phổ biến: Can't launch ModelSim",
            text: "Nếu Quartus báo lỗi 'Can't launch the ModelSim-Altera software', 99% nguyên nhân là do bạn chưa cài đặt đúng đường dẫn trong `Tools -> Options -> EDA Tool Options -> ModelSim-Altera`!"
          }
        }
      ],
      truthTable: {
        headers: ["Mục cấu hình trong Quartus", "Đường dẫn / Giá trị chuẩn", "Tác dụng"],
        rows: [
          ["EDA Tool Options: ModelSim-Altera", "C:\\intelFPGA_lite\\20.1\\modelsim_ase\\win32aloem", "Chỉ đường dẫn đến file thực thi modelsim.exe"],
          ["EDA Simulation: Tool Name", "ModelSim-Altera", "Bật chế độ xuất kịch bản mô phỏng tương thích"],
          ["EDA Simulation: Format", "VHDL", "Xuất netlist và thư viện theo chuẩn VHDL"],
          ["NativeLink: Compile test bench", "Tên file tb_*.vhd", "Tự động nạp và khởi chạy testbench khi mở ModelSim"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ luồng NativeLink 1-Click -->
      <g transform="translate(30, 20)">
        <rect x="30" y="30" width="160" height="120" rx="8" fill="#131e33" stroke="#38bdf8" stroke-width="2"/>
        <text x="110" y="60" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">QUARTUS PRIME 20.1</text>
        <text x="110" y="85" text-anchor="middle" fill="#f8fafc" font-size="10">Code VHDL & Testbench</text>
        <rect x="50" y="105" width="120" height="30" rx="4" fill="#0284c7"/>
        <text x="110" y="125" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">RTL Simulation</text>

        <!-- Cầu nối NativeLink -->
        <path d="M 190,90 L 370,90" stroke="#f59e0b" stroke-width="3" stroke-dasharray="5,5" marker-end="url(#arrow)"/>
        <text x="280" y="80" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold">NativeLink Bridge</text>
        <text x="280" y="110" text-anchor="middle" fill="#94a3b8" font-size="8">Tự động sinh script & nạp wave</text>

        <rect x="380" y="30" width="180" height="120" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
        <text x="470" y="60" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">MODELSIM-INTEL</text>
        <text x="470" y="85" text-anchor="middle" fill="#f8fafc" font-size="10">Tự động mở cửa sổ</text>
        <text x="470" y="105" text-anchor="middle" fill="#10b981" font-size="10">Biên dịch thư viện work</text>
        <text x="470" y="125" text-anchor="middle" fill="#38bdf8" font-size="10">Hiển thị Waveform sóng</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "nativelink_counter",
      circuitType: "sequential",
      typeExplanation: "Mạch đếm nhị phân 8-bit mẫu: Dùng để thực hành thiết lập liên kết 1-click NativeLink giữa Quartus và ModelSim.",
      code: `--------------------------------------------------------------------------------
-- Tên file: nativelink_counter.vhd
-- Mạch đếm nhị phân 8-bit phục vụ thực hành NativeLink
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity nativelink_counter is
    port (
        clk      : in  std_logic;
        rst_n    : in  std_logic;
        count_out: out std_logic_vector(7 downto 0)
    );
end entity nativelink_counter;

architecture rtl of nativelink_counter is
    signal cnt : unsigned(7 downto 0) := (others => '0');
begin
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            cnt <= (others => '0');
        elsif rising_edge(clk) then
            cnt <= cnt + 1;
        end if;
    end process;

    count_out <= std_logic_vector(cnt);
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_nativelink_counter",
      code: `--------------------------------------------------------------------------------
-- Testbench khai báo trong mục NativeLink Settings của Quartus
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_nativelink_counter is
end entity tb_nativelink_counter;

architecture sim of tb_nativelink_counter is
    signal clk   : std_logic := '0';
    signal rst_n : std_logic := '0';
    signal count : std_logic_vector(7 downto 0);
begin
    uut: entity work.nativelink_counter
        port map ( clk => clk, rst_n => rst_n, count_out => count );

    clk <= not clk after 10 ns;

    stim: process
    begin
        rst_n <= '0'; wait for 30 ns;
        rst_n <= '1';
        wait for 500 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Sau khi cài đặt NativeLink trong Quartus: Chọn Tools -> Run Simulation Tool -> RTL Simulation. ModelSim sẽ tự động bật lên và vẽ dạng sóng đếm nhị phân."
    },

    quartusGuide: {
      steps: [
        "1. Mở Quartus Prime 20.1 -> Tools -> Options -> EDA Tool Options -> Điền đường dẫn ModelSim-Altera: C:\\intelFPGA_lite\\20.1\\modelsim_ase\\win32aloem.",
        "2. Assignments -> Settings -> EDA Tool Settings -> Simulation -> Chọn ModelSim-Altera (VHDL).",
        "3. Tích chọn Compile test bench -> Test Benches... -> New... -> Điền tên tb_nativelink_counter và nạp file tb_nativelink_counter.vhd.",
        "4. Bấm Tools -> Run Simulation Tool -> RTL Simulation. Thưởng thức trải nghiệm 1-click mở ModelSim!"
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" }
      ],
      qsfSnippet: `set_global_assignment -name EDA_SIMULATION_TOOL "ModelSim-Altera (VHDL)"\nset_global_assignment -name EDA_OUTPUT_DATA_FORMAT VHDL -section_id eda_simulation\nset_global_assignment -name EDA_TIME_SCALE "1 ps" -section_id eda_simulation`
    },

    commonErrors: [
      {
        error: "Thông báo lỗi: Can't launch the ModelSim-Altera software",
        cause: "Đường dẫn thư mục ModelSim trong Tools -> Options -> EDA Tool Options bị sai hoặc trỏ nhầm vào thư mục gốc thay vì thư mục win32aloem chứa modelsim.exe.",
        fix: "Kiểm tra lại đường dẫn: phải trỏ đúng vào thư mục `C:\\intelFPGA_lite\\20.1\\modelsim_ase\\win32aloem`."
      },
      {
        error: "ModelSim mở lên nhưng không tìm thấy file Testbench để chạy",
        cause: "Chưa khai báo tên Testbench trong Assignments -> Settings -> EDA Tool Settings -> NativeLink settings.",
        fix: "Bấm nút Test Benches... và khai báo đúng tên file testbench `.vhd`."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Kiểm tra phiên bản ModelSim",
        prompt: "Làm thế nào để biết máy tính của bạn đã cài đặt phiên bản ModelSim-Intel FPGA Edition hay ModelSim-Altera Starter Edition?",
        hint: "Mở menu Help -> About trong ModelSim hoặc xem tên thư mục trong C:\\intelFPGA_lite\\20.1\\",
        solution: "Mở ModelSim chọn Help -> About ModelSim, kiểm tra phiên bản 20.1 hoặc kiểm tra thư mục modelsim_ase trong ổ C."
      },
      {
        level: "Vận dụng",
        title: "Tự động tắt ModelSim sau khi mô phỏng xong",
        prompt: "Trong kịch bản tự động, câu lệnh TCL nào yêu cầu ModelSim đóng cửa sổ sau khi hoàn thành?",
        hint: "Lệnh `quit -f` hoặc `exit`.",
        solution: "Thêm lệnh quit -f vào cuối kịch bản mô phỏng để tự động thoát."
      },
      {
        level: "Thử thách",
        title: "Chạy Gate-Level Simulation trong NativeLink",
        prompt: "Sự khác biệt khi bấm 'Gate Level Simulation' thay vì 'RTL Simulation' trong menu của Quartus là gì?",
        hint: "Quartus phải hoàn thành khâu Fitter (Place & Route) và xuất file trễ .vho + .sdo.",
        solution: "Gate-Level Simulation mô phỏng mạch sau khi đã đặt lên các tế bào silicon của chip Cyclone IV, có tính đến thời gian trễ thực tế của đường dây nano-giây."
      }
    ],

    quiz: [
      {
        question: "Đường dẫn cài đặt mặc định của ModelSim-Altera trên Windows cho bản Quartus Prime Lite 20.1 là gì?",
        options: [
          "C:\\intelFPGA_lite\\20.1\\modelsim_ase\\win32aloem",
          "C:\\Program Files\\ModelSim\\bin",
          "C:\\Quartus\\modelsim",
          "C:\\Windows\\System32"
        ],
        answerIndex: 0,
        explanation: "Thư mục chứa file chạy `modelsim.exe` cho bản Intel Lite 20.1 là `C:\\intelFPGA_lite\\20.1\\modelsim_ase\\win32aloem`."
      },
      {
        question: "Tính năng NativeLink trong Quartus Prime có tác dụng chính là gì?",
        options: [
          "Tự động liên kết, biên dịch dự án và khởi chạy ModelSim chỉ bằng 1 cú nhấp chuột",
          "Tự động vẽ mạch in PCB",
          "Tự động viết code VHDL thay cho người dùng",
          "Kết nối kit FPGA qua mạng Internet"
        ],
        answerIndex: 0,
        explanation: "NativeLink đóng gói quy trình biên dịch và khởi chạy ModelSim tự động từ giao diện Quartus Prime mà không cần thao tác dòng lệnh thủ công."
      },
      {
        question: "Để chỉ định file Testbench tự động nạp trong NativeLink, ta cấu hình ở đâu trong Quartus?",
        options: [
          "Assignments -> Settings -> EDA Tool Settings -> Simulation -> Compile test bench",
          "File -> Open",
          "Tools -> Options -> General",
          "Project -> Add/Remove Files"
        ],
        answerIndex: 0,
        explanation: "Cấu hình testbench cho NativeLink nằm trong hộp thoại `Assignments -> Settings -> EDA Tool Settings -> Simulation`."
      },
      {
        question: "RTL Simulation khác với Gate-Level Simulation ở điểm mấu chốt nào?",
        options: [
          "RTL Simulation mô phỏng chức năng logic trực tiếp từ code VHDL trước khi tổng hợp, tốc độ chạy nhanh hơn rất nhiều",
          "RTL Simulation chỉ chạy được trên Linux",
          "RTL Simulation có tính đến độ trễ dây dẫn thực tế",
          "RTL Simulation không xem được sóng"
        ],
        answerIndex: 0,
        explanation: "RTL Simulation kiểm tra hành vi logic thuần túy trước khi tổng hợp, do đó chạy cực nhanh và là công cụ kiểm thử hàng ngày của kỹ sư."
      }
    ],

    summary: [
      "NativeLink là cầu nối 1-click tiện lợi giữa Quartus Prime và ModelSim.",
      "Khai báo đường dẫn ModelSim trong Tools -> Options -> EDA Tool Options một lần duy nhất.",
      "Cấu hình Testbench trong Assignments -> Settings -> EDA Tool Settings -> Simulation.",
      "Khởi chạy nhanh chóng qua menu Tools -> Run Simulation Tool -> RTL Simulation.",
      "RTL Simulation là phương pháp kiểm thử chức năng nhanh nhất trước khi nạp mạch lên FPGA."
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
  // BÀI 6.4
  // ========================================================================
  {
    id: "ch6-b4",
    chapterId: "ch6",
    order: 4,
    title: "Tự động hóa mô phỏng với file kịch bản ModelSim TCL / DO script (.do)",
    subtitle: "Phong cách làm việc của kỹ sư vi mạch chuyên nghiệp: Tạm biệt chuột, làm chủ dòng lệnh CLI",
    badge: "Tự động hóa",
    estimatedMinutes: 35,
    hardwareFocus: ["TCL Scripting", "ModelSim DO Script", "Command Line Interface"],

    objectives: [
      "Hiểu rõ tại sao các tập đoàn vi mạch hàng đầu thế giới (NVIDIA, Apple, Intel) luôn chạy mô phỏng bằng kịch bản dòng lệnh.",
      "Nắm vững các câu lệnh cốt lõi của ModelSim: `vlib`, `vmap`, `vcom`, `vsim`, `add wave`, `run`.",
      "Viết file kịch bản `run_sim.do` hoàn chỉnh để biên dịch và chạy mô phỏng chỉ trong 3 giây.",
      "Thực thi file kịch bản trong ModelSim bằng lệnh `do run_sim.do` hoặc chạy ngầm (Batch Mode) không cần mở giao diện đồ họa."
    ],

    theory: {
      why: "Trong các dự án vi mạch chuyên nghiệp, một chip (SoC) có thể bao gồm hàng trăm file mã nguồn VHDL và hàng nghìn ca kiểm thử (Regression Tests). Không một kỹ sư nào ngồi bấm chuột từng bước trên giao diện đồ họa. Họ viết một file kịch bản lệnh `.do` (viết bằng ngôn ngữ TCL - Tool Command Language). Chỉ cần gõ `do run_sim.do`, máy tính sẽ tự động biên dịch, khởi tạo mô phỏng, định dạng sóng và xuất báo cáo trong chớp mắt.",
      how: "Cấu trúc kinh điển của một file kịch bản `run_sim.do`:\n\n1. **Khởi tạo thư viện làm việc:**\n- `vlib work`: Tạo thư mục thư viện logic tên là `work` (nếu chưa có).\n- `vmap work work`: Ánh xạ thư viện logic `work` vào thư mục vật lý.\n\n2. **Biên dịch mã nguồn VHDL (`vcom`):**\n- `vcom -2008 -work work design.vhd`: Biên dịch file thiết kế với chuẩn VHDL-2008.\n- `vcom -2008 -work work tb_design.vhd`: Biên dịch file testbench.\n\n3. **Khởi chạy môi trường mô phỏng (`vsim`):**\n- `vsim -t 1ps -voptargs=\"+acc\" work.tb_design`\n  - `-t 1ps`: Độ phân giải thời gian mô phỏng (Time resolution).\n  - `-voptargs=\"+acc\"`: Cho phép ModelSim truy cập toàn bộ các tín hiệu nội bộ để xem sóng mà không bị bộ tối ưu hóa giấu đi.\n\n4. **Thêm tín hiệu vào cửa sổ Waveform (`add wave`):**\n- `add wave -divider \"CLK & RST\"`: Tạo vạch ngăn phân cách trên cửa sổ sóng.\n- `add wave -radix hex /tb_design/uut/*`: Thêm toàn bộ tín hiệu của khối UUT, hiển thị dạng Hex.\n\n5. **Chạy mô phỏng:**\n- `run 1000 ns` (hoặc `run -all` nếu testbench có lệnh dừng `severity failure`).",
      sections: [
        {
          heading: "1. Chạy ModelSim ở chế độ dòng lệnh thuần túy (Batch Mode)",
          content: "Để chạy kiểm thử tự động trên máy chủ CI/CD không có màn hình hiển thị, bạn có thể gọi ModelSim từ PowerShell/Terminal Windows:\n```bash\nvsim -c -do \"do run_sim.do; quit -f\"\n```\nTham số `-c` nghĩa là Command Line (không bật giao diện đồ họa GUI), giúp tiết kiệm tài nguyên và tăng tốc độ mô phỏng lên gấp 10 lần!",
          callout: {
            type: "tip",
            title: "Tạo phím tắt thực thi",
            text: "Trong cửa sổ dòng lệnh Transcript của ModelSim, bạn chỉ cần gõ `do run_sim.do` rồi nhấn Enter. Khi sửa code xong, chỉ cần bấm phím mũi tên Lên (Up Arrow) và Enter là toàn bộ dự án được biên dịch lại tức thì!"
          }
        }
      ],
      truthTable: {
        headers: ["Lệnh ModelSim TCL", "Cú pháp mẫu", "Ý nghĩa chức năng"],
        rows: [
          ["vlib", "vlib work", "Tạo thư viện thiết kế (Design Library)"],
          ["vcom", "vcom -2008 -work work file.vhd", "Biên dịch mã nguồn VHDL vào thư viện work"],
          ["vsim", "vsim -voptargs=\"+acc\" work.tb_top", "Khởi động phiên mô phỏng với đầy đủ quyền quan sát"],
          ["add wave", "add wave -radix hex /tb_top/*", "Thêm các đường sóng vào cửa sổ hiển thị Waveform"],
          ["run", "run 500 ns hoặc run -all", "Tiến thời gian mô phỏng theo yêu cầu"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Quy trình thực thi kịch bản DO script -->
      <g transform="translate(30, 25)">
        <rect x="20" y="30" width="100" height="70" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="70" y="60" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">1. vlib work</text>
        <text x="70" y="80" text-anchor="middle" fill="#94a3b8" font-size="9">Tạo thư viện</text>

        <line x1="120" y1="65" x2="160" y2="65" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

        <rect x="160" y="30" width="110" height="70" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="215" y="60" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">2. vcom *.vhd</text>
        <text x="215" y="80" text-anchor="middle" fill="#94a3b8" font-size="9">Biên dịch VHDL</text>

        <line x1="270" y1="65" x2="310" y2="65" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

        <rect x="310" y="30" width="110" height="70" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="365" y="60" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">3. vsim tb_*</text>
        <text x="365" y="80" text-anchor="middle" fill="#94a3b8" font-size="9">Khởi động mô phỏng</text>

        <line x1="420" y1="65" x2="460" y2="65" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>

        <rect x="460" y="30" width="120" height="70" rx="6" fill="#0c2847" stroke="#10b981" stroke-width="1.5"/>
        <text x="520" y="60" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">4. add wave & run</text>
        <text x="520" y="80" text-anchor="middle" fill="#a7f3d0" font-size="9">Vẽ sóng & chạy</text>

        <text x="300" y="145" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">Lệnh thực thi duy nhất: do run_sim.do</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "script_demo_module",
      circuitType: "combinational",
      typeExplanation: "Mạch mẫu minh họa quy trình viết và chạy kịch bản ModelSim DO Script tự động hóa.",
      code: `--------------------------------------------------------------------------------
-- Tên file: script_demo_module.vhd
-- Mạch logic đơn giản phục vụ thực hành script ModelSim TCL
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity script_demo_module is
    port (
        in_a  : in  std_logic;
        in_b  : in  std_logic;
        out_y : out std_logic
    );
end entity script_demo_module;

architecture rtl of script_demo_module is
begin
    out_y <= in_a xor in_b; -- Cổng XOR
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_script_demo",
      code: `--------------------------------------------------------------------------------
-- File kịch bản run_sim.do (Lưu dưới dạng file text .do cùng thư mục):
--
-- # 1. Tạo thư viện
-- vlib work
-- vmap work work
--
-- # 2. Biên dịch mã nguồn
-- vcom -2008 -work work script_demo_module.vhd
-- vcom -2008 -work work tb_script_demo.vhd
--
-- # 3. Khởi động mô phỏng
-- vsim -voptargs="+acc" work.tb_script_demo
--
-- # 4. Thêm đường sóng
-- add wave -radix binary /tb_script_demo/*
--
-- # 5. Chạy mô phỏng
-- run 100 ns
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_script_demo is
end entity tb_script_demo;

architecture sim of tb_script_demo is
    signal a, b, y : std_logic;
begin
    uut: entity work.script_demo_module
        port map ( in_a => a, in_b => b, out_y => y );

    stim: process
    begin
        a <= '0'; b <= '0'; wait for 20 ns;
        a <= '0'; b <= '1'; wait for 20 ns;
        a <= '1'; b <= '0'; wait for 20 ns;
        a <= '1'; b <= '1'; wait for 20 ns;
        report "Chay xong bang kich ban DO script!" severity note;
        wait;
    end process;
end architecture sim;`,
      instructions: "Tạo file `run_sim.do` trong cùng thư mục. Mở ModelSim, tại cửa sổ Transcript gõ: `do run_sim.do` và nhấn Enter để xem toàn bộ quá trình tự động diễn ra!"
    },

    quartusGuide: {
      steps: [
        "1. Tạo file text mới đặt tên là run_sim.do.",
        "2. Điền các lệnh vlib, vcom, vsim, add wave, run như hướng dẫn.",
        "3. Mở ModelSim -> File -> Change Directory... -> Chọn thư mục dự án của bạn.",
        "4. Gõ do run_sim.do tại cửa sổ Transcript để chạy."
      ],
      pinAssignments: [
        { signal: "in_a", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "in_b", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1" },
        { signal: "out_y", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to in_a\nset_location_assignment PIN_AC28 -to in_b\nset_location_assignment PIN_G19 -to out_y`
    },

    commonErrors: [
      {
        error: "Quên tùy chọn -voptargs=\"+acc\" khiến không xem được tín hiệu nội bộ trong Waveform",
        cause: "Bộ tối ưu hóa của ModelSim mặc định sẽ xóa bỏ hoặc ẩn các tín hiệu trung gian để tăng tốc, làm cho bạn không thể kéo thả tín hiệu vào cửa sổ sóng.",
        fix: "Luôn thêm cờ `-voptargs=\"+acc\"` khi gọi lệnh `vsim`."
      },
      {
        error: "Biên dịch sai thứ tự phụ thuộc file: testbench biên dịch trước file thiết kế",
        cause: "Testbench phụ thuộc vào entity của mạch thiết kế, nếu file thiết kế chưa được biên dịch vào thư viện work thì testbench sẽ báo lỗi `Unit ... not found`.",
        fix: "Luôn đặt lệnh `vcom` file thiết kế trước, sau đó mới đến file testbench."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo vạch phân cách Divider trong Waveform",
        prompt: "Viết lệnh TCL để tạo một thanh tiêu đề phân cách có tên '--- CONTROL SIGNALS ---' trên cửa sổ Waveform.",
        hint: "add wave -divider \"Tên vạch phân cách\"",
        solution: "add wave -divider \"--- CONTROL SIGNALS ---\""
      },
      {
        level: "Vận dụng",
        title: "Định dạng hiển thị số Hex cho Bus dữ liệu",
        prompt: "Viết lệnh thêm bus dữ liệu `/tb_top/data_bus` nhưng hiển thị giá trị dưới dạng số Hex thay vì Binary.",
        hint: "add wave -radix hex /tb_top/data_bus",
        solution: "add wave -radix hex /tb_top/data_bus"
      },
      {
        level: "Thử thách",
        title: "Viết script tự động lặp kiểm tra hàng loạt file",
        prompt: "Trong ngôn ngữ TCL, cấu trúc vòng lặp nào cho phép duyệt qua một danh sách các file VHDL để biên dịch tự động?",
        hint: "Cấu trúc `foreach file [glob *.vhd] { vcom $file }`.",
        solution: "foreach f [glob *.vhd] { echo \"Compiling $f\"; vcom -2008 -work work $f }"
      }
    ],

    quiz: [
      {
        question: "Lệnh nào trong ModelSim dùng để biên dịch file mã nguồn VHDL vào thư viện làm việc?",
        options: [
          "vcom",
          "vlog",
          "vlib",
          "vsim"
        ],
        answerIndex: 0,
        explanation: "`vcom` là trình biên dịch VHDL của ModelSim (trong khi `vlog` dùng cho Verilog, `vlib` tạo thư viện, `vsim` chạy mô phỏng)."
      },
      {
        question: "Ý nghĩa của cờ tùy chọn `-voptargs=\"+acc\"` trong câu lệnh `vsim` là gì?",
        options: [
          "Cấp quyền truy cập (Visibility/Access) toàn bộ các tín hiệu nội bộ để xem được sóng trên Waveform",
          "Tăng tốc độ máy tính lên gấp đôi",
          "Tắt âm thanh thông báo",
          "Xóa thư viện cũ"
        ],
        answerIndex: 0,
        explanation: "`+acc` (accelerate access) báo cho ModelSim giữ lại toàn bộ tên tín hiệu và cấu trúc nội bộ để người dùng có thể debug và xem dạng sóng."
      },
      {
        question: "Để thực thi một file kịch bản có đuôi `.do` trong cửa sổ Transcript của ModelSim, ta gõ lệnh nào?",
        options: [
          "do <tên_file>.do",
          "run <tên_file>.do",
          "exec <tên_file>.do",
          "start <tên_file>.do"
        ],
        answerIndex: 0,
        explanation: "Lệnh `do <filename>.do` là lệnh chuẩn của ModelSim để thực thi một chuỗi các câu lệnh TCL được lưu trong file kịch bản."
      },
      {
        question: "Để chạy ModelSim ở chế độ dòng lệnh thuần túy không mở giao diện đồ họa (Batch Mode), ta thêm cờ nào khi gọi lệnh vsim từ Terminal?",
        options: [
          "-c",
          "-gui",
          "-fast",
          "-silent"
        ],
        answerIndex: 0,
        explanation: "Tùy chọn `-c` (Command Line mode) khởi động ModelSim ở chế độ dòng lệnh, không nạp giao diện đồ họa GUI, rất thích hợp cho kiểm thử tự động CI/CD."
      }
    ],

    summary: [
      "Kịch bản TCL/DO script là công cụ không thể thiếu của kỹ sư thiết kế vi mạch chuyên nghiệp.",
      "Chuỗi 5 lệnh cốt lõi: `vlib` -> `vmap` -> `vcom` -> `vsim` -> `add wave` & `run`.",
      "Luôn nhớ thêm cờ `-voptargs=\"+acc\"` để xem được đầy đủ các tín hiệu nội bộ.",
      "Chỉ cần gõ `do run_sim.do` để tự động hóa toàn bộ quy trình mô phỏng trong vài giây.",
      "Hỗ trợ chế độ Batch mode (`-c`) giúp tăng tốc kiểm thử hàng loạt trên máy chủ."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return { LEDR0: (inputs.SW0 ^ inputs.SW1) ? 1 : 0 };
      }
    }
  },

  // ========================================================================
  // BÀI 6.5
  // ========================================================================
  {
    id: "ch6-b5",
    chapterId: "ch6",
    order: 5,
    title: "Kỹ thuật phân tích giản đồ sóng ModelSim (Waveform Analysis & Debugging)",
    subtitle: "Dò tìm xung gai Glitch, bắt lỗi bất định 'U'/'X' và đo đạc chuẩn xác từng pico-giây",
    badge: "Debug nâng cao",
    estimatedMinutes: 35,
    hardwareFocus: ["Waveform Debugging", "Cursors Measurement", "Glitch Detection", "Radix Settings"],

    objectives: [
      "Làm chủ các phím tắt và thao tác nâng cao trên cửa sổ Waveform: Zoom In/Out, Zoom Full (`F`), Zoom Range.",
      "Sử dụng nhiều con trỏ thời gian (Multiple Cursors) để đo chu kỳ xung nhịp, độ lệch pha và thời gian trễ Delta T.",
      "Chuyển đổi định dạng cơ số Radix hiển thị: Binary, Unsigned, Signed, Hex, ASCII và Enum Type.",
      "Nhận diện và sửa dứt điểm các trạng thái logic bất thường: 'U' (Uninitialized), 'X' (Unknown/Conflict), 'Z' (High-Impedance).",
      "Lưu và tải cấu hình bố cục dạng sóng vào file `wave.do`."
    ],

    theory: {
      why: "Khi mô phỏng thất bại, giản đồ sóng Waveform chính là chiếc kính hiển vi để kỹ sư 'mổ xẻ' từng xung nhịp và tìm ra thủ phạm gây lỗi. Hiểu rõ ý nghĩa của các màu sắc sóng, cách đo đạc chính xác khoảng cách thời gian giữa các sự kiện và truy tìm nguồn gốc của các giá trị 'U' hay 'X' màu đỏ là kỹ năng phân biệt giữa một người mới học và một chuyên gia thiết kế vi mạch thực thụ.",
      how: "1. **Các phím tắt thần tốc trong cửa sổ Waveform của ModelSim:**\n- Phím `F` (Zoom Full): Phóng to toàn bộ dải thời gian từ 0 đến kết thúc vừa khít màn hình.\n- Phím `I` / `O`: Zoom In (phóng to) / Zoom Out (thu nhỏ).\n- Phím `C` (Collapse All): Thu gọn các nhóm tín hiệu.\n\n2. **Kỹ thuật đo thời gian bằng Cursors:**\n- Nhấp chuột trái lên thước đo thời gian để đặt Con trỏ 1 (Cursor 1).\n- Nhấp vào biểu tượng dấu cộng `+` ở thanh công cụ để thêm Con trỏ 2 (Cursor 2).\n- ModelSim sẽ tự động hiển thị hiệu số thời gian `Delta = Time2 - Time1` và tần số tương ứng `Freq = 1 / Delta`. Ví dụ: Đặt giữa 2 cạnh lên clock, bạn sẽ thấy `Delta = 20.0 ns`, `Freq = 50.0 MHz`.\n\n3. **Giải mã các trạng thái logic trong chuẩn IEEE 1164:**\n- Mức `'U'` (Uninitialized - Thường vẽ đường nét đứt màu đỏ): Tín hiệu chưa được gán giá trị ban đầu, thanh ghi chưa qua Reset!\n- Mức `'X'` (Forcing Unknown - Màu đỏ đậm): Xung đột phần cứng (ví dụ: hai khối mạch cùng lúc gán giá trị khác nhau lên 1 đường dây) hoặc vi phạm Setup/Hold.\n- Mức `'Z'` (High Impedance - Đường màu xanh dương nằm chính giữa): Chân đang thả nổi ở trạng thái trở kháng cao (Tri-State).\n- Mức `'0'` và `'1'`: Mức logic bình thường (màu xanh lá cây).",
      sections: [
        {
          heading: "1. Lưu bố cục sóng (Save Wave Format) vào file wave.do",
          content: "Sau khi bạn đã mất công sắp xếp các đường tín hiệu theo nhóm, đổi màu và đổi Radix sang Hex, hãy lưu cấu hình lại để lần sau mở ra không phải chỉnh lại từ đầu:\n- Vào menu `File -> Save -> Format...` -> Lưu tên file là `wave.do`.\n- Trong file kịch bản `run_sim.do`, thêm dòng lệnh:\n```tcl\ndo wave.do\n```\nModelSim sẽ tự động phục hồi chính xác 100% bố cục cửa sổ sóng quen thuộc của bạn!",
          callout: {
            type: "tip",
            title: "Dò tìm xung gai (Glitch Hunting)",
            text: "Nếu một đường tín hiệu tổ hợp xuất hiện một vệt dọc màu đỏ hoặc một xung nhọn cực ngắn chỉ dài vài pico-giây (ps), đó chính là Glitch. Giải pháp là chốt tín hiệu đó qua một Flip-Flop đồng bộ theo cạnh clock (Registered Output)."
          }
        }
      ],
      truthTable: {
        headers: ["Ký hiệu mức logic", "Màu sắc ModelSim", "Nguyên nhân vật lý", "Cách khắc phục"],
        rows: [
          ["'U' (Uninitialized)", "Đường đứt nét / Đỏ", "Flip-Flop chưa được kích hoạt Reset ban đầu", "Thêm chân Reset và gán giá trị '0' lúc khởi động"],
          ["'X' (Unknown / Conflict)", "Màu đỏ rực rỡ", "Có từ 2 driver cùng xuất dữ liệu lên 1 dây", "Kiểm tra gán đè tín hiệu, sửa lỗi đa nguồn phát"],
          ["'Z' (High-Impedance)", "Đường xanh giữa", "Cổng 3 trạng thái (Tri-state) đang bị ngắt", "Bật tín hiệu Enable của cổng 3 trạng thái"],
          ["'0' / '1'", "Màu xanh lá cây", "Mạch hoạt động bình thường, chuẩn xác", "Trạng thái vận hành mong muốn"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Minh họa thước đo Cursors và các mức logic ModelSim -->
      <g transform="translate(30, 20)">
        <text x="280" y="20" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">CÁC TRẠNG THÁI LOGIC TRONG MODELSIM WAVEFORM</text>

        <!-- Trạng thái 'U' -->
        <text x="20" y="55" fill="#ef4444" font-family="monospace" font-size="10">signal_u ('U')</text>
        <line x1="120" y1="50" x2="300" y2="50" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4"/>
        <text x="310" y="54" fill="#ef4444" font-size="9">Chưa Reset (Uninitialized)</text>

        <!-- Trạng thái 'X' -->
        <text x="20" y="95" fill="#ef4444" font-family="monospace" font-size="10">conflict ('X')</text>
        <rect x="120" y="85" width="180" height="20" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" stroke-width="1.5"/>
        <text x="210" y="99" text-anchor="middle" fill="#fca5a5" font-size="9" font-weight="bold">XUNG ĐỘT (Unknown X)</text>

        <!-- Trạng thái 'Z' -->
        <text x="20" y="135" fill="#0284c7" font-family="monospace" font-size="10">tri_state ('Z')</text>
        <line x1="120" y1="130" x2="300" y2="130" stroke="#0284c7" stroke-width="2"/>
        <text x="310" y="134" fill="#0284c7" font-size="9">Trở kháng cao (Z)</text>

        <!-- Thước đo Cursors -->
        <line x1="420" y1="35" x2="420" y2="175" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="420" y="190" text-anchor="middle" fill="#f59e0b" font-size="9">Cursor 1 (100ns)</text>

        <line x1="520" y1="35" x2="520" y2="175" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="520" y="190" text-anchor="middle" fill="#38bdf8" font-size="9">Cursor 2 (120ns)</text>

        <rect x="430" y="70" width="80" height="30" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
        <text x="470" y="85" text-anchor="middle" fill="#10b981" font-size="9" font-weight="bold">Delta: 20 ns</text>
        <text x="470" y="96" text-anchor="middle" fill="#10b981" font-size="8">Freq: 50 MHz</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "debug_demo_circuit",
      circuitType: "sequential",
      typeExplanation: "Mạch tuần tự có xung đột và cổng 3 trạng thái phục vụ thực hành nhận diện lỗi U, X, Z trên giản đồ sóng ModelSim.",
      code: `--------------------------------------------------------------------------------
-- Tên file: debug_demo_circuit.vhd
-- Mạch minh họa các trạng thái logic 'U', 'X', 'Z' và cách gỡ lỗi
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity debug_demo_circuit is
    port (
        clk      : in  std_logic;
        rst_n    : in  std_logic;
        enable_z : in  std_logic;
        data_in  : in  std_logic;
        tri_out  : out std_logic;
        clean_out: out std_logic
    );
end entity debug_demo_circuit;

architecture rtl of debug_demo_circuit is
    signal reg_uninit : std_logic; -- Cố tình không gán ban đầu để minh họa lỗi 'U'
    signal reg_clean  : std_logic := '0';
begin
    -- 1. CỔNG 3 TRẠNG THÁI (Tri-State Buffer minh họa 'Z')
    tri_out <= data_in when enable_z = '1' else 'Z';

    -- 2. THANH GHI CHUẨN CÓ RESET AN TOÀN
    process(clk, rst_n)
    begin
        if rst_n = '0' then
            reg_clean <= '0';
        elsif rising_edge(clk) then
            reg_clean <= data_in;
        end if;
    end process;

    clean_out <= reg_clean;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_debug_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench thực hành đo sóng Cursors và phân tích các mức U, X, Z
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_debug_demo is
end entity tb_debug_demo;

architecture sim of tb_debug_demo is
    signal clk       : std_logic := '0';
    signal rst_n     : std_logic := '0';
    signal enable_z  : std_logic := '0';
    signal data_in   : std_logic := '0';
    signal tri_out   : std_logic;
    signal clean_out : std_logic;
begin
    uut: entity work.debug_demo_circuit
        port map (
            clk       => clk,
            rst_n     => rst_n,
            enable_z  => enable_z,
            data_in   => data_in,
            tri_out   => tri_out,
            clean_out => clean_out
        );

    clk <= not clk after 10 ns; -- 50 MHz

    stim: process
    begin
        -- Ban đầu Reset
        rst_n <= '0';
        enable_z <= '0'; -- tri_out sẽ ở mức 'Z'
        data_in  <= '1';
        wait for 40 ns;

        -- Nhả Reset
        rst_n <= '1';
        wait for 20 ns;

        -- Bật Enable cổng 3 trạng thái (tri_out chuyển từ 'Z' sang '1')
        enable_z <= '1';
        wait for 40 ns;

        data_in <= '0';
        wait for 40 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim: Bấm Zoom Full (phím F). Thêm 2 con trỏ Cursors để đo độ rộng xung clock. Quan sát đường `tri_out` chuyển từ đường xanh 'Z' sang mức logic '1'."
    },

    quartusGuide: {
      steps: [
        "1. Tạo dự án debug_demo_circuit.",
        "2. Chạy mô phỏng RTL trên ModelSim.",
        "3. Trên cửa sổ Wave: Nhấp phím F để Zoom Full, phím I để Zoom In.",
        "4. Bấm nút Add Cursor trên thanh công cụ để đo chính xác chu kỳ xung nhịp 20 ns."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0" },
        { signal: "enable_z", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "clean_out", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_AB28 -to enable_z\nset_location_assignment PIN_G19 -to clean_out`
    },

    commonErrors: [
      {
        error: "Giản đồ sóng xuất hiện vạch đứt nét màu đỏ 'U' kéo dài suốt quá trình mô phỏng",
        cause: "Tín hiệu hoặc Flip-Flop tương ứng không được cấp tín hiệu Reset ban đầu và không có giá trị khởi tạo, dẫn đến mạch không biết bắt đầu từ đâu.",
        fix: "Thêm nhánh `if rst_n = '0'` trong khối process tuần tự để ép tín hiệu về '0' lúc khởi động."
      },
      {
        error: "Xuất hiện vạch đỏ rực 'X' (Conflict) trên đường dây",
        cause: "Bạn đang có 2 câu lệnh gán đồng thời cùng gán giá trị cho một signal (`sig <= a;` và ở chỗ khác lại `sig <= b;`).",
        fix: "Kiểm tra lại toàn bộ file architecture, đảm bảo mỗi tín hiệu chỉ được lái bởi DUY NHẤT một nguồn phát (Single Driver)."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Đổi màu hiển thị của tín hiệu trên Waveform",
        prompt: "Làm thế nào để đổi màu một đường tín hiệu quan trọng thành màu vàng hoặc đỏ rực rỡ để dễ quan sát?",
        hint: "Nhấp chuột phải vào tên tín hiệu -> Properties -> Wave Color.",
        solution: "Nhấp chuột phải vào tên tín hiệu trên Waveform -> chọn Wave Color -> chọn màu tùy thích (Yellow, Red, Cyan)."
      },
      {
        level: "Vận dụng",
        title: "Lưu cấu hình bố cục dạng sóng vào wave.do",
        prompt: "Viết lệnh lưu toàn bộ các tín hiệu, nhóm divider và màu sắc hiện tại vào file `wave.do`.",
        hint: "write format wave wave.do",
        solution: "Tại cửa sổ Transcript của ModelSim, gõ lệnh: write format wave wave.do"
      },
      {
        level: "Thử thách",
        title: "Sử dụng chế độ Analog Waveform hiển thị sóng sin / tam giác",
        prompt: "Khi mô phỏng tín hiệu âm thanh hoặc bộ đếm tăng dần, làm thế nào để ModelSim vẽ đồ thị dạng sóng liên tục (Analog / Step plot) thay vì các con số Hex?",
        hint: "Nhấp chuột phải vào tên tín hiệu -> Format -> Analog (automatic/interpolated).",
        solution: "Nhấp chuột phải vào Bus tín hiệu -> chọn Format -> Analog (Automatic). ModelSim sẽ vẽ đồ thị dạng sóng hình học dạng bậc thang analog cực đẹp."
      }
    ],

    quiz: [
      {
        question: "Phím tắt kinh điển nào trong ModelSim Waveform giúp phóng to toàn bộ chiều dài thời gian mô phỏng vừa khít màn hình?",
        options: [
          "Phím F (Zoom Full)",
          "Phím Z",
          "Phím Space",
          "Phím Ctrl + A"
        ],
        answerIndex: 0,
        explanation: "Phím tắt `F` (Zoom Full) là phím thông dụng nhất, giúp co giãn toàn bộ dòng thời gian từ 0 đến điểm cuối cùng vừa vặn màn hình."
      },
      {
        question: "Đường tín hiệu có vạch nét đứt màu đỏ và ký hiệu 'U' trong ModelSim mang ý nghĩa gì?",
        options: [
          "Uninitialized: Tín hiệu chưa được khởi tạo giá trị ban đầu (chưa qua Reset)",
          "Unknown: Tín hiệu bị chập mạch",
          "Underflow: Tràn số âm",
          "User mode: Chế độ người dùng"
        ],
        answerIndex: 0,
        explanation: "Ký hiệu 'U' (Uninitialized) cảnh báo tín hiệu chưa bao giờ được gán giá trị hợp lệ, thường gặp khi Flip-Flop thiếu mạch Reset."
      },
      {
        question: "Dấu hiệu nào trên Waveform ModelSim cảnh báo có hiện tượng xung đột phần cứng (nhiều nguồn cùng phát lên 1 dây dẫn)?",
        options: [
          "Vạch màu đỏ rực mang giá trị 'X' (Forcing Unknown)",
          "Đường màu xanh '0'",
          "Đường màu vàng",
          "Đường màu tím"
        ],
        answerIndex: 0,
        explanation: "Giá trị 'X' (Unknown/Conflict) xảy ra khi có từ hai driver cạnh tranh nhau (ví dụ một bên lái '1', một bên lái '0') trên cùng một dây tín hiệu."
      },
      {
        question: "Lệnh nào sau đây dùng để lưu toàn bộ cách bài trí cửa sổ Waveform hiện tại vào file kịch bản?",
        options: [
          "write format wave wave.do",
          "save wave.txt",
          "export waveform.png",
          "dump wave.vcd"
        ],
        answerIndex: 0,
        explanation: "Lệnh `write format wave wave.do` lưu toàn bộ danh sách tín hiệu, màu sắc, cơ số radix và divider vào file cấu hình `wave.do`."
      }
    ],

    summary: [
      "Nắm vững phím tắt `F` (Zoom Full) và `I`/`O` để điều hướng giản đồ sóng siêu tốc.",
      "Sử dụng Cursors để đo chính xác thời gian Delta T và tần số dao động.",
      "Hiểu rõ mã màu chuẩn: 'U' (chưa reset), 'X' (xung đột driver), 'Z' (trở kháng cao).",
      "Lưu bố cục sóng bằng `write format wave wave.do` để tái sử dụng vĩnh viễn.",
      "Chuyển đổi linh hoạt Radix (Hex, Unsigned, Analog) giúp việc debug trực quan và nhanh chóng."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "KEY0"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return { LEDR0: inputs.SW0 ? 1 : 0 };
      }
    }
  }
];

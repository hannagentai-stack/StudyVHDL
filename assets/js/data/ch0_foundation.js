// ==========================================================================
// CH0_FOUNDATION.JS - CHƯƠNG 0: CHUẨN BỊ NỀN TẢNG (5 BÀI HỌC HOÀN CHỈNH)
// ==========================================================================

window.VHDL_LESSONS_DB = window.VHDL_LESSONS_DB || {};

window.VHDL_LESSONS_DB["ch0"] = [
  // ========================================================================
  // BÀI 0.1
  // ========================================================================
  {
    id: "ch0-b1",
    chapterId: "ch0",
    order: 1,
    title: "FPGA là gì? Khác biệt sống còn giữa 'Mô tả phần cứng' và 'Lập trình tuần tự'",
    subtitle: "Xây dựng tư duy phần cứng (Hardware Mindset): Tại sao VHDL không phải là ngôn ngữ C?",
    badge: "Tư duy phần cứng",
    estimatedMinutes: 20,
    hardwareFocus: ["FPGA Cyclone IV", "Khái niệm Logic Cell"],

    objectives: [
      "Hiểu bản chất kiến trúc FPGA: Ma trận khối logic lập trình được (Configurable Logic Blocks - LE).",
      "Phân biệt rạch ròi sự khác nhau giữa vi điều khiển (MCU chạy tuần tự từng lệnh) và FPGA (chạy song song thực sự).",
      "Hiểu khái niệm 'Mô tả phần cứng' (Hardware Description): Viết code VHDL là đang 'vẽ ra mạch điện', không phải là chỉ thị cho CPU thực thi.",
      "Xóa bỏ hoàn toàn tư duy lập trình phần mềm tuần tự để sẵn sàng tiếp thu kiến trúc đồng thời trong VHDL."
    ],

    theory: {
      why: "Nếu bạn dùng tư duy lập trình C/Python để viết VHDL, bạn sẽ thất bại ngay lập tức! Trong C, dòng lệnh 1 chạy xong mới đến dòng lệnh 2. Nhưng trong thế giới phần cứng thật, khi cấp nguồn, toàn bộ hàng triệu linh kiện trên bo mạch đều hoạt động cùng một lúc. Hiểu được điều này là chiếc chìa khóa đầu tiên mở cánh cửa vi mạch.",
      how: "FPGA (Field-Programmable Gate Array) giống như một thùng linh kiện Lego khổng lồ chứa hàng chục ngàn cổng logic (LUT), bộ nhớ flip-flop và đường dây nối. Khi bạn nạp file cấu hình vào FPGA, nó không hề chạy lệnh nào cả; thay vào đó, các công tắc điện tử bên trong sẽ đóng/ngắt để đấu nối vật lý các khối logic lại với nhau theo đúng bản vẽ VHDL của bạn.",
      sections: [
        {
          heading: "1. So sánh Vi điều khiển (MCU) và FPGA",
          content: "Vi điều khiển (như Arduino, STM32, PIC) có một bộ vi xử lý (CPU) cố định. CPU đọc từng lệnh từ Flash và thực thi tuần tự. Dù chạy nhanh đến đâu, tại một thời điểm mỗi lõi CPU chỉ làm một việc.\n\nNgược lại, FPGA không có CPU sẵn (trừ khi bạn tự thiết kế một CPU bên trong nó). Trên FPGA, bạn có thể tạo ra 10 bộ đếm, 10 cổng truyền thông UART, tất cả đều chạy độc lập song song 100% cùng lúc ở tần số 50 MHz mà không chia sẻ tài nguyên tính toán của nhau.",
          callout: {
            type: "info",
            title: "Ví dụ đời thường dễ nhớ",
            text: "MCU giống như một đầu bếp cừ khôi làm từng món ăn theo thứ tự trong sổ tay. FPGA giống như một căn bếp với 50 đầu bếp, mỗi người phụ trách một bếp nấu riêng biệt cùng lúc."
          }
        },
        {
          heading: "2. Bản chất của ngôn ngữ VHDL",
          content: "VHDL viết tắt của 'VHSIC Hardware Description Language' (VHSIC = Very High Speed Integrated Circuit). Từ khóa quan trọng nhất ở đây là **Description (Mô tả)**. Bạn không ra lệnh cho máy tính tính toán; bạn đang **mô tả cấu trúc dây dẫn và cổng logic** để phần mềm Quartus tổng hợp (Synthesis) thành mạch bán dẫn thật trên chip Cyclone IV.",
          callout: {
            type: "warning",
            title: "Quy tắc vàng cho người mới",
            text: "Trước khi viết bất kỳ dòng lệnh VHDL nào, hãy tự hỏi trong đầu: 'Dòng lệnh này sẽ biến thành linh kiện gì trên bo mạch? Dây dẫn, cổng logic hay thanh ghi?'"
          }
        }
      ],
      truthTable: {
        headers: ["Tiêu chí so sánh", "Vi điều khiển (MCU / CPU)", "FPGA (Field-Programmable Gate Array)"],
        rows: [
          ["Kiến trúc", "Phần cứng cố định, thực thi mã lệnh phần mềm", "Mảng logic khả trình, tự cấu hình phần cứng"],
          ["Cách thực thi", "Tuần tự từng lệnh (Sequential execution)", "Song song thực sự 100% (True Concurrency)"],
          ["Độ trễ phản hồi", "Phụ thuộc ngắt (Interrupt latency) và chu kỳ xung nhịp", "Độ trễ xác định chính xác theo bước sóng nano-giây"],
          ["Ngôn ngữ sử dụng", "C, C++, Assembly, Python", "VHDL, Verilog, SystemVerilog"],
          ["Ứng dụng tiêu biểu", "Điều khiển thiết bị, giao diện người dùng, đọc cảm biến chậm", "Xử lý tín hiệu số tốc độ cao, Radar, AI phần cứng, Viễn thông 5G"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Khối so sánh MCU vs FPGA -->
      <rect x="20" y="30" width="280" height="160" rx="8" fill="#131c31" stroke="#f59e0b" stroke-width="2"/>
      <text x="160" y="60" text-anchor="middle" fill="#f59e0b" font-family="monospace" font-size="14" font-weight="bold">VI ĐIỀU KHIỂN (MCU)</text>
      <rect x="40" y="80" width="240" height="35" rx="4" fill="#1e293b"/>
      <text x="160" y="102" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Lệnh 1 ➔ Lệnh 2 ➔ Lệnh 3</text>
      <text x="160" y="150" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">Chạy tuần tự từng dòng (Sequential)</text>
      
      <rect x="340" y="30" width="280" height="160" rx="8" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
      <text x="480" y="60" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="14" font-weight="bold">FPGA CYCLONE IV</text>
      <rect x="360" y="80" width="70" height="40" rx="4" fill="#0284c7"/>
      <text x="395" y="105" text-anchor="middle" fill="#fff" font-family="monospace" font-size="10">Khối A</text>
      <rect x="445" y="80" width="70" height="40" rx="4" fill="#0284c7"/>
      <text x="480" y="105" text-anchor="middle" fill="#fff" font-family="monospace" font-size="10">Khối B</text>
      <rect x="530" y="80" width="70" height="40" rx="4" fill="#0284c7"/>
      <text x="565" y="105" text-anchor="middle" fill="#fff" font-family="monospace" font-size="10">Khối C</text>
      <text x="480" y="150" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="11">Chạy song song đồng thời (Parallel)</text>
    </svg>`,

    vhdlCode: {
      entityName: "parallel_demo",
      circuitType: "combinational",
      typeExplanation: "Minh họa 2 phép gán đồng thời (Concurrent Assignments): Cả hai đường dây dẫn x_out và y_out được nối trực tiếp và hoạt động đồng thời cùng một lúc, không có thứ tự trước sau.",
      code: `--------------------------------------------------------------------------------
-- Tên file: parallel_demo.vhd
-- Minh họa tư duy phần cứng: Các phép gán xảy ra SONG SONG cùng một lúc
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity parallel_demo is
    port (
        a_in  : in  std_logic; -- Ngõ vào A (ví dụ công tắc SW0)
        b_in  : in  std_logic; -- Ngõ vào B (ví dụ công tắc SW1)
        x_out : out std_logic; -- Ngõ ra X (ví dụ đèn LEDR0)
        y_out : out std_logic  -- Ngõ ra Y (ví dụ đèn LEDR1)
    );
end entity parallel_demo;

architecture rtl of parallel_demo is
begin
    -- Dù dòng này viết bên dưới, hai cổng AND và OR này vẫn được tạo ra
    -- thành 2 mạch bán dẫn độc lập trên FPGA và tính toán cùng một thời điểm!
    x_out <= a_in and b_in; -- Mạch cổng AND nối ngõ vào ra ngõ ra X
    y_out <= a_in or  b_in; -- Mạch cổng OR nối ngõ vào ra ngõ ra Y
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_parallel_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench minh họa tính song song trên ModelSim
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_parallel_demo is
end entity tb_parallel_demo;

architecture sim of tb_parallel_demo is
    signal a_tb, b_tb : std_logic := '0';
    signal x_tb, y_tb : std_logic;
begin
    -- Kết nối thiết kế
    uut: entity work.parallel_demo
        port map (
            a_in  => a_tb,
            b_in  => b_tb,
            x_out => x_tb,
            y_out => y_tb
        );

    -- Kích thích tín hiệu
    stim_proc: process
    begin
        wait for 20 ns;
        a_tb <= '1'; b_tb <= '0';
        wait for 20 ns;
        a_tb <= '1'; b_tb <= '1';
        wait for 20 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Trong ModelSim, khi a_tb và b_tb đổi trạng thái, bạn sẽ thấy x_tb và y_tb phản ứng cùng lúc tại cùng một mốc thời gian."
    },

    quartusGuide: {
      steps: [
        "1. Mở Quartus Prime Lite 20.1.",
        "2. Khái niệm tổng hợp (Synthesis): Quartus đọc mã VHDL và dịch thành các bảng tra LUT (Look-Up Table) 4 ngõ vào của Cyclone IV.",
        "3. Chân chip dự kiến: a_in nối SW0 (PIN_AB28), b_in nối SW1 (PIN_AC28), x_out nối LEDR0 (PIN_G19), y_out nối LEDR1 (PIN_F19).",
        "4. Quan sát cấu trúc mạch sinh ra bằng công cụ Tools -> Netlist Viewers -> RTL Viewer."
      ],
      pinAssignments: [
        { signal: "a_in", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "b_in", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1" },
        { signal: "x_out", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" },
        { signal: "y_out", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to a_in\nset_location_assignment PIN_AC28 -to b_in\nset_location_assignment PIN_G19 -to x_out\nset_location_assignment PIN_F19 -to y_out`
    },

    commonErrors: [
      {
        error: "Viết nhiều câu lệnh gán cho cùng một tín hiệu: x <= a; x <= b;",
        cause: "Lỗi Multiple Drivers (Nhiều nguồn phát). Trong phần mềm, biến x nhận giá trị mới sau. Trong phần cứng, điều này tương đương chập 2 dây điện có điện áp khác nhau vào nhau!",
        fix: "Tuyệt đối chỉ gán giá trị cho một tín hiệu (signal) từ một nguồn duy nhất."
      },
      {
        error: "Nghĩ rằng đổi thứ tự 2 dòng lệnh trong architecture sẽ thay đổi thứ tự hoạt động",
        cause: "Nhầm lẫn với ngôn ngữ tuần tự C. Trong architecture, mọi câu lệnh gán đồng thời đều thực thi song song bất kể thứ tự dòng.",
        fix: "Tập làm quen với tư duy kết nối dây điện song song."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo thêm ngõ ra đảo",
        prompt: "Bổ sung thêm ngõ ra z_out : out std_logic và gán z_out bằng đảo của a_in (dùng toán tử not).",
        hint: "Khai báo thêm port z_out và thêm câu lệnh gán đồng thời: z_out <= not a_in;",
        solution: "-- Trong entity: z_out : out std_logic;\n-- Trong architecture:\nz_out <= not a_in;"
      },
      {
        level: "Vận dụng",
        title: "Dự đoán sơ đồ RTL Viewer",
        prompt: "Nếu bạn viết: x_out <= a_in and b_in; y_out <= x_out or c_in; Phần cứng sinh ra sẽ gồm những cổng gì nối với nhau?",
        hint: "Vẽ sơ đồ gồm 1 cổng AND 2 ngõ vào và 1 cổng OR 2 ngõ vào.",
        solution: "Ngõ ra của cổng AND (x_out) sẽ được rẽ một nhánh đi ra chân LEDR0, đồng thời nối làm 1 ngõ vào cho cổng OR. Ngõ vào thứ hai của cổng OR nối với c_in."
      },
      {
        level: "Thử thách",
        title: "Tại sao vòng lặp vô tận (while true) bị cấm trong tổng hợp phần cứng?",
        prompt: "Giải thích tại sao trong C có vòng lặp while(1) nhưng trong mô tả mạch tổ hợp VHDL lại không thể tổng hợp được vòng lặp vô tận.",
        hint: "Phần cứng là dây và cổng vật lý hữu hạn. Một vòng lặp vô tận không có clock sẽ tạo ra vòng lặp tổ hợp (Combinational Feedback Loop) gây dao động không xác định.",
        solution: "Mạch tổ hợp không thể chứa vòng lặp kín không qua thanh ghi vì sẽ tạo ra hiện tượng chập vòng (Combinational Loop), làm tín hiệu đuổi nhau liên tục và không bao giờ ổn định trạng thái logic."
      }
    ],

    quiz: [
      {
        question: "Đặc điểm khác biệt cốt lõi nhất giữa vi điều khiển (MCU) và FPGA là gì?",
        options: [
          "FPGA chạy các câu lệnh C nhanh hơn MCU 10 lần",
          "FPGA thực thi song song thực sự trên phần cứng, trong khi MCU chạy tuần tự từng lệnh",
          "FPGA tiêu thụ ít điện năng hơn tất cả các dòng MCU",
          "FPGA không cần nạp nguồn điện vẫn hoạt động được"
        ],
        answerIndex: 1,
        explanation: "FPGA được cấu tạo từ ma trận các khối logic khả trình kết nối vật lý với nhau, cho phép tất cả các mạch hoạt động song song độc lập tại cùng một thời điểm."
      },
      {
        question: "Từ chữ cái 'D' trong viết tắt VHDL có ý nghĩa là gì?",
        options: [
          "Development (Phát triển)",
          "Digital (Kỹ thuật số)",
          "Description (Mô tả)",
          "Device (Thiết bị)"
        ],
        answerIndex: 2,
        explanation: "VHDL là viết tắt của 'VHSIC Hardware Description Language' - Ngôn ngữ MÔ TẢ phần cứng, dùng để mô tả kết nối mạch điện thay vì chỉ thị CPU."
      },
      {
        question: "Trong phần cứng FPGA, điều gì sẽ xảy ra nếu bạn cố tình nối 2 ngõ ra logic khác nhau vào cùng một đường dây dẫn tín hiệu?",
        options: [
          "Tín hiệu sau sẽ ghi đè lên tín hiệu trước như biến trong lập trình C",
          "Xảy ra lỗi Multiple Drivers (chập mạch nguồn tín hiệu), gây xung đột mức logic",
          "Quartus sẽ tự động đặt thêm một cổng AND để dung hòa",
          "Mạch vẫn hoạt động bình thường và lấy giá trị trung bình"
        ],
        answerIndex: 1,
        explanation: "Trong mạch điện, nếu một nguồn phát đẩy điện áp 2.5V ('1') và nguồn kia kéo về 0V ('0') vào cùng một dây dẫn, sẽ gây ra dòng điện chập ngắn mạch (xung đột logic Multiple Drivers)."
      },
      {
        question: "Khi bạn tráo đổi thứ tự hai câu lệnh gán tín hiệu trong thân architecture (khối begin...end), mạch phần cứng sinh ra sẽ:",
        options: [
          "Hoạt động theo thứ tự ngược lại",
          "Không hề thay đổi gì về cấu trúc phần cứng và chức năng hoạt động",
          "Báo lỗi cú pháp vì sai quy tắc trên-dưới",
          "Làm đảo lộn thứ tự xung clock"
        ],
        answerIndex: 1,
        explanation: "Các câu lệnh trong architecture là câu lệnh đồng thời (Concurrent Statements). Chúng mô tả các kết nối phần cứng song song, do đó thứ tự sắp xếp dòng mã không làm thay đổi bản chất mạch điện."
      }
    ],

    summary: [
      "FPGA là mảng logic khả trình (Field-Programmable Gate Array) gồm hàng chục ngàn khối logic LE có thể đấu nối linh hoạt.",
      "Viết mã VHDL là MÔ TẢ mạch điện phần cứng, không phải viết chuỗi câu lệnh tuần tự cho CPU như trong C/Python.",
      "Mọi câu lệnh gán đồng thời trong architecture đều hoạt động SONG SONG cùng lúc 100%.",
      "Không bao giờ được gán nhiều nguồn phát (multiple drivers) vào cùng một dây tín hiệu.",
      "Tư duy vi mạch: Luôn hình dung linh kiện thực tế (cổng logic, dây dẫn, thanh ghi) ẩn sau mỗi dòng code."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1"],
      activeOutputs: ["LEDR0", "LEDR1"],
      logicEvaluator: function(inputs) {
        return {
          LEDR0: inputs.SW0 && inputs.SW1 ? 1 : 0,
          LEDR1: inputs.SW0 || inputs.SW1 ? 1 : 0
        };
      }
    }
  },

  // ========================================================================
  // BÀI 0.2
  // ========================================================================
  {
    id: "ch0-b2",
    chapterId: "ch0",
    order: 2,
    title: "Toán học số: Hệ nhị phân, Hex, số bù 2 và phép tràn số",
    subtitle: "Nắm vững biểu diễn dữ liệu mức bit: Tại sao vi mạch chỉ hiểu '0' và '1'?",
    badge: "Hệ số & Biểu diễn dữ liệu",
    estimatedMinutes: 25,
    hardwareFocus: ["Dây bus dữ liệu", "Bộ cộng nhị phân"],

    objectives: [
      "Thành thạo chuyển đổi qua lại giữa hệ Thập phân (Dec), Nhị phân (Bin) và Thập lục phân (Hex).",
      "Hiểu cách biểu diễn số nguyên có dấu bằng phương pháp bù 2 (Two's Complement).",
      "Nắm vững hiện tượng tràn số (Overflow) và cách xác định bit tràn khi cộng trừ nhị phân.",
      "Biết cách tính độ rộng bus tín hiệu N-bit tương ứng với dải giá trị cần biểu diễn."
    ],

    theory: {
      why: "Trong mạch điện tử, tranzito chỉ có 2 trạng thái vật lý ổn định nhất: Đóng (ngắt dòng = 0V = '0') và Mở (dẫn dòng = 2.5V/3.3V = '1'). Toàn bộ máy tính và FPGA đều được xây dựng từ 2 mức điện áp này. Để xử lý số học, âm thanh hay hình ảnh, mọi thông tin đều phải mã hóa thành các chuỗi bit nhị phân.",
      how: "Một bit là đơn vị nhỏ nhất (0 hoặc 1). Gom 4 bit lại ta được 1 Nibble (biểu diễn vừa vặn 1 ký tự Hex từ 0 đến F). Gom 8 bit lại ta được 1 Byte (00 đến FF). Với số có dấu, bit cao nhất (MSB - Most Significant Bit) được dùng làm bit dấu; số âm được biểu diễn bằng cách đảo tất cả các bit rồi cộng thêm 1 (phương pháp bù 2).",
      sections: [
        {
          heading: "1. Bảng quy đổi 4-bit kinh điển (Dec - Bin - Hex)",
          content: "Trong lập trình VHDL và gán chân cho DE2-115, bạn sẽ liên tục gặp việc chia bus lớn thành từng nhóm 4-bit để hiển thị lên LED 7 thanh hoặc nhập từ công tắc.",
          callout: {
            type: "info",
            title: "Mẹo chuyển đổi nhanh",
            text: "Cứ 4 bit nhị phân tương ứng chính xác với 1 chữ số Hex. Ví dụ: 1101 1010 nhị phân = DA trong Hex!"
          }
        },
        {
          heading: "2. Số âm bù 2 (Two's Complement)",
          content: "Để biểu diễn số âm -5 trong hệ 4-bit:\n- Bước 1: Lấy số dương +5 = 0101.\n- Bước 2: Đảo tất cả các bit (bù 1) = 1010.\n- Bước 3: Cộng thêm 1 (bù 2) = 1011.\n\nNhờ phương pháp bù 2, bộ vi mạch phần cứng chỉ cần một mạch cộng duy nhất là có thể thực hiện được cả phép trừ (A - B = A + (-B)) mà không cần chế tạo thêm bộ trừ phức tạp!",
          callout: {
            type: "warning",
            title: "Cảnh báo tràn số (Overflow)",
            text: "Nếu bạn cộng hai số 4-bit có dấu: +7 (0111) + +2 (0010) = 1001. Bit dấu bị biến thành '1', kết quả bị biến thành -7! Đây là lỗi tràn số kinh điển trong thiết kế vi mạch."
          }
        }
      ],
      truthTable: {
        headers: ["Thập phân (Dec)", "Nhị phân 4-bit (Bin)", "Hex (Thập lục phân)", "Bù 2 (Số có dấu 4-bit)"],
        rows: [
          ["0", "0000", "0", "0"],
          ["1", "0001", "1", "+1"],
          ["2", "0010", "2", "+2"],
          ["7", "0111", "7", "+7 (Giá trị dương cực đại của 4-bit)"],
          ["8", "1000", "8", "-8 (Giá trị âm cực tiểu của 4-bit)"],
          ["9", "1001", "9", "-7"],
          ["14", "1110", "E", "-2"],
          ["15", "1111", "F", "-1"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 200" class="circuit-svg">
      <!-- Minh họa chuyển đổi 8-bit thành 2 chữ số Hex -->
      <rect x="50" y="40" width="240" height="60" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
      <text x="170" y="65" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="12">Bus nhị phân 8-bit</text>
      <text x="170" y="88" text-anchor="middle" fill="#f8fafc" font-family="monospace" font-size="16" font-weight="bold">1 1 0 1   0 1 1 0</text>
      
      <!-- Mũi tên chỉ tách 4-bit -->
      <path d="M 110 105 L 110 135" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
      <path d="M 230 105 L 230 135" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>
      
      <rect x="70" y="140" width="80" height="40" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
      <text x="110" y="165" text-anchor="middle" fill="#f59e0b" font-family="monospace" font-size="18" font-weight="bold">D</text>
      
      <rect x="190" y="140" width="80" height="40" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
      <text x="230" y="165" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="18" font-weight="bold">6</text>
      
      <!-- Kết quả Hex -->
      <text x="440" y="105" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="22" font-weight="bold">0xD6 (214 Dec)</text>
    </svg>`,

    vhdlCode: {
      entityName: "adder_overflow_demo",
      circuitType: "combinational",
      typeExplanation: "Minh họa mạch cộng 4-bit có phát hiện cờ nhớ Carry (tràn số không dấu) và cờ tràn Overflow (tràn số có dấu). Mạch sử dụng thư viện chuẩn IEEE.NUMERIC_STD.",
      code: `--------------------------------------------------------------------------------
-- Tên file: adder_overflow_demo.vhd
-- Bộ cộng 4-bit minh họa phép toán số học và cờ tràn
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL; -- Chuẩn bắt buộc cho số học VHDL

entity adder_overflow_demo is
    port (
        a_in     : in  std_logic_vector(3 downto 0); -- Số hạng A 4-bit
        b_in     : in  std_logic_vector(3 downto 0); -- Số hạng B 4-bit
        sum_out  : out std_logic_vector(3 downto 0); -- Tổng 4-bit
        carry_out: out std_logic                     -- Cờ nhớ (tràn không dấu)
    );
end entity adder_overflow_demo;

architecture rtl of adder_overflow_demo is
    -- Mở rộng lên 5 bit để chứa bit nhớ tràn ra ngoài
    signal a_ext, b_ext : unsigned(4 downto 0);
    signal sum_ext      : unsigned(4 downto 0);
begin
    -- Ghép thêm bit '0' vào đầu để mở rộng không dấu
    a_ext <= unsigned('0' & a_in);
    b_ext <= unsigned('0' & b_in);

    -- Phép cộng số học diễn ra trên phần cứng
    sum_ext <= a_ext + b_ext;

    -- Tách kết quả
    sum_out   <= std_logic_vector(sum_ext(3 downto 0));
    carry_out <= sum_ext(4); -- Bit thứ 5 chính là bit nhớ tràn
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_adder_overflow_demo",
      code: `--------------------------------------------------------------------------------
-- Testbench kiểm tra phép cộng và tràn số
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_adder_overflow_demo is
end entity tb_adder_overflow_demo;

architecture sim of tb_adder_overflow_demo is
    signal a, b, s : std_logic_vector(3 downto 0);
    signal cout    : std_logic;
begin
    uut: entity work.adder_overflow_demo
        port map ( a_in => a, b_in => b, sum_out => s, carry_out => cout );

    stim: process
    begin
        -- Trường hợp 1: 3 + 4 = 7 (Không tràn)
        a <= "0011"; b <= "0100"; wait for 20 ns;
        -- Trường hợp 2: 12 + 5 = 17 = 16 + 1 (Tràn 4-bit, s = 1, cout = '1')
        a <= "1100"; b <= "0101"; wait for 20 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: Khi tổng vượt quá 15, tín hiệu carry_out sẽ nhảy lên '1'."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file adder_overflow_demo.vhd trong Quartus.",
        "2. Nhận xét về tài nguyên: Bộ cộng 4-bit này sẽ tiêu tốn khoảng 5 khối Logic Elements (LE) trên Cyclone IV.",
        "3. Chân gán: SW[3:0] cho a_in, SW[7:4] cho b_in, LEDR[3:0] cho sum_out, LEDR[4] cho carry_out."
      ],
      pinAssignments: [
        { signal: "a_in[0]", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "b_in[0]", pin: "PIN_AB27", ioStandard: "2.5 V", note: "SW4" },
        { signal: "carry_out", pin: "PIN_F18", ioStandard: "2.5 V", note: "LEDR4" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to a_in[0]\nset_location_assignment PIN_AB27 -to b_in[0]\nset_location_assignment PIN_F18 -to carry_out`
    },

    commonErrors: [
      {
        error: "Quên mở rộng bit khi cộng khiến kết quả bị cắt cụt (Truncation)",
        cause: "Cộng hai vector 4-bit gán trực tiếp vào vector 4-bit thì bit nhớ thứ 5 bị vứt bỏ mà không có cảnh báo.",
        fix: "Luôn mở rộng kích thước thêm 1 bit trước khi cộng nếu muốn lưu cờ nhớ Carry."
      },
      {
        error: "Dùng sai thư viện: use IEEE.STD_LOGIC_ARITH.ALL",
        cause: "Đây là thư viện lỗi thời của hãng Synopsys từ thập niên 90, dễ gây xung đột kiểu dữ liệu.",
        fix: "Luôn luôn sử dụng thư viện chuẩn quốc tế: use IEEE.NUMERIC_STD.ALL."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Chuyển đổi số nhị phân sang Hex",
        prompt: "Đổi chuỗi nhị phân 8-bit sau sang hệ Hex và hệ Thập phân: 10101111.",
        hint: "Tách làm 2 nhóm: 1010 (Hex là gì?) và 1111 (Hex là gì?).",
        solution: "1010 = A, 1111 = F -> Kết quả là 0xAF. Hệ thập phân: 10*16 + 15 = 175."
      },
      {
        level: "Vận dụng",
        title: "Tìm biểu diễn bù 2 của số âm -6 trong hệ 4-bit",
        prompt: "Viết mã nhị phân 4-bit của số -6 theo phương pháp bù 2.",
        hint: "+6 là 0110. Đảo bit thành 1001 rồi cộng thêm 1.",
        solution: "0110 -> Đảo bit = 1001 -> Cộng 1 = 1010. Vậy -6 được biểu diễn là 1010."
      },
      {
        level: "Thử thách",
        title: "Tính dải giá trị của bus N-bit",
        prompt: "Một bộ đếm thời gian trên FPGA cần đếm từ 0 đến 50,000,000 (xung nhịp 1 giây của thạch anh 50MHz). Hỏi cần tối thiểu một bus bao nhiêu bit?",
        hint: "Tìm số nguyên N nhỏ nhất sao cho 2^N >= 50,000,000.",
        solution: "2^25 = 33,554,432 (chưa đủ). 2^26 = 67,108,864 (đã đủ chứa 50 triệu). Vậy cần tối thiểu 26 bit (vector từ 25 downto 0)!"
      }
    ],

    quiz: [
      {
        question: "Số nhị phân '1111' trong biểu diễn bù 2 (số có dấu 4-bit) mang giá trị thập phân là bao nhiêu?",
        options: [
          "-1",
          "-7",
          "15",
          "-15"
        ],
        answerIndex: 0,
        explanation: "Trong hệ bù 2, chuỗi tất cả các bit bằng 1 (1111) luôn biểu diễn số -1 (vì 1111 + 0001 = 0000 sau khi bỏ bit nhớ)."
      },
      {
        question: "Giá trị Hex 0x3F khi đổi sang nhị phân 8-bit sẽ là chuỗi nào?",
        options: [
          "0011 1111",
          "0011 1110",
          "0100 1111",
          "0011 0101"
        ],
        answerIndex: 0,
        explanation: "Chữ số '3' = 0011, chữ số 'F' = 1111. Ghép lại ta được 0011 1111."
      },
      {
        question: "Với bus tín hiệu 4-bit không dấu, giá trị thập phân lớn nhất có thể biểu diễn được là bao nhiêu?",
        options: [
          "7",
          "8",
          "15",
          "16"
        ],
        answerIndex: 2,
        explanation: "Công thức dải giá trị N-bit không dấu là từ 0 đến 2^N - 1. Với N = 4: 2^4 - 1 = 16 - 1 = 15 ('1111')."
      },
      {
        question: "Tại sao phương pháp số bù 2 (Two's Complement) lại được áp dụng phổ biến trong toàn bộ ngành vi mạch số?",
        options: [
          "Vì nó giúp tiết kiệm chân chip FPGA",
          "Vì nó cho phép thực hiện phép trừ thông qua bộ cộng nhị phân thông thường",
          "Vì nó chỉ dùng được với ngôn ngữ VHDL",
          "Vì nó loại bỏ hoàn toàn hiện tượng tràn số"
        ],
        answerIndex: 1,
        explanation: "Bù 2 biến phép trừ A - B thành phép cộng A + (-B), giúp phần cứng chỉ cần một mạch cộng duy nhất, tiết kiệm diện tích bán dẫn đáng kể."
      }
    ],

    summary: [
      "Mọi dữ liệu trên FPGA đều được xây dựng từ bit ('0' = 0V, '1' = 2.5V/3.3V).",
      "Gom 4 bit nhị phân thành 1 chữ số Hex giúp việc đọc và gán chân cho DE2-115 gọn gàng hơn rất nhiều.",
      "Số âm bù 2 = Đảo tất cả các bit rồi cộng 1. Chuỗi '1111' luôn đại diện cho -1.",
      "Dải giá trị N-bit: Không dấu là 0 đến 2^N - 1; Có dấu là -2^(N-1) đến +2^(N-1) - 1.",
      "Khi cộng trừ nhị phân, luôn chú ý bit cờ nhớ Carry và cờ tràn Overflow để tránh sai số."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW2", "SW3"],
      activeOutputs: ["LEDR0", "LEDR1", "LEDR2", "LEDR3"],
      logicEvaluator: function(inputs) {
        return {
          LEDR0: inputs.SW0,
          LEDR1: inputs.SW1,
          LEDR2: inputs.SW2,
          LEDR3: inputs.SW3
        };
      }
    }
  },

  // ========================================================================
  // BÀI 0.3
  // ========================================================================
  {
    id: "ch0-b3",
    chapterId: "ch0",
    order: 3,
    title: "Đại số Boolean, Bảng chân trị và các cổng logic cơ bản",
    subtitle: "7 viên gạch nguyên tử cấu tạo nên thế giới số: AND, OR, NOT, NAND, NOR, XOR, XNOR",
    badge: "Cổng logic & Boolean",
    estimatedMinutes: 25,
    hardwareFocus: ["Cổng logic cơ bản", "Bảng chân trị"],

    objectives: [
      "Nắm vững ký hiệu, bảng chân trị và hàm Boolean của 7 cổng logic cơ bản.",
      "Hiểu tính phổ quát (Universality) của cổng NAND và NOR: Khả năng xây dựng mọi mạch số chỉ từ cổng NAND.",
      "Vận dụng định lý De Morgan để chuyển đổi qua lại giữa các biểu thức logic.",
      "Viết được mã VHDL mô tả các cổng logic bằng toán tử chuẩn của IEEE 1164."
    ],

    theory: {
      why: "Tất cả các siêu máy tính, điện thoại thông minh hay chip FPGA Cyclone IV dù phức tạp đến đâu, về bản chất vật lý cũng chỉ là hàng triệu cổng logic cơ bản kết hợp lại. Muốn làm chủ thiết kế vi mạch, bạn phải nắm trong lòng bàn tay hành vi của 7 cổng logic này.",
      how: "Mỗi cổng logic là một khối mạch điện nhận một hoặc nhiều ngõ vào logic (0 hoặc 1) và tạo ra một ngõ ra duy nhất theo quy tắc toán học Boolean định sẵn:\n- AND: Ngõ ra bằng '1' KHI VÀ CHỈ KHI TẤT CẢ các ngõ vào bằng '1'.\n- OR: Ngõ ra bằng '1' khi CÓ ÍT NHẤT MỘT ngõ vào bằng '1'.\n- NOT: Đảo ngược trạng thái logic (0 thành 1, 1 thành 0).\n- XOR (Exclusive OR): Ngõ ra bằng '1' khi hai ngõ vào KHÁC NHAU (so sánh bất đẳng thức).\n- XNOR: Ngõ ra bằng '1' khi hai ngõ vào GIỐNG NHAU (mạch so sánh bằng).",
      sections: [
        {
          heading: "1. Bảng tóm tắt hoạt động 7 cổng logic",
          content: "Hãy quan sát bảng chân trị 2 ngõ vào bên dưới. Đây là nền tảng cốt lõi của mọi mạch tổ hợp mà bạn sẽ học ở Chương 3.",
          callout: {
            type: "tip",
            title: "Mẹo nhớ cổng XOR",
            text: "XOR là 'hoặc loại trừ': Chỉ đúng khi một trong hai đúng, nhưng sai nếu cả hai cùng đúng!"
          }
        },
        {
          heading: "2. Định lý De Morgan sống còn",
          content: "Định lý De Morgan là công cụ tối thượng để tối giản phần cứng:\n- NOT(A and B) = (NOT A) or (NOT B)\n- NOT(A or B) = (NOT A) and (NOT B)\n\nNhờ định lý này, kỹ sư có thể biến đổi các biểu thức phức tạp để dùng chung một loại cổng logic (như NAND), giúp giảm diện tích và giá thành sản xuất chip.",
          callout: {
            type: "info",
            title: "Tính phổ quát của NAND",
            text: "Bạn có thể tạo ra cổng NOT, AND, OR từ duy nhất các cổng NAND!"
          }
        }
      ],
      truthTable: {
        headers: ["Ngõ vào A", "Ngõ vào B", "AND", "OR", "XOR", "NAND", "NOR", "XNOR"],
        rows: [
          ["0", "0", "0", "0", "0", "1", "1", "1"],
          ["0", "1", "0", "1", "1", "1", "0", "0"],
          ["1", "0", "0", "1", "1", "1", "0", "0"],
          ["1", "1", "1", "1", "0", "0", "0", "1"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 200" class="circuit-svg">
      <!-- Cổng AND -->
      <g transform="translate(40, 40)">
        <path d="M 30 10 L 60 10 A 25 25 0 0 1 60 60 L 30 60 Z" class="gate-body"/>
        <line x1="10" y1="25" x2="30" y2="25" class="wire"/>
        <line x1="10" y1="45" x2="30" y2="45" class="wire"/>
        <line x1="85" y1="35" x2="110" y2="35" class="wire"/>
        <text x="50" y="75" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="monospace">AND</text>
      </g>
      <!-- Cổng OR -->
      <g transform="translate(180, 40)">
        <path d="M 30 10 Q 50 35 30 60 Q 65 60 85 35 Q 65 10 30 10 Z" class="gate-body"/>
        <line x1="10" y1="22" x2="38" y2="22" class="wire"/>
        <line x1="10" y1="48" x2="38" y2="48" class="wire"/>
        <line x1="85" y1="35" x2="110" y2="35" class="wire"/>
        <text x="55" y="75" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="monospace">OR</text>
      </g>
      <!-- Cổng NOT -->
      <g transform="translate(320, 40)">
        <polygon points="30,15 70,35 30,55" class="gate-body"/>
        <circle cx="75" cy="35" r="5" class="gate-body"/>
        <line x1="10" y1="35" x2="30" y2="35" class="wire"/>
        <line x1="80" y1="35" x2="105" y2="35" class="wire"/>
        <text x="55" y="75" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="monospace">NOT</text>
      </g>
      <!-- Cổng XOR -->
      <g transform="translate(460, 40)">
        <path d="M 23 10 Q 43 35 23 60" fill="none" stroke="#38bdf8" stroke-width="2"/>
        <path d="M 30 10 Q 50 35 30 60 Q 65 60 85 35 Q 65 10 30 10 Z" class="gate-body"/>
        <line x1="10" y1="22" x2="38" y2="22" class="wire"/>
        <line x1="10" y1="48" x2="38" y2="48" class="wire"/>
        <line x1="85" y1="35" x2="110" y2="35" class="wire"/>
        <text x="55" y="75" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="monospace">XOR</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "logic_gates_all",
      circuitType: "combinational",
      typeExplanation: "Mô tả đồng thời 7 cổng logic cơ bản. Tất cả các cổng đều được tổng hợp thành mạch phần cứng song song hoàn toàn.",
      code: `--------------------------------------------------------------------------------
-- Tên file: logic_gates_all.vhd
-- Minh họa 7 cổng logic cơ bản trong ngôn ngữ VHDL
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity logic_gates_all is
    port (
        a      : in  std_logic; -- Ngõ vào A (SW0)
        b      : in  std_logic; -- Ngõ vào B (SW1)
        y_and  : out std_logic; -- Cổng AND
        y_or   : out std_logic; -- Cổng OR
        y_not  : out std_logic; -- Cổng NOT (đảo của A)
        y_nand : out std_logic; -- Cổng NAND
        y_nor  : out std_logic; -- Cổng NOR
        y_xor  : out std_logic; -- Cổng XOR
        y_xnor : out std_logic  -- Cổng XNOR
    );
end entity logic_gates_all;

architecture rtl of logic_gates_all is
begin
    -- Các toán tử Boolean chuẩn được tích hợp sẵn trong thư viện std_logic_1164
    y_and  <= a and b;
    y_or   <= a or  b;
    y_not  <= not a;
    y_nand <= a nand b;
    y_nor  <= a nor  b;
    y_xor  <= a xor  b;
    y_xnor <= a xnor b;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_logic_gates_all",
      code: `--------------------------------------------------------------------------------
-- Testbench quét toàn bộ 4 trường hợp bảng chân trị
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_logic_gates_all is
end entity tb_logic_gates_all;

architecture sim of tb_logic_gates_all is
    signal a, b : std_logic := '0';
    signal y_and, y_or, y_not, y_nand, y_nor, y_xor, y_xnor : std_logic;
begin
    uut: entity work.logic_gates_all
        port map (
            a => a, b => b,
            y_and => y_and, y_or => y_or, y_not => y_not,
            y_nand => y_nand, y_nor => y_nor, y_xor => y_xor, y_xnor => y_xnor
        );

    stim_proc: process
    begin
        -- Quét cả 4 trạng thái
        a <= '0'; b <= '0'; wait for 20 ns;
        a <= '0'; b <= '1'; wait for 20 ns;
        a <= '1'; b <= '0'; wait for 20 ns;
        a <= '1'; b <= '1'; wait for 20 ns;
        wait;
    end process;
end architecture sim;`,
      instructions: "Chạy mô phỏng và đối chiếu dạng sóng của từng cổng ngõ ra với Bảng chân trị lý thuyết."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file logic_gates_all.vhd trong Quartus Prime 20.1.",
        "2. Chạy Analysis & Elaboration (Ctrl+K).",
        "3. Gán chân vào Pin Planner: SW0 (a), SW1 (b), LEDR0 đến LEDR6 lần lượt cho 7 ngõ ra."
      ],
      pinAssignments: [
        { signal: "a", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "b", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1" },
        { signal: "y_and", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" },
        { signal: "y_or", pin: "PIN_F19", ioStandard: "2.5 V", note: "LEDR1" },
        { signal: "y_xor", pin: "PIN_E19", ioStandard: "2.5 V", note: "LEDR2" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to a\nset_location_assignment PIN_AC28 -to b\nset_location_assignment PIN_G19 -to y_and\nset_location_assignment PIN_F19 -to y_or\nset_location_assignment PIN_E19 -to y_xor`
    },

    commonErrors: [
      {
        error: "Quên dấu ngoặc đơn khi kết hợp nhiều toán tử: a and b or c",
        cause: "Trong chuẩn VHDL-93, các toán tử Boolean không có độ ưu tiên mặc định rõ ràng như trong C.",
        fix: "Luôn luôn dùng dấu ngoặc đơn tường minh: (a and b) or c."
      },
      {
        error: "Nhầm lẫn giữa toán tử gán (<=) và toán tử so sánh nhỏ hơn hoặc bằng (<=)",
        cause: "Cùng một ký tự <= nhưng mang 2 ý nghĩa tùy ngữ cảnh: trong câu lệnh gán nó là mũi tên gán tín hiệu, trong biểu thức if nó là phép so sánh.",
        fix: "Quan sát ngữ cảnh câu lệnh để tránh nhầm lẫn."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Tạo cổng AND 3 ngõ vào",
        prompt: "Viết biểu thức VHDL cho cổng AND có 3 ngõ vào a, b, c.",
        hint: "Dùng toán tử lồng: y <= a and b and c;",
        solution: "y <= a and b and c;"
      },
      {
        level: "Vận dụng",
        title: "Tạo mạch so sánh bằng 2-bit",
        prompt: "Cho 2 tín hiệu a và b (mỗi tín hiệu 1 bit). Dùng cổng XNOR để tạo ngõ ra eq bằng '1' khi a bằng b.",
        hint: "Cổng XNOR cho ngõ ra bằng '1' khi 2 ngõ vào giống nhau.",
        solution: "eq <= a xnor b; -- Hoặc eq <= not (a xor b);"
      },
      {
        level: "Thử thách",
        title: "Chứng minh tính phổ quát của NAND bằng VHDL",
        prompt: "Viết kiến trúc tạo cổng OR từ 3 cổng NAND sử dụng định lý De Morgan: a or b = (not a) nand (not b).",
        hint: "Tạo tín hiệu nội: not_a <= a nand a; not_b <= b nand b; sau đó nối vào cổng NAND thứ 3.",
        solution: "signal not_a, not_b : std_logic;\nbegin\n  not_a <= a nand a;\n  not_b <= b nand b;\n  y_or  <= not_a nand not_b;\nend architecture;"
      }
    ],

    quiz: [
      {
        question: "Cổng logic nào sẽ cho ngõ ra mức '1' khi hai ngõ vào KHÁC NHAU (một bên 0, một bên 1)?",
        options: [
          "Cổng AND",
          "Cổng XOR",
          "Cổng NOR",
          "Cổng XNOR"
        ],
        answerIndex: 1,
        explanation: "Cổng XOR (Exclusive OR) có bảng chân trị: 0 XOR 1 = 1, 1 XOR 0 = 1, còn hai ngõ vào giống nhau sẽ cho ra 0."
      },
      {
        question: "Theo định lý De Morgan, biểu thức NOT(A OR B) tương đương với biểu thức nào?",
        options: [
          "(NOT A) AND (NOT B)",
          "(NOT A) OR (NOT B)",
          "A AND B",
          "NOT (A AND B)"
        ],
        answerIndex: 0,
        explanation: "Định lý De Morgan thứ hai phát biểu rằng: Phủ định của một tổng bằng tích các phủ định: NOT(A OR B) = (NOT A) AND (NOT B)."
      },
      {
        question: "Cổng nào sau đây được gọi là 'Cổng phổ quát' (Universal Gate) có thể dùng để chế tạo mọi cổng logic khác?",
        options: [
          "Cổng AND và Cổng OR",
          "Cổng NAND và Cổng NOR",
          "Cổng XOR và Cổng NOT",
          "Chỉ có cổng NOT"
        ],
        answerIndex: 1,
        explanation: "Cổng NAND và NOR là hai cổng phổ quát trong kỹ thuật số. Mọi hàm Boolean đều có thể hiện thực hóa hoàn toàn chỉ bằng cổng NAND hoặc chỉ bằng cổng NOR."
      },
      {
        question: "Trong VHDL, biểu thức 'y <= a and b or c;' có hợp lệ theo chuẩn VHDL không?",
        options: [
          "Hợp lệ hoàn toàn, Quartus tự ưu tiên AND trước",
          "Không hợp lệ hoặc gây cảnh báo nghiêm trọng vì VHDL bắt buộc phải dùng ngoặc đơn rõ ràng như (a and b) or c",
          "Chỉ hợp lệ nếu có xung clock",
          "Sẽ tự động chuyển thành mạch cộng"
        ],
        answerIndex: 1,
        explanation: "Chuẩn VHDL yêu cầu phải nhóm các toán tử logic bằng dấu ngoặc đơn tường minh như (a and b) or c để tránh hiểu nhầm thứ tự ưu tiên."
      }
    ],

    summary: [
      "7 cổng logic cơ bản là hạt nhân nguyên tử của mọi kiến trúc vi mạch số.",
      "XOR so sánh khác nhau (bất đẳng thức), XNOR so sánh giống nhau (bằng nhau).",
      "NAND và NOR là các cổng logic phổ quát có thể tự tạo ra tất cả các cổng còn lại.",
      "Định lý De Morgan giúp tối giản biểu thức và tối ưu hóa diện tích phần cứng.",
      "Luôn dùng dấu ngoặc đơn khi kết hợp nhiều toán tử logic trong VHDL."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1"],
      activeOutputs: ["LEDR0", "LEDR1", "LEDR2", "LEDR3"],
      logicEvaluator: function(inputs) {
        return {
          LEDR0: inputs.SW0 && inputs.SW1 ? 1 : 0,  // AND
          LEDR1: inputs.SW0 || inputs.SW1 ? 1 : 0,  // OR
          LEDR2: inputs.SW0 !== inputs.SW1 ? 1 : 0, // XOR
          LEDR3: !(inputs.SW0 && inputs.SW1) ? 1 : 0 // NAND
        };
      }
    }
  },

  // ========================================================================
  // BÀI 0.4
  // ========================================================================
  {
    id: "ch0-b4",
    chapterId: "ch0",
    order: 4,
    title: "Tối thiểu hóa hàm logic với bìa Karnaugh (K-map)",
    subtitle: "Tư duy tối ưu hóa diện tích và tiết kiệm cổng logic trong thiết kế phần cứng",
    badge: "Tối ưu hóa phần cứng",
    estimatedMinutes: 25,
    hardwareFocus: ["LUT trong FPGA", "Tối ưu diện tích"],

    objectives: [
      "Hiểu tại sao phải tối thiểu hóa biểu thức logic trong thiết kế vi mạch.",
      "Thành thạo phương pháp lập và khoanh nhóm trên bìa Karnaugh 2, 3 và 4 biến.",
      "Nắm vững quy tắc khoanh nhóm (số lượng ô 2^k, liền kề theo mã Gray).",
      "Hiểu cách bộ tổng hợp Quartus tự động tối ưu hóa hàm logic thành các bảng tra LUT (Look-Up Table)."
    ],

    theory: {
      why: "Trong thiết kế vi mạch chuyên nghiệp, một hàm logic chưa tối ưu có thể tốn 20 cổng logic, sinh nhiều nhiệt lượng và gây trễ đường truyền. Bằng cách tối thiểu hóa hàm số, bạn có thể giảm xuống chỉ còn 3 cổng logic! Ít linh kiện hơn = chip nhỏ hơn = chạy nhanh hơn = tiết kiệm điện năng hơn.",
      how: "Bìa Karnaugh (K-map) là một bảng biểu diễn hai chiều sắp xếp theo mã Gray (các ô liền kề chỉ khác nhau duy nhất 1 bit). Nhờ sự sắp xếp này, khi gom các ô có giá trị '1' liền kề thành nhóm có kích thước lũy thừa của 2 (1, 2, 4, 8, 16 ô), biến số bị đổi trạng thái sẽ tự động bị triệt tiêu!",
      sections: [
        {
          heading: "1. Quy tắc khoanh nhóm trên K-map",
          content: "- Kích thước nhóm BẮT BUỘC là lũy thừa của 2: 1, 2, 4, 8, 16 ô.\n- Nhóm càng lớn thì biểu thức rút gọn càng ngắn (ít biến).\n- Được phép trùm nhóm lên nhau và khoanh vòng qua mép bảng (mép trái liền kề mép phải, mép trên liền kề mép dưới).\n- Mục tiêu: Gom TẤT CẢ các số '1' với số lượng nhóm ÍT NHẤT và kích thước nhóm LỚN NHẤT.",
          callout: {
            type: "warning",
            title: "Lỗi phổ biến khi khoanh nhóm",
            text: "Tuyệt đối không khoanh nhóm có 3 ô hoặc 6 ô! Kích thước nhóm chỉ được phép là 1, 2, 4, 8, 16..."
          }
        },
        {
          heading: "2. FPGA xử lý hàm logic như thế nào?",
          content: "Khác với mạch rời dùng IC 74xx, chip FPGA Cyclone IV EP4CE115 không chứa các cổng AND/OR riêng rẽ. Thay vào đó, nó chứa các khối **LUT4 (Look-Up Table 4 ngõ vào)**. Mỗi LUT4 thực chất là một bộ nhớ RAM tĩnh 16-bit lưu bảng chân trị của bất kỳ hàm logic 4 biến nào. Do đó, Quartus sẽ tự động ánh xạ biểu thức tối giản của bạn vào các khối LUT này.",
          callout: {
            type: "info",
            title: "Vai trò của người kỹ sư",
            text: "Dù Quartus có thuật toán tối ưu hóa tự động rất mạnh, hiểu K-map giúp bạn viết code VHDL gọn gàng, tránh tạo ra cấu trúc mạch cồng kềnh khó tổng hợp."
          }
        }
      ],
      truthTable: {
        headers: ["A B \\ C", "C = 0", "C = 1", "Biến triệt tiêu sau khi khoanh"],
        rows: [
          ["00", "0", "1", "Nhóm 2 ô: C đổi trạng thái -> giữ nguyên A, B"],
          ["01", "1", "1", "Nhóm 2 ô này gom với hàng trên thành nhóm 4 ô"],
          ["11", "0", "0", "Ô giá trị 0 không khoanh"],
          ["10", "0", "0", "Ô giá trị 0 không khoanh"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Bìa K-map 3 biến minh họa khoanh nhóm -->
      <g transform="translate(100, 30)">
        <text x="60" y="-10" fill="#94a3b8" font-family="monospace" font-size="12">AB \\ C</text>
        <rect x="50" y="10" width="160" height="160" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <!-- Đường chia lưới -->
        <line x1="130" y1="10" x2="130" y2="170" stroke="#1e293b" stroke-width="1.5"/>
        <line x1="50" y1="50" x2="210" y2="50" stroke="#1e293b" stroke-width="1.5"/>
        <line x1="50" y1="90" x2="210" y2="90" stroke="#1e293b" stroke-width="1.5"/>
        <line x1="50" y1="130" x2="210" y2="130" stroke="#1e293b" stroke-width="1.5"/>
        <!-- Nhãn cột C -->
        <text x="90" y="5" fill="#f59e0b" font-family="monospace" font-size="12" text-anchor="middle">0</text>
        <text x="170" y="5" fill="#f59e0b" font-family="monospace" font-size="12" text-anchor="middle">1</text>
        <!-- Nhãn hàng AB theo mã Gray -->
        <text x="35" y="35" fill="#38bdf8" font-family="monospace" font-size="11">00</text>
        <text x="35" y="75" fill="#38bdf8" font-family="monospace" font-size="11">01</text>
        <text x="35" y="115" fill="#38bdf8" font-family="monospace" font-size="11">11</text>
        <text x="35" y="155" fill="#38bdf8" font-family="monospace" font-size="11">10</text>
        <!-- Vòng khoanh nhóm 2 ô -->
        <rect x="135" y="15" width="70" height="70" rx="10" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" stroke-width="2"/>
        <text x="170" y="35" fill="#fff" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">1</text>
        <text x="170" y="75" fill="#fff" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">1</text>
      </g>
      <!-- Chú thích rút gọn -->
      <text x="360" y="80" fill="#94a3b8" font-family="sans-serif" font-size="13">Biểu thức ban đầu: F = A'B'C + A'BC</text>
      <text x="360" y="115" fill="#10b981" font-family="monospace" font-size="16" font-weight="bold">Sau khi rút gọn: F = A'C</text>
      <text x="360" y="145" fill="#cbd5e1" font-family="sans-serif" font-size="12">-> Giảm từ 2 cổng AND + 1 cổng OR xuống chỉ còn 1 cổng AND!</text>
    </svg>`,

    vhdlCode: {
      entityName: "kmap_optimized",
      circuitType: "combinational",
      typeExplanation: "So sánh biểu thức chưa rút gọn và biểu thức đã tối ưu qua K-map. Cả 2 đều cho cùng bảng chân trị nhưng biểu thức tối ưu tiêu thụ ít diện tích hơn.",
      code: `--------------------------------------------------------------------------------
-- Tên file: kmap_optimized.vhd
-- Minh họa sự khác biệt giữa biểu thức thô và biểu thức tối ưu qua K-map
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity kmap_optimized is
    port (
        a, b, c : in  std_logic;
        f_raw   : out std_logic; -- Chưa tối ưu: (not a and not b and c) or (not a and b and c)
        f_opt   : out std_logic  -- Đã tối ưu bằng K-map: not a and c
    );
end entity kmap_optimized;

architecture rtl of kmap_optimized is
begin
    -- Biểu thức chưa tối ưu (tốn nhiều cổng logic)
    f_raw <= (not a and not b and c) or (not a and b and c);

    -- Biểu thức tối ưu sau khi khoanh nhóm K-map (chỉ tốn 1 cổng AND)
    f_opt <= (not a) and c;
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_kmap_optimized",
      code: `--------------------------------------------------------------------------------
-- Testbench chứng minh f_raw và f_opt luôn giống nhau 100%
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_kmap_optimized is
end entity tb_kmap_optimized;

architecture sim of tb_kmap_optimized is
    signal a, b, c, f_raw, f_opt : std_logic;
begin
    uut: entity work.kmap_optimized
        port map ( a => a, b => b, c => c, f_raw => f_raw, f_opt => f_opt );

    stim: process
    begin
        -- Thử các trạng thái
        a <= '0'; b <= '0'; c <= '1'; wait for 20 ns; -- f_raw = 1, f_opt = 1
        a <= '0'; b <= '1'; c <= '1'; wait for 20 ns; -- f_raw = 1, f_opt = 1
        a <= '1'; b <= '0'; c <= '1'; wait for 20 ns; -- f_raw = 0, f_opt = 0
        wait;
    end process;
end architecture sim;`,
      instructions: "Quan sát trong ModelSim: Dạng sóng f_raw và f_opt hoàn toàn trùng khít nhau ở mọi thời điểm."
    },

    quartusGuide: {
      steps: [
        "1. Tạo file kmap_optimized.vhd và compile trên Quartus 20.1.",
        "2. Mở Tools -> Netlist Viewers -> Technology Map Viewer.",
        "3. Quan sát cách Quartus gom biểu thức vào 1 khối LUT duy nhất của Cyclone IV."
      ],
      pinAssignments: [
        { signal: "a", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "b", pin: "PIN_AC28", ioStandard: "2.5 V", note: "SW1" },
        { signal: "c", pin: "PIN_AC27", ioStandard: "2.5 V", note: "SW2" },
        { signal: "f_opt", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_AB28 -to a\nset_location_assignment PIN_AC28 -to b\nset_location_assignment PIN_AC27 -to c\nset_location_assignment PIN_G19 -to f_opt`
    },

    commonErrors: [
      {
        error: "Khoanh nhóm có kích thước không phải lũy thừa của 2 (ví dụ khoanh 3 ô hoặc 6 ô)",
        cause: "Không hiểu nguyên lý mã Gray của K-map: Chỉ khi kích thước là 2^k thì các biến đối nghịch mới triệt tiêu hoàn toàn.",
        fix: "Chỉ khoanh nhóm có số ô là 1, 2, 4, 8 hoặc 16."
      },
      {
        error: "Sắp xếp hàng/cột của K-map theo thứ tự nhị phân 00, 01, 10, 11",
        cause: "Sai thứ tự mã Gray. Giữa 01 và 10 có tới 2 bit bị đổi cùng lúc, làm mất tính liền kề.",
        fix: "Thứ tự bắt buộc của K-map phải là: 00 -> 01 -> 11 -> 10."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Xác định kích thước nhóm hợp lệ",
        prompt: "Trong các số lượng ô sau, số lượng nào ĐƯỢC PHÉP khoanh thành một nhóm trên K-map: 2, 3, 4, 6, 8, 12, 16?",
        hint: "Nhóm hợp lệ phải có dạng 2^k.",
        solution: "Các nhóm hợp lệ: 2 (2^1), 4 (2^2), 8 (2^3), 16 (2^4). Các số 3, 6, 12 không hợp lệ."
      },
      {
        level: "Vận dụng",
        title: "Tối giản hàm F(A, B) = A'B + AB",
        prompt: "Dùng đại số Boolean hoặc K-map 2 biến để tối giản hàm trên.",
        hint: "Đặt B làm thừa số chung: F = B(A' + A).",
        solution: "A' + A = 1, do đó F = B. Biểu thức rút gọn chỉ còn lại đúng tín hiệu B!"
      },
      {
        level: "Thử thách",
        title: "Khái niệm 'Don't Care' (X) trong K-map",
        prompt: "Trạng thái Don't Care (ký hiệu X trong bảng chân trị) có ý nghĩa gì và khi khoanh K-map ta nên tận dụng nó như thế nào?",
        hint: "Don't Care là trạng thái ngõ vào không bao giờ xảy ra trong thực tế.",
        solution: "Khi khoanh K-map, ta có thể coi ô 'X' là 1 nếu việc đó giúp mở rộng kích thước nhóm lên gấp đôi (giảm biến), hoặc coi là 0 nếu không cần gom, từ đó đạt được mạch tối giản nhất."
      }
    ],

    quiz: [
      {
        question: "Tại sao thứ tự hàng/cột trong bìa Karnaugh lại là 00, 01, 11, 10 chứ không phải 00, 01, 10, 11?",
        options: [
          "Vì tuân thủ quy tắc mã Gray: hai ô liền kề chỉ được phép khác nhau đúng 1 bit",
          "Do lỗi in ấn lịch sử từ thời phát minh",
          "Để phù hợp với kiến trúc chip Intel",
          "Để dễ vẽ hình vuông hơn"
        ],
        answerIndex: 0,
        explanation: "Mã Gray đảm bảo hai ô kế cận chỉ khác biệt đúng 1 bit, nhờ đó khi gom 2 ô lại thì biến duy nhất thay đổi đó sẽ bị triệt tiêu theo định lý A + A' = 1."
      },
      {
        question: "Một nhóm gồm 4 ô số '1' trên bìa K-map 4 biến sẽ giúp triệt tiêu bao nhiêu biến số trong biểu thức?",
        options: [
          "1 biến",
          "2 biến",
          "3 biến",
          "4 biến"
        ],
        answerIndex: 1,
        explanation: "Công thức: Nhóm gồm 2^k ô sẽ triệt tiêu được đúng k biến. Với nhóm 4 ô = 2^2, ta triệt tiêu được 2 biến, biểu thức còn lại 2 biến."
      },
      {
        question: "Khối phần cứng cơ bản trong FPGA Cyclone IV dùng để hiện thực hóa bảng chân trị của hàm tổ hợp được gọi là gì?",
        options: [
          "ALU",
          "LUT (Look-Up Table)",
          "DRAM",
          "Cổng NAND rời"
        ],
        answerIndex: 1,
        explanation: "FPGA sử dụng các bảng tra Look-Up Table (LUT), bản chất là SRAM cấu hình lưu bảng chân trị của các hàm logic."
      },
      {
        question: "Mục tiêu tối thượng của việc tối thiểu hóa hàm logic là gì?",
        options: [
          "Giúp chip hoạt động ở nhiệt độ cao hơn",
          "Giảm diện tích cổng logic, giảm độ trễ truyền lan tín hiệu và tiết kiệm năng lượng tiêu thụ",
          "Làm cho file VHDL có dung lượng lớn hơn",
          "Tăng số lượng chân I/O trên kit"
        ],
        answerIndex: 1,
        explanation: "Mạch càng ít cổng logic thì diện tích silicon càng nhỏ, đường dây càng ngắn dẫn đến độ trễ giảm, chip chạy được tần số cao hơn và ít hao pin."
      }
    ],

    summary: [
      "Tối thiểu hóa hàm logic giúp giảm thiểu số cổng, giảm độ trễ và tiết kiệm tài nguyên FPGA.",
      "Bìa K-map sắp xếp theo mã Gray (00, 01, 11, 10) để các ô liền kề chỉ khác nhau 1 bit.",
      "Chỉ khoanh nhóm có kích thước lũy thừa của 2: 1, 2, 4, 8, 16 ô. Nhóm càng to rút gọn càng mạnh.",
      "Trên Cyclone IV, Quartus tự động tổng hợp các hàm logic thành các khối LUT4.",
      "Nắm vững K-map giúp bạn xây dựng tư duy mạch tối ưu ngay từ khi viết mã VHDL."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0", "SW1", "SW2"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        // f_opt = (not a) and c (SW0 = a, SW2 = c)
        return {
          LEDR0: !inputs.SW0 && inputs.SW2 ? 1 : 0
        };
      }
    }
  },

  // ========================================================================
  // BÀI 0.5
  // ========================================================================
  {
    id: "ch0-b5",
    chapterId: "ch0",
    order: 5,
    title: "Quy trình thiết kế FPGA chuẩn công nghiệp (FPGA Design Flow)",
    subtitle: "Từ ý tưởng -> VHDL RTL -> Mô phỏng ModelSim -> Tổng hợp Quartus -> Gán chân -> Nạp Bitstream",
    badge: "Quy trình công nghiệp",
    estimatedMinutes: 25,
    hardwareFocus: ["Chu trình thiết kế", "Mô phỏng vs Phần cứng"],

    objectives: [
      "Nắm vững 6 bước trong quy trình thiết kế FPGA chuẩn công nghiệp.",
      "Hiểu rõ sự khác biệt giữa mô phỏng phần mềm (ModelSim) và chạy thực tế trên chip (Quartus Programmer).",
      "Biết vai trò của file cấu hình Bitstream (.sof và .jic) trên kit DE2-115.",
      "Hình thành thói quen kiểm tra lỗi logic bằng Testbench trước khi nạp lên phần cứng thật."
    ],

    theory: {
      why: "Tại sao không nạp thẳng mã nguồn vào FPGA để thử nghiệm mà phải qua nhiều bước phức tạp như vậy? Trong thiết kế chip, việc sửa một lỗi logic sau khi đã sản xuất có thể làm công ty thiệt hại hàng triệu USD. Quy trình thiết kế FPGA chuẩn đảm bảo mọi lỗi đều được phát hiện và triệt tiêu ngay từ giai đoạn mô phỏng ảo.",
      how: "Quy trình gồm 6 bước khép kín:\n1. **Đặc tả yêu cầu (Specification):** Xác định ngõ vào, ngõ ra, bảng chân trị, xung nhịp.\n2. **Mô tả RTL VHDL (Design Entry):** Viết code VHDL chuẩn IEEE.\n3. **Mô phỏng chức năng (Functional Simulation với ModelSim):** Viết Testbench kiểm tra dạng sóng mà KHÔNG cần cắm kit.\n4. **Tổng hợp luận lý (Synthesis với Quartus):** Chuyển mã VHDL thành các cổng logic và LUT của Cyclone IV.\n5. **Gán chân & Định tuyến (Place & Route / Fitter):** Chọn chân vật lý (PIN_xxx) và nối dây nội bộ trong chip.\n6. **Nạp chip & Kiểm thử thực tế (Programming & Verification):** Nạp file .sof qua cổng USB-Blaster và kiểm tra trên kit DE2-115.",
      sections: [
        {
          heading: "1. Mô phỏng (ModelSim) vs Nạp chip (Quartus)",
          content: "Rất nhiều người mới thường bỏ qua bước mô phỏng ModelSim và nhảy thẳng vào nạp chip. Đây là sai lầm nghiêm trọng! Khi mạch không chạy, bạn sẽ không thể biết được lỗi nằm ở code VHDL, ở việc gán sai chân, hay do nút bấm trên kit bị lỏng.\n\nModelSim cho phép bạn 'nhìn xuyên thấu' vào từng dây dẫn tín hiệu bên trong chip tại từng pico-giây (ps).",
          callout: {
            type: "warning",
            title: "Khẩu hiệu kỹ sư FPGA",
            text: "'Nếu chưa mô phỏng đúng trên ModelSim, đừng bao giờ phí thời gian nạp lên kit!'"
          }
        },
        {
          heading: "2. Phân biệt file .SOF và .JIC trên DE2-115",
          content: "- **File .sof (SRAM Object File):** Nạp trực tiếp vào bộ nhớ SRAM của FPGA. Nạp rất nhanh (vài giây), dùng để debug thử nghiệm. Tuy nhiên, khi tắt công tắc nguồn trên kit, chương trình sẽ MẤT HẾT.\n- **File .jic (JTAG Indirect Configuration):** Nạp vào chip nhớ Flash EPCS64 bên cạnh FPGA. Khi bật nguồn lại, FPGA sẽ tự động load chương trình từ Flash vào để chạy vĩnh viễn.",
          callout: {
            type: "info",
            title: "Khuyên dùng khi học",
            text: "Trong suốt quá trình học, chúng ta sẽ chủ yếu nạp file .sof để thử nghiệm nhanh và bảo vệ tuổi thọ chip nhớ Flash."
          }
        }
      ],
      truthTable: {
        headers: ["Bước trong quy trình", "Công cụ phụ trách", "Tệp đầu ra", "Mục đích kiểm tra"],
        rows: [
          ["1. Viết code RTL", "Quartus Text Editor", ".vhd", "Mô tả hành vi mạch"],
          ["2. Mô phỏng chức năng", "ModelSim-Intel FPGA", ".vcd / Waveform", "Kiểm tra đúng sai logic bảng chân trị"],
          ["3. Tổng hợp (Synthesis)", "Quartus Analysis & Synthesis", ".netlist", "Kiểm tra lỗi cú pháp và suy diễn LUT"],
          ["4. Gán chân & Định tuyến", "Quartus Fitter / Pin Planner", ".qsf / .fit.rpt", "Kiểm tra giới hạn chân và thời gian (Timing)"],
          ["5. Nạp cấu hình", "Quartus Programmer", ".sof / .jic", "Chạy thực tế trên kit Terasic DE2-115"]
        ]
      }
    },

    diagramSvg: `<svg viewBox="0 0 640 220" class="circuit-svg">
      <!-- Sơ đồ chu trình 6 bước -->
      <g transform="translate(10, 40)">
        <rect x="10" y="20" width="80" height="50" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="50" y="45" fill="#38bdf8" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">1. Ý tưởng</text>
        <text x="50" y="60" fill="#94a3b8" font-size="9" text-anchor="middle">Spec</text>
        
        <path d="M 90 45 L 115 45" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        
        <rect x="115" y="20" width="85" height="50" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="157" y="45" fill="#38bdf8" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">2. Code VHDL</text>
        <text x="157" y="60" fill="#94a3b8" font-size="9" text-anchor="middle">.vhd</text>
        
        <path d="M 200 45 L 225 45" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        
        <rect x="225" y="20" width="95" height="50" rx="6" fill="#131c31" stroke="#f59e0b" stroke-width="2"/>
        <text x="272" y="45" fill="#f59e0b" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">3. ModelSim</text>
        <text x="272" y="60" fill="#94a3b8" font-size="9" text-anchor="middle">Testbench</text>
        
        <path d="M 320 45 L 345 45" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        
        <rect x="345" y="20" width="85" height="50" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="387" y="45" fill="#38bdf8" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">4. Tổng hợp</text>
        <text x="387" y="60" fill="#94a3b8" font-size="9" text-anchor="middle">Synthesis</text>
        
        <path d="M 430 45 L 455 45" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        
        <rect x="455" y="20" width="80" height="50" rx="6" fill="#131c31" stroke="#38bdf8" stroke-width="2"/>
        <text x="495" y="45" fill="#38bdf8" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">5. Gán chân</text>
        <text x="495" y="60" fill="#94a3b8" font-size="9" text-anchor="middle">.qsf</text>
        
        <path d="M 535 45 L 560 45" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
        
        <rect x="560" y="20" width="65" height="50" rx="6" fill="#10b981" stroke="#10b981" stroke-width="2"/>
        <text x="592" y="45" fill="#fff" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">6. Nạp</text>
        <text x="592" y="60" fill="#fff" font-size="9" text-anchor="middle">.sof</text>
        
        <!-- Vòng lặp feedback sửa lỗi -->
        <path d="M 272 70 L 272 110 L 157 110 L 157 70" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4" marker-end="url(#arrow)"/>
        <text x="215" y="125" fill="#ef4444" font-size="10" text-anchor="middle">Sửa code nếu mô phỏng sai</text>
      </g>
    </svg>`,

    vhdlCode: {
      entityName: "flow_template",
      circuitType: "combinational",
      typeExplanation: "Cấu trúc template chuẩn mực của một thiết kế VHDL sẵn sàng cho quy trình tổng hợp và gán chân trên Quartus.",
      code: `--------------------------------------------------------------------------------
-- Tên file: flow_template.vhd
-- Template chuẩn mực cho quy trình thiết kế FPGA
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity flow_template is
    port (
        clk      : in  std_logic; -- Chân xung nhịp 50 MHz (PIN_Y2)
        rst_n    : in  std_logic; -- Nút Reset tích cực mức thấp (PIN_M23 - KEY0)
        sw_in    : in  std_logic; -- Công tắc dữ liệu (PIN_AB28 - SW0)
        led_out  : out std_logic  -- Đèn báo ngõ ra (PIN_G19 - LEDR0)
    );
end entity flow_template;

architecture rtl of flow_template is
begin
    -- Mạch tổ hợp đơn giản nối công tắc ra đèn (khi không bị reset)
    led_out <= sw_in when rst_n = '1' else '0';
end architecture rtl;`
    },

    testbenchCode: {
      entityName: "tb_flow_template",
      code: `--------------------------------------------------------------------------------
-- Testbench mô phỏng kiểm tra chức năng trước khi nạp kit
--------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity tb_flow_template is
end entity tb_flow_template;

architecture sim of tb_flow_template is
    signal clk     : std_logic := '0';
    signal rst_n   : std_logic := '0';
    signal sw_in   : std_logic := '0';
    signal led_out : std_logic;
begin
    uut: entity work.flow_template
        port map ( clk => clk, rst_n => rst_n, sw_in => sw_in, led_out => led_out );

    -- Tạo xung clock 50 MHz (chu kỳ 20 ns)
    clk <= not clk after 10 ns;

    -- Kịch bản kiểm tra
    stim: process
    begin
        rst_n <= '0'; wait for 40 ns; -- Đang nhấn Reset
        rst_n <= '1'; wait for 20 ns; -- Nhả Reset
        sw_in <= '1'; wait for 40 ns; -- Bật công tắc -> led_out phải lên '1'
        sw_in <= '0'; wait for 40 ns; -- Tắt công tắc -> led_out phải về '0'
        wait;
    end process;
end architecture sim;`,
      instructions: "Chạy mô phỏng để đảm bảo tín hiệu rst_n hoạt động đúng trước khi gán vào KEY0 của kit DE2-115."
    },

    quartusGuide: {
      steps: [
        "1. Tạo Project trong Quartus Prime 20.1: Chọn device EP4CE115F29C7.",
        "2. Add file flow_template.vhd.",
        "3. Chạy Processing -> Start -> Start Analysis & Synthesis.",
        "4. Mở Assignments -> Pin Planner gán chân CLOCK_50, KEY0, SW0, LEDR0.",
        "5. Chạy Start Compilation để tạo file .sof.",
        "6. Mở Tools -> Programmer để nạp xuống kit."
      ],
      pinAssignments: [
        { signal: "clk", pin: "PIN_Y2", ioStandard: "3.3-V LVTTL", note: "CLOCK_50 (50 MHz thạch anh)" },
        { signal: "rst_n", pin: "PIN_M23", ioStandard: "2.5 V", note: "KEY0 (Active-Low)" },
        { signal: "sw_in", pin: "PIN_AB28", ioStandard: "2.5 V", note: "SW0" },
        { signal: "led_out", pin: "PIN_G19", ioStandard: "2.5 V", note: "LEDR0" }
      ],
      qsfSnippet: `set_location_assignment PIN_Y2 -to clk\nset_location_assignment PIN_M23 -to rst_n\nset_location_assignment PIN_AB28 -to sw_in\nset_location_assignment PIN_G19 -to led_out`
    },

    commonErrors: [
      {
        error: "Mạch mô phỏng trên ModelSim chạy đúng nhưng nạp lên kit đèn LED không sáng",
        cause: "Chưa gán chân trong Pin Planner hoặc gán sai mã số chân; chân I/O bị bỏ lơ (unassigned pin).",
        fix: "Kiểm tra file cấu hình .qsf và bảng Compilation Report mục Fitter -> Resource Section -> Input/Output Pins."
      },
      {
        error: "Tắt công tắc nguồn kit DE2-115 rồi bật lại thì chương trình bị biến mất",
        cause: "Nạp file .sof vào bộ nhớ SRAM (vốn là bộ nhớ tạm thời mất dữ liệu khi mất điện).",
        fix: "Đây là hành vi hoàn toàn bình thường khi debug. Muốn lưu vĩnh viễn cần chuyển sang file .jic nạp vào bộ nhớ Flash EPCS64."
      }
    ],

    exercises: [
      {
        level: "Cơ bản",
        title: "Xác định thứ tự các bước",
        prompt: "Sắp xếp lại đúng thứ tự quy trình thiết kế: (A) Gán chân, (B) Viết RTL VHDL, (C) Nạp file .sof, (D) Mô phỏng ModelSim, (E) Tổng hợp Synthesis.",
        hint: "Bắt đầu bằng viết code và mô phỏng trước.",
        solution: "Thứ tự đúng: (B) Viết RTL -> (D) Mô phỏng ModelSim -> (E) Tổng hợp Synthesis -> (A) Gán chân -> (C) Nạp file .sof."
      },
      {
        level: "Vận dụng",
        title: "Phân tích lợi ích của NativeLink trong Quartus",
        prompt: "Tính năng NativeLink giữa Quartus và ModelSim mang lại tiện ích gì cho kỹ sư?",
        hint: "Không cần phải mở ModelSim riêng và tự tạo thư viện thủ công.",
        solution: "NativeLink tự động biên dịch toàn bộ thư viện Cyclone IV, biên dịch code thiết kế và testbench, sau đó tự khởi động ModelSim và nạp dạng sóng chỉ với một cú nhấp chuột từ Quartus."
      },
      {
        level: "Thử thách",
        title: "Tại sao thời gian Fitter (Place & Route) lâu hơn thời gian Synthesis?",
        prompt: "Trong một dự án lớn, bước Fitter có thể mất 15-30 phút trong khi Synthesis chỉ mất 2 phút. Vì sao?",
        hint: "Fitter phải giải bài toán tối ưu hóa vị trí hàng ngàn khối LE và tìm đường đi dây tối ưu đảm bảo yêu cầu thời gian (Timing Closure).",
        solution: "Fitter giải bài toán NP-hard: sắp xếp hàng chục ngàn khối logic trên lưới silicon 2 chiều và định tuyến hàng trăm ngàn đường dây sao cho độ trễ truyền lan không vi phạm giới hạn chu kỳ xung nhịp (Timing Closure)."
      }
    ],

    quiz: [
      {
        question: "Bước nào trong quy trình thiết kế FPGA cho phép bạn quan sát dạng sóng từng nano-giây mà không cần phần cứng thật?",
        options: [
          "Mô phỏng chức năng trên ModelSim",
          "Gán chân trong Pin Planner",
          "Nạp file .sof bằng Quartus Programmer",
          "Vẽ mạch in PCB"
        ],
        answerIndex: 0,
        explanation: "ModelSim là trình mô phỏng kiểm chứng logic bằng Testbench, cho phép dựng lại toàn bộ giản đồ xung nhịp và sóng tín hiệu trên máy tính."
      },
      {
        question: "Khi bạn nạp file .sof vào kit DE2-115, dữ liệu cấu hình được ghi vào loại bộ nhớ nào trên FPGA?",
        options: [
          "Bộ nhớ SRAM nội (Mất dữ liệu khi tắt nguồn)",
          "Bộ nhớ Flash ngoài (Lưu vĩnh viễn)",
          "Thẻ nhớ SD Card",
          "Thanh ghi EEPROM"
        ],
        answerIndex: 0,
        explanation: "File .sof (SRAM Object File) nạp trực tiếp vào ô nhớ SRAM điều khiển của FPGA Cyclone IV. Bộ nhớ này sẽ mất hết cấu hình khi ngắt nguồn cấp."
      },
      {
        question: "Phần mềm Quartus Prime Lite đóng vai trò gì trong quy trình thiết kế?",
        options: [
          "Chỉ dùng để vẽ sơ đồ nguyên lý",
          "Là môi trường phát triển tích hợp (IDE) toàn diện: soạn thảo, tổng hợp, gán chân, phân tích timing và nạp chip",
          "Chỉ dùng để gõ văn bản tiếng Việt",
          "Là trình giả lập hệ điều hành Linux"
        ],
        answerIndex: 1,
        explanation: "Quartus Prime là công cụ EDA hoàn chỉnh của Intel FPGA, bao gồm trình biên dịch tổng hợp (Analysis & Synthesis), định tuyến (Fitter), phân tích thời gian (TimeQuest) và Programmer."
      },
      {
        question: "Điều gì sẽ xảy ra nếu bạn tổng hợp thành công code VHDL nhưng quên không gán chân (chưa phân định PIN_xxx)?",
        options: [
          "Quartus sẽ từ chối nạp chip",
          "Quartus sẽ tự động chọn các chân ngẫu nhiên, dẫn đến tín hiệu không ra đúng công tắc hay đèn LED mong muốn trên kit",
          "Kit DE2-115 sẽ phát ra tiếng chuông báo động",
          "Tất cả đèn LED đều sáng màu xanh"
        ],
        answerIndex: 1,
        explanation: "Nếu không gán chân, Quartus Fitter sẽ tự tiện gán cổng vào/ra vào bất kỳ chân I/O trống nào trên chip EP4CE115F29C7, khiến mạch không kết nối được với công tắc và đèn LED trên kit."
      }
    ],

    summary: [
      "Quy trình 6 bước chuẩn: Ý tưởng -> VHDL RTL -> Mô phỏng ModelSim -> Tổng hợp Quartus -> Gán chân .qsf -> Nạp Bitstream .sof.",
      "Mô phỏng trên ModelSim là bắt buộc để tìm và diệt lỗi logic trước khi nạp lên kit.",
      "File .sof nạp vào SRAM (dùng debug nhanh, tắt nguồn là mất); file .jic nạp vào Flash (lưu vĩnh viễn).",
      "Quartus chuyển đổi mã mô tả VHDL thành bản đồ đấu nối phần cứng vật lý trên chip Cyclone IV.",
      "Luôn kiểm tra bảng gán chân Pin Planner để đảm bảo các cổng I/O được nối đúng thiết bị ngoại vi trên DE2-115."
    ],

    interactiveSimulation: {
      type: "board",
      activeInputs: ["SW0"],
      activeOutputs: ["LEDR0"],
      logicEvaluator: function(inputs) {
        return {
          LEDR0: inputs.SW0 ? 1 : 0
        };
      }
    }
  }
];

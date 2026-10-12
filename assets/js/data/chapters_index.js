// ==========================================================================
// CHAPTERS_INDEX.JS - MỤC LỤC 10 CHƯƠNG LỘ TRÌNH VHDL & FPGA DE2-115
// ==========================================================================

window.VHDL_CHAPTERS_INDEX = [
  {
    id: "ch0",
    order: 0,
    title: "Chương 0 – Chuẩn bị nền tảng",
    subtitle: "Tư duy phần cứng, đại số Boolean, hệ nhị phân và quy trình thiết kế",
    badge: "Nền tảng",
    status: "ready",
    lessonsCount: 5
  },
  {
    id: "ch1",
    order: 1,
    title: "Chương 1 – Cài đặt và Chạy chương trình đầu tiên",
    subtitle: "Quartus 20.1, ModelSim, USB-Blaster và bài SW -> LEDR đầu tiên",
    badge: "Nhập môn",
    status: "ready",
    lessonsCount: 3
  },
  {
    id: "ch2",
    order: 2,
    title: "Chương 2 – Cú pháp VHDL căn bản",
    subtitle: "Entity, Architecture, Kiểu dữ liệu, Signal và Gán đồng thời",
    badge: "Cú pháp",
    status: "ready",
    lessonsCount: 6
  },
  {
    id: "ch3",
    order: 3,
    title: "Chương 3 – Mạch tổ hợp",
    subtitle: "Cổng logic, MUX, Decoder, Bộ cộng và Giải mã LED 7 thanh",
    badge: "Mạch tổ hợp",
    status: "ready",
    lessonsCount: 7
  },
  {
    id: "ch4",
    order: 4,
    title: "Chương 4 – Mạch tuần tự",
    subtitle: "Process, Flip-Flop, Thanh ghi, Bộ đếm và Chia xung 50 MHz",
    badge: "Mạch tuần tự",
    status: "ready",
    lessonsCount: 7
  },
  {
    id: "ch5",
    order: 5,
    title: "Chương 5 – Máy trạng thái hữu hạn (FSM)",
    subtitle: "Moore vs Mealy, Bộ phát hiện chuỗi, Đèn giao thông và Khung UART",
    badge: "FSM",
    status: "ready",
    lessonsCount: 5
  },
  {
    id: "ch6",
    order: 6,
    title: "Chương 6 – Mô phỏng và Kiểm chứng với ModelSim",
    subtitle: "Viết Testbench chuyên sâu, NativeLink, Scripting và Phân tích Waveform",
    badge: "Mô phỏng",
    status: "ready",
    lessonsCount: 5
  },
  {
    id: "ch7",
    order: 7,
    title: "Chương 7 – Làm việc với kit Terasic DE2-115",
    subtitle: "Pin Planner, File .qsf, Nạp SOF/JIC, Báo cáo Tổng hợp và Timing",
    badge: "Phần cứng",
    status: "ready",
    lessonsCount: 5
  },
  {
    id: "ch8",
    order: 8,
    title: "Chương 8 – Mini Projects tổng hợp",
    subtitle: "Đồng hồ số, Bộ điều khiển PWM, ALU 4-bit, UART và Trò chơi phản xạ",
    badge: "Projects",
    status: "ready",
    lessonsCount: 5
  },
  {
    id: "ch9",
    order: 9,
    title: "Chương 9 – Chuyên đề nâng cao",
    subtitle: "Generic, Package, RAM/ROM M9K, PLL Clock và Xuất hình ảnh VGA",
    badge: "Nâng cao",
    status: "ready",
    lessonsCount: 6
  }
];

// Khởi tạo cơ sở dữ liệu các bài học rỗng cho các chương
window.VHDL_LESSONS_DB = window.VHDL_LESSONS_DB || {};

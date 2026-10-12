# STUDY VHDL – Nền Tảng Học Thiết Kế Vi Mạch FPGA DE2-115 Tương Tác
> **Chương trình học thiết kế phần cứng VHDL từ con số 0 trên nền tảng Web SPA / PWA (100% Offline Ready)**

[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20PWA-0284c7.svg)](#)
[![Tech Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML5%20%2F%20CSS3%20%2F%20JS-10b981.svg)](#)
[![FPGA Target](https://img.shields.io/badge/FPGA-Terasic%20DE2--115%20(Cyclone%20IV)-f59e0b.svg)](#)
[![EDA Tools](https://img.shields.io/badge/Tools-Quartus%2020.1%20%26%20ModelSim-6366f1.svg)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(No%20npm%20%2F%20No%20build)-purple.svg)](#)

---

## 🌟 Giới thiệu

**StudyVHDL** là ứng dụng web tương tác được xây dựng nhằm giúp người mới bắt đầu (học sinh, sinh viên, kỹ sư mới tiếp cận) làm chủ ngôn ngữ mô tả phần cứng **VHDL** và quy trình thiết kế vi mạch trên chip **FPGA Intel Cyclone IV E (EP4CE115F29C7)** của bo mạch phát triển **Terasic DE2-115**.

Ứng dụng hoạt động theo triết lý **Zero Build & Zero Dependencies** – toàn bộ mã nguồn là thuần HTML/CSS/JavaScript, sẵn sàng chạy ngay bằng cách mở file `index.html` hoặc deploy lên **GitHub Pages** chỉ trong vài giây.

---

## 🚀 Các tính năng nổi bật

### 1. Lộ trình 10 Chương toàn diện (54 Bài học)
Mỗi bài học được biên soạn chuẩn mực theo cấu trúc **10 phần**:
- 🎯 **Mục tiêu học tập** (Objectives)
- 📖 **Lý thuyết bản chất phần cứng & Bảng chân lý** (Why, How, Truth Tables)
- 📐 **Sơ đồ khối mạch điện SVG** (Hardware diagrams trực quan)
- 💻 **Mã nguồn VHDL chuẩn IEEE** (Đầy đủ thư viện `ieee.std_logic_1164` và `ieee.numeric_std`, không viết tắt `...`)
- 🧪 **Mã Testbench ModelSim tự động kiểm chứng** (Self-checking bằng `assert`/`report`)
- 🛠️ **Hướng dẫn Quartus Prime 20.1 & Gán chân Pin Planner** (Kèm mã gán chân `.qsf` copy dùng ngay)
- ⚠️ **Lỗi biên dịch & Lỗi phần cứng thường gặp** (Tên lỗi, Nguyên nhân, Cách sửa)
- ✍️ **3 Bài tập thực hành có lời giải** (Cơ bản, Vận dụng, Thử thách)
- ❓ **4 Câu trắc nghiệm củng cố** (Quiz 4 lựa chọn kèm giải thích chi tiết)
- 📌 **5 Điểm tóm tắt cốt lõi**

### 2. Ba bộ mô phỏng phần cứng ảo tương tác (Simulators)
- 🟢 **Bo mạch Terasic DE2-115 Ảo:** Tương tác với 18 công tắc trượt `SW`, 4 nút nhấn `KEY` (kèm âm thanh click cơ học qua Web Audio API), 18 LED đỏ `LEDR`, 9 LED xanh `LEDG`, 8 LED 7 thanh `HEX0..HEX7` (Common Anode) và Buzzer âm thanh.
- 📈 **Trình mô phỏng Giản đồ Xung (Waveform Canvas):** Vẽ giản đồ định thời số theo thời gian thực (hỗ trợ tín hiệu 1-bit và đa bit Bus dạng Hexadecimal), điều chỉnh tốc độ, Step từng chu kỳ và đo thời gian.
- 🔄 **Trình mô phỏng Máy trạng thái FSM:** Trực quan hóa đồ hình trạng thái (Moore & Mealy), hiệu ứng phát sáng trạng thái tích cực, nút kích xung Clock Step và Auto Run.

### 3. Bốn công cụ tiện ích cho Kỹ sư (Engineering Tools)
- 📖 **Bảng tra cứu nhanh (Cheat Sheet):** Mẫu mã VHDL, ép kiểu dữ liệu, D-FF, FSM và bản đồ chân ngoại vi DE2-115.
- 📚 **Từ điển Thuật ngữ Vi mạch (Glossary):** 46 thuật ngữ chuyên sâu Anh - Việt (ASIC, FPGA, RTL, LUT, LE, Setup/Hold Time, Slack, Metastability, M9K, PLL, CDC, Critical Path, Pipelining...) có tìm kiếm lọc tức thì.
- 🎴 **Thẻ ghi nhớ thông minh (Interactive 3D Flashcards):** 20 thẻ câu hỏi phỏng vấn vi mạch hiệu ứng lật thẻ 3D, đánh dấu "Đã thuộc" và lưu tiến độ vào `localStorage`.
- 🔬 **Phòng thực hành gỡ lỗi (Debug Lab):** 5 tình huống lỗi vi mạch kinh điển (Inferred Latch, Multiple Drivers, Type mismatch, Reset bất đồng bộ sai, Thiếu sensitivity list) kèm phân tích phần cứng và mã sửa đúng chuẩn.

### 4. PWA & Hoạt động Ngoại tuyến (100% Offline Ready)
- Hỗ trợ cài đặt trực tiếp thành **Desktop App** trên máy tính hoặc **Mobile App** trên điện thoại thông qua chuẩn Progressive Web App (PWA).
- Lưu đệm toàn bộ tài nguyên qua Service Worker (`sw.js`), hoạt động trơn tru không cần kết nối mạng.
- Quản lý và xuất/nhập tiến độ học tập cá nhân bằng file `.json`.

---

## 📚 Tóm tắt Lộ trình 10 Chương

| Chương | Tên Chương | Nội dung trọng tâm |
| :---: | :--- | :--- |
| **0** | Chuẩn bị nền tảng | Tư duy phần cứng vs phần mềm, Đại số Boolean, Bảng chân lý, Quy trình thiết kế vi mạch, Giải phẫu FPGA |
| **1** | Cài đặt & Chạy bài đầu tiên | Cài đặt Quartus 20.1 & ModelSim, Driver USB-Blaster, Nối công tắc SW0 ra LEDR0 |
| **2** | Cú pháp VHDL căn bản | Entity/Architecture, std_logic & numeric_std, Signal vs Variable, Gán đồng thời, When...Else |
| **3** | Mạch tổ hợp | Cổng logic, MUX 2:1 & 4:1, Decoder 2:4, Giải mã BCD ra LED 7 đoạn, Bộ cộng Adder, So sánh 4-bit |
| **4** | Mạch tuần tự | Process, D-Flip-Flop (Sync/Async Reset), Thanh ghi N-bit, Bộ đếm, Chia xung 50 MHz ra 1 Hz, Debounce phím |
| **5** | Máy trạng thái (FSM) | Moore vs Mealy, Phát hiện chuỗi 1011 chồng lấn, FSM 3-Process chuẩn, Đèn giao thông, UART Transmitter |
| **6** | Mô phỏng ModelSim | Self-checking Testbench (`assert`/`report`), Test vectors, NativeLink 1-Click, TCL Scripting `.do`, Waveform |
| **7** | Làm việc với kit DE2-115 | Pin Planner & File `.qsf`, Nạp SOF vs Nạp JIC vào Flash EPCS64, Báo cáo LE/LUT/Register, TimeQuest STA, SignalTap II |
| **8** | Mini Projects tổng hợp | Đồng hồ số 6 LED HEX, PWM điều khiển LED, ALU 4-bit có cờ Z/C/N, UART Echo Server, Reaction Timer Game |
| **9** | Chuyên đề nâng cao | Tham số hóa `GENERIC`/`GENERATE`, `PACKAGE`/`RECORD`, M9K RAM/ROM, PLL Clock Domains & CDC, Xuất VGA 640x480, Capstone |

---

## 💻 Hướng dẫn chạy và sử dụng

### Cách 1: Chạy trực tiếp trên máy tính (Không cần cài đặt)
1. Tải toàn bộ thư mục mã nguồn về máy.
2. Nhấp đúp chuột vào file `index.html` để mở trên bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Brave...).

### Cách 2: Triển khai lên GitHub Pages (Xem trực tuyến)
1. Fork hoặc clone repository này về tài khoản GitHub của bạn.
2. Vào tab **Settings** -> **Pages**.
3. Tại phần **Source**, chọn nhánh `main` (hoặc `master`) và thư mục `/(root)`.
4. Bấm **Save**. Trang web sẽ được xuất bản công khai tại địa chỉ:
   `https://<your-username>.github.io/<repo-name>/`

---

## 🛠️ Yêu cầu phần cứng & phần mềm thực hành
- **Phần cứng:** Kit Terasic DE2-115 (FPGA Altera Cyclone IV EP4CE115F29C7).
- **Phần mềm:** Intel Quartus Prime Lite Edition 20.1 & ModelSim-Intel FPGA Starter Edition 20.1.
- **Cáp nạp:** Cáp USB Type-B kết nối cổng USB-Blaster tích hợp trên kit.

---

## 📄 Bản quyền & Đóng góp
Dự án được xây dựng vì mục đích giáo dục cộng đồng và phi thương mại. Mọi đóng góp cải tiến bài học và tính năng đều được hoan nghênh qua Pull Requests!

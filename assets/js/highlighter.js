// ==========================================================================
// HIGHLIGHTER.JS - BỘ TÔ MÀU CÚ PHÁP VHDL THUẦN JAVASCRIPT (ZERO-DEPENDENCY)
// ==========================================================================

const VHDL_Highlighter = (function () {
  // Bảng từ khóa VHDL (không phân biệt hoa thường trong VHDL chuẩn)
  const KEYWORDS = new Set([
    'library', 'use', 'all', 'entity', 'is', 'port', 'generic', 'architecture',
    'of', 'begin', 'end', 'signal', 'variable', 'constant', 'type', 'subtype',
    'process', 'if', 'then', 'elsif', 'else', 'case', 'when', 'others', 'with',
    'select', 'for', 'loop', 'while', 'wait', 'until', 'report', 'severity',
    'assert', 'to', 'downto', 'component', 'map', 'generate', 'package',
    'body', 'function', 'return', 'procedure', 'null', 'open'
  ]);

  const PORT_MODES = new Set(['in', 'out', 'inout', 'buffer']);

  const TYPES = new Set([
    'std_logic', 'std_logic_vector', 'bit', 'bit_vector', 'boolean',
    'integer', 'natural', 'positive', 'unsigned', 'signed', 'time',
    'character', 'string', 'real'
  ]);

  const LOGIC_OPERATORS = new Set([
    'and', 'or', 'nand', 'nor', 'xor', 'xnor', 'not',
    'sll', 'srl', 'sla', 'sra', 'rol', 'ror'
  ]);

  // Escape HTML an toàn
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Tô màu một dòng mã VHDL
  function highlightLine(line) {
    let result = '';
    let i = 0;
    const len = line.length;

    while (i < len) {
      // 1. Bình luận VHDL bắt đầu bằng hai dấu gạch ngang: --
      if (line[i] === '-' && i + 1 < len && line[i + 1] === '-') {
        const comment = line.slice(i);
        result += `<span class="syn-comm">${escapeHtml(comment)}</span>`;
        break; // Bình luận kéo dài đến hết dòng
      }

      // 2. Chuỗi ký tự (String) nằm trong ngoặc kép: "..."
      if (line[i] === '"') {
        let strEnd = i + 1;
        while (strEnd < len && line[strEnd] !== '"') {
          strEnd++;
        }
        if (strEnd < len) strEnd++; // Bao gồm cả dấu ngoặc kép đóng
        const strVal = line.slice(i, strEnd);
        result += `<span class="syn-lit">${escapeHtml(strVal)}</span>`;
        i = strEnd;
        continue;
      }

      // 3. Ký tự đơn (Bit literal) ví dụ '0', '1', 'Z', 'X'
      if (line[i] === "'" && i + 2 < len && line[i + 2] === "'") {
        const charVal = line.slice(i, i + 3);
        result += `<span class="syn-lit">${escapeHtml(charVal)}</span>`;
        i += 3;
        continue;
      }

      // 4. Các toán tử phức hợp (<=, :=, =>, /=, >=)
      if (i + 1 < len) {
        const twoChar = line.slice(i, i + 2);
        if (twoChar === '<=' || twoChar === ':=' || twoChar === '=>' || twoChar === '/=' || twoChar === '>=') {
          result += `<span class="syn-op">${escapeHtml(twoChar)}</span>`;
          i += 2;
          continue;
        }
      }

      // 5. Từ định danh / từ khóa (chữ cái, số, dấu gạch dưới)
      if (/[a-zA-Z_]/.test(line[i])) {
        let wordEnd = i;
        while (wordEnd < len && /[a-zA-Z0-9_]/.test(line[wordEnd])) {
          wordEnd++;
        }
        const word = line.slice(i, wordEnd);
        const lower = word.toLowerCase();

        if (PORT_MODES.has(lower)) {
          result += `<span class="syn-port">${escapeHtml(word)}</span>`;
        } else if (TYPES.has(lower)) {
          result += `<span class="syn-type">${escapeHtml(word)}</span>`;
        } else if (LOGIC_OPERATORS.has(lower)) {
          result += `<span class="syn-op">${escapeHtml(word)}</span>`;
        } else if (KEYWORDS.has(lower)) {
          result += `<span class="syn-kw">${escapeHtml(word)}</span>`;
        } else {
          result += escapeHtml(word);
        }

        i = wordEnd;
        continue;
      }

      // 6. Số nguyên
      if (/[0-9]/.test(line[i])) {
        let numEnd = i;
        while (numEnd < len && /[0-9]/.test(line[numEnd])) {
          numEnd++;
        }
        const numVal = line.slice(i, numEnd);
        result += `<span class="syn-lit">${escapeHtml(numVal)}</span>`;
        i = numEnd;
        continue;
      }

      // 7. Ký tự đơn còn lại
      result += escapeHtml(line[i]);
      i++;
    }

    return result;
  }

  // Tô màu toàn bộ khối mã và bọc dòng số + nút copy
  function highlight(codeText, filename = 'design.vhd') {
    const rawLines = codeText.trimEnd().split('\n');
    const totalLines = rawLines.length;

    // Tạo cột số thứ tự dòng
    let lineNumbersHtml = '';
    for (let idx = 1; idx <= totalLines; idx++) {
      lineNumbersHtml += `<div>${idx}</div>`;
    }

    // Tô màu từng dòng nội dung
    const highlightedCodeHtml = rawLines.map(highlightLine).join('\n');

    const containerId = 'code_' + Math.random().toString(36).substring(2, 9);

    return `
      <div class="code-viewer-container" id="${containerId}">
        <div class="code-header-bar">
          <div class="code-info">
            <span class="badge badge-purple">VHDL</span>
            <span class="code-filename">${escapeHtml(filename)}</span>
          </div>
          <button class="btn-copy-code" onclick="VHDL_Highlighter.copyCode('${containerId}')" title="Sao chép toàn bộ mã nguồn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span class="copy-text">Sao chép</span>
          </button>
        </div>
        <pre class="code-pre"><div class="code-lines-wrapper"><div class="code-line-numbers">${lineNumbersHtml}</div><div class="code-content">${highlightedCodeHtml}</div></div></pre>
        <textarea class="raw-code-store" style="display:none;">${escapeHtml(codeText)}</textarea>
      </div>
    `;
  }

  // Hàm xử lý sao chép mã nguồn ra Clipboard
  function copyCode(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const rawStore = container.querySelector('.raw-code-store');
    const btn = container.querySelector('.btn-copy-code');
    const copyText = container.querySelector('.copy-text');

    if (rawStore) {
      navigator.clipboard.writeText(rawStore.value).then(() => {
        btn.classList.add('copied');
        if (copyText) copyText.textContent = 'Đã chép!';
        setTimeout(() => {
          btn.classList.remove('copied');
          if (copyText) copyText.textContent = 'Sao chép';
        }, 2000);
      }).catch((err) => {
        console.error('Không thể sao chép:', err);
      });
    }
  }

  return {
    highlight,
    copyCode
  };
})();

window.VHDL_Highlighter = VHDL_Highlighter;

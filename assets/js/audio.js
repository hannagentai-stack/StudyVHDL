// ==========================================================================
// AUDIO.JS - BỘ TẠO ÂM THANH CƠ HỌC BẰNG WEB AUDIO API (KHÔNG CẦN FILE MP3)
// ==========================================================================

const VHDL_Audio = (function () {
  let audioCtx = null;
  let enabled = true;

  // Khởi tạo AudioContext khi có tương tác đầu tiên của người dùng
  function initContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Âm thanh bật công tắc trượt cơ học (Mechanical Switch Click)
  function playSwitchSound(isUp = true) {
    if (!enabled) return;
    try {
      initContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      const now = audioCtx.currentTime;
      const baseFreq = isUp ? 850 : 650;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq / 2, now + 0.035);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.warn('Audio API unavailable:', e);
    }
  }

  // Âm thanh bấm nút nhấn KEY (Tactile Pushbutton Click)
  function playKeySound(isPressed = true) {
    if (!enabled) return;
    try {
      initContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;
      const freq = isPressed ? 1100 : 900;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.025);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      console.warn('Audio API unavailable:', e);
    }
  }

  // Âm thanh còi chip / buzzer (Báo hoàn thành hoặc báo lỗi)
  function playTone(freq = 1000, durationMs = 120, type = 'sine') {
    if (!enabled) return;
    try {
      initContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + durationMs / 1000 + 0.01);
    } catch (e) {
      console.warn('Audio API unavailable:', e);
    }
  }

  function setEnabled(state) {
    enabled = Boolean(state);
  }

  function isEnabled() {
    return enabled;
  }

  return {
    playSwitchSound,
    playKeySound,
    playTone,
    setEnabled,
    isEnabled
  };
})();

window.VHDL_Audio = VHDL_Audio;

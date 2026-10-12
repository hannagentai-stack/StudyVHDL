// ==========================================================================
// STORE.JS - QUẢN LÝ TIẾN ĐỘ HỌC, LOCALSTORAGE (TRY/CATCH) VÀ XUẤT/NHẬP JSON
// ==========================================================================

const VHDL_Store = (function () {
  const STORAGE_KEY = 'studyvhdl_user_progress_v1';
  const SETTINGS_KEY = 'studyvhdl_user_settings_v1';

  let state = {
    completedLessons: {}, // { 'ch0-b1': true, ... }
    quizAnswers: {},      // { 'ch0-b1_0': 1, ... }
    lastVisitedLesson: 'ch0-b1',
    settings: {
      theme: 'dark',
      audio: true,
      sidebarCollapsed: false,
      splitWidthPercent: 52
    }
  };

  // Tải trạng thái an toàn có bọc try/catch
  function load() {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && typeof parsed === 'object') {
          state.completedLessons = parsed.completedLessons || {};
          state.quizAnswers = parsed.quizAnswers || {};
          state.lastVisitedLesson = parsed.lastVisitedLesson || 'ch0-b1';
        }
      }

      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings && typeof parsedSettings === 'object') {
          state.settings = { ...state.settings, ...parsedSettings };
        }
      }
    } catch (err) {
      console.warn('LocalStorage error or unavailable, using in-memory state:', err);
    }
  }

  // Lưu trạng thái có bọc try/catch
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        completedLessons: state.completedLessons,
        quizAnswers: state.quizAnswers,
        lastVisitedLesson: state.lastVisitedLesson,
        updatedAt: new Date().toISOString()
      }));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
    } catch (err) {
      console.warn('Unable to persist data to LocalStorage:', err);
    }
  }

  function isLessonCompleted(lessonId) {
    return Boolean(state.completedLessons[lessonId]);
  }

  function setLessonCompleted(lessonId, isCompleted = true) {
    if (isCompleted) {
      state.completedLessons[lessonId] = true;
    } else {
      delete state.completedLessons[lessonId];
    }
    save();
    notifyChange();
  }

  function toggleLessonCompleted(lessonId) {
    const nextState = !isLessonCompleted(lessonId);
    setLessonCompleted(lessonId, nextState);
    return nextState;
  }

  function getCompletedCount() {
    return Object.keys(state.completedLessons).length;
  }

  function setLastVisited(lessonId) {
    state.lastVisitedLesson = lessonId;
    save();
  }

  function getLastVisited() {
    return state.lastVisitedLesson || 'ch0-b1';
  }

  function saveQuizAnswer(lessonId, questionIdx, optionIdx) {
    const key = `${lessonId}_${questionIdx}`;
    state.quizAnswers[key] = optionIdx;
    save();
  }

  function getQuizAnswer(lessonId, questionIdx) {
    const key = `${lessonId}_${questionIdx}`;
    return state.quizAnswers[key] !== undefined ? state.quizAnswers[key] : null;
  }

  function getSettings() {
    return { ...state.settings };
  }

  function updateSetting(key, val) {
    state.settings[key] = val;
    save();
  }

  // Xuất tiến độ học ra file JSON
  function exportProgress() {
    const exportData = {
      app: 'StudyVHDL',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      completedLessons: state.completedLessons,
      quizAnswers: state.quizAnswers,
      lastVisitedLesson: state.lastVisitedLesson
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyVHDL_TienDo_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Nhập tiến độ từ file JSON
  function importProgress(jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Dữ liệu JSON không hợp lệ');
      }

      if (parsed.completedLessons && typeof parsed.completedLessons === 'object') {
        state.completedLessons = { ...state.completedLessons, ...parsed.completedLessons };
      }
      if (parsed.quizAnswers && typeof parsed.quizAnswers === 'object') {
        state.quizAnswers = { ...state.quizAnswers, ...parsed.quizAnswers };
      }
      if (parsed.lastVisitedLesson) {
        state.lastVisitedLesson = parsed.lastVisitedLesson;
      }

      save();
      notifyChange();
      return { success: true, count: Object.keys(state.completedLessons).length };
    } catch (err) {
      console.error('Import failed:', err);
      return { success: false, error: err.message };
    }
  }

  // Observer callback khi tiến độ thay đổi
  const listeners = [];
  function onChange(cb) {
    if (typeof cb === 'function') listeners.push(cb);
  }

  function notifyChange() {
    listeners.forEach((cb) => {
      try { cb(state); } catch (e) { console.error(e); }
    });
  }

  // Khởi tạo ngay khi nạp script
  load();

  return {
    isLessonCompleted,
    setLessonCompleted,
    toggleLessonCompleted,
    getCompletedCount,
    setLastVisited,
    getLastVisited,
    saveQuizAnswer,
    getQuizAnswer,
    getSettings,
    updateSetting,
    exportProgress,
    importProgress,
    onChange
  };
})();

window.VHDL_Store = VHDL_Store;

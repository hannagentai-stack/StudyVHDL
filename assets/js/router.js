// ==========================================================================
// ROUTER.JS - ĐIỀU HƯỚNG BÀI HỌC QUA URL HASH (#ch0-b1) MƯỢT MÀ
// ==========================================================================

const VHDL_Router = (function () {
  let currentLessonId = 'ch0-b1';
  let routeChangeCallback = null;

  // Lấy toàn bộ danh sách bài học phẳng (Flat Array) theo thứ tự
  function getAllLessonIds() {
    const list = [];
    if (!window.VHDL_LESSONS_DB) return list;
    
    const chapters = window.VHDL_CHAPTERS_INDEX || [];
    chapters.forEach(ch => {
      const lessons = window.VHDL_LESSONS_DB[ch.id] || [];
      lessons.forEach(l => list.push(l.id));
    });
    return list;
  }

  function getPrevLessonId(lessonId) {
    const all = getAllLessonIds();
    const idx = all.indexOf(lessonId);
    if (idx > 0) return all[idx - 1];
    return null;
  }

  function getNextLessonId(lessonId) {
    const all = getAllLessonIds();
    const idx = all.indexOf(lessonId);
    if (idx !== -1 && idx < all.length - 1) return all[idx + 1];
    return null;
  }

  function parseHash() {
    const hash = window.location.hash.replace('#', '').trim();
    return hash || null;
  }

  function navigateTo(lessonId) {
    if (!lessonId) return;
    window.location.hash = '#' + lessonId;
  }

  function handleHashChange() {
    const targetId = parseHash();
    if (targetId) {
      currentLessonId = targetId;
    } else {
      // Nếu chưa có hash, lấy bài học gần nhất từ store hoặc mặc định ch0-b1
      const last = window.VHDL_Store ? window.VHDL_Store.getLastVisited() : 'ch0-b1';
      currentLessonId = last;
      window.location.hash = '#' + currentLessonId;
      return;
    }

    if (window.VHDL_Store) {
      window.VHDL_Store.setLastVisited(currentLessonId);
    }

    if (typeof routeChangeCallback === 'function') {
      routeChangeCallback(currentLessonId);
    }
  }

  function init(callback) {
    routeChangeCallback = callback;
    window.addEventListener('hashchange', handleHashChange);
    // Kích hoạt ngay lần đầu tải trang
    handleHashChange();
  }

  function getCurrentLessonId() {
    return currentLessonId;
  }

  return {
    init,
    navigateTo,
    getCurrentLessonId,
    getPrevLessonId,
    getNextLessonId,
    getAllLessonIds
  };
})();

window.VHDL_Router = VHDL_Router;

// Service Worker cho ứng dụng StudyVHDL
// Hỗ trợ hoạt động Offline hoàn toàn (PWA)

const CACHE_NAME = 'studyvhdl-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/icons/favicon.svg',
  './assets/css/main.css',
  './assets/css/layout.css',
  './assets/css/components.css',
  './assets/css/simulators.css',
  './assets/css/responsive.css',
  './assets/js/audio.js',
  './assets/js/store.js',
  './assets/js/highlighter.js',
  './assets/js/router.js',
  './assets/js/tools.js',
  './assets/js/app.js',
  './assets/js/simulators/de2_board.js',
  './assets/js/simulators/waveform.js',
  './assets/js/simulators/fsm.js',
  './assets/js/data/chapters_index.js',
  './assets/js/data/ch0_foundation.js',
  './assets/js/data/ch1_setup_first.js',
  './assets/js/data/ch2_vhdl_basics.js',
  './assets/js/data/ch3_combinational.js',
  './assets/js/data/ch4_sequential.js',
  './assets/js/data/ch5_fsm.js',
  './assets/js/data/ch6_modelsim.js',
  './assets/js/data/ch7_hardware.js',
  './assets/js/data/ch8_projects.js',
  './assets/js/data/ch9_advanced.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Chỉ cache các request cùng origin hoặc file nội bộ
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Nếu offline và không có cache, fallback về trang chủ nếu là điều hướng
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

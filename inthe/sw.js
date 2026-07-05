// Service worker: HTML + JS network-first (luôn mới khi online), tài nguyên khác cache-first (nhanh + offline)
const CACHE = 'tn-inthe-v4';
const ASSETS = ['./', './index.html', './logo.js', './qrcode.js', './heic2any.js',
  './the-nail-logo.svg', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-180.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // JS cũng network-first: logo.js/qrcode.js đổi nội dung giữ tên → khách vẫn nhận bản mới
  const isFresh = e.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html') || url.pathname.endsWith('.js');
  const putOk = (req, r) => { if (r && r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; }; // không cache response lỗi (404/500)
  if (isFresh) {
    // network-first: online thì luôn lấy bản mới nhất, mất mạng mới dùng cache
    e.respondWith(
      fetch(e.request).then(r => putOk(e.request, r))
        .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html')))
    );
  } else {
    // cache-first cho file tĩnh (không đổi): nhanh + chạy offline
    e.respondWith(
      caches.match(e.request).then(m => m || fetch(e.request).then(r => putOk(e.request, r)))
    );
  }
});

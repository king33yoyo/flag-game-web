/* 世界插旗挑战 service worker:预缓存全部本地资源,离线可玩 */
const CACHE = 'flag-game-v2.1.0';
const ASSETS = [
  './',
  './index.html',
  './data.js',
  './utils.js',
  './vendor/leaflet.js',
  './vendor/leaflet.css',
  './assets/asia.webp',
  './assets/europe.webp',
  './assets/africa.webp',
  './assets/south-america.webp',
  './assets/north-america.webp',
  './assets/oceania.webp',
  './assets/globe.webp',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './favicon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* cache-first; anything else (should be nothing) falls back to network */
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request))
  );
});

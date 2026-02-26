const CACHE_NAME = 'budu-v4';  // versi baru supaya cache lama dibersihkan otomatis

const BASE_PATH = '/BUDU/';
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'assets/logo.png',
  BASE_PATH + 'assets/icon-192.png',
  BASE_PATH + 'assets/icon-512.png',
  BASE_PATH + 'assets/icon-maskable-192.png',
  BASE_PATH + 'assets/icon-maskable-512.png',
  BASE_PATH + 'assets/blackscreen.png',
  BASE_PATH + 'assets/watermark.png',
  BASE_PATH + 'assets/loadscreen.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())  // langsung aktifkan SW baru
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())  // ambil kontrol client langsung
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

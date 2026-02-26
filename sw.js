const CACHE_NAME = 'budu-v1';
const BASE_PATH = '/BUDU/';
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'assets/logo.png',
  BASE_PATH + 'assets/icon-192.png',
  BASE_PATH + 'assets/icon-512.png'
  // Tambah aset game lain di sini nanti, misal: BASE_PATH + 'game.js', dll
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())  // Langsung aktifkan SW baru
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())  // Ambil kontrol client langsung
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

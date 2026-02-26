const CACHE_NAME = 'budu-v5';  // naikkan versi lagi

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
  BASE_PATH + 'assets/loadscreen.png',
  BASE_PATH + 'assets/garage.png',
  BASE_PATH + 'assets/bubu.gif',
  BASE_PATH + 'assets/car.png',
  BASE_PATH + 'assets/homesong.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

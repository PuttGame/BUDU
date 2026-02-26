const CACHE_NAME = 'budu-v10';

const BASE_PATH = '/BUDU/';
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'assets/icon/logo.png',
  BASE_PATH + 'assets/icon/icon-192.png',
  BASE_PATH + 'assets/icon/icon-512.png',
  BASE_PATH + 'assets/icon/icon-maskable-192.png',
  BASE_PATH + 'assets/icon/icon-maskable-512.png',
  BASE_PATH + 'assets/background/blackscreen.png',
  BASE_PATH + 'assets/background/watermark.png',
  BASE_PATH + 'assets/background/loadscreen.png',
  BASE_PATH + 'assets/background/garage.png',
  BASE_PATH + 'assets/karakter/bubu.gif',
  BASE_PATH + 'assets/car/car.png',
  BASE_PATH + 'assets/music/homesong.mp3'
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

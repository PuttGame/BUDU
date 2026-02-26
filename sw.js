const CACHE_NAME = 'budy-pwa-v4';

self.addEventListener('install', event => {
  console.log('[SW] Install started');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching files');
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/style.css',
        '/script.js',
        '/logo.png',
        '/splashscreen.png',
        '/loadsplash.png',
        '/icons/icon-192.png',
        '/icons/icon-512.png'
      ]).then(() => {
        console.log('[SW] Cache complete');
      }).catch(err => console.error('[SW] Cache error:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activate');
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
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
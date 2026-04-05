// নগর সমাচার ২৪ — Card Maker Service Worker
const CACHE_NAME = 'nogor-card-maker-v1';

// অফলাইনে যা যা লাগবে সেগুলো cache করে রাখবো
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './cards.js',
  './manifest.json',
  './logo.png',
  './logo.jpeg',
  './logo1.jpeg',
  './logo-removebg-preview.png',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@700;900&family=Noto+Sans+Bengali:wght@400;600;700&display=swap'
];

// ── Install: সব ফাইল cache এ সেভ করো ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching all assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // নতুন SW সাথে সাথে activate হবে
});

// ── Activate: পুরনো cache মুছে ফেলো ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim(); // সাথে সাথে সব tab এ control নেবে
});

// ── Fetch: নেট না থাকলে cache থেকে দেবে ──
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Cache হিট — সাথে সাথে দাও
        return cachedResponse;
      }

      // Cache এ নেই — নেট থেকে আনো এবং cache এ সেভ করো
      return fetch(event.request)
        .then(networkResponse => {
          // শুধু valid response cache করবো
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type === 'opaque'
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // নেট নেই, cache এও নেই — fallback index.html দাও
          return caches.match('./index.html');
        });
    })
  );
});

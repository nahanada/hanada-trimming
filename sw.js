const CACHE_NAME = 'hanada-trimming-v3';

const ASSETS_TO_CACHE = [
  './',
  './index.html?v=2',
  './manifest.json?v=2',
  './Kame-Shiro-Noir.jpg'
];

self.addEventListener('install', (event) => {
  // 新しいService Workerを即座に有効化待ち状態にする
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('古いキャッシュを削除:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

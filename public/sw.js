const CACHE_NAME = 'ae86-chime-v2';
const ASSETS = [
  './',
  'index.html',
  'ae86_chime.mp3',
  'manifest.json',
  'placeholder.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

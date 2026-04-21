const CACHE_NAME = 'ae86-dash-v2';
const STATIC_ASSETS = [
  './',
  'index.html',
  'ae86_chime.mp3',
  'manifest.json',
  'placeholder.svg'
];

// Install event: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Network first, then Cache for API; Cache first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // For API calls (Weather), try network first
  if (url.hostname.includes('open-meteo.com')) {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(request))
    );
    return;
  }

  // For everything else (JS, CSS, Images, Audio), try cache first
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Don't cache media streams or external dyad-media directly if they fail
          if (request.url.startsWith('http')) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});
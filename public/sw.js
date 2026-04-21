const CACHE_NAME = 'ae86-chime-v1';
const ASSETS = [
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
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Smart strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network Only for Weather API
  if (url.hostname.includes('open-meteo.com')) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Network First for HTML and JS/CSS bundles
  if (
    request.mode === 'navigate' || 
    url.pathname.endsWith('.js') || 
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache First for static assets
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((networkResponse) => {
        if (networkResponse.status === 200 && url.protocol.startsWith('http')) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return networkResponse;
      });
    })
  );
});
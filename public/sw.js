const CACHE_NAME = 'ae86-dash-v3';
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

// Activate event: Clean up old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Smart strategy to prevent white screens
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Network Only for Weather API
  if (url.hostname.includes('open-meteo.com')) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // 2. Network First for HTML and JS/CSS bundles
  // This prevents the "white screen" caused by cached HTML pointing to old JS files
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

  // 3. Cache First for static assets (Audio, Images, Manifest)
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((networkResponse) => {
        // Only cache successful standard HTTP requests
        if (networkResponse.status === 200 && url.protocol.startsWith('http')) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return networkResponse;
      });
    })
  );
});
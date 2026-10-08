const CACHE_NAME = 'pokego-radar-v1.6.2';
const ASSETS_TO_CACHE = [
  '../../',
  '../../index.html',
  '../noticias.html',
  '../semana.html',
  '../rocket.html',
  '../atacantes.html',
  '../css/styles.css',
  './audio.js',
  './season.js',
  './location.js',
  './app.js',
  './eventModal.js',
  './noticias.js',
  './semana.js',
  './rocket.js',
  './atacantes.js',
  '../img/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);
  
  // Estrategia Network First para APIs y datos dinámicos JSON
  if (url.pathname.endsWith('.json') || url.hostname.includes('pokeapi.co') || url.hostname.includes('raw.githubusercontent.com')) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        const clonedResponse = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return networkResponse;
      }).catch(() => caches.match(event.request))
    );
  } else {
    // Estrategia Stale-While-Revalidate para assets estáticos e imágenes (ultra optimizado)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        }).catch(() => {}); // Ignorar errores de red en revalidación
        
        return cachedResponse || fetchPromise;
      })
    );
  }
});

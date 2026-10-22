const CACHE_NAME = 'pokego-radar-v2.0.0';
const ASSETS_TO_CACHE = [
  '../../',
  '../../index.html',
  '../noticias.html',
  '../semana.html',
  '../rocket.html',
  '../atacantes.html',
  '../css/base.css?v=2.0.0',
  '../css/mobile.css?v=2.0.0',
  '../css/home.css?v=2.0.0',
  '../css/noticias.css?v=2.0.0',
  '../css/semana.css?v=2.0.0',
  '../css/rocket.css?v=2.0.0',
  '../css/atacantes.css?v=2.0.0',
  './audio.js?v=2.0.0',
  './season.js?v=2.0.0',
  './location.js?v=2.0.0',
  './app.js?v=2.0.0',
  './eventModal.js?v=2.0.0',
  './noticias.js?v=2.0.0',
  './semana.js?v=2.0.0',
  './rocket.js?v=2.0.0',
  './atacantes.js?v=2.0.0',
  './nav.js?v=2.0.0',
  '../data/rocket.json',
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
  
  const isHtmlNavigation = event.request.mode === 'navigate' || 
                           url.pathname.endsWith('.html') || 
                           url.pathname.endsWith('/') || 
                           !url.pathname.includes('.');
  const isDynamicData = url.pathname.endsWith('.json') || 
                        url.hostname.includes('pokeapi.co') || 
                        url.hostname.includes('raw.githubusercontent.com');

  // Estrategia Network First para HTML de páginas, APIs y datos dinámicos JSON
  if (isHtmlNavigation || isDynamicData) {
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

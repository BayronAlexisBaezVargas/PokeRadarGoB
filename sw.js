'use strict';
const RELEASE = '2.0.0';
const BUILD = '20261031a';
const ROOT = new URL('./', self.location.href);
const PREFIX = 'pokeradar:' + ROOT.pathname + ':';
const CACHE_NAME = PREFIX + RELEASE + ':' + BUILD;
const RESOURCE_QUERY = '?v=' + RELEASE + '&build=' + BUILD;
const STATIC_FILES = [
  'index.html', 'assets/noticias.html', 'assets/semana.html', 'assets/rocket.html', 'assets/atacantes.html',
  'assets/manifest.json', 'assets/img/favicon.svg', 'assets/data/rocket.json', 'assets/scratch_atacantes.json'
];
const CSS = ['base', 'mobile', 'home', 'noticias', 'semana', 'rocket', 'atacantes'];
const JS = ['raid-share', 'attacker-compare', 'calendar', 'data', 'view-state', 'pwa', 'audio', 'season', 'location', 'app', 'eventModal', 'noticias', 'semana', 'rocket', 'atacantes', 'nav'];
const ASSETS = ['./'].concat(STATIC_FILES,
  CSS.map(name => 'assets/css/' + name + '.css' + RESOURCE_QUERY),
  JS.map(name => 'assets/js/' + name + '.js' + RESOURCE_QUERY)
).map(path => new URL(path, ROOT).href);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name =>
      (name.startsWith(PREFIX) && name !== CACHE_NAME) || /^pokego-radar-v\d/.test(name)
    ).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
async function network(request, cache, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(request, { signal: controller.signal });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    try { await cache.put(request, response.clone()); } catch (err) {
      // A full cache must not discard a successful network response.
    }
    return response;
  } finally { clearTimeout(timer); }
}
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try { return await network(request, cache, 7000); }
  catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const url = new URL(request.url);
      url.search = '';
      const shell = await cache.match(url.href);
      if (shell) return shell;
    }
    return new Response('Sin conexión y sin datos guardados.', {
      status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const local = url.origin === ROOT.origin && url.pathname.startsWith(ROOT.pathname);
  const dataSource = url.origin === 'https://raw.githubusercontent.com' && url.pathname.startsWith('/bigfoott/ScrapedDuck/data/') ||
    url.origin === 'https://pokelitee.github.io' && url.pathname === '/leak-duck/rocket_lineups.json' ||
    url.origin === 'https://pokeapi.co' && url.pathname.startsWith('/api/v2/');
  if (!local && !dataSource) return;
  if (request.mode === 'navigate' || url.pathname.endsWith('.json') || dataSource) {
    event.respondWith(networkFirst(request));
    return;
  }
  const refresh = caches.open(CACHE_NAME).then(cache => network(request, cache, 7000));
  event.waitUntil(refresh.catch(() => {}));
  event.respondWith(caches.open(CACHE_NAME).then(async cache => {
    const cached = await cache.match(request);
    return cached || refresh.catch(() => new Response('Recurso no disponible.', { status: 503 }));
  }));

});

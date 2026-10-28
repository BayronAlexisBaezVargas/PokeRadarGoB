// Retire the old /assets/js/ registration. The active worker now lives at /sw.js.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(self.registration.unregister());
});

(function () {
  'use strict';
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
  var root = new URL('../../', document.currentScript.src);
  var worker = new URL('sw.js', root);
  var legacy = new URL('assets/js/sw.js', root);
  async function register() {
    try {
      // Remove only this application's old, incorrectly scoped registration.
      var registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.filter(function (registration) {
        var script = registration.active || registration.waiting || registration.installing;
        return script && new URL(script.scriptURL).pathname === legacy.pathname;
      }).map(function (registration) { return registration.unregister(); }));
      var registration = await navigator.serviceWorker.register(worker.href, {
        scope: root.pathname, updateViaCache: 'none'
      });
      await registration.update();
    } catch (err) { console.info('Caché local no disponible:', err.message); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', register, { once: true });
  else register();
})();

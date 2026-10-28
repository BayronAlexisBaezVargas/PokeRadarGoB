(function () {
  'use strict';
  // Scope session state to this deployment, including GitHub Pages subdirectories.
  var root = new URL('../../', document.currentScript.src).pathname;
  window.createViewState = function (name, readFilters) {
    var key = 'pokeradar_view_' + root + name;
    var saved = {};
    try { saved = JSON.parse(sessionStorage.getItem(key)) || {}; } catch (err) {}
    var active = false;
    var interacted = false;
    var lastPosition = saved.position || { y: 0 };
    var selector = '.card[data-mon-key], .event-card[data-ev-key], .day-card[data-view-key]';
    function identity(el) {
      return el.dataset.monKey || el.dataset.evKey || el.dataset.viewKey;
    }
    function position() {
      if (document.querySelector('dialog[open]')) return lastPosition;
      var anchor = Array.from(document.querySelectorAll(selector)).find(function (el) {
        var rect = el.getBoundingClientRect();
        return el.getClientRects().length && rect.bottom > 70 && rect.top < innerHeight;
      });
      lastPosition = { y: scrollY, anchor: anchor && identity(anchor), top: anchor && anchor.getBoundingClientRect().top };
      return lastPosition;
    }
    function save() {
      try { sessionStorage.setItem(key, JSON.stringify({ filters: readFilters(), position: active ? position() : lastPosition })); } catch (err) {}
    }
    function restore() {
      active = true;
      if (interacted || !saved.position) return;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (interacted) return;
          var pos = saved.position;
          var anchor = Array.from(document.querySelectorAll(selector)).find(function (el) {
            return identity(el) === pos.anchor && el.getClientRects().length;
          });
          var y = anchor ? scrollY + anchor.getBoundingClientRect().top - pos.top : pos.y;
          window.scrollTo({ top: Math.max(0, Number(y) || 0), behavior: 'instant' });
          lastPosition = position();
        });
      });
    }
    if (saved.position && 'scrollRestoration' in history) history.scrollRestoration = 'manual';
    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (type) {
      window.addEventListener(type, function () { interacted = true; }, { passive: true });
    });
    // Capture the scroll position before opening a dialog or leaving the page.
    document.addEventListener('click', function (event) {
      if (event.target.closest('a, ' + selector)) save();
    }, true);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') save();
    }, true);
    window.addEventListener('pagehide', save);
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) { interacted = true; active = true; }
    });
    return { saved: saved.filters || {}, restore: restore, save: save };
  };
})();

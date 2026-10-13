(function(){
  "use strict";

  if (window.__POKERADAR_NAV_ACTIVE__) return;
  window.__POKERADAR_NAV_ACTIVE__ = true;

  // 0. PWA Cache Purge on Version Upgrade
  try {
    var CURRENT_VERSION = '1.8.0_fix';
    var storedVersion = localStorage.getItem('pokeradar_version');
    if (storedVersion !== CURRENT_VERSION) {
      localStorage.setItem('pokeradar_version', CURRENT_VERSION);
      if ('caches' in window) {
        caches.keys().then(function(names) {
          names.forEach(function(name) {
            if (name !== 'pokego-radar-v1.8.0') {
              caches.delete(name);
            }
          });
        });
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(regs) {
          regs.forEach(function(r) {
            r.unregister();
          });
        });
      }
    }
  } catch (e) {}

  // 1. Radar Full-Screen Loader Markup (Dotted Pokeball + Tactical Radar Sweep)
  var loaderHtml = '<div class="radar-loader-content">' +
    '<div class="radar-pokeball-wrap">' +
      '<div class="radar-sweep-cone"></div>' +
      '<svg class="radar-pokeball-svg" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="80" cy="80" r="74" class="radar-grid-ring"/>' +
        '<circle cx="80" cy="80" r="58" class="radar-grid-ring radar-grid-dash"/>' +
        '<circle cx="80" cy="80" r="42" class="radar-grid-ring"/>' +
        '<circle cx="80" cy="80" r="26" class="radar-grid-ring radar-grid-dash"/>' +
        '<line x1="80" y1="4" x2="80" y2="12" class="radar-axis-tick"/>' +
        '<line x1="80" y1="148" x2="80" y2="156" class="radar-axis-tick"/>' +
        '<line x1="4" y1="80" x2="12" y2="80" class="radar-axis-tick"/>' +
        '<line x1="148" y1="80" x2="156" y2="80" class="radar-axis-tick"/>' +
        /* Outer Contour: Upper dots */
        '<circle cx="25.9" cy="65.5" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="31.5" cy="52.0" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="40.4" cy="40.4" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="52.0" cy="31.5" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="65.5" cy="25.9" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="80.0" cy="24.0" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="94.5" cy="25.9" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="108.0" cy="31.5" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="119.6" cy="40.4" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="128.5" cy="52.0" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="134.1" cy="65.5" r="2.8" class="p-dot-outer"/>' +
        /* Outer Contour: Lower dots */
        '<circle cx="134.1" cy="94.5" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="128.5" cy="108.0" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="119.6" cy="119.6" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="108.0" cy="128.5" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="94.5" cy="134.1" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="80.0" cy="136.0" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="65.5" cy="134.1" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="52.0" cy="128.5" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="40.4" cy="119.6" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="31.5" cy="108.0" r="2.8" class="p-dot-outer"/>' +
        '<circle cx="25.9" cy="94.5" r="2.8" class="p-dot-outer"/>' +
        /* Mid Contour Dots */
        '<circle cx="40.5" cy="65.6" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="47.8" cy="53.0" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="59.0" cy="43.6" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="72.7" cy="38.6" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="87.3" cy="38.6" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="101.0" cy="43.6" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="112.2" cy="53.0" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="119.5" cy="65.6" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="119.5" cy="94.4" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="112.2" cy="107.0" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="101.0" cy="116.4" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="87.3" cy="121.4" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="72.7" cy="121.4" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="59.0" cy="116.4" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="47.8" cy="107.0" r="2.2" class="p-dot-mid"/>' +
        '<circle cx="40.5" cy="94.4" r="2.2" class="p-dot-mid"/>' +
        /* Inner Contour Dots */
        '<circle cx="53.9" cy="66.0" r="1.8" class="p-dot-inner"/>' +
        '<circle cx="60.5" cy="58.2" r="1.8" class="p-dot-inner"/>' +
        '<circle cx="69.4" cy="52.9" r="1.8" class="p-dot-inner"/>' +
        '<circle cx="79.3" cy="52.0" r="1.8" class="p-dot-inner"/>' +
        '<circle cx="88.7" cy="54.8" r="1.8" class="p-dot-inner"/>' +
        '<circle cx="96.5" cy="61.2" r="1.8" class="p-dot-inner"/>' +
        '<circle cx="96.5" cy="98.8" r="1.8" class="p-dot-inner"/>' +
        '<circle cx="88.7" cy="105.2" r="1.8" class="p-dot-inner"/>' +
        '<circle cx="79.3" cy="108.0" r="1.8" class="p-dot-inner"/>' +
        '<circle cx="69.4" cy="107.1" r="1.8" class="p-dot-inner"/>' +
        '<circle cx="60.5" cy="101.8" r="1.8" class="p-dot-inner"/>' +
        '<circle cx="53.9" cy="94.0" r="1.8" class="p-dot-inner"/>' +
        /* Equatorial Dots */
        '<circle cx="24.0" cy="80.0" r="2.5" class="p-dot-equator"/>' +
        '<circle cx="32.0" cy="80.0" r="2.5" class="p-dot-equator"/>' +
        '<circle cx="40.0" cy="80.0" r="2.5" class="p-dot-equator"/>' +
        '<circle cx="48.0" cy="80.0" r="2.5" class="p-dot-equator"/>' +
        '<circle cx="56.0" cy="80.0" r="2.5" class="p-dot-equator"/>' +
        '<circle cx="104.0" cy="80.0" r="2.5" class="p-dot-equator"/>' +
        '<circle cx="112.0" cy="80.0" r="2.5" class="p-dot-equator"/>' +
        '<circle cx="120.0" cy="80.0" r="2.5" class="p-dot-equator"/>' +
        '<circle cx="128.0" cy="80.0" r="2.5" class="p-dot-equator"/>' +
        '<circle cx="136.0" cy="80.0" r="2.5" class="p-dot-equator"/>' +
        /* Button Outer Ring Dots */
        '<circle cx="98.0" cy="80.0" r="2.4" class="p-dot-btn-out"/>' +
        '<circle cx="95.6" cy="89.0" r="2.4" class="p-dot-btn-out"/>' +
        '<circle cx="89.0" cy="95.6" r="2.4" class="p-dot-btn-out"/>' +
        '<circle cx="80.0" cy="98.0" r="2.4" class="p-dot-btn-out"/>' +
        '<circle cx="71.0" cy="95.6" r="2.4" class="p-dot-btn-out"/>' +
        '<circle cx="64.4" cy="89.0" r="2.4" class="p-dot-btn-out"/>' +
        '<circle cx="62.0" cy="80.0" r="2.4" class="p-dot-btn-out"/>' +
        '<circle cx="64.4" cy="71.0" r="2.4" class="p-dot-btn-out"/>' +
        '<circle cx="71.0" cy="64.4" r="2.4" class="p-dot-btn-out"/>' +
        '<circle cx="80.0" cy="62.0" r="2.4" class="p-dot-btn-out"/>' +
        '<circle cx="89.0" cy="64.4" r="2.4" class="p-dot-btn-out"/>' +
        '<circle cx="95.6" cy="71.0" r="2.4" class="p-dot-btn-out"/>' +
        /* Button Inner Ring Dots */
        '<circle cx="90.0" cy="80.0" r="2.0" class="p-dot-btn-in"/>' +
        '<circle cx="87.1" cy="87.1" r="2.0" class="p-dot-btn-in"/>' +
        '<circle cx="80.0" cy="90.0" r="2.0" class="p-dot-btn-in"/>' +
        '<circle cx="72.9" cy="87.1" r="2.0" class="p-dot-btn-in"/>' +
        '<circle cx="70.0" cy="80.0" r="2.0" class="p-dot-btn-in"/>' +
        '<circle cx="72.9" cy="72.9" r="2.0" class="p-dot-btn-in"/>' +
        '<circle cx="80.0" cy="70.0" r="2.0" class="p-dot-btn-in"/>' +
        '<circle cx="87.1" cy="72.9" r="2.0" class="p-dot-btn-in"/>' +
        /* Reticle Ticks */
        '<circle cx="80.0" cy="14.0" r="2.2" class="p-dot-reticle-top"/>' +
        '<circle cx="80.0" cy="20.0" r="2.2" class="p-dot-reticle-top"/>' +
        '<circle cx="80.0" cy="26.0" r="2.2" class="p-dot-reticle-top"/>' +
        '<circle cx="80.0" cy="134.0" r="2.2" class="p-dot-reticle-bot"/>' +
        '<circle cx="80.0" cy="140.0" r="2.2" class="p-dot-reticle-bot"/>' +
        '<circle cx="80.0" cy="146.0" r="2.2" class="p-dot-reticle-bot"/>' +
        /* Core Pulse & Dot */
        '<circle cx="80" cy="80" r="6" class="radar-core-pulse"/>' +
        '<circle cx="80" cy="80" r="3.2" class="radar-core-dot"/>' +
      '</svg>' +
    '</div>' +
    '<div class="radar-loader-brand">' +
      '<div class="radar-brand-title">POKÉMON GO</div>' +
      '<div class="radar-brand-sub">' +
        '<span class="radar-beacon"></span>' +
        '<span>RADAR DE CAMPO</span>' +
      '</div>' +
    '</div>' +
  '</div>';

  function getOrCreateLoader() {
    var loader = document.getElementById('radar-screen-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'radar-screen-loader';
      loader.className = 'radar-screen-loader';
      loader.setAttribute('aria-hidden', 'true');
      loader.innerHTML = loaderHtml;
      document.body.appendChild(loader);
    } else if (!loader.querySelector('.radar-pokeball-svg')) {
      loader.innerHTML = loaderHtml;
    }
    return loader;
  }

  function showLoader() {
    var loader = getOrCreateLoader();
    loader.classList.remove('hidden');
    loader.classList.add('active');
  }

  function hideLoader() {
    var loader = getOrCreateLoader();
    loader.classList.remove('active');
    setTimeout(function() {
      if (!loader.classList.contains('active')) {
        loader.classList.add('hidden');
      }
    }, 240);
  }

  window.__POKERADAR_SHOW_LOADER__ = showLoader;
  window.__POKERADAR_HIDE_LOADER__ = hideLoader;

  // Tactical top progress bar
  var bar = document.createElement('div');
  bar.className = 'nav-progress-bar';
  document.body.appendChild(bar);

  function startProgress() {
    bar.style.transition = 'none';
    bar.style.width = '0%';
    bar.style.opacity = '1';
    requestAnimationFrame(function(){
      bar.style.transition = 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
      bar.style.width = '80%';
    });
  }

  function endProgress() {
    bar.style.transition = 'width 0.12s ease-out, opacity 0.15s ease';
    bar.style.width = '100%';
    setTimeout(function(){
      bar.style.opacity = '0';
      setTimeout(function(){ bar.style.width = '0%'; }, 180);
    }, 60);
  }

  // Smooth dismissal on page mount
  function initLoaderDismissal() {
    // If on atacantes.html, atacantes.js handles dismissal after JSON fetch
    var isAtacantes = window.location.pathname.indexOf('atacantes.html') !== -1;
    if (!isAtacantes) {
      setTimeout(function() {
        hideLoader();
        endProgress();
      }, 180);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoaderDismissal);
  } else {
    initLoaderDismissal();
  }

  // Handle browser back/forward buttons (pageshow bfcache)
  window.addEventListener('pageshow', function() {
    hideLoader();
    endProgress();
  });

  // Intercept click on links for smooth full-screen radar transition
  var isNavigating = false;
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.target === '_blank' || link.hasAttribute('download')) {
      return;
    }

    var targetUrl = new URL(href, window.location.href);
    if (targetUrl.origin !== window.location.origin) return;

    // Check if target is an HTML page
    var p = targetUrl.pathname.toLowerCase();
    var isHtml = p.endsWith('.html') || p.endsWith('/') || p.indexOf('.') === -1;
    if (!isHtml) return;

    // Same-page anchor
    if (targetUrl.pathname === window.location.pathname && targetUrl.hash) return;
    if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
      e.preventDefault();
      return;
    }

    if (isNavigating) {
      e.preventDefault();
      return;
    }
    isNavigating = true;

    // Preserve server query params (like IntelliJ ?_ijt=... or filters)
    if (window.location.search && !targetUrl.search) {
      targetUrl.search = window.location.search;
    }

    e.preventDefault();
    showLoader();
    startProgress();

    // Smooth tactical transition: let loader cover screen, then navigate cleanly
    setTimeout(function() {
      window.location.href = targetUrl.href;
    }, 160);
  });
})();

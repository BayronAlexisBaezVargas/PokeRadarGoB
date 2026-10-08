(function(){
  "use strict";

  var locEl = document.getElementById('userLocation');
  if(!locEl) return;

  // Limpiar rastros de la antigua API de ubicación
  try {
    localStorage.removeItem('pokeRadarLocation');
  } catch(e) {}

  // Nuevo comportamiento: Reloj de telemetría dinámica
  function updateTelemetryClock() {
    var now = new Date();
    var day = String(now.getDate()).padStart(2, '0');
    var monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    var month = monthNames[now.getMonth()];
    
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    
    // Parpadeo de los dos puntos cada segundo para efecto "en vivo"
    var separator = now.getSeconds() % 2 === 0 ? ':' : ' ';

    locEl.textContent = '· ' + day + ' ' + month + ' | ' + h + separator + m;
  }

  updateTelemetryClock();
  setInterval(updateTelemetryClock, 1000);

  // Registro del Service Worker para soporte PWA (Offline)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register(window.location.pathname.includes('/assets/') ? 'js/sw.js' : 'assets/js/sw.js').then(function(registration) {
        console.log('PWA: ServiceWorker registrado con éxito', registration.scope);
      }).catch(function(err) {
        console.warn('PWA: Error al registrar ServiceWorker', err);
      });
    });
  }

  // Animaciones híbridas de salida para enlaces internos (Transiciones manuales)
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    // Verificar que sea un enlace interno válido y no uno de otra pestaña
    if (link && link.href && link.target !== '_blank' && link.href.startsWith(window.location.origin) && !link.href.includes('#')) {
      
      // Si el enlace apunta a la página actual exacta, lo ignoramos para evitar la recarga y animación inútil
      var currentPath = window.location.pathname.replace(/\/$/, '');
      var linkPath = link.pathname.replace(/\/$/, '');
      if (currentPath === '' || currentPath === '/') currentPath = '/index.html';
      if (linkPath === '' || linkPath === '/') linkPath = '/index.html';
      
      if (link.href === window.location.href || linkPath === currentPath) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      
      var mainEl = document.querySelector('main');
      var footerEl = document.querySelector('footer');
      var els = [mainEl, footerEl].filter(Boolean);
      
      els.forEach(function(el) {
        el.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        el.style.opacity = '0';
        el.style.transform = 'translateY(-10px)';
      });
      
      setTimeout(function() {
        window.location.href = link.href;
      }, 280);
    }
  });

  // Restaurar los elementos al entrar en la página o al usar el botón "Atrás"
  window.addEventListener('pageshow', function() {
    var els = [document.querySelector('main'), document.querySelector('footer')].filter(Boolean);
    els.forEach(function(el) {
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  });

})();

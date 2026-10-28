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

})();

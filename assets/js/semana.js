(function(){
  "use strict";

  /* ============ Telemetría de Audio ============ */
  var audioCtx = null;
  function initAudio() { if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
  function playClickSound() {
    if(!audioCtx) return;
    if(audioCtx.state === 'suspended') audioCtx.resume();
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
  }

  document.addEventListener('click', function(e){
    initAudio();
    if (e.target.closest('button, a, .day-card')) {
      playClickSound();
    }
  });

  /* ============ Lógica Semanal ============ */
  var weekContainer = document.getElementById('weekContainer');
  var weekRangeDisplay = document.getElementById('weekRangeDisplay');
  var DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  function getWeekRange() {
    var now = new Date();
    // Ajustar para que la semana empiece en Lunes
    var dayOfWeek = now.getDay();
    var distToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    var monday = new Date(now);
    monday.setDate(now.getDate() + distToMonday);
    monday.setHours(0,0,0,0);
    
    var sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23,59,59,999);
    
    return { start: monday, end: sunday, current: now };
  }

  function formatDate(d) {
    return d.getDate() + ' de ' + MONTH_NAMES[d.getMonth()];
  }

  function formatTime(d) {
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if(h === 0) h = 12;
    var strM = m < 10 ? '0'+m : m;
    return h + ':' + strM + ' ' + ampm;
  }

  function getEventTypeClass(title) {
    var t = title.toLowerCase();
    if(t.indexOf('spotlight') !== -1 || t.indexOf('destacada') !== -1) return 'type-spotlight';
    if(t.indexOf('raid hour') !== -1 || t.indexOf('hora de incursiones') !== -1) return 'type-raidhour';
    if(t.indexOf('community day') !== -1 || t.indexOf('día de la comunidad') !== -1) return 'type-community';
    return '';
  }

  function buildCalendar() {
    fetch('https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.json')
      .then(function(res){ return res.json(); })
      .then(function(events){
        var week = getWeekRange();
        weekRangeDisplay.textContent = 'Semana del ' + formatDate(week.start) + ' al ' + formatDate(week.end);

        // Limpiar
        weekContainer.innerHTML = '';
        
        // Procesar eventos (ordenados por fecha de inicio)
        var parsedEvents = events.map(function(e){
          return {
            title: e.name,
            name: e.name, // required by modal
            start: new Date(e.start),
            end: new Date(e.end),
            image: e.image,
            link: e.link,
            heading: e.heading,
            extraData: e.extraData
          };
        }).filter(function(e){
          // Excluir eventos que ensucian el calendario diario:
          // Temporadas (90 días), Ligas de Combate, Pases Mensuales, y Rotaciones de Incursiones Normales.
          if(e.extraData && e.extraData.generic){
             // Si el scraper dice explícitamente qué tipo es, podríamos filtrar así.
          }
          var nameLow = e.name.toLowerCase();
          if(nameLow.indexOf('season') !== -1 || nameLow.indexOf('temporada') !== -1) return false;
          if(nameLow.indexOf('league') !== -1 || nameLow.indexOf('liga') !== -1) return false;
          if(nameLow.indexOf('go pass') !== -1 || nameLow.indexOf('pase go') !== -1) return false;
          if(nameLow.indexOf('raid battles') !== -1 || nameLow.indexOf('mega raids') !== -1 || nameLow.indexOf('shadow raids') !== -1) return false;

          // Limitar por duración para atrapar noticias residuales largas (> 15 días)
          var durationMs = e.end - e.start;
          var days = durationMs / (1000 * 60 * 60 * 24);
          
          return days <= 15;
        });

        // Store for click access
        window._semanaEvents = parsedEvents;

        // Crear una tarjeta para cada día (Lunes a Domingo)
        for(var i=0; i<7; i++) {
          var targetDay = new Date(week.start);
          targetDay.setDate(week.start.getDate() + i);
          
          var dayStart = new Date(targetDay); dayStart.setHours(0,0,0,0);
          var dayEnd = new Date(targetDay); dayEnd.setHours(23,59,59,999);
          
          var isToday = targetDay.toDateString() === week.current.toDateString();

          // Filtrar eventos que ocurren en este día
          var dayEvents = parsedEvents.filter(function(e){
            // Evento activo si empieza antes del final del día y termina después del inicio del día
            return e.start <= dayEnd && e.end >= dayStart;
          });

          // Renderizar tarjeta
          var card = document.createElement('div');
          card.className = 'day-card' + (isToday ? ' is-today' : '');
          
          var headerHTML = '<div class="day-header">' +
            '<span class="day-name">' + DAY_NAMES[targetDay.getDay()] + '</span>' +
            '<span class="day-date">' + formatDate(targetDay) + '</span>' +
            '</div>';
            
          var eventsHTML = '<div class="day-events">';
          if(dayEvents.length === 0) {
            eventsHTML += '<div class="no-events">Sin eventos programados.</div>';
          } else {
            eventsHTML += dayEvents.map(function(e){
              var timeStr = 'Todo el día';
              // Si empieza o termina el mismo día, mostrar horas.
              if(e.start >= dayStart && e.start <= dayEnd && e.end >= dayStart && e.end <= dayEnd) {
                timeStr = formatTime(e.start) + ' - ' + formatTime(e.end);
              } else if (e.start >= dayStart && e.start <= dayEnd) {
                timeStr = 'Inicia: ' + formatTime(e.start);
              } else if (e.end >= dayStart && e.end <= dayEnd) {
                timeStr = 'Termina: ' + formatTime(e.end);
              } else {
                timeStr = 'En curso';
              }

              // Guardamos el idx para recuperar en el click
              var idx = parsedEvents.indexOf(e);

              return '<div class="event-item ' + getEventTypeClass(e.title) + '" data-idx="' + idx + '" style="cursor:pointer;">' +
                '<img src="' + e.image + '" class="event-icon" alt="">' +
                '<div class="event-info">' +
                  '<span class="event-title">' + e.title + '</span>' +
                  '<span class="event-time">' + timeStr + '</span>' +
                '</div>' +
              '</div>';
            }).join('');
          }
          eventsHTML += '</div>';

          card.innerHTML = headerHTML + eventsHTML;
          weekContainer.appendChild(card);
        }

        // Global click delegator para abrir el modal
        weekContainer.addEventListener('click', function(e){
          var item = e.target.closest('.event-item');
          if(item) {
            var idx = parseInt(item.getAttribute('data-idx'), 10);
            if(window._semanaEvents[idx] && window.openEventModal) {
              window.openEventModal(window._semanaEvents[idx]);
            }
          }
        });
      })
      .catch(function(err){
        weekRangeDisplay.textContent = 'Error al sincronizar datos.';
        console.error(err);
      });
  }

  buildCalendar();

})();

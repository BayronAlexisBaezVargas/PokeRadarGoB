(function(){
  "use strict";

  // Telemetría de Audio opcional
  function playBeep() {
    if (window.playScanSound) {
      window.playScanSound();
    }
  }

  /* ============ Elementos del DOM ============ */
  var weekContainer = document.getElementById('weekContainer');
  var weekRangeDisplay = document.getElementById('weekRangeDisplay');
  var weekNavBadge = document.getElementById('weekNavBadge');
  var prevWeekBtn = document.getElementById('prevWeekBtn');
  var nextWeekBtn = document.getElementById('nextWeekBtn');
  var todayWeekBtn = document.getElementById('todayWeekBtn');
  var weekSundayHint = document.getElementById('weekSundayHint');

  var DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  /* ============ Estado Global ============ */
  var currentWeekOffset = 0;
  var rawEventsList = [];
  var renderedEventsMap = [];
  var calendarReady = false;
  var viewState = createViewState('events-week', function () {
    var range = getWeekRange(currentWeekOffset);
    return { monday: range.start.getFullYear() + '-' + (range.start.getMonth() + 1) + '-' + range.start.getDate() };
  });
  if (typeof viewState.saved.monday === 'string' && /^\d{4}-\d{1,2}-\d{1,2}$/.test(viewState.saved.monday)) {
    var parts = viewState.saved.monday.split('-').map(Number);
    var currentMonday = getWeekRange(0).start;
    var difference = Date.UTC(parts[0], parts[1] - 1, parts[2]) - Date.UTC(currentMonday.getFullYear(), currentMonday.getMonth(), currentMonday.getDate());
    currentWeekOffset = Math.round(difference / 604800000);
    if (!Number.isFinite(currentWeekOffset) || Math.abs(currentWeekOffset) > 520) currentWeekOffset = 0;
  }

  /* ============ Diccionario y Traductor Dinámico ============ */
  var NAME_TRANSLATIONS = {
    'Fall Marathon: Buddy Trek': 'Maratón de Otoño: Caminata de Compañero',
    'Pokémon TCG: 30th Celebration': 'Celebración 30.º Aniversario Pokémon TCG',
    'Pokémon GO Halloween 2026 Part I': 'Pokémon GO Halloween 2026 (Parte 1)',
    'Pokémon GO Halloween 2026 Part II': 'Pokémon GO Halloween 2026 (Parte 2)',
    'Super Mega Raid Day': 'Día Especial de Megaincursiones',
    'Shadow Landorus (Incarnate Forme) in Shadow Raids': 'Landorus Avatar Sombra en Incursiones Sombra',
    'Dynamax Uxie, Mesprit, and Azelf Max Battle Day': 'Día de Combates Max: Trío del Lago Dinamax',
    'Mega Charizard X and Mega Charizard Y in Mega Raids': 'Mega Charizard X e Y en Megaincursiones',
    'Harvest Festival': 'Festival de la Cosecha',
    'Catch Mastery': 'Dominio de Captura'
  };

  function translateTitle(raw) {
    if (!raw) return '';
    var clean = raw.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
    if (NAME_TRANSLATIONS[clean]) return NAME_TRANSLATIONS[clean];

    var m = clean.match(/^Dynamax\s+(.+?)\s+during\s+Max\s+Monday$/i);
    if (m) return 'Lunes Dinamax: ' + m[1] + ' Dinamax';

    m = clean.match(/^(.+?)\s+in\s+5-star\s+Raid\s+Battles$/i);
    if (m) return m[1] + ' en Incursiones 5★';

    m = clean.match(/^(.+?)\s+in\s+Mega\s+Raids$/i);
    if (m) return m[1] + ' en Megaincursiones';

    m = clean.match(/^(.+?)\s+in\s+Shadow\s+Raids$/i);
    if (m) return m[1] + ' en Incursiones Sombra';

    m = clean.match(/^(.+?)\s+Raid\s+Hour$/i);
    if (m) return 'Hora de Incursiones: ' + m[1];

    m = clean.match(/^(.+?)\s+Spotlight\s+Hour$/i);
    if (m) return 'Hora Destacada: ' + m[1];

    m = clean.match(/^(.+?)\s+Hatch\s+Day$/i);
    if (m) return 'Día de Eclosiones: ' + m[1];

    m = clean.match(/^(.+?)\s+Community\s+Day\s+Classic$/i);
    if (m) return 'Día de la Comunidad Clásico: ' + m[1];

    m = clean.match(/^(.+?)\s+Community\s+Day$/i);
    if (m) return 'Día de la Comunidad: ' + m[1];

    m = clean.match(/^(.+?)\s+Max\s+Battle\s+Day$/i);
    if (m) return 'Día de Combates Max: ' + m[1];

    return clean;
  }

  /* ============ Clasificación y Prioridad de Eventos ============ */
  function getEventMeta(e) {
    var t = (e.name || '').toLowerCase();
    var h = (e.heading || '').toLowerCase();

    if (t.indexOf('spotlight') !== -1 || h.indexOf('spotlight') !== -1) {
      return { cls: 'type-spotlight', tag: 'Destacada', priority: 1 };
    }
    if (t.indexOf('raid hour') !== -1 || h.indexOf('raid hour') !== -1) {
      return { cls: 'type-raidhour', tag: 'Incursión', priority: 2 };
    }
    if (t.indexOf('max monday') !== -1 || h.indexOf('max monday') !== -1) {
      return { cls: 'type-dynamax', tag: 'Dinamax', priority: 3 };
    }
    if (t.indexOf('community day') !== -1 || h.indexOf('community') !== -1) {
      return { cls: 'type-community', tag: 'Comunidad', priority: 4 };
    }
    if (t.indexOf('hatch day') !== -1) {
      return { cls: 'type-hatch', tag: 'Eclosión', priority: 5 };
    }
    if (t.indexOf('max battle day') !== -1 || h.indexOf('max battle') !== -1) {
      return { cls: 'type-dynamax', tag: 'Combate Max', priority: 5 };
    }
    if (t.indexOf('mega raids') !== -1 || t.indexOf('mega raid') !== -1) {
      return { cls: 'type-raid', tag: 'Megaincursión', priority: 7 };
    }
    if (t.indexOf('5-star') !== -1 || t.indexOf('raid battles') !== -1) {
      return { cls: 'type-raid', tag: 'Incursión 5★', priority: 8 };
    }
    if (t.indexOf('shadow raids') !== -1 || t.indexOf('shadow raid') !== -1) {
      return { cls: 'type-raid', tag: 'Incursión Sombra', priority: 9 };
    }
    if (h === 'event' || t.indexOf('event') !== -1) {
      return { cls: 'type-event', tag: 'Evento', priority: 6 };
    }
    return { cls: 'type-event', tag: 'Evento', priority: 10 };
  }

  /* ============ Filtrado de Agenda Semanal ============ */
  function filterCalendarEvents(events) {
    return events.filter(function(e){
      if (!e.start || !e.end) return false;
      var s = new Date(e.start);
      var end = new Date(e.end);
      if (isNaN(s.getTime()) || isNaN(end.getTime())) return false;

      var durationDays = (end.getTime() - s.getTime()) / (1000 * 60 * 60 * 24);
      var nameLow = (e.name || '').toLowerCase();
      var heading = (e.heading || '').toLowerCase();

      // 1. Excluir temporadas de 3 meses (84 a 90 días)
      if (heading === 'season' || nameLow.indexOf('season') !== -1 || nameLow.indexOf('temporada') !== -1) return false;

      // 2. Excluir pases mensuales de temporada
      if (heading === 'go pass' || nameLow.indexOf('go pass') !== -1 || nameLow.indexOf('pase go') !== -1) return false;

      // 3. Excluir rotaciones de Liga Combates GO que saturan la vista
      if (heading === 'go battle league' || nameLow.indexOf('go battle league') !== -1) return false;

      // 4. Excluir investigaciones de varios meses (ej. adidas 112 días)
      if (heading === 'research' && durationDays > 28) return false;

      // 5. Excluir cualquier evento genérico superior a 30 días
      if (durationDays > 30) return false;

      return true;
    });
  }

  /* ============ Cálculo de Rango Semanal ============ */
  function getWeekRange(offset) {
    offset = offset || 0;
    var now = new Date();
    var dayOfWeek = now.getDay(); // 0: Dom, 1: Lun, 2: Mar ... 6: Sáb
    var distToMonday = dayOfWeek === 0 ? -6 : (1 - dayOfWeek);

    var monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + distToMonday + (offset * 7), 0, 0, 0, 0);
    var sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6, 23, 59, 59, 999);

    return {
      start: monday,
      end: sunday,
      current: now,
      offset: offset,
      isCurrentWeek: offset === 0,
      isSundayToday: dayOfWeek === 0
    };
  }

  function formatDate(d) {
    return d.getDate() + ' de ' + MONTH_NAMES[d.getMonth()];
  }

  function formatTime(d) {
    var h = d.getHours();
    var m = d.getMinutes();
    var strH = h < 10 ? '0' + h : '' + h;
    var strM = m < 10 ? '0' + m : '' + m;
    return strH + ':' + strM;
  }

  /* ============ Renderizado del Calendario ============ */
  function renderWeek() {
    var week = getWeekRange(currentWeekOffset);

    // 1. Barra de estado y título
    if (weekRangeDisplay) {
      weekRangeDisplay.textContent = 'Semana del ' + formatDate(week.start) + ' al ' + formatDate(week.end);
    }

    if (weekNavBadge) {
      weekNavBadge.className = 'week-badge';
      if (currentWeekOffset === 0) {
        weekNavBadge.textContent = 'Semana en curso';
      } else if (currentWeekOffset === 1) {
        weekNavBadge.classList.add('is-upcoming');
        weekNavBadge.textContent = 'Próxima semana';
      } else if (currentWeekOffset > 1) {
        weekNavBadge.classList.add('is-upcoming');
        weekNavBadge.textContent = '+' + currentWeekOffset + ' semanas';
      } else if (currentWeekOffset === -1) {
        weekNavBadge.classList.add('is-past');
        weekNavBadge.textContent = 'Semana anterior';
      } else {
        weekNavBadge.classList.add('is-past');
        weekNavBadge.textContent = currentWeekOffset + ' semanas';
      }
    }

    if (todayWeekBtn) {
      todayWeekBtn.style.display = 'inline-flex';
    }

    // 2. Banner sugerencia de domingo
    if (weekSundayHint) {
      if (week.isCurrentWeek && week.isSundayToday) {
        weekSundayHint.style.display = 'flex';
        weekSundayHint.innerHTML = '<span><strong>Hoy es domingo.</strong> Explora la programación de la próxima semana que comienza mañana.</span>' +
          '<button id="sundayJumpBtn" type="button">Ver próxima semana</button>';
        var jBtn = document.getElementById('sundayJumpBtn');
        if (jBtn) {
          jBtn.addEventListener('click', function(){
            currentWeekOffset = 1;
            playBeep();
            renderWeek();
          });
        }
      } else {
        weekSundayHint.style.display = 'none';
        weekSundayHint.innerHTML = '';
      }
    }

    if (!calendarReady) return;
    weekContainer.removeAttribute("aria-busy");

    // 3. Filtrar dataset
    var activePool = filterCalendarEvents(rawEventsList);
    renderedEventsMap = [];
    weekContainer.innerHTML = '';

    // 4. Renderizar tarjetas de los 7 días (Lunes a Domingo)
    for (var i = 0; i < 7; i++) {
      var targetDay = new Date(week.start.getFullYear(), week.start.getMonth(), week.start.getDate() + i, 0, 0, 0, 0);
      var dayStart = new Date(targetDay);
      var dayEnd = new Date(targetDay.getFullYear(), targetDay.getMonth(), targetDay.getDate(), 23, 59, 59, 999);

      var isToday = targetDay.toDateString() === week.current.toDateString();
      var isWeekend = (targetDay.getDay() === 0 || targetDay.getDay() === 6);

      // Filtrar eventos activos en este día
      var dayEvents = activePool.filter(function(e){
        var eStart = new Date(e.start);
        var eEnd = new Date(e.end);

        if (eStart > dayEnd || eEnd < dayStart) return false;

        // Incursiones Sombra mensuales (> 10 días): solo aparecen sábados y domingos en Pokémon GO
        var nameLow = (e.name || '').toLowerCase();
        var durDays = (eEnd.getTime() - eStart.getTime()) / (1000 * 60 * 60 * 24);
        if ((nameLow.indexOf('shadow raid') !== -1 || (e.heading || '').toLowerCase().indexOf('shadow') !== -1) && durDays > 10) {
          return isWeekend;
        }

        return true;
      });

      // Ordenar por relevancia táctica
      dayEvents.sort(function(a, b){
        var metaA = getEventMeta(a);
        var metaB = getEventMeta(b);
        return metaA.priority - metaB.priority;
      });

      // Construir tarjeta HTML
      var card = document.createElement('article');
      card.dataset.viewKey = targetDay.toDateString();
      card.className = 'day-card' + (isToday ? ' is-today' : dayEnd < week.current ? ' is-past-day' : '');
      if(isToday) card.setAttribute('aria-current', 'date');

      var headerHTML = '<header class="day-header">' +
        '<div class="day-name-wrap">' +
          '<span class="day-name">' + DAY_NAMES[targetDay.getDay()] + '</span>' +
          (isToday ? '<span class="today-pill">HOY</span>' : '') +
        '</div>' +
        '<span class="day-date">' + formatDate(targetDay) + '</span>' +
      '</header>';

      var eventsHTML = '<div class="day-events">';

      if (dayEvents.length === 0) {
        eventsHTML += '<div class="no-events">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.8" fill="currentColor"/></svg>' +
          '<span>Sin eventos programados</span>' +
        '</div>';
      } else {
        eventsHTML += dayEvents.map(function(e){
          var eStart = new Date(e.start);
          var eEnd = new Date(e.end);
          var meta = getEventMeta(e);
          var titleEs = translateTitle(e.name);

          // Cálculo del horario amigable
          var timeStr = 'Todo el día';
          if (eStart >= dayStart && eStart <= dayEnd && eEnd >= dayStart && eEnd <= dayEnd) {
            timeStr = formatTime(eStart) + ' – ' + formatTime(eEnd) + ' hrs';
          } else if (eStart >= dayStart && eStart <= dayEnd) {
            timeStr = 'Inicia ' + formatTime(eStart) + ' hrs';
          } else if (eEnd >= dayStart && eEnd <= dayEnd) {
            timeStr = 'Termina ' + formatTime(eEnd) + ' hrs';
          } else {
            timeStr = 'Todo el día';
          }

          // Guardar referencia para modal
          var mapIdx = renderedEventsMap.length;
          renderedEventsMap.push({
            name: titleEs,
            rawName: e.name,
            heading: meta.tag,
            image: e.image || 'img/favicon.svg',
            link: e.link || '#',
            start: e.start,
            end: e.end,
            extraData: e.extraData || {}
          });

          var fallbackImg = 'img/favicon.svg';
          var imgSrc = e.image || fallbackImg;

          return '<div class="event-item ' + meta.cls + '" data-start="' + eStart.getTime() + '" data-end="' + eEnd.getTime() + '" data-map-idx="' + mapIdx + '" role="button" tabindex="0" aria-label="Ver detalles de ' + titleEs + '">' +
            '<img src="' + imgSrc + '" class="event-icon" width="44" height="44" loading="lazy" alt="" onerror="this.onerror=null;this.src=\'' + fallbackImg + '\';">' +
            '<div class="event-info">' +
              '<div class="event-meta-row">' +
                '<span class="event-type-pill">' + meta.tag + '</span>' +
                '<span class="event-state ui-status"></span>' +
              '</div>' +
              '<span class="event-title">' + titleEs + '</span>' +
              '<span class="event-time">' + timeStr + '</span>' +
            '</div>' +
          '</div>';
        }).join('');
      }

      eventsHTML += '</div>';
      card.innerHTML = headerHTML + eventsHTML;
      weekContainer.appendChild(card);
    }

    updateEventStates();
    viewState.restore();
  }

  function updateEventStates(){
    var now = Date.now();
    document.querySelectorAll('.event-item[data-start]').forEach(function(item){
      var start = Number(item.dataset.start);
      var end = Number(item.dataset.end);
      var state = now >= end ? 'ended' : now >= start ? 'live' : 'upcoming';
      item.dataset.state = state;
      item.querySelector('.event-state').dataset.state = state;
      item.querySelector('.event-state').textContent = state === 'ended' ? 'Finalizado' : state === 'live' ? 'En curso' : 'Próximo';
    });
  }
  setInterval(updateEventStates, 60000);

  /* ============ Navegación de Semanas ============ */
  function changeWeek(delta) {
    currentWeekOffset += delta;
    playBeep();
    renderWeek();
  }

  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', function(){ changeWeek(-1); });
  }

  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', function(){ changeWeek(1); });
  }

  if (todayWeekBtn) {
    todayWeekBtn.addEventListener('click', function(){
      if (currentWeekOffset !== 0) {
        currentWeekOffset = 0;
        playBeep();
        renderWeek();
      }
      var today = weekContainer.querySelector('.is-today');
      if(today) today.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'});
    });
  }

  // Navegación rápida por teclado (Flechas Izquierda / Derecha)
  document.addEventListener('keydown', function(e){
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
    var modal = document.getElementById('evtModal');
    if (modal && modal.open) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      changeWeek(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      changeWeek(1);
    }
  });

  // Delegación de clic y accesibilidad Enter/Espacio en tarjetas de eventos
  if (weekContainer) {
    weekContainer.addEventListener('click', function(e){
      var item = e.target.closest('.event-item');
      if (item) {
        var idx = parseInt(item.getAttribute('data-map-idx'), 10);
        if (renderedEventsMap[idx] && window.openEventModal) {
          window.openEventModal(renderedEventsMap[idx]);
        }
      }
    });

    weekContainer.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') {
        var item = e.target.closest('.event-item');
        if (item) {
          e.preventDefault();
          var idx = parseInt(item.getAttribute('data-map-idx'), 10);
          if (renderedEventsMap[idx] && window.openEventModal) {
            window.openEventModal(renderedEventsMap[idx]);
          }
        }
      }
    });
  }

  /* ============ Sincronización y Carga de Datos ============ */
  function initCalendar() {
    renderWeek();
    RadarData.load({
      key: 'pokeradar_events_v1',
      url: 'https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.json',
      validate: RadarData.events,
      render: function (data) { calendarReady = true; rawEventsList = data; renderWeek(); },
      loading: function () { RadarData.loading(weekContainer, 'Cargando agenda…'); },
      error: function () {
        RadarData.message(weekContainer, 'No pudimos cargar la agenda. Vuelve a entrar cuando tengas conexión.');
        viewState.restore();
      }
    });
  }

  initCalendar();

})();

(function(){
  "use strict";

  /* ============ Configuración y Categorías ============ */
  var CATEGORIES = {
    'community-day': { label: 'Día de la Comunidad', color: '#FF7A45', perks: ['Mayor probabilidad de variocolor', 'Ataque exclusivo por evolución', 'Módulos cebo e Incienso de 3 h', 'Bonus especial de captura'] },
    'pokemon-spotlight-hour': { label: 'Hora Destacada', color: '#F3D23B', perks: ['Aparición masiva (18:00 – 19:00 hrs)', 'Bonus de captura y transferencia'] },
    'raid-hour': { label: 'Hora de Incursiones', color: '#3DF2C4', perks: ['Mayor frecuencia de incursiones 5★', 'Horario de 18:00 – 19:00 hrs'] },
    'raid-battles': { label: 'Incursiones', color: '#4C9FE8', perks: ['Jefes legendarios y megaincursiones', 'Disponibles en gimnasios'] },
    'raid-day': { label: 'Día de Incursiones', color: '#FF5A44', perks: ['Hasta 5 pases de incursión diarios', 'Mayor ratio de variocolor legendario'] },
    'max-mondays': { label: 'Lunes Dinamax', color: '#E9A0D0', perks: ['Frecuencia aumentada en Nodos Dinamax', 'Horario de 18:00 – 19:00 hrs'] },
    'max-battles': { label: 'Combates Max', color: '#A55FD1', perks: ['Jefes Dinamax y Gigamax', 'Uso de Partículas Max'] },
    'pokemon-go-fest': { label: 'Pokémon GO Fest', color: '#FFD700', perks: ['Hábitats especiales', 'Ultrabonus e investigaciones de élite'] },
    'go-battle-league': { label: 'Liga Combates GO', color: '#9FAAC0', perks: ['Copas temáticas y rotaciones de liga', 'Recompensas de Polvo Estelar'] },
    'go-pass': { label: 'Pase GO', color: '#6FD4C8', perks: ['Misiones de temporada e insignias', 'Recompensas escalonadas'] },
    'season': { label: 'Temporada', color: '#6FBE5A', perks: ['Rotación trimestral de silvestres', 'Bonus globales de temporada'] },
    'research': { label: 'Investigación y Drops', color: '#6E5AE6', perks: ['Tareas especiales y recompensas exclusivas'] },
    'event': { label: 'Evento Especial', color: '#3DF2C4', perks: ['Apariciones silvestres temáticas', 'Bonus de evento'] }
  };

  /* ============ Traducciones y normalizaciones de nombres ============ */
  var NAME_TRANSLATIONS = {
    'Regirock, Regice, and Registeel Raid Hour': 'Hora de Incursiones: Regirock, Regice y Registeel',
    'Mankey Spotlight Hour': 'Hora Destacada: Mankey',
    'Weedle, Kakuna, and Beedrill Spotlight Hour': 'Hora Destacada: Weedle, Kakuna y Beedrill',
    'Houndour and Houndoom Spotlight Hour': 'Hora Destacada: Houndour y Houndoom',
    'Rattata Spotlight Hour': 'Hora Destacada: Rattata',
    'Mystery Pokémon Spotlight Hour': 'Hora Destacada: Pokémon Sorpresa',
    'Dynamax Eevee during Max Monday': 'Lunes Dinamax: Eevee Dinamax',
    'Dynamax Ralts during Max Monday': 'Lunes Dinamax: Ralts Dinamax',
    'Dynamax Rhyhorn during Max Monday': 'Lunes Dinamax: Rhyhorn Dinamax',
    'Dynamax Articuno, Zapdos, and Moltres during Max Monday': 'Lunes Dinamax: Trío de Aves Legendarias (Articuno, Zapdos, Moltres)',
    'Dynamax Sobble during Max Monday': 'Lunes Dinamax: Sobble Dinamax',
    'September Community Day Classic': 'Día de la Comunidad Clásico · Septiembre',
    'October Community Day': 'Día de la Comunidad · Octubre',
    'November Community Day': 'Día de la Comunidad · Noviembre',
    'Twitch Drops for 2026 Pokémon World Championships': 'Drops de Twitch · Campeonato Mundial Pokémon 2026',
    'PokémonXP & 2026 Worlds': 'Evento PokémonXP & Mundial de Pokémon 2026',
    'Mega Ascension': 'Megaascensión · Evento Especial',
    'Pokémon GO Fest 2026: Mega Finale': 'Pokémon GO Fest 2026: Gran Final Mega',
    '10th Anniversary Celebration - Perfect Mewtwo Timed Research': 'Investigación Temporal: Mewtwo Perfecto · 10.º Aniversario',
    'Mega Squads': 'Escuadrones Mega · Evento Temático',
    'Catch Mastery': 'Dominio de Captura · Desafío de Campo',
    'Harvest Festival': 'Festival de la Cosecha',
    'Hatch Day': 'Día de Eclosiones',
    'Super Mega Raid Day': 'Día Especial de Megaincursiones',
    'Max Battle Day': 'Día de Combates Max',
    'Forever Forward': 'Temporada: Forever Forward',
    'Twilight Trails': 'Temporada: Twilight Trails (Senderos del Crepúsculo)',
    'Zacian (Hero of Many Battles) Raid Hour': 'Hora de Incursiones: Zacian (Espada Suprema)',
    'Zamazenta (Hero of Many Battles) Raid Hour': 'Hora de Incursiones: Zamazenta (Escudo Supremo)',
    'Xurkitree, Pheromosa, and Buzzwole Raid Hour': 'Hora de Incursiones: Ultraentes (Xurkitree, Pheromosa, Buzzwole)',
    'Xerneas Raid Hour': 'Hora de Incursiones: Xerneas',
    'Zacian (Hero of Many Battles) in 5-star Raid Battles': 'Zacian (Espada Suprema) en Incursiones 5★',
    'Zamazenta (Hero of Many Battles) in 5-star Raid Battles': 'Zamazenta (Escudo Supremo) en Incursiones 5★',
    'Mega Gyarados in Mega Raids': 'Mega Gyarados en Megaincursiones',
    'Mega Beedrill in Mega Raids': 'Mega Beedrill en Megaincursiones',
    'Mega Houndoom in Mega Raids': 'Mega Houndoom en Megaincursiones',
    'Mega Venusaur in Mega Raids': 'Mega Venusaur en Megaincursiones',
    'Mega Malamar in Mega Raids': 'Mega Malamar en Megaincursiones',
    'Mega Victreebel in Mega Raids': 'Mega Victreebel en Megaincursiones',
    'Xurkitree, Pheromosa, and Buzzwole in 5-star Raid Battles': 'Ultraentes (Xurkitree, Pheromosa, Buzzwole) en Incursiones 5★',
    'Xerneas in 5-star Raid Battles': 'Xerneas en Incursiones 5★',
    'Shadow Giratina (Altered Forme) in Shadow Raids': 'Giratina Forma Modificada Sombra en Incursiones Sombra',
    'Shadow Thundurus (Incarnate Forme) in Shadow Raids': 'Thundurus Forma Avatar Sombra en Incursiones Sombra',
    'Mega Swampert in Mega Raids': 'Mega Swampert en Megaincursiones',
    'Lunala in 5-star Raid Battles': 'Lunala en Incursiones 5★',
    'Regirock, Regice, and Registeel in 5-star Raid Battles': 'Titanes Legendarios (Regirock, Regice, Registeel) en Incursiones 5★',
    'Fall Marathon: Buddy Trek': 'Maratón de Otoño: Caminata de Compañero',
    'Pokémon TCG: 30th Celebration': 'Celebración 30.º Aniversario Pokémon TCG',
    'Pokémon GO Halloween 2026 Part I': 'Pokémon GO Halloween 2026 (Parte 1)',
    'Pokémon GO Halloween 2026 Part II': 'Pokémon GO Halloween 2026 (Parte 2)',
    'Shadow Landorus (Incarnate Forme) in Shadow Raids': 'Landorus Avatar Sombra en Incursiones Sombra',
    'Dynamax Uxie, Mesprit, and Azelf Max Battle Day': 'Día de Combates Max: Trío del Lago Dinamax',
    'Mega Charizard X and Mega Charizard Y in Mega Raids': 'Mega Charizard X e Y en Megaincursiones'
  };

  /* ============ Variables de Estado ============ */
  var allEvents = [];
  var activeTimeFilter = 'all';
  var selectedCategory = 'all';
  var searchQuery = '';
  var eventRegistry = {};
  var eventsReady = false;
  var viewState = createViewState('events-list', function () {
    return { time: activeTimeFilter, category: selectedCategory, search: searchQuery,
      categoriesOpen: document.getElementById('eventCategoryFilter').open };
  });
  var savedView = viewState.saved;
  activeTimeFilter = ['all', 'live', 'week', 'future'].includes(savedView.time) ? savedView.time : 'all';
  selectedCategory = typeof savedView.category === 'string' ? savedView.category : 'all';
  searchQuery = typeof savedView.search === 'string' ? savedView.search : '';
  document.getElementById('eventSearchInput').value = searchQuery;
  document.getElementById('eventCategoryFilter').open = savedView.categoriesOpen === true;

  /* ============ Utilidades de Formato y Tiempo ============ */
  var MONTH_NAMES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var DAY_NAMES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  function norm(str){
    return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function cleanTitle(rawName){
    if(!rawName) return '';
    var clean = rawName.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
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

  function formatCompactDateRange(startDate, endDate){
    if(!startDate) return 'Por confirmar';
    var d = startDate.getDate();
    var m = MONTH_NAMES[startDate.getMonth()].slice(0, 3);
    var dayName = DAY_NAMES[startDate.getDay()].slice(0, 3);
    var tStart = formatTime(startDate);

    if(!endDate){
      return dayName + ' ' + d + ' ' + m + ' · ' + tStart;
    }

    var sameDay = startDate.getFullYear() === endDate.getFullYear() &&
                  startDate.getMonth() === endDate.getMonth() &&
                  startDate.getDate() === endDate.getDate();

    if(sameDay){
      var tEnd = formatTime(endDate);
      return dayName + ' ' + d + ' ' + m + ' · ' + tStart + ' – ' + tEnd;
    }

    var d2 = endDate.getDate();
    var m2 = MONTH_NAMES[endDate.getMonth()].slice(0, 3);
    return d + ' ' + m + ' – ' + d2 + ' ' + m2;
  }

  function parseDate(dStr){
    if(!dStr) return null;
    var d = new Date(dStr);
    if(isNaN(d.getTime())){
      d = new Date(String(dStr).replace(' ', 'T'));
    }
    return isNaN(d.getTime()) ? null : d;
  }

  function formatTime(d){
    var h = String(d.getHours()).padStart(2, '0');
    var m = String(d.getMinutes()).padStart(2, '0');
    return h + ':' + m;
  }

  function formatDateRange(startDate, endDate){
    if(!startDate) return 'Fecha por confirmar';
    var d = startDate.getDate();
    var m = MONTH_NAMES[startDate.getMonth()];
    var dayName = DAY_NAMES[startDate.getDay()];
    var tStart = formatTime(startDate);

    if(!endDate){
      return dayName + ', ' + d + ' de ' + m + ' · ' + tStart + ' hrs';
    }

    var sameDay = startDate.getFullYear() === endDate.getFullYear() &&
                  startDate.getMonth() === endDate.getMonth() &&
                  startDate.getDate() === endDate.getDate();

    if(sameDay){
      var tEnd = formatTime(endDate);
      return dayName + ', ' + d + ' de ' + m + ' · ' + tStart + ' – ' + tEnd + ' hrs';
    }

    var d2 = endDate.getDate();
    var m2 = MONTH_NAMES[endDate.getMonth()];
    return d + ' ' + m.slice(0,3) + ' (' + tStart + ' hrs) – ' + d2 + ' ' + m2.slice(0,3) + ' (' + formatTime(endDate) + ' hrs)';
  }

  function getEventStatus(start, end){
    var now = Date.now();
    var sTime = start ? start.getTime() : 0;
    var eTime = end ? end.getTime() : Infinity;

    if(now >= sTime && now <= eTime){
      return { code: 'live', label: 'En curso', priority: 1 };
    }

    if(now > eTime){
      return { code: 'ended', label: 'Finalizado', priority: 5 };
    }

    // Próximos
    var nowDate = new Date();
    var isToday = start && start.getFullYear() === nowDate.getFullYear() &&
                  start.getMonth() === nowDate.getMonth() &&
                  start.getDate() === nowDate.getDate();

    if(isToday){
      return { code: 'today', label: 'Hoy', priority: 2 };
    }

    var tomorrow = new Date(nowDate.getTime() + 86400000);
    var isTomorrow = start && start.getFullYear() === tomorrow.getFullYear() &&
                     start.getMonth() === tomorrow.getMonth() &&
                     start.getDate() === tomorrow.getDate();

    if(isTomorrow){
      return { code: 'soon', label: 'Mañana', priority: 3 };
    }

    var diffDays = Math.ceil((sTime - now) / 86400000);
    if(diffDays <= 7){
      return { code: 'soon', label: 'En ' + diffDays + ' días', priority: 3 };
    }

    return { code: 'upcoming', label: 'Próximamente', priority: 4 };
  }

  function getCountdownString(start, end){
    var now = Date.now();
    var sTime = start ? start.getTime() : 0;
    var eTime = end ? end.getTime() : 0;

    if(now >= sTime && now <= eTime){
      var diffEnd = eTime - now;
      var mins = Math.floor(diffEnd / 60000);
      var hours = Math.floor(mins / 60);
      var days = Math.floor(hours / 24);
      if(days > 0) return 'Termina en ' + days + ' d ' + (hours % 24) + ' h';
      if(hours > 0) return 'Termina en ' + hours + ' h ' + (mins % 60) + ' min';
      return 'Termina en ' + mins + ' min';
    }

    if(now < sTime){
      var diffStart = sTime - now;
      var mins2 = Math.floor(diffStart / 60000);
      var hours2 = Math.floor(mins2 / 60);
      var days2 = Math.floor(hours2 / 24);
      if(days2 > 0) return 'Comienza en ' + days2 + ' d ' + (hours2 % 24) + ' h';
      if(hours2 > 0) return 'Comienza en ' + hours2 + ' h ' + (mins2 % 60) + ' min';
      return 'Comienza en ' + mins2 + ' min';
    }

    return 'Evento finalizado';
  }

  function getShortCountdownString(start, end){
    var now = Date.now();
    var sTime = start ? start.getTime() : 0;
    var eTime = end ? end.getTime() : 0;

    if(now >= sTime && now <= eTime){
      var diffEnd = eTime - now;
      var mins = Math.floor(diffEnd / 60000);
      var hours = Math.floor(mins / 60);
      var days = Math.floor(hours / 24);
      if(days > 0) return 'Quedan ' + days + 'd ' + (hours % 24) + 'h';
      if(hours > 0) return 'Quedan ' + hours + 'h ' + (mins % 60) + 'm';
      return 'Quedan ' + Math.max(1, mins) + 'm';
    }

    if(now < sTime){
      var diffStart = sTime - now;
      var mins2 = Math.floor(diffStart / 60000);
      var hours2 = Math.floor(mins2 / 60);
      var days2 = Math.floor(hours2 / 24);
      if(days2 > 0) return 'En ' + days2 + 'd ' + (hours2 % 24) + 'h';
      if(hours2 > 0) return 'En ' + hours2 + 'h ' + (mins2 % 60) + 'm';
      return 'En ' + Math.max(1, mins2) + 'm';
    }

    return 'Finalizado';
  }

  function extractPerks(ev){
    var perks = [];
    var cat = CATEGORIES[ev.eventType];
    if(ev.extraData && ev.extraData.generic && ev.extraData.generic.perks){
      perks = perks.concat(ev.extraData.generic.perks);
    } else if(cat && cat.perks){
      perks = perks.concat(cat.perks.slice(0, 3));
    }

    var title = norm(ev.name);
    if(title.indexOf('spotlight') !== -1 && perks.length === 0){
      perks.push('Aparición masiva', 'Bonus de captura');
    }
    if(title.indexOf('raid hour') !== -1 && perks.length === 0){
      perks.push('Incursiones 5★ en gimnasios', 'Horario 18:00 – 19:00');
    }
    return perks.slice(0, 4);
  }

  function extractBosses(ev){
    if(ev.extraData && ev.extraData.raidbattles && ev.extraData.raidbattles.bosses){
      return ev.extraData.raidbattles.bosses;
    }
    return [];
  }

  /* ============ Renderizado de Tarjeta de Evento ============ */
  function renderEventCard(ev){
    var startDate = parseDate(ev.start);
    var endDate = parseDate(ev.end);
    var status = getEventStatus(startDate, endDate);
    var category = CATEGORIES[ev.eventType] || { label: ev.heading || 'Evento', color: '#3df2c4' };
    var cleanName = cleanTitle(ev.name);
    var dateStr = formatDateRange(startDate, endDate);
    var countdown = getCountdownString(startDate, endDate);
    var perks = extractPerks(ev);
    var bosses = extractBosses(ev);
    var evKey = encodeURIComponent(ev.eventID || [ev.name, ev.start, ev.end].join('|'));
    
    eventRegistry[evKey] = {
      raw: ev,
      cleanName: cleanName,
      category: category,
      status: status,
      startDate: startDate,
      endDate: endDate,
      dateStr: dateStr,
      countdown: countdown,
      perks: perks,
      bosses: bosses
    };

    var perksHTML = perks.map(function(p){
      return '<span class="event-perk-chip">' + p + '</span>';
    }).join('');

    var bossesHTML = '';
    if(bosses.length > 0){
      bossesHTML = '<div class="event-bosses">' +
        '<span class="event-bosses-label">Jefes:</span>' +
        bosses.map(function(b){
          return '<div class="event-boss-avatar" title="' + b.name + '">' +
            '<img src="' + b.image + '" alt="' + b.name + '" width="28" height="28" loading="lazy" onerror="this.onerror=null;this.src=\'img/favicon.svg\';" />' +
            (b.canBeShiny ? '<span class="ui-badge ui-badge-shiny ui-badge-icon" title="Puede aparecer en su variante Shiny" aria-label="Shiny disponible"></span>' : '') +
          '</div>';
        }).join('') +
      '</div>';
    }

    var fallbackImg = 'img/favicon.svg';
    var imgSrc = ev.image || fallbackImg;

    var excerpt = '';
    if (ev.heading && ev.heading.toLowerCase() !== 'event' && norm(ev.heading) !== norm(cleanName)) {
      excerpt = '<div class="event-excerpt">' + ev.heading + '</div>';
    }

    var cardClass = 'event-card reveal' + (status.code === 'live' ? ' is-live' : '');

    return (
      '<article class="' + cardClass + '" data-ev-key="' + evKey + '" data-cat="' + ev.eventType + '" data-status="' + status.code + '" tabindex="0" role="button" aria-label="Ver detalles de ' + cleanName + '">' +
        '<div class="event-media">' +
          '<img class="event-media-img" src="' + imgSrc + '" alt="' + cleanName + '" width="640" height="360" loading="lazy" onerror="this.onerror=null;this.src=\'' + fallbackImg + '\';" />' +
          '<div class="event-media-overlay"></div>' +
          '<div class="event-tags-bar">' +
            '<span class="event-cat-tag" style="color:' + category.color + ';border-color:' + category.color + '44;">' + category.label + '</span>' +
            '<span class="event-status-tag ui-status" data-state="' + status.code + '">' + status.label + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="event-content">' +
          '<h3 class="event-title">' + cleanName + '</h3>' +
          excerpt +
          '<div class="event-meta-strip">' +
            '<span class="event-date-compact">' + formatCompactDateRange(startDate, endDate) + '</span>' +
            '<span class="event-countdown-inline" data-ev-countdown="' + evKey + '"><span>' + countdown + '</span></span>' +
          '</div>' +
          (perksHTML ? '<div class="event-perks">' + perksHTML + '</div>' : '') +
          bossesHTML +
        '</div>' +
      '</article>'
    );
  }

  /* ============ Modal de Detalle de Evento ============ */
  function openEventModal(item){
    if (Date.now() - lastModalCloseTime < 400) return;
    var modal = document.getElementById('eventDetailModal');
    var modalImg = document.getElementById('eventModalImg');
    var modalCategory = document.getElementById('eventModalCategory');
    var modalStatus = document.getElementById('eventModalStatus');
    var modalTitle = document.getElementById('eventModalTitle');
    var modalDate = document.getElementById('eventModalDate');
    var modalTime = document.getElementById('eventModalTime');
    var modalCountdown = document.getElementById('eventModalCountdown');
    var modalPerks = document.getElementById('eventModalPerks');
    var modalBossesSection = document.getElementById('eventModalBossesSection');
    var modalBosses = document.getElementById('eventModalBosses');
    var modalGuideLink = document.getElementById('eventModalGuideLink');

    modalImg.onerror = function () { this.onerror = null; this.src = 'img/favicon.svg'; };
    modalImg.src = item.raw.image || 'img/favicon.svg';
    modalCategory.textContent = item.category.label;
    modalCategory.style.color = item.category.color;
    modalCategory.style.borderColor = item.category.color + '55';

    modalStatus.textContent = item.status.label;
    modalStatus.className = 'ui-status';
    modalStatus.dataset.state = item.status.code;

    modalTitle.textContent = item.cleanName;
    window.RadarCalendar.attach(modal.querySelector('.fec-body'), Object.assign({}, item.raw, {name: item.cleanName}));

    var sameDay = false;
    if (item.startDate && item.endDate) {
      sameDay = item.startDate.getFullYear() === item.endDate.getFullYear() &&
                item.startDate.getMonth() === item.endDate.getMonth() &&
                item.startDate.getDate() === item.endDate.getDate();
    }

    // Fecha
    if (modalDate) {
      if (!item.startDate) {
        modalDate.textContent = 'Por confirmar';
      } else if (!item.endDate) {
        var dayName = DAY_NAMES[item.startDate.getDay()].slice(0, 3);
        var mName = MONTH_NAMES[item.startDate.getMonth()].slice(0, 3);
        modalDate.textContent = dayName + ', ' + item.startDate.getDate() + ' ' + mName;
      } else if (sameDay) {
        var dayName1 = DAY_NAMES[item.startDate.getDay()].slice(0, 3);
        var d1 = item.startDate.getDate();
        var m1 = MONTH_NAMES[item.startDate.getMonth()].slice(0, 3);
        modalDate.textContent = dayName1 + ', ' + d1 + ' ' + m1;
      } else {
        var d1 = item.startDate.getDate();
        var m1 = MONTH_NAMES[item.startDate.getMonth()].slice(0, 3);
        var d2 = item.endDate.getDate();
        var m2 = MONTH_NAMES[item.endDate.getMonth()].slice(0, 3);
        modalDate.textContent = d1 + ' ' + m1 + ' – ' + d2 + ' ' + m2;
      }
    }

    // Horario
    if (modalTime) {
      if (!item.startDate) {
        modalTime.textContent = 'Todo el día';
      } else if (!item.endDate) {
        modalTime.textContent = 'Desde ' + formatTime(item.startDate) + ' hrs';
      } else if (!sameDay) {
        var t1 = formatTime(item.startDate);
        modalTime.textContent = 'Desde ' + t1 + ' hrs';
      } else {
        var t1 = formatTime(item.startDate);
        var t2 = formatTime(item.endDate);
        modalTime.textContent = (t1 === t2) ? (t1 + ' hrs') : (t1 + ' – ' + t2);
      }
    }

    // Countdown
    if (modalCountdown) {
      modalCountdown.textContent = getShortCountdownString(item.startDate, item.endDate);
    }

    // Bonificaciones como <li>
    if (item.perks && item.perks.length > 0) {
      modalPerks.innerHTML = item.perks.map(function(p){
        return '<li>' + p + '</li>';
      }).join('');
    } else {
      modalPerks.innerHTML = '<li>Evento oficial del calendario de Pokémon GO</li>';
    }

    if(item.bosses && item.bosses.length > 0){
      modalBossesSection.style.display = 'flex';
      modalBosses.innerHTML = item.bosses.map(function(b){
        return '<div class="mini-chip" style="padding:4px 12px 4px 6px;">' +
          '<img class="mini-mon-img" src="' + b.image + '" alt="' + b.name + '" width="32" height="32" loading="lazy" />' +
          '<span>' + b.name + '</span>' +
          (b.canBeShiny ? '<span class="ui-badge ui-badge-shiny" title="Puede aparecer en su variante Shiny">Shiny</span>' : '') +
        '</div>';
      }).join('');
    } else {
      modalBossesSection.style.display = 'none';
    }

    if(item.raw.link && (item.raw.link.startsWith('http://') || item.raw.link.startsWith('https://'))){
      modalGuideLink.href = item.raw.link;
      modalGuideLink.style.display = 'flex';
    } else {
      modalGuideLink.style.display = 'none';
      modalGuideLink.removeAttribute('href');
    }

    modal.showModal();
    modal.querySelector(".modal-box").scrollTop = 0;
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  var lastModalCloseTime = 0;

  function closeEventModal(e){
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    lastModalCloseTime = Date.now();
    var modal = document.getElementById('eventDetailModal');
    if(!modal) return;
    modal.close();
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  /* ============ Filtrado y Búsqueda ============ */
  function filterEvents(){
    var grid = document.getElementById('eventsGrid');
    var emptyMsg = document.getElementById('eventsEmptyMsg');
    var countBadge = document.getElementById('eventsCountBadge');
    document.querySelectorAll('[data-time-filter]').forEach(function (button) {
      var selected = button.dataset.timeFilter === activeTimeFilter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('#eventCategoryChips button').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.cat === selectedCategory));
    });
    document.getElementById('eventCategorySelection').textContent = selectedCategory === 'all' ? 'Todas' : '1 seleccionada';
    if (!eventsReady) return;
    var q = norm(searchQuery.trim());
    var visibleCount = 0;

    var cards = grid.querySelectorAll('.event-card');
    cards.forEach(function(card){
      var evKey = card.getAttribute('data-ev-key');
      var item = eventRegistry[evKey];
      if(!item){ card.classList.add('is-hidden'); return; }

      // Filtro de tiempo
      var timeOk = false;
      if(activeTimeFilter === 'all') timeOk = true;
      else if(activeTimeFilter === 'live') timeOk = item.status.code === 'live';
      else if(activeTimeFilter === 'week') timeOk = (item.status.code === 'live' || item.status.code === 'today' || item.status.code === 'soon');
      else if(activeTimeFilter === 'future') timeOk = (item.status.code === 'upcoming' || item.status.code === 'soon' || item.status.code === 'today');

      // Filtro de categoría
      var catOk = selectedCategory === 'all' || item.raw.eventType === selectedCategory;

      // Filtro de búsqueda
      var searchOk = true;
      if(q){
        var searchable = norm(item.cleanName + ' ' + (item.category.label || '') + ' ' + (item.raw.name || '') + ' ' + item.perks.join(' '));
        if(item.bosses && item.bosses.length){
          searchable += ' ' + norm(item.bosses.map(function(b){ return b.name; }).join(' '));
        }
        searchOk = searchable.indexOf(q) !== -1;
      }

      var isVisible = timeOk && catOk && searchOk;
      card.classList.toggle('is-hidden', !isVisible);
      if(isVisible) visibleCount++;
    });

    if(emptyMsg){
      emptyMsg.textContent = allEvents.length ? 'No se encontraron eventos con estos filtros.' : 'No hay eventos publicados por la fuente.';
      emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
    if(countBadge){
      countBadge.textContent = visibleCount + ' evento' + (visibleCount === 1 ? '' : 's');
    }
  }

  /* ============ Banner de Destacado / Alerta Rápida ============ */
  function updateHighlightBanner(eventsList){
    var banner = document.getElementById('highlightBanner');
    var content = document.getElementById('highlightContent');
    if(!banner || !content || !eventsList.length) return;

    var now = Date.now();
    // Buscar evento en vivo o el próximo a comenzar
    var sorted = eventsList.slice().sort(function(a,b){
      var sA = a.start ? new Date(a.start).getTime() : Infinity;
      var sB = b.start ? new Date(b.start).getTime() : Infinity;
      return sA - sB;
    });

    var highlight = sorted.find(function(e){
      var s = e.start ? new Date(e.start).getTime() : 0;
      var end = e.end ? new Date(e.end).getTime() : 0;
      return now >= s && now <= end;
    }) || sorted.find(function(e){
      var s = e.start ? new Date(e.start).getTime() : 0;
      return s > now;
    });

    if(highlight){
      banner.dataset.category = highlight.eventType || '';
      var sDate = parseDate(highlight.start);
      var eDate = parseDate(highlight.end);
      var title = cleanTitle(highlight.name);
      var countdown = getCountdownString(sDate, eDate);
      var dateRange = formatDateRange(sDate, eDate);

      content.innerHTML = '<p><strong>' + title + '</strong> · ' + dateRange + '<br>' +
        '<span style="color:var(--signal);font-family:var(--font-mono);font-size:.78rem;">' + countdown + '</span>' +
      '</p>';
      banner.style.display = 'flex';
    }
  }

  /* ============ Actualización de Métricas del Hero ============ */
  function updateHeroStats(eventsList){
    var now = Date.now();
    var activeCount = 0;
    var weekCount = 0;
    var totalCount = eventsList.length;

    eventsList.forEach(function(e){
      var s = e.start ? new Date(e.start).getTime() : 0;
      var end = e.end ? new Date(e.end).getTime() : 0;
      if(now >= s && now <= end) activeCount++;
      if(s > now && s <= now + (7 * 86400000)) weekCount++;
    });

    var statActive = document.getElementById('statActiveEvents');
    var statWeek = document.getElementById('statWeekEvents');
    var statTotal = document.getElementById('statTotalEvents');

    if(statActive) statActive.innerHTML = '<span>' + activeCount + '</span>';
    if(statWeek) statWeek.innerHTML = '<span>' + weekCount + '</span>';
    if(statTotal) statTotal.innerHTML = '<span>' + totalCount + '</span>';

    window.updateCurrentSeasonReadout(eventsList);
  }



  /* ============ Renderizado de la Colección de Eventos ============ */
  function renderAllEvents(eventsList){
    var grid = document.getElementById('eventsGrid');
    if(!grid) return;

    // Ordenar: primero los en vivo, luego los próximos ordenados por fecha de inicio
    var sorted = eventsList.slice().sort(function(a,b){
      var sA = a.start ? new Date(a.start).getTime() : 0;
      var sB = b.start ? new Date(b.start).getTime() : 0;
      var eA = a.end ? new Date(a.end).getTime() : 0;
      var eB = b.end ? new Date(b.end).getTime() : 0;
      var now = Date.now();

      var isLiveA = now >= sA && now <= eA;
      var isLiveB = now >= sB && now <= eB;

      if(isLiveA && !isLiveB) return -1;
      if(!isLiveA && isLiveB) return 1;
      return sA - sB;
    });

    eventsReady = true;
    grid.removeAttribute('aria-busy');
    eventRegistry = {};
    grid.innerHTML = sorted.map(renderEventCard).join('');
    updateHeroStats(sorted);
    updateHighlightBanner(sorted);
    buildCategoryChips(sorted);
    filterEvents();
    viewState.restore();

    // Scroll reveal
    var motionOK = window.matchMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(motionOK && 'IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
        });
      }, {threshold: 0.01, rootMargin: '60px'});
      grid.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
    } else {
      grid.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
    }
  }

  /* ============ Generador de Chips de Categorías ============ */
  function buildCategoryChips(eventsList){
    var chipsContainer = document.getElementById('eventCategoryChips');
    if(!chipsContainer) return;

    var counts = {};
    eventsList.forEach(function(e){
      var type = e.eventType || 'event';
      counts[type] = (counts[type] || 0) + 1;
    });

    var types = Object.keys(counts).sort(function(a,b){
      return counts[b] - counts[a];
    });

    var html = '<button class="chip type-chip ' + (selectedCategory === 'all' ? 'active' : '') + '" data-cat="all" style="--tc:var(--signal);">Todos (' + eventsList.length + ')</button>';
    types.forEach(function(t){
      var cat = CATEGORIES[t] || { label: t, color: '#93b3a6' };
      var isActive = selectedCategory === t ? 'active' : '';
      html += '<button class="chip type-chip ' + isActive + '" data-cat="' + t + '" style="--tc:' + cat.color + ';">' + cat.label + ' (' + counts[t] + ')</button>';
    });

    chipsContainer.innerHTML = html;
    chipsContainer.querySelectorAll('.type-chip').forEach(function(btn){
      btn.addEventListener('click', function(){
        selectedCategory = btn.getAttribute('data-cat');
        chipsContainer.querySelectorAll('.type-chip').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        filterEvents();
      });
    });
  }

  /* ============ Cuenta Regresiva Periódica ============ */
  function tickCountdowns(){
    document.querySelectorAll('[data-ev-countdown]').forEach(function(pill){
      var key = pill.getAttribute('data-ev-countdown');
      var item = eventRegistry[key];
      if(item){
        pill.innerHTML = '<span>' + getCountdownString(item.startDate, item.endDate) + '</span>';
      }
    });
  }
  setInterval(tickCountdowns, 30000);

  /* ============ Inicialización ============ */
  function init(){
    filterEvents();
    RadarData.load({
      key: 'pokeradar_events_v1',
      url: 'https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.json',
      validate: RadarData.events,
      render: function (data) { allEvents = data; renderAllEvents(data); },
      loading: function () {
        document.getElementById('eventsEmptyMsg').style.display = 'none';
        RadarData.loading(document.getElementById('eventsGrid'), 'Cargando eventos…');
      },
      error: function () {
        document.getElementById('eventsCountBadge').textContent = 'Sin datos';
        RadarData.message(document.getElementById('eventsGrid'), 'No pudimos cargar los eventos. Vuelve a entrar cuando tengas conexión.');
        viewState.restore();
      }
    });

    // Filtros de marco temporal (Segmentos)
    document.querySelectorAll('[data-time-filter]').forEach(function(btn){
      btn.addEventListener('click', function(){
        document.querySelectorAll('[data-time-filter]').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        activeTimeFilter = btn.getAttribute('data-time-filter');
        filterEvents();
      });
    });

    // Búsqueda en tiempo real
    var searchEl = document.getElementById('eventSearchInput');
    if(searchEl){
      searchEl.addEventListener('input', function(){
        searchQuery = searchEl.value;
        filterEvents();
      });
    }

    
    var eventModal = document.getElementById('eventDetailModal');
    if (eventModal) {
      eventModal.addEventListener('click', function(e) {
        if (e.target === eventModal) {
          closeEventModal();
        }
      });
      eventModal.addEventListener('cancel', function(e) {
        e.preventDefault();
        closeEventModal();
      });
    }

    // Delegación de clic en tarjetas para abrir modal
    document.addEventListener('click', function(e){
      if (Date.now() - lastModalCloseTime < 400) return;
      var card = e.target.closest('[data-ev-key]');
      if(card){
        var key = card.getAttribute('data-ev-key');
        if(eventRegistry[key]){
          openEventModal(eventRegistry[key]);
        }
      }
    });

    // Eventos de teclado para accesibilidad
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        closeEventModal(e);
      }
      if(e.key === 'Enter' || e.key === ' '){
        var card = document.activeElement && document.activeElement.closest('[data-ev-key]');
        var mod = document.getElementById('eventDetailModal');
        if(card && (!mod || !mod.open)){
          e.preventDefault();
          var key = card.getAttribute('data-ev-key');
          if(eventRegistry[key]){
            openEventModal(eventRegistry[key]);
          }
        }
      }
    });

    var modalCloseBtn = document.getElementById('eventModalClose');
    if(modalCloseBtn){
      modalCloseBtn.addEventListener('click', function(e) {
        closeEventModal(e);
      });
    }

    var modalBottomCloseBtn = document.getElementById('eventModalBottomClose');
    if(modalBottomCloseBtn){
      modalBottomCloseBtn.addEventListener('click', function(e) {
        closeEventModal(e);
      });
    }

    var modalBackdrop = document.getElementById('eventDetailModal');
    if(modalBackdrop){
      modalBackdrop.addEventListener('click', function(e){
        if(e.target === this) closeEventModal(e);
      });
      modalBackdrop.addEventListener('cancel', function(e){
        e.preventDefault();
        closeEventModal(e);
      });
      modalBackdrop.addEventListener('close', function(){
        lastModalCloseTime = Date.now();
        document.documentElement.classList.remove('modal-open');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
      });
    }
  }

  window.addEventListener('pageshow', function(){
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

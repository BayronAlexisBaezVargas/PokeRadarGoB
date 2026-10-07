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
    'Regirock, Regice, and Registeel in 5-star Raid Battles': 'Titanes Legendarios (Regirock, Regice, Registeel) en Incursiones 5★'
  };

  /* ============ Dataset Curado Inicial (Carga Inmediata) ============ */
  var FALLBACK_EVENTS = [
    {
      eventID: 'regi-raid-hour-aug-2026',
      name: 'Regirock, Regice, and Registeel Raid Hour',
      eventType: 'raid-hour',
      link: 'https://leekduck.com/events/raidhour/',
      image: 'https://cdn.leekduck.com/assets/img/events/raidhour.jpg',
      start: '2026-08-26T18:00:00.000',
      end: '2026-08-26T19:00:00.000',
      extraData: { raidbattles: { bosses: [{ name: 'Regirock', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/377.png', canBeShiny: true }, { name: 'Regice', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/378.png', canBeShiny: true }, { name: 'Registeel', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/379.png', canBeShiny: true }] } }
    },
    {
      eventID: 'mankey-spotlight-aug-2026',
      name: 'Mankey Spotlight Hour',
      eventType: 'pokemon-spotlight-hour',
      link: 'https://leekduck.com/events/pokemonspotlighthour/',
      image: 'https://cdn.leekduck.com/assets/img/events/pokemonspotlighthour.jpg',
      start: '2026-08-27T18:00:00.000',
      end: '2026-08-27T19:00:00.000',
      extraData: { generic: { perks: ['Aparición masiva de Mankey', '2× Caramelos por transferencia', 'Mankey variocolor disponible'] } }
    },
    {
      eventID: 'pokemon-xp-worlds-2026',
      name: 'PokémonXP &amp; 2026 Worlds',
      eventType: 'event',
      link: 'https://leekduck.com/events/pokemon-xp-2026-worlds/',
      image: 'https://cdn.leekduck.com/assets/img/events/article-images/2026/2026-08-25-pokemon-xp-2026-worlds/pokemon-xp-2026-worlds.jpg',
      start: '2026-08-25T10:00:00.000',
      end: '2026-08-30T20:00:00.000',
      extraData: { generic: { perks: ['Pikachu con disfraz del Mundial', 'Apariciones silvestres temáticas', 'Investigaciones de campo especiales'] } }
    },
    {
      eventID: 'twitch-drops-worlds-2026',
      name: 'Twitch Drops for 2026 Pokémon World Championships',
      eventType: 'research',
      link: 'https://leekduck.com/events/twitch-drops-worlds-2026/',
      image: 'https://cdn.leekduck.com/assets/img/events/article-images/2026/2026-08-28-pokemon-world-championships-2026-timed-research-twitch-drops/2026-worlds-go-drops.jpg',
      start: '2026-08-28T16:00:00.000Z',
      end: '2026-08-31T03:00:00.000Z',
      extraData: { generic: { perks: ['Investigación temporal exclusiva', 'Encuentro con Sableye / Medicham', 'Camiseta de avatar temática'] } }
    },
    {
      eventID: 'dynamax-eevee-max-monday',
      name: 'Dynamax Eevee during Max Monday',
      eventType: 'max-mondays',
      link: 'https://leekduck.com/events/max-mondays/',
      image: 'https://cdn.leekduck.com/assets/img/events/max-battles-kanto.jpg',
      start: '2026-08-31T06:00:00.000',
      end: '2026-08-31T21:00:00.000',
      extraData: { generic: { perks: ['Nodos Dinamax activos con Eevee', 'Partículas Max adicionales', 'Horario estelar de 18:00 a 19:00'] } }
    },
    {
      eventID: 'mega-ascension-2026',
      name: 'Mega Ascension',
      eventType: 'event',
      link: 'https://leekduck.com/events/mega-ascension/',
      image: 'https://cdn.leekduck.com/assets/img/events/article-images/2026/2026-08-31-mega-ascension/mega-ascension.jpg',
      start: '2026-08-31T10:00:00.000',
      end: '2026-09-04T23:59:00.000',
      extraData: { generic: { perks: ['Mayor energía Mega en incursiones', 'Bonus de ataque en megas activas', 'Investigación especial de Megaevolución'] } }
    },
    {
      eventID: 'go-fest-mega-finale-2026',
      name: 'Pokémon GO Fest 2026: Mega Finale',
      eventType: 'pokemon-go-fest',
      link: 'https://leekduck.com/events/pokemon-go-fest-2026-mega-finale/',
      image: 'https://cdn.leekduck.com/assets/img/events/article-images/2026/2026-09-05-pokemon-go-fest-2026-mega-finale/pokemon-go-fest-2026-mega-finale.jpg',
      start: '2026-09-05T10:00:00.000',
      end: '2026-09-06T18:00:00.000',
      extraData: { generic: { perks: ['Ultraentes y Legendarios en incursiones', '4 hábitats rotativos', 'Hasta 9 pases de incursión gratuitos', 'Ratio de variocolor aumentado'] } }
    },
    {
      eventID: 'dynamax-ralts-max-monday',
      name: 'Dynamax Ralts during Max Monday',
      eventType: 'max-mondays',
      link: 'https://leekduck.com/events/max-mondays/',
      image: 'https://cdn.leekduck.com/assets/img/events/max-battles-kanto.jpg',
      start: '2026-09-07T06:00:00.000',
      end: '2026-09-07T21:00:00.000',
      extraData: { generic: { perks: ['Ralts Dinamax en Nodos Energéticos', 'Partículas Max dobles al interactuar'] } }
    },
    {
      eventID: 'season-twilight-trails',
      name: 'Twilight Trails',
      eventType: 'season',
      link: 'https://leekduck.com/events/season-twilight-trails/',
      image: 'https://cdn.leekduck.com/assets/img/events/article-images/2026/2026-06-02-season-23-forever-forward/season-23-forever-forward.jpg',
      start: '2026-09-08T10:00:00.000',
      end: '2026-12-01T10:00:00.000',
      extraData: { generic: { perks: ['Nueva temporada temática de 3 meses', 'Rotación de especies por bioma', 'Bonus de intercambio adicional diario'] } }
    },
    {
      eventID: 'zacian-raid-hour',
      name: 'Zacian (Hero of Many Battles) Raid Hour',
      eventType: 'raid-hour',
      link: 'https://leekduck.com/events/raidhour/',
      image: 'https://cdn.leekduck.com/assets/img/events/raidhour.jpg',
      start: '2026-09-09T18:00:00.000',
      end: '2026-09-09T19:00:00.000',
      extraData: { raidbattles: { bosses: [{ name: 'Zacian (Hero of Many Battles)', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/888.png', canBeShiny: true }] } }
    },
    {
      eventID: 'september-cd-classic',
      name: 'September Community Day Classic',
      eventType: 'community-day',
      link: 'https://leekduck.com/events/community-day-september-2026/',
      image: 'https://cdn.leekduck.com/assets/img/events/article-images/2026/2026-08-25-pokemon-xp-2026-worlds/pokemon-xp-2026-worlds.jpg',
      start: '2026-09-12T14:00:00.000',
      end: '2026-09-12T17:00:00.000',
      extraData: { generic: { perks: ['Variocolor con ratio elevado', 'Ataque élite exclusivo', '3× PX por captura', 'Incienso y cebos de 3 horas'] } }
    },
    {
      eventID: 'zamazenta-raid-hour',
      name: 'Zamazenta (Hero of Many Battles) Raid Hour',
      eventType: 'raid-hour',
      link: 'https://leekduck.com/events/raidhour/',
      image: 'https://cdn.leekduck.com/assets/img/events/raidhour.jpg',
      start: '2026-09-16T18:00:00.000',
      end: '2026-09-16T19:00:00.000',
      extraData: { raidbattles: { bosses: [{ name: 'Zamazenta (Hero of Many Battles)', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/889.png', canBeShiny: true }] } }
    },
    {
      eventID: 'super-mega-raid-day-sep',
      name: 'Super Mega Raid Day',
      eventType: 'raid-day',
      link: 'https://leekduck.com/events/raid-day/',
      image: 'https://cdn.leekduck.com/assets/img/events/mega-default.jpg',
      start: '2026-09-19T14:00:00.000',
      end: '2026-09-19T17:00:00.000',
      extraData: { generic: { perks: ['Megaincursiones continuas en gimnasios', '5 pases de incursión diarios', 'Mayor ratio de variocolor'] } }
    },
    {
      eventID: 'dynamax-legendary-birds',
      name: 'Dynamax Articuno, Zapdos, and Moltres during Max Monday',
      eventType: 'max-mondays',
      link: 'https://leekduck.com/events/max-mondays/',
      image: 'https://cdn.leekduck.com/assets/img/events/max-battles-kanto.jpg',
      start: '2026-09-21T06:00:00.000',
      end: '2026-09-21T21:00:00.000',
      extraData: { generic: { perks: ['Articuno, Zapdos y Moltres Dinamax en combate', 'Mayor límite diario de Partículas Max'] } }
    },
    {
      eventID: 'ultra-beasts-raids-sep',
      name: 'Xurkitree, Pheromosa, and Buzzwole in 5-star Raid Battles',
      eventType: 'raid-battles',
      link: 'https://leekduck.com/events/raid-battles/',
      image: 'https://cdn.leekduck.com/assets/img/events/raidhour.jpg',
      start: '2026-09-23T06:00:00.000',
      end: '2026-09-29T22:00:00.000',
      extraData: { raidbattles: { bosses: [{ name: 'Buzzwole', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/794.png', canBeShiny: true }, { name: 'Pheromosa', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/795.png', canBeShiny: true }, { name: 'Xurkitree', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/796.png', canBeShiny: true }] } }
    },
    {
      eventID: 'october-community-day-2026',
      name: 'October Community Day',
      eventType: 'community-day',
      link: 'https://leekduck.com/events/community-day-october-2026/',
      image: 'https://cdn.leekduck.com/assets/img/events/article-images/2026/2026-08-25-pokemon-xp-2026-worlds/pokemon-xp-2026-worlds.jpg',
      start: '2026-10-10T14:00:00.000',
      end: '2026-10-10T17:00:00.000',
      extraData: { generic: { perks: ['Especie protagonista destacada', 'Ratio de variocolor aumentado', 'Ataque exclusivo', 'Bonus de captura'] } }
    }
  ];

  /* ============ Variables de Estado ============ */
  var allEvents = [];
  var activeTimeFilter = 'all';
  var selectedCategory = 'all';
  var searchQuery = '';
  var eventRegistry = {};

  /* ============ Utilidades de Formato y Tiempo ============ */
  var MONTH_NAMES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var DAY_NAMES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  function norm(str){
    return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function cleanTitle(rawName){
    if(!rawName) return '';
    var clean = rawName.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    return NAME_TRANSLATIONS[clean] || clean;
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
      return { code: 'live', label: 'En Vivo', priority: 1 };
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
    var randomId = '';
    if (window.crypto && window.crypto.getRandomValues) {
      randomId = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
    } else {
      randomId = Math.floor(Math.random() * 1000000000).toString(36);
    }
    var evKey = ev.eventID || ('ev_' + randomId);
    
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
            '<img src="' + b.image + '" alt="' + b.name + '" loading="lazy" onerror="this.style.display=\'none\';" />' +
            (b.canBeShiny ? '<span class="event-boss-shiny-dot" title="Variocolor disponible">S</span>' : '') +
          '</div>';
        }).join('') +
      '</div>';
    }

    var fallbackImg = 'https://cdn.leekduck.com/assets/img/events/raidhour.jpg';
    var imgSrc = ev.image || fallbackImg;

    return (
      '<article class="event-card reveal" data-ev-key="' + evKey + '" data-cat="' + ev.eventType + '" data-status="' + status.code + '" tabindex="0" role="button" aria-label="Ver detalles de ' + cleanName + '">' +
        '<div class="event-media">' +
          '<img class="event-media-img" src="' + imgSrc + '" alt="' + cleanName + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + fallbackImg + '\';" />' +
          '<div class="event-media-overlay"></div>' +
          '<div class="event-tags-bar">' +
            '<span class="event-cat-tag" style="color:' + category.color + ';border-color:' + category.color + '44;">' + category.label + '</span>' +
            '<span class="event-status-tag ' + status.code + '">' + status.label + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="event-content">' +
          '<h3 class="event-title">' + cleanName + '</h3>' +
          '<div class="event-date-row">' +
            '<span class="event-date-label">Fecha:</span><span>' + dateStr + '</span>' +
          '</div>' +
          '<div class="event-countdown-pill" data-ev-countdown="' + evKey + '">' +
            '<span>' + countdown + '</span>' +
          '</div>' +
          (perksHTML ? '<div class="event-perks">' + perksHTML + '</div>' : '') +
          bossesHTML +
          '<div class="card-click-hint">Ver detalles</div>' +
        '</div>' +
      '</article>'
    );
  }

  /* ============ Modal de Detalle de Evento ============ */
  function openEventModal(item){
    var modal = document.getElementById('eventDetailModal');
    var modalImg = document.getElementById('eventModalImg');
    var modalCategory = document.getElementById('eventModalCategory');
    var modalStatus = document.getElementById('eventModalStatus');
    var modalTitle = document.getElementById('eventModalTitle');
    var modalStart = document.getElementById('eventModalStart');
    var modalEnd = document.getElementById('eventModalEnd');
    var modalCountdown = document.getElementById('eventModalCountdown');
    var modalPerks = document.getElementById('eventModalPerks');
    var modalBossesSection = document.getElementById('eventModalBossesSection');
    var modalBosses = document.getElementById('eventModalBosses');
    var modalDesc = document.getElementById('eventModalDesc');
    var modalGuideLink = document.getElementById('eventModalGuideLink');

    modalImg.src = item.raw.image || 'https://cdn.leekduck.com/assets/img/events/raidhour.jpg';
    modalCategory.textContent = item.category.label;
    modalCategory.style.color = item.category.color;
    modalCategory.style.borderColor = item.category.color + '55';

    modalStatus.textContent = item.status.label;
    modalStatus.className = 'event-status-tag ' + item.status.code;

    modalTitle.textContent = item.cleanName;
    modalStart.textContent = item.startDate ? item.startDate.toLocaleString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'Por confirmar';
    modalEnd.textContent = item.endDate ? item.endDate.toLocaleString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'Por confirmar';
    modalCountdown.textContent = getCountdownString(item.startDate, item.endDate);

    modalPerks.innerHTML = item.perks.map(function(p){
      return '<span class="badge" style="color:var(--signal);background:rgba(61,242,196,.12);border-color:rgba(61,242,196,.35);font-size:.78rem;padding:4px 10px;">' + p + '</span>';
    }).join('');

    if(item.bosses && item.bosses.length > 0){
      modalBossesSection.style.display = 'flex';
      modalBosses.innerHTML = item.bosses.map(function(b){
        return '<div class="mini-chip" style="padding:4px 12px 4px 6px;">' +
          '<img class="mini-mon-img" src="' + b.image + '" alt="' + b.name + '" />' +
          '<span>' + b.name + '</span>' +
          (b.canBeShiny ? '<span class="modal-shiny-tag" style="margin-left:6px;">Variocolor</span>' : '') +
        '</div>';
      }).join('');
    } else {
      modalBossesSection.style.display = 'none';
    }

    var descText = 'Evento oficial en Pokémon GO. Los horarios corresponden a la hora local configurada en tu dispositivo. Asegúrate de verificar las condiciones meteorológicas y el estado de los gimnasios antes de participar.';
    if(item.raw.eventType === 'pokemon-spotlight-hour'){
      descText = 'Durante esta hora, la especie destacada aparecerá con una frecuencia sumamente alta en estado silvestre. Aprovecha el bonus especial durante los 60 minutos del evento.';
    } else if(item.raw.eventType === 'raid-hour'){
      descText = 'Prácticamente todos los gimnasios disponibles albergarán incursiones legendarias de 5★ durante la hora del evento. Ideal para coordinar grupos y maximizar capturas con pase de incursión.';
    } else if(item.raw.eventType === 'community-day'){
      descText = 'El Día de la Comunidad ofrece apariciones masivas del Pokémon protagonista con tasa incrementada de variocolor, módulos cebo e inciensos de duración extendida, y un ataque exclusivo al evolucionar.';
    } else if(item.raw.eventType === 'max-mondays'){
      descText = 'Los Nodos Dinamax contarán con una densidad de combate intensificada para la especie protagonista. Obtén Partículas Max e interactúa con entrenadores cercanos.';
    }
    modalDesc.innerHTML = '';
    modalDesc.classList.add('typing-cursor');
    var tid = Math.random();
    modalDesc.dataset.tid = tid;
    var i = 0;
    function type() {
      if(modalDesc.dataset.tid != tid) return;
      if(i < descText.length){
        modalDesc.textContent += descText.charAt(i);
        i++;
        setTimeout(type, 15);
      } else {
        modalDesc.classList.remove('typing-cursor');
      }
    }
    type();

    if(item.raw.link && (item.raw.link.startsWith('http://') || item.raw.link.startsWith('https://'))){
      modalGuideLink.href = item.raw.link;
      modalGuideLink.textContent = 'Ver Noticia Completa ↗';
      modalGuideLink.style.display = 'inline-flex';
      modalGuideLink.style.background = 'var(--signal)';
      modalGuideLink.style.color = 'var(--void)';
      modalGuideLink.style.padding = '10px 20px';
      modalGuideLink.style.fontWeight = 'bold';
    } else {
      modalGuideLink.style.display = 'none';
      modalGuideLink.removeAttribute('href');
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeEventModal(){
    var modal = document.getElementById('eventDetailModal');
    if(!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ============ Filtrado y Búsqueda ============ */
  function filterEvents(){
    var grid = document.getElementById('eventsGrid');
    var emptyMsg = document.getElementById('eventsEmptyMsg');
    var countBadge = document.getElementById('eventsCountBadge');
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

    eventRegistry = {};
    grid.innerHTML = sorted.map(renderEventCard).join('');
    updateHeroStats(sorted);
    updateHighlightBanner(sorted);
    buildCategoryChips(sorted);
    filterEvents();

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
    // 1. Carga inmediata con datos curados
    allEvents = FALLBACK_EVENTS;
    renderAllEvents(allEvents);

    // 2. Fetch asíncrono para datos en vivo
    fetch('https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.json')
      .then(function(res){
        if(!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data){
        if(Array.isArray(data) && data.length > 0){
          allEvents = data;
          renderAllEvents(allEvents);
        }
      })
      .catch(function(err){
        // En caso de fallo de red, se mantiene el dataset curado
        console.info('Noticias: Usando dataset base de eventos.', err.message);
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

    // Delegación de clic en tarjetas para abrir modal
    document.addEventListener('click', function(e){
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
        closeEventModal();
      }
      if(e.key === 'Enter' || e.key === ' '){
        var card = document.activeElement && document.activeElement.closest('[data-ev-key]');
        if(card && !document.getElementById('eventDetailModal').classList.contains('open')){
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
      modalCloseBtn.addEventListener('click', closeEventModal);
    }

    var modalBackdrop = document.getElementById('eventDetailModal');
    if(modalBackdrop){
      modalBackdrop.addEventListener('click', function(e){
        if(e.target === this) closeEventModal();
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

(function(){
  "use strict";

  var TYPE_COLORS = {
    normal:'#B4AE96', fire:'#FF7A45', water:'#4C9FE8', electric:'#F3D23B', grass:'#6FBE5A',
    ice:'#6FD4C8', fighting:'#F87171', poison:'#C084FC', ground:'#C9A25A', flying:'#92AEDC',
    psychic:'#F35E8A', bug:'#A6C22C', rock:'#B4A05C', ghost:'#A78BFA', dragon:'#818CF8',
    dark:'#B4A9BE', steel:'#9FAAC0', fairy:'#E9A0D0'
  };

  var TYPE_LABELS = {
    normal:'Normal', fire:'Fuego', water:'Agua', electric:'Eléctrico', grass:'Planta',
    ice:'Hielo', fighting:'Lucha', poison:'Veneno', ground:'Tierra', flying:'Volador',
    psychic:'Psíquico', bug:'Bicho', rock:'Roca', ghost:'Fantasma', dragon:'Dragón',
    dark:'Siniestro', steel:'Acero', fairy:'Hada'
  };

  var data = [];
  var pageSize = 5;
  var expanded = new Set();
  var rows = new WeakMap();
  var params = new URLSearchParams(location.search);
  var counterTypes = (params.get('types') || '').split(',').filter(function (type, index, all) {
    return Object.hasOwn(TYPE_LABELS, type) && all.indexOf(type) === index;
  });
  var boss = (params.get('boss') || '').slice(0, 120);
  var contextual = Boolean(boss && counterTypes.length);
  var selectedType = params.get('type') || location.hash.slice(1) || (contextual ? 'recommended' : 'all');
  if (!Object.hasOwn(TYPE_LABELS, selectedType) && selectedType !== 'all' && !(contextual && selectedType === 'recommended')) selectedType = contextual ? 'recommended' : 'all';
  var selectedCategory = ['normal', 'mega', 'shadow'].includes(params.get('category')) ? params.get('category') : 'all';
  var query = (params.get('q') || '').slice(0, 120);
  var grid = document.getElementById('atacantesGrid');
  var modal = document.getElementById('monModal');
  var lastRow = null;
  var ready = false;

  function element(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function norm(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function format(value) { return Number.isFinite(value) ? value.toLocaleString('es', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : '—'; }
  function sourceURL(group) {
    // Source links come from the known ranking, never arbitrary feed-provided URLs.
    return 'https://db.pokemongohub.net/es/pokemon-list/best-per-type/' + group.type;
  }
  function imageURL(mon) {
    if (typeof mon.image === 'string') {
      try {
        var url = new URL(mon.image);
        if (url.protocol === 'https:' && url.hostname === 'db.pokemongohub.net' && url.pathname.startsWith('/images/pokemon/')) return url.href;
      } catch (err) {}
    }
    if (mon.form && !mon.img) return null;
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + (mon.img || mon.dex) + '.png';
  }
  function setupImage(img, mon) {
    img.alt = '';
    img.hidden = false;
    img.onerror = function () {
      img.onerror = null;
      img.hidden = true;
      img.parentElement.classList.add('image-unavailable');
    };
    img.parentElement.classList.remove('image-unavailable');
    var url = imageURL(mon);
    if (url) img.src = url;
    else { img.removeAttribute('src'); img.onerror(); }
  }
  function validate(value) {
    return Array.isArray(value) && value.length === 18 && new Set(value.map(function (group) { return group.type; })).size === 18 && value.every(function (group) {
      return group && Object.hasOwn(TYPE_LABELS, group.type) && group.rankingMetric === 'edps' && Array.isArray(group.top) && group.top.length > 0 && group.top.every(function (mon) {
        return mon && typeof mon.name === 'string' && typeof mon.tag === 'string' && Number.isFinite(mon.dex) &&
          ['normal', 'mega', 'shadow'].includes(mon.category) && Number.isFinite(mon.sourceRank) && mon.sourceRank > 0 &&
          Number.isFinite(mon.edps) && mon.edps > 0 && Number.isFinite(mon.dps) && mon.dps > 0 &&
          Array.isArray(mon.types) && mon.types.every(function (type) { return Object.hasOwn(TYPE_LABELS, type); }) &&
          [mon.fastMove, mon.chargedMove].every(function (move) { return move && typeof move.name === 'string' && typeof move.legacy === 'boolean'; });
      });
    });
  }

  function updateURL() {
    var next = new URLSearchParams(location.search);
    if (selectedType === 'recommended') next.delete('type'); else next.set('type', selectedType);
    if (selectedCategory === 'all') next.delete('category'); else next.set('category', selectedCategory);
    if (query) next.set('q', query); else next.delete('q');
    history.replaceState(null, '', location.pathname + (next.size ? '?' + next.toString() : ''));
  }
  function updateControls() {
    document.getElementById('attackerFilterLabel').textContent = selectedType === 'recommended' ? 'Recomendados' : selectedType === 'all' ? 'Todos' : TYPE_LABELS[selectedType];
    document.querySelectorAll('.type-filter-btn').forEach(function (button) {
      var active = button.dataset.type === selectedType;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-attacker-category]').forEach(function (button) {
      var active = button.dataset.attackerCategory === selectedCategory;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.getElementById('clearAttackerFilters').hidden = !query && selectedCategory === 'all' && selectedType === (contextual ? 'recommended' : 'all');
  }
  function buildTypeFilters() {
    var bar = document.getElementById('typeFilterBar');
    bar.replaceChildren();
    var types = (contextual ? ['recommended'] : []).concat(['all'], Object.keys(TYPE_LABELS));
    types.forEach(function (type) {
      var button = element('button', 'type-filter-btn', type === 'recommended' ? 'Recomendados' : type === 'all' ? 'Todos' : TYPE_LABELS[type]);
      button.type = 'button'; button.dataset.type = type;
      bar.appendChild(button);
    });
  }
  function matching(mon) {
    return (selectedCategory === 'all' || mon.category === selectedCategory) && (!query || norm(mon.name + ' ' + mon.fullName).includes(norm(query)));
  }
  function moveSummary(mon) {
    return mon.fastMove.name + (mon.fastMove.legacy ? ' *' : '') + ' · ' + mon.chargedMove.name + (mon.chargedMove.legacy ? ' *' : '');
  }
  function renderRow(mon, group) {
    var row = element('div', 'mon-row interactive-row');
    row.tabIndex = 0; row.setAttribute('role', 'button');
    row.setAttribute('aria-label', 'Ver ' + mon.name + ', ' + mon.tag + ', puesto ' + mon.sourceRank + ' de tipo ' + TYPE_LABELS[group.type]);
    row.dataset.category = mon.category;
    rows.set(row, { mon: mon, group: group });
    var rank = element('span', 'mon-rank', '#' + mon.sourceRank);
    rank.title = 'Puesto general de tipo ' + TYPE_LABELS[group.type] + ' según la fuente';
    row.appendChild(rank);
    var avatar = element('span', 'mon-avatar-sm');
    var img = element('img', 'mon-img-sm'); img.width = 48; img.height = 48; img.loading = 'lazy';
    avatar.appendChild(img); setupImage(img, mon); row.appendChild(avatar);
    var info = element('span', 'mon-info-sm');
    info.appendChild(element('span', 'mon-name-sm', mon.name));
    var badge = element('span', 'ui-badge mon-form-badge', mon.tag); badge.dataset.category = mon.category;
    info.appendChild(badge);
    info.appendChild(element('span', 'mon-moves-summary', moveSummary(mon)));
    row.appendChild(info);
    var score = element('span', 'mon-dps-badge', format(mon.edps));
    score.appendChild(element('small', '', 'eDPS')); score.title = 'Daño efectivo por segundo'; row.appendChild(score);
    return row;
  }
  function render() {
    if (!ready) return;
    grid.removeAttribute('aria-busy'); grid.replaceChildren(); rows = new WeakMap();
    var total = 0;
    data.forEach(function (group) {
      if (selectedType === 'recommended' ? !counterTypes.includes(group.type) : selectedType !== 'all' && group.type !== selectedType) return;
      var mons = group.top.filter(matching);
      if (!mons.length) return;
      total += mons.length;
      var card = element('section', 'type-card'); card.dataset.type = group.type;
      card.style.setProperty('--card-type-color', TYPE_COLORS[group.type]);
      var shown = expanded.has(group.type) ? mons : mons.slice(0, pageSize);
      var header = element('div', 'type-header');
      header.appendChild(element('h3', '', TYPE_LABELS[group.type]));
      header.appendChild(element('span', 'type-badge-pill', shown.length + ' de ' + mons.length));
      card.appendChild(header);
      var list = element('div', 'type-mons'); list.id = 'attackers-' + group.type;
      shown.forEach(function (mon) { list.appendChild(renderRow(mon, group)); });
      card.appendChild(list);
      if (mons.length > pageSize) {
        var more = element('button', 'ui-button ui-button-secondary attacker-more', expanded.has(group.type) ? 'Mostrar menos' : 'Ver ' + (mons.length - pageSize) + ' más');
        more.type = 'button'; more.dataset.expandType = group.type;
        more.setAttribute('aria-expanded', String(expanded.has(group.type)));
        more.setAttribute('aria-controls', list.id); card.appendChild(more);
      }
      var source = element('a', 'ranking-source', 'Ver clasificación de ' + TYPE_LABELS[group.type] + ' en GO Hub');
      source.href = sourceURL(group); source.target = '_blank'; source.rel = 'noopener noreferrer';
      card.appendChild(source); grid.appendChild(card);
    });
    document.getElementById('attackerResultCount').textContent = total ? total + (total === 1 ? ' opción' : ' opciones') : 'Sin coincidencias';
    if (!total) RadarData.message(grid, 'No hay opciones con estos filtros. Prueba otra versión, tipo o nombre.');
    updateControls();
  }

  function showMove(move, id) {
    var container = document.getElementById(id); container.replaceChildren();
    container.appendChild(element('strong', '', move.name));
    if (TYPE_LABELS[move.type]) container.appendChild(element('span', 'move-type-label', TYPE_LABELS[move.type]));
    if (move.legacy) container.appendChild(element('span', 'ui-badge move-legacy', 'Exclusivo *'));
  }
  function openModal(row) {
    var entry = rows.get(row); if (!entry) return;
    var mon = entry.mon; var group = entry.group; lastRow = row;
    document.getElementById('compareAttacker').onclick = function () {
      modal.addEventListener('close', function () { RadarCompare.select(mon, group); }, {once:true});
      closeModal();
    };
    document.getElementById('modalName').textContent = mon.name;
    document.getElementById('modalDex').textContent = 'N.° ' + mon.dex;
    var tag = document.getElementById('modalTag'); tag.textContent = mon.tag; tag.dataset.category = mon.category;
    setupImage(document.getElementById('modalImg'), mon);
    var badges = document.getElementById('modalTypes'); badges.replaceChildren();
    mon.types.forEach(function (type) {
      var badge = element('span', 'badge', TYPE_LABELS[type]); badge.style.color = TYPE_COLORS[type]; badges.appendChild(badge);
    });
    document.getElementById('attackerEdps').textContent = format(mon.edps);
    document.getElementById('attackerDps').textContent = format(mon.dps);
    document.getElementById('attackerTdo').textContent = format(mon.tdo);
    document.getElementById('attackerRank').textContent = '#' + mon.sourceRank + ' · ' + TYPE_LABELS[group.type];
    showMove(mon.fastMove, 'attackerFastMove'); showMove(mon.chargedMove, 'attackerChargedMove');
    document.getElementById('attackerLegacyNote').hidden = !mon.fastMove.legacy && !mon.chargedMove.legacy;
    var source = document.getElementById('attackerSource'); source.href = sourceURL(group);
    modal.querySelectorAll('details').forEach(function (details) { details.open = false; });
    modal.showModal(); modal.querySelector('.modal-box').scrollTop = 0;
    document.documentElement.classList.add('modal-open'); document.body.classList.add('modal-open'); document.body.style.overflow = 'hidden';
  }
  function closeModal(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    if (modal.open) modal.close();
  }
  modal.addEventListener('close', function () {
    document.documentElement.classList.remove('modal-open'); document.body.classList.remove('modal-open'); document.body.style.overflow = '';
    if (lastRow && lastRow.isConnected) lastRow.focus({ preventScroll: true });
  });
  modal.addEventListener('cancel', closeModal);
  modal.addEventListener('click', function (event) { if (event.target === modal) closeModal(event); });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  grid.addEventListener('click', function (event) {
    var more = event.target.closest('[data-expand-type]');
    if (more) {
      var type = more.dataset.expandType;
      if (expanded.has(type)) expanded.delete(type); else expanded.add(type);
      render();
      var replacement = grid.querySelector('[data-expand-type="' + type + '"]');
      if (replacement) replacement.focus({ preventScroll: true });
      return;
    }
    var row = event.target.closest('.interactive-row'); if (row) openModal(row);
  });
  grid.addEventListener('keydown', function (event) {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.interactive-row')) { event.preventDefault(); openModal(event.target); }
  });
  document.getElementById('typeFilterBar').addEventListener('click', function (event) {
    var button = event.target.closest('[data-type]'); if (!button) return;
    selectedType = button.dataset.type; expanded.clear(); updateURL(); updateControls(); render();
    document.getElementById('attackerTypeFilter').open = false;
    document.querySelector('#attackerTypeFilter summary').focus({ preventScroll: true });
  });
  document.getElementById('attackerCategoryFilter').addEventListener('click', function (event) {
    var button = event.target.closest('[data-attacker-category]'); if (!button) return;
    selectedCategory = button.dataset.attackerCategory; expanded.clear(); updateURL(); updateControls(); render();
  });
  document.getElementById('attackerSearch').value = query;
  document.getElementById('attackerSearch').addEventListener('input', function (event) {
    query = event.target.value; expanded.clear(); updateURL(); updateControls(); render();
  });
  document.getElementById('clearAttackerFilters').addEventListener('click', function () {
    selectedType = contextual ? 'recommended' : 'all'; selectedCategory = 'all'; query = '';
    document.getElementById('attackerSearch').value = ''; expanded.clear(); updateURL(); updateControls(); render();
  });
  if (contextual) {
    document.getElementById('raidContext').hidden = false;
    document.getElementById('raidContextTitle').textContent = 'Atacantes contra ' + boss;
    document.getElementById('raidContextDescription').textContent = 'Tipos eficaces: ' + counterTypes.map(function (type) { return TYPE_LABELS[type]; }).join(', ') + '. Ranking general por tipo; no simula los movimientos de este jefe.';
  }
  buildTypeFilters(); updateControls();
  RadarData.load({
    key: 'pokeradar_attackers_v2', url: 'scratch_atacantes.json', validate: validate,
    render: function (value) {
      data = value; ready = true; render(); RadarCompare.mount(data, TYPE_LABELS);
      var date = new Date(value[0].updatedAt);
      document.getElementById('rankingUpdated').textContent = Number.isNaN(date.getTime()) ? '' : 'Consultado el ' + date.toLocaleDateString('es');
      var methods = value[0].methodology;
      document.getElementById('rankingScenario').textContent = methods ?
        'La fuente compara equipos de seis Pokémon iguales de nivel ' + methods.pokemonLevel +
        ' contra un conjunto de jefes, con multiplicador de amistad ×' + methods.friendshipMultiplier +
        ' y ' + methods.rejoinSeconds + ' segundos para volver al combate. Ajuste Mega: ' + methods.megaLevelLabel +
        '. Permite movimientos de otros tipos. Los resultados cambian según el jefe y la configuración.' :
        'Consulta la configuración del combate en el enlace de la fuente. Los resultados cambian según el jefe y la configuración.';
    },
    loading: function () { RadarData.loading(grid, 'Cargando ranking de atacantes…'); },
    error: function () {
      document.getElementById('attackerResultCount').textContent = 'Datos no disponibles';
      RadarData.message(grid, 'No pudimos cargar el ranking. Vuelve a entrar cuando tengas conexión.');
    }
  });
})();

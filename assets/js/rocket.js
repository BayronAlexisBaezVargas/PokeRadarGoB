(function(){
  "use strict";

  /* ============ Tipos y Efectividades (Reutilizado) ============ */
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

  function norm(s){ return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }


  var TYPE_CHART = {
    normal:   { rock:0.5, ghost:0, steel:0.5 },
    fire:     { fire:0.5, water:0.5, grass:2, ice:2, bug:2, rock:0.5, dragon:0.5, steel:2 },
    water:    { fire:2, water:0.5, grass:0.5, ground:2, rock:2, dragon:0.5 },
    electric: { water:2, electric:0.5, grass:0.5, ground:0, flying:2, dragon:0.5 },
    grass:    { fire:0.5, water:2, grass:0.5, poison:0.5, ground:2, flying:0.5, bug:0.5, rock:2, dragon:0.5, steel:0.5 },
    ice:      { fire:0.5, water:0.5, grass:2, ice:0.5, ground:2, flying:2, dragon:2, steel:0.5 },
    fighting: { normal:2, ice:2, poison:0.5, flying:0.5, psychic:0.5, bug:0.5, rock:2, ghost:0, dark:2, steel:2, fairy:0.5 },
    poison:   { grass:2, poison:0.5, ground:0.5, rock:0.5, ghost:0.5, steel:0, fairy:2 },
    ground:   { fire:2, electric:2, grass:0.5, poison:2, flying:0, bug:0.5, rock:2, steel:2 },
    flying:   { electric:0.5, grass:2, fighting:2, bug:2, rock:0.5, steel:0.5 },
    psychic:  { fighting:2, poison:2, psychic:0.5, dark:0, steel:0.5 },
    bug:      { fire:0.5, grass:2, fighting:0.5, poison:0.5, flying:0.5, psychic:2, ghost:0.5, dark:2, steel:0.5, fairy:0.5 },
    rock:     { fire:2, ice:2, fighting:0.5, ground:0.5, flying:2, bug:2, steel:0.5 },
    ghost:    { normal:0, psychic:2, ghost:2, dark:0.5 },
    dragon:   { dragon:2, steel:0.5, fairy:0 },
    dark:     { fighting:0.5, psychic:2, ghost:2, dark:0.5, fairy:0.5 },
    steel:    { fire:0.5, water:0.5, electric:0.5, ice:2, rock:2, steel:0.5, fairy:2 },
    fairy:    { fire:0.5, fighting:2, poison:0.5, dragon:2, dark:2, steel:0.5 }
  };

  function calculateEffectiveness(defenderTypes){
    var allTypes = Object.keys(TYPE_LABELS);
    var weak = [];
    var resist = [];
    allTypes.forEach(function(atk){
      var mult = 1.0;
      defenderTypes.forEach(function(def){
        if(TYPE_CHART[atk] && TYPE_CHART[atk][def] !== undefined){
          mult *= TYPE_CHART[atk][def];
        }
      });
      if(mult > 1.0) weak.push({ type: atk, mult: mult });
      else if(mult < 1.0) resist.push({ type: atk, mult: mult });
    });
    weak.sort(function(a,b){ return b.mult - a.mult; });
    resist.sort(function(a,b){ return a.mult - b.mult; });
    return { weak: weak, resist: resist };
  }

  function formatMultiplierBadges(items, linkToAtacantes){
    if(!items || !items.length) return '<span style="font-size:.74rem;color:var(--ink-dim);font-family:var(--font-mono)">Ninguno (Daño neutro)</span>';
    return items.map(function(item){
      var c = TYPE_COLORS[item.type];
      var multLabel = '';
      if(item.mult === 0) multLabel = ' ×0 (Inmune)';
      else if(item.mult >= 2.56) multLabel = ' ×2.56';
      else if(item.mult >= 1.6 || item.mult === 2) multLabel = ' ×1.6';
      else if(item.mult <= 0.39) multLabel = ' ×0.39';
      else if(item.mult < 1) multLabel = ' ×0.62';
      var st = 'color:'+c+';background:'+rgba(c,.16)+';border-color:'+rgba(c,.5);
      if (linkToAtacantes) return '<a class="badge badge-link" href="atacantes.html?type=' + item.type + '" style="' + st + '" title="Ver mejores atacantes de tipo ' + TYPE_LABELS[item.type] + '">' + TYPE_LABELS[item.type] + multLabel + ' ↗</a>';
      return '<span class="badge" style="' + st + '">'+
        TYPE_LABELS[item.type] + multLabel + '</span>';
    }).join('');
  }

  /* ============ Datos del Team GO Rocket ============ */
  var ROCKET_DATA = { leaders: [], grunts: [] };
  var ROCKET_CACHE_KEY = 'pokeradar_rocket_v2';
  var ROCKET_URL = 'https://pokelitee.github.io/leak-duck/rocket_lineups.json';
  var GRUNT_PHRASES = {
    "water": "¡Estas aguas son traicioneras!",
    "fire": "¿Sabes lo caliente que puede llegar a ser el aliento de fuego de los Pokémon?",
    "grass": "¡No nos vaciles!",
    "electric": "¡Prepárate para una sorpresa!",
    "flying": "¡Mi Pokémon pájaro quiere combatir contigo!",
    "bug": "¡Vamos, mi poderoso Pokémon bicho!",
    "normal": "Normal no significa débil.",
    "poison": "¡En posición y listos para atacar!",
    "ground": "¡Te haré morder el polvo!",
    "rock": "Soy fuerte como una roca.",
    "fighting": "¡Este cuerpo musculoso no es sólo para impresionar!",
    "ice": "El hielo te congelará de miedo.",
    "ghost": "Ji, ji, ji... ¡Qué miedo!",
    "psychic": "¿Te asustan los psíquicos que usan un poder invisible?",
    "dragon": "¡Grrr! ¿Qué te parece eso?",
    "dark": "Sé que los Pokémon no existen para hacer dinero... o eso creo.",
    "steel": "¡No eres rival para mi voluntad de hierro!",
    "fairy": "¡Mira a mi Pokémon tan lindo!",
    "mixed": "¡Prepárate para perder! (Señuelo / Mixto)"
};

  function normalizeRocketData(raw){
    if(!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Formato Rocket inválido');
    function pokemon(mon){
      if(!mon || typeof mon.name !== 'string' || !mon.name.trim() || typeof mon.asset_url !== 'string') throw new Error('Pokémon incompleto');
      var asset = new URL(mon.asset_url);
      var match = asset.pathname.match(/pm(\d+)\./);
      if(asset.origin !== 'https://cdn.leekduck.com' || !match) throw new Error('Imagen Rocket inválida');
      var dex = Number(match[1]);
      var apiId = dex;
      if(/^Alolan /.test(mon.name)) apiId = mon.name.replace(/^Alolan /, '').toLowerCase().replace(/ /g, '-') + '-alola';
      if(/^Galarian /.test(mon.name)) apiId = mon.name.replace(/^Galarian /, '').toLowerCase().replace(/ /g, '-') + '-galar';
      if(/^Hisuian /.test(mon.name)) apiId = mon.name.replace(/^Hisuian /, '').toLowerCase().replace(/ /g, '-') + '-hisui';
      if(/^Paldean /.test(mon.name)) apiId = mon.name.replace(/^Paldean /, '').toLowerCase().replace(/ /g, '-') + '-paldea';
      return {name:mon.name, dex:dex, apiId:apiId, image:asset.href, types:[], shiny:mon.shiny_available === true};
    }
    function phases(rows){
      if(!Array.isArray(rows) || rows.length !== 3) throw new Error('Faltan fases Rocket');
      return [1, 2, 3].map(function(slot){
        var row = rows.find(function(item){ return item.slot === slot; });
        if(!row || !Array.isArray(row.pokemons) || !row.pokemons.length || typeof row.is_encounter !== 'boolean') throw new Error('Fase Rocket incompleta');
        return {phase:'Fase ' + slot + (row.is_encounter ? ' (Encuentro)' : ''), mons:row.pokemons.map(pokemon), encounter:row.is_encounter};
      });
    }
    var leaders = ['Giovanni', 'Cliff', 'Sierra', 'Arlo'].map(function(name){
      return {id:name.toLowerCase(), name:name, role:name === 'Giovanni' ? 'El Jefe' : 'Líder', lineup:phases(raw[name])};
    });
    var grunts = Object.keys(raw).filter(function(name){ return /Grunt$/.test(name); }).map(function(name){
      var typeMatch = name.match(/^([A-Za-z]+)-type /);
      var type = typeMatch ? typeMatch[1].toLowerCase() : 'mixed';
      if(type !== 'mixed' && !TYPE_LABELS[type]) throw new Error('Tipo de recluta desconocido');
      var lineup = phases(raw[name]);
      var encounters = [];
      var seen = new Set();
      lineup.filter(function(row){ return row.encounter; }).forEach(function(row){
        row.mons.forEach(function(mon){
          if(!seen.has(mon.name)){ encounters.push(mon); seen.add(mon.name); }
        });
      });
      if(!encounters.length) throw new Error('Recluta sin encuentros');
      var gender = /Female/.test(name) ? 'Recluta mujer' : 'Recluta hombre';
      return {type:type, label:(TYPE_LABELS[type] || 'Mixto') + ' · ' + gender + (/Decoy/.test(name) ? ' · Señuelo' : ''), phrase:GRUNT_PHRASES[type] || GRUNT_PHRASES.mixed, mons:encounters};
    });
    if(grunts.length < 18) throw new Error('Listado de reclutas incompleto');
    return {leaders:leaders, grunts:grunts};
  }

  /* ============ Helpers ============ */
  function getMonImage(dex){
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + dex + '.png';
  }

  function rgba(hex, a){
    var h = hex.replace('#','');
    var n = Number.parseInt(h,16);
    return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')';
  }

  /* ============ Renderizado de Líderes ============ */
  var leadersGrid = document.getElementById('leadersGrid');
  
  function renderLeaders() {
    var expanded = new Set(Array.from(leadersGrid.querySelectorAll('details[open]')).map(function(card){ return card.dataset.leader; }));
    leadersGrid.innerHTML = '';
    ROCKET_DATA.leaders.forEach(function(leader) {
      var card = document.createElement('details');
      card.open = expanded.has(leader.id);
      card.className = 'leader-card reveal';
      card.dataset.leader = leader.id;
      
      var header = document.createElement('summary');
      header.className = 'leader-header';
      
      var avatar = document.createElement('div');
      avatar.className = 'leader-avatar';
      avatar.textContent = leader.name.charAt(0);
      
      var info = document.createElement('div');
      info.className = 'leader-info';
      var roleP = document.createElement('p');
      roleP.textContent = leader.role;
      var nameH3 = document.createElement('h3');
      nameH3.textContent = leader.name;
      info.appendChild(roleP);
      info.appendChild(nameH3);
      var encounter = document.createElement('span');
      encounter.className = 'leader-encounter';
      encounter.textContent = 'Rescate: ' + leader.lineup.filter(function(phase){ return phase.encounter; }).flatMap(function(phase){ return phase.mons.map(function(mon){ return mon.name; }); }).join(', ');
      info.appendChild(encounter);
      
      header.appendChild(avatar);
      header.appendChild(info);
      var toggle = document.createElement('span');
      toggle.className = 'leader-toggle';
      toggle.innerHTML = '<span class="when-closed">Ver equipo</span><span class="when-open">Ocultar</span><svg class="disclosure-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
      header.appendChild(toggle);
      card.appendChild(header);
      
      var lineupDiv = document.createElement('div');
      lineupDiv.className = 'leader-lineup';
      
      leader.lineup.forEach(function(phase, phaseIdx) {
        var phaseDiv = document.createElement('div');
        phaseDiv.className = 'lineup-phase slot-' + (phaseIdx + 1);
        
        var titleDiv = document.createElement('div');
        titleDiv.className = 'phase-title';
        titleDiv.innerHTML = '<span class="slot-badge">SLOT ' + (phaseIdx + 1) + '</span> <span>' + phase.phase + '</span>';
        phaseDiv.appendChild(titleDiv);
        
        var monsDiv = document.createElement('div');
        monsDiv.className = 'phase-mons';
        
        phase.mons.forEach(function(m) {
          var monDiv = document.createElement('div');
          monDiv.tabIndex = 0;
          monDiv.setAttribute('role', 'button');
          monDiv.setAttribute('aria-label', 'Ver detalles de ' + m.name);
          monDiv.className = 'rocket-mon' + (m.shiny ? ' shiny-possible' : '');
          monDiv.dataset.name = m.name;
          monDiv.dataset.dex = m.dex;
          monDiv.dataset.types = m.types.join(',');
          monDiv.dataset.apiId = m.apiId || m.dex;
          monDiv.dataset.image = m.image || getMonImage(m.dex);
          monDiv.dataset.shiny = String(m.shiny === true);
          
          var img = document.createElement('img');
          img.src = m.image || getMonImage(m.dex);
          img.alt = m.name;
          img.loading = 'lazy'; img.width = 48; img.height = 48;
          
          var span = document.createElement('span');
          span.textContent = m.name;
          
          monDiv.appendChild(img);
          monDiv.appendChild(span);

          if (m.shiny) {
            var shinyStar = document.createElement('span');
            shinyStar.className = 'shiny-badge-indicator';
            shinyStar.title = 'Posible Variocolor';
            shinyStar.innerHTML = '<span class="shiny-dot" aria-hidden="true"></span>';
            monDiv.appendChild(shinyStar);
          }

          monsDiv.appendChild(monDiv);
        });
        
        phaseDiv.appendChild(monsDiv);
        lineupDiv.appendChild(phaseDiv);
      });
      
      card.appendChild(lineupDiv);
      leadersGrid.appendChild(card);
    });
  }

  /* ============ Renderizado de Reclutas ============ */
  var gruntsGrid = document.getElementById('gruntsGrid');
  
  function renderGrunts() {
    gruntsGrid.innerHTML = '';
    ROCKET_DATA.grunts.forEach(function(grunt) {
      var card = document.createElement('div');
      card.className = 'grunt-card reveal';
      
      var c = TYPE_COLORS[grunt.type] || '#B4AE96';
      
      var header = document.createElement('div');
      header.className = 'grunt-header';
      var typeSpan = document.createElement('span');
      typeSpan.className = 'grunt-type';
      typeSpan.style.color = c;
      typeSpan.textContent = grunt.label || TYPE_LABELS[grunt.type] || 'Mixto';
      header.appendChild(typeSpan);

      var eff = calculateEffectiveness([grunt.type]);
      if(eff.weak && eff.weak.length){
        var countersWrap = document.createElement('div');
        countersWrap.className = 'grunt-counters';
        var cLabel = document.createElement('span');
        cLabel.className = 'grunt-counters-label';
        cLabel.textContent = 'Débil vs:';
        countersWrap.appendChild(cLabel);

        eff.weak.slice(0, 3).forEach(function(item){
          var badge = document.createElement('a'); badge.className = 'grunt-counter-badge badge-link'; badge.href = 'atacantes.html?type=' + item.type; badge.title = 'Ver mejores atacantes de tipo ' + TYPE_LABELS[item.type];
          badge.className = 'grunt-counter-badge badge-link';
          var col = TYPE_COLORS[item.type] || '#B4AE96';
          badge.style.color = col;
          badge.style.backgroundColor = rgba(col, 0.16);
          badge.style.borderColor = rgba(col, 0.45);
          badge.textContent = TYPE_LABELS[item.type];
          countersWrap.appendChild(badge);
        });
        header.appendChild(countersWrap);
      }
      card.appendChild(header);

      var quoteDiv = document.createElement('div');
      quoteDiv.className = 'grunt-quote';
      quoteDiv.textContent = grunt.phrase;
      card.appendChild(quoteDiv);
      
      var phaseDiv = document.createElement('div');
      phaseDiv.className = 'lineup-phase grunt-encounters';
      
      var titleDiv = document.createElement('div');
      titleDiv.className = 'phase-title';
      titleDiv.textContent = 'Posibles Encuentros';
      phaseDiv.appendChild(titleDiv);
      
      var monsDiv = document.createElement('div');
      monsDiv.className = 'phase-mons';
      
      grunt.mons.forEach(function(m) {
        var monDiv = document.createElement('div');
        monDiv.tabIndex = 0;
          monDiv.setAttribute('role', 'button');
          monDiv.setAttribute('aria-label', 'Ver detalles de ' + m.name);
          monDiv.className = 'rocket-mon';
        monDiv.dataset.name = m.name;
        monDiv.dataset.dex = m.dex;
        monDiv.dataset.types = '';
        monDiv.dataset.apiId = m.apiId || m.dex;
        monDiv.dataset.image = m.image || getMonImage(m.dex);
        monDiv.dataset.shiny = String(m.shiny === true);
        
        var img = document.createElement('img');
        img.src = m.image || getMonImage(m.dex);
        img.alt = m.name;
        img.loading = 'lazy'; img.width = 48; img.height = 48;
        
        var span = document.createElement('span');
        span.textContent = m.name;
        
        monDiv.appendChild(img);
        monDiv.appendChild(span);
        monsDiv.appendChild(monDiv);
      });
      
      phaseDiv.appendChild(monsDiv);
      card.appendChild(phaseDiv);
      
      card.dataset.search = norm(grunt.phrase + ' ' + (TYPE_LABELS[grunt.type] || '') + ' ' + grunt.mons.map(function(m){ return m.name; }).join(' '));
      gruntsGrid.appendChild(card);
    });
  }

  /* ============ Sistema de Modales Interactivo ============ */
  
  function openRocketModal(el) {
    if (Date.now() - lastModalCloseTime < 400) return;
    var name = el.dataset.name;
    var dex = el.dataset.dex;
    var typesStr = el.dataset.types;
    var types = typesStr ? typesStr.split(',') : [];
    var apiId = el.dataset.apiId || dex;
    
    var modal = document.getElementById('monModal');
    var mName = document.getElementById('modalName');
    var mDex = document.getElementById('modalDex');
    var mShiny = document.getElementById('modalShiny');
    var mImg = document.getElementById('modalImg');
    var mTypes = document.getElementById('modalTypes');
    
    var mWeak = document.getElementById('modalWeak');
    var mResist = document.getElementById('modalResist');
    var mStats = document.getElementById('modalGoStats');

    if(!modal) return;
    
    mName.textContent = name;
    mDex.textContent = 'N.° ' + dex;
    mShiny.style.display = el.dataset.shiny === 'true' ? 'inline-flex' : 'none';
    mImg.src = el.dataset.image || getMonImage(dex);
    modal.dataset.apiId = apiId;
    
    mTypes.innerHTML = '';
    types.forEach(function(t){
      var c = TYPE_COLORS[t];
      var badge = document.createElement('span');
      badge.className = 'badge';
      badge.style.color = c;
      badge.style.background = rgba(c, 0.16);
      badge.style.borderColor = rgba(c, 0.5);
      badge.textContent = TYPE_LABELS[t];
      mTypes.appendChild(badge);
    });
    
    // Set header glow based on primary type
    var primaryTypeColor = TYPE_COLORS[types[0]] || '#3df2c4';
    var mHeader = document.querySelector('.modal-header');
    if (mHeader) {
        mHeader.style.background = 'linear-gradient(180deg, ' + rgba(primaryTypeColor, 0.08) + ' 0%, transparent 100%)';
        mHeader.style.borderBottom = '1px solid ' + rgba(primaryTypeColor, 0.3);
    }
    var mGlow = document.getElementById('modalGlow');
    if (mGlow) {
        mGlow.style.background = 'radial-gradient(circle at center, ' + rgba(primaryTypeColor, 0.4) + ' 0%, transparent 70%)';
    }

    document.getElementById('modalTag').textContent = 'Pokémon Oscuro';
    
    // Calculate Weaknesses and Resistances
    var eff = calculateEffectiveness(types);
    mWeak.textContent = 'Consultando tipos…';
    mResist.textContent = 'Consultando tipos…';

    mStats.innerHTML = '<span style="font-size:.74rem;color:var(--ink-dim);font-family:var(--font-mono)">Cargando estadísticas base...</span>';

    // Fetch Base Stats from PokeAPI
    fetch('https://pokeapi.co/api/v2/pokemon/' + encodeURIComponent(apiId))
      .then(function(r){ if(!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        if(modal.dataset.apiId !== String(apiId)) return; // Prevent race conditions
        var actualTypes = data.types.map(function(item){ return item.type.name; });
        mTypes.replaceChildren();
        actualTypes.forEach(function(type){
          var badge = document.createElement('span');
          badge.className = 'badge';
          badge.textContent = TYPE_LABELS[type] || type;
          badge.style.color = TYPE_COLORS[type];
          mTypes.appendChild(badge);
        });
        var effectiveness = calculateEffectiveness(actualTypes);
        mWeak.innerHTML = formatMultiplierBadges(effectiveness.weak, true);
        mResist.innerHTML = formatMultiplierBadges(effectiveness.resist);
        var stats = {};
        data.stats.forEach(s => { stats[s.stat.name] = s.base_stat; });
        mStats.innerHTML = `
          <div class="modal-stat-card"><span class="modal-stat-label">Ataque</span><span class="modal-stat-val" style="color:var(--alert)">${stats['attack'] || '--'}</span></div>
          <div class="modal-stat-card"><span class="modal-stat-label">Defensa</span><span class="modal-stat-val" style="color:#4C9FE8">${stats['defense'] || '--'}</span></div>
          <div class="modal-stat-card"><span class="modal-stat-label">Salud (HP)</span><span class="modal-stat-val" style="color:#6FBE5A">${stats['hp'] || '--'}</span></div>
        `;
      })
      .catch(e => {
        if(modal.dataset.apiId !== String(apiId)) return;
        mWeak.textContent = 'No se pudieron consultar los tipos.';
        mResist.textContent = 'No se pudieron consultar los tipos.';
        mStats.innerHTML = '<span style="font-size:.74rem;color:var(--alert);font-family:var(--font-mono)">No se pudieron cargar las stats.</span>';
      });

    modal.showModal();
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }


  var lastModalCloseTime = 0;

  function closeRocketModal(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    lastModalCloseTime = Date.now();
    var mod = document.getElementById('monModal');
    if (mod && mod.open) {
      mod.close();
    }
  }

  document.body.addEventListener('keydown', function(e){
    if((e.key === 'Enter' || e.key === ' ') && e.target.matches('.rocket-mon')){
      e.preventDefault();
      openRocketModal(e.target);
    }
  });

  // Bind clicks
  document.body.addEventListener('click', function(e){
    if (Date.now() - lastModalCloseTime < 400) return;
    var t = e.target.closest('.rocket-mon');
    if(t) openRocketModal(t);
  });
  
  var mc = document.getElementById('modalClose');
  if(mc) {
    mc.addEventListener('click', function(e){
      closeRocketModal(e);
    });
  }

  var monModal = document.getElementById('monModal');
  if(monModal) {
    monModal.addEventListener('close', function(){
      lastModalCloseTime = Date.now();
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    });
    monModal.addEventListener('cancel', function(e){
      e.preventDefault();
      closeRocketModal(e);
    });
    monModal.addEventListener('click', function(e){
      if(e.target === monModal) closeRocketModal(e);
    });
  }

  function applyRocketData(raw){
    var validated = normalizeRocketData(raw);
    ROCKET_DATA = validated;
    renderLeaders();
    renderGrunts();
    // Aplicar la búsqueda y pestaña que el usuario ya eligió.
    document.querySelectorAll('.leader-card, .grunt-card').forEach(function(card){ card.classList.add('in'); });
    var search = document.getElementById('gruntSearch');
    if(search) search.dispatchEvent(new Event('input'));
    var activeTab = document.querySelector('#rocketTabsBar .rocket-tab-btn.active');
    if(activeTab){
      var filter = activeTab.dataset.leaderFilter;
      leadersGrid.querySelectorAll('.leader-card').forEach(function(card){ card.style.display = filter === 'all' || card.dataset.leader === filter ? '' : 'none'; });
    }
  }

  async function fetchRocketJson(url){
    var controller = new AbortController();
    var timeout = setTimeout(function(){ controller.abort(); }, 10000);
    try {
      var response = await fetch(url, {signal:controller.signal, cache:'no-store'});
      if(!response.ok) throw new Error('HTTP ' + response.status);
      var raw = await response.json();
      normalizeRocketData(raw);
      return raw;
    } finally { clearTimeout(timeout); }
  }

  async function loadRocketData(){
    var hasData = false;
    try {
      var saved = JSON.parse(localStorage.getItem(ROCKET_CACHE_KEY));
      if(saved){ applyRocketData(saved); hasData = true; }
    } catch(err){ console.info('Rocket: sin caché válida.'); }
    // El respaldo local se consulta en paralelo y nunca reemplaza datos más nuevos.
    var fallback = hasData ? Promise.resolve() : fetchRocketJson('data/rocket.json').then(function(raw){
      if(!hasData){ applyRocketData(raw); hasData = true; }
    }).catch(function(err){ console.warn('Rocket: respaldo no disponible.', err); });
    try {
      var raw = await fetchRocketJson(ROCKET_URL);
      applyRocketData(raw);
      hasData = true;
      try { localStorage.setItem(ROCKET_CACHE_KEY, JSON.stringify(raw)); } catch(err){}
    } catch(err){ console.warn('Rocket: usando última información válida.', err); }
    await fallback;
    if(!hasData){
      leadersGrid.textContent = 'No se pudieron cargar las alineaciones. Vuelve a entrar cuando tengas conexión.';
      gruntsGrid.textContent = 'No hay datos de reclutas disponibles.';
    }
  }

  /* ============ Init ============ */
  setTimeout(function(){
    Promise.resolve().then(loadRocketData);

    // Búsqueda en tiempo real de reclutas por frase o Pokémon
    var gruntSearch = document.getElementById('gruntSearch');
    var gruntEmptyNote = document.getElementById('gruntEmptyNote');
    if(gruntSearch){
      gruntSearch.addEventListener('input', function(){
        var q = norm(gruntSearch.value.trim());
        var visibleCount = 0;
        document.querySelectorAll('.grunt-card').forEach(function(card){
          var match = !q || (card.dataset.search && card.dataset.search.indexOf(q) !== -1);
          card.style.display = match ? '' : 'none';
          if(match) visibleCount++;
        });
        if(gruntEmptyNote){
          gruntEmptyNote.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      });
    }

    // Pestañas / Tabs de navegación rápida entre Líderes
    var tabsBar = document.getElementById('rocketTabsBar');
    if (tabsBar) {
      tabsBar.addEventListener('click', function(e) {
        var btn = e.target.closest('.rocket-tab-btn[data-leader-filter]');
        if (!btn) return;
        var filter = btn.getAttribute('data-leader-filter');
        tabsBar.querySelectorAll('.rocket-tab-btn').forEach(function(b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        if (typeof window.playClickSound === 'function') window.playClickSound();

        var cards = leadersGrid.querySelectorAll('.leader-card');
        cards.forEach(function(card) {
          if (filter === 'all' || card.dataset.leader === filter) {
            card.style.display = '';
            if(filter !== 'all') card.open = true;
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
  }, 300);

})();

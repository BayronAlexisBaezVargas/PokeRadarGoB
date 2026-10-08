(function(){
  "use strict";

  /* ============ Tipos y Efectividades (Reutilizado) ============ */
  var TYPE_COLORS = {
    normal:'#B4AE96', fire:'#FF7A45', water:'#4C9FE8', electric:'#F3D23B', grass:'#6FBE5A',
    ice:'#6FD4C8', fighting:'#D1483F', poison:'#A55FD1', ground:'#C9A25A', flying:'#92AEDC',
    psychic:'#F35E8A', bug:'#A6C22C', rock:'#B4A05C', ghost:'#6F5FA3', dragon:'#6E5AE6',
    dark:'#8C8398', steel:'#9FAAC0', fairy:'#E9A0D0'
  };
  var TYPE_LABELS = {
    normal:'Normal', fire:'Fuego', water:'Agua', electric:'Eléctrico', grass:'Planta',
    ice:'Hielo', fighting:'Lucha', poison:'Veneno', ground:'Tierra', flying:'Volador',
    psychic:'Psíquico', bug:'Bicho', rock:'Roca', ghost:'Fantasma', dragon:'Dragón',
    dark:'Siniestro', steel:'Acero', fairy:'Hada'
  };


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

  function formatMultiplierBadges(items){
    if(!items || !items.length) return '<span style="font-size:.74rem;color:var(--ink-dim);font-family:var(--font-mono)">Ninguno (Daño neutro)</span>';
    return items.map(function(item){
      var c = TYPE_COLORS[item.type];
      var multLabel = '';
      if(item.mult === 0) multLabel = ' ×0 (Inmune)';
      else if(item.mult >= 2.56) multLabel = ' ×2.56';
      else if(item.mult >= 1.6 || item.mult === 2) multLabel = ' ×1.6';
      else if(item.mult <= 0.39) multLabel = ' ×0.39';
      else if(item.mult < 1) multLabel = ' ×0.62';
      return '<span class="badge" style="color:'+c+';background:'+rgba(c,.16)+';border-color:'+rgba(c,.5)+'">'+
        TYPE_LABELS[item.type] + multLabel + '</span>';
    }).join('');
  }

  /* ============ Datos del Team GO Rocket ============ */
  var ROCKET_DATA = {
    leaders: [
      {
        id: 'giovanni',
        name: 'Giovanni',
        role: 'El Jefe',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/53.png', // Persian as placeholder
        lineup: [
          { phase: 'Fase 1', mons: [{ name:'Persian', dex:53, types:['normal'] }] },
          { phase: 'Fase 2', mons: [{ name:'Nidoking', dex:34, types:['poison','ground'] }, { name:'Rhyperior', dex:464, types:['ground','rock'] }, { name:'Garchomp', dex:445, types:['dragon','ground'] }] },
          { phase: 'Fase 3 (Encuentro)', mons: [{ name:'Cresselia', dex:488, types:['psychic'], shiny:false }] }
        ]
      },
      {
        id: 'cliff',
        name: 'Cliff',
        role: 'Líder',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png', // Machop
        lineup: [
          { phase: 'Fase 1 (Encuentro)', mons: [{ name:'Machop', dex:66, types:['fighting'], shiny:true }] },
          { phase: 'Fase 2', mons: [{ name:'Aerodactyl', dex:142, types:['rock','flying'] }, { name:'Kingdra', dex:230, types:['water','dragon'] }, { name:'Gallade', dex:475, types:['psychic','fighting'] }] },
          { phase: 'Fase 3', mons: [{ name:'Tyranitar', dex:248, types:['rock','dark'] }, { name:'Crobat', dex:169, types:['poison','flying'] }, { name:'Cradily', dex:346, types:['rock','grass'] }] }
        ]
      },
      {
        id: 'sierra',
        name: 'Sierra',
        role: 'Líder',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/328.png', // Trapinch
        lineup: [
          { phase: 'Fase 1 (Encuentro)', mons: [{ name:'Trapinch', dex:328, types:['ground'], shiny:true }] },
          { phase: 'Fase 2', mons: [{ name:'Sableye', dex:302, types:['dark','ghost'] }, { name:'Honchkrow', dex:430, types:['dark','flying'] }, { name:'Milotic', dex:350, types:['water'] }] },
          { phase: 'Fase 3', mons: [{ name:'Houndoom', dex:229, types:['dark','fire'] }, { name:'Alakazam', dex:65, types:['psychic'] }, { name:'Victreebel', dex:71, types:['grass','poison'] }] }
        ]
      },
      {
        id: 'arlo',
        name: 'Arlo',
        role: 'Líder',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/331.png', // Cacnea
        lineup: [
          { phase: 'Fase 1 (Encuentro)', mons: [{ name:'Cacnea', dex:331, types:['grass'], shiny:true }] },
          { phase: 'Fase 2', mons: [{ name:'Charizard', dex:6, types:['fire','flying'] }, { name:'Hypno', dex:97, types:['psychic'] }, { name:'Gorok', dex:75, types:['rock','ground'] }] }, // Graveler -> Gorok
          { phase: 'Fase 3', mons: [{ name:'Dragonite', dex:149, types:['dragon','flying'] }, { name:'Scizor', dex:212, types:['bug','steel'] }, { name:'Salamence', dex:373, types:['dragon','flying'] }] }
        ]
      }
    ],
    grunts: [
      { type: 'water', phrase: '¡Estas aguas son traicioneras!', mons: [{name:'Magikarp', dex:129},{name:'Totodile', dex:158},{name:'Mudkip', dex:258}] },
      { type: 'fire', phrase: '¿Sabes lo caliente que puede llegar a ser el aliento de fuego de los Pokémon?', mons: [{name:'Charmander', dex:4},{name:'Cyndaquil', dex:155},{name:'Houndour', dex:228}] },
      { type: 'grass', phrase: '¡No nos vaciles!', mons: [{name:'Treecko', dex:252},{name:'Turtwig', dex:387},{name:'Snivy', dex:495}] },
      { type: 'electric', phrase: '¡Prepárate para una sorpresa!', mons: [{name:'Mareep', dex:179},{name:'Shinx', dex:403},{name:'Joltik', dex:595}] },
      { type: 'flying', phrase: '¡Mi Pokémon pájaro quiere combatir contigo!', mons: [{name:'Pidgey', dex:16},{name:'Zubat', dex:41},{name:'Starly', dex:396}] },
      { type: 'bug', phrase: '¡Vamos, mi poderoso Pokémon bicho!', mons: [{name:'Weedle', dex:13},{name:'Scyther', dex:123},{name:'Shuckle', dex:213}] },
      { type: 'normal', phrase: 'Normal no significa débil.', mons: [{name:'Rattata', dex:19},{name:'Meowth', dex:52},{name:'Snorlax', dex:143}] },
      { type: 'poison', phrase: '¡En posición y listos para atacar!', mons: [{name:'Grimer', dex:88},{name:'Koffing', dex:109},{name:'Foongus', dex:590}] },
      { type: 'ground', phrase: '¡Te haré morder el polvo!', mons: [{name:'Sandshrew', dex:27},{name:'Drilbur', dex:529},{name:'Rhyhorn', dex:111}] },
      { type: 'rock', phrase: 'Soy fuerte como una roca.', mons: [{name:'Geodude', dex:74},{name:'Onix', dex:95},{name:'Cranidos', dex:408}] },
      { type: 'fighting', phrase: '¡Este cuerpo musculoso no es sólo para impresionar!', mons: [{name:'Machop', dex:66},{name:'Hitmonlee', dex:106},{name:'Makuhita', dex:296}] },
      { type: 'ice', phrase: 'El hielo te congelará de miedo.', mons: [{name:'Swinub', dex:220},{name:'Snorunt', dex:361},{name:'Snover', dex:459}] },
      { type: 'ghost', phrase: 'Ji, ji, ji... ¡Qué miedo!', mons: [{name:'Misdreavus', dex:200},{name:'Duskull', dex:355},{name:'Litwick', dex:607}] },
      { type: 'psychic', phrase: '¿Te asustan los psíquicos que usan un poder invisible?', mons: [{name:'Abra', dex:63},{name:'Ralts', dex:280},{name:'Gothita', dex:574}] },
      { type: 'dragon', phrase: '¡Grrr! ¿Qué te parece eso?', mons: [{name:'Dratini', dex:147},{name:'Bagon', dex:371},{name:'Gible', dex:443}] },
      { type: 'dark', phrase: 'Sé que los Pokémon no existen para hacer dinero... o eso creo.', mons: [{name:'Purrloin', dex:509},{name:'Houndour', dex:228},{name:'Poochyena', dex:261}] },
      { type: 'steel', phrase: '¡No eres rival para mi voluntad de hierro!', mons: [{name:'Aron', dex:304},{name:'Beldum', dex:374},{name:'Ferroseed', dex:597}] },
      { type: 'fairy', phrase: '¡Mira a mi Pokémon tan lindo!', mons: [{name:'Snubbull', dex:209},{name:'Ralts', dex:280},{name:'Mawile', dex:303}] },
      { type: 'mixed', phrase: '¡Prepárate para perder! (Señuelo / Mixto)', mons: [{name:'Snorlax', dex:143},{name:'Poliwrath', dex:62},{name:'Dragonite', dex:149}] }
    ]
  };

  /* ============ Helpers ============ */
  function getMonImage(dex){
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + dex + '.png';
  }

  function rgba(hex, a){
    var h = hex.replace('#','');
    var n = Number.parseInt(h,16);
    return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')';
  }

  /* ============ Renderizado de Líderes ============ */
  var leadersGrid = document.getElementById('leadersGrid');
  
  function renderLeaders() {
    leadersGrid.innerHTML = '';
    ROCKET_DATA.leaders.forEach(function(leader) {
      var card = document.createElement('div');
      card.className = 'leader-card reveal';
      
      var header = document.createElement('div');
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
      
      header.appendChild(avatar);
      header.appendChild(info);
      card.appendChild(header);
      
      var lineupDiv = document.createElement('div');
      lineupDiv.className = 'leader-lineup';
      
      leader.lineup.forEach(function(phase) {
        var phaseDiv = document.createElement('div');
        phaseDiv.className = 'lineup-phase';
        
        var titleDiv = document.createElement('div');
        titleDiv.className = 'phase-title';
        titleDiv.textContent = phase.phase;
        phaseDiv.appendChild(titleDiv);
        
        var monsDiv = document.createElement('div');
        monsDiv.className = 'phase-mons';
        
        phase.mons.forEach(function(m) {
          var monDiv = document.createElement('div');
          monDiv.className = 'rocket-mon' + (m.shiny ? ' shiny-possible' : '');
          monDiv.dataset.name = m.name;
          monDiv.dataset.dex = m.dex;
          monDiv.dataset.types = m.types.join(',');
          
          var img = document.createElement('img');
          img.src = getMonImage(m.dex);
          img.alt = m.name;
          img.loading = 'lazy';
          
          var span = document.createElement('span');
          span.textContent = m.name;
          
          monDiv.appendChild(img);
          monDiv.appendChild(span);
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
      typeSpan.textContent = TYPE_LABELS[grunt.type] || 'Mixto';
      header.appendChild(typeSpan);
      card.appendChild(header);
      
      var quoteDiv = document.createElement('div');
      quoteDiv.className = 'grunt-quote';
      quoteDiv.textContent = grunt.phrase;
      card.appendChild(quoteDiv);
      
      var phaseDiv = document.createElement('div');
      phaseDiv.className = 'lineup-phase';
      phaseDiv.style.background = 'transparent';
      phaseDiv.style.border = 'none';
      phaseDiv.style.padding = '0';
      
      var titleDiv = document.createElement('div');
      titleDiv.className = 'phase-title';
      titleDiv.textContent = 'Posibles Encuentros';
      phaseDiv.appendChild(titleDiv);
      
      var monsDiv = document.createElement('div');
      monsDiv.className = 'phase-mons';
      monsDiv.style.gap = '6px';
      
      grunt.mons.forEach(function(m) {
        var monDiv = document.createElement('div');
        monDiv.className = 'rocket-mon';
        monDiv.dataset.name = m.name;
        monDiv.dataset.dex = m.dex;
        monDiv.dataset.types = grunt.type;
        
        var img = document.createElement('img');
        img.src = getMonImage(m.dex);
        img.alt = m.name;
        img.loading = 'lazy';
        
        var span = document.createElement('span');
        span.textContent = m.name;
        
        monDiv.appendChild(img);
        monDiv.appendChild(span);
        monsDiv.appendChild(monDiv);
      });
      
      phaseDiv.appendChild(monsDiv);
      card.appendChild(phaseDiv);
      
      gruntsGrid.appendChild(card);
    });
  }

  /* ============ Sistema de Modales Interactivo ============ */
  
  function openRocketModal(el) {
    var name = el.dataset.name;
    var dex = el.dataset.dex;
    var typesStr = el.dataset.types;
    var types = typesStr ? typesStr.split(',') : ['normal'];
    
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
    mShiny.style.display = 'inline-flex';
    mImg.src = getMonImage(dex);
    
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
    mWeak.innerHTML = formatMultiplierBadges(eff.weak);
    mResist.innerHTML = formatMultiplierBadges(eff.resist);

    mStats.innerHTML = '<span style="font-size:.74rem;color:var(--ink-dim);font-family:var(--font-mono)">Cargando estadísticas base...</span>';

    // Fetch Base Stats from PokeAPI
    fetch('https://pokeapi.co/api/v2/pokemon/' + dex)
      .then(r => r.json())
      .then(data => {
        if(mDex.textContent !== 'N.° ' + dex) return; // Prevent race conditions
        var stats = {};
        data.stats.forEach(s => { stats[s.stat.name] = s.base_stat; });
        mStats.innerHTML = `
          <div class="modal-stat-card"><span class="modal-stat-label">Ataque</span><span class="modal-stat-val" style="color:var(--alert)">${stats['attack'] || '--'}</span></div>
          <div class="modal-stat-card"><span class="modal-stat-label">Defensa</span><span class="modal-stat-val" style="color:#4C9FE8">${stats['defense'] || '--'}</span></div>
          <div class="modal-stat-card"><span class="modal-stat-label">Salud (HP)</span><span class="modal-stat-val" style="color:#6FBE5A">${stats['hp'] || '--'}</span></div>
        `;
      })
      .catch(e => {
        if(mDex.textContent === 'N.° ' + dex) mStats.innerHTML = '<span style="font-size:.74rem;color:var(--alert);font-family:var(--font-mono)">No se pudieron cargar las stats.</span>';
      });

    modal.showModal();
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }


  // Bind clicks
  document.body.addEventListener('click', function(e){
    var t = e.target.closest('.rocket-mon');
    if(t) openRocketModal(t);
  });
  
  var mc = document.getElementById('modalClose');
  if(mc) {
    mc.addEventListener('click', function(){
      var mod = document.getElementById('monModal');
      if(mod) mod.close();
    });
    mc.addEventListener('pointerup', function(){
      var mod = document.getElementById('monModal');
      if(mod) mod.close();
    });
  }

  var monModal = document.getElementById('monModal');
  if(monModal) {
    monModal.addEventListener('close', function(){
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    });
    monModal.addEventListener('cancel', function(e){
      e.preventDefault();
      monModal.close();
    });
    monModal.addEventListener('click', function(e){
      if(e.target === monModal) monModal.close();
    });
  }

  /* ============ Init ============ */
  setTimeout(function(){
    renderLeaders();
    renderGrunts();
    
    // Intersection observer para Reveal
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, {threshold: 0.01, rootMargin: '60px'});
    
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
    
  }, 300);

})();

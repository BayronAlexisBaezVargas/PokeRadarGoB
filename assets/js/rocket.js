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
    var n = parseInt(h,16);
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
          monDiv.setAttribute('data-name', m.name);
          monDiv.setAttribute('data-dex', m.dex);
          monDiv.setAttribute('data-types', m.types.join(','));
          
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
        monDiv.setAttribute('data-name', m.name);
        monDiv.setAttribute('data-dex', m.dex);
        monDiv.setAttribute('data-types', grunt.type);
        
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
    var name = el.getAttribute('data-name');
    var dex = el.getAttribute('data-dex');
    var typesStr = el.getAttribute('data-types');
    var types = typesStr ? typesStr.split(',') : ['normal'];
    
    var modal = document.getElementById('monModal');
    var mName = document.getElementById('modalName');
    var mDex = document.getElementById('modalDex');
    var mShiny = document.getElementById('modalShiny');
    var mImg = document.getElementById('modalImg');
    var mTypes = document.getElementById('modalTypes');
    
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
    
    document.getElementById('modalTag').textContent = 'Pokémon Oscuro';
    document.getElementById('modalGoStats').innerHTML = ''; // Limpiar stats de GO por ahora
    
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
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
      document.getElementById('monModal').classList.remove('open');
      document.body.style.overflow = '';
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

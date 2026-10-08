(function(){
  "use strict";

  // Telemetría de Audio manejada por audio.js


  /* ============ Tipos ============ */
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
  var WEATHER_LABELS = {
    rainy:'Lluvia', sunny:'Soleado', partlycloudy:'Parc. nublado', cloudy:'Nublado',
    windy:'Viento', snow:'Nieve', fog:'Niebla'
  };

  /* ============ Datos: Incursiones Activas ============ */
  function mon(o){ return o; }

  var RAID_GROUPS = [
    {
      id:'t1', tier:'1★', title:'Incursiones 1★',
      note:'Evento PokémonXP',
      end:new Date(2026,7,30,20,0),
      mons:[
        mon({name:'Pikachu', tag:'Disfraz Cosmog', dex:'025', types:['electric'], cp:[493,536], cpBoost:[616,670], weather:['rainy']}),
        mon({name:'Impidimp', dex:'859', types:['dark','fairy'], cp:[421,461], cpBoost:[526,576], weather:['fog','cloudy']})
      ]
    },
    {
      id:'t3', tier:'3★', title:'Incursiones 3★',
      note:'Rotación semanal',
      end:null,
      mons:[
        mon({name:'Dondozo', dex:'977', types:['water'], cp:[1530,1604], cpBoost:[1913,2005], weather:['rainy'], weak:['electric','grass'], shiny:true}),
        mon({name:'Samurott', tag:'Forma Hisui', dex:'503', types:['water','dark'], cp:[1511,1585], cpBoost:[1889,1982], weather:['rainy','fog'], weak:['bug','electric','fairy','fighting','grass'], shiny:true}),
        mon({name:'Lapras', tag:'Disfraz Bufanda', dex:'131', types:['water','ice'], cp:[1435,1509], cpBoost:[1794,1886], weather:['rainy','snow'], weak:['fighting','rock','electric','grass'], shiny:true})
      ]
    },
    {
      id:'t5', tier:'5★', title:'Incursiones 5★ · Legendarias',
      note:'Titanes Legendarios',
      end:new Date(2026,8,8,10,0),
      mons:[
        mon({name:'Regirock', dex:'377', types:['rock'], cp:[1703,1784], cpBoost:[2129,2230], weather:['partlycloudy'], weak:['water','grass','fighting','ground','steel'], shiny:true}),
        mon({name:'Regice', dex:'378', types:['ice'], cp:[1703,1784], cpBoost:[2129,2230], weather:['snow'], weak:['fighting','fire','rock','steel'], shiny:true}),
        mon({name:'Registeel', dex:'379', types:['steel'], cp:[1326,1398], cpBoost:[1658,1748], weather:['snow'], weak:['fire','fighting','ground'], shiny:true})
      ]
    },
    {
      id:'tm', tier:'MEGA', title:'Megaincursiones',
      note:'',
      end:new Date(2026,8,8,10,0),
      mons:[
        mon({name:'Gyarados', tag:'Mega', dex:'130', types:['water','dark'], cp:[1855,1937], cpBoost:[2319,2422], weather:['rainy','fog'], weak:['bug','electric','fairy','fighting','grass'], shiny:true})
      ]
    },
    {
      id:'ts', tier:'SOMBRA', title:'Incursiones Sombra',
      note:'',
      end:new Date(2026,8,8,20,0),
      subgroups:[
        { label:'1★ Sombra', mons:[
          mon({name:'Slowpoke', tag:'Sombra', dex:'079', types:['water','psychic'], cp:[610,700], cpBoost:[763,876], weather:['rainy','windy']}),
          mon({name:'Aipom', tag:'Sombra', dex:'190', types:['normal'], cp:[678,770], cpBoost:[848,963], weather:['partlycloudy']}),
          mon({name:'Croagunk', tag:'Sombra', dex:'453', types:['poison','fighting'], cp:[466,544], cpBoost:[583,680], weather:['cloudy']}),
          mon({name:'Grubbin', tag:'Sombra', dex:'736', types:['bug'], cp:[483,562], cpBoost:[604,703], weather:['rainy']})
        ]},
        { label:'3★ Sombra', mons:[
          mon({name:'Snorlax', tag:'Sombra', dex:'143', types:['normal'], cp:[1696,1843], cpBoost:[2120,2304], weather:['partlycloudy']}),
          mon({name:'Hitmontop', tag:'Sombra', dex:'237', types:['fighting'], cp:[1114,1232], cpBoost:[1393,1540], weather:['cloudy']}),
          mon({name:'Lampent', tag:'Sombra', dex:'608', types:['ghost','fire'], cp:[871,976], cpBoost:[1089,1220], weather:['fog','sunny']})
        ]},
        { label:'5★ Sombra', note:'sábados y domingos', mons:[
          mon({name:'Giratina', tag:'Sombra (Forma Alterada)', dex:'487', types:['ghost','dragon'], cp:[1782,1931], cpBoost:[2228,2414], weather:['fog','windy'], note:'Disponible exclusivamente sábados y domingos'})
        ]}
      ]
    }
  ];

  /* ============ Datos: Próximas Incursiones ============ */
  var UPCOMING_RAID_GROUPS = [];

  /* ============ Datos: Silvestres ============ */
  var WILD_GROUPS = [
    {
      id:'wf', title:'Apariciones frecuentes',
      note:'Evento PokémonXP', end:new Date(2026,7,28,10,0),
      mons:[
        mon({name:'Ralts', dex:'280', types:['psychic'], signal:'alta'}),
        mon({name:'Numel', dex:'322', types:['fire','ground'], signal:'alta'}),
        mon({name:'Spheal', dex:'363', types:['ice','water'], signal:'alta'}),
        mon({name:'Drifloon', dex:'425', types:['ghost','flying'], signal:'alta'}),
        mon({name:'Elgyem', dex:'605', types:['psychic'], signal:'alta'}),
        mon({name:'Sobble', dex:'816', types:['water'], signal:'alta'}),
        mon({name:'Pawmi', dex:'921', types:['electric'], signal:'alta'})
      ]
    },
    {
      id:'wr', title:'Apariciones poco comunes',
      note:'Evento PokémonXP', end:new Date(2026,7,28,10,0),
      mons:[
        mon({name:'Deino', dex:'633', types:['dark','dragon'], signal:'baja'})
      ]
    }
  ];

  var UPCOMING_WILD = [
    mon({name:'Mankey', dex:'056', types:['fighting']}),
    mon({name:'Lickitung', dex:'108', types:['normal']}),
    mon({name:'Totodile', dex:'158', types:['water']}),
    mon({name:'Wooper', dex:'194', types:['water','ground']}),
    mon({name:'Foongus', dex:'590', types:['grass','poison']}),
    mon({name:'Froakie', dex:'656', types:['water']}),
    mon({name:'Litten', dex:'725', types:['fire']}),
    mon({name:'Togetic', dex:'176', types:['fairy','flying'], rare:true}),
    mon({name:'Beldum', dex:'374', types:['steel','psychic'], rare:true})
  ];

  /* ============ Helpers de color ============ */
  function hexToRgb(hex){ var h=hex.replace('#',''); var n=Number.parseInt(h,16); return [(n>>16)&255,(n>>8)&255,n&255]; }
  function rgba(hex,a){ var c=hexToRgb(hex); return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'; }
  function shade(hex,percent){
    var c=hexToRgb(hex); var t=percent<0?0:255; var p=Math.abs(percent)/100;
    var nr=Math.round((t-c[0])*p+c[0]), ng=Math.round((t-c[1])*p+c[1]), nb=Math.round((t-c[2])*p+c[2]);
    return 'rgb('+nr+','+ng+','+nb+')';
  }
  function norm(s){ return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }

  /* ============ Render de piezas ============ */
  function typeBadges(types){
    return types.map(function(t){
      var c = TYPE_COLORS[t];
      return '<span class="badge" style="color:'+c+';background:'+rgba(c,.16)+';border-color:'+rgba(c,.5)+'">'+TYPE_LABELS[t]+'</span>';
    }).join('');
  }

  function orbStyle(types){
    if(!types || types.length === 0){
      return 'background:radial-gradient(circle at 32% 26%, '+rgba('#ffffff',.5)+', #B4AE96 45%, '+shade('#B4AE96',-35)+' 100%); box-shadow:0 0 22px '+rgba('#B4AE96',.42)+', inset 0 0 12px rgba(0,0,0,.35);';
    }
    if(types.length===1){
      var c=TYPE_COLORS[types[0]];
      return 'background:radial-gradient(circle at 32% 26%, '+rgba('#ffffff',.5)+', '+c+' 45%, '+shade(c,-35)+' 100%); box-shadow:0 0 22px '+rgba(c,.42)+', inset 0 0 12px rgba(0,0,0,.35);';
    }
    var a=TYPE_COLORS[types[0]], b=TYPE_COLORS[types[1]];
    return 'background:linear-gradient(150deg, '+a+' 0%, '+a+' 48%, '+shade(a,-12)+' 49%, '+b+' 51%, '+b+' 100%); box-shadow:0 0 22px '+rgba(a,.28)+', 0 0 22px '+rgba(b,.24)+', inset 0 0 12px rgba(0,0,0,.35);';
  }

  /* ============ Helper de imágenes ============ */
  function getMonImage(m){
    if(m.image) return m.image;
    var dexNum = Number.parseInt(m.dex, 10);
    if(m.name === 'Gyarados' && m.tag && m.tag.indexOf('Mega') !== -1){
      return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10041.png';
    }
    if(m.name === 'Samurott' && m.tag && m.tag.indexOf('Hisui') !== -1){
      return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10236.png';
    }
    if(m.name === 'Absol' && m.tag && m.tag.indexOf('Mega') !== -1){
      return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10057.png';
    }
    if(m.name === 'Houndoom' && m.tag && m.tag.indexOf('Mega') !== -1){
      return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10048.png';
    }
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + dexNum + '.png';
  }

  /* ============ Matriz de Tipos y Efectividades ============ */
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
      if(mult > 1.0){
        weak.push({ type: atk, mult: mult });
      } else if(mult < 1.0){
        resist.push({ type: atk, mult: mult });
      }
    });

    weak.sort(function(a,b){ return b.mult - a.mult; });
    resist.sort(function(a,b){ return a.mult - b.mult; });
    return { weak: weak, resist: resist };
  }

  function formatMultiplierBadges(items){
    if(!items || !items.length){
      return '<span style="font-size:.74rem;color:var(--ink-dim);font-family:var(--font-mono)">Ninguno (Daño neutro)</span>';
    }
    return items.map(function(item){
      var c = TYPE_COLORS[item.type];
      var multLabel = '';
      if(item.mult === 0) multLabel = ' ×0 (Inmune)';
      else if(item.mult >= 2.56) multLabel = ' ×2.56';
      else if(item.mult >= 1.6 || item.mult === 2) multLabel = ' ×1.6';
      else if(item.mult <= 0.39) multLabel = ' ×0.39';
      else if(item.mult < 1) multLabel = ' ×0.62';
      return '<span class="badge" style="color:'+c+';background:'+rgba(c,.16)+';border-color:'+rgba(c,.5)+'">'+
        TYPE_LABELS[item.type] + multLabel +
      '</span>';
    }).join('');
  }

  /* ============ Registro de Pokémon y Modal ============ */
  var MON_REGISTRY = {};
  var speciesCache = {};

  function registerMon(m){
    var key = 'pk_' + m.dex + '_' + (m.tag || '').replace(/[^a-zA-Z0-9]/g, '_');
    MON_REGISTRY[key] = m;
    return key;
  }

  var currentOpenDex = null;

  function runTypewriter(el, text) {
    el.innerHTML = '';
    el.classList.add('typing-cursor');
    var tid = (window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295).toString();
    el.dataset.tid = tid;
    var i = 0;
    function type() {
      if (el.dataset.tid != tid) return;
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, 10);
      } else {
        el.classList.remove('typing-cursor');
      }
    }
    type();
  }

  function fetchPokeApiDetails(dexStr){
    var dexNum = Number.parseInt(dexStr, 10);
    currentOpenDex = dexNum;
    var flavorEl = document.getElementById('modalFlavor');
    var genusEl = document.getElementById('modalGenus');
    var heightEl = document.getElementById('modalHeight');
    var weightEl = document.getElementById('modalWeight');

    if(speciesCache[dexNum]){
      var cached = speciesCache[dexNum];
      runTypewriter(flavorEl, cached.flavor || 'Sin descripción disponible en Pokédex.');
      genusEl.textContent = cached.genus ? 'Especie: ' + cached.genus : 'Especie Pokémon';
      heightEl.textContent = cached.height ? 'Altura: ' + cached.height + ' m' : '';
      weightEl.textContent = cached.weight ? 'Peso: ' + cached.weight + ' kg' : '';
      return;
    }

    runTypewriter(flavorEl, 'Analizando base de datos...');
    genusEl.textContent = 'Cargando datos...';
    heightEl.textContent = '';
    weightEl.textContent = '';

    Promise.all([
      fetch('https://pokeapi.co/api/v2/pokemon-species/' + dexNum).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; }),
      fetch('https://pokeapi.co/api/v2/pokemon/' + dexNum).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; })
    ]).then(function(res){
      if(currentOpenDex !== dexNum) return; // Evitar sobreescritura por petición desfasada
      var spData = res[0];
      var monData = res[1];
      var entry = { flavor: '', genus: '', height: '', weight: '' };

      if(spData){
        var esFlavor = spData.flavor_text_entries.filter(function(f){ return f.language.name === 'es'; });
        if(!esFlavor.length) esFlavor = spData.flavor_text_entries.filter(function(f){ return f.language.name === 'en'; });
        if(esFlavor.length) entry.flavor = esFlavor[0].flavor_text.replace(/[\f\n\r]/g, ' ');

        var esGenus = spData.genera.filter(function(g){ return g.language.name === 'es'; });
        if(esGenus.length) entry.genus = esGenus[0].genus;
      }

      if(monData){
        if(monData.height) entry.height = (monData.height / 10).toFixed(1);
        if(monData.weight) entry.weight = (monData.weight / 10).toFixed(1);
      }

      speciesCache[dexNum] = entry;

      runTypewriter(flavorEl, entry.flavor || 'Sin descripción disponible en Pokédex.');
      genusEl.textContent = entry.genus ? 'Especie: ' + entry.genus : 'Especie Pokémon';
      heightEl.textContent = entry.height ? 'Altura: ' + entry.height + ' m' : '';
      weightEl.textContent = entry.weight ? 'Peso: ' + entry.weight + ' kg' : '';
    });
  }

  function openMonModal(m){
    var modal = document.getElementById('monModal');
    var modalName = document.getElementById('modalName');
    var modalTag = document.getElementById('modalTag');
    var modalDex = document.getElementById('modalDex');
    var modalShiny = document.getElementById('modalShiny');
    var modalImg = document.getElementById('modalImg');
    var modalGlow = document.getElementById('modalGlow');
    var modalTypes = document.getElementById('modalTypes');
    var modalGoStats = document.getElementById('modalGoStats');
    var modalWeak = document.getElementById('modalWeak');
    var modalResist = document.getElementById('modalResist');

    var dexNum = Number.parseInt(m.dex, 10);
    modalName.textContent = m.name;
    modalDex.textContent = 'N.° ' + m.dex;
    if(m.tag){
      modalTag.textContent = m.tag;
      modalTag.style.display = 'block';
    } else {
      modalTag.style.display = 'none';
    }

    modalShiny.style.display = m.shiny ? 'inline-flex' : 'none';
    modalImg.src = getMonImage(m);
    modalImg.onerror = function(){
      this.onerror = null;
      this.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + dexNum + '.png';
    };
    modalGlow.setAttribute('style', orbStyle(m.types));
    modalTypes.innerHTML = typeBadges(m.types);

    // GO Stats cards
    var statsHTML = '';
    if(m.cp){
      statsHTML += '<div class="modal-stat-card">' +
        '<span class="modal-stat-label">Rango CP (Captura)</span>' +
        '<span class="modal-stat-val">' + m.cp[0] + ' – ' + m.cp[1] + '</span>' +
        (m.cpBoost ? '<span class="modal-stat-sub">Con clima: ' + m.cpBoost[0] + '–' + m.cpBoost[1] + '</span>' : '') +
      '</div>';
    }
    if(m.weather && m.weather.length){
      statsHTML += '<div class="modal-stat-card">' +
        '<span class="modal-stat-label">Clima potenciador</span>' +
        '<span class="modal-stat-val" style="font-size:.98rem;color:var(--signal);">' + m.weather.map(function(w){ return WEATHER_LABELS[w] || w; }).join(' · ') + '</span>' +
        '<span class="modal-stat-sub">+25% daño / Nivel 25</span>' +
      '</div>';
    }
    if(m.signal){
      statsHTML += '<div class="modal-stat-card">' +
        '<span class="modal-stat-label">Frecuencia silvestre</span>' +
        '<span class="modal-stat-val">' + (m.signal === 'alta' ? 'Alta' : 'Baja') + '</span>' +
      '</div>';
    }
    if(m.rare){
      statsHTML += '<div class="modal-stat-card">' +
        '<span class="modal-stat-label">Rareza</span>' +
        '<span class="modal-stat-val" style="color:var(--alert)">Poco común</span>' +
      '</div>';
    }
    if(m.note){
      statsHTML += '<div class="modal-stat-card" style="grid-column:1/-1;">' +
        '<span class="modal-stat-label">Detalle del evento</span>' +
        '<span class="modal-stat-sub" style="color:var(--alert);font-size:.8rem;">' + m.note + '</span>' +
      '</div>';
    }
    modalGoStats.innerHTML = statsHTML;

    // Type effectiveness
    var eff = calculateEffectiveness(m.types);
    modalWeak.innerHTML = formatMultiplierBadges(eff.weak);
    modalResist.innerHTML = formatMultiplierBadges(eff.resist);

    // Fetch live Pokédex lore
    fetchPokeApiDetails(m.dex);

    modal.showModal();
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMonModal(){
    var modal = document.getElementById('monModal');
    if(!modal) return;
    modal.close();
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  function cardHTML(m){
    var cpHTML = m.cp ? (
      '<div class="stat-row"><dt>CP</dt><dd>'+m.cp[0]+'–'+m.cp[1]+
      (m.cpBoost ? '<span class="boost">'+m.cpBoost[0]+'–'+m.cpBoost[1]+' con clima</span>' : '')+
      '</dd></div>'
    ) : '';
    var weatherHTML = (m.weather && m.weather.length) ? (
      '<div class="stat-row"><dt>Clima ideal</dt><dd>'+m.weather.map(function(w){return WEATHER_LABELS[w];}).join(' · ')+'</dd></div>'
    ) : '';
    var weakHTML = m.weak ? (
      '<div class="stat-row weak-row"><dt>Débil vs.</dt><dd>'+typeBadges(m.weak)+'</dd></div>'
    ) : '';
    var signalHTML = m.signal ? (
      '<div class="stat-row"><dt>Frecuencia</dt><dd><span class="bars '+m.signal+'"><i></i><i></i><i></i></span>'+(m.signal==='alta'?'Alta':'Baja')+'</dd></div>'
    ) : '';
    var searchable = norm(m.name+' '+(m.tag||''));
    var imgSrc = getMonImage(m);
    var dexNum = Number.parseInt(m.dex, 10);
    var monKey = registerMon(m);
    return (
      '<article class="card" data-mon-key="'+monKey+'" data-name="'+searchable+'" data-types="'+m.types.join(' ')+'" tabindex="0" role="button" aria-label="Ver detalles de '+m.name+'">'+
        '<span class="bracket tl"></span><span class="bracket tr"></span><span class="bracket bl"></span><span class="bracket br"></span>'+
        '<div class="card-top">'+
          '<div class="mon-avatar">'+
            '<div class="mon-avatar-glow" style="'+orbStyle(m.types)+'"></div>'+
            '<img class="mon-img" src="'+imgSrc+'" alt="'+m.name+'" loading="lazy" onerror="this.onerror=null;this.src=\'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+dexNum+'.png\';" />'+
          '</div>'+
          '<div class="card-id"><span class="dex">N.\u00b0 '+m.dex+'</span>'+(m.shiny?'<span class="shiny" title="Variocolor disponible">SHINY</span>':'')+'</div>'+
        '</div>'+
        '<h4 class="card-name">'+m.name+(m.tag?'<small>'+m.tag+'</small>':'')+'</h4>'+
        '<div class="types">'+typeBadges(m.types)+'</div>'+
        '<dl class="stats">'+cpHTML+weatherHTML+signalHTML+weakHTML+'</dl>'+
        (m.note?'<p class="mon-note">'+m.note+'</p>':'')+
        '<div class="card-click-hint">Ver detalles</div>'+
      '</article>'
    );
  }

  function countdownText(end){
    var diff = end.getTime() - Date.now();
    if(diff<=0) return 'Rotación en curso';
    var mins = Math.floor(diff/60000);
    var days = Math.floor(mins/1440);
    var hours = Math.floor((mins%1440)/60);
    var minutes = mins%60;
    if(days>0) return 'Termina en '+days+' d '+hours+' h';
    if(hours>0) return 'Termina en '+hours+' h '+minutes+' min';
    return 'Termina en '+minutes+' min';
  }

  function countdownStartText(start){
    var diff = start.getTime() - Date.now();
    if(diff<=0) return 'Disponible ahora';
    var mins = Math.floor(diff/60000);
    var days = Math.floor(mins/1440);
    var hours = Math.floor((mins%1440)/60);
    var minutes = mins%60;
    if(days>0) return 'Comienza en '+days+' d '+hours+' h';
    if(hours>0) return 'Comienza en '+hours+' h '+minutes+' min';
    return 'Comienza en '+minutes+' min';
  }

  function renderRaidGroup(g){
    var el = document.createElement('div');
    el.className = 'tier-group reveal';
    el.id = g.id;
    var head = document.createElement('div');
    head.className = 'section-head';
    head.innerHTML =
      '<div class="section-head-left"><span class="tier-pill">'+g.tier+'</span><h3>'+g.title+'</h3></div>'+
      '<div class="section-head-right">'+
        (g.note?'<span>'+g.note+'</span>':'')+
        (g.end?'<span class="countdown" data-end="'+g.end.getTime()+'">'+countdownText(g.end)+'</span>':'')+
      '</div>';
    el.appendChild(head);

    if(g.subgroups){
      g.subgroups.forEach(function(sg){
        var sub = document.createElement('div');
        sub.className = 'sub-tier';
        sub.innerHTML = '<h4>'+sg.label+(sg.note?' <em>· '+sg.note+'</em>':'')+'</h4><div class="grid">'+sg.mons.map(cardHTML).join('')+'</div>';
        el.appendChild(sub);
      });
    } else {
      var grid = document.createElement('div');
      grid.className = 'grid';
      grid.innerHTML = g.mons.map(cardHTML).join('');
      el.appendChild(grid);
    }
    var empty = document.createElement('p');
    empty.className = 'empty-note';
    empty.textContent = 'Sin coincidencias en el radar.';
    el.appendChild(empty);
    return el;
  }

  function renderUpcomingRaidGroup(g){
    var el = document.createElement('div');
    el.className = 'tier-group upcoming-tier-group reveal';
    el.id = g.id;
    var head = document.createElement('div');
    head.className = 'section-head';
    head.innerHTML =
      '<div class="section-head-left"><span class="tier-pill" style="color:var(--signal);border-color:rgba(61,242,196,.35);background:rgba(61,242,196,.08);">'+g.tier+'</span><h3>'+g.title+'</h3></div>'+
      '<div class="section-head-right">'+
        (g.note?'<span>'+g.note+'</span>':'')+
        (g.start?'<span class="countdown" data-start="'+g.start.getTime()+'">'+countdownStartText(g.start)+'</span>':'')+
      '</div>';
    el.appendChild(head);

    var grid = document.createElement('div');
    grid.className = 'grid';
    grid.innerHTML = g.mons.map(cardHTML).join('');
    el.appendChild(grid);

    var empty = document.createElement('p');
    empty.className = 'empty-note';
    empty.textContent = 'Sin coincidencias en el radar.';
    el.appendChild(empty);
    return el;
  }

  function renderWildGroup(g){
    var el = document.createElement('div');
    el.className = 'tier-group wild-group reveal';
    el.id = g.id;
    var head = document.createElement('div');
    head.className = 'section-head';
    head.innerHTML =
      '<div class="section-head-left"><h3>'+g.title+'</h3></div>'+
      '<div class="section-head-right">'+
        (g.note?'<span>'+g.note+'</span>':'')+
        (g.end?'<span class="countdown" data-end="'+g.end.getTime()+'">'+countdownText(g.end)+'</span>':'')+
      '</div>';
    el.appendChild(head);
    var grid = document.createElement('div');
    grid.className = 'grid';
    grid.innerHTML = g.mons.map(cardHTML).join('');
    el.appendChild(grid);
    var empty = document.createElement('p');
    empty.className = 'empty-note';
    empty.textContent = 'Sin coincidencias en el radar.';
    el.appendChild(empty);
    return el;
  }

  /* ============ Inicialización ============ */
  var motionOK = window.matchMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var raidGroupsEl = document.getElementById('raidGroups');
  RAID_GROUPS.forEach(function(g){ raidGroupsEl.appendChild(renderRaidGroup(g)); });

  fetch('https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/raids.json')
    .then(function(res){ return res.json(); })
    .then(function(data){
      var t1 = RAID_GROUPS.find(function(g){ return g.id === 't1'; });
      var t3 = RAID_GROUPS.find(function(g){ return g.id === 't3'; });
      var t5 = RAID_GROUPS.find(function(g){ return g.id === 't5'; });
      var tm = RAID_GROUPS.find(function(g){ return g.id === 'tm'; });
      var ts = RAID_GROUPS.find(function(g){ return g.id === 'ts'; });

      if (t1) t1.mons = [];
      if (t3) t3.mons = [];
      if (t5) t5.mons = [];
      if (tm) tm.mons = [];
      if (ts) ts.subgroups = [
        { label:'1★ Sombra', mons:[] },
        { label:'3★ Sombra', mons:[] },
        { label:'5★ Sombra', mons:[] }
      ];

      data.forEach(function(b){
        var isShadow = b.name.toLowerCase().indexOf('shadow') !== -1;
        var cleanName = b.name.replace(/^Shadow /i, '');
        var tag = '';
        if (cleanName.indexOf('Mega ') === 0) { tag = 'Mega'; cleanName = cleanName.replace(/^Mega /i, ''); }
        else if (cleanName.indexOf('Primal ') === 0) { tag = 'Primigenio'; cleanName = cleanName.replace(/^Primal /i, ''); }
        else if (isShadow) { tag = 'Sombra'; }

        var pMatch = cleanName.match(/\((.*?)\)/);
        if (pMatch) {
          if (!tag) tag = pMatch[1];
          else tag += ' (' + pMatch[1] + ')';
          cleanName = cleanName.replace(/\s*\(.*?\)/, '');
        }

        var dexMatch = b.image.match(/(?:pokemon_icon_|pm)(\d+)/);
        var dex = dexMatch ? dexMatch[1] : '000';

        var m = {
          name: cleanName,
          tag: tag,
          dex: dex,
          types: b.types.map(function(t){ return t.name; }),
          shiny: b.canBeShiny,
          image: b.image,
          cp: b.combatPower ? [b.combatPower.normal.min, b.combatPower.normal.max] : null,
          cpBoost: b.combatPower ? [b.combatPower.boosted.min, b.combatPower.boosted.max] : null,
          weather: b.boostedWeather ? b.boostedWeather.map(function(w){ return w.name; }) : []
        };
        
        if (isShadow) {
          if (b.tier === '1-Star Raids' && ts) ts.subgroups[0].mons.push(mon(m));
          else if (b.tier === '3-Star Raids' && ts) ts.subgroups[1].mons.push(mon(m));
          else if (b.tier === '5-Star Raids' && ts) ts.subgroups[2].mons.push(mon(m));
        } else {
          if (b.tier === '1-Star Raids' && t1) t1.mons.push(mon(m));
          else if (b.tier === '3-Star Raids' && t3) t3.mons.push(mon(m));
          else if (b.tier === '5-Star Raids' && t5) t5.mons.push(mon(m));
          else if (b.tier === 'Mega Raids' && tm) tm.mons.push(mon(m));
        }
      });

      if (ts) ts.subgroups = ts.subgroups.filter(function(sg){ return sg.mons.length > 0; });
      
      raidGroupsEl.innerHTML = '';
      RAID_GROUPS.forEach(function(g){ 
        var hasMons = g.subgroups ? g.subgroups.length > 0 : (g.mons && g.mons.length > 0);
        if(hasMons) { 
          var el = renderRaidGroup(g);
          el.classList.add('in');
          raidGroupsEl.appendChild(el); 
          if(typeof io !== 'undefined') { io.observe(el); }
        }
      });

      var totalRaids = RAID_GROUPS.reduce(function(n,g){
        return n + (g.subgroups ? g.subgroups.reduce(function(x,sg){return x+sg.mons.length;},0) : (g.mons?g.mons.length:0));
      },0);
      var statRaidsEl = document.getElementById('statRaids');
      if (statRaidsEl) statRaidsEl.innerHTML = '<span>'+totalRaids+'</span>';

      var tierNavEl = document.getElementById('tierNav');
      if(tierNavEl) {
        tierNavEl.innerHTML = RAID_GROUPS.filter(function(g){
          return g.subgroups ? g.subgroups.length > 0 : (g.mons && g.mons.length > 0);
        }).map(function(g){ return '<a href="#'+g.id+'" class="tier-chip">'+g.tier+'</a>'; }).join('') +
          '<a href="#upcomingRaidsSection" class="tier-chip" style="color:var(--signal);border-color:rgba(61,242,196,.35);">Próximas</a>';
        
        tierNavEl.querySelectorAll('a').forEach(function(a){
          a.addEventListener('click', function(e){
            e.preventDefault();
            var target = document.getElementById(a.getAttribute('href').slice(1));
            if(!target) return;
            target.scrollIntoView({behavior: motionOK ? 'smooth' : 'auto', block:'start'});
            if(motionOK){
              var head = target.querySelector('.section-head') || target;
              head.classList.add('flash');
              setTimeout(function(){ head.classList.remove('flash'); }, 900);
            }
          });
        });
      }

      buildTypeChips();
      filterAll();
    })
    .catch(console.error);



  // Cargar de inmediato si hay temporada en caché
  window.updateCurrentSeasonReadout();

  var upcomingRaidGroupsEl = document.getElementById('upcomingRaidGroups');
  if(upcomingRaidGroupsEl){
    fetch('https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.json')
      .then(function(res){ return res.json(); })
      .then(function(data){
        window.updateCurrentSeasonReadout(data);
        var now = new Date();
        var g5 = { id:'u-5s', tier:'5★', title:'Incursiones 5★ · Próximas', mons:[] };
        var gMega = { id:'u-mega', tier:'MEGA', title:'Megaincursiones · Próximas', mons:[] };
        var gShadow = { id:'u-shadow', tier:'SOMBRA', title:'Incursiones Sombra · Próximas', mons:[] };
        
        var promises = [];

        data.forEach(function(e){
          var start = new Date(e.start);
          if(start <= now) return;
          if(!e.extraData || !e.extraData.raidbattles || !e.extraData.raidbattles.bosses) return;
          if(e.eventType === 'raid-hour') return;

          var isMega = e.name.toLowerCase().indexOf('mega') !== -1;
          var isShadow = e.name.toLowerCase().indexOf('shadow') !== -1;

          e.extraData.raidbattles.bosses.forEach(function(b){
            var dexMatch = b.image.match(/(?:pokemon_icon_|pm)(\d+)/);
            var dex = dexMatch ? dexMatch[1] : '000';
            var m = {
              name: b.name,
              dex: dex,
              types: [],
              shiny: b.canBeShiny,
              image: b.image,
              note: 'Inicia: ' + start.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
            };
            
            var p = fetch('https://pokeapi.co/api/v2/pokemon/' + Number.parseInt(dex, 10))
              .then(function(r){ return r.ok ? r.json() : null; })
              .then(function(pd){
                if(pd && pd.types) {
                  m.types = pd.types.map(function(t){ return t.type.name; });
                } else {
                  m.types = ['normal'];
                }
                if(isMega) { m.tag = 'Mega'; gMega.mons.push(mon(m)); }
                else if(isShadow) { m.tag = 'Sombra'; gShadow.mons.push(mon(m)); }
                else { g5.mons.push(mon(m)); }
              })
              .catch(function(){
                m.types = ['normal'];
                if(isMega) { m.tag = 'Mega'; gMega.mons.push(mon(m)); }
                else if(isShadow) { m.tag = 'Sombra'; gShadow.mons.push(mon(m)); }
                else { g5.mons.push(mon(m)); }
              });
              
            promises.push(p);
          });
        });

        Promise.all(promises).then(function(){
          upcomingRaidGroupsEl.innerHTML = '';
          if(g5.mons.length) UPCOMING_RAID_GROUPS.push(g5);
          if(gMega.mons.length) UPCOMING_RAID_GROUPS.push(gMega);
          if(gShadow.mons.length) UPCOMING_RAID_GROUPS.push(gShadow);

          UPCOMING_RAID_GROUPS.forEach(function(g){ 
            var el = renderUpcomingRaidGroup(g);
            el.classList.add('in');
            upcomingRaidGroupsEl.appendChild(el); 
            if(typeof io !== 'undefined') { io.observe(el); }
          });
          buildTypeChips();
          filterAll();
        });
      })
      .catch(function(err){
        console.error('Error fetching upcoming raids', err);
        upcomingRaidGroupsEl.innerHTML = '<p class="empty-note" style="display:block;color:var(--alert);">Hubo un error al sincronizar las próximas incursiones.</p>';
      });
  }

  var wildGroupsEl = document.getElementById('wildGroups');
  WILD_GROUPS.forEach(function(g){ wildGroupsEl.appendChild(renderWildGroup(g)); });

  document.getElementById('upcomingWild').innerHTML = UPCOMING_WILD.map(function(m){
    var dexNum = Number.parseInt(m.dex, 10);
    var imgUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + dexNum + '.png';
    var monKey = registerMon(m);
    return '<div class="mini-chip" data-mon-key="'+monKey+'" tabindex="0" role="button" aria-label="Ver detalles de '+m.name+'">' +
      '<img class="mini-mon-img" src="'+imgUrl+'" alt="'+m.name+'" loading="lazy" />' +
      '<span>'+m.name+'</span>' +
      (m.rare?' <em>· poco común</em>':'') +
    '</div>';
  }).join('');

  var totalRaids = RAID_GROUPS.reduce(function(n,g){
    return n + (g.subgroups ? g.subgroups.reduce(function(m,sg){return m+sg.mons.length;},0) : g.mons.length);
  },0);
  var totalWild = WILD_GROUPS.reduce(function(n,g){return n+g.mons.length;},0);
  document.getElementById('statRaids').innerHTML = '<span>'+totalRaids+'</span>';
  document.getElementById('statWild').innerHTML = '<span>'+totalWild+'</span>';

  var tierNavEl = document.getElementById('tierNav');
  tierNavEl.innerHTML = RAID_GROUPS.map(function(g){ return '<a href="#'+g.id+'" class="tier-chip">'+g.tier+'</a>'; }).join('') +
    '<a href="#upcomingRaidsSection" class="tier-chip" style="color:var(--signal);border-color:rgba(61,242,196,.35);">Próximas</a>';

  tierNavEl.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if(!target) return;
      target.scrollIntoView({behavior: motionOK ? 'smooth' : 'auto', block:'start'});
      if(motionOK){
        var head = target.querySelector('.section-head') || target;
        head.classList.add('flash');
        setTimeout(function(){ head.classList.remove('flash'); }, 900);
      }
    });
  });

  /* Segmentos */
  document.querySelectorAll('.seg-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.seg-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      document.body.setAttribute('data-seg', btn.getAttribute('data-seg'));
    });
  });

  /* Chips de tipo */
  var activeTypes = new Set();
  var typeChipsEl = document.getElementById('typeChips');
  function buildTypeChips(){
    var used = new Set();
    RAID_GROUPS.forEach(function(g){
      var list = g.subgroups ? g.subgroups.reduce(function(a,sg){return a.concat(sg.mons);},[]) : g.mons;
      list.forEach(function(m){ m.types.forEach(function(t){ used.add(t); }); });
    });
    UPCOMING_RAID_GROUPS.forEach(function(g){
      var list = g.subgroups ? g.subgroups.reduce(function(a,sg){return a.concat(sg.mons);},[]) : g.mons;
      list.forEach(function(m){ m.types.forEach(function(t){ used.add(t); }); });
    });
    WILD_GROUPS.forEach(function(g){ g.mons.forEach(function(m){ m.types.forEach(function(t){ used.add(t); }); }); });
    UPCOMING_WILD.forEach(function(m){ m.types.forEach(function(t){ used.add(t); }); });
    var order = Object.keys(TYPE_COLORS).filter(function(t){ return used.has(t); });
    typeChipsEl.innerHTML = order.map(function(t){
      var activeCls = activeTypes.has(t) ? ' active' : '';
      return '<button class="chip type-chip'+activeCls+'" data-type="'+t+'" style="--tc:'+TYPE_COLORS[t]+'">'+TYPE_LABELS[t]+'</button>';
    }).join('');
    typeChipsEl.querySelectorAll('.type-chip').forEach(function(btn){
      btn.addEventListener('click', function(){
        var t = btn.getAttribute('data-type');
        if(activeTypes.has(t)){ activeTypes.delete(t); btn.classList.remove('active'); }
        else { activeTypes.add(t); btn.classList.add('active'); }
        filterAll();
      });
    });
  }
  buildTypeChips();

  /* Búsqueda + filtro */
  var searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', filterAll);

  function filterAll(){
    var q = norm(searchInput.value.trim());
    document.querySelectorAll('.card').forEach(function(c){
      var nameOk = !q || c.getAttribute('data-name').indexOf(q) !== -1;
      var types = c.getAttribute('data-types').split(' ');
      var typeOk = activeTypes.size===0 || types.some(function(t){ return activeTypes.has(t); });
      c.classList.toggle('is-hidden', !(nameOk && typeOk));
    });
    document.querySelectorAll('.tier-group').forEach(function(g){
      var anyVisible = g.querySelectorAll('.card:not(.is-hidden)').length > 0;
      g.classList.toggle('all-hidden', !anyVisible);
    });
  }

  /* Cuenta regresiva en vivo */
  function tickCountdowns(){
    document.querySelectorAll('.countdown[data-end]').forEach(function(el){
      el.textContent = countdownText(new Date(Number(el.getAttribute('data-end'))));
    });
    document.querySelectorAll('.countdown[data-start]').forEach(function(el){
      el.textContent = countdownStartText(new Date(Number(el.getAttribute('data-start'))));
    });
  }
  setInterval(tickCountdowns, 30000);

  /* Modal Event Listeners */
  document.addEventListener('click', function(e){
    var target = e.target.closest('[data-mon-key]');
    if(target){
      var key = target.getAttribute('data-mon-key');
      if(MON_REGISTRY[key]){
        if(window.playScanSound) window.playScanSound();
        openMonModal(MON_REGISTRY[key]);
      }
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      closeMonModal();
    }
    if(e.key === 'Enter' || e.key === ' '){
      var target = document.activeElement && document.activeElement.closest('[data-mon-key]');
      if(target && !document.getElementById('monModal').classList.contains('open')){
        e.preventDefault();
        var key = target.getAttribute('data-mon-key');
        if(MON_REGISTRY[key]){
          openMonModal(MON_REGISTRY[key]);
        }
      }
    }
  });

  var monModalEl = document.getElementById('monModal');
  if(monModalEl){
    var mcEl = document.getElementById('modalClose');
    if(mcEl){
      mcEl.addEventListener('click', closeMonModal);
      mcEl.addEventListener('pointerup', closeMonModal);
    }
    monModalEl.addEventListener('click', function(e){
      if(e.target === this) closeMonModal();
    });
    monModalEl.addEventListener('cancel', function(e){
      e.preventDefault();
      closeMonModal();
    });
    monModalEl.addEventListener('close', function(){
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    });
  }

  /* Scroll reveal */
  if(motionOK && 'IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, {threshold: 0.01, rootMargin: '60px'});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  // Garantizar visibilidad en bfcache o al volver a la pestaña/página
  window.addEventListener('pageshow', function(){
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  });
})();

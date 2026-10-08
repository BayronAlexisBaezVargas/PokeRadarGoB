(function(){
  "use strict";

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

  let ATACANTES_DATA = [
  {
    "type": "bug",
    "top": [
      {
        "rank": 1,
        "name": "Mega Beedrill",
        "fullName": "Mega-Beedrill",
        "dex": 15,
        "img": 10090,
        "tag": "Mega",
        "types": [
          "bug",
          "poison"
        ],
        "dps": 39,
        "atk": 303,
        "def": 148,
        "sta": 163
      },
      {
        "rank": 2,
        "name": "Mega Heracross",
        "fullName": "Mega-Heracross",
        "dex": 214,
        "img": 10047,
        "tag": "Mega",
        "types": [
          "bug",
          "fighting"
        ],
        "dps": 33.6,
        "atk": 334,
        "def": 223,
        "sta": 190
      },
      {
        "rank": 3,
        "name": "Mega Pinsir",
        "fullName": "Mega-Pinsir",
        "dex": 127,
        "img": 10040,
        "tag": "Mega",
        "types": [
          "bug",
          "flying"
        ],
        "dps": 29.7,
        "atk": 305,
        "def": 231,
        "sta": 163
      }
    ]
  },
  {
    "type": "dark",
    "top": [
      {
        "rank": 1,
        "name": "Mega Houndoom",
        "fullName": "Mega-Houndoom",
        "dex": 229,
        "img": 10048,
        "tag": "Mega",
        "types": [
          "dark",
          "fire"
        ],
        "dps": 37.9,
        "atk": 289,
        "def": 194,
        "sta": 181
      },
      {
        "rank": 2,
        "name": "Darkrai",
        "fullName": "Darkrai oscuro",
        "dex": 491,
        "img": 491,
        "tag": "Oscuro",
        "types": [
          "dark"
        ],
        "dps": 34.2,
        "atk": 285,
        "def": 198,
        "sta": 172
      },
      {
        "rank": 3,
        "name": "Mega Tyranitar",
        "fullName": "Mega-Tyranitar",
        "dex": 248,
        "img": 10049,
        "tag": "Mega",
        "types": [
          "rock",
          "dark"
        ],
        "dps": 31.9,
        "atk": 309,
        "def": 276,
        "sta": 225
      }
    ]
  },
  {
    "type": "dragon",
    "top": [
      {
        "rank": 1,
        "name": "Mega Rayquaza",
        "fullName": "Mega-Rayquaza",
        "dex": 384,
        "img": 10079,
        "tag": "Mega",
        "types": [
          "dragon",
          "flying"
        ],
        "dps": 39.7,
        "atk": 377,
        "def": 210,
        "sta": 227
      },
      {
        "rank": 2,
        "name": "Eternatus",
        "fullName": "Eternatus",
        "dex": 890,
        "img": 890,
        "tag": "Especial",
        "types": [
          "poison",
          "dragon"
        ],
        "dps": 39.5,
        "atk": 278,
        "def": 192,
        "sta": 268
      },
      {
        "rank": 3,
        "name": "Mega Dragonite",
        "fullName": "Mega-Dragonite",
        "dex": 149,
        "img": 10281,
        "tag": "Mega",
        "types": [
          "dragon",
          "flying"
        ],
        "dps": 37.4,
        "atk": 299,
        "def": 255,
        "sta": 209
      }
    ]
  },
  {
    "type": "electric",
    "top": [
      {
        "rank": 1,
        "name": "Mega Raichu Y",
        "fullName": "Mega-Raichu Y",
        "dex": 26,
        "img": 10305,
        "tag": "Mega",
        "types": [
          "electric"
        ],
        "dps": 39.1,
        "atk": 339,
        "def": 157,
        "sta": 155
      },
      {
        "rank": 2,
        "name": "Mega Raichu X",
        "fullName": "Mega-Raichu X",
        "dex": 26,
        "img": 10304,
        "tag": "Mega",
        "types": [
          "electric"
        ],
        "dps": 34.9,
        "atk": 277,
        "def": 203,
        "sta": 155
      },
      {
        "rank": 3,
        "name": "Thundurus (Forma Tótem)",
        "fullName": "Thundurus oscuro (Forma Tótem)",
        "dex": 642,
        "img": 10020,
        "tag": "Oscuro",
        "types": [
          "electric",
          "flying"
        ],
        "dps": 34,
        "atk": 295,
        "def": 161,
        "sta": 188
      }
    ]
  },
  {
    "type": "fairy",
    "top": [
      {
        "rank": 1,
        "name": "Mega Gardevoir",
        "fullName": "Mega-Gardevoir",
        "dex": 282,
        "img": 10051,
        "tag": "Mega",
        "types": [
          "psychic",
          "fairy"
        ],
        "dps": 32.3,
        "atk": 326,
        "def": 229,
        "sta": 169
      },
      {
        "rank": 2,
        "name": "Zacian Espada Suprema",
        "fullName": "Zacian Espada Suprema",
        "dex": 888,
        "img": 10188,
        "tag": "Especial",
        "types": [
          "fairy",
          "steel"
        ],
        "dps": 28.7,
        "atk": 332,
        "def": 240,
        "sta": 192
      },
      {
        "rank": 3,
        "name": "Gardevoir",
        "fullName": "Gardevoir oscuro",
        "dex": 282,
        "img": 282,
        "tag": "Oscuro",
        "types": [
          "psychic",
          "fairy"
        ],
        "dps": 28.2,
        "atk": 237,
        "def": 195,
        "sta": 169
      }
    ]
  },
  {
    "type": "fighting",
    "top": [
      {
        "rank": 1,
        "name": "Mega Mewtwo X",
        "fullName": "Mega-Mewtwo X",
        "dex": 150,
        "img": 10043,
        "tag": "Mega",
        "types": [
          "psychic",
          "fighting"
        ],
        "dps": 46.1,
        "atk": 399,
        "def": 215,
        "sta": 228
      },
      {
        "rank": 2,
        "name": "Mega Lucario",
        "fullName": "Mega-Lucario",
        "dex": 448,
        "img": 10059,
        "tag": "Mega",
        "types": [
          "fighting",
          "steel"
        ],
        "dps": 40.7,
        "atk": 310,
        "def": 175,
        "sta": 172
      },
      {
        "rank": 3,
        "name": "Mega Blaziken",
        "fullName": "Mega-Blaziken",
        "dex": 257,
        "img": 10050,
        "tag": "Mega",
        "types": [
          "fire",
          "fighting"
        ],
        "dps": 39.4,
        "atk": 329,
        "def": 168,
        "sta": 190
      }
    ]
  },
  {
    "type": "fire",
    "top": [
      {
        "rank": 1,
        "name": "Mega Delphox",
        "fullName": "Mega-Delphox",
        "dex": 655,
        "img": 10293,
        "tag": "Mega",
        "types": [
          "fire",
          "psychic"
        ],
        "dps": 39.8,
        "atk": 331,
        "def": 235,
        "sta": 181
      },
      {
        "rank": 2,
        "name": "Mega Blaziken",
        "fullName": "Mega-Blaziken",
        "dex": 257,
        "img": 10050,
        "tag": "Mega",
        "types": [
          "fire",
          "fighting"
        ],
        "dps": 35.6,
        "atk": 329,
        "def": 168,
        "sta": 190
      },
      {
        "rank": 3,
        "name": "Mega Charizard Y",
        "fullName": "Mega-Charizard Y",
        "dex": 6,
        "img": 10035,
        "tag": "Mega",
        "types": [
          "fire",
          "flying"
        ],
        "dps": 34.4,
        "atk": 319,
        "def": 212,
        "sta": 186
      }
    ]
  },
  {
    "type": "flying",
    "top": [
      {
        "rank": 1,
        "name": "Mega Rayquaza",
        "fullName": "Mega-Rayquaza",
        "dex": 384,
        "img": 10079,
        "tag": "Mega",
        "types": [
          "dragon",
          "flying"
        ],
        "dps": 48.2,
        "atk": 377,
        "def": 210,
        "sta": 227
      },
      {
        "rank": 2,
        "name": "Mega Staraptor",
        "fullName": "Mega-Staraptor",
        "dex": 398,
        "img": 10308,
        "tag": "Mega",
        "types": [
          "fighting",
          "flying"
        ],
        "dps": 39,
        "atk": 278,
        "def": 207,
        "sta": 198
      },
      {
        "rank": 3,
        "name": "Mega Skarmory",
        "fullName": "Mega-Skarmory",
        "dex": 227,
        "img": 10284,
        "tag": "Mega",
        "types": [
          "steel",
          "flying"
        ],
        "dps": 36.4,
        "atk": 273,
        "def": 228,
        "sta": 163
      }
    ]
  },
  {
    "type": "ghost",
    "top": [
      {
        "rank": 1,
        "name": "Necrozma Alas del Alba",
        "fullName": "Necrozma Alas del Alba",
        "dex": 800,
        "img": 10156,
        "tag": "Fusión",
        "types": [
          "psychic",
          "ghost"
        ],
        "dps": 35.5,
        "atk": 277,
        "def": 220,
        "sta": 200
      },
      {
        "rank": 2,
        "name": "Mega Gengar",
        "fullName": "Mega-Gengar",
        "dex": 94,
        "img": 10038,
        "tag": "Mega",
        "types": [
          "ghost",
          "poison"
        ],
        "dps": 36,
        "atk": 349,
        "def": 199,
        "sta": 155
      },
      {
        "rank": 3,
        "name": "Mega Mewtwo Y",
        "fullName": "Mega-Mewtwo Y",
        "dex": 150,
        "img": 10044,
        "tag": "Mega",
        "types": [
          "psychic"
        ],
        "dps": 33,
        "atk": 413,
        "def": 223,
        "sta": 228
      }
    ]
  },
  {
    "type": "grass",
    "top": [
      {
        "rank": 1,
        "name": "Mega Chesnaught",
        "fullName": "Mega-Chesnaught",
        "dex": 652,
        "img": 10292,
        "tag": "Mega",
        "types": [
          "grass",
          "fighting"
        ],
        "dps": 32.2,
        "atk": 242,
        "def": 282,
        "sta": 204
      },
      {
        "rank": 2,
        "name": "Mega Sceptile",
        "fullName": "Mega-Sceptile",
        "dex": 254,
        "img": 10065,
        "tag": "Mega",
        "types": [
          "grass",
          "dragon"
        ],
        "dps": 33.1,
        "atk": 320,
        "def": 186,
        "sta": 172
      },
      {
        "rank": 3,
        "name": "Kartana",
        "fullName": "Kartana",
        "dex": 798,
        "img": 798,
        "tag": "Ultraente",
        "types": [
          "grass",
          "steel"
        ],
        "dps": 29.2,
        "atk": 323,
        "def": 182,
        "sta": 139
      }
    ]
  },
  {
    "type": "ground",
    "top": [
      {
        "rank": 1,
        "name": "Groudon Primigenio",
        "fullName": "Groudon Primigenio",
        "dex": 383,
        "img": 10078,
        "tag": "Primigenio",
        "types": [
          "ground",
          "fire"
        ],
        "dps": 34.6,
        "atk": 353,
        "def": 268,
        "sta": 218
      },
      {
        "rank": 2,
        "name": "Mega Garchomp",
        "fullName": "Mega-Garchomp",
        "dex": 445,
        "img": 10058,
        "tag": "Mega",
        "types": [
          "dragon",
          "ground"
        ],
        "dps": 31.9,
        "atk": 339,
        "def": 222,
        "sta": 239
      },
      {
        "rank": 3,
        "name": "Groudon",
        "fullName": "Groudon oscuro",
        "dex": 383,
        "img": 383,
        "tag": "Oscuro",
        "types": [
          "ground"
        ],
        "dps": 31.5,
        "atk": 270,
        "def": 228,
        "sta": 205
      }
    ]
  },
  {
    "type": "ice",
    "top": [
      {
        "rank": 1,
        "name": "Kyurem Blanco",
        "fullName": "Kyurem Blanco",
        "dex": 646,
        "img": 10023,
        "tag": "Fusión",
        "types": [
          "dragon",
          "ice"
        ],
        "dps": 38.3,
        "atk": 310,
        "def": 183,
        "sta": 245
      },
      {
        "rank": 2,
        "name": "Kyurem Negro",
        "fullName": "Kyurem Negro",
        "dex": 646,
        "img": 10022,
        "tag": "Fusión",
        "types": [
          "dragon",
          "ice"
        ],
        "dps": 35.5,
        "atk": 310,
        "def": 183,
        "sta": 245
      },
      {
        "rank": 3,
        "name": "Mega Mewtwo Y",
        "fullName": "Mega-Mewtwo Y",
        "dex": 150,
        "img": 10044,
        "tag": "Mega",
        "types": [
          "psychic"
        ],
        "dps": 33.3,
        "atk": 413,
        "def": 223,
        "sta": 228
      }
    ]
  },
  {
    "type": "normal",
    "top": [
      {
        "rank": 1,
        "name": "Regigigas",
        "fullName": "Regigigas oscuro",
        "dex": 486,
        "img": 486,
        "tag": "Oscuro",
        "types": [
          "normal"
        ],
        "dps": 23.4,
        "atk": 287,
        "def": 210,
        "sta": 221
      },
      {
        "rank": 2,
        "name": "Mega Staraptor",
        "fullName": "Mega-Staraptor",
        "dex": 398,
        "img": 10308,
        "tag": "Mega",
        "types": [
          "fighting",
          "flying"
        ],
        "dps": 22.8,
        "atk": 278,
        "def": 207,
        "sta": 198
      },
      {
        "rank": 3,
        "name": "Mega Delphox",
        "fullName": "Mega-Delphox",
        "dex": 655,
        "img": 10293,
        "tag": "Mega",
        "types": [
          "fire",
          "psychic"
        ],
        "dps": 21.5,
        "atk": 331,
        "def": 235,
        "sta": 181
      }
    ]
  },
  {
    "type": "poison",
    "top": [
      {
        "rank": 1,
        "name": "Mega Victreebel",
        "fullName": "Mega-Victreebel",
        "dex": 71,
        "img": 10279,
        "tag": "Mega",
        "types": [
          "grass",
          "poison"
        ],
        "dps": 33,
        "atk": 265,
        "def": 181,
        "sta": 190
      },
      {
        "rank": 2,
        "name": "Mega Gengar",
        "fullName": "Mega-Gengar",
        "dex": 94,
        "img": 10038,
        "tag": "Mega",
        "types": [
          "ghost",
          "poison"
        ],
        "dps": 31.1,
        "atk": 349,
        "def": 199,
        "sta": 155
      },
      {
        "rank": 3,
        "name": "Mega Beedrill",
        "fullName": "Mega-Beedrill",
        "dex": 15,
        "img": 10090,
        "tag": "Mega",
        "types": [
          "bug",
          "poison"
        ],
        "dps": 31.1,
        "atk": 303,
        "def": 148,
        "sta": 163
      }
    ]
  },
  {
    "type": "psychic",
    "top": [
      {
        "rank": 1,
        "name": "Mega Mewtwo Y",
        "fullName": "Mega-Mewtwo Y",
        "dex": 150,
        "img": 10044,
        "tag": "Mega",
        "types": [
          "psychic"
        ],
        "dps": 51.9,
        "atk": 413,
        "def": 223,
        "sta": 228
      },
      {
        "rank": 2,
        "name": "Mega Mewtwo X",
        "fullName": "Mega-Mewtwo X",
        "dex": 150,
        "img": 10043,
        "tag": "Mega",
        "types": [
          "psychic",
          "fighting"
        ],
        "dps": 43.3,
        "atk": 399,
        "def": 215,
        "sta": 228
      },
      {
        "rank": 3,
        "name": "Mewtwo",
        "fullName": "Mewtwo oscuro",
        "dex": 150,
        "img": 150,
        "tag": "Oscuro",
        "types": [
          "psychic"
        ],
        "dps": 38.9,
        "atk": 300,
        "def": 182,
        "sta": 214
      }
    ]
  },
  {
    "type": "rock",
    "top": [
      {
        "rank": 1,
        "name": "Mega Diancie",
        "fullName": "Mega-Diancie",
        "dex": 719,
        "img": 10075,
        "tag": "Mega",
        "types": [
          "rock",
          "fairy"
        ],
        "dps": 34.4,
        "atk": 342,
        "def": 235,
        "sta": 137
      },
      {
        "rank": 2,
        "name": "Rhyperior",
        "fullName": "Rhyperior oscuro",
        "dex": 464,
        "img": 464,
        "tag": "Oscuro",
        "types": [
          "ground",
          "rock"
        ],
        "dps": 33.3,
        "atk": 241,
        "def": 190,
        "sta": 251
      },
      {
        "rank": 3,
        "name": "Rampardos",
        "fullName": "Rampardos oscuro",
        "dex": 409,
        "img": 409,
        "tag": "Oscuro",
        "types": [
          "rock"
        ],
        "dps": 34.4,
        "atk": 295,
        "def": 109,
        "sta": 219
      }
    ]
  },
  {
    "type": "steel",
    "top": [
      {
        "rank": 1,
        "name": "Zacian Espada Suprema",
        "fullName": "Zacian Espada Suprema",
        "dex": 888,
        "img": 10188,
        "tag": "Especial",
        "types": [
          "fairy",
          "steel"
        ],
        "dps": 38,
        "atk": 332,
        "def": 240,
        "sta": 192
      },
      {
        "rank": 2,
        "name": "Zamazenta Escudo Supremo",
        "fullName": "Zamazenta Escudo Supremo",
        "dex": 889,
        "img": 10189,
        "tag": "Especial",
        "types": [
          "fighting",
          "steel"
        ],
        "dps": 36.6,
        "atk": 250,
        "def": 292,
        "sta": 192
      },
      {
        "rank": 3,
        "name": "Necrozma Melena Crepuscular",
        "fullName": "Necrozma Melena Crepuscular",
        "dex": 800,
        "img": 10155,
        "tag": "Fusión",
        "types": [
          "psychic",
          "steel"
        ],
        "dps": 36.5,
        "atk": 277,
        "def": 220,
        "sta": 200
      }
    ]
  },
  {
    "type": "water",
    "top": [
      {
        "rank": 1,
        "name": "Mega Greninja",
        "fullName": "Mega-Greninja",
        "dex": 658,
        "img": 10294,
        "tag": "Mega",
        "types": [
          "water",
          "dark"
        ],
        "dps": 38.2,
        "atk": 299,
        "def": 180,
        "sta": 176
      },
      {
        "rank": 2,
        "name": "Kyogre Primigenio",
        "fullName": "Kyogre Primigenio",
        "dex": 382,
        "img": 10077,
        "tag": "Primigenio",
        "types": [
          "water"
        ],
        "dps": 35,
        "atk": 353,
        "def": 268,
        "sta": 218
      },
      {
        "rank": 3,
        "name": "Mega Starmie",
        "fullName": "Mega-Starmie",
        "dex": 121,
        "img": 10280,
        "tag": "Mega",
        "types": [
          "water",
          "psychic"
        ],
        "dps": 35.4,
        "atk": 276,
        "def": 229,
        "sta": 155
      }
    ]
  }
];

  function rgba(hex, a){
    var h = hex.replace('#','');
    var n = Number.parseInt(h,16);
    return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')';
  }

  function getMonImage(dex, tag){
    if(tag === 'Mega' || tag === 'Primigenio' || tag === 'Fusión') {
      return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/' + dex + '.png';
    }
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + dex + '.png';
  }

  
  function renderAtacantes() {
    var grid = document.getElementById('atacantesGrid');
    if(!grid) return;
    grid.innerHTML = '';

    ATACANTES_DATA.forEach(function(typeData) {
      var color = TYPE_COLORS[typeData.type];
      
      var card = document.createElement('div');
      card.className = 'type-card reveal';
      card.style.borderColor = rgba(color, 0.4);
      card.style.background = 'linear-gradient(0deg, ' + rgba(color, 0.08) + ', ' + rgba(color, 0.08) + '), var(--panel-2)';
      
      var header = document.createElement('div');
      header.className = 'type-header';
      header.style.background = rgba(color, 0.15);
      header.style.color = color;
      header.innerHTML = '<h3>' + TYPE_LABELS[typeData.type] + '</h3>';
      
      var monList = document.createElement('div');
      monList.className = 'type-mons';
      
      typeData.top.forEach(function(mon, index) {
        var row = document.createElement('div');
        row.className = 'mon-row interactive-row';
        row.style.cursor = 'pointer';
        
        // Store full data in data- attributes
        row.dataset.name = mon.name;
        row.dataset.dex = mon.dex;
        row.dataset.img = mon.img || mon.dex;
        row.dataset.types = mon.types.join(',');
        row.dataset.tag = mon.tag;
        row.dataset.atk = mon.atk || '--';
        row.dataset.def = mon.def || '--';
        row.dataset.sta = mon.sta || '--';
        row.dataset.dps = mon.dps || '--';

        row.setAttribute('tabindex', '0');
        row.setAttribute('role', 'button');
        
        var imgClass = 'mon-img-sm';
        var tagStyle = '';
        if(mon.tag === 'Mega' || mon.tag === 'Primigenio' || mon.tag === 'Fusión'){
           tagStyle = 'background:rgba(255,197,61,0.2);color:#ffc53d;border:1px solid rgba(255,197,61,0.4);';
        } else if(mon.tag === 'Oscuro'){
           tagStyle = 'background:rgba(165,95,209,0.2);color:#a55fd1;border:1px solid rgba(165,95,209,0.4);';
        } else if(mon.tag === 'Ultraente' || mon.tag === 'Especial'){
           tagStyle = 'background:rgba(110,90,230,0.2);color:#6E5AE6;border:1px solid rgba(110,90,230,0.4);';
        } else {
           tagStyle = 'background:rgba(255,255,255,0.1);color:#ccc;border:1px solid rgba(255,255,255,0.2);';
        }

        row.innerHTML = `
          <div class="mon-rank">#${index+1}</div>
          <div class="mon-avatar-sm">
            <img class="${imgClass}" src="${getMonImage(mon.img || mon.dex, mon.tag)}" loading="lazy" decoding="async" alt="${mon.name}">
          </div>
          <div class="mon-info-sm">
            <div class="mon-name-sm">${mon.name}</div>
            <div class="mon-tag-sm" style="${tagStyle}">${mon.tag}</div>
          </div>
        `;
        monList.appendChild(row);
      });
      
      card.appendChild(header);
      card.appendChild(monList);
      grid.appendChild(card);
    });
  }

  /* ============ Modal ============ */
  function openAtacanteModal(el) {
    var name = el.dataset.name;
    var dex = el.dataset.dex;
    var img = el.dataset.img;
    var typesStr = el.dataset.types;
    var tag = el.dataset.tag;
    var atk = el.dataset.atk;
    var def = el.dataset.def;
    var sta = el.dataset.sta;
    var dps = el.dataset.dps;
    var types = typesStr ? typesStr.split(',') : ['normal'];
    
    var modal = document.getElementById('monModal');
    var mName = document.getElementById('modalName');
    var mDex = document.getElementById('modalDex');
    var mShiny = document.getElementById('modalShiny');
    var mImg = document.getElementById('modalImg');
    var mTypes = document.getElementById('modalTypes');
    var mTag = document.getElementById('modalTag');
    
    if(!modal) return;
    
    mName.textContent = name;
    mDex.textContent = 'N.° ' + dex;
    mImg.src = getMonImage(img, tag);
    
    if(tag === 'Mega' || tag === 'Primigenio' || tag === 'Fusión') {
       mShiny.style.display = 'inline-flex';
       mShiny.style.color = '#ffc53d';
       mShiny.style.borderColor = 'rgba(255,197,61,0.3)';
       mShiny.style.background = 'rgba(255,197,61,0.12)';
       mShiny.textContent = tag;
    } else if(tag === 'Oscuro') {
       mShiny.style.display = 'inline-flex';
       mShiny.style.color = '#a55fd1';
       mShiny.style.borderColor = 'rgba(165,95,209,0.3)';
       mShiny.style.background = 'rgba(165,95,209,0.12)';
       mShiny.textContent = tag;
    } else if (tag === 'Ultraente' || tag === 'Especial') {
       mShiny.style.display = 'inline-flex';
       mShiny.style.color = '#6E5AE6';
       mShiny.style.borderColor = 'rgba(110,90,230,0.3)';
       mShiny.style.background = 'rgba(110,90,230,0.12)';
       mShiny.textContent = tag;
    } else {
       mShiny.style.display = 'none';
    }
    
    mTag.textContent = 'DPS: ' + dps;
    
    mTypes.innerHTML = '';
    
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
    
    // Use the fetched stats from GO Hub instead of fetching PokéAPI
    document.getElementById('statAtk').textContent = atk;
    document.getElementById('statDef').textContent = def;
    document.getElementById('statHp').textContent = sta;

    modal.showModal();
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }


  document.body.addEventListener('click', function(e){
    var t = e.target.closest('.interactive-row');
    if(t) openAtacanteModal(t);
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
  function startInit() {
    renderAtacantes();
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, {threshold: 0.01});

    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

    function hideLoader() {
      var loader = document.getElementById('loader');
      if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        setTimeout(function(){ loader.remove(); }, 400);
      }
    }

    var imgs = Array.from(document.querySelectorAll('.atacantes-grid img')).slice(0, 12);
    var loaded = 0;
    function checkDone() {
      loaded++;
      if(loaded >= imgs.length) hideLoader();
    }
    if (imgs.length === 0) hideLoader();
    else {
      imgs.forEach(function(img) {
        if(img.complete) checkDone();
        else {
          img.addEventListener('load', checkDone);
          img.addEventListener('error', checkDone);
        }
      });
      setTimeout(hideLoader, 3500); // fallback
    }
  }

  fetch('scratch_atacantes.json')
    .then(function(res) { 
      if (!res.ok) throw new Error('Network error'); 
      return res.json(); 
    })
    .then(function(data) {
      if (Array.isArray(data) && data.length > 0) {
        ATACANTES_DATA = data;
      }
      setTimeout(startInit, 50);
    })
    .catch(function(err) {
      console.warn('Could not fetch external atacantes data, using embedded fallback.', err);
      setTimeout(startInit, 50);
    });



})();

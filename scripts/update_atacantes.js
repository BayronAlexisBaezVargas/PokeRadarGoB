const fs = require('fs');
const path = require('path');

const types = [
  'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting',
  'fire', 'flying', 'ghost', 'grass', 'ground', 'ice',
  'normal', 'poison', 'psychic', 'rock', 'steel', 'water'
];

// Mapeo exhaustivo de IDs de sprites de PokéAPI (Home/Official)
const SPECIAL_SPRITES = {
  'Mega-Victreebel': 10279,
  'Mega-Starmie': 10280,
  'Mega-Dragonite': 10281,
  'Mega-Greninja': 10294,
  'Mega-Staraptor': 10308,
  'Mega-Delphox': 10293,
  'Mega-Skarmory': 10284,
  'Mega-Chesnaught': 10292,
  'Mega-Raichu X': 10304,
  'Mega-Raichu Y': 10305,

  // Megas Kanto / Johto / Hoenn / Sinnoh / Kalos / Alola / Galar
  'Mega-Venusaur': 10033,
  'Mega-Charizard X': 10034,
  'Mega-Charizard Y': 10035,
  'Mega-Blastoise': 10036,
  'Mega-Alakazam': 10037,
  'Mega-Gengar': 10038,
  'Mega-Kangaskhan': 10039,
  'Mega-Pinsir': 10040,
  'Mega-Gyarados': 10041,
  'Mega-Aerodactyl': 10042,
  'Mega-Mewtwo X': 10043,
  'Mega-Mewtwo Y': 10044,
  'Mega-Ampharos': 10045,
  'Mega-Scizor': 10046,
  'Mega-Heracross': 10047,
  'Mega-Houndoom': 10048,
  'Mega-Tyranitar': 10049,
  'Mega-Blaziken': 10050,
  'Mega-Gardevoir': 10051,
  'Mega-Mawile': 10052,
  'Mega-Aggron': 10053,
  'Mega-Medicham': 10054,
  'Mega-Manectric': 10055,
  'Mega-Banette': 10056,
  'Mega-Absol': 10057,
  'Mega-Garchomp': 10058,
  'Mega-Lucario': 10059,
  'Mega-Abomasnow': 10060,
  'Mega-Beedrill': 10090,
  'Mega-Pidgeot': 10073,
  'Mega-Slowbro': 10071,
  'Mega-Steelix': 10072,
  'Mega-Sceptile': 10065,
  'Mega-Swampert': 10064,
  'Mega-Sableye': 10066,
  'Mega-Sharpedo': 10070,
  'Mega-Camerupt': 10087,
  'Mega-Altaria': 10067,
  'Mega-Glalie': 10074,
  'Mega-Salamence': 10089,
  'Mega-Metagross': 10076,
  'Mega-Latias': 10062,
  'Mega-Latios': 10063,
  'Kyogre Primigenio': 10077,
  'Groudon Primigenio': 10078,
  'Mega-Rayquaza': 10079,
  'Mega-Lopunny': 10088,
  'Mega-Gallade': 10068,
  'Mega-Audino': 10069,
  'Mega-Diancie': 10075,
  // Formas Fusión / Especiales
  'Necrozma Alas del Alba': 10156,
  'Necrozma Melena Crepuscular': 10155,
  'Zacian Espada Suprema': 10188,
  'Zamazenta Escudo Supremo': 10189,
  'Kyurem Blanco': 10023,
  'Kyurem Negro': 10022,
  'Thundurus oscuro (Forma Tótem)': 10020,
  'Thundurus (Forma Tótem)': 10020
};

function determineTag(rawName, rawForm) {
  const n = (rawName || '').toLowerCase();
  const f = (rawForm || '').toLowerCase();
  if (n.includes('primigenio') || f.includes('primal')) return 'Primigenio';
  if (n.includes('mega') || f.includes('mega')) return 'Mega';
  if (n.includes('oscuro') || f.includes('shadow')) return 'Oscuro';
  if (n.includes('necrozma') || n.includes('kyurem') || f.includes('fusion') || f.includes('fusión')) return 'Fusión';
  if (n.includes('zacian') || n.includes('zamazenta') || n.includes('eternatus')) return 'Especial';
  if (n.includes('kartana') || n.includes('xurkitree') || n.includes('pheromosa') || n.includes('nihilego')) return 'Ultraente';
  return 'Normal';
}

function cleanMonName(name) {
  return name
    .replace('Mega-', 'Mega ')
    .replace(' oscuro', '')
    .trim();
}

async function scrapeAll() {
  console.log('⚡ Conectando a Pokémon GO Hub Database...');
  const results = [];

  for (const t of types) {
    try {
      const res = await fetch(`https://db.pokemongohub.net/es/pokemon-list/best-per-type/${t}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PokeRadar/1.5" }
      });
      const html = await res.text();
      const regex = /{\\"order\\":(\d+),\\"attacker\\":({.*?}),\\"qm\\":{.*?},\\"cm\\":{.*?},\\"dps\\":([0-9.]+)/g;
      
      let match;
      const topMons = [];
      while ((match = regex.exec(html)) !== null) {
        
        // Remove strict order check, use array length instead
        if (topMons.length >= 3) continue;

        
        const raw = JSON.parse(match[2].replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
        const dps = parseFloat(match[3]).toFixed(1);
        
        const cleanName = cleanMonName(raw.name);
        
const tag = determineTag(raw.name, raw.form);
        const typesList = [raw.type1];
        if (raw.type2) typesList.push(raw.type2);
        
        const spriteId = SPECIAL_SPRITES[raw.name] || raw.id;

        topMons.push({
          rank: topMons.length + 1,
          name: cleanMonName(raw.name),
          fullName: raw.name,
          dex: raw.id,
          img: spriteId,
          tag: tag,
          types: typesList,
          dps: parseFloat(dps),
          atk: raw.atk,
          def: raw.def,
          sta: raw.sta
        });
      }

      topMons.sort((a,b) => a.rank - b.rank);
      results.push({
        type: t,
        top: topMons
      });
      console.log(`✓ [${t.toUpperCase()}]:`, topMons.map(m => `#${m.rank} ${m.name} (${m.tag})`).join(' | '));
    } catch(err) {
      console.error(`✗ Error en tipo ${t}:`, err.message);
    }
  }

  const outPath = path.join(__dirname, '../assets/scratch_atacantes.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n🎉 Base de datos de atacantes guardada con éxito en: ${outPath}`);
}

scrapeAll();

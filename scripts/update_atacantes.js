'use strict';

const fs = require('node:fs');
const path = require('node:path');

const TYPES = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'];
const CATEGORIES = ['normal', 'mega', 'shadow'];
const PER_CATEGORY = 10;
const SOURCE = 'https://db.pokemongohub.net';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function decodeHtml(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
}

// Parse the site's serialized data without evaluating scripts. Next/React can
// reference an earlier move object instead of repeating it in each ranking row.
function flightRecords(html) {
  let stream = '';
  for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    const push = script[1].trim().match(/^self\.__next_f\.push\(([\s\S]*)\)$/);
    if (!push) continue;
    const chunk = JSON.parse(push[1]);
    if (chunk[0] === 1 && typeof chunk[1] === 'string') stream += chunk[1];
  }
  const records = new Map();
  for (const line of stream.split('\n')) {
    const record = line.match(/^([a-f\d]+):([\[{][\s\S]*)$/i);
    if (!record) continue;
    try { records.set(record[1], JSON.parse(record[2])); } catch (err) { /* Non-JSON flight records are not ranking data. */ }
  }
  return records;
}

function resolve(value, records, seen = new Set()) {
  if (typeof value !== 'string' || !/^\$[a-f\d]+(?::|$)/i.test(value)) return value;
  assert(!seen.has(value) && seen.size < 30, 'Referencia de datos circular');
  const nextSeen = new Set(seen).add(value);
  const [id, ...keys] = value.slice(1).split(':');
  assert(records.has(id), 'Referencia de datos no encontrada: ' + id);
  let current = records.get(id);
  for (const key of keys) {
    current = resolve(current, records, nextSeen);
    if (key === 'props' && Array.isArray(current) && current[0] === '$') current = current[3];
    else {
      assert(current != null && Object.hasOwn(current, key) && !['__proto__', 'constructor', 'prototype'].includes(key), 'Ruta de referencia inválida');
      current = current[key];
    }
  }
  return resolve(current, records, nextSeen);
}

function checkbox(html, label) {
  for (const match of html.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/gi)) {
    if (!decodeHtml(match[1].replace(/<[^>]+>/g, '')).includes(label)) continue;
    const input = match[1].match(/<input\b[^>]*\btype="checkbox"[^>]*>/i);
    assert(input, 'Control no encontrado: ' + label);
    return /\bchecked(?:\s|=|\/>)/i.test(input[0]);
  }
  throw new Error('Control de disponibilidad no encontrado: ' + label);
}

function methodology(html) {
  // Fail closed if the default source starts including unavailable Pokémon.
  assert(!checkbox(html, 'Incluir Pokémon no disponibles'), 'La fuente incluye Pokémon no disponibles');
  assert(checkbox(html, 'Megaevoluciones') && checkbox(html, 'Formas primigenias') && checkbox(html, 'Pokémon oscuros'), 'La fuente no incluye todas las categorías');
  const plain = decodeHtml(html.slice(0, html.indexOf('<table')).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
  const level = plain.match(/\bNivel\s+(\d+)\b/);
  const friendship = plain.match(/Amistad\s+([^↓]+)↓/);
  const mega = plain.match(/Meganivel\s+([^↓]+)↓/);
  const rejoin = html.match(/<input\b[^>]*\bid="[^"]*-rejoin"[^>]*>/i);
  const seconds = rejoin && rejoin[0].match(/\bvalue="(\d+)"/);
  assert(level && friendship && mega && seconds, 'Ajustes de simulación incompletos');
  const friendMultiplier = friendship[1].match(/\(([\d.,]+)×\)/);
  const megaBoost = mega[1].match(/\(([\d.,]+)×,\s*\+(\d+) niveles\)/);
  assert(friendMultiplier && megaBoost, 'No se pudieron interpretar los multiplicadores');
  const raidPool = html.match(/<input\b[^>]*\bvalue="raid-pool"[^>]*>/i);
  assert(raidPool && /\bchecked(?:\s|=|\/>)/i.test(raidPool[0]), 'El rival de la simulación ha cambiado');
  assert(/data-column-id="score"[^>]*aria-sort="descending"/.test(html), 'La fuente no está ordenada por eDPS');
  return {
    opponent: 'raid-pool', pokemonLevel: Number(level[1]), friendshipMultiplier: Number(friendMultiplier[1].replace(',', '.')),
    rejoinSeconds: Number(seconds[1]), megaLevelLabel: mega[1].trim(),
    megaPlusMultiplier: Number(megaBoost[1].replace(',', '.')), megaExtraLevels: Number(megaBoost[2]),
    legacyMoves: checkbox(html, 'Permitir ataques de legado'), mixedMoves: checkbox(html, 'Permitir conjuntos de ataques mixtos'),
    otherTypes: checkbox(html, 'Permitir atacantes de otros tipos'), unavailableExcluded: true
  };
}

// Read exact artwork URLs from the rendered rows rather than guessing new
// PokéAPI IDs. The table initially renders 50 rows; unrendered art stays absent.
function sourceImages(html) {
  const images = new Map();
  for (const row of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const order = row[1].match(/data-column-id="order"[^>]*>\s*(\d+)\./);
    const img = [...row[1].matchAll(/<img\b[^>]*>/gi)].find(match => /PokemonImage_art/.test(match[0]));
    const src = img && img[0].match(/\bsrc="([^"]+)"/);
    if (!order || !src) continue;
    const url = new URL(decodeHtml(src[1]), SOURCE);
    const imagePath = url.pathname === '/_next/image' ? url.searchParams.get('url') : url.pathname;
    if (!imagePath || !imagePath.startsWith('/images/pokemon/')) continue;
    const image = new URL(imagePath, SOURCE);
    if (image.origin === SOURCE) images.set(Number(order[1]), image.href);
  }
  return images;
}

function categoryOf(raw) {
  const form = ((raw.form || '') + ' ' + raw.name).toLowerCase();
  if (/mega|primal|primigenio/.test(form)) return 'mega';
  if (/shadow|oscuro/.test(form)) return 'shadow';
  return 'normal';
}

function moveData(value, records) {
  const move = resolve(value, records);
  assert(move && Number.isInteger(move.id) && typeof move.name === 'string' && move.name.trim() && TYPES.includes(move.type), 'Movimiento incompleto');
  assert([0, 1, false, true].includes(move.isLegacy), 'Indicador de movimiento de legado inválido');
  return { id: move.id, name: move.name, type: move.type, legacy: Boolean(move.isLegacy) };
}

function parseRanking(html, type, updatedAt = new Date().toISOString()) {
  const methods = methodology(html);
  const records = flightRecords(html);
  let props;
  for (const record of records.values()) {
    if (Array.isArray(record) && record[3]?.allowedType === type && record[3]?.initialData) { props = record[3]; break; }
  }
  assert(props && props.locale === 'es', 'Datos de ranking no encontrados para ' + type);
  const initial = resolve(props.initialData, records);
  const rows = resolve(initial.attackers, records);
  assert(Array.isArray(rows) && rows.length >= 10, 'Ranking incompleto para ' + type);
  const images = sourceImages(html);
  const counts = { normal: 0, mega: 0, shadow: 0 };
  const identities = new Set();
  const all = [];
  let lastRank = 0;
  let lastScore = Infinity;
  for (const value of rows) {
    const row = resolve(value, records);
    const raw = resolve(row.attacker, records);
    assert(raw && Number.isInteger(raw.id) && raw.id > 0 && typeof raw.name === 'string' && TYPES.includes(raw.type1) && (!raw.type2 || TYPES.includes(raw.type2)), 'Pokémon incompleto en ' + type);
    assert(Number.isInteger(row.order) && row.order > lastRank && Number.isFinite(row.score) && row.score > 0 && row.score <= lastScore + 1e-9, 'Orden de origen inválido en ' + type);
    assert(Number.isFinite(row.dps) && row.dps > 0 && Number.isFinite(row.tdo) && row.tdo > 0, 'Métricas incompletas en ' + type);
    lastRank = row.order; lastScore = row.score;
    if (raw.isReleased === false || raw.isAvailable === false || row.isReleased === false) continue;
    const identity = String(raw.id) + '|' + (raw.form || '') + '|' + raw.name;
    assert(!identities.has(identity), 'Pokémon duplicado en ' + type);
    identities.add(identity);
    const category = categoryOf(raw);
    counts[category]++;
    const mon = {
      rank: row.order, sourceRank: row.order,
      name: raw.name.replace(/^Mega-/, 'Mega ').replace(/ oscuro(?=\s|$)/i, '').trim(),
      fullName: raw.name, dex: raw.id, img: raw.form ? null : raw.id, form: raw.form || null,
      tag: category === 'shadow' ? 'Oscuro' : category === 'mega' ? (/primal|primigenio/i.test((raw.form || '') + raw.name) ? 'Primigenio' : 'Mega') : 'Normal',
      category, types: [raw.type1, raw.type2].filter(Boolean),
      edps: row.score, score: row.score, dps: row.dps, tdo: row.tdo,
      fastMove: moveData(row.qm, records), chargedMove: moveData(row.cm, records)
    };
    if (images.has(row.order)) mon.image = images.get(row.order);
    all.push(mon);
  }
  const taken = { normal: 0, mega: 0, shadow: 0 };
  const top = all.filter(mon => ++taken[mon.category] <= PER_CATEGORY);
  const sourceBuild = html.match(/<time\b[^>]*datetime="([^"]+)"/i);
  const result = {
    type, sourceUrl: SOURCE + '/es/pokemon-list/best-per-type/' + type,
    updatedAt, rankingMetric: 'edps', methodology: methods,
    availableCounts: counts, perCategoryLimit: PER_CATEGORY, top
  };
  if (sourceBuild && !Number.isNaN(Date.parse(sourceBuild[1]))) result.sourceBuildAt = sourceBuild[1];
  validateGroup(result);
  return result;
}

function validateGroup(group) {
  assert(TYPES.includes(group.type) && group.rankingMetric === 'edps', 'Tipo o métrica inválidos');
  assert(!Number.isNaN(Date.parse(group.updatedAt)) && group.methodology.unavailableExcluded === true, 'Metadatos incompletos');
  assert(group.top.length >= 10, 'Faltan opciones en ' + group.type);
  for (const category of CATEGORIES) {
    const expected = Math.min(PER_CATEGORY, group.availableCounts[category]);
    assert(Number.isInteger(expected) && expected >= 0 && group.top.filter(mon => mon.category === category).length === expected, 'Categoría incompleta: ' + group.type + '/' + category);
  }
  assert(new Set(group.top.map(mon => mon.sourceRank)).size === group.top.length, 'Posiciones duplicadas');
}

function validateDataset(groups) {
  assert(Array.isArray(groups) && groups.length === TYPES.length && new Set(groups.map(group => group.type)).size === TYPES.length, 'Se requieren los 18 tipos completos');
  groups.forEach(validateGroup);
}

async function scrapeAll(options = {}) {
  const fetcher = options.fetcher || fetch;
  const output = options.output || path.join(__dirname, '../assets/scratch_atacantes.json');
  const delay = options.delay ?? 300;
  const log = options.log || console.log;
  const updatedAt = new Date().toISOString();
  const results = [];
  for (const type of TYPES) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetcher(SOURCE + '/es/pokemon-list/best-per-type/' + type, {
        signal: controller.signal, headers: { 'User-Agent': 'PokeRadarGoB/2.0.0 (ranking updater)' }
      });
      assert(response.ok, 'HTTP ' + response.status + ' al consultar ' + type);
      const group = parseRanking(await response.text(), type, updatedAt);
      results.push(group);
      log(type + ': ' + group.top.length + ' opciones; primero ' + group.top[0].fullName);
    } finally { clearTimeout(timer); }
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
  }
  validateDataset(results);
  // The previous snapshot survives any network, schema or partial-data failure.
  const temporary = output + '.' + process.pid + '.tmp';
  try {
    fs.writeFileSync(temporary, JSON.stringify(results, null, 2) + '\n');
    fs.renameSync(temporary, output);
  } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
  log('Ranking actualizado: 18 tipos completos, orden original por eDPS.');
  return results;
}

module.exports = { TYPES, PER_CATEGORY, parseRanking, validateDataset, resolve, scrapeAll };
if (require.main === module) {
  scrapeAll().catch(error => {
    console.error('No se reemplazó el ranking anterior: ' + error.message);
    process.exitCode = 1;
  });
}

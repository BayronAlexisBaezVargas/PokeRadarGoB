'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { TYPES, parseRanking, scrapeAll, validateDataset } = require('../scripts/update_atacantes');

// Minimal source-format fixture: the second move is a React Flight reference,
// and raw DPS deliberately disagrees with the eDPS ranking.
function fixture(type = 'fire', options = {}) {
  const rows = Array.from({ length: 36 }, (_, i) => ({
    order: i + 1, score: 40 - i, dps: 20 + i, tdo: 300,
    attacker: { id: i + 1, name: (i % 3 === 0 ? 'Mega-' : '') + 'Pokémon ' + i + (i % 3 === 1 ? ' oscuro' : ''), form: i % 3 === 0 ? 'Mega' : null, type1: type },
    qm: i ? '$48:props:initialData:attackers:0:qm' : { id: 1, name: 'Rápido', type, isLegacy: 0 },
    cm: i ? '$48:props:initialData:attackers:0:cm' : { id: 2, name: 'Cargado', type, isLegacy: 1 }
  }));
  if (options.corrupt) rows[1].qm = '$ff:missing';
  if (options.badOrder) rows[1].score = 99;
  if (options.onlyNormal) rows.forEach((row, i) => { row.attacker.name = 'Pokémon ' + i; row.attacker.form = null; });
  const controls = ['Megaevoluciones', 'Formas primigenias', 'Pokémon oscuros', 'Permitir ataques de legado', 'Permitir conjuntos de ataques mixtos', 'Permitir atacantes de otros tipos']
    .map(label => '<label><input type="checkbox" checked=""/>' + label + '</label>').join('');
  const stream = '48:' + JSON.stringify(['$', 'Component', null, { allowedType: type, locale: 'es', initialData: { attackers: rows } }]) + '\n';
  return controls + '<label><input type="checkbox" ' + (options.unavailable ? 'checked=""' : '') + '/>Incluir Pokémon no disponibles</label>' +
    '<p>Nivel 40 Amistad Ninguna (1.0×)↓ Meganivel Máximo (1.3×, +2 niveles)↓</p>' +
    '<input id="test-rejoin" value="10"/><input value="raid-pool" checked=""/>' +
    '<table><th data-column-id="score" aria-sort="descending"></th>' +
    '<tr><td data-column-id="order">1.</td><td><img class="PokemonImage_art" src="/_next/image?url=%2Fimages%2Fpokemon%2F1-mega.webp&amp;w=96"/></td></tr></table>' +
    '<script>self.__next_f.push(' + JSON.stringify([1, stream.slice(0, 80)]) + ')</script>' +
    '<script>self.__next_f.push(' + JSON.stringify([1, stream.slice(80)]) + ')</script>';
}

test('resolves shared moves across stream chunks and retains eDPS source order', () => {
  const group = parseRanking(fixture(), 'fire');
  assert.equal(group.top.length, 30);
  assert.equal(group.top[1].sourceRank, 2);
  assert.equal(group.top[1].fastMove.name, 'Rápido');
  assert.equal(group.top[1].chargedMove.legacy, true);
  assert.ok(group.top[0].dps < group.top[1].dps);
  assert.ok(group.top[0].edps > group.top[1].edps);
  assert.equal(group.top[0].image, 'https://db.pokemongohub.net/images/pokemon/1-mega.webp');
  for (const category of ['normal', 'mega', 'shadow']) assert.equal(group.top.filter(mon => mon.category === category).length, 10);
});

test('does not invent alternatives for an absent category', () => {
  const group = parseRanking(fixture('normal', { onlyNormal: true }), 'normal');
  assert.equal(group.top.length, 10);
  assert.ok(group.top.every(mon => mon.category === 'normal'));
});

test('rejects unavailable defaults, missing references and changed source order', () => {
  for (const options of [{ unavailable: true }, { corrupt: true }, { badOrder: true }]) {
    assert.throws(() => parseRanking(fixture('fire', options), 'fire'));
  }
});

test('requires all 18 distinct types', () => {
  const groups = TYPES.map(type => parseRanking(fixture(type), type));
  assert.doesNotThrow(() => validateDataset(groups));
  assert.throws(() => validateDataset(groups.slice(1)));
  assert.throws(() => validateDataset(groups.map(() => groups[0])));
});

test('keeps the previous snapshot after a partial update; replaces only a complete dataset', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ranking-test-'));
  const output = path.join(dir, 'ranking.json');
  fs.writeFileSync(output, 'previous valid snapshot');
  const fetcher = async url => ({ ok: true, text: async () => fixture(url.split('/').pop()) });
  try {
    await assert.rejects(scrapeAll({ output, delay: 0, log() {}, fetcher: async url => {
      if (url.endsWith('/fire')) throw new Error('network failed');
      return fetcher(url);
    } }));
    assert.equal(fs.readFileSync(output, 'utf8'), 'previous valid snapshot');
    await scrapeAll({ output, delay: 0, log() {}, fetcher });
    assert.equal(JSON.parse(fs.readFileSync(output, 'utf8')).length, 18);
    assert.deepEqual(fs.readdirSync(dir), ['ranking.json']);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

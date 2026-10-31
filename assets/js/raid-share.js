(function () {
  'use strict';
  var current, opener, pending, completed = 0;
  var registry = new Map();
  function key(mon) { return JSON.stringify([String(Number(mon.dex)), mon.name || '', mon.tag || '']); }
  function notice(text) {
    var el = document.getElementById('sharedRaidStatus');
    el.hidden = !text; el.textContent = text;
  }
  function resolve() {
    if (!pending || !opener) return;
    var mon = registry.get(pending);
    if (mon) { pending = null; notice(''); opener(mon); }
    else if (completed >= 2) notice('Esta incursión no está disponible en los datos cargados. Puede haber terminado su rotación.');
  }
  function init(open) {
    opener = open;
    var token = new URLSearchParams(location.search).get('raid');
    if (token) {
      try {
        var fields = JSON.parse(token);
        if (!Array.isArray(fields) || fields.length !== 3 || fields.some(function (v) { return typeof v !== 'string' || v.length > 160; }) || !/^\d+$/.test(fields[0])) throw new Error();
        pending = JSON.stringify(fields); notice('Buscando la incursión compartida…');
      } catch (err) { notice('El enlace de la incursión no es válido. Puedes buscar el jefe en el radar.'); }
    }
    document.getElementById('shareRaid').addEventListener('click', async function () {
      if (!current) return;
      var url = new URL('index.html', location.href);
      url.searchParams.set('raid', key(current));
      var title = current.name + (current.tag ? ' · ' + current.tag : '');
      var status = document.getElementById('shareRaidStatus');
      try {
        if (navigator.share) {
          await navigator.share({title: title, text: 'Incursión de ' + title + ' en Pokémon GO', url: url.href});
          status.textContent = 'Enlace compartido.'; return;
        }
      } catch (err) { if (err.name === 'AbortError') return; }
      try {
        await navigator.clipboard.writeText(url.href);
        status.textContent = 'Enlace copiado.';
      } catch (err) {
        var input = document.getElementById('shareRaidLink');
        input.hidden = false; input.value = url.href; input.focus(); input.select();
        status.textContent = 'Copia este enlace para compartir la incursión.';
      }
    });
  }
  window.RadarShare = {
    init: init,
    register: function (mon) {
      var id = key(mon);
      if (!registry.has(id) || mon.cp) registry.set(id, mon);
      Promise.resolve().then(resolve);
    },
    settled: function () { completed++; resolve(); },
    set: function (mon) {
      current = mon;
      document.getElementById('shareRaidStatus').textContent = '';
      document.getElementById('shareRaidLink').hidden = true;
    }
  };
})();

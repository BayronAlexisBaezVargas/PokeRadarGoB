(function () {
  'use strict';
  var groups = [], labels, mounted = false;
  var section = document.getElementById('attackerCompare');
  var type = document.getElementById('compareType');
  var picks = [document.getElementById('compareFirst'), document.getElementById('compareSecond')];
  var result = document.getElementById('compareResult');
  function node(tag, text) { var el = document.createElement(tag); if (text !== undefined) el.textContent = text; return el; }
  function key(mon) { return JSON.stringify([mon.fullName || mon.name, mon.category, mon.fastMove.name, mon.chargedMove.name]); }
  function group() { return groups.find(function (g) { return g.type === type.value; }); }
  function fill(first) {
    var g = group(); if (!g) return;
    var previous = picks.map(function (p) { return p.value; });
    picks.forEach(function (pick, i) {
      pick.replaceChildren();
      g.top.forEach(function (mon) { var option = node('option', mon.name + ' · ' + mon.tag); option.value = key(mon); pick.appendChild(option); });
      var wanted = i === 0 && first ? key(first) : previous[i];
      pick.value = g.top.some(function (m) { return key(m) === wanted; }) ? wanted : key(g.top[Math.min(i, g.top.length - 1)]);
    });
    if (picks[0].value === picks[1].value) {
      var alternative = g.top.find(function (m) { return key(m) !== picks[0].value; });
      if (alternative) picks[1].value = key(alternative);
    }
    render();
  }
  function render() {
    var g = group(); if (!g) return;
    picks.forEach(function (p, i) { Array.from(p.options).forEach(function (o) { o.disabled = o.value === picks[1-i].value; }); });
    var mons = picks.map(function (p) { return g.top.find(function (m) { return key(m) === p.value; }); });
    result.replaceChildren(); if (!mons[0] || !mons[1]) return;
    var table = node('table'); table.appendChild(node('caption', 'Ranking de tipo ' + labels[g.type]));
    var head = node('thead'), hr = node('tr');
    ['', mons[0].name + ' · ' + mons[0].tag, mons[1].name + ' · ' + mons[1].tag].forEach(function (name) { var th = node('th', name); th.scope = 'col'; hr.appendChild(th); });
    head.appendChild(hr); table.appendChild(head);
    var body = node('tbody');
    [['eDPS','edps'],['DPS','dps'],['TDO','tdo'],['Rápido','fastMove'],['Cargado','chargedMove']].forEach(function (metric) {
      var row = node('tr'), label = node('th', metric[0]); label.scope = 'row'; row.appendChild(label);
      mons.forEach(function (m, i) {
        var value = m[metric[1]], other = mons[1-i][metric[1]];
        var text = value && typeof value === 'object' ? value.name + (value.legacy ? ' *' : '') : Number.isFinite(value) ? value.toLocaleString('es', {maximumFractionDigits:1}) : '—';
        var td = node('td', text);
        if (Number.isFinite(value) && Number.isFinite(other) && value > other) { td.className = 'compare-higher'; td.appendChild(node('small', 'Mayor')); }
        row.appendChild(td);
      }); body.appendChild(row);
    }); table.appendChild(body); result.appendChild(table);
  }
  window.RadarCompare = {
    mount: function (data, names) {
      groups = data; labels = names; var previous = type.value;
      type.replaceChildren(); groups.forEach(function (g) { var o = node('option', labels[g.type]); o.value = g.type; type.appendChild(o); });
      if (groups.some(function (g) { return g.type === previous; })) type.value = previous;
      if (!mounted) { type.addEventListener('change', function () { fill(); }); picks.forEach(function (p) { p.addEventListener('change', render); }); mounted = true; }
      section.hidden = false; fill();
    },
    select: function (mon, g) { type.value = g.type; fill(mon); section.open = true; section.scrollIntoView({block:'start'}); picks[1].focus({preventScroll:true}); }
  };
})();

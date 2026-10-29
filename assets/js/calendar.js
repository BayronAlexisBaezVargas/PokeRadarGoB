(function () {
  'use strict';
  function escapeText(value) {
    return String(value || '').replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
  }
  function stamp(date) { return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function fold(line) {
    var output = '', size = 0;
    for (var char of line) {
      var bytes = new TextEncoder().encode(char).length;
      if (size + bytes > 75) { output += '\r\n '; size = 1; }
      output += char; size += bytes;
    }
    return output;
  }
  function create(event) {
    var start = new Date(event.start), end = new Date(event.end);
    if (!event.start || !event.end || !Number.isFinite(+start) || !Number.isFinite(+end) || end <= start) return null;
    var link = /^https?:\/\//i.test(event.link || '') ? event.link : '';
    var identity = (event.eventID || event.link || event.name || 'evento') + '|' + event.start;
    var hash = 2166136261;
    for (var char of identity) hash = Math.imul(hash ^ char.codePointAt(0), 16777619);
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PokeRadarGoB//Eventos//ES', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT', 'UID:' + (hash >>> 0).toString(16) + '-' + stamp(start) + '@pokeradargob',
      'DTSTAMP:' + stamp(new Date()), 'DTSTART:' + stamp(start), 'DTEND:' + stamp(end),
      'SUMMARY:' + escapeText(event.name), 'DESCRIPTION:' + escapeText('Evento de Pokémon GO' + (link ? '\n' + link : '')),
      'END:VEVENT', 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
  }
  function attach(container, event) {
    var anchor = container.querySelector('[data-calendar-download]');
    if (!anchor) {
      anchor = document.createElement('a');
      anchor.className = 'fec-action-btn ui-button-secondary';
      anchor.dataset.calendarDownload = '';
      anchor.textContent = 'Añadir al calendario (.ics)';
      container.appendChild(anchor);
    }
    if (anchor.dataset.blobUrl) URL.revokeObjectURL(anchor.dataset.blobUrl);
    anchor.removeAttribute('href');
    delete anchor.dataset.blobUrl;
    var content = create(event);
    anchor.style.display = content ? 'flex' : 'none';
    if (!content) return;
    anchor.href = URL.createObjectURL(new Blob([content], {type: 'text/calendar;charset=utf-8'}));
    anchor.dataset.blobUrl = anchor.href;
    anchor.download = 'pokemon-go-evento.ics';
  }
  window.RadarCalendar = {create: create, attach: attach};
})();

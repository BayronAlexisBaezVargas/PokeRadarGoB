(function () {
  'use strict';

  async function json(url, validate, timeout) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, timeout || 10000);
    try {
      var response = await fetch(url, { signal: controller.signal, cache: 'no-cache' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      var data = await response.json();
      if (!validate(data)) throw new Error('Datos incompletos');
      return data;
    } finally { clearTimeout(timer); }
  }

  // Empty arrays are valid responses, not network failures.
  async function load(options) {
    var hasData = false;
    try {
      var saved = JSON.parse(localStorage.getItem(options.key));
      if (options.validate(saved)) {
        await options.render(saved);
        hasData = true;
      }
    } catch (err) { /* An invalid cache must not prevent a network request. */ }
    if (!hasData && options.loading) options.loading();
    try {
      var data = await json(options.url, options.validate);
      await options.render(data);
      hasData = true;
      try {
        localStorage.setItem(options.key, JSON.stringify(data));
        localStorage.setItem(options.key + '_fetchedAt', new Date().toISOString());
      } catch (err) { /* Browsing remains available when storage is full or disabled. */ }
    } catch (err) {
      if (!hasData && options.error) options.error();
    }
  }

  function loading(element, label) {
    element.setAttribute('aria-busy', 'true');
    var status = document.createElement('p');
    status.className = 'content-message';
    status.setAttribute('role', 'status');
    status.textContent = label;
    element.replaceChildren(status);
    for (var i = 0; i < 3; i++) {
      var card = document.createElement('div');
      card.className = 'content-skeleton';
      card.setAttribute('aria-hidden', 'true');
      element.appendChild(card);
    }
  }

  function message(element, text) {
    element.removeAttribute('aria-busy');
    var p = document.createElement('p');
    p.className = 'content-message';
    p.setAttribute('role', 'status');
    p.textContent = text;
    element.replaceChildren(p);
  }

  window.RadarData = {
    json: json, load: load, loading: loading, message: message,
    events: function (data) {
      return Array.isArray(data) && data.every(function (event) {
        return event && typeof event.name === 'string' &&
          (!event.start || !isNaN(Date.parse(event.start))) &&
          (!event.end || !isNaN(Date.parse(event.end)));
      });
    }
  };
})();

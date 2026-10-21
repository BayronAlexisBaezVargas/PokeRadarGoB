(function(){
  "use strict";

  // Floating Event Card modal for semana.html events
  var modalHTML = `
    <dialog class="modal-backdrop" id="evtModal">
      <div class="modal-box floating-event-card" aria-modal="true" aria-labelledby="evtTitle">
        <button class="modal-close" id="evtClose" aria-label="Cerrar modal">&times;</button>
        <div class="fec-header">
          <img id="evtImg" class="fec-thumb" src="" alt="" width="58" height="58">
          <div class="fec-head-info">
            <div class="fec-badges">
              <span id="evtType" class="fec-cat-pill">TIPO DE EVENTO</span>
            </div>
            <h2 id="evtTitle" class="fec-title">Nombre del Evento</h2>
            <div id="evtDates" style="font-size:0.75rem;color:var(--ink-dim);font-family:var(--font-mono);margin-top:2px;"></div>
          </div>
        </div>
        <div class="fec-body">
          <div class="fec-section" id="evtPerksSection" style="display:none;">
            <span class="fec-label">Bonificaciones</span>
            <ul id="evtPerks" class="fec-perks-list"></ul>
          </div>
          <a id="evtLink" href="#" target="_blank" rel="noopener" class="fec-action-btn" style="display:none;">
            <span>Ver noticia oficial</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
          </a>
        </div>
      </div>
    </dialog>
  `;

  var div = document.createElement('div');
  div.innerHTML = modalHTML;
  document.body.appendChild(div.firstElementChild);

  var evtModal        = document.getElementById('evtModal');
  var evtClose        = document.getElementById('evtClose');
  var evtImg          = document.getElementById('evtImg');
  var evtType         = document.getElementById('evtType');
  var evtTitle        = document.getElementById('evtTitle');
  var evtDates        = document.getElementById('evtDates');
  var evtPerks        = document.getElementById('evtPerks');
  var evtPerksSection = document.getElementById('evtPerksSection');
  var evtLink         = document.getElementById('evtLink');

  var lastModalCloseTime = 0;

  window.openEventModal = function(e) {
    if (Date.now() - lastModalCloseTime < 400) return;
    if (window.playScanSound) window.playScanSound();

    // Image
    evtImg.src = e.image || '';
    evtImg.alt = e.name || '';

    // Type pill
    evtType.textContent = e.heading || 'Evento';

    // Title
    evtTitle.textContent = e.name || 'Evento';

    // Dates
    var datesStr = '';
    if (e.start && e.end) {
      var d1 = new Date(e.start);
      var d2 = new Date(e.end);
      datesStr = d1.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) +
                 ' – ' +
                 d2.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    } else {
      datesStr = 'Fecha sin especificar';
    }
    evtDates.textContent = datesStr;

    // Perks
    var perks = [];
    if (e.extraData) {
      if (e.extraData.spotlight && e.extraData.spotlight.bonus) {
        perks.push('Bonus: ' + e.extraData.spotlight.bonus);
        if (e.extraData.spotlight.name) perks.push('Pokémon Destacado: ' + e.extraData.spotlight.name);
      } else if (e.extraData.generic && Array.isArray(e.extraData.generic.perks)) {
        perks = e.extraData.generic.perks;
      } else if (e.extraData.communityday) {
        perks.push('Día de la Comunidad');
        perks.push('Evoluciona al Pokémon destacado para aprender su ataque exclusivo.');
      }
    }
    if (perks.length > 0) {
      evtPerks.innerHTML = perks.map(function(p) {
        return '<li>' + p + '</li>';
      }).join('');
      evtPerksSection.style.display = 'flex';
    } else {
      evtPerks.innerHTML = '';
      evtPerksSection.style.display = 'none';
    }

    // Link
    if (e.link && (e.link.startsWith('http://') || e.link.startsWith('https://'))) {
      evtLink.href = e.link;
      evtLink.style.display = 'flex';
    } else {
      evtLink.href = '#';
      evtLink.style.display = 'none';
    }

    evtModal.showModal();
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  };

  function closeEventModal(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    lastModalCloseTime = Date.now();
    evtModal.close();
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  evtClose.addEventListener('click', function(e) {
    closeEventModal(e);
  });
  evtModal.addEventListener('click', function(e) {
    if (e.target === evtModal) closeEventModal(e);
  });
  evtModal.addEventListener('cancel', function(e) {
    e.preventDefault();
    closeEventModal(e);
  });
  evtModal.addEventListener('close', function() {
    lastModalCloseTime = Date.now();
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  });

})();

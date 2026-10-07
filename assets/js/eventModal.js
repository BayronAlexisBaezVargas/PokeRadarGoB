(function(){
  "use strict";

  // Create the modal HTML dynamically
  var modalHTML = `
    <div class="modal-backdrop" id="evtModal">
      <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="evtTitle">
        <button class="modal-close" id="evtClose" aria-label="Cerrar modal">×</button>
        <div class="modal-header">
          <div class="modal-art-wrap">
            <div class="modal-art-glow" style="background:rgba(61,242,196,0.3)"></div>
            <img id="evtImg" class="modal-art" src="" alt="">
          </div>
          <div class="modal-header-info">
            <div class="modal-tag" id="evtType">TIPO DE EVENTO</div>
            <h2 class="modal-title" id="evtTitle">Nombre del Evento</h2>
            <div class="modal-dex-row" id="evtDates">Fechas</div>
          </div>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <div class="modal-section-title">Detalles Analizados</div>
            <div class="modal-pokedex-box" id="evtDesc">
              Generando descripción...
            </div>
          </div>
          <div style="text-align:center; margin-top:16px;">
            <a id="evtLink" href="#" target="_blank" rel="noopener" style="display:inline-block; text-decoration:none; background:var(--signal); color:var(--void); font-family:var(--font-mono); font-weight:bold; padding:10px 20px; border-radius:var(--radius-sm); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.05em; transition:transform 0.2s;">Ver Noticia Completa ↗</a>
          </div>
        </div>
      </div>
    </div>
  `;

  var div = document.createElement('div');
  div.innerHTML = modalHTML;
  document.body.appendChild(div.firstElementChild);

  var evtModal = document.getElementById('evtModal');
  var evtClose = document.getElementById('evtClose');
  var evtImg = document.getElementById('evtImg');
  var evtType = document.getElementById('evtType');
  var evtTitle = document.getElementById('evtTitle');
  var evtDates = document.getElementById('evtDates');
  var evtDesc = document.getElementById('evtDesc');
  var evtLink = document.getElementById('evtLink');

  function typeWriter(el, text) {
    el.innerHTML = '';
    el.classList.add('typing-cursor');
    var tid = Math.random();
    el.dataset.tid = tid;
    var i = 0;
    function type() {
      if (el.dataset.tid != tid) return;
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, 15);
      } else {
        el.classList.remove('typing-cursor');
      }
    }
    type();
  }

  window.openEventModal = function(e) {
    if(window.playScanSound) window.playScanSound();
    
    evtImg.src = e.image || '';
    evtType.textContent = e.heading || 'Evento de Pokémon GO';
    evtTitle.textContent = e.name || 'Evento Desconocido';
    if (e.link && (e.link.startsWith('http://') || e.link.startsWith('https://'))) {
      evtLink.href = e.link;
      evtLink.style.display = 'inline-block';
    } else {
      evtLink.href = '#';
      evtLink.style.display = 'none';
    }

    // Dates formatting
    var datesStr = '';
    if(e.start && e.end) {
      var d1 = new Date(e.start);
      var d2 = new Date(e.end);
      datesStr = d1.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) + ' - ' + d2.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    } else {
      datesStr = 'Fecha sin especificar';
    }
    evtDates.textContent = datesStr;

    // Generate a description based on event extraData
    var descStr = '';
    if (e.extraData) {
      if (e.extraData.spotlight && e.extraData.spotlight.bonus) {
        descStr = 'Bonus activo: ' + e.extraData.spotlight.bonus;
        if(e.extraData.spotlight.name) descStr += '. Pokémon Destacado: ' + e.extraData.spotlight.name + '.';
      } else if (e.extraData.generic) {
        if(e.extraData.generic.hasSpawns) descStr += 'Este evento cuenta con apariciones silvestres especiales. ';
        if(e.extraData.generic.hasFieldResearchTasks) descStr += 'Nuevas tareas de investigación de campo disponibles. ';
      } else if (e.extraData.communityday) {
        descStr += 'Día de la comunidad. Aprende un ataque exclusivo evolucionando al Pokémon destacado durante el evento o hasta unas horas después.';
      }
    }
    
    if(!descStr) {
      descStr = 'Evento detectado en el radar. Revisa la fuente oficial para conocer todos los detalles, bonos y rotaciones asociadas a esta anomalía.';
    }

    typeWriter(evtDesc, descStr);

    evtModal.classList.add('open');
  };

  function closeEventModal() {
    evtModal.classList.remove('open');
  }

  evtClose.addEventListener('click', closeEventModal);
  evtModal.addEventListener('click', function(e){
    if(e.target === evtModal) closeEventModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && evtModal.classList.contains('open')) closeEventModal();
  });

})();

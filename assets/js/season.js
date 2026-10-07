(function(){
  "use strict";

  /* ============ Detección Dinámica de Temporada ============ */
  window.resolveSeason = function(eventsList) {
    var now = Date.now();
    var foundSeason = null;

    if (Array.isArray(eventsList)) {
      for (var i = 0; i < eventsList.length; i++) {
        var ev = eventsList[i];
        var isSeasonType = (ev.eventType === 'season') || (ev.heading && ev.heading.toLowerCase() === 'season') || (ev.name && ev.name.toLowerCase().indexOf('temporada') !== -1);
        if (isSeasonType) {
          var s = ev.start ? new Date(ev.start).getTime() : 0;
          var e = ev.end ? new Date(ev.end).getTime() : 0;
          if (s && e && now >= s && now <= e) {
            foundSeason = ev.name;
            break;
          }
        }
      }

      if (!foundSeason) {
        var seasons = eventsList.filter(function(ev){
          return (ev.eventType === 'season') || (ev.heading && ev.heading.toLowerCase() === 'season');
        });
        if (seasons.length > 0) {
          seasons.sort(function(a, b){
            return (b.start ? new Date(b.start).getTime() : 0) - (a.start ? new Date(a.start).getTime() : 0);
          });
          foundSeason = seasons[0].name;
        }
      }
    }

    if (!foundSeason) {
      try {
        foundSeason = localStorage.getItem('pgo_active_season');
      } catch (err) {}
    }

    if (foundSeason) {
      foundSeason = foundSeason.replace(/^(?:Season|Temporada):\s*/i, '').trim();
      try {
        localStorage.setItem('pgo_active_season', foundSeason);
      } catch (err) {}
    }

    return foundSeason;
  };

  window.updateCurrentSeasonReadout = function(eventsList) {
    var seasonName = window.resolveSeason(eventsList);
    var seasonEl = document.getElementById('statSeason');
    var readoutBox = document.getElementById('seasonReadout');

    if (seasonName) {
      if (seasonEl) seasonEl.textContent = seasonName;
      if (readoutBox) readoutBox.style.display = '';
    } else {
      if (readoutBox) readoutBox.style.display = 'none';
    }
  };

})();

(function(){
  "use strict";

  var locEl = document.getElementById('userLocation');
  if(!locEl) return;

  function updateLocationDisplay(text) {
    locEl.textContent = '· ' + text;
  }

  // Check if we already asked and saved it
  var cachedLoc = localStorage.getItem('pokeRadarLocation');
  if (cachedLoc) {
    updateLocationDisplay(cachedLoc);
  } else {
    // If not cached, let's wait a second to let the page load before asking
    setTimeout(function() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          
          // Use OpenStreetMap Nominatim for free reverse geocoding
          var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=10&addressdetails=1';
          
          fetch(url, { headers: { 'Accept-Language': 'es' } })
            .then(function(res) { return res.json(); })
            .then(function(data) {
              if (data && data.address) {
                var city = data.address.city || data.address.town || data.address.village || data.address.state || 'Desconocido';
                var country = data.address.country_code ? data.address.country_code.toUpperCase() : '';
                var displayStr = city + (country ? ', ' + country : '');
                
                updateLocationDisplay(displayStr);
                localStorage.setItem('pokeRadarLocation', displayStr);
              } else {
                updateLocationDisplay('Radar Global');
              }
            })
            .catch(function(err) {
              console.error('Error reverse geocoding:', err);
              updateLocationDisplay('Radar Global');
            });
            
        }, function(error) {
          // Si el usuario deniega el permiso o hay error
          console.warn('Geolocation error:', error);
          updateLocationDisplay('Radar Global');
          localStorage.setItem('pokeRadarLocation', 'Radar Global');
        }, { timeout: 10000 });
      } else {
        updateLocationDisplay('Radar Global');
      }
    }, 1500); // 1.5 seconds delay so it doesn't instantly block the user
  }

})();

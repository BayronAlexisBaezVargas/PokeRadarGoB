(function(){
  "use strict";

  /* ============ Telemetría de Audio ============ */
  var audioCtx = null;
  function initAudio() { 
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
  }
  
  window.playClickSound = function() {
    if(!audioCtx) return;
    if(audioCtx.state === 'suspended') audioCtx.resume();
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
  };

  window.playScanSound = function() {
    if(!audioCtx) return;
    if(audioCtx.state === 'suspended') audioCtx.resume();
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.15);
  };

  // Global listener for interactive elements
  document.addEventListener('click', function(e){
    initAudio();
    var isInteractive = e.target.closest('button, a, .card, .seg-btn, .tier-chip, .event-item, .event-card, .day-card');
    if (isInteractive) {
      window.playClickSound();
    }
  });

})();

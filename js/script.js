/* ============================================
   STARK SYSTEMS - AI Command Interface
   ============================================ */

(function () {
  'use strict';

  /* --- DOM References --- */
  const bootOverlay = document.getElementById('boot-overlay');
  const bootText = document.getElementById('boot-text');
  const progressFill = document.getElementById('boot-progress-fill');
  const bootPercent = document.getElementById('boot-percent');
  const interfaceEl = document.getElementById('interface');
  const outerRing = document.getElementById('outer-ring');
  const reactorContainer = document.querySelector('.reactor-container');
  const clockEl = document.getElementById('clock');
  const sysMsg = document.getElementById('system-message');
  const energyFill = document.getElementById('energy-fill');
  const energyValue = document.getElementById('energy-value');
  const engageBtn = document.getElementById('engage-btn');
  const themeBtn = document.getElementById('theme-toggle');
  const panels = document.querySelectorAll('.panel');
  const threatStatus = document.getElementById('threat-status');
  const threatPerimeter = document.getElementById('threat-perimeter');
  const threatAlerts = document.getElementById('threat-alerts');

  /* --- Boot Lines --- */
  const bootLines = [
    'Booting Stark Systems...',
    'Loading neural interface...',
    'Calibrating arc reactor...',
    'System online.'
  ];

  /* --- Rotating System Messages --- */
  const messages = [
    'Satellite link established.',
    'Thermal imaging active.',
    'Defense grid stable.',
    'Perimeter scan complete.',
    'Arc reactor output nominal.',
    'Encryption protocols engaged.',
    'Biometric lock verified.',
    'Quantum processor synced.',
    'Weapons systems on standby.',
    'Flight stabilizers calibrated.'
  ];

  /* --- Themes --- */
  const themes = ['', 'theme-mark3', 'theme-warmachine'];
  const themeLabels = ['ARC BLUE', 'MARK III', 'WAR MACHINE'];
  let themeIndex = 0;

  /* ============================================
     AUDIO ENGINE
     ============================================ */
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  /**
   * AI Awakening sound — rising shimmer with harmonic overtones.
   * Feels like a futuristic system coming alive.
   */
  function playAIAwakeningSound() {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      const dur = 2.0;

      // Shimmer: rising sine sweep
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(200, now);
      osc1.frequency.exponentialRampToValueAtTime(1200, now + dur * 0.7);
      osc1.frequency.exponentialRampToValueAtTime(800, now + dur);
      g1.gain.setValueAtTime(0, now);
      g1.gain.linearRampToValueAtTime(0.08, now + 0.3);
      g1.gain.linearRampToValueAtTime(0.04, now + dur * 0.8);
      g1.gain.linearRampToValueAtTime(0, now + dur);
      osc1.connect(g1).connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + dur);

      // Harmonic overtone
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(400, now);
      osc2.frequency.exponentialRampToValueAtTime(2400, now + dur * 0.7);
      osc2.frequency.exponentialRampToValueAtTime(1600, now + dur);
      g2.gain.setValueAtTime(0, now);
      g2.gain.linearRampToValueAtTime(0.03, now + 0.4);
      g2.gain.linearRampToValueAtTime(0, now + dur);
      osc2.connect(g2).connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + dur);

      // Soft confirmation chime at the end
      const chime = ctx.createOscillator();
      const gc = ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(1047, now + dur - 0.3); // C6
      gc.gain.setValueAtTime(0, now);
      gc.gain.setValueAtTime(0.06, now + dur - 0.3);
      gc.gain.linearRampToValueAtTime(0, now + dur + 0.5);
      chime.connect(gc).connect(ctx.destination);
      chime.start(now + dur - 0.3);
      chime.stop(now + dur + 0.5);
    } catch (e) {}
  }

  /**
   * Engage confirmation tone.
   */
  function playEngageSound() {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  /**
   * Breach alarm — pulsing low siren with urgency.
   */
  function playBreachAlarm() {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Pulsing siren
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(440, now + 0.4);
      osc.frequency.linearRampToValueAtTime(220, now + 0.8);
      osc.frequency.linearRampToValueAtTime(440, now + 1.2);
      osc.frequency.linearRampToValueAtTime(220, now + 1.6);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.1, now + 0.1);
      g.gain.setValueAtTime(0.1, now + 1.4);
      g.gain.linearRampToValueAtTime(0, now + 1.8);
      osc.connect(g).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.8);

      // Impact thud
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(60, now);
      g2.gain.setValueAtTime(0.15, now);
      g2.gain.linearRampToValueAtTime(0, now + 0.4);
      osc2.connect(g2).connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.4);
    } catch (e) {}
  }

  /**
   * Failure mode alarm (FFF easter egg).
   */
  function playAlarmSound() {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  /* ============================================
     SPEECH SYNTHESIS
     Uses the most natural-sounding voice available.
     Prefers Google/premium voices over default ones.
     ============================================ */
  let voicesLoaded = false;

  function loadVoices() {
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
      voicesLoaded = true;
    }
  }

  // Chrome loads voices async
  if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }

  function speakEngageMessage() {
    try {
      if (!('speechSynthesis' in window)) return;

      const utterance = new SpeechSynthesisUtterance('Awaiting your command, Sir.');
      utterance.rate = 0.92;
      utterance.pitch = 0.85;
      utterance.volume = 0.85;

      const voices = speechSynthesis.getVoices();

      // Rank voices by naturalness — prefer Google/premium, then en-GB, then any en
      const preferred = voices.find(v =>
        /google uk english male/i.test(v.name)
      ) || voices.find(v =>
        /google.*english/i.test(v.name) && /male/i.test(v.name)
      ) || voices.find(v =>
        v.lang.startsWith('en-GB') && /daniel|james|george|male/i.test(v.name)
      ) || voices.find(v =>
        v.lang.startsWith('en-GB')
      ) || voices.find(v =>
        /google/i.test(v.name) && v.lang.startsWith('en')
      ) || voices.find(v =>
        v.lang.startsWith('en') && !/female|woman|zira|hazel/i.test(v.name)
      ) || voices.find(v =>
        v.lang.startsWith('en')
      );

      if (preferred) utterance.voice = preferred;

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  /* ============================================
     BOOT SEQUENCE
     ============================================ */
  function runBoot() {
    let lineIndex = 0;
    const totalLines = bootLines.length;

    function typeLine() {
      if (lineIndex >= totalLines) {
        playAIAwakeningSound();
        setTimeout(() => {
          bootOverlay.classList.add('fade-out');
          setTimeout(() => {
            bootOverlay.style.display = 'none';
            showInterface();
          }, 1000);
        }, 600);
        return;
      }

      const div = document.createElement('div');
      div.classList.add('line');
      div.textContent = bootLines[lineIndex];
      bootText.appendChild(div);

      requestAnimationFrame(() => div.classList.add('typing'));

      const progress = Math.round(((lineIndex + 1) / totalLines) * 100);
      progressFill.style.width = progress + '%';
      bootPercent.textContent = progress + '%';

      setTimeout(() => {
        div.classList.remove('typing');
        div.classList.add('done');
        lineIndex++;
        typeLine();
      }, 1000);
    }

    typeLine();
  }

  /* ============================================
     SHOW INTERFACE
     ============================================ */
  function showInterface() {
    interfaceEl.classList.add('visible');
    animatePanels();
    startClock();
    startMessages();
    startEnergyAnimation();
    startReactorAnimation();
    loadVoices();
  }

  function animatePanels() {
    panels.forEach((panel, i) => {
      setTimeout(() => panel.classList.add('visible'), 200 * (i + 1));
    });
  }

  /* ============================================
     ARC REACTOR ROTATION
     ============================================ */
  let rotationAngle = 0;

  function startReactorAnimation() {
    function animate() {
      rotationAngle += 0.3;
      outerRing.style.transform = 'rotate(' + rotationAngle + 'deg)';
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  /* ============================================
     CLOCK
     ============================================ */
  function startClock() {
    function tick() {
      const now = new Date();
      clockEl.textContent =
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ============================================
     ROTATING MESSAGES
     ============================================ */
  let msgInterval = null;

  function startMessages() {
    let msgIndex = 0;
    function showNext() {
      sysMsg.style.opacity = '0';
      setTimeout(() => {
        sysMsg.textContent = '> ' + messages[msgIndex];
        sysMsg.style.opacity = '0.7';
        sysMsg.style.color = '';
        msgIndex = (msgIndex + 1) % messages.length;
      }, 300);
    }
    showNext();
    msgInterval = setInterval(showNext, 5000);
  }

  /* ============================================
     ENERGY ANIMATION
     ============================================ */
  function startEnergyAnimation() {
    function update() {
      const val = Math.floor(Math.random() * 28) + 72;
      energyFill.style.width = val + '%';
      energyValue.textContent = val + '%';
    }
    update();
    setInterval(update, 2000);
  }

  /* ============================================
     ENGAGE AI BUTTON
     ============================================ */
  let engaged = false;

  engageBtn.addEventListener('click', () => {
    engaged = !engaged;

    if (engaged) {
      engageBtn.textContent = 'Awaiting your command, Sir.';
      engageBtn.classList.add('engaged');
      reactorContainer.classList.add('engaged');
      panels.forEach(p => p.classList.add('bright'));
      playEngageSound();
      setTimeout(speakEngageMessage, 250);
    } else {
      engageBtn.textContent = 'Engage AI';
      engageBtn.classList.remove('engaged');
      reactorContainer.classList.remove('engaged');
      panels.forEach(p => p.classList.remove('bright'));
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    }
  });

  /* ============================================
     THEME TOGGLE
     ============================================ */
  themeBtn.addEventListener('click', () => {
    // Exit breach mode if active
    if (breachActive) clearBreach();

    // Remove current theme class
    if (themes[themeIndex]) {
      document.body.classList.remove(themes[themeIndex]);
    }
    themeIndex = (themeIndex + 1) % themes.length;
    if (themes[themeIndex]) {
      document.body.classList.add(themes[themeIndex]);
    }
    themeBtn.textContent = 'THEME: ' + themeLabels[themeIndex];
  });

  /* ============================================
     REACTOR CLICK → BREACH MODE
     Click the reactor → turns red immediately,
     then after 2.5s the whole page goes red,
     threat level HIGH, alarm sound.
     Click again to clear.
     ============================================ */
  let breachActive = false;
  let breachTimeout = null;

  reactorContainer.addEventListener('click', (e) => {
    // Don't trigger if clicking engage button area
    if (e.target === engageBtn) return;

    if (breachActive) {
      clearBreach();
    } else {
      startBreach();
    }
  });

  function startBreach() {
    breachActive = true;

    // Immediately: reactor goes red via engaged-like styling
    reactorContainer.classList.add('engaged');

    // After 2.5s: full page breach
    breachTimeout = setTimeout(() => {
      // Remove any active theme temporarily
      if (themes[themeIndex]) {
        document.body.classList.remove(themes[themeIndex]);
      }
      document.body.classList.add('breach-mode');

      // Update threat panel
      if (threatStatus) {
        threatStatus.textContent = 'HIGH';
        threatStatus.style.color = '#ff3e3e';
      }
      if (threatPerimeter) {
        threatPerimeter.textContent = 'COMPROMISED';
        threatPerimeter.style.color = '#ff6b6b';
      }
      if (threatAlerts) {
        threatAlerts.textContent = '3';
        threatAlerts.style.color = '#ff3e3e';
      }

      // System message override
      sysMsg.textContent = '> ⚠ BREACH DETECTED — THREAT LEVEL ELEVATED';
      sysMsg.style.color = '#ff3e3e';
      sysMsg.style.opacity = '1';

      // Play breach alarm
      playBreachAlarm();
    }, 2500);
  }

  function clearBreach() {
    breachActive = false;
    clearTimeout(breachTimeout);

    document.body.classList.remove('breach-mode');

    // Restore theme if one was active
    if (themes[themeIndex]) {
      document.body.classList.add(themes[themeIndex]);
    }

    // Only remove engaged if engage button isn't active
    if (!engaged) {
      reactorContainer.classList.remove('engaged');
    }

    // Restore threat panel
    if (threatStatus) {
      threatStatus.textContent = 'LOW';
      threatStatus.style.color = '';
    }
    if (threatPerimeter) {
      threatPerimeter.textContent = 'Secured';
      threatPerimeter.style.color = '';
    }
    if (threatAlerts) {
      threatAlerts.textContent = '0';
      threatAlerts.style.color = '';
    }

    // Restore system message
    sysMsg.style.color = '';
    sysMsg.style.opacity = '0.7';
  }

  /* ============================================
     HIDDEN FAILURE MODE (FFF Easter Egg)
     ============================================ */
  let failPresses = 0;
  let failTimer = null;
  let failureActive = false;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
      failPresses++;
      clearTimeout(failTimer);
      failTimer = setTimeout(() => { failPresses = 0; }, 800);

      if (failPresses >= 3) {
        failPresses = 0;
        toggleFailure();
      }
    }
  });

  function toggleFailure() {
    failureActive = !failureActive;
    if (failureActive) {
      document.body.classList.add('failure');
      sysMsg.textContent = '> CRITICAL SYSTEM FAILURE — BREACH DETECTED';
      sysMsg.style.color = '#ff3e3e';
      playAlarmSound();
    } else {
      document.body.classList.remove('failure');
      sysMsg.style.color = '';
    }
  }

  /* --- Boot --- */
  runBoot();

})();

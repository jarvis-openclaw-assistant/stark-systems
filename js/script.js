/* ============================================
   STARK SYSTEMS - AI Command Interface
   Main Script
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

  /* --- Boot Sequence Lines --- */
  const bootLines = [
    'Booting Stark Systems...',
    'Loading neural interface...',
    'Calibrating arc reactor...',
    'System online.'
  ];

  /* --- System Messages (rotating) --- */
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

  /* --- Theme Cycling (Iron Man palette) --- */
  const themes = ['', 'theme-mark3', 'theme-warmachine'];
  const themeLabels = ['ARC BLUE', 'MARK III', 'WAR MACHINE'];
  let themeIndex = 0;

  /* ============================================
     AUDIO ENGINE
     Synthesized sounds using Web Audio API
     ============================================ */
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  /**
   * Play a mechanical reactor hum — layered oscillators
   * for a rich, cinematic power-up feel.
   */
  function playReactorHum() {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      const duration = 2.5;

      // Layer 1: Deep bass hum
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now);
      osc1.frequency.linearRampToValueAtTime(80, now + duration);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.12, now + 0.5);
      gain1.gain.linearRampToValueAtTime(0.06, now + duration);
      gain1.gain.linearRampToValueAtTime(0, now + duration + 0.5);
      osc1.connect(gain1).connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + duration + 0.5);

      // Layer 2: Mid-range mechanical whine
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(120, now);
      osc2.frequency.linearRampToValueAtTime(220, now + duration);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.03, now + 0.8);
      gain2.gain.linearRampToValueAtTime(0.015, now + duration);
      gain2.gain.linearRampToValueAtTime(0, now + duration + 0.5);
      osc2.connect(gain2).connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + duration + 0.5);

      // Layer 3: High electrical crackle
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'square';
      osc3.frequency.setValueAtTime(2400, now);
      osc3.frequency.linearRampToValueAtTime(3200, now + 0.3);
      osc3.frequency.linearRampToValueAtTime(1800, now + duration);
      gain3.gain.setValueAtTime(0, now);
      gain3.gain.linearRampToValueAtTime(0.008, now + 0.2);
      gain3.gain.linearRampToValueAtTime(0.003, now + duration);
      gain3.gain.linearRampToValueAtTime(0, now + duration + 0.3);
      osc3.connect(gain3).connect(ctx.destination);
      osc3.start(now);
      osc3.stop(now + duration + 0.3);
    } catch (e) {
      // Audio not supported
    }
  }

  /**
   * Play a short UI confirmation tone.
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
   * Play alarm sound for system failure mode.
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
     Speaks "Awaiting your command, Sir." with
     a British English voice when available.
     ============================================ */
  function speakEngageMessage() {
    try {
      if (!('speechSynthesis' in window)) return;

      const utterance = new SpeechSynthesisUtterance('Awaiting your command, Sir.');
      utterance.rate = 0.95;
      utterance.pitch = 0.9;
      utterance.volume = 0.8;

      // Prefer a British English male voice (JARVIS-like)
      const voices = speechSynthesis.getVoices();
      const preferred = voices.find(v =>
        v.lang.startsWith('en-GB') && /male|daniel|james|george/i.test(v.name)
      ) || voices.find(v =>
        v.lang.startsWith('en-GB')
      ) || voices.find(v =>
        v.lang.startsWith('en')
      );

      if (preferred) utterance.voice = preferred;

      speechSynthesis.cancel(); // Clear any queued speech
      speechSynthesis.speak(utterance);
    } catch (e) {
      // Speech not supported — text fallback already shown
    }
  }

  /* ============================================
     BOOT SEQUENCE
     Types lines one by one with a progress bar,
     then plays reactor hum on completion.
     ============================================ */
  function runBoot() {
    let lineIndex = 0;
    const totalLines = bootLines.length;

    function typeLine() {
      if (lineIndex >= totalLines) {
        // Boot complete — play reactor hum, then transition
        playReactorHum();
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

      requestAnimationFrame(() => {
        div.classList.add('typing');
      });

      // Update progress bar
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

    // Pre-load speech voices (some browsers need this)
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
    }
  }

  function animatePanels() {
    panels.forEach((panel, i) => {
      setTimeout(() => {
        panel.classList.add('visible');
      }, 200 * (i + 1));
    });
  }

  /* ============================================
     ARC REACTOR — requestAnimationFrame rotation
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
     LIVE CLOCK
     ============================================ */
  function startClock() {
    function tick() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      clockEl.textContent = h + ':' + m + ':' + s;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ============================================
     ROTATING SYSTEM MESSAGES (every 5s)
     ============================================ */
  function startMessages() {
    let msgIndex = 0;
    function showNext() {
      sysMsg.style.opacity = '0';
      setTimeout(() => {
        sysMsg.textContent = '> ' + messages[msgIndex];
        sysMsg.style.opacity = '0.7';
        msgIndex = (msgIndex + 1) % messages.length;
      }, 300);
    }
    showNext();
    setInterval(showNext, 5000);
  }

  /* ============================================
     ANIMATED ENERGY PERCENTAGE (72–99%)
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
     - Text + voice: "Awaiting your command, Sir."
     - Reactor intensifies with theme colour
     - Panels brighten
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
      // Speak the line with a slight delay so sound plays first
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
     Cycles: Arc Blue → Mark III → War Machine
     ============================================ */
  themeBtn.addEventListener('click', () => {
    document.body.classList.remove(themes[themeIndex]);
    themeIndex = (themeIndex + 1) % themes.length;
    if (themes[themeIndex]) {
      document.body.classList.add(themes[themeIndex]);
    }
    themeBtn.textContent = 'THEME: ' + themeLabels[themeIndex];
  });

  /* ============================================
     HIDDEN SYSTEM FAILURE MODE
     Press F three times quickly to trigger
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

  /* --- Kick off boot sequence --- */
  runBoot();

})();

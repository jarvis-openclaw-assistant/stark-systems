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

  /* --- Theme Cycling --- */
  const themes = ['', 'theme-red', 'theme-gold'];
  let themeIndex = 0;

  /* ============================================
     BOOT SEQUENCE
     Types lines one by one with a progress bar
     ============================================ */
  function runBoot() {
    let lineIndex = 0;
    const totalLines = bootLines.length;

    function typeLine() {
      if (lineIndex >= totalLines) {
        // Boot complete — transition to interface
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

      // Trigger typing animation
      requestAnimationFrame(() => {
        div.classList.add('typing');
      });

      // Update progress bar
      const progress = Math.round(((lineIndex + 1) / totalLines) * 100);
      progressFill.style.width = progress + '%';
      bootPercent.textContent = progress + '%';

      // After typing finishes, mark done and proceed
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
     Fades in the main UI, then animates panels
     ============================================ */
  function showInterface() {
    interfaceEl.classList.add('visible');
    animatePanels();
    startClock();
    startMessages();
    startEnergyAnimation();
    startReactorAnimation();
  }

  /* --- Staggered panel reveal --- */
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
      rotationAngle += 0.3; // degrees per frame
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
     ANIMATED ENERGY PERCENTAGE
     Fluctuates between 72–99%
     ============================================ */
  function startEnergyAnimation() {
    function update() {
      const val = Math.floor(Math.random() * 28) + 72; // 72-99
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
      // Play subtle click sound if available
      playSound('engage');
    } else {
      engageBtn.textContent = 'Engage AI';
      engageBtn.classList.remove('engaged');
      reactorContainer.classList.remove('engaged');
      panels.forEach(p => p.classList.remove('bright'));
    }
  });

  /* ============================================
     THEME TOGGLE
     Cycles: Default (Blue) → Red → Gold → ...
     ============================================ */
  themeBtn.addEventListener('click', () => {
    // Remove current theme
    document.body.classList.remove(themes[themeIndex]);
    themeIndex = (themeIndex + 1) % themes.length;
    // Apply new theme
    if (themes[themeIndex]) {
      document.body.classList.add(themes[themeIndex]);
    }
    const labels = ['BLUE', 'RED', 'GOLD'];
    themeBtn.textContent = 'THEME: ' + labels[themeIndex];
  });

  /* ============================================
     HIDDEN SYSTEM FAILURE MODE
     Triggered by pressing 'F' three times quickly
     ============================================ */
  let failPresses = 0;
  let failTimer = null;

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

  let failureActive = false;

  function toggleFailure() {
    failureActive = !failureActive;
    if (failureActive) {
      document.body.classList.add('failure');
      sysMsg.textContent = '> CRITICAL SYSTEM FAILURE — BREACH DETECTED';
      sysMsg.style.color = '#ff3e3e';
      playSound('alarm');
    } else {
      document.body.classList.remove('failure');
      sysMsg.style.color = '';
    }
  }

  /* ============================================
     SUBTLE UI SOUNDS (optional, gracefully skipped)
     ============================================ */
  function playSound(type) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.05;

      if (type === 'engage') {
        osc.frequency.value = 880;
        osc.type = 'sine';
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'alarm') {
        osc.frequency.value = 440;
        osc.type = 'sawtooth';
        gain.gain.value = 0.08;
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Sound not supported — gracefully skip
    }
  }

  /* --- Kick off the boot sequence on load --- */
  runBoot();

})();

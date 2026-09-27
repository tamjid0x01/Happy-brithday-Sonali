/* ═══════════════════════════════════════════════════
   HAPPY BIRTHDAY SONALI ❤️ — the magic behind the scenes
   ═══════════════════════════════════════════════════ */
(function () {
  "use strict";

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ═══════════ UTILITY ═══════════ */
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ═══════════ 1. TWINKLING STARS ═══════════ */
  const starLayer = $("#stars");
  if (starLayer) {
    const count = reduceMotion ? 26 : window.innerWidth < 600 ? 60 : 110;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("i");
      s.className = "star";
      s.style.left = rand(0, 100) + "%";
      s.style.top = rand(0, 100) + "%";
      s.style.setProperty("--dur", rand(2.2, 6) + "s");
      s.style.setProperty("--del", rand(0, 6) + "s");
      s.style.transform = "scale(" + rand(0.5, 1.2) + ")";
      starLayer.appendChild(s);
    }
  }

  /* ═══════════ 2. FLOATING HEARTS ═══════════ */
  const heartsLayer = $("#heartsLayer");
  const HEART_EMOJI = ["💗", "💖", "💕", "❤️", "💘", "🩷"];
  if (heartsLayer) {
    const n = reduceMotion ? 0 : window.innerWidth < 600 ? 14 : 22;
    for (let i = 0; i < n; i++) {
      const h = document.createElement("span");
      h.className = "heart-float";
      h.textContent = pick(HEART_EMOJI);
      h.style.left = rand(0, 100) + "%";
      h.style.setProperty("--size", rand(0.8, 1.9) + "rem");
      h.style.setProperty("--dur", rand(11, 24) + "s");
      h.style.setProperty("--del", rand(0, 18) + "s");
      h.style.opacity = rand(0.4, 0.85);
      heartsLayer.appendChild(h);
    }
  }

  /* ═══════════ 3. BALLOONS ═══════════ */
  const balloonsLayer = $("#balloonsLayer");
  const BALLOON_COLORS = ["#ff7fb6", "#ffd98a", "#ff9ecb", "#d98cf5", "#ffb347", "#8fd9ff", "#ff90c8"];
  if (balloonsLayer) {
    const n = reduceMotion ? 0 : window.innerWidth < 600 ? 7 : 11;
    for (let i = 0; i < n; i++) {
      const b = document.createElement("span");
      b.className = "balloon";
      b.style.left = rand(2, 96) + "%";
      b.style.setProperty("--dur", rand(16, 30) + "s");
      b.style.setProperty("--del", rand(0, 24) + "s");
      const size = rand(30, 52);
      b.style.width = size + "px";
      b.style.height = (size * 1.28) + "px";
      b.style.background = "radial-gradient(circle at 32% 26%, rgba(255,255,255,.75), " + pick(BALLOON_COLORS) + " 72%)";
      b.style.borderRadius = "50% 50% 50% 50% / 42% 42% 58% 58%";
      b.style.boxShadow = "inset -4px -6px 12px rgba(0,0,0,.22)";
      balloonsLayer.appendChild(b);
    }
  }

  /* ═══════════ 4. CONFETTI ENGINE ═══════════ */
  const cvs = $("#confettiCanvas");
  let C = null, running = false;

  function initConfetti() {
    if (!cvs || !cvs.getContext) return;
    C = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
  }

  const COLORS = ["#ff7fb6", "#ffd98a", "#ff9ecb", "#d98cf5", "#ffb347", "#8fd9ff", "#ffffff", "#ff90c8"];
  const pieces = [];
  const GRAV = 0.16;

  function spawnBurst(n, x, y) {
    if (!C) initConfetti();
    const w = window.innerWidth, h = window.innerHeight;
    for (let i = 0; i < n; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(3.5, 12);
      pieces.push({
        x: x !== undefined ? x : rand(0, w),
        y: y !== undefined ? y : -rand(0, h * 0.5),
        vx: Math.cos(angle) * speed * rand(0.3, 1),
        vy: (y !== undefined ? Math.sin(angle) * speed : rand(1.4, 4.6) + Math.random() * 2),
        w: rand(6, 12), ht: rand(8, 15),
        c: pick(COLORS),
        rot: rand(0, Math.PI * 2), vr: rand(-0.22, 0.22),
        ttl: rand(130, 300), life: 0,
        shape: Math.random() < 0.24 ? "heart" : Math.random() < 0.5 ? "rect" : "circle"
      });
    }
    if (!running) { running = true; requestAnimationFrame(confettiTick); }
  }

  function confettiTick() {
    if (!C) return;
    C.clearRect(0, 0, cvs.width, cvs.height);
    let alive = 0;
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.life++;
      if (p.life > p.ttl || p.y > cvs.height + 20) { pieces.splice(i, 1); continue; }
      alive++;
      p.vy += GRAV * (p.shape === "rect" ? 1 : 0.82);
      p.vx *= 0.995;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      const alpha = clamp(1 - p.life / p.ttl, 0, 1);
      C.save();
      C.translate(p.x, p.y);
      C.rotate(p.rot);
      C.globalAlpha = alpha;
      C.fillStyle = p.c;
      if (p.shape === "rect") C.fillRect(-p.w / 2, -p.ht / 2, p.w, p.ht);
      else if (p.shape === "circle") { C.beginPath(); C.arc(0, 0, p.w / 2, 0, Math.PI * 2); C.fill(); }
      else {
        C.font = (p.w * 1.15) + "px serif";
        C.textAlign = "center"; C.textBaseline = "middle";
        C.fillText("❤", 0, 0);
      }
      C.restore();
    }
    if (alive > 0) { requestAnimationFrame(confettiTick); }
    else { running = false; if (C) C.clearRect(0, 0, cvs.width, cvs.height); }
  }

  /* ═══════════ 5. GIFT OVERLAY ═══════════ */
  const overlay = $("#giftOverlay");
  const openBtn = $("#openGiftBtn");
  const musicBtn = $("#musicBtn");
  let opened = false;

  function openGift() {
    if (opened) return;
    opened = true;
    const box = $("#giftBox");
    if (box) {
      box.style.transition = "transform .6s cubic-bezier(.22,.8,.34,1)";
      box.style.transform = "scale(1.18) rotate(-4deg)";
    }
    setTimeout(() => {
      if (overlay) overlay.classList.add("hidden");
      if (musicBtn) musicBtn.classList.add("show");
      ensureMusic();
      setMusicState(true);
      spawnBurst(170);
      setTimeout(() => { document.body.classList.add("entered"); }, 300);
    }, 420);
  }
  if (openBtn) openBtn.addEventListener("click", openGift);
/* ═══════════ 6. MUSIC — WEB AUDIO "HAPPY BIRTHDAY" ═══════════ */
  let AC = null, masterGain = null, musicOn = false, musicStartTime = 0, loopTimer = null;

  const NOTE = {
    G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25,
    G5: 783.99, C4: 261.63, F4: 349.23,
    E4: 329.63, D4: 293.66, A3: 220.00
  };

  /* melody: [note, beats]  (beat = 0.46s, gentle waltz) */
  const MELODY = [
    [NOTE.G4, 0.75], [NOTE.G4, 0.25], [NOTE.A4, 1.0], [NOTE.G4, 0.75], [NOTE.C5, 0.25], [NOTE.B4, 1.0],
    [NOTE.G4, 0.75], [NOTE.G4, 0.25], [NOTE.A4, 1.0], [NOTE.G4, 0.75], [NOTE.D5, 0.25], [NOTE.C5, 1.0],
    [NOTE.G4, 1.0],  [NOTE.G4, 0.5],  [NOTE.G5, 0.5], [NOTE.D5, 1.0], [NOTE.B4, 0.5],  [NOTE.G4, 0.5],
    [NOTE.C5, 1.0],
    [NOTE.G4, 0.75], [NOTE.G4, 0.25], [NOTE.A4, 1.0], [NOTE.G4, 0.75], [NOTE.C5, 0.25], [NOTE.B4, 1.0]
  ];

  function ensureMusic() {
    if (AC) return;
    try {
      AC = new (window.AudioContext || window.webAudioContext)();
    } catch (e) {
      try { AC = new AudioContext(); } catch (e2) { return; }
    }
    masterGain = AC.createGain();
    masterGain.connect(AC.destination);
    masterGain.gain.value = 0.0;
    masterGain.gain.linearRampToValueAtTime(0.16, AC.currentTime + 2.2);
  }

  function playNote(freq, start, dur, vol) {
    if (!AC || !AC.createOscillator) return;
    const t0 = AC.currentTime + start;
    const osc = AC.createOscillator();
    osc.frequency.value = freq;
    const env = AC.createGain();
    env.gain.value = 0;
    const gEnv = env.gain;
    gEnv.setValueAtTime(0, t0);
    gEnv.linearRampToValueAtTime(vol, t0 + 0.012);
    gEnv.linearRampToValueAtTime(vol * 0.7, t0 + 0.09);
    gEnv.linearRampToValueAtTime(vol * 0.22, t0 + Math.max(dur * 0.6, 0.3));
    gEnv.linearRampToValueAtTime(0, t0 + Math.max(dur, 0.5));

    /* warm shimmer: quiet octave + fifth harmonics */
    [2.001, 3.004].forEach((mult, idx) => {
      const h = AC.createOscillator();
      h.frequency.value = freq * mult;
      const hg = AC.createGain();
      hg.gain.value = idx === 0 ? 0.16 : 0.06;
      h.connect(hg); hg.connect(env);
      h.start(t0); h.stop(t0 + dur + 0.4);
    });

    osc.connect(env); env.connect(masterGain);
    osc.start(t0); osc.stop(t0 + dur + 0.4);
  }

  function scheduleSong() {
    if (!AC || !AC.createOscillator || !musicOn) return;
    const beat = 0.46;
    let t = 0.3;
    MELODY.forEach((entry) => {
      const [freq, beats] = entry;
      playNote(freq, t, beats * beat * 1.15, 0.5);
      t += beats * beat;
    });
    /* final gentle chord arpeggio — C major */
    playNote(NOTE.C4, t + 0.1, 1.6, 0.33);
    playNote(NOTE.E4, t + 0.24, 1.6, 0.3);
    playNote(NOTE.G4, t + 0.38, 1.8, 0.28);
    musicStartTime = AC.currentTime + t + 2.2;
    /* loop */
    if (loopTimer) clearTimeout(loopTimer);
    loopTimer = setTimeout(scheduleSong, (t + 2.6) * 1000);
  }

  function setMusicState(on) {
    musicOn = on;
    if (musicBtn) {
      musicBtn.textContent = on ? "🎵" : "🔇";
      musicBtn.classList.toggle("on", on);
      musicBtn.classList.toggle("muted", !on);
    }
    if (!AC) return;
    if (on) {
      if (masterGain) masterGain.gain.linearRampToValueAtTime(0.16, AC.currentTime + 1.2);
      scheduleSong();
    } else {
      if (masterGain) masterGain.gain.linearRampToValueAtTime(0.0, AC.currentTime + 0.4);
      if (loopTimer) clearTimeout(loopTimer);
    }
  }

  if (musicBtn) musicBtn.addEventListener("click", () => {
    ensureMusic();
    setMusicState(!musicOn);
  });
/* ═══════════ 7. TYPEWRITER LOVE LETTER ═══════════ */
  const letterPara = $("#letterType");
  const LETTER_FULL = letterPara ? letterPara.textContent.trim().replace(/\s+/g, " ") : "";

  function typewriter(el, text, speed) {
    el.textContent = "";
    let i = 0;
    const n = text.length;
    const step = () => {
      if (i >= n) return;
      const chunk = Math.min(3, n - i);
      el.textContent = text.slice(0, i + chunk);
      i += chunk;
      setTimeout(step, speed);
    };
    step();
  }

  /* ═══════════ 8. FLIP CARDS ═══════════ */
  $$(".reason-card").forEach((card) => {
    const toggle = () => card.classList.toggle("flipped");
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });

  /* ═══════════ 9. CAKE — BLOW OUT CANDLES ═══════════ */
  const candles = $$(".candle");
  const wishMsg = $("#wishMsg");
  let candlesLeft = candles.length;

  candles.forEach((c) => {
    c.addEventListener("click", () => {
      if (c.classList.contains("out")) return;
      const puff = document.createElement("span");
      puff.className = "puff";
      c.appendChild(puff);
      c.classList.add("out");
      c.querySelector(".flame").style.display = "none";
      candlesLeft--;
      if (candlesLeft === 0) {
        if (wishMsg) wishMsg.textContent = "Wish granted! ✨ May tonight's wish come true, my love 💫";
        spawnBurst(140);
      } else {
        if (wishMsg) wishMsg.textContent = "Almost there… " + candlesLeft + " more " + (candlesLeft === 1 ? "flame" : "flames") + " to go ✨";
      }
      setTimeout(() => { puff.remove(); }, 750);
    });
  });
/* ═══════════ 10. SCROLL REVEAL ═══════════ */
  const revealEls = $$(".section");
  revealEls.forEach((el) => el.classList.add("reveal"));

  let typeDone = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        /* start typewriter when the letter card scrolls into view */
        if (!typeDone && entry.target.id === "letter") {
          typeDone = true;
          setTimeout(() => { if (letterPara && LETTER_FULL) typewriter(letterPara, LETTER_FULL, 16); }, 500);
        }
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.22, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el) => io.observe(el));

  /* ═══════════ 11. POLAROID 3D TILT ═══════════ */
  const polaroid = $("#polaroid");
  if (polaroid && !reduceMotion && window.matchMedia && window.matchMedia("(hover: hover)").matches) {
    const baseRotate = -3;
    polaroid.addEventListener("pointermove", (e) => {
      const r = polaroid.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      polaroid.style.transform =
        "rotate(" + (baseRotate + px * 7) + "deg) " +
        "rotateX(" + (-py * 9) + "deg) rotateY(" + (px * 9) + "deg)";
    });
    polaroid.addEventListener("pointerleave", () => {
      polaroid.style.transform = "rotate(" + baseRotate + "deg)";
    });
  }

  /* ═══════════ 12. SPARKLE CURSOR ═══════════ */
  if (!reduceMotion) {
    let lastSpark = 0;
    const sparkleHost = document.createElement("div");
    sparkleHost.className = "sparkle-host";
    document.body.appendChild(sparkleHost);
    const STYLE = document.createElement("style");
    STYLE.textContent =
      ".sparkle-host{position:fixed;inset:0;pointer-events:none;z-index:95}" +
      ".sparkle{position:absolute;font-size:13px;opacity:0;transition:opacity .5s,transform .5s;pointer-events:none}" +
      "@keyframes sparklePop{0%{opacity:1;transform:scale(.4)}100%{opacity:0;transform:scale(1.25)}}";
    document.head.appendChild(STYLE);
    document.addEventListener("pointermove", (e) => {
      const now = Date.now();
      if (now - lastSpark < 42) return;
      lastSpark = now;
      if (Math.random() > 0.72) return;
      const s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = pick(["✨", "💖", "🌟", "🎀", "✨"]);
      s.style.left = (e.clientX + rand(-6, 6)) + "px";
      s.style.top = (e.clientY + rand(-6, 6)) + "px";
      s.style.animation = "sparklePop .7s ease-out forwards";
      sparkleHost.appendChild(s);
      setTimeout(() => s.remove(), 720);
    });
  }

  /* ═══════════ 13. FINALE HEART + REPLAY ═══════════ */
  const finaleHeart = $("#finaleHeart");
  if (finaleHeart) finaleHeart.addEventListener("click", () => {
    finaleHeart.style.animation = "none";
    void finaleHeart.offsetWidth;
    finaleHeart.style.animation = "";
    spawnBurst(110);
  });

  const replayBtn = $("#replayBtn");
  if (replayBtn) replayBtn.addEventListener("click", () => spawnBurst(150));

  /* ═══════════ 14. YEAR + WINDOW RESIZE ═══════════ */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  window.addEventListener("resize", () => {
    if (cvs) { cvs.width = window.innerWidth; cvs.height = window.innerHeight; }
  });

  /* keep polish: if the user opened gift before fonts loaded, re-show music button later */
  window.addEventListener("load", () => {
    if (opened && musicBtn) musicBtn.classList.add("show");
  });
})();
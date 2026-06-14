/* ============================================================
   WORDCLOUD.JS
   Canvas-based animated word cloud with:
   - Gentle autonomous drift (sine-wave per word, unique phase)
   - Cursor repel — words push away from mouse position
   - Soft boundary bounce — words stay inside the canvas
   - Peer repulsion — words nudge apart if they overlap
   - Variable font sizes based on word length / category weight
   ============================================================ */

(function () {

  // ── Words ──────────────────────────────────────────────────
  // Words are grouped by weight: 3 = largest, 1 = smallest.
  // Weight roughly maps to "how central is this to your identity."
  const WORDS = [
    // Core languages & frameworks — weight 3
    { text: "PHP",          weight: 3 },
    { text: "JavaScript",   weight: 3 },
    { text: "Laravel",      weight: 3 },
    { text: "MySQL",        weight: 3 },
    { text: "HTML/CSS",     weight: 3 },
    { text: "PostgreSQL",   weight: 2 },
    { text: "SQL",          weight: 2 },

    // Tools — weight 2
    { text: "Git/GitHub",   weight: 2 },
    { text: "REST API",     weight: 2 },
    { text: "Bootstrap",    weight: 2 },
    { text: "n8n",          weight: 2 },
    { text: "OpenAI",       weight: 2 },
    { text: "Android Studio", weight: 2 },
    { text: "Postman",      weight: 2 },
    { text: "TablePlus",    weight: 1 },
    { text: "Composer",     weight: 1 },
    { text: "Hostinger",    weight: 1 },
    { text: "Webhooks",     weight: 1 },
    { text: "XML",          weight: 1 },
    { text: "Java",         weight: 2 },

    // Practices — weight 2
    { text: "OOP",              weight: 2 },
    { text: "Database Design",  weight: 2 },
    { text: "REST API Testing", weight: 1 },
    { text: "Software Testing", weight: 2 },
    { text: "Debugging",        weight: 2 },
    { text: "Agile",            weight: 2 },
    { text: "ERD",              weight: 1 },
    { text: "DFD",              weight: 1 },
    { text: "AI Integration",   weight: 2 },

    // Roles — weight 2
    { text: "Full-Stack",       weight: 2 },
    { text: "Backend Dev",      weight: 2 },
    { text: "UI/UX",            weight: 2 },
    { text: "Manual QA",        weight: 2 },
    { text: "AI Automation",    weight: 2 },
    { text: "Mobile Dev",       weight: 1 },

    // Soft skills — weight 1 (smaller, background texture)
    { text: "Problem-Solving",        weight: 1 },
    { text: "Analytical",             weight: 1 },
    { text: "Attention to Detail",    weight: 1 },
    { text: "Team Collaboration",     weight: 1 },
    { text: "Adaptability",           weight: 1 },
    { text: "Time Management",        weight: 1 },
    { text: "Technical Comms",        weight: 1 },
    { text: "Willingness to Learn",   weight: 1 },
    { text: "Process & Quality",      weight: 1 },
  ];

  // ── Config ─────────────────────────────────────────────────
  const FONT_FAMILY   = "'DM Sans', sans-serif";
  const FONT_SIZES    = { 3: 20, 2: 15, 1: 11.5 };  // px — bumped up one tier each
  const FONT_WEIGHTS  = { 3: "500", 2: "400", 1: "300" };

  // Palette — terracotta family, varying opacity so they layer nicely
  const COLORS = [
    "rgba(193, 122, 84, 0.85)",   // terracotta
    "rgba(212, 149, 106, 0.70)",  // terracotta-light
    "rgba(181, 137, 92, 0.65)",   // muted
    "rgba(232, 197, 160, 0.55)",  // sand
    "rgba(61, 43, 31, 0.40)",     // brown (darkest — for small words)
  ];

  // Physics
  const DRIFT_SPEED   = 0.00045;  // how fast words oscillate autonomously
  const DRIFT_AMP     = 3.2;      // max px of autonomous drift
  const REPEL_RADIUS  = 100;      // px — cursor influence zone
  const REPEL_FORCE   = 5.5;      // how hard words flee the cursor
  const RETURN_SPEED  = 0.032;    // how fast words drift back to home
  const PEER_RADIUS   = 10;       // px — tighter gap so larger words still pack
  const PEER_FORCE    = 0.55;     // nudge strength between overlapping words
  const VEL_DAMPING   = 0.82;     // velocity decay per frame

  // ── State ──────────────────────────────────────────────────
  let canvas, ctx, dpr, W, H;
  let particles = [];
  let mouse = { x: -9999, y: -9999 };  // off-canvas default
  let animId;
  let isTouch = false;

  // ── Init ───────────────────────────────────────────────────
  function init() {
    canvas = document.getElementById("wordcloud-canvas");
    if (!canvas) return;

    // Touch detection — disable repel on touch devices (cursor doesn't apply)
    isTouch = window.matchMedia("(pointer: coarse)").matches;

    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize, { passive: true });

    if (!isTouch) {
      // Track cursor relative to THIS canvas
      canvas.parentElement.addEventListener("mousemove", onMouseMove, { passive: true });
      canvas.parentElement.addEventListener("mouseleave", () => {
        mouse.x = -9999;
        mouse.y = -9999;
      });
    }

    buildParticles();
    requestAnimationFrame(loop);
  }

  // ── Resize ─────────────────────────────────────────────────
  function resize() {
    dpr = window.devicePixelRatio || 1;
    const wrap = canvas.parentElement;
    W = wrap.clientWidth;
    H = wrap.clientHeight;

    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);

    // Rebuild on resize so positions recalculate for new dimensions
    if (particles.length) {
      buildParticles();
    }
  }

  // ── Mouse ──────────────────────────────────────────────────
  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  // ── Measure text ───────────────────────────────────────────
  function measureWord(word) {
    const size = FONT_SIZES[word.weight];
    ctx.font = `${FONT_WEIGHTS[word.weight]} ${size}px ${FONT_FAMILY}`;
    const metrics = ctx.measureText(word.text);
    return {
      w: metrics.width,
      h: size * 1.2,   // approximate height
    };
  }

  // ── Place words without collisions (simple packing) ────────
  function buildParticles() {
    particles = [];

    const PADDING = 14;  // px gap from canvas edge
    const placed  = [];  // bounding boxes of placed words

    // Shuffle so layout isn't always the same order
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);

    shuffled.forEach((word, i) => {
      const dim = measureWord(word);
      const hw  = dim.w / 2;
      const hh  = dim.h / 2;

      let x, y, attempts = 0;
      let fits = false;

      // Try to find a non-overlapping position
      while (attempts < 200) {
        x = PADDING + hw + Math.random() * (W - hw * 2 - PADDING * 2);
        y = PADDING + hh + Math.random() * (H - hh * 2 - PADDING * 2);

        // Check against already placed words
        let collision = false;
        for (const p of placed) {
          const dx = Math.abs(x - p.x);
          const dy = Math.abs(y - p.y);
          if (dx < (hw + p.hw + 8) && dy < (hh + p.hh + 6)) {
            collision = true;
            break;
          }
        }
        if (!collision) { fits = true; break; }
        attempts++;
      }

      // If we couldn't place without collision after 200 tries, place anyway
      // (better to overlap slightly than to drop words)
      if (!fits) {
        x = PADDING + hw + Math.random() * (W - hw * 2 - PADDING * 2);
        y = PADDING + hh + Math.random() * (H - hh * 2 - PADDING * 2);
      }

      placed.push({ x, y, hw, hh });

      // Pick color — weight-3 words get the richest terracotta
      const colorIdx = word.weight === 3 ? 0
                     : word.weight === 2 ? Math.floor(Math.random() * 2) + 1
                     : Math.floor(Math.random() * 2) + 3;

      particles.push({
        text:    word.text,
        weight:  word.weight,
        size:    FONT_SIZES[word.weight],
        fweight: FONT_WEIGHTS[word.weight],
        color:   COLORS[colorIdx],
        w:       dim.w,
        h:       dim.h,

        // Home position (where it drifts back to)
        hx: x,
        hy: y,

        // Current position
        x,
        y,

        // Velocity
        vx: 0,
        vy: 0,

        // Per-word unique drift phase — so they don't all move in sync
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseSpeedX: 0.6 + Math.random() * 0.8,
        phaseSpeedY: 0.5 + Math.random() * 0.7,

        // Opacity — fades in on init
        opacity: 0,
        targetOpacity: 0.55 + Math.random() * 0.45,
      });
    });
  }

  // ── Animation loop ─────────────────────────────────────────
  let t = 0;

  function loop() {
    ctx.clearRect(0, 0, W, H);
    t++;

    particles.forEach((p, i) => {
      // 1. Autonomous drift — unique sine wave per axis per word
      const driftX = Math.sin(t * DRIFT_SPEED * p.phaseSpeedX + p.phaseX) * DRIFT_AMP;
      const driftY = Math.cos(t * DRIFT_SPEED * p.phaseSpeedY + p.phaseY) * DRIFT_AMP;

      // 2. Return spring — pull toward (home + drift)
      const targetX = p.hx + driftX;
      const targetY = p.hy + driftY;
      p.vx += (targetX - p.x) * RETURN_SPEED;
      p.vy += (targetY - p.y) * RETURN_SPEED;

      // 3. Cursor repel
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < REPEL_RADIUS && mdist > 0.1) {
        const force = (1 - mdist / REPEL_RADIUS) * REPEL_FORCE;
        p.vx += (mdx / mdist) * force;
        p.vy += (mdy / mdist) * force;
      }

      // 4. Peer repulsion — push away from nearby words
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const pdx = p.x - q.x;
        const pdy = p.y - q.y;
        // Elliptical overlap test using half-extents + peer radius
        const minSepX = (p.w + q.w) / 2 + PEER_RADIUS;
        const minSepY = (p.h + q.h) / 2 + PEER_RADIUS / 2;
        const overlapX = minSepX - Math.abs(pdx);
        const overlapY = minSepY - Math.abs(pdy);

        if (overlapX > 0 && overlapY > 0) {
          const pushX = (pdx < 0 ? -1 : 1) * overlapX * PEER_FORCE * 0.012;
          const pushY = (pdy < 0 ? -1 : 1) * overlapY * PEER_FORCE * 0.008;
          p.vx += pushX;
          p.vy += pushY;
          q.vx -= pushX;
          q.vy -= pushY;
        }
      }

      // 5. Damping
      p.vx *= VEL_DAMPING;
      p.vy *= VEL_DAMPING;

      // 6. Integrate
      p.x += p.vx;
      p.y += p.vy;

      // 7. Soft boundary — bounce words back if they leave the canvas
      const hw = p.w / 2 + 8;
      const hh = p.h / 2 + 4;
      if (p.x - hw < 0)  { p.x = hw;     p.vx = Math.abs(p.vx) * 0.4; }
      if (p.x + hw > W)  { p.x = W - hw; p.vx = -Math.abs(p.vx) * 0.4; }
      if (p.y - hh < 0)  { p.y = hh;     p.vy = Math.abs(p.vy) * 0.4; }
      if (p.y + hh > H)  { p.y = H - hh; p.vy = -Math.abs(p.vy) * 0.4; }

      // 8. Fade in on first frames
      if (p.opacity < p.targetOpacity) {
        p.opacity = Math.min(p.targetOpacity, p.opacity + 0.008);
      }

      // 9. Draw
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.fweight} ${p.size}px ${FONT_FAMILY}`;
      ctx.fillStyle = p.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.text, p.x, p.y);
      ctx.restore();
    });

    animId = requestAnimationFrame(loop);
  }

  // ── Boot ───────────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
/* ============================================================
   CONFIG — Edit everything in here to make it yours.
   This is the only file you need to touch for content.
   ============================================================ */
const CONFIG = {
  // TODO: Replace with your real info
  name: "Mj Despi",
  email: "despi091402@gmail.com",
  githubUrl: "https://github.com/mjdsp",
  linkedinUrl: "https://www.linkedin.com/in/mj-despi-37a28a386/",
  number: "+63 929 492 0224",

  // TODO: Replace with your roles
  roles: [
    "Full-Stack Developer",
    "Backend Developer",
    "UI/UX Designer",
    "Manual QA Tester",
    "AI Automation Specialist",
  ],

  // TODO: Replace with your real projects
  projects: [
    {
  title: "Quizmetrix — Web-Based Learning & Assessment Platform",
  description:
    "A web-based study platform that helps students create, organize, and review learning materials through flashcards, quizzes, mock examinations, and AI-assisted study tools.",
  tags: ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "Bootstrap","AI Integration", "Hostinger"],
},
{
  title: "UniShop — Campus Uniform Mobile App",
  description:
    "A mobile commerce application that allows students to browse available school uniforms, check stock availability, and pre-order items conveniently through their smartphones.",
  tags: ["Android Studio", "XML", "Java", "UI/UX", "Mobile Development"],
},
{   
  title: "ChronoSync — Room & Time Management System",
  description:
    "A web-based scheduling and facility management system designed to streamline room reservations, schedule coordination, and resource allocation within an organization.",
  tags: ["HTML", "CSS", "JavaScript", "UI/UX"],
},
    {
  title: "DocuFlow AI — Intelligent Document Processing Platform",
  description:
    "An AI-powered workflow automation platform that extracts, validates, categorizes, and stores information from uploaded documents. The system automates data entry, document analysis, and reporting through integrated workflows and AI-assisted processing.",
  tags: ["n8n", "OpenAI", "Google Sheets", "Webhooks", "Hostinger"],
},
  ],

  // TODO: Replace with your skills — x/y are % positions on the SVG (0-100)
  // size: 1 = small star, 2 = medium, 3 = large (represents skill depth)
  skillClusters: [
    {
      id: "fullstack",
      label: "Full-Stack",
      color: "#C17A54",
      stars: [
        { name: "HTML/CSS",       size: 3, x: 14, y: 28 },
        { name: "JavaScript",  size: 2, x: 22, y: 16 },
        { name: "PHP",     size: 3, x: 30, y: 26 },
        { name: "SQL",        size: 3, x: 9,  y: 42 },
        { name: "Bootstrap",    size: 2, x: 20, y: 50 },
      ],
    },
    {
      id: "backend",
      label: "Backend",
      color: "#E8C5A0",
      stars: [
        { name: "PHP",     size: 3, x: 50, y: 20 },
        { name: "PostgreSQL",      size: 3, x: 60, y: 11 },
        { name: "MySQL",  size: 2, x: 68, y: 24 },
        { name: "Docker",       size: 2, x: 55, y: 34 },
        { name: "Postman",      size: 2, x: 44, y: 36 },
      ],
    },
    {
      id: "uiux",
      label: "UI/UX",
      color: "#D4956A",
      stars: [
        { name: "Figma",          size: 3, x: 25, y: 68 },
        { name: "Motion Design",  size: 2, x: 14, y: 79 },
        { name: "Design Systems", size: 2, x: 33, y: 76 },
        { name: "Accessibility",  size: 1, x: 20, y: 88 },
      ],
    },
    {
      id: "qa",
      label: "QA",
      color: "#B5895C",
      stars: [
        { name: "Manual Testing", size: 3, x: 54, y: 63 },
        { name: "Bug Reporting",  size: 2, x: 64, y: 72 },
        { name: "Test Cases",     size: 2, x: 49, y: 75 },
        { name: "UAT",            size: 1, x: 59, y: 81 },
      ],
    },
    {
      id: "ai",
      label: "AI / Automation",
      color: "#F0D9C0",
      stars: [
        { name: "n8n", size: 3, x: 80, y: 55 },
        { name: "Prompt Eng.",     size: 2, x: 88, y: 44 },
        { name: "Zapier",    size: 2, x: 82, y: 68 },
        { name: "AI Agents",       size: 2, x: 73, y: 62 },
      ],
    },
  ],
};

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    bar.style.width = ((scrolled / maxScroll) * 100) + "%";
  }, { passive: true });
}

/* ============================================================
   CUSTOM CURSOR (lerp = smooth follow lag)
   ============================================================ */
function initCursor() {
  const dot  = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");

  // On mobile/touch there's no cursor — bail out
  if (window.matchMedia("(pointer: coarse)").matches) {
    dot.style.display = "none";
    ring.style.display = "none";
    document.body.style.cursor = "auto";
    return;
  }

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // Animation loop: dot snaps, ring lags behind with lerp
  function animate() {
    // Dot follows exactly
    dot.style.left = mouseX + "px";
    dot.style.top  = mouseY + "px";

    // Ring lerps toward mouse (0.12 = how fast it catches up — lower is laggier)
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top  = ringY + "px";

    requestAnimationFrame(animate);
  }
  animate();

  // Expand ring when hovering interactive elements
  const onEnter = () => { dot.classList.add("hovering");  ring.classList.add("hovering"); };
  const onLeave = () => { dot.classList.remove("hovering"); ring.classList.remove("hovering"); };

  function bindHoverables() {
    document.querySelectorAll("a, button, .project-card, .star-group").forEach((el) => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
  }
  bindHoverables();

  // Re-bind after dynamic content renders
  const obs = new MutationObserver(bindHoverables);
  obs.observe(document.body, { childList: true, subtree: true });
}

/* ============================================================
   NAVBAR — scroll state + active section + mobile drawer
   ============================================================ */
function initNavbar() {
  const navbar   = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const drawer   = document.getElementById("drawer");
  const overlay  = document.getElementById("drawer-overlay");
  const navLinks = document.querySelectorAll(".nav-link");

  // Scroll → add scrolled class
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });

  // Hamburger toggle
  function toggleMenu(open) {
    hamburger.classList.toggle("open", open);
    drawer.classList.toggle("open", open);
    overlay.classList.toggle("visible", open);
  }
  hamburger.addEventListener("click", () => toggleMenu(!drawer.classList.contains("open")));
  overlay.addEventListener("click", () => toggleMenu(false));
  document.querySelectorAll(".drawer-link").forEach((l) => {
    l.addEventListener("click", () => toggleMenu(false));
  });

  // Active section highlighting via Intersection Observer
  const sections = document.querySelectorAll("section[id]");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => {
          l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });

  sections.forEach((s) => sectionObserver.observe(s));
}

/* ============================================================
   SCROLL REVEAL — Intersection Observer fades elements in
   ============================================================ */
function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => observer.observe(el));
}

/* ============================================================
   HERO CANVAS — animated grain + ambient warm circle
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");
  let t = 0;
  let animId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Slowly drifting warm radial glow
    const cx = w * 0.72 + Math.sin(t * 0.0007) * 45;
    const cy = h * 0.40 + Math.cos(t * 0.0005) * 32;
    const r  = Math.min(w, h) * 0.4;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0,   "rgba(193, 122, 84, 0.12)");
    grad.addColorStop(0.5, "rgba(212, 149, 106, 0.06)");
    grad.addColorStop(1,   "rgba(245, 240, 232, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Grain noise (subtle — runs every frame so it looks alive)
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 16;
      data[i]     = 200 + noise;
      data[i + 1] = 185 + noise;
      data[i + 2] = 160 + noise;
      data[i + 3] = 10; // very low alpha — just a texture hint
    }
    ctx.putImageData(imageData, 0, 0);

    t++;
    animId = requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   ABOUT — render role badges from CONFIG
   ============================================================ */
function initAbout() {
  const container = document.getElementById("roles-container");
  CONFIG.roles.forEach((role) => {
    const badge = document.createElement("span");
    badge.className = "role-badge";
    badge.textContent = role;
    container.appendChild(badge);
  });
}

/* ============================================================
   SKILLS CONSTELLATION — SVG star map
   ============================================================ */
function initConstellation() {
  const svg     = document.getElementById("constellation");
  const legend  = document.getElementById("skills-legend");
  const tooltip = document.getElementById("skill-tooltip");
  const NS      = "http://www.w3.org/2000/svg";

  const VW = 1000; // SVG viewBox width
  const VH = 600;  // SVG viewBox height

  // Star radius by size tier
  const R = { 1: 4, 2: 6.5, 3: 10 };

  // Build legend
  CONFIG.skillClusters.forEach((cluster) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `<span class="legend-dot" style="background:${cluster.color}"></span>${cluster.label}`;
    legend.appendChild(item);
  });

  // Draw connection lines first (they go underneath stars)
  CONFIG.skillClusters.forEach((cluster) => {
    for (let i = 0; i < cluster.stars.length - 1; i++) {
      const a = cluster.stars[i];
      const b = cluster.stars[i + 1];
      const line = document.createElementNS(NS, "line");
      line.setAttribute("x1", (a.x / 100) * VW);
      line.setAttribute("y1", (a.y / 100) * VH);
      line.setAttribute("x2", (b.x / 100) * VW);
      line.setAttribute("y2", (b.y / 100) * VH);
      line.setAttribute("stroke", cluster.color);
      line.setAttribute("stroke-width", "1.2");
      line.setAttribute("stroke-opacity", "0.2");
      line.setAttribute("stroke-dasharray", "4 4");
      line.classList.add("skill-connection");
      svg.appendChild(line);
    }
  });

  // Draw cluster labels
  CONFIG.skillClusters.forEach((cluster) => {
    const avgX = cluster.stars.reduce((s, st) => s + st.x, 0) / cluster.stars.length;
    const minY = Math.min(...cluster.stars.map((s) => s.y));
    const text = document.createElementNS(NS, "text");
    text.setAttribute("x", (avgX / 100) * VW);
    text.setAttribute("y", ((minY / 100) * VH) - 16);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "9");
    text.setAttribute("font-family", "DM Sans, sans-serif");
    text.setAttribute("fill", cluster.color);
    text.setAttribute("opacity", "0.55");
    text.setAttribute("letter-spacing", "2");
    text.textContent = cluster.label.toUpperCase();
    svg.appendChild(text);
  });

  // Draw stars
  let starIndex = 0;
  CONFIG.skillClusters.forEach((cluster) => {
    cluster.stars.forEach((star) => {
      const cx = (star.x / 100) * VW;
      const cy = (star.y / 100) * VH;
      const r  = R[star.size];

      const g = document.createElementNS(NS, "g");
      g.classList.add("star-group");
      g.style.animationDelay = (starIndex * 80) + "ms";
      g.style.cursor = "pointer";

      // Halo
      const halo = document.createElementNS(NS, "circle");
      halo.setAttribute("cx", cx);
      halo.setAttribute("cy", cy);
      halo.setAttribute("r",  r * 2.2);
      halo.setAttribute("fill", cluster.color);
      halo.classList.add("star-halo");
      g.appendChild(halo);

      // Star body
      const circle = document.createElementNS(NS, "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r",  r);
      circle.setAttribute("fill", cluster.color);
      circle.setAttribute("opacity", "0.9");
      circle.classList.add("star-circle");
      circle.style.animationDelay = (starIndex * 280 + Math.random() * 800) + "ms";
      g.appendChild(circle);

      // Tooltip interaction
      g.addEventListener("mouseenter", (e) => {
        const rect    = svg.getBoundingClientRect();
        const scaleX  = rect.width  / VW;
        const scaleY  = rect.height / VH;
        const tipX    = (cx * scaleX / rect.width)  * 100;
        const tipY    = (cy * scaleY / rect.height) * 100;
        tooltip.textContent = star.name;
        tooltip.style.left  = tipX + "%";
        tooltip.style.top   = tipY + "%";
        tooltip.classList.add("visible");
      });
      g.addEventListener("mouseleave", () => {
        tooltip.classList.remove("visible");
      });

      svg.appendChild(g);
      starIndex++;
    });
  });

  // Animate stars in when section scrolls into view
  const section = document.getElementById("skills");
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll(".star-group").forEach((g, i) => {
        setTimeout(() => g.classList.add("visible"), i * 60);
      });
      observer.disconnect();
    }
  }, { threshold: 0.2 });
  observer.observe(section);
}

/* ============================================================
   PROJECTS — render cards from CONFIG
   ============================================================ */
function initProjects() {
  const grid = document.getElementById("projects-grid");

  CONFIG.projects.forEach((project, i) => {
    const card = document.createElement("article");
    card.className = "project-card reveal reveal-delay-" + ((i % 3) + 1);

    card.innerHTML = `
      <div class="card-number">${String(i + 1).padStart(2, "0")}</div>
      <div>
        <h3 class="card-title">${project.title}</h3>
      </div>
      <p class="card-desc">${project.description}</p>
      <div class="card-tags">
        ${project.tags.map((t) => `<span class="card-tag">${t}</span>`).join("")}
      </div>
    `;

    grid.appendChild(card);
  });

  // Re-run reveal observer so dynamically added cards get observed
  initReveal();
}

/* ============================================================
   CONTACT — render links from CONFIG
   ============================================================ */
function initContact() {
  // Set copyright year
  document.getElementById("year").textContent = new Date().getFullYear();

  const links = [
    {
      label: "Email",
      value: CONFIG.email,
      href: `mailto:${CONFIG.email}`,
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
               <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
               <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
             </svg>`,
    },
    {
      label: "GitHub",
      value: CONFIG.githubUrl.replace("https://", ""),
      href: CONFIG.githubUrl,
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
               <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
             </svg>`,
    },
    {
      label: "LinkedIn",
      value: "Mj Despi",
      href: CONFIG.linkedinUrl,
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
               <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
               <rect x="2" y="9" width="4" height="12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
               <circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="1.4"/>
             </svg>`,
    },
        {
      label: "Mobile Number",
      value: CONFIG.number,
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
               <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>`,
    },
  ];

  const container = document.getElementById("contact-links");
  links.forEach((link, i) => {
    const el = link.href ? document.createElement("a") : document.createElement("div");
    el.className = `contact-link reveal reveal-delay-${i + 2}`;
    if (link.href) {
      el.href   = link.href;
      el.target = link.href.startsWith("mailto") ? "_self" : "_blank";
      el.rel    = "noopener noreferrer";
    }
    el.innerHTML = `
      <span class="link-icon">${link.icon}</span>
      <div class="link-text">
        <span class="link-label">${link.label}</span>
        <span class="link-value">${link.value}</span>
      </div>
      <span class="link-arrow">→</span>
    `;
    container.appendChild(el);
  });
}

/* ============================================================
   KONAMI CODE EASTER EGG
   ↑ ↑ ↓ ↓ ← → ← → B A
   ============================================================ */
function initKonami() {
  const sequence = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a",
  ];
  let progress = 0;

  const egg   = document.getElementById("easter-egg");
  const close = document.getElementById("easter-egg-close");

  document.addEventListener("keydown", (e) => {
    if (e.key === sequence[progress]) {
      progress++;
      if (progress === sequence.length) {
        egg.classList.add("visible");
        progress = 0;
      }
    } else {
      progress = 0;
      // Check if first key restarts the sequence
      if (e.key === sequence[0]) progress = 1;
    }
  });

  close.addEventListener("click", () => egg.classList.remove("visible"));

  // Also close on click outside the box
  egg.addEventListener("click", (e) => {
    if (e.target === egg) egg.classList.remove("visible");
  });
}

/* ============================================================
   BOOT — run everything
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initScrollProgress();
  initCursor();
  initNavbar();
  initHeroCanvas();
  initAbout();
  initConstellation();
  initProjects();
  initContact();
  initReveal();   // run after projects/contact render their dynamic elements
  initKonami();
});
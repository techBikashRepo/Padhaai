/* =====================================================
   ARCHITECT ACADEMY — Guided Tour & Help Manual Engine
   tour.js
   ===================================================== */

window.ArchTour = (function () {
  "use strict";

  /* ── Tour Steps ─────────────────────────────────── */
  const TOUR_STEPS = [
    {
      target: ".welcome-hero",
      position: "bottom",
      icon: "🏛️",
      title: "Welcome to Architect Academy",
      desc: "Your complete <strong>system design learning platform</strong> — covering networking fundamentals all the way to real-world architecture patterns used at top tech companies.",
      tip: "You can restart this tour anytime from the ❓ Help button.",
    },
    {
      target: "#sidebar",
      position: "right",
      icon: "📚",
      title: "Sidebar Navigation",
      desc: "Browse <strong>12 learning modules</strong> covering everything from networking to distributed systems. Click any part to expand its topics.",
      tip: "On mobile, tap the ☰ button in the top bar to open the sidebar.",
    },
    {
      target: ".sidebar-search",
      position: "right",
      icon: "🔍",
      title: "Smart Search",
      desc: "Search across all <strong>120+ topics</strong> instantly. Press <code>/</code> anywhere on the page to focus the search bar.",
      tip: "Press Escape to clear the search.",
    },
    {
      target: ".sidebar-progress",
      position: "right",
      icon: "📊",
      title: "Progress Tracking",
      desc: "Track your learning journey. The progress bar and count update every time you mark a topic complete.",
    },
    {
      target: "#sidebarNav .nav-part-header",
      position: "right",
      icon: "📂",
      title: "Expandable Modules",
      desc: "Click any module header to expand or collapse its topics. Topics you've completed show a <strong>green checkmark ✓</strong>.",
    },
    {
      target: "#diagramsBtn",
      position: "bottom",
      icon: "🗂️",
      title: "Architecture Diagrams",
      desc: "Open the <strong>Diagrams screen</strong> to explore animated architecture flows, interactive component diagrams, and famous company architectures (Netflix, Uber, Twitter…).",
    },
    {
      target: "#labsBtn",
      position: "bottom",
      icon: "⚗️",
      title: "Architecture Labs",
      desc: "Access the <strong>interactive labs</strong> — an architecture simulator, system design case studies, and a pattern explorer with real-world tradeoff analysis.",
    },
    {
      target: "#topThemeToggle",
      position: "bottom",
      icon: "🌙",
      title: "Theme Toggle",
      desc: "Switch between <strong>dark mode</strong> (default) and <strong>light mode</strong>. Your preference is saved automatically.",
    },
    {
      target: ".welcome-parts",
      position: "top",
      icon: "🗺️",
      title: "Learning Roadmap",
      desc: "The 12 module cards show your topic counts and progress. <strong>Click any card</strong> to jump directly to the first topic in that module.",
      tip: "Cards show how many topics are in each module.",
    },
    {
      target: "#helpBtn",
      position: "bottom",
      icon: "❓",
      title: "Help & User Guide",
      desc: "This <strong>Help screen</strong> contains the full user manual with feature walkthroughs, keyboard shortcuts, and tips. You're viewing it right now!",
      tip: "Bookmark this app — deep links work! Share #topic-id URLs.",
    },
  ];

  /* ── State ─────────────────────────────────────── */
  let currentStep = 0;
  let active = false;
  let frameDivs = {};
  let tooltipEl = null;
  let ringEl = null;
  let raf = null;

  /* ── Utilities ──────────────────────────────────── */
  function q(sel) {
    return document.querySelector(sel);
  }
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* ── Spotlight ───────────────────────────────────── */
  function buildFrames() {
    ["top", "right", "bottom", "left"].forEach((side) => {
      const d = el("div", `tour-frame tour-frame-${side}`);
      document.body.appendChild(d);
      frameDivs[side] = d;
    });
    ringEl = el("div", "tour-spotlight-ring");
    document.body.appendChild(ringEl);
  }

  function positionSpotlight(target) {
    const PAD = 8;
    let rect;
    if (target === "center" || !target) {
      const W = window.innerWidth,
        H = window.innerHeight;
      rect = {
        top: H * 0.3,
        left: W * 0.2,
        bottom: H * 0.7,
        right: W * 0.8,
        width: W * 0.6,
        height: H * 0.4,
      };
    } else {
      const node = typeof target === "string" ? q(target) : target;
      if (!node) return;
      const r = node.getBoundingClientRect();
      rect = {
        top: r.top - PAD,
        left: r.left - PAD,
        bottom: r.bottom + PAD,
        right: r.right + PAD,
        width: r.width + PAD * 2,
        height: r.height + PAD * 2,
      };
    }
    const T = rect.top,
      L = rect.left,
      B = rect.bottom,
      R = rect.right;
    const W = window.innerWidth,
      H = window.innerHeight;
    frameDivs.top.style.cssText = `top:0;left:0;right:0;height:${T}px`;
    frameDivs.bottom.style.cssText = `bottom:0;left:0;right:0;top:${B}px`;
    frameDivs.left.style.cssText = `top:${T}px;left:0;width:${L}px;height:${B - T}px`;
    frameDivs.right.style.cssText = `top:${T}px;left:${R}px;right:0;height:${B - T}px`;
    ringEl.style.cssText = `top:${T}px;left:${L}px;width:${rect.width}px;height:${rect.height}px;`;
  }

  function positionTooltip(step) {
    if (!tooltipEl) return;
    const target = step.target;
    const pos = step.position || "bottom";
    const PAD = 18;
    const TW = tooltipEl.offsetWidth || 360;
    const TH = tooltipEl.offsetHeight || 220;
    const W = window.innerWidth,
      H = window.innerHeight;
    let x, y;

    if (!target || target === "center") {
      x = (W - TW) / 2;
      y = (H - TH) / 2;
    } else {
      const node = q(target);
      if (!node) {
        x = (W - TW) / 2;
        y = (H - TH) / 2;
      } else {
        const r = node.getBoundingClientRect();
        if (pos === "right") {
          x = r.right + PAD;
          y = r.top;
        }
        if (pos === "left") {
          x = r.left - TW - PAD;
          y = r.top;
        }
        if (pos === "bottom") {
          x = r.left;
          y = r.bottom + PAD;
        }
        if (pos === "top") {
          x = r.left;
          y = r.top - TH - PAD;
        }
        // clamp to viewport
        x = Math.max(PAD, Math.min(x, W - TW - PAD));
        y = Math.max(PAD, Math.min(y, H - TH - PAD));
      }
    }
    tooltipEl.style.left = x + "px";
    tooltipEl.style.top = y + "px";
  }

  /* ── Tooltip ─────────────────────────────────────── */
  function buildTooltip(step, idx, total) {
    if (tooltipEl) tooltipEl.remove();
    tooltipEl = el("div", "tour-tooltip");
    const dots = Array.from(
      { length: total },
      (_, i) =>
        `<button class="tour-dot ${i < idx ? "done" : ""} ${i === idx ? "active" : ""}" data-goto="${i}" aria-label="Go to step ${i + 1}"></button>`,
    ).join("");
    tooltipEl.innerHTML = `
      <div class="tour-tooltip-header">
        <div class="tour-tooltip-icon">${step.icon || "🎯"}</div>
        <div class="tour-tooltip-meta">
          <div class="tour-tooltip-step">Step ${idx + 1} of ${total}</div>
          <div class="tour-tooltip-title">${step.title}</div>
        </div>
      </div>
      <div class="tour-tooltip-body">
        <div class="tour-tooltip-desc">${step.desc}${step.tip ? `<div class="tour-tip-badge">💡 ${step.tip}</div>` : ""}</div>
      </div>
      <div class="tour-tooltip-footer">
        <div class="tour-dots">${dots}</div>
        ${idx > 0 ? `<button class="tour-btn" id="tourPrev">← Prev</button>` : ""}
        ${
          idx < total - 1
            ? `<button class="tour-btn tour-btn-primary" id="tourNext">Next →</button>`
            : `<button class="tour-btn tour-btn-primary" id="tourFinish">🎉 Finish</button>`
        }
        <button class="tour-btn tour-btn-skip" id="tourExit">Exit</button>
      </div>
    `;
    document.body.appendChild(tooltipEl);
    tooltipEl.querySelector("#tourExit").addEventListener("click", exit);
    const prevBtn = tooltipEl.querySelector("#tourPrev");
    if (prevBtn) prevBtn.addEventListener("click", prev);
    const nextBtn = tooltipEl.querySelector("#tourNext");
    if (nextBtn) nextBtn.addEventListener("click", next);
    const finBtn = tooltipEl.querySelector("#tourFinish");
    if (finBtn) finBtn.addEventListener("click", finish);
    tooltipEl.querySelectorAll(".tour-dot").forEach((dot) => {
      dot.addEventListener("click", () => goTo(parseInt(dot.dataset.goto)));
    });
    positionTooltip(step);
  }

  /* ── Step Render ─────────────────────────────────── */
  function renderStep(idx) {
    const step = TOUR_STEPS[idx];
    if (!step) return;
    // Scroll target into view
    const node = step.target ? q(step.target) : null;
    if (node) {
      node.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      setTimeout(() => {
        positionSpotlight(step.target);
        buildTooltip(step, idx, TOUR_STEPS.length);
      }, 340);
    } else {
      positionSpotlight(null);
      buildTooltip(step, idx, TOUR_STEPS.length);
    }
  }

  /* ── Navigation ──────────────────────────────────── */
  function next() {
    if (currentStep < TOUR_STEPS.length - 1) goTo(currentStep + 1);
  }
  function prev() {
    if (currentStep > 0) goTo(currentStep - 1);
  }
  function goTo(n) {
    currentStep = Math.max(0, Math.min(n, TOUR_STEPS.length - 1));
    renderStep(currentStep);
  }

  function finish() {
    cleanup();
    localStorage.setItem("aa-tour-done", "1");
    showFinishCard();
  }

  function exit() {
    cleanup();
    localStorage.setItem("aa-tour-done", "1");
  }

  function cleanup() {
    active = false;
    if (raf) cancelAnimationFrame(raf);
    Object.values(frameDivs).forEach((d) => d.remove());
    frameDivs = {};
    if (ringEl) {
      ringEl.remove();
      ringEl = null;
    }
    if (tooltipEl) {
      tooltipEl.remove();
      tooltipEl = null;
    }
    document.documentElement.classList.remove("tour-active");
    document.removeEventListener("keydown", tourKeyHandler);
  }

  function tourKeyHandler(e) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next();
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      prev();
    }
    if (e.key === "Escape") exit();
  }

  /* ── Welcome Card ───────────────────────────────── */
  function showWelcomeCard() {
    const card = el("div", "tour-welcome-card");
    card.innerHTML = `
      <div class="tour-welcome-inner">
        <div class="tour-welcome-hero">
          <span class="tour-welcome-emoji">🏛️</span>
          <h2>Welcome to Architect Academy</h2>
          <p>Let's take a quick tour of all the features — it'll take less than 2 minutes!</p>
        </div>
        <div class="tour-welcome-features">
          <div class="tour-welcome-feat"><div class="tour-welcome-feat-icon">📚</div><div class="tour-welcome-feat-text"><strong>12 Modules</strong>Networking to real-world design</div></div>
          <div class="tour-welcome-feat"><div class="tour-welcome-feat-icon">🗂️</div><div class="tour-welcome-feat-text"><strong>Diagrams</strong>Animated architecture flows</div></div>
          <div class="tour-welcome-feat"><div class="tour-welcome-feat-icon">⚗️</div><div class="tour-welcome-feat-text"><strong>Labs</strong>Interactive simulators</div></div>
          <div class="tour-welcome-feat"><div class="tour-welcome-feat-icon">📊</div><div class="tour-welcome-feat-text"><strong>Progress</strong>Track every topic</div></div>
        </div>
        <div class="tour-welcome-actions">
          <button class="tour-btn tour-btn-primary" id="twStart">🚀 Start Tour</button>
          <button class="tour-btn" id="twSkip">Maybe Later</button>
        </div>
      </div>
    `;
    document.body.appendChild(card);
    card.querySelector("#twStart").addEventListener("click", () => {
      card.remove();
      beginTour();
    });
    card.querySelector("#twSkip").addEventListener("click", () => {
      card.remove();
      localStorage.setItem("aa-tour-done", "1");
    });
    card.addEventListener("click", (e) => {
      if (e.target === card) {
        card.remove();
        localStorage.setItem("aa-tour-done", "1");
      }
    });
  }

  function showFinishCard() {
    const card = el("div", "tour-complete-card");
    card.innerHTML = `
      <div class="tour-complete-inner">
        <span class="tour-complete-emoji">🎉</span>
        <h2>You're all set!</h2>
        <p>You've seen all the features. Start exploring the <strong>12 learning modules</strong>,
           dive into <strong>Architecture Diagrams</strong>, or try the <strong>Labs</strong>!</p>
        <div class="tour-complete-actions">
          <button class="tour-btn tour-btn-primary" id="tcStart">Start Learning</button>
          <button class="tour-btn" id="tcHelp">Open Help</button>
        </div>
      </div>
    `;
    document.body.appendChild(card);
    card.querySelector("#tcStart").addEventListener("click", () => {
      card.remove();
    });
    card.querySelector("#tcHelp").addEventListener("click", () => {
      card.remove();
      if (window.showHelp) showHelp();
    });
  }

  function beginTour() {
    active = true;
    currentStep = 0;
    document.documentElement.classList.add("tour-active");
    buildFrames();
    document.addEventListener("keydown", tourKeyHandler);

    // Make sure we're on welcome screen
    if (window.showWelcome) showWelcome();
    setTimeout(() => renderStep(0), 300);
  }

  function start() {
    showWelcomeCard();
  }

  /* ═══════════════════════════════════════════════════
     HELP MANUAL RENDERER
  ═══════════════════════════════════════════════════ */
  function renderHelp(container) {
    container.innerHTML = buildHelpHTML();
    // Bind nav tabs
    container.querySelectorAll(".help-nav-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sec = btn.dataset.sec;
        container
          .querySelectorAll(".help-nav-item")
          .forEach((b) => b.classList.remove("active"));
        container
          .querySelectorAll(".help-section")
          .forEach((s) => s.classList.remove("active"));
        btn.classList.add("active");
        const section = container.querySelector(`#help-sec-${sec}`);
        if (section) section.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
    // Bind "Start Tour" button
    const tourBtn = container.querySelector("#helpStartTourBtn");
    if (tourBtn)
      tourBtn.addEventListener("click", () => {
        // Hide help and start tour
        const hs = document.getElementById("helpScreen");
        if (hs) hs.classList.add("hidden");
        if (window.showWelcome) window.showWelcome();
        setTimeout(() => start(), 200);
      });
    // show first section
    const first = container.querySelector(".help-section");
    if (first) first.classList.add("active");
    const firstNav = container.querySelector(".help-nav-item");
    if (firstNav) firstNav.classList.add("active");
  }

  function buildHelpHTML() {
    return `
<!-- ── Help Header ── -->
<div class="help-header">
  <span class="help-header-icon">❓</span>
  <h1>Help &amp; User Guide</h1>
  <p>Everything you need to know about Architect Academy — your complete system design learning platform.</p>
  <button class="help-start-tour-btn" id="helpStartTourBtn">▶ Start Interactive Tour</button>
</div>

<!-- ── Nav Tabs ── -->
<nav class="help-nav">
  <button class="help-nav-item" data-sec="quickstart">🚀 Quick Start</button>
  <button class="help-nav-item" data-sec="navigation">📚 Navigation</button>
  <button class="help-nav-item" data-sec="topics">📖 Topic View</button>
  <button class="help-nav-item" data-sec="quiz">🧠 Quiz</button>
  <button class="help-nav-item" data-sec="diagrams">🗂️ Diagrams</button>
  <button class="help-nav-item" data-sec="labs">⚗️ Labs</button>
  <button class="help-nav-item" data-sec="search">🔍 Search</button>
  <button class="help-nav-item" data-sec="progress">📊 Progress</button>
  <button class="help-nav-item" data-sec="shortcuts">⌨️ Shortcuts</button>
</nav>

<div class="help-body">

<!-- ══════════════════════════════════════
     SECTION 1 — Quick Start
══════════════════════════════════════ -->
<div class="help-section" id="help-sec-quickstart">
  <div class="help-section-title"><span>🚀</span> Quick Start — Be up in 30 seconds</div>
  <p class="help-section-sub">New here? This gets you exploring in under a minute.</p>

  <div class="help-steps">
    <div class="help-step"><div class="help-step-num">1</div><div class="help-step-text"><strong>Pick a module</strong> — Scroll the Welcome screen and click any of the 12 module cards, or expand a part in the left sidebar.</div></div>
    <div class="help-step"><div class="help-step-num">2</div><div class="help-step-text"><strong>Read a topic</strong> — Click a topic name. Each topic has expandable section cards. Click any card header to expand its content.</div></div>
    <div class="help-step"><div class="help-step-num">3</div><div class="help-step-text"><strong>Mark it done</strong> — Hit the <strong>✓ Mark Complete</strong> button at the bottom of the topic. Watch your progress bar grow!</div></div>
    <div class="help-step"><div class="help-step-num">4</div><div class="help-step-text"><strong>Test yourself</strong> — Click the <strong>🧠 Take Quiz</strong> button on any module card to answer 8 questions on that part. Your best score is saved!</div></div>
    <div class="help-step"><div class="help-step-num">5</div><div class="help-step-text"><strong>Explore diagrams</strong> — Click the 🗂️ button in the top bar to see animated architecture flows and company designs.</div></div>
    <div class="help-step"><div class="help-step-num">6</div><div class="help-step-text"><strong>Try the labs</strong> — Click ⚗️ for hands-on interactive simulators and case studies.</div></div>
  </div>

  <div class="help-callout info">
    <div class="help-callout-icon">💡</div>
    <p><strong>Pro Tip:</strong> Press <code>/</code> anywhere on the page to instantly focus the search bar and find any topic by name.</p>
  </div>

  <div class="help-divider"></div>

  <div class="help-feature-block">
    <div class="help-feature-label">📋 What's Inside</div>
    <div class="help-feature-h">12 Modules · 120+ Topics · Full System Design Coverage</div>
    <table class="help-parts-table">
      <tr><th>#</th><th>Module</th><th>What you'll learn</th></tr>
      <tr><td><span class="part-emoji">🌐</span></td><td><strong>Part 1</strong></td><td>Networking Fundamentals</td></tr>
      <tr><td><span class="part-emoji">🔌</span></td><td><strong>Part 2</strong></td><td>Backend APIs</td></tr>
      <tr><td><span class="part-emoji">🔐</span></td><td><strong>Part 3</strong></td><td>Security &amp; Auth</td></tr>
      <tr><td><span class="part-emoji">🗄️</span></td><td><strong>Part 4</strong></td><td>Databases &amp; SQL</td></tr>
      <tr><td><span class="part-emoji">🏛️</span></td><td><strong>Part 5</strong></td><td>Architecture Patterns</td></tr>
      <tr><td><span class="part-emoji">📈</span></td><td><strong>Part 6</strong></td><td>Scalability</td></tr>
      <tr><td><span class="part-emoji">⚡</span></td><td><strong>Part 7</strong></td><td>Caching</td></tr>
      <tr><td><span class="part-emoji">📨</span></td><td><strong>Part 8</strong></td><td>Async &amp; Distributed Patterns</td></tr>
      <tr><td><span class="part-emoji">☁️</span></td><td><strong>Part 9</strong></td><td>Cloud &amp; AWS</td></tr>
      <tr><td><span class="part-emoji">🐳</span></td><td><strong>Part 10</strong></td><td>Containers &amp; Docker</td></tr>
      <tr><td><span class="part-emoji">🔧</span></td><td><strong>Part 11</strong></td><td>Production Engineering</td></tr>
      <tr><td><span class="part-emoji">🎯</span></td><td><strong>Part 12</strong></td><td>Career Readiness</td></tr>
    </table>
  </div>
</div>

<!-- ══════════════════════════════════════
     SECTION 2 — Navigation & Sidebar
══════════════════════════════════════ -->
<div class="help-section" id="help-sec-navigation">
  <div class="help-section-title"><span>📚</span> Navigation &amp; Sidebar</div>
  <p class="help-section-sub">How to move around the platform and use the sidebar effectively.</p>

  <!-- Sidebar mockup -->
  <div class="help-mockup">
    <div class="help-mockup-label">Sidebar Preview</div>
    <div class="mock-sidebar">
      <div class="mock-sidebar-panel">
        <div class="mock-sidebar-header">
          <div class="mock-brand-dot">🏛️</div>
          <div class="mock-brand-text">Architect Academy</div>
        </div>
        <div class="mock-search-bar">🔍 <span>Search topics…</span></div>
        <div class="mock-progress-bar">
          <div class="mock-pb-label"><span>Progress</span><span>5/12</span></div>
          <div class="mock-pb-track"><div class="mock-pb-fill" style="width:42%"></div></div>
        </div>
        <div class="mock-nav-part active"><span class="mock-icon">🌐</span> Part 1 · Networking</div>
        <div class="mock-topic-item active">✓ OSI Model</div>
        <div class="mock-topic-item done">DNS Resolution</div>
        <div class="mock-topic-item">TCP vs UDP</div>
        <div class="mock-nav-part"><span class="mock-icon">🏗️</span> Part 2 · System Design</div>
        <div class="mock-nav-part"><span class="mock-icon">💾</span> Part 3 · Databases</div>
      </div>
      <div class="mock-topic-area">
        <div class="mock-topbar">
          <div style="font-size:13px">☰</div>
          <div class="mock-topbar-crumb">Part 1 › OSI Model</div>
          <div class="mock-topbar-btn">🗂️</div>
          <div class="mock-topbar-btn">⚗️</div>
          <div class="mock-topbar-btn">🌙</div>
        </div>
        <div class="mock-topic-header">
          <div class="mock-badge">Part 1 · Networking</div>
          <div class="mock-topic-title">OSI Model</div>
          <div class="mock-topic-sub">The 7-layer framework explained</div>
        </div>
      </div>
    </div>
  </div>

  <div class="help-tips-grid">
    <div class="help-tip-card"><div class="help-tip-icon">☰</div><div class="help-tip-text"><strong>Hamburger Menu</strong>On mobile, tap ☰ in the top-left to open the sidebar. Tap outside or the ✕ button to close.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">🏛️</div><div class="help-tip-text"><strong>Brand Logo</strong>Click the "Architect Academy" brand name in the sidebar to return to the Welcome screen from anywhere.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">📂</div><div class="help-tip-text"><strong>Expand Modules</strong>Click any part header to expand it and see all its topics. Click again to collapse.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">✓</div><div class="help-tip-text"><strong>Completed Topics</strong>Topics you've marked complete show a green ✓ checkmark in the sidebar for easy tracking.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">🔗</div><div class="help-tip-text"><strong>Deep Links</strong>Each topic has a unique URL hash (e.g. <code>#p1t1</code>). You can bookmark or share exact topic links.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">📱</div><div class="help-tip-text"><strong>Mobile Friendly</strong>The sidebar auto-closes when you select a topic on small screens, giving full content width.</div></div>
  </div>
</div>

<!-- ══════════════════════════════════════
     SECTION 3 — Topic View
══════════════════════════════════════ -->
<div class="help-section" id="help-sec-topics">
  <div class="help-section-title"><span>📖</span> Topic View</div>
  <p class="help-section-sub">Understanding how to read and interact with a topic page.</p>

  <!-- Topic view mockup with diagram aside -->
  <div class="help-mockup">
    <div class="help-mockup-label">Topic View</div>
    <div class="mock-sidebar" style="align-items:flex-start">
      <div class="mock-topic-area">
        <div class="mock-topic-header">
          <div class="mock-badge">Part 3 · Databases</div>
          <div class="mock-topic-title">SQL vs NoSQL Databases</div>
          <div class="mock-topic-sub">When to use relational vs document stores</div>
        </div>
        <div class="mock-section-card">
          <div class="mock-section-hdr">
            <div class="mock-section-icon">📋</div>
            What is SQL? <span style="margin-left:auto;font-size:8px;color:var(--text-muted)">▼</span>
          </div>
          <div class="mock-section-body">Relational databases store data in rows and columns with strict schemas. ACID transactions guarantee consistency…</div>
        </div>
        <div class="mock-section-card" style="border-left-color:var(--accent-2)">
          <div class="mock-section-hdr">
            <div class="mock-section-icon">📦</div>
            What is NoSQL? <span style="margin-left:auto;font-size:8px;color:var(--text-muted)">▶</span>
          </div>
        </div>
        <div class="mock-section-card" style="border-left-color:var(--accent-3)">
          <div class="mock-section-hdr">
            <div class="mock-section-icon">⚖️</div>
            Choosing the Right DB <span style="margin-left:auto;font-size:8px;color:var(--text-muted)">▶</span>
          </div>
        </div>
      </div>
      <div class="mock-aside">
        <div class="mock-aside-hdr">🗂️ Architecture</div>
        <div class="mock-aside-svg">
          <div class="mock-aside-svg-nodes">
            <div class="mock-aside-node" style="background:rgba(99,102,241,0.2);color:var(--text-accent)">App Server</div>
            <div class="mock-aside-arrow">↓</div>
            <div class="mock-aside-node" style="background:rgba(139,92,246,0.2);color:#c4b5fd">SQL DB</div>
            <div class="mock-aside-arrow">↔</div>
            <div class="mock-aside-node" style="background:rgba(6,182,212,0.2);color:#67e8f9">NoSQL DB</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="help-feature-block">
    <div class="help-feature-label">📋 Anatomy of a Topic</div>
    <div class="help-tips-grid">
      <div class="help-tip-card"><div class="help-tip-icon">🏷️</div><div class="help-tip-text"><strong>Topic Header</strong>Shows the module badge, topic title, and a subtitle describing the key concept.</div></div>
      <div class="help-tip-card"><div class="help-tip-icon">📋</div><div class="help-tip-text"><strong>Section Cards</strong>Each topic has multiple expandable section cards. Click any card header to expand or collapse its content.</div></div>
      <div class="help-tip-card"><div class="help-tip-icon">🗂️</div><div class="help-tip-text"><strong>Diagram Aside</strong>Many topics include an SVG architecture diagram in the sidebar. Diagrams visualize the concept.</div></div>
      <div class="help-tip-card"><div class="help-tip-icon">✓</div><div class="help-tip-text"><strong>Mark Complete</strong>The "Mark Complete" button at the bottom records your progress. Click again to undo if needed.</div></div>
      <div class="help-tip-card"><div class="help-tip-icon">◀▶</div><div class="help-tip-text"><strong>Topic Navigation</strong>The bottom navigation bar lets you jump to the previous or next topic within the module.</div></div>
      <div class="help-tip-card"><div class="help-tip-icon">🎨</div><div class="help-tip-text"><strong>Color Coding</strong>Section cards use color-coded left borders: indigo = overview, purple = details, cyan = practical.</div></div>
    </div>
  </div>

  <div class="help-callout tip">
    <div class="help-callout-icon">✅</div>
    <p><strong>Tip:</strong> Expand all section cards in a topic for a complete understanding before marking it done. You can always come back — completed topics stay checkmarked.</p>
  </div>
</div>

<!-- ══════════════════════════════════════
     SECTION 4 — Quiz
══════════════════════════════════════ -->
<div class="help-section" id="help-sec-quiz">
  <div class="help-section-title"><span>🧠</span> Part Quizzes</div>
  <p class="help-section-sub">Test your understanding after finishing each module with 8 targeted questions.</p>

  <div class="help-feature-row">
    <div class="help-feature-row-icon">🧠</div>
    <div class="help-feature-row-body">
      <h3>How to Take a Quiz</h3>
      <p>On the Welcome screen, scroll to any module card and click the <strong>🧠 Take Quiz</strong> button at the bottom of the card. A modal quiz opens — no page navigation needed.</p>
    </div>
  </div>

  <div class="help-mockup">
    <div class="help-mockup-label">Quiz Modal Preview</div>
    <div style="padding:16px 20px;background:var(--bg-card);border-radius:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid var(--border);margin-bottom:12px">
        <div style="font-size:11px;color:var(--text-muted);background:var(--bg-secondary);border:1px solid var(--border);border-radius:6px;padding:4px 10px">✕ Close</div>
        <div style="font-size:13px;font-weight:600;color:var(--text-primary)">⚡ Caching — Quiz</div>
        <div style="font-size:11px;color:var(--text-muted)">3 / 8</div>
      </div>
      <div style="height:3px;background:var(--bg-tertiary);border-radius:2px;margin-bottom:16px">
        <div style="width:25%;height:100%;background:var(--text-accent);border-radius:2px"></div>
      </div>
      <div style="font-size:10px;font-weight:700;color:var(--text-accent);letter-spacing:.06em;margin-bottom:6px">QUESTION 3</div>
      <div style="font-size:14px;font-weight:600;color:var(--text-primary);margin-bottom:14px">What is a cache stampede (thundering herd)?</div>
      <div style="display:flex;flex-direction:column;gap:7px">
        <div style="padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:12px;color:var(--text-primary)">A. A DDoS attack on the cache server</div>
        <div style="padding:9px 12px;border:1.5px solid #22c55e;border-radius:8px;font-size:12px;color:#22c55e;font-weight:600">B. When a popular cached item expires and many requests hit the DB at once ✓</div>
        <div style="padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:12px;color:var(--text-primary)">C. Cache memory fills up and items are evicted</div>
        <div style="padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:12px;color:var(--text-primary)">D. Cache cluster loses all nodes simultaneously</div>
      </div>
    </div>
  </div>

  <div class="help-tips-grid">
    <div class="help-tip-card"><div class="help-tip-icon">📝</div><div class="help-tip-text"><strong>8 Questions per Part</strong>Each of the 12 modules has its own set of 8 targeted questions covering the core concepts of that module.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">🔀</div><div class="help-tip-text"><strong>Shuffled Every Time</strong>Questions are randomly ordered each run, so the quiz feels different even if you retake it immediately.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">💡</div><div class="help-tip-text"><strong>Instant Explanations</strong>After every answer — right or wrong — a detailed explanation appears so you learn from every question.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">🏆</div><div class="help-tip-text"><strong>Best Score Saved</strong>Your best score per part is saved in the browser. It shows as a green badge on the module card on the Welcome screen.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">↺</div><div class="help-tip-text"><strong>Retake Anytime</strong>After seeing your results, click <em>Retry Quiz</em> to try again. Great for spaced-repetition practice before interviews.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">🎯</div><div class="help-tip-text"><strong>Graded Results</strong>Get a percentage score with a grade: 🏆 Excellent (88%+), 👍 Good (63%+), 📚 Keep Studying (38%+), 🔄 Try Again (&lt;38%).</div></div>
  </div>

  <div class="help-callout tip">
    <div class="help-callout-icon">✅</div>
    <p><strong>Recommended Flow:</strong> Read all topics in a module → Mark them complete → Then take the quiz. This mimics spaced recall and is proven to strengthen long-term retention significantly more than re-reading.</p>
  </div>

  <div class="help-divider"></div>

  <div class="help-feature-block">
    <div class="help-feature-label">📋 Quiz Coverage — All 12 Parts</div>
    <table class="help-parts-table">
      <tr><th>Part</th><th>Module</th><th>Quiz Topics</th></tr>
      <tr><td>🌐 1</td><td>Networking Fundamentals</td><td>DNS, OSI layers, TCP/UDP, Load Balancers, CDN, HTTPS</td></tr>
      <tr><td>🔌 2</td><td>Backend APIs</td><td>REST, HTTP methods, GraphQL, API Gateway, versioning, rate limiting</td></tr>
      <tr><td>🔐 3</td><td>Security &amp; Auth</td><td>Auth vs AuthZ, JWT, SQL injection, bcrypt, OAuth 2.0, CSRF, CORS</td></tr>
      <tr><td>🗄️ 4</td><td>Databases &amp; SQL</td><td>ACID, indexes, sharding, SQL vs NoSQL, eventual consistency, N+1</td></tr>
      <tr><td>🏛️ 5</td><td>Architecture Patterns</td><td>Microservices, CQRS, Circuit Breaker, Saga, Event Sourcing, Sidecar</td></tr>
      <tr><td>📈 6</td><td>Scalability</td><td>Horizontal vs Vertical, CAP theorem, consistent hashing, auto-scaling</td></tr>
      <tr><td>⚡ 7</td><td>Caching</td><td>Cache hit/miss, TTL, LRU, cache stampede, write-through, Redis</td></tr>
      <tr><td>📨 8</td><td>Async &amp; Distributed</td><td>Sync vs Async, message queues, Kafka, DLQ, pub/sub, idempotency</td></tr>
      <tr><td>☁️ 9</td><td>Cloud &amp; AWS</td><td>IaaS/PaaS/SaaS, AZs, Lambda, S3, RDS, CloudFront, VPC, shared responsibility</td></tr>
      <tr><td>🐳 10</td><td>Containers &amp; Docker</td><td>Image vs container, containerization, Kubernetes, Pods, Dockerfile, Compose</td></tr>
      <tr><td>🔧 11</td><td>Production Engineering</td><td>Observability, SLA/SLO/SLI, blue-green, tracing, canary, error budget</td></tr>
      <tr><td>🎯 12</td><td>Career Readiness</td><td>Requirements gathering, estimation, NFRs, STAR method, trade-offs</td></tr>
    </table>
  </div>
</div>

<!-- ══════════════════════════════════════
     SECTION 5 — Architecture Diagrams
══════════════════════════════════════ -->
<div class="help-section" id="help-sec-diagrams">
  <div class="help-section-title"><span>🗂️</span> Architecture Diagrams</div>
  <p class="help-section-sub">Animated flows, interactive diagrams, and real company architectures.</p>

  <div class="help-feature-row">
    <div class="help-feature-row-icon">🗂️</div>
    <div class="help-feature-row-body">
      <h3>How to Access Diagrams</h3>
      <p>Click the <strong>🗂️ button</strong> in the top-right action bar to open the Diagrams screen. You can also reach it via URL with <code>#diagrams</code>.</p>
    </div>
  </div>

  <div class="help-mockup">
    <div class="help-mockup-label">Diagrams Screen</div>
    <div class="mock-labs" style="min-height:120px">
      <div class="mock-labs-header">
        <div class="mock-labs-icon">🗂️</div>
        <div>
          <div class="mock-labs-title">Architecture Diagrams</div>
          <div class="mock-labs-sub">Interactive animated architecture flows</div>
        </div>
      </div>
      <div class="mock-labs-tabs">
        <div class="mock-labs-tab active">Animated Flows</div>
        <div class="mock-labs-tab">Component View</div>
        <div class="mock-labs-tab">Company Designs</div>
      </div>
      <div class="mock-labs-content">
        <div class="mock-labs-card" style="background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.06));border-color:rgba(99,102,241,0.25)">
          <div class="mock-labs-card-title">Load Balancer Flow</div>
          <div class="mock-labs-card-body">Animated SVG · Client → LB → Servers → DB</div>
        </div>
        <div class="mock-labs-card">
          <div class="mock-labs-card-title">Microservices Mesh</div>
          <div class="mock-labs-card-body">Service discovery · API gateway · health checks</div>
        </div>
        <div class="mock-labs-card">
          <div class="mock-labs-card-title">Netflix Architecture</div>
          <div class="mock-labs-card-body">CDN · Cassandra · Kafka · Zuul gateway</div>
        </div>
        <div class="mock-labs-card">
          <div class="mock-labs-card-title">Twitter Feed Design</div>
          <div class="mock-labs-card-body">Fan-out · Timeline cache · Redis pub/sub</div>
        </div>
      </div>
    </div>
  </div>

  <div class="help-tips-grid">
    <div class="help-tip-card"><div class="help-tip-icon">🎬</div><div class="help-tip-text"><strong>Animated Flows</strong>Watch data flow through the architecture in real-time. Helps visualize request/response cycles.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">🔗</div><div class="help-tip-text"><strong>Topic Diagrams</strong>Relevant topics automatically show a diagram in the right-side panel while reading content.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">🏢</div><div class="help-tip-text"><strong>Company Architectures</strong>See how Netflix, Uber, Twitter, and others design their systems at scale.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">🔍</div><div class="help-tip-text"><strong>Zoom &amp; Pan</strong>SVG diagrams support browser zoom for getting a closer look at complex flows.</div></div>
  </div>
</div>

<!-- ══════════════════════════════════════
     SECTION 5 — Architecture Labs
══════════════════════════════════════ -->
<div class="help-section" id="help-sec-labs">
  <div class="help-section-title"><span>⚗️</span> Architecture Labs</div>
  <p class="help-section-sub">Hands-on interactive simulators, case studies, and pattern analysis.</p>

  <div class="help-feature-row">
    <div class="help-feature-row-icon">⚗️</div>
    <div class="help-feature-row-body">
      <h3>How to Access Labs</h3>
      <p>Click the <strong>⚗️ button</strong> in the top-right action bar to open the Labs screen. The URL hash <code>#labs</code> links directly to it.</p>
    </div>
  </div>

  <div class="help-mockup">
    <div class="help-mockup-label">Labs Screen</div>
    <div class="mock-labs">
      <div class="mock-labs-header">
        <div class="mock-labs-icon">⚗️</div>
        <div>
          <div class="mock-labs-title">Architecture Labs</div>
          <div class="mock-labs-sub">Interactive design challenges and simulators</div>
        </div>
      </div>
      <div class="mock-labs-tabs">
        <div class="mock-labs-tab active">Simulator</div>
        <div class="mock-labs-tab">Case Studies</div>
        <div class="mock-labs-tab">Patterns</div>
        <div class="mock-labs-tab">Challenges</div>
      </div>
      <div class="mock-labs-content">
        <div class="mock-labs-card" style="background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,182,212,0.06));border-color:rgba(16,185,129,0.25)">
          <div class="mock-labs-card-title">⚡ URL Shortener</div>
          <div class="mock-labs-card-body">Design it end-to-end: hashing, DB, cache layer</div>
        </div>
        <div class="mock-labs-card">
          <div class="mock-labs-card-title">📨 Rate Limiter</div>
          <div class="mock-labs-card-body">Token bucket · Sliding window · Redis</div>
        </div>
        <div class="mock-labs-card">
          <div class="mock-labs-card-title">🏢 Netflix Case Study</div>
          <div class="mock-labs-card-body">How they serve 200M+ users with 99.99% uptime</div>
        </div>
        <div class="mock-labs-card">
          <div class="mock-labs-card-title">🔄 Circuit Breaker Pattern</div>
          <div class="mock-labs-card-body">Resilience patterns with tradeoff analysis</div>
        </div>
      </div>
    </div>
  </div>

  <div class="help-tips-grid">
    <div class="help-tip-card"><div class="help-tip-icon">🔧</div><div class="help-tip-text"><strong>Simulator</strong>Interactively design systems. Add components, define data flows, and analyze your design.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">📚</div><div class="help-tip-text"><strong>Case Studies</strong>Deep dives into real company architectures — understand how they scaled and what tradeoffs they made.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">🧩</div><div class="help-tip-text"><strong>Patterns</strong>Explore classic architecture patterns (CQRS, Saga, Event Sourcing…) with pros/cons analysis.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">🎯</div><div class="help-tip-text"><strong>Challenges</strong>Test your knowledge with system design challenge prompts used in real engineering interviews.</div></div>
  </div>
</div>

<!-- ══════════════════════════════════════
     SECTION 6 — Search
══════════════════════════════════════ -->
<div class="help-section" id="help-sec-search">
  <div class="help-section-title"><span>🔍</span> Search</div>
  <p class="help-section-sub">Find any topic instantly across all 120+ topics.</p>

  <div class="help-feature-row">
    <div class="help-feature-row-icon">🔍</div>
    <div class="help-feature-row-body">
      <h3>Smart Real-Time Search</h3>
      <p>Start typing in the search bar in the sidebar to instantly filter topics by name. Results are highlighted and clickable. Press <code>Escape</code> or click the ✕ button to clear.</p>
    </div>
  </div>

  <div class="help-callout info">
    <div class="help-callout-icon">⌨️</div>
    <p><strong>Keyboard Shortcut:</strong> Press <code>/</code> anywhere on the page (when not in a text field) to instantly focus the search bar — no need to click!</p>
  </div>

  <div class="help-tips-grid">
    <div class="help-tip-card"><div class="help-tip-icon">/</div><div class="help-tip-text"><strong>Quick Focus</strong>Press <code>/</code> to jump to the search bar from anywhere on the page.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">✕</div><div class="help-tip-text"><strong>Clear Search</strong>Press <code>Escape</code> or click the ✕ button to clear the search and return to the full sidebar.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">🎯</div><div class="help-tip-text"><strong>Filter by Name</strong>Search matches topic titles in real time. The sidebar collapses to show only matching results.</div></div>
    <div class="help-tip-card"><div class="help-tip-icon">🖱️</div><div class="help-tip-text"><strong>Click to Navigate</strong>Click any search result to go directly to that topic, even if it's in a collapsed module.</div></div>
  </div>
</div>

<!-- ══════════════════════════════════════
     SECTION 7 — Progress
══════════════════════════════════════ -->
<div class="help-section" id="help-sec-progress">
  <div class="help-section-title"><span>📊</span> Progress Tracking</div>
  <p class="help-section-sub">Track your learning journey across all 120+ topics.</p>

  <div class="help-feature-row">
    <div class="help-feature-row-icon">📊</div>
    <div class="help-feature-row-body">
      <h3>Automatic Progress Saving</h3>
      <p>Your progress is saved in <strong>localStorage</strong> — it persists across browser sessions. Open the app on the same device and browser and your completed topics will still be marked.</p>
    </div>
  </div>

  <div class="help-mockup">
    <div class="help-mockup-label">Progress Bar</div>
    <div style="padding:16px 20px;background:var(--bg-card)">
      <div class="mock-progress-bar" style="margin:0;max-width:340px;margin:0 auto">
        <div class="mock-pb-label">
          <span style="font-size:11px;font-weight:700;color:var(--text-secondary)">Your Progress</span>
          <span style="font-size:11px;color:var(--text-muted)">14 / 120 topics</span>
        </div>
        <div class="mock-pb-track" style="height:6px;margin-top:7px">
          <div class="mock-pb-fill" style="width:12%;height:100%"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="help-steps">
    <div class="help-step"><div class="help-step-num">1</div><div class="help-step-text">Navigate to a topic you want to complete.</div></div>
    <div class="help-step"><div class="help-step-num">2</div><div class="help-step-text">Scroll to the bottom of the topic and click <strong>"✓ Mark Complete"</strong>.</div></div>
    <div class="help-step"><div class="help-step-num">3</div><div class="help-step-text">The progress bar and counter in the sidebar update instantly.</div></div>
    <div class="help-step"><div class="help-step-num">4</div><div class="help-step-text">The topic gets a ✓ checkmark in the sidebar navigation.</div></div>
    <div class="help-step"><div class="help-step-num">5</div><div class="help-step-text">To undo, click the button again — it toggles between complete and incomplete.</div></div>
  </div>

  <div class="help-callout warn">
    <div class="help-callout-icon">⚠️</div>
    <p><strong>Note:</strong> Progress is stored in your browser's localStorage. Clearing browser data or using a different device/browser will reset your progress.</p>
  </div>
</div>

<!-- ══════════════════════════════════════
     SECTION 8 — Keyboard Shortcuts
══════════════════════════════════════ -->
<div class="help-section" id="help-sec-shortcuts">
  <div class="help-section-title"><span>⌨️</span> Keyboard Shortcuts</div>
  <p class="help-section-sub">Speed up your navigation with these keyboard shortcuts.</p>

  <div class="help-kbd-grid">
    <div class="help-kbd-row">
      <span>Focus search bar</span>
      <div class="help-kbd-keys"><span class="help-kbd">/</span></div>
    </div>
    <div class="help-kbd-row">
      <span>Clear search</span>
      <div class="help-kbd-keys"><span class="help-kbd">Esc</span></div>
    </div>
    <div class="help-kbd-row">
      <span>Next tour step</span>
      <div class="help-kbd-keys"><span class="help-kbd">→</span></div>
    </div>
    <div class="help-kbd-row">
      <span>Previous tour step</span>
      <div class="help-kbd-keys"><span class="help-kbd">←</span></div>
    </div>
    <div class="help-kbd-row">
      <span>Exit tour</span>
      <div class="help-kbd-keys"><span class="help-kbd">Esc</span></div>
    </div>
    <div class="help-kbd-row">
      <span>Link to Diagrams screen</span>
      <div class="help-kbd-keys"><span class="help-kbd">#diagrams</span></div>
    </div>
    <div class="help-kbd-row">
      <span>Link to Labs screen</span>
      <div class="help-kbd-keys"><span class="help-kbd">#labs</span></div>
    </div>
    <div class="help-kbd-row">
      <span>Link to Help screen</span>
      <div class="help-kbd-keys"><span class="help-kbd">#help</span></div>
    </div>
    <div class="help-kbd-row">
      <span>Link to a topic</span>
      <div class="help-kbd-keys"><span class="help-kbd">#p1t1</span></div>
    </div>
    <div class="help-kbd-row">
      <span>Go to Welcome screen</span>
      <div class="help-kbd-keys"><span class="help-kbd">Click brand</span></div>
    </div>
  </div>

  <div class="help-callout info">
    <div class="help-callout-icon">🔗</div>
    <p><strong>Deep Linking:</strong> Every screen has a URL hash. You can bookmark or share <code>yourdomain.com/index.html#p3t2</code> to link directly to Part 3, Topic 2. The <code>#diagrams</code>, <code>#labs</code>, and <code>#help</code> hashes also work.</p>
  </div>
</div>

</div><!-- /help-body -->
    `;
  }

  /* ── Public API ─────────────────────────────────── */
  return { start, renderHelp, beginTour, exit };
})();

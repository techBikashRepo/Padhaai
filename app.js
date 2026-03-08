/* =====================================================
   app.js  —  Architect Academy Core Application
   Handles: Navigation, Rendering, Search, Progress
   ===================================================== */

(function () {
  "use strict";

  /* ─── State ──────────────────────────────────────── */
  const state = {
    currentTopicId: null,
    searchQuery: "",
    sidebarOpen: window.innerWidth > 900,
    theme: localStorage.getItem("aa-theme") || "dark",
  };

  /* ─── Progress helpers ───────────────────────────── */
  function getCompleted() {
    try {
      return JSON.parse(localStorage.getItem("aa-completed") || "{}");
    } catch {
      return {};
    }
  }
  function setCompleted(obj) {
    localStorage.setItem("aa-completed", JSON.stringify(obj));
  }
  function isCompleted(topicId) {
    return !!getCompleted()[topicId];
  }
  function toggleCompleted(topicId) {
    const c = getCompleted();
    if (c[topicId]) delete c[topicId];
    else c[topicId] = true;
    setCompleted(c);
    return !!c[topicId];
  }
  function countAll() {
    return PARTS.reduce((acc, p) => acc + p.topics.length, 0);
  }
  function countDone() {
    const c = getCompleted();
    return PARTS.reduce(
      (acc, p) => acc + p.topics.filter((t) => c[t.id]).length,
      0,
    );
  }

  /* ─── Flatten topic list for search ─────────────── */
  const allTopics = [];
  PARTS.forEach((part) => {
    part.topics.forEach((topic) => {
      allTopics.push({ partId: part.id, partName: part.name, ...topic });
    });
  });

  /* ─── DOM refs ───────────────────────────────────── */
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  };

  /* ─── Theme ──────────────────────────────────────── */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    state.theme = theme;
    localStorage.setItem("aa-theme", theme);
    const isDark = theme === "dark";
    $("themeIcon").textContent = isDark ? "☀️" : "🌙";
    $("themeLabel").textContent = isDark ? "Light Mode" : "Dark Mode";
    $("topThemeToggle").textContent = isDark ? "🌙" : "☀️";
  }

  function toggleTheme() {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  }

  /* ─── Sidebar open/close ─────────────────────────── */
  function openSidebar() {
    $("sidebar").classList.add("open");
    $("sidebarOverlay").classList.add("active");
    state.sidebarOpen = true;
  }
  function closeSidebar() {
    $("sidebar").classList.remove("open");
    $("sidebarOverlay").classList.remove("active");
    state.sidebarOpen = false;
  }

  /* ─── Build Sidebar ──────────────────────────────── */
  function buildSidebar() {
    const nav = $("sidebarNav");
    nav.innerHTML = "";
    const completed = getCompleted();

    PARTS.forEach((part) => {
      const isOpen = part.topics.some((t) => t.id === state.currentTopicId);
      const doneCount = part.topics.filter((t) => completed[t.id]).length;
      const pct = Math.round((doneCount / part.topics.length) * 100);

      const partEl = el("div", "nav-part" + (isOpen ? " open" : ""));
      partEl.dataset.partId = part.id;

      // Header
      const header = el("div", "nav-part-header");
      header.innerHTML = `
        <div class="part-icon">${part.icon}</div>
        <div class="part-info">
          <div class="part-title">${part.title}</div>
          <div class="part-name">${part.name}</div>
        </div>
        <div class="part-meta">
          <div class="part-count">${doneCount}/${part.topics.length}</div>
          <div class="part-progress-bar"><div class="part-progress-fill" style="width:${pct}%"></div></div>
          <span class="part-chevron">▼</span>
        </div>`;
      header.addEventListener("click", () => {
        partEl.classList.toggle("open");
      });

      // Topics
      const topicList = el("div", "nav-topics");
      part.topics.forEach((topic) => {
        const isActive = topic.id === state.currentTopicId;
        const isDone = !!completed[topic.id];
        const item = el(
          "div",
          `nav-topic-item${isActive ? " active" : ""}${isDone ? " completed" : ""}`,
        );
        item.dataset.topicId = topic.id;
        item.innerHTML = `
          <div class="topic-check">${isDone ? "✓" : ""}</div>
          <span>${topic.title}</span>`;
        item.addEventListener("click", () => {
          navigateTo(topic.id);
          if (window.innerWidth <= 900) closeSidebar();
        });
        topicList.appendChild(item);
      });

      partEl.appendChild(header);
      partEl.appendChild(topicList);
      nav.appendChild(partEl);
    });
  }

  /* ─── Progress bar update ────────────────────────── */
  function updateProgress() {
    const total = countAll();
    const done = countDone();
    const pct = total ? Math.round((done / total) * 100) : 0;
    $("progressBarFill").style.width = pct + "%";
    $("progressLabel").textContent = pct + "%";
    $("progressCount").textContent = `${done} / ${total} topics completed`;
  }

  /* ─── Build Welcome Parts Grid ───────────────────── */
  function buildPartsGrid() {
    const grid = $("partsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const completed = getCompleted();
    PARTS.forEach((part) => {
      const done = part.topics.filter((t) => completed[t.id]).length;
      const pct = Math.round((done / part.topics.length) * 100);
      const card = el("div", "part-card");
      card.innerHTML = `
        <div class="part-card-icon">${part.icon}</div>
        <div class="part-card-num">${part.title}</div>
        <div class="part-card-title">${part.name}</div>
        <div class="part-card-count">${part.topics.length} topics · ${done} completed</div>
        <div class="part-card-bar"><div class="part-card-bar-fill" style="width:${pct}%"></div></div>`;
      card.addEventListener("click", () => {
        navigateTo(part.topics[0].id);
      });
      grid.appendChild(card);
    });
    $("totalTopicsCount").textContent = countAll() + "+";
  }

  /* ─── Render Topic Content ───────────────────────── */
  function renderTopic(topic) {
    // Find part
    const part = PARTS.find((p) => p.topics.some((t) => t.id === topic.id));
    const topics = part ? part.topics : [];
    const tIndex = topics.findIndex((t) => t.id === topic.id);
    const prevT = tIndex > 0 ? topics[tIndex - 1] : null;
    const nextT = tIndex < topics.length - 1 ? topics[tIndex + 1] : null;
    const done = isCompleted(topic.id);

    // Build sections HTML
    const sectionsHTML = topic.sections
      .map(
        (section) => `
      <div class="section-card open">
        <div class="section-header">
          <div class="section-icon ${section.color}">${section.icon}</div>
          <div class="section-title">${section.title}</div>
          <span class="section-chevron">▼</span>
        </div>
        <div class="section-body">${section.body}</div>
      </div>`,
      )
      .join("");

    const html = `
      <div class="topic-header">
        <div class="topic-header-left">
          ${part ? `<div class="topic-part-badge">${part.icon} ${part.title} — ${part.name}</div>` : ""}
          <h1 class="topic-title">${topic.title}</h1>
          ${topic.subtitle ? `<p class="topic-subtitle">${topic.subtitle}</p>` : ""}
        </div>
        <div class="topic-actions">
          <button class="btn-nav" id="btnPrev" ${!prevT ? "disabled" : ""}>← Prev</button>
          <button class="btn-complete ${done ? "completed" : ""}" id="btnComplete">
            ${done ? "✓ Completed" : "○ Mark Complete"}
          </button>
          <button class="btn-nav" id="btnNext" ${!nextT ? "disabled" : ""}>Next →</button>
        </div>
      </div>
      <div class="topic-sections">${sectionsHTML}</div>
      <div class="topic-nav-bar">
        <div class="nav-hint">
          ${prevT ? `← <span style="color:var(--text-accent);cursor:pointer" id="prevHint">${prevT.title}</span>` : '<span style="color:var(--text-muted)">Beginning</span>'}
        </div>
        <div class="nav-hint">
          ${nextT ? `<span style="color:var(--text-accent);cursor:pointer" id="nextHint">${nextT.title}</span> →` : '<span style="color:var(--text-muted)">End of module</span>'}
        </div>
      </div>`;

    const contentEl = $("topicContent");
    contentEl.innerHTML = html;
    contentEl.classList.remove("hidden");
    $("welcomeScreen").classList.add("hidden");

    // Section collapse/expand
    contentEl.querySelectorAll(".section-header").forEach((hdr) => {
      hdr.addEventListener("click", () => {
        hdr.closest(".section-card").classList.toggle("open");
      });
    });

    // Complete button
    $("btnComplete").addEventListener("click", () => {
      const newState = toggleCompleted(topic.id);
      $("btnComplete").className =
        "btn-complete" + (newState ? " completed" : "");
      $("btnComplete").textContent = newState
        ? "✓ Completed"
        : "○ Mark Complete";
      buildSidebar();
      updateProgress();
      buildPartsGrid();
    });

    // Navigation
    if (prevT) {
      $("btnPrev").addEventListener("click", () => navigateTo(prevT.id));
      const ph = document.getElementById("prevHint");
      if (ph) ph.addEventListener("click", () => navigateTo(prevT.id));
    }
    if (nextT) {
      $("btnNext").addEventListener("click", () => navigateTo(nextT.id));
      const nh = document.getElementById("nextHint");
      if (nh) nh.addEventListener("click", () => navigateTo(nextT.id));
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ─── Navigate to a topic ────────────────────────── */
  function navigateTo(topicId) {
    const topic = allTopics.find((t) => t.id === topicId);
    if (!topic) return;
    state.currentTopicId = topicId;

    // Update breadcrumb
    const part = PARTS.find((p) => p.topics.some((t) => t.id === topicId));
    $("topbarCrumb").innerHTML = part
      ? `<span>${part.icon} ${part.name}</span><span class="crumb-sep">›</span><span>${topic.title}</span>`
      : `<span>${topic.title}</span>`;

    renderTopic(topic);
    buildSidebar();

    // Update URL hash
    window.location.hash = topicId;
  }

  /* ─── Show welcome screen ────────────────────────── */
  function showWelcome() {
    state.currentTopicId = null;
    $("topicContent").classList.add("hidden");
    $("welcomeScreen").classList.remove("hidden");
    $("topbarCrumb").innerHTML = "<span>Welcome to Architect Academy</span>";
    buildSidebar();
    buildPartsGrid();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.location.hash = "";
  }

  /* ─── Search ─────────────────────────────────────── */
  function handleSearch(query) {
    state.searchQuery = query.trim().toLowerCase();
    const $results = $("searchResults");
    const $clear = $("searchClear");

    if (!state.searchQuery) {
      $results.classList.remove("visible");
      $clear.classList.remove("visible");
      return;
    }
    $clear.classList.add("visible");

    const matches = allTopics
      .filter(
        (t) =>
          t.title.toLowerCase().includes(state.searchQuery) ||
          (t.subtitle || "").toLowerCase().includes(state.searchQuery) ||
          t.partName.toLowerCase().includes(state.searchQuery),
      )
      .slice(0, 12);

    if (!matches.length) {
      $results.innerHTML =
        '<div class="search-no-results">No topics found for "' +
        escHtml(query) +
        '"</div>';
    } else {
      $results.innerHTML = matches
        .map(
          (t) => `
        <div class="search-result-item" data-topic-id="${t.id}">
          <div class="search-result-part">${t.partName}</div>
          <div class="search-result-title">${highlight(t.title, state.searchQuery)}</div>
        </div>`,
        )
        .join("");
      $results.querySelectorAll(".search-result-item").forEach((item) => {
        item.addEventListener("click", () => {
          navigateTo(item.dataset.topicId);
          clearSearch();
          if (window.innerWidth <= 900) closeSidebar();
        });
      });
    }
    $results.classList.add("visible");
  }

  function clearSearch() {
    $("searchInput").value = "";
    $("searchResults").classList.remove("visible");
    $("searchClear").classList.remove("visible");
    state.searchQuery = "";
  }

  function highlight(text, query) {
    if (!query) return escHtml(text);
    const regex = new RegExp("(" + escRegex(query) + ")", "gi");
    return escHtml(text).replace(
      regex,
      '<mark style="background:rgba(99,102,241,0.3);color:var(--text-primary);border-radius:2px">$1</mark>',
    );
  }
  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* ─── Event Wiring ───────────────────────────────── */
  function wireEvents() {
    // Hamburger
    $("hamburger").addEventListener("click", () => {
      if ($("sidebar").classList.contains("open")) closeSidebar();
      else openSidebar();
    });

    // Sidebar close
    $("sidebarClose").addEventListener("click", closeSidebar);

    // Overlay
    $("sidebarOverlay").addEventListener("click", closeSidebar);

    // Theme toggles
    $("themeToggle").addEventListener("click", toggleTheme);
    $("topThemeToggle").addEventListener("click", toggleTheme);

    // Search input
    $("searchInput").addEventListener("input", (e) =>
      handleSearch(e.target.value),
    );
    $("searchInput").addEventListener("keydown", (e) => {
      if (e.key === "Escape") clearSearch();
    });
    $("searchClear").addEventListener("click", clearSearch);

    // Brand click → welcome
    document.querySelector(".brand").addEventListener("click", showWelcome);

    // Keyboard shortcut: / to focus search
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const active = document.activeElement;
        if (active.tagName !== "INPUT" && active.tagName !== "TEXTAREA") {
          e.preventDefault();
          $("searchInput").focus();
        }
      }
    });

    // Resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        $("sidebar").classList.remove("open");
        $("sidebarOverlay").classList.remove("active");
      }
    });

    // URL hash navigation (back/forward buttons)
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && allTopics.find((t) => t.id === hash)) {
        navigateTo(hash);
      } else if (!hash) {
        showWelcome();
      }
    });
  }

  /* ─── Bootstrap ──────────────────────────────────── */
  function init() {
    // Apply saved theme
    applyTheme(state.theme);

    // Wire all events
    wireEvents();

    // Build sidebar
    buildSidebar();
    updateProgress();

    // Build parts grid for welcome screen
    buildPartsGrid();

    // Check URL hash for deep link
    const hash = window.location.hash.replace("#", "");
    if (hash && allTopics.find((t) => t.id === hash)) {
      navigateTo(hash);
    } else {
      showWelcome();
    }
  }

  // Run after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

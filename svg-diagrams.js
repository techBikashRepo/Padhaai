/* =====================================================
   svg-diagrams.js  —  Architect Academy
   Animated, Interactive SVG Architecture Diagrams
   One diagram per key topic — data-driven engine
   ===================================================== */
(function () {
  "use strict";

  /* ── Shared inline styles injected once ─────────── */
  const GLOBAL_CSS = `
  .svgd-wrap { width:100%; position:relative; }
  .svgd-title { font-size:12px; font-weight:700; text-transform:uppercase;
    letter-spacing:.08em; color:var(--text-muted); margin-bottom:10px; display:flex;
    align-items:center; gap:6px; }
  .svgd-svg { width:100%; height:auto; overflow:visible; }

  /* node boxes */
  .svgd-node { cursor:pointer; transition:filter .2s; }
  .svgd-node:hover { filter:brightness(1.18) drop-shadow(0 0 6px rgba(99,102,241,.45)); }
  .svgd-node rect, .svgd-node ellipse {
    transition: fill .25s, stroke .25s;
    stroke-width: 1.5;
  }
  .svgd-node text { pointer-events:none; }

  /* animated flow paths */
  .svgd-flow { stroke-dasharray:6 4; animation: svgdDash 1.6s linear infinite; }
  .svgd-flow-slow { stroke-dasharray:8 5; animation: svgdDash 3s linear infinite; }
  .svgd-flow-rev { stroke-dasharray:6 4; animation: svgdDashRev 1.6s linear infinite; }
  @keyframes svgdDash { to { stroke-dashoffset:-20; } }
  @keyframes svgdDashRev { to { stroke-dashoffset:20; } }

  /* pulse glow on active nodes */
  .svgd-pulse { animation: svgdPulse 2.2s ease-in-out infinite; }
  @keyframes svgdPulse {
    0%,100% { opacity:.75; }
    50%      { opacity:1; }
  }

  /* sliding data packet */
  .svgd-packet { animation: svgdMove 2.2s ease-in-out infinite; }
  @keyframes svgdMove {
    0%   { transform: translateX(0)   translateY(0); opacity:0; }
    10%  { opacity:1; }
    90%  { opacity:1; }
    100% { transform: translateX(var(--dx,60px)) translateY(var(--dy,0px)); opacity:0; }
  }

  /* info panel */
  .svgd-info { border:1px solid var(--border); border-radius:10px;
    background:var(--bg-secondary); padding:12px 14px; margin-top:10px;
    font-size:13px; color:var(--text-secondary); line-height:1.65; display:none; }
  .svgd-info.visible { display:block; }
  .svgd-info strong { color:var(--text-primary); }

  /* legend */
  .svgd-legend { display:flex; flex-wrap:wrap; gap:8px 18px; margin-top:10px; }
  .svgd-legend-item { display:flex; align-items:center; gap:6px;
    font-size:11px; color:var(--text-muted); }
  .svgd-legend-dot { width:10px; height:10px; border-radius:3px; }
  `;

  /* ── Inject CSS once ─────────────────────────────── */
  function injectCSS() {
    if (document.getElementById("svgd-global-css")) return;
    const s = document.createElement("style");
    s.id = "svgd-global-css";
    s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
  }

  /* ── Color palette (theme-agnostic via CSS vars) ── */
  const C = {
    client: { fill: "#3b4fd4", stroke: "#6366f1", text: "#e0e4ff" },
    server: { fill: "#1a5f4a", stroke: "#10b981", text: "#ccfce4" },
    db: { fill: "#5b2a8a", stroke: "#a855f7", text: "#e9d5ff" },
    cache: { fill: "#854d0e", stroke: "#f59e0b", text: "#fef3c7" },
    queue: { fill: "#7c2d12", stroke: "#f97316", text: "#fee2e2" },
    cdn: { fill: "#0e4a6e", stroke: "#06b6d4", text: "#cffafe" },
    lb: { fill: "#1e3a5f", stroke: "#3b82f6", text: "#dbeafe" },
    api: { fill: "#3d1a6e", stroke: "#8b5cf6", text: "#ede9fe" },
    svc: { fill: "#1a3a4a", stroke: "#22d3ee", text: "#cffafe" },
    user: { fill: "#33220a", stroke: "#d97706", text: "#fef9c3" },
    storage: { fill: "#1c3a3a", stroke: "#14b8a6", text: "#ccfcf1" },
    neutral: { fill: "#1e2133", stroke: "#4b5280", text: "#9ba3bf" },
  };

  /* ── Draw helpers ────────────────────────────────── */
  function box(x, y, w, h, label, c, rx = 10, sub = "") {
    const sub_el = sub
      ? `<text x="${x + w / 2}" y="${y + h / 2 + 14}" text-anchor="middle"
           font-size="9" fill="${c.text}" opacity=".65">${sub}</text>`
      : "";
    return `<g class="svgd-node" onclick="SVGDiagrams._info(event,'${label.replace(/'/g, "&#39;")}')">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"
        fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5"/>
      <text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle"
        font-size="11" font-weight="700" fill="${c.text}">${label}</text>
      ${sub_el}
    </g>`;
  }

  function cylinder(x, y, w, h, label, c) {
    const rx = w / 2,
      ry = 8;
    return `<g class="svgd-node svgd-pulse" onclick="SVGDiagrams._info(event,'${label.replace(/'/g, "&#39;")}')">
      <ellipse cx="${x + rx}" cy="${y + ry}" rx="${rx}" ry="${ry}" fill="${c.stroke}" opacity=".35"/>
      <rect x="${x}" y="${y + ry}" width="${w}" height="${h - ry}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5"/>
      <ellipse cx="${x + rx}" cy="${y + ry}" rx="${rx}" ry="${ry}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5"/>
      <text x="${x + rx}" y="${y + ry + (h - ry) / 2 + 5}" text-anchor="middle"
        font-size="11" font-weight="700" fill="${c.text}">${label}</text>
    </g>`;
  }

  function arrow(
    x1,
    y1,
    x2,
    y2,
    animated = true,
    color = "#6366f1",
    label = "",
  ) {
    const dx = x2 - x1,
      dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / len,
      ny = dy / len;
    const ex = x2 - nx * 8,
      ey = y2 - ny * 8;
    const cls = animated ? "svgd-flow" : "";
    const lbl = label
      ? `<text x="${(x1 + x2) / 2 + 5}" y="${(y1 + y2) / 2 - 4}"
          font-size="9" fill="${color}" opacity=".8">${label}</text>`
      : "";
    return `<g>
      <line x1="${x1}" y1="${y1}" x2="${ex}" y2="${ey}"
        stroke="${color}" stroke-width="1.8" class="${cls}" opacity=".85"/>
      <polygon points="${x2},${y2} ${ex - ny * 4},${ey + nx * 4} ${ex + ny * 4},${ey - nx * 4}"
        fill="${color}" opacity=".85"/>
      ${lbl}
    </g>`;
  }

  function biArrow(x1, y1, x2, y2, color = "#6366f1") {
    const dx = x2 - x1,
      dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / len,
      ny = dy / len;
    const s1x = x1 + nx * 8,
      s1y = y1 + ny * 8;
    const e1x = x2 - nx * 8,
      e1y = y2 - ny * 8;
    return `<line x1="${s1x}" y1="${s1y}" x2="${e1x}" y2="${e1y}"
      stroke="${color}" stroke-width="1.8" class="svgd-flow" opacity=".8"
      marker-start="url(#arr)" marker-end="url(#arr)"/>`;
  }

  const DEFS = `<defs>
    <marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#6366f1" opacity=".8"/>
    </marker>
  </defs>`;

  /* ── Diagram catalogue ───────────────────────────── */
  const DIAGRAMS = {};

  /* ─────────────────────────────────────────────────
     Part 1 — Backend Fundamentals
  ───────────────────────────────────────────────── */

  DIAGRAMS["p1t1"] = {
    title: "Client — Server Architecture",
    legend: [
      { color: C.client.stroke, label: "Client" },
      { color: C.server.stroke, label: "Server" },
      { color: C.db.stroke, label: "Database" },
    ],
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 480 180" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 65, 100, 50, "Browser", C.client, 10, "Client")}
        ${box(120, 65, 100, 50, "Mobile App", C.client, 10, "Client")}
        ${box(260, 55, 100, 70, "Web Server", C.server, 10, "Node / Nginx")}
        ${cylinder(390, 55, 80, 70, "Database", C.db)}
        ${arrow(110, 90, 260, 90, true, C.client.stroke, "HTTP")}
        ${arrow(220, 90, 260, 90, true, C.client.stroke)}
        ${arrow(360, 90, 390, 90, true, C.server.stroke, "SQL")}
        ${arrow(390, 100, 360, 100, true, C.db.stroke)}
      </svg>`;
    },
  };

  DIAGRAMS["p1t14"] = {
    title: "HTTP Request / Response Lifecycle",
    legend: [
      { color: C.client.stroke, label: "Client" },
      { color: C.cdn.stroke, label: "CDN/Cache" },
      { color: C.server.stroke, label: "Origin Server" },
    ],
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 80, 90, 45, "Browser", C.client)}
        ${box(150, 60, 90, 45, "DNS", C.neutral, 10, "Resolve IP")}
        ${box(150, 115, 90, 45, "CDN", C.cdn, 10, "Cache Hit?")}
        ${box(300, 80, 100, 45, "Load Balancer", C.lb)}
        ${box(430, 60, 80, 45, "Server A", C.server)}
        ${box(430, 115, 80, 45, "Server B", C.server)}
        ${arrow(100, 90, 150, 80, true, C.client.stroke, "1. DNS?")}
        ${arrow(100, 95, 150, 130, true, C.client.stroke, "2. GET")}
        ${arrow(240, 137, 300, 100, true, C.cdn.stroke, "3. origin")}
        ${arrow(400, 95, 430, 75, true, C.lb.stroke)}
        ${arrow(400, 105, 430, 130, true, C.lb.stroke)}
        <text x="10" y="170" font-size="10" fill="#5c6380">→ Each HTTP request: DNS lookup → CDN check → LB → server → DB → response</text>
      </svg>`;
    },
  };

  DIAGRAMS["p2t1"] = {
    title: "REST API Design",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 20, 120, 40, "POST /orders", C.client, 8)}
        ${box(10, 70, 120, 40, "GET /orders/42", C.client, 8)}
        ${box(10, 120, 120, 40, "PATCH /orders/42", C.client, 8)}
        ${box(10, 170, 120, 40, "DELETE /orders/42", C.client, 8)}
        ${box(190, 80, 120, 55, "API Gateway", C.api, 10, "Auth · Rate Limit")}
        ${box(380, 50, 110, 40, "Order Service", C.server)}
        ${box(380, 100, 110, 40, "Notif. Service", C.svc)}
        ${box(380, 150, 110, 40, "Billing Service", C.svc)}
        ${arrow(130, 40, 190, 100, true, C.client.stroke)}
        ${arrow(130, 90, 190, 100, true, C.client.stroke)}
        ${arrow(130, 140, 190, 115, true, C.client.stroke)}
        ${arrow(130, 190, 190, 120, true, C.client.stroke)}
        ${arrow(310, 90, 380, 70, true, C.api.stroke)}
        ${arrow(310, 100, 380, 120, true, C.api.stroke)}
        ${arrow(310, 110, 380, 170, true, C.api.stroke)}
      </svg>`;
    },
  };

  DIAGRAMS["p1t9"] = {
    title: "DNS Resolution Flow",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 160" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 55, 80, 50, "Browser", C.client)}
        ${box(140, 20, 90, 45, "Recursive\nResolver", C.neutral)}
        ${box(140, 95, 90, 45, "Root DNS", C.neutral)}
        ${box(290, 20, 90, 45, "TLD DNS\n(.com)", C.cdn)}
        ${box(290, 95, 90, 45, "Auth. DNS\n(amazon)", C.server)}
        ${box(420, 55, 80, 45, "IP: 1.2.3.4", C.svc)}
        ${arrow(90, 80, 140, 42, true, C.client.stroke, "1")}
        ${arrow(140, 117, 140, 65, true, C.neutral.stroke, "2")}
        ${arrow(230, 42, 290, 42, true, C.cdn.stroke, "3")}
        ${arrow(290, 117, 230, 117, true, C.server.stroke, "4")}
        ${arrow(380, 117, 420, 80, true, C.server.stroke, "5")}
        <text x="10" y="155" font-size="10" fill="#5c6380">Each step is cached — TTL controls how long IP is remembered</text>
      </svg>`;
    },
  };

  DIAGRAMS["p1t12"] = {
    title: "TCP / IP Three-Way Handshake",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 500 190" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(20, 20, 100, 45, "Client", C.client)}
        ${box(380, 20, 100, 45, "Server", C.server)}
        <line x1="70" y1="65" x2="70" y2="185" stroke="#3b4fd4" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>
        <line x1="430" y1="65" x2="430" y2="185" stroke="#1a5f4a" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>
        ${arrow(70, 90, 430, 100, true, "#6366f1", "1. SYN  seq=100")}
        ${arrow(430, 120, 70, 130, true, "#10b981", "2. SYN-ACK  seq=200,ack=101")}
        ${arrow(70, 150, 430, 160, true, "#6366f1", "3. ACK  ack=201")}
        <text x="200" y="185" font-size="10" fill="#5c6380" text-anchor="middle">Connection established — Ready to send data</text>
      </svg>`;
    },
  };

  DIAGRAMS["p8t1"] = {
    title: "WebSocket vs REST",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        <text x="130" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#9ba3bf">HTTP/REST (Poll)</text>
        <text x="390" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#9ba3bf">WebSocket (Push)</text>
        ${box(10, 130, 70, 40, "Client", C.client)}
        ${box(200, 130, 70, 40, "Server", C.server)}
        ${box(280, 70, 70, 40, "Client", C.client)}
        ${box(460, 70, 70, 40, "Server", C.server)}
        ${arrow(80, 145, 200, 145, true, C.client.stroke, "req")}
        ${arrow(200, 155, 80, 155, true, C.server.stroke, "res")}
        ${arrow(80, 168, 200, 168, true, C.client.stroke, "req")}
        ${arrow(350, 90, 460, 90, true, "#6366f1", "WS Upgrade")}
        ${arrow(460, 100, 350, 107, false, "#10b981", "push")}
        ${arrow(460, 115, 350, 122, false, "#10b981", "push")}
        ${arrow(350, 130, 460, 137, false, "#6366f1", "send")}
        <rect x="5" y="25" width="235" height="100" rx="8" fill="none" stroke="#3b4fd4" stroke-dasharray="4 4" opacity=".3"/>
        <rect x="265" y="55" width="265" height="100" rx="8" fill="none" stroke="#10b981" stroke-dasharray="4 4" opacity=".3"/>
        <text x="130" y="170" text-anchor="middle" font-size="9" fill="#5c6380">Multiple connections</text>
        <text x="390" y="170" text-anchor="middle" font-size="9" fill="#5c6380">Persistent single connection</text>
      </svg>`;
    },
  };

  /* ─────────────────────────────────────────────────
     Part 2 — Databases
  ───────────────────────────────────────────────── */

  DIAGRAMS["p4t1"] = {
    title: "SQL vs NoSQL Data Models",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        <text x="125" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#a855f7">SQL (Relational)</text>
        <text x="385" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#f59e0b">NoSQL (Document)</text>
        <rect x="5" y="25" width="240" height="155" rx="10" fill="#5b2a8a" opacity=".1" stroke="#a855f7" stroke-width="1"/>
        <rect x="265" y="25" width="245" height="155" rx="10" fill="#854d0e" opacity=".1" stroke="#f59e0b" stroke-width="1"/>
        <text x="15" y="50" font-size="10" font-weight="700" fill="#a855f7">users</text>
        <text x="15" y="68" font-size="9" fill="#9ba3bf">id  │ name    │ email</text>
        <text x="15" y="82" font-size="9" fill="#6b7499">1   │ Alice   │ a@x.co</text>
        <text x="15" y="95" font-size="9" fill="#6b7499">2   │ Bob     │ b@x.co</text>
        <text x="15" y="120" font-size="10" font-weight="700" fill="#a855f7">orders</text>
        <text x="15" y="137" font-size="9" fill="#9ba3bf">id  │ user_id │ total</text>
        <text x="15" y="150" font-size="9" fill="#6b7499">101 │ 1       │ 59.99</text>
        <text x="15" y="163" font-size="9" fill="#6b7499">102 │ 1       │ 12.00</text>
        ${arrow(130, 130, 130, 108, false, "#a855f7", "FK")}
        <text x="275" y="50" font-size="10" font-weight="700" fill="#f59e0b">{"user":</text>
        <text x="285" y="65" font-size="9" fill="#9ba3bf">id: 1,</text>
        <text x="285" y="79" font-size="9" fill="#9ba3bf">name: "Alice",</text>
        <text x="285" y="93" font-size="9" fill="#9ba3bf">orders: [</text>
        <text x="295" y="107" font-size="9" fill="#6b7499">{id:101, total:59.99},</text>
        <text x="295" y="121" font-size="9" fill="#6b7499">{id:102, total:12.00}</text>
        <text x="285" y="135" font-size="9" fill="#9ba3bf">]</text>
        <text x="275" y="149" font-size="9" fill="#f59e0b">}</text>
        <text x="275" y="170" font-size="9" fill="#5c6380">embedded — no JOIN needed</text>
      </svg>`;
    },
  };

  DIAGRAMS["p4t12"] = {
    title: "Database Indexing — B-Tree",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        <text x="260" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#9ba3bf">B-Tree Index Structure</text>
        ${box(200, 30, 120, 38, "Root: 50", C.db, 8)}
        ${box(80, 100, 100, 38, "Node: 25", C.db, 8)}
        ${box(330, 100, 100, 38, "Node: 75", C.db, 8)}
        ${box(20, 165, 70, 28, "10,15", C.neutral, 6)}
        ${box(105, 165, 70, 28, "30,40", C.neutral, 6)}
        ${box(270, 165, 70, 28, "60,70", C.neutral, 6)}
        ${box(355, 165, 70, 28, "80,90", C.neutral, 6)}
        ${arrow(260, 68, 178, 100, false, C.db.stroke)}
        ${arrow(260, 68, 330, 100, false, C.db.stroke)}
        ${arrow(133, 138, 55, 165, false, C.db.stroke)}
        ${arrow(133, 138, 140, 165, false, C.db.stroke)}
        ${arrow(382, 138, 305, 165, false, C.db.stroke)}
        ${arrow(382, 138, 390, 165, false, C.db.stroke)}
        <text x="10" y="185" font-size="9" fill="#5c6380">O(log n) lookup — each level halves the search space</text>
      </svg>`;
    },
  };

  DIAGRAMS["p4t16"] = {
    title: "ACID Properties",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(15, 30, 110, 65, "Atomicity", C.db, 10, "All or Nothing")}
        ${box(145, 30, 110, 65, "Consistency", C.server, 10, "Valid State")}
        ${box(275, 30, 110, 65, "Isolation", C.api, 10, "No Dirty Read")}
        ${box(405, 30, 100, 65, "Durability", C.cdn, 10, "Survives Crash")}
        <text x="15" y="125" font-size="9" fill="#9ba3bf">BEGIN TXN</text>
        ${arrow(75, 128, 145, 128, true, "#6366f1")}
        <text x="150" y="125" font-size="9" fill="#9ba3bf">UPDATE balance</text>
        ${arrow(265, 128, 335, 128, true, "#6366f1")}
        <text x="340" y="125" font-size="9" fill="#9ba3bf">INSERT log</text>
        ${arrow(430, 128, 480, 128, true, "#6366f1")}
        <text x="485" y="125" font-size="9" fill="#9ba3bf">COMMIT</text>
        <text x="10" y="165" font-size="10" fill="#5c6380">→ If any step fails: ROLLBACK — entire transaction reverted</text>
        <rect x="5" y="110" width="510" height="30" rx="6" fill="none" stroke="#4b5280" stroke-dasharray="4 4" opacity=".4"/>
      </svg>`;
    },
  };

  DIAGRAMS["p6t2"] = {
    title: "Database Replication",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${cylinder(185, 30, 90, 65, "Primary DB", C.db)}
        ${cylinder(40, 110, 80, 60, "Replica 1", C.neutral)}
        ${cylinder(180, 110, 80, 60, "Replica 2", C.neutral)}
        ${cylinder(320, 110, 80, 60, "Replica 3", C.neutral)}
        ${box(390, 20, 110, 42, "App Writes", C.client, 8)}
        ${box(390, 75, 110, 42, "App Reads", C.server, 8, "Read from replica")}
        ${arrow(390, 42, 275, 55, true, C.client.stroke, "WRITE")}
        ${arrow(230, 95, 80, 110, true, C.db.stroke, "replicate")}
        ${arrow(230, 95, 220, 110, true, C.db.stroke)}
        ${arrow(230, 95, 360, 110, true, C.db.stroke)}
        ${arrow(360, 130, 390, 95, true, C.server.stroke, "READ")}
        <text x="10" y="178" font-size="9" fill="#5c6380">Primary handles all writes → async/sync replication to replicas → reads distributed</text>
      </svg>`;
    },
  };

  /* ─────────────────────────────────────────────────
     Part 3 — Caching
  ───────────────────────────────────────────────── */

  DIAGRAMS["p7t2"] = {
    title: "Cache-Aside Pattern",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 80, 90, 45, "App Server", C.server)}
        ${box(190, 40, 100, 45, "Redis Cache", C.cache, 10, "TTL: 300s")}
        ${cylinder(190, 120, 100, 55, "Database", C.db)}
        <text x="135" y="55" font-size="9" fill="#f59e0b" font-weight="600">1. Cache hit?</text>
        ${arrow(100, 95, 190, 65, true, C.cache.stroke, "GET key")}
        ${arrow(190, 75, 100, 100, true, C.server.stroke, "HIT → data")}
        <text x="135" y="135" font-size="9" fill="#a855f7" font-weight="600">2. Cache miss</text>
        ${arrow(100, 105, 190, 140, true, C.db.stroke, "MISS → DB")}
        ${arrow(190, 155, 100, 110, true, C.server.stroke, "data")}
        ${arrow(290, 62, 340, 62, true, C.cache.stroke)}
        ${box(345, 42, 110, 40, "SET key=data\nEXPIRE 300", C.cache, 8)}
        <text x="10" y="185" font-size="9" fill="#5c6380">Read: check cache → miss → DB → populate cache → respond</text>
      </svg>`;
    },
  };

  DIAGRAMS["p7t7"] = {
    title: "Redis Architecture",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 75, 100, 42, "App Cluster", C.server)}
        ${box(160, 20, 100, 38, "String/Hash", C.cache, 8, "SET k v")}
        ${box(160, 70, 100, 38, "List/Set", C.cache, 8, "LPUSH / SADD")}
        ${box(160, 120, 100, 38, "Sorted Set", C.cache, 8, "ZADD score")}
        ${box(320, 65, 90, 50, "Redis\nPrimary", C.cache, 10)}
        ${box(430, 35, 80, 42, "Replica", C.neutral)}
        ${box(430, 90, 80, 42, "Replica", C.neutral)}
        ${arrow(110, 95, 160, 39, true, C.server.stroke)}
        ${arrow(110, 95, 160, 89, true, C.server.stroke)}
        ${arrow(110, 95, 160, 139, true, C.server.stroke)}
        ${arrow(260, 39, 320, 82, true, C.cache.stroke)}
        ${arrow(260, 89, 320, 90, true, C.cache.stroke)}
        ${arrow(260, 139, 320, 98, true, C.cache.stroke)}
        ${arrow(410, 82, 430, 56, true, C.cache.stroke, "async")}
        ${arrow(410, 90, 430, 111, true, C.cache.stroke)}
        <text x="10" y="175" font-size="9" fill="#5c6380">Single-threaded event loop · sub-millisecond latency · in-memory persistence</text>
      </svg>`;
    },
  };

  /* ─────────────────────────────────────────────────
     Part 4 — Message Queues / Kafka
  ───────────────────────────────────────────────── */

  DIAGRAMS["p8t5"] = {
    title: "Kafka Architecture",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 80, 80, 42, "Producer A", C.client)}
        ${box(10, 135, 80, 42, "Producer B", C.client)}
        <rect x="130" y="20" width="200" height="170" rx="12" fill="#33220a" stroke="#d97706" stroke-width="1.5" opacity=".4"/>
        <text x="230" y="40" text-anchor="middle" font-size="11" font-weight="700" fill="#d97706">Kafka Broker</text>
        ${box(145, 50, 170, 30, "Topic: orders  [P0|P1|P2]", C.queue, 6)}
        ${box(145, 90, 170, 30, "Topic: payments [P0|P1]", C.queue, 6)}
        ${box(145, 130, 170, 30, "Topic: events   [P0|P1]", C.queue, 6)}
        ${box(145, 160, 170, 20, "Consumer Group offset →", C.neutral, 4)}
        ${box(370, 55, 100, 38, "Order Svc", C.server)}
        ${box(370, 105, 100, 38, "Notify Svc", C.svc)}
        ${box(370, 155, 100, 38, "Analytics", C.cdn)}
        ${arrow(90, 95, 145, 100, true, C.client.stroke)}
        ${arrow(90, 150, 145, 145, true, C.client.stroke)}
        ${arrow(315, 65, 370, 74, true, C.queue.stroke)}
        ${arrow(315, 105, 370, 124, true, C.queue.stroke)}
        ${arrow(315, 145, 370, 174, true, C.queue.stroke)}
      </svg>`;
    },
  };

  DIAGRAMS["p8t4"] = {
    title: "Message Queue — Pub/Sub Pattern",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 170" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 65, 85, 42, "Publisher", C.client)}
        ${box(175, 50, 110, 70, "Message\nBroker", C.queue, 10, "RabbitMQ / SQS")}
        ${box(355, 25, 95, 38, "Subscriber 1", C.server)}
        ${box(355, 75, 95, 38, "Subscriber 2", C.svc)}
        ${box(355, 125, 95, 38, "Subscriber 3", C.cdn)}
        ${arrow(95, 86, 175, 86, true, C.client.stroke, "publish")}
        ${arrow(285, 70, 355, 44, true, C.queue.stroke, "fan-out")}
        ${arrow(285, 85, 355, 94, true, C.queue.stroke)}
        ${arrow(285, 100, 355, 144, true, C.queue.stroke)}
        <text x="10" y="162" font-size="9" fill="#5c6380">Publisher sends once → broker routes to all subscribers (decoupled)</text>
      </svg>`;
    },
  };

  /* ─────────────────────────────────────────────────
     Part 5 — System Design Patterns
  ───────────────────────────────────────────────── */

  DIAGRAMS["p12t2"] = {
    title: "E-Commerce System Architecture",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 10, 70, 38, "Web/Mobile", C.client)}
        ${box(130, 10, 90, 38, "API Gateway", C.api, 10, "Auth · RL")}
        ${box(270, 10, 80, 38, "Orders Svc", C.server)}
        ${box(270, 60, 80, 38, "Catalog Svc", C.server)}
        ${box(270, 110, 80, 38, "Payment Svc", C.svc)}
        ${box(270, 160, 80, 38, "Notify Svc", C.svc)}
        ${cylinder(400, 10, 80, 45, "OrdersDB", C.db)}
        ${cylinder(400, 65, 80, 45, "CatalogDB", C.db)}
        ${box(400, 120, 80, 38, "Redis Cache", C.cache)}
        ${box(400, 168, 80, 38, "Kafka Queue", C.queue)}
        ${arrow(80, 29, 130, 29, true, C.client.stroke)}
        ${arrow(220, 29, 270, 29, true, C.api.stroke)}
        ${arrow(220, 29, 270, 79, true, C.api.stroke)}
        ${arrow(220, 29, 270, 129, true, C.api.stroke)}
        ${arrow(220, 29, 270, 179, true, C.api.stroke)}
        ${arrow(350, 29, 400, 30, true, C.server.stroke)}
        ${arrow(350, 79, 400, 86, true, C.server.stroke)}
        ${arrow(350, 129, 400, 139, true, C.cache.stroke)}
        ${arrow(350, 179, 400, 187, true, C.svc.stroke)}
      </svg>`;
    },
  };

  DIAGRAMS["p5t1"] = {
    title: "Microservices Architecture",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 80, 90, 45, "Client", C.client)}
        ${box(140, 70, 100, 60, "API Gateway", C.api, 10, "Auth · Route")}
        ${box(295, 20, 95, 42, "User Service", C.server)}
        ${box(295, 75, 95, 42, "Order Service", C.server)}
        ${box(295, 130, 95, 42, "Cart Service", C.svc)}
        ${box(420, 20, 85, 42, "UserDB", C.db)}
        ${box(420, 75, 85, 42, "OrderDB", C.db)}
        ${box(420, 130, 85, 42, "Redis", C.cache)}
        ${box(140, 155, 100, 38, "Event Bus", C.queue, 8, "Kafka")}
        ${arrow(100, 102, 140, 102, true, C.client.stroke)}
        ${arrow(240, 88, 295, 41, true, C.api.stroke)}
        ${arrow(240, 100, 295, 96, true, C.api.stroke)}
        ${arrow(240, 112, 295, 151, true, C.api.stroke)}
        ${arrow(390, 41, 420, 41, true, C.server.stroke)}
        ${arrow(390, 96, 420, 96, true, C.server.stroke)}
        ${arrow(390, 151, 420, 151, true, C.svc.stroke)}
        ${arrow(295, 120, 190, 155, true, C.queue.stroke, "events")}
      </svg>`;
    },
  };

  DIAGRAMS["p1t25"] = {
    title: "Content Delivery Network (CDN)",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 175" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 70, 80, 42, "User (JP)", C.client)}
        ${box(10, 125, 80, 42, "User (EU)", C.client)}
        ${box(200, 35, 90, 42, "CDN Edge\nTokyo", C.cdn)}
        ${box(200, 100, 90, 42, "CDN Edge\nLondon", C.cdn)}
        ${box(360, 68, 90, 55, "Origin\nServer (US)", C.server)}
        ${cylinder(470, 68, 50, 55, "S3", C.storage)}
        ${arrow(90, 91, 200, 56, true, C.client.stroke, "1")}
        ${arrow(90, 144, 200, 121, true, C.client.stroke, "1")}
        ${arrow(290, 56, 360, 82, true, C.cdn.stroke, "cache miss")}
        ${arrow(290, 121, 360, 100, true, C.cdn.stroke, "cache miss")}
        ${arrow(450, 82, 470, 90, true, C.server.stroke)}
        ${arrow(200, 68, 90, 100, false, C.cdn.stroke, "2. hit")}
        <text x="10" y="170" font-size="9" fill="#5c6380">Cache HIT: served from nearest edge (sub-10ms) · MISS: fetch origin → cache</text>
      </svg>`;
    },
  };

  /* ─────────────────────────────────────────────────
     Part 6 — Scaling & Load Balancing
  ───────────────────────────────────────────────── */

  DIAGRAMS["p6t1"] = {
    title: "Horizontal vs Vertical Scaling",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        <text x="125" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#ef4444">Vertical (Scale Up)</text>
        <text x="385" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#10b981">Horizontal (Scale Out)</text>
        <rect x="5" y="25" width="240" height="165" rx="10" fill="#ef4444" opacity=".05" stroke="#ef4444" stroke-width="1" stroke-dasharray="4 4"/>
        <rect x="265" y="25" width="245" height="165" rx="10" fill="#10b981" opacity=".05" stroke="#10b981" stroke-width="1" stroke-dasharray="4 4"/>
        ${box(75, 60, 100, 50, "Server", { fill: "#3d1610", stroke: "#ef4444", text: "#fecaca" }, 10, "4 CPU / 16 GB")}
        ${arrow(125, 110, 125, 155, false, "#ef4444")}
        ${box(75, 155, 100, 50, "Big Server", { fill: "#5a1a10", stroke: "#ef4444", text: "#fecaca" }, 10, "32 CPU / 128 GB")}
        ${box(285, 55, 85, 40, "Server 1", C.server)}
        ${box(385, 55, 85, 40, "Server 2", C.server)}
        ${box(285, 115, 85, 40, "Server 3", C.server)}
        ${box(385, 115, 85, 40, "Server 4", C.server)}
        ${box(315, 170, 90, 20, "Load Balancer", C.lb, 4)}
        ${arrow(335, 170, 327, 95, false, "#10b981")}
        ${arrow(390, 170, 427, 95, false, "#10b981")}
      </svg>`;
    },
  };

  DIAGRAMS["p6t5"] = {
    title: "Load Balancing Algorithms",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 75, 110, 45, "Load Balancer", C.lb, 10)}
        ${box(190, 30, 95, 40, "Server A", C.server, 10, "connections: 12")}
        ${box(190, 80, 95, 40, "Server B", C.server, 10, "connections: 5")}
        ${box(190, 130, 95, 40, "Server C", C.server, 10, "connections: 20")}
        ${box(355, 75, 125, 45, "Algorithms", C.neutral, 10)}
        <text x="365" y="95" font-size="9" fill="#9ba3bf">• Round Robin</text>
        <text x="365" y="108" font-size="9" fill="#9ba3bf">• Least Connections</text>
        <text x="365" y="121" font-size="9" fill="#9ba3bf">• IP Hash</text>
        ${arrow(120, 97, 190, 50, true, C.lb.stroke, "R1")}
        ${arrow(120, 97, 190, 100, true, "#10b981", "R2 ← least")}
        ${arrow(120, 97, 190, 150, true, C.lb.stroke, "R3")}
        <text x="10" y="185" font-size="9" fill="#5c6380">Health checks every 5s — unhealthy servers removed from pool automatically</text>
      </svg>`;
    },
  };

  DIAGRAMS["p3t9"] = {
    title: "Rate Limiting (Token Bucket)",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 60, 90, 45, "API Client", C.client)}
        ${box(165, 45, 120, 75, "Token Bucket", C.cache, 10, "100 req/min")}
        ${box(355, 60, 100, 45, "API Server", C.server)}
        ${box(355, 120, 100, 45, "429 Too Many\nRequests", { fill: "#5a1a10", stroke: "#ef4444", text: "#fecaca" }, 8)}
        ${arrow(100, 82, 165, 82, true, C.client.stroke, "request")}
        ${arrow(285, 75, 355, 82, true, "#10b981", "token OK")}
        ${arrow(285, 95, 355, 138, true, "#ef4444", "no token")}
        <text x="175" y="135" font-size="9" fill="#f59e0b">+ 1 token/600ms</text>
        <text x="175" y="148" font-size="9" fill="#f59e0b">max 100 tokens</text>
        <text x="10" y="175" font-size="9" fill="#5c6380">Tokens refill at fixed rate · burst allowed up to bucket size</text>
      </svg>`;
    },
  };

  /* ─────────────────────────────────────────────────
     Part 7 — Security & Auth
  ───────────────────────────────────────────────── */

  DIAGRAMS["p3t3"] = {
    title: "JWT Authentication Flow",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 195" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 20, 90, 42, "Client App", C.client)}
        ${box(190, 20, 100, 42, "Auth Service", C.api, 10, "login endpoint")}
        ${box(190, 90, 100, 42, "JWT Validator", C.server, 10, "verify signature")}
        ${box(190, 160, 100, 42, "API Server", C.server)}
        ${box(360, 90, 120, 42, "JWT Payload", C.neutral, 8)}
        <text x="365" y="110" font-size="8" fill="#9ba3bf">userId, role, exp</text>
        <text x="365" y="122" font-size="8" fill="#9ba3bf">signed w/ secret</text>
        ${arrow(100, 41, 190, 41, true, C.client.stroke, "1. POST /login")}
        ${arrow(190, 51, 100, 55, true, C.api.stroke, "2. JWT token")}
        ${arrow(55, 62, 55, 178, false, C.client.stroke)}
        ${arrow(55, 178, 190, 178, true, C.client.stroke, "3. Bearer token")}
        ${arrow(290, 111, 360, 111, true, C.server.stroke, "decode")}
        ${arrow(190, 178, 190, 132, false, C.server.stroke)}
        <text x="10" y="192" font-size="9" fill="#5c6380">Stateless — no DB lookup needed to validate token (self-contained)</text>
      </svg>`;
    },
  };

  DIAGRAMS["p3t4"] = {
    title: "OAuth 2.0 Authorization Code Flow",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 80, 80, 42, "User App", C.client)}
        ${box(170, 35, 100, 42, "Auth Server\n(Google)", C.api)}
        ${box(170, 105, 100, 42, "Resource\nServer", C.server)}
        ${box(350, 70, 110, 55, "Tokens", C.cache, 10)}
        <text x="358" y="92" font-size="9" fill="#fef3c7">access_token (1h)</text>
        <text x="358" y="106" font-size="9" fill="#fef3c7">refresh_token (30d)</text>
        ${arrow(90, 95, 170, 56, true, C.client.stroke, "1. login")}
        ${arrow(170, 66, 90, 98, true, C.api.stroke, "2. auth code")}
        ${arrow(90, 105, 170, 76, true, C.client.stroke, "3. code+secret")}
        ${arrow(270, 56, 350, 90, true, C.api.stroke, "4. tokens")}
        ${arrow(90, 112, 170, 126, true, C.client.stroke, "5. access_token")}
        ${arrow(170, 136, 90, 118, true, C.server.stroke, "6. data")}
        <text x="10" y="192" font-size="9" fill="#5c6380">Never expose source code — exchange auth code server-side for tokens</text>
      </svg>`;
    },
  };

  /* ─────────────────────────────────────────────────
     Part 8 — API Design
  ───────────────────────────────────────────────── */

  DIAGRAMS["p5t6"] = {
    title: "API Gateway Pattern",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 80, 80, 42, "Mobile", C.client)}
        ${box(10, 135, 80, 42, "Web SPA", C.client)}
        ${box(145, 65, 110, 75, "API Gateway", C.api, 12, "Auth·Rate·Route·Log")}
        ${box(320, 25, 90, 38, "User Svc", C.server)}
        ${box(320, 75, 90, 38, "Product Svc", C.server)}
        ${box(320, 125, 90, 38, "Order Svc", C.svc)}
        ${box(320, 167, 90, 30, "Billing Svc", C.svc)}
        ${box(425, 90, 85, 42, "Observ.\nStack", C.neutral)}
        ${arrow(90, 101, 145, 101, true, C.client.stroke)}
        ${arrow(90, 154, 145, 110, true, C.client.stroke)}
        ${arrow(255, 80, 320, 44, true, C.api.stroke)}
        ${arrow(255, 100, 320, 94, true, C.api.stroke)}
        ${arrow(255, 115, 320, 144, true, C.api.stroke)}
        ${arrow(255, 125, 320, 182, true, C.api.stroke)}
        ${arrow(255, 102, 425, 111, true, "#4b5280", "metrics")}
        <text x="10" y="194" font-size="9" fill="#5c6380">Single entry point — cross-cutting concerns handled once</text>
      </svg>`;
    },
  };

  DIAGRAMS["p2t10"] = {
    title: "GraphQL vs REST",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 195" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        <text x="130" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#9ba3bf">REST — Multiple Round Trips</text>
        <text x="390" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#9ba3bf">GraphQL — One Query</text>
        ${box(10, 130, 70, 38, "Client", C.client)}
        ${box(100, 50, 80, 30, "GET /user/1", C.server, 6)}
        ${box(100, 90, 80, 30, "GET /posts?u=1", C.server, 6)}
        ${box(100, 130, 80, 30, "GET /friends?u=1", C.server, 6)}
        ${arrow(80, 149, 100, 65, true, C.client.stroke, "1")}
        ${arrow(80, 149, 100, 105, true, C.client.stroke, "2")}
        ${arrow(80, 149, 100, 145, true, C.client.stroke, "3")}
        ${box(270, 130, 70, 38, "Client", C.client)}
        ${box(360, 60, 140, 100, "GraphQL\nResolver", C.api, 10)}
        <text x="368" y="88" font-size="9" fill="#ede9fe">query { user(id:1) {</text>
        <text x="378" y="101" font-size="9" fill="#ede9fe">name posts friends}}</text>
        ${arrow(340, 149, 360, 110, true, C.client.stroke, "single")}
        ${arrow(360, 130, 340, 155, true, C.api.stroke, "exact data")}
        <text x="10" y="188" font-size="9" fill="#5c6380">REST: over-fetching/under-fetching | GraphQL: get exactly what you need</text>
      </svg>`;
    },
  };

  /* ─────────────────────────────────────────────────
     Part 9 — Cloud & Containers
  ───────────────────────────────────────────────── */

  DIAGRAMS["p10t5"] = {
    title: "Container Orchestration (Kubernetes)",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 195" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        <rect x="5" y="5" width="510" height="185" rx="14" fill="#0e4a6e" opacity=".12" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="5 3"/>
        <text x="260" y="24" text-anchor="middle" font-size="11" font-weight="700" fill="#06b6d4">Kubernetes Cluster</text>
        ${box(15, 35, 90, 42, "kubectl", C.client, 8)}
        ${box(125, 35, 90, 42, "API Server", C.api, 8)}
        ${box(235, 35, 80, 42, "Scheduler", C.neutral, 8)}
        ${box(335, 35, 80, 42, "etcd", C.db, 8, "state")}
        <rect x="15" y="95" width="115" height="90" rx="10" fill="#1a5f4a" opacity=".15" stroke="#10b981" stroke-width="1"/>
        <text x="72" y="112" text-anchor="middle" font-size="10" font-weight="700" fill="#10b981">Node 1</text>
        ${box(22, 115, 48, 28, "Pod A", C.server, 6)}
        ${box(76, 115, 48, 28, "Pod B", C.server, 6)}
        ${box(22, 148, 48, 28, "Pod C", C.svc, 6)}
        <rect x="148" y="95" width="115" height="90" rx="10" fill="#1a5f4a" opacity=".15" stroke="#10b981" stroke-width="1"/>
        <text x="205" y="112" text-anchor="middle" font-size="10" font-weight="700" fill="#10b981">Node 2</text>
        ${box(155, 115, 48, 28, "Pod D", C.server, 6)}
        ${box(209, 115, 48, 28, "Pod E", C.svc, 6)}
        ${box(355, 100, 130, 42, "LoadBalancer\nService", C.lb, 8)}
        ${box(355, 155, 130, 35, "Ingress", C.api, 6)}
        ${arrow(105, 56, 125, 56, true, C.client.stroke)}
        ${arrow(215, 56, 235, 56, true, C.api.stroke)}
        ${arrow(315, 56, 335, 56, true, C.neutral.stroke)}
        ${arrow(235, 78, 100, 95, true, "#06b6d4")}
        ${arrow(235, 78, 205, 95, true, "#06b6d4")}
        ${arrow(355, 120, 265, 135, true, C.lb.stroke)}
      </svg>`;
    },
  };

  DIAGRAMS["p11t1"] = {
    title: "CI/CD Pipeline",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 130" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(5, 45, 70, 40, "Dev Commit", C.client, 8, "git push")}
        ${box(90, 45, 70, 40, "CI Build", C.queue, 8, "compile")}
        ${box(175, 45, 70, 40, "Unit Tests", C.server, 8, "pytest/jest")}
        ${box(260, 45, 70, 40, "Docker\nBuild", C.cdn, 8)}
        ${box(345, 45, 70, 40, "Staging\nDeploy", C.svc, 8)}
        ${box(430, 45, 78, 40, "Prod Deploy", C.api, 8, "canary")}
        ${arrow(75, 65, 90, 65, true, C.client.stroke)}
        ${arrow(160, 65, 175, 65, true, C.queue.stroke)}
        ${arrow(245, 65, 260, 65, true, C.server.stroke)}
        ${arrow(330, 65, 345, 65, true, C.cdn.stroke)}
        ${arrow(415, 65, 430, 65, true, C.svc.stroke)}
        <text x="10" y="115" font-size="9" fill="#5c6380">Fail fast — any step failure blocks promotion · rollback in seconds</text>
      </svg>`;
    },
  };

  /* ─────────────────────────────────────────────────
     Part 10 — Observability
  ───────────────────────────────────────────────── */

  DIAGRAMS["p11t3"] = {
    title: "Observability: Metrics, Logs, Traces",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 185" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(170, 10, 180, 45, "Microservices Cluster", C.server, 12, "Service A → B → C")}
        ${box(10, 100, 110, 42, "Metrics\nPrometheus", C.svc, 10)}
        ${box(140, 100, 110, 42, "Logs\nElastic/Loki", C.db, 10)}
        ${box(270, 100, 110, 42, "Traces\nJaeger/Tempo", C.cdn, 10)}
        ${box(400, 100, 110, 42, "Alerting\nPagerDuty", { fill: "#5a1a10", stroke: "#ef4444", text: "#fecaca" }, 10)}
        ${box(140, 160, 240, 22, "Grafana Dashboard", C.api, 6)}
        ${arrow(200, 55, 65, 100, true, C.server.stroke, "scrape")}
        ${arrow(260, 55, 195, 100, true, C.server.stroke, "logs")}
        ${arrow(300, 55, 325, 100, true, C.server.stroke, "spans")}
        ${arrow(350, 55, 455, 100, true, "#ef4444", "alerts")}
        ${arrow(65, 142, 195, 165, true, C.svc.stroke)}
        ${arrow(195, 142, 260, 168, true, C.db.stroke)}
        ${arrow(325, 142, 310, 168, true, C.cdn.stroke)}
      </svg>`;
    },
  };

  /* ─────────────────────────────────────────────────
     Part 11 — Distributed Systems
  ───────────────────────────────────────────────── */

  DIAGRAMS["p12t4"] = {
    title: "CAP Theorem",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        <polygon points="260,20 80,170 440,170" fill="none" stroke="#4b5280" stroke-width="1.5" opacity=".4"/>
        ${box(215, 8, 90, 36, "Consistency", C.db, 8)}
        ${box(30, 158, 100, 36, "Availability", C.server, 8)}
        ${box(385, 158, 120, 36, "Partition Tol.", C.cdn, 8)}
        ${box(115, 95, 90, 30, "CA Systems\nMySQL", C.neutral, 6)}
        ${box(295, 95, 90, 30, "CP Systems\nMongoDB", C.neutral, 6)}
        ${box(205, 155, 100, 28, "AP Systems\nCassandra", C.neutral, 6)}
        <text x="260" y="193" text-anchor="middle" font-size="9" fill="#5c6380">Choose 2 of 3 — network partitions always happen → choose CP or AP</text>
      </svg>`;
    },
  };

  DIAGRAMS["p6t4"] = {
    title: "Consistent Hashing",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        <circle cx="220" cy="100" r="80" fill="none" stroke="#4b5280" stroke-width="2"/>
        ${box(180, 10, 80, 30, "Server A", C.server, 6)}
        ${box(310, 55, 80, 30, "Server B", C.svc, 6)}
        ${box(295, 145, 80, 30, "Server C", C.cdn, 6)}
        ${box(60, 145, 80, 30, "Server D", C.db, 6)}
        <circle cx="220" cy="22" r="6" fill="#10b981"/>
        <circle cx="292" cy="72" r="6" fill="#22d3ee"/>
        <circle cx="270" cy="172" r="6" fill="#06b6d4"/>
        <circle cx="142" cy="172" r="6" fill="#a855f7"/>
        <circle cx="148" cy="72" r="5" fill="#f59e0b"/>
        <circle cx="180" cy="30" r="5" fill="#f59e0b"/>
        <circle cx="260" cy="30" r="5" fill="#f59e0b"/>
        <text x="148" y="60" font-size="9" fill="#f59e0b">key1</text>
        <text x="177" y="29" font-size="9" fill="#f59e0b">key2</text>
        <text x="261" y="28" font-size="9" fill="#f59e0b">key3</text>
        ${box(380, 90, 130, 70, "Add/Remove\nServer", C.neutral, 8)}
        <text x="388" y="125" font-size="9" fill="#9ba3bf">Only K/N keys</text>
        <text x="388" y="139" font-size="9" fill="#9ba3bf">remapped</text>
        <text x="10" y="188" font-size="9" fill="#5c6380">Keys map clockwise to nearest server — minimal redistribution on resize</text>
      </svg>`;
    },
  };

  /* ─────────────────────────────────────────────────
     Part 12 — Real-world / Interview
  ───────────────────────────────────────────────── */

  DIAGRAMS["p12t1"] = {
    title: "URL Shortener Architecture",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 80, 80, 40, "Browser", C.client)}
        ${box(140, 60, 100, 40, "API Gateway", C.api)}
        ${box(140, 110, 100, 40, "Redirect Svc", C.server, 8, "302 Found")}
        ${box(310, 40, 90, 40, "ID Generator", C.svc, 8, "Base62")}
        ${cylinder(310, 95, 90, 50, "Redis\n+DB", C.cache)}
        ${box(310, 155, 90, 30, "Analytics", C.neutral, 6)}
        ${arrow(90, 100, 140, 80, true, C.client.stroke, "POST url")}
        ${arrow(90, 100, 140, 130, true, C.client.stroke, "GET /abc")}
        ${arrow(240, 80, 310, 60, true, C.api.stroke, "create")}
        ${arrow(310, 60, 240, 85, false, C.svc.stroke, "abc123")}
        ${arrow(240, 130, 310, 118, true, C.server.stroke, "lookup")}
        ${arrow(310, 130, 240, 140, false, C.cache.stroke, "long url")}
        ${arrow(310, 145, 310, 155, true, C.cache.stroke, "log hit")}
      </svg>`;
    },
  };

  DIAGRAMS["p12t3"] = {
    title: "Design Twitter/X Feed Architecture",
    render() {
      return `<svg class="svgd-svg" viewBox="0 0 520 195" xmlns="http://www.w3.org/2000/svg">
        ${DEFS}
        ${box(10, 80, 70, 40, "Client", C.client)}
        ${box(130, 50, 90, 38, "Write API", C.api, 8, "POST tweet")}
        ${box(130, 100, 90, 38, "Read API", C.server, 8, "GET feed")}
        ${box(280, 15, 80, 35, "Tweet DB", C.db)}
        ${box(280, 60, 80, 35, "Fan-out\nWorker", C.queue)}
        ${box(280, 105, 80, 35, "User Timeline\nRedis", C.cache, 8)}
        ${box(280, 150, 80, 35, "Social Graph\nDB", C.svc)}
        ${box(415, 60, 90, 80, "Feed Cache\nRedis Cluster", C.cache, 10)}
        ${arrow(80, 95, 130, 69, true, C.client.stroke)}
        ${arrow(80, 100, 130, 119, true, C.client.stroke)}
        ${arrow(220, 69, 280, 32, true, C.api.stroke, "save")}
        ${arrow(220, 75, 280, 77, true, C.api.stroke, "fanout")}
        ${arrow(280, 170, 130, 125, true, C.svc.stroke, "followers")}
        ${arrow(360, 77, 415, 95, true, C.queue.stroke, "push")}
        ${arrow(360, 120, 415, 120, true, C.cache.stroke, "user feed")}
        ${arrow(415, 100, 220, 110, false, C.cache.stroke, "serve")}
      </svg>`;
    },
  };

  /* ─────────────────────────────────────────────────
     Generic fallback — topic class based
  ───────────────────────────────────────────────── */

  function genericDiagram(topic) {
    const type = topic.id.slice(0, 2);
    const maps = {
      p1: "p1t1",
      p2: "p2t1",
      p3: "p3t3",
      p4: "p4t1",
      p5: "p5t1",
      p6: "p6t1",
      p7: "p7t2",
      p8: "p8t1",
      p10: "p10t5",
      p11: "p11t1",
      p12: "p12t1",
    };
    return DIAGRAMS[maps[type]] || null;
  }

  /* ─────────────────────────────────────────────────
     Public API
  ───────────────────────────────────────────────── */

  function buildPanel(topicId, diag) {
    const legendHTML = (diag.legend || [])
      .map(
        (l) =>
          `<div class="svgd-legend-item">
            <div class="svgd-legend-dot" style="background:${l.color}"></div>
            <span>${l.label}</span>
          </div>`,
      )
      .join("");

    return `<div class="svgd-wrap" data-topicid="${topicId}">
      <div class="svgd-title">
        <span style="color:var(--accent)">◈</span>
        ${diag.title}
      </div>
      ${diag.render()}
      ${legendHTML ? `<div class="svgd-legend">${legendHTML}</div>` : ""}
      <div class="svgd-info" id="svgd-info-${topicId}">
        <strong>Click any component</strong> to learn more about it.
      </div>
    </div>`;
  }

  window.SVGDiagrams = {
    hasDiagram(topicId) {
      const topic = { id: topicId };
      return !!(DIAGRAMS[topicId] || genericDiagram(topic));
    },

    render(topicId, container) {
      injectCSS();
      const diag = DIAGRAMS[topicId];
      if (!diag) {
        const fb = genericDiagram({ id: topicId });
        if (fb) {
          container.innerHTML = buildPanel(topicId, {
            ...fb,
            title: fb.title + " (Overview)",
          });
          return;
        }
        container.innerHTML = "";
        return;
      }
      container.innerHTML = buildPanel(topicId, diag);
    },

    /* Called by inline onclick="SVGDiagrams._info(...)" */
    _info(event, label) {
      const wrap = event.currentTarget.closest("[data-topicid]");
      if (!wrap) return;
      const panel = wrap.querySelector(".svgd-info");
      if (!panel) return;
      const desc = NODE_DESCRIPTIONS[label] || "";
      panel.innerHTML = desc
        ? `<strong>${label}</strong> — ${desc}`
        : `<strong>${label}</strong>`;
      panel.classList.add("visible");
    },
  };

  /* Node descriptions for interactive tooltips */
  const NODE_DESCRIPTIONS = {
    Browser:
      "The user-facing client. Sends HTTP requests, renders HTML/CSS/JS.",
    "Mobile App":
      "Native or hybrid client. Communicates via REST or GraphQL APIs.",
    "Web Server":
      "Processes incoming HTTP requests, runs business logic, returns responses.",
    Database:
      "Persistent storage layer. Stores structured (SQL) or flexible (NoSQL) data.",
    "API Gateway":
      "Single entry point for all clients. Handles auth, rate limiting, routing, logging.",
    "Load Balancer":
      "Distributes traffic across multiple server instances. Enables horizontal scaling.",
    "Redis Cache":
      "In-memory key-value store. Sub-millisecond reads. Used for sessions, caching, pub/sub.",
    CDN: "Global edge network. Serves static assets from PoPs close to users. Reduces latency.",
    "Kafka Broker":
      "High-throughput distributed log. Producers write, consumers read at their own pace.",
    "Auth Service":
      "Issues and validates credentials. Manages sessions, JWTs, OAuth tokens.",
    "JWT Validator":
      "Verifies token signature using secret key. Decodes claims. No DB lookup needed.",
    DNS: "Translates domain names to IP addresses. Cached at multiple layers for performance.",
    "Root DNS":
      "Top-level authority. Delegates to TLD servers (.com, .org, .io...).",
    "Order Svc":
      "Owns order lifecycle: create, confirm, ship, deliver. Emits order events.",
    "Order Service":
      "Manages order entities. Syncs with inventory, payments, and notification services.",
    "Notify Svc":
      "Sends emails, SMS, push notifications. Subscribes to domain events.",
    "Billing Service":
      "Handles payment processing, invoicing, refunds via payment gateway.",
    "Server A":
      "Application server instance. Stateless — can be replaced or scaled independently.",
    "Server B":
      "Application server instance. Same role as Server A — load balanced.",
    etcd: "Distributed key-value store used by Kubernetes to persist all cluster state.",
    Scheduler:
      "Kubernetes component that assigns Pods to Nodes based on resource availability.",
    "API Server":
      "Kubernetes control plane component. Validates and processes API objects.",
    "Grafana Dashboard":
      "Unified visualization layer. Queries Prometheus, Loki, Tempo and renders graphs.",
    "Fan-out Worker":
      "Background worker that pushes a new tweet to followers' timeline caches.",
    "Social Graph DB":
      "Stores follow relationships. Used to find followers when fanning out writes.",
  };
})();

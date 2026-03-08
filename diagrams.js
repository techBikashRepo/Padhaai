/* =====================================================
   diagrams.js  —  Architect Academy Diagram Engine
   Animated Flows | Interactive Diagrams | Companies | Library
   ===================================================== */

(function () {
  "use strict";

  /* ─────────────────────────────────────────────────── */
  /*  DATA: Animated Flows                               */
  /* ─────────────────────────────────────────────────── */

  const ANIMATED_FLOWS = [
    {
      id: "flow-website",
      title: "Opening a Website",
      icon: "🌐",
      description: "Step-by-step journey from browser to database and back",
      nodes: [
        { id: "n0", label: "User Browser", icon: "👤" },
        { id: "n1", label: "DNS Resolver", icon: "🔍" },
        { id: "n2", label: "CDN", icon: "🌍" },
        { id: "n3", label: "Load Balancer", icon: "⚖️" },
        { id: "n4", label: "Application Server", icon: "⚙️" },
        { id: "n5", label: "Database", icon: "🗄️" },
      ],
      steps: [
        {
          nodeId: "n0",
          title: "Step 1 — Browser Sends Request",
          desc: "Rahul types shopkart.com and hits Enter. The browser prepares an HTTP GET request and needs to find the server's IP address.",
        },
        {
          nodeId: "n1",
          title: "Step 2 — DNS Resolves Domain",
          desc: "DNS resolver translates shopkart.com → 13.234.56.78. The OS checks its cache first; on miss it queries the ISP's resolver → root DNS → TLD → authoritative DNS.",
        },
        {
          nodeId: "n2",
          title: "Step 3 — CDN Checks Cache",
          desc: "Request hits the nearest CloudFront edge node. If a cached copy of the page exists and is fresh, it returns immediately — no origin needed (~5ms).",
        },
        {
          nodeId: "n3",
          title: "Step 4 — Load Balancer Routes",
          desc: "CDN cache miss: request reaches the AWS ALB. It picks the least-busy application server using round-robin or least-connections algorithm.",
        },
        {
          nodeId: "n4",
          title: "Step 5 — Server Processes Request",
          desc: "The Node.js / Spring app parses the request, validates auth tokens, applies business logic, and determines what data it needs from the database.",
        },
        {
          nodeId: "n5",
          title: "Step 6 — Database Query Executed",
          desc: "A SQL or NoSQL query runs against the database. Index lookups make this fast (1–10ms for indexed queries). Results are returned to the app server.",
        },
        {
          nodeId: "n4",
          title: "Step 7 — Response Returned",
          desc: "The app server serialises the response to JSON, sets cache headers, and sends the HTTP 200 response back. The path reverses — LB → CDN caches it → browser renders.",
        },
      ],
    },
    {
      id: "flow-order",
      title: "Order Placement Flow",
      icon: "🛒",
      description: "How placing an order flows through microservices",
      nodes: [
        { id: "o0", label: "User", icon: "👤" },
        { id: "o1", label: "API Gateway", icon: "🚪" },
        { id: "o2", label: "Order Service", icon: "📋" },
        { id: "o3", label: "Payment Service", icon: "💳" },
        { id: "o4", label: "Inventory Service", icon: "📦" },
        { id: "o5", label: "Message Queue", icon: "📨" },
        { id: "o6", label: "Email Worker", icon: "📧" },
      ],
      steps: [
        {
          nodeId: "o0",
          title: "1️⃣ User Places Order",
          desc: "Rahul clicks 'Place Order'. The frontend sends POST /api/orders with cart items, delivery address, and payment details.",
        },
        {
          nodeId: "o1",
          title: "2️⃣ API Gateway Validates",
          desc: "Kong API Gateway checks JWT auth, enforces rate limits (max 5 orders/min per user), and routes to the Order Service on the internal network.",
        },
        {
          nodeId: "o2",
          title: "3️⃣ Order Service Creates Order",
          desc: "Order Service validates items are available, calculates total with taxes, writes a PENDING order record to its PostgreSQL database, and generates an order ID.",
        },
        {
          nodeId: "o3",
          title: "4️⃣ Payment Service Charges Card",
          desc: "Order Service calls Payment Service synchronously. Payment Service calls Stripe/Razorpay, charges the card, and returns a payment confirmation or failure.",
        },
        {
          nodeId: "o4",
          title: "5️⃣ Inventory Reserved",
          desc: "On payment success, Inventory Service is called to decrement stock. Uses optimistic locking to prevent overselling. Updates the order status to CONFIRMED.",
        },
        {
          nodeId: "o5",
          title: "6️⃣ Event Pushed to Queue",
          desc: "Order Service publishes an OrderConfirmed event to Kafka. This decouples downstream processing — the order flow is complete without waiting for email sending.",
        },
        {
          nodeId: "o6",
          title: "7️⃣ Email Worker Sends Confirmation",
          desc: "Email Worker consumes the event from Kafka, renders the confirmation email template with order details, and sends via SES. Failures are retried automatically.",
        },
      ],
    },
    {
      id: "flow-cache",
      title: "Cache Flow",
      icon: "⚡",
      description: "How Redis cache handles hits and misses",
      nodes: [
        { id: "c0", label: "User Request", icon: "👤" },
        { id: "c1", label: "App Server", icon: "⚙️" },
        { id: "c2", label: "Redis Cache", icon: "⚡" },
        { id: "c3", label: "Database", icon: "🗄️" },
      ],
      steps: [
        {
          nodeId: "c0",
          title: "Request Arrives",
          desc: "Rahul searches for 'running shoes'. The browser sends GET /api/search?q=running+shoes to the application server.",
        },
        {
          nodeId: "c1",
          title: "App Server Checks Cache",
          desc: "Before querying the database, the app server constructs the cache key: search:running+shoes and asks Redis: 'Do you have this?'",
        },
        {
          nodeId: "c2",
          title: "Cache Hit → Return Fast",
          desc: "✅ CACHE HIT: Redis returns the cached JSON in ~0.2ms. The app server skips the database entirely and returns the result to the user. No DB load.",
        },
        {
          nodeId: "c3",
          title: "Cache Miss → Query DB",
          desc: "❌ CACHE MISS: Redis returns NIL. The app queries PostgreSQL / Elasticsearch. This takes 20–50ms. Results come back from the database.",
        },
        {
          nodeId: "c2",
          title: "Store in Cache",
          desc: "The app server writes the result to Redis with a TTL (e.g., 5 minutes): SET search:running+shoes <result> EX 300. Future requests for the same query hit cache.",
        },
        {
          nodeId: "c0",
          title: "Response Returned",
          desc: "User receives the search results. Cache hit path = ~5ms total. Cache miss path = ~50ms. At scale, a 90% cache hit rate means 90% of users get 5ms responses.",
        },
      ],
    },
  ];

  /* ─────────────────────────────────────────────────── */
  /*  DATA: Interactive Diagrams                         */
  /* ─────────────────────────────────────────────────── */

  const INTERACTIVE_DIAGRAMS = [
    {
      id: "idia-microservices",
      title: "Microservices Architecture",
      icon: "🏗️",
      description: "Click any service to learn what it does",
      layout: "tree",
      nodes: [
        {
          id: "ims0",
          label: "Client",
          icon: "👤",
          x: 50,
          y: 0,
          info: {
            title: "Client (Browser / Mobile App)",
            body: "The frontend — Rahul's browser or the ShopKart mobile app. Sends HTTP requests to the API Gateway. Never communicates directly with individual microservices.",
          },
        },
        {
          id: "ims1",
          label: "API Gateway",
          icon: "🚪",
          x: 50,
          y: 1,
          info: {
            title: "API Gateway (Kong)",
            body: "Single entry point for all external traffic. Handles: JWT authentication, rate limiting (429 Too Many Requests), request routing to the correct service, SSL termination, request logging, and distributed tracing injection.",
          },
        },
        {
          id: "ims2",
          label: "User Service",
          icon: "👥",
          x: 10,
          y: 2,
          info: {
            title: "User Service",
            body: "Manages user accounts, authentication, and profiles. Issues JWTs on login. Stores data in its own PostgreSQL database. Other services validate JWTs but never call User Service for every request — they trust the token.",
          },
        },
        {
          id: "ims3",
          label: "Product Service",
          icon: "📦",
          x: 35,
          y: 2,
          info: {
            title: "Product Service",
            body: "Manages the product catalog: names, descriptions, images, categories, pricing. Backed by PostgreSQL for structured data and Elasticsearch for full-text search. Product images are stored in S3 and served via CloudFront CDN.",
          },
        },
        {
          id: "ims4",
          label: "Order Service",
          icon: "📋",
          x: 60,
          y: 2,
          info: {
            title: "Order Service",
            body: "Handles order lifecycle: creation, status updates, cancellation. Calls Payment Service and Inventory Service synchronously during checkout. Publishes OrderConfirmed events to Kafka for async downstream processing.",
          },
        },
        {
          id: "ims5",
          label: "Payment Service",
          icon: "💳",
          x: 85,
          y: 2,
          info: {
            title: "Payment Service",
            body: "Handles payment processing via Stripe/Razorpay. Stores payment records with their own database. Implements idempotency keys to prevent double charges on retries. PCI-DSS compliant — never stores raw card numbers.",
          },
        },
      ],
      connections: [
        { from: "ims0", to: "ims1" },
        { from: "ims1", to: "ims2" },
        { from: "ims1", to: "ims3" },
        { from: "ims1", to: "ims4" },
        { from: "ims1", to: "ims5" },
      ],
    },
    {
      id: "idia-msgqueue",
      title: "Message Queue Architecture",
      icon: "📨",
      description: "Click Producer, Queue, or Consumer to learn each role",
      layout: "linear",
      nodes: [
        {
          id: "mq0",
          label: "Producer",
          icon: "📤",
          info: {
            title: "Producer — Order Service",
            body: "The Order Service publishes events after successful order creation. It does NOT wait for emails or notifications to be sent — it just fires an event and moves on. This is asynchronous decoupling: the order flow completes in under 100ms regardless of what downstream systems do.",
          },
        },
        {
          id: "mq1",
          label: "Message Queue",
          icon: "📨",
          info: {
            title: "Message Queue — Apache Kafka",
            body: "Kafka stores events in ordered, immutable logs called topics. Unlike RabbitMQ, consumed messages are NOT deleted — they persist for a configured retention period (e.g., 7 days). Multiple consumers can independently read the same event. Kafka guarantees at-least-once delivery with durability across replicas.",
          },
        },
        {
          id: "mq2",
          label: "Email Worker",
          icon: "📧",
          info: {
            title: "Consumer — Email Worker",
            body: "An independent service that subscribes to the OrderConfirmed Kafka topic. Reads events, renders the email template, and sends via AWS SES. If SES is down, the worker retries with exponential backoff. Kafka remembers the last committed offset, so after recovery, the worker processes missed events in order.",
          },
        },
        {
          id: "mq3",
          label: "Analytics Worker",
          icon: "📊",
          info: {
            title: "Consumer — Analytics Worker",
            body: "Another independent consumer reading the SAME Kafka events. Updates analytics dashboards, revenue metrics, and reporting databases. Because Kafka retains messages, this service can replay past events to rebuild its data if it crashes or is deployed fresh.",
          },
        },
        {
          id: "mq4",
          label: "Push Notification",
          icon: "🔔",
          info: {
            title: "Consumer — Push Notification Service",
            body: "Sends mobile/web push notifications when orders are confirmed. Reads from the same topic as the email worker using a different consumer group. Consumer groups allow multiple services to independently track their own read position in the Kafka log.",
          },
        },
      ],
      connections: [
        { from: "mq0", to: "mq1" },
        { from: "mq1", to: "mq2" },
        { from: "mq1", to: "mq3" },
        { from: "mq1", to: "mq4" },
      ],
    },
  ];

  /* ─────────────────────────────────────────────────── */
  /*  DATA: Real Company Architectures                   */
  /* ─────────────────────────────────────────────────── */

  const COMPANY_ARCHITECTURES = [
    {
      id: "arch-amazon",
      company: "Amazon-style",
      title: "E-commerce Architecture",
      icon: "🛒",
      color: "#FF9900",
      diagram: [
        { label: "Users", icon: "👥", type: "user" },
        { label: "Route53 (DNS)", icon: "🔍", type: "infra" },
        { label: "CloudFront CDN", icon: "🌍", type: "infra" },
        { label: "Load Balancer", icon: "⚖️", type: "infra" },
        {
          label: "Microservices Cluster",
          icon: "🏗️",
          type: "service",
          children: [
            "User Service",
            "Product Service",
            "Order Service",
            "Payment Service",
          ],
        },
        {
          label: "Databases",
          icon: "🗄️",
          type: "data",
          children: ["User DB", "Product DB", "Order DB"],
        },
        { label: "Redis Cache", icon: "⚡", type: "cache" },
      ],
      insights: [
        "Route53 provides geo-routing: Indian users → Mumbai region, US users → Virginia",
        "CloudFront caches static assets at 450+ edge locations globally",
        "Each microservice has its own database — no shared DB across services",
        "Redis sits in front of DB for high-read endpoints like product catalog",
      ],
    },
    {
      id: "arch-netflix",
      company: "Netflix-style",
      title: "Streaming Architecture",
      icon: "🎬",
      color: "#E50914",
      diagram: [
        { label: "User Device", icon: "📱", type: "user" },
        { label: "CDN Edge Server", icon: "🌍", type: "infra" },
        { label: "Control Plane", icon: "🧠", type: "infra" },
        {
          label: "Microservices",
          icon: "🏗️",
          type: "service",
          children: ["Recommendation", "Playback", "User Profile", "Billing"],
        },
        {
          label: "Databases",
          icon: "🗄️",
          type: "data",
          children: [
            "Cassandra (events)",
            "MySQL (billing)",
            "Redis (sessions)",
          ],
        },
      ],
      insights: [
        "Video content is pre-encoded into 100+ bitrate/resolution variants and pushed to CDN edge nodes globally",
        "The CDN handles ~99% of video bytes — origin servers rarely serve video directly",
        "Recommendation engine processes billions of user interactions; serves from Redis cache",
        "Chaos Monkey randomly kills production instances to verify resilience at all times",
      ],
    },
    {
      id: "arch-uber",
      company: "Uber-style",
      title: "Real-Time Ride Architecture",
      icon: "🚗",
      color: "#000000",
      diagram: [
        { label: "Passenger App", icon: "📱", type: "user" },
        { label: "API Gateway", icon: "🚪", type: "infra" },
        { label: "Matching Service", icon: "🔄", type: "service" },
        { label: "Driver Service", icon: "🚗", type: "service" },
        { label: "Location Stream (Kafka)", icon: "📡", type: "queue" },
        { label: "Realtime Database", icon: "⚡", type: "data" },
      ],
      insights: [
        "Driver location updates stream to Kafka every 4 seconds from 5M+ active drivers",
        "Matching Service queries a geospatial index (H3 hexagonal grid) to find nearby drivers in <100ms",
        "WebSocket connections maintain real-time state between Uber app and backend",
        "Every microservice is stateless; driver state lives in Redis with 30s TTL",
      ],
    },
    {
      id: "arch-highscale",
      company: "High-Scale",
      title: "Generic High-Scale System",
      icon: "🚀",
      color: "#6366F1",
      diagram: [
        { label: "Users", icon: "👥", type: "user" },
        { label: "CDN", icon: "🌍", type: "infra" },
        { label: "Load Balancer", icon: "⚖️", type: "infra" },
        { label: "Stateless App Servers", icon: "⚙️", type: "service" },
        { label: "Redis Cache", icon: "⚡", type: "cache" },
        { label: "Message Queue", icon: "📨", type: "queue" },
        {
          label: "Database Cluster",
          icon: "🗄️",
          type: "data",
          children: ["Primary DB", "Read Replicas"],
        },
      ],
      insights: [
        "CDN absorbs 70–95% of traffic before it reaches origin servers",
        "App servers are stateless — any server can handle any request, enabling horizontal scaling",
        "Redis caches hot data: a 90% cache hit rate means 10x reduction in DB load",
        "Read replicas offload SELECT queries; primary handles only writes — typically 80/20 read/write split",
        "Message queue decouples slow async work (emails, reports) from fast synchronous API responses",
      ],
    },
  ];

  /* ─────────────────────────────────────────────────── */
  /*  DATA: Diagram Library                              */
  /* ─────────────────────────────────────────────────── */

  const DIAGRAM_LIBRARY = [
    {
      category: "Networking",
      icon: "🌐",
      color: "si-blue",
      items: [
        "Network Topology",
        "DNS Flow",
        "TCP Handshake",
        "HTTP Request Flow",
        "CDN Architecture",
      ],
    },
    {
      category: "API Design",
      icon: "🚪",
      color: "si-purple",
      items: [
        "REST API Flow",
        "API Gateway Architecture",
        "Authentication Flow",
        "JWT Validation",
        "File Upload Flow",
      ],
    },
    {
      category: "Security",
      icon: "🔐",
      color: "si-red",
      items: [
        "TLS Handshake",
        "OAuth2 Flow",
        "CORS Policy",
        "DDoS Mitigation",
        "Zero Trust Architecture",
      ],
    },
    {
      category: "Databases",
      icon: "🗄️",
      color: "si-green",
      items: [
        "Relational Schema",
        "Join Relationships",
        "Index Lookup",
        "Query Execution Plan",
        "Transaction Lifecycle",
      ],
    },
    {
      category: "Architecture",
      icon: "🏛️",
      color: "si-cyan",
      items: [
        "Monolith Evolution",
        "Microservices Mesh",
        "Event-Driven System",
        "CQRS Pattern",
        "Saga Pattern",
      ],
    },
    {
      category: "Scaling",
      icon: "📈",
      color: "si-orange",
      items: [
        "Horizontal Scaling",
        "Auto Scaling Group",
        "Database Sharding",
        "Read Replicas",
        "Connection Pooling",
      ],
    },
    {
      category: "Caching",
      icon: "⚡",
      color: "si-yellow",
      items: [
        "Cache-Aside Pattern",
        "Write-Through Cache",
        "Cache Invalidation",
        "CDN Caching Strategy",
        "Redis Cluster",
      ],
    },
    {
      category: "Distributed Systems",
      icon: "🔗",
      color: "si-blue",
      items: [
        "Pub/Sub System",
        "Message Queue Processing",
        "Retry + Backoff",
        "Circuit Breaker",
        "Consensus (Raft)",
      ],
    },
    {
      category: "Cloud",
      icon: "☁️",
      color: "si-purple",
      items: [
        "AWS VPC Architecture",
        "Multi-AZ Deployment",
        "S3 + CloudFront",
        "RDS Replication",
        "Lambda Architecture",
      ],
    },
    {
      category: "Deployment",
      icon: "🚀",
      color: "si-green",
      items: [
        "CI/CD Pipeline",
        "Blue-Green Deploy",
        "Canary Release",
        "Docker + K8s",
        "GitOps Flow",
      ],
    },
  ];

  /* ─────────────────────────────────────────────────── */
  /*  Animation Engine                                   */
  /* ─────────────────────────────────────────────────── */

  let animState = {
    flowId: null,
    step: 0,
    playing: false,
    timer: null,
  };

  function playFlow(flowData) {
    animState.flowId = flowData.id;
    animState.step = 0;
    animState.playing = false;
    if (animState.timer) clearInterval(animState.timer);
    renderFlowAnimator(flowData);
  }

  function setStep(flowData, stepIndex) {
    animState.step = Math.max(
      0,
      Math.min(stepIndex, flowData.steps.length - 1),
    );
    refreshFlowHighlight(flowData);
  }

  function togglePlay(flowData) {
    animState.playing = !animState.playing;
    if (animState.playing) {
      animState.timer = setInterval(() => {
        if (animState.step >= flowData.steps.length - 1) {
          animState.playing = false;
          clearInterval(animState.timer);
          updatePlayBtn();
          return;
        }
        animState.step++;
        refreshFlowHighlight(flowData);
      }, 1800);
    } else {
      clearInterval(animState.timer);
    }
    updatePlayBtn();
  }

  function updatePlayBtn() {
    const btn = document.getElementById("anim-play-btn");
    if (btn) btn.textContent = animState.playing ? "⏸ Pause" : "▶ Play";
  }

  function refreshFlowHighlight(flowData) {
    const step = flowData.steps[animState.step];
    // Highlight nodes
    document.querySelectorAll(".anim-node").forEach((n) => {
      n.classList.remove("anim-active", "anim-visited");
    });
    // Mark all previously visited
    for (let i = 0; i < animState.step; i++) {
      const visitedNode = document.querySelector(
        `[data-node-id="${flowData.steps[i].nodeId}"]`,
      );
      if (visitedNode) visitedNode.classList.add("anim-visited");
    }
    // Mark current
    const activeNode = document.querySelector(
      `[data-node-id="${step.nodeId}"]`,
    );
    if (activeNode) activeNode.classList.add("anim-active");

    // Update step info
    const infoTitle = document.getElementById("anim-step-title");
    const infoDesc = document.getElementById("anim-step-desc");
    if (infoTitle) infoTitle.textContent = step.title;
    if (infoDesc) infoDesc.textContent = step.desc;

    // Update step indicators
    document.querySelectorAll(".anim-step-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === animState.step);
      dot.classList.toggle("done", i < animState.step);
    });

    // Update nav buttons
    const prevBtn = document.getElementById("anim-prev-btn");
    const nextBtn = document.getElementById("anim-next-btn");
    if (prevBtn) prevBtn.disabled = animState.step === 0;
    if (nextBtn)
      nextBtn.disabled = animState.step === flowData.steps.length - 1;

    // Highlight connection arrows
    document.querySelectorAll(".anim-arrow").forEach((arrow, i) => {
      arrow.classList.toggle("anim-arrow-active", i < animState.step);
    });
  }

  function renderFlowAnimator(flowData) {
    const container = document.getElementById("anim-flow-area");
    if (!container) return;

    // Nodes chain
    const nodesHTML = flowData.nodes
      .map(
        (node, i) => `
      <div class="anim-node-wrap">
        <div class="anim-node" data-node-id="${node.id}" id="animnode-${node.id}">
          <span class="anim-node-icon">${node.icon}</span>
          <span class="anim-node-label">${node.label}</span>
        </div>
        ${i < flowData.nodes.length - 1 ? `<div class="anim-arrow" id="anim-arrow-${i}">↓</div>` : ""}
      </div>
    `,
      )
      .join("");

    // Step dots
    const dotsHTML = flowData.steps
      .map(
        (_, i) => `
      <button class="anim-step-dot" data-step="${i}" title="Step ${i + 1}"></button>
    `,
      )
      .join("");

    container.innerHTML = `
      <div class="anim-layout">
        <div class="anim-nodes-column">
          ${nodesHTML}
        </div>
        <div class="anim-info-column">
          <div class="anim-step-info">
            <div class="anim-step-counter">Step ${animState.step + 1} of ${flowData.steps.length}</div>
            <div class="anim-step-title" id="anim-step-title">${flowData.steps[0].title}</div>
            <div class="anim-step-desc" id="anim-step-desc">${flowData.steps[0].desc}</div>
          </div>
          <div class="anim-controls">
            <button class="anim-btn" id="anim-prev-btn" disabled>◀ Prev</button>
            <button class="anim-btn anim-btn-play" id="anim-play-btn">▶ Play</button>
            <button class="anim-btn" id="anim-next-btn">Next ▶</button>
          </div>
          <div class="anim-dots">${dotsHTML}</div>
        </div>
      </div>`;

    // Wire events
    document
      .getElementById("anim-play-btn")
      .addEventListener("click", () => togglePlay(flowData));
    document.getElementById("anim-prev-btn").addEventListener("click", () => {
      setStep(flowData, animState.step - 1);
    });
    document.getElementById("anim-next-btn").addEventListener("click", () => {
      setStep(flowData, animState.step + 1);
    });
    document.querySelectorAll(".anim-step-dot").forEach((dot) => {
      dot.addEventListener("click", () =>
        setStep(flowData, parseInt(dot.dataset.step, 10)),
      );
    });

    // Click on node to jump to its step
    document.querySelectorAll(".anim-node").forEach((nodeEl) => {
      nodeEl.addEventListener("click", () => {
        const nodeId = nodeEl.dataset.nodeId;
        const stepIdx = flowData.steps.findIndex((s) => s.nodeId === nodeId);
        if (stepIdx >= 0) setStep(flowData, stepIdx);
      });
    });

    // Initial highlight
    refreshFlowHighlight(flowData);
  }

  /* ─────────────────────────────────────────────────── */
  /*  Interactive Diagram Engine                         */
  /* ─────────────────────────────────────────────────── */

  function renderInteractiveDiagram(diagData, container) {
    const nodesHTML = diagData.nodes
      .map(
        (node) => `
      <div class="idiag-node" data-diag-id="${diagData.id}" data-node-id="${node.id}">
        <span class="idiag-icon">${node.icon}</span>
        <span class="idiag-label">${node.label}</span>
        <span class="idiag-hint">click to learn</span>
      </div>
    `,
      )
      .join("");

    const connectionsHTML = diagData.connections
      .map(
        (conn) => `
      <div class="idiag-conn" data-from="${conn.from}" data-to="${conn.to}">▼</div>
    `,
      )
      .join("");

    container.innerHTML = `
      <div class="idiag-wrapper">
        <div class="idiag-graph">
          <div class="idiag-nodes ${diagData.layout === "tree" ? "idiag-tree" : "idiag-linear"}">
            ${nodesHTML}
            ${connectionsHTML}
          </div>
        </div>
        <div class="idiag-info-panel" id="idiag-info-${diagData.id}">
          <div class="idiag-info-placeholder">
            <span class="idiag-info-icon">👆</span>
            <p>Click any node to learn what it does</p>
          </div>
        </div>
      </div>`;

    container.querySelectorAll(".idiag-node").forEach((nodeEl) => {
      nodeEl.addEventListener("click", () => {
        const nodeId = nodeEl.dataset.nodeId;
        const nodeData = diagData.nodes.find((n) => n.id === nodeId);
        if (!nodeData) return;

        // Highlight
        container
          .querySelectorAll(".idiag-node")
          .forEach((n) => n.classList.remove("idiag-selected"));
        nodeEl.classList.add("idiag-selected");

        // Show info
        const panel = document.getElementById(`idiag-info-${diagData.id}`);
        if (panel) {
          panel.innerHTML = `
            <div class="idiag-info-content">
              <div class="idiag-info-header">
                <span class="idiag-info-big-icon">${nodeData.icon}</span>
                <h3>${nodeData.info.title}</h3>
              </div>
              <p>${nodeData.info.body}</p>
            </div>`;
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────── */
  /*  Render: Full Diagrams Screen                       */
  /* ─────────────────────────────────────────────────── */

  function renderDiagramsScreen(activeTab) {
    const screen = document.getElementById("diagramsScreen");
    if (!screen) return;
    const tab = activeTab || "animated";

    screen.innerHTML = `
      <div class="diag-screen-inner">
        <div class="diag-screen-header">
          <h1 class="diag-screen-title">Architecture Diagrams</h1>
          <p class="diag-screen-subtitle">Animated flows · Interactive systems · Real company architectures</p>
        </div>

        <div class="diag-tabs" id="diagTabs">
          <button class="diag-tab ${tab === "animated" ? "active" : ""}" data-tab="animated">🎬 Animated Flows</button>
          <button class="diag-tab ${tab === "interactive" ? "active" : ""}" data-tab="interactive">🖱️ Interactive</button>
          <button class="diag-tab ${tab === "companies" ? "active" : ""}" data-tab="companies">🏢 Real Companies</button>
          <button class="diag-tab ${tab === "library" ? "active" : ""}" data-tab="library">📚 Library</button>
        </div>

        <div class="diag-tab-content" id="diagTabContent">
          ${renderTab(tab)}
        </div>
      </div>`;

    // Wire tab buttons
    screen.querySelectorAll(".diag-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newTab = btn.dataset.tab;
        renderDiagramsScreen(newTab);
        // Re-init if animated tab
        if (newTab === "animated") {
          setTimeout(() => initAnimatedTab(), 50);
        }
        if (newTab === "interactive") {
          setTimeout(() => initInteractiveTab(), 50);
        }
      });
    });

    // Auto-init current tab
    if (tab === "animated") {
      setTimeout(() => initAnimatedTab(), 50);
    }
    if (tab === "interactive") {
      setTimeout(() => initInteractiveTab(), 50);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderTab(tab) {
    switch (tab) {
      case "animated":
        return renderAnimatedTabHTML();
      case "interactive":
        return renderInteractiveTabHTML();
      case "companies":
        return renderCompaniesTabHTML();
      case "library":
        return renderLibraryTabHTML();
      default:
        return renderAnimatedTabHTML();
    }
  }

  /* ─ Animated Tab ─ */
  function renderAnimatedTabHTML() {
    const flowPickerHTML = ANIMATED_FLOWS.map(
      (f) => `
      <button class="anim-flow-pick" data-flow-id="${f.id}">
        <span>${f.icon}</span>
        <span>${f.title}</span>
      </button>
    `,
    ).join("");

    return `
      <div class="anim-tab">
        <div class="anim-flow-picker">${flowPickerHTML}</div>
        <div class="anim-flow-card" id="anim-flow-card">
          <div class="anim-flow-title" id="anim-flow-title"></div>
          <div class="anim-flow-desc"  id="anim-flow-desc"></div>
          <div id="anim-flow-area"></div>
        </div>
      </div>`;
  }

  function initAnimatedTab() {
    if (animState.timer) clearInterval(animState.timer);
    animState.playing = false;

    // Wire flow picker buttons
    document.querySelectorAll(".anim-flow-pick").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".anim-flow-pick")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const flow = ANIMATED_FLOWS.find((f) => f.id === btn.dataset.flowId);
        if (flow) {
          document.getElementById("anim-flow-title").textContent =
            flow.icon + " " + flow.title;
          document.getElementById("anim-flow-desc").textContent =
            flow.description;
          animState.step = 0;
          playFlow(flow);
        }
      });
    });

    // Auto-select first flow
    const firstBtn = document.querySelector(".anim-flow-pick");
    if (firstBtn) firstBtn.click();
  }

  /* ─ Interactive Tab ─ */
  function renderInteractiveTabHTML() {
    return `
      <div class="idiag-tab">
        ${INTERACTIVE_DIAGRAMS.map(
          (d) => `
          <div class="idiag-card">
            <div class="idiag-card-header">
              <span class="idiag-card-icon">${d.icon}</span>
              <div>
                <h3 class="idiag-card-title">${d.title}</h3>
                <p class="idiag-card-desc">${d.description}</p>
              </div>
            </div>
            <div class="idiag-diagram-area" id="idiag-area-${d.id}"></div>
          </div>
        `,
        ).join("")}
      </div>`;
  }

  function initInteractiveTab() {
    INTERACTIVE_DIAGRAMS.forEach((diagData) => {
      const container = document.getElementById(`idiag-area-${diagData.id}`);
      if (container) renderInteractiveDiagram(diagData, container);
    });
  }

  /* ─ Companies Tab ─ */
  function renderCompaniesTabHTML() {
    return `
      <div class="arch-tab">
        ${COMPANY_ARCHITECTURES.map(
          (arch) => `
          <div class="arch-card" id="${arch.id}">
            <div class="arch-card-header" style="border-bottom: 3px solid ${arch.color}">
              <span class="arch-card-icon">${arch.icon}</span>
              <div>
                <div class="arch-card-company">${arch.company}</div>
                <div class="arch-card-title">${arch.title}</div>
              </div>
            </div>
            <div class="arch-card-body">
              <div class="arch-diagram">
                ${arch.diagram
                  .map(
                    (node) => `
                  <div class="arch-node arch-node-${node.type}">
                    <span>${node.icon}</span>
                    <span>${node.label}</span>
                    ${node.children ? `<div class="arch-children">${node.children.map((c) => `<span class="arch-child">${c}</span>`).join("")}</div>` : ""}
                  </div>
                  <div class="arch-node-arrow">↓</div>
                `,
                  )
                  .join("")}
              </div>
              <div class="arch-insights">
                <div class="arch-insights-title">💡 Architect Insights</div>
                ${arch.insights.map((ins) => `<div class="arch-insight-item">→ ${ins}</div>`).join("")}
              </div>
            </div>
          </div>
        `,
        ).join("")}
      </div>`;
  }

  /* ─ Library Tab ─ */
  function renderLibraryTabHTML() {
    return `
      <div class="lib-tab">
        <div class="lib-intro">
          <p>A structured reference library of architecture diagrams organised by domain. Use these as a visual index while studying each topic.</p>
        </div>
        <div class="lib-grid">
          ${DIAGRAM_LIBRARY.map(
            (cat) => `
            <div class="lib-card">
              <div class="lib-card-header">
                <span class="lib-card-icon section-icon ${cat.color}">${cat.icon}</span>
                <span class="lib-card-category">${cat.category}</span>
              </div>
              <ul class="lib-card-items">
                ${cat.items.map((item) => `<li class="lib-card-item">📌 ${item}</li>`).join("")}
              </ul>
            </div>
          `,
          ).join("")}
        </div>
      </div>`;
  }

  /* ─────────────────────────────────────────────────── */
  /*  Public API                                         */
  /* ─────────────────────────────────────────────────── */

  window.DiagramEngine = {
    show: function (tab) {
      renderDiagramsScreen(tab || "animated");
    },
    cleanup: function () {
      if (animState.timer) {
        clearInterval(animState.timer);
        animState.timer = null;
        animState.playing = false;
      }
    },
  };
})();

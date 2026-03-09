/* ================================================================
   labs.js  —  Architect Academy Interactive Labs Engine
   Features:
     1. System Design Simulator (drag & drop builder)
     2. Case Studies (Amazon, Uber, Netflix, WhatsApp, Instagram…)
     3. Architecture Decision Simulator (quiz / tradeoffs)
     4. Visual Request Flow Player (step-by-step animation)
     5. Architecture Comparison View (Monolith vs Microservices…)
     6. Architecture Interview Mode
     7. Failure Simulator (toggle DB/Cache/Service failures)
     8. Architecture Pattern Library (CQRS, Saga, Circuit Breaker…)
     9. Performance Calculator
    10. Failure Case Studies (AWS, Facebook, Cloudflare outages)
    11. Architecture Cheat Sheets
    12. Architecture Roadmap Tracker
    13. Searchable Knowledge Base
    14. Architecture Glossary
    15. Visual Learning Timeline (startup→growth→scale)
    16. Architecture Pattern Playground (live toggle)
    17. Interview Questions
    18. Real Production Metrics Dashboard (simulated)
   ================================================================ */

(function () {
  "use strict";

  /* ════════════════════════════════════════════════════════════════
     SECTION 0 — Data
  ════════════════════════════════════════════════════════════════ */

  const CASE_STUDIES = [
    {
      id: "amazon",
      name: "Design Amazon",
      icon: "🛒",
      category: "E-commerce",
      difficulty: "hard",
      problem:
        "Design Amazon's product page — scalable to 500M+ users with global availability.",
      requirements: [
        "Handle 1M+ concurrent users",
        "Product catalog with 350M+ items",
        "Real-time inventory updates",
        "Personalized recommendations",
        "Sub-100ms page load globally",
      ],
      flow: [
        { label: "User Browser", icon: "🌐", color: "client" },
        { label: "CDN (CloudFront)", icon: "🌍", color: "cdn" },
        { label: "Load Balancer", icon: "⚖️", color: "lb" },
        { label: "API Gateway", icon: "🔀", color: "api" },
        { label: "Product Service", icon: "📦", color: "svc" },
        { label: "Redis Cache", icon: "⚡", color: "cache" },
        { label: "DynamoDB / Aurora", icon: "🗄️", color: "db" },
      ],
      scaling:
        "Use CDN for static assets, Redis for hot product data (cache hit >99%), Aurora read replicas for DB. Sharding by product category. Event-driven inventory updates via Kafka.",
      tradeoffs: [
        {
          pro: "CDN reduces latency to <20ms",
          risk: "Cache invalidation complexity",
        },
        {
          pro: "Horizontal scaling via auto-scaling groups",
          risk: "Consistency across regions",
        },
        {
          pro: "Read replicas handle 80% of traffic",
          risk: "Replication lag ~50ms",
        },
      ],
    },
    {
      id: "uber",
      name: "Design Uber",
      icon: "🚗",
      category: "Ride-sharing",
      difficulty: "hard",
      problem:
        "Design Uber's ride-matching system — real-time location, surge pricing, 10M+ daily rides.",
      requirements: [
        "Real-time driver location updates (every 4s)",
        "Match rider to nearest driver <30s",
        "Surge pricing based on demand",
        "Trip tracking and ETA calculation",
        "Payment processing at trip end",
      ],
      flow: [
        { label: "Rider App", icon: "📱", color: "client" },
        { label: "Load Balancer", icon: "⚖️", color: "lb" },
        { label: "API Gateway", icon: "🔀", color: "api" },
        { label: "Dispatch Service", icon: "🚦", color: "svc" },
        { label: "Location Cache (Redis)", icon: "⚡", color: "cache" },
        { label: "Trip DB (Cassandra)", icon: "🗄️", color: "db" },
        { label: "Kafka (Events)", icon: "📨", color: "queue" },
      ],
      scaling:
        "Use geospatial indexing (S2 cells / geohash) in Redis for O(1) nearest driver lookup. WebSocket connections for real-time updates. Cassandra for write-heavy trip data. Kafka for async event processing.",
      tradeoffs: [
        {
          pro: "Redis geospatial: sub-ms location queries",
          risk: "Memory bound — expensive at scale",
        },
        {
          pro: "WebSockets reduce polling overhead",
          risk: "Connection state management complexity",
        },
        {
          pro: "Cassandra handles millions writes/sec",
          risk: "No joins — denormalized data model",
        },
      ],
    },
    {
      id: "netflix",
      name: "Design Netflix",
      icon: "🎬",
      category: "Streaming",
      difficulty: "hard",
      problem:
        "Design Netflix video streaming — 200M+ subscribers, 15% of global internet traffic.",
      requirements: [
        "Stream 4K video with adaptive bitrate",
        "Content recommendation for 200M users",
        "Global availability with <2s startup time",
        "Offline downloads",
        "Live events support",
      ],
      flow: [
        { label: "Client App", icon: "📱", color: "client" },
        { label: "Open Connect CDN", icon: "🌍", color: "cdn" },
        { label: "API Gateway (Zuul)", icon: "🔀", color: "api" },
        { label: "Recommendation Service", icon: "🤖", color: "svc" },
        { label: "Video Encoding Service", icon: "🎞️", color: "svc" },
        { label: "Cassandra (User Data)", icon: "🗄️", color: "db" },
        { label: "S3 (Video Storage)", icon: "🗃️", color: "storage" },
      ],
      scaling:
        "Open Connect CDN caches content at ISP level. Adaptive bitrate streaming (HLS/DASH). Cassandra for user viewing history. Chaos Monkey for resilience testing. Microservices with 1000+ independent services.",
      tradeoffs: [
        {
          pro: "ISP-level CDN: ultra-low latency",
          risk: "High CDN infrastructure cost",
        },
        {
          pro: "Microservices: independent scaling",
          risk: "Distributed tracing complexity",
        },
        {
          pro: "Eventual consistency acceptable for views",
          risk: "Not ideal for billing data",
        },
      ],
    },
    {
      id: "whatsapp",
      name: "Design WhatsApp",
      icon: "💬",
      category: "Messaging",
      difficulty: "medium",
      problem:
        "Design WhatsApp — 2B+ users, 100B messages/day, end-to-end encryption.",
      requirements: [
        "Deliver messages in real-time",
        "End-to-end encryption",
        "Message delivery receipts (sent/delivered/read)",
        "Group chats up to 512 members",
        "Media sharing (photos, videos, documents)",
      ],
      flow: [
        { label: "Client (Mobile/Web)", icon: "📱", color: "client" },
        { label: "Load Balancer", icon: "⚖️", color: "lb" },
        { label: "WebSocket Server", icon: "🔌", color: "svc" },
        { label: "Message Queue (Kafka)", icon: "📨", color: "queue" },
        { label: "Message Store (Cassandra)", icon: "🗄️", color: "db" },
        { label: "Media Store (S3)", icon: "🗃️", color: "storage" },
        { label: "Notification Service", icon: "🔔", color: "svc" },
      ],
      scaling:
        "Long-lived WebSocket connections per user. Messages stored for 30 days after delivery. Signal Protocol for E2E encryption. Cassandra for chronological message storage. Media compressed and stored on S3.",
      tradeoffs: [
        {
          pro: "WebSockets: zero-latency message push",
          risk: "Millions of open connections needed",
        },
        {
          pro: "Cassandra: time-series message storage",
          risk: "Read performance degrades at scale",
        },
        {
          pro: "E2E encryption: privacy guarantee",
          risk: "No server-side content moderation",
        },
      ],
    },
    {
      id: "instagram",
      name: "Design Instagram",
      icon: "📸",
      category: "Social Media",
      difficulty: "medium",
      problem:
        "Design Instagram — 2B+ users, photo/video sharing, stories, explore feed.",
      requirements: [
        "Upload and display photos/videos",
        "News feed generation for 2B+ users",
        "Stories (24-hour expiry)",
        "Explore/Discover content",
        "Real-time notifications",
      ],
      flow: [
        { label: "User Browser/App", icon: "📱", color: "client" },
        { label: "CDN (Fastly)", icon: "🌍", color: "cdn" },
        { label: "Load Balancer", icon: "⚖️", color: "lb" },
        { label: "Feed Service", icon: "📰", color: "svc" },
        { label: "Redis (Feed Cache)", icon: "⚡", color: "cache" },
        { label: "PostgreSQL (Metadata)", icon: "🗄️", color: "db" },
        { label: "S3 (Media)", icon: "🗃️", color: "storage" },
      ],
      scaling:
        "Fan-out on write for celebrities (pre-compute feed). Fan-out on read for regular users. Redis stores pre-computed feeds. Sharding user data by user_id. CDN for media delivery.",
      tradeoffs: [
        {
          pro: "Pre-computed feed: instant load",
          risk: "Celebrity posts require billions of writes",
        },
        {
          pro: "Hybrid fan-out: balance write/read",
          risk: "Cache consistency challenges",
        },
        {
          pro: "PostgreSQL for structured data",
          risk: "Sharding adds query complexity",
        },
      ],
    },
    {
      id: "payment",
      name: "Design Payment System",
      icon: "💳",
      category: "Fintech",
      difficulty: "hard",
      problem:
        "Design a payment processing system — ACID guarantees, fraud detection, global scale.",
      requirements: [
        "Process 10,000 transactions/second",
        "ACID guarantees — no money lost or duplicated",
        "Idempotency for retries",
        "Fraud detection in real-time (<100ms)",
        "Multi-currency support",
      ],
      flow: [
        { label: "Client App", icon: "📱", color: "client" },
        { label: "API Gateway", icon: "🔀", color: "api" },
        { label: "Payment Service", icon: "💳", color: "svc" },
        { label: "Fraud Detection (ML)", icon: "🛡️", color: "svc" },
        { label: "Ledger DB (Postgres)", icon: "🗄️", color: "db" },
        { label: "Kafka (Audit Log)", icon: "📨", color: "queue" },
        { label: "Notification Service", icon: "🔔", color: "svc" },
      ],
      scaling:
        "Idempotency keys prevent double charges. Distributed transactions with 2PC or Saga pattern. Event sourcing for audit trail. Fraud detection ML model runs <50ms. Read replicas for reporting.",
      tradeoffs: [
        {
          pro: "Postgres ACID: strong consistency",
          risk: "Vertical scale limits throughput",
        },
        {
          pro: "Saga pattern: distributed transactions",
          risk: "Eventual consistency, compensating transactions",
        },
        {
          pro: "Event sourcing: full audit trail",
          risk: "Event replay complexity for queries",
        },
      ],
    },
    {
      id: "urlshortener",
      name: "Design URL Shortener",
      icon: "🔗",
      category: "Utility",
      difficulty: "easy",
      problem:
        "Design a URL shortener like bit.ly — 100M URLs/day, sub-10ms redirects.",
      requirements: [
        "Shorten long URLs to 7-char codes",
        "Redirect in <10ms",
        "100M new URLs per day",
        "Analytics: click count, geolocation",
        "Custom aliases",
      ],
      flow: [
        { label: "User Browser", icon: "🌐", color: "client" },
        { label: "CDN + Load Balancer", icon: "⚖️", color: "lb" },
        { label: "Redirect Service", icon: "🔀", color: "svc" },
        { label: "Redis Cache", icon: "⚡", color: "cache" },
        { label: "MySQL / Cassandra", icon: "🗄️", color: "db" },
        { label: "Analytics Service (Kafka)", icon: "📊", color: "queue" },
      ],
      scaling:
        "Base62 encoding for short codes. Redis caches hot URLs (99% cache hit). 301 vs 302 redirect tradeoff. Separate read/write paths. Bloom filter to check URL existence.",
      tradeoffs: [
        {
          pro: "Redis cache: <1ms redirect",
          risk: "Cache miss adds 10ms DB latency",
        },
        {
          pro: "301 Redirect: browser caches, less server load",
          risk: "Cannot track analytics after",
        },
        {
          pro: "302 Redirect: full analytics",
          risk: "Every click hits your servers",
        },
      ],
    },
  ];

  const DECISION_QUESTIONS = [
    {
      id: "q1",
      scenario:
        "Your app goes viral. Traffic increased 10x overnight. Latency is now 5 seconds. What's your FIRST action?",
      options: [
        {
          label: "Add more CPU/RAM to existing server",
          correct: false,
          explain:
            "Vertical scaling is quick but limited. You'll hit a ceiling fast and it's expensive.",
        },
        {
          label: "Add a cache layer (Redis)",
          correct: true,
          explain:
            "✅ Correct! 80% of requests are likely repeated reads. A cache can reduce DB load by 90% immediately — fastest ROI.",
        },
        {
          label: "Add more servers (horizontal scale)",
          correct: false,
          explain:
            "Good idea, but without a load balancer and stateless app, this won't help much yet.",
        },
        {
          label: "Migrate to microservices",
          correct: false,
          explain:
            "Microservices is a long-term architectural change. Won't help with immediate traffic spike.",
        },
      ],
    },
    {
      id: "q2",
      scenario:
        "You need to store 1 billion user activity events per day. Each event is small (~200 bytes). Which database do you choose?",
      options: [
        {
          label: "PostgreSQL (relational)",
          correct: false,
          explain:
            "PostgreSQL struggles beyond hundreds of millions of rows without heavy partitioning. Not ideal for write-heavy time-series data.",
        },
        {
          label: "Cassandra (wide-column NoSQL)",
          correct: true,
          explain:
            "✅ Correct! Cassandra is designed for massive write throughput and time-series data. Linear horizontal scaling makes it perfect.",
        },
        {
          label: "MongoDB (document store)",
          correct: false,
          explain:
            "MongoDB works for document data but Cassandra has better write scaling for pure event storage.",
        },
        {
          label: "Redis (in-memory)",
          correct: false,
          explain:
            "Redis is too expensive for 1B events/day as primary storage — it would exhaust RAM quickly.",
        },
      ],
    },
    {
      id: "q3",
      scenario:
        "Your read traffic is 100x your write traffic. Reads are slow. What's the best architecture fix?",
      options: [
        {
          label: "Add write replicas",
          correct: false,
          explain:
            "Write replicas would help with write throughput, but your problem is reads.",
        },
        {
          label: "Add read replicas + caching",
          correct: true,
          explain:
            "✅ Correct! Read replicas distribute read load across multiple DB instances. Add Redis in front for repeated queries.",
        },
        {
          label: "Switch to a queue-based system",
          correct: false,
          explain:
            "Queues solve async write problems, not slow read performance.",
        },
        {
          label: "Increase primary DB connection pool",
          correct: false,
          explain:
            "Connection pool tuning helps slightly, but the DB itself is the bottleneck.",
        },
      ],
    },
    {
      id: "q4",
      scenario:
        "Users complain about inconsistent data — they update their profile but see old data for minutes. What's the root cause?",
      options: [
        {
          label: "Database is down",
          correct: false,
          explain:
            "If the DB was down, writes would fail — not succeed with stale reads.",
        },
        {
          label: "Stale cache not invalidated after write",
          correct: true,
          explain:
            "✅ Correct! Classic cache invalidation problem. After profile update, cache still holds old data. Fix: invalidate cache on write, or use write-through cache.",
        },
        {
          label: "Load balancer is broken",
          correct: false,
          explain: "LB issues would cause errors, not stale data.",
        },
        {
          label: "Network latency",
          correct: false,
          explain:
            "High latency causes slow loads, not stale data persisting for minutes.",
        },
      ],
    },
    {
      id: "q5",
      scenario:
        "You need to send emails, resize images, and generate reports after a user uploads a file. How do you design this?",
      options: [
        {
          label: "Process everything synchronously in the upload handler",
          correct: false,
          explain:
            "This blocks the user for 2-10 seconds and risks timeout failures. Terrible UX.",
        },
        {
          label: "Use a message queue — async workers per task",
          correct: true,
          explain:
            "✅ Correct! Upload → publish event to Kafka/SQS → independent workers handle email, image resize, report. Decoupled, scalable, fault-tolerant.",
        },
        {
          label: "Use a cron job that runs every minute",
          correct: false,
          explain:
            "Cron adds up to 60 seconds of delay. Not event-driven — wastes resources polling.",
        },
        {
          label: "Call all three services in parallel threads",
          correct: false,
          explain:
            "In-process threads tie up the web server and don't survive crashes. Not production-grade.",
        },
      ],
    },
    {
      id: "q6",
      scenario:
        "Two services must update their own databases as part of one business transaction. Service A succeeds, Service B fails. How do you ensure consistency?",
      options: [
        {
          label: "Use a distributed 2-Phase Commit (2PC)",
          correct: false,
          explain:
            "2PC works but blocks resources and creates a coordinator single-point-of-failure. Rarely used in modern systems.",
        },
        {
          label: "Implement the Saga Pattern",
          correct: true,
          explain:
            "✅ Correct! Saga breaks the transaction into a chain of steps. If Service B fails, compensating transactions undo Service A's changes. Used by Uber, Netflix.",
        },
        {
          label: "Ignore the failure and let data diverge",
          correct: false,
          explain:
            "This leads to data inconsistency — unacceptable for financial or order systems.",
        },
        {
          label: "Retry Service B indefinitely",
          correct: false,
          explain:
            "Infinite retries cause thundering herd and don't handle permanent failures.",
        },
      ],
    },
  ];

  const FLOW_ANIMATIONS = [
    {
      id: "web-request",
      name: "Web Request Flow",
      icon: "🌐",
      description: "How a browser request travels through a modern web stack",
      steps: [
        {
          icon: "🌐",
          label: "Browser",
          detail: "User types URL, browser checks DNS cache first",
        },
        {
          icon: "📡",
          label: "DNS Lookup",
          detail:
            "Resolves domain to IP (recursive DNS query through root → TLD → authoritative)",
        },
        {
          icon: "🌍",
          label: "CDN Edge",
          detail:
            "Request hits nearest CDN PoP. If cached, returns immediately (cache hit <5ms)",
        },
        {
          icon: "⚖️",
          label: "Load Balancer",
          detail:
            "Distributes to available backend servers using Round Robin / Least Connections",
        },
        {
          icon: "🖥️",
          label: "Web Server",
          detail: "Handles HTTP, applies middleware, authentication, routing",
        },
        {
          icon: "⚡",
          label: "Cache (Redis)",
          detail:
            "Checks Redis for cached response. Hit = return in <1ms. Miss = query DB",
        },
        {
          icon: "🗄️",
          label: "Database",
          detail: "Executes query with index lookup. Returns data in 5-50ms",
        },
        {
          icon: "🖥️",
          label: "Server Response",
          detail:
            "Serializes data to JSON, sets cache headers, compresses (gzip)",
        },
        {
          icon: "🌐",
          label: "Browser Renders",
          detail:
            "Browser parses HTML/CSS/JS, paints pixels. Total RTT: ~100-300ms",
        },
      ],
    },
    {
      id: "kafka-event",
      name: "Kafka Event Flow",
      icon: "📨",
      description: "How an event flows through a Kafka-based architecture",
      steps: [
        {
          icon: "📱",
          label: "Producer Service",
          detail: "Publishes event: {userId, action, timestamp} to Kafka topic",
        },
        {
          icon: "📨",
          label: "Kafka Broker",
          detail:
            "Appends message to immutable log partition. Assigns offset number",
        },
        {
          icon: "✅",
          label: "Acknowledgment",
          detail:
            "Producer receives ack from leader broker. Event persisted to disk (with configured replication)",
        },
        {
          icon: "📭",
          label: "Consumer Group 1",
          detail:
            "Email Service reads from its consumer group offset — sends confirmation email",
        },
        {
          icon: "📭",
          label: "Consumer Group 2",
          detail:
            "Analytics Service reads same event independently — updates dashboards",
        },
        {
          icon: "📭",
          label: "Consumer Group 3",
          detail: "Fraud Detection reads event — runs ML scoring in parallel",
        },
        {
          icon: "✅",
          label: "Commit Offsets",
          detail:
            "Each consumer commits its processed offset. Can replay from any offset if needed",
        },
      ],
    },
    {
      id: "auth-flow",
      name: "JWT Auth Flow",
      icon: "🔐",
      description: "How JWT-based authentication works end to end",
      steps: [
        {
          icon: "📱",
          label: "User Login",
          detail: "POST /login with {email, password}",
        },
        {
          icon: "🖥️",
          label: "Auth Service",
          detail:
            "Validates credentials against DB, hashes password with bcrypt",
        },
        {
          icon: "🔑",
          label: "JWT Generated",
          detail:
            "Signs token: header.payload.signature using secret key (RS256). Sets exp: 15min",
        },
        {
          icon: "📱",
          label: "Client Stores Token",
          detail:
            "Access token in memory. Refresh token in httpOnly cookie (not accessible via JS)",
        },
        {
          icon: "📡",
          label: "API Request",
          detail: "GET /api/data with Authorization: Bearer <access_token>",
        },
        {
          icon: "🛡️",
          label: "API Gateway Validates",
          detail:
            "Decodes JWT, verifies signature without DB call. Checks expiry.",
        },
        {
          icon: "🗄️",
          label: "Data Returned",
          detail:
            "Request passes to backend service with user context. Returns data.",
        },
        {
          icon: "🔄",
          label: "Token Refresh",
          detail:
            "When access token expires, silent refresh uses refresh token cookie to get new access token",
        },
      ],
    },
    {
      id: "cicd-flow",
      name: "CI/CD Pipeline Flow",
      icon: "🚀",
      description: "How code goes from developer to production",
      steps: [
        {
          icon: "👨‍💻",
          label: "Developer Pushes Code",
          detail: "git push origin feature/branch",
        },
        {
          icon: "🔍",
          label: "CI Triggered",
          detail: "GitHub Actions / Jenkins detects push, starts pipeline",
        },
        {
          icon: "🧪",
          label: "Unit Tests",
          detail: "Run all unit tests in parallel. Fail fast on test failure.",
        },
        {
          icon: "🏗️",
          label: "Build Docker Image",
          detail: "docker build → tag with commit SHA → security scan (Trivy)",
        },
        {
          icon: "🧪",
          label: "Integration Tests",
          detail: "Deploy to ephemeral test environment, run E2E tests",
        },
        {
          icon: "📦",
          label: "Push to Registry",
          detail: "docker push to ECR/GCR with immutable tag",
        },
        {
          icon: "🚀",
          label: "Deploy to Staging",
          detail: "kubectl apply, rolling update. Run smoke tests.",
        },
        {
          icon: "✅",
          label: "Manual Approval Gate",
          detail: "Engineer reviews staging, approves production deploy",
        },
        {
          icon: "🌍",
          label: "Production Deploy",
          detail:
            "Blue-green or canary deployment. Monitor error rate, latency, CPU.",
        },
      ],
    },

    /* ── User Login / Authentication ── */
    {
      id: "login-flow",
      name: "User Login / Authentication",
      icon: "🔐",
      description:
        "How credentials become a JWT and secure every subsequent API request",
      steps: [
        {
          icon: "👤",
          label: "User Submits Credentials",
          detail:
            "Browser sends POST /api/auth/login with { email, password } over HTTPS. TLS encrypts the request body — password never travels in plain text.",
        },
        {
          icon: "🚪",
          label: "API Gateway",
          detail:
            "Accepts request, terminates TLS, applies rate limiting (max 5 login attempts/min per IP) to prevent brute-force, then forwards to Auth Service.",
        },
        {
          icon: "🔐",
          label: "Auth Service Validates",
          detail:
            "Queries User DB for stored bcrypt hash, runs bcrypt.compare(inputPassword, hash). bcrypt is intentionally slow (~100ms) to make offline attacks expensive.",
        },
        {
          icon: "🗄️",
          label: "User DB Check",
          detail:
            "Returns user record. Auth Service checks: is account active? email verified? MFA enabled? Failed checks return 401 Unauthorized immediately.",
        },
        {
          icon: "⚡",
          label: "Tokens Generated & Stored",
          detail:
            "Access Token: short-lived JWT (15 min) with userId + roles. Refresh Token: opaque 7-day token stored in Redis with TTL. Redis key: refresh:<userId>.",
        },
        {
          icon: "👤",
          label: "Tokens Sent to Browser",
          detail:
            "JWT returned in response body. Refresh token set as HttpOnly Secure SameSite=Strict cookie — JS can't read it (XSS-safe). Future requests use Authorization: Bearer <JWT>.",
        },
      ],
    },

    /* ── Load Balancer Flow ── */
    {
      id: "loadbalancer-flow",
      name: "Load Balancer Flow",
      icon: "⚖️",
      description:
        "How traffic is distributed, health-checked, and routed across multiple servers",
      steps: [
        {
          icon: "🌐",
          label: "Traffic Arrives",
          detail:
            "DNS resolves to the Load Balancer's IP. All requests from all users hit this single entry point. App servers are in a private subnet — never directly internet-facing.",
        },
        {
          icon: "⚖️",
          label: "Algorithm Selects Server",
          detail:
            "Round Robin cycles A→B→C. Least Connections picks server with fewest active requests. IP Hash ensures same user always hits same server (sticky sessions).",
        },
        {
          icon: "⚙️",
          label: "Request Forwarded",
          detail:
            "Request forwarded to chosen server with X-Forwarded-For header preserving the real client IP. Server processes and returns response via the LB.",
        },
        {
          icon: "⚙️",
          label: "Health Checks Running",
          detail:
            "LB sends GET /health every 30s to each server. Three consecutive failures mark a server unhealthy and remove it from the pool automatically.",
        },
        {
          icon: "⚙️",
          label: "Server Fails & Recovers",
          detail:
            "Unhealthy server stops receiving traffic. Remaining servers absorb load. When health checks pass again, server is automatically re-added to the pool.",
        },
        {
          icon: "⚖️",
          label: "SSL Termination",
          detail:
            "LB decrypts HTTPS at the edge, forwards plain HTTP to private servers. Offloads crypto from app servers. Injects X-Forwarded-Proto: https header.",
        },
      ],
    },

    /* ── CDN Flow ── */
    {
      id: "cdn-flow",
      name: "CDN Flow",
      icon: "🌍",
      description:
        "How static assets travel from origin to edge and get cached globally in 600+ PoPs",
      steps: [
        {
          icon: "👤",
          label: "Browser Requests Asset",
          detail:
            "Browser requests hero-banner.jpg from cdn.shopkart.com. Anycast DNS resolves to nearest CDN PoP (Chennai edge, ~5ms away) — not the origin server.",
        },
        {
          icon: "🌍",
          label: "Edge Cache Check",
          detail:
            "Chennai edge checks its SSD cache. HIT: returns file in ~5ms. MISS: must fetch from origin. First user in each city always triggers a miss; all subsequent users get a hit.",
        },
        {
          icon: "🔀",
          label: "Edge Fetches from Origin",
          detail:
            "On cache miss, edge traverses CDN's private backbone to origin. CDN private networks (AWS backbone, Cloudflare Argo) are faster than public internet.",
        },
        {
          icon: "⚙️",
          label: "Origin Serves with Cache Headers",
          detail:
            "Origin returns file with Cache-Control: public, max-age=31536000 (1 year). Versioned filenames (hero.v3.jpg) make long TTLs safe — filename changes on each deploy.",
        },
        {
          icon: "🪣",
          label: "Cached at Edge Globally",
          detail:
            "Chennai edge caches file for 1 year. Next 10,000 Chennai users get it from edge — origin receives zero requests. CloudFront has 450+ edge locations worldwide.",
        },
        {
          icon: "👤",
          label: "Instant Response to User",
          detail:
            "~5ms from edge vs ~180ms from US origin. CDN cuts page load time by 60–90% for global users. Static assets = 80–95% of page bytes, so CDN impact is massive.",
        },
      ],
    },

    /* ── API Request Flow ── */
    {
      id: "api-request-flow",
      name: "API Request Flow",
      icon: "🔀",
      description:
        "Full lifecycle of a REST API call — from client bytes to JSON response",
      steps: [
        {
          icon: "📱",
          label: "Client Sends Request",
          detail:
            "GET /api/v1/products/12345 with Authorization: Bearer <JWT> and X-Request-ID: uuid-123 for distributed tracing across services.",
        },
        {
          icon: "🚪",
          label: "API Gateway",
          detail:
            "Checks: is route defined? Has caller exceeded rate limit (100 req/min)? Is request within size limit? Returns 429 or 404 before business logic runs if checks fail.",
        },
        {
          icon: "🔐",
          label: "Auth Middleware",
          detail:
            "Verifies JWT signature with public key (no DB call needed). Checks expiry. Returns 401 if invalid, 403 if insufficient permissions for this resource.",
        },
        {
          icon: "⚙️",
          label: "Business Logic",
          detail:
            "Service handler validates productId, applies business rules (region visibility, pricing tiers), and fetches data. Never touches HTTP layer — works with plain objects.",
        },
        {
          icon: "🗄️",
          label: "Cache → DB Fetch",
          detail:
            "GET product:12345 from Redis (<1ms hit). On miss: SELECT from PostgreSQL via index (~2ms). Stores result in Redis (EX 300) for future requests.",
        },
        {
          icon: "📱",
          label: "Response to Client",
          detail:
            "JSON serialized, Content-Type/ETag headers set. Cache hit total: ~15ms. Cache miss + DB: ~30ms. X-Request-ID echoed for support correlation.",
        },
      ],
    },

    /* ── Database Read/Write Flow ── */
    {
      id: "database-flow",
      name: "Database Read / Write Flow",
      icon: "🗄️",
      description:
        "How reads and writes are routed, replicated, and pooled across primary and replicas",
      steps: [
        {
          icon: "⚙️",
          label: "App Routes Query",
          detail:
            "Connection router (PgBouncer / RDS Proxy) sends writes to Primary (INSERT, UPDATE, DELETE) and reads to Read Replicas (SELECT) using DB_WRITE_URL and DB_READ_URL.",
        },
        {
          icon: "🗄️",
          label: "Write to Primary",
          detail:
            "Primary acquires row lock, writes to WAL, commits, returns new ID. ACID guarantees full commit or full rollback. Typical write latency: 2–10ms.",
        },
        {
          icon: "📝",
          label: "WAL Shipped to Replicas",
          detail:
            "PostgreSQL streams binary WAL to all replicas asynchronously. Primary commits BEFORE replicas apply changes. Replication lag: typically 10–100ms in same region.",
        },
        {
          icon: "📋",
          label: "Read from Replica",
          detail:
            "SELECT queries routed to read replicas. Read-only = no lock contention from writes. MVCC ensures readers never block writers on the same replica.",
        },
        {
          icon: "📋",
          label: "Load Across Replicas",
          detail:
            "2 replicas roughly 3× read capacity. 80% of queries go to replicas. If replica lag > 500ms, router temporarily sends reads to Primary to avoid stale data.",
        },
        {
          icon: "⚙️",
          label: "Connection Pooling",
          detail:
            "PgBouncer maintains persistent pools (10 Primary, 20/replica). Requests borrow connections rather than opening new ones. Connection overhead: 0.1ms vs 100ms without pooling.",
        },
      ],
    },

    /* ── Message Queue Flow ── */
    {
      id: "msgqueue-flow",
      name: "Message Queue Flow",
      icon: "📨",
      description:
        "How async messaging decouples services, guarantees delivery, and handles failures",
      steps: [
        {
          icon: "📋",
          label: "Producer Publishes Event",
          detail:
            "Order Service publishes order-confirmed event to Kafka topic after payment. Takes ~1ms. Does NOT wait for email or inventory — returns HTTP 200 to user immediately.",
        },
        {
          icon: "📨",
          label: "Kafka Stores Durably",
          detail:
            "Kafka writes to partition log on disk with replication factor 3. Assigns offset (e.g., 10042). Acknowledges only after all 3 replicas written — no messages lost on broker crash.",
        },
        {
          icon: "📧",
          label: "Email Worker Consumes",
          detail:
            "Consumer group email-group polls Kafka, picks up offset 10042, sends email via SES, then commits offset. SES down? Offset not committed — retried next poll automatically.",
        },
        {
          icon: "📦",
          label: "Inventory Worker Consumes",
          detail:
            "Consumer group inventory-group reads the SAME event independently at the same offset. Each consumer group maintains its own cursor — adding new consumers requires zero producer changes.",
        },
        {
          icon: "💀",
          label: "Dead Letter Queue",
          detail:
            "Message failing 3× processing attempts is moved to DLQ. Normal queue unblocked. CloudWatch alarm fires. Engineers replay from DLQ after fixing the bug.",
        },
        {
          icon: "📋",
          label: "Temporal Decoupling",
          detail:
            "Email Worker down 2 hours? Order Service never knows — keeps publishing. Kafka retains all messages for 7 days. Worker replays all 5,000 accumulated messages on restart.",
        },
      ],
    },

    /* ── File Upload Flow ── */
    {
      id: "upload-flow",
      name: "File Upload Flow",
      icon: "📁",
      description:
        "How files travel securely from browser to cloud storage without passing through the app server",
      steps: [
        {
          icon: "👤",
          label: "User Selects File",
          detail:
            "Browser does NOT upload immediately. First requests a pre-signed URL: POST /api/uploads/presign { filename, contentType, size }. Server validates type and size limits first.",
        },
        {
          icon: "⚙️",
          label: "Server Generates Pre-Signed URL",
          detail:
            "API validates user auth and file size (<10MB). Calls S3 SDK to create a 5-minute signed PUT URL for a random key (uploads/user-42/uuid.jpg). Returns URL to browser.",
        },
        {
          icon: "🔗",
          label: "Browser Uploads Direct to S3",
          detail:
            "Browser PUTs raw bytes directly to the pre-signed S3 URL — bypassing the API server entirely. App server never handles megabyte file bytes, keeping it lean and memory-efficient.",
        },
        {
          icon: "🪣",
          label: "S3 Stores File",
          detail:
            "S3 validates signature & expiry, stores with 11-nines durability across multiple AZs, and fires an ObjectCreated event. File stored with private ACL until processing is complete.",
        },
        {
          icon: "⚡",
          label: "Lambda Processes File",
          detail:
            "S3 event triggers Lambda. Generates 3 resized variants (150px/600px/1200px) via Sharp, strips EXIF metadata, runs content-policy scan, saves all variants to /processed/.",
        },
        {
          icon: "👤",
          label: "DB Updated, User Notified",
          detail:
            "Lambda updates Product DB with CDN URLs for all three variants. Sends SNS → WebSocket notification: 'Your image is live!' Total post-upload processing time: ~3 seconds.",
        },
      ],
    },

    /* ── Search Flow ── */
    {
      id: "search-flow",
      name: "Search Flow",
      icon: "🔍",
      description:
        "How a search query is preprocessed, matched, ranked, and returned in milliseconds",
      steps: [
        {
          icon: "👤",
          label: "User Types Query",
          detail:
            "Browser debounces 300ms after last keystroke, then sends GET /api/search?q=nike+running+shoes&page=1&sort=relevance&filters=brand:Nike.",
        },
        {
          icon: "🔀",
          label: "Search API Preprocesses",
          detail:
            "Normalises query: lowercase, tokenise, remove stop words, expand synonyms ('sneakers' → 'shoes'). Constructs Elasticsearch query with field boosting (title > description).",
        },
        {
          icon: "⚡",
          label: "Redis Cache Check",
          detail:
            "Popular queries (>100/hr) cached in Redis. GET search:<query-hash>. Cache hit returns 50 result IDs in ~0.5ms. Reduces Elasticsearch load ~40% during peak hours.",
        },
        {
          icon: "🔍",
          label: "Elasticsearch Full-Text Search",
          detail:
            "Inverted index searches 10M documents in <10ms. BM25 relevance scoring applied. Filters (brand:Nike, in-stock:true) shrink results. Returns top-50 productIds by score.",
        },
        {
          icon: "🗄️",
          label: "Enrich from Product DB",
          detail:
            "Elasticsearch returns IDs only. API fetches full product data via SELECT WHERE id IN (...). 95%+ of hot results already in Redis — enrichment adds <5ms.",
        },
        {
          icon: "👤",
          label: "Ranked Results Delivered",
          detail:
            "Returns 50 products + facets (brands, price ranges, ratings) + searchId for analytics. Elasticsearch path: 15–40ms total. Cache hit path: 5ms.",
        },
      ],
    },

    /* ── Notification Flow ── */
    {
      id: "notification-flow",
      name: "Notification Flow",
      icon: "🔔",
      description:
        "How a single business event triggers personalised push, email, and SMS notifications",
      steps: [
        {
          icon: "📋",
          label: "Event Published",
          detail:
            "Order Service publishes OrderShipped event to Kafka: { orderId, userId, trackingId, estimatedDelivery }. Notification concerns completely separated from business logic.",
        },
        {
          icon: "🔔",
          label: "Notification Service Decides",
          detail:
            "Consumes event. Looks up user preferences (push enabled? SMS opted-in? quiet hours 11pm–7am?). Fetches device tokens. Renders personalised template for each channel.",
        },
        {
          icon: "📱",
          label: "Push via FCM / APNs",
          detail:
            "Android: Firebase Cloud Messaging. iOS: Apple Push Notification Service. FCM queues push for offline devices up to 4 weeks. Active device delivery rate: ~95%.",
        },
        {
          icon: "📧",
          label: "Email via Amazon SES",
          detail:
            "HTML email rendered from template. SES handles SPF/DKIM/DMARC signing, bounce handling, complaint tracking. Cost: $0.10/1,000 emails. Delivery: 30s–2min.",
        },
        {
          icon: "📲",
          label: "SMS via SNS / Twilio",
          detail:
            "Sent only if user opted-in AND order value > ₹500 (cost control). 160-char message with tracking link. ~98% delivery within 15 seconds. Twilio provides delivery receipts.",
        },
        {
          icon: "📋",
          label: "Delivery Tracking & Retry",
          detail:
            "Every attempt logged. Undelivered notifications retried with exponential backoff (1min → 5min → 30min). After 3 push failures, device token flagged inactive and cleaned from store.",
        },
      ],
    },
  ];

  const PATTERNS = [
    {
      id: "cqrs",
      name: "CQRS",
      icon: "⚡",
      category: "Data",
      summary:
        "Command Query Responsibility Segregation — separate read and write models",
      when: "High read:write ratio or complex domain logic",
      diagram:
        "Write → Command → Write DB (normalized)\nRead → Query → Read DB (denormalized/view)\n\nReplication event syncs Write DB → Read DB",
      pros: [
        "Optimized read/write models independently",
        "Scale reads separately from writes",
        "Event sourcing integration",
      ],
      cons: [
        "Eventual consistency between models",
        "Increased complexity",
        "Two databases to maintain",
      ],
    },
    {
      id: "saga",
      name: "Saga Pattern",
      icon: "🔗",
      category: "Transaction",
      summary:
        "Manage distributed transactions via a sequence of local transactions and compensating actions",
      when: "Microservice transactions spanning multiple services without 2PC",
      diagram:
        "Order → OrderSaga → PaymentService\n  ↓ success\nInventoryService\n  ↓ fail → CompensatePay\nNotifyUser",
      pros: [
        "No distributed lock",
        "Works across services/DBs",
        "Each step is independently retryable",
      ],
      cons: [
        "Compensating transactions are complex",
        "Eventual consistency",
        "Hard to debug",
      ],
    },
    {
      id: "circuit-breaker",
      name: "Circuit Breaker",
      icon: "🔌",
      category: "Resilience",
      summary:
        "Prevent cascading failures by stopping calls to a failing service after threshold is exceeded",
      when: "Service-to-service calls where downstream can be slow/unavailable",
      diagram:
        "Closed → (failures < threshold) → requests pass\n     ↓ threshold exceeded\nOpen → (all calls fail fast, no downstream call)\n     ↓ after timeout\nHalf-Open → (probe request)\n     ↓ success → Closed again",
      pros: [
        "Fast failure instead of timeout cascade",
        "Allows recovery time",
        "Fallback responses",
      ],
      cons: [
        "False positives can block healthy services",
        "State management across instances",
      ],
    },
    {
      id: "api-gateway",
      name: "API Gateway",
      icon: "🔀",
      category: "Infrastructure",
      summary:
        "Single entry point for all clients — handles routing, auth, rate limiting, SSL termination",
      when: "Microservices architecture with multiple clients",
      diagram:
        "Client → API Gateway → UserService\n                    → OrderService\n                    → ProductService\n[Auth, RateLimit, Logging, Transform]",
      pros: [
        "Centralized auth/security",
        "Protocol translation",
        "Simplifies clients",
      ],
      cons: [
        "Single point of failure if not HA",
        "Latency overhead",
        "Can become bottleneck",
      ],
    },
    {
      id: "event-sourcing",
      name: "Event Sourcing",
      icon: "📜",
      category: "Data",
      summary:
        "Store state as a sequence of immutable events rather than current state",
      when: "Need full audit trail, time-travel queries, or event replay",
      diagram:
        "UserCreated {id:1, email:x}\nEmailChanged {id:1, email:y}\nPlanUpgraded {id:1, plan:pro}\n→ Replay all → current state",
      pros: [
        "Complete audit history",
        "Temporal queries",
        "Event-driven integration",
      ],
      cons: [
        "Event schema evolution is hard",
        "Query complexity",
        "Storage grows indefinitely",
      ],
    },
    {
      id: "cache-aside",
      name: "Cache-Aside",
      icon: "⚡",
      category: "Performance",
      summary:
        "Application manages cache explicitly — load on miss, invalidate on write",
      when: "Read-heavy workloads with tolerable staleness",
      diagram:
        "Read: Check Cache → HIT→ return\n               → MISS→ load DB → store cache → return\nWrite: Update DB → Delete/Update cache",
      pros: [
        "Only caches what's needed",
        "DB failure survives (serve stale)",
        "Simple logic",
      ],
      cons: [
        "Cache miss penalty (2 round trips)",
        "Cache stampede on cold start",
      ],
    },
    {
      id: "bff",
      name: "BFF Pattern",
      icon: "📱",
      category: "API",
      summary:
        "Backend For Frontend — dedicated backend per client type (mobile, web, TV)",
      when: "Different clients need different data shapes or protocols",
      diagram:
        "Mobile App → Mobile BFF → Microservices\nWeb App    → Web BFF    → Microservices\nTV App     → TV BFF     → Microservices",
      pros: [
        "Optimized payload per client",
        "Client teams own their BFF",
        "Independent deployment",
      ],
      cons: ["Code duplication across BFFs", "More services to maintain"],
    },
    {
      id: "sidecar",
      name: "Sidecar Pattern",
      icon: "🔧",
      category: "Infrastructure",
      summary:
        "Deploy helper containers alongside main service for cross-cutting concerns",
      when: "Need consistent logging, metrics, mTLS across all services",
      diagram:
        "Pod:\n  [Main Service] + [Sidecar Proxy]\n  Sidecar handles: TLS, metrics, tracing\n  Main service: business logic only",
      pros: [
        "Separation of concerns",
        "Language agnostic",
        "Same config for all services",
      ],
      cons: [
        "More resource usage per pod",
        "Sidecar lifecycle tied to main service",
      ],
    },
  ];

  const GLOSSARY = [
    {
      term: "Latency",
      def: "Time to complete a single request/operation. e.g., 50ms p99 latency means 99% of requests complete in ≤50ms.",
    },
    {
      term: "Throughput",
      def: "Number of operations per second a system can handle. e.g., 50,000 RPS (requests per second).",
    },
    {
      term: "Availability",
      def: "Percentage of time a system is operational. 99.9% = 8.7 hours downtime/year. 99.99% = 52 minutes/year.",
    },
    {
      term: "Consistency",
      def: "All nodes see the same data at the same time. Strong consistency vs. eventual consistency.",
    },
    {
      term: "Partition Tolerance",
      def: "System continues operating despite network partitions (messages lost between nodes).",
    },
    {
      term: "CAP Theorem",
      def: "A distributed system can guarantee at most 2 of: Consistency, Availability, Partition Tolerance.",
    },
    {
      term: "Sharding",
      def: "Horizontal partitioning — splitting data across multiple DB instances by a shard key (e.g., user_id % N).",
    },
    {
      term: "Replication",
      def: "Copying data to multiple nodes for redundancy and read scaling. Leader-follower or multi-leader.",
    },
    {
      term: "Idempotency",
      def: "An operation that produces the same result whether called once or many times. Critical for retries.",
    },
    {
      term: "Rate Limiting",
      def: "Controlling the rate of requests to prevent abuse. Algorithms: token bucket, leaky bucket, fixed window.",
    },
    {
      term: "Circuit Breaker",
      def: "Stops calls to a failing service after threshold. States: Closed → Open → Half-Open.",
    },
    {
      term: "Consistent Hashing",
      def: "Hash ring that minimizes data movement when nodes are added/removed. Used by Dynamo, Cassandra.",
    },
    {
      term: "Bloom Filter",
      def: "Probabilistic data structure to test set membership. Fast, space-efficient. No false negatives.",
    },
    {
      term: "Event Sourcing",
      def: "Store all changes as append-only event log. Current state derived by replaying events.",
    },
    {
      term: "CQRS",
      def: "Command Query Responsibility Segregation. Separate models for writes (commands) vs reads (queries).",
    },
    {
      term: "Saga",
      def: "A sequence of local transactions to implement distributed transactions, with compensating actions on failure.",
    },
    {
      term: "mTLS",
      def: "Mutual TLS — both client and server authenticate each other with certificates. Used in service meshes.",
    },
    {
      term: "SLA / SLO / SLI",
      def: "SLA=agreement with customers, SLO=internal target (99.9% uptime), SLI=measurement (actual uptime %).",
    },
    {
      term: "Fanout",
      def: "One write triggers updates to many targets. Fanout-on-write (push) vs fanout-on-read (pull).",
    },
    {
      term: "Backpressure",
      def: "Mechanism to slow producers when consumers can't keep up. Prevents OOM crashes.",
    },
    {
      term: "Hotspot",
      def: "A single key/partition receiving disproportionate traffic. e.g., celebrity user on Instagram.",
    },
    {
      term: "WAL",
      def: "Write-Ahead Log — changes written to log before applying to DB. Enables crash recovery.",
    },
  ];

  const CHEAT_SHEETS = [
    {
      id: "redis",
      title: "When to Use Redis",
      icon: "⚡",
      items: [
        {
          label: "Session Storage",
          detail: "Store JWT/session data with TTL auto-expiry",
        },
        {
          label: "Rate Limiting",
          detail: "INCR + EXPIRE per user/IP for token bucket",
        },
        {
          label: "Caching",
          detail: "Cache-aside for DB query results, API responses",
        },
        {
          label: "Leaderboards",
          detail: "Sorted Sets (ZADD/ZRANGE) for real-time rankings",
        },
        {
          label: "Pub/Sub",
          detail: "Real-time messaging (though Kafka for durability)",
        },
        {
          label: "Distributed Locks",
          detail: "SETNX with expiry for mutex across services",
        },
        {
          label: "Job Queues",
          detail: "Redis Lists or Redis Streams for background jobs",
        },
        {
          label: "Geospatial",
          detail: "GEOADD/GEORADIUS for location-based queries",
        },
      ],
    },
    {
      id: "sql-vs-nosql",
      title: "SQL vs NoSQL Decision",
      icon: "🗄️",
      items: [
        {
          label: "Use SQL when",
          detail:
            "Complex relationships, ACID required, structured data, reporting/analytics",
        },
        {
          label: "Use NoSQL when",
          detail:
            "Document data, massive scale, flexible schema, hierarchical data",
        },
        {
          label: "PostgreSQL",
          detail: "Best: complex queries, JSON support, ACID, open source",
        },
        {
          label: "MySQL",
          detail: "Best: read-heavy web apps, mature ecosystem",
        },
        {
          label: "MongoDB",
          detail: "Best: document storage, rapid development, flexible schema",
        },
        {
          label: "Cassandra",
          detail: "Best: write-heavy, time-series, multi-datacenter",
        },
        {
          label: "DynamoDB",
          detail: "Best: key-value, AWS-native, auto-scaling, serverless",
        },
        {
          label: "Redis",
          detail: "Best: cache, real-time, low latency, ephemeral data",
        },
      ],
    },
    {
      id: "scaling",
      title: "Scaling Cheat Sheet",
      icon: "📈",
      items: [
        {
          label: "0→1K users",
          detail: "Single server + DB. Optimize slow queries first.",
        },
        {
          label: "1K→10K users",
          detail: "Add caching (Redis). Separate app and DB servers.",
        },
        {
          label: "10K→100K users",
          detail: "Load balancer, read replicas, CDN for static assets.",
        },
        {
          label: "100K→1M users",
          detail: "Horizontal scaling, DB sharding, message queues.",
        },
        {
          label: "1M→10M users",
          detail: "Microservices, multiple DCs, async everything.",
        },
        {
          label: "10M+ users",
          detail: "Global CDN, multi-region active-active, custom solutions.",
        },
        {
          label: "Cache first",
          detail: "Every scaling problem: add cache before scaling DB.",
        },
        {
          label: "Async over sync",
          detail: "Non-critical operations should never block the response.",
        },
      ],
    },
    {
      id: "kafka-vs-rabbitmq",
      title: "Kafka vs RabbitMQ",
      icon: "📨",
      items: [
        {
          label: "Use Kafka when",
          detail:
            "High throughput, event sourcing, replay, audit log, streaming analytics",
        },
        {
          label: "Use RabbitMQ when",
          detail:
            "Task queues, job processing, complex routing, per-message TTL",
        },
        {
          label: "Kafka: retention",
          detail:
            "Messages kept on disk (days/forever), multiple consumers can replay",
        },
        {
          label: "RabbitMQ: delivery",
          detail: "Message deleted after successful delivery — fire and forget",
        },
        {
          label: "Kafka throughput",
          detail: "1M+ messages/sec per broker — designed for streaming",
        },
        {
          label: "RabbitMQ throughput",
          detail: "50K messages/sec — sufficient for most task queues",
        },
        {
          label: "Consumer model",
          detail:
            "Kafka: pull (consumers control pace). RabbitMQ: push (broker pushes)",
        },
        {
          label: "Ordering",
          detail:
            "Kafka: guaranteed within partition. RabbitMQ: queue-level ordering only",
        },
      ],
    },
  ];

  const FAILURE_STUDIES = [
    {
      id: "aws-us-east-1",
      name: "AWS US-East-1 Outage (2017)",
      icon: "☁️",
      severity: "critical",
      duration: "~4 hours",
      impact: "Netflix, Slack, GitHub, Trello down",
      root_cause:
        "Engineer ran capacity-reduction command on S3 subsystem with a typo — removed far more servers than intended. S3 lost too many storage processes to operate.",
      timeline: [
        "09:37 — Debugging S3 billing issue, engineer runs remove command",
        "09:39 — S3 begins returning errors, EC2 and EBS impacted",
        "09:45 — AWS declares incident, begins investigation",
        "11:35 — S3 indexes begin to rebuild (slow process at scale)",
        "13:18 — S3 fully recovered",
      ],
      lessons: [
        "Validate capacity commands against minimum viable size",
        "Multi-region architecture would have kept apps running",
        "Never run capacity commands without a dry-run phase",
        "Design for S3 fallback (at minimum, serve stale cached responses)",
      ],
      architecture_fix:
        "Deploy multi-region. Use Route53 failover routing. Store critical static assets in multiple regions. S3 Object replication across regions.",
    },
    {
      id: "facebook-2021",
      name: "Facebook Global Outage (Oct 2021)",
      icon: "📘",
      severity: "critical",
      duration: "~6 hours",
      impact: "Facebook, Instagram, WhatsApp, Oculus offline globally",
      root_cause:
        "Routine BGP configuration update accidentally withdrew all Facebook's BGP route announcements from the global routing table. The entire AS disappeared from the internet. DNS stopped working. Internal tools also relied on the same infrastructure, making remote fix impossible — engineers had to physically access data centers.",
      timeline: [
        "15:51 UTC — BGP routes withdrawn globally",
        "15:52 UTC — DNS resolution for Facebook domains fails worldwide",
        "15:53 UTC — Facebook.com, Instagram, WhatsApp go dark",
        "17:00 UTC — Engineers begin physical access to DCs",
        "21:00 UTC — BGP routes restored, services recovering",
        "21:33 UTC — Full service restored",
      ],
      lessons: [
        "Infrastructure management tools must NOT depend on the same infrastructure",
        "BGP changes need staged rollout with automatic rollback",
        "Out-of-band access (separate network) required for emergency access",
        "Test your DR plan including 'what if DNS is down'",
      ],
      architecture_fix:
        "Out-of-band management network. Staged BGP changes with monitoring. Automatic BGP rollback on anomaly detection.",
    },
    {
      id: "cloudflare-2019",
      name: "Cloudflare Outage (July 2019)",
      icon: "🔥",
      severity: "major",
      duration: "~27 minutes",
      impact: "~18.6% Cloudflare traffic dropped globally",
      root_cause:
        "A WAF (Web Application Firewall) rule update contained a CPU-exhausting regex. The regex `/.*(?:.*=.*)/` caused catastrophic backtracking in every HTTP request. CPU utilization hit 100% globally. Traffic dropped 82% in 6 minutes.",
      timeline: [
        "13:42 UTC — WAF rule deployed globally",
        "13:44 UTC — CPU hits 100% across all PoPs",
        "13:47 UTC — Cloudflare pages and traffic start failing",
        "13:52 UTC — Engineers identify WAF as cause",
        "14:09 UTC — WAF component disabled globally",
        "14:10 UTC — Traffic restored",
      ],
      lessons: [
        "Regex in hot path needs strict CPU budget testing",
        "WAF rules need staged rollout (canary, not global immediate)",
        "Automatic rollback on CPU threshold breach",
        "ReDoS (Regular Expression Denial of Service) is a real attack vector",
      ],
      architecture_fix:
        "Canary deploy WAF rules (1% traffic first). Regex lint to detect catastrophic backtracking. Automatic rollback trigger on latency P99 spike.",
    },
  ];

  const INTERVIEW_QUESTIONS = [
    "Design a scalable notification system that sends 10M push notifications per day.",
    "How would you design Instagram's news feed for 500M daily active users?",
    "Design Google Drive — file storage, sync, and sharing at petabyte scale.",
    "How would you scale Redis when a single instance reaches memory limits?",
    "Design a distributed rate limiter that works across 100 servers.",
    "How would you design a real-time collaborative document editor (like Google Docs)?",
    "Design a globally distributed key-value store with tunable consistency.",
    "What is CAP theorem? Give a real example of each tradeoff.",
    "How would you handle a 10x traffic spike in the next 30 minutes?",
    "Design a type-ahead / autocomplete search feature for 1B queries/day.",
    "Explain consistent hashing with a real use case.",
    "Design a leaderboard that updates in real-time for 100M players.",
    "How does Kafka guarantee message ordering? What are the limitations?",
    "Design an API rate limiter using Redis — explain the algorithm.",
    "What are the tradeoffs between synchronous and asynchronous microservice communication?",
  ];

  const PERF_PRESETS = [
    {
      label: "Startup Blog",
      dau: 1000,
      rpu: 5,
      read_ratio: 0.95,
      avg_response_kb: 50,
    },
    {
      label: "Midsize SaaS",
      dau: 100000,
      rpu: 20,
      read_ratio: 0.85,
      avg_response_kb: 20,
    },
    {
      label: "Large Platform",
      dau: 5000000,
      rpu: 50,
      read_ratio: 0.9,
      avg_response_kb: 10,
    },
    {
      label: "Uber-scale",
      dau: 50000000,
      rpu: 30,
      read_ratio: 0.7,
      avg_response_kb: 5,
    },
  ];

  const FAILURE_TOGGLES = [
    {
      id: "ft-db",
      label: "Database Failure",
      icon: "🗄️",
      impact:
        "❌ Read/write operations fail\n✅ Mitigation: Read replicas serve reads\n✅ Write queue buffers writes temporarily\n⚠️ Stale data risk after 15-30s",
    },
    {
      id: "ft-cache",
      label: "Cache (Redis) Failure",
      icon: "⚡",
      impact:
        "❌ All requests hit Database directly\n⚠️ DB load increases 10-50x\n⚠️ Latency spikes from 5ms → 80ms\n✅ App still works (degraded performance)\n✅ Fix: Redis Sentinel / Redis Cluster for HA",
    },
    {
      id: "ft-service",
      label: "Service Failure",
      icon: "🔧",
      impact:
        "❌ Service X stops responding\n✅ Circuit Breaker opens (fast-fail)\n✅ Fallback: cached response or degraded UI\n✅ Load Balancer removes unhealthy instance\n⚠️ Other services timeout if no circuit breaker",
    },
    {
      id: "ft-lb",
      label: "Load Balancer Failure",
      icon: "⚖️",
      impact:
        "❌ All traffic to dead LB fails\n✅ Active-Passive: standby LB promoted via VRRP\n✅ DNS TTL update routes to backup LB\n⚠️ 30-60s downtime during failover\n✅ Fix: Multiple LBs + Anycast routing",
    },
    {
      id: "ft-network",
      label: "Network Partition",
      icon: "🌐",
      impact:
        "❌ Nodes can't communicate across partition\n⚠️ Per CAP theorem: choose Consistency or Availability\n✅ CP systems: reject writes, return errors\n✅ AP systems: accept writes, risk divergence\n✅ Fix: Multi-region with eventual sync",
    },
  ];

  const TIMELINE_STAGES = [
    {
      stage: "Startup (0–1K users)",
      icon: "🌱",
      color: "#22c55e",
      description:
        "Keep it simple. Ship fast. Premature optimization is the enemy.",
      nodes: ["Client", "Single Server", "Database"],
      connections: [0, 1, 2],
      notes: [
        "Single server handles everything",
        "SQLite or managed Postgres",
        "No cache needed yet",
        "Deploy on a single VPS (e.g., DigitalOcean)",
      ],
    },
    {
      stage: "Growth (10K–100K users)",
      icon: "🚀",
      color: "#6366f1",
      description: "DB is the bottleneck. Add cache. Separate concerns.",
      nodes: [
        "Client",
        "Load Balancer",
        "App Server A",
        "App Server B",
        "Redis Cache",
        "Primary DB",
        "Read Replica",
      ],
      connections: [0, 1, 2, 4, 5],
      notes: [
        "Add Redis — fix 80% of performance issues",
        "Read replicas for read-heavy queries",
        "CDN for static assets",
        "Background jobs (Celery/Sidekiq)",
      ],
    },
    {
      stage: "Scale (1M+ users)",
      icon: "⚡",
      color: "#f59e0b",
      description: "Bottleneck shifts to services. Decompose and distribute.",
      nodes: [
        "CDN",
        "Global LB",
        "API Gateway",
        "User Service",
        "Order Service",
        "Kafka",
        "Cache Cluster",
        "Sharded DB",
      ],
      connections: [0, 1, 2, 3, 4, 5, 6, 7],
      notes: [
        "Microservices for independent scaling",
        "Kafka for async event processing",
        "DB sharding by user_id/region",
        "Multi-region deployment",
      ],
    },
    {
      stage: "Hyper-Scale (100M+ users)",
      icon: "🌍",
      color: "#ef4444",
      description:
        "Custom solutions. Consistency vs availability becomes real.",
      nodes: [
        "Global CDN",
        "GeoDNS",
        "Regional LBs",
        "Hundreds of Services",
        "Distributed Cache",
        "Multi-region DB",
        "Data Lake",
      ],
      connections: [0, 1, 2, 3, 4, 5, 6],
      notes: [
        "Custom CDN co-located at ISPs",
        "Active-active multi-region",
        "Eventual consistency everywhere",
        "Chaos engineering in production",
      ],
    },
  ];

  const METRICS_CONFIG = {
    series: [
      {
        key: "latency",
        label: "Latency (ms)",
        unit: "ms",
        base: 45,
        variance: 30,
        good: 100,
        warn: 300,
        color: "#6366f1",
      },
      {
        key: "rps",
        label: "Request/sec",
        unit: "k RPS",
        base: 28,
        variance: 12,
        good: 0,
        warn: 0,
        color: "#22c55e",
      },
      {
        key: "error",
        label: "Error Rate (%)",
        unit: "%",
        base: 0.08,
        variance: 0.15,
        good: 0.5,
        warn: 2,
        color: "#ef4444",
      },
      {
        key: "cpu",
        label: "CPU Usage (%)",
        unit: "%",
        base: 42,
        variance: 25,
        good: 70,
        warn: 90,
        color: "#f59e0b",
      },
      {
        key: "cache",
        label: "Cache Hit Rate (%)",
        unit: "%",
        base: 94,
        variance: 5,
        good: 90,
        warn: 70,
        color: "#06b6d4",
      },
    ],
  };

  /* ════════════════════════════════════════════════════════════════
     SECTION 1 — Utility helpers
  ════════════════════════════════════════════════════════════════ */

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function badge(text, cls) {
    return `<span class="labs-badge labs-badge-${cls}">${esc(text)}</span>`;
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 2 — Labs Shell
  ════════════════════════════════════════════════════════════════ */

  const TABS = [
    { id: "simulator", label: "🏗️ Simulator", short: "Simulator" },
    { id: "casestudies", label: "📖 Case Studies", short: "Cases" },
    { id: "decisions", label: "🧠 Decisions", short: "Decisions" },
    { id: "flowplayer", label: "▶️ Flow Player", short: "Flow" },
    { id: "comparison", label: "⚖️ Comparison", short: "Compare" },
    { id: "patterns", label: "🧩 Patterns", short: "Patterns" },
    { id: "calculator", label: "🔢 Calculator", short: "Calc" },
    { id: "failures", label: "💥 Failures", short: "Failures" },
    { id: "cheatsheets", label: "📋 Cheat Sheets", short: "Sheets" },
    { id: "timeline", label: "📈 Timeline", short: "Timeline" },
    { id: "glossary", label: "📚 Glossary", short: "Glossary" },
    { id: "interview", label: "🎯 Interview", short: "Interview" },
    { id: "metrics", label: "📊 Metrics", short: "Metrics" },
  ];

  let _container = null;
  let _activeTab = "simulator";
  let _metricsInterval = null;

  function show(tab, container) {
    _container = container;
    _activeTab = tab || "simulator";
    cleanup();
    render();
  }

  function cleanup() {
    if (_metricsInterval) {
      clearInterval(_metricsInterval);
      _metricsInterval = null;
    }
  }

  function render() {
    if (!_container) return;
    _container.innerHTML = `
      <div class="labs-shell">
        <div class="labs-header">
          <div class="labs-title-row">
            <div class="labs-title">⚗️ Architecture Labs</div>
            <div class="labs-subtitle">Interactive system design tools — build, simulate, learn</div>
          </div>
        </div>
        <div class="labs-tabs" id="labsTabs">
          ${TABS.map((t) => `<button class="labs-tab${t.id === _activeTab ? " active" : ""}" data-tab="${t.id}">${t.label}</button>`).join("")}
        </div>
        <div class="labs-content" id="labsContent"></div>
      </div>`;

    _container.querySelectorAll(".labs-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        cleanup();
        _activeTab = btn.dataset.tab;
        _container
          .querySelectorAll(".labs-tab")
          .forEach((b) =>
            b.classList.toggle("active", b.dataset.tab === _activeTab),
          );
        renderTab(_activeTab);
      });
    });

    renderTab(_activeTab);
  }

  function renderTab(tab) {
    const content = document.getElementById("labsContent");
    if (!content) return;
    cleanup();
    const renderers = {
      simulator: renderSimulator,
      casestudies: renderCaseStudies,
      decisions: renderDecisions,
      flowplayer: renderFlowPlayer,
      comparison: renderComparison,
      patterns: renderPatterns,
      calculator: renderCalculator,
      failures: renderFailures,
      cheatsheets: renderCheatSheets,
      timeline: renderTimeline,
      glossary: renderGlossary,
      interview: renderInterview,
      metrics: renderMetrics,
    };
    const fn = renderers[tab];
    if (fn) fn(content);
    else content.innerHTML = `<div class="labs-placeholder">Coming soon…</div>`;
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 3 — System Design Simulator (Feature 1 + 6)
  ════════════════════════════════════════════════════════════════ */

  const SIM_COMPONENTS = [
    {
      id: "user",
      label: "User",
      icon: "👤",
      color: "client",
      desc: "End user browser or mobile app",
    },
    {
      id: "cdn",
      label: "CDN",
      icon: "🌍",
      color: "cdn",
      desc: "Content Delivery Network — serves static assets from edge PoPs globally",
    },
    {
      id: "lb",
      label: "Load Balancer",
      icon: "⚖️",
      color: "lb",
      desc: "Distributes traffic across multiple servers. Enables horizontal scaling.",
    },
    {
      id: "api",
      label: "API Gateway",
      icon: "🔀",
      color: "api",
      desc: "Single entry point — handles auth, rate limiting, routing",
    },
    {
      id: "service",
      label: "Service",
      icon: "🔧",
      color: "svc",
      desc: "Application microservice — processes business logic",
    },
    {
      id: "database",
      label: "Database",
      icon: "🗄️",
      color: "db",
      desc: "Primary persistent data store",
    },
    {
      id: "cache",
      label: "Cache",
      icon: "⚡",
      color: "cache",
      desc: "In-memory store (Redis) — reduces DB load, sub-ms reads",
    },
    {
      id: "queue",
      label: "Message Queue",
      icon: "📨",
      color: "queue",
      desc: "Async decoupling — Kafka or RabbitMQ for event-driven architecture",
    },
    {
      id: "search",
      label: "Search Engine",
      icon: "🔍",
      color: "svc",
      desc: "Elasticsearch or Opensearch for full-text search",
    },
    {
      id: "storage",
      label: "Object Storage",
      icon: "🗃️",
      color: "storage",
      desc: "S3 or GCS for large files, media, backups",
    },
  ];

  const GOOD_PATTERNS = [
    {
      check: (placed) => {
        const ids = placed.map((c) => c.id);
        return ids.includes("lb") || ids.includes("cdn");
      },
      message: "✅ Good: Traffic distribution component present",
    },
    {
      check: (placed) => placed.map((c) => c.id).includes("cache"),
      message: "✅ Cache layer present — excellent for read performance",
    },
    {
      check: (placed) => placed.map((c) => c.id).includes("queue"),
      message:
        "✅ Message queue present — async decoupling is production-ready",
    },
    {
      check: (placed) => placed.map((c) => c.id).includes("cdn"),
      message: "✅ CDN present — static assets served from edge",
    },
    {
      check: (placed) => {
        const ids = placed.map((c) => c.id);
        return ids.includes("database");
      },
      message: "✅ Database present",
    },
  ];
  const MISSING_WARNINGS = [
    {
      check: (placed) => !placed.map((c) => c.id).includes("cache"),
      message: "⚠️ No cache — DB will be overloaded at scale. Add Redis.",
    },
    {
      check: (placed) => !placed.map((c) => c.id).includes("queue"),
      message:
        "⚠️ No message queue — all operations are synchronous. Add Kafka/RabbitMQ for async.",
    },
    {
      check: (placed) =>
        !placed.map((c) => c.id).includes("lb") &&
        !placed.map((c) => c.id).includes("cdn"),
      message:
        "⚠️ No load balancer or CDN — single point of failure, no horizontal scale.",
    },
    {
      check: (placed) => !placed.map((c) => c.id).includes("cdn"),
      message:
        "⚠️ No CDN — static content served from origin, high latency globally.",
    },
    {
      check: (placed) =>
        placed.map((c) => c.id).includes("service") &&
        !placed.map((c) => c.id).includes("api"),
      message:
        "⚠️ Services without API Gateway — missing auth, rate limiting, unified entry point.",
    },
  ];

  let simPlaced = [];
  let simDragging = null;

  function renderSimulator(container) {
    simPlaced = [];
    container.innerHTML = `
      <div class="sim-shell">
        <div class="sim-top-bar">
          <h2>🏗️ System Design Simulator</h2>
          <p>Drag components to build your architecture. The simulator evaluates your design.</p>
        </div>
        <div class="sim-workspace">
          <div class="sim-palette">
            <div class="sim-palette-title">Components</div>
            ${SIM_COMPONENTS.map(
              (c) => `
              <div class="sim-comp" draggable="true" data-comp-id="${c.id}" title="${c.desc}">
                <span class="sim-comp-icon">${c.icon}</span>
                <span class="sim-comp-label">${c.label}</span>
              </div>`,
            ).join("")}
            <div class="sim-palette-hint">Drag to canvas →</div>
          </div>
          <div class="sim-canvas" id="simCanvas">
            <div class="sim-canvas-empty" id="simEmpty">
              <div class="sim-empty-icon">🏗️</div>
              <div>Drop components here to build</div>
              <div style="font-size:12px;opacity:.5;margin-top:4px">Start with User → CDN → Load Balancer</div>
            </div>
            <div class="sim-flow" id="simFlow"></div>
          </div>
          <div class="sim-eval-panel" id="simEval">
            <div class="sim-eval-title">📊 Architecture Evaluation</div>
            <div class="sim-eval-empty">Add components to see evaluation…</div>
          </div>
        </div>
        <div class="sim-footer-bar">
          <button class="labs-btn labs-btn-secondary" id="simClear">🗑️ Clear Canvas</button>
          <button class="labs-btn labs-btn-primary" id="simEvaluateBtn">🔍 Evaluate Architecture</button>
          <button class="labs-btn labs-btn-outline" id="simPreset">💡 Load Example</button>
        </div>
      </div>`;

    const canvas = document.getElementById("simCanvas");
    const flowEl = document.getElementById("simFlow");

    // Drag from palette
    container.querySelectorAll(".sim-comp").forEach((comp) => {
      comp.addEventListener("dragstart", (e) => {
        simDragging = comp.dataset.compId;
        e.dataTransfer.effectAllowed = "copy";
      });
    });

    canvas.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    });

    canvas.addEventListener("drop", (e) => {
      e.preventDefault();
      const compDef = SIM_COMPONENTS.find((c) => c.id === simDragging);
      if (!compDef) return;
      if (!simPlaced.find((p) => p.id === compDef.id)) {
        simPlaced.push(compDef);
      }
      updateSimCanvas(flowEl);
      updateSimEval();
    });

    document.getElementById("simClear").addEventListener("click", () => {
      simPlaced = [];
      updateSimCanvas(flowEl);
      updateSimEval();
    });

    document
      .getElementById("simEvaluateBtn")
      .addEventListener("click", updateSimEval);

    document.getElementById("simPreset").addEventListener("click", () => {
      simPlaced = SIM_COMPONENTS.filter((c) =>
        [
          "user",
          "cdn",
          "lb",
          "api",
          "service",
          "cache",
          "database",
          "queue",
        ].includes(c.id),
      );
      updateSimCanvas(flowEl);
      updateSimEval();
    });
  }

  function updateSimCanvas(flowEl) {
    const empty = document.getElementById("simEmpty");
    if (simPlaced.length === 0) {
      empty.style.display = "flex";
      flowEl.innerHTML = "";
      return;
    }
    empty.style.display = "none";
    flowEl.innerHTML = simPlaced
      .map(
        (c, i) => `
      <div class="sim-node sim-node-${c.color}">
        <div class="sim-node-icon">${c.icon}</div>
        <div class="sim-node-label">${c.label}</div>
        <button class="sim-node-remove" data-idx="${i}" title="Remove">✕</button>
      </div>
      ${i < simPlaced.length - 1 ? '<div class="sim-arrow">↓</div>' : ""}`,
      )
      .join("");

    flowEl.querySelectorAll(".sim-node-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(btn.dataset.idx);
        simPlaced.splice(idx, 1);
        updateSimCanvas(flowEl);
        updateSimEval();
        e.stopPropagation();
      });
    });
  }

  function updateSimEval() {
    const panel = document.getElementById("simEval");
    if (!panel) return;
    if (simPlaced.length === 0) {
      panel.innerHTML = `<div class="sim-eval-title">📊 Architecture Evaluation</div><div class="sim-eval-empty">Add components to see evaluation…</div>`;
      return;
    }

    const goods = GOOD_PATTERNS.filter((p) => p.check(simPlaced));
    const warns = MISSING_WARNINGS.filter((p) => p.check(simPlaced));
    const score = Math.min(
      100,
      Math.round((goods.length / (goods.length + warns.length + 0.01)) * 100),
    );
    const scoreColor =
      score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

    panel.innerHTML = `
      <div class="sim-eval-title">📊 Architecture Evaluation</div>
      <div class="sim-score-ring" style="--score-color:${scoreColor}">
        <div class="sim-score-num" style="color:${scoreColor}">${score}</div>
        <div class="sim-score-label">/ 100</div>
      </div>
      ${goods.map((g) => `<div class="sim-eval-item sim-eval-good">${esc(g.message)}</div>`).join("")}
      ${warns.map((w) => `<div class="sim-eval-item sim-eval-warn">${esc(w.message)}</div>`).join("")}
      ${simPlaced.map((c) => `<div class="sim-comp-info"><strong>${c.icon} ${c.label}</strong><p>${esc(c.desc)}</p></div>`).join("")}`;
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 4 — Case Studies (Feature 2)
  ════════════════════════════════════════════════════════════════ */

  let _caseSelected = null;

  function renderCaseStudies(container) {
    container.innerHTML = `
      <div class="cases-shell">
        <div class="cases-header">
          <h2>📖 System Design Case Studies</h2>
          <p>Real-world architecture breakdowns — problem, design, scaling, tradeoffs.</p>
        </div>
        <div class="cases-grid" id="casesGrid">
          ${CASE_STUDIES.map(
            (cs) => `
            <div class="case-card" data-case-id="${cs.id}">
              <div class="case-icon">${cs.icon}</div>
              <div class="case-name">${esc(cs.name)}</div>
              <div class="case-category">${esc(cs.category)}</div>
              ${badge(cs.difficulty, cs.difficulty)}
            </div>`,
          ).join("")}
        </div>
        <div class="case-detail" id="caseDetail"></div>
      </div>`;

    container.querySelectorAll(".case-card").forEach((card) => {
      card.addEventListener("click", () => {
        _caseSelected = card.dataset.caseId;
        container
          .querySelectorAll(".case-card")
          .forEach((c) =>
            c.classList.toggle("active", c.dataset.caseId === _caseSelected),
          );
        renderCaseDetail(CASE_STUDIES.find((cs) => cs.id === _caseSelected));
      });
    });
  }

  function renderCaseDetail(cs) {
    const det = document.getElementById("caseDetail");
    if (!det || !cs) return;
    det.innerHTML = `
      <div class="case-detail-header">
        <span class="case-detail-icon">${cs.icon}</span>
        <div>
          <h3>${esc(cs.name)}</h3>
          <p>${esc(cs.problem)}</p>
        </div>
      </div>
      <div class="case-sections">
        <div class="case-section">
          <div class="case-section-title">📋 Requirements</div>
          <ul>${cs.requirements.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
        </div>
        <div class="case-section">
          <div class="case-section-title">🏗️ Architecture Flow</div>
          <div class="case-flow">
            ${cs.flow
              .map(
                (node, i) => `
              <div class="case-node case-node-${node.color}">
                <span>${node.icon}</span> ${esc(node.label)}
              </div>
              ${i < cs.flow.length - 1 ? '<div class="case-flow-arrow">↓</div>' : ""}`,
              )
              .join("")}
          </div>
        </div>
        <div class="case-section">
          <div class="case-section-title">📈 Scaling Strategy</div>
          <p>${esc(cs.scaling)}</p>
        </div>
        <div class="case-section">
          <div class="case-section-title">⚖️ Tradeoffs</div>
          <div class="case-tradeoffs">
            ${cs.tradeoffs
              .map(
                (t) => `
              <div class="tradeoff-row">
                <div class="tradeoff-pro">✅ ${esc(t.pro)}</div>
                <div class="tradeoff-risk">⚠️ ${esc(t.risk)}</div>
              </div>`,
              )
              .join("")}
          </div>
        </div>
      </div>`;
    det.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 5 — Architecture Decision Simulator (Feature 3)
  ════════════════════════════════════════════════════════════════ */

  let _decQ = 0;
  let _decScore = 0;
  let _decAnswered = false;

  function renderDecisions(container) {
    _decQ = 0;
    _decScore = 0;
    _decAnswered = false;
    container.innerHTML = `<div class="dec-shell" id="decShell"></div>`;
    renderDecisionQ(document.getElementById("decShell"));
  }

  function renderDecisionQ(shell) {
    const q = DECISION_QUESTIONS[_decQ];
    if (!q) {
      shell.innerHTML = `
        <div class="dec-result">
          <div class="dec-result-icon">🎯</div>
          <h2>Quiz Complete!</h2>
          <div class="dec-final-score">${_decScore} / ${DECISION_QUESTIONS.length}</div>
          <p>${_decScore >= 5 ? "Excellent architect thinking! 🏆" : _decScore >= 3 ? "Good understanding — keep practicing! 💪" : "Review the explanations and try again! 📚"}</p>
          <button class="labs-btn labs-btn-primary" id="decRestart">🔄 Restart Quiz</button>
        </div>`;
      document.getElementById("decRestart").addEventListener("click", () => {
        _decQ = 0;
        _decScore = 0;
        _decAnswered = false;
        renderDecisionQ(shell);
      });
      return;
    }
    _decAnswered = false;
    shell.innerHTML = `
      <div class="dec-progress">
        <div class="dec-progress-bar" style="width:${(_decQ / DECISION_QUESTIONS.length) * 100}%"></div>
      </div>
      <div class="dec-counter">Question ${_decQ + 1} of ${DECISION_QUESTIONS.length} · Score: ${_decScore}</div>
      <div class="dec-scenario">${esc(q.scenario)}</div>
      <div class="dec-options" id="decOptions">
        ${q.options
          .map(
            (opt, i) => `
          <div class="dec-option" data-idx="${i}">
            <span class="dec-option-letter">${String.fromCharCode(65 + i)}</span>
            <span>${esc(opt.label)}</span>
          </div>`,
          )
          .join("")}
      </div>
      <div class="dec-explain" id="decExplain" style="display:none"></div>
      <div class="dec-nav" id="decNav" style="display:none">
        <button class="labs-btn labs-btn-primary" id="decNext">Next Question →</button>
      </div>`;

    container.querySelectorAll(".dec-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        if (_decAnswered) return;
        _decAnswered = true;
        const idx = parseInt(opt.dataset.idx);
        const chosen = q.options[idx];
        container.querySelectorAll(".dec-option").forEach((o, i) => {
          const isCorrect = q.options[i].correct;
          o.classList.add(
            isCorrect ? "dec-option-correct" : "dec-option-wrong",
          );
        });
        if (chosen.correct) _decScore++;
        document.getElementById("decExplain").innerHTML =
          `<div class="dec-explain-text">${esc(chosen.explain)}</div>`;
        document.getElementById("decExplain").style.display = "block";
        document.getElementById("decNav").style.display = "flex";
        document.getElementById("decNext").addEventListener("click", () => {
          _decQ++;
          renderDecisionQ(shell);
        });
      });
    });
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 6 — Visual Request Flow Player (Feature 4)
  ════════════════════════════════════════════════════════════════ */

  let _flowSelected = 0;
  let _flowStep = 0;

  function renderFlowPlayer(container) {
    _flowSelected = 0;
    _flowStep = 0;
    container.innerHTML = `
      <div class="flow-shell">
        <h2>▶️ Visual Request Flow Player</h2>
        <p>Step through how a request travels through the system — click Next Step.</p>
        <div class="flow-selector" id="flowSelector">
          ${FLOW_ANIMATIONS.map(
            (f, i) => `
            <button class="flow-sel-btn${i === 0 ? " active" : ""}" data-idx="${i}">
              ${f.icon} ${esc(f.name)}
            </button>`,
          ).join("")}
        </div>
        <div class="flow-player" id="flowPlayer"></div>
      </div>`;

    container.querySelectorAll(".flow-sel-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        _flowSelected = parseInt(btn.dataset.idx);
        _flowStep = 0;
        container
          .querySelectorAll(".flow-sel-btn")
          .forEach((b) =>
            b.classList.toggle("active", b.dataset.idx == _flowSelected),
          );
        renderFlowSteps(document.getElementById("flowPlayer"));
      });
    });

    renderFlowSteps(document.getElementById("flowPlayer"));
  }

  function renderFlowSteps(playerEl) {
    const flow = FLOW_ANIMATIONS[_flowSelected];
    const steps = flow.steps;
    playerEl.innerHTML = `
      <div class="flow-desc">${esc(flow.description)}</div>
      <div class="flow-steps-container">
        <div class="flow-diagram" id="flowDiagram">
          ${steps
            .map(
              (s, i) => `
            <div class="flow-step-node${i <= _flowStep ? " flow-step-active" : ""}${i === _flowStep ? " flow-step-current" : ""}" data-step="${i}">
              <div class="flow-step-icon">${s.icon}</div>
              <div class="flow-step-label">${esc(s.label)}</div>
              ${i < steps.length - 1 ? `<div class="flow-step-arrow${i < _flowStep ? " flow-arrow-done" : ""}">↓</div>` : ""}
            </div>`,
            )
            .join("")}
        </div>
        <div class="flow-info-col">
          <div class="flow-detail-panel">
            <div class="flow-detail-step">Step ${_flowStep + 1} / ${steps.length}</div>
            <div class="flow-detail-title">${steps[_flowStep].icon} ${esc(steps[_flowStep].label)}</div>
            <div class="flow-detail-text">${esc(steps[_flowStep].detail)}</div>
          </div>
          <div class="flow-controls">
            <button class="labs-btn labs-btn-secondary" id="flowPrev" ${_flowStep === 0 ? "disabled" : ""}>← Prev</button>
            <div class="flow-progress-dots">
              ${steps.map((_, i) => `<div class="flow-dot${i === _flowStep ? " active" : i < _flowStep ? " done" : ""}"></div>`).join("")}
            </div>
            <button class="labs-btn labs-btn-primary" id="flowNext" ${_flowStep === steps.length - 1 ? "disabled" : ""}>Next Step →</button>
          </div>
        </div>
      </div>`;

    document.getElementById("flowPrev").addEventListener("click", () => {
      if (_flowStep > 0) {
        _flowStep--;
        renderFlowSteps(playerEl);
      }
    });
    document.getElementById("flowNext").addEventListener("click", () => {
      if (_flowStep < steps.length - 1) {
        _flowStep++;
        renderFlowSteps(playerEl);
      }
    });
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 7 — Architecture Comparison (Feature 5)
  ════════════════════════════════════════════════════════════════ */

  const COMPARISONS = [
    {
      id: "mono-vs-micro",
      title: "Monolith vs Microservices",
      left: {
        name: "Monolith",
        icon: "🏛️",
        flow: ["Client", "Single Application", "Database"],
        pros: [
          "Simple to develop & deploy",
          "Easy debugging",
          "Low latency (in-process)",
          "No distributed complexity",
        ],
        cons: [
          "Hard to scale individual components",
          "Deployments affect everything",
          "Tech stack locked in",
          "Grows into Big Ball of Mud",
        ],
      },
      right: {
        name: "Microservices",
        icon: "🔀",
        flow: [
          "Client",
          "API Gateway",
          "User Service / Order Service / Payment Service",
          "Each Service's DB",
        ],
        pros: [
          "Independent scaling per service",
          "Deploy services independently",
          "Technology flexibility per service",
          "Smaller, focused codebases",
        ],
        cons: [
          "Distributed systems complexity",
          "Network latency between services",
          "Operational overhead (K8s, service mesh)",
          "Harder debugging across services",
        ],
      },
      verdict:
        "Start with a modular monolith. Move to microservices when specific services need independent scaling (usually >50 engineers, or clear traffic bottlenecks).",
    },
    {
      id: "sql-vs-nosql",
      title: "SQL vs NoSQL",
      left: {
        name: "SQL (Relational)",
        icon: "🗄️",
        flow: [
          "App",
          "SQL Query",
          "Table Joins",
          "ACID Transaction",
          "PostgreSQL / MySQL",
        ],
        pros: [
          "ACID guarantees",
          "Complex joins and queries",
          "Schema enforcement",
          "Mature tooling and community",
        ],
        cons: [
          "Horizontal scaling is hard",
          "Schema changes need migrations",
          "Not ideal for unstructured data",
          "Performance at billions of rows",
        ],
      },
      right: {
        name: "NoSQL",
        icon: "📄",
        flow: [
          "App",
          "Document / Key-Value Query",
          "No Joins (denormalized)",
          "Eventual Consistency",
          "MongoDB / Cassandra / DynamoDB",
        ],
        pros: [
          "Horizontal scaling built-in",
          "Flexible schema",
          "Designed for specific access patterns",
          "High write throughput",
        ],
        cons: [
          "Limited or no joins",
          "Eventual consistency (usually)",
          "Less expressive queries",
          "Consistency trade-offs",
        ],
      },
      verdict:
        "Use SQL for transactional data (payments, orders, users). Use NoSQL for massive scale with simple access patterns (events, logs, sessions, time-series).",
    },
    {
      id: "sync-vs-async",
      title: "Sync vs Async Communication",
      left: {
        name: "Synchronous (REST/gRPC)",
        icon: "🔄",
        flow: [
          "Service A",
          "→ HTTP/gRPC Request →",
          "Service B",
          "← Response ←",
          "Service A continues",
        ],
        pros: [
          "Simple request-response model",
          "Immediate feedback",
          "Easier debugging",
          "Strong consistency",
        ],
        cons: [
          "Caller blocked during processing",
          "Cascading failures",
          "Tight coupling",
          "Scaling harder under load",
        ],
      },
      right: {
        name: "Asynchronous (Kafka/Queue)",
        icon: "📨",
        flow: [
          "Service A",
          "→ Publish Event →",
          "Message Queue",
          "← Consume ←",
          "Service B (independently)",
        ],
        pros: [
          "Caller not blocked",
          "Buffer for traffic spikes",
          "Decoupled failure domains",
          "Natural fan-out to multiple consumers",
        ],
        cons: [
          "Eventual consistency only",
          "Complex debugging (trace IDs)",
          "Message ordering challenges",
          "Infrastructure overhead",
        ],
      },
      verdict:
        "Sync for user-facing reads (need immediate response). Async for writes, notifications, analytics, and anything that doesn't need an immediate answer.",
    },
    {
      id: "push-vs-pull",
      title: "Push vs Pull (Feed Systems)",
      left: {
        name: "Fan-out on Write (Push)",
        icon: "📤",
        flow: [
          "User Posts",
          "→ Fan-out Service",
          "→ Write to all followers' feeds",
          "Follower reads pre-computed feed",
        ],
        pros: [
          "O(1) read — instant feed load",
          "Consistent experience",
          "Predictable latency",
        ],
        cons: [
          "Celebrity problem (Beyoncé has 100M followers → 100M writes)",
          "Storage heavy",
          "Stale content if user offline",
        ],
      },
      right: {
        name: "Fan-out on Read (Pull)",
        icon: "📥",
        flow: [
          "Follower Requests Feed",
          "→ Fetch posts from followed users",
          "→ Merge and sort in memory",
          "Return feed",
        ],
        pros: [
          "No storage per user",
          "Always fresh content",
          "No celebrity problem",
        ],
        cons: [
          "O(N) read — slower for power users",
          "Slow for users following thousands",
          "CPU-intensive merging",
        ],
      },
      verdict:
        "Instagram/Twitter use hybrid: Fan-out on write for regular users, fan-out on read for celebrities (>1M followers). Cache pre-built feeds in Redis.",
    },
  ];

  let _compSelected = 0;

  function renderComparison(container) {
    _compSelected = 0;
    container.innerHTML = `
      <div class="comp-shell">
        <h2>⚖️ Architecture Comparison View</h2>
        <p>Side-by-side comparisons with pros, cons, and production verdicts.</p>
        <div class="comp-selector" id="compSelector">
          ${COMPARISONS.map(
            (c, i) => `
            <button class="comp-sel-btn${i === 0 ? " active" : ""}" data-idx="${i}">${esc(c.title)}</button>`,
          ).join("")}
        </div>
        <div class="comp-view" id="compView"></div>
      </div>`;

    container.querySelectorAll(".comp-sel-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        _compSelected = parseInt(btn.dataset.idx);
        container
          .querySelectorAll(".comp-sel-btn")
          .forEach((b) =>
            b.classList.toggle("active", b.dataset.idx == _compSelected),
          );
        renderCompView(document.getElementById("compView"));
      });
    });
    renderCompView(document.getElementById("compView"));
  }

  function renderCompView(el) {
    const comp = COMPARISONS[_compSelected];
    el.innerHTML = `
      <div class="comp-pair">
        ${["left", "right"]
          .map((side) => {
            const s = comp[side];
            return `
            <div class="comp-side comp-side-${side}">
              <div class="comp-side-title">${s.icon} ${esc(s.name)}</div>
              <div class="comp-flow">
                ${s.flow
                  .map(
                    (node, i) => `
                  <div class="comp-node">${esc(node)}</div>
                  ${i < s.flow.length - 1 ? '<div class="comp-flow-arrow">↓</div>' : ""}`,
                  )
                  .join("")}
              </div>
              <div class="comp-pros-cons">
                <div class="comp-pros">
                  ${s.pros.map((p) => `<div class="comp-pro">✅ ${esc(p)}</div>`).join("")}
                </div>
                <div class="comp-cons">
                  ${s.cons.map((c) => `<div class="comp-con">⚠️ ${esc(c)}</div>`).join("")}
                </div>
              </div>
            </div>`;
          })
          .join('<div class="comp-vs">VS</div>')}
      </div>
      <div class="comp-verdict">
        <div class="comp-verdict-title">🏆 Production Verdict</div>
        <div class="comp-verdict-text">${esc(comp.verdict)}</div>
      </div>`;
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 8 — Pattern Library (Feature 8)
  ════════════════════════════════════════════════════════════════ */

  function renderPatterns(container) {
    container.innerHTML = `
      <div class="pat-shell">
        <h2>🧩 Architecture Pattern Library</h2>
        <p>Core patterns used in production systems — when to use, diagrams, tradeoffs.</p>
        <div class="pat-grid" id="patGrid">
          ${PATTERNS.map(
            (p) => `
            <div class="pat-card" data-pat-id="${p.id}">
              <div class="pat-card-header">
                <span class="pat-icon">${p.icon}</span>
                <span class="pat-name">${esc(p.name)}</span>
                ${badge(p.category, "category")}
              </div>
              <div class="pat-summary">${esc(p.summary)}</div>
              <div class="pat-when"><strong>When:</strong> ${esc(p.when)}</div>
              <div class="pat-diagram"><pre>${esc(p.diagram)}</pre></div>
              <div class="pat-pros-cons">
                <div>
                  ${p.pros.map((pr) => `<div class="pat-pro">✅ ${esc(pr)}</div>`).join("")}
                </div>
                <div>
                  ${p.cons.map((co) => `<div class="pat-con">⚠️ ${esc(co)}</div>`).join("")}
                </div>
              </div>
            </div>`,
          ).join("")}
        </div>
      </div>`;
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 9 — Performance Calculator (Feature 9)
  ════════════════════════════════════════════════════════════════ */

  function renderCalculator(container) {
    container.innerHTML = `
      <div class="calc-shell">
        <h2>🔢 Performance Calculator</h2>
        <p>Estimate capacity requirements from traffic numbers.</p>
        <div class="calc-presets" id="calcPresets">
          ${PERF_PRESETS.map(
            (
              p,
            ) => `<button class="labs-btn labs-btn-outline calc-preset" data-name="${esc(p.label)}"
            data-dau="${p.dau}" data-rpu="${p.rpu}" data-rr="${p.read_ratio}" data-kb="${p.avg_response_kb}">${esc(p.label)}</button>`,
          ).join("")}
        </div>
        <div class="calc-form">
          <div class="calc-field"><label>Daily Active Users (DAU)</label><input type="number" id="calcDau" value="100000" min="1"></div>
          <div class="calc-field"><label>Avg Requests Per User / Day</label><input type="number" id="calcRpu" value="20" min="1"></div>
          <div class="calc-field"><label>Read Ratio (0–1, e.g. 0.9 = 90% reads)</label><input type="number" id="calcRr" value="0.9" step="0.05" min="0" max="1"></div>
          <div class="calc-field"><label>Avg Response Size (KB)</label><input type="number" id="calcKb" value="20" min="1"></div>
          <button class="labs-btn labs-btn-primary" id="calcRun" style="margin-top:12px">Calculate ⚡</button>
        </div>
        <div class="calc-results" id="calcResults"></div>
      </div>`;

    container.querySelectorAll(".calc-preset").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("calcDau").value = btn.dataset.dau;
        document.getElementById("calcRpu").value = btn.dataset.rpu;
        document.getElementById("calcRr").value = btn.dataset.rr;
        document.getElementById("calcKb").value = btn.dataset.kb;
        runCalc();
      });
    });

    document.getElementById("calcRun").addEventListener("click", runCalc);
    runCalc();
  }

  function runCalc() {
    const dau = parseFloat(document.getElementById("calcDau").value) || 0;
    const rpu = parseFloat(document.getElementById("calcRpu").value) || 0;
    const rr = parseFloat(document.getElementById("calcRr").value) || 0.9;
    const kb = parseFloat(document.getElementById("calcKb").value) || 20;

    const totalReqDay = dau * rpu;
    const rps = totalReqDay / 86400;
    const peakRps = rps * 3;
    const readRps = peakRps * rr;
    const writeRps = peakRps * (1 - rr);
    const bandwidthMbps = (peakRps * kb) / 125;
    const appServers = Math.ceil(peakRps / 500);
    const dbConns = Math.ceil(peakRps * 0.1);
    const cacheSize = Math.ceil((dau * 0.2 * kb) / 1024);
    const storageGB = Math.ceil((totalReqDay * kb * 30) / (1024 * 1024));

    const fmt = (n) =>
      n >= 1e9
        ? (n / 1e9).toFixed(1) + "B"
        : n >= 1e6
          ? (n / 1e6).toFixed(1) + "M"
          : n >= 1e3
            ? (n / 1e3).toFixed(1) + "K"
            : Math.round(n).toString();

    document.getElementById("calcResults").innerHTML = `
      <div class="calc-results-grid">
        <div class="calc-result-card">
          <div class="calc-result-title">Total Requests/Day</div>
          <div class="calc-result-val">${fmt(totalReqDay)}</div>
        </div>
        <div class="calc-result-card">
          <div class="calc-result-title">Avg RPS</div>
          <div class="calc-result-val">${fmt(rps)}</div>
        </div>
        <div class="calc-result-card">
          <div class="calc-result-title">Peak RPS (3× avg)</div>
          <div class="calc-result-val labs-accent">${fmt(peakRps)}</div>
        </div>
        <div class="calc-result-card">
          <div class="calc-result-title">Read RPS</div>
          <div class="calc-result-val">${fmt(readRps)}</div>
        </div>
        <div class="calc-result-card">
          <div class="calc-result-title">Write RPS</div>
          <div class="calc-result-val">${fmt(writeRps)}</div>
        </div>
        <div class="calc-result-card">
          <div class="calc-result-title">Bandwidth (peak)</div>
          <div class="calc-result-val">${bandwidthMbps.toFixed(0)} Mbps</div>
        </div>
        <div class="calc-result-card">
          <div class="calc-result-title">App Servers Needed</div>
          <div class="calc-result-val labs-warn">${appServers}</div>
        </div>
        <div class="calc-result-card">
          <div class="calc-result-title">DB Connections</div>
          <div class="calc-result-val">${fmt(dbConns)}</div>
        </div>
        <div class="calc-result-card">
          <div class="calc-result-title">Cache Memory (Redis)</div>
          <div class="calc-result-val">${cacheSize} MB</div>
        </div>
        <div class="calc-result-card">
          <div class="calc-result-title">Storage/Month</div>
          <div class="calc-result-val">${storageGB} GB</div>
        </div>
      </div>
      <div class="calc-note">
        ⓘ Assumes 500 RPS per app server (typical Node.js/Go). Peak = 3× average. DB connections = 10% of write RPS.
        Cache size for top 20% users with full hot data. Storage for 30-day retention.
      </div>`;
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 10 — Failure Simulator + Case Studies (Features 7 + 11)
  ════════════════════════════════════════════════════════════════ */

  let _failToggles = {};
  let _failTab = "simulator";

  function renderFailures(container) {
    _failToggles = {};
    container.innerHTML = `
      <div class="fail-shell">
        <div class="fail-tab-bar">
          <button class="fail-tab-btn active" data-ftab="simulator">💥 Failure Simulator</button>
          <button class="fail-tab-btn" data-ftab="studies">📰 Outage Case Studies</button>
        </div>
        <div id="failContent"></div>
      </div>`;

    container.querySelectorAll(".fail-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        _failTab = btn.dataset.ftab;
        container
          .querySelectorAll(".fail-tab-btn")
          .forEach((b) => b.classList.toggle("active", b === btn));
        renderFailTab(document.getElementById("failContent"));
      });
    });
    renderFailTab(document.getElementById("failContent"));
  }

  function renderFailTab(el) {
    if (_failTab === "simulator") {
      el.innerHTML = `
        <div class="fail-sim">
          <h2>💥 Distributed Systems Failure Simulator</h2>
          <p>Toggle failures to see how a well-architected system responds.</p>
          <div class="fail-system" id="failSystem"></div>
          <div class="fail-toggles" id="failToggles">
            ${FAILURE_TOGGLES.map(
              (ft) => `
              <div class="fail-toggle-row" data-ft-id="${ft.id}">
                <div class="fail-toggle-left">
                  <label class="fail-switch">
                    <input type="checkbox" class="fail-checkbox" data-ft-id="${ft.id}">
                    <span class="fail-slider"></span>
                  </label>
                  <span class="fail-toggle-icon">${ft.icon}</span>
                  <span class="fail-toggle-label">${esc(ft.label)}</span>
                </div>
              </div>`,
            ).join("")}
          </div>
          <div class="fail-impact" id="failImpact">
            <div class="fail-impact-placeholder">Enable a failure above to see system response…</div>
          </div>
        </div>`;

      updateFailSystem(el);

      el.querySelectorAll(".fail-checkbox").forEach((cb) => {
        cb.addEventListener("change", () => {
          _failToggles[cb.dataset.ftId] = cb.checked;
          updateFailSystem(el);
          updateFailImpact(el);
        });
      });
    } else {
      el.innerHTML = `
        <div class="fail-studies">
          <h2>📰 Real-World Outage Case Studies</h2>
          <p>What actually went wrong — and what architecture lessons we learned.</p>
          ${FAILURE_STUDIES.map(
            (fs) => `
            <div class="fail-study-card">
              <div class="fail-study-header">
                <span class="fail-study-icon">${fs.icon}</span>
                <div>
                  <div class="fail-study-name">${esc(fs.name)}</div>
                  <div class="fail-study-meta">
                    ${badge(fs.severity, fs.severity)} Duration: ${esc(fs.duration)} · Impact: ${esc(fs.impact)}
                  </div>
                </div>
              </div>
              <div class="fail-study-cause"><strong>Root Cause:</strong> ${esc(fs.root_cause)}</div>
              <details class="fail-study-details">
                <summary>View Timeline & Lessons</summary>
                <div class="fail-study-timeline">
                  ${fs.timeline.map((t) => `<div class="fail-timeline-item">⏱️ ${esc(t)}</div>`).join("")}
                </div>
                <div class="fail-study-lessons">
                  <strong>Architecture Lessons:</strong>
                  ${fs.lessons.map((l) => `<div class="fail-lesson">💡 ${esc(l)}</div>`).join("")}
                </div>
                <div class="fail-study-fix"><strong>Architectural Fix:</strong> ${esc(fs.architecture_fix)}</div>
              </details>
            </div>`,
          ).join("")}
        </div>`;
    }
  }

  function updateFailSystem(el) {
    const sys = el.querySelector("#failSystem");
    if (!sys) return;
    const nodes = [
      { id: "client", label: "Users", icon: "👤" },
      { id: "cdn", label: "CDN", icon: "🌍" },
      { id: "lb-node", label: "Load Balancer", icon: "⚖️", failKey: "ft-lb" },
      { id: "api-node", label: "API Gateway", icon: "🔀" },
      { id: "svc-node", label: "Services", icon: "🔧", failKey: "ft-service" },
      { id: "cache-node", label: "Cache", icon: "⚡", failKey: "ft-cache" },
      { id: "db-node", label: "Database", icon: "🗄️", failKey: "ft-db" },
    ];
    sys.innerHTML = nodes
      .map((n, i) => {
        const failed = n.failKey && _failToggles[n.failKey];
        return `
        <div class="fail-sys-node${failed ? " fail-sys-failed" : ""}">
          ${n.icon} ${n.label}${failed ? " ❌" : ""}
        </div>
        ${i < nodes.length - 1 ? `<div class="fail-sys-arrow${failed ? " fail-sys-arrow-blocked" : ""}">↓</div>` : ""}`;
      })
      .join("");
  }

  function updateFailImpact(el) {
    const impact = el.querySelector("#failImpact");
    if (!impact) return;
    const active = FAILURE_TOGGLES.filter((ft) => _failToggles[ft.id]);
    if (active.length === 0) {
      impact.innerHTML =
        '<div class="fail-impact-placeholder">Enable a failure above to see system response…</div>';
      return;
    }
    impact.innerHTML = active
      .map(
        (ft) => `
      <div class="fail-impact-card">
        <div class="fail-impact-title">${ft.icon} ${esc(ft.label)} — System Response</div>
        <pre class="fail-impact-pre">${esc(ft.impact)}</pre>
      </div>`,
      )
      .join("");
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 11 — Cheat Sheets (Feature 12)
  ════════════════════════════════════════════════════════════════ */

  function renderCheatSheets(container) {
    container.innerHTML = `
      <div class="cheat-shell">
        <h2>📋 Architecture Cheat Sheets</h2>
        <p>Quick references for common architecture decisions — bookmark these.</p>
        <div class="cheat-grid">
          ${CHEAT_SHEETS.map(
            (cs) => `
            <div class="cheat-card">
              <div class="cheat-card-title">${cs.icon} ${esc(cs.title)}</div>
              <div class="cheat-items">
                ${cs.items
                  .map(
                    (item) => `
                  <div class="cheat-item">
                    <div class="cheat-item-label">${esc(item.label)}</div>
                    <div class="cheat-item-detail">${esc(item.detail)}</div>
                  </div>`,
                  )
                  .join("")}
              </div>
            </div>`,
          ).join("")}
        </div>
      </div>`;
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 12 — Visual Timeline (Feature 17)
  ════════════════════════════════════════════════════════════════ */

  function renderTimeline(container) {
    container.innerHTML = `
      <div class="tl-shell">
        <h2>📈 Visual Learning Timeline</h2>
        <p>How a system architecture evolves as you scale from startup to hyper-scale.</p>
        <div class="tl-stages">
          ${TIMELINE_STAGES.map(
            (stage, i) => `
            <div class="tl-stage">
              <div class="tl-stage-header" style="border-left-color:${stage.color}">
                <div class="tl-stage-icon">${stage.icon}</div>
                <div>
                  <div class="tl-stage-name">${esc(stage.stage)}</div>
                  <div class="tl-stage-desc">${esc(stage.description)}</div>
                </div>
              </div>
              <div class="tl-stage-body">
                <div class="tl-arch">
                  ${stage.nodes
                    .map(
                      (n, j) => `
                    <div class="tl-node" style="border-color:${stage.color}">${esc(n)}</div>
                    ${j < stage.nodes.length - 1 ? `<div class="tl-node-arrow" style="color:${stage.color}">↓</div>` : ""}`,
                    )
                    .join("")}
                </div>
                <div class="tl-notes">
                  ${stage.notes.map((n) => `<div class="tl-note">▸ ${esc(n)}</div>`).join("")}
                </div>
              </div>
              ${i < TIMELINE_STAGES.length - 1 ? '<div class="tl-connector">▽ Scale up ▽</div>' : ""}
            </div>`,
          ).join("")}
        </div>
      </div>`;
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 13 — Glossary (Feature 15)
  ════════════════════════════════════════════════════════════════ */

  function renderGlossary(container) {
    container.innerHTML = `
      <div class="glos-shell">
        <h2>📚 Architecture Glossary</h2>
        <div class="glos-search-row">
          <input type="text" id="glosSearch" placeholder="Search terms…" class="glos-search">
        </div>
        <div class="glos-grid" id="glosGrid">
          ${GLOSSARY.map(
            (g) => `
            <div class="glos-card" data-term="${esc(g.term.toLowerCase())}">
              <div class="glos-term">${esc(g.term)}</div>
              <div class="glos-def">${esc(g.def)}</div>
            </div>`,
          ).join("")}
        </div>
      </div>`;

    document.getElementById("glosSearch").addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      container.querySelectorAll(".glos-card").forEach((card) => {
        card.style.display = card.dataset.term.includes(q) ? "" : "none";
      });
    });
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 14 — Interview Questions (Feature 19)
  ════════════════════════════════════════════════════════════════ */

  let _ivSel = null;

  function renderInterview(container) {
    container.innerHTML = `
      <div class="iv-shell">
        <h2>🎯 Architecture Interview Questions</h2>
        <p>Click a question to see example approach and key talking points.</p>
        <div class="iv-list">
          ${INTERVIEW_QUESTIONS.map(
            (q, i) => `
            <div class="iv-q" data-idx="${i}">
              <span class="iv-num">${String(i + 1).padStart(2, "0")}</span>
              <span class="iv-text">${esc(q)}</span>
              <span class="iv-arrow">›</span>
            </div>`,
          ).join("")}
        </div>
        <div class="iv-answer" id="ivAnswer"></div>
      </div>`;

    const TIPS = [
      "Clarify requirements → functional + non-functional (scale, latency, availability).\nEstimate scale → DAU, RPS, storage.\nHigh-level design → major components only.\nDeep dive → bottlenecks, DB schema, APIs.\nDiscuss tradeoffs — never say 'it depends' without explaining what it depends on.",
      "Start with single-user feed. Add follow graph. Discuss fan-out on write vs read. Mention Redis pre-built feeds. Introduce celebrity problem and hybrid approach.",
      "Block storage vs object storage. File metadata DB. Chunking for large files. Delta sync (send only changed chunks). Conflict resolution for concurrent edits.",
      "Single Redis: vertical scale, read replicas. Then Redis Cluster (data sharding across 16384 slots). Redis Sentinel for HA. Identify hot keys and mitigate.",
      "Approach: fixed window counter → sliding window log → token bucket. Redis INCR for atomic counters. Lua scripts for atomicity. Distributed: single Redis cluster for global state.",
      "Operational transform (OT) or CRDT for conflict-free edits. WebSocket for real-time sync. Server-authoritative state. Version vectors per character/operation.",
      "DynamoDB or Cassandra for key-value. Tunable consistency via quorum reads/writes (R+W > N). Vector clocks for version tracking. Merkle trees for anti-entropy repair.",
      "CAP: can't have all three. CP: Cassandra (strong quorum). AP: DynamoDB (eventual, but available). CA: impossible — partitions always happen. Real answer: PACELC.",
      "Short-term: add cache (Redis). Add read replicas. Horizontal scale (more app servers behind LB). Long-term: DB sharding, CDN, async queues for non-critical work.",
      "Trie in memory for top-K suggestions. Offline precompute top searches by prefix. Redis Sorted Sets for real-time trending. Edge caching suggestions per prefix.",
      "Hash ring with virtual nodes. Data distributed by hash(key). Node add/remove reassigns minimal keys (~1/N). Use case: Dynamo, Cassandra, memcached cluster.",
      "Redis Sorted Set per leaderboard. ZADD O(log N). ZREVRANGE for top-K O(log N + K). Sharding by game/region. Periodic snapshot to DB for persistence.",
      "Partition = unit of ordering. One partition = strict order. Multiple partitions = parallelism at cost of global ordering. Use partition key (e.g., user_id) to co-locate ordered messages.",
      "Token bucket in Redis: INCR key, set TTL on first write, reject if > limit. Lua script for atomic check-and-increment. Sliding window: ZADD timestamps, ZCOUNT last N seconds.",
      "Sync (REST/gRPC): simplicity, immediate response, strong consistency. Use for reads. Async (Kafka): decoupling, resilience, fan-out, buffering. Use for writes, events, notifications.",
    ];

    container.querySelectorAll(".iv-q").forEach((q) => {
      q.addEventListener("click", () => {
        const idx = parseInt(q.dataset.idx);
        container
          .querySelectorAll(".iv-q")
          .forEach((item) =>
            item.classList.toggle("active", item.dataset.idx == idx),
          );
        document.getElementById("ivAnswer").innerHTML = `
          <div class="iv-answer-content">
            <div class="iv-answer-title">💡 Approach & Key Points</div>
            <pre class="iv-answer-text">${esc(TIPS[idx] || "Clarify requirements, estimate scale, design high-level system, deep-dive bottlenecks, discuss tradeoffs.")}</pre>
          </div>`;
      });
    });
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 15 — Real Production Metrics Dashboard (Feature 20)
  ════════════════════════════════════════════════════════════════ */

  let _metricsHistory = {};

  function renderMetrics(container) {
    METRICS_CONFIG.series.forEach((s) => {
      _metricsHistory[s.key] = [];
    });

    container.innerHTML = `
      <div class="metrics-shell">
        <div class="metrics-header-row">
          <h2>📊 Real Production Metrics Dashboard</h2>
          <div class="metrics-controls">
            <button class="labs-btn labs-btn-outline" id="metricsPause">⏸ Pause</button>
            <button class="labs-btn labs-btn-secondary" id="metricsReset">↺ Reset</button>
          </div>
        </div>
        <p>Simulated live metrics from a distributed system. Watch patterns that indicate system issues.</p>
        <div class="metrics-cards" id="metricCards">
          ${METRICS_CONFIG.series
            .map(
              (s) => `
            <div class="metrics-card" id="mc-${s.key}">
              <div class="mc-label">${esc(s.label)}</div>
              <div class="mc-value" id="mcv-${s.key}" style="color:${s.color}">—</div>
              <div class="mc-bar-track"><div class="mc-bar-fill" id="mcb-${s.key}" style="background:${s.color}"></div></div>
              <canvas class="mc-sparkline" id="mcs-${s.key}" width="160" height="40"></canvas>
            </div>`,
            )
            .join("")}
        </div>
        <div class="metrics-incidents" id="metricIncidents"></div>
        <div class="metrics-legend">
          <div class="metrics-legend-title">📖 What these metrics mean</div>
          <div class="metrics-legend-grid">
            <div>⚡ <strong>Latency P99</strong> — 99th percentile response time. Above 300ms = users notice.</div>
            <div>🚀 <strong>RPS</strong> — Requests per second. Spikes may indicate viral traffic or DDoS.</div>
            <div>❌ <strong>Error Rate</strong> — % requests returning 5xx. Above 1% = critical alert.</div>
            <div>💻 <strong>CPU</strong> — Server CPU. Above 90% = scale out immediately.</div>
            <div>⚡ <strong>Cache Hit Rate</strong> — Below 85% = cache is ineffective. Review TTL strategy.</div>
          </div>
        </div>
      </div>`;

    let paused = false;
    document.getElementById("metricsPause").addEventListener("click", (e) => {
      paused = !paused;
      e.target.textContent = paused ? "▶ Resume" : "⏸ Pause";
    });
    document.getElementById("metricsReset").addEventListener("click", () => {
      METRICS_CONFIG.series.forEach((s) => {
        _metricsHistory[s.key] = [];
      });
    });

    let tick = 0;
    let incidentTick = -1;
    let incidentType = null;

    _metricsInterval = setInterval(() => {
      if (paused) return;
      tick++;

      // Random incident every ~30 ticks
      if (tick - incidentTick > 30 && Math.random() < 0.05) {
        incidentTick = tick;
        const types = ["db_slow", "cache_miss", "cpu_spike", "error_spike"];
        incidentType = types[Math.floor(Math.random() * types.length)];
        setTimeout(() => {
          incidentType = null;
        }, 8000);
      }

      METRICS_CONFIG.series.forEach((s) => {
        let val;
        if (s.key === "latency") {
          val =
            s.base +
            Math.random() * s.variance +
            (incidentType === "db_slow" ? 250 : 0);
        } else if (s.key === "rps") {
          val = s.base + Math.random() * s.variance;
        } else if (s.key === "error") {
          val =
            s.base +
            Math.random() * s.variance +
            (incidentType === "error_spike" ? 3.5 : 0);
        } else if (s.key === "cpu") {
          val =
            s.base +
            Math.random() * s.variance +
            (incidentType === "cpu_spike" ? 45 : 0);
          val = Math.min(100, val);
        } else if (s.key === "cache") {
          val =
            s.base -
            Math.random() * s.variance * 0.5 -
            (incidentType === "cache_miss" ? 30 : 0);
          val = Math.max(0, Math.min(100, val));
        }

        _metricsHistory[s.key].push(val);
        if (_metricsHistory[s.key].length > 40) _metricsHistory[s.key].shift();

        const valEl = document.getElementById(`mcv-${s.key}`);
        const barEl = document.getElementById(`mcb-${s.key}`);
        const canEl = document.getElementById(`mcs-${s.key}`);

        if (valEl) {
          valEl.textContent =
            s.key === "rps"
              ? val.toFixed(1) + "k"
              : val.toFixed(s.key === "error" ? 2 : 0) +
                s.unit.replace(/[^a-z%]/gi, "").trim();
          const isWarn =
            s.warn > 0 && (s.key === "cache" ? val < s.warn : val > s.warn);
          const isCrit =
            s.good > 0 && (s.key === "cache" ? val < s.good : val > s.good);
          valEl.style.color = isCrit ? "#ef4444" : isWarn ? "#f59e0b" : s.color;
        }
        if (barEl) {
          const pct =
            s.key === "rps"
              ? Math.min(100, (val / (s.base + s.variance * 2)) * 100)
              : s.key === "cache"
                ? val
                : Math.min(100, (val / (s.base + s.variance * 2 + 10)) * 100);
          barEl.style.width = pct + "%";
        }
        if (canEl) drawSparkline(canEl, _metricsHistory[s.key], s.color);
      });

      if (incidentType) {
        const names = {
          db_slow: "🔴 DB Slowdown",
          cache_miss: "🟠 Cache Miss Storm",
          cpu_spike: "🔴 CPU Spike",
          error_spike: "🔴 Error Rate Spike",
        };
        document.getElementById("metricIncidents").innerHTML = `
          <div class="metrics-incident-alert">
            ⚠️ INCIDENT: ${names[incidentType] || incidentType} — watch Latency and Error Rate metrics
          </div>`;
      } else {
        document.getElementById("metricIncidents").innerHTML = "";
      }
    }, 800);
  }

  function drawSparkline(canvas, data, color) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (data.length < 2) return;
    const min = Math.min(...data);
    const max = Math.max(...data) || min + 1;
    const pad = 2;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    data.forEach((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / (max - min)) * (h - pad * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    // fill area
    ctx.lineTo(
      pad + ((data.length - 1) / (data.length - 1)) * (w - pad * 2),
      h - pad,
    );
    ctx.lineTo(pad, h - pad);
    ctx.closePath();
    ctx.fillStyle = color + "22";
    ctx.fill();
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION 16 — Public API
  ════════════════════════════════════════════════════════════════ */

  window.ArchLabs = { show, cleanup };
})();

/* Part 15 — Estimation & Infrastructure Patterns (5 topics) */
const PART15 = {
  id: "part15",
  icon: "📐",
  title: "Part 15",
  name: "Estimation & Infrastructure Patterns",
  topics: [
    /* 1 */ {
      id: "p15t1",
      title: "Back-of-the-Envelope Estimation",
      subtitle:
        "Every FAANG system design interview starts here — learn to produce credible numbers in 2 minutes.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Why Estimation Matters",
          body: `<p>Before designing any system, you must answer: <em>how big is this?</em> Choosing between a single database and a sharded multi-region cluster depends entirely on scale. Back-of-the-envelope estimation gives you <strong>order-of-magnitude accuracy</strong> — you don't need the exact number, you need to know whether it's thousands, millions, or billions. That difference changes every architectural decision.</p>
<p style="margin-top:10px;">Interviewers use estimation to verify that you understand scale implications. A candidate who jumps straight to design without estimating is guessing. A candidate who estimates first demonstrates engineering discipline.</p>`,
        },
        {
          icon: "🔢",
          color: "si-purple",
          title: "The Numbers Every Engineer Must Know",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">LATENCY NUMBERS (approximate, commit these to memory)
  L1 cache reference:           0.5 ns
  L2 cache reference:           7 ns
  RAM read:                   100 ns
  SSD random read:          100,000 ns  = 0.1 ms
  HDD random read:       10,000,000 ns  = 10 ms
  Network within datacenter:    500 ns  = 0.5 ms
  Network cross-continent:   150,000 ns = 150 ms

STORAGE SIZES (powers of 10)
  1 KB   = 1,000 bytes
  1 MB   = 1,000 KB      = 10^6  bytes
  1 GB   = 1,000 MB      = 10^9  bytes
  1 TB   = 1,000 GB      = 10^12 bytes
  1 PB   = 1,000 TB      = 10^15 bytes

USEFUL CONVERSIONS
  1 million  = 10^6
  1 billion  = 10^9     (US billion)
  1 day      = 86,400 seconds ≈ 10^5 seconds
  1 year     = 3.2 × 10^7 seconds ≈ 3 × 10^7

QPS RULES OF THUMB
  1M requests/day  =  1M / 86,400 ≈ 12 RPS average
                   =  12 × 3 ≈ 36 RPS at peak (3× average)
  1B requests/day  ≈ 12,000 RPS average ≈ 36,000 RPS peak</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Estimation Walkthrough",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Scenario: Design ShopKart — 50M daily active users

STEP 1: TRAFFIC ESTIMATION
  DAU: 50M users
  Average page views per user per day: 10
  Total page views/day: 50M × 10 = 500M requests/day

  Read RPS  = 500M / 86,400 ≈ 5,800 RPS average
  Write RPS (10% are writes) = 580 RPS average
  Peak RPS  = 5× average = 29,000 RPS reads

STEP 2: STORAGE ESTIMATION
  New products listed/day: 10,000
  Product record size: 1 KB metadata + 500 KB images = ~501 KB
  Product storage/day: 10,000 × 500 KB = 5 GB/day
  Product storage/year: 5 × 365 = 1.8 TB/year

  Orders placed/day: 1M orders × 2 KB/order = 2 GB/day
  Order storage/year: 2 × 365 = 730 GB/year

STEP 3: BANDWIDTH ESTIMATION
  Average response size: 50 KB
  Peak bandwidth: 29,000 RPS × 50 KB = 1.45 GB/s outbound
  CDN offloads ~90% → origin needs: 145 MB/s

STEP 4: CACHE SIZE ESTIMATION
  Pareto rule: 20% of products get 80% of views
  Total products: 10M
  Hot products (20%): 2M × 1 KB = 2 GB → fits in Redis easily

CONCLUSION:
  → Needs distributed caching (2GB hot dataset)
  → Needs CDN (1.45 GB/s bandwidth)
  → Single DB read replica handles 5,800 RPS (fine)
  → Sharding NOT needed yet (writes only 580 RPS)</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "The 4-Step Estimation Framework",
          body: `<div style="display:flex;flex-direction:column;gap:10px;">
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">1</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Traffic (RPS):</strong> DAU × actions/user/day ÷ 86,400 = average RPS. Multiply by 3–5× for peak. Split reads vs writes (typically 90/10 or 80/20).</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">2</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Storage (GB/TB):</strong> Objects created/day × object size = daily growth. Multiply by retention period (1yr, 5yr, 10yr). Add 20% overhead for indexes and replicas.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">3</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Bandwidth (MB/s or GB/s):</strong> Peak RPS × average response size. Determine CDN vs origin split. This drives CDN and load balancer sizing.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">4</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Draw conclusions:</strong> Each number should drive an architectural decision. High storage → object store. High write RPS → sharding. Large hot dataset → distributed cache. High bandwidth → CDN mandatory.</div></div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>The goal of estimation is not precision — it's <strong>decision clarity</strong>. You need to know: Does this fit on one server? Do I need a cache? Do I need sharding? The answers change dramatically at different scales:</p>
<ul style="font-size:13px;line-height:1.9;padding-left:20px;margin-top:8px;color:var(--text-primary);opacity:0.9;">
  <li><strong>Under 1,000 RPS:</strong> Single server, no cache, no sharding. PostgreSQL with read replica if needed.</li>
  <li><strong>1,000–10,000 RPS:</strong> Load balancer + 2–3 app servers + Redis cache + read replicas.</li>
  <li><strong>10,000–100,000 RPS:</strong> Multiple server tiers + aggressive caching + possibly sharding writes.</li>
  <li><strong>Over 100,000 RPS:</strong> Global distribution, CDN for everything cacheable, multiple database shards, likely event-driven architecture to decouple load.</li>
</ul>
<p style="margin-top:10px;">Always state your assumptions explicitly: "I'm assuming 50M DAU, 10 actions each, 90% reads." This shows structured thinking even if the interviewer corrects your assumption — that's fine, adjust and continue.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Opening Every System Design Interview</strong><br/><span style="color:var(--text-primary);opacity:0.9;">After clarifying requirements, say: "Before I start designing, let me estimate the scale." Then walk through the 4 steps: "Assuming 50M DAU × 10 actions = 500M requests/day → roughly 6,000 RPS average, 30,000 RPS peak. Storage: 1M new posts/day × 5KB = 5GB/day, 1.8TB/year. This tells me I need: CDN for bandwidth, Redis cache for the hot read set, read replicas for DB, but no sharding yet at this write volume." This single paragraph demonstrates more architectural maturity than most candidates show in the entire interview.</span></div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">ESTIMATION → DECISION CHAIN

DAU × actions ÷ 86,400 = RPS
  &lt; 1K RPS    → single app server viable
  1K-10K RPS  → add load balancer + Redis cache
  10K+ RPS    → shard or add read replicas

objects/day × size → storage/year
  &lt; 1TB/yr   → single DB node fine
  1-100TB/yr  → object store (S3) + DB for metadata
  100TB+/yr   → distributed storage (HDFS, Cassandra)

RPS × response_size → bandwidth
  CDN offloads 90%+ of static/cacheable content</div>`,
        },
      ],
    },

    /* 2 */ {
      id: "p15t2",
      title: "API Gateway",
      subtitle:
        "The front door of every microservices architecture — far more than just a reverse proxy.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>An <strong>API Gateway</strong> is a single entry point that sits between clients (web, mobile, third-party) and your backend services. It handles cross-cutting concerns that every service would otherwise have to implement individually: authentication, rate limiting, SSL termination, request routing, request/response transformation, caching, and logging. Think of it as a <strong>smart reverse proxy with superpowers</strong>.</p>
<p style="margin-top:10px;">Without an API Gateway, every microservice exposes its own IP/port, handles its own auth tokens, implements its own rate limiting, and maintains its own TLS certificates. That's a maintenance nightmare at 50+ services. The API Gateway centralizes all of this.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "API Gateway vs Load Balancer",
          body: `<table style="width:100%;border-collapse:collapse;font-size:13px;">
  <thead>
    <tr style="background:rgba(99,102,241,0.08);">
      <th style="padding:8px 12px;text-align:left;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border);">Feature</th>
      <th style="padding:8px 12px;text-align:left;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border);">Load Balancer</th>
      <th style="padding:8px 12px;text-align:left;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border);">API Gateway</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);font-weight:600;">Primary Role</td>
      <td style="padding:8px 12px;color:var(--text-primary);">Distribute traffic to identical servers</td>
      <td style="padding:8px 12px;color:var(--text-primary);">Route requests to different services</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);font-weight:600;">Layer</td>
      <td style="padding:8px 12px;color:var(--text-primary);">L4 (TCP) or L7 (HTTP)</td>
      <td style="padding:8px 12px;color:var(--text-primary);">L7 (HTTP/REST/gRPC) only</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);font-weight:600;">Auth</td>
      <td style="padding:8px 12px;color:var(--text-primary);">None</td>
      <td style="padding:8px 12px;color:#10b981;font-weight:600;">JWT validation, OAuth, API keys</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);font-weight:600;">Rate Limiting</td>
      <td style="padding:8px 12px;color:var(--text-primary);">None</td>
      <td style="padding:8px 12px;color:#10b981;font-weight:600;">Per user, per API key, per IP</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);font-weight:600;">Request Transform</td>
      <td style="padding:8px 12px;color:var(--text-primary);">None</td>
      <td style="padding:8px 12px;color:#10b981;font-weight:600;">Header injection, body rewrite, protocol translation</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;color:var(--text-primary);font-weight:600;">Real Example</td>
      <td style="padding:8px 12px;color:var(--text-primary);">AWS ALB, NGINX, HAProxy</td>
      <td style="padding:8px 12px;color:var(--text-primary);">AWS API Gateway, Kong, Apigee, Traefik</td>
    </tr>
  </tbody>
</table>
<p style="margin-top:10px;font-size:13px;color:var(--text-primary);opacity:0.85;">In practice, you use both: Load Balancer in front of API Gateway instances (HA), and API Gateway in front of microservices.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart API Gateway Architecture",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Client (Web/Mobile/Partner API)
        │
        ▼
CloudFront (CDN — caches static + some API responses)
        │
        ▼
AWS API Gateway (Kong / AWS GW)
  ┌─────────────────────────────────────────┐
  │ 1. TLS Termination (HTTPS → HTTP)       │
  │ 2. Authenticate: validate JWT           │
  │ 3. Rate Limit: 100 req/min per user     │
  │ 4. Route: /products/* → Product Svc    │
  │           /orders/*   → Order Svc      │
  │           /users/*    → User Svc       │
  │ 5. Inject: X-User-Id header downstream │
  │ 6. Log: every request → CloudWatch     │
  │ 7. Transform: gRPC ↔ REST              │
  └─────────────────────────────────────────┘
        │          │           │
        ▼          ▼           ▼
  Product Svc  Order Svc   User Svc
  (internal    (internal   (internal
   HTTP, no     HTTP, no    HTTP, no
   TLS needed)  auth checks auth checks)

Services trust the Gateway has already authenticated.
Services receive X-User-Id header — no JWT parsing needed.</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Key API Gateway Patterns",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🔑 Authentication Offloading</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Gateway validates JWT signature using the public key. Valid → strips token, adds <code>X-User-Id: 42</code> header, forwards. Invalid → returns 401 immediately. Services never handle auth logic.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🔀 Request Aggregation (BFF pattern)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Mobile app needs product details + reviews + stock in one call. Gateway (or a BFF behind it) fans out to 3 services, merges responses, returns one JSON. Reduces mobile network round trips from 3 to 1.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🔄 Protocol Translation</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">External clients speak REST/JSON. Internal services use gRPC (efficient binary protocol). Gateway translates between them — clients get the REST interface they expect, services get the efficiency of gRPC.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🏷️ API Versioning</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><code>/v1/products</code> routes to stable service. <code>/v2/products</code> routes to new service (canary). Gateway handles the routing — services don't need version awareness. Enables gradual migrations.</p>
  </div>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "API Gateway Failure Modes",
          body: `<div style="display:flex;flex-direction:column;gap:8px;">
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>Single point of failure.</strong> Every request flows through the gateway. If it goes down, the whole API is down. Mitigation: deploy multiple gateway instances behind a load balancer, multi-AZ deployment.</div>
  </div>
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>Bottleneck.</strong> All traffic flows through one tier. The gateway must be horizontally scalable. Stateless gateways (Kong, NGINX-based) scale easily. Stateful gateways are a red flag.</div>
  </div>
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#f59e0b;">⚠️</span><div><strong>Latency addition.</strong> Each gateway processing step adds ~1–5ms. For latency-sensitive paths (payment confirmation), measure and budget. Gateway caching on safe GET routes offsets this.</div>
  </div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Microservices Architecture Question</strong><br/><span style="color:var(--text-primary);opacity:0.9;">"How do clients talk to your microservices?" Answer: "All external traffic enters through an API Gateway. The gateway handles TLS termination, JWT validation, and rate limiting — so each downstream service doesn't need to. The gateway routes based on URL prefix: /orders/* to Order Service, /products/* to Product Service. It injects X-User-Id into every forwarded request so services never touch JWT parsing code. Services communicate internally over gRPC without any gateway — only external-facing traffic flows through it."</span></div>`,
        },
      ],
    },

    /* 3 */ {
      id: "p15t3",
      title: "Service Discovery",
      subtitle:
        "How microservices find each other at runtime — without hardcoded IPs.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>In a microservices architecture, service instances start and stop dynamically (auto-scaling, deployments, crashes). You can't hardcode IP addresses. <strong>Service discovery</strong> is the mechanism by which services find each other's current network location at runtime. A service registry maintains a live map of service name → healthy instance IPs. Services register themselves on startup, deregister on shutdown (or get pruned by health checks).</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Client-Side vs Server-Side Discovery",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Client-Side Discovery</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">The calling service queries the service registry, gets a list of healthy instances, and picks one (round-robin/random). Example: Netflix Eureka + Ribbon. <strong>Pros:</strong> flexible load balancing logic. <strong>Cons:</strong> every service needs a discovery client library in its language/framework.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Server-Side Discovery</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">The caller sends the request to a load balancer. The load balancer queries the registry and forwards to an instance. Services don't need discovery logic — the infrastructure handles it. Example: AWS ELB + ECS service discovery, Kubernetes Services, Consul + Fabio. <strong>Most teams use this today</strong> — Kubernetes Service abstracts it completely.</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Kubernetes Service Discovery",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">In Kubernetes, Service Discovery is automatic:

# Service definition (once)
apiVersion: v1
kind: Service
metadata:
  name: order-service
spec:
  selector:
    app: order-service      # matches any pod with this label
  ports:
    - port: 8080

# Product Service calls Order Service:
# URL: http://order-service:8080/orders
# No IP needed. Kubernetes DNS resolves "order-service"
# to the ClusterIP, which load-balances to healthy pods.

When Order Service scales from 3 → 10 pods:
  → New pods register by matching the selector label
  → Kubernetes updates the Endpoints object
  → DNS resolves to the virtual IP that routes to all 10 pods
  → Product Service code is unchanged — still calls "order-service"

Tools used at different scales:
  Small (1-10 services)  → Kubernetes built-in DNS
  Medium (10-100)        → Consul (with health checks + KV store)
  Large (100+)           → Service Mesh (Istio / Linkerd) adds
                            mTLS, traffic policies, observability</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Health Checks — The Critical Piece",
          body: `<p style="margin-bottom:12px;">Service discovery without health checks is dangerous. A registry that sends traffic to crashed pods causes cascading failures. There are three levels of health checks:</p>
<div style="display:flex;flex-direction:column;gap:8px;">
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">1</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Liveness probe:</strong> Is the process alive? (TCP connection or HTTP 200). If it fails, Kubernetes restarts the pod. Detects deadlocks and crashes.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">2</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Readiness probe:</strong> Is the process ready to accept traffic? (HTTP 200 from <code>/health/ready</code> which checks DB connection, etc.). If it fails, the pod stays running but is removed from the Service's endpoints — no traffic sent. Prevents cold-start traffic loss.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">3</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Startup probe:</strong> For slow-starting services (JVM apps taking 30s to boot). Disables liveness & readiness probes until started — prevents premature restarts during startup.</div></div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>If you're on Kubernetes, service discovery is solved out of the box — every Service gets a DNS name, kube-proxy handles routing. You don't need Consul or Eureka. Add a service mesh (Istio) only when you need: mutual TLS between services, fine-grained traffic policies (canary at 1%), or distributed tracing built into the network layer.</p>
<p style="margin-top:10px;">The common mistake: using DNS-only discovery without health checks. DNS TTLs mean stale IPs persist in caches for minutes after a service goes down. Always combine service discovery with health-check-based routing to immediately drain unhealthy instances.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Microservices Communication Question</strong><br/><span style="color:var(--text-primary);opacity:0.9;">"How do your services find each other?" Answer: "We use Kubernetes Service Discovery. Each service is exposed as a Kubernetes Service with a stable DNS name. When Order Service needs to call Inventory Service, it uses the DNS name 'inventory-service' — no hardcoded IPs. Kubernetes' kube-proxy maintains an iptables ruleset that load-balances connections across healthy pods matching the service selector. Readiness probes ensure pods only receive traffic when they've established their DB connections."</span></div>`,
        },
      ],
    },

    /* 4 */ {
      id: "p15t4",
      title: "Leader Election",
      subtitle:
        "How distributed systems elect one node to be 'in charge' — and recover when it fails.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>Many distributed system tasks must be done by <strong>exactly one node</strong> at a time: writing to a primary database, running a scheduled job, coordinating cluster state. If two nodes both think they're the leader (split brain), you get duplicate work, data corruption, or conflicting updates. <strong>Leader election</strong> is the protocol by which a cluster of nodes agrees on which single node is currently the leader — and re-elects a new one if the leader fails.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "The Raft Algorithm (Simplified)",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Raft: consensus algorithm used by etcd, CockroachDB, Consul

Nodes have 3 states: Follower | Candidate | Leader

Initial State: all nodes are Followers

ELECTION TRIGGER:
  If Follower doesn't hear from Leader for 150-300ms:
    → converts to Candidate
    → increments its "term" counter
    → sends RequestVote to all other nodes

VOTING:
  Each node votes YES for the first Candidate it hears from
  (in a given term, each node votes once)
  Candidate with majority votes (N/2 + 1) becomes Leader

LEADER RESPONSIBILITIES:
  → Sends heartbeats every 50ms (suppresses new elections)
  → Handles all client writes
  → Replicates log entries to followers (Followers ACK)
  → Commits entry when majority ACKed

FAILURE SCENARIO:
  Leader stops sending heartbeats (crashed/network partition)
  → Followers timeout → new election triggered
  → New Leader elected in &lt;500ms typically

etcd hosts its own Raft cluster (3 or 5 nodes recommended)
Kubernetes uses etcd. Losing etcd ≠ losing the cluster
(existing workloads keep running), but no new changes apply.</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart — When Leader Election Is Needed",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">⏰ Scheduled Jobs (Cron Replacement)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">ShopKart's daily report job runs at midnight. With 5 app servers, all 5 might trigger the job, sending 5 report emails. Solution: use distributed lock (Redis SETNX) or election-based job scheduler (like Kubernetes CronJob — only one pod runs per schedule).</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">📊 Kafka Partition Leader</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Each Kafka partition has one leader broker and N replicas. Only the leader accepts writes. Kafka uses ZooKeeper (older) or KRaft (Kafka's own Raft) to elect partition leaders. ShopKart's order events published to partition 0 → only broker 2 (the current partition 0 leader) writes it.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🗄️ Database Primary Election</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">AWS RDS Multi-AZ: one primary, one standby. If primary fails, AWS uses internal election (similar to Raft) to promote standby to primary in ~30 seconds. The application reconnects to the new primary — connection string stays the same (AWS manages the DNS failover).</p>
  </div>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Split Brain — The Dangerous Failure Mode",
          body: `<p style="margin-bottom:12px;">A network partition can make two nodes each believe they're the leader:</p>
<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">5-node cluster (A, B, C, D, E). A is leader.
Network partition: {A, B} can't talk to {C, D, E}

{A, B}: A still thinks it's leader (no new election — A has majority quorum within the partition)
   Wait... A only has 2 votes, not majority of 3. A should step down.

{C, D, E}: elect C as new leader (majority quorum = 3)

Correctly designed (Raft): A steps down because it can't reach majority.
Incorrectly designed: A and C both write → split brain → data corruption

Prevention:
  Always require majority (N/2 + 1) quorum for leadership
  Fencing tokens: leader must include an increasing token in
  every write; storage layer rejects writes with stale tokens
  
Recommendation: use odd-numbered clusters (3, 5, 7 nodes)
  3 nodes: tolerates 1 failure
  5 nodes: tolerates 2 failures</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>As an application developer, you rarely implement Raft yourself. You use systems built on it: <strong>etcd</strong> (Kubernetes control plane), <strong>Consul</strong> (service mesh + KV store), <strong>ZooKeeper</strong> (Kafka coordination), <strong>CockroachDB</strong> (distributed SQL). You interact with these through their client APIs, not through consensus protocol details.</p>
<p style="margin-top:10px;">The practical skill is knowing <em>when you need leader election</em>: any time you have "exactly-once execution" semantics across multiple running instances. The simplest implementation for application-level problems (like preventing duplicate cron jobs): Redis-based distributed lock with a TTL. Reserve Raft-derived tools for infrastructure-level coordination.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Distributed Coordination Question</strong><br/><span style="color:var(--text-primary);opacity:0.9;">"How do you prevent a scheduled job from running on multiple servers?" Answer: "We use a distributed lock pattern — before running the job, each instance tries to acquire a Redis SETNX lock with a key like 'cron:daily-report' and a TTL of 5 minutes. Only the instance that wins the lock runs the job. If that instance crashes, the TTL expires and another instance can acquire the lock on the next cycle. For more complex coordination — like maintaining a single active writer across regions — we'd use etcd with Raft consensus."</span></div>`,
        },
      ],
    },

    /* 5 */ {
      id: "p15t5",
      title: "Fault Tolerance Patterns",
      subtitle:
        "Designing systems that fail gracefully — so one failing service doesn't bring down the whole platform.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Fault tolerance</strong> is designing a system so it continues to function — at some level — even when components fail. The key insight: in a large distributed system with 50+ services, <em>failure is the normal case</em>, not the exception. At any given moment, some service somewhere is degraded, restarting, or slow. Fault-tolerant design means this does not cause user-visible outages.</p>
<p style="margin-top:10px;">The failure modes you must design for: (1) service crash, (2) service slow (high latency), (3) service returning errors, (4) database unreachable, (5) network partition, (6) dependency of a dependency failing (cascading failure).</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "The Essential Patterns",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🔲 Bulkhead Pattern</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">A ship's bulkhead divides the hull into compartments — if one floods, the others stay dry. In software: allocate separate thread pools / connection pools per downstream service. If Recommendation Service hangs and exhausts its pool, Product Service's pool is unaffected. ShopKart: Order Service has separate connection pools for Payment Service (50 threads) and Inventory Service (20 threads) — Payment slowdown cannot exhaust Inventory connections.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🪂 Graceful Degradation (Fallback)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">When a dependency fails, return a degraded but useful response instead of an error. ShopKart: if Recommendation Service is down, the product page shows a static "Popular Products" list from cache instead of personalised recommendations. User sees the page. Revenue continues. No 500 error.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">⏱️ Timeout</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Every external call must have a timeout. Without a timeout, a slow dependency holds your thread forever — cascading to a full thread pool exhaustion. Rule: set timeout to &lt; 2× expected P99 latency. Payment API P99 = 200ms → set timeout to 400ms. Hard deadline: if your SLA is 500ms, no single external call can have a timeout &gt; 300ms.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">⚡ Circuit Breaker (recap)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">After N consecutive failures, stop attempting calls (Open state) and return immediately with a fallback. After a cooldown, let one trial request through (Half-Open). Reset on success. Prevents hammering a struggling downstream service and gives it time to recover.</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart — Cascading Failure Prevention",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">WITHOUT fault tolerance (domino effect):

  Payment Service → Inventory Service (slow: 10s response)
  Payment Service thread pool exhausted (waiting for Inventory)
  Order Service → Payment Service (no threads available: error)
  User checkout → Order Service → 503 ❌
  All users see checkout failure

WITH fault tolerance (contained failure):

  Payment Service → Inventory Service
    [Timeout: 500ms]
    [Circuit Breaker opens after 5 failures]
    [Bulkhead: Inventory pool isolated from max 20 threads]

  Payment Service timeout fires at 500ms:
    → Fallback: assume inventory OK, proceed with payment
    → Set flag: "inventory_confirmed: false"
    → Background job re-validates within 2 minutes

  Order Service → Payment Service → still works ✅
  User completes checkout ✅ (inventory validated async)
  If inventory actually OOS → async cancellation + refund</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Chaos Engineering — Proactively Finding Failures",
          body: `<p style="margin-bottom:12px;">Chaos Engineering deliberately injects failures into production to find weaknesses before they cause outages. Netflix pioneered this with <strong>Chaos Monkey</strong> — a tool that randomly kills production instances during business hours to ensure the system handles instance failures gracefully.</p>
<table style="width:100%;border-collapse:collapse;font-size:13px;">
  <thead>
    <tr style="background:rgba(99,102,241,0.08);">
      <th style="padding:8px 12px;text-align:left;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border);">Experiment</th>
      <th style="padding:8px 12px;text-align:left;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border);">What It Tests</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">Kill random pod every hour</td>
      <td style="padding:8px 12px;color:var(--text-primary);">Auto-restart + readiness probe work</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">Add 2s latency to Inventory Service</td>
      <td style="padding:8px 12px;color:var(--text-primary);">Timeouts + circuit breakers trigger correctly</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">Fill disk to 100% on DB node</td>
      <td style="padding:8px 12px;color:var(--text-primary);">Alerting fires, failover works</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;color:var(--text-primary);">Kill entire AZ (availability zone)</td>
      <td style="padding:8px 12px;color:var(--text-primary);">Multi-AZ setup properly distributes across zones</td>
    </tr>
  </tbody>
</table>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>The guiding rule: <strong>every external call must have three things: a timeout, a retry limit, and a fallback</strong>. If you can't answer "what happens if this external call fails?" for every dependency in your service, you have incomplete fault tolerance design.</p>
<p style="margin-top:10px;">Build failure scenarios into your design documentation: "If Payment Service is down, Order Service shows a 'payment pending' state and retries via background job. If Inventory Service is down, we optimistically allow the checkout and verify asynchronously." These explicit degradation paths are what interviewers — and production incidents — reveal the value of.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Reliability Design Question</strong><br/><span style="color:var(--text-primary);opacity:0.9;">"What happens if your Payment Service goes down during peak traffic?" Answer: "Three layers protect us: (1) Circuit Breaker — after 5 consecutive payment failures, the breaker opens and Order Service immediately returns a 'payment temporarily unavailable' error instead of waiting 30 seconds on each attempt, protecting our thread pool. (2) Bulkhead — Payment Service connections are isolated to a 50-thread pool; a slowdown there can't exhaust the pool Order Service uses for Inventory calls. (3) Graceful degradation — users are shown 'try again in a few minutes' with their cart saved, and we queue the payment retry in SQS."</span></div>`,
        },
      ],
    },
  ],
};

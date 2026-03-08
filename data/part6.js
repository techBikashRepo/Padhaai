/* Part 6 — Scalability (6 topics) — Deep Rewrite */
const PART6 = {
  id: "part6",
  icon: "📈",
  title: "Part 6",
  name: "Scalability",
  topics: [
    {
      id: "p6t1",
      title: "Vertical Scaling",
      subtitle:
        "Making your one server bigger — the first line of defence against traffic growth.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Vertical scaling</strong> (scale up) means upgrading the hardware of a single server — adding more CPU cores, more RAM, faster SSD storage, or upgraded network bandwidth. This makes the existing machine more powerful without changing your software architecture. It's the simplest scaling strategy.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why This Exists",
          body: `<p>Your ShopKart application is slow. Before you redesign the entire system, the fastest solution is often: give the server more RAM and CPU. Vertical scaling has zero code complexity. You don't need load balancers, session sharing, or distributed coordination. For many applications, especially in early stages, one well-provisioned machine can handle enormous load. A $10,000/month 192-core, 768GB RAM server is often cheaper than the engineering cost of building a distributed system.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Vertical Scaling Story",
          body: `<div class="diagram-box">Day 1: 2 vCPU, 4GB RAM — handles 50 req/second
  → Diwali sale announced. Traffic spikes 10x.
  
Step 1: Resize instance (AWS: stop instance, change type, start)
  2  vCPU →  32 vCPU  (16x CPU)
  4GB RAM → 128GB RAM (32x RAM) 
  → Now handles 500 req/second
  Cost: 30 minutes downtime during resize + higher monthly bill
  
Step 2: Tune (often overlooked after vertical scale):
  PostgreSQL: max_connections now 2000 (was 100)
  Node.js: cluster mode with 32 workers (was 2)
  Redis: allocated 8GB cache (was 512MB, causing cache misses)
  
With tuning: same 32-core machine now handles 800+ req/second.
  
The ceiling: AWS largest instance (u-24tb1.metal): 
  448 vCPUs, 24,576GB RAM, costs ~$219,000/month.
  Even that has a ceiling.
  
→ When you hit the vertical ceiling: horizontal scaling.</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Vertical vs Horizontal Comparison",
          body: `<table class="compare-table"><thead><tr><th></th><th>Vertical Scaling</th><th>Horizontal Scaling</th></tr></thead><tbody>
<tr><td><strong>How</strong></td><td>Bigger machine</td><td>More machines</td></tr>
<tr><td><strong>Code changes</strong></td><td>None</td><td>Session management, state sharing</td></tr>
<tr><td><strong>Downtime</strong></td><td>Brief (resize)</td><td>None (add nodes live)</td></tr>
<tr><td><strong>Cost</strong></td><td>Non-linear (exponential at top)</td><td>Linear</td></tr>
<tr><td><strong>Ceiling</strong></td><td>Hard limit (biggest machine exists)</td><td>Virtually infinite</td></tr>
<tr><td><strong>Failure</strong></td><td>Single point of failure</td><td>Resilient (lose one node, others serve)</td></tr>
<tr><td><strong>Best for</strong></td><td>Stateful workloads, databases</td><td>Stateless web servers, APIs</td></tr>
</tbody></table>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Jumping to horizontal scaling too soon.</strong> Some teams build complex Kubernetes clusters when a single larger machine would handle their traffic for years. Premature horizontal scaling adds enormous operational complexity. Exhaust vertical scaling first.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Not tuning after scaling up.</strong> Application configuration (connection pools, worker processes, JVM heap size) is often set for the original small machine. After scaling up, these limits become the new bottleneck.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Scaling Strategy</div><div class="interview-q">In scaling discussions, mention vertical as the first step: "For databases, we prefer vertical scaling — larger instance with more RAM for buffer pool, more IOPS for storage. Databases are hard to horizontally scale because of write coordination. For stateless app servers, we go horizontal. The hybrid approach: vertically scaled database with read replicas, horizontally scaled application layer with load balancer in front."</div></div>`,
        },
      ],
    },

    {
      id: "p6t2",
      title: "Horizontal Scaling",
      subtitle:
        "Running many copies of your service in parallel — the key to internet-scale systems.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Horizontal scaling</strong> (scale out) means adding more servers running the same application in parallel. Instead of one powerful server, you run many identical servers. A load balancer distributes incoming requests across all of them. Netflix doesn't run one massive server — it runs tens of thousands of small EC2 instances. Horizontal scaling is how you go from handling 1,000 requests/second to handling 1,000,000.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Architecture for Horizontal Scaling",
          body: `<div class="diagram-box">Before (vertical -- one big server):
  Client → [ShopKart Server: 64 vCPU, 256GB RAM]
  - Single point of failure
  - $25,000/month
  - 2,000 req/sec ceiling

After (horizontal -- many small servers):
  
  Clients
     ↓
  [Load Balancer]
  /    |    |   \
 [S1] [S2] [S3] [S4]  ← each: 4 vCPU, 16GB RAM
  
  Scale out event (Diwali sale):
  → Auto-scaling adds S5, S6, S7, S8 in 3 minutes
  → Load: 1,000 req/second split across 8 servers = 125 req/sec each
  → Perfectly manageable for 4-core machines
  
  Scale in event (after sale):
  → Auto-scaling removes S5-S8 in 10 minutes
  → Only pay for what you use
  
  Key requirements for horizontal scaling:
  1. Servers must be STATELESS (no session data stored locally)
  2. Shared database (not per-server)
  3. Shared cache (Redis, not local memory)
  4. Shared file storage (S3, not local disk)</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Auto-Scaling Policy",
          body: `<div class="diagram-box">AWS Auto Scaling Group — ShopKart App Servers:

  Minimum instances: 3 (high availability — zone failures)
  Maximum instances: 50 (cost cap)
  Desired capacity: starts at 3, scales automatically

  Scale-out trigger:
    IF avg CPU > 70% for 3 consecutive minutes
    THEN add 2 new instances
    (Launches from AMI: pre-baked with app code, ready in ~90 seconds)

  Scale-in trigger:
    IF avg CPU < 30% for 10 consecutive minutes
    THEN remove 1 instance (drain connections first — 60s drain period)

  Result during Diwali launch:
    9:00am  → 3 instances (normal traffic)
    9:01am  → sale goes live, traffic spikes
    9:04am  → CPU hits 70%, scale-out fires: 5 instances
    9:07am  → CPU still high: 7 instances
    9:10am  → 10 instances, CPU stabilises at 52%
    11:00pm → traffic drops, scale-in begins: back to 3 by midnight</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Horizontal scaling's true power is <strong>resilience</strong>, not just capacity. With 8 servers, losing one means 7 continue serving. With one server, losing it means complete outage. Cloud providers charge the same per-instance-hour for 8 small instances vs 1 large instance of equivalent total compute — so horizontal scaling often costs the same or less while delivering much better availability. The operational cost is managing more instances, which Kubernetes and auto-scaling groups handles automatically.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Scale to Million Users</div><div class="interview-q">For "how would you scale ShopKart to 10M users?" answer: "Stateless Node.js app servers behind an application load balancer, set up as an Auto Scaling Group. Session data in Redis cluster. Images and assets on S3 + CloudFront CDN. PostgreSQL with read replicas for read scaling. The key insight is that horizontal scaling of app servers only works if they're truly stateless — no in-memory sessions, no local file writes."</div></div>`,
        },
      ],
    },

    {
      id: "p6t3",
      title: "Stateless Servers",
      subtitle:
        "The prerequisite to horizontal scaling — servers that hold no session data between requests.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>stateless server</strong> processes each request using only the information in that request plus shared external stores — it has no memory of previous requests. Whether request #1,000,000 goes to Server A or Server B, the result is identical because neither server holds per-user state. Statelessness is the prerequisite to horizontal scaling: only stateless servers can be freely added or removed from a cluster.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Stateful vs Stateless ShopKart",
          body: `<div class="diagram-box">❌ STATEFUL SERVER (does NOT scale horizontally):

  Server A: Memory = { userId:42 → { cart: [shoes], loggedIn: true } }
  Server B: Memory = { }  ← empty

  Rahul logs in → request goes to Server A → state stored in Server A's RAM
  Rahul adds to cart → goes to Server A (sticky session) ✅
  Server A crashes → Rahul's session is GONE → logged out ❌
  Server B added to cluster → knows nothing about Rahul ❌

✅ STATELESS SERVER (scales perfectly):

  Server A: Memory = {}  ← always empty after request completes
  Server B: Memory = {}
  Server C: Memory = {}

  Shared External State:
    Redis:      session:abc123 → { userId:42, cart: [shoes] }
    PostgreSQL: orders, products... (source of truth)

  Rahul logs in → Server A creates session in Redis → returns JWT
  Rahul adds to cart → goes to Server B (different server) →
    Server B reads Redis (session:abc123) → knows it's Rahul →
    Updates Redis cart → returns ✅
  Server A crashes → Server B and C continue perfectly ✅
  Add Server D → immediately serves traffic ✅</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "What State Looks Like in Practice",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">🔴</div><div><strong>In-memory user sessions</strong> (stateful) → move to Redis</div></div>
  <div class="key-item"><div class="key-bullet">🔴</div><div><strong>In-memory application caches</strong> (stateful, inconsistent) → move to Redis</div></div>
  <div class="key-item"><div class="key-bullet">🔴</div><div><strong>Uploaded files on local disk</strong> (stateful) → move to S3</div></div>
  <div class="key-item"><div class="key-bullet">🔴</div><div><strong>WebSocket connections</strong> (stateful — tied to one server) → use Redis pub/sub for cross-server communication</div></div>
  <div class="key-item"><div class="key-bullet">🟢</div><div><strong>JWT tokens</strong> (stateless — server reads user info from the token, no server-side lookup)</div></div>
  <div class="key-item"><div class="key-bullet">🟢</div><div><strong>Request body + database lookups</strong> (no local server memory) → perfectly stateless</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">12-Factor App</div><div class="interview-q">Reference the 12-Factor App methodology: "Factor VI (Processes) states that app processes must be stateless and share-nothing. Any data that needs to persist must be stored in a stateful backing service — typically a database or Redis. We enforce this by storing nothing in process memory that needs to survive the request lifecycle. This is how we can run 30 identical containers behind a load balancer without any special coordination."</div></div>`,
        },
      ],
    },

    {
      id: "p6t4",
      title: "Sticky Sessions",
      subtitle:
        "When stateful servers exist — routing a user's requests to the same server consistently.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Sticky sessions</strong> (session affinity) is a load balancer feature that ensures all requests from a specific user always go to the same server. Once the load balancer routes User A to Server 2, all subsequent requests from User A go to Server 2. This is the workaround when you have stateful servers and can't immediately make them stateless.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why This Exists",
          body: `<p>Legacy applications store session data in server memory. You've inherited a 10-year-old PHP application that does this. You cannot rewrite it today. But you need to scale out to 3 servers. Sticky sessions let you add more servers without breaking the application, buying you time to migrate to a proper stateless architecture. Think of it as a technical debt payment plan, not a permanent solution.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Sticky Session Implementation",
          body: `<div class="diagram-box">Load Balancer with Sticky Sessions (Cookie-based):

  Step 1: Rahul's first request arrives at load balancer
  Step 2: LB picks Server 2 (least connections)
  Step 3: LB sets cookie:  Set-Cookie: SERVERID=srv2; Path=/
  Step 4: Rahul's browser automatically sends SERVERID=srv2 on every request
  Step 5: LB reads cookie → always routes to Server 2

  ❌ Problems with Sticky Sessions:
  
  Server 2 failure → all srv2 users lose sessions (logged out)
  ↓ Uneven load distribution:
  Server 1 [████░░░░] heavy user (100 req/min on this server)
  Server 2 [░░░░░░░░] light user (5 req/min)
  Hot users stay on Server 1 regardless of load
  
  ✅ Why stateless + Redis is better:
  
  Server 1 failure → Rahul's next request goes to Server 2 →
  Server 2 reads Redis → session intact → Rahul stays logged in
  Zero data loss, zero user disruption</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Sticky sessions are a valid engineering tradeoff when migration to stateless is complex. But document the technical debt explicitly: "We use sticky sessions because our checkout flow uses server-side sessions for multi-step order state. This is tracked in our tech-debt backlog as ARCH-41: migrate to Redis sessions. The risk: any server failure during checkout means lost cart state for affected users." Naming the risk and the ticket shows architectural maturity.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Drawbacks and Trade-offs</div><div class="interview-q">Always acknowledge the trade-off: "Sticky sessions solve the immediate scaling problem for stateful apps but introduce uneven load distribution and create a single point of failure per session. If Server 2 dies, all its users get logged out. We prefer stateless servers with JWT or Redis-backed sessions, which eliminate sticky session dependency entirely. Sticky sessions are a bridge pattern, not a destination."</div></div>`,
        },
      ],
    },

    {
      id: "p6t5",
      title: "Load Balancers",
      subtitle:
        "Distributing traffic across multiple servers — the traffic cop at the entrance of your system.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>load balancer</strong> is a server (or software component) that sits between clients and your application servers. It receives all incoming requests and distributes them across the server pool using an algorithm. It also performs <strong>health checks</strong> — if a server is down, the load balancer stops sending traffic to it. Load balancers are fundamental to both scalability and high availability.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Load Balancing Algorithms",
          body: `<table class="compare-table"><thead><tr><th>Algorithm</th><th>How It Works</th><th>Best For</th></tr></thead><tbody>
<tr><td><strong>Round Robin</strong></td><td>S1 → S2 → S3 → S1 → cycle</td><td>Identical servers, equal request weights</td></tr>
<tr><td><strong>Least Connections</strong></td><td>Send to server with fewest active connections</td><td>Variable request lengths (some take 5ms, some 5s)</td></tr>
<tr><td><strong>Weighted Round Robin</strong></td><td>S1 gets 60%, S2 gets 40% (based on capacity)</td><td>Heterogeneous server pool (different specs)</td></tr>
<tr><td><strong>IP Hash</strong></td><td>Hash(client_IP) determines server</td><td>Stateful apps needing affinity without cookies</td></tr>
<tr><td><strong>Random</strong></td><td>Pick random available server</td><td>Simple setups, surprisingly effective</td></tr>
</tbody></table>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Load Balancer Setup",
          body: `<div class="diagram-box">AWS Application Load Balancer (Layer 7):

  Incoming: shopkart.com traffic
     ↓
  [ALB] — SSL terminated here
    
  Routing rules (path-based routing):
  /api/search/*   → Target Group: Search Servers     (12 instances)
  /api/products/* → Target Group: Product Servers    (8 instances)
  /api/orders/*   → Target Group: Order Servers      (6 instances)
  /static/*       → Target Group: CDN (CloudFront)   (offloaded)
  
  Health Checks:
  Protocol: HTTP
  Path: /health
  Interval: 30 seconds
  Healthy threshold: 2 consecutive successes
  Unhealthy threshold: 3 consecutive failures
  → Unhealthy instance removed from rotation in 90 seconds

  Connection Draining:
  When scale-in removes a server:
  → LB stops sending NEW requests to it
  → Waits 60 seconds for existing requests to complete
  → Then terminates (zero request drops)</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Layer 4 vs Layer 7 Load Balancers",
          body: `<p><strong>Layer 4 (Network LB)</strong>: Operates on TCP/UDP. Routes by IP + port. Extremely fast, millions of connections, but can't inspect HTTP data. Use for non-HTTP workloads (game servers, streaming, IoT). <strong>Layer 7 (Application LB)</strong>: Reads HTTP headers, paths, cookies. Can route /api/search to Search servers and /api/orders to Order servers. Supports sticky sessions (by cookie), WebSocket connections, and A/B testing. AWS ALB, nginx, HAProxy all operate at Layer 7. Use Layer 7 for almost all web applications.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">High Availability</div><div class="interview-q">Mention the ALB itself being a potential SPOF: "AWS ALB is a managed service — AWS runs it across multiple availability zones. If you're using nginx as a self-managed LB, you need two nginx instances with Keepalived and a Virtual IP (VIP). When the active nginx fails, Keepalived moves the VIP to the standby in ~1 second. Always have HA for your HA solution."</div></div>`,
        },
      ],
    },

    {
      id: "p6t6",
      title: "Throughput vs Latency",
      subtitle:
        "Two fundamental performance metrics that trade off against each other in every system.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Latency</strong> is the time for a single request to complete: how long it takes for Rahul's product page to load. Measured in milliseconds. <strong>Throughput</strong> is the number of requests processed per unit of time: how many users can ShopKart serve simultaneously. Measured in requests/second (RPS) or transactions/second (TPS). The critical insight: optimising for one often hurts the other.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "The Bandwidth Analogy",
          body: `<p>A road analogy: a single-lane road carrying one car at a time — very low latency for that car (no waiting), very low throughput (1 car). A 10-lane highway with a tollbooth — cars queue (higher latency per car) but total throughput is massive (hundreds of cars/minute). <strong>Batching</strong> is the classic throughput-vs-latency tradeoff: sending database writes in batches of 100 every 10 seconds gives much higher throughput but adds up to 10 seconds of latency for any individual write.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Real Tradeoffs",
          body: `<div class="diagram-box">ShopKart Metrics (current):
  API Latency (p99): 120ms   (99% of requests complete in <120ms)
  API Latency (p50): 15ms    (50% complete in <15ms — the median)
  Throughput: 8,000 req/second

Tradeoff scenario 1 — Add connection pooling (PgBouncer):
  Individual request latency: +2ms (overhead of pool coordination)
  Throughput: 8,000 → 12,000 req/sec (pool reuse, fewer new connections)
  → Accepted: small latency increase, large throughput gain

Tradeoff scenario 2 — Async order confirmation emails:
  Without async: user waits 350ms (API calls SendGrid, waits for response)
  With async: user gets response in 12ms (email queued in background)
  User latency: 350ms → 12ms ✅
  Email system throughput: unchanged (same emails sent, just delayed 5-30sec)
  → Accepted: slight email delay is imperceptible to users

Tradeoff scenario 3 — Full-text search indexing:
  Real-time indexing: every product update indexed immediately
    Latency: 200ms per update (Elasticsearch call inline)
  Async indexing: updates batched and indexed every 30 seconds
    Latency: 5ms per update (just write to DB, background job indexes)
    Throughput: 40x higher (less Elasticsearch load)
  → Accepted for non-real-time content</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Percentile Latency — Why p99 Matters More Than Average",
          body: `<div class="diagram-box">ShopKart response time distribution (10,000 requests):
  Average: 45ms  ← misleading
  p50:     15ms  (half of users get <15ms)
  p95:     80ms  (95% of users get <80ms)
  p99:    120ms  (99% of users get <120ms — "tail latency")
  p99.9:  2500ms (0.1% of users wait 2.5 SECONDS)

At 8,000 req/sec:
  p99.9 slowness hits: 8 users EVERY SECOND.
  These are often your most important users (large orders, returning customers)

Why averages lie: 9,900 requests at 10ms + 100 requests at 4,000ms
  = Average 50ms. "Average response is fast!"
  = But 1% of users hate you.

→ Always monitor p95 and p99 in production. Alert on p99 degradation.
  SLO target: p99 < 200ms for ShopKart product APIs</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Performance Metrics</div><div class="interview-q">Answer with percentiles, not averages: "Our product API SLO targets p99 latency under 200ms and p50 under 20ms at 10,000 RPS. We monitor these with Prometheus and alert DevOps when p99 breaches threshold. The distinction between average and p99 matters — averages hide tail latency that affects real users. For checkout, we're stricter: p99 under 500ms because latency directly impacts conversion rate."</div></div>`,
        },
      ],
    },
  ],
};

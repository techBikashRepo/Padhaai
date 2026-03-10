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
          body: `<p style="margin-bottom:12px;"><strong>Vertical scaling</strong> (scale up) means upgrading the hardware of a single server — more CPU cores, more RAM, faster SSD, more network bandwidth. No software architecture change required. It’s the simplest first move when traffic grows.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Vertical Scaling Story",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🐼 ShopKart Day-1 → Diwali Scale-Up</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">Day 1:  2 vCPU, 4GB RAM &nbsp;&nbsp;→ 50 req/sec<br/>Resize: 32 vCPU, 128GB RAM → 800+ req/sec after tuning<br/><br/>Post-resize tuning (often skipped!):<br/>PostgreSQL: max_connections 100 → 2000<br/>Node.js: cluster workers 2 → 32<br/>Redis: cache allocation 512MB → 8GB</div>
    <p style="margin-top:8px;font-size:12px;color:#22c55e;">Resize took 30 min of downtime. No code changes. 16× throughput gain.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(99,102,241,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">⚖️ Vertical vs Horizontal</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Vertical</strong>: No code changes. Brief downtime to resize. Non-linear cost at top end. Hard ceiling (biggest machine in the world). Single point of failure. Best for stateful workloads (databases).</div>
      <div style="margin-top:6px;"><strong>Horizontal</strong>: Requires stateless design. No downtime. Linear cost. Virtually infinite scale. Built-in resilience. Best for stateless app servers.</div>
      <div style="margin-top:6px;"><span style="background:rgba(99,102,241,0.1);color:var(--accent);padding:2px 6px;border-radius:4px;font-size:11px;">💡 Hybrid</span> Vertically scale the database + horizontally scale app servers. Most production systems use this.</div>
    </div>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"For databases, we prefer vertical scaling — larger instance with more RAM for the buffer pool, more IOPS. Databases are hard to horizontally scale because of write coordination. For stateless app servers, we scale horizontally behind a load balancer. The hybrid approach: vertically scaled DB with read replicas, horizontally scaled application layer."
</span>
</div>`,
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
          body: `<p style="margin-bottom:12px;"><strong>Horizontal scaling</strong> (scale out) means adding more servers running the same application in parallel. A load balancer distributes incoming requests across all of them. Netflix doesn’t run one massive server — it runs tens of thousands of small EC2 instances. Horizontal scaling is how you go from 1,000 req/sec to 1,000,000.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Architecture & Auto-Scaling Policy",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌐 Load-Balanced Fleet</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">Before: Client → [1× 64vCPU server] — $25K/month, 2K req/sec ceiling<br/><br/>After:  Client → [ALB] → [S1][S2][S3][S4] (each 4vCPU, 16GB)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Scale-out event: Auto-Scaling adds S5–S8 in 3 min<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1K req/sec ÷ 8 servers = 125 req/sec each — easy</div>
    <p style="margin-top:8px;font-size:12px;color:var(--text-primary);opacity:0.8;"><strong>Requirements</strong>: stateless servers, shared Redis (not local), shared DB, S3 for files</p>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚖️ ShopKart Auto-Scaling Group</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>Min: 3 instances (survive AZ failure) &nbsp;• Max: 50 (cost cap)</div>
      <div>Scale-out: avg CPU &gt; 70% for 3 min → +2 instances (ready in ~90s)</div>
      <div>Scale-in: avg CPU &lt; 30% for 10 min → -1 instance (60s drain)</div>
      <div>Diwali: 3 instances at 9am → 10 instances by 9:10am → CPU 52% stable</div>
    </div>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"Stateless Node.js servers behind an ALB in an Auto Scaling Group. Session data in Redis cluster. Images on S3 + CloudFront. PostgreSQL with read replicas. Horizontal scaling of app servers only works if they’re truly stateless — no in-memory sessions, no local file writes."
</span>
</div>`,
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
          body: `<p style="margin-bottom:12px;">A <strong>stateless server</strong> processes each request using only the information in that request plus shared external stores — no memory of previous requests. Whether a request goes to Server A or Server B, the result is identical because neither holds per-user state. Statelessness is the prerequisite to horizontal scaling.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Stateful vs Stateless ShopKart",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">❌ Stateful (doesn’t scale)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.7;">Server A stores Rahul’s session in RAM. Server B knows nothing. Sticky sessions required. Server A crashes → Rahul is logged out. Can’t add Server D freely.</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Stateless (scales freely)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.7;">All servers have empty memory after each request. Redis holds sessions/carts. Rahul’s request goes to Server B → reads Redis → knows it’s Rahul. Server A crashes → Server B continues. Server D added → immediately serves traffic.</div>
  </div>
  <div style="padding:14px 16px;background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📦 State Migration Checklist</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><span style="color:#ef4444;">Red</span> — In-memory sessions → move to Redis</div>
      <div><span style="color:#ef4444;">Red</span> — In-memory caches → move to Redis</div>
      <div><span style="color:#ef4444;">Red</span> — Uploaded files on local disk → move to S3</div>
      <div><span style="color:#ef4444;">Red</span> — WebSocket connections → Redis pub/sub for cross-server events</div>
      <div><span style="color:#22c55e;">Green</span> — JWT tokens (user info in token, no server lookup needed)</div>
      <div><span style="color:#22c55e;">Green</span> — Request body + DB lookups (nothing stored in server memory)</div>
    </div>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"12-Factor App Factor VI (Processes): app processes must be stateless and share-nothing. Any data needing to survive the request lifecycle must live in a backing service — Redis or the DB. This is how we run 30 identical containers behind a load balancer with zero coordination logic."
</span>
</div>`,
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
          body: `<p style="margin-bottom:12px;"><strong>Sticky sessions</strong> (session affinity) is a load balancer feature that routes all requests from a specific user to the same server. Once the LB routes User A to Server 2, all subsequent requests go to Server 2. This is the workaround for stateful servers you can't immediately make stateless.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "How It Works & Why It's a Problem",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🍪 Cookie-Based Sticky Routing</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.7;">LB picks Server 2 for Rahul's first request → sets <code>Set-Cookie: SERVERID=srv2</code> → browser sends on every request → LB always routes to Server 2.</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">❌ Problems</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>Server 2 failure → all srv2 users lose sessions (no Redis backup)</div>
      <div>Uneven load: heavy user's traffic stays on Server 1 regardless of load</div>
      <div>Scale-in can't remove a server without disrupting active sessions</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🧠 Architect's Take</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Sticky sessions are a bridge pattern for legacy apps — valid if migrating a PHP app that stores sessions in server memory. Document the tech debt: 'ARCH-41: migrate checkout to Redis sessions.' With Redis sessions, server failure doesn't touch sessions and sticky sessions become unnecessary.</p>
  </div>
</div>`,
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
          body: `<p style="margin-bottom:12px;">A <strong>load balancer</strong> sits between clients and your application servers, distributing requests using an algorithm and performing health checks. If a server is down, the LB stops sending traffic to it. Fundamental to both scalability and high availability.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Algorithms & ShopKart Setup",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚖️ Load Balancing Algorithms</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Round Robin</strong>: S1→S2→S3→cycle. Identical servers.</div>
      <div><strong>Least Connections</strong>: Route to server with fewest active requests. Best for variable request duration.</div>
      <div><strong>Weighted Round Robin</strong>: S1 gets 60%, S2 gets 40% by capacity.</div>
      <div><strong>IP Hash</strong>: hash(IP) determines server. Stateful affinity without cookies.</div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🏪 ShopKart AWS ALB (Layer 7)</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">// Path-based routing<br/>/api/search/*   → Search Target Group &nbsp;(12 instances)<br/>/api/products/* → Product Target Group (8 instances)<br/>/api/orders/*   → Order Target Group &nbsp;&nbsp;(6 instances)<br/><br/>// Health Check: GET /health every 30s<br/>// Remove after 3 failures (~90s). Drain 60s before termination.</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">L4 vs L7 Load Balancers</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><strong>Layer 4</strong>: TCP/UDP routing by IP+port. Extremely fast. Can’t read HTTP headers. Use for non-HTTP (game servers, IoT). <strong>Layer 7</strong>: Reads HTTP headers, paths, cookies. Path-based routing, sticky sessions, WebSocket. AWS ALB, nginx, HAProxy. Use for almost all web apps.</div>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"AWS ALB is a managed service running across multiple AZs — no SPOF. If using self-managed nginx, run two instances with Keepalived + a Virtual IP. When active nginx fails, Keepalived moves the VIP to standby in ~1 second. Always HA your HA solution."
</span>
</div>`,
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
          body: `<p style="margin-bottom:12px;"><strong>Latency</strong>: time for a single request (Rahul’s page load). Measured in ms. <strong>Throughput</strong>: requests processed per second. Measured in RPS. Optimising for one often hurts the other.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Tradeoffs & Percentile Latency",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚖️ Real Tradeoffs</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Connection Pooling</strong>: +2ms latency per request, but throughput 8K → 12K req/sec. <span style="color:#22c55e;">Accepted</span></div>
      <div><strong>Async Email</strong>: User waits 12ms (vs 350ms). Email delayed 5–30s. <span style="color:#22c55e;">Accepted</span></div>
      <div><strong>Async Search Index</strong>: Update latency 5ms (vs 200ms). New products appear in search in 30s. <span style="color:#22c55e;">Accepted for non-real-time content</span></div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📊 Percentile Latency — Why p99 Matters More Than Average</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">ShopKart at 8K req/sec:<br/>Average: 45ms &nbsp;← misleading!<br/>p50: &nbsp;&nbsp;&nbsp;15ms &nbsp;← half of users<br/>p95: &nbsp;&nbsp;&nbsp;80ms<br/>p99: &nbsp;&nbsp;120ms<br/>p99.9: 2500ms ← 8 users per second! Heavy order, returning customer?<br/><br/>9,900 requests at 10ms + 100 requests at 4,000ms = Average 50ms!<br/>"Average is fast" but 1% of users hate you.</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🎯 Interview Insight</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">"Our product API SLO: p99 &lt; 200ms and p50 &lt; 20ms at 10K RPS. Monitored via Prometheus. Checkout is stricter: p99 &lt; 500ms because latency directly impacts conversion rate. Averages hide tail latency affecting real users — always monitor percentiles."
</p>
  </div>
</div>`,
        },
      ],
    },
  ],
};

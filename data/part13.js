/* Part 13 — Database Scaling (6 topics) */
const PART13 = {
  id: "part13",
  icon: "🗄️",
  title: "Part 13",
  name: "Database Scaling",
  topics: [
    /* 1 */ {
      id: "p13t1",
      title: "Read Replicas",
      subtitle:
        "Serving 10,000 reads/sec by cloning your database — without touching your primary.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>read replica</strong> is an exact copy of your primary database that receives a continuous stream of changes but only accepts <em>read</em> queries. The primary handles all writes; replicas handle all reads. One primary can fan out to 5, 15, or even 50 replicas. This means you scale read throughput linearly by adding replicas — without touching the primary.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "How Replication Works",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:0;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📝 Step 1 — Primary writes to WAL</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Every change (INSERT, UPDATE, DELETE) is first written to the <strong>Write-Ahead Log (WAL)</strong> on the primary. The WAL is an append-only file — the source of truth for replication.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📡 Step 2 — WAL ships to replicas</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Replicas connect to the primary and stream WAL records in real time. Each replica replays the same changes, keeping its data in sync. PostgreSQL streaming replication typically achieves <strong>10–100ms replication lag</strong> under normal load.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📖 Step 3 — Reads route to replicas</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Your application (or a connection pooler like PgBouncer, or AWS RDS Proxy) routes SELECT queries to replicas. INSERT/UPDATE/DELETE always go to the primary. Replicas are read-only — writes are rejected.</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Read Replica Architecture",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">ShopKart PostgreSQL Setup

PRIMARY (pgdb-primary.shopkart.internal)
  ├── All writes: orders, payments, user signups
  ├── Replicates to 3 replicas in real-time
  └── Multi-AZ standby (auto-failover in 30s)

REPLICA 1 (pgdb-r1) — Product Catalog Reads
  └── GET /products, GET /products/:id, browse queries

REPLICA 2 (pgdb-r2) — Search & Filters
  └── SELECT * FROM products WHERE category = 'shoes' ORDER BY ...

REPLICA 3 (pgdb-r3) — Analytics & Reports
  └── Complex aggregation queries (dashboards, reports)
      Run against replica — won't slow the primary!

Connection Router (RDS Proxy):
  SELECT  → round-robin across replicas
  INSERT  → always primary
  UPDATE  → always primary
  DELETE  → always primary</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Replication Lag — The Key Problem",
          body: `<p style="margin-bottom:12px;">Replication is <strong>asynchronous</strong> by default. The primary does not wait for replicas to confirm before responding to the client. This creates a window where replicas are slightly behind — the <strong>replication lag</strong>.</p>
<div style="border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:14px 16px;background:rgba(239,68,68,0.04);">
  <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:8px;">The Read-Your-Writes Problem</div>
  <p style="margin:0 0 10px;font-size:13px;line-height:1.65;color:var(--text-primary);opacity:0.9;">Rahul posts a product review. The write goes to the primary. His browser refreshes — the read goes to Replica 1. But the replica hasn't received the update yet (50ms lag). Rahul sees the page <em>without</em> his review. He thinks it failed and submits again. Duplicate review.</p>
  <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:6px;">✅ Solutions</div>
  <div style="display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <div><strong>1. Read-after-write consistency:</strong> After a write, route the <em>same user's next read</em> to the primary for 1–2 seconds. Simple, effective.</div>
    <div><strong>2. Sync replication (for critical paths):</strong> Primary waits for at least 1 replica to confirm. Slightly slower writes but no lag. Use for order confirmations, payments.</div>
    <div><strong>3. Session tracking:</strong> Store "last write timestamp" in session. If replica WAL position is behind, fall back to primary.</div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Read replicas solve the <strong>read-heavy skew</strong> problem — most production systems do 95% reads, 5% writes. ShopKart's product browse, search, and recommendations are pure reads. Offloading them frees the primary to handle writes reliably.</p>
<p style="margin-top:10px;">But replicas don't help with write scale. If ShopKart grows to 1M orders/day, the primary is still the bottleneck for writes. That's when you need <strong>database sharding</strong> (next topic). Read replicas are the first line of scaling defence — they get you from 1,000 to ~100,000 reads/sec. Beyond that, you need sharding or a different data model.</p>
<p style="margin-top:10px;">AWS RDS makes this trivial: one checkbox creates a read replica in a different AZ. AWS Aurora takes it further — Aurora Auto Scaling can add replicas automatically when read load spikes (like during a flash sale).</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Scale Your Database Reads</strong><br/><span style="color:var(--text-primary);opacity:0.9;">When asked "how do you scale your database?", do NOT immediately jump to sharding. Walk through the order: (1) Add indexes first. (2) Add read replicas for read-heavy load. (3) Add caching (Redis) in front of replicas. (4) Only then consider sharding if write throughput is the limit. Interviewers specifically look for this progression — jumping to sharding immediately signals inexperience.</span></div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">App Server
    │
    ├── WRITE → Primary DB
    │              │
    │              ├── async replication
    │              │
    ├── READ  → Replica 1
    ├── READ  → Replica 2
    └── READ  → Replica 3

Scale reads linearly. Primary only takes writes.</div>`,
        },
      ],
    },

    /* 2 */ {
      id: "p13t2",
      title: "Database Sharding",
      subtitle:
        "Splitting one massive table across many servers — the hardest database decision you'll make.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Sharding</strong> (horizontal partitioning) splits a large table into smaller pieces called <strong>shards</strong>, each stored on a separate database server. Each shard holds a <em>subset of rows</em>. The total data is divided, not duplicated (unlike replicas). Sharding scales both reads <em>and</em> writes because each shard handles only a fraction of the total traffic.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Sharding Strategies",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">1. Hash Sharding (Most Common)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><code>shard = hash(user_id) % num_shards</code>. Even distribution. Random-looking — user 1 might go to shard 3, user 2 to shard 7. <strong>Pros:</strong> balanced load, no hotspots. <strong>Cons:</strong> range queries are impossible (which users signed up this week?), resharding is painful.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">2. Range Sharding</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Shard 1: user_id 1–1M. Shard 2: user_id 1M–2M. Shard 3: user_id 2M–3M. <strong>Pros:</strong> great for range queries (all orders this month). <strong>Cons:</strong> hotspots — new users all go to the last shard (write concentration). Requires manual rebalancing.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">3. Directory Sharding</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">A lookup table maps entity → shard: user 42 → shard 7. Maximum flexibility. <strong>Cons:</strong> the lookup table itself needs to be highly available — it's a single point of failure if not carefully managed.</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Sharding Design",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">ShopKart orders table: 2 billion rows → 8 shards

Shard Key: user_id (hash)

shard_id = fnv32(user_id) % 8

Shard 0: users 0,8,16,24...     (DB: pgdb-shard-0)
Shard 1: users 1,9,17,25...     (DB: pgdb-shard-1)
...
Shard 7: users 7,15,23,31...    (DB: pgdb-shard-7)

Query routing (application layer):
  "Get orders for user 42"
  → shard = hash(42) % 8 = 2
  → query pgdb-shard-2 only

Cross-shard query (PAINFUL):
  "Get all orders placed today across all users"
  → must query ALL 8 shards + merge results
  → use a separate analytics DB (Redshift/BigQuery) instead!</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "The Hard Problems with Sharding",
          body: `<div style="display:flex;flex-direction:column;gap:8px;">
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>Cross-shard JOINs are gone.</strong> If users are on shard 2 and orders are on shard 5, you can't JOIN them in SQL. You join in application code — slow and complex.</div>
  </div>
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>Cross-shard transactions are nearly impossible.</strong> Charging a user (shard 2) and creating an order (shard 5) in one atomic transaction requires distributed transactions (2PC) — extremely complex. Most teams use the Saga pattern instead.</div>
  </div>
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>Resharding is brutal.</strong> Going from 8 shards to 16 means moving half the data. This is a multi-week migration project at scale. Consistent hashing mitigates this — covered next.</div>
  </div>
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>Hotspot shards.</strong> If 80% of traffic comes from 20% of users (power users), some shards get hammered while others are idle. Careful shard key selection prevents this.</div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Sharding is a <strong>last resort</strong>, not a first step. Most startups never need it. Before sharding, exhaust: (1) indexes, (2) read replicas, (3) caching, (4) vertical scaling (bigger machine), (5) archiving old data. Sharding introduces enormous operational complexity — debug it when you have 50 engineers, not 5.</p>
<p style="margin-top:10px;">When you do shard, choose your <strong>shard key</strong> as the single most important decision. The shard key should: (a) have high cardinality (many unique values), (b) be present in almost every query (so you rarely need cross-shard queries), (c) distribute writes evenly. For ShopKart: <code>user_id</code> is ideal for user-facing data. <code>order_id</code> is ideal for order data. <strong>Never shard on a low-cardinality column</strong> like status or country.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">One big table  →  Sharded across 4 servers

users (200M rows)          users_shard_0 (50M rows) on DB-0
                           users_shard_1 (50M rows) on DB-1
shard key: user_id    →    users_shard_2 (50M rows) on DB-2
hash(user_id) % 4          users_shard_3 (50M rows) on DB-3

Each DB handles 25% of reads AND writes.</div>`,
        },
      ],
    },

    /* 3 */ {
      id: "p13t3",
      title: "Consistent Hashing",
      subtitle:
        "The algorithm that makes adding or removing servers painless — used by Redis, Cassandra, and every CDN.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>With naive hashing (<code>hash(key) % N</code>), adding or removing a server changes <code>N</code>, which remaps <em>almost every key</em> to a different server — causing a massive cache miss storm or data migration. <strong>Consistent hashing</strong> solves this: when you add or remove a node, only <strong>1/N fraction</strong> of keys need to move. All others stay exactly where they are.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "The Ring Algorithm",
          body: `<div style="display:flex;flex-direction:column;gap:10px;">
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">1</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Create the ring:</strong> Imagine a circle with positions 0 to 2<sup>32</sup>. Both <em>servers</em> and <em>keys</em> are hashed onto this ring.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">2</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Place servers:</strong> hash("server-A") = 12. hash("server-B") = 40. hash("server-C") = 75. Each server occupies a point on the ring.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">3</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Assign keys:</strong> For each key, walk <em>clockwise</em> from its hash position until you find a server. That server owns the key. hash("product:123") = 30 → nearest clockwise server is B at 40.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">4</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Add a server:</strong> New server-D at position 55. Only keys between 40 and 55 move from B to D. All others stay. ~1/N keys move instead of nearly all.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">5</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Remove a server:</strong> Server-B goes down. Its keys are now assigned to the next clockwise server C. No other servers are affected.</div></div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Virtual Nodes — Solving Uneven Distribution",
          body: `<p style="margin-bottom:12px;">With 3 real servers on the ring, each owns exactly 1/3 of the ring — only if they're evenly spaced, which random hashing doesn't guarantee. The fix: <strong>virtual nodes (vnodes)</strong>.</p>
<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Without vnodes (3 servers):
  Server-A owns: 0–12 (12% of ring) ← TOO SMALL
  Server-B owns: 12–79 (67% of ring) ← TOO BIG
  Server-C owns: 79–100 (21% of ring)

With vnodes (each server gets 150 virtual positions):
  Server-A has 150 points spread around ring → owns ~33%
  Server-B has 150 points spread around ring → owns ~33%
  Server-C has 150 points spread around ring → owns ~33%

Used by: Cassandra (256 vnodes per node by default)
         Redis Cluster (16,384 hash slots)
         Amazon DynamoDB (internal consistent hashing)
         CDN cache routing (Akamai, CloudFront)</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Consistent hashing matters most in two scenarios:</p>
<ul style="font-size:13px;line-height:1.9;padding-left:20px;color:var(--text-primary);opacity:0.9;">
  <li><strong>Cache clusters:</strong> When you add a Redis node due to memory pressure, you only invalidate ~1/N of keys instead of 100%. The rest remain warm — no thundering herd on your database.</li>
  <li><strong>Distributed databases (Cassandra, DynamoDB):</strong> Auto-scales nodes in and out without manual data migration. A node failure triggers only a small, targeted data re-replication.</li>
</ul>
<p style="margin-top:10px;">You'll almost never implement consistent hashing yourself — Redis Cluster and Cassandra handle it internally. But understanding the algorithm is essential for answering <em>"how do you handle node failures in your cache cluster?"</em> or <em>"how does Cassandra distribute data?"</em></p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 The Cache Cluster Scaling Question</strong><br/><span style="color:var(--text-primary);opacity:0.9;">When asked "how do you scale your cache?", say: "We use Redis Cluster with consistent hashing across 6 nodes (3 primary + 3 replicas). Consistent hashing means adding a node only remaps ~1/6 of keys — no mass cache invalidation. Redis Cluster handles this automatically with its 16,384 hash slot algorithm." This demonstrates you understand the <em>why</em>, not just the tool.</span></div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">         0
        /   \
  C(75)      A(12)
      \      /
       \    /
        B(40)

key "product:123" → hash = 30
Walk clockwise from 30 → hit B at 40
→ Stored on Server B

Add Server D at 55:
→ Only keys 40-55 move B → D
→ Everything else unchanged ✅</div>`,
        },
      ],
    },

    /* 4 */ {
      id: "p13t4",
      title: "CAP Theorem",
      subtitle:
        "The fundamental law of distributed systems — you can only guarantee two of three properties.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>In any distributed system (multiple servers), you can only <strong>guarantee two</strong> of these three properties simultaneously:</p>
<ul style="font-size:13px;line-height:1.9;padding-left:20px;margin-top:8px;color:var(--text-primary);opacity:0.9;">
  <li><strong>Consistency (C):</strong> Every read returns the most recent write, or returns an error. All nodes see the same data at the same time.</li>
  <li><strong>Availability (A):</strong> Every request gets a response (not necessarily the most recent data). The system never returns an error.</li>
  <li><strong>Partition Tolerance (P):</strong> The system keeps working even if network messages between servers are dropped or delayed.</li>
</ul>
<p style="margin-top:10px;font-size:13px;color:var(--text-primary);opacity:0.9;"><strong>The catch:</strong> Network partitions <em>always happen</em> in real distributed systems. You cannot build a distributed system that gives up on P. So the real choice is: <strong>when a partition occurs, do you sacrifice C or A?</strong></p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "CP vs AP — The Real Choice",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">CP — Consistency + Partition Tolerance</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">When a partition occurs, the system stops accepting writes (returns errors) rather than risk returning stale data. <strong>Correct but may be unavailable.</strong></p>
    <div style="font-size:12px;color:var(--accent);font-weight:600;">Examples: PostgreSQL, MongoDB (default), HBase, Redis (cluster mode)</div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">AP — Availability + Partition Tolerance</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">When a partition occurs, the system keeps accepting reads/writes on both sides of the partition. Data may diverge (conflict resolution needed later). <strong>Always available but may return stale data.</strong></p>
    <div style="font-size:12px;color:#10b981;font-weight:600;">Examples: Cassandra, DynamoDB, CouchDB, DNS</div>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart CAP Decisions",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">ShopKart chooses based on business impact:

CP (Consistency) — Risk: wrong data = money lost
  Payments table       → PostgreSQL (CP)
    "Never charge twice. Error &gt; wrong charge."
  Inventory (stock)    → PostgreSQL (CP)
    "Never oversell. Error &gt; selling phantom stock."
  User wallet/credits  → PostgreSQL (CP)
    "Balance must be exact. No eventual consistency."

AP (Availability) — Risk: stale data = minor annoyance
  Product catalog      → Cassandra / DynamoDB (AP)
    "Product price 1min stale is fine vs 99.99% uptime."
  User activity feed   → Cassandra (AP)
    "Show slightly old feed vs show error page."
  Search results       → Elasticsearch (AP)
    "New products appear in 5 mins, not instantly."
  Shopping cart        → DynamoDB (AP)
    "Cart might be 1s stale. Recompute at checkout."</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "PACELC — The More Complete Model",
          body: `<p style="margin-bottom:12px;">CAP only covers what happens during a partition. <strong>PACELC</strong> extends it: even when the system is running normally (no partition), there's a trade-off between <strong>Latency (L)</strong> and <strong>Consistency (C)</strong>.</p>
<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">If Partition → choose C or A (classic CAP)
Else         → choose L or C (the new insight)

DynamoDB:    PA/EL → AP during partition, low latency else
Cassandra:   PA/EL → AP during partition, low latency else
PostgreSQL:  PC/EC → CP during partition, strong consistency else

Practical meaning for ShopKart:
  DynamoDB product reads: 1ms response, possibly 50ms stale
  PostgreSQL order writes: 5ms response, always consistent</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Treat CAP as a <strong>decision framework</strong>, not a rigid law. Modern systems like Google Spanner and CockroachDB claim to be "CA" by using atomic clocks and ultra-reliable networking to make partitions so rare and fast-resolved that the tradeoff barely matters in practice — but they still make it.</p>
<p style="margin-top:10px;">The practical rule: <strong>money → CP. User experience → AP.</strong> Any system that moves money (payments, inventory, account balances) must be consistent. Any system serving content (feeds, catalogs, analytics) can tolerate eventual consistency in exchange for higher availability and lower latency.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 How to Use CAP in Interviews</strong><br/><span style="color:var(--text-primary);opacity:0.9;">Never just say "we need consistency" without justifying it. Say: "For the payment service, we choose CP — using PostgreSQL. We accept that during a network partition, payment writes will fail with a 503 rather than risk a double charge. The user retries. For the product catalog, we choose AP — using Cassandra. A replica returning 30-second-old data is perfectly acceptable versus showing users an error page during a partition."</span></div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">        C (Consistency)
        /\
       /  \
      / CP \   ← PostgreSQL, MongoDB
     /      \
    /________\
   A    P     (Partition-tolerance always required)
  (AP) ← Cassandra, DynamoDB, DNS

When partition happens:
  CP → refuse writes, preserve consistency
  AP → accept writes, allow temporary divergence</div>`,
        },
      ],
    },

    /* 5 */ {
      id: "p13t5",
      title: "NoSQL vs SQL — The Decision",
      subtitle:
        "Choosing the right database is the most consequential architecture decision you'll make.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>SQL databases</strong> (PostgreSQL, MySQL) store data in tables with a fixed schema and support JOINs, transactions, and complex queries. <strong>NoSQL databases</strong> sacrifice some of these guarantees in exchange for horizontal scale, flexible schema, or specialised access patterns. Neither is "better" — they solve different problems. The architect's job is to pick based on <em>access patterns</em>, not hype.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "The 4 NoSQL Families",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">📄 Document Store — MongoDB, Firestore</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Stores JSON-like documents. Flexible schema — each document can have different fields. <strong>Use when:</strong> your data structure varies per record (product catalog with different attributes per category: shoes have size, TVs have resolution). Fast for reads by document ID.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🔑 Key-Value — Redis, DynamoDB</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Simplest model: key → value. Extremely fast (sub-millisecond). <strong>Use when:</strong> you always look up by a single key — sessions, caches, feature flags, rate limit counters. Cannot query by value or do range queries efficiently unless key is designed for it.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">📊 Column-Family — Cassandra, HBase</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Data organised by row key + column families. Writes go to memory (memtable) then sequential disk (SSTable) — no random I/O. Handles <strong>1M+ writes/sec</strong>. <strong>Use when:</strong> write-heavy time-series (metrics, events, IoT), append-only workloads. Poor for ad-hoc queries.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🕸️ Graph — Neo4j, Amazon Neptune</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Stores nodes and edges with properties. Traversal is O(1) per hop (vs exponential for SQL recursive CTEs). <strong>Use when:</strong> relationships are the data — social networks (friends-of-friends), recommendation engines (people who bought X also bought Y), fraud detection (connected accounts).</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Database Polyglot Architecture",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">ShopKart uses the right DB for each problem:

PostgreSQL (SQL)
  orders, payments, users, inventory
  → Needs JOINs, transactions, strict consistency

MongoDB (Document)
  product_catalog
  → Shoe: {size, color, material}
  → TV: {resolution, HDR, ports}
  Different attributes per product = flexible schema

Redis (Key-Value)
  sessions, caches, rate limits, flash sale locks
  → Always accessed by a single key, sub-ms latency

Cassandra (Column-Family)
  clickstream events, page view logs, audit trails
  → 5M events/sec during sale, append-only, time-sorted

Elasticsearch (Document + Inverted Index)
  product search: full-text, faceted filters
  → "red nike running shoes under ₹5000"

Neo4j (Graph)
  "Customers who bought this also bought..."
  → Traverse purchase graph ← too slow in PostgreSQL</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "The Decision Framework",
          body: `<table style="width:100%;border-collapse:collapse;font-size:13px;">
  <thead>
    <tr style="background:rgba(99,102,241,0.08);">
      <th style="padding:8px 12px;text-align:left;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border);">Question</th>
      <th style="padding:8px 12px;text-align:left;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border);">→ Use</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">Need ACID transactions across multiple entities?</td>
      <td style="padding:8px 12px;color:#10b981;font-weight:600;">PostgreSQL / MySQL</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">Variable schema, JSON-like, flexible documents?</td>
      <td style="padding:8px 12px;color:#10b981;font-weight:600;">MongoDB</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">Always lookup by single key, need sub-ms speed?</td>
      <td style="padding:8px 12px;color:#10b981;font-weight:600;">Redis / DynamoDB</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">Massive write throughput (1M+/sec), time-series?</td>
      <td style="padding:8px 12px;color:#10b981;font-weight:600;">Cassandra / InfluxDB</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">Full-text search, faceted filters, relevance ranking?</td>
      <td style="padding:8px 12px;color:#10b981;font-weight:600;">Elasticsearch / Opensearch</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;color:var(--text-primary);">Relationship traversal, recommendations, fraud?</td>
      <td style="padding:8px 12px;color:#10b981;font-weight:600;">Neo4j / Neptune</td>
    </tr>
  </tbody>
</table>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Start with PostgreSQL for everything. It's incredibly versatile — it supports JSON columns (like MongoDB), full-text search (like Elasticsearch, for modest scale), and time-series data (with TimescaleDB extension). <strong>Only migrate to a NoSQL database when PostgreSQL genuinely can't handle the access pattern or scale.</strong></p>
<p style="margin-top:10px;">The biggest mistake is choosing NoSQL because it sounds modern. NoSQL databases give up SQL's superpower — the ability to query data in any way without pre-planning every access pattern. With Cassandra, your data model is dictated entirely by your queries — change a feature (requiring a new access pattern) and you might need to redesign the entire table. This rigidity is the hidden cost of massive write scale.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 The Database Choice Question</strong><br/><span style="color:var(--text-primary);opacity:0.9;">When asked "what database would you use?", answer with access patterns: "For user orders, I'd use PostgreSQL because we need ACID transactions across orders, payments, and inventory in one operation. For the product catalog, MongoDB because each product category has different attributes — shoes have size and color, electronics have spec sheets. For user sessions, Redis because every request needs sub-millisecond session lookup by a single key." Access pattern first, then database choice.</span></div>`,
        },
      ],
    },

    /* 6 */ {
      id: "p13t6",
      title: "Cassandra & Write-Optimized Databases",
      subtitle:
        "How Cassandra handles 1 million writes per second — and why it's completely different from PostgreSQL under the hood.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>Cassandra processes writes at extreme speed by <strong>never doing random disk writes</strong>. Instead, every write goes to an in-memory structure (Memtable) and a sequential append-only log (Commit Log). Periodically, the Memtable is flushed to disk as an immutable sorted file (SSTable). This is called a <strong>Log-Structured Merge Tree (LSM Tree)</strong> — and it's the secret behind write-optimized databases.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "LSM Tree Write Path",
          body: `<div style="display:flex;flex-direction:column;gap:10px;">
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">1</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Write to Commit Log (append-only):</strong> Every write first hits a sequential disk log. Sequential disk writes are ~100x faster than random writes (even on SSDs). This is the durability guarantee.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">2</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Write to Memtable (in-memory sorted tree):</strong> Write is also put into a sorted in-memory structure. Now the write is complete and acknowledged to the client. No disk seek, no random I/O.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">3</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Flush to SSTable:</strong> When Memtable fills up, it's flushed to disk as an SSTable (Sorted String Table) — an immutable file sorted by key. SSTables are never modified — writes create new SSTables.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">4</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Compaction:</strong> Background process merges multiple SSTables into one, removing deleted/overwritten data. Keeps reads fast by reducing the number of files to scan.</div></div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Clickstream — Why Cassandra?",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">ShopKart BigSale event: 10M users, 100 page views each
= 1,000,000,000 (1B) events in 24 hours
= ~11,500 writes per second average
= ~200,000 writes/sec at peak

Cassandra Table Design (query-first approach):

-- Query: "Get all events for user 42 this week"
CREATE TABLE user_events (
  user_id    UUID,
  ts         TIMESTAMP,
  event_type TEXT,    -- 'VIEW', 'CLICK', 'ADD_CART'
  item_id    UUID,
  meta       TEXT,
  PRIMARY KEY (user_id, ts)  -- partition by user, cluster by time
) WITH CLUSTERING ORDER BY (ts DESC);

Why this works:
  All of user 42's events are on ONE partition (same node)
  Reads are O(1) node lookup + sequential scan within partition
  Writes are always appends → no random I/O
  
Why PostgreSQL fails here:
  11,500 INSERT/sec → WAL + random B-tree index updates
  → Primary becomes a bottleneck at ~5,000 writes/sec</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Cassandra's Trade-offs",
          body: `<div style="display:flex;flex-direction:column;gap:8px;">
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>No JOINs.</strong> Data must be denormalised. You store it the way you'll query it. Change your query pattern = redesign your table.</div>
  </div>
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>No multi-row transactions.</strong> Cassandra has lightweight transactions (Compare-And-Swap) but no full ACID multi-table transactions.</div>
  </div>
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>Reads are slower than writes.</strong> A read must check the Memtable + multiple SSTables + Bloom filters. PostgreSQL B-tree gives one random read. Use Cassandra when you write 10x more than you read.</div>
  </div>
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>Eventual consistency by default.</strong> With replication factor=3 and QUORUM reads, you're consistent. But this adds latency. Tunable consistency is Cassandra's strength — you choose the trade-off per query.</div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>The LSM Tree pattern is used in far more than Cassandra: <strong>RocksDB</strong> (used by Facebook, LinkedIn, and as the storage engine for CockroachDB), <strong>LevelDB</strong> (Chrome's IndexedDB), <strong>Apache Kafka's log segments</strong>, and even <strong>Apache Lucene</strong> (the engine behind Elasticsearch). Understanding LSM = understanding the write path of modern data infrastructure.</p>
<p style="margin-top:10px;">The guiding principle: <strong>if you're doing more writes than reads at massive scale, the B-tree (PostgreSQL) is the wrong tool</strong>. B-trees need to maintain sorted order on every write — which means random I/O to update internal nodes. LSM trees defer all sorting to compaction time, making writes blazing fast.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Designing a Write-Heavy System</strong><br/><span style="color:var(--text-primary);opacity:0.9;">When asked to design a system that ingests millions of events (clickstream, IoT sensors, audit logs), say: "I'd use Cassandra or DynamoDB for ingestion with an LSM-tree based write path — no random disk I/O means writes are orders of magnitude faster than B-tree databases. The partition key would be the entity ID (user, device) to co-locate time-series data on one node, with timestamp as clustering key for efficient range scans. For analytics, I'd use a separate pipeline to Redshift or BigQuery."</span></div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Write → CommitLog (append) → Memtable (in-memory)
                                      │
                              [Memtable full]
                                      │
                                      ▼
                                  SSTable 1  ──┐
                                  SSTable 2  ──┤ Compaction
                                  SSTable 3  ──┘ (background)
                                               ▼
                                       Merged SSTable

B-Tree (PostgreSQL): Write = random I/O to update tree
LSM Tree (Cassandra): Write = sequential append only ✅</div>`,
        },
      ],
    },
  ],
};

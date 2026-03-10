/* Part 7 — Caching (10 topics) — Deep Rewrite */
const PART7 = {
  id: "part7",
  icon: "⚡",
  title: "Part 7",
  name: "Caching",
  topics: [
    {
      id: "p7t1",
      title: "Why Caching",
      subtitle:
        "The single most impactful performance optimisation in distributed systems.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Caching</strong> stores the result of an expensive operation — a slow DB query, a CPU-heavy computation, a remote API call — in fast-access storage (RAM) so subsequent requests can be served instantly without redoing the work. Caches exploit temporal locality: if Rahul just fetched the iPhone 15 Pro listing, thousands of others will fetch it in the next few seconds.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "The Numbers & ShopKart Strategy",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚡ Access Time Comparison</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">RAM:            ~100 nanoseconds<br/>Redis (memory): ~0.5 ms  (500,000 ns)<br/>PostgreSQL:     ~5–50 ms  (disk I/O + query)<br/>Network call:   ~50–500 ms<br/><br/>ShopKart product page fetches 12 products:<br/>Without cache: 12 × 20ms = 240ms just for data<br/>With cache:    12 × 0.5ms = 6ms  → 40× faster<br/><br/>At 10,000 req/sec, 95% hit rate:<br/>→ only 6,000 DB queries/sec vs 120,000 — manageable</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🏪 What ShopKart Caches</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Product details</strong> TTL=1hr — changes rarely; 98% hit rate</div>
      <div><strong>Category listings</strong> TTL=10min — admin updates occasional</div>
      <div><strong>Inventory count</strong> TTL=30s — high write frequency; slight stale OK</div>
      <div><strong>Search autocomplete</strong> TTL=5min — same prefixes repeatedly</div>
      <div><strong>User sessions</strong> TTL=24hr — checked on every authenticated request</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚠️ Three Cache Failure Modes</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>🔥 <strong>Stampede</strong>: Popular key expires → 10K requests simultaneously miss → DB overloads. Fix: mutex lock or probabilistic early recompute.</div>
      <div>☁️ <strong>Penetration</strong>: Non-existent keys queried (bot) → cache always misses. Fix: cache null with short TTL.</div>
      <div>🌊 <strong>Avalanche</strong>: Mass key expiry at same time. Fix: TTL jitter — <code>3600 + random(600)</code>.</div>
    </div>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"Cache effectiveness is measured by hit rate. Our Redis cache for product data has a 97% hit rate — only 3% of product requests hit the database. A 10% drop in hit rate can mean 3× more database load. We monitor hit rate with Redis INFO stats and alert when it drops below 90%."
</span>
</div>`,
        },
      ],
    },

    {
      id: "p7t2",
      title: "Cache Aside Pattern",
      subtitle:
        "The most common caching pattern — application code manages the cache explicitly.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Cache Aside</strong> (Lazy Loading) means the application code checks the cache first; on a miss, it queries the database and populates the cache for future requests. The database is the source of truth. The cache is a performance layer managed explicitly: Check cache → miss? → query DB → store in cache → return.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Flow & Code",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Cache HIT (~0.5ms)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.7;">Rahul requests product:12345 → <strong>Redis HIT</strong> → return JSON in 1ms. No DB touched.</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚡ Cache MISS (~25ms, first request or after expiry)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.7;">Redis returns nil → query PostgreSQL → SET product:12345 JSON EX 3600 → return. Next 10,000 requests → all 1ms cache hits.</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🏪 productService.js</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">async getProduct(id) {<br/>&nbsp;&nbsp;const cached = await redis.get(\`product:\${id}\`);<br/>&nbsp;&nbsp;if (cached) return JSON.parse(cached); // cache hit<br/>&nbsp;&nbsp;const product = await productRepo.findById(id);<br/>&nbsp;&nbsp;if (!product) { await redis.set(\`product:\${id}\`, 'null', 'EX', 60); return null; }<br/>&nbsp;&nbsp;await redis.set(\`product:\${id}\`, JSON.stringify(product), 'EX', 3600);<br/>&nbsp;&nbsp;return product;<br/>}</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🗑️ Invalidation on Update</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Admin updates Nike Air price ₹4999 → ₹3999: update DB then <code>redis.del('product:12345')</code>. Why delete instead of update? If the DB write succeeds but cache update fails, you'd have inconsistent data. Deleting forces a clean re-read — safer pattern.</p>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"We use cache-aside for product data. Write: update database, then DELETE (not update) the cache key. Deleting forces a clean re-read, avoiding stale cache scenarios where DB and cache diverge. The slight extra latency on first-read-after-write is a worthwhile trade for consistency."
</span>
</div>`,
        },
      ],
    },

    {
      id: "p7t3",
      title: "Write Through",
      subtitle:
        "Writing to both cache and database simultaneously — cache always stays fresh.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">In <strong>Write Through</strong> caching, every write goes to cache and database simultaneously. The write is confirmed only when both succeed. Cache is always consistent — reads are guaranteed fresh without a DB fallback.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Flow & ShopKart Cart Example",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✍️ Write Flow (Add to Cart)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>1. App receives write request</div>
      <div>2. Simultaneously: Redis HSET cart:user:42 product:12345 2 <strong>AND</strong> PostgreSQL INSERT cart_items</div>
      <div>3. Return success only when both confirm (~50ms vs 30ms for cache-aside)</div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📖 Read Flow (always fast)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Redis HGETALL cart:user:42 → always fresh (writes went here too). No DB read needed. Sub-millisecond cart loads every time.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚖️ Write-Through vs Cache-Aside</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 6px;border-radius:4px;font-size:11px;">✅ Write-Through</span> Cache always consistent. No cold start on first read. Ideal when reads >> writes.</div>
      <div style="margin-top:6px;"><span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:2px 6px;border-radius:4px;font-size:11px;">⚠️ Downside</span> Write amplification: data cached that may never be read. Every write takes ~50ms instead of 30ms.</div>
      <div style="margin-top:6px;">ShopKart: cart views happen 20× more than cart writes → write-through wins. Rahul views cart 20 times, adds 1 item.</div>
    </div>
  </div>
</div>`,
        },
      ],
    },

    {
      id: "p7t4",
      title: "Write Back (Write Behind)",
      subtitle:
        "Writing to cache first, database later — maximum write performance at the cost of durability.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Write Back</strong> (Write Behind) means writes go to cache immediately — the database is updated asynchronously in the background. The application gets instant write confirmation. Risk: if cache crashes before flushing, those writes are lost.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "ShopKart Page View Counter",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">❌ Write-Through (Too Expensive)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">100K page views/sec → 100K PostgreSQL writes/sec → database overloaded just for page view analytics.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Write-Back with Redis INCR</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">// Each page view: in-memory increment (~0.3ms)<br/>INCR pageviews:product:12345<br/><br/>// Background job every 30 seconds:<br/>const count = await redis.getdel('pageviews:product:12345');<br/>await db.query(\`UPDATE product_stats SET view_count = view_count + \${count}...\`);<br/><br/>// Result: 100K writes/sec → 1 batch write per 30s</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🚨 When NOT to Use Write-Back</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Never for payments, orders, inventory, or financial data. If Redis crashes mid-30-seconds, Rahul’s charge goes through but ShopKart loses the record. Write-back is exclusively for analytics, view counts, like counters — data where small losses are tolerable and acceptable.</p>
  </div>
</div>`,
        },
      ],
    },

    {
      id: "p7t5",
      title: "Cache Invalidation",
      subtitle:
        "The hardest problem in caching — keeping cached data fresh when the source of truth changes.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Cache invalidation</strong> is removing or updating cached data when the source of truth changes. Phil Karlton's famous quote: <em>“There are only two hard things in Computer Science: cache invalidation and naming things.”</em> It’s hard because distributed caches hold multiple copies of data, updates come from multiple code paths, and there’s no built-in notification mechanism.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Strategies & ShopKart Category Cache",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⏱️ 1. TTL-Based Expiry (simplest)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Cache key expires after N seconds automatically. Stale window: up to N seconds. Use when brief staleness is acceptable (product details TTL=1hr).</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📡 2. Event-Driven Invalidation (best consistency)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Admin updates price → app publishes event to message queue → cache subscriber receives → DEL product:12345. Stale window: ~50ms (event propagation).</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🏷️ 3. Version Tags (category cache elegance)</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">// Cache key includes version: category:electronics:v42:page:1<br/>// Admin adds product → INCR electronics_version → 43<br/>// All requests now look for category:electronics:v43:page:*<br/>// v42 keys are “orphaned” — TTL clears them naturally<br/><br/>// One Redis INCR invalidates ALL 200 category caches instantly!</div>
    <div style="margin-top:8px;font-size:12px;color:#22c55e;">Cost: 1 Redis INCR vs 200 explicit DEL calls. Elegant.</div>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"Cache invalidation is genuinely hard. For simple objects (product by ID), delete specific key on update. For derived data (category listings, search rankings), use version tags — a single INCR to the category version makes all related caches stale without enumerating them. For session data, TTL expiry is sufficient."
</span>
</div>`,
        },
      ],
    },

    {
      id: "p7t6",
      title: "TTL — Time To Live",
      subtitle:
        "The key cache configuration — how long data stays cached before requiring a fresh fetch.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>TTL</strong> (Time To Live) is the duration after which a cache entry is automatically expired and deleted. Redis: <code>SET key value EX 3600</code> = expires in 3600 seconds. When TTL expires, the next request triggers a fresh DB read. TTL is the primary mechanism for preventing stale data without explicit invalidation.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart TTL Decisions & Jitter",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">⏱️ TTL by Data Type</div>
    <div style="font-size:12px;font-family:monospace;line-height:2;color:var(--text-primary);">
      <div>Product details &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 hr &nbsp;&nbsp;Admin edits rarely</div>
      <div>Product price &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 min &nbsp;Flash sales, dynamic pricing</div>
      <div>Inventory count &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30 sec Purchases change it constantly</div>
      <div>Category listings &nbsp;&nbsp;&nbsp;&nbsp;10 min Catalog updates few times/day</div>
      <div>Search results &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 min &nbsp;New products &amp; ranking shifts</div>
      <div>User cart &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 days User expects persistence</div>
      <div>User session &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24 hr &nbsp;Standard login duration</div>
      <div>Recommendations &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 min ML model updates every 2hr</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌊 TTL Jitter — Preventing Cache Avalanche</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Diwali sale: 100K product pages cached at 8pm, all TTL=3600s. At 9pm exact → 100K keys expire simultaneously → 50K req/sec all miss → DB avalanche.</p>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">// Without jitter: all expire at same tick<br/>redis.set(key, value, 'EX', 3600);<br/><br/>// With jitter: spread over 10 minute window<br/>const ttl = 3600 + Math.floor(Math.random() * 600);<br/>redis.set(key, value, 'EX', ttl); // 3600-4200s</div>
  </div>
</div>`,
        },
      ],
    },

    {
      id: "p7t7",
      title: "Redis",
      subtitle:
        "The industry-standard in-memory data structure store — the backbone of most caching layers.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Redis</strong> (Remote Dictionary Server) is an open-source, in-memory data structure store. It’s not just a cache — it supports strings, hashes, lists, sets, sorted sets, streams, and more. Single-threaded command execution (no lock contention). Sub-millisecond latency. Default choice for caching, sessions, rate limiting, leaderboards, and pub/sub.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Redis Data Structures in ShopKart",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Data Structures Used</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:2;color:var(--text-primary);">STRING  — Product cache: SET product:12345 "{name:'Nike Air'...}" EX 3600<br/>HASH &nbsp;&nbsp;&nbsp;— Cart: HSET cart:user:42 product:12345 2 | HGETALL cart:user:42<br/>SORTED SET — Trending: ZADD trending:products 9500 product:12345 | ZREVRANGE<br/>SET &nbsp;&nbsp;&nbsp;&nbsp;— Unique visitors: SADD unique_visitors:20240101 user:42 | SCARD<br/>COUNTER — Rate limit: INCR rate_limit:user:42:min:1234 | EXPIRE 60</div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌐 Redis Cluster for Scale</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">3 master nodes + 3 replicas. 16,384 hash slots split across masters. <code>product:12345</code> → hash → slot 4782 → Master 1. Total capacity: 3 × 128GB = 384GB. If a master fails, replica promotes in &lt;1 second automatically.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Sub-ms latency</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Auto-failover</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Rich data structures</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ RAM is expensive</span>
    </div>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"Redis vs Memcached: Redis wins because it supports complex data structures (sorted sets for leaderboards, lists for queues), persistence (RDB + AOF), cluster mode, and Lua scripting for atomic operations. One tool handles caching, sessions, rate limiting, and pub/sub vs managing two systems."
</span>
</div>`,
        },
      ],
    },

    {
      id: "p7t8",
      title: "Key-Value Storage",
      subtitle:
        "The simplest and most scalable data model — get and set by key.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">A <strong>key-value store</strong> is a database where every record is a unique key → value pair. Lookups are O(1) by key. No schema, no JOIN, no SQL — just <code>SET key value</code> and <code>GET key</code>. This simplicity enables extreme performance and horizontal scalability. Redis, DynamoDB, and Memcached are key-value stores.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Key Design & Use Case Fit",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔑 Naming Convention: {entity}:{id}:{field}</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">product:12345 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;full product JSON<br/>product:12345:price &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;just the price<br/>session:abc123xyz &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;user session<br/>rate_limit:ip:1.2.3.4 &nbsp;&nbsp;&nbsp;&nbsp;rate limit counter<br/>category:electronics:v7 &nbsp;&nbsp;&nbsp;versioned category cache<br/><br/>// Namespace prefix per service to avoid collisions:<br/>shopkart:user:42 &nbsp; // not just "user:42"</div>
  </div>
  <div style="padding:14px 16px;background:rgba(99,102,241,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">✅ Good Fit vs ❌ Poor Fit</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>✅ Session storage — always fetched by session token (exact key)</div>
      <div>✅ Leaderboards — Redis Sorted Set, score-based retrieval</div>
      <div>✅ Feature flags — <code>feature:dark_mode:user:42</code> → O(1) lookup</div>
      <div>❌ Query by non-key attribute — “All Nike products under ₹500” impossible</div>
      <div>❌ Relational data — no JOINs; use SQL + KV cache on top</div>
    </div>
  </div>
</div>`,
        },
      ],
    },

    {
      id: "p7t9",
      title: "API Response Cache",
      subtitle:
        "Caching entire API responses to skip business logic and database queries entirely.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>API Response Caching</strong> stores the complete HTTP response for an endpoint. When the same request arrives again, the cached response is returned instantly — bypassing application code, DB queries, and business logic entirely. The most dramatic cache performance gain possible.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Cache Tiers & HTTP Headers",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌐 Tiered API Caching (nearest → fastest)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Browser Cache</strong>: <code>Cache-Control: public, max-age=300</code> — 0ms network for Rahul’s refresh</div>
      <div><strong>CDN (CloudFront)</strong>: ~5ms from nearest edge. 100K req/sec, 95% CDN hit = only 5K reach servers</div>
      <div><strong>API Gateway (Kong)</strong>: Returns immediately before application code runs</div>
      <div><strong>App-level Redis</strong>: Full response string cached; controller not even called</div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📬 HTTP Cache Headers ShopKart Uses</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">// Public cacheable (product pages, categories):<br/>Cache-Control: public, max-age=300, stale-while-revalidate=60<br/><br/>// Private user-specific (cart, orders):<br/>Cache-Control: private, no-store<br/><br/>// Highly dynamic (inventory, flash price):<br/>Cache-Control: no-cache, must-revalidate<br/><br/>// ETag for bandwidth saving:<br/>ETag: "4f2abc" → If-None-Match: "4f2abc" → 304 Not Modified</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🎯 Interview Insight</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">"For product listings at 100K req/sec, a 95% CDN hit rate means only 5K req/sec hit our servers — matching capacity. Without CDN caching, we’d need 20× more infrastructure. Key design decision: explicitly classify every endpoint as public (CDN-cacheable) or private (user-specific) during API design."</p>
  </div>
</div>`,
        },
      ],
    },

    {
      id: "p7t10",
      title: "Session Cache",
      subtitle:
        "Storing authenticated user sessions in Redis for fast, scalable session verification.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Session caching</strong> stores user auth sessions in Redis (not DB or server memory) so every API request verifies the session in sub-millisecond time. Instead of hitting PostgreSQL on every request, the server reads from Redis. Critical for stateless horizontal scaling— any server can serve any request.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Redis Session vs Bad Alternatives",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">❌ Server Memory (stateful) — Not Scalable</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Rahul’s session lives only in Server A’s RAM. Server B doesn’t know about it. Restart = all users logged out. Can’t scale horizontally.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">❌ PostgreSQL per Request — Too Slow</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">10K req/sec = 10K DB queries/sec just for auth checks. Database overloaded from session lookups alone before any business logic runs.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Redis Session (0.3ms lookups)</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">// Login: store session<br/>SET sess_a4f2b1c3 {userId:42, roles:["CUSTOMER"]} EX 86400<br/>Set-Cookie: SID=sess_a4f2b1c3; HttpOnly; Secure<br/><br/>// Every request: lookup in 0.3ms<br/>const user = await redis.get(\`sess_\${req.cookies.SID}\`);<br/>req.user = JSON.parse(user);<br/><br/>// Logout: immediate revocation<br/>await redis.del(\`sess_\${req.cookies.SID}\`);</div>
    <p style="margin-top:8px;font-size:12px;color:#22c55e;">Key advantage over JWT: instant revocation. JWT tokens can’t be invalidated before expiry without a Redis blacklist anyway.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚖️ JWT vs Redis Sessions at a Glance</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Revocation</strong>: JWT = wait for expiry. Redis = instant DEL.</div>
      <div><strong>Scale</strong>: JWT = stateless (no server storage). Redis = cluster needed.</div>
      <div><strong>Data</strong>: JWT = limited (token sent over wire). Redis = any amount.</div>
      <div><strong>ShopKart choice</strong>: Redis for web/mobile; JWT for public API clients.</div>
    </div>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"We use Redis for sessions rather than JWT for web because: instant session revocation is critical for security (stolen token, logout). Redis lookup at 0.3ms is effectively free. We run Redis Cluster (3 masters + 3 replicas), sharding sessions by user ID prefix for even distribution."
</span>
</div>`,
        },
      ],
    },
  ],
};

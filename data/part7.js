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
          body: `<p><strong>Caching</strong> stores the result of an expensive operation — a slow database query, a CPU-intensive computation, a remote API call — in fast-access storage (usually memory) so subsequent requests for the same result can be served instantly without redoing the work. Caches exploit temporal locality: if Rahul just fetched the iPhone 15 Pro listing, thousands of other users will fetch it in the next few seconds.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why This Exists — The Numbers",
          body: `<div class="diagram-box">Storage access times (orders of magnitude):
  L1 CPU cache:   ~1 nanosecond
  L2 CPU cache:   ~4 nanoseconds
  RAM:            ~100 nanoseconds
  Redis (memory): ~0.5 milliseconds  (500,000 nanoseconds)
  SSD:            ~1 millisecond
  PostgreSQL:     ~5-50ms  (query parsing + execution + disk I/O)
  Network call:   ~50-500ms
  
ShopKart product page: fetches 12 products.
  Without cache: 12 DB queries × 20ms avg = 240ms just for data
  With cache: 12 Redis lookups × 0.5ms = 6ms for data
  
  Cache reduces data fetching latency by 40x.
  
  At 10,000 requests/second:
  Without cache: 10,000 × 12 = 120,000 DB queries/second → database melts
  With cache hit rate 95%: only 6,000 DB queries/second → manageable</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Caching Strategy",
          body: `<div class="diagram-box">What ShopKart caches (and why):

  Product details (cache forever-ish, TTL=1hr):
    Key: product:12345
    Value: JSON blob with full product data
    Why: Products change rarely (maybe 1 update/day). 
    1 database write hits 1M+ reads. Cache hit rate: ~98%

  Category listings (TTL=10min):
    Key: category:electronics:page:3
    Value: paginated product list JSON
    Why: Admin updates occasional, but millions of users browse same pages

  Inventory count (TTL=10sec):
    Key: inventory:12345
    Value: 842
    Why: High write frequency (each purchase decrements stock). 
    10-second stale is tolerable. Shows "In Stock" slightly delayed.

  Search autocomplete (TTL=5min):
    Key: autocomplete:samsung
    Value: ["Samsung Galaxy", "Samsung TV", "Samsung Fridge"]
    Why: Same prefixes searched repeatedly

  User sessions (TTL=24hr):
    Key: session:abc123xyz
    Value: {userId:42, cart:[...], preferences:{...}}
    Why: Must be fast (checked on every authenticated request)</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "The Three Cache Problems",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">🔥</div><div><strong>Cache Stampede / Thundering Herd</strong>: A popular cache key expires. 10,000 requests simultaneously miss the cache, all query the database at once. Database overloads. Solution: probabilistic early expiry or mutex locks.</div></div>
  <div class="key-item"><div class="key-bullet">☁️</div><div><strong>Cache Penetration</strong>: Someone queries product IDs that don't exist (bot or bug). Cache always misses (no data to cache). Every request hits database. Solution: cache "null" results with short TTL.</div></div>
  <div class="key-item"><div class="key-bullet">🌊</div><div><strong>Cache Avalanche</strong>: Many cache keys expire simultaneously (all set with same TTL). Mass cache misses hit database at once. Solution: jitter — add random offset to TTL (3600 + random(600) seconds).</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">When Cache Hits 80%</div><div class="interview-q">A good follow-up answer when asked about caching: "Cache effectiveness is measured by hit rate. Our Redis cache for product data has a 97% hit rate, meaning only 3% of product requests hit the database. A 10% drop in hit rate can mean 3x more database load. We monitor hit rate with Redis INFO stats and alert when it drops below 90%. Hit rate drops signal either new traffic patterns or cache configuration issues."</div></div>`,
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
          body: `<p><strong>Cache Aside</strong> (Lazy Loading) means the application code itself is responsible for reading from cache and populating it on a miss. The cache sits "aside" from the main data flow. The database is the source of truth. The cache is a performance optimization that the application manages explicitly: Check cache → if miss, query database → populate cache → return result.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Cache Aside Flow Diagram",
          body: `<div class="diagram-box">Cache HIT (fast path — ~0.5ms):
  1. Rahul requests product:12345
  2. App checks Redis:  GET product:12345
  3. Redis returns: {id:12345, name:"Nike Air...", price:4999}
  4. App returns to Rahul ← done in 1ms

Cache MISS (slow path — ~25ms, first time or after expiry):
  1. Rahul requests product:12345
  2. App checks Redis: GET product:12345 → nil (not found)
  3. App queries PostgreSQL:
     SELECT * FROM products WHERE id=12345
  4. DB returns product row
  5. App stores in Redis:
     SET product:12345 {serialized JSON} EX 3600
  6. App returns to Rahul ← done in 25ms
  
  (Next 10,000 requests for product:12345 → all 1ms cache hits)

Code (productService.js):
  async getProduct(id) {
    const cached = await redis.get(\`product:\${id}\`);
    if (cached) return JSON.parse(cached);   ← cache hit
    
    const product = await productRepo.findById(id);
    if (!product) {
      await redis.set(\`product:\${id}\`, 'null', 'EX', 60); ← cache null
      return null;
    }
    await redis.set(\`product:\${id}\`, JSON.stringify(product), 'EX', 3600);
    return product;   ← cache populated
  }</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Cache Invalidation on Update",
          body: `<div class="diagram-box">Admin updates Nike Air's price from ₹4999 → ₹3999:

  1. Admin sends: PATCH /admin/products/12345 { price: 3999 }
  2. ProductService:
     await productRepo.update(12345, { price: 3999 }); ← DB updated
     await redis.del(\`product:12345\`);                  ← cache INVALIDATED
  3. Next user requests product 12345:
     → Cache miss (key deleted)
     → Hits database, gets ₹3999
     → Caches new price
     
  Alternative: update cache directly:
     await redis.set(\`product:12345\`, JSON.stringify(updatedProduct), 'EX', 3600);
  
  Tradeoff: updating cache is slightly inconsistent risk 
  (what if DB write fails but cache update succeeds?)
  → Safer to DELETE cache on update (forces fresh DB read)</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Read-Heavy Workloads</div><div class="interview-q">Cache Aside is the default choice for read-heavy workloads: "We use cache-aside for product data. Read: check Redis first, fall back to database. Write: update database, then delete (not update) the cache key. Deleting forces a clean re-read on next request, avoiding stale cache scenarios where DB writes fail partway through. The slight extra latency on first-read-after-write is a worthwhile trade for consistency."</div></div>`,
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
          body: `<p>In <strong>Write Through</strong> caching, every write goes to cache and database simultaneously, synchronously. The application (or cache layer) writes to Redis AND PostgreSQL in the same operation. Cache is always consistent with the database. Reads always hit cache (cache is never stale). The write is only confirmed when both cache and DB have been updated.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Write Through Flow",
          body: `<div class="diagram-box">Rahul's write action: "Add to Cart" (productId:12345, qty:2)

  Write Through flow:
  1. App receives write request
  2. SIMULTANEOUSLY:
     → Write to Redis: HSET cart:user:42 product:12345 2
     → Write to PostgreSQL: INSERT INTO cart_items...
  3. Only return success when BOTH confirm
  
  Read (always fast):
  1. App reads cart for Rahul
  2. Redis: HGETALL cart:user:42  ← always fresh (writes went here too)
  3. Returns cart instantly, no DB read needed for reads

  ✅ Advantages:
  • Cache always consistent with DB
  • Very fast reads (always cache hit, no cold start)
  • No stale data problem
  
  ❌ Disadvantages:
  • Every write is slower (must write to 2 places)
  • Write amplification: data written to cache that may never be read
    (write product:54321, nobody reads it for 1 hour → wasted write)
  • Higher write latency (p99 write: 50ms instead of 30ms)</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Write Through Use Case",
          body: `<p>ShopKart uses write-through for the <strong>shopping cart</strong>. Reads are far more frequent than writes (Rahul views his cart 20 times for every 1 add/remove). Every cart view must be fast. Write latency is acceptable — adding an item takes an extra 20ms, which Rahul doesn't notice. But viewing the cart 20 times at >50ms each (if DB queries) would feel sluggish. Write-through solves this: cart reads are always sub-millisecond Redis reads, and cart writes are slightly slower but still fast enough.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Consistency vs Latency</div><div class="interview-q">Compare patterns: "Write-through vs cache-aside: cache-aside is lazy (populate on miss), write-through is eager (populate on every write). Write-through is better when reads vastly outnumber writes and you need guaranteed cache freshness. Cache-aside is better when writes are frequent (high write amplification cost) or when you're unsure which data will actually be read."</div></div>`,
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
          body: `<p><strong>Write Back</strong> (also called Write Behind) means writes go to cache first, and are asynchronously flushed to the database later. The cache acknowledges the write immediately; the database is updated in the background. This makes writes very fast. The risk: if the cache crashes before flushing to the database, those writes are lost.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Write Back Flow",
          body: `<div class="diagram-box">ShopKart Page View Counter (high-frequency write):

  Approach A — Write Through (expensive for high-frequency writes):
    Every page view → write to PostgreSQL
    100K page views/sec → 100K DB writes/sec → database overloaded

  Approach B — Write Back in Redis:
    1. Page viewed → Redis: INCR pageviews:product:12345
       → Redis acknowledges in 0.3ms (in-memory increment)
       → No PostgreSQL write yet
    
    2. Background job runs every 30 seconds:
       → Reads all changed counters from Redis
       → Flushes batch to PostgreSQL:
         UPDATE product_stats SET view_count = view_count + 15420
         WHERE product_id = 12345
       → Single DB write replaces 15,420 individual writes
    
    3. Result:
       DB writes: 100K/sec → 1 batch write/30sec (99.99% fewer DB writes)
       Latency: 0.3ms (was 5ms) per write
       
  Risk: Redis crashes mid-30-seconds → lose up to 30 sec of view counts
  Acceptable for analytics. NOT acceptable for orders or payments.</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "When NOT to Use Write Back",
          body: `<div class="callout danger"><div class="callout-icon">🚨</div><div>Never use write-back for financial transactions, order creation, inventory changes, or payment processing. The 0.1% risk of data loss is catastrophic for these workloads. If Redis crashes between Rahul's payment going through and the database recording it, ShopKart has charged him but has no record of the order. Write-back is exclusively for metrics, analytics, view counts, like/favourite counters — data where small losses are tolerable.</div></div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">High Write Throughput</div><div class="interview-q">Frame write-back in terms of the problem it solves: "Our product pages get 5M views/day. Storing each page view as a DB write at that scale is impractical. We use Redis INCR for real-time counting and a 60-second flush job that batches updates to PostgreSQL. This reduces DB writes by 99.9%. The trade-off: we might lose up to 60 seconds of view count data if Redis fails, which is acceptable for analytics."</div></div>`,
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
          body: `<p><strong>Cache invalidation</strong> is the process of removing or updating cached data when the underlying source of truth changes. Phil Karlton's famous quote: "There are only two hard things in Computer Science: cache invalidation and naming things." It's hard because distributed caches can hold multiple copies of data, updates happen from multiple code paths, and there's no built-in mechanism to notify caches of changes.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Invalidation Strategies",
          body: `<div class="diagram-box">1. TTL-based expiry (time-to-live):
   Cache key expires after N seconds automatically.
   Stale window: up to N seconds of stale data possible.
   Simplest approach. Use when brief staleness is acceptable.

2. Event-driven invalidation (best consistency):
   Admin updates product price in DB →
   DB triggers event (or app publishes event to message queue) →
   Cache subscriber receives event →
   DEL product:12345 from Redis
   Stale window: ~50ms (event propagation time)

3. Version tags / Cache busting:
   Cache key includes a version: product:12345:v7
   On update: increment version tag → old key auto-obsoletes
   New reads use product:12345:v8 → always miss → fresh from DB
   Old keys expire naturally via TTL

4. Write-through invalidation:
   Every application write that modifies data
   immediately deletes the related cache key
   Stale window: 0 (cache always reflects latest write)
   Cost: every write does 2 operations (DB write + cache delete)</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Category Cache Problem",
          body: `<div class="diagram-box">Problem: Category listing cache is complex to invalidate.

  category:electronics:page:1 contains 20 products.
  Admin adds new product #2001 to Electronics category.

  ❌ Naive approach: Delete category:electronics:page:1
  Problem: 200 category caches must be checked (10 pages × 20 categories).
  Full category cache purge = 200 cache deletes on every product add.

  ✅ Better approach: Event-driven tagged invalidation
  category cache keys tagged with "electronics" version:
  Key: category:electronics:v42:page:1
  
  Admin adds product → increment electronics_version to 43 →
  All requests now look for category:electronics:v43:page:* →
  All v42 keys are "orphaned" (not looked up, TTL expires them)
  
  Cost: one Redis INCR to bump version invalidates ALL category caches
  without explicit deletion. Elegant.</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Consistency Challenges</div><div class="interview-q">Acknowledge the difficulty: "Cache invalidation is genuinely hard. Our strategy: for simple objects (product by ID), delete the specific cache key on update. For derived/aggregated data (category listings, search rankings), use version tags — a single Redis INCR to the category version makes all related cache keys stale without enumerating them. For session data, TTL-based expiry is sufficient since stale session data is harmless."</div></div>`,
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
          body: `<p><strong>TTL</strong> (Time To Live) is the time duration after which a cache entry is automatically expired and deleted. Redis: <code>SET key value EX 3600</code> — expires after 3600 seconds. When a TTL expires, the next request for that key is a cache miss (triggers a database reload). TTL is the primary mechanism for preventing stale data without explicit invalidation.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart TTL Strategy by Data Type",
          body: `<table class="compare-table"><thead><tr><th>Data</th><th>TTL</th><th>Reasoning</th></tr></thead><tbody>
<tr><td>Product HTML fragment</td><td>1 hour</td><td>Changed by admin, low frequency</td></tr>
<tr><td>Product price only</td><td>5 minutes</td><td>Flash sales, dynamic pricing</td></tr>
<tr><td>Inventory count</td><td>30 seconds</td><td>Purchases change it frequently</td></tr>
<tr><td>Category listings</td><td>10 minutes</td><td>Catalog updates a few times/day</td></tr>
<tr><td>Search results</td><td>3 minutes</td><td>New products added, rankings shift</td></tr>
<tr><td>User cart</td><td>7 days</td><td>User expects persistence</td></tr>
<tr><td>User session</td><td>24 hours</td><td>Standard login session duration</td></tr>
<tr><td>Homepage featured items</td><td>1 minute</td><td>Merchandising team updates hourly</td></tr>
<tr><td>Recommendation list</td><td>15 minutes</td><td>ML model updates every 2 hours</td></tr>
</tbody></table>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "TTL Jitter — Preventing Cache Avalanche",
          body: `<div class="diagram-box">Problem: Diwali sale starts. 100,000 product pages are cached at 8pm.
All with TTL = 3600 seconds.
At 9pm EXACT: all 100,000 keys expire simultaneously.
One second later: 50,000 req/sec ALL miss cache → database avalanche.

Solution: TTL Jitter (add randomness to TTL):

Without jitter:
  redis.set(key, value, 'EX', 3600);  ← all expire at same time

With jitter:
  const ttl = 3600 + Math.floor(Math.random() * 600);  // 3600-4200sec
  redis.set(key, value, 'EX', ttl);

Effect: expirations spread over 10 minutes instead of 1 second
Database load: smooth 5,000 req/sec instead of spike 50,000 req/sec</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">TTL Design Decisions</div><div class="interview-q">Show you think about TTL consequences: "Setting TTL requires understanding data volatility and staleness tolerance. For inventory counts, 30-second TTL means users might see 'In Stock' when an item just sold out — acceptable for most products, but for limited-edition drops we set TTL to 5 seconds. We also add ±10% random jitter to all TTLs to prevent cache avalanche when multiple keys were populated simultaneously during a bulk import."</div></div>`,
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
          body: `<p><strong>Redis</strong> (Remote Dictionary Server) is an open-source, in-memory data structure store. It's not just a cache — it's a data structure server supporting strings, hashes, lists, sets, sorted sets, bitmaps, hyperloglogs, and streams. Redis is single-threaded for command execution (no lock contention). It persists data to disk optionally. Sub-millisecond latency. The default choice for caching, session storage, rate limiting, and pub/sub messaging.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Redis Data Structures in ShopKart",
          body: `<div class="diagram-box">STRING — Product Cache:
  SET product:12345 "{name:'Nike Air',price:4999}" EX 3600
  GET product:12345

HASH — Shopping Cart (fields within one key):
  HSET cart:user:42 product:12345 quantity:2
  HSET cart:user:42 product:67890 quantity:1
  HGETALL cart:user:42  → all items
  HGET  cart:user:42 product:12345  → quantity for specific product

SET — Unique Visitors (counting without duplicates):
  SADD unique_visitors:20240101 user:42
  SCARD unique_visitors:20240101 → count distinct users

SORTED SET — Product Popularity Ranking:
  ZADD trending:products 9500 product:12345  (score=views)
  ZADD trending:products 8200 product:67890
  ZREVRANGE trending:products 0 9 WITHSCORES → top 10 by views

LIST — Recent Activities Queue:
  LPUSH user:42:activity "viewed:product:12345"
  LRANGE user:42:activity 0 9 → last 10 activities

COUNTER — Rate Limiting:
  INCR rate_limit:user:42:minute:1234
  EXPIRE rate_limit:user:42:minute:1234 60
  → Count requests per minute, auto-reset after 60 seconds</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Redis Cluster for ShopKart Scale",
          body: `<div class="diagram-box">Single Redis: 128GB RAM — stores:
  - Product cache: 50GB   (10M products × 5KB each)
  - Sessions:       8GB   (1M active users × 8KB each)
  - Carts:         15GB   (2M active carts × 7.5KB each)
  Total: 73GB → approaching the limit.

Redis Cluster (horizontal sharding):
  3 master nodes + 3 replicas (1 replica per master)
  
  Master 1: handles keys hashing to slots 0-5460
  Master 2: handles keys hashing to slots 5461-10922
  Master 3: handles keys hashing to slots 10923-16383
  
  product:12345 → hash(12345) → slot 4782 → Master 1
  session:abc   → hash(abc)   → slot 7251 → Master 2
  
  Capacity: 3 × 128GB = 384GB total
  If one master fails → replica promotes automatically in <1 sec</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Redis vs Memcached</div><div class="interview-q">"Redis vs Memcached: we choose Redis because it supports complex data structures (sorted sets for leaderboards, lists for queues), persistence options (RDB snapshots + AOF for durability), cluster mode for horizontal scaling, and Lua scripting for atomic operations. Memcached is simpler and potentially slightly faster for pure simple string caching, but the operational simplicity of having one tool handle caching, sessions, rate limiting, and pub/sub makes Redis win in practice."</div></div>`,
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
          body: `<p>A <strong>key-value store</strong> is a database where each record is a key-value pair: a unique key (string) maps to a value (anything: string, JSON, binary). Lookups are O(1) by key — no scan needed. There's no schema, no join, no SQL. Just <code>SET key value</code> and <code>GET key</code>. This simplicity enables extreme performance and horizontal scalability. Redis, DynamoDB, and Memcached are key-value stores.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Key Design — Naming Conventions",
          body: `<div class="diagram-box">Good key naming: {entity}:{id}:{field}

product:12345              → full product JSON
product:12345:price        → just the price
product:12345:inventory    → just stock count
session:abc123xyz          → user session data
rate_limit:ip:192.168.1.1  → rate limit counter
feature:dark_mode:user:42  → feature flag for specific user
category:electronics:v7    → versioned category cache
order:order-88821:status   → order status

Collisions to avoid:
  DON'T: "user" (too generic — conflicts with other teams' keys)
  DO:    "shopkart:user:42" (namespace prefix per service)

For Redis Cluster:
  {same_slot_keys} notation: {product}:12345:price and {product}:12345:inventory
  → Both keys in the same cluster slot (enables atomic multi-key operations)</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "When Key-Value Fits ShopKart",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>Session storage</strong>: Sessions are always fetched by ID (session token). Perfect KV fit.</div></div>
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>Leaderboards / rankings</strong>: Use Redis Sorted Set — key is set name, values are members with numeric scores.</div></div>
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>Feature flags</strong>: Key = feature:dark_mode:user:42, value = "enabled". O(1) lookup per request.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Searching by non-key attributes</strong>: "Find all products under ₹500 by Nike" — impossible with pure KV. Needs a SQL database or search engine. You can only look up by exact key.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Relational data</strong>: Order contains products which have categories. Joins are impossible in KV. Use relational database + KV cache on top.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Data Model Choices</div><div class="interview-q">"Key-value stores trade query flexibility for performance. We use DynamoDB as our primary KV store for user session data — it scales to millions of reads/second with single-digit millisecond latency, which PostgreSQL can't match. The constraint: we can only access data by the partition key or sort key. Every access pattern must be designed upfront. For complex queries (reporting, analytics), we replicate from DynamoDB to a data warehouse."</div></div>`,
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
          body: `<p><strong>API Response Caching</strong> stores the complete HTTP response for an API endpoint. When the same request comes in again, the cached response is returned immediately — bypassing application code, database queries, and business logic entirely. The most dramatic cache performance gain possible. Implemented in the API gateway, Nginx, CDN, or a dedicated layer.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Where API Caching Lives",
          body: `<div class="diagram-box">Tiered API caching (nearest to user = fastest):

Browser Cache:
  Cache-Control: public, max-age=300  ← browser caches response 5 minutes
  Rahul refreshes product page → browser uses cached response (0ms network!)

CDN Cache (CloudFront, Cloudflare):
  ShopKart static API responses (product listings, category pages)
  cached at 200+ CDN edge nodes globally
  Cache hit: ~5ms from nearest edge (no request reaches ShopKart servers)
  Cache miss: CloudFront → ShopKart (Singapore) → back → cache in CDN

API Gateway Cache (Kong, AWS API Gateway):
  GET /api/products/featured → cached for 60 seconds
  Cache hit: gateway returns immediately (0 application code executed)
  
Application-level Response Cache (Redis):
  redis.get(\`http_response:GET:/api/products?category=electronics&page=1\`)
  → returns cached JSON string directly
  → no controller, no service, no repository executed
  Cache hit: controller function not even called</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "HTTP Cache Headers ShopKart Uses",
          body: `<div class="diagram-box">Public, cacheable responses (product pages, categories):
  Cache-Control: public, max-age=300, stale-while-revalidate=60
  → CDN and browsers cache for 5 minutes
  → stale-while-revalidate: serve stale for 60s while refreshing in background

Private, user-specific responses (cart, orders):
  Cache-Control: private, no-store
  → Never cached by CDN (different per user)
  → Browser doesn't cache (sensitive data)

Highly dynamic (inventory, flash prices):
  Cache-Control: no-cache, must-revalidate
  → Always validate with server before using cached copy
  
ETag-based conditional caching (bandwidth optimisation):
  Server: ETag: "4f2abc" (hash of response content)
  Browser sends: If-None-Match: "4f2abc"
  Server: 304 Not Modified (if unchanged) → no body transmitted → saves bandwidth</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">CDN Cache Design</div><div class="interview-q">"For ShopKart's product listing pages, we use CloudFront with 5-minute TTL. At 100K requests/second for product listings, a 95% CDN hit rate means only 5,000 req/sec reach our servers — matching our capacity. Without CDN caching, we'd need 20x the infrastructure. The key design decision: distinguish public (cacheable by CDN) vs private (user-specific, never CDN-cached) responses in the API design."</div></div>`,
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
          body: `<p><strong>Session caching</strong> means storing user authentication sessions in Redis (not in the database or server memory) so that every API request can verify the user's session in sub-millisecond time. Instead of querying the database on every request to validate a session, the server reads from Redis. Crucial for stateless horizontal scaling.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Session Storage: Bad → Good",
          body: `<div class="diagram-box">❌ Server Memory (stateful):
  Rahul logs in → Express stores session in process memory
  Session lives in Server A's RAM only
  → Not scalable horizontally
  → Server restart = all users logged out

❌ PostgreSQL for session lookup (every request):
  Rahul's request → look up sessions table WHERE token='abc'
  → 10,000 req/sec = 10,000 DB queries/sec for sessions alone
  → DB overloaded just for auth checks

✅ Redis Session Cache:
  Login flow:
    Generate session ID: uuid() → "sess_a4f2b1c3d5e6"
    Store in Redis: SET sess_a4f2b1c3d5e6 {userId:42, roles:["CUSTOMER"], cart:"token"} EX 86400
    Return session ID as cookie: Set-Cookie: SID=sess_a4f2b1c3d5e6; HttpOnly; Secure
  
  Every subsequent request:
    Read cookie: SID=sess_a4f2b1c3d5e6
    Redis GET sess_a4f2b1c3d5e6 → {userId:42, roles:["CUSTOMER"]} (0.3ms!)
    Attach user context to request object (req.user = {...})
    
  Logout:
    Redis DEL sess_a4f2b1c3d5e6 → immediately invalidated
    (JWT tokens can't do this without a blacklist)</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Session Data Structure — ShopKart",
          body: `<div class="diagram-box">Redis HASH for session (efficient field access):

  HSET session:sess_a4f2b1c3d5e6
    userId        "42"
    username      "rahul.sharma"
    roles         "CUSTOMER"
    cartItemCount "3"
    lastSeen      "2024-12-18T14:30:00Z"
    ipAddress     "182.71.55.200"
  EXPIRE session:sess_a4f2b1c3d5e6 86400
  
  On each request, update lastSeen:
    HSET session:sess_a4f2b1c3d5e6 lastSeen now()
    EXPIRE session:sess_a4f2b1c3d5e6 86400  ← sliding window expiry
    (session extends 24hrs from last activity, not from login)
  
  Absolute timeout (security): separate key tracks login time
    HSET session:sess_a4f2b1c3d5e6 loginTime "2024-12-18T10:00:00Z"
    App logic: if(now - loginTime > 8 hours) → force re-authentication</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "JWT vs Redis Sessions",
          body: `<table class="compare-table"><thead><tr><th></th><th>JWT (Stateless)</th><th>Redis Sessions</th></tr></thead><tbody>
<tr><td><strong>Server state</strong></td><td>None</td><td>Redis storage</td></tr>
<tr><td><strong>Revocation</strong></td><td>Wait for expiry (can't revoke early)</td><td>Instant (DEL key)</td></tr>
<tr><td><strong>Data included</strong></td><td>Limited (in token, sent over network)</td><td>Any amount (stored in Redis)</td></tr>
<tr><td><strong>Invalidation on breach</strong></td><td>Impossible until expiry</td><td>Immediate</td></tr>
<tr><td><strong>Scale</strong></td><td>Infinite (no server state)</td><td>Redis cluster needed</td></tr>
<tr><td><strong>ShopKart choice</strong></td><td>For public API clients</td><td>For web/mobile sessions</td></tr>
</tbody></table>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Auth Scalability</div><div class="interview-q">"We use Redis for session storage rather than database or JWT for our main web sessions. The reason: Redis gives us instant session revocation — critical for security (stolen token, user logout). JWT's inability to be revoked before expiry is a security trade-off. Redis latency for session lookup is 0.3ms — effectively free. We run Redis Cluster with 3 masters + 3 replicas, sharding sessions by user ID prefix."</div></div>`,
        },
      ],
    },
  ],
};

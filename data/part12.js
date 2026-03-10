/* Part 12 — Career Readiness (4 topics) */
const PART12 = {
  id: "part12",
  icon: "🎓",
  title: "Part 12",
  name: "Career Readiness",
  topics: [
    /* 1 */ {
      id: "p12t1",
      title: "System Design Interview Framework",
      subtitle:
        "A repeatable 45-minute framework that impresses senior engineers.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "The 45-Minute Framework",
          body: `<p style="margin-bottom:14px;">System design interviews are open-ended by design — there is no single correct answer. What interviewers assess is your <strong>thinking process</strong>, your ability to ask the right questions, reason about trade-offs, and drive toward a concrete design. Without a framework, most candidates ramble and run out of time. With this 6-step structure, you cover every dimension the interviewer cares about.</p>
<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Step 1 — Clarify Requirements (5 min)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><strong>Never start designing immediately.</strong> Ask: What does the system do? Who uses it? What’s the read/write ratio? Latency target? Consistency requirement? Availability target? For a ShopKart design: "Are we designing the product page, or the full checkout flow? Do we need real-time stock or eventual consistency is acceptable?"</p>
    <div style="font-size:12px;color:var(--accent);font-weight:600;">📌 Write requirements on the whiteboard. Confirm with interviewer before moving on.</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Step 2 — Estimate Scale (3 min)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Back-of-envelope math anchors every major decision. Example for ShopKart: 10M DAU × 5 page views/day = 50M reads/day = 580 reads/sec. 1 order/user/day = 10M writes/day = 116 writes/sec. Data: 10M orders × 2KB = 20GB/day. This determines: do I need sharding? CDN? Read replicas?</p>
    <div style="font-size:12px;color:#10b981;font-weight:600;">📌 Estimate then move on. Don’t over-optimize estimate math.</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Step 3 — High-Level Design (10 min)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Draw the skeleton: Client → CDN → API Gateway → Load Balancer → Microservices → Databases + Cache + Queue. Keep it simple — get the major components and data flows on paper first. Don’t detail any single component yet.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Step 4 — Dive Deep into 2-3 Components (15 min)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Choose the most interesting/complex parts. For ShopKart: database schema (normalized products + orders), caching strategy (what to cache, TTL, invalidation), and the stock decrement race condition solution (DynamoDB conditional writes). This is where you demonstrate depth.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Step 5 — Identify Bottlenecks & Trade-offs (7 min)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">“Single write leader is a bottleneck for orders during Diwali sale — I’d shard by user_id. Cache invalidation for product price is the hardest problem — I’d use short 60-second TTL and event-driven invalidation on price update events.” Naming bottlenecks before the interviewer does shows you think ahead.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(99,102,241,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Step 6 — Wrap Up (5 min)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Summarize the design in 3 sentences. State what’d you improve with more time. Mention your monitoring and alerting strategy (latency P99 alert, error rate alert). This demonstrates production mindset.</p>
  </div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-yellow",
          title: "What Interviewers Really Score",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">✅ Thinking Out Loud</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;">Interviewers can't score what they can't see. Narrate every decision: "I’m using Postgres here because the order data is relational and ACID compliance is critical for payment integrity."</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">✅ Trade-off Awareness</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;">Never just say "I’d use Redis". Say "I’d use Redis for the session cache because reads are 100x writes and TTL-based expiry is perfect here. The trade-off is Redis is in-memory so we size carefully and use persistence for recovery."</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.03);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">✅ Estimation Without a Calculator</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;">10M DAU × 10 requests = 100M/day ÷ 86,400 seconds = ~1,200 RPS. You only need to be in the right order of magnitude. Showing you can do this under pressure is the skill.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(34,197,94,0.02);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">✅ Knowing When to Ask vs Assume</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;">Ask: "Is this read-heavy or write-heavy?" (changes database choice). Assume: reasonable latency targets. Never start designing without knowing the dominant use case.</p>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect’s Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">A system design interview is not a test of memorization. It’s a test of structured thinking under ambiguity. The interviewer will throw curveballs (“now make it global”, “now handle 10x traffic”). The framework lets you adapt systematically instead of panicking. Practice 10 designs with the framework and it becomes muscle memory.</span>
</div>`,
        },
      ],
    },

    /* 2 */ {
      id: "p12t2",
      title: "Design Amazon Product Page",
      subtitle:
        "A complete system design walkthrough using everything you've learned.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Requirements Clarification",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">📝 Functional Requirements</div>
    <ul style="margin:0;padding-left:18px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <li>Display product details: title, description, images, price, seller info</li>
      <li>Show real-time stock status (in stock / low stock / out of stock)</li>
      <li>Show product ratings and reviews (read-heavy)</li>
      <li>Show personalised product recommendations</li>
      <li>Handle flash sales (price changes every minute during sale)</li>
      <li>Add to cart button (writes to user cart, not covered in this design)</li>
    </ul>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">📊 Non-Functional Requirements & Estimates</div>
    <ul style="margin:0;padding-left:18px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <li>100M DAU, 500M product page views/day → <strong>5,800 reads/sec</strong></li>
      <li>Availability: <strong>99.99%</strong> (&lt;53 min downtime/year)</li>
      <li>Page latency: <strong>&lt;200ms p99</strong></li>
      <li>Stock count: strong consistency during checkout, eventual OK on product page</li>
      <li>Price: must be consistent during a single checkout session</li>
      <li>Data: 100M products × 10KB each = 1TB product catalog</li>
    </ul>
  </div>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-purple",
          title: "High-Level Architecture",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌐 Request Flow</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.8;">Browser → <strong>CloudFront CDN</strong> (static assets: images, JS, CSS — 70% cache hit) → <strong>API Gateway</strong> → <strong>Product Service</strong> → Redis cache (product data, 5-min TTL) → PostgreSQL (source of truth). Recommendations fetched async via a separate call to Recommendation Service.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🗄️ Key Design Decisions</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>• <strong>Product data</strong>: PostgreSQL (relational, complex catalog queries, ACID for price updates)</div>
      <div>• <strong>Stock count</strong>: DynamoDB with conditional atomic writes (<code>stock &gt; 0</code> condition → prevents oversell)</div>
      <div>• <strong>Images</strong>: S3 + CloudFront (CDN edge — &lt;10ms serve after first request)</div>
      <div>• <strong>Cache</strong>: Redis. Product data TTL=5min. During flash sale: TTL=60s + event-driven invalidation on price change</div>
      <div>• <strong>Recommendations</strong>: Pre-computed by ML batch job, stored in Redis keyed by product_id</div>
      <div>• <strong>Reviews</strong>: Read replica of Postgres. Reviews are eventually consistent — OK for this use case</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚠️ Bottlenecks & Mitigations</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>• <strong>Cache stampede</strong> on popular product: use probabilistic early refresh + request coalescing</div>
      <div>• <strong>Flash sale traffic spike</strong>: pre-warm cache before sale starts, scale ECS from 10 → 50 tasks 30 min before</div>
      <div>• <strong>Recommendation Service down</strong>: circuit breaker — serve page without recommendations, don’t fail the page</div>
      <div>• <strong>Oversell race condition</strong>: DynamoDB <code>SET stock = stock - 1 WHERE stock &gt; 0</code> conditional write</div>
    </div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect’s Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">This design touches every concept in the Architect Academy curriculum: HTTP/CDN (Part 1), REST APIs (Part 2), Auth (Part 3), SQL + DynamoDB (Part 4), microservices (Part 5), auto-scaling (Part 6), caching (Part 7), async events (Part 8), AWS infrastructure (Part 9). A product page design is the perfect all-in-one system design practice problem.</span>
</div>`,
        },
      ],
    },

    /* 3 */ {
      id: "p12t3",
      title: "Top 10 System Design Topics",
      subtitle:
        "The most common system design questions — and their core concepts.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "The Classic 10",
          body: `<p style="margin-bottom:14px;">These 10 problems appear in almost every senior/staff engineering interview. Mastering them means you understand the core patterns: caching, sharding, fanout, real-time communication, stream processing, and geographic indexing. For each, know the <strong>single hardest technical challenge</strong> and your answer to it.</p>
<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">1 — URL Shortener (Bitly)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Core challenge: <strong>unique ID generation at scale</strong>. Solution: Base62 encode a 64-bit auto-increment or hash. Collision: check before insert or use Twitter Snowflake for guaranteed uniqueness. Key decision: 301 redirect (browser caches, correct) vs 302 (don’t cache, track clicks). Cache all GET lookups in Redis (reads 100x writes).</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">2 — Social Media Feed (Twitter/Instagram)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Core challenge: <strong>fan-out problem</strong>. Fan-out on write (push posts to all followers’ timelines at post time — fast reads, slow writes). Fan-out on read (fetch from followed users at read time — slow reads, fast writes). Hybrid: fan-out on write for normal users, fan-out on read for celebrities (100M followers).</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">3 — WhatsApp / Messaging System</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Core challenge: <strong>real-time delivery with guaranteed ordering</strong>. WebSocket persistent connections for real-time push. Message sequence numbers per conversation ensure ordering. Delivery receipts via ACK. Offline users: store in DB, push on reconnect. Group chats: fan-out to all members.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">4 — Uber / Ride Matching</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Core challenge: <strong>geospatial proximity search</strong>. Geohash encodes lat/lon into a string prefix — nearby locations share the same prefix. Store driver locations in Redis with geohash key. Query nearby drivers: lookup 9 geohash cells (target + 8 neighbors) to handle boundary cases.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">5 — YouTube / Video Streaming</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Core challenge: <strong>upload pipeline + adaptive streaming</strong>. Upload: client → S3 (raw) → transcoding workers convert to multiple resolutions (240p/480p/1080p) → push to CDN. Player uses HLS/DASH: switches quality based on bandwidth. View counts: Redis INCR for approximate real-time count, batch flush to DB every minute.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">6 — Rate Limiter</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Core challenge: <strong>distributed counter without locking</strong>. Token bucket (allows burst) vs sliding window log (precise) vs fixed window (simple, burst at boundary). Redis: <code>INCR user:123:requests</code> + <code>EXPIRE</code> for fixed window. Sliding window: sorted set with timestamp as score, count members in last N seconds.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">7 — Notification System</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Core challenge: <strong>fan-out to millions of users reliably</strong>. SQS queue per channel (push/email/SMS). Fan-out worker reads order events and publishes to channel queues. Deduplication: idempotency key per notification. User preference service: check before sending (don’t send email if opted out).</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">8 — Typeahead Search / Autocomplete</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Core challenge: <strong>low-latency prefix lookup at scale</strong>. Trie in memory for exact prefix matching. Top-k suggestions per prefix node (precomputed). Redis Sorted Set: score = frequency, <code>ZRANGEBYLEX</code> for prefix queries. Edge cache with CDN: most queries are common prefixes like "iph", "sam" — highly cacheable.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">9 — Distributed Cache</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Core challenge: <strong>consistent hashing for node distribution</strong>. Virtual nodes handle uneven distribution. Replication factor=3: each key on 3 nodes for resilience. Hot key problem: popular keys get all traffic on one shard. Solution: local in-process cache for hottest keys + key sharding (append random suffix 0-9, read from random shard).</p>
  </div>
  <div style="padding:14px 16px;background:rgba(99,102,241,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">10 — Web Crawler</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Core challenge: <strong>deduplication and politeness</strong>. URL frontier queue prioritised by PageRank. Bloom filter checks if URL already crawled (memory-efficient, small false-positive rate OK). Politeness: rate-limit per domain (don’t hammer one site). Distributed: partition URL space by domain hash across crawler workers.</p>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Practice Plan</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Practice in this order: <strong>URL Shortener → Rate Limiter → Notification System → Feed → WhatsApp → YouTube → Uber → Typeahead</strong>. Each one introduces new patterns. The first three are pattern-setters. Do one per week, write it up, review your trade-offs. After 8 weeks you’ll handle any system design question.</span>
</div>`,
        },
      ],
    },

    /* 4 */ {
      id: "p12t4",
      title: "Your Architect Journey",
      subtitle: "The roadmap from here to senior/staff engineer and architect.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "The 5-Stage Roadmap",
          body: `<p style="margin-bottom:14px;">The gap between "knows what Redis is" and "is trusted to design a system that serves 10M users" is <strong>applied experience + deliberate practice</strong>. Here's the exact path that engineering leaders follow to grow from developer to architect.</p>
<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📚 Stage 1 — Internalize the Fundamentals</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Networking, HTTP, SQL, auth, caching, async patterns — these never go out of style. You've completed this foundation. The test: can you explain TCP vs UDP, DB indexing, and cache invalidation in plain English without looking things up? If yes, move to Stage 2.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🛠️ Stage 2 — Build a Real Production-Grade Project</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Apply all 12 parts in one project: <strong>REST API + JWT auth + PostgreSQL + Redis + Docker + CI/CD + deployed on AWS ECS</strong>. This ShopKart-style project is your GitHub proof of knowledge. Interviewers love seeing real code that demonstrates the exact patterns you discuss in interviews. One good project beats 10 tutorial certifications.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🏆 Stage 3 — Weekly System Design Practice</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Pick one classic question per week, design it in 45 minutes, write it up. Priority order: URL Shortener → Rate Limiter → Notification Service → Feed → WhatsApp → YouTube → Uber. After 8 weeks your system design pattern recognition becomes instinctive. Mock with a peer — talking through your design out loud is 10x more valuable than reading.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔥 Stage 4 — Read Engineering Blogs Weekly</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Real-world decisions from real engineers at scale: <strong>Cloudflare Blog</strong> (networking, DDoS, edge), <strong>AWS Architecture Blog</strong>, <strong>Netflix Tech Blog</strong> (distributed systems, streaming), <strong>Uber Engineering</strong> (geospatial, dispatch), <strong>Meta Engineering</strong> (social graph, data centers). Each post teaches you a pattern you can reuse in interviews and at work.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">☁️ Stage 5 — AWS Solutions Architect Associate</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">SAA-C03 validates cloud infrastructure knowledge to employers. Study 4–6 weeks with Adrian Cantrill's course + AWS Skill Builder. 65 questions, 130 minutes. Pass rate after this curriculum: high, because you understand the "why" behind every service. Then aim for Developer Associate or Solutions Architect Professional.</p>
  </div>
</div>`,
        },
        {
          icon: "🏛️",
          color: "si-green",
          title: "The Architect Mindset",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">⚖️ Think in Trade-offs, Not Correct Answers</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">There is no perfect architecture. SQL vs NoSQL, sync vs async, strong vs eventual consistency — every choice has consequences. Your job is to identify what context demands and make an informed choice that you can defend and revisit as requirements change.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">❓ Question Requirements Before Designing</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">"Do we really need 99.999% uptime? That's 5 minutes/year and costs 3x more than 99.9%." Most over-engineered systems were built for requirements that didn't exist. Challenge every constraint. "Do users really need real-time consistency or is 1-second lag fine?" Simpler systems are more reliable.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🌱 Start Simple, Design to Scale</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">The right architecture for today is not the architecture for 5 years later. Monolith is correct at 3 engineers. Microservices at 50. Distributed caching at 100K RPS, not at 1K. Premature optimization is the biggest source of avoidable complexity in codebases. Build for now. Design the extension points for later.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">💬 Communicate Architecture Clearly</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">The best design explained badly fails. The architect's job is 50% technical decision-making and 50% communication: ADRs, whiteboard diagrams, Confluence docs, RFC reviews. The team that understands why a decision was made implements it correctly and extends it wisely.</p>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">You've just completed the Architect Academy — 12 parts, 136 topics, from "What is a network packet?" to designing Amazon-scale distributed systems at 5,800 RPS. The knowledge is yours. Now build something real, fail productively, iterate, and teach others what you learn. That's the architect's path.</span>
</div>`,
        },
      ],
    },
  ],
};

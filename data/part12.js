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
          title: "The Framework",
          body: `
<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text"><strong>Clarify Requirements (5 min)</strong> — Functional: "What does the system DO?" Non-functional: "How many users? Latency target? Consistency requirements?" Write these on whiteboard.</div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text"><strong>Estimate Scale (3 min)</strong> — DAU: 10M users. 1 write/user/day = 10M writes/day = 115 writes/sec. 10 reads per write = 1,150 reads/sec. Data: 10M users × 1KB = 10GB/day.</div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text"><strong>High-Level Design (10 min)</strong> — Draw: Client → CDN → API Gateway → Services → Database + Cache. Keep it simple first.</div></div>
  <div class="step-item"><div class="step-num">4</div><div class="step-text"><strong>Dive Deep (15 min)</strong> — Pick 2-3 key components to detail. Database schema, cache strategy, API design, feed generation algorithm.</div></div>
  <div class="step-item"><div class="step-num">5</div><div class="step-text"><strong>Bottlenecks & Trade-offs (7 min)</strong> — "This design has a single DB → add read replicas. Cache invalidation challenge → here's my strategy. If consistent hashing fails → here's the fallback."</div></div>
  <div class="step-item"><div class="step-num">6</div><div class="step-text"><strong>Wrap Up (5 min)</strong> — Summarize design, mention what you'd improve next, mention monitoring strategy.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-yellow",
          title: "What Interviewers Look For",
          body: `
<div class="key-list">
  <div class="key-item"><div class="key-bullet">✓</div><div><strong>Communication</strong> — Think out loud. Interviewers want to hear your reasoning, not just the answer.</div></div>
  <div class="key-item"><div class="key-bullet">✓</div><div><strong>Trade-off awareness</strong> — "I chose SQL over NoSQL here because... the trade-off is..."</div></div>
  <div class="key-item"><div class="key-bullet">✓</div><div><strong>Estimation</strong> — Back-of-envelope math shows you can reason about scale under pressure.</div></div>
  <div class="key-item"><div class="key-bullet">✓</div><div><strong>Ask clarifying questions</strong> — Never assume. "Is this read-heavy or write-heavy?" changes the entire design.</div></div>
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
          title: "Requirements",
          body: `
<div class="diagram-box">FUNCTIONAL:
  - Display product details, images, price, ratings
  - Show real-time stock status
  - Show similar product recommendations
  - Handle flash sales (price can change every minute)
  
NON-FUNCTIONAL:
  - 100M DAU, 500M product views/day → 5,800 reads/sec
  - 99.99% availability (< 53 min downtime/year)
  - Latency < 200ms for page load
  - Consistent price during checkout (stock counts can be eventually consistent)</div>`,
        },
        {
          icon: "🔷",
          color: "si-purple",
          title: "Design",
          body: `
<div class="diagram-box">Architecture:
  Client → CloudFront CDN (static assets, 70% cache hit)
         → API Gateway
         → Product Service → Redis Cache (product data, 5 min TTL)
                          → PostgreSQL (primary product data)
                          → DynamoDB (real-time stock, fast atomic decrements)
         → Recommendations Service → pre-computed in batch
                                   → stored in Redis per productId

Key decisions:
  Product data: PostgreSQL (relational, complex queries)
  Stock:       DynamoDB (atomic UPDATE + CONDITION = no oversell race condition)
  Prices:      Cache with 60-second TTL (acceptable for flash sales)
  Images:      S3 + CloudFront (CDN edge, < 10ms serve time)
  
  On flash sale start: pre-warm cache, increase Auto Scaling min to 3x normal.
  Circuit breaker: if Recommendations Service down → serve page without recommendations.
  Cache stampede prevention: probabilistic early refresh on product data.</div>`,
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
          title: "Interview Classics",
          body: `
<div class="key-list">
  <div class="key-item"><div class="key-bullet">1</div><div><strong>URL Shortener (Bitly)</strong> — Key: hash function (Base62), collision handling, 301 vs 302 redirect, analytics counting, cache all reads.</div></div>
  <div class="key-item"><div class="key-bullet">2</div><div><strong>Twitter/Instagram Feed</strong> — Key: fanout on write vs read, celeb problem, pagination with cursors, timeline denormalization.</div></div>
  <div class="key-item"><div class="key-bullet">3</div><div><strong>WhatsApp</strong> — Key: WebSockets for real-time, message ordering, delivery receipts, end-to-end encryption overview, read receipts.</div></div>
  <div class="key-item"><div class="key-bullet">4</div><div><strong>Uber/Swiggy</strong> — Key: geospatial indexing (geohash, S2), real-time location updates, driver matching algorithm, ETA calculation.</div></div>
  <div class="key-item"><div class="key-bullet">5</div><div><strong>YouTube</strong> — Key: upload pipeline (S3 → transcoding → CDN), adaptive bitrate streaming (HLS/DASH), view count (approx with Redis INCR).</div></div>
  <div class="key-item"><div class="key-bullet">6</div><div><strong>Google Search</strong> — Key: crawler, inverted index, PageRank basics, query parsing, ranking signals.</div></div>
  <div class="key-item"><div class="key-bullet">7</div><div><strong>Rate Limiter</strong> — Key: algorithms (token bucket, fixed window, sliding window), Redis distributed counter, response headers (X-RateLimit-*).</div></div>
  <div class="key-item"><div class="key-bullet">8</div><div><strong>Notification System</strong> — Key: push/email/SMS channels, fan-out at scale, deduplication, delivery guarantee, user preferences.</div></div>
  <div class="key-item"><div class="key-bullet">9</div><div><strong>Typeahead Search</strong> — Key: prefix trie, top-k suggestions, Redis Sorted Sets, debounce, CDN edge caching.</div></div>
  <div class="key-item"><div class="key-bullet">10</div><div><strong>Distributed Cache</strong> — Key: consistent hashing, replication factor, eviction, hot key problem, cache warmup.</div></div>
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
          title: "The Path",
          body: `
<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text"><strong>Internalize the fundamentals</strong> — Networking, HTTP, SQL, auth, caching. These never go out of style. You've just completed this foundation.</div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text"><strong>Build a real-world project</strong> — Apply all 12 parts: REST API + PostgreSQL + Redis cache + Docker + deployed on AWS with CI/CD. GitHub proof of knowledge.</div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text"><strong>Practice system design weekly</strong> — Pick one classic question, design it in 45 min, write it up. Prioritize: URL shortener → Feed → WhatsApp → Uber → YouTube.</div></div>
  <div class="step-item"><div class="step-num">4</div><div class="step-text"><strong>Read engineering blogs</strong> — Cloudflare Blog, AWS Architecture, Netflix Tech Blog, Uber Engineering, Meta Engineering. Real-world trade-offs from people at scale.</div></div>
  <div class="step-item"><div class="step-num">5</div><div class="step-text"><strong>Get AWS certified</strong> — AWS Solutions Architect Associate validates cloud knowledge to employers. Study 4-6 weeks, practice exams, schedule the test.</div></div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "The Architect Mindset",
          body: `
<div class="info-grid">
  <div class="info-card blue"><div class="info-card-title">Think in Trade-offs</div><p>There is no perfect solution. Every choice (SQL vs NoSQL, sync vs async, strong vs eventual consistency) has trade-offs. Your job is to choose the right trade-off for the context.</p></div>
  <div class="info-card green"><div class="info-card-title">Question Requirements</div><p>"Do we really need 99.999%? That's 5 minutes downtime/year." Often 99.9% is enough and much simpler to achieve. Push back on gold-plating.</p></div>
  <div class="info-card yellow"><div class="info-card-title">Start Simple</div><p>The right scale for today is not the scale for 5 years later. Build for now, design to scale. Premature optimization is the root of all engineering waste.</p></div>
  <div class="info-card purple"><div class="info-card-title">Communicate Clearly</div><p>The best design explained badly beats a mediocre design explained brilliantly... almost. Communication is half the architect's job. Write docs. Draw diagrams. Teach your team.</p></div>
</div>
<div class="callout tip"><div class="callout-icon">🎓</div><div>You've now completed the Architect Academy curriculum — 136 topics from "What is a network?" to designing Amazon-scale distributed systems. The knowledge is yours. Now build something great with it.</div></div>`,
        },
      ],
    },
  ],
};

/* Part 9 — Cloud & AWS (18 topics) */
const PART9 = {
  id: "part9",
  icon: "☁️",
  title: "Part 9",
  name: "Cloud & AWS",
  topics: [
    /* 1 */ {
      id: "p9t1",
      title: "What is Cloud Computing?",
      subtitle:
        "Renting computing infrastructure on-demand instead of owning it.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Cloud computing</strong> is renting computing resources — servers, storage, databases, networking — over the internet, paying only for what you use. Before the cloud, ShopKart would have bought servers (weeks of procurement), racked them in a data center, and maintained them. A spike in Diwali traffic would require hardware ordered 3 months in advance. The cloud gives ShopKart servers in seconds and auto-scaling in minutes.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "On-Premises vs Cloud",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🏚️ On-Premises (Traditional)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>❌ ₹50L upfront for servers + data center rent</div>
      <div>❌ 6-8 weeks to provision new capacity</div>
      <div>❌ Your team patches OS, replaces failed hardware</div>
      <div>❌ Traffic spike? Over-provision and waste — or under-provision and crash</div>
      <div>❌ Global reach requires opening data centers in each region</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(34,197,94,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">☁️ Cloud (AWS, GCP, Azure)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>✅ ₹0 upfront, pay per second of usage</div>
      <div>✅ New server running in 45 seconds via console or API</div>
      <div>✅ AWS manages hardware, hypervisor, datacenter; you manage OS up</div>
      <div>✅ Auto-scaling: 2 servers at 3am, 50 servers at peak Diwali sale, 2 again by midnight</div>
      <div>✅ Instantly available in 30+ regions worldwide</div>
    </div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">For startups and scaleups, the cloud is almost always the right answer. The operational savings, speed of iteration, and built-in reliability exceed the cost premium over self-managed hardware until you reach massive scale (think Dropbox at $75M/year AWS spend before building their own infrastructure). Even then, most companies stay on cloud.</span>
</div>`,
        },
      ],
    },

    /* 2 */ {
      id: "p9t2",
      title: "IaaS vs PaaS vs SaaS",
      subtitle:
        "Three service models — how much does the cloud provider manage for you?",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "The Stack",
          body: `
<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">              You manage →     Cloud manages
───────────────────────────────────────────────────────────
IaaS (Infrastructure as a Service)
  You manage: OS, Runtime, App, Data
  Cloud manages: Servers, Storage, Networking, Virtualization
  Examples: AWS EC2, Azure VMs, Google Compute Engine
  When: Maximum control needed. Your team manages servers.

PaaS (Platform as a Service) 
  You manage: App, Data
  Cloud manages: Everything below (OS, runtime, scaling)
  Examples: AWS Elastic Beanstalk, Heroku, Google App Engine
  When: Focus on app code, not infrastructure.

SaaS (Software as a Service)
  You manage: Your data
  Cloud manages: Everything
  Examples: Gmail, Salesforce, Slack, GitHub
  When: You use the software, not build it.</div>`,
        },
      ],
    },

    /* 3 */ {
      id: "p9t3",
      title: "AWS EC2",
      subtitle: "Virtual servers in the cloud — the foundation of AWS compute.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>EC2</strong> (Elastic Compute Cloud) is AWS’s virtual server service. You choose CPU, RAM, storage, and OS — and have a running server in 45 seconds. Unlike a physical server, you can stop it when not in use and pay nothing. You can clone it to 20 identical copies in 3 minutes. This is the elasticity that makes AWS transformative.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "Instance Types & Pricing in ShopKart",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">💻 Instance Families (Choose by workload)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><code>t3.micro</code> (2 vCPU, 1GB) — Dev/test. Burstable CPU. ₹0.009/hr</div>
      <div><code>m5.large</code> (2 vCPU, 8GB) — ShopKart API servers. Balanced compute+memory</div>
      <div><code>c5.2xlarge</code> (8 vCPU, 16GB) — CPU-intensive: search indexing, image processing</div>
      <div><code>r5.4xlarge</code> (16 vCPU, 128GB) — Memory-intensive: large DB, in-memory analytics</div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">💰 Pricing Models</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>On-Demand</strong>: Pay per second. No commitment. Normal price.</div>
      <div><strong>Reserved (1-3yr)</strong>: Commit to usage → up to 72% cheaper. ShopKart baseline uses Reserved for Order + Product services.</div>
      <div><strong>Spot</strong>: Bid for unused capacity → up to 90% cheaper. ShopKart uses Spot for batch jobs (image resizing, recommendation ML training). Spot can be interrupted with 2-minute warning — must handle gracefully.</div>
      <div><strong>Savings Plans</strong>: Flexible 1-yr commitment. Works across instance types and services.</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📈 Auto Scaling Group (ASG)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Define: Min 2 instances, Max 50, Desired 4. Policy: "If average CPU &gt; 70% for 5 minutes, add 3 instances. If CPU &lt; 30% for 10 minutes, remove 1 instance." During Diwali sale at peak: 50 instances serving 60,000 req/sec. At 3am: 2 instances serving 200 req/sec. Difference in monthly cost: ₹74,000.</p>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">For stateless services (API servers): EC2 in ASG with On-Demand for baseline + Spot for peak burst. For stateful services (DB, cache): Reserved instances — Spot interruption would lose data. Use Savings Plans for predictable base load + On-Demand for burst. Never run critical production on Spot instances without interruption handling.</span>
</div>`,
        },
      ],
    },

    /* 4 */ {
      id: "p9t4",
      title: "AWS S3",
      subtitle:
        "Infinitely scalable object storage — the internet's file cabinet.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>S3</strong> (Simple Storage Service) stores any file as an “object” at a unique path. Unlike a block device (EBS), it’s unlimited in size, globally accessible, and designed for 11 nines (99.999999999%) durability. You pay ≈₹1.70/GB/month. ShopKart’s entire product image catalog (50TB), user-uploaded invoice PDFs, and CI build artifacts all live in S3.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ShopKart S3 Usage Patterns",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">📦 ShopKart S3 Buckets</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
shopkart-product-images/products/iphone15/front.jpg<br/>shopkart-product-images/products/iphone15/thumb.jpg<br/>shopkart-user-uploads/users/42/profile.jpg<br/>shopkart-invoices/2025/11/orders/order-456789.pdf<br/>shopkart-builds/order-service/v2.4/orders.tar.gz<br/>shopkart-analytics/events/2025/11/15/pageviews.parquet</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">💰 S3 Storage Classes (Tiered Pricing)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Standard</strong>: ₹1.70/GB/month. Product images, active uploads. &lt;10ms latency.</div>
      <div><strong>Standard-IA</strong> (Infrequent Access): ₹0.85/GB. Old order invoices (rarely accessed). 30-day min.</div>
      <div><strong>Glacier Instant</strong>: ₹0.25/GB. Old user data. Retrieval in milliseconds.</div>
      <div><strong>Glacier Deep Archive</strong>: ₹0.06/GB. Compliance archival. Retrieval in hours.</div>
    </div>
    <div style="margin-top:8px;font-size:12px;color:#10b981;font-weight:600;">📌 Lifecycle policy moves invoices: Standard → IA at 30 days → Glacier at 90 days automatically</div>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔐 Access Control Patterns</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Public bucket + CloudFront</strong>: Product images served publicly via CDN</div>
      <div><strong>Private bucket + Pre-signed URL</strong>: Order invoices — temporary URL valid 60min</div>
      <div><strong>Private bucket + IAM Role</strong>: CI/CD service uploads builds — no hardcoded credentials</div>
    </div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Never store files inside containers or EC2 instances — they are ephemeral and can be restarted, terminated, or replaced. All user-generated content, media, and documents go to S3. Your application servers are stateless; S3 is the durable file store. Combine S3 with CloudFront: serve from CDN edge for speed, store durably in S3 as the origin.</span>
</div>`,
        },
      ],
    },

    /* 5 */ {
      id: "p9t5",
      title: "AWS RDS",
      subtitle:
        "Managed relational databases — no more managing DB servers yourself.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>RDS</strong> (Relational Database Service) runs PostgreSQL, MySQL, Aurora, or SQL Server fully managed — AWS handles OS updates, database patching, automated backups every day, monitoring, and multi-AZ failover. Instead of spending 20% of DBA time on maintenance, your DB team focuses entirely on schema design and query optimization. ShopKart runs its core Order and Product databases on RDS PostgreSQL.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "RDS Features that Matter",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌍 Multi-AZ — High Availability</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Primary DB in ap-south-1a, synchronous standby replica in ap-south-1b. If the primary AZ fails (power outage, hardware fault), RDS automatically promotes the standby to primary in 60–120 seconds. DNS endpoint updates automatically. Application reconnects to new primary. Zero data loss (synchronous replication = every write confirmed on both).</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Automatic failover</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Zero data loss (synchronous)</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ 2x instance cost</span>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📚 Read Replicas — Scale Reads</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Asynchronous replicas (up to 15). ShopKart writes go to primary write leader. Product catalog reads and order history queries go to 3 read replicas. Write: 1 connection. Read: round-robin across 3 replicas. Each replica handles ~800 reads/sec → combined capacity: 2,400 reads/sec vs 800 on single instance. 3x read throughput at 3x cost.</p>
    <div style="font-size:12px;color:#10b981;font-weight:600;margin-top:6px;">📌 Use for: Read-heavy workloads, reporting, analytics separation from OLTP</div>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚡ Aurora vs Standard RDS</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Aurora PostgreSQL/MySQL is AWS’s cloud-native DB engine — distributed, shared storage, 6 copies across 3 AZs, automatic storage scaling. 3–5x faster than standard RDS MySQL. Aurora Serverless v2 auto-scales from 0.5 ACU to 128 ACU. Cost: 20–30% more than standard RDS. ShopKart’s Order DB uses Aurora PostgreSQL for the write-throughput at Diwali scale.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Always use Multi-AZ for production databases — the cost (2x) is worth the 99.95% availability SLA vs 99.9% for single-AZ. Add read replicas when your read:write ratio exceeds 5:1 and DB CPU is consistently &gt;60%. Never run production databases without daily automated snapshots and point-in-time restore enabled (RDS provides both for free).</span>
</div>`,
        },
      ],
    },

    /* 6 */ {
      id: "p9t6",
      title: "AWS ElastiCache",
      subtitle: "Managed Redis or Memcached in the cloud.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>ElastiCache</strong> gives you managed Redis or Memcached — AWS handles replication, automatic failover, patching, monitoring, and backups. Self-managed Redis takes half a day to set up with replication + sentinel. ElastiCache does it in 20 minutes with zero ongoing maintenance. ShopKart uses ElastiCache Redis for session storage, product catalog cache, and rate limiting.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ElastiCache Redis Modes & Patterns",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔧 Cluster Modes</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Single-node</strong>: Dev/test. No redundancy. Cheapest.</div>
      <div><strong>Cluster OFF (1 Primary + 5 Replicas)</strong>: ShopKart uses in ap-south-1. Primary handles writes; replicas handle reads + auto-failover if primary dies. Simple config.</div>
      <div><strong>Cluster ON (sharded)</strong>: Data distributed across up to 500 nodes. For when a single Redis node’s 400GB RAM isn’t enough. Use at Flipkart scale.</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">👁️ ShopKart Redis Patterns</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Product catalog cache</strong>: <code>product:456 → {JSON}</code>, TTL=5min. Saves 400 DB reads/sec.</div>
      <div><strong>User sessions</strong>: <code>session:abc123 → {userId, cart}</code>, TTL=24hr. Stateless API servers.</div>
      <div><strong>Rate limiting</strong>: <code>INCR ratelimit:user:789</code>, EXPIRE 60s. 100 req/min limit enforced in 1 Redis op.</div>
      <div><strong>Flash sale inventory</strong>: <code>DECRBY stock:iphone15 1</code>. Atomic — no oversell. 50,000 ops/sec.</div>
      <div><strong>Leaderboard</strong>: Sorted Set scored by order count. Top sellers in real-time.</div>
    </div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">ElastiCache Redis is the primary relief valve for your RDS database. When DB reads become the bottleneck, cache popular data in Redis with a TTL appropriate to how stale you can tolerate. For ShopKart, product prices must refresh within 60 seconds; product descriptions can have 5-minute staleness. Different TTLs for different data.</span>
</div>`,
        },
      ],
    },

    /* 7 */ {
      id: "p9t7",
      title: "AWS SQS (Message Queue)",
      subtitle:
        "Fully managed message queuing service — decouple your microservices.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>SQS</strong> is a managed message queue — a durable buffer between services. Service A puts a message in the queue. Service B picks it up when ready. Service A doesn’t wait for B to finish. If B crashes, the message is still in the queue and will be retried. ShopKart uses SQS to decouple the 14 services that participate in order fulfillment — the customer gets a confirmation in 80ms while inventory checks, fraud detection, and warehouse dispatch happen asynchronously.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "Standard vs FIFO vs DLQ",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">💙 Standard Queue</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">At-least-once delivery. Best-effort ordering. Unlimited throughput. Message may be delivered more than once — your consumer must be idempotent. ShopKart’s <code>shopkart-order-events</code> queue: 50,000 new order messages/day flow from Order Service to Inventory, Notification, and Analytics services.</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:12px;margin-top:6px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Unlimited throughput</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:2px 7px;border-radius:5px;">⚠️ Possible duplicates</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:2px 7px;border-radius:5px;">⚠️ No strict ordering</span>
    </div>
    <div style="margin-top:8px;font-size:12px;color:var(--accent);font-weight:600;">📌 Use for: Notifications, analytics, inventory updates, email dispatch</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🟢 FIFO Queue</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Exactly-once delivery. Strict ordering guaranteed. Up to 3,000 messages/second (with batching). ShopKart’s <code>shopkart-payments</code> FIFO queue: Payment events for order #789 must be processed in order — place order, debit card, confirm payment. Any out-of-order processing creates financial errors.</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:12px;margin-top:6px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Strict ordering</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Exactly-once delivery</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:2px 7px;border-radius:5px;">⚠️ 3K msg/sec limit</span>
    </div>
    <div style="margin-top:8px;font-size:12px;color:#10b981;font-weight:600;">📌 Use for: Payments, financial events, sequential workflows where order matters</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔁 Dead Letter Queue (DLQ)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">When a message fails processing 5 times in a row, SQS moves it to the DLQ automatically instead of retrying forever. Your engineering team gets an alert (CloudWatch alarm on DLQ depth &gt; 0). Engineers inspect the failed message, find the bug, fix it, and re-queue. Without DLQ: bad messages loop forever, blocking healthy messages behind them.</p>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Use Standard queues for events that don’t require ordering and where your consumers are idempotent. Use FIFO only when ordering is a hard requirement (payments, sequential workflows). Always configure a DLQ — it’s your safety net for bad messages. Set CloudWatch alarm on DLQ depth to catch processing failures immediately.</span>
</div>`,
        },
      ],
    },

    /* 8 */ {
      id: "p9t8",
      title: "AWS Lambda",
      subtitle: "Run code without managing servers — serverless functions.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Lambda</strong> is functions-as-a-service. You write a function, upload it, and AWS runs it whenever triggered. No server to configure, no OS to patch, no capacity to plan. You pay ₹0.017 per 1 million invocations. When 1,000 images are uploaded simultaneously, 1,000 Lambda instances run in parallel automatically — you never configured a fleet of servers.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ShopKart Lambda Use Cases",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📸 Image Processing (S3 trigger)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Seller uploads product image to <code>shopkart-raw-images/</code>. S3 event triggers Lambda. Lambda resizes to 800×800 (product page) + 200×200 (thumbnail) + 400×400 (search result). Saves 3 versions to <code>shopkart-processed-images/</code>. Saves CloudFront CDN cache-buster URL to DynamoDB. 2,000 seller uploads/day — Lambda handles all with zero server management.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📄 Invoice PDF (SQS trigger)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Order confirmed → SQS message → Lambda triggered. Lambda generates PDF invoice (order items, GST breakdown, seller details), uploads to <code>shopkart-invoices/{orderId}.pdf</code> in S3, stores URL in Order DB, sends download link via SES email. Executes in 800ms. At Diwali scale: 50,000 Lambda invocations/day for invoice generation.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚡ Cold Start Problem</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">First invocation after idle period: Lambda initialises container + loads runtime + imports packages. Java Lambda: 3–5 seconds cold start. Node.js: 200–500ms. Subsequent calls: warm, sub-100ms. Solutions: (1) Provisioned Concurrency — keeps N warm instances ready, costs extra. (2) Use Node.js/Python instead of Java for latency-sensitive Lambdas. (3) Keep Lambda warm with scheduled pings every 5 minutes.</p>
    <div style="font-size:12px;color:#f59e0b;font-weight:600;">📌 Cold starts matter for synchronous Lambdas (API Gateway backed). Async triggers (S3, SQS) — cold start irrelevant.</div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Lambda shines for event-driven, short-lived, spiky workloads: file processing, notifications, scheduled jobs, webhooks. Use ECS/EC2 for long-running processes (WebSockets, background workers), when you need &gt;15 min execution, or when you need container-level control. Lambda’s maximum execution duration is 15 minutes.</span>
</div>`,
        },
      ],
    },

    /* 9 */ {
      id: "p9t9",
      title: "AWS CloudFront (CDN)",
      subtitle:
        "Amazon's global CDN — delivering content fast from 450+ edge locations.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>CloudFront</strong> is AWS’s CDN — it caches your content at 450+ edge locations worldwide. When a user in Delhi requests a ShopKart product image, they don’t hit a server in Mumbai. They hit a CloudFront edge node in Delhi, get a cache hit, and receive the image in 8ms instead of 80ms. 70% of ShopKart’s 780 million monthly product image requests are served from edge cache — never touching origin servers.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "CloudFront Flow & Cache Behaviors",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📷 Cache Behaviors — Different TTLs for Different Content</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Product images</strong> (<code>/images/*</code>): TTL 7 days. Rare change. Cache aggressively.</div>
      <div><strong>Static JS/CSS</strong> (<code>/static/*</code>): TTL 30 days + content hash in filename. Cache forever.</div>
      <div><strong>Product HTML page</strong> (<code>/products/*</code>): TTL 5 min. Price changes frequently.</div>
      <div><strong>API responses</strong> (<code>/api/*</code>): TTL 0 (pass through). Never cache authenticated requests.</div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌏 Edge Location Flow</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">User in Delhi<br/>↓<br/>CloudFront Edge (Delhi) → Cache HIT → respond 8ms<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ Cache MISS<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Origin: S3 or ECS (Mumbai, 20ms)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ Store in edge cache<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next Delhi request: 8ms</div>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🛡️ CloudFront Beyond Caching</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>AWS Shield Standard</strong>: DDoS protection at edge included free</div>
      <div><strong>WAF</strong>: Block SQL injection, XSS, IP blocks at edge before requests hit origin</div>
      <div><strong>HTTPS at edge</strong>: SSL termination at 450 edge locations; your origin can be plain HTTP</div>
      <div><strong>Lambda@Edge</strong>: Run code at the edge — A/B testing, auth headers, URL rewrites</div>
    </div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Every public-facing static asset (images, JS, CSS, fonts) must go through CloudFront. Never expose S3 buckets directly. CloudFront + S3 is both cheaper (CDN egress &lt; S3 direct egress) and faster. For API responses: only cache GET requests with stable results, always vary by Authorization header to prevent cache poisoning.</span>
</div>`,
        },
      ],
    },

    /* 10 */ {
      id: "p9t10",
      title: "AWS VPC",
      subtitle:
        "Your own private network in the cloud — isolating and securing AWS resources.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>VPC</strong> (Virtual Private Cloud) is your private, isolated network inside AWS. By default, AWS resources would be accessible from the public internet — a critical security risk. A VPC creates a private namespace where resources talk to each other on a private IP (10.x.x.x) and external access is explicitly controlled through subnets, security groups, and internet gateways. Think of it as building your own data center networking inside AWS.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ShopKart VPC Architecture",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌐 Network Layout (ap-south-1, 3 AZs)</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">Internet → [Internet Gateway]<br/>↓<br/>Public Subnets (10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24)<br/>&nbsp;&nbsp;→ ALB (Application Load Balancer)<br/>&nbsp;&nbsp;→ Bastion host (SSH access for admins only)<br/>↓<br/>Private App Subnets (10.0.10.0/24, 10.0.11.0/24, 10.0.12.0/24)<br/>&nbsp;&nbsp;→ ECS tasks: Order, Product, User, Search Services<br/>&nbsp;&nbsp;→ Can reach internet via NAT Gateway (for package downloads)<br/>↓<br/>Private DB Subnets (10.0.20.0/24, 10.0.21.0/24, 10.0.22.0/24)<br/>&nbsp;&nbsp;→ RDS PostgreSQL (primary + standby)<br/>&nbsp;&nbsp;→ ElastiCache Redis<br/>&nbsp;&nbsp;→ NO internet access at all</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔒 Security Groups vs NACLs</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Security Group</strong>: Instance-level firewall. Stateful — allow inbound port 443 automatically allows response. ShopKart RDS Security Group: only accepts port 5432 from ECS security group.</div>
      <div><strong>NACL</strong> (Network ACL): Subnet-level firewall. Stateless — must explicitly allow both request and response. Acts as extra layer for subnet-level blocking.</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🚀 VPC Endpoints</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Normally, your private subnet’s ECS tasks must exit through NAT Gateway to reach S3 or DynamoDB (both public AWS services). VPC Endpoints create a private tunnel inside AWS backbone. Saving: no NAT Gateway data processing charges (₹3.5/GB). ShopKart saves ₹82,000/month using S3 Gateway Endpoint instead of NAT for S3 traffic.</p>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Golden rule: databases and application servers go in private subnets. Load balancers go in public subnets. Never put a database in a public subnet. Security Groups should follow minimum access: RDS only accepts connections from the ECS security group, not from 0.0.0.0/0. Always use 3 AZs for production VPCs.</span>
</div>`,
        },
      ],
    },

    /* 11 */ {
      id: "p9t11",
      title: "AWS IAM",
      subtitle:
        "Identity and Access Management — who can do what to which AWS resources.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>IAM</strong> is AWS’s permission system — it controls who (user, service, or role) can do what (which API action) on which resource (which S3 bucket, which EC2 instance). Every AWS API call is authenticated against IAM. The golden rule: “Principle of Least Privilege” — grant only the exact permissions needed, nothing more. Your Order Service Lambda should not have admin access; it should only be able to write to the orders table and publish to the orders SQS queue.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "IAM Components & ShopKart Patterns",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">👤 Users, Groups, Roles</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>IAM User</strong>: Human identity with permanent credentials. ShopKart engineers have IAM users. Never use root account for daily work.</div>
      <div><strong>IAM Group</strong>: “DevOps Team” group has CloudWatch read + ECS deploy permissions. Add/remove engineers from group, not individual policies.</div>
      <div><strong>IAM Role</strong>: Temporary credentials assumed by a service. ECS task, Lambda, or EC2 assumes a role. No hardcoded passwords.</div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔐 ShopKart Service IAM Roles</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">order-service-task-role:<br/>&nbsp;&nbsp;s3:GetObject on shopkart-invoices/*<br/>&nbsp;&nbsp;s3:PutObject on shopkart-invoices/*<br/>&nbsp;&nbsp;sqs:SendMessage on shopkart-order-events<br/>&nbsp;&nbsp;ssm:GetParameter on /shopkart/order-service/*<br/><br/>image-resize-lambda-role:<br/>&nbsp;&nbsp;s3:GetObject on shopkart-raw-images/*<br/>&nbsp;&nbsp;s3:PutObject on shopkart-processed-images/*<br/>&nbsp;&nbsp;logs:CreateLogGroup on arn:aws:logs:*</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚠️ Most Common IAM Mistakes</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>❌ Hardcoding access keys in application code (they get committed to GitHub)</div>
      <div>❌ Giving services <code>*:*</code> (full admin) for “convenience”</div>
      <div>❌ Using root account for automation (root cannot be restricted)</div>
      <div>❌ Not enabling MFA on IAM users with console access</div>
    </div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Services never get credentials — they get IAM Roles. Only humans get access keys, and those keys get rotated quarterly. Use AWS Secrets Manager for DB passwords and API keys. Store config (non-secret) in SSM Parameter Store. Tag IAM roles with the owning team and service name — when you have 300 microservices, role naming and tagging is the only way to audit what can access what.</span>
</div>`,
        },
      ],
    },

    /* 12 */ {
      id: "p9t12",
      title: "AWS Route 53",
      subtitle:
        "Amazon's DNS service — the phone book that routes global traffic.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Route 53</strong> is AWS’s DNS service plus intelligent traffic routing. Normal DNS says “shopkart.com is at 1.2.3.4” and that’s it. Route 53 goes further: it checks if 1.2.3.4 is healthy, routes based on user location for lowest latency, can split traffic 90/10 between two versions, and automatically fails over to a backup region when the primary is down. ShopKart uses latency-based routing to send Indian users to Mumbai (ap-south-1) and SE Asian users to Singapore (ap-southeast-1).</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "Routing Policies & ShopKart Usage",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌏 Latency-Based Routing</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Route 53 measures latency from each region to different user populations. User in Delhi → Route 53 routes to ap-south-1 Mumbai ALB (8ms). User in Jakarta → ap-southeast-1 Singapore ALB (12ms). Same domain: <code>api.shopkart.com</code> resolves to different IPs for different users automatically.</p>
    <div style="margin-top:8px;font-size:12px;color:var(--accent);font-weight:600;">📌 Use for: Multi-region deployments targeting latency-sensitive APIs</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🛑 Failover Routing</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Route 53 health check hits <code>api.shopkart.com/health</code> every 10 seconds. If Mumbai ALB returns unhealthy 3 times in a row → Route 53 automatically switches DNS to Singapore backup region. TTL 15 seconds means 97% of users are rerouted within 30 seconds of a region failure. Zero manual intervention needed.</p>
    <div style="margin-top:8px;font-size:12px;color:#10b981;font-weight:600;">📌 Use for: Active-passive disaster recovery across regions</div>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚖️ Weighted Routing — Canary Deployments</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Deploying new checkout service? Set: 95% traffic → old version, 5% → new version. Monitor error rates, p99 latency for 30 minutes. If all good: shift 50/50, then 100% to new. If bad: set 0% to new. Pure DNS-level traffic split, no code change on servers. ShopKart uses this for every major backend deployment.</p>
    <div style="margin-top:8px;font-size:12px;color:#8b5cf6;font-weight:600;">📌 Use for: Canary deployments, A/B testing at DNS level</div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Always use Alias records (not CNAME) to point your apex domain (shopkart.com) to an ALB or CloudFront. Alias records are free and faster than CNAME. Route 53 health checks must be configured for any failover or latency routing — without health checks, Route 53 routes to unhealthy endpoints. Keep TTL low (30☓60s) for endpoints that may change; use high TTL (1 day) for stable IPs.</span>
</div>`,
        },
      ],
    },

    /* 13 */ {
      id: "p9t13",
      title: "AWS Auto Scaling",
      subtitle:
        "Automatically adjusting capacity to maintain performance at lowest cost.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Auto Scaling</strong> watches your workload metrics and automatically adds or removes servers to match demand. Without it: you either over-provision (waste money at 3am) or under-provision (crash at Diwali peak). ShopKart auto-scales ECS tasks (application layer), RDS Read Replicas, and DynamoDB capacity independently. At normal load: 8 ECS tasks. Diwali 8pm peak: 50 ECS tasks. 3am: drops back to 5.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "Scaling Policies",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🎯 Target Tracking (Recommended)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Set a target (e.g., “keep average CPU at 60%”) and AWS automatically calculates how many instances to add or remove. Simple, effective, requires no manual threshold management. ShopKart Order Service: target CPU 65%, target memory 70%. Scale-out: 5 new tasks in 3 minutes when flash sale starts.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;font-size:12px;margin-top:6px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Fully automatic</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ AWS handles math</span>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📊 Step Scaling (Precise)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Define step adjustments: CPU 60–70% → add 2 tasks. CPU 70–85% → add 5 tasks. CPU &gt;85% → add 10 tasks immediately. More precise than target tracking for bursty workloads. ShopKart uses step scaling for the Product Search service, which sees sudden 100x traffic spikes when celebrity influencers post reviews.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📅 Scheduled Scaling (Predictable)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">ShopKart’s Diwali Sale: scheduled scale-up starts at 7:30 PM (30 min before sale goes live). Min: 20 tasks instead of normal 5. CloudFront pre-warms. RDS read replicas scaled out. By 8:00 PM when sale launch hits, infrastructure is already at full capacity — no 3-minute warmup delay during peak demand. Reactive scaling is too slow for known events.</p>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Always use Scheduled Scaling to pre-warm before known events (sales, lunch rush, end-of-month payroll). Combine with Target Tracking to handle the unpredictable variance. Set scale-in cooldown period (600 seconds) to avoid premature scale-in during bursty traffic. Always set a minimum of 2 instances across 2 AZs even at off-peak — single instance means single point of failure.</span>
</div>`,
        },
      ],
    },

    /* 14 */ {
      id: "p9t14",
      title: "AWS ELB (Elastic Load Balancer)",
      subtitle:
        "AWS's managed load balancers — three types for three use cases.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>ELB</strong> distributes incoming traffic across multiple healthy instances, eliminating single points of failure. Without a load balancer: all traffic hits one server, it crashes, the whole site is down. With ALB in front of ShopKart’s 20 ECS tasks: a single bad deployment on tasks 3 and 7 means ALB removes them from rotation and routes to the other 18 — users see zero downtime.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ALB vs NLB — When to Use Which",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">💡 ALB — Application Load Balancer (Layer 7)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Understands HTTP — can route based on URL path, hostname, headers, and query strings. ShopKart ALB rules: <code>/api/orders/*</code> → Order Service target group. <code>/api/products/*</code> → Product Service. <code>/api/search/*</code> → Search Service. <code>/*</code> → Frontend CloudFront origin. One load balancer, multiple microservices, no per-service DNS needed.</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:12px;margin-top:6px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Path/host routing</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ WebSocket support</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Built-in SSL termination</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Native ECS integration</span>
    </div>
    <div style="margin-top:8px;font-size:12px;color:var(--accent);font-weight:600;">📌 Use for: Web apps, REST APIs, microservices — 99% of use cases</div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚡ NLB — Network Load Balancer (Layer 4)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Routes TCP/UDP at Layer 4 — doesn’t inspect HTTP content. Extremely low latency (&lt;1ms), handles millions of requests per second. Supports static IP — useful for whitelisting in enterprise firewall rules. ShopKart uses NLB in front of the real-time WebSocket server for live order tracking (sub-millisecond overhead matters for 1M concurrent connections).</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:12px;margin-top:6px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Sub-millisecond latency</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Static IP address</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:2px 7px;border-radius:5px;">⚠️ No HTTP routing rules</span>
    </div>
    <div style="margin-top:8px;font-size:12px;color:#10b981;font-weight:600;">📌 Use for: Real-time gaming, WebSocket connections, static IP requirement, massive TPS</div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Default choice for microservices: ALB. Its path-based routing eliminates the need for separate load balancers per service, which would add significant cost. Only reach for NLB when you need static IP (enterprise firewall whitelisting), ultra-low latency (real-time trading, gaming), or non-HTTP protocols (raw TCP, custom protocol). Never use Classic LB for new projects.</span>
</div>`,
        },
      ],
    },

    /* 15 */ {
      id: "p9t15",
      title: "Regions & Availability Zones",
      subtitle:
        "Understanding AWS's global infrastructure for high availability.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">AWS organises its global footprint into <strong>Regions</strong> (geographic areas, e.g., ap-south-1 = Mumbai) and <strong>Availability Zones</strong> (isolated data centers within a region, e.g., ap-south-1a, 1b, 1c). Regions are completely independent — a nuclear disaster in Mumbai would not affect Singapore. AZs within a region are physically separate buildings with independent power and networking, connected by low-latency fiber (&lt;2ms). Deploying across 3 AZs gives 99.99% uptime even if one AZ has a total outage.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "Choosing a Region & Multi-AZ Design",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌏 Region Selection Criteria</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Latency</strong>: ShopKart’s primary users are in India → ap-south-1 (Mumbai). 15ms latency vs 200ms from us-east-1.</div>
      <div><strong>Data Residency</strong>: PDPB (India’s data protection) requires certain user data to stay in India → ap-south-1 mandatory for PII.</div>
      <div><strong>Service Availability</strong>: Not all services are in all regions. Check if needed services (e.g., Bedrock, SageMaker features) are available in the chosen region.</div>
      <div><strong>Cost</strong>: Regions differ by 10–40% in instance pricing. us-east-1 is cheapest; ap-south-1 is slightly more expensive.</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🏛️ Multi-AZ Design for ShopKart</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">ap-south-1 (Mumbai Region)<br/>├─ ap-south-1a: ALB + 3 ECS tasks + RDS Primary<br/>├─ ap-south-1b: ALB + 3 ECS tasks + RDS Standby<br/>└─ ap-south-1c: ALB + 2 ECS tasks + Read Replica<br/><br/>AZ-1a fails (power outage):<br/>└─ ALB health checks fail → removes 1a from rotation<br/>└─ RDS promotes 1b standby to primary in 90s<br/>└─ Traffic continues on 1b + 1c with 5 remaining tasks</div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Never deploy production in a single AZ. Minimum: 2 AZs for High Availability. Recommended: 3 AZs. Historical data: AWS has had AZ-level outages (us-east-1e, ap-northeast-1a). Single-AZ deployments went down for hours. Multi-AZ deployments saw zero impact. The cost difference between single-AZ and multi-AZ is 20–40% extra EC2 cost — trivial compared to revenue loss from downtime.</span>
</div>`,
        },
      ],
    },

    /* 16 */ {
      id: "p9t16",
      title: "AWS CloudWatch",
      subtitle: "Monitoring, logging, and alerting for all your AWS resources.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>CloudWatch</strong> is AWS’s built-in observability platform — it automatically collects metrics from every AWS service and lets you store application logs, create alarms, and build dashboards. Unlike external monitoring tools (Datadog, New Relic), CloudWatch has zero setup for AWS metrics and no extra cost for basic monitoring. ShopKart uses CloudWatch as its baseline observability layer for all AWS resources.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "Metrics, Logs & Alarms",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📊 Metrics (Automatic + Custom)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>EC2</strong>: CPU%, NetworkIn/Out, DiskRead/Write (free, 5 min granularity)</div>
      <div><strong>RDS</strong>: DB Connections, ReadLatency, FreeStorageSpace, ReplicaLag</div>
      <div><strong>ALB</strong>: RequestCount, HTTPCode_Target_5XX_Count, TargetResponseTime</div>
      <div><strong>Custom</strong>: ShopKart pushes <code>OrdersPerMinute</code>, <code>CheckoutConversionRate</code>, <code>P99_Checkout_Latency</code> via <code>PutMetricData</code> API</div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📝 Logs & CloudWatch Insights</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">All ECS tasks stream logs to CloudWatch Logs automatically via <code>awslogs</code> driver. CloudWatch Insights lets you query across billions of log lines with a SQL-like language. ShopKart on-call query to find all 500 errors in last hour:</p>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;color:var(--text-primary);">fields @timestamp, @message, orderId<br/>| filter @message like /ERROR 500/<br/>| sort @timestamp desc<br/>| limit 50</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🚨 Alarms → PagerDuty</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>P1 (Wake-up-at-3am)</strong>: 5xx rate &gt;5% for 2 consecutive 1-min periods → SNS → PagerDuty call</div>
      <div><strong>P2 (Slack alert)</strong>: p99 latency &gt;800ms for 5 min → SNS → #shopkart-alerts channel</div>
      <div><strong>Scaling trigger</strong>: CPU &gt;65% for 3 periods → ASG scale-out policy triggered</div>
      <div><strong>Budget alarm</strong>: Monthly AWS cost exceeds ₹12L → Finance + Engineering Slack alert</div>
    </div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Use CloudWatch as your baseline observability layer for AWS resources — it’s free and requires no setup. Add Datadog or Grafana on top for better dashboards, correlation, and APM tracing. The 3 mandatory alarms for every production service: (1) Error rate &gt;1%, (2) p99 latency &gt;2x SLO, (3) DLQ depth &gt;0. These three catch 90% of production incidents before users notice.</span>
</div>`,
        },
      ],
    },

    /* 17 */ {
      id: "p9t17",
      title: "AWS DynamoDB Basics",
      subtitle:
        "Amazon's fully managed NoSQL database — massively scalable key-value store.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>DynamoDB</strong> is AWS’s fully managed NoSQL database — key-value and document. Single-digit millisecond reads at any scale with no capacity planning. DynamoDB at 1M reads/sec costs an order of magnitude less than scaling RDS to the same load. ShopKart uses DynamoDB for user sessions, shopping cart snapshots, and flash sale inventory counters — workloads that are too high-frequency or too flexible-schema for RDS.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "Data Model & ShopKart Access Patterns",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🗺️ DynamoDB Data Model</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Table</strong>: Collection of items (no schema required)</div>
      <div><strong>Item</strong>: One record — any attributes you want (JSON-like)</div>
      <div><strong>Partition Key</strong>: Uniquely identifies item (or combined with Sort Key). This is the only dimension you can query for free — choose it carefully.</div>
      <div><strong>Sort Key</strong>: Secondary dimension — enables range queries, sorting within a partition</div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🛍️ ShopKart DynamoDB Tables</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">Sessions table:<br/>  PK: session_id = "abc-123" → O(1) lookup<br/>  ttl: 1704067200 (Unix timestamp, TTL auto-expires)<br/><br/>Cart table:<br/>  PK: user_id = "user-42"<br/>  SK: product_id = "prod-iphone15"<br/>  qty: 2, added_at: "2025-11-10T08:00Z"<br/>  Query: all cart items for user-42 = 1 fast query</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔄 DynamoDB vs RDS — Decision Matrix</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>✅ DynamoDB: Simple key/PK+SK access, access pattern known at design time, need 1M+ reads/sec, flexible schema per item, need TTL auto-expiry</div>
      <div>✅ RDS: Complex JOINs across multiple tables, ad-hoc queries from analytics/reporting, strong ACID transactions, schema needs to be enforced</div>
    </div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">The hardest thing about DynamoDB is designing the data model before you code, because you must know your access patterns upfront — unlike SQL where you can write any query after the fact. If you’re not certain of your access patterns yet, use RDS PostgreSQL. Migrate to DynamoDB when scale demands it and access patterns are stable.</span>
</div>`,
        },
      ],
    },

    /* 18 */ {
      id: "p9t18",
      title: "AWS Cost Optimization",
      subtitle:
        "Running at scale without burning money — the architect's responsibility.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Cloud cost optimization</strong> is the practice of aligning spending with actual resource usage. The average company wastes 32% of its cloud spend (Gartner, 2024). For ShopKart at ₹1.2 crore/month AWS spend, that’s ₹38 lakhs/month wasted. Cost is treated as a functional requirement — the 5th pillar of AWS’s Well-Architected Framework (next to security, reliability, performance, operational excellence).</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "Cost Optimization Playbook",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔍 Right-Sizing (Quick Wins)</div>
    <p style="margin:0 0 6px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">CloudWatch shows average CPU 12% on 5x m5.2xlarge → drop to m5.large (68% saving, zero impact). AWS Compute Optimizer analyses 14 days of usage and recommends exact instance types. ShopKart audit found ₹24L/month savings from right-sizing alone. Check every 6 months as traffic patterns evolve.</p>
    <div style="font-size:12px;color:var(--accent);font-weight:600;">📌 Effort: Low. Impact: High. Do this first.</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">💰 Pricing Tier Strategy</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>1-Year Reserved</strong>: ShopKart’s RDS + Redis baseline — 40% cheaper than On-Demand. Commit only for services you’ll definitely run for 12 months.</div>
      <div><strong>Savings Plans</strong>: EC2 + Lambda + Fargate baseline. Flexible (works across instance types). 30–45% cheaper.</div>
      <div><strong>Spot Instances</strong>: Batch ML training (recommendation model), image processing queues, nightly analytics. 70–90% cheaper. Must handle 2-minute interruption notice.</div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🧹 Storage Optimisation</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>S3 Lifecycle</strong>: Invoices: Standard → IA at 30d → Glacier at 90d. Saves ₹18L/year on 50TB of archival data.</div>
      <div><strong>CloudFront</strong>: Serving images via CloudFront is 40% cheaper per GB vs direct S3 egress.</div>
      <div><strong>EBS gp3 upgrade</strong>: 20% cheaper than gp2 with same or better performance. 1-click migration.</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔄 Auto Scaling & Kill Idle Resources</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>Scale ECS tasks down to 2 at 3am instead of keeping 20 running. Saving: 90% of compute cost during 8 off-peak hours.</div>
      <div>Schedule RDS dev/test instances to stop nights and weekends (saving 128 hrs/week ≈ 76% of their cost).</div>
      <div>AWS Cost Anomaly Detection alerts when spend spikes &gt;20% vs prior week. Catches developer accidentally spinning up p3.16xlarge GPU instances.</div>
    </div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;margin-bottom:12px;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Cost optimization is not a one-time project — it’s a continuous process. Every architecture decision has a cost dimension. Adding a NAT Gateway is ₹3.5/GB of data processed. Adding Multi-AZ doubles that RDS instance cost. These are right decisions — but you must know the cost. Set AWS Budgets with alerts at 80% and 100% of monthly budget so you never discover a 3x overrun at end-of-month billing.</span>
</div>`,
        },
      ],
    },
  ],
};

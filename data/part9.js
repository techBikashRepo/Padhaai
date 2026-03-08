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
          title: "Simple Explanation",
          body: `
<p><strong>Cloud computing</strong> = accessing computing resources (servers, storage, databases, networking) over the internet, paying only for what you use.</p>
<table class="compare-table"><thead><tr><th></th><th>On-Premises</th><th>Cloud</th></tr></thead><tbody>
<tr><td><strong>Upfront cost</strong></td><td>Buy servers ($50,000+)</td><td>$0 — pay as you use</td></tr>
<tr><td><strong>Scale</strong></td><td>Order hardware (weeks)</td><td>Spin up in seconds</td></tr>
<tr><td><strong>Maintenance</strong></td><td>Your team's job</td><td>Cloud provider's job</td></tr>
<tr><td><strong>Global reach</strong></td><td>Your data centers only</td><td>20+ regions worldwide instantly</td></tr>
<tr><td><strong>Reliability</strong></td><td>You manage redundancy</td><td>Built-in redundancy (99.99% SLA)</td></tr>
</tbody></table>`,
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
<div class="diagram-box">              You manage →     Cloud manages
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
          title: "Core Concepts",
          body: `
<p><strong>EC2</strong> (Elastic Compute Cloud) = virtual machines on AWS. You choose CPU/RAM/storage, pick an OS, and have a server running in minutes.</p>
<div class="diagram-box">Instance types:
  t3.micro      — 2 vCPU,  1 GB RAM  — dev/test
  m5.large      — 2 vCPU,  8 GB RAM  — general purpose
  c5.2xlarge    — 8 vCPU, 16 GB RAM  — compute-heavy
  r5.4xlarge    — 16 vCPU, 128 GB RAM — memory-heavy (DB)

Purchasing options:
  On-Demand      — Pay by the second. Most flexible.
  Reserved       — 1-3 year commitment. Up to 72% cheaper.
  Spot           — Bid for unused capacity. Up to 90% cheaper. Can be interrupted!
  Savings Plans  — Flexible discount for committed usage

Auto Scaling Group:
  Define: min 2 instances, max 20 instances
  Rule: if CPU > 70% for 5 min → add 2 instances
        if CPU < 30% for 10 min → remove 1 instance
  Result: scales automatically with traffic!</div>`,
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
          title: "What It Is",
          body: `
<p><strong>S3</strong> (Simple Storage Service) stores any file as an "object" with a unique key (path). 99.999999999% (11 nines) durability. Unlimited storage. Pay per GB stored + data transfer.</p>
<div class="diagram-box">Common Amazon S3 use cases:
  ✅ Product images:    s3://amazon-images/products/iphone15-front.jpg
  ✅ User uploads:      s3://amazon-uploads/users/42/profile.jpg
  ✅ Order invoices:    s3://amazon-invoices/2025/03/order-456.pdf
  ✅ App bundles:       s3://amazon-builds/app/v2.1.0.zip
  ✅ Static websites:   s3://amazon-cdn/static/           ← Host HTML/CSS/JS
  ✅ Data lake:         s3://amazon-analytics/events/2025/ ← 10PB of logs

S3 Storage Classes:
  Standard       — Frequent access. Low latency.
  Infrequent     — Cheaper. 30-day min. For archived data.
  Glacier        — Very cheap. For archiving. Retrieval: hours.

Access: Pre-signed URLs for temporary access. S3 policies for permanent.</div>`,
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
          title: "What RDS Gives You",
          body: `
<p><strong>RDS</strong> (Relational Database Service) runs PostgreSQL, MySQL, Aurora, Oracle, or SQL Server, fully managed. AWS handles: OS patches, DB updates, automated backups, failover, monitoring.</p>
<div class="diagram-box">You stop managing:
  ❌ OS updates on the DB server
  ❌ Database version patching
  ❌ Manual backups
  ❌ Replication setup

You focus on:
  ✅ Schema design
  ✅ Query optimization
  ✅ Selecting instance type

RDS Multi-AZ:
  Primary DB in us-east-1a
  Standby replica in us-east-1b (synchronous replication)
  Primary fails → automatic failover in 60-120 seconds
  Zero data loss (synchronous = no lag)

RDS Read Replicas:
  Add up to 15 read replicas → distribute read traffic
  Cross-region replicas for global apps</div>`,
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
          title: "Overview",
          body: `
<p><strong>ElastiCache</strong> = managed Redis or Memcached. Deploy a Redis cluster in minutes. AWS handles: replication, failover, patching, monitoring, backups.</p>
<div class="diagram-box">ElastiCache Redis cluster modes:
  Single-node      — Dev/test. No redundancy.
  Cluster Mode OFF — 1 primary + up to 5 replicas. Simple.
  Cluster Mode ON  — Data sharded across up to 500 nodes. Massive scale.

Typical patterns with ElastiCache:
  Sessions:    Store user sessions (TTL 24h)
  Cache:       Product listings, user data, computed results
  Rate limit:  Track API request counts
  Leaderboard: Sorted sets for real-time rankings
  Queue:       Simple job queues with Redis Lists

Connection via: endpoint URL in env variable.
  REDIS_URL=redis://my-cache.abc123.cache.amazonaws.com:6379</div>`,
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
          title: "SQS Queues",
          body: `
<div class="diagram-box">SQS Queue types:
  Standard Queue:
    → At-least-once delivery (may deliver duplicate messages — design for idempotency!)
    → Best-effort ordering (not strictly ordered)
    → Unlimited throughput
    → Use for most decoupling use cases
    
  FIFO Queue:
    → Exactly-once delivery (no duplicates)
    → First-in, first-out ordering guaranteed
    → Up to 3000 messages/second
    → Use for orders, payments (order matters!)

Dead Letter Queue (DLQ):
  If a message fails processing X times (e.g., 5) → moved to DLQ
  DLQ lets you: inspect failed messages, debug, retry manually
  Never lose failed messages silently!</div>`,
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
          title: "What Is Serverless?",
          body: `
<p><strong>Lambda</strong> = upload a function, AWS runs it when triggered, you pay only for execution time (~$0.20 per 1 million executions). No servers to manage, no idle cost.</p>
<div class="diagram-box">Lambda function example (resize product images):
  
  Trigger: S3 event (new image uploaded)
  Function: 
    exports.handler = async (event) => {
      const bucket = event.Records[0].s3.bucket.name;
      const key = event.Records[0].s3.object.key;
      // resize image to 800x800 and thumbnail 200x200
      // save back to S3
    };
  
  Pricing: Pay only when function runs. 0 requests = $0 cost!
  Scales: Automatically. 1000 concurrent uploads = 1000 parallel Lambda invocations.

Common triggers:
  API Gateway → Lambda (serverless REST API)
  S3 → Lambda (process uploads)
  SQS → Lambda (process queue messages)
  CloudWatch Events → Lambda (scheduled jobs / cron)</div>`,
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
          title: "How CloudFront Works",
          body: `
<div class="diagram-box">Without CDN (origin server in Mumbai):
  User in Tokyo → request → Mumbai server (180ms round trip)
  User in London → request → Mumbai server (200ms round trip)

With CloudFront CDN:
  User in Tokyo → nearest edge location (Tokyo!) → cached content → 5ms! ✅
  User in London → London edge location → 4ms! ✅
  
  On cache MISS: Edge → Origin (Mumbai) → cache response → future requests: 5ms

CloudFront + S3 setup:
  S3 stores original images
  CloudFront serves cached copies from 450+ global locations
  78% of Amazon product image requests served from CDN edge nodes (never hit origin!)

CloudFront also does:
  DDoS protection (AWS Shield)
  HTTPS termination at edge
  Header injection, URL rewrites
  WAF (Web Application Firewall) integration</div>`,
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
          title: "VPC Concepts",
          body: `
<div class="diagram-box">VPC (Virtual Private Cloud) = your private isolated network in AWS.
  
  Without VPC: All your services are on the public internet. Dangerous!
  With VPC: Services communicate on private internal network. External access controlled.

Key components:
  Public Subnet:  Resources with internet access (Load Balancers, Bastion hosts)
  Private Subnet: Resources with NO direct internet (App servers, DB servers)
  Internet Gateway: Allows public subnet → internet
  NAT Gateway: Allows private subnet → internet (outbound only, for updates)
  Security Groups: Instance-level firewall (which ports/IPs allowed in/out)

Architecture:
  Internet → ALB (public subnet) → App Servers (private subnet) → RDS (private subnet)
  External traffic ONLY reaches load balancer. DB is never directly internet-accessible! ✅</div>`,
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
          title: "IAM Concepts",
          body: `
<div class="diagram-box">IAM Users:  Individual AWS accounts (for humans)
IAM Groups: Collection of users (e.g., "developers", "ops")
IAM Roles:  Temporary permissions assumed by services (EC2, Lambda, etc.)
IAM Policies: JSON documents defining permissions

Example policy (developer):
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::amazon-uploads/*"
  }]
}

Principle of Least Privilege:
  Lambda function that reads from S3? Give it only s3:GetObject on that specific bucket.
  NEVER use root credentials. Never give services admin access.

EC2 Role example:
  App server needs to read from S3 → attach IAM Role with S3 read permission
  No hardcoded credentials in code! Credentials rotate automatically. ✅</div>`,
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
          title: "What Route 53 Does",
          body: `
<div class="diagram-box">Route 53 = DNS service + Traffic routing + Health checks

DNS Records:
  A Record:     amazon.com → 13.32.99.104  (maps domain to IP)
  CNAME:        www.amazon.com → amazon.com  (alias)
  Alias Record: amazon.com → ALB DNS name (AWS-specific, works for apex domain)

Routing Policies:
  Simple:      amazon.com → single IP
  Failover:    Primary: us-east-1 ALB | Secondary: us-west-2 ALB (if primary unhealthy)
  Latency:     Route user to lowest-latency region automatically
  Geolocation: India users → Mumbai region | US users → Virginia region
  Weighted:    90% traffic → production, 10% → new version (canary deployment!)

Health Checks:
  Route 53 health-checks your endpoints every 10s.
  Unhealthy → automatically routes to healthy endpoint.
  Zero-downtime failover!</div>`,
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
          title: "Auto Scaling in Practice",
          body: `
<div class="diagram-box">Auto Scaling Group configuration:
  Min: 2 instances    ← always running for redundancy
  Max: 50 instances   ← cost ceiling
  Desired: 4 instances ← current target

Scaling Policies:
  Target Tracking (simplest):
    "Keep average CPU at 60%"
    AWS automatically calculates when to add or remove instances.

  Step Scaling:
    CPU 60-70% → add 1 instance
    CPU 70-85% → add 3 instances  
    CPU > 85%  → add 5 instances

  Scheduled Scaling:
    Every day at 9 AM → scale up to 10 instances (business hours)
    Every day at 8 PM → scale down to 3 instances (off-peak)

Warm-up period: New instances take 2-3 min to be ready.
Configure "instance warmup" to prevent premature scale-in decisions.</div>`,
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
          title: "Three Types",
          body: `
<table class="compare-table"><thead><tr><th>Type</th><th>Operates At</th><th>Best For</th></tr></thead><tbody>
<tr><td><strong>ALB</strong> (Application)</td><td>Layer 7 (HTTP/HTTPS)</td><td>Web apps, microservices, path-based routing (/api → backend, / → frontend)</td></tr>
<tr><td><strong>NLB</strong> (Network)</td><td>Layer 4 (TCP/UDP)</td><td>Ultra-low latency, millions of req/sec, static IP needed</td></tr>
<tr><td><strong>CLB</strong> (Classic)</td><td>Layer 4+7</td><td>Legacy. Don't use for new projects.</td></tr>
</tbody></table>
<div class="diagram-box">ALB path-based routing:
  amazon.com/api/products → Product Service target group
  amazon.com/api/orders   → Order Service target group  
  amazon.com/api/search   → Search Service target group
  amazon.com/*            → Frontend static files (S3)
  
All from ONE load balancer entry point! Saves cost.</div>`,
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
          title: "Geography",
          body: `
<div class="diagram-box">AWS Global Infrastructure:

REGION = geographic area
  e.g., us-east-1 (N. Virginia), ap-south-1 (Mumbai), eu-west-1 (Ireland)
  AWS has 30+ regions worldwide.
  Data residency: GDPR compliance → EU regions for EU data.
  Choose region: close to users (low latency) + compliance + service availability.

AVAILABILITY ZONE (AZ) = data center within a region
  Each region has 2-6 AZs.
  AZs are physically separated (different buildings, power, networking).
  Fiber-connected with <2ms latency between them.
  
  us-east-1 has: us-east-1a, us-east-1b, us-east-1c, us-east-1d, us-east-1e

HIGH AVAILABILITY PATTERN:
  Deploy across 3 AZs.
  One AZ floods/catches fire? The other 2 keep serving traffic.
  RDS Multi-AZ: Primary in 1a, Standby in 1b → automatic failover if 1a goes down.</div>`,
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
          title: "What CloudWatch Does",
          body: `
<div class="diagram-box">Metrics: Numeric time-series data
  EC2: CPU%, NetworkIN, DiskRead
  RDS: DB Connections, Read/Write Latency, FreeStorageSpace
  ALB: Request Count, 4xx/5xx Error Count, Target Response Time
  Lambda: Duration, Errors, Throttles

Logs: Centralized log storage + search
  App logs → CloudWatch Logs Groups
  Query with CloudWatch Insights: 
    fields @timestamp, @message | filter @message like /ERROR/ | limit 20

Alarms: Trigger actions on threshold breach
  CPU > 80% for 5 minutes → SNS notification → PagerDuty alert → on-call wakes up!
  5xx errors > 100/minute → trigger auto-scaling → add instances

Dashboards: Custom real-time visualizations
  Build a "health dashboard" showing all key metrics at a glance.</div>`,
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
          title: "Core Concepts",
          body: `
<div class="diagram-box">DynamoDB = NoSQL (key-value + document). No fixed schema. Auto-scales.

Concepts:
  Table:              collection of items (like a DB table)
  Item:               one record (like a row) — can have different attributes per item
  Partition Key:      required. Uniquely identifies item (or combined with Sort Key).
  Sort Key:           optional. Enables range queries within a partition.

Example: Sessions table
  Partition Key: session_id (e.g., "abc-123")
  Attributes: user_id, data, created_at, expires_at
  
  GetItem(session_id="abc-123")  → O(1)! Instant lookup regardless of table size.

Example: Order history
  Partition Key: user_id
  Sort Key:      created_at
  → Get all orders for user 42, sorted by time: efficient!
  → Query: user_id = 42 AND created_at between "2025-01-01" and "2025-03-31"

DynamoDB vs RDS:
  Use DynamoDB: Simple lookup by key, massive scale, flexible schema, single-digit ms latency
  Use RDS:      Complex queries, JOINs, reporting, relational data</div>`,
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
          title: "Key Strategies",
          body: `
<div class="key-list">
  <div class="key-item"><div class="key-bullet">1</div><div><strong>Right-size instances</strong> — Don't run m5.4xlarge if m5.large handles the load. Use CloudWatch CPU metrics to find oversized instances.</div></div>
  <div class="key-item"><div class="key-bullet">2</div><div><strong>Use Spot Instances</strong> — For stateless, fault-tolerant workloads (batch jobs, rendering): 90% cheaper. Use Reserved for stable baseline.</div></div>
  <div class="key-item"><div class="key-bullet">3</div><div><strong>S3 Lifecycle Policies</strong> — Move old data to cheaper storage classes: Standard → Infrequent (30 days) → Glacier (90 days). Automate with S3 lifecycle rules.</div></div>
  <div class="key-item"><div class="key-bullet">4</div><div><strong>Auto Scaling</strong> — Don't keep 20 instances running at 3 AM. Scale down to 2 when traffic drops. Only pay for what you need.</div></div>
  <div class="key-item"><div class="key-bullet">5</div><div><strong>CloudFront for S3</strong> — Serving from CloudFront is cheaper than S3 direct transfer costs AND faster for users. Double win.</div></div>
  <div class="key-item"><div class="key-bullet">6</div><div><strong>RDS vs DynamoDB</strong> — For simple key lookups, DynamoDB on-demand pricing can be cheaper than running an RDS instance 24/7.</div></div>
</div>`,
        },
      ],
    },
  ],
};

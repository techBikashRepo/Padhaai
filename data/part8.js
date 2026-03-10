/* Part 8 — Async Patterns & Distributed Systems (10 topics) — Deep Rewrite */
const PART8 = {
  id: "part8",
  icon: "🔄",
  title: "Part 8",
  name: "Async & Distributed Patterns",
  topics: [
    {
      id: "p8t1",
      title: "Sync vs Async Communication",
      subtitle:
        "The foundational choice for every service interaction — wait for the answer, or fire and move on.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:14px;"><strong>Synchronous communication</strong>: the caller sends a request and <em>waits</em> for the response before continuing. HTTP REST, gRPC, and database queries are synchronous. <strong>Asynchronous communication</strong>: the caller sends a message and continues immediately — no waiting. Message queues (Kafka, SQS) are asynchronous. The choice between sync and async shapes your system’s latency, reliability, and coupling.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Checkout: Sync vs Async",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">⏱️ Synchronous (Rahul waits for these in 3-second window)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>1. Validate cart items exist &nbsp;<span style="color:#22c55e;">→ 100ms</span></div>
      <div>2. Reserve stock in inventory &nbsp;<span style="color:#22c55e;">→ 80ms</span></div>
      <div>3. Calculate price with discounts &nbsp;<span style="color:#22c55e;">→ 10ms</span></div>
      <div>4. Charge Razorpay &nbsp;<span style="color:#22c55e;">→ 400ms</span></div>
      <div>5. Write order record to PostgreSQL &nbsp;<span style="color:#22c55e;">→ 20ms</span></div>
      <div>6. Return “Order Placed!” to Rahul &nbsp;<strong>→ Total ~620ms</strong></div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">💌 Asynchronous (happens after Rahul sees “Order Placed!”)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>7. Send confirmation email — 200ms (not Rahul’s problem)</div>
      <div>8. Send SMS notification — 300ms (ditto)</div>
      <div>9. Update Elasticsearch search index — 800ms (slow)</div>
      <div>10. Calculate loyalty points — 100ms</div>
      <div>11. Notify seller dashboard — 150ms</div>
      <div>12. Generate invoice PDF — 2,000ms (heavy)</div>
    </div>
    <div style="margin-top:10px;padding:8px 10px;background:rgba(245,158,11,0.08);border-radius:6px;font-size:12px;color:#f59e0b;">⚠️ If these were synchronous: checkout takes 620 + 3,750 = 4,370ms. Terrible UX. Async queues all 6 post-order tasks. Zero wait for Rahul.</div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Use sync for operations that directly affect what you show the user and must succeed before returning (payment, cart validation). Use async for everything else (email, analytics, notifications, PDF generation). The test: “Does the user care if this happens in the next 30 seconds vs the next 30 milliseconds?” If no — make it async.</span>
</div>`,
        },
      ],
    },

    {
      id: "p8t2",
      title: "Background Jobs",
      subtitle:
        "Moving expensive, non-urgent work out of the request-response cycle.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">A <strong>background job</strong> executes outside of the HTTP request-response cycle. When a user action triggers expensive work, the API enqueues a job and returns immediately. A separate <strong>worker process</strong> picks it up and runs it independently. The user never waits. ShopKart uses Bull + Redis for its job queue — managing email sending, PDF generation, ML model updates, and nightly analytics batches.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Job Queue Architecture",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📥 Job Categories</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Immediate</strong>: Triggered right after user action. Order confirmation email (expected &lt;30s). Payment receipt. Stock reserve notification.</div>
      <div><strong>Scheduled</strong>: Cron-based. Daily deals email at 8am. Abandoned cart reminder at 24hr mark. Weekly seller reports.</div>
      <div><strong>Batch</strong>: Large dataset processing. Nightly ML recommendation model training. Monthly tax invoice generation for 2M orders. Search index full rebuild.</div>
      <div><strong>Retry</strong>: Failed jobs. Retried with exponential backoff (1min, 5min, 15min). After 3 failures → DLQ + alert.</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚖️ Independent Worker Scaling</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Email workers: 5 instances, 10 concurrent each → 50 emails/sec. PDF workers: 2 instances, 2 concurrent (CPU heavy, 1-2 sec each). Diwali spike: email queue grows to 50K messages → auto-scale email workers to 20 instances → drain in 5 minutes. PDF workers stay at 2 (sellers don’t query invoices during a sale). No impact on API server capacity.</p>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">“Background jobs keep our API p99 under 500ms even during Diwali. Post-order processing (email, PDF, ML updates) could take 5–30 seconds — none of that is in Rahul’s checkout path. Bull with Redis gives us job persistence, retry logic, priority queues, and a dashboard (Bull Board) to monitor queue depth and failure rates in real time.”</span>
</div>`,
        },
      ],
    },

    {
      id: "p8t3",
      title: "Event-Driven Architecture",
      subtitle:
        "System design where services communicate through events, not direct calls.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">In <strong>event-driven architecture</strong>, when something meaningful happens (order placed, payment received, item shipped), the service that detected it publishes an <strong>event</strong> to a message broker. Other services that care about that event subscribe and react independently. The Order Service doesn’t know (or care) whether the Email Service, Inventory Service, or Analytics Service exist. This is loose coupling in action.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Traditional vs Event-Driven",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">❌ Traditional (tight coupling — direct calls)</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">// Order Service must know about ALL downstream services<br/>await emailService.send(orderId); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← direct call<br/>await inventoryService.decrement(items); &nbsp;← direct call<br/>await analyticsService.track(orderId); &nbsp;&nbsp;← direct call<br/>await loyaltyService.addPoints(userId); &nbsp;← direct call</div>
    <div style="margin-top:8px;font-size:12px;color:#ef4444;">LoyaltyService down for maintenance → Orders fail. Adding RecommendationService → edit OrderService code.</div>
  </div>
  <div style="padding:14px 16px;background:rgba(34,197,94,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">✅ Event-Driven (publish and forget)</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">await orderRepo.save(order);<br/>await eventBus.publish('order.placed', { orderId, userId, items });<br/>return order; // done. Order Service knows nothing about who subscribes.</div>
    <div style="margin-top:8px;font-size:13px;color:var(--text-primary);opacity:0.85;">
      Email Service → subscribes to ‘order.placed’ → sends email<br/>
      Inventory Service → subscribes → decrements stock<br/>
      Analytics Service → subscribes → records event<br/>
      Adding ReferralBonusService? → just subscribe it. Zero changes to Order Service.
    </div>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">“When Rahul places an order, Order Service publishes ‘order.placed’ to Kafka and is done. Email, inventory, loyalty services consume at their own pace. If Email Service is down for 5 minutes, events queue up and are processed on recovery. Zero data loss, zero coupling. The Order Service has no knowledge of how many downstream services consume its events.”</span>
</div>`,
        },
      ],
    },

    {
      id: "p8t4",
      title: "Pub/Sub Pattern",
      subtitle:
        "Publishers broadcast messages to topics; subscribers receive messages they care about.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Pub/Sub</strong> (Publish/Subscribe): <strong>publishers</strong> send messages to a named <strong>topic</strong> without knowing who will receive them. <strong>Subscribers</strong> declare interest in specific topics and receive all published messages. Publishers and subscribers are completely decoupled. Kafka, AWS SNS, Google Pub/Sub implement this. ShopKart’s <code>order-events</code> Kafka topic has 5 independent subscriber services.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Kafka Consumer Groups in ShopKart",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">📬 Topic: <code style="font-size:12px;">order-events</code> (20 partitions)</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">Consumer Group: "email-workers"<br/>&nbsp;&nbsp;← reads from 'order-events' at its own pace<br/>&nbsp;&nbsp;← has independent offset cursor (own progress pointer)<br/><br/>Consumer Group: "inventory-workers"<br/>&nbsp;&nbsp;← reads from SAME 'order-events'<br/>&nbsp;&nbsp;← independent of email-workers<br/><br/>Consumer Group: "analytics-workers"<br/>&nbsp;&nbsp;← can lag 2 hours behind — analytics doesn't need real-time<br/>&nbsp;&nbsp;← when it recovers from downtime: replays from saved offset</div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📚 ShopKart Kafka Topics</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><code>order-events</code>: 20 partitions, 7-day retention. Partitioned by orderId.</div>
      <div><code>user-events</code>: 10 partitions, 30-day retention. Partitioned by userId.</div>
      <div><code>product-events</code>: 10 partitions, 7-day retention. Partitioned by productId.</div>
      <div><code>payment-events</code>: 10 partitions, 365-day retention (audit). Partitioned by paymentId.</div>
      <div style="margin-top:6px;color:#10b981;font-size:12px;">📌 20 partitions = 20 consumer instances can consume in parallel per consumer group</div>
    </div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Partition key choice determines message ordering. Partition by <code>orderId</code> guarantees all events for one order are processed in sequence by the same consumer. If you partition by <code>userId</code>, an active buyer’s events might overload one partition (hot partition problem). Always choose a partition key with high cardinality and even distribution.</span>
</div>`,
        },
      ],
    },

    {
      id: "p8t5",
      title: "Message Queues",
      subtitle:
        "Reliable async task delivery between producers and consumers with guaranteed processing.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">A <strong>message queue</strong> is a persistent buffer that holds tasks or commands until a consumer processes them. Unlike Pub/Sub (each subscriber group gets every message), a queue delivers each message to exactly one consumer. If processing fails, the message is retried or sent to a dead-letter queue. AWS SQS, RabbitMQ are message queues.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Queue vs Pub/Sub & SQS Email Queue",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔄 Message Queue vs Pub/Sub</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>Queue</strong>: Competing consumers. One message → one consumer. Task distribution: “process this email once.”</div>
      <div><strong>Pub/Sub</strong>: All subscriber groups get every message. Event broadcast: “order was placed” → 5 services all process it.</div>
      <div><strong>ShopKart</strong>: Email SQS queue (one email sent once) + Kafka order-events topic (5 services each process every order).</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">💌 SQS Email Queue — Diwali Scale</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">500,000 orders in 1 hour → 500,000 confirmation emails needed. Without queue: API calls SendGrid directly, hits rate limit (10 concurrent max) → 50,000 seconds to send all emails. With SQS: Order Service sends to queue in 5ms (returns to user immediately). 30 worker instances × 10 concurrent = 300 emails/sec → all emails sent in 28 minutes. SendGrid down for 20 min? Messages safely wait in SQS queue, delivered on recovery. Zero data loss.</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Absorbs traffic spikes</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Survives downstream failure</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Auto retries via DLQ</span>
    </div>
  </div>
</div>`,
        },
      ],
    },

    {
      id: "p8t6",
      title: "Retry Mechanisms",
      subtitle:
        "Automatically re-attempting failed operations — making distributed systems self-healing.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">In distributed systems, network calls fail transiently — brief network hiccups, momentary service restarts, temporary overload. A <strong>retry mechanism</strong> automatically re-attempts a failed operation after a brief wait. Most transient failures resolve within a few seconds. Retries transform “occasional error” into “invisible hiccup” from the user’s perspective.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "What’s Retryable vs Not",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Safe to Retry (transient errors)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>HTTP 429 Too Many Requests — rate limited, wait and retry</div>
      <div>HTTP 503 Service Unavailable — service restarting</div>
      <div>HTTP 504 Gateway Timeout — temporary timeout</div>
      <div>Connection refused — service briefly down</div>
      <div style="margin-top:4px;font-size:12px;color:#22c55e;">These are transient. The operation hasn’t happened. Safe to retry.</div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">❌ Not Safe to Retry (without idempotency)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>HTTP 400 Bad Request — invalid request, retrying won’t help</div>
      <div>HTTP 401 Unauthorized — wrong credentials, retrying won’t help</div>
      <div>Payment charge (retry = double charge!)</div>
      <div>HTTP 422 Insufficient Inventory — out of stock, retrying won’t fix it</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔄 ShopKart Payment Retry Implementation</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">for (let attempt = 1; attempt &lt;= 3; attempt++) {<br/>&nbsp;&nbsp;try {<br/>&nbsp;&nbsp;&nbsp;&nbsp;const charge = await stripe.paymentIntents.create({<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;amount, idempotencyKey: \`order-\${orderId}\`, // safe retry<br/>&nbsp;&nbsp;&nbsp;&nbsp;});<br/>&nbsp;&nbsp;&nbsp;&nbsp;return charge;<br/>&nbsp;&nbsp;} catch (err) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;if (isNonRetryable(err)) throw err; // card_declined, etc.<br/>&nbsp;&nbsp;&nbsp;&nbsp;await sleep(exponentialBackoff(attempt)); // 1s, 2s, 4s<br/>&nbsp;&nbsp;}<br/>}</div>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">“For GET requests: always retry. For POST/PUT: only retry with idempotency keys. We use a shared retry library with exponential backoff + jitter. Monitoring retry rates is useful — a spike in payment retries signals Razorpay is having issues, helping us decide whether to show a degraded checkout with a fallback gateway.”</span>
</div>`,
        },
      ],
    },

    {
      id: "p8t7",
      title: "Exponential Backoff",
      subtitle:
        "Progressively increasing retry delays — preventing cascading failures and respecting service limits.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Exponential backoff</strong>: each retry waits progressively longer: 1st retry after 1 second, 2nd after 2 seconds, 3rd after 4 seconds. This gives the failing service time to recover without being hammered. <strong>Jitter</strong> (randomized delay) prevents multiple clients from retrying simultaneously, avoiding a thundering herd (all clients hammering the recovering service at exactly the same moment).</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Backoff with Jitter — Why It Matters",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚠️ Without Jitter (Thundering Herd)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">100 Order Service instances all fail at t=0 when Inventory Service crashes. All retry at exactly t=1s, t=2s, t=4s simultaneously. At t=1: 100 simultaneous requests hit a recovering service. This prevents it from recovering. Service crashes again. Infinite restart loop.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ With Full Jitter (AWS Recommendation)</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">// Capped exponential backoff with full jitter<br/>const delay = Math.random() * Math.pow(2, attempt) * 1000;<br/>const cappedDelay = Math.min(delay, 32000); // max 32s cap<br/><br/>Client A: retries at 0.7s, 1.8s, 5.2s...  (random)<br/>Client B: retries at 1.2s, 2.4s, 4.8s...<br/>Client C: retries at 0.9s, 1.6s, 4.1s...</div>
    <p style="margin:10px 0 0;font-size:12px;color:#22c55e;">Effect: 100 retries spread across 0.5–1.5 seconds. Service recovers with breathing room.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">☁️ AWS SDKs: Free Built-In Backoff</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">All AWS SDKs (DynamoDB, S3, SQS, SNS) implement full jitter exponential backoff automatically. ShopKart gets this for free for all AWS service calls without writing any retry code. Only need custom retry logic for non-AWS services (Razorpay, Twilio, Elasticsearch).</p>
  </div>
</div>`,
        },
      ],
    },

    {
      id: "p8t8",
      title: "Circuit Breaker",
      subtitle:
        "Automatically stopping calls to a failing service to prevent cascading failures.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">A <strong>Circuit Breaker</strong> monitors calls from Service A to Service B. When failure rate exceeds a threshold, the circuit “opens” — all subsequent calls immediately return an error without attempting Service B. This prevents Rahul’s checkout from hanging for 30 seconds waiting for a dead Recommendation Service. After a cooldown, the circuit “half-opens” and tests one call. If it succeeds, the circuit closes and normal operation resumes.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Circuit Breaker States & ShopKart Example",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🟢 CLOSED → OPEN → HALF-OPEN State Machine</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>CLOSED</strong>: Normal. All calls go to Service B. Failure counter tracks errors.</div>
      <div><strong>OPEN</strong>: &gt;50% failures in last 10 calls → circuit opens. Calls fail immediately. No attempt to reach Service B. Returns fallback value.</div>
      <div><strong>HALF-OPEN</strong>: After 30s cooldown, allow 1 test call. Success → CLOSED. Failure → back to OPEN for another 30s.</div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🛡️ ShopKart Product Page with Fallback</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">const recBreaker = new CircuitBreaker(getRecommendations, {<br/>&nbsp;&nbsp;timeout: 3000, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 3s call timeout<br/>&nbsp;&nbsp;errorThresholdPercentage: 50, // open at 50% failure<br/>&nbsp;&nbsp;resetTimeout: 30000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// try half-open after 30s<br/>});<br/>recBreaker.fallback(() =&gt; getCachedPopularProducts());<br/><br/>// If circuit is OPEN: immediately returns cached popular products<br/>// User sees "Popular Products" instead of personalized recs<br/>// Page still loads fast. No error shown.</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">💥 Cascading Failure (Without Circuit Breaker)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Recommendation service is slow (5s responses). All product pages wait 5s. Blocks 5× more threads. Thread pool fills. Product page requests also start timing out. All requests fail. ShopKart is down — because the recommendation service (non-critical feature) was slow. Circuit breakers contain failure to one service.</p>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">“Every external call is wrapped in a circuit breaker with a fallback. Razorpay down? Use cached payment form. Recommendation service down? Show popular items. The principle: critical path (checkout, payment) must never depend on non-critical services (recommendations, reviews). We define SLOs per service and configure circuit breaker thresholds to match.”</span>
</div>`,
        },
      ],
    },

    {
      id: "p8t9",
      title: "Rate Limiting",
      subtitle:
        "Controlling how many requests a client can make in a time window — protecting your system from abuse.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Rate limiting</strong> restricts how many requests a client (identified by IP, user ID, or API key) can make within a time window. Exceeding the limit returns HTTP 429 Too Many Requests. Rate limiting protects against abuse (scraping, DDoS), ensures fair resource allocation among users, and prevents a buggy client from accidentally overloading the server.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Algorithms & ShopKart Tiers",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🪙 Token Bucket (Recommended)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Bucket capacity: 100 tokens. Refill rate: 10 tokens/sec. Each request consumes 1 token. Rahul browsing: 2–3 tokens/sec → bucket stays full. Bot script: consumes 100 tokens in 0.1 sec → bucket empty → throttled. After throttle: bucket refills at 10/sec → normal browsing resumes in 10 sec. Handles intentional bursts while smoothing sustained abuse.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📊 ShopKart Rate Limit Tiers (Kong API Gateway)</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">Anonymous (per IP):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100 req/min<br/>Authenticated user:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;600 req/min<br/>Premium seller API key:&nbsp;&nbsp;&nbsp;&nbsp;10,000 req/min<br/>Checkout endpoint (userId):&nbsp;5 req/min &nbsp;&nbsp;// card testing protection<br/>Search endpoint (per IP):&nbsp;&nbsp;&nbsp;200 req/min // Elasticsearch is expensive</div>
    <p style="margin-top:10px;font-size:12px;color:var(--text-primary);opacity:0.8;">Redis implementation: <code>INCR rate_limit:userId:minuteBucket</code>, <code>EXPIRE 60</code>. Centralised Redis ensures all 20 API servers share the same counter.</p>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">“Rate limiting in a distributed system requires a centralised counter — Redis. If each server had its own counter, a user could get 20× the limit (one per server). We use Redis INCR + EXPIRE for sliding window counters. Checkout gets a tighter limit (5/min) with a sliding window to detect card testing attacks — a fraud technique where stolen cards are tested with small purchases.”</span>
</div>`,
        },
      ],
    },

    {
      id: "p8t10",
      title: "Idempotency",
      subtitle:
        "Making operations safe to retry — the same request, however many times, produces the same result.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">An operation is <strong>idempotent</strong> if performing it multiple times produces the same result as once. HTTP GET is naturally idempotent. HTTP POST (create order) is NOT — send it twice, you get two orders. Making non-idempotent operations idempotent via <strong>idempotency keys</strong> is critical for any system that retries operations (which all production systems must).</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "The Double Payment Problem & Solution",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">❌ Without Idempotency: Double Charge</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>1. Rahul clicks “Pay ₹4,999”</div>
      <div>2. ShopKart sends charge to Razorpay → card charged ✅</div>
      <div>3. Razorpay responds → <strong>network timeout</strong> (response lost in transit)</div>
      <div>4. ShopKart sees error → retries the charge</div>
      <div>5. Razorpay charges Rahul’s card <strong>again</strong> 💸</div>
      <div>6. Rahul charged twice. One order created. Angry customer.</div>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ With Idempotency Key: Safe Retry</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">// 1. Generate UUID tied to Rahul's order attempt (stored in DB)<br/>idempKey = "idem-key-8821-f4a2b3c1d5e6"<br/><br/>// 2. Send to Razorpay with idempotency key<br/>razorpay.charge({ amount: 4999, idempotencyKey: idempKey })<br/><br/>// 3. Network timeout — retry with SAME key<br/>// 4. Razorpay: "I've seen this key. Returning cached result."<br/>// 5. ShopKart gets success response. One charge. One order. ✅</div>
  </div>
  <div style="padding:14px 16px;background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔑 Server-Side Idempotency Key Implementation</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">// POST /orders requires: Idempotency-Key header<br/>const key = req.headers['idempotency-key'];<br/>const existing = await db('idempotency_keys').where({ key, userId }).first();<br/>if (existing) return res.status(existing.status).json(existing.response);<br/><br/>const order = await orderService.createOrder(req.body);<br/>await db('idempotency_keys').insert({ key, userId, status: 201, response: order });<br/>return res.status(201).json(order);</div>
  </div>
</div>
<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">“Idempotency keys are required for all payment operations. Keys are UUID v4 generated client-side. Server stores key + response for 30 days (Stripe stores 24 hours). On network retry with the same key, the exact same response is returned without re-processing. Mobile clients generate the key before sending — crashes and retries are safe. This is fundamental to building reliable payment flows.”</span>
</div>`,
        },
      ],
    },
  ],
};

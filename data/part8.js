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
          body: `<p><strong>Synchronous communication</strong>: the caller sends a request and WAITS for the response before continuing. HTTP REST, gRPC, database queries are synchronous. The thread is blocked until the response returns. <strong>Asynchronous communication</strong>: the caller sends a message and continues immediately — no waiting. The receiver processes it independently. Message queues (Kafka, RabbitMQ, SQS) are asynchronous. The choice between sync and async shapes your system's performance, reliability, and complexity.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Checkout: What Must Be Sync, What Can Be Async",
          body: `<div class="diagram-box">Rahul places an order. Timeline (must be in the 3-second checkout window):

SYNCHRONOUS (Rahul waits for these, they affect the order response):
  1. Validate cart items still exist              (100ms)
  2. Check inventory — reserve stock              (80ms)
  3. Calculate final price with discounts         (10ms)
  4. Process payment (Stripe API call)            (400ms)
  5. Create order record in PostgreSQL            (20ms)
  6. Return order confirmation to Rahul           (10ms)
  Total: ~620ms — Rahul waits, sees "Order Placed!" ✅

ASYNCHRONOUS (happens after Rahul sees "Order Placed!"):
  7.  Send order confirmation email               (200ms — not Rahul's problem)
  8.  Send SMS notification                       (300ms — ditto)
  9.  Update search index (show as sold)          (800ms — elastic search slow)
  10. Trigger loyalty points calculation          (100ms)
  11. Notify seller dashboard                     (150ms)
  12. Generate invoice PDF                        (2000ms — heavy task)
  
  If these were synchronous: checkout takes 620 + 3750 = 4370ms. Terrible UX.
  Async sends all 6 to a message queue after DB write. Zero wait.</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "When to Choose Each",
          body: `<table class="compare-table"><thead><tr><th>Choose Sync</th><th>Choose Async</th></tr></thead><tbody>
<tr><td>Request needs immediate response data</td><td>Fire-and-forget — caller doesn't need result</td></tr>
<tr><td>Operation is user-facing (latency matters)</td><td>Operation can be delayed (email, reporting)</td></tr>
<tr><td>Transaction requires atomicity (payment + inventory)</td><td>Long-running processing (PDF, video encoding)</td></tr>
<tr><td>Downstream must succeed for caller to proceed</td><td>Downstream reliability independent of caller</td></tr>
<tr><td>Examples: login, search, checkout core</td><td>Examples: email, analytics, notifications</td></tr>
</tbody></table>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">System Design Response</div><div class="interview-q">In every system design problem, classify operations: "I'd keep the payment and inventory reservation synchronous — these directly affect what we show the user and must succeed atomically. Post-order operations like sending confirmation emails, updating analytics, generating invoices are asynchronous via SQS. This cuts checkout response time from 5+ seconds to under 1 second."</div></div>`,
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
          body: `<p>A <strong>background job</strong> is a task that executes outside of an HTTP request-response cycle. When a user action triggers expensive work, the API enqueues a job and returns immediately. A separate <strong>worker process</strong> picks up and executes the job independently. The user never waits for the background work to complete.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Background Job Architecture",
          body: `<div class="diagram-box">ShopKart Background Job System (Bull + Redis):

  HTTP Request (checkout):
    1. Order created in DB
    2. API enqueues jobs:
       await emailQueue.add({ userId:42, orderId:8821 });
       await pdfQueue.add({ orderId:8821 });
       await inventoryQueue.add({ items:[...] });
    3. API returns 201 immediately (jobs are in Redis queue)
    
  Worker processes (run separately, always listening):
  
  [Email Worker] × 5 instances:
    emailQueue.process(5, async (job) => {
      await sendOrderConfirmationEmail(job.data.userId, job.data.orderId);
    });
  
  [PDF Worker] × 2 instances:
    pdfQueue.process(2, async (job) => {
      await generateInvoicePDF(job.data.orderId);  ← heavyweight task
       await s3.upload(\`invoices/\${job.data.orderId}.pdf\`, pdf);
    });
  
  [Inventory Sync Worker] × 3 instances:
    inventoryQueue.process(3, async (job) => {
      await syncInventoryWithWarehouse(job.data.items);
    });
  
  Scaling workers independently:
  Traffic spike → email queue grows → scale email worker from 5 to 20 instances
  PDF generation slow → scale PDF worker from 2 to 8 instances
  No impact on API server scaling</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Job Types",
          body: `<div class="info-grid">
  <div class="info-card green"><div class="info-card-title">Immediate Jobs</div>Triggered right after user action: order email, payment receipt, stock decrement trigger. Expected in seconds.</div>
  <div class="info-card blue"><div class="info-card-title">Scheduled Jobs</div>Run on a cron schedule: daily deals email (8am), abandoned cart reminder (24hr), inventory reconciliation (midnight).</div>
  <div class="info-card yellow"><div class="info-card-title">Batch Jobs</div>Process large datasets: nightly ML recommendation model training, monthly invoice generation for all orders, full-text search index rebuild.</div>
  <div class="info-card red"><div class="info-card-title">Retry Jobs</div>Failed jobs (email bounced, payment gateway timeout). Automatically retried with backoff: 3 retries at 1min, 5min, 15min delays.</div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Decoupling Workloads</div><div class="interview-q">"Background jobs are how we keep our API response time SLA even during heavy processing. The API is measured at sub-500ms p99. Post-order processing (email, PDF, ML model updates) could take 5-30 seconds — none of that is in the user's critical path. Bull with Redis gives us job persistence, retry logic, and priority queues. We can see real-time job status in the Bull Board dashboard."</div></div>`,
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
          body: `<p>In <strong>event-driven architecture</strong>, when something meaningful happens (an order is placed, a payment is received, a user signs up), the service that detected it publishes an <strong>event</strong> to a shared event bus or message broker. Other services that care about that event subscribe and react independently. Services are decoupled — the Order Service doesn't know (or care) whether the Email Service, Inventory Service, and Analytics Service exist.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Traditional vs Event-Driven",
          body: `<div class="diagram-box">❌ Traditional (tight coupling — direct calls):
  Order Service:
    await emailService.send(orderId);        ← direct call
    await inventoryService.decrement(items); ← direct call
    await analyticsService.track(orderId);   ← direct call
    await loyaltyService.addPoints(userId);  ← direct call
  
  Problem: 4 downstream calls in-line. If any fails, the whole thing fails.
  If LoyaltyService is down for maintenance, Orders fail.
  Adding RecommendationService means editing OrderService code.

✅ Event-Driven:
  Order Service:
    await orderRepo.save(order);
    await eventBus.publish('order.placed', { orderId, userId, items, total });
    return order;  ← done. Order Service knows nothing about downstream.
    
  Email Service:        subscribes to 'order.placed' → sends email
  Inventory Service:    subscribes to 'order.placed' → decrements stock
  Analytics Service:    subscribes to 'order.placed' → records event
  Loyalty Service:      subscribes to 'order.placed' → adds points
  Recommendation Svc:   subscribes to 'order.placed' → trains model
  
  Adding ReferralBonusService later?
  → Subscribe it to 'order.placed'. Zero changes to Order Service.</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Event Catalogue",
          body: `<div class="diagram-box">ShopKart Domain Events:

  user.registered          → welcome email, onboarding flow, analytics
  user.logged_in           → security alert if new device, session created
  product.published        → search index update, category listing refresh
  product.price_changed    → wishlisted users notification, cart price refresh
  order.placed             → confirmation email, inventory reservation, loyalty
  order.payment_failed     → retry payment prompt, release inventory reservation
  order.shipped            → shipping notification, tracking link email
  order.delivered          → review request email, loyalty points finalized
  payment.received         → invoice generation, tax record creation
  inventory.low_stock      → supplier reorder trigger, "low stock" badge update
  cart.abandoned           → 24hr reminder email trigger

Each event schema versioned:
  { event: "order.placed", version: "2.1", timestamp: ISO8601, data: {...} }</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Event Sourcing",
          body: `<p>Event-driven architecture pairs naturally with <strong>Event Sourcing</strong>: instead of storing current state (order.status = "shipped"), store every event that led to it (order.placed → order.payment_received → order.preparing → order.shipped). At any point, replay events to reconstruct state. Benefits: complete audit trail, ability to "replay" history to correct bugs, ability to project state into different read models. Used for financial systems, compliance-heavy domains.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Loose Coupling</div><div class="interview-q">"Event-driven decouples services temporally and functionally. When Rahul places an order, Order Service publishes 'order.placed' to Kafka and is done. Email, inventory, loyalty services consume at their own pace. If Email Service is down for 5 minutes, the events queue up and are processed when it recovers. Zero data loss, zero coupling. The Order Service has zero knowledge of how many downstream services consume its events."</div></div>`,
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
          body: `<p><strong>Pub/Sub</strong> (Publish/Subscribe) is a messaging pattern where <strong>publishers</strong> send messages to a named <strong>topic</strong> without knowing who will receive them. <strong>Subscribers</strong> declare interest in specific topics and receive all messages published to those topics. Publishers and subscribers are completely decoupled — they don't know each other exist. Kafka, Google Pub/Sub, AWS SNS, and Redis Pub/Sub implement this pattern.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Pub/Sub Architecture",
          body: `<div class="diagram-box">Topic: "order-events"

Publisher (Order Service):
  kafka.produce('order-events', {
    key: orderId,
    value: { event: 'order.placed', orderId: 8821, ... }
  });
  
Subscribers (independent consumer groups):

  Consumer Group: "email-workers"
    ← reads from 'order-events'
    ← each message processed by ONE worker in the group
    ← 3 worker instances share the load

  Consumer Group: "inventory-workers"
    ← reads from SAME 'order-events'
    ← has its own offset cursor (independent progress)
    ← doesn't affect email-workers at all

  Consumer Group: "analytics-workers"
    ← also reads from 'order-events'
    ← can be 1 second behind or 2 hours behind — independent
    
Key properties:
  • Message stored in Kafka for 7 days (configurable retention)
  • If analytics-workers are down, messages accumulate
  • When they recover: replay from last committed offset
  • No message loss</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Kafka Topics for ShopKart",
          body: `<div class="diagram-box">Kafka Cluster: 3 brokers, topics with partitioning

Topic: order-events         (20 partitions, 7-day retention)
  Partitioned by: orderId (for ordered processing)
  Producers: Order Service
  Consumers: Email, Inventory, Analytics, Loyalty, Recommendation
  
Topic: user-events          (10 partitions, 30-day retention)
  Partitioned by: userId
  Producers: Auth Service, User Service
  Consumers: Analytics, Onboarding, Security

Topic: product-events       (10 partitions, 7-day retention)  
  Partitioned by: productId
  Producers: Product Service, Inventory Service
  Consumers: Search Index, Cache Invalidation, Recommendation

Topic: payment-events       (10 partitions, 365-day retention for audit)
  Partitioned by: paymentId
  Consumers: Finance Service, Tax Service, Refund Service

Partitioning benefit:
  20 partitions = 20 consumer instances can consume in parallel
  Higher partitions → higher throughput → easier to scale</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Kafka Design</div><div class="interview-q">"We use Kafka for pub/sub with consumer groups. Key design: number of partitions determines maximum consumer parallelism per group. We start with 20 partitions per topic — can scale to 20 parallel consumers. Partition key choice matters: order events partitioned by orderId guarantees all events for one order are processed in sequence by the same consumer. Partitioning by userId would be wrong for orders (uneven distribution if power users have many orders)."</div></div>`,
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
          body: `<p>A <strong>message queue</strong> is a persistent buffer that holds messages (tasks, events, commands) until a consumer processes them. The producer writes to the queue without waiting for a consumer. The consumer reads from the queue at its own pace, processes each message, and acknowledges completion. If processing fails, the message can be retried or sent to a dead-letter queue. RabbitMQ, AWS SQS, and Kafka (in queue mode) are message queues.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Message Queue vs Pub/Sub",
          body: `<table class="compare-table"><thead><tr><th></th><th>Message Queue</th><th>Pub/Sub</th></tr></thead><tbody>
<tr><td><strong>Consumers</strong></td><td>Competing consumers (one message, one consumer)</td><td>All subscriber groups get every message</td></tr>
<tr><td><strong>Use case</strong></td><td>Task distribution: "process this order"</td><td>Event broadcast: "order was placed" (to many)</td></tr>
<tr><td><strong>Persistence</strong></td><td>Until acknowledged</td><td>Configurable retention period</td></tr>
<tr><td><strong>Examples</strong></td><td>AWS SQS, RabbitMQ</td><td>Kafka, AWS SNS, Redis Pub/Sub</td></tr>
<tr><td><strong>ShopKart use</strong></td><td>Email sending queue (each email sent once)</td><td>order-events topic (5 services each process every order)</td></tr>
</tbody></table>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "SQS Email Queue — ShopKart",
          body: `<div class="diagram-box">Scenario: Diwali sale, 500,000 orders in 1 hour.
500,000 order confirmation emails needed.

Without queue: API calls SendGrid directly
  → 10 concurrent max (rate limit)
  → 50,000 seconds to send all emails (13 hours!)
  → If SendGrid is down: API call fails → user sees error

With SQS queue:
  Order Service: sqs.sendMessage({ QueueUrl, Body: { userId, orderId } })
  → Returns in 5ms (message in queue, not sent yet)
  → User sees "Order Placed!" immediately
  
  Email Worker Pool (auto-scaling):
    30 worker instances × 10 concurrent each = 300 concurrent sends
    500,000 emails at 300/sec = ~28 minutes to fully process
    Users get emails within 5-28 minutes of ordering. Acceptable.
  
  SendGrid down for 20 minutes?
    → SQS keeps messages safely
    → Workers retry with backoff
    → All emails delivered after recovery, zero data loss
  
  SQS features used:
    Visibility Timeout: 30s (message hidden while being processed)
    Dead Letter Queue: after 3 failed attempts → DLQ for investigation
    Long Polling: workers wait 20s for new messages (reduces API calls)</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Decoupling Services</div><div class="interview-q">"Message queues absorb traffic spikes. Our email service handles 100 emails/second normally. During a Diwali promo, demand spikes to 5,000/sec. The queue acts as a buffer — Order Service writes to SQS at 5,000/sec, Email Workers process at 300/sec. The queue grows during the spike and drains over the next few minutes. Without the queue, the email service would be overwhelmed and orders would fail."</div></div>`,
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
          body: `<p>In distributed systems, network calls fail transiently — brief network hiccups, momentary service restarts, temporary overload. A <strong>retry mechanism</strong> automatically re-attempts a failed operation after a brief wait. Most transient failures resolve within a few seconds. Retries transform "occasional error" into "invisible hiccup" from the user's perspective.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "What's Retryable vs Not",
          body: `<div class="diagram-box">✅ SAFE TO RETRY (transient errors):
  HTTP 429 Too Many Requests (rate limit — wait and retry)
  HTTP 503 Service Unavailable (service restarting)
  HTTP 504 Gateway Timeout (temporary timeout)
  Connection refused (service briefly down)
  Network timeout (brief connectivity issue)
  
  → These are transient. The operation hasn't happened. Safe to retry.

❌ NOT SAFE TO RETRY (without idempotency check):
  HTTP 400 Bad Request (your request is invalid — retrying won't help)
  HTTP 401 Unauthorized (wrong credentials — retrying won't help)
  HTTP 200 OK (already succeeded! Retrying causes duplicate operation)
  Payment charge (retry = double charge!)
  
  For non-idempotent operations (payments, creating orders):
  → Must have idempotency key to make retries safe (see p8t10)

Non-retryable business errors:
  HTTP 422 Insufficient Inventory (out of stock — retry won't fix it)
  HTTP 402 Payment Required (card declined — retry won't fix it)</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Retry Implementation",
          body: `<div class="diagram-box">Order Service calling Payment Service (Stripe):

async function chargeCustomer(orderId, amount, paymentMethodId) {
  const maxAttempts = 3;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const charge = await stripe.paymentIntents.create({
        amount,
        idempotencyKey: \`order-\${orderId}\`,  ← makes retry safe!
        payment_method: paymentMethodId,
        confirm: true
      });
      return charge;  ← success
      
    } catch (err) {
      if (isNonRetryable(err)) throw err;  ← 400, 401, card declined → stop
      if (attempt === maxAttempts) throw err;  ← exhausted retries
      
      const delay = exponentialBackoff(attempt); ← 1s, 2s, 4s
      logger.warn(\`Payment attempt \${attempt} failed. Retrying in \${delay}ms\`);
      await sleep(delay);
    }
  }
}

function isNonRetryable(err) {
  return ['card_declined', 'insufficient_funds', 'authentication_required']
    .includes(err.code);
}</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Transient Failures</div><div class="interview-q">"When designing inter-service calls, I always ask: is this operation safe to retry? For GET requests — always safe. For POST/PUT — only safe with idempotency keys. We use a shared retry library with exponential backoff (1s, 2s, 4s) and log all retry attempts. Monitoring retry rates is useful — a spike in payment retries signals that Stripe is having issues, helping us decide whether to show a degraded checkout experience."</div></div>`,
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
          body: `<p><strong>Exponential backoff</strong> means each retry waits progressively longer than the previous one: 1st retry after 1 second, 2nd after 2 seconds, 3rd after 4 seconds, 4th after 8 seconds. This gives the failing service time to recover without being hammered by rapid retries. Combined with <strong>jitter</strong> (randomized delay), it prevents multiple clients from retrying simultaneously, avoiding a thundering herd.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Backoff with Jitter",
          body: `<div class="diagram-box">Without backoff — fixed retry every 1 second:
  t=0:  Request fails
  t=1:  Retry #1 — still failing (service needs time to recover)
  t=2:  Retry #2 — still failing
  t=3:  Retry #3 — still failing
  → Hammering the service, preventing recovery

Without jitter (pure exponential):
  100 clients all fail at t=0
  All retry at t=1, t=2, t=4 (synchronized spike)
  → Thundering herd — service gets 100 simultaneous retries exactly at t=1

✅ Exponential backoff + jitter:
  Base delay: 1 second
  Multiplier: 2
  Jitter: ±50% random
  Max delay: 32 seconds
  
  Client A: retries at 0.7s, 1.8s, 5.2s, 11.3s...  (random within range)
  Client B: retries at 1.2s, 2.4s, 4.8s,  9.1s...
  Client C: retries at 0.9s, 1.6s, 4.1s, 14.8s...
  
  Effect: 100 retries spread over 0.5-1.5 seconds instead of all at t=1
  Service recovery: given breathing room

Code:
  const delay = (Math.pow(2, attempt) * 1000) * (0.5 + Math.random() * 0.5);
  const cappedDelay = Math.min(delay, 32000);  ← max cap</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Inventory Service Backoff",
          body: `<div class="diagram-box">Scenario: Order service calls Inventory service.
Inventory service is restarting after crash (takes ~8 seconds).
500 order requests arrive during the 8-second window.

Without exponential backoff (fixed 1sec retry, 3 attempts):
  All 500 clients retry at 1sec intervals
  → 500 × 3 = 1,500 extra requests to a recovering service
  → Service can't recover → restart again → loop
  
With exponential backoff + jitter (3 attempts: ~1s, ~2s, ~4s):
  Retries SPREAD across 1-4 seconds
  Most clients succeed on 2nd or 3rd attempt
  Service recovers with manageable load
  Total extra requests: ~300 (not 1,500)
  
AWS SDK default: uses full jitter exponential backoff automatically for:
  DynamoDB, S3, SQS, SNS — all built-in
  You get this "for free" with AWS SDKs.</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Retry Strategy</div><div class="interview-q">"Exponential backoff with full jitter is the recommended retry strategy for distributed systems (see AWS Architecture Blog). The jitter is critical — without it, synchronized clients create retry storms that prevent the failing service from recovering. We use a utility function that implements capped exponential backoff with full jitter (AWS recommendation), applied to all external HTTP calls and queue consumers."</div></div>`,
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
          body: `<p>A <strong>Circuit Breaker</strong> monitors calls from Service A to Service B. When too many calls fail, the circuit "opens" — all subsequent calls immediately return an error without even attempting to reach Service B. This prevents Rahul's checkout request from hanging for 30 seconds while waiting for a dead service. After a recovery period, the circuit "half-opens" and allows a test call. If it succeeds, the circuit closes and normal operation resumes.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Circuit Breaker State Machine",
          body: `<div class="diagram-box">States:

CLOSED (normal operation):
  All requests attempt to reach Service B
  Failure counter tracks recent errors
  If failures > threshold within window → OPEN
  
OPEN (fail-fast mode):
  All requests immediately return fallback/error
  Does NOT attempt to call Service B
  After timeout (e.g. 30 seconds) → HALF-OPEN
  
HALF-OPEN (testing recovery):
  Allow ONE request through to Service B
  If success → CLOSED (service recovered)
  If failure → OPEN again (wait another 30 seconds)

Transition thresholds (configurable):
  Open circuit if: 50% failure rate in last 10 requests
  OR: 5 consecutive failures
  Half-open timeout: 30 seconds
  
Timeline for ShopKart Recommendation Service failure:
  3:00pm: Recommendation service crashes
  3:00:05pm: 5 consecutive failures → Circuit OPENS
  3:00:05pm onwards: Checkout responses immediately use fallback
    (no recommendation = show generic "You might also like" from cache)
  3:30:05pm: Half-open, test call → fails → back to OPEN
  4:02pm: Service recovers
  4:02:30pm: Half-open test call → succeeds → CLOSED
  4:02:30pm onwards: Full recommendations resume</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Circuit Breaker + Fallback",
          body: `<div class="diagram-box">ShopKart Product Page with Circuit Breaker (using opossum library):

const recommendationBreaker = new CircuitBreaker(getRecommendations, {
  timeout: 3000,        // individual call timeout
  errorThresholdPercentage: 50,  // open at 50% failure rate
  resetTimeout: 30000   // try half-open after 30 seconds
});

recommendationBreaker.fallback(() => {
  return getCachedPopularProducts();  ← graceful degradation
});

// In product page route:
const recommendations = await recommendationBreaker.fire(productId);
// → if circuit is open: immediately returns cached popular products
// → user sees "Popular Products" instead of personalized recs
// → page still loads fast, no error shown to user

Circuit breaker events logged:
  breaker.on('open', () => logger.error('Recommendation circuit opened'));
  breaker.on('close', () => logger.info('Recommendation circuit closed'));
  breaker.on('halfOpen', () => logger.info('Testing recommendation service...'))</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Cascading Failure Without Circuit Breakers",
          body: `<p>Without circuit breakers, a cascading failure works like this: recommendation service is slow (5-second responses). Checkout requests wait 5 seconds for recommendations. This blocks 5× more threads. Product page requests also wait. Server thread pool fills up. All requests start timing out. The entire ShopKart website goes down — because the recommendation service (non-critical feature) was slow. Circuit breakers contain failure: one service's slowness doesn't bring down everything else.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Resilience Pattern</div><div class="interview-q">"Circuit breakers are a must for any microservices architecture. Every external call — to our own services and third-party APIs — is wrapped in a circuit breaker with a fallback. Stripe down? Use cached payment form, queue the charge. Recommendation service down? Show popular items. The principle: critical path (product display, checkout, payment) must never depend on non-critical services (recommendations, reviews). We define SLOs per service and configure circuit breakers accordingly."</div></div>`,
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
          body: `<p><strong>Rate limiting</strong> restricts how many requests a client (identified by IP, user ID, or API key) can make within a time window. When the limit is exceeded, the server returns HTTP 429 Too Many Requests. Rate limiting protects against abuse (scraping, DDoS), ensures fair resource allocation among users, and prevents a buggy client from accidentally overloading the server.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Rate Limiting Algorithms",
          body: `<div class="diagram-box">1. Fixed Window Counter:
   Window: 1 minute. Limit: 100 requests.
   Counter resets at :00 of every minute.
   
   ❌ Problem: Rahul sends 100 requests at 12:00:59
   Then sends 100 more at 12:01:00 (new window)
   → 200 requests in 2 seconds (burst attack)

2. Sliding Window Log:
   Track timestamp of every request in last 60 seconds.
   Count = entries in last 60s window.
   ✅ Accurate, no burst. ❌ Memory intensive.

3. Token Bucket (recommended — handles bursts intentionally):
   Bucket capacity: 100 tokens
   Refill rate: 10 tokens/second
   Each request consumes 1 token
   
   Rahul browses: consumes 2-3 tokens/sec → bucket stays full
   Rahul's bot script: consumes 100 tokens in 0.1 sec → bucket empty → throttled
   After throttle: bucket refills at 10/sec → normal browsing resumes in 10 sec
   ✅ Handles bursts (bucket capacity), smooth refill rate

4. Leaky Bucket:
   Requests fill a bucket. Bucket drains at constant rate.
   Smooths bursty traffic into constant output rate.
   Good for protecting downstream services with fixed processing speed.</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Rate Limit Tiers",
          body: `<div class="diagram-box">Rate limits at API Gateway (Kong Rate Limiting plugin):

  Anonymous (unauthenticated) user:
    100 requests / minute per IP
    Purpose: prevent scraping product catalog before login

  Authenticated user (free account):
    600 requests / minute per userId
    Burst: up to 100 requests in 5 seconds (token bucket)
  
  Premium seller API key:
    10,000 requests / minute per API key
    Used by sellers' automated inventory systems
  
  Checkout endpoint specifically:
    5 checkout attempts / minute per userId
    Purpose: prevent card testing attacks (trying many stolen cards)
  
  Search endpoint:
    200 requests / minute per IP (search is expensive — Elasticsearch)
    
  Redis implementation:
    Key: rate_limit:{userId}:{minute_bucket}
    INCR rate_limit:user_42:202412181433
    EXPIRE rate_limit:user_42:202412181433 60
    → If counter > 600: reject with 429
       Headers: Retry-After: 47  (seconds until window resets)</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Distributed Rate Limiting</div><div class="interview-q">"Rate limiting in a distributed system requires a centralised counter — Redis. Each of our 20 app servers increments the same Redis key per user. If each server had its own counter, users could get 20× the rate limit (one per server). We use Redis INCR + EXPIRE for sliding window counters. For checkout specifically, we use a tighter limit (5/minute) with a sliding window to detect card testing attacks."</div></div>`,
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
          body: `<p>An operation is <strong>idempotent</strong> if performing it multiple times produces the same result as performing it once. HTTP GET is naturally idempotent — fetch product:12345 a hundred times, you get the same product. HTTP POST (create order) is NOT naturally idempotent — send it twice, you get two orders. Making non-idempotent operations idempotent using <strong>idempotency keys</strong> is critical for systems that retry operations (which all production systems must).</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "The Double-Payment Problem",
          body: `<div class="diagram-box">Scenario without idempotency:

  1. Rahul clicks "Pay ₹4,999"
  2. ShopKart sends charge request to Stripe
  3. Stripe charges Rahul's card ✅
  4. Stripe sends response → NETWORK TIMEOUT ← (shutter happens here)
  5. ShopKart sees error "Connection timeout"
  6. ShopKart retries the charge request
  7. Stripe charges Rahul's card AGAIN 💸💸
  8. Rahul gets charged twice, one order created
  
  ❌ Duplicate charge. Very bad.

Scenario WITH idempotency key:

  1. Rahul clicks "Pay" → ShopKart generates idempotency key:
     idempKey = uuid()  →  "idem-key-8821-f4a2b3c1d5e6"
     (tied to Rahul's order attempt, stored in DB)
  
  2. ShopKart → Stripe: { amount:4999, idempotencyKey:"idem-key-8821-..." }
  3. Stripe charges Rahul ✅ → stores result under that key
  4. Network timeout — ShopKart retries with SAME idempotency key
  5. Stripe: "I've seen this key. Returning cached result."
  6. ShopKart gets success response, creates order ✅
  
  Result: one charge, one order. No duplicate.</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Implementing Idempotency in ShopKart API",
          body: `<div class="diagram-box">POST /orders — making order creation idempotent:

  Client sends header: Idempotency-Key: client-generated-uuid-abc123

  Server:
  async function createOrder(req, res) {
    const idempotencyKey = req.headers['idempotency-key'];
    if (!idempotencyKey) return res.status(400).json({ error: 'Idempotency-Key required' });
    
    // 1. Check if we've seen this key before
    const existing = await db('idempotency_keys')
      .where({ key: idempotencyKey, userId: req.user.id })
      .first();
    
    if (existing) {
      // Already processed — return cached response (same status + body)
      return res.status(existing.responseStatus).json(existing.responseBody);
    }
    
    // 2. Process the order (first time seeing this key)
    const order = await orderService.createOrder(req.user.id, req.body);
    
    // 3. Store result against idempotency key
    await db('idempotency_keys').insert({
      key: idempotencyKey,
      userId: req.user.id,
      responseStatus: 201,
      responseBody: JSON.stringify(order),
      expiresAt: addDays(now(), 30)  ← keep for 30 days
    });
    
    return res.status(201).json(order);
  }</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — HTTP Idempotency",
          body: `<p>HTTP methods have defined idempotency semantics: <strong>GET, HEAD, OPTIONS, PUT, DELETE</strong> are defined as idempotent. <strong>POST, PATCH</strong> are not —they must be made idempotent by the application through idempotency keys. The Stripe API requires an idempotency key for all POST requests. Google also requires this for their payment APIs. In your own API design, for any operation that creates or mutates data, always support an <code>Idempotency-Key</code> header. It costs a DB lookup but prevents double-processing at scale.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Distributed Systems Safety</div><div class="interview-q">"Idempotency is one of the most important reliability patterns. We require Idempotency-Key for all payment operations. Keys are UUID v4 generated client-side. Server stores the key + response for 24 hours (Stripe does 24 hours, we do 30 days for audit). On network retry with the same key, the exact same response is returned — no double processing. Mobile clients generate the key before sending, so crashes and retries are safe. This is fundamental to building reliable payment flows."</div></div>`,
        },
      ],
    },
  ],
};

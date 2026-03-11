/* Part 14 — Real-Time & Distributed Patterns (6 topics) */
const PART14 = {
  id: "part14",
  icon: "⚡",
  title: "Part 14",
  name: "Real-Time & Distributed Patterns",
  topics: [
    /* 1 */ {
      id: "p14t1",
      title: "WebSockets & Real-Time Communication",
      subtitle:
        "Long Polling vs SSE vs WebSockets — choosing the right real-time channel for each feature.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>Real-time communication means the server can push data to the client without the client having to ask. Three approaches exist, each with different trade-offs:</p>
<ul style="font-size:13px;line-height:1.9;padding-left:20px;margin-top:8px;color:var(--text-primary);opacity:0.9;">
  <li><strong>Long Polling:</strong> Client asks, server waits and holds the connection open until there's new data (or a timeout), then client immediately asks again. Simulates push using repeated HTTP requests.</li>
  <li><strong>Server-Sent Events (SSE):</strong> Client makes one HTTP request, server keeps the response streaming indefinitely, pushing events as they happen. One direction only: server → client.</li>
  <li><strong>WebSockets:</strong> A persistent, full-duplex TCP connection. Both client and server can send messages at any time, independently. True bidirectional real-time.</li>
</ul>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Deep Comparison",
          body: `<table style="width:100%;border-collapse:collapse;font-size:12px;">
  <thead>
    <tr style="background:rgba(99,102,241,0.08);">
      <th style="padding:8px 10px;text-align:left;color:var(--accent);border-bottom:1px solid var(--border);">Property</th>
      <th style="padding:8px 10px;text-align:left;color:var(--accent);border-bottom:1px solid var(--border);">Long Polling</th>
      <th style="padding:8px 10px;text-align:left;color:var(--accent);border-bottom:1px solid var(--border);">SSE</th>
      <th style="padding:8px 10px;text-align:left;color:var(--accent);border-bottom:1px solid var(--border);">WebSocket</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:7px 10px;color:var(--text-primary);font-weight:600;">Direction</td>
      <td style="padding:7px 10px;color:var(--text-primary);">Server → Client</td>
      <td style="padding:7px 10px;color:var(--text-primary);">Server → Client</td>
      <td style="padding:7px 10px;color:#10b981;font-weight:600;">Bidirectional</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:7px 10px;color:var(--text-primary);font-weight:600;">Latency</td>
      <td style="padding:7px 10px;color:#ef4444;">High (request round-trips)</td>
      <td style="padding:7px 10px;color:#10b981;">Low</td>
      <td style="padding:7px 10px;color:#10b981;font-weight:600;">Lowest</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:7px 10px;color:var(--text-primary);font-weight:600;">Overhead</td>
      <td style="padding:7px 10px;color:#ef4444;">High (HTTP headers each time)</td>
      <td style="padding:7px 10px;color:#10b981;">Low (one connection)</td>
      <td style="padding:7px 10px;color:#10b981;">Lowest (binary frames)</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:7px 10px;color:var(--text-primary);font-weight:600;">Browser Support</td>
      <td style="padding:7px 10px;color:#10b981;">All</td>
      <td style="padding:7px 10px;color:#10b981;">All modern</td>
      <td style="padding:7px 10px;color:#10b981;">All modern</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:7px 10px;color:var(--text-primary);font-weight:600;">Auto-reconnect</td>
      <td style="padding:7px 10px;">Manual</td>
      <td style="padding:7px 10px;color:#10b981;">Built-in</td>
      <td style="padding:7px 10px;">Manual</td>
    </tr>
    <tr>
      <td style="padding:7px 10px;color:var(--text-primary);font-weight:600;">Load Balancing</td>
      <td style="padding:7px 10px;color:#10b981;">Easy (stateless)</td>
      <td style="padding:7px 10px;">Easy</td>
      <td style="padding:7px 10px;color:#f59e0b;">Needs sticky sessions</td>
    </tr>
  </tbody>
</table>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Real-Time Features",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">ShopKart Real-Time Features → Channel Choice

Order tracking page (Rahul tracks his delivery)
  → SSE ✅
  Flow: Server pushes status updates (Packed → Dispatched → Out for Delivery)
  One direction, auto-reconnect, works through HTTP/2
  Client never sends data back

Flash sale countdown + live stock (50 users watching)
  → WebSocket ✅
  Flow: Server pushes "23 left", "19 left", "SOLD OUT"
  Also client sends heartbeat to confirm they're still watching
  Bidirectional needed

Customer support chat
  → WebSocket ✅
  Flow: Agent types, customer types — both directions simultaneously
  Typing indicators require bidirectional

Admin dashboard (metrics update every 5 sec)
  → Long Polling ✅ (simple, no infra changes needed)
  Latency doesn't matter, 5s interval means polling is fine
  No persistent connection overhead for low-frequency data</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Scaling WebSockets — The Sticky Session Problem",
          body: `<p style="margin-bottom:12px;">WebSocket connections are stateful — the client is connected to <em>one specific server</em>. If you have 3 servers and a message arrives for a user connected to Server 2, but the message handler is running on Server 1, Server 1 can't push to that connection. Two solutions:</p>
<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Option 1 — Sticky Sessions (Simple)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Load balancer routes the same user to the same server always (via cookie or IP hash). Simple but uneven load distribution. If Server 2 dies, all its WebSocket clients disconnect.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Option 2 — Redis Pub/Sub Backend (Scalable)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Every WebSocket server subscribes to a Redis channel for their connected users. When a message arrives for user 42, publish to Redis channel "user:42". Every server checks — the one that has user 42's connection pushes the message. This is how Socket.io scales horizontally.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Default to <strong>SSE for server push</strong> (notifications, live feeds, status updates) because it's simpler — it's just HTTP, works through proxies and CDNs, has automatic reconnection, and doesn't need a WebSocket handshake upgrade. Use <strong>WebSockets only when you actually need the client to send data</strong> in the same channel (chat, collaborative editing, live games).</p>
<p style="margin-top:10px;">For most notification use cases, an even simpler pattern works: short polling every 5–30 seconds. Your order status doesn't need sub-second updates. If the latency requirement isn't strict, polling reduces infrastructure complexity and is easier to debug, cache, and scale.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Real-Time System Design</strong><br/><span style="color:var(--text-primary);opacity:0.9;">When asked to design a notification system or live updates, explicitly name the protocol and justify it: "For delivery tracking, I'd use SSE — the server pushes status changes, the client only reads. SSE has built-in reconnection and works over HTTP/2 without proxy issues. For the support chat feature, I'd use WebSockets because both the customer and agent need to send messages. I'd scale WebSocket servers with Redis Pub/Sub as a message bus so any server can push to any client."</span></div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Long Polling: Client ──GET──► Server
              Client ◄──data─ Server
              Client ──GET──► Server  (immediately again)

SSE:          Client ──GET──► Server
              Client ◄──evt─ Server
              Client ◄──evt─ Server  (stream stays open)
              Client ◄──evt─ Server

WebSocket:    Client ──WS Upgrade──► Server
              Client ◄────────────► Server  (persistent, both directions)</div>`,
        },
      ],
    },

    /* 2 */ {
      id: "p14t2",
      title: "Saga Pattern",
      subtitle:
        "How to manage distributed transactions across microservices without Two-Phase Commit.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>In a monolith, a checkout operation is one database transaction — atomic, all-or-nothing. In microservices, checkout touches the Inventory service, Payment service, and Order service — three separate databases. You <em>cannot</em> run a single database transaction across them. The <strong>Saga pattern</strong> breaks the multi-step process into a sequence of local transactions, each publishing an event. If any step fails, <strong>compensating transactions</strong> are run to undo the previous steps.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Choreography vs Orchestration",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🎭 Choreography (Event-Driven)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">No central coordinator. Each service listens for events and reacts. Inventory listens for "OrderPlaced" → reserves stock, emits "InventoryReserved". Payment listens for "InventoryReserved" → charges card, emits "PaymentProcessed".</p>
    <div style="font-size:12px;color:#10b981;font-weight:600;">Pros: Decoupled, no SPOF, services are autonomous</div>
    <div style="font-size:12px;color:#ef4444;font-weight:600;margin-top:3px;">Cons: Hard to see the full flow, debugging is painful, cyclic dependencies creep in</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🎯 Orchestration (Central Coordinator)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">A Saga Orchestrator explicitly tells each service what to do next. OrderSaga calls Inventory → calls Payment → calls Notification. If Payment fails, OrderSaga calls Inventory to release stock.</p>
    <div style="font-size:12px;color:#10b981;font-weight:600;">Pros: Easy to visualise flow, single place for saga logic, easy rollback</div>
    <div style="font-size:12px;color:#ef4444;font-weight:600;margin-top:3px;">Cons: Orchestrator becomes a coordination hub (not a SPOF if stateless + event-sourced)</div>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Checkout Saga",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Checkout Saga (Orchestrated by OrderSaga service)

STEP 1: Inventory Service
  → Reserve 1x "Nike Air Max" for user 42
  ← InventoryReserved ✅  |  ← InsufficientStock ❌ → ABORT (no compensation needed yet)

STEP 2: Payment Service  
  → Charge user 42's card ₹8,499
  ← PaymentProcessed ✅  |  ← PaymentFailed ❌
     ↳ COMPENSATE: Release Inventory reservation (Step 1 undo)
     ↳ Emit: InventoryReleased
     ↳ Return error to user: "Payment failed, items returned to cart"

STEP 3: Order Service
  → Create Order record with line items
  ← OrderCreated ✅  |  ← OrderCreationFailed ❌
     ↳ COMPENSATE: Refund Payment (Step 2 undo)
     ↳ COMPENSATE: Release Inventory (Step 1 undo)

STEP 4: Notification Service
  → Send order confirmation email/SMS
  ← (fire-and-forget, failure here does NOT roll back order)

Final State: Order confirmed, user notified ✅</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Saga Failure Modes",
          body: `<div style="display:flex;flex-direction:column;gap:8px;">
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>Compensating transaction can also fail.</strong> Refunding a payment can fail if the payment provider is down. Solution: retry with exponential backoff, dead-letter queue, and human intervention workflow for stuck sagas.</div>
  </div>
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>Duplicate execution (at-least-once delivery).</strong> The Saga step might be triggered twice if Kafka redelivers the message. Every step must be <strong>idempotent</strong> — processing the same event twice must produce the same result. Use idempotency keys.</div>
  </div>
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#f59e0b;">⚠️</span><div><strong>Dirty reads between steps.</strong> After step 1 (inventory reserved) but before step 3 (order created), another user's read might see inconsistent state. This is <strong>not ACID isolation</strong> — it's eventual consistency. Accept this or use compensating UI patterns (e.g., "Your cart is being confirmed...").</div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>The Two-Phase Commit (2PC) alternative — where a coordinator locks all participants simultaneously before committing — sounds appealing but is rarely used in production distributed systems because: (1) it's incredibly slow (all services hold locks while waiting for the coordinator), (2) the coordinator is a single point of failure, and (3) it blocks on any service timeout.</p>
<p style="margin-top:10px;">Sagas trade ACID isolation for availability. The compensating transaction approach accepts that the system may be temporarily inconsistent but will always reach a consistent final state. This <strong>eventual consistency</strong> is acceptable for e-commerce checkouts but not for financial ledgers — use event sourcing + sagas together for financial systems requiring full audit trails.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Distributed Transaction Question</strong><br/><span style="color:var(--text-primary);opacity:0.9;">"How do you handle transactions across microservices?" Answer: "We use the Saga pattern — specifically orchestrated sagas for checkout. The OrderSaga orchestrates: reserve inventory → charge payment → create order. If payment fails, the saga emits a compensating command to release the inventory reservation. We don't use 2PC because it's slow and the coordinator is a single point of failure. Each step is idempotent to handle message redelivery."</span></div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Happy Path:
  OrderSaga → Inventory (reserve) → Payment (charge) → Order (create) → Notify ✅

Payment Fails:
  OrderSaga → Inventory (reserve) → Payment (FAIL)
                    ↑
  Compensate: ──────┘ Release inventory
  → Return error to user</div>`,
        },
      ],
    },

    /* 3 */ {
      id: "p14t3",
      title: "CQRS & Event Sourcing",
      subtitle:
        "Separating reads from writes — and replacing current-state storage with a complete history of events.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>CQRS (Command Query Responsibility Segregation)</strong> separates the write model (commands that change state) from the read model (queries that fetch data). They can use different databases optimised for their job. <strong>Event Sourcing</strong> takes this further: instead of storing the current state of an entity, store the complete history of <em>events</em> that led to that state. Current state is derived by replaying events.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "CQRS In Practice",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Write Side (Commands) — Optimised for Consistency</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Normalised PostgreSQL schema. Strong consistency, ACID transactions. Handles: PlaceOrder, UpdateProfile, AddToCart. Writes emit events to Kafka when state changes.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Read Side (Queries) — Optimised for Performance</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Denormalised read models, each pre-shaped for a specific UI query. Events from Kafka update these read models asynchronously. Separate read models can exist for different consumers: Elasticsearch for search, Redis for the cart widget, MongoDB for the order history page.</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart CQRS Architecture",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">WRITE MODEL (Command Side)
  POST /orders → OrderCommandService
    → INSERT into orders (PostgreSQL, normalised)
    → emit OrderPlaced event to Kafka

READ MODELS (Query Side, updated by event consumers)
  Kafka consumer 1: OrderPlaced → update Elasticsearch index
    → GET /search?q=shoes → Elasticsearch
  Kafka consumer 2: OrderPlaced → update Redis cart count
    → GET /cart/count → Redis (sub-ms)
  Kafka consumer 3: OrderPlaced → update order history table
    → GET /my-orders → Denormalised MongoDB (all order data in one doc)

Result:
  Writes: fast, consistent, normalised
  Reads: blazing fast, each model shaped for its query
  Trade-off: eventual consistency between write and read models
             (typically 50-500ms lag)</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Event Sourcing — Orders as an Event Log",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Traditional approach (current state only):
  orders table: { id: 42, status: "delivered", updated_at: ... }
  ← Can't answer: "What happened between placed and delivered?"

Event Sourcing (complete history):
  order_events table:
  { order_id:42, event:"OrderCreated",    ts: 10:00, data:{items,...} }
  { order_id:42, event:"PaymentDone",     ts: 10:01, data:{amount,...} }
  { order_id:42, event:"Packed",          ts: 10:45, data:{warehouse:...} }
  { order_id:42, event:"OutForDelivery",  ts: 14:00, data:{agent:...} }
  { order_id:42, event:"Delivered",       ts: 16:30, data:{sig:...} }

Current state = replay all events in order
  → status: "Delivered", agent: "Ramesh", confirmed: true

Benefits:
  1. Full audit trail (legal requirement for payments)
  2. Time travel: "What was order state at 11am?"
  3. Replay events to build new read models (e.g., add analytics)
  4. Debug production issues with exact sequence of what happened</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>CQRS is a spectrum. You don't need separate databases on day one — you can start by simply having separate service methods for reads and writes on the same database. The separation lets you optimise reads independently later. The real payoff comes when your write and read requirements diverge significantly: you're doing complex normalised writes but need ultra-fast denormalised reads.</p>
<p style="margin-top:10px;">Event Sourcing is powerful but operationally complex. The main cost: to get the current state, you replay all events — so you need <strong>snapshots</strong> (periodic state captures) to avoid replaying 1,000 events for every read. Start with Event Sourcing only for entities where audit trails are critical (orders, payments, inventory changes). Using it for every entity is over-engineering.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Order History & Audit Trail</strong><br/><span style="color:var(--text-primary);opacity:0.9;">"How do you implement a full audit trail for orders?" Answer: "We use Event Sourcing for the Order aggregate. Every state change — created, payment processed, packed, dispatched, delivered — is appended as an immutable event to the order_events table. The current state is a materialized view derived from replaying events. For performance, we take snapshots every 20 events. This gives us perfect audit logs, time-travel debugging, and the ability to build new analytics projections by replaying historical events."</span></div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Command: PlaceOrder
    ↓
Write Model (PostgreSQL) → emits OrderPlaced event
    ↓
Kafka
    ↓
  ├── Consumer A → Update Elasticsearch (for search)
  ├── Consumer B → Update Redis (for cart badge count)
  └── Consumer C → Update MongoDB (for order history page)

Read:  GET /my-orders → MongoDB read model (fast, denormalised)</div>`,
        },
      ],
    },

    /* 4 */ {
      id: "p14t4",
      title: "Outbox Pattern",
      subtitle:
        "Guaranteeing zero lost events when writing to a database and publishing to Kafka simultaneously.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>You need to: (1) save an order to PostgreSQL <em>and</em> (2) publish an "OrderPlaced" event to Kafka. These are two separate systems — there's no distributed transaction between them. If you do the DB write first and Kafka publish second, a crash between steps loses the event. If you publish to Kafka first and the DB write fails, you have a phantom event. The <strong>Outbox Pattern</strong> solves this by treating the event as part of the same database transaction as the business data.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "How the Outbox Pattern Works",
          body: `<div style="display:flex;flex-direction:column;gap:10px;">
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">1</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Atomic write to DB + outbox table:</strong> In a single database transaction, INSERT the order AND INSERT the event into an <code>outbox_events</code> table. The event is "pending" in the outbox. If the transaction rolls back, neither the order nor the event record exists.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">2</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Outbox Relay reads and publishes:</strong> A separate relay process (or CDC — Change Data Capture tool like Debezium) polls the outbox table for unpublished events and publishes them to Kafka.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">3</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Mark as published:</strong> After Kafka confirms receipt, the relay marks the outbox record as published (or deletes it). The record remains if Kafka is unavailable — ensuring retry without data loss.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">4</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>At-least-once delivery:</strong> If the relay crashes after publishing but before marking published, it will publish again on restart. Kafka consumers must be <strong>idempotent</strong> — handle duplicate events gracefully using event IDs.</div></div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Outbox Implementation",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">-- outbox_events table (same DB as orders)
CREATE TABLE outbox_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic       TEXT NOT NULL,       -- 'order.placed'
  payload     JSONB NOT NULL,      -- {"order_id":42, "user_id":7, ...}
  created_at  TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ         -- NULL = pending, set = done
);

-- In OrderService.placeOrder() — ONE transaction:
BEGIN;
  INSERT INTO orders (id, user_id, total)
    VALUES (42, 7, 8499);
  
  INSERT INTO outbox_events (topic, payload)
    VALUES ('order.placed', '{"order_id":42,"user_id":7}');
COMMIT;
-- If COMMIT fails: neither row exists. No phantom event. ✅
-- If app crashes after COMMIT: outbox row exists, relay picks it up. ✅

-- OutboxRelay (runs every 500ms):
SELECT * FROM outbox_events WHERE published_at IS NULL LIMIT 100;
-- → Publish each to Kafka
-- → UPDATE outbox_events SET published_at=now() WHERE id=...

-- Using Debezium (CDC approach):
--   Subscribe to PostgreSQL WAL changes on outbox_events table
--   Every INSERT streamed to Kafka automatically — near real-time, zero polling</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Outbox vs Dual Write (What NOT to Do)",
          body: `<div style="border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:14px 16px;background:rgba(239,68,68,0.04);margin-bottom:12px;">
  <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:8px;">❌ Dual Write (The Wrong Way)</div>
  <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">// DANGEROUS: two separate operations, no atomicity
db.insert(order);
kafka.publish("OrderPlaced", order);  // crash here → event lost forever</div>
</div>
<div style="border:1px solid rgba(16,185,129,0.3);border-radius:8px;padding:14px 16px;background:rgba(16,185,129,0.04);">
  <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:8px;">✅ Outbox Pattern (The Right Way)</div>
  <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">// SAFE: both in one DB transaction
BEGIN TRANSACTION;
  db.insert(order);
  db.insert(outbox_event);  // same DB, atomic!
COMMIT;
// Relay handles Kafka publish separately, retries on failure</div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>The Outbox Pattern is the correct answer to "how do you guarantee no lost events?" in any event-driven microservices architecture. The CDC approach (Debezium reading PostgreSQL WAL) is particularly elegant — the relay doesn't even need to poll; it subscribes to database changes and forwards them. This adds minimal write overhead and delivers events with sub-second latency.</p>
<p style="margin-top:10px;">The cost: an extra table in your database and a relay service to operate. For high-volume systems (millions of events/day), the outbox table needs periodic cleanup of published events. Partition the table by date and drop old partitions weekly.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Event Reliability Question</strong><br/><span style="color:var(--text-primary);opacity:0.9;">"How do you ensure no events are lost between your database and Kafka?" Answer: "We use the Transactional Outbox Pattern. When an order is placed, we write the order row AND an outbox_events row in the same PostgreSQL transaction. A Debezium CDC connector subscribes to the PostgreSQL WAL and streams new outbox events to Kafka — no polling lag, no lost events even if Kafka is temporarily unavailable. Consumers handle idempotency using the event UUID."</span></div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">App Server
   │
   └─── BEGIN TRANSACTION ──────────────────┐
        INSERT orders (row 42)              │  PostgreSQL
        INSERT outbox_events (event for 42) │
        COMMIT ─────────────────────────────┘

Relay/Debezium reads outbox_events
   │
   └─── Publish to Kafka "order.placed"
        Mark outbox record as published

Kafka consumers process event ✅
(at-least-once, idempotent consumers handle duplicates)</div>`,
        },
      ],
    },

    /* 5 */ {
      id: "p14t5",
      title: "Distributed Locking",
      subtitle:
        "Preventing race conditions when multiple servers compete for the same resource.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>In a distributed system, multiple servers run the same code concurrently. When two servers both try to sell the last unit of an item at the same instant, you can oversell without proper coordination. A <strong>distributed lock</strong> ensures only one server can perform a specific operation at any given moment — even when servers share no memory and communicate only through a network.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Three Strategies",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">1. Optimistic Locking (Database) — Best for most cases</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);margin-bottom:6px;">UPDATE inventory SET stock = stock - 1, version = version + 1
WHERE item_id = 123 AND version = 7 AND stock > 0;
-- 0 rows updated? Someone else updated first → retry</div>
    <p style="margin:0;font-size:12px;color:var(--text-primary);opacity:0.75;">No lock held. Multiple transactions can read simultaneously. Only the updater who holds the correct version wins. Losers retry. Works well for low-contention scenarios.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">2. Pessimistic Locking (Database) — For known contention</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);margin-bottom:6px;">BEGIN;
SELECT stock FROM inventory WHERE item_id=123 FOR UPDATE;
-- Row is now locked. Other transactions wait.
UPDATE inventory SET stock = stock - 1 WHERE item_id = 123;
COMMIT; -- Lock released</div>
    <p style="margin:0;font-size:12px;color:var(--text-primary);opacity:0.75;">Row held locked during transaction. Good when you know conflicts will be frequent. Risk: deadlocks if not careful about lock ordering.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">3. Redis SETNX (Distributed Lock) — For cross-service coordination</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);margin-bottom:6px;">SET lock:item:123 server-uuid-A NX EX 10
-- NX = only set if Not eXists (atomic)
-- EX 10 = auto-expire in 10 seconds (prevents deadlock if server crashes)
-- Returns OK = lock acquired, nil = already locked by another server</div>
    <p style="margin:0;font-size:12px;color:var(--text-primary);opacity:0.75;">Distributed — works across multiple app servers. TTL prevents infinite lock hold. Must release after work: DEL lock:item:123 only if value = server-uuid-A</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Flash Sale — Redis Lock",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Flash Sale: 500 users click "Buy" simultaneously for last item

WITHOUT locking:
  Server 1 reads stock=1, Server 2 reads stock=1
  Both see stock available → both sell → stock=-1 → oversold ❌

WITH Redis SETNX lock:
  Server 1: SET lock:item:456 srv1 NX EX 5  → OK (lock acquired)
  Server 2: SET lock:item:456 srv2 NX EX 5  → nil (lock held by srv1)
  Server 3: SET lock:item:456 srv3 NX EX 5  → nil

  Server 1: reads stock=1, decrements to 0, COMMIT
  Server 1: DEL lock:item:456  (releases lock)

  Server 2 retries: SET → OK (now gets lock)
  Server 2: reads stock=0 → "Sorry, sold out" → reject ✅

TTL safety: if Server 1 crashes before DEL,
  lock auto-expires in 5 seconds → system recovers ✅</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Distributed Lock Pitfalls",
          body: `<div style="display:flex;flex-direction:column;gap:8px;">
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>Lock expires while work is in progress.</strong> Server takes 12 seconds to process but TTL was 10 seconds. Lock expires, another server acquires it, now two servers run simultaneously. Solution: choose TTL significantly longer than max expected processing time, with a "lock extend" heartbeat for long operations.</div>
  </div>
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#ef4444;">❌</span><div><strong>Releasing another server's lock.</strong> Always store your unique ID in the lock value, and only release if the value matches. Otherwise you might release a lock that was re-acquired by someone else after your TTL expired.</div>
  </div>
  <div style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--text-primary);">
    <span style="font-weight:700;flex-shrink:0;color:#f59e0b;">⚠️</span><div><strong>Single Redis node is a SPOF.</strong> If the Redis node goes down, all locks are lost (locks expire safely) but new locks can't be acquired. Use <strong>Redlock</strong> (acquire on N/2+1 Redis nodes) for high-availability needs, but for most cases a single well-monitored Redis is fine.</div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Distributed locks are often overused. <strong>Database optimistic locking handles 90% of concurrency scenarios</strong> without any distributed infrastructure. Use Redis locks when: (a) the operation spans multiple databases or services (so no single DB transaction can help), or (b) you need to prevent duplicate execution of a background job across multiple worker machines.</p>
<p style="margin-top:10px;">For ShopKart's normal checkout (non-flash sale), optimistic locking on the inventory table is sufficient and much simpler. Only flash sales — extreme contention with hundreds of concurrent users on the same item — warrant a Redis lock. Design the simplest solution that works; add complexity only when the simple solution demonstrably fails.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Concurrency & Race Condition Question</strong><br/><span style="color:var(--text-primary);opacity:0.9;">"How do you handle 10,000 users trying to buy the last product simultaneously?" Answer: "For normal checkout, database optimistic locking: UPDATE inventory SET stock = stock-1, version = version+1 WHERE id=X AND version=N AND stock > 0. If 0 rows updated, retry or return sold-out. For extreme flash sales, we put a Redis SETNX lock per item_id with a 5-second TTL. Only the server holding the lock reads and decrements inventory. The TTL prevents deadlock if the server crashes."</span></div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Optimistic:        Pessimistic:        Redis SETNX:
Read (no lock)     SELECT FOR UPDATE   SET key uuid NX EX 10
Update + version   UPDATE              [critical section]
If conflict→retry  COMMIT (unlock)     DEL key if value=uuid

Use when:          Use when:           Use when:
Low contention     High contention     Cross-service,
Most of the time   Same DB txn ok      cross-DB scenarios</div>`,
        },
      ],
    },

    /* 6 */ {
      id: "p14t6",
      title: "System Design Walkthroughs",
      subtitle:
        "URL Shortener and Notification System — seeing how all patterns connect in real interview problems.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "How to Approach System Design",
          body: `<p>Every system design interview follows the same skeleton. Memorise this framework and walk through it explicitly — interviewers reward structured thinking:</p>
<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;">
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">1</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Clarify requirements (2 min):</strong> Functional (what it does) + Non-functional (scale, latency, availability). Never design before knowing the scale.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">2</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Estimate scale (2 min):</strong> Writes/sec, reads/sec, storage GB/year. This determines sharding, caching, and replication decisions.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">3</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Design API (2 min):</strong> Core endpoints. Forces you to think about the contract before the implementation.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">4</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Design data model (3 min):</strong> Tables/collections, key fields. Determines your database choice.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">5</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>High-level architecture (5 min):</strong> Components and how they connect. Start simple, then add caching, queues, and scalability components.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">6</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Deep dive bottlenecks (10 min):</strong> Where will this system break at 10x scale? Work through each bottleneck explicitly.</div></div>
</div>`,
        },
        {
          icon: "🔗",
          color: "si-purple",
          title: "Walkthrough 1: URL Shortener (like bit.ly)",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Scale: 100M URLs. 1B redirects/day. 11,500 reads/sec at peak.

API:
  POST /shorten {url} → {short_code}
  GET  /{short_code}  → 301/302 redirect

Data Model:
  urls: { short_code CHAR(7), long_url TEXT, created_at, user_id, clicks }
  Storage: 100M * ~300 bytes = 30GB → fits on one DB + replicas easily

Short Code Generation (the interesting part):
  Option A: MD5(long_url) → take first 7 chars of base62
    Problem: collision if two different URLs hash to same 7 chars
    Fix: detect collision in DB, append counter and retry
  Option B: Pre-generate 7-char base62 codes, store in a "code pool" table
    Workers pull codes from pool atomically (no collision possible)
    Scales to any write rate
  Option C: Auto-increment ID → encode in Base62
    ID 125 → "2B" in base62. Simple, no collisions. Reveals volume.

Redirect:
  GET /abc1234
    1. Check Redis cache (short_code → long_url, TTL 24h)
    2. Cache miss → read from DB read replica
    3. 301 (permanent, browser caches) vs 302 (temporary, every request hits us)
       → 302 for analytics, 301 to save bandwidth

Bottleneck &amp; Solutions:
  Read-heavy (11,500 reads/sec):
    → Redis cache in front of DB covers 99% of popular links
    → DB read replicas for cache misses
  Analytics (count clicks):
    → Async: write click event to Kafka, consumer aggregates into Redis counter
    → Never block the redirect for analytics</div>`,
        },
        {
          icon: "🔔",
          color: "si-green",
          title: "Walkthrough 2: Notification System",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Scale: 10M users. 1M notifications/day. Multi-channel: push, email, SMS.

The Fan-out Problem:
  Celebrity A has 10M followers. Posts a photo.
  Naive: for each follower, send notification → 10M writes to send queue
  → Takes minutes, queue becomes bottleneck

Solution — Fan-out on Read vs Fan-out on Write:
  Fan-out on Write (push model):
    On post: write notification to each follower's inbox immediately
    Pros: read is O(1) — just fetch your inbox
    Cons: 10M writes per celebrity post → expensive, slow
    Use for: low-follower users (most users)

  Fan-out on Read (pull model):
    On fetch: pull posts from followed celebrities and merge
    Pros: no write amplification
    Cons: read is expensive (merge N feeds per page load)
    Use for: celebrities (top 1% of users by follower count)

  Hybrid: fan-out on write for normal users,
          fan-out on read for celebrities. Same as Instagram.

Architecture:
  1. Event published to Kafka (OrderPlaced, NewFollower, etc.)
  2. Notification Router reads event → decides channels + priority
  3. Priority queues: Transactional (OTP) &gt; Operational (Order shipped) &gt; Marketing
  4. Channel workers: Push worker, Email worker, SMS worker
  5. Retry: dead letter queue for failed deliveries
  6. Deduplication: idempotency key per notification (prevent double send)
  7. User preferences: check DND hours, channel opt-out before sending</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Patterns Used — Connecting the Dots",
          body: `<table style="width:100%;border-collapse:collapse;font-size:13px;">
  <thead>
    <tr style="background:rgba(99,102,241,0.08);">
      <th style="padding:8px 12px;text-align:left;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border);">System</th>
      <th style="padding:8px 12px;text-align:left;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border);">Pattern Applied</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">URL Shortener redirects</td>
      <td style="padding:8px 12px;color:var(--text-primary);">Read replicas + Redis caching (cache-aside)</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">URL click analytics</td>
      <td style="padding:8px 12px;color:var(--text-primary);">Async Kafka event + Cassandra append-only write</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">Notification delivery</td>
      <td style="padding:8px 12px;color:var(--text-primary);">Outbox pattern (guarantee no lost notifications)</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">Celebrity fanout</td>
      <td style="padding:8px 12px;color:var(--text-primary);">CAP trade-off: AP (eventual fan-out is fine)</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px 12px;color:var(--text-primary);">Duplicate notification prevention</td>
      <td style="padding:8px 12px;color:var(--text-primary);">Distributed locking + idempotency keys</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;color:var(--text-primary);">Live order tracking</td>
      <td style="padding:8px 12px;color:var(--text-primary);">SSE (server-sent events, unidirectional push)</td>
    </tr>
  </tbody>
</table>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>System design interviews are not about memorising the "right" answer to "design Twitter". They are about demonstrating a <strong>structured thought process</strong> and the ability to make and justify trade-offs. The interviewer is watching: Do you clarify requirements? Do you break the problem down? Do you name trade-offs explicitly instead of just stating decisions?</p>
<p style="margin-top:10px;">The strongest signal you can send: when you choose one approach over another, <em>name what you're giving up</em>. "I'm using DynamoDB for the URL mapping table because reads will be 100x more frequent than writes and we always look up by a single key. I'm trading the ability to do cross-attribute queries for sub-millisecond read latency and infinite horizontal scale." This is senior-level thinking.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 The Walkthrough Formula</strong><br/><span style="color:var(--text-primary);opacity:0.9;">Open every decision with: "I'm choosing X because of [the specific constraint]. The trade-off is [what we lose]. We mitigate [the risk] by [the mitigation]." Example: "I'm choosing 302 redirect over 301 so every click passes through our servers — we lose browser caching (slightly higher latency for repeat clicks) but gain accurate click analytics. We offset the latency by caching the short_code → URL mapping in Redis, so the server-side lookup is sub-millisecond."</span></div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">URL Shortener:
User → CDN → App Server → Redis (cache hit: 1ms)
                       ↓ cache miss
                   Read Replica → return URL → 302 redirect
                       ↓ async
                   Kafka → Cassandra (click analytics)

Notification System:
Event → Kafka → Router → Priority Queue
                              ├── Push Worker → FCM/APNs
                              ├── Email Worker → SendGrid
                              └── SMS Worker → Twilio
                         ↓ failed
                   Dead Letter Queue → retry / alert</div>`,
        },
      ],
    },
  ],
};

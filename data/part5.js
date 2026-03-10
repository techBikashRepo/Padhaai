/* Part 5 — Architecture Patterns (6 topics) — Deep Rewrite */
const PART5 = {
  id: "part5",
  icon: "🏛️",
  title: "Part 5",
  name: "Architecture Patterns",
  topics: [
    {
      id: "p5t1",
      title: "Monolith vs Microservices",
      subtitle:
        "The fundamental architectural choice that shapes how your system is built, deployed, and scaled.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">A <strong>monolith</strong> is like one giant kitchen that cooks every dish — all code (products, checkout, payments, notifications) lives in one process, one database, one deployable unit. <strong>Microservices</strong> split that kitchen into specialty stations — each with its own chef, tools, and pantry, deployable independently.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why the Choice Matters",
          body: `<p style="margin-bottom:12px;">This decision isn't technical — it's <strong>organisational and scaling-driven</strong>. Microservices solve real problems (independent team velocity, isolated scaling) but introduce equally real costs: network calls instead of method calls, distributed transactions, service discovery, and distributed tracing. Choosing microservices prematurely is one of the most expensive architectural mistakes a team can make.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart's Architecture Evolution",
          body: `<p style="margin-bottom:12px;">Watch how ShopKart's architecture evolves with scale — each phase has a clear trigger.</p>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔵 Phase 1 — Startup (Monolith)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">One Node.js app handles everything: Products, Orders, Payments, Users, Search, Notifications. One PostgreSQL DB. 5 engineers, deploy by pushing to one server.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Fast to build — no network calls</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Transactions span everything</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Whole app must scale together</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Payment bug can crash product listing</span>
    </div>
    <div style="margin-top:10px;font-size:12px;color:var(--accent);font-weight:600;">📌 Use for: &lt;10 engineers, unclear domain boundaries, early-stage startups</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:#10b981;margin-bottom:6px;">🟢 Phase 2 — 10M Users (Modular Monolith)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Still one deployable, but code is modularised with clear internal boundaries. Search extracted as a separate service (needs its own Elasticsearch cluster). 30 engineers, bounded contexts defined.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Clean module boundaries without network overhead</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Easy migration path to microservices later</span>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:#8b5cf6;margin-bottom:6px;">🟣 Phase 3 — 100M Users (Microservices)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Product Service (team of 8) · Order Service (team of 10) · Payment Service (team of 6) · User Service (team of 5) · Search Service (team of 12) · Notification Svc (team of 4) · Inventory Service (team of 8). Each with its own DB and deployment pipeline.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Teams deploy independently</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Scale Search 50x without scaling Orders</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ 7 network hops per checkout</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Distributed tracing required (Jaeger)</span>
    </div>
    <div style="margin-top:10px;font-size:12px;color:#8b5cf6;font-weight:600;">📌 Use for: 100+ engineers, genuine independent scaling needs, stable domain boundaries</div>
  </div>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;margin-bottom:12px;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Start with a well-structured monolith. Extract services when you have clear, stable domain boundaries AND a genuine scaling/team-velocity problem you can't solve otherwise. A distributed monolith (services that share a DB or call each other on every request) is worse than the original monolith.</span>
</div>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"I'd start with a well-structured monolith. Microservices make sense when: (1) specific parts need independent scaling, (2) teams need to deploy independently, (3) different services benefit from different stacks. The cost is distributed transactions, separate CI/CD, and distributed tracing — I'd only pay that cost when benefits are clearly demonstrated."</span>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Microservices on Day 1</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">You don't know your domain boundaries yet. Wrong service cuts = services that must call each other for every operation = a <strong>distributed monolith</strong>. You get all the complexity of microservices with none of the benefits. ShopKart would have split "checkout" and "inventory" as separate services, only to discover checkout calls inventory on every request — now you have synchronous coupling over a network.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Shared Database Between Microservices</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">If Order Service and Inventory Service both write to the same PostgreSQL database, they are coupled at the data layer — schema changes require coordinating both teams. You've lost the key isolation benefit. Each service must own its data entirely — its schema, its migrations, its connection pool.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Conway's Law",
          body: `<p style="margin-bottom:12px;"><strong>Conway's Law:</strong> "Organisations design systems that mirror their own communication structure." Amazon's microservices architecture emerged from their <strong>2-pizza team rule</strong> — no team should need more than 2 pizzas at a single meeting. Each team owns and operates exactly one service. The architecture mirrors the org chart.</p>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Before designing microservices, ask: "Does our org structure support this?" If teams are siloed, microservices will reflect those silos perfectly — including their dysfunctions. The architecture is a mirror. Fix the organisation first; the architecture will follow naturally.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;margin-bottom:12px;">
  <strong style="color:#f59e0b;">🎯 Interview Insight — Conway's Law</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Mentioning Conway's Law in a system design interview signals you think about the sociotechnical dimension of architecture, not just the technical one. Say: "The microservice boundaries should map to team boundaries — this is Conway's Law in practice. Amazon's 2-pizza teams weren't a cultural choice; they were an architectural decision."</span>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<p style="margin-bottom:10px;font-size:13px;">ShopKart architecture evolution at a glance:</p>
<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
Startup:  [All-in-one Monolith] → 1 DB, 1 deploy, 5 engineers<br/>
10M:      [Modular Monolith + Search Svc] → 2 deployables<br/>
100M:     [7 Microservices] → 7 DBs, 7 pipelines, 200 engineers<br/><br/>
Triggers to extract a service:<br/>
• Independent scaling needed (Search needs 10× CPU vs Checkout)<br/>
• Team autonomy blocked by shared code/deploy coordination<br/>
• Different tech stack justified (ML model needs Python)
</div>`,
        },
      ],
    },

    {
      id: "p5t2",
      title: "Layered Architecture",
      subtitle:
        "Separating concerns into horizontal layers — each with a clear, single responsibility.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Layered architecture</strong> organises code like a building — each floor has one job and can only talk to the floor directly below. The classic four floors: <strong>Presentation</strong> (HTTP, routing), <strong>Business Logic</strong> (rules, calculations), <strong>Data Access</strong> (queries, ORM), and <strong>Database</strong>. No floor skips a level. No floor does another floor's job.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "The Four Layers",
          body: `<p style="margin-bottom:10px;font-size:13px;">Each layer has one strict responsibility — violating this is how codebases become unmaintainable:</p>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">Layer 1 — Presentation (Controllers / Route Handlers)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Parse HTTP request, validate input shape, call service, format HTTP response. <strong>Does NOT contain business logic.</strong> Does NOT touch the database.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:#10b981;margin-bottom:4px;">Layer 2 — Business Logic (Services)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Business rules, orchestration between services, calculations, domain decisions. <strong>Does NOT know about HTTP</strong> (no req/res). Does NOT contain raw SQL.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:#8b5cf6;margin-bottom:4px;">Layer 3 — Data Access (Repositories / DAOs)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Database queries, ORM operations, transaction management. Returns domain objects, not raw rows. <strong>Does NOT contain business rules.</strong></p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:#f59e0b;margin-bottom:4px;">Layer 4 — Database (PostgreSQL, Redis)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Persistent storage. The only layer that knows about tables, indexes, and schemas.</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Order Flow Through Layers",
          body: `<p style="margin-bottom:10px;font-size:13px;">A single POST /orders request flowing through all four layers — notice how each layer knows nothing about the layers above it:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:12px;">
// CONTROLLER — handles HTTP only<br/>
const { items, shippingAddress } = validateBody(req.body, schema);<br/>
const order = await orderService.placeOrder(req.userId, items, shippingAddress);<br/>
res.status(201).json({ order });<br/><br/>
// SERVICE — business logic, no HTTP, no SQL<br/>
async placeOrder(userId, items, address) &#123;<br/>
&nbsp;&nbsp;await inventoryService.reserveItems(items);  // orchestration<br/>
&nbsp;&nbsp;const total = calculateTotal(items);          // business logic<br/>
&nbsp;&nbsp;const order = await orderRepo.create(&#123;userId, items, total, address&#125;);<br/>
&nbsp;&nbsp;await notificationService.orderConfirmation(userId, order);<br/>
&nbsp;&nbsp;return order;<br/>
&#125;<br/><br/>
// REPOSITORY — data access, no business rules<br/>
async create(orderData) &#123;<br/>
&nbsp;&nbsp;return db.transaction(async (trx) =&gt; &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;const order = await trx('orders').insert(&#123;...&#125;).returning('*');<br/>
&nbsp;&nbsp;&nbsp;&nbsp;await trx('order_items').insert(orderData.items.map(...));<br/>
&nbsp;&nbsp;&nbsp;&nbsp;return order;<br/>
&nbsp;&nbsp;&#125;);<br/>
&#125;
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;margin-bottom:12px;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Each layer must be independently testable. The service layer must be testable with a mock repository (no real DB). If you can't test business logic without starting a database, your layers are leaking. Target: 80% of tests run in under 1 second with zero external dependencies.</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Why Layers Matter",
          body: `<p style="margin-bottom:12px;">The key benefit is <strong>replaceability</strong>. When ShopKart migrated from PostgreSQL to Aurora, only the Repository layer changed — zero service layer changes. When the team added a GraphQL API alongside REST, only a new Controller layer was added — the same services powered both. This is the <strong>Dependency Inversion Principle</strong>: high-level policy (business logic) does not depend on low-level detail (databases, HTTP frameworks).</p>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"We use layered architecture with strict separation. Moving from REST to GraphQL was a controller-layer change only — the service and repository layers were untouched. Switching ORMs required only repository layer changes. Our business logic test suite runs in 28 seconds with no database." The concrete benefit of testing speed always lands well.</span>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
HTTP Request → Controller (validate, route)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Service (business logic, orchestration)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
&nbsp;&nbsp;&nbsp;Repository (SQL, ORM, transactions)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Database (PostgreSQL / Redis)<br/><br/>
Dependency direction: always downward only.<br/>
No layer skips; no layer looks up.
</div>`,
        },
      ],
    },

    {
      id: "p5t3",
      title: "Controller-Service-Repository Pattern",
      subtitle:
        "The specific three-layer pattern used in most Node.js, Spring, and .NET applications.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">The <strong>Controller-Service-Repository</strong> (CSR) pattern is layered architecture made concrete. Think of it as three specialists: a <strong>receptionist</strong> (Controller — handles HTTP conversations), a <strong>domain expert</strong> (Service — knows the business rules), and a <strong>librarian</strong> (Repository — knows where the data lives). Each does exactly their job, never stepping into the others'.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Product Module — CSR",
          body: `<p style="margin-bottom:10px;font-size:13px;">The same product fetch operation, implemented correctly at each layer:</p>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔵 productController.js — HTTP Interface</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
router.get('/:id', async (req, res) =&gt; &#123;<br/>
&nbsp;&nbsp;const &#123; id &#125; = validateParams(req.params, &#123; id: Joi.number() &#125;);<br/>
&nbsp;&nbsp;const product = await productService.getById(id);<br/>
&nbsp;&nbsp;if (!product) return res.status(404).json(notFoundError('product'));<br/>
&nbsp;&nbsp;res.json(product);  // handles HTTP, nothing else<br/>
&#125;);
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:#10b981;margin-bottom:6px;">🟢 productService.js — Business Logic</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
async getById(productId) &#123;<br/>
&nbsp;&nbsp;const product = await productRepo.findById(productId);<br/>
&nbsp;&nbsp;if (!product || !product.isActive) return null;  // business rule<br/>
&nbsp;&nbsp;const enriched = await reviewService.enrichWithRatings(product);<br/>
&nbsp;&nbsp;// NO req/res, NO raw SQL — pure domain logic<br/>
&nbsp;&nbsp;return enriched;<br/>
&#125;
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:#8b5cf6;margin-bottom:6px;">🟣 productRepository.js — Data Access</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
async findById(id) &#123;<br/>
&nbsp;&nbsp;const row = await db('products').where(&#123; id, deleted_at: null &#125;).first();<br/>
&nbsp;&nbsp;return row ? mapToProduct(row) : null;  // domain object, not raw row<br/>
&nbsp;&nbsp;// NO business rules; just data access<br/>
&#125;
    </div>
  </div>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">The service layer must never hold a database connection. If you can't test a service method with a mock repository in under 5ms, the layers are leaking. Keep the layers honest by enforcing strict import rules — services may not import from db drivers directly.</span>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Anti-Patterns",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Fat Controller</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Business logic in controllers. The controller becomes a 500-line file mixing HTTP parsing, business rules, and SQL. You can't test business logic without an HTTP request. ShopKart's checkout controller had 800 lines — one engineer owned it because no one else understood it.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Fat Service with SQL</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Raw SQL or ORM calls directly in services. Testing requires a live database. When ShopKart migrated from knex to Prisma, services with embedded SQL needed full rewrites instead of simple repository swaps.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Skipping the Repository Layer</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Services calling the ORM directly. When the database changes, you rewrite every service instead of just the repositories. The repository is the seam that makes the database swappable.</p>
  </div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight — Code Organisation</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"We follow the Controller-Service-Repository pattern. Controllers handle HTTP parsing and validation — nothing else. Services contain all business logic and are tested with mock repositories — no DB required. Repositories handle all SQL. This means we can test 80% of business logic without a database, and our full service test suite runs in under 30 seconds." The concrete testing speed metric is what impresses interviewers.</span>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
HTTP POST /orders<br/>
&nbsp;&nbsp;→ Controller: parse body, validate schema<br/>
&nbsp;&nbsp;→ Service: check inventory, calc total, emit events<br/>
&nbsp;&nbsp;→ Repository: INSERT into orders + order_items (transaction)<br/>
&nbsp;&nbsp;→ DB: PostgreSQL<br/><br/>
Each layer tested independently:<br/>
&nbsp;&nbsp;Controller: supertest HTTP tests (~50ms each)<br/>
&nbsp;&nbsp;Service: jest unit tests with mock repo (~2ms each)<br/>
&nbsp;&nbsp;Repository: integration tests with test DB (~200ms each)
</div>`,
        },
      ],
    },

    {
      id: "p5t4",
      title: "Clean Architecture",
      subtitle:
        "Dependency rules that protect business logic from infrastructure changes.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Clean Architecture</strong> (Robert C. Martin) organises code in concentric rings where the innermost ring — your <strong>business rules</strong> — has zero dependencies on anything outside it. The <strong>Dependency Rule</strong>: source code references can only point inward. Your ShopKart order logic never imports Express, PostgreSQL, or Stripe. It knows nothing of infrastructure.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "The Concentric Circles",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">⚪ Ring 1 — Entities (innermost)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Core domain models and pure business rules. <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">Order</code>, <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">Product</code>, <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">Money</code>. <strong>Zero imports from any framework, library, or DB driver.</strong> These classes work the same whether your backend is Express or AWS Lambda.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:#10b981;margin-bottom:4px;">🟢 Ring 2 — Use Cases (Application Business Rules)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">PlaceOrderUseCase</code>, <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">ProcessRefundUseCase</code>. Knows entities; calls repository/gateway <em>interfaces</em> (not implementations). No Express. No PostgreSQL. Only interfaces.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:#8b5cf6;margin-bottom:4px;">🟣 Ring 3 — Interface Adapters</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Controllers, Repository implementations, Gateway implementations. This is where <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">PostgresOrderRepository</code> lives — it implements the inner ring's interface.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:#f59e0b;margin-bottom:4px;">🔴 Ring 4 — Frameworks & Drivers (outermost)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Express.js, PostgreSQL, Redis, Stripe, AWS SDK. These change. Your inner rings adapt, but never change because of this ring.</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Clean Architecture Example",
          body: `<p style="margin-bottom:10px;font-size:13px;">How dependency inversion works in practice — the inner layer defines the interface, the outer layer implements it:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
// ENTITY — zero imports<br/>
class Order &#123;<br/>
&nbsp;&nbsp;addItem(item: OrderItem): void &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;if (this.items.length &gt;= 50) throw new Error('MAX_ITEMS');<br/>
&nbsp;&nbsp;&nbsp;&nbsp;this.items.push(item); &#125;<br/>
&nbsp;&nbsp;calculateTotal(): Money &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;return this.items.reduce((s,i) =&gt; s.add(i.subtotal()), Money.zero()); &#125;<br/>
&#125;<br/><br/>
// USE CASE — depends on interfaces, not implementations<br/>
class PlaceOrderUseCase &#123;<br/>
&nbsp;&nbsp;constructor(<br/>
&nbsp;&nbsp;&nbsp;&nbsp;private orderRepo: IOrderRepository,    // interface<br/>
&nbsp;&nbsp;&nbsp;&nbsp;private paymentGateway: IPaymentGateway  // interface<br/>
&nbsp;&nbsp;) &#123;&#125;<br/>
&nbsp;&nbsp;async execute(cmd: PlaceOrderCommand) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;const order = new Order(cmd);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;await this.orderRepo.save(order); // no PostgreSQL here<br/>
&nbsp;&nbsp;&nbsp;&nbsp;await this.paymentGateway.charge(order.total); // no Stripe here<br/>
&nbsp;&nbsp;&nbsp;&nbsp;return order;<br/>
&nbsp;&nbsp;&#125;<br/>
&#125;<br/><br/>
// OUTER RING — concrete implementation<br/>
class PostgresOrderRepository implements IOrderRepository &#123;<br/>
&nbsp;&nbsp;async save(order: Order) &#123; /* PostgreSQL code */ &#125;<br/>
&#125;
</div>

<div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;margin-bottom:14px;">
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Use cases testable with in-memory repo (no DB)</span>
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Swap Stripe for Razorpay — only gateway impl changes</span>
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Migrate PostgreSQL to Aurora — only repo impl changes</span>
  <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ More boilerplate (interfaces for everything)</span>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;margin-bottom:12px;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Clean Architecture earns its cost for long-lived systems with anticipated infrastructure changes. For a 6-month startup MVP, the overhead is unwarranted. For a 5-year enterprise platform where payment providers and databases will change, the isolation pays dividends on every future change.</span>
</div>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"Our order processing logic has no import statements pointing to Express or PostgreSQL. Use-case tests run with an in-memory repository at 2ms each. When we migrated from Stripe to Razorpay, we wrote a new IPaymentGateway implementation and updated the DI container — zero use-case or entity changes."</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p style="margin-bottom:12px;">The question every architect must ask is: <strong>"What is allowed to know about what?"</strong> In Clean Architecture, business rules are sovereign — they dictate the interface contracts that infrastructure must fulfil. This inversion means the most important code (your domain, your competitive advantage) is also the most isolated and the most testable. Frameworks are plugins; databases are details; HTTP is a delivery mechanism.</p>`,
        },
      ],
    },

    {
      id: "p5t5",
      title: "BFF — Backend for Frontend",
      subtitle:
        "Tailored API backends designed for each client's unique needs.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>BFF (Backend for Frontend)</strong> is the pattern of building a dedicated backend for each type of client — mobile app, web app, TV app each get their own BFF service. Each BFF is tightly coupled to its client's exact data shape, usage patterns, and interaction model. Think of it as a bespoke suit, not a one-size-fits-all jacket.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why One API Isn't Enough",
          body: `<p style="margin-bottom:12px;">ShopKart's product page has radically different needs across clients:</p>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">📱 Mobile App</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Small screen, slow 4G, battery-sensitive. Needs: product name, ONE thumbnail (80px), price, rating, in-stock badge. Total payload: ~500 bytes. A generic 15KB response wastes 30× the network.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:#10b981;margin-bottom:4px;">🖥️ Web App</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Large screen, fast broadband. Needs: full product data, all 12 images, 50 reviews, specifications table, related products, seller info. Total payload: ~15KB. A 500-byte response would force 20 additional API calls.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:#8b5cf6;margin-bottom:4px;">📺 Smart TV App</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">10-foot UI, no keyboard, remote control. Needs: product name, ONE large HD image (1920×1080), price. Total payload: ~3KB. Needs different auth flow (PIN vs password).</p>
  </div>
</div>

<p style="font-size:13px;color:var(--text-primary);opacity:0.85;">A generic API either over-fetches (mobile downloads 15KB for 500 bytes of need) or under-fetches (web makes 20 trips). BFF gives each client exactly what it needs in one request.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart BFF Architecture",
          body: `<p style="margin-bottom:10px;font-size:13px;">Three BFFs, same downstream microservices — each BFF aggregates and shapes data for its specific client:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
Downstream: Product Svc | Review Svc | Inventory Svc | Recommendation Svc<br/><br/>
 Mobile BFF (Node.js)&nbsp;&nbsp; &nbsp;&nbsp;Web BFF (Next.js)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TV BFF (Node.js)<br/>
GET /product/:id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GET /product/:id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GET /product/:id<br/>
Returns: &#123;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns: &#123;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns: &#123;<br/>
&nbsp;name, thumb,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; full product + reviews,&nbsp;&nbsp;&nbsp;name, hd_image,<br/>
&nbsp;price, rating&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; specs, related products&nbsp;&nbsp;&nbsp;price<br/>
&#125; ~500 bytes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125; ~15KB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125; ~3KB
</div>

<div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;margin-bottom:14px;">
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ One round-trip per page (no waterfalls)</span>
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Frontend team owns and deploys their BFF</span>
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Client-specific auth flows per BFF</span>
  <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ More services to maintain and deploy</span>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;margin-bottom:12px;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">BFFs must stay thin. They aggregate and transform data — they never contain business rules. The moment a BFF starts enforcing inventory rules or pricing logic, you've created a hidden service owner. Business rules belong in upstream microservices.</span>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Business Logic in BFFs</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">BFFs become fat with pricing calculations, discount rules, and inventory checks. Now you have the same business logic duplicated across 3 BFFs. One change = three PRs, three deployments, three test suites. BFFs should be transparent pipes that aggregate and reshape.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ One Generic BFF for All Clients</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">This is just a renamed API with growing if-else branches for mobile/web/TV. "If platform === 'mobile' return minimal data." After 6 months it's a 2,000-line file that nobody wants to touch. Separate BFFs are separate concerns.</p>
  </div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight — API Gateway vs BFF</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"BFF is different from an API Gateway. The API Gateway is infrastructure — it handles auth, rate limiting, SSL termination, and routing. A BFF is an application service — it aggregates data from multiple microservices and shapes the response for its specific client. ShopKart has one Kong API Gateway and three BFFs behind it. They are complementary, not alternatives."</span>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
[Mobile App] [Web App] [TV App]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;↓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
[Mobile BFF] [Web BFF] [TV BFF]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;↓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
Product Svc | Review Svc | Inventory Svc<br/><br/>
API Gateway sits in front of all BFFs.<br/>
BFFs sit in front of all microservices.<br/>
Each layer does exactly one job.
</div>`,
        },
      ],
    },

    {
      id: "p5t6",
      title: "API Gateway",
      subtitle:
        "The single entry point that handles authentication, routing, rate limiting, and more.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">An <strong>API Gateway</strong> is the front door to your microservice architecture. Every external request — from mobile, web, third-party integrations — passes through exactly one entry point. The gateway handles <strong>cross-cutting concerns</strong>: authentication, rate limiting, SSL termination, routing, request logging, and CORS. Individual services never implement these themselves.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Without an API Gateway",
          body: `<p style="margin-bottom:12px;">Without a gateway, ShopKart's 7 microservices each independently implement: JWT validation, rate limiting, CORS headers, SSL termination, request ID injection, and distributed tracing. <strong>7 services × 8 cross-cutting concerns = 56 implementations.</strong> When a JWT library has a security vulnerability, you're patching 7 different codebases, owned by 7 different teams, with 7 separate PRs and deployments. The gateway makes this a single change.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart API Gateway",
          body: `<p style="margin-bottom:10px;font-size:13px;">All traffic flows through Kong. Services live on private subnets — not publicly reachable:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
Rahul's browser → HTTPS request<br/>
&nbsp;&nbsp;&nbsp;↓<br/>
[KONG API GATEWAY]<br/>
1. SSL termination (HTTPS → HTTP internally)<br/>
2. JWT validation → attach X-User-ID: 42 to request<br/>
3. Authorization: route requires CUSTOMER role ✔<br/>
4. Rate limit: 600 req/min for user-42 (Redis-backed)<br/>
5. Inject X-Request-ID: req-a3f2b1c4<br/>
6. Route by URL prefix:<br/>
&nbsp;&nbsp;&nbsp;/api/products/* → Product Service :3001<br/>
&nbsp;&nbsp;&nbsp;/api/orders/*&nbsp;&nbsp;→ Order Service :3002<br/>
&nbsp;&nbsp;&nbsp;/api/payments/* → Payment Service :3004<br/>
7. Circuit break if service returns 5xx for &gt;10s<br/>
&nbsp;&nbsp;&nbsp;↓<br/>
Product Service (private subnet, no auth code, no rate limit code)
</div>

<div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;margin-bottom:14px;">
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ One security patch updates all 7 services</span>
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Services on private subnets (not internet-exposed)</span>
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Canary deployments via gateway routing rules</span>
  <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Gateway is a single point of failure (deploy in HA)</span>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "API Gateway vs Load Balancer vs BFF",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:10px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;font-size:12px;">
    <div style="font-weight:700;"></div>
    <div style="font-weight:700;color:var(--accent);">Load Balancer</div>
    <div style="font-weight:700;color:#10b981;">API Gateway</div>
    <div style="font-weight:700;color:#8b5cf6;">BFF</div>
  </div>
  <div style="padding:10px 16px;border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;font-size:12px;">
    <div style="font-weight:600;opacity:0.7;">Layer</div>
    <div>L4/L7 network</div>
    <div>L7 application</div>
    <div>Application service</div>
  </div>
  <div style="padding:10px 16px;border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;font-size:12px;">
    <div style="font-weight:600;opacity:0.7;">Knows about</div>
    <div>IPs, ports, health</div>
    <div>APIs, auth, rates</div>
    <div>Client data needs</div>
  </div>
  <div style="padding:10px 16px;border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;font-size:12px;">
    <div style="font-weight:600;opacity:0.7;">Job</div>
    <div>Traffic distribution</div>
    <div>Cross-cutting concerns</div>
    <div>Client-specific aggregation</div>
  </div>
  <div style="padding:10px 16px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;font-size:12px;">
    <div style="font-weight:600;opacity:0.7;">Examples</div>
    <div>AWS ALB, nginx</div>
    <div>Kong, AWS API GW, Apigee</div>
    <div>Custom Node.js svc</div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p style="margin-bottom:12px;">The API Gateway is also the control plane for <strong>canary deployments</strong>: route 5% of traffic to the new version of a service, monitor error rates and P99 latency, then gradually shift to 50% → 100%. Roll back instantly by changing a routing weight. ShopKart runs every major deployment as a canary — no big-bang releases. The gateway's routing config controls this with zero code changes.</p>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">The API Gateway is the only component that should be publicly reachable. All microservices live in private subnets. This isn't just convenience — it's a security boundary. Lateral movement in a breach is impossible if services can't talk to the internet directly.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight — Microservices Entry Point</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">In any microservices system design, draw the API gateway as the first component after the internet: "All external traffic enters through Kong. It validates JWTs, enforces rate limits, and routes to services on private subnets. Microservices receive a pre-authenticated request with X-User-ID injected — no auth code in services. A JWT library vulnerability is one patch, not seven."</span>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Quick Visual",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
Internet<br/>
&nbsp;&nbsp;&nbsp;↓<br/>
[API Gateway] ← auth, rate limit, routing, logging<br/>
&nbsp;&nbsp;&nbsp;↓<br/>
[BFF Mobile] [BFF Web] ← data aggregation, shaping<br/>
&nbsp;&nbsp;&nbsp;↓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
Product Svc | Order Svc | Payment Svc | User Svc<br/>
(private subnet — no internet access)
</div>`,
        },
      ],
    },
  ],
};

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
          body: `<p>A <strong>monolith</strong> is a single deployable unit where all application code — product listing, checkout, payments, notifications — runs in one process, shares one database, and is deployed together as one artifact. <strong>Microservices</strong> split these capabilities into separate independently deployable services, each with its own codebase, database, and deployment lifecycle.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why the Choice Matters",
          body: `<p>This is not a technical decision — it's an organisational and scaling decision. Microservices solve specific problems: independent team velocity, independent scaling of specific services, independent deployment of features. But they introduce significant complexity: network calls (not method calls), distributed transactions, service discovery, and distributed debugging. Choosing microservices when you don't need them is one of the most common architectural mistakes.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart's Architecture Evolution",
          body: `<div class="diagram-box">Phase 1 — Startup (monolith):
  One Node.js app handles: Products, Orders, Payments, Users, Search, Notifications
  One PostgreSQL database
  Deploy = push to one server
  
  ✅ Fast to build (no network calls, simple debugging)
  ✅ Transactions span everything
  ✅ 5 engineers can run the whole thing locally
  ❌ Scaling: whole app must scale even if only search is slow
  ❌ One bug in payment code can crash the product listing

Phase 2 — 10M users (bounded monolith or modular monolith):
  Still one deployable but code is modularised with clear boundaries.
  Search extracted to separate service (needs its own Elasticsearch).

Phase 3 — 100M users, 200 engineers (microservices):
  Product Service    (team of 8)  → own DB (products, categories)
  Order Service      (team of 10) → own DB (orders, order_items)
  Payment Service    (team of 6)  → own DB (payments, refunds)
  User Service       (team of 5)  → own DB (users, addresses)
  Search Service     (team of 12) → Elasticsearch
  Notification Svc   (team of 4)  → event-driven, Kafka-based
  Inventory Service  (team of 8)  → own DB (stock, warehouses)
  
  ✅ Teams deploy independently (no coordinated releases)
  ✅ Scale Search service 50x without scaling Order service
  ✅ Payment team can change stack without touching Order team
  ❌ 7 network hops for a checkout (latency)
  ❌ Distributed transactions (saga pattern needed)
  ❌ Debugging requires distributed tracing (Jaeger/Zipkin)</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Starting with microservices on day 1.</strong> You don't know your domain boundaries yet. Wrong service boundaries = services that must call each other for every operation = a distributed monolith (worst of both worlds). Start monolith, extract services when you have clear, stable domain boundaries and genuine scaling needs.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Sharing a database between microservices.</strong> If the Order Service and Inventory Service both write to the same database, they're coupled — you've lost the key benefit of microservices. Each service must own its data entirely.</div></div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Conway's Law",
          body: `<p><strong>Conway's Law</strong>: "Organisations design systems that mirror their own communication structure." Amazon's microservices architecture emerged from their "2-pizza team" rule — no team should need more than 2 pizzas at a meeting. Each team owns and operates its own service. The architecture mirrors the org chart. Before designing microservices, ask: "Does our org structure support this?" Microservices without matching team structure become coordination nightmares.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">When to Use Each</div><div class="interview-q">Interviewers love this question. Answer: "I'd start with a well-structured monolith. Microservices make sense when: (1) specific parts need independent scaling (our search service needs 10x capacity of checkout), (2) different teams need to deploy independently without coordination, (3) different services benefit from different tech stacks. The cost is operational complexity — distributed tracing, separate CI/CD, service discovery, and distributed transactions. I'd only pay that cost when the benefits are clearly demonstrated."</div></div>`,
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
          body: `<p><strong>Layered architecture</strong> organises code into horizontal layers where each layer has a specific responsibility and can only call the layer directly below it. The classic pattern has four layers: Presentation (API/Controllers), Business Logic (Services), Data Access (Repositories), and Database. Each layer hides its implementation from the layer above.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "The Four Layers",
          body: `<div class="diagram-box">HTTP Request from Rahul's browser
        ↓
┌─────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Controllers / Route Handlers)  │
│  Responsibility: Parse HTTP, validate input,        │
│  call service, format HTTP response                 │
│  Does NOT contain business logic                    │
└──────────────────────┬──────────────────────────────┘
                       ↓ method call
┌─────────────────────────────────────────────────────┐
│  BUSINESS LOGIC LAYER (Services)                    │
│  Responsibility: Business rules, orchestration,     │
│  calculations, domain decisions                     │
│  Does NOT know about HTTP or databases              │
└──────────────────────┬──────────────────────────────┘
                       ↓ method call
┌─────────────────────────────────────────────────────┐
│  DATA ACCESS LAYER (Repositories / DAOs)            │
│  Responsibility: Database queries, ORM operations   │
│  Does NOT contain business rules                    │
│  Returns domain objects, not raw SQL results        │
└──────────────────────┬──────────────────────────────┘
                       ↓ SQL query
┌─────────────────────────────────────────────────────┐
│  DATABASE LAYER (PostgreSQL, Redis)                 │
│  Responsibility: Persistent storage                 │
└─────────────────────────────────────────────────────┘</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Order Flow Through Layers",
          body: `<div class="diagram-box">POST /orders request:

CONTROLLER (orderController.js):
  const { items, shippingAddress } = validateBody(req.body, orderSchema);
  const order = await orderService.placeOrder(req.userId, items, shippingAddress);
  res.status(201).json({ order });

SERVICE (orderService.js):
  async placeOrder(userId, items, address) {
    await inventoryService.reserveItems(items);   // business rule
    const total = calculateTotal(items);           // business logic
    const order = await orderRepository.create({userId, items, total, address});
    await notificationService.orderConfirmation(userId, order);
    await paymentService.initiate(order.id, total);
    return order;
  }

REPOSITORY (orderRepository.js):
  async create(orderData) {
    return db.transaction(async (trx) => {
      const order = await trx('orders').insert({...}).returning('*');
      await trx('order_items').insert(orderData.items.map(...));
      return order;
    });
  }</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Why Layers Matter",
          body: `<p>The key benefit of layered architecture is <strong>testability and replaceability</strong>. To test orderService, you can mock the repository (no real database needed). Business logic tests run in milliseconds. If you switch from PostgreSQL to MongoDB, only the Repository layer changes — no business logic changes. If you switch from REST to GraphQL, only the Controller layer changes. Each layer is independently changeable because layers depend on abstractions (interfaces), not concrete implementations. This is the <strong>Dependency Inversion Principle</strong> in practice.</p>`,
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
          body: `<p>The <strong>Controller-Service-Repository</strong> (CSR) pattern is a specific implementation of layered architecture. <strong>Controller</strong>: handles HTTP, validation, and response. <strong>Service</strong>: business logic and orchestration. <strong>Repository</strong>: data access and persistence. Each layer does exactly one thing.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Product Module — CSR",
          body: `<div class="diagram-box">productController.js — HTTP Interface:
  router.get('/:id', async (req, res) => {
    const { id } = validateParams(req.params, { id: Joi.number() });
    const product = await productService.getById(id);
    if (!product) return res.status(404).json(notFoundError('product'));
    res.json(product);  ← controller handles HTTP, nothing else
  });

productService.js — Business Logic:
  async getById(productId) {
    const product = await productRepo.findById(productId);
    if (!product || !product.isActive) return null;  ← business rule
    const enriched = await reviewService.enrichWithRatings(product); ← orchestration
    const cached = await cacheService.setIfAbsent(
      \`product:\${productId}\`, enriched, 300);       ← caching decision
    return enriched;
    // Service has NO knowledge of HTTP (no req/res)
    // Service has NO raw SQL
  }

productRepository.js — Data Access:
  async findById(id) {
    const row = await db('products')
      .where({ id, deleted_at: null })
      .first();
    return row ? mapToProduct(row) : null;  ← returns domain object, not raw DB row
    // Repository has NO business rules
  }</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Anti-Patterns",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>"Fat Controller"</strong>: Business logic in controllers. The controller becomes a 500-line file mixing HTTP parsing, business rules, and SQL queries. Untestable, unmaintainable.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>"Fat Service with SQL"</strong>: Direct SQL in services. Services should call repositories, not databases. Makes testing require a real database.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Skipping the Repository layer</strong>: Services calling ORM directly. When you switch databases or ORMs, you rewrite every service instead of just the repository layer.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Code Organisation</div><div class="interview-q">When asked about code architecture: "We follow the Controller-Service-Repository pattern. Controllers handle HTTP parsing and validation. Services contain business logic and are tested with mock repositories — no DB required. Repositories handle all SQL. This separation means we can test 80% of our business logic without a database, and our test suite runs in under 30 seconds." Testing speed is the concrete benefit that impresses interviewers.</div></div>`,
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
          body: `<p><strong>Clean Architecture</strong> (Robert C. Martin) organises code in concentric circles where the innermost circle (business rules/entities) has zero dependencies on the outer circles (databases, frameworks, UI). The <strong>Dependency Rule</strong>: source code dependencies can only point INWARD. Business logic never depends on Express, PostgreSQL, or any framework.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "The Concentric Circles",
          body: `<div class="diagram-box">Outer to inner (dependencies point inward):

┌─────────────────────────────────────────┐
│  FRAMEWORKS & DRIVERS (outermost)       │
│  Express.js, PostgreSQL, Redis, Stripe  │
│  → These change. Your code adapts.      │
│  ┌─────────────────────────────────┐    │
│  │  INTERFACE ADAPTERS             │    │
│  │  Controllers, Repositories,     │    │
│  │  Gateways, Presenters           │    │
│  │  ┌───────────────────────────┐  │    │
│  │  │  USE CASES                │  │    │
│  │  │  Application business     │  │    │
│  │  │  rules, Service layer     │  │    │
│  │  │  ┌─────────────────────┐  │  │    │
│  │  │  │  ENTITIES            │  │  │    │
│  │  │  │  Core domain models  │  │  │    │
│  │  │  │  Pure business rules │  │  │    │
│  │  │  │  Zero dependencies   │  │  │    │
│  │  │  └─────────────────────┘  │  │    │
│  │  └───────────────────────────┘  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

The inner circles know NOTHING about Express or PostgreSQL.
The outer circles know about everything.</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Clean Architecture Example",
          body: `<div class="diagram-box">ENTITY (pure TypeScript, zero imports):
  class Order {
    private items: OrderItem[];
    
    addItem(item: OrderItem): void {
      if (this.items.length >= 50) throw new Error('MAX_ITEMS');
      this.items.push(item);
    }
    
    calculateTotal(): Money {  ← pure business logic, no DB, no HTTP
      return this.items.reduce((sum, item) => sum.add(item.subtotal()), Money.zero());
    }
  }

USE CASE (knows entities, knows interfaces, doesn't know implementations):
  class PlaceOrderUseCase {
    constructor(
      private orderRepo: IOrderRepository,    ← interface, not PostgreSQL
      private paymentGateway: IPaymentGateway ← interface, not Stripe
    ) {}
    
    async execute(command: PlaceOrderCommand): Promise<Order> {
      const order = new Order(command);
      order.validate();  ← entity business rules
      await this.orderRepo.save(order);  ← interface call
      await this.paymentGateway.charge(order.total); ← interface call
      return order;
    }
  }

REPOSITORY IMPLEMENTATION (outer layer — knows PostgreSQL):
  class PostgresOrderRepository implements IOrderRepository {
    async save(order: Order): Promise<void> { ... PostgreSQL code ... }
  }
  
Testing: swap PostgresOrderRepository with InMemoryOrderRepository
→ Tests run with zero DB dependency, millisecond speed.</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Clean Architecture shines when you anticipate infrastructure changes. "We might switch from Stripe to Razorpay" → if your payment logic is behind an interface, it's a configuration change, not a code rewrite. "We might move from PostgreSQL to Aurora" → only repository implementations change. The inner-layer isolation also enables comprehensive unit testing without any external dependencies. For small projects, Clean Architecture adds overhead. For complex domains with long lifespans (5+ years), the upfront investment in boundaries pays dividends in every future change.</p>`,
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
          body: `<p><strong>BFF</strong> (Backend for Frontend) is the pattern of creating a separate backend service for each type of frontend client — one BFF for the mobile app, one for the web app, one for the TV app. Each BFF is tightly coupled to its frontend's specific data needs, data shape, and usage patterns.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why One API Isn't Enough",
          body: `<p>ShopKart has three clients with very different needs for the same product page:</p>
<ul>
  <li><strong>Mobile app</strong>: Small screen, slow network, battery conscious. Needs: product name, ONE small image, price, rating, in-stock badge. Total: ~500 bytes.</li>
  <li><strong>Web app</strong>: Large screen, fast network. Needs: full product data, all images, specifications, reviews, related products, seller info. Total: ~15KB.</li>
  <li><strong>TV app</strong>: No keyboard, 10-foot UI, large thumbnails. Needs: product name, ONE large image, price. Total: ~3KB.</li>
</ul>
<p>A generic API that serves all clients either over-fetches (mobile gets 15KB it doesn't need) or under-fetches (web gets 500 bytes and needs 20 additional calls). BFF solves this by giving each client exactly what it needs.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart BFF Architecture",
          body: `<div class="diagram-box">Downstream Microservices (unchanged):
  Product Service | Review Service | Inventory Service | Recommendation Service

           ↑               ↑               ↑
  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
  │  Mobile BFF    │ │  Web BFF       │ │  TV BFF        │
  │  Node.js       │ │  Node.js + SSR │ │  Node.js       │
  │                │ │                │ │                │
  │ GET /product   │ │ GET /product   │ │ GET /product   │
  │ Returns:       │ │ Returns:       │ │ Returns:       │
  │ {name, thumb,  │ │ {full product  │ │ {name,         │
  │  price, rating}│ │  data + reviews│ │  hd_image,     │
  │  ~500 bytes    │ │  ~15KB         │ │  price}        │
  └────────────────┘ └────────────────┘ └────────────────┘
         ↑                   ↑                  ↑
  Mobile App           Web Browser           Smart TV App

Each BFF:
  ✅ Aggregates data from multiple microservices in one call
  ✅ Returns exactly the shape the frontend needs
  ✅ Can handle mobile-specific auth flows (PIN vs password)
  ✅ Frontend team owns and deploys their own BFF</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Creating a BFF and then adding business logic to it.</strong> BFFs should be thin adapters — they aggregate and transform data, not contain business rules. Business rules in upstream services only. A fat BFF becomes a maintenance problem.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>One generic BFF for all clients.</strong> This defeats the purpose. You'll add more and more if-else branches for each client type until the "BFF" is just a mess.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Client-Specific APIs</div><div class="interview-q">When discussing API gateway vs BFF: "BFF is different from API Gateway — the Gateway is infrastructure (auth, rate limiting, routing), while BFF is application logic (aggregation, transformation). Mobile clients need different data shapes than web. Having separate mobile and web BFFs means the mobile team can iterate on their API independently without breaking web."</div></div>`,
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
          body: `<p>An <strong>API Gateway</strong> is a single entry point for all client requests to a microservice architecture. It handles cross-cutting concerns — authentication, authorization, rate limiting, request routing, SSL termination, load balancing, and logging — so individual microservices don't each have to implement these themselves.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Without an API Gateway",
          body: `<p>Without a gateway, every ShopKart microservice must independently implement: JWT validation, rate limiting, CORS, SSL termination, request logging, tracing, API versioning, and circuit breaking. 7 services × 8 concerns = 56 implementations. If the JWT library has a security vulnerability, you're patching 7 services. This is the cross-cutting concerns problem that the API Gateway solves.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart API Gateway",
          body: `<div class="diagram-box">Client Request (Rahul's browser or app)
        ↓
┌────────────────────────────────────────────────────────┐
│  API GATEWAY (Kong / AWS API Gateway / nginx + Lua)    │
│                                                        │
│  1. SSL Termination (HTTPS → HTTP internally)          │
│  2. Authentication: Validate JWT token                 │
│     → Attach user context to forwarded request         │
│  3. Authorization: Check if route requires specific role│
│  4. Rate Limiting: 600 req/min per user (Redis-backed)  │
│  5. Request ID injection: X-Request-ID header          │
│  6. Routing by URL prefix:                             │
│     /api/products/*  → Product Service :3001           │
│     /api/orders/*    → Order Service   :3002           │
│     /api/search/*    → Search Service  :3003           │
│     /api/payments/*  → Payment Service :3004           │
│  7. Request/Response logging                           │
│  8. Circuit breaking: if downstream fails, return 503  │
└────────────────────────────────────────────────────────┘
        ↓           ↓           ↓           ↓
  Product Svc  Order Svc   Search Svc  Payment Svc
  (no auth code, no rate limit code — gateway handles it all)

Each microservice receives:
  X-User-ID: 42         ← injected by gateway after JWT validation
  X-User-Roles: CUSTOMER
  X-Request-ID: req-a3f2b1c4
  Plain HTTP (no TLS — internal network)</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "API Gateway vs Load Balancer vs BFF",
          body: `<table class="compare-table"><thead><tr><th></th><th>Load Balancer</th><th>API Gateway</th><th>BFF</th></tr></thead><tbody>
<tr><td><strong>Layer</strong></td><td>L4/L7 network</td><td>L7 application</td><td>Application service</td></tr>
<tr><td><strong>Knows about</strong></td><td>IPs, ports, health</td><td>APIs, auth, rate limits</td><td>Client data needs</td></tr>
<tr><td><strong>Responsibility</strong></td><td>Traffic distribution</td><td>Cross-cutting API concerns</td><td>Client-specific aggregation</td></tr>
<tr><td><strong>Examples</strong></td><td>AWS ALB, nginx</td><td>Kong, AWS API GW, Apigee</td><td>Custom Node.js service</td></tr>
</tbody></table>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>The API Gateway is also where you implement <strong>canary deployments</strong> and <strong>A/B testing</strong> at the infrastructure level: route 5% of requests to the new version of a service, measure error rates and latency, gradually increase. The Gateway's routing configuration controls this without deploying new code. This capability alone justifies an API Gateway investment for production systems.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Microservices Entry Point</div><div class="interview-q">In any microservices system design, include an API Gateway: "All external traffic enters through Kong API Gateway. It handles JWT validation, rate limiting, and routes to the appropriate service. Microservices are on private subnets — not directly accessible. This centralises security logic and means each microservice only needs to handle its domain logic." Drawing the gateway as the entry point to all services is a strong architectural signal.</div></div>`,
        },
      ],
    },
  ],
};

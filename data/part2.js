/* Part 2 — Backend APIs (10 topics) — Deep Rewrite */
const PART2 = {
  id: "part2",
  icon: "🔌",
  title: "Part 2",
  name: "Backend APIs",
  topics: [
    {
      id: "p2t1",
      title: "REST Architecture",
      subtitle:
        "The architectural style that made APIs the language of the modern web.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>REST</strong> (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP and a set of six constraints — statelessness, uniform interface, client-server separation, cacheability, layered system, and code on demand — to create APIs that are simple, scalable, and predictable.</p>
<p>REST is not a protocol or a standard. It is a set of design principles. An API that follows all six constraints is called <strong>RESTful</strong>.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why REST Won",
          body: `<p>Before REST, web services used <strong>SOAP</strong> — XML-based, verbose, stateful, hard to debug. REST uses JSON (or XML) over plain HTTP, leverages standard HTTP semantics (methods, status codes, headers), and is stateless. Developers can test REST APIs with a browser, Postman, or curl. SOAP required special tooling. REST's simplicity and the rise of HTTP made it the dominant API style for a decade.</p>
<p>GraphQL and gRPC have emerged as alternatives — GraphQL for flexible client queries (avoiding over-fetching), gRPC for high-performance internal microservice communication. But REST remains the standard for public APIs and most web backends.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart REST API Design",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
GET &nbsp;&nbsp;&nbsp;/products &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ list all products<br/>
POST &nbsp;&nbsp;/products &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ create new product (admin)<br/>
GET &nbsp;&nbsp;&nbsp;/products/{id} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ get single product<br/>
PATCH &nbsp;/products/{id} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ update product fields<br/>
DELETE /products/{id} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ remove product<br/><br/>
GET &nbsp;&nbsp;&nbsp;/users/{uid}/orders &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ Rahul’s orders<br/>
POST &nbsp;&nbsp;/users/{uid}/orders &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ place new order<br/>
GET &nbsp;&nbsp;&nbsp;/users/{uid}/orders/{oid} → specific order<br/><br/>
GET &nbsp;&nbsp;&nbsp;/products/{id}/reviews &nbsp;&nbsp;→ reviews for product<br/>
POST &nbsp;&nbsp;/products/{id}/reviews &nbsp;&nbsp;→ post a review<br/><br/>
✅ Resources are nouns &nbsp;✅ Actions are HTTP verbs<br/>
✅ Hierarchy shows relationships &nbsp;✅ Consistent, predictable
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "REST Constraints Explained",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:4px;">🔳 Stateless</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Each request contains ALL needed information. Server memory holds no session. State lives in DB/Redis. Enables horizontal scaling.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:4px;">🌐 Uniform Interface</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Standard URLs, methods (GET/POST/PUT/DELETE), Content-Type headers. Self-descriptive messages — every client understands any REST API immediately.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:13px;color:#f59e0b;margin-bottom:4px;">⚡ Cacheable</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Responses declare cacheability via Cache-Control headers. GET /products/123 cached by CDN for 60s — dramatically reduces origin load.</p>
  </div>
  <div style="padding:12px 16px;">
    <div style="font-weight:700;font-size:13px;color:#8b5cf6;margin-bottom:4px;">🏭 Layered System</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Client can’t tell if it’s talking to origin, CDN, load balancer, or gateway. Enables transparent intermediaries, edge caching, and security layers.</p>
  </div>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:4px;">❌ Verb-based URLs</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">GET /getProduct, POST /createOrder — RPC-style, not REST. Use noun-based resource paths.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:4px;">❌ Verbs in resource paths</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">POST /orders/123/cancel is a last resort. Prefer PATCH /orders/123 with body <code>{"status":"cancelled"}</code>.</p>
  </div>
  <div style="padding:12px 16px;background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:4px;">❌ Always returning 200</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Use proper HTTP status codes — they communicate meaning to every client, proxy, and monitoring system in the chain.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — REST vs GraphQL vs gRPC",
          body: `
<p style="margin-bottom:14px;">Think of these three as different <strong>conversations styles</strong>. REST is a standard form, GraphQL is a custom order, and gRPC is a machine-to-machine signal. Each is right in a different situation.</p>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">

  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌐 REST — The Standard Menu</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Imagine a restaurant with a <em>fixed menu</em>. You say <code>GET /products/42</code> and the server brings you the full product — name, price, description, images, stock, reviews, seller info — whether you wanted all of it or not. That's REST. Simple, predictable, universally understood.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Every developer knows it</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Works with browsers, curl, Postman</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Easy to cache, easy to document</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Over-fetches data (gets more than you need)</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Under-fetches (needs multiple round trips)</span>
    </div>
    <div style="margin-top:10px;font-size:12px;color:var(--accent);font-weight:600;">📌 Use for: All public APIs, third-party integrations, anything external-facing.</div>
  </div>

  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚡ GraphQL — The Custom Order</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Now imagine you can tell the chef <em>exactly</em> what you want: "Give me only the product name, price, and the first image — nothing else." That's GraphQL. The client writes a query describing precisely the shape of data it needs, and the server returns exactly that — no more, no less.</p>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><strong>Why this matters:</strong> ShopKart's mobile app runs on a 4G connection. A REST call for a product list returns 40 fields per product. GraphQL lets mobile ask for just 4 fields — cutting payload size by 90% and making the app significantly faster. The desktop web app meanwhile asks for all 40 fields in one request instead of 5 separate API calls.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ One endpoint — no URL sprawl</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Mobile gets lean payloads, desktop gets rich ones</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Fetch related data in one round trip</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Harder to cache (queries vary)</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Overkill for simple CRUD APIs</span>
    </div>
    <div style="margin-top:10px;font-size:12px;color:#10b981;font-weight:600;">📌 Use for: Mobile apps, dashboards where different screens need very different data shapes.</div>
  </div>

  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🚀 gRPC — The Factory Conveyor Belt</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">REST sends data as human-readable JSON text — words and curly braces. gRPC sends data as a <em>compact binary signal</em> using Protocol Buffers. Think of JSON as mailing a typed letter, and gRPC as sending digitally compressed data packets — same information, a fraction of the size, delivered 5–10× faster.</p>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><strong>Real numbers:</strong> ShopKart's Order Service calls the Payment Service to verify payment — 10,000 times every second during a flash sale. Over REST/JSON that's ~2KB per message = 20MB/s of just text overhead. Over gRPC/Protobuf the same data is ~200 bytes = 2MB/s — 10× less bandwidth, lower latency, and far less CPU spent on parsing.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ 5–10× smaller payloads than JSON</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Strict typed contracts (no schema mismatches)</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ HTTP/2 — multiple streams, no head-of-line blocking</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Not human-readable — needs tooling to inspect</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Browsers can't call gRPC natively</span>
    </div>
    <div style="margin-top:10px;font-size:12px;color:#8b5cf6;font-weight:600;">📌 Use for: Internal service-to-service calls — Order → Payment, Cart → Inventory, Auth → User Service.</div>
  </div>

</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule of Thumb</strong><br>
  <span style="color:var(--text-primary);opacity:0.9;">Use <strong>REST</strong> when talking to the outside world. Use <strong>gRPC</strong> when your own services talk to each other at high speed. Use <strong>GraphQL</strong> when different clients (mobile, web, TV) need custom slices of the same data. Most production systems use all three — REST for public APIs, gRPC internally, GraphQL for client-facing flexibility.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">When asked to design an API, explicitly state: "I’ll use REST — resources as nouns in the URL, HTTP verbs for actions, appropriate status codes, and JSON payloads. For internal service-to-service calls with high throughput requirements, I’d consider gRPC instead." This shows you understand when to use REST and when alternatives are better.</p>`,
        },
      ],
    },

    {
      id: "p2t2",
      title: "Resource Naming Conventions",
      subtitle:
        "Good URL design is the foundation of a predictable, usable API.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>REST resource naming is about designing URL structures that are intuitive, consistent, and aligned with HTTP semantics. Good resource naming makes APIs self-documenting — developers can guess how to use an API just by reading its URLs. Poor naming leads to guesswork, bugs, and inconsistent usage.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Naming Guide",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
✅ Plural nouns for collections:<br/>
&nbsp;&nbsp;/products &nbsp;&nbsp;&nbsp;&nbsp;/orders &nbsp;&nbsp;&nbsp;&nbsp;/users<br/><br/>
✅ Specific resource by ID in path:<br/>
&nbsp;&nbsp;/products/123 &nbsp;&nbsp;&nbsp;&nbsp;/orders/ORD-789<br/><br/>
✅ Nested for ownership:<br/>
&nbsp;&nbsp;/users/42/orders &nbsp;&nbsp;&nbsp;&nbsp;/products/123/reviews<br/><br/>
✅ Lowercase with hyphens:<br/>
&nbsp;&nbsp;/product-categories &nbsp;&nbsp;❌ /productCategories<br/><br/>
❌ Anti-patterns:<br/>
&nbsp;&nbsp;/getProducts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← verb in URL<br/>
&nbsp;&nbsp;/product/search/running ← use query param: /products?q=running<br/>
&nbsp;&nbsp;/user/42/order/all &nbsp;&nbsp;← “all” is not a resource<br/>
&nbsp;&nbsp;/api/v1/PRODUCTS &nbsp;&nbsp;&nbsp;&nbsp;← don’t uppercase URLs
</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Action Endpoints vs Resources",
          body: `<p>Sometimes you need to model actions that don’t fit CRUD. For example: “cancel an order”, “apply coupon”, “resend invoice”. The cleanest REST approaches:</p>
<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.06);">
    <div style="font-weight:700;font-size:13px;color:#22c55e;margin-bottom:4px;">✅ Model the state change</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">PATCH /orders/789 with body <code>{"status": "cancelled"}</code>. The “action” is changing a resource’s state field.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:4px;">✅ Create a sub-resource</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">POST /orders/789/cancellation → creates a Cancellation record. RESTful and auditable.</p>
  </div>
  <div style="padding:12px 16px;">
    <div style="font-weight:700;font-size:13px;color:#f59e0b;margin-bottom:4px;">⚠️ Action sub-path (last resort)</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">POST /orders/789/cancel — acceptable for complex business operations with no natural resource representation.</p>
  </div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">Interviewers often give you a feature and ask you to design the API. They’ll watch whether you use nouns or verbs, whether you use proper HTTP methods, and whether your URLs are predictable. A quick mental check: “Can a developer who’s never seen this API correctly guess the URL for related resources?” If yes, your naming is good.</p>`,
        },
      ],
    },

    {
      id: "p2t3",
      title: "Path vs Query Parameters",
      subtitle: "Two ways to pass data in a URL — and when to use each one.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Path parameters</strong> are part of the URL path itself and identify a specific resource: <code>/products/<strong>123</strong></code>. <strong>Query parameters</strong> appear after <code>?</code> and modify or filter how a resource is returned: <code>/products?category=shoes&sort=price</code>. The distinction affects caching, readability, and API semantics.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Decision Guide with ShopKart",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <span style="font-weight:700;font-size:13px;color:var(--accent);">Path Parameters</span>
      <span style="font-weight:700;font-size:13px;color:#10b981;">Query Parameters</span>
    </div>
    <div style="display:flex;gap:12px;font-size:12px;">
      <div style="flex:1;background:rgba(99,102,241,0.06);border-radius:6px;padding:10px;">
        <div style="font-weight:600;margin-bottom:4px;">Use for</div>
        <div style="opacity:0.85;">Identifying a specific resource</div>
        <div style="margin-top:6px;font-family:monospace;">/products/123<br/>/users/42/orders/789</div>
        <div style="margin-top:6px;"><span style="background:rgba(239,68,68,0.1);color:#ef4444;padding:2px 6px;border-radius:4px;">❌ /products?id=123</span></div>
      </div>
      <div style="flex:1;background:rgba(16,185,129,0.04);border-radius:6px;padding:10px;">
        <div style="font-weight:600;margin-bottom:4px;">Use for</div>
        <div style="opacity:0.85;">Filtering, sorting, pagination, searching</div>
        <div style="margin-top:6px;font-family:monospace;font-size:11px;">/products?category=shoes<br/>&amp;sort=price&amp;page=2</div>
        <div style="margin-top:6px;"><span style="background:rgba(239,68,68,0.1);color:#ef4444;padding:2px 6px;border-radius:4px;">❌ /products/search (search is not an ID)</span></div>
      </div>
    </div>
  </div>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "ShopKart Search API Design",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
GET /products?<br/>
&nbsp;&nbsp;q=running+shoes<br/>
&nbsp;&nbsp;&amp;category=footwear<br/>
&nbsp;&nbsp;&amp;brand=nike<br/>
&nbsp;&nbsp;&amp;min_price=2000<br/>
&nbsp;&nbsp;&amp;max_price=10000<br/>
&nbsp;&nbsp;&amp;sort=price_asc<br/>
&nbsp;&nbsp;&amp;page=2<br/>
&nbsp;&nbsp;&amp;limit=20<br/><br/>
No path params — querying a collection, not a specific resource.<br/>All query params are optional; defaults applied when missing.<br/><br/>
Response 200:<br/>
{ data: [...20 products...],<br/>
&nbsp;&nbsp;pagination: { page:2, limit:20, total:347,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;next:"/products?...&amp;page=3",<br/>
&nbsp;&nbsp;&nbsp;&nbsp;prev:"/products?...&amp;page=1" } }
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">When sketching API design in an interview, be deliberate: “The order ID is a path parameter since it uniquely identifies the resource. Filters like status=pending and date range are query parameters since they’re optional and modify which resources are returned.” This precision signals strong REST understanding.</p>`,
        },
      ],
    },

    {
      id: "p2t4",
      title: "Idempotency in APIs",
      subtitle:
        "Designing APIs that can be safely retried without creating duplicate side effects.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>An operation is <strong>idempotent</strong> if performing it multiple times produces the same result as doing it once. GET, PUT, and DELETE are idempotent by HTTP definition. POST is not — calling POST /orders three times creates three orders. Designing idempotent APIs enables safe retries, which are essential in distributed systems where network failures are common.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why Idempotency Is Critical",
          body: `<p>Rahul clicks "Place Order" on ShopKart. His phone sends the HTTP POST. The server processes the order and charges his card. Then the network drops before the success response reaches his phone. His phone shows "Request failed" — but the order was actually placed! If Rahul clicks again, does he get two orders and two charges?</p>
<p>Without idempotency: yes. With idempotency: no. This is not a hypothetical — retries are constantly happening across every distributed system. Mobile connections drop, load balancers timeout, clients retry. <strong>Every payment/order/write API must be designed for idempotency.</strong></p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Idempotent Order API",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:6px;">Step 1 — Generate idempotency key client-side</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Before submitting, browser generates UUID: <code>key = crypto.randomUUID()</code> → "a3f2b1c4-..."</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
    <div style="font-weight:700;font-size:13px;margin-bottom:6px;">Step 2 — Send in header</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">POST /orders with header <code>Idempotency-Key: a3f2b1c4-...</code></p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:6px;">Step 3 — Server checks Redis first</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Key exists? NO → process order, charge card, cache result in Redis (TTL 24h), return 201.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
    <div style="font-weight:700;font-size:13px;margin-bottom:6px;">Step 4 — Network drops, browser retries with same key</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">POST /orders again with the same <code>Idempotency-Key: a3f2b1c4-...</code></p>
  </div>
  <div style="padding:12px 16px;background:rgba(34,197,94,0.06);">
    <div style="font-weight:700;font-size:13px;color:#22c55e;margin-bottom:6px;">Step 5 — Redis cache hit, return stored result</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Key found in Redis → return the cached 201 from step 3. No new order created. No new charge. User experience is seamless.</p>
  </div>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:10px 14px;font-size:12px;line-height:1.65;">
  <strong style="color:var(--accent);">Industry Standard</strong> — Stripe, PayPal, and every major payment provider implement idempotency keys this way.
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:4px;">❌ Timestamp as idempotency key</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Two requests in the same millisecond = same key = second one wrongly deduplicated. Use UUID or CSPRNG token.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:4px;">❌ Checking idempotency AFTER charging the card</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">The check must happen BEFORE any side effects. Otherwise race conditions can still result in double charges.</p>
  </div>
  <div style="padding:12px 16px;background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:4px;">❌ “Users won’t double-click” is not an architecture</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Networks fail, services crash, browsers retry. Always implement idempotency for payment and order APIs.</p>
  </div>
</div>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview: Idempotency Design</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">“The client generates an idempotency key per order attempt. The server stores the result keyed by UUID. Retries within 24 hours return the cached result without re-processing.” This distinguishes senior from junior system designers.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">In any payment system or order-placement system interview, proactively mention idempotency: “The client generates an idempotency key per order attempt. The server stores the result keyed by this UUID. Retries within 24 hours return the cached result without re-processing.” This is a critical safety mechanism that distinguishes senior from junior system designers.</p>`,
        },
      ],
    },

    {
      id: "p2t5",
      title: "Pagination",
      subtitle:
        "Returning large datasets in manageable chunks — essential for performance.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Pagination</strong> is the practice of returning large datasets in small pages rather than all at once. Without pagination, a request for all ShopKart products (millions of items) would crash the server (memory), destroy the database (full table scan), destroy the network (gigabytes of JSON), and render useless results for the user.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Three Pagination Strategies",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:4px;">Offset / Limit</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;"><code>LIMIT 20 OFFSET 40</code> — skip 40, take 20. Simple. Deep pages (OFFSET 10000) force DB to scan and discard 10,000 rows. Slow and worsens with scale.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.06);">
    <div style="font-weight:700;font-size:13px;color:#22c55e;margin-bottom:4px;">Cursor / Keyset ★ recommended for production</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;"><code>WHERE id &gt; {lastSeenId} LIMIT 20</code> — uses the primary key index regardless of depth. O(log n) at page 1 or page 10,000. Best for infinite scroll and high-traffic feeds.</p>
  </div>
  <div style="padding:12px 16px;">
    <div style="font-weight:700;font-size:13px;color:#8b5cf6;margin-bottom:4px;">Page Tokens (opaque)</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Server returns opaque <code>next_page_token</code>; client sends it back. Hides implementation. Used by Google, Stripe. No random access.</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Search Results — Cursor Pagination",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
GET /products?<br/>
&nbsp;&nbsp;q=running+shoes<br/>
&nbsp;&nbsp;&amp;category=footwear<br/>
&nbsp;&nbsp;&amp;brand=nike<br/>
&nbsp;&nbsp;&amp;min_price=2000<br/>
&nbsp;&nbsp;&amp;max_price=10000<br/>
&nbsp;&nbsp;&amp;sort=price_asc<br/>
&nbsp;&nbsp;&amp;page=2<br/>
&nbsp;&nbsp;&amp;limit=20<br/><br/>
No path params — querying a collection, not a specific resource.<br/>All query params are optional; defaults applied when missing.<br/><br/>
Response 200:<br/>
{ data: [...20 products...],<br/>
&nbsp;&nbsp;pagination: { page:2, limit:20, total:347,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;next:"/products?...&amp;page=3",<br/>
&nbsp;&nbsp;&nbsp;&nbsp;prev:"/products?...&amp;page=1" } }
</div>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Be deliberate: “The order ID is a path parameter since it uniquely identifies the resource. Filters like status=pending and date range are query parameters since they’re optional and modify which resources are returned.” This precision signals strong REST understanding.</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Cursor pagination is almost always better than offset pagination for production systems. Deep offset pagination (OFFSET 10000 LIMIT 20) forces the database to scan and discard 10,000 rows before returning your 20. At scale, this causes slow queries, table locks, and degraded service. Cursor pagination maintains O(log n) query time via the index regardless of depth. For ShopKart's category pages with millions of products, this difference between cursor and offset pagination can mean the difference between 5ms and 5,000ms query times at depth.</p>`,
        },
      ],
    },

    {
      id: "p2t6",
      title: "Filtering & Sorting",
      subtitle:
        "Letting clients get exactly the data they need without over-fetching.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Filtering</strong> limits the returned resources to those matching certain criteria. <strong>Sorting</strong> orders the results by one or more fields. Both are expressed as query parameters in REST APIs. Together they enable clients to get precisely the data they need without requesting everything and filtering client-side.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Filter API",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
GET /products?<br/>
&nbsp;&nbsp;category=footwear<br/>
&nbsp;&nbsp;&amp;brand=nike,adidas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← multi-value<br/>
&nbsp;&nbsp;&amp;min_price=1000<br/>
&nbsp;&nbsp;&amp;max_price=5000<br/>
&nbsp;&nbsp;&amp;in_stock=true<br/>
&nbsp;&nbsp;&amp;rating_min=4.0<br/>
&nbsp;&nbsp;&amp;sort=price_asc<br/>
&nbsp;&nbsp;&amp;fields=id,name,price,image ← sparse fieldset<br/><br/>
GET /orders? (admin panel)<br/>
&nbsp;&nbsp;status=pending,processing<br/>
&nbsp;&nbsp;&amp;created_after=2026-01-01<br/>
&nbsp;&nbsp;&amp;created_before=2026-02-01<br/>
&nbsp;&nbsp;&amp;user_id=42<br/>
&nbsp;&nbsp;&amp;sort=created_at_desc
</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Sparse Fieldsets — Avoiding Over-fetching",
          body: `<p>A full Product object in ShopKart might have 50 fields: id, name, description (2000 chars), all images, specifications, dimensions, seller info, reviews summary, inventory details, etc. The product listing page only needs: id, name, price, thumbnail, rating, in_stock. Returning all 50 fields wastes bandwidth, increases parsing time, and bloats the response.</p>
<p>Solution: <code>?fields=id,name,price,thumbnail,rating,in_stock</code>. The server only queries and serialises those 6 fields. For a page showing 50 products, this can reduce payload from 500KB to 25KB — a 20x reduction. This is especially impactful on mobile/3G connections.</p>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Security: Filter Injection",
          body: `<div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.25);border-left:4px solid #ef4444;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#ef4444;">🚨 SQL injection via filter values</strong><br/><br/>
  <span style="color:var(--text-primary);opacity:0.9;">❌ Never: <code>WHERE name = '" + userInput + "'</code><br/>
  GET /products?name=Nike' OR '1'='1 → leaks entire table<br/><br/>
  ✅ Always: parameterised queries — <code>WHERE name = $1, [userInput]</code><br/>
  Also whitelist sortable columns — don’t expose sort=password_hash.</span>
</div>`,
        },
      ],
    },

    {
      id: "p2t7",
      title: "API Versioning",
      subtitle: "How to evolve your API without breaking existing clients.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>API versioning</strong> allows you to make breaking changes to your API while maintaining backward compatibility for existing clients. Without versioning, any change to a production API that removes a field, renames a parameter, or changes response structure immediately breaks every client using the old format.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Three Versioning Strategies",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:12px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.06);">
    <div style="font-weight:700;font-size:13px;color:#22c55e;margin-bottom:4px;">URL Versioning ★ most common</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;"><code>/api/v1/products</code> → <code>/api/v2/products</code>. Explicit, easy in logs, easy to route at gateway. Used by GitHub, Stripe, Twilio.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:4px;">Header Versioning</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;"><code>Accept: application/vnd.shopkart.v2+json</code>. Clean URLs, semantically correct. Harder to test in browser.</p>
  </div>
  <div style="padding:12px 16px;">
    <div style="font-weight:700;font-size:13px;color:#8b5cf6;margin-bottom:4px;">Query Param</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;"><code>/api/products?version=2</code>. Easy to test. Not considered best practice.</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Breaking vs Non-Breaking Changes",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
NON-BREAKING (safe to add without version bump):<br/>
✅ Add new optional response field<br/>
✅ Add new optional query parameter<br/>
✅ Add new endpoint<br/>
✅ Make a required field optional<br/><br/>
BREAKING (requires version bump):<br/>
❌ Remove a response field clients rely on<br/>
❌ Rename a field (remove + add)<br/>
❌ Change field type (string → integer)<br/>
❌ Change error format<br/><br/>
v1 → v2 example:<br/>
v1: GET /v1/orders/{id} → { "amount": 7999 } &nbsp;← in paise<br/>
v2: GET /v2/orders/{id} → { "amount": { "value": 79.99, "currency": "INR" } }<br/><br/>
Both versions run in parallel. v1 deprecated with 12-month sunset.<br/>
Deprecation header: Sunset: Mon, 01 Jan 2027 00:00:00 GMT
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Deprecation Strategy",
          body: `<p>Version bumps should be rare — good API design is hard to change well. The strategy: when v2 is released, mark v1 as deprecated. Add a deprecation header to v1 responses: <code>Deprecation: Mon, 01 Jan 2027 00:00:00 GMT</code> and <code>Sunset: Mon, 01 Jan 2027 00:00:00 GMT</code>. Monitor v1 usage metrics. Reach out to active v1 clients before shutdown. After the sunset date, return 410 Gone for v1 requests. This managed migration respects partners while allowing API evolution.</p>`,
        },
      ],
    },

    {
      id: "p2t8",
      title: "Error Responses",
      subtitle:
        "Communicating failures clearly — making your API debuggable and trustworthy.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>Error responses tell clients exactly what went wrong, why, and often how to fix it. A well-designed error response uses the correct HTTP status code, includes a machine-readable error code, and provides a human-readable message. Good error design is the difference between an API that is easy to integrate and one that requires hours of debugging.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Error Response Format",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
HTTP/1.1 422 Unprocessable Entity<br/><br/>
{<br/>
&nbsp;&nbsp;"error": {<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"code": "VALIDATION_FAILED", &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← machine-readable, stable<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"message": "Request validation failed",<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"details": [<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ "field": "shipping_address.pincode",<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"code": "INVALID_PINCODE" },<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ "field": "items[0].quantity",<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"code": "EXCEEDS_STOCK" }<br/>
&nbsp;&nbsp;&nbsp;&nbsp;],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"request_id": "req-a3f2b1c4-..." &nbsp;← for debugging<br/>
&nbsp;&nbsp;}<br/>
}<br/><br/>
400 → INVALID_REQUEST &nbsp;401 → AUTH_TOKEN_EXPIRED<br/>
403 → INSUFFICIENT_PERMISSIONS &nbsp;404 → PRODUCT_NOT_FOUND<br/>
429 → RATE_LIMIT_EXCEEDED &nbsp;500 → INTERNAL_ERROR
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Critical Security: Never Expose Internal Details",
          body: `<div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.25);border-left:4px solid #ef4444;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#ef4444;">🚨 Never expose internal details in errors</strong><br/><br/>
  <span style="color:var(--text-primary);opacity:0.9;">❌ <code>{"error": "NullPointerException at PaymentService.java:142"}</code> — exposes stack, class names, file paths to attackers.<br/><br/>
  ✅ Return a generic code + message. Log full error server-side with the <code>request_id</code>. Support engineers can look it up in logs without exposing it to clients.</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Define your error response schema before writing API code. Use a consistent structure across ALL endpoints so client error-handling code can be generic: <code>if (response.error.code === 'AUTH_TOKEN_EXPIRED') → refreshToken()</code>. Inconsistent error formats force clients to write custom error handling for each endpoint — a maintenance nightmare. Error codes should be <strong>stable string identifiers</strong>, not integers, so they remain meaningful as the API evolves.</p>`,
        },
      ],
    },

    {
      id: "p2t9",
      title: "File Upload Patterns",
      subtitle: "Handling binary data — from profile photos to product images.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>File upload APIs allow clients to send binary data (images, documents, videos) to a server. There are two main patterns: <strong>direct upload</strong> (file goes through your API server) and <strong>presigned URL upload</strong> (client uploads directly to cloud storage, bypassing your server). The right choice depends on file size, security requirements, and infrastructure cost.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Product Image Upload — Presigned URL",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:4px;">Step 1 — Request upload URL</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;"><code>POST /api/products/123/images/upload-url</code> → body: filename, content_type, size_bytes</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
    <div style="font-weight:700;font-size:13px;margin-bottom:4px;">Step 2 — Server validates and generates presigned URL</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Is seller authorised? File type allowed? Size under 10MB? If valid → call AWS S3 to generate presigned PUT URL (valid 15 min).</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:4px;">Step 3 — Client uploads DIRECTLY to S3</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Browser PUTs image to presigned URL. ShopKart servers never see binary data. S3 authenticates via embedded signature.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
    <div style="font-weight:700;font-size:13px;margin-bottom:4px;">Step 4 — S3 triggers Lambda on upload</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Lambda runs virus scan, validates image, generates thumbnails, stores final CDN URL.</p>
  </div>
  <div style="padding:12px 16px;">
    <div style="font-weight:700;font-size:13px;margin-bottom:4px;">Step 5 — Lambda confirms to API</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;"><code>PATCH /api/products/123/images/{imageId}</code> — marks upload complete, associates image with product.</p>
  </div>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Direct vs Presigned Comparison",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:8px;">
      <span style="color:var(--accent);">Direct Upload (via API)</span>
      <span style="color:#10b981;">Presigned URL (to S3)</span>
    </div>
    <div style="display:flex;gap:12px;font-size:12px;">
      <div style="flex:1;background:rgba(245,158,11,0.04);border-radius:6px;padding:10px;">
        <div style="margin-bottom:4px;"><span style="color:#ef4444;">❌</span> High server load — every byte through your server</div>
        <div style="margin-bottom:4px;"><span style="color:#ef4444;">❌</span> Slower — double trip (client → server → S3)</div>
        <div style="margin-bottom:4px;"><span style="color:#f59e0b;">⚠️</span> Limited by server memory/timeout</div>
        <div style="color:#22c55e;">✅ Full validation control</div>
        <div style="margin-top:6px;opacity:0.7;">Use for: small files &lt;5MB, content inspection</div>
      </div>
      <div style="flex:1;background:rgba(34,197,94,0.06);border-radius:6px;padding:10px;">
        <div style="margin-bottom:4px;"><span style="color:#22c55e;">✅</span> Zero server load — data goes direct to S3</div>
        <div style="margin-bottom:4px;"><span style="color:#22c55e;">✅</span> Faster — single trip (client → S3)</div>
        <div style="margin-bottom:4px;"><span style="color:#22c55e;">✅</span> S3 limit: 5TB per file</div>
        <div style="opacity:0.7;">Validate metadata before issuing URL</div>
        <div style="margin-top:6px;opacity:0.7;">Use for: images, videos, large uploads</div>
      </div>
    </div>
  </div>
</div>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview: Presigned URL Upload</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">“The client requests a short-lived upload URL from our API. We validate permissions and size limits, generate an S3 pre-signed URL (valid 15 minutes), and return it. The client uploads directly to S3 — our servers are never in the data path. This scales to unlimited concurrent uploads without adding server capacity.”</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">When asked how to handle image uploads in a design interview, describe pre-signed URLs: “The client requests a short-lived upload URL from our API. We validate permissions and size limits, generate an S3 pre-signed URL (valid 15 minutes), and return it. The client uploads directly to S3 — our servers are never in the data path for the binary content. This scales to unlimited concurrent uploads without adding server capacity.”</p>`,
        },
      ],
    },

    {
      id: "p2t10",
      title: "API Documentation with OpenAPI/Swagger",
      subtitle: "Making your API self-documenting and testable out of the box.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>OpenAPI</strong> (formerly Swagger) is a standardised specification for describing REST APIs in YAML or JSON. It defines every endpoint, request parameter, request body schema, response schema, authentication method, and error response in a machine-readable format. From an OpenAPI spec, tools can auto-generate interactive documentation, SDKs, and test mocks.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart OpenAPI Example",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
openapi: 3.1.0<br/>
info: { title: ShopKart API, version: "2.0" }<br/><br/>
paths:<br/>
&nbsp;&nbsp;/products/{productId}:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;get:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;parameters:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: productId, in: path, required: true<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;schema: { type: integer }<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;responses:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"200": { $ref: "#/components/schemas/Product" }<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"404": { $ref: "#/components/schemas/Error" }<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;security: [ bearerAuth: [] ]<br/><br/>
components.schemas.Product:<br/>
&nbsp;&nbsp;type: object, required: [id, name, price]<br/>
&nbsp;&nbsp;properties:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;id: integer, name: string<br/>
&nbsp;&nbsp;&nbsp;&nbsp;price: { type: number, description: "Price in INR" }<br/>
&nbsp;&nbsp;&nbsp;&nbsp;in_stock: boolean
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — API-First Design",
          body: `<p>The <strong>API-first</strong> design approach writes the OpenAPI spec BEFORE writing code. This forces teams to agree on interfaces early, lets frontend and backend teams develop in parallel using mocks generated from the spec, and ensures documentation is never an afterthought. Tools like Prism can mock the entire API from a spec — a frontend engineer can work against a realistic API mock while the backend is still being built. Stripe famously uses API-first design, and their developer experience is considered the gold standard.</p>
<p>In CI/CD pipelines, the OpenAPI spec is used to: automatically generate client SDKs, run contract tests (does the actual API match the spec?), and publish documentation to a developer portal. This keeps docs always in sync with the real API without manual effort.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">Mentioning API documentation and contract testing shows engineering maturity: “We’d write our OpenAPI spec first, generate mocks for frontend development, and add contract tests to our CI pipeline to ensure code always matches the spec. Documentation is auto-generated — never stale.” This kind of process thinking impresses system design interviewers at senior levels.</p>`,
        },
      ],
    },
  ],
};

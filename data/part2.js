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
          body: `<div class="diagram-box">ShopKart Resource-Based API Design:

Products:
  GET    /products              → list all products
  POST   /products              → create a new product (admin)
  GET    /products/{id}         → get single product
  PUT    /products/{id}         → replace product
  PATCH  /products/{id}         → update product fields
  DELETE /products/{id}         → remove product

Orders:
  GET    /users/{userId}/orders       → get user's orders
  POST   /users/{userId}/orders       → place new order
  GET    /users/{userId}/orders/{orderId} → get specific order
  PATCH  /users/{userId}/orders/{orderId} → update order status

Reviews:
  GET    /products/{id}/reviews       → get reviews for product
  POST   /products/{id}/reviews       → post a review
  
Key REST principles visible here:
  ✅ Resources are nouns (products, orders, reviews)
  ✅ Actions are HTTP verbs (GET, POST, PUT, PATCH, DELETE)
  ✅ Hierarchy shows relationships (/products/{id}/reviews)
  ✅ Consistent, predictable URL patterns</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "REST Constraints Explained",
          body: `<div class="info-grid">
  <div class="info-card blue"><div class="info-card-title">Stateless</div><p>Each request contains ALL information needed. Server remembers nothing between requests. State lives in DB/Redis, not server memory. Enables horizontal scaling.</p></div>
  <div class="info-card green"><div class="info-card-title">Uniform Interface</div><p>Standard resource identification (URLs), standard methods (GET/POST/PUT/DELETE), self-descriptive messages (Content-Type headers), HATEOAS (links to related resources).</p></div>
  <div class="info-card yellow"><div class="info-card-title">Cacheable</div><p>Responses declare if they can be cached (Cache-Control headers). GET /products/123 can be cached by CDN for 60s — reducing origin load dramatically.</p></div>
  <div class="info-card red"><div class="info-card-title">Layered System</div><p>Client cannot tell if it's talking to origin server or a CDN, load balancer, or API gateway in between. This enables transparent intermediaries.</p></div>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Verb-based URLs:</strong> GET /getProduct, POST /createOrder. These are RPC-style, not REST. Use noun-based resources.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Putting actions in URLs:</strong> POST /orders/123/cancel is acceptable for actions with no natural resource representation, but should be used sparingly. Prefer PATCH /orders/123 with body <code>{"status": "cancelled"}</code>.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Returning 200 for all responses.</strong> Use proper HTTP status codes — they communicate meaning to every client, proxy, and monitoring system in the chain.</div></div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — REST vs GraphQL vs gRPC",
          body: `<p><strong>REST</strong>: Best for public APIs, CRUD operations, when you want simplicity and broad tooling support.</p>
<p><strong>GraphQL</strong>: Best when clients have highly variable data needs (mobile vs desktop needs different fields). ShopKart's mobile app might use GraphQL to fetch only product name, price, and one image — avoiding over-fetching full product objects.</p>
<p><strong>gRPC</strong>: Best for high-throughput internal microservice communication. Binary protocol (Protocol Buffers) is 5-10x more efficient than JSON. ShopKart's Order Service calling Payment Service 10,000 times/second would benefit from gRPC over REST.</p>
<p>Senior architects pick the right tool: REST for external APIs, gRPC for internal, GraphQL for flexible client requirements.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">REST Principles</div><div class="interview-q">When asked to design an API, explicitly state: "I'll use REST — resources as nouns in the URL, HTTP verbs for actions, appropriate status codes, and JSON payloads. For internal service-to-service calls with high throughput requirements, I'd consider gRPC instead." This shows you understand when to use REST and when alternatives are better.</div></div>`,
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
          body: `<div class="diagram-box">✅ GOOD — Follow these patterns:

Plural nouns for collections:
  /products        (not /product)
  /orders          (not /order)
  /users           (not /user)

Specific resource IDs:
  /products/123    (not /products?id=123)
  /orders/ORD-789

Nested resources for clear ownership:
  /users/42/orders           (Rahul's orders)
  /users/42/orders/789       (Rahul's specific order)
  /products/123/reviews      (reviews FOR product 123)

Lowercase with hyphens (not camelCase):
  /product-categories        ✅
  /productCategories         ❌ (URL is not code)

❌ BAD — Anti-patterns:
  /getProducts               ← verb in URL
  /product/search/running    ← use query param: /products?q=running
  /user/42/order/all         ← "all" is not a resource
  /api/v1/PRODUCTS           ← don't uppercase URLs</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Action Endpoints vs Resources",
          body: `<p>Sometimes you need to model actions that don't fit CRUD. For example: "cancel an order", "apply coupon", "resend invoice". The cleanest REST approaches:</p>
<div class="key-list">
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>Model the state change:</strong> PATCH /orders/789 → body: <code>{"status": "cancelled"}</code>. The "action" is changing a resource's state field.</div></div>
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>Create a sub-resource for the action:</strong> POST /orders/789/cancellation → creates a Cancellation record. RESTful and auditable.</div></div>
  <div class="key-item"><div class="key-bullet">⚠️</div><div><strong>Action sub-path as last resort:</strong> POST /orders/789/cancel → acceptable for complex business operations with no natural resource representation.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Naming Test</div><div class="interview-q">Interviewers often give you a feature and ask you to design the API. They'll watch whether you use nouns or verbs, whether you use proper HTTP methods, and whether your URLs are predictable. A quick mental check: "Can a developer who's never seen this API correctly guess the URL for related resources?" If yes, your naming is good.</div></div>`,
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
          body: `<table class="compare-table"><thead><tr><th></th><th>Path Params</th><th>Query Params</th></tr></thead><tbody>
<tr><td><strong>Use for</strong></td><td>Identifying a specific resource</td><td>Filtering, sorting, pagination, searching</td></tr>
<tr><td><strong>Example</strong></td><td><code>/products/123</code><br><code>/users/42/orders/789</code></td><td><code>/products?category=shoes&brand=nike&sort=price&page=2&limit=20</code></td></tr>
<tr><td><strong>Required?</strong></td><td>Yes — without it the URL is invalid</td><td>No — defaults applied if missing</td></tr>
<tr><td><strong>Caching</strong></td><td>Distinct cache entry per resource ID</td><td>Each unique query string is a separate cache entry</td></tr>
<tr><td><strong>Wrong use</strong></td><td><code>/products/search</code> — "search" is not an ID</td><td><code>/products?id=123</code> — IDs should be path params</td></tr>
</tbody></table>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "ShopKart Search API Design",
          body: `<div class="diagram-box">ShopKart Product Search:

GET /products?q=running+shoes&category=footwear&brand=nike&min_price=2000&max_price=10000&sort=price_asc&page=2&limit=20

Path params (identifies resource):
  None — we're querying a collection, not a specific resource

Query params (filter/modify the collection):
  q=running+shoes   → free text search query
  category=footwear → filter by category
  brand=nike        → filter by brand
  min_price=2000    → price range filter
  max_price=10000   → price range filter
  sort=price_asc    → sort order
  page=2            → which page of results
  limit=20          → items per page (default: 20, max: 100)

Response:
  200 OK
  {
    "data": [...20 products...],
    "pagination": {
      "page": 2, "limit": 20, "total": 347,
      "next": "/products?...&page=3",
      "prev": "/products?...&page=1"
    }
  }</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Design Decision</div><div class="interview-q">When sketching API design in an interview, be deliberate: "The order ID is a path parameter since it uniquely identifies the resource. Filters like status=pending and date range are query parameters since they're optional and modify which resources are returned." This precision signals strong REST understanding.</div></div>`,
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
          body: `<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text">Before submitting, Rahul's browser generates a unique <strong>Idempotency Key</strong> (UUID): <code>key = crypto.randomUUID()</code> → "a3f2b1c4-..."</div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text">POST /orders with header <code>Idempotency-Key: a3f2b1c4-...</code></div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text">Server receives request. Checks Redis: Does key "a3f2b1c4-..." already exist? NO → process normally → creates order → stores result in Redis with key (TTL: 24h) → return 201.</div></div>
  <div class="step-item"><div class="step-num">4</div><div class="step-text">Network drops. Response never reaches browser. Browser auto-retries with the SAME idempotency key.</div></div>
  <div class="step-item"><div class="step-num">5</div><div class="step-text">Server receives retry. Checks Redis: Does key "a3f2b1c4-..." exist? YES → return the STORED result from step 3. No new order created. No new charge.</div></div>
</div>
<div class="callout tip"><span class="callout-icon">💡</span>Stripe, PayPal, and every major payment provider implement idempotency keys this way. It is the industry standard for payment APIs.</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Using timestamp as idempotency key.</strong> Two requests in the same millisecond = same key = second one wrongly deduplicated. Use UUID or CSPRNG-generated token.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Checking idempotency AFTER charging the card.</strong> The check must happen BEFORE any side effects. Otherwise race conditions can still result in double charges.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Not idempotency-protecting payment APIs.</strong> "Our frontend shows a confirmation dialog, users won't double-click" is not a distributed systems design. Networks fail, services crash, browsers retry. Always implement idempotency.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Payments Design</div><div class="interview-q">In any payment system or order-placement system interview, proactively mention idempotency: "The client generates an idempotency key per order attempt. The server stores the result keyed by this UUID. Retries within 24 hours return the cached result without re-processing." This is a critical safety mechanism that distinguishes senior from junior system designers.</div></div>`,
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
          body: `<table class="compare-table"><thead><tr><th>Strategy</th><th>How It Works</th><th>Best For</th><th>Problem</th></tr></thead><tbody>
<tr><td><strong>Offset/Limit</strong></td><td>LIMIT 20 OFFSET 40 → skip 40, take 20</td><td>Simple admin panels, low-traffic APIs</td><td>Deep pages are slow (DB scans 10,000 rows to skip to page 500). Inconsistent if data changes between pages.</td></tr>
<tr><td><strong>Cursor/Keyset</strong></td><td>WHERE id &gt; {lastSeenId} LIMIT 20</td><td>Infinite scroll, high-traffic feeds</td><td>No "jump to page N" capability. Cursor must be opaque and managed carefully.</td></tr>
<tr><td><strong>Page Tokens</strong></td><td>Server returns opaque next_page_token; client sends it back</td><td>External APIs (Google, Stripe), when you want to hide implementation</td><td>Client cannot predict next token. No random access.</td></tr>
</tbody></table>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Search Results — Cursor Pagination",
          body: `<div class="diagram-box">Page 1 Request:
  GET /products?q=shoes&limit=20
  
Page 1 Response:
  {
    "data": [...20 products, last one has id: 5730...],
    "pagination": {
      "limit": 20,
      "has_more": true,
      "next_cursor": "eyJpZCI6NTczMH0="   ← base64 encoded cursor
    }
  }

Page 2 Request (user scrolls down):
  GET /products?q=shoes&limit=20&cursor=eyJpZCI6NTczMH0=

Server decodes cursor → {id: 5730}
SQL: SELECT * FROM products WHERE id > 5730 AND ... LIMIT 20
                                  ↑ uses primary key index! Fast at any depth.

Page 2 Response:
  { "data": [...20 more products...], "pagination": {...next_cursor...} }

✅ Uses index (id > 5730) → same fast query whether page 1 or page 10,000
✅ Consistent: insertions/deletions don't cause skipped or repeated items
✅ Cursor is opaque: could change implementation without breaking clients</div>`,
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
          body: `<div class="diagram-box">Product Filtering:
  GET /products?
    category=footwear       → exact match filter
    &brand=nike,adidas      → multi-value filter (comma-separated)
    &min_price=1000         → range filter (lower bound)
    &max_price=5000         → range filter (upper bound)
    &in_stock=true          → boolean filter
    &rating_min=4.0         → minimum rating filter
    &sort=price_asc         → sort by price ascending
    &sort=rating_desc       → sort by rating descending (multiple sorts)
    &fields=id,name,price,image → sparse fieldset (return only these fields)

Order Filtering (admin panel):
  GET /orders?
    status=pending,processing     → multi-value status filter
    &created_after=2026-01-01     → date range filter
    &created_before=2026-02-01
    &user_id=42                   → filter by specific user
    &sort=created_at_desc         → newest first</div>`,
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
          body: `<div class="callout warn"><span class="callout-icon">⚠️</span><strong>Never interpolate filter values directly into SQL queries.</strong> GET /products?name=Nike' OR '1'='1 should NOT result in: <code>SELECT * FROM products WHERE name = 'Nike' OR '1'='1'</code>. Always use parameterised queries. Also validate and whitelist sortable columns — users should not be able to sort by "password_hash".</div>`,
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
          body: `<table class="compare-table"><thead><tr><th>Strategy</th><th>Example</th><th>Pros</th><th>Cons</th></tr></thead><tbody>
<tr><td><strong>URL Versioning</strong></td><td>/api/v1/products<br>/api/v2/products</td><td>Explicit, easy to see in logs, easy to route</td><td>URL pollution, resource duplication</td></tr>
<tr><td><strong>Header Versioning</strong></td><td>Accept: application/vnd.shopkart.v2+json</td><td>Clean URLs, semantically correct</td><td>Harder to test in browser, less visible</td></tr>
<tr><td><strong>Query Param</strong></td><td>/api/products?version=2</td><td>Easy to test</td><td>Not considered best practice</td></tr>
</tbody></table>
<p>URL versioning is the most common in practice (GitHub, Stripe, Twilio all use URL versioning). It's explicit, easy to debug, and easy to route at the proxy/gateway level.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Breaking vs Non-Breaking Changes",
          body: `<div class="diagram-box">NON-BREAKING (no version bump needed):
  ✅ Adding a new optional field to response
  ✅ Adding a new optional query parameter
  ✅ Adding a new endpoint
  ✅ Expanding an enum with new values (might need client care)
  ✅ Making a required field optional (loosening constraints)

BREAKING (requires version bump):
  ❌ Removing a response field clients depend on
  ❌ Renaming a field (same as remove + add)
  ❌ Changing field type (string → integer)
  ❌ Making an optional field required
  ❌ Changing URL structure
  ❌ Changing error response format

ShopKart v1 → v2 Migration Example:
  v1: GET /v1/orders/{id} → { "amount": 7999 }          (in paise)
  v2: GET /v2/orders/{id} → { "amount": { "value": 79.99, "currency": "INR" } }
  
  v2 is a breaking change (field type and structure changed).
  Both v1 and v2 run simultaneously. v1 deprecated with 12-month sunset.</div>`,
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
          body: `<div class="diagram-box">Standard ShopKart Error Response:
  HTTP/1.1 422 Unprocessable Entity
  Content-Type: application/json
  
  {
    "error": {
      "code": "VALIDATION_FAILED",           ← machine-readable, stable
      "message": "Request validation failed", ← human-readable summary
      "details": [
        {
          "field": "shipping_address.pincode",
          "code": "INVALID_PINCODE",
          "message": "Pincode '999999' is not a valid Indian pincode"
        },
        {
          "field": "items[0].quantity",
          "code": "EXCEEDS_STOCK",
          "message": "Only 3 units available, requested 10"
        }
      ],
      "request_id": "req-a3f2b1c4-...",      ← for support/debugging
      "docs_url": "https://docs.shopkart.com/errors/VALIDATION_FAILED"
    }
  }

Error Code Guide:
  400 Bad Request         → INVALID_REQUEST, MALFORMED_JSON
  401 Unauthorized        → AUTH_TOKEN_MISSING, AUTH_TOKEN_EXPIRED
  403 Forbidden           → INSUFFICIENT_PERMISSIONS, NOT_YOUR_RESOURCE
  404 Not Found           → PRODUCT_NOT_FOUND, ORDER_NOT_FOUND
  409 Conflict            → ORDER_ALREADY_EXISTS (idempotency key conflict)
  422 Unprocessable       → VALIDATION_FAILED, INVALID_PINCODE
  429 Too Many Requests   → RATE_LIMIT_EXCEEDED
  500 Internal Server     → INTERNAL_ERROR (never expose stack trace!)</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Critical Security: Never Expose Internal Details",
          body: `<div class="callout danger"><span class="callout-icon">🚨</span><strong>Never return stack traces, internal class names, SQL queries, or infrastructure details in error responses.</strong> <code>{"error": "NullPointerException at PaymentService.java:142"}</code> tells attackers your tech stack, file structure, and code paths. Return a generic message and log the details server-side with a correlation ID. The <code>request_id</code> lets support engineers look up the full error in logs without exposing it to the client.</div>`,
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
          body: `<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text">Seller's browser requests an upload URL: <code>POST /api/products/123/images/upload-url</code> → body: <code>{"filename": "nike-air.jpg", "content_type": "image/jpeg", "size_bytes": 245000}</code></div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text">ShopKart server validates: is this seller authorised? Is the file type allowed? Is the size under 10MB? Then calls AWS S3 to generate a <strong>presigned PUT URL</strong> — a temporary URL with embedded credentials, valid for 15 minutes.</div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text">Server returns: <code>{"upload_url": "https://s3.amazonaws.com/shopkart-images/...?X-Amz-Signature=...", "expires_in": 900}</code></div></div>
  <div class="step-item"><div class="step-num">4</div><div class="step-text">Browser PUTs the image file DIRECTLY to S3 using that URL. ShopKart's servers never see the image data — S3 authenticates using the embedded signature.</div></div>
  <div class="step-item"><div class="step-num">5</div><div class="step-text">S3 triggers a Lambda function on upload. Lambda runs virus scan, image validation, generates thumbnails, and stores the final URL.</div></div>
  <div class="step-item"><div class="step-num">6</div><div class="step-text">Lambda calls <code>PATCH /api/products/123/images/{imageId}</code> to confirm the upload is complete.</div></div>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Direct vs Presigned Comparison",
          body: `<table class="compare-table"><thead><tr><th></th><th>Direct Upload (via API)</th><th>Presigned URL (to S3)</th></tr></thead><tbody>
<tr><td><strong>Server Load</strong></td><td>High — every byte passes through your server</td><td>None — data goes directly to S3</td></tr>
<tr><td><strong>Speed</strong></td><td>Slower — double trip (client → server → S3)</td><td>Faster — single trip (client → S3)</td></tr>
<tr><td><strong>Max File Size</strong></td><td>Limited by server memory/timeout</td><td>S3 limit: 5TB</td></tr>
<tr><td><strong>Security Control</strong></td><td>Full — server validates everything</td><td>Partial — validate metadata before issuing URL</td></tr>
<tr><td><strong>Use For</strong></td><td>Small files (&lt;5MB), when you need to process/validate content</td><td>Large files, images, videos, backups</td></tr>
</tbody></table>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">S3 Presigned URLs</div><div class="interview-q">When asked how to handle image uploads in a design interview, describe pre-signed URLs: "The client requests a short-lived upload URL from our API. We validate permissions and size limits, generate an S3 pre-signed URL (valid 15 minutes), and return it. The client uploads directly to S3 — our servers are never in the data path for the binary content. This scales to unlimited concurrent uploads without adding server capacity."</div></div>`,
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
          body: `<div class="diagram-box">openapi: 3.1.0
info:
  title: ShopKart API
  version: "2.0"

paths:
  /products/{productId}:
    get:
      summary: Get product by ID
      parameters:
        - name: productId
          in: path
          required: true
          schema: { type: integer }
      responses:
        "200":
          description: Product found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Product"
        "404":
          description: Product not found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
      security:
        - bearerAuth: []

components:
  schemas:
    Product:
      type: object
      required: [id, name, price]
      properties:
        id: { type: integer }
        name: { type: string }
        price: { type: number, description: "Price in INR" }
        in_stock: { type: boolean }</div>`,
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
          body: `<div class="interview-card"><div class="interview-label">API-First Development</div><div class="interview-q">Mentioning API documentation and contract testing shows engineering maturity. "We'd write our OpenAPI spec first, generate mocks for frontend development, and add contract tests to our CI pipeline to ensure code always matches the spec. Documentation is auto-generated — never stale." This kind of process thinking impresses system design interviewers at senior levels.</div></div>`,
        },
      ],
    },
  ],
};

/* =====================================================
   diagrams.js  —  Architect Academy Diagram Engine
   Animated Flows | Interactive Diagrams | Companies | Library
   ===================================================== */

(function () {
  "use strict";

  /* ─────────────────────────────────────────────────── */
  /*  DATA: Animated Flows                               */
  /* ─────────────────────────────────────────────────── */

  const ANIMATED_FLOWS = [
    {
      id: "flow-website",
      title: "Opening a Website",
      icon: "🌐",
      description: "Step-by-step journey from browser to database and back",
      nodes: [
        { id: "n0", label: "User Browser", icon: "👤" },
        { id: "n1", label: "DNS Resolver", icon: "🔍" },
        { id: "n2", label: "CDN", icon: "🌍" },
        { id: "n3", label: "Load Balancer", icon: "⚖️" },
        { id: "n4", label: "Application Server", icon: "⚙️" },
        { id: "n5", label: "Database", icon: "🗄️" },
      ],
      steps: [
        {
          nodeId: "n0",
          title: "Step 1 — Browser Sends Request",
          desc: "Rahul types shopkart.com and hits Enter. The browser prepares an HTTP GET request and needs to find the server's IP address.",
        },
        {
          nodeId: "n1",
          title: "Step 2 — DNS Resolves Domain",
          desc: "DNS resolver translates shopkart.com → 13.234.56.78. The OS checks its cache first; on miss it queries the ISP's resolver → root DNS → TLD → authoritative DNS.",
        },
        {
          nodeId: "n2",
          title: "Step 3 — CDN Checks Cache",
          desc: "Request hits the nearest CloudFront edge node. If a cached copy of the page exists and is fresh, it returns immediately — no origin needed (~5ms).",
        },
        {
          nodeId: "n3",
          title: "Step 4 — Load Balancer Routes",
          desc: "CDN cache miss: request reaches the AWS ALB. It picks the least-busy application server using round-robin or least-connections algorithm.",
        },
        {
          nodeId: "n4",
          title: "Step 5 — Server Processes Request",
          desc: "The Node.js / Spring app parses the request, validates auth tokens, applies business logic, and determines what data it needs from the database.",
        },
        {
          nodeId: "n5",
          title: "Step 6 — Database Query Executed",
          desc: "A SQL or NoSQL query runs against the database. Index lookups make this fast (1–10ms for indexed queries). Results are returned to the app server.",
        },
        {
          nodeId: "n4",
          title: "Step 7 — Response Returned",
          desc: "The app server serialises the response to JSON, sets cache headers, and sends the HTTP 200 response back. The path reverses — LB → CDN caches it → browser renders.",
        },
      ],
    },
    {
      id: "flow-order",
      title: "Order Placement Flow",
      icon: "🛒",
      description: "How placing an order flows through microservices",
      nodes: [
        { id: "o0", label: "User", icon: "👤" },
        { id: "o1", label: "API Gateway", icon: "🚪" },
        { id: "o2", label: "Order Service", icon: "📋" },
        { id: "o3", label: "Payment Service", icon: "💳" },
        { id: "o4", label: "Inventory Service", icon: "📦" },
        { id: "o5", label: "Message Queue", icon: "📨" },
        { id: "o6", label: "Email Worker", icon: "📧" },
      ],
      steps: [
        {
          nodeId: "o0",
          title: "1️⃣ User Places Order",
          desc: "Rahul clicks 'Place Order'. The frontend sends POST /api/orders with cart items, delivery address, and payment details.",
        },
        {
          nodeId: "o1",
          title: "2️⃣ API Gateway Validates",
          desc: "Kong API Gateway checks JWT auth, enforces rate limits (max 5 orders/min per user), and routes to the Order Service on the internal network.",
        },
        {
          nodeId: "o2",
          title: "3️⃣ Order Service Creates Order",
          desc: "Order Service validates items are available, calculates total with taxes, writes a PENDING order record to its PostgreSQL database, and generates an order ID.",
        },
        {
          nodeId: "o3",
          title: "4️⃣ Payment Service Charges Card",
          desc: "Order Service calls Payment Service synchronously. Payment Service calls Stripe/Razorpay, charges the card, and returns a payment confirmation or failure.",
        },
        {
          nodeId: "o4",
          title: "5️⃣ Inventory Reserved",
          desc: "On payment success, Inventory Service is called to decrement stock. Uses optimistic locking to prevent overselling. Updates the order status to CONFIRMED.",
        },
        {
          nodeId: "o5",
          title: "6️⃣ Event Pushed to Queue",
          desc: "Order Service publishes an OrderConfirmed event to Kafka. This decouples downstream processing — the order flow is complete without waiting for email sending.",
        },
        {
          nodeId: "o6",
          title: "7️⃣ Email Worker Sends Confirmation",
          desc: "Email Worker consumes the event from Kafka, renders the confirmation email template with order details, and sends via SES. Failures are retried automatically.",
        },
      ],
    },
    {
      id: "flow-cache",
      title: "Cache Flow",
      icon: "⚡",
      description: "How Redis cache handles hits and misses",
      nodes: [
        { id: "c0", label: "User Request", icon: "👤" },
        { id: "c1", label: "App Server", icon: "⚙️" },
        { id: "c2", label: "Redis Cache", icon: "⚡" },
        { id: "c3", label: "Database", icon: "🗄️" },
      ],
      steps: [
        {
          nodeId: "c0",
          title: "Request Arrives",
          desc: "Rahul searches for 'running shoes'. The browser sends GET /api/search?q=running+shoes to the application server.",
        },
        {
          nodeId: "c1",
          title: "App Server Checks Cache",
          desc: "Before querying the database, the app server constructs the cache key: search:running+shoes and asks Redis: 'Do you have this?'",
        },
        {
          nodeId: "c2",
          title: "Cache Hit → Return Fast",
          desc: "✅ CACHE HIT: Redis returns the cached JSON in ~0.2ms. The app server skips the database entirely and returns the result to the user. No DB load.",
        },
        {
          nodeId: "c3",
          title: "Cache Miss → Query DB",
          desc: "❌ CACHE MISS: Redis returns NIL. The app queries PostgreSQL / Elasticsearch. This takes 20–50ms. Results come back from the database.",
        },
        {
          nodeId: "c2",
          title: "Store in Cache",
          desc: "The app server writes the result to Redis with a TTL (e.g., 5 minutes): SET search:running+shoes <result> EX 300. Future requests for the same query hit cache.",
        },
        {
          nodeId: "c0",
          title: "Response Returned",
          desc: "User receives the search results. Cache hit path = ~5ms total. Cache miss path = ~50ms. At scale, a 90% cache hit rate means 90% of users get 5ms responses.",
        },
      ],
    },

    /* ── User Login / Authentication ── */
    {
      id: "flow-login",
      title: "User Login / Authentication",
      icon: "🔐",
      description:
        "How credentials become a JWT and secure every subsequent request",
      nodes: [
        { id: "l0", label: "Browser", icon: "👤" },
        { id: "l1", label: "API Gateway", icon: "🚪" },
        { id: "l2", label: "Auth Service", icon: "🔐" },
        { id: "l3", label: "User DB", icon: "🗄️" },
        { id: "l4", label: "Token Store", icon: "⚡" },
      ],
      steps: [
        {
          nodeId: "l0",
          title: "Step 1 — User Submits Credentials",
          desc: "Priya enters her email and password and clicks Login. The browser sends POST /api/auth/login with a JSON body { email, password } over HTTPS. The password never travels in plain text — TLS encrypts the entire request body.",
        },
        {
          nodeId: "l1",
          title: "Step 2 — API Gateway Receives Request",
          desc: "The API Gateway accepts the request, terminates TLS, applies rate limiting (e.g., max 5 login attempts per minute per IP to prevent brute-force), and forwards the request to the Auth Service. No authentication check is needed here — the user is not yet logged in.",
        },
        {
          nodeId: "l2",
          title: "Step 3 — Auth Service Validates",
          desc: "Auth Service extracts the email, queries the User DB for the stored bcrypt hash, and calls bcrypt.compare(inputPassword, storedHash). bcrypt is intentionally slow (~100ms) to make brute-force attacks expensive. If the hash matches, authentication succeeds.",
        },
        {
          nodeId: "l3",
          title: "Step 4 — User Record Retrieved",
          desc: "The User DB returns the full user record: id, email, roles, account status. Auth Service checks: is the account active? is the email verified? is MFA enabled? If all checks pass, it proceeds to generate a token. A failed check returns 401 Unauthorized.",
        },
        {
          nodeId: "l4",
          title: "Step 5 — Refresh Token Stored",
          desc: "Auth Service generates two tokens: (1) Access Token — a short-lived JWT (15 min) containing userId and roles, signed with a private key. (2) Refresh Token — a long-lived opaque token (7 days) stored in Redis with a TTL. The refresh token allows getting new access tokens without re-logging in.",
        },
        {
          nodeId: "l0",
          title: "Step 6 — Tokens Sent to Browser",
          desc: "The access JWT is returned in the response body. The refresh token is set as an HttpOnly, Secure, SameSite=Strict cookie — JavaScript cannot read it, protecting against XSS. All subsequent API calls include the JWT in the Authorization: Bearer <token> header. The server validates the JWT signature on each request — no DB lookup needed for auth.",
        },
      ],
    },

    /* ── Load Balancer Flow ── */
    {
      id: "flow-loadbalancer",
      title: "Load Balancer Flow",
      icon: "⚖️",
      description:
        "How traffic is distributed, health-checked, and routed across servers",
      nodes: [
        { id: "lb0", label: "Incoming Requests", icon: "🌐" },
        { id: "lb1", label: "Load Balancer", icon: "⚖️" },
        { id: "lb2", label: "Server A", icon: "⚙️" },
        { id: "lb3", label: "Server B", icon: "⚙️" },
        { id: "lb4", label: "Server C", icon: "⚙️" },
      ],
      steps: [
        {
          nodeId: "lb0",
          title: "Step 1 — Traffic Arrives",
          desc: "ShopKart's DNS resolves to the Load Balancer's IP (or an Elastic IP / Anycast address). All requests from all users worldwide arrive at this single entry point first. The Load Balancer is the only component exposed to the internet — app servers are in a private subnet.",
        },
        {
          nodeId: "lb1",
          title: "Step 2 — Algorithm Selects a Server",
          desc: "The Load Balancer applies a routing algorithm. Round Robin: requests cycle through A → B → C → A. Least Connections: pick the server with fewest active connections — best for requests with variable processing time. IP Hash: same user always hits same server (sticky sessions). AWS ALB uses Least Outstanding Requests by default.",
        },
        {
          nodeId: "lb2",
          title: "Step 3 — Request Forwarded to Server A",
          desc: "The request is forwarded to Server A with the original client IP preserved in the X-Forwarded-For header. Server A processes the request, queries its services, and returns the response. The Load Balancer proxies the response back to the client. The client never knows Server A's private IP address.",
        },
        {
          nodeId: "lb3",
          title: "Step 4 — Health Checks Running Continuously",
          desc: "Every 30 seconds, the Load Balancer sends GET /health to each server. Server B responds 200 OK → healthy, keeps receiving traffic. If any server returns 5xx or times out 3 consecutive times, the LB marks it unhealthy and stops sending it traffic. When it recovers and passes health checks, it's added back automatically.",
        },
        {
          nodeId: "lb4",
          title: "Step 5 — Server C Fails",
          desc: "Server C crashes. Its /health endpoint stops responding. After 3 failed checks (90 seconds), the Load Balancer removes Server C from the pool. All new requests now route only to A and B. Users never see the failure — they may notice slightly slower responses during the rebalancing window, but zero errors.",
        },
        {
          nodeId: "lb1",
          title: "Step 6 — SSL Termination & Headers",
          desc: "Modern load balancers (AWS ALB, NGINX, HAProxy) also terminate TLS — they decrypt HTTPS at the LB, forwarding plain HTTP to private servers. This offloads expensive cryptography from app servers. The LB injects X-Forwarded-Proto: https so the app knows the original request was secure.",
        },
      ],
    },

    /* ── CDN Flow ── */
    {
      id: "flow-cdn",
      title: "CDN Flow",
      icon: "🌍",
      description:
        "How static assets travel from origin to edge and get cached globally",
      nodes: [
        { id: "cdn0", label: "User Browser", icon: "👤" },
        { id: "cdn1", label: "CDN Edge Node", icon: "🌍" },
        { id: "cdn2", label: "CDN Network", icon: "🔀" },
        { id: "cdn3", label: "Origin Server", icon: "⚙️" },
        { id: "cdn4", label: "S3 / Storage", icon: "🪣" },
      ],
      steps: [
        {
          nodeId: "cdn0",
          title: "Step 1 — Browser Requests Asset",
          desc: "Priya's browser in Chennai needs to load shopkart.com's homepage image: GET https://cdn.shopkart.com/images/hero-banner.jpg. DNS resolves cdn.shopkart.com via Anycast routing to the nearest CDN PoP (Point of Presence) — in this case, the Chennai edge node, ~5ms away.",
        },
        {
          nodeId: "cdn1",
          title: "Step 2 — Edge Node Cache Check",
          desc: "The Chennai CDN edge node checks its local cache for hero-banner.jpg. Cache HIT: the file was cached from a previous request. It returns the file immediately from local SSD — response time ~5ms. Cache MISS: the file is not cached. The edge node must fetch it from the origin.",
        },
        {
          nodeId: "cdn2",
          title: "Step 3 — Edge Fetches from Origin (Cache Miss)",
          desc: "On a cache miss, the Chennai edge node contacts the nearest CDN backbone node and forwards the request toward ShopKart's origin server. CDN providers have private high-speed networks (AWS backbone, Cloudflare's Argo Smart Routing) — travel time is measured in low-double-digit milliseconds even across continents.",
        },
        {
          nodeId: "cdn3",
          title: "Step 4 — Origin Serves the File",
          desc: "ShopKart's origin (an Express server or directly an S3 bucket configured as origin) returns the file with cache control headers: Cache-Control: public, max-age=31536000 (1 year). This tells the CDN: you can cache this for 1 year. For versioned assets (hero-banner.v3.jpg), this is safe because the filename changes on every deploy.",
        },
        {
          nodeId: "cdn4",
          title: "Step 5 — Cached at Edge Globally",
          desc: "The Chennai edge node caches the file locally for max-age. The next 10,000 users in Chennai get it from edge cache — origin receives zero load. CloudFront has 450+ edge locations. After the first user in each city triggers a cache miss, every subsequent user in that city gets ~5ms responses for up to a year.",
        },
        {
          nodeId: "cdn0",
          title: "Step 6 — Instant Response to Browser",
          desc: "Priya's browser receives the image file in ~5ms from the Chennai edge vs ~180ms from a US-based origin. CDN reduces page load time by 60–90% for global users. Static assets (JS, CSS, images, fonts, videos) account for 80–95% of web page bytes — CDN impact is enormous.",
        },
      ],
    },

    /* ── API Request Flow ── */
    {
      id: "flow-api",
      title: "API Request Flow",
      icon: "🔀",
      description: "Full lifecycle of a REST API call from client to response",
      nodes: [
        { id: "ap0", label: "Client App", icon: "📱" },
        { id: "ap1", label: "API Gateway", icon: "🚪" },
        { id: "ap2", label: "Auth Middleware", icon: "🔐" },
        { id: "ap3", label: "Service Handler", icon: "⚙️" },
        { id: "ap4", label: "Database / Cache", icon: "🗄️" },
      ],
      steps: [
        {
          nodeId: "ap0",
          title: "Step 1 — Client Sends API Request",
          desc: "The ShopKart mobile app sends GET /api/v1/products/12345 with headers: Authorization: Bearer <JWT>, Accept: application/json, X-Request-ID: uuid-123. The X-Request-ID traces this specific request through every downstream service for debugging and correlation.",
        },
        {
          nodeId: "ap1",
          title: "Step 2 — API Gateway Processing",
          desc: "API Gateway (Kong, AWS API Gateway, or NGINX) receives the request. It checks: (1) Is the route /api/v1/products/:id defined? (2) Has the caller exceeded rate limits (e.g., 100 req/min per token)? (3) Is the request size within limits? If any check fails, the gateway returns 429 Too Many Requests or 404 immediately — before any business logic runs.",
        },
        {
          nodeId: "ap2",
          title: "Step 3 — Authentication & Authorization",
          desc: "Auth middleware extracts the JWT from the Authorization header, verifies its signature using the public key (no DB call needed — JWTs are self-contained), and checks expiry. It then checks: does this user's role allow GET /products/:id? If the token is invalid or expired, return 401. If valid but insufficient permissions, return 403.",
        },
        {
          nodeId: "ap3",
          title: "Step 4 — Business Logic Executes",
          desc: "The Products Service handler receives the authenticated request with the decoded user context (userId, roles). It validates the productId format, applies any business logic (e.g., is this product visible in the user's region?), and fetches the data. This layer never touches the HTTP layer — it works with plain objects.",
        },
        {
          nodeId: "ap4",
          title: "Step 5 — Data Fetched",
          desc: "Service checks Redis cache first: GET product:12345. Cache hit returns in <1ms. Cache miss queries PostgreSQL: SELECT * FROM products WHERE id = 12345 — index lookup, ~2ms. Result is stored in Redis (SET product:12345 <json> EX 300) for future requests.",
        },
        {
          nodeId: "ap0",
          title: "Step 6 — Response Sent to Client",
          desc: "Service returns the product object. The controller serialises it to JSON, sets response headers (Content-Type: application/json, Cache-Control, ETag for conditional requests), and returns HTTP 200. Total round-trip (cache hit): ~15ms. Total (cache miss + DB): ~30ms. The X-Request-ID is returned so the client can report it for support.",
        },
      ],
    },

    /* ── Database Read/Write Flow ── */
    {
      id: "flow-database",
      title: "Database Read / Write Flow",
      icon: "🗄️",
      description:
        "How reads and writes are routed across primary and replica databases",
      nodes: [
        { id: "db0", label: "Application", icon: "⚙️" },
        { id: "db1", label: "Primary DB", icon: "🗄️" },
        { id: "db2", label: "Read Replica 1", icon: "📋" },
        { id: "db3", label: "Read Replica 2", icon: "📋" },
        { id: "db4", label: "WAL / Replication Log", icon: "📝" },
      ],
      steps: [
        {
          nodeId: "db0",
          title: "Step 1 — Application Initiates Operation",
          desc: "The app layer uses a connection router (PgBouncer, RDS Proxy, or app-level logic) that distinguishes writes from reads. All INSERT, UPDATE, DELETE and SELECT FOR UPDATE (locking reads) are routed to the Primary. All SELECT queries are routed to a Read Replica. This split is configured via two connection strings: DB_WRITE_URL and DB_READ_URL.",
        },
        {
          nodeId: "db1",
          title: "Step 2 — Write Goes to Primary",
          desc: "A new order is inserted: INSERT INTO orders (user_id, total, status) VALUES (...). The Primary acquires row-level locks, writes to its transaction log (WAL — Write-Ahead Log), commits the transaction, and returns the new order ID. ACID guarantees that either the full transaction commits or nothing does. Typical write latency: 2–10ms.",
        },
        {
          nodeId: "db4",
          title: "Step 3 — WAL Shipped to Replicas",
          desc: "PostgreSQL continuously streams the WAL (Write-Ahead Log) — a binary log of every change — to all Read Replicas. This is asynchronous by default: the Primary commits and responds BEFORE replicas apply the changes. Replication lag is typically 10–100ms on the same region. Synchronous replication (zero lag) halves write throughput — rarely used outside banking systems.",
        },
        {
          nodeId: "db2",
          title: "Step 4 — Read Routed to Replica 1",
          desc: "Priya's request to view her orders is routed to Read Replica 1. It runs: SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC. Because this replica is read-only, it has no lock contention from writes. PostgreSQL's MVCC ensures readers never block writers and writers never block readers on the same replica.",
        },
        {
          nodeId: "db3",
          title: "Step 5 — Load Distributed Across Replicas",
          desc: "With 2 read replicas, read capacity is roughly tripled. ShopKart routes 80% of all queries to replicas — product pages, search results, order history, user profiles. Only payments and inventory decrements go to the Primary. CloudWatch monitors replica lag — if it exceeds 500ms, the router temporarily sends reads to the Primary to avoid stale data.",
        },
        {
          nodeId: "db0",
          title: "Step 6 — Connection Pooling Efficiency",
          desc: "Each app server maintains a pool of 10 persistent connections to Primary and 20 to each Replica (via PgBouncer). When a request arrives, it borrows a connection, executes the query, and returns it to the pool. Without pooling, each request would open a new connection (~100ms). With pooling, connection overhead drops to ~0.1ms.",
        },
      ],
    },

    /* ── Message Queue Flow ── */
    {
      id: "flow-mq",
      title: "Message Queue Flow",
      icon: "📨",
      description:
        "How async message passing decouples services and handles failures",
      nodes: [
        { id: "mf0", label: "Order Service", icon: "📋" },
        { id: "mf1", label: "Kafka / SQS", icon: "📨" },
        { id: "mf2", label: "Email Worker", icon: "📧" },
        { id: "mf3", label: "Inventory Worker", icon: "📦" },
        { id: "mf4", label: "Dead Letter Queue", icon: "💀" },
      ],
      steps: [
        {
          nodeId: "mf0",
          title: "Step 1 — Order Service Publishes Event",
          desc: "Order Service completes an order (charge paid, record written to DB) and publishes a message to the Kafka topic order-confirmed: { orderId: 'ORD-789', userId: 42, items: [...], total: 2499 }. This takes ~1ms. The Order Service does NOT wait for emails or inventory updates — it returns HTTP 200 to the user immediately.",
        },
        {
          nodeId: "mf1",
          title: "Step 2 — Broker Stores Message Durably",
          desc: "Kafka writes the message to its partition log on disk with replication factor 3 (3 Kafka brokers each hold a copy). The message is assigned an offset (e.g., offset 10042) in partition 0. Kafka acknowledges receipt only after all 3 replicas have written it — guaranteeing no message is lost even if a broker dies immediately after the publish.",
        },
        {
          nodeId: "mf2",
          title: "Step 3 — Email Worker Consumes",
          desc: "Email Worker (Consumer Group: email-group) polls Kafka and picks up the message at offset 10042. It renders the order confirmation template, calls AWS SES to send the email, and commits the offset to mark the message as processed. If SES is down, the offset is not committed — Kafka retries delivery on the next poll. Message is never lost.",
        },
        {
          nodeId: "mf3",
          title: "Step 4 — Inventory Worker Consumes Independently",
          desc: "Inventory Worker (Consumer Group: inventory-group) reads the SAME message at the SAME offset 10042 — completely independent of the Email Worker. It decrements stock for each ordered item in the Inventory DB. Consumer groups each maintain their own offset cursor — adding a new consumer (e.g., fraud detection) requires zero changes to the producer or existing consumers.",
        },
        {
          nodeId: "mf4",
          title: "Step 5 — Dead Letter Queue on Failure",
          desc: "If the Email Worker fails to process a message 3 times (e.g., corrupt data, unhandled exception), the message is moved to the Dead Letter Queue (DLQ). Engineers are alerted via CloudWatch alarm. The message sits safely in the DLQ — the normal queue is unblocked and keeps processing. Engineers fix the bug and replay messages from the DLQ.",
        },
        {
          nodeId: "mf0",
          title: "Step 6 — Temporal Decoupling in Action",
          desc: "Suppose the Email Worker is down for 2 hours for maintenance. The Order Service never knows — it keeps publishing. Kafka retains all messages for 7 days. When Email Worker restarts, it reads all 5,000 messages that accumulated in its absence and processes them in order. This temporal decoupling is impossible with synchronous REST calls between services.",
        },
      ],
    },

    /* ── File Upload Flow ── */
    {
      id: "flow-upload",
      title: "File Upload Flow",
      icon: "📁",
      description:
        "How files travel securely from browser to permanent cloud storage",
      nodes: [
        { id: "fu0", label: "Browser", icon: "👤" },
        { id: "fu1", label: "API Server", icon: "⚙️" },
        { id: "fu2", label: "S3 Presigned URL", icon: "🔗" },
        { id: "fu3", label: "S3 Bucket", icon: "🪣" },
        { id: "fu4", label: "Lambda Processor", icon: "⚡" },
      ],
      steps: [
        {
          nodeId: "fu0",
          title: "Step 1 — User Selects a File",
          desc: "Priya selects her product image (product-photo.jpg, 3.2MB) in the ShopKart seller dashboard. The browser does NOT immediately upload to the server. First, it requests a pre-signed upload URL: POST /api/uploads/presign { filename: 'product-photo.jpg', contentType: 'image/jpeg', size: 3355443 }.",
        },
        {
          nodeId: "fu1",
          title: "Step 2 — Server Generates Pre-Signed URL",
          desc: "The API Server validates: is the user authenticated? is 3.2MB within the 10MB limit? is the MIME type allowed? Then it calls AWS S3 SDK to generate a pre-signed URL — a time-limited (e.g., 5-minute) signed URL that grants one-time permission to PUT directly to S3. The key is randomised: uploads/user-42/uuid-abc123.jpg. Server returns this URL to the browser.",
        },
        {
          nodeId: "fu2",
          title: "Step 3 — Browser Uploads Directly to S3",
          desc: "The browser sends PUT <presigned-url> with the raw file bytes directly to S3 — bypassing the API server entirely. This is the critical architectural insight: the API server never handles multi-megabyte file bytes. It stays lean. S3 receives the upload directly from the user's browser, saving bandwidth and memory on the app servers.",
        },
        {
          nodeId: "fu3",
          title: "Step 4 — File Stored in S3",
          desc: "S3 validates the pre-signed URL signature and expiry, checks the Content-Type matches, stores the file with 11-nines (99.999999999%) durability across multiple AZs, and triggers an S3 ObjectCreated event. The file is initially stored with private ACL — not publicly accessible until processing completes.",
        },
        {
          nodeId: "fu4",
          title: "Step 5 — Lambda Triggered for Processing",
          desc: "The S3 ObjectCreated event triggers a Lambda function automatically. Lambda downloads the raw image, uses Sharp/Pillow to generate 3 resized variants (thumbnail 150px, medium 600px, large 1200px), strips EXIF metadata (privacy), runs a malware/content-policy scan, and saves all variants back to S3 under /processed/.",
        },
        {
          nodeId: "fu0",
          title: "Step 6 — Database Updated, URL Returned",
          desc: "Lambda updates the Product DB with the processed image URLs: { thumbnail: 'cdn.shopkart.com/processed/uuid-abc123-150.jpg', medium: '...', large: '...' }. It sends an SNS notification to the API server, which stores the URLs and notifies Priya's browser via WebSocket: 'Your image is live!' Total time from upload complete to processed: ~3 seconds.",
        },
      ],
    },

    /* ── Search Flow ── */
    {
      id: "flow-search",
      title: "Search Flow",
      icon: "🔍",
      description:
        "How a search query is processed, ranked, and returned in milliseconds",
      nodes: [
        { id: "sf0", label: "User", icon: "👤" },
        { id: "sf1", label: "Search API", icon: "🔀" },
        { id: "sf2", label: "Redis Cache", icon: "⚡" },
        { id: "sf3", label: "Elasticsearch", icon: "🔍" },
        { id: "sf4", label: "Product DB", icon: "🗄️" },
      ],
      steps: [
        {
          nodeId: "sf0",
          title: "Step 1 — User Types a Query",
          desc: "Rahul types 'nike running shoes size 10' in the search bar. The browser debounces — it waits 300ms after the last keystroke before sending the request (preventing a query on every character). It sends GET /api/search?q=nike+running+shoes+size+10&page=1&sort=relevance&filters=brand:Nike.",
        },
        {
          nodeId: "sf1",
          title: "Step 2 — Search API Preprocesses Query",
          desc: "The Search API normalises the query: lowercasing, tokenisation ('nike', 'running', 'shoes', 'size', '10'), stop-word removal ('a', 'the', 'for' are dropped), and synonym expansion ('sneakers' mapped to 'shoes'). It constructs a structured Elasticsearch query with boosting: title matches rank higher than description matches.",
        },
        {
          nodeId: "sf2",
          title: "Step 3 — Cache Check for Popular Queries",
          desc: "Popular search terms (> 100 searches/hour) are cached in Redis. The API checks: GET search:nike-running-shoes-size-10:page1. Cache HIT: returns 50 result IDs in ~0.5ms. Cache MISS: proceeds to Elasticsearch. Popular query caching reduces Elasticsearch load by ~40% during peak hours (sale events, mornings).",
        },
        {
          nodeId: "sf3",
          title: "Step 4 — Elasticsearch Full-Text Search",
          desc: "Elasticsearch's inverted index maps every word to the documents containing it. Query execution: (1) Term matching across 10M product documents in <10ms using the index, (2) BM25 relevance scoring (considers term frequency, document length, field weighting), (3) Applied filters (brand:Nike, in-stock:true), (4) Returns top-50 productIds sorted by score.",
        },
        {
          nodeId: "sf4",
          title: "Step 5 — Enrich Results from Product DB",
          desc: "Elasticsearch returns IDs and scores but not full product details. The API fetches complete product data from PostgreSQL using SELECT * FROM products WHERE id IN (1,2,...50). Uses Redis cache for each product. Typically 95%+ of top results are hot products already in Redis — enrichment adds <5ms.",
        },
        {
          nodeId: "sf0",
          title: "Step 6 — Ranked Results Delivered",
          desc: "API returns a paginated JSON response with 50 products, total count, facets (available filters: brands, price ranges, ratings), and a searchId for analytics. Total latency (Elasticsearch path): 15–40ms. Cache hit path: 5ms. The searchId is logged — click events are tracked to improve future ranking via click-through rate signals.",
        },
      ],
    },

    /* ── Notification Flow ── */
    {
      id: "flow-notification",
      title: "Notification Flow",
      icon: "🔔",
      description:
        "How a single business event triggers multi-channel notifications",
      nodes: [
        { id: "nf0", label: "Event Source", icon: "📋" },
        { id: "nf1", label: "Notification Service", icon: "🔔" },
        { id: "nf2", label: "Push (FCM/APNs)", icon: "📱" },
        { id: "nf3", label: "Email (SES)", icon: "📧" },
        { id: "nf4", label: "SMS (SNS/Twilio)", icon: "📲" },
      ],
      steps: [
        {
          nodeId: "nf0",
          title: "Step 1 — Business Event Triggers Notification",
          desc: "Order Service publishes OrderShipped event to Kafka: { orderId: 'ORD-789', userId: 42, trackingId: 'BD12345', estimatedDelivery: '2026-03-11' }. The event is a fact — it does not decide how to notify the user. That decision belongs to the Notification Service. This separation means adding WhatsApp notifications later requires zero changes to Order Service.",
        },
        {
          nodeId: "nf1",
          title: "Step 2 — Notification Service Processes Event",
          desc: "Notification Service consumes the event and looks up the user's preferences: does Priya have push enabled? Is she opted into SMS? What are her quiet hours (11pm–7am)? It fetches her device tokens from the Token Store and determines channels to use. Template engine renders personalised content: 'Your order ORD-789 shipped! Arriving by March 11.'",
        },
        {
          nodeId: "nf2",
          title: "Step 3 — Push Notification via FCM/APNs",
          desc: "For Android: Firebase Cloud Messaging (FCM). For iOS: Apple Push Notification service (APNs). Notification Service sends the push payload to FCM which routes it to Priya's device registration token. FCM handles device connectivity — if her phone is offline, FCM queues the push for up to 4 weeks. Delivery rate: ~95% on active devices.",
        },
        {
          nodeId: "nf3",
          title: "Step 4 — Email via Amazon SES",
          desc: "HTML email is rendered from a Jinja2/Handlebars template with order details, tracking link, and estimated delivery. Sent via Amazon SES (Simple Email Service). SES manages: SPF/DKIM/DMARC signing (prevents spam classification), bounce handling (hard bounces auto-unsubscribe), complaint tracking. Cost: $0.10 per 1,000 emails. Delivery time: 30 seconds to 2 minutes.",
        },
        {
          nodeId: "nf4",
          title: "Step 5 — SMS via SNS / Twilio",
          desc: "SMS is sent only if the user enabled it AND the order value > ₹500 (cost control). Notification Service calls Twilio or AWS SNS Transactional SMS API with a short message (160 chars): 'ShopKart: Order #789 shipped! Track: shopkart.com/track/BD12345'. SMS delivery is ~98% within 15 seconds in India. Twilio provides delivery receipts for each message.",
        },
        {
          nodeId: "nf0",
          title: "Step 6 — Delivery Tracking & Retry",
          desc: "Every notification attempt is logged: { channel, userId, status, timestamp, messageId }. Push delivery confirmed by FCM webhook. Email bounces/opens tracked via SES events. Undelivered notifications are retried with exponential backoff (1min, 5min, 30min). After 3 failures on a device token, it is flagged as inactive and cleaned from the Token Store.",
        },
      ],
    },
  ];

  /* ─────────────────────────────────────────────────── */
  /*  DATA: Interactive Diagrams                         */
  /* ─────────────────────────────────────────────────── */

  const INTERACTIVE_DIAGRAMS = [
    {
      id: "idia-microservices",
      title: "Microservices Architecture",
      icon: "🏗️",
      description: "Click any service to learn what it does",
      layout: "tree",
      nodes: [
        {
          id: "ims0",
          label: "Client",
          icon: "👤",
          x: 50,
          y: 0,
          info: {
            title: "Client (Browser / Mobile App)",
            body: "The frontend — Rahul's browser or the ShopKart mobile app. Sends HTTP requests to the API Gateway. Never communicates directly with individual microservices.",
          },
        },
        {
          id: "ims1",
          label: "API Gateway",
          icon: "🚪",
          x: 50,
          y: 1,
          info: {
            title: "API Gateway (Kong)",
            body: "Single entry point for all external traffic. Handles: JWT authentication, rate limiting (429 Too Many Requests), request routing to the correct service, SSL termination, request logging, and distributed tracing injection.",
          },
        },
        {
          id: "ims2",
          label: "User Service",
          icon: "👥",
          x: 10,
          y: 2,
          info: {
            title: "User Service",
            body: "Manages user accounts, authentication, and profiles. Issues JWTs on login. Stores data in its own PostgreSQL database. Other services validate JWTs but never call User Service for every request — they trust the token.",
          },
        },
        {
          id: "ims3",
          label: "Product Service",
          icon: "📦",
          x: 35,
          y: 2,
          info: {
            title: "Product Service",
            body: "Manages the product catalog: names, descriptions, images, categories, pricing. Backed by PostgreSQL for structured data and Elasticsearch for full-text search. Product images are stored in S3 and served via CloudFront CDN.",
          },
        },
        {
          id: "ims4",
          label: "Order Service",
          icon: "📋",
          x: 60,
          y: 2,
          info: {
            title: "Order Service",
            body: "Handles order lifecycle: creation, status updates, cancellation. Calls Payment Service and Inventory Service synchronously during checkout. Publishes OrderConfirmed events to Kafka for async downstream processing.",
          },
        },
        {
          id: "ims5",
          label: "Payment Service",
          icon: "💳",
          x: 85,
          y: 2,
          info: {
            title: "Payment Service",
            body: "Handles payment processing via Stripe/Razorpay. Stores payment records with their own database. Implements idempotency keys to prevent double charges on retries. PCI-DSS compliant — never stores raw card numbers.",
          },
        },
      ],
      connections: [
        { from: "ims0", to: "ims1" },
        { from: "ims1", to: "ims2" },
        { from: "ims1", to: "ims3" },
        { from: "ims1", to: "ims4" },
        { from: "ims1", to: "ims5" },
      ],
    },
    {
      id: "idia-msgqueue",
      title: "Message Queue Architecture",
      icon: "📨",
      description: "Click Producer, Queue, or Consumer to learn each role",
      layout: "linear",
      nodes: [
        {
          id: "mq0",
          label: "Producer",
          icon: "📤",
          info: {
            title: "Producer — Order Service",
            body: "The Order Service publishes events after successful order creation. It does NOT wait for emails or notifications to be sent — it just fires an event and moves on. This is asynchronous decoupling: the order flow completes in under 100ms regardless of what downstream systems do.",
          },
        },
        {
          id: "mq1",
          label: "Message Queue",
          icon: "📨",
          info: {
            title: "Message Queue — Apache Kafka",
            body: "Kafka stores events in ordered, immutable logs called topics. Unlike RabbitMQ, consumed messages are NOT deleted — they persist for a configured retention period (e.g., 7 days). Multiple consumers can independently read the same event. Kafka guarantees at-least-once delivery with durability across replicas.",
          },
        },
        {
          id: "mq2",
          label: "Email Worker",
          icon: "📧",
          info: {
            title: "Consumer — Email Worker",
            body: "An independent service that subscribes to the OrderConfirmed Kafka topic. Reads events, renders the email template, and sends via AWS SES. If SES is down, the worker retries with exponential backoff. Kafka remembers the last committed offset, so after recovery, the worker processes missed events in order.",
          },
        },
        {
          id: "mq3",
          label: "Analytics Worker",
          icon: "📊",
          info: {
            title: "Consumer — Analytics Worker",
            body: "Another independent consumer reading the SAME Kafka events. Updates analytics dashboards, revenue metrics, and reporting databases. Because Kafka retains messages, this service can replay past events to rebuild its data if it crashes or is deployed fresh.",
          },
        },
        {
          id: "mq4",
          label: "Push Notification",
          icon: "🔔",
          info: {
            title: "Consumer — Push Notification Service",
            body: "Sends mobile/web push notifications when orders are confirmed. Reads from the same topic as the email worker using a different consumer group. Consumer groups allow multiple services to independently track their own read position in the Kafka log.",
          },
        },
      ],
      connections: [
        { from: "mq0", to: "mq1" },
        { from: "mq1", to: "mq2" },
        { from: "mq1", to: "mq3" },
        { from: "mq1", to: "mq4" },
      ],
    },

    /* ── Monolithic Architecture ───────────────────── */
    {
      id: "idia-monolith",
      title: "Monolithic Architecture",
      icon: "🧱",
      description:
        "Click each layer to understand how a monolith is structured",
      layout: "linear",
      nodes: [
        {
          id: "mo0",
          label: "Client Browser / App",
          icon: "👤",
          info: {
            title: "Client Browser / Mobile App",
            body: "Every request originates here — a browser GET, a mobile API call. In a monolith, there is one single URL/domain. All features — login, products, orders, payments — live under the same server. This simplifies CORS, auth cookies, and deployments. There is no API Gateway needed; the monolith routes everything internally.",
          },
        },
        {
          id: "mo1",
          label: "Presentation Layer",
          icon: "🖥️",
          info: {
            title: "Presentation Layer — Routes & Controllers",
            body: "All HTTP route handlers and controllers live here. In a Spring Boot or Django monolith, every route /api/products, /api/orders, /login is defined in the same codebase. Requests flow in, are validated, then handed to the service layer. Server-side templating (JSP, Jinja2) or JSON serialisation for a SPA both happen here.",
          },
        },
        {
          id: "mo2",
          label: "Business Logic Layer",
          icon: "⚙️",
          info: {
            title: "Business Logic Layer — Services & Domain Logic",
            body: "All business rules live in one process: UserService, OrderService, ProductService, PaymentService are all loaded in the same JVM / Python process. They can call each other directly as function calls — no HTTP overhead, no serialisation, no network latency. This is the monolith's biggest performance advantage: in-process calls are nanoseconds, not milliseconds.",
          },
        },
        {
          id: "mo3",
          label: "Data Access Layer",
          icon: "📂",
          info: {
            title: "Data Access Layer — Repositories & ORM",
            body: "All database access is centralised. Every service uses the same connection pool to the same database. Hibernate, SQLAlchemy, or ActiveRecord ORM maps objects to tables. Transactions can span multiple domain objects easily — e.g., decrementing inventory AND creating an order in one ACID transaction. This is extremely hard to replicate in microservices without distributed transactions.",
          },
        },
        {
          id: "mo4",
          label: "Single Database",
          icon: "🗄️",
          info: {
            title: "Single Shared Database — PostgreSQL / MySQL",
            body: "One database holds all data: users, products, orders, payments. This gives you free JOINs across any tables, global ACID transactions, and a single source of truth. The downside: every team writes to the same schema. A bad migration can take down the entire app. At scale (100M+ users), a single DB becomes a bottleneck — this is typically when teams start splitting into microservices.",
          },
        },
      ],
      connections: [
        { from: "mo0", to: "mo1" },
        { from: "mo1", to: "mo2" },
        { from: "mo2", to: "mo3" },
        { from: "mo3", to: "mo4" },
      ],
    },

    /* ── Event-Driven Architecture ─────────────────── */
    {
      id: "idia-eventdriven",
      title: "Event-Driven Architecture",
      icon: "⚡",
      description:
        "Click any component to understand event flow and decoupling",
      layout: "tree",
      nodes: [
        {
          id: "ev0",
          label: "Event Producer",
          icon: "📤",
          x: 50,
          y: 0,
          info: {
            title: "Event Producer — Order Service",
            body: "The Order Service completes its local work (writes order to DB, charges payment) and then publishes an OrderPlaced event. It does NOT know — or care — who listens. This is the core of EDA: producers are fully decoupled from consumers. Adding a new consumer (e.g., a fraud detection service) requires zero changes to the producer.",
          },
        },
        {
          id: "ev1",
          label: "Event Broker",
          icon: "🔀",
          x: 50,
          y: 1,
          info: {
            title: "Event Broker — Kafka / AWS EventBridge",
            body: "The broker receives events and durably stores them in a topic/stream. It fans out copies to every subscriber. Kafka retains events for days — consumers can replay history, rebuild their state, or catch up after downtime. This persistence is what makes EDA resilient: a consumer crashing does NOT lose events. They wait in the broker.",
          },
        },
        {
          id: "ev2",
          label: "Fulfillment Handler",
          icon: "📦",
          x: 10,
          y: 2,
          info: {
            title: "Consumer — Fulfillment Service",
            body: "Reacts to OrderPlaced by reserving inventory, assigning a warehouse pick list, and scheduling dispatch. Completely independent of other consumers. If this service is slow, it does not slow down email sending — each consumer processes at its own pace with its own offset/position in the event stream.",
          },
        },
        {
          id: "ev3",
          label: "Notification Handler",
          icon: "📧",
          x: 37,
          y: 2,
          info: {
            title: "Consumer — Notification Service",
            body: "Sends order confirmation email and SMS. Subscribes to the same OrderPlaced event using a different consumer group. Consumer groups are how multiple independent services can read the same stream without competing — Kafka tracks each group's position separately.",
          },
        },
        {
          id: "ev4",
          label: "Analytics Handler",
          icon: "📊",
          x: 63,
          y: 2,
          info: {
            title: "Consumer — Analytics Service",
            body: "Aggregates order events for dashboards: revenue per minute, conversion rates, top products. Can replay the full event history to backfill data. Because events are immutable facts, you can derive any read model from them — this is the basis of Event Sourcing, where the event log IS the database.",
          },
        },
        {
          id: "ev5",
          label: "Audit Log Handler",
          icon: "📋",
          x: 90,
          y: 2,
          info: {
            title: "Consumer — Audit Log Service",
            body: "Records every business event to an immutable audit trail for compliance (GDPR, PCI-DSS, SOX). Since events are already immutable and timestamped in Kafka, this consumer simply writes them to a cold-storage audit database. Zero extra instrumentation needed in the producer code.",
          },
        },
      ],
      connections: [
        { from: "ev0", to: "ev1" },
        { from: "ev1", to: "ev2" },
        { from: "ev1", to: "ev3" },
        { from: "ev1", to: "ev4" },
        { from: "ev1", to: "ev5" },
      ],
    },

    /* ── Serverless Architecture ───────────────────── */
    {
      id: "idia-serverless",
      title: "Serverless Architecture",
      icon: "☁️",
      description: "Click any component to understand the serverless model",
      layout: "tree",
      nodes: [
        {
          id: "sl0",
          label: "Client App",
          icon: "👤",
          x: 50,
          y: 0,
          info: {
            title: "Client — Browser / Mobile App",
            body: "The client calls your REST or GraphQL API exactly as before. From the client's perspective, serverless is completely invisible — it sees HTTP requests and responses. The difference is entirely on the infrastructure side: there are no long-running servers waiting for requests.",
          },
        },
        {
          id: "sl1",
          label: "API Gateway",
          icon: "🚪",
          x: 50,
          y: 1,
          info: {
            title: "API Gateway — AWS API Gateway / Cloudflare Workers",
            body: "The API Gateway receives all HTTP requests and routes each path/method to the correct Lambda function. It handles SSL termination, CORS headers, authentication (Cognito/JWT), rate limiting, and request/response transformation — all without you managing a server. Cost: ~$3.50 per million API calls.",
          },
        },
        {
          id: "sl2",
          label: "Auth Function",
          icon: "🔐",
          x: 10,
          y: 2,
          info: {
            title: "Lambda — Auth Function",
            body: "Handles login, token validation, and user registration. Runs ONLY when called — spins up in 50–500ms cold start, executes in milliseconds, then shuts down. If 10,000 users log in simultaneously, AWS runs 10,000 parallel instances automatically. You pay only for the ~50ms of execution time, not 24/7 server uptime.",
          },
        },
        {
          id: "sl3",
          label: "Products Function",
          icon: "📦",
          x: 37,
          y: 2,
          info: {
            title: "Lambda — Products Function",
            body: "Handles product catalog reads and searches. This function can scale to zero when no requests arrive (saving money) and scale to thousands of concurrent instances during a flash sale. Each function is deployed and versioned independently — updating the Products Lambda does not redeploy the Orders Lambda.",
          },
        },
        {
          id: "sl4",
          label: "Orders Function",
          icon: "📋",
          x: 63,
          y: 2,
          info: {
            title: "Lambda — Orders Function",
            body: "Processes order creation and updates. Writes to DynamoDB and publishes events to SNS/EventBridge. The 15-minute Lambda execution limit means long-running workflows must be broken into step functions or delegated to async queues (SQS). Lambda functions should be small, focused, and fast.",
          },
        },
        {
          id: "sl5",
          label: "DynamoDB",
          icon: "⚡",
          x: 30,
          y: 3,
          info: {
            title: "DynamoDB — Serverless Database",
            body: "DynamoDB is the natural database partner for Lambda: fully managed, auto-scales with no connection pool management. Since Lambda may spawn 1000s of instances, traditional RDBMS connection limits become a problem — each Lambda opens a DB connection. DynamoDB's HTTP-based API sidesteps this entirely. For complex queries, RDS Proxy proxies connections to relational DBs.",
          },
        },
        {
          id: "sl6",
          label: "S3 Storage",
          icon: "🪣",
          x: 70,
          y: 3,
          info: {
            title: "S3 — Object Storage",
            body: "Stores user uploads, product images, order PDFs, and static website assets. S3 events can also TRIGGER Lambda functions automatically — e.g., upload an image to S3 → triggers a Lambda to resize it → saves thumbnail back to S3. This S3 → Lambda trigger pattern is fundamental to serverless data pipelines.",
          },
        },
      ],
      connections: [
        { from: "sl0", to: "sl1" },
        { from: "sl1", to: "sl2" },
        { from: "sl1", to: "sl3" },
        { from: "sl1", to: "sl4" },
        { from: "sl2", to: "sl5" },
        { from: "sl3", to: "sl5" },
        { from: "sl4", to: "sl5" },
        { from: "sl4", to: "sl6" },
      ],
    },

    /* ── Layered (N-Tier) Architecture ─────────────── */
    {
      id: "idia-layered",
      title: "Layered (N-Tier) Architecture",
      icon: "🎂",
      description:
        "Click each tier to understand its responsibility and boundaries",
      layout: "linear",
      nodes: [
        {
          id: "ly0",
          label: "Presentation Tier",
          icon: "🖥️",
          info: {
            title: "Presentation Tier — UI Layer",
            body: "Responsible only for displaying data and capturing user input. React, Angular, or server-rendered HTML. This layer MUST NOT contain business logic or touch the database directly. Separation here means the UI can be replaced (web → mobile) without touching any business rules or database code. Calls down to the API / Business layer only.",
          },
        },
        {
          id: "ly1",
          label: "API / Controller Tier",
          icon: "🔀",
          info: {
            title: "API / Controller Tier — Request Handling",
            body: "Receives HTTP requests, validates input (are required fields present? is the token valid?), and delegates to the business logic layer. Returns HTTP responses. This layer owns: routing, input validation, authentication & authorisation checks, serialisation (JSON ↔ objects), and error-to-HTTP status mapping. It does NOT contain business rules.",
          },
        },
        {
          id: "ly2",
          label: "Business Logic Tier",
          icon: "⚙️",
          info: {
            title: "Business Logic Tier — Domain Services",
            body: "The heart of the application. ALL business rules live here: 'an order cannot be placed if inventory is zero', 'discount applies only to premium users', 'payment must be retried 3 times before failing'. This layer is framework-agnostic — it should run without a web server or database. Testing business logic is fast and reliable when it has no external dependencies.",
          },
        },
        {
          id: "ly3",
          label: "Data Access Tier",
          icon: "📂",
          info: {
            title: "Data Access Tier — Repository / ORM Layer",
            body: "Abstracts all database operations behind interfaces (Repository pattern). The business layer calls userRepository.findById(id) without knowing if it's PostgreSQL, MySQL, or MongoDB underneath. This abstraction enables: swapping databases without rewriting business logic, easier unit testing with mock repositories, and centralised query optimisation in one place.",
          },
        },
        {
          id: "ly4",
          label: "Database Tier",
          icon: "🗄️",
          info: {
            title: "Database Tier — Persistent Storage",
            body: "PostgreSQL, MySQL, or any persistence store. Only the Data Access tier communicates directly with the database — no other tier makes direct DB calls. This strict boundary prevents the 'database everywhere' antipattern where business logic leaks into SQL query strings. Each layer only calls the layer directly below it — this is the defining rule of N-tier architecture.",
          },
        },
      ],
      connections: [
        { from: "ly0", to: "ly1" },
        { from: "ly1", to: "ly2" },
        { from: "ly2", to: "ly3" },
        { from: "ly3", to: "ly4" },
      ],
    },

    /* ── CQRS Architecture ─────────────────────────── */
    {
      id: "idia-cqrs",
      title: "CQRS Architecture",
      icon: "🔀",
      description:
        "Click each component to understand command/query separation",
      layout: "tree",
      nodes: [
        {
          id: "cq0",
          label: "Client",
          icon: "👤",
          x: 50,
          y: 0,
          info: {
            title: "Client — Command or Query?",
            body: "Every client request is classified as either a Command (change state: place order, update profile) or a Query (read state: get product, list orders). CQRS routes these down completely separate paths with separate models optimised for each. Most systems are 80–90% reads — CQRS lets you scale and optimise them independently.",
          },
        },
        {
          id: "cq1",
          label: "Command Handler",
          icon: "✏️",
          x: 20,
          y: 1,
          info: {
            title: "Command Handler — Write Side",
            body: "Receives write requests: PlaceOrder, CancelOrder, UpdateProduct. Validates the command, applies business rules, and writes to the Write Database. After a successful write, it publishes a domain event (OrderPlaced, OrderCancelled) to the Event Bus. The write model is normalised (3NF) for data integrity, not optimised for query speed.",
          },
        },
        {
          id: "cq2",
          label: "Query Handler",
          icon: "🔍",
          x: 80,
          y: 1,
          info: {
            title: "Query Handler — Read Side",
            body: "Handles read requests: GetOrderDetails, ListProductsByCategory. Reads from a denormalised Read Model specifically built for fast queries. No joins needed — all data is pre-computed. Because the Read Handler never writes, it can be scaled independently and can run against read replicas or a completely different database technology (e.g., Elasticsearch for search).",
          },
        },
        {
          id: "cq3",
          label: "Write DB",
          icon: "🗄️",
          x: 20,
          y: 2,
          info: {
            title: "Write Database — Normalised PostgreSQL",
            body: "Stores the canonical system state in a normalised relational schema. Optimised for write integrity: ACID transactions, foreign keys, constraints. Only the Command Handler writes here. Because it's not used for complex read queries, it can be a lean, write-optimised database. Aurora PostgreSQL with no read replicas is common here.",
          },
        },
        {
          id: "cq4",
          label: "Event Bus",
          icon: "📡",
          x: 50,
          y: 2,
          info: {
            title: "Event Bus — Change Propagation",
            body: "After every successful write, the Command Handler publishes a domain event (OrderPlaced, InventoryChanged) to Kafka or EventBridge. The Read Model Projector subscribes to these events and asynchronously updates the denormalised Read Model. This is eventual consistency: the Read Model may lag the Write DB by milliseconds to seconds.",
          },
        },
        {
          id: "cq5",
          label: "Read Model",
          icon: "⚡",
          x: 80,
          y: 2,
          info: {
            title: "Read Model — Denormalised View Store",
            body: "Pre-computed, denormalised views purpose-built for specific queries. Instead of joining 5 tables for every order page load, the Read Model stores a pre-joined document: {orderId, productName, customerName, total, status} — all in one row/document. Technology: Redis for hot data, Elasticsearch for full-text search, PostgreSQL read replicas, or a document store like MongoDB. Rebuilding read models from the event log is always possible.",
          },
        },
      ],
      connections: [
        { from: "cq0", to: "cq1" },
        { from: "cq0", to: "cq2" },
        { from: "cq1", to: "cq3" },
        { from: "cq1", to: "cq4" },
        { from: "cq4", to: "cq5" },
        { from: "cq2", to: "cq5" },
      ],
    },
  ];

  /* ─────────────────────────────────────────────────── */
  /*  DATA: Real Company Architectures                   */
  /* ─────────────────────────────────────────────────── */

  const COMPANY_ARCHITECTURES = [
    {
      id: "arch-amazon",
      company: "Amazon-style",
      title: "E-commerce Architecture",
      icon: "🛒",
      color: "#FF9900",
      diagram: [
        { label: "Users", icon: "👥", type: "user" },
        { label: "Route53 (DNS)", icon: "🔍", type: "infra" },
        { label: "CloudFront CDN", icon: "🌍", type: "infra" },
        { label: "Load Balancer", icon: "⚖️", type: "infra" },
        {
          label: "Microservices Cluster",
          icon: "🏗️",
          type: "service",
          children: [
            "User Service",
            "Product Service",
            "Order Service",
            "Payment Service",
          ],
        },
        {
          label: "Databases",
          icon: "🗄️",
          type: "data",
          children: ["User DB", "Product DB", "Order DB"],
        },
        { label: "Redis Cache", icon: "⚡", type: "cache" },
      ],
      insights: [
        "Route53 provides geo-routing: Indian users → Mumbai region, US users → Virginia",
        "CloudFront caches static assets at 450+ edge locations globally",
        "Each microservice has its own database — no shared DB across services",
        "Redis sits in front of DB for high-read endpoints like product catalog",
      ],
    },
    {
      id: "arch-netflix",
      company: "Netflix-style",
      title: "Streaming Architecture",
      icon: "🎬",
      color: "#E50914",
      diagram: [
        { label: "User Device", icon: "📱", type: "user" },
        { label: "CDN Edge Server", icon: "🌍", type: "infra" },
        { label: "Control Plane", icon: "🧠", type: "infra" },
        {
          label: "Microservices",
          icon: "🏗️",
          type: "service",
          children: ["Recommendation", "Playback", "User Profile", "Billing"],
        },
        {
          label: "Databases",
          icon: "🗄️",
          type: "data",
          children: [
            "Cassandra (events)",
            "MySQL (billing)",
            "Redis (sessions)",
          ],
        },
      ],
      insights: [
        "Video content is pre-encoded into 100+ bitrate/resolution variants and pushed to CDN edge nodes globally",
        "The CDN handles ~99% of video bytes — origin servers rarely serve video directly",
        "Recommendation engine processes billions of user interactions; serves from Redis cache",
        "Chaos Monkey randomly kills production instances to verify resilience at all times",
      ],
    },
    {
      id: "arch-uber",
      company: "Uber-style",
      title: "Real-Time Ride Architecture",
      icon: "🚗",
      color: "#000000",
      diagram: [
        { label: "Passenger App", icon: "📱", type: "user" },
        { label: "API Gateway", icon: "🚪", type: "infra" },
        { label: "Matching Service", icon: "🔄", type: "service" },
        { label: "Driver Service", icon: "🚗", type: "service" },
        { label: "Location Stream (Kafka)", icon: "📡", type: "queue" },
        { label: "Realtime Database", icon: "⚡", type: "data" },
      ],
      insights: [
        "Driver location updates stream to Kafka every 4 seconds from 5M+ active drivers",
        "Matching Service queries a geospatial index (H3 hexagonal grid) to find nearby drivers in <100ms",
        "WebSocket connections maintain real-time state between Uber app and backend",
        "Every microservice is stateless; driver state lives in Redis with 30s TTL",
      ],
    },
    {
      id: "arch-highscale",
      company: "High-Scale",
      title: "Generic High-Scale System",
      icon: "🚀",
      color: "#6366F1",
      diagram: [
        { label: "Users", icon: "👥", type: "user" },
        { label: "CDN", icon: "🌍", type: "infra" },
        { label: "Load Balancer", icon: "⚖️", type: "infra" },
        { label: "Stateless App Servers", icon: "⚙️", type: "service" },
        { label: "Redis Cache", icon: "⚡", type: "cache" },
        { label: "Message Queue", icon: "📨", type: "queue" },
        {
          label: "Database Cluster",
          icon: "🗄️",
          type: "data",
          children: ["Primary DB", "Read Replicas"],
        },
      ],
      insights: [
        "CDN absorbs 70–95% of traffic before it reaches origin servers",
        "App servers are stateless — any server can handle any request, enabling horizontal scaling",
        "Redis caches hot data: a 90% cache hit rate means 10x reduction in DB load",
        "Read replicas offload SELECT queries; primary handles only writes — typically 80/20 read/write split",
        "Message queue decouples slow async work (emails, reports) from fast synchronous API responses",
      ],
    },
  ];

  /* ─────────────────────────────────────────────────── */
  /*  DATA: Diagram Library                              */
  /* ─────────────────────────────────────────────────── */

  const DIAGRAM_LIBRARY = [
    {
      category: "Networking",
      icon: "🌐",
      color: "si-blue",
      items: [
        "Network Topology",
        "DNS Flow",
        "TCP Handshake",
        "HTTP Request Flow",
        "CDN Architecture",
      ],
    },
    {
      category: "API Design",
      icon: "🚪",
      color: "si-purple",
      items: [
        "REST API Flow",
        "API Gateway Architecture",
        "Authentication Flow",
        "JWT Validation",
        "File Upload Flow",
      ],
    },
    {
      category: "Security",
      icon: "🔐",
      color: "si-red",
      items: [
        "TLS Handshake",
        "OAuth2 Flow",
        "CORS Policy",
        "DDoS Mitigation",
        "Zero Trust Architecture",
      ],
    },
    {
      category: "Databases",
      icon: "🗄️",
      color: "si-green",
      items: [
        "Relational Schema",
        "Join Relationships",
        "Index Lookup",
        "Query Execution Plan",
        "Transaction Lifecycle",
      ],
    },
    {
      category: "Architecture",
      icon: "🏛️",
      color: "si-cyan",
      items: [
        "Monolith Evolution",
        "Microservices Mesh",
        "Event-Driven System",
        "CQRS Pattern",
        "Saga Pattern",
      ],
    },
    {
      category: "Scaling",
      icon: "📈",
      color: "si-orange",
      items: [
        "Horizontal Scaling",
        "Auto Scaling Group",
        "Database Sharding",
        "Read Replicas",
        "Connection Pooling",
      ],
    },
    {
      category: "Caching",
      icon: "⚡",
      color: "si-yellow",
      items: [
        "Cache-Aside Pattern",
        "Write-Through Cache",
        "Cache Invalidation",
        "CDN Caching Strategy",
        "Redis Cluster",
      ],
    },
    {
      category: "Distributed Systems",
      icon: "🔗",
      color: "si-blue",
      items: [
        "Pub/Sub System",
        "Message Queue Processing",
        "Retry + Backoff",
        "Circuit Breaker",
        "Consensus (Raft)",
      ],
    },
    {
      category: "Cloud",
      icon: "☁️",
      color: "si-purple",
      items: [
        "AWS VPC Architecture",
        "Multi-AZ Deployment",
        "S3 + CloudFront",
        "RDS Replication",
        "Lambda Architecture",
      ],
    },
    {
      category: "Deployment",
      icon: "🚀",
      color: "si-green",
      items: [
        "CI/CD Pipeline",
        "Blue-Green Deploy",
        "Canary Release",
        "Docker + K8s",
        "GitOps Flow",
      ],
    },
  ];

  /* ─────────────────────────────────────────────────── */
  /*  Animation Engine                                   */
  /* ─────────────────────────────────────────────────── */

  let animState = {
    flowId: null,
    step: 0,
    playing: false,
    timer: null,
  };

  function playFlow(flowData) {
    animState.flowId = flowData.id;
    animState.step = 0;
    animState.playing = false;
    if (animState.timer) clearInterval(animState.timer);
    renderFlowAnimator(flowData);
  }

  function setStep(flowData, stepIndex) {
    animState.step = Math.max(
      0,
      Math.min(stepIndex, flowData.steps.length - 1),
    );
    refreshFlowHighlight(flowData);
  }

  function togglePlay(flowData) {
    animState.playing = !animState.playing;
    if (animState.playing) {
      animState.timer = setInterval(() => {
        if (animState.step >= flowData.steps.length - 1) {
          animState.playing = false;
          clearInterval(animState.timer);
          updatePlayBtn();
          return;
        }
        animState.step++;
        refreshFlowHighlight(flowData);
      }, 1800);
    } else {
      clearInterval(animState.timer);
    }
    updatePlayBtn();
  }

  function updatePlayBtn() {
    const btn = document.getElementById("anim-play-btn");
    if (btn) btn.textContent = animState.playing ? "⏸ Pause" : "▶ Play";
  }

  function refreshFlowHighlight(flowData) {
    const step = flowData.steps[animState.step];
    // Highlight nodes
    document.querySelectorAll(".anim-node").forEach((n) => {
      n.classList.remove("anim-active", "anim-visited");
    });
    // Mark all previously visited
    for (let i = 0; i < animState.step; i++) {
      const visitedNode = document.querySelector(
        `[data-node-id="${flowData.steps[i].nodeId}"]`,
      );
      if (visitedNode) visitedNode.classList.add("anim-visited");
    }
    // Mark current
    const activeNode = document.querySelector(
      `[data-node-id="${step.nodeId}"]`,
    );
    if (activeNode) activeNode.classList.add("anim-active");

    // Update step info
    const infoTitle = document.getElementById("anim-step-title");
    const infoDesc = document.getElementById("anim-step-desc");
    if (infoTitle) infoTitle.textContent = step.title;
    if (infoDesc) infoDesc.textContent = step.desc;

    // Update step indicators
    document.querySelectorAll(".anim-step-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === animState.step);
      dot.classList.toggle("done", i < animState.step);
    });

    // Update nav buttons
    const prevBtn = document.getElementById("anim-prev-btn");
    const nextBtn = document.getElementById("anim-next-btn");
    if (prevBtn) prevBtn.disabled = animState.step === 0;
    if (nextBtn)
      nextBtn.disabled = animState.step === flowData.steps.length - 1;

    // Highlight connection arrows
    document.querySelectorAll(".anim-arrow").forEach((arrow, i) => {
      arrow.classList.toggle("anim-arrow-active", i < animState.step);
    });
  }

  function renderFlowAnimator(flowData) {
    const container = document.getElementById("anim-flow-area");
    if (!container) return;

    // Nodes chain
    const nodesHTML = flowData.nodes
      .map(
        (node, i) => `
      <div class="anim-node-wrap">
        <div class="anim-node" data-node-id="${node.id}" id="animnode-${node.id}">
          <span class="anim-node-icon">${node.icon}</span>
          <span class="anim-node-label">${node.label}</span>
        </div>
        ${i < flowData.nodes.length - 1 ? `<div class="anim-arrow" id="anim-arrow-${i}">↓</div>` : ""}
      </div>
    `,
      )
      .join("");

    // Step dots
    const dotsHTML = flowData.steps
      .map(
        (_, i) => `
      <button class="anim-step-dot" data-step="${i}" title="Step ${i + 1}"></button>
    `,
      )
      .join("");

    container.innerHTML = `
      <div class="anim-layout">
        <div class="anim-nodes-column">
          ${nodesHTML}
        </div>
        <div class="anim-info-column">
          <div class="anim-step-info">
            <div class="anim-step-counter">Step ${animState.step + 1} of ${flowData.steps.length}</div>
            <div class="anim-step-title" id="anim-step-title">${flowData.steps[0].title}</div>
            <div class="anim-step-desc" id="anim-step-desc">${flowData.steps[0].desc}</div>
          </div>
          <div class="anim-controls">
            <button class="anim-btn" id="anim-prev-btn" disabled>◀ Prev</button>
            <button class="anim-btn anim-btn-play" id="anim-play-btn">▶ Play</button>
            <button class="anim-btn" id="anim-next-btn">Next ▶</button>
          </div>
          <div class="anim-dots">${dotsHTML}</div>
        </div>
      </div>`;

    // Wire events
    document
      .getElementById("anim-play-btn")
      .addEventListener("click", () => togglePlay(flowData));
    document.getElementById("anim-prev-btn").addEventListener("click", () => {
      setStep(flowData, animState.step - 1);
    });
    document.getElementById("anim-next-btn").addEventListener("click", () => {
      setStep(flowData, animState.step + 1);
    });
    document.querySelectorAll(".anim-step-dot").forEach((dot) => {
      dot.addEventListener("click", () =>
        setStep(flowData, parseInt(dot.dataset.step, 10)),
      );
    });

    // Click on node to jump to its step
    document.querySelectorAll(".anim-node").forEach((nodeEl) => {
      nodeEl.addEventListener("click", () => {
        const nodeId = nodeEl.dataset.nodeId;
        const stepIdx = flowData.steps.findIndex((s) => s.nodeId === nodeId);
        if (stepIdx >= 0) setStep(flowData, stepIdx);
      });
    });

    // Initial highlight
    refreshFlowHighlight(flowData);
  }

  /* ─────────────────────────────────────────────────── */
  /*  Interactive Diagram Engine                         */
  /* ─────────────────────────────────────────────────── */

  function renderInteractiveDiagram(diagData, container) {
    const nodesHTML = diagData.nodes
      .map(
        (node) => `
      <div class="idiag-node" data-diag-id="${diagData.id}" data-node-id="${node.id}">
        <span class="idiag-icon">${node.icon}</span>
        <span class="idiag-label">${node.label}</span>
        <span class="idiag-hint">click to learn</span>
      </div>
    `,
      )
      .join("");

    const connectionsHTML = diagData.connections
      .map(
        (conn) => `
      <div class="idiag-conn" data-from="${conn.from}" data-to="${conn.to}">▼</div>
    `,
      )
      .join("");

    container.innerHTML = `
      <div class="idiag-wrapper">
        <div class="idiag-graph">
          <div class="idiag-nodes ${diagData.layout === "tree" ? "idiag-tree" : "idiag-linear"}">
            ${nodesHTML}
            ${connectionsHTML}
          </div>
        </div>
        <div class="idiag-info-panel" id="idiag-info-${diagData.id}">
          <div class="idiag-info-placeholder">
            <span class="idiag-info-icon">👆</span>
            <p>Click any node to learn what it does</p>
          </div>
        </div>
      </div>`;

    container.querySelectorAll(".idiag-node").forEach((nodeEl) => {
      nodeEl.addEventListener("click", () => {
        const nodeId = nodeEl.dataset.nodeId;
        const nodeData = diagData.nodes.find((n) => n.id === nodeId);
        if (!nodeData) return;

        // Highlight
        container
          .querySelectorAll(".idiag-node")
          .forEach((n) => n.classList.remove("idiag-selected"));
        nodeEl.classList.add("idiag-selected");

        // Show info
        const panel = document.getElementById(`idiag-info-${diagData.id}`);
        if (panel) {
          panel.innerHTML = `
            <div class="idiag-info-content">
              <div class="idiag-info-header">
                <span class="idiag-info-big-icon">${nodeData.icon}</span>
                <h3>${nodeData.info.title}</h3>
              </div>
              <p>${nodeData.info.body}</p>
            </div>`;
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────── */
  /*  Render: Full Diagrams Screen                       */
  /* ─────────────────────────────────────────────────── */

  function renderDiagramsScreen(activeTab) {
    const screen = document.getElementById("diagramsScreen");
    if (!screen) return;
    const tab = activeTab || "animated";

    screen.innerHTML = `
      <div class="diag-screen-inner">
        <div class="diag-screen-header">
          <h1 class="diag-screen-title">Architecture Diagrams</h1>
          <p class="diag-screen-subtitle">Animated flows · Interactive systems · Real company architectures</p>
        </div>

        <div class="diag-tabs" id="diagTabs">
          <button class="diag-tab ${tab === "animated" ? "active" : ""}" data-tab="animated">🎬 Animated Flows</button>
          <button class="diag-tab ${tab === "interactive" ? "active" : ""}" data-tab="interactive">🖱️ Interactive</button>
          <button class="diag-tab ${tab === "companies" ? "active" : ""}" data-tab="companies">🏢 Real Companies</button>
          <button class="diag-tab ${tab === "library" ? "active" : ""}" data-tab="library">📚 Library</button>
        </div>

        <div class="diag-tab-content" id="diagTabContent">
          ${renderTab(tab)}
        </div>
      </div>`;

    // Wire tab buttons
    screen.querySelectorAll(".diag-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newTab = btn.dataset.tab;
        renderDiagramsScreen(newTab);
        // Re-init if animated tab
        if (newTab === "animated") {
          setTimeout(() => initAnimatedTab(), 50);
        }
        if (newTab === "interactive") {
          setTimeout(() => initInteractiveTab(), 50);
        }
      });
    });

    // Auto-init current tab
    if (tab === "animated") {
      setTimeout(() => initAnimatedTab(), 50);
    }
    if (tab === "interactive") {
      setTimeout(() => initInteractiveTab(), 50);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderTab(tab) {
    switch (tab) {
      case "animated":
        return renderAnimatedTabHTML();
      case "interactive":
        return renderInteractiveTabHTML();
      case "companies":
        return renderCompaniesTabHTML();
      case "library":
        return renderLibraryTabHTML();
      default:
        return renderAnimatedTabHTML();
    }
  }

  /* ─ Animated Tab ─ */
  function renderAnimatedTabHTML() {
    const flowPickerHTML = ANIMATED_FLOWS.map(
      (f) => `
      <button class="anim-flow-pick" data-flow-id="${f.id}">
        <span>${f.icon}</span>
        <span>${f.title}</span>
      </button>
    `,
    ).join("");

    return `
      <div class="anim-tab">
        <div class="anim-flow-picker">${flowPickerHTML}</div>
        <div class="anim-flow-card" id="anim-flow-card">
          <div class="anim-flow-title" id="anim-flow-title"></div>
          <div class="anim-flow-desc"  id="anim-flow-desc"></div>
          <div id="anim-flow-area"></div>
        </div>
      </div>`;
  }

  function initAnimatedTab() {
    if (animState.timer) clearInterval(animState.timer);
    animState.playing = false;

    // Wire flow picker buttons
    document.querySelectorAll(".anim-flow-pick").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".anim-flow-pick")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const flow = ANIMATED_FLOWS.find((f) => f.id === btn.dataset.flowId);
        if (flow) {
          document.getElementById("anim-flow-title").textContent =
            flow.icon + " " + flow.title;
          document.getElementById("anim-flow-desc").textContent =
            flow.description;
          animState.step = 0;
          playFlow(flow);
        }
      });
    });

    // Auto-select first flow
    const firstBtn = document.querySelector(".anim-flow-pick");
    if (firstBtn) firstBtn.click();
  }

  /* ─ Interactive Tab ─ */
  function renderInteractiveTabHTML() {
    return `
      <div class="idiag-tab">
        ${INTERACTIVE_DIAGRAMS.map(
          (d) => `
          <div class="idiag-card">
            <div class="idiag-card-header">
              <span class="idiag-card-icon">${d.icon}</span>
              <div>
                <h3 class="idiag-card-title">${d.title}</h3>
                <p class="idiag-card-desc">${d.description}</p>
              </div>
            </div>
            <div class="idiag-diagram-area" id="idiag-area-${d.id}"></div>
          </div>
        `,
        ).join("")}
      </div>`;
  }

  function initInteractiveTab() {
    INTERACTIVE_DIAGRAMS.forEach((diagData) => {
      const container = document.getElementById(`idiag-area-${diagData.id}`);
      if (container) renderInteractiveDiagram(diagData, container);
    });
  }

  /* ─ Companies Tab ─ */
  function renderCompaniesTabHTML() {
    return `
      <div class="arch-tab">
        ${COMPANY_ARCHITECTURES.map(
          (arch) => `
          <div class="arch-card" id="${arch.id}">
            <div class="arch-card-header" style="border-bottom: 3px solid ${arch.color}">
              <span class="arch-card-icon">${arch.icon}</span>
              <div>
                <div class="arch-card-company">${arch.company}</div>
                <div class="arch-card-title">${arch.title}</div>
              </div>
            </div>
            <div class="arch-card-body">
              <div class="arch-diagram">
                ${arch.diagram
                  .map(
                    (node) => `
                  <div class="arch-node arch-node-${node.type}">
                    <span>${node.icon}</span>
                    <span>${node.label}</span>
                    ${node.children ? `<div class="arch-children">${node.children.map((c) => `<span class="arch-child">${c}</span>`).join("")}</div>` : ""}
                  </div>
                  <div class="arch-node-arrow">↓</div>
                `,
                  )
                  .join("")}
              </div>
              <div class="arch-insights">
                <div class="arch-insights-title">💡 Architect Insights</div>
                ${arch.insights.map((ins) => `<div class="arch-insight-item">→ ${ins}</div>`).join("")}
              </div>
            </div>
          </div>
        `,
        ).join("")}
      </div>`;
  }

  /* ─ Library Tab ─ */
  function renderLibraryTabHTML() {
    return `
      <div class="lib-tab">
        <div class="lib-intro">
          <p>A structured reference library of architecture diagrams organised by domain. Use these as a visual index while studying each topic.</p>
        </div>
        <div class="lib-grid">
          ${DIAGRAM_LIBRARY.map(
            (cat) => `
            <div class="lib-card">
              <div class="lib-card-header">
                <span class="lib-card-icon section-icon ${cat.color}">${cat.icon}</span>
                <span class="lib-card-category">${cat.category}</span>
              </div>
              <ul class="lib-card-items">
                ${cat.items.map((item) => `<li class="lib-card-item">📌 ${item}</li>`).join("")}
              </ul>
            </div>
          `,
          ).join("")}
        </div>
      </div>`;
  }

  /* ─────────────────────────────────────────────────── */
  /*  Public API                                         */
  /* ─────────────────────────────────────────────────── */

  window.DiagramEngine = {
    show: function (tab) {
      renderDiagramsScreen(tab || "animated");
    },
    cleanup: function () {
      if (animState.timer) {
        clearInterval(animState.timer);
        animState.timer = null;
        animState.playing = false;
      }
    },
  };
})();

/* =====================================================
   quiz.js  —  Architect Academy Part Quiz Engine
   One quiz per part (12 parts × 8 questions each)
   ===================================================== */

(function () {
  "use strict";

  /* ─── Quiz data: 8 questions per part ─────────────── */
  const QUIZ_DATA = {
    part1: {
      title: "Networking Fundamentals",
      icon: "🌐",
      questions: [
        {
          q: "What is the primary purpose of DNS (Domain Name System)?",
          options: [
            "Encrypt data in transit",
            "Translate domain names into IP addresses",
            "Route packets across routers",
            "Cache web pages closer to users",
          ],
          answer: 1,
          explanation:
            "DNS acts like a phone book for the internet — it resolves human-readable names like shopkart.com into machine-readable IP addresses like 192.168.1.1.",
        },
        {
          q: "Which OSI layer does HTTP/HTTPS operate on?",
          options: [
            "Layer 3 — Network",
            "Layer 4 — Transport",
            "Layer 6 — Presentation",
            "Layer 7 — Application",
          ],
          answer: 3,
          explanation:
            "HTTP and HTTPS are Application layer protocols (Layer 7). They define how clients and servers communicate, sitting on top of TCP (Layer 4).",
        },
        {
          q: "What is the main difference between TCP and UDP?",
          options: [
            "TCP is faster; UDP is slower",
            "TCP guarantees delivery and order; UDP does not",
            "UDP supports encryption; TCP does not",
            "TCP is used for video; UDP is used for web pages",
          ],
          answer: 1,
          explanation:
            "TCP (Transmission Control Protocol) provides reliable, ordered delivery via handshakes and acknowledgements. UDP (User Datagram Protocol) is connectionless and faster but with no delivery guarantee — ideal for streaming/gaming.",
        },
        {
          q: "What does a load balancer do?",
          options: [
            "Compresses data before sending",
            "Encrypts traffic between client and server",
            "Distributes incoming requests across multiple servers",
            "Caches static assets at the edge",
          ],
          answer: 2,
          explanation:
            "A load balancer distributes traffic across a pool of servers so no single server is overwhelmed. It also handles failover — if one server goes down, requests are routed to healthy ones.",
        },
        {
          q: "What HTTP status code indicates a resource was successfully created?",
          options: [
            "200 OK",
            "201 Created",
            "204 No Content",
            "301 Moved Permanently",
          ],
          answer: 1,
          explanation:
            "201 Created is returned when a POST request successfully creates a new resource. 200 OK is for successful GETs, 204 for success with no response body.",
        },
        {
          q: "What is the purpose of a CDN (Content Delivery Network)?",
          options: [
            "To store database backups globally",
            "To serve static assets from edge servers closest to the user",
            "To manage DNS records for a domain",
            "To balance load between microservices",
          ],
          answer: 1,
          explanation:
            "CDNs cache static content (images, JS, CSS) on edge servers worldwide. A user in Mumbai gets served from a Mumbai PoP instead of a US data center, slashing latency from 200ms to ~10ms.",
        },
        {
          q: "In the TCP three-way handshake, what is the correct sequence?",
          options: [
            "SYN → ACK → SYN-ACK",
            "SYN → SYN-ACK → ACK",
            "ACK → SYN → SYN-ACK",
            "SYN-ACK → SYN → ACK",
          ],
          answer: 1,
          explanation:
            "The TCP handshake is: (1) Client sends SYN, (2) Server replies SYN-ACK, (3) Client sends ACK. This establishes a reliable connection before any data flows.",
        },
        {
          q: "What does HTTPS provide over HTTP?",
          options: [
            "Faster page loads",
            "Compressed responses",
            "Encrypted, authenticated communication via TLS",
            "Persistent WebSocket connections",
          ],
          answer: 2,
          explanation:
            "HTTPS = HTTP + TLS. TLS encrypts data in transit (preventing eavesdropping) and authenticates the server via certificates (preventing man-in-the-middle attacks).",
        },
      ],
    },

    part2: {
      title: "Backend APIs",
      icon: "🔌",
      questions: [
        {
          q: "What does REST stand for?",
          options: [
            "Remote Execution State Transfer",
            "Representational State Transfer",
            "Resource Endpoint Syntax Transformer",
            "Reliable Event Streaming Technology",
          ],
          answer: 1,
          explanation:
            "REST (Representational State Transfer) is an architectural style for distributed systems, defining constraints like statelessness, uniform interface, and client-server separation.",
        },
        {
          q: "Which HTTP method is idempotent and should be used to fully replace a resource?",
          options: ["POST", "PATCH", "PUT", "DELETE"],
          answer: 2,
          explanation:
            "PUT is idempotent — calling it multiple times gives the same result. It fully replaces a resource. PATCH partially updates. POST creates and is NOT idempotent. DELETE is idempotent too.",
        },
        {
          q: "What key advantage does GraphQL have over REST?",
          options: [
            "GraphQL is always faster than REST",
            "Clients request exactly the fields they need, avoiding over/under-fetching",
            "GraphQL does not require a schema",
            "GraphQL automatically handles authentication",
          ],
          answer: 1,
          explanation:
            "With REST, you often get too much data (over-fetching) or need multiple calls (under-fetching). GraphQL lets clients specify exactly which fields they need in a single query.",
        },
        {
          q: "What is the purpose of an API Gateway?",
          options: [
            "To store API documentation",
            "To provide a single entry point that handles auth, routing, rate limiting, and logging for microservices",
            "To cache database query results",
            "To compile TypeScript to JavaScript at runtime",
          ],
          answer: 1,
          explanation:
            "An API Gateway is the front door to your backend. It handles cross-cutting concerns — authentication, rate limiting, request routing to microservices, and logging — so individual services don't have to.",
        },
        {
          q: "What does statelessness mean in a REST API?",
          options: [
            "The server never stores any data",
            "Each request contains all information needed; the server holds no session state",
            "The client never sends cookies",
            "Responses are never cached",
          ],
          answer: 1,
          explanation:
            "Stateless means the server doesn't store client session state between requests. Every request must carry all needed context (tokens, params). This makes APIs horizontally scalable — any server can handle any request.",
        },
        {
          q: "Why is API versioning important?",
          options: [
            "To make APIs faster",
            "To allow new API changes without breaking existing clients",
            "To reduce database load",
            "To enable CORS",
          ],
          answer: 1,
          explanation:
            "Versioning (e.g., /api/v1/ vs /api/v2/) lets you evolve your API — adding fields, changing structures — without breaking existing apps that rely on the old contract.",
        },
        {
          q: "What is rate limiting in an API?",
          options: [
            "Limiting the size of a request body",
            "Restricting how many requests a client can make in a time window",
            "Limiting how many fields a GraphQL query can return",
            "Capping the number of database connections",
          ],
          answer: 1,
          explanation:
            "Rate limiting (e.g., 100 requests/minute per user) protects your API from abuse, denial-of-service attacks, and runaway clients. Exceeded limits return HTTP 429 Too Many Requests.",
        },
        {
          q: "Which HTTP status code means the client sent a request that the server cannot process due to invalid input?",
          options: [
            "401 Unauthorized",
            "403 Forbidden",
            "400 Bad Request",
            "422 Unprocessable Entity",
          ],
          answer: 2,
          explanation:
            "400 Bad Request is the general status for malformed/invalid client requests. 401 means not authenticated, 403 means authenticated but not permitted, 422 is more specific for validation failures.",
        },
      ],
    },

    part3: {
      title: "Security & Auth",
      icon: "🔐",
      questions: [
        {
          q: "What is the difference between authentication and authorization?",
          options: [
            "They are the same thing",
            "Authentication verifies WHO you are; authorization determines WHAT you can do",
            "Authorization verifies WHO you are; authentication determines WHAT you can do",
            "Authentication is for humans; authorization is for services",
          ],
          answer: 1,
          explanation:
            "Authentication = identity check (are you who you claim to be?). Authorization = permission check (are you allowed to do this?). You must always authenticate before you can authorize.",
        },
        {
          q: "What does a JWT (JSON Web Token) contain?",
          options: [
            "Encrypted password and user email",
            "Three Base64-encoded parts: header, payload (claims), and signature",
            "A reference to a server-side session",
            "A symmetric encryption key",
          ],
          answer: 1,
          explanation:
            "A JWT consists of header.payload.signature, all Base64url-encoded. The payload carries claims (user ID, roles, expiry). The signature verifies integrity — but the payload is NOT encrypted, just signed.",
        },
        {
          q: "What is a SQL Injection attack?",
          options: [
            "Injecting malicious code into CSS files",
            "Overloading a database with too many connections",
            "Inserting malicious SQL into user input to manipulate queries",
            "Using SQL to crack encrypted passwords",
          ],
          answer: 2,
          explanation:
            "SQL injection happens when unsanitized user input is embedded in SQL queries. e.g., entering `' OR '1'='1` in a login form can bypass authentication. Prevention: use parameterized queries / prepared statements.",
        },
        {
          q: "Why should passwords be hashed with bcrypt instead of MD5?",
          options: [
            "bcrypt produces shorter hashes",
            "bcrypt is intentionally slow and includes a salt, making brute-force attacks expensive",
            "MD5 is not compatible with modern databases",
            "bcrypt can be reversed to recover the original password",
          ],
          answer: 1,
          explanation:
            "bcrypt is a slow, adaptive hashing algorithm with a built-in salt. Slowness is a feature — it makes brute-force/rainbow table attacks extremely expensive. MD5 is fast, unsalted, and thoroughly broken.",
        },
        {
          q: "What is OAuth 2.0?",
          options: [
            "A password encryption algorithm",
            "An authorization framework that enables apps to obtain limited access on behalf of a user without sharing passwords",
            "A method to hash tokens",
            "A two-factor authentication protocol",
          ],
          answer: 1,
          explanation:
            "OAuth 2.0 lets users grant third-party apps access to their data (e.g., 'Sign in with Google') without sharing their Google password. The app gets an access token with limited, specific permissions.",
        },
        {
          q: "What is CSRF (Cross-Site Request Forgery)?",
          options: [
            "Injecting JavaScript into a webpage to steal cookies",
            "Tricking a user's browser into making unwanted requests to a site they're authenticated on",
            "Intercepting HTTPS traffic on a network",
            "Brute-forcing admin passwords",
          ],
          answer: 1,
          explanation:
            "CSRF tricks a logged-in user's browser into making a malicious request (e.g., transferring money) to a site that trusts them. Prevention: CSRF tokens, SameSite cookies, checking the Origin header.",
        },
        {
          q: "What does CORS (Cross-Origin Resource Sharing) control?",
          options: [
            "Which databases a server can connect to",
            "Which browser origins are permitted to make requests to a server's API",
            "Whether HTTPS is enforced on a domain",
            "The rate at which clients can call an API",
          ],
          answer: 1,
          explanation:
            "CORS is a browser security policy. By default, browsers block JS on origin-a.com from calling origin-b.com's API. The server can explicitly allow specific origins via Access-Control-Allow-Origin headers.",
        },
        {
          q: "What is the principle of least privilege?",
          options: [
            "Give all users admin rights for simplicity",
            "Grant users and services only the minimum permissions they need to do their job",
            "Store all secrets in environment variables",
            "Use the simplest possible authentication method",
          ],
          answer: 1,
          explanation:
            "Least privilege limits the blast radius of a breach. A compromised service that only has read access to one table cannot delete the entire database. It's foundational to secure system design.",
        },
      ],
    },

    part4: {
      title: "Databases & SQL",
      icon: "🗄️",
      questions: [
        {
          q: "What does ACID stand for in database transactions?",
          options: [
            "Async, Consistent, Isolated, Distributed",
            "Atomicity, Consistency, Isolation, Durability",
            "Automated, Cached, Independent, Durable",
            "Available, Consistent, Indexed, Distributed",
          ],
          answer: 1,
          explanation:
            "ACID guarantees: Atomicity (all-or-nothing), Consistency (valid state before & after), Isolation (concurrent txns don't interfere), Durability (committed data survives crashes). These are the gold standard for relational DBs.",
        },
        {
          q: "What is the primary benefit of a database index?",
          options: [
            "Reduces disk storage space",
            "Enforces referential integrity",
            "Speeds up read queries by allowing fast lookups without full table scans",
            "Automatically partitions large tables",
          ],
          answer: 2,
          explanation:
            "Without an index, finding a row requires scanning every row (O(n)). A B-tree index allows O(log n) lookups. The trade-off: indexes slow down writes and consume extra storage.",
        },
        {
          q: "What is database sharding?",
          options: [
            "Creating read replicas for load distribution",
            "Splitting a large table into multiple databases across different machines by a shard key",
            "Archiving old data to cold storage",
            "Partitioning a table by date ranges within a single server",
          ],
          answer: 1,
          explanation:
            "Sharding horizontally partitions data across multiple database servers. e.g., users 1-1M on Shard A, 1M-2M on Shard B. It enables massive scale but adds complexity in cross-shard queries and rebalancing.",
        },
        {
          q: "What is the key difference between SQL and NoSQL databases?",
          options: [
            "SQL databases are newer than NoSQL",
            "SQL databases use structured schemas with relations; NoSQL trades some guarantees for flexibility and horizontal scale",
            "NoSQL databases cannot store text data",
            "SQL databases can only run on a single machine",
          ],
          answer: 1,
          explanation:
            "SQL (relational) databases have fixed schemas, support complex joins, and are ACID-compliant. NoSQL databases (document, key-value, graph) offer flexible schemas, horizontal scaling, and eventual consistency — trading ACID for scale.",
        },
        {
          q: "What is eventual consistency?",
          options: [
            "All nodes have identical data at all times",
            "Writes are rejected until all replicas are synchronized",
            "After a write, all replicas will eventually converge to the same value given no new updates",
            "Data is consistent only in a single region",
          ],
          answer: 2,
          explanation:
            "Eventual consistency means: after you write, different replicas may temporarily return different values, but they will all converge to the same value over time. Common in distributed NoSQL DBs like DynamoDB and Cassandra.",
        },
        {
          q: "What does the N+1 query problem refer to?",
          options: [
            "Running N parallel queries simultaneously",
            "A query that fetches 1 parent row, then N separate queries to fetch each child row — extremely inefficient",
            "Storing data in N+1 tables instead of N tables",
            "Using N+1 database connections per user",
          ],
          answer: 1,
          explanation:
            "N+1 happens when you fetch a list of N records (1 query), then loop and issue 1 query per record. 100 orders = 101 queries. Fix: use JOIN, eager loading (ORM includes), or DataLoader (batching).",
        },
        {
          q: "What is a database read replica?",
          options: [
            "A backup of the database stored offline",
            "A synchronised copy of the primary DB that handles read traffic, reducing load on the primary",
            "A secondary database used for audit logging only",
            "A cached version of query results in memory",
          ],
          answer: 1,
          explanation:
            "Read replicas copy data from the primary asynchronously. All writes go to the primary; reads can be distributed across replicas. This scales read throughput massively (80-90% of traffic is typically reads).",
        },
        {
          q: "What is database normalization?",
          options: [
            "Scaling the database to handle more load",
            "Organizing tables to reduce data redundancy and improve integrity by eliminating duplicate data",
            "Compressing all data in the database",
            "Converting SQL queries to use indexes",
          ],
          answer: 1,
          explanation:
            "Normalization eliminates redundancy by decomposing tables into smaller, related ones (1NF, 2NF, 3NF). Each piece of data lives in one place. Trade-off: more JOINs needed, which can hurt performance at large scale.",
        },
      ],
    },

    part5: {
      title: "Architecture Patterns",
      icon: "🏛️",
      questions: [
        {
          q: "What is the core idea of microservices architecture?",
          options: [
            "Running all services on a single powerful machine",
            "Building an application as a collection of small, independently deployable services each owning its data",
            "Writing the entire application in a single codebase with separate modules",
            "Using multiple databases for a single monolithic service",
          ],
          answer: 1,
          explanation:
            "Microservices breaks a monolith into small services aligned to business capabilities. Each service can be developed, deployed, and scaled independently. Trade-off: operational complexity increases significantly.",
        },
        {
          q: "What does CQRS (Command Query Responsibility Segregation) separate?",
          options: [
            "SQL and NoSQL databases",
            "Write operations (commands) from read operations (queries), allowing separate optimized models for each",
            "Synchronous calls from asynchronous calls",
            "Public APIs from internal APIs",
          ],
          answer: 1,
          explanation:
            "CQRS splits the write model (handling mutations) from the read model (handling queries). The read model can be a denormalized, fast view built from events. Common with Event Sourcing for complex domains.",
        },
        {
          q: "What is the Circuit Breaker pattern?",
          options: [
            "A pattern to distribute traffic across services",
            "A pattern that stops calling a failing service and returns a fallback until it recovers",
            "A pattern that encrypts service-to-service communication",
            "A strategy for database connection pooling",
          ],
          answer: 1,
          explanation:
            "Circuit Breaker prevents cascading failures. When calls to a service repeatedly fail, the breaker 'opens' and immediately returns errors/fallbacks instead of waiting for timeouts. After a timeout, it tries again to see if the service recovered.",
        },
        {
          q: "What problem does the Saga pattern solve?",
          options: [
            "Scaling a single database across multiple regions",
            "Managing distributed transactions across multiple services without two-phase commit",
            "Synchronising caches across a cluster",
            "Routing traffic between microservice versions",
          ],
          answer: 1,
          explanation:
            "In microservices, a transaction spans multiple services (order → payment → inventory). 2PC is impractical. Saga breaks it into local transactions with compensating transactions for rollback on failure.",
        },
        {
          q: "What is Event Sourcing?",
          options: [
            "Publishing all events to a message bus",
            "Storing the history of state changes as an immutable sequence of events instead of current state only",
            "Using events to trigger serverless functions",
            "Sourcing configuration from event-driven systems",
          ],
          answer: 1,
          explanation:
            "Event Sourcing stores every state change as an event (OrderPlaced, PaymentProcessed). Current state is derived by replaying events. Benefits: full audit trail, time-travel debugging, ability to build new projections from history.",
        },
        {
          q: "What is the Strangler Fig pattern?",
          options: [
            "Gradually migrating a monolith to microservices by routing parts of traffic to new services while keeping the old system running",
            "Killing a legacy service by deploying a new one and cutting over immediately",
            "A security pattern to detect and stop rogue services",
            "A database migration pattern for splitting large tables",
          ],
          answer: 0,
          explanation:
            "Named after the strangler fig tree that grows around a host tree. You incrementally replace pieces of the monolith with new services, routing traffic to new services as they are ready. Zero big-bang rewrites.",
        },
        {
          q: "What is service discovery in microservices?",
          options: [
            "A process to find and fix bugs in microservices",
            "A mechanism by which services automatically find and communicate with each other without hardcoded addresses",
            "Logging which services are running in production",
            "A process to document available APIs",
          ],
          answer: 1,
          explanation:
            "In a dynamic cloud environment, service IPs change constantly. Service discovery (Consul, Eureka, Kubernetes DNS) allows services to register themselves and find others by name rather than hardcoded IP.",
        },
        {
          q: "What is the Sidecar pattern in microservices?",
          options: [
            "Running a secondary database alongside each service",
            "Deploying a helper container alongside each service to handle cross-cutting concerns like logging, security, or networking",
            "A pattern for A/B testing between service versions",
            "Caching responses in memory next to the service",
          ],
          answer: 1,
          explanation:
            "A sidecar is a co-deployed container that augments the main service. In a service mesh (Istio, Linkerd), sidecars handle mTLS, retries, tracing, and metrics — keeping the main service code clean.",
        },
      ],
    },

    part6: {
      title: "Scalability",
      icon: "📈",
      questions: [
        {
          q: "What is the difference between horizontal and vertical scaling?",
          options: [
            "Horizontal = adding more CPU/RAM to one machine; Vertical = adding more machines",
            "Horizontal = adding more machines; Vertical = adding more CPU/RAM/storage to one machine",
            "Horizontal = scaling reads; Vertical = scaling writes",
            "They are different names for the same concept",
          ],
          answer: 1,
          explanation:
            "Vertical scaling (scale-up) has physical limits — you can only add so much RAM. Horizontal scaling (scale-out) is theoretically unlimited — add more commodity servers. The cloud made horizontal scaling the dominant approach.",
        },
        {
          q: "What does the CAP theorem state?",
          options: [
            "A distributed system can be Consistent, Available, and Partition-tolerant simultaneously",
            "In a distributed system, you can only guarantee two of: Consistency, Availability, Partition tolerance",
            "Caching, Auto-scaling, and Partitioning are required for scalable systems",
            "Capacity, Availability, and Performance must be balanced",
          ],
          answer: 1,
          explanation:
            "CAP theorem says: during a network partition, you must choose between Consistency (all nodes return the same data) or Availability (all nodes respond). Partition tolerance is non-negotiable in distributed systems.",
        },
        {
          q: "What is consistent hashing used for?",
          options: [
            "Hashing passwords consistently across servers",
            "Ensuring data integrity in databases",
            "Distributing data/requests across servers so that adding/removing a server minimises re-distribution",
            "Creating deterministic encryption keys",
          ],
          answer: 2,
          explanation:
            "Consistent hashing places both servers and keys on a hash ring. When a server is added/removed, only its immediate neighbours' keys need redistribution — not all keys. Critical for distributed caches and databases.",
        },
        {
          q: "What is auto-scaling?",
          options: [
            "Manually adding servers based on predicted load",
            "Automatically adding or removing compute resources based on current traffic demand",
            "Automatically upgrading server hardware",
            "Scaling database indexes automatically",
          ],
          answer: 1,
          explanation:
            "Auto-scaling monitors metrics (CPU, request rate) and automatically adds servers during peaks and removes them during quiet periods. This matches capacity to demand and reduces costs.",
        },
        {
          q: "What makes a service stateless and why is it important for scalability?",
          options: [
            "Stateless means the service has no database — important for simplicity",
            "Stateless means no user session state is stored on the server — any server can handle any request, enabling easy horizontal scaling",
            "Stateless means the service never logs data — important for privacy",
            "Stateless means the service runs without configuration — important for deployability",
          ],
          answer: 1,
          explanation:
            "If a service stores session state locally, you need sticky sessions — requests must always route to the same server, limiting scalability. Stateless services store state externally (Redis, DB), so any instance handles any request.",
        },
        {
          q: "What is a back-of-envelope estimation used for in system design?",
          options: [
            "Checking if code is correct at compile time",
            "Quickly estimating storage, bandwidth, and throughput requirements to guide architectural decisions",
            "Calculating database query costs",
            "Estimating developer time for a feature",
          ],
          answer: 1,
          explanation:
            "Back-of-envelope math (e.g., 1M DAU × 10 requests/day = 100 req/s) helps you understand the scale you're designing for. This drives decisions: do you need sharding? a CDN? how much cache RAM?",
        },
        {
          q: "What is a database connection pool and why is it important?",
          options: [
            "A pool of read replicas for load distribution",
            "A reused set of pre-established DB connections shared across threads, avoiding expensive connection setup per request",
            "A list of allowed IP addresses for database access",
            "A cache of recent query results",
          ],
          answer: 1,
          explanation:
            "Establishing a DB connection takes ~100ms. Without pooling, every request creates a new connection. Connection pools maintain pre-established connections that are borrowed and returned, handling hundreds of concurrent requests efficiently.",
        },
        {
          q: "What problem does load shedding solve?",
          options: [
            "Distributing traffic evenly across servers",
            "Intentionally rejecting excess requests during overload to protect system stability rather than crashing under pressure",
            "Removing unused data from the database under heavy load",
            "Offloading cold data to cheaper storage tiers",
          ],
          answer: 1,
          explanation:
            "Load shedding returns HTTP 503 or degrades features when the system is overwhelmed. This protects the backend — better to reject 10% of requests cleanly than crash and reject 100%. Queues, circuit breakers, and rate limits are tools.",
        },
      ],
    },

    part7: {
      title: "Caching",
      icon: "⚡",
      questions: [
        {
          q: "What is a cache hit vs a cache miss?",
          options: [
            "Cache hit = cache is full; cache miss = cache has space",
            "Cache hit = requested data is found in cache; cache miss = data is not in cache and must be fetched from origin",
            "Cache hit = write succeeded; cache miss = write failed",
            "Cache hit = the cache is warm; cache miss = the cache is cold",
          ],
          answer: 1,
          explanation:
            "A cache hit returns data from fast memory (~1ms), avoiding a slow DB query (~10-100ms). Hit rate is the key metric — aim for >95% for popular data. A cache miss triggers a DB query and populates the cache.",
        },
        {
          q: "What does TTL (Time-To-Live) control in caching?",
          options: [
            "How long the cache server stays running",
            "How long a cached item is considered fresh before it is expired and must be re-fetched",
            "How many times a cache item can be accessed",
            "The maximum size of a cache entry",
          ],
          answer: 1,
          explanation:
            "TTL prevents stale data. A product page cached for 5 minutes (TTL=300s) will be re-fetched from DB every 5 minutes. Short TTL = fresh data but more DB load. Long TTL = stale data risk but fewer DB calls.",
        },
        {
          q: "What is the LRU (Least Recently Used) cache eviction policy?",
          options: [
            "Evict the item that was accessed the most times",
            "Evict the largest item first to free the most space",
            "Evict the item that was accessed least recently when the cache is full",
            "Evict items randomly when the cache is full",
          ],
          answer: 2,
          explanation:
            "LRU assumes recently used data is more likely to be used again. When the cache is full and a new item must be stored, LRU discards the item that hasn't been accessed for the longest time.",
        },
        {
          q: "What is a cache stampede (also called thundering herd)?",
          options: [
            "A DDoS attack that overwhelms the cache server",
            "When a popular cached item expires and many simultaneous requests all hit the database at once to re-populate it",
            "When cache memory is full and many items are evicted simultaneously",
            "When a cache cluster loses all nodes at the same time",
          ],
          answer: 1,
          explanation:
            "If a hot key's TTL expires, thousands of requests simultaneously miss the cache and hit the DB — potentially crashing it. Solutions: lock (only one thread fetches), probabilistic expiry, or background refresh before TTL expires.",
        },
        {
          q: "What is write-through caching?",
          options: [
            "Writing only to the cache, syncing to DB asynchronously later",
            "Writing simultaneously to both the cache and the database, ensuring cache is always up to date",
            "Writing directly to the database, bypassing the cache entirely",
            "Writing through a CDN to the origin server",
          ],
          answer: 1,
          explanation:
            "Write-through: every write goes to cache AND DB synchronously. Cache is always consistent. Trade-off: write latency is doubled. Alternative is write-behind (async DB write) — faster but risks data loss on crash.",
        },
        {
          q: "What is Redis primarily used for?",
          options: [
            "Storing large files and binary blobs",
            "Running complex SQL queries faster",
            "An in-memory data structure store used for caching, session storage, pub/sub, and leaderboards",
            "A primary relational database",
          ],
          answer: 2,
          explanation:
            "Redis stores data in RAM for microsecond latency. Use cases: cache (hot product data), sessions (JWT alternatives), rate limiting counters, pub/sub messaging, sorted sets for leaderboards. Persistence is optional.",
        },
        {
          q: "What is cache-aside (lazy loading) pattern?",
          options: [
            "The cache automatically pre-warms on startup",
            "The application checks the cache first; on a miss, it fetches from DB and populates the cache",
            "Writing to the DB first and letting the cache sync automatically",
            "Storing cache data on disk instead of memory",
          ],
          answer: 1,
          explanation:
            "Cache-aside is the most common pattern. App checks cache → hit: return it. Miss: query DB → store result in cache → return. Only requested data enters cache (lazy). Fine-grained TTL control. Complexity: app manages both.",
        },
        {
          q: "Why should you NOT cache data with high write frequency?",
          options: [
            "High write data is too large for cache memory",
            "Caches don't support write operations",
            "Frequent writes cause constant cache invalidation, making cache hits rare and adding overhead with no benefit",
            "High write data must always be stored in a cold storage tier",
          ],
          answer: 2,
          explanation:
            "Caching works when the same data is read many times over. If a value changes on every write (e.g., real-time stock tickers), the cache is invalidated immediately — you get near-zero hit rate but pay the overhead of cache management.",
        },
      ],
    },

    part8: {
      title: "Async & Distributed Patterns",
      icon: "📨",
      questions: [
        {
          q: "What is the key difference between synchronous and asynchronous communication?",
          options: [
            "Sync is encrypted; async is not",
            "Sync: caller waits for a response before continuing; Async: caller sends a message and continues without waiting",
            "Sync uses HTTP; async always uses WebSockets",
            "Sync is used for reads; async is for writes",
          ],
          answer: 1,
          explanation:
            "Synchronous: place an order → wait → get confirmation → continue. Async: place an order → get 'received' → continue (confirmation arrives later via event). Async improves resilience and throughput but adds complexity.",
        },
        {
          q: "What is a message queue used for?",
          options: [
            "Storing emails for delivery",
            "Decoupling producers and consumers — the producer sends a message and consumers process it at their own pace",
            "A buffer to store database writes temporarily",
            "A proxy to route HTTP requests between services",
          ],
          answer: 1,
          explanation:
            "Message queues (RabbitMQ, SQS) enable temporal decoupling. The payment service publishes 'OrderPaid' to a queue. The notification, inventory, and shipping services each consume it independently — none knows about the others.",
        },
        {
          q: "What is Apache Kafka primarily designed for?",
          options: [
            "Storing files in a distributed file system",
            "High-throughput, persistent, distributed event streaming and log collection at massive scale",
            "Managing database schemas across microservices",
            "Load balancing HTTP traffic",
          ],
          answer: 1,
          explanation:
            "Kafka is a distributed commit log. It handles millions of events/second durably. Unlike traditional queues, messages are retained for days — consumers can replay history. Used for event streaming, CDC, and analytics pipelines.",
        },
        {
          q: "What is a Dead Letter Queue (DLQ)?",
          options: [
            "A queue for low-priority background jobs",
            "A special queue where messages that repeatedly fail to process are moved for inspection",
            "A queue that automatically deletes messages after 24 hours",
            "A backup queue that activates when the main queue is full",
          ],
          answer: 1,
          explanation:
            "When a consumer fails to process a message after N retries, it goes to the DLQ instead of looping forever. Engineers can inspect DLQ messages, fix the bug, and replay them. Prevents poison-pill messages from blocking the whole queue.",
        },
        {
          q: "What is the pub/sub (publish-subscribe) pattern?",
          options: [
            "Publishers and subscribers share the same database table",
            "Publishers send messages to a topic; all subscribers to that topic receive a copy — enabling fan-out to many consumers",
            "A bilateral contract between two services for message exchange",
            "Publishers pay credits for each message; subscribers earn credits",
          ],
          answer: 1,
          explanation:
            "In pub/sub, producers publish to a topic (e.g., 'order-created'). All subscribers receive every message. Unlike queues (one consumer per message), pub/sub fans out to N consumers — perfect for notifying multiple services of one event.",
        },
        {
          q: "What does idempotency mean in distributed systems?",
          options: [
            "A service that never fails",
            "An operation that produces the same result whether it is executed once or many times",
            "Messages that are delivered in strict order",
            "A system with no single point of failure",
          ],
          answer: 1,
          explanation:
            "Idempotency is critical because of retries. If a payment request is retried due to a network timeout, you must not charge twice. Idempotent operations: charge only if no charge for this idempotency-key exists yet.",
        },
        {
          q: "What is backpressure in distributed systems?",
          options: [
            "The reverse load of traffic hitting a CDN edge server",
            "A mechanism where consumers signal to producers to slow down when they cannot keep up with the message rate",
            "Database pressure from too many write transactions",
            "Network congestion measured in bytes-per-second",
          ],
          answer: 1,
          explanation:
            "Without backpressure, a fast producer overwhelms a slow consumer — the queue grows unboundedly and the system crashes. Backpressure propagates the 'slow down' signal upstream so the producer matches the consumer's pace.",
        },
        {
          q: "What is event-driven architecture?",
          options: [
            "An architecture where calendar events trigger service deployments",
            "Services communicate by producing and consuming events, resulting in loose coupling and high scalability",
            "An architecture that processes events only during off-peak hours",
            "A pattern where a single orchestrator service controls all workflow steps",
          ],
          answer: 1,
          explanation:
            "In EDA, services don't call each other directly. OrderService emits 'OrderPlaced'. InventoryService, PaymentService, and NotificationService each react to that event independently. This enables loose coupling, resilience, and horizontal scale.",
        },
      ],
    },

    part9: {
      title: "Cloud & AWS",
      icon: "☁️",
      questions: [
        {
          q: "What is the difference between IaaS, PaaS, and SaaS?",
          options: [
            "IaaS = raw compute/network/storage (EC2); PaaS = managed platform (Elastic Beanstalk); SaaS = complete software product (Gmail)",
            "IaaS = Internet as a Service; PaaS = Private as a Service; SaaS = Scalable as a Service",
            "They are different names for the same cloud model",
            "IaaS = for developers; PaaS = for operations; SaaS = for users",
          ],
          answer: 0,
          explanation:
            "IaaS (EC2, VMs) gives you raw infrastructure — you manage OS upward. PaaS (Heroku, Beanstalk) manages OS and runtime — you manage code. SaaS (Gmail, Salesforce) is the fully managed product — you just use it.",
        },
        {
          q: "What is an AWS Availability Zone (AZ)?",
          options: [
            "A pricing tier for AWS services",
            "A geographic region like US-East or AP-Mumbai",
            "An isolated data center within a region with independent power, cooling, and networking",
            "A VPC subnet for publicly accessible resources",
          ],
          answer: 2,
          explanation:
            "An AZ is one or more physically separate data centers within a region. Deploying across multiple AZs (Multi-AZ) means one AZ going down doesn't affect your app. AWS regions have 2-6 AZs each.",
        },
        {
          q: "What is AWS Lambda?",
          options: [
            "A managed Kubernetes service",
            "A virtual machine service like EC2",
            "A serverless compute service that runs code in response to events without provisioning servers",
            "A container registry for Docker images",
          ],
          answer: 2,
          explanation:
            "Lambda is serverless — you upload code, define a trigger (API Gateway, S3 event, schedule), and AWS executes it on demand. You pay only for execution time. Auto-scales from 0 to thousands of concurrent executions.",
        },
        {
          q: "What is Amazon S3?",
          options: [
            "A relational database service",
            "An in-memory cache service",
            "An infinitely scalable object storage service for files, images, backups, and static assets",
            "A SQL Server managed database",
          ],
          answer: 2,
          explanation:
            "S3 (Simple Storage Service) stores objects (files) in buckets with 99.999999999% (11 nines) durability. Use it for images, videos, static website assets, backups, and data lake storage.",
        },
        {
          q: "What is Amazon RDS?",
          options: [
            "A NoSQL document database",
            "A fully managed relational database service that handles patching, backups, and replication",
            "A message queue service",
            "A serverless data warehouse",
          ],
          answer: 1,
          explanation:
            "RDS manages PostgreSQL, MySQL, SQL Server, Oracle, and Aurora. AWS handles automated backups, multi-AZ failover, read replicas, and patching. You focus on queries, not DB administration.",
        },
        {
          q: "What is Amazon CloudFront?",
          options: [
            "A web application firewall",
            "A managed DNS service",
            "A global CDN that caches content at 400+ edge locations for low-latency delivery",
            "A service for managing SSL certificates",
          ],
          answer: 2,
          explanation:
            "CloudFront is AWS's CDN. Static assets (JS, CSS, images) and even dynamic content are served from the edge location nearest to the user. Integrates with S3, EC2, API Gateway. Supports HTTPS, custom headers, WAF.",
        },
        {
          q: "What is a VPC (Virtual Private Cloud)?",
          options: [
            "A type of serverless function",
            "An isolated virtual network in AWS where you launch resources with full control over IP ranges, subnets, and routing",
            "A managed Kubernetes cluster",
            "A private DNS resolver service",
          ],
          answer: 1,
          explanation:
            "A VPC is your private slice of the AWS network. You define subnets (public and private), route tables, Internet Gateways, and NACLs. Resources inside a private subnet are not reachable from the internet by default.",
        },
        {
          q: "What is the shared responsibility model in AWS?",
          options: [
            "AWS and customers share billing costs 50/50",
            "AWS is responsible for security OF the cloud (hardware, infrastructure); customers are responsible for security IN the cloud (data, OS config, app, IAM)",
            "AWS manages all security; customers are responsible only for costs",
            "Both AWS and customers share full responsibility for all security aspects",
          ],
          answer: 1,
          explanation:
            "AWS secures physical data centers, hypervisors, and managed services. You secure your OS patches, your S3 bucket policies, your IAM roles, and your application code. Misunderstanding this leads to breaches (e.g., open S3 buckets).",
        },
      ],
    },

    part10: {
      title: "Containers & Docker",
      icon: "🐳",
      questions: [
        {
          q: "What is the key difference between a Docker image and a container?",
          options: [
            "An image is running; a container is stopped",
            "An image is the read-only blueprint; a container is a running instance of that image",
            "An image stores data; a container stores code",
            "Images are used locally; containers are deployed to cloud",
          ],
          answer: 1,
          explanation:
            "A Docker image is like a class — an immutable blueprint with layers (OS, runtime, app code). A container is a running instance of that image — like an object. One image can spawn many containers.",
        },
        {
          q: "What problem does containerization primarily solve?",
          options: [
            "Making applications run faster than on bare metal",
            "Eliminating the need for a database",
            "'It works on my machine' — packaging app + dependencies so it runs identically everywhere",
            "Automatically scaling applications under load",
          ],
          answer: 2,
          explanation:
            "Containers bundle the app, runtime, libraries, and config into one portable unit. Dev, staging, and production all run the exact same container — no more dependency conflicts or environment mismatches.",
        },
        {
          q: "What is Kubernetes used for?",
          options: [
            "Building Docker images from Dockerfiles",
            "Orchestrating, scheduling, scaling, and managing containers across a cluster of machines",
            "Providing a registry to store Docker images",
            "Monitoring application performance and logs",
          ],
          answer: 1,
          explanation:
            "Kubernetes automates: deploying containers, scaling them up/down, restarting failed ones, rolling out updates with zero downtime, and routing traffic. It's the operating system for a distributed container-based system.",
        },
        {
          q: "What is a Kubernetes Pod?",
          options: [
            "A group of worker nodes",
            "The smallest deployable unit in Kubernetes — one or more containers sharing network and storage",
            "A managed database cluster within Kubernetes",
            "A Kubernetes configuration file",
          ],
          answer: 1,
          explanation:
            "A Pod wraps one or more tightly coupled containers (e.g., app + sidecar) that share an IP address and volumes. Kubernetes schedules, scales, and manages pods, not individual containers.",
        },
        {
          q: "What does a Dockerfile define?",
          options: [
            "The runtime configuration of a Kubernetes cluster",
            "Step-by-step instructions to build a Docker image (base image, copy files, install deps, set entry point)",
            "The networking rules between containers",
            "Which containers can communicate in a Docker Compose stack",
          ],
          answer: 1,
          explanation:
            "A Dockerfile is a recipe: FROM node:18, COPY . ., RUN npm install, CMD ['node', 'server.js']. Each instruction adds a layer to the image. Running `docker build` executes these steps and produces an image.",
        },
        {
          q: "What is Docker Compose used for?",
          options: [
            "Composing multiple Docker images into one combined image",
            "Defining and running multi-container applications locally using a YAML file",
            "Orchestrating containers in production across a Kubernetes cluster",
            "Compressing Docker images before pushing to a registry",
          ],
          answer: 1,
          explanation:
            "Docker Compose lets you define your entire local dev stack (app + postgres + redis + nginx) in docker-compose.yml and start it all with `docker compose up`. Not for production (use Kubernetes for that).",
        },
        {
          q: "What is a Kubernetes Deployment?",
          options: [
            "A script that installs Kubernetes on a machine",
            "A Kubernetes object that declares the desired state for pods: image version, replicas, update strategy",
            "The process of pushing a Docker image to a registry",
            "A network policy controlling pod communication",
          ],
          answer: 1,
          explanation:
            "A Deployment declaratively manages ReplicaSets. You say 'I want 5 replicas of image v2.3'. Kubernetes reconciles to that state — rolling out updates, replacing crashed pods, and scaling to maintain the declared replica count.",
        },
        {
          q: "What is a container registry?",
          options: [
            "A Kubernetes component that schedules containers",
            "A centralized repository to store, version, and distribute Docker images",
            "A database that stores container runtime logs",
            "A firewall that controls container network access",
          ],
          answer: 1,
          explanation:
            "A registry (Docker Hub, AWS ECR, GCR) stores Docker images. You push images after building (`docker push`) and pull them during deployment (`docker pull`). Private registries secure your proprietary code.",
        },
      ],
    },

    part11: {
      title: "Production Engineering",
      icon: "🔧",
      questions: [
        {
          q: "What are the three pillars of observability?",
          options: [
            "Speed, Cost, Reliability",
            "Logs, Metrics, Traces",
            "Monitoring, Alerting, Dashboards",
            "Uptime, Latency, Throughput",
          ],
          answer: 1,
          explanation:
            "Logs: timestamped event records. Metrics: aggregated numerical measurements (p99 latency, error rate). Traces: end-to-end request journeys across services. Together, they let you understand what is happening and why.",
        },
        {
          q: "What is the difference between SLA, SLO, and SLI?",
          options: [
            "They are all the same concept with different names",
            "SLI = measured metric (latency); SLO = internal reliability target (p99 < 200ms); SLA = external contract with consequences for breach",
            "SLA = team agreement; SLO = customer agreement; SLI = technical metric",
            "SLA is for uptime; SLO is for latency; SLI is for error rate",
          ],
          answer: 1,
          explanation:
            "SLI measures the actual performance. SLO sets the target you aim for internally (more strict). SLA is the agreed contract with customers that has financial penalties if breached. Set SLO stricter than SLA to have a buffer.",
        },
        {
          q: "What is blue-green deployment?",
          options: [
            "Deploying to production during off-peak (blue) hours and peak (green) hours alternately",
            "Running two identical production environments — traffic shifts from current (blue) to new (green) allowing instant rollback",
            "A colour-coded alerting system for deployment failures",
            "Deploying blue-collar infrastructure before green-field features",
          ],
          answer: 1,
          explanation:
            "Blue-green keeps two identical environments. The new version is deployed to green, tested, then traffic instantly switches. If issues arise, flip traffic back to blue in seconds. Eliminates downtime and enables instant rollback.",
        },
        {
          q: "What is distributed tracing?",
          options: [
            "Logging every database query in production",
            "Tracking a single request as it flows through multiple microservices to understand latency and failures",
            "Monitoring network packets across data centers",
            "A method to trace security breaches in distributed systems",
          ],
          answer: 1,
          explanation:
            "A request in microservices touches 10+ services. Distributed tracing (Jaeger, Zipkin, AWS X-Ray) propagates a trace ID, recording the time and path through each service. This visualises exactly where latency comes from.",
        },
        {
          q: "What is a health check endpoint?",
          options: [
            "An endpoint that reports system memory and CPU usage to developers",
            "An endpoint that load balancers use to determine if a service instance is healthy and can receive traffic",
            "A Kubernetes dashboard showing pod health",
            "An alerting endpoint that pages on-call engineers",
          ],
          answer: 1,
          explanation:
            "A `/health` endpoint returns 200 if the service is ready, and 5xx otherwise. Load balancers and orchestrators poll it — unhealthy instances are removed from the pool. Also signals readiness vs liveness for Kubernetes probes.",
        },
        {
          q: "What is a canary deployment?",
          options: [
            "Deploying only to staging environments for canary testing",
            "Routing a small percentage of production traffic to a new version to detect issues before full rollout",
            "Testing with mock canary users before deploying to real users",
            "Deploying to production only on weekdays when engineers are online",
          ],
          answer: 1,
          explanation:
            "Named after canaries in coal mines. Ship the new version to 1% of users. Monitor error rates and latency. If healthy, gradually increase to 10%, 50%, 100%. Limits blast radius — a bad deploy affects 1% not 100%.",
        },
        {
          q: "What is an error budget in SRE?",
          options: [
            "The allocated budget for hiring SRE engineers to fix errors",
            "The amount of downtime or errors allowed per period (100% − SLO). When exhausted, new features are paused",
            "A financial reserve for paying SLA breach penalties",
            "The maximum number of errors per second before alerting fires",
          ],
          answer: 1,
          explanation:
            "If your SLO is 99.9% uptime, your error budget is 0.1% — about 43 minutes/month of allowed downtime. When you exhaust it, the team must focus on reliability work instead of new features. Aligns product and engineering incentives.",
        },
        {
          q: "What should a post-mortem (incident review) focus on?",
          options: [
            "Identifying and punishing the engineer who caused the incident",
            "Establishing a blameless timeline, understanding root causes, and creating action items to prevent recurrence",
            "Only documenting the financial impact of the incident",
            "Immediately rewriting the affected system from scratch",
          ],
          answer: 1,
          explanation:
            "Blameless post-mortems build a learning culture. Engineers won't report issues honestly if they fear punishment. Focus on: what happened, why it happened, how it was detected, and systemic improvements — not blaming individuals.",
        },
      ],
    },

    part12: {
      title: "Career Readiness",
      icon: "🎯",
      questions: [
        {
          q: "What should you prioritise doing FIRST in a system design interview?",
          options: [
            "Start drawing architecture diagrams immediately",
            "Jump to the database choice",
            "Clarify requirements: scope, scale, constraints, and what to focus on",
            "Discuss the tech stack you prefer",
          ],
          answer: 2,
          explanation:
            "Requirements drive everything. Designing Twitter for 100 users vs 500M users are completely different problems. Ask: who are the users, what must it do (and NOT do), what scale, what are the constraints? Spend 5 minutes here.",
        },
        {
          q: "What is back-of-envelope estimation used for in interviews?",
          options: [
            "Impressing interviewers with complex math",
            "Guessing the cost of the system",
            "Estimating traffic, storage, and compute requirements to justify design decisions with data",
            "Calculating developer salaries for the project",
          ],
          answer: 2,
          explanation:
            "10M DAU × 5 reads/day ÷ 86400s = ~600 reads/sec. This tells you whether one DB handles it or you need read replicas. Estimation shows you understand scale and grounds your architecture in reality, not guesswork.",
        },
        {
          q: "When defining non-functional requirements in a system design interview, what should you cover?",
          options: [
            "Programming languages and frameworks",
            "Scalability, availability, latency, consistency, durability, and security requirements",
            "Team size and sprint velocity",
            "Database vendor preferences",
          ],
          answer: 1,
          explanation:
            "NFRs define HOW the system must perform. 99.99% availability, <100ms p99 latency, 5 years data retention, eventual vs strong consistency — these drive your architecture. Agree on NFRs before drawing any boxes.",
        },
        {
          q: "What is the recommended approach when you're unsure how to continue in a system design interview?",
          options: [
            "Go silent and think until you're certain",
            "Apologise and say you don't know",
            "Think out loud — explain your reasoning, tradeoffs you're considering, and ask clarifying questions",
            "Switch to a topic you're more comfortable with",
          ],
          answer: 2,
          explanation:
            "Interviewers evaluate thinking, not just answers. Narrating your thought process ('I'm considering SQL here because we need ACID for payments, but sharding might be needed at 100M users...') shows senior-level thinking even when uncertain.",
        },
        {
          q: "What is the STAR method used for?",
          options: [
            "Designing scalable systems: Scalable, Testable, Available, Resilient",
            "Structuring behavioural interview answers: Situation, Task, Action, Result",
            "Architectural decision-making: System, Trade-offs, Alternatives, Recommendation",
            "Code review feedback: Specific, Timely, Actionable, Respectful",
          ],
          answer: 1,
          explanation:
            "STAR structures stories compellingly. Situation (context), Task (what you needed to do), Action (what YOU did specifically), Result (measurable outcome). It turns 'I fixed an outage' into a compelling 3-minute career story.",
        },
        {
          q: "Which of these is a critical number to know for system design estimation?",
          options: [
            "The number of programming languages supported by AWS",
            "The year the internet was invented",
            "SSD read is ~100 microseconds; network round trip is ~1ms; RAM read is ~100 nanoseconds",
            "A microservice typically has exactly 5 endpoints",
          ],
          answer: 2,
          explanation:
            "Knowing latency numbers lets you reason about system performance. RAM (~100ns) → SSD (~100μs) → DB query (~1-10ms) → cross-region (~100ms). These 4 orders of magnitude difference justify caching decisions in interviews.",
        },
        {
          q: "What is the 'two-pizza team' rule and why does it relate to microservices?",
          options: [
            "Teams should order pizza during production incidents",
            "A microservice team should be small enough that two pizzas can feed the whole team (~6-8 people), keeping ownership clear and communication low",
            "The cost of a microservice should not exceed the cost of two pizzas",
            "Microservices should only have two APIs — like two pizza slices",
          ],
          answer: 1,
          explanation:
            "Amazon's principle: small, autonomous teams own their services end-to-end. Large teams have communication overhead (Conway's Law). Small teams ship faster, own their reliability, and align naturally with service boundaries.",
        },
        {
          q: "How should you handle trade-offs in a system design interview?",
          options: [
            "Always choose the most complex, enterprise-grade solution to show expertise",
            "Never mention trade-offs to avoid showing uncertainty",
            "Explicitly call out trade-offs for each choice — consistency vs availability, cost vs latency — and justify your decision",
            "Only mention trade-offs if the interviewer specifically asks",
          ],
          answer: 2,
          explanation:
            "Senior engineers are hired for trade-off judgement, not recipe memorisation. 'I chose eventual consistency here because strong consistency would require distributed locking, and our use case tolerates 1-2s staleness' — this is senior thinking.",
        },
      ],
    },
  };

  /* ─── State ──────────────────────────────────────── */
  let current = {
    partId: null,
    questions: [],
    index: 0,
    score: 0,
    answered: false,
  };

  /* ─── Helpers ────────────────────────────────────── */
  function getBestScore(partId) {
    try {
      const s = JSON.parse(localStorage.getItem("aa-quiz-scores") || "{}");
      return s[partId] !== undefined ? s[partId] : null;
    } catch {
      return null;
    }
  }
  function saveBestScore(partId, score, total) {
    try {
      const s = JSON.parse(localStorage.getItem("aa-quiz-scores") || "{}");
      const pct = Math.round((score / total) * 100);
      if (s[partId] === undefined || pct > s[partId]) s[partId] = pct;
      localStorage.setItem("aa-quiz-scores", JSON.stringify(s));
    } catch {}
  }

  /* ─── Render helpers ─────────────────────────────── */
  function getContainer() {
    return document.getElementById("quizScreen");
  }

  function renderQuestion() {
    const container = getContainer();
    const q = current.questions[current.index];
    const total = current.questions.length;

    container.innerHTML = `
      <div class="quiz-panel">
        <div class="quiz-header">
          <button class="quiz-close-btn" id="quizCloseBtn">✕ Close</button>
          <div class="quiz-part-title">${current.partIcon} ${current.partTitle} — Quiz</div>
          <div class="quiz-progress-text">${current.index + 1} / ${total}</div>
        </div>

        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width:${(current.index / total) * 100}%"></div>
        </div>

        <div class="quiz-body">
          <div class="quiz-q-num">Question ${current.index + 1}</div>
          <div class="quiz-question">${q.q}</div>
          <div class="quiz-options" id="quizOptions">
            ${q.options
              .map(
                (opt, i) =>
                  `<button class="quiz-option" data-index="${i}">${String.fromCharCode(65 + i)}. ${opt}</button>`,
              )
              .join("")}
          </div>
        </div>
      </div>`;

    document
      .getElementById("quizCloseBtn")
      .addEventListener("click", closeQuiz);
    document.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () =>
        handleAnswer(parseInt(btn.dataset.index)),
      );
    });
  }

  function handleAnswer(selectedIdx) {
    if (current.answered) return;
    current.answered = true;

    const q = current.questions[current.index];
    const correct = q.answer;
    const isCorrect = selectedIdx === correct;
    if (isCorrect) current.score++;

    const container = getContainer();
    const optionBtns = container.querySelectorAll(".quiz-option");
    optionBtns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === correct) btn.classList.add("quiz-option-correct");
      else if (i === selectedIdx) btn.classList.add("quiz-option-wrong");
    });

    const body = container.querySelector(".quiz-body");
    const feedbackEl = document.createElement("div");
    feedbackEl.className =
      "quiz-feedback " +
      (isCorrect ? "quiz-feedback-correct" : "quiz-feedback-wrong");
    feedbackEl.innerHTML = `
      <div class="quiz-feedback-icon">${isCorrect ? "✓ Correct!" : "✗ Incorrect"}</div>
      <div class="quiz-feedback-exp">${q.explanation}</div>
      <button class="quiz-next-btn" id="quizNextBtn">
        ${current.index < current.questions.length - 1 ? "Next Question →" : "See Results"}
      </button>`;
    body.appendChild(feedbackEl);

    document.getElementById("quizNextBtn").addEventListener("click", () => {
      current.index++;
      current.answered = false;
      if (current.index < current.questions.length) {
        renderQuestion();
      } else {
        renderResults();
      }
    });
  }

  function renderResults() {
    const total = current.questions.length;
    const pct = Math.round((current.score / total) * 100);
    saveBestScore(current.partId, current.score, total);

    let grade, gradeClass, msg;
    if (pct >= 88) {
      grade = "🏆 Excellent!";
      gradeClass = "grade-excellent";
      msg = "Outstanding performance. You have a strong grasp of this module.";
    } else if (pct >= 63) {
      grade = "👍 Good";
      gradeClass = "grade-good";
      msg = "Solid understanding. Review the explanations for any you missed.";
    } else if (pct >= 38) {
      grade = "📚 Keep Studying";
      gradeClass = "grade-fair";
      msg = "You're getting there. Re-read the topics and try the quiz again.";
    } else {
      grade = "🔄 Try Again";
      gradeClass = "grade-poor";
      msg =
        "This module needs more practice. Go back through the topics first.";
    }

    const container = getContainer();
    container.innerHTML = `
      <div class="quiz-panel">
        <div class="quiz-header">
          <button class="quiz-close-btn" id="quizCloseBtn">✕ Close</button>
          <div class="quiz-part-title">${current.partIcon} ${current.partTitle} — Quiz</div>
          <div></div>
        </div>
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width:100%"></div>
        </div>
        <div class="quiz-results">
          <div class="quiz-score-circle ${gradeClass}">
            <div class="quiz-score-num">${pct}%</div>
            <div class="quiz-score-frac">${current.score}/${total}</div>
          </div>
          <div class="quiz-grade">${grade}</div>
          <div class="quiz-result-msg">${msg}</div>
          <div class="quiz-result-actions">
            <button class="quiz-retry-btn" id="quizRetryBtn">↺ Retry Quiz</button>
            <button class="quiz-close-btn2" id="quizCloseBtn2">✕ Close</button>
          </div>
        </div>
      </div>`;

    document
      .getElementById("quizCloseBtn")
      .addEventListener("click", closeQuiz);
    document
      .getElementById("quizCloseBtn2")
      .addEventListener("click", closeQuiz);
    document
      .getElementById("quizRetryBtn")
      .addEventListener("click", () => startQuiz(current.partId));
  }

  /* ─── Show / Close ───────────────────────────────── */
  function startQuiz(partId) {
    const data = QUIZ_DATA[partId];
    if (!data) return;

    current = {
      partId,
      partTitle: data.title,
      partIcon: data.icon,
      questions: [...data.questions].sort(() => Math.random() - 0.5),
      index: 0,
      score: 0,
      answered: false,
    };

    const screen = getContainer();
    screen.classList.remove("hidden");
    renderQuestion();
  }

  function closeQuiz() {
    const screen = getContainer();
    screen.classList.add("hidden");
    screen.innerHTML = "";
  }

  /* ─── Expose public API ──────────────────────────── */
  window.ArchQuiz = { start: startQuiz, getBestScore };
})();

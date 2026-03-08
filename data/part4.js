/* Part 4 — Databases (25 topics) — Deep Rewrite */
const PART4 = {
  id: "part4",
  icon: "🗄️",
  title: "Part 4",
  name: "Databases & SQL",
  topics: [
    {
      id: "p4t1",
      title: "Tables, Rows & Columns",
      subtitle:
        "The fundamental units of a relational database — organised data in structured grids.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>table</strong> is a collection of related data organised as rows and columns — like a spreadsheet, but with strict structure. A <strong>row</strong> (or record/tuple) represents one entity — one product, one user, one order. A <strong>column</strong> (or field/attribute) represents one property of that entity — a product's name, price, or stock count. The intersection of a row and column is a single value.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Database Tables",
          body: `<div class="diagram-box">TABLE: products
  id | name                | price  | stock | category    | created_at
  ---|---------------------|--------|-------|-------------|------------
   1 | Nike Air Max 270    |  7999  |  150  | footwear    | 2026-01-15
   2 | Adidas Ultraboost   |  9999  |   87  | footwear    | 2026-01-16
   3 | Puma Running T-Shirt|  1499  |  300  | apparel     | 2026-01-17

TABLE: users
  id | name            | email                 | phone        | created_at
  ---|-----------------|-----------------------|--------------|------------
  42 | Rahul Sharma    | rahul@example.com     | 9876543210   | 2025-06-01
  43 | Priya Singh     | priya@example.com     | 9876543211   | 2025-07-15

TABLE: orders
  id  | user_id | total  | status    | created_at
  ----|---------|--------|-----------|-------------
  789 | 42      | 7999   | delivered | 2026-01-20
  790 | 43      | 9999   | shipped   | 2026-01-21

Each row = one entity. Each column = one property. Table defines the schema.</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Schema Design Decisions",
          body: `<p>Table design is the most impactful architecture decision in a database. Get it wrong and you'll fight it for years. Key questions: What is the right level of granularity for each table? Should <code>shipping_address</code> be columns in the orders table, or a separate <code>addresses</code> table? (Separate table allows reuse, but adds a join.) What data types are best? (Using <code>VARCHAR(255)</code> for a pincode that should be <code>CHAR(6)</code> wastes storage and misses validation.) Should you denormalise for performance? These decisions compound — they affect query patterns, index efficiency, and application complexity for the life of the system.</p>`,
        },
      ],
    },

    {
      id: "p4t2",
      title: "SELECT Queries",
      subtitle: "The most important SQL statement — reading data from tables.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>SELECT</strong> statement retrieves data from one or more tables. It is the foundation of all data reading in SQL. The basic structure is: <code>SELECT columns FROM table WHERE conditions</code>. The WHERE clause filters rows, returning only those matching the criteria.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart SELECT Examples",
          body: `<div class="diagram-box">-- Get all products in footwear category under ₹10,000:
SELECT id, name, price, stock
FROM products
WHERE category = 'footwear'
  AND price &lt; 10000
  AND stock &gt; 0;

-- Get Rahul's 10 most recent orders:
SELECT id, total, status, created_at
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 10;

-- Count orders by status:
SELECT status, COUNT(*) AS order_count
FROM orders
GROUP BY status;

-- Find top 5 most expensive products in stock:
SELECT name, price
FROM products
WHERE stock &gt; 0
ORDER BY price DESC
LIMIT 5;

-- Search products by name (case-insensitive):
SELECT id, name, price
FROM products
WHERE LOWER(name) LIKE '%running%';</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "The SELECT * Anti-Pattern",
          body: `<div class="callout warn"><span class="callout-icon">⚠️</span><strong>Never use SELECT * in production code.</strong> Reasons: (1) You fetch every column including large ones (product descriptions: 2000 chars, images: JSON array) when you only need 3 fields. This wastes database I/O, network bandwidth, and memory. (2) Schema changes (adding a column) silently break code that relies on column order. (3) Index-only scans (extremely efficient) become impossible — they require knowing exactly which columns to read. Always name your columns explicitly.</div>`,
        },
      ],
    },

    {
      id: "p4t3",
      title: "ORDER BY & LIMIT",
      subtitle:
        "Controlling the order and quantity of results — the foundation of pagination.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>ORDER BY</strong> sorts query results by one or more columns. <strong>LIMIT</strong> restricts the number of rows returned. Together they power pagination, leaderboards, "most recent" feeds, and any sorted data presentation. Without ORDER BY, PostgreSQL returns rows in undefined order — which changes between queries as the database evolves.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Sorting Examples",
          body: `<div class="diagram-box">-- Product listing page: sorted by rating, paginated:
SELECT id, name, price, avg_rating
FROM products
WHERE category = 'footwear'
ORDER BY avg_rating DESC, price ASC  ← multi-column sort
LIMIT 20 OFFSET 0;                   ← page 1

-- Next page:
LIMIT 20 OFFSET 20;                  ← page 2 (offset pagination)

-- Orders admin: most recent first:
SELECT id, user_id, total, status, created_at
FROM orders
ORDER BY created_at DESC
LIMIT 50;

-- Leaderboard: top 10 sellers this month:
SELECT seller_id, SUM(total) AS revenue
FROM orders
WHERE status = 'delivered'
  AND created_at &gt;= '2026-01-01'
GROUP BY seller_id
ORDER BY revenue DESC
LIMIT 10;

⚠️ Performance: ORDER BY requires sorting — expensive without an index.
Columns in ORDER BY clause should have indexes for fast queries.
ORDER BY avg_rating DESC executes a filesort (slow) without an index on avg_rating.</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Always add indexes on frequently sorted columns. If product listings are always sorted by price or rating, those columns need indexes. Composite indexes that cover both WHERE and ORDER BY are the most efficient — the database can use one index for both filtering and sorting with zero additional sort step. LIMIT without ORDER BY in production is dangerous — it returns arbitrary rows that change between deployments as PostgreSQL's physical storage changes.</p>`,
        },
      ],
    },

    {
      id: "p4t4",
      title: "GROUP BY & Aggregations",
      subtitle:
        "Summarising and aggregating data — from row-level to insight-level.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>GROUP BY</strong> collapses multiple rows with the same column value into a single summary row, enabling <strong>aggregate functions</strong> (COUNT, SUM, AVG, MIN, MAX) to compute statistics across groups. Every analytics query, dashboard metric, and report relies on GROUP BY aggregations.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Analytics Queries",
          body: `<div class="diagram-box">-- Revenue by category this month:
SELECT p.category, SUM(oi.price * oi.quantity) AS revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'delivered'
  AND o.created_at &gt;= DATE_TRUNC('month', NOW())
GROUP BY p.category
ORDER BY revenue DESC;

-- Order volume by day (for a chart):
SELECT DATE(created_at) AS order_date,
       COUNT(*) AS order_count,
       SUM(total) AS daily_revenue,
       AVG(total) AS avg_order_value
FROM orders
WHERE created_at &gt;= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY order_date;

-- Products with inventory &lt; 10 per category:
SELECT category,
       COUNT(*) AS low_stock_products,
       MIN(stock) AS lowest_stock
FROM products
WHERE stock &lt; 10
GROUP BY category
HAVING COUNT(*) &gt; 5  ← HAVING filters on aggregated results (vs WHERE on rows)
ORDER BY low_stock_products DESC;</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "WHERE vs HAVING",
          body: `<p><code>WHERE</code> filters individual rows BEFORE grouping. <code>HAVING</code> filters groups AFTER aggregation. This is a commonly tested distinction:</p>
<div class="diagram-box">-- WRONG way to filter aggregated results:
SELECT user_id, COUNT(*) FROM orders
WHERE COUNT(*) &gt; 5   ← ERROR: cannot use aggregate in WHERE
GROUP BY user_id;

-- CORRECT:
SELECT user_id, COUNT(*) AS order_count FROM orders
GROUP BY user_id
HAVING COUNT(*) &gt; 5;  ← HAVING filters post-aggregation ✅</div>`,
        },
      ],
    },

    {
      id: "p4t5",
      title: "Aggregate Functions",
      subtitle:
        "COUNT, SUM, AVG, MIN, MAX — the five functions that power all analytics.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>Aggregate functions perform calculations across multiple rows and return a single result. The five core functions: <strong>COUNT</strong> (how many), <strong>SUM</strong> (total), <strong>AVG</strong> (average), <strong>MIN</strong> (minimum), <strong>MAX</strong> (maximum). Every business metric in ShopKart's analytics dashboard is built with these.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Business Metrics",
          body: `<div class="diagram-box">-- Dashboard KPIs (all aggregate functions):
SELECT
  COUNT(*)                              AS total_orders,
  COUNT(DISTINCT user_id)               AS unique_customers,
  SUM(total)                            AS gross_revenue,
  AVG(total)                            AS avg_order_value,
  MIN(total)                            AS smallest_order,
  MAX(total)                            AS largest_order,
  PERCENTILE_CONT(0.5) WITHIN GROUP
    (ORDER BY total)                    AS median_order_value
FROM orders
WHERE status = 'delivered'
  AND created_at &gt;= '2026-01-01';

-- COUNT(*) vs COUNT(column):
COUNT(*)          → counts all rows, including NULLs
COUNT(coupon_id)  → counts only rows where coupon_id IS NOT NULL
                    → shows how many orders used a coupon

-- Product rating stats:
SELECT product_id,
       COUNT(*)      AS review_count,
       AVG(rating)   AS avg_rating,
       MIN(rating)   AS lowest_rating,
       MAX(rating)   AS highest_rating
FROM reviews
GROUP BY product_id
HAVING COUNT(*) &gt;= 10  ← only show products with ≥10 reviews
ORDER BY avg_rating DESC;</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Pre-compute Aggregates",
          body: `<p>Running complex aggregate queries on large tables in real-time is expensive. ShopKart cannot aggregate 50 million orders every time someone opens the dashboard. Solution: <strong>materialised views</strong> or <strong>denormalised summary tables</strong>. A nightly job computes product rating aggregates (avg_rating, review_count) and stores them in the products table — single column read instead of a JOIN + AVG across millions of reviews. Real-time dashboards use streaming aggregation (Apache Kafka + Flink). Understanding when to pre-compute vs query live is a key architect decision.</p>`,
        },
      ],
    },

    {
      id: "p4t6",
      title: "Primary Keys",
      subtitle:
        "The unique identifier for every row — the foundation of relational data.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>primary key</strong> is a column (or combination of columns) that uniquely identifies every row in a table. Every table should have a primary key. No two rows can share the same primary key value. Primary keys are automatically indexed, making lookups by ID extremely fast.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Primary Key Strategies",
          body: `<table class="compare-table"><thead><tr><th>Strategy</th><th>Example</th><th>Pros</th><th>Cons</th></tr></thead><tbody>
<tr><td><strong>Serial (auto-increment)</strong></td><td>id: 1, 2, 3, 4...</td><td>Simple, sequential, compact, index-friendly (clustered writes)</td><td>Predictable — IDs expose volume. Cross-database merge conflicts. Distributed system coordination needed.</td></tr>
<tr><td><strong>UUID v4</strong></td><td>a3f2b1c4-d5e6-...</td><td>Globally unique, no coordination, safe to generate client-side</td><td>128-bit (larger than 8-byte int). Random UUIDs cause index fragmentation (random inserts).</td></tr>
<tr><td><strong>UUID v7 / ULID</strong></td><td>01HXK9R2... (time-ordered)</td><td>Globally unique AND time-ordered (no fragmentation). Best of both.</td><td>Newer, less tooling support. But rapidly becoming standard.</td></tr>
</tbody></table>
<div class="callout tip"><span class="callout-icon">💡</span>ShopKart uses UUIDs for user-exposed IDs (order IDs in URLs) to avoid exposing business volume and prevent enumeration attacks. Internal tables use serial integers for join performance.</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Using email or phone as primary key.</strong> These change. Users update their email. Using mutable data as a primary key cascades updates across every foreign key reference in the database.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Exposing sequential integer IDs in URLs.</strong> GET /orders/1234 tells users you've had 1,234 orders. Enables enumeration attacks (iterate through all order IDs to scrape data). Use UUIDs in external-facing URLs.</div></div>
</div>`,
        },
      ],
    },

    {
      id: "p4t7",
      title: "Foreign Keys",
      subtitle:
        "The relationships between tables — enforcing data integrity at the database level.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>foreign key</strong> is a column in one table that references the primary key of another table. It enforces referential integrity — ensuring that relationships between records are valid. You cannot create an order for a user that doesn't exist; you cannot delete a user who has orders (without handling the cascade).</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Relationships",
          body: `<div class="diagram-box">TABLE: orders
  id     → Primary Key
  user_id → Foreign Key → references users(id)
  
TABLE: order_items
  id         → Primary Key
  order_id   → Foreign Key → references orders(id) ON DELETE CASCADE
  product_id → Foreign Key → references products(id)
  quantity   → integer
  price      → decimal (price snapshot at time of order)

Referential Integrity in Action:
  ✅ INSERT INTO orders (user_id=42) → OK (user 42 exists)
  ❌ INSERT INTO orders (user_id=999) → ERROR: user 999 does not exist
  ❌ DELETE FROM users WHERE id=42   → ERROR: user has orders (FK constraint)
  
  With ON DELETE CASCADE on order_items:
  DELETE FROM orders WHERE id=789 → also deletes all order_items for order 789 ✅
  
  With ON DELETE SET NULL:
  DELETE FROM products WHERE id=1 → sets order_items.product_id = NULL 
  (dangerous for historical orders — use soft delete instead!)</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — FK Trade-offs in Scale",
          body: `<p>Foreign key constraints provide guaranteed data integrity. But at extreme write scales (millions of inserts/second), FK checks add overhead — each insert triggers a lookup in the referenced table. At massive scale, some teams disable FK constraints in the database and enforce integrity in application code + integration tests instead. Shopify and other high-scale platforms do this. The decision is: strong consistency guarantee vs pure write throughput. For most systems (ShopKart at 100K orders/day), FK constraints are absolutely worth it.</p>`,
        },
      ],
    },

    {
      id: "p4t8",
      title: "SQL Joins",
      subtitle:
        "Combining data from multiple tables to answer complex questions.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>JOIN</strong> combines rows from two or more tables based on a related column. Instead of storing all data in one table (which creates duplication), we store data normalised across tables and JOIN them for queries. The most common joins: <strong>INNER JOIN</strong> (only matching rows), <strong>LEFT JOIN</strong> (all left rows + matches, NULLs for non-matches), <strong>RIGHT JOIN</strong>, <strong>FULL OUTER JOIN</strong>.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart JOIN Examples",
          body: `<div class="diagram-box">-- Rahul's order details with product names:
SELECT o.id, o.created_at, o.status,
       p.name AS product_name,
       oi.quantity, oi.price
FROM orders o
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
WHERE o.user_id = 42
ORDER BY o.created_at DESC;

-- LEFT JOIN: All products with their review counts
-- (includes products with 0 reviews — INNER JOIN would exclude them):
SELECT p.name, COUNT(r.id) AS review_count, AVG(r.rating) AS avg_rating
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name
ORDER BY avg_rating DESC NULLS LAST;

-- Find users who have NEVER placed an order (LEFT JOIN + NULL check):
SELECT u.id, u.name, u.email
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;  ← o.id is NULL means no matching order</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Join Type Visual",
          body: `<div class="diagram-box">users table:    orders table:
  id | name       id | user_id
  42 | Rahul      789 | 42
  43 | Priya      790 | 42
  44 | Amit       (no order for 44)

INNER JOIN (only matched rows):
  42 | Rahul | 789
  42 | Rahul | 790
  (Amit excluded — no match in orders)

LEFT JOIN (all left rows):
  42 | Rahul | 789
  42 | Rahul | 790
  44 | Amit  | NULL  ← kept even though no order</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — JOIN Performance",
          body: `<p>JOINs are expensive without proper indexes. Every column in ON clauses must be indexed. <code>ON orders.user_id = users.id</code> requires an index on <code>orders.user_id</code> (users.id is already indexed as PK). Multi-table JOINs with filtering should design indexes to cover the entire query: the WHERE clause, the JOIN conditions, and the ORDER BY. When JOINs are too slow, consider denormalisation — storing the user's name in the orders table to avoid the JOIN. This trades redundancy for speed.</p>`,
        },
      ],
    },

    {
      id: "p4t9",
      title: "Many-to-Many Relationships",
      subtitle:
        "Modelling complex relationships like products-to-categories or orders-to-products.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>many-to-many relationship</strong> exists when one record in table A can relate to many records in table B, AND one record in table B can relate to many records in table A. Example: one product can be in many categories; one category can contain many products. SQL does not directly support many-to-many — it requires a <strong>junction table</strong> (also called a bridge or join table) in between.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Junction Tables",
          body: `<div class="diagram-box">Problem: Products can belong to multiple categories.
  Nike Air Max → [footwear, running, sports]
  
WRONG approach (storing as comma-separated in one column):
  products: category_ids = "1,3,5"  ← cannot join, cannot index, terrible.

CORRECT: Junction table:
  CREATE TABLE product_categories (
    product_id  INT REFERENCES products(id),
    category_id INT REFERENCES categories(id),
    PRIMARY KEY (product_id, category_id)  ← composite PK
  );

Data:
  product_id | category_id
       1     |     1        (Nike Air Max → footwear)
       1     |     3        (Nike Air Max → running)
       1     |     5        (Nike Air Max → sports)
       2     |     1        (Adidas → footwear)

Query: All products in "running" category:
  SELECT p.name FROM products p
  JOIN product_categories pc ON p.id = pc.product_id
  JOIN categories c ON pc.category_id = c.id
  WHERE c.name = 'running';

Junction tables can have extra columns:
  order_items (junction between orders and products):
    order_id, product_id, quantity, price, discount_applied</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Junction tables are everywhere in real schemas. ShopKart has: product_categories, product_tags, user_roles, order_items, cart_items, seller_products. When the junction table has meaningful attributes beyond just linking the two entities (like quantity and price in order_items), it effectively becomes its own entity. Recognising this pattern and designing it correctly is fundamental to database modelling.</p>`,
        },
      ],
    },

    {
      id: "p4t10",
      title: "Constraints",
      subtitle:
        "Encoding business rules directly in the database — the last line of defence for data integrity.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Constraints</strong> are rules defined in the database schema that every row must satisfy. They enforce data integrity at the database level — independent of application code. Even if a bug in the application sends invalid data, the database rejects it. Constraints include: NOT NULL, UNIQUE, CHECK, DEFAULT, FOREIGN KEY.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Schema with Constraints",
          body: `<div class="diagram-box">CREATE TABLE products (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,            ← cannot be null
  price        DECIMAL(10,2) NOT NULL
               CHECK (price &gt; 0),               ← price must be positive
  stock        INTEGER NOT NULL DEFAULT 0
               CHECK (stock &gt;= 0),              ← stock can't go negative
  category     VARCHAR(50) NOT NULL,
  seller_id    INTEGER NOT NULL REFERENCES sellers(id),
  sku          VARCHAR(50) UNIQUE NOT NULL,      ← no duplicate SKUs
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id),
  total        DECIMAL(12,2) NOT NULL CHECK (total &gt;= 0),
  status       VARCHAR(20) NOT NULL
               CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

Without CHECK constraint on status:
  Any string can be inserted: status = 'delviered' (typo), status = NULL
  Application queries for status = 'delivered' never find the typo rows
  Silent data corruption that's almost impossible to debug</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Defense in Depth",
          body: `<p>Good systems validate at multiple layers: frontend (UX feedback), API layer (400 errors, schema validation), and database (constraints). Even if layers 1 and 2 fail (a bug, a direct DB script, a data migration), layer 3 (database constraints) prevents corrupt data from entering the system. Never assume application code is the only thing standing between bad data and your database. Encode your domain invariants as constraints.</p>`,
        },
      ],
    },

    {
      id: "p4t11",
      title: "Database Indexing",
      subtitle:
        "The single most impactful performance optimisation available to any database.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A database <strong>index</strong> is a separate data structure that maintains a sorted copy of specific columns, enabling the database to find rows matching a query without scanning every row in the table. Without indexes, every query does a <strong>sequential scan</strong> (O(n) — reads all rows). With indexes, queries do a <strong>index scan</strong> (O(log n) — follows B-tree to find matching rows).</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Index Impact on ShopKart",
          body: `<div class="diagram-box">orders table: 50 million rows

Without index on user_id:
  SELECT * FROM orders WHERE user_id = 42;
  → PostgreSQL reads all 50 million rows, checks each one ← FULL TABLE SCAN
  → 8 seconds query time, 100% CPU

CREATE INDEX idx_orders_user_id ON orders(user_id);

With index:
  SELECT * FROM orders WHERE user_id = 42;
  → PostgreSQL follows B-tree index to user_id = 42 directly
  → Returns Rahul's 15 orders instantly
  → 0.3ms query time ← 26,000x faster!

Index also helps ORDER BY:
  With index on (user_id, created_at DESC):
  SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 10;
  → Index already sorted by user_id then created_at
  → No sort step needed, just read top 10 from index ← extremely fast</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Index Trade-offs",
          body: `<div class="diagram-box">Indexes speed up reads but slow down writes:

Products table with 5 indexes:
  INSERT INTO products ...
  → Write to table
  → Update idx_category (B-tree insert)
  → Update idx_price (B-tree insert)
  → Update idx_name (B-tree insert)
  → Update idx_seller_id (B-tree insert)
  → Update idx_sku (B-tree insert, unique check)
  
5x additional I/O operations per insert.
For a table with 1% reads / 99% writes, indexes are net harmful.
For ShopKart products (95% reads / 5% writes), indexes are net beneficial.</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Index Design</div><div class="interview-q">"For ShopKart's orders table, I'd index user_id (queries by user), created_at (sort by recency), status (filter by status), and a composite index on (user_id, created_at DESC) for the user order history query. I'd avoid over-indexing — every extra index slows down inserts and orders is a high-write table during peak hours." Indexing strategy should always mention both benefits and costs.</div></div>`,
        },
      ],
    },

    {
      id: "p4t12",
      title: "B-Tree Indexes Explained",
      subtitle:
        "The data structure behind 99% of database indexes — how it actually works.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>B-Tree</strong> (Balanced Tree) is the default index structure in PostgreSQL, MySQL, and most relational databases. It is a self-balancing tree where every leaf node is at the same depth. This ensures O(log n) lookup time regardless of data size. A B-Tree on 1 billion rows still finds any value in ~30 steps.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "B-Tree Structure",
          body: `<div class="diagram-box">B-Tree on orders.user_id (simplified):

Root Node: [user_id: 25 | 50 | 75]
                ↓           ↓           ↓
[1-24]      [25-49]     [50-74]     [75-100]
  ↓
[1-12] [13-24]
  ↓
[1|2|3|4|5|6] ← Leaf nodes: actual row pointers

Query: WHERE user_id = 42
  1. Read root: 42 > 25 and < 50 → go to [25-49] branch
  2. Read [25-49]: 42 > 37 and < 49 → go to next branch
  3. Find leaf with 42 → get row pointer → read table row
  4. ~3 I/O reads total regardless of table size

Properties enabling O(log n):
  ✅ Always balanced (all leaves at same depth)
  ✅ Supports range queries: WHERE price BETWEEN 1000 AND 5000
  ✅ Supports ORDER BY (data pre-sorted in index)
  ✅ Logarithmic depth: 1B rows = ~30 levels max</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "When B-Tree Doesn't Help",
          body: `<p>B-Trees only help when the index can be used to NARROW DOWN the result set. When 90% of rows match the query condition (low cardinality — e.g., <code>WHERE country = 'India'</code> on a table of Indian users), PostgreSQL decides a full table scan is faster than following index pointers to 90% of the table. The query planner calculates this automatically. Low-cardinality columns (boolean flags, status enums with few values) often don't benefit from B-tree indexes — consider partial indexes or composite indexes instead.</p>`,
        },
      ],
    },

    {
      id: "p4t13",
      title: "Composite Indexes",
      subtitle:
        "Multi-column indexes that can serve entire queries from one lookup.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>composite index</strong> (multi-column index) is an index on multiple columns together. It can serve queries that filter, sort, or cover multiple columns simultaneously. The column ORDER in a composite index matters enormously — it determines which queries the index can serve efficiently.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Composite Index Design",
          body: `<div class="diagram-box">Common query pattern in ShopKart admin:
  SELECT id, total, status, created_at
  FROM orders
  WHERE user_id = 42
    AND status = 'delivered'
  ORDER BY created_at DESC
  LIMIT 20;

Option 1 — Two separate indexes:
  idx_user_id on (user_id)
  idx_status on (status)
  → PostgreSQL uses one, scans results, applies other filter
  → Two index lookups, then merge = slow

Option 2 — Composite index:
  CREATE INDEX idx_orders_user_status_date
    ON orders(user_id, status, created_at DESC);
  
  Query can use this single index for:
    ✅ Filter: WHERE user_id = 42 (leftmost column — efficient)
    ✅ Filter: AND status = 'delivered' (second column — efficient)
    ✅ Sort: ORDER BY created_at DESC (third column — pre-sorted!)
  
  → One index scan, zero additional sort step. Maximum performance.

THE LEFT-PREFIX RULE (critical):
  Composite index (user_id, status, created_at) can serve:
    WHERE user_id = 42                           ✅ (leftmost prefix)
    WHERE user_id = 42 AND status = 'delivered'  ✅ (first two columns)
    WHERE user_id = 42 AND status = 'x' ORDER BY created_at ✅
    WHERE status = 'delivered'                   ❌ (skips leftmost column)
    WHERE created_at &gt; ...                      ❌ (skips first two columns)</div>`,
        },
      ],
    },

    {
      id: "p4t14",
      title: "When NOT to Index",
      subtitle:
        "Every index has a cost — knowing when to skip one is as important as knowing when to add one.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>Over-indexing is a real performance problem. Every index: consumes disk space, slows down INSERT/UPDATE/DELETE operations (all indexes must be updated), and increases buffer cache pressure. The right number of indexes is the minimum needed to serve critical query patterns efficiently.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "When to Skip an Index",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Small tables (&lt;10,000 rows):</strong> A full table scan on 1,000 rows takes 1ms — an index doesn't help. Index overhead adds complexity worth nothing.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Very low cardinality</strong> (e.g., is_deleted: true/false): Only 2 possible values. If 99% of rows are is_deleted=false, an index on is_deleted provides almost no filtering benefit. Use a <strong>partial index</strong> instead: <code>CREATE INDEX ON products WHERE is_active = true</code>.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Write-heavy tables:</strong> If you INSERT 10,000 rows/second into an events log table, adding 5 indexes means 50,000 index update operations/second. Delay analysis indexes to a read replica or OLAP database.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Unused indexes:</strong> PostgreSQL tracks index usage. Indexes that are never used still slow down every write. Run <code>pg_stat_user_indexes</code> to find unused indexes and drop them.</div></div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Index Monitoring",
          body: `<p>Don't guess at indexes — measure. The process: (1) Enable slow query logging in production. (2) Review queries taking &gt;100ms. (3) Use EXPLAIN ANALYZE to see if they're doing full table scans. (4) Add targeted indexes for slow queries. (5) Monitor index usage and drop unused ones monthly. This data-driven approach avoids both under-indexing (slow reads) and over-indexing (slow writes).</p>`,
        },
      ],
    },

    {
      id: "p4t15",
      title: "Transactions",
      subtitle:
        "Grouping multiple operations into one atomic unit — all or nothing.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>transaction</strong> is a group of SQL operations that execute as a single unit. Either ALL operations succeed (and are committed), or ALL operations fail (and are rolled back) — leaving the database as if the transaction never happened. Transactions prevent partial updates that leave the database in an inconsistent state.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Order Placement Transaction",
          body: `<div class="diagram-box">Without transaction (DANGEROUS):
  1. INSERT INTO orders ... → success ✅
  2. UPDATE inventory SET stock = stock - 1 WHERE id = 1 → CRASH! 💥
  Result: Order exists, inventory NOT updated. 
  Product sold but still shows in stock. Customer gets non-existent item.

With transaction (SAFE):
  BEGIN;
    -- Step 1: Create the order
    INSERT INTO orders (user_id, total, status) VALUES (42, 7999, 'pending')
    RETURNING id INTO order_id;
    
    -- Step 2: Add order items
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (order_id, 1, 1, 7999);
    
    -- Step 3: Deduct inventory
    UPDATE products SET stock = stock - 1
    WHERE id = 1 AND stock &gt;= 1;  ← check stock before deducting
    
    -- Step 4: Verify inventory was actually updated (not already 0):
    IF rows_affected = 0 THEN
      ROLLBACK;  ← stock was 0, abort entire transaction
      RAISE EXCEPTION 'INSUFFICIENT_STOCK';
    END IF;
    
    -- Step 5: Create payment record
    INSERT INTO payments (order_id, amount, status) VALUES (order_id, 7999, 'pending');
    
  COMMIT;  ← all succeed → all persisted atomically</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Long-running transactions.</strong> A transaction that spans a UI interaction ("user fills the payment form") holds database locks for minutes. Other queries trying to read the same rows wait. Use short, tight transactions that complete in milliseconds.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Not handling transaction failures.</strong> If a transaction rolls back due to a constraint violation, the application must handle this gracefully (retry, return error) — not silently swallow the exception.</div></div>
</div>`,
        },
      ],
    },

    {
      id: "p4t16",
      title: "ACID Properties",
      subtitle:
        "The four guarantees that make relational databases trustworthy for critical data.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>ACID</strong> describes the four properties that database transactions must guarantee: <strong>Atomicity</strong> (all or nothing), <strong>Consistency</strong> (constraints always satisfied), <strong>Isolation</strong> (concurrent transactions don't interfere), <strong>Durability</strong> (committed data survives crashes). These properties are what make SQL databases appropriate for financial and transactional workloads.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "ACID in ShopKart Context",
          body: `<div class="info-grid">
  <div class="info-card blue"><div class="info-card-title">Atomicity</div><p>When Rahul places an order: either the order is created, inventory deducted, AND payment recorded — or none of it happens. No partial states. If the server crashes mid-transaction, PostgreSQL's WAL (Write-Ahead Log) restores the database to before the transaction started.</p></div>
  <div class="info-card green"><div class="info-card-title">Consistency</div><p>Every transaction moves the database from one valid state to another. A transaction that would violate a CHECK constraint (stock going negative) or FOREIGN KEY is rejected. The database always satisfies all defined constraints.</p></div>
  <div class="info-card yellow"><div class="info-card-title">Isolation</div><p>1000 users simultaneously placing orders on ShopKart. Each transaction appears to execute in isolation — they don't see each other's incomplete changes. Prevents race conditions like two users both buying the last unit.</p></div>
  <div class="info-card red"><div class="info-card-title">Durability</div><p>After COMMIT response, the order data is permanently recorded even if the server loses power in the next millisecond. PostgreSQL writes to WAL before acknowledging commit — data survives crashes.</p></div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — BASE vs ACID",
          body: `<p><strong>NoSQL databases</strong> often trade ACID for scalability, following <strong>BASE</strong> (Basically Available, Soft state, Eventually consistent). MongoDB historically had no multi-document transactions. DynamoDB's transactions have limitations. Cassandra's "last write wins" can lose data on concurrent writes. Understanding this trade-off is fundamental: use PostgreSQL (ACID) for orders, payments, inventory — where correctness is non-negotiable. Use Redis or DynamoDB for session cache, activity feeds — where eventual consistency is acceptable and throughput matters more.</p>`,
        },
      ],
    },

    {
      id: "p4t17",
      title: "Race Conditions in Databases",
      subtitle:
        "When concurrent transactions collide — and how to prevent silent data corruption.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>race condition</strong> occurs when two concurrent transactions read and modify the same data, and the final result depends on timing rather than logic. Without proper isolation and locking, concurrent requests can corrupt data even when each individual request is individually correct.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "The Classic ShopKart Race Condition",
          body: `<div class="diagram-box">products table: id=1, stock=1 (last Nike Air Max)

Transaction A (Rahul):              Transaction B (Priya):
  1. SELECT stock FROM products      
     WHERE id = 1;                   
     → reads stock = 1 ✅ in stock   
                                      2. SELECT stock FROM products
                                         WHERE id = 1;
                                         → reads stock = 1 ✅ in stock
  3. (stock > 0, proceed)            
  4. INSERT INTO orders...           
  5. UPDATE products SET             4. (stock > 0, proceed)
     stock = stock - 1              5. INSERT INTO orders...
     WHERE id = 1;                  6. UPDATE products SET
     → stock = 0                       stock = stock - 1
  6. COMMIT ✅                          WHERE id = 1;
                                         → stock = -1 ❌ OVERSOLD!
                                      7. COMMIT ✅ (no constraint!)

Result: Both Rahul and Priya placed orders for the last unit.
Product that doesn't exist is sold. Customer gets disappointing cancellation email.

SOLUTION — Atomic update with check:
  UPDATE products SET stock = stock - 1
  WHERE id = 1 AND stock &gt;= 1;   ← atomic: read + update in one SQL operation
  ← if rows_affected = 0, stock was 0, rollback</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Locking Solutions",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>Atomic UPDATE with WHERE condition:</strong> <code>UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock >= 1</code>. Returns rows affected. If 0 = stock was already depleted. No separate SELECT needed.</div></div>
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>SELECT FOR UPDATE (pessimistic locking):</strong> Locks the row for the duration of the transaction. Other transactions wait. Use for complex multi-step operations. Can cause deadlocks if not careful.</div></div>
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>Optimistic locking with version column:</strong> Add a <code>version</code> integer. <code>UPDATE products SET stock = ..., version = version + 1 WHERE id = 1 AND version = 5</code>. If another transaction updated version from 5 to 6, this UPDATE affects 0 rows → retry.</div></div>
</div>`,
        },
      ],
    },

    {
      id: "p4t18",
      title: "Preventing Duplicate Payments",
      subtitle:
        "The specific race condition that costs real money — and how to design it away.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>In distributed systems, payment requests can be retried due to network timeouts, user double-clicks, or automated retry logic. Without careful design, a single payment intent can result in multiple charges. This is the most financially critical race condition to prevent.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Payment Idempotency",
          body: `<div class="diagram-box">Problem scenario:
  1. Rahul clicks "Pay ₹7,999"
  2. Frontend sends POST /payments
  3. Server charges card ✅, inserts payment record...
  4. CRASH before returning response!
  5. Frontend times out, user sees spinner, clicks "Pay" again
  6. Second charge initiated → Rahul charged TWICE

SOLUTION — Unique idempotency key + DB unique constraint:
  
  payments table:
    CREATE TABLE payments (
      id               SERIAL PRIMARY KEY,
      order_id         INTEGER NOT NULL REFERENCES orders(id),
      idempotency_key  VARCHAR(64) NOT NULL UNIQUE,  ← UNIQUE constraint!
      amount           DECIMAL(10,2),
      status           VARCHAR(20),
      created_at       TIMESTAMPTZ DEFAULT NOW()
    );
  
  Payment flow:
  1. Frontend generates idempotency_key = UUID (once, stored locally)
  2. POST /payments { idempotency_key: "a3f2b1c4-..." }
  3. Server tries INSERT INTO payments(..., idempotency_key = 'a3f2b1c4-...')
  4. If UNIQUE VIOLATION → this key already used → return existing payment! ✅
  5. If INSERT succeeds → charge card → update payment status → return result
  
  Second attempt with same key → UNIQUE VIOLATION → returns first result.
  No double charge. Rahul is happy. Finance team is happy.</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Outbox Pattern",
          body: `<p>For complex distributed flows, the <strong>Transactional Outbox pattern</strong> ensures payment events are reliably published even if the service crashes. Instead of directly calling Stripe AND writing to the database (two separate systems — can fail independently), you write to a local <code>outbox</code> table in the SAME database transaction as the order. A separate process reads the outbox and reliably sends to Stripe, with retries. This eliminates the possibility of charging Stripe but failing to record locally, or vice versa.</p>`,
        },
      ],
    },

    {
      id: "p4t19",
      title: "Normalization",
      subtitle:
        "Organising data to eliminate redundancy and prevent update anomalies.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Normalisation</strong> is the process of organising database tables to reduce data redundancy and improve data integrity. A normalised database stores each fact in exactly one place — if Rahul's city changes, it changes in one row, and that change is accurately reflected everywhere it's needed.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Problems with Redundant Data",
          body: `<div class="diagram-box">DENORMALISED (problematic) — order_items table stores seller info:
  
  order_id | product | seller_name     | seller_email
       789 | Nike    | Sports City     | sports@city.com
       790 | Adidas  | Sports City     | sports@city.com
       791 | Puma    | Sports City     | sports@city.com

Problems:
  UPDATE anomaly: Seller changes email → must update 3 rows. Miss one → inconsistent data.
  INSERT anomaly: Can't record seller info without an order.
  DELETE anomaly: Delete all orders for seller → lose seller info entirely.

NORMALISED (correct):
  sellers table:  id | name            | email
                   1 | Sports City     | sports@city.com (stored ONCE)

  order_items: order_id | product | seller_id
                    789 | Nike    | 1
                    790 | Adidas  | 1
                    791 | Puma    | 1
  
  Seller changes email → update ONE row in sellers → all orders updated. ✅</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — When to Normalise",
          body: `<p>Normalise for systems that update the same data frequently and where data integrity is critical (e.g., product details, seller profiles, user accounts). The first three normal forms (1NF, 2NF, 3NF) cover 99% of practical cases: eliminate repeating groups (1NF), eliminate partial dependencies (2NF), eliminate transitive dependencies (3NF). Beyond 3NF, the gains diminish and the join complexity increases. Start normalised — you can always selectively denormalise for performance where measurements show it's needed.</p>`,
        },
      ],
    },

    {
      id: "p4t20",
      title: "Denormalization",
      subtitle:
        "Strategic redundancy for read performance — when joins cost too much.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Denormalisation</strong> is the deliberate introduction of redundancy into a database schema to improve read performance. You store the same data in multiple places to avoid expensive joins. This improves query speed at the cost of increased storage, write complexity, and potential data inconsistency.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Denormalization Examples",
          body: `<div class="diagram-box">Example 1 — Pre-computed ratings:
  Normalised (slow): 
    SELECT AVG(rating), COUNT(*) FROM reviews WHERE product_id = 1;
    → Aggregates across millions of reviews each time. 50ms+ for popular products.
  
  Denormalised (fast):
    products table adds: avg_rating DECIMAL(3,2), review_count INTEGER
    Updated by trigger or after each new review INSERT.
    SELECT avg_rating, review_count FROM products WHERE id = 1;
    → 1ms single-column read ✅

Example 2 — Order snapshot (intentional denorm):
  order_items stores product price AT TIME OF ORDER:
  order_items: product_id=1, quantity=1, price=7999  ← price snapshot
  
  Even if products.price changes to 8999 tomorrow,
  Rahul's order history correctly shows the price he paid.
  Historical accuracy requires this denormalisation!

Example 3 — Username in comments (NoSQL-style):
  Instead of joining users table for display name:
  comments: { user_id: 42, username: "rahul_s", text: "..." }
  If username changes → must update all past comments (acceptable trade-off)</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>The rule: <strong>normalise first, denormalise with precision</strong>. Start with a well-normalised schema. Measure query performance with realistic production data volumes. Identify the specific slow queries that matter. Denormalise only those cases, document why the redundancy exists, and create application logic to keep the redundant data consistent. Random denormalisation without measurement creates schemas that are slow AND inconsistent — worst of both worlds.</p>`,
        },
      ],
    },

    {
      id: "p4t21",
      title: "Soft Deletes",
      subtitle:
        "Keeping deleted data for audits and recovery — without ever really deleting it.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>soft delete</strong> marks a record as deleted using a flag or timestamp column instead of physically removing the row with DELETE. The row stays in the database but is excluded from normal queries. Hard deletes (physical DELETE) permanently destroy data and are usually inappropriate for business data.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Soft Delete Pattern",
          body: `<div class="diagram-box">products table with soft delete:
  ALTER TABLE products ADD COLUMN deleted_at TIMESTAMPTZ;  ← NULL = active

Soft delete:
  UPDATE products SET deleted_at = NOW() WHERE id = 1;
  (not: DELETE FROM products WHERE id = 1)

Queries must exclude deleted records:
  SELECT * FROM products WHERE deleted_at IS NULL;  ← active products only

Even better — PostgreSQL Row Level Security or Views:
  CREATE VIEW active_products AS
    SELECT * FROM products WHERE deleted_at IS NULL;
  
  Application only queries active_products view ← can't accidentally show deleted

Benefits of soft delete:
  ✅ Undelete: UPDATE products SET deleted_at = NULL WHERE id = 1;
  ✅ Audit trail: when was this deleted?
  ✅ Foreign key integrity: order_items.product_id still points to valid row
  ✅ Compliance: GDPR deletion can be a flag, with actual purge on schedule
  ✅ Business analytics: include deleted products in historical revenue reports

Challenges:
  ⚠️ Every query needs WHERE deleted_at IS NULL — easy to forget
  ⚠️ UNIQUE constraints may break: if product with SKU "NIKE-001" is soft-deleted,
     can't add new product with same SKU (unique constraint still applies)
  Solution: Use partial UNIQUE index: CREATE UNIQUE INDEX ON products(sku) 
     WHERE deleted_at IS NULL;</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Data Lifecycle</div><div class="interview-q">Mention soft deletes and data retention in any system design involving user content or business records: "We use soft deletes with a deleted_at timestamp. Deleted data is retained for 90 days for recovery and compliance, then purged by a scheduled job. Foreign key references remain valid until purge. We use database views to automatically exclude deleted records from normal queries." This shows mature thinking about data lifecycle.</div></div>`,
        },
      ],
    },

    {
      id: "p4t22",
      title: "Audit Columns",
      subtitle:
        "Recording who changed what and when — the metadata that saves investigations.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Audit columns</strong> are standard columns added to every table to track creation and modification metadata: who created a record, when it was created, who last modified it, and when. They answer the inevitable production questions: "When was this order created?", "Who changed this product price?", "When did this user's status change?"</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Standard Audit Column Pattern",
          body: `<div class="diagram-box">Standard columns on EVERY ShopKart table:

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  created_by  INTEGER REFERENCES users(id)       ← user who created
  updated_by  INTEGER REFERENCES users(id)       ← user who last updated

PostgreSQL auto-update trigger for updated_at:
  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  
  CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

For critical tables (prices, financial data): Full Audit Log table:
  CREATE TABLE product_price_history (
    id          SERIAL PRIMARY KEY,
    product_id  INTEGER NOT NULL,
    old_price   DECIMAL(10,2),
    new_price   DECIMAL(10,2),
    changed_by  INTEGER REFERENCES users(id),
    changed_at  TIMESTAMPTZ DEFAULT NOW(),
    reason      TEXT
  );

Trigger populates history on every UPDATE to products.price.</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Audit columns should be treated as non-negotiable for any business-critical table. The cost is negligible (a few bytes per row). The value becomes apparent the first time: a customer disputes a charge ("the price was listed as X"), a compliance audit requires records of changes, a bug causes data corruption and you need to know what changed when, a support case requires knowing when an order status changed. Add these columns at table creation — retrofitting them onto 100M-row tables is painful. Many teams use database ORM base models that include audit columns automatically.</p>`,
        },
      ],
    },

    {
      id: "p4t23",
      title: "Multi-Tenancy Patterns",
      subtitle:
        "How SaaS products serve multiple customers from a single shared database.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Multi-tenancy</strong> is an architecture where a single instance of a system serves multiple customers (tenants). For a B2B product like "ShopKart Seller Platform", each merchant is a tenant. Data from different merchants must be isolated — merchant A cannot see merchant B's orders. There are three main multi-tenancy database models.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Three Multi-tenancy Models",
          body: `<table class="compare-table"><thead><tr><th>Model</th><th>Structure</th><th>Isolation</th><th>Cost</th></tr></thead><tbody>
<tr><td><strong>Separate Database</strong></td><td>Each tenant gets their own DB instance</td><td>Complete (separate DB)</td><td>High ($$$ per tenant)</td></tr>
<tr><td><strong>Separate Schema</strong></td><td>One DB, each tenant has their own schema (set of tables)</td><td>Strong (schema separation)</td><td>Medium</td></tr>
<tr><td><strong>Shared Schema (tenant_id)</strong></td><td>All tenants share tables, every row has tenant_id column</td><td>Logical only (app enforced)</td><td>Low (most scalable)</td></tr>
</tbody></table>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart B2B Platform (Shared Schema)",
          body: `<div class="diagram-box">Every table has tenant_id (seller_id):

  CREATE TABLE seller_products (
    id         SERIAL PRIMARY KEY,
    seller_id  INTEGER NOT NULL REFERENCES sellers(id),  ← tenant discriminator
    name       VARCHAR(200) NOT NULL,
    price      DECIMAL(10,2),
    ...
  );
  
  CREATE INDEX ON seller_products(seller_id);  ← critical for performance!
  
  ROW LEVEL SECURITY (PostgreSQL feature):
  ALTER TABLE seller_products ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY seller_isolation ON seller_products
    USING (seller_id = current_setting('app.current_seller_id')::INTEGER);
    ← PostgreSQL automatically adds AND seller_id = X to every query
    ← Even if app forgets WHERE clause, data leakage is prevented at DB level
  
  Application sets context before each query:
  SET LOCAL app.current_seller_id = 42;
  SELECT * FROM seller_products;  ← automatically filtered to seller 42 only</div>`,
        },
      ],
    },

    {
      id: "p4t24",
      title: "N+1 Query Problem",
      subtitle:
        "The most common performance anti-pattern in ORMs — hidden in plain sight.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>The <strong>N+1 query problem</strong> occurs when code executes 1 query to fetch a list of N items, then executes N additional queries to fetch related data for each item — N+1 total queries instead of 1-2. This pattern massively degrades performance and is the #1 database performance issue in applications using ORMs.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "The Problem in Code",
          body: `<div class="diagram-box">❌ N+1 Problem — ShopKart order list with product names:

JavaScript with ORM (Sequelize / TypeORM):
  const orders = await Order.findAll({ where: { userId: 42 } });
  // ↑ 1 query: SELECT * FROM orders WHERE user_id = 42 → 15 orders
  
  for (const order of orders) {
    const items = await OrderItem.findAll({ where: { orderId: order.id } });
    // ↑ 15 queries: one per order!
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      // ↑ N more queries: one per order item!
    }
  }
  
  Total queries: 1 + 15 + (15 × avg_items_per_order)
  If avg 3 items/order: 1 + 15 + 45 = 61 queries instead of 1!
  
✅ SOLUTION — Eager loading (JOIN):
  const orders = await Order.findAll({
    where: { userId: 42 },
    include: [
      { model: OrderItem, include: [{ model: Product }] }
    ]
  });
  // Generates: SELECT orders.*, order_items.*, products.*
  //            FROM orders
  //            JOIN order_items ON ...
  //            JOIN products ON ...
  //            WHERE orders.user_id = 42
  // → 1 query instead of 61!

Raw SQL alternative (most performant):
  SELECT o.id, oi.product_id, p.name, oi.quantity, oi.price
  FROM orders o
  JOIN order_items oi ON o.id = oi.order_id
  JOIN products p ON oi.product_id = p.id
  WHERE o.user_id = 42;</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Detection",
          body: `<p>N+1 problems are invisible in development (small data, fast local DB) and catastrophic in production (millions of rows, real network latency). Tools to detect: <strong>ORM query logging</strong> (enable in development — if you see 200 near-identical queries in one request, you have N+1), <strong>DataDog</strong>/<strong>New Relic</strong> APM tools that track queries per request, <strong>pg_stat_statements</strong> for per-query statistics in PostgreSQL.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Performance Analysis</div><div class="interview-q">N+1 is commonly asked about in backend interviews. "We use eager loading in our ORM to pre-fetch related data in the same query. For complex reporting queries, we write raw SQL with specific JOINs. We also monitor queries per request in our APM tool — any endpoint doing more than 5 DB queries per request is investigated for N+1 patterns."</div></div>`,
        },
      ],
    },

    {
      id: "p4t25",
      title: "EXPLAIN ANALYZE",
      subtitle:
        "Seeing exactly how PostgreSQL executes your query — the key to diagnosis and optimisation.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><code>EXPLAIN ANALYZE</code> is a PostgreSQL command that executes a query and shows: the execution plan (how PostgreSQL decided to retrieve data — which indexes it used, which joins it performed, in what order), the actual execution time for each step, and the number of rows processed. It's the primary tool for diagnosing slow queries.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Reading EXPLAIN Output",
          body: `<div class="diagram-box">EXPLAIN ANALYZE
SELECT id, total, status FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 10;

Output (read bottom-up — innermost operations first):
                                                     QUERY PLAN
──────────────────────────────────────────────────────────────────────────────
 Limit  (cost=0.56..2.45 rows=10 width=20) (actual time=0.082..0.103 rows=10)
   ->  Index Scan Backward using idx_orders_user_created  ← USING INDEX ✅
         on orders  (cost=0.56..28.32 rows=145 width=20)
         (actual time=0.079..0.098 rows=10)
       Index Cond: (user_id = 42)
       Filter: (status IS NOT NULL)
       Rows Removed by Filter: 0
 Planning Time: 0.312 ms
 Execution Time: 0.135 ms  ← very fast, using index properly

BAD output (no index):
   ->  Seq Scan on orders  ← SEQUENTIAL SCAN = reading entire table ❌
         (cost=0.00..45231.00 rows=50000000 width=20)
         (actual time=0.012..8423.112 rows=15)  ← 8 seconds!
       Filter: (user_id = 42)
       Rows Removed by Filter: 49999985  ← scanned 50M rows to find 15!</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Key Terms in EXPLAIN Output",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">🔑</div><div><strong>Seq Scan:</strong> Reading entire table row by row. Almost always means a missing index for that query. Red flag for large tables.</div></div>
  <div class="key-item"><div class="key-bullet">🔑</div><div><strong>Index Scan:</strong> Using a B-tree index. Good. Jumps directly to matching rows.</div></div>
  <div class="key-item"><div class="key-bullet">🔑</div><div><strong>Index Only Scan:</strong> All needed columns in the index itself. Best — doesn't even read the table. Requires covering indexes.</div></div>
  <div class="key-item"><div class="key-bullet">🔑</div><div><strong>Hash Join / Merge Join:</strong> Join algorithms. Hash join is typically faster for large tables.</div></div>
  <div class="key-item"><div class="key-bullet">🔑</div><div><strong>Rows Removed by Filter:</strong> Large number = index isn't selective enough, or wrong index. Filtering happened after index scan instead of during.</div></div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Query Tuning Process",
          body: `<p>Systematic database performance process: (1) Enable slow query logging: <code>log_min_duration_statement = 100</code> (log queries over 100ms). (2) Identify the top 5 slowest queries. (3) Run EXPLAIN ANALYZE on each. (4) Look for: Seq Scan on large tables, high "Rows Removed by Filter", sort steps (filesort) that could use an index. (5) Create targeted indexes. (6) Re-run EXPLAIN ANALYZE to verify the plan improved. (7) Verify production query times drop. This iterative process is how professional DBAs tune databases — not guessing at indexes.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Database Diagnosis</div><div class="interview-q">When asked about performance debugging: "First I'd enable slow query logging and identify the problematic queries. Then I'd run EXPLAIN ANALYZE — looking for sequential scans on large tables. If I see a Seq Scan with Rows Removed by Filter in the millions, that column needs an index. I'd add a targeted index and re-run EXPLAIN to verify the plan switches to an Index Scan. We'd also check for N+1 patterns using APM tools." This shows a data-driven diagnostic approach.</div></div>`,
        },
      ],
    },
  ],
};

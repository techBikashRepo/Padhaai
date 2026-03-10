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
          body: `<p style="margin-bottom:12px;">A <strong>table</strong> is like a spreadsheet grid with strict rules — each <strong>row</strong> is one entity (one product, one order, one user), each <strong>column</strong> is one property (name, price, stock). The intersection is a single value. Unlike a spreadsheet, the database enforces strict types, nullability, and uniqueness on every cell.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Database Tables",
          body: `<p style="margin-bottom:10px;font-size:13px;">Three core tables and their relationships at a glance:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
products: id | name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| price | stock | category<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1 | Nike Air Max 270&nbsp;&nbsp;| 7999&nbsp; | 150&nbsp;&nbsp; | footwear<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2 | Adidas Ultraboost | 9999&nbsp; | 87&nbsp;&nbsp;&nbsp; | footwear<br/><br/>
users: id | name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | created_at<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 42 | Rahul Sharma | rahul@example.com | 2025-06-01<br/><br/>
orders: id&nbsp; | user_id | total | status&nbsp;&nbsp;&nbsp; | created_at<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 789 | 42&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 7999&nbsp; | delivered | 2026-01-20<br/><br/>
Each row = 1 entity. Each column = 1 property. Schema enforces types.<br/>
orders.user_id is a FK → references users.id (enforced by DB).
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;margin-bottom:12px;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Table design is the highest-leverage decision in a database. Get the schema wrong and you'll fight it for years. Key question: does shipping_address belong as columns in orders, or as a separate addresses table? Separate table allows reuse across orders and wishlists — but adds a JOIN. Decide based on update patterns: if the same address appears in 100 orders, normalise it.</span>
</div>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">When designing tables in a system design interview, always state column types (INT vs UUID, VARCHAR length, DECIMAL precision), nullability, and unique constraints explicitly. Interviewers look for this rigour. A schema without a PRIMARY KEY or without NOT NULL constraints signals inexperience.</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Schema Design Decisions",
          body: `<p style="margin-bottom:12px;">Schema design questions to ask for every table: What is the right granularity? Should <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">shipping_address</code> be columns in orders or a separate table? (Separate if addresses are reused; inline if they're always order-specific snapshots.) What data types? (Using <code>VARCHAR(255)</code> for a 6-digit PIN wastes space and skips validation.) What indexes will common queries need? These decisions compound — they affect query patterns, index efficiency, and application complexity for the life of the system.</p>`,
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
          body: `<p style="margin-bottom:12px;">A <strong>SELECT</strong> statement retrieves data from one or more tables. Structure: <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">SELECT columns FROM table WHERE conditions ORDER BY column LIMIT n</code>. The WHERE clause filters rows. Without WHERE, ALL rows are returned — catastrophic on 50M-row tables. SELECT is the foundation of every data-reading operation in SQL.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart SELECT Examples",
          body: `<p style="margin-bottom:10px;font-size:13px;">Real queries from ShopKart's codebase — notice how each is precise about which columns it needs:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
-- Footwear under ₹10K with stock<br/>
SELECT id, name, price, stock<br/>
FROM products<br/>
WHERE category = 'footwear' AND price &lt; 10000 AND stock &gt; 0;<br/><br/>
-- Rahul's 10 most recent orders<br/>
SELECT id, total, status, created_at<br/>
FROM orders WHERE user_id = 42<br/>
ORDER BY created_at DESC LIMIT 10;<br/><br/>
-- Count orders by status (for dashboard)<br/>
SELECT status, COUNT(*) AS order_count<br/>
FROM orders GROUP BY status;<br/><br/>
-- Search by name (case-insensitive)<br/>
SELECT id, name, price FROM products<br/>
WHERE LOWER(name) LIKE '%running%';
</div>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ The SELECT * Anti-Pattern</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">SELECT * FROM products</code> fetches all columns including large ones (description: 2KB, images: 5KB JSON array) when you may only need name + price. (1) Wastes I/O, network, memory. (2) Schema changes (adding a column) break code relying on column order. (3) Makes index-only scans impossible.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Always name your columns explicitly</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Enables index-only scans</span>
    </div>
    <div style="margin-top:10px;font-size:12px;color:#ef4444;font-weight:600;">📌 Exception: internal scripts/migrations where column count doesn't matter</div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p style="margin-bottom:12px;">SELECT performance is primarily driven by: (1) <strong>Indexes</strong> — the WHERE and ORDER BY columns must be indexed. (2) <strong>Column selection</strong> — narrow projections enable index-only scans (zero table reads). (3) <strong>Cardinality</strong> — how selective is the filter? A WHERE on user_id (high cardinality: millions of users) benefits enormously from an index. A WHERE on is_active (low cardinality: true/false) may not.</p>`,
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
          body: `<p style="margin-bottom:12px;"><strong>ORDER BY</strong> sorts results by one or more columns (ASC or DESC). <strong>LIMIT</strong> caps the number of rows returned. Together they power every sorted, paginated view in ShopKart: product listings, order history, admin dashboards. Without ORDER BY, PostgreSQL returns rows in <em>undefined</em> order — which shifts between queries as storage changes.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Sorting & Pagination Examples",
          body: `<p style="margin-bottom:10px;font-size:13px;">Sorting and pagination patterns used across ShopKart's frontend:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
-- Products page, sorted by rating, page 1<br/>
SELECT id, name, price, avg_rating FROM products<br/>
WHERE category = 'footwear'<br/>
ORDER BY avg_rating DESC, price ASC  -- multi-column sort<br/>
LIMIT 20 OFFSET 0;<br/><br/>
-- Page 2: LIMIT 20 OFFSET 20 (offset pagination)<br/><br/>
-- Admin: most recent 50 orders<br/>
SELECT id, user_id, total, status, created_at FROM orders<br/>
ORDER BY created_at DESC LIMIT 50;<br/><br/>
-- Seller leaderboard: top 10 by this month's revenue<br/>
SELECT seller_id, SUM(total) AS revenue FROM orders<br/>
WHERE status = 'delivered' AND created_at &gt;= '2026-01-01'<br/>
GROUP BY seller_id ORDER BY revenue DESC LIMIT 10;
</div>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">⚠️ Offset Pagination Performance Trap</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">OFFSET 1000000 in a 10M-row table means PostgreSQL skips 1,000,000 rows before returning 20 — extremely slow. Use cursor-based pagination instead: <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">WHERE created_at &lt; :last_cursor ORDER BY created_at DESC LIMIT 20</code> — always O(log n) with an index.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--accent);margin-bottom:4px;">✅ Best Practice</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Use offset pagination for admin tools (few pages, low volume). Use cursor-based pagination for user-facing feeds (infinite scroll, millions of rows).</p>
    <div style="margin-top:10px;font-size:12px;color:var(--accent);font-weight:600;">📌 Index ORDER BY columns — sorts on unindexed columns are O(n log n) filesorts</div>
  </div>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">A composite index on (user_id, created_at DESC) lets the query <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">WHERE user_id = 42 ORDER BY created_at DESC LIMIT 10</code> execute with zero additional sort step — the data is pre-sorted in the index. This single index transforms an 8-second query to 0.3ms.</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p style="margin-bottom:12px;">LIMIT without ORDER BY in production is dangerous — it returns arbitrary, non-deterministic rows that change between deployments as PostgreSQL's physical storage reorganises. A ShopKart feature that "shows recent orders" without ORDER BY will silently return random orders once the table grows. Always specify ORDER BY when the order matters (which is almost always in user-facing queries).</p>`,
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
          body: `<p style="margin-bottom:12px;"><strong>GROUP BY</strong> collapses multiple rows sharing the same column value into one summary row, enabling <strong>aggregate functions</strong> (COUNT, SUM, AVG, MIN, MAX) to compute statistics per group. Every analytics query, dashboard metric, and business report in ShopKart runs on GROUP BY aggregations.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Analytics Queries",
          body: `<p style="margin-bottom:10px;font-size:13px;">Real GROUP BY queries powering ShopKart's analytics dashboard:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
-- Revenue by category this month<br/>
SELECT p.category, SUM(oi.price * oi.quantity) AS revenue<br/>
FROM order_items oi<br/>
JOIN products p ON oi.product_id = p.id<br/>
JOIN orders o ON oi.order_id = o.id<br/>
WHERE o.status = 'delivered'<br/>
  AND o.created_at &gt;= DATE_TRUNC('month', NOW())<br/>
GROUP BY p.category ORDER BY revenue DESC;<br/><br/>
-- Daily order volume + revenue for a 30-day chart<br/>
SELECT DATE(created_at) AS day,<br/>
       COUNT(*) AS orders,<br/>
       SUM(total) AS revenue,<br/>
       AVG(total) AS avg_order_value<br/>
FROM orders<br/>
WHERE created_at &gt;= NOW() - INTERVAL '30 days'<br/>
GROUP BY day ORDER BY day;
</div>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">WHERE vs HAVING — The Key Difference</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">WHERE</code> filters individual rows <em>before</em> grouping. <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">HAVING</code> filters groups <em>after</em> aggregation.</p>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
-- Categories with &gt;5 low-stock products:<br/>
SELECT category, COUNT(*) AS low_stock FROM products<br/>
WHERE stock &lt; 10                    -- filter rows first<br/>
GROUP BY category<br/>
HAVING COUNT(*) &gt; 5;               -- filter groups after<br/><br/>
-- WRONG: WHERE COUNT(*) &gt; 5 → ERROR (can't aggregate in WHERE)
    </div>
    <div style="margin-top:10px;font-size:12px;color:var(--accent);font-weight:600;">📌 Rule: WHERE on columns → HAVING on aggregates</div>
  </div>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">GROUP BY on 50M order rows runs for minutes without the right indexes. Pre-compute aggregated summaries in materialised views or a daily snapshot table. ShopKart's analytics dashboard reads from a pre-aggregated daily_revenue table — not the raw orders table.</span>
</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "WHERE vs HAVING",
          body: `<p style="margin-bottom:12px;">This is one of the most commonly tested SQL distinctions in interviews. Rule: <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">WHERE</code> filters rows before grouping (operates on raw row data). <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">HAVING</code> filters after aggregation (operates on group statistics). You cannot use aggregate functions in a WHERE clause — that's a syntax error.</p>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Interviewers frequently test this: "Find users who placed more than 5 orders." Answer: <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">SELECT user_id, COUNT(*) FROM orders GROUP BY user_id HAVING COUNT(*) > 5</code>. Using WHERE COUNT(*) > 5 is a syntax error — the error message to mention in the interview.</span>
</div>`,
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
          body: `<p style="margin-bottom:12px;">Aggregate functions perform calculations across multiple rows and return a single result. The five core functions: <strong>COUNT</strong> — how many rows, <strong>SUM</strong> — total of a numeric column, <strong>AVG</strong> — arithmetic mean, <strong>MIN</strong> — smallest value, <strong>MAX</strong> — largest value. Every KPI in ShopKart's analytics dashboard is computed with these five functions.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Business Metrics",
          body: `<p style="margin-bottom:10px;font-size:13px;">ShopKart's entire dashboard is powered by these five functions:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
SELECT<br/>
  COUNT(*)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   AS total_orders,<br/>
  COUNT(DISTINCT user_id)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   AS unique_customers,<br/>
  SUM(total)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  AS gross_revenue,<br/>
  AVG(total)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  AS avg_order_value,<br/>
  MIN(total)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  AS smallest_order,<br/>
  MAX(total)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  AS largest_order<br/>
FROM orders<br/>
WHERE status = 'delivered' AND created_at &gt;= '2026-01-01';<br/><br/>
-- COUNT(*) vs COUNT(coupon_id):<br/>
-- COUNT(*) counts ALL rows including NULLs<br/>
-- COUNT(coupon_id) counts only non-NULL coupon rows<br/>
-- → shows exactly how many orders used a coupon<br/><br/>
-- Product rating stats (needs &gt;=10 reviews):<br/>
SELECT product_id,<br/>
  COUNT(*) AS review_count,<br/>
  AVG(rating) AS avg_rating,<br/>
  MIN(rating) AS worst, MAX(rating) AS best<br/>
FROM reviews GROUP BY product_id HAVING COUNT(*) &gt;= 10;
</div>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">COUNT(*) vs COUNT(column) — Critical Distinction</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(99,102,241,0.1);color:var(--accent);padding:3px 8px;border-radius:5px;">COUNT(*) → counts ALL rows (including NULLs)</span>
      <span style="background:rgba(16,185,129,0.1);color:#10b981;padding:3px 8px;border-radius:5px;">COUNT(col) → counts only non-NULL col values</span>
    </div>
    <div style="margin-top:10px;font-size:12px;color:var(--accent);font-weight:600;">📌 Use COUNT(coupon_id) to count orders WITH a coupon; COUNT(*) for total orders</div>
  </div>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;margin-bottom:12px;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Never run complex aggregates on raw 50M-row tables in real-time. Pre-compute: a nightly job stores avg_rating and review_count on products table — one column read instead of AVG across millions of reviews. Real-time dashboards use streaming aggregation (Kafka + Flink). Pre-compute vs query live is a fundamental architect decision.</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Pre-compute Aggregates",
          body: `<p style="margin-bottom:12px;">ShopKart cannot run <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">SELECT AVG(rating) FROM reviews WHERE product_id = 1</code> on every product page load when reviews table has 500M rows. Solution: store <code>avg_rating</code> and <code>review_count</code> directly on the products table, updated by a trigger (or background job) after each new review. Single-column read at query time. The trade-off: slight staleness (OK for reviews) vs exact real-time accuracy (required for inventory counts).</p>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">When designing analytics in any system: "For real-time aggregates like active user counts, I'd use Redis INCR. For historical aggregates like daily revenue, I'd use a pre-computed summary table refreshed hourly. Running GROUP BY + SUM on 50M rows for every dashboard load doesn't scale."</span>
</div>`,
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
          body: `<p style="margin-bottom:12px;">A <strong>primary key</strong> uniquely identifies every row in a table. No two rows share the same value. Every table should have one. Primary keys are automatically indexed — lookups by ID are always fast. Three strategies: integers (1, 2, 3...), UUID v4 (random), and UUID v7/ULID (time-ordered).</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Primary Key Strategies",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🔵 SERIAL / BIGSERIAL (Auto-increment)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">ID: 1, 2, 3, 4... Sequential integers. Compact (8 bytes), index-friendly (clustered sequential writes = no fragmentation), human-readable in admin UIs.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Compact — smallest index size</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Predictable — reveals business volume</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Cross-DB merge conflicts in distributed systems</span>
    </div>
    <div style="margin-top:10px;font-size:12px;color:var(--accent);font-weight:600;">📌 Use for: internal join tables, high-write tables where index efficiency matters most</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:#10b981;margin-bottom:4px;">🟢 UUID v4 (random)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">ID: a3f2b1c4-d5e6-... 128-bit random globally unique. Safe to generate client-side without DB coordination. No enumeration attacks.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Globally unique — no coordination</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Random inserts cause B-tree fragmentation</span>
    </div>
    <div style="margin-top:10px;font-size:12px;color:#10b981;font-weight:600;">📌 Use for: user-facing IDs in URLs where you don't want to expose record count</div>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:#8b5cf6;margin-bottom:4px;">🟣 UUID v7 / ULID (time-ordered)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Starts with a timestamp prefix, globally unique, inserts sequentially (no fragmentation). Best of both worlds.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Globally unique + time-ordered = no fragmentation</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Newer — less tooling support vs UUID v4</span>
    </div>
    <div style="margin-top:10px;font-size:12px;color:#8b5cf6;font-weight:600;">📌 Use for: high-scale distributed systems where both uniqueness and insert performance matter</div>
  </div>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;margin-bottom:12px;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">ShopKart uses serial integers for internal join tables (order_items, product_categories) for index efficiency. Uses UUIDs for user-facing IDs in URLs (GET /orders/:uuid) to prevent enumeration attacks — sequential IDs reveal order volume and enable bulk data scraping.</span>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Using Email or Phone as Primary Key</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">These change. When Rahul updates his email, every foreign key referencing users.email in orders, reviews, and sessions must cascade-update. Mutable data as primary key cascades updates across the entire schema. Always use immutable surrogate keys.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Exposing Sequential Integer IDs in Public URLs</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">GET /orders/1234 tells competitors you've processed 1,234 orders. Iterating from 1 to 9999 scrapes all your orders. Competitors extract your business volume, pricing, and customer patterns. Use UUIDs in any externally visible URL.</p>
  </div>
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
          body: `<p style="margin-bottom:12px;">A <strong>foreign key</strong> is a column that references the primary key of another table. It's the glue of relational databases — enforcing that relationships between records are valid. You cannot create an order for a non-existent user; you cannot delete a product that exists in active order_items. The database enforces these rules automatically.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Relationships",
          body: `<p style="margin-bottom:10px;font-size:13px;">FK constraints in action across ShopKart's core tables:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
orders: user_id → FK → references users(id)<br/>
order_items: order_id → FK → references orders(id) ON DELETE CASCADE<br/>
order_items: product_id → FK → references products(id)<br/><br/>
-- Referential integrity enforced:<br/>
INSERT INTO orders (user_id=42) → OK (user 42 exists)<br/>
INSERT INTO orders (user_id=999) → ERROR: user 999 doesn't exist<br/>
DELETE FROM users WHERE id=42 → ERROR: user has orders<br/><br/>
-- ON DELETE CASCADE behavior:<br/>
DELETE FROM orders WHERE id=789<br/>
→ also deletes all order_items for order 789 automatically<br/><br/>
-- DANGER: ON DELETE SET NULL on order_items.product_id<br/>
→ historical order loses its product reference<br/>
→ use soft deletes on products instead!<br/>
UPDATE products SET deleted_at = NOW() WHERE id = 1;  -- safer
</div>

<div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;margin-bottom:14px;">
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Prevents orphaned records</span>
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Documents relationships in schema</span>
  <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Adds overhead on FK columns (index required)</span>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">At extreme write scales (millions of inserts/second), FK checks add measurable overhead — each insert triggers a lookup in the referenced table. Shopify-scale platforms disable FK constraints in the database and enforce integrity in application code + integration tests. For ShopKart at 100K orders/day, FK constraints are absolutely worth it.</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — FK Trade-offs in Scale",
          body: `<p style="margin-bottom:12px;">The FK integrity vs write throughput trade-off is real. FK constraints verify referenced rows exist on every INSERT — at 10K inserts/second into order_items, that's 10K lookups in orders and products per second just for integrity checks. For most systems this is fine. For Shopify-scale, teams enforce integrity at the application layer and use integration tests to catch violations. The decision point is measured, not guessed: benchmark FK constraints under your actual write load.</p>`,
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
          body: `<p style="margin-bottom:12px;">A <strong>JOIN</strong> combines rows from two or more tables based on a related column. Rather than storing all data in one flat table (which creates duplication), SQL stores data normalised across tables and JOIN them at query time. <strong>INNER JOIN</strong>: only rows that match on both sides. <strong>LEFT JOIN</strong>: all rows from the left table, NULL for non-matching right rows.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart JOIN Examples",
          body: `<p style="margin-bottom:10px;font-size:13px;">Three JOIN patterns used daily in ShopKart's backend:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
-- Rahul's order history with product names<br/>
SELECT o.id, o.created_at, p.name, oi.quantity, oi.price<br/>
FROM orders o<br/>
INNER JOIN order_items oi ON o.id = oi.order_id<br/>
INNER JOIN products p ON oi.product_id = p.id<br/>
WHERE o.user_id = 42 ORDER BY o.created_at DESC;<br/><br/>
-- LEFT JOIN: all products + review count (includes 0-review products)<br/>
SELECT p.name, COUNT(r.id) AS reviews, AVG(r.rating) AS rating<br/>
FROM products p<br/>
LEFT JOIN reviews r ON p.id = r.product_id<br/>
GROUP BY p.id, p.name ORDER BY rating DESC NULLS LAST;<br/><br/>
-- Find users who NEVER placed an order (LEFT JOIN + NULL trick)<br/>
SELECT u.id, u.name, u.email FROM users u<br/>
LEFT JOIN orders o ON u.id = o.user_id<br/>
WHERE o.id IS NULL;  -- o.id is NULL = no matching order
</div>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">INNER vs LEFT JOIN Visualised</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
users: 42=Rahul, 43=Priya, 44=Amit (no orders)<br/>orders: 789=user42, 790=user42<br/><br/>
INNER JOIN: 42|Rahul|789 · 42|Rahul|790 (Amit excluded)<br/>
LEFT JOIN:&nbsp; 42|Rahul|789 · 42|Rahul|790 · 44|Amit|NULL
    </div>
  </div>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Every column in an ON clause must be indexed. <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">ON orders.user_id = users.id</code> requires an index on orders.user_id (users.id is already the PK). A three-table JOIN without indexes on join columns can add 10+ seconds to a request. Index every FK column.</span>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Join Type Visual",
          body: `<p style="margin-bottom:10px;font-size:13px;">When to use each join type:</p>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;">
    <div style="font-weight:700;">Join Type</div>
    <div style="font-weight:700;">Returns</div>
    <div style="font-weight:700;">ShopKart Use Case</div>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
    <div style="font-weight:600;">INNER JOIN</div>
    <div>Only matching rows from both</div>
    <div>Order items with product details</div>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
    <div style="font-weight:600;">LEFT JOIN</div>
    <div>All left rows + matches</div>
    <div>All products with review counts (includes 0)</div>
  </div>
  <div style="padding:12px 16px;font-size:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
    <div style="font-weight:600;">FULL OUTER</div>
    <div>All rows from both sides</div>
    <div>Data migration reconciliation</div>
  </div>
</div>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"The LEFT JOIN + WHERE right_table.id IS NULL pattern finds records in table A with no match in table B. It's the SQL idiom for 'find users who never X' or 'find products never ordered.' Alternative: NOT EXISTS or NOT IN subquery — but LEFT JOIN is typically most efficient."</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — JOIN Performance",
          body: `<p style="margin-bottom:12px;">When JOINs become too expensive (joining 10M-row products with 500M-row reviews), consider <strong>denormalisation</strong>: store avg_rating and review_count directly on the products table, updated after each review. Trades redundancy for zero-join reads. The JOIN cost of running <code>AVG(rating) FROM reviews WHERE product_id = 1</code> on every product page load is unacceptable at scale — pre-compute and cache.</p>`,
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
          body: `<p style="margin-bottom:12px;">A <strong>many-to-many relationship</strong> exists when records in table A each relate to many records in B, AND records in B each relate to many records in A. One product → many categories; one category → many products. SQL can't model this directly — it requires a <strong>junction table</strong> in between that holds pairs of foreign keys.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Junction Tables",
          body: `<p style="margin-bottom:10px;font-size:13px;">Junction tables are everywhere in ShopKart's schema — here's the canonical pattern:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
-- WRONG: comma-separated category IDs (never do this!)<br/>
products: category_ids = "1,3,5"  -- can't JOIN, can't index<br/><br/>
-- CORRECT: junction table<br/>
CREATE TABLE product_categories (<br/>
  product_id  INT REFERENCES products(id),<br/>
  category_id INT REFERENCES categories(id),<br/>
  PRIMARY KEY (product_id, category_id)  -- composite PK<br/>
);<br/><br/>
-- Nike Air Max is in footwear + running + sports<br/>
product_id=1, category_id=1  (Nike → footwear)<br/>
product_id=1, category_id=3  (Nike → running)<br/>
product_id=1, category_id=5  (Nike → sports)<br/><br/>
-- All products in "running" category:<br/>
SELECT p.name FROM products p<br/>
JOIN product_categories pc ON p.id = pc.product_id<br/>
JOIN categories c ON pc.category_id = c.id<br/>
WHERE c.name = 'running';
</div>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:#10b981;margin-bottom:6px;">Junction Tables with Extra Columns</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">When the junction itself has meaningful attributes, it becomes a first-class entity. <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">order_items</code> is a junction between orders and products, but it also has quantity, price (snapshot), and discount_applied — making it its own domain entity, not just a linking table.</p>
    <div style="margin-top:10px;font-size:12px;color:#10b981;font-weight:600;">📌 ShopKart junction tables: product_categories, order_items, cart_items, user_roles, seller_products</div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p style="margin-bottom:12px;">Junction tables are the correct modelling for many-to-many in SQL. The anti-pattern (comma-separated IDs in a VARCHAR column) is a classic schema mistake that shows up in interviews. Test: "One product can be in many categories. How do you model this?" The correct answer is a junction table with a composite primary key — never a comma-separated string column.</p>`,
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
          body: `<p style="margin-bottom:12px;"><strong>Constraints</strong> are rules encoded in the schema that every INSERT and UPDATE must satisfy. They are the database's last line of defence for data integrity — independent of application code. Types: NOT NULL (column required), UNIQUE (no duplicate values), CHECK (must satisfy a condition), DEFAULT (value if not specified), FOREIGN KEY (referential integrity).</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Schema with Constraints",
          body: `<p style="margin-bottom:10px;font-size:13px;">Every constraint type in use across ShopKart's core tables:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
CREATE TABLE products (<br/>
  id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  SERIAL PRIMARY KEY,<br/>
  name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VARCHAR(200) NOT NULL,<br/>
  price&nbsp;&nbsp;&nbsp;&nbsp; DECIMAL(10,2) NOT NULL CHECK (price &gt; 0),<br/>
  stock&nbsp;&nbsp;&nbsp;&nbsp; INTEGER NOT NULL DEFAULT 0 CHECK (stock &gt;= 0),<br/>
  sku&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; VARCHAR(50) UNIQUE NOT NULL,<br/>
  status&nbsp;&nbsp;&nbsp; VARCHAR(20) NOT NULL<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CHECK (status IN ('active','inactive','discontinued')),<br/>
  seller_id  INTEGER NOT NULL REFERENCES sellers(id),<br/>
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()<br/>
);<br/><br/>
-- Without CHECK on status:<br/>
INSERT: status = 'delviered' (typo) → silently succeeds<br/>
Queries for status='delivered' never find these rows ← invisible data corruption
</div>

<div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;margin-bottom:14px;">
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Enforced even for direct DB scripts</span>
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Catches bugs in any language/tool writing to DB</span>
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Self-documenting schema</span>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Defense in depth: validate at the frontend (UX), at the API layer (400 errors), AND at the database (constraints). Even if layers 1 and 2 fail due to a bug, a migration script, or a direct psql command, layer 3 prevents corrupt data from ever entering. Encode your domain invariants as constraints.</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Defense in Depth",
          body: `<p style="margin-bottom:12px;">Never assume application code is the only guard. When a new engineer runs a database migration script incorrectly, when a bug bypasses validation, when a third-party integration writes invalid data directly to the DB — constraints are the final safety net. Particularly important: CHECK constraints on enum-like columns (status, type) prevent typos from silently entering production data where they become invisible and unfixable.</p>`,
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
          body: `<p style="margin-bottom:12px;">A database <strong>index</strong> is a separate data structure that maintains a sorted copy of specific columns, enabling the database to find matching rows without scanning every row. Without indexes: <strong>sequential scan</strong> (O(n) — reads all rows). With indexes: <strong>index scan</strong> (O(log n) — follows B-tree). The difference is reading all 50M orders vs reading 30 tree nodes to find Rahul's 15 orders.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Index Impact on ShopKart",
          body: `<p style="margin-bottom:10px;font-size:13px;">Index impact on ShopKart's 50-million-row orders table:</p>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Without Index — Full Table Scan</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
SELECT * FROM orders WHERE user_id = 42;<br/>
→ PostgreSQL reads all 50M rows, checks each one<br/>
→ 8 seconds query time, 100% CPU spike<br/>
→ O(n): scales linearly with table size
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(34,197,94,0.06);">
    <div style="font-weight:700;font-size:14px;color:#22c55e;margin-bottom:6px;">✅ With Index — B-Tree Scan</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
CREATE INDEX idx_orders_user_id ON orders(user_id);<br/><br/>
SELECT * FROM orders WHERE user_id = 42;<br/>
→ PostgreSQL traverses B-tree: 3 I/O reads to find user 42<br/>
→ Returns Rahul's 15 orders in 0.3ms<br/>
→ 26,000× faster! O(log n): doesn't scale with table size<br/><br/>
-- Composite index for sorted pagination:<br/>
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);<br/>
SELECT * FROM orders WHERE user_id=42 ORDER BY created_at DESC LIMIT 10;<br/>
→ Index pre-sorted: no sort step, just read top 10
    </div>
  </div>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Index Trade-offs",
          body: `<p style="margin-bottom:10px;font-size:13px;">Every index adds I/O on every write. The decision is always reads vs writes:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
products table with 5 indexes:<br/>
INSERT INTO products ...<br/>
→ Write to table heap<br/>
→ Update idx_category (B-tree insert)<br/>
→ Update idx_price (B-tree insert)<br/>
→ Update idx_seller_id (B-tree insert)<br/>
→ Update idx_sku (B-tree insert + uniqueness check)<br/>
→ Update idx_name (B-tree insert)<br/>
= 6 I/O operations per INSERT instead of 1<br/><br/>
For 1% reads / 99% writes (event log) → indexes are net HARMFUL<br/>
For 95% reads / 5% writes (products) → indexes are net BENEFICIAL
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">The right indexes serve your actual query patterns. Profile, don't guess: enable slow query logging, find queries &gt;100ms, use EXPLAIN ANALYZE to see if they're doing full table scans, add targeted indexes, then monitor with <code>pg_stat_user_indexes</code> to drop unused ones monthly. This cycle — measure, index, verify, prune — is the professional approach versus adding indexes speculatively.</p>`,
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
          body: `<p style="margin-bottom:12px;">A <strong>B-Tree</strong> (Balanced Tree) is the default index structure in PostgreSQL, MySQL, Oracle, and most relational databases. Self-balancing: every leaf node is at the same depth. Guarantees O(log n) lookup regardless of data size. B-Tree on 1 billion rows: any value found in ~30 steps. Supports equality (<code>=</code>), ranges (<code>BETWEEN</code>), and sorting (<code>ORDER BY</code>) with equal efficiency.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "B-Tree Structure",
          body: `<p style="margin-bottom:10px;font-size:13px;">B-Tree traversal for <code>WHERE user_id = 42</code> on orders:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
Root: [25 | 50 | 75]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
[1-24]&nbsp;&nbsp;&nbsp;&nbsp;[25-49]&nbsp;&nbsp;[50-74]&nbsp;&nbsp;[75-100]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
[37-42]...[43-49]<br/>
&nbsp;&nbsp;↓<br/>
[40|41|42|43] ← leaf nodes: pointers to actual table rows<br/><br/>
WHERE user_id = 42:<br/>
1. Read root: 42 &gt; 25, &lt; 50 → traverse [25-49]<br/>
2. Read [25-49] node → traverse [37-42]<br/>
3. Read leaf: find 42 → get row pointer → fetch row<br/>
= 3 I/O reads regardless of whether table has 1K or 1B rows
</div>

<div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Equality: WHERE id = 42</span>
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Range: WHERE price BETWEEN 100 AND 500</span>
  <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Sort: ORDER BY price (pre-sorted in tree)</span>
  <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Low cardinality columns may not benefit</span>
</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "When B-Tree Doesn't Help",
          body: `<p style="margin-bottom:12px;">B-Tree indexes only help when they narrow the result set. <code>WHERE country = 'IN'</code> on a table of Indian users matches 95% of rows — PostgreSQL's query planner will choose a sequential scan because following index pointers to 95% of the table is slower than just reading them all. Rule of thumb: indexes are most effective when they select less than ~10% of rows (high cardinality). Low-cardinality boolean flags use a <strong>partial index</strong> instead: <code>CREATE INDEX ON orders (created_at) WHERE status = 'pending'</code> — only the pending orders, much smaller index.</p>`,
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
          body: `<p style="margin-bottom:12px;">A <strong>composite index</strong> covers multiple columns in one index structure. It can serve queries that filter and sort across multiple columns in a single tree traversal. Column <strong>order matters critically</strong> — the index can only be used left-to-right. Skipping the leftmost column makes the index unusable for that query.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Composite Index Design",
          body: `<p style="margin-bottom:10px;font-size:13px;">Admin query: delivered orders for user 42, sorted by date:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
SELECT id, total, status, created_at<br/>
FROM orders WHERE user_id=42 AND status='delivered'<br/>
ORDER BY created_at DESC LIMIT 20;<br/><br/>
-- Option A: two separate indexes (idx_user_id + idx_status)<br/>
-- PostgreSQL uses one, scans result, applies other filter<br/>
-- Two lookups then merge → slower<br/><br/>
-- Option B: one composite index<br/>
CREATE INDEX idx_orders_user_status_date<br/>
  ON orders(user_id, status, created_at DESC);<br/><br/>
-- Single index serves entire query:<br/>
-- ✅ WHERE user_id = 42 (leftmost column)<br/>
-- ✅ AND status = 'delivered' (second column)<br/>
-- ✅ ORDER BY created_at DESC (third column — pre-sorted!)<br/>
-- Zero extra sort step. One traversal.
</div>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);font-weight:700;font-size:13px;">Left-Prefix Rule: idx on (user_id, status, created_at)</div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;display:grid;grid-template-columns:2fr 1fr;gap:8px;">
    <div><code>WHERE user_id = 42</code></div><div style="color:#22c55e;font-weight:600;">✅ Leftmost prefix</div>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;display:grid;grid-template-columns:2fr 1fr;gap:8px;">
    <div><code>WHERE user_id = 42 AND status = 'x'</code></div><div style="color:#22c55e;font-weight:600;">✅ First two columns</div>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;display:grid;grid-template-columns:2fr 1fr;gap:8px;">
    <div><code>WHERE status = 'delivered'</code></div><div style="color:#ef4444;font-weight:600;">❌ Skips leftmost</div>
  </div>
  <div style="padding:12px 16px;font-size:12px;display:grid;grid-template-columns:2fr 1fr;gap:8px;">
    <div><code>WHERE created_at &gt; '2024-01-01'</code></div><div style="color:#ef4444;font-weight:600;">❌ Skips first two</div>
  </div>
</div>`,
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
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Small tables (&lt;10K rows)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Full scan of 1,000 rows = 1ms. Index adds complexity, extra storage, write overhead for zero performance gain.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Very low cardinality (boolean, 2-3 value enums)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">If 99% rows have <code>is_deleted=false</code>, index on is_deleted doesn't narrow the result set. Use partial index: <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">CREATE INDEX ON products WHERE is_active = true</code> — index only the active rows.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Write-heavy tables (event logs, audit trails)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">10K inserts/second × 5 indexes = 50K index operations/second. Send these tables to a read replica or OLAP system for analytics queries instead of indexing the primary write table.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Unused indexes</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Indexes never queried still slow every write. PostgreSQL tracks this: <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0</code>. Review monthly and drop dead weight.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Index Monitoring",
          body: `<p style="margin-bottom:12px;">Don't guess at indexes — measure. Enable slow query logging, find queries &gt;100ms, use EXPLAIN ANALYZE to identify full table scans, add targeted indexes, then monitor usage with <code>pg_stat_user_indexes</code> and drop dead indexes monthly. This cycle prevents both under-indexing (slow reads) and over-indexing (slow writes). Production indexes should be validated under real query patterns, not inferred from schema design alone.</p>`,
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
          body: `<p style="margin-bottom:12px;">A <strong>transaction</strong> is a group of SQL operations that execute as one atomic unit: either ALL succeed (COMMIT) or ALL fail (ROLLBACK), leaving the database as if the transaction never happened. Without transactions, a crash between steps 1 and 2 of a multi-step operation leaves the database in a partially-updated, corrupt state.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Order Placement Transaction",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Without Transaction (DANGEROUS)</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
1. INSERT INTO orders ... → ✅ success<br/>
2. UPDATE inventory SET stock = stock - 1 → CRASH 💥<br/>Result: order exists, inventory NOT deducted.<br/>Customer ordered a product whose stock wasn't deducted.<br/>ShopKart oversells. Manual reconciliation. Angry customers.
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(34,197,94,0.06);">
    <div style="font-weight:700;font-size:14px;color:#22c55e;margin-bottom:6px;">✅ With Transaction (SAFE)</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
BEGIN;<br/>
&nbsp;&nbsp;INSERT INTO orders (user_id, total) VALUES (42, 7999)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;RETURNING id INTO order_id;<br/>
&nbsp;&nbsp;INSERT INTO order_items (order_id, product_id, quantity)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;VALUES (order_id, 1, 1);<br/>
&nbsp;&nbsp;UPDATE products SET stock = stock - 1<br/>
&nbsp;&nbsp;&nbsp;&nbsp;WHERE id = 1 AND stock &gt;= 1;  -- atomic check!<br/>
&nbsp;&nbsp;IF rows_affected = 0 THEN<br/>
&nbsp;&nbsp;&nbsp;&nbsp;ROLLBACK;  -- stock was 0, abort everything<br/>
&nbsp;&nbsp;END IF;<br/>
&nbsp;&nbsp;INSERT INTO payments (order_id, amount) VALUES (order_id, 7999);<br/>
COMMIT;  -- all 4 ops succeed atomically
    </div>
  </div>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Long-running transactions</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">A transaction that spans a UI interaction holds DB row locks for minutes. Other queries needing those rows queue up and wait. One 5-minute transaction can cause a cascading lock timeout storm across hundreds of dependent queries. Transactions must complete in milliseconds, not human time.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Swallowing rollback exceptions</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">When a transaction rolls back (constraint violation, stock=0, network error), the application MUST handle it explicitly: return a 409 Conflict, retry with backoff, or surface to the user. Catching the exception silently and returning HTTP 200 means the user thinks their order succeeded when it didn't.</p>
  </div>
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
          body: `<p style="margin-bottom:12px;"><strong>ACID</strong> describes the four guarantees database transactions must uphold: <strong>Atomicity</strong> (all or nothing), <strong>Consistency</strong> (constraints always enforced), <strong>Isolation</strong> (concurrent transactions don't bleed into each other), <strong>Durability</strong> (committed data survives crashes). These make SQL databases trustworthy for money and orders.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "ACID in ShopKart Context",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--accent);margin-bottom:6px;">🔵 Atomicity</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Rahul places an order: either all 4 steps succeed (create order + add items + deduct inventory + create payment record) or ALL roll back. If the server crashes between step 2 and 3, PostgreSQL's WAL restores the database to pre-transaction state. No half-completed orders exist.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:#10b981;margin-bottom:6px;">🟢 Consistency</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Every transaction moves the DB from one valid state to another. A transaction that would make stock go negative (violating CHECK stock &gt;= 0) is rejected before commit. The database never contains data that violates its declared constraints.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:#8b5cf6;margin-bottom:6px;">🟣 Isolation</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">1,000 users simultaneously placing orders on ShopKart. Each transaction appears to execute in isolation — they don't read each other's uncommitted changes. Prevents the stock=1 oversell scenario where two transactions both read stock=1 and both proceed.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:#f59e0b;margin-bottom:6px;">🟡 Durability</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">After COMMIT returns, data is permanent even if power fails instantly. PostgreSQL writes to WAL (Write-Ahead Log) on disk before acknowledging COMMIT. Data survives hard crashes, power loss, and restarts.</p>
  </div>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">ACID vs BASE: NoSQL systems trade ACID for scale following BASE (Basically Available, Soft state, Eventually consistent). Use PostgreSQL (ACID) for orders, payments, inventory where correctness is non-negotiable. Use Redis or Cassandra for recommendation caches, activity feeds where eventual consistency is fine and throughput dominates.</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — BASE vs ACID",
          body: `<p style="margin-bottom:12px;"><strong>NoSQL databases</strong> often trade ACID for horizontal scalability following <strong>BASE</strong> (Basically Available, Soft state, Eventually consistent). MongoDB had no multi-document transactions until v4.0. DynamoDB transactions have throughput limitations. Cassandra's last-write-wins model can silently lose concurrent updates. The architectural decision: PostgreSQL for operations where correctness is non-negotiable (orders, payments, inventory). Redis/DynamoDB/Cassandra for hot reads where eventual consistency is acceptable (product views, recommendation caches, activity feeds).</p>`,
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
          body: `<p style="margin-bottom:12px;">A <strong>race condition</strong> occurs when two concurrent transactions read the same data, then both proceed based on that same snapshot, and their updates collide. The final state depends on luck of timing rather than logic. Without atomic operations or locking, concurrent requests corrupt data even when each individually looks correct.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "The Classic ShopKart Race Condition",
          body: `<p style="margin-bottom:10px;font-size:13px;">The oversell race condition — stock=1, two buyers at once:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
Transaction A (Rahul)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Transaction B (Priya)<br/>
1. SELECT stock FROM products<br/>
   WHERE id = 1 → reads 1 ✅<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. SELECT stock → reads 1 ✅<br/>
3. stock &gt; 0, proceed<br/>
4. INSERT INTO orders...<br/>
5. UPDATE products SET stock=0<br/>
6. COMMIT ✅<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. stock &gt; 0, proceed (stale read!)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5. INSERT INTO orders...<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6. UPDATE → stock = -1 ❌ OVERSOLD!<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7. COMMIT ✅ (no check constraint!)<br/><br/>
-- FIX: Atomic update = read + check + write as one SQL op<br/>
UPDATE products SET stock = stock - 1<br/>
WHERE id = 1 AND stock &gt;= 1;  -- atomic condition!<br/>
-- rows_affected = 0 → stock was 0 → ROLLBACK
</div>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);font-weight:700;font-size:13px;">Three Locking Strategies</div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;">
    <div style="font-weight:600;color:var(--accent);margin-bottom:4px;">✅ Atomic UPDATE (best for simple cases)</div>
    <code style="font-size:11px;">UPDATE products SET stock=stock-1 WHERE id=1 AND stock&gt;=1</code>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;">
    <div style="font-weight:600;color:#10b981;margin-bottom:4px;">✅ SELECT FOR UPDATE (pessimistic locking)</div>
    <p style="margin:0;">Locks the row until transaction commits. Other transactions wait. Use for complex multi-step operations.</p>
  </div>
  <div style="padding:12px 16px;font-size:12px;">
    <div style="font-weight:600;color:#8b5cf6;margin-bottom:4px;">✅ Optimistic locking (version column)</div>
    <p style="margin:0;"><code>UPDATE products SET stock=..., version=version+1 WHERE id=1 AND version=5</code>. If another transaction already updated version to 6, this affects 0 rows → retry.</p>
  </div>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Locking Solutions",
          body: `<p style="margin-bottom:12px;">See the three strategies above — atomic UPDATE is the default choice for inventory and counters. SELECT FOR UPDATE for complex multi-step operations where you need a consistent view of multiple related rows. Optimistic locking for high-read/low-contention scenarios where retries are cheap. Choose based on contention level: high contention (flash sales) = SELECT FOR UPDATE. Low contention (normal checkout) = atomic UPDATE is simpler and faster with no lock overhead.</p>`,
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
          body: `<p style="margin-bottom:12px;">In distributed systems, payment requests are retried due to network timeouts, user double-clicks, or automated retry queues. Without idempotency design, each retry triggers another charge — Rahul gets billed 3 times for one ₹7,999 order. The fix: idempotency keys enforced by a UNIQUE constraint in the database.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Payment Idempotency",
          body: `<p style="margin-bottom:10px;font-size:13px;">The double-charge problem and its solution:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
-- payments table with idempotency_key constraint:<br/>
CREATE TABLE payments (<br/>
  id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SERIAL PRIMARY KEY,<br/>
  order_id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; INT NOT NULL REFERENCES orders(id),<br/>
  idempotency_key&nbsp; VARCHAR(64) NOT NULL UNIQUE,&nbsp; -- the key!<br/>
  amount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; DECIMAL(10,2),<br/>
  status&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; VARCHAR(20)<br/>
);<br/><br/>
-- Flow:<br/>
1. Frontend generates key = UUID (stored locally, reused on retry)<br/>
2. POST /payments { idempotency_key: "a3f2b1c4-..." }<br/>
3. Server: INSERT INTO payments (..., 'a3f2b1c4-...')<br/>
4. First time: INSERT succeeds → charge card → update status → return ✅<br/>
5. Network timeout → user retries with SAME key<br/>
6. Second time: INSERT fails with UNIQUE VIOLATION<br/>
   → server detects duplicate → returns first payment result (no new charge) ✅<br/><br/>
Rahul double-clicks Pay: second request returns same payment. No double charge.
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">For distributed payment reliability: <strong>Transactional Outbox Pattern</strong>. Write to a local payments table AND an outbox table in ONE database transaction. A separate process reads the outbox and calls Stripe/Razorpay with retries. Eliminates the race between charging the gateway and recording locally — the two can never go out of sync.</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Outbox Pattern",
          body: `<p style="margin-bottom:12px;">The <strong>Transactional Outbox Pattern</strong> solves distributed payment reliability: instead of calling Stripe directly AND writing to the database (two separate systems that can fail independently), write to a local <code>outbox</code> table in the SAME transaction as the order record. A separate reliable worker reads the outbox and calls Stripe with full retry support. The business transaction and the payment event are always consistent — if the DB write succeeds, the payment will eventually be processed.</p>`,
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
          body: `<p style="margin-bottom:12px;"><strong>Normalisation</strong> is the process of organising tables to eliminate data redundancy. A normalised database stores each fact in exactly one place — if a seller's email changes, it changes in one row, accurately reflected everywhere. The three practical normal forms: 1NF (no repeating groups), 2NF (no partial dependencies on composite keys), 3NF (no transitive dependencies). 3NF covers 99% of real-world needs.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Problems with Redundant Data",
          body: `<p style="margin-bottom:10px;font-size:13px;">Three anomalies that appear when you store the same fact twice:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
-- DENORMALISED (problematic): order_items stores seller info<br/>
order_id | product | seller_name&nbsp;&nbsp;&nbsp;&nbsp;| seller_email<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;789 | Nike&nbsp;&nbsp;&nbsp;&nbsp;| Sports City&nbsp;&nbsp;&nbsp;| sports@city.com<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;790 | Adidas&nbsp;&nbsp;| Sports City&nbsp;&nbsp;&nbsp;| sports@city.com&nbsp; ← redundant!<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;791 | Puma&nbsp;&nbsp;&nbsp;&nbsp;| Sports City&nbsp;&nbsp;&nbsp;| sports@city.com<br/><br/>
UPDATE anomaly: email changes → must update 3 rows, miss one → inconsistent<br/>
INSERT anomaly: can't record seller without an order<br/>
DELETE anomaly: delete all orders → lose seller info<br/><br/>
-- NORMALISED (correct)<br/>
sellers: id=1 | name=Sports City | email=sports@city.com  (ONE row)<br/>order_items: order_id | product | seller_id=1<br/><br/>
Email change: UPDATE sellers SET email=... WHERE id=1 → ONE update, always consistent
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — When to Normalise",
          body: `<p style="margin-bottom:12px;">Normalise all the way to 3NF — it covers 99% of real-world schemas. Beyond that (BCNF, 4NF) the gains are theoretical and the join complexity increases. Critically: normalise first and denormalise only where measured query performance requires it. Premature denormalisation creates schemas that are simultaneously redundant and slow, because the redundancy was added speculatively rather than based on actual bottlenecks.</p>`,
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
          body: `<p style="margin-bottom:12px;"><strong>Denormalisation</strong> is deliberate redundancy added to improve read performance. Store the same data in multiple places to avoid expensive JOINs at query time. Improves query speed at the cost of: extra storage, write complexity (more updates), and potential inconsistency if not maintained correctly.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Denormalization Examples",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--accent);margin-bottom:6px;">🔵 Pre-computed ratings</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
-- Normalised (slow at scale):<br/>
SELECT AVG(rating), COUNT(*) FROM reviews WHERE product_id=1<br/>
-- 50ms+ for products with 100K reviews. Runs on every page load.<br/><br/>
-- Denormalised (fast):<br/>
products: avg_rating=4.3, review_count=1247  ← pre-computed<br/>
SELECT avg_rating, review_count FROM products WHERE id=1<br/>
-- 1ms. Updated by trigger after each new review.
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:#10b981;margin-bottom:6px;">🟢 Order price snapshot (intentional denorm)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">order_items stores price at time of order: <code style="background:rgba(0,0,0,0.1);padding:1px 4px;border-radius:3px;">price=7999</code>. Even if products.price changes to ₹8,999 tomorrow, Rahul's order history shows ₹7,999 — what he actually paid. Historical accuracy REQUIRES this denormalisation.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:#8b5cf6;margin-bottom:6px;">🟣 Username in comments</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Store username directly in comments to avoid a JOIN on every comment render. Trade-off: if user changes username, you update past comments too (acceptable: username changes are rare).</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p style="margin-bottom:12px;"><strong>Normalise first, denormalise with precision.</strong> Start with a well-normalised schema. Measure query performance with realistic production data volumes. Identify the specific slow queries that cost user experience. Denormalise only those cases, document why redundancy was introduced, and add application logic to keep redundant data consistent. Random denormalisation without measurement creates schemas that are both slow AND inconsistent — worst of both worlds.</p>`,
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
          body: `<p style="margin-bottom:12px;">A <strong>soft delete</strong> marks a row as deleted with a timestamp column instead of physically removing it. The row stays in the database, excluded from normal queries. Hard DELETE permanently destroys data — unrecoverable and inappropriate for most business records.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Soft Delete Pattern",
          body: `<p style="margin-bottom:10px;font-size:13px;">The soft delete pattern with all edge cases handled:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
-- Add soft delete column<br/>
ALTER TABLE products ADD COLUMN deleted_at TIMESTAMPTZ;&nbsp; -- NULL = active<br/><br/>
-- Soft delete (never hard DELETE!)<br/>
UPDATE products SET deleted_at = NOW() WHERE id = 1;<br/><br/>
-- All queries must filter:<br/>
SELECT * FROM products WHERE deleted_at IS NULL;<br/><br/>
-- Safer: use a view so filtering is automatic<br/>
CREATE VIEW active_products AS<br/>
  SELECT * FROM products WHERE deleted_at IS NULL;<br/><br/>
-- Undelete in 1 line:<br/>
UPDATE products SET deleted_at = NULL WHERE id = 1;<br/><br/>
-- UNIQUE constraint issue: SKU 'NIKE-001' soft-deleted,<br/>
-- can't reuse SKU (UNIQUE applies to ALL rows including deleted)<br/>
-- Fix: partial unique index<br/>
CREATE UNIQUE INDEX ON products(sku) WHERE deleted_at IS NULL;
</div>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"We use soft deletes with a deleted_at timestamp. Deleted data is retained 90 days for recovery and compliance, then purged by a scheduled job. FK references remain valid until purge. We use DB views to automatically exclude deleted records from all queries — so no query accidentally surfaces deleted rows."</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">Add soft delete in any system design involving user content or business records. When asked about data deletion: the answer is never "we DELETE the row." Soft delete → 90-day retention → scheduled purge is the production pattern for compliance (GDPR right-to-erasure can be a delayed purge job), auditability, and FK integrity.</p>`,
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
          body: `<p style="margin-bottom:12px;"><strong>Audit columns</strong> are standard metadata columns on every table: who created a record, when, who last updated it, and when. They answer production questions that always come up: "When was this order created?" "Who changed this price?" "When did this status change?" Retrofitting audit columns onto 100M-row tables is painful — add them at table creation time as non-negotiable standards.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Standard Audit Column Pattern",
          body: `<p style="margin-bottom:10px;font-size:13px;">Standard audit pattern across every ShopKart table:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
-- Every table gets these 4 columns at creation:<br/>
created_at&nbsp; TIMESTAMPTZ NOT NULL DEFAULT NOW()<br/>
updated_at&nbsp; TIMESTAMPTZ NOT NULL DEFAULT NOW()<br/>
created_by&nbsp; INTEGER REFERENCES users(id)<br/>
updated_by&nbsp; INTEGER REFERENCES users(id)<br/><br/>
-- Auto-update trigger (run once per table):<br/>
CREATE OR REPLACE FUNCTION update_updated_at()<br/>
RETURNS TRIGGER AS $$<br/>
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;<br/>
$$ LANGUAGE plpgsql;<br/><br/>
CREATE TRIGGER set_updated_at BEFORE UPDATE ON products<br/>
FOR EACH ROW EXECUTE FUNCTION update_updated_at();<br/><br/>
-- For critical data: full change history table<br/>
CREATE TABLE product_price_history (<br/>
&nbsp; product_id&nbsp; INT NOT NULL,<br/>
&nbsp; old_price&nbsp;&nbsp; DECIMAL(10,2),<br/>
&nbsp; new_price&nbsp;&nbsp; DECIMAL(10,2),<br/>
&nbsp; changed_by&nbsp; INT REFERENCES users(id),<br/>
&nbsp; changed_at&nbsp; TIMESTAMPTZ DEFAULT NOW(),<br/>
&nbsp; reason&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; TEXT<br/>
);
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Audit columns are pennies per row and priceless in incidents. The first time a customer disputes a charge, a compliance audit requires change records, a bug corrupts data and you need to know what changed when, or a support case requires timeline reconstruction — audit columns save the day. Use a base ORM model that includes them automatically; never add manually.</span>
</div>`,
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
          body: `<p style="margin-bottom:12px;"><strong>Multi-tenancy</strong> is one system serving multiple isolated customers (tenants). For ShopKart's B2B seller platform, each merchant is a tenant — Merchant A must never see Merchant B's orders, products, or customers. Three database models with different isolation and cost trade-offs.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Three Multi-tenancy Models",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;font-size:12px;font-weight:700;">
    <div>Model</div><div>Structure</div><div>Isolation</div><div>Cost</div>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;">
    <div style="font-weight:600;">Separate Database</div>
    <div>Each tenant own DB instance</div>
    <div style="color:#22c55e;">Complete</div>
    <div style="color:#ef4444;">Very high ($$$)</div>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;">
    <div style="font-weight:600;">Separate Schema</div>
    <div>One DB, tenant-per-schema</div>
    <div style="color:#10b981;">Strong</div>
    <div style="color:#f59e0b;">Medium</div>
  </div>
  <div style="padding:12px 16px;font-size:12px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;">
    <div style="font-weight:600;">Shared Schema (tenant_id)</div>
    <div>All tenants share tables</div>
    <div style="color:#f59e0b;">Logical only</div>
    <div style="color:#22c55e;">Low (scalable)</div>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart B2B Platform (Shared Schema)",
          body: `<p style="margin-bottom:10px;font-size:13px;">Shared schema is the scalable default. PostgreSQL Row Level Security makes it bulletproof:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
CREATE TABLE seller_products (<br/>
  id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SERIAL PRIMARY KEY,<br/>
  seller_id&nbsp; INTEGER NOT NULL REFERENCES sellers(id),<br/>
  name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; VARCHAR(200) NOT NULL,<br/>
  ...<br/>
);<br/>
CREATE INDEX ON seller_products(seller_id);  -- critical!<br/><br/>
-- Row Level Security: DB enforces tenant isolation automatically<br/>
ALTER TABLE seller_products ENABLE ROW LEVEL SECURITY;<br/>
CREATE POLICY seller_isolation ON seller_products<br/>
  USING (seller_id = current_setting('app.current_seller_id')::INT);<br/><br/>
-- App sets context before each query:<br/>
SET LOCAL app.current_seller_id = 42;<br/>
SELECT * FROM seller_products;<br/>
-- PostgreSQL adds: AND seller_id = 42 automatically<br/>
-- Even if app forgets WHERE, data leakage is prevented at DB level
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Start with shared schema (tenant_id on every row, indexed). Use Row Level Security for defense in depth. Migrate high-value enterprise tenants to separate schemas or databases when their data volume or compliance requirements justify the infrastructure cost.</span>
</div>`,
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
          body: `<p style="margin-bottom:12px;">The <strong>N+1 query problem</strong>: 1 query fetches a list of N items, then N more queries fetch related data for each item. 1 + N total queries instead of 1-2. Invisible in development (small local dataset, fast loopback). Catastrophic in production (10K product catalog, orders with 20 items each, real network latency).</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "The Problem in Code",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ N+1 in ORM Code</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
const orders = await Order.findAll({ where: { userId: 42 } });<br/>
// 1 query: fetches 15 orders<br/>
for (const order of orders) {<br/>
&nbsp;&nbsp;const items = await OrderItem.findAll({ where: { orderId: order.id } });<br/>
&nbsp;&nbsp;// 15 queries: 1 per order!<br/>
&nbsp;&nbsp;for (const item of items) {<br/>
&nbsp;&nbsp;&nbsp;&nbsp;const product = await Product.findByPk(item.productId);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;// 45 queries: 3 per order × 15 orders!<br/>
&nbsp;&nbsp;}<br/>
}<br/>
// Total: 1 + 15 + 45 = 61 queries instead of 1!
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(34,197,94,0.06);">
    <div style="font-weight:700;font-size:14px;color:#22c55e;margin-bottom:6px;">✅ Fix: Eager Loading (JOIN)</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
const orders = await Order.findAll({<br/>
&nbsp;&nbsp;where: { userId: 42 },<br/>
&nbsp;&nbsp;include: [{ model: OrderItem, include: [{ model: Product }] }]<br/>
});<br/>
// Generates ONE SQL JOIN query for all data in one round-trip
    </div>
  </div>
</div>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"We use eager loading in our ORM to pre-fetch related data in the same query. For complex reporting, we write raw SQL with JOINs. We also monitor queries-per-request in APM — any endpoint doing &gt;5 DB queries per request is investigated for N+1 patterns. That's how we caught a product listing endpoint doing 200 queries per page load."</span>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Detection",
          body: `<p style="margin-bottom:12px;">N+1 problems are invisible in development (small data, fast local DB) and catastrophic in production. Detection tools: ORM query logging (enable in development — &gt;20 near-identical queries in one request = N+1), DataDog/New Relic APM tracking queries-per-request, <code>pg_stat_statements</code> to identify repeated micro-queries in PostgreSQL.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">"We use eager loading in our ORM to pre-fetch related data in the same query. For complex reporting queries, we write raw SQL with JOINs for maximum performance. We monitor queries-per-request in APM — any endpoint doing more than 5 DB queries is investigated for N+1. We caught a product listing endpoint doing 200 queries per page load this way."</p>`,
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
          body: `<p style="margin-bottom:12px;"><code>EXPLAIN ANALYZE</code> executes a query and shows the execution plan: which indexes PostgreSQL used, which indexes it skipped, join algorithms, actual execution time per step, and rows processed. It's the primary tool for diagnosing slow queries and verifying indexes are actually being used.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Reading EXPLAIN Output",
          body: `<p style="margin-bottom:10px;font-size:13px;">Good vs bad EXPLAIN output — the key signals:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
EXPLAIN ANALYZE<br/>
SELECT id, total FROM orders WHERE user_id=42 ORDER BY created_at DESC LIMIT 10;<br/><br/>
-- GOOD: using composite index<br/>
Index Scan Backward using idx_orders_user_created on orders<br/>
  Index Cond: (user_id = 42)<br/>
  Rows Removed by Filter: 0<br/>
Execution Time: 0.135 ms  ← fast!<br/><br/>
-- BAD: no index, reading whole table<br/>
Seq Scan on orders  ← RED FLAG: reading all 50M rows!<br/>
  Filter: (user_id = 42)<br/>
  Rows Removed by Filter: 49,999,985  ← scanned 50M to find 15<br/>
Execution Time: 8423 ms  ← 8 seconds per request!
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Key Terms in EXPLAIN Output",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.06);font-size:12px;">
    <div style="font-weight:700;color:#22c55e;margin-bottom:2px;">Index Scan / Index Only Scan</div>
    <div style="opacity:0.85;">Using B-tree to jump to matching rows. Index Only = all needed columns in index (fastest — doesn't read table at all).</div>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);font-size:12px;">
    <div style="font-weight:700;color:#ef4444;margin-bottom:2px;">Seq Scan — Red Flag</div>
    <div style="opacity:0.85;">Reading every row in the table. Almost always means a missing index for large tables.</div>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;">
    <div style="font-weight:700;color:#f59e0b;margin-bottom:2px;">Rows Removed by Filter</div>
    <div style="opacity:0.85;">Large number = index not selective enough, or wrong column indexed. Filtering happened after the scan rather than during tree traversal.</div>
  </div>
  <div style="padding:12px 16px;font-size:12px;">
    <div style="font-weight:700;color:var(--accent);margin-bottom:2px;">Hash Join / Merge Join</div>
    <div style="opacity:0.85;">Join algorithm chosen by planner. Hash join is typically faster for large tables with no order requirement.</div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Query Tuning Process",
          body: `<p style="margin-bottom:12px;">Systematic query tuning: (1) Enable slow query log: <code>log_min_duration_statement = 100</code>. (2) Find the top 5 slowest queries. (3) EXPLAIN ANALYZE each — look for Seq Scan on large tables, high "Rows Removed by Filter", sort steps that could use an index. (4) Add targeted indexes. (5) Re-run EXPLAIN to verify plan switched to Index Scan. (6) Verify production response times drop. This cycle — measure, index, verify, prune — is how professional DBAs work. Not guessing at indexes.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"First I'd enable slow query logging and identify the top slow queries. Then EXPLAIN ANALYZE — looking for Seq Scans on large tables. Seq Scan with Rows Removed by Filter in the millions means that column needs an index. I'd add a targeted index, re-run EXPLAIN to verify the plan switches to an Index Scan, and confirm production response times drop. I'd also check for N+1 in APM — any endpoint doing more than 5 queries per request gets investigated."</span>
</div>`,
        },
      ],
    },
  ],
};

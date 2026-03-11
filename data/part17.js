/* Part 17 — Real World System Design II (3 topics) */
const PART17 = {
  id: "part17",
  icon: "🎬",
  title: "Part 17",
  name: "Real World System Design II",
  topics: [
    /* 1 */ {
      id: "p17t1",
      title: "Design a Video Streaming Platform",
      subtitle:
        "YouTube / Netflix architecture — upload pipelines, adaptive streaming, CDN delivery, and petabyte-scale storage.",
      sections: [
        {
          icon: "📋",
          color: "si-blue",
          title: "Requirements & Scale",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:8px;">Functional Requirements</div>
    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.9;color:var(--text-primary);opacity:0.9;">
      <li>Upload videos (any format), serve globally, smooth playback</li>
      <li>Adaptive quality: 1080p, 720p, 480p, 360p based on bandwidth</li>
      <li>Seek to any position without buffering entire video</li>
      <li>Video metadata, view counts, likes, recommendations</li>
      <li>500 hours of video uploaded per minute (YouTube scale)</li>
    </ul>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:6px;">Scale Estimation</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);">Upload: 500 hrs/min × 60 GB/hr (raw) = 30,000 GB/min = 500 GB/sec raw
After transcoding 5 quality tiers: 500 × 5 = 2,500 GB/sec output
Storage per day: 2,500 × 86,400 = ~216 PB/day at YouTube scale

Reads (10:1 view ratio):
  2B views/day ÷ 86,400 = 23,000 video starts/sec
  Avg 720p stream bitrate: 4 Mbps × 23,000 = ~90 Tbps peak egress
  Solution: CDN serves 95%+ of traffic from edge nodes worldwide</div>
  </div>
</div>`,
        },
        {
          icon: "⬆️",
          color: "si-purple",
          title: "Upload & Transcoding Pipeline",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">UPLOAD PATH:
  1. Client requests pre-signed S3 URL from Upload Service
  2. Client uploads raw video DIRECTLY to S3 (bypasses our servers)
     -- No bandwidth bottleneck at our API layer
  3. S3 event triggers SQS: "video_id=abc, raw_key=raw/abc.mp4"
  4. Transcoding Workers (GPU EC2 fleet) dequeue job

TRANSCODING WORKER:
  a. Stream raw video from S3 (no full download needed)
  b. FFmpeg produces 5 quality resolutions in parallel
  c. Each resolution split into 6-second segments (.ts files):
       video/abc/1080p/seg_000.ts
       video/abc/1080p/seg_001.ts  ...
     This is HLS (HTTP Live Streaming) format.
     Clients can seek by fetching only the required segment!
  d. Generate per-quality playlist:
       video/abc/1080p/playlist.m3u8   (lists segment URLs)
  e. Generate master manifest:
       video/abc/master.m3u8
         #EXTM3U
         #EXT-X-STREAM-INF:BANDWIDTH=8000000,RESOLUTION=1920x1080
         1080p/playlist.m3u8
         #EXT-X-STREAM-INF:BANDWIDTH=4000000,RESOLUTION=1280x720
         720p/playlist.m3u8
         ...
  f. Upload all segments + manifests to S3 CDN bucket
  g. PostgreSQL: UPDATE videos SET status='ready' WHERE id='abc'</div>`,
        },
        {
          icon: "📡",
          color: "si-green",
          title: "Adaptive Bitrate Streaming (ABR)",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">How ABR Works</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">The video player downloads segments one at a time — 6 seconds each. After each download, it measures the download speed vs segment size to estimate available bandwidth. If bandwidth is high, it switches to a higher quality manifest for the next segment. If bandwidth drops, it immediately switches down. The player always has a 15-30 second buffer so quality switches are invisible to the viewer.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">Seek to Position</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">User seeks to 8:00 (8 minutes in). Player calculates: 8 min × 60 sec ÷ 6 sec/segment = segment #80. It requests seg_080.ts directly via HTTP range request to CloudFront. No need to download segments 0–79. This is why HLS segment-based delivery is essential for on-demand video.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">CDN Strategy</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Popular videos: CDN pre-warms edge nodes (CloudFront, Akamai) before release. Long-tail videos: served from origin S3 on first request, then cached at edge. Pre-warming: before a major release, push-heat the top edge PoPs (Points of Presence) closest to your user concentration. This avoids a "cold start" thundering herd on release day.</p>
  </div>
</div>`,
        },
        {
          icon: "🗄️",
          color: "si-purple",
          title: "Data Storage by Type",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">VIDEO FILES (segments + manifests):
  S3 → CloudFront CDN (gigantic, write-once, read-many)

VIDEO METADATA (title, description, creator, duration):
  PostgreSQL — structured, low volume, needs JOIN with user table
  videos: { id, creator_id, title, description, duration_sec,
            status, thumbnail_s3_key, created_at }

VIEW COUNTS, LIKES (very high write volume):
  Cassandra — append-only counter updates are its strength
  video_stats: { video_id [PK], view_count, like_count, dislike_count }
  OR: use Redis INCR for hot counters, flush to Cassandra every minute

SEARCH INDEX:
  Elasticsearch — full-text search on title, description, tags
  Re-indexed whenever video metadata changes (via Kafka event)

USER WATCH HISTORY (for recommendations):
  Cassandra — time-series per user
  watch_history: { user_id, video_id, watched_at, pct_watched }
  → "What did this user watch in the last 30 days?" = fast range scan</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>The most important insight in video systems: <strong>the upload pipeline is decoupled from the playback path entirely</strong>. The worst possible design would be to serve video files through your application servers. At 90 Tbps of egress, that's clearly impossible. The entire read path is: Client → CloudFront → S3. Your application servers never touch video bytes during playback — only metadata requests hit your API.</p>
<p style="margin-top:10px;">The transcoding pipeline is the heart of the system. Why parallelize it? A 2-hour movie at 60fps is ~7,200 frames per quality tier. A single worker would take 30 minutes to transcode. You need to split the raw video into 60-second chunks, transcode each chunk across 60 GPU workers in parallel, then concatenate the output. YouTube targets 5-minute transcode time for any uploaded video — this requires massive parallelism.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Three Concepts That Signal Depth</strong><br/><span style="color:var(--text-primary);opacity:0.9;"><strong>1. Pre-signed URLs:</strong> "The client uploads directly to S3 using a short-lived pre-signed URL. Our API generates this URL (valid for 30 minutes), returns it to the client, and the multi-GB upload never touches our application servers." This shows you understand avoiding application-layer bottlenecks. <strong>2. HLS segments enable seeking:</strong> "Because video is split into 6-second segments, seeking is free — the player just requests the segment at the target timestamp. No byte-range tricks needed." <strong>3. CDN pre-warming:</strong> "For a scheduled premiere or a live sporting event replay, we push video segments to CDN edge nodes 30 minutes early so the first-second experience doesn't originate from S3."</span></div>`,
        },
      ],
    },

    /* 2 */ {
      id: "p17t2",
      title: "Design a Payment System",
      subtitle:
        "Financial-grade reliability — idempotency, ledger correctness, and PCI-DSS compliance for payment processing at scale.",
      sections: [
        {
          icon: "🔒",
          color: "si-blue",
          title: "Requirements & Core Principles",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:8px;">Requirements</div>
    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.9;color:var(--text-primary);opacity:0.9;">
      <li>Accept payments (credit card, debit card, UPI)</li>
      <li>Process refunds partially or fully</li>
      <li>Never double-charge a customer</li>
      <li>Complete audit trail for every paise movement</li>
      <li>PCI-DSS compliant — never store raw card data</li>
      <li>1M transactions/day, 99.99% availability (52 min downtime/year)</li>
    </ul>
  </div>
  <div style="padding:14px 16px;background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:8px;">Core Principles (non-negotiable in any payment system)</div>
    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.9;color:var(--text-primary);opacity:0.9;">
      <li><strong>Idempotency everywhere</strong> — retrying the same operation must be safe</li>
      <li><strong>Immutable ledger</strong> — never UPDATE a financial record, only INSERT</li>
      <li><strong>Atomic state transitions</strong> — payment is either fully charged or not</li>
      <li><strong>Reconciliation</strong> — daily comparison with payment processors</li>
    </ul>
  </div>
</div>`,
        },
        {
          icon: "🏗️",
          color: "si-purple",
          title: "Payment Flow & Idempotency",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">CHECKOUT FLOW:
  1. Customer places order → Order Service creates order (status=PENDING)
  2. Order Service calls Payment Service:
     POST /payments
     Body: { idempotency_key: "order-42_attempt-1",
              amount: 99900, currency: "INR",
              payment_method_token: "tok_stripe_abc123" }

  WHY idempotency_key?
    Network timeout: Order Service doesn't know if payment went through.
    It retries with THE SAME idempotency_key.
    Payment Service sees the key already exists → returns the ORIGINAL result.
    Customer billed exactly once. ✅

3. Payment Service:
   a. Check: SELECT * FROM payments WHERE idempotency_key = 'order-42_attempt-1'
      → if exists and status=SUCCESS: return cached result (idempotent ✅)
      → if exists and status=PENDING: another worker processing, return 202
      → if not exists: proceed
   b. INSERT payment (status=PENDING, idempotency_key=...)
   c. Acquire Redis lock on idempotency_key (prevent race conditions)
   d. Call Stripe API: stripe.charges.create({ amount, source: token })
   e. On Stripe success:
      UPDATE payment status=SUCCESS
      INSERT ledger_entry (debit user wallet, credit merchant)
   f. Release lock

4. Payment Service returns to Order Service → Order status=CONFIRMED</div>`,
        },
        {
          icon: "📒",
          color: "si-green",
          title: "Ledger Design — How Money Moves",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">The Double-Entry Ledger</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Every financial system uses double-entry bookkeeping: every debit has a corresponding credit. The sum of all entries in the ledger must always be zero. This is not just accounting convention — it's a powerful bug-detection mechanism.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);">ledger_entries table (append-only, NEVER UPDATE/DELETE):
  id         | account_id | entry_type | amount_paise | reference_id | created_at
  ──────────────────────────────────────────────────────────────────────────────
  1001       | usr_42     | DEBIT      | -9990000     | pay_789      | 2024-01-15
  1002       | merch_99   | CREDIT     | +9990000     | pay_789      | 2024-01-15
  1003       | usr_42     | CREDIT     | +4995000     | refund_44    | 2024-01-16
  1004       | merch_99   | DEBIT      | -4995000     | refund_44    | 2024-01-16

Account balance = SUM(amount_paise) WHERE account_id = 'usr_42'
                = -9990000 + 4995000 = -4995000 paise = -499.50 INR (spent)</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">Why Append-Only?</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">If a bug updates an amount row, you lose the audit trail permanently. With append-only, you have complete history: balance at any point in time is computable, bugs are detectable (sum != 0 indicates corruption), and regulatory audits are trivially fulfilled.</p>
  </div>
</div>`,
        },
        {
          icon: "🔴",
          color: "si-purple",
          title: "State Machine & PCI-DSS",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">PAYMENT STATE MACHINE:
  INITIATED → PENDING → AUTHORIZED → CAPTURED → COMPLETED
                      ↘ FAILED
                                   ↘ REFUND_PENDING → REFUNDED

Rules (enforced via DB constraints + application logic):
  - COMPLETED can only transition to REFUND_PENDING
  - FAILED is terminal (cannot retry same payment_id, must create new one)
  - AUTHORIZED → CAPTURED must happen within 7 days or auto-voids

PCI-DSS COMPLIANCE (Payment Card Industry Data Security Standard):

  1. NEVER store raw card numbers, CVV, or magnetic stripe data
     Instead: tokenize via Stripe/Braintree immediately on input
     Store only: { last4: "4242", brand: "Visa", token: "tok_abc" }

  2. NEVER log card data in application logs
     Common mistake: logging entire request body that includes card fields

  3. Isolate payment servers in a separate network segment (VPC subnet)
     Strict security group rules: only Payment Service can reach it

  4. TLS 1.2+ everywhere, no exceptions

  5. Annual PCI-DSS audit by Qualified Security Assessor (QSA)

RECONCILIATION (daily job):
  SELECT * FROM ledger_entries WHERE DATE(created_at) = yesterday
  Compare with Stripe dashboard export via API
  Any discrepancy → alert finance team + engineering on-call</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Payment systems are different from other CRUD systems because <strong>correctness is more important than performance</strong>. A social media feed that's 2 seconds slow is annoying. A payment that double-charges is a business-ending event. This changes architectural priorities:</p>
<ul style="font-size:13px;line-height:1.9;padding-left:20px;margin-top:8px;color:var(--text-primary);opacity:0.9;">
  <li>Synchronous writes to PostgreSQL (ACID guarantees) — not Cassandra or eventual consistency</li>
  <li>Idempotency keys are required before every external API call</li>
  <li>The ledger is a legal document — treat it as such (append-only, backed up, replicated)</li>
  <li>Timeouts must result in a reconciliation job, not a retry storm</li>
</ul>
<p style="margin-top:10px;">Scale challenge: at 1M transactions/day, that's just ~12 TPS — trivially handled by a single PostgreSQL instance. Payment systems typically don't have a throughput problem; they have a <strong>correctness-under-failure</strong> problem. Design for that.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Two Answers That Land You the Offer</strong><br/><span style="color:var(--text-primary);opacity:0.9;"><strong>1. On double-charge prevention:</strong> "The idempotency key is generated client-side before the first call. It's tied to a specific payment intent — order ID + attempt number. The key is stored in the payments table with a unique constraint. If the payment processor call times out and we retry, we send the same idempotency key to both our own service and to Stripe. Both layers deduplicate independently. Belt and suspenders." <strong>2. On consistency model:</strong> "For financial data we use synchronous writes to PostgreSQL with SERIALIZABLE isolation on balance checks. Eventual consistency is not acceptable here — if two requests concurrently see the same balance and both approve a payment, we've overdrafted the account. Strong consistency is the only option."</span></div>`,
        },
      ],
    },

    /* 3 */ {
      id: "p17t3",
      title: "Design a Ride-Sharing Platform",
      subtitle:
        "Uber / Lyft architecture — real-time geolocation, driver matching, surge pricing, and trip lifecycle management.",
      sections: [
        {
          icon: "📋",
          color: "si-blue",
          title: "Requirements & Estimation",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:8px;">Requirements</div>
    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.9;color:var(--text-primary);opacity:0.9;">
      <li>Rider requests a trip from location A to B</li>
      <li>System matches the nearest available driver</li>
      <li>Driver and rider track each other in real-time on the map</li>
      <li>Surge pricing based on supply/demand in an area</li>
      <li>1M active drivers, 5M rides/day, 200M DAU (Uber global scale)</li>
    </ul>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:6px;">The Core Engineering Challenge</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Every active driver sends their GPS location every 4 seconds. 1M active drivers × 1 update per 4 seconds = 250,000 location writes per second. We need a spatial data structure that can answer "find me the 5 nearest available drivers to lat/long X,Y" in under 50ms, at 250K writes/sec.</p>
  </div>
</div>`,
        },
        {
          icon: "🗺️",
          color: "si-purple",
          title: "Geohashing — The Key Technical Insight",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">PROBLEM: How do you index and query by geographic location efficiently?

GEOHASH encodes a (latitude, longitude) pair into a short base-32 string:
  Delhi: 28.6139, 77.2090 → geohash = "ttnd1e5p"
  Connaught Place: 28.6315, 77.2167 → "ttnd1kgu"

KEY PROPERTY: Nearby locations share a common prefix!
  ttnd1   ← ~10km² cell containing all of central Delhi
  ttnd1e  ← ~1km² cell (Lajpat Nagar area)
  ttnd1e5 ← ~100m² cell

FINDING NEARBY DRIVERS:
  Rider requests from geohash "ttnd1e5"  (precision level 7 = ~100m cell)
  Query Cassandra: SELECT * FROM drivers
                   WHERE geohash_prefix = 'ttnd1e5'
                     AND status = 'available'
  Also query the 8 neighboring cells (same prefix, adjacent):
    ttnd1e4, ttnd1e6, ttnd1eh, ttnd1e4, ... (8 neighbors)
  → Returns all available drivers within ~300m of rider

  If too few results: zoom out to prefix "ttnd1e" (1km radius)

Cassandra table:
  driver_locations {
    geohash_prefix TEXT,     -- partition key (e.g. "ttnd1e5")
    driver_id      UUID,     -- clustering key
    latitude       DOUBLE,
    longitude      DOUBLE,
    status         TEXT,     -- 'available' | 'on_trip' | 'offline'
    last_updated   TIMESTAMP,
    PRIMARY KEY (geohash_prefix, driver_id)
  }</div>`,
        },
        {
          icon: "🚗",
          color: "si-green",
          title: "Driver Matching Algorithm",
          body: `<div style="display:flex;flex-direction:column;gap:10px;">
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">1</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Query candidates:</strong> Fetch all available drivers within 1–2km of the rider using geohash prefix queries (see above). Typical result: 5–30 drivers.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">2</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Calculate ETA, not distance:</strong> Sort candidates by estimated time-of-arrival to the rider, not raw geographic distance. A driver 800m away facing traffic may arrive later than one 1.2km away on a clear road. Route ETA from Map Service (OSRM / Google Maps API).</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">3</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Offer to nearest first:</strong> Send ride request to Driver #1 with a 10-second accept window. If declined or timeout: send to Driver #2 in the ranked list. Driver #1 is marked "unavailable for this trip" to prevent duplicate offers.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">4</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Lock on acceptance:</strong> Redis distributed lock on driver_id when sending offer, released after accept/decline. Prevents the same driver receiving two simultaneous trip offers from two riders.</div></div>
</div>`,
        },
        {
          icon: "📈",
          color: "si-purple",
          title: "Trip Lifecycle & Surge Pricing",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">TRIP STATE MACHINE:
  REQUESTED → DRIVER_FOUND → DRIVER_EN_ROUTE
  → ARRIVED → TRIP_STARTED → TRIP_COMPLETED
  → PAYMENT_PROCESSING → PAID

  Abnormals:
  REQUESTED → NO_DRIVER_FOUND (retry or widen search radius)
  DRIVER_EN_ROUTE → DRIVER_CANCELLED (re-match, no charge)
  TRIP_STARTED → TRIP_CANCELLED_MID (partial charge, support ticket)

SURGE PRICING ALGORITHM:
  Every minute: for each geohash cell (1km²):
    demand = count(trip_requests in last 5 min in cell)
    supply  = count(available_drivers in cell)
    ratio   = demand / supply

    if ratio > 2.0: surge_multiplier = 1.5  (1.5× base fare)
    if ratio > 3.0: surge_multiplier = 2.0
    if ratio > 5.0: surge_multiplier = 3.0

  surge_multipliers stored in Redis per geohash cell (TTL 2 min)
  Rider sees surge warning before confirming trip
  Purpose: incentivize drivers to move to high-demand cells

REAL-TIME LOCATION UPDATES (during trip):
  Both driver and rider apps send GPS every 2 seconds
  Location Service writes to Redis (latest position per user)
  WebSocket push to the other party's app
  Historical trip path stored to Cassandra (for replay, disputes)</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Ride-sharing is a <strong>write-heavy, spatially-indexed, real-time system</strong>. Three architectural choices define the design:</p>
<ul style="font-size:13px;line-height:1.9;padding-left:20px;margin-top:8px;color:var(--text-primary);opacity:0.9;">
  <li><strong>Geohashing</strong> is the key to scalable location indexing. Alternatives (PostGIS spatial indexes, k-d trees) don't horizontally scale to 250K writes/sec. Geohash prefix partitioning in Cassandra does.</li>
  <li><strong>Cassandra for location writes</strong> — time-series, write-heavy, geographically distributed. Redis for the latest position (O(1) lookup for real-time tracking).</li>
  <li><strong>ETA beats distance</strong> for matching quality. A system that naively uses Euclidean distance will provide worse matches in urban environments with complex routing. This distinction signals product awareness.</li>
</ul>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Walkthrough Template for Any Ride-Sharing Question</strong><br/><span style="color:var(--text-primary);opacity:0.9;">Frame your answer in 4 acts: <strong>1. Location ingestion</strong> — "1M drivers updating every 4s = 250K writes/sec. Cassandra with geohash partition key handles this." <strong>2. Driver discovery</strong> — "Geohash prefix query finds candidates in O(1); we also check 8 neighboring cells to handle boundary cases." <strong>3. Matching & locking</strong> — "Sort by ETA, sequential offers with 10s windows, Redis lock prevents double-offer race condition." <strong>4. Trip tracking</strong> — "During trip, WebSocket push from Location Service gives both parties sub-second position updates. Path stored in Cassandra for dispute resolution." This structure gets you to a complete answer in 20 minutes.</span></div>`,
        },
      ],
    },
  ],
};

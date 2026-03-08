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
          title: "The Pipeline",
          body: `
<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text"><strong>Code Push</strong> — Developer pushes to GitHub main branch.</div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text"><strong>CI Trigger</strong> — GitHub Actions / Jenkins / CircleCI picks up the push automatically.</div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text"><strong>Build</strong> — Run <code>npm install && npm run build</code>. Compile, type-check.</div></div>
  <div class="step-item"><div class="step-num">4</div><div class="step-text"><strong>Test</strong> — Run unit tests, integration tests. If any fail → pipeline stops, notify dev.</div></div>
  <div class="step-item"><div class="step-num">5</div><div class="step-text"><strong>Static Analysis</strong> — Run ESLint, SAST security scanner (e.g., Snyk).</div></div>
  <div class="step-item"><div class="step-num">6</div><div class="step-text"><strong>Docker Build</strong> — Build container image, tag with commit SHA.</div></div>
  <div class="step-item"><div class="step-num">7</div><div class="step-text"><strong>Push to Registry</strong> — Push to ECR / DockerHub.</div></div>
  <div class="step-item"><div class="step-num">8</div><div class="step-text"><strong>Deploy to Staging</strong> — Auto-deploy to staging environment. Run smoke tests.</div></div>
  <div class="step-item"><div class="step-num">9</div><div class="step-text"><strong>Deploy to Production</strong> — Manual approval gate (or fully automatic with tests). Rolling deployment.</div></div>
</div>
<p>Goal: Code merged → production in 10 minutes with full test coverage. No manual steps.</p>`,
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
          title: "Strategies Compared",
          body: `
<table class="compare-table"><thead><tr><th>Strategy</th><th>How</th><th>Rollback</th><th>Risk</th></tr></thead><tbody>
<tr><td><strong>Recreate</strong></td><td>Stop all v1, start all v2</td><td>Redeploy v1</td><td>Downtime!</td></tr>
<tr><td><strong>Rolling</strong></td><td>Replace instances one by one (10% → 20% → ... → 100%)</td><td>Stop rollout</td><td>Brief mixed versions</td></tr>
<tr><td><strong>Blue-Green</strong></td><td>Full v2 environment ready → switch traffic 0% → 100%</td><td>Instant (switch back)</td><td>Double infra cost</td></tr>
<tr><td><strong>Canary</strong></td><td>Send 5% users to v2 → monitor → gradually increase</td><td>Send 0% to v2</td><td>Very low — real users test</td></tr>
<tr><td><strong>Feature Flag</strong></td><td>Deploy code, but enable feature only for specific users via flag</td><td>Toggle flag off</td><td>Lowest risk</td></tr>
</tbody></table>`,
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
          title: "The Three Pillars",
          body: `
<div class="info-grid">
  <div class="info-card blue"><div class="info-card-title">📊 Metrics</div><p>Numeric measurements over time. CPU%, request rate, error rate, latency p50/p99, DB connections. Tools: Prometheus, CloudWatch, Datadog. Used for: alerting on threshold breaches.</p></div>
  <div class="info-card green"><div class="info-card-title">📋 Logs</div><p>Timestamped text records of events. "Order 456 failed: insufficient stock at 10:23:45 UTC". Tools: CloudWatch Logs, ELK Stack. Used for: debugging specific incidents.</p></div>
  <div class="info-card yellow"><div class="info-card-title">🔍 Traces</div><p>End-to-end request flow across services. "This request took 500ms: 50ms in API Gateway + 200ms DB query + 250ms in Payment Service." Tools: Jaeger, AWS X-Ray. Used for: finding performance bottlenecks.</p></div>
</div>
<div class="callout tip"><div class="callout-icon">💡</div><div>Great observability means you can answer: "What is broken?" (metrics), "Why is it broken?" (logs), and "Where is it slow?" (traces). All three together = full observability.</div></div>`,
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
          title: "Definitions",
          body: `
<div class="step-list">
  <div class="step-item"><div class="step-num">SLI</div><div class="step-text"><strong>Service Level Indicator</strong> — The actual metric you measure. E.g., "percentage of requests with latency &lt; 200ms over the last 30 days."</div></div>
  <div class="step-item"><div class="step-num">SLO</div><div class="step-text"><strong>Service Level Objective</strong> — Internal target for your SLI. E.g., "SLI should be ≥ 99.5%." Your team is responsible for meeting this.</div></div>
  <div class="step-item"><div class="step-num">SLA</div><div class="step-text"><strong>Service Level Agreement</strong> — External contract with customers. E.g., "We guarantee 99.9% availability. If we fail, you get a 10% service credit." Legal consequences if breached.</div></div>
</div>
<div class="diagram-box">SLO is stricter than SLA as a safety buffer:
  SLA (committed to customers): 99.9% availability = max 8.76 hours downtime/year
  SLO (internal target):        99.95% = max 4.38 hours downtime/year
  If SLO is violated → you have warning before SLA is breached.

Error Budget = 100% - SLO target
  SLO = 99.9% → Error Budget = 0.1% of requests can fail each month.
  Team exhausting error budget? → Freeze new features, focus on reliability.</div>`,
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
          title: "Good Alerting",
          body: `
<div class="key-list">
  <div class="key-item"><div class="key-bullet">✓</div><div><strong>Alert on symptoms, not causes</strong> — Alert on "user-facing error rate > 1%" not "CPU > 80%". High CPU that doesn't affect users = not an alert.</div></div>
  <div class="key-item"><div class="key-bullet">✓</div><div><strong>Alert only on actionable problems</strong> — If the alert fires but there's nothing you can do right now → not worth waking someone up at 3 AM.</div></div>
  <div class="key-item"><div class="key-bullet">✓</div><div><strong>Severity levels</strong> — P1 (wake someone up), P2 (fix next business day), P3 (log for investigation). Not everything needs a 3 AM page.</div></div>
  <div class="key-item"><div class="key-bullet">✓</div><div><strong>Runbooks</strong> — Every alert links to a runbook: "When this alert fires, do: 1) Check CloudWatch... 2) Check DB connections... 3) Restart pod if..."</div></div>
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
          title: "The Incident Lifecycle",
          body: `
<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text"><strong>Detect</strong> — PagerDuty alert fires. On-call engineer is paged. CloudWatch alarm: "5xx error rate > 5%".</div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text"><strong>Assess</strong> — How bad? How many users affected? Which services? Is it getting worse?</div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text"><strong>Mitigate first</strong> — Rollback, restart, failover, disable feature flag — STOP THE BLEEDING first. Root cause analysis comes later.</div></div>
  <div class="step-item"><div class="step-num">4</div><div class="step-text"><strong>Communicate</strong> — Update status page. Notify stakeholders. "We're investigating increased error rates on checkout. ETA unknown."</div></div>
  <div class="step-item"><div class="step-num">5</div><div class="step-text"><strong>Resolve</strong> — System stable. Update status page. Confirm with metrics.</div></div>
  <div class="step-item"><div class="step-num">6</div><div class="step-text"><strong>Post-mortem</strong> — Within 48hr: blameless post-mortem document. What happened, timeline, root cause, action items. Learning, not blame.</div></div>
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
          title: "Safe Migration Patterns",
          body: `
<div class="callout danger"><div class="callout-icon">🚨</div><div>Never run a migration that locks tables or renames/drops columns during deployment. Old code still running will fail!</div></div>
<div class="diagram-box">EXPAND-CONTRACT PATTERN for safe column rename (email → email_address):

Step 1 (Expand): Add NEW column, keep OLD column
  ALTER TABLE users ADD COLUMN email_address VARCHAR(255);
  
Step 2: Deploy code that writes to BOTH columns (backward compatible)

Step 3: Backfill — copy data from old to new:
  UPDATE users SET email_address = email WHERE email_address IS NULL;

Step 4: Deploy code that reads from NEW column only

Step 5 (Contract): Drop OLD column
  ALTER TABLE users DROP COLUMN email;

Takes multiple deployments but ZERO DOWNTIME. ✅

Tools: Flyway, Liquibase, Alembic (Python), Django migrations, Rails Active Record</div>`,
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
          title: "What & Why",
          body: `
<p>A <strong>feature flag</strong> (feature toggle) is a conditional in code that enables/disables functionality without redeployment.</p>
<div class="diagram-box">// Code in production:
if (featureFlags.isEnabled('new-checkout-flow', userId)) {
  return newCheckoutFlow(cart);
} else {
  return oldCheckoutFlow(cart);
}

Feature flag service controls who gets 'new-checkout-flow' = true:
  Phase 1: Internal team only (0.1% of users)
  Phase 2: 1% of users
  Phase 3: 10% of users
  Phase 4: All users
  Emergency OFF: Toggle flag off instantly — no deployment needed!

Tools: LaunchDarkly, AWS AppConfig, Unleash, custom Redis-backed flags.

Use cases: A/B testing, gradual rollout, kill switch, beta programs.</div>`,
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
          title: "Controlled Failure",
          body: `
<p><strong>Chaos Engineering</strong> = deliberately injecting failures into production (or staging) to verify that your system handles them gracefully. Netflix pioneered this with Chaos Monkey.</p>
<div class="diagram-box">Examples of chaos experiments:
  Kill a random EC2 instance → Does auto-scaling replace it? Do users notice?
  Increase DB latency by 500ms → Does the app timeout gracefully? Circuit breaker trip?
  Kill the Payment Service → Does Order Service fail fast (circuit breaker)? Or hang?
  Fill disk to 95% → Do alerts fire before 100%? Does app crash or degrade gracefully?
  Network partition: block traffic between AZ1 and AZ2 → Does multi-AZ failover work?

Hypothesis-driven:
  "We believe: if the User Service goes down, other services degrade gracefully with cached data."
  Run experiment → measure actual behavior → confirm or fix the assumption.

Netflix Chaos Monkey runs 24/7 in production, randomly killing instances. 
Their system is so resilient it doesn't matter!</div>`,
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
          title: "How to Plan Capacity",
          body: `
<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text"><strong>Measure baselines</strong> — Current: 1,000 req/sec, CPU at 40%, DB at 60% at peak.</div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text"><strong>Project growth</strong> — Revenue growing 20%/month → traffic growing 15%/month → in 6 months: 3,500 req/sec.</div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text"><strong>Find bottlenecks</strong> — At 3,500 req/sec with current infra: DB at 210% → DB is the bottleneck. Plan to add read replicas.</div></div>
  <div class="step-item"><div class="step-num">4</div><div class="step-text"><strong>Load test</strong> — Use k6 or Gatling to simulate 3,500 req/sec. Verify system handles it before the actual growth hits.</div></div>
  <div class="step-item"><div class="step-num">5</div><div class="step-text"><strong>Plan for events</strong> — Big Billion Day sale: expect 50x normal traffic. Pre-scale 2 days before. Disable non-critical features. Enable circuit breakers.</div></div>
</div>`,
        },
      ],
    },
  ],
};

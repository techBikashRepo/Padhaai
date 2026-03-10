/* Part 10 — Containers & Docker (5 topics) */
const PART10 = {
  id: "part10",
  icon: "🐳",
  title: "Part 10",
  name: "Containers & Docker",
  topics: [
    /* 1 */ {
      id: "p10t1",
      title: "What is a Container?",
      subtitle:
        "Like a lightweight VM — your app and its dependencies, packaged together.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;">A <strong>container</strong> is a self-contained execution unit that bundles your app code, runtime, libraries, and config into one portable package. Think of it like a <em>shipping container</em> — the same standard metal box that fits on any ship, truck, or crane regardless of what's inside. Your container runs identically on a developer's MacBook, a CI runner, or a production AWS server.</p>
<div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.2);border-radius:8px;padding:12px 16px;font-size:13px;margin-bottom:12px;">
<strong style="color:var(--accent);">🚢 The Shipping Container Analogy</strong><br/><span style="opacity:0.9;">Before standardised shipping containers (1950s), loading cargo required custom rigging per ship — slow, error-prone, and expensive. After standardisation, any crane, ship, or truck could handle any container with zero custom work. Docker containers did the same for software: one standard format, run anywhere.</span>
</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "The Real Problem Solved",
          body: `<p style="margin-bottom:14px;">The phrase <em>"it works on my machine"</em> was the source of enormous developer pain. Containers eliminated it by making YOUR machine the production environment.</p>
<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.05);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">❌ Without Containers — The Mismatch Problem</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">ShopKart developer Rahul runs Node 20 + npm 10 on macOS. The AWS production server runs Node 18 + npm 9 on Amazon Linux. A package that works in Node 20 uses a syntax not available in Node 18. Result: works in dev, crashes in prod. Hours wasted debugging environment differences.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(239,68,68,0.1);color:#ef4444;padding:3px 8px;border-radius:5px;">❌ Version mismatches crash prod</span>
      <span style="background:rgba(239,68,68,0.1);color:#ef4444;padding:3px 8px;border-radius:5px;">❌ "Works on my machine" syndrome</span>
      <span style="background:rgba(239,68,68,0.1);color:#ef4444;padding:3px 8px;border-radius:5px;">❌ Days wasted on environment setup</span>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✅ With Containers — The Exact Same Environment</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">ShopKart's Dockerfile pins Node 20.11-alpine. The same 85MB image runs locally, in GitHub Actions CI, in AWS ECS production. Dev → test → staging → production all run the <em>exact same container</em>. Zero environment drift, zero mystery bugs.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Identical everywhere</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Starts in milliseconds</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ 50MB vs 2GB for VMs</span>
    </div>
  </div>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Container vs Virtual Machine",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🖥️ Virtual Machine — Full OS Emulation</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">A VM includes a full guest OS (Windows/Linux kernel, drivers, system processes — 2GB+), virtualised hardware, and your app. The hypervisor (VMware, VirtualBox, AWS Nitro) emulates physical hardware. VMs boot in 1–5 minutes. Each VM is fully isolated — perfect for running multiple different OS types.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Full isolation</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Run any OS</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ 2GB+ per VM</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ 1-5 min startup</span>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📦 Container — Shared Kernel, Isolated Process</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Containers share the host OS kernel — they only package your app + libraries (not the full OS). Linux kernel namespaces provide process isolation; cgroups limit CPU/memory. ShopKart's Node.js container image is 85MB. On one EC2 instance with 16GB RAM, you can run 50+ containers simultaneously vs 4-5 VMs.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ 50-100MB per container</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Starts in milliseconds</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ 10x more containers per server than VMs</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ Linux only (on Linux host)</span>
    </div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p style="margin-bottom:14px;">Containers fundamentally changed the deployment model. Before containers, deploying meant: SSH into server, run shell scripts, hope the OS matches. With containers, the deployment artifact IS the environment. This enables:</p>
<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔄 Immutable Infrastructure</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Never SSH into a production server and change config files. Instead: build a new container image, deploy it, old containers die. Every deployment is deterministic and reversible. ShopKart rolls back by redeploying the previous image tag — no manual state cleanup.</p>
    <div style="margin-top:10px;font-size:12px;color:var(--accent);font-weight:600;">📌 Principle: Servers are cattle, not pets. Replace, don't repair.</div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">⚡ Horizontal Scaling in Seconds</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">During Diwali sale, ShopKart needs to scale from 3 to 30 Order Service instances in under 2 minutes. Each container starts in ~200ms. Kubernetes spins up 27 new containers from the same image. All identical. All serving traffic in 2 minutes. Try that with VMs (5-minute boot) or bare metal (hours).</p>
    <div style="margin-top:10px;font-size:12px;color:#10b981;font-weight:600;">📌 Scale: containers are the unit of horizontal scaling in modern architectures.</div>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">If you can't run your entire application stack locally with one command (<code>docker compose up</code>), your local dev environment is broken. Containers make this achievable — every developer gets the exact same Postgres version, Redis config, and app runtime. Onboarding a new engineer goes from a 2-day environment setup to a 15-minute docker compose pull.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 When asked "why use containers?"</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"Containers solve the environment consistency problem. The container image is the deployment artifact — it packages app + dependencies + runtime. Dev, CI, staging, and production all run the same image. For ShopKart, this means zero environment-related bugs in deployment. Containers also enable rapid horizontal scaling (200ms startup vs 5min for VMs) and efficient resource use (50 containers per EC2 instance vs 4 VMs). They're the foundation for Kubernetes orchestration at scale."</span>
</div>`,
        },
      ],
    },

    /* 2 */ {
      id: "p10t2",
      title: "Docker Basics",
      subtitle: "The most popular container platform — build, ship, run.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Docker</strong> is the tool that lets you build, run, and share containers. It has three core concepts: the <strong>Dockerfile</strong> (the recipe), the <strong>Image</strong> (the built artifact, like a frozen snapshot), and the <strong>Container</strong> (a running instance of that image). Think of an image as a cookie cutter and containers as the cookies — one mold, unlimited identical copies.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ShopKart Dockerfile Walkthrough",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📄 ShopKart Order Service Dockerfile</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Every instruction in a Dockerfile creates a <strong>layer</strong>. Docker caches layers — if nothing changed for npm install, it reuses the cached layer (saves 60 seconds on every rebuild). This is why COPY package.json comes before COPY . . — package.json rarely changes, source code always does.</p>
    <div style="background:rgba(0,0,0,0.15);border-radius:6px;padding:12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);overflow-x:auto;">
FROM node:20-alpine           <span style="color:#10b981;"># Minimal Linux + Node 20 (85MB total)</span><br/>WORKDIR /app                  <span style="color:#10b981;"># All subsequent commands run here</span><br/>COPY package*.json ./         <span style="color:#f59e0b;"># Layer 1: copy manifest (cached!)</span><br/>RUN npm ci --production       <span style="color:#f59e0b;"># Layer 2: install deps (cached if package.json unchanged)</span><br/>COPY . .                      <span style="color:#f59e0b;"># Layer 3: copy source (changes every commit)</span><br/>EXPOSE 3000<br/>CMD ["node", "src/server.js"]
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🚀 Build, Tag, Push to AWS ECR</div>
    <div style="background:rgba(0,0,0,0.15);border-radius:6px;padding:12px;font-size:12px;font-family:monospace;line-height:1.8;color:var(--text-primary);overflow-x:auto;">
docker build -t shopkart-orders:latest .<br/>docker tag shopkart-orders:latest 123456789.dkr.ecr.ap-south-1.amazonaws.com/orders:v2.4<br/>docker push 123456789.dkr.ecr.ap-south-1.amazonaws.com/orders:v2.4
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;margin-top:8px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Image: 85MB vs 2GB VM</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Layer cache: rebuild in 8s not 90s</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Tagged by commit SHA for traceability</span>
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
    <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:var(--text-primary);">❌ Running as root inside the container</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;">If an attacker exploits your app and you're running as root, they get root on the host. Always add <code>USER node</code> before CMD to drop to a non-privileged user.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(239,68,68,0.03);">
    <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:var(--text-primary);">❌ Copying node_modules into the image</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;">Add <code>node_modules</code> to <code>.dockerignore</code>. Let <code>npm ci</code> install inside the container. Your local node_modules might have platform-specific native bindings (macOS ≠ Linux).</p>
  </div>
  <div style="padding:14px 16px;background:rgba(239,68,68,0.03);">
    <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:var(--text-primary);">❌ Hardcoding secrets in Dockerfile or image</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;">Never <code>ENV DATABASE_PASSWORD=supersecret</code> in Dockerfile. Anyone who pulls the image can read it. Pass secrets at runtime via environment variables from AWS Secrets Manager or ECS task definitions.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p style="margin-bottom:14px;">The Docker image is your <strong>deployment artifact</strong> — the exact same binary that was tested in CI is what runs in production. This is the principle of <strong>immutable artifacts</strong>. Combined with versioned image tags (orders:v2.4 instead of orders:latest in production), you get full deployment traceability and instant rollback: just redeploy v2.3.</p>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Build once, deploy everywhere. Your CI pipeline builds one image, tags it with the commit SHA (<code>orders:abc1234</code>), pushes to ECR. The same image.goes to staging, gets tested, then promotes to production. No rebuild between environments. What you test is exactly what you deploy.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Key Docker concept in interviews</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">When asked about Docker layer caching: "We order Dockerfile instructions from least-changed to most-changed. Package.json rarely changes, so npm ci is cached. Source code changes every commit. This reduces build time from 90 seconds to 8 seconds on code-only changes. In a CI pipeline that runs 50 times/day, this saves 70 minutes/day in build time." Showing you optimise builds demonstrates production mindset.</span>
</div>`,
        },
      ],
    },

    /* 3 */ {
      id: "p10t3",
      title: "Docker Compose",
      subtitle:
        "Running multi-container applications locally with one command.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Docker Compose</strong> is a tool for defining and running multi-container applications. You describe your entire stack (API server + database + cache + workers) in one <code>docker-compose.yml</code> file and start everything with <code>docker compose up</code>. Without Compose, spinning up ShopKart locally requires running 5+ separate docker commands and manually linking containers. Compose makes it one command.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ShopKart Local Dev Stack",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:8px;">📄 docker-compose.yml for ShopKart</div>
    <div style="background:rgba(0,0,0,0.15);border-radius:6px;padding:12px;font-size:11.5px;font-family:monospace;line-height:1.8;color:var(--text-primary);overflow-x:auto;">
services:<br/>
&nbsp;&nbsp;api:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;build: .                     <span style="color:#10b981;"># Build from local Dockerfile</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;ports: ["3000:3000"]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;environment:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DATABASE_URL: postgres://user:pass@db:5432/shopkart<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;REDIS_URL: redis://cache:6379<br/>
&nbsp;&nbsp;&nbsp;&nbsp;depends_on: [db, cache]      <span style="color:#f59e0b;"># Wait for DB + cache to be healthy</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;volumes: ["./src:/app/src"]  <span style="color:#f59e0b;"># Live reload in dev</span><br/>
<br/>
&nbsp;&nbsp;db:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;image: postgres:16-alpine<br/>
&nbsp;&nbsp;&nbsp;&nbsp;environment:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;POSTGRES_DB: shopkart<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;POSTGRES_PASSWORD: devpass<br/>
&nbsp;&nbsp;&nbsp;&nbsp;volumes: ["pgdata:/var/lib/postgresql/data"]<br/>
<br/>
&nbsp;&nbsp;cache:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;image: redis:7-alpine<br/>
&nbsp;&nbsp;&nbsp;&nbsp;command: redis-server --maxmemory 256mb<br/>
<br/>
volumes:<br/>
&nbsp;&nbsp;pgdata:  <span style="color:#10b981;"># Persists DB data between restarts</span>
    </div>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🚀 Key Commands</div>
    <div style="background:rgba(0,0,0,0.15);border-radius:6px;padding:10px 12px;font-size:12px;font-family:monospace;line-height:1.9;color:var(--text-primary);">
docker compose up -d          <span style="color:#10b981;"># Start everything in background</span><br/>docker compose logs -f api    <span style="color:#10b981;"># Follow API logs</span><br/>docker compose exec db psql -U user shopkart  <span style="color:#f59e0b;"># Open DB shell</span><br/>docker compose down           <span style="color:#10b981;"># Stop and remove containers</span><br/>docker compose down -v        <span style="color:#ef4444;"># Also removes volumes (wipes DB!)</span>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;margin-top:10px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Onboard engineer in 5 min</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Identical DB/Redis versions for all devs</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Live code reload with volume mount</span>
    </div>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p style="margin-bottom:14px;">Docker Compose is for <strong>local development</strong> — not for production. In production, use Kubernetes or AWS ECS which provide health checks, auto-restart, rolling deployments, and cluster-level scheduling. A common mistake is trying to run Compose in production and realising it lacks service discovery, rolling updates, and auto-healing.</p>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">A new engineer joining ShopKart should be able to clone the repo and run <code>docker compose up</code> to get a fully functional local environment with the right Postgres version, Redis config, and seeded test data. If your team says "here's a 20-step setup doc", you need Compose. The 15-minute onboarding is worth every minute invested in the Compose file.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Compose vs production orchestration</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"We use Docker Compose for local development — spins up the full stack in one command, ensuring every developer has the same env. For production, we use AWS ECS Fargate — it handles health checks, rolling deployments, auto-scaling, and service discovery. Compose is developer tooling; ECS/Kubernetes is production infrastructure. Never run Compose in production."</span>
</div>`,
        },
      ],
    },

    /* 4 */ {
      id: "p10t4",
      title: "AWS ECS & ECR",
      subtitle:
        "Running containers in production on AWS — no Kubernetes complexity.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>ECR</strong> (Elastic Container Registry) is AWS's private Docker image registry — like DockerHub but private and tightly integrated with AWS. <strong>ECS</strong> (Elastic Container Service) is AWS's container orchestration service — it runs your containers in production, handles health checks, rolling deployments, and auto-scaling. ECS Fargate removes the need to manage EC2 instances entirely: you just say "run 5 copies of this container with 1 vCPU and 2GB RAM" and AWS handles the rest.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "ShopKart ECS Fargate Production Deployment",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">📦 ECR — Store Images</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">CI pipeline pushes each build to ECR tagged with the commit SHA. ECR stores all versions — you can roll back by redeploying any previous tag. ECR is private (only your AWS account can pull). IAM roles control access — the ECS task role gets <code>ecr:GetDownloadUrlForLayer</code> automatically.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Private registry</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Vulnerability scanning built-in</span>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🚀 ECS Fargate — Run Containers</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;"><strong>Task Definition</strong>: Run image <code>orders:v2.4</code> with 1 vCPU + 2GB RAM, port 3000, DB_URL from Secrets Manager, CloudWatch logs enabled. <strong>Service</strong>: Keep 5 tasks running at all times across 3 AZs. Replace any task that fails health checks. Rolling deployment: start new version before stopping old. <strong>Result</strong>: 5 replicas of ShopKart Order Service, auto-healed, zero-downtime deployments.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ No EC2 to manage</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Auto-healing (replaces crashed containers)</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Rolling deploys: zero downtime</span>
      <span style="background:rgba(245,158,11,0.1);color:#f59e0b;padding:3px 8px;border-radius:5px;">⚠️ More expensive than EC2 (Fargate premium)</span>
    </div>
    <div style="margin-top:10px;font-size:12px;color:#10b981;font-weight:600;">📌 Use for: most production containerised workloads; avoid over-scaling Kubernetes complexity.</div>
  </div>
  <div style="padding:14px 16px;background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔄 Zero-Downtime Deploy Flow</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Push orders:v2.5 to ECR → Update ECS service image to v2.5 → ECS starts 1 new v2.5 task → ALB health check passes → ECS stops 1 old v2.4 task → Repeats until all 5 tasks are v2.5. At no point is the service degraded. Rollback: update service to v2.4 — same process in reverse.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — EC2 Mode vs Fargate",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">☁️ EC2 Mode — More Control, More Work</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">You provision and manage EC2 instances that form the container cluster. ECS places containers on these instances. You control instance types, maintain capacity, patch OS. 15–20% cheaper than Fargate for steady workloads. Choose when: you need GPU instances, specific instance families, or Spot instance savings.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">✨ Fargate — Serverless Containers (Recommended for most)</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">AWS manages all servers. You declare CPU/memory per task. No instance management, no capacity planning for the cluster itself. Scale from 2 tasks to 200 tasks without thinking about underlying servers. 15–20% more expensive but saves DevOps engineering time worth far more.</p>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Start with ECS Fargate. The cost difference vs EC2 mode is minor; the operational savings are huge. Only migrate to EC2 mode or Kubernetes when you need specific instance types, extreme density, or have 100+ services with a dedicated platform team.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 Containerised deployments questions</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"We use ECS Fargate for all our microservices. ECR stores images tagged by commit SHA. Our CI pipeline builds, scans for vulnerabilities, pushes to ECR, then triggers an ECS rolling deployment. Each service has health checks — new task must pass 3 consecutive checks before old task is removed. For the Order Service (critical path), we use blue-green deployment via CodeDeploy integration for instant rollback capability."</span>
</div>`,
        },
      ],
    },

    /* 5 */ {
      id: "p10t5",
      title: "Kubernetes Concepts",
      subtitle: "The industry-standard container orchestration platform.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p style="margin-bottom:12px;"><strong>Kubernetes</strong> (K8s) is a system for automating deployment, scaling, and management of containerised applications. Think of it as the operating system for your cluster: it schedules containers on machines, auto-heals failures, scales based on load, and provides service discovery. If ECS is a sedan (comfortable, limited), Kubernetes is a truck (complex, handles anything). Most teams above 50 services on multiple clouds use Kubernetes.</p>`,
        },
        {
          icon: "🏠",
          color: "si-green",
          title: "Core K8s Objects in ShopKart",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🐻 Pod — The Smallest Unit</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">One or more containers sharing a network namespace and storage volumes. A ShopKart Order Service pod runs 1 container (Node.js app) + 1 sidecar container (Datadog APM agent). Pods are ephemeral — they can die any time. Never reference a pod directly; use a Deployment + Service.</p>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔄 Deployment — Desired State Declaration</div>
    <p style="margin:0 0 8px;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">"Keep 5 replicas of the Order Service pod running". If 2 pods crash, Kubernetes restarts them. For a new image version, rolling update: start new pod, wait for healthcheck, terminate old pod. Repeats for all 5. Zero downtime, automated.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;">
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Self-healing</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Rolling updates built-in</span>
      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:3px 8px;border-radius:5px;">✅ Rollback: kubectl rollout undo</span>
    </div>
  </div>
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(139,92,246,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🌐 Service — Stable Network Endpoint</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Pods have ephemeral IPs that change on restart. A Service provides a stable virtual IP + DNS name (<code>order-service.shopkart.svc</code>) that load-balances across all healthy Order Service pods. Other services call this DNS name, never individual pod IPs.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(245,158,11,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">↔️ HPA — Horizontal Pod Autoscaler</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">"Keep average CPU at 70%. Scale Order Service from 5 to 50 pods if needed." HPA monitors CPU/memory/custom metrics and automatically adds or removes pods. During Diwali sale: traffic spikes 20x → HPA scales from 5 → 50 Order pods in ~3 minutes.</p>
  </div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — ECS vs Kubernetes",
          body: `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:14px 16px;border-bottom:1px solid var(--border);background:rgba(99,102,241,0.06);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">☁️ Choose ECS Fargate when:</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">You're on AWS only, less than ~30 services, small DevOps team. Fargate is fully managed — no cluster administration. Operational overhead is low. ShopKart at 10 microservices should be on ECS, not Kubernetes.</p>
  </div>
  <div style="padding:14px 16px;background:rgba(16,185,129,0.04);">
    <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:6px;">🔧 Choose Kubernetes (EKS/GKE/AKS) when:</div>
    <p style="margin:0;font-size:13px;color:var(--text-primary);opacity:0.85;line-height:1.65;">Multi-cloud or cloud portability required. 50+ services needing fine-grained resource management. Platform team exists to manage the cluster. Need advanced features: custom schedulers, service mesh (Istio), canary via Argo Rollouts. Flipkart-scale ShopKart needs K8s.</p>
  </div>
</div>
<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:var(--accent);">🏛️ The Architect's Rule</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">Don't operate Kubernetes because it's cool. The learning curve is steep, and cluster management is a full-time job for a platform team. A startup with 3 engineers using ECS Fargate ships 10x faster than the same 3 engineers wrestling with Kubernetes cluster management. Use managed K8s (EKS, GKE) — you never want to manage the control plane yourself.</span>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;line-height:1.65;">
  <strong style="color:#f59e0b;">🎯 K8s vs ECS in system design</strong><br/>
  <span style="color:var(--text-primary);opacity:0.9;">"For ShopKart's current scale (15 services, 5-person platform team), we use ECS Fargate — it gives us container orchestration, auto-scaling, and rolling deployments without Kubernetes operational overhead. If we scaled to 100+ services with 20+ engineers, we'd migrate to EKS for the richer API surface: HPA on custom metrics, pod disruption budgets, and service mesh for observability. The key K8s concept is declarative desired state — you declare what you want (5 replicas), K8s continuously reconciles reality to match."</span>
</div>`,
        },
      ],
    },
  ],
};

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
          title: "Simple Explanation",
          body: `
<p>A <strong>container</strong> is a standard unit of software that packages code and all its dependencies so the application runs consistently across environments — your laptop, CI, production.</p>
<div class="diagram-box">"It works on my machine!" — The famous developer excuse.
Containers solve this: "It works anywhere, because my machine IS the environment."

WITHOUT CONTAINERS:
  Developer: Node 18, npm 9, Ubuntu 22.04
  Server: Node 16, npm 8, Amazon Linux 2
  → "undefined is not a function" in production 😤

WITH CONTAINERS:
  Container image includes: Node 18.12 + npm 9.2 + your code + package.json
  → Same container runs identically on ANY machine with Docker installed. ✅

Container vs Virtual Machine:
  VM: Full OS (2GB), slow to start (1 min), heavy isolation
  Container: Shares host OS kernel (50MB), starts in milliseconds, lightweight</div>`,
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
          title: "Dockerfile",
          body: `
<div class="diagram-box">Dockerfile — recipe for building a container image:

FROM node:18-alpine           ← base image (minimal Alpine Linux + Node 18)
WORKDIR /app                  ← working directory inside container
COPY package*.json ./         ← copy package files first (for layer caching)
RUN npm ci --production       ← install dependencies (cached if package.json unchanged)
COPY . .                      ← copy source code
EXPOSE 3000                   ← document that container listens on 3000
CMD ["node", "server.js"]     ← command to run when container starts

Build: docker build -t amazon-orders:latest .
Run:   docker run -p 3000:3000 -e DATABASE_URL=... amazon-orders:latest
Tag:   docker tag amazon-orders:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/orders:v1.2
Push:  docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/orders:v1.2</div>`,
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
          title: "docker-compose.yml",
          body: `
<div class="diagram-box">version: "3.9"
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/amazon
      REDIS_URL: redis://cache:6379
    depends_on: [db, cache]
    volumes: ["./src:/app/src"]   ← live reload in dev

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: amazon
      POSTGRES_PASSWORD: pass
    volumes: ["pgdata:/var/lib/postgresql/data"]

  cache:
    image: redis:7-alpine
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

volumes:
  pgdata:

# Commands:
# docker compose up -d    ← start everything
# docker compose logs api ← view logs
# docker compose down     ← stop everything</div>`,
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
          title: "ECR + ECS",
          body: `
<div class="diagram-box">ECR (Elastic Container Registry):
  Private Docker image registry on AWS.
  Store your container images securely.
  
  Push image: docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/orders:v2.1

ECS (Elastic Container Service):
  Run containers on AWS without managing servers.
  
  Two launch modes:
  EC2 mode:      You manage EC2 instances. More control. More ops work.
  Fargate mode:  Serverless containers! AWS manages all servers. Just define CPU/RAM.
  
  ECS Concepts:
  Task Definition: "Run container image X with 1 vCPU, 2GB RAM, port 3000 open"
  Service:         "Keep 5 instances of this task running. Replace if one dies."
  Cluster:         Group of tasks. Connected to ALB.

Deploy new version:
  Push new image → Update ECS service → Rolling deployment → Zero downtime! ✅</div>`,
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
          title: "Core Concepts",
          body: `
<div class="diagram-box">Kubernetes (K8s) orchestrates containers across many servers.

Key objects:
  Pod:         Smallest deployable unit. 1+ containers. Ephemeral (can die anytime).
  Deployment:  "Keep 5 replicas of this pod running. If any die, restart them."
  Service:     Stable network endpoint for a set of pods (load balances to them).
  Ingress:     HTTP routing to services (like path-based routing in ALB).
  ConfigMap:   Non-secret configuration key-values.
  Secret:      Encrypted credentials, tokens, passwords.

Example deployment:
  apiVersion: apps/v1
  kind: Deployment
  spec:
    replicas: 5
    template:
      spec:
        containers:
          - name: orders-api
            image: 123456789.dkr.ecr.../orders:v2.1
            resources:
              requests: {memory: "256Mi", cpu: "250m"}
              limits:   {memory: "512Mi", cpu: "500m"}

Managed K8s: AWS EKS, Google GKE, Azure AKS
(No need to manage control plane yourself)</div>`,
        },
      ],
    },
  ],
};

/* Part 1 — Networking Fundamentals (25 topics) — Deep Rewrite */
const PART1 = {
  id: "part1",
  icon: "🌐",
  title: "Part 1",
  name: "Networking Fundamentals",
  topics: [
    {
      id: "p1t1",
      title: "What is a Network?",
      subtitle:
        "The invisible highway that carries every click, search, and order.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>network</strong> is a group of computers and devices connected together so they can share information. That's it. When Rahul opens ShopKart on his phone and sees a product page, a network is what carried that page from a server thousands of kilometres away to his screen in under a second.</p>
<p>Think of a network exactly like a road system. Servers are like warehouses. Your browser is the delivery van. Data is the package. The network is the road connecting them all.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why This Concept Exists",
          body: `<p>Before networks, every computer was an island. A file on one machine could not reach another machine without physically carrying a disk. Engineers needed a way to share resources, data, and computation. Networks were the answer. The internet itself is just the world's largest network — millions of smaller networks all connected together.</p>
<p>Without networks, there is no ShopKart, no Amazon, no email, no anything. Every concept in system design — load balancers, CDNs, APIs, databases — all depend on a network carrying data between machines.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Real World Example",
          body: `<p>Rahul is in Mumbai. He opens <strong>shopkart.com</strong> on his phone. Here is what actually happens on the network:</p>
<ol>
  <li>His phone sends a request through his Wi-Fi router to his ISP (like Jio or Airtel)</li>
  <li>The ISP forwards it across fiber cables to ShopKart's servers in a data center</li>
  <li>The server prepares the HTML page and sends it back through the same chain</li>
  <li>Rahul's browser renders the page</li>
</ol>
<p>This entire journey — Mumbai living room to data center and back — happens in roughly 50–200 milliseconds. That is the network at work.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Visual Architecture",
          body: `<div class="diagram-box">Rahul's Phone
      ↓
  Wi-Fi Router (Home)
      ↓
  ISP (Jio / Airtel)
      ↓
  Internet Backbone (undersea cables, fiber)
      ↓
  ShopKart Data Center
      ↓
  Load Balancer
      ↓
  App Server → Database
      ↑
  (Response travels back the same path in reverse)</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Assuming networks are reliable.</strong> Networks drop packets, introduce lag, and partition. Design every system as if the network WILL fail — because it will.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Ignoring network cost.</strong> Transferring data across data centers or regions costs money and time. Architects always ask: "Can we reduce the data that travels over the wire?"</div></div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>When designing ShopKart, an architect's first question is: <em>"How does data move between every component?"</em> Every arrow in a system design diagram represents a network call. Every network call has latency, can fail, and costs something. Minimising network hops, keeping related data close together, and caching frequently needed data near the user — these are the foundations of every high-performance system.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">What Interviewers Expect</div><div class="interview-q">When asked to design any system, always start by describing how the network carries data between components. Interviewers look for candidates who instinctively think about latency, bandwidth, and failure modes — not just happy-path data flow. Mention that networks are unreliable and explain how your design handles that.</div></div>`,
        },
      ],
    },

    {
      id: "p1t2",
      title: "LAN vs WAN vs Internet",
      subtitle:
        "Three scopes of networking — from your office to the entire planet.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>LAN</strong> (Local Area Network) is a network within a small area — your home, office, or data center. <strong>WAN</strong> (Wide Area Network) connects multiple LANs across large distances. The <strong>Internet</strong> is the global WAN — the network of all networks.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why This Distinction Matters",
          body: `<p>Data travelling within a LAN is fast (microseconds, no cost). Data travelling over a WAN or the internet is slower and has real cost. Architects make decisions based on where data lives and where it needs to go. This is why keeping a database and its application server in the same data center (same LAN) is dramatically faster than accessing a remote database over the internet.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Example",
          body: `<p>ShopKart's Mumbai data center has dozens of servers: app servers, database servers, Redis cache servers. These all communicate over a <strong>LAN</strong> — high-speed connections within the same building. Response time: under 1ms.</p>
<p>ShopKart also has a disaster recovery data center in Delhi. Replicating the database from Mumbai to Delhi uses a <strong>WAN</strong> connection. Response time: 20–40ms.</p>
<p>When Rahul in his home connects to ShopKart, he is coming in over the <strong>Internet</strong>. Response time: 50–200ms.</p>
<p>This is why architects always try to keep frequently communicating systems on the same LAN — the speed difference is 100x to 1000x compared to internet calls.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Visual Diagram",
          body: `<div class="diagram-box">[ LAN — ShopKart Mumbai Data Center ]
  App Server ←→ Database (0.5ms)
  App Server ←→ Redis Cache (0.2ms)
  App Server ←→ Search Server (0.8ms)

       ↕  WAN (20–40ms)

[ LAN — ShopKart Delhi Backup Data Center ]
  Replica Database

       ↕  Internet (50–200ms)

[ Rahul's Home ]
  Phone ←→ Wi-Fi Router</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>A classic beginner mistake is placing a microservice in one AWS region while its database is in another region — paying 80–120ms per database call instead of &lt;1ms. Senior architects always co-locate tightly coupled systems. They only cross region/WAN boundaries when architecturally necessary (multi-region for disaster recovery or geographic distribution). Every WAN boundary in your diagram should be a deliberate, justified decision.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Key Point</div><div class="interview-q">When discussing database placement or microservice topology in a system design interview, always mention latency tiers. A 1ms LAN call vs 100ms internet call repeated thousands of times per second is a 100x difference in system performance. Interviewers reward candidates who think about data locality.</div></div>`,
        },
      ],
    },

    {
      id: "p1t3",
      title: "Public IP vs Private IP",
      subtitle:
        "Every device has an address — but not all addresses are visible to the world.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>Public IP</strong> is a globally unique address visible on the internet — like a building's street address. A <strong>Private IP</strong> is a local address only meaningful within a private network — like a room number inside the building. The outside world sees the building address; they don't see room numbers.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why This Exists",
          body: `<p>IPv4 only has ~4.3 billion addresses, but there are ~15 billion internet-connected devices. We ran out of public IPs years ago. The solution: <strong>NAT</strong> (Network Address Translation). Many devices in a private network share one public IP. Your home has one public IP from Jio, but 10 devices inside all get private IPs like 192.168.x.x. Only the router's public IP is visible to the outside world.</p>
<p>In cloud infrastructure, this model is equally important. ShopKart's database servers have only private IPs — they are completely unreachable from the internet. Only the load balancer has a public IP. This isolation is fundamental to security.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Architecture",
          body: `<div class="diagram-box">Internet (public)
    ↓
Load Balancer → Public IP: 13.234.56.78  ← only this is exposed
    ↓
[Private Network: 10.0.0.0/16]
  App Server 1  → 10.0.1.10  (private, not reachable from internet)
  App Server 2  → 10.0.1.11
  Database      → 10.0.2.5   (private, completely hidden)
  Redis Cache   → 10.0.2.6   (private, completely hidden)</div>
<p>An attacker scanning the internet cannot even find ShopKart's database — it has no public IP. This is architecture-level security, not just firewall rules.</p>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Accidentally giving a database a public IP</strong> on AWS or GCP. A huge percentage of data breaches happen this way. Always deploy databases in private subnets with no public IP.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Hardcoding private IPs</strong> in application config. Private IPs change when servers restart. Use DNS names or service discovery instead.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Security Design</div><div class="interview-q">When designing any system, put databases and internal services in private subnets with private IPs only. Only expose public-facing components (load balancers, CDN origins) to the internet. This is the basic AWS VPC security model — interviewers expect you to describe public vs private subnet separation as part of any cloud-based system design.</div></div>`,
        },
      ],
    },

    {
      id: "p1t4",
      title: "IP Address Structure (IPv4 & IPv6)",
      subtitle:
        "The global postal code system for every device on the internet.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>An <strong>IP address</strong> is a unique numerical label assigned to every device on a network. IPv4 uses 32 bits written as four numbers 0–255 (e.g., <code>192.168.1.1</code>). IPv6 uses 128 bits (e.g., <code>2001:0db8:85a3::8a2e:0370:7334</code>) and provides virtually unlimited addresses.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why Architects Care",
          body: `<p>Understanding IP structure helps you understand <strong>subnetting</strong> — dividing a network into smaller isolated segments. ShopKart's AWS VPC is divided into subnets: <code>10.0.1.0/24</code> for web servers, <code>10.0.2.0/24</code> for databases. This creates isolation — a compromised web server cannot directly reach the database subnet without explicit routing rules.</p>
<p>The <code>/24</code> notation (CIDR) means the first 24 bits are the network address. This gives 256 possible host addresses (the last 8 bits vary). A <code>/16</code> gives 65,536 addresses. Cloud platforms like AWS require you to understand CIDR when setting up VPCs.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "IP Ranges Used in Practice",
          body: `<div class="diagram-box">Private IP Ranges (RFC 1918):
  10.0.0.0    – 10.255.255.255   /8   (16M addresses)  ← AWS VPCs use this
  172.16.0.0  – 172.31.255.255   /12  (1M addresses)
  192.168.0.0 – 192.168.255.255  /16  (65K addresses) ← Home routers use this

ShopKart VPC Design:
  10.0.0.0/16    → Entire VPC
  10.0.1.0/24    → Public Subnet (Load Balancers)       ← can reach internet
  10.0.2.0/24    → Private Subnet (App Servers)          ← internal only
  10.0.3.0/24    → Database Subnet (RDS, Redis)          ← most restricted</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>When designing cloud infrastructure, architects plan IP ranges before writing any code. You must decide: how many subnets? How many hosts per subnet? Can these two subnets communicate? (Requires routing + security group rules.) VPC peering between two networks only works if their CIDR ranges don't overlap — a critical constraint when merging systems or connecting to partner networks. Planning IP space early prevents painful re-architecture later.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Cloud Architecture</div><div class="interview-q">For senior roles, interviewers may ask you to explain VPC design. Know that a /16 VPC gives you 65,536 IPs and you carve it into smaller /24 subnets per tier. Each subnet lives in one Availability Zone. Multi-AZ requires multiple subnets. This is foundational AWS/GCP networking architecture.</div></div>`,
        },
      ],
    },

    {
      id: "p1t5",
      title: "Ports & Sockets",
      subtitle:
        "Addresses tell you which building — ports tell you which door to knock on.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>port</strong> is a logical channel number (0–65535) that identifies a specific process or service on a server. While an IP address routes traffic to a machine, the port routes it to the right application. A <strong>socket</strong> is the combination of IP address + port number — it uniquely identifies one end of a network connection.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why Ports Exist",
          body: `<p>A single ShopKart server runs many services simultaneously — a web server on port 443, a metrics agent on port 9090, an SSH daemon on port 22, a Node.js app on port 3000. Without ports, incoming data would arrive at the machine with no way to know which application should handle it. Ports solve the multiplexing problem.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Port Map",
          body: `<div class="diagram-box">Well-Known Ports:
  Port 80   → HTTP (unencrypted web traffic)
  Port 443  → HTTPS (encrypted web — shopkart.com)
  Port 22   → SSH (admin terminal access to servers)
  Port 5432 → PostgreSQL database
  Port 6379 → Redis cache
  Port 27017 → MongoDB

ShopKart Server (10.0.1.10):
  :443 → Nginx (handles HTTPS, forwards to app)
  :3000 → Node.js App Server
  :6379 → Redis Cache
  
Security Group Rules (firewall):
  Allow 443 from: 0.0.0.0/0 (everyone — public website)
  Allow 5432 from: 10.0.2.0/24 only (only app servers can reach DB)
  Allow 22 from: 10.0.5.0/24 only (only bastion host can SSH)</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Opening port 5432 (postgres) or 6379 (Redis) to 0.0.0.0/0</strong> — This exposes your database to the entire internet. Botnets scan these ports continuously. This is how databases get ransomwared.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Running your app directly on port 80/443</strong> as root. Use Nginx or a load balancer as the public-facing layer. Your app should run on an unprivileged high port (3000, 8080).</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Security Design</div><div class="interview-q">Know default ports cold: 80 (HTTP), 443 (HTTPS), 22 (SSH), 3306 (MySQL), 5432 (Postgres), 6379 (Redis), 27017 (MongoDB). When designing systems, a key security principle is: no database port should ever be open to the public internet. Security group / firewall rules restrict which IP ranges can reach which ports.</div></div>`,
        },
      ],
    },

    {
      id: "p1t6",
      title: "Router vs Switch",
      subtitle:
        "Switches connect devices within a network; routers connect networks to each other.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>switch</strong> operates at Layer 2 (Data Link) and connects devices within the same local network using MAC addresses. A <strong>router</strong> operates at Layer 3 (Network) and connects different networks using IP addresses. A switch is like an internal office switchboard. A router is like the post office that routes mail between cities.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Data Center Example",
          body: `<div class="diagram-box">ShopKart Mumbai Data Center

[Top-of-Rack Switch]
  ├── App Server 1 (10.0.2.10)
  ├── App Server 2 (10.0.2.11)
  ├── App Server 3 (10.0.2.12)
  └── App Server 4 (10.0.2.13)
  (All in same subnet, talk via switch at microsecond speeds)

       ↓ 

[Core Router]
  Routes traffic between subnets:
  10.0.2.0/24 (App Servers) ←→ 10.0.3.0/24 (Databases)
  
       ↓ 

[Border Router / Internet Gateway]
  Routes traffic from 10.0.0.0/16 (internal) ←→ Internet (0.0.0.0/0)</div>
<p>In AWS, these concepts map to: <strong>route tables</strong> (routing), <strong>VPC subnets</strong> (switched local segments), and <strong>Internet Gateways</strong> (border routers).</p>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>In cloud environments, you rarely think about physical switches and routers — AWS/GCP abstract them into VPCs, subnets, and route tables. But the mental model holds: anything in the same subnet communicates cheaply (switch-level). Traffic crossing subnets or going to the internet crosses a router boundary — potentially incurring latency, cost, and security scrutiny (security group rules). Every subnet boundary in your architecture diagram represents a routing decision.</p>`,
        },
      ],
    },

    {
      id: "p1t7",
      title: "Packet Switching",
      subtitle:
        "How data actually travels across the internet — in tiny independent pieces.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>Packet switching</strong> breaks data into small chunks called <strong>packets</strong> (typically 1,500 bytes for Ethernet), sends each packet independently across the network via the best available route, and reassembles them at the destination. The internet is fundamentally a packet-switched network.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why Not Send Data as One Piece?",
          body: `<p>Before packet switching, telephone networks used <strong>circuit switching</strong> — a dedicated physical path was reserved for the entire duration of a call. This was wildly inefficient: the reserved path sat idle during silences. Packet switching allows thousands of conversations to share the same wire simultaneously — each gets tiny time slices. This is how the internet carries billions of simultaneous connections on finite infrastructure.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Rahul's Product Page Request",
          body: `<div class="diagram-box">Rahul requests the ShopKart homepage (100KB HTML + CSS + JS)

The 100KB is split into ~67 packets of 1,500 bytes each.

Each packet independently travels:
  Packet 1:  Mumbai → Delhi → London → Back → Mumbai  (50ms)
  Packet 2:  Mumbai → Singapore → Mumbai  (30ms) — different route!
  Packet 3:  Mumbai → Direct → Mumbai  (20ms)

At Rahul's phone, TCP:
  ✅ Checks which packets arrived
  ✅ Requests re-transmission of any dropped packets
  ✅ Reassembles all 67 packets in correct order
  → Browser renders the page

Packets take different routes but arrive at the same destination.</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<p>Treating the network as a perfect, lossless, ordered pipe. In reality, packets can: arrive out of order, be duplicated, be dropped (routers discard packets under load), arrive corrupted. TCP hides most of this from your application, but UDP exposes it. High-performance system design — like real-time video or gaming — must account for this reality explicitly.</p>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Packet size and network MTU (Maximum Transmission Unit) matter in high-throughput systems. "Jumbo frames" (9,000 byte MTU) on internal networks dramatically improve throughput for large data transfers between servers. On the internet you're stuck with 1,500 bytes MTU. This is why bulk data transfers between services (like replicating a database backup) are architected differently from low-latency API calls — batch size, connection pooling, and streaming strategies all come from understanding how packets flow.</p>`,
        },
      ],
    },

    {
      id: "p1t8",
      title: "DNS — What It Is",
      subtitle:
        "The internet's phone book — translating human-readable names to IP addresses.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>DNS</strong> (Domain Name System) translates domain names like <code>shopkart.com</code> into IP addresses like <code>13.234.56.78</code>. Humans remember names; computers route by IP addresses. DNS is the translator between these two worlds.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why DNS Exists",
          body: `<p>No one can remember that ShopKart's server is at 13.234.56.78. But everyone can remember shopkart.com. More importantly, ShopKart can change their server IP address (e.g., moving to a new data center) without telling every user — they just update the DNS record, and the entire world automatically routes to the new IP. Without DNS, changing your server IP would break every link and bookmark everywhere.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart DNS Records",
          body: `<div class="diagram-box">shopkart.com DNS Records:

  A Record:      shopkart.com       → 13.234.56.78   (main server IP)
  A Record:      shopkart.com       → 13.234.56.79   (second server, round-robin)
  CNAME Record:  www.shopkart.com   → shopkart.com   (alias)
  MX Record:     shopkart.com       → mail.shopkart.com (email server)
  TXT Record:    shopkart.com       → "v=spf1 ..."   (spam prevention)

  TTL (Time To Live): 300 seconds
  → DNS resolvers cache the answer for 300s
  → Lower TTL = faster propagation after changes (but more DNS queries)
  → Higher TTL = less DNS load (but slower to change)</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>High TTL before a planned server migration.</strong> If your TTL is 24 hours, users will keep hitting the old server for a full day after you change the IP. Always lower TTL to 60 seconds 48 hours before a migration, then change the IP, then restore TTL afterward.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Assuming DNS changes propagate instantly.</strong> They don't. Old TTLs live in caches worldwide. This is why teams test migrations with new subdomains first.</div></div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>DNS is a critical system design lever. You can use DNS for <strong>geographic routing</strong> (return different IPs to users in India vs USA, pointing each to the nearest data center), <strong>health-check-based failover</strong> (automatically change the IP if the primary server fails), and <strong>load balancing</strong> (return multiple IPs, client picks one). Services like AWS Route 53, Cloudflare, and Azure DNS provide all of these capabilities on top of basic DNS.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Multi-Region Design</div><div class="interview-q">When designing a globally distributed system, DNS is usually your first routing layer. Route 53 Latency Routing automatically sends Indian users to the Mumbai region and US users to the Virginia region, purely via DNS. This is a common point in system design discussions about global scale.</div></div>`,
        },
      ],
    },

    {
      id: "p1t9",
      title: "DNS Resolution Flow",
      subtitle:
        "The exact step-by-step journey from typing a URL to reaching a server.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>DNS resolution is the process of looking up a domain name's corresponding IP address through a hierarchical system of DNS servers. This lookup happens invisibly every time you visit a new website, and is completed in milliseconds.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Step-by-Step Flow",
          body: `<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text"><strong>Browser Cache</strong> — Has Rahul visited shopkart.com recently? If yes, use the cached IP. Skip the rest. This is the fastest path.</div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text"><strong>OS Cache / /etc/hosts</strong> — Check the operating system's DNS cache and local hosts file. Often hits here for recently-visited sites.</div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text"><strong>Recursive Resolver (ISP)</strong> — Rahul's ISP runs a DNS resolver. Ask it: "What is the IP for shopkart.com?" It may have it cached. If not, it finds out on your behalf.</div></div>
  <div class="step-item"><div class="step-num">4</div><div class="step-text"><strong>Root Name Server</strong> — The resolver asks a root server: "Who knows about .com?" Root server replies: "Ask the .com TLD server at &lt;IP&gt;".</div></div>
  <div class="step-item"><div class="step-num">5</div><div class="step-text"><strong>TLD Server (.com)</strong> — Ask the .com TLD server: "Who knows about shopkart.com?" TLD replies: "Ask Route 53 at ns-1234.awsdns.com".</div></div>
  <div class="step-item"><div class="step-num">6</div><div class="step-text"><strong>Authoritative Name Server (Route 53)</strong> — This is ShopKart's own DNS server. It has the definitive answer: "shopkart.com → 13.234.56.78". Returns the IP.</div></div>
  <div class="step-item"><div class="step-num">7</div><div class="step-text"><strong>Response cached & returned</strong> — The resolver caches the answer for the TTL duration, returns the IP to Rahul's browser.</div></div>
  <div class="step-item"><div class="step-num">8</div><div class="step-text"><strong>Browser connects</strong> — Now that Rahul's browser has the IP (13.234.56.78), it opens a TCP connection to that IP on port 443.</div></div>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-purple",
          title: "Diagram",
          body: `<div class="diagram-box">Rahul's Browser
  → [Cache Miss]
  → OS DNS Cache
  → [Cache Miss]
  → ISP Recursive Resolver (8.8.8.8)
       → Root Server: "Who has .com?" → TLD IP
       → .com TLD Server: "Who has shopkart.com?" → NS IP
       → Route 53 (Authoritative): "shopkart.com = 13.234.56.78" ← FINAL ANSWER
  ← ISP caches result (TTL: 300s), returns IP to browser
Browser → TCP connection to 13.234.56.78:443</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<p><strong>DNS is not instantaneous on first lookup.</strong> The full chain above takes 50–200ms. This is why the first visit to a site is slower — subsequent visits are served from cache. Performance-conscious architects ensure common domains used in their microservice calls are pre-warmed in DNS resolvers and consider running local DNS caching agents in their Kubernetes pods.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">What to Mention</div><div class="interview-q">If asked "what happens when you type a URL in a browser", the complete answer covers: DNS resolution (this flow), TCP connection, TLS handshake, HTTP request, server processing, HTTP response, browser rendering. DNS is just step one, but interviewers want every step. Walk through the full DNS chain — it shows you understand distributed hierarchical systems.</div></div>`,
        },
      ],
    },

    {
      id: "p1t10",
      title: "Domain vs IP Address",
      subtitle:
        "Names for humans, numbers for machines — and why you must never confuse the two.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>domain name</strong> is a human-readable identifier (shopkart.com) that maps to an <strong>IP address</strong> (13.234.56.78) through DNS. Domains are stable labels humans use. IPs are the actual routing addresses computers use. The mapping between them can change over time — that's the point.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Architecture Implication",
          body: `<p>Never hardcode IP addresses in application code. When ShopKart migrates to a new data center, every service IP changes. If code has <code>connectTo("10.0.2.5")</code>, every service breaks. Instead use <code>connectTo("db.internal.shopkart.com")</code> — the DNS record gets updated once, and every service automatically finds the new database without any code changes.</p>
<p>This is why Kubernetes uses service DNS names like <code>payment-service.default.svc.cluster.local</code>. Pods die and restart with new IPs constantly — the DNS name stays stable.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Internal DNS in Microservices",
          body: `<div class="diagram-box">ShopKart Internal Service DNS:
  order-service      → 10.0.2.15 (current pod IP)
  payment-service    → 10.0.2.22
  inventory-service  → 10.0.2.34
  db.primary         → 10.0.3.5 (primary database)
  db.replica         → 10.0.3.6 (read replica)
  cache.redis        → 10.0.3.10

When payment-service pod restarts at new IP 10.0.2.55:
  DNS record updates automatically (Kubernetes does this)
  order-service calls payment-service.default.svc.cluster.local
  → DNS resolves to 10.0.2.55 automatically ✅
  No code changes needed anywhere.</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>In microservices architecture, <strong>service discovery</strong> is the mechanism that keeps DNS records for internal services fresh as pods scale up/down and restart. Tools like Kubernetes CoreDNS, Consul, and AWS Service Discovery provide this. The fundamental principle is the same as internet DNS: give everything a name, resolve names dynamically. This decouples services from each other's physical locations — the cornerstone of resilient microservices communication.</p>`,
        },
      ],
    },

    {
      id: "p1t11",
      title: "TCP vs UDP",
      subtitle:
        "Reliable delivery vs. raw speed — choosing the right transport for the job.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>TCP</strong> (Transmission Control Protocol) guarantees reliable, ordered, error-checked delivery. It ensures every byte arrives, in the right order, exactly once. <strong>UDP</strong> (User Datagram Protocol) sends packets with no guarantees — fast, lightweight, but may drop, duplicate, or reorder data. You choose based on your use case.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "The Core Trade-off",
          body: `<p>TCP's reliability comes at a cost: a 3-way handshake to establish connection, acknowledgements for every segment, retransmissions for lost packets, congestion control that backs off when the network is busy. All of this adds latency and overhead.</p>
<p>UDP skips all of that. No connection setup, no acknowledgements, no ordering. It just fires packets and hopes they arrive. Lower latency but zero guarantees.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Use Cases",
          body: `<table class="compare-table"><thead><tr><th>Use Case</th><th>Protocol</th><th>Why</th></tr></thead><tbody>
<tr><td>Checkout / Payment API</td><td>TCP (HTTPS)</td><td>Every byte must arrive correctly. Missing a digit in a payment amount is catastrophic.</td></tr>
<tr><td>Product Search API</td><td>TCP (HTTPS)</td><td>Need complete, correct data for search results.</td></tr>
<tr><td>Live order tracking on map</td><td>UDP (WebRTC) or TCP</td><td>1-2 dropped location updates are fine. Freshness matters more than completeness.</td></tr>
<tr><td>ShopKart Live video stream</td><td>UDP (HLS)</td><td>A slightly blurry frame is better than a stall. Speed > perfection.</td></tr>
<tr><td>Internal metrics/logs</td><td>UDP (StatsD)</td><td>Losing 1% of metrics packets is acceptable. Low overhead matters.</td></tr>
</tbody></table>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>HTTP/1.1 and HTTP/2 run on TCP. <strong>HTTP/3 runs on QUIC</strong>, which is built on UDP but re-implements reliability features at the application layer — getting the best of both worlds: UDP's speed and TCP's reliability, without TCP's head-of-line blocking problem. Major platforms (Google, Facebook) have moved to HTTP/3. Understanding why — TCP's ordered delivery causes all streams to stall if one packet drops — is senior-level networking knowledge.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Protocol Selection</div><div class="interview-q">Interviewers love asking about TCP vs UDP in real-time system design (live streaming, gaming, video calls). The answer: UDP for latency-sensitive streams where an occasional dropped packet is acceptable (video), TCP for transactional data where every byte matters (orders, payments, authentication). Mention HTTP/3/QUIC for bonus credit.</div></div>`,
        },
      ],
    },

    {
      id: "p1t12",
      title: "TCP 3-Way Handshake",
      subtitle:
        "The formal introduction between client and server before any data flows.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>Before TCP can send data, client and server must establish a connection through a <strong>3-way handshake</strong> — three messages that synchronise sequence numbers and confirm both sides are ready to communicate. This happens every time you open a new connection to a server.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Step-by-Step",
          body: `<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text"><strong>SYN</strong> — Rahul's browser sends a SYN (synchronise) packet to ShopKart's server. "I want to connect. My starting sequence number is 1000."</div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text"><strong>SYN-ACK</strong> — ShopKart's server replies with SYN-ACK. "OK, I'm ready. I acknowledge your sequence 1001. My starting sequence number is 5000."</div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text"><strong>ACK</strong> — Rahul's browser sends ACK. "I acknowledge your sequence 5001. Connection established." Now HTTP data can flow.</div></div>
</div>
<div class="diagram-box">Rahul's Browser              ShopKart Server
      │                              │
      │─────── SYN (seq=1000) ──────▶│
      │                              │
      │◀─── SYN+ACK (seq=5000, ───── │
      │       ack=1001)              │
      │                              │
      │─────── ACK (ack=5001) ──────▶│
      │                              │
      │  Connection established ✅   │
      │─── HTTP GET /products ──────▶│</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Performance Implications",
          body: `<p>The 3-way handshake adds a full <strong>round-trip time (RTT)</strong> before any data can flow. For a user in Mumbai connecting to a server also in Mumbai (~1ms RTT), this costs 1ms. For a user connecting to a server in the USA (~150ms RTT), this costs 150ms — just to establish the connection, before any data has transferred.</p>
<p>This is why <strong>HTTP Keep-Alive</strong> (persistent connections) and <strong>connection pooling</strong> are so important — they reuse established TCP connections instead of creating new ones for every request. ShopKart's Node.js app uses connection pools to the database, avoiding a new 3-way handshake for every query.</p>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Creating a new database connection per HTTP request.</strong> Each connection requires a TCP handshake + TLS handshake (another RTT) + database authentication. At 1,000 req/sec this is devastating. Always use a connection pool.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Not tuning TCP settings for high-concurrency servers.</strong> Default OS TCP settings are designed for desktops. Production servers need tuning: tcp_tw_reuse, somaxconn, backlog size.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Connection Optimization</div><div class="interview-q">Mention TCP connection pooling when discussing database performance. "Each TCP + TLS handshake costs 1–2 RTTs, so we maintain a pool of pre-established connections." This shows you understand the full cost of a connection, not just query execution time.</div></div>`,
        },
      ],
    },

    {
      id: "p1t13",
      title: "TCP Reliability Mechanisms",
      subtitle: "How TCP guarantees delivery over an unreliable network.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>TCP achieves reliability through three mechanisms: <strong>acknowledgements</strong> (receiver confirms every received segment), <strong>retransmission</strong> (sender resends unacknowledged segments after a timeout), and <strong>flow/congestion control</strong> (sender slows down when receiver or network is overwhelmed).</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "How Reliability Works",
          body: `<div class="diagram-box">Sender                          Receiver
  │── Segment 1 (bytes 1-1460) ──▶│ ACK 1461 ✅
  │── Segment 2 (bytes 1461-2920)▶│ (lost in network) ❌
  │── Segment 3 (bytes 2921-4380)▶│ ACK 1461 (still waiting for 2) ⚠️
  │── Segment 4 (bytes 4381-5840)▶│ ACK 1461 (duplicate ACK — signal!)
  │                                │
  │ [Sender detects 3 dup ACKs → segment 2 dropped!]
  │                                │
  │── Segment 2 RETRANSMIT ───────▶│ ACK 5841 ✅ (all segments received, buffer reassembled)</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Congestion Control in ShopKart",
          body: `<p>During the Big Sale, ShopKart's network gets overwhelmed. TCP's congestion control algorithm (CUBIC / BBR) detects packet loss as a signal that the network is congested and automatically reduces transmission rate. This self-throttling prevents complete network collapse. Modern systems use the <strong>BBR</strong> (Bottleneck Bandwidth and RTT) algorithm, which achieves 2-25x higher throughput than legacy TCP on long-distance connections — Google uses this for YouTube.</p>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p><strong>Head-of-line blocking</strong> is TCP's biggest weakness for multiplexed traffic. If segment 2 is dropped and segments 3, 4, 5 arrive, TCP buffers them ALL and delivers nothing until segment 2 is retransmitted. For HTTP/2 (which multiplexes streams over one TCP connection), one dropped packet stalls ALL streams. HTTP/3 solves this by using QUIC/UDP, where independent streams don't block each other on packet loss.</p>`,
        },
      ],
    },

    {
      id: "p1t14",
      title: "HTTP Protocol",
      subtitle:
        "The language of the web — how browsers and servers communicate.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>HTTP</strong> (HyperText Transfer Protocol) is the application-level protocol for transmitting hypermedia documents on the web. It is a stateless request-response protocol: the client sends a request, the server sends a response, and the connection's state is not remembered between requests (by default).</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Evolution of HTTP",
          body: `<table class="compare-table"><thead><tr><th>Version</th><th>Key Feature</th><th>Problem Solved</th></tr></thead><tbody>
<tr><td>HTTP/1.0</td><td>New TCP connection per request</td><td>—</td></tr>
<tr><td>HTTP/1.1</td><td>Keep-Alive (persistent connections), pipelining</td><td>Reduced connection overhead</td></tr>
<tr><td>HTTP/2</td><td>Multiplexing (multiple requests over 1 TCP), header compression, server push</td><td>Head-of-line blocking at HTTP layer, high overhead headers</td></tr>
<tr><td>HTTP/3</td><td>QUIC (UDP-based), 0-RTT handshakes, independent streams</td><td>TCP head-of-line blocking, slow handshakes</td></tr>
</tbody></table>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart HTTP Flow",
          body: `<div class="diagram-box">Rahul's browser → shopkart.com

HTTP Request:
  GET /api/products?search=shoes HTTP/2
  Host: shopkart.com
  Accept: application/json
  Authorization: Bearer eyJhbGc...
  Cookie: session=abc123

HTTP Response:
  HTTP/2 200 OK
  Content-Type: application/json
  Cache-Control: public, max-age=300
  
  {"products": [{"id": 1, "name": "Nike Air Max", "price": 7999}]}</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Statelessness",
          body: `<p>HTTP being stateless is a <strong>feature, not a bug</strong>, for scalability. Because the server remembers nothing between requests, any request from Rahul can go to ANY of ShopKart's 50 app servers — no server stickiness required. This enables horizontal scaling. State that must persist (user sessions, cart) is stored in shared external systems (Redis, database), not in server memory. Every well-scaled web system follows this pattern.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">HTTP/2 vs HTTP/3</div><div class="interview-q">Know why HTTP/2 was better than HTTP/1.1 (multiplexing) and why HTTP/3 improves on HTTP/2 (no TCP head-of-line blocking). Interviewers appreciate candidates who understand protocol evolution — it shows you understand the "why" behind technology choices, not just how to use them.</div></div>`,
        },
      ],
    },

    {
      id: "p1t15",
      title: "HTTP Methods",
      subtitle:
        "The vocabulary of web requests — what action you want the server to take.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>HTTP methods (verbs) tell the server what action to perform on a resource. The most important are GET (retrieve), POST (create), PUT (replace), PATCH (update), and DELETE (remove). They form the basis of RESTful API design.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart API Design",
          body: `<table class="compare-table"><thead><tr><th>Method</th><th>ShopKart Example</th><th>Idempotent?</th><th>Safe?</th></tr></thead><tbody>
<tr><td><strong>GET</strong></td><td>GET /products/123 — fetch product details</td><td>✅ Yes</td><td>✅ Yes (no side effects)</td></tr>
<tr><td><strong>POST</strong></td><td>POST /orders — create a new order</td><td>❌ No (creates new order each call)</td><td>❌ No</td></tr>
<tr><td><strong>PUT</strong></td><td>PUT /products/123 — replace full product</td><td>✅ Yes</td><td>❌ No</td></tr>
<tr><td><strong>PATCH</strong></td><td>PATCH /products/123 — update price only</td><td>⚠️ Maybe</td><td>❌ No</td></tr>
<tr><td><strong>DELETE</strong></td><td>DELETE /orders/456 — cancel order</td><td>✅ Yes</td><td>❌ No</td></tr>
</tbody></table>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Using GET for state-changing operations</strong> like GET /deleteProduct/123. Browsers, crawlers, and prefetch mechanisms call GET URLs. Using GET for deletes means a Googlebot crawling your admin panel deletes everything.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Using POST for everything.</strong> Many teams just use POST for all operations. You lose semantic meaning, caching benefits (GET responses can be cached), and idempotency guarantees. REST method semantics exist for good reasons.</div></div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Idempotency",
          body: `<p>The idempotency of GET, PUT, and DELETE enables smarter infrastructure. Intermediaries (CDNs, caches, load balancers) know it is safe to cache GET responses, retry PUT/DELETE without side effects, and never retry POST automatically (could create duplicates). When designing APIs, choosing the right method enables the entire infrastructure stack to work intelligently with your data.</p>`,
        },
      ],
    },

    {
      id: "p1t16",
      title: "HTTP Status Codes",
      subtitle:
        "The server's way of telling you exactly what happened to your request.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>HTTP status codes are 3-digit numbers in every response indicating the outcome. 2xx means success, 3xx means redirect, 4xx means client error (you did something wrong), 5xx means server error (we did something wrong). These codes drive behaviour in every HTTP client, browser, and monitoring system.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Status Code Guide",
          body: `<div class="diagram-box">2xx — Success:
  200 OK              → GET product returned successfully
  201 Created         → POST /orders — new order created (include Location header)
  204 No Content      → DELETE /cart/item/5 — deleted, nothing to return

3xx — Redirect:
  301 Moved Permanently → shopkart.com → www.shopkart.com (SEO permanent)
  302 Found (Temp)     → Redirect after login POST → GET homepage
  304 Not Modified     → Browser cache still valid, use cached version

4xx — Client Errors (developer's fault):
  400 Bad Request     → Invalid JSON in request body
  401 Unauthorized    → Missing or invalid auth token (not logged in)
  403 Forbidden       → Valid token but insufficient permissions (not your order)
  404 Not Found       → Product with this ID doesn't exist
  409 Conflict        → Trying to create duplicate order
  422 Unprocessable   → Validation failed (invalid email format)
  429 Too Many Requests → Rate limit exceeded

5xx — Server Errors (our fault):
  500 Internal Server Error → Unhandled exception in our code
  502 Bad Gateway           → App server crashed, load balancer got no response
  503 Service Unavailable   → Server is overloaded or down for maintenance
  504 Gateway Timeout       → App server took too long, load balancer timed out</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Returning 200 for errors.</strong> A response of HTTP 200 with body <code>{"error": "not found"}</code> is wrong. Monitoring tools, load balancers, and client SDKs all use status codes. If you return 200 for errors, your metrics show everything is healthy when it's not.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Returning 500 for validation errors.</strong> A 500 means "we have a bug". A missing required field is a client error → 400 or 422. 5xx rates trigger on-call alerts; 4xx rates typically don't. Don't wake up engineers at 3 AM for bad client input.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Production Readiness</div><div class="interview-q">When designing APIs in interviews, always specify your error status codes. Describe your monitoring strategy: "We alert on-call if 5xx rate exceeds 1%. We track 4xx rates separately to detect client bugs or API misuse. 429s tell us we need stricter rate limiting." This level of operational thinking distinguishes senior engineers.</div></div>`,
        },
      ],
    },

    {
      id: "p1t17",
      title: "HTTP Headers",
      subtitle: "The metadata envelope around every HTTP request and response.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>HTTP headers are key-value pairs sent with every request and response, providing metadata about the content, the client, the server's capabilities, caching rules, authentication, and more. They are invisible to end users but critical for every aspect of web communication.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "Critical Headers in ShopKart",
          body: `<div class="diagram-box">REQUEST HEADERS (Rahul → ShopKart):
  Host: shopkart.com                     → which virtual host to use
  Authorization: Bearer eyJhbGci...      → JWT auth token
  Content-Type: application/json         → body format
  Accept: application/json               → expected response format
  Accept-Encoding: gzip, br              → I can handle compressed responses
  If-None-Match: "abc123"                → conditional GET for caching
  X-Request-ID: req-uuid-abc             → distributed tracing ID
  Cookie: session=xyz                    → session cookie

RESPONSE HEADERS (ShopKart → Rahul):
  Content-Type: application/json         → response format
  Cache-Control: public, max-age=300     → cache this for 5 minutes
  ETag: "abc123"                         → resource version fingerprint
  Content-Encoding: gzip                 → response is compressed
  Strict-Transport-Security: max-age=... → always use HTTPS
  X-RateLimit-Remaining: 87             → you have 87 requests left
  Set-Cookie: session=new_value; ...     → update session</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Cache Headers",
          body: `<p>Getting <strong>Cache-Control</strong> headers right is one of the highest-leverage performance optimisations. <code>Cache-Control: public, max-age=300</code> tells CDNs and browsers to cache the response for 5 minutes — eliminating database and server load for popular product pages. ShopKart's product images use <code>max-age=31536000, immutable</code> (cache forever — image URLs change when content changes). Setting the wrong cache headers either wastes origin server capacity or gives users stale data. Understanding the full cache-control token vocabulary (no-cache, no-store, must-revalidate, stale-while-revalidate) is essential architecture knowledge.</p>`,
        },
      ],
    },

    {
      id: "p1t18",
      title: "Cookies vs Sessions",
      subtitle: "How stateless HTTP remembers who you are across requests.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>cookie</strong> is a small piece of data the server sends to the browser, which the browser stores and automatically sends back with every subsequent request to that domain. A <strong>session</strong> is server-side state tied to a user, referenced by an ID stored in a cookie. Cookies live in the browser; sessions live on the server.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Step-by-Step Flow",
          body: `<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text">Rahul submits login form: POST /login with email + password.</div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text">Server validates credentials, creates a session in Redis: <code>session:abc123 → {userId: 42, cartId: 99}</code> with 24h TTL.</div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text">Server sends response with <code>Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict</code>.</div></div>
  <div class="step-item"><div class="step-num">4</div><div class="step-text">Browser stores the cookie. On every future request to shopkart.com, browser automatically sends <code>Cookie: sessionId=abc123</code>.</div></div>
  <div class="step-item"><div class="step-num">5</div><div class="step-text">Server receives request, reads sessionId from cookie, looks up Redis → finds Rahul's session → knows who he is. HTTP is now stateful.</div></div>
  <div class="step-item"><div class="step-num">6</div><div class="step-text">On logout → server deletes the Redis key. The cookie is now worthless.</div></div>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Cookie Security Flags",
          body: `<div class="diagram-box">Set-Cookie: sessionId=abc123;
  HttpOnly  → JS cannot read this cookie (blocks XSS token theft)
  Secure    → only sent over HTTPS (never HTTP)
  SameSite=Strict → cookie not sent on cross-site requests (blocks CSRF)
  Max-Age=86400 → expire after 24 hours
  Path=/   → valid for all paths on the domain

Missing any security flag = potential attack vector:
  No HttpOnly   → XSS attack can read cookie with document.cookie
  No Secure     → Cookie transmitted in plaintext over HTTP, intercepted
  No SameSite   → CSRF attack can forge requests using your cookie</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking — Scaling Sessions",
          body: `<p>The classic scaling trap: sessions stored in server memory. Server 1 creates Rahul's session. The load balancer routes his next request to Server 2. Server 2 has no session → he's logged out randomly. <strong>Solution: externalise sessions</strong>. Store all sessions in Redis, which all servers can access. Now any server can handle any user's request → true horizontal scaling. This is the stateless server architectural principle.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Session Scaling</div><div class="interview-q">When discussing user authentication in system design, explicitly mention external session storage: "Sessions are stored in Redis, not server memory, so any server can handle any user's request. Redis is replicated across availability zones for resilience." This shows you understand stateless server architecture.</div></div>`,
        },
      ],
    },

    {
      id: "p1t19",
      title: "HTTPS vs HTTP",
      subtitle:
        "The difference between sending a postcard and sending a sealed, signed letter.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>HTTP</strong> sends data as plain text — anyone between Rahul and ShopKart's server who intercepts the traffic can read it. <strong>HTTPS</strong> encrypts all traffic using TLS, ensuring that only Rahul and ShopKart can read the communication. It also authenticates the server (you are really talking to shopkart.com, not an impostor).</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "What HTTPS Protects",
          body: `<div class="info-grid">
  <div class="info-card blue"><div class="info-card-title">Confidentiality</div><p>TLS encrypts all data in transit. Rahul's password, credit card number, and session cookie are unreadable to anyone intercepting the traffic (ISPs, coffee shop Wi-Fi snoops, government surveillance).</p></div>
  <div class="info-card green"><div class="info-card-title">Integrity</div><p>TLS includes message authentication codes (MAC). Any tampering with data in transit is detectable. An attacker cannot silently modify Rahul's order without detection.</p></div>
  <div class="info-card yellow"><div class="info-card-title">Authentication</div><p>TLS certificates, signed by trusted Certificate Authorities (CAs), prove Rahul is really talking to shopkart.com and not a spoofed site. The padlock icon = this certificate was verified.</p></div>
</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Mixed content.</strong> HTTPS page loading HTTP resources (images, scripts). Browsers block HTTP resources on HTTPS pages. Also defeats HTTPS security — attacker can modify the HTTP resource.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Not using HSTS (HTTP Strict Transport Security).</strong> Without HSTS, users typing shopkart.com (HTTP) can be intercepted before the redirect to HTTPS happens (SSL stripping attack). HSTS tells the browser to always use HTTPS for this domain — stored in browser for max-age duration.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Expired or self-signed certificates in production.</strong> Causes browser security warning. Users leave. Use Let's Encrypt (free, auto-renewing) or AWS ACM for managed certificates.</div></div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>In modern infrastructure, TLS termination typically happens at the load balancer or CDN edge, not at individual application servers. Traffic from the CDN edge to the internal load balancer, and from the load balancer to app servers, can use HTTP over the internal private network (no public exposure). Some high-security architectures use end-to-end TLS (mTLS — mutual TLS) even for internal service communication — each service has its own certificate and they mutually authenticate. AWS App Mesh and Istio service mesh implement this automatically.</p>`,
        },
      ],
    },

    {
      id: "p1t20",
      title: "TLS Handshake",
      subtitle:
        "The cryptographic negotiation that establishes a secure encrypted channel.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>The <strong>TLS handshake</strong> is a series of messages exchanged at the start of an HTTPS connection to: authenticate the server (via certificate), agree on encryption algorithms, and establish shared secret keys for the session. Only after the handshake is complete does encrypted data transfer begin.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "TLS 1.3 Handshake (Modern)",
          body: `<div class="diagram-box">Rahul's Browser                    ShopKart Server
      │                                   │
      │── ClientHello ──────────────────▶ │  (1-RTT start)
      │   (supported cipher suites,       │
      │    client random, key share)      │
      │                                   │
      │◀── ServerHello ─────────────────  │
      │    (chosen cipher, server random, │
      │     key share, Certificate,       │
      │     server Finished)              │
      │                                   │
      │  [Both compute shared secret]     │
      │  [Verify server certificate]      │
      │                                   │
      │── Client Finished ──────────────▶ │
      │── HTTP GET /products ───────────▶ │  (data flows immediately!)
      │                                   │
TLS 1.3: completes in 1 RTT (vs 2 RTT in TLS 1.2)
0-RTT mode: resuming sessions — 0 additional round trips!</div>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why TLS 1.3 Matters",
          body: `<p>TLS 1.2 required 2 round trips before data could flow. For Rahul at 100ms RTT to a US server, that's 300ms before seeing the first byte (DNS + TCP + TLS). TLS 1.3 cuts TLS to 1 RTT (200ms total). TLS 1.3's 0-RTT mode for session resumption gets that to 100ms (just DNS + TCP). This is why CloudFront and modern CDNs aggressively push TLS 1.3 adoption — the user-visible performance improvement is significant.</p>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>TLS adds computational overhead for asymmetric cryptography (only during handshake) and symmetric encryption (every packet, but extremely fast on modern CPUs with hardware acceleration). The real cost is latency, not CPU. Solutions: <strong>session resumption</strong> (skip handshake for returning connections), <strong>CDN termination</strong> (terminate TLS close to the user to minimise handshake RTT), <strong>OCSP stapling</strong> (avoid extra round trip for certificate revocation check). These optimisations together can cut page load times by 200–400ms for first-time visitors.</p>`,
        },
      ],
    },

    {
      id: "p1t21",
      title: "CORS",
      subtitle:
        "The browser security policy that controls which websites can call your API.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>CORS</strong> (Cross-Origin Resource Sharing) is a browser security mechanism that restricts JavaScript in web pages from making requests to a different domain than the one that served the page, unless the server explicitly allows it. It protects users from malicious sites silently calling their bank's API using their cookies.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why CORS Exists — The Attack It Prevents",
          body: `<p>Without CORS: Rahul visits evil-site.com. That page runs JavaScript that calls <code>shopkart.com/api/orders</code>. The browser automatically includes Rahul's shopkart.com cookies. ShopKart sees a valid authenticated request — and returns Rahul's order history to evil-site.com. CORS prevents this by requiring the server to explicitly list which origins are allowed to read its responses.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart CORS Flow",
          body: `<div class="diagram-box">app.shopkart.com (frontend) wants to call api.shopkart.com (backend)

PREFLIGHT REQUEST (browser automatically sends for cross-origin POST/DELETE):
  OPTIONS /api/orders HTTP/1.1
  Origin: https://app.shopkart.com
  Access-Control-Request-Method: POST
  Access-Control-Request-Headers: Content-Type, Authorization

PREFLIGHT RESPONSE (server must grant permission):
  HTTP/1.1 204 No Content
  Access-Control-Allow-Origin: https://app.shopkart.com  ← explicit allow
  Access-Control-Allow-Methods: GET, POST, DELETE
  Access-Control-Allow-Headers: Content-Type, Authorization
  Access-Control-Max-Age: 86400  ← cache preflight for 24h

ACTUAL REQUEST (browser sends only if preflight approved):
  POST /api/orders ...

WRONG: Access-Control-Allow-Origin: *  (wildcard) with credentials
  → Browsers REJECT wildcard when cookies/auth headers are involved.
  Must use explicit origin: https://app.shopkart.com</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Setting <code>Access-Control-Allow-Origin: *</code> on APIs that handle authentication.</strong> This allows any website to call your API. Fine for truly public data. Never for authenticated endpoints.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Adding CORS headers in the application instead of the API Gateway/load balancer.</strong> If your server throws an exception before reaching the CORS middleware, the response has no CORS headers and the browser shows a CORS error — masking the real error. CORS should be handled at the infrastructure layer.</div></div>
</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">CORS is a Browser Concern</div><div class="interview-q">CORS is enforced by the browser only. Postman, curl, and server-to-server calls are never affected by CORS. If you can call the API from Postman but not from your browser, it is a CORS configuration issue. This distinction trips up many juniors, and knowing it demonstrates real debugging experience.</div></div>`,
        },
      ],
    },

    {
      id: "p1t22",
      title: "Request-Response Lifecycle",
      subtitle:
        "The complete journey of one request — from click to rendered page.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>The request-response lifecycle is the complete sequence of events from a user action (clicking "search for shoes") to the rendered result on screen. Understanding every step reveals where latency comes from and where optimisations can be applied.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Complete Lifecycle — Rahul Searches for Shoes",
          body: `<div class="step-list">
  <div class="step-item"><div class="step-num">1</div><div class="step-text"><strong>User Action</strong> — Rahul types "running shoes" and clicks search. JavaScript calls <code>fetch('https://api.shopkart.com/search?q=running+shoes')</code>.</div></div>
  <div class="step-item"><div class="step-num">2</div><div class="step-text"><strong>DNS Resolution</strong> — Browser resolves api.shopkart.com → 13.234.56.78 (likely from cache, ~0ms; cold ~50ms).</div></div>
  <div class="step-item"><div class="step-num">3</div><div class="step-text"><strong>TCP + TLS</strong> — If first connection: 1 RTT TCP + 1 RTT TLS (~20ms total on same continent). If cached connection: 0ms additional overhead.</div></div>
  <div class="step-item"><div class="step-num">4</div><div class="step-text"><strong>CDN Edge</strong> — Request hits CloudFront. Is search?q=running+shoes cached? Yes (for popular queries) → return from cache in 2ms. No → forward to origin.</div></div>
  <div class="step-item"><div class="step-num">5</div><div class="step-text"><strong>Load Balancer</strong> — Request arrives at AWS ALB. Routes to least-busy search service instance.</div></div>
  <div class="step-item"><div class="step-num">6</div><div class="step-text"><strong>App Server Processing</strong> — Parse query, check Redis search cache (cache hit → 2ms). Cache miss → query Elasticsearch (~20ms) → cache result.</div></div>
  <div class="step-item"><div class="step-num">7</div><div class="step-text"><strong>HTTP Response</strong> — Server serialises 50 products to JSON, sets Cache-Control: max-age=60, sends back.</div></div>
  <div class="step-item"><div class="step-num">8</div><div class="step-text"><strong>Browser Render</strong> — JavaScript receives JSON → updates DOM → React re-renders product grid. Rahul sees results.</div></div>
</div>`,
        },
        {
          icon: "🔷",
          color: "si-purple",
          title: "Where Latency Hides",
          body: `<div class="diagram-box">DNS lookup:          0–50ms  (0 if cached)
TCP handshake:       10–150ms (0 if connection reused)
TLS handshake:       10–100ms (0 if session resumed)
Network transit:     5–200ms  (depends on geography)
CDN cache hit:       1–5ms    (eliminates all server processing)
Load balancer:       &lt;1ms     (negligible)
App processing:      5–50ms   (DB + cache query)
Database query:      1–20ms   (indexed) or 500ms+ (full table scan)
Response transfer:   2–20ms   (depends on payload size)
Browser rendering:   10–100ms (depends on DOM complexity)
─────────────────────────────────────────────────────
Total (warm, cached): 20–100ms  ← what users experience normally
Total (cold, no cache): 200–600ms ← first visit, new connection</div>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Performance Analysis</div><div class="interview-q">When asked to optimise a slow endpoint, walk through the entire lifecycle systematically. "First I'd check if the response is cacheable. Then profile the server-side processing — is it a slow DB query? Too many DB calls? Lack of indexes? Third, is the payload too large — should we paginate or compress? Finally, is the client too geographically far — should we add a CDN?" This systematic approach impresses interviewers.</div></div>`,
        },
      ],
    },

    {
      id: "p1t23",
      title: "Latency vs Bandwidth vs Throughput",
      subtitle:
        "Three distinct dimensions of network performance — and why they all matter.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definitions",
          body: `<p><strong>Latency</strong> is the time delay for one piece of data to travel from source to destination — the speed of the round trip. <strong>Bandwidth</strong> is the maximum capacity of the network link — the width of the pipe. <strong>Throughput</strong> is the actual amount of data successfully transferred per second — the real-world utilisation of the pipe.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "ShopKart Analogy",
          body: `<p>Think of ShopKart's network as a highway:</p>
<ul>
  <li><strong>Latency</strong> = the time it takes one car to travel from Mumbai to Delhi. Even on an empty highway, there's a minimum travel time based on distance and speed. No amount of adding lanes changes this.</li>
  <li><strong>Bandwidth</strong> = the number of lanes on the highway. More lanes = more cars can travel simultaneously.</li>
  <li><strong>Throughput</strong> = how many cars actually reach Delhi per hour. If there's a traffic jam halfway, throughput drops below what bandwidth could support.</li>
</ul>
<p>An API response might have 1 Gbps bandwidth available, but if latency is 200ms and the response is tiny, adding more bandwidth doesn't help. For small payloads, <strong>latency dominates</strong>. For bulk data transfer, <strong>bandwidth dominates</strong>.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "Numbers to Know",
          body: `<div class="diagram-box">Typical Latency Benchmarks:
  Within same server (loopback):    ~0.05ms
  Within same data center LAN:      0.1–0.5ms
  Same city:                        1–5ms
  Mumbai ↔ Delhi:                  ~20ms
  Mumbai ↔ Singapore:              ~40ms
  Mumbai ↔ London:                 ~130ms
  Mumbai ↔ New York:               ~190ms

Bandwidth:
  1G Ethernet (internal):           1 Gbps  (~125 MB/s)
  10G Ethernet (high-performance):  10 Gbps (~1.25 GB/s)
  Home fibre (Rahul's Jio):         100 Mbps (~12 MB/s)
  Mobile 4G:                        10–50 Mbps
  Mobile 3G:                        1–5 Mbps</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>The <strong>bandwidth-delay product</strong> = bandwidth × RTT. This represents how much data is "in flight" in the network at any time. A 100ms RTT connection at 1Gbps has 100MB in flight. TCP window sizes must accommodate this to fully utilise bandwidth. This is why long-distance high-bandwidth transfers (like database backups across regions) benefit from TCP tuning and parallel streams. For interactive APIs (Rahul's search), latency is the bottleneck — more bandwidth won't help. Get the service closer to the user (CDN edges) instead.</p>`,
        },
      ],
    },

    {
      id: "p1t24",
      title: "Round Trip Time (RTT)",
      subtitle:
        "The fundamental unit of latency — how long does one conversation take?",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p><strong>RTT</strong> (Round Trip Time) is the time it takes for a signal to travel from source to destination AND back. It's the total duration of a two-way communication. Almost every network operation costs at least 1 RTT, and many cost 2–4 RTTs. Minimising RTT is the core of network performance optimisation.</p>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "RTT Cost Accounting in ShopKart",
          body: `<div class="diagram-box">Rahul (Mumbai) connects to ShopKart (Mumbai server): RTT = 10ms

Cost of opening a brand-new HTTPS connection:
  DNS resolution:     1 RTT (10ms)     → 10ms
  TCP handshake:      1 RTT (10ms)     → 10ms
  TLS 1.3 handshake: 1 RTT (10ms)     → 10ms
  First HTTP request: 1 RTT (10ms)     → 10ms
  ─────────────────────────────────────────────
  Total before first byte: 4 RTT      → 40ms

Optimisations that eliminate RTTs:
  DNS cache hit:          → saves 1 RTT (10ms)
  TCP connection pool:    → saves 1 RTT (10ms)  ← huge win for microservices
  TLS session resumption: → saves 1 RTT (10ms)
  HTTP/2 multiplexing:    → 10+ requests share same connection = saves 10+ RTTs
  ─────────────────────────────────────────────
  Fully optimised first byte: 10ms (just the HTTP request RTT)</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>Every time a microservice calls another microservice, it pays an RTT. A payment for a ShopKart order might chain: Order Service → Payment Service → Fraud Check Service → Wallet Service → Notification Service. Even at 1ms internal latency per hop, that's 5ms of pure RTT overhead. This is why architects:</p>
<ul>
  <li>Minimise service call chains (avoid 5+ hop chains where possible)</li>
  <li>Use async communication where synchronous response isn't needed</li>
  <li>Co-locate tightly coupled services in the same AZ to minimise RTT</li>
  <li>Consider gRPC multiplexing for high-frequency service-to-service calls</li>
</ul>`,
        },
      ],
    },

    {
      id: "p1t25",
      title: "CDN (Content Delivery Network)",
      subtitle:
        "Bringing ShopKart's content geographically close to every user on Earth.",
      sections: [
        {
          icon: "📖",
          color: "si-blue",
          title: "Simple Definition",
          body: `<p>A <strong>CDN</strong> is a globally distributed network of servers (called <strong>edge nodes</strong> or <strong>PoPs</strong> — Points of Presence) that cache and serve content from locations geographically close to users. Instead of every user reaching ShopKart's origin server in Mumbai, users in London hit a London edge node, users in Tokyo hit a Tokyo edge node — getting responses in 5ms instead of 150ms.</p>`,
        },
        {
          icon: "🔍",
          color: "si-purple",
          title: "Why CDNs Are Transformative",
          body: `<p>ShopKart's product images are stored on S3 in Mumbai. Without a CDN, every user worldwide downloads images from Mumbai. A user in London downloading a 100KB image at 130ms RTT is painful. With CloudFront: London user's first request fetches from Mumbai (~130ms), but the image is cached at the London edge node. Every London user after that gets it in 5ms. CloudFront has 450+ edge locations worldwide — ShopKart's content is effectively everywhere, simultaneously.</p>`,
        },
        {
          icon: "🔷",
          color: "si-cyan",
          title: "CDN Architecture",
          body: `<div class="diagram-box">Without CDN:
  Rahul (Mumbai) → shopkart.com (Mumbai)    → 10ms ✅
  Priya (London) → shopkart.com (Mumbai)    → 130ms ❌
  Zhang (Tokyo)  → shopkart.com (Mumbai)    → 80ms  ❌

With CloudFront CDN:
  Rahul (Mumbai) → Mumbai PoP → [MISS] → origin (10ms total)
  Priya (London) → London PoP → [MISS] → origin (130ms first time)
                              → [HIT]  → 5ms for all future London users ✅
  Zhang (Tokyo)  → Tokyo PoP  → [MISS] → origin (80ms first time)
                              → [HIT]  → 3ms for all future Tokyo users ✅

CDN Cache Hit Rates:
  Product images: ~95% hit rate (rarely change)
  Product listing pages: ~60% hit rate (change with inventory)
  API search results: ~40% hit rate (popular queries repeated)
  Checkout / cart:  ~0% (personalised, cannot cache)</div>`,
        },
        {
          icon: "🏪",
          color: "si-green",
          title: "What ShopKart Caches on CDN",
          body: `<div class="diagram-box">Static Assets (Cache Forever — Content-hashed URLs):
  /static/main.a3f2b.js   Cache-Control: max-age=31536000, immutable
  /static/main.c1d9e.css  Cache-Control: max-age=31536000, immutable
  (URL changes when file changes → safe to cache indefinitely)

Product Images:
  /images/nike-air-123.webp → Cache-Control: max-age=2592000 (30 days)

Product Pages (server-side rendered):
  /products/123 → Cache-Control: s-maxage=60 (CDN caches 60s, browser no-cache)
  (short TTL because price/stock can change)

Search API Results (popular queries):
  GET /api/search?q=nike+air+max → Cache-Control: s-maxage=300
  
NEVER CACHE (personalised/sensitive):
  GET /api/cart       → Cache-Control: private, no-store
  GET /api/orders     → Cache-Control: private, no-store
  POST requests       → CDN never caches POST (by definition)</div>`,
        },
        {
          icon: "⚠️",
          color: "si-red",
          title: "Common Mistakes",
          body: `<div class="key-list">
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Caching authenticated or personalised responses on CDN.</strong> If ShopKart caches <code>/api/cart</code> on the CDN, Rahul's cart gets served to every user. Privacy disaster. Use <code>Cache-Control: private</code> for user-specific responses.</div></div>
  <div class="key-item"><div class="key-bullet">❌</div><div><strong>Not versioning static asset URLs.</strong> Deploying a new version of main.js to the same URL while CDN caches the old version means users run old code for up to 24 hours. Hash the filename: <code>main.a3f2b.js</code> → content changes = new filename = CDN immediately serves new file.</div></div>
</div>`,
        },
        {
          icon: "🧠",
          color: "si-yellow",
          title: "Architect Thinking",
          body: `<p>The <strong>cache hit ratio</strong> is the most important CDN metric. At 90% hit rate, only 10% of requests reach the origin — your infrastructure handles 10x the users at the same cost. Improving cache hit ratio from 80% to 95% is often better ROI than adding more servers. Strategies: longer TTLs where data changes rarely, normalising query parameter order (cache key normalisation), prefetching popular content to edge nodes before users request it (CloudFront has proactive transfer features).</p>
<p>CDNs also provide DDoS protection — a 100 Gbps DDoS attack against your 1 Gbps origin is absorbed by the distributed CDN network. ShopKart's Big Sale traffic spike is handled the same way — CDN absorbs the burst without ever hitting the origin.</p>`,
        },
        {
          icon: "🎯",
          color: "si-orange",
          title: "Interview Insight",
          body: `<div class="interview-card"><div class="interview-label">Every System Needs a CDN</div><div class="interview-q">In virtually every system design interview, a CDN should appear in your architecture diagram for any user-facing system. Start with: "Static assets and product images are served via CloudFront with long TTLs. Dynamic API responses for popular queries are cached at the edge for 60 seconds. This reduces origin load by ~70% and cuts global users' latency from 150ms to 5ms." This kind of quantified reasoning wins interviews.</div></div>`,
        },
      ],
    },
  ],
};

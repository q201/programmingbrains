import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting rich blog & comments seed process...\n');

  // 1. Ensure Admin User exists
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@programmingbrains.com' },
    update: {
      name: 'Dr. Sarah Connor',
      bio: 'Principal Systems Architect and Chief Technical Writer at Programming Brains.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      website: 'https://programmingbrains.com'
    },
    create: {
      email: 'admin@programmingbrains.com',
      name: 'Dr. Sarah Connor',
      password: adminPassword,
      role: 'ADMIN',
      bio: 'Principal Systems Architect and Chief Technical Writer at Programming Brains.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      website: 'https://programmingbrains.com'
    }
  });
  console.log('👤 Admin user ready:', admin.name);

  // 2. Create Commenter Users
  const sampleCommenters = [
    {
      email: 'alex.rivera@devmail.com',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Senior Backend Engineer specializing in Distributed Systems.'
    },
    {
      email: 'elena.rostova@techhub.io',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      bio: 'Fullstack Architect & Open Source Contributor.'
    },
    {
      email: 'marcus.v@cloudsystems.net',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'DevOps Lead & Cloud Native Security Practitioner.'
    },
    {
      email: 'priya.sharma@aivision.org',
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      bio: 'AI Researcher & Data Engineer.'
    }
  ];

  const commenters = [];
  for (const cData of sampleCommenters) {
    const defaultPassword = await bcrypt.hash('commenter123', 10);
    const u = await prisma.user.upsert({
      where: { email: cData.email },
      update: { name: cData.name, avatar: cData.avatar, bio: cData.bio },
      create: {
        email: cData.email,
        name: cData.name,
        password: defaultPassword,
        role: 'USER',
        avatar: cData.avatar,
        bio: cData.bio
      }
    });
    commenters.push(u);
  }
  console.log(`✅ Seeded ${commenters.length} active commenter profiles.`);

  // 3. Create Categories
  const categoryNames = [
    'Web Development',
    'Architecture',
    'Artificial Intelligence',
    'Cloud & DevOps',
    'Database Engineering',
    'Cybersecurity'
  ];

  const categoryMap = new Map<string, string>();
  for (const cName of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name: cName },
      update: {},
      create: { name: cName }
    });
    categoryMap.set(cName, cat.id);
  }
  console.log('📁 Categories initialized.');

  // 4. Seed Rich Blogs
  const blogsData = [
    {
      slug: 'future-of-web-development',
      title: 'The Future of Web Development: AI, Server Components & Beyond',
      category: 'Web Development',
      excerpt: 'Discover the next wave of web development technologies from React Server Components to AI copilots and WebAssembly.',
      readTime: '7 min read',
      viewCount: 1420,
      featured: true,
      tags: ['WebDev', 'React', 'NextJS', 'AI'],
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Futuristic digital network visualization',
      content: `
        <p>The web development landscape is experiencing a paradigm shift. Modern frameworks and browser engines are pushing performance, developer ergonomics, and user experience to heights previously unimagined.</p>
        
        <h2>Key Drivers of Modern Web Evolution</h2>
        
        <h3>1. React Server Components (RSC) & Zero-Bundle Architectures</h3>
        <p>Server components eliminate client-side JavaScript execution overhead for static and data-driven view trees. By running code on the edge or server, initial page loads become blazingly fast while preserving component composition.</p>
        
        <h3>2. Intelligent AI Integration in UI Flow</h3>
        <p>Generative AI features are moving beyond simple chat overlays. Applications now embed real-time recommendations, natural language search, and automated data analysis natively into daily workflows.</p>

        <h3>3. WebAssembly (Wasm) Powering Heavy Client Tasks</h3>
        <p>Browser engines can now run Rust and C++ compiled modules at near-native speed, enabling video editing, 3D simulation, and client-side machine learning directly in web pages.</p>
        
        <blockquote>"The future of web applications lies in seamless streaming, minimal bundle sizes, and intelligent server-side compute."</blockquote>
      `,
      comments: [
        { authorIndex: 0, content: "React Server Components have completely transformed how our team builds dashboard pages. Great article!" },
        { authorIndex: 1, content: "The insight on WebAssembly is spot on. We recently moved image processing to Rust via Wasm and saw a 10x performance boost." },
        { authorIndex: 2, content: "Would love to see a follow-up piece on streaming SSR with suspense boundary fallback patterns." }
      ]
    },
    {
      slug: 'building-scalable-microservices-nodejs-docker-redis',
      title: 'Building Scalable Microservices with Node.js, Docker & Redis',
      category: 'Architecture',
      excerpt: 'An in-depth, enterprise-grade engineering guide to designing, orchestrating, and hardening fault-tolerant microservices built to withstand tens of thousands of requests per second.',
      readTime: '18 min read',
      viewCount: 2892,
      featured: true,
      tags: ['Node.js', 'Microservices', 'Docker', 'Redis', 'Distributed Systems', 'System Design', 'High Availability', 'DevOps'],
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80',
      imageAlt: 'Modern high-density data center racks running distributed containerized microservices',
      content: `
        <!-- Table of Contents Card -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-10 shadow-sm not-prose">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
              </svg>
            </div>
            <h2 class="text-lg font-bold text-slate-900 m-0 border-none pb-0">Table of Contents</h2>
          </div>
          <nav class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <a href="#the-monolithic-tipping-point" class="text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
              <span class="text-blue-500 font-bold">1.</span> Monolithic Tipping Point
            </a>
            <a href="#architectural-blueprint" class="text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
              <span class="text-blue-500 font-bold">2.</span> Distributed Architecture &amp; Lifecycle
            </a>
            <a href="#core-building-blocks" class="text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
              <span class="text-blue-500 font-bold">3.</span> 4 Core Architectural Building Blocks
            </a>
            <a href="#redis-deep-dive" class="text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
              <span class="text-blue-500 font-bold">4.</span> Redis Under the Hood
            </a>
            <a href="#docker-orchestration" class="text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
              <span class="text-blue-500 font-bold">5.</span> Multi-Stage Dockerization
            </a>
            <a href="#resilience-patterns" class="text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
              <span class="text-blue-500 font-bold">6.</span> Fault Tolerance &amp; Resilience
            </a>
            <a href="#observability-tracing" class="text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
              <span class="text-blue-500 font-bold">7.</span> Tracing, Logging &amp; Telemetry
            </a>
            <a href="#production-readiness-checklist" class="text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
              <span class="text-blue-500 font-bold">8.</span> Production Readiness Checklist
            </a>
          </nav>
        </div>

        <!-- Section 1 -->
        <section id="the-monolithic-tipping-point" class="scroll-mt-20">
          <h2>1. The Monolithic Tipping Point: Identifying System Bottlenecks</h2>
          <p>Scaling a monolithic Node.js application to sustain millions of daily transactions quickly exposes fundamental operational limits. Because Node.js runs on a single-threaded event loop (libuv), CPU-heavy tasks like image processing, JSON serialization of massive payloads, and cryptographic operations inevitably block I/O operations for concurrent requests.</p>
          <p>When traffic scales horizontally in a monolithic setup, scaling requires spinning up copies of the entire monolithic codebase—including low-traffic services alongside critical bottlenecks. This approach causes exponential database connection pool exhaustion, memory bloat, and slow CI/CD release cycles where a single regression in a non-critical module can bring down the entire application.</p>
          <p>Decomposing the monolith into purpose-built, domain-driven microservices decouples resource allocation. High-throughput ingestion pipelines can be independently assigned dedicated CPU cores, auto-scaled based on queuing pressure, and isolated so that database spikes or network timeouts never trigger cascading failures throughout the broader platform.</p>

          <!-- Key Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-6 shadow-sm">
              <div class="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Impact Metric</div>
              <div class="text-4xl font-extrabold text-blue-900 mb-2">64%</div>
              <div class="text-sm font-bold text-slate-800 mb-1">Mean Latency Reduction</div>
              <div class="text-xs text-slate-600 leading-relaxed">Observed after migrating I/O-bound bottlenecks to dedicated cache-first services.</div>
            </div>
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-6 shadow-sm">
              <div class="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Velocity Metric</div>
              <div class="text-4xl font-extrabold text-emerald-900 mb-2">12x</div>
              <div class="text-sm font-bold text-slate-800 mb-1">Deployment Frequency</div>
              <div class="text-xs text-slate-600 leading-relaxed">Independent service pipelines eliminate monolithic release lockstep.</div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/80 rounded-2xl p-6 shadow-sm">
              <div class="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">Cost Metric</div>
              <div class="text-4xl font-extrabold text-purple-900 mb-2">38%</div>
              <div class="text-sm font-bold text-slate-800 mb-1">Infrastructure Cost Optimization</div>
              <div class="text-xs text-slate-600 leading-relaxed">Granular auto-scaling of CPU-intensive workers without resizing primary web tiers.</div>
            </div>
          </div>
        </section>

        <!-- Section 2 -->
        <section id="architectural-blueprint" class="scroll-mt-20">
          <h2>2. High-Level Distributed Architecture &amp; Request Lifecycle</h2>
          <p>In a production-grade distributed deployment, incoming client requests never communicate directly with internal worker pods. Traffic passes through layered perimeter defense and load-balancing tiers before reaching the domain services.</p>
          <p>Below is the comprehensive path of an inbound request across the architectural mesh:</p>

          <!-- Workflow Steps Timeline -->
          <div class="space-y-4 my-8 not-prose">
            <div class="flex gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-all">
              <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md">1</div>
              <div>
                <h4 class="text-base font-bold text-slate-900 mb-1">Edge Ingestion &amp; TLS Termination</h4>
                <p class="text-sm text-slate-600 leading-relaxed">Cloudflare or AWS CloudFront terminates TLS, mitigates Layer 7 DDoS attacks, and serves static cache assets before passing traffic to the ingress controller.</p>
              </div>
            </div>
            <div class="flex gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-all">
              <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md">2</div>
              <div>
                <h4 class="text-base font-bold text-slate-900 mb-1">API Gateway Processing</h4>
                <p class="text-sm text-slate-600 leading-relaxed">Kong, Traefik, or an Express/Fastify gateway performs rapid JWT signature verification, enforces Redis-backed sliding-window rate limits, and injects <code class="bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono text-xs">X-Correlation-ID</code> headers.</p>
              </div>
            </div>
            <div class="flex gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-all">
              <div class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md">3</div>
              <div>
                <h4 class="text-base font-bold text-slate-900 mb-1">Service Mesh Routing &amp; L7 Load Balancing</h4>
                <p class="text-sm text-slate-600 leading-relaxed">The Gateway resolves internal DNS records to route requests to stateless Node.js container pods via gRPC (for internal sub-millisecond RPC) or HTTP/2.</p>
              </div>
            </div>
            <div class="flex gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-all">
              <div class="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md">4</div>
              <div>
                <h4 class="text-base font-bold text-slate-900 mb-1">Cache Interception &amp; Lock Acquisition</h4>
                <p class="text-sm text-slate-600 leading-relaxed">The target service checks its dedicated Redis Cluster replica for warm data. If a write operation is required, distributed locks (Redlock) coordinate concurrency.</p>
              </div>
            </div>
            <div class="flex gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-all">
              <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md">5</div>
              <div>
                <h4 class="text-base font-bold text-slate-900 mb-1">Asynchronous Event Propagation</h4>
                <p class="text-sm text-slate-600 leading-relaxed">State changes publish event payloads to Apache Kafka or RabbitMQ, freeing the upstream request thread while background workers handle notifications, indexing, and analytics.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3 -->
        <section id="core-building-blocks" class="scroll-mt-20">
          <h2>3. The 4 Core Architectural Building Blocks</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-all">
              <div>
                <div class="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3">Perimeter Routing &amp; Security</div>
                <h3 class="text-xl font-bold text-slate-900 mb-3 mt-0">API Gateway &amp; Traffic Throttling</h3>
                <ul class="space-y-2 text-sm text-slate-600 mb-6 pl-0 list-none">
                  <li class="flex items-start gap-2"><span class="text-blue-600 font-bold">✓</span> Performs centralized authentication, token introspection, and scope enforcement.</li>
                  <li class="flex items-start gap-2"><span class="text-blue-600 font-bold">✓</span> Applies dynamic IP and user-tier rate limiting using Redis Sliding Window counters.</li>
                  <li class="flex items-start gap-2"><span class="text-blue-600 font-bold">✓</span> Manages service discovery routing tables and WebSocket connection upgrades.</li>
                </ul>
              </div>
              <div class="pt-4 border-t border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Technologies</span>
                <div class="flex flex-wrap gap-1.5">
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">Kong</span>
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">Traefik</span>
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">Fastify Gateway</span>
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">Envoy</span>
                </div>
              </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition-all">
              <div>
                <div class="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full mb-3">Domain Business Logic</div>
                <h3 class="text-xl font-bold text-slate-900 mb-3 mt-0">Stateless Node.js Compute Layer</h3>
                <ul class="space-y-2 text-sm text-slate-600 mb-6 pl-0 list-none">
                  <li class="flex items-start gap-2"><span class="text-indigo-600 font-bold">✓</span> Executes targeted business workflows with non-blocking async/await execution.</li>
                  <li class="flex items-start gap-2"><span class="text-indigo-600 font-bold">✓</span> Exposes structured health probes (<code class="text-xs bg-slate-100 px-1 py-0.5 rounded">/healthz/liveness</code> and <code class="text-xs bg-slate-100 px-1 py-0.5 rounded">/healthz/readiness</code>).</li>
                  <li class="flex items-start gap-2"><span class="text-indigo-600 font-bold">✓</span> Maintains zero local persistent state, writing all state to external stores.</li>
                </ul>
              </div>
              <div class="pt-4 border-t border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Technologies</span>
                <div class="flex flex-wrap gap-1.5">
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">Node.js 20 LTS</span>
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">Fastify / Express</span>
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">TypeScript</span>
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">Prisma / Drizzle</span>
                </div>
              </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-red-400 transition-all">
              <div>
                <div class="inline-block bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full mb-3">Ultra-Low Latency State &amp; Cache</div>
                <h3 class="text-xl font-bold text-slate-900 mb-3 mt-0">Distributed Redis Data Store</h3>
                <ul class="space-y-2 text-sm text-slate-600 mb-6 pl-0 list-none">
                  <li class="flex items-start gap-2"><span class="text-red-600 font-bold">✓</span> Serves sub-millisecond reads via Cache-Aside and Stale-While-Revalidate strategies.</li>
                  <li class="flex items-start gap-2"><span class="text-red-600 font-bold">✓</span> Maintains distributed sessions, rate limits, and short-lived idempotency tokens.</li>
                  <li class="flex items-start gap-2"><span class="text-red-600 font-bold">✓</span> Provides Pub/Sub event broadcasting for instant cache invalidation across pods.</li>
                </ul>
              </div>
              <div class="pt-4 border-t border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Technologies</span>
                <div class="flex flex-wrap gap-1.5">
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">Redis Cluster (v7+)</span>
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">ioredis</span>
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">DragonflyDB</span>
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">AWS ElastiCache</span>
                </div>
              </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-all">
              <div>
                <div class="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">Asynchronous Inter-Service Communication</div>
                <h3 class="text-xl font-bold text-slate-900 mb-3 mt-0">Decoupled Event Streaming Fabric</h3>
                <ul class="space-y-2 text-sm text-slate-600 mb-6 pl-0 list-none">
                  <li class="flex items-start gap-2"><span class="text-emerald-600 font-bold">✓</span> Decouples producers from consumers to absorb unpredictable traffic spikes.</li>
                  <li class="flex items-start gap-2"><span class="text-emerald-600 font-bold">✓</span> Guarantees at-least-once message delivery with Dead Letter Queues (DLQ).</li>
                  <li class="flex items-start gap-2"><span class="text-emerald-600 font-bold">✓</span> Enables event-sourcing and eventual consistency across isolated databases.</li>
                </ul>
              </div>
              <div class="pt-4 border-t border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Technologies</span>
                <div class="flex flex-wrap gap-1.5">
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">Apache Kafka</span>
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">RabbitMQ</span>
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">AWS SQS/SNS</span>
                  <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">Redpanda</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 4 -->
        <section id="redis-deep-dive" class="scroll-mt-20">
          <h2>4. Redis Under the Hood: Distributed Caching, Locking &amp; Pub/Sub</h2>
          <p>Redis is the critical layer preventing primary SQL or NoSQL database exhaustion during traffic spikes. However, improper caching patterns often lead to three catastrophic failure modes: Cache Stampedes (Dog-piling), Cache Penetration, and Cache Avalanche.</p>
          <p>To mitigate these risks, production services must use dynamic probabilistic early expiration (XFetch algorithm) or strict Mutex Locks during cache replenishment, paired with jittered TTLs to prevent simultaneous key expiration.</p>

          <div class="my-8 not-prose">
            <div class="bg-slate-900 rounded-t-2xl px-6 py-3 border-b border-slate-800 flex items-center justify-between">
              <span class="text-xs font-mono text-blue-400 font-bold">src/infrastructure/cache/RedisCacheManager.ts</span>
              <span class="text-xs text-slate-400 font-mono">TypeScript</span>
            </div>
            <pre class="m-0 rounded-b-2xl rounded-t-none bg-slate-950 p-6 overflow-x-auto text-xs sm:text-sm leading-relaxed text-slate-200 border border-slate-800"><code>import Redis, { Cluster } from 'ioredis';
import { createHash } from 'crypto';

export class RedisCacheManager {
  private redis: Cluster;

  constructor() {
    this.redis = new Redis.Cluster([
      { host: process.env.REDIS_NODE_1 || '127.0.0.1', port: 6379 },
      { host: process.env.REDIS_NODE_2 || '127.0.0.1', port: 6380 },
      { host: process.env.REDIS_NODE_3 || '127.0.0.1', port: 6381 },
    ], {
      redisOptions: {
        enableAutoPipelining: true,
        maxRetriesPerRequest: 3,
        connectTimeout: 5000,
      },
      scaleReads: 'slave',
    });

    this.redis.on('error', (err) => {
      console.error('Redis Cluster Connection Error:', err);
    });
  }

  /**
   * Cache-Aside implementation with distributed Mutex to prevent Cache Stampedes
   */
  public async getOrSet&lt;T&gt;(
    key: string,
    fetcher: () =&gt; Promise&lt;T&gt;,
    ttlSeconds: number = 300
  ): Promise&lt;T&gt; {
    const cached = await this.redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    const lockKey = \`lock:\${key}\`;
    const lockAcquired = await this.redis.set(lockKey, 'locked', 'EX', 10, 'NX');

    if (!lockAcquired) {
      // Wait 100ms and retry reading cache while primary worker populates data
      await new Promise((resolve) =&gt; setTimeout(resolve, 100));
      return this.getOrSet(key, fetcher, ttlSeconds);
    }

    try {
      const freshData = await fetcher();
      // Add random jitter (±10%) to prevent simultaneous cache expiration
      const jitter = Math.floor(Math.random() * (ttlSeconds * 0.2)) - (ttlSeconds * 0.1);
      const finalTtl = Math.max(10, Math.floor(ttlSeconds + jitter));

      await this.redis.setex(key, finalTtl, JSON.stringify(freshData));
      return freshData;
    } finally {
      await this.redis.del(lockKey);
    }
  }

  /**
   * Atomic Sliding Window Rate Limiter using Redis Sorted Sets
   */
  public async isRateLimited(identifier: string, limit: number, windowSec: number): Promise&lt;boolean&gt; {
    const key = \`ratelimit:\${identifier}\`;
    const now = Date.now();
    const clearBefore = now - windowSec * 1000;

    const pipeline = this.redis.pipeline();
    pipeline.zremrangebyscore(key, 0, clearBefore);
    pipeline.zadd(key, now, \`\${now}-\${Math.random()}\`);
    pipeline.zcard(key);
    pipeline.expire(key, windowSec);

    const results = await pipeline.exec();
    const count = (results?.[2]?.[1] as number) || 0;

    return count &gt; limit;
  }
}</code></pre>
          </div>
        </section>

        <!-- Section 5 -->
        <section id="docker-orchestration" class="scroll-mt-20">
          <h2>5. Hardened Multi-Stage Dockerization &amp; Resource Tuning</h2>
          <p>Shipping containerized Node.js services to Kubernetes or AWS ECS requires eliminating attack vectors and optimizing image layer caching. Running containers as <code class="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono">root</code> is a major security vulnerability, and including build tools (<code class="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono">python</code>, <code class="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono">make</code>, <code class="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono">gcc</code>) in the final runtime increases container image size from ~150MB to &gt;1.2GB.</p>
          <p>The following multi-stage build separates compiler toolchains, dev dependencies, and source transpilation into isolated build layers, outputting a hardened Alpine runtime that executes under an unprivileged <code class="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono">node</code> user account.</p>

          <div class="my-8 not-prose">
            <div class="bg-slate-900 rounded-t-2xl px-6 py-3 border-b border-slate-800 flex items-center justify-between">
              <span class="text-xs font-mono text-cyan-400 font-bold">Dockerfile</span>
              <span class="text-xs text-slate-400 font-mono">Dockerfile</span>
            </div>
            <pre class="m-0 rounded-b-2xl rounded-t-none bg-slate-950 p-6 overflow-x-auto text-xs sm:text-sm leading-relaxed text-slate-200 border border-slate-800"><code># ==========================================
# Stage 1: Dependency &amp; Build Base
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install build essentials for native addons (e.g., bcrypt, bufferutil)
RUN apk add --no-cache python3 make g++

COPY package*.json tsconfig.json ./
RUN npm ci --prefer-offline

COPY src/ ./src
RUN npm run build

# Prune devDependencies to keep production node_modules minimal
RUN npm prune --production

# ==========================================
# Stage 2: Production Distroless / Hardened Alpine
# ==========================================
FROM node:20-alpine AS runner

# Set strict security and runtime environmental variables
ENV NODE_ENV=production \\
    PORT=3000 \\
    NODE_OPTIONS="--max-old-space-size=1536 --enable-source-maps"

WORKDIR /usr/src/app

# Add dumb-init to handle PID 1 signal forwarding (SIGTERM/SIGINT) correctly
RUN apk add --no-cache dumb-init

# Copy only required production artifacts from the builder stage
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

# Drop root privileges and switch to built-in unprivileged user
USER node

EXPOSE 3000

# Healthcheck probe for container orchestrators
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/healthz/liveness || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.js"]</code></pre>
          </div>
        </section>

        <!-- Section 6 -->
        <section id="resilience-patterns" class="scroll-mt-20">
          <h2>6. Fault Tolerance: Circuit Breakers, Bulkheads &amp; Jittered Retries</h2>
          <p>In distributed architectures, transient network failures and database latency spikes are inevitable. If downstream Service B begins taking 8 seconds per request instead of 40ms, calling Service A will rapidly exhaust its Node.js connection pools and worker memory waiting for responses.</p>
          <p>Resilient microservices must implement three defensive patterns simultaneously: Circuit Breakers (cutting off broken dependencies), Bulkheads (isolating resource pools), and Exponential Backoff with Jitter.</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-amber-400 transition-all">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg mb-4">⚡</div>
              <h3 class="text-lg font-bold text-slate-900 mb-2 mt-0">Circuit Breaker Pattern (Opossum)</h3>
              <div class="mb-3">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Mechanism</span>
                <p class="text-xs text-slate-600 leading-relaxed">Monitors call failure rates. When errors exceed 50% over a 10s window, the circuit trips OPEN. Inbound calls return fallback responses instantly.</p>
              </div>
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">Recovery</span>
                <p class="text-xs text-slate-600 leading-relaxed">After cooldown (e.g., 30s), transitions to HALF-OPEN to sample test traffic until stability is verified.</p>
              </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-400 transition-all">
              <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-4">🛡️</div>
              <h3 class="text-lg font-bold text-slate-900 mb-2 mt-0">Bulkhead Isolation</h3>
              <div class="mb-3">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Mechanism</span>
                <p class="text-xs text-slate-600 leading-relaxed">Separates socket &amp; thread pools across integrations so Third-Party API failures cannot deplete auth resources.</p>
              </div>
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">Recovery</span>
                <p class="text-xs text-slate-600 leading-relaxed">Rejects excess requests immediately with HTTP 429/503 instead of queuing infinitely.</p>
              </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-purple-400 transition-all">
              <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-4">🔄</div>
              <h3 class="text-lg font-bold text-slate-900 mb-2 mt-0">Exponential Backoff with Full Jitter</h3>
              <div class="mb-3">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Mechanism</span>
                <p class="text-xs text-slate-600 leading-relaxed">Retries failed idempotent requests using randomized jitter to prevent Thundering Herd spikes.</p>
              </div>
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-purple-600 block mb-1">Recovery</span>
                <p class="text-xs text-slate-600 leading-relaxed">Limits total retries to 3 before escalating to a dead-letter queue (DLQ).</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 7 -->
        <section id="observability-tracing" class="scroll-mt-20">
          <h2>7. Distributed Tracing, Structured Logging &amp; Metric Telemetry</h2>
          <p>Debugging distributed transactions across multiple microservices without centralized tracing is virtually impossible. A single user checkout operation may touch the Gateway, Auth Service, Inventory Service, Payment Processor, and Email Worker.</p>
          <p>Every service must implement the W3C TraceContext standard via OpenTelemetry, injecting <code class="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono">traceparent</code> headers across HTTP and message broker boundaries.</p>

          <div class="space-y-4 my-8 not-prose">
            <div class="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
              <div class="flex items-center gap-3 mb-2">
                <span class="px-2.5 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-md border border-blue-400/30">Tracing</span>
                <h3 class="text-lg font-bold text-white m-0">Distributed Tracing (OpenTelemetry + Jaeger)</h3>
              </div>
              <p class="text-sm text-slate-300 leading-relaxed m-0">Propagates Trace IDs and Span IDs through all inter-service HTTP headers and Kafka metadata records to visualize end-to-end request latencies and pinpoint slow database queries.</p>
            </div>

            <div class="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
              <div class="flex items-center gap-3 mb-2">
                <span class="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-md border border-emerald-400/30">Logging</span>
                <h3 class="text-lg font-bold text-white m-0">Structured JSON Logging (Pino)</h3>
              </div>
              <p class="text-sm text-slate-300 leading-relaxed m-0">Eliminates <code class="text-xs bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">console.log</code> in favor of high-performance asynchronous JSON logging that tags every log entry with <code class="text-xs bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">correlationId</code>, <code class="text-xs bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">serviceName</code>, <code class="text-xs bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">environment</code>, and <code class="text-xs bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">userId</code>.</p>
            </div>

            <div class="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
              <div class="flex items-center gap-3 mb-2">
                <span class="px-2.5 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-md border border-purple-400/30">Metrics</span>
                <h3 class="text-lg font-bold text-white m-0">Time-Series Metrics (Prometheus + Grafana)</h3>
              </div>
              <p class="text-sm text-slate-300 leading-relaxed m-0">Tracks RED metrics (Rate, Errors, Duration) alongside Node.js event loop lag, garbage collection cycles, active file descriptors, and Redis memory fragmentation ratios.</p>
            </div>
          </div>
        </section>

        <!-- Section 8 -->
        <section id="production-readiness-checklist" class="scroll-mt-20">
          <h2>8. Enterprise Production Readiness Checklist</h2>

          <div class="space-y-6 my-8 not-prose">
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h3 class="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 mt-0">
                <span class="w-3 h-3 rounded-full bg-blue-600"></span>
                Traffic &amp; State Management
              </h3>
              <ul class="space-y-3 pl-0 list-none text-sm text-slate-700">
                <li class="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <input type="checkbox" checked disabled class="mt-1 rounded text-blue-600 shrink-0" />
                  <span>Redis eviction policy explicitly configured to <code class="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">allkeys-lru</code> for pure caches or <code class="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">volatile-lru</code> for keyed session stores.</span>
                </li>
                <li class="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <input type="checkbox" checked disabled class="mt-1 rounded text-blue-600 shrink-0" />
                  <span>Connection pooling enabled with strict minimum/maximum pool constraints across Redis and PostgreSQL/MongoDB drivers.</span>
                </li>
                <li class="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <input type="checkbox" checked disabled class="mt-1 rounded text-blue-600 shrink-0" />
                  <span>Idempotency Keys implemented using Redis <code class="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">SET key value NX EX 86400</code> on all mutation endpoints (POST/PUT/PATCH).</span>
                </li>
              </ul>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h3 class="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 mt-0">
                <span class="w-3 h-3 rounded-full bg-indigo-600"></span>
                Container &amp; Infrastructure Hardening
              </h3>
              <ul class="space-y-3 pl-0 list-none text-sm text-slate-700">
                <li class="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <input type="checkbox" checked disabled class="mt-1 rounded text-indigo-600 shrink-0" />
                  <span>Containers execute as non-root users (<code class="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">USER node</code>) with read-only root filesystems where applicable.</span>
                </li>
                <li class="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <input type="checkbox" checked disabled class="mt-1 rounded text-indigo-600 shrink-0" />
                  <span>Graceful shutdown handlers capture <code class="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">SIGTERM</code> and <code class="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">SIGINT</code>, finishing active HTTP connections with a 15-30s drain window before exiting.</span>
                </li>
                <li class="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <input type="checkbox" checked disabled class="mt-1 rounded text-indigo-600 shrink-0" />
                  <span>CPU and memory request/limit quotas defined in Kubernetes manifests to prevent OOMKilled noisy-neighbor scenarios.</span>
                </li>
              </ul>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h3 class="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 mt-0">
                <span class="w-3 h-3 rounded-full bg-emerald-600"></span>
                Security &amp; Network Isolation
              </h3>
              <ul class="space-y-3 pl-0 list-none text-sm text-slate-700">
                <li class="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <input type="checkbox" checked disabled class="mt-1 rounded text-emerald-600 shrink-0" />
                  <span>Internal microservices isolated inside private subnets/VPCs; no direct public ingress except through the API Gateway.</span>
                </li>
                <li class="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <input type="checkbox" checked disabled class="mt-1 rounded text-emerald-600 shrink-0" />
                  <span>mTLS (Mutual TLS) enabled for service-to-service communication via an Envoy/Istio service mesh.</span>
                </li>
                <li class="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <input type="checkbox" checked disabled class="mt-1 rounded text-emerald-600 shrink-0" />
                  <span>Automated vulnerability scanning integrated into CI/CD pipelines via Trivy and Snyk.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- FAQ Section -->
        <section class="mt-14 pt-10 border-t border-slate-200 not-prose">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div class="space-y-4">
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 class="text-base font-bold text-slate-900 mb-2 mt-0 flex items-center gap-2">
                <span class="text-blue-600 font-bold">Q:</span> How do you maintain database transactions across multiple microservices without distributed locks?
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed m-0 pl-6">
                Avoid 2-Phase Commit (2PC) protocols as they introduce severe latency and locking overhead. Instead, use the Saga Pattern (either Orchestrated via a workflow engine like Temporal, or Choreographed via Kafka events) with compensating transactions to roll back state if a step in the pipeline fails.
              </p>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 class="text-base font-bold text-slate-900 mb-2 mt-0 flex items-center gap-2">
                <span class="text-blue-600 font-bold">Q:</span> When should I use gRPC instead of REST/HTTP for internal microservice communication?
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed m-0 pl-6">
                Use gRPC (Protocol Buffers over HTTP/2) for synchronous internal service-to-service communication where high throughput and sub-5ms latencies are critical. Use REST/JSON for public-facing edge gateways and asynchronous message brokers (Kafka/RabbitMQ) for decoupled, non-blocking workflows.
              </p>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 class="text-base font-bold text-slate-900 mb-2 mt-0 flex items-center gap-2">
                <span class="text-blue-600 font-bold">Q:</span> How do we prevent Redis from becoming a single point of failure (SPOF)?
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed m-0 pl-6">
                Deploy Redis in a high-availability Redis Cluster configuration with at least 3 master nodes and 3 replica nodes distributed across distinct availability zones, backed by automatic failover via Redis Sentinel or native cloud-managed services like AWS ElastiCache Multi-AZ.
              </p>
            </div>
          </div>
        </section>
      `,
      comments: [
        { authorIndex: 1, content: "This is one of the clearest breakdowns of Redis caching strategies I have read. Added to our internal team wiki!" },
        { authorIndex: 3, content: "Do you recommend using gRPC over HTTP REST for service-to-service internal communication?" }
      ]
    },
    {
      slug: 'ai-in-modern-web-apps',
      title: 'AI in Modern Web Apps: Integrating LLMs, RAG & Vector Search',
      category: 'Artificial Intelligence',
      excerpt: 'Learn how to integrate OpenAI, Pinecone vector embeddings, and Retrieval-Augmented Generation (RAG) into production web applications.',
      readTime: '10 min read',
      viewCount: 3150,
      featured: true,
      tags: ['AI', 'LLM', 'RAG', 'VectorDB', 'TypeScript'],
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'AI artificial intelligence brain concept',
      content: `
        <p>Combining Large Language Models (LLMs) with custom company domain knowledge requires Retrieval-Augmented Generation (RAG) architecture.</p>

        <h2>RAG Architecture Pipeline</h2>
        <ol>
          <li><strong>Chunking & Embedding:</strong> Break document texts into semantic chunks and store vectors in Pinecone/pgvector.</li>
          <li><strong>Semantic Search:</strong> Query vector DB for closest cosine distance match based on user prompt.</li>
          <li><strong>Prompt Synthesis:</strong> Feed relevant context chunks to GPT-4o along with system instructions.</li>
        </ol>
      `,
      comments: [
        { authorIndex: 3, content: "RAG has allowed us to build custom internal documentation assistants with zero hallucination. Essential reading!" },
        { authorIndex: 0, content: "Great explanation of pgvector vs Pinecone vector search trade-offs." }
      ]
    },
    {
      slug: 'mastering-nextjs-server-components',
      title: 'Mastering Next.js 15: App Router, Caching & Server Actions',
      category: 'Web Development',
      excerpt: 'In-depth guide covering Server Actions, revalidation strategies, parallel routes, and middleware optimization in Next.js 15.',
      readTime: '9 min read',
      viewCount: 1980,
      featured: false,
      tags: ['NextJS', 'React', 'Frontend', 'TypeScript'],
      coverImage: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Clean developer workspace with dual monitor setup',
      content: `
        <p>Next.js 15 introduces powerful primitives for data fetching and mutations via Server Actions, simplifying client-server synchronization.</p>
        <h2>Key Concepts Covered</h2>
        <p>We explore dynamic rendering, ISR revalidation, route handlers, and optimistic client UI updates using <code>useOptimistic</code> hook.</p>
      `,
      comments: [
        { authorIndex: 1, content: "Server Actions eliminated almost 40% of boilerplate API handlers in our application!" }
      ]
    },
    {
      slug: 'postgresql-performance-tuning',
      title: 'PostgreSQL Performance Tuning for High-Traffic Applications',
      category: 'Database Engineering',
      excerpt: 'Optimize slow queries, indexes, connection pooling, and autovacuum configuration for enterprise database workloads.',
      readTime: '11 min read',
      viewCount: 2450,
      featured: false,
      tags: ['PostgreSQL', 'SQL', 'Database', 'Performance'],
      coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Abstract database network node lines',
      content: `
        <p>A poorly indexed database can cripple even the fastest application server. Here is how to diagnose and optimize PostgreSQL performance.</p>
        <h2>Index Strategies & EXPLAIN ANALYZE</h2>
        <p>Learn how B-Tree, GIN, and Partial indexes drastically reduce scan times on tables with millions of rows.</p>
      `,
      comments: [
        { authorIndex: 2, content: "Partial indexes saved over 15GB of RAM in our Postgres cluster. Super useful advice!" }
      ]
    },
    {
      slug: 'zero-trust-architecture-guide',
      title: 'Zero Trust Security Architecture: Principles & Implementation',
      category: 'Cybersecurity',
      excerpt: 'Never trust, always verify. Learn how to implement Zero Trust security models across modern cloud environments.',
      readTime: '8 min read',
      viewCount: 1670,
      featured: false,
      tags: ['Security', 'ZeroTrust', 'Cloud', 'Auth'],
      coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Cybersecurity lock overlay on digital code',
      content: `
        <p>Zero Trust security assumes that threats exist both outside and inside the network boundary. Identity-centric authentication is mandatory.</p>
      `,
      comments: [
        { authorIndex: 2, content: "Mandatory reading for any cloud infrastructure lead." }
      ]
    }
  ];

  for (const b of blogsData) {
    const categoryId = categoryMap.get(b.category);
    
    const blog = await prisma.blog.upsert({
      where: { slug: b.slug },
      update: {
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        readTime: b.readTime,
        viewCount: b.viewCount,
        featured: b.featured,
        tags: b.tags,
        coverImage: b.coverImage,
        imageAlt: b.imageAlt,
        published: true,
        authorId: admin.id,
        categories: categoryId ? { set: [{ id: categoryId }] } : undefined
      },
      create: {
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        readTime: b.readTime,
        viewCount: b.viewCount,
        featured: b.featured,
        tags: b.tags,
        coverImage: b.coverImage,
        imageAlt: b.imageAlt,
        published: true,
        authorId: admin.id,
        categories: categoryId ? { connect: [{ id: categoryId }] } : undefined
      }
    });

    console.log(`📝 Blog ready: "${blog.title}"`);

    // Seed comments for this blog if not already present
    for (const c of b.comments) {
      const commenter = commenters[c.authorIndex % commenters.length];
      const existing = await prisma.comment.findFirst({
        where: { blogId: blog.id, content: c.content }
      });

      if (!existing) {
        await prisma.comment.create({
          data: {
            content: c.content,
            blogId: blog.id,
            authorId: commenter.id,
            approved: true
          }
        });
      }
    }
    console.log(`  💬 Comments verified for "${blog.title}".`);
  }

  // 5. Seed Structured Tutorial Tracks & Topics
  console.log('\n📚 Seeding interactive tutorial tracks & step-by-step topics...');

  const tutorialTracksData = [
    {
      slug: 'react-nextjs',
      title: 'React 19 & Next.js 15 Masterclass',
      category: 'Web Development',
      description: 'Master server components, server actions, dynamic routing, suspense streaming, and optimistic updates in production Next.js 15 applications.',
      level: 'Intermediate to Advanced',
      totalDuration: '8 Modules • 2h 45m',
      sortOrder: 1,
      topics: [
        {
          title: 'React Server Components (RSC) Architecture',
          duration: '20 min',
          summary: 'Understand the server-client mental model, zero-bundle overhead, and component serialization.',
          content: `
            <p>React Server Components (RSC) introduce a hybrid architecture where components execute on the server by default. This eliminates client-side JavaScript bundle overhead for static views and direct data fetching.</p>
            
            <h3>Key Advantages of RSC</h3>
            <ul>
              <li><strong>Zero Bundle Footprint:</strong> Server-only dependencies (e.g., Markdown parsers, DB drivers) never download to the client browser.</li>
              <li><strong>Direct Backend Access:</strong> Query PostgreSQL, Prisma, or internal microservices directly inside your component body.</li>
              <li><strong>Automatic Code Splitting:</strong> Client components are bundled dynamically only when imported.</li>
            </ul>

            <pre><code>// App/BlogPage.tsx (Server Component by Default)
import { db } from '@/lib/db';

export default async function BlogPage() {
  const posts = await db.blog.findMany({ where: { published: true } });

  return (
    &lt;div className="space-y-4"&gt;
      {posts.map(post =&gt; (
        &lt;article key={post.id} className="p-4 rounded-xl border"&gt;
          &lt;h3 className="font-bold text-lg"&gt;{post.title}&lt;/h3&gt;
        &lt;/article&gt;
      ))}
    &lt;/div&gt;
  );
}</code></pre>
          `
        },
        {
          title: 'Server Actions & Form Mutations',
          duration: '25 min',
          summary: 'Learn how to mutate data asynchronously with inline server functions and form states.',
          content: `
            <p>Server Actions allow client forms and user triggers to invoke server-side functions without writing separate manual REST API route boilerplate.</p>

            <pre><code>// actions/createComment.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addComment(formData: FormData) {
  const content = formData.get('content') as string;
  const blogId = formData.get('blogId') as string;

  await db.comment.create({
    data: { content, blogId, authorId: 'user_123', approved: true }
  });

  revalidatePath(\`/blog/\${blogId}\`);
}</code></pre>
          `
        },
        {
          title: 'Suspense Boundaries & Streaming SSR',
          duration: '20 min',
          summary: 'Stream slow async data chunks progressively without blocking page shell rendering.',
          content: `
            <p>Next.js 15 streams HTML segments from the server as soon as ready, wrapping slow data fetches inside <code>&lt;Suspense&gt;</code> fallbacks.</p>
          `
        },
        {
          title: 'Optimistic UI Updates with useOptimistic',
          duration: '15 min',
          summary: 'Provide instant UI feedback while background server mutations execute.',
          content: `
            <p>Using <code>useOptimistic</code>, applications display updated comment lists or like counts instantly while waiting for network responses.</p>
          `
        }
      ]
    },
    {
      slug: 'typescript',
      title: 'TypeScript for Enterprise Systems',
      category: 'Web Development',
      description: 'Master advanced generic constraints, utility types, type guards, discriminated unions, and Zod runtime schema validation.',
      level: 'Intermediate',
      totalDuration: '6 Modules • 2h 15m',
      sortOrder: 2,
      topics: [
        {
          title: 'Advanced Generics & Type Constraints',
          duration: '25 min',
          summary: 'Write reusable, type-safe utility functions using generic constraints and keyof inferencing.',
          content: `
            <p>Generics enable writing functions and data structures that work across multiple data models without sacrificing strict type safety.</p>

            <pre><code>function getProperty&lt;T, K extends keyof T&gt;(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 'u1', email: 'alex@dev.io', active: true };
const email = getProperty(user, 'email'); // Strongly typed as string</code></pre>
          `
        },
        {
          title: 'Discriminated Unions & Exhaustive Matching',
          duration: '20 min',
          summary: 'Prevent runtime state errors using tagged union types and never checks.',
          content: `
            <p>Discriminated unions use a common string literal property (e.g. <code>type</code> or <code>status</code>) to narrow complex state objects cleanly.</p>

            <pre><code>type AsyncState&lt;T&gt; =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

function renderState(state: AsyncState&lt;string[]&gt;) {
  switch (state.status) {
    case 'idle': return 'Click load to fetch';
    case 'loading': return 'Fetching items...';
    case 'success': return \`Loaded \${state.data.length} items\`;
    case 'error': return \`Failed: \${state.message}\`;
  }
}</code></pre>
          `
        },
        {
          title: 'Runtime Schema Validation with Zod',
          duration: '25 min',
          summary: 'Validate external API responses and form payloads safely at boundary runtime.',
          content: `
            <p>TypeScript compile-time checks vanish at runtime. Zod validates incoming payloads at runtime and infers matching static types.</p>
          `
        }
      ]
    },
    {
      slug: 'microservices',
      title: 'Node.js & Distributed Microservices',
      category: 'Architecture',
      description: 'Build fault-tolerant microservice architectures with Node.js, API Gateways, Redis distributed caching, and Docker containerization.',
      level: 'Advanced',
      totalDuration: '7 Modules • 3h 10m',
      sortOrder: 3,
      topics: [
        {
          title: 'Event Loop & Non-Blocking Async I/O',
          duration: '30 min',
          summary: 'Deep dive into Node.js event loop phases, microtasks queue, and libuv worker thread pools.',
          content: `
            <p>Understanding the Node.js event loop (Timers, Pending Callbacks, Poll, Check, Close) is critical to preventing main thread blockages in microservice routes.</p>
          `
        },
        {
          title: 'Redis Distributed Caching & Rate Limiting',
          duration: '30 min',
          summary: 'Accelerate sub-millisecond database queries and enforce token-bucket rate limits.',
          content: `
            <p>Redis caching handles thousands of concurrent read requests, reducing PostgreSQL load by up to 90% in peak traffic windows.</p>

            <pre><code>import Redis from 'iovalkey';
const redis = new Redis(process.env.REDIS_URL!);

export async function getCachedUser(userId: string) {
  const cached = await redis.get(\`user:\${userId}\`);
  if (cached) return JSON.parse(cached);

  const dbUser = await db.user.findUnique({ where: { id: userId } });
  await redis.set(\`user:\${userId}\`, JSON.stringify(dbUser), 'EX', 300); // 5 min TTL
  return dbUser;
}</code></pre>
          `
        }
      ]
    },
    {
      slug: 'postgresql',
      title: 'PostgreSQL Database Engineering',
      category: 'Database Engineering',
      description: 'Master relational schema modeling, indexing performance tuning, Prisma ORM, and query optimization.',
      level: 'Intermediate to Advanced',
      totalDuration: '6 Modules • 2h 50m',
      sortOrder: 4,
      topics: [
        {
          title: 'B-Tree & GIN Index Tuning with EXPLAIN ANALYZE',
          duration: '35 min',
          summary: 'Analyze query execution plans to convert slow sequential table scans into lightning-fast index seeks.',
          content: `
            <p>Using <code>EXPLAIN ANALYZE</code> reveals execution cost, row estimates, and actual time spent scanning Postgres heap blocks.</p>

            <pre><code>EXPLAIN ANALYZE 
SELECT * FROM blogs 
WHERE published = true AND tags @&gt; ARRAY['NextJS'];</code></pre>
          `
        }
      ]
    },
    {
      slug: 'ai-rag',
      title: 'AI & RAG Systems Integration',
      category: 'Artificial Intelligence',
      description: 'Build enterprise RAG pipelines with OpenAI LLMs, vector embeddings, pgvector storage, and streaming chat UIs.',
      level: 'Advanced',
      totalDuration: '5 Modules • 2h 20m',
      sortOrder: 5,
      topics: [
        {
          title: 'Vector Embeddings & Cosine Distance Search',
          duration: '30 min',
          summary: 'Convert text documents into 1536-dimensional semantic vectors and query nearest neighbors.',
          content: `
            <p>Vector embeddings transform unstructured textual documentation into high-dimensional numerical vectors where semantically similar concepts stay close in vector space.</p>
          `
        }
      ]
    }
  ];

  for (const trackInfo of tutorialTracksData) {
    const categoryId = categoryMap.get(trackInfo.category);

    const track = await prisma.tutorialTrack.upsert({
      where: { slug: trackInfo.slug },
      update: {
        title: trackInfo.title,
        description: trackInfo.description,
        level: trackInfo.level,
        totalDuration: trackInfo.totalDuration,
        sortOrder: trackInfo.sortOrder,
        published: true,
        categoryId: categoryId || undefined
      },
      create: {
        slug: trackInfo.slug,
        title: trackInfo.title,
        description: trackInfo.description,
        level: trackInfo.level,
        totalDuration: trackInfo.totalDuration,
        sortOrder: trackInfo.sortOrder,
        published: true,
        categoryId: categoryId || undefined
      }
    });

    console.log(`🎓 Tutorial Track ready: "${track.title}" (${track.slug})`);

    // Seed topics for this track
    let idx = 1;
    for (const t of trackInfo.topics) {
      const existingTopic = await prisma.tutorialTopic.findFirst({
        where: { trackId: track.id, title: t.title }
      });

      if (!existingTopic) {
        await prisma.tutorialTopic.create({
          data: {
            trackId: track.id,
            title: t.title,
            summary: t.summary,
            content: t.content,
            duration: t.duration,
            sortOrder: idx++,
            isFreePreview: true
          }
        });
      } else {
        await prisma.tutorialTopic.update({
          where: { id: existingTopic.id },
          data: {
            summary: t.summary,
            content: t.content,
            duration: t.duration,
            sortOrder: idx++
          }
        });
      }
    }
    console.log(`  📖 ${trackInfo.topics.length} topics seeded for "${track.title}".`);
  }

  console.log('\n✨ All rich blogs, discussion comments, and tutorial tracks seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Shared data for PyTech Digital — used by both server (SEO routes/API) and client components.
// Pure data + helpers. No 'use client'. No server-only imports.

export const COMPANY = {
  name: 'PyTech Digital',
  legalName: 'PyTech Digital Private Limited',
  tagline: 'Build. Brand. Market. Automate.',
  description:
    'PyTech Digital is a full-stack IT, digital solutions and growth firm headquartered in Gurugram, serving Delhi NCR and global markets. We build software, craft brands, drive AI-first marketing and automate revenue workflows.',
  hq: 'Gurugram, India',
  address: '24, 2nd Floor, Institutional Area, Prem Puri, Sector 32, Gurugram, Haryana 122001',
  email: 'hello@pytechdigital.com',
  phone: '+91 97116 23561',
  whatsapp: '919711623561', // digits only for wa.me link
  url: 'https://pytechdigital.com',
  founded: '2019',
  sameAs: ['https://pytechdigital.com'],
};

export const whatsappLink = (text) =>
  `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(text || 'Hi PyTech Digital, I would like to discuss a project.')}`;

// ---- Service pillars (the 4-part framework) ----
export const PILLARS = [
  {
    key: 'build',
    label: 'BUILD',
    accent: '#2dd4bf',
    blurb: 'Engineering-grade web, mobile & custom software.',
    icon: 'Code2',
  },
  {
    key: 'brand',
    label: 'BRAND',
    accent: '#a78bfa',
    blurb: 'Identity systems, 3D logos, UI/UX & packaging.',
    icon: 'Palette',
  },
  {
    key: 'market',
    label: 'MARKET',
    accent: '#38bdf8',
    blurb: 'Deep SEO, AI SEO & Generative Engine Optimization.',
    icon: 'TrendingUp',
  },
  {
    key: 'automate',
    label: 'AUTOMATE',
    accent: '#f472b6',
    blurb: 'WhatsApp/SMS/voice automation & workflow AI.',
    icon: 'Bot',
  },
];

// ---- Services ----
export const SERVICES = [
  // BUILD
  { slug: 'web-development', name: 'Web Development', pillar: 'build', icon: 'Globe',
    tagline: 'Blazing-fast, SEO-first websites & web apps.',
    summary: 'We engineer performant, accessible web experiences on Next.js with sub-second load times and conversion-first UX.',
    features: ['Next.js / React architecture', 'Headless CMS integration', 'Core Web Vitals optimization', 'Progressive Web Apps'],
    outcomes: ['2.4x faster load times', '38% lift in organic traffic', 'WCAG AA accessible'] },
  { slug: 'mobile-apps', name: 'Mobile App Development', pillar: 'build', icon: 'Smartphone',
    tagline: 'Native-grade iOS & Android apps users love.',
    summary: 'Cross-platform and native mobile apps with offline-first sync, real-time features and app-store-ready polish.',
    features: ['React Native & Flutter', 'Real-time sync', 'Push & in-app messaging', 'App store optimization'],
    outcomes: ['4.8★ average rating', '60% faster releases', 'Millions of sessions served'] },
  { slug: 'custom-software', name: 'Custom Software', pillar: 'build', icon: 'Server',
    tagline: 'Bespoke platforms & internal tools that scale.',
    summary: 'ERPs, CRMs, dashboards and APIs engineered around your exact workflow with cloud-native reliability.',
    features: ['Cloud-native microservices', 'Role-based dashboards', 'Third-party API integrations', 'Enterprise security'],
    outcomes: ['70% manual work removed', '99.9% uptime SLAs', 'Scaled to 1M+ records'] },
  { slug: 'trading-gaming-apps', name: 'Trading & Gaming Apps', pillar: 'build', icon: 'Gamepad2',
    tagline: 'Low-latency trading & real-money gaming platforms.',
    summary: 'High-throughput, low-latency systems for fintech trading and real-money gaming with compliance baked in.',
    features: ['Sub-100ms matching', 'Real-time wallets', 'Fraud & risk engines', 'Scalable websockets'],
    outcomes: ['<100ms latency', '10k+ concurrent users', 'PCI-aware architecture'] },
  // BRAND
  { slug: 'corporate-identity', name: 'Corporate Identity', pillar: 'brand', icon: 'BadgeCheck',
    tagline: 'Cohesive identity systems that command trust.',
    summary: 'From naming to full brand books — logos, palettes, typography and voice that make you unmistakable.',
    features: ['Brand strategy & naming', 'Logo & mark systems', 'Brand guidelines', 'Stationery & collateral'],
    outcomes: ['Unified brand across 20+ touchpoints', 'Higher recall', 'Premium perception'] },
  { slug: '3d-logo-design', name: '3D Logo Design', pillar: 'brand', icon: 'Box',
    tagline: 'Dimensional logos & motion-ready brand marks.',
    summary: 'Photoreal 3D logos and animated brand marks that pop across web, video and social.',
    features: ['3D modelling & rendering', 'Motion logo stingers', 'Material & lighting studies', 'Export for web/video'],
    outcomes: ['Scroll-stopping visuals', 'Reusable motion assets', 'Premium first impression'] },
  { slug: 'ui-ux-design', name: 'UI/UX Design', pillar: 'brand', icon: 'PenTool',
    tagline: 'Research-driven product design that converts.',
    summary: 'User research, journey mapping, design systems and pixel-perfect prototypes tested with real users.',
    features: ['User research & testing', 'Design systems', 'Interactive prototypes', 'Accessibility audits'],
    outcomes: ['32% higher conversion', 'Lower support tickets', 'Faster dev handoff'] },
  { slug: 'print-packaging', name: 'Print & Packaging', pillar: 'brand', icon: 'Package',
    tagline: 'Shelf-ready packaging & print that sells.',
    summary: 'Structural and graphic packaging design, print-ready artwork and premium finishes.',
    features: ['Structural design', 'Print-ready artwork', 'Dieline engineering', 'Finish & material specs'],
    outcomes: ['Retail-ready SKUs', 'On-brand unboxing', 'Reduced print errors'] },
  // MARKET
  { slug: 'digital-marketing', name: 'Digital Marketing', pillar: 'market', icon: 'Megaphone',
    tagline: 'Full-funnel performance marketing.',
    summary: 'Paid, social and content marketing engineered around measurable pipeline and ROAS.',
    features: ['Paid search & social', 'Content & creative', 'Marketing automation', 'Analytics & attribution'],
    outcomes: ['4.2x ROAS', 'Lower CAC', 'Predictable pipeline'] },
  { slug: 'seo', name: 'Deep SEO', pillar: 'market', icon: 'Search',
    tagline: 'Technical + content SEO that compounds.',
    summary: 'Technical audits, programmatic content and authority building that grows organic revenue quarter over quarter.',
    features: ['Technical SEO audits', 'Programmatic content', 'Link & authority building', 'Local SEO'],
    outcomes: ['+120% organic sessions', 'Top-3 rankings', 'Compounding traffic'] },
  { slug: 'ai-seo', name: 'AI SEO Strategy', pillar: 'market', icon: 'Sparkles',
    tagline: 'AI-accelerated content & search dominance.',
    summary: 'AI-assisted keyword clustering, content generation and optimization workflows at scale.',
    features: ['AI keyword clustering', 'Entity & topical maps', 'AI content pipelines', 'Continuous optimization'],
    outcomes: ['10x content velocity', 'Broader keyword coverage', 'Lower content cost'] },
  { slug: 'geo', name: 'Generative Engine Optimization', pillar: 'market', icon: 'Bot',
    tagline: 'Get cited by ChatGPT, Gemini & Perplexity.',
    summary: 'Structured knowledge, schema and entity optimization so LLMs cite you as the answer.',
    features: ['Schema.org & knowledge blocks', 'Entity optimization', 'LLM-readable content', 'Answer engine tracking'],
    outcomes: ['Cited in AI answers', 'Future-proof visibility', 'Higher brand authority'] },
  // AUTOMATE
  { slug: 'whatsapp-api', name: 'WhatsApp API Systems', pillar: 'automate', icon: 'MessageCircle',
    tagline: 'Official WhatsApp Business API automation.',
    summary: 'Broadcasts, chatbots, catalog commerce and CRM-synced conversations on the official WhatsApp Business API.',
    features: ['Official Cloud API setup', 'Chatbot flows', 'Broadcast campaigns', 'CRM & catalog sync'],
    outcomes: ['70%+ open rates', 'Automated support', 'Higher conversion'] },
  { slug: 'sms-marketing', name: 'SMS Marketing', pillar: 'automate', icon: 'MessageSquare',
    tagline: 'High-deliverability SMS at scale.',
    summary: 'DLT-compliant SMS campaigns, OTP and transactional flows with real-time delivery analytics.',
    features: ['DLT-compliant sending', 'Bulk & drip campaigns', 'OTP & transactional', 'Delivery analytics'],
    outcomes: ['98% delivery', 'Instant reach', 'Compliant at scale'] },
  { slug: 'voice-calling', name: 'Voice Calling Automation', pillar: 'automate', icon: 'PhoneCall',
    tagline: 'AI voice bots & automated call flows.',
    summary: 'IVR, automated outbound campaigns and AI voice agents that qualify and route leads 24/7.',
    features: ['AI voice agents', 'IVR & call routing', 'Outbound campaigns', 'Call analytics'],
    outcomes: ['24/7 coverage', 'Lower call-centre cost', 'Faster lead response'] },
  { slug: 'workflow-ai', name: 'Business Workflow AI', pillar: 'automate', icon: 'Workflow',
    tagline: 'Automate operations with AI agents.',
    summary: 'Connect your tools and deploy AI agents that automate ops, sales and support end-to-end.',
    features: ['AI agent orchestration', 'Tool & API integrations', 'Document & data automation', 'Human-in-the-loop'],
    outcomes: ['Hundreds of hours saved', 'Fewer errors', 'Scalable operations'] },
];

// ---- Locations for programmatic SEO ----
export const LOCATIONS = [
  { slug: 'noida', name: 'Noida', region: 'Uttar Pradesh, India', country: 'IN', hub: true },
  { slug: 'gurugram', name: 'Gurugram', region: 'Haryana, India', country: 'IN', hub: true },
  { slug: 'delhi', name: 'Delhi', region: 'Delhi NCR, India', country: 'IN' },
  { slug: 'bengaluru', name: 'Bengaluru', region: 'Karnataka, India', country: 'IN' },
  { slug: 'mumbai', name: 'Mumbai', region: 'Maharashtra, India', country: 'IN' },
  { slug: 'hyderabad', name: 'Hyderabad', region: 'Telangana, India', country: 'IN' },
  { slug: 'pune', name: 'Pune', region: 'Maharashtra, India', country: 'IN' },
  { slug: 'dubai', name: 'Dubai', region: 'United Arab Emirates', country: 'AE' },
  { slug: 'london', name: 'London', region: 'United Kingdom', country: 'GB' },
  { slug: 'singapore', name: 'Singapore', region: 'Singapore', country: 'SG' },
  { slug: 'new-york', name: 'New York', region: 'United States', country: 'US' },
];

// ---- Case studies ----
export const CASE_STUDIES = [
  {
    slug: 'fintech-trading-platform',
    title: 'Scaling a Fintech Trading Platform to 10k Concurrent Traders',
    client: 'Velocity Markets',
    pillar: 'build',
    industry: 'Fintech',
    excerpt: 'Re-architected a legacy trading app into a low-latency platform handling 10k+ concurrent traders.',
    challenge: 'A fast-growing brokerage was losing users to lag and downtime during peak market hours. Their monolith could not scale past 1,200 concurrent users and order execution routinely exceeded 800ms.',
    solution: 'We re-architected the core into event-driven microservices with a websocket gateway, an in-memory matching layer and horizontal auto-scaling. A new React front-end delivered real-time charts and sub-second order flow.',
    techStack: ['Next.js', 'Node.js', 'Redis', 'Kafka', 'PostgreSQL', 'Kubernetes', 'WebSockets'],
    outcomes: [
      { label: 'Order latency', value: '92ms', delta: '-88%' },
      { label: 'Concurrent users', value: '10,400', delta: '+766%' },
      { label: 'Uptime', value: '99.98%', delta: '+' },
      { label: 'Trade volume', value: '+3.1x', delta: '' },
    ],
  },
  {
    slug: 'd2c-whatsapp-automation',
    title: 'Automating a D2C Brand’s Sales on WhatsApp',
    client: 'Aura Wellness',
    pillar: 'automate',
    industry: 'D2C / E-commerce',
    excerpt: 'Deployed WhatsApp API automation that recovered abandoned carts and 5x-ed repeat orders.',
    challenge: 'A D2C wellness brand had a 71% cart abandonment rate and a support team drowning in repetitive WhatsApp queries with slow response times.',
    solution: 'We built an official WhatsApp Business API system with automated cart-recovery flows, a product catalog, an AI FAQ bot and CRM sync — with human handoff for complex queries.',
    techStack: ['WhatsApp Cloud API', 'Next.js', 'MongoDB', 'AI Agents', 'Shopify', 'Meta Catalog'],
    outcomes: [
      { label: 'Cart recovery', value: '34%', delta: '+34%' },
      { label: 'Repeat orders', value: '5x', delta: '' },
      { label: 'Response time', value: '<10s', delta: '-95%' },
      { label: 'Support load', value: '-62%', delta: '' },
    ],
  },
  {
    slug: 'saas-geo-seo-growth',
    title: 'Making a SaaS the Answer in AI Search (GEO + Deep SEO)',
    client: 'Northstar Analytics',
    pillar: 'market',
    industry: 'B2B SaaS',
    excerpt: 'Programmatic SEO + GEO strategy that got the brand cited by ChatGPT and grew organic 3.2x.',
    challenge: 'A B2B SaaS was invisible in both Google and AI answer engines, relying entirely on paid ads with a rising CAC.',
    solution: 'We shipped a programmatic SEO engine generating localized landing pages, layered structured knowledge blocks and schema for GEO, and built topical authority so LLMs cite the brand.',
    techStack: ['Next.js', 'Programmatic SEO', 'Schema.org', 'Content AI', 'GA4', 'Search Console'],
    outcomes: [
      { label: 'Organic traffic', value: '3.2x', delta: '' },
      { label: 'AI citations', value: '140+', delta: '' },
      { label: 'CAC', value: '-41%', delta: '' },
      { label: 'Ranking pages', value: '2,800+', delta: '' },
    ],
  },
];

// ---- Clients (logo ticker) ----
export const CLIENTS = [
  'Velocity Markets', 'Aura Wellness', 'Northstar', 'Zenith Labs', 'Orbit Pay',
  'Nimbus Cloud', 'Helios Energy', 'Quanta AI', 'Meridian', 'Pulse Health',
];

// ---- Helpers ----
export const getService = (slug) => SERVICES.find((s) => s.slug === slug) || null;
export const getLocation = (slug) => LOCATIONS.find((l) => l.slug === slug) || null;
export const getCaseStudy = (slug) => CASE_STUDIES.find((c) => c.slug === slug) || null;
export const getServicesByPillar = (pillar) => SERVICES.filter((s) => s.pillar === pillar);
export const getPillar = (key) => PILLARS.find((p) => p.key === key) || null;

// Localized FAQs for programmatic SEO pages
export const buildLocalFaqs = (service, location) => [
  {
    q: `Do you offer ${service.name} in ${location.name}?`,
    a: `Yes. PyTech Digital delivers ${service.name} for businesses in ${location.name} (${location.region}) — remotely and on-site — from our Noida HQ and Gurugram teams, with global delivery capability.`,
  },
  {
    q: `How much does ${service.name} cost in ${location.name}?`,
    a: `Pricing for ${service.name} in ${location.name} depends on scope and complexity. We offer transparent fixed-scope packages and retainers. Book a free strategy call for a tailored quote.`,
  },
  {
    q: `How long does a ${service.name} project take?`,
    a: `Most ${service.name} engagements for ${location.name} clients launch within 3–8 weeks depending on scope, with agile sprints and weekly demos so you see progress early.`,
  },
  {
    q: `Why choose PyTech Digital for ${service.name} in ${location.name}?`,
    a: `We combine engineering depth, premium design and AI-first growth. ${location.name} clients get a dedicated team, measurable outcomes and a partner that owns results end-to-end.`,
  },
];

// Generic (non-location) FAQs for the per-service detail pages
export const buildServiceFaqs = (service) => [
  { q: `What does ${service.name} include?`, a: `Our ${service.name} service covers ${service.features.slice(0, 3).join(', ')} and more — tailored to your goals. Every engagement includes a dedicated senior team, weekly demos and measurable outcomes.` },
  { q: `How much does ${service.name} cost?`, a: `Pricing depends on scope. We offer transparent fixed-scope packages and monthly retainers. Book a free strategy call for a tailored quote.` },
  { q: `How long does a ${service.name} project take?`, a: `Most ${service.name} engagements launch within 3–8 weeks depending on scope, delivered in agile sprints so you see progress early.` },
  { q: `Do you provide support after launch?`, a: `Yes — every project includes post-launch support, and you can add an ongoing care/retainer plan. Visit our Support Center anytime.` },
  { q: `Can I start with a small scope?`, a: `Absolutely. We can start with a focused pilot or phase one, then scale as you see results.` },
];

// Delivery process per pillar (4 steps)
export const PROCESS = {
  build: [
    { t: 'Discovery & Scope', d: 'We align on goals, users and success metrics, then lock a clear scope.' },
    { t: 'Architecture & Design', d: 'We design the system and UX with performance and scale in mind.' },
    { t: 'Build & Iterate', d: 'Agile sprints with weekly demos so you see progress early.' },
    { t: 'Launch & Scale', d: 'We ship, measure and optimise — and stay past launch.' },
  ],
  brand: [
    { t: 'Discovery & Research', d: 'We study your market, audience and competitors.' },
    { t: 'Concept & Direction', d: 'We explore visual directions and lock the one that fits.' },
    { t: 'Design System', d: 'We craft a cohesive, product-ready identity system.' },
    { t: 'Rollout & Guidelines', d: 'We deliver assets and guidelines for consistent use.' },
  ],
  market: [
    { t: 'Audit & Strategy', d: 'We audit your funnel and model growth on unit economics.' },
    { t: 'Setup & Tracking', d: 'We wire up analytics, attribution and campaigns.' },
    { t: 'Launch & Optimise', d: 'We launch, test and double down on what works.' },
    { t: 'Scale & Report', d: 'We scale winners and report on real outcomes weekly.' },
  ],
  automate: [
    { t: 'Map Workflows', d: 'We map your processes and pick the highest-ROI automations.' },
    { t: 'Build & Integrate', d: 'We build flows and connect your tools and APIs.' },
    { t: 'Test & Train', d: 'We test thoroughly and train your team.' },
    { t: 'Deploy & Monitor', d: 'We go live with monitoring and human-in-the-loop.' },
  ],
};

// Learning Hub content — real, readable guides (grows over time)
export const RESOURCES = [
  {
    pillar: 'build', slug: 'choosing-the-right-tech-stack', title: 'Choosing the right tech stack for your web app', tag: 'Guide', readTime: '6 min',
    excerpt: 'A practical framework for picking a stack you won\u2019t regret in 12 months \u2014 based on your team, timeline and scale.',
    content: [
      { h: 'Start with constraints, not trends', p: 'The best stack is the one your team can ship and maintain. Before comparing frameworks, write down your real constraints: team skills, timeline, budget, expected traffic, and how fast requirements will change. Trend-chasing is the most common (and expensive) mistake we see.' },
      { h: 'Default to Next.js for most products', p: 'For the vast majority of web apps and marketing sites, a React + Next.js (App Router) frontend with a Node or edge backend hits the sweet spot: great DX, first-class SEO, image optimization and a huge hiring pool. You only need something more exotic when you have a specific, proven bottleneck.' },
      { h: 'Pick a database around your access patterns', p: 'Relational (PostgreSQL) is a safe default for structured, related data. Reach for a document store (MongoDB) when your schema is fluid or document-shaped. Add a cache (Redis) only when you can measure a read bottleneck \u2014 not before.' },
      { h: 'Optimise for change, not perfection', p: 'Choose boring, well-documented tools with strong communities. Keep integrations behind small interfaces so you can swap them later. A stack that lets you change your mind cheaply beats a \u201cperfect\u201d stack that locks you in.' },
    ],
  },
  {
    pillar: 'build', slug: 'sub-second-lcp-on-nextjs', title: 'How we hit sub-second LCP on Next.js', tag: 'Playbook', readTime: '8 min',
    excerpt: 'The exact checklist we use to get Largest Contentful Paint under one second on real client sites.',
    content: [
      { h: 'Measure LCP on real devices first', p: 'Optimise what you can see. Use Lighthouse and real-user data (Core Web Vitals) on a mid-range mobile device \u2014 not your fast laptop. Identify the single element that is your LCP; usually a hero image or headline.' },
      { h: 'Ship less JavaScript', p: 'Use Server Components by default and add \u2018use client\u2019 only where you need interactivity. Lazy-load off-screen widgets, and keep third-party scripts async and minimal. Every KB of JS delays interactivity.' },
      { h: 'Serve images the right way', p: 'Use next/image (or properly sized, compressed images) with modern formats, correct dimensions and lazy loading for anything below the fold. Preload the LCP image so the browser fetches it immediately.' },
      { h: 'Cache aggressively at the edge', p: 'Static and incrementally-regenerated pages served from a CDN edge beat server round-trips every time. Set sensible cache headers and pre-render everything that isn\u2019t user-specific.' },
    ],
  },
  {
    pillar: 'brand', slug: 'brand-system-that-scales', title: 'Building a brand system that scales', tag: 'Guide', readTime: '5 min',
    excerpt: 'Why a logo isn\u2019t a brand \u2014 and how to build an identity system that stays consistent across every touchpoint.',
    content: [
      { h: 'A brand is a system, not a logo', p: 'A logo is one asset. A brand system is the logic that keeps everything \u2014 colour, type, spacing, imagery, motion and voice \u2014 feeling like one company across web, product, social and print.' },
      { h: 'Define tokens, not one-offs', p: 'Codify colours, type scales and spacing as reusable tokens. When design decisions live as tokens, teams apply them consistently and updates ripple everywhere instead of drifting.' },
      { h: 'Write the voice down', p: 'Visuals get the attention, but voice carries the personality. A one-page tone-of-voice guide with do/don\u2019t examples keeps every writer on-brand.' },
      { h: 'Ship guidelines people actually use', p: 'A 90-page PDF nobody opens is worthless. Deliver a living, product-ready guide with copy-paste assets and clear rules so the brand holds up as the team grows.' },
    ],
  },
  {
    pillar: 'brand', slug: 'why-3d-logos-win-2026', title: 'Why 3D logos win attention in 2026', tag: 'Article', readTime: '4 min',
    excerpt: 'Dimensional, motion-ready marks stop the scroll. Here\u2019s when they help \u2014 and when to keep it flat.',
    content: [
      { h: 'Attention is the scarce resource', p: 'Feeds are infinite; attention is not. A dimensional, animated brand mark earns a fraction of a second more attention \u2014 and that fraction compounds across millions of impressions.' },
      { h: 'Motion adds meaning', p: 'A logo that assembles, rotates or reacts communicates energy and craft. Used well, motion signals a premium, modern brand without saying a word.' },
      { h: 'Keep a flat fallback', p: 'You still need a crisp, flat version for tiny sizes, favicons and print. Design the 3D and flat marks together so they read as the same brand.' },
      { h: 'When to skip it', p: 'If your brand is about restraint, trust or minimalism, a clean flat mark may serve you better. 3D is a tool, not a mandate.' },
    ],
  },
  {
    pillar: 'market', slug: 'geo-101-chatgpt-gemini', title: 'GEO 101: getting cited by ChatGPT & Gemini', tag: 'Playbook', readTime: '9 min',
    excerpt: 'Generative Engine Optimization explained \u2014 how to structure content so AI answer engines cite you as the source.',
    content: [
      { h: 'Search is splitting in two', p: 'People increasingly ask ChatGPT, Gemini and Perplexity instead of scrolling ten blue links. GEO is the practice of making your content the answer these engines quote.' },
      { h: 'Structure for machines and humans', p: 'Use semantic HTML, clear headings, and Schema.org markup (Organization, Service, FAQPage). Add concise, self-contained \u201cknowledge blocks\u201d that an LLM can lift and cite without ambiguity.' },
      { h: 'Own your entities', p: 'Be consistent about who you are, what you do and where, across your site and the web. Strong, consistent entity signals make engines confident enough to cite you.' },
      { h: 'Measure AI visibility', p: 'Track when and how AI engines mention your brand, and which questions trigger citations. Then expand the content that earns them.' },
    ],
  },
  {
    pillar: 'market', slug: 'programmatic-seo-at-scale', title: 'Programmatic SEO at scale, explained', tag: 'Guide', readTime: '7 min',
    excerpt: 'How to generate thousands of genuinely useful, localized landing pages without spamming Google.',
    content: [
      { h: 'What programmatic SEO actually is', p: 'It\u2019s using structured data plus templates to create many pages that each target a specific, real query \u2014 for example \u201c[service] in [city]\u201d. Done right, it captures long-tail demand at scale.' },
      { h: 'Usefulness is non-negotiable', p: 'Google rewards pages that genuinely help. Each page needs unique, localized value: real FAQs, relevant proof, and specific detail \u2014 not just a find-and-replace of the city name.' },
      { h: 'Build the data model first', p: 'Model your services and locations as data, then render pages from templates. This is exactly how this very site scales to hundreds of pages from one component.' },
      { h: 'Link and index deliberately', p: 'Internal links, a clean sitemap and sensible canonicals help engines discover and trust the pages. Grow in controlled batches and watch performance.' },
    ],
  },
  {
    pillar: 'automate', slug: 'whatsapp-business-api-starter', title: 'WhatsApp Business API: a starter guide', tag: 'Guide', readTime: '6 min',
    excerpt: 'The difference between the app, Business app and Cloud API \u2014 and how to launch automation the right way.',
    content: [
      { h: 'App vs Business app vs API', p: 'The consumer app and Business app are for manual, small-scale chats. The official WhatsApp Business (Cloud) API is what powers automation, broadcasts and CRM integration at scale.' },
      { h: 'Templates and opt-in matter', p: 'Business-initiated messages use pre-approved templates and require opt-in. Respecting this keeps your number healthy and your messages delivered.' },
      { h: 'Automate the high-value flows', p: 'Start with the flows that move revenue: instant lead replies, cart recovery, order updates and an AI FAQ bot \u2014 with clean handoff to a human when needed.' },
      { h: 'Connect it to your CRM', p: 'Sync conversations and contacts to your CRM so sales sees context and nothing falls through the cracks. Automation without data is just noise.' },
    ],
  },
  {
    pillar: 'automate', slug: 'recovering-abandoned-carts', title: 'Recovering abandoned carts with automation', tag: 'Case note', readTime: '5 min',
    excerpt: 'A simple, repeatable WhatsApp + SMS sequence that recovers a meaningful share of lost carts.',
    content: [
      { h: 'Why carts get abandoned', p: 'Distraction, price hesitation, and friction at checkout. Most abandoners are not lost \u2014 they just need a timely, relevant nudge on a channel they actually read.' },
      { h: 'The sequence that works', p: 'A short, well-timed series \u2014 a reminder within the hour, a helpful nudge next day, and a gentle incentive if needed \u2014 on WhatsApp (with SMS fallback) consistently outperforms email alone.' },
      { h: 'Personalise with the cart', p: 'Reference the exact items and make it one tap to return to checkout. Relevance is what turns a nudge into a recovered sale.' },
      { h: 'Measure and iterate', p: 'Track recovery rate, revenue per message and opt-outs. Tune timing and copy \u2014 small changes here compound into real monthly revenue.' },
    ],
  },
];
export const getResourcesByPillar = (pillar) => RESOURCES.filter((r) => r.pillar === pillar);
export const getResource = (slug) => RESOURCES.find((r) => r.slug === slug) || null;

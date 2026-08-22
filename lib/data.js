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

// Learning Hub content (placeholder guides, grows over time)
export const RESOURCES = [
  { pillar: 'build', title: 'Choosing the right tech stack for your web app', tag: 'Guide', readTime: '6 min' },
  { pillar: 'build', title: 'How we hit sub-second LCP on Next.js', tag: 'Playbook', readTime: '8 min' },
  { pillar: 'brand', title: 'Building a brand system that scales', tag: 'Guide', readTime: '5 min' },
  { pillar: 'brand', title: 'Why 3D logos win attention in 2026', tag: 'Article', readTime: '4 min' },
  { pillar: 'market', title: 'GEO 101: getting cited by ChatGPT & Gemini', tag: 'Playbook', readTime: '9 min' },
  { pillar: 'market', title: 'Programmatic SEO at scale, explained', tag: 'Guide', readTime: '7 min' },
  { pillar: 'automate', title: 'WhatsApp Business API: a starter guide', tag: 'Guide', readTime: '6 min' },
  { pillar: 'automate', title: 'Recovering abandoned carts with automation', tag: 'Case note', readTime: '5 min' },
];
export const getResourcesByPillar = (pillar) => RESOURCES.filter((r) => r.pillar === pillar);

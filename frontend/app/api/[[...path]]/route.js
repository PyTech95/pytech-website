import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { LlmChat, UserMessage } from 'emergentintegrations'
import { SERVICES, LOCATIONS, JOBS, getJob, DEFAULT_OFFERINGS } from '@/lib/data'
import { putObject, getObject, APP_NAME } from '@/lib/storage'
import { sendApplicationEmail, sendLeadEmail, DEFAULT_RECIPIENT } from '@/lib/mailer'
import { SEO_PAGES } from '@/lib/seo'
import { getDb } from '@/lib/mongo'
import { listContent, validService } from '@/lib/cms'
import { cmsRoute } from '@/lib/cms-api'
import { mediaRoute } from '@/lib/media-api'
import { safeUrl } from '@/lib/content-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

const TRIAGE_SYSTEM_PROMPT = `You are "Ada", the AI triage assistant for PyTech Digital Private Limited — a full-stack IT, digital solutions and growth firm headquartered in Noida, India, serving Gurugram and global markets.

PyTech Digital works across four pillars:
1. BUILD — Web Development, Mobile Apps, Custom Software, Trading/Gaming Apps.
2. BRAND — Corporate Identity, 3D Logo Design, UI/UX, Print/Packaging.
3. MARKET — Digital Marketing, Deep SEO, AI SEO, Generative Engine Optimization (GEO).
4. AUTOMATE — WhatsApp API systems, SMS Marketing, Voice Calling automation, Business Workflow AI.

YOUR GOAL: qualify the visitor as a lead by warmly collecting, ONE question at a time:
1) Which service/pillar they need, 2) their main goal or problem, 3) rough timeline, 4) budget range (only after understanding their need). Keep replies short (1-3 sentences), friendly and confident. Use light emoji occasionally.

When you have enough (service + timeline + budget OR clear intent), summarize what you understood in one line and encourage them to continue on WhatsApp or book a strategy call. Never invent specific prices, guarantees or availability. Do not ask for passwords or payment details. Always be transparent you are an AI assistant.`

async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await getDb()

    // Health
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'PyTech Digital API is live', ok: true }))
    }

    // Services + locations metadata (for programmatic SEO / discovery)
    if (route === '/services' && method === 'GET') {
      return handleCORS(NextResponse.json({ services: await listContent('services'), locations: LOCATIONS }))
    }

    // ---- Admin auth (simple password) ----
    if (route === '/admin/login' && method === 'POST') {
      const body = await request.json()
      const ok = body?.password && body.password === (process.env.ADMIN_PASSWORD || '')
      if (!ok) return handleCORS(NextResponse.json({ error: 'Invalid password' }, { status: 401 }))
      return handleCORS(NextResponse.json({ ok: true }))
    }
    const isAdmin = () => {
      const key = request.headers.get('x-admin-key') || request.nextUrl.searchParams.get('key')
      return !!key && key === (process.env.ADMIN_PASSWORD || '')
    }

    if (route.startsWith('/cms/')) return handleCORS(await cmsRoute(request, route, db, isAdmin()))
    if (route === '/media' || route.startsWith('/media/')) return handleCORS(await mediaRoute(request, route, db, isAdmin()))

    // ---- Leads ----
    if (route === '/leads' && method === 'POST') {
      const body = await request.json()
      if (!body.name || !(body.email || body.phone)) {
        return handleCORS(NextResponse.json({ error: 'name and (email or phone) are required' }, { status: 400 }))
      }
      const lead = {
        id: uuidv4(),
        name: body.name,
        company: body.company || '',
        email: body.email || '',
        phone: body.phone || '',
        service: body.service || '',
        projectType: body.projectType || '',
        pages: body.pages || '',
        appType: body.appType || '',
        budget: body.budget || '',
        timeline: body.timeline || '',
        message: body.message || '',
        source: body.source || 'website',
        pageSource: body.pageSource || '',
        createdAt: new Date(),
      }
      await db.collection('leads').insertOne(lead)

      // Email notification (best-effort) using admin-configured Gmail settings
      try {
        const cfg = await db.collection('settings').findOne({ _id: 'email' })
        if (cfg && cfg.enabledEnquiries && cfg.user && cfg.pass) {
          const adminUrl = `${request.nextUrl.origin}/admin`
          await sendLeadEmail(cfg, lead, adminUrl)
          await db.collection('leads').updateOne({ id: lead.id }, { $set: { emailStatus: 'sent' } })
        } else {
          await db.collection('leads').updateOne({ id: lead.id }, { $set: { emailStatus: 'not_sent' } })
        }
      } catch (e) {
        console.error('Lead email failed:', e)
        await db.collection('leads').updateOne({ id: lead.id }, { $set: { emailStatus: 'failed', emailError: String(e?.message || e) } })
      }

      const { _id, ...clean } = lead
      return handleCORS(NextResponse.json({ ok: true, lead: clean }))
    }

    if (route === '/leads' && method === 'GET') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const leads = await db.collection('leads').find({}).sort({ createdAt: -1 }).limit(500).toArray()
      return handleCORS(NextResponse.json(leads.map(({ _id, ...rest }) => rest)))
    }

    // ---- Chat sessions (admin) ----
    if (route === '/chat/sessions' && method === 'GET') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const all = await db.collection('chat_messages').find({}).sort({ createdAt: 1 }).toArray()
      const map = {}
      for (const m of all) {
        if (!map[m.sessionId]) map[m.sessionId] = { sessionId: m.sessionId, messages: [], count: 0 }
        map[m.sessionId].messages.push({ role: m.role, content: m.content, createdAt: m.createdAt })
        map[m.sessionId].count++
      }
      const scores = await db.collection('chat_scores').find({}).toArray()
      const smap = {}
      for (const s of scores) smap[s.sessionId] = s
      const sessions = Object.values(map).map((s) => ({
        ...s,
        lastAt: s.messages[s.messages.length - 1]?.createdAt || null,
        preview: (s.messages.find((x) => x.role === 'user') || {}).content || 'Conversation',
        tier: smap[s.sessionId]?.tier || 'unscored',
        reason: smap[s.sessionId]?.reason || '',
      })).sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt))
      return handleCORS(NextResponse.json({ sessions }))
    }

    // ---- AI Triage Chat ----
    if (route === '/chat' && method === 'POST') {
      const body = await request.json()
      const message = typeof body.message === 'string' ? body.message.trim() : ''
      let sessionId = typeof body.sessionId === 'string' && body.sessionId.length >= 8 ? body.sessionId : uuidv4()

      if (!message || message.length > 4000) {
        return handleCORS(NextResponse.json({ error: 'message is required (1-4000 chars)' }, { status: 400 }))
      }
      if (!process.env.EMERGENT_LLM_KEY) {
        return handleCORS(NextResponse.json({ error: 'AI is not configured' }, { status: 500 }))
      }

      await db.collection('chat_messages').insertOne({
        id: uuidv4(), sessionId, role: 'user', content: message, createdAt: new Date(),
      })

      const chat = new LlmChat(process.env.EMERGENT_LLM_KEY, sessionId, TRIAGE_SYSTEM_PROMPT)
        .withModel('gemini', 'gemini-3.6-flash')
        .withParams({ temperature: 0.4, max_tokens: 500 })

      const answer = await chat.sendMessage(new UserMessage({ text: message }))
      const text = typeof answer === 'string' ? answer : (answer?.content || '')

      await db.collection('chat_messages').insertOne({
        id: uuidv4(), sessionId, role: 'assistant', content: text, createdAt: new Date(),
      })

      // ---- Lead scoring (best-effort; never blocks the reply) ----
      try {
        const history = await db.collection('chat_messages').find({ sessionId }).sort({ createdAt: 1 }).toArray()
        const convo = history.map((m) => `${m.role === 'user' ? 'Visitor' : 'Ada'}: ${m.content}`).join('\n')
        const scorer = new LlmChat(
          process.env.EMERGENT_LLM_KEY,
          `score-${sessionId}`,
          'You are a strict JSON API that scores B2B sales leads for a digital agency. You ONLY output minified JSON. Never add prose or markdown.'
        ).withModel('gemini', 'gemini-3.6-flash').withParams({ temperature: 0, max_tokens: 150 })

        const prompt = `Classify the sales lead from this conversation.\n\nCONVERSATION:\n${convo}\n\nRules: "hot" = clear need AND (budget or near-term timeline) or explicit buying intent. "warm" = interested but vague on budget/timeline. "cold" = just browsing / no clear need.\nReturn ONLY JSON exactly like {"tier":"hot","reason":"<max 14 words>"}.`
        const raw = await scorer.sendMessage(new UserMessage({ text: prompt }))
        const cleaned = String(raw || '').replace(/```json|```/g, '')
        const match = cleaned.match(/\{[\s\S]*\}/)
        let parsed = null
        try { parsed = match ? JSON.parse(match[0]) : null } catch (_) { parsed = null }

        let tier = ['hot', 'warm', 'cold'].includes(parsed?.tier) ? parsed.tier : null
        let reason = typeof parsed?.reason === 'string' ? parsed.reason.trim() : ''

        // Deterministic fallback so tier + reason are never empty/unreliable.
        if (!tier || !reason) {
          const t = convo.toLowerCase()
          const hasBudget = /(budget|\blakh\b|\blac\b|\bcr\b|crore|\u20b9|\$|\d+\s*k\b|\d+\s*l\b)/.test(t)
          const urgent = /(asap|urgent|immediately|this week|next month|this month|1 month|one month|ready to start|kick ?off|start now)/.test(t)
          const hasNeed = /(need|want|looking for|build|develop|automat|website|app|marketing|seo|whatsapp|brand)/.test(t)
          if (!tier) {
            if (hasNeed && (hasBudget && urgent)) tier = 'hot'
            else if (hasNeed && (hasBudget || urgent)) tier = 'warm'
            else if (hasNeed) tier = 'warm'
            else tier = 'cold'
          }
          if (!reason) {
            if (tier === 'hot') reason = 'Clear need with budget and a near-term timeline.'
            else if (tier === 'warm') reason = hasBudget || urgent ? 'Interested with some budget/timeline signals.' : 'Interested but budget and timeline still unclear.'
            else reason = 'Early browsing; no concrete need, budget or timeline yet.'
          }
        }

        await db.collection('chat_scores').updateOne(
          { sessionId },
          { $set: { sessionId, tier, reason, updatedAt: new Date() } },
          { upsert: true }
        )
      } catch (e) { /* scoring is best-effort */ }

      return handleCORS(NextResponse.json({ sessionId, message: text }))
    }

    if (route === '/chat' && method === 'GET') {
      const sessionId = request.nextUrl.searchParams.get('sessionId')
      if (!sessionId) return handleCORS(NextResponse.json({ error: 'sessionId required' }, { status: 400 }))
      const msgs = await db.collection('chat_messages')
        .find({ sessionId }).sort({ createdAt: 1 }).toArray()
      return handleCORS(NextResponse.json({ sessionId, messages: msgs.map(({ _id, ...r }) => r) }))
    }

    // ---- Projects (public read, admin write) ----
    if (route === '/projects' && method === 'GET') {
      const serviceSlug = request.nextUrl.searchParams.get('service')
      const projects = await db.collection('projects').find(serviceSlug ? { serviceSlug } : {}, { projection: { _id: 0 } }).sort({ order: 1, createdAt: -1 }).limit(200).toArray()
      return handleCORS(NextResponse.json({ projects: projects.map(({ _id, ...rest }) => rest) }))
    }
    if (route === '/projects' && method === 'POST') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const b = await request.json()
      if (typeof b.name !== 'string' || !b.name.trim()) return handleCORS(NextResponse.json({ error: 'name is required' }, { status: 400 }))
      if (!(await validService(b.serviceSlug))) return handleCORS(NextResponse.json({ error: 'Choose one published service for this project.' }, { status: 400 }))
      if (![b.url, b.image].every((v) => v == null || (typeof v === 'string' && safeUrl(v)))) return handleCORS(NextResponse.json({ error: 'Use a valid http(s) URL.' }, { status: 400 }))
      const project = {
        id: uuidv4(),
        name: b.name,
        url: b.url || '',
        client: b.client || '',
        category: b.category || '',
        serviceSlug: b.serviceSlug,
        deliveryTime: b.deliveryTime || '',
        challenges: b.challenges || '',
        description: b.description || '',
        tech: Array.isArray(b.tech) ? b.tech : (b.tech ? String(b.tech).split(',').map((t) => t.trim()).filter(Boolean) : []),
        image: b.image || '',
        featured: !!b.featured,
        order: Number(b.order) || 0,
        createdAt: new Date(),
      }
      await db.collection('projects').insertOne(project)
      const { _id, ...clean } = project
      return handleCORS(NextResponse.json({ ok: true, project: clean }))
    }
    if (route === '/projects' && method === 'PUT') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const b = await request.json()
      if (!b.id) return handleCORS(NextResponse.json({ error: 'id is required' }, { status: 400 }))
      const existing = await db.collection('projects').findOne({ id: b.id }, { projection: { _id: 0 } })
      if (!existing) return handleCORS(NextResponse.json({ error: 'Project not found' }, { status: 404 }))
      if ('serviceSlug' in b && !(await validService(b.serviceSlug))) return handleCORS(NextResponse.json({ error: 'Choose one published service for this project.' }, { status: 400 }))
      if ('name' in b && (typeof b.name !== 'string' || !b.name.trim())) return handleCORS(NextResponse.json({ error: 'Project name is required' }, { status: 400 }))
      if (![b.url, b.image].every((v) => v == null || (typeof v === 'string' && safeUrl(v)))) return handleCORS(NextResponse.json({ error: 'Use a valid http(s) URL.' }, { status: 400 }))
      const set = {}
      for (const f of ['name', 'url', 'client', 'category', 'serviceSlug', 'deliveryTime', 'challenges', 'description', 'image']) if (f in b) set[f] = b[f]
      if ('featured' in b) set.featured = !!b.featured
      if ('order' in b) set.order = Number(b.order) || 0
      if ('tech' in b) set.tech = Array.isArray(b.tech) ? b.tech : String(b.tech).split(',').map((t) => t.trim()).filter(Boolean)
      set.updatedAt = new Date()
      await db.collection('projects').updateOne({ id: b.id }, { $set: set })
      return handleCORS(NextResponse.json({ ok: true }))
    }
    if (route === '/projects' && method === 'DELETE') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const id = request.nextUrl.searchParams.get('id')
      if (!id) return handleCORS(NextResponse.json({ error: 'id is required' }, { status: 400 }))
      await db.collection('projects').deleteOne({ id })
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ---- Offerings (public read w/ first-run seed, admin write) ----
    if (route === '/offerings' && method === 'GET') {
      const col = db.collection('offerings')
      if (await col.countDocuments({}) === 0) {
        await col.insertMany(DEFAULT_OFFERINGS.map((o) => ({ id: uuidv4(), ...o, createdAt: new Date() })))
      }
      const offerings = await col.find({}).sort({ order: 1 }).toArray()
      return handleCORS(NextResponse.json({ offerings: offerings.map(({ _id, ...rest }) => rest) }))
    }
    if (route === '/offerings' && method === 'POST') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const b = await request.json()
      if (!b.title) return handleCORS(NextResponse.json({ error: 'title is required' }, { status: 400 }))
      const offering = {
        id: uuidv4(),
        title: b.title,
        slug: b.slug || String(b.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        icon: b.icon || 'Sparkles',
        serviceSlug: b.serviceSlug || '',
        blurb: b.blurb || '',
        points: Array.isArray(b.points) ? b.points : String(b.points || '').split('\n').map((p) => p.trim()).filter(Boolean),
        image: b.image || '',
        priceInr: b.priceInr === '' || b.priceInr == null ? null : Number(b.priceInr),
        priceUsd: b.priceUsd === '' || b.priceUsd == null ? null : Number(b.priceUsd),
        priceUnit: b.priceUnit || 'project',
        priceNote: b.priceNote || '',
        featured: b.featured !== false,
        order: Number(b.order) || 99,
        createdAt: new Date(),
      }
      await db.collection('offerings').insertOne(offering)
      const { _id, ...clean } = offering
      return handleCORS(NextResponse.json({ ok: true, offering: clean }))
    }
    if (route === '/offerings' && method === 'PUT') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const b = await request.json()
      if (!b.id) return handleCORS(NextResponse.json({ error: 'id is required' }, { status: 400 }))
      const set = {}
      for (const f of ['title', 'slug', 'icon', 'serviceSlug', 'blurb', 'image', 'priceUnit', 'priceNote']) if (f in b) set[f] = b[f]
      for (const f of ['priceInr', 'priceUsd']) if (f in b) set[f] = b[f] === '' || b[f] == null ? null : Number(b[f])
      if ('points' in b) set.points = Array.isArray(b.points) ? b.points : String(b.points || '').split('\n').map((p) => p.trim()).filter(Boolean)
      if ('featured' in b) set.featured = !!b.featured
      if ('order' in b) set.order = Number(b.order) || 99
      set.updatedAt = new Date()
      await db.collection('offerings').updateOne({ id: b.id }, { $set: set })
      return handleCORS(NextResponse.json({ ok: true }))
    }
    if (route === '/offerings' && method === 'DELETE') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const id = request.nextUrl.searchParams.get('id')
      if (!id) return handleCORS(NextResponse.json({ error: 'id is required' }, { status: 400 }))
      await db.collection('offerings').deleteOne({ id })
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ---- SEO overrides (admin-editable page titles/descriptions) ----
    if (route === '/seo' && method === 'GET') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const overrides = await db.collection('seo').find({}).toArray()
      const dynamicPages = (await Promise.all(['services', 'cases', 'posts'].map(async (type) => (await listContent(type, true)).map((item) => ({ path: `/${{ services: 'services', cases: 'case-studies', posts: 'blog' }[type]}/${item.slug}`, label: item.name || item.title }))))).flat()
      return handleCORS(NextResponse.json({ pages: [...SEO_PAGES, { path: '/blog', label: 'Blog / News' }, ...dynamicPages], overrides: overrides.map(({ _id, ...rest }) => rest) }))
    }
    if (route === '/seo' && method === 'PUT') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const b = await request.json()
      if (!b.path) return handleCORS(NextResponse.json({ error: 'path is required' }, { status: 400 }))
      const set = {
        path: b.path,
        title: b.title || '',
        description: b.description || '',
        keywords: Array.isArray(b.keywords) ? b.keywords : String(b.keywords || '').split(',').map((k) => k.trim()).filter(Boolean),
        updatedAt: new Date(),
      }
      if (!set.title && !set.description && !set.keywords.length) await db.collection('seo').deleteOne({ path: b.path })
      else await db.collection('seo').updateOne({ path: b.path }, { $set: set }, { upsert: true })
      return handleCORS(NextResponse.json({ ok: true }))
    }
    if (route === '/seo/verification' && method === 'GET') {
      const v = await db.collection('settings').findOne({ _id: 'seo_verify' })
      return handleCORS(NextResponse.json({ google: v?.google || '', bing: v?.bing || '' }))
    }
    if (route === '/seo/verification' && method === 'PUT') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const b = await request.json()
      await db.collection('settings').updateOne({ _id: 'seo_verify' }, { $set: { google: (b.google || '').trim(), bing: (b.bing || '').trim(), updatedAt: new Date() } }, { upsert: true })
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ---- Careers: application submission (multipart with resume) ----
    if (route === '/careers/apply' && method === 'POST') {
      const form = await request.formData()
      const get = (k) => (form.get(k) ? String(form.get(k)).trim() : '')
      const application = {
        id: uuidv4(),
        role: get('role') || 'General application',
        roleSlug: get('roleSlug'),
        name: get('name'),
        email: get('email'),
        phone: get('phone'),
        experience: get('experience'),
        company: get('company'),
        portfolio: get('portfolio'),
        coverLetter: get('coverLetter'),
        createdAt: new Date(),
        resume: null,
        emailStatus: 'not_sent',
      }
      if (!application.name || !application.email) {
        return handleCORS(NextResponse.json({ error: 'name and email are required' }, { status: 400 }))
      }

      // Upload resume to object storage (if provided)
      const file = form.get('resume')
      if (file && typeof file.arrayBuffer === 'function' && file.size > 0) {
        if (file.size > 10 * 1024 * 1024) {
          return handleCORS(NextResponse.json({ error: 'Resume must be under 10MB' }, { status: 400 }))
        }
        const orig = file.name || 'resume'
        const ext = orig.includes('.') ? orig.split('.').pop().toLowerCase().slice(0, 8) : 'pdf'
        const storagePath = `${APP_NAME}/resumes/${application.id}.${ext}`
        const buffer = Buffer.from(await file.arrayBuffer())
        try {
          const result = await putObject(storagePath, buffer, file.type || 'application/octet-stream')
          application.resume = { storagePath: result.path || storagePath, filename: orig, contentType: file.type || 'application/octet-stream', size: file.size }
        } catch (e) {
          console.error('Resume upload failed:', e)
        }
      }

      await db.collection('applications').insertOne(application)

      // Send email notification (best-effort) using admin-configured settings
      try {
        const cfg = await db.collection('settings').findOne({ _id: 'email' })
        if (cfg && cfg.enabled && cfg.user && cfg.pass) {
          let attachment = null
          if (application.resume) {
            try {
              const { buffer, contentType } = await getObject(application.resume.storagePath)
              attachment = { filename: application.resume.filename, content: buffer, contentType }
            } catch (e) { /* attach best-effort */ }
          }
          const adminUrl = `${request.nextUrl.origin}/admin`
          await sendApplicationEmail(cfg, application, attachment, adminUrl)
          await db.collection('applications').updateOne({ id: application.id }, { $set: { emailStatus: 'sent' } })
        }
      } catch (e) {
        console.error('Application email failed:', e)
        await db.collection('applications').updateOne({ id: application.id }, { $set: { emailStatus: 'failed', emailError: String(e?.message || e) } })
      }

      return handleCORS(NextResponse.json({ ok: true, id: application.id }))
    }

    if (route === '/careers/applications' && method === 'GET') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const apps = await db.collection('applications').find({}).sort({ createdAt: -1 }).limit(500).toArray()
      return handleCORS(NextResponse.json(apps.map(({ _id, emailError, ...rest }) => rest)))
    }

    // ---- Email settings (admin) ----
    if (route === '/settings/email' && method === 'GET') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const cfg = await db.collection('settings').findOne({ _id: 'email' })
      return handleCORS(NextResponse.json({
        host: cfg?.host || 'smtp.gmail.com',
        port: cfg?.port || 465,
        user: cfg?.user || '',
        recipient: cfg?.recipient || DEFAULT_RECIPIENT,
        enquiryRecipient: cfg?.enquiryRecipient || '',
        fromName: cfg?.fromName || 'PyTech Careers',
        enabled: !!cfg?.enabled,
        enabledEnquiries: !!cfg?.enabledEnquiries,
        hasPassword: !!cfg?.pass,
      }))
    }
    if (route === '/settings/email' && method === 'PUT') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const b = await request.json()
      const set = {
        host: b.host || 'smtp.gmail.com',
        port: Number(b.port) || 465,
        user: b.user || '',
        recipient: b.recipient || b.user || DEFAULT_RECIPIENT,
        enquiryRecipient: b.enquiryRecipient || '',
        fromName: b.fromName || 'PyTech Careers',
        enabled: !!b.enabled,
        enabledEnquiries: !!b.enabledEnquiries,
        updatedAt: new Date(),
      }
      if (typeof b.pass === 'string' && b.pass.length > 0) set.pass = b.pass.replace(/\s+/g, '')
      await db.collection('settings').updateOne({ _id: 'email' }, { $set: set }, { upsert: true })
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ---- File download (admin) — serves resumes from object storage ----
    if (route.startsWith('/files/') && method === 'GET') {
      if (!isAdmin()) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const storagePath = route.slice('/files/'.length)
      try {
        const { buffer, contentType } = await getObject(storagePath)
        return new NextResponse(buffer, { status: 200, headers: { 'Content-Type': contentType, 'Content-Disposition': 'inline' } })
      } catch (e) {
        return handleCORS(NextResponse.json({ error: 'File not found' }, { status: 404 }))
      }
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error', detail: String(error?.message || error) }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute

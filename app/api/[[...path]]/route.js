import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { LlmChat, UserMessage } from 'emergentintegrations'
import { SERVICES, LOCATIONS } from '@/lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ---- MongoDB (cached) ----
let client
let db
async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

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
    const db = await connectToMongo()

    // Health
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'PyTech Digital API is live', ok: true }))
    }

    // Services + locations metadata (for programmatic SEO / discovery)
    if (route === '/services' && method === 'GET') {
      return handleCORS(NextResponse.json({ services: SERVICES, locations: LOCATIONS }))
    }

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
        budget: body.budget || '',
        timeline: body.timeline || '',
        message: body.message || '',
        source: body.source || 'website',
        createdAt: new Date(),
      }
      await db.collection('leads').insertOne(lead)
      const { _id, ...clean } = lead
      return handleCORS(NextResponse.json({ ok: true, lead: clean }))
    }

    if (route === '/leads' && method === 'GET') {
      const leads = await db.collection('leads').find({}).sort({ createdAt: -1 }).limit(500).toArray()
      return handleCORS(NextResponse.json(leads.map(({ _id, ...rest }) => rest)))
    }

    // ---- Chat sessions (admin) ----
    if (route === '/chat/sessions' && method === 'GET') {
      const all = await db.collection('chat_messages').find({}).sort({ createdAt: 1 }).toArray()
      const map = {}
      for (const m of all) {
        if (!map[m.sessionId]) map[m.sessionId] = { sessionId: m.sessionId, messages: [], count: 0 }
        map[m.sessionId].messages.push({ role: m.role, content: m.content, createdAt: m.createdAt })
        map[m.sessionId].count++
      }
      const sessions = Object.values(map).map((s) => ({
        ...s,
        lastAt: s.messages[s.messages.length - 1]?.createdAt || null,
        preview: (s.messages.find((x) => x.role === 'user') || {}).content || 'Conversation',
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

      return handleCORS(NextResponse.json({ sessionId, message: text }))
    }

    if (route === '/chat' && method === 'GET') {
      const sessionId = request.nextUrl.searchParams.get('sessionId')
      if (!sessionId) return handleCORS(NextResponse.json({ error: 'sessionId required' }, { status: 400 }))
      const msgs = await db.collection('chat_messages')
        .find({ sessionId }).sort({ createdAt: 1 }).toArray()
      return handleCORS(NextResponse.json({ sessionId, messages: msgs.map(({ _id, ...r }) => r) }))
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

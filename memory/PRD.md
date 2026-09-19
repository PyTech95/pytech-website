# PyTech Digital — PRD & Deployment Notes

## Problem statement
User provided a "Hardened Deployment Plan" and the actual `pytech-website-main.zip` bundle with the
instruction "deploy here". Goal: get the bundle running and verified in the Emergent preview
environment, applying the plan's hardening (env-based config, no hardcoded localhost, explicit CORS,
health checks, SPA/deep-link fallback, fail-loud on missing env).

## What the bundle actually is
- **Next.js 15 (App Router)** unified full-stack app — NOT the CRA+FastAPI scaffold.
- MongoDB via `mongodb` driver. AI triage chatbot ("Ada") via `emergentintegrations` npm (Gemini).
- Marketing site for "PyTech Digital" (Gurugram IT/growth agency): Build/Brand/Market/Automate.
- Heavy programmatic SEO: services, service×location, locations, case-studies, resources, sitemap,
  robots, opengraph, JSON-LD schema. 3D WebGL hero (three / @react-three/fiber).
- API is a single catch-all route `app/api/[[...path]]/route.js`: `/api/`, `/api/services`,
  `/api/leads` (GET admin / POST public), `/api/chat` (POST triage + lead scoring, GET history),
  `/api/chat/sessions` (admin), `/api/admin/login`.

## Environment adaptation (IMPORTANT)
This pod is a **fastapi_react_mongo** base image, but the app is Next.js. Ingress routes `/api/*` to
:8001 and everything else to :3000; supervisor is read-only (`frontend`=`yarn start` in
`/app/frontend`, `backend`=`uvicorn server:app` on :8001).
- Next.js app placed in `/app/frontend`; its `start` script set to run `next dev` on :3000.
- `/app/backend/server.py` rewritten as a **reverse proxy** forwarding `/api/*` → `http://127.0.0.1:3000/api/*`
  (long timeout for Gemini). This bridges the ingress /api routing to the Next API handlers.
- Server env in `/app/frontend/.env.local` (gitignored). Backend needs `httpx` (added to requirements.txt).

## Hardening applied (from the plan)
- No hardcoded localhost in app code — all client fetches are relative `/api/*`.
- Secrets only in env (`.env.local`), not committed. ADMIN_PASSWORD + EMERGENT_LLM_KEY injected.
- Deep-link/unknown routes return Next's 404 (no broken SPA refresh).
- CORS handled in the API route via `CORS_ORIGINS` env.
- AI route fails loud (`500 AI is not configured`) if `EMERGENT_LLM_KEY` missing.

## Verified (2026-06 preview)
- Home + all key routes 200 (services, service/[slug], case-studies, locations, ai-automation,
  resources, support, admin, sitemap.xml, robots.txt); unknown route → 404.
- API: `/api/` live, `/api/services` OK, `/api/leads` POST writes to Mongo, `/api/admin/login`
  (correct=200 / wrong=401), `/api/chat` returns a Gemini response and scores the lead.
- Hero renders (headline, CTAs, stats, WebGL globe, ticker, chat FABs) on localhost AND external URL.

## Backlog / next
- P1: Run full E2E (lead form multi-step, chatbot UI, admin dashboard tiers).
- P2: For production Emergent deploy, prefer a native Next.js target (build+`next start`) rather than
  the preview proxy; set real `CORS_ORIGINS`, strong `ADMIN_PASSWORD`, GA/GSC env if desired.
- P2: Point `COMPANY.url` / metadataBase to the real production domain before go-live.

## Update — Careers, Projects, Work, Email settings, logo (2026-06)
Added on top of the migrated Next.js app:
- **Careers** (`/careers`, in top nav): 9 roles (BDE, BDM, HR, Frontend, Full-Stack, iOS, Android, SEO Specialist, Social Media Manager) grouped by department + application dialog. `POST /api/careers/apply` (multipart) stores the resume in Emergent **object storage** and saves the application; sends a Gmail-SMTP email with the resume attached IF admin email settings are enabled.
- **Admin** now has 5 tabs: Chats, Leads, **Projects** (full CRUD → `/api/projects`), **Applications** (list + resume download via `/api/files/<path>?key=`), **Email** settings (`/api/settings/email`, Gmail App Password entered here, never hardcoded).
- **Our Work** public page (`/work`, in top nav) + homepage "Recently shipped" section render admin-managed projects (featured on homepage).
- Service detail pages: replaced the full ~90-location wall with compact pills + **Load more** (`components/site/service-cities.js`).
- Navbar logo now stacks "Digital" under "PyTech.".
- New libs: `lib/storage.js` (object storage, Node), `lib/mailer.js` (nodemailer Gmail SMTP). `nodemailer` added to package.json.
- Tested: 18/18 backend pytest + full frontend E2E (iteration_2.json), all pass.

## Action item for the user
- To activate application emails: Admin → **Email** tab → enter sender Gmail (`rajeev.pytech@gmail.com`), a Gmail **App Password**, recipient, toggle **Send application emails** ON, Save. Until then, applications + resumes are still saved in Admin → Applications.

## Update — What we do, admin Offerings, Pricing page (2026-06)
User ask: homepage must instantly say what the company does; 6 offerings admin-managed; new Pricing page with INR + USD.
- **New API** `/api/offerings` (public GET, seeds 6 defaults from `lib/data.js` → `DEFAULT_OFFERINGS` on first read; admin POST/PUT/DELETE via `x-admin-key`). Fields: title, slug, icon, serviceSlug, blurb, points[], image, priceInr, priceUsd, priceUnit (project|month), priceNote, featured, order.
- **Homepage**: new `components/site/what-we-do.js` ("What we actually do" — 6 image cards: App Development, Website Development, ERP & Custom Software, AI & Automation, Digital Marketing, Branding & Design) placed after the 4 pillars; plus a bottom `#pricing` teaser using `components/site/pricing-table.js` (compact).
- **New `/pricing` page** (`app/pricing/page.js`): INR/USD toggle, 6 price cards, pricing FAQ + FAQPage/Service JSON-LD. Linked in navbar, mobile menu, footer and sitemap.
- **Seeded starting prices**: Website ₹20,000 / $250 · App ₹99,999 / $1,999 (user-given). Placeholder defaults (editable in Admin): ERP ₹1,49,999/$2,499 · AI automation ₹49,999/$799 · Digital marketing ₹24,999/$399 per month · Branding ₹29,999/$499.
- **Admin**: new **Offerings & Pricing** tab (full CRUD incl. both currencies, icon, bullets, image, homepage visibility). Existing 16 SEO service pages kept as-is (user choice).
- Tested: iteration_3.json — backend 5/5, all frontend flows (desktop + 390px mobile, no overflow) pass.

## Backlog / next
- P1: Replace placeholder prices for ERP / AI / Marketing / Branding with the real numbers (Admin → Offerings & Pricing).
- P1: Activate careers email (Admin → Email tab, Gmail App Password).
- P2: Self-host offering images instead of Unsplash URLs; split `route.js` per resource.

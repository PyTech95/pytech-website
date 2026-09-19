'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Search, Users, MessagesSquare, RefreshCw, Mail, Phone, Building2, Clock, Bot, User, Lock, LogOut, Flame,
  FolderGit2, FileText, Settings2, Download, Plus, Trash2, Star, Save, Send, ExternalLink, Briefcase, Tags,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ContentManager } from '@/components/admin/content-manager';
import { ImageField } from '@/components/admin/image-field';
import { useServices } from '@/components/site/content-provider';

const KEY_STORE = 'pytech-admin-key';
const fmt = (d) => { try { return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return ''; } };

const TIER_META = {
  hot: { label: 'Hot', cls: 'bg-red-500/15 text-red-400 border-red-500/30', rank: 0 },
  warm: { label: 'Warm', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30', rank: 1 },
  cold: { label: 'Cold', cls: 'bg-sky-500/15 text-sky-400 border-sky-500/30', rank: 2 },
  unscored: { label: 'Unscored', cls: 'bg-muted text-muted-foreground border-border', rank: 3 },
};

function TierBadge({ tier }) {
  const m = TIER_META[tier] || TIER_META.unscored;
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${m.cls}`}>{tier === 'hot' && <Flame className="h-3 w-3" />}{m.label}</span>;
}

const EMPTY_PROJECT = { id: '', name: '', url: '', client: '', category: '', serviceSlug: '', deliveryTime: '', challenges: '', description: '', tech: '', image: '', featured: false };
const EMPTY_OFFERING = { id: '', title: '', slug: '', icon: 'Sparkles', serviceSlug: '', blurb: '', points: '', image: '', priceInr: '', priceUsd: '', priceUnit: 'project', priceNote: '', order: 99, featured: true };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [key, setKey] = useState('');
  const [pwd, setPwd] = useState('');
  const [authError, setAuthError] = useState('');

  const [leads, setLeads] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [q, setQ] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existing = typeof window !== 'undefined' && window.localStorage.getItem(KEY_STORE);
    if (existing) { setKey(existing); setAuthed(true); }
  }, []);

  useEffect(() => { if (authed && key) load(key); }, [authed, key]);

  async function login(e) {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd }) });
      if (!res.ok) { setAuthError('Incorrect password'); return; }
      window.localStorage.setItem(KEY_STORE, pwd);
      setKey(pwd); setAuthed(true);
    } catch { setAuthError('Login failed'); }
  }

  function logout() {
    window.localStorage.removeItem(KEY_STORE);
    setKey(''); setAuthed(false); setPwd(''); setLeads([]); setSessions([]); setProjects([]); setApplications([]); setOfferings([]);
  }

  async function load(k) {
    setLoading(true);
    try {
      const h = { 'x-admin-key': k };
      const [lr, sr, pr, ar, or_] = await Promise.all([
        fetch('/api/leads', { headers: h }),
        fetch('/api/chat/sessions', { headers: h }),
        fetch('/api/projects'),
        fetch('/api/careers/applications', { headers: h }),
        fetch('/api/offerings'),
      ]);
      if (lr.status === 401 || sr.status === 401) { logout(); return; }
      const l = await lr.json();
      const s = await sr.json();
      const p = await pr.json();
      const a = await ar.json();
      const o = await or_.json();
      setLeads(Array.isArray(l) ? l : []);
      setSessions(s?.sessions || []);
      setProjects(Array.isArray(p?.projects) ? p.projects : []);
      setApplications(Array.isArray(a) ? a : []);
      setOfferings(Array.isArray(o?.offerings) ? o.offerings : []);
    } catch (e) { /* noop */ }
    setLoading(false);
  }

  const fLeads = useMemo(() => {
    const t = q.toLowerCase();
    return leads.filter((l) => !t || [l.name, l.email, l.company, l.service, l.phone].join(' ').toLowerCase().includes(t));
  }, [leads, q]);

  const fSessions = useMemo(() => {
    const t = q.toLowerCase();
    return sessions
      .filter((s) => tierFilter === 'all' || s.tier === tierFilter)
      .filter((s) => !t || (s.preview || '').toLowerCase().includes(t) || (s.messages || []).some((m) => (m.content || '').toLowerCase().includes(t)))
      .sort((a, b) => (TIER_META[a.tier]?.rank ?? 3) - (TIER_META[b.tier]?.rank ?? 3) || new Date(b.lastAt) - new Date(a.lastAt));
  }, [sessions, q, tierFilter]);

  const tierCounts = useMemo(() => {
    const c = { all: sessions.length, hot: 0, warm: 0, cold: 0, unscored: 0 };
    for (const s of sessions) c[s.tier] = (c[s.tier] || 0) + 1;
    return c;
  }, [sessions]);

  // ---- Login gate ----
  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center px-6">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-border bg-card/60 p-8">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary"><Lock className="h-6 w-6" /></span>
          <h1 className="mt-4 font-display text-2xl font-bold">Team access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter the password to manage leads, projects &amp; careers.</p>
          <div className="mt-6">
            <Label htmlFor="pwd">Password</Label>
            <Input id="pwd" data-testid="admin-password" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="mt-1.5" placeholder="••••••••" autoFocus />
            {authError && <p data-testid="admin-login-error" className="mt-2 text-xs text-destructive">{authError}</p>}
          </div>
          <Button type="submit" data-testid="admin-login-submit" className="mt-5 w-full rounded-full glow-brand" disabled={!pwd}>Unlock dashboard</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-6 pb-20 pt-28 md:pt-32">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Internal</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Content, projects, enquiries &amp; careers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => load(key)} className="rounded-full" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="ghost" onClick={logout} className="rounded-full text-muted-foreground"><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
        </div>
      </div>

      <div className="relative mt-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads & conversations…" className="rounded-full pl-9" />
      </div>

      <Tabs defaultValue="chats" className="mt-8">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-lg">
          <TabsTrigger value="chats" className="rounded-full gap-2"><MessagesSquare className="h-4 w-4" /> Chats <Badge variant="secondary" className="ml-1 rounded-full">{sessions.length}</Badge></TabsTrigger>
          <TabsTrigger value="leads" className="rounded-full gap-2"><Users className="h-4 w-4" /> Leads <Badge variant="secondary" className="ml-1 rounded-full">{leads.length}</Badge></TabsTrigger>
          <TabsTrigger value="projects" data-testid="tab-projects" className="rounded-full gap-2"><FolderGit2 className="h-4 w-4" /> Projects <Badge variant="secondary" className="ml-1 rounded-full">{projects.length}</Badge></TabsTrigger>
          <TabsTrigger value="posts" data-testid="tab-posts" className="rounded-full gap-2"><FileText className="h-4 w-4" /> Blog / News</TabsTrigger>
          <TabsTrigger value="cases" data-testid="tab-cases" className="rounded-full gap-2"><FolderGit2 className="h-4 w-4" /> Case Studies</TabsTrigger>
          <TabsTrigger value="services" data-testid="tab-services" className="rounded-full gap-2"><Settings2 className="h-4 w-4" /> Services</TabsTrigger>
          <TabsTrigger value="offerings" data-testid="tab-offerings" className="rounded-full gap-2"><Tags className="h-4 w-4" /> Offerings &amp; Pricing <Badge variant="secondary" className="ml-1 rounded-full">{offerings.length}</Badge></TabsTrigger>
          <TabsTrigger value="applications" className="rounded-full gap-2"><Briefcase className="h-4 w-4" /> Applications <Badge variant="secondary" className="ml-1 rounded-full">{applications.length}</Badge></TabsTrigger>
          <TabsTrigger value="seo" data-testid="tab-seo" className="rounded-full gap-2"><Search className="h-4 w-4" /> SEO</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-full gap-2"><Settings2 className="h-4 w-4" /> Email</TabsTrigger>
        </TabsList>

        {['posts', 'cases', 'services'].map((type) => <TabsContent key={type} value={type} className="mt-8 min-w-0"><ContentManager type={type} adminKey={key} /></TabsContent>)}
        {/* CONVERSATIONS */}
        <TabsContent value="chats" className="mt-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {['all', 'hot', 'warm', 'cold', 'unscored'].map((t) => (
              <button key={t} onClick={() => setTierFilter(t)} className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${tierFilter === t ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                {t} <span className="opacity-60">({tierCounts[t] || 0})</span>
              </button>
            ))}
          </div>
          {fSessions.length === 0 ? (
            <Empty loading={loading} label="No conversations match. AI chatbot chats appear here and are auto-scored hot/warm/cold." />
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {fSessions.map((s) => (
                <AccordionItem key={s.sessionId} value={s.sessionId} className="rounded-2xl border border-border bg-card/50 px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex w-full items-center justify-between gap-3 pr-3 text-left">
                      <span className="flex items-center gap-2">
                        <TierBadge tier={s.tier} />
                        <span className="line-clamp-1 max-w-[46vw] text-sm font-medium md:max-w-md">{s.preview || 'Conversation'}</span>
                      </span>
                      <span className="flex flex-none items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="rounded-full">{s.count} msgs</Badge>
                        <span className="hidden sm:inline">{fmt(s.lastAt)}</span>
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {s.reason && <p className="mb-3 rounded-lg bg-background/50 p-3 text-xs text-muted-foreground"><span className="font-medium text-foreground">Ada&apos;s read:</span> {s.reason}</p>}
                    <div className="space-y-3 py-1">
                      {(s.messages || []).map((m, i) => (
                        <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                          <span className={`inline-flex max-w-[85%] items-start gap-2 whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${m.role === 'user' ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-secondary text-secondary-foreground'}`}>
                            {m.role === 'user' ? <User className="mt-0.5 h-3.5 w-3.5 flex-none opacity-70" /> : <Bot className="mt-0.5 h-3.5 w-3.5 flex-none opacity-70" />}
                            <span>{m.content}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>

        {/* LEADS */}
        <TabsContent value="leads" className="mt-6">
          {fLeads.length === 0 ? (
            <Empty loading={loading} label="No leads yet. Lead form submissions appear here." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {fLeads.map((l) => (
                <div key={l.id} className="rounded-2xl border border-border bg-card/50 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-semibold">{l.name}</p>
                      {l.company && <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Building2 className="h-3.5 w-3.5" /> {l.company}</p>}
                    </div>
                    {l.service && <Badge className="rounded-full">{l.service}</Badge>}
                  </div>
                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {l.email && <a href={`mailto:${l.email}`} className="flex items-center gap-2 hover:text-foreground"><Mail className="h-3.5 w-3.5" /> {l.email}</a>}
                    {l.phone && <a href={`tel:${l.phone}`} className="flex items-center gap-2 hover:text-foreground"><Phone className="h-3.5 w-3.5" /> {l.phone}</a>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {l.projectType && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{l.projectType}</span>}
                    {l.pages && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">Pages: {l.pages}</span>}
                    {l.appType && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">App: {l.appType}</span>}
                    {l.budget && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">Budget: {l.budget}</span>}
                    {l.timeline && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">Timeline: {l.timeline}</span>}
                    {l.source && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">via {l.source}</span>}
                    {l.pageSource && <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary">from: {l.pageSource}</span>}
                  </div>
                  {l.message && <p className="mt-3 rounded-lg bg-background/50 p-3 text-sm text-muted-foreground">{l.message}</p>}
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/70"><Clock className="h-3 w-3" /> {fmt(l.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* PROJECTS */}
        <TabsContent value="projects" className="mt-6">
          <ProjectsManager adminKey={key} projects={projects} reload={() => load(key)} />
        </TabsContent>

        {/* OFFERINGS & PRICING */}
        <TabsContent value="offerings" className="mt-6">
          <OfferingsManager adminKey={key} offerings={offerings} reload={() => load(key)} />
        </TabsContent>

        {/* APPLICATIONS */}
        <TabsContent value="applications" className="mt-6">
          {applications.length === 0 ? (
            <Empty loading={loading} label="No applications yet. Career applications appear here with resume downloads." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {applications.map((a) => (
                <div key={a.id} className="rounded-2xl border border-border bg-card/50 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-semibold">{a.name}</p>
                      <Badge className="mt-1 rounded-full">{a.role}</Badge>
                    </div>
                    {a.emailStatus && <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${a.emailStatus === 'sent' ? 'bg-emerald-500/15 text-emerald-400' : a.emailStatus === 'failed' ? 'bg-red-500/15 text-red-400' : 'bg-muted text-muted-foreground'}`}>email: {a.emailStatus}</span>}
                  </div>
                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {a.email && <a href={`mailto:${a.email}`} className="flex items-center gap-2 hover:text-foreground"><Mail className="h-3.5 w-3.5" /> {a.email}</a>}
                    {a.phone && <a href={`tel:${a.phone}`} className="flex items-center gap-2 hover:text-foreground"><Phone className="h-3.5 w-3.5" /> {a.phone}</a>}
                    {a.experience && <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {a.experience}</p>}
                    {a.company && <p className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" /> {a.company}</p>}
                    {a.portfolio && <a href={a.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground"><ExternalLink className="h-3.5 w-3.5" /> Portfolio / LinkedIn</a>}
                  </div>
                  {a.coverLetter && <p className="mt-3 rounded-lg bg-background/50 p-3 text-sm text-muted-foreground">{a.coverLetter}</p>}
                  <div className="mt-4 flex items-center justify-between">
                    {a.resume ? (
                      <a href={`/api/files/${a.resume.storagePath}?key=${encodeURIComponent(key)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/25">
                        <Download className="h-3.5 w-3.5" /> {a.resume.filename || 'Resume'}
                      </a>
                    ) : <span className="text-xs text-muted-foreground">No resume attached</span>}
                    <span className="text-xs text-muted-foreground/70">{fmt(a.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="mt-6">
          <SeoManager adminKey={key} />
        </TabsContent>

        {/* EMAIL SETTINGS */}
        <TabsContent value="settings" className="mt-6">
          <EmailSettings adminKey={key} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectsManager({ adminKey, projects, reload }) {
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [serviceFilter, setServiceFilter] = useState('all');
  const services = useServices();
  const filtered = projects.filter((p) => serviceFilter === 'all' || (serviceFilter === 'untagged' ? !p.serviceSlug : p.serviceSlug === serviceFilter));
  const editing = !!form.id;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Project name is required'); return; }
    if (!form.serviceSlug) { toast.error('Choose a service for this project'); return; }
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch('/api/projects', { method, headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save project');
      toast.success(editing ? 'Project updated' : 'Project added');
      setForm(EMPTY_PROJECT);
      reload();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  }

  async function remove(id) {
    if (!window.confirm('Delete this project?')) return;
    try {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
      if (!res.ok) throw new Error('failed');
      toast.success('Project deleted');
      reload();
    } catch { toast.error('Could not delete'); }
  }

  async function toggleFeatured(p) {
    try {
      const res = await fetch('/api/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify({ id: p.id, featured: !p.featured }) });
      if (!res.ok) throw new Error('Update failed');
      reload();
    } catch { toast.error('Could not update'); }
  }

  function edit(p) {
    setForm({ ...EMPTY_PROJECT, ...p, tech: Array.isArray(p.tech) ? p.tech.join(', ') : (p.tech || '') });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const inp = 'mt-1.5';
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-5">
      <form onSubmit={save} className="min-w-0 lg:col-span-2 h-fit rounded-lg border border-border bg-card/50 p-5">
        <p className="font-display text-lg font-semibold">{editing ? 'Edit project' : 'Add a project'}</p>
        <div className="mt-4 space-y-3">
          <div><Label htmlFor="p-name">Project name *</Label><Input id="p-name" data-testid="project-name" value={form.name} onChange={set('name')} className={inp} placeholder="Velocity Trading Platform" /></div>
          <div><Label htmlFor="p-service">Service *</Label><select id="p-service" data-testid="project-service" value={form.serviceSlug} onChange={set('serviceSlug')} required className="cms-select mt-1.5"><option value="">Select one service</option>{services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="p-client">Client</Label><Input id="p-client" data-testid="project-client" value={form.client} onChange={set('client')} className={inp} placeholder="Velocity Markets" /></div>
            <div><Label htmlFor="p-cat">Category</Label><Input id="p-cat" data-testid="project-category" value={form.category} onChange={set('category')} className={inp} placeholder="Web App" /></div>
          </div>
          <div><Label htmlFor="p-url">Project URL</Label><Input id="p-url" data-testid="project-url" value={form.url} onChange={set('url')} className={inp} placeholder="https://…" /></div>
          <div><Label htmlFor="p-delivery">Delivery time</Label><Input id="p-delivery" data-testid="project-delivery" value={form.deliveryTime} onChange={set('deliveryTime')} className={inp} placeholder="e.g. 8 weeks" /></div>
          <div><Label htmlFor="p-tech">Tech (comma separated)</Label><Input id="p-tech" data-testid="project-tech" value={form.tech} onChange={set('tech')} className={inp} placeholder="Next.js, MongoDB, Redis" /></div>
          <ImageField id="project-image" value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v }))} adminKey={adminKey} onBusy={setUploading} />
          <div><Label htmlFor="p-desc">Short description</Label><Textarea id="p-desc" data-testid="project-description" value={form.description} onChange={set('description')} className={inp} rows={2} placeholder="One or two lines about the project." /></div>
          <div><Label htmlFor="p-chal">Challenges faced</Label><Textarea id="p-chal" data-testid="project-challenges" value={form.challenges} onChange={set('challenges')} className={inp} rows={3} placeholder="What challenges did we solve?" /></div>
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2">
            <span className="flex items-center gap-2 text-sm"><Star className="h-4 w-4 text-primary" /> Feature on homepage</span>
            <Switch data-testid="project-featured" checked={form.featured} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="submit" data-testid="project-save" disabled={saving || uploading} className="flex-1 rounded-full glow-brand">
            {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} {editing ? 'Update' : 'Add project'}
          </Button>
          {editing && <Button type="button" data-testid="project-cancel" variant="outline" className="rounded-full" onClick={() => setForm(EMPTY_PROJECT)}>Cancel</Button>}
        </div>
      </form>

      <div className="min-w-0 lg:col-span-3">
        <select aria-label="Filter projects by service" data-testid="admin-project-filter" value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="cms-select mb-4"><option value="all">All services</option><option value="untagged">Needs service tag</option>{services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select>
        {filtered.length === 0 ? (
          <Empty label="No projects yet. Add your first project on the left — it will show on the public Our Work page." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((p) => (
              <div key={p.id} data-testid={`admin-project-${p.id}`} className="flex min-w-0 flex-col break-words rounded-lg border border-border bg-card/50 p-4">
                {p.image && <img src={p.image} alt={p.name} className="mb-3 h-28 w-full rounded-lg object-cover" />}
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display font-semibold">{p.name}</p>
                  {p.featured && <Star className="h-4 w-4 flex-none fill-primary text-primary" />}
                </div>
                {p.category && <span className="mt-1 text-xs text-muted-foreground">{p.category}{p.client ? ` · ${p.client}` : ''}</span>}
                <span data-testid={`project-service-label-${p.id}`} className={`mt-2 text-xs ${p.serviceSlug ? 'text-primary' : 'text-amber-500'}`}>{services.find((s) => s.slug === p.serviceSlug)?.name || 'Needs service tag'}</span>
                {p.deliveryTime && <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {p.deliveryTime}</span>}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" data-testid={`project-edit-${p.id}`} variant="outline" className="rounded-full" onClick={() => edit(p)}>Edit</Button>
                  <Button size="sm" data-testid={`project-feature-${p.id}`} variant="ghost" className="rounded-full" onClick={() => toggleFeatured(p)}>{p.featured ? 'Unfeature' : 'Feature'}</Button>
                  <Button size="sm" data-testid={`project-delete-${p.id}`} aria-label="Delete project" variant="ghost" className="rounded-full text-destructive hover:text-destructive" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OfferingsManager({ adminKey, offerings, reload }) {
  const [form, setForm] = useState(EMPTY_OFFERING);
  const [saving, setSaving] = useState(false);
  const editing = !!form.id;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/offerings', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('failed');
      toast.success(editing ? 'Offering updated' : 'Offering added');
      setForm(EMPTY_OFFERING);
      reload();
    } catch { toast.error('Could not save offering'); }
    finally { setSaving(false); }
  }

  async function remove(id) {
    if (!window.confirm('Delete this offering? It will disappear from the homepage and pricing page.')) return;
    try {
      const res = await fetch(`/api/offerings?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
      if (!res.ok) throw new Error('failed');
      toast.success('Offering deleted');
      reload();
    } catch { toast.error('Could not delete'); }
  }

  function edit(o) {
    setForm({ ...EMPTY_OFFERING, ...o, points: Array.isArray(o.points) ? o.points.join('\n') : (o.points || ''), priceInr: o.priceInr ?? '', priceUsd: o.priceUsd ?? '' });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const inp = 'mt-1.5';
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={save} className="h-fit rounded-2xl border border-border bg-card/50 p-5 lg:col-span-2">
        <p className="font-display text-lg font-semibold">{editing ? 'Edit offering' : 'Add an offering'}</p>
        <p className="mt-1 text-xs text-muted-foreground">Powers the homepage “What we actually do” section and the Pricing page.</p>
        <div className="mt-4 space-y-3">
          <div><Label htmlFor="o-title">Title *</Label><Input id="o-title" data-testid="offering-title" value={form.title} onChange={set('title')} className={inp} placeholder="Website Development" /></div>
          <div><Label htmlFor="o-blurb">One-line blurb</Label><Textarea id="o-blurb" data-testid="offering-blurb" value={form.blurb} onChange={set('blurb')} className={inp} rows={2} placeholder="Blazing-fast, SEO-ready websites built on Next.js." /></div>
          <div><Label htmlFor="o-points">Bullet points (one per line)</Label><Textarea id="o-points" data-testid="offering-points" value={form.points} onChange={set('points')} className={inp} rows={3} placeholder={'Business sites & e-commerce\nSub-second load\nCMS for your team'} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="o-inr">Starting price (₹ INR)</Label><Input id="o-inr" data-testid="offering-inr" value={form.priceInr} onChange={set('priceInr')} className={inp} placeholder="20000" /></div>
            <div><Label htmlFor="o-usd">Starting price ($ USD)</Label><Input id="o-usd" data-testid="offering-usd" value={form.priceUsd} onChange={set('priceUsd')} className={inp} placeholder="250" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="o-unit">Price unit</Label>
              <select id="o-unit" value={form.priceUnit} onChange={set('priceUnit')} className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="project">per project</option>
                <option value="month">per month</option>
              </select>
            </div>
            <div><Label htmlFor="o-order">Display order</Label><Input id="o-order" value={form.order} onChange={set('order')} className={inp} placeholder="1" /></div>
          </div>
          <div><Label htmlFor="o-note">Price note (optional)</Label><Input id="o-note" value={form.priceNote} onChange={set('priceNote')} className={inp} placeholder="Scope-based, quoted in writing" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="o-icon">Icon</Label>
              <select id="o-icon" value={form.icon} onChange={set('icon')} className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                {['Smartphone', 'Globe', 'Server', 'Bot', 'Megaphone', 'Palette', 'Code2', 'Sparkles', 'Workflow', 'Search', 'PenTool', 'Package'].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div><Label htmlFor="o-service">Links to service slug</Label><Input id="o-service" value={form.serviceSlug} onChange={set('serviceSlug')} className={inp} placeholder="web-development" /></div>
          </div>
          <div><Label htmlFor="o-image">Image URL</Label><Input id="o-image" value={form.image} onChange={set('image')} className={inp} placeholder="https://…" /></div>
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2">
            <span className="flex items-center gap-2 text-sm"><Star className="h-4 w-4 text-primary" /> Show on homepage</span>
            <Switch checked={form.featured} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="submit" data-testid="offering-save" disabled={saving} className="flex-1 rounded-full glow-brand">
            {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} {editing ? 'Update' : 'Add offering'}
          </Button>
          {editing && <Button type="button" variant="outline" className="rounded-full" onClick={() => setForm(EMPTY_OFFERING)}>Cancel</Button>}
        </div>
      </form>

      <div className="lg:col-span-3">
        {offerings.length === 0 ? (
          <Empty label="No offerings yet — open the public Pricing page once and the six defaults get seeded, then edit them here." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {offerings.map((o) => (
              <div key={o.id} data-testid={`admin-offering-${o.slug || o.id}`} className="flex flex-col rounded-2xl border border-border bg-card/50 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display font-semibold">{o.title}</p>
                  {o.featured !== false && <Star className="h-4 w-4 flex-none fill-primary text-primary" />}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{o.blurb}</p>
                <p className="mt-2 text-sm">
                  {o.priceInr ? <span className="font-medium">₹{Number(o.priceInr).toLocaleString('en-IN')}</span> : <span className="text-muted-foreground">Custom</span>}
                  {o.priceUsd ? <span className="text-muted-foreground"> · ${Number(o.priceUsd).toLocaleString('en-US')}</span> : null}
                  <span className="text-xs text-muted-foreground"> /{o.priceUnit === 'month' ? 'mo' : 'project'}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" data-testid={`offering-edit-${o.slug || o.id}`} className="rounded-full" onClick={() => edit(o)}>Edit</Button>
                  <Button size="sm" variant="ghost" className="rounded-full text-destructive hover:text-destructive" onClick={() => remove(o.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SeoManager({ adminKey }) {
  const [pages, setPages] = useState([]);
  const [overrides, setOverrides] = useState({});
  const [active, setActive] = useState('/');
  const [form, setForm] = useState({ title: '', description: '', keywords: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/seo', { headers: { 'x-admin-key': adminKey } })
      .then((r) => r.json())
      .then((d) => {
        if (!d || d.error) return;
        setPages(d.pages || []);
        const map = {};
        for (const o of d.overrides || []) map[o.path] = o;
        setOverrides(map);
      })
      .catch(() => {});
  }, [adminKey]);

  useEffect(() => {
    const o = overrides[active] || {};
    setForm({ title: o.title || '', description: o.description || '', keywords: Array.isArray(o.keywords) ? o.keywords.join(', ') : '' });
  }, [active, overrides]);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ path: active, ...form }),
      });
      if (!res.ok) throw new Error('failed');
      setOverrides((m) => ({ ...m, [active]: { path: active, ...form, keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean) } }));
      toast.success('SEO saved — live on the page now');
    } catch { toast.error('Could not save SEO'); }
    finally { setSaving(false); }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Pages</p>
        <div className="flex flex-wrap gap-2 lg:flex-col">
          {pages.map((p) => (
            <button
              key={p.path}
              onClick={() => setActive(p.path)}
              data-testid={`seo-page-${p.path === '/' ? 'home' : p.path.slice(1)}`}
              className={`rounded-full border px-3.5 py-1.5 text-left text-sm transition-colors lg:rounded-lg ${active === p.path ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {p.label}
              {overrides[p.path]?.title ? <span className="ml-1.5 text-[10px] text-primary">edited</span> : null}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={save} className="h-fit rounded-2xl border border-border bg-card/50 p-6 lg:col-span-3">
        <p className="font-display text-lg font-semibold">SEO for <span className="text-primary">{active}</span></p>
        <p className="mt-1 text-xs text-muted-foreground">Leave a field blank to keep the built-in default. Changes go live immediately.</p>
        <div className="mt-5 space-y-3">
          <div>
            <Label htmlFor="seo-title">Page title (50–60 chars ideal)</Label>
            <Input id="seo-title" data-testid="seo-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1.5" placeholder="Website & App Development Company in Gurugram" />
            <p className="mt-1 text-xs text-muted-foreground">{form.title.length} chars</p>
          </div>
          <div>
            <Label htmlFor="seo-desc">Meta description (150–160 chars ideal)</Label>
            <Textarea id="seo-desc" data-testid="seo-description" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="mt-1.5" placeholder="PyTech Digital builds apps, websites, ERP software…" />
            <p className="mt-1 text-xs text-muted-foreground">{form.description.length} chars</p>
          </div>
          <div>
            <Label htmlFor="seo-kw">Keywords (comma separated)</Label>
            <Input id="seo-kw" data-testid="seo-keywords" value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} className="mt-1.5" placeholder="app development gurugram, website development india" />
          </div>
        </div>
        <Button type="submit" data-testid="seo-save" disabled={saving} className="mt-5 rounded-full glow-brand">
          {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save SEO
        </Button>
      </form>
    </div>
  );
}

function EmailSettings({ adminKey }) {
  const [cfg, setCfg] = useState({ host: 'smtp.gmail.com', port: 465, user: '', recipient: '', fromName: 'PyTech Careers', enabled: false, hasPassword: false });
  const [pass, setPass] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setCfg((c) => ({ ...c, [k]: e.target.value }));

  useEffect(() => {
    fetch('/api/settings/email', { headers: { 'x-admin-key': adminKey } })
      .then((r) => r.json())
      .then((d) => { if (d && !d.error) setCfg((c) => ({ ...c, ...d })); })
      .catch(() => {});
  }, [adminKey]);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...cfg };
      if (pass) body.pass = pass;
      const res = await fetch('/api/settings/email', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('failed');
      toast.success('Email settings saved');
      setPass('');
      setCfg((c) => ({ ...c, hasPassword: c.hasPassword || !!pass }));
    } catch { toast.error('Could not save settings'); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={save} className="max-w-xl rounded-2xl border border-border bg-card/50 p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-primary/15 text-primary"><Mail className="h-5 w-5" /></span>
        <div>
          <p className="font-display text-lg font-semibold">Job application email (Gmail SMTP)</p>
          <p className="mt-1 text-sm text-muted-foreground">Applications are emailed here with the resume attached. Use a Gmail <b>App Password</b> (needs 2-Step Verification on).</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2"><Label htmlFor="s-host">SMTP host</Label><Input id="s-host" value={cfg.host} onChange={set('host')} className="mt-1.5" /></div>
          <div><Label htmlFor="s-port">Port</Label><Input id="s-port" value={cfg.port} onChange={set('port')} className="mt-1.5" /></div>
        </div>
        <div><Label htmlFor="s-user">Sender Gmail address</Label><Input id="s-user" data-testid="email-user" value={cfg.user} onChange={set('user')} className="mt-1.5" placeholder="rajeev.pytech@gmail.com" /></div>
        <div>
          <Label htmlFor="s-pass">Gmail App Password (16 chars)</Label>
          <Input id="s-pass" data-testid="email-pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="mt-1.5" placeholder={cfg.hasPassword ? '•••••••• (saved — leave blank to keep)' : 'abcd efgh ijkl mnop'} />
          <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"><ExternalLink className="h-3 w-3" /> Get an App Password</a>
        </div>
        <div><Label htmlFor="s-recipient">Recipient (where applications land)</Label><Input id="s-recipient" data-testid="email-recipient" value={cfg.recipient} onChange={set('recipient')} className="mt-1.5" placeholder="rajeev.pytech@gmail.com" /></div>
        <div><Label htmlFor="s-from">From name</Label><Input id="s-from" value={cfg.fromName} onChange={set('fromName')} className="mt-1.5" /></div>
        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2.5">
          <span className="flex items-center gap-2 text-sm"><Send className="h-4 w-4 text-primary" /> Send application emails</span>
          <Switch checked={cfg.enabled} onCheckedChange={(v) => setCfg((c) => ({ ...c, enabled: v }))} data-testid="email-enabled" />
        </label>
      </div>

      <Button type="submit" data-testid="email-save" disabled={saving} className="mt-5 w-full rounded-full glow-brand">
        {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save email settings
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">Until enabled, applications &amp; resumes are still saved here in the Applications tab.</p>
    </form>
  );
}

function Empty({ loading, label }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/30 p-12 text-center text-sm text-muted-foreground">
      {loading ? 'Loading…' : label}
    </div>
  );
}

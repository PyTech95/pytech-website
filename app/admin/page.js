'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Users, MessagesSquare, RefreshCw, Mail, Phone, Building2, Clock, Bot, User, Lock, LogOut, Flame } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [key, setKey] = useState('');
  const [pwd, setPwd] = useState('');
  const [authError, setAuthError] = useState('');

  const [leads, setLeads] = useState([]);
  const [sessions, setSessions] = useState([]);
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
    setKey(''); setAuthed(false); setPwd(''); setLeads([]); setSessions([]);
  }

  async function load(k) {
    setLoading(true);
    try {
      const h = { 'x-admin-key': k };
      const [lr, sr] = await Promise.all([
        fetch('/api/leads', { headers: h }),
        fetch('/api/chat/sessions', { headers: h }),
      ]);
      if (lr.status === 401 || sr.status === 401) { logout(); return; }
      const l = await lr.json();
      const s = await sr.json();
      setLeads(Array.isArray(l) ? l : []);
      setSessions(s?.sessions || []);
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
          <p className="mt-1 text-sm text-muted-foreground">Enter the password to view leads &amp; conversations.</p>
          <div className="mt-6">
            <Label htmlFor="pwd">Password</Label>
            <Input id="pwd" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="mt-1.5" placeholder="••••••••" autoFocus />
            {authError && <p className="mt-2 text-xs text-destructive">{authError}</p>}
          </div>
          <Button type="submit" className="mt-5 w-full rounded-full glow-brand" disabled={!pwd}>Unlock dashboard</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-6 pb-20 pt-28 md:pt-32">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Internal</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">Leads &amp; Conversations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Every lead submission and AI chatbot conversation, auto-scored by Ada.</p>
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
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, message…" className="rounded-full pl-9" />
      </div>

      <Tabs defaultValue="chats" className="mt-8">
        <TabsList className="rounded-full">
          <TabsTrigger value="chats" className="rounded-full gap-2"><MessagesSquare className="h-4 w-4" /> Conversations <Badge variant="secondary" className="ml-1 rounded-full">{sessions.length}</Badge></TabsTrigger>
          <TabsTrigger value="leads" className="rounded-full gap-2"><Users className="h-4 w-4" /> Leads <Badge variant="secondary" className="ml-1 rounded-full">{leads.length}</Badge></TabsTrigger>
        </TabsList>

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
                    {l.budget && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">Budget: {l.budget}</span>}
                    {l.timeline && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">Timeline: {l.timeline}</span>}
                    {l.source && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">via {l.source}</span>}
                  </div>
                  {l.message && <p className="mt-3 rounded-lg bg-background/50 p-3 text-sm text-muted-foreground">{l.message}</p>}
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/70"><Clock className="h-3 w-3" /> {fmt(l.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Empty({ loading, label }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/30 p-12 text-center text-sm text-muted-foreground">
      {loading ? 'Loading…' : label}
    </div>
  );
}

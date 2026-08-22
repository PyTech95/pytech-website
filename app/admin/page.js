'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Users, MessagesSquare, RefreshCw, Mail, Phone, Building2, Clock, Bot, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const fmt = (d) => { try { return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return ''; } };

export default function AdminPage() {
  const [leads, setLeads] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [l, s] = await Promise.all([
        fetch('/api/leads').then((r) => r.json()),
        fetch('/api/chat/sessions').then((r) => r.json()),
      ]);
      setLeads(Array.isArray(l) ? l : []);
      setSessions(s?.sessions || []);
    } catch (e) { /* noop */ }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const fLeads = useMemo(() => {
    const t = q.toLowerCase();
    return leads.filter((l) => !t || [l.name, l.email, l.company, l.service, l.phone].join(' ').toLowerCase().includes(t));
  }, [leads, q]);

  const fSessions = useMemo(() => {
    const t = q.toLowerCase();
    return sessions.filter((s) => !t || (s.preview || '').toLowerCase().includes(t) || (s.messages || []).some((m) => (m.content || '').toLowerCase().includes(t)));
  }, [sessions, q]);

  return (
    <div className="container mx-auto min-h-screen px-6 pb-20 pt-28 md:pt-32">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Internal</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">Leads &amp; Conversations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Every lead form submission and AI chatbot conversation, in one place.</p>
        </div>
        <Button variant="outline" onClick={load} className="rounded-full" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="relative mt-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, message…" className="rounded-full pl-9" />
      </div>

      <Tabs defaultValue="leads" className="mt-8">
        <TabsList className="rounded-full">
          <TabsTrigger value="leads" className="rounded-full gap-2"><Users className="h-4 w-4" /> Leads <Badge variant="secondary" className="ml-1 rounded-full">{fLeads.length}</Badge></TabsTrigger>
          <TabsTrigger value="chats" className="rounded-full gap-2"><MessagesSquare className="h-4 w-4" /> Conversations <Badge variant="secondary" className="ml-1 rounded-full">{fSessions.length}</Badge></TabsTrigger>
        </TabsList>

        {/* LEADS */}
        <TabsContent value="leads" className="mt-6">
          {fLeads.length === 0 ? (
            <Empty loading={loading} label="No leads yet. Submissions from the lead form will appear here." />
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

        {/* CONVERSATIONS */}
        <TabsContent value="chats" className="mt-6">
          {fSessions.length === 0 ? (
            <Empty loading={loading} label="No conversations yet. AI chatbot chats will appear here." />
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {fSessions.map((s) => (
                <AccordionItem key={s.sessionId} value={s.sessionId} className="rounded-2xl border border-border bg-card/50 px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex w-full items-center justify-between gap-3 pr-3 text-left">
                      <span className="line-clamp-1 max-w-[70%] text-sm font-medium">{s.preview || 'Conversation'}</span>
                      <span className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="rounded-full">{s.count} msgs</Badge>
                        {fmt(s.lastAt)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 py-2">
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

'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Check, PartyPopper, CalendarCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const TYPES = ['Website', 'Mobile App', 'ERP / Custom Software', 'Digital Marketing', 'Branding & Design', 'AI Automation', 'Something else'];

const EMPTY = { name: '', company: '', email: '', phone: '', projectType: '', pages: '', appType: '', budget: '', timeline: '', message: '' };

export function BookCallDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    function onDocClick(e) {
      const el = e.target.closest?.('[data-book-call], a[href="/#contact"], a[href="#contact"]');
      if (!el) return;
      e.preventDefault();
      setDone(false);
      setOpen(true);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { toast.error('Please add your name and email'); return; }
    setSending(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          service: form.projectType,
          source: 'strategy-call-popup',
          pageSource: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });
      if (!res.ok) throw new Error('failed');
      setDone(true);
      setForm(EMPTY);
    } catch {
      toast.error('Could not submit. Please try again or WhatsApp us.');
    } finally { setSending(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent data-testid="book-call-dialog" className="max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-lg overflow-y-auto rounded-2xl sm:w-full">
        {done ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary"><PartyPopper className="h-7 w-7" /></span>
            <h3 className="mt-4 font-display text-2xl font-semibold">Request received 🎉</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">Our strategy team will call or email you within one business day with a tailored plan.</p>
            <Button className="mt-6 rounded-full" onClick={() => setOpen(false)} data-testid="book-call-close">Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display text-xl">
                <CalendarCheck className="h-5 w-5 text-primary" /> Book your free strategy call
              </DialogTitle>
              <DialogDescription>Tell us a little about the project — we reply within one business day.</DialogDescription>
            </DialogHeader>

            <form onSubmit={submit} className="mt-2 space-y-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="bc-name">Full name *</Label>
                  <Input id="bc-name" data-testid="bc-name" value={form.name} onChange={set('name')} className="mt-1.5" placeholder="Priya Sharma" />
                </div>
                <div>
                  <Label htmlFor="bc-company">Company name</Label>
                  <Input id="bc-company" data-testid="bc-company" value={form.company} onChange={set('company')} className="mt-1.5" placeholder="Acme Inc." />
                </div>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="bc-email">Email *</Label>
                  <Input id="bc-email" data-testid="bc-email" type="email" value={form.email} onChange={set('email')} className="mt-1.5" placeholder="priya@acme.com" />
                </div>
                <div>
                  <Label htmlFor="bc-phone">Phone / WhatsApp</Label>
                  <Input id="bc-phone" data-testid="bc-phone" value={form.phone} onChange={set('phone')} className="mt-1.5" placeholder="+91 …" />
                </div>
              </div>

              <div>
                <Label>What do you need?</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      data-testid={`bc-type-${t.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                      onClick={() => setForm((f) => ({ ...f, projectType: t }))}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${form.projectType === t ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {form.projectType === 'Website' && (
                <div>
                  <Label htmlFor="bc-pages">Number of pages</Label>
                  <Input id="bc-pages" data-testid="bc-pages" value={form.pages} onChange={set('pages')} className="mt-1.5" placeholder="e.g. 8 pages + blog" />
                </div>
              )}
              {form.projectType === 'Mobile App' && (
                <div>
                  <Label htmlFor="bc-apptype">What kind of app?</Label>
                  <Input id="bc-apptype" data-testid="bc-apptype" value={form.appType} onChange={set('appType')} className="mt-1.5" placeholder="e.g. delivery app for iOS + Android" />
                </div>
              )}

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="bc-budget">Budget</Label>
                  <Input id="bc-budget" data-testid="bc-budget" value={form.budget} onChange={set('budget')} className="mt-1.5" placeholder="Your budget" />
                </div>
                <div>
                  <Label htmlFor="bc-timeline">Timeline</Label>
                  <Input id="bc-timeline" data-testid="bc-timeline" value={form.timeline} onChange={set('timeline')} className="mt-1.5" placeholder="e.g. within 2 months" />
                </div>
              </div>

              <div>
                <Label htmlFor="bc-message">Project details</Label>
                <Textarea id="bc-message" data-testid="bc-message" rows={3} value={form.message} onChange={set('message')} className="mt-1.5" placeholder="Goals, features, references…" />
              </div>

              <Button type="submit" data-testid="bc-submit" disabled={sending} className="w-full rounded-full glow-brand">
                {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} Request my strategy call
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default BookCallDialog;

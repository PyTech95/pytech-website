'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { MapPin, Briefcase, Clock, ArrowRight, Upload, Loader2, CheckCircle2, PartyPopper, Rocket } from 'lucide-react';
import { JOBS, JOB_DEPARTMENTS, COMPANY } from '@/lib/data';
import { Icon } from '@/components/site/icon';
import { Reveal } from '@/components/site/reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const PERKS = [
  { t: 'Senior-led teams', d: 'Learn from people who ship real products for real clients.' },
  { t: 'Remote-friendly', d: 'Hybrid from Gurugram or fully remote for most roles.' },
  { t: 'Real ownership', d: 'Own outcomes, not tickets — from day one.' },
  { t: 'Growth budget', d: 'Courses, certifications and conference support.' },
];

function ApplyForm({ job, onDone }) {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({ name: '', email: '', phone: '', experience: '', company: '', portfolio: '', coverLetter: '' });
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (!values.name.trim() || !values.email.trim()) { toast.error('Please add your name and email.'); return; }
    if (file && file.size > 10 * 1024 * 1024) { toast.error('Resume must be under 10MB.'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('role', job.title);
      fd.append('roleSlug', job.slug);
      Object.entries(values).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('resume', file);
      const res = await fetch('/api/careers/apply', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('failed');
      onDone();
    } catch (err) {
      toast.error('Could not submit. Please try again or email us.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" data-testid="apply-form">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="af-name">Full name *</Label><Input id="af-name" data-testid="apply-name" value={values.name} onChange={set('name')} className="mt-1.5" placeholder="Your name" /></div>
        <div><Label htmlFor="af-email">Email *</Label><Input id="af-email" type="email" data-testid="apply-email" value={values.email} onChange={set('email')} className="mt-1.5" placeholder="you@email.com" /></div>
        <div><Label htmlFor="af-phone">Phone</Label><Input id="af-phone" data-testid="apply-phone" value={values.phone} onChange={set('phone')} className="mt-1.5" placeholder="+91 …" /></div>
        <div><Label htmlFor="af-exp">Experience</Label><Input id="af-exp" data-testid="apply-experience" value={values.experience} onChange={set('experience')} className="mt-1.5" placeholder="e.g. 3 years" /></div>
        <div><Label htmlFor="af-company">Current company</Label><Input id="af-company" value={values.company} onChange={set('company')} className="mt-1.5" placeholder="Optional" /></div>
        <div><Label htmlFor="af-portfolio">LinkedIn / Portfolio</Label><Input id="af-portfolio" value={values.portfolio} onChange={set('portfolio')} className="mt-1.5" placeholder="https://…" /></div>
      </div>
      <div>
        <Label htmlFor="af-cover">Why you? (short note)</Label>
        <Textarea id="af-cover" data-testid="apply-cover" value={values.coverLetter} onChange={set('coverLetter')} className="mt-1.5" rows={3} placeholder="Tell us what makes you a great fit…" />
      </div>
      <div>
        <Label>Resume (PDF / DOC, max 10MB)</Label>
        <label htmlFor="af-resume" className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-background/50 px-4 py-3 text-sm transition-colors hover:border-primary/50">
          <Upload className="h-4 w-4 text-primary" />
          <span className={file ? 'text-foreground' : 'text-muted-foreground'}>{file ? file.name : 'Click to upload your resume'}</span>
          <input id="af-resume" data-testid="apply-resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
      </div>
      <Button type="submit" data-testid="apply-submit" disabled={submitting} className="w-full rounded-full glow-brand">
        {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</> : <>Submit application <ArrowRight className="ml-1 h-4 w-4" /></>}
      </Button>
    </form>
  );
}

export function CareersClient() {
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const open = (job) => { setDone(false); setSelected(job); };
  const close = () => { setSelected(null); setDone(false); };

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[640px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]" style={{ background: 'radial-gradient(circle, hsl(var(--brand)), transparent 60%)' }} />
        <div className="container relative mx-auto px-6 pb-10 text-center">
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
            <Rocket className="h-3.5 w-3.5" /> We&apos;re hiring
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Build the future of <span className="text-gradient">digital</span> with us.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Join a senior team shipping software, brands, growth and AI automation for clients across India and the world.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5"><MapPin className="h-3.5 w-3.5" /> {COMPANY.hq}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5"><Briefcase className="h-3.5 w-3.5" /> {JOBS.length} open roles</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5"><Clock className="h-3.5 w-3.5" /> Full-time</span>
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card/50 p-5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <p className="mt-3 font-display font-semibold">{p.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Roles by department */}
      <section id="roles" className="container mx-auto scroll-mt-24 px-6 py-12 md:py-16">
        {JOB_DEPARTMENTS.filter((d) => JOBS.some((j) => j.department === d)).map((dept) => (
          <div key={dept} className="mb-12">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight">{dept}</h2>
            </Reveal>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {JOBS.filter((j) => j.department === dept).map((job, i) => (
                <Reveal key={job.slug} delay={i * 0.05}>
                  <div className="group flex h-full flex-col rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-primary/40 hover:shadow-2xl">
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-border bg-background text-primary"><Icon name={job.icon} className="h-5 w-5" /></span>
                      <div>
                        <h3 className="font-display text-lg font-semibold leading-snug">{job.title}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{job.experience} · {job.type}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{job.blurb}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {job.location}</span>
                    </div>
                    <div className="mt-auto pt-5">
                      <Button data-testid={`apply-btn-${job.slug}`} onClick={() => open(job)} variant="outline" className="w-full rounded-full group-hover:border-primary/50">
                        View & apply <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
        <Reveal>
          <div className="rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center">
            <p className="font-display text-lg font-semibold">Don&apos;t see your role?</p>
            <p className="mt-1 text-sm text-muted-foreground">We&apos;re always keen to meet great people. Send us a general application.</p>
            <Button onClick={() => open({ title: 'General application', slug: 'general' })} className="mt-4 rounded-full glow-brand">Apply anyway <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </div>
        </Reveal>
      </section>

      {/* Apply dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" data-testid="apply-dialog">
          {done ? (
            <div className="py-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary"><PartyPopper className="h-7 w-7" /></span>
              <h3 className="mt-4 font-display text-2xl font-bold">Application received! 🎉</h3>
              <p className="mx-auto mt-2 max-w-sm text-muted-foreground">Thanks for applying for <span className="font-medium text-foreground">{selected?.title}</span>. Our team will review it and reach out if there&apos;s a fit.</p>
              <Button onClick={close} className="mt-6 rounded-full">Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Apply — {selected?.title}</DialogTitle>
                <DialogDescription>Fill in your details and attach your resume. We&apos;ll get back within a few days.</DialogDescription>
              </DialogHeader>
              {selected && <ApplyForm job={selected} onDone={() => setDone(true)} />}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CareersClient;

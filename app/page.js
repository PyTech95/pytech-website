'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Sparkles, Zap, Cpu, ShieldCheck } from 'lucide-react';
import { PILLARS, SERVICES, CASE_STUDIES, getServicesByPillar } from '@/lib/data';
import { Icon } from '@/components/site/icon';
import { Reveal } from '@/components/site/reveal';
import { Magnetic } from '@/components/site/magnetic';
import { Hero3D } from '@/components/site/hero-3d';
import { ClientTicker } from '@/components/site/client-ticker';
import { RoiCalculator } from '@/components/site/roi-calculator';
import { LeadForm } from '@/components/site/lead-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CASE_IMG = {
  'fintech-trading-platform': 'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHw0fHxtb2JpbGUlMjBhcHB8ZW58MHx8fGJsYWNrfDE3ODc0Mjg5ODJ8MA&ixlib=rb-4.1.0&q=85',
  'd2c-whatsapp-automation': 'https://images.unsplash.com/photo-1532186773960-85649e5cb70b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxhdXRvbWF0aW9ufGVufDB8fHxibGFja3wxNzg3NDI4OTcxfDA&ixlib=rb-4.1.0&q=85',
  'saas-geo-seo-growth': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MHx8fGJsYWNrfDE3ODc0Mjg5NzF8MA&ixlib=rb-4.1.0&q=85',
};

const STATS = [
  { v: '120+', l: 'Projects shipped' },
  { v: '4.2x', l: 'Avg. client ROAS' },
  { v: '0.8s', l: 'Median LCP' },
  { v: '11+', l: 'Cities served' },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]" style={{ background: 'radial-gradient(circle, hsl(var(--brand)), transparent 60%)' }} />

        <div className="container relative mx-auto grid items-center gap-10 px-6 pb-16 lg:grid-cols-2">
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge variant="outline" className="mb-5 gap-1.5 rounded-full border-primary/30 bg-primary/5 py-1.5 pl-2 pr-3 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" /> AI-first digital growth studio
              </Badge>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }} className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              We <span className="text-gradient">Build</span>, <span className="text-gradient">Brand</span>,<br className="hidden sm:block" /> <span className="text-gradient">Market</span> &amp; <span className="text-gradient">Automate</span><br /> ambitious businesses.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="mt-5 max-w-xl text-lg text-muted-foreground">
              PyTech Digital is a full-stack IT &amp; growth firm from Gurugram — engineering software, crafting premium brands and deploying AI automation that compounds revenue.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }} className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button asChild size="lg" className="rounded-full glow-brand">
                  <Link href="/#contact">Book a Strategy Call <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </Magnetic>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/case-studies">See our work</Link>
              </Button>
            </motion.div>

            <div className="mt-12 grid max-w-lg grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <motion.div key={s.l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08 }}>
                  <p className="font-display text-2xl font-bold text-foreground md:text-3xl">{s.v}</p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative"><Hero3D /></div>
        </div>

        {/* client ticker */}
        <div className="border-y border-border/50 bg-card/30 py-6">
          <p className="container mx-auto mb-4 px-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground/70">Trusted by fast-scaling brands</p>
          <ClientTicker />
        </div>
      </section>

      {/* ===== PILLARS ===== */}
      <section id="services" className="container mx-auto scroll-mt-24 px-6 py-20 md:py-28">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">The framework</p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight md:text-4xl">Four pillars. One accountable growth partner.</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">From first line of code to the last conversion, we own the full stack of your growth.</p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {PILLARS.map((p, i) => (
            <Reveal key={p.key} delay={i * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-primary/40 hover:shadow-2xl">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-40" style={{ background: p.accent }} />
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-background" style={{ color: p.accent }}>
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold" style={{ color: p.accent }}>{p.label}</h3>
                    <p className="text-sm text-muted-foreground">{p.blurb}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {getServicesByPillar(p.key).map((s) => (
                    <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-2 rounded-lg border border-transparent bg-background/40 px-3 py-2 text-sm text-muted-foreground transition-all hover:border-border hover:text-foreground">
                      <Icon name={s.icon} className="h-4 w-4 opacity-70" />
                      <span className="truncate">{s.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section className="container mx-auto px-6 py-8 md:py-16">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Proof</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Outcomes, not vanity metrics.</h2>
            </div>
            <Link href="/case-studies" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex">All case studies <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {CASE_STUDIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08}>
              <Link href={`/case-studies/${c.slug}`} className="group block overflow-hidden rounded-2xl border border-border bg-card/50 transition-all hover:border-primary/40 hover:shadow-2xl">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={CASE_IMG[c.slug]} alt={c.title} loading="lazy" className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <Badge className="absolute left-3 top-3 rounded-full bg-background/70 text-foreground backdrop-blur">{c.industry}</Badge>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold leading-snug">{c.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.excerpt}</p>
                  <div className="mt-4 flex gap-4">
                    {c.outcomes.slice(0, 2).map((o) => (
                      <div key={o.label}><p className="font-display text-xl font-bold text-primary">{o.value}</p><p className="text-xs text-muted-foreground">{o.label}</p></div>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== GEO / KNOWLEDGE BLOCK ===== */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid gap-8 rounded-3xl border border-border bg-card/50 p-8 md:grid-cols-2 md:p-12">
          <Reveal>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Built for the AI era</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Get found by Google <span className="text-gradient">and</span> by ChatGPT.</h2>
            <p className="mt-4 text-muted-foreground">Our Generative Engine Optimization (GEO) practice structures your content with semantic HTML, Schema.org markup and LLM-readable knowledge blocks — so answer engines like ChatGPT, Gemini and Perplexity cite <em>you</em> as the source.</p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {[{ icon: Zap, t: 'Sub-second LCP', d: 'Next.js image optimization & lazy loading.' }, { icon: Cpu, t: 'Programmatic SEO', d: 'Thousands of localized pages at scale.' }, { icon: Sparkles, t: 'GEO knowledge blocks', d: 'Structured for LLM scrapers.' }, { icon: ShieldCheck, t: 'WCAG accessible', d: 'Semantic, inclusive by default.' }].map((f, i) => (
              <Reveal key={f.t} delay={i * 0.07}>
                <div className="h-full rounded-xl border border-border bg-background/50 p-4">
                  <f.icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-display font-semibold">{f.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROI CALCULATOR ===== */}
      <section className="container mx-auto px-6 py-8 md:py-12">
        <Reveal>
          <div className="mb-8 text-center">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Interactive ROI calculator</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">See what growth could be worth.</h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}><RoiCalculator /></Reveal>
      </section>

      {/* ===== CONTACT / LEAD FORM ===== */}
      <section id="contact" className="container mx-auto scroll-mt-24 px-6 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Let&apos;s build</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-5xl">Book your free strategy call.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">Tell us about your project and our team will craft a tailored plan across Build, Brand, Market &amp; Automate — usually within one business day.</p>
            <ul className="mt-8 space-y-3">
              {['Dedicated senior team — no juniors learning on your dime', 'Transparent, fixed-scope packages', 'Measurable outcomes, reported weekly'].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-primary/15 text-primary"><ArrowRight className="h-3 w-3" /></span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}><LeadForm /></Reveal>
        </div>
      </section>
    </div>
  );
}

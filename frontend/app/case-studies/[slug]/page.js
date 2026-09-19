import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Quote } from 'lucide-react';
import { COMPANY } from '@/lib/data';
import { getContent, listContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/seo';
import { cleanHtml } from '@/lib/content-validation';
export const dynamic = 'force-dynamic';
import { Reveal } from '@/components/site/reveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const IMG = {
  'fintech-trading-platform': 'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHw0fHxtb2JpbGUlMjBhcHB8ZW58MHx8fGJsYWNrfDE3ODc0Mjg5ODJ8MA&ixlib=rb-4.1.0&q=85',
  'd2c-whatsapp-automation': 'https://images.unsplash.com/photo-1716436329475-4c55d05383bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwyfHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fGJsYWNrfDE3ODc0Mjg5ODJ8MA&ixlib=rb-4.1.0&q=85',
  'saas-geo-seo-growth': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MHx8fGJsYWNrfDE3ODc0Mjg5NzF8MA&ixlib=rb-4.1.0&q=85',
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = await getContent('cases', slug);
  if (!c) return { title: 'Case study not found' };
  const title = c.seoTitle || c.title, description = c.seoDescription || c.excerpt;
  return pageMetadata(`/case-studies/${slug}`, { title, description, keywords: c.keywords, alternates: { canonical: `${COMPANY.url}/case-studies/${slug}` }, openGraph: { title, description, type: 'article', ...(c.image ? { images: [c.image] } : {}) } });
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const c = await getContent('cases', slug);
  if (!c) notFound();
  const others = (await listContent('cases')).filter((x) => x.slug !== slug).slice(0, 2);

  return (
    <article className="relative [overflow-wrap:anywhere]">
      <section className="relative overflow-hidden pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="container relative mx-auto px-6 pb-8">
          <nav className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link><span>/</span>
            <Link href="/case-studies" className="hover:text-foreground">Case Studies</Link><span>/</span>
            <span className="text-foreground">{c.client}</span>
          </nav>
          <Badge variant="outline" className="mb-4 rounded-full border-primary/30 bg-primary/5 text-primary">{c.industry}</Badge>
          <h1 data-testid="case-title" className="max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl">{c.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{c.excerpt}</p>
        </div>
      </section>

      {(c.image || IMG[c.slug]) && <section className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <img data-testid="case-cover" src={c.image || IMG[c.slug]} alt={c.imageAlt || c.title} className="aspect-[16/7] w-full object-contain" />
        </div>
      </section>}

      {/* Outcomes dashboard */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.outcomes.map((o, i) => (
            <Reveal key={o.label} delay={i * 0.06}>
              <div className="rounded-2xl border border-border bg-card/50 p-6 text-center">
                <p className="font-display text-4xl font-bold text-gradient">{o.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{o.label}</p>
                {o.delta && <p className="mt-1 text-xs font-medium text-primary">{o.delta}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Challenge / Solution / Stack */}
      <section className="container mx-auto grid gap-10 px-6 py-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <Reveal>
            <h2 className="font-display text-2xl font-bold">The Challenge</h2>
            <p data-testid="case-challenge" className="mt-3 whitespace-pre-wrap text-muted-foreground">{c.challenge}</p>
          </Reveal>
          <Reveal>
            <h2 className="font-display text-2xl font-bold">The Solution</h2>
            <p data-testid="case-solution" className="mt-3 whitespace-pre-wrap text-muted-foreground">{c.solution}</p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-border bg-card/50 p-6">
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">The Tech Stack</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {c.techStack.map((t) => (
                <span key={t} className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm text-foreground">{t}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {c.body && <section data-testid="case-body" className="cms-prose container mx-auto max-w-4xl px-6 py-10" dangerouslySetInnerHTML={{ __html: cleanHtml(c.body) }} />}
      {/* CTA + others */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-border bg-card/50 p-8 text-center md:flex-row md:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Want results like {c.client}?</h2>
            <p className="mt-2 text-muted-foreground">Let&apos;s map your growth in a free strategy call.</p>
          </div>
          <Button asChild size="lg" className="rounded-full glow-brand"><Link href="/#contact">Book a Strategy Call <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {others.map((o) => (
            <Link key={o.slug} href={`/case-studies/${o.slug}`} className="group flex items-center justify-between rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-primary/40">
              <div>
                <Badge className="mb-2 rounded-full">{o.industry}</Badge>
                <p className="font-display font-semibold">{o.title}</p>
              </div>
              <ArrowRight className="h-5 w-5 flex-none text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}

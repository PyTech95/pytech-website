import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CASE_STUDIES } from '@/lib/data';
import { Reveal } from '@/components/site/reveal';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Case Studies — Measurable Growth Outcomes',
  description: 'Deep-dive case studies from PyTech Digital — fintech platforms, WhatsApp automation and GEO/SEO growth with measurable results.',
};

const IMG = {
  'fintech-trading-platform': 'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHw0fHxtb2JpbGUlMjBhcHB8ZW58MHx8fGJsYWNrfDE3ODc0Mjg5ODJ8MA&ixlib=rb-4.1.0&q=85',
  'd2c-whatsapp-automation': 'https://images.unsplash.com/photo-1532186773960-85649e5cb70b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxhdXRvbWF0aW9ufGVufDB8fHxibGFja3wxNzg3NDI4OTcxfDA&ixlib=rb-4.1.0&q=85',
  'saas-geo-seo-growth': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MHx8fGJsYWNrfDE3ODc0Mjg5NzF8MA&ixlib=rb-4.1.0&q=85',
};

export default function CaseStudiesPage() {
  return (
    <div className="container mx-auto px-6 pt-32 md:pt-40">
      <Reveal>
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Our work</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">Case studies that speak in outcomes.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Real engagements, real numbers. Here&apos;s how we turned ambitious goals into measurable growth.</p>
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {CASE_STUDIES.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.08}>
            <Link href={`/case-studies/${c.slug}`} className="group block overflow-hidden rounded-2xl border border-border bg-card/50 transition-all hover:border-primary/40 hover:shadow-2xl">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={IMG[c.slug]} alt={c.title} loading="lazy" className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <Badge className="absolute left-3 top-3 rounded-full bg-background/70 text-foreground backdrop-blur">{c.industry}</Badge>
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg font-semibold leading-snug">{c.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Read case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

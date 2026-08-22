import Link from 'next/link';
import { GraduationCap, BookOpen, Clock, Plus, ArrowRight } from 'lucide-react';
import { PILLARS, getResourcesByPillar } from '@/lib/data';
import { Icon } from '@/components/site/icon';
import { Reveal } from '@/components/site/reveal';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Learning Hub — Guides, Playbooks & Resources',
  description: 'Free guides and playbooks from PyTech Digital on web engineering, branding, SEO/GEO and automation. New resources added regularly.',
  alternates: { canonical: '/resources' },
};

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-6 pt-28 md:pt-36">
      <Reveal>
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary"><GraduationCap className="h-6 w-6" /></span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">Learning Hub</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Practical guides and playbooks across everything we do. This hub grows every month — new resources and tools are on the way.</p>
      </Reveal>

      <div className="mt-10 space-y-10 pb-8">
        {PILLARS.map((p) => (
          <Reveal key={p.key}>
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card" style={{ color: p.accent }}><Icon name={p.icon} className="h-5 w-5" /></span>
                <h2 className="font-display text-xl font-bold" style={{ color: p.accent }}>{p.label}</h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getResourcesByPillar(p.key).map((r) => (
                  <Link key={r.slug} href={`/resources/${r.slug}`} className="group flex h-full flex-col rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-primary/40 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="rounded-full">{r.tag}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {r.readTime}</span>
                    </div>
                    <p className="mt-3 font-display font-semibold leading-snug">{r.title}</p>
                    <p className="mt-1.5 flex-1 text-sm text-muted-foreground line-clamp-2">{r.excerpt}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary"><BookOpen className="h-4 w-4" /> Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  </Link>
                ))}
                <div className="flex h-full flex-col items-start justify-center rounded-2xl border border-dashed border-border bg-card/30 p-5 text-muted-foreground">
                  <Plus className="h-5 w-5 text-primary" />
                  <p className="mt-2 font-display font-semibold text-foreground">More coming soon</p>
                  <p className="mt-1 text-sm">New {p.label.toLowerCase()} resources are on the way.</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

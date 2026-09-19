'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { Reveal } from '@/components/site/reveal';

export function FeaturedWork() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    let active = true;
    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => { if (active) setProjects(Array.isArray(d?.projects) ? d.projects : []); })
      .catch(() => active && setProjects([]));
    return () => { active = false; };
  }, []);

  if (!projects || projects.length === 0) return null;
  const featured = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 3);

  return (
    <section className="container mx-auto px-6 py-8 md:py-16">
      <Reveal>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Our work</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Recently shipped.</h2>
          </div>
          <Link href="/work" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex">All projects <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Reveal>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {featured.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08}>
            <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/50 transition-all hover:border-primary/40 hover:shadow-2xl">
              {p.image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                  {p.category && <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{p.category}</span>}
                </div>
                {p.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>}
                {p.deliveryTime && <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {p.deliveryTime}</p>}
                {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Visit project <ArrowUpRight className="h-4 w-4" /></a>}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default FeaturedWork;

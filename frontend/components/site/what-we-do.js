'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { DEFAULT_OFFERINGS } from '@/lib/data';
import { Icon } from '@/components/site/icon';
import { Reveal } from '@/components/site/reveal';

export function WhatWeDo() {
  const [offerings, setOfferings] = useState(DEFAULT_OFFERINGS);

  useEffect(() => {
    let active = true;
    fetch('/api/offerings')
      .then((r) => r.json())
      .then((d) => { if (active && Array.isArray(d?.offerings) && d.offerings.length) setOfferings(d.offerings); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const list = offerings.filter((o) => o.featured !== false);

  return (
    <section id="what-we-do" className="relative scroll-mt-24 border-y border-border/50 bg-card/20 py-20 md:py-28" data-testid="what-we-do-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'PyTech Digital services',
          itemListElement: list.map((o, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: { '@type': 'Service', name: o.title, description: o.blurb, serviceType: o.title, provider: { '@type': 'Organization', name: 'PyTech Digital Private Limited' } },
          })),
        }) }}
      />
      <div className="container mx-auto px-6">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">What we actually do</p>
          <h2 className="mt-2 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            We <span className="text-gradient">build apps &amp; websites</span>, engineer <span className="text-gradient">ERP software</span>, craft <span className="text-gradient">brands</span>, run <span className="text-gradient">digital marketing</span> and deploy <span className="text-gradient">AI automation</span>.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">Six things we do end-to-end — one team, one invoice, one accountable partner.</p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((o, i) => {
            const href = o.serviceSlug ? `/services/${o.serviceSlug}` : '/services';
            return (
              <Reveal key={o.slug || o.title} delay={i * 0.06}>
                <Link
                  href={href}
                  data-testid={`offering-card-${o.slug || i}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {o.image && (
                      <img src={o.image} alt={o.title} loading="lazy" className="h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-[1.07] group-hover:opacity-90" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <span className="absolute bottom-3 left-4 grid h-10 w-10 place-items-center rounded-xl border border-border bg-background/80 text-primary backdrop-blur">
                      <Icon name={o.icon} className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-semibold">{o.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{o.blurb}</p>
                    <ul className="mt-4 flex-1 space-y-1.5">
                      {(o.points || []).slice(0, 3).map((p) => (
                        <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-primary" /> {p}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center justify-end border-t border-border/60 pt-4">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">Explore <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/pricing" data-testid="what-we-do-pricing-link" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground glow-brand">
              View pricing <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/work" className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              See our work
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default WhatWeDo;

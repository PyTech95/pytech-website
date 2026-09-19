'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { DEFAULT_OFFERINGS } from '@/lib/data';
import { Icon } from '@/components/site/icon';
import { Reveal } from '@/components/site/reveal';
import { Button } from '@/components/ui/button';

const fmtInr = (n) => '\u20b9' + Number(n).toLocaleString('en-IN');
const fmtUsd = (n) => '$' + Number(n).toLocaleString('en-US');

export function PricingTable({ compact = false }) {
  const [offerings, setOfferings] = useState(DEFAULT_OFFERINGS);
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    let active = true;
    fetch('/api/offerings')
      .then((r) => r.json())
      .then((d) => { if (active && Array.isArray(d?.offerings) && d.offerings.length) setOfferings(d.offerings); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const list = compact ? offerings.slice(0, 3) : offerings;

  return (
    <div data-testid="pricing-table">
      <div className="mb-8 inline-flex rounded-full border border-border bg-card/60 p-1" role="group" aria-label="Currency">
        {['INR', 'USD'].map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            data-testid={`currency-${c.toLowerCase()}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${currency === c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {c === 'INR' ? '₹ INR' : '$ USD'}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((o, i) => {
          const price = currency === 'INR' ? o.priceInr : o.priceUsd;
          return (
            <Reveal key={o.slug || o.title} delay={i * 0.06}>
              <div data-testid={`price-card-${o.slug || i}`} className="flex h-full flex-col rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-primary/40 hover:shadow-xl">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-background text-primary">
                  <Icon name={o.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{o.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{o.blurb}</p>
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Starting from</p>
                  {price ? (
                    <p className="font-display text-3xl font-bold" data-testid={`price-value-${o.slug || i}`}>
                      {currency === 'INR' ? fmtInr(price) : fmtUsd(price)}
                      <span className="text-sm font-normal text-muted-foreground">{o.priceUnit === 'month' ? '/month' : ' / project'}</span>
                    </p>
                  ) : (
                    <p className="font-display text-3xl font-bold">Custom</p>
                  )}
                  {o.priceNote && <p className="mt-1 text-xs text-muted-foreground">{o.priceNote}</p>}
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {(o.points || []).map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-primary/15 text-primary"><Check className="h-3 w-3" /></span>
                      <span className="text-muted-foreground">{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-2">
                  <Button asChild className="flex-1 rounded-full"><Link href="/#contact">Get a quote <ArrowUpRight className="ml-1 h-4 w-4" /></Link></Button>
                  {o.serviceSlug && (
                    <Button asChild variant="outline" className="rounded-full"><Link href={`/services/${o.serviceSlug}`}>Details</Link></Button>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {compact && (
        <div className="mt-8">
          <Link href="/pricing" data-testid="pricing-see-all" className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            See full pricing <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default PricingTable;

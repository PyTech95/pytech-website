import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PILLARS, getServicesByPillar } from '@/lib/data';
import { listContent } from '@/lib/cms';
import { Icon } from '@/components/site/icon';
import { Reveal } from '@/components/site/reveal';

import { pageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export async function generateMetadata() { return pageMetadata('/services', BASE_METADATA); }

const BASE_METADATA = {
  title: 'Services — Build, Brand, Market & Automate',
  description: 'Explore PyTech Digital services across four pillars: BUILD (web, mobile, software), BRAND (identity, 3D, UI/UX), MARKET (SEO, AI SEO, GEO) and AUTOMATE (WhatsApp, SMS, voice, workflow AI).',
  alternates: { canonical: '/services' },
};

export default async function ServicesIndexPage() {
  const services = await listContent('services');
  return (
    <div className="container mx-auto px-6 pt-28 md:pt-36">
      <Reveal>
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Services</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">Everything you need to grow — under one roof.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Four pillars, one accountable partner. Engineering, design, growth and automation for your next chapter.</p>
      </Reveal>

      <div className="mt-10 space-y-10 pb-8">
        {PILLARS.map((p) => (
          <Reveal key={p.key}>
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card" style={{ color: p.accent }}><Icon name={p.icon} className="h-5 w-5" /></span>
                <div>
                  <h2 className="font-display text-xl font-bold" style={{ color: p.accent }}>{p.label}</h2>
                  <p className="text-sm text-muted-foreground">{p.blurb}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {services.filter((s) => s.pillar === p.key).map((s) => (
                  <Link key={s.slug} data-testid={`service-card-${s.slug}`} href={`/services/${s.slug}`} className="group flex h-full min-w-0 flex-col break-words rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-primary/40 hover:shadow-xl">
                    <Icon name={s.icon} className="h-6 w-6 text-primary" />
                    <p className="mt-3 font-display font-semibold">{s.name}</p>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground">{s.tagline}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { LOCATION_GROUPS, getLocationsByGroup, LOCATIONS, COMPANY } from '@/lib/data';
import { Reveal } from '@/components/site/reveal';

export const metadata = {
  title: 'Areas We Serve — Worldwide IT & Digital Services',
  description: 'PyTech Digital serves clients across Delhi NCR, India and worldwide — web & app development, branding, SEO/GEO and AI automation. Find your city.',
  alternates: { canonical: '/locations' },
};

export default function LocationsIndexPage() {
  return (
    <div className="container mx-auto px-6 pt-28 md:pt-36">
      <Reveal>
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Locations</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">Areas we serve — worldwide.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">From our Gurugram HQ across Delhi NCR, India and {LOCATIONS.length}+ cities globally. Pick your location for local IT, design, marketing and automation.</p>
      </Reveal>

      <div className="mt-10 space-y-10 pb-8">
        {LOCATION_GROUPS.map((g) => {
          const items = getLocationsByGroup(g);
          if (!items.length) return null;
          return (
            <Reveal key={g}>
              <div>
                <h2 className="font-display text-xl font-bold">{g}</h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {items.map((l) => (
                    <Link key={l.slug} href={`/locations/${l.slug}`} className="group flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3.5 py-2.5 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground">
                      <MapPin className="h-3.5 w-3.5 flex-none text-primary" />
                      <span className="truncate">{l.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

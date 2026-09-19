'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Plus } from 'lucide-react';
import { LOCATIONS } from '@/lib/data';

const INITIAL = 15;
const STEP = 30;

export function ServiceCities({ slug }) {
  const [count, setCount] = useState(INITIAL);
  const shown = LOCATIONS.slice(0, count);
  const remaining = LOCATIONS.length - count;

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-1.5">
        {shown.map((l) => (
          <Link
            key={l.slug}
            href={`/services/${slug}/${l.slug}`}
            className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/40 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <MapPin className="h-3 w-3 opacity-60" /> {l.name}
          </Link>
        ))}
      </div>
      {remaining > 0 && (
        <button
          onClick={() => setCount((c) => c + STEP)}
          data-testid="cities-load-more"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Load more locations ({remaining})
        </button>
      )}
    </div>
  );
}

export default ServiceCities;

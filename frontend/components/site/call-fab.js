'use client';

import { Phone } from 'lucide-react';
import { COMPANY } from '@/lib/data';

export function CallFab() {
  return (
    <a
      href={`tel:${COMPANY.phone.replace(/\s+/g, '')}`}
      aria-label={`Call ${COMPANY.name}`}
      data-testid="call-fab"
      className="group fixed bottom-24 right-6 z-40 flex flex-row-reverse items-center gap-2"
    >
      <span className="grid h-14 w-14 place-items-center rounded-full border border-border bg-background/90 text-primary shadow-xl backdrop-blur transition-transform hover:scale-105">
        <Phone className="h-6 w-6" />
      </span>
      <span className="glass hidden whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium shadow-lg group-hover:block">Call us</span>
    </a>
  );
}

export default CallFab;

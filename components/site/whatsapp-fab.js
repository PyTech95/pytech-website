'use client';

import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/data';

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink('Hi PyTech Digital! I found you online and want to discuss a project.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 left-6 z-40 flex items-center gap-2"
    >
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] shadow-xl transition-transform hover:scale-105">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]" />
        <MessageCircle className="relative h-7 w-7 text-white" fill="white" />
      </span>
      <span className="glass hidden rounded-full px-3 py-1.5 text-sm font-medium shadow-lg group-hover:block">WhatsApp Us</span>
    </a>
  );
}

export default WhatsAppFab;

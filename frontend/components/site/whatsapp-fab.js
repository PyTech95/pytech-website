'use client';

import { whatsappLink, COMPANY } from '@/lib/data';

function WhatsAppGlyph({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.55 4.11 1.52 5.85L4 29l8.3-1.47a12.1 12.1 0 0 0 3.74.6C22.68 28.13 28 22.73 28 16.09 28 9.45 22.68 4.05 16.04 4.05v-1.05Zm0 2.1c5.48 0 9.94 4.46 9.94 9.94s-4.46 9.94-9.94 9.94a10 10 0 0 1-3.4-.59l-.5-.18-4.86.86.87-4.7-.22-.5a9.86 9.86 0 0 1-1.34-4.98c0-5.48 4.46-9.94 9.45-9.94Zm-4.6 4.72c-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 2.99s1.29 3.46 1.47 3.7c.18.24 2.5 3.99 6.14 5.43 3.03 1.2 3.65.96 4.31.9.66-.06 2.13-.87 2.43-1.71.3-.84.3-1.56.21-1.71-.09-.15-.33-.24-.69-.42-.36-.18-2.13-1.05-2.46-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.2-1.14 1.44-.21.24-.42.27-.78.09-.36-.18-1.53-.56-2.91-1.79-1.08-.96-1.8-2.15-2.01-2.51-.21-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.81-1.95-1.11-2.66-.29-.7-.58-.71-.81-.72h-.55Z" />
    </svg>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink('Hi PyTech Digital! I found you online and want to discuss a project.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-testid="whatsapp-fab"
      className="group fixed bottom-6 left-6 z-40 flex items-center gap-2"
    >
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] shadow-xl transition-transform hover:scale-105">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]" />
        <WhatsAppGlyph className="relative h-8 w-8 text-white" />
      </span>
      <span className="glass hidden rounded-full px-3 py-1.5 text-sm font-medium shadow-lg group-hover:block">WhatsApp Us</span>
    </a>
  );
}

export default WhatsAppFab;

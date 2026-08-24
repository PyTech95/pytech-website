import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { COMPANY, PILLARS, getServicesByPillar } from '@/lib/data';

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/60 bg-card/40">
      <div className="container mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src="/pt-logo.png" alt="PyTech Digital" className="h-9 w-9 rounded-lg object-cover ring-1 ring-border" />
              <span className="font-display text-lg font-semibold">PyTech Digital</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{COMPANY.description}</p>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 flex-none text-primary" /> {COMPANY.address}</p>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 hover:text-foreground"><Mail className="h-4 w-4 text-primary" /> {COMPANY.email}</a>
              <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-2 hover:text-foreground"><Phone className="h-4 w-4 text-primary" /> {COMPANY.phone}</a>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href="/services" className="text-muted-foreground transition-colors hover:text-foreground">Services</Link>
              <Link href="/resources" className="text-muted-foreground transition-colors hover:text-foreground">Learning Hub</Link>
              <Link href="/support" className="text-muted-foreground transition-colors hover:text-foreground">Support</Link>
              <Link href="/locations" className="text-muted-foreground transition-colors hover:text-foreground">Locations</Link>
              <Link href="/case-studies" className="text-muted-foreground transition-colors hover:text-foreground">Case Studies</Link>
            </div>
          </div>
          {PILLARS.map((p) => (
            <div key={p.key}>
              <p className="font-display text-sm font-semibold" style={{ color: p.accent }}>{p.label}</p>
              <ul className="mt-3 space-y-2">
                {getServicesByPillar(p.key).map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{s.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.</p>
          <p>Noida · Gurugram · Global — Build. Brand. Market. Automate.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

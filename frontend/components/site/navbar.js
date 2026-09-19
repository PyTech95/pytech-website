'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, ArrowUpRight } from 'lucide-react';
import { PILLARS, getServicesByPillar } from '@/lib/data';
import { Icon } from '@/components/site/icon';
import { Magnetic } from '@/components/site/magnetic';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { useServices } from './content-provider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

function Logo() {
  return (
    <Link href="/" data-testid="navbar-logo-link" aria-label="PyTech Digital home" className="flex shrink-0 items-center">
      <img src="/pt-logo.png" data-testid="navbar-logo-image" alt="PyTech Digital" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const services = useServices();
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div className="glass container mx-auto flex h-20 items-center justify-between rounded-2xl px-4 shadow-lg sm:h-24" style={{ background: 'hsl(var(--card) / 0.28)' }}>
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 2xl:flex">
          <div className="group relative">
            <button data-testid="nav-services-menu" className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Services <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full w-[720px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="glass grid max-h-[65vh] grid-cols-2 gap-2 overflow-y-auto rounded-2xl p-3 shadow-2xl">
                {PILLARS.map((p) => (
                  <div key={p.key} className="rounded-xl p-2">
                    <p className="mb-1 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-widest" style={{ color: p.accent }}>
                      <Icon name={p.icon} className="h-3.5 w-3.5" /> {p.label}
                    </p>
                    {services.filter((s) => s.pillar === p.key).map((s) => (
                      <Link
                        key={s.slug}
                        data-testid={`nav-service-${s.slug}`}
                        href={`/services/${s.slug}`}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Icon name={s.icon} className="h-4 w-4 opacity-70" />
                        {s.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Link href="/case-studies" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Case Studies</Link>
          <Link href="/locations" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Locations</Link>
          <Link href="/ai-automation" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">AI Automation</Link>
          <Link href="/work" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Work</Link>
          <Link href="/pricing" data-testid="nav-pricing" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
          <Link href="/careers" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Careers</Link>
          <Link href="/blog" data-testid="nav-blog" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Blog / News</Link>
          <Link href="/support" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Support</Link>
          <Link href="/#contact" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Magnetic className="hidden sm:block">
            <Button asChild className="rounded-full font-medium glow-brand">
              <Link href="/#contact">Book Strategy Call <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </Magnetic>

          {/* Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="mobile-menu-open" className="2xl:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] overflow-y-auto">
              <SheetHeader><SheetTitle className="font-display text-left">Menu</SheetTitle></SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {PILLARS.map((p) => (
                  <div key={p.key} className="mb-2">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: p.accent }}>{p.label}</p>
                    {services.filter((s) => s.pillar === p.key).map((s) => (
                      <Link key={s.slug} data-testid={`mobile-service-${s.slug}`} href={`/services/${s.slug}`} onClick={() => setOpen(false)} className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground">{s.name}</Link>
                    ))}
                  </div>
                ))}
                <Link href="/case-studies" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 font-medium">Case Studies</Link>
                <Link href="/ai-automation" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 font-medium">AI Automation</Link>
                <Link href="/work" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 font-medium">Work</Link>
                <Link href="/pricing" onClick={() => setOpen(false)} data-testid="mobile-nav-pricing" className="rounded-md px-2 py-2 font-medium">Pricing</Link>
                <Link href="/careers" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 font-medium">Careers</Link>
                <Link href="/services" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 font-medium">All Services</Link>
                <Link href="/locations" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 font-medium">Locations</Link>
                <Link href="/blog" data-testid="mobile-nav-blog" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 font-medium">Blog / News</Link>
                <Link href="/support" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 font-medium">Support</Link>
                <Button asChild className="mt-3 rounded-full"><Link href="/#contact" onClick={() => setOpen(false)}>Book Strategy Call</Link></Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

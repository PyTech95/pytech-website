import Link from 'next/link';
import { LifeBuoy, GraduationCap, Plus, ArrowRight } from 'lucide-react';

// Reusable band on every service page: Support + Learning Hub + future add-on slot.
export function ServiceExtras() {
  const items = [
    { icon: LifeBuoy, t: 'Support Center', d: 'Get help fast from our team via WhatsApp, email or a ticket.', href: '/support', cta: 'Visit Support' },
    { icon: GraduationCap, t: 'Learning Hub', d: 'Guides, playbooks and resources to go deeper on this service.', href: '/resources', cta: 'Explore resources' },
    { icon: Plus, t: 'More coming soon', d: 'We are continually adding tools and add-ons for this service.', href: null, cta: 'Add-ons on the way' },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => {
        const inner = (
          <div className={`group flex h-full flex-col rounded-2xl border border-border bg-card/50 p-5 transition-all ${it.href ? 'hover:border-primary/40 hover:shadow-xl' : 'border-dashed opacity-90'}`}>
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-primary"><it.icon className="h-5 w-5" /></span>
            <p className="mt-3 font-display font-semibold">{it.t}</p>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{it.d}</p>
            <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${it.href ? 'text-primary' : 'text-muted-foreground'}`}>
              {it.cta} {it.href && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </span>
          </div>
        );
        return it.href ? <Link key={it.t} href={it.href}>{inner}</Link> : <div key={it.t}>{inner}</div>;
      })}
    </div>
  );
}

export default ServiceExtras;

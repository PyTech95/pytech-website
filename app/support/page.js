import Link from 'next/link';
import { LifeBuoy, MessageCircle, Mail, Phone, CalendarClock, ArrowRight } from 'lucide-react';
import { COMPANY, whatsappLink } from '@/lib/data';
import { Reveal } from '@/components/site/reveal';
import { LeadForm } from '@/components/site/lead-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const metadata = {
  title: 'Support Center — We\u2019re here to help',
  description: 'Get support from PyTech Digital via WhatsApp, email or phone. Raise a request and our team responds within one business day.',
};

const FAQ = [
  { q: 'How fast do you respond to support requests?', a: 'We respond to all support requests within one business day, and much faster on WhatsApp during business hours.' },
  { q: 'Do existing clients get priority support?', a: 'Yes. Clients on a care/retainer plan get priority SLAs and a dedicated point of contact.' },
  { q: 'Can you support a site or app you didn\u2019t build?', a: 'Often yes — we offer audits and takeover support. Send us the details and we\u2019ll advise.' },
];

export default function SupportPage() {
  const channels = [
    { icon: MessageCircle, t: 'WhatsApp', d: 'Fastest way to reach us.', href: whatsappLink('Hi PyTech, I need support.'), cta: 'Chat now', external: true },
    { icon: Mail, t: 'Email', d: COMPANY.email, href: `mailto:${COMPANY.email}`, cta: 'Send email' },
    { icon: Phone, t: 'Call us', d: COMPANY.phone, href: `tel:${COMPANY.phone}`, cta: 'Call now' },
    { icon: CalendarClock, t: 'Book a call', d: 'Schedule a strategy session.', href: '/#contact', cta: 'Book now' },
  ];
  return (
    <div className="container mx-auto px-6 pt-28 md:pt-36">
      <Reveal>
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary"><LifeBuoy className="h-6 w-6" /></span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">Support Center</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Need a hand? Reach us on your preferred channel or raise a request below — we reply within one business day.</p>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((c, i) => (
          <Reveal key={c.t} delay={i * 0.06}>
            <a href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noopener noreferrer' : undefined} className="group flex h-full flex-col rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-primary/40 hover:shadow-xl">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-primary"><c.icon className="h-5 w-5" /></span>
              <p className="mt-3 font-display font-semibold">{c.t}</p>
              <p className="mt-1 flex-1 break-words text-sm text-muted-foreground">{c.d}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">{c.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-14 grid gap-10 pb-8 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-2xl font-bold md:text-3xl">Raise a support request</h2>
          <p className="mt-3 max-w-md text-muted-foreground">Tell us what you need help with and our team will get back to you quickly.</p>
          <div className="mt-6 max-w-xl">
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`f-${i}`}>
                  <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
        <Reveal delay={0.1}><LeadForm /></Reveal>
      </div>
    </div>
  );
}

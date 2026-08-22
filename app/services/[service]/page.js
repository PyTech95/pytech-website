import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, MapPin, Sparkles } from 'lucide-react';
import { getService, buildServiceFaqs, getServicesByPillar, getPillar, PROCESS, LOCATIONS, SERVICES, COMPANY } from '@/lib/data';
import { Icon } from '@/components/site/icon';
import { Reveal } from '@/components/site/reveal';
import { ServiceExtras } from '@/components/site/service-extras';
import { LeadForm } from '@/components/site/lead-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const PILLAR_IMG = {
  build: 'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHw0fHxtb2JpbGUlMjBhcHB8ZW58MHx8fGJsYWNrfDE3ODc0Mjg5ODJ8MA&ixlib=rb-4.1.0&q=85',
  brand: 'https://images.unsplash.com/photo-1709626011485-6fe000ea2dbc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHwzRCUyMGdlb21ldHJpY3xlbnwwfHx8YmxhY2t8MTc4NzQyODk4Mnww&ixlib=rb-4.1.0&q=85',
  market: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MHx8fGJsYWNrfDE3ODc0Mjg5NzF8MA&ixlib=rb-4.1.0&q=85',
  automate: 'https://images.unsplash.com/photo-1716436329475-4c55d05383bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwyfHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fGJsYWNrfDE3ODc0Mjg5ODJ8MA&ixlib=rb-4.1.0&q=85',
};

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }) {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) return { title: 'Service not found' };
  const title = `${service.name} Services | PyTech Digital`;
  const description = `${service.tagline} ${service.summary}`;
  return { title, description, alternates: { canonical: `${COMPANY.url}/services/${slug}` }, openGraph: { title, description } };
}

export default async function ServiceDetailPage({ params }) {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const pillar = getPillar(service.pillar);
  const faqs = buildServiceFaqs(service);
  const steps = PROCESS[service.pillar] || [];
  const related = getServicesByPillar(service.pillar).filter((s) => s.slug !== slug);

  const serviceSchema = {
    '@context': 'https://schema.org', '@type': 'Service', name: service.name, serviceType: service.name,
    description: service.summary, provider: { '@type': 'Organization', name: COMPANY.legalName, url: COMPANY.url },
    areaServed: 'Global',
  };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: COMPANY.url },
    { '@type': 'ListItem', position: 2, name: 'Services', item: `${COMPANY.url}/services` },
    { '@type': 'ListItem', position: 3, name: service.name, item: `${COMPANY.url}/services/${slug}` },
  ] };

  return (
    <article className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[640px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]" style={{ background: 'radial-gradient(circle, hsl(var(--brand)), transparent 60%)' }} />
        <div className="container relative mx-auto grid items-center gap-8 px-6 pb-10 lg:grid-cols-2">
          <div>
            <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground">Home</Link><span>/</span>
              <Link href="/services" className="hover:text-foreground">Services</Link><span>/</span>
              <span className="text-foreground">{service.name}</span>
            </nav>
            <Badge variant="outline" className="mb-4 gap-1.5 rounded-full border-primary/30 bg-primary/5" style={{ color: pillar?.accent }}>
              <Icon name={service.icon} className="h-3.5 w-3.5" /> {pillar?.label}
            </Badge>
            <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">{service.name}</h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">{service.tagline} {service.summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full glow-brand"><Link href="#lead">Get a free quote <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full"><Link href="#cities">Available near you</Link></Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-2xl border border-border">
              <img src={PILLAR_IMG[service.pillar]} alt={service.name} className="h-[320px] w-full object-cover opacity-85" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* What's included + outcomes */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">What&apos;s included</h2></Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.features.map((f, i) => (
                <Reveal key={f} delay={i * 0.05}>
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4">
                    <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-primary/15 text-primary"><Check className="h-4 w-4" /></span>
                    <span className="text-sm">{f}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-[hsl(var(--brand))]/10 to-[hsl(var(--cobalt))]/10 p-6">
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Typical outcomes</p>
              <div className="mt-4 space-y-4">
                {service.outcomes.map((o) => (
                  <div key={o} className="flex items-center gap-3"><Sparkles className="h-4 w-4 flex-none text-primary" /><span className="font-display font-semibold">{o}</span></div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="container mx-auto px-6 py-6">
        <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">How we deliver</h2></Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-border bg-card/50 p-5">
                <span className="font-display text-3xl font-bold text-gradient">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-2 font-display font-semibold">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Support / Learning / future add-ons */}
      <section className="container mx-auto px-6 py-12">
        <Reveal><h2 className="mb-6 font-display text-2xl font-bold md:text-3xl">Support &amp; resources</h2></Reveal>
        <ServiceExtras />
      </section>

      {/* Cities */}
      <section id="cities" className="container mx-auto scroll-mt-24 px-6 py-6">
        <Reveal>
          <h2 className="font-display text-2xl font-bold md:text-3xl">{service.name} near you</h2>
          <p className="mt-2 text-muted-foreground">We deliver {service.name} across India and globally.</p>
        </Reveal>
        <div className="mt-5 flex flex-wrap gap-2">
          {LOCATIONS.map((l) => (
            <Link key={l.slug} href={`/services/${slug}/${l.slug}`} className="flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
              <MapPin className="h-3.5 w-3.5" /> {l.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container mx-auto px-6 py-8">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Related {pillar?.label} services</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="group flex items-center justify-between rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-primary/40">
                <span className="flex items-center gap-3"><Icon name={s.icon} className="h-5 w-5 text-primary" /><span className="font-display font-semibold">{s.name}</span></span>
                <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container mx-auto px-6 py-12">
        <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">{service.name} FAQs</h2></Reveal>
        <div className="mt-6 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Lead form */}
      <section id="lead" className="container mx-auto scroll-mt-24 px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Start your {service.name} project</h2>
            <p className="mt-4 max-w-md text-muted-foreground">Get a free quote and a tailored plan from our senior team.</p>
          </Reveal>
          <Reveal delay={0.1}><LeadForm /></Reveal>
        </div>
      </section>
    </article>
  );
}

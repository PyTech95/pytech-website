import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, MapPin, Sparkles } from 'lucide-react';
import { getService, getLocation, buildLocalFaqs, getCaseStudy, SERVICES, LOCATIONS, COMPANY } from '@/lib/data';
import { Icon } from '@/components/site/icon';
import { Reveal } from '@/components/site/reveal';
import { LeadForm } from '@/components/site/lead-form';
import { ServiceExtras } from '@/components/site/service-extras';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Case study to inject per pillar
const CASE_BY_PILLAR = { build: 'fintech-trading-platform', automate: 'd2c-whatsapp-automation', market: 'saas-geo-seo-growth', brand: 'saas-geo-seo-growth' };

export async function generateMetadata({ params }) {
  const { service: sSlug, location: lSlug } = await params;
  const service = getService(sSlug);
  const location = getLocation(lSlug);
  if (!service || !location) return { title: 'Not found' };
  const title = `${service.name} in ${location.name} | PyTech Digital`;
  const description = `${service.name} services in ${location.name}, ${location.region}. ${service.summary} Book a free strategy call with PyTech Digital.`;
  return {
    title,
    description,
    keywords: [`${service.name} ${location.name}`, `${service.name} company ${location.name}`, `best ${service.name} agency ${location.name}`],
    alternates: { canonical: `${COMPANY.url}/services/${sSlug}/${lSlug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function ServiceLocationPage({ params }) {
  const { service: sSlug, location: lSlug } = await params;
  const service = getService(sSlug);
  const location = getLocation(lSlug);
  if (!service || !location) notFound();

  const faqs = buildLocalFaqs(service, location);
  const caseStudy = getCaseStudy(CASE_BY_PILLAR[service.pillar]);
  const related = SERVICES.filter((s) => s.pillar === service.pillar && s.slug !== service.slug);

  const serviceSchema = {
    '@context': 'https://schema.org', '@type': 'Service', name: `${service.name} in ${location.name}`,
    serviceType: service.name, description: service.summary, areaServed: { '@type': 'City', name: location.name },
    provider: { '@type': 'Organization', name: COMPANY.legalName, url: COMPANY.url },
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: COMPANY.url },
      { '@type': 'ListItem', position: 2, name: service.name, item: `${COMPANY.url}/services/${sSlug}/noida` },
      { '@type': 'ListItem', position: 3, name: location.name, item: `${COMPANY.url}/services/${sSlug}/${lSlug}` },
    ],
  };

  return (
    <article className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[640px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]" style={{ background: 'radial-gradient(circle, hsl(var(--brand)), transparent 60%)' }} />
        <div className="container relative mx-auto px-6 pb-10">
          <nav className="mb-5 flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">Home</Link><span>/</span>
            <Link href="/#services" className="hover:text-foreground">{service.name}</Link><span>/</span>
            <span className="text-foreground">{location.name}</span>
          </nav>
          <Badge variant="outline" className="mb-4 gap-1.5 rounded-full border-primary/30 bg-primary/5 text-primary"><MapPin className="h-3.5 w-3.5" /> Serving {location.region}</Badge>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl">
            {service.name} in <span className="text-gradient">{location.name}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{service.tagline} {service.summary}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full glow-brand"><Link href="#lead">Get a free quote <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full"><Link href="/case-studies">See results</Link></Button>
          </div>
        </div>
      </section>

      {/* Features + outcomes */}
      <section className="container mx-auto px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">What our {service.name} engagement includes</h2></Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.features.map((f, i) => (
                <Reveal key={f} delay={i * 0.06}>
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4">
                    <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-primary/15 text-primary"><Check className="h-4 w-4" /></span>
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="mt-8 rounded-xl border border-border bg-card/50 p-6">
                <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Why {location.name} businesses choose PyTech</p>
                <p className="mt-2 text-muted-foreground">Operating from our Gurugram HQ (Sector 32), we bring senior engineering, premium design and AI-first growth to {location.name}. You get a dedicated pod, weekly demos and measurable outcomes — with global delivery standards and local responsiveness.</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-[hsl(var(--brand))]/10 to-[hsl(var(--cobalt))]/10 p-6">
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Typical outcomes</p>
              <div className="mt-4 space-y-4">
                {service.outcomes.map((o) => (
                  <div key={o} className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 flex-none text-primary" />
                    <span className="font-display font-semibold">{o}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Case study injection */}
      {caseStudy && (
        <section className="container mx-auto px-6 py-6">
          <Reveal>
            <Link href={`/case-studies/${caseStudy.slug}`} className="group flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-primary/40 md:flex-row md:items-center">
              <div>
                <Badge className="mb-2 rounded-full">Case study</Badge>
                <h3 className="font-display text-xl font-semibold">{caseStudy.title}</h3>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">{caseStudy.excerpt}</p>
              </div>
              <div className="flex gap-6">
                {caseStudy.outcomes.slice(0, 2).map((o) => (
                  <div key={o.label}><p className="font-display text-2xl font-bold text-primary">{o.value}</p><p className="text-xs text-muted-foreground">{o.label}</p></div>
                ))}
                <ArrowRight className="hidden h-6 w-6 self-center text-primary transition-transform group-hover:translate-x-1 md:block" />
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {/* FAQ */}
      <section className="container mx-auto px-6 py-14">
        <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">{service.name} in {location.name} — FAQs</h2></Reveal>
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

      {/* Support & resources */}
      <section className="container mx-auto px-6 py-6">
        <Reveal><h2 className="mb-6 font-display text-xl font-bold md:text-2xl">Support &amp; resources</h2></Reveal>
        <ServiceExtras />
      </section>

      {/* Related + other locations (internal linking for SEO) */}
      <section className="container mx-auto px-6 py-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Related services</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {related.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}/${lSlug}`} className="rounded-full border border-border bg-card/50 px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground">{s.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">{service.name} in other cities</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {LOCATIONS.filter((l) => l.slug !== lSlug).slice(0, 8).map((l) => (
                <Link key={l.slug} href={`/services/${sSlug}/${l.slug}`} className="rounded-full border border-border bg-card/50 px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground">{l.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Lead form */}
      <section id="lead" className="container mx-auto scroll-mt-24 px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to start your {service.name} project in {location.name}?</h2>
            <p className="mt-4 max-w-md text-muted-foreground">Get a free, no-obligation quote and a tailored plan from our team.</p>
          </Reveal>
          <Reveal delay={0.1}><LeadForm /></Reveal>
        </div>
      </section>
    </article>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, MapPin, Check } from 'lucide-react';
import { getLocation, buildLocationFaqs, PILLARS, getServicesByPillar, SERVICES, LOCATIONS, COMPANY } from '@/lib/data';
import { Icon } from '@/components/site/icon';
import { Reveal } from '@/components/site/reveal';
import { ServiceExtras } from '@/components/site/service-extras';
import { LeadForm } from '@/components/site/lead-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export async function generateMetadata({ params }) {
  const { location: slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return { title: 'Location not found' };
  const title = `IT, Web & Digital Services in ${loc.name}`;
  const description = `PyTech Digital delivers web & app development, custom software, branding, SEO, GEO and AI automation in ${loc.name}, ${loc.region}. Book a free strategy call.`;
  return {
    title,
    description,
    keywords: [`IT company ${loc.name}`, `web development ${loc.name}`, `digital marketing ${loc.name}`, `software company ${loc.name}`, `SEO ${loc.name}`],
    alternates: { canonical: `${COMPANY.url}/locations/${slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function LocationHubPage({ params }) {
  const { location: slug } = await params;
  const loc = getLocation(slug);
  if (!loc) notFound();
  const faqs = buildLocationFaqs(loc);
  const nearby = LOCATIONS.filter((l) => l.group === loc.group && l.slug !== slug).slice(0, 10);

  const schema = {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: `PyTech Digital — ${loc.name}`,
    description: `IT, web, design, marketing and automation services in ${loc.name}.`,
    url: `${COMPANY.url}/locations/${slug}`, telephone: COMPANY.phone, email: COMPANY.email, priceRange: '$$',
    areaServed: { '@type': 'Place', name: loc.name }, provider: { '@type': 'Organization', name: COMPANY.legalName, url: COMPANY.url },
  };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: COMPANY.url },
    { '@type': 'ListItem', position: 2, name: 'Locations', item: `${COMPANY.url}/locations` },
    { '@type': 'ListItem', position: 3, name: loc.name, item: `${COMPANY.url}/locations/${slug}` },
  ] };

  return (
    <article className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="relative overflow-hidden pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[340px] w-[600px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]" style={{ background: 'radial-gradient(circle, hsl(var(--brand)), transparent 60%)' }} />
        <div className="container relative mx-auto px-6 pb-8">
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">Home</Link><span>/</span>
            <Link href="/locations" className="hover:text-foreground">Locations</Link><span>/</span>
            <span className="text-foreground">{loc.name}</span>
          </nav>
          <Badge variant="outline" className="mb-4 gap-1.5 rounded-full border-primary/30 bg-primary/5 text-primary"><MapPin className="h-3.5 w-3.5" /> {loc.region}</Badge>
          <h1 className="max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl">IT, Web &amp; Digital Services in <span className="text-gradient">{loc.name}</span></h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">From websites and mobile apps to branding, SEO/GEO and AI automation — PyTech Digital is your full-stack growth partner in {loc.name}. Senior team, transparent pricing, measurable outcomes.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full glow-brand"><Link href="#lead">Get a free quote <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full"><Link href="/case-studies">See our work</Link></Button>
          </div>
        </div>
      </section>

      {/* Services for this city */}
      <section className="container mx-auto px-6 py-12">
        <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">Our services in {loc.name}</h2></Reveal>
        <div className="mt-6 space-y-8">
          {PILLARS.map((p) => (
            <div key={p.key}>
              <p className="mb-3 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest" style={{ color: p.accent }}><Icon name={p.icon} className="h-4 w-4" /> {p.label}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {getServicesByPillar(p.key).map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}/${slug}`} className="group flex items-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-3 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground">
                    <Icon name={s.icon} className="h-4 w-4 flex-none text-primary" />
                    <span className="truncate">{s.name} in {loc.name.split(',')[0]}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="container mx-auto px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {['Dedicated senior team', 'Transparent, fixed-scope pricing', 'Weekly demos & measurable outcomes'].map((t) => (
            <Reveal key={t}><div className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4"><span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-primary/15 text-primary"><Check className="h-4 w-4" /></span><span className="text-sm">{t}</span></div></Reveal>
          ))}
        </div>
      </section>

      {/* Support & resources */}
      <section className="container mx-auto px-6 py-12">
        <Reveal><h2 className="mb-6 font-display text-xl font-bold md:text-2xl">Support &amp; resources</h2></Reveal>
        <ServiceExtras />
      </section>

      {/* Nearby locations */}
      {nearby.length > 0 && (
        <section className="container mx-auto px-6 py-6">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Also serving nearby</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {nearby.map((l) => (
              <Link key={l.slug} href={`/locations/${l.slug}`} className="rounded-full border border-border bg-card/50 px-3.5 py-2 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground">{l.name}</Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container mx-auto px-6 py-12">
        <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">PyTech Digital in {loc.name} — FAQs</h2></Reveal>
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
            <h2 className="font-display text-3xl font-bold md:text-4xl">Start your project in {loc.name}</h2>
            <p className="mt-4 max-w-md text-muted-foreground">Get a free quote and a tailored plan from our senior team.</p>
          </Reveal>
          <Reveal delay={0.1}><LeadForm context={`location:${slug}`} /></Reveal>
        </div>
      </section>
    </article>
  );
}

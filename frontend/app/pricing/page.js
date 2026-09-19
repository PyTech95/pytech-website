import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { COMPANY, DEFAULT_OFFERINGS } from '@/lib/data';
import { PricingTable } from '@/components/site/pricing-table';
import { Reveal } from '@/components/site/reveal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { pageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export async function generateMetadata() { return pageMetadata('/pricing', BASE_METADATA); }

const BASE_METADATA = {
  title: 'Pricing — Website, App, ERP, AI Automation & Marketing',
  description: 'Transparent starting prices from PyTech Digital: websites from ₹20,000 ($250), mobile apps from ₹99,999 ($1,999), plus ERP software, AI automation, digital marketing and branding. INR & USD.',
  alternates: { canonical: '/pricing' },
};

const FAQ = [
  { q: 'How much does a website cost in India?', a: 'At PyTech Digital, websites start at ₹20,000 (about $250) for a fast, SEO-ready business website. Larger e-commerce or web-app builds are quoted on scope after a free consultation.' },
  { q: 'How much does mobile app development cost?', a: 'Mobile app development starts at ₹99,999 (about $1,999) for an MVP on iOS or Android. Final cost depends on features such as payments, chat, live data and integrations.' },
  { q: 'What is included in the starting price?', a: 'Discovery, UI/UX design, development, QA, deployment and post-launch support for the defined scope. Everything is fixed-scope and quoted in writing before we start — no surprise invoices.' },
  { q: 'Do you offer monthly retainers?', a: 'Yes. Digital marketing, SEO/GEO and AI automation run as monthly retainers starting at ₹24,999/month, with weekly reporting on pipeline and revenue.' },
  { q: 'Do you work with international clients and bill in USD?', a: `Yes. We deliver for clients in the US, UK, UAE and Singapore and invoice in USD. Write to ${COMPANY.email} for a USD proposal.` },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    ...DEFAULT_OFFERINGS.filter((o) => o.priceInr).map((o) => ({
      '@type': 'Service',
      name: o.title,
      provider: { '@type': 'Organization', name: COMPANY.legalName },
      description: o.blurb,
      offers: { '@type': 'Offer', priceCurrency: 'INR', price: o.priceInr, priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'INR', price: o.priceInr, valueAddedTaxIncluded: false } },
    })),
  ],
};

export default function PricingPage() {
  return (
    <div className="container mx-auto px-6 pb-20 pt-28 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <Reveal>
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Pricing</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl">Transparent starting prices. No surprise invoices.</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Every project is fixed-scope and quoted in writing. Below are the honest starting points — websites from ₹20,000, apps from ₹99,999 — in INR or USD.
        </p>
      </Reveal>

      <div className="mt-12">
        <PricingTable />
      </div>

      <section className="mt-16 rounded-3xl border border-border bg-card/50 p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Pricing FAQ</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">What it really costs.</h2>
            <Link href="/#contact" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground glow-brand">
              Get an exact quote <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`pf-${i}`}>
                  <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}

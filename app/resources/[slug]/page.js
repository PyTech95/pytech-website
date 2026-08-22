import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { getResource, getResourcesByPillar, getPillar, RESOURCES, COMPANY } from '@/lib/data';
import { Reveal } from '@/components/site/reveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = getResource(slug);
  if (!a) return { title: 'Guide not found' };
  return {
    title: `${a.title} | Learning Hub`,
    description: a.excerpt,
    alternates: { canonical: `${COMPANY.url}/resources/${slug}` },
    openGraph: { title: a.title, description: a.excerpt, type: 'article' },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const a = getResource(slug);
  if (!a) notFound();
  const pillar = getPillar(a.pillar);
  const related = getResourcesByPillar(a.pillar).filter((r) => r.slug !== slug).slice(0, 2);

  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt,
    author: { '@type': 'Organization', name: COMPANY.legalName }, publisher: { '@type': 'Organization', name: COMPANY.legalName },
    mainEntityOfPage: `${COMPANY.url}/resources/${slug}`,
  };

  return (
    <article className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="relative overflow-hidden pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="container relative mx-auto max-w-3xl px-6 pb-4">
          <Link href="/resources" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Learning Hub</Link>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="rounded-full" style={{ color: pillar?.accent }}>{pillar?.label}</Badge>
            <Badge variant="secondary" className="rounded-full">{a.tag}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {a.readTime} read</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl">{a.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{a.excerpt}</p>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl px-6 py-10">
        <div className="space-y-8">
          {a.content.map((s, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div>
                <h2 className="font-display text-xl font-bold md:text-2xl">{s.h}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-gradient-to-br from-[hsl(var(--brand))]/10 to-[hsl(var(--cobalt))]/10 p-6 md:flex-row md:items-center">
          <div>
            <p className="font-display text-lg font-semibold">Want us to handle this for you?</p>
            <p className="mt-1 text-sm text-muted-foreground">Book a free strategy call with our {pillar?.label.toLowerCase()} team.</p>
          </div>
          <Button asChild className="rounded-full glow-brand"><Link href="/#contact">Book a Strategy Call <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">More {pillar?.label} guides</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} href={`/resources/${r.slug}`} className="group rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-primary/40">
                  <Badge variant="outline" className="rounded-full">{r.tag}</Badge>
                  <p className="mt-3 font-display font-semibold leading-snug">{r.title}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm text-primary">Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </article>
  );
}

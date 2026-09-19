import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getContent, listContent } from '@/lib/cms';
import { cleanHtml } from '@/lib/content-validation';
import { pageMetadata } from '@/lib/seo';
import { COMPANY } from '@/lib/data';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const { slug } = await params; const post = await getContent('posts', slug);
  if (!post) return { title: 'Article not found', robots: { index: false } };
  const title = post.seoTitle || post.title, description = post.seoDescription || post.excerpt;
  return pageMetadata(`/blog/${slug}`, { title, description, keywords: post.keywords, alternates: { canonical: `/blog/${slug}` }, openGraph: { title, description, type: 'article', ...(post.image ? { images: [post.image] } : {}) }, twitter: { card: 'summary_large_image', title, description, ...(post.image ? { images: [post.image] } : {}) } });
}
export default async function ArticlePage({ params }) {
  const { slug } = await params; const post = await getContent('posts', slug); if (!post) notFound();
  const related = (await listContent('posts')).filter((p) => p.slug !== slug && p.pillar === post.pillar).slice(0, 2);
  const schema = { '@context': 'https://schema.org', '@type': post.kind === 'news' ? 'NewsArticle' : 'BlogPosting', headline: post.title, description: post.excerpt, author: { '@type': 'Organization', name: post.author || COMPANY.name }, publisher: { '@type': 'Organization', name: COMPANY.name }, datePublished: post.publishedAt, dateModified: post.updatedAt, mainEntityOfPage: `${COMPANY.url}/blog/${slug}`, ...(post.image ? { image: new URL(post.image, COMPANY.url).href } : {}) };
  return <article className="container mx-auto max-w-4xl px-6 pb-12 pt-32 [overflow-wrap:anywhere] md:pt-40">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <Link href="/blog" data-testid="article-back" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" />Blog / News</Link>
    <p data-testid="article-type" className="mt-8 text-xs font-semibold uppercase text-primary">{post.kind === 'news' ? 'News' : 'Blog'} · {post.pillar}</p>
    <h1 data-testid="article-title" className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
    <p className="mt-6 text-base text-muted-foreground md:text-lg">{post.excerpt}</p>
    <p data-testid="article-byline" className="mt-5 text-xs text-muted-foreground">{post.author || COMPANY.name}{post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}` : ''}</p>
    {post.image && <div className="mt-8 aspect-[16/10] overflow-hidden rounded-lg bg-card"><img data-testid="article-cover" src={post.image} alt={post.imageAlt || post.title} className="h-full w-full object-contain" /></div>}
    <div data-testid="article-body" className="cms-prose mt-12 text-sm md:text-base" dangerouslySetInnerHTML={{ __html: cleanHtml(post.body) }} />
    <div className="mt-14 border-y border-border py-8"><p className="font-display text-lg font-semibold">Have a project in mind?</p><Link href="/#contact" data-testid="article-contact" className="mt-3 inline-flex items-center gap-2 text-sm text-primary">Talk to our team <ArrowRight className="h-4 w-4" /></Link></div>
    {!!related.length && <div className="mt-10 grid gap-8 sm:grid-cols-2">{related.map((p) => <Link key={p.slug} data-testid={`article-related-${p.slug}`} href={`/blog/${p.slug}`} className="font-display font-semibold hover:text-primary">{p.title}<ArrowRight className="mt-3 h-4 w-4 text-primary" /></Link>)}</div>}
  </article>;
}
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const BlogList = ({ posts }) => {
  const [kind, setKind] = useState('all'), [query, setQuery] = useState('');
  const items = posts.filter((p) => (kind === 'all' || p.kind === kind) && `${p.title} ${p.excerpt}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="mt-10">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
      <div className="flex gap-6 border-b border-border" role="tablist" aria-label="Article type">{['all', 'blog', 'news'].map((value) => <button key={value} role="tab" aria-selected={kind === value} data-testid={`blog-filter-${value}`} onClick={() => setKind(value)} className={`border-b-2 pb-3 text-sm capitalize transition-colors ${kind === value ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{value === 'all' ? 'All stories' : value}</button>)}</div>
      <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input data-testid="blog-search" aria-label="Search articles" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stories…" /></div>
    </div>
    {!items.length && <p data-testid="blog-empty" className="py-14 text-muted-foreground">No stories found.</p>}
    <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">{items.map((post) => <article key={post.slug} data-testid={`blog-card-${post.slug}`} className="min-w-0 border-b border-border pb-7 [overflow-wrap:anywhere]">
      <Link href={`/blog/${post.slug}`} data-testid={`blog-link-${post.slug}`} className="group block">
        {post.image && <div className="mb-5 aspect-[16/10] overflow-hidden rounded-lg bg-card"><img src={post.image} alt={post.imageAlt || post.title} loading="lazy" className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]" /></div>}
        <p className="text-xs font-medium uppercase text-primary">{post.kind === 'news' ? 'News' : post.tag || 'Blog'} · {post.pillar}</p>
        <h2 className="mt-3 font-display text-base font-semibold leading-relaxed transition-colors group-hover:text-primary md:text-lg">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm">Read story <ArrowUpRight className="h-4 w-4 text-primary" /></span>
      </Link>
    </article>)}</div>
  </section>;
};
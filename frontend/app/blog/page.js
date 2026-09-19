import { listContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/seo';
import { BlogList } from '@/components/site/blog-list';
export const dynamic = 'force-dynamic';
export async function generateMetadata() { return pageMetadata('/blog', { title: 'Blog & News — Ideas, Insights and Studio Updates', description: 'Practical insights on building digital products, growing brands and automating business from PyTech Digital.', alternates: { canonical: '/blog' } }); }
export default async function BlogPage() {
  const posts = await listContent('posts');
  return <div className="container mx-auto px-6 pb-12 pt-32 md:pt-40"><p className="text-sm font-semibold uppercase text-primary">PyTech journal</p><h1 data-testid="blog-title" className="mt-3 font-display text-4xl font-bold sm:text-5xl lg:text-6xl">Ideas worth sharing.</h1><p className="mt-5 max-w-2xl text-muted-foreground">Perspectives on technology, design and growth. News from the studio.</p><BlogList posts={posts} /></div>;
}
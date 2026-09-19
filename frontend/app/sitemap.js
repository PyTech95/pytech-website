import { LOCATIONS, COMPANY } from '@/lib/data';
import { listContent } from '@/lib/cms';
export const dynamic = 'force-dynamic';
export default async function sitemap() {
  const [services, cases, posts] = await Promise.all(['services', 'cases', 'posts'].map((type) => listContent(type)));
  const base = COMPANY.url.replace(/\/$/, '');
  const entry = (path, item = {}, priority = 0.7) => ({ url: `${base}${path}`, ...(item.updatedAt ? { lastModified: new Date(item.updatedAt) } : {}), changeFrequency: 'weekly', priority });
  return [
    ...['', '/services', '/locations', '/ai-automation', '/case-studies', '/blog', '/support', '/work', '/careers', '/pricing'].map((p) => entry(p, {}, p ? 0.8 : 1)),
    ...services.map((s) => entry(`/services/${s.slug}`, s)),
    ...LOCATIONS.map((l) => entry(`/locations/${l.slug}`)),
    ...cases.map((c) => entry(`/case-studies/${c.slug}`, c)),
    ...posts.map((p) => entry(`/blog/${p.slug}`, p)),
    ...services.flatMap((s) => LOCATIONS.map((l) => entry(`/services/${s.slug}/${l.slug}`, s))),
  ];
}
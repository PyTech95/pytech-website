import { getDb } from './mongo';

// Pages whose title/description can be edited from Admin → SEO
export const SEO_PAGES = [
  { path: '/', label: 'Homepage' },
  { path: '/services', label: 'Services index' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/work', label: 'Our Work' },
  { path: '/careers', label: 'Careers' },
  { path: '/case-studies', label: 'Case Studies' },
  { path: '/locations', label: 'Locations' },
  { path: '/ai-automation', label: 'AI Automation' },
  { path: '/resources', label: 'Learning Hub' },
  { path: '/support', label: 'Support' },
];

export async function getSeoOverride(path) {
  try {
    const db = await getDb();
    return await db.collection('seo').findOne({ path }, { projection: { _id: 0 } });
  } catch (e) {
    return null;
  }
}

export async function pageMetadata(path, base) {
  const o = await getSeoOverride(path);
  if (!o) return base;
  const title = o.title ? { absolute: o.title } : base.title;
  const description = o.description || base.description;
  const keywords = Array.isArray(o.keywords) && o.keywords.length ? o.keywords : base.keywords;
  return {
    ...base,
    title,
    description,
    keywords,
    openGraph: { ...(base.openGraph || {}), title: o.title || base.openGraph?.title, description },
    twitter: { ...(base.twitter || {}), title: o.title || base.twitter?.title, description },
  };
}

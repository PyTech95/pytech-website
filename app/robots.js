import { COMPANY } from '@/lib/data';

export default function robots() {
  const base = COMPANY.url.replace(/\/$/, '');
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

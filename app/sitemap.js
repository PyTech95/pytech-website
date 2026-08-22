import { SERVICES, LOCATIONS, CASE_STUDIES, COMPANY } from '@/lib/data';

export default function sitemap() {
  const base = COMPANY.url.replace(/\/$/, '');
  const now = new Date();

  const staticUrls = [
    { path: '', priority: 1, freq: 'weekly' },
    { path: '/ai-automation', priority: 0.9, freq: 'weekly' },
    { path: '/case-studies', priority: 0.8, freq: 'weekly' },
  ].map((s) => ({ url: `${base}${s.path}`, lastModified: now, changeFrequency: s.freq, priority: s.priority }));

  const caseUrls = CASE_STUDIES.map((c) => ({
    url: `${base}/case-studies/${c.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6,
  }));

  const serviceUrls = [];
  for (const s of SERVICES) {
    for (const l of LOCATIONS) {
      serviceUrls.push({
        url: `${base}/services/${s.slug}/${l.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: l.hub ? 0.8 : 0.7,
      });
    }
  }

  return [...staticUrls, ...caseUrls, ...serviceUrls];
}

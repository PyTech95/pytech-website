import { SERVICES, LOCATIONS, CASE_STUDIES, RESOURCES, COMPANY } from '@/lib/data';

export default function sitemap() {
  const base = COMPANY.url.replace(/\/$/, '');
  const now = new Date();

  const staticUrls = [
    { path: '', priority: 1, freq: 'weekly' },
    { path: '/services', priority: 0.9, freq: 'weekly' },
    { path: '/ai-automation', priority: 0.9, freq: 'weekly' },
    { path: '/case-studies', priority: 0.8, freq: 'weekly' },
    { path: '/resources', priority: 0.7, freq: 'weekly' },
    { path: '/support', priority: 0.5, freq: 'monthly' },
  ].map((s) => ({ url: `${base}${s.path}`, lastModified: now, changeFrequency: s.freq, priority: s.priority }));

  const serviceDetailUrls = SERVICES.map((s) => ({
    url: `${base}/services/${s.slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8,
  }));

  const caseUrls = CASE_STUDIES.map((c) => ({
    url: `${base}/case-studies/${c.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6,
  }));

  const resourceUrls = RESOURCES.map((r) => ({
    url: `${base}/resources/${r.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6,
  }));

  const serviceLocationUrls = [];
  for (const s of SERVICES) {
    for (const l of LOCATIONS) {
      serviceLocationUrls.push({
        url: `${base}/services/${s.slug}/${l.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: l.hub ? 0.8 : 0.7,
      });
    }
  }

  return [...staticUrls, ...serviceDetailUrls, ...caseUrls, ...resourceUrls, ...serviceLocationUrls];
}

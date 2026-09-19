import { SERVICES, CASE_STUDIES, RESOURCES } from './data';
import { getDb } from './mongo';
import { cache } from 'react';

const escape = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const defaults = {
  services: SERVICES,
  cases: CASE_STUDIES,
  posts: RESOURCES.map((r) => ({ ...r, kind: 'blog', author: 'PyTech Digital', body: r.content.map((s) => `<h2>${escape(s.h)}</h2><p>${escape(s.p)}</p>`).join('') })),
};
export const CMS_TYPES = Object.keys(defaults);

// Static entries remain intact until an admin override is saved. Tombstones prevent deleted seeds returning.
export async function listContent(type, admin = false) {
  if (!CMS_TYPES.includes(type)) return [];
  const db = await getDb();
  const rows = await db.collection(`cms_${type}`).find({}, { projection: { _id: 0 } }).toArray();
  const map = new Map(defaults[type].map((item) => [item.slug, { id: `seed:${item.slug}`, status: 'published', ...item }]));
  rows.forEach((item) => map.set(item.slug, item));
  return [...map.values()].filter((item) => !item.deleted && (admin || item.status === 'published'))
    .sort((a, b) => (a.order || 0) - (b.order || 0) || String(b.publishedAt || b.createdAt || '').localeCompare(String(a.publishedAt || a.createdAt || '')));
}
export const getContent = cache(async (type, slug) => (await listContent(type)).find((item) => item.slug === slug) || null);
export async function validService(slug) {
  return typeof slug === 'string' && !!(await getContent('services', slug));
}
export async function serviceProjects(slug) {
  const db = await getDb();
  return db.collection('projects').find({ serviceSlug: slug }, { projection: { _id: 0 } }).sort({ order: 1, createdAt: -1 }).toArray();
}
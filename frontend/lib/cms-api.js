import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { CMS_TYPES, listContent } from './cms';
import { contentSchemas } from './content-validation';

const json = (data, status = 200) => NextResponse.json(data, { status });
export async function cmsRoute(request, route, db, admin) {
  const type = route.split('/')[2];
  if (!CMS_TYPES.includes(type) || route !== `/cms/${type}`) return json({ error: 'Not found' }, 404);
  const method = request.method;
  const url = request.nextUrl;
  if (method === 'GET') {
    const manage = url.searchParams.get('admin') === '1';
    if (manage && !admin) return json({ error: 'Unauthorized' }, 401);
    let items = await listContent(type, manage);
    const slug = url.searchParams.get('slug');
    if (slug) items = items.filter((item) => item.slug === slug);
    return json({ items });
  }
  if (!admin) return json({ error: 'Unauthorized' }, 401);
  const col = db.collection(`cms_${type}`);
  await col.createIndex({ slug: 1 }, { unique: true });
  if (method === 'DELETE') {
    const item = (await listContent(type, true)).find((v) => v.id === url.searchParams.get('id'));
    if (!item) return json({ error: 'Content not found' }, 404);
    if (type === 'services') {
      const refs = await db.collection('projects').countDocuments({ serviceSlug: item.slug }) + await db.collection('offerings').countDocuments({ serviceSlug: item.slug });
      if (refs) return json({ error: 'Reassign linked projects and offerings before deleting this service.' }, 409);
    }
    await col.updateOne({ slug: item.slug }, { $set: { ...item, deleted: true, updatedAt: new Date().toISOString() } }, { upsert: true });
    return json({ ok: true });
  }
  if (!['POST', 'PUT'].includes(method)) return json({ error: 'Method not allowed' }, 405);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  if (!body || Array.isArray(body) || typeof body !== 'object') return json({ error: 'Expected a content object' }, 400);
  const items = await listContent(type, true);
  const existing = method === 'PUT' ? items.find((item) => item.id === body.id) : null;
  if (method === 'PUT' && !existing) return json({ error: 'Content not found' }, 404);
  if (existing && body.slug !== existing.slug) return json({ error: 'The URL cannot be changed after creation.' }, 400);
  const result = contentSchemas[type].safeParse(body);
  if (!result.success) return json({ error: result.error.issues[0].message }, 400);
  const value = result.data;
  if (value.status === 'published') {
    if (type === 'services' && (!value.summary || !value.features.length)) return json({ error: 'Published services need a summary and at least one feature.' }, 400);
    if (type !== 'services' && !value.excerpt) return json({ error: 'Add an excerpt before publishing.' }, 400);
    if (type === 'posts' && !value.body.replace(/<[^>]*>/g, '').trim()) return json({ error: 'Add article text before publishing.' }, 400);
    if (type === 'cases' && !value.body.replace(/<[^>]*>/g, '').trim() && (!value.challenge || !value.solution)) return json({ error: 'Add the challenge and solution, or case study text before publishing.' }, 400);
  }
  if (type === 'services' && existing?.status === 'published' && value.status === 'draft') {
    const refs = await db.collection('projects').countDocuments({ serviceSlug: value.slug }) + await db.collection('offerings').countDocuments({ serviceSlug: value.slug });
    if (refs) return json({ error: 'Reassign linked projects and offerings before unpublishing this service.' }, 409);
  }
  if (method === 'POST' && (items.some((i) => i.slug === value.slug) || await col.findOne({ slug: value.slug }, { projection: { _id: 0, slug: 1 } }))) return json({ error: 'This URL is already used. Choose another slug.' }, 409);
  const now = new Date().toISOString();
  const item = { ...value, id: existing?.id || randomUUID(), createdAt: existing?.createdAt || now, updatedAt: now, publishedAt: existing?.publishedAt || (value.status === 'published' ? now : null) };
  try {
    if (existing) await col.updateOne({ slug: item.slug }, { $set: item }, { upsert: true });
    else await col.insertOne({ ...item });
  } catch (error) { if (error.code === 11000) return json({ error: 'This URL is already used.' }, 409); throw error; }
  return json({ ok: true, item }, existing ? 200 : 201);
}
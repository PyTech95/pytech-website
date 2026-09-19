import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { putObject, getObject, APP_NAME } from './storage';

export async function mediaRoute(request, route, db, admin) {
  if (route === '/media' && request.method === 'POST') {
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const form = await request.formData();
    const file = form.get('file');
    if (!file || !file.size || file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return NextResponse.json({ error: 'Choose a JPG, PNG or WebP image under 5 MB.' }, { status: 400 });
    let buffer;
    try { buffer = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000 }).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer(); }
    catch { return NextResponse.json({ error: 'This file is not a valid image.' }, { status: 400 }); }
    const id = randomUUID();
    const result = await putObject(`${APP_NAME}/public-media/${id}.webp`, buffer, 'image/webp');
    await db.collection('media').insertOne({ id, storagePath: result.path, filename: file.name, contentType: 'image/webp', is_deleted: false, createdAt: new Date().toISOString() });
    return NextResponse.json({ url: `/api/media/${id}`, id }, { status: 201 });
  }
  if (/^\/media\/[a-f\d-]{36}$/.test(route) && request.method === 'GET') {
    const item = await db.collection('media').findOne({ id: route.split('/')[2], is_deleted: false }, { projection: { _id: 0 } });
    if (!item) return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    const { buffer } = await getObject(item.storagePath);
    return new NextResponse(buffer, { headers: { 'Content-Type': 'image/webp', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=86400' } });
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
import { permanentRedirect, notFound } from 'next/navigation';
import { getContent } from '@/lib/cms';
export const dynamic = 'force-dynamic';
export default async function ResourcePage({ params }) { const { slug } = await params; if (!(await getContent('posts', slug))) notFound(); permanentRedirect(`/blog/${slug}`); }
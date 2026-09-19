import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';

const text = (max) => z.string().trim().max(max);
export const safeUrl = (s) => !s || /^https?:\/\/[^\s]+$/i.test(s) || /^\/api\/media\/[a-f\d-]+$/i.test(s);
const image = text(2000).refine(safeUrl, 'Use an http(s) image URL or an uploaded image').default('');
const lines = z.preprocess((v) => typeof v === 'string' ? v.split('\n').map((s) => s.trim()).filter(Boolean) : v, z.array(text(500)).max(40)).default([]);
export function cleanHtml(html) {
  return sanitizeHtml(html || '', {
    allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'hr', 'code', 'pre'],
    allowedAttributes: { a: ['href', 'title', 'rel'], img: ['src', 'alt', 'title'] },
    allowedSchemes: ['http', 'https', 'mailto'], allowedSchemesByTag: { img: ['http', 'https'] }, allowProtocolRelative: false,
    transformTags: { a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, rel: 'noopener noreferrer' } }) },
    exclusiveFilter: (f) => f.tag === 'img' && !safeUrl(f.attribs.src),
  });
}
const common = {
  slug: text(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens for the URL'),
  status: z.enum(['draft', 'published']).default('draft'),
  image, imageAlt: text(250).default(''),
  seoTitle: text(200).default(''), seoDescription: text(500).default(''), keywords: text(1000).default(''),
  pillar: z.enum(['build', 'brand', 'market', 'automate']).default('build'),
};
const article = { ...common, title: text(200).min(1, 'Title is required'), excerpt: text(2000).default(''), body: text(200000).default('').transform(cleanHtml) };
export const contentSchemas = {
  services: z.object({ ...common, name: text(150).min(1, 'Service name is required'), tagline: text(500).default(''), summary: text(4000).default(''), icon: text(50).default('Globe'), features: lines, outcomes: lines }),
  posts: z.object({ ...article, kind: z.enum(['blog', 'news']).default('blog'), author: text(150).default('PyTech Digital') }),
  cases: z.object({ ...article, client: text(150).default(''), industry: text(150).default(''), challenge: text(8000).default(''), solution: text(8000).default(''), techStack: lines, outcomes: z.array(z.object({ label: text(100), value: text(100), delta: text(100).default('') })).max(12).default([]) }),
};
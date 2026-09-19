import { COMPANY } from '@/lib/data';

// Explicitly welcome AI / answer-engine crawlers (GEO) while blocking the admin area.
const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'Google-Extended', 'GoogleOther',
  'Applebot', 'Applebot-Extended', 'ClaudeBot', 'Claude-Web', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User', 'CCBot', 'Amazonbot', 'Meta-ExternalAgent',
  'cohere-ai', 'YouBot', 'DuckAssistBot', 'Bytespider',
];

export default function robots() {
  const base = COMPANY.url.replace(/\/$/, '');
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin'] },
      ...AI_BOTS.map((ua) => ({ userAgent: ua, allow: '/', disallow: ['/admin'] })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

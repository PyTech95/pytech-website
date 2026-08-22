import { COMPANY } from '@/lib/data';

export default function manifest() {
  return {
    name: COMPANY.legalName,
    short_name: 'PyTech',
    description: COMPANY.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#05070d',
    theme_color: '#05070d',
    categories: ['business', 'technology', 'productivity'],
    icons: [
      { src: '/pt-logo.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/pt-logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}

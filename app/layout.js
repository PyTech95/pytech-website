import './globals.css';
import { Space_Grotesk, Inter } from 'next/font/google';
import { Providers } from './providers';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { TriageChatbot } from '@/components/site/triage-chatbot';
import { WhatsAppFab } from '@/components/site/whatsapp-fab';
import { CursorGlow } from '@/components/site/cursor-glow';
import { COMPANY } from '@/lib/data';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata = {
  metadataBase: new URL(COMPANY.url),
  title: {
    default: 'PyTech Digital — Build. Brand. Market. Automate. | IT & Growth Agency Gurugram',
    template: '%s | PyTech Digital',
  },
  description: COMPANY.description,
  applicationName: 'PyTech Digital',
  authors: [{ name: 'PyTech Digital', url: COMPANY.url }],
  creator: 'PyTech Digital',
  publisher: 'PyTech Digital Private Limited',
  category: 'technology',
  keywords: ['IT company Gurugram', 'software development company', 'web development Gurugram', 'mobile app development', 'digital marketing agency', 'SEO company India', 'AI SEO', 'GEO generative engine optimization', 'WhatsApp Business API', 'SMS marketing', 'AI automation agency', '3D logo design', 'UI UX design'],
  alternates: { canonical: '/' },
  manifest: '/manifest.webmanifest',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: 'PyTech Digital — Build. Brand. Market. Automate.',
    description: COMPANY.description,
    url: COMPANY.url,
    type: 'website',
    locale: 'en_IN',
    siteName: 'PyTech Digital',
  },
  twitter: { card: 'summary_large_image', title: 'PyTech Digital — Build. Brand. Market. Automate.', description: COMPANY.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#05070d' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${COMPANY.url}/#organization`,
      name: COMPANY.legalName,
      alternateName: COMPANY.name,
      url: COMPANY.url,
      logo: `${COMPANY.url}/pt-logo.png`,
      image: `${COMPANY.url}/pt-logo.png`,
      email: COMPANY.email,
      telephone: COMPANY.phone,
      priceRange: '$$',
      foundingDate: COMPANY.founded,
      description: COMPANY.description,
      sameAs: COMPANY.sameAs,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '24, 2nd Floor, Institutional Area, Prem Puri, Sector 32',
        addressLocality: 'Gurugram',
        addressRegion: 'Haryana',
        postalCode: '122001',
        addressCountry: 'IN',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 28.4595, longitude: 77.0266 },
      areaServed: ['Gurugram', 'Delhi NCR', 'Noida', 'India', 'Global'],
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '19:00' }],
      knowsAbout: ['Web Development', 'Mobile App Development', 'Custom Software', 'UI/UX Design', '3D Logo Design', 'SEO', 'AI SEO', 'Generative Engine Optimization', 'WhatsApp Business API', 'SMS Marketing', 'Voice Automation', 'Business Workflow AI'],
    },
    {
      '@type': 'WebSite',
      '@id': `${COMPANY.url}/#website`,
      url: COMPANY.url,
      name: 'PyTech Digital',
      description: COMPANY.description,
      publisher: { '@id': `${COMPANY.url}/#organization` },
      inLanguage: 'en',
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
      </head>
      <body>
        <Providers>
          <CursorGlow />
          <Navbar />
          <main className="relative min-h-screen overflow-x-hidden">{children}</main>
          <Footer />
          <WhatsAppFab />
          <TriageChatbot />
        </Providers>
      </body>
    </html>
  );
}

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
    default: 'PyTech Digital — Build. Brand. Market. Automate. | IT & Growth Agency Noida',
    template: '%s | PyTech Digital',
  },
  description: COMPANY.description,
  keywords: ['IT company Noida', 'web development', 'digital marketing', 'WhatsApp API', 'AI automation', 'SEO agency', 'GEO', 'app development Gurugram'],
  openGraph: {
    title: 'PyTech Digital — Build. Brand. Market. Automate.',
    description: COMPANY.description,
    type: 'website',
    locale: 'en_IN',
    siteName: 'PyTech Digital',
  },
  twitter: { card: 'summary_large_image', title: 'PyTech Digital', description: COMPANY.description },
  robots: { index: true, follow: true },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY.legalName,
  alternateName: COMPANY.name,
  url: COMPANY.url,
  email: COMPANY.email,
  telephone: COMPANY.phone,
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
  areaServed: ['Gurugram', 'Delhi NCR', 'Noida', 'India', 'Global'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
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

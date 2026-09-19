import { COMPANY, JOBS } from '@/lib/data';
import { CareersClient } from '@/components/site/careers-client';

import { pageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export async function generateMetadata() { return pageMetadata('/careers', BASE_METADATA); }

const BASE_METADATA = {
  title: 'Careers — Join PyTech Digital | Jobs in Gurugram & Remote',
  description: 'Build your career at PyTech Digital. Open roles in Sales (BDE, BDM), People (HR), Engineering (Frontend, Full-Stack, iOS, Android) and Marketing (SEO, Social Media). Apply online with your resume.',
  alternates: { canonical: '/careers' },
  openGraph: {
    title: 'Careers at PyTech Digital',
    description: 'Open roles across engineering, sales, design and marketing. Apply online with your resume.',
    url: `${COMPANY.url}/careers`,
    type: 'website',
  },
};

const jobPostingSchema = {
  '@context': 'https://schema.org',
  '@graph': JOBS.map((j) => ({
    '@type': 'JobPosting',
    title: j.title,
    description: j.blurb,
    employmentType: 'FULL_TIME',
    hiringOrganization: { '@type': 'Organization', name: COMPANY.name, sameAs: COMPANY.url },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Gurugram', addressRegion: 'Haryana', addressCountry: 'IN' } },
    applicantLocationRequirements: { '@type': 'Country', name: 'India' },
    industry: 'Information Technology & Services',
  })),
};

export default function CareersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }} />
      <CareersClient />
    </>
  );
}

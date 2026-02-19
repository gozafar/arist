import ContactClient from '@/components/ContactClient';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { buildSeoMetadata, getCountryConfig, getCountryFromHeaders } from '@/lib/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  const country = getCountryFromHeaders(await headers());
  const config = getCountryConfig(country);
  const title = `Contact Rakhi's Studio Gallery | ${config.label}`;
  const description = `Reach out for original paintings, commissions, or worldwide shipping to ${config.label}.`;

  return buildSeoMetadata({
    path: '/contact',
    title,
    description,
    keywords: ['contact art gallery', 'commission original art', 'international art shipping'],
    country,
    ogTitle: `Contact the Art Gallery – ${config.label}`,
    ogDescription: `Talk to our curator about originals, commissions, and secure delivery to ${config.label}.`,
  });
};

const ContactPage = () => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Do you ship paintings internationally?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':
            'Yes. We ship worldwide with insurance, tracking, and customs guidance for UAE, India, USA, and Hong Kong.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Are the paintings certified originals?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Every artwork includes an artist-signed certificate of authenticity and provenance details.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How long does delivery take?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':
            'Most international orders ship within 7–10 business days depending on size, framing, and destination.',
        },
      },
    ],
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ContactClient />
    </>
  );
};

export default ContactPage;

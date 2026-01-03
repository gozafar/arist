import HomeClient from '@/components/HomeClient';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { buildSeoMetadata, getCountryConfig, getCountryFromHeaders, siteUrl } from '@/lib/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  const country = getCountryFromHeaders(await headers());
  const config = getCountryConfig(country);
  const title = `Buy Original Paintings Online | ${config.label}`;
  const description = `Shop certified original paintings with worldwide shipping and secure payments for collectors in ${config.label}.`;

  return buildSeoMetadata({
    path: '/',
    title,
    description,
    keywords: ['original paintings online', 'international art marketplace', 'buy wall art'],
    country,
    ogTitle: `Buy Original Paintings Online – ${config.label}`,
    ogDescription: `Trusted online art gallery serving collectors across ${config.label} and worldwide.`,
  });
};

const HomePage = () => {
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Review',
        'reviewBody':
          'The curation feels museum-grade. Each piece has depth and soul, with colors that transform the room without overpowering it.',
        'author': { '@type': 'Person', 'name': 'Rina Mehta' },
        'itemReviewed': { '@type': 'Organization', 'name': 'Rakhi Studio', 'url': siteUrl },
      },
      {
        '@type': 'Review',
        'reviewBody':
          'We commissioned a large abstract for our lobby; it has become the quiet centerpiece guests can’t stop asking about.',
        'author': { '@type': 'Person', 'name': 'David Lau' },
        'itemReviewed': { '@type': 'Organization', 'name': 'Rakhi Studio', 'url': siteUrl },
      },
      {
        '@type': 'Review',
        'reviewBody':
          'Standing in front of these canvases feels like taking a slow breath—calming, intentional, and beautifully detailed.',
        'author': { '@type': 'Person', 'name': 'Priya Nair' },
        'itemReviewed': { '@type': 'Organization', 'name': 'Rakhi Studio', 'url': siteUrl },
      },
    ],
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <HomeClient />
    </>
  );
};

export default HomePage;

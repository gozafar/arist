import type { Metadata } from 'next';

export const siteUrl =
  (process.env.NEXT_PUBLIC_CLIENT_BASE_URL || process.env.NEXT_PUBLIC_SERVER_BASE_URL || '').replace(/\/$/, '') ||
  'https://artistry-gallery.com';

export const defaultKeywords = [
  'Artistry gallery',
  'online painting gallery',
  'buy original art',
  'modern art shop',
  'abstract paintings',
  'fine art',
  'wall art',
  'canvas art online',
  'luxury art',
];

export const defaultDescription =
  'Artistry is a modern online painting gallery featuring curated originals, luminous abstracts, and statement pieces for refined spaces.';

export const defaultOgImage =
  'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80';

export type CountryCode = 'US' | 'IN' | 'AE' | 'HK';

const countryConfig: Record<
  CountryCode,
  {
    label: string;
    hreflang: string;
    ogLocale: string;
    region: string;
    geoPosition: string;
    keywords: string[];
  }
> = {
  US: {
    label: 'USA',
    hreflang: 'en-US',
    ogLocale: 'en_US',
    region: 'US',
    geoPosition: '37.0902;-95.7129',
    keywords: ['buy art in USA', 'US art collectors', 'luxury wall art USA', 'original paintings USA'],
  },
  IN: {
    label: 'India',
    hreflang: 'en-IN',
    ogLocale: 'en_IN',
    region: 'IN',
    geoPosition: '20.5937;78.9629',
    keywords: ['buy art in India', 'Indian art collectors', 'original paintings India', 'Indian wall art'],
  },
  AE: {
    label: 'UAE',
    hreflang: 'en-AE',
    ogLocale: 'en_AE',
    region: 'AE',
    geoPosition: '23.4241;53.8478',
    keywords: ['buy art in UAE', 'Dubai art gallery', 'luxury wall art UAE', 'original paintings Dubai'],
  },
  HK: {
    label: 'Hong Kong',
    hreflang: 'en-HK',
    ogLocale: 'en_HK',
    region: 'HK',
    geoPosition: '22.3193;114.1694',
    keywords: ['buy art in Hong Kong', 'HK art collectors', 'original paintings Hong Kong', 'wall art HK'],
  },
};

type HeaderLike = { get: (name: string) => string | null };

export const getCountryFromHeaders = (headers: HeaderLike): CountryCode => {
  const raw =
    headers.get('x-vercel-ip-country') ||
    headers.get('x-country') ||
    headers.get('x-geo-country') ||
    headers.get('cf-ipcountry') ||
    'US';
  const code = raw.toUpperCase();
  if (code === 'IN' || code === 'AE' || code === 'HK') return code;
  return 'US';
};

export const getCountryConfig = (country: CountryCode) => countryConfig[country];

export const getLangForCountry = (country: CountryCode) => countryConfig[country].hreflang;

export const buildCountryUrl = (path: string, country: CountryCode) =>
  `${siteUrl}${path}${path.includes('?') ? '&' : '?'}region=${country}`;

export const buildHreflangAlternates = (path: string) => ({
  'en-US': buildCountryUrl(path, 'US'),
  'en-IN': buildCountryUrl(path, 'IN'),
  'en-AE': buildCountryUrl(path, 'AE'),
  'en-HK': buildCountryUrl(path, 'HK'),
});

export const buildSeoMetadata = ({
  path,
  title,
  description,
  keywords,
  country,
  ogTitle,
  ogDescription,
  ogType = 'website',
  ogImage = defaultOgImage,
}: {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  country: CountryCode;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
}): Metadata => {
  const config = getCountryConfig(country);
  const canonical = buildCountryUrl(path, country);
  const ogTitleValue = ogTitle || title;
  const ogDescriptionValue = ogDescription || description;

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...config.keywords, ...keywords],
    alternates: {
      canonical,
      languages: buildHreflangAlternates(path),
    },
    openGraph: {
      title: ogTitleValue,
      description: ogDescriptionValue,
      url: canonical,
      siteName: 'Artistry Gallery',
      locale: config.ogLocale,
      type: ogType,
      images: ogImage ? [{ url: ogImage, alt: ogTitleValue }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitleValue,
      description: ogDescriptionValue,
      images: ogImage ? [ogImage] : undefined,
    },
    other: {
      'geo.region': config.region,
      'geo.placename': config.label,
      'geo.position': config.geoPosition,
      'ICBM': config.geoPosition,
    },
  };
};

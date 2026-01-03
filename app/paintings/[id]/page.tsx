import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import type { PaintingDTO } from '@/lib/dto';
import { buildSeoMetadata, getCountryConfig, getCountryFromHeaders, siteUrl } from '@/lib/seo';
import { endpoints } from '@/lib/api/endpoints';
import PhotoPreview from '@/components/PhototPreview';

type PaintingResponse = PaintingDTO;

async function fetchPainting(id: string): Promise<PaintingResponse | null> {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const endpoint =
      typeof endpoints.paintings.detail === 'function'
        ? endpoints.paintings.detail(id)
        : `${endpoints.paintings.detail}/${id}`;

    const res = await fetch(`${base}${endpoint}`, {
      next: { tags: ['paintings'] },
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to load painting');

    return await res.json();
  } catch (error) {
    console.error('Error fetching painting:', error);
    return null;
  }
}

export const generateMetadata = async ({ params }: { params: { id: string } }): Promise<Metadata> => {
  const country = getCountryFromHeaders(await headers());
  const config = getCountryConfig(country);
  const painting = await fetchPainting(params.id);
  if (!painting) {
    return { title: 'Painting not found', robots: { index: false } };
  }
  const title = `${painting.title} – ${painting.medium} | ${config.label}`;
  const description = `${painting.title} by Rakhi Vashisht. ${painting.medium}, ${painting.size}. Certified original available for collectors in ${config.label}.`;

  return buildSeoMetadata({
    path: `/paintings/${painting.id}`,
    title,
    description,
    keywords: [painting.title, painting.medium, painting.size, ...(painting.tags ?? [])],
    country,
    ogImage: painting.image,
  });
};

const PaintingDetailPage = async ({ params }: { params: { id: string } }) => {
  const painting = await fetchPainting(params.id);
  if (!painting) {
    notFound();
  }
  const isSold = painting.availability === 'sold';
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${siteUrl}/` },
      { '@type': 'ListItem', 'position': 2, 'name': 'Paintings', 'item': `${siteUrl}/paintings` },
      { '@type': 'ListItem', 'position': 3, 'name': painting.title, 'item': `${siteUrl}/paintings/${painting.id}` },
    ],
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': painting.title,
    'image': [painting.image],
    'description': `${painting.title} - ${painting.medium}, ${painting.size}. Original artwork with certificate of authenticity.`,
    'brand': 'Rakhi Studio',
    'sku': painting.id,
    'category': painting.medium,
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'USD',
      'price': painting.price,
      'availability': isSold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      'url': `${siteUrl}/paintings/${painting.id}`,
    },
  };

  return (
    <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className='grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start'>
        <PhotoPreview galleryId={`painting-${painting.id}`}>
          <div className='card-glass relative mx-auto w-full max-w-[520px] overflow-hidden rounded-[20px] border border-white/10'>
            <div className='relative aspect-square overflow-hidden'>
              <a
                href={painting.image}
                data-pswp-width={painting.imageWidth ?? 2000}
                data-pswp-height={painting.imageHeight ?? 2000}
                className='block h-full w-full cursor-zoom-in'
              >
                <Image
                  src={painting.image}
                  alt={`${painting.title} by Rakhi Vashisht – ${painting.medium}`}
                  fill
                  className='object-cover'
                  sizes='(max-width: 640px) 90vw, 320px'
                  loading='lazy'
                />
              </a>
            </div>
          </div>
        </PhotoPreview>

        <div className='space-y-8'>
          {/* HEADER */}
          <div className='space-y-3'>
            <p className='text-sm uppercase tracking-[0.3em] text-white/60'>Painting details</p>

            <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display'>{painting.title}</h1>
          </div>

          {/* META GRID */}
          <div className='grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm'>
            <Info label='Year' value={painting.year.toString()} />
            <Info label='Medium' value={painting.medium} />
            <Info label='Size' value={painting.size} />
            <Info label='Tags' value={painting.tags.join(', ')} />
            <Info label='Availability' value={isSold ? 'Sold' : 'In stock'} />
          </div>

          {/* PRICE & ACTIONS */}
          <div className='flex flex-wrap items-center gap-4'>
            <p className='text-3xl font-semibold text-sand-700'>${painting.price.toLocaleString()}</p>

            <AddToCartButton painting={painting} disabled={isSold} />

            <Link href='/paintings' className='button-outline'>
              Back to gallery
            </Link>
          </div>

          <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-black/70'>
            {painting.description}
          </div>
          {/* SHIPPING NOTE */}
          <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-black/70'>
            Ships worldwide in museum-grade crates. Includes certificate of authenticity and full provenance
            documentation.
          </div>

          {/* COLLECTOR NOTES */}
          <div className='space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5'>
            <h2 className='text-base font-semibold text-white'>Collector notes</h2>

            <p className='text-sm leading-relaxed text-black/70'>
              Ideal for luxury residences and curated hospitality spaces in the UAE and USA, with investment-grade
              appeal for collectors worldwide.
            </p>

            <h3 className='text-sm font-semibold text-white'>Shipping &amp; authenticity</h3>

            <p className='text-sm leading-relaxed text-black/70'>
              Fully insured delivery with customs guidance. All originals ship with artist-signed certificates and
              professional handling instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className='text-black/50'>{label}</p>
    <p className='mt-1 font-semibold text-white'>{value}</p>
  </div>
);

export default PaintingDetailPage;

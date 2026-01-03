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
    const base = process.env.NEXT_PUBLIC_CLIENT_BASE_URL || '';
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

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
  const country = getCountryFromHeaders(await headers());
  const config = getCountryConfig(country);
  const painting = await fetchPainting((await params).id);
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
console.log('Painting details:');

const PaintingDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const painting = await fetchPainting(resolvedParams.id);

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
        <div className='flex flex-col space-y-6'>
          <PhotoPreview galleryId={`painting-${painting.id}`}>
            <div className='relative mx-auto w-full max-w-full'>
              <div className='group relative overflow-hidden rounded-3xl bg-black shadow-2xl'>
                <div className='relative aspect-square'>
                  <a
                    href={painting.image}
                    data-pswp-width={painting.imageWidth ?? 2000}
                    data-pswp-height={painting.imageHeight ?? 2500}
                    className='block h-full w-full cursor-zoom-in'
                  >
                    <Image
                      src={painting.image}
                      alt={`${painting.title} by Rakhi Vashisht`}
                      fill
                      priority
                      className='object-cover transition-transform duration-700 group-hover:scale-105'
                    />
                  </a>
                </div>

                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />

                <span className='absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur'>
                  Click to zoom
                </span>
              </div>
            </div>
          </PhotoPreview>
          {/* SHIPPING NOTE */}

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

        <div className='space-y-6'>
          {/* HEADER */}
          <div className='space-y-3'>
            <p className='text-sm uppercase tracking-[0.3em] text-white/60'>Painting details</p>

            <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display'>{painting.title}</h1>
          </div>

          {/* META GRID */}
          <div className='flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm'>
            <MetaChip label='Year' value={painting.year.toString()} />
            <MetaChip label='Medium' value={painting.medium} />
            <MetaChip label='Size' value={painting.size} />
            <MetaChip label='Availability' value={isSold ? 'Sold' : 'In stock'} />

            {painting.tags.map(tag => (
              <span key={tag} className='rounded-full bg-white/10 px-3 py-1 text-white/70'>
                #{tag}
              </span>
            ))}
          </div>

          {/* PRICE & ACTIONS */}
          <div className='flex flex-wrap justify-between items-center gap-4'>
            <div className='flex items-center justify-between gap-3'>
              <p className='text-4xl font-bold text-black/80'>${painting.price.toLocaleString()}</p>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isSold ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-700'
                }`}
              >
                {isSold ? 'Sold out' : 'Available'}
              </span>
            </div>

            <div className='flex gap-3'>
              <AddToCartButton painting={painting} disabled={isSold} />

              <Link href='/paintings' className='button-outline'>
                Back to gallery
              </Link>
            </div>
          </div>

          <div className='space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5'>
            <h2 className='text-base font-semibold text-white'>Description</h2>

            <p className='text-sm leading-relaxed text-black/70'>{painting.description}</p>
          </div>
          <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-black/70'>
            Ships worldwide in museum-grade crates. Includes certificate of authenticity and full provenance
            documentation.
          </div>
        </div>
      </div>
    </div>
  );
};

const MetaChip = ({ label, value }: { label: string; value: string }) => (
  <span className='flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-black/80'>
    <span className='opacity-60'>{label}:</span>
    <span className='font-medium'>{value}</span>
  </span>
);

export default PaintingDetailPage;

'use client';

import PaintingCard from '@/components/PaintingCard';
import Link from 'next/link';
import { usePaintings } from '@/context/PaintingContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import { Suspense, useMemo, useState } from 'react';
import ImageModal from '@/components/ImageModal';
import type { PaintingDTO } from '@/lib/dto';

const PaintingsContent = () => {
  const { paintings, loaded } = usePaintings();
  const PAGE_SIZE = 10;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState<PaintingDTO | null>(null);

  const currentPage = useMemo(() => {
    const pageParam = Number(searchParams.get('page') || '1');
    return Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  }, [searchParams]);

  const totalPages = Math.max(1, Math.ceil(paintings.length / PAGE_SIZE));
  const clampedPage = Math.min(currentPage, totalPages);
  const start = (clampedPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const visible = paintings.slice(start, end);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/paintings?${params.toString()}`);
  };

  return (
    <>
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {visible.map(painting => (
          <div key={painting.id}>
            <PaintingCard painting={painting} onImageClick={() => setSelectedImage(painting)} />
          </div>
        ))}

        {!visible.length && !loaded && <p className='col-span-full text-white/70'>Loading paintings…</p>}

        {!visible.length && loaded && <p className='col-span-full text-white/70'>No paintings found.</p>}
      </div>

      <Pagination
        total={paintings.length}
        perPage={PAGE_SIZE}
        currentPage={clampedPage}
        onPageChange={handlePageChange}
      />

      {/* IMAGE MODAL */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageSrc={selectedImage.image}
          imageWidth={selectedImage.width}
          imageHeight={selectedImage.height}
          title={selectedImage.title}
        />
      )}
    </>
  );
};

const PaintingsClient = () => {
  return (
    <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16'>
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
        <div className='space-y-2'>
          <p className='text-sm uppercase tracking-[0.3em] text-white/60'>Available works</p>
          <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display'>Paintings</h1>
          <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
            Shop original wall art curated for collectors in the UAE, India, USA, and Hong Kong. Each piece is sealed,
            certified, and ready to hang with worldwide shipping.
          </p>
        </div>
        <div className='flex gap-3 text-sm text-black/6 lg:mt-7'>
          <span className='rounded-full bg-white/5 px-4 py-2'>Originals</span>
          <span className='rounded-full bg-white/5 px-4 py-2'>Worldwide shipping</span>
        </div>
      </div>

      <section id='categories' className='mb-10 space-y-4'>
        <h1 className='text-2xl md:text-2xl font-semibold text-white font-display'>Explore by category</h1>
        <div className='grid gap-6 md:grid-cols-2'>
          <div className='card-glass rounded-2xl p-5'>
            <h3 className='text-xl font-semibold text-white font-display mb-1'>Abstract Paintings</h3>
            <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[14px]'>
              Layered, expressive works that bring energy and movement to modern interiors in Dubai, Mumbai, New York,
              and Hong Kong.
            </p>
          </div>
          <div className='card-glass rounded-2xl p-5'>
            <h3 className='text-xl font-semibold text-white font-display mb-1'>Modern Art</h3>
            <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[14px]'>
              Contemporary compositions with bold palettes, ideal for luxury homes, offices, and boutique hospitality.
            </p>
          </div>
          <div className='card-glass rounded-2xl p-5'>
            <h3 className='text-xl font-semibold text-white font-display mb-1'>Traditional Art</h3>
            <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[14px]'>
              Culturally rooted narratives and classic techniques that resonate with global collectors and heritage
              spaces.
            </p>
          </div>
          <div className='card-glass rounded-2xl p-5'>
            <h3 className='text-xl font-semibold text-white font-display mb-1'>Canvas &amp; Wall Art</h3>
            <p className='max-w-2xl text-sm leading-relaxed text-black/70 md:text-[14px]'>
              Museum-grade canvases designed to elevate living rooms, entryways, and curated gallery walls worldwide.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<p className='text-white/70'>Loading paintings…</p>}>
        <PaintingsContent />
      </Suspense>
      <div className='mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70'>
        Looking for buying guidance? Visit the{' '}
        <Link className='underline' href='/blog'>
          Art Insights blog
        </Link>{' '}
        for collector tips.
      </div>
    </div>
  );
};

export default PaintingsClient;

'use client';

import PaintingCard from '@/components/PaintingCard';
import Link from 'next/link';
import { usePaintings } from '@/context/PaintingContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import { Suspense, useMemo, useState } from 'react';
import ImageModal from '@/components/ImageModal';
import type { PaintingDTO } from '@/lib/dto';
import { FiSearch } from 'react-icons/fi';

const formatCategoryLabel = (value?: string) =>
  (value || 'Uncategorized')
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = (searchParams.get('search') || '').trim();

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          paintings
            .map(painting => painting.categoryName)
            .filter((categoryName): categoryName is string => Boolean(categoryName))
        )
      ).sort((a, b) => formatCategoryLabel(a).localeCompare(formatCategoryLabel(b))),
    [paintings]
  );

  const filteredPaintings = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();

    return paintings.filter(painting => {
      const matchesCategory = !selectedCategory || painting.categoryName === selectedCategory;
      if (!matchesCategory) return false;

      if (!normalizedQuery) return true;

      const haystack = [
        painting.title,
        painting.medium,
        painting.size,
        painting.description,
        painting.year?.toString(),
        painting.categoryName,
        ...(painting.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [paintings, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredPaintings.length / PAGE_SIZE));
  const clampedPage = Math.min(currentPage, totalPages);
  const start = (clampedPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const visible = filteredPaintings.slice(start, end);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    params.delete('page');
    const nextQuery = params.toString();
    router.replace(nextQuery ? `/paintings?${nextQuery}` : '/paintings');
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/paintings?${params.toString()}`);
  };

  return (
    <>
      <section id='categories' className='mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 space-y-5'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div className='space-y-2'>
            <h2 className='text-2xl font-semibold text-white font-display'>Search &amp; Filter</h2>
            <p className='max-w-2xl text-sm leading-relaxed text-black/70'>
              Find paintings by title, medium, year, tags, or narrow the collection by category.
            </p>
          </div>

          <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:max-w-3xl'>
            <div className='relative w-full sm:flex-1 sm:min-w-[320px] lg:min-w-[460px]'>
              <FiSearch className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45' />
              <input
                type='search'
                value={searchQuery}
                onChange={event => updateParams({ search: event.target.value.trim() || null })}
                placeholder='Search paintings, medium, year, or tag'
                className='h-12 w-full rounded-xl border border-white/10 bg-black/10 pl-11 pr-4 text-sm text-black placeholder:text-black/40 outline-none transition focus:border-white/25 focus:bg-black/15'
                aria-label='Search paintings'
              />
            </div>
            {/* <select
              value={selectedCategory}
              onChange={event => updateParams({ category: event.target.value || null })}
              className='h-12 w-full rounded-xl border border-white/10 bg-black/10 px-4 text-sm text-white outline-none transition focus:border-white/25 focus:bg-black/15 sm:w-[260px]'
              aria-label='Filter paintings by category'
            >
              <option value=''>All categories</option>
              {categories.map(category => (
                <option key={category} value={category} className='text-black'>
                  {formatCategoryLabel(category)}
                </option>
              ))}
            </select> */}
          </div>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center justify-between gap-3'>
            <p className='text-xs font-semibold uppercase tracking-[0.25em] text-white/55'>Filter By Category</p>
            {(selectedCategory || searchQuery) && (
              <button
                type='button'
                onClick={() => updateParams({ category: null, search: null })}
                className='text-sm text-white/70 transition hover:text-white'
              >
                Clear filters
              </button>
            )}
          </div>

          <div className='hide-scrollbar flex gap-2 overflow-x-auto pb-1'>
            <button
              type='button'
              onClick={() => updateParams({ category: null })}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                !selectedCategory
                  ? 'border-white/30 bg-white text-black'
                  : 'border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:text-white'
              }`}
            >
              All categories
            </button>
            {categories.map(category => {
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  type='button'
                  onClick={() => updateParams({ category })}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                    isActive
                      ? 'border-white/30 bg-white text-black'
                      : 'border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {formatCategoryLabel(category)}
                </button>
              );
            })}
          </div>
        </div>

        <div className='flex flex-wrap gap-3 text-sm text-black/70'>
          <span className='rounded-full bg-black/10 px-4 py-2'>{filteredPaintings.length} works</span>
          {selectedCategory && (
            <span className='rounded-full bg-black/10 px-4 py-2'>{formatCategoryLabel(selectedCategory)}</span>
          )}
          {searchQuery && <span className='rounded-full bg-black/10 px-4 py-2'>Search: {searchQuery}</span>}
        </div>
      </section>

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
        total={filteredPaintings.length}
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

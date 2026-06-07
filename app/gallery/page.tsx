'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { GetGallery } from '@/lib/api/admin';
import Image from 'next/image';
import ImageModal from '@/components/ImageModal';

type GalleryName = 'Contemporary / Modern Art' | 'Portrait Paintings' | 'Landscape Paintings' | 'Abstract Art';

const GALLERY_NAMES: GalleryName[] = [
  'Contemporary / Modern Art',
  'Portrait Paintings',
  'Landscape Paintings',
  'Abstract Art',
] as const;

interface GalleryImage {
  _id: string;
  imageId?: string;
  url: string;
  name: string;
  galleryName?: string;
  createdAt?: string;
  [key: string]: string | undefined;
}

interface Gallery {
  _id: string;
  name: string;
  imageIds: GalleryImage[];
  createdAt: string;
  updatedAt?: string;
}

const GALLERY_SCROLL_STEP = 360;

const getGalleryOrder = (galleryName?: string) => {
  const index = GALLERY_NAMES.indexOf(galleryName as GalleryName);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const getTimeValue = (value?: string) => {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const sortImages = (images: GalleryImage[]) =>
  [...images].sort((a, b) => {
    const dateDifference = getTimeValue(b.createdAt) - getTimeValue(a.createdAt);
    if (dateDifference !== 0) return dateDifference;

    const nameDifference = (a.name || '').localeCompare(b.name || '');
    if (nameDifference !== 0) return nameDifference;

    return (a._id || a.imageId || '').localeCompare(b._id || b.imageId || '');
  });

const sortGalleries = (galleryItems: Gallery[]) =>
  [...galleryItems].sort((a, b) => {
    const galleryDifference = getGalleryOrder(a.name) - getGalleryOrder(b.name);
    if (galleryDifference !== 0) return galleryDifference;

    const updatedDifference = getTimeValue(b.updatedAt) - getTimeValue(a.updatedAt);
    if (updatedDifference !== 0) return updatedDifference;

    return a.name.localeCompare(b.name);
  });

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageList, setImageList] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoScrollDirectionRef = useRef<'left' | 'right'>('right');

  const fetchGalleries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await GetGallery({ page: 1, limit: 100 }); // Fetch all galleries for client-side pagination

      if (res?.galleries) {
        setGalleries(res.galleries);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to load galleries:', err);
      setError('Failed to load galleries. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  useEffect(() => {
    if (selectedGallery) {
      const filtered = sortGalleries(galleries.filter(gallery => gallery.name === selectedGallery));
      setFilteredGalleries(filtered);
      const images = sortImages(
        (filtered[0]?.imageIds || []).map(img => ({
          ...img,
          galleryName: filtered[0]?.name,
          createdAt: (img as { createdAt?: string }).createdAt || filtered[0]?.createdAt,
        }))
      );
      setImageList(images);
    } else {
      const hardcodedFiltered = sortGalleries(
        galleries.filter(gallery => GALLERY_NAMES.includes(gallery.name as GalleryName))
      );
      setFilteredGalleries(hardcodedFiltered);

      const allImages = hardcodedFiltered.flatMap(gallery =>
        sortImages(
          gallery.imageIds.map(img => ({
            ...img,
            galleryName: gallery.name,
            createdAt: (img as { createdAt?: string }).createdAt || gallery.createdAt,
          }))
        )
      );
      setImageList(allImages);
    }
  }, [selectedGallery, galleries]);
  const hasHorizontalOverflow = imageList.length > 3;
  const scrollByCardSet = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: direction === 'right' ? GALLERY_SCROLL_STEP : -GALLERY_SCROLL_STEP,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    autoScrollDirectionRef.current = 'right';
    slider.scrollTo({ left: 0, behavior: 'auto' });
  }, [imageList.length, selectedGallery]);

  useEffect(() => {
    if (!hasHorizontalOverflow || selectedImage) return;

    const intervalId = window.setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      const currentLeft = slider.scrollLeft;
      const direction = autoScrollDirectionRef.current;

      if (maxScrollLeft <= 0) return;

      if (direction === 'right') {
        const nextLeft = Math.min(currentLeft + GALLERY_SCROLL_STEP, maxScrollLeft);
        slider.scrollTo({ left: nextLeft, behavior: 'smooth' });

        if (nextLeft >= maxScrollLeft - 4) {
          autoScrollDirectionRef.current = 'left';
        }
      } else {
        const nextLeft = Math.max(currentLeft - GALLERY_SCROLL_STEP, 0);
        slider.scrollTo({ left: nextLeft, behavior: 'smooth' });

        if (nextLeft <= 4) {
          autoScrollDirectionRef.current = 'right';
        }
      }
    }, 2200);

    return () => window.clearInterval(intervalId);
  }, [hasHorizontalOverflow, imageList.length, selectedImage]);

  if (loading) {
    return (
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {[...Array(6)].map((_, i) => (
          <div key={i} className='h-64 bg-white/5 animate-pulse rounded-2xl' />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-24'>
        <p className='text-red-400 mb-4'>{error}</p>
        <button
          onClick={fetchGalleries}
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-6xl px-4 py-14'>
      {/* HEADER */}
      <div className='mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6'>
        <div className='space-y-2'>
          <p className='text-sm uppercase tracking-[0.3em] text-white/60'>Collections</p>
          <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display'>Art Gallery</h1>
          <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
            Browse through our gallery collections. Page through to explore all available galleries.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-3 text-xs text-white/70 '>
          {/* <select
            value={selectedGallery}
            onChange={e => setSelectedGallery(e.target.value)}
            className='rounded-full bg-white/5 px-3 py-2 border border-white/10 focus:border-white/20 outline-none min-w-[150px] w-full sm:w-auto text-black/70'
            aria-label='Filter galleries'
            disabled={loading}
          >
            <option value=''>All Galleries</option>
            {GALLERY_NAMES.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select> */}
          <span className='rounded-full bg-white/5 px-4 py-2 text-black/70'>
            {filteredGalleries.length} collections
          </span>
          <span className='rounded-full bg-white/5 px-4 py-2 text-black/70'>{imageList.length} works</span>
        </div>
      </div>

      {/* HORIZONTAL GALLERY */}
      {imageList.length > 0 ? (
        <section className='space-y-6'>
          <div className='relative'>
            {hasHorizontalOverflow && (
              <>
                <button
                  type='button'
                  onClick={() => scrollByCardSet('left')}
                  className='absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/80 text-black shadow-md backdrop-blur transition hover:bg-white'
                  aria-label='Scroll gallery left'
                >
                  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                    <path
                      d='M15 18L9 12L15 6'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
                <button
                  type='button'
                  onClick={() => scrollByCardSet('right')}
                  className='absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/80 text-black shadow-md backdrop-blur transition hover:bg-white'
                  aria-label='Scroll gallery right'
                >
                  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                    <path
                      d='M9 18L15 12L9 6'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </>
            )}
            <div
              ref={sliderRef}
              className='hide-scrollbar flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth'
              aria-label='Scrollable gallery'
            >
              {imageList.map((item: GalleryImage) => (
                <article
                  key={item._id || item.imageId}
                  className='group relative flex w-[88%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:w-[48%] lg:w-[31%]'
                >
                  {/* IMAGE */}
                  <div className='relative aspect-[4/5] overflow-hidden bg-white/5'>
                    <div className='block h-full w-full cursor-zoom-in' onClick={() => setSelectedImage(item)}>
                      <Image
                        src={item.url}
                        alt={item.name || 'Artwork'}
                        fill
                        className='object-contain transition-transform duration-700 group-hover:scale-105'
                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                        quality={75}
                        priority={true}
                      />
                    </div>

                    {/* Hover overlay */}
                    <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                  </div>

                  {/* CONTENT: name only */}
                  {/* <div className='p-4'>
                    <h3 className='line-clamp-1 text-base font-semibold text-white'>{item.name || 'Untitled'}</h3>
                  </div> */}
                </article>
              ))}
            </div>
          </div>
          {hasHorizontalOverflow && (
            <p className='text-center text-xs text-black/60'>
              Auto-scroll is active every 3 seconds. Use arrow buttons to move left or right anytime.
            </p>
          )}
        </section>
      ) : (
        <div className='py-12 text-center'>
          <p className='text-white/60'>No artworks found.</p>

          {selectedGallery && (
            <button onClick={() => setSelectedGallery('')} className='mt-2 text-sm text-blue-400 hover:text-blue-300'>
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* IMAGE MODAL */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageSrc={selectedImage.url}
          imageWidth={selectedImage.width}
          imageHeight={selectedImage.height}
          title={selectedImage.name || 'Artwork'}
        />
      )}
    </div>
  );
}

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
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageList, setImageList] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

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
      const filtered = galleries.filter(gallery => gallery.name === selectedGallery);
      setFilteredGalleries(filtered);
      const images = filtered[0]?.imageIds || [];
      setImageList(images);
    } else {
      const hardcodedFiltered = galleries.filter(gallery => GALLERY_NAMES.includes(gallery.name as GalleryName));
      setFilteredGalleries(hardcodedFiltered);

      const allImages = hardcodedFiltered.flatMap(gallery =>
        gallery.imageIds.map(img => ({
          ...img,
          galleryName: gallery.name,
          createdAt: (img as { createdAt?: string }).createdAt || gallery.createdAt,
        }))
      );
      setImageList(allImages);
    }
  }, [selectedGallery, galleries]);
  const hasHorizontalOverflow = imageList.length > 3;
  const scrollByCardSet = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const viewportWidth = sliderRef.current.clientWidth;
    const distance = Math.max(viewportWidth * 0.9, 240);
    sliderRef.current.scrollBy({
      left: direction === 'right' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!hasHorizontalOverflow || selectedImage) return;

    const intervalId = window.setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const distance = Math.max(slider.clientWidth * 0.9, 240);
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      const nextLeft = slider.scrollLeft + distance;

      if (nextLeft >= maxScrollLeft - 4) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollTo({ left: nextLeft, behavior: 'smooth' });
      }
    }, 3000);

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
          <select
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
          </select>
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
                  <div className='relative aspect-square overflow-hidden'>
                    <div className='block h-full w-full cursor-zoom-in' onClick={() => setSelectedImage(item)}>
                      <Image
                        src={item.url}
                        alt={item.name || 'Artwork'}
                        fill
                        className='object-cover transition-transform duration-700 group-hover:scale-105'
                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                        quality={75}
                        priority={true}
                      />
                    </div>

                    {/* Hover overlay */}
                    <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                  </div>

                  {/* CONTENT: name only */}
                  <div className='p-4'>
                    <h3 className='line-clamp-1 text-base font-semibold text-white'>{item.name || 'Untitled'}</h3>
                  </div>
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

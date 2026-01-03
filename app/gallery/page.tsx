'use client';

import { useEffect, useState, useMemo } from 'react';
import { GetGallery } from '@/lib/api/admin';
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import PhotoPreview from '@/components/PhototPreview';

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

  const PAGE_SIZE = 12;

  // Pagination state similar to paintings
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination values
  const totalPages = useMemo(() => Math.max(1, Math.ceil(imageList.length / PAGE_SIZE)), [imageList.length]);
  const clampedPage = useMemo(() => Math.min(currentPage, totalPages), [currentPage, totalPages]);
  const start = useMemo(() => (clampedPage - 1) * PAGE_SIZE, [clampedPage]);
  const end = useMemo(() => start + PAGE_SIZE, [start]);
  const visibleImages = useMemo(() => imageList.slice(start, end), [imageList, start, end]);

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    if (selectedGallery) {
      const filtered = galleries.filter(gallery => gallery.name === selectedGallery);
      setFilteredGalleries(filtered);
      const images = filtered[0]?.imageIds || [];
      setImageList(images);
      setCurrentPage(1); // Reset to page 1 when gallery changes
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
      setCurrentPage(1); // Reset to page 1 when gallery changes
    }
  }, [selectedGallery, galleries]);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const res = await GetGallery({ page: 1, limit: 100 }); // Fetch all galleries for client-side pagination

      if (res?.galleries) {
        setGalleries(res.galleries);

        // Extract images from galleries based on selection
        let images: GalleryImage[] = [];
        if (selectedGallery) {
          const filtered = res.galleries.filter(gallery => gallery.name === selectedGallery);
          images = filtered[0]?.imageIds || [];
        } else {
          const hardcodedFiltered = res.galleries.filter(gallery =>
            GALLERY_NAMES.includes(gallery.name as GalleryName)
          );
          images = hardcodedFiltered.flatMap(gallery =>
            gallery.imageIds.map(img => ({
              ...img,
              galleryName: gallery.name,
              createdAt: (img as GalleryImage).createdAt || gallery.createdAt,
            }))
          );
        }

        setImageList(images);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to load galleries:', err);
      setError('Failed to load galleries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

      {/* GALLERY GRID */}
      {visibleImages.length > 0 ? (
        <section className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {visibleImages.map((item: GalleryImage) => (
            <PhotoPreview key={item._id || item.imageId} galleryId={`painting-${item._id || item.imageId}`}>
              <article className='group relative flex flex-col overflow-hidden rounded-3xl bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
                {/* IMAGE */}
                <div className='relative aspect-square overflow-hidden'>
                  <a
                    href={item.url}
                    data-pswp-width={item.width ?? 2000}
                    data-pswp-height={item.height ?? 2000}
                    className='block h-full w-full cursor-zoom-in'
                  >
                    <Image
                      src={item.url}
                      alt={item.name || 'Artwork'}
                      fill
                      className='object-cover transition-transform duration-700 group-hover:scale-105'
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      quality={80}
                    />
                  </a>

                  {/* Hover overlay */}
                  <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

                  {/* Quick view badge */}
                  <span className='pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur'>
                    View artwork
                  </span>
                </div>

                {/* CONTENT */}
                <div className='flex flex-1 flex-col gap-1 p-4'>
                  <h3 className='line-clamp-1 text-base font-semibold text-white'>{item.name || 'Untitled'}</h3>

                  {item.galleryName && <p className='text-xs text-black/80'>{item.galleryName}</p>}

                  <p className='text-xs text-black/70'>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Date not available'}
                  </p>

                  {/* FOOTER */}
                  <div className='mt-auto pt-4'>
                    <button className='w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/20'>
                      View details
                    </button>
                  </div>
                </div>
              </article>
            </PhotoPreview>
          ))}
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

      {/* PAGINATION */}
      {imageList.length > 0 && (
        <Pagination
          total={imageList.length}
          perPage={PAGE_SIZE}
          currentPage={clampedPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

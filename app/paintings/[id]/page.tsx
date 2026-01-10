'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import type { PaintingDTO } from '@/lib/dto';
import { endpoints } from '@/lib/api/endpoints';
import PhotoPreview from '@/components/PhototPreview';
import PaintingDescription from '@/components/PaintingDescription';
import ImageModal from '@/components/ImageModal';

type PaintingResponse = PaintingDTO;

const PaintingDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = React.use(params);
  const [painting, setPainting] = useState<PaintingDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPainting = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_CLIENT_BASE_URL || '';
        const endpoint =
          typeof endpoints.paintings.detail === 'function'
            ? endpoints.paintings.detail(resolvedParams.id)
            : `${endpoints.paintings.detail}/${resolvedParams.id}`;

        const res = await fetch(`${base}${endpoint}`, {
          next: { tags: ['paintings'] },
        });

        if (res.status === 404) return null;
        if (!res.ok) throw new Error('Failed to load painting');

        const data = await res.json();
        setPainting(data);
      } catch (error) {
        console.error('Error fetching painting:', error);
        setError('Failed to load painting. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPainting();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16'>
        <div className='animate-pulse space-y-4'>
          <div className='h-96 bg-white/5 rounded-3xl' />
          <div className='h-8 bg-white/5 rounded-lg w-1/2' />
          <div className='h-4 bg-white/5 rounded-lg w-1/3' />
        </div>
      </div>
    );
  }

  if (error || !painting) {
    return (
      <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16 text-center'>
        <p className='text-red-400 mb-4'>{error || 'Painting not found'}</p>
        <Link href='/paintings' className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'>
          Back to gallery
        </Link>
      </div>
    );
  }

  const isSold = painting.availability === 'sold';

  return (
    <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16'>
      <div className='grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start'>
        <div className='flex flex-col space-y-6'>
          <div className='relative mx-auto w-full max-w-full'>
            <div className='group relative overflow-hidden rounded-3xl bg-black shadow-2xl'>
              <div className='relative aspect-square'>
                <div className='block h-full w-full cursor-zoom-in' onClick={() => setIsModalOpen(true)}>
                  <Image
                    src={painting.image}
                    alt={`${painting.title} by Rakhi Vashisht`}
                    fill
                    priority
                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                  />
                </div>
              </div>

              <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
            </div>
          </div>{' '}
          {/* SHIPPING NOTE */}
          {/* COLLECTOR NOTES */}
          <div className=' rounded-2xl border border-white/10 bg-white/5 p-5'>
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

        <div>
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

            <div className='h-80 overflow-y-auto'>
              <PaintingDescription description={painting.description} />
            </div>
          </div>
          <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-black/70'>
            Ships worldwide in museum-grade crates. Includes certificate of authenticity and full provenance
            documentation.
          </div>

          {/* IMAGE MODAL */}
          {isModalOpen && (
            <ImageModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              imageSrc={painting.image}
              title={painting.title}
            />
          )}
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

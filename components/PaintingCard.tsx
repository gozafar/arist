'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { PaintingDTO } from '@/lib/dto';
import Button from './Button';
import { useRouter } from 'next/navigation';
import PhotoPreview from './PhototPreview';

const PaintingCard = ({ painting }: { painting: PaintingDTO }) => {
  const router = useRouter();
  const isSold = painting.availability === 'sold';

  return (
    <article className='group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
      {/* IMAGE */}
      <PhotoPreview galleryId={`painting-${painting.id}`}>
        <div className='relative aspect-square overflow-hidden'>
          <a
            href={painting.image}
            data-pswp-width={painting.imageWidth ?? 2000}
            data-pswp-height={painting.imageHeight ?? 2500}
            data-caption={`${painting.imageWidth ?? 2000} × ${painting.imageHeight ?? 2000} px`}
          >
            <Image
              src={painting.image}
              alt={`${painting.title} original painting`}
              fill
              priority={false}
              className='object-cover transition-transform duration-700 group-hover:scale-105'
            />
          </a>

          {/* Gradient overlay */}
          <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />

          {/* Availability badge */}
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium backdrop-blur ${
              isSold ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-700'
            }`}
          >
            {isSold ? 'Sold' : 'Available'}
          </span>
        </div>
      </PhotoPreview>

      {/* CONTENT */}
      <div className='flex flex-1 flex-col gap-2 p-4'>
        {/* TITLE */}
        <div className='space-y-1'>
          <h3 className='line-clamp-1 text-lg font-semibold text-white'>{painting.title}</h3>

          <p className='text-sm text-white/60'>
            {painting.medium} · {painting.year}
          </p>
        </div>

        {/* DESCRIPTION */}
        <p className='line-clamp-3 text-sm leading-relaxed text-white/70'>{painting.description}</p>

        {/* FOOTER */}
        <div className='mt-auto space-y-3 pt-4'>
          <div className='flex items-center justify-between'>
            <p className='text-xl font-bold text-sand-600'>${painting.price.toLocaleString()}</p>
          </div>

          <div className='flex gap-2 items-center'>
            <Link
              href={`/paintings/${painting.id}`}
              className='flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-center text-xs font-medium text-white transition hover:bg-white/20'
            >
              View
            </Link>

            <Button
              onClick={() => router.push(`/paintings/${painting.id}/PaintingOrder`)}
              disabled={isSold}
              className={`flex-1 text-xs ${isSold ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              {isSold ? 'Sold' : 'Contact'}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PaintingCard;

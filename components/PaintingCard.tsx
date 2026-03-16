'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { PaintingDTO } from '@/lib/dto';
import Button from './Button';
import { useRouter } from 'next/navigation';

const PaintingCard = ({ painting, onImageClick }: { painting: PaintingDTO; onImageClick?: () => void }) => {
  const router = useRouter();
  const isSold = painting.availability === 'sold';

  return (
    <article className='group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
      {/* IMAGE */}
      <div className='relative aspect-square overflow-hidden'>
        <div className='block h-full w-full cursor-zoom-in' onClick={onImageClick}>
          <Image
            src={painting?.image}
            alt={`${painting?.title || 'Painting'} original painting`}
            fill
            priority={false}
            className='object-cover transition-transform duration-700 group-hover:scale-105'
          />
        </div>

        {/* Gradient overlay */}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />

        {/* Availability badge */}
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm border ${
            isSold ? 'bg-red-500/30 text-[#fff] border-red-400/40' : 'bg-[#FFA501] text-[#fff] border-[#FFA501]'
          }`}
        >
          {isSold ? 'Sold' : 'Available'}
        </span>

        {/* Quick view button */}
        <button
          onClick={onImageClick}
          // className="absolute bottom-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200"
          aria-label='View artwork'
        >
          {/* <svg
            className="w-6 h-6"
            fill="none"
            stroke="black"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg> */}
        </button>
      </div>

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
        {/* <p className='line-clamp-3 text-sm leading-relaxed text-white/70'>{painting.description}</p> */}

        {/* FOOTER */}
        <div className='mt-auto space-y-3 pt-4'>
          <div className='flex items-center justify-between'>
            <p className='text-xl font-bold text-sand-600'>${painting?.price?.toLocaleString()}</p>
          </div>

          <div className='flex gap-2 items-center'>
            <Link
              onClick={() => console.log('Painting ID:', painting.id)}
              href={`/paintings/${painting.id}`}
              className='flex-1 rounded-xl border bg-white/10 px-4 py-3 text-center text-xs font-medium transition hover:bg-[#FFA501]/15'
              style={{ color: '#FFA501', borderColor: '#FFA501' }}
            >
              View
            </Link>

            <Button
              onClick={() => router.push(`/paintings/${painting.id}/PaintingOrder`)}
              disabled={isSold}
              className={`flex-1 text-xs ${isSold ? 'cursor-not-allowed opacity-60' : ''}`}
              style={{ backgroundColor: '#FFA501', borderColor: '#FFA501' }}
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

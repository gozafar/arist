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
    <div className='card-glass group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10'>
      {/* IMAGE */}
      <PhotoPreview galleryId={`painting-${painting.id}`}>
        <div className='relative aspect-square overflow-hidden w-full max-w-[450px]'>
          <a
            href={painting.image}
            data-pswp-width={painting.width ?? 2000}
            data-pswp-height={painting.height ?? 2500}
            data-caption={`${painting.width ?? 2000} × ${painting.height ?? 2000} px`}
          >
            <Image src={painting.image} alt={`${painting.title} original painting`} fill className='object-cover' />
          </a>

          {/* IMAGE OVERLAY */}
          <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent' />
        </div>
      </PhotoPreview>
      {/* CONTENT */}
      <div className='flex flex-1 flex-col gap-1 p-4'>
        {/* TITLE + META */}
        <div className='flex items-start justify-between gap-3'>
          <div className='space-y-1'>
            <h3 className=' font-bold text-lg leading-tight text-black/80'>{painting.title}</h3>
            <p className='text-sm text-black/60'>{painting.medium}</p>
          </div>

          <span className='shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-black/60'>{painting.year}</span>
        </div>

        {/* DESCRIPTION */}
        <p className='text-sm leading-relaxed text-black/70 line-clamp-3'>{painting.description}</p>

        {/* FOOTER */}
        <div className='mt-auto flex items-center justify-between pt-3'>
          <p className='text-lg font-semibold text-sand-800'>${painting.price.toLocaleString()}</p>

          <div className='flex gap-2'>
            <Link href={`/paintings/${painting.id}`} className='button-outline px-4 py-2 text-xs'>
              View
            </Link>

            <Button
              onClick={() => router.push(`/paintings/${painting.id}/PaintingOrder`)}
              disabled={isSold}
              className={isSold ? 'cursor-not-allowed opacity-60' : ''}
            >
              {isSold ? 'Sold' : 'Contact'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingCard;

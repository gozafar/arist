'use client';

import Link from 'next/link';
import PaintingUploadForm from '@/components/PaintingUploadForm';

const UploadPage = () => {
  return (
    <div className='mx-auto max-w-5xl px-4 py-12 lg:px-6 lg:py-16'>
      <div className='mb-8 flex items-center justify-between'>
        <div className='space-y-3'>
          <p className='text-sm uppercase tracking-[0.3em] text-white/60'>Artist upload</p>
          <h1 className='section-heading'>Add a new painting</h1>
          <p className='max-w-2xl text-white/70'>
            Frontend-only admin surface to quickly add works. Newly added paintings appear instantly in the gallery,
            detail pages, and cart flow.
          </p>
        </div>
        <Link href='/paintings' className='button-outline text-xs'>
          View gallery
        </Link>
      </div>
      <div className='card-glass rounded-3xl p-6'>
        <PaintingUploadForm />
      </div>
    </div>
  );
};

export default UploadPage;

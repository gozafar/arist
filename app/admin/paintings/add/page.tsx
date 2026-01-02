'use client';

import Link from 'next/link';
import AdminPaintingForm from '@/components/admin/AdminPaintingForm';
import { usePaintings } from '@/context/PaintingContext';

const AdminAddPaintingPage = () => {
  const { addPainting } = usePaintings();

  return (
    <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16'>
      <div className='mb-8 flex items-center justify-between'>
        <div className='space-y-2'>
          <p className='text-sm uppercase tracking-[0.3em] text-[rgb(161,44,116)]'>Admin · Paintings</p>
          <h1 className='section-heading text-[rgb(161,44,116)]'>Add a new painting</h1>
          <p className='text-slate-600'>Upload an artwork to publish it to the public gallery and checkout flow.</p>
        </div>
        <Link href='/admin/paintings' className='button-primary text-xs'>
          View list
        </Link>
      </div>
      <div className='card-glass rounded-3xl border border-[rgb(161,44,116)]/15 bg-white p-6'>
        <AdminPaintingForm onSubmit={addPainting} mode='create' />
      </div>
    </div>
  );
};

export default AdminAddPaintingPage;

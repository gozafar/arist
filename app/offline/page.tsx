import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Offline | Artistry Gallery',
  description: 'Offline fallback for Artistry Gallery.',
};

export default function OfflinePage() {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center'>
      <div className='max-w-xl space-y-2'>
        <h1 className='text-3xl font-semibold text-neutral-900'>Offline</h1>
        <p className='text-neutral-700'>You are offline. Please check your internet connection.</p>
        <p className='text-neutral-600'>
          Pages you visited recently stay available. You can keep browsing cached content or come back once you are
          connected again.
        </p>
      </div>
      <div className='flex gap-3'>
        <Link
          href='/'
          className='rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800'
        >
          Go home
        </Link>
        <a
          href=''
          className='rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-neutral-400'
        >
          Retry
        </a>
      </div>
    </div>
  );
}

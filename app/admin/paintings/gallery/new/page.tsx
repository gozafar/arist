'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import GalleryForm from '@/components/admin/GalleryForm';

export default function NewGalleryPage() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { name: string; images: File[]; imageNames: string[] }) => {
    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('name', data.name);
      data.images.forEach(image => {
        formData.append('images', image);
      });
      data.imageNames.forEach(name => {
        formData.append('imageNames', name);
      });

      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Gallery created successfully!');
        router.push('/admin/paintings/gallery?created=true');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || 'Failed to create gallery';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating gallery';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='mx-auto max-w-4xl px-4 py-12'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <p className='text-sm uppercase tracking-[0.3em] text-white/60'>Admin · Gallery</p>
          <h1 className='section-heading'>Add New Gallery</h1>
        </div>
        <button onClick={() => router.back()} className='text-xs text-white/70 hover:text-white'>
          Back
        </button>
      </div>

      {error && <p className='mb-4 text-center text-red-400'>{error}</p>}

      <div className='card-glass rounded-3xl border border-white/10 bg-white/5 p-6'>
        <GalleryForm onSubmit={handleSubmit} isLoading={submitting} />
      </div>
    </div>
  );
}

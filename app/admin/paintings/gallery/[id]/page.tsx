'use client';

import { useEffect, useState, use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { UpdateGallery, deleteGalleryImage } from '@/lib/api/admin';
import GalleryModal from '@/components/admin/GalleryModal';
import Image from 'next/image';

interface GalleryImage {
  _id: string;
  url: string;
  name: string;
}

interface GalleryData {
  _id: string;
  name: string;
  imageIds: GalleryImage[];
}

interface EditableImage {
  _id: string;
  name: string;
  url: string;
  file?: File;
  isDeleted?: boolean;
}

export default function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const galleryId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [galleryName, setGalleryName] = useState('');
  const [images, setImages] = useState<EditableImage[]>([]);
  // const [initialGalleryName, setInitialGalleryName] = useState("");
  const [initialImages, setInitialImages] = useState<EditableImage[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  // Create a dummy gallery object for GalleryModal with image deletion context
  const dummyGallery = useMemo(
    () => ({
      _id: imageToDelete || '',
      name: 'Image',
      imageIds: [{ _id: imageToDelete || '', url: '', name: 'Image' }], // Show 1 image
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [imageToDelete]
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const galleryParam = urlParams.get('gallery');

      if (galleryParam) {
        const galleryData: GalleryData = JSON.parse(decodeURIComponent(galleryParam));
        setGalleryName(galleryData.name);
        // setInitialGalleryName(galleryData.name);
        setImages(
          galleryData.imageIds.map((img: GalleryImage) => ({
            _id: img._id,
            name: img.name,
            url: img.url,
          }))
        );
        setInitialImages(
          galleryData.imageIds.map((img: GalleryImage) => ({
            _id: img._id,
            name: img.name,
            url: img.url,
          }))
        );
      } else {
        // No gallery data in URL params - show error or redirect
        toast.error('Gallery data not found');
        router.push('/admin/paintings/gallery');
        return;
      }
    } catch (err) {
      toast.error('Failed to load gallery');
      router.push('/admin/paintings/gallery');
    }
    setLoading(false);
  };

  const updateImageName = (id: string, value: string) => {
    setImages(prev => prev.map(img => (img._id === id ? { ...img, name: value } : img)));
  };

  const replaceImage = (id: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImages(prev => prev.map(img => (img._id === id ? { ...img, file, url: previewUrl } : img)));
  };

  const deleteImage = (id: string) => {
    setImageToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      // Delete image immediately from API
      await deleteGalleryImage(imageToDelete);

      // Remove from local state
      setImages(prev => prev.filter(img => img._id !== imageToDelete));
      setInitialImages(prev => prev.filter(img => img._id !== imageToDelete));

      toast.success('Image deleted successfully');
      setDeleteModalOpen(false);
      setImageToDelete(null);
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image');
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setImageToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const activeImages = images;

      if (activeImages.length === 0) {
        toast.error('At least one image is required');
        setSubmitting(false);
        return;
      }

      const hasNameErrors = activeImages.some(img => !img.name.trim());
      if (hasNameErrors) {
        toast.error('All images must have a name');
        setSubmitting(false);
        return;
      }

      const uniqueNames = new Set(activeImages.map(img => img.name.trim().toLowerCase()));
      if (uniqueNames.size !== activeImages.length) {
        toast.error('Image names must be unique');
        setSubmitting(false);
        return;
      }

      const imageDiffs = images
        .map(img => {
          const initial = initialImages.find(orig => orig._id === img._id);
          const nameChanged = initial?.name !== img.name;
          const replaced = Boolean(img.file);
          if (nameChanged || replaced) {
            return {
              _id: img._id,
              name: img.name.trim(),
              isDeleted: false,
            };
          }
          return null;
        })
        .filter(Boolean) as { _id: string; name: string; isDeleted: boolean }[];

      const hasImageChange = imageDiffs.length > 0;

      if (!hasImageChange) {
        toast.info('No changes to save');
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', galleryName); // Keep current gallery name

      if (hasImageChange) {
        formData.append('imagesMeta', JSON.stringify(imageDiffs));

        images.forEach(img => {
          if (img.file) {
            formData.append('replacedImages', img.file);
            formData.append('replacedImageIds', img._id);
          }
        });
      }

      await UpdateGallery(galleryId, formData);
      toast.success('Gallery updated');
      router.push('/admin/paintings/gallery?updated=true');
    } catch (err) {
      toast.error('Failed to update gallery');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className='text-center py-20'>Loading...</p>;
  }

  return (
    <div className='mx-auto max-w-6xl px-4 py-10 space-y-8'>
      <div className='flex flex-col gap-2'>
        <p className='text-xs uppercase tracking-[0.3em] text-white/50'>Admin · Gallery</p>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-3xl font-semibold text-white'>Edit Gallery</h1>
            <p className='text-white/70 mt-1'>
              Update the category and images. Changes save when you click “Update Gallery”.
            </p>
          </div>
          <span className='rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/70'>
            {images.length} image(s)
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='card-glass rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs uppercase tracking-[0.2em] text-white/50'>Details</p>
              <h2 className='text-lg font-semibold text-white'>Gallery Info</h2>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4'>
            <div>
              <label className='block text-sm text-white/70 mb-2'>Gallery Name</label>
              <div className='w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white/70'>
                {galleryName || 'Loading...'}
              </div>
              <p className='text-xs text-white/50 mt-1'>Gallery name cannot be changed</p>
            </div>
          </div>
        </div>

        <div className='card-glass rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs uppercase tracking-[0.2em] text-white/50'>Images</p>
              <h2 className='text-lg font-semibold text-white'>Manage Images</h2>
              <p className='text-xs text-white/60 mt-1'>Rename, replace, or remove existing images.</p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {images.map(img => {
              const fileInputId = `replace-${img._id}`;
              return (
                <div
                  key={img._id}
                  className='group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-sm transition hover:border-white/20'
                >
                  <div className='relative h-40 w-full'>
                    <Image
                      src={img.url}
                      alt={img.name}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, 33vw'
                      loading='lazy'
                      quality={75}
                      placeholder='blur'
                      blurDataURL='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YxZjFmMSIvPjwvc3ZnPg=='
                    />
                    <span className='absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[10px] uppercase tracking-[0.15em] !text-white'>
                      Existing
                    </span>
                  </div>
                  <div className='space-y-3 p-4'>
                    <div>
                      <label className='block text-xs text-white/60 mb-1'>Image Name</label>
                      <input
                        value={img.name}
                        onChange={e => updateImageName(img._id, e.target.value)}
                        className='w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-white/30'
                        placeholder='Image name'
                      />
                    </div>

                    <div className='flex items-center gap-2'>
                      <label
                        htmlFor={fileInputId}
                        className='flex-1 cursor-pointer rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/80 text-center transition hover:border-white/30'
                      >
                        Replace Image
                      </label>
                      <input
                        id={fileInputId}
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={e => e.target.files && replaceImage(img._id, e.target.files[0])}
                      />
                      <button
                        type='button'
                        onClick={() => deleteImage(img._id)}
                        className='rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/20'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4'>
          <button type='button' onClick={() => router.back()} disabled={submitting} className='button-outline text-sm'>
            Cancel
          </button>
          <button type='submit' disabled={submitting} className='button-primary px-6 py-2 text-sm'>
            {submitting ? 'Updating...' : 'Update Gallery'}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <GalleryModal
        gallery={dummyGallery}
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onDelete={confirmDeleteImage}
        mode='delete'
      />
    </div>
  );
}

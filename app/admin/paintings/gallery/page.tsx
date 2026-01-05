'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPagination from '@/components/admin/AdminPagination';
import Button from '@/components/Button';
import GalleryModal from '@/components/admin/GalleryModal';
import { DeleteGallery, GetGallery } from '@/lib/api/admin';

interface GalleryImage {
  _id: string;
  url: string;
  name: string;
}

interface GalleryItem {
  _id: string;
  name: string;
  imageIds: GalleryImage[];
  createdAt: string;
  updatedAt: string;
}

interface GalleryApiResponse {
  _id: string;
  name?: string;
  imageIds?: Array<{
    _id: string;
    url: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function GalleryListPage() {
  const router = useRouter();

  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'delete'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 8;

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await GetGallery();
      // Transform API response to match GalleryItem interface
      const transformedGalleries =
        (response?.galleries as GalleryApiResponse[])?.map(gallery => ({
          _id: gallery._id,
          name: gallery.name || 'Untitled Gallery',
          imageIds:
            gallery.imageIds?.map(img => ({
              _id: img._id,
              url: img.url,
              name: img.name,
            })) || [],
          createdAt: gallery.createdAt,
          updatedAt: gallery.updatedAt,
        })) || [];
      setGalleries(transformedGalleries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch galleries');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGallery = (galleryId: string) => {
    // Find the gallery data from the current galleries state
    const galleryData = galleries.find(g => g._id === galleryId);
    if (galleryData) {
      const encodedData = encodeURIComponent(JSON.stringify(galleryData));
      router.push(`/admin/paintings/gallery/${galleryId}?gallery=${encodedData}`);
    } else {
      router.push(`/admin/paintings/gallery/${galleryId}`);
    }
  };

  const handleDeleteGallery = (gallery: GalleryItem) => {
    setSelectedGallery(gallery);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  // const handleViewGallery = (gallery: GalleryItem) => {
  //   setSelectedGallery(gallery);
  //   setModalMode("view");
  //   setIsModalOpen(true);
  // };

  const handleConfirmDelete = async (id: string) => {
    try {
      await DeleteGallery(id);
      setSuccess('Gallery deleted successfully');
      fetchGalleries();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete gallery');
      setTimeout(() => setError(null), 3000);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGallery(null);
  };

  /* ===============================
     GALLERY BASED PAGINATION
  ================================ */
  const totalPages = Math.max(1, Math.ceil(galleries.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedGalleries = galleries.slice(start, start + PAGE_SIZE);

  if (loading) {
    return <div className='text-center py-20 text-white/70'>Loading galleries...</div>;
  }

  if (error) {
    return (
      <div className='text-center py-20'>
        <p className='text-red-400'>{error}</p>
        <button onClick={fetchGalleries} className='button-primary mt-4 text-xs'>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-6xl px-4 py-12'>
      {/* HEADER */}
      <div className='mb-8 flex justify-between items-center'>
        <div>
          <p className='text-sm uppercase tracking-[0.3em] text-white/60'>Admin · Gallery</p>
          <h1 className='section-heading'>All Galleries</h1>
        </div>
        <button onClick={() => router.push('/admin/paintings/gallery/new')} className='button-primary text-xs'>
          {/* Add New Gallery */}
          Add image in gallery
        </button>
      </div>

      {success && <p className='mb-4 text-center text-green-400'>{success}</p>}

      {galleries.length === 0 ? (
        <div className='text-center py-16 text-white/70'>
          <p className='mb-4'>No galleries found</p>
          <button onClick={() => router.push('/admin/paintings/gallery/new')} className='button-primary text-xs'>
            Create Your First Gallery
          </button>
        </div>
      ) : (
        <>
          {/* TABLE */}
          <div className='overflow-hidden rounded-3xl border border-white/10 bg-white/5'>
            <table className='w-full text-left text-sm text-white/80'>
              <thead className='bg-white/10 text-xs uppercase tracking-[0.2em] text-white/60'>
                <tr>
                  <th className='px-6 py-4'>Gallery Name</th>
                  <th className='px-6 py-4'>Images</th>
                  {/* <th className="px-6 py-4">Category</th> */}
                  <th className='px-6 py-4'>Created</th>
                  <th className='px-6 py-4'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGalleries.map((gallery: GalleryItem) => (
                  <tr key={gallery._id} className='border-t border-white/10 hover:bg-white/10 transition'>
                    <td className='px-6 py-4 font-medium text-white'>{gallery.name}</td>

                    <td className='px-6 py-4'>
                      <span className='px-2 py-1 '>{gallery.imageIds?.length || 0} images</span>
                    </td>

                    <td className='px-6 py-4'>{new Date(gallery.createdAt).toLocaleDateString()}</td>

                    <td className='px-6 py-4'>
                      <div className='flex  gap-2 text-xs'>
                        <Button
                          type='button'
                          variant='outline'
                          className='px-3 py-1'
                          onClick={() => handleEditGallery(gallery._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          type='button'
                          variant='outline'
                          className='px-3 py-1 text-red-200 hover:text-red-100'
                          onClick={() => handleDeleteGallery(gallery)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <AdminPagination
            total={galleries.length}
            perPage={PAGE_SIZE}
            currentPage={currentPage}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Gallery Modal */}
      <GalleryModal
        gallery={selectedGallery}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDelete={handleConfirmDelete}
        mode={modalMode}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPagination from "@/components/admin/AdminPagination";
import { DeleteGallery, GetGallery } from "@/lib/api/admin";

interface GalleryImage {
  _id: string;
  url: string;
  name: string;
}

interface GalleryItem {
  _id: string;
  imageIds: GalleryImage[];
  categoryId: {
    _id: string;
    categoryName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ImageRow {
  galleryId: string;
  imageId: string;
  imageUrl: string;
  imageName: string;
  galleryName?: string;
  categoryName: string;
  createdAt: string;
}

export default function GalleryListPage() {
  const router = useRouter();

  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
      setGalleries(response?.galleries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch galleries");
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

  const handleDeleteGallery = async (galleryId: string) => {
    if (!confirm("Are you sure you want to delete this gallery?")) return;

    try {
      await DeleteGallery(galleryId);
      setSuccess("Gallery deleted successfully");
      fetchGalleries();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  /* ===============================
     FLATTEN GALLERIES → IMAGES
  ================================ */
  const imageRows: ImageRow[] = galleries.flatMap((gallery) =>
    (gallery.imageIds || []).map((img, index) => ({
      galleryId: gallery._id,
      imageId: img._id,
      imageUrl: img.url,
      imageName: img.name,
      galleryName: `Gallery ${index + 1}`, // Simple gallery naming
      categoryName: gallery.categoryId?.categoryName || "Uncategorized",
      createdAt: gallery.createdAt,
    }))
  );

  /* ===============================
     IMAGE BASED PAGINATION
  ================================ */
  const totalPages = Math.max(1, Math.ceil(imageRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedImages = imageRows.slice(start, start + PAGE_SIZE);

  if (loading) {
    return (
      <div className="text-center py-20 text-white/70">
        Loading images...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error}</p>
        <button onClick={fetchGalleries} className="button-primary mt-4 text-xs">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            Admin · Gallery
          </p>
          <h1 className="section-heading">All Images</h1>
        </div>
        <button
          onClick={() => router.push("/admin/paintings/gallery/new")}
          className="button-primary text-xs"
        >
          Add New Gallery
        </button>
      </div>

      {success && (
        <p className="mb-4 text-center text-green-400">{success}</p>
      )}

      {imageRows.length === 0 ? (
        <div className="text-center py-16 text-white/70">
          No images found
        </div>
      ) : (
        <>
          {/* TABLE */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="bg-white/10 text-xs uppercase tracking-[0.2em] text-white/60">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Image Name</th>
                  <th className="px-6 py-4">Gallery</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedImages.map((item) => (
                  <tr
                    key={item.imageId}
                    className="border-t border-white/10 hover:bg-white/10 transition"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={item.imageUrl}
                        alt={item.imageName}
                        className="h-16 w-16 rounded-lg object-cover border border-white/20"
                      />
                    </td>

                    <td className="px-6 py-4 font-medium text-white">
                      {item.imageName}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/10 rounded text-xs">
                        {item.galleryName}
                      </span>
                    </td>

                    <td className="px-6 py-4">{item.categoryName}</td>

                    <td className="px-6 py-4">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditGallery(item?.galleryId)}
                          className="text-blue-400 text-xs hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(item?.galleryId)}
                          className="text-red-400 text-xs hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <AdminPagination
            total={imageRows.length}
            perPage={PAGE_SIZE}
            currentPage={currentPage}
            onPageChange={setPage}
          />
        </>
      )}

    </div>
  );
}

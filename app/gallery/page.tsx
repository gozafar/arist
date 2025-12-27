"use client";

import { useEffect, useState } from "react";
import { GetGallery, adminGetCategories } from "@/lib/api/admin";

interface GalleryImage {
  _id: string;
  url: string;
  name: string;
}

interface Gallery {
  _id: string;
  imageIds: GalleryImage[];
  categoryId: {
    _id: string;
    categoryName: string;
  };
  createdAt: string;
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; pages: number }>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeCategoryId) {
      fetchGalleries(activeCategoryId, pagination.page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryId, pagination.page]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminGetCategories();
      const mapped = (res || []).map((c) => ({ id: c.id, name: c.categoryName }));
      setCategories(mapped);
      setActiveCategoryId(mapped[0]?.id || null);
      setError(null);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleries = async (categoryId: string, page: number) => {
    try {
      setLoading(true);
      const res = await GetGallery({ categoryId, page, limit: pagination.limit });
      setGalleries(res?.galleries || []);
      if (res?.pagination) {
        setPagination(res.pagination);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load galleries");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-white/60">
        Loading galleries…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchCategories} className="button-primary text-xs">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.35em] uppercase text-white/50">
            Collections
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white mt-2">
            Art Gallery
          </h1>
          <p className="mt-3 max-w-xl text-white/60 text-sm">
            Browse collections by category. Switch tabs to load a category and page through its galleries.
          </p>
        </div>

        <div className="flex gap-3 text-xs text-white/70">
          <span className="rounded-full bg-white/5 px-4 py-2">
            {galleries.length} collections
          </span>
          <span className="rounded-full bg-white/5 px-4 py-2">
            {galleries.reduce((t, g) => t + g.imageIds.length, 0)} works
          </span>
        </div>
      </div>

      {/* CATEGORY TABS */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategoryId(cat.id);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                  isActive
                    ? "border-white/60 bg-white/10 text-white shadow-md shadow-black/20"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-white/30"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      {/* ACTIVE CATEGORY GRID */}
      {activeCategoryId ? (
        <section className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => (
              <div
                key={gallery._id}
                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition"
              >
                {/* IMAGE GRID */}
                <div className="relative aspect-square overflow-hidden">
                  <div className="grid grid-cols-2 grid-rows-2 h-full gap-[2px]">
                    {gallery.imageIds.slice(0, 4).map((img, i) => (
                      <img
                        key={img._id}
                        src={img.url}
                        alt={img.name}
                        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110
                          ${gallery.imageIds.length === 1 ? "col-span-2 row-span-2" : ""}
                          ${gallery.imageIds.length === 2 && i === 0 ? "col-span-2" : ""}
                          ${gallery.imageIds.length === 3 && i === 2 ? "col-span-2" : ""}
                        `}
                      />
                    ))}

                    {gallery.imageIds.length === 0 && (
                      <div className="col-span-2 row-span-2 flex items-center justify-center text-white/40 text-sm">
                        No images
                      </div>
                    )}
                  </div>

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-white text-sm tracking-wide">
                      View Collection →
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-white">
                      {gallery.categoryId.categoryName}
                    </h3>
                    <span className="text-xs text-white/50">
                      {gallery.imageIds.length} works
                    </span>
                  </div>

                  <p className="text-xs text-white/40">
                    Created{" "}
                    {new Date(gallery.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 text-xs text-white/70">
            <button
              className="button-outline px-3 py-2 text-xs disabled:opacity-50"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={pagination.page === 1 || loading}
            >
              Prev
            </button>
            <span>
              Page {pagination.page} of {Math.max(1, pagination.pages || 1)}
            </span>
            <button
              className="button-outline px-3 py-2 text-xs disabled:opacity-50"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(prev.pages || 1, prev.page + 1),
                }))
              }
              disabled={pagination.pages === pagination.page || loading}
            >
              Next
            </button>
          </div>
        </section>
      ) : (
        <div className="text-white/60 text-sm">No category selected.</div>
      )}
    </div>
  );
}

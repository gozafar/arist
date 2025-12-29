"use client";

import { useEffect, useState, useRef } from "react";
import { GetGallery } from "@/lib/api/admin";
import Image from "next/image";

const GALLERY_NAMES = [
  "Contemporary / Modern Art",
  "Portrait Paintings", 
  "Landscape Paintings",
  "Abstract Art"
] as const;

interface GalleryImage {
  _id: string;
  url: string;
  name: string;
}

interface Gallery {
  _id: string;
  name: string;
  imageIds: GalleryImage[];
  createdAt: string;
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<string>("");
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; pages: number }>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleries();
  }, [pagination.page]);

  useEffect(() => {
    if (selectedGallery) {
      // Filter by selected hardcoded gallery name
      const filtered = galleries.filter(gallery => gallery.name === selectedGallery);
      setFilteredGalleries(filtered);
    } else {
      // Filter galleries to only show those with hardcoded names
      const hardcodedFiltered = galleries.filter(gallery => 
        GALLERY_NAMES.includes(gallery.name as any)
      );
      setFilteredGalleries(hardcodedFiltered);
    }
  }, [selectedGallery, galleries]);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const res = await GetGallery({ page: pagination.page, limit: pagination.limit });
      setGalleries((res?.galleries as any) || []);
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
        <button onClick={fetchGalleries} className="button-primary text-xs">
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
            Browse through our gallery collections. Page through to explore all available galleries.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 text-xs text-white/70">
          <select
            value={selectedGallery}
            onChange={(e) => setSelectedGallery(e.target.value)}
            className="rounded-full bg-white/5 px-4 py-2 border border-white/10 focus:border-white/20 outline-none"
          >
            <option value="">All Galleries</option>
            {GALLERY_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <span className="rounded-full bg-white/5 px-4 py-2">
            {filteredGalleries.length} collections
          </span>
          <span className="rounded-full bg-white/5 px-4 py-2">
            {filteredGalleries.reduce((t, g) => t + g.imageIds.length, 0)} works
          </span>
        </div>
      </div>

      {/* selected category: {selectedCategory} */}

      {/* GALLERY GRID */}
      {filteredGalleries.length > 0 ? (
        <section className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGalleries.map((gallery) => (
              <div
                key={gallery._id}
                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition"
              >
                {/* IMAGE GRID */}
                <div className="relative aspect-square overflow-hidden">
                  <div className="grid grid-cols-2 grid-rows-2 h-full gap-[2px]">
                    {gallery.imageIds.slice(0, 4).map((img, i) => (
                     <Image
  key={img._id}
  src={img.url}
  alt={img.name}
  fill
  className={`object-cover transition-transform duration-500 group-hover:scale-110
    ${gallery.imageIds.length === 1 ? "col-span-2 row-span-2" : ""}
    ${gallery.imageIds.length === 2 && i === 0 ? "col-span-2" : ""}
    ${gallery.imageIds.length === 3 && i === 2 ? "col-span-2" : ""}
  `}
  sizes="(max-width: 768px) 50vw, 25vw"
  loading="lazy"
  quality={75}
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YxZjFmMSIvPjwvc3ZnPg=="
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
                      {gallery.name}
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
        <div className="text-white/60 text-sm">No galleries found.</div>
      )}
    </div>
  );
}

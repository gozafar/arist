"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GalleryForm from "@/components/admin/GalleryForm";
import { adminGetCategories } from "@/lib/api/admin";

interface Category {
  _id: string;
  categoryName: string;
}

export default function NewGalleryPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await adminGetCategories();
        if (response) {
          const transformed = response.map((cat) => ({
            _id: cat.id,
            categoryName: cat.categoryName,
          }));
          setCategories(transformed);
        }
      } catch (err) {
        setError("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (data: {
    categoryId: string;
    images: File[];
    imageNames: string[];
  }) => {
    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append("categoryId", data.categoryId);
      data.images.forEach((image) => {
        formData.append("images", image);
      });
      data.imageNames.forEach((name) => {
        formData.append("imageNames", name);
      });

      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/admin/paintings/gallery?created=true");
      } else {
        setError("Failed to create gallery1");
      }
    } catch (err) {
      setError("Error creating gallery");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-white/70">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            Admin · Gallery
          </p>
          <h1 className="section-heading">Add New Gallery</h1>
        </div>
        <button
          onClick={() => router.back()}
          className="text-xs text-white/70 hover:text-white"
        >
          Back
        </button>
      </div>

      {error && <p className="mb-4 text-center text-red-400">{error}</p>}

      {categories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/70">
            No categories found. Please create a category first.
          </p>
        </div>
      ) : (
        <div className="card-glass rounded-3xl border border-white/10 bg-white/5 p-6">
          <GalleryForm
            onSubmit={handleSubmit}
            isLoading={submitting}
            categories={categories}
          />
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { UpdateGallery, adminGetCategories } from "@/lib/api/admin";


interface Category {
  id: string;
  categoryName: string;
}

interface GalleryImage {
  _id: string;
  url: string;
  name: string;
}

interface GalleryData {
  _id: string;
  imageIds: GalleryImage[];
  categoryId: {
    _id: string;
    categoryName: string;
  };
}

interface EditableImage {
  _id: string;
  name: string;
  url: string;
  file?: File;
  isDeleted?: boolean;
}

export default function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const galleryId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<EditableImage[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const categoryRes = await adminGetCategories();
      setCategories(categoryRes);

      const urlParams = new URLSearchParams(window.location.search);
      const galleryParam = urlParams.get('gallery');

      if (galleryParam) {
        const galleryData: GalleryData = JSON.parse(decodeURIComponent(galleryParam));
        setCategoryId(galleryData.categoryId._id);
        setImages(
          galleryData.imageIds.map((img: GalleryImage) => ({
            _id: img._id,
            name: img.name,
            url: img.url,
          }))
        );
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Load error:", err);
    }
    setLoading(false);
  };

  const updateImageName = (id: string, value: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img._id === id ? { ...img, name: value } : img
      )
    );
  };

  const replaceImage = (id: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImages((prev) =>
      prev.map((img) =>
        img._id === id
          ? { ...img, file, url: previewUrl }
          : img
      )
    );
  };

  const deleteImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img._id === id ? { ...img, isDeleted: true } : img
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("categoryId", categoryId);

      formData.append(
        "imagesMeta",
        JSON.stringify(
          images.map((img) => ({
            _id: img._id,
            name: img.name,
            isDeleted: img.isDeleted || false,
          }))
        )
      );

      images.forEach((img) => {
        if (img.file) {
          formData.append("replacedImages", img.file);
          formData.append("replacedImageIds", img._id);
        }
      });

      await UpdateGallery(galleryId, formData);
      router.push("/admin/paintings/gallery?updated=true");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update gallery");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center py-20">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Edit Gallery</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-2 rounded bg-white/10 border border-white/20"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {images
            .filter((img) => !img.isDeleted)
            .map((img) => (
              <div key={img._id} className="space-y-2">
                <img
                  src={img.url}
                  className="h-32 w-full object-cover rounded"
                />

                <input
                  value={img.name}
                  onChange={(e) => updateImageName(img._id, e.target.value)}
                  className="w-full p-1 text-sm bg-white/10 border rounded"
                  placeholder="Image name"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && replaceImage(img._id, e.target.files[0])
                  }
                />

                <button
                  type="button"
                  onClick={() => deleteImage(img._id)}
                  className="text-red-500 text-xs"
                >
                  Delete Image
                </button>
              </div>
            ))}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="button-primary px-6 py-2"
          >
            {submitting ? "Updating..." : "Update Gallery"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting}
            className="px-4 py-2 bg-white/10 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

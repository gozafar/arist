"use client";

import { useState } from "react";
import GalleryForm from "@/components/admin/GalleryForm";
interface AddGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGalleryAdded: () => void;
}

export default function AddGalleryModal({ isOpen, onClose, onGalleryAdded }: AddGalleryModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { name: string; images: File[]; imageNames: string[] }) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('name', data.name);
      
      data.images.forEach((image) => {
        formData.append('images', image);
      });
      
      data.imageNames.forEach((name) => {
        formData.append('imageNames', name);
      });
      
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        onGalleryAdded();
        onClose();
      } else {
        setError('Failed to create gallery');
      }
    } catch (err) {
      setError('Error creating gallery');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="card-glass rounded-3xl border border-[rgb(161,44,116)]/15 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-[rgb(161,44,116)]">Admin · Gallery</p>
              <h2 className="section-heading text-[rgb(161,44,116)]">Add New Gallery</h2>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-3 py-1 text-xs text-white/60 transition hover:border-white/40 hover:text-white"
            >
              Close
            </button>
          </div>

          {error && (
            <div className="mb-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <GalleryForm
            onSubmit={handleSubmit}
            isLoading={submitting}
          />
        </div>
      </div>
    </div>
  );
}

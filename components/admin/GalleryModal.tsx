"use client";

import { useState, useEffect } from "react";
import { DeleteGallery } from "@/lib/api/admin";
import { deleteContact } from "@/lib/api/contact";

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

interface ContactItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status?: string;
  createdAt: string;
}

interface GalleryModalProps {
  gallery?: GalleryItem | null;
  contact?: ContactItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onDeleteContact?: (id: string) => void;
  mode: "view" | "delete";
}

export default function GalleryModal({ 
  gallery, 
  contact,
  isOpen, 
  onClose, 
  onDelete, 
  onDeleteContact,
  mode 
}: GalleryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (gallery && onDelete) {
      setLoading(true);
      setError(null);

      try {
        await DeleteGallery(gallery._id);
        onDelete(gallery._id);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error deleting gallery");
      } finally {
        setLoading(false);
      }
    } else if (contact && onDeleteContact) {
      setLoading(true);
      setError(null);

      try {
        await deleteContact(contact._id);
        onDeleteContact(contact._id);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error deleting contact");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen || (!gallery && !contact)) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card-glass rounded-3xl p-6 max-w-md w-full">
        {mode === "view" ? (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">
              {gallery ? "Gallery Details" : "Contact Details"}
            </h2>
            <div className="space-y-3 text-sm text-white/80">
              <div>
                <p className="text-white/60">ID</p>
                <p className="break-all">{gallery?._id || contact?._id}</p>
              </div>
              <div>
                <p className="text-white/60">Name</p>
                <p>{gallery?.name || contact?.name}</p>
              </div>
              {gallery && (
                <div>
                  <p className="text-white/60">Images</p>
                  <p>{gallery.imageIds?.length || 0} images</p>
                </div>
              )}
              {contact && (
                <>
                  <div>
                    <p className="text-white/60">Email</p>
                    <p>{contact.email}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Phone</p>
                    <p>{contact.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Message</p>
                    <p className="line-clamp-3">{contact.message}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-white/60">Created</p>
                <p>{new Date(gallery?.createdAt || contact?.createdAt || "").toLocaleString()}</p>
              </div>
              {gallery && (
                <div>
                  <p className="text-white/60">Updated</p>
                  <p>{new Date(gallery.updatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <button onClick={onClose} className="w-full button-outline">
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">
              Confirm Delete
            </h2>
            <p className="text-white/70 mb-6">
              Are you sure you want to delete the {gallery ? "gallery" : "contact message"} "{gallery?.name || contact?.name}"? 
              {gallery && ` This action cannot be undone and will also delete all ${gallery.imageIds?.length || 0} images in this gallery.`}
              {contact && " This action cannot be undone."}
            </p>

            {error && (
              <p className="text-sm text-red-300 mb-4">{error}</p>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={onClose}
                className="flex-1 button-outline"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

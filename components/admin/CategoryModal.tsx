"use client";

import { useState, useEffect } from "react";
import { adminUpdateCategory, adminDeleteCategory } from "@/lib/api/admin";

interface CategoryItem {
  id: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryModalProps {
  category: CategoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: CategoryItem) => void;
  onDelete: (id: string) => void;
  mode: "edit" | "delete" | "view";
}


export default function CategoryModal({ 
  category, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  mode 
}: CategoryModalProps) {
  const [formData, setFormData] = useState({ categoryName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category && mode === "edit") {
      setFormData({ categoryName: category.categoryName });
    }
  }, [category, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setLoading(true);
    setError(null);

    try {
      await adminUpdateCategory(category.id, formData.categoryName);
      onSave({ ...category, categoryName: formData.categoryName });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Deleting category with ID:", category.id);
      await adminDeleteCategory(category.id);
      onDelete(category.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card-glass rounded-3xl p-6 max-w-md w-full">
        {mode === "view" ? (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">
              Category Details
            </h2>
            <div className="space-y-3 text-sm text-white/80">
              <div>
                <p className="text-white/60">ID</p>
                <p className="break-all">{category.id}</p>
              </div>
              <div>
                <p className="text-white/60">Name</p>
                <p>{category.categoryName}</p>
              </div>
              <div>
                <p className="text-white/60">Created</p>
                <p>{new Date(category.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/60">Updated</p>
                <p>{new Date(category.updatedAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-6">
              <button onClick={onClose} className="w-full button-outline">
                Close
              </button>
            </div>
          </>
        ) : mode === "edit" ? (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">
              Edit Category
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ categoryName: e.target.value })}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-300">{error}</p>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-sand-500 hover:bg-sand-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 button-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">
              Confirm Delete
            </h2>
            <p className="text-white/70 mb-6">
              Are you sure you want to delete the category &quot;{category.categoryName}&quot;? This action cannot be undone.
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

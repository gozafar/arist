"use client";

import { useState, useEffect } from "react";
import { adminCreateCategory, adminGetCategories } from "@/lib/api/admin";
import { toast } from 'react-toastify';

interface Category {
  id: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: () => void;
}

export default function AddCategoryModal({ isOpen, onClose, onCategoryAdded }: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setIsFetching(true);
    try {
      const data = await adminGetCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch categories");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await adminCreateCategory(categoryName.trim());
      toast.success("Category created successfully");
      setCategoryName("");
      await fetchCategories(); // Refresh the list
      onCategoryAdded();
    } catch (err) {
      console.error("Error creating category:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create category";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-gray-900 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add New Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-900/30 p-3 text-sm text-red-400 border border-red-800">
            {error}
          </div>
        )}

        {/* Categories List - Read Only
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-3">Existing Categories</h3>
          {isFetching ? (
            <div className="text-center py-4 text-gray-400">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-4 text-gray-400">No categories found</div>
          ) : (
            <div className={`space-y-2 ${
              categories.length > 4
                ? "max-h-[260px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                : ""
            }`}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="text-white font-medium">{category.categoryName}</div>
                  <div className="text-gray-400 text-xs">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* Add New Category Form */}
        <div className="border-t border-gray-700 pt-6">
          {/* <h3 className="text-lg font-medium text-white mb-3">Add New Category</h3> */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="categoryName"
                className="mb-2 block text-sm font-medium text-white/90"
              >
                Category Name
              </label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="e.g., Landscape, Portrait, Abstract"
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isLoading}
              >
                Close
              </button>
              <button
                type="submit"
                className="button-primary text-sm"
                disabled={isLoading || !categoryName.trim()}
              >
                {isLoading ? "Creating..." : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
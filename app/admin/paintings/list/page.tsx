"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGate from "@/components/admin/AdminGate";
import CategoryModal from "@/components/admin/CategoryModal";
import { adminGetCategories, adminDeleteCategory, adminUpdateCategory } from "@/lib/api/admin";

interface PaintingItem {
  id: string;
  title: string;
  description: string;
  price: number;
  medium: string;
  size: string;
  year: number;
  availability: "in-stock" | "sold";
  image: string;
  tags: string[];
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryItem {
  id: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [modalMode, setModalMode] = useState<"edit" | "delete">("edit");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminGetCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: CategoryItem) => {
    setSelectedCategory(category);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category: CategoryItem) => {
    setSelectedCategory(category);
    setModalMode("delete");
    setIsModalOpen(true);
  };

  const handleSave = async (updatedCategory: CategoryItem) => {
    try {
      await adminUpdateCategory(updatedCategory.id, updatedCategory.categoryName);
      setCategories(categories.map(c => 
        c.id === updatedCategory.id ? updatedCategory : c
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating category");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting category");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <AdminGate>
        <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
          <div className="text-center py-8">
            <p className="text-white/70">Loading categories...</p>
          </div>
        </div>
      </AdminGate>
    );
  }

  if (error) {
    return (
      <AdminGate>
        <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
            <button onClick={fetchCategories} className="mt-4 button-primary text-xs">
              Retry
            </button>
          </div>
        </div>
      </AdminGate>
    );
  }

  return (
    <AdminGate>
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Admin · Categories</p>
            <h1 className="section-heading">Manage Categories</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/categories/add" className="button-primary text-xs">
              Add New Category
            </Link>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/70 mb-4">No categories found</p>
            <Link href="/admin/categories/add" className="button-primary text-xs">
              Add Your First Category
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {categories.map((category) => (
              <div key={category.id} className="card-glass rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  {/* Category Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {category.categoryName}
                    </h3>
                    <div className="text-sm text-white/70">
                      <p>Created: {new Date(category.createdAt).toLocaleDateString()}</p>
                      <p>Updated: {new Date(category.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="button-outline text-xs px-4 py-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="button-outline text-xs px-4 py-2 text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Modal for Edit/Delete */}
        <CategoryModal
          category={selectedCategory}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={handleDelete}
          mode={modalMode}
        />
      </div>
    </AdminGate>
  );
}
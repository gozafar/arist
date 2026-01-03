'use client';

import { useEffect, useState } from 'react';
import CategoryModal from '@/components/admin/CategoryModal';
import AdminPagination from '@/components/admin/AdminPagination';
import AddCategoryModal from '@/components/admin/AddCategoryModal';
import { adminGetCategories, adminDeleteCategory, adminUpdateCategory } from '@/lib/api/admin';

// interface PaintingItem {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   medium: string;
//   size: string;
//   year: number;
//   availability: "in-stock" | "sold";
//   image: string;
//   tags: string[];
//   categoryId: string;
//   createdAt: string;
//   updatedAt: string;
// }

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
  const [modalMode, setModalMode] = useState<'edit' | 'delete' | 'view'>('edit');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

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
      setError(err instanceof Error ? err.message : 'Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: CategoryItem) => {
    setSelectedCategory(category);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category: CategoryItem) => {
    setSelectedCategory(category);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const handleView = (category: CategoryItem) => {
    setSelectedCategory(category);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleSave = async (updatedCategory: CategoryItem) => {
    try {
      await adminUpdateCategory(updatedCategory.id, updatedCategory.categoryName);
      setCategories(categories.map(c => (c.id === updatedCategory.id ? updatedCategory : c)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating category');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting category');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16'>
        <div className='text-center py-8'>
          <p className='text-white/70'>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16'>
        <div className='text-center py-8'>
          <p className='text-red-400'>{error}</p>
          <button onClick={fetchCategories} className='mt-4 button-primary text-xs'>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = categories.slice(start, start + PAGE_SIZE);

  return (
    <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16'>
      <div className='mb-8 flex items-center justify-between'>
        <div className='space-y-2'>
          <p className='text-sm uppercase tracking-[0.3em] text-white/60'>Admin · Categories</p>
          <h1 className='section-heading'>Manage Categories</h1>
        </div>
        <div className='flex gap-4'>
          <button onClick={() => setIsAddModalOpen(true)} className='button-primary text-xs'>
            Add New Category
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-white/70 mb-4'>No categories found</p>
          <button onClick={() => setIsAddModalOpen(true)} className='button-primary text-xs'>
            Add Your First Category
          </button>
        </div>
      ) : (
        <>
          <div className='overflow-hidden rounded-3xl border border-white/10 bg-white/5'>
            <table className='w-full text-left text-sm text-white/80'>
              <thead className='bg-white/10 text-xs uppercase tracking-[0.2em] text-white/60'>
                <tr>
                  <th className='px-6 py-4'>Name</th>
                  <th className='px-6 py-4'>Created</th>
                  <th className='px-6 py-4'>Updated</th>
                  <th className='px-6 py-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(category => (
                  <tr
                    key={category.id}
                    className='cursor-pointer border-t border-white/10 transition hover:bg-white/10'
                    onClick={() => handleView(category)}
                  >
                    <td className='px-6 py-4 font-medium text-white'>{category.categoryName}</td>
                    <td className='px-6 py-4'>{new Date(category.createdAt).toLocaleDateString()}</td>
                    <td className='px-6 py-4'>{new Date(category.updatedAt).toLocaleDateString()}</td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={event => {
                            event.stopPropagation();
                            handleEdit(category);
                          }}
                          className='button-outline text-xs px-4 py-2'
                        >
                          Edit
                        </button>
                        {/* <button
                          onClick={event => {
                            event.stopPropagation();
                            handleDeleteClick(category);
                          }}
                          className='button-outline text-xs px-4 py-2 text-red-400 hover:text-red-300'
                        >
                          Delete
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination
            total={categories.length}
            perPage={PAGE_SIZE}
            currentPage={currentPage}
            onPageChange={setPage}
          />
        </>
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
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCategoryAdded={fetchCategories}
      />
    </div>
  );
}

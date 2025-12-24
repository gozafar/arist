'use client';

import { useState, useEffect } from 'react';
import { adminCreateCategory } from '@/lib/api/admin';
import { toast } from 'react-toastify';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: () => void;
}

export default function AddCategoryModal({ isOpen, onClose, onCategoryAdded }: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await adminCreateCategory(categoryName.trim());
      toast.success('Category created successfully');
      setCategoryName('');
      onCategoryAdded();
      onClose();
    } catch (err) {
      console.error('Error creating category:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]'
      onClick={onClose}
    >
      <div
        className='w-full max-w-xl rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.25)] sm:p-7 max-h-[90vh] overflow-y-auto'
        role='dialog'
        aria-modal='true'
        aria-labelledby='add-category-title'
        aria-describedby='add-category-description'
        onClick={e => e.stopPropagation()}
      >
        <div className='mb-5 flex items-start justify-between gap-4'>
          <div>
            <h2 id='add-category-title' className='text-xl font-semibold text-slate-900 sm:text-2xl'>
              Add New Category
            </h2>
            <p id='add-category-description' className='mt-1 text-sm text-slate-500'>
              Create clean labels to keep your gallery organized.
            </p>
          </div>
          <button
            onClick={onClose}
            className='rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <span className='sr-only'>Close</span>
            <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {error && (
          <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>{error}</div>
        )}

        {/* Add New Category Form */}
        <div className='border-t border-slate-200/80 pt-5'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label htmlFor='categoryName' className='mb-2 block text-sm font-medium text-slate-700'>
                Category Name
              </label>
              <input
                type='text'
                id='categoryName'
                value={categoryName}
                onChange={e => {
                  setCategoryName(e.target.value);
                  if (error) setError('');
                }}
                className='w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                placeholder='e.g., Landscape, Portrait, Abstract'
                disabled={isLoading}
                required
                autoFocus
              />
              <p className='mt-1 text-xs text-slate-500'>Use 2-4 words that make browsing easy.</p>
            </div>

            <div className='flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={onClose}
                className='w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 sm:w-auto'
                disabled={isLoading}
              >
                Close
              </button>
              <button
                type='submit'
                className='w-full rounded-lg border border-slate-900 bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 sm:w-auto'
                disabled={isLoading || !categoryName.trim()}
              >
                {isLoading ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

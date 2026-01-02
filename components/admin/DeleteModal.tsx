'use client';

import { useState } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  itemName: string;
  itemType?: string;
  additionalInfo?: string;
  loading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  itemName,
  itemType = 'item',
  additionalInfo,
  loading = false,
}: DeleteModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onDelete();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error deleting ${itemType}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='card-glass rounded-3xl p-6 max-w-md w-full'>
        <h2 className='text-xl font-semibold text-white mb-4'>Delete {itemType}</h2>

        <p className='text-white/80 mb-6'>
          Are you sure you want to delete the {itemType} &quot;{itemName}&quot;?
          {additionalInfo && ` ${additionalInfo}`}
          This action cannot be undone.
        </p>

        {error && <p className='text-sm text-red-300 mb-4'>{error}</p>}

        <div className='flex gap-4'>
          <button
            onClick={handleDelete}
            disabled={isLoading || loading}
            className='flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50'
          >
            {isLoading || loading ? 'Deleting...' : 'Delete'}
          </button>
          <button onClick={onClose} className='flex-1 button-outline' disabled={isLoading || loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import DeleteModal from '@/components/admin/DeleteModal';
import type { PaintingDTO } from '@/lib/dto';

export type AdminPaintingTableProps = {
  paintings: PaintingDTO[];
  onEdit: (painting: PaintingDTO) => void;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string) => void;
};

const AdminPaintingTable = ({ paintings, onEdit, onDelete, onToggle }: AdminPaintingTableProps) => {
  const [selectedPainting, setSelectedPainting] = useState<PaintingDTO | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = (painting: PaintingDTO) => {
    setSelectedPainting(painting);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPainting && selectedPainting.id && selectedPainting.id !== 'invalid') {
      await onDelete(selectedPainting.id);
    } else {
      console.error('Cannot delete painting: invalid or missing ID', selectedPainting);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPainting(null);
  };

  return (
    <>
      <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white'>
        <table className='min-w-full text-left text-sm text-slate-700'>
          <thead className='bg-slate-50 text-slate-900'>
            <tr>
              <th className='px-4 py-3'>Artwork</th>
              <th className='px-4 py-3'>Price</th>
              <th className='px-4 py-3'>Status</th>
              <th className='px-4 py-3 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paintings.map(painting => (
              <tr key={painting.id} className='border-t border-slate-200'>
                <td className='px-4 py-3'>
                  <div className='flex items-center gap-3'>
                    <div className='relative h-14 w-12 overflow-hidden rounded-lg'>
                      <Image
                        src={painting.image}
                        alt={painting.title}
                        fill
                        className='object-cover'
                        loading='lazy'
                        sizes='48px' // Matches the container width (w-12 = 3rem = 48px)
                        quality={75}
                        placeholder='blur'
                        blurDataURL='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YxZjFmMSIvPjwvc3ZnPg=='
                      />
                    </div>
                    <div>
                      <p className='font-semibold text-slate-900'>{painting.title}</p>
                      <p className='text-xs text-slate-500'>{painting.medium}</p>
                    </div>
                  </div>
                </td>
                <td className='px-4 py-3'>${painting.price.toLocaleString()}</td>
                <td className='px-4 py-3'>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      painting.availability === 'sold' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {painting.availability === 'sold' ? 'Sold' : 'In Stock'}
                  </span>
                </td>
                <td className='px-4 py-3 text-right'>
                  <div className='flex justify-end gap-2 text-xs'>
                    <Button
                      type='button'
                      variant='outline'
                      className='px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed'
                      onClick={() => onEdit(painting)}
                      disabled={!painting.id || painting.id === 'invalid'}
                    >
                      Edit
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      className='px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed'
                      onClick={() => onToggle(painting.id)}
                      disabled={!painting.id || painting.id === 'invalid'}
                    >
                      {painting.availability === 'sold' ? 'Mark In Stock' : 'Mark Sold'}
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      className='px-3 py-1 text-red-200 hover:text-red-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      onClick={() => handleDeleteClick(painting)}
                      disabled={!painting.id || painting.id === 'invalid'}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteConfirm}
        itemName={selectedPainting?.title || ''}
        itemType='painting'
        additionalInfo="This will also delete the painting's image from Cloudinary."
      />
    </>
  );
};

export default AdminPaintingTable;

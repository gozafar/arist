'use client';

import clsx from 'clsx';

export type PaginationProps = {
  total: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ total, perPage, currentPage, onPageChange }: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pages = Array.from({ length: totalPages }).map((_, i) => i + 1);

  return (
    <div className='mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3'>
      <div className='text-sm text-black/60 font-normal'>
        Page {currentPage} of {totalPages}
      </div>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className='button-outline px-3 py-2 text-xs disabled:opacity-50'
        >
          Prev
        </button>
        <div className='flex items-center gap-1'>
          {pages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={clsx(
                'h-9 w-9 rounded-full border border-white/10 text-sm transition',
                page === currentPage ? 'bg-sand-500 text-black shadow-card' : 'bg-white/5 text-white'
              )}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className='button-outline px-3 py-2 text-xs disabled:opacity-50'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

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
    <div className='mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#FFA501]/25 bg-white/5 px-4 py-3'>
      <div className='text-sm text-black font-normal'>
        Page {currentPage} of {totalPages}
      </div>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className='rounded-full border border-[#FFA501] bg-white px-3 py-2 text-xs font-medium !text-black transition hover:bg-[#FFA501] hover:!text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:!text-black'
        >
          Prev
        </button>
        <div className='flex items-center gap-1'>
          {pages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={clsx(
                'h-9 w-9 rounded-full border text-sm font-medium transition',
                page === currentPage
                  ? 'border-[#FFA501] bg-[#FFA501] !text-black shadow-card'
                  : 'border-[#FFA501]/35 bg-white !text-black hover:border-[#FFA501] hover:bg-[#FFA501]/15 hover:!text-black'
              )}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className='rounded-full border border-[#FFA501] bg-white px-3 py-2 text-xs font-medium !text-black transition hover:bg-[#FFA501] hover:!text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:!text-black'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

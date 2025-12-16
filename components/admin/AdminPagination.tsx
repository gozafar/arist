"use client";

import clsx from "clsx";

export type AdminPaginationProps = {
  total: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const AdminPagination = ({ total, perPage, currentPage, onPageChange }: AdminPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pages = Array.from({ length: totalPages }).map((_, i) => i + 1);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="button-outline px-3 py-2 text-xs disabled:opacity-50"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <div className="flex items-center gap-1">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={clsx(
                "h-9 w-9 rounded-full border border-white/10 text-sm transition",
                page === currentPage ? "bg-sand-500 text-black shadow-card" : "bg-white/5 text-white"
              )}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="button-outline px-3 py-2 text-xs disabled:opacity-50"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;

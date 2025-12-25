"use client";

import { useState, useRef, useEffect } from "react";
import AdminPaintingTable from "@/components/admin/AdminPaintingTable";
import AdminPaintingForm from "@/components/admin/AdminPaintingForm";
import AdminPagination from "@/components/admin/AdminPagination";
import type { PaintingDTO } from "@/lib/dto";
import { NewPaintingInput, usePaintings } from "@/context/PaintingContext";

const AdminPaintingsPage = () => {
  const { paintings, deletePainting, toggleAvailability, updatePainting } = usePaintings();
  const [editing, setEditing] = useState<PaintingDTO | null>(null);
  const editRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const totalPages = Math.max(1, Math.ceil(paintings.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = paintings.slice(start, start + PAGE_SIZE);

  const handleEditSubmit = (payload: NewPaintingInput) => {
    if (editing) {
      updatePainting(editing.id, payload);
      setEditing(null);
    }
  };

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editing]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin · Paintings</p>
            <h1 className="section-heading">Manage paintings</h1>
            <p className="text-slate-600">Edit, toggle availability, or delete artworks.</p>
          </div>
        </div>

        <AdminPaintingTable
          paintings={paginated}
          onEdit={(p) => setEditing(p)}
          onDelete={(id) => {
            if (confirm("Delete this painting?")) deletePainting(id);
          }}
          onToggle={toggleAvailability}
        />
        <AdminPagination total={paintings.length} perPage={PAGE_SIZE} currentPage={currentPage} onPageChange={setPage} />

        {editing && (
          <div ref={editRef} className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">Edit painting</h2>
              <button className="text-sm text-slate-500 hover:text-slate-700" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
            <AdminPaintingForm
              initial={editing}
              onSubmit={handleEditSubmit}
              mode="edit"
            />
          </div>
        )}

      </div>
  );
};

export default AdminPaintingsPage;

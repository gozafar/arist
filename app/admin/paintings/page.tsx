"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AdminGate from "@/components/admin/AdminGate";
import AdminPaintingTable from "@/components/admin/AdminPaintingTable";
import AdminPaintingForm from "@/components/admin/AdminPaintingForm";
import AdminPagination from "@/components/admin/AdminPagination";
import AddCategoryModal from "@/components/admin/AddCategoryModal";
import type { PaintingDTO } from "@/lib/dto";
import { NewPaintingInput, usePaintings } from "@/context/PaintingContext";
import { useRouter } from "next/navigation";

const AdminPaintingsPage = () => {
  const { paintings, deletePainting, toggleAvailability, updatePainting } = usePaintings();
  const [editing, setEditing] = useState<PaintingDTO | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const editRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const totalPages = Math.max(1, Math.ceil(paintings.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = paintings.slice(start, start + PAGE_SIZE);
  const router = useRouter();

  const handleEditSubmit = (payload: NewPaintingInput) => {
    if (editing) {
      updatePainting(editing.id, payload);
      setEditing(null);
    }
  };

  const handleCategoryAdded = () => {
    // Refresh categories if needed
  };

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editing]);

  return (
    <AdminGate>
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Admin · Paintings</p>
            <h1 className="section-heading">Manage paintings</h1>
            <p className="text-white/70">Edit, toggle availability, or delete artworks.</p>
          </div>
          <div className="flex items-center space-x-3 ml-auto">
             <button
               onClick={() => router.push("/admin/paintings/list")}
              className="button-primary text-xs"
            >
              LIst category
            </button>
            <button
               onClick={() => router.push("/admin/paintings/order-list")}
              className="button-primary text-xs"
            >
              Order List
            </button>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="button-primary text-xs"
            >
              Add category
            </button>
            <Link href="/admin/paintings/add" className="button-primary text-xs">
              Add new
            </Link>
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
          <div ref={editRef} className="mt-8 card-glass rounded-3xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">Edit painting</h2>
              <button className="text-sm text-white/60 hover:text-white" onClick={() => setEditing(null)}>
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

        <AddCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onCategoryAdded={handleCategoryAdded}
        />
      </div>
    </AdminGate>
  );
};

export default AdminPaintingsPage;

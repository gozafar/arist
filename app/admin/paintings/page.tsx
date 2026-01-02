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

  const handleEditSubmit = (payload: FormData) => {
    if (editing) {
      // Check if there's an image file in the FormData
      const imageFile = payload.get('image') as File;
      
      console.log("=== FRONTEND DEBUG ===");
      console.log("Image file in frontend:", imageFile ? {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      } : "No image file");
      
      if (imageFile && imageFile.size > 0) {
        console.log("Sending FormData with image");
        console.log("FormData entries:");
        payload.forEach((value, key) => {
          if (value instanceof File) {
            console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
          } else {
            console.log(`${key}: ${value}`);
          }
        });
        // Send FormData directly when there's an image
        updatePainting(editing.id, payload);
      } else {
        console.log("Sending JSON without image");
        // Extract painting data from FormData when no image
        const paintingData: Partial<NewPaintingInput> = {
          title: payload.get('title') as string,
          description: payload.get('description') as string,
          price: Number(payload.get('price')),
          medium: payload.get('medium') as string,
          size: payload.get('size') as string,
          year: Number(payload.get('year')),
          availability: payload.get('availability') as "in-stock" | "sold",
          categoryId: payload.get('categoryId') as string,
          tags: JSON.parse(payload.get('tags') as string || '[]')
        };
        
        updatePainting(editing.id, paintingData);
      }
      
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

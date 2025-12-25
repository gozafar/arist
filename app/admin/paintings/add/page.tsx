"use client";

import Link from "next/link";
import AdminGate from "@/components/admin/AdminGate";
import AdminPaintingForm from "@/components/admin/AdminPaintingForm";
import { usePaintings } from "@/context/PaintingContext";

const AdminAddPaintingPage = () => {
  const { addPainting } = usePaintings();

  return (
    <AdminGate>
      <div className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-[rgb(161,44,116)]">Admin · Paintings</p>
            <h1 className="section-heading text-[rgb(161,44,116)]">Add a new painting</h1>
            <p className="text-slate-600">Upload an artwork to publish it to the public gallery and checkout flow.</p>
          </div>
          <Link
            href="/admin/paintings"
            className="inline-flex items-center justify-center rounded-full border border-[rgb(161,44,116)] px-4 py-2 text-xs font-semibold text-[rgb(161,44,116)] transition hover:bg-[rgb(161,44,116)] hover:text-white"
          >
            View list
          </Link>
        </div>
        <div className="card-glass rounded-3xl border border-[rgb(161,44,116)]/15 bg-white p-6">
          <AdminPaintingForm onSubmit={addPainting} mode="create" />
        </div>
      </div>
      </div>
    </AdminGate>
  );
};

export default AdminAddPaintingPage;

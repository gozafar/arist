"use client";

import Link from "next/link";
import AdminGate from "@/components/admin/AdminGate";
import AdminPaintingForm from "@/components/admin/AdminPaintingForm";
import { usePaintings } from "@/context/PaintingContext";

const AdminAddPaintingPage = () => {
  const { addPainting } = usePaintings();

  return (
    <AdminGate>
      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Admin · Paintings</p>
            <h1 className="section-heading">Add a new painting</h1>
            <p className="text-white/70">Upload an artwork to publish it to the public gallery and checkout flow.</p>
          </div>
          <Link href="/admin/paintings" className="button-outline text-xs">
            View list
          </Link>
        </div>
        <div className="card-glass rounded-3xl p-6">
          <AdminPaintingForm onSubmit={addPainting} mode="create" />
        </div>
      </div>
    </AdminGate>
  );
};

export default AdminAddPaintingPage;

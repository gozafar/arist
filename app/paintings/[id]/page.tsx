"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { usePaintings } from "@/context/PaintingContext";

const PaintingDetailPage = ({ params }: { params: { id: string } }) => {
  const { paintings } = usePaintings();
  const painting = paintings.find((p) => p.id === params.id);
  if (!painting) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-white/70 lg:px-6">
        <p>Painting not found.</p>
        <Link href="/paintings" className="mt-4 inline-block button-outline">
          Back to gallery
        </Link>
      </div>
    );
  }
  const isSold = painting.availability === "sold";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="card-glass relative overflow-hidden rounded-[30px] border border-white/10">
          <div className="relative aspect-[4/5]">
            <Image src={painting.image} alt={painting.title} fill className="object-cover" priority />
          </div>
        </div>
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Painting detail</p>
          <h1 className="section-heading">{painting.title}</h1>
          <p className="text-lg text-white/80">{painting.description}</p>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <Info label="Year" value={painting.year.toString()} />
            <Info label="Medium" value={painting.medium} />
            <Info label="Size" value={painting.size} />
            <Info label="Tags" value={painting.tags.join(", ")} />
            <Info label="Availability" value={isSold ? "Sold" : "In stock"} />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-3xl font-semibold text-sand-200">${painting.price.toLocaleString()}</p>
            <AddToCartButton painting={painting} disabled={isSold} />
            <Link href="/paintings" className="button-outline">
              Back to gallery
            </Link>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/70">
            Ships worldwide in museum-grade crates. Includes certificate of authenticity.
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-white/50">{label}</p>
    <p className="mt-1 font-semibold text-white">{value}</p>
  </div>
);

export default PaintingDetailPage;

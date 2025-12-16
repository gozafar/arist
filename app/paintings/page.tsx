"use client";

import PaintingCard from "@/components/PaintingCard";
import { usePaintings } from "@/context/PaintingContext";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import { useMemo } from "react";

const PaintingsPage = () => {
  const { paintings } = usePaintings();
  const PAGE_SIZE = 10;
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = useMemo(() => {
    const pageParam = Number(searchParams.get("page") || "1");
    return Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  }, [searchParams]);

  const totalPages = Math.max(1, Math.ceil(paintings.length / PAGE_SIZE));
  const clampedPage = Math.min(currentPage, totalPages);
  const start = (clampedPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const visible = paintings.slice(start, end);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/paintings?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Available works</p>
          <h1 className="section-heading">Paintings</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Textural, atmospheric acrylic paintings crafted in Bangalore. Each piece is sealed and ready to hang.
          </p>
        </div>
        <div className="flex gap-3 text-sm text-white/70">
          <span className="rounded-full bg-white/5 px-4 py-2">Originals</span>
          <span className="rounded-full bg-white/5 px-4 py-2">Worldwide shipping</span>
        </div>
      </div>
      <div className="container-grid">
        {visible.map((painting) => (
          <PaintingCard key={painting.id} painting={painting} />
        ))}
      </div>
      <Pagination total={paintings.length} perPage={PAGE_SIZE} currentPage={clampedPage} onPageChange={handlePageChange} />
    </div>
  );
};

export default PaintingsPage;

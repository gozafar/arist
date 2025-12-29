"use client";

import PaintingCard from "@/components/PaintingCard";
import Link from "next/link";
import { usePaintings } from "@/context/PaintingContext";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import { Suspense, useMemo } from "react";

const PaintingsContent = () => {
  const { paintings, loaded } = usePaintings();
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
    <>
      <div className="container-grid">
        {visible.map((painting) => (
          <PaintingCard key={painting.id} painting={painting} />
        ))}
        {!visible.length && !loaded && <p className="text-white/70">Loading paintings…</p>}
        {!visible.length && loaded && <p className="text-white/70">No paintings found.</p>}
      </div>
      <Pagination
        total={paintings.length}
        perPage={PAGE_SIZE}
        currentPage={clampedPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};

const PaintingsClient = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Available works</p>
          <h1 className="section-heading">Paintings</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Shop original wall art curated for collectors in the UAE, India, USA, and Hong Kong. Each piece is sealed,
            certified, and ready to hang with worldwide shipping.
          </p>
        </div>
        <div className="flex gap-3 text-sm text-white/70">
          <span className="rounded-full bg-white/5 px-4 py-2">Originals</span>
          <span className="rounded-full bg-white/5 px-4 py-2">Worldwide shipping</span>
        </div>
      </div>

      <section id="categories" className="mb-10 space-y-6">
        <h2 className="font-display text-3xl text-sand-200">Explore by category</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-glass rounded-2xl p-5">
            <h3 className="text-xl font-semibold text-white">Abstract Paintings</h3>
            <p className="mt-2 text-sm text-white/70">
              Layered, expressive works that bring energy and movement to modern interiors in Dubai, Mumbai, New York,
              and Hong Kong.
            </p>
          </div>
          <div className="card-glass rounded-2xl p-5">
            <h3 className="text-xl font-semibold text-white">Modern Art</h3>
            <p className="mt-2 text-sm text-white/70">
              Contemporary compositions with bold palettes, ideal for luxury homes, offices, and boutique hospitality.
            </p>
          </div>
          <div className="card-glass rounded-2xl p-5">
            <h3 className="text-xl font-semibold text-white">Traditional Art</h3>
            <p className="mt-2 text-sm text-white/70">
              Culturally rooted narratives and classic techniques that resonate with global collectors and heritage
              spaces.
            </p>
          </div>
          <div className="card-glass rounded-2xl p-5">
            <h3 className="text-xl font-semibold text-white">Canvas &amp; Wall Art</h3>
            <p className="mt-2 text-sm text-white/70">
              Museum-grade canvases designed to elevate living rooms, entryways, and curated gallery walls worldwide.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<p className="text-white/70">Loading paintings…</p>}>
        <PaintingsContent />
      </Suspense>
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        Looking for buying guidance? Visit the{" "}
        <Link className="underline" href="/blog">
          Art Insights blog
        </Link>{" "}
        for collector tips.
      </div>
    </div>
  );
};

export default PaintingsClient;

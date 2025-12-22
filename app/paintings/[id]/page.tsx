import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import type { Metadata } from "next";
import type { PaintingDTO } from "@/lib/dto";
import { defaultKeywords, siteUrl } from "@/lib/seo";

type PaintingResponse = PaintingDTO;

async function fetchPainting(id: string): Promise<PaintingResponse | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const res = await fetch(`${base}/api/paintings/${id}`, {
    next: { tags: ["paintings"] }
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load painting");
  return (await res.json()) as PaintingResponse;
}

export const generateMetadata = async ({ params }: { params: { id: string } }): Promise<Metadata> => {
  const painting = await fetchPainting(params.id);
  if (!painting) {
    return { title: "Painting not found", robots: { index: false } };
  }
  const title = `${painting.title} | ${painting.medium} by Rakhi Vashisht`;
  const description = `${painting.title} — ${painting.medium}, ${painting.size}. Original painting by Rakhi Vashisht.`;
  return {
    title,
    description,
    keywords: [...defaultKeywords, painting.title, painting.medium, ...(painting.tags ?? [])],
    alternates: { canonical: `${siteUrl}/paintings/${painting.id}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/paintings/${painting.id}`,
      images: [{ url: painting.image, alt: `${painting.title} by Rakhi Vashisht` }]
    },
    twitter: {
      title,
      description,
      images: [{ url: painting.image, alt: `${painting.title} by Rakhi Vashisht` }]
    }
  };
};

const PaintingDetailPage = async ({ params }: { params: { id: string } }) => {
  const painting = await fetchPainting(params.id);
  if (!painting) {
    notFound();
  }
  const isSold = painting.availability === "sold";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: painting.title,
    image: [painting.image],
    description: `${painting.title} - ${painting.medium}, ${painting.size}`,
    brand: "Rakhi Studio",
    sku: painting.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: painting.price,
      availability: isSold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: `${siteUrl}/paintings/${painting.id}`
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="card-glass relative overflow-hidden rounded-[30px] border border-white/10">
          <div className="relative aspect-[4/5]">
            <Image
              src={painting.image}
              alt={`${painting.title} by Rakhi Vashisht – ${painting.medium}`}
              fill
              className="object-cover"
              priority
            />
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

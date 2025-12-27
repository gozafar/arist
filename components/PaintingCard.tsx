"use client";

import Image from "next/image";
import Link from "next/link";
import type { PaintingDTO } from "@/lib/dto";
import Button from "./Button";
// import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";


const PaintingCard = ({ painting }: { painting: PaintingDTO }) => {
  const router = useRouter();
  // const { addToCart } = useCart();
  // const isSold = painting.availability === "sold";

  return (
    <div className="card-glass flex h-full flex-col overflow-hidden rounded-3xl">
      <div className="relative aspect-[3/4] max-h-[320px] overflow-hidden">
        <Image
          src={painting.image}
          alt={`${painting.title} original painting`}
          fill
          className="object-cover transition duration-700 hover:scale-105"
          sizes="(min-width: 1280px) 240px, (min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl">{painting.title}</h3>
            <p className="text-sm text-white/60">{painting.medium}</p>
          </div>
          <p className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">{painting.year}</p>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">{painting.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-lg font-semibold text-sand-200">
            ${painting.price.toLocaleString()}
          </p>
          <div className="flex gap-2">
            <Link href={`/paintings/${painting.id}`} className="button-outline px-4 py-2 text-xs">
              View
            </Link>
            {/* <Button
              onClick={() => addToCart(painting)}
              className="px-4 py-2 text-xs"
              disabled={isSold}
            >
              {isSold ? "Sold" : "Add"}
            </Button> */}
            <Button
            onClick={() => router.push(`/paintings/${painting.id}/PaintingOrder`)}
            >
              contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingCard;

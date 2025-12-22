import type { Metadata } from "next";
import PaintingsClient from "@/components/PaintingsClient";
import { defaultKeywords, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Paintings",
  description: "Browse original paintings, abstract and modern wall art, and canvas collections by Rakhi Studio.",
  keywords: [...defaultKeywords, "abstract paintings", "modern paintings", "canvas wall art", "wall art online"],
  alternates: { canonical: `${siteUrl}/paintings` },
  openGraph: {
    title: "Shop Paintings",
    description: "Original wall art and canvas paintings by Rakhi Vashisht.",
    url: `${siteUrl}/paintings`
  },
  twitter: {
    title: "Shop Paintings",
    description: "Original wall art and canvas paintings by Rakhi Vashisht."
  }
};

const PaintingsPage = () => <PaintingsClient />;

export default PaintingsPage;

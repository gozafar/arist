import PaintingsClient from "@/components/PaintingsClient";
import { headers } from "next/headers";
import type { Metadata } from "next";
import {
  buildSeoMetadata,
  getCountryConfig,
  getCountryFromHeaders
} from "@/lib/seo";

export const generateMetadata = async (): Promise<Metadata> => {
  const country = getCountryFromHeaders(await headers());
  const config = getCountryConfig(country);
  const title = `Original Paintings for Sale | ${config.label}`;
  const description =
    `Browse abstract, modern, and traditional paintings shipped to collectors in ${config.label}.`;

  return buildSeoMetadata({
    path: "/paintings",
    title,
    description,
    keywords: ["abstract paintings", "modern art", "traditional art", "canvas wall art"],
    country,
    ogTitle: `Shop Original Paintings in ${config.label}`,
    ogDescription: `Explore curated originals and wall art with secure delivery to ${config.label}.`
  });
};

const PaintingsPage = () => <PaintingsClient />;

export default PaintingsPage;

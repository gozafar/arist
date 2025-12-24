import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { siteUrl, defaultDescription, defaultKeywords } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Home",
  description: defaultDescription,
  keywords: [...defaultKeywords, "buy art online", "original wall art"],
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    title: "Artistry – Online Painting Gallery",
    description: defaultDescription,
    url: siteUrl
  },
  twitter: {
    title: "Artistry – Online Painting Gallery",
    description: defaultDescription
  }
};

const HomePage = () => {
  return <HomeClient />;
};

export default HomePage;

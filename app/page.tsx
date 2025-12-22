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
    title: "Rakhi Studio | Home",
    description: defaultDescription,
    url: siteUrl
  },
  twitter: {
    title: "Rakhi Studio | Home",
    description: defaultDescription
  }
};

const HomePage = () => {
  return <HomeClient />;
};

export default HomePage;

import type { Metadata } from "next";
import ContactClient from "@/components/ContactClient";
import { siteUrl, defaultDescription, defaultKeywords } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Rakhi Studio for purchases, commissions, or studio visits. Responses within one business day.",
  keywords: [...defaultKeywords, "contact artist", "commission artwork", "studio visit"],
  alternates: {
    canonical: `${siteUrl}/contact`
  },
  openGraph: {
    title: "Contact Rakhi Studio",
    description: "Reach out for artwork purchases, commissions, or studio visits.",
    url: `${siteUrl}/contact`
  },
  twitter: {
    title: "Contact Rakhi Studio",
    description: defaultDescription
  }
};

const ContactPage = () => {
  return <ContactClient />;
};

export default ContactPage;

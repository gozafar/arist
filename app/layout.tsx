import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { PaintingProvider } from "@/context/PaintingContext";
import { defaultDescription, defaultKeywords, siteUrl } from "@/lib/seo";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: {
    default: "Artistry – Online Painting Gallery",
    template: "%s | Artistry Gallery"
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    title: "Artistry – Online Painting Gallery",
    description: defaultDescription,
    url: siteUrl,
    siteName: "Artistry Gallery",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Artistry – Online Painting Gallery",
    description: defaultDescription
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F5F0"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${playfair.variable} font-sans antialiased`}>
        <PaintingProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "Organization",
                      name: "Rakhi Studio",
                      url: siteUrl,
                      logo: `${siteUrl}/logo.png`,
                      sameAs: ["https://www.instagram.com", "https://www.behance.net"]
                    })
                  }}
                />
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </PaintingProvider>
      </body>
    </html>
  );
}

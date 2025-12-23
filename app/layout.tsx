import type { Metadata, Viewport } from "next";
import { Playfair_Display, Sora } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { PaintingProvider } from "@/context/PaintingContext";
import { defaultDescription, defaultKeywords, siteUrl } from "@/lib/seo";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: {
    default: "Rakhi Studio | Art & Portfolio",
    template: "%s | Rakhi Studio"
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    title: "Rakhi Studio | Art & Portfolio",
    description: defaultDescription,
    url: siteUrl,
    siteName: "Rakhi Studio",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakhi Studio | Art & Portfolio",
    description: defaultDescription
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0a08"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${playfair.variable} font-sans antialiased text-white`}>
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
              <ToastContainer
                position='bottom-right'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
              />
              <Footer />
            </div>
          </CartProvider>
        </PaintingProvider>
      </body>
    </html>
  );
}

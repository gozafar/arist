import type { Metadata } from "next";
import { Playfair_Display, Sora } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { PaintingProvider } from "@/context/PaintingContext";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "Lipi Srivastava | Art & Portfolio",
  description: "Hong Kong-based artist Lipi Srivastava — vibrant acrylic and oil works.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${playfair.variable} font-sans antialiased text-white`}>
        <PaintingProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </PaintingProvider>
      </body>
    </html>
  );
}

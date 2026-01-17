import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Playfair_Display, Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { PaintingProvider } from '@/context/PaintingContext';
import {
  defaultDescription,
  defaultKeywords,
  defaultOgImage,
  getCountryFromHeaders,
  getLangForCountry,
  siteUrl,
} from '@/lib/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Artistry – Online Painting Gallery',
    template: "%s | Rakhi's Studio",
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Artistry – Online Painting Gallery',
    description: defaultDescription,
    url: siteUrl,
    siteName: "Rakhi's Studio",
    locale: 'en_US',
    type: 'website',
    images: [{ url: defaultOgImage, alt: "Rakhi's Studio online painting marketplace" }],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artistry – Online Painting Gallery',
    description: defaultDescription,
    images: [defaultOgImage],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F8F5F0',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const country = getCountryFromHeaders(headerList);
  const lang = getLangForCountry(country);

  return (
    <html lang={lang}>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <PaintingProvider>
          <CartProvider>
            <div className='min-h-screen flex flex-col'>
              <Navbar />
              <main className='flex-1'>
                <script
                  type='application/ld+json'
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      '@context': 'https://schema.org',
                      '@type': 'Organization',
                      'name': 'Rakhi Studio',
                      'url': siteUrl,
                      'logo': `${siteUrl}/logo.png`,
                      'sameAs': ['https://www.instagram.com', 'https://www.behance.net'],
                      'areaServed': ['United States', 'India', 'United Arab Emirates', 'Hong Kong'],
                      'contactPoint': [
                        {
                          '@type': 'ContactPoint',
                          'contactType': 'sales',
                          'areaServed': ['US', 'IN', 'AE', 'HK'],
                          'availableLanguage': ['English'],
                        },
                      ],
                    }),
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

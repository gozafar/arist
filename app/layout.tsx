import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
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
import PWAInstallBanner from '@/components/PWAInstallBanner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  applicationName: 'Rakhi Studio Gallery',
  title: {
    default: 'Rakhis Studio – Online Painting Gallery',
    template: '%s | Rakhis Studio Gallery',
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Rakhis Studio – Online Painting Gallery',
    description: defaultDescription,
    url: siteUrl,
    siteName: 'Rakhis Studio Gallery',
    locale: 'en_US',
    type: 'website',
    images: [{ url: defaultOgImage, alt: 'Rakhis Studio Gallery online painting marketplace' }],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: ['/favicon.ico'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rakhis Studio – Online Painting Gallery',
    description: defaultDescription,
    images: [defaultOgImage],
  },
  manifest: '/manifest.json',
  themeColor: '#F8F5F0',
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
      <body className='font-sans antialiased'>
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
              <PWAInstallBanner />
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

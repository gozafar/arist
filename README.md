# Artistry Gallery

Artistry is a modern online painting gallery built with Next.js 16 and Tailwind CSS.

## Getting Started

- Install dependencies: `pnpm install`
- Run locally: `pnpm dev` (service worker is disabled in development)
- Production preview: `pnpm build && pnpm start`

## How PWA works

- **Service worker**: Powered by `next-pwa` with `dest: public`, `register: true`, `skipWaiting: true`, and disabled automatically in development builds.
- **Caching strategies**: Cache First for scripts/styles/workers/fonts, Network First for `/api/*` GET requests, and Stale-While-Revalidate for all images. An offline fallback is served from `/offline` when navigation fails.
- **Manifest & icons**: `public/manifest.json` defines the app name, start URL `/`, standalone display, and theme/background color `#F8F5F0`. Icons live in `public/icons` (192x192, 512x512) with an Apple touch icon at `public/apple-touch-icon.png`.
- **Install prompt**: The reusable `usePWAInstallPrompt` hook captures `beforeinstallprompt` and drives the global `PWAInstallBanner` component so users can add the app to their home screen.
- **Cache busting**: Next.js asset hashes plus workbox expiration rules ensure new builds invalidate old caches while keeping offline capability for previously visited pages.

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
  const title = `Art Services & Commissions | ${config.label}`;
  const description =
    `Commission bespoke artwork, studio visits, and collaborations with delivery to ${config.label}.`;

  return buildSeoMetadata({
    path: "/services",
    title,
    description,
    keywords: ["art commissions", "studio visits", "art workshops", "art collaborations"],
    country,
    ogTitle: `Art Services for ${config.label}`,
    ogDescription: `Commission bespoke artwork and collaborations with worldwide delivery to ${config.label}.`
  });
};

const ServicesPage = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 lg:py-16 space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Services</p>
        <h1 className="section-heading">Work with Rakhi Studio</h1>
        <p className="max-w-2xl text-white/70">
          Commissions, studio visits, and collaborations tailored to your space, palette, and story.
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        Serving collectors and designers in the UAE, India, USA, and Hong Kong with global logistics support.
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card-glass rounded-3xl p-6 space-y-3">
          <h2 className="font-display text-2xl text-sand-200">Commissions</h2>
          <p className="text-white/80 leading-relaxed">
            Bespoke acrylic works crafted for residences and hospitality spaces. Share your palette, dimensions, and the
            mood you want to evoke—we&apos;ll translate it into a statement piece.
          </p>
        </div>
        <div className="card-glass rounded-3xl p-6 space-y-3">
          <h2 className="font-display text-2xl text-sand-200">Studio visits</h2>
          <p className="text-white/80 leading-relaxed">
            Private viewings in Hong Kong by appointment. Experience textures, colors, and scale in person with guided
            walkthroughs.
          </p>
        </div>
        <div className="card-glass rounded-3xl p-6 space-y-3">
          <h2 className="font-display text-2xl text-sand-200">Workshops</h2>
          <p className="text-white/80 leading-relaxed">
            Group and corporate sessions focused on creative exploration, team connection, and playful experimentation
            with materials.
          </p>
        </div>
        <div className="card-glass rounded-3xl p-6 space-y-3">
          <h2 className="font-display text-2xl text-sand-200">Collaborations</h2>
          <p className="text-white/80 leading-relaxed">
            Partnerships with designers, brands, and galleries across Delhi, Dubai, Moscow, Bangalore, and Hong Kong.
            Let&apos;s build something bold together.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

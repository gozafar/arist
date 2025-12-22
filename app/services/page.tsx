import type { Metadata } from "next";
import { siteUrl, defaultKeywords } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services",
  description: "Commissions, studio visits, and collaborations with Rakhi Studio.",
  keywords: [...defaultKeywords, "art commissions", "studio visits", "art workshops", "art collaborations"],
  alternates: {
    canonical: `${siteUrl}/services`
  },
  openGraph: {
    title: "Services | Rakhi Studio",
    description: "Explore commissions, studio visits, and collaboration opportunities with Rakhi Vashisht.",
    url: `${siteUrl}/services`
  },
  twitter: {
    title: "Services | Rakhi Studio",
    description: "Commission bespoke artwork, schedule studio visits, and collaborate with Rakhi Studio."
  }
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

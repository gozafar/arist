"use client";

import Image from "next/image";
import Link from "next/link";
import PaintingCard from "@/components/PaintingCard";
import { usePaintings } from "@/context/PaintingContext";

const HomePage = () => {
  const { paintings } = usePaintings();
  const featured = paintings.slice(0, 3);
  const testimonials = [
    {
      quote:
        "Lipi’s work brings a warmth to our living room—bold color without feeling loud. You can sense the gratitude in every layer.",
      name: "Rina Mehta",
      role: "Collector, Hong Kong"
    },
    {
      quote:
        "We commissioned a piece for our lobby and it has become a talking point. Lipi listened deeply and translated our story onto canvas.",
      name: "David Lau",
      role: "Hotelier, Singapore"
    },
    {
      quote:
        "Her paintings have a meditative quality. Standing in front of them feels like taking a breath after a long day.",
      name: "Priya Nair",
      role: "Art enthusiast, Mumbai"
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 lg:px-6 lg:pt-14">
      <section className="hero-gradient relative overflow-hidden rounded-[32px] border border-white/10 px-6 py-12 md:px-10 lg:px-14 lg:py-16 shadow-soft">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Acrylic & oil</p>
            <h1 className="section-heading">
              Vibrant storytelling by <span className="text-sand-200">Lipi Srivastava</span>
            </h1>
            <p className="max-w-2xl text-lg text-white/80">
              Hong Kong-based artist and corporate leader turned painter, Lipi creates bold, uplifting works inspired by
              resilience, gratitude, and her journey of healing that began in 2021.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/paintings" className="button-primary">
                View paintings
              </Link>
              <Link href="/contact" className="button-outline">
                Book a studio visit
              </Link>
            </div>
            <div className="flex gap-6 text-sm text-white/70">
              <div>
                <p className="text-2xl font-semibold text-sand-200">25+ yrs</p>
                <p>Leadership & HR background</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-sand-200">2021</p>
                <p>Art as a path to recovery</p>
              </div>
            </div>
          </div>
          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-black/50 shadow-card">
            <Image
              src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80"
              alt="Colorful abstract painting in a studio"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/10 p-4 text-sm text-white/80 backdrop-blur">
              Art inspired by resilience, gratitude, and community.
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="section-heading">Featured works</h2>
          <Link href="/paintings" className="button-outline text-xs">
            Browse all
          </Link>
        </div>
        <div className="container-grid">
          {featured.map((painting) => (
            <PaintingCard key={painting.id} painting={painting} />
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-6 rounded-[28px] border border-white/10 bg-white/5 px-6 py-10 md:px-10">
        <div className="flex items-center justify-between">
          <h2 className="section-heading">Testimonials</h2>
          <span className="text-sm text-white/60">Collectors on Lipi’s paintings</span>
        </div>
        <div className="container-grid">
          {testimonials.map((item) => (
            <div key={item.name} className="card-glass h-full rounded-2xl p-5">
              <p className="text-white/80 leading-relaxed">“{item.quote}”</p>
              <div className="mt-4 text-sm text-white/60">
                <p className="font-semibold text-white">{item.name}</p>
                <p>{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 rounded-[28px] border border-white/10 bg-white/5 px-6 py-10 md:grid-cols-3 md:px-10">
        <div className="space-y-3">
          <h3 className="font-display text-2xl">Studio visits</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            View works in Hong Kong by appointment. Private walkthroughs with curated lighting.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="font-display text-2xl">Commissions</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Bespoke pieces tailored to your space, palette, and size requirements.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="font-display text-2xl">Shipping</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Worldwide shipping in museum-grade crates. Works ship 7–10 days after purchase.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

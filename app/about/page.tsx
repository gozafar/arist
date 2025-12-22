import Image from "next/image";
import type { Metadata } from "next";
import { siteUrl, defaultDescription, defaultKeywords } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Rakhi Vashisht, the Hong Kong-based artist behind Rakhi Studio, blending global influences into vibrant acrylic works.",
  keywords: [...defaultKeywords, "artist story", "art philosophy", "original art Hong Kong"],
  alternates: {
    canonical: `${siteUrl}/about`
  },
  openGraph: {
    title: "About Rakhi Vashisht",
    description: defaultDescription,
    url: `${siteUrl}/about`
  },
  twitter: {
    title: "About Rakhi Vashisht",
    description: defaultDescription
  }
};

const AboutPage = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 lg:py-16 space-y-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-card">
          <Image
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
            alt="Rakhi Vashisht in her studio"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">About the artist</p>
          <h1 className="section-heading">Meet Rakhi Vashisht</h1>
          <p className="text-lg leading-relaxed text-white/80">
            Born amidst the vibrant landscapes of Madhya Pradesh, India, Rakhi discovered her calling in colors and forms
            early on—earning Elementary and Intermediate certifications from JJ School of Arts by age ten. Though her
            academic path spanned Textile Engineering and an MBA in Finance, art remained her quiet rhythm, returning with
            renewed intensity as acrylics became her chosen language.
          </p>
          <p className="leading-relaxed text-white/70">
            Her professional journey carried her across Delhi, Dubai, Moscow, Bangalore, and now Hong Kong—each city
            leaving its imprint on her palette. Rakhi&apos;s canvases weave bold colors, dynamic compositions, and emotions
            that resonate with viewers. Beyond her own practice, she teaches, conducts workshops, and shares her vision
            through exhibitions worldwide.
          </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-4">
          <h2 className="font-display text-3xl text-sand-200">Artistic Style</h2>
          <p className="leading-relaxed text-white/80">
            Rakhi&apos;s art is a dance of vibrancy and detail. Bold hues and intricate strokes converge to create
            compositions that are both dynamic and contemplative, inspired by the mosaic of cultures and landscapes she
            has lived within.
          </p>
          <p className="leading-relaxed text-white/70">
            She delights in experimentation—exploring materials, techniques, and mediums—and moves fluidly between abstract
            explorations, human figures, landscapes, and seascapes. Each piece carries a quiet poetry that invites
            reflection.
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-card">
          <Image
            src="https://images.unsplash.com/photo-1523419400525-dc6c1e105d58?auto=format&fit=crop&w=1400&q=80"
            alt="Rakhi Vashisht presenting her paintings"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="card-glass rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8 space-y-4">
        <h2 className="font-display text-3xl text-sand-200">Exhibitions (timeline)</h2>
        <div className="space-y-5 text-white/80 leading-relaxed">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">Early</p>
            <ul className="mt-2 space-y-1">
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand-300" />Lalit Kala Academy, Delhi – Kalidas Mahotsav (1989–1992)</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">2010–2016</p>
            <ul className="mt-2 space-y-1">
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand-300" />Dubai, UAE galleries (2010–2013)</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand-300" />Art fairs, Moscow, Russia (2013–2016)</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">2017–2019</p>
            <ul className="mt-2 space-y-1">
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand-300" />Group shows, Chitra Kala Parishad, Bangalore (2017)</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand-300" />Chitra Santhe, Bangalore (2018 &amp; 2019)</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand-300" />Venkatappa Art Gallery, Bangalore (2018)</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">2020–2025</p>
            <ul className="mt-2 space-y-1">
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand-300" />Online show “Canvas of Unity” (2020)</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand-300" />B&amp;S Arts Gallery, Sheraton, Hong Kong (2021)</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand-300" />“Streets of HK” by Watermark Church, Hong Kong (2021)</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand-300" />Visual Art Center, Hong Kong (2023)</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand-300" />Katha – Stories of India, HK Walls Project (2023–2025)</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-sand-300" />Indian Consulate, Hong Kong – Republic Day &amp; Women’s Day Celebrations (2024 &amp; 2025)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card-glass rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8 space-y-4">
        <h2 className="font-display text-3xl text-sand-200">Artist Statement</h2>
        <p className="leading-relaxed text-white/80">
          For Rakhi, art is meditation—a sanctuary where mind and soul find harmony. Each brushstroke is an offering, a way
          to inspire, provoke thought, and build bridges of connection. She believes art is both personal and communal,
          driving her to teach children, guide communities through workshops, and bring creativity into corporate spaces.
          Through her work, Rakhi reminds us that art is a reflection of the self and a celebration of humanity.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;

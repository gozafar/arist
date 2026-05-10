'use client';

import Image from 'next/image';
import Link from 'next/link';
import PaintingCard from '@/components/PaintingCard';
import { usePaintings } from '@/context/PaintingContext';
import Marquee from 'react-fast-marquee';
import { useState } from 'react';
import ImageModal from '@/components/ImageModal';
import type { PaintingDTO } from '@/lib/dto';

const HomeClient = () => {
  const { paintings } = usePaintings();
  const featured = paintings.slice(0, 3);
  const [selectedImage, setSelectedImage] = useState<PaintingDTO | null>(null);
  const testimonials = [
    {
      quote:
        'The curation feels museum-grade. Each piece has depth and soul, with colors that transform the room without overpowering it.',
      name: 'Rina Mehta',
      role: 'Collector, Hong Kong',
    },
    {
      quote:
        'We commissioned a large abstract for our lobby; it has become the quiet centerpiece guests can’t stop asking about.',
      name: 'David Lau',
      role: 'Hotelier, Singapore',
    },
    {
      quote:
        'Standing in front of these canvases feels like taking a slow breath—calming, intentional, and beautifully detailed.',
      name: 'Priya Nair',
      role: 'Art enthusiast, Mumbai',
    },
    {
      quote:
        'TestimonialsThe artist has a rare gift—each work feels alive, evoking emotion while maintaining a timeless elegance.',
      name: 'Sophia Lin',
      role: 'Collector, Singapore',
    },
    {
      quote:
        'TestimonialsThe artist has a rare gift—each work feels alive, evoking emotion while maintaining a timeless elegance.',
      name: 'Sophia Lin',
      role: 'Collector, Singapore',
    },
    {
      quote:
        'TestimonialsThe artist has a rare gift—each work feels alive, evoking emotion while maintaining a timeless elegance.',
      name: 'Sophia Lin',
      role: 'Collector, Singapore',
    },
    {
      quote:
        'TestimonialsThe artist has a rare gift—each work feels alive, evoking emotion while maintaining a timeless elegance.',
      name: 'Sophia Lin',
      role: 'Collector, Singapore',
    },
    {
      quote:
        'TestimonialsThe artist has a rare gift—each work feels alive, evoking emotion while maintaining a timeless elegance.',
      name: 'Sophia Lin',
      role: 'Collector, Singapore',
    },
    {
      quote:
        'TestimonialsThe artist has a rare gift—each work feels alive, evoking emotion while maintaining a timeless elegance.',
      name: 'Sophia Lin',
      role: 'Collector, Singapore',
    },
  ];

  return (
    <div className='mx-auto max-w-6xl px-4 pb-16 pt-10 lg:px-6 lg:pt-14'>
      <section className='hero-gradient relative overflow-hidden rounded-[32px] border border-white/15 px-6 py-12 shadow-soft md:px-10 lg:px-14 lg:py-16'>
        <div className='mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-start'>
          {/* LEFT CONTENT */}
          <div className='flex flex-col justify-center space-y-6'>
            {/* <p className='text-sm uppercase tracking-[0.3em] text-white/60'>Curated originals</p> */}
            <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display'>
              {/* Buy Original Paintings Online – Trusted Art Gallery for UAE, India, USA &amp; Hong Kong */}
              Buy Original Art works online – Offering soulful collection of art pieces to decorate your home and office
              space for clients globally
            </h1>
            <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
              Rakhi&apos;s Studio is an international painting marketplace connecting collectors in Dubai, Mumbai, New
              York, and Hong Kong with certified originals, museum-grade framing, and worldwide delivery.
            </p>

            {/* CTA BUTTONS */}
            <div className='flex flex-wrap gap-4 pt-2'>
              <Link
                href='/paintings'
                className='button-primary shadow-soft transition hover:shadow-lg hover:text-white'
                style={{ backgroundColor: '#FFA501', borderColor: '#FFA501' }}
              >
                Shop global collection
              </Link>
              <Link href='/contact' className='button-outline' style={{ color: '#FFA501', borderColor: '#FFA501' }}>
                Talk to the artist
              </Link>
            </div>

            {/* STATS */}
            <div className='grid w-full grid-cols-1 gap-4 pt-4 sm:grid-cols-2'>
              <div className='rounded-2xl bg-white/80 px-5 py-4 text-center shadow-card'>
                <p className='text-2xl font-semibold text-sand-700'>30+ works</p>
                <p className='text-sm text-black/70'>One-of-a-kind originals</p>
              </div>

              <div className='rounded-2xl bg-white/80 px-5 py-4 text-center shadow-card'>
                <p className='text-2xl font-semibold text-sand-700'>Worldwide</p>
                <p className='text-sm text-black/70'>Insured global shipping</p>
                {/* <p className='text-sm text-black/70'>India, USA, UAE, Hong Kong</p> */}
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className='relative mx-auto w-full max-w-[450px] aspect-square overflow-hidden rounded-3xl border border-white/15 bg-white shadow-card'>
            <Image
              src='/MainPaing.jpeg'
              alt='Colorful abstract painting in a studio'
              fill
              priority
              className='object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
          </div>
        </div>
      </section>

      <section className='mt-16 space-y-6'>
        <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display'>
          Trusted international art marketplace
        </h1>
        <div className='grid gap-6 md:grid-cols-3'>
          <div className='card-glass rounded-2xl p-5'>
            <h3 className='text-lg md:text-xl font-semibold text-white my font-display'>Authenticity guaranteed</h3>
            <p className='mt-2 text-black/70 text-sm'>
              Every painting ships with a signed certificate of authenticity and provenance details for collectors.
            </p>
          </div>
          <div className='card-glass rounded-2xl p-5'>
            <h3 className='text-lg md:text-xl font-semibold text-white my font-display'>Worldwide shipping</h3>
            <p className='mt-2 text-black/70 text-sm'>
              Gallery-grade packaging, customs guidance, and tracking for deliveries.
            </p>
          </div>
          <div className='card-glass rounded-2xl p-5'>
            <h3 className='text-lg md:text-xl font-semibold text-white my font-display'>Secure payments</h3>
            {/* <p className='mt-2 text-black/70 text-sm'>
              Trusted checkout and white-glove support for collectors, designers, and hospitality teams.
            </p> */}
            <p className='mt-2 text-black/70 text-sm'>
              Trusted checkout and white-glove support for collectors, architects, art agencies and galleries.
            </p>
          </div>
        </div>
      </section>

      <section className='mt-16 space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display'>Featured works</h1>
          <Link
            href='/paintings'
            className='button-outline text-xs'
            style={{ color: '#FFA501', borderColor: '#FFA501' }}
          >
            Browse all
          </Link>
        </div>
        <div className='container-grid gap-6'>
          {featured.map((painting, index) => {
            return (
              <PaintingCard
                key={painting.id || `painting-${index}`}
                painting={painting}
                onImageClick={() => setSelectedImage(painting)}
              />
            );
          })}
        </div>
        {/* <div className='mt-5 rounded-[28px] border border-white/15 bg-white/80 px-10 py-10 md:px-10 shadow-card'> */}
        {/* <div className='flex items-center justify-between flex-wrap'>
            <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display'>Testimonials</h1>
            <span className='text-sm text-black/60'>Collectors on Rakhi’s paintings</span>
          </div>
          <div className='container-grid'>
            <Marquee>
              {testimonials.map((item, index) => (
                <div key={`${item.name}-${index}`} className='card-glass h-full w-[400px] rounded-2xl p-5 m-5'>
                  <p className='text-black/80 leading-relaxed'>“{item.quote}”</p>
                  <div className='mt-4 text-sm text-black/60'>
                    <p className='font-semibold text-black'>{item.name}</p>
                    <p>{item.role}</p>
                  </div>
                </div>
              ))}
            </Marquee>
          </div> */}
        {/* </div> */}
      </section>

      <section className='mt-16 grid gap-10 rounded-[28px] border border-white/15 bg-white/80 px-6 py-10 md:grid-cols-3 md:px-10 shadow-card'>
        <div className='space-y-3'>
          <h3 className='text-xl md:text-2xl font-semibold text-white my font-display'>Corporate workshops</h3>
          {/* <p className='text-black/70 text-sm leading-relaxed'>
            View works by appointment. Private walkthroughs with curated lighting and framing guidance.
          </p> */}
          <p className='text-black/70 text-sm leading-relaxed'>
            Bond, create, and beat burnout with immersive corporate art workshops.
          </p>
        </div>
        <div className='space-y-3'>
          <h3 className='text-xl md:text-2xl font-semibold text-white my font-display'>Commissions</h3>
          <p className='text-black/70 text-sm leading-relaxed'>
            Bespoke pieces tailored to your space, palette, and size requirements with design consultations.
          </p>
        </div>
        <div className='space-y-3'>
          <h3 className='text-xl md:text-2xl font-semibold text-white my font-display'>Shipping</h3>
          <p className='text-black/70 text-sm leading-relaxed'>Worldwide shipping in museum-grade crates.</p>
        </div>
      </section>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageSrc={selectedImage.image}
          imageWidth={selectedImage.width}
          imageHeight={selectedImage.height}
          title={selectedImage.title}
        />
      )}
    </div>
  );
};

export default HomeClient;

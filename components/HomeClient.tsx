'use client';

import Image from 'next/image';
import Link from 'next/link';
import PaintingCard from '@/components/PaintingCard';
import { usePaintings } from '@/context/PaintingContext';
import Marquee from 'react-fast-marquee';

const HomeClient = () => {
  const { paintings } = usePaintings();
  const featured = paintings.slice(0, 3);
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
      <section className='hero-gradient relative overflow-hidden rounded-[32px] border border-white/15 px-6 py-12 md:px-10 lg:px-14 lg:py-16 shadow-soft'>
        <div className='grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
          <div className='space-y-6'>
            <p className='text-sm uppercase tracking-[0.3em] text-black/60'>Curated originals</p>
            <h1 className='section-heading'>
              Buy Original Paintings Online – Trusted Art Gallery for UAE, India, USA &amp; Hong Kong
            </h1>
            <p className='max-w-2xl text-lg text-black/70'>
              Artistry is an international painting marketplace connecting collectors in Dubai, Mumbai, New York, and
              Hong Kong with certified originals, museum-grade framing, and worldwide delivery.
            </p>
            <div className='flex flex-wrap gap-3'>
              <Link href='/paintings' className='button-primary shadow-soft hover:shadow-lg hover:text-white '>
                Shop global collection
              </Link>
              <Link href='/contact' className='button-outline'>
                Talk to the curator
              </Link>
            </div>
            <div className='flex gap-6 text-sm text-black/70'>
              <div className='rounded-2xl bg-white/80 px-4 py-3 shadow-card'>
                <p className='text-2xl font-semibold text-sand-700'>30+ works</p>
                <p>One-of-a-kind originals</p>
              </div>
              <div className='rounded-2xl bg-white/80 px-4 py-3 shadow-card'>
                <p className='text-2xl font-semibold text-sand-700'>Worldwide</p>
                <p>Insured global shipping</p>
              </div>
            </div>
          </div>
          <div className='relative h-[420px] overflow-hidden rounded-3xl border border-white/15 bg-white shadow-card'>
            <Image
              src='/MainPaing.png'
              alt='Colorful abstract painting in a studio'
              fill
              className='object-cover'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-white/20 to-transparent' />
            {/* <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-4 text-sm text-black/70 backdrop-blur">
              Certified originals with authenticity certificates and global delivery.
            </div> */}
          </div>
        </div>
      </section>

      <section className='mt-16 space-y-6'>
        <h2 className='section-heading'>Trusted international art marketplace</h2>
        <div className='grid gap-6 md:grid-cols-3'>
          <div className='card-glass rounded-2xl p-5'>
            <h3 className='font-display text-2xl'>Authenticity guaranteed</h3>
            <p className='mt-2 text-black/70 text-sm'>
              Every painting ships with a signed certificate of authenticity and provenance details for collectors.
            </p>
          </div>
          <div className='card-glass rounded-2xl p-5'>
            <h3 className='font-display text-2xl'>Worldwide shipping</h3>
            <p className='mt-2 text-black/70 text-sm'>
              Gallery-grade packaging, customs guidance, and tracking for UAE, India, USA, and Hong Kong deliveries.
            </p>
          </div>
          <div className='card-glass rounded-2xl p-5'>
            <h3 className='font-display text-2xl'>Secure payments</h3>
            <p className='mt-2 text-black/70 text-sm'>
              Trusted checkout and white-glove support for collectors, designers, and hospitality teams.
            </p>
          </div>
        </div>
      </section>

      <section className='mt-16 space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='section-heading'>Featured works</h2>
          <Link href='/paintings' className='button-outline text-xs'>
            Browse all
          </Link>
        </div>
        <div className='container-grid'>
          {featured.map(painting => (
            <PaintingCard key={painting.id} painting={painting} />
          ))}
        </div>
      </section>

      <section className='mt-16 space-y-6 rounded-[28px] border border-white/15 bg-white/80 px-6 py-10 md:px-10 shadow-card'>
        <div className='flex items-center justify-between'>
          <h2 className='section-heading'>Testimonials</h2>
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
        </div>
      </section>

      <section className='mt-16 grid gap-10 rounded-[28px] border border-white/15 bg-white/80 px-6 py-10 md:grid-cols-3 md:px-10 shadow-card'>
        <div className='space-y-3'>
          <h3 className='font-display text-2xl'>Studio visits</h3>
          <p className='text-black/70 text-sm leading-relaxed'>
            View works by appointment. Private walkthroughs with curated lighting and framing guidance.
          </p>
        </div>
        <div className='space-y-3'>
          <h3 className='font-display text-2xl'>Commissions</h3>
          <p className='text-black/70 text-sm leading-relaxed'>
            Bespoke pieces tailored to your space, palette, and size requirements with design consultations.
          </p>
        </div>
        <div className='space-y-3'>
          <h3 className='font-display text-2xl'>Shipping</h3>
          <p className='text-black/70 text-sm leading-relaxed'>
            Worldwide shipping in museum-grade crates. Works ship 7–10 days after purchase.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomeClient;

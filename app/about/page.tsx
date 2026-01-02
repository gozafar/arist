import type { Metadata } from 'next';
import Image from 'next/image';
import { headers } from 'next/headers';
import { buildSeoMetadata, getCountryConfig, getCountryFromHeaders } from '@/lib/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  const country = getCountryFromHeaders(await headers());
  const config = getCountryConfig(country);
  const title = `About Rakhi Studio | ${config.label} Art Gallery`;
  const description = `Discover Rakhi Studio’s international art story and certified originals for collectors in ${config.label}.`;

  return buildSeoMetadata({
    path: '/about',
    title,
    description,
    keywords: ['artist profile', 'international art gallery', 'original art certificates'],
    country,
    ogTitle: `About the Artist – Rakhi Studio for ${config.label}`,
    ogDescription: `Learn about our global collaborations, certified originals, and worldwide shipping for ${config.label} collectors.`,
  });
};

const AboutPage = () => {
  return (
    <div className='mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16 space-y-12'>
      <div className='grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start'>
        <div className='relative mx-auto w-full max-w-[450px] aspect-square overflow-hidden rounded-3xl border border-white/15 bg-white shadow-card'>
          <Image
            src='https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80'
            alt='Rakhi Vashisht in her studio'
            fill
            priority
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
        </div>

        <div className='space-y-5'>
          <p className='text-sm uppercase tracking-[0.3em] text-white/60'>About the artist</p>
          <h1 className='section-heading'>Meet Rakhi Vashisht</h1>
          <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
            Born amidst the vibrant landscapes of Madhya Pradesh, India, Rakhi discovered her calling in colors and
            forms early on—earning Elementary and Intermediate certifications from JJ School of Arts by age ten. Though
            her academic path spanned Textile Engineering and an MBA in Finance, art remained her quiet rhythm,
            returning with renewed intensity as acrylics became her chosen language.
          </p>
          <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
            Her professional journey carried her across Delhi, Dubai, Moscow, Bangalore, and now Hong Kong—each city
            leaving its imprint on her palette. Rakhi&apos;s canvases weave bold colors, dynamic compositions, and
            emotions that resonate with viewers. Beyond her own practice, she teaches, conducts workshops, and shares
            her vision through exhibitions worldwide.
          </p>
          <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray/40'>
            Rakhi Studio serves collectors and interior designers across the UAE, India, USA, and Hong Kong with
            certified originals, provenance records, and worldwide shipping.
          </div>
        </div>
      </div>

      <div className='grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start'>
        <div className='space-y-4'>
          <h1 className='section-heading'>Artist Profile & Style</h1>

          <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
            Rakhi&apos;s art is a dance of vibrancy and detail. Bold hues and intricate strokes converge to create
            compositions that are both dynamic and contemplative, inspired by the mosaic of cultures and landscapes she
            has lived within.
          </p>
          <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
            She delights in experimentation—exploring materials, techniques, and mediums—and moves fluidly between
            abstract explorations, human figures, landscapes, and seascapes. Each piece carries a quiet poetry that
            invites reflection.
          </p>
          <h3 className='text-lg font-semibold text-white'>International collector focus</h3>
          <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
            From luxury homes in Dubai to modern apartments in Hong Kong and design-led spaces in New York and Mumbai,
            Rakhi&apos;s originals are collected for their emotional depth and investment value.
          </p>
        </div>
        <div className='relative mx-auto w-full max-w-[450px] aspect-square overflow-hidden rounded-3xl border border-white/15 bg-white shadow-card'>
          <Image
            src='https://images.unsplash.com/photo-1523419400525-dc6c1e105d58?auto=format&fit=crop&w=1400&q=80'
            alt='Rakhi Vashisht presenting her paintings'
            fill
            priority
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
        </div>
      </div>

      <div className='card-glass rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8 text-black'>
        <h2 className='section-heading mb-6'>Exhibitions Timeline</h2>

        <div className='space-y-8 text-white/85'>
          {/* EARLY */}
          <div className='relative pl-6 text-black/80'>
            <span className='absolute left-0 top-1 h-full w-px bg-white/10' />
            <p className='mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/70'>Early Years</p>

            <ul className='space-y-2 leading-relaxed'>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                <span className='text-black/70'>
                  Lalit Kala Academy, Delhi – Kalidas Mahotsav
                  <span className='text-white/60'> (1989–1992)</span>
                </span>
              </li>
            </ul>
          </div>

          {/* 2010–2016 */}
          <div className='relative pl-6 text-black/80'>
            <span className='absolute left-0 top-1 h-full w-px bg-white/10' />
            <p className='mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/70'>2010–2016</p>

            <ul className='space-y-2 leading-relaxed'>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Dubai, UAE galleries
                <span className='text-white/60'> (2010–2013)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Art fairs, Moscow, Russia
                <span className='text-white/60'> (2013–2016)</span>
              </li>
            </ul>
          </div>

          {/* 2017–2019 */}
          <div className='relative pl-6 text-black/80'>
            <span className='absolute left-0 top-1 h-full w-px bg-white/10' />
            <p className='mb-3 text-xs font-medium uppercase tracking-[0.25em] text-black/70'>2017–2019</p>

            <ul className='space-y-2 leading-relaxed'>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Group shows, Chitra Kala Parishad, Bangalore
                <span className='text-white/60'> (2017)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Chitra Santhe, Bangalore
                <span className='text-white/60'> (2018 &amp; 2019)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Venkatappa Art Gallery, Bangalore
                <span className='text-white/60'> (2018)</span>
              </li>
            </ul>
          </div>

          {/* 2020–2025 */}
          <div className='relative pl-6 text-black/80'>
            <span className='absolute left-0 top-1 h-full w-px bg-white/10' />
            <p className='mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/70'>2020–2025</p>

            <ul className='space-y-2 leading-relaxed'>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Online show “Canvas of Unity”
                <span className='text-white/60'> (2020)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                B&amp;S Arts Gallery, Sheraton, Hong Kong
                <span className='text-white/60'> (2021)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                “Streets of HK” by Watermark Church, Hong Kong
                <span className='text-white/60'> (2021)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Visual Art Center, Hong Kong
                <span className='text-white/60'> (2023)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Katha – Stories of India, HK Walls Project
                <span className='text-white/60'> (2023–2025)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Indian Consulate, Hong Kong – Republic Day &amp; Women’s Day Celebrations
                <span className='text-white/60'> (2024 &amp; 2025)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='card-glass rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8 space-y-4'>
        <h2 className='font-display text-3xl text-sand-200'>Artist Statement</h2>
        <p className='leading-relaxed text-white/80'>
          For Rakhi, art is meditation—a sanctuary where mind and soul find harmony. Each brushstroke is an offering, a
          way to inspire, provoke thought, and build bridges of connection. She believes art is both personal and
          communal, driving her to teach children, guide communities through workshops, and bring creativity into
          corporate spaces. Through her work, Rakhi reminds us that art is a reflection of the self and a celebration of
          humanity.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;

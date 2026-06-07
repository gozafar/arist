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
        <div className='relative mx-auto w-full max-w-[450px]  overflow-hidden rounded-3xl border border-white/15 bg-white shadow-card'>
          <Image
            src='/affhuijb5qpwqwcpozaw.webp'
            alt='Rakhi Vashisht presenting her paintings'
            height={1080}
            width={1920}
            className='h-auto w-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
        </div>

        <div className='space-y-5'>
          <p className='text-sm uppercase tracking-[0.3em] text-white/60'>About the artist</p>
          <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display'>Meet Rakhi Vashisht</h1>
          <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
            Born amidst the vibrant landscapes of Madhya Pradesh, India, Rakhi discovered her calling in colors and
            forms early on earning Elementary and Intermediate certifications from JJ School of Arts by age ten. Though
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
          <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display'>Artist Profile & Style</h1>

          <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
            Rakhi&apos;s art is a dance of vibrancy and detail. Bold hues and intricate strokes converge to create
            compositions that are both dynamic and contemplative, inspired by the mosaic of cultures and landscapes she
            has lived within.
          </p>
          <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
            She delights in experimentation exploring materials, techniques, and mediums and moves fluidly between
            abstract explorations, human figures, landscapes, and seascapes. Each piece carries a quiet poetry that
            invites reflection.
          </p>
          <h3 className='text-lg font-semibold'>International collector focus</h3>
          <p className='max-w-2xl text-base leading-relaxed text-black/70 md:text-[16px]'>
            From luxury homes to modern apartments and design-led spaces, Rakhi&apos;s is recognized for creating
            interiors with emotional depth and lasting investment value.
          </p>
        </div>
        <div className='relative mx-auto w-full max-w-[450px] overflow-hidden rounded-3xl border border-white/15 bg-white shadow-card'>
          <Image
            src='/20220611_122703.jpeg'
            alt='Rakhi Vashisht presenting her paintings'
            priority
            height={1080}
            width={1920}
            className='h-auto w-full object-contain'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
        </div>
      </div>

      <div className='card-glass rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8 text-black'>
        <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display mb-4'>Exhibitions Timeline</h1>

        <div className='space-y-8 text-white/85'>
          {/* 2026 */}
          <div className='relative pl-6 text-black/80'>
            <span className='absolute left-0 top-1 h-full w-px bg-white/10' />
            <p className='mb-3 text-xs font-medium uppercase tracking-[0.25em] text-sand-800 font-semibold'>2026</p>

            <ul className='space-y-2 leading-relaxed'>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Narratives on Canvas, HK Visual Arts Centre
                <span className='text-sand-800 font-semibold'> (Apr 2026)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Echoes of India, Macau
                <span className='text-sand-800 font-semibold'> (Apr 2026)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Women&apos;s Day Art Exhibition, Indian Consulate, Hong Kong
                <span className='text-sand-800 font-semibold'> (Mar 2026)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Art Exhibition, The Hive, Hong Kong
                <span className='text-sand-800 font-semibold'> (Mar 2026)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                {/* AIA Carnival by Art Future Club */}
                Art exhibition at AIA carnival by Art Future Club, Hong Kong
                <span className='text-sand-800 font-semibold'> (Jan 2026)</span>
              </li>
            </ul>
          </div>

          {/* 2020–2025 */}
          <div className='relative pl-6 text-black/80'>
            <span className='absolute left-0 top-1 h-full w-px bg-white/10' />
            <p className='mb-3 text-xs font-medium uppercase tracking-[0.25em] text-sand-800 font-semibold'>
              2020–2025
            </p>

            <ul className='space-y-2 leading-relaxed'>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Indian Consulate, Hong Kong – Republic Day &amp; Women’s Day Celebrations
                <span className='text-sand-800 font-semibold'> (2024 &amp; 2025)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Katha – Stories of India, HK Walls Project
                <span className='text-sand-800 font-semibold'> (2023–2025)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Art exhibition Visual Art Center, Hong Kong
                <span className='text-sand-800 font-semibold'> (2023)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                “Streets of HK” by Watermark Church, Hong Kong
                <span className='text-sand-800 font-semibold'> (2021)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                B&amp;S Arts Gallery, Sheraton, Hong Kong
                <span className='text-sand-800 font-semibold'> (2021)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Online show “Canvas of Unity”
                <span className='text-sand-800 font-semibold'> (2020)</span>
              </li>
            </ul>
          </div>

          {/* 2017–2019 */}
          <div className='relative pl-6 text-black/80'>
            <span className='absolute left-0 top-1 h-full w-px bg-white/10' />
            <p className='mb-3 text-xs font-medium uppercase tracking-[0.25em] text-sand-800 font-semibold'>
              2017–2019
            </p>

            <ul className='space-y-2 leading-relaxed'>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Chitra Santhe, Bangalore
                <span className='text-sand-800 font-semibold'> (2018 &amp; 2019)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Venkatappa Art Gallery, Bangalore
                <span className='text-sand-800 font-semibold'> (2018)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Group shows, Chitra Kala Parishad, Bangalore
                <span className='text-sand-800 font-semibold'> (2017)</span>
              </li>
            </ul>
          </div>

          {/* 2010–2016 */}
          <div className='relative pl-6 text-black/80'>
            <span className='absolute left-0 top-1 h-full w-px bg-white/10' />
            <p className='mb-3 text-xs uppercase tracking-[0.25em] text-sand-800 font-semibold'>2010–2016</p>

            <ul className='space-y-2 leading-relaxed'>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Art fairs, Moscow, Russia
                <span className='text-sand-800 font-semibold'> (2013–2016)</span>
              </li>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                Dubai, UAE galleries
                <span className='text-sand-800 font-semibold'> (2010–2013)</span>
              </li>
            </ul>
          </div>

          {/* EARLY */}
          <div className='relative pl-6 text-black/80'>
            <span className='absolute left-0 top-1 h-full w-px bg-white/10' />
            <p className='mb-3 text-xs font-medium uppercase tracking-[0.25em] text-sand-800 font-semibold'>
              Early Years
            </p>

            <ul className='space-y-2 leading-relaxed'>
              <li className='flex gap-3'>
                <span className='mt-2 h-2 w-2 rounded-full bg-sand-300 shrink-0' />
                <span className='text-black/70'>
                  Lalit Kala Academy, Delhi – Kalidas Mahotsav
                  <span className='text-sand-800 font-semibold'> (1989–1992)</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='card-glass rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8 space-y-4'>
        <h1 className='text-3xl md:text-4xl font-semibold text-white my font-display mb-4'>Artist Statement</h1>
        <p className=' text-base leading-relaxed text-black/70 md:text-[16px]'>
          For Rakhi&apos;s art is like meditation a sanctuary where mind and soul find harmony. Each painting becomes a
          way of reliving a memory or expressing her innermost self, capturing emotions that transcend words. Her work
          is not simply about creating visuals; it is about offering spaces where viewers can connect with something
          deeply personal yet universally human.
        </p>
        <p>
          She views art as both personal and communal, a bridge that unites people with their own journeys while
          fostering shared experiences. This belief inspires her to teach children, guide communities through workshops,
          and bring creativity into corporate spaces—ensuring that art is accessible and transformative in every
          environment.
        </p>
        <p>
          Through her practice, Rakhi reminds us that each brushstroke is an invitation to pause, to feel, to connect
          and celebrate.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;

import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { buildSeoMetadata, getCountryConfig, getCountryFromHeaders } from '@/lib/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  const country = getCountryFromHeaders(await headers());
  const config = getCountryConfig(country);
  const title = `Art Insights & Guides | ${config.label}`;
  const description = `Global art buying guides, investment insights, and styling tips for collectors in ${config.label}.`;

  return buildSeoMetadata({
    path: '/blog',
    title,
    description,
    keywords: ['art blog', 'art investment', 'wall art trends', 'collector guides'],
    country,
    ogTitle: `Art Insights for ${config.label} Collectors`,
    ogDescription: `Read global art guides, collecting tips, and trend reports curated for ${config.label}.`,
  });
};

const posts = [
  {
    title: 'Why Original Paintings Are a Smart Investment (UAE & USA)',
    summary:
      'A collector’s guide to long-term value, authenticity, and how original artworks perform in premium markets.',
  },
  {
    title: 'How to Choose Paintings for Luxury Homes in Dubai',
    summary: 'Scale, palette, and statement pieces that elevate villas, penthouses, and hospitality interiors.',
  },
  {
    title: 'Best Wall Art Trends in USA & Hong Kong',
    summary: 'A year-ahead look at color palettes, large-scale canvases, and contemporary artist favorites.',
  },
  {
    title: 'Indian Traditional Art for Global Collectors',
    summary: 'Why heritage styles remain timeless and how collectors abroad are curating Indian originals.',
  },
  {
    title: 'Abstract vs Modern Art: A Buyer’s Guide',
    summary: 'Quick comparisons, budget guidance, and styling tips to pick the right genre for your space.',
  },
];

const BlogPage = () => {
  return (
    <div className='mx-auto max-w-5xl px-4 py-12 lg:px-6 lg:py-16 space-y-8'>
      <div className='space-y-3'>
        <p className='text-sm uppercase tracking-[0.3em] text-white/60'>Art stories</p>
        <h1 className='section-heading'>Art Stories & Guides</h1>
        <p className='max-w-3xl text-white/70'>
          Global guidance for collectors in the UAE, India, USA, and Hong Kong—covering investment insights, styling
          tips, and artist stories.
        </p>
      </div>
      <div className='grid gap-6'>
        {posts.map(post => (
          <article key={post.title} className='card-glass rounded-3xl border border-white/10 bg-white/5 p-6 space-y-2'>
            <h2 className='font-display text-2xl'>{post.title}</h2>
            <p className='text-white/70'>{post.summary}</p>
            <p className='text-sm text-white/60'>Coming soon</p>
          </article>
        ))}
      </div>
      <div className='rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70'>
        Explore the{' '}
        <Link className='underline' href='/paintings#categories'>
          painting categories
        </Link>{' '}
        or browse the{' '}
        <Link className='underline' href='/paintings'>
          full gallery
        </Link>{' '}
        to start your collection.
      </div>
    </div>
  );
};

export default BlogPage;

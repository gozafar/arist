import type { MetadataRoute } from 'next';
import { buildCountryUrl, siteUrl } from '@/lib/seo';
import { dbConnect } from '@/lib/db';
import Painting from '@/models/Painting';

// Dynamic sitemap including key static pages and published paintings from MongoDB.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['', '/about', '/paintings', '/services', '/contact', '/blog'];
  const regions = ['US', 'IN', 'AE', 'HK'] as const;

  const staticPages = staticPaths.flatMap(path => {
    const baseUrl = `${siteUrl}${path}`;
    const entries = regions.map(region => ({
      url: buildCountryUrl(path || '/', region),
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    }));
    return [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: path === '' ? 1 : 0.8,
      },
      ...entries,
    ];
  });

  await dbConnect();
  const paintings = await Painting.find({}, { _id: 1, updatedAt: 1 }).lean();

  const paintingEntries =
    Array.isArray(paintings) && paintings.length
      ? paintings
          .map(p => {
            const id = typeof p._id === 'string' ? p._id : p._id?.toString?.();
            // const baseUrl = `${siteUrl}/paintings/${id}`;
            const regionEntries = regions.map(region => ({
              url: buildCountryUrl(`/paintings/${id}`, region),
              lastModified: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : new Date().toISOString(),
              changeFrequency: 'weekly' as const,
              priority: 0.7,
            }));
            return [
              {
                url: `${siteUrl}/paintings/${id}`,
                lastModified: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : new Date().toISOString(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
              },
              ...regionEntries,
            ];
          })
          .flat()
      : [];

  return [...staticPages, ...paintingEntries];
}

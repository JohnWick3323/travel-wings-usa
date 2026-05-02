import { tours } from '~/data/tours';
import { blogPosts } from '~/data/blog';
import { getAllPublishedBlogs } from '~/lib/blog.server';
import { initDb } from '~/lib/db.server';
import { SITE_URL } from '~/lib/seo';

export async function loader() {
  await initDb();
  const dbPosts = await getAllPublishedBlogs();
  const staticIds = new Set(blogPosts.map(p => p.id));
  const dbOnly = dbPosts.filter(p => !staticIds.has(p.id));
  const allPosts = [...dbOnly, ...blogPosts];

  const today = new Date().toISOString().slice(0, 10);

  const staticPages = [
    { url: '/', changefreq: 'weekly', priority: '1.0' },
    { url: '/destinations', changefreq: 'weekly', priority: '0.9' },
    { url: '/blog', changefreq: 'weekly', priority: '0.8' },
    { url: '/about', changefreq: 'monthly', priority: '0.6' },
    { url: '/contact', changefreq: 'monthly', priority: '0.7' },
    { url: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
    { url: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
  ];

  const tourPages = tours.map(tour => ({
    url: `/tour/${tour.id}`,
    changefreq: 'monthly' as const,
    priority: '0.8',
  }));

  const blogPages = allPosts.map(post => ({
    url: `/blog/${post.id}`,
    changefreq: 'monthly' as const,
    priority: '0.7',
  }));

  const allPages = [...staticPages, ...tourPages, ...blogPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

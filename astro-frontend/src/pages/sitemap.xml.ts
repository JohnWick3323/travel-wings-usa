import type { APIRoute } from 'astro';
import { getTours, getBlogPosts } from '~/lib/wordpress';

export const GET: APIRoute = async () => {
  const [tours, posts] = await Promise.all([getTours(), getBlogPosts()]);
  const today = new Date().toISOString().slice(0, 10);
  const siteUrl = 'https://travelwingsusa.com';

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/destinations', priority: '0.9', changefreq: 'weekly' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
  ];

  const tourPages = tours.map((t) => ({ url: `/tour/${t.id}`, priority: '0.8', changefreq: 'monthly' }));
  const blogPages = posts.map((p) => ({ url: `/blog/${p.id}`, priority: '0.7', changefreq: 'monthly' }));
  const all = [...staticPages, ...tourPages, ...blogPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((p) => `  <url>
    <loc>${siteUrl}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};

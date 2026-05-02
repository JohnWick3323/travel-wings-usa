import type { Route } from './+types/blog';
import { BlogPageHero } from '~/blocks/blog/blog-page-hero';
import { BlogGrid } from '~/blocks/blog/blog-grid';
import { NewsletterSignupStrip } from '~/blocks/blog/newsletter-signup-strip';
import { blogPosts } from '~/data/blog';
import { getAllPublishedBlogs } from '~/lib/blog.server';
import { generateSeoMeta, SITE_URL } from '~/lib/seo';
import styles from './blog.module.css';

export function meta(_: Route.MetaArgs) {
  return generateSeoMeta({
    title: 'Travel Blog & Tips - Travel Wings USA',
    description: 'Travel tips, destination guides, Umrah preparation, and air travel advice from Travel Wings USA. Expert insights for smart travelers.',
    url: `${SITE_URL}/blog`,
    image: `${SITE_URL}/assets/images/extracted/blog-hero.jpg`,
  });
}

export async function loader() {
  const dbPosts = await getAllPublishedBlogs();
  // Merge: DB posts first (newest), then static posts
  const staticIds = new Set(blogPosts.map(p => p.id));
  const dbOnly = dbPosts.filter(p => !staticIds.has(p.id));
  return { posts: [...dbOnly, ...blogPosts] };
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  return (
    <main className={styles.page}>
      <BlogPageHero />
      <div className={styles.content}>
        <BlogGrid posts={posts} />
      </div>
      <NewsletterSignupStrip />
    </main>
  );
}

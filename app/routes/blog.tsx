import type { Route } from './+types/blog';
import { BlogPageHero } from '~/blocks/blog/blog-page-hero';
import { BlogGrid } from '~/blocks/blog/blog-grid';
import { NewsletterSignupStrip } from '~/blocks/blog/newsletter-signup-strip';
import { blogPosts } from '~/data/blog';
import styles from './blog.module.css';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Travel Blog & Tips - Travel Wings USA' },
    { name: 'description', content: 'Travel tips, destination guides, Umrah preparation, and air travel advice from Travel Wings USA.' },
  ];
}

export default function Blog() {
  return (
    <main className={styles.page}>
      <BlogPageHero />
      <div className={styles.content}>
        <BlogGrid posts={blogPosts} />
      </div>
      <NewsletterSignupStrip />
    </main>
  );
}

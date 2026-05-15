import cn from 'classnames';
import type { BlogPost } from '~/lib/wordpress';
import styles from './latest-blog-preview.module.css';

interface Props {
  posts?: BlogPost[];
  className?: string;
}

export function LatestBlogPreview({ posts = [], className }: Props) {
  const previewPosts = posts.slice(0, 3);

  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <span className={styles.sectionLabel}>Travel Blog</span>
            <h2 className={styles.title}>Latest Travel Tips and News</h2>
          </div>
          <a href="/blog" className={styles.viewAll}>View All</a>
        </div>
        <div className={styles.grid}>
          {previewPosts.map(post => (
            <a key={post.id} href={`/blog/${post.id}`} className={styles.card}>
              <img src={post.image} alt={post.title} className={styles.cardImg} loading="lazy" />
              <div className={styles.cardOverlay} />
              <span className={styles.dateBadge}>{post.date}</span>
              <div className={styles.cardContent}>
                <span className={styles.category}>{post.category}</span>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

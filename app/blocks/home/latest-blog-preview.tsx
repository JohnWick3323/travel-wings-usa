import { Link } from 'react-router';
import cn from 'classnames';
import { blogPosts } from '~/data/blog';
import styles from './latest-blog-preview.module.css';

const previewPosts = blogPosts.slice(0, 3);

interface Props {
  className?: string;
}

export function LatestBlogPreview({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <span className={styles.sectionLabel}>Travel Blog</span>
            <h2 className={styles.title}>Latest Travel Tips and News</h2>
          </div>
          <Link to="/blog" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.grid}>
          {previewPosts.map(post => (
            <Link key={post.id} to={`/blog/${post.id}`} className={styles.card}>
              <img src={post.image} alt={post.title} className={styles.cardImg} loading="lazy" />
              <div className={styles.cardOverlay} />
              <span className={styles.dateBadge}>{post.date}</span>
              <div className={styles.cardContent}>
                <span className={styles.category}>{post.category}</span>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

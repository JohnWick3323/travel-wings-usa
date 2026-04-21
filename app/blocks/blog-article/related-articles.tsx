import { Link } from 'react-router';
import cn from 'classnames';
import type { BlogPost } from '~/data/blog';
import styles from './related-articles.module.css';

interface Props {
  posts: BlogPost[];
  className?: string;
}

export function RelatedArticles({ posts, className }: Props) {
  if (posts.length === 0) return null;
  return (
    <section className={cn(styles.section, className)}>
      <h2 className={styles.title}>More Travel Reads</h2>
      <div className={styles.grid}>
        {posts.map(post => (
          <Link key={post.id} to={`/blog/${post.id}`} className={styles.card}>
            <img src={post.image} alt={post.title} className={styles.img} loading="lazy" />
            <div className={styles.overlay} />
            <div className={styles.content}>
              <span className={styles.cat}>{post.category}</span>
              <h3 className={styles.cardTitle}>{post.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

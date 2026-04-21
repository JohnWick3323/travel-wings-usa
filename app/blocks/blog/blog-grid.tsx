import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import cn from 'classnames';
import type { BlogPost } from '~/data/blog';
import styles from './blog-grid.module.css';

interface Props {
  posts: BlogPost[];
  className?: string;
}

export function BlogGrid({ posts, className }: Props) {
  return (
    <div className={cn(styles.grid, className)}>
      {posts.map(post => (
        <Link key={post.id} to={`/blog/${post.id}`} className={styles.card}>
          <img src={post.image} alt={post.title} className={styles.cardImg} loading="lazy" />
          <div className={styles.overlay} />
          <span className={styles.dateBadge}>{post.date}</span>
          <div className={styles.cardContent}>
            <span className={styles.category}>{post.category}</span>
            <h3 className={styles.cardTitle}>{post.title}</h3>
            <p className={styles.excerpt}>{post.excerpt}</p>
            <span className={styles.readMore}>Read More <ArrowRight size={12} /></span>
          </div>
        </Link>
      ))}
    </div>
  );
}

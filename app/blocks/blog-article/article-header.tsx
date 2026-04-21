import { Calendar, User, Clock } from 'lucide-react';
import cn from 'classnames';
import type { BlogPost } from '~/data/blog';
import styles from './article-header.module.css';

interface Props {
  post: BlogPost;
  className?: string;
}

export function ArticleHeader({ post, className }: Props) {
  return (
    <div className={cn(styles.header, className)}>
      <div className={styles.bg} style={{ backgroundImage: `url(${post.image})` }} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.category}>{post.category}</span>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <span className={styles.metaItem}><Calendar size={14} /> {post.date}</span>
          <span className={styles.metaItem}><User size={14} /> {post.author}</span>
          <span className={styles.metaItem}><Clock size={14} /> {post.readTime}</span>
        </div>
      </div>
    </div>
  );
}

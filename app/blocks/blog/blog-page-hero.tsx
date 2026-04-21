import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import cn from 'classnames';
import styles from './blog-page-hero.module.css';

interface Props { className?: string; }

export function BlogPageHero({ className }: Props) {
  return (
    <div className={cn(styles.hero, className)}>
      <div className={styles.bg} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80)' }} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>Travel Blog and Tips</h1>
        <nav className={styles.breadcrumb}>
          <Link to="/" className={styles.bLink}>Home</Link>
          <ChevronRight size={14} className={styles.bSep} />
          <span className={styles.bCurrent}>Blog</span>
        </nav>
      </div>
    </div>
  );
}

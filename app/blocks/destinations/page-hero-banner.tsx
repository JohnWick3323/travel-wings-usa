import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import cn from 'classnames';
import styles from './page-hero-banner.module.css';

interface Props {
  className?: string;
}

export function PageHeroBanner({ className }: Props) {
  return (
    <div className={cn(styles.hero, className)}>
      <div className={styles.bg} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80)' }} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>All Destinations and Packages</h1>
        <nav className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <ChevronRight size={14} className={styles.breadcrumbSep} />
          <span className={styles.breadcrumbCurrent}>Destinations</span>
        </nav>
      </div>
    </div>
  );
}

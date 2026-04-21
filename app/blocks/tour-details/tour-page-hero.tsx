import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import cn from 'classnames';
import type { Tour } from '~/data/tours';
import styles from './tour-page-hero.module.css';

interface Props {
  tour: Tour;
  className?: string;
}

export function TourPageHero({ tour, className }: Props) {
  return (
    <div className={cn(styles.hero, className)}>
      <div className={styles.bg} style={{ backgroundImage: `url(${tour.images[0]})` }} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>{tour.title}</h1>
        <nav className={styles.breadcrumb}>
          <Link to="/" className={styles.bLink}>Home</Link>
          <ChevronRight size={14} className={styles.bSep} />
          <Link to="/destinations" className={styles.bLink}>Destinations</Link>
          <ChevronRight size={14} className={styles.bSep} />
          <span className={styles.bCurrent}>{tour.title}</span>
        </nav>
      </div>
    </div>
  );
}

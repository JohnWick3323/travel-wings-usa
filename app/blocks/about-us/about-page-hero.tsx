import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import cn from 'classnames';
import styles from './about-page-hero.module.css';

interface Props { className?: string; }

export function AboutPageHero({ className }: Props) {
  return (
    <div className={cn(styles.hero, className)}>
      <div className={styles.bg} style={{ backgroundImage: 'url(/assets/images/extracted/hero-slider-1.jpg)' }} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>About Travel Wings USA</h1>
        <nav className={styles.breadcrumb}>
          <Link to="/" className={styles.bLink}>Home</Link>
          <ChevronRight size={14} className={styles.bSep} />
          <span className={styles.bCurrent}>About Us</span>
        </nav>
      </div>
    </div>
  );
}

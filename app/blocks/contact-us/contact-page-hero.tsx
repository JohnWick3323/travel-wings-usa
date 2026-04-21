import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import cn from 'classnames';
import styles from './contact-page-hero.module.css';

interface Props { className?: string; }

export function ContactPageHero({ className }: Props) {
  return (
    <div className={cn(styles.hero, className)}>
      <div className={styles.bg} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)' }} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>Contact Travel Wings USA</h1>
        <p className={styles.subtitle}>We are here to help you plan your perfect trip</p>
        <nav className={styles.breadcrumb}>
          <Link to="/" className={styles.bLink}>Home</Link>
          <ChevronRight size={14} className={styles.bSep} />
          <span className={styles.bCurrent}>Contact</span>
        </nav>
      </div>
    </div>
  );
}

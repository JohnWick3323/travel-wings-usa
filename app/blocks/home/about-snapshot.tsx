import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import cn from 'classnames';
import styles from './about-snapshot.module.css';

interface Props {
  className?: string;
}

export function AboutSnapshot({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <div className={styles.imageCollage}>
          <img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80" alt="Umrah" className={styles.img1} loading="lazy" />
          <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80" alt="Dubai" className={styles.img2} loading="lazy" />
          <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80" alt="Paris" className={styles.img3} loading="lazy" />
          <div className={styles.expBadge}>
            <span className={styles.expNum}>15+</span>
            <span className={styles.expLabel}>Years Experience</span>
          </div>
        </div>

        <div className={styles.content}>
          <span className={styles.sectionLabel}>Get to Know Us</span>
          <h2 className={styles.title}>Experience the World with Our Company</h2>
          <p className={styles.desc}>
            Travel Wings USA is a Maryland-based travel agency specializing in Umrah and Hajj packages, international air ticketing, and custom vacation tours. Located in Gwynn Oak, MD, our experienced team is dedicated to making your travel dreams a reality.
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>5K+</span>
              <span className={styles.statLabel}>Happy Travelers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>50+</span>
              <span className={styles.statLabel}>Destinations</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>15+</span>
              <span className={styles.statLabel}>Years Experience</span>
            </div>
          </div>
          <Link to="/about" className={styles.btn}>Learn More <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}

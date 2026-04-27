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
          <img src="/assets/images/extracted/hero-slider-2.jpg" alt="Umrah" className={styles.img1} loading="lazy" />
          <img src="/assets/images/extracted/tour-dubai.jpg" alt="Dubai" className={styles.img2} loading="lazy" />
          <img src="/assets/images/extracted/hero-slider-3.jpg" alt="Paris" className={styles.img3} loading="lazy" />
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

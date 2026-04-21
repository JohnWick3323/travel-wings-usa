import { Link } from 'react-router';
import { Star, MapPin } from 'lucide-react';
import cn from 'classnames';
import { tours } from '~/data/tours';
import styles from './featured-tours-slider.module.css';

const featuredTours = tours.slice(0, 6);

interface Props {
  className?: string;
}

export function FeaturedToursSlider({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.overlay} />
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Our Packages</span>
          <h2 className={styles.title}>Most Popular Tours</h2>
        </div>
        <div className={styles.slider}>
          {featuredTours.map(tour => (
            <div key={tour.id} className={styles.card}>
              <div className={styles.cardImage}>
                <img src={tour.image} alt={tour.title} className={styles.cardImg} loading="lazy" />
                <span className={styles.durationBadge}>{tour.duration}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.stars}>
                  {Array.from({ length: tour.rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <h3 className={styles.cardTitle}>{tour.title}</h3>
                <div className={styles.destination}><MapPin size={12} /> {tour.destination}</div>
                <Link to={`/tour/${tour.id}`} className={styles.quoteBtn}>Get Quote</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

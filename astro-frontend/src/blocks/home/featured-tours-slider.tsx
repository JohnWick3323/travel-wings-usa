import { Star, MapPin } from 'lucide-react';
import cn from 'classnames';
import type { Tour } from '~/lib/wordpress';
import styles from './featured-tours-slider.module.css';

interface Props {
  tours?: Tour[];
  className?: string;
}

export function FeaturedToursSlider({ tours = [], className }: Props) {
  const featuredTours = tours.slice(0, 6);

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
                <a href={`/tour/${tour.id}`} className={styles.quoteBtn}>Get Quote</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

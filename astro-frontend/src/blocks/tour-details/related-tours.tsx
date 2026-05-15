import cn from 'classnames';
import type { Tour } from '~/lib/wordpress';
import styles from './related-tours.module.css';

interface Props {
  tours: Tour[];
  className?: string;
}

export function RelatedTours({ tours, className }: Props) {
  if (tours.length === 0) return null;
  return (
    <section className={cn(styles.section, className)}>
      <h2 className={styles.title}>You May Also Like</h2>
      <div className={styles.grid}>
        {tours.map(tour => (
          <a key={tour.id} href={`/tour/${tour.id}`} className={styles.card}>
            <img src={tour.image} alt={tour.title} className={styles.img} loading="lazy" />
            <div className={styles.body}>
              <h3 className={styles.cardTitle}>{tour.title}</h3>
              <span className={styles.duration}>{tour.duration}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

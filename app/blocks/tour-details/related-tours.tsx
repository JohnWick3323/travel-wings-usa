import { Link } from 'react-router';
import cn from 'classnames';
import type { Tour } from '~/data/tours';
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
          <Link key={tour.id} to={`/tour/${tour.id}`} className={styles.card}>
            <img src={tour.image} alt={tour.title} className={styles.img} loading="lazy" />
            <div className={styles.body}>
              <h3 className={styles.cardTitle}>{tour.title}</h3>
              <span className={styles.duration}>{tour.duration}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

import { Link } from 'react-router';
import { MapPin, Clock } from 'lucide-react';
import cn from 'classnames';
import type { Tour } from '~/data/tours';
import styles from './tours-grid.module.css';

interface Props {
  className?: string;
  tours: Tour[];
}

export function ToursGrid({ className, tours }: Props) {
  return (
    <div className={cn(styles.grid, className)}>
      {tours.length === 0 && (
        <div className={styles.empty}>
          <p>No packages found matching your criteria. Try adjusting your filters.</p>
        </div>
      )}
      {tours.map(tour => (
        <div key={tour.id} className={styles.card}>
          <div className={styles.imageWrap}>
            <img src={tour.image} alt={tour.title} className={styles.cardImg} loading="lazy" />
            <span className={cn(styles.categoryBadge, styles[tour.category])}>{tour.category.replace('-', ' ')}</span>
          </div>
          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>{tour.title}</h3>
            <div className={styles.metaRow}>
              <span className={styles.meta}><MapPin size={12} /> {tour.destination}</span>
              <span className={styles.meta}><Clock size={12} /> {tour.duration}</span>
            </div>
            <Link to={`/tour/${tour.id}`} className={styles.viewBtn}>View Details</Link>
          </div>
        </div>
      ))}
    </div>
  );
}

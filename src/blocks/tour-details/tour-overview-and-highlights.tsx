import { Clock, MapPin, Users, Tag, CheckCircle } from 'lucide-react';
import cn from 'classnames';
import type { Tour } from '~/lib/wordpress';
import styles from './tour-overview-and-highlights.module.css';

interface Props {
  tour: Tour;
  className?: string;
}

export function TourOverviewAndHighlights({ tour, className }: Props) {
  return (
    <div className={cn(styles.wrap, className)}>
      <div className={styles.badges}>
        <span className={styles.badge}><Clock size={14} /> {tour.duration}</span>
        <span className={styles.badge}><MapPin size={14} /> {tour.destination}</span>
        <span className={styles.badge}><Users size={14} /> {tour.groupSize}</span>
        <span className={styles.badge}><Tag size={14} /> {tour.category}</span>
      </div>

      {tour.description && (
        <p className={styles.desc}>{tour.description}</p>
      )}

      {tour.highlights.length > 0 && (
        <>
          <h3 className={styles.highlightsTitle}>Tour Highlights</h3>
          <ul className={styles.highlights}>
            {tour.highlights.map(h => (
              <li key={h} className={styles.highlight}>
                <CheckCircle size={16} className={styles.highlightIcon} />
                {h}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

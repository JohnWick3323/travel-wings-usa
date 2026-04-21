import { CheckCircle, XCircle } from 'lucide-react';
import cn from 'classnames';
import type { Tour } from '~/data/tours';
import styles from './inclusions-and-exclusions.module.css';

interface Props {
  tour: Tour;
  className?: string;
}

export function InclusionsAndExclusions({ tour, className }: Props) {
  return (
    <div className={cn(styles.grid, className)}>
      <div className={styles.col}>
        <h3 className={styles.colTitle}><CheckCircle size={18} color="var(--color-success)" /> Included</h3>
        <ul className={styles.list}>
          {tour.inclusions.map(item => (
            <li key={item} className={styles.item}>
              <CheckCircle size={14} className={styles.iconInclude} />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.col}>
        <h3 className={styles.colTitle}><XCircle size={18} color="var(--color-error)" /> Not Included</h3>
        <ul className={styles.list}>
          {tour.exclusions.map(item => (
            <li key={item} className={styles.item}>
              <XCircle size={14} className={styles.iconExclude} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

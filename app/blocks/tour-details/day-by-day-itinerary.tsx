import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import cn from 'classnames';
import type { Tour } from '~/data/tours';
import styles from './day-by-day-itinerary.module.css';

interface Props {
  tour: Tour;
  className?: string;
}

export function DayByDayItinerary({ tour, className }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className={cn(styles.accordion, className)}>
      {tour.itinerary.map((day, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.header} onClick={() => setOpenIdx(openIdx === i ? null : i)}>
            <div className={styles.dayLabel}>
              <span className={styles.dayBadge}>{day.day}</span>
              <h4 className={styles.dayTitle}>Day {day.day}: {day.title}</h4>
            </div>
            <ChevronDown size={18} className={cn(styles.chevron, { [styles.open]: openIdx === i })} />
          </div>
          <div className={cn(styles.body, { [styles.open]: openIdx === i })}>
            <ul className={styles.activities}>
              {day.activities.map(activity => (
                <li key={activity} className={styles.activity}>
                  <span className={styles.dot} />
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

import { Clock, MapPin, Users, Tag, CheckCircle } from 'lucide-react';
import cn from 'classnames';
import type { Tour } from '~/data/tours';
import styles from './tour-overview-and-highlights.module.css';

interface Props {
  tour: Tour;
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const TABS = ['Overview', 'Itinerary', 'Inclusions', 'FAQs'];

export function TourOverviewAndHighlights({ tour, activeTab, onTabChange, className }: Props) {
  return (
    <div className={cn(styles.wrap, className)}>
      <div className={styles.badges}>
        <span className={styles.badge}><Clock size={14} /> {tour.duration}</span>
        <span className={styles.badge}><MapPin size={14} /> {tour.destination}</span>
        <span className={styles.badge}><Users size={14} /> {tour.groupSize}</span>
        <span className={styles.badge}><Tag size={14} /> {tour.category}</span>
      </div>

      <p className={styles.desc}>{tour.description}</p>

      <h3 className={styles.highlightsTitle}>Tour Highlights</h3>
      <ul className={styles.highlights}>
        {tour.highlights.map(h => (
          <li key={h} className={styles.highlight}>
            <CheckCircle size={16} className={styles.highlightIcon} />
            {h}
          </li>
        ))}
      </ul>

      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button key={tab} className={cn(styles.tab, { [styles.active]: activeTab === tab })} onClick={() => onTabChange(tab)}>{tab}</button>
        ))}
      </div>
    </div>
  );
}

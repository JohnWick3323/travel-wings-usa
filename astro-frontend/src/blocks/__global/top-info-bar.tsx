import { MapPin, Mail } from 'lucide-react';
import cn from 'classnames';
import styles from './top-info-bar.module.css';

interface Props {
  className?: string;
}

export function TopInfoBar({ className }: Props) {
  return (
    <div className={cn(styles.bar, className)}>
      <div className={styles.info}>
        <a href="https://maps.google.com/?q=1724+Woodlawn+Dr+Suite+12+Gwynn+Oak+MD+21207" target="_blank" rel="noreferrer" className={styles.infoItem}>
          <MapPin size={12} />
          1724 Woodlawn Dr Suite 12, Gwynn Oak, MD 21207
        </a>
        <a href="mailto:info@travelwingsusa.com" className={styles.infoItem}>
          <Mail size={12} />
          info@travelwingsusa.com
        </a>
      </div>
      <div className={styles.social}>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Facebook">
          <span style={{ fontSize: 10, fontWeight: 700 }}>f</span>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram">
          <span style={{ fontSize: 10, fontWeight: 700 }}>in</span>
        </a>
        <a href="https://google.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Google">
          <span style={{ fontSize: 10, fontWeight: 700 }}>G</span>
        </a>
      </div>
    </div>
  );
}

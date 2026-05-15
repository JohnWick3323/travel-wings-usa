import { MapPin, Phone, Mail } from 'lucide-react';
import cn from 'classnames';
import styles from './contact-details-cards.module.css';

interface Props { className?: string; }

export function ContactDetailsCards({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.iconWrap}><MapPin size={28} /></div>
          <h3 className={styles.cardTitle}>Our Location</h3>
          <p className={styles.cardText}>1724 Woodlawn Dr Suite 12,<br />Gwynn Oak, MD 21207</p>
        </div>
        <div className={styles.card}>
          <div className={styles.iconWrap}><Phone size={28} /></div>
          <h3 className={styles.cardTitle}>Phone & Fax</h3>
          <p className={styles.cardText}>
            <a href="tel:+14102984500" className={styles.link}>+1 (410) 298-4500</a><br />
            Fax: 410-298-5500
          </p>
        </div>
        <div className={styles.card}>
          <div className={styles.iconWrap}><Mail size={28} /></div>
          <h3 className={styles.cardTitle}>Email Us</h3>
          <p className={styles.cardText}>
            <a href="mailto:info@travelwingsusa.com" className={styles.link}>info@travelwingsusa.com</a>
          </p>
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router';
import { Phone } from 'lucide-react';
import cn from 'classnames';
import styles from './final-cta-banner.module.css';

interface Props {
  className?: string;
}

export function FinalCtaBanner({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h2 className={styles.title}>Ready to Plan Your Dream Trip?</h2>
        <p className={styles.subtitle}>Contact us today and let our experts create the perfect package for you.</p>
        <div className={styles.actions}>
          <Link to="/contact" className={styles.btnBlue}>Request a Quote</Link>
          <a href="tel:+14102984500" className={styles.btnOrange}><Phone size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Call Now: +1 410-298-4500</a>
        </div>
      </div>
    </section>
  );
}

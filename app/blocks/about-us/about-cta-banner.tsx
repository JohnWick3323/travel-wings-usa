import { Link } from 'react-router';
import cn from 'classnames';
import styles from './about-cta-banner.module.css';

interface Props { className?: string; }

export function AboutCtaBanner({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h2 className={styles.title}>Ready to Start Your Journey?</h2>
        <p className={styles.subtitle}>Let our travel experts plan the perfect package tailored to your needs and budget.</p>
        <div className={styles.actions}>
          <Link to="/contact" className={styles.btnBlue}>Request a Quote</Link>
          <a href="tel:+14102984500" className={styles.btnOrange}>Call +1 410-298-4500</a>
        </div>
      </div>
    </section>
  );
}

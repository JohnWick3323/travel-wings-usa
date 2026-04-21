import { Phone, MessageCircle } from 'lucide-react';
import cn from 'classnames';
import styles from './direct-contact-cta-strip.module.css';

interface Props { className?: string; }

export function DirectContactCtaStrip({ className }: Props) {
  return (
    <div className={cn(styles.strip, className)}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Prefer to Talk Directly?</h2>
        <div className={styles.actions}>
          <a href="tel:+14102984500" className={styles.btnCall}><Phone size={20} /> Call Now: +1 410-298-4500</a>
          <a href="https://wa.me/14102984500?text=Hello%2C%20I%20am%20interested%20in%20a%20travel%20package.%20Please%20assist%20me." target="_blank" rel="noreferrer" className={styles.btnWa}><MessageCircle size={20} /> Chat on WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

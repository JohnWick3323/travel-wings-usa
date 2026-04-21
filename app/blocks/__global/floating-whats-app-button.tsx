import { MessageCircle } from 'lucide-react';
import cn from 'classnames';
import styles from './floating-whats-app-button.module.css';

interface Props {
  className?: string;
}

export function FloatingWhatsAppButton({ className }: Props) {
  return (
    <a
      href="https://wa.me/14102984500?text=Hello%2C%20I%20am%20interested%20in%20a%20travel%20package.%20Please%20assist%20me."
      target="_blank"
      rel="noreferrer"
      className={cn(styles.btn, className)}
      aria-label="Chat on WhatsApp"
    >
      <div className={styles.pulse} />
      <MessageCircle size={26} color="white" fill="white" />
    </a>
  );
}

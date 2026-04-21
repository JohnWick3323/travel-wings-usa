import cn from 'classnames';
import styles from './footer-bottom-bar.module.css';

interface Props {
  className?: string;
}

export function FooterBottomBar({ className }: Props) {
  return (
    <div className={cn(styles.bar, className)}>
      <div className={styles.inner}>
        <span>&copy; 2025 Travel Wings USA. All Rights Reserved.</span>
        <div className={styles.links}>
          <a href="#" className={styles.link}>Privacy Policy</a>
          <a href="#" className={styles.link}>Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

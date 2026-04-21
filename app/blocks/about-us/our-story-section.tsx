import cn from 'classnames';
import styles from './our-story-section.module.css';

interface Props { className?: string; }

export function OurStorySection({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <div className={styles.imageCollage}>
          <img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80" alt="Umrah" className={styles.img1} loading="lazy" />
          <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80" alt="Dubai" className={styles.img2} loading="lazy" />
          <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80" alt="Paris" className={styles.img3} loading="lazy" />
        </div>
        <div className={styles.content}>
          <span className={styles.sectionLabel}>Get to Know Us</span>
          <h2 className={styles.title}>Experience the World with Travel Wings USA</h2>
          <p className={styles.desc}>Travel Wings USA is a Maryland-based travel agency founded to serve the needs of the American Muslim community and beyond. Located in Gwynn Oak, MD, we specialize in Umrah and Hajj packages, international air ticketing (Pakistan, Saudi Arabia, UAE, India, UK, Europe), and custom vacation tours worldwide.</p>
          <p className={styles.desc}>Our dedicated team of experienced travel consultants is committed to making every journey seamless, spiritual, and memorable. We have served over 5,000 happy travelers and take pride in our personalized approach to every booking.</p>
          <div className={styles.stats}>
            <div className={styles.stat}><span className={styles.statNum}>5K+</span><span className={styles.statLabel}>Happy Travelers</span></div>
            <div className={styles.stat}><span className={styles.statNum}>50+</span><span className={styles.statLabel}>Destinations</span></div>
            <div className={styles.stat}><span className={styles.statNum}>15+</span><span className={styles.statLabel}>Years Experience</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

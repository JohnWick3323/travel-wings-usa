import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import cn from 'classnames';
import styles from './hero-slider.module.css';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=85',
    subtitle: 'Begin Your Adventure',
    title: 'The First Step of Your Travel Expedition',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=85',
    subtitle: 'Spiritual Journeys',
    title: 'Your Umrah Journey Departing Worldwide',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1920&q=85',
    subtitle: 'Explore the World',
    title: 'Discover, Dream, Travel',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className={styles.slider}>
      {slides.map((slide, i) => (
        <div key={slide.id} className={cn(styles.slide, { [styles.active]: i === current })}>
          <div className={styles.bg} style={{ backgroundImage: `url(${slide.image})` }} />
          <div className={styles.overlay} />
          <div className={styles.content}>
            <p className={styles.subtitle}>{slide.subtitle}</p>
            <h1 className={styles.title}>{slide.title}</h1>
            <div className={styles.actions}>
              <Link to="/destinations" className={styles.btnPrimary}>Explore Tours</Link>
              <Link to="/contact" className={styles.btnOutline}>Get a Quote</Link>
            </div>
          </div>
        </div>
      ))}

      <div className={styles.arrows}>
        <button className={styles.arrow} onClick={prev} aria-label="Previous slide"><ChevronLeft size={20} /></button>
        <button className={styles.arrow} onClick={next} aria-label="Next slide"><ChevronRight size={20} /></button>
      </div>

      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button key={i} className={cn(styles.dot, { [styles.activeDot]: i === current })} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

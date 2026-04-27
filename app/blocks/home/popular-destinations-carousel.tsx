import { Link } from 'react-router';
import { MapPin } from 'lucide-react';
import cn from 'classnames';
import styles from './popular-destinations-carousel.module.css';

const destinations = [
  { name: 'Makkah', country: 'Saudi Arabia', image: '/assets/images/extracted/hero-slider-2.jpg', href: '/tour/umrah-package-2025' },
  { name: 'Baghdad', country: 'Iraq', image: '/assets/images/extracted/tour-baghdad.jpg', href: '/tour/baghdad-city-package' },
  { name: 'Dubai', country: 'UAE', image: '/assets/images/extracted/tour-dubai.jpg', href: '/tour/uae-dubai-package' },
  { name: 'Singapore', country: 'Singapore', image: '/assets/images/extracted/tour-singapore.jpg', href: '/tour/singapore-city-escape' },
  { name: 'Paris', country: 'France', image: '/assets/images/extracted/hero-slider-3.jpg', href: '/tour/paris-getaway-package' },
  { name: 'London', country: 'United Kingdom', image: '/assets/images/extracted/tour-london.jpg', href: '/tour/london-package-7-nights' },
  { name: 'Malaysia', country: 'Malaysia', image: '/assets/images/extracted/tour-malaysia.jpg', href: '/tour/malaysia-tour' },
  { name: 'Istanbul', country: 'Turkey', image: '/assets/images/extracted/tour-istanbul.jpg', href: '/tour/turkey-package' },
  { name: 'Switzerland', country: 'Switzerland', image: '/assets/images/extracted/switzerland-main.jpg', href: '/tour/switzerland-tour' },
];

interface Props {
  className?: string;
}

export function PopularDestinationsCarousel({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <span className={styles.sectionLabel}>Top Picks</span>
            <h2 className={styles.title}>Popular Destinations</h2>
          </div>
          <Link to="/destinations" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.carousel}>
          {destinations.map(dest => (
            <Link key={dest.name} to={dest.href} className={styles.card}>
              <img src={dest.image} alt={dest.name} className={styles.cardImg} loading="lazy" />
              <div className={styles.cardOverlay} />
              <div className={styles.cardContent}>
                <h3 className={styles.destName}>{dest.name}</h3>
                <span className={styles.destCountry}><MapPin size={12} /> {dest.country}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

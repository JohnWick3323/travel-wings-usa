import { Link } from 'react-router';
import { MapPin } from 'lucide-react';
import cn from 'classnames';
import styles from './popular-destinations-carousel.module.css';

const destinations = [
  { name: 'Makkah', country: 'Saudi Arabia', image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80', href: '/tour/umrah-package-2025' },
  { name: 'Baghdad', country: 'Iraq', image: 'https://images.unsplash.com/photo-1548783300-88f4a5f94fa2?w=600&q=80', href: '/tour/baghdad-city-package' },
  { name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', href: '/tour/uae-dubai-package' },
  { name: 'Singapore', country: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80', href: '/tour/singapore-city-escape' },
  { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80', href: '/tour/paris-getaway-package' },
  { name: 'London', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80', href: '/tour/london-package-7-nights' },
  { name: 'Malaysia', country: 'Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f11?w=600&q=80', href: '/tour/malaysia-tour' },
  { name: 'Istanbul', country: 'Turkey', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80', href: '/tour/turkey-package' },
  { name: 'Switzerland', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', href: '/tour/switzerland-tour' },
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

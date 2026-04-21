import { Star } from 'lucide-react';
import cn from 'classnames';
import styles from './customer-testimonials.module.css';

const testimonials = [
  { name: 'Ahmad Hassan', location: 'Baltimore, MD', rating: 5, quote: 'Travel Wings USA made our Umrah journey absolutely seamless. Every detail was taken care of from visa to hotel near the Haram. Highly recommended!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { name: 'Fatima Al-Rashid', location: 'Washington, DC', rating: 5, quote: 'We had an amazing Paris trip arranged by Travel Wings. The team was so helpful and responsive. Will definitely book again for our next adventure!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { name: 'Mohammed Khan', location: 'New York, NY', rating: 5, quote: 'Best travel agency for flights to Pakistan. They got us great fares and the process was stress-free. Our whole family has used them multiple times.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' },
  { name: 'Sarah Johnson', location: 'Chicago, IL', rating: 5, quote: 'The Dubai package was incredible! Everything from hotel to desert safari was perfectly arranged. Cannot wait to book another trip with Travel Wings USA.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { name: 'Ibrahim Siddiqui', location: 'Houston, TX', rating: 5, quote: 'Hajj package 2024 was life-changing. The team provided excellent support throughout the entire pilgrimage. JazakAllah khair for making this possible.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
  { name: 'Aisha Williams', location: 'Philadelphia, PA', rating: 4, quote: 'Very professional agency. Our Turkey trip was well-planned and the guide was knowledgeable. Cappadocia was breathtaking. Great value for money!', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
];

interface Props {
  className?: string;
}

export function CustomerTestimonials({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Reviews</span>
          <h2 className={styles.title}>What Our Travelers Are Saying</h2>
        </div>
        <div className={styles.grid}>
          {testimonials.map(t => (
            <div key={t.name} className={styles.card}>
              <div className={styles.stars}>
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
              <div className={styles.author}>
                <img src={t.avatar} alt={t.name} className={styles.avatar} loading="lazy" />
                <div>
                  <span className={styles.authorName}>{t.name}</span>
                  <span className={styles.authorLocation}>{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

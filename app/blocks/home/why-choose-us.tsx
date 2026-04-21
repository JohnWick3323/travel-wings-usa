import { Users, Star, Plane, Clock, Heart, Shield } from 'lucide-react';
import cn from 'classnames';
import styles from './why-choose-us.module.css';

const reasons = [
  { icon: Users, color: '#e8f0fb', iconColor: '#015FC9', title: 'Experienced Team', desc: 'Our travel consultants have decades of combined experience arranging international travel.' },
  { icon: Star, color: '#fff3e6', iconColor: '#FF9D3D', title: 'Umrah & Hajj Specialists', desc: 'We specialize in spiritual journeys with deep knowledge of pilgrimage logistics and rituals.' },
  { icon: Plane, color: '#e6f9f3', iconColor: '#10b981', title: 'Air Ticketing Experts', desc: 'Access to competitive fares for flights to Pakistan, Saudi Arabia, UAE, UK, and Europe.' },
  { icon: Clock, color: '#fce8e8', iconColor: '#ef4444', title: '24/7 Customer Support', desc: 'Our team is available around the clock to assist you before, during, and after your trip.' },
  { icon: Heart, color: '#f0e8fb', iconColor: '#7c3aed', title: 'Personalized Service', desc: 'Every package is tailored to your specific needs, budget, and travel preferences.' },
  { icon: Shield, color: '#e8f4fb', iconColor: '#0891b2', title: 'Trusted by Thousands', desc: 'Over 5,000 satisfied travelers have trusted Travel Wings USA with their journeys.' },
];

interface Props {
  className?: string;
}

export function WhyChooseUs({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Our Advantages</span>
          <h2 className={styles.title}>Why Choose Us?</h2>
        </div>
        <div className={styles.grid}>
          {reasons.map(reason => (
            <div key={reason.title} className={styles.card}>
              <div className={styles.iconWrap} style={{ backgroundColor: reason.color }}>
                <reason.icon size={24} color={reason.iconColor} />
              </div>
              <h3 className={styles.cardTitle}>{reason.title}</h3>
              <p className={styles.cardDesc}>{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

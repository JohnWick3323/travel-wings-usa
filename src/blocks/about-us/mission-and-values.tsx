import { Heart, Star, Shield, Clock } from 'lucide-react';
import cn from 'classnames';
import styles from './mission-and-values.module.css';

const values = [
  { icon: Heart, color: '#fff0f3', iconColor: '#ef4444', title: 'Customer First', desc: 'Your satisfaction is our top priority. We go above and beyond for every traveler.' },
  { icon: Star, color: '#fff8e6', iconColor: '#FF9D3D', title: 'Expert Guidance', desc: 'Our team provides expert advice tailored to your specific travel needs and goals.' },
  { icon: Shield, color: '#e8f0fb', iconColor: '#015FC9', title: 'Transparent Service', desc: 'No hidden fees or surprises. We believe in complete transparency in all our dealings.' },
  { icon: Clock, color: '#e6f9f3', iconColor: '#10b981', title: '24/7 Support', desc: 'Our support team is available around the clock to assist you whenever you need.' },
];

interface Props { className?: string; }

export function MissionAndValues({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Our Purpose</span>
          <h2 className={styles.title}>Our Mission</h2>
          <p className={styles.missionText}>To provide seamless, personalized travel experiences that exceed expectations, with a special focus on spiritual journeys like Umrah and Hajj, while making global destinations accessible to everyone.</p>
        </div>
        <div className={styles.grid}>
          {values.map(v => (
            <div key={v.title} className={styles.card}>
              <div className={styles.iconWrap} style={{ backgroundColor: v.color }}><v.icon size={28} color={v.iconColor} /></div>
              <h3 className={styles.cardTitle}>{v.title}</h3>
              <p className={styles.cardDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router';
import { Moon, Star, Plane, Ship, Palmtree } from 'lucide-react';
import cn from 'classnames';
import styles from './service-categories.module.css';

const categories = [
  { num: '01', icon: Moon, title: 'Umrah Services', href: '/destinations?category=umrah' },
  { num: '02', icon: Star, title: 'Hajj Packages', href: '/destinations?category=hajj' },
  { num: '03', icon: Plane, title: 'Air Ticketing', href: '/destinations?category=air-ticketing' },
  { num: '04', icon: Ship, title: 'Cruise Tours', href: '/destinations?category=cruise' },
  { num: '05', icon: Palmtree, title: 'Vacations', href: '/destinations?category=vacation' },
];

interface Props {
  className?: string;
}

export function ServiceCategories({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>What We Offer</span>
          <h2 className={styles.title}>Choose Our Tour Types and Enjoy Now</h2>
        </div>
        <div className={styles.grid}>
          {categories.map(cat => (
            <Link key={cat.num} to={cat.href} className={styles.card}>
              <span className={styles.number}>{cat.num}</span>
              <div className={styles.iconWrap}><cat.icon size={28} /></div>
              <h3 className={styles.cardTitle}>{cat.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

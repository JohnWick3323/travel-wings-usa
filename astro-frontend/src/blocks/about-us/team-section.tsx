import cn from 'classnames';
import styles from './team-section.module.css';

const team = [
  { name: 'Ahmed Hassan', role: 'Founder & CEO', photo: '/assets/images/extracted/avatar-ahmed.jpg', bio: 'Founder of Travel Wings USA with over 15 years in the travel industry, specializing in spiritual journeys.' },
  { name: 'Fatima Malik', role: 'Umrah Specialist', photo: '/assets/images/extracted/avatar-fatima.jpg', bio: 'Expert in Umrah and Hajj packages, helping thousands of pilgrims complete their spiritual journeys.' },
  { name: 'Khalid Rahman', role: 'Air Ticketing Expert', photo: '/assets/images/extracted/avatar-khalid.jpg', bio: 'Specializes in finding the best fares for international flights to Pakistan, UAE, UK, and beyond.' },
  { name: 'Sara Johnson', role: 'Travel Consultant', photo: '/assets/images/extracted/avatar-sara.jpg', bio: 'Curates exceptional vacation packages across Europe, Asia, and the Middle East.' },
];

interface Props { className?: string; }

export function TeamSection({ className }: Props) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Our People</span>
          <h2 className={styles.title}>Meet Our Team</h2>
        </div>
        <div className={styles.grid}>
          {team.map(member => (
            <div key={member.name} className={styles.card}>
              <img src={member.photo} alt={member.name} className={styles.photo} loading="lazy" />
              <div className={styles.body}>
                <h3 className={styles.name}>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
                <p className={styles.bio}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

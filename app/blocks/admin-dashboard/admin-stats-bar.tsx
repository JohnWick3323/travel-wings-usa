import { Users, Bell, Phone, CheckCircle } from 'lucide-react';
import cn from 'classnames';
import styles from './admin-stats-bar.module.css';

interface Lead { status: string; }

interface Props {
  leads: Lead[];
  className?: string;
}

export function AdminStatsBar({ leads, className }: Props) {
  const total = leads.length;
  const newL = leads.filter(l => l.status === 'new').length;
  const contacted = leads.filter(l => l.status === 'contacted').length;
  const closed = leads.filter(l => l.status === 'closed').length;

  const stats = [
    { icon: Users, color: '#e8f0fb', iconColor: '#015FC9', label: 'Total Leads', count: total },
    { icon: Bell, color: '#fff3e6', iconColor: '#FF9D3D', label: 'New Leads', count: newL },
    { icon: Phone, color: '#e6f9f3', iconColor: '#10b981', label: 'Contacted', count: contacted },
    { icon: CheckCircle, color: '#f0e8fb', iconColor: '#7c3aed', label: 'Closed/Converted', count: closed },
  ];

  return (
    <div className={cn(styles.bar, className)}>
      {stats.map(s => (
        <div key={s.label} className={styles.card}>
          <div className={styles.iconWrap} style={{ backgroundColor: s.color }}><s.icon size={24} color={s.iconColor} /></div>
          <div className={styles.info}>
            <p className={styles.label}>{s.label}</p>
            <p className={styles.count}>{s.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useState } from 'react';
import { X } from 'lucide-react';
import cn from 'classnames';
import type { LeadRow } from './leads-management-table';
import styles from './lead-detail-modal.module.css';

interface Props {
  lead: LeadRow;
  token: string;
  onClose: () => void;
  onRefresh: () => void;
  className?: string;
}

export function LeadDetailModal({ lead, token, onClose, onRefresh, className }: Props) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || '');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await fetch(`/api/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, notes }),
    });
    setSaved(true);
    onRefresh();
    setTimeout(() => setSaved(false), 2000);
  };

  const fields: [string, string | number | null | undefined][] = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Inquiry Type', lead.inquiryType.replace('_', ' ')],
    ['Tour Name', lead.tourName],
    ['From City', lead.fromCity],
    ['To City', lead.toCity],
    ['Departure Date', lead.departureDate],
    ['Return Date', lead.returnDate],
    ['Passengers', lead.passengers],
    ['Travel Date', lead.travelDate],
    ['No. of Travelers', lead.numberOfTravelers],
    ['Subject', lead.subject],
    ['Submitted', new Date(lead.createdAt).toLocaleString()],
  ].filter(([, v]) => v !== null && v !== undefined && v !== '') as [string, string | number][];

  return (
    <div className={cn(styles.overlay, className)} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Lead Details</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        <div className={styles.body}>
          <div className={styles.grid}>
            {fields.map(([label, value]) => (
              <div key={label} className={styles.field}>
                <p className={styles.fieldLabel}>{label}</p>
                <p className={styles.fieldValue}>{value}</p>
              </div>
            ))}
          </div>
          {lead.message && (
            <>
              <hr className={styles.divider} />
              <p className={styles.fieldLabel}>Message</p>
              <p className={styles.fieldValue}>{lead.message}</p>
            </>
          )}
          <hr className={styles.divider} />
          <label className={styles.label}>Update Status</label>
          <select className={styles.select} value={status} onChange={e => setStatus(e.target.value)}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
          <label className={styles.label}>Internal Notes</label>
          <textarea className={styles.textarea} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add internal notes about this lead..." />
          <button className={styles.saveBtn} onClick={handleSave}>Save Notes</button>
          {saved && <span className={styles.saved}>Saved!</span>}
        </div>
      </div>
    </div>
  );
}

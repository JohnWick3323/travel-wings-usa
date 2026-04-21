import { useState } from 'react';
import { Search } from 'lucide-react';
import cn from 'classnames';
import styles from './leads-management-table.module.css';

export interface LeadRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  inquiryType: string;
  message: string | null;
  status: string;
  createdAt: string;
  tourName?: string | null;
  fromCity?: string | null;
  toCity?: string | null;
  subject?: string | null;
  notes?: string | null;
  travelDate?: string | null;
  numberOfTravelers?: number | null;
  departureDate?: string | null;
  returnDate?: string | null;
  passengers?: number | null;
}

interface Props {
  leads: LeadRow[];
  token: string;
  onRefresh: () => void;
  onSelect: (lead: LeadRow) => void;
  className?: string;
}

export function LeadsManagementTable({ leads, token, onRefresh, onSelect, className }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = leads
    .filter(l => {
      if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && l.status !== statusFilter) return false;
      if (typeFilter && l.inquiryType !== typeFilter) return false;
      return true;
    });

  const updateStatus = async (e: React.MouseEvent, id: number, status: string) => {
    e.stopPropagation();
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    onRefresh();
  };

  const deleteLead = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('Delete this lead?')) return;
    await fetch(`/api/leads/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    onRefresh();
  };

  const badgeClass = (status: string) => {
    if (status === 'new') return styles.badgeNew;
    if (status === 'contacted') return styles.badgeContacted;
    return styles.badgeClosed;
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className={cn(styles.wrap, className)}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
        <select className={styles.select} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="tour_quote">Tour Quote</option>
          <option value="flight_enquiry">Flight Enquiry</option>
          <option value="contact_form">Contact Form</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className={styles.empty}>No leads found.</td></tr>
            )}
            {filtered.map(lead => (
              <tr key={lead.id} className={styles.row} onClick={() => onSelect(lead)}>
                <td style={{ whiteSpace: 'nowrap' }}>{formatDate(lead.createdAt)}</td>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone || '-'}</td>
                <td><span className={styles.typeBadge}>{lead.inquiryType.replace('_', ' ')}</span></td>
                <td className={styles.msgCell}>{lead.message || '-'}</td>
                <td><span className={cn(styles.badge, badgeClass(lead.status))}>{lead.status}</span></td>
                <td>
                  <div className={styles.actions}>
                    {lead.status !== 'contacted' && (
                      <button className={cn(styles.actionBtn, styles.btnContacted)} onClick={e => updateStatus(e, lead.id, 'contacted')}>Mark Contacted</button>
                    )}
                    {lead.status !== 'closed' && (
                      <button className={cn(styles.actionBtn, styles.btnClosed)} onClick={e => updateStatus(e, lead.id, 'closed')}>Mark Closed</button>
                    )}
                    <button className={cn(styles.actionBtn, styles.btnDelete)} onClick={e => deleteLead(e, lead.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

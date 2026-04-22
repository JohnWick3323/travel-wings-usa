import { useState, useEffect, useCallback } from 'react';
import type { Route } from './+types/admin-dashboard';
import { AdminLoginGate } from '~/blocks/admin-dashboard/admin-login-gate';
import { AdminStatsBar } from '~/blocks/admin-dashboard/admin-stats-bar';
import { LeadsManagementTable, type LeadRow } from '~/blocks/admin-dashboard/leads-management-table';
import { LeadDetailModal } from '~/blocks/admin-dashboard/lead-detail-modal';
import { BlogManager } from '~/blocks/admin-dashboard/blog-manager';
import styles from './admin-dashboard.module.css';

export function meta(_: Route.MetaArgs) {
  return [{ title: 'Admin Dashboard - Travel Wings USA' }];
}

type Tab = 'leads' | 'blogs';

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('adminToken');
    return null;
  });
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('leads');

  const fetchLeads = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/leads', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      } else {
        setToken(null);
        localStorage.removeItem('adminToken');
      }
    } catch {
      console.error('Failed to fetch leads');
    }
  }, [token]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleLogin = (t: string) => { setToken(t); };
  const handleLogout = () => { setToken(null); localStorage.removeItem('adminToken'); };

  if (!token) {
    return <AdminLoginGate onLogin={handleLogin} />;
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Admin Dashboard</h1>
        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div className={styles.tabs}>
        <button
          className={activeTab === 'leads' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('leads')}
        >
          Leads
        </button>
        <button
          className={activeTab === 'blogs' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('blogs')}
        >
          Blog Manager
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'leads' && (
          <>
            <AdminStatsBar leads={leads} />
            <LeadsManagementTable
              leads={leads}
              token={token}
              onRefresh={fetchLeads}
              onSelect={setSelectedLead}
            />
          </>
        )}
        {activeTab === 'blogs' && (
          <BlogManager token={token} />
        )}
      </div>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          token={token}
          onClose={() => setSelectedLead(null)}
          onRefresh={fetchLeads}
        />
      )}
    </main>
  );
}

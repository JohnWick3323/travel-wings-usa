import { useState } from 'react';
import cn from 'classnames';
import styles from './admin-login-gate.module.css';

interface Props {
  className?: string;
  onLogin: (token: string) => void;
}

export function AdminLoginGate({ onLogin, className }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        onLogin(data.token);
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(styles.overlay, className)}>
      <div className={styles.card}>
        <div className={styles.logoText}>Travel Wings <span className={styles.logoAccent}>USA</span></div>
        <h1 className={styles.heading}>Admin Access</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input type="password" className={styles.input} placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className={styles.btn} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

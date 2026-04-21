import { useState } from 'react';
import cn from 'classnames';
import styles from './newsletter-signup-strip.module.css';

interface Props { className?: string; }

export function NewsletterSignupStrip({ className }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={cn(styles.strip, className)}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Get Travel Tips in Your Inbox</h2>
        <p className={styles.desc}>Subscribe to receive the latest travel deals, Umrah tips, and destination guides directly in your inbox.</p>
        {submitted ? (
          <p className={styles.success}>Thank you for subscribing! Stay tuned for travel updates.</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input type="email" className={styles.input} placeholder="Enter your email address" required value={email} onChange={e => setEmail(e.target.value)} />
            <button type="submit" className={styles.btn}>Subscribe</button>
          </form>
        )}
      </div>
    </div>
  );
}

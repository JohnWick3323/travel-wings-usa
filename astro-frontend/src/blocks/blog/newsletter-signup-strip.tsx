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
      const wpUrl = import.meta.env.PUBLIC_WP_URL || 'https://cms.travelwingsusa.com/wp-json/wp/v2';
      await fetch(`${wpUrl.replace('/wp/v2', '')}/travel-wings/v1/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Newsletter', email, subject: 'Newsletter Signup', message: 'Newsletter subscription request.', inquiry_type: 'newsletter' }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
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

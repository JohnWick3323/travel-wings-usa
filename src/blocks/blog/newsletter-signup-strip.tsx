import { useState } from 'react';
import cn from 'classnames';
import { sendInquiryEmail } from '~/lib/email';
import styles from './newsletter-signup-strip.module.css';

interface Props { className?: string; }

export function NewsletterSignupStrip({ className }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendInquiryEmail({
        name: 'Newsletter Subscriber',
        email,
        subject: 'Newsletter Signup',
        message: `New newsletter subscription from: ${email}`,
        inquiry_type: 'newsletter',
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
          <form className={styles.form} onSubmit={handleSubmit} aria-label="Newsletter signup">
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <input id="nl-email" type="email" className={styles.input} placeholder="Enter your email address" required value={email} onChange={e => setEmail(e.target.value)} />
            <button type="submit" className={styles.btn}>Subscribe</button>
          </form>
        )}
      </div>
    </div>
  );
}

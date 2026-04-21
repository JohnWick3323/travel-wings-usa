import { useState } from 'react';
import cn from 'classnames';
import styles from './contact-form-and-map.module.css';

interface Props { className?: string; }

export function ContactFormAndMap({ className }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, inquiryType: 'contact_form' }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.inner}>
        <div>
          <h2 className={styles.formTitle}>Send Us a Message</h2>
          {submitted ? (
            <p className={styles.success}>Thank you! Your message has been sent. We will get back to you within 24 hours.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.fields}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Full Name</label>
                    <input className={styles.input} placeholder="Your name" required value={form.name} onChange={set('name')} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input type="email" className={styles.input} placeholder="your@email.com" required value={form.email} onChange={set('email')} />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Phone</label>
                    <input className={styles.input} placeholder="+1 (xxx) xxx-xxxx" value={form.phone} onChange={set('phone')} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Subject</label>
                    <input className={styles.input} placeholder="How can we help?" value={form.subject} onChange={set('subject')} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Message</label>
                  <textarea className={styles.textarea} placeholder="Tell us about your travel plans..." required value={form.message} onChange={set('message')} />
                </div>
              </div>
              <button type="submit" className={styles.submitBtn}>Send Message</button>
            </form>
          )}
        </div>
        <div className={styles.map}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3084.5!2d-76.723!3d39.337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c81d8df3b6d97b%3A0x1!2s1724+Woodlawn+Dr%2C+Gwynn+Oak%2C+MD+21207!5e0!3m2!1sen!2sus!4v1000000000000"
            title="Travel Wings USA Location"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

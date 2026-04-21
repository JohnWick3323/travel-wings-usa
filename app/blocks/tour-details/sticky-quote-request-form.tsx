import { useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import cn from 'classnames';
import type { Tour } from '~/data/tours';
import styles from './sticky-quote-request-form.module.css';

interface Props {
  tour: Tour;
  className?: string;
}

export function StickyQuoteRequestForm({ tour, className }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', travelDate: '', numberOfTravelers: '2', message: '' });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, inquiryType: 'tour_quote', tourName: tour.title }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className={cn(styles.sidebar, className)}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Request a Free Quote</h3>
        {submitted ? (
          <div className={styles.successMsg}>Thank you! We will contact you shortly about {tour.title}.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input className={styles.input} placeholder="Your name" required value={form.name} onChange={set('name')} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input type="email" className={styles.input} placeholder="your@email.com" required value={form.email} onChange={set('email')} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone</label>
                <input className={styles.input} placeholder="+1 (xxx) xxx-xxxx" value={form.phone} onChange={set('phone')} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Travel Date</label>
                <input type="date" className={styles.input} value={form.travelDate} onChange={set('travelDate')} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Travelers</label>
                <select className={styles.input} value={form.numberOfTravelers} onChange={set('numberOfTravelers')}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Special Requirements</label>
                <textarea className={styles.textarea} placeholder="Any special requirements..." value={form.message} onChange={set('message')} />
              </div>
            </div>
            <button type="submit" className={styles.submitBtn}>Send Inquiry</button>
          </form>
        )}
        <div className={styles.divider}>Or Contact Us Directly</div>
        <div className={styles.contactOptions}>
          <a href="tel:+14102984500" className={styles.callBtn}><Phone size={16} /> Call: +1 410-298-4500</a>
          <a href="https://wa.me/14102984500?text=Hello%2C%20I%20am%20interested%20in%20a%20travel%20package.%20Please%20assist%20me." target="_blank" rel="noreferrer" className={styles.waBtn}><MessageCircle size={16} /> Chat on WhatsApp</a>
        </div>
      </div>
    </aside>
  );
}

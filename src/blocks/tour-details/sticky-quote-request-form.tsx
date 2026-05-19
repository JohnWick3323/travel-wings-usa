import { useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import cn from 'classnames';
import type { Tour } from '~/lib/wordpress';
import { sendInquiryEmail } from '~/lib/email';
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
      await sendInquiryEmail({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Quote Request: ${tour.title}`,
        message: `Tour: ${tour.title}\nTravel Date: ${form.travelDate}\nTravelers: ${form.numberOfTravelers}\n\n${form.message}`,
        inquiry_type: 'tour_quote',
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
                <label htmlFor="qf-name" className={styles.label}>Full Name</label>
                <input id="qf-name" className={styles.input} placeholder="Your name" required value={form.name} onChange={set('name')} />
              </div>
              <div className={styles.field}>
                <label htmlFor="qf-email" className={styles.label}>Email</label>
                <input id="qf-email" type="email" className={styles.input} placeholder="your@email.com" required value={form.email} onChange={set('email')} />
              </div>
              <div className={styles.field}>
                <label htmlFor="qf-phone" className={styles.label}>Phone</label>
                <input id="qf-phone" className={styles.input} placeholder="+1 (xxx) xxx-xxxx" value={form.phone} onChange={set('phone')} />
              </div>
              <div className={styles.field}>
                <label htmlFor="qf-date" className={styles.label}>Travel Date</label>
                <input id="qf-date" type="date" className={styles.input} value={form.travelDate} onChange={set('travelDate')} />
              </div>
              <div className={styles.field}>
                <label htmlFor="qf-travelers" className={styles.label}>Travelers</label>
                <select id="qf-travelers" className={styles.input} value={form.numberOfTravelers} onChange={set('numberOfTravelers')}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="qf-message" className={styles.label}>Special Requirements</label>
                <textarea id="qf-message" className={styles.textarea} placeholder="Any special requirements..." value={form.message} onChange={set('message')} />
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

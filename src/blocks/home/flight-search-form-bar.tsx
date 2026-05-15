import { useState } from 'react';
import cn from 'classnames';
import styles from './flight-search-form-bar.module.css';

type TripType = 'one-way' | 'round-trip';

export function FlightSearchFormBar() {
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    fromCity: '', toCity: '', departureDate: '', returnDate: '', passengers: '1',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          inquiryType: 'flight_enquiry',
          tripType,
          message: `Flight enquiry: ${formData.fromCity} to ${formData.toCity}`,
        }),
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {submitted ? (
          <div className={styles.successMsg}>
            Thank you! We received your flight enquiry and will contact you shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.tabs}>
              <button type="button" className={cn(styles.tab, { [styles.activeTab]: tripType === 'one-way' })} onClick={() => setTripType('one-way')}>One Way</button>
              <button type="button" className={cn(styles.tab, { [styles.activeTab]: tripType === 'round-trip' })} onClick={() => setTripType('round-trip')}>Round Trip</button>
            </div>

            <div className={cn(styles.row, styles.row3)}>
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input className={styles.input} placeholder="Your name" required value={formData.name} onChange={set('name')} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input type="email" className={styles.input} placeholder="your@email.com" required value={formData.email} onChange={set('email')} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone</label>
                <input className={styles.input} placeholder="+1 (xxx) xxx-xxxx" value={formData.phone} onChange={set('phone')} />
              </div>
            </div>

            <div className={cn(styles.row, tripType === 'round-trip' ? styles.row5 : styles.row4)}>
              <div className={styles.field}>
                <label className={styles.label}>From</label>
                <input className={styles.input} placeholder="Departure city" required value={formData.fromCity} onChange={set('fromCity')} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>To</label>
                <input className={styles.input} placeholder="Destination city" required value={formData.toCity} onChange={set('toCity')} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Departure Date</label>
                <input type="date" className={styles.input} required value={formData.departureDate} onChange={set('departureDate')} />
              </div>
              {tripType === 'round-trip' && (
                <div className={styles.field}>
                  <label className={styles.label}>Return Date</label>
                  <input type="date" className={styles.input} value={formData.returnDate} onChange={set('returnDate')} />
                </div>
              )}
              <div className={styles.field}>
                <label className={styles.label}>Passengers</label>
                <select className={styles.input} value={formData.passengers} onChange={set('passengers')}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn}>Get Flight Enquiry</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

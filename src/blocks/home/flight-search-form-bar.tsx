import { useState } from 'react';
import cn from 'classnames';
import { sendInquiryEmail } from '~/lib/email';
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
      await sendInquiryEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Flight Enquiry: ${formData.fromCity} → ${formData.toCity}`,
        message: `Trip Type: ${tripType}\nFrom: ${formData.fromCity}\nTo: ${formData.toCity}\nDeparture: ${formData.departureDate}\nReturn: ${formData.returnDate || 'N/A'}\nPassengers: ${formData.passengers}`,
        inquiry_type: 'flight_enquiry',
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
                <label htmlFor="fs-name" className={styles.label}>Full Name</label>
                <input id="fs-name" className={styles.input} placeholder="Your name" required value={formData.name} onChange={set('name')} />
              </div>
              <div className={styles.field}>
                <label htmlFor="fs-email" className={styles.label}>Email</label>
                <input id="fs-email" type="email" className={styles.input} placeholder="your@email.com" required value={formData.email} onChange={set('email')} />
              </div>
              <div className={styles.field}>
                <label htmlFor="fs-phone" className={styles.label}>Phone</label>
                <input id="fs-phone" className={styles.input} placeholder="+1 (xxx) xxx-xxxx" value={formData.phone} onChange={set('phone')} />
              </div>
            </div>

            <div className={cn(styles.row, tripType === 'round-trip' ? styles.row5 : styles.row4)}>
              <div className={styles.field}>
                <label htmlFor="fs-from" className={styles.label}>From</label>
                <input id="fs-from" className={styles.input} placeholder="Departure city" required value={formData.fromCity} onChange={set('fromCity')} />
              </div>
              <div className={styles.field}>
                <label htmlFor="fs-to" className={styles.label}>To</label>
                <input id="fs-to" className={styles.input} placeholder="Destination city" required value={formData.toCity} onChange={set('toCity')} />
              </div>
              <div className={styles.field}>
                <label htmlFor="fs-departure" className={styles.label}>Departure Date</label>
                <input id="fs-departure" type="date" className={styles.input} required value={formData.departureDate} onChange={set('departureDate')} />
              </div>
              {tripType === 'round-trip' && (
                <div className={styles.field}>
                  <label htmlFor="fs-return" className={styles.label}>Return Date</label>
                  <input id="fs-return" type="date" className={styles.input} value={formData.returnDate} onChange={set('returnDate')} />
                </div>
              )}
              <div className={styles.field}>
                <label htmlFor="fs-passengers" className={styles.label}>Passengers</label>
                <select id="fs-passengers" className={styles.input} value={formData.passengers} onChange={set('passengers')}>
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

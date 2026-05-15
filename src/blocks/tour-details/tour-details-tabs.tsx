import { useState } from 'react';
import { TourOverviewAndHighlights } from './tour-overview-and-highlights';
import { DayByDayItinerary } from './day-by-day-itinerary';
import { InclusionsAndExclusions } from './inclusions-and-exclusions';
import type { Tour } from '~/lib/wordpress';
import styles from '~/styles/pages/tour-details.module.css';

interface Props {
  tour: Tour;
}

export function TourDetailsTabs({ tour }: Props) {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <>
      <TourOverviewAndHighlights tour={tour} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'Itinerary' && <DayByDayItinerary tour={tour} />}
      {activeTab === 'Inclusions' && <InclusionsAndExclusions tour={tour} />}
      {activeTab === 'FAQs' && tour.faqs.length > 0 && (
        <div className={styles.faqSection}>
          <h3 className={styles.faqTitle}>Frequently Asked Questions</h3>
          {tour.faqs.map(faq => (
            <div key={faq.question} className={styles.faqItem}>
              <p className={styles.faqQ}>{faq.question}</p>
              <p className={styles.faqA}>{faq.answer}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

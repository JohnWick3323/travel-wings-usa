import { useState } from 'react';
import { TourOverviewAndHighlights } from './tour-overview-and-highlights';
import { DayByDayItinerary } from './day-by-day-itinerary';
import { InclusionsAndExclusions } from './inclusions-and-exclusions';
import type { Tour } from '~/lib/wordpress';
import styles from '~/styles/pages/tour-details.module.css';

interface Props {
  tour: Tour;
}

const TABS = ['Overview', 'Itinerary', 'Inclusions', 'FAQs'];

export function TourDetailsTabs({ tour }: Props) {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div>
      {/* Tab navigation bar */}
      <div className={styles.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && (
        <TourOverviewAndHighlights tour={tour} />
      )}
      {activeTab === 'Itinerary' && (
        <DayByDayItinerary tour={tour} />
      )}
      {activeTab === 'Inclusions' && (
        <InclusionsAndExclusions tour={tour} />
      )}
      {activeTab === 'FAQs' && (
        <div className={styles.faqSection}>
          {tour.faqs.length > 0 ? (
            <>
              <h3 className={styles.faqTitle}>Frequently Asked Questions</h3>
              {tour.faqs.map(faq => (
                <div key={faq.question} className={styles.faqItem}>
                  <p className={styles.faqQ}>{faq.question}</p>
                  <p className={styles.faqA}>{faq.answer}</p>
                </div>
              ))}
            </>
          ) : (
            <p className={styles.faqEmpty}>No FAQs available for this tour.</p>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import type { Route } from './+types/tour-details';
import { useParams } from 'react-router';
import { getTourById, getRelatedTours } from '~/data/tours';
import { TourPageHero } from '~/blocks/tour-details/tour-page-hero';
import { TourImageGallery } from '~/blocks/tour-details/tour-image-gallery';
import { TourOverviewAndHighlights } from '~/blocks/tour-details/tour-overview-and-highlights';
import { DayByDayItinerary } from '~/blocks/tour-details/day-by-day-itinerary';
import { InclusionsAndExclusions } from '~/blocks/tour-details/inclusions-and-exclusions';
import { StickyQuoteRequestForm } from '~/blocks/tour-details/sticky-quote-request-form';
import { RelatedTours } from '~/blocks/tour-details/related-tours';
import styles from './tour-details.module.css';

export function meta({ params }: Route.MetaArgs) {
  return [{ title: 'Tour Details - Travel Wings USA' }];
}

export default function TourDetails() {
  const { tourId } = useParams();
  const tour = getTourById(tourId || '');
  const [activeTab, setActiveTab] = useState('Overview');

  if (!tour) {
    return (
      <main className={styles.page}>
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
          <h1>Tour not found</h1>
          <p>The requested tour package does not exist.</p>
        </div>
      </main>
    );
  }

  const related = getRelatedTours(tour.id);

  return (
    <main className={styles.page}>
      <TourPageHero tour={tour} />
      <div className={styles.content}>
        <div className={styles.main}>
          <TourImageGallery tour={tour} />
          <TourOverviewAndHighlights tour={tour} activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === 'Itinerary' && <DayByDayItinerary tour={tour} />}
          {activeTab === 'Inclusions' && <InclusionsAndExclusions tour={tour} />}
          {activeTab === 'FAQs' && (
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
          <RelatedTours tours={related} />
        </div>
        <StickyQuoteRequestForm tour={tour} />
      </div>
    </main>
  );
}

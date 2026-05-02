import type { Route } from './+types/terms-of-service';
import { generateSeoMeta, SITE_URL } from '~/lib/seo';
import styles from './legal-page.module.css';

export function meta(_: Route.MetaArgs) {
  return generateSeoMeta({
    title: 'Terms of Service - Travel Wings USA',
    description: 'Terms of Service for Travel Wings USA. Read our terms and conditions for using our travel services.',
    url: `${SITE_URL}/terms-of-service`,
  });
}

export default function TermsOfService() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.updated}>Last Updated: April 2025</p>

        <section className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the Travel Wings USA website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Services</h2>
          <p>Travel Wings USA provides travel consultation, package planning, and booking assistance for Umrah, Hajj, international flights, and vacation tours. All pricing is quote-based and provided upon request.</p>
        </section>

        <section className={styles.section}>
          <h2>3. Quote Requests</h2>
          <p>Submitting a quote request through our website does not constitute a booking. Our team will contact you to discuss details, availability, and pricing. A booking is confirmed only after mutual agreement and payment.</p>
        </section>

        <section className={styles.section}>
          <h2>4. User Responsibilities</h2>
          <ul>
            <li>Provide accurate and complete information when submitting inquiries</li>
            <li>Ensure valid travel documents (passport, visa) are obtained before travel</li>
            <li>Review all travel package details before confirming a booking</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Cancellations and Refunds</h2>
          <p>Cancellation and refund policies vary by package and are communicated at the time of booking. Please contact us for specific terms related to your reservation.</p>
        </section>

        <section className={styles.section}>
          <h2>6. Limitation of Liability</h2>
          <p>Travel Wings USA acts as an intermediary between travelers and service providers (airlines, hotels, etc.). We are not liable for delays, cancellations, or service issues caused by third-party providers.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Intellectual Property</h2>
          <p>All content on this website, including text, images, logos, and design, is the property of Travel Wings USA and is protected by applicable intellectual property laws.</p>
        </section>

        <section className={styles.section}>
          <h2>8. Changes to Terms</h2>
          <p>We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with the updated date.</p>
        </section>

        <section className={styles.section}>
          <h2>9. Contact Us</h2>
          <p>For questions about these Terms, contact us:</p>
          <ul>
            <li>Email: <a href="mailto:info@travelwingsusa.com">info@travelwingsusa.com</a></li>
            <li>Phone: +1 410-298-4500</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

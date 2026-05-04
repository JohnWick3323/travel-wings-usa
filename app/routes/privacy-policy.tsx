import type { Route } from './+types/privacy-policy';
import { generateSeoMeta, SITE_URL } from '~/lib/seo';
import styles from './legal-page.module.css';

export function meta(_: Route.MetaArgs) {
  return generateSeoMeta({
    title: 'Privacy Policy - Travel Wings USA',
    description: 'Privacy Policy for Travel Wings USA. Learn how we collect, use, and protect your personal information.',
    url: `${SITE_URL}/privacy-policy`,
  });
}

export default function PrivacyPolicy() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last Updated: April 2025</p>

        <section className={styles.section}>
          <h2>1. Information We Collect</h2>
          <p>When you use our website or request a quote, we may collect:</p>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Travel preferences and destination interests</li>
            <li>Information you provide through our contact and inquiry forms</li>
            <li>Technical data such as IP address, browser type, and device information</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Respond to your travel inquiries and quote requests</li>
            <li>Provide customized travel packages and recommendations</li>
            <li>Send newsletters and promotional content (with your consent)</li>
            <li>Improve our website and services</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Information Sharing</h2>
          <p>We do not sell your personal information to third parties. We may share your information with trusted travel partners (airlines, hotels, visa processors) solely to fulfill your travel arrangements.</p>
        </section>

        <section className={styles.section}>
          <h2>4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <section className={styles.section}>
          <h2>5. Cookies</h2>
          <p>Our website may use cookies and similar technologies to enhance your browsing experience and analyze website traffic.</p>
        </section>

        <section className={styles.section}>
          <h2>6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. To exercise these rights, contact us at <a href="mailto:info@travelwingsusa.com">info@travelwingsusa.com</a>.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li>Email: <a href="mailto:info@travelwingsusa.com">info@travelwingsusa.com</a></li>
            <li>Phone: +1 410-298-4500</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

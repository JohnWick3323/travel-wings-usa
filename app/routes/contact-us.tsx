import type { Route } from './+types/contact-us';
import { ContactPageHero } from '~/blocks/contact-us/contact-page-hero';
import { ContactDetailsCards } from '~/blocks/contact-us/contact-details-cards';
import { ContactFormAndMap } from '~/blocks/contact-us/contact-form-and-map';
import { DirectContactCtaStrip } from '~/blocks/contact-us/direct-contact-cta-strip';
import { generateSeoMeta, SITE_URL } from '~/lib/seo';
import { localBusinessSchema, breadcrumbSchema } from '~/lib/structured-data';
import styles from './contact-us.module.css';

export function meta(_: Route.MetaArgs) {
  return generateSeoMeta({
    title: 'Contact Us - Travel Wings USA',
    description: 'Contact Travel Wings USA for Umrah packages, Hajj packages, international flights, and vacation tours. Call +1 410-298-4500 or visit our office in Gwynn Oak, MD.',
    url: `${SITE_URL}/contact`,
  });
}

export default function ContactUs() {
  const business = localBusinessSchema();
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Contact Us', url: `${SITE_URL}/contact` },
  ]);

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <ContactPageHero />
      <ContactDetailsCards />
      <ContactFormAndMap />
      <DirectContactCtaStrip />
    </main>
  );
}

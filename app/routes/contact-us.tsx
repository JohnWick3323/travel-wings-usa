import type { Route } from './+types/contact-us';
import { ContactPageHero } from '~/blocks/contact-us/contact-page-hero';
import { ContactDetailsCards } from '~/blocks/contact-us/contact-details-cards';
import { ContactFormAndMap } from '~/blocks/contact-us/contact-form-and-map';
import { DirectContactCtaStrip } from '~/blocks/contact-us/direct-contact-cta-strip';
import styles from './contact-us.module.css';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Contact Us - Travel Wings USA' },
    { name: 'description', content: 'Contact Travel Wings USA for Umrah packages, Hajj packages, international flights, and vacation tours. Call +1 410-298-4500.' },
  ];
}

export default function ContactUs() {
  return (
    <main className={styles.page}>
      <ContactPageHero />
      <ContactDetailsCards />
      <ContactFormAndMap />
      <DirectContactCtaStrip />
    </main>
  );
}

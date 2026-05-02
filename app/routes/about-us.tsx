import type { Route } from './+types/about-us';
import { AboutPageHero } from '~/blocks/about-us/about-page-hero';
import { OurStorySection } from '~/blocks/about-us/our-story-section';
import { MissionAndValues } from '~/blocks/about-us/mission-and-values';
import { AboutCtaBanner } from '~/blocks/about-us/about-cta-banner';
import { generateSeoMeta, SITE_URL } from '~/lib/seo';
import styles from './about-us.module.css';

export function meta(_: Route.MetaArgs) {
  return generateSeoMeta({
    title: 'About Us - Travel Wings USA',
    description: 'Learn about Travel Wings USA, a Maryland-based travel agency specializing in Umrah, Hajj, and international travel packages since establishment.',
    url: `${SITE_URL}/about`,
  });
}

export default function AboutUs() {
  return (
    <main className={styles.page}>
      <AboutPageHero />
      <OurStorySection />
      <MissionAndValues />
      <AboutCtaBanner />
    </main>
  );
}

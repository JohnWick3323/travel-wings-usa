import type { Route } from './+types/home';
import { HeroSlider } from '~/blocks/home/hero-slider';
import { FlightSearchFormBar } from '~/blocks/home/flight-search-form-bar';
import { ServiceCategories } from '~/blocks/home/service-categories';
import { AboutSnapshot } from '~/blocks/home/about-snapshot';
import { PopularDestinationsCarousel } from '~/blocks/home/popular-destinations-carousel';
import { FeaturedToursSlider } from '~/blocks/home/featured-tours-slider';
import { WhyChooseUs } from '~/blocks/home/why-choose-us';
import { CustomerTestimonials } from '~/blocks/home/customer-testimonials';
import { LatestBlogPreview } from '~/blocks/home/latest-blog-preview';
import { FinalCtaBanner } from '~/blocks/home/final-cta-banner';
import { generateSeoMeta, SITE_URL } from '~/lib/seo';
import styles from './home.module.css';

export function meta(_: Route.MetaArgs) {
  return generateSeoMeta({
    title: 'Travel Wings USA - Umrah, Hajj & International Travel Packages',
    description: 'Travel Wings USA specializes in Umrah packages, Hajj packages, international flights, and vacation tours. Located in Gwynn Oak, MD. Call +1 410-298-4500.',
    url: SITE_URL,
  });
}

export default function Home() {
  return (
    <main className={styles.page}>
      <h1 className="sr-only">Travel Wings USA — Umrah, Hajj & International Travel Packages from USA</h1>
      <HeroSlider />
      <FlightSearchFormBar />
      <ServiceCategories />
      <AboutSnapshot />
      <PopularDestinationsCarousel />
      <FeaturedToursSlider />
      <WhyChooseUs />
      <CustomerTestimonials />
      <LatestBlogPreview />
      <FinalCtaBanner />
    </main>
  );
}

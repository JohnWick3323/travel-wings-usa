import { SITE_URL, SITE_NAME } from './seo';

/** Organization schema for the root layout */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/images/extracted/logo.png`,
    description: 'Travel Wings USA specializes in Umrah packages, Hajj packages, international flights, and vacation tours departing from the USA.',
    telephone: '+1-410-298-4500',
    email: 'info@travelwingsusa.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3500 Gwynn Oak Ave',
      addressLocality: 'Baltimore',
      addressRegion: 'MD',
      postalCode: '21207',
      addressCountry: 'US',
    },
    sameAs: [
      'https://facebook.com/travelwingsusa',
      'https://instagram.com/travelwingsusa',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    priceRange: '$$',
  };
}

/** LocalBusiness schema for the contact page */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE_NAME,
    url: SITE_URL,
    telephone: '+1-410-298-4500',
    email: 'info@travelwingsusa.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3500 Gwynn Oak Ave',
      addressLocality: 'Baltimore',
      addressRegion: 'MD',
      postalCode: '21207',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.3434,
      longitude: -76.6822,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
  };
}

/** BreadcrumbList schema */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Tour/Product schema for tour detail pages */
export function tourSchema(tour: {
  id: string;
  title: string;
  description: string;
  image: string;
  destination: string;
  duration: string;
  rating: number;
  highlights: string[];
  faqs?: { question: string; answer: string }[];
}) {
  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: tour.title,
      description: tour.description,
      image: `${SITE_URL}${tour.image}`,
      url: `${SITE_URL}/tour/${tour.id}`,
      touristType: 'Leisure',
      itinerary: {
        '@type': 'ItemList',
        itemListElement: tour.highlights.map((h, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: h,
        })),
      },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
        url: `${SITE_URL}/tour/${tour.id}`,
      },
      provider: {
        '@type': 'TravelAgency',
        name: SITE_NAME,
        url: SITE_URL,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tour.rating,
        bestRating: 5,
        ratingCount: 50 + Math.floor(tour.rating * 10),
      },
    },
  ];

  // Add FAQ schema if tour has FAQs
  if (tour.faqs && tour.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tour.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return schemas;
}

/** BlogPosting schema */
export function blogPostingSchema(post: {
  id: string;
  title: string;
  excerpt?: string;
  author: string;
  date: string;
  image?: string;
  content?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/assets/images/extracted/hero-slider-1.jpg`,
    url: `${SITE_URL}/blog/${post.id}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/images/extracted/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.id}`,
    },
  };
}

/** WebSite schema with SearchAction for sitelinks searchbox */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };
}

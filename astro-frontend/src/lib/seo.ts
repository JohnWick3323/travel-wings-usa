/** Centralized SEO configuration */

export const SITE_URL = 'https://travelwingsusa.com';
export const SITE_NAME = 'Travel Wings USA';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/extracted/hero-slider-1.jpg`;

export interface SeoMeta {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
}

/** Generate standard meta tags including Open Graph and Twitter Card */
export function generateSeoMeta(meta: SeoMeta) {
  const image = meta.image || DEFAULT_OG_IMAGE;
  const type = meta.type || 'website';

  return [
    { title: meta.title },
    { name: 'description', content: meta.description },

    // Open Graph
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    { property: 'og:url', content: meta.url },
    { property: 'og:image', content: image },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'en_US' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: meta.title },
    { name: 'twitter:description', content: meta.description },
    { name: 'twitter:image', content: image },

    // Canonical
    { tagName: 'link', rel: 'canonical', href: meta.url },

    // Article-specific (if applicable)
    ...(meta.publishedTime ? [{ property: 'article:published_time', content: meta.publishedTime }] : []),
    ...(meta.author ? [{ property: 'article:author', content: meta.author }] : []),
  ];
}

/**
 * WordPress GraphQL data fetching layer
 * Uses WPGraphQL + WPGraphQL for ACF
 */

const GQL_URL = (import.meta.env.PUBLIC_WP_URL || 'https://backend.travelwingsusa.com/wp-json/wp/v2')
  .replace('/wp-json/wp/v2', '/graphql');

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Tour {
  id: string;
  wpId: number;
  title: string;
  excerpt: string;
  destination: string;
  region: string;
  category: 'umrah' | 'hajj' | 'vacation' | 'air-ticketing' | 'cruise';
  duration: string;
  durationDays: number;
  rating: number;
  image: string;
  images: string[];
  description: string;
  highlights: string[];
  itinerary: { day: number; title: string; activities: string[] }[];
  inclusions: string[];
  exclusions: string[];
  faqs: { question: string; answer: string }[];
  groupSize: string;
  tags: string[];
}

export interface BlogPost {
  id: string;
  wpId: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  tags: string[];
}

// ─── GraphQL fetcher ──────────────────────────────────────────────────────────

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  try {
    const res = await fetch(GQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) return null;
    const json = await res.json() as { data?: T; errors?: unknown[] };
    if (json.errors) console.error('[GraphQL errors]', json.errors);
    return json.data ?? null;
  } catch (e) {
    console.error('[GraphQL fetch failed]', e);
    return null;
  }
}

// ─── Tours ────────────────────────────────────────────────────────────────────

const TOURS_QUERY = `
  query GetTours {
    tours(first: 100, where: { status: PUBLISH }) {
      nodes {
        databaseId
        slug
        title
        excerpt
        featuredImage {
          node { sourceUrl altText }
        }
        tourDetails {
          destination
          region
          category
          duration
          durationDays
          rating
          groupSize
          tags
          heroImage {
            node { sourceUrl altText }
          }
          gallery {
            nodes { sourceUrl altText }
          }
          highlights {
            item
          }
          itinerary {
            day
            title
            activities
          }
          inclusions {
            item
          }
          exclusions {
            item
          }
          faqs {
            question
            answer
          }
        }
      }
    }
  }
`;

const TOUR_BY_SLUG_QUERY = `
  query GetTourBySlug($slug: ID!) {
    tour(id: $slug, idType: SLUG) {
      databaseId
      slug
      title
      excerpt
      featuredImage {
        node { sourceUrl altText }
      }
      tourDetails {
        destination
        region
        category
        duration
        durationDays
        rating
        groupSize
        tags
        heroImage {
          node { sourceUrl altText }
        }
        gallery {
          nodes { sourceUrl altText }
        }
        highlights {
          item
        }
        itinerary {
          day
          title
          activities
        }
        inclusions {
          item
        }
        exclusions {
          item
        }
        faqs {
          question
          answer
        }
      }
    }
  }
`;

function mapTour(node: Record<string, unknown>): Tour {
  const d = (node.tourDetails || {}) as Record<string, unknown>;
  const heroImg = (d.heroImage as { node?: { sourceUrl?: string } } | null)?.node;
  const featImg = (node.featuredImage as { node?: { sourceUrl?: string } } | null)?.node;
  const gallery = ((d.gallery as { nodes?: { sourceUrl: string }[] } | null)?.nodes) || [];

  return {
    id: (node.slug as string) || '',
    wpId: node.databaseId as number,
    title: decodeHtml(node.title as string),
    excerpt: stripHtml(node.excerpt as string || ''),
    destination: (d.destination as string) || '',
    region: (d.region as string) || '',
    category: (Array.isArray(d.category) ? d.category[0] : d.category as Tour['category']) || 'vacation',
    duration: (d.duration as string) || '',
    durationDays: Number(d.durationDays) || 0,
    rating: Number(d.rating) || 5,
    image: heroImg?.sourceUrl || featImg?.sourceUrl || '',
    images: gallery.map((g) => g.sourceUrl),
    description: stripHtml(node.excerpt as string || ''),
    highlights: ((d.highlights as { item: string }[]) || []).map((h) => h.item).filter(Boolean),
    itinerary: ((d.itinerary as { day: number; title: string; activities: string | string[] }[]) || []).map((row) => ({
      day: Number(row.day),
      title: row.title,
      activities: Array.isArray(row.activities)
        ? row.activities
        : String(row.activities || '').split('\n').map((s) => s.trim()).filter(Boolean),
    })),
    inclusions: ((d.inclusions as { item: string }[]) || []).map((i) => i.item).filter(Boolean),
    exclusions: ((d.exclusions as { item: string }[]) || []).map((e) => e.item).filter(Boolean),
    faqs: ((d.faqs as { question: string; answer: string }[]) || []),
    groupSize: (d.groupSize as string) || '',
    tags: Array.isArray(d.tags)
      ? (d.tags as string[])
      : String(d.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
  };
}

export async function getTours(): Promise<Tour[]> {
  const data = await gql<{ tours: { nodes: Record<string, unknown>[] } }>(TOURS_QUERY);
  return (data?.tours?.nodes || []).map(mapTour);
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const data = await gql<{ tour: Record<string, unknown> | null }>(TOUR_BY_SLUG_QUERY, { slug });
  if (!data?.tour) return null;
  return mapTour(data.tour);
}

export function getRelatedTours(tours: Tour[], currentId: string, count = 3): Tour[] {
  const current = tours.find((t) => t.id === currentId);
  if (!current) return tours.filter((t) => t.id !== currentId).slice(0, count);
  return tours
    .filter((t) => t.id !== currentId && (t.category === current.category || t.region === current.region))
    .slice(0, count);
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

const POSTS_QUERY = `
  query GetPosts {
    posts(first: 100, where: { status: PUBLISH }) {
      nodes {
        databaseId
        slug
        title
        excerpt
        content
        date
        featuredImage {
          node { sourceUrl altText }
        }
        author {
          node { name }
        }
        categories {
          nodes { name }
        }
      }
    }
  }
`;

const POST_BY_SLUG_QUERY = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      slug
      title
      excerpt
      content
      date
      featuredImage {
        node { sourceUrl altText }
      }
      author {
        node { name }
      }
      categories {
        nodes { name }
      }
    }
  }
`;

function mapPost(node: Record<string, unknown>): BlogPost {
  const content = (node.content as string) || '';
  const wordCount = stripHtml(content).split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
  const categories = (node.categories as { nodes: { name: string }[] } | null)?.nodes || [];
  const author = (node.author as { node: { name: string } } | null)?.node?.name || 'Travel Wings Team';
  const featImg = (node.featuredImage as { node?: { sourceUrl?: string } } | null)?.node;

  return {
    id: (node.slug as string) || '',
    wpId: node.databaseId as number,
    title: decodeHtml(node.title as string),
    excerpt: stripHtml((node.excerpt as string) || ''),
    content,
    category: categories[0]?.name || 'General',
    date: new Date(node.date as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    author,
    readTime,
    image: featImg?.sourceUrl || '',
    tags: [],
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await gql<{ posts: { nodes: Record<string, unknown>[] } }>(POSTS_QUERY);
  return (data?.posts?.nodes || []).map(mapPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const data = await gql<{ post: Record<string, unknown> | null }>(POST_BY_SLUG_QUERY, { slug });
  if (!data?.post) return null;
  return mapPost(data.post);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function decodeHtml(str: string): string {
  return (str || '').replace(/&#8217;/g, "'").replace(/&amp;/g, '&').replace(/&#038;/g, '&').replace(/&nbsp;/g, ' ');
}

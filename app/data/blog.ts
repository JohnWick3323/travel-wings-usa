export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  relatedTourIds: string[];
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 'how-to-prepare-for-umrah-2025',
    title: 'How to Prepare for Umrah 2025: A Complete Guide',
    excerpt: 'Planning your Umrah journey in 2025? This complete guide covers everything from visa requirements to packing essentials and spiritual preparation.',
    category: 'Umrah Tips',
    date: 'January 15, 2025',
    author: 'Travel Wings Team',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
    relatedTourIds: ['umrah-package-2025', 'hajj-package-2025'],
    tags: ['umrah', 'spiritual', 'guide'],
    content: 'Comprehensive guide to preparing for Umrah in 2025, covering visa requirements, what to pack, and spiritual preparation tips.',
  },
  {
    id: 'top-5-things-to-do-in-dubai',
    title: 'Top 5 Things to Do in Dubai You Cannot Miss',
    excerpt: 'Dubai is a city like no other. From the world tallest building to the most spectacular desert safari, here are the top 5 experiences you simply cannot miss.',
    category: 'Destination Guide',
    date: 'January 22, 2025',
    author: 'Sarah Ahmed',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    relatedTourIds: ['uae-dubai-package'],
    tags: ['dubai', 'uae', 'travel-tips'],
    content: 'Discover the top 5 must-do experiences in Dubai, from the Burj Khalifa to desert safaris and the vibrant souk culture.',
  },
  {
    id: 'flights-from-usa-to-pakistan',
    title: 'Complete Guide to Flights from USA to Pakistan in 2025',
    excerpt: 'Planning to travel from USA to Pakistan? This comprehensive guide covers the best airlines, routes, booking tips, and how to get the best deals on Pakistan flights.',
    category: 'Air Travel',
    date: 'February 3, 2025',
    author: 'Ahsan Khan',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    relatedTourIds: ['umrah-package-2025'],
    tags: ['pakistan', 'flights', 'air-travel', 'guide'],
    content: 'Everything you need to know about booking flights from the USA to Pakistan, including best airlines, routes, and money-saving tips.',
  },
  {
    id: 'paris-on-a-budget',
    title: 'Paris on a Budget: Travel Tips for Smart Travelers',
    excerpt: 'Think Paris is too expensive? Think again! Our travel experts share insider tips to experience the magic of Paris without breaking the bank.',
    category: 'Travel Hacks',
    date: 'February 10, 2025',
    author: 'Travel Wings Team',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    relatedTourIds: ['paris-getaway-package', 'london-package-7-nights'],
    tags: ['paris', 'budget-travel', 'europe', 'tips'],
    content: 'Smart travel tips for visiting Paris on a budget, including free museums, local food spots, and affordable accommodation strategies.',
  },
];

export const getBlogPostById = (id: string): BlogPost | undefined => blogPosts.find(p => p.id === id);

export const getRelatedPosts = (postId: string, count = 3): BlogPost[] => {
  return blogPosts.filter(p => p.id !== postId).slice(0, count);
};

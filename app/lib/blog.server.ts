import { getDb } from './db.server';
import type { BlogPost } from '~/data/blog';

/** Maps a DB blog row to the BlogPost shape used throughout the app */
export function dbBlogToPost(row: Record<string, unknown>): BlogPost {
  const tags = (() => {
    try { return JSON.parse(row.tags as string) as string[]; } catch { return []; }
  })();

  return {
    id: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt as string) || '',
    content: row.content as string,
    category: row.category as string,
    date: new Date(row.createdAt as string).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    }),
    author: row.author as string,
    readTime: estimateReadTime(row.content as string),
    image: (row.featuredImage as string) || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    relatedTourIds: [],
    tags,
    // DB-only extras (optional)
    _dbId: row.id as number,
    _seoTitle: (row.seoTitle as string) || null,
    _status: row.status as string,
  };
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

/** Get all published blogs from DB */
export function getAllPublishedBlogs(): BlogPost[] {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM blogs WHERE status = 'published' ORDER BY createdAt DESC").all() as Record<string, unknown>[];
    return rows.map(dbBlogToPost);
  } catch {
    return [];
  }
}

/** Get a single blog by slug from DB */
export function getBlogBySlug(slug: string): BlogPost | null {
  try {
    const db = getDb();
    const row = db.prepare('SELECT * FROM blogs WHERE slug = ?').get(slug) as Record<string, unknown> | undefined;
    if (!row) return null;
    return dbBlogToPost(row);
  } catch {
    return null;
  }
}

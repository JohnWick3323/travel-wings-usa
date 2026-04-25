import { createClient, type Client } from '@libsql/client';
import path from 'path';

// Use process.cwd() so path resolves correctly in both dev and production
const DB_PATH = `file:${path.join(process.cwd(), 'data.db')}`;

let _client: Client | null = null;
let _initialized = false;

export function getDb(): Client {
  if (!_client) {
    _client = createClient({ url: DB_PATH });
  }
  return _client;
}

/** Initialize database schema — call once at server startup */
export async function initDb(): Promise<void> {
  if (_initialized) return;
  console.log('Initializing database at:', DB_PATH);
  _initialized = true;

  const db = getDb();

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      inquiryType TEXT NOT NULL,
      tourName TEXT,
      fromCity TEXT,
      toCity TEXT,
      departureDate TEXT,
      returnDate TEXT,
      passengers INTEGER,
      travelDate TEXT,
      numberOfTravelers INTEGER,
      subject TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      notes TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS blog_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      seoTitle TEXT,
      excerpt TEXT,
      content TEXT NOT NULL DEFAULT '',
      featuredImage TEXT,
      category TEXT NOT NULL DEFAULT 'General',
      author TEXT NOT NULL DEFAULT 'Travel Wings Team',
      tags TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'draft',
      publishedAt TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      folder TEXT NOT NULL DEFAULT 'General',
      type TEXT NOT NULL DEFAULT 'image',
      width INTEGER,
      height INTEGER,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '',
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed default blog categories if empty
  const catResult = await db.execute('SELECT COUNT(*) as c FROM blog_categories');
  const catCount = Number(catResult.rows[0]?.c ?? 0);
  if (catCount === 0) {
    const defaultCats = [
      ['General', 'general'],
      ['Umrah Tips', 'umrah-tips'],
      ['Destination Guide', 'destination-guide'],
      ['Air Travel', 'air-travel'],
      ['Travel Hacks', 'travel-hacks'],
      ['Hajj Guide', 'hajj-guide'],
      ['Pakistan Travel', 'pakistan-travel'],
      ['Europe Travel', 'europe-travel'],
      ['Middle East', 'middle-east'],
    ];
    for (const [name, slug] of defaultCats) {
      await db.execute({
        sql: 'INSERT OR IGNORE INTO blog_categories (name, slug) VALUES (?, ?)',
        args: [name, slug],
      });
    }
  }

  // Seed default site settings keys if not exist
  const defaultSettings: [string, string][] = [
    ['site_name', 'Travel Wings USA'],
    ['site_tagline', 'Your Trusted Travel Partner'],
    ['meta_description', 'Travel Wings USA offers affordable Umrah packages, Hajj tours, international flights, and travel packages from the USA.'],
    ['og_image', ''],
    ['gtm_id', ''],
    ['ga4_id', ''],
    ['custom_head_code', ''],
    ['custom_body_code', ''],
    ['footer_text', ''],
  ];
  for (const [key, value] of defaultSettings) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)`,
      args: [key, value],
    });
  }
}

/** Get all site settings as a key-value map */
export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    await initDb();
    const db = getDb();
    const result = await db.execute('SELECT key, value FROM site_settings');
    return Object.fromEntries(result.rows.map(r => [String(r.key), String(r.value)]));
  } catch {
    return {};
  }
}

// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  inquiryType: string;
  tourName: string | null;
  fromCity: string | null;
  toCity: string | null;
  departureDate: string | null;
  returnDate: string | null;
  passengers: number | null;
  travelDate: string | null;
  numberOfTravelers: number | null;
  subject: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'closed';
  notes: string | null;
  createdAt: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  seoTitle: string | null;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  category: string;
  author: string;
  tags: string; // JSON string array
  status: 'draft' | 'published';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export interface MediaItem {
  id: number;
  name: string;
  url: string;
  folder: string;
  type: string;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  updatedAt: string;
}

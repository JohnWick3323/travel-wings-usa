/**
 * Database layer using Node.js 22+ built-in `node:sqlite`.
 * No native binary compilation needed — works on any Node 22 host.
 */
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data.db');

let _db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!_db) {
    _db = new DatabaseSync(DB_PATH);
    _db.exec('PRAGMA journal_mode = WAL;');
    initDb(_db);
  }
  return _db;
}

function initDb(db: DatabaseSync): void {
  db.exec(`
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
  const catRow = db.prepare('SELECT COUNT(*) as c FROM blog_categories').get() as { c: number };
  if (catRow.c === 0) {
    const insertCat = db.prepare('INSERT OR IGNORE INTO blog_categories (name, slug) VALUES (?, ?)');
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
      insertCat.run(name, slug);
    }
  }

  // Seed default site settings if not exist
  const insertSetting = db.prepare('INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)');
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
    insertSetting.run(key, value);
  }
}

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

/** Get all site settings as a key-value map */
export function getSiteSettings(): Record<string, string> {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
    return Object.fromEntries(rows.map(r => [r.key, r.value]));
  } catch {
    return {};
  }
}

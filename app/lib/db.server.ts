import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    initDb(_db);
  }
  return _db;
}

function initDb(db: Database.Database): void {
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
  `);
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

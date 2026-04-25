import type { Route } from './+types/api.settings';
import { getDb } from '~/lib/db.server';

const ADMIN_TOKEN_PREFIX = 'Bearer ';

function getToken(request: Request): string | null {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith(ADMIN_TOKEN_PREFIX)) return null;
  return auth.slice(ADMIN_TOKEN_PREFIX.length);
}

function verifyToken(token: string | null): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'TravelWings2025!';
  return token === adminPassword;
}

export async function loader({ request }: Route.LoaderArgs) {
  // Public read for certain safe keys (used by root.tsx SSR)
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
  return Response.json({ settings: Object.fromEntries(rows.map(r => [r.key, r.value])) });
}

export async function action({ request }: Route.ActionArgs) {
  const token = getToken(request);
  if (!verifyToken(token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.method === 'PATCH') {
    const body = await request.json() as Record<string, string>;
    const db = getDb();
    const update = db.prepare(
      `INSERT INTO site_settings (key, value, updatedAt) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`
    );
    for (const [key, value] of Object.entries(body)) {
      update.run(key, String(value));
    }
    const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
    return Response.json({ settings: Object.fromEntries(rows.map(r => [r.key, r.value])) });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

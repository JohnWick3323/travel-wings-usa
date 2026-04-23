import type { Route } from './+types/api.settings';
import { ensureDb } from '~/lib/db.server';

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
  const db = await ensureDb();
  const result = await db.execute('SELECT key, value FROM site_settings');
  return Response.json({ settings: Object.fromEntries(result.rows.map(r => [r.key as string, r.value as string])) });
}

export async function action({ request }: Route.ActionArgs) {
  const token = getToken(request);
  if (!verifyToken(token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.method === 'PATCH') {
    const body = await request.json() as Record<string, string>;
    const db = await ensureDb();
    for (const [key, value] of Object.entries(body)) {
      await db.execute({
        sql: `INSERT INTO site_settings (key, value, updatedAt) VALUES (?, ?, datetime('now'))
              ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`,
        args: [key, String(value)],
      });
    }
    const result = await db.execute('SELECT key, value FROM site_settings');
    return Response.json({ settings: Object.fromEntries(result.rows.map(r => [r.key as string, r.value as string])) });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

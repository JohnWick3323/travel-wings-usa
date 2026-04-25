import type { Route } from './+types/api.settings';
import { getDb, initDb } from '~/lib/db.server';

function checkAuth(request: Request): boolean {
  const auth = request.headers.get('Authorization') || '';
  const adminPassword = process.env.ADMIN_PASSWORD || 'TravelWings2025!';
  return auth === `Bearer ${adminPassword}`;
}

export async function loader({ request: _request }: Route.LoaderArgs) {
  await initDb();
  const db = getDb();
  const result = await db.execute('SELECT key, value FROM site_settings');
  return Response.json({ settings: Object.fromEntries(result.rows.map(r => [String(r.key), String(r.value)])) });
}

export async function action({ request }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.method === 'PATCH') {
    await initDb();
    const body = await request.json() as Record<string, string>;
    const db = getDb();
    for (const [key, value] of Object.entries(body)) {
      await db.execute({
        sql: `INSERT INTO site_settings (key, value, updatedAt) VALUES (?, ?, datetime('now'))
             ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`,
        args: [key, String(value)],
      });
    }
    const result = await db.execute('SELECT key, value FROM site_settings');
    return Response.json({ settings: Object.fromEntries(result.rows.map(r => [String(r.key), String(r.value)])) });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

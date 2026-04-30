import type { Route } from './+types/api.newsletter';
import { getDb, initDb } from '~/lib/db.server';
import { rateLimit, getClientIp } from '~/lib/auth.server';

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const ip = getClientIp(request);
  if (!rateLimit(`newsletter:${ip}`, 5, 60_000)) {
    return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    await initDb();
    const db = getDb();
    await db.execute({ sql: 'INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)', args: [body.email || ''] });
    return Response.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

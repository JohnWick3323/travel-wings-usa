import type { Route } from './+types/api.media.$id';
import { getDb, initDb } from '~/lib/db.server';

function checkAuth(request: Request): boolean {
  const auth = request.headers.get('Authorization') || '';
  const adminPassword = process.env.ADMIN_PASSWORD || 'TravelWings2025!';
  return auth === `Bearer ${adminPassword}`;
}

export async function action({ request, params }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await initDb();
  const db = getDb();
  const id = Number(params.id);

  if (request.method === 'PATCH') {
    const body = await request.json() as { name?: string; folder?: string };
    const existingResult = await db.execute({ sql: 'SELECT * FROM media WHERE id = ?', args: [id] });
    const item = existingResult.rows[0];
    if (!item) return Response.json({ error: 'Not found' }, { status: 404 });
    await db.execute({
      sql: 'UPDATE media SET name = ?, folder = ? WHERE id = ?',
      args: [body.name?.trim() || String(item.name), body.folder?.trim() || String(item.folder), id],
    });
    const updated = await db.execute({ sql: 'SELECT * FROM media WHERE id = ?', args: [id] });
    return Response.json({ item: updated.rows[0] });
  }

  if (request.method === 'DELETE') {
    await db.execute({ sql: 'DELETE FROM media WHERE id = ?', args: [id] });
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

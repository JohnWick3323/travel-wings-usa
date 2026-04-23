import type { Route } from './+types/api.media.$id';
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

export async function action({ request, params }: Route.ActionArgs) {
  const token = getToken(request);
  if (!verifyToken(token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const id = Number(params.id);

  if (request.method === 'PATCH') {
    const body = await request.json() as { name?: string; folder?: string };
    const item = db.prepare('SELECT * FROM media WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    if (!item) return Response.json({ error: 'Not found' }, { status: 404 });
    db.prepare('UPDATE media SET name = ?, folder = ? WHERE id = ?').run(
      body.name?.trim() || String(item.name),
      body.folder?.trim() || String(item.folder),
      id,
    );
    return Response.json({ item: db.prepare('SELECT * FROM media WHERE id = ?').get(id) });
  }

  if (request.method === 'DELETE') {
    db.prepare('DELETE FROM media WHERE id = ?').run(id);
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

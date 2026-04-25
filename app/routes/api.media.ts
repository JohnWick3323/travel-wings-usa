import type { Route } from './+types/api.media';
import { getDb, initDb } from '~/lib/db.server';

function checkAuth(request: Request): boolean {
  const auth = request.headers.get('Authorization') || '';
  const adminPassword = process.env.ADMIN_PASSWORD || 'TravelWings2025!';
  return auth === `Bearer ${adminPassword}`;
}

export async function loader({ request }: Route.LoaderArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await initDb();
  const db = getDb();
  const url = new URL(request.url);
  const folder = url.searchParams.get('folder') || '';

  const result = folder
    ? await db.execute({ sql: 'SELECT * FROM media WHERE folder = ? ORDER BY createdAt DESC', args: [folder] })
    : await db.execute('SELECT * FROM media ORDER BY createdAt DESC');

  return Response.json({ media: result.rows });
}

export async function action({ request }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await initDb();
  const db = getDb();

  if (request.method === 'POST') {
    const body = await request.json() as {
      name: string;
      url: string;
      folder?: string;
      type?: string;
      width?: number;
      height?: number;
    };
    if (!body.url?.trim()) {
      return Response.json({ error: 'URL is required' }, { status: 400 });
    }
    const result = await db.execute({
      sql: 'INSERT INTO media (name, url, folder, type, width, height) VALUES (?, ?, ?, ?, ?, ?)',
      args: [
        body.name?.trim() || 'Untitled',
        body.url.trim(),
        body.folder?.trim() || 'General',
        body.type || 'image',
        body.width || null,
        body.height || null,
      ],
    });
    const itemResult = await db.execute({ sql: 'SELECT * FROM media WHERE id = ?', args: [String(result.lastInsertRowid)] });
    return Response.json({ item: itemResult.rows[0] });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

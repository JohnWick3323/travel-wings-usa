import type { Route } from './+types/api.media';
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
  const token = getToken(request);
  if (!verifyToken(token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = getDb();
  const url = new URL(request.url);
  const folder = url.searchParams.get('folder') || '';
  const query = folder
    ? 'SELECT * FROM media WHERE folder = ? ORDER BY createdAt DESC'
    : 'SELECT * FROM media ORDER BY createdAt DESC';
  const media = folder ? db.prepare(query).all(folder) : db.prepare(query).all();
  return Response.json({ media });
}

export async function action({ request }: Route.ActionArgs) {
  const token = getToken(request);
  if (!verifyToken(token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
    const result = db.prepare(
      'INSERT INTO media (name, url, folder, type, width, height) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(
      body.name?.trim() || 'Untitled',
      body.url.trim(),
      body.folder?.trim() || 'General',
      body.type || 'image',
      body.width || null,
      body.height || null,
    );
    const item = db.prepare('SELECT * FROM media WHERE id = ?').get(result.lastInsertRowid);
    return Response.json({ item });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

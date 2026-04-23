import type { Route } from './+types/api.categories';
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
  const result = await db.execute('SELECT * FROM blog_categories ORDER BY name ASC');
  return Response.json({ categories: result.rows });
}

export async function action({ request }: Route.ActionArgs) {
  const token = getToken(request);
  if (!verifyToken(token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await ensureDb();

  if (request.method === 'POST') {
    const body = await request.json() as { name: string };
    if (!body.name?.trim()) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }
    const name = body.name.trim();
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
    try {
      const result = await db.execute({ sql: 'INSERT INTO blog_categories (name, slug) VALUES (?, ?)', args: [name, slug] });
      const cat = await db.execute({ sql: 'SELECT * FROM blog_categories WHERE id = ?', args: [Number(result.lastInsertRowid)] });
      return Response.json({ category: cat.rows[0] });
    } catch {
      return Response.json({ error: 'Category already exists' }, { status: 409 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

import type { Route } from './+types/api.categories';
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
  const db = getDb();
  const categories = db.prepare('SELECT * FROM blog_categories ORDER BY name ASC').all();
  return Response.json({ categories });
}

export async function action({ request }: Route.ActionArgs) {
  const token = getToken(request);
  if (!verifyToken(token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();

  if (request.method === 'POST') {
    const body = await request.json() as { name: string };
    if (!body.name?.trim()) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }
    const name = body.name.trim();
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
    try {
      const result = db.prepare('INSERT INTO blog_categories (name, slug) VALUES (?, ?)').run(name, slug);
      const cat = db.prepare('SELECT * FROM blog_categories WHERE id = ?').get(result.lastInsertRowid);
      return Response.json({ category: cat });
    } catch {
      return Response.json({ error: 'Category already exists' }, { status: 409 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

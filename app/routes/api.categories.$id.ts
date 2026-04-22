import type { Route } from './+types/api.categories.$id';
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
    const body = await request.json() as { name: string };
    if (!body.name?.trim()) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }
    const name = body.name.trim();
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
    try {
      db.prepare('UPDATE blog_categories SET name = ?, slug = ? WHERE id = ?').run(name, slug, id);
      const cat = db.prepare('SELECT * FROM blog_categories WHERE id = ?').get(id);
      return Response.json({ category: cat });
    } catch {
      return Response.json({ error: 'Category name already exists' }, { status: 409 });
    }
  }

  if (request.method === 'DELETE') {
    db.prepare('DELETE FROM blog_categories WHERE id = ?').run(id);
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

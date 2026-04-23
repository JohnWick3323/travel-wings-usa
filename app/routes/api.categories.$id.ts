import type { Route } from './+types/api.categories.$id';
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

export async function action({ request, params }: Route.ActionArgs) {
  const token = getToken(request);
  if (!verifyToken(token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await ensureDb();
  const id = Number(params.id);

  if (request.method === 'PATCH') {
    const body = await request.json() as { name: string };
    if (!body.name?.trim()) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }
    const name = body.name.trim();
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
    try {
      await db.execute({ sql: 'UPDATE blog_categories SET name = ?, slug = ? WHERE id = ?', args: [name, slug, id] });
      const cat = await db.execute({ sql: 'SELECT * FROM blog_categories WHERE id = ?', args: [id] });
      return Response.json({ category: cat.rows[0] });
    } catch {
      return Response.json({ error: 'Category name already exists' }, { status: 409 });
    }
  }

  if (request.method === 'DELETE') {
    await db.execute({ sql: 'DELETE FROM blog_categories WHERE id = ?', args: [id] });
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

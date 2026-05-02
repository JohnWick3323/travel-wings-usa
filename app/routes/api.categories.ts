import type { Route } from './+types/api.categories';
import { getDb, initDb } from '~/lib/db.server';
import { checkAuth } from '~/lib/auth.server';

export async function loader({ request: _request }: Route.LoaderArgs) {
  await initDb();
  const db = getDb();
  const result = await db.execute('SELECT * FROM blog_categories ORDER BY name ASC');
  return Response.json({ categories: result.rows });
}

export async function action({ request }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await initDb();
  const db = getDb();

  if (request.method === 'POST') {
    const body = await request.json() as { name: string };
    if (!body.name?.trim()) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }
    const name = body.name.trim();
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
    try {
      const result = await db.execute({ sql: 'INSERT INTO blog_categories (name, slug) VALUES (?, ?)', args: [name, slug] });
      const catResult = await db.execute({ sql: 'SELECT * FROM blog_categories WHERE id = ?', args: [String(result.lastInsertRowid)] });
      return Response.json({ category: catResult.rows[0] });
    } catch {
      return Response.json({ error: 'Category already exists' }, { status: 409 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

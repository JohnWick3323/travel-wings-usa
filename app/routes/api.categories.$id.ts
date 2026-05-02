import type { Route } from './+types/api.categories.$id';
import { getDb, initDb } from '~/lib/db.server';
import { checkAuth } from '~/lib/auth.server';

export async function action({ request, params }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await initDb();
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
      await db.execute({ sql: 'UPDATE blog_categories SET name = ?, slug = ? WHERE id = ?', args: [name, slug, id] });
      const catResult = await db.execute({ sql: 'SELECT * FROM blog_categories WHERE id = ?', args: [id] });
      return Response.json({ category: catResult.rows[0] });
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

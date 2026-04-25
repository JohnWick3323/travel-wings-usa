import type { Route } from './+types/api.blogs.$id';
import { getDb, initDb } from '~/lib/db.server';

function checkAuth(request: Request): boolean {
  const auth = request.headers.get('Authorization') || '';
  const adminPassword = process.env.ADMIN_PASSWORD || 'TravelWings2025!';
  return auth === `Bearer ${adminPassword}`;
}

/** GET /api/blogs/:id */
export async function loader({ params }: Route.LoaderArgs) {
  await initDb();
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM blogs WHERE id = ?', args: [params.id] });
  if (!result.rows[0]) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ blog: result.rows[0] });
}

/** PATCH /api/blogs/:id | DELETE /api/blogs/:id */
export async function action({ request, params }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await initDb();
  const db = getDb();
  const { id } = params;

  if (request.method === 'DELETE') {
    await db.execute({ sql: 'DELETE FROM blogs WHERE id = ?', args: [id] });
    return Response.json({ success: true });
  }

  if (request.method === 'PATCH') {
    const body = await request.json();
    const { title, slug, seoTitle, excerpt, content, featuredImage, category, author, tags, status, publishedAt } = body;
    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : undefined;

    // Auto-set publishedAt when publishing for the first time
    const existingResult = await db.execute({ sql: 'SELECT publishedAt, status FROM blogs WHERE id = ?', args: [id] });
    const existing = existingResult.rows[0] as unknown as { publishedAt: string | null; status: string } | undefined;
    let resolvedPublishedAt = publishedAt !== undefined ? (publishedAt || null) : (existing?.publishedAt || null);
    if (status === 'published' && !resolvedPublishedAt) {
      resolvedPublishedAt = new Date().toISOString().slice(0, 10);
    }

    try {
      await db.execute({
        sql: `UPDATE blogs SET
          title = COALESCE(?, title),
          slug = COALESCE(?, slug),
          seoTitle = ?,
          excerpt = ?,
          content = COALESCE(?, content),
          featuredImage = ?,
          category = COALESCE(?, category),
          author = COALESCE(?, author),
          tags = COALESCE(?, tags),
          status = COALESCE(?, status),
          publishedAt = ?,
          updatedAt = datetime('now')
        WHERE id = ?`,
        args: [
          title || null,
          slug || null,
          seoTitle !== undefined ? seoTitle : null,
          excerpt !== undefined ? excerpt : null,
          content || null,
          featuredImage !== undefined ? featuredImage : null,
          category || null,
          author || null,
          tagsJson || null,
          status || null,
          resolvedPublishedAt,
          id,
        ],
      });
      const blogResult = await db.execute({ sql: 'SELECT * FROM blogs WHERE id = ?', args: [id] });
      return Response.json({ success: true, blog: blogResult.rows[0] });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message.includes('UNIQUE constraint failed')) {
        return Response.json({ error: 'A blog with this slug already exists.' }, { status: 409 });
      }
      return Response.json({ error: 'Failed to update blog' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

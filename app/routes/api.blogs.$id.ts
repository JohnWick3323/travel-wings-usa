import type { Route } from './+types/api.blogs.$id';
import { getDb } from '~/lib/db.server';

function checkAuth(request: Request): boolean {
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${process.env.ADMIN_SESSION_SECRET}`;
}

/** GET /api/blogs/:id */
export async function loader({ params }: Route.LoaderArgs) {
  const db = getDb();
  const blog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(params.id);
  if (!blog) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ blog });
}

/** PATCH /api/blogs/:id | DELETE /api/blogs/:id */
export async function action({ request, params }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const { id } = params;

  if (request.method === 'DELETE') {
    db.prepare('DELETE FROM blogs WHERE id = ?').run(id);
    return Response.json({ success: true });
  }

  if (request.method === 'PATCH') {
    const body = await request.json();
    const { title, slug, seoTitle, excerpt, content, featuredImage, category, author, tags, status } = body;
    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : undefined;

    try {
      db.prepare(`
        UPDATE blogs SET
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
          updatedAt = datetime('now')
        WHERE id = ?
      `).run(
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
        id,
      );
      const blog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);
      return Response.json({ success: true, blog });
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

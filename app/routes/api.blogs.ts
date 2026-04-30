import type { Route } from './+types/api.blogs';
import { getDb, initDb } from '~/lib/db.server';
import { checkAuth } from '~/lib/auth.server';

/** GET /api/blogs — public (published only) OR admin (all with ?all=1) */
export async function loader({ request }: Route.LoaderArgs) {
  await initDb();
  const db = getDb();
  const url = new URL(request.url);
  const all = url.searchParams.get('all') === '1';

  if (all) {
    if (!checkAuth(request)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const result = await db.execute('SELECT * FROM blogs ORDER BY createdAt DESC');
    return Response.json({ blogs: result.rows });
  }

  const result = await db.execute("SELECT * FROM blogs WHERE status = 'published' ORDER BY createdAt DESC");
  return Response.json({ blogs: result.rows });
}

/** POST /api/blogs — create new blog */
export async function action({ request }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  await initDb();
  const body = await request.json();
  const { title, slug, seoTitle, excerpt, content, featuredImage, category, author, tags, status, publishedAt } = body;

  if (!title || !slug) {
    return Response.json({ error: 'Title and slug are required' }, { status: 400 });
  }

  const db = getDb();
  const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);
  const resolvedPublishedAt = publishedAt || (status === 'published' ? new Date().toISOString().slice(0, 10) : null);

  try {
    const result = await db.execute({
      sql: `INSERT INTO blogs (title, slug, seoTitle, excerpt, content, featuredImage, category, author, tags, status, publishedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        title,
        slug,
        seoTitle || null,
        excerpt || null,
        content || '',
        featuredImage || null,
        category || 'General',
        author || 'Travel Wings Team',
        tagsJson,
        status || 'draft',
        resolvedPublishedAt,
      ],
    });
    const blogResult = await db.execute({ sql: 'SELECT * FROM blogs WHERE id = ?', args: [String(result.lastInsertRowid)] });
    return Response.json({ success: true, blog: blogResult.rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('UNIQUE constraint failed')) {
      return Response.json({ error: 'A blog with this slug already exists.' }, { status: 409 });
    }
    return Response.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

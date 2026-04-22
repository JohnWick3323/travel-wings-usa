import type { Route } from './+types/api.blogs';
import { getDb } from '~/lib/db.server';

function checkAuth(request: Request): boolean {
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${process.env.ADMIN_SESSION_SECRET}`;
}

/** GET /api/blogs — public (published only) OR admin (all with ?all=1) */
export async function loader({ request }: Route.LoaderArgs) {
  const db = getDb();
  const url = new URL(request.url);
  const all = url.searchParams.get('all') === '1';

  if (all) {
    if (!checkAuth(request)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const blogs = db.prepare('SELECT * FROM blogs ORDER BY createdAt DESC').all();
    return Response.json({ blogs });
  }

  const blogs = db.prepare("SELECT * FROM blogs WHERE status = 'published' ORDER BY createdAt DESC").all();
  return Response.json({ blogs });
}

/** POST /api/blogs — create new blog */
export async function action({ request }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const body = await request.json();
  const { title, slug, seoTitle, excerpt, content, featuredImage, category, author, tags, status } = body;

  if (!title || !slug) {
    return Response.json({ error: 'Title and slug are required' }, { status: 400 });
  }

  const db = getDb();
  const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);

  try {
    const result = db.prepare(`
      INSERT INTO blogs (title, slug, seoTitle, excerpt, content, featuredImage, category, author, tags, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    );
    const blog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(result.lastInsertRowid);
    return Response.json({ success: true, blog });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('UNIQUE constraint failed')) {
      return Response.json({ error: 'A blog with this slug already exists.' }, { status: 409 });
    }
    return Response.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

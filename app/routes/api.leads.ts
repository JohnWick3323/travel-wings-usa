import type { Route } from './+types/api.leads';
import { getDb } from '~/lib/db.server';

function checkAuth(request: Request): boolean {
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${process.env.ADMIN_SESSION_SECRET}`;
}

export async function loader({ request }: Route.LoaderArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = getDb();
  const leads = db.prepare('SELECT * FROM leads ORDER BY createdAt DESC').all();
  return Response.json({ leads });
}

export async function action({ request, params }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = getDb();
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (request.method === 'DELETE') {
    db.prepare('DELETE FROM leads WHERE id = ?').run(id);
    return Response.json({ success: true });
  }

  if (request.method === 'PATCH') {
    const body = await request.json();
    db.prepare('UPDATE leads SET status = COALESCE(?, status), notes = COALESCE(?, notes) WHERE id = ?')
      .run(body.status || null, body.notes !== undefined ? body.notes : null, id);
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

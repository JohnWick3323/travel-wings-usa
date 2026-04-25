import type { Route } from './+types/api.leads.$id';
import { getDb } from '~/lib/db.server';

function checkAuth(request: Request): boolean {
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${process.env.ADMIN_SESSION_SECRET}`;
}

export async function action({ request, params }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = getDb();
  const { id } = params;

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

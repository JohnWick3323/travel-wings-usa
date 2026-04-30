import type { Route } from './+types/api.leads.$id';
import { getDb, initDb } from '~/lib/db.server';
import { checkAuth } from '~/lib/auth.server';

export async function action({ request, params }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await initDb();
  const db = getDb();
  const { id } = params;

  if (request.method === 'DELETE') {
    await db.execute({ sql: 'DELETE FROM leads WHERE id = ?', args: [id] });
    return Response.json({ success: true });
  }

  if (request.method === 'PATCH') {
    const body = await request.json();
    await db.execute({
      sql: 'UPDATE leads SET status = COALESCE(?, status), notes = COALESCE(?, notes) WHERE id = ?',
      args: [body.status || null, body.notes !== undefined ? body.notes : null, id],
    });
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

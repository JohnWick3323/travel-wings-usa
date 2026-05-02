import type { Route } from './+types/api.leads';
import { getDb, initDb } from '~/lib/db.server';
import { checkAuth } from '~/lib/auth.server';

export async function loader({ request }: Route.LoaderArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await initDb();
  const db = getDb();
  const result = await db.execute('SELECT * FROM leads ORDER BY createdAt DESC');
  return Response.json({ leads: result.rows });
}

export async function action({ request }: Route.ActionArgs) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await initDb();
  const db = getDb();
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (request.method === 'DELETE') {
    await db.execute({ sql: 'DELETE FROM leads WHERE id = ?', args: [id ?? ''] });
    return Response.json({ success: true });
  }

  if (request.method === 'PATCH') {
    const body = await request.json();
    await db.execute({
      sql: 'UPDATE leads SET status = COALESCE(?, status), notes = COALESCE(?, notes) WHERE id = ?',
      args: [body.status || null, body.notes !== undefined ? body.notes : null, id ?? ''],
    });
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

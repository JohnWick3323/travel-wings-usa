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

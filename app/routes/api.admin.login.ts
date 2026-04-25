import type { Route } from './+types/api.admin.login';

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const body = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (body.password === adminPassword) {
    const token = process.env.ADMIN_SESSION_SECRET || 'admin-secret-token';
    return Response.json({ success: true, token });
  }

  return Response.json({ error: 'Invalid password' }, { status: 401 });
}

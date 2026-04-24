import type { Route } from './+types/api.admin.login';

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const body = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (body.password === adminPassword) {
    // Return the password itself as the bearer token — all protected routes verify against ADMIN_PASSWORD
    return Response.json({ success: true, token: adminPassword });
  }

  return Response.json({ error: 'Invalid password' }, { status: 401 });
}

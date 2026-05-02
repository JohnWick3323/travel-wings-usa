import type { Route } from './+types/api.admin.login';
import { validateLogin, rateLimit, getClientIp } from '~/lib/auth.server';

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const ip = getClientIp(request);
  if (!rateLimit(`login:${ip}`, 5, 60_000)) {
    return Response.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
  }

  const body = await request.json();
  const token = validateLogin(body.password);

  if (token) {
    return Response.json({ success: true, token });
  }

  return Response.json({ error: 'Invalid password' }, { status: 401 });
}

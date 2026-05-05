import type { Route } from './+types/catch-all';

export function loader(_args: Route.LoaderArgs) {
  throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
}

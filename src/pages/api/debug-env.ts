import type { APIRoute } from 'astro';

// TEMPORARY DEBUG ENDPOINT — DELETE AFTER FIXING ENV VARS
// Visit: https://travelwingsusa.com/api/debug-env
// This only shows whether keys are SET or MISSING — never shows actual values

export const GET: APIRoute = async () => {
  const checks = {
    RESEND_API_KEY: import.meta.env.RESEND_API_KEY ? 'SET ✅' : 'MISSING ❌',
    PUBLIC_RESEND_API_KEY: import.meta.env.PUBLIC_RESEND_API_KEY ? 'SET ✅' : 'MISSING ❌',
    PUBLIC_WP_URL: import.meta.env.PUBLIC_WP_URL ? 'SET ✅' : 'MISSING ❌',
    NODE_ENV: import.meta.env.MODE || 'unknown',
  };

  return new Response(JSON.stringify(checks, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

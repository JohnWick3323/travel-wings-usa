import type { APIRoute } from 'astro';

// TEMPORARY DEBUG ENDPOINT — DELETE AFTER FIXING
// Visit: https://travelwingsusa.com/api/debug-env

export const GET: APIRoute = async () => {
  const apiKey = import.meta.env.RESEND_API_KEY || import.meta.env.PUBLIC_RESEND_API_KEY;

  const envCheck = {
    RESEND_API_KEY: import.meta.env.RESEND_API_KEY ? 'SET ✅' : 'MISSING ❌',
    PUBLIC_RESEND_API_KEY: import.meta.env.PUBLIC_RESEND_API_KEY ? 'SET ✅' : 'MISSING ❌',
    PUBLIC_WP_URL: import.meta.env.PUBLIC_WP_URL ? 'SET ✅' : 'MISSING ❌',
    NODE_ENV: import.meta.env.MODE || 'unknown',
  };

  if (!apiKey) {
    return new Response(JSON.stringify({ ...envCheck, resend_test: 'SKIPPED — no API key' }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Test actual Resend API call
  let resendResult: Record<string, unknown> = {};
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Travel Wings USA <noreply@travelwingsusa.com>',
        to: ['info@travelwingsusa.com'],
        subject: 'Test Email — Debug Check',
        html: '<p>This is a test from the debug endpoint.</p>',
      }),
    });

    const body = await res.text();
    resendResult = {
      status: res.status,
      ok: res.ok,
      response: body,
    };
  } catch (e) {
    resendResult = { error: String(e) };
  }

  return new Response(JSON.stringify({ ...envCheck, resend_test: resendResult }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

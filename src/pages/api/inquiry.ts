import type { APIRoute } from 'astro';

const TO_EMAILS = ['info@travelwingsusa.com', 'travelwings@gmail.com'];

// Simple in-memory rate limiting (per server process)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

function sanitizeText(str: string): string {
  return (str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').slice(0, 2000);
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Rate limiting
  const ip = clientAddress || 'unknown';
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Try both variable names — Hostinger may have PUBLIC_ prefix set
  const apiKey = import.meta.env.RESEND_API_KEY || import.meta.env.PUBLIC_RESEND_API_KEY;

  if (!apiKey) {
    console.error('[inquiry] No RESEND_API_KEY found. Checked: RESEND_API_KEY, PUBLIC_RESEND_API_KEY');
    return new Response(JSON.stringify({ success: false, error: 'Email service not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let data: Record<string, string>;
  try {
    data = await request.json() as Record<string, string>;
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, email, phone, subject, message, inquiry_type } = data;

  // Input validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ success: false, error: 'Valid email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!name || name.trim().length < 2) {
    return new Response(JSON.stringify({ success: false, error: 'Name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Sanitize all inputs
  const safeName = sanitizeText(name);
  const safeEmail = sanitizeText(email);
  const safePhone = sanitizeText(phone || '');
  const safeSubject = sanitizeText(subject || '');
  const safeMessage = sanitizeText(message || '');

  const emailSubject = safeSubject || (inquiry_type === 'tour_quote' ? 'Tour Quote Request' : 'Contact Form Inquiry');
  const inquiryLabel = inquiry_type === 'tour_quote'
    ? 'Tour Quote Request'
    : inquiry_type === 'newsletter'
      ? 'Newsletter Signup'
      : 'Contact Form Inquiry';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#015FC9;padding:20px;border-radius:8px 8px 0 0;">
        <h2 style="color:white;margin:0;">New ${inquiryLabel}</h2>
      </div>
      <div style="background:#f9f9f9;padding:20px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px;font-weight:bold;width:120px;color:#6b7280;">Name</td><td style="padding:10px;">${safeName}</td></tr>
          <tr style="background:#fff"><td style="padding:10px;font-weight:bold;color:#6b7280;">Email</td><td style="padding:10px;"><a href="mailto:${safeEmail}" style="color:#015FC9;">${safeEmail}</a></td></tr>
          <tr><td style="padding:10px;font-weight:bold;color:#6b7280;">Phone</td><td style="padding:10px;">${safePhone || 'N/A'}</td></tr>
          <tr style="background:#fff"><td style="padding:10px;font-weight:bold;color:#6b7280;">Subject</td><td style="padding:10px;">${emailSubject}</td></tr>
          <tr><td style="padding:10px;font-weight:bold;color:#6b7280;vertical-align:top;">Message</td><td style="padding:10px;">${safeMessage.replace(/\n/g, '<br>')}</td></tr>
        </table>
        <p style="color:#9ca3af;font-size:12px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:10px;">Sent from travelwingsusa.com</p>
      </div>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Travel Wings USA <noreply@travelwingsusa.com>',
        to: TO_EMAILS,
        reply_to: safeEmail ? `${safeName} <${safeEmail}>` : undefined,
        subject: `New Inquiry: ${emailSubject}`,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[inquiry] Resend API error ${res.status}:`, errText);
      return new Response(JSON.stringify({ success: false, error: `Email API error: ${res.status}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[inquiry] fetch to Resend failed:', e);
    return new Response(JSON.stringify({ success: false, error: 'Network error sending email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

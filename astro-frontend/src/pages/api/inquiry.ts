import type { APIRoute } from 'astro';

export const prerender = false;

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || 're_ahDMVbzh_3YLEfNrG4cpIDtnnAx9kigx';
const TO_EMAIL = 'info@travelwingsusa.com';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as Record<string, string>;
    const { name, email, phone, subject, message, inquiry_type } = body;

    const emailSubject = subject || (inquiry_type === 'tour_quote' ? 'Tour Quote Request' : 'Contact Form Inquiry');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #015FC9; border-bottom: 2px solid #015FC9; padding-bottom: 10px;">
          New ${inquiry_type === 'tour_quote' ? 'Tour Quote Request' : 'Contact Form Inquiry'}
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px;">${name || 'N/A'}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${email}">${email || 'N/A'}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${phone || 'N/A'}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold;">Subject:</td><td style="padding: 8px;">${emailSubject}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td><td style="padding: 8px;">${(message || '').replace(/\n/g, '<br>')}</td></tr>
        </table>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Sent from Travel Wings USA website
        </p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Travel Wings USA <onboarding@resend.dev>',
        to: [TO_EMAIL],
        reply_to: email ? `${name} <${email}>` : undefined,
        subject: `New Inquiry: ${emailSubject}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response(JSON.stringify({ success: false, error: err }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error('Inquiry API error:', e);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
};

import type { APIRoute } from 'astro';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || 're_ahDMVbzh_3YLEfNrG4cpIDtnnAx9kigx';
const TO_EMAILS = ['info@travelwingsusa.com', 'travelwings@gmail.com'];

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json() as Record<string, string>;
    const { name, email, phone, subject, message, inquiry_type } = data;

    const emailSubject = subject || (inquiry_type === 'tour_quote' ? 'Tour Quote Request' : 'Contact Form Inquiry');

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:#015FC9;padding:20px;border-radius:8px 8px 0 0;">
          <h2 style="color:white;margin:0;">New ${inquiry_type === 'tour_quote' ? 'Tour Quote Request' : inquiry_type === 'newsletter' ? 'Newsletter Signup' : 'Contact Form Inquiry'}</h2>
        </div>
        <div style="background:#f9f9f9;padding:20px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px;font-weight:bold;width:120px;color:#6b7280;">Name</td><td style="padding:10px;">${name || 'N/A'}</td></tr>
            <tr style="background:#fff"><td style="padding:10px;font-weight:bold;color:#6b7280;">Email</td><td style="padding:10px;"><a href="mailto:${email}" style="color:#015FC9;">${email || 'N/A'}</a></td></tr>
            <tr><td style="padding:10px;font-weight:bold;color:#6b7280;">Phone</td><td style="padding:10px;">${phone || 'N/A'}</td></tr>
            <tr style="background:#fff"><td style="padding:10px;font-weight:bold;color:#6b7280;">Subject</td><td style="padding:10px;">${emailSubject}</td></tr>
            <tr><td style="padding:10px;font-weight:bold;color:#6b7280;vertical-align:top;">Message</td><td style="padding:10px;">${(message || '').replace(/\n/g, '<br>')}</td></tr>
          </table>
          <p style="color:#9ca3af;font-size:12px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:10px;">Sent from travelwingsusa.com</p>
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Travel Wings USA <noreply@travelwingsusa.com>',
        to: TO_EMAILS,
        reply_to: email ? `${name} <${email}>` : undefined,
        subject: `New Inquiry: ${emailSubject}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ success: false, error: err }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
};

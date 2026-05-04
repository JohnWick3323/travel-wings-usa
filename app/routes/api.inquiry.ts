import type { Route } from './+types/api.inquiry';
import { getDb, initDb } from '~/lib/db.server';
import { rateLimit, getClientIp } from '~/lib/auth.server';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const ip = getClientIp(request);
  if (!rateLimit(`inquiry:${ip}`, 10, 60_000)) {
    return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    await initDb();
    const db = getDb();

    const result = await db.execute({
      sql: `INSERT INTO leads (name, email, phone, inquiryType, tourName, fromCity, toCity, departureDate, returnDate, passengers, travelDate, numberOfTravelers, subject, message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.name || '',
        body.email || '',
        body.phone || null,
        body.inquiryType || 'contact_form',
        body.tourName || null,
        body.fromCity || null,
        body.toCity || null,
        body.departureDate || null,
        body.returnDate || null,
        body.passengers || null,
        body.travelDate || null,
        body.numberOfTravelers || null,
        body.subject || null,
        body.message || null,
      ],
    });

    // Send email notifications via Resend if configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);
        const toEmail = process.env.RESEND_TO_EMAIL || 'info@travelwingsusa.com';

        await Promise.allSettled([
          resend.emails.send({
            from: 'Travel Wings USA <noreply@travelwingsusa.com>',
            to: [toEmail],
            subject: `New Lead: ${body.inquiryType} from ${body.name}`,
            html: `<h2>New Inquiry from ${escapeHtml(String(body.name || ''))}</h2><p><strong>Type:</strong> ${escapeHtml(String(body.inquiryType || ''))}</p><p><strong>Email:</strong> ${escapeHtml(String(body.email || ''))}</p><p><strong>Phone:</strong> ${escapeHtml(String(body.phone || ''))}</p><p><strong>Message:</strong> ${escapeHtml(String(body.message || ''))}</p>`,
          }),
          resend.emails.send({
            from: 'Travel Wings USA <noreply@travelwingsusa.com>',
            to: [body.email],
            subject: 'Thank You for Contacting Travel Wings USA',
            html: `<h2>Thank you, ${escapeHtml(String(body.name || ''))}!</h2><p>We have received your inquiry and will get back to you within 24 hours.</p><p>For urgent assistance, call us at <strong>+1 410-298-4500</strong> or WhatsApp us.</p><br><p>Best regards,<br>Travel Wings USA Team</p>`,
          }),
        ]);
      } catch (e) {
        console.error('Email send failed:', e);
      }
    }

    return Response.json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (error) {
    console.error('Inquiry error:', error);
    return Response.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

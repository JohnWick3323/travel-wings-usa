import type { Route } from './+types/api.inquiry';
import { ensureDb } from '~/lib/db.server';

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await request.json();
    const db = await ensureDb();

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

        await Promise.allSettled([
          resend.emails.send({
            from: 'Travel Wings USA <noreply@travelwingsusa.com>',
            to: ['info@travelwingsusa.com'],
            subject: `New Lead: ${body.inquiryType} from ${body.name}`,
            html: `<h2>New Inquiry from ${body.name}</h2><p><strong>Type:</strong> ${body.inquiryType}</p><p><strong>Email:</strong> ${body.email}</p><p><strong>Phone:</strong> ${body.phone}</p><p><strong>Message:</strong> ${body.message}</p>`,
          }),
          resend.emails.send({
            from: 'Travel Wings USA <noreply@travelwingsusa.com>',
            to: [body.email],
            subject: 'Thank You for Contacting Travel Wings USA',
            html: `<h2>Thank you, ${body.name}!</h2><p>We have received your inquiry and will get back to you within 24 hours.</p><p>For urgent assistance, call us at <strong>+1 410-298-4500</strong> or WhatsApp us.</p><br><p>Best regards,<br>Travel Wings USA Team</p>`,
          }),
        ]);
      } catch (e) {
        console.error('Email send failed:', e);
      }
    }

    return Response.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Inquiry error:', error);
    return Response.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

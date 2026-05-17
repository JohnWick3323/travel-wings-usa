/**
 * Client-side email via Resend API
 * Called directly from React components
 */

const RESEND_API_KEY = 're_ahDMVbzh_3YLEfNrG4cpIDtnnAx9kigx';
const TO_EMAILS = ['info@travelwingsusa.com', 'travelwings@gmail.com'];

export interface InquiryData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiry_type?: string;
}

export async function sendInquiryEmail(data: InquiryData): Promise<boolean> {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#015FC9;border-bottom:2px solid #015FC9;padding-bottom:10px;">
        New ${data.inquiry_type === 'tour_quote' ? 'Tour Quote Request' : data.inquiry_type === 'newsletter' ? 'Newsletter Signup' : 'Contact Form Inquiry'}
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;font-weight:bold;width:120px;">Name:</td><td style="padding:8px;">${data.name}</td></tr>
        <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Phone:</td><td style="padding:8px;">${data.phone || 'N/A'}</td></tr>
        <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;">Subject:</td><td style="padding:8px;">${data.subject}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Message:</td><td style="padding:8px;">${(data.message || '').replace(/\n/g, '<br>')}</td></tr>
      </table>
      <p style="color:#666;font-size:12px;margin-top:20px;">Sent from travelwingsusa.com</p>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Travel Wings USA <noreply@travelwingsusa.com>',
        to: TO_EMAILS,
        reply_to: data.email ? `${data.name} <${data.email}>` : undefined,
        subject: `New Inquiry: ${data.subject}`,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

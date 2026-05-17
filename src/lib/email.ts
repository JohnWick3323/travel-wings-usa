/**
 * Client-side form submission — calls our own server endpoint
 * Server endpoint then calls Resend (no CORS issues, API key safe)
 */

interface InquiryData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiry_type?: string;
}

export async function sendInquiryEmail(data: InquiryData): Promise<boolean> {
  try {
    const res = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

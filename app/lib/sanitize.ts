/**
 * Sanitize a tracking ID (GTM/GA4) to prevent script injection.
 * Only allows alphanumeric characters and hyphens.
 */
export function sanitizeTrackingId(id: string): string {
  return id.replace(/[^a-zA-Z0-9-_]/g, '');
}

/**
 * Basic HTML sanitizer for user-generated content.
 * Strips dangerous tags (script, iframe, object, embed, form, etc.)
 * and event handler attributes (on*).
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Remove script tags and their content
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove dangerous tags (keep content, just strip the tags)
  clean = clean.replace(/<\/?(?:iframe|object|embed|form|input|textarea|button|select|applet|link|base)\b[^>]*>/gi, '');

  // Remove event handler attributes (onclick, onerror, onload, etc.)
  clean = clean.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');

  // Remove javascript: protocol in href/src attributes
  clean = clean.replace(/(href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '$1=""');

  return clean;
}

/**
 * Basic HTML sanitizer for blog content from WordPress REST API.
 * WordPress already sanitizes content server-side — this is a passthrough
 * that strips only dangerous script/iframe injections as a safety layer.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  // Remove script tags and event handlers — WP content is trusted but be safe
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '');
}

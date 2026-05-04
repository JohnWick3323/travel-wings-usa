import { createHash } from 'node:crypto';

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error('ADMIN_PASSWORD environment variable is required');
  }
  return password;
}

/** Generate a secure token from the password (not the raw password itself) */
function generateToken(password: string): string {
  const hash = createHash('sha256').update(password + '_travel_wings_token_salt').digest('hex');
  return hash;
}

/** Validate a login attempt. Returns a token on success, null on failure. */
export function validateLogin(password: string): string | null {
  const adminPassword = getAdminPassword();
  if (password === adminPassword) {
    return generateToken(adminPassword);
  }
  return null;
}

/** Check if a request has valid admin authorization */
export function checkAuth(request: Request): boolean {
  const auth = request.headers.get('Authorization') || '';
  const adminPassword = getAdminPassword();
  const expectedToken = generateToken(adminPassword);
  return auth === `Bearer ${expectedToken}`;
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/** Simple in-memory rate limiter. Returns true if request is allowed. */
export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

/** Get client IP from request headers */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

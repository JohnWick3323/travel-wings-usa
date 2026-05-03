---
name: testing-travel-wings
description: Test the Travel Wings USA platform end-to-end. Use when verifying UI, SEO, admin, or API changes.
---

# Testing Travel Wings USA

## Overview
Travel Wings USA is an SSR lead-generation travel platform built with React Router v7 + TypeScript + SQLite + CSS Modules.

## Dev Server Setup

```bash
npm install
npm run dev
```

Dev server runs on `localhost:5173` (or next available port if 5173 is in use).

## Environment Variables

Create a `.env` file in the project root:

```
ADMIN_PASSWORD="<password>"
RESEND_API_KEY=<key>
RESEND_TO_EMAIL=<email>
```

**IMPORTANT**: If `ADMIN_PASSWORD` contains `#`, it MUST be quoted with double quotes (e.g., `ADMIN_PASSWORD="123Travel@#"`). The `#` character is treated as a comment delimiter in `.env` files by Vite's parser. Without quotes, the password will be truncated at the `#`.

If `ADMIN_PASSWORD` is not set, the fallback password is `TravelWings2025!`.

The dev server must be restarted after changing `.env` values.

## Devin Secrets Needed

- `ADMIN_PASSWORD` — Admin login password (set in .env)
- `RESEND_API_KEY` — For email sending (optional for testing)
- `RESEND_TO_EMAIL` — Recipient email (optional for testing)

## Key Routes to Test

| Route | Purpose |
|---|---|
| `/` | Homepage with hero slider |
| `/destinations` | All tour cards |
| `/tour/:tourId` | Tour detail page (check dynamic title in tab) |
| `/blog` | Blog listing page |
| `/blog/:articleId` | Blog article page |
| `/contact` | Contact page with form + map |
| `/about` | About us page |
| `/admin` | Admin login + dashboard |
| `/privacy-policy` | Legal page |
| `/terms-of-service` | Legal page |
| `/robots.txt` | Search engine directives |
| `/sitemap.xml` | Dynamic XML sitemap |
| `/api/admin/login` | POST — login API |
| `/api/inquiry` | POST — contact form |
| `/api/newsletter` | POST — newsletter signup |

## SEO Testing

The site has comprehensive SEO implementation. When testing SEO changes:

### Quick Verification Commands

```bash
# Check robots.txt
curl -s http://localhost:5173/robots.txt

# Count sitemap URLs (should be 21+)
curl -s http://localhost:5173/sitemap.xml | grep -c '<url>'

# Check OG tags on any page
curl -s http://localhost:5173/ | grep -oP '<meta[^>]*(og:|twitter:|description|canonical)[^>]*>'

# Check H1 count (should be 1 per page)
curl -s http://localhost:5173/ | grep -c '<h1'

# Check JSON-LD schema types on a page
curl -s http://localhost:5173/tour/umrah-package-2025 | grep -oP '"@type"\s*:\s*"[^"]*"' | sort -u

# Check canonical URL
curl -s http://localhost:5173/ | grep -oP '<link[^>]*canonical[^>]*>'

# Check for nested <main> (should only be 1 per page)
curl -s http://localhost:5173/blog/how-to-prepare-for-umrah-2025 | grep -c '<main'
```

### Expected SEO Elements Per Page

| Page | Expected JSON-LD Types | og:type |
|---|---|---|
| Homepage (`/`) | TravelAgency, WebSite | website |
| Tour detail (`/tour/:id`) | TravelAgency, WebSite, TouristTrip, FAQPage, BreadcrumbList | website |
| Blog article (`/blog/:id`) | TravelAgency, WebSite, BlogPosting, BreadcrumbList | article |
| Contact (`/contact`) | TravelAgency, WebSite, TravelAgency (LocalBusiness), BreadcrumbList | website |

### SEO Config Location
- Centralized SEO: `app/lib/seo.ts` (SITE_URL, generateSeoMeta)
- Structured data: `app/lib/structured-data.ts` (all JSON-LD generators)
- Sitemap route: `app/routes/sitemap[.]xml.ts`
- Static robots.txt: `public/robots.txt`

## Tour IDs for Image Testing

- `umrah-package-2025` — Should show Kaaba/Makkah
- `hajj-package-2025` — Should show Kaaba/pilgrimage
- `baghdad-city-package` — Should show Iraqi mosque/landmarks
- `malaysia-tour` — Should show Petronas Towers
- `singapore-city-escape` — Should show Singapore skyline

## Blog Article IDs

- `how-to-prepare-for-umrah-2025`
- `top-5-things-to-do-in-dubai`
- `flights-from-usa-to-pakistan`
- `paris-on-a-budget`

## Admin Login Testing

1. Navigate to `/admin`
2. Enter password and click Login
3. Verify dashboard loads with tabs: Leads, Blog Manager, Media Library, Categories, SEO & Tracking
4. Check `localStorage.getItem('adminToken')` in console — should be a 64-char hex SHA-256 hash, NOT the raw password

To test via curl:
```bash
curl -s -X POST http://localhost:5173/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"<your-password>"}'
```

## Rate Limiting Testing

Rate limits are in-memory and reset on server restart.

- Login: 5 requests per 60 seconds per IP
- Inquiry: 10 requests per 60 seconds per IP  
- Newsletter: 5 requests per 60 seconds per IP

Test with rapid curl requests:
```bash
for i in $(seq 1 6); do
  echo "Attempt $i: $(curl -s -o /dev/null -w '%{http_code}' -X POST http://localhost:5173/api/admin/login -H 'Content-Type: application/json' -d '{"password":"wrong"}')"
done
```

Expect 401 for allowed requests and 429 when rate limited.

**Note**: The IP for local curl requests resolves to `unknown` (no x-forwarded-for header), so all curl requests share the same rate limit bucket. Browser requests also use `unknown` IP locally.

## Data Model

- **Tours**: Static fixtures in `app/data/tours.ts` (10 tours hardcoded)
- **Blogs**: Static fixtures in `app/data/blog.ts` + dynamic DB blogs
- **Leads/Media/Categories/Settings**: SQLite database (`data.db`)
- **Auth**: Centralized in `app/lib/auth.server.ts`

## Deployment Notes

- Vercel preview deployments might have deployment protection (returns 401). If this happens, test against the local dev server instead — the code is identical.
- Build command: `npm run build`
- TypeScript check: `npx tsc --noEmit`

## Common Issues

- If login fails with correct password, check that `.env` values are properly quoted and the dev server was restarted after changes
- Images are in `/public/assets/images/extracted/` — verify file integrity if images look wrong
- The `data.db` file is committed to git; if testing leads/blogs, the DB may have test data from previous sessions
- Sitemap route requires DB initialization (`initDb()`) — if sitemap fails, check that the DB can be read

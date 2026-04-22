# Travel Wings USA

**A modern, lead-generation travel platform** built with React Router v7 (SSR), TypeScript, CSS Modules, and SQLite.

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Then edit .env and fill in your values

# 3. Start the dev server
npm run dev
```

App runs at **http://localhost:5173**

---

## Hosting & Deployment

### IMPORTANT — Framework Mode (NOT plain Vite)

This project uses **React Router v7 in Framework Mode** with SSR enabled.
It is NOT a plain Vite SPA. Follow the platform-specific instructions below carefully.

---

### Vercel (Recommended)

#### Step 1 — Import from GitHub
Go to https://vercel.com/new and import your `travel-wings-usa` repository.

#### Step 2 — Override Build and Output Settings

On the configuration screen, click **Change** next to *Build and output settings* and enter:

| Setting            | Value                        |
|--------------------|------------------------------|
| Framework Preset   | `Other` (NOT Vite)           |
| Build Command      | `npm run build`              |
| Output Directory   | `build/client`               |
| Install Command    | `npm install`                |
| Node Version       | `22.x`                       |

> The screenshot shows "Default for Vite" — you MUST change this to the values above, otherwise the deployment will fail for SSR routes.

#### Step 3 — Add Environment Variables

Vercel dashboard > Settings > Environment Variables:

| Variable           | Description                          | Required |
|--------------------|--------------------------------------|----------|
| `ADMIN_PASSWORD`   | Password to access `/admin`          | Yes      |
| `RESEND_API_KEY`   | Resend.com API key for email alerts  | Optional |
| `RESEND_TO_EMAIL`  | Email to receive lead notifications  | Optional |

#### Step 4 — Deploy

Click **Deploy**. Vercel will build and serve the SSR app via Node.js.

---

### Netlify (Alternative)

#### Build Settings

| Setting            | Value           |
|--------------------|-----------------|
| Base directory     | `/`             |
| Build command      | `npm run build` |
| Publish directory  | `build/client`  |

#### Add `netlify.toml` at project root

```toml
[build]
  command = "npm run build"
  publish = "build/client"

[build.environment]
  NODE_VERSION = "22"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

> Note: Full SSR on Netlify requires additional adapter setup. For a static SPA export, set `ssr: false` in `react-router.config.ts`.

#### Environment Variables

Netlify dashboard > Site settings > Environment variables — same variables as Vercel above.

---

### Self-Hosted / VPS (Node.js)

```bash
# 1. Build the project
npm run build

# 2. Start the production server
npm start
# Runs: react-router-serve ./build/server/index.js

# 3. (Optional) Use PM2 for process management
npm install -g pm2
pm2 start "npm start" --name travel-wings-usa
pm2 save
pm2 startup
```

Set environment variables via your `.env` file or system environment.

---

## Project Structure

```
app/
  blocks/              # Page section components (feature-first)
    __global/          # Nav, footer, floating WhatsApp button
    home/              # Home page sections
    destinations/      # Destinations page sections
    tour-details/      # Tour detail page sections
    blog/              # Blog listing sections
    blog-article/      # Blog article sections
    about-us/          # About page sections
    contact-us/        # Contact page sections
    admin-dashboard/   # Admin panel sections
  components/          # Shared reusable UI components
  data/                # Fixture/mock data (tours, blog posts)
  hooks/               # Custom React hooks
  lib/                 # Server-side utilities (SQLite db)
  routes/              # React Router v7 route modules
  styles/              # Global CSS, theme variables, reset
```

---

## Pages & Routes

| Route           | Page            | Description                                          |
|-----------------|-----------------|------------------------------------------------------|
| `/`             | Home            | Hero slider, search, destinations, tours, testimonials |
| `/destinations` | Destinations    | Filterable and searchable tour grid                  |
| `/tour/:id`     | Tour Detail     | Gallery, itinerary, quote form, related tours        |
| `/blog`         | Blog            | Article grid + newsletter signup                     |
| `/blog/:id`     | Blog Article    | Full article + sidebar with related packages         |
| `/about`        | About Us        | Story, team, mission & values                        |
| `/contact`      | Contact         | Contact form, map, contact details                   |
| `/admin`        | Admin Dashboard | Password-protected leads manager                     |

### API Endpoints

| Method          | Route              | Description                             |
|-----------------|--------------------|-----------------------------------------|
| POST            | `/api/inquiry`     | Save lead to DB + send email alert      |
| POST            | `/api/newsletter`  | Subscribe email to newsletter list      |
| GET             | `/api/leads`       | List all leads (admin auth required)    |
| GET/PATCH/DELETE| `/api/leads/:id`   | Lead detail operations (admin auth)     |
| POST            | `/api/admin/login` | Admin login, returns session token      |

---

## Admin Panel

- URL: `/admin`
- Password: Set via `ADMIN_PASSWORD` environment variable
- Default (dev only): `TravelWings2025!`
- Session token is stored in localStorage
- Features: lead list, search & filter, status updates, lead detail modal

---

## Tech Stack

| Layer           | Technology                              |
|-----------------|-----------------------------------------|
| Framework       | React Router v7 (SSR framework mode)   |
| Language        | TypeScript                              |
| Styling         | CSS Modules + CSS custom properties     |
| UI Components   | Radix UI + Lucide React icons           |
| Forms           | React Hook Form                         |
| Slider/Carousel | Swiper.js                               |
| Database        | SQLite via better-sqlite3               |
| Email           | Resend API                              |
| Runtime         | Node.js 22+                             |
| Build Tool      | Vite + @react-router/dev                |

---

## Environment Variables Reference

Create a `.env` file in the project root (or use `.env.example` as a template):

```env
# Required
ADMIN_PASSWORD=YourSecurePasswordHere

# Optional — Email notifications via Resend (https://resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_TO_EMAIL=info@travelwingsusa.com
```

---

## NPM Scripts

| Script      | Command                | Description                          |
|-------------|------------------------|--------------------------------------|
| Dev server  | `npm run dev`          | Start development server with HMR    |
| Build       | `npm run build`        | Production build                     |
| Start       | `npm start`            | Serve production build               |
| Type check  | `npm run typecheck`    | TypeScript + route type generation   |

---

## Brand & Contact Info

- Phone: +1 (410) 298-4500
- WhatsApp: +1 (410) 298-4500
- Email: info@travelwingsusa.com
- Address: 3201 Eastern Ave, Baltimore, MD 21224

---

Built with Dazl — https://dazl.dev

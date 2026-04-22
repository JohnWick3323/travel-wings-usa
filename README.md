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

## ⚠️ Important — This App Requires SSR (Server-Side Rendering)

This project uses **React Router v7 in Framework Mode** with `ssr: true`. It is **NOT** a static SPA — it runs a Node.js server. Choose a platform that supports Node.js execution.

---

## Deployment Platforms

---

## 1. Hostinger (Node.js Web Apps) ✅ Recommended for this project

Hostinger supports Node.js apps on **Business** and **Cloud** hosting plans via hPanel → Websites → Add Website → **Node.js Apps**.

> **Plan requirement:** Business Web Hosting, Cloud Startup, Cloud Professional, or higher.

### Step 1 — Push Code to GitHub

Make sure your repository is pushed to GitHub (any branch, e.g. `main`).

### Step 2 — Open hPanel and Add Website

1. Log in to [hPanel](https://hpanel.hostinger.com)
2. Go to **Websites** → **Add Website**
3. Choose **Node.js Apps**
4. Select **Import Git Repository**
5. Authorize Hostinger to access your GitHub account
6. Select your repository and branch (`main`)

### Step 3 — Configure Build Settings

Hostinger will try to auto-detect your framework. Since React Router v7 is not in their preset list, it will be assigned **"Other"** type. Configure the fields manually:

| Field             | Value                   |
|-------------------|-------------------------|
| Framework         | `Other` (auto-assigned) |
| Build Command     | `npm run build`         |
| Output Directory  | `build/client`          |
| Entry File        | `build/server/index.js` |
| Node.js Version   | `22.x`                  |

> **What is "Entry File"?**  
> This is the file Hostinger uses to start your Node.js server after the build. Our `package.json` has `"start": "react-router-serve ./build/server/index.js"` — the entry file points to that same compiled server bundle.

> **No separate "Start Command" field?**  
> That's expected for "Other" framework type on Hostinger. Hostinger reads the `start` script from your `package.json` automatically. Our `npm start` is already correctly set.

> **Where are build files stored on the server?**  
> Hostinger places SSR app files at `/home/{username}/domains/{domain}/nodejs` (outside `public_html`). An `.htaccess` file is auto-created in `public_html` to route all traffic to the Node.js process.

### Step 4 — Add Environment Variables

In hPanel → your app → **Environment Variables**, add:

| Variable           | Value                          | Required |
|--------------------|--------------------------------|----------|
| `NODE_ENV`         | `production`                   | ✅ Yes   |
| `ADMIN_PASSWORD`   | Your secure admin password     | ✅ Yes   |
| `RESEND_API_KEY`   | Resend.com API key             | Optional |
| `RESEND_TO_EMAIL`  | Email to receive notifications | Optional |

### Step 5 — Deploy

Click **Deploy**. Hostinger will:
1. Pull code from GitHub
2. Run `npm install` (installs all deps — build tools are in `dependencies` so they are included)
3. Run `npm run build` (builds client + server bundles)
4. Start the server via `npm start` → `react-router-serve ./build/server/index.js`

### Step 6 — Connect Your Custom Domain

1. hPanel → **Domains** → point your domain to the Node.js app
2. Enable **SSL/TLS** (free Let's Encrypt, available in hPanel)

### Step 7 — Auto-Deploy on Push

Enable the **Auto-deploy** toggle in your app settings. Every push to `main` triggers a rebuild and redeploy automatically.

### Troubleshooting — Hostinger

| Symptom | Fix |
|---|---|
| `react-router: command not found` | Already fixed — `@react-router/dev` and `vite` are in `dependencies`, not `devDependencies` |
| 403 error after redeployment | Redeploy once more — Hostinger will regenerate the `.htaccess` routing file |
| App shows blank page | Check that `NODE_ENV=production` is set (lowercase) in Environment Variables |
| Build fails | Check deployment log in hPanel → your app → **Deployments** |

---

## 2. Vercel ✅ Easy, Free Tier Available

Vercel has native support for React Router v7 via the official `@vercel/react-router` adapter.

### Step 1 — Install the Vercel Adapter

```bash
npm install @vercel/react-router
```

### Step 2 — Update `react-router.config.ts`

```ts
import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  presets: [vercelPreset()],
} satisfies Config;
```

### Step 3 — Deploy to Vercel

**Option A — Via Vercel CLI:**
```bash
npx vercel
```

**Option B — Via GitHub Integration:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects React Router v7 — no manual build settings needed
4. Click **Deploy**

### Step 4 — Add Environment Variables

Vercel Dashboard → your project → **Settings** → **Environment Variables**:

| Variable           | Description                          | Required |
|--------------------|--------------------------------------|----------|
| `ADMIN_PASSWORD`   | Password to access `/admin`          | ✅ Yes   |
| `RESEND_API_KEY`   | Resend.com API key for email alerts  | Optional |
| `RESEND_TO_EMAIL`  | Email to receive lead notifications  | Optional |

> `NODE_ENV=production` is set automatically by Vercel — no need to add it manually.

### Step 5 — Redeploy

After adding env vars, trigger a redeploy from the Vercel dashboard.

---

## 3. Netlify ✅ Alternative

Netlify supports React Router v7 SSR via the official Netlify adapter (`@netlify/vite-plugin-react-router`). The old `[[redirects]]` + `status = 200` trick only works for SPAs — do NOT use that approach here.

### Step 1 — Install the Netlify Adapter

```bash
npm install @netlify/vite-plugin-react-router
```

### Step 2 — Update `vite.config.ts`

```ts
import { reactRouter } from '@react-router/dev/vite';
import netlify from '@netlify/vite-plugin-react-router';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [reactRouter(), netlify(), tsconfigPaths()],
});
```

### Step 3 — Add `netlify.toml` at Project Root

```toml
[build]
  command = "npm run build"
  publish = "build/client"

[build.environment]
  NODE_VERSION = "22"
```

### Step 4 — Deploy

**Option A — Via Netlify CLI:**
```bash
npm install -g netlify-cli
netlify init
netlify deploy --build
```

**Option B — Via GitHub Integration:**  
Connect your GitHub repo at [app.netlify.com](https://app.netlify.com/start) and set build command to `npm run build`, publish dir to `build/client`.

### Step 5 — Add Environment Variables

Netlify Dashboard → your site → **Site configuration** → **Environment variables**:

| Variable           | Required |
|--------------------|----------|
| `ADMIN_PASSWORD`   | ✅ Yes   |
| `RESEND_API_KEY`   | Optional |
| `RESEND_TO_EMAIL`  | Optional |

---

## 4. Self-Hosted VPS / Linux Server

```bash
# 1. Clone repo on your server
git clone https://github.com/your-username/travel-wings-usa.git
cd travel-wings-usa

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env
nano .env  # fill in ADMIN_PASSWORD, RESEND_API_KEY, RESEND_TO_EMAIL

# 4. Build the project
npm run build

# 5. Start the production server
npm start
# Runs: react-router-serve ./build/server/index.js
# Default port: 3000
```

### Use PM2 for Process Management (Recommended)

```bash
npm install -g pm2
pm2 start "npm start" --name travel-wings-usa
pm2 save
pm2 startup
```

### Optional: Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable SSL with: `sudo certbot --nginx -d yourdomain.com`

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

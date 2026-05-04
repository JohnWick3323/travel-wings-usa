import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "react-router";

import type { Route } from "./+types/root";
import { ErrorBoundary as ErrorBoundaryRoot } from "~/components/error-boundary/error-boundary";
import { getSiteSettings, initDb } from "~/lib/db.server";
import { sanitizeTrackingId } from "~/lib/sanitize";
import { organizationSchema, websiteSchema } from "~/lib/structured-data";

import "./styles/reset.css";
import "./styles/global.css";
import "./styles/theme.css";
import favicon from "/favicon.svg";

import styles from "./root.module.css";

import { TopInfoBar } from "./blocks/__global/top-info-bar";
import { MainNavigationBar } from "./blocks/__global/main-navigation-bar";
import { FloatingWhatsAppButton } from "./blocks/__global/floating-whats-app-button";
import { FooterMainContent } from "./blocks/__global/footer-main-content";
import { FooterBottomBar } from "./blocks/__global/footer-bottom-bar";

export const links: Route.LinksFunction = () => [
  {
    rel: "icon",
    href: favicon,
    type: "image/svg+xml",
  },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap",
  },
];

export async function loader() {
  console.log('Root loader executing...');
  await initDb();
  const settings = await getSiteSettings();
  return {
    gtmId: settings.gtm_id || '',
    ga4Id: settings.ga4_id || '',
    customHeadCode: settings.custom_head_code || '',
    customBodyCode: settings.custom_body_code || '',
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  let loaderData: { gtmId: string; ga4Id: string; customHeadCode: string; customBodyCode: string } | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    loaderData = useLoaderData<typeof loader>();
  } catch {
    loaderData = null;
  }

  const gtmId = sanitizeTrackingId(loaderData?.gtmId || '');
  const ga4Id = sanitizeTrackingId(loaderData?.ga4Id || '');
  // Custom head/body code is admin-only (behind checkAuth) — not user-generated content.
  // Sanitizing would break intended script/pixel injection (Facebook Pixel, Hotjar, etc.)
  const customHeadCode = loaderData?.customHeadCode || '';
  const customBodyCode = loaderData?.customBodyCode || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />

        {/* Google Tag Manager */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}

        {/* Google Analytics 4 (direct — only if no GTM) */}
        {ga4Id && !gtmId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga4Id}');`,
              }}
            />
          </>
        )}

        {/* JSON-LD Structured Data — Organization + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />

        {/* Custom head code */}
        {customHeadCode && (
          <div dangerouslySetInnerHTML={{ __html: customHeadCode }} />
        )}
      </head>
      <body>
        {/* GTM noscript fallback */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* Custom body code */}
        {customBodyCode && (
          <div dangerouslySetInnerHTML={{ __html: customBodyCode }} />
        )}

        <header className={styles.siteHeader}>
          <TopInfoBar />
          <MainNavigationBar />
        </header>
        <FloatingWhatsAppButton />
        {children}
        <footer>
          <FooterMainContent />
          <FooterBottomBar />
        </footer>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export const ErrorBoundary = ErrorBoundaryRoot;

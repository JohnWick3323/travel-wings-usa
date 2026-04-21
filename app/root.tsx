import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import colorSchemeApi from "@dazl/color-scheme/client?url";
import { ErrorBoundary as ErrorBoundaryRoot } from "~/components/error-boundary/error-boundary";

import "./styles/reset.css";
import "./styles/global.css";
import "./styles/theme.css";
import { useColorScheme } from "@dazl/color-scheme/react";
import favicon from "/favicon.svg";

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
  /* Placeholder for Google Fonts link */
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { rootCssClass, resolvedScheme } = useColorScheme();
  return (
    <html lang="en" suppressHydrationWarning className={rootCssClass} style={{ colorScheme: resolvedScheme }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <script src={colorSchemeApi} data-light-class="light-theme" data-dark-class="dark-theme"></script>
        <Links />
      </head>
      <body>
        {children}
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

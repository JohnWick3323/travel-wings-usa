import { createRequestHandler } from "react-router";
import { createServer } from "node:http";
import { createReadableStreamFromReadable } from "@react-router/node";
import { statSync, createReadStream, existsSync } from "node:fs";
import { extname, resolve, normalize } from "node:path";
import * as build from "./build/server/index.js";

const requestHandler = createRequestHandler(build);
const port = process.env.PORT || 3000;
const CLIENT_BUILD_DIR = resolve(process.cwd(), "build", "client");
const PUBLIC_DIR = resolve(process.cwd(), "public");

// MIME types for static files
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "font/otf",
  ".wasm": "application/wasm",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".map": "application/json",
};

/** Safely resolve a URL pathname to a file path within a root directory.
 *  Returns null if the resolved path escapes the root (path traversal). */
function safePath(root, pathname) {
  const resolved = resolve(root, normalize(pathname).replace(/^\/+/, ""));
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(url.pathname);
    const ext = extname(pathname).toLowerCase();

    // 1. Try serving static file from build/client
    const clientPath = safePath(CLIENT_BUILD_DIR, pathname);
    if (clientPath && existsSync(clientPath) && statSync(clientPath).isFile()) {
      const contentType = mimeTypes[ext] || "application/octet-stream";
      const isHashed = /\.[a-zA-Z0-9_-]{8,}\.\w+$/.test(pathname);
      const cacheHeader = isHashed
        ? "public, max-age=31536000, immutable"
        : "public, max-age=3600";
      res.writeHead(200, { "Content-Type": contentType, "Cache-Control": cacheHeader });
      createReadStream(clientPath).pipe(res);
      return;
    }

    // 2. Try serving from public/ directory (robots.txt, favicon, etc.)
    const publicPath = safePath(PUBLIC_DIR, pathname);
    if (publicPath && existsSync(publicPath) && statSync(publicPath).isFile()) {
      const contentType = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType, "Cache-Control": "public, max-age=3600" });
      createReadStream(publicPath).pipe(res);
      return;
    }

    // 3. If the request is for /assets/ (build output) but file wasn't found,
    //    return 404 directly — these are stale cached requests after a redeploy
    if (pathname.startsWith("/assets/")) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }

    // 4. Let React Router handle all other requests (pages, API routes)
    const controller = new AbortController();
    res.on("close", () => controller.abort());

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          for (const v of value) headers.append(key, v);
        } else {
          headers.set(key, value);
        }
      }
    }

    const request = new Request(url, {
      method: req.method,
      headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? createReadableStreamFromReadable(req) : null,
      signal: controller.signal,
      duplex: "half",
    });

    const response = await requestHandler(request);

    res.statusCode = response.status;
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (error) {
    if (error?.code === "ERR_STREAM_PREMATURE_CLOSE" || error?.code === "ABORT_ERR") {
      return;
    }
    console.error("Server Error:", error.message || error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }
});

server.listen(port, () => {
  console.log(`React Router App is running on port ${port}`);
});

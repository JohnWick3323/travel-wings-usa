import { createRequestHandler } from "react-router";
import { createServer } from "node:http";
import { createReadableStreamFromReadable } from "@react-router/node";
import { statSync, createReadStream, existsSync } from "node:fs";
import { join, extname } from "node:path";
import * as build from "./build/server/index.js";

const requestHandler = createRequestHandler(build);
const port = process.env.PORT || 3000;
const CLIENT_BUILD_DIR = join(process.cwd(), "build", "client");

// MIME types for static files
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".woff": "application/font-woff",
  ".ttf": "application/font-ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "application/font-otf",
  ".wasm": "application/wasm",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    // 1. Check if the request is for a static file in build/client
    const filePath = join(CLIENT_BUILD_DIR, url.pathname);
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = String(extname(filePath)).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000, immutable" });
      createReadStream(filePath).pipe(res);
      return;
    }

    // 2. If not a static file, let React Router handle it
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
    console.error("Critical Server Error:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

server.listen(port, () => {
  console.log(`React Router App is running on port ${port}`);
});

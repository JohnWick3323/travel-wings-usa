import { createRequestHandler } from "@react-router/node";
import { createServer } from "node:http";
import { createReadableStreamFromReadable } from "@react-router/node";
import * as build from "./build/server/index.js";

const requestHandler = createRequestHandler(build);

const port = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  try {
    // Convert Node request to Web Request
    const url = new URL(req.url, `http://${req.headers.host}`);
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

    // Send Web Response back to Node res
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

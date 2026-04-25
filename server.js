import { createRequestHandler } from "@react-router/node";
import { serverLauncher } from "@react-router/serve";
import * as build from "./build/server/index.js";

const port = process.env.PORT || 3000;

console.log(`Starting server on port ${port}...`);

// Simple wrapper to ensure logs and port are handled correctly
try {
  serverLauncher({
    build,
    port: Number(port),
    getLoadContext: (req, res) => ({}),
  });
  console.log("Server successfully launched!");
} catch (error) {
  console.error("Failed to launch server:", error);
  process.exit(1);
}

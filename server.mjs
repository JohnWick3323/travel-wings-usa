import { createRequestHandler } from "@react-router/node";
import { createServer } from "node:http";
import * as build from "./build/server/index.js";

const requestHandler = createRequestHandler(build);

const port = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  try {
    // Handle the request using React Router's handler
    const response = await requestHandler(req);
    
    // Copy headers from the Web Response to the Node Response
    res.statusCode = response.status;
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }
    
    // Send the body
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
    console.error("Request error:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

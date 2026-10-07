import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const filePath = path.join(__dirname, pathname);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (!error) {
      const ext = path.extname(filePath);

      res.writeHead(200, {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
      });

      res.end(data);
      return;
    }

    // React Router fallback
    fs.readFile(path.join(__dirname, "index.html"), (fallbackError, fallbackData) => {
      if (fallbackError) {
        res.writeHead(500);
        res.end("Internal Server Error");
        return;
      }

      res.writeHead(200, {
        "Content-Type": "text/html",
      });

      res.end(fallbackData);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
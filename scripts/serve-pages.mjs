import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const outputDirectory = join(process.cwd(), "out");
const basePath = (process.env.PAGES_BASE_PATH || "/DashboardWeb").replace(/\/$/, "");
const port = Number(process.env.PORT || 4173);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

if (!existsSync(join(outputDirectory, "index.html"))) {
  throw new Error("Không tìm thấy out/index.html. Hãy chạy npm run build trước.");
}

createServer((request, response) => {
  const requestUrl = new URL(request.url || "/", "http://localhost");
  if (requestUrl.pathname === "/") {
    response.writeHead(302, { location: `${basePath}/` });
    response.end();
    return;
  }
  if (!requestUrl.pathname.startsWith(`${basePath}/`)) {
    response.writeHead(404).end("Not found");
    return;
  }

  const relativePath = decodeURIComponent(requestUrl.pathname.slice(basePath.length)).replace(/^\/+/, "");
  let filePath = normalize(join(outputDirectory, relativePath));
  if (!filePath.startsWith(outputDirectory)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, "index.html");
  if (!existsSync(filePath) && !extname(filePath)) filePath = join(filePath, "index.html");
  if (!existsSync(filePath)) filePath = join(outputDirectory, "404.html");

  response.writeHead(filePath.endsWith("404.html") ? 404 : 200, {
    "content-type": contentTypes[extname(filePath)] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Static preview: http://127.0.0.1:${port}${basePath}/`);
});

// Local-only server (NOT used on Vercel). It runs the same handlers that Vercel
// runs from /api, and can also serve the built app from /dist for a quick check:
//   bun run build && bun run start
import { join, normalize, sep } from "node:path";
import * as twin from "../api/twin.js";
import * as contact from "../api/contact.js";

const DIST_DIR = join(import.meta.dir, "..", "dist");
const PORT = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);

const routes = { "/api/twin": twin, "/api/contact": contact };

async function serveStatic(pathname) {
  let rel;
  try {
    rel = decodeURIComponent(pathname);
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  const filePath = normalize(join(DIST_DIR, rel));
  if (filePath !== DIST_DIR && !filePath.startsWith(DIST_DIR + sep)) {
    return new Response("Forbidden", { status: 403 });
  }
  const file = Bun.file(filePath);
  if (rel !== "/" && (await file.exists())) return new Response(file);
  const index = Bun.file(join(DIST_DIR, "index.html"));
  if (await index.exists()) return new Response(index);
  return new Response("Frontend not built. Run `bun run build`, or use `bun run dev`.", { status: 404 });
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (pathname.startsWith("/api/")) {
      const handler = routes[pathname]?.[req.method];
      if (handler) return handler(req);
      return Response.json({ error: routes[pathname] ? "Method not allowed" : "Not found" }, { status: routes[pathname] ? 405 : 404 });
    }
    return serveStatic(pathname);
  },
});

console.log(`Local API server listening on http://localhost:${PORT}`);

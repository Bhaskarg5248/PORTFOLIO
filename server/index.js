// Bun API server: serves the JSON data, accepts contact messages, and (after
// `bun run build`) serves the built Vite app from /dist.
import { join, normalize, sep } from "node:path";

const ROOT = join(import.meta.dir, "..");
const DATA_DIR = join(ROOT, "data");
const DIST_DIR = join(ROOT, "dist");
const PORT = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PORTFOLIO_FILES = ["profile", "skills", "experience", "projects", "education"];

const json = (body, status = 200) => Response.json(body, { status });

const readJson = (name) => Bun.file(join(DATA_DIR, `${name}.json`)).json();
const writeJson = (name, value) =>
  Bun.write(join(DATA_DIR, `${name}.json`), JSON.stringify(value, null, 2) + "\n");

// Serialise writes so two simultaneous messages can't overwrite each other.
let writeQueue = Promise.resolve();
function appendMessage(message) {
  const task = writeQueue.then(async () => {
    const messages = await readJson("messages");
    messages.push(message);
    await writeJson("messages", messages);
  });
  writeQueue = task.catch(() => {});
  return task;
}

async function getPortfolio(req) {
  try {
    const values = await Promise.all(PORTFOLIO_FILES.map(readJson));
    return json(Object.fromEntries(PORTFOLIO_FILES.map((k, i) => [k, values[i]])));
  } catch (err) {
    console.error("portfolio load failed:", err);
    return json({ error: "Failed to load portfolio data" }, 500);
  }
}

async function postContact(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!name || !email || !message) {
    return json({ error: "Name, email and message are required" }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ error: "Please enter a valid email address" }, 400);
  }
  if (name.length > 100 || email.length > 200 || message.length > 3000) {
    return json({ error: "Input is too long" }, 400);
  }

  try {
    await appendMessage({
      id: Date.now().toString(36),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    });
    return json({ ok: true }, 201);
  } catch (err) {
    console.error("saving message failed:", err);
    return json({ error: "Could not save your message" }, 500);
  }
}

// Serve the built frontend, falling back to index.html for unknown paths.
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

    if (pathname === "/api/portfolio") {
      return req.method === "GET" ? getPortfolio(req) : json({ error: "Method not allowed" }, 405);
    }
    if (pathname === "/api/contact") {
      return req.method === "POST" ? postContact(req) : json({ error: "Method not allowed" }, 405);
    }
    if (pathname.startsWith("/api/")) return json({ error: "Not found" }, 404);

    return serveStatic(pathname);
  },
});

console.log(`API server listening on http://localhost:${PORT}`);

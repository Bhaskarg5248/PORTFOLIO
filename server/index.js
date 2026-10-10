// Bun API server: serves the JSON data, accepts contact messages, and (after
// `bun run build`) serves the built Vite app from /dist.
import { join, normalize, sep } from "node:path";
import { answerTwin } from "./twin.js";

const ROOT = join(import.meta.dir, "..");
const DATA_DIR = join(ROOT, "data");
const DIST_DIR = join(ROOT, "dist");
const PORT = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PORTFOLIO_FILES = ["profile", "skills", "experience", "projects", "education", "twin"];
const RESUME_FILES = ["profile", "skills", "experience", "projects", "education"];

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

// Simple in-memory rate limit for the twin (it can trigger paid API calls).
const TWIN_LIMIT = 15; // requests
const TWIN_WINDOW_MS = 60_000;
const twinHits = new Map();
function twinRateLimited(ip) {
  const now = Date.now();
  const recent = (twinHits.get(ip) ?? []).filter((t) => now - t < TWIN_WINDOW_MS);
  if (recent.length >= TWIN_LIMIT) {
    twinHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  twinHits.set(ip, recent);
  if (twinHits.size > 5000) {
    for (const [k, v] of twinHits) if (!v.some((t) => now - t < TWIN_WINDOW_MS)) twinHits.delete(k);
  }
  return false;
}

async function postTwin(req, ip) {
  if (twinRateLimited(ip)) {
    return json({ error: "Too many questions, please wait a minute and try again" }, 429);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const message = String(body?.message ?? "").trim();
  if (!message) return json({ error: "Please type a question" }, 400);
  if (message.length > 500) return json({ error: "Question is too long (500 characters max)" }, 400);

  try {
    const values = await Promise.all(RESUME_FILES.map(readJson));
    const portfolio = Object.fromEntries(RESUME_FILES.map((k, i) => [k, values[i]]));
    const { reply, source } = await answerTwin({ message, history: body?.history, portfolio });
    return json({ reply, source });
  } catch (err) {
    console.error("twin failed:", err);
    return json({ error: "The digital twin is unavailable right now" }, 500);
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
  async fetch(req, server) {
    const { pathname } = new URL(req.url);

    if (pathname === "/api/portfolio") {
      return req.method === "GET" ? getPortfolio(req) : json({ error: "Method not allowed" }, 405);
    }
    if (pathname === "/api/twin") {
      const ip = server.requestIP(req)?.address ?? "unknown";
      return req.method === "POST" ? postTwin(req, ip) : json({ error: "Method not allowed" }, 405);
    }
    if (pathname === "/api/contact") {
      return req.method === "POST" ? postContact(req) : json({ error: "Method not allowed" }, 405);
    }
    if (pathname.startsWith("/api/")) return json({ error: "Not found" }, 404);

    return serveStatic(pathname);
  },
});

console.log(`API server listening on http://localhost:${PORT}`);

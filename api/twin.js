// POST /api/twin  (Vercel function; also used by the local dev server)
import { answerTwin } from "../server/twin.js";
import { portfolio } from "../server/resume.js";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = String(body?.message ?? "").trim();
  if (!message) return Response.json({ error: "Please type a question" }, { status: 400 });
  if (message.length > 500) {
    return Response.json({ error: "Question is too long (500 characters max)" }, { status: 400 });
  }

  try {
    const { reply, source } = await answerTwin({ message, history: body?.history, portfolio });
    return Response.json({ reply, source });
  } catch (err) {
    console.error("twin failed:", err);
    return Response.json({ error: "The digital twin is unavailable right now" }, { status: 500 });
  }
}

export function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
}

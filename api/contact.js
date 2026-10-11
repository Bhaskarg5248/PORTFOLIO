// POST /api/contact  (Vercel function; also used by the local dev server)
// Sends the message to your inbox through Resend (https://resend.com).
//
// Environment variables:
//   RESEND_API_KEY  required in production
//   CONTACT_TO      where messages go (defaults to the email in data/profile.json)
//   CONTACT_FROM    sender address (defaults to Resend's test sender)
import { portfolio } from "../server/resume.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const err = (error, status) => Response.json({ error }, { status });

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return err("Invalid JSON body", 400);
  }

  // Honeypot: real visitors never fill this hidden field, bots usually do.
  if (body?.website) return Response.json({ ok: true }, { status: 201 });

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!name || !email || !message) return err("Name, email and message are required", 400);
  if (!EMAIL_RE.test(email)) return err("Please enter a valid email address", 400);
  if (name.length > 100 || email.length > 200 || message.length > 3000) return err("Input is too long", 400);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.VERCEL) {
      console.error("RESEND_API_KEY is not set");
      return err("Contact form is not configured yet", 503);
    }
    // Local development: just print the message.
    console.log("[contact:dev]", { name, email, message });
    return Response.json({ ok: true }, { status: 201 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO ?? portfolio.profile.email],
        reply_to: email,
        subject: `Portfolio message from ${name.slice(0, 80)}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("Resend error", res.status, await res.text());
      return err("Could not send your message", 502);
    }
    return Response.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("contact failed:", e);
    return err("Could not send your message", 500);
  }
}

export function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
}

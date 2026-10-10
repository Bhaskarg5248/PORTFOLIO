import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/data";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }
  if (name.length > 100 || email.length > 200 || message.length > 3000) {
    return NextResponse.json({ error: "Input is too long" }, { status: 400 });
  }

  try {
    const messages = await readJson("messages");
    messages.push({
      id: Date.now().toString(36),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    });
    await writeJson("messages", messages);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Could not save your message" }, { status: 500 });
  }
}

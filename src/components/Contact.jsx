import { useState } from "react";
import Section from "./Section";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", error: "" });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: "sending", error: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setForm({ name: "", email: "", message: "" });
      setStatus({ state: "sent", error: "" });
    } catch (err) {
      setStatus({ state: "error", error: err.message });
    }
  }

  return (
    <Section id="contact" title="Contact">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4 text-slate-600 dark:text-slate-400">
          <p>
            Open to new opportunities and interesting .NET projects. Send a message or reach out directly.
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">Email: </span>
              <a className="text-brand-600 hover:underline dark:text-brand-400" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">Phone: </span>
              <a className="text-brand-600 hover:underline dark:text-brand-400" href={`tel:${profile.phone.replace(/\s/g, "")}`}>
                {profile.phone}
              </a>
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">LinkedIn: </span>
              <a
                className="text-brand-600 hover:underline dark:text-brand-400"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                View profile
              </a>
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">Location: </span>
              {profile.location}
            </li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">Name</label>
            <input id="name" className={inputClass} value={form.name} onChange={update("name")} required maxLength={100} />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
            <input id="email" type="email" className={inputClass} value={form.email} onChange={update("email")} required maxLength={200} />
          </div>
          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium">Message</label>
            <textarea id="message" rows={5} className={inputClass} value={form.message} onChange={update("message")} required maxLength={3000} />
          </div>

          <button
            type="submit"
            disabled={status.state === "sending"}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {status.state === "sending" ? "Sending…" : "Send message"}
          </button>

          <p role="status" aria-live="polite" className="text-sm">
            {status.state === "sent" && (
              <span className="text-emerald-600 dark:text-emerald-400">Thanks! Your message has been sent.</span>
            )}
            {status.state === "error" && (
              <span className="text-red-600 dark:text-red-400">{status.error}</span>
            )}
          </p>
        </form>
      </div>
    </Section>
  );
}

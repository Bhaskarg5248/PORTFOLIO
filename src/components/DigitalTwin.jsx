import { useEffect, useRef, useState } from "react";
import Section from "./Section.jsx";

function initials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1" aria-label="Digital twin is typing">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

export default function DigitalTwin({ profile, twin }) {
  const greeting = twin.greeting.replace("{name}", profile.name);
  const [messages, setMessages] = useState([{ role: "assistant", content: greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const question = text.trim();
    if (!question || loading) return;

    // Conversation so far, minus the greeting and any error bubbles.
    const history = messages
      .slice(1)
      .filter((m) => !m.error)
      .slice(-8)
      .map(({ role, content }) => ({ role, content }));

    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Sorry, I couldn't answer that: ${err.message}`, error: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    send(input);
  }

  return (
    <Section id="twin" title="Digital twin">
      <div className="grid gap-8 md:grid-cols-5">
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{twin.title}</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Not sure where to start? Chat with an AI version of me. It answers in my voice about my
            experience, skills, projects and education.
          </p>
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
            This is an AI assistant, not a live conversation with me. It only knows what&apos;s in my
            resume, so double-check anything important.
          </p>
        </div>

        <div className="flex h-[32rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:col-span-3">
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {initials(profile.name)}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {profile.name}&apos;s Digital Twin
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Online · AI assistant</p>
            </div>
            <span className="ml-auto rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-600/20 dark:text-brand-100">
              AI
            </span>
          </div>

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Conversation with the digital twin"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-line break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-brand-600 text-white"
                      : m.error
                        ? "rounded-bl-sm bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                        : "rounded-bl-sm bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-2 dark:bg-slate-800">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 px-4 pb-4 pt-3 dark:border-slate-800">
            <div className="mb-3 flex flex-wrap gap-2">
              {twin.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={loading}
                  onClick={() => send(s)}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-400"
                >
                  {s}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="flex gap-2">
              <label htmlFor="twin-input" className="sr-only">
                Ask the digital twin a question
              </label>
              <input
                id="twin-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={twin.placeholder}
                maxLength={500}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
}

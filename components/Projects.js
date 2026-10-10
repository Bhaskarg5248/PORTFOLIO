import Section from "./Section";

export default function Projects({ projects }) {
  return (
    <Section id="projects" title="Projects">
      <div className="space-y-6">
        {projects.map((p) => (
          <article
            key={p.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {p.name} <span className="font-normal text-slate-500 dark:text-slate-400">– {p.subtitle}</span>
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Role: {p.role}</span>
            </header>

            <p className="mt-3 text-slate-600 dark:text-slate-400">{p.description}</p>

            <ul className="mt-4 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {t}
                </li>
              ))}
            </ul>

            <h4 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Key contributions
            </h4>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600 marker:text-brand-500 dark:text-slate-400">
              {p.contributions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}

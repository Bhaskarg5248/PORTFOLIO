import Section from "./Section";

export default function About({ profile }) {
  return (
    <Section id="about" title="About me">
      <div className="grid gap-10 md:grid-cols-3">
        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 md:col-span-2">
          {profile.summary}
        </p>
        <dl className="grid grid-cols-3 gap-4 md:grid-cols-1">
          {profile.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <dt className="text-xs text-slate-500 dark:text-slate-400">{s.label}</dt>
              <dd className="mt-1 text-3xl font-bold text-brand-600 dark:text-brand-400">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

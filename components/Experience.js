import Section from "./Section";

export default function Experience({ experience }) {
  return (
    <Section id="experience" title="Experience">
      <ol className="relative space-y-10 border-l border-slate-200 pl-8 dark:border-slate-800">
        {experience.map((job) => (
          <li key={`${job.company}-${job.period}`} className="relative">
            <span className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full border-2 border-brand-500 bg-slate-50 dark:bg-slate-950" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {job.role}{" "}
                <span className="text-brand-600 dark:text-brand-400">@ {job.company}</span>
              </h3>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{job.period}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{job.location}</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600 marker:text-brand-500 dark:text-slate-400">
              {job.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}

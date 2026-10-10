import Section from "./Section";

export default function Education({ education }) {
  return (
    <Section id="education" title="Education">
      <ul className="space-y-4">
        {education.map((e) => (
          <li
            key={e.degree}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">{e.degree}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{e.institution}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

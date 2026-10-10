export default function Hero({ profile }) {
  return (
    <section id="top" className="mx-auto max-w-5xl px-6 pb-12 pt-20 sm:pt-28">
      <p className="mb-4 font-mono text-sm text-brand-600 dark:text-brand-400">Hello, I&apos;m</p>
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-7xl">
        {profile.name}
      </h1>
      <h2 className="mt-3 text-2xl font-semibold text-slate-500 dark:text-slate-400 sm:text-4xl">
        {profile.title}
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
        {profile.tagline}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#contact"
          className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Get in touch
        </a>
        <a
          href="#projects"
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-400"
        >
          View projects
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-400"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}

export default function Section({ id, title, children }) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-10 flex items-center gap-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        {title}
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </h2>
      {children}
    </section>
  );
}

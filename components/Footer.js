export default function Footer({ name }) {
  return (
    <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      © {new Date().getFullYear()} {name}. Built with Next.js, React and Tailwind CSS.
    </footer>
  );
}

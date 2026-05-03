export function BlogHero() {
  return (
    <section className="relative bg-white dark:bg-zinc-950 pt-16 pb-12 px-6 transition-colors">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-widest uppercase text-sm">Resources & Insights</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mt-4 tracking-tight">
          Mastering the <span className="text-blue-600 dark:text-blue-500">Gig Economy</span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
          The HelpMate blog is your go-to guide for productivity hacks, safety tips, 
          and strategies to boost your earnings.
        </p>
      </div>
    </section>
  );
}
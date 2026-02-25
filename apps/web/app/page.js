export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-24">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Project B</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Next.js app-router scaffold is ready.
        </h1>
        <p className="text-base leading-7 text-slate-300">
          Edit <code className="rounded bg-slate-900 px-1.5 py-0.5">apps/web/app/page.js</code> to start building.
        </p>
      </section>
    </main>
  );
}

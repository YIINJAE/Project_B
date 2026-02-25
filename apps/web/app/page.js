import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-24">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Project B</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Home
        </h1>
        <p className="text-base leading-7 text-slate-300">
          Explore the storefront routes with working app-router links.
        </p>
        <nav className="flex gap-3 pt-2">
          <Link className="rounded bg-cyan-500 px-4 py-2 font-medium text-slate-950" href="/">
            Home
          </Link>
          <Link className="rounded border border-slate-700 px-4 py-2 font-medium text-slate-100" href="/shop">
            Shop
          </Link>
        </nav>
      </section>
    </main>
  );
}

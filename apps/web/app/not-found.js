import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  description: "The requested page does not exist in the current Project B build.",
  alternates: {
    canonical: "/404"
  },
  robots: {
    index: false,
    follow: true
  },
  openGraph: {
    title: "404 | Project B",
    description: "The requested page does not exist in the current Project B build.",
    url: "/404",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "404 | Project B",
    description: "The requested page does not exist in the current Project B build."
  }
};

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
      <section className="w-full max-w-xl rounded border border-slate-800 bg-slate-900/40 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">404</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-3 text-slate-300">
          The route you requested does not exist in this build.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link className="rounded bg-cyan-500 px-4 py-2 font-medium text-slate-950" href="/">
            Go Home
          </Link>
          <Link className="rounded border border-slate-700 px-4 py-2 font-medium text-slate-100" href="/shop">
            Visit Shop
          </Link>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";

const products = [
  { id: "outer-001", name: "Structured Trench", price: "$320" },
  { id: "top-014", name: "Merino Knit Polo", price: "$110" },
  { id: "bottom-203", name: "Wide-Leg Trousers", price: "$150" }
];

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-24">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Project B</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Shop</h1>
          <p className="text-base leading-7 text-slate-300">
            Lightweight catalog placeholder for routing smoke tests.
          </p>
        </header>
        <nav className="flex gap-3">
          <Link className="rounded border border-slate-700 px-4 py-2 font-medium text-slate-100" href="/">
            Home
          </Link>
          <Link className="rounded bg-cyan-500 px-4 py-2 font-medium text-slate-950" href="/shop">
            Shop
          </Link>
        </nav>
        <ul className="grid gap-3">
          {products.map((product) => (
            <li className="rounded border border-slate-800 bg-slate-900/40 p-4" key={product.id}>
              <p className="font-medium text-slate-100">{product.name}</p>
              <p className="text-slate-300">{product.price}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

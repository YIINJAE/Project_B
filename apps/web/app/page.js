import Link from "next/link";

const categoryChips = ["All", "Outer", "Top", "Bottom", "Accessories"];

const featuredProducts = [
  {
    name: "Breeze Linen Jacket",
    category: "Outer",
    price: "$128"
  },
  {
    name: "Studio Rib Tee",
    category: "Top",
    price: "$42"
  },
  {
    name: "Harbor Wide Pants",
    category: "Bottom",
    price: "$86"
  },
  {
    name: "Transit Crossbody",
    category: "Accessories",
    price: "$64"
  }
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-block">
        <p className="eyebrow">Project B</p>
        <h1>Dummy Home Page</h1>
        <p>
          A simple storefront starter with category chips and a sample grid. Browse the
          full dummy catalog on the Shop page.
        </p>
        <div className="action-row">
          <Link href="/shop" className="button-link">
            Go to Shop
          </Link>
        </div>
      </section>

      <section className="section-block" aria-labelledby="home-categories-title">
        <h2 id="home-categories-title">Shop by Category</h2>
        <div className="chip-row" role="list" aria-label="Category chips">
          {categoryChips.map((chip) => (
            <span className="category-chip" role="listitem" key={chip}>
              {chip}
            </span>
          ))}
        </div>
      </section>

      <section className="section-block" aria-labelledby="featured-products-title">
        <div className="section-head">
          <h2 id="featured-products-title">Featured Products</h2>
          <Link href="/shop" className="inline-link">
            View all
          </Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <article className="product-card" key={product.name}>
              <div className="product-thumb" aria-hidden="true" />
              <p className="product-category">{product.category}</p>
              <h3>{product.name}</h3>
              <p className="product-price">{product.price}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

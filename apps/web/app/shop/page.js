import Link from "next/link";

const categoryChips = ["All", "Outer", "Top", "Bottom", "Accessories", "Shoes"];

const shopProducts = [
  { name: "Breeze Linen Jacket", category: "Outer", price: "$128" },
  { name: "Summit Utility Coat", category: "Outer", price: "$174" },
  { name: "Studio Rib Tee", category: "Top", price: "$42" },
  { name: "Offset Collar Shirt", category: "Top", price: "$58" },
  { name: "Harbor Wide Pants", category: "Bottom", price: "$86" },
  { name: "Thread Pleated Skirt", category: "Bottom", price: "$72" },
  { name: "Transit Crossbody", category: "Accessories", price: "$64" },
  { name: "Loop Runner", category: "Shoes", price: "$98" }
];

export default function ShopPage() {
  return (
    <main className="page-shell">
      <section className="hero-block">
        <p className="eyebrow">Project B</p>
        <h1>Dummy Shop Page</h1>
        <p>
          Category chips and product cards are static placeholders for now, ready for
          future filtering and data wiring.
        </p>
        <div className="action-row">
          <Link href="/" className="button-link button-link-secondary">
            Back to Home
          </Link>
        </div>
      </section>

      <section className="section-block" aria-labelledby="shop-categories-title">
        <h2 id="shop-categories-title">Categories</h2>
        <div className="chip-row" role="list" aria-label="Shop categories">
          {categoryChips.map((chip) => (
            <span className="category-chip" role="listitem" key={chip}>
              {chip}
            </span>
          ))}
        </div>
      </section>

      <section className="section-block" aria-labelledby="shop-products-title">
        <h2 id="shop-products-title">Sample Product Grid</h2>
        <div className="product-grid">
          {shopProducts.map((product) => (
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

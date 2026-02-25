import Link from "next/link";
import { Badge, Button, Card, Input, Section } from "@/components/ui";
import { categories, filterAndSortProducts, formatPrice, products } from "@/lib/catalog";

export const metadata = {
  title: "Shop",
  description: "Browse the full Project B catalog with category and sorting filters.",
  alternates: {
    canonical: "/shop"
  },
  openGraph: {
    title: "Project B Shop",
    description: "Browse the full Project B catalog with category and sorting filters.",
    url: "/shop",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Project B Shop",
    description: "Browse the full Project B catalog with category and sorting filters."
  }
};

function buildQuery(current, patch) {
  var next = new URLSearchParams(current || "");
  Object.keys(patch).forEach(function (key) {
    var value = patch[key];
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  });
  var query = next.toString();
  return query ? "/shop?" + query : "/shop";
}

function buildDetailLink(slug, current) {
  var next = new URLSearchParams(current || "");
  var query = next.toString();
  return query ? "/shop/" + slug + "?" + query : "/shop/" + slug;
}

export default function ShopPage({ searchParams }) {
  var activeCategory = (searchParams?.category || "all").toLowerCase();
  var filtered = filterAndSortProducts(products, searchParams || {});
  return (
    <main className="page-shell">
      <section className="hero-block">
        <Badge>Project B</Badge>
        <h1>Dummy Shop Page</h1>
        <p>
          Category chips and product cards are static placeholders for now, ready for
          future filtering and data wiring.
        </p>
        <div className="action-row">
          <Button href="/" variant="secondary">Back to Home</Button>
        </div>
      </section>

      <Section title="Categories" id="shop-categories-title">
        <form className="search-row" method="get" action="/shop">
          <Input
            type="text"
            placeholder="Search products"
            aria-label="Search products"
            name="q"
            defaultValue={searchParams?.q || ""}
          />
          <button type="submit" className="c-btn c-btn-secondary">Search</button>
          <select
            className="c-input"
            name="sort"
            defaultValue={(searchParams?.sort || "new").toLowerCase()}
          >
            <option value="new">Newest</option>
            <option value="low">Price Low</option>
            <option value="high">Price High</option>
          </select>
        </form>
        <div className="chip-row" role="list" aria-label="Shop categories">
          {categories.map((chip) => (
            <Link
              className={chip === activeCategory ? "category-chip active" : "category-chip"}
              href={buildQuery(searchParams, { category: chip })}
              key={chip}
            >
              {chip.toUpperCase()}
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Sample Product Grid" id="shop-products-title">
        <div className="product-grid">
          {filtered.map((product) => (
            <Card
              key={product.slug}
              className={product.soldOut ? "product-card is-soldout" : "product-card"}
            >
              <div className="product-thumb" aria-hidden="true" />
              <p className="product-category">{product.category.toUpperCase()}</p>
              <h3>
                <Link href={buildDetailLink(product.slug, searchParams)}>{product.name}</Link>
              </h3>
              <p className="product-price">{formatPrice(product.price)}</p>
              {product.soldOut ? <Badge className="c-badge-soldout">SOLD OUT</Badge> : null}
              <p className={product.soldOut ? "stock-state stock-state-soldout" : "stock-state"}>
                {product.soldOut ? "Currently sold out" : "In stock"}
              </p>
              <div className="action-row">
                {product.soldOut ? (
                  <button type="button" className="c-btn" disabled aria-disabled="true">
                    Add to Cart
                  </button>
                ) : (
                  <Link href="/cart" className="c-btn">Add to Cart</Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}

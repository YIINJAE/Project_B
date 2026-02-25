import Link from "next/link";
import { Badge, Button, Card, Section } from "@/components/ui";

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
        <Badge>Project B</Badge>
        <h1>Dummy Home Page</h1>
        <p>
          A simple storefront starter with category chips and a sample grid. Browse the
          full dummy catalog on the Shop page.
        </p>
        <div className="action-row">
          <Button href="/shop">Go to Shop</Button>
        </div>
      </section>

      <Section title="Shop by Category" id="home-categories-title">
        <div className="chip-row" role="list" aria-label="Category chips">
          {categoryChips.map((chip) => (
            <span className="category-chip" role="listitem" key={chip}>
              {chip}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Featured Products" id="featured-products-title">
        <div className="section-head">
          <Link href="/shop" className="inline-link">
            View all
          </Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <Card key={product.name}>
              <div className="product-thumb" aria-hidden="true" />
              <p className="product-category">{product.category}</p>
              <h3>{product.name}</h3>
              <p className="product-price">{product.price}</p>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}

import { Badge, Button, Card, Input, Section } from "@/components/ui";

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
        <div className="search-row">
          <Input type="text" placeholder="Search products" aria-label="Search products" />
        </div>
        <div className="chip-row" role="list" aria-label="Shop categories">
          {categoryChips.map((chip) => (
            <span className="category-chip" role="listitem" key={chip}>
              {chip}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Sample Product Grid" id="shop-products-title">
        <div className="product-grid">
          {shopProducts.map((product) => (
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

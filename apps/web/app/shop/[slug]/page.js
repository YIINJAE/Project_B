import Link from "next/link";
import { Badge, Button, Section } from "@/components/ui";
import { formatPrice, products } from "@/lib/catalog";

export function generateMetadata({ params }) {
  var item = products.find(function (p) {
    return p.slug === params.slug;
  });
  if (!item) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found in the Project B catalog.",
      alternates: {
        canonical: "/shop"
      },
      robots: {
        index: false,
        follow: true
      },
      openGraph: {
        title: "Product Not Found | Project B",
        description: "The requested product could not be found in the Project B catalog.",
        url: "/shop",
        type: "website"
      },
      twitter: {
        card: "summary",
        title: "Product Not Found | Project B",
        description: "The requested product could not be found in the Project B catalog."
      }
    };
  }
  return {
    title: item.name,
    description: item.description,
    alternates: {
      canonical: "/shop/" + item.slug
    },
    openGraph: {
      title: item.name + " | Project B",
      description: item.description,
      url: "/shop/" + item.slug,
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title: item.name + " | Project B",
      description: item.description
    }
  };
}

export default function ProductDetailPage({ params }) {
  var item = products.find(function (p) {
    return p.slug === params.slug;
  });

  if (!item) {
    return (
      <main className="page-shell">
        <Section title="Product Not Found" id="missing-product">
          <p>The requested product does not exist.</p>
          <Button href="/shop" variant="secondary">Back to Shop</Button>
        </Section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <Section title={item.name} id="product-title">
        <p className="product-category">Category: {item.category.toUpperCase()}</p>
        <p>{item.description}</p>
        <p className="product-price">{formatPrice(item.price)}</p>
        <div className="chip-row">
          <Badge>Size: M</Badge>
          <Badge>Color: Black</Badge>
          {item.soldOut ? <Badge>SOLD OUT</Badge> : <Badge>IN STOCK</Badge>}
        </div>
        <div className="action-row">
          <Button href="/shop" variant="secondary">Back to Shop</Button>
          <Link href="/cart" className="c-btn">Add to Cart</Link>
        </div>
      </Section>
    </main>
  );
}

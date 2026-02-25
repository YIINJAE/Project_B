import Link from "next/link";
import { Badge, Button, Section } from "@/components/ui";
import { formatPrice, products } from "@/lib/catalog";
import { OptionSelector } from "@/components/product/OptionSelector";

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

  var images = item.images || [];
  var sizeOptions = item.options?.sizes || [];
  var related = products
    .filter(function (candidate) {
      return candidate.slug !== item.slug && candidate.category === item.category;
    })
    .slice(0, 4);

  return (
    <main className={item.soldOut ? "page-shell product-detail is-soldout" : "page-shell product-detail"}>
      <Section title={item.name} id="product-title">
        <div className="detail-layout">
          <div className="detail-gallery" aria-label="Product image gallery">
            <div className="detail-main-image" role="img" aria-label={images[0]?.alt || item.name} />
            <div className="detail-thumb-row" role="list" aria-label="Gallery thumbnails">
              {images.map(function (image, index) {
                return (
                  <button
                    type="button"
                    className="detail-thumb"
                    key={image.alt + "-" + String(index)}
                    aria-label={image.alt}
                  >
                    <span>View {index + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="detail-meta">
            <p className="product-category">Category: {item.category.toUpperCase()}</p>
            <p>{item.description}</p>
            <p className="detail-spec">Material: {item.material}</p>
            <p className="detail-spec">Fit: {item.fitNote}</p>
            <p className="detail-spec">Care: {item.care}</p>
            <div className="chip-row">
              {item.soldOut ? <Badge className="c-badge-soldout">SOLD OUT</Badge> : <Badge>OPTION SELECT</Badge>}
            </div>
          </div>
        </div>

        <OptionSelector item={item} />
      </Section>

      <Section title="Size Guide" id="size-guide-title">
        <p>Measured flat in centimeters. Allow +/- 1cm variance.</p>
        <div className="size-guide-table-wrap">
          <table className="size-guide-table">
            <thead>
              <tr>
                <th scope="col">Size</th>
                <th scope="col">Chest</th>
                <th scope="col">Length</th>
                <th scope="col">Sleeve</th>
              </tr>
            </thead>
            <tbody>
              {sizeOptions.map(function (size, index) {
                return (
                  <tr key={"size-guide-" + size}>
                    <th scope="row">{size}</th>
                    <td>{52 + index * 2}</td>
                    <td>{66 + index * 2}</td>
                    <td>{59 + index}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Shipping & Exchange" id="shipping-title">
        <ul className="detail-list">
          <li>Dispatch in 1-2 business days after payment confirmation.</li>
          <li>Domestic shipping fee is free over $80 equivalent order value.</li>
          <li>Exchange and return requests accepted within 7 days of delivery.</li>
          <li>Sale items and worn products are not eligible for exchange.</li>
        </ul>
      </Section>

      <Section title="Related Products" id="related-title">
        <div className="related-grid">
          {related.map(function (product) {
            return (
              <article key={product.slug} className="related-card">
                <p className="product-category">{product.category.toUpperCase()}</p>
                <h3>
                  <Link href={"/shop/" + product.slug}>{product.name}</Link>
                </h3>
                <p className="product-price">{formatPrice(product.price)}</p>
                <Link className="inline-link" href={"/shop/" + product.slug}>View Details</Link>
              </article>
            );
          })}
        </div>
      </Section>
    </main>
  );
}

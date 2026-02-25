import Link from "next/link";
import { formatPrice, products } from "@/lib/catalog";

export default function Page() {
  var sampleItems = [
    { slug: "item-01", qty: 1 },
    { slug: "item-02", qty: 2 }
  ].map(function (entry) {
    var product = products.find(function (candidate) {
      return candidate.slug === entry.slug;
    });
    return {
      ...entry,
      product: product
    };
  });

  var subtotal = sampleItems.reduce(function (sum, item) {
    return sum + (item.product?.price || 0) * item.qty;
  }, 0);

  var checkoutHref = "/checkout?slug=item-01&size=S&color=Black&qty=1";

  return (
    <main className="page-shell">
      <section className="section-block">
        <h1>Cart</h1>
        <p>Review current items before moving to checkout.</p>
        <div className="cart-list" role="list" aria-label="Cart items">
          {sampleItems.map(function (item) {
            if (!item.product) {
              return null;
            }
            return (
              <article key={item.slug} className="cart-item" role="listitem">
                <div>
                  <p className="product-category">{item.product.category.toUpperCase()}</p>
                  <h2>{item.product.name}</h2>
                  <p>Quantity: {item.qty}</p>
                </div>
                <p className="product-price">{formatPrice(item.product.price * item.qty)}</p>
              </article>
            );
          })}
        </div>
        <div className="cart-footer">
          <p className="summary-total">Subtotal: {formatPrice(subtotal)}</p>
          <div className="action-row">
            <Link href="/shop" className="c-btn c-btn-secondary">Continue Shopping</Link>
            <Link href={checkoutHref} className="c-btn">Proceed to Checkout</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

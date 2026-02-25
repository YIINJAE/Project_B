"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { products, formatPrice, computeVariantPrice } from "@/lib/catalog";

function normalizePhone(value) {
  return String(value || "").replace(/\D+/g, "");
}

function validateCheckoutForm(values) {
  var errors = {};
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var phoneDigits = normalizePhone(values.phone);

  if (!values.name.trim()) errors.name = "Recipient name is required.";
  if (!values.phone.trim()) errors.phone = "Phone number is required.";
  else if (phoneDigits.length < 9) errors.phone = "Enter a valid phone number.";

  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!emailRegex.test(values.email)) errors.email = "Enter a valid email address.";

  if (!values.zipCode.trim()) errors.zipCode = "ZIP code is required.";
  if (!values.address1.trim()) errors.address1 = "Address line 1 is required.";

  return errors;
}

export default function CheckoutPage() {
  var params = useSearchParams();
  var slug = params.get("slug") || "";
  var size = params.get("size") || "";
  var color = params.get("color") || "";
  var qty = Math.max(1, Number(params.get("qty")) || 1);

  var selectedProduct = useMemo(function () {
    return products.find(function (candidate) {
      return candidate.slug === slug;
    });
  }, [slug]);

  var unitPrice = selectedProduct
    ? computeVariantPrice(selectedProduct, { size: size, color: color })
    : 0;
  var subtotal = unitPrice * qty;

  var [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    zipCode: "",
    address1: "",
    address2: "",
    request: ""
  });
  var [errors, setErrors] = useState({});
  var [isSubmitting, setIsSubmitting] = useState(false);
  var [submitResult, setSubmitResult] = useState(null);

  function handleChange(event) {
    var key = event.target.name;
    var value = event.target.value;
    setFormValues(function (prev) {
      return { ...prev, [key]: value };
    });
    setErrors(function (prev) {
      if (!prev[key]) return prev;
      var next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitResult(null);

    var nextErrors = validateCheckoutForm(formValues);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      var response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: {
            name: formValues.name.trim(),
            phone: normalizePhone(formValues.phone),
            email: formValues.email.trim()
          },
          address: {
            zipCode: formValues.zipCode.trim(),
            address1: formValues.address1.trim(),
            address2: formValues.address2.trim()
          },
          request: formValues.request.trim(),
          items: selectedProduct
            ? [
                {
                  slug: selectedProduct.slug,
                  name: selectedProduct.name,
                  size: size || null,
                  color: color || null,
                  qty: qty,
                  unitPrice: unitPrice
                }
              ]
            : []
        })
      });
      var data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Order submission failed.");
      }
      setSubmitResult({
        ok: true,
        message: "Order submitted. Reference: " + data.orderId
      });
      setFormValues({
        name: "",
        phone: "",
        email: "",
        zipCode: "",
        address1: "",
        address2: "",
        request: ""
      });
    } catch (error) {
      setSubmitResult({
        ok: false,
        message: error?.message || "Order submission failed."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-block">
        <h1>Checkout</h1>
        <p>Complete contact and shipping details to place your order.</p>
      </section>

      <div className="checkout-layout">
        <section className="checkout-card" aria-labelledby="checkout-form-title">
          <h2 id="checkout-form-title">Address & Contact</h2>
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="name">Recipient Name</label>
            <input
              id="name"
              className="c-input"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "error-name" : undefined}
            />
            {errors.name ? <p id="error-name" className="form-error">{errors.name}</p> : null}

            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              className="c-input"
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "error-phone" : undefined}
            />
            {errors.phone ? <p id="error-phone" className="form-error">{errors.phone}</p> : null}

            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="c-input"
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "error-email" : undefined}
            />
            {errors.email ? <p id="error-email" className="form-error">{errors.email}</p> : null}

            <label htmlFor="zipCode">ZIP Code</label>
            <input
              id="zipCode"
              className="c-input"
              name="zipCode"
              value={formValues.zipCode}
              onChange={handleChange}
              aria-invalid={Boolean(errors.zipCode)}
              aria-describedby={errors.zipCode ? "error-zipCode" : undefined}
            />
            {errors.zipCode ? <p id="error-zipCode" className="form-error">{errors.zipCode}</p> : null}

            <label htmlFor="address1">Address Line 1</label>
            <input
              id="address1"
              className="c-input"
              name="address1"
              value={formValues.address1}
              onChange={handleChange}
              aria-invalid={Boolean(errors.address1)}
              aria-describedby={errors.address1 ? "error-address1" : undefined}
            />
            {errors.address1 ? <p id="error-address1" className="form-error">{errors.address1}</p> : null}

            <label htmlFor="address2">Address Line 2</label>
            <input
              id="address2"
              className="c-input"
              name="address2"
              value={formValues.address2}
              onChange={handleChange}
            />

            <label htmlFor="request">Delivery Request</label>
            <textarea
              id="request"
              className="checkout-textarea"
              name="request"
              value={formValues.request}
              onChange={handleChange}
              rows={4}
              placeholder="Optional note for courier or concierge."
            />

            <div className="action-row">
              <Link href="/cart" className="c-btn c-btn-secondary">Back to Cart</Link>
              <button className="c-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Place Order"}
              </button>
            </div>

            {submitResult ? (
              <p className={submitResult.ok ? "form-success" : "form-error"} role="status">
                {submitResult.message}
              </p>
            ) : null}
          </form>
        </section>

        <aside className="checkout-card checkout-summary" aria-labelledby="checkout-summary-title">
          <h2 id="checkout-summary-title">Order Summary</h2>
          {selectedProduct ? (
            <div className="summary-item">
              <h3>{selectedProduct.name}</h3>
              <p>{selectedProduct.category.toUpperCase()}</p>
              <p>Option: {size || "Default"} / {color || "Default"}</p>
              <p>Quantity: {qty}</p>
              <p>Unit Price: {formatPrice(unitPrice)}</p>
              <p className="summary-total">Subtotal: {formatPrice(subtotal)}</p>
            </div>
          ) : (
            <p>No product selected. Return to product detail or cart to start checkout.</p>
          )}
        </aside>
      </div>
    </main>
  );
}

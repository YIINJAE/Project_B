"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { formatPrice } from "@/lib/catalog";

function normalizeVariant(variant, isSoldOut) {
  var safeStock = Number.isFinite(variant?.stock) ? Math.max(0, variant.stock) : isSoldOut ? 0 : 0;
  var safeDelta = Number.isFinite(variant?.priceDelta) ? variant.priceDelta : 0;
  return {
    stock: safeStock,
    priceDelta: safeDelta
  };
}

function getVariantForSelection(variants, size, colorName, isSoldOut) {
  if (!variants || typeof variants !== "object") {
    return normalizeVariant(null, isSoldOut);
  }
  var key = size + "::" + colorName;
  return normalizeVariant(variants[key], isSoldOut);
}

export function OptionSelector({ item }) {
  if (!item) {
    return null;
  }

  var sizeOptions = Array.isArray(item.options?.sizes) ? item.options.sizes : [];
  var colorOptions = Array.isArray(item.options?.colors) ? item.options.colors : [];

  var initialSize = sizeOptions[0] || "";
  var initialColorName = colorOptions[0]?.name || "";

  var [selectedSize, setSelectedSize] = useState(initialSize);
  var [selectedColorName, setSelectedColorName] = useState(initialColorName);

  var hasVariantOptions = selectedSize && selectedColorName;
  var selectedVariant = useMemo(
    function () {
      return getVariantForSelection(item.options?.variants, selectedSize, selectedColorName, item.soldOut);
    },
    [item.options, item.soldOut, selectedSize, selectedColorName]
  );

  var livePrice = item.price + selectedVariant.priceDelta;
  var isVariantSoldOut = !hasVariantOptions || selectedVariant.stock <= 0;
  var stockMessage = isVariantSoldOut
    ? "Selected option is sold out."
    : "Ready to add to cart. " + String(selectedVariant.stock) + " in stock.";

  return (
    <form className="detail-options" action="/cart" method="get">
      <input type="hidden" name="slug" value={item.slug} />
      <p className="product-price" aria-live="polite">{formatPrice(livePrice)}</p>
      <p className={isVariantSoldOut ? "stock-state stock-state-soldout" : "stock-state"} aria-live="polite">
        {stockMessage}
      </p>

      <fieldset>
        <legend>Size</legend>
        <div className="option-row">
          {sizeOptions.map(function (size) {
            var id = "size-" + String(size).toLowerCase();
            return (
              <label key={id} htmlFor={id} className="option-pill">
                <input
                  id={id}
                  type="radio"
                  name="size"
                  value={size}
                  checked={selectedSize === size}
                  onChange={function (event) {
                    if (!event?.target?.value) {
                      return;
                    }
                    setSelectedSize(event.target.value);
                  }}
                />
                <span>{size}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend>Color</legend>
        <div className="option-row">
          {colorOptions.map(function (color) {
            var colorName = color?.name || "Unknown";
            var colorSwatch = color?.swatch || "#cccccc";
            var colorId = "color-" + colorName.toLowerCase().replace(/\s+/g, "-");
            return (
              <label key={colorId} htmlFor={colorId} className="option-pill">
                <input
                  id={colorId}
                  type="radio"
                  name="color"
                  value={colorName}
                  checked={selectedColorName === colorName}
                  onChange={function (event) {
                    if (!event?.target?.value) {
                      return;
                    }
                    setSelectedColorName(event.target.value);
                  }}
                />
                <span className="color-dot" style={{ backgroundColor: colorSwatch }} aria-hidden="true" />
                <span>{colorName}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="action-row">
        <Button href="/shop" variant="secondary">Back to Shop</Button>
        <button type="submit" className="c-btn" disabled={isVariantSoldOut} aria-disabled={isVariantSoldOut}>
          Add to Cart
        </button>
      </div>
    </form>
  );
}

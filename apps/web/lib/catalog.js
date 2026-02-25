export var categories = ["all", "outer", "top", "pants", "acc"];

var palette = [
  { name: "Black", swatch: "#202430" },
  { name: "Stone", swatch: "#b5aea1" },
  { name: "Forest", swatch: "#3d5f55" },
  { name: "Navy", swatch: "#1c3159" },
  { name: "Ivory", swatch: "#f0ece4" }
];

var sizeSets = [
  ["XS", "S", "M", "L"],
  ["S", "M", "L", "XL"],
  ["28", "30", "32", "34"]
];

function buildVariantMatrix(seq, sizeOptions, colors, isSoldOut) {
  return sizeOptions.reduce(function (acc, size, sizeIndex) {
    colors.forEach(function (color, colorIndex) {
      var key = size + "::" + color.name;
      var stock = isSoldOut ? 0 : (seq + sizeIndex * 2 + colorIndex * 3) % 5;
      var priceDelta = sizeIndex * 1200 + colorIndex * 400;
      acc[key] = {
        size: size,
        color: color.name,
        stock: stock,
        priceDelta: priceDelta
      };
    });
    return acc;
  }, {});
}

function matrixToList(matrix) {
  return Object.keys(matrix || {}).map(function (key) {
    return matrix[key];
  });
}

export var products = Array.from({ length: 30 }, function (_, index) {
  var seq = index + 1;
  var category = categories[(seq % (categories.length - 1)) + 1];
  var paletteOffset = seq % palette.length;
  var colors = [0, 1, 2].map(function (step) {
    return palette[(paletteOffset + step) % palette.length];
  });
  var sizeOptions = sizeSets[seq % sizeSets.length];
  var imageCount = 4;
  var images = Array.from({ length: imageCount }, function (_unused, imageIndex) {
    return {
      src: "/assets/shop/" + category + "-" + String((imageIndex % 3) + 1) + ".jpg",
      alt: "Detail view " + String(imageIndex + 1) + " of Item " + String(seq).padStart(2, "0")
    };
  });
  var isSoldOut = seq % 7 === 0;
  var variantMatrix = buildVariantMatrix(seq, sizeOptions, colors, isSoldOut);

  return {
    slug: "item-" + String(seq).padStart(2, "0"),
    name: "Item " + String(seq).padStart(2, "0"),
    category: category,
    price: 39000 + index * 3000,
    soldOut: isSoldOut,
    description: "Week2 dummy product for shop/detail flow",
    images: images,
    options: {
      sizes: sizeOptions,
      colors: colors,
      variants: variantMatrix
    },
    fitNote: "Relaxed silhouette with room through chest and shoulder.",
    material: seq % 2 === 0 ? "Cotton-nylon blend shell" : "Washed cotton twill",
    care: "Cold wash or dry clean. Hang dry recommended."
  };
});

export function formatPrice(value) {
  return "$" + Math.floor(value / 1300).toString();
}

export function getDefaultVariant(product) {
  var list = matrixToList(product?.options?.variants);
  if (!list.length) return null;
  return (
    list.find(function (variant) {
      return variant.stock > 0;
    }) || list[0]
  );
}

export function resolveSelectedVariant(product, selection) {
  var matrix = product?.options?.variants || {};
  var size = selection?.size;
  var color = selection?.color;
  if (!size || !color) return getDefaultVariant(product);
  var key = size + "::" + color;
  return matrix[key] || getDefaultVariant(product);
}

export function computeVariantPrice(product, selection) {
  var variant = resolveSelectedVariant(product, selection);
  var delta = variant ? variant.priceDelta : 0;
  return product.price + delta;
}

export function computeVariantStock(product, selection) {
  var variant = resolveSelectedVariant(product, selection);
  if (!variant) return product.soldOut ? 0 : 1;
  return variant.stock;
}

export function filterAndSortProducts(list, searchParams) {
  var category = (searchParams.category || "all").toLowerCase();
  var keyword = (searchParams.q || "").toLowerCase().trim();
  var sort = (searchParams.sort || "new").toLowerCase();

  var filtered = list.filter(function (item) {
    if (category !== "all" && item.category !== category) return false;
    if (keyword && !item.name.toLowerCase().includes(keyword)) return false;
    return true;
  });

  if (sort === "low") {
    filtered.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (sort === "high") {
    filtered.sort(function (a, b) {
      return b.price - a.price;
    });
  } else {
    filtered.sort(function (a, b) {
      return b.slug.localeCompare(a.slug);
    });
  }

  return filtered;
}

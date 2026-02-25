export var categories = ["all", "outer", "top", "pants", "acc"];

export var products = Array.from({ length: 30 }, function (_, index) {
  var seq = index + 1;
  var category = categories[(seq % (categories.length - 1)) + 1];
  return {
    slug: "item-" + String(seq).padStart(2, "0"),
    name: "Item " + String(seq).padStart(2, "0"),
    category: category,
    price: 39000 + index * 3000,
    soldOut: seq % 7 === 0,
    description: "Week2 dummy product for shop/detail flow"
  };
});

export function formatPrice(value) {
  return "$" + Math.floor(value / 1300).toString();
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

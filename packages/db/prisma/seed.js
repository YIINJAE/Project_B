/* eslint-disable no-console */
const categories = [
  { slug: "outer", name: "Outer" },
  { slug: "top", name: "Top" },
  { slug: "pants", name: "Pants" },
  { slug: "acc", name: "Acc" }
];

const products = Array.from({ length: 30 }, (_, i) => {
  const idx = i + 1;
  const category = categories[i % categories.length].slug;
  return {
    slug: `item-${String(idx).padStart(2, "0")}`,
    name: `Item ${String(idx).padStart(2, "0")}`,
    category,
    price: 39000 + i * 3000,
    isSoldOut: idx % 7 === 0
  };
});

console.log("Seed preview");
console.table(products.slice(0, 8));
console.log(`total=${products.length}`);
console.log("Connect Prisma client and upsert categories/products in next step.");

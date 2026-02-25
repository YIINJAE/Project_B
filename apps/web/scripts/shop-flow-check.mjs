import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const shopPagePath = path.join(ROOT, "app", "shop", "page.js");
const detailPagePath = path.join(ROOT, "app", "shop", "[slug]", "page.js");
const optionSelectorPath = path.join(ROOT, "components", "product", "OptionSelector.jsx");

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("Missing file: " + filePath);
  }
  return fs.readFileSync(filePath, "utf8");
}

function assertContains(source, pattern, message) {
  if (!source.includes(pattern)) {
    throw new Error(message + " (missing pattern: " + pattern + ")");
  }
}

const shopSource = read(shopPagePath);
const detailSource = read(detailPagePath);
const optionSource = read(optionSelectorPath);

assertContains(shopSource, "function buildDetailLink", "Shop page must build detail link with current query state");
assertContains(shopSource, "buildDetailLink(product.slug, searchParams)", "Product link must pass searchParams to detail");
assertContains(detailSource, "function buildBackHref", "Detail page must provide back href builder");
assertContains(detailSource, "OptionSelector item={item} backHref={backHref}", "Detail must pass backHref into option selector");
assertContains(optionSource, "backHref = \"/shop\"", "OptionSelector must support backHref fallback");
assertContains(optionSource, "<Button href={backHref}", "OptionSelector back button must use backHref");

console.log("shop-flow-check: ok");

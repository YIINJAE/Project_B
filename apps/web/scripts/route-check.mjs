import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT_DIR = path.resolve(process.cwd());
const APP_DIR = path.join(ROOT_DIR, "app");
const REQUIRED_ROUTES = ["/", "/shop"];
const PAGE_FILE_NAMES = new Set(["page.js", "page.jsx", "page.mjs", "page.tsx", "page.ts"]);
const JS_FILE_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);

function walk(dirPath, matcher, results = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath, matcher, results);
      continue;
    }
    if (matcher(entryPath, entry.name)) {
      results.push(entryPath);
    }
  }
  return results;
}

function toRoute(appFilePath) {
  const fromApp = path.relative(APP_DIR, path.dirname(appFilePath));
  if (fromApp === "") {
    return "/";
  }

  const segments = fromApp
    .split(path.sep)
    .filter(Boolean)
    .filter((segment) => !segment.startsWith("("))
    .map((segment) => {
      if (segment.startsWith("@")) {
        return "";
      }
      if (segment === "index") {
        return "";
      }
      return segment;
    })
    .filter(Boolean);

  return `/${segments.join("/")}`;
}

function isIgnoredHref(href) {
  return (
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//")
  );
}

function normalizeHref(href) {
  const [withoutQuery] = href.split("?");
  const [withoutHash] = withoutQuery.split("#");
  if (withoutHash.endsWith("/") && withoutHash !== "/") {
    return withoutHash.slice(0, -1);
  }
  return withoutHash;
}

function collectHrefs(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const hrefPattern = /\bhref\s*=\s*["'`]([^"'`]+)["'`]/g;
  const hrefs = [];

  for (const match of source.matchAll(hrefPattern)) {
    hrefs.push(match[1]);
  }

  return hrefs;
}

function fail(message) {
  console.error(`route-check: ${message}`);
}

if (!fs.existsSync(APP_DIR)) {
  fail(`missing app directory at ${APP_DIR}`);
  process.exit(1);
}

const routeFiles = walk(APP_DIR, (_, fileName) => PAGE_FILE_NAMES.has(fileName));
const routes = new Set(routeFiles.map(toRoute));
const sourceFiles = walk(APP_DIR, (entryPath) => JS_FILE_EXTENSIONS.has(path.extname(entryPath)));
const errors = [];

for (const requiredRoute of REQUIRED_ROUTES) {
  if (!routes.has(requiredRoute)) {
    errors.push(`missing required route file for "${requiredRoute}"`);
  }
}

for (const sourceFile of sourceFiles) {
  const hrefs = collectHrefs(sourceFile);
  for (const href of hrefs) {
    if (!href.startsWith("/") || isIgnoredHref(href)) {
      continue;
    }
    const normalized = normalizeHref(href);
    if (!routes.has(normalized)) {
      errors.push(`broken href "${href}" in ${path.relative(ROOT_DIR, sourceFile)} (no matching route file)`);
    }
  }
}

if (!fs.existsSync(path.join(APP_DIR, "not-found.js"))) {
  errors.push("missing app/not-found.js");
}

if (errors.length > 0) {
  for (const error of errors) {
    fail(error);
  }
  process.exit(1);
}

console.log(`route-check: ok (${routes.size} routes, ${sourceFiles.length} app source files scanned)`);

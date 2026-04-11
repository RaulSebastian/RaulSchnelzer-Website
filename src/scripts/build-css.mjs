import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");
const cssDir = join(rootDir, "assets/css");
const outputFile = join(cssDir, "style.min.css");
const orderedRelativeFiles = [
  "style.css",
  "landing.css",
  "footer.css",
  "navigation.css",
  "section.css",
  "theme.css",
  "responsive.css",
  "sections/about.css",
  "sections/contact.css",
  "sections/experience.css",
  "sections/quote.css",
  "sections/skills.css",
  "sections/services.css",
  "themes/dark-theme.css",
  "themes/light-theme.css"
];

function stripImports(source) {
  return source.replaceAll(/@import\s+(?:url\()?["'][^"')]+["']\)?\s*;?\s*/g, "");
}

function stripBom(source) {
  return source.replaceAll('\uFEFF', "");
}

function rewriteAssetUrls(filePath, source) {
  return source.replaceAll(/url\(([^)]+)\)/g, (fullMatch, rawValue) => {
    const value = rawValue.trim().replaceAll(/^['"]|['"]$/g, "");

    if (
      !value ||
      value.startsWith("#") ||
      value.startsWith("data:") ||
      value.startsWith("//") ||
      value.includes("://")
    ) {
      return fullMatch;
    }

    const assetPath = resolve(dirname(filePath), value);
    const rewritten = relative(cssDir, assetPath).replaceAll("\\", "/");
    return `url("${rewritten}")`;
  });
}

const orderedFileSources = await Promise.all([
  readFile(join(cssDir, "style.css"), "utf8"),
  readFile(join(cssDir, "landing.css"), "utf8"),
  readFile(join(cssDir, "footer.css"), "utf8"),
  readFile(join(cssDir, "navigation.css"), "utf8"),
  readFile(join(cssDir, "section.css"), "utf8"),
  readFile(join(cssDir, "theme.css"), "utf8"),
  readFile(join(cssDir, "responsive.css"), "utf8"),
  readFile(join(cssDir, "sections/about.css"), "utf8"),
  readFile(join(cssDir, "sections/contact.css"), "utf8"),
  readFile(join(cssDir, "sections/experience.css"), "utf8"),
  readFile(join(cssDir, "sections/quote.css"), "utf8"),
  readFile(join(cssDir, "sections/skills.css"), "utf8"),
  readFile(join(cssDir, "sections/services.css"), "utf8"),
  readFile(join(cssDir, "themes/dark-theme.css"), "utf8"),
  readFile(join(cssDir, "themes/light-theme.css"), "utf8")
]);

const concatenatedSource = orderedRelativeFiles.map((filePath, index) => {
  const source = orderedFileSources[index];
  return rewriteAssetUrls(join(cssDir, filePath), stripImports(stripBom(source)));
}).join("\n");

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, concatenatedSource);

console.log(`Built ${relative(rootDir, outputFile)}`);

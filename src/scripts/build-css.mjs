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
  return source.replace(/@import\s+(?:url\()?["'][^"')]+["']\)?\s*;?\s*/g, "");
}

function stripBom(source) {
  return source.replace(/\uFEFF/g, "");
}

function rewriteAssetUrls(filePath, source) {
  return source.replace(/url\(([^)]+)\)/g, (fullMatch, rawValue) => {
    const value = rawValue.trim().replace(/^['"]|['"]$/g, "");

    if (
      !value ||
      value.startsWith("#") ||
      value.startsWith("data:") ||
      /^(?:[a-z]+:)?\/\//i.test(value)
    ) {
      return fullMatch;
    }

    const assetPath = resolve(dirname(filePath), value);
    const rewritten = relative(cssDir, assetPath).replace(/\\/g, "/");
    return `url("${rewritten}")`;
  });
}

const orderedFiles = orderedRelativeFiles.map(filePath => join(cssDir, filePath));

const concatenatedSource = (await Promise.all(
  orderedFiles.map(async filePath => {
    const source = await readFile(filePath, "utf8");
    return rewriteAssetUrls(filePath, stripImports(stripBom(source)));
  })
)).join("\n");

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, concatenatedSource);

console.log(`Built ${relative(rootDir, outputFile)}`);

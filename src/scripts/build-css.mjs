import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");
const cssDir = join(rootDir, "assets/css");
const outputFile = join(cssDir, "style.min.css");
function readCssFile(relativeFilePath) {
  const absoluteFilePath = join(cssDir, relativeFilePath);
  return readFile(absoluteFilePath, "utf8").then(source => ({
    absoluteFilePath,
    source
  }));
}

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

const orderedCssFiles = await Promise.all([
  readCssFile("style.css"),
  readCssFile("landing.css"),
  readCssFile("footer.css"),
  readCssFile("navigation.css"),
  readCssFile("section.css"),
  readCssFile("theme.css"),
  readCssFile("responsive.css"),
  readCssFile("sections/about.css"),
  readCssFile("sections/contact.css"),
  readCssFile("sections/experience.css"),
  readCssFile("sections/quote.css"),
  readCssFile("sections/skills.css"),
  readCssFile("sections/services.css"),
  readCssFile("themes/dark-theme.css"),
  readCssFile("themes/light-theme.css")
]);

const concatenatedSource = orderedCssFiles.map(({ absoluteFilePath, source }) => {
  return rewriteAssetUrls(absoluteFilePath, stripImports(stripBom(source)));
}).join("\n");

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, concatenatedSource);

console.log(`Built ${relative(rootDir, outputFile)}`);

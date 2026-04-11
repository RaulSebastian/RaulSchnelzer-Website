import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");
const cssDir = join(rootDir, "assets/css");
const outputFile = join(cssDir, "style.min.css");

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
  readFile(join(cssDir, "style.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "style.css"),
    source
  })),
  readFile(join(cssDir, "landing.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "landing.css"),
    source
  })),
  readFile(join(cssDir, "footer.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "footer.css"),
    source
  })),
  readFile(join(cssDir, "navigation.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "navigation.css"),
    source
  })),
  readFile(join(cssDir, "section.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "section.css"),
    source
  })),
  readFile(join(cssDir, "theme.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "theme.css"),
    source
  })),
  readFile(join(cssDir, "responsive.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "responsive.css"),
    source
  })),
  readFile(join(cssDir, "sections/about.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "sections/about.css"),
    source
  })),
  readFile(join(cssDir, "sections/contact.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "sections/contact.css"),
    source
  })),
  readFile(join(cssDir, "sections/experience.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "sections/experience.css"),
    source
  })),
  readFile(join(cssDir, "sections/quote.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "sections/quote.css"),
    source
  })),
  readFile(join(cssDir, "sections/skills.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "sections/skills.css"),
    source
  })),
  readFile(join(cssDir, "sections/services.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "sections/services.css"),
    source
  })),
  readFile(join(cssDir, "themes/dark-theme.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "themes/dark-theme.css"),
    source
  })),
  readFile(join(cssDir, "themes/light-theme.css"), "utf8").then(source => ({
    absoluteFilePath: join(cssDir, "themes/light-theme.css"),
    source
  }))
]);

const concatenatedSource = orderedCssFiles.map(({ absoluteFilePath, source }) => {
  return rewriteAssetUrls(absoluteFilePath, stripImports(stripBom(source)));
}).join("\n");

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, concatenatedSource);

console.log(`Built ${relative(rootDir, outputFile)}`);

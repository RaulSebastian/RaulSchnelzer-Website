import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "lightningcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");
const inputFile = join(rootDir, "assets/css/site.css");
const outputFile = join(rootDir, "assets/css/site.min.css");

const { code } = bundle({
  filename: inputFile,
  minify: true,
});

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, code);

console.log(`Built ${relative(rootDir, outputFile)}`);

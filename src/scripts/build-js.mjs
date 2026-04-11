import { mkdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");
const inputFile = join(rootDir, "assets/js/index.js");
const outputFile = join(rootDir, "assets/js/main.min.js");

await mkdir(dirname(outputFile), { recursive: true });

await esbuild.build({
  entryPoints: [inputFile],
  bundle: true,
  minify: true,
  format: "iife",
  outfile: outputFile,
  target: ["es2019"],
});

console.log(`Built ${relative(rootDir, outputFile)}`);

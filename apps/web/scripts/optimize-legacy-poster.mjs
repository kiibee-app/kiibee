// Rebuild the bounded derivative used by utils/imageDelivery.ts.
// Usage: node scripts/optimize-legacy-poster.mjs /path/to/original.jpg [halvvejs|instachamp]
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";

const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next")] }),
);
const source = process.argv[2];
const outputs = {
  halvvejs: "lange-halvvejs-04-2024-v1.webp",
  instachamp: "uffe-instachamp-v1.webp",
};
const output = outputs[process.argv[3] ?? "halvvejs"];
if (!output) throw new Error("Choose halvvejs or instachamp");
if (!source)
  throw new Error(
    "Pass the original lange_halvvejs_04-2024-some4.jpg file path",
  );
const directory = new URL("../public/media-optimized/", import.meta.url);
await mkdir(directory, { recursive: true });
const result = await sharp(source)
  .rotate()
  .resize({
    width: 1600,
    height: 1600,
    fit: "inside",
    withoutEnlargement: true,
  })
  .webp({ quality: 85 })
  .toFile(fileURLToPath(new URL(output, directory)));
console.log(result);

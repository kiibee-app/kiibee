import { cpSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const packagePath = require.resolve('pdfjs-dist/package.json');
const source = dirname(packagePath);
const { version } = JSON.parse(readFileSync(packagePath, 'utf8'));
const target = resolve(dirname(fileURLToPath(import.meta.url)), '../public/pdfjs', version);
mkdirSync(target, { recursive: true });
for (const folder of ['cmaps', 'standard_fonts', 'wasm', 'iccs']) {
  cpSync(resolve(source, folder), resolve(target, folder), { recursive: true });
}
for (const name of ['pdf.worker.min.mjs', 'pdf.renderer.min.mjs']) {
  cpSync(resolve(source, 'build', name), resolve(target, name));
}
console.log(`PDF viewer assets ready (${version})`);

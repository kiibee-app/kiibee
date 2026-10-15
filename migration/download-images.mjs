import { mkdir, readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import config from './config.mjs';

const BASE_URL = 'https://kiibee.dk';
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|svg|bmp|avif)$/i;
const IMAGE_KEYS = new Set([
  'src',
  'thumbnail',
  'coverImage',
  'coverImageMobile',
  'logoImage',
  'rawFile',
]);

const clean = (value) =>
  String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase();

const safe = (value) =>
  String(value || 'unnamed')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[<>:"/\\|?*\u0000-\u001f]+/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 120);

function mediaSrc(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  const pathOnly = trimmed.split('?')[0];
  if (!pathOnly.includes('/media/')) return '';
  if (!IMAGE_EXT.test(pathOnly) && !/\/media\/\d+\//.test(pathOnly)) return '';
  return pathOnly.replace(/^https?:\/\/(?:www\.)?kiibee\.dk/i, '');
}

function collectSrcs(value, out) {
  if (!value) return;
  if (typeof value === 'string') {
    const src = mediaSrc(value);
    if (src) out.add(src);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectSrcs(item, out);
    return;
  }
  if (typeof value === 'object') {
    for (const item of Object.values(value)) collectSrcs(item, out);
  }
}

const SKIP_DIRS = new Set(['media', 'raw', 'stats', 'purchases', 'payouts', 'logs']);
const KEEP_FILES = new Set(['layout.json', 'items.json', 'shows.json']);

async function walkJsonFiles(dir, files = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walkJsonFiles(full, files);
    } else if (KEEP_FILES.has(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function fileNameFromSrc(src) {
  try {
    const pathname = new URL(src, BASE_URL).pathname;
    const parts = pathname.split('/').filter(Boolean);
    const base = parts.at(-1) || 'image';
    const mediaId = parts.length >= 3 && parts[0] === 'media' ? parts[1] : '';
    return mediaId ? `${mediaId}_${base}` : base;
  } catch {
    const base = path.basename(String(src).split('?')[0]) || 'image';
    return base;
  }
}

async function download(src, destDirs, cookie, xsrfToken) {
  const url = src.startsWith('http') ? src : `${BASE_URL}${src.startsWith('/') ? src : `/${src}`}`;
  const fileName = fileNameFromSrc(src);
  const destPaths = destDirs.map((dir) => path.join(dir, fileName));
  try {
    const existing = [];
    for (const dest of destPaths) {
      try {
        const info = await stat(dest);
        if (info.size > 32) existing.push(dest);
      } catch {
        // missing
      }
    }
    if (existing.length === destPaths.length && process.env.FORCE_MEDIA !== '1') {
      return { src, fileName, bytes: (await stat(destPaths[0])).size, skipped: true };
    }
    const response = await fetch(url, {
      signal: AbortSignal.timeout(12000),
      headers: {
        cookie,
        referer: `${BASE_URL}/umbraco`,
        'x-umb-xsrf-token': xsrfToken,
      },
    });
    if (!response.ok) {
      return { src, fileName, error: `HTTP ${response.status}` };
    }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('json') || contentType.includes('text/html')) {
      return { src, fileName, error: `unexpected content-type ${contentType}` };
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 32) {
      return { src, fileName, error: 'empty or tiny response' };
    }
    for (const dir of destDirs) {
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, fileName), buffer);
    }
    return { src, fileName, bytes: buffer.length };
  } catch (error) {
    return { src, fileName, error: error.message };
  }
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

function parseCookies(text) {
  const wanted = new Set(['UMB_UCONTEXT', 'UMB_UCONTEXT_C', 'UMB-XSRF-TOKEN', 'UMB-XSRF-V']);
  const values = new Map();
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const tabParts = trimmed.split(/\t+/);
    if (wanted.has(tabParts[0]) && tabParts[1]) {
      values.set(tabParts[0], tabParts[1]);
    }
  }
  return {
    cookie: [...wanted].filter((name) => values.get(name)).map((name) => `${name}=${values.get(name)}`).join('; '),
    xsrfToken: values.get('UMB-XSRF-TOKEN'),
  };
}

async function localUserDirs() {
  const root = config.outputDir || 'umbraco-data/users';
  const entries = await readdir(root, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

function resolveUserDir(requested, dirs) {
  const wanted = clean(requested);
  return (
    dirs.find((dir) => clean(dir) === wanted) ||
    dirs.find((dir) => clean(dir).startsWith(wanted) || (wanted.startsWith(clean(dir)) && Math.abs(wanted.length - clean(dir).length) <= 3)) ||
    safe(requested)
  );
}

async function main() {
  const skip = new Set((config.skipProfileKeys || []).map(clean));
  const auth = parseCookies(await readFile(path.resolve(config.cookiesFile || 'migration/cookies.txt'), 'utf8'));
  const dirs = await localUserDirs();
  const report = { startedAt: new Date().toISOString(), users: [] };

  for (const requested of config.users) {
    const name = typeof requested === 'string' ? requested : requested.name;
    const userDir = resolveUserDir(name, dirs);
    if (skip.has(clean(userDir)) || skip.has(clean(name))) {
      report.users.push({ name, userDir, status: 'skipped' });
      console.log(`[skipped] ${name}`);
      continue;
    }
    const root = path.join(config.outputDir || 'umbraco-data/users', userDir);
    try {
      await stat(root);
    } catch {
      report.users.push({ name, userDir, status: 'missing-folder' });
      console.log(`[missing] ${name}`);
      continue;
    }

    const srcs = new Set();
    const jsonFiles = await walkJsonFiles(root);
    console.log(`[start] ${userDir} files=${jsonFiles.length}`);
    for (const file of jsonFiles) {
      try {
        collectSrcs(JSON.parse(await readFile(file, 'utf8')), srcs);
      } catch {
        // ignore invalid json
      }
    }

    const destDirs = [path.join(root, 'media'), path.join(root, 'profile-info', 'media')];
    const list = [...srcs];
    const downloads = list.length
      ? await mapLimit(list, 8, (src) => download(src, destDirs, auth.cookie, auth.xsrfToken))
      : [];
    const ok = downloads.filter((item) => item.bytes).length;
    const failed = downloads.filter((item) => item.error);
    report.users.push({ name, userDir, srcs: srcs.size, ok, failed });
    console.log(`[ok] ${userDir} images=${ok}/${srcs.size}${failed.length ? ` failed=${failed.length}` : ''}`);
  }

  report.finishedAt = new Date().toISOString();
  await mkdir('umbraco-data/export-runs', { recursive: true });
  await writeFile(
    'umbraco-data/export-runs/images-latest.json',
    `${JSON.stringify(report, null, 2)}\n`,
  );
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

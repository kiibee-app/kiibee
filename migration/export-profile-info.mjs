#!/usr/bin/env node
/**
 * Re-export Umbraco creator profile-info tabs (including Layout cover/logo)
 * into umbraco-data/users/<user>/profile-info/*.json
 *
 * Usage:
 *   1) Put cookies in migration/cookies.txt
 *   2) List users in migration/config.mjs (or leave empty to refresh all local profile-info users)
 *   3) node migration/export-profile-info.mjs
 */
import { mkdir, readdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import config from './config.mjs';

const BASE_URL = 'https://kiibee.dk';
const CHILDREN_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Content/GetChildren`;
const DETAIL_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Content/GetById`;
const USERS_ROOT_ID = 1067;

const TABS_VISIBLE = [
  'General',
  'Subscription',
  'Access & Price',
  'Layout',
  'Notifications',
  'SiteMap',
  'SEO',
  'Info',
];

const FILE_ALIASES = {
  'general.json': ['owner', 'emailReceipt', 'supportEmail'],
  'subscription.json': [
    'subscription',
    'price',
    'price3',
    'price6',
    'price12',
    'maxFiles',
    'kiibeeCut',
    'transactionFee',
    'paymentPeriod',
  ],
  'access-and-price.json': ['access', 'rentalPrice', 'purchasePrice', 'code'],
  'layout.json': [
    'skin',
    'logoText',
    'useLogoImage',
    'logoImage',
    'useCoverImage',
    'coverImage',
    'coverImageMobile',
    'fadeCoverImage',
    'textColor',
    'coverTextPositionClass',
    'headline',
    'description',
    'css',
    'javaScript',
  ],
  'notifications.json': [
    'lastNotificationDate',
    'frequency',
    'notificationsType',
    'emails',
  ],
  'sitemap.json': ['siteMapOption'],
  'seo.json': ['metaTitle', 'metaDescription'],
  'info.json': [],
};

const IMAGE_ALIASES = new Set([
  'logoImage',
  'coverImage',
  'coverImageMobile',
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

let auth;

function parseCookies(text) {
  const wanted = new Set([
    'UMB_UCONTEXT',
    'UMB_UCONTEXT_C',
    'UMB-XSRF-TOKEN',
    'UMB-XSRF-V',
  ]);
  const values = new Map();
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const tabParts = trimmed.split(/\t+/);
    if (wanted.has(tabParts[0]) && tabParts[1]) {
      values.set(tabParts[0], tabParts[1]);
      continue;
    }
    for (const part of trimmed.split(/;\s*/)) {
      const separator = part.indexOf('=');
      if (separator < 1) continue;
      const name = part.slice(0, separator).trim();
      if (wanted.has(name)) values.set(name, part.slice(separator + 1).trim());
    }
  }
  const missing = [...wanted].filter((name) => !values.get(name));
  if (missing.length) {
    throw new Error(`Missing cookies: ${missing.join(', ')}`);
  }
  return {
    cookie: [...wanted].map((name) => `${name}=${values.get(name)}`).join('; '),
    xsrfToken: values.get('UMB-XSRF-TOKEN'),
  };
}

async function requestJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json, text/plain, */*',
      cookie: auth.cookie,
      referer: `${BASE_URL}/umbraco`,
      origin: BASE_URL,
      'x-requested-with': 'XMLHttpRequest',
      'x-umb-xsrf-token': auth.xsrfToken,
    },
  });
  const text = (await response.text()).replace(/^\)\]\}',\s*/, '');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
  }
  return JSON.parse(text);
}

async function children(parentId) {
  const all = [];
  let page = 1;
  while (true) {
    const url = new URL(CHILDREN_API);
    Object.entries({
      id: parentId,
      includeProperties: '',
      pageNumber: page,
      pageSize: 100,
      orderBy: 'SortOrder',
      orderDirection: 'Ascending',
      orderBySystemField: 'true',
      filter: '',
    }).forEach(([key, value]) => url.searchParams.set(key, String(value)));
    const body = await requestJson(url);
    const items = body.items ?? body.Items ?? [];
    all.push(...items);
    const total = Number(body.totalItems ?? body.TotalItems ?? all.length);
    if (all.length >= total || !items.length) return all;
    page += 1;
  }
}

function matchesUser(node, requested) {
  const actual = clean(node?.name ?? node?.Name);
  const wanted = clean(String(requested).replace(/\([^)]*@[^)]*\)/g, ''));
  return actual === wanted;
}

function findUser(liveUsers, requested) {
  const wanted = clean(String(requested).replace(/\([^)]*@[^)]*\)/g, ''));
  const exact = liveUsers.find((node) => clean(node?.name ?? node?.Name) === wanted);
  if (exact) return { user: exact, ambiguous: [] };
  const prefix = liveUsers.filter((node) => {
    const actual = clean(node?.name ?? node?.Name);
    if (actual.startsWith(wanted)) return true;
    return wanted.startsWith(actual) && Math.abs(wanted.length - actual.length) <= 3;
  });
  if (prefix.length === 1) return { user: prefix[0], ambiguous: [] };
  return { user: null, ambiguous: prefix.map((node) => node?.name ?? node?.Name) };
}

function isSkipped(userDir, liveName) {
  const keys = new Set((config.skipProfileKeys || []).map(clean));
  return keys.has(clean(userDir)) || keys.has(clean(liveName));
}

function normalizeImage(value) {
  if (value == null || value === '') return '';
  if (typeof value === 'string') {
    const src = value.trim();
    if (!src) return '';
    return {
      focalPoint: { left: 0.5, top: 0.5 },
      src: src.startsWith('/') ? src : `/${src}`,
      crops: [],
    };
  }
  if (typeof value === 'object') {
    // Drop screenshot-only placeholders without a real media src.
    if (!value.src && value.presentInScreenshot) return '';
    return value;
  }
  return value;
}

function propsMap(detail) {
  const map = {};
  for (const prop of detail.properties ?? []) {
    const alias = prop.alias ?? prop.Alias;
    if (!alias) continue;
    let value = prop.value ?? prop.Value;
    if (IMAGE_ALIASES.has(alias)) {
      value = normalizeImage(value);
    }
    map[alias] = value;
  }
  return map;
}

function buildTabFile(tabName, name, aliases, props) {
  const out = {
    tab: tabName,
    name,
    tabsVisible: TABS_VISIBLE,
  };
  for (const alias of aliases) {
    out[alias] = props[alias] ?? '';
  }
  return out;
}

async function exportProfile(userDir, liveName, userId) {
  const detail = await requestJson(`${DETAIL_API}?id=${userId}`);
  const props = propsMap(detail);
  const name = detail.name || liveName;
  const outDir = path.join(
    config.outputDir || 'umbraco-data/users',
    userDir,
    'profile-info',
  );
  await mkdir(outDir, { recursive: true });

  const files = {
    'general.json': buildTabFile('General', name, FILE_ALIASES['general.json'], props),
    'subscription.json': buildTabFile(
      'Subscription',
      name,
      FILE_ALIASES['subscription.json'],
      props,
    ),
    'access-and-price.json': buildTabFile(
      'Access & Price',
      name,
      FILE_ALIASES['access-and-price.json'],
      props,
    ),
    'layout.json': buildTabFile('Layout', name, FILE_ALIASES['layout.json'], props),
    'notifications.json': buildTabFile(
      'Notifications',
      name,
      FILE_ALIASES['notifications.json'],
      props,
    ),
    'sitemap.json': buildTabFile('SiteMap', name, FILE_ALIASES['sitemap.json'], props),
    'seo.json': buildTabFile('SEO', name, FILE_ALIASES['seo.json'], props),
    'info.json': buildTabFile('Info', name, FILE_ALIASES['info.json'], props),
  };

  for (const [fileName, payload] of Object.entries(files)) {
    await writeFile(
      path.join(outDir, fileName),
      `${JSON.stringify(payload, null, 2)}\n`,
    );
  }

  const cover = files['layout.json'].coverImage;
  const logo = files['layout.json'].logoImage;
  const mobile = files['layout.json'].coverImageMobile;
  const imageSrcs = [cover, logo, mobile]
    .map((value) => (typeof value === 'object' ? value?.src : value))
    .filter((src) => typeof src === 'string' && src.trim());
  const downloaded = await downloadProfileImages(userDir, imageSrcs);

  return {
    coverSrc: typeof cover === 'object' ? cover?.src : cover || null,
    logoSrc: typeof logo === 'object' ? logo?.src : logo || null,
    headline: files['layout.json'].headline || null,
    downloadedImages: downloaded,
  };
}

function imageFileName(src) {
  try {
    const url = new URL(src, BASE_URL);
    return path.basename(url.pathname) || 'image';
  } catch {
    return path.basename(String(src).split('?')[0]) || 'image';
  }
}

async function downloadProfileImages(userDir, srcs) {
  const unique = [...new Set(srcs.map((src) => String(src).trim()).filter(Boolean))];
  const mediaDirs = [
    path.join(config.outputDir || 'umbraco-data/users', userDir, 'profile-info', 'media'),
    path.join(config.outputDir || 'umbraco-data/users', userDir, 'media'),
  ];
  for (const dir of mediaDirs) await mkdir(dir, { recursive: true });

  const results = [];
  for (const src of unique) {
    const url = src.startsWith('http') ? src : `${BASE_URL}${src.startsWith('/') ? src : `/${src}`}`;
    const fileName = imageFileName(src);
    try {
      const response = await fetch(url, {
        headers: {
          cookie: auth.cookie,
          referer: `${BASE_URL}/umbraco`,
          'x-umb-xsrf-token': auth.xsrfToken,
        },
      });
      if (!response.ok) {
        results.push({ src, status: response.status, error: true });
        continue;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      for (const dir of mediaDirs) {
        await writeFile(path.join(dir, fileName), buffer);
      }
      results.push({ src, fileName, bytes: buffer.length });
    } catch (error) {
      results.push({ src, error: error.message });
    }
  }
  return results;
}

async function localDirsWithProfileInfo() {
  const root = config.outputDir || 'umbraco-data/users';
  const entries = await readdir(root, { withFileTypes: true });
  const dirs = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      await access(path.join(root, entry.name, 'profile-info'));
      dirs.push(entry.name);
    } catch {
      // skip
    }
  }
  return dirs.sort((a, b) => a.localeCompare(b));
}

async function main() {
  const cookieText = await readFile(
    path.resolve(config.cookiesFile || 'migration/cookies.txt'),
    'utf8',
  );
  auth = parseCookies(cookieText);
  console.log(`Using cookies from ${config.cookiesFile || 'migration/cookies.txt'}`);

  const liveUsers = await children(USERS_ROOT_ID);
  const requested = Array.isArray(config.users) && config.users.length
    ? config.users.map((u) => (typeof u === 'string' ? u : u.name)).filter(Boolean)
    : await localDirsWithProfileInfo();

  const report = {
    startedAt: new Date().toISOString(),
    users: [],
    missingUsers: [],
  };

  for (const requestedName of requested) {
    const { user: live, ambiguous } = findUser(liveUsers, requestedName);
    if (!live) {
      const status = ambiguous.length ? 'ambiguous' : 'missing';
      report.missingUsers.push(requestedName);
      report.users.push({
        requestedName,
        status,
        ambiguous: ambiguous.length ? ambiguous : undefined,
      });
      console.log(`[${status}] ${requestedName}${ambiguous.length ? ` candidates=${ambiguous.join(', ')}` : ''}`);
      continue;
    }
    const liveName = live.name ?? live.Name;
    const userId = live.id ?? live.Id;
    // Prefer existing local dir name when request was a dir key
    const localDirs = await localDirsWithProfileInfo();
    const localHit =
      localDirs.find((d) => clean(d) === clean(requestedName)) ||
      localDirs.find((d) => clean(d) === clean(liveName)) ||
      safe(liveName);
    if (isSkipped(localHit, liveName)) {
      report.users.push({
        requestedName,
        liveName,
        userId,
        userDir: localHit,
        status: 'skipped',
        reason: 'skip list',
      });
      console.log(`[skipped] ${liveName}`);
      continue;
    }
    try {
      const meta = await exportProfile(localHit, liveName, userId);
      report.users.push({
        requestedName,
        liveName,
        userId,
        userDir: localHit,
        status: 'ok',
        ...meta,
      });
      console.log(
        `[ok] ${liveName} cover=${meta.coverSrc || '-'} logo=${meta.logoSrc || '-'}`,
      );
    } catch (error) {
      report.users.push({
        requestedName,
        liveName,
        userId,
        status: 'error',
        error: error.message,
      });
      console.log(`[error] ${liveName}: ${error.message}`);
    }
  }

  report.finishedAt = new Date().toISOString();
  await mkdir('umbraco-data/export-runs', { recursive: true });
  await writeFile(
    'umbraco-data/export-runs/profile-info-latest.json',
    `${JSON.stringify(report, null, 2)}\n`,
  );
  const ok = report.users.filter((u) => u.status === 'ok').length;
  const withCover = report.users.filter((u) => u.coverSrc).length;
  console.log(
    `Done: ${ok} profiles exported, ${withCover} with cover, ${report.missingUsers.length} missing`,
  );
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

#!/usr/bin/env node
/**
 * Refresh umbraco-data/cms-members.json from the Umbraco backoffice Member API.
 *
 * Usage:
 *   1) Put cookies in migration/cookies.txt
 *   2) node migration/export-cms-members.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import config from './config.mjs';

const BASE_URL = 'https://kiibee.dk';
const MEMBER_LIST_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Member/GetPagedResults`;
const MEMBER_BY_ID_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Member/GetById`;

function parseCookies(text) {
  const required = ['UMB_UCONTEXT', 'UMB-XSRF-TOKEN', 'UMB-XSRF-V'];
  const optional = ['UMB_UCONTEXT_C'];
  const wanted = new Set([...required, ...optional]);
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
  const missing = required.filter((name) => !values.get(name));
  if (missing.length) {
    throw new Error(`Missing cookies: ${missing.join(', ')}`);
  }
  return {
    cookie: [...wanted]
      .filter((name) => values.get(name))
      .map((name) => `${name}=${values.get(name)}`)
      .join('; '),
    xsrfToken: values.get('UMB-XSRF-TOKEN'),
  };
}

async function requestJson(url, auth) {
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

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function memberEmail(detail) {
  const props = detail?.properties ?? detail?.Properties ?? [];
  for (const prop of props) {
    const alias = prop?.alias ?? prop?.Alias;
    if (alias === 'Email' || alias === 'email') {
      return String(prop?.value ?? prop?.Value ?? '').trim();
    }
  }
  return String(
    firstDefined(detail?.email, detail?.Email, detail?.login, detail?.Login, ''),
  ).trim();
}

function memberLogin(detail) {
  return String(
    firstDefined(
      detail?.username,
      detail?.Username,
      detail?.loginName,
      detail?.LoginName,
      detail?.login,
      detail?.Login,
      '',
    ),
  ).trim();
}

async function main() {
  const cookieText = await readFile(
    path.resolve(config.cookiesFile || 'migration/cookies.txt'),
    'utf8',
  );
  const auth = parseCookies(cookieText);
  console.log(`Using cookies from ${config.cookiesFile || 'migration/cookies.txt'}`);

  const pageSize = 100;
  let pageNumber = 1;
  const members = [];
  const seen = new Set();

  while (true) {
    const url = new URL(MEMBER_LIST_API);
    url.searchParams.set('pageNumber', String(pageNumber));
    url.searchParams.set('pageSize', String(pageSize));
    url.searchParams.set('orderBy', 'Name');
    url.searchParams.set('orderDirection', 'Ascending');
    url.searchParams.set('filter', '');
    url.searchParams.set('memberTypeAlias', '');
    const payload = await requestJson(url, auth);
    const items = payload.items ?? payload.Items ?? [];
    if (!items.length) break;

    for (const item of items) {
      const id = Number(firstDefined(item.id, item.Id));
      if (!Number.isFinite(id) || seen.has(id)) continue;
      seen.add(id);

      let detail = item;
      try {
        detail = await requestJson(`${MEMBER_BY_ID_API}?id=${id}`, auth);
      } catch {
        // Fall back to list row fields.
      }

      const email = memberEmail(detail) || memberEmail(item);
      if (!email || !email.includes('@')) continue;

      members.push({
        nodeId: id,
        Email: email,
        LoginName: memberLogin(detail) || memberLogin(item) || email,
        key: firstDefined(detail.key, detail.Key, item.key, item.Key, null),
      });
    }

    const total = Number(payload.totalItems ?? payload.TotalItems ?? members.length);
    console.log(`Fetched page ${pageNumber}: ${members.length}/${total} members with email`);
    if (members.length >= total || items.length < pageSize) break;
    pageNumber += 1;
  }

  members.sort((a, b) => a.nodeId - b.nodeId);
  const outPath = 'umbraco-data/cms-members.json';
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(
    outPath,
    `${JSON.stringify({ exportedAt: new Date().toISOString(), cmsMember: members }, null, 2)}\n`,
  );
  console.log(`Wrote ${members.length} members to ${outPath}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

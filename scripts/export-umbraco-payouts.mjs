#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const BASE_URL = "https://kiibee.dk";
const CHILDREN_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Content/GetChildren`;
const CONTENT_DETAIL_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Content/GetById`;
const MEDIA_DETAIL_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Media/GetById`;

const DEFAULT_INCLUDE_PROPERTIES = ["amount", "isPaid", "createDate"];
const INVOICE_ALIAS_PATTERN =
  /(invoice|invoic|credit|creditno|creditnote|receipt|pdf|file|document|link|url|faktura|kredit)/i;
const INVOICE_URL_PATTERN =
  /(invoice|invoic|credit|receipt|pdf|faktura|kredit|nota|note)/i;

const PAYOUT_CSV_COLUMNS = [
  "id",
  "key",
  "udi",
  "name",
  "amount",
  "amountNumber",
  "isPaid",
  "createDate",
  "payoutCreateDate",
  "publicPayoutUrl",
  "invoiceMatchStatus",
  "invoiceUrl",
  "invoiceUrls",
  "invoiceUdis",
  "candidateInvoiceProperties",
];

async function readStdin() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input.trim();
}

function parseCookieValue(cookie, name) {
  const part = cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${name}=`));

  return part ? part.slice(name.length + 1) : "";
}

async function readConfig() {
  const shouldReadStdin = !process.stdin.isTTY || process.argv.includes("--stdin");
  const input =
    process.env.UMBRACO_PAYOUT_EXPORT_CONFIG ||
    process.env.UMBRACO_EXPORT_CONFIG ||
    (shouldReadStdin ? await readStdin() : "");

  if (!input) {
    throw new Error("Pass a JSON config object on stdin or UMBRACO_PAYOUT_EXPORT_CONFIG.");
  }

  const config = JSON.parse(input);
  const cookie = config.cookie || "";
  const xsrfToken = config.xsrfToken || parseCookieValue(cookie, "UMB-XSRF-TOKEN");

  if (!cookie) {
    throw new Error("Config is missing cookie.");
  }

  if (!xsrfToken) {
    throw new Error("Config is missing xsrfToken and no UMB-XSRF-TOKEN cookie was found.");
  }

  return {
    cookie,
    xsrfToken,
    parentId: Number(config.parentId || 1882),
    pageSize: Number(config.pageSize || 100),
    orderBy: config.orderBy || "createDate",
    orderDirection: config.orderDirection || "Descending",
    orderBySystemField: config.orderBySystemField ?? true,
    outDir: config.outDir || "umbraco-data/users/Uffe_Holm/payouts",
    includeProperties: Array.isArray(config.includeProperties)
      ? config.includeProperties
      : DEFAULT_INCLUDE_PROPERTIES,
    fetchItemDetails: config.fetchItemDetails ?? true,
    resolveInvoiceLinks: config.resolveInvoiceLinks ?? true,
    detailConcurrency: Number(config.detailConcurrency || 8),
  };
}

function stripJsonPrefix(text) {
  return text.replace(/^\)\]\}',\s*/, "");
}

async function requestJson(url, config) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json, text/plain, */*",
      cookie: config.cookie,
      pragma: "no-cache",
      referer: `${BASE_URL}/umbraco`,
      "cache-control": "no-cache",
      "x-umb-xsrf-token": config.xsrfToken,
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    },
  });
  const body = stripJsonPrefix(await response.text());

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${body.slice(0, 500)}`);
  }

  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${url}: ${error.message}`);
  }
}

function getPagedItems(payload) {
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.Items)) return payload.Items;
  if (Array.isArray(payload)) return payload;
  return [];
}

function getTotalItems(payload, fallback) {
  return Number(
    payload?.totalItems ??
      payload?.TotalItems ??
      payload?.total ??
      payload?.Total ??
      fallback,
  );
}

function propertyAlias(property) {
  return (
    property?.alias ||
    property?.Alias ||
    property?.propertyTypeAlias ||
    property?.PropertyTypeAlias ||
    property?.key ||
    property?.Key ||
    ""
  );
}

function propertyValue(property) {
  if (!property || typeof property !== "object") return "";
  if (Object.hasOwn(property, "value")) return property.value;
  if (Object.hasOwn(property, "Value")) return property.Value;
  if (Object.hasOwn(property, "values")) return property.values;
  if (Object.hasOwn(property, "Values")) return property.Values;
  return "";
}

function flattenProperties(node) {
  const values = {};

  function addProperties(properties) {
    if (Array.isArray(properties)) {
      for (const property of properties) {
        const alias = propertyAlias(property);
        if (alias) {
          values[alias] = propertyValue(property);
        }
      }
      return;
    }

    if (properties && typeof properties === "object") {
      for (const [alias, value] of Object.entries(properties)) {
        values[alias] = value;
      }
    }
  }

  addProperties(node?.properties);
  addProperties(node?.Properties);

  for (const tab of node?.tabs || node?.Tabs || []) {
    addProperties(tab?.properties);
    addProperties(tab?.Properties);
  }

  for (const variant of node?.variants || node?.Variants || []) {
    addProperties(variant?.properties);
    addProperties(variant?.Properties);
    for (const tab of variant?.tabs || variant?.Tabs || []) {
      addProperties(tab?.properties);
      addProperties(tab?.Properties);
    }
  }

  return values;
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    return ["1", "true", "yes", "on", "paid"].includes(value.trim().toLowerCase());
  }
  return false;
}

function toAmountNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const text = String(value || "")
    .replace(/\s/g, "")
    .replace(/[^\d,.-]/g, "")
    .replace(",", ".");
  const number = Number(text);
  return Number.isFinite(number) ? number : 0;
}

function guidToUdi(key, entityType = "document") {
  if (!key) return "";
  return `umb://${entityType}/${String(key).replaceAll("-", "").toLowerCase()}`;
}

function udiEntityType(udi) {
  const match = String(udi || "").match(/^umb:\/\/(document|media)\//i);
  return match ? match[1].toLowerCase() : "document";
}

function udiToKey(udi) {
  const value = String(udi || "")
    .replace(/^umb:\/\/(document|media)\//i, "")
    .toLowerCase();

  if (value.length !== 32) return "";

  return [
    value.slice(0, 8),
    value.slice(8, 12),
    value.slice(12, 16),
    value.slice(16, 20),
    value.slice(20),
  ].join("-");
}

function normalizeUdi(value, fallbackEntityType = "document") {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";

  const typedMatch = text.match(/^umb:\/\/(document|media)\/([a-f0-9-]{32,36})$/i);
  if (typedMatch) {
    const key = typedMatch[2].replaceAll("-", "");
    return key.length === 32 ? `umb://${typedMatch[1].toLowerCase()}/${key}` : "";
  }

  const key = text.replaceAll("-", "");
  return /^[a-f0-9]{32}$/.test(key) ? `umb://${fallbackEntityType}/${key}` : "";
}

function contentId(node) {
  return firstDefined(node?.id, node?.Id, node?.contentId, node?.ContentId, null);
}

function contentKey(node) {
  return firstDefined(node?.key, node?.Key, node?.uid, node?.Uid, "");
}

function contentName(node) {
  return firstDefined(node?.name, node?.Name, "");
}

function contentUrls(node) {
  return toArray(firstDefined(node?.urls, node?.Urls, []));
}

function contentCreateDate(node) {
  return firstDefined(node?.createDate, node?.CreateDate, "");
}

function contentUpdateDate(node) {
  return firstDefined(node?.updateDate, node?.UpdateDate, "");
}

function trimTrailingUrlPunctuation(value) {
  return String(value || "").replace(/[),.;\]}]+$/g, "");
}

function absoluteUrl(value) {
  const url = trimTrailingUrlPunctuation(value);
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return url;
}

function uniqueStrings(values) {
  return Array.from(new Set(values.map((value) => String(value || "").trim()).filter(Boolean)));
}

function parseJsonLike(value) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (!/^[\[{]/.test(text)) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractUrls(value) {
  const urls = [];
  const visited = new Set();

  function visit(input) {
    if (input === undefined || input === null || input === "") return;

    if (Array.isArray(input)) {
      for (const item of input) visit(item);
      return;
    }

    if (input && typeof input === "object") {
      if (visited.has(input)) return;
      visited.add(input);
      for (const value of Object.values(input)) visit(value);
      return;
    }

    const text = String(input).trim();
    if (!text) return;

    const parsed = parseJsonLike(text);
    if (parsed) {
      visit(parsed);
      return;
    }

    const matches =
      text.match(
        /(https?:\/\/[^\s"'<>]+|\/\/[^\s"'<>]+|\/media\/[^\s"'<>]+|\/[^\s"'<>]+\.(?:pdf|docx?|xlsx?|csv)(?:\?[^\s"'<>]*)?)/gi,
      ) || [];

    urls.push(...matches.map(absoluteUrl));
  }

  visit(value);
  return uniqueStrings(urls);
}

function extractUdis(value) {
  const udis = new Set();
  const visited = new Set();

  function visit(input) {
    if (input === undefined || input === null || input === "") return;

    if (Array.isArray(input)) {
      for (const item of input) visit(item);
      return;
    }

    if (input && typeof input === "object") {
      if (visited.has(input)) return;
      visited.add(input);

      for (const key of ["udi", "Udi", "key", "Key", "value", "Value"]) {
        if (Object.hasOwn(input, key)) visit(input[key]);
      }

      for (const value of Object.values(input)) {
        if (Array.isArray(value) || (value && typeof value === "object")) visit(value);
      }
      return;
    }

    const text = String(input).trim();
    if (!text) return;

    const parsed = parseJsonLike(text);
    if (parsed) {
      visit(parsed);
      return;
    }

    const typedMatches = text.match(/umb:\/\/(document|media)\/[a-f0-9-]{32,36}/gi) || [];
    for (const match of typedMatches) {
      const udi = normalizeUdi(match);
      if (udi) udis.add(udi);
    }

    if (typedMatches.length === 0) {
      for (const part of text.split(/[,\s|;]+/)) {
        const udi = normalizeUdi(part);
        if (udi) udis.add(udi);
      }
    }
  }

  visit(value);
  return Array.from(udis);
}

function previewValue(value) {
  let text = "";
  if (typeof value === "string") {
    text = value;
  } else if (value !== undefined && value !== null) {
    text = JSON.stringify(value);
  }

  return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

function invoiceProperties(properties) {
  const candidates = [];

  for (const [alias, value] of Object.entries(properties)) {
    const urls = extractUrls(value);
    const udis = extractUdis(value);
    const aliasLooksRelevant = INVOICE_ALIAS_PATTERN.test(alias);
    const urlsLookRelevant = urls.some((url) => INVOICE_URL_PATTERN.test(url));

    if (aliasLooksRelevant || urlsLookRelevant || (aliasLooksRelevant && udis.length > 0)) {
      candidates.push({
        alias,
        valuePreview: previewValue(value),
        urls,
        udis,
      });
    }
  }

  return candidates;
}

function normalizeParent(parent) {
  if (!parent) {
    return {
      id: null,
      key: "",
      udi: "",
      name: "",
      contentTypeAlias: "",
      published: false,
      hasPublishedVersion: false,
      urls: [],
      path: "",
      properties: {},
    };
  }

  const properties = flattenProperties(parent);
  const key = String(contentKey(parent)).toLowerCase();

  return {
    id: contentId(parent),
    key,
    udi: guidToUdi(key),
    name: contentName(parent),
    contentTypeAlias: firstDefined(parent?.contentTypeAlias, parent?.ContentTypeAlias, ""),
    published: toBoolean(firstDefined(parent?.published, parent?.Published)),
    hasPublishedVersion: toBoolean(
      firstDefined(parent?.hasPublishedVersion, parent?.HasPublishedVersion),
    ),
    urls: contentUrls(parent),
    path: firstDefined(parent?.path, parent?.Path, ""),
    properties,
  };
}

function normalizeLinkedEntity(udi, node) {
  const properties = flattenProperties(node);
  const key = String(contentKey(node) || udiToKey(udi)).toLowerCase();
  const entityType = udiEntityType(udi);
  const urls = uniqueStrings([
    ...contentUrls(node).map(absoluteUrl),
    ...extractUrls(properties),
  ]);

  return {
    udi,
    key: key || udiToKey(udi),
    entityType,
    resolved: Boolean(contentId(node) || contentName(node) || contentKey(node)),
    id: contentId(node),
    name: contentName(node),
    contentTypeAlias: firstDefined(node?.contentTypeAlias, node?.ContentTypeAlias, ""),
    createDate: contentCreateDate(node),
    updateDate: contentUpdateDate(node),
    urls,
    properties,
  };
}

function normalizePayout(child, detail) {
  const source = detail || child;
  const properties = {
    ...flattenProperties(child),
    ...flattenProperties(detail),
  };
  const key = String(firstDefined(contentKey(source), contentKey(child), "")).toLowerCase();
  const candidates = invoiceProperties(properties);
  const directInvoiceUrls = uniqueStrings(candidates.flatMap((candidate) => candidate.urls));
  const candidateInvoiceUrls = directInvoiceUrls;
  const invoiceUdis = uniqueStrings(candidates.flatMap((candidate) => candidate.udis));
  const amount = String(properties.amount ?? "");
  const payoutCreateDate = properties.createDate || contentCreateDate(child);
  const urls = contentUrls(source).length > 0 ? contentUrls(source) : contentUrls(child);
  const publicPayoutUrls = uniqueStrings(urls.map(absoluteUrl));

  return {
    id: contentId(source) ?? contentId(child),
    key,
    udi: guidToUdi(key),
    name: contentName(source) || contentName(child),
    editUrl: `${BASE_URL}/umbraco#/content/content/edit/${contentId(source) ?? contentId(child)}`,
    contentTypeAlias: firstDefined(
      source?.contentTypeAlias,
      source?.ContentTypeAlias,
      child?.contentTypeAlias,
      child?.ContentTypeAlias,
      "",
    ),
    published: toBoolean(firstDefined(child?.published, child?.Published)),
    hasPublishedVersion: toBoolean(
      firstDefined(child?.hasPublishedVersion, child?.HasPublishedVersion),
    ),
    createDate: firstDefined(contentCreateDate(source), contentCreateDate(child), ""),
    updateDate: firstDefined(contentUpdateDate(source), contentUpdateDate(child), ""),
    parentId: firstDefined(source?.parentId, source?.ParentId, child?.parentId, child?.ParentId, null),
    path: firstDefined(source?.path, source?.Path, child?.path, child?.Path, ""),
    sortOrder: firstDefined(
      source?.sortOrder,
      source?.SortOrder,
      child?.sortOrder,
      child?.SortOrder,
      null,
    ),
    urls,
    publicPayoutUrls,
    publicPayoutUrl: publicPayoutUrls[0] || "",
    amount,
    amountNumber: toAmountNumber(amount),
    isPaid: toBoolean(properties.isPaid),
    payoutCreateDate,
    candidateInvoiceProperties: candidates.map((candidate) => candidate.alias),
    candidateInvoiceUrls,
    directInvoiceUrls,
    invoiceUdis,
    invoiceEntities: [],
    invoiceUrls: uniqueStrings([...directInvoiceUrls, ...publicPayoutUrls]),
    invoiceUrl: directInvoiceUrls[0] || publicPayoutUrls[0] || "",
    invoiceMatchStatus:
      directInvoiceUrls.length > 0 ? "matched-direct-url" : "matched-public-payout-url",
    properties,
  };
}

async function fetchChildren(config) {
  const pages = [];
  const children = [];
  let totalItems = 0;
  let pageNumber = 1;
  let totalPages = 1;

  do {
    const url = new URL(CHILDREN_API);
    url.searchParams.set("id", String(config.parentId));
    url.searchParams.set("includeProperties", config.includeProperties.join(","));
    url.searchParams.set("pageNumber", String(pageNumber));
    url.searchParams.set("pageSize", String(config.pageSize));
    url.searchParams.set("orderBy", config.orderBy);
    url.searchParams.set("orderDirection", config.orderDirection);
    url.searchParams.set("orderBySystemField", String(config.orderBySystemField));
    url.searchParams.set("filter", "");

    const payload = await requestJson(url, config);
    const items = getPagedItems(payload);
    children.push(...items);
    pages.push({
      pageNumber,
      itemCount: items.length,
      totalItems: getTotalItems(payload, children.length),
    });

    totalItems = getTotalItems(payload, children.length);
    totalPages = totalItems > 0 ? Math.ceil(totalItems / config.pageSize) : 1;
    pageNumber += 1;
  } while (pageNumber <= totalPages);

  return { children, pages, totalItems };
}

async function fetchDetail(idOrUdi, config, api = CONTENT_DETAIL_API) {
  const url = new URL(api);
  url.searchParams.set("id", String(idOrUdi));
  return requestJson(url, config);
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function fetchItemDetails(children, config) {
  const details = new Map();
  const errors = [];

  if (!config.fetchItemDetails) {
    return { details, errors };
  }

  await mapLimit(children, Math.max(1, config.detailConcurrency), async (child) => {
    const id = contentId(child);
    if (!id) return;

    try {
      details.set(id, await fetchDetail(id, config));
    } catch (error) {
      errors.push({
        id,
        name: contentName(child),
        phase: "itemDetail",
        error: error.message,
      });
    }
  });

  return { details, errors };
}

async function fetchLinkedEntity(udi, config) {
  const entityType = udiEntityType(udi);
  const firstApi = entityType === "media" ? MEDIA_DETAIL_API : CONTENT_DETAIL_API;
  const fallbackApi = entityType === "media" ? CONTENT_DETAIL_API : MEDIA_DETAIL_API;
  const errors = [];

  for (const api of [firstApi, fallbackApi]) {
    try {
      return normalizeLinkedEntity(udi, await fetchDetail(udi, config, api));
    } catch (error) {
      errors.push({ api, error: error.message });
    }
  }

  throw new Error(errors.map((error) => `${error.api}: ${error.error}`).join(" | "));
}

async function resolveInvoiceEntities(payouts, config) {
  const invoiceEntityByUdi = new Map();
  const errors = [];
  const udis = uniqueStrings(payouts.flatMap((payout) => payout.invoiceUdis));

  if (!config.resolveInvoiceLinks) {
    return { invoiceEntityByUdi, errors, udis };
  }

  await mapLimit(udis, Math.max(1, config.detailConcurrency), async (udi) => {
    try {
      invoiceEntityByUdi.set(udi, await fetchLinkedEntity(udi, config));
    } catch (error) {
      errors.push({
        udi,
        key: udiToKey(udi),
        entityType: udiEntityType(udi),
        phase: "invoiceEntity",
        error: error.message,
      });
    }
  });

  return { invoiceEntityByUdi, errors, udis };
}

function applyInvoiceResolution(payouts, invoiceEntityByUdi) {
  return payouts.map((payout) => {
    const invoiceEntities = payout.invoiceUdis
      .map((udi) => invoiceEntityByUdi.get(udi))
      .filter(Boolean);
    const linkedInvoiceUrls = uniqueStrings(invoiceEntities.flatMap((entity) => entity.urls));
    const invoiceUrls = uniqueStrings([
      ...payout.directInvoiceUrls,
      ...linkedInvoiceUrls,
      ...payout.publicPayoutUrls,
    ]);
    let invoiceMatchStatus = "unmatched";

    if (payout.directInvoiceUrls.length > 0 && linkedInvoiceUrls.length > 0) {
      invoiceMatchStatus = "matched-direct-and-linked";
    } else if (payout.directInvoiceUrls.length > 0) {
      invoiceMatchStatus = "matched-direct-url";
    } else if (linkedInvoiceUrls.length > 0) {
      invoiceMatchStatus = "matched-linked-entity";
    } else if (payout.invoiceUdis.length > 0) {
      invoiceMatchStatus = "linked-entity-without-url";
    } else if (payout.publicPayoutUrls.length > 0) {
      invoiceMatchStatus = "matched-public-payout-url";
    }

    return {
      ...payout,
      invoiceEntities: invoiceEntities.map((entity) => ({
        udi: entity.udi,
        key: entity.key,
        entityType: entity.entityType,
        resolved: entity.resolved,
        id: entity.id,
        name: entity.name,
        contentTypeAlias: entity.contentTypeAlias,
        urls: entity.urls,
      })),
      invoiceUrls,
      invoiceUrl: invoiceUrls[0] || "",
      invoiceMatchStatus,
    };
  });
}

function buildInvoiceMatch(payouts, invoiceEntityByUdi, invoiceErrors) {
  return {
    matched: payouts.filter((payout) => payout.invoiceUrls.length > 0),
    unmatched: payouts.filter((payout) => payout.invoiceUrls.length === 0),
    linkedEntities: Array.from(invoiceEntityByUdi.values()).map((entity) => ({
      udi: entity.udi,
      key: entity.key,
      entityType: entity.entityType,
      resolved: entity.resolved,
      id: entity.id,
      name: entity.name,
      contentTypeAlias: entity.contentTypeAlias,
      urls: entity.urls,
    })),
    errors: invoiceErrors,
  };
}

function csvValue(value) {
  let text = "";
  if (Array.isArray(value)) {
    text = value.join(" | ");
  } else if (value && typeof value === "object") {
    text = JSON.stringify(value);
  } else if (value !== undefined && value !== null) {
    text = String(value);
  }

  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function toCsv(items, columns) {
  return [
    columns.join(","),
    ...items.map((item) => columns.map((column) => csvValue(item[column])).join(",")),
  ].join("\n");
}

async function writeJson(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

async function main() {
  const config = await readConfig();
  const outDir = path.resolve(config.outDir);
  await mkdir(outDir, { recursive: true });

  const errors = [];
  let parent = null;
  try {
    parent = await fetchDetail(config.parentId, config);
  } catch (error) {
    errors.push({
      id: config.parentId,
      name: "parent",
      phase: "parentDetail",
      error: error.message,
    });
  }

  const { children, pages, totalItems } = await fetchChildren(config);
  const itemDetails = await fetchItemDetails(children, config);
  errors.push(...itemDetails.errors);

  const unresolvedPayouts = children.map((child) =>
    normalizePayout(child, itemDetails.details.get(contentId(child))),
  );
  const invoiceResolution = await resolveInvoiceEntities(unresolvedPayouts, config);
  errors.push(...invoiceResolution.errors);
  const payouts = applyInvoiceResolution(
    unresolvedPayouts,
    invoiceResolution.invoiceEntityByUdi,
  );
  const invoiceMatch = buildInvoiceMatch(
    payouts,
    invoiceResolution.invoiceEntityByUdi,
    invoiceResolution.errors,
  );
  const parentSummary = normalizeParent(parent);
  const paidPayouts = payouts.filter((payout) => payout.isPaid).length;
  const totalAmount = payouts.reduce((total, payout) => total + payout.amountNumber, 0);
  const index = {
    exportedAt: new Date().toISOString(),
    source: {
      parentEditUrl: `${BASE_URL}/umbraco#/content/content/edit/${config.parentId}`,
      childrenApi: CHILDREN_API,
      contentDetailApi: CONTENT_DETAIL_API,
      mediaDetailApi: MEDIA_DETAIL_API,
      parentId: config.parentId,
      includeProperties: config.includeProperties,
      orderBy: config.orderBy,
      orderDirection: config.orderDirection,
      orderBySystemField: config.orderBySystemField,
    },
    parent: parentSummary,
    counts: {
      totalItemsFromApi: totalItems,
      childrenFetched: children.length,
      detailsFetched: itemDetails.details.size,
      detailErrors: itemDetails.errors.length,
      paidPayouts,
      unpaidPayouts: payouts.length - paidPayouts,
      totalAmount,
      entriesWithCandidateInvoiceProperties: payouts.filter(
        (payout) => payout.candidateInvoiceProperties.length > 0,
      ).length,
      entriesWithPublicPayoutUrl: payouts.filter((payout) => payout.publicPayoutUrls.length > 0)
        .length,
      entriesWithInvoiceLink: invoiceMatch.matched.length,
      entriesWithoutInvoiceLink: invoiceMatch.unmatched.length,
      uniqueInvoiceUdis: invoiceResolution.udis.length,
      invoiceEntitiesResolved: invoiceResolution.invoiceEntityByUdi.size,
      invoiceEntityErrors: invoiceResolution.errors.length,
    },
    pagination: pages,
    files: {
      items: "items.json",
      itemsCsv: "items.csv",
      invoiceMatch: "invoice-match.json",
      errors: "errors.json",
    },
    dataQuality: {
      matchedBy:
        "invoice-like payout properties matched by direct URL or linked Umbraco document/media UDI, with the public payout URL used as the invoice link fallback",
      note:
        "The export uses authenticated Umbraco backoffice JSON APIs. Credentials are read from stdin/env and are not written to disk.",
    },
  };

  await writeJson(path.join(outDir, "index.json"), index);
  await writeJson(path.join(outDir, "items.json"), payouts);
  await writeFile(path.join(outDir, "items.csv"), `${toCsv(payouts, PAYOUT_CSV_COLUMNS)}\n`);
  await writeJson(path.join(outDir, "invoice-match.json"), invoiceMatch);
  await writeJson(path.join(outDir, "errors.json"), {
    invoiceResolveErrors: {
      count: invoiceResolution.errors.length,
      sample: invoiceResolution.errors.slice(0, 50),
    },
    otherErrors: {
      count: errors.length - invoiceResolution.errors.length,
      sample: errors
        .filter((error) => error.phase !== "invoiceEntity")
        .slice(0, 20),
    },
  });

  console.log(
    JSON.stringify(
      {
        outDir,
        payouts: payouts.length,
        paidPayouts,
        totalAmount,
        detailsFetched: itemDetails.details.size,
        entriesWithInvoiceLink: invoiceMatch.matched.length,
        entriesWithoutInvoiceLink: invoiceMatch.unmatched.length,
        uniqueInvoiceUdis: invoiceResolution.udis.length,
        invoiceEntityErrors: invoiceResolution.errors.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const BASE_URL = "https://kiibee.dk";
const CHILDREN_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Content/GetChildren`;
const DETAIL_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Content/GetById`;

const DEFAULT_INCLUDE_PROPERTIES = [
  "fullName",
  "email",
  "isPurchase",
  "downloads",
  "streams",
  "createDate",
];

const MEDIA_INCLUDE_PROPERTIES = [
  "title",
  "type",
  "rawFile",
  "videoID",
  "videoStatus",
  "videoSize",
  "videoThumbnailURL",
  "videoDownloadURL",
  "trailer",
  "webContentURL",
  "thumbnail",
  "productLink",
  "access",
  "rentalPrice",
  "purchasePrice",
  "hidePlay",
  "hideDownload",
];

const PURCHASE_CSV_COLUMNS = [
  "id",
  "key",
  "udi",
  "name",
  "fullName",
  "email",
  "isPurchase",
  "createDate",
  "orderCreateDate",
  "downloads",
  "streams",
  "downloadMediaCount",
  "streamMediaCount",
  "mediaCount",
  "mediaNames",
  "mediaUrls",
  "videoDownloadURLs",
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
  const input =
    process.env.UMBRACO_PURCHASE_EXPORT_CONFIG ||
    process.env.UMBRACO_EXPORT_CONFIG ||
    (process.stdin.isTTY ? "" : await readStdin());

  if (!input) {
    throw new Error("Pass a JSON config object on stdin or UMBRACO_PURCHASE_EXPORT_CONFIG.");
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
    parentId: Number(config.parentId || 1883),
    pageSize: Number(config.pageSize || 100),
    orderBy: config.orderBy || "createDate",
    orderDirection: config.orderDirection || "Descending",
    orderBySystemField: config.orderBySystemField ?? true,
    outDir: config.outDir || "umbraco-data/users/Uffe_Holm/purchases",
    includeProperties: Array.isArray(config.includeProperties)
      ? config.includeProperties
      : DEFAULT_INCLUDE_PROPERTIES,
    mediaIncludeProperties: Array.isArray(config.mediaIncludeProperties)
      ? config.mediaIncludeProperties
      : MEDIA_INCLUDE_PROPERTIES,
    mediaCachePaths: Array.isArray(config.mediaCachePaths)
      ? config.mediaCachePaths
      : ["umbraco-data/users/Uffe_Holm/stats/media.json"],
    resolveMedia: config.resolveMedia ?? true,
    fetchItemDetails: config.fetchItemDetails ?? true,
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
    return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
  }
  return false;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function guidToUdi(key) {
  if (!key) return "";
  return `umb://document/${String(key).replaceAll("-", "").toLowerCase()}`;
}

function udiToKey(udi) {
  const value = String(udi || "")
    .replace("umb://document/", "")
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

function normalizeUdi(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";

  if (text.startsWith("umb://document/")) {
    const key = text.replace("umb://document/", "").replaceAll("-", "");
    return key.length === 32 ? `umb://document/${key}` : "";
  }

  const key = text.replaceAll("-", "");
  return /^[a-f0-9]{32}$/.test(key) ? `umb://document/${key}` : "";
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

function extractUdis(value) {
  const udis = new Set();

  function visit(input) {
    if (input === undefined || input === null || input === "") return;

    if (Array.isArray(input)) {
      for (const item of input) visit(item);
      return;
    }

    if (typeof input === "object") {
      for (const key of ["udi", "Udi", "key", "Key", "value", "Value"]) {
        if (Object.hasOwn(input, key)) visit(input[key]);
      }

      for (const value of Object.values(input)) {
        if (Array.isArray(value) || (value && typeof value === "object")) {
          visit(value);
        }
      }
      return;
    }

    const text = String(input).trim();
    if (!text) return;

    if (/^[\[{]/.test(text)) {
      try {
        visit(JSON.parse(text));
        return;
      } catch {
        // Some Umbraco property editors store compact delimited text.
      }
    }

    const udiMatches = text.match(/umb:\/\/document\/[a-f0-9-]{32,36}/gi) || [];
    for (const match of udiMatches) {
      const udi = normalizeUdi(match);
      if (udi) udis.add(udi);
    }

    if (udiMatches.length === 0) {
      for (const part of text.split(/[,\s|;]+/)) {
        const udi = normalizeUdi(part);
        if (udi) udis.add(udi);
      }
    }
  }

  visit(value);
  return Array.from(udis);
}

function summarizeMedia(media) {
  return {
    udi: media.udi,
    key: media.key,
    resolved: Boolean(media.resolved),
    id: media.id ?? null,
    name: media.name || "",
    title: media.title || media.name || "",
    urls: media.urls || [],
    contentTypeAlias: media.contentTypeAlias || "",
    videoID: media.videoID || "",
    videoStatus: media.videoStatus || "",
    videoThumbnailURL: media.videoThumbnailURL || "",
    videoDownloadURL: media.videoDownloadURL || "",
    rawFile: media.rawFile || "",
    webContentURL: media.webContentURL || "",
    thumbnail: media.thumbnail || "",
    purchasePrice: media.purchasePrice || "",
    rentalPrice: media.rentalPrice || "",
  };
}

function normalizeMedia(node, fallbackUdi = "") {
  const properties = flattenProperties(node);
  const key = String(contentKey(node) || udiToKey(fallbackUdi)).toLowerCase();
  const udi = normalizeUdi(fallbackUdi) || guidToUdi(key);

  return {
    udi,
    key: key || udiToKey(udi),
    resolved: Boolean(contentId(node) || contentName(node) || contentKey(node)),
    id: contentId(node),
    name: contentName(node),
    contentTypeAlias: firstDefined(node?.contentTypeAlias, node?.ContentTypeAlias, ""),
    published: toBoolean(firstDefined(node?.published, node?.Published)),
    hasPublishedVersion: toBoolean(
      firstDefined(node?.hasPublishedVersion, node?.HasPublishedVersion),
    ),
    createDate: contentCreateDate(node),
    updateDate: contentUpdateDate(node),
    parentId: firstDefined(node?.parentId, node?.ParentId, null),
    path: firstDefined(node?.path, node?.Path, ""),
    sortOrder: firstDefined(node?.sortOrder, node?.SortOrder, null),
    urls: contentUrls(node),
    properties,
    type: properties.type || [],
    rawFile: properties.rawFile || "",
    videoID: properties.videoID || "",
    videoStatus: properties.videoStatus || "",
    videoSize: properties.videoSize || "",
    videoThumbnailURL: properties.videoThumbnailURL || "",
    videoDownloadURL: properties.videoDownloadURL || "",
    trailer: properties.trailer || "",
    webContentURL: properties.webContentURL || "",
    hidden: toBoolean(properties.hidden),
    title: properties.title || contentName(node),
    thumbnail: properties.thumbnail || "",
    productLink: properties.productLink || "",
    access: properties.access || [],
    rentalPrice: properties.rentalPrice || "",
    purchasePrice: properties.purchasePrice || "",
    hidePlay: toBoolean(properties.hidePlay),
    hideDownload: toBoolean(properties.hideDownload),
  };
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

function normalizePurchase(child, detail, mediaByUdi) {
  const source = detail || child;
  const properties = {
    ...flattenProperties(child),
    ...flattenProperties(detail),
  };
  const key = String(firstDefined(contentKey(source), contentKey(child), "")).toLowerCase();
  const downloadUdis = extractUdis(properties.downloads);
  const streamUdis = extractUdis(properties.streams);
  const directMediaUdis = extractUdis(properties.media);
  const mediaUdis = Array.from(new Set([...directMediaUdis, ...downloadUdis, ...streamUdis]));
  const downloadMedia = downloadUdis.map((udi) =>
    summarizeMedia(mediaByUdi.get(udi) || { udi, key: udiToKey(udi), resolved: false }),
  );
  const streamMedia = streamUdis.map((udi) =>
    summarizeMedia(mediaByUdi.get(udi) || { udi, key: udiToKey(udi), resolved: false }),
  );
  const media = mediaUdis.map((udi) =>
    summarizeMedia(mediaByUdi.get(udi) || { udi, key: udiToKey(udi), resolved: false }),
  );

  return {
    id: contentId(source) ?? contentId(child),
    key,
    udi: guidToUdi(key),
    name: contentName(source) || contentName(child),
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
    sortOrder: firstDefined(source?.sortOrder, source?.SortOrder, child?.sortOrder, child?.SortOrder, null),
    urls: contentUrls(source).length > 0 ? contentUrls(source) : contentUrls(child),
    fullName: properties.fullName || "",
    email: properties.email || "",
    isPurchase: toBoolean(properties.isPurchase),
    downloads: toNumber(properties.downloads),
    streams: toNumber(properties.streams),
    price: properties.price || "",
    expireDate: properties.expireDate || "",
    message: properties.message || "",
    orderCreateDate: properties.createDate || contentCreateDate(child),
    mediaRelationUdis: directMediaUdis,
    downloadUdis,
    streamUdis,
    mediaUdis,
    downloadMediaCount: downloadUdis.length,
    streamMediaCount: streamUdis.length,
    mediaCount: mediaUdis.length,
    media,
    downloadMedia,
    streamMedia,
    mediaNames: media.map((item) => item.title || item.name).filter(Boolean),
    mediaUrls: media.flatMap((item) => item.urls || []),
    videoDownloadURLs: media.map((item) => item.videoDownloadURL).filter(Boolean),
    downloadMediaNames: downloadMedia.map((media) => media.title || media.name).filter(Boolean),
    downloadMediaUrls: downloadMedia.flatMap((media) => media.urls || []),
    downloadVideoDownloadURLs: downloadMedia
      .map((media) => media.videoDownloadURL)
      .filter(Boolean),
    streamMediaNames: streamMedia.map((media) => media.title || media.name).filter(Boolean),
    streamMediaUrls: streamMedia.flatMap((media) => media.urls || []),
    streamVideoDownloadURLs: streamMedia
      .map((media) => media.videoDownloadURL)
      .filter(Boolean),
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

async function fetchDetail(idOrUdi, config, includeProperties = []) {
  const url = new URL(DETAIL_API);
  url.searchParams.set("id", String(idOrUdi));
  if (includeProperties.length > 0) {
    url.searchParams.set("includeProperties", includeProperties.join(","));
  }
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

async function loadCachedMedia(mediaCachePaths) {
  const mediaByUdi = new Map();
  const loaded = [];

  for (const cachePath of mediaCachePaths) {
    try {
      const items = JSON.parse(await readFile(cachePath, "utf8"));
      if (!Array.isArray(items)) continue;

      for (const item of items) {
        const media = {
          ...normalizeMedia(item, item.udi),
          ...item,
          udi: normalizeUdi(item.udi || guidToUdi(item.key)),
          key: item.key || udiToKey(item.udi),
          resolved: Boolean(item.resolved),
        };

        if (media.udi) {
          mediaByUdi.set(media.udi, media);
        }
      }

      loaded.push({ path: cachePath, count: items.length });
    } catch (error) {
      loaded.push({ path: cachePath, count: 0, error: error.message });
    }
  }

  return { mediaByUdi, loaded };
}

function mergedPurchaseProperties(child, detail) {
  return {
    ...flattenProperties(child),
    ...flattenProperties(detail),
  };
}

function uniquePurchaseMediaUdis(children, details) {
  const udis = new Set();

  for (const child of children) {
    const properties = mergedPurchaseProperties(child, details.get(contentId(child)));
    for (const udi of extractUdis(properties.media)) udis.add(udi);
    for (const udi of extractUdis(properties.downloads)) udis.add(udi);
    for (const udi of extractUdis(properties.streams)) udis.add(udi);
  }

  return Array.from(udis);
}

async function resolvePurchaseMedia(mediaUdis, mediaByUdi, config) {
  const errors = [];
  let resolvedFromCache = 0;
  let resolvedFromApi = 0;

  for (const udi of mediaUdis) {
    if (mediaByUdi.has(udi) && mediaByUdi.get(udi)?.resolved) {
      resolvedFromCache += 1;
      continue;
    }

    if (!config.resolveMedia) {
      mediaByUdi.set(udi, {
        ...(mediaByUdi.get(udi) || {}),
        udi,
        key: udiToKey(udi),
        resolved: false,
      });
      continue;
    }

    try {
      const detail = await fetchDetail(udi, config, config.mediaIncludeProperties);
      const media = normalizeMedia(detail, udi);
      mediaByUdi.set(udi, { ...media, resolved: true });
      resolvedFromApi += 1;
    } catch (error) {
      errors.push({
        udi,
        key: udiToKey(udi),
        error: error.message,
      });
      mediaByUdi.set(udi, {
        ...(mediaByUdi.get(udi) || {}),
        udi,
        key: udiToKey(udi),
        resolved: false,
      });
    }
  }

  return { mediaByUdi, errors, resolvedFromCache, resolvedFromApi };
}

function addDateRange(group, date) {
  if (!date) return;
  if (!group.firstPurchaseAt || date < group.firstPurchaseAt) group.firstPurchaseAt = date;
  if (!group.lastPurchaseAt || date > group.lastPurchaseAt) group.lastPurchaseAt = date;
}

function buildMediaSummary(purchases, mediaByUdi) {
  const groups = new Map();

  for (const purchase of purchases) {
    for (const udi of purchase.mediaUdis) {
      const group =
        groups.get(udi) ||
        {
          ...(summarizeMedia(mediaByUdi.get(udi) || { udi, key: udiToKey(udi), resolved: false })),
          purchaseEntryCount: 0,
          purchaseOrderCount: 0,
          nonPurchaseEntryCount: 0,
          totalDownloads: 0,
          totalStreams: 0,
          firstPurchaseAt: "",
          lastPurchaseAt: "",
          samplePurchaseIds: [],
        };

      group.purchaseEntryCount += 1;
      if (purchase.isPurchase) {
        group.purchaseOrderCount += 1;
      } else {
        group.nonPurchaseEntryCount += 1;
      }
      group.totalDownloads += purchase.downloads;
      group.totalStreams += purchase.streams;
      addDateRange(group, purchase.orderCreateDate || purchase.createDate || "");
      if (group.samplePurchaseIds.length < 5 && purchase.id !== undefined && purchase.id !== null) {
        group.samplePurchaseIds.push(purchase.id);
      }

      groups.set(udi, group);
    }
  }

  return Array.from(groups.values()).sort(
    (left, right) =>
      right.purchaseEntryCount - left.purchaseEntryCount ||
      String(left.title || left.name).localeCompare(String(right.title || right.name)),
  );
}

function buildMediaMatch(mediaSummary) {
  return {
    matchedMedia: mediaSummary.filter((media) => media.resolved),
    unresolvedMedia: mediaSummary.filter((media) => !media.resolved),
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
  const mediaUdis = uniquePurchaseMediaUdis(children, itemDetails.details);
  const mediaCache = await loadCachedMedia(config.mediaCachePaths);
  const mediaResolution = await resolvePurchaseMedia(mediaUdis, mediaCache.mediaByUdi, config);
  const purchases = children.map((child) =>
    normalizePurchase(child, itemDetails.details.get(contentId(child)), mediaResolution.mediaByUdi),
  );
  const mediaSummary = buildMediaSummary(purchases, mediaResolution.mediaByUdi);
  const mediaMatch = buildMediaMatch(mediaSummary);
  const parentSummary = normalizeParent(parent);
  const entriesWithDownloads = purchases.filter((purchase) => purchase.downloads > 0).length;
  const entriesWithStreams = purchases.filter((purchase) => purchase.streams > 0).length;
  const purchaseEntries = purchases.filter((purchase) => purchase.isPurchase).length;
  const index = {
    exportedAt: new Date().toISOString(),
    source: {
      parentEditUrl: `${BASE_URL}/umbraco#/content/content/edit/${config.parentId}`,
      childrenApi: CHILDREN_API,
      detailApi: DETAIL_API,
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
      purchaseEntries,
      nonPurchaseEntries: children.length - purchaseEntries,
      entriesWithDownloads,
      entriesWithStreams,
      totalDownloads: purchases.reduce((total, purchase) => total + purchase.downloads, 0),
      totalStreams: purchases.reduce((total, purchase) => total + purchase.streams, 0),
      uniqueMediaUdis: mediaUdis.length,
      mediaResolvedFromCache: mediaResolution.resolvedFromCache,
      mediaResolvedFromApi: mediaResolution.resolvedFromApi,
      mediaResolved: mediaMatch.matchedMedia.length,
      mediaUnresolved: mediaMatch.unresolvedMedia.length,
      mediaResolveErrors: mediaResolution.errors.length,
    },
    pagination: pages,
    mediaCache: mediaCache.loaded,
    files: {
      items: "items.json",
      itemsCsv: "items.csv",
      media: "media.json",
      mediaMatch: "media-match.json",
      errors: "errors.json",
    },
    dataQuality: {
      matchedBy: "purchase media content picker UDI matched to Umbraco media document UDI",
      note:
        "The export uses authenticated Umbraco backoffice JSON APIs. Credentials are read from stdin and are not written to disk.",
    },
  };

  await writeJson(path.join(outDir, "index.json"), index);
  await writeJson(path.join(outDir, "items.json"), purchases);
  await writeFile(path.join(outDir, "items.csv"), `${toCsv(purchases, PURCHASE_CSV_COLUMNS)}\n`);
  await writeJson(path.join(outDir, "media.json"), mediaSummary);
  await writeJson(path.join(outDir, "media-match.json"), mediaMatch);
  await writeJson(path.join(outDir, "errors.json"), {
    mediaResolveErrors: {
      count: mediaResolution.errors.length,
      sample: mediaResolution.errors.slice(0, 50),
    },
    otherErrors: {
      count: errors.length,
      sample: errors.slice(0, 20),
    },
  });

  console.log(
    JSON.stringify(
      {
        outDir,
        purchases: purchases.length,
        purchaseEntries,
        detailsFetched: itemDetails.details.size,
        uniqueMediaUdis: mediaUdis.length,
        mediaResolved: index.counts.mediaResolved,
        mediaUnresolved: index.counts.mediaUnresolved,
        mediaResolveErrors: mediaResolution.errors.length,
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

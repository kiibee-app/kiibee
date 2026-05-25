#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const BASE_URL = "https://kiibee.dk";
const CHILDREN_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Content/GetChildren`;
const DETAIL_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Content/GetById`;

const DEFAULT_INCLUDE_PROPERTIES = [
  "title",
  "orderID",
  "hidden",
  "type",
  "rawFile",
  "videoID",
  "videoStatus",
  "videoSize",
  "videoThumbnailURL",
  "videoDownloadURL",
  "trailer",
  "webContentURL",
  "openWebContentInNewWindows",
  "openWebContentFromList",
  "description",
  "expandedDescription",
  "year",
  "length",
  "badge",
  "production",
  "productionLink",
  "tags",
  "thumbnail",
  "productLink",
  "access",
  "rentalPrice",
  "purchasePrice",
  "code",
  "hidePlay",
  "hideDownload",
  "siteMapOption",
  "metaTitle",
  "metaDescription",
];

const SHOW_CSV_COLUMNS = [
  "id",
  "key",
  "udi",
  "name",
  "title",
  "orderID",
  "hidden",
  "published",
  "hasPublishedVersion",
  "createDate",
  "updateDate",
  "urls",
  "statsEntryCount",
  "statsPlayCount",
  "statsNonPlayCount",
  "firstStatAt",
  "lastStatAt",
  "videoID",
  "videoStatus",
  "videoThumbnailURL",
  "videoDownloadURL",
  "thumbnail",
  "year",
  "length",
  "rentalPrice",
  "purchasePrice",
  "tags",
  "description",
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
    process.env.UMBRACO_EXPORT_CONFIG || (process.stdin.isTTY ? "" : await readStdin());
  if (!input) {
    throw new Error("Pass a JSON config object on stdin or UMBRACO_EXPORT_CONFIG.");
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
    parentId: Number(config.parentId || 1885),
    pageSize: Number(config.pageSize || 100),
    orderBy: config.orderBy || "orderID",
    orderDirection: config.orderDirection || "Ascending",
    outDir: config.outDir || "umbraco-data/users/Uffe_Holm/shows",
    statsItemsPath:
      config.statsItemsPath || "umbraco-data/users/Uffe_Holm/stats/items.json",
    includeProperties: Array.isArray(config.includeProperties)
      ? config.includeProperties
      : DEFAULT_INCLUDE_PROPERTIES,
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

function contentId(node) {
  return firstDefined(node?.id, node?.Id, node?.contentId, node?.ContentId, null);
}

function contentKey(node) {
  return firstDefined(node?.key, node?.Key, node?.uid, node?.Uid, "");
}

function contentName(node) {
  return firstDefined(node?.name, node?.Name, "");
}

function normalizeContent(child, detail) {
  const source = detail || child;
  const properties = {
    ...flattenProperties(child),
    ...flattenProperties(detail),
  };
  const key = String(firstDefined(contentKey(source), contentKey(child), "")).toLowerCase();
  const urls = toArray(firstDefined(source?.urls, source?.Urls, child?.urls, child?.Urls, []));

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
    published: toBoolean(
      firstDefined(source?.published, source?.Published, child?.published, child?.Published),
    ),
    hasPublishedVersion: toBoolean(
      firstDefined(
        source?.hasPublishedVersion,
        source?.HasPublishedVersion,
        child?.hasPublishedVersion,
        child?.HasPublishedVersion,
      ),
    ),
    createDate: firstDefined(source?.createDate, source?.CreateDate, child?.createDate, child?.CreateDate, ""),
    updateDate: firstDefined(source?.updateDate, source?.UpdateDate, child?.updateDate, child?.UpdateDate, ""),
    parentId: firstDefined(source?.parentId, source?.ParentId, child?.parentId, child?.ParentId, null),
    path: firstDefined(source?.path, source?.Path, child?.path, child?.Path, ""),
    sortOrder: firstDefined(source?.sortOrder, source?.SortOrder, child?.sortOrder, child?.SortOrder, null),
    urls,
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
    openWebContentInNewWindows: toBoolean(properties.openWebContentInNewWindows),
    openWebContentFromList: toBoolean(properties.openWebContentFromList),
    hidden: toBoolean(properties.hidden),
    orderID: properties.orderID || "",
    title: properties.title || contentName(source) || contentName(child),
    description: properties.description || "",
    expandedDescription: properties.expandedDescription || "",
    year: properties.year || "",
    length: properties.length || "",
    badge: properties.badge || "",
    production: properties.production || "",
    productionLink: properties.productionLink || "",
    tags: properties.tags || "",
    thumbnail: properties.thumbnail || "",
    productLink: properties.productLink || "",
    access: properties.access || [],
    rentalPrice: properties.rentalPrice || "",
    purchasePrice: properties.purchasePrice || "",
    code: properties.code || "",
    hidePlay: toBoolean(properties.hidePlay),
    hideDownload: toBoolean(properties.hideDownload),
    siteMapOption: properties.siteMapOption || "",
    metaTitle: properties.metaTitle || "",
    metaDescription: properties.metaDescription || "",
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
    urls: toArray(firstDefined(parent?.urls, parent?.Urls, [])),
    path: firstDefined(parent?.path, parent?.Path, ""),
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
    url.searchParams.set("orderBySystemField", "false");
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

async function fetchDetail(id, config) {
  const url = new URL(DETAIL_API);
  url.searchParams.set("id", String(id));
  return requestJson(url, config);
}

function addDateRange(group, date) {
  if (!date) return;
  if (!group.firstEntryAt || date < group.firstEntryAt) group.firstEntryAt = date;
  if (!group.lastEntryAt || date > group.lastEntryAt) group.lastEntryAt = date;
}

async function loadStatsGroups(statsItemsPath) {
  const groups = new Map();
  const statsItems = JSON.parse(await readFile(statsItemsPath, "utf8"));

  for (const item of statsItems) {
    const mediaUdi = String(item.mediaUdi || guidToUdi(item.mediaKey) || "").toLowerCase();
    if (!mediaUdi) continue;

    const group =
      groups.get(mediaUdi) ||
      {
        mediaUdi,
        mediaKey: item.mediaKey || udiToKey(mediaUdi),
        statsEntryCount: 0,
        statsPlayCount: 0,
        statsNonPlayCount: 0,
        firstEntryAt: "",
        lastEntryAt: "",
        sampleEntryIds: [],
      };

    group.statsEntryCount += 1;
    if (toBoolean(item.isPlay)) {
      group.statsPlayCount += 1;
    } else {
      group.statsNonPlayCount += 1;
    }
    addDateRange(group, item.createDate || item.updateDate || "");
    if (group.sampleEntryIds.length < 5 && item.id !== undefined && item.id !== null) {
      group.sampleEntryIds.push(item.id);
    }

    groups.set(mediaUdi, group);
  }

  return { statsItems, groups };
}

function attachStats(shows, statsGroups) {
  return shows.map((show) => {
    const stats = statsGroups.get(show.udi.toLowerCase()) || null;

    return {
      ...show,
      statsMatched: Boolean(stats),
      statsEntryCount: stats?.statsEntryCount || 0,
      statsPlayCount: stats?.statsPlayCount || 0,
      statsNonPlayCount: stats?.statsNonPlayCount || 0,
      firstStatAt: stats?.firstEntryAt || "",
      lastStatAt: stats?.lastEntryAt || "",
      stats: stats
        ? {
            mediaUdi: stats.mediaUdi,
            mediaKey: stats.mediaKey,
            entryCount: stats.statsEntryCount,
            playCount: stats.statsPlayCount,
            nonPlayCount: stats.statsNonPlayCount,
            firstEntryAt: stats.firstEntryAt,
            lastEntryAt: stats.lastEntryAt,
            sampleEntryIds: stats.sampleEntryIds,
          }
        : {
            mediaUdi: show.udi,
            mediaKey: show.key,
            entryCount: 0,
            playCount: 0,
            nonPlayCount: 0,
            firstEntryAt: "",
            lastEntryAt: "",
            sampleEntryIds: [],
          },
    };
  });
}

function buildStatsMatch(shows, statsGroups) {
  const showUdis = new Set(shows.map((show) => show.udi.toLowerCase()));
  const statsMedia = Array.from(statsGroups.values()).sort(
    (left, right) => right.statsEntryCount - left.statsEntryCount,
  );

  return {
    matchedShows: shows
      .filter((show) => show.statsMatched)
      .map((show) => ({
        id: show.id,
        key: show.key,
        udi: show.udi,
        name: show.name,
        title: show.title,
        statsEntryCount: show.statsEntryCount,
        statsPlayCount: show.statsPlayCount,
        statsNonPlayCount: show.statsNonPlayCount,
      })),
    showsWithoutStats: shows
      .filter((show) => !show.statsMatched)
      .map((show) => ({
        id: show.id,
        key: show.key,
        udi: show.udi,
        name: show.name,
        title: show.title,
      })),
    statsMediaWithoutShow: statsMedia
      .filter((group) => !showUdis.has(group.mediaUdi))
      .map((group) => ({
        mediaUdi: group.mediaUdi,
        mediaKey: group.mediaKey,
        statsEntryCount: group.statsEntryCount,
        statsPlayCount: group.statsPlayCount,
        statsNonPlayCount: group.statsNonPlayCount,
        firstEntryAt: group.firstEntryAt,
        lastEntryAt: group.lastEntryAt,
        sampleEntryIds: group.sampleEntryIds,
      })),
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
  const details = new Map();

  for (const child of children) {
    const id = contentId(child);
    if (!id) continue;

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
  }

  const shows = children
    .map((child) => normalizeContent(child, details.get(contentId(child))))
    .sort((left, right) => {
      const leftOrder = Number(left.orderID || left.sortOrder || 0);
      const rightOrder = Number(right.orderID || right.sortOrder || 0);
      return leftOrder - rightOrder || String(left.title).localeCompare(String(right.title));
    });

  const { statsItems, groups } = await loadStatsGroups(config.statsItemsPath);
  const showsWithStats = attachStats(shows, groups);
  const statsMatch = buildStatsMatch(showsWithStats, groups);
  const parentSummary = normalizeParent(parent);
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
    },
    parent: parentSummary,
    counts: {
      totalItemsFromApi: totalItems,
      childrenFetched: children.length,
      detailsFetched: details.size,
      detailErrors: errors.length,
      statsEntriesRead: statsItems.length,
      uniqueStatsMedia: groups.size,
      showsMatchedToStats: showsWithStats.filter((show) => show.statsMatched).length,
      showsWithoutStats: statsMatch.showsWithoutStats.length,
      statsMediaWithoutShow: statsMatch.statsMediaWithoutShow.length,
    },
    pagination: pages,
    files: {
      items: "items.json",
      itemsCsv: "items.csv",
      statsMatch: "stats-match.json",
      errors: "errors.json",
    },
    dataQuality: {
      matchedBy: "stats mediaUdi equals show UDI derived from show key",
      statsSource: config.statsItemsPath,
      note:
        "The export uses authenticated Umbraco backoffice JSON APIs. Credentials are read from stdin and are not written to disk.",
    },
  };

  await writeJson(path.join(outDir, "index.json"), index);
  await writeJson(path.join(outDir, "items.json"), showsWithStats);
  await writeFile(path.join(outDir, "items.csv"), `${toCsv(showsWithStats, SHOW_CSV_COLUMNS)}\n`);
  await writeJson(path.join(outDir, "stats-match.json"), statsMatch);
  await writeJson(path.join(outDir, "errors.json"), {
    detailErrors: {
      count: errors.length,
      sample: errors.slice(0, 20),
    },
  });

  console.log(
    JSON.stringify(
      {
        outDir,
        shows: showsWithStats.length,
        statsEntriesRead: statsItems.length,
        showsMatchedToStats: index.counts.showsMatchedToStats,
        statsMediaWithoutShow: index.counts.statsMediaWithoutShow,
        detailErrors: errors.length,
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

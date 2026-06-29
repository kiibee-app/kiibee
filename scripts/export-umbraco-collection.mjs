#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const BASE_URL = "https://kiibee.dk";
const CHILDREN_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Content/GetChildren`;
const DETAIL_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Content/GetById`;

const DEFAULT_INCLUDE_PROPERTIES = ["title", "orderID", "hidden"];
const BASE_CSV_COLUMNS = [
  "id",
  "key",
  "udi",
  "name",
  "contentTypeAlias",
  "published",
  "hasPublishedVersion",
  "createDate",
  "updateDate",
  "parentId",
  "sortOrder",
  "urls",
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
    process.env.UMBRACO_COLLECTION_EXPORT_CONFIG ||
    process.env.UMBRACO_EXPORT_CONFIG ||
    (shouldReadStdin ? await readStdin() : "");

  if (!input) {
    throw new Error("Pass a JSON config object on stdin or UMBRACO_COLLECTION_EXPORT_CONFIG.");
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
    parentId: Number(config.parentId),
    collectionName: config.collectionName || "",
    pageSize: Number(config.pageSize || 100),
    orderBy: config.orderBy || "orderID",
    orderDirection: config.orderDirection || "Ascending",
    orderBySystemField: config.orderBySystemField ?? false,
    outDir: config.outDir,
    includeProperties: Array.isArray(config.includeProperties)
      ? config.includeProperties
      : DEFAULT_INCLUDE_PROPERTIES,
    extraDetailIds: Array.isArray(config.extraDetailIds) ? config.extraDetailIds.map(Number) : [],
    detailConcurrency: Number(config.detailConcurrency || 8),
    fetchDetails: config.fetchDetails ?? true,
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

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function hasOwn(object, key) {
  return Boolean(object && typeof object === "object" && Object.hasOwn(object, key));
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

function contentId(node) {
  return firstDefined(node?.id, node?.Id, node?.contentId, node?.ContentId, null);
}

function contentKey(node) {
  return firstDefined(node?.key, node?.Key, node?.uid, node?.Uid, "");
}

function contentName(node) {
  return firstDefined(node?.name, node?.Name, "");
}

function contentTypeAlias(node) {
  return firstDefined(node?.contentTypeAlias, node?.ContentTypeAlias, "");
}

function createDate(node) {
  return firstDefined(node?.createDate, node?.CreateDate, "");
}

function updateDate(node) {
  return firstDefined(node?.updateDate, node?.UpdateDate, "");
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

function propertyLabel(property) {
  return firstDefined(property?.label, property?.Label, property?.name, property?.Name, "");
}

function propertyEditor(property) {
  return firstDefined(
    property?.view,
    property?.View,
    property?.editor,
    property?.Editor,
    property?.editorAlias,
    property?.EditorAlias,
    property?.propertyEditorAlias,
    property?.PropertyEditorAlias,
    "",
  );
}

function rawPropertyValue(property) {
  if (!property || typeof property !== "object") return property;
  if (hasOwn(property, "value")) return property.value;
  if (hasOwn(property, "Value")) return property.Value;
  if (hasOwn(property, "values")) return property.values;
  if (hasOwn(property, "Values")) return property.Values;
  return "";
}

function looksLikeVariantValue(value) {
  return (
    value &&
    typeof value === "object" &&
    hasOwn(value, "value") &&
    (hasOwn(value, "culture") ||
      hasOwn(value, "Culture") ||
      hasOwn(value, "segment") ||
      hasOwn(value, "Segment") ||
      hasOwn(value, "editedValue") ||
      hasOwn(value, "EditedValue"))
  );
}

function normalizeInnerValue(value) {
  if (Array.isArray(value)) {
    if (value.every(looksLikeVariantValue)) {
      const normalized = value.map((item) => ({
        culture: firstDefined(item.culture, item.Culture, null),
        segment: firstDefined(item.segment, item.Segment, null),
        value: normalizeInnerValue(firstDefined(item.value, item.Value, "")),
      }));

      return normalized.length === 1 ? normalized[0].value : normalized;
    }

    return value.map((item) => normalizeInnerValue(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const entries = Object.entries(value).map(([key, entryValue]) => [
    key,
    normalizeInnerValue(entryValue),
  ]);
  return Object.fromEntries(entries);
}

function addProperty(fields, fieldDetails, fieldOrder, property, context) {
  const alias = propertyAlias(property);
  if (!alias) return;

  const value = normalizeInnerValue(rawPropertyValue(property));
  fields[alias] = value;
  fieldDetails[alias] = {
    alias,
    label: propertyLabel(property),
    description: firstDefined(property?.description, property?.Description, ""),
    tab: context.tab || "",
    variant: context.variant || "",
    culture: context.culture || null,
    source: context.source,
    editor: propertyEditor(property),
    value,
  };

  if (!fieldOrder.includes(alias)) {
    fieldOrder.push(alias);
  }
}

function addProperties(fields, fieldDetails, fieldOrder, properties, context) {
  if (Array.isArray(properties)) {
    for (const property of properties) {
      addProperty(fields, fieldDetails, fieldOrder, property, context);
    }
    return;
  }

  if (properties && typeof properties === "object") {
    for (const [alias, value] of Object.entries(properties)) {
      addProperty(
        fields,
        fieldDetails,
        fieldOrder,
        { alias, value },
        context,
      );
    }
  }
}

function extractFields(node, source) {
  const fields = {};
  const fieldDetails = {};
  const fieldOrder = [];

  addProperties(fields, fieldDetails, fieldOrder, node?.properties, { source });
  addProperties(fields, fieldDetails, fieldOrder, node?.Properties, { source });

  for (const tab of node?.tabs || node?.Tabs || []) {
    const tabName = firstDefined(tab?.label, tab?.Label, tab?.name, tab?.Name, "");
    addProperties(fields, fieldDetails, fieldOrder, tab?.properties, {
      source,
      tab: tabName,
    });
    addProperties(fields, fieldDetails, fieldOrder, tab?.Properties, {
      source,
      tab: tabName,
    });
  }

  for (const variant of node?.variants || node?.Variants || []) {
    const variantName = firstDefined(
      variant?.name,
      variant?.Name,
      variant?.language?.name,
      variant?.Language?.Name,
      "",
    );
    const culture = firstDefined(
      variant?.culture,
      variant?.Culture,
      variant?.language?.culture,
      variant?.Language?.Culture,
      null,
    );
    addProperties(fields, fieldDetails, fieldOrder, variant?.properties, {
      source,
      variant: variantName,
      culture,
    });
    addProperties(fields, fieldDetails, fieldOrder, variant?.Properties, {
      source,
      variant: variantName,
      culture,
    });

    for (const tab of variant?.tabs || variant?.Tabs || []) {
      const tabName = firstDefined(tab?.label, tab?.Label, tab?.name, tab?.Name, "");
      addProperties(fields, fieldDetails, fieldOrder, tab?.properties, {
        source,
        tab: tabName,
        variant: variantName,
        culture,
      });
      addProperties(fields, fieldDetails, fieldOrder, tab?.Properties, {
        source,
        tab: tabName,
        variant: variantName,
        culture,
      });
    }
  }

  return { fields, fieldDetails, fieldOrder };
}

function mergeExtractedFields(...extractedGroups) {
  const fields = {};
  const fieldDetails = {};
  const fieldOrder = [];

  for (const extracted of extractedGroups) {
    Object.assign(fields, extracted.fields);
    Object.assign(fieldDetails, extracted.fieldDetails);
    for (const alias of extracted.fieldOrder) {
      if (!fieldOrder.includes(alias)) {
        fieldOrder.push(alias);
      }
    }
  }

  return { fields, fieldDetails, fieldOrder };
}

function normalizeContent(child, detail) {
  const source = detail || child;
  const key = String(firstDefined(contentKey(source), contentKey(child), "")).toLowerCase();
  const urls = toArray(firstDefined(source?.urls, source?.Urls, child?.urls, child?.Urls, []));
  const extracted = mergeExtractedFields(
    extractFields(child, "children"),
    detail ? extractFields(detail, "detail") : { fields: {}, fieldDetails: {}, fieldOrder: [] },
  );

  return {
    id: contentId(source) ?? contentId(child),
    key,
    udi: guidToUdi(key),
    name: contentName(source) || contentName(child),
    contentTypeAlias: firstDefined(contentTypeAlias(source), contentTypeAlias(child), ""),
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
    createDate: firstDefined(createDate(source), createDate(child), ""),
    updateDate: firstDefined(updateDate(source), updateDate(child), ""),
    parentId: firstDefined(source?.parentId, source?.ParentId, child?.parentId, child?.ParentId, null),
    path: firstDefined(source?.path, source?.Path, child?.path, child?.Path, ""),
    sortOrder: firstDefined(source?.sortOrder, source?.SortOrder, child?.sortOrder, child?.SortOrder, null),
    urls,
    fields: extracted.fields,
    fieldDetails: extracted.fieldDetails,
    fieldOrder: extracted.fieldOrder,
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
      fields: {},
      fieldDetails: {},
      fieldOrder: [],
    };
  }

  const key = String(contentKey(parent)).toLowerCase();
  const extracted = extractFields(parent, "detail");

  return {
    id: contentId(parent),
    key,
    udi: guidToUdi(key),
    name: contentName(parent),
    contentTypeAlias: contentTypeAlias(parent),
    published: toBoolean(firstDefined(parent?.published, parent?.Published)),
    hasPublishedVersion: toBoolean(
      firstDefined(parent?.hasPublishedVersion, parent?.HasPublishedVersion),
    ),
    urls: toArray(firstDefined(parent?.urls, parent?.Urls, [])),
    fields: extracted.fields,
    fieldDetails: extracted.fieldDetails,
    fieldOrder: extracted.fieldOrder,
  };
}

async function fetchChildren(config) {
  const children = [];
  const pages = [];
  const rawPages = [];
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
    rawPages.push(payload);
    pages.push({
      pageNumber,
      itemCount: items.length,
      totalItems: getTotalItems(payload, children.length),
    });

    totalItems = getTotalItems(payload, children.length);
    totalPages = totalItems > 0 ? Math.ceil(totalItems / config.pageSize) : 1;
    pageNumber += 1;
  } while (pageNumber <= totalPages);

  return { children, pages, rawPages, totalItems };
}

async function fetchDetail(id, config) {
  const url = new URL(DETAIL_API);
  url.searchParams.set("id", String(id));
  return requestJson(url, config);
}

async function fetchDetails(ids, config) {
  const details = new Map();
  const errors = [];
  let index = 0;

  async function worker() {
    while (index < ids.length) {
      const id = ids[index];
      index += 1;

      try {
        details.set(id, await fetchDetail(id, config));
      } catch (error) {
        errors.push({
          id,
          phase: "detail",
          error: error.message,
        });
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(config.detailConcurrency, ids.length) }, () => worker()),
  );

  return { details, errors };
}

function csvValue(value) {
  let text = "";
  if (Array.isArray(value)) {
    text = value.every((item) => item === null || typeof item !== "object")
      ? value.join(" | ")
      : JSON.stringify(value);
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

function toCsv(items, fieldColumns) {
  const columns = [...BASE_CSV_COLUMNS, ...fieldColumns];
  return [
    columns.join(","),
    ...items.map((item) =>
      columns
        .map((column) => csvValue(BASE_CSV_COLUMNS.includes(column) ? item[column] : item.fields[column]))
        .join(","),
    ),
  ].join("\n");
}

function buildFieldCatalog(parent, items) {
  const catalog = {};

  function addDetails(owner, details, order) {
    for (const alias of order) {
      catalog[alias] ||= {
        alias,
        labels: [],
        tabs: [],
        editors: [],
        seenOn: [],
      };
      const entry = catalog[alias];
      const detail = details[alias] || {};

      if (detail.label && !entry.labels.includes(detail.label)) entry.labels.push(detail.label);
      if (detail.tab && !entry.tabs.includes(detail.tab)) entry.tabs.push(detail.tab);
      if (detail.editor && !entry.editors.includes(detail.editor)) entry.editors.push(detail.editor);
      if (!entry.seenOn.includes(owner)) entry.seenOn.push(owner);
    }
  }

  addDetails("parent", parent.fieldDetails, parent.fieldOrder);
  for (const item of items) {
    addDetails(`item:${item.id}`, item.fieldDetails, item.fieldOrder);
  }

  return Object.fromEntries(Object.entries(catalog).sort(([left], [right]) => left.localeCompare(right)));
}

async function writeJson(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

async function main() {
  const config = await readConfig();
  if (!Number.isFinite(config.parentId)) {
    throw new Error("Config is missing a numeric parentId.");
  }
  if (!config.outDir) {
    throw new Error("Config is missing outDir.");
  }

  const outDir = path.resolve(config.outDir);
  const rawDir = path.join(outDir, "raw");
  await mkdir(rawDir, { recursive: true });

  const errors = [];
  let parentRaw = null;
  try {
    parentRaw = await fetchDetail(config.parentId, config);
  } catch (error) {
    errors.push({
      id: config.parentId,
      phase: "parentDetail",
      error: error.message,
    });
  }

  const { children, pages, rawPages, totalItems } = await fetchChildren(config);
  const detailIds = [
    ...new Set([
      ...(config.fetchDetails ? children.map((child) => contentId(child)).filter(Boolean) : []),
      ...config.extraDetailIds.filter(Boolean),
    ]),
  ];
  const { details, errors: detailErrors } = await fetchDetails(detailIds, config);
  errors.push(...detailErrors);

  const items = children.map((child) => normalizeContent(child, details.get(contentId(child))));
  const parent = normalizeParent(parentRaw);
  const fieldColumns = [
    ...new Set(items.flatMap((item) => item.fieldOrder)),
  ].sort((left, right) => {
    if (left === "orderID") return -1;
    if (right === "orderID") return 1;
    if (left === "title") return -1;
    if (right === "title") return 1;
    return left.localeCompare(right);
  });
  const fieldCatalog = buildFieldCatalog(parent, items);
  const fieldsByItem = items.map((item) => ({
    id: item.id,
    key: item.key,
    udi: item.udi,
    name: item.name,
    fields: item.fields,
    fieldDetails: item.fieldDetails,
    fieldOrder: item.fieldOrder,
  }));

  const index = {
    exportedAt: new Date().toISOString(),
    collectionName: config.collectionName,
    source: {
      parentEditUrl: `${BASE_URL}/umbraco#/content/content/edit/${config.parentId}`,
      childrenApi: CHILDREN_API,
      detailApi: DETAIL_API,
      parentId: config.parentId,
      includeProperties: config.includeProperties,
      orderBy: config.orderBy,
      orderDirection: config.orderDirection,
      orderBySystemField: config.orderBySystemField,
      extraDetailIds: config.extraDetailIds,
      fetchDetails: config.fetchDetails,
    },
    parent,
    counts: {
      totalItemsFromApi: totalItems,
      childrenFetched: children.length,
      detailIdsRequested: detailIds.length,
      detailsFetched: details.size,
      errors: errors.length,
      fieldCount: Object.keys(fieldCatalog).length,
    },
    pagination: pages,
    files: {
      items: "items.json",
      itemsCsv: "items.csv",
      fieldsByItem: "fields-by-item.json",
      fieldCatalog: "field-catalog.json",
      errors: "errors.json",
      rawParent: "raw/parent.json",
      rawChildrenPages: "raw/children-pages.json",
      rawDetails: "raw/details.json",
    },
    dataQuality: {
      fieldExtraction:
        "Each field value is extracted from Umbraco property value/Value/values/Values, including nested variant value entries.",
      credentials:
        "Authenticated Umbraco cookies are read from stdin or environment and are not written to disk.",
    },
  };

  await writeJson(path.join(outDir, "index.json"), index);
  await writeJson(path.join(outDir, "items.json"), items);
  await writeFile(path.join(outDir, "items.csv"), `${toCsv(items, fieldColumns)}\n`);
  await writeJson(path.join(outDir, "fields-by-item.json"), fieldsByItem);
  await writeJson(path.join(outDir, "field-catalog.json"), fieldCatalog);
  await writeJson(path.join(outDir, "errors.json"), {
    count: errors.length,
    sample: errors.slice(0, 50),
  });
  await writeJson(path.join(rawDir, "parent.json"), parentRaw);
  await writeJson(path.join(rawDir, "children-pages.json"), rawPages);
  await writeJson(
    path.join(rawDir, "details.json"),
    Object.fromEntries([...details.entries()].sort(([left], [right]) => left - right)),
  );

  console.log(
    JSON.stringify(
      {
        outDir,
        collectionName: config.collectionName,
        childrenFetched: children.length,
        detailsFetched: details.size,
        fieldCount: Object.keys(fieldCatalog).length,
        errors: errors.length,
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

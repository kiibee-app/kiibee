#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_LOG_DIR = "umbraco-data/users/Uffe_Holm/logs";
const DEFAULT_REFERENCE_CACHE = "umbraco-data/users/Uffe_Holm/purchases/media.json";
const CSV_COLUMNS = [
  "id",
  "key",
  "name",
  "createDate",
  "updateDate",
  "isPurchase",
  "mediaUdi",
  "mediaName",
  "mediaTitle",
  "mediaUrl",
  "transactionID",
  "paytype",
  "acquirer",
  "price",
  "fullName",
  "email",
];

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function writeJson(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function normalizeUdi(value) {
  return String(value || "").trim().toLowerCase();
}

function udiToKey(udi) {
  const value = normalizeUdi(udi).replace(/^umb:\/\/(document|media)\//i, "");
  if (value.length !== 32) return "";

  return [
    value.slice(0, 8),
    value.slice(8, 12),
    value.slice(12, 16),
    value.slice(16, 20),
    value.slice(20),
  ].join("-");
}

function keyToUdi(key) {
  const value = String(key || "").replaceAll("-", "").toLowerCase();
  return value.length === 32 ? `umb://document/${value}` : "";
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function hasOwn(object, key) {
  return Boolean(object && typeof object === "object" && Object.hasOwn(object, key));
}

function propertyAlias(property) {
  return firstDefined(property?.alias, property?.Alias, property?.key, property?.Key, "");
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
    "",
  );
}

function propertyValue(property) {
  if (!property || typeof property !== "object") return property;
  if (hasOwn(property, "value")) return property.value;
  if (hasOwn(property, "Value")) return property.Value;
  if (hasOwn(property, "values")) return property.values;
  if (hasOwn(property, "Values")) return property.Values;
  return "";
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

function normalizeReference(entry) {
  const udi = normalizeUdi(entry?.udi || keyToUdi(entry?.key));
  const urls = toArray(entry?.urls);

  return {
    udi,
    key: entry?.key || udiToKey(udi),
    id: entry?.id ?? null,
    name: entry?.name || "",
    title: String(entry?.title || "").trim(),
    urls,
    url: entry?.url || urls[0] || "",
    contentTypeAlias: entry?.contentTypeAlias || "",
    videoID: entry?.videoID || "",
    videoStatus: entry?.videoStatus || "",
    videoThumbnailURL: entry?.videoThumbnailURL || "",
    videoDownloadURL: entry?.videoDownloadURL || "",
    thumbnail: entry?.thumbnail || "",
    purchasePrice: entry?.purchasePrice || "",
    rentalPrice: entry?.rentalPrice || "",
  };
}

async function loadReferenceMap(referencePath) {
  const data = await readJson(referencePath);
  const entries = Array.isArray(data) ? data : Object.values(data);
  const map = new Map();

  for (const entry of entries) {
    const reference = normalizeReference(entry);
    if (!reference.udi) continue;
    map.set(reference.udi, reference);
    map.set(keyToUdi(reference.key), reference);
  }

  return map;
}

function resolveReference(value, referenceMap) {
  const udi = normalizeUdi(value);
  if (!udi.startsWith("umb://")) return null;

  return (
    referenceMap.get(udi) ||
    referenceMap.get(keyToUdi(udiToKey(udi))) || {
      udi,
      key: udiToKey(udi),
      id: null,
      name: "",
      title: "",
      urls: [],
      url: "",
      contentTypeAlias: "",
      unresolved: true,
    }
  );
}

function displayValue(value, editor, resolvedReference) {
  if (resolvedReference) {
    return [resolvedReference.title || resolvedReference.name, resolvedReference.url]
      .filter(Boolean)
      .join(" | ");
  }
  if (editor === "boolean") return toBoolean(value) ? "true" : "false";
  if (Array.isArray(value)) return value.join(" | ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return value === undefined || value === null ? "" : String(value);
}

function fullValueRows(detail, fallbackItem, referenceMap) {
  const rows = [];

  for (const tab of detail?.tabs || detail?.Tabs || []) {
    const tabName = firstDefined(tab?.label, tab?.Label, tab?.name, tab?.Name, "");
    for (const property of tab?.properties || tab?.Properties || []) {
      const alias = propertyAlias(property);
      if (!alias) continue;

      const value = propertyValue(property);
      const editor = propertyEditor(property);
      const resolvedReference = resolveReference(value, referenceMap);

      rows.push({
        alias,
        label: propertyLabel(property),
        tab: tabName,
        editor,
        value,
        booleanValue: editor === "boolean" ? toBoolean(value) : null,
        displayValue: displayValue(value, editor, resolvedReference),
        resolvedReference,
      });
    }
  }

  if (rows.length) return rows;

  return (fallbackItem.fieldOrder || Object.keys(fallbackItem.fields || {})).map((alias) => {
    const detail = fallbackItem.fieldDetails?.[alias] || {};
    const value = fallbackItem.fields?.[alias];
    const editor = detail.editor || "";
    const resolvedReference = resolveReference(value, referenceMap);

    return {
      alias,
      label: detail.label || alias,
      tab: detail.tab || "",
      editor,
      value,
      booleanValue: editor === "boolean" ? toBoolean(value) : null,
      displayValue: displayValue(value, editor, resolvedReference),
      resolvedReference,
    };
  });
}

function rowsToObject(rows) {
  return Object.fromEntries(rows.map((row) => [row.alias, row]));
}

function csvValue(value) {
  let text = "";
  if (Array.isArray(value)) text = value.join(" | ");
  else if (value && typeof value === "object") text = JSON.stringify(value);
  else if (value !== undefined && value !== null) text = String(value);

  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(items) {
  return [
    CSV_COLUMNS.join(","),
    ...items.map((item) => {
      const media = item.fullValues.media?.resolvedReference || {};
      const values = {
        id: item.id,
        key: item.key,
        name: item.name,
        createDate: item.createDate,
        updateDate: item.updateDate,
        isPurchase: item.fullValues.isPurchase?.booleanValue,
        mediaUdi: item.fullValues.media?.value,
        mediaName: media.name,
        mediaTitle: media.title,
        mediaUrl: media.url,
        transactionID: item.fullValues.transactionID?.value,
        paytype: item.fullValues.paytype?.value,
        acquirer: item.fullValues.acquirer?.value,
        price: item.fullValues.price?.value,
        fullName: item.fullValues.fullName?.value,
        email: item.fullValues.email?.value,
      };
      return CSV_COLUMNS.map((column) => csvValue(values[column])).join(",");
    }),
  ].join("\n");
}

async function main() {
  const logDir = path.resolve(process.argv[2] || DEFAULT_LOG_DIR);
  const referencePath = process.argv[3] || DEFAULT_REFERENCE_CACHE;
  const [items, fieldsByItem, details] = await Promise.all([
    readJson(path.join(logDir, "items.json")),
    readJson(path.join(logDir, "fields-by-item.json")),
    readJson(path.join(logDir, "raw", "details.json")),
  ]);
  const referenceMap = await loadReferenceMap(referencePath);
  const fieldsByItemById = new Map(fieldsByItem.map((item) => [item.id, item]));

  const enrichedItems = items.map((item) => {
    const rows = fullValueRows(details[String(item.id)], fieldsByItemById.get(item.id) || item, referenceMap);
    return {
      ...item,
      fullValues: rowsToObject(rows),
      fullValueRows: rows,
    };
  });

  await writeJson(path.join(logDir, "items.json"), enrichedItems);
  await writeJson(
    path.join(logDir, "full-values.json"),
    enrichedItems.map((item) => ({
      id: item.id,
      key: item.key,
      udi: item.udi,
      name: item.name,
      createDate: item.createDate,
      updateDate: item.updateDate,
      fullValues: item.fullValues,
      fullValueRows: item.fullValueRows,
    })),
  );
  await writeFile(path.join(logDir, "full-values.csv"), `${toCsv(enrichedItems)}\n`);

  console.log(
    JSON.stringify(
      {
        logDir,
        items: enrichedItems.length,
        fullValueRows: enrichedItems.reduce((total, item) => total + item.fullValueRows.length, 0),
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

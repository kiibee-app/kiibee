#!/usr/bin/env node

import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const USERS_DIR = "umbraco-data/users";
const RUNS_DIR = "umbraco-data/export-runs";

const DATASETS = {
  logs: {
    jsonFiles: ["items.json", "full-values.json", "errors.json", "index.json"],
    csvFiles: {
      "items.csv": ["id", "key", "udi", "name", "createDate", "updateDate"],
      "full-values.csv": [
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
      ],
    },
  },
  payouts: {
    jsonFiles: ["items.json", "errors.json", "index.json", "invoice-match.json"],
    csvFiles: {
      "items.csv": [
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
      ],
    },
  },
  purchases: {
    jsonFiles: ["items.json", "errors.json", "index.json", "media.json", "media-match.json"],
    csvFiles: {
      "items.csv": [
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
      ],
    },
  },
  shows: {
    jsonFiles: ["items.json", "shows.json", "errors.json", "index.json", "stats-match.json"],
    csvFiles: {
      "items.csv": [
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
      ],
    },
  },
  stats: {
    jsonFiles: [
      "items.json",
      "errors.json",
      "index.json",
      "field-catalog.json",
      "fields-by-item.json",
      "media.json",
    ],
    csvFiles: {
      "items.csv": [
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
        "isPlay",
        "uID",
        "media",
      ],
    },
  },
};

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonIfExists(filePath, fallback = null) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJsonIfMissing(filePath, data, changes) {
  if (await exists(filePath)) return false;
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
  changes.push(filePath);
  return true;
}

async function writeCsvIfMissing(filePath, headers, changes) {
  if (await exists(filePath)) return false;
  await writeFile(filePath, `${headers.join(",")}\n`);
  changes.push(filePath);
  return true;
}

function emptyIndex(userDir, dataset) {
  return {
    exportedAt: new Date().toISOString(),
    userDir,
    dataset,
    status: "empty",
    counts: {
      totalItemsFromApi: 0,
      childrenFetched: 0,
    },
    dataQuality: {
      note:
        "Created by complete-umbraco-user-shape.mjs so every profile has logs, payouts, purchases, shows, and stats folders. No existing export data was overwritten.",
    },
  };
}

function emptyErrors(dataset) {
  if (dataset === "payouts") {
    return {
      invoiceResolveErrors: { count: 0, sample: [] },
      otherErrors: { count: 0, sample: [] },
    };
  }

  return {
    count: 0,
    sample: [],
  };
}

function emptyInvoiceMatch() {
  return {
    matched: [],
    unmatched: [],
    invoiceEntityErrors: [],
  };
}

function emptyMediaMatch() {
  return {
    matched: [],
    unmatched: [],
    mediaResolveErrors: [],
  };
}

function emptyStatsMatch() {
  return {
    matchedShows: [],
    showsWithoutStats: [],
    statsMediaWithoutShow: [],
  };
}

function minimalFullValues(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    id: item.id ?? null,
    key: item.key || "",
    udi: item.udi || "",
    name: item.name || "",
    createDate: item.createDate || "",
    updateDate: item.updateDate || "",
    fullValues: item.fullValues || {},
    fullValueRows: item.fullValueRows || [],
  }));
}

async function completeDataset(userDir, dataset, changes) {
  const spec = DATASETS[dataset];
  const datasetDir = path.join(USERS_DIR, userDir, dataset);
  await mkdir(datasetDir, { recursive: true });

  const itemsPath = path.join(datasetDir, "items.json");
  const showsPath = path.join(datasetDir, "shows.json");
  const fullValuesPath = path.join(datasetDir, "full-values.json");

  const existingItems = await readJsonIfExists(itemsPath, null);
  const existingShows = await readJsonIfExists(showsPath, null);
  const items = Array.isArray(existingItems)
    ? existingItems
    : Array.isArray(existingShows)
      ? existingShows
      : [];

  for (const fileName of spec.jsonFiles) {
    const filePath = path.join(datasetDir, fileName);
    let value = [];

    if (fileName === "items.json") value = items;
    else if (fileName === "shows.json") value = dataset === "shows" ? items : [];
    else if (fileName === "full-values.json") value = minimalFullValues(items);
    else if (fileName === "errors.json") value = emptyErrors(dataset);
    else if (fileName === "index.json") value = emptyIndex(userDir, dataset);
    else if (fileName === "invoice-match.json") value = emptyInvoiceMatch();
    else if (fileName === "media-match.json") value = emptyMediaMatch();
    else if (fileName === "stats-match.json") value = emptyStatsMatch();
    else if (fileName === "field-catalog.json") value = {};
    else if (fileName === "fields-by-item.json") value = [];
    else if (fileName === "media.json") value = [];

    await writeJsonIfMissing(filePath, value, changes);
  }

  for (const [fileName, headers] of Object.entries(spec.csvFiles)) {
    await writeCsvIfMissing(path.join(datasetDir, fileName), headers, changes);
  }

  if (dataset === "logs" && !(await exists(fullValuesPath))) {
    await writeJsonIfMissing(fullValuesPath, minimalFullValues(items), changes);
  }
}

async function main() {
  await mkdir(RUNS_DIR, { recursive: true });
  const entries = await readdir(USERS_DIR, { withFileTypes: true });
  const userDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  const changes = [];
  const perUser = [];

  for (const userDir of userDirs) {
    const before = changes.length;
    for (const dataset of Object.keys(DATASETS)) {
      await completeDataset(userDir, dataset, changes);
    }
    perUser.push({
      userDir,
      filesCreated: changes.length - before,
    });
  }

  const report = {
    completedAt: new Date().toISOString(),
    users: userDirs.length,
    filesCreated: changes.length,
    perUser,
    files: changes,
  };

  const reportPath = path.join(
    RUNS_DIR,
    `shape-completion-${report.completedAt.replace(/[:.]/g, "-")}.json`,
  );
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(path.join(RUNS_DIR, "shape-completion-latest.json"), `${JSON.stringify(report, null, 2)}\n`);

  console.log(JSON.stringify({ reportPath, users: report.users, filesCreated: report.filesCreated }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

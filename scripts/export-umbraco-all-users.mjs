#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const BASE_URL = "https://kiibee.dk";
const CHILDREN_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Content/GetChildren`;
const USERS_ROOT_ID = 1067;
const USERS_DIR = "umbraco-data/users";
const RUNS_DIR = "umbraco-data/export-runs";

const TASKS = {
  stats: {
    script: "scripts/export-umbraco-collection.mjs",
    folder: "stats",
    parentMatchers: [/^stats$/i],
    dataFiles: ["items.json", "index.json"],
    config: (userDir, parentId) => ({
      parentId,
      collectionName: "stats",
      outDir: path.join(USERS_DIR, userDir, "stats"),
      includeProperties: ["isPlay", "uID", "media"],
      orderBy: "createDate",
      orderDirection: "Descending",
      orderBySystemField: true,
      detailConcurrency: 8,
      fetchDetails: false,
    }),
    after: async (userDir) => normalizeStatsItems(userDir),
  },
  shows: {
    script: "scripts/export-umbraco-shows.mjs",
    folder: "shows",
    parentMatchers: [/^shows$/i, /^show$/i, /^media$/i],
    dataFiles: ["items.json", "shows.json", "index.json"],
    needsFile: (userDir) => path.join(USERS_DIR, userDir, "stats", "items.json"),
    config: (userDir, parentId) => ({
      parentId,
      outDir: path.join(USERS_DIR, userDir, "shows"),
      statsItemsPath: path.join(USERS_DIR, userDir, "stats", "items.json"),
    }),
  },
  purchases: {
    script: "scripts/export-umbraco-purchases.mjs",
    folder: "purchases",
    parentMatchers: [/^purchases$/i],
    dataFiles: ["items.json", "index.json"],
    config: (userDir, parentId) => ({
      parentId,
      outDir: path.join(USERS_DIR, userDir, "purchases"),
      mediaCachePaths: [
        path.join(USERS_DIR, userDir, "stats", "media.json"),
        path.join(USERS_DIR, userDir, "purchases", "media.json"),
      ],
    }),
  },
  payouts: {
    script: "scripts/export-umbraco-payouts.mjs",
    folder: "payouts",
    parentMatchers: [/^payouts$/i],
    dataFiles: ["items.json", "index.json"],
    config: (userDir, parentId) => ({
      parentId,
      outDir: path.join(USERS_DIR, userDir, "payouts"),
    }),
  },
  logs: {
    script: "scripts/export-umbraco-collection.mjs",
    folder: "logs",
    parentMatchers: [/^logs$/i],
    dataFiles: ["items.json", "full-values.json"],
    requireAllDataFiles: true,
    config: (userDir, parentId) => ({
      parentId,
      collectionName: "logs",
      outDir: path.join(USERS_DIR, userDir, "logs"),
      includeProperties: ["isPurchase", "media", "transactionID", "paytype", "acquirer", "price", "fullName", "email"],
      orderBy: "createDate",
      orderDirection: "Descending",
      orderBySystemField: true,
      detailConcurrency: 8,
    }),
    after: async (userDir) => enrichLogs(userDir),
  },
};

async function readStdin() {
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
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
    process.env.UMBRACO_ALL_EXPORT_CONFIG ||
    process.env.UMBRACO_EXPORT_CONFIG ||
    (!process.stdin.isTTY ? await readStdin() : "");
  const raw = input ? JSON.parse(input) : {};
  const cookie = raw.cookie || process.env.UMB_COOKIE || "";
  const xsrfToken =
    raw.xsrfToken || process.env.UMB_XSRF || parseCookieValue(cookie, "UMB-XSRF-TOKEN");

  if (!cookie) throw new Error("Missing cookie. Pass cookie in config or UMB_COOKIE.");
  if (!xsrfToken) throw new Error("Missing xsrfToken and no UMB-XSRF-TOKEN cookie was found.");

  const tasks = Array.isArray(raw.tasks) && raw.tasks.length ? raw.tasks : Object.keys(TASKS);
  const requestedUsers = Array.isArray(raw.users) ? raw.users : [];

  return {
    cookie,
    xsrfToken,
    tasks,
    requestedUsers,
    pageSize: Number(raw.pageSize || 100),
    reverseUsers: Boolean(raw.reverseUsers),
    startIndex: Number.isFinite(Number(raw.startIndex)) ? Number(raw.startIndex) : 0,
    endIndex: Number.isFinite(Number(raw.endIndex)) ? Number(raw.endIndex) : null,
    localOnly: raw.localOnly ?? false,
    skipExisting: raw.skipExisting ?? true,
    stopOnAuthError: raw.stopOnAuthError ?? true,
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
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    },
  });
  const body = stripJsonPrefix(await response.text());
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${body.slice(0, 300)}`);
  return JSON.parse(body);
}

function pagedItems(payload) {
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.Items)) return payload.Items;
  if (Array.isArray(payload)) return payload;
  return [];
}

function totalItems(payload, fallback) {
  return Number(payload?.totalItems ?? payload?.TotalItems ?? payload?.total ?? fallback);
}

async function fetchChildren(parentId, config) {
  const children = [];
  let pageNumber = 1;
  let totalPages = 1;

  do {
    const url = new URL(CHILDREN_API);
    url.searchParams.set("id", String(parentId));
    url.searchParams.set("includeProperties", "");
    url.searchParams.set("pageNumber", String(pageNumber));
    url.searchParams.set("pageSize", String(config.pageSize));
    url.searchParams.set("orderBy", "SortOrder");
    url.searchParams.set("orderDirection", "Ascending");
    url.searchParams.set("orderBySystemField", "true");
    url.searchParams.set("filter", "");

    const payload = await requestJson(url, config);
    const items = pagedItems(payload);
    children.push(...items);
    const total = totalItems(payload, children.length);
    totalPages = total > 0 ? Math.ceil(total / config.pageSize) : 1;
    pageNumber += 1;
  } while (pageNumber <= totalPages);

  return children;
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function nodeId(node) {
  return firstDefined(node?.id, node?.Id, node?.contentId, node?.ContentId);
}

function nodeName(node) {
  return String(firstDefined(node?.name, node?.Name, ""));
}

function nodeAlias(node) {
  return String(firstDefined(node?.contentTypeAlias, node?.ContentTypeAlias, ""));
}

function nodeUrls(node) {
  const urls = firstDefined(node?.urls, node?.Urls, []);
  return Array.isArray(urls) ? urls : [];
}

function removeDiacritics(value) {
  return String(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function compareKey(value) {
  return removeDiacritics(value)
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/gi, "")
    .toLowerCase();
}

function dirNameFromUser(node) {
  const name = nodeName(node) || nodeUrls(node)[0]?.split("/").filter(Boolean)[0] || `user-${nodeId(node)}`;
  return removeDiacritics(name)
    .replace(/&/g, "and")
    .replace(/[<>:"/\\|?*\u0000-\u001f]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120);
}

function liveUserKeys(node) {
  const slug = nodeUrls(node)[0]?.split("/").filter(Boolean)[0] || "";
  return [nodeName(node), slug].map(compareKey).filter(Boolean);
}

async function localUserDirs() {
  try {
    const entries = await readdir(USERS_DIR, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
}

function findExistingDir(node, dirs) {
  const keys = liveUserKeys(node);
  return dirs.find((dir) => keys.includes(compareKey(dir)));
}

function findParent(task, childNodes) {
  return childNodes.find((node) => {
    const name = nodeName(node);
    const alias = nodeAlias(node);
    return task.parentMatchers.some((matcher) => matcher.test(name) || matcher.test(alias));
  });
}

async function fileHasData(filePath) {
  try {
    const info = await stat(filePath);
    if (info.size === 0) return false;

    const text = await readFile(filePath, "utf8");
    const trimmed = text.trim();
    if (!trimmed) return false;

    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.length > 0;
    if (parsed && typeof parsed === "object") {
      if (Array.isArray(parsed.items)) return parsed.items.length > 0;
      if (Array.isArray(parsed.Items)) return parsed.Items.length > 0;
      if (Array.isArray(parsed.children)) return parsed.children.length > 0;
      if (Array.isArray(parsed.Children)) return parsed.Children.length > 0;
    }

    return true;
  } catch {
    return false;
  }
}

async function taskHasData(userDir, task) {
  if (task.requireAllDataFiles) {
    for (const fileName of task.dataFiles) {
      if (!(await fileHasData(path.join(USERS_DIR, userDir, task.folder, fileName)))) return false;
    }
    return true;
  }

  for (const fileName of task.dataFiles) {
    if (await fileHasData(path.join(USERS_DIR, userDir, task.folder, fileName))) return true;
  }
  return false;
}

async function normalizeStatsItems(userDir) {
  const filePath = path.join(USERS_DIR, userDir, "stats", "items.json");
  let items;
  try {
    items = JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return { normalizedStatsItems: 0 };
  }
  if (!Array.isArray(items)) return { normalizedStatsItems: 0 };

  let changed = 0;
  const normalized = items.map((item) => {
    const fields = item?.fields || {};
    const mediaUdi = item.mediaUdi || fields.media || "";
    const next = {
      ...item,
      isPlay: item.isPlay ?? fields.isPlay ?? "",
      uID: item.uID ?? fields.uID ?? "",
      mediaUdi,
      mediaKey: item.mediaKey || udiToKey(mediaUdi),
    };
    if (next.mediaUdi !== item.mediaUdi || next.isPlay !== item.isPlay || next.uID !== item.uID) {
      changed += 1;
    }
    return next;
  });

  if (changed > 0) {
    await writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`);
  }
  return { normalizedStatsItems: changed };
}

function udiToKey(udi) {
  const value = String(udi || "")
    .replace(/^umb:\/\/(document|media)\//i, "")
    .replaceAll("-", "")
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

function runScript(script, scriptConfig) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [script], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (code) => resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() }));
    child.stdin.end(JSON.stringify(scriptConfig));
  });
}

function runScriptArgs(script, args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [script, ...args], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (code) => resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() }));
  });
}

async function enrichLogs(userDir) {
  const logDir = path.join(USERS_DIR, userDir, "logs");
  const referenceCandidates = [
    path.join(USERS_DIR, userDir, "purchases", "media.json"),
    path.join(USERS_DIR, userDir, "stats", "media.json"),
  ];

  let referencePath = "";
  for (const candidate of referenceCandidates) {
    try {
      await stat(candidate);
      referencePath = candidate;
      break;
    } catch {
      // Try the next reference cache.
    }
  }

  if (!referencePath) {
    return { enrichedLogs: false, reason: "reference media cache missing" };
  }

  const result = await runScriptArgs("scripts/add-umbraco-log-full-values.mjs", [
    logDir,
    referencePath,
  ]);

  return {
    enrichedLogs: result.code === 0,
    output: parseStdoutJson(result.stdout),
    stderr: result.stderr,
  };
}

function parseStdoutJson(stdout) {
  try {
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

function resultLine(result) {
  const prefix = result.status === "ok" ? "ok" : result.status;
  return `[${prefix}] ${result.userDir}${result.task ? ` ${result.task}` : ""}${result.reason ? `: ${result.reason}` : ""}`;
}

async function writeReport(paths, report) {
  const text = `${JSON.stringify(report, null, 2)}\n`;
  await writeFile(paths.reportPath, text);
  await writeFile(paths.latestPath, text);
}

async function main() {
  const config = await readConfig();
  await mkdir(RUNS_DIR, { recursive: true });

  const startedAt = new Date();
  const runId = startedAt.toISOString().replace(/[:.]/g, "-");
  const paths = {
    reportPath: path.join(RUNS_DIR, `${runId}.json`),
    latestPath: path.join(RUNS_DIR, "latest.json"),
  };
  const report = {
    startedAt: startedAt.toISOString(),
    finishedAt: null,
    rootId: USERS_ROOT_ID,
    tasks: config.tasks,
    skipExisting: config.skipExisting,
    counts: { ok: 0, skipped: 0, error: 0 },
    users: [],
    results: [],
  };

  await writeReport(paths, report);

  const dirs = await localUserDirs();
  let liveUsers = await fetchChildren(USERS_ROOT_ID, config);
  if (config.localOnly) {
    liveUsers = dirs
      .map((dir) => liveUsers.find((node) => liveUserKeys(node).includes(compareKey(dir))))
      .filter(Boolean);
  }
  if (config.reverseUsers) liveUsers = liveUsers.reverse();
  liveUsers = liveUsers.slice(config.startIndex, config.endIndex ?? undefined);
  report.liveUserCount = liveUsers.length;
  console.log(`Live users from Umbraco: ${liveUsers.length}`);

  for (const userNode of liveUsers) {
    const liveName = nodeName(userNode);
    const userId = nodeId(userNode);
    const matchedDir = findExistingDir(userNode, dirs);
    const userDir = matchedDir || dirNameFromUser(userNode);

    if (config.requestedUsers.length && !config.requestedUsers.includes(userDir) && !config.requestedUsers.includes(liveName)) {
      continue;
    }

    await mkdir(path.join(USERS_DIR, userDir), { recursive: true });
    report.users.push({ userDir, liveName, userId });
    console.log(`\n[user] ${userDir} (${userId})`);

    let childNodes;
    try {
      childNodes = await fetchChildren(userId, config);
    } catch (error) {
      const result = { userDir, liveName, userId, status: "error", reason: error.message };
      report.results.push(result);
      report.counts.error += 1;
      console.log(resultLine(result));
      await writeReport(paths, report);
      if (config.stopOnAuthError && /HTTP (401|403)/.test(error.message)) break;
      continue;
    }

    let userRanTask = false;
    for (const taskName of config.tasks) {
      const task = TASKS[taskName];
      if (!task) {
        const result = { userDir, liveName, userId, task: taskName, status: "skipped", reason: "unknown task" };
        report.results.push(result);
        report.counts.skipped += 1;
        console.log(resultLine(result));
        continue;
      }

      if (config.skipExisting && (await taskHasData(userDir, task))) {
        const result = { userDir, liveName, userId, task: taskName, status: "skipped", reason: "data already exists" };
        report.results.push(result);
        report.counts.skipped += 1;
        console.log(`  ${resultLine(result)}`);
        continue;
      }

      const parent = findParent(task, childNodes);
      const parentId = nodeId(parent);
      if (!parentId) {
        const result = { userDir, liveName, userId, task: taskName, status: "skipped", reason: "section not found in Umbraco" };
        report.results.push(result);
        report.counts.skipped += 1;
        console.log(`  ${resultLine(result)}`);
        continue;
      }

      if (task.needsFile && !(await fileHasData(task.needsFile(userDir)))) {
        const result = { userDir, liveName, userId, task: taskName, parentId, status: "skipped", reason: "required stats data missing" };
        report.results.push(result);
        report.counts.skipped += 1;
        console.log(`  ${resultLine(result)}`);
        continue;
      }

      const scriptConfig = {
        cookie: config.cookie,
        xsrfToken: config.xsrfToken,
        ...task.config(userDir, parentId),
      };

      userRanTask = true;
      console.log(`  [run] ${taskName} parent=${parentId}`);
      const startedTaskAt = new Date().toISOString();
      const scriptResult = await runScript(task.script, scriptConfig);
      const after = scriptResult.code === 0 && task.after ? await task.after(userDir) : null;
      const status = scriptResult.code === 0 ? "ok" : "error";
      const result = {
        userDir,
        liveName,
        userId,
        task: taskName,
        parentId,
        status,
        startedAt: startedTaskAt,
        finishedAt: new Date().toISOString(),
        output: parseStdoutJson(scriptResult.stdout),
        after,
        stderr: scriptResult.stderr,
      };
      report.results.push(result);
      report.counts[status] += 1;
      console.log(`  ${resultLine(result)}`);
      await writeReport(paths, report);

      if (status === "error" && config.stopOnAuthError && /HTTP (401|403)/.test(scriptResult.stderr)) {
        report.finishedAt = new Date().toISOString();
        await writeReport(paths, report);
        throw new Error(`Stopping after auth error in ${userDir} ${taskName}`);
      }
    }

    if (!userRanTask) {
      console.log(`  [skip] ${userDir}: all requested data already exists or no matching sections`);
    }
    await writeReport(paths, report);
  }

  report.finishedAt = new Date().toISOString();
  await writeReport(paths, report);
  console.log(JSON.stringify({ reportPath: paths.reportPath, latestPath: paths.latestPath, counts: report.counts }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

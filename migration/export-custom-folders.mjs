#!/usr/bin/env node

import { spawn } from "node:child_process";
import { access, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import config from "./config.mjs";

const BASE_URL = "https://kiibee.dk";
const CHILDREN_API = `${BASE_URL}/umbraco/backoffice/UmbracoApi/Content/GetChildren`;
const USERS_ROOT_ID = 1067;
const SYSTEM_FOLDERS = new Set(["stats", "log", "logs", "invoice", "invoices", "payout", "payouts", "purchase", "purchases", "subscriber", "subscribers"]);

const clean = (value) => String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "").toLowerCase();
const safe = (value) => String(value || "unnamed").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[<>:"/\\|?*\u0000-\u001f]+/g, "_").replace(/\s+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").slice(0, 120);
const idOf = (node) => node?.id ?? node?.Id;
const nameOf = (node) => String(node?.name ?? node?.Name ?? "");

async function safeWriteFile(filePath, data) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try { await rm(filePath, { force: true }); } catch {}
    try {
      await writeFile(filePath, data);
      return;
    } catch (error) {
      if (attempt === 5) throw error;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
}

let auth;

function parseCookies(text) {
  const wanted = new Set(["UMB_UCONTEXT", "UMB-XSRF-TOKEN", "UMB-XSRF-V"]);
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
      const separator = part.indexOf("=");
      if (separator < 1) continue;
      const name = part.slice(0, separator).trim();
      if (wanted.has(name)) values.set(name, part.slice(separator + 1).trim());
    }
  }
  const missing = [...wanted].filter((name) => !values.get(name));
  if (missing.length) throw new Error(`Missing cookies in ${config.cookiesFile}: ${missing.join(", ")}`);
  return {
    cookie: [...wanted].map((name) => `${name}=${values.get(name)}`).join("; "),
    xsrfToken: values.get("UMB-XSRF-TOKEN"),
  };
}

function validateConfig() {
  if (!config.cookiesFile) throw new Error("Set cookiesFile in migration/config.mjs");
  if (!Array.isArray(config.users) || !config.users.length) throw new Error("Add at least one user to config.users");
}

async function requestJson(url) {
  const response = await fetch(url, { headers: { accept: "application/json, text/plain, */*", cookie: auth.cookie, referer: `${BASE_URL}/umbraco`, origin: BASE_URL, "x-requested-with": "XMLHttpRequest", "x-umb-xsrf-token": auth.xsrfToken } });
  const text = (await response.text()).replace(/^\)\]\}',\s*/, "");
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

async function children(parentId) {
  const all = [];
  let page = 1;
  while (true) {
    const url = new URL(CHILDREN_API);
    Object.entries({ id: parentId, includeProperties: "", pageNumber: page, pageSize: 100, orderBy: "SortOrder", orderDirection: "Ascending", orderBySystemField: "true", filter: "" }).forEach(([key, value]) => url.searchParams.set(key, String(value)));
    const body = await requestJson(url);
    const items = body.items ?? body.Items ?? [];
    all.push(...items);
    const total = Number(body.totalItems ?? body.TotalItems ?? all.length);
    if (all.length >= total || !items.length) return all;
    page += 1;
  }
}

function findUser(liveUsers, requested) {
  const wanted = clean(requested.replace(/\([^)]*@[^)]*\)/g, ""));
  if (wanted === "puplika") {
    const publika = liveUsers.find((node) => clean(nameOf(node)) === "publika");
    return { user: publika || null, ambiguous: [] };
  }
  const exact = liveUsers.find((node) => clean(nameOf(node)) === wanted);
  if (exact) return { user: exact, ambiguous: [] };
  const prefix = liveUsers.filter((node) => {
    const actual = clean(nameOf(node));
    if (actual.startsWith(wanted)) return true;
    return wanted.startsWith(actual) && Math.abs(wanted.length - actual.length) <= 3;
  });
  if (prefix.length === 1) return { user: prefix[0], ambiguous: [] };
  return { user: null, ambiguous: prefix.map((node) => nameOf(node)) };
}

function isSkipped(userDir, liveName) {
  const keys = new Set((config.skipProfileKeys || []).map(clean));
  return keys.has(clean(userDir)) || keys.has(clean(liveName));
}

function runCollection(folderId, folderName, outDir) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["scripts/export-umbraco-collection.mjs"], { cwd: path.resolve(import.meta.dirname, ".."), stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "", stderr = "";
    child.stdout.on("data", (chunk) => stdout += chunk);
    child.stderr.on("data", (chunk) => stderr += chunk);
    child.on("close", (code) => resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() }));
    child.stdin.end(JSON.stringify({ cookie: auth.cookie, xsrfToken: auth.xsrfToken, parentId: folderId, collectionName: folderName, outDir, fetchDetails: true, detailConcurrency: 8 }));
  });
}

async function main() {
  validateConfig();
  const cookieCandidates = [
    config.cookiesFile,
    "migration/cookies.txt",
    "migration/cookies.example.txt",
  ].filter((value, index, all) => value && all.indexOf(value) === index);
  const cookieErrors = [];
  for (const candidate of cookieCandidates) {
    try {
      auth = parseCookies(await readFile(path.resolve(candidate), "utf8"));
      console.log(`Using cookies from ${candidate}`);
      break;
    } catch (error) {
      cookieErrors.push(`${candidate}: ${error.message}`);
    }
  }
  if (!auth) throw new Error(`No valid cookie file found.\n${cookieErrors.join("\n")}`);
  if (process.argv.includes("--check-cookies")) {
    console.log("Cookie table parsed successfully.");
    return;
  }
  const liveUsers = await children(USERS_ROOT_ID);
  const report = { startedAt: new Date().toISOString(), users: [], missingUsers: [] };

  for (const requested of config.users) {
    const selection = typeof requested === "string" ? { name: requested, folders: [] } : requested;
    if (!selection?.name) { console.log("[skipped] User entry has no name"); continue; }
    const { user, ambiguous } = findUser(liveUsers, selection.name);
    if (!user) {
      const userDir = safe(selection.name);
      const status = ambiguous.length ? "ambiguous" : "missing";
      const result = { requestedName: selection.name, liveName: null, userId: null, status, folderCount: 0, folders: [], ambiguous: ambiguous.length ? ambiguous : undefined };
      if (status === "missing") {
        const contentDir = path.join(config.outputDir || "umbraco-data/users", userDir, "content");
        await mkdir(contentDir, { recursive: true });
        await safeWriteFile(path.join(contentDir, "index.json"), `${JSON.stringify(result, null, 2)}\n`);
      }
      report.missingUsers.push(selection.name);
      report.users.push(result);
      console.log(`[${status}] ${selection.name}${ambiguous.length ? ` candidates=${ambiguous.join(", ")}` : " (empty local content folder created)"}`);
      continue;
    }
    const userName = nameOf(user);
    const userDir = safe(userName);
    if (isSkipped(userDir, userName)) {
      const result = { requestedName: selection.name, liveName: userName, userId: idOf(user), status: "skipped", reason: "skip list", folderCount: 0, folders: [] };
      report.users.push(result);
      console.log(`[skipped] ${userName}`);
      continue;
    }
    const directChildren = await children(idOf(user));
    const wantedFolders = (selection.folders || []).map(clean);
    const folders = directChildren.filter((node) => !SYSTEM_FOLDERS.has(clean(nameOf(node))) && (!wantedFolders.length || wantedFolders.includes(clean(nameOf(node)))));
    const foundFolderKeys = new Set(folders.map((node) => clean(nameOf(node))));
    const missingFolders = (selection.folders || []).filter((name) => !foundFolderKeys.has(clean(name)));
    const result = { requestedName: selection.name, liveName: userName, userId: idOf(user), status: "found", folderCount: folders.length, missingFolders, folders: [] };

    for (const folder of folders) {
      const folderName = nameOf(folder), outDir = path.join(config.outputDir || "umbraco-data/users", userDir, "content", safe(folderName));
      if (!config.overwrite) { try { await access(path.join(outDir, "index.json")); result.folders.push({ name: folderName, id: idOf(folder), status: "skipped" }); continue; } catch {} }
      const run = await runCollection(idOf(folder), folderName, outDir);
      const status = run.code === 0 ? "ok" : "error";
      result.folders.push({ name: folderName, id: idOf(folder), status, error: run.stderr || undefined });
      console.log(`[${status}] ${userName} / ${folderName}`);
    }
    const contentDir = path.join(config.outputDir || "umbraco-data/users", userDir, "content");
    await mkdir(contentDir, { recursive: true });
    await safeWriteFile(path.join(contentDir, "index.json"), `${JSON.stringify(result, null, 2)}\n`);
    report.users.push(result);
  }

  report.finishedAt = new Date().toISOString();
  await mkdir("umbraco-data/export-runs", { recursive: true });
  await safeWriteFile("umbraco-data/export-runs/custom-folders-latest.json", `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Done: ${report.users.length} users, ${report.users.reduce((sum, user) => sum + user.folderCount, 0)} folders`);
}

main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const USERS_DIR = 'umbraco-data/users';

function toCsvValue(val) {
  if (val === undefined || val === null) return '""';
  if (typeof val === 'object') {
    return `"${JSON.stringify(val).replaceAll('"', '""')}"`;
  }
  const str = String(val);
  return `"${str.replaceAll('"', '""')}"`;
}

function generateCsv(items, columns) {
  const headerRow = columns.join(',');
  const dataRows = items.map((item) => {
    return columns
      .map((col) => {
        const fields = item.fields || item.properties || {};
        const val = item[col] !== undefined ? item[col] : fields[col];
        return toCsvValue(val);
      })
      .join(',');
  });
  return [headerRow, ...dataRows].join('\n') + '\n';
}

const BASE_CSV_COLUMNS = [
  'id',
  'key',
  'udi',
  'name',
  'contentTypeAlias',
  'published',
  'hasPublishedVersion',
  'createDate',
  'updateDate',
  'publishDate',
  'releaseDate',
  'removeDate',
  'ownerName',
  'ownerId',
  'updaterName',
  'updaterId',
  'parentId',
  'sortOrder',
  'urls',
];

const SHOW_CSV_COLUMNS = [
  'id',
  'key',
  'udi',
  'name',
  'title',
  'orderID',
  'hidden',
  'published',
  'hasPublishedVersion',
  'createDate',
  'updateDate',
  'publishDate',
  'releaseDate',
  'removeDate',
  'ownerName',
  'ownerId',
  'updaterName',
  'updaterId',
  'urls',
  'statsEntryCount',
  'statsPlayCount',
  'statsNonPlayCount',
  'firstStatAt',
  'lastStatAt',
  'videoID',
  'videoStatus',
  'videoThumbnailURL',
  'videoDownloadURL',
  'thumbnail',
  'thumbnailCrops',
  'thumbnailWide',
  'thumbnailHigh',
  'year',
  'length',
  'rentalPrice',
  'purchasePrice',
  'tags',
  'description',
];

async function enrichUserDirectory(userDir) {
  const detailsMap = new Map();

  // 1. Gather all raw details/children-pages for this user
  async function collectDetails(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await collectDetails(fullPath);
      } else if (entry.name === 'details.json' || entry.name === 'children-pages.json') {
        try {
          const content = JSON.parse(await readFile(fullPath, 'utf8'));
          if (Array.isArray(content)) {
            for (const item of content) {
              if (item?.id) detailsMap.set(String(item.id), item);
              if (item?.key) detailsMap.set(String(item.key).toLowerCase(), item);
            }
          } else if (typeof content === 'object') {
            for (const [key, item] of Object.entries(content)) {
              if (item?.id) detailsMap.set(String(item.id), item);
              if (item?.key) detailsMap.set(String(item.key).toLowerCase(), item);
              detailsMap.set(String(key), item);
            }
          }
        } catch {}
      }
    }
  }

  await collectDetails(userDir);

  let updatedFilesCount = 0;

  // 2. Process items.json and shows.json files
  async function processJsonFiles(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await processJsonFiles(fullPath);
      } else if (entry.name === 'items.json' || entry.name === 'shows.json') {
        try {
          const rawText = await readFile(fullPath, 'utf8');
          const items = JSON.parse(rawText);
          if (!Array.isArray(items)) continue;

          let modified = false;

          for (const item of items) {
            const detail =
              detailsMap.get(String(item.id)) ||
              detailsMap.get(String(item.key).toLowerCase()) ||
              null;

            // Dates
            const publishDate = detail?.publishDate || item.publishDate || '';
            const releaseDate = detail?.releaseDate ?? item.releaseDate ?? null;
            const removeDate = detail?.removeDate ?? item.removeDate ?? null;
            const createDate = item.createDate || detail?.createDate || '';
            const updateDate = item.updateDate || detail?.updateDate || '';

            // Creator / Owner
            const ownerObj = detail?.owner || item.owner || null;
            const ownerName = ownerObj?.name || item.ownerName || '';
            const ownerId = ownerObj?.id !== undefined ? ownerObj.id : (item.ownerId ?? null);

            const updaterObj = detail?.updater || item.updater || null;
            const updaterName = updaterObj?.name || item.updaterName || '';
            const updaterId = updaterObj?.id !== undefined ? updaterObj.id : (item.updaterId ?? null);

            item.createDate = createDate;
            item.updateDate = updateDate;
            item.publishDate = publishDate;
            item.releaseDate = releaseDate;
            item.removeDate = removeDate;
            item.owner = ownerObj;
            item.ownerName = ownerName;
            item.ownerId = ownerId;
            item.updater = updaterObj;
            item.updaterName = updaterName;
            item.updaterId = updaterId;

            // Image Thumbnail and Crops
            const fields = item.fields || item.properties || {};
            const thumbVal = fields.thumbnail || item.thumbnail || '';
            const thumbSrc =
              typeof thumbVal === 'string' ? thumbVal : thumbVal?.src || thumbVal?.Src || '';

            if (thumbSrc) {
              const wideUrl = `${thumbSrc}?crop=Wide`;
              const highUrl = `${thumbSrc}?crop=High`;
              const crops = [
                { alias: 'Wide', width: 1920, height: 1080, url: wideUrl },
                { alias: 'High', width: 650, height: 920, url: highUrl },
              ];

              item.thumbnail = thumbSrc;
              item.thumbnailCrops = crops;
              item.thumbnailWide = wideUrl;
              item.thumbnailHigh = highUrl;

              if (item.fields) {
                item.fields.thumbnail = thumbSrc;
                item.fields.thumbnailCrops = crops;
                item.fields.thumbnailWide = wideUrl;
                item.fields.thumbnailHigh = highUrl;
              }
              if (item.properties) {
                item.properties.thumbnail = thumbSrc;
                item.properties.thumbnailCrops = crops;
                item.properties.thumbnailWide = wideUrl;
                item.properties.thumbnailHigh = highUrl;
              }
            }

            modified = true;
          }

          if (modified) {
            await writeFile(fullPath, JSON.stringify(items, null, 2) + '\n');
            updatedFilesCount++;

            // Regenerate CSV
            const isShows = entry.name === 'shows.json';
            const csvName = isShows ? 'shows.csv' : 'items.csv';
            const csvPath = path.join(dir, csvName);

            // Dynamically collect extra custom property keys for CSV
            const extraKeys = new Set();
            for (const item of items) {
              const fields = item.fields || item.properties || {};
              for (const k of Object.keys(fields)) extraKeys.add(k);
            }

            const baseCols = isShows ? SHOW_CSV_COLUMNS : BASE_CSV_COLUMNS;
            const allCols = [...baseCols];
            for (const k of extraKeys) {
              if (!allCols.includes(k)) allCols.push(k);
            }

            const csvContent = generateCsv(items, allCols);
            await writeFile(csvPath, csvContent);
          }
        } catch (err) {
          console.error(`Error processing ${fullPath}:`, err.message);
        }
      }
    }
  }

  await processJsonFiles(userDir);
  return updatedFilesCount;
}

async function main() {
  const users = await readdir(USERS_DIR, { withFileTypes: true });
  let totalUsersProcessed = 0;
  let totalFilesUpdated = 0;

  for (const user of users) {
    if (!user.isDirectory()) continue;
    const userDirPath = path.join(USERS_DIR, user.name);
    const count = await enrichUserDirectory(userDirPath);
    totalUsersProcessed++;
    totalFilesUpdated += count;
  }

  console.log(`Enrichment complete! Processed ${totalUsersProcessed} user directories, updated ${totalFilesUpdated} dataset files.`);
}

main().catch(console.error);

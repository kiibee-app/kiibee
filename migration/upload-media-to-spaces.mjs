import { existsSync, readdirSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const serverRequire = createRequire(
  path.join(repoRoot, 'apps/server/package.json'),
);
const { PutObjectCommand, S3Client, HeadObjectCommand } = serverRequire(
  '@aws-sdk/client-s3',
);
const dotenv = serverRequire('dotenv');

dotenv.config({ path: path.join(repoRoot, 'apps/server/.env') });

const USERS_ROOT = path.join(repoRoot, 'umbraco-data', 'users');
const CDN_BASE =
  process.env.PUBLIC_MEDIA_CDN_URL?.replace(/\/$/, '') ||
  `https://${process.env.DO_BUCKET}.${process.env.DO_REGION}.cdn.digitaloceanspaces.com`;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const onlyProfiles = args.filter((a) => !a.startsWith('--'));

const bucket = process.env.DO_BUCKET;
const region = process.env.DO_REGION;
const accessKeyId = process.env.DO_ACCESS_KEY;
const secretAccessKey = process.env.DO_SECRET_KEY;

if (!bucket || !region || !accessKeyId || !secretAccessKey) {
  console.error('Missing DO_BUCKET / DO_REGION / DO_ACCESS_KEY / DO_SECRET_KEY in apps/server/.env');
  process.exit(1);
}

const s3 = new S3Client({
  region,
  endpoint: `https://${region}.digitaloceanspaces.com`,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
});

const CONTENT_TYPE = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
};

/** Local files are saved as `{mediaId}_{filename}`; Spaces key is `{mediaId}/{filename}`. */
function parseLocalMediaFile(fileName) {
  const match = fileName.match(/^(\d+)_(.+)$/);
  if (!match) return null;
  return { mediaId: match[1], fileName: match[2], key: `${match[1]}/${match[2]}` };
}

function encodeSpacesKey(key) {
  return key
    .split('/')
    .map((segment) => {
      if (!segment) return '';
      let decoded = segment;
      try {
        decoded = decodeURIComponent(segment);
      } catch {
        // keep raw
      }
      return encodeURIComponent(decoded.normalize('NFD'));
    })
    .join('/');
}

async function objectExists(key) {
  const encoded = encodeSpacesKey(key);
  const cdnUrl = `https://${bucket}.${region}.cdn.digitaloceanspaces.com/${encoded}`;
  try {
    const res = await fetch(cdnUrl, { method: 'HEAD' });
    if (res.ok) return true;
  } catch {
    // fall through to HeadObject
  }

  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    return true;
  } catch (error) {
    if (
      error?.$metadata?.httpStatusCode === 404 ||
      error?.$metadata?.httpStatusCode === 403 ||
      error?.name === 'NotFound'
    ) {
      return false;
    }
    throw error;
  }
}

async function uploadFile(localPath, key) {
  const ext = path.extname(key).toLowerCase();
  const contentType = CONTENT_TYPE[ext] || 'application/octet-stream';
  const body = await readFile(localPath);

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: 'public-read',
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  return `https://${bucket}.${region}.cdn.digitaloceanspaces.com/${encodeSpacesKey(key)}`;
}

function collectLocalMediaFiles(profileDir) {
  const dirs = [
    path.join(profileDir, 'media'),
    path.join(profileDir, 'profile-info', 'media'),
  ];
  const byKey = new Map();

  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      if (!statSync(full).isFile()) continue;
      const parsed = parseLocalMediaFile(name);
      if (!parsed) continue;
      if (!byKey.has(parsed.key)) {
        byKey.set(parsed.key, { ...parsed, localPath: full });
      }
    }
  }

  return [...byKey.values()];
}

async function main() {
  const profiles = existsSync(USERS_ROOT)
    ? readdirSync(USERS_ROOT, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .filter((name) => (onlyProfiles.length ? onlyProfiles.includes(name) : true))
    : [];

  if (!profiles.length) {
    console.error('No profiles found', { USERS_ROOT, onlyProfiles });
    process.exit(1);
  }

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  console.log(
    `Uploading Umbraco media → Spaces (${bucket}/${region})${dryRun ? ' [dry-run]' : ''}`,
  );

  for (const profile of profiles) {
    const files = collectLocalMediaFiles(path.join(USERS_ROOT, profile));
    if (!files.length) continue;

    console.log(`\n${profile} (${files.length} local media files)`);

    for (const file of files) {
      const key = file.key;
      const cdnUrl = `https://kiibee-bucket.lon1.cdn.digitaloceanspaces.com/${encodeSpacesKey(key)}`;

      try {
        const exists = force ? false : await objectExists(key);
        if (exists) {
          skipped += 1;
          console.log(`  skip  ${key}`);
          continue;
        }

        if (dryRun) {
          console.log(`  would-upload  ${key}  ← ${path.basename(file.localPath)}`);
          uploaded += 1;
          continue;
        }

        await uploadFile(file.localPath, key);
        uploaded += 1;
        console.log(`  ok    ${key}`);
        console.log(`        ${cdnUrl}`);
      } catch (error) {
        failed += 1;
        console.error(`  FAIL  ${key}:`, error.message || error);
      }
    }
  }

  console.log(`\nDone. uploaded=${uploaded} skipped=${skipped} failed=${failed}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

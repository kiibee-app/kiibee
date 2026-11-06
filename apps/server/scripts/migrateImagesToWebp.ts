/**
 * Prepare: pnpm media:webp --out /tmp/kiibee-webp
 * Apply prepared copies to local DB: pnpm media:webp --out /tmp/kiibee-webp --apply
 * Production additionally requires --allow-remote-db. Originals are never overwritten.
 * Rollback uses the same journal: pnpm media:webp --out /tmp/kiibee-webp --rollback
 */
import 'dotenv/config';
import pg from 'pg';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { s3 } from '../src/services/s3.client';
import {
  optimizePublicImage,
  PUBLIC_IMAGE_MAX_BYTES,
} from '../src/modules/media/utils/optimizePublicImage';

const fields = {
  media_files: ['thumbnail_url', 'thumbnail_landscape_url'],
  collections: ['cover_image_url'],
  creator_channels: ['cover_image_url', 'logo_url'],
  content_appearance: [
    'desktop_cover_image_url',
    'mobile_cover_image_url',
    'logo_url',
  ],
  users: ['avatar_url'],
  tutorial_items: ['thumbnail_url'],
  live_events: ['thumbnail_url'],
} as const;
type Reference = { table: string; column: string; id: string; oldUrl: string };
type Entry = {
  source: string;
  references: Reference[];
  status: 'ready' | 'failed';
  key?: string;
  url?: string;
  inputBytes?: number;
  outputBytes?: number;
  error?: string;
};
type Journal = {
  version: 1;
  database: string;
  entries: Entry[];
  skipped: number;
  updated?: number;
  conflicts?: number;
};
const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
const outputDir = resolve(
  outIndex < 0 ? join(tmpdir(), 'kiibee-webp-migration') : args[outIndex + 1],
);
const journalPath = join(outputDir, 'journal.json');
const database = process.env.DATABASE_URL;
if (!database) throw new Error('DATABASE_URL is required');
const dbUrl = new URL(database);
const localDb = ['localhost', '127.0.0.1', '[::1]'].includes(dbUrl.hostname);
const writing = args.includes('--apply') || args.includes('--rollback');
if (writing && !localDb && !args.includes('--allow-remote-db')) {
  throw new Error(
    'Remote database writes require --allow-remote-db after reviewing the journal',
  );
}
if (args.includes('--apply') && args.includes('--rollback'))
  throw new Error('Choose apply or rollback');
const client = new pg.Client({ connectionString: database });
const dbIdentity = `${dbUrl.hostname}:${dbUrl.port || '5432'}${dbUrl.pathname}`;

function publicSource(value: string): string | null {
  const bucket = process.env.DO_BUCKET;
  const region = process.env.DO_REGION;
  if (!bucket || !region)
    throw new Error('DO_BUCKET and DO_REGION are required');
  let url: URL;
  try {
    url = new URL(value, 'https://kiibee.dk');
  } catch {
    return null;
  }
  if (
    url.protocol !== 'https:' ||
    url.search ||
    url.hash ||
    url.username ||
    url.password ||
    url.port
  )
    return null;
  const originHost = `${bucket}.${region}.digitaloceanspaces.com`;
  const cdnHost = `${bucket}.${region}.cdn.digitaloceanspaces.com`;
  let path = url.pathname;
  if (
    ['kiibee.dk', 'www.kiibee.dk'].includes(url.hostname) &&
    path.startsWith('/media/')
  )
    path = path.slice(6);
  else if (![originHost, cdnHost].includes(url.hostname)) return null;
  if (path.startsWith('/images/webp-v1/')) return null;
  try {
    path = path
      .split('/')
      .map((segment) =>
        encodeURIComponent(decodeURIComponent(segment).normalize('NFD')),
      )
      .join('/');
  } catch {
    return null;
  }
  // Known legacy Kiibee bucket has an active CDN; other buckets retain their origin.
  const host =
    bucket === 'kiibee-bucket' && region === 'lon1' ? cdnHost : originHost;
  return `https://${host}${path}`;
}

async function download(source: string): Promise<Buffer> {
  const response = await fetch(source, {
    signal: AbortSignal.timeout(90_000),
    redirect: 'error',
  });
  if (!response.ok || !response.body)
    throw new Error(`Source returned HTTP ${response.status}`);
  if (Number(response.headers.get('content-length')) > PUBLIC_IMAGE_MAX_BYTES) {
    await response.body.cancel();
    throw new Error('Source exceeds 50 MB');
  }
  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.length;
      if (size > PUBLIC_IMAGE_MAX_BYTES)
        throw new Error('Source exceeds 50 MB');
      chunks.push(Buffer.from(part.value));
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(chunks);
}

async function save(journal: Journal) {
  await writeFile(journalPath, JSON.stringify(journal, null, 2), {
    mode: 0o600,
  });
}

async function prepare(): Promise<Journal> {
  const sources = new Map<string, Reference[]>();
  let skipped = 0;
  for (const [table, columns] of Object.entries(fields)) {
    for (const column of columns) {
      const { rows } = await client.query<{ id: string; url: string }>(
        `SELECT id, "${column}" AS url FROM "${table}" WHERE "${column}" IS NOT NULL AND btrim("${column}") <> '' ORDER BY id`,
      );
      for (const row of rows) {
        const source = publicSource(row.url.trim());
        if (!source) {
          skipped++;
          continue;
        }
        const refs = sources.get(source) ?? [];
        refs.push({ table, column, id: row.id, oldUrl: row.url });
        sources.set(source, refs);
      }
    }
  }
  console.log(
    JSON.stringify({
      uniqueImages: sources.size,
      references: [...sources.values()].reduce((n, refs) => n + refs.length, 0),
      skipped,
      localDatabase: localDb,
    }),
  );
  const journal: Journal = {
    version: 1,
    database: dbIdentity,
    entries: [],
    skipped,
  };
  if (args.includes('--inventory')) return journal;
  // Reuse successfully prepared files after an interrupted preparation.
  const previous = await readFile(journalPath, 'utf8')
    .then((s) => JSON.parse(s) as Journal)
    .catch(() => null);
  let completed = 0;
  for (const [source, references] of sources) {
    const cached =
      previous?.database === dbIdentity
        ? previous.entries.find(
            (e) => e.source === source && e.status === 'ready',
          )
        : undefined;
    if (
      cached?.key &&
      (await readFile(join(outputDir, cached.key.split('/').pop()!))
        .then(() => true)
        .catch(() => false))
    ) {
      journal.entries.push({ ...cached, references });
    } else {
      try {
        const original = await download(source);
        const converted = await optimizePublicImage(original);
        const hash = createHash('sha256').update(converted).digest('hex');
        const key = `images/webp-v1/${hash}.webp`;
        await writeFile(join(outputDir, `${hash}.webp`), converted);
        journal.entries.push({
          source,
          references,
          status: 'ready',
          key,
          url: `https://${process.env.DO_BUCKET}.${process.env.DO_REGION}.digitaloceanspaces.com/${key}`,
          inputBytes: original.length,
          outputBytes: converted.length,
        });
      } catch (error) {
        journal.entries.push({
          source,
          references,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Conversion failed',
        });
      }
    }
    await save(journal);
    if (++completed % 10 === 0 || completed === sources.size)
      console.log(
        JSON.stringify({
          prepared: completed,
          total: sources.size,
          failed: journal.entries.filter((e) => e.status === 'failed').length,
        }),
      );
  }
  return journal;
}

async function apply(journal: Journal, rollback: boolean) {
  if (journal.version !== 1 || journal.database !== dbIdentity)
    throw new Error('Journal belongs to a different database');
  let updated = 0;
  let conflicts = 0;
  for (const entry of journal.entries) {
    if (entry.status !== 'ready' || !entry.key || !entry.url) continue;
    if (!/^images\/webp-v1\/[a-f0-9]{64}\.webp$/.test(entry.key))
      throw new Error('Invalid journal image key');
    for (const ref of entry.references) {
      if (
        !(
          fields[ref.table as keyof typeof fields] as
            | readonly string[]
            | undefined
        )?.includes(ref.column)
      )
        throw new Error('Invalid journal field');
    }
    if (!rollback) {
      const body = await readFile(join(outputDir, entry.key.split('/').pop()!));
      const hash = createHash('sha256').update(body).digest('hex');
      if (entry.key !== `images/webp-v1/${hash}.webp`)
        throw new Error('Prepared image checksum mismatch');
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.DO_BUCKET!,
          Key: entry.key,
          Body: body,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
          ACL: 'public-read',
        }),
      );
      // Verify the new object through its public URL before changing any reference.
      const response = await fetch(entry.url, {
        method: 'HEAD',
        redirect: 'error',
        signal: AbortSignal.timeout(20_000),
      });
      if (
        !response.ok ||
        !response.headers.get('content-type')?.includes('image/webp')
      )
        throw new Error('Uploaded WebP failed public verification');
    }
    for (const ref of entry.references) {
      const from = rollback ? entry.url : ref.oldUrl;
      const to = rollback ? ref.oldUrl : entry.url;
      const result = await client.query(
        `UPDATE "${ref.table}" SET "${ref.column}" = $1 WHERE id = $2 AND "${ref.column}" = $3`,
        [to, ref.id, from],
      );
      updated += result.rowCount ?? 0;
      if (!result.rowCount) {
        const current = await client.query(
          `SELECT "${ref.column}" AS url FROM "${ref.table}" WHERE id = $1`,
          [ref.id],
        );
        if (current.rows[0]?.url !== to) conflicts++;
      }
    }
    journal.updated = updated;
    journal.conflicts = conflicts;
    await save(journal);
  }
  console.log(
    JSON.stringify({
      mode: rollback ? 'rollback' : 'apply',
      updated,
      conflicts,
    }),
  );
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  await client.connect();
  try {
    if (writing) {
      const journal: Journal = JSON.parse(await readFile(journalPath, 'utf8'));
      await apply(journal, args.includes('--rollback'));
    } else {
      const journal = await prepare();
      const ready = journal.entries.filter((e) => e.status === 'ready');
      console.log(
        JSON.stringify({
          mode: 'prepare',
          converted: ready.length,
          failed: journal.entries.filter((e) => e.status === 'failed').length,
          skipped: journal.skipped,
          inputBytes: ready.reduce((n, e) => n + (e.inputBytes ?? 0), 0),
          outputBytes: ready.reduce((n, e) => n + (e.outputBytes ?? 0), 0),
          journal: journalPath,
        }),
      );
    }
  } finally {
    await client.end();
  }
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Migration failed');
  process.exitCode = 1;
});

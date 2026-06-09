import { eq } from 'drizzle-orm';

import { db } from '../db';
import {
  analyticsDailySummary,
  analyticsEvents,
  auditLogs,
  mediaFiles,
  users,
} from '../schema';
import {
  batchInsert,
  deterministicUuid,
  findUmbracoUsersRoot,
  isEnabled,
  loadProfileKeys,
  mediaKeyFromUdi,
  parseDate,
  profileUserId,
  readItemsFile,
  resolveMediaFileId,
  textOrNull,
  umbracoSeedUuid,
  type JsonRecord,
} from './umbracoSeed.helpers';

type DailySummaryKey = string;

type DailySummaryAggregate = {
  creatorId: string;
  mediaFileId: string;
  date: string;
  views: number;
  clicks: number;
  downloads: number;
  playStarts: number;
};

const BATCH_SIZE = 500;

function resolveStatsMediaKey(entry: JsonRecord): string | null {
  const directKey = textOrNull(entry.mediaKey);
  if (directKey) {
    return directKey.toLowerCase();
  }

  const fields = (entry.fields as JsonRecord | undefined) ?? {};
  const fromFields = mediaKeyFromUdi(fields.media);
  if (fromFields) {
    return fromFields.toLowerCase();
  }

  return mediaKeyFromUdi(entry.mediaUdi)?.toLowerCase() ?? null;
}

function resolveEventType(entry: JsonRecord): 'view' | 'play_start' | 'click' {
  const fields = (entry.fields as JsonRecord | undefined) ?? {};
  const isPlay = isEnabled(entry.isPlay) || isEnabled(fields.isPlay);

  if (isPlay) {
    return 'play_start';
  }

  return 'view';
}

function dailySummaryKey(
  creatorId: string,
  mediaFileId: string,
  date: string,
): DailySummaryKey {
  return `${creatorId}:${mediaFileId}:${date}`;
}

export const seedUmbracoStats = async () => {
  const root = findUmbracoUsersRoot();
  if (!root) {
    console.log(
      'Umbraco stats seed skipped (umbraco-data/users not found; set UMBRACO_DATA_USERS_PATH to override)',
    );
    return;
  }

  const existingMediaIds = new Set(
    (await db.select({ id: mediaFiles.id }).from(mediaFiles)).map(
      (row) => row.id,
    ),
  );

  const existingCreatorIds = new Set(
    (
      await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, 'creator'))
    ).map((row) => row.id),
  );

  const pendingEvents: (typeof analyticsEvents.$inferInsert)[] = [];
  const dailySummaryMap = new Map<DailySummaryKey, DailySummaryAggregate>();

  let profilesProcessed = 0;
  let eventsProcessed = 0;
  let eventsSkipped = 0;

  for (const profileKey of loadProfileKeys(root)) {
    const creatorId = profileUserId(profileKey);
    if (!existingCreatorIds.has(creatorId)) {
      continue;
    }

    const stats = readItemsFile(profileKey, root, 'stats');
    if (!stats?.length) {
      continue;
    }

    profilesProcessed += 1;

    for (const entry of stats) {
      const entryKey = textOrNull(entry.key)?.toLowerCase();
      const mediaKey = resolveStatsMediaKey(entry);
      const mediaFileId = mediaKey
        ? resolveMediaFileId(profileKey, mediaKey)
        : null;

      if (!entryKey || !mediaFileId || !existingMediaIds.has(mediaFileId)) {
        eventsSkipped += 1;
        continue;
      }

      const createdAt = parseDate(entry.createDate) ?? new Date();
      const eventType = resolveEventType(entry);
      const eventId = umbracoSeedUuid('stats-event', profileKey, entryKey);
      const dateKey = createdAt.toISOString().slice(0, 10);
      const summaryKey = dailySummaryKey(creatorId, mediaFileId, dateKey);
      const summary =
        dailySummaryMap.get(summaryKey) ??
        ({
          creatorId,
          mediaFileId,
          date: dateKey,
          views: 0,
          clicks: 0,
          downloads: 0,
          playStarts: 0,
        } satisfies DailySummaryAggregate);

      if (eventType === 'play_start') {
        summary.playStarts += 1;
      } else {
        summary.views += 1;
      }

      dailySummaryMap.set(summaryKey, summary);

      pendingEvents.push({
        id: eventId,
        creatorId,
        mediaFileId,
        eventType,
        createdAt,
      });

      eventsProcessed += 1;
    }
  }

  await batchInsert(pendingEvents, BATCH_SIZE, async (batch) => {
    await db
      .insert(analyticsEvents)
      .values(batch)
      .onConflictDoNothing({ target: analyticsEvents.id });
  });

  const summaryRows = [...dailySummaryMap.values()].map((summary) => {
    const now = new Date();
    return {
      id: deterministicUuid(
        `umbraco-stats-summary:${summary.creatorId}:${summary.mediaFileId}:${summary.date}`,
      ),
      creatorId: summary.creatorId,
      mediaFileId: summary.mediaFileId,
      date: summary.date,
      views: summary.views,
      visits: 0,
      clicks: summary.clicks,
      downloads: summary.downloads,
      rentals: 0,
      purchases: 0,
      revenue: '0.00',
      createdAt: now,
      updatedAt: now,
    } satisfies typeof analyticsDailySummary.$inferInsert;
  });

  await batchInsert(summaryRows, BATCH_SIZE, async (batch) => {
    for (const row of batch) {
      await db
        .insert(analyticsDailySummary)
        .values(row)
        .onConflictDoUpdate({
          target: [
            analyticsDailySummary.creatorId,
            analyticsDailySummary.mediaFileId,
            analyticsDailySummary.collectionId,
            analyticsDailySummary.date,
          ],
          set: {
            views: row.views,
            clicks: row.clicks,
            downloads: row.downloads,
            updatedAt: row.updatedAt,
          },
        });
    }
  });

  await db
    .insert(auditLogs)
    .values({
      id: deterministicUuid('umbraco-stats-seed:summary'),
      action: 'umbraco_stats_seed',
      entityType: 'analytics',
      details: {
        source: 'umbraco-data/stats',
        profilesProcessed,
        eventsProcessed,
        eventsSkipped,
        dailySummaries: summaryRows.length,
      },
      createdAt: new Date(),
    })
    .onConflictDoNothing({ target: auditLogs.id });

  console.log(
    `Umbraco stats seed completed (${eventsProcessed} events, ${summaryRows.length} daily summaries across ${profilesProcessed} profiles, ${eventsSkipped} skipped from ${root})`,
  );
};

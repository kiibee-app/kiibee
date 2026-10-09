import 'dotenv/config';
import { randomUUID } from 'crypto';
import { and, eq, ilike, inArray } from 'drizzle-orm';
import { closeDatabase, db } from '../src/database/db';
import { contentCategories } from '../src/database/schema/content/contentCategories.schema';
import { mediaFileCategories } from '../src/database/schema/content/mediaFileCategories.schema';
import { mediaFiles } from '../src/database/schema/content/mediaFiles.schema';
import { creatorChannels } from '../src/database/schema/creator/creatorChannels.schema';
import { userContentCategory } from '../src/database/schema/users/userContentCategories.shema';

const creatorTargets = [
  {
    nameQuery: '%Eventyr%teat%',
    categoryIds: ['entertainment'],
  },
  {
    nameQuery: '%TANIA ELLIS%',
    categoryIds: ['education'],
  },
  {
    nameQuery: '%Pædagogisk Psykologisk%',
    categoryIds: ['education'],
  },
] as const;

const INSERT_BATCH_SIZE = 500;

async function resolveCreatorTargets() {
  return Promise.all(
    creatorTargets.map(async (target) => {
      const matches = await db
        .select()
        .from(creatorChannels)
        .where(ilike(creatorChannels.name, target.nameQuery));

      if (matches.length !== 1) {
        const matchedNames = matches.map((channel) => channel.name).join(', ');
        throw new Error(
          `Expected exactly one creator for "${target.nameQuery}", found ${matches.length}${matchedNames ? `: ${matchedNames}` : ''}`,
        );
      }

      return { ...target, channel: matches[0] };
    }),
  );
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const resolvedTargets = await resolveCreatorTargets();
  const targetCategoryIds = [
    ...new Set(resolvedTargets.flatMap(({ categoryIds }) => categoryIds)),
  ];
  const existingCategories = await db
    .select({ id: contentCategories.id })
    .from(contentCategories)
    .where(inArray(contentCategories.id, targetCategoryIds));
  const existingCategoryIds = new Set(
    existingCategories.map((category) => category.id),
  );
  const missingCategoryIds = targetCategoryIds.filter(
    (categoryId) => !existingCategoryIds.has(categoryId),
  );

  if (missingCategoryIds.length > 0) {
    throw new Error(
      `Required categories do not exist: ${missingCategoryIds.join(', ')}`,
    );
  }

  const contentCounts = await Promise.all(
    resolvedTargets.map(async ({ channel }) => {
      const contents = await db
        .select({ id: mediaFiles.id })
        .from(mediaFiles)
        .where(
          and(
            eq(mediaFiles.creatorId, channel.creatorId),
            eq(mediaFiles.isDeleted, false),
          ),
        );
      return contents.length;
    }),
  );

  resolvedTargets.forEach(({ channel, categoryIds }, index) => {
    console.log(
      `${dryRun ? '[DRY RUN] ' : ''}${channel.name}: ${contentCounts[index]} content item(s) -> ${categoryIds.join(', ')}`,
    );
  });

  if (dryRun) return;

  await db.transaction(async (tx) => {
    for (const { channel, categoryIds } of resolvedTargets) {
      const contents = await tx
        .select({ id: mediaFiles.id })
        .from(mediaFiles)
        .where(
          and(
            eq(mediaFiles.creatorId, channel.creatorId),
            eq(mediaFiles.isDeleted, false),
          ),
        );
      const contentIds = contents.map((content) => content.id);

      const existingUserCategory = await tx.query.userContentCategory.findFirst({
        where: eq(userContentCategory.userId, channel.creatorId),
      });

      if (existingUserCategory) {
        await tx
          .update(userContentCategory)
          .set({ categoryIds: [...categoryIds], updatedAt: new Date() })
          .where(eq(userContentCategory.userId, channel.creatorId));
      } else {
        await tx.insert(userContentCategory).values({
          id: randomUUID(),
          userId: channel.creatorId,
          categoryIds: [...categoryIds],
        });
      }

      if (contentIds.length === 0) continue;

      await tx
        .delete(mediaFileCategories)
        .where(inArray(mediaFileCategories.mediaFileId, contentIds));

      const assignments = contentIds.flatMap((mediaFileId) =>
        categoryIds.map((categoryId) => ({
          id: randomUUID(),
          mediaFileId,
          categoryId,
        })),
      );

      for (let offset = 0; offset < assignments.length; offset += INSERT_BATCH_SIZE) {
        await tx
          .insert(mediaFileCategories)
          .values(assignments.slice(offset, offset + INSERT_BATCH_SIZE));
      }
    }
  });

  console.log('Creator and content categories synced successfully.');
}

main()
  .catch((error: unknown) => {
    console.error('Error syncing categories:', error);
    process.exitCode = 1;
  })
  .finally(closeDatabase);

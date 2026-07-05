import { and, asc, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { tutorialItems } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success, fail } from 'src/utils/sendResponse';
import { HttpStatus } from '@nestjs/common';

function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === 'string')
      : [];
  } catch {
    return [];
  }
}

function mapVideoItem(item: typeof tutorialItems.$inferSelect) {
  return {
    type: 'video' as const,
    id: item.id,
    title: item.title,
    description: item.description,
    descriptionSecondary: item.descriptionSecondary,
    publisher: item.publisher,
    publishedYear: item.publishedYear,
    duration: item.duration,
    tags: parseTags(item.tags),
    videoUrl: item.videoUrl!,
    trailerUrl: item.trailerUrl,
    sortOrder: item.sortOrder,
  };
}

function mapQuickguideItem(item: typeof tutorialItems.$inferSelect) {
  return {
    type: 'quickguide' as const,
    id: item.id,
    title: item.title,
    pdfUrl: item.pdfUrl!,
    thumbnailUrl: item.thumbnailUrl,
    sortOrder: item.sortOrder,
  };
}

export const getTutorialVideosService = async () => {
  try {
    const rows = await db
      .select()
      .from(tutorialItems)
      .orderBy(asc(tutorialItems.sortOrder));

    const sections = rows.filter((row) => row.type === 'section');
    const children = rows.filter((row) => row.type !== 'section');

    const data = sections.map((section) => {
      const sectionChildren = children.filter(
        (child) => child.parentId === section.id,
      );

      return {
        id: section.id,
        title: section.title,
        sortOrder: section.sortOrder,
        gridMaxWidth: section.gridMaxWidth,
        items: sectionChildren.map((child) =>
          child.type === 'quickguide'
            ? mapQuickguideItem(child)
            : mapVideoItem(child),
        ),
      };
    });

    return success(data, 'Tutorial videos fetched successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Failed to get tutorial videos:', error);
    return fail(
      'Failed to retrieve tutorial videos',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getTutorialVideoByIdService = async (id: string) => {
  try {
    const [video] = await db
      .select()
      .from(tutorialItems)
      .where(and(eq(tutorialItems.id, id), eq(tutorialItems.type, 'video')))
      .limit(1);

    if (!video) {
      return fail('Tutorial video not found', HttpStatus.NOT_FOUND);
    }

    const [section] = video.parentId
      ? await db
          .select()
          .from(tutorialItems)
          .where(
            and(
              eq(tutorialItems.id, video.parentId),
              eq(tutorialItems.type, 'section'),
            ),
          )
          .limit(1)
      : [];

    return success(
      {
        ...mapVideoItem(video),
        section: section
          ? {
              id: section.id,
              title: section.title,
              sortOrder: section.sortOrder,
              gridMaxWidth: section.gridMaxWidth,
            }
          : null,
      },
      'Tutorial video fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to get tutorial video:', error);
    return fail(
      'Failed to retrieve tutorial video',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

import { asc, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { tutorialVideoSections, tutorialVideos } from 'src/database/schema';
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

function mapVideoRow(video: typeof tutorialVideos.$inferSelect) {
  return {
    id: video.id,
    title: video.title,
    description: video.description,
    descriptionSecondary: video.descriptionSecondary,
    publisher: video.publisher,
    publishedYear: video.publishedYear,
    duration: video.duration,
    tags: parseTags(video.tags),
    videoUrl: video.videoUrl,
    trailerUrl: video.trailerUrl,
    sortOrder: video.sortOrder,
  };
}

export const getTutorialVideosService = async () => {
  try {
    const sections = await db
      .select()
      .from(tutorialVideoSections)
      .orderBy(asc(tutorialVideoSections.sortOrder));

    const videos = await db
      .select()
      .from(tutorialVideos)
      .orderBy(asc(tutorialVideos.sortOrder));

    const data = sections.map((section) => ({
      id: section.id,
      title: section.title,
      sortOrder: section.sortOrder,
      gridMaxWidth: section.gridMaxWidth,
      videos: videos
        .filter((video) => video.sectionId === section.id)
        .map(mapVideoRow),
    }));

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
      .from(tutorialVideos)
      .where(eq(tutorialVideos.id, id))
      .limit(1);

    if (!video) {
      return fail('Tutorial video not found', HttpStatus.NOT_FOUND);
    }

    const [section] = await db
      .select()
      .from(tutorialVideoSections)
      .where(eq(tutorialVideoSections.id, video.sectionId))
      .limit(1);

    return success(
      {
        ...mapVideoRow(video),
        section: section ?? null,
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

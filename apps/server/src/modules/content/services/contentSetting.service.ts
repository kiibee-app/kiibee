import { db } from 'src/database/db';
import { contentSettings } from 'src/database/schema';
import { fail, success } from 'src/utils/sendResponse';
import { eq } from 'drizzle-orm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { logger } from 'src/logger/logger';
import { ContentSettingDto } from '../dto/contentSetting.dto';
import { randomUUID } from 'crypto';

export const getContentSettingByUserId = async (userId: string) => {
  try {
    const contentSetting = await db
      .select()
      .from(contentSettings)
      .where(eq(contentSettings.userId, userId))
      .limit(1);

    if (!contentSetting || contentSetting.length === 0) {
      return success(
        {
          userId,
          accessType: 'free',
        },
        'Content setting not found, returning default',
        HttpStatus.OK,
      );
    }
    return success(
      contentSetting[0],
      'Content setting fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching content setting:', error);
    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to fetch content setting',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const createOrUpdateContentSetting = async (
  userId: string,
  contentSettingDto: ContentSettingDto,
) => {
  try {
    const { accessType } = contentSettingDto;

    const existingSetting = await db
      .select()
      .from(contentSettings)
      .where(eq(contentSettings.userId, userId))
      .limit(1);

    if (existingSetting && existingSetting.length > 0) {
      const updatedSetting = await db
        .update(contentSettings)
        .set({ accessType, updatedAt: new Date() })
        .where(eq(contentSettings.userId, userId))
        .returning();

      return success(
        updatedSetting[0],
        'Content setting updated successfully',
        HttpStatus.OK,
      );
    } else {
      const newSetting = await db
        .insert(contentSettings)
        .values({
          id: randomUUID(),
          userId,
          accessType,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return success(
        newSetting[0],
        'Content setting created successfully',
        HttpStatus.CREATED,
      );
    }
  } catch (error) {
    logger.error('Error creating/updating content setting:', error);
    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to create/update content setting',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

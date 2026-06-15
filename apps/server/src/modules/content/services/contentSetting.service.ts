import { db } from 'src/database/db';
import { contentSettings } from 'src/database/schema';
import { fail, success } from 'src/utils/sendResponse';
import { eq } from 'drizzle-orm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { logger } from 'src/logger/logger';
import { ContentSettingDto } from '../dto/contentSetting.dto';
import { randomUUID } from 'crypto';
import { hashAccessPasswords } from 'src/utils/accessPassword';

const toContentSettingResponse = (setting: {
  userId: string;
  accessType: string;
  passwordHash?: string | null;
}) => ({
  userId: setting.userId,
  accessType: setting.accessType,
  hasPassword: Boolean(setting.passwordHash),
});

export const getContentSettingByUserId = async (userId: string) => {
  try {
    const contentSetting = await db
      .select()
      .from(contentSettings)
      .where(eq(contentSettings.userId, userId))
      .limit(1);

    if (!contentSetting || contentSetting.length === 0) {
      return success(
        toContentSettingResponse({
          userId,
          accessType: 'free',
          passwordHash: null,
        }),
        'Content setting not found, returning default',
        HttpStatus.OK,
      );
    }
    return success(
      toContentSettingResponse(contentSetting[0]),
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
    const { accessType, password } = contentSettingDto;

    const existingSetting = await db
      .select()
      .from(contentSettings)
      .where(eq(contentSettings.userId, userId))
      .limit(1);

    const updatePayload: {
      accessType: ContentSettingDto['accessType'];
      updatedAt: Date;
      passwordHash?: string | null;
    } = {
      accessType,
      updatedAt: new Date(),
    };

    if (accessType !== 'set_password') {
      updatePayload.passwordHash = null;
    } else if (password?.trim()) {
      updatePayload.passwordHash = await hashAccessPasswords(password);
    }

    if (existingSetting && existingSetting.length > 0) {
      const updatedSetting = await db
        .update(contentSettings)
        .set(updatePayload)
        .where(eq(contentSettings.userId, userId))
        .returning();

      return success(
        toContentSettingResponse(updatedSetting[0]),
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
          passwordHash:
            accessType === 'set_password' && password?.trim()
              ? await hashAccessPasswords(password)
              : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return success(
        toContentSettingResponse(newSetting[0]),
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

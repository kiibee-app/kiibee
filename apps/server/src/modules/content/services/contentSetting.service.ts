import { db } from 'src/database/db';
import { contentSettings } from 'src/database/schema';
import { fail, success } from 'src/utils/sendResponse';
import { eq } from 'drizzle-orm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { logger } from 'src/logger/logger';
import { ContentSettingDto } from '../dto/contentSetting.dto';
import { randomUUID } from 'crypto';
import {
  hashAccessPasswords,
  getPasswordCount,
} from 'src/utils/accessPassword';

const toContentSettingResponse = (setting: {
  userId: string;
  accessType: string;
  passwordHash?: string | null;
}) => ({
  userId: setting.userId,
  accessType: setting.accessType,
  hasPassword: Boolean(setting.passwordHash),
  passwordCount: getPasswordCount(setting.passwordHash),
});

const parsePasswordHashes = (stored?: string | null): string[] => {
  if (!stored) return [];
  if (!stored.startsWith('[')) return [stored];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter((hash): hash is string => typeof hash === 'string')
      : [stored];
  } catch {
    return [stored];
  }
};

const serializePasswordHashes = (hashes: string[]): string | null => {
  if (hashes.length === 0) return null;
  return hashes.length === 1 ? hashes[0] : JSON.stringify(hashes);
};

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
    const {
      accessType,
      password,
      removePasswordIndexes = [],
    } = contentSettingDto;

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
    } else if (password?.trim() || removePasswordIndexes.length > 0) {
      const removedIndexes = new Set(removePasswordIndexes);
      const existingHashes = parsePasswordHashes(
        existingSetting[0]?.passwordHash,
      ).filter((_, index) => !removedIndexes.has(index));
      const newHashes = parsePasswordHashes(
        password?.trim() ? await hashAccessPasswords(password) : null,
      );
      updatePayload.passwordHash = serializePasswordHashes([
        ...existingHashes,
        ...newHashes,
      ]);
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

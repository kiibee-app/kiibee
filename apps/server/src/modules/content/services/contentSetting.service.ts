import { profilePassId } from 'src/utils/profilePayment';
import { db } from 'src/database/db';
import { contentSettings, collections } from 'src/database/schema';
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
    const [pass] = await db
      .select()
      .from(collections)
      .where(eq(collections.id, profilePassId(userId)))
      .limit(1);
    return success(
      {
        ...toContentSettingResponse(contentSetting[0]),
        buyPrice: pass?.buyPrice ?? null,
        rentPrice: pass?.rentPrice ?? null,
        rentDuration: pass?.rentDuration ?? null,
      },
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

    const paid = accessType === 'paid' || accessType === 'payment';
    if (
      paid &&
      contentSettingDto.buyPrice == null &&
      contentSettingDto.rentPrice == null
    )
      return fail(
        'Set a profile buy price or rent price',
        HttpStatus.BAD_REQUEST,
      );
    if (
      paid &&
      contentSettingDto.rentPrice != null &&
      !contentSettingDto.rentDuration
    )
      return fail('Choose a profile rental period', HttpStatus.BAD_REQUEST);
    return await db.transaction(async (tx) => {
      if (paid) {
        const id = profilePassId(userId);
        const pass = {
          name: 'Channel access',
          slug: id,
          creatorId: userId,
          accessType: 'paid' as const,
          visibility: 'draft' as const,
          isPublished: false,
          buyPrice:
            contentSettingDto.buyPrice == null
              ? null
              : String(contentSettingDto.buyPrice),
          rentPrice:
            contentSettingDto.rentPrice == null
              ? null
              : String(contentSettingDto.rentPrice),
          rentDuration: contentSettingDto.rentDuration ?? null,
          isDeleted: false,
          updatedAt: new Date(),
        };
        await tx
          .insert(collections)
          .values({ id, ...pass })
          .onConflictDoUpdate({ target: collections.id, set: pass });
      }
      const existingSetting = await tx
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
        const updatedSetting = await tx
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
        const newSetting = await tx
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
    });
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

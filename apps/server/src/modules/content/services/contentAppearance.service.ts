import { contentAppearance, creatorChannels, users } from 'src/database/schema';
import { ContentAppearanceDto } from '../dto/contentAppearance.dto';
import { db } from 'src/database/db';
import { randomUUID } from 'crypto';
import { logger } from 'src/logger/logger';
import { HttpException, HttpStatus } from '@nestjs/common';
import { fail, success } from 'src/utils/sendResponse';
import { eq } from 'drizzle-orm';

export const contentAppearanceService = async (
  userId: string,
  dto: ContentAppearanceDto,
) => {
  try {
    const result = await db
      .insert(contentAppearance)
      .values({
        id: randomUUID(),
        userId,
        textColor: dto.textColor,
        buttonColor: dto.buttonColor,
        logoType: dto.logoType,
        logoName: dto.logoName,
        logoUrl: dto.logoUrl,
        description: dto.description,
        layout: dto.layout,

        desktopCoverImageUrl: dto.desktopCoverImageUrl,
        mobileCoverImageUrl: dto.mobileCoverImageUrl,

        receipt: dto.receipt,
        supportEmail: dto.supportEmail,
      })
      .onConflictDoUpdate({
        target: contentAppearance.userId,
        set: {
          textColor: dto.textColor,
          buttonColor: dto.buttonColor,
          logoType: dto.logoType,
          logoName: dto.logoName,
          logoUrl: dto.logoUrl,
          description: dto.description,
          layout: dto.layout,

          desktopCoverImageUrl: dto.desktopCoverImageUrl,
          mobileCoverImageUrl: dto.mobileCoverImageUrl,

          receipt: dto.receipt,
          supportEmail: dto.supportEmail,
        },
      })
      .returning();

    return success(result[0], 'Appearance updated successfully');
  } catch (error) {
    logger.error('Failed to update appearance:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to update appearance',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getContentAppearanceService = async (userId: string) => {
  try {
    const [result] = await db
      .select({
        appearance: contentAppearance,
        channelLogoUrl: creatorChannels.logoUrl,
        channelCoverImageUrl: creatorChannels.coverImageUrl,
        userAvatarUrl: users.avatarUrl,
        accountEmail: users.email,
      })
      .from(users)
      .leftJoin(contentAppearance, eq(contentAppearance.userId, users.id))
      .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
      .where(eq(users.id, userId))
      .limit(1);

    if (!result) {
      return success(null, 'Appearance fetched successfully');
    }

    if (result.appearance) {
      return success(
        {
          ...result.appearance,
          supportEmail:
            result.appearance.supportEmail?.trim() || result.accountEmail,
        },
        'Appearance fetched successfully',
      );
    }

    const fallbackLogoUrl =
      result.channelLogoUrl?.trim() || result.userAvatarUrl?.trim() || null;

    return success(
      {
        logoType: fallbackLogoUrl ? 'picture' : 'text',
        logoUrl: fallbackLogoUrl,
        desktopCoverImageUrl: result.channelCoverImageUrl?.trim() || null,
        supportEmail: result.accountEmail,
      },
      'Appearance fetched successfully',
    );
  } catch (error) {
    logger.error('Failed to fetch appearance:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail('Failed to fetch appearance', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

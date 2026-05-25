import { contentAppearance } from 'src/database/schema';
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
      .select()
      .from(contentAppearance)
      .where(eq(contentAppearance.userId, userId))
      .limit(1);

    return success(result ?? null, 'Appearance fetched successfully');
  } catch (error) {
    logger.error('Failed to fetch appearance:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail('Failed to fetch appearance', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

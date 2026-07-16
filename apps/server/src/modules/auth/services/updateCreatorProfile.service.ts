import { HttpException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

import { db } from 'src/database/db';
import { creatorInfo, creatorBankAccounts, users } from 'src/database/schema';

import { UpdateCreatorProfileDto } from '../dto/updateCreatorProfile.dto';

import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { isValidAvatarUrl } from 'src/utils/constant';

export const updateCreatorProfileService = async (
  userId: string,
  profileData: UpdateCreatorProfileDto,
) => {
  try {
    const {
      firstName,
      lastName,
      avatarUrl,
      companyName,
      phone,
      cvr,
      address,
      city,
      postalCode,
      regNumber,
      accountNumber,
    } = profileData;

    if (
      avatarUrl !== undefined &&
      avatarUrl !== null &&
      avatarUrl !== '' &&
      !isValidAvatarUrl(avatarUrl)
    ) {
      return fail('Invalid profile image data', HttpStatus.BAD_REQUEST);
    }

    const now = new Date();

    await db.transaction(async (trx) => {
      await trx
        .insert(creatorInfo)
        .values({
          id: randomUUID(),
          userId,
          companyName: companyName || '',
          phone: phone || '',
          cvr: cvr || '',
          address: address || '',
          city: city || '',
          postalCode: postalCode || '',
          createdAt: now,
          updatedAt: now,
        } as any)
        .onConflictDoUpdate({
          target: creatorInfo.userId,
          set: {
            phone,
            cvr,
            address,
            companyName,
            city,
            postalCode,
            updatedAt: now,
          },
        });

      await trx
        .insert(creatorBankAccounts)
        .values({
          id: randomUUID(),
          creatorId: userId,
          bankName: 'Default Bank',
          registrationNumber: regNumber || '',
          accountNumber: accountNumber || '',
          createdAt: now,
          updatedAt: now,
        } as any)
        .onConflictDoUpdate({
          target: creatorBankAccounts.creatorId,
          set: {
            registrationNumber: regNumber,
            accountNumber,
            updatedAt: now,
          },
        });

      await trx
        .update(users)
        .set({
          firstName,
          lastName,
          fullName: [firstName, lastName].filter(Boolean).join(' '),
          avatarUrl,
          updatedAt: now,
        })
        .where(eq(users.id, userId));
    });

    return success(
      {
        firstName,
        lastName,
        avatarUrl,
        companyName,
        phone,
        cvr,
        address,
        city,
        postalCode,
        regNumber,
        accountNumber,
      },
      'Creator profile updated successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error updating creator profile', {
      error,
      userId,
      profileData,
    });

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to update creator profile',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

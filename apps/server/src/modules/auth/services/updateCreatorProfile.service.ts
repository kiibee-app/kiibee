import { HttpException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

import { db } from 'src/database/db';
import {
  creatorChannels,
  creatorInfo,
  creatorBankAccounts,
  users,
} from 'src/database/schema';

import { UpdateCreatorProfileDto } from '../dto/updateCreatorProfile.dto';
import { ensureCreatorChannel } from './ensureCreatorChannel.service';

import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { isValidAvatarUrl } from 'src/utils/constant';

function buildFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
): string {
  return [firstName, lastName].filter(Boolean).join(' ').trim();
}

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
      accountHolderName,
      bankName,
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
    const nameChanged = firstName !== undefined || lastName !== undefined;

    let resolvedFirstName: string | null | undefined = firstName;
    let resolvedLastName: string | null | undefined = lastName;
    let resolvedFullName: string | undefined;
    let resolvedCompanyName = companyName;

    await db.transaction(async (trx) => {
      const [currentUser] = await trx
        .select({
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!currentUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      resolvedFirstName =
        firstName !== undefined ? firstName : currentUser.firstName;
      resolvedLastName =
        lastName !== undefined ? lastName : currentUser.lastName;
      resolvedFullName = buildFullName(resolvedFirstName, resolvedLastName);

      const [existingChannel] = await trx
        .select({ name: creatorChannels.name })
        .from(creatorChannels)
        .where(eq(creatorChannels.creatorId, userId))
        .limit(1);

      const [existingInfo] = await trx
        .select({ companyName: creatorInfo.companyName })
        .from(creatorInfo)
        .where(eq(creatorInfo.userId, userId))
        .limit(1);

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

      const hasBankUpdate =
        regNumber !== undefined ||
        accountNumber !== undefined ||
        accountHolderName !== undefined ||
        bankName !== undefined;

      if (hasBankUpdate) {
        await trx
          .insert(creatorBankAccounts)
          .values({
            id: randomUUID(),
            creatorId: userId,
            bankName: bankName || '',
            accountHolderName: accountHolderName || null,
            registrationNumber: regNumber || '',
            accountNumber: accountNumber || '',
            createdAt: now,
            updatedAt: now,
          } as any)
          .onConflictDoUpdate({
            target: creatorBankAccounts.creatorId,
            set: {
              ...(regNumber !== undefined
                ? { registrationNumber: regNumber }
                : {}),
              ...(accountNumber !== undefined ? { accountNumber } : {}),
              ...(accountHolderName !== undefined ? { accountHolderName } : {}),
              ...(bankName !== undefined ? { bankName } : {}),
              updatedAt: now,
            },
          });
      }

      const userUpdates: {
        firstName?: string;
        lastName?: string;
        fullName?: string;
        avatarUrl?: string | null;
        updatedAt: Date;
      } = {
        updatedAt: now,
      };

      if (firstName !== undefined) {
        userUpdates.firstName = firstName;
      }
      if (lastName !== undefined) {
        userUpdates.lastName = lastName;
      }
      if (nameChanged) {
        userUpdates.fullName = resolvedFullName;
      }
      if (avatarUrl !== undefined) {
        userUpdates.avatarUrl = avatarUrl;
      }

      await trx.update(users).set(userUpdates).where(eq(users.id, userId));

      // Keep channel name + slug aligned with the account full name.
      if (resolvedFullName) {
        await ensureCreatorChannel(trx, {
          creatorId: userId,
          channelName: resolvedFullName,
        });
      }

      // Keep company aligned when name changes, or when company was still
      // mirroring the previous channel name (Umbraco / setup default).
      if (resolvedFullName && companyName === undefined) {
        const previousCompany = existingInfo?.companyName?.trim() || '';
        const previousChannel = existingChannel?.name?.trim() || '';
        const shouldSyncCompany =
          nameChanged ||
          !previousCompany ||
          previousCompany === previousChannel;

        if (shouldSyncCompany) {
          resolvedCompanyName = resolvedFullName;
          await trx
            .update(creatorInfo)
            .set({
              companyName: resolvedFullName,
              updatedAt: now,
            })
            .where(eq(creatorInfo.userId, userId));
        }
      }
    });

    return success(
      {
        firstName: resolvedFirstName,
        lastName: resolvedLastName,
        fullName: resolvedFullName,
        avatarUrl,
        companyName: resolvedCompanyName,
        phone,
        cvr,
        address,
        city,
        postalCode,
        regNumber,
        accountNumber,
        accountHolderName,
        bankName,
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

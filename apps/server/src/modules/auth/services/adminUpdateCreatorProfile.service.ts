import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { and, eq, ne, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorChannels,
  creatorInfo,
  creatorOwners,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ROLE } from 'src/utils/constant';
import { fail } from 'src/utils/sendResponse';
import { AdminUpdateCreatorProfileDto } from '../dto/adminUpdateCreatorProfile.dto';
import { ensureCreatorChannel } from './ensureCreatorChannel.service';
import { getCreatorByIdService } from './getCreatorById.service';

async function ensureCreatorOwnersTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "creator_owners" (
      "id" text PRIMARY KEY NOT NULL,
      "creator_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
      "name" varchar(255) NOT NULL,
      "first_name" varchar(255),
      "last_name" varchar(255),
      "email" varchar(255),
      "phone" varchar(50),
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "creator_owners_creator_id_unique" ON "creator_owners" ("creator_id");
    CREATE INDEX IF NOT EXISTS "creator_owners_name_idx" ON "creator_owners" ("name");
  `);
}

function splitName(fullName: string): {
  firstName: string;
  lastName: string | null;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return { firstName: '', lastName: null };
  }
  return {
    firstName: parts[0],
    lastName: parts.length > 1 ? parts.slice(1).join(' ') : null,
  };
}

export const adminUpdateCreatorProfileService = async (
  creatorId: string,
  dto: AdminUpdateCreatorProfileDto,
) => {
  try {
    await ensureCreatorOwnersTable();

    const [existingUser] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        fullName: users.fullName,
      })
      .from(users)
      .where(and(eq(users.id, creatorId), eq(users.role, ROLE.CREATOR)))
      .limit(1);

    if (!existingUser) {
      return fail('Creator not found', HttpStatus.NOT_FOUND);
    }

    const now = new Date();
    const resolvedEmail = dto.email
      ? dto.email.trim().toLowerCase()
      : existingUser.email;

    await db.transaction(async (trx) => {
      // 1. Email uniqueness check
      if (
        dto.email !== undefined &&
        dto.email.trim().toLowerCase() !== existingUser.email
      ) {
        const [conflict] = await trx
          .select({ id: users.id })
          .from(users)
          .where(and(eq(users.email, resolvedEmail), ne(users.id, creatorId)))
          .limit(1);

        if (conflict) {
          throw new HttpException(
            'Email is already in use by another account',
            HttpStatus.CONFLICT,
          );
        }
      }

      // 2. Owner name update
      let nameParts: { firstName: string; lastName: string | null } | null =
        null;
      if (dto.ownerName !== undefined && dto.ownerName.trim()) {
        nameParts = splitName(dto.ownerName);

        await trx
          .insert(creatorOwners)
          .values({
            id: randomUUID(),
            creatorId,
            name: dto.ownerName.trim(),
            firstName: nameParts.firstName,
            lastName: nameParts.lastName,
            email: resolvedEmail,
            phone: dto.phone ?? null,
            createdAt: now,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: creatorOwners.creatorId,
            set: {
              name: dto.ownerName.trim(),
              firstName: nameParts.firstName,
              lastName: nameParts.lastName,
              ...(dto.phone !== undefined ? { phone: dto.phone.trim() } : {}),
              ...(dto.email !== undefined ? { email: resolvedEmail } : {}),
              updatedAt: now,
            },
          });
      }

      // 3. Update User entity
      const userUpdates: Record<string, any> = { updatedAt: now };
      if (dto.email !== undefined) {
        userUpdates.email = resolvedEmail;
      }
      if (nameParts) {
        userUpdates.fullName = dto.ownerName?.trim();
        userUpdates.firstName = nameParts.firstName;
        userUpdates.lastName = nameParts.lastName;
      } else if (dto.firstName !== undefined || dto.lastName !== undefined) {
        if (dto.firstName !== undefined)
          userUpdates.firstName = dto.firstName.trim();
        if (dto.lastName !== undefined)
          userUpdates.lastName = dto.lastName.trim();
        const first = dto.firstName !== undefined ? dto.firstName.trim() : '';
        const last = dto.lastName !== undefined ? dto.lastName.trim() : '';
        userUpdates.fullName = [first, last].filter(Boolean).join(' ').trim();
      }

      if (Object.keys(userUpdates).length > 1) {
        await trx.update(users).set(userUpdates).where(eq(users.id, creatorId));
      }

      // 4. Update channel name if provided
      if (dto.channelName !== undefined && dto.channelName.trim()) {
        await ensureCreatorChannel(trx as any, {
          creatorId,
          channelName: dto.channelName.trim(),
        });
      }

      // 5. Update creator info (company, phone, address, cvr, etc.)
      const hasInfoUpdates =
        dto.companyName !== undefined ||
        dto.phone !== undefined ||
        dto.cvr !== undefined ||
        dto.address !== undefined ||
        dto.city !== undefined ||
        dto.postalCode !== undefined;

      if (hasInfoUpdates) {
        await trx
          .insert(creatorInfo)
          .values({
            id: randomUUID(),
            userId: creatorId,
            companyName: dto.companyName?.trim() ?? '',
            phone: dto.phone?.trim() ?? '',
            cvr: dto.cvr?.trim() ?? '',
            address: dto.address?.trim() ?? '',
            city: dto.city?.trim() ?? '',
            postalCode: dto.postalCode?.trim() ?? '',
            createdAt: now,
            updatedAt: now,
          } as any)
          .onConflictDoUpdate({
            target: creatorInfo.userId,
            set: {
              ...(dto.companyName !== undefined
                ? { companyName: dto.companyName.trim() }
                : {}),
              ...(dto.phone !== undefined ? { phone: dto.phone.trim() } : {}),
              ...(dto.cvr !== undefined ? { cvr: dto.cvr.trim() } : {}),
              ...(dto.address !== undefined
                ? { address: dto.address.trim() }
                : {}),
              ...(dto.city !== undefined ? { city: dto.city.trim() } : {}),
              ...(dto.postalCode !== undefined
                ? { postalCode: dto.postalCode.trim() }
                : {}),
              updatedAt: now,
            },
          });
      }
    });

    return await getCreatorByIdService(creatorId);
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    logger.error('Error in adminUpdateCreatorProfileService', error);
    return fail(
      'Failed to update creator profile',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

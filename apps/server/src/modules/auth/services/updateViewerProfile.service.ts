import { HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { users } from 'src/database/schema';
import { isValidAvatarUrl, ROLE } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

import { UpdateViewerProfileDto } from '../dto/updateViewerProfile.dto';

export const updateViewerProfileService = async (
  userId: string,
  role: string,
  dto: UpdateViewerProfileDto,
) => {
  if (role !== ROLE.VIEWER) {
    return fail('Only viewers can update this profile', HttpStatus.FORBIDDEN);
  }

  const patch: Partial<{
    fullName: string;
    email: string;
    avatarUrl: string | null;
    updatedAt: Date;
  }> = {};

  if (dto.fullName !== undefined) {
    const trimmed = dto.fullName.trim();
    if (!trimmed) {
      return fail('Full name cannot be empty', HttpStatus.BAD_REQUEST);
    }

    patch.fullName = trimmed;
  }

  if (dto.email !== undefined) {
    const normalizedEmail = dto.email.trim().toLowerCase();
    if (!normalizedEmail) {
      return fail('Email cannot be empty', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await db.query.users.findFirst({
      where: and(eq(users.email, normalizedEmail), eq(users.isDeleted, false)),
      columns: { id: true },
    });

    if (existingUser && existingUser.id !== userId) {
      return fail('Email already exists', HttpStatus.CONFLICT);
    }

    patch.email = normalizedEmail;
  }

  if (dto.avatarUrl !== undefined) {
    if (dto.avatarUrl === null || dto.avatarUrl === '') {
      patch.avatarUrl = null;
    } else {
      if (!isValidAvatarUrl(dto.avatarUrl)) {
        return fail('Invalid profile image data', HttpStatus.BAD_REQUEST);
      }

      patch.avatarUrl = dto.avatarUrl;
    }
  }

  if (Object.keys(patch).length === 0) {
    return fail('No updates provided', HttpStatus.BAD_REQUEST);
  }

  patch.updatedAt = new Date();

  const rows = await db
    .update(users)
    .set(patch)
    .where(and(eq(users.id, userId), eq(users.isDeleted, false)))
    .returning({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      avatarUrl: users.avatarUrl,
      isEmailVerified: users.isEmailVerified,
      status: users.status,
    });

  if (rows.length === 0) {
    return fail('User not found', HttpStatus.NOT_FOUND);
  }

  return success(rows[0], 'Profile updated successfully');
};

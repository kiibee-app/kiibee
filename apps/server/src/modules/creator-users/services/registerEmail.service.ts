import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { db } from 'src/database/db';
import { emailSubscribers } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';

export type RegisterEmailDto = {
  creatorId: string;
  email: string;
  name?: string;
  source?: string;
  sourceId?: string;
};

export const registerEmailService = async (dto: RegisterEmailDto) => {
  try {
    const { creatorId, email, name, source, sourceId } = dto;

    if (!creatorId || !email) {
      throw new HttpException(
        'creatorId and email are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name?.trim() || null;
    const now = new Date();

    const [saved] = await db
      .insert(emailSubscribers)
      .values({
        id: randomUUID(),
        creatorId,
        email: trimmedEmail,
        name: trimmedName,
        source: source || 'email_gate',
        sourceId: sourceId || null,
        isActive: true,
        subscribedAt: now,
      })
      .onConflictDoUpdate({
        target: [emailSubscribers.creatorId, emailSubscribers.email],
        set: {
          isActive: true,
          ...(trimmedName ? { name: trimmedName } : {}),
          ...(source ? { source } : {}),
          ...(sourceId ? { sourceId } : {}),
          subscribedAt: now,
          updatedAt: now,
        },
      })
      .returning({ id: emailSubscribers.id });

    return success(
      { id: saved.id },
      'Email registered successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error registering email:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to register email',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

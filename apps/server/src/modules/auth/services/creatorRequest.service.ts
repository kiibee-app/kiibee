import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateCreatorApplicationDto } from '../dto/creatorRequest.dto';
import { db } from 'src/database/db';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { and } from 'drizzle-orm';
import { creatorApplicationRequests } from 'src/database/schema/users/creatorApplicationRequests.schema';
import { users } from 'src/database/schema/users/users.schema';
import { success } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';

export const creatorRequestService = async (
  payload: CreateCreatorApplicationDto,
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      cvr,
      address,
      city,
      postalCode,
      exampleWorkLink,
      contentDescription,
    } = payload;

    const normalizedEmail = email.trim().toLowerCase();
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const [existingUser] = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(and(eq(users.email, normalizedEmail), eq(users.isDeleted, false)))
      .limit(1);

    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const [existingRequest] = await db
      .select()
      .from(creatorApplicationRequests)
      .where(
        and(
          eq(creatorApplicationRequests.email, normalizedEmail),
          eq(creatorApplicationRequests.isDeleted, false),
        ),
      )
      .limit(1);

    if (existingRequest) {
      throw new HttpException(
        'A creator application with this email already exists',
        HttpStatus.CONFLICT,
      );
    }

    const newRequest = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      fullName,
      email: normalizedEmail,
      phone,
      cvr,
      address,
      city,
      postalCode,
      exampleWorkLink,
      contentDescription,
    };

    await db.insert(creatorApplicationRequests).values(newRequest);

    return success(
      null,
      'Creator application submitted successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    logger.error('Error processing creator request:', error);

    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      'Failed to process creator request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

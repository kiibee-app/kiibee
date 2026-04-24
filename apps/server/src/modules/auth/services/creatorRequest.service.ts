import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateCreatorApplicationDto } from '../dto/creatorRequest.dto';
import { db } from 'src/database/db';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { and } from 'drizzle-orm';
import { creatorApplicationRequests } from 'src/database/schema/users/creatorApplicationRequests.schema';
import { fail, success } from 'src/utils/sendResponse';

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

    const fullName = `${firstName} ${lastName}`;

    const [existingRequest] = await db
      .select()
      .from(creatorApplicationRequests)
      .where(
        and(
          eq(creatorApplicationRequests.email, email),
          eq(creatorApplicationRequests.isDeleted, false),
        ),
      )
      .limit(1);

    if (existingRequest) {
      return fail(
        'A creator application with this email already exists',
        HttpStatus.CONFLICT,
      );
    }

    const newRequest = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      fullName,
      email,
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
    console.error('Error processing creator request:', error);

    if (error instanceof HttpException) {
      throw error;
    }
    return fail(
      'Failed to process creator request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

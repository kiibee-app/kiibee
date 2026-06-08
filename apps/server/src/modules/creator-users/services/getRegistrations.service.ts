import { HttpException, HttpStatus } from '@nestjs/common';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import { getRegistrations } from '../data/usersStore';

export const getRegistrationsService = async () => {
  try {
    return success(
      getRegistrations(),
      'Registrations retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching registrations:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to retrieve registrations',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

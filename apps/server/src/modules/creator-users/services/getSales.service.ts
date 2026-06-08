import { HttpException, HttpStatus } from '@nestjs/common';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import { getSales } from '../data/usersStore';

export const getSalesService = async () => {
  try {
    return success(getSales(), 'Sales retrieved successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Error fetching sales:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to retrieve sales',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

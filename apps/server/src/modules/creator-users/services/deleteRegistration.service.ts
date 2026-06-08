import { HttpException, HttpStatus } from '@nestjs/common';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { deleteRegistration } from '../data/usersStore';

export const deleteRegistrationService = async (id: string) => {
  try {
    const deleted = deleteRegistration(id);

    if (!deleted) {
      fail('Registration not found', HttpStatus.NOT_FOUND);
    }

    return success(null, 'Registration deleted successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Error deleting registration:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to delete registration',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

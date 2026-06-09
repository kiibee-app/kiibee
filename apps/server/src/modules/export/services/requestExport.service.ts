import { HttpException, HttpStatus } from '@nestjs/common';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import { exportRegistrationsService } from './exportRegistrations.service';
import { exportSalesService } from './exportSales.service';
import { exportViewsService } from './exportViews.service';

const EXPORT_HANDLERS: Record<
  string,
  (
    creatorId: string,
    startDate?: string,
    endDate?: string,
  ) => Promise<ReturnType<typeof success>>
> = {
  'users-email-signups': exportRegistrationsService,
  sales: exportSalesService,
  views: exportViewsService,
};

export const requestExportService = async (
  creatorId: string,
  type: string,
  startDate?: string,
  endDate?: string,
) => {
  try {
    const handler = EXPORT_HANDLERS[type];

    if (!handler) {
      throw new HttpException('Invalid export type', HttpStatus.BAD_REQUEST);
    }

    return await handler(creatorId, startDate, endDate);
  } catch (error) {
    logger.error('Error generating export:', error);

    if (error instanceof HttpException) throw error;

    throw new HttpException(
      'Failed to generate export',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

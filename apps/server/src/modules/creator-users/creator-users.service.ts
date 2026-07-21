import { Injectable } from '@nestjs/common';
import { deleteRegistrationService } from './services/deleteRegistration.service';
import { getRegistrationsService } from './services/getRegistrations.service';
import { getSalesService } from './services/getSales.service';

@Injectable()
export class CreatorUsersService {
  getRegistrations(creatorId: string) {
    return getRegistrationsService(creatorId);
  }

  getSales(
    creatorId: string,
    params?: { search?: string; page?: number; limit?: number },
  ) {
    return getSalesService(creatorId, params);
  }

  deleteRegistration(creatorId: string, id: string) {
    return deleteRegistrationService(creatorId, id);
  }
}

import { Injectable } from '@nestjs/common';
import { deleteRegistrationService } from './services/deleteRegistration.service';
import { getRegistrationsService } from './services/getRegistrations.service';
import { getSalesService } from './services/getSales.service';

@Injectable()
export class CreatorUsersService {
  getRegistrations() {
    return getRegistrationsService();
  }

  getSales() {
    return getSalesService();
  }

  deleteRegistration(id: string) {
    return deleteRegistrationService(id);
  }
}

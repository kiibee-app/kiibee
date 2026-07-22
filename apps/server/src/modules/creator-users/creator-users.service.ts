import { Injectable } from '@nestjs/common';
import { deleteRegistrationService } from './services/deleteRegistration.service';
import { getRegistrationsService } from './services/getRegistrations.service';
import { getSalesService } from './services/getSales.service';
import {
  registerEmailService,
  RegisterEmailDto,
} from './services/registerEmail.service';

@Injectable()
export class CreatorUsersService {
  registerEmail(dto: RegisterEmailDto) {
    return registerEmailService(dto);
  }

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

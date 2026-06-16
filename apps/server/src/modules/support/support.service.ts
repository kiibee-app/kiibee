import { Injectable } from '@nestjs/common';
import { SubmitSupportContactDto } from './dto/supportContact.dto';
import { submitSupportContactService } from './services/submitSupportContact.service';

@Injectable()
export class SupportService {
  submitContact(payload: SubmitSupportContactDto) {
    return submitSupportContactService(payload);
  }
}

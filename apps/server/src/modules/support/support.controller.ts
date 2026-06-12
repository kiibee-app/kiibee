import { Body, Controller, Post } from '@nestjs/common';
import { SubmitSupportContactDto } from './dto/supportContact.dto';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('contact')
  submitContact(@Body() payload: SubmitSupportContactDto) {
    return this.supportService.submitContact(payload);
  }
}

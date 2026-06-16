import { Injectable } from '@nestjs/common';
import { requestExportService } from './services/requestExport.service';

@Injectable()
export class ExportService {
  requestExport(
    creatorId: string,
    type: string,
    startDate?: string,
    endDate?: string,
  ) {
    return requestExportService(creatorId, type, startDate, endDate);
  }
}

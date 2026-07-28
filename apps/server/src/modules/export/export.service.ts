import { Injectable } from '@nestjs/common';
import { requestExportService } from './services/requestExport.service';
import { sendReceiptService } from './services/sendReceipt.service';

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

  async sendReceiptService(orderId: string) {
    return sendReceiptService(orderId);
  }
}

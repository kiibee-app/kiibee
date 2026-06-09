import { Injectable } from '@nestjs/common';
import { getPurchasedData } from './services/getPurchasedData.service';
import { getRentedData } from './services/getRentedData.service';

@Injectable()
export class ViewerService {
  async getPurchasedDataService(userId: string) {
    return getPurchasedData(userId);
  }

  async getRentedDataService(userId: string) {
    return getRentedData(userId);
  }
}

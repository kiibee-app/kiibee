import { Injectable } from '@nestjs/common';
import { getPurchasedData } from './services/getPurchasedData.service';
import { getRentedData } from './services/getRentedData.service';
import { getExpiredRentedData } from './services/getExpiredRentedData.service';

@Injectable()
export class ViewerService {
  async getPurchasedDataService(userId: string) {
    return getPurchasedData(userId);
  }

  async getRentedDataService(userId: string) {
    return getRentedData(userId);
  }

  async getExpiredRentedDataService(userId: string) {
    return getExpiredRentedData(userId);
  }
}

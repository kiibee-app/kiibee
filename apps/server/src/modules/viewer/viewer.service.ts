import { Injectable } from '@nestjs/common';
import { getPurchasedData } from './services/getPurchasedData.service';
import { getRentedData } from './services/getRentedData.service';
import { getExpiredRentedData } from './services/getExpiredRentedData.service';
import { getPaymentMethodsService } from './services/getPaymentMethods.service';
import { createPaymentMethodService } from './services/createPaymentMethod.service';
import { updatePaymentMethodService } from './services/updatePaymentMethod.service';
import { deletePaymentMethodService } from './services/deletePaymentMethod.service';
import { setDefaultPaymentMethodService } from './services/setDefaultPaymentMethod.service';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from './dto/paymentMethod.dto';

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

  async getPaymentMethods(userId: string) {
    return getPaymentMethodsService(userId);
  }

  async createPaymentMethod(userId: string, dto: CreatePaymentMethodDto) {
    return createPaymentMethodService(userId, dto);
  }

  async updatePaymentMethod(
    userId: string,
    paymentMethodId: string,
    dto: UpdatePaymentMethodDto,
  ) {
    return updatePaymentMethodService(userId, paymentMethodId, dto);
  }

  async deletePaymentMethod(userId: string, paymentMethodId: string) {
    return deletePaymentMethodService(userId, paymentMethodId);
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    return setDefaultPaymentMethodService(userId, paymentMethodId);
  }
}

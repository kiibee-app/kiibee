import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ViewerService } from './viewer.service';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from './dto/paymentMethod.dto';

@Controller('viewer')
export class ViewerController {
  constructor(private readonly viewerService: ViewerService) {}

  @UseGuards(JwtAuthGuard)
  @Get('purchased-data')
  async getPurchasedData(@Req() req: any) {
    const userId = req.user.userId;
    return this.viewerService.getPurchasedDataService(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rented-data')
  async getRentedData(@Req() req: any) {
    const userId = req.user.userId;
    return this.viewerService.getRentedDataService(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('previously-rented-data')
  async getExpiredRentedData(@Req() req: any) {
    const userId = req.user.userId;
    return this.viewerService.getExpiredRentedDataService(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payment-methods')
  async getPaymentMethods(@Req() req: any) {
    return this.viewerService.getPaymentMethods(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('payment-methods')
  async createPaymentMethod(
    @Req() req: any,
    @Body() dto: CreatePaymentMethodDto,
  ) {
    return this.viewerService.createPaymentMethod(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('payment-methods/:id/default')
  async setDefaultPaymentMethod(@Req() req: any, @Param('id') id: string) {
    return this.viewerService.setDefaultPaymentMethod(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('payment-methods/:id')
  async updatePaymentMethod(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdatePaymentMethodDto,
  ) {
    return this.viewerService.updatePaymentMethod(req.user.userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('payment-methods/:id')
  async deletePaymentMethod(@Req() req: any, @Param('id') id: string) {
    return this.viewerService.deletePaymentMethod(req.user.userId, id);
  }
}

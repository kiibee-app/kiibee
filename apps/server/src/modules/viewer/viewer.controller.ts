import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ViewerService } from './viewer.service';

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
}

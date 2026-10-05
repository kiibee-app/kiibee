import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { handleSubscriptionPayment } from './hooks/subscriptionPayWebhook';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  async getAllSubscriptionPlans() {
    return this.subscriptionService.getAllSubscriptionPlans();
  }

  @Post('create')
  async createSubscription(
    @Body() { userId, planId }: { userId: string; planId: string },
  ) {
    return this.subscriptionService.createSubscription(userId, planId);
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any, @Req() req: any) {
    const auth = req.headers['authorization'];

    if (auth !== `Bearer ${process.env.JWT_ACCESS_SECRET}`) {
      throw new HttpException('Unauthorized webhook', HttpStatus.UNAUTHORIZED);
    }

    await handleSubscriptionPayment(body);

    return { received: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('creator/plan')
  async getCreatorPlan(@Req() req: any) {
    const creatorId = req.user.userId;
    return this.subscriptionService.getCreatorPlan(creatorId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteSubscription(@Req() req: any) {
    const userId = req.user.userId;
    return this.subscriptionService.deleteSubscriptionService(userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/creator/:creatorId')
  async getAdminCreatorPlan(@Param('creatorId') creatorId: string) {
    return this.subscriptionService.getAdminCreatorPlan(creatorId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/creator/:creatorId')
  async updateAdminCreatorPlan(
    @Param('creatorId') creatorId: string,
    @Body()
    body: {
      planId: string;
      customPrice: number | null;
      customPrice3: number | null;
      customPrice6: number | null;
      customPrice12: number | null;
      customMaxFiles: number | null;
      customKiibeeCutDkk: number | null;
      customTransactionFeePct: number | null;
      paymentPeriod: string | null;
    },
  ) {
    return this.subscriptionService.updateAdminCreatorPlan(creatorId, body);
  }
}

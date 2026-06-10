import { Module } from '@nestjs/common';
import { CreatorOverviewController } from './creator-overview.controller';
import { CreatorOverviewService } from './creator-overview.service';

@Module({
  controllers: [CreatorOverviewController],
  providers: [CreatorOverviewService],
})
export class CreatorOverviewModule {}

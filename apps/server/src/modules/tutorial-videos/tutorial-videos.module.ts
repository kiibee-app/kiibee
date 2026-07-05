import { Module } from '@nestjs/common';
import { TutorialVideosController } from './tutorial-videos.controller';
import { TutorialVideosService } from './tutorial-videos.service';

@Module({
  controllers: [TutorialVideosController],
  providers: [TutorialVideosService],
})
export class TutorialVideosModule {}

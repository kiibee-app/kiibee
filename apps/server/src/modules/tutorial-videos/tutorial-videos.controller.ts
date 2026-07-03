import { Controller, Get, Param } from '@nestjs/common';
import { TutorialVideosService } from './tutorial-videos.service';

@Controller('tutorial-videos')
export class TutorialVideosController {
  constructor(private readonly tutorialVideosService: TutorialVideosService) {}

  @Get()
  getTutorialVideos() {
    return this.tutorialVideosService.getTutorialVideosService();
  }

  @Get('quickguides')
  getTutorialQuickguides() {
    return this.tutorialVideosService.getTutorialQuickguidesService();
  }

  @Get(':id')
  getTutorialVideoById(@Param('id') id: string) {
    return this.tutorialVideosService.getTutorialVideoByIdService(id);
  }
}

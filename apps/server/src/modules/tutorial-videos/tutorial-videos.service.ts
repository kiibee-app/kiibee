import { Injectable } from '@nestjs/common';
import { getTutorialQuickguidesService } from './services/getTutorialQuickguides.service';
import {
  getTutorialVideoByIdService,
  getTutorialVideosService,
} from './services/getTutorialVideos.service';

@Injectable()
export class TutorialVideosService {
  getTutorialVideosService() {
    return getTutorialVideosService();
  }

  getTutorialQuickguidesService() {
    return getTutorialQuickguidesService();
  }

  getTutorialVideoByIdService(id: string) {
    return getTutorialVideoByIdService(id);
  }
}

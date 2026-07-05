import { Injectable } from '@nestjs/common';
import {
  getTutorialVideoByIdService,
  getTutorialVideosService,
} from './services/getTutorialVideos.service';

@Injectable()
export class TutorialVideosService {
  getTutorialVideosService() {
    return getTutorialVideosService();
  }

  getTutorialVideoByIdService(id: string) {
    return getTutorialVideoByIdService(id);
  }
}

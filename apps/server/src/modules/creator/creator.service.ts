import { Injectable } from '@nestjs/common';
import {
  getCreatorPublicProfileService,
  getExploreCreatorsService,
} from './services/getExploreCreators.service';

@Injectable()
export class CreatorService {
  getExploreCreators(limit?: number) {
    return getExploreCreatorsService(limit);
  }

  getCreatorPublicProfile(creatorId: string) {
    return getCreatorPublicProfileService(creatorId);
  }
}

import { Injectable } from '@nestjs/common';
import {
  getCreatorPublicProfileService,
  getExploreCreatorsService,
} from './services/getExploreCreators.service';
import { topCreatorsService } from './services/topCreators.service';
import { allCreatorsService } from './services/getAllCreators.service';

@Injectable()
export class CreatorService {
  getExploreCreators(limit?: number) {
    return getExploreCreatorsService(limit);
  }

  getCreatorPublicProfile(creatorId: string) {
    return getCreatorPublicProfileService(creatorId);
  }

  getTopCreators() {
    return topCreatorsService();
  }

  getAllCreators({
    limit,
    sortBy,
    search,
  }: {
    limit?: number;
    sortBy?: 'name' | 'subscriberCount' | 'newest' | 'top' | 'featured';
    search?: string;
  }) {
    return allCreatorsService({
      limit,
      sortBy,
      search,
    });
  }
}

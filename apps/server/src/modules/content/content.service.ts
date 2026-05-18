import { createContent } from './services/createContent.service';
import { Injectable } from '@nestjs/common';
import { getContentCategoriesService } from './services/getContentCategories.service';
import { getContentTypesService } from './services/getContentTypes.service';
import { assignUserCategoriesService } from './services/assignUserCategories.service';
import { CreateContentDto } from './content.dto';
import { getContentByCollectionIdService } from './services/getContentByCollectionId.service';

@Injectable()
export class ContentService {
  async getContentCategories() {
    return getContentCategoriesService();
  }
  async getContentTypes() {
    return getContentTypesService();
  }
  async assignUserCategories(payload: {
    userId: string;
    categoryIds: string[];
    typeIds: string[];
  }) {
    return assignUserCategoriesService(payload);
  }

  async createContentService(dto: CreateContentDto, creatorId: string) {
    return createContent(dto, creatorId);
  }

  async getContentByCollectionIdService(id: string) {
    return getContentByCollectionIdService(id);
  }
}

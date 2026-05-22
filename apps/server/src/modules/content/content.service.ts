import { createContent } from './services/createContent.service';
import { Injectable } from '@nestjs/common';
import { getContentCategoriesService } from './services/getContentCategories.service';
import { getContentTypesService } from './services/getContentTypes.service';
import { assignUserCategoriesService } from './services/assignUserCategories.service';
import { CreateContentDto, UpdateContentDto } from './content.dto';
import { getContentByCollectionIdService } from './services/getContentByCollectionId.service';
import { updateContentService } from './services/updateContent.service';
import { getContentByIdService } from './services/getContentById.service';
import { deleteContentService } from './services/delete.content.service';

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

  async updateContentService(
    contentId: string,
    dto: UpdateContentDto,
    creatorId: string,
  ) {
    return updateContentService(contentId, dto, creatorId);
  }

  async getContentByIdService(contentId: string) {
    return getContentByIdService(contentId);
  }

  async deleteContentService(contentId: string) {
    return deleteContentService(contentId);
  }
}

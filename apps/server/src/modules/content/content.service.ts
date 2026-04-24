import { Injectable } from '@nestjs/common';
import { getContentCategoriesService } from './services/getContentCategories.service';
import { getContentTypesService } from './services/getContentTypes.service';
import { assignUserCategoriesService } from './services/assignUserCategories.service';

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
}

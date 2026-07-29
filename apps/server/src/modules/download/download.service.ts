import { Injectable } from '@nestjs/common';
import { contentDownLoad } from './services/contentDownload.service';
import {
  getContentDownloadInfo,
  getContentDownloadLimit,
  setContentDownloadLimit,
} from './services/contentDownloadLimit.service';

@Injectable()
export class DownloadService {
  async getDownloadUrl(userId: string, contentId: string) {
    return contentDownLoad(contentId, userId);
  }

  async getDownloadLimit() {
    return getContentDownloadLimit();
  }

  async setDownloadLimit(maxLimit: number) {
    return setContentDownloadLimit(maxLimit);
  }

  async getContentDownloadInfo(contentId: string, userId: string) {
    return getContentDownloadInfo(contentId, userId);
  }
}

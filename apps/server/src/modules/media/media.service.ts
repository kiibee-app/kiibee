import { Injectable } from '@nestjs/common';
import { CloudflareStreamService } from './services/videoMultipart.service';
import { VideoStreamService } from './services/videoStream.service';
import { VideoDownloadService } from './services/videoDownload.service';
import { FileUploadService } from './services/fileUpload.service';
import { PublicImageUploadService } from './services/publicImageUpload.service';
import { GetMediaByKeyService } from './services/getmediaByKey.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly multipart: CloudflareStreamService,
    private readonly stream: VideoStreamService,
    private readonly download: VideoDownloadService,
    public readonly fileUpload: FileUploadService,
    public readonly images: PublicImageUploadService,
    public readonly getMediaByKey: GetMediaByKeyService,
  ) {}
  createVideoUpload() {
    return this.multipart.createUpload();
  }

  getStreamUrl(videoId: string) {
    return this.stream.getStreamUrl(videoId);
  }

  getDownloadUrl(key: string) {
    return this.download.getDownloadUrl(key);
  }

  uploadPublicImage(file: {
    buffer: Buffer;
    mimetype?: string;
    filename?: string;
  }) {
    return this.images.upload(file);
  }

  getMediaSignedUrl(key: string, options?: any) {
    return this.getMediaByKey.getSignedUrl(key, options);
  }
}
